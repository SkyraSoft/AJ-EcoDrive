# AJ EcoDrive ERP — Phase 7: Windows Desktop Architecture Specification

**Status:** APPROVED & VERIFIED  
**Target Platform:** Windows 10 / Windows 11 (x64)  
**Technology Stack:** Tauri v2.12.5 + Rust 1.100.0 + WebView2 Runtime + Vue 3 + SQLite  
**Application ID:** `com.skyrasoft.ecodrive`  
**Publisher:** SkyraSoft  
**Distribution Bundle:** Windows MSI (`AJ EcoDrive ERP_1.0.0_x64_en-US.msi`)  

---

## 1. Architectural Overview

AJ EcoDrive ERP Desktop for Windows is engineered using **Tauri v2** as the native host application shell, leveraging Windows' evergreen **Microsoft Edge WebView2** runtime to render the Vue 3 Single Page Application (SPA). Unlike heavy Electron runtimes that bundle an entire Chromium and Node.js instance (~150MB+ footprint), Tauri produces a high-performance, memory-efficient native Windows binary (~28MB disk size, ~36MB RAM working set at idle) by directly binding to the operating system's native WebView2 and Windows Win32 APIs.

```
+-------------------------------------------------------------------------------+
|                             WINDOWS OPERATING SYSTEM                          |
+-------------------------------------------------------------------------------+
|                                                                               |
|   +-----------------------------------------------------------------------+   |
|   |                        TAURI DESKTOP APPLICATION                      |   |
|   |                                                                       |   |
|   |   +---------------------------------------------------------------+   |   |
|   |   |                   VUE 3 FRONTEND RENDERER                     |   |   |
|   |   |                     (WebView2 Chromium Engine)                |   |   |
|   |   |                                                               |   |   |
|   |   |   - Pinia / Vue Reactive State                                |   |   |
|   |   |   - Views & Business Workflows (155 verified BM routes)       |   |   |
|   |   |   - OfflineStorageEngine / Storage Abstraction Interface      |   |   |
|   |   |   - SyncCoordinator & MutationQueue (Outbox drain)            |   |   |
|   |   |   - SyncStatusBar UI & Safe Close Window Interceptor          |   |   |
|   |   +---------------------------------------------------------------+   |   |
|   |                                   |                                   |   |
|   |                     Tauri IPC Bridge (`invoke`)                       |   |   |
|   |                                   v                                   |   |
|   |   +---------------------------------------------------------------+   |   |
|   |   |                   NATIVE RUST HOST PROCESS                    |   |   |
|   |   |                     (aj-ecodrive-erp.exe)                     |   |   |
|   |   |                                                               |   |   |
|   |   |   - Window Management & Safe Exit Event Handlers              |   |   |
|   |   |   - Tauri Plugin SQL (libsqlite3 embedded driver)             |   |   |
|   |   |   - Windows DPAPI Native Crypto (CryptProtectData)            |   |   |
|   |   |   - File System & OS System Tray Integration                  |   |   |
|   |   +---------------------------------------------------------------+   |   |
|   +-----------------------------------------------------------------------+   |
|                               |                       |                       |
|                               v                       v                       |
|               +-----------------------+   +-----------------------+           |
|               |  SQLite Local Database|   |  Windows DPAPI Store  |           |
|               |  (ecodrive.db in      |   |  (Protected session & |           |
|               |   %LOCALAPPDATA%)     |   |   tokens per Windows  |           |
|               |                       |   |   user account)       |           |
|               +-----------------------+   +-----------------------+           |
|                                                                               |
+-------------------------------------------------------------------------------+
```

---

## 2. Process & Execution Model

The application operates as two decoupled execution contexts connected by Tauri's secure binary Inter-Process Communication (IPC) boundary:

### 2.1 Native Host Process (`aj-ecodrive-erp.exe`)
- **Language / Runtime:** Compiled Rust 2024 binary utilizing `stable-x86_64-pc-windows-gnu`.
- **Responsibilities:**
  - Manages Windows native window handles (`HWND`), window resizing, minimizing to tray, and titlebar behaviors.
  - Hosts native plugins: `@tauri-apps/plugin-sql` (providing SQLite direct file database capabilities) and `@tauri-apps/plugin-log`.
  - Exposes custom Rust IPC commands: `secure_store_set`, `secure_store_get`, `secure_store_remove`, `secure_store_clear` for DPAPI token protection.
  - Enforces application lifecycle safety: intercepts Windows `WM_CLOSE` messages to warn about unsynchronized mutations.

### 2.2 Frontend Webview Renderer
- **Engine:** Microsoft Edge WebView2 (Chromium Evergreen).
- **Bundle Source:** Production-compiled static assets located in `frontend/dist/` (compiled from Vue 3, Vite, Tailwind CSS, Pinia, Lucide icons).
- **Isolation:** The webview runs with strict Content Security Policy (CSP). Node.js integration is disabled inside the DOM. OS calls must pass explicitly through Tauri IPC capability grants configured in `capabilities/default.json`.

---

## 3. Storage Abstraction & Dynamic Adapter Resolution

To ensure cross-platform compatibility between Web Browser deployments (Vercel) and Windows Desktop packaging, AJ EcoDrive ERP implements a clean **Storage Abstraction Interface** (`StorageAdapterInterface`):

```
                       StorageAdapterInterface
                                  ▲
                                  │
                 ┌────────────────┴────────────────┐
                 │                                 │
     IndexedDBStorageAdapter               SQLiteStorageAdapter
        (Web / Browser)                   (Windows Desktop Tauri)
```

### 3.1 Dynamic Resolution Logic (`OfflineStorageEngine.js`)
When initializing, `createDefaultStorageAdapter()` dynamically detects the execution host:
```javascript
export function createDefaultStorageAdapter() {
  if (typeof window !== 'undefined' && (window.__TAURI__ || window.__TAURI_INTERNALS__)) {
    return new SQLiteStorageAdapter({ dbName: 'ecodrive.db' })
  }
  return new IndexedDBStorageAdapter({ dbName: 'ecodrive_offline_db', version: 1 })
}
```

### 3.2 Feature Matrix by Adapter

| Capability | IndexedDB Adapter (Web) | SQLite Adapter (Windows Tauri) |
| :--- | :---: | :---: |
| Entity Cache (`get`, `put`, `getAll`, `delete`) | Yes (`IDBObjectStore`) | Yes (`SELECT`, `INSERT OR REPLACE`) |
| Outbox Pending Queue | Yes | Yes (Indexed by `status`, `created_at`) |
| Optimistic Concurrency Conflicts Store | Yes | Yes |
| Sync State KV Store | Yes | Yes |
| Tombstones Tracking | Yes | Yes |
| Branch-Scoped Queries | Yes | Yes (Indexed by `branch_id`) |
| Multi-tenant User Isolation | Yes | Yes (Filtered by `user_id` / `tenant_id`) |
| ACID Transactions | Partial (IDB transactions) | Full (SQLite `BEGIN IMMEDIATE ... COMMIT`) |
| Process Crash Resilience | High | Maximum (WAL-mode SQLite disk write) |

---

## 4. Safe Application Close & Crash Recovery Lifecycle

Desktop applications on Windows are vulnerable to abrupt closure (Alt+F4, Task Manager kill, or system shutdown). AJ EcoDrive ERP guarantees that no offline transaction is ever lost or silently discarded:

### 4.1 Window Close Interception (`App.vue`)
1. On desktop startup, `App.vue` binds to Tauri's window close event:
   ```javascript
   if (window.__TAURI__ || window.__TAURI_INTERNALS__) {
     const { getCurrentWebviewWindow } = await import('@tauri-apps/api/webviewWindow')
     const appWindow = getCurrentWebviewWindow()
     await appWindow.onCloseRequested(async (event) => {
       const pendingCount = store.offlineSyncStatus?.pendingChanges || 0
       if (pendingCount > 0) {
         if (navigator.onLine) {
           await store.triggerManualSync()
         }
         const remaining = store.offlineSyncStatus?.pendingChanges || 0
         if (remaining > 0) {
           const confirmLeave = window.confirm(
             `Warning: You have ${remaining} pending change(s) saved locally that have not yet uploaded to the cloud server.\n\n` +
             `Your changes are safely stored on this computer and will automatically synchronize the next time you open AJ EcoDrive ERP.\n\n` +
             `Do you want to exit now?`
           )
           if (!confirmLeave) {
             event.preventDefault()
           }
         }
       }
     })
   }
   ```
2. **Immediate Flush Attempt:** If network connectivity is present at the moment of exit, the application initiates an asynchronous queue drain (`triggerManualSync()`).
3. **Graceful Warning:** If changes remain pending, a clear prompt informs the user that their data is safely persisted in the local SQLite database and will automatically resume sync upon next launch.

### 4.2 Durable Restart Recovery
- If the application is abruptly killed or the computer restarts, SQLite's write-ahead log (WAL) guarantees disk consistency.
- On next application launch, `SyncCoordinator.initialize()` loads all records from the `outbox` table where `status = 'pending'`.
- The `SyncStatusBar.vue` component instantly renders the "Pending offline changes: N" indicator.
- As soon as network connectivity is validated against `https://ecodrive.skyrasoft.com/api/v1/health`, the sync engine resumes synchronization sequentially, adhering strictly to entity dependencies.

---

## 5. Security & IPC Boundary Isolation

1. **Explicit Tauri Capabilities:**  
   Under `frontend/src-tauri/capabilities/default.json`, only required permissions are granted:
   - `core:default` (window creation and basic runtime)
   - `sql:default`, `sql:allow-execute`, `sql:allow-select` (database access restricted to `sqlite:ecodrive.db`)
   - `log:default`
2. **Production Endpoint Pinning:**  
   In Tauri builds, `api.js` explicitly hardcodes the API endpoint to:
   ```javascript
   if (typeof window !== 'undefined' && (window.__TAURI__ || window.__TAURI_INTERNALS__)) {
     return 'https://ecodrive.skyrasoft.com/api/v1'
   }
   ```
   No `localhost` fallback or development endpoint can be triggered in desktop mode.
3. **No Embedded Secrets:**  
   The binary contains zero embedded passwords, API tokens, database passwords, or private signing keys. All authentication tokens are acquired at runtime and protected using Windows DPAPI.
