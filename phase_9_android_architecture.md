# Phase 9: Android Mobile Architecture Specification
**Document ID:** `PHASE-9-ARCH-002`  
**Execution Timestamp:** 2026-11-16T14:55:00+05:00  
**Application ID:** `com.skyrasoft.ecodrive`  
**Application Name:** AJ EcoDrive ERP  
**Target Platform:** Android Mobile & Tablet Client (Android 8.0+ / API 26 to API 34+)  

---

## 1. System Architecture Overview

AJ EcoDrive ERP's Android mobile architecture preserves 100% of the proven business logic, offline reactive state management, and role-based access control (RBAC) established in earlier project phases. The application is encapsulated using modern Capacitor runtime architecture, interfacing directly with native Android platform services.

```
+-----------------------------------------------------------------------------------+
|                           AJ ECODRIVE ERP (ANDROID)                               |
+-----------------------------------------------------------------------------------+
|  PRESENTATION & USER INTERACTION (Vue 3 + Vite Single Page Application)           |
|  - Role-Based Dynamic UI (Super Admin vs. Branch Manager Views)                  |
|  - Pinia Reactive State Stores (Customer, Inventory, Sales, Procurement, Repairs) |
|  - Responsive Mobile Touch Interface with Form Validation                         |
+-----------------------------------------------------------------------------------+
|  OFFLINE PERSISTENCE & SYNCHRONIZATION ENGINE                                     |
|  - Storage Engine Router (isCapacitorEnvironment -> CapacitorSQLiteStorageAdapter)|
|  - Durable Mutation Queue & Outbox Manager                                        |
|  - Two-Phase Transactional Commit & Conflict Resolver                             |
+-----------------------------------------------------------------------------------+
|  CAPACITOR BRIDGE LAYER                                                           |
|  - @capacitor/core (WebView bridge, lifecycle events, network status)             |
|  - @capacitor-community/sqlite (Native SQLite JNI / SQLCipher bindings)           |
|  - @capacitor/preferences (Android Keystore-backed secure preferences)            |
+-----------------------------------------------------------------------------------+
|  NATIVE ANDROID PLATFORM (Android OS API 26-34+)                                  |
|  - Android System WebView (Chromium-based rendering engine)                       |
|  - Local File System Sandbox (/data/user/0/com.skyrasoft.ecodrive/)               |
|  - SQLite Database Engine (ecodrive_mobile_offline.db)                            |
|  - Android Keystore & SharedPreferences                                           |
|  - Network Security Config (Strict HTTPS pinning to ecodrive.skyrasoft.com)       |
+-----------------------------------------------------------------------------------+
```

---

## 2. Key Architectural Components

### 2.1 Native SQLite Engine (`CapacitorSQLiteStorageAdapter`)
- **Adapter Location:** `frontend/src/offline/storage/CapacitorSQLiteStorageAdapter.js`
- **Native Implementation:** Implemented as a subclass of `StorageAdapter` implementing the uniform contract used across Web (IndexedDB), Desktop (Tauri SQLite), and Mobile (Capacitor SQLite).
- **Database File:** `ecodrive_mobile_offline.db` located within the application's private, sandboxed internal storage directory.
- **Relational Tables:**
  1. `entities`: JSON document storage indexed by `(table_name, id, branch_id)`.
  2. `outbox`: FIFO persistent mutation queue with retry counters, timestamps, idempotency keys, and payload snapshots.
  3. `conflicts`: Conflict quarantine table capturing server-vs-client state collisions.
  4. `sync_state`: High-water mark sync cursors and sync timestamps per entity table.
  5. `tombstones`: Soft-deletion tracking table preserving deleted IDs across synchronization cycles.
- **In-Memory Fallback:** Includes fully compatible in-memory fallback for unit testing in node/vitest headless environments where Capacitor native runtime is absent.

### 2.2 Secure Session & Credential Storage (`SecureStorage`)
- **Adapter Location:** `frontend/src/offline/storage/SecureStorage.js`
- **Native Implementation:** Integrates with `@capacitor/preferences`.
- **Underlying OS Vault:** Under Android, `@capacitor/preferences` delegates to encrypted `SharedPreferences` protected by the hardware-backed Android Keystore.
- **Zero Exposure Guarantee:**
  - No plaintext tokens or session secrets written to unencrypted storage.
  - No database credentials or JWT signing secrets bundled in mobile assets.
  - Automatic session purge and key eviction on user logout or session timeout.

### 2.3 Network Communication & Security
- **Strict HTTPS API Pinning:** Production endpoint `https://ecodrive.skyrasoft.com/api/v1` is enforced.
- **Cleartext Prohibition:** Android `network_security_config.xml` explicitly disallows all cleartext HTTP traffic (`cleartextTrafficPermitted="false"`).
- **Zero Localhost Bindings:** Packaging verification confirms zero occurrences of `localhost`, `127.0.0.1`, or development proxy URLs in release assets.

---

## 3. Storage Abstraction Compatibility Matrix

| Feature | Web (Phase 6) | Windows Desktop (Phase 7) | Android Mobile (Phase 9) |
| :--- | :--- | :--- | :--- |
| **Storage Engine** | IndexedDB | Tauri SQLite (rusqlite) | Capacitor SQLite (JNI) |
| **ACID Transactions** | Yes (IDBTransaction) | Yes (SQL BEGIN/COMMIT) | Yes (SQL BEGIN/COMMIT) |
| **Mutation Outbox** | ObjectStore | Relational Table | Relational Table |
| **Conflict Quarantine** | ObjectStore | Relational Table | Relational Table |
| **Branch Scoping** | In-memory + IDB Index | SQL WHERE branch_id | SQL WHERE branch_id |
| **Hardware Encryption** | Browser Keystore | Windows DPAPI | Android Keystore |
| **App Restart Recovery**| Survives Reload | Survives Process Exit | Survives App Kill / Reboot |
