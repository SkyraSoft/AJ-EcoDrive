# AJ EcoDrive ERP — Final Physical Android Pilot Report

**Document ID:** `RELEASE-PILOT-AND-016`  
**Execution Timestamp:** 2026-11-16T15:25:00+05:00  
**Pilot Status:** **PHYSICAL ANDROID PILOT: PENDING**  
**Authorized Platform Decision:** **INTERNAL PILOT APPROVED**  
**Public Release Approval:** **WITHHELD**  
**Target Architecture:** Android 8.0+ (API 26 to API 34+) ARM64 / x86_64  
**Debug Package (Pilot):** `app-debug.apk` (SHA-256: `FFF6F90ABB0EB78559109679D6C900DD648F92B69AB6C29FA5DC1A38BF29DF02`, 14.19 MB)  
**Release Package (Unsigned):** `app-release-unsigned.apk` (SHA-256: `DD8426AC000C14642251094C4659648121570E90AFAB704F38BDD60F1E5A62CC`, 12.46 MB)  
**Google Play Bundle:** `app-release.aab` (SHA-256: `F7C7C8DC680CB53223F6AEBBCF2222A69A67782A8A88A7FAF58E4DCA15F40DAC`, 8.67 MB)  
**Signing Status:** Debug self-signed (pilot only); Release packages unsigned.  

---

## 1. Executive Summary & Physical Availability Determination

> [!IMPORTANT]
> **Status Determination: PHYSICAL ANDROID PILOT: PENDING**  
> Physical showroom tablets and handheld devices intended for floor operations across Peshawar, Islamabad, Lahore, and Rawalpindi dealerships are currently **not connected** via USB/ADB on this build machine.  
>  
> Executed host diagnostic check:
> ```powershell
> adb devices -l
> ```
> **Diagnostic Output:**
> ```
> List of devices attached
> (0 devices connected)
> ```
>  
> In strict compliance with project governance:
> - **Real physical Android device acceptance is NOT claimed.**
> - Automated test suite passes (549/549 passed) and APK compilation successes are explicitly distinguished from physical on-device acceptance.
> - This requirement remains **PENDING** until dealership rollout technicians connect physical devices and execute the protocol below.

---

## 2. Testing Methodology: Physical vs. Simulated vs. Pending

| Testing Category | Execution Status | Environment Used | Details & Scope |
| :--- | :---: | :--- | :--- |
| **Unit & Integration Test Suite** | **PASSED (549/549)** | Node 26 + JSDOM | Complete test suite passing with 0 failures across 45 test files. |
| **Native KeyStore Bridge Compilation**| **VERIFIED** | OpenJDK 21 LTS | Compiled `SecureKeyStorePlugin.java` into native Android DEX with zero warnings. |
| **Capacitor SQLite Adapter Tests** | **PASSED (7/7)** | Vitest Suite | Schema migrations, ACID sets, branch queries, outbox, conflicts, and tombstones. |
| **Backup Policy Hardening** | **VERIFIED** | Android Gradle Lint | `allowBackup="false"`, `data_extraction_rules.xml`, and `backup_rules.xml` verified. |
| **Real Physical Android Devices** | **PENDING** | Physical Dealership Tablets | Sideload, touch UI, camera-free permission audit, hardware TEE detection, battery cycle. |

---

## 3. Dealership Mobile Deployment Matrix (Pending On-Site Execution)

When pilot Android tablets are physically provisioned at each showroom, the following operational matrix will be executed:

| Branch Location | Target Device Identifier | Operating System Target | Branch Code | Target Role | On-Premise Status | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **Head Office** | `HQ-TAB-01` | Android 14 (OneUI / Pixel) | `HQ-01` | `SUPER_ADMIN` | **PENDING PHYSICAL TEST** | Executive oversight, real-time sync monitoring, multi-branch audit |
| **Peshawar Showroom** | `PEW-TAB-01` | Android 13/14 (Tablet) | `BR-PEW-01` | `BRANCH_MANAGER` | **PENDING PHYSICAL TEST** | Floor sales, offline quotes, chassis lookup, petty cash vouchers |
| **Islamabad Showroom** | `ISB-TAB-01` | Android 13/14 (Tablet) | `BR-ISB-01` | `BRANCH_MANAGER` | **PENDING PHYSICAL TEST** | Showroom customer intake, inventory check, workshop repairs |
| **Lahore Showroom** | `LHE-TAB-01` | Android 13/14 (Tablet) | `BR-LHE-01` | `BRANCH_MANAGER` | **PENDING PHYSICAL TEST** | High-velocity bookings, discount authorizations, battery stock logs |
| **Rawalpindi Showroom**| `RWP-TAB-01` | Android 13/14 (Tablet) | `BR-RWP-01` | `BRANCH_MANAGER` | **PENDING PHYSICAL TEST** | Quotation workflows, service desk tickets, offline crash recovery |

---

## 4. Mandatory Physical Android Verification Protocol

When an Android device is attached, dealership technicians will execute:

1. **Device Setup:** Enable Developer Options and USB Debugging.
2. **Device Discovery:** Run `adb devices -l` and record device model, OS build, and architecture.
3. **Installation:** Execute `adb install -r "frontend\android\app\build\outputs\apk\debug\app-debug.apk"`.
4. **Permissions Audit:** Confirm zero permission popups appear on first launch (no camera, contacts, or location prompted).
5. **Secure Authentication:** Log in with dealership manager credentials over HTTPS.
6. **Hardware KeyStore Verification:** Run `SecureStorage.getStatus()` and verify `isHardwareBacked` flag.
7. **Role & Branch Scoping:** Verify user role and dealership header lock.
8. **Online Reads:** Verify catalogue, spare parts, and customer list load from `https://ecodrive.skyrasoft.com/api/v1`.
9. **Airplane Mode Activation:** Disconnect Wi-Fi and mobile data.
10. **Offline Customer Registration:** Create customer record; confirm immediate local persistence.
11. **Offline Quotation Creation:** Issue quotation; verify tax and discount computations.
12. **Offline Sales Order Creation:** Convert quotation to sales order; confirm chassis reservation.
13. **Offline Inventory Operation:** Log battery swap or inventory count adjustment.
14. **Offline Repair / Expense:** Log repair job update and petty cash voucher (confirm outbox has 6 pending mutations).
15. **Background & Force-Stop:** Background application and force-stop via Android Settings (`am force-stop com.skyrasoft.ecodrive`).
16. **Device Power Cycle:** Reboot the physical tablet.
17. **Offline Relaunch:** Open application while still in Airplane Mode; confirm all 6 records remain present and outbox shows 6.
18. **Airplane Mode Deactivation:** Reconnect to dealership Wi-Fi.
19. **Synchronization Verification:** Confirm background synchronizer drains the outbox queue to zero.
20. **Duplicate Prevention:** Confirm server returns HTTP 200/201 and zero duplicate records appear in MySQL.
21. **Conflict Quarantine Check:** Confirm colliding records are preserved in local conflict log without data loss.
22. **User Logout & Vault Purge:** Click Logout; verify `SecureStorage.clear()` purges encrypted session tokens from AndroidKeyStore vault.
23. **User Switching & Isolation:** Log in as another manager; confirm previous branch records are inaccessible.

---

## 5. Unresolved Blockers & Final Status

| Blocker Description | Current State | Required Resolution |
| :--- | :---: | :--- |
| **Physical Tablet Connection** | **PENDING** | Connect physical hardware (`adb devices`) and execute 23-step protocol. |
| **Official Corporate Upload Key** | **PENDING** | Create corporate release keystore and sign `app-release.aab` for Google Play. |

**Final Android Status:** **INTERNAL PILOT APPROVED** (Public Release Withheld).
