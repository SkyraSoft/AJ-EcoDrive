# AJ EcoDrive ERP — Final Android Code Signing Report

**Document ID:** `RELEASE-SIGN-AND-018`  
**Execution Timestamp:** 2026-11-16T15:25:00+05:00  
**Artifacts Evaluated:**
- `frontend/android/app/build/outputs/apk/debug/app-debug.apk` (14.19 MB)
- `frontend/android/app/build/outputs/apk/release/app-release-unsigned.apk` (12.46 MB)
- `frontend/android/app/build/outputs/bundle/release/app-release.aab` (8.67 MB)
**Current Signing Status:** **DEBUG SELF-SIGNED (PILOT ONLY) / RELEASE PACKAGES UNSIGNED**  
**Public Commercial Release Decision:** **WITHHELD**  

---

## 1. Executive Summary & Keystore Audit

A repository and filesystem audit was conducted to locate any pre-existing corporate release keystores:
- **Result:** Zero production release keystores or upload keystore files (`*.jks`, `*.keystore`) exist within the project repository.
- The standard Android development debug keystore (`%USERPROFILE%\.android\debug.keystore`) is used exclusively to self-sign `app-debug.apk` for internal QA and dealership tablet pilots.
- Both `app-release-unsigned.apk` and `app-release.aab` remain strictly **unsigned**.

---

## 2. Policy Enforcement: Zero Committed Keystores & Credential Safety

> [!WARNING]
> **Strict Governance Compliance:**
> In accordance with project security instructions:
> - **Production release keystores are NEVER generated with disposable passwords and NEVER committed to Git.**
> - Release keystores must be maintained in secure, out-of-band corporate key vaults or CI/CD secret managers.
> - Private key material, store passwords, and alias passwords must never appear in documentation or logs.

---

## 3. Official Corporate Keystore Signing Protocol (Google Play Release)

When the corporate upload keystore is provisioned by SkyraSoft IT security, the following steps must be executed:

### 3.1 Step 1: Corporate Key Creation (Out-of-Band)
```powershell
keytool -genkeypair -v `
    -keystore "ecodrive-upload-key.jks" `
    -alias "ecodrive-upload" `
    -keyalg RSA `
    -keysize 2048 `
    -validity 10000 `
    -dname "CN=SkyraSoft Engineering, O=SkyraSoft, L=Islamabad, C=PK"
```

### 3.2 Step 2: Signing Android App Bundle (`.aab`) for Google Play
```powershell
jarsigner -verbose `
    -sigalg SHA256withRSA `
    -digestalg SHA-256 `
    -keystore "ecodrive-upload-key.jks" `
    "frontend/android/app/build/outputs/bundle/release/app-release.aab" `
    "ecodrive-upload"

# Signature Verification
jarsigner -verify -verbose -certs "frontend/android/app/build/outputs/bundle/release/app-release.aab"
```

### 3.3 Step 3: Aligning & Signing Release APK (`.apk`) for Direct Showroom Distribution
```powershell
# 1. 4-byte Page Alignment
zipalign.exe -v -p 4 `
    "frontend/android/app/build/outputs/apk/release/app-release-unsigned.apk" `
    "frontend/android/app/build/outputs/apk/release/app-release-aligned.apk"

# 2. V2 + V3 Signature Application
apksigner.bat sign `
    --ks "ecodrive-upload-key.jks" `
    --ks-key-alias "ecodrive-upload" `
    --out "frontend/android/app/build/outputs/apk/release/AJ-EcoDrive-ERP-1.0.0-release.apk" `
    "frontend/android/app/build/outputs/apk/release/app-release-aligned.apk"

# 3. Signature Verification
apksigner.bat verify --verbose "frontend/android/app/build/outputs/apk/release/AJ-EcoDrive-ERP-1.0.0-release.apk"
```

---

## 4. Current Pilot Distribution Guidance

For internal dealership mobile pilot testing on authorized Android tablets:
1. Sideload the debug pilot package:
   ```powershell
   adb install -r "frontend/android/app/build/outputs/apk/debug/app-debug.apk"
   ```
2. The debug build contains the identical Vue 3 application logic, native SQLite storage engine, and AndroidKeyStore AES-256-GCM encryption bridge as the release build, enabling safe and complete dealership pilot evaluation.

---

## 5. Official Platform Status

- **Android Mobile Status:** **INTERNAL PILOT APPROVED**
- **Public Google Play Distribution:** **WITHHELD** (Pending corporate upload key signing and Google Play review).
