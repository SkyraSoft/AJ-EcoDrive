# Phase 9: Android Mobile Package Build & Checksum Report
**Document ID:** `PHASE-9-BUILD-008`  
**Execution Timestamp:** 2026-11-16T14:55:00+05:00  
**Build Toolchain:** Gradle 8.14.3 / OpenJDK 21 LTS / Android SDK API 34  
**Application ID:** `com.skyrasoft.ecodrive`  
**Application Name:** AJ EcoDrive ERP  
**Version Code:** `1`  
**Version Name:** `1.0.0`  

---

## 1. Executive Summary

This report documents the compilation and packaging of the three standard Android distribution artifacts:
1. **Debug APK** (`assembleDebug`): Signed automatically with standard Android debug keystore for internal QA testing and device debugging.
2. **Release APK (Unsigned)** (`assembleRelease`): Optimized production APK ready for internal sideloading or corporate enterprise mobile device management (MDM) signing.
3. **Release Android App Bundle (AAB)** (`bundleRelease`): Google Play-compliant bundle optimized with dynamic resource splitting, ready for Google Play App Signing upload.

---

## 2. Artifact Inventory & Cryptographic Checksums

| Artifact File | Build Type | Output Location | Size (Bytes) | Size (MB) | SHA-256 Checksum |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **`app-debug.apk`** | Debug APK (Self-signed debug) | `frontend/android/app/build/outputs/apk/debug/app-debug.apk` | 14,499,001 | 13.83 MB | `F3295AC7DFAD8B5AD7CB1366F42EE306FF189814238AFAB0785AA06694EFE712` |
| **`app-release-unsigned.apk`** | Production APK (Unsigned) | `frontend/android/app/build/outputs/apk/release/app-release-unsigned.apk` | 13,069,403 | 12.46 MB | `39A5BD4CBD973200BD2177F9B967B8FBF6432E19271DB3068EB588AD80644A7D` |
| **`app-release.aab`** | Google Play Bundle (AAB) | `frontend/android/app/build/outputs/bundle/release/app-release.aab` | 9,085,877 | 8.66 MB | `301A584700C3580279B4529DB9739E16BF5811CDF7C1B6464E1BE6DCC1D50022` |

---

## 3. Build Log & Step Execution Summary

### 3.1 Debug APK Compilation (`gradlew assembleDebug`)
- **Execution Command:** `.\gradlew.bat assembleDebug`
- **Duration:** 3 minutes 42 seconds
- **Actionable Tasks:** 156 tasks (99 executed, 57 up-to-date)
- **Key Modules Compiled:**
  - `:app`
  - `:capacitor-android`
  - `:capacitor-community-sqlite`
  - `:capacitor-preferences`
  - `:capacitor-cordova-android-plugins`
- **Result:** `BUILD SUCCESSFUL`

### 3.2 Release APK & AAB Compilation (`gradlew assembleRelease bundleRelease`)
- **Execution Command:** `.\gradlew.bat assembleRelease bundleRelease`
- **Duration:** 3 minutes 4 seconds
- **Actionable Tasks:** 216 tasks (212 executed, 4 up-to-date)
- **Key Optimizations Applied:**
  - `lintVitalRelease` completed with 0 errors.
  - Resource optimization and dead-strip applied.
  - Native libraries (`libsqlcipher.so`) packaged for all major Android ABIs (arm64-v8a, armeabi-v7a, x86, x86_64).
- **Result:** `BUILD SUCCESSFUL`

---

## 4. Signing & Distribution Guidance

1. **Internal Pilot & QA:**
   - Use `app-debug.apk` directly on pilot Android tablets/smartphones via `adb install -r app-debug.apk` or direct sideload.
2. **Google Play Console Release:**
   - Upload `app-release.aab` to Google Play Console under Internal Testing or Production tracks.
   - Configure Google Play App Signing with corporate Google Play account.
3. **Enterprise MDM Distribution:**
   - Sign `app-release-unsigned.apk` with the corporate upload key using `apksigner`:
     ```powershell
     apksigner sign --ks corporate_release.keystore --out app-release-signed.apk app-release-unsigned.apk
     ```
