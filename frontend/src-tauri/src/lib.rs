use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;
use std::sync::Mutex;
use tauri::{AppHandle, Manager};

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

    let encrypted = unsafe {
        std::slice::from_raw_parts(out_blob.pbData, out_blob.cbData as usize).to_vec()
    };

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

    let decrypted = unsafe {
        std::slice::from_raw_parts(out_blob.pbData, out_blob.cbData as usize).to_vec()
    };

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
    let map: HashMap<String, String> = serde_json::from_slice(&decrypted).map_err(|e| e.to_string())?;

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
    let mut map: HashMap<String, String> = serde_json::from_slice(&decrypted).map_err(|e| e.to_string())?;
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
        .plugin(tauri_plugin_log::Builder::default().build())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            secure_store_set,
            secure_store_get,
            secure_store_remove,
            secure_store_clear
        ])
        .run(tauri::generate_context!())
        .expect("error while building tauri application");
}
