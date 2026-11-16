# Phase 9: Android Mobile Package Build & Checksum Report
**Document ID:** `PHASE-9-BUILD-008`  
**Execution Timestamp:** 2026-11-16T15:12:00+05:00  
**Build Toolchain:** Gradle 8.14.3 / OpenJDK 21 LTS / Android SDK API 34  
**Application ID:** `com.skyrasoft.ecodrive`  
**Application Name:** AJ EcoDrive ERP  
**Version Code:** `1`  
**Version Name:** `1.0.0`  

---

## 1. Executive Summary

This report documents the compilation and packaging of the three standard Android distribution artifacts updated with the **native Android KeyStore secure storage bridge** and **hardened backup policy**:
1. **Debug APK** (`assembleDebug`): Signed automatically with standard Android debug keystore for internal showroom pilot testing and QA debugging.
2. **Release APK (Unsigned)** (`assembleRelease`): Optimized production APK ready for internal sideloading or corporate enterprise mobile device management (MDM) signing.
3. **Release Android App Bundle (AAB)** (`bundleRelease`): Google Play-compliant bundle optimized with dynamic resource splitting, ready for Google Play App Signing upload.

---

## 2. Artifact Inventory & Cryptographic Checksums

| Artifact File | Build Type | Output Location | Size (Bytes) | Size (MB) | SHA-256 Checksum |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **`app-debug.apk`** | Debug APK (Self-signed debug) | `frontend/android/app/build/outputs/apk/debug/app-debug.apk` | 14,881,009 | 14.19 MB | `FFF6F90ABB0EB78559109679D6C900DD648F92B69AB6C29FA5DC1A38BF29DF02` |
| **`app-release-unsigned.apk`** | Production APK (Unsigned) | `frontend/android/app/build/outputs/apk/release/app-release-unsigned.apk` | 13,070,335 | 12.46 MB | `DD8426AC000C14642251094C4659648121570E90AFAB704F38BDD60F1E5A62CC` |
| **`app-release.aab`** | Google Play Bundle (AAB) | `frontend/android/app/build/outputs/bundle/release/app-release.aab` | 9,087,818 | 8.67 MB | `F7C7C8DC680CB53223F6AEBBCF2222A69A67782A8A88A7FAF58E4DCA15F40DAC` |

---

## 3. Build Log & Step Execution Summary

### 3.1 Rebuild Execution
- **Command:** `.\gradlew.bat assembleDebug assembleRelease bundleRelease`
- **Duration:** 41 seconds
- **Actionable Tasks:** 368 tasks (26 executed, 342 up-to-date)
- **Key Modules Re-compiled:**
  - `:app:compileDebugJavaWithJavac` (compiled `SecureKeyStorePlugin.java`)
  - `:app:compileReleaseJavaWithJavac`
  - `:app:lintVitalRelease` (passed with 0 fatal errors after validating `data_extraction_rules.xml`)
  - `:app:packageDebug`
  - `:app:packageRelease`
  - `:app:packageReleaseBundle`
- **Result:** `BUILD SUCCESSFUL`

---

## 4. Signing & Release Status

1. **Current Signing Status:**
   - `app-debug.apk` is signed using the Android SDK debug keystore.
   - `app-release-unsigned.apk` is unsigned.
   - `app-release.aab` is unsigned.
2. **Release Authorization:**
   - **Internal Pilot Approved:** Yes (`app-debug.apk` authorized for internal pilot).
   - **Commercial / Public Release:** **WITHHELD** pending corporate release keystore signing and physical showroom device verification.
