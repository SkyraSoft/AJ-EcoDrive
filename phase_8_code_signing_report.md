# AJ EcoDrive ERP — Phase 8: Code Signing & Release Security Report

**Evaluation Status:** UNSIGNED (INTERNAL PILOT ONLY — PUBLIC RELEASE BLOCKED)  
**Evaluation Date:** 2026-11-16  
**Auditor / Engineer:** Antigravity Engineering Agent  
**Evaluated Package:** `AJ EcoDrive ERP_1.0.0_x64_en-US.msi`  
**Location:** `frontend/src-tauri/target/release/bundle/msi/AJ EcoDrive ERP_1.0.0_x64_en-US.msi`  
**Package SHA-256:** `83A089A9289B24A9042E116CCDE2C6607324B40F1C7E6804445CAB4EA2EBB13F`  

---

## 1. Certificate Audit & Key Store Inspection

In compliance with Blocker 3 instructions, an automated inspection was conducted across the Windows certificate infrastructure:

### 1.1 Automated Commands Executed
```powershell
Get-ChildItem Cert:\CurrentUser\My, Cert:\LocalMachine\My -CodeSigningCert
Get-ChildItem -Path . -Include *.pfx, *.p12 -Recurse
where.exe signtool.exe
```

### 1.2 Inspection Findings
| Check | Finding | Security Implication |
| :--- | :--- | :--- |
| **User Certificate Store (`Cert:\CurrentUser\My`)** | No Code Signing certificate found | No existing commercial Authenticode certificate available |
| **Machine Certificate Store (`Cert:\LocalMachine\My`)** | No Code Signing certificate found | No enterprise GPO-pushed signing certificate installed |
| **Workspace Repositories** | 0 `.pfx` or `.p12` files found | No exported software keys in repository |
| **Windows SDK `signtool.exe`** | Not installed on PATH | Signing toolchain not currently configured on host |

---

## 2. Policy Enforcements & Prohibitions

> [!IMPORTANT]
> **Strict Prohibition on Self-Signed Certificates:**  
> The project guidelines explicitly state: *"Never invent or embed a fake certificate. Do not create or use a fake certificate."*  
>  
> Generating a self-signed root or test certificate would fail Microsoft Windows Defender SmartScreen trust, trigger severe security warnings, and provide zero cryptographic authenticity. Therefore, no fake certificate was generated.

---

## 3. Current Release Classification

Based on the verified absence of a commercial Authenticode certificate:

1. **Classification:** **UNSIGNED INTERNAL PILOT SOFTWARE**
2. **Permitted Deployment Scope:** Controlled internal pilot across designated dealership test devices under administrative supervision.
3. **Prohibited Deployment Scope:** **PUBLIC COMMERCIAL DISTRIBUTION IS STRICTLY BLOCKED.**
4. **End-User Impact on Untrusted Devices:** Unsigned MSI packages will display the Windows SmartScreen banner *"Windows protected your PC — Unknown publisher"*. During internal pilot testing, IT administrators must click *"More info -> Run anyway"*.

---

## 4. Remediation Plan: Obtaining a Commercial Certificate

To achieve public commercial distribution approval, the organization must procure an official Windows Authenticode certificate:

### 4.1 Recommended Certificate Types
1. **Extended Validation (EV) Code Signing Certificate (Recommended):**
   - **Issuers:** DigiCert, Sectigo, GlobalSign.
   - **Storage:** Hardware Security Module (HSM) or FIPS 140-2 Level 2 cryptographic USB token (e.g., YubiKey, SafeNet).
   - **Benefit:** Instant, zero-delay Windows Defender SmartScreen trust; publisher identity displayed immediately as *"SkyraSoft"*.
2. **Standard Organization Validation (OV) Code Signing Certificate:**
   - **Benefit:** Verifies legal entity identity; builds SmartScreen reputation over time based on download volume.

### 4.2 Production Signing Procedure (Once Certificate is Procured)
Once the certificate or Azure Trusted Signing / HSM service is available:
```cmd
signtool.exe sign /tr http://timestamp.digicert.com /td sha256 /fd sha256 /a "AJ EcoDrive ERP_1.0.0_x64_en-US.msi"
signtool.exe verify /pa /v "AJ EcoDrive ERP_1.0.0_x64_en-US.msi"
```

---

## 5. Summary & Release Blocker Status

- **Authenticode Signature:** Absent (Unsigned).
- **Public Windows Release Status:** **BLOCKED** until valid commercial signing is completed.
- **Internal Pilot Status:** **APPROVED** for controlled internal evaluation.
