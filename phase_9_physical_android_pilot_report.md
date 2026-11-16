# AJ EcoDrive ERP — Phase 9: Physical Android Device Pilot Report

**Evaluation Status:** PENDING PHYSICAL HARDWARE DEPLOYMENT  
**Date:** 2026-11-16  
**Auditor / Engineer:** Antigravity Engineering Agent  
**Distribution Target:** Android 8.0+ (API 26 to API 34+) ARM64 / x86_64  
**Package Evaluated:** `app-debug.apk` (SHA-256: `FFF6F90ABB0EB78559109679D6C900DD648F92B69AB6C29FA5DC1A38BF29DF02`)  
**Unsigned Release Package:** `app-release-unsigned.apk` (SHA-256: `DD8426AC000C14642251094C4659648121570E90AFAB704F38BDD60F1E5A62CC`)  
**Google Play Bundle:** `app-release.aab` (SHA-256: `F7C7C8DC680CB53223F6AEBBCF2222A69A67782A8A88A7FAF58E4DCA15F40DAC`)  

---

## 1. Physical Hardware Availability Status

> [!IMPORTANT]
> **Status Determination: PENDING**  
> Physical showroom tablets and handheld devices intended for on-site dealership operations across Peshawar, Islamabad, Lahore, and Rawalpindi are currently **physically unavailable** on this build workstation.  
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
> - Automated headless unit test passes (549/549 tests) and build successes are explicitly distinguished from real physical device deployment.
> - This blocker remains **PENDING** until dealership rollout technicians connect physical devices and execute the verification sequence below.

---

## 2. Showroom Mobile Deployment Matrix (Pending Execution)

When pilot Android tablets are physically provisioned at each showroom, the following operational matrix will be executed and recorded:

| Target Location | Planned Device Identifier | Android Version Target | Assigned Branch Code | Target Role | On-Premise Status | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **Head Office** | `HQ-TAB-01` | Android 14 (OneUI / Pixel) | `HQ-01` | `SUPER_ADMIN` | **PENDING PHYSICAL TEST** | Executive oversight, real-time sync monitoring, multi-branch audit |
| **Peshawar Showroom** | `PEW-TAB-01` | Android 13/14 (Tablet) | `BR-PEW-01` | `BRANCH_MANAGER` | **PENDING PHYSICAL TEST** | Floor sales, offline quotes, chassis lookup, petty cash vouchers |
| **Islamabad Showroom** | `ISB-TAB-01` | Android 13/14 (Tablet) | `BR-ISB-01` | `BRANCH_MANAGER` | **PENDING PHYSICAL TEST** | Showroom customer intake, inventory check, workshop repairs |
| **Lahore Showroom** | `LHE-TAB-01` | Android 13/14 (Tablet) | `BR-LHE-01` | `BRANCH_MANAGER` | **PENDING PHYSICAL TEST** | High-velocity bookings, discount authorizations, battery stock logs |
| **Rawalpindi Showroom**| `RWP-TAB-01` | Android 13/14 (Tablet) | `BR-RWP-01` | `BRANCH_MANAGER` | **PENDING PHYSICAL TEST** | Quotation workflows, service desk tickets, offline crash recovery |

---

## 3. Mandatory 24-Step Physical Android Verification Protocol

Each dealership technician must execute the following 24-step sequence on the physical device:

1. **Hardware & OS Audit:** Record manufacturer, model, Android OS version, API level, and architecture.
2. **Device Hardware Keystore Verification:** Run `SecureStorage.getStatus()` and record `isHardwareBacked` boolean (TEE/StrongBox detection).
3. **APK Sideload / Installation:** Execute `adb install -r app-debug.apk` or install via secure corporate MDM portal.
4. **Permissions Audit:** Confirm that NO runtime permissions (Camera, Location, Contacts, SMS) are prompted during launch.
5. **Application Launch:** Launch "AJ EcoDrive ERP" from application drawer; verify splash screen and logo.
6. **Authentication:** Log in using credentials securely issued by Head Office administrator.
7. **Role Verification:** Confirm role banner reflects `BRANCH_MANAGER` or `SUPER_ADMIN`.
8. **Branch Scoping Check:** Confirm showroom header is locked to the assigned dealership (e.g. "Peshawar City Branch").
9. **Online Data Hydration:** Verify product catalogue, parts directory, and showroom customers load from `https://ecodrive.skyrasoft.com/api/v1`.
10. **Enable Airplane Mode:** Enable Airplane Mode on the device (disabling Wi-Fi and Cellular data).
11. **Offline Customer Registration:** Create new customer record; verify immediate UI feedback with local badge.
12. **Offline Vehicle Quotation:** Generate vehicle quotation; verify line-item tax and discounts computed locally.
13. **Offline Sales Order:** Convert quotation to sales order; verify local stock reservation occurs in SQLite.
14. **Offline Inventory Movement:** Record battery inventory count update; verify mutation enqueued in outbox.
15. **Offline Repair Job Update:** Update repair ticket status and parts consumed; verify local persistence.
16. **Offline Expense Voucher:** Record branch petty cash expense; verify pending counter shows 6 mutations.
17. **Force-Stop Application:** Go to Android Settings > Apps > AJ EcoDrive ERP > Force Stop (`am force-stop com.skyrasoft.ecodrive`).
18. **Device Reboot:** Power cycle the physical tablet completely.
19. **Relaunch in Offline Mode:** Open AJ EcoDrive ERP while device remains in Airplane Mode. Confirm all 6 pending records remain present and outbox count shows 6.
20. **Disable Airplane Mode:** Restore internet connectivity (reconnect Wi-Fi).
21. **Observe Synchronizer:** Confirm background synchronization manager drains the outbox queue to `https://ecodrive.skyrasoft.com/api/v1/sync/push`.
22. **Duplicate Prevention Verification:** Confirm server returns HTTP 200/201 acknowledgements and pending counter reaches 0 with zero duplicate records created on the server.
23. **Session Eviction Check:** Click Logout in profile menu; verify user is returned to Login screen.
24. **Keystore Vault Wipe Verification:** Re-open app or inspect preferences; confirm `ecodrive_secure_vault` has been wiped and no residual session data remains accessible.

---

## 4. Privacy & Confidentiality Rules

In accordance with enterprise data protection standards:
- Passwords, JWT session tokens, database credentials, and customer personal phone numbers must **NEVER** be recorded in pilot test logs.
- Test logs must record only device identifiers, operating system versions, and pass/fail indicators per protocol step.
