# Phase 7 Platform Decision & Packaging Architecture Specification
**AJ EcoDrive ERP — Dealership Management System**  
**Author:** Google DeepMind Assistant  
**Date:** 2026-11-16  
**Status:** Approved & Ready for Implementation  

---

## 1. Executive Packaging Strategy

The AJ EcoDrive ERP platform serves physical EV showrooms, service centers, and central warehouse operations across Pakistan (Peshawar, Islamabad, Lahore, Rawalpindi). Dealership operations require two distinct native client classes:

1. **Desktop Showroom Terminals & Cash Desks (Primary Operational Target):** Showroom managers, sales counters, cashier booths, and warehouse dispatch offices operate on fixed Windows 10/11 x64 workstations connected to receipt printers, barcode/VIN scanners, and local networks.
2. **Field Operations, Inspection & Floor Management (Mobile Target):** Floor technicians conducting PDI (Pre-Delivery Inspection), workshop repair mechanics in service bays, and logistics drivers running inter-branch vehicle transfers operate on Android tablets and smartphones.

---

## 2. Explicit Primary Packaging Target Selection

> [!IMPORTANT]
> **PRIMARY FIRST TARGET CHOSEN: Windows Desktop Native Application (Tauri v2 + MSI Installer)**
> 
> **Rationale:**
> 1. Showroom operations (Quotation generation, Sales Order booking, FBR fiscal invoicing, cash collection, and gate pass issuance) are executed on fixed Windows desktop counters.
> 2. The host build machine is Windows 10/11 x64 with native WebView2 runtime, PowerShell, and WiX Toolset support.
> 3. Zero emulation overhead: A Windows MSI can be built, installed, and validated natively on the local device without needing Android Studio SDKs or physical mobile tethering in the initial desktop gate pass.

The **Second Target (Android Capacitor APK/AAB)** will follow immediately after the Windows desktop pipeline is verified.

---

## 3. Technology Matrix: Architecture & Rationale

| Dimension | Windows Desktop Target | Android Mobile Target |
| :--- | :--- | :--- |
| **Packaging Wrapper** | **Tauri v2 (Rust)** | **Capacitor v6/v7 (Node/Gradle)** |
| **Why not Electron?** | Electron bundles full Chromium (~180MB RAM, 120MB+ installer). Tauri uses system WebView2 (~30MB RAM, <15MB installer), fast boot, native Windows API access. | Capacitor provides standard Android WebView integration with direct Gradle and Android Studio lifecycle support. |
| **Embedded Database** | **SQLite via `tauri-plugin-sql`** | **SQLite via `@capacitor-community/sqlite`** |
| **Storage Role** | Native durable persistence layer mirroring and backing Web IndexedDB. Handles offline entity cache, outbox mutations, and conflict tables. | Native durable SQLite database stored in internal app sandbox (`/data/data/com.skyrasoft.ecodrive/databases`). |
| **Secure Token Storage** | **Windows Credential Manager / DPAPI** (`tauri-plugin-stronghold` or DPAPI wrapper) | **Android Keystore / EncryptedSharedPreferences** (`@capacitor/preferences` with encryption) |
| **Installer / Output** | **Standard Windows `.msi` Installer** (via WiX v3/v4) | **Debug `.apk` initially, then Signed Release `.aab` / `.apk`** |
| **Production API URL** | `https://ecodrive.skyrasoft.com/api/v1` | `https://ecodrive.skyrasoft.com/api/v1` |
| **Offline Engine** | Phase 6 OfflineStorageEngine + MutationQueue + SQLite persistence adapter | Phase 6 OfflineStorageEngine + MutationQueue + SQLite persistence adapter |

---

## 4. Target 1: Windows Desktop (Tauri + MSI) Detailed Specification

### 4.1 Framework & Prerequisites
- **Runtime:** Tauri v2 (`@tauri-apps/cli`, `@tauri-apps/api`)
- **Backend Bridge:** Rust 1.77+ with Windows MSVC toolchain (`x86_64-pc-windows-msvc`)
- **Web Engine:** Microsoft Edge WebView2 (pre-installed on Windows 10/11)
- **Installer Engine:** WiX Toolset v3.11 / v4 (generates `.msi` package)
- **Database Plugin:** `tauri-plugin-sql` with SQLite feature enabled

### 4.2 Application Configuration & Metadata
- **Application Name:** `AJ EcoDrive ERP`
- **Identifier:** `com.skyrasoft.ecodrive`
- **Version:** `1.0.0`
- **Window Properties:**
  - Default width: 1440, min width: 1024
  - Default height: 900, min height: 700
  - Native Windows title bar with showroom branding
- **Production API URL:** Hardcoded in environment release profile to `https://ecodrive.skyrasoft.com/api/v1`
- **Security Policy:**
  - Content Security Policy (CSP): Strictly allow `https://ecodrive.skyrasoft.com` and local asset protocols.
  - Token Storage: DPAPI-backed Windows Credential Vault; tokens never stored in plain registry or plaintext disk files.

### 4.3 Windows MSI Testing Protocol
To satisfy the Phase 7 completion gate, the Windows MSI must undergo the following clean-device verification:
1. **Fresh Installation:** Run `.msi` on clean Windows system; verify Program Files installation, desktop shortcut, start menu entry, and clean uninstall registry key.
2. **Upgrade Test:** Install v1.0.0, apply upgrade patch to v1.0.1; verify local offline database and outbox mutations remain intact without corruption.
3. **Uninstall Cleanliness:** Uninstall via Windows Settings / Control Panel; verify temporary runtime files are purged cleanly.
4. **Offline Resilience:** Disconnect Ethernet/Wi-Fi; launch app; verify cached records load, create 3 offline transactions (customer, quotation, expense); close app.
5. **Restart Recovery:** Relaunch app while still offline; verify all 3 pending mutations survive in outbox.
6. **Reconnection & Synchronization:** Reconnect network; verify single upload drain, server acknowledgment, and queue clearance.

---

## 5. Target 2: Android Mobile (Capacitor APK/AAB) Detailed Specification

### 5.1 Framework & Prerequisites
- **Runtime:** Capacitor v6 (`@capacitor/core`, `@capacitor/cli`, `@capacitor/android`)
- **Android Target:** Android 14 (API level 34), Min SDK: Android 8.0 (API level 26)
- **Tooling:** Android SDK Build-Tools 34.0.0, Gradle 8.2+, JDK 17
- **Database Plugin:** `@capacitor-community/sqlite` with encryption support
- **Token Security:** `@capacitor/preferences` utilizing Android Keystore and MasterKey AES-256 encryption

### 5.2 Application Configuration & Metadata
- **Package ID:** `com.skyrasoft.ecodrive`
- **App Name:** `AJ EcoDrive`
- **Version Code:** `100`
- **Version Name:** `1.0.0`
- **Permissions:**
  - `INTERNET` (API communication)
  - `ACCESS_NETWORK_STATE` (Reactive online/offline detection)
  - `CAMERA` (VIN barcode scanning and PDI inspection photo upload)

### 5.3 Android Packaging Sequence
1. **Step 1: Debug APK:**
   - Command: `./gradlew assembleDebug`
   - Output: `app-debug.apk`
   - Purpose: Local installation on test device / emulator via `adb install`.
2. **Step 2: Internal Device Verification:**
   - App suspension (Home button, backgrounding)
   - Process termination by Android OS under memory pressure
   - Offline mutation creation during zero-connectivity test bay operation
   - Reconnect synchronization upon 4G/Wi-Fi handover
3. **Step 3: Signed Release APK / AAB:**
   - Configure dedicated release keystore (`ecodrive-release.keystore`)
   - Command: `./gradlew bundleRelease` / `./gradlew assembleRelease`
   - Output: `app-release.aab` (Google Play deployment) & `app-release.apk` (dealership side-load)

---

## 6. Implementation Roadmap

```
[Phase 6 Pre-Packaging Gate: PASSED]
                 │
                 ▼
[Target 1: Windows Desktop (Tauri + MSI)]
   ├─ 1. Scaffold src-tauri configuration
   ├─ 2. Configure SQLite storage & DPAPI token security
   ├─ 3. Configure WiX MSI bundle parameters
   ├─ 4. Build native MSI package
   └─ 5. Execute 6-point desktop installation & sync verification
                 │
                 ▼
[Target 2: Android Mobile (Capacitor APK/AAB)]
   ├─ 1. Scaffold Capacitor Android wrapper
   ├─ 2. Configure Keystore, camera permissions & SQLite
   ├─ 3. Build debug APK
   ├─ 4. Verify app lifecycle & network recovery on device
   └─ 5. Build signed production release package
```

---

## 7. Strict Compliance Declarations
- An **MSI installer is a Windows Desktop package** and will never be referred to as an Android application.
- An **APK/AAB package is an Android Mobile package** and will never be referred to as a Windows application.
- Phase 7 will **NOT** be declared complete until the packaged installer is installed, launched, and verified on a clean operational machine.
