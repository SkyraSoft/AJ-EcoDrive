# AJ EcoDrive ERP — Commercial Code Signing Specification & Guide

**Document ID:** `RELEASE-CODESIGN-012`  
**Date:** 2026-11-16  
**Status:** REQUIRED PRIOR TO PUBLIC / COMMERCIAL RELEASE  
**Target Platforms:** Windows Desktop (MSI / EXE) & Android Mobile (APK / AAB)  

---

## 1. Executive Summary

AJ EcoDrive ERP distribution artifacts for Windows Desktop (`.msi`) and Android Mobile (`.apk` / `.aab`) have been generated and validated for **internal controlled pilot testing**.

However, public commercial distribution to end-user dealerships and Google Play Store requires commercial cryptographic code signing. This document details the exact procurement steps, certificate types, and signing commands required to promote internal pilot packages to public production releases.

> [!WARNING]
> In accordance with release governance, **no self-signed certificates or test keys are masqueraded as commercial signatures**. The current release packages remain honestly labeled as **INTERNAL PILOT / UNSIGNED** until genuine commercial credentials are provided by executive management.

---

## 2. Windows Authenticode Signing Specification

### 2.1 Certificate Requirements
- **Certificate Type:** Extended Validation (EV) Code Signing Certificate or Organization Validation (OV) Certificate with Cloud HSM.
- **Trusted Root CAs:** DigiCert, Sectigo, GlobalSign, or Microsoft Azure Trusted Signing.
- **Hardware Requirement:** FIPS 140-2 Level 2 compliant USB hardware token (e.g. YubiKey / SafeNet) or Azure Cloud HSM.

### 2.2 Windows Signing Execution Commands

Once the EV token or Cloud HSM credentials are provided, sign the Windows MSI installer:

```powershell
# Windows SDK SignTool invocation with SHA-256 and RFC 3161 Timestamping
signtool.exe sign `
    /tr http://timestamp.digicert.com `
    /td sha256 `
    /fd sha256 `
    /a `
    /d "AJ EcoDrive ERP" `
    /du "https://skyrasoft.com" `
    "frontend/src-tauri/target/release/bundle/msi/AJ EcoDrive ERP_1.0.0_x64_en-US.msi"

# Verify signature
signtool.exe verify /pa /v "frontend/src-tauri/target/release/bundle/msi/AJ EcoDrive ERP_1.0.0_x64_en-US.msi"
```

---

## 3. Android Code Signing & Google Play Specification

### 3.1 Key Management Requirements
- **Upload Key:** 2048-bit or 4096-bit RSA key generated via `keytool` and stored in a password-protected `.jks` or `.keystore` file.
- **Play App Signing:** Google Play manages the final app signing key; developers sign with the corporate upload key.

### 3.2 Step 1: Corporate Key Generation (One-Time Setup)
```powershell
keytool -genkeypair -v `
    -keystore "ecodrive-upload-key.jks" `
    -alias "ecodrive-upload" `
    -keyalg RSA `
    -keysize 2048 `
    -validity 10000 `
    -dname "CN=SkyraSoft Engineering, O=SkyraSoft, L=Islamabad, C=PK"
```

### 3.3 Step 2: Signing Android App Bundle (`.aab`) for Google Play
```powershell
jarsigner -verbose `
    -sigalg SHA256withRSA `
    -digestalg SHA-256 `
    -keystore "ecodrive-upload-key.jks" `
    "frontend/android/app/build/outputs/bundle/release/app-release.aab" `
    "ecodrive-upload"

# Verify bundle signature
jarsigner -verify -verbose -certs "frontend/android/app/build/outputs/bundle/release/app-release.aab"
```

### 3.4 Step 3: Signing Release APK (`.apk`) for Direct Showroom Sideload / MDM
```powershell
# 1. Align the unsigned release APK (requires zipalign from Android build-tools)
zipalign.exe -v -p 4 `
    "frontend/android/app/build/outputs/apk/release/app-release-unsigned.apk" `
    "frontend/android/app/build/outputs/apk/release/app-release-aligned.apk"

# 2. Sign using apksigner with v2 + v3 signature schemes
apksigner.bat sign `
    --ks "ecodrive-upload-key.jks" `
    --ks-key-alias "ecodrive-upload" `
    --out "frontend/android/app/build/outputs/apk/release/AJ-EcoDrive-ERP-1.0.0-release.apk" `
    "frontend/android/app/build/outputs/apk/release/app-release-aligned.apk"

# 3. Verify APK signature
apksigner.bat verify --verbose "frontend/android/app/build/outputs/apk/release/AJ-EcoDrive-ERP-1.0.0-release.apk"
```

---

## 4. Current Artifact Status Checklist

| Artifact Target | File Path | Current Signing Status | Action Required for Public Release |
| :--- | :--- | :--- | :--- |
| **Windows MSI** | `frontend/src-tauri/target/release/bundle/msi/...` | **Unsigned** | Sign with DigiCert/Sectigo EV Authenticode Certificate. |
| **Android Debug APK** | `frontend/android/app/build/outputs/apk/debug/...` | **Self-signed (Debug)** | Internal pilot use only. |
| **Android Release APK** | `frontend/android/app/build/outputs/apk/release/...` | **Unsigned** | Align and sign with corporate release keystore via `apksigner`. |
| **Android App Bundle** | `frontend/android/app/build/outputs/bundle/release/...`| **Unsigned** | Sign with corporate upload key and upload to Google Play Console. |
