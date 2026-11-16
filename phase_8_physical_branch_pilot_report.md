# AJ EcoDrive ERP — Phase 8: Physical Branch Pilot Report

**Evaluation Status:** PENDING PHYSICAL HARDWARE DEPLOYMENT  
**Date:** 2026-11-16  
**Auditor / Engineer:** Antigravity Engineering Agent  
**Distribution Target:** Windows 10 / Windows 11 x64  
**Package Evaluated:** `AJ EcoDrive ERP_1.0.0_x64_en-US.msi` (SHA-256: `83A089A9289B24A9042E116CCDE2C6607324B40F1C7E6804445CAB4EA2EBB13F`)  

---

## 1. Physical Hardware Availability Status

> [!IMPORTANT]
> **Status Determination: PENDING**  
> Physical showroom computers situated at the physical branch locations (Peshawar City, Islamabad Blue Area, Lahore Gulberg, Rawalpindi Saddar) are currently **physically unavailable** in this engineering environment.  
>  
> In strict compliance with release governance:
> - **Real-branch physical acceptance is NOT claimed.**
> - Simulated profiles from prior lab evaluations are explicitly distinguished from real on-premise hardware testing.
> - This blocker remains **PENDING** until the IT rollout team physically installs the MSI on each branch computer.

---

## 2. On-Site Physical Branch Deployment Matrix (Pending Execution)

When the MSI installer is transferred to physical hardware at each dealership, the following operational matrix must be executed and recorded:

| Target Location | Planned Device Identifier | Operating System Target | Assigned Branch Code | Target Role | On-Premise Status | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **Head Office** | `HQ-EXEC-PC01` | Windows 11 Enterprise (x64) | `HQ-01` | `SUPER_ADMIN` | **PENDING PHYSICAL TEST** | Enterprise oversight, central approvals, user locks |
| **Peshawar Showroom** | `PEW-SALES-PC01` | Windows 10/11 Pro (x64) | `BR-PEW-01` | `BRANCH_MANAGER` | **PENDING PHYSICAL TEST** | Local sales, CNIC checks, chassis reservation, expenses |
| **Islamabad Showroom** | `ISB-SALES-PC01` | Windows 10/11 Pro (x64) | `BR-ISB-01` | `BRANCH_MANAGER` | **PENDING PHYSICAL TEST** | Stock transfers, warranty claims, bank payments |
| **Lahore Showroom** | `LHE-SALES-PC01` | Windows 10/11 Pro (x64) | `BR-LHE-01` | `BRANCH_MANAGER` | **PENDING PHYSICAL TEST** | High-volume handovers, 8% discount ceiling |
| **Rawalpindi Showroom**| `RWP-SALES-PC01` | Windows 10/11 Pro (x64) | `BR-RWP-01` | `BRANCH_MANAGER` | **PENDING PHYSICAL TEST** | Quotations, repair tickets, crash recovery |

---

## 3. Mandatory 24-Step On-Site Verification Protocol

Each branch technician must execute the following 24-step verification sequence on the physical showroom machine:

1. **Hardware & OS Audit:** Record Windows OS version, build, and x64 architecture.
2. **Machine Identity Verification:** Record machine serial or asset tag (zero personal identifiable data).
3. **MSI Installation:** Execute `msiexec /i "AJ EcoDrive ERP_1.0.0_x64_en-US.msi" MSIINSTALLPERUSER=1 ALLUSERS=2 /qn`.
4. **Application Launch:** Verify `aj-ecodrive-erp.exe` launches from Start Menu / Desktop shortcut.
5. **Secure Authentication:** Log in using credentials securely provided by Head Office.
6. **Role Validation:** Confirm correct role (`BRANCH_MANAGER` or `SUPER_ADMIN`) renders in the user profile badge.
7. **Branch Scope Validation:** Confirm branch header is locked to assigned location (e.g., "Peshawar City Branch").
8. **Online Data Hydration:** Verify catalogue, inventory, and branch customers load from `https://ecodrive.skyrasoft.com/api/v1`.
9. **Network Disconnection:** Physically disconnect Ethernet / disable Wi-Fi.
10. **Offline Customer Creation:** Register a new customer; verify UI badge shows *"Saved Locally (1)"*.
11. **Offline Quotation Creation:** Issue vehicle quotation with tax calculations; verify pending count increments to 2.
12. **Offline Sales Order Creation:** Convert quote to order and allocate chassis VIN; verify pending count increments to 3.
13. **Permitted Inventory Operation:** Log local inventory adjustment; verify pending count increments to 4.
14. **Expense / Repair Operation:** Log branch expense voucher or repair update; verify pending count increments to 5.
15. **Close Application with Pending Changes:** Close window; verify system prompt warns of 5 pending offline mutations.
16. **Restart Application / Machine:** Restart computer or relaunch `aj-ecodrive-erp.exe` while offline.
17. **Confirm Pending Persistence:** Confirm all 5 created records remain visible in the UI and pending counter shows 5.
18. **Network Reconnection:** Re-enable internet connectivity.
19. **Confirm Synchronization:** Observe sync indicator drain queue to `/api/v1/sync/push`.
20. **Duplicate Prevention Check:** Verify server acknowledges all mutations with zero duplicate rows in database.
21. **Pending Count Reset:** Confirm sync status badge returns to *"All changes synced"* (Pending: 0).
22. **Conflict Handling Check:** Confirm any concurrent server changes trigger conflict review without data loss.
23. **Logout:** Click Logout in user profile menu.
24. **Session Isolation Verification:** Confirm session tokens are purged from memory and Windows DPAPI vault is cleared.

---

## 4. Privacy & Confidentiality Rule

During all on-premise physical trials:
- **Never record passwords or temporary PINs.**
- **Never export or log JWT tokens.**
- **Never record database connection strings or root credentials.**
- **Never commit private encryption keys.**
- **Never log customer identity cards or private contact details in public reports.**

---

## 5. Prerequisite Sign-Off

Physical showroom acceptance remains **PENDING** until the field deployment team executes the 24-step protocol and returns signed acceptance checklists for each branch terminal.
