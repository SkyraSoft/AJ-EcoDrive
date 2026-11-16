# AJ EcoDrive ERP — Final Windows Code Signing Report

**Document ID:** `RELEASE-SIGN-WIN-017`  
**Execution Timestamp:** 2026-11-16T15:25:00+05:00  
**Artifact Evaluated:** `frontend/src-tauri/target/release/bundle/msi/AJ EcoDrive ERP_1.0.0_x64_en-US.msi`  
**Artifact SHA-256:** `83A089A9289B24A9042E116CCDE2C6607324B40F1C7E6804445CAB4EA2EBB13F`  
**Current Signing Status:** **UNSIGNED (INTERNAL PILOT ONLY)**  
**Public Commercial Release Decision:** **WITHHELD**  

---

## 1. Executive Summary & Host Certificate Inspection

A cryptographic audit of the Windows host certificate stores was performed to check for legitimate commercial Authenticode code-signing credentials:

```powershell
Get-ChildItem Cert:\CurrentUser\My, Cert:\LocalMachine\My |
    Where-Object { $_.EnhancedKeyUsageList.FriendlyName -contains "Code Signing" }
```

**Inspection Result:**
- **Zero code-signing certificates found.**
- No hardware security module (HSM), FIPS token, or Azure Trusted Signing credentials are configured in this environment.

---

## 2. Policy Enforcement: Zero Fake / Self-Signed Signatures

> [!WARNING]
> **Strict Governance Compliance:**
> In accordance with project instructions:
> - **No self-signed test certificates or fake certificates were created or applied.**
> - Self-signed certificates trigger severe Windows SmartScreen warnings (`Unknown Publisher`), fail enterprise Group Policy enforcement, and create a false perception of security.
> - The MSI installer remains **strictly unsigned** and is restricted to **INTERNAL CONTROLLED PILOT USE ONLY**.

---

## 3. Commercial EV Authenticode Procurement Requirements

Prior to public commercial distribution, corporate leadership must procure an official commercial certificate meeting the following specifications:

| Requirement Category | Specification |
| :--- | :--- |
| **Certificate Type** | Extended Validation (EV) Code Signing Certificate |
| **Accredited Root CAs** | DigiCert, Sectigo, GlobalSign, or Microsoft Azure Trusted Signing |
| **Private Key Protection** | FIPS 140-2 Level 2 cryptographic hardware token (USB) or Cloud HSM |
| **Digital Signature Standard**| SHA-256 with RFC 3161 Authenticode Timestamping |
| **Publisher Identity** | SkyraSoft Technologies |

### Signing Execution Protocol (When Credentials Are Provided)
```powershell
signtool.exe sign `
    /tr http://timestamp.digicert.com `
    /td sha256 `
    /fd sha256 `
    /a `
    /d "AJ EcoDrive ERP" `
    /du "https://skyrasoft.com" `
    "frontend/src-tauri/target/release/bundle/msi/AJ EcoDrive ERP_1.0.0_x64_en-US.msi"

# Signature Verification
signtool.exe verify /pa /v "frontend/src-tauri/target/release/bundle/msi/AJ EcoDrive ERP_1.0.0_x64_en-US.msi"
```

---

## 4. Current Pilot Distribution Guidance

For internal dealership pilot deployment on authorized branch computers:
1. Technicians may run the MSI installer directly via administrative elevated command prompt:
   ```cmd
   msiexec /i "AJ EcoDrive ERP_1.0.0_x64_en-US.msi" MSIINSTALLPERUSER=1 ALLUSERS=2 /qn
   ```
2. If Windows SmartScreen displays an "Unknown Publisher" prompt, technicians click **"More info" -> "Run anyway"** (authorized for controlled internal pilot testing only).

---

## 5. Official Platform Status

- **Windows Desktop Status:** **INTERNAL PILOT APPROVED**
- **Public Commercial Distribution:** **WITHHELD** (Pending commercial EV certificate signature).
