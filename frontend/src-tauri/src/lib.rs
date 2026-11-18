use std::collections::HashMap;
use std::fs::{self, OpenOptions};
use std::path::PathBuf;
use std::sync::Mutex;
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::{AppHandle, Manager, Runtime};
use tauri_plugin_log::{Builder as LogBuilder, Target, TargetKind};

#[repr(C)]
#[allow(non_snake_case)]
struct DATA_BLOB {
    cbData: u32,
    pbData: *mut u8,
}

#[link(name = "crypt32")]
unsafe extern "system" {
    fn CryptProtectData(
        pDataIn: *const DATA_BLOB,
        szDataDescr: *const u16,
        pOptionalEntropy: *const DATA_BLOB,
        pvReserved: *mut std::ffi::c_void,
        pPromptStruct: *mut std::ffi::c_void,
        dwFlags: u32,
        pDataOut: *mut DATA_BLOB,
    ) -> i32;

    fn CryptUnprotectData(
        pDataIn: *const DATA_BLOB,
        ppszDataDescr: *mut *mut u16,
        pOptionalEntropy: *const DATA_BLOB,
        pvReserved: *mut std::ffi::c_void,
        pPromptStruct: *mut std::ffi::c_void,
        dwFlags: u32,
        pDataOut: *mut DATA_BLOB,
    ) -> i32;

    fn LocalFree(hMem: *mut std::ffi::c_void) -> *mut std::ffi::c_void;
}

const CRYPTPROTECT_UI_FORBIDDEN: u32 = 0x1;

/// Encrypts bytes using Windows DPAPI (User scope)
fn dpapi_encrypt(data: &[u8]) -> Result<Vec<u8>, String> {
    let mut in_blob = DATA_BLOB {
        cbData: data.len() as u32,
        pbData: data.as_ptr() as *mut u8,
    };
    let mut out_blob = DATA_BLOB {
        cbData: 0,
        pbData: std::ptr::null_mut(),
    };

    let success = unsafe {
        CryptProtectData(
            &mut in_blob,
            std::ptr::null(),
            std::ptr::null(),
            std::ptr::null_mut(),
            std::ptr::null_mut(),
            CRYPTPROTECT_UI_FORBIDDEN,
            &mut out_blob,
        )
    };

    if success == 0 {
        return Err("Windows DPAPI encryption failed".to_string());
    }

    let encrypted =
        unsafe { std::slice::from_raw_parts(out_blob.pbData, out_blob.cbData as usize).to_vec() };

    unsafe {
        LocalFree(out_blob.pbData as *mut std::ffi::c_void);
    }

    Ok(encrypted)
}

/// Decrypts bytes using Windows DPAPI (User scope)
fn dpapi_decrypt(encrypted: &[u8]) -> Result<Vec<u8>, String> {
    let mut in_blob = DATA_BLOB {
        cbData: encrypted.len() as u32,
        pbData: encrypted.as_ptr() as *mut u8,
    };
    let mut out_blob = DATA_BLOB {
        cbData: 0,
        pbData: std::ptr::null_mut(),
    };

    let success = unsafe {
        CryptUnprotectData(
            &mut in_blob,
            std::ptr::null_mut(),
            std::ptr::null(),
            std::ptr::null_mut(),
            std::ptr::null_mut(),
            CRYPTPROTECT_UI_FORBIDDEN,
            &mut out_blob,
        )
    };

    if success == 0 {
        return Err("Windows DPAPI decryption failed".to_string());
    }

    let decrypted =
        unsafe { std::slice::from_raw_parts(out_blob.pbData, out_blob.cbData as usize).to_vec() };

    unsafe {
        LocalFree(out_blob.pbData as *mut std::ffi::c_void);
    }

    Ok(decrypted)
}

fn get_vault_path(app: &AppHandle) -> Result<PathBuf, String> {
    let app_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    fs::create_dir_all(&app_dir).map_err(|e| e.to_string())?;
    Ok(app_dir.join("vault.bin"))
}

// In-memory mutex to coordinate concurrent file access
static VAULT_LOCK: Mutex<()> = Mutex::new(());

/// Generate a unique active log filename for this process.
///
/// tauri-plugin-log appends `.log` to the configured file name. Including both
/// the PID and a high-resolution timestamp prevents two application instances
/// from competing for the same active log file while keeping all logs in the
/// normal Tauri app log directory.
fn unique_log_file_stem() -> String {
    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_nanos())
        .unwrap_or_default();
    format!("AJ EcoDrive ERP-{}-{}", std::process::id(), timestamp)
}

/// Preflight the exact file operation used by the log plugin.
///
/// Keeping the probe file is intentional: if the plugin initializes normally,
/// it opens this same empty file in append mode. If it cannot initialize, the
/// file is still a harmless, uniquely named diagnostic artifact and no prior
/// user log is modified or removed.
fn prepare_log_file(log_dir: &std::path::Path, file_stem: &str) -> Result<PathBuf, std::io::Error> {
    fs::create_dir_all(log_dir)?;
    let log_path = log_dir.join(file_stem).with_extension("log");
    OpenOptions::new()
        .create_new(true)
        .write(true)
        .open(&log_path)?;
    Ok(log_path)
}

/// Register logging without allowing a file-system problem to prevent startup.
///
/// The file target is registered dynamically after Tauri resolves the official
/// app log directory. If that directory or file cannot be opened, the plugin
/// is registered with stdout/stderr targets instead, preserving diagnostics and
/// allowing the ERP window to open.
fn configure_logging<R: Runtime>(app: &AppHandle<R>) -> tauri::Result<()> {
    let file_stem = unique_log_file_stem();
    let file_target = app
        .path()
        .app_log_dir()
        .ok()
        .and_then(|log_dir| prepare_log_file(&log_dir, &file_stem).ok())
        .map(|_| {
            Target::new(TargetKind::LogDir {
                file_name: Some(file_stem.clone()),
            })
        });

    let build_plugin = |target: Option<Target>| {
        let mut targets = vec![Target::new(TargetKind::Stdout)];
        if let Some(target) = target {
            targets.push(target);
        } else {
            targets.push(Target::new(TargetKind::Stderr));
        }
        LogBuilder::new().targets(targets).build()
    };

    if file_target.is_none() {
        eprintln!("AJ EcoDrive file logging unavailable; using stdout/stderr fallback");
    }

    if let Err(error) = app.plugin(build_plugin(file_target)) {
        eprintln!(
            "AJ EcoDrive file logger initialization failed: {error}; using stdout/stderr fallback"
        );
        // The fallback contains no file target, so a log directory/file failure
        // cannot prevent the application from completing startup.
        app.plugin(build_plugin(None))?;
    }

    Ok(())
}

#[tauri::command]
fn secure_store_set(app: AppHandle, key: String, value: String) -> Result<(), String> {
    let _guard = VAULT_LOCK.lock().map_err(|e| e.to_string())?;
    let path = get_vault_path(&app)?;

    let mut map: HashMap<String, String> = if path.exists() {
        let raw = fs::read(&path).map_err(|e| e.to_string())?;
        if !raw.is_empty() {
            let decrypted = dpapi_decrypt(&raw)?;
            serde_json::from_slice(&decrypted).unwrap_or_default()
        } else {
            HashMap::new()
        }
    } else {
        HashMap::new()
    };

    map.insert(key, value);

    let serialized = serde_json::to_vec(&map).map_err(|e| e.to_string())?;
    let encrypted = dpapi_encrypt(&serialized)?;
    fs::write(&path, encrypted).map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
fn secure_store_get(app: AppHandle, key: String) -> Result<Option<String>, String> {
    let _guard = VAULT_LOCK.lock().map_err(|e| e.to_string())?;
    let path = get_vault_path(&app)?;

    if !path.exists() {
        return Ok(None);
    }

    let raw = fs::read(&path).map_err(|e| e.to_string())?;
    if raw.is_empty() {
        return Ok(None);
    }

    let decrypted = dpapi_decrypt(&raw)?;
    let map: HashMap<String, String> =
        serde_json::from_slice(&decrypted).map_err(|e| e.to_string())?;

    Ok(map.get(&key).cloned())
}

#[tauri::command]
fn secure_store_remove(app: AppHandle, key: String) -> Result<(), String> {
    let _guard = VAULT_LOCK.lock().map_err(|e| e.to_string())?;
    let path = get_vault_path(&app)?;

    if !path.exists() {
        return Ok(());
    }

    let raw = fs::read(&path).map_err(|e| e.to_string())?;
    if raw.is_empty() {
        return Ok(());
    }

    let decrypted = dpapi_decrypt(&raw)?;
    let mut map: HashMap<String, String> =
        serde_json::from_slice(&decrypted).map_err(|e| e.to_string())?;
    map.remove(&key);

    let serialized = serde_json::to_vec(&map).map_err(|e| e.to_string())?;
    let encrypted = dpapi_encrypt(&serialized)?;
    fs::write(&path, encrypted).map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
fn secure_store_clear(app: AppHandle) -> Result<(), String> {
    let _guard = VAULT_LOCK.lock().map_err(|e| e.to_string())?;
    let path = get_vault_path(&app)?;

    if path.exists() {
        fs::remove_file(&path).map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default().build())
        .setup(|app| {
            configure_logging(app.handle())
                .map_err(|error| Box::new(error) as Box<dyn std::error::Error>)
        })
        .invoke_handler(tauri::generate_handler![
            secure_store_set,
            secure_store_get,
            secure_store_remove,
            secure_store_clear
        ])
        .run(tauri::generate_context!())
        .expect("error while building tauri application");
}

#[cfg(test)]
mod logging_tests {
    use super::{prepare_log_file, unique_log_file_stem};
    use std::fs;
    use std::time::{SystemTime, UNIX_EPOCH};

    fn test_dir(name: &str) -> std::path::PathBuf {
        let stamp = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        std::env::temp_dir().join(format!("aj-ecodrive-log-test-{name}-{stamp}"))
    }

    #[test]
    fn creates_log_directory_and_unique_writable_file() {
        let dir = test_dir("create");
        let stem = unique_log_file_stem();
        let path = prepare_log_file(&dir, &stem).expect("log file should be created");
        assert!(dir.is_dir());
        assert!(path.is_file());
        fs::write(&path, b"startup probe\n").expect("created log file should be writable");
        fs::remove_dir_all(dir).unwrap();
    }

    #[test]
    fn generates_distinct_log_files_for_concurrent_instances() {
        let dir = test_dir("concurrent");
        let first = prepare_log_file(&dir, &unique_log_file_stem()).unwrap();
        let second = prepare_log_file(&dir, &unique_log_file_stem()).unwrap();
        assert_ne!(first, second);
        assert!(first.is_file());
        assert!(second.is_file());
        fs::remove_dir_all(dir).unwrap();
    }

    #[test]
    fn reports_file_initialization_failure_without_touching_existing_file() {
        let dir = test_dir("fallback");
        fs::create_dir_all(&dir).unwrap();
        let blocked_path = dir.join("blocked");
        fs::write(&blocked_path, b"existing log data").unwrap();
        let result = prepare_log_file(&blocked_path, "instance");
        assert!(result.is_err());
        assert_eq!(fs::read(&blocked_path).unwrap(), b"existing log data");
        fs::remove_dir_all(dir).unwrap();
    }
}
