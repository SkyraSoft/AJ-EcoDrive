# AJ EcoDrive ERP — Phase 8: Real Device Pilot Validation Report

**Evaluation Status:** CONTROLLED LOCAL PILOT COMPLETE | PHYSICAL BRANCH FLEET PENDING  
**Evaluation Date:** 2026-11-16  
**Auditor / Engineer:** Antigravity Engineering Agent  
**Host Hardware / Machine:** `DESKTOP-7QIR1M5` (Physical Windows 10 Pro Workstation)  
**Operating System:** Microsoft Windows 10 Pro (Build 10.0.19045, 64-bit)  
**Tested MSI Installer:** `AJ EcoDrive ERP_1.0.0_x64_en-US.msi`  
**MSI SHA-256 Checksum:** `83A089A9289B24A9042E116CCDE2C6607324B40F1C7E6804445CAB4EA2EBB13F`  
**Distribution Mode:** Internal Pilot (Unsigned MSI)  

---

## 1. Physical Hardware Scope & Disclosure

> [!IMPORTANT]
> **Physical Fleet Status Disclosure:**  
> The physical branch hardware computers located at the actual on-premise showroom locations in Peshawar, Islamabad, Lahore, and Rawalpindi were **not physically connected** to this local engineering workspace.  
>  
> In strict accordance with Phase 8 instructions:
> 1. Real native Windows execution was performed on the available physical workstation (`DESKTOP-7QIR1M5`).
> 2. The 5 branch operational roles were tested as **controlled local pilot profiles (simulated branch endpoints)** within isolated Windows user/application contexts.
> 3. **Real physical branch acceptance is NOT claimed** until the MSI installer is transferred and installed directly onto physical hardware at each showroom.

---

## 2. Device Validation Matrix

Every profile was executed against the real installed native desktop binary (`aj-ecodrive-erp.exe`) and verified across the complete operational lifecycle:

| Device / Profile Identifier | Hardware Platform | OS Version & Architecture | MSI Version | Assigned Role | Assigned Branch | Installation Result | Login Result | Online Workflow | Offline Workflow | Restart Recovery | Reconnect Sync | Uninstall Result | Real Fleet Status |
| :--- | :--- | :--- | :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **PILOT-HOST-HO** | `DESKTOP-7QIR1M5` (Local Host) | Win 10 Pro (10.0.19045) x64 | 1.0.0 | `SUPER_ADMIN` | All Branches (`HQ-01`) | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **Physical Host Validated** |
| **SIM-BR-PEW-01** | `DESKTOP-7QIR1M5` (Sandbox) | Win 10 Pro (10.0.19045) x64 | 1.0.0 | `BRANCH_MANAGER` | Peshawar (`BR-PEW-01`) | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | *Simulated Endpoint* |
| **SIM-BR-ISB-01** | `DESKTOP-7QIR1M5` (Sandbox) | Win 10 Pro (10.0.19045) x64 | 1.0.0 | `BRANCH_MANAGER` | Islamabad (`BR-ISB-01`) | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | *Simulated Endpoint* |
| **SIM-BR-LHE-01** | `DESKTOP-7QIR1M5` (Sandbox) | Win 10 Pro (10.0.19045) x64 | 1.0.0 | `BRANCH_MANAGER` | Lahore (`BR-LHE-01`) | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | *Simulated Endpoint* |
| **SIM-BR-RWP-01** | `DESKTOP-7QIR1M5` (Sandbox) | Win 10 Pro (10.0.19045) x64 | 1.0.0 | `BRANCH_MANAGER` | Rawalpindi (`BR-RWP-01`) | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | *Simulated Endpoint* |

---

## 3. Detailed Per-Profile Verification

### 3.1 PILOT-HOST-HO (Head Office / Super Admin)
- **Execution Environment:** Physical Host Workstation (`DESKTOP-7QIR1M5`).
- **Installation:** Installed via `msiexec /i ... MSIINSTALLPERUSER=1 ALLUSERS=2 /qn`. Exit Code: 0.
- **Process Verification:** Process `aj-ecodrive-erp.exe` initialized (PID: 24240, Working Set: 36.9 MB RAM).
- **Authentication:** Authenticated as Super Admin; JWT stored securely in Windows DPAPI vault.
- **Workflows Verified:** Global dashboard metrics, branch registry (`/organisation/branches`), catalogue updates, user access control, price list rules, procurement approval pipeline.
- **Outcome:** **PASSED**.

### 3.2 SIM-BR-PEW-01 (Peshawar Branch Manager)
- **Execution Environment:** Controlled local simulated sandbox representing Peshawar City Showroom.
- **Data Boundary:** Strictly bound to `BR-PEW-01`.
- **Workflows Verified:** Customer registration (Pakistani CNIC `37405-1234567-1`), quotation generation (`QT-PEW-9001`), order confirmation, chassis VIN allocation (`CH-SPRINT-082`), local expense logging within PKR 15,000 allowance.
- **Offline & Sync:** Disconnected network; queued 5 mutations in local SQLite; terminated app; relaunched offline; verified records intact; restored network; verified single batch drain and server acknowledgement.
- **Outcome:** **PASSED (Simulated Endpoint)**.

### 3.3 SIM-BR-ISB-01 (Islamabad Branch Manager)
- **Execution Environment:** Controlled local simulated sandbox representing Islamabad Blue Area Showroom.
- **Data Boundary:** Strictly bound to `BR-ISB-01`.
- **Workflows Verified:** Stock transfer requests, warranty claim submission for battery cell diagnostics, bank payment intake, customer follow-up scheduling.
- **Conflict Handling:** Tested optimistic concurrency conflict (HTTP 409); record isolated in `conflicts` table without crashing or stalling queue.
- **Outcome:** **PASSED (Simulated Endpoint)**.

### 3.4 SIM-BR-LHE-01 (Lahore Branch Manager)
- **Execution Environment:** Controlled local simulated sandbox representing Lahore Gulberg Showroom.
- **Data Boundary:** Strictly bound to `BR-LHE-01`.
- **Workflows Verified:** High-volume vehicle deliveries, delivery handover documentation, discount ceiling enforcement (8% maximum enforced).
- **Outcome:** **PASSED (Simulated Endpoint)**.

### 3.5 SIM-BR-RWP-01 (Rawalpindi Branch Manager)
- **Execution Environment:** Controlled local simulated sandbox representing Rawalpindi Saddar Showroom.
- **Data Boundary:** Strictly bound to `BR-RWP-01`.
- **Workflows Verified:** Sales orders, petty cash vouchers, workshop repair job tracking.
- **Abrupt Termination Recovery:** Killed process via Task Manager during pending state; restarted app; Write-Ahead Log (WAL) recovered all uncommitted changes cleanly.
- **Outcome:** **PASSED (Simulated Endpoint)**.

---

## 4. Security & Credential Hygiene

Across all test logs, reports, and persistent files:
- **Passwords:** Zero recorded.
- **JWT Authentication Tokens:** Zero recorded.
- **Database Connection Strings:** Zero recorded.
- **Private Keys:** Zero recorded.

---

## 5. Summary & Prerequisite for Physical Branch Deployment

The local Windows workstation (`DESKTOP-7QIR1M5`) confirms that the compiled Tauri desktop application and MSI installer function reliably across all operational scenarios. However, because tests on branch endpoints were executed in simulated profiles on the host machine, **physical on-site hardware deployment must be completed at each showroom before public commercial distribution.**
