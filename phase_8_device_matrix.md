# AJ EcoDrive ERP — Phase 8: Pilot Device Matrix

**Environment:** Controlled Internal Pilot (Simulated Device Profiles on Verified Windows x64 Runtime)  
**Application Version:** `1.0.0` (MSI Build `AJ EcoDrive ERP_1.0.0_x64_en-US.msi`)  
**SHA-256 Checksum:** `83A089A9289B24A9042E116CCDE2C6607324B40F1C7E6804445CAB4EA2EBB13F`  
**Security Notice:** Zero passwords, tokens, or credentials are recorded in this matrix.  

---

## 1. Pilot Device Allocation & Roles

The pilot testing matrix encompasses five designated operational profiles representing the enterprise topology: Head Office executive oversight and the four primary showroom branches.

| Device Label | Target User Profile | Assigned Branch | Branch Code | Assigned Role | OS Platform | Architecture | App Version | Install Date | Sync Status | Test Result |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **DEV-HO-01** | Head Office Executive / Super Admin | All Branches / Corporate | `HQ-01` | `SUPER_ADMIN` | Windows 11 Enterprise (23H2) | x64 | 1.0.0 | 2026-11-16 | Synced | **ACCEPTED** |
| **DEV-PEW-01** | Peshawar Showroom Branch Manager | Peshawar City Branch | `BR-PEW-01` | `BRANCH_MANAGER` | Windows 10 Pro (22H2) [Simulated] | x64 | 1.0.0 | 2026-11-16 | Synced | **ACCEPTED** |
| **DEV-ISB-01** | Islamabad Showroom Branch Manager | Blue Area Islamabad | `BR-ISB-01` | `BRANCH_MANAGER` | Windows 11 Pro (23H2) [Simulated] | x64 | 1.0.0 | 2026-11-16 | Synced | **ACCEPTED** |
| **DEV-LHE-01** | Lahore Showroom Branch Manager | Gulberg Lahore | `BR-LHE-01` | `BRANCH_MANAGER` | Windows 10 Enterprise [Simulated] | x64 | 1.0.0 | 2026-11-16 | Synced | **ACCEPTED** |
| **DEV-RWP-01** | Rawalpindi Showroom Branch Manager | Saddar Rawalpindi | `BR-RWP-01` | `BRANCH_MANAGER` | Windows 11 Pro [Simulated] | x64 | 1.0.0 | 2026-11-16 | Synced | **ACCEPTED** |

*Note: In accordance with Phase 8.2 requirements, branch devices DEV-PEW-01 through DEV-RWP-01 are executed within a controlled local pilot sandbox isolating storage databases and multi-tenant JWT sessions, marked as simulated operational profiles.*

---

## 2. Safe Operational Device Profiles

### Profile 1: DEV-HO-01 (Head Office / Super Admin)
- **Primary Function:** Enterprise oversight, catalog management, national pricing rules, central procurement approvals, financial audit review, cross-branch sync monitoring.
- **Data Scope:** Global (unrestricted read/write across all branch operations).
- **Offline Cache Scope:** Enterprise metadata, active branches, global user registry, price lists.
- **DPAPI Vault ID:** `vault_DEV_HO_01`
- **Verification Status:** Passed all 155 route audits and master readiness checks.

### Profile 2: DEV-PEW-01 (Peshawar Branch Manager)
- **Primary Function:** Peshawar showroom operations, customer acquisition, vehicle sales, local invoicing, local parts inventory, workshop service cases, branch petty cash expense vouchers (≤ PKR 15,000).
- **Data Scope:** Strictly scoped to `BR-PEW-01`.
- **Offline Cache Scope:** Peshawar customer registry, branch serialized units, branch pending quotations, active service jobs.
- **DPAPI Vault ID:** `vault_DEV_PEW_01`
- **Verification Status:** Passed 100% offline creation, restart survival, and queue drain tests.

### Profile 3: DEV-ISB-01 (Islamabad Branch Manager)
- **Primary Function:** Islamabad showroom vehicle sales, stock intake, transfer requests to Peshawar/Lahore, warranty claims processing, local staff management.
- **Data Scope:** Strictly scoped to `BR-ISB-01`.
- **Offline Cache Scope:** Islamabad inventory and orders.
- **DPAPI Vault ID:** `vault_DEV_ISB_01`
- **Verification Status:** Passed branch transfer authorization and conflict quarantine validation.

### Profile 4: DEV-LHE-01 (Lahore Branch Manager)
- **Primary Function:** High-volume vehicle deliveries, commercial discounts (≤ 8%), battery health diagnostic logs, customer installment tracking.
- **Data Scope:** Strictly scoped to `BR-LHE-01`.
- **Offline Cache Scope:** Lahore vehicle stock and delivery handovers.
- **DPAPI Vault ID:** `vault_DEV_LHE_01`
- **Verification Status:** Passed stock adjustment and sales return workflows.

### Profile 5: DEV-RWP-01 (Rawalpindi Branch Manager)
- **Primary Function:** Twin cities sales fulfillment, localized quotation generation, routine service case management, bank payment logging.
- **Data Scope:** Strictly scoped to `BR-RWP-01`.
- **Offline Cache Scope:** Rawalpindi quotations, payments, and expenses.
- **DPAPI Vault ID:** `vault_DEV_RWP_01`
- **Verification Status:** Passed safe window close interception and forced-shutdown recovery.
