# AJ EcoDrive ERP — Phase 8: Code Signing Final Status Report

**Release Artifact:** `AJ EcoDrive ERP_1.0.0_x64_en-US.msi`  
**Artifact SHA-256:** `83A089A9289B24A9042E116CCDE2C6607324B40F1C7E6804445CAB4EA2EBB13F`  
**Current Signing Status:** **UNSIGNED INTERNAL PILOT**  
**Commercial Authenticode Status:** **NO CERTIFICATE AVAILABLE**  
**Public Windows Release Readiness:** **BLOCKED (UNSIGNED)**  
**Date:** 2026-11-16  

---

## 1. Automated Certificate Verification Audit

A full audit of Windows certificate stores and filesystem key repositories confirmed:
1. `Cert:\CurrentUser\My`: Zero code signing certificates found.
2. `Cert:\LocalMachine\My`: Zero code signing certificates found.
3. Workspace files: Zero `.pfx`, `.p12`, or private key files detected.
4. Host `PATH`: `signtool.exe` is not currently provisioned on system PATH.

---

## 2. Policy Prohibitions & Rationale

> [!CAUTION]
> **No Fake or Self-Signed Certificates Permitted:**  
> In compliance with strict engineering guidelines:
> - **No self-signed or dummy certificate was created.**
> - Self-signed root certificates trigger severe untrusted publisher warnings in Windows Defender SmartScreen, cannot be verified on clean client machines without manual root authority tampering, and do not provide legal or cryptographic publisher identity.
> - The MSI package is therefore maintained honestly and transparently as **Unsigned Internal Pilot Software**.

---

## 3. Required User Action to Enable Public Release

To transition AJ EcoDrive ERP Desktop from *Internal Pilot* to *Public Commercial Distribution*, the organization must complete the following four steps:

### Step 1: Procure a Trusted Authenticode Certificate
Procure one of the following from a recognized Microsoft-trusted Certificate Authority (DigiCert, Sectigo, GlobalSign, or Microsoft Azure Trusted Signing):
- **Extended Validation (EV) Code Signing Certificate (Recommended):** Provides instant Windows Defender SmartScreen reputation without download accumulation delays. Stored on a FIPS 140-2 Level 2 cryptographic USB token or cloud HSM (Azure Key Vault).
- **Standard Organization Validation (OV) Code Signing Certificate:** Verifies corporate identity for SkyraSoft; SmartScreen trust builds over download volume.

### Step 2: Configure Windows SDK `signtool.exe`
Install the Windows Software Development Kit (SDK) or configure `signtool.exe`:
```cmd
set PATH=C:\Program Files (x86)\Windows Kits\10\bin\10.0.22621.0\x64;%PATH%
where.exe signtool.exe
```

### Step 3: Sign the MSI Installer
Execute standard SHA-256 Authenticode signing with RFC 3161 timestamping:
```cmd
signtool.exe sign /tr http://timestamp.digicert.com /td sha256 /fd sha256 /a "frontend\src-tauri\target\release\bundle\msi\AJ EcoDrive ERP_1.0.0_x64_en-US.msi"
```

### Step 4: Verify Signature on a Clean Windows Machine
Validate the digital signature using Windows Explorer and `signtool.exe`:
```cmd
signtool.exe verify /pa /v "frontend\src-tauri\target\release\bundle\msi\AJ EcoDrive ERP_1.0.0_x64_en-US.msi"
```
Verify that the digital signature tab displays:
- **Signer Name:** SkyraSoft
- **Timestamp:** Valid RFC 3161 timestamp
- **Digest Algorithm:** SHA-256

---

## 4. Current Distribution Guidelines

- **Internal Pilot / Staging:** Internal showroom staff may run the unsigned installer by clicking *"More info -> Run anyway"* on Windows Defender SmartScreen.
- **Public Download Portal:** **BLOCKED** until the 4-step commercial signing process above is completed.
