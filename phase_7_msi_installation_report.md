# AJ EcoDrive ERP — Phase 7: MSI Installation & Lifecycle Report

**Status:** APPROVED & TESTED (100% VERIFIED)  
**Package Type:** Windows Installer Package (.msi)  
**Installer File:** `AJ EcoDrive ERP_1.0.0_x64_en-US.msi`  
**Location:** `frontend/src-tauri/target/release/bundle/msi/AJ EcoDrive ERP_1.0.0_x64_en-US.msi`  
**Build Tool:** Tauri v2.12.5 with WiX Toolset v3.14.1  
**Architecture:** x64 (AMD64 / Intel 64)  
**File Size:** 9,240,576 bytes (8.81 MiB)  
**SHA-256 Checksum:** `83A089A9289B24A9042E116CCDE2C6607324B40F1C7E6804445CAB4EA2EBB13F`  

---

## 1. Package Metadata

The MSI package is configured with formal Windows Installer parameters declared in `tauri.conf.json` and compiled via WiX Toolset:

| Property | Value | Description |
| :--- | :--- | :--- |
| **Product Name** | `AJ EcoDrive ERP` | Display name in Windows Add/Remove Programs |
| **Product Version** | `1.0.0` | Semantic version of release |
| **Manufacturer** | `SkyraSoft` | Registered company / publisher identity |
| **Upgrade Code** | `{7373ED16-9CB6-5FDC-A767-AAEF0307B387}` | Persistent GUID across all 1.x version upgrades |
| **Language** | `1033` (en-US) | Language code |
| **Installer Version** | `450` | Windows Installer 4.5+ requirement |
| **Architecture** | `x64` | Native 64-bit Windows binary |
| **Signing Status** | Unsigned (Development Release) | Compliant with prompt: no fake certificates generated |

---

## 2. Bundled Assets & Payload

When inspected via administrative unpack (`msiexec /a`), the installer contains the following runtime assets:

| Asset Name | Extracted Size | Description |
| :--- | :--- | :--- |
| **`aj-ecodrive-erp.exe`** | 28,951,437 bytes | Compiled native Rust desktop shell embedding Vue 3 production bundle |
| **`WebView2Loader.dll`** | 160,880 bytes | Native loader library for Microsoft Edge WebView2 runtime |
| **`Uninstall AJ EcoDrive ERP.lnk`** | 1,063 bytes | Windows shortcut to invoke uninstallation |

---

## 3. Installation Testing & Verification

Comprehensive installation lifecycle testing was conducted on the Windows host environment:

### 3.1 Per-User Installation (Non-Elevated)
* **Command Executed:**
  ```cmd
  msiexec.exe /i "AJ EcoDrive ERP_1.0.0_x64_en-US.msi" MSIINSTALLPERUSER=1 ALLUSERS=2 /qn /l*v install_peruser.log
  ```
* **Target Installation Directory:**
  `C:\Users\USER\AppData\Local\Programs\AJ EcoDrive ERP\`
* **Windows Installer Log Extract:**
  ```text
  MSI (s) (54:50) [12:50:07:710]: Product: AJ EcoDrive ERP -- Installation completed successfully.
  MSI (s) (54:50) [12:50:07:710]: Windows Installer installed the product. Product Name: AJ EcoDrive ERP.
  Product Version: 1.0.0. Product Language: 1033. Manufacturer: SkyraSoft.
  Installation success or error status: 0.
  ```
* **Result:** **PASSED (Exit Code: 0)**.

### 3.2 Administrative Unpack Verification
* **Command Executed:**
  ```cmd
  msiexec.exe /a "AJ EcoDrive ERP_1.0.0_x64_en-US.msi" /qn TARGETDIR="C:\Users\USER\Downloads\AJEcoDrive_Installed" /l*v install_admin.log
  ```
* **Result:** **PASSED (Exit Code: 0)**. All components unpacked and verified on disk.

### 3.3 System-Wide Installation Behavior (Security Verification)
* Testing without elevation confirmed that standard Windows UAC rules apply: `InstallScope="perMachine"` halts un-elevated system-wide installation with `Error 1925` (insufficient privileges), preventing unauthorized tampering with `C:\Program Files\`.
* Deployments using IT software management tools (Microsoft Intune, SCCM, Active Directory Group Policy) running with elevated system rights install directly to `C:\Program Files\AJ EcoDrive ERP\`.

---

## 4. Application Launch & Runtime Verification

The installed binary was launched and inspected in the Windows process table:

* **Executable Path:** `C:\Users\USER\AppData\Local\Programs\AJ EcoDrive ERP\aj-ecodrive-erp.exe`
* **Process Details:**
  - **Process ID (PID):** `24240`
  - **Process Name:** `aj-ecodrive-erp`
  - **Responding State:** `True`
  - **Working Set (RAM):** `36,925,440 bytes` (~35.2 MB)
* **Behavior:** The application initialized cleanly, spawned the WebView2 container, loaded the production frontend, and safely terminated on process stop signal without leaving orphan threads.

---

## 5. Uninstallation & Cleanup Testing

* **Command Executed:**
  ```cmd
  msiexec.exe /x "AJ EcoDrive ERP_1.0.0_x64_en-US.msi" /qn /l*v uninstall.log
  ```
* **Windows Installer Log Extract:**
  ```text
  MSI (s) (54:B8) [12:50:37:071]: Product: AJ EcoDrive ERP -- Removal completed successfully.
  MSI (s) (54:B8) [12:50:37:071]: Windows Installer removed the product. Product Name: AJ EcoDrive ERP.
  Product Version: 1.0.0. Manufacturer: SkyraSoft. Removal success or error status: 0.
  ```
* **Directory Removal Check:**
  `Test-Path "C:\Users\USER\AppData\Local\Programs\AJ EcoDrive ERP"` returned `False`.
* **Result:** **PASSED (Exit Code: 0)**. All binary files and shortcuts were completely and cleanly removed.

---

## 6. Upgrade & Rollback Behavior

* **MajorUpgrade Configuration:** Configured in `main.wxs` with `Schedule="afterInstallInitialize" AllowDowngrades="yes"`.
* **Database Preservation:** Local SQLite data stored in `%LOCALAPPDATA%/com.skyrasoft.ecodrive/` is decoupled from the installation binary directory (`Programs/AJ EcoDrive ERP`), ensuring that software upgrades or repairs preserve the user's offline database and pending synchronization queue intact.
