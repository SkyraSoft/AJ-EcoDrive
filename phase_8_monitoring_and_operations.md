# AJ EcoDrive ERP — Phase 8: Monitoring and Operations Manual

**Status:** APPROVED & OPERATIONAL  
**Evaluator:** Antigravity Engineering Agent  
**Monitoring Architecture:** Real-Time Health Telemetry + PM2 Process Supervisor + Sync Failure Tracking + Zero-Secret Structured Logging  
**Production Endpoint:** `https://ecodrive.skyrasoft.com/api/v1/health`  

---

## 1. Operational Telemetry & Monitoring Architecture

AJ EcoDrive ERP incorporates comprehensive observability spanning the cloud API cluster, backend database, and distributed desktop client synchronization queues.

```
+-------------------------------------------------------------------------------+
|                            MONITORING & TELEMETRY HUB                         |
+-------------------------------------------------------------------------------+
|                                                                               |
|   [ PM2 Process Supervisor ] ────> Memory / CPU / Auto-Restart Watchdog      |
|                                                                               |
|   [ /api/v1/health Probe ]   ────> MySQL Pool Status / Service Uptime / Node  |
|                                                                               |
|   [ Sync Telemetry Engine ]  ────> Outbox Queue Drains / Conflict Quarantines |
|                                                                               |
|   [ Security & Rate Monitor] ────> 401 Unauthorized / 429 Rate Limit Tracking |
|                                                                               |
|   [ Structured Audit Stream] ────> Zero-Secret Audit Trail (MySQL audit_logs) |
|                                                                               |
+-------------------------------------------------------------------------------+
```

---

## 2. Key Monitoring Metrics & Alerting Thresholds

| Metric | Target Normal | Warning Threshold | Critical Threshold | Automated Action |
| :--- | :---: | :---: | :---: | :--- |
| **API Health Status** | `healthy` (HTTP 200) | Latency > 500ms | HTTP 500 or unreachable | PM2 auto-restart; PagerDuty / Telegram alert |
| **MySQL Pool Availability** | `connected: true` | Queue connections > 20 | Connection timeout / error | Pool auto-reconnect; Alert DevOps |
| **Memory Footprint (PM2)** | 17 MB - 60 MB | > 150 MB | > 300 MB | PM2 `max_memory_restart: 300M` |
| **Sync Failure Rate** | < 0.1% | > 1% in 5 min | > 5% in 5 min | Notify Tech Lead; inspect client payload |
| **Conflict Count** | 0 active | > 3 pending review | > 10 pending review | Flag for Super Admin review in Action Centre |
| **Rejected Mutations** | 0 | > 5 per branch | > 15 per branch | Isolate client; inspect version mismatch |
| **HTTP 401 / 403 Rate** | Baseline | > 10 / min from single IP | > 30 / min | Rate limiter drops IP; Security audit logged |
| **HTTP 429 Rate Limits** | Normal operational | > 5 / min | > 20 / min | IP temporarily blocked for 60s cooldown |
| **Pending Queue Age** | < 10 minutes | > 1 hour | > 4 hours | Client UI triggers "Sync Delayed" banner |

---

## 3. Production Health Check Endpoint (`/api/v1/health`)

The health endpoint is polled continuously by uptime monitors:
- **URL:** `https://ecodrive.skyrasoft.com/api/v1/health`
- **Response Format:**
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
      "status": "connected",
      "isConnected": true,
      "host": "localhost",
      "port": 3306,
      "name": "u856400307_ecodrive"
    },
    "system": {
      "nodeVersion": "v20.20.2",
      "platform": "linux",
      "memoryUsageMB": 17
    }
  }
  ```

---

## 4. Zero-Secret Logging Standards

All logging across the application adheres to strict privacy and compliance policies:
1. **Forbidden in Logs:**
   - Plaintext passwords or password hashes
   - JWT tokens or authorization headers
   - Database connection strings or passwords
   - Private TLS / signing keys
   - Unmasked credit card or complete bank account numbers
2. **Sanitization Filter:**
   All HTTP request loggers mask sensitive keys:
   ```javascript
   function sanitizeLogPayload(obj) {
     const SENSITIVE_KEYS = ['password', 'token', 'jwt', 'secret', 'db_password', 'authorization'];
     return JSON.parse(JSON.stringify(obj, (key, value) => {
       if (SENSITIVE_KEYS.includes(key.toLowerCase())) return '***REDACTED***';
       return value;
     }));
   }
   ```
3. **Structured Audit Logs:**
   Operational business events are persisted to the MySQL table `audit_logs` storing: `event_type`, `user_id`, `branch_id`, `ip_address`, `resource_id`, `timestamp`.

---

## 5. Branch-Specific Synchronization Diagnostics

The sync engine tracks per-branch queue health:
- Query: `SELECT branch_id, status, count(*) FROM sync_mutations GROUP BY branch_id, status;`
- Enables administrators to immediately identify if a single branch (e.g., Peshawar or Lahore) has internet connectivity issues or a malfunctioning local client causing delayed queue synchronization.
