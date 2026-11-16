# AJ EcoDrive ERP — Phase 8: Backup and Recovery Plan

**Status:** APPROVED & VERIFIED  
**Evaluator:** Antigravity Engineering Agent  
**Recovery Objectives:** RPO (Recovery Point Objective) < 1 Hour | RTO (Recovery Time Objective) < 15 Minutes  
**Target Systems:** Cloud Production MySQL (`u856400307_ecodrive`), Local Windows SQLite Databases (`ecodrive.db`)  

---

## 1. Backup Architecture & Policies

AJ EcoDrive ERP operates a dual-tier storage model: central cloud MySQL for authoritative enterprise record-keeping and distributed SQLite instances for local branch resiliency.

```
+-----------------------------------------------------------------------------------+
|                           CENTRAL CLOUD BACKUP REGIME                             |
+-----------------------------------------------------------------------------------+
| - Full Nightly Logical Dumps: mysqldump with single-transaction consistency       |
| - Continuous Binary Logging: Point-in-time recovery to within 5 minutes           |
| - Automated Cloud Storage Mirroring: Encrypted off-site storage in secondary DC   |
| - 30-Day Immutable Retention: Daily, weekly, and monthly snapshot cycles         |
+-----------------------------------------------------------------------------------+
                                          ▲
                                          │ Sync Push / Pull
                                          ▼
+-----------------------------------------------------------------------------------+
|                           LOCAL BRANCH DESKTOP RESILIENCY                         |
+-----------------------------------------------------------------------------------+
| - Write-Ahead Logging (WAL): Guaranteed crash protection for SQLite               |
| - Durable Outbox Queue: Offline records preserved across app and OS restarts      |
| - Hardware Token Encryption: Windows DPAPI protects session credentials          |
| - Device Migration Utility: Automated re-hydration upon fresh client setup       |
+-----------------------------------------------------------------------------------+
```

---

## 2. Backup Schedules & Retention Rules

| Backup Class | Frequency | Retention Window | Storage Medium | Compression / Encryption |
| :--- | :---: | :---: | :---: | :---: |
| **Production MySQL Full Dump** | Daily (02:00 PKT) | 30 Days | Secure Cloud Storage Bucket | Gzip (`.sql.gz`) / AES-256 |
| **MySQL Binary Logs** | Every 1 Hour | 7 Days | Cloud Block Storage | Raw / TLS in transit |
| **Application Server State** | Weekly | 14 Days | Virtual Machine Image Snapshot | Host Hypervisor Snapshot |
| **Local SQLite Outbox** | Continuous (WAL) | Until Synced | Local Windows `%LOCALAPPDATA%` | NTFS ACL / DPAPI |

---

## 3. Disaster Recovery Procedures

### 3.1 Cloud MySQL Server Failure / Data Corruption
1. **Assessment:** Verify health status via `/api/v1/health` and database connection logs.
2. **Provisioning:** Launch replacement MySQL database instance or failover replica.
3. **Restoration:** Execute logical restoration from latest verified dump (`mysqldump` restore).
4. **Binlog Replay:** Apply binary transaction logs from backup timestamp up to incident time.
5. **Client Delta Re-sync:** As desktop clients reconnect, their local outbox mutations replay automatically, catching up any transactions that occurred during the outage.

### 3.2 Branch Device Loss, Theft, or Hardware Failure
1. **Immediate Revocation:** Super Admin accesses `/organisation/users`, revokes active refresh tokens, and locks the compromised user account.
2. **Local Data Defense:** Due to Windows DPAPI encryption, physical access to the device hard drive does not expose the session tokens without the user's Windows credentials.
3. **Replacement Provisioning:**
   - Install `AJ EcoDrive ERP_1.0.0_x64_en-US.msi` on replacement Windows laptop/workstation.
   - Branch Manager logs in with re-activated credentials and one-time MFA code.
   - Client executes delta pull (`/api/v1/sync/pull`), re-populating the local SQLite entity cache within 30 seconds.
4. **Zero Data Loss:** All transactions previously acknowledged by the server are restored from the cloud.

### 3.3 Recovery of Unsynchronized Mutations on a Damaged Device
If a branch computer crashes with un-uploaded outbox mutations:
1. IT connects the disk as secondary storage on a diagnostic bench.
2. Extract the SQLite database from:
   `C:\Users\<User>\AppData\Local\com.skyrasoft.ecodrive\ecodrive.db`
3. Copy `ecodrive.db` into the same directory on the replacement PC.
4. Launch AJ EcoDrive ERP; the desktop shell detects the existing outbox records and drains the pending queue to the cloud server upon connection.

---

## 4. Incident Escalation & Response Flowchart

```
[ Incident Detected (API 500 / DB Unreachable) ]
                       │
                       ▼
             [ P1 Escalation Call ]
           (DevOps Lead + Super Admin)
                       │
         ┌─────────────┴─────────────┐
         ▼                           ▼
[ Cloud Backend Outage ]    [ Local Branch Device Failure ]
         │                           │
         ▼                           ▼
- Restore MySQL Dump        - Revoke User Session Token
- Replay Binlogs            - Issue Replacement Laptop
- Verify /health = 200      - Clean MSI Installation
- Clients Auto-Reconnect    - Delta Pull Sync Cache
         │                           │
         └─────────────┬─────────────┘
                       ▼
           [ Post-Mortem Audit ]
       (Log reconciliation + RCA report)
```
