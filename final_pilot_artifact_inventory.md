# AJ EcoDrive ERP — Final Pilot Artifact Inventory & Pre-Pilot Verification

**Document ID:** `PILOT-INVENTORY-014`  
**Execution Timestamp:** 2026-11-16T15:22:00+05:00  
**Project:** AJ EcoDrive ERP  
**Organization:** SkyraSoft Technologies  
**Target Release Version:** 1.0.0 (Build 1)  
**Production API Base URL:** `https://ecodrive.skyrasoft.com/api/v1`  
**Production Web Portal:** `https://aj-eco-drive.vercel.app`  

---

## 1. Verified Packaging Artifact Inventory

The four distribution packages have been compiled, verified on disk, and cryptographically fingerprinted:

| Artifact Name | Platform Target | File Path | File Size (Bytes) | Size (MB) | SHA-256 Cryptographic Checksum |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Windows MSI Installer** | Windows Desktop x64 | `frontend/src-tauri/target/release/bundle/msi/AJ EcoDrive ERP_1.0.0_x64_en-US.msi` | 9,240,576 | 8.81 MB | `83A089A9289B24A9042E116CCDE2C6607324B40F1C7E6804445CAB4EA2EBB13F` |
| **Android Debug APK** | Android Mobile (Pilot) | `frontend/android/app/build/outputs/apk/debug/app-debug.apk` | 14,881,009 | 14.19 MB | `FFF6F90ABB0EB78559109679D6C900DD648F92B69AB6C29FA5DC1A38BF29DF02` |
| **Android Release APK** | Android Mobile (Unsigned)| `frontend/android/app/build/outputs/apk/release/app-release-unsigned.apk` | 13,070,335 | 12.46 MB | `DD8426AC000C14642251094C4659648121570E90AFAB704F38BDD60F1E5A62CC` |
| **Android App Bundle** | Google Play (AAB) | `frontend/android/app/build/outputs/bundle/release/app-release.aab` | 9,087,818 | 8.67 MB | `F7C7C8DC680CB53223F6AEBBCF2222A69A67782A8A88A7FAF58E4DCA15F40DAC` |

---

## 2. Release Security & Cleanliness Audit

A comprehensive static security audit was performed across all compiled distribution assets (`frontend/dist/`, `frontend/src-tauri/`, and `frontend/android/`):

| Audit Requirement | Verification Rule | Result | Findings Count |
| :--- | :--- | :---: | :---: |
| **No Passwords** | Scan for hardcoded passwords (`password123`, `admin`, `demo123`, `root`) | **CLEAN** | 0 |
| **No Database Credentials** | Scan for MySQL connection strings, user credentials, or passwords | **CLEAN** | 0 |
| **No JWT Secrets** | Scan for JWT signing secrets (`JWT_SECRET`, HMAC keys) | **CLEAN** | 0 |
| **No Private Keys** | Scan for RSA, EC, or OpenSSL private keys (`BEGIN PRIVATE KEY`, `id_rsa`) | **CLEAN** | 0 |
| **No Demo Bypass Flags** | Scan for authentication bypasses or mock fallback credentials in production mode | **CLEAN** | 0 |
| **No Localhost URLs in Dist** | Scan for `localhost`, `127.0.0.1`, `http://10.0.2.2` in packaged web assets | **CLEAN** | 0 |
| **Production API Endpoint** | Verify canonical API base URL: `https://ecodrive.skyrasoft.com/api/v1` | **VERIFIED** | Matched |

---

## 3. Physical Showroom & Mobile Pilot Status

### 3.1 Windows Showroom Pilot
- **Status Determination:** **PHYSICAL WINDOWS PILOT PENDING**
- **Assessment:** Physical dealership computers across Peshawar, Islamabad, Lahore, and Rawalpindi are located off-site. The 20-step verification protocol is established in `phase_8_physical_branch_pilot_report.md` and awaits on-premise execution by deployment technicians. Real-branch physical acceptance is not marked as passed.

### 3.2 Android Mobile Pilot
- **Status Determination:** **PHYSICAL ANDROID PILOT PENDING**
- **Assessment:** Host command `adb devices -l` returned 0 connected physical devices. The 24-step mobile verification protocol is established in `phase_9_physical_android_pilot_report.md` and awaits physical tablet connection and on-device testing. Real-device physical acceptance is not marked as passed.

---

## 4. Cryptographic Code Signing Status

- **Windows MSI:** Unsigned. Authorized strictly for controlled internal pilot testing. Commercial EV Authenticode certificate required for public distribution.
- **Android Debug APK:** Self-signed with Android SDK debug keystore for internal QA and dealership tablet pilots.
- **Android Release APK & AAB:** Unsigned. Official corporate upload keystore required for Google Play Console submission.

---

## 5. Master Governance Determination

- **Internal Pilot Deployment:** **APPROVED** (`AJ EcoDrive ERP_1.0.0_x64_en-US.msi` and `app-debug.apk` are authorized for internal pilot rollout).
- **Public / Commercial Release Approval:** **WITHHELD** (Pending on-site physical hardware sign-off and commercial code signing).
