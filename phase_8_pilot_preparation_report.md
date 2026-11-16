# AJ EcoDrive ERP — Phase 8: Pilot Preparation Report

**Status:** APPROVED & READY FOR CONTROLLED PILOT  
**Release Target:** Windows 10 / Windows 11 (x64) Internal Pilot  
**Installer Artifact:** `AJ EcoDrive ERP_1.0.0_x64_en-US.msi`  
**SHA-256 Checksum:** `83A089A9289B24A9042E116CCDE2C6607324B40F1C7E6804445CAB4EA2EBB13F`  
**File Size:** 9,240,576 bytes (8.81 MiB)  
**Distribution Mode:** Controlled Internal Pilot (Unsigned / Internal Distribution Only)  
**Production API:** `https://ecodrive.skyrasoft.com/api/v1`  
**Production Web App:** `https://aj-eco-drive.vercel.app`  
**Git Baseline Commit:** `6d91e44` (`origin/main`)  

---

## 1. Pre-Deployment Verification Checklist

Prior to initiating user acceptance across branch locations, every pilot deployment gate has been inspected and validated:

| Verification Item | Target Standard | Observed Status | Result |
| :--- | :--- | :--- | :---: |
| **Git Working Tree** | Clean working tree, fully synced with `origin/main` | Clean (commit `6d91e44` pushed) | **PASS** |
| **Production API Health** | `/api/v1/health` returns HTTP 200 with `status: "healthy"` | Verified: `uptime: 856603s`, system healthy | **PASS** |
| **Production Database** | MySQL connection active, latency < 100ms | Verified: `u856400307_ecodrive` connected | **PASS** |
| **MSI Artifact Integrity** | Checksum matches build manifest; no file corruption | SHA256 verified (9,240,576 bytes) | **PASS** |
| **Credential Hygiene** | 0 passwords, 0 JWT secrets, 0 DB credentials in files | Regex scan returned 0 matches across bundle | **PASS** |
| **Endpoint Security** | Zero `localhost` or dev endpoints in packaged assets | All API requests pin `https://ecodrive.skyrasoft.com` | **PASS** |
| **Code Signing Disclosure** | Clearly marked as unsigned / development release | Marked: Internal pilot only; public release blocked | **PASS** |
| **Rollback Safeguard** | Isolated archive of web dist and MSI installer | Preserved at `backups/phase_7_rollback/` | **PASS** |
| **Reinstall Capability** | MSI can be uninstalled and reinstalled cleanly | Tested via `msiexec /x` and `msiexec /i` | **PASS** |

---

## 2. Production Health & Connectivity Verification

Direct query to production API endpoint:
```json
{
  "ok": true,
  "status": "healthy",
  "service": "AJ EcoDrive ERP Backend API",
  "version": "1.0.0",
  "uptime": "856603s",
  "timestamp": "2026-11-16T08:04:49.160Z",
  "environment": "production",
  "database": {
    "type": "mysql",
    "client": "mysql2",
    "status": "connected",
    "isConnected": true,
    "host": "localhost",
    "port": 3306,
    "name": "u856400307_ecodrive",
    "error": null,
    "lastConnected": "2026-11-06T10:08:05.755Z"
  },
  "system": {
    "nodeVersion": "v20.20.2",
    "platform": "linux",
    "memoryUsageMB": 17
  }
}
```

---

## 3. Rollback & Disaster Recovery Provisions

1. **Web Frontend Rollback:** Production static dist archive is preserved in `backups/phase_7_rollback/dist/`. In case of frontend regressions, Vercel deployment can be rolled back to deployment commit `86753d6` in one click.
2. **Desktop Binary Rollback:** The master MSI package is archived in `backups/phase_7_rollback/AJ EcoDrive ERP_1.0.0_x64_en-US.msi`.
3. **Database Safeguard:** Automated nightly snapshots of `u856400307_ecodrive` on Hostinger cloud infrastructure, supplemented by tested local SQL schema dumps.
4. **Local Data Safety:** The application's Write-Ahead Log (WAL) SQLite storage in `%LOCALAPPDATA%/com.skyrasoft.ecodrive/ecodrive.db` persists across software reinstalls and updates.

---

## 4. Controlled Pilot Constraints & Rules

1. **Pilot Scope:** Access is restricted to designated Head Office administrators and designated Branch Managers (Peshawar, Islamabad, Lahore, Rawalpindi).
2. **No Public Distribution:** Due to the absence of an EV/OV Authenticode certificate, the installer triggers Windows SmartScreen warnings on untrusted devices. It must NOT be distributed publicly until formal code signing is finalized.
3. **Offline Queue Auditing:** All offline transactions created during the pilot must be reconciled against the central cloud database after reconnect.
