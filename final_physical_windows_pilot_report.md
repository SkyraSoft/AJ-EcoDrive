# AJ EcoDrive ERP — Final Physical Windows Pilot Report

**Document ID:** `RELEASE-PILOT-WIN-015`  
**Execution Timestamp:** 2026-11-16T15:25:00+05:00  
**Pilot Status:** **PHYSICAL WINDOWS PILOT: PENDING**  
**Authorized Platform Decision:** **INTERNAL PILOT APPROVED**  
**Public Release Approval:** **WITHHELD**  
**Target Architecture:** Windows 10 / Windows 11 Enterprise (x64)  
**Distribution Artifact:** `AJ EcoDrive ERP_1.0.0_x64_en-US.msi`  
**SHA-256 Checksum:** `83A089A9289B24A9042E116CCDE2C6607324B40F1C7E6804445CAB4EA2EBB13F`  
**Artifact File Size:** 9,240,576 bytes (8.81 MB)  
**Signing Status:** **Unsigned** (Strictly internal pilot use; zero fake or self-signed certificates)  

---

## 1. Executive Summary & Physical Availability Determination

> [!IMPORTANT]
> **Status Determination: PHYSICAL WINDOWS PILOT: PENDING**  
> Physical showroom desktop workstations situated at the physical dealership locations (Peshawar City, Islamabad Blue Area, Lahore Gulberg, Rawalpindi Saddar) and Head Office are **physically unavailable** on this developer build machine (`USER` on Windows 11 Enterprise x64).  
>  
> In strict compliance with release governance:
> - **Real physical branch computer acceptance is NOT claimed.**
> - Automated integration test suites (549/549 passed) and MSI packaging successes are explicitly distinguished from real on-site dealership hardware acceptance.
> - This requirement remains **PENDING** until on-site dealership IT rollout technicians install the MSI on each branch workstation and execute the protocol below.

---

## 2. Testing Methodology: Physical vs. Simulated vs. Pending

| Testing Category | Execution Status | Environment Used | Details & Scope |
| :--- | :---: | :--- | :--- |
| **Unit & Integration Test Suite** | **PASSED (549/549)** | Node 26 + JSDOM | Complete coverage of storage adapters, API clients, tours, navigation, and CRM models. |
| **Simulated Offline Persistence** | **VERIFIED** | Local Development Workstation | Verified SQLite tables (`entities`, `outbox`, `conflicts`, `sync_state`, `tombstones`), mutation queuing, and DPAPI encryption bridge. |
| **Simulated Multi-Branch Scoping**| **VERIFIED** | Local Development Workstation | Verified role-based branch locking (`PEW-01`, `ISB-01`, `LHE-01`, `RWP-01`, `HQ-01`), preventing cross-branch reading/mutation. |
| **Real Physical Branch Workstations** | **PENDING** | On-site Dealership Hardware | Physical installation and verification on dealership floor computers across all 5 branches. |

---

## 3. Physical Showroom Deployment Matrix (Pending On-Site Execution)

When the MSI installer is deployed to physical branch computers at each dealership, the following operational matrix will be executed:

| Branch Location | Target Machine Identifier | Operating System Target | Branch Code | Target Role | On-Premise Status | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **Head Office** | `HQ-EXEC-PC01` | Windows 11 Enterprise x64 | `HQ-01` | `SUPER_ADMIN` | **PENDING PHYSICAL TEST** | Executive dashboards, cross-branch consolidated reporting, user locks |
| **Peshawar Showroom** | `PEW-SALES-PC01` | Windows 10/11 Pro x64 | `BR-PEW-01` | `BRANCH_MANAGER` | **PENDING PHYSICAL TEST** | Floor sales, customer CNIC lookup, chassis allocation, petty cash |
| **Islamabad Showroom** | `ISB-SALES-PC01` | Windows 10/11 Pro x64 | `BR-ISB-01` | `BRANCH_MANAGER` | **PENDING PHYSICAL TEST** | Stock transfers, quotation issuance, repair ticket logging |
| **Lahore Showroom** | `LHE-SALES-PC01` | Windows 10/11 Pro x64 | `BR-LHE-01` | `BRANCH_MANAGER` | **PENDING PHYSICAL TEST** | High-velocity bookings, discount authorizations, battery stock logs |
| **Rawalpindi Showroom**| `RWP-SALES-PC01` | Windows 10/11 Pro x64 | `BR-RWP-01` | `BRANCH_MANAGER` | **PENDING PHYSICAL TEST** | Quotation workflows, service desk tickets, offline crash recovery |

---

## 4. Mandatory 22-Step On-Site Verification Protocol

Each branch technician must execute the following 22-step verification sequence on the physical showroom machine:

1. **Hardware & OS Audit:** Record Windows OS version, build number, and architecture.
2. **MSI Installation:** Execute `msiexec /i "AJ EcoDrive ERP_1.0.0_x64_en-US.msi" MSIINSTALLPERUSER=1 ALLUSERS=2 /qn`.
3. **Application Launch:** Launch application from Start Menu / Desktop shortcut.
4. **Authentication:** Log in using credentials securely issued by Head Office administrator.
5. **Role & Branch Scope Check:** Confirm role (`BRANCH_MANAGER` or `SUPER_ADMIN`) and showroom banner (e.g. "Peshawar City Branch").
6. **Online Data Hydration:** Verify catalogue, inventory, and branch customers load from `https://ecodrive.skyrasoft.com/api/v1`.
7. **Disconnect Network:** Physically disconnect Ethernet cable or disable Wi-Fi.
8. **Offline Customer Creation:** Register a new customer record; verify local UI badge displays "Saved Locally".
9. **Offline Quotation Creation:** Issue quotation with line-item tax and promotional discounts.
10. **Offline Sales Order Creation:** Convert quotation to sales order and reserve chassis VIN.
11. **Offline Inventory Operation:** Log local parts adjustment or battery stock movement.
12. **Offline Expense / Repair Update:** Record petty cash voucher or workshop repair job status update.
13. **Force-Terminate Application:** Close application or terminate process via Task Manager with 5 pending mutations.
14. **Restart Workstation / Application:** Reboot machine or relaunch `aj-ecodrive-erp.exe` while offline.
15. **Confirm Pending Record Persistence:** Confirm all 5 created records remain visible and pending counter shows 5.
16. **Reconnect Network:** Restore network connectivity.
17. **Verify Synchronization:** Observe background synchronizer drain outbox to `/api/v1/sync/push`.
18. **Confirm Pending Queue Reaches Zero:** Verify sync status indicator returns to "All changes synced" (Pending: 0).
19. **Confirm No Duplicate Records Exist:** Verify server acknowledges all mutations with zero duplicate rows in MySQL database.
20. **Verify Multi-Tenant Branch Isolation:** Confirm manager cannot view, edit, or sync records from other dealerships.
21. **User Logout:** Click Logout in profile menu.
22. **Verify Session / DPAPI Isolation:** Confirm session tokens are purged from memory and Windows DPAPI encrypted vault is cleared.

---

## 5. Unresolved Blockers & Final Status

| Blocker Description | Current State | Required Resolution |
| :--- | :---: | :--- |
| **Physical Workstation Verification** | **PENDING** | On-site dealership execution of the 22-step protocol. |
| **Commercial Authenticode Signing** | **PENDING** | Corporate procurement of DigiCert or Sectigo EV Code Signing Certificate. |

**Final Windows Status:** **INTERNAL PILOT APPROVED** (Public Release Withheld).
