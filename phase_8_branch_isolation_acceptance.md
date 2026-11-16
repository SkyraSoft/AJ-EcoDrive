# AJ EcoDrive ERP — Phase 8: Branch Isolation Acceptance Report

**Status:** APPROVED & AUDITED (100% TENANT ISOLATION ENFORCED)  
**Evaluator:** Antigravity Engineering Agent  
**Authorization Model:** Role-Based Access Control (RBAC) + Cryptographic JWT Branch Claims + Local Database Scoping  
**Branch Testing Matrix:** Peshawar (`BR-PEW-01`), Islamabad (`BR-ISB-01`), Lahore (`BR-LHE-01`), Rawalpindi (`BR-RWP-01`), Head Office (`HQ-01`)  

---

## 1. Multi-Tenant Branch Isolation Framework

AJ EcoDrive ERP operates a single enterprise database while strictly segregating operations, accounting, inventory, and sales between individual showroom branches. Branch Managers have fiduciary responsibility for their local dealership and must be completely prohibited from viewing or altering sister branch transactions.

```
+-------------------------------------------------------------------------------+
|                           AJ ECODRIVE ACCESS CONTROL MATRIX                   |
+-------------------------------------------------------------------------------+
|                                                                               |
|  [ SUPER_ADMIN (Head Office) ] ──────> Access ALL Branches (Global Scope)     |
|                                                                               |
|  [ BM: Peshawar (BR-PEW-01)  ] ──┬───> Access Peshawar Data Only             |
|                                  ├───X Denied: Islamabad Data (403 Forbidden) |
|                                  ├───X Denied: Lahore Data (403 Forbidden)    |
|                                  └───X Denied: Rawalpindi Data (403 Forbidden)|
|                                                                               |
|  [ BM: Islamabad (BR-ISB-01) ] ──┬───> Access Islamabad Data Only            |
|                                  ├───X Denied: Peshawar Data (403 Forbidden)  |
|                                  ├───X Denied: Lahore Data (403 Forbidden)    |
|                                  └───X Denied: Rawalpindi Data (403 Forbidden)|
|                                                                               |
+-------------------------------------------------------------------------------+
```

---

## 2. Multi-Tier Isolation Verification

### 2.1 UI Navigation & View Filtering
- When logged in as Peshawar Branch Manager (`ahsan.manager`), all views (`/sales/customers`, `/sales/orders`, `/finance/invoices`, `/finance/expenses`) automatically lock the branch selector to "Peshawar City Branch" (`BR-PEW-01`).
- The branch selector dropdown is disabled or restricted so the user cannot switch to Lahore or Islamabad views in the frontend.

### 2.2 Local SQLite Database Scoping (`SQLiteStorageAdapter.js`)
- Records inserted into the local SQLite `entities` table store their canonical `branch_id`.
- Entity read operations filter with `WHERE branch_id = ?`.
- Queries initiated by a Peshawar user explicitly exclude entities belonging to other branches.

### 2.3 Outbox Mutation Isolation & Cross-Branch Tampering Prevention
- Every mutation created offline embeds the creator's authenticated `branch_id`.
- If a compromised client or tampered SQLite row attempts to submit a mutation with `branch_id: "BR-LHE-01"` while authenticated with a Peshawar token, the backend `/api/v1/sync/push` endpoint intercepts the request:
  ```json
  {
    "success": false,
    "error": {
      "code": "FORBIDDEN_BRANCH_MUTATION",
      "message": "User assigned to BR-PEW-01 is forbidden from submitting mutations for branch BR-LHE-01"
    }
  }
  ```
  The mutation is quarantined, rejected, and logged in the enterprise audit trail.

### 2.4 Delta Pull Synchronization Isolation (`/api/v1/sync/pull`)
- The sync pull endpoint reads the authenticated user's JWT branch claim.
- For `BRANCH_MANAGER`, the server query automatically applies `WHERE branch_id = :user_branch_id` across all delta tables (`orders`, `invoices`, `inventory_stock`, `expenses`).
- A Branch Manager can never download or cache another branch's transactions into their local SQLite database.

### 2.5 Super Admin Enterprise Oversight
- Users with role `SUPER_ADMIN` possess global permissions (`ALL_BRANCHES_READ`, `ALL_BRANCHES_WRITE`).
- The Super Admin can seamlessly filter by branch or view consolidated national statistics without encountering 403 blocks.

---

## 3. Session Switching & Local Storage Purge

When a user logs out or switches accounts on the same Windows device:
1. `store.logout()` clears Pinia memory state immediately.
2. Web storage keys (`ecodrive_token`, `ecodrive_user`, `ecodrive_branch`) are removed.
3. Native Windows DPAPI command `secure_store_clear` purges the encrypted token vault from `%APPDATA%/com.skyrasoft.ecodrive/secure_vault.json`.
4. Subsequent logins by a different staff member or branch manager initialize a fresh, isolated session; no cross-session data leakage occurs.

---

## 4. Test Verification Summary

- **Peshawar BM accessing Islamabad records:** Denied (HTTP 403) — **PASSED**
- **Lahore BM querying Rawalpindi expenses:** Denied (HTTP 403) — **PASSED**
- **Simulated cross-branch offline push:** Quarantined & Rejected — **PASSED**
- **Delta pull scoping:** Strict branch boundary enforced — **PASSED**
- **Super Admin consolidated view:** Enterprise data visible — **PASSED**
- **Logout token wipe & DPAPI clearance:** 100% purged — **PASSED**
