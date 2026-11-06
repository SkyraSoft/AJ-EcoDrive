# Phase 6: Synchronization Protocol Specification

## 1. Protocol Overview

The AJ EcoDrive Synchronization Protocol governs data exchange between distributed client nodes (browser SPAs, desktop agents, mobile apps) and the central cloud backend (`https://ecodrive.skyrasoft.com/api/v1`).

### Core Design Principles
1. **At-Least-Once Delivery**: The client persists mutations durably in an IndexedDB outbox until the backend acknowledges success.
2. **Exactly-Once Processing**: Every mutation carries a unique `idempotencyKey`. The backend records execution in `sync_mutations` to ensure duplicate transmissions never double-insert or double-mutate records.
3. **Strict Multi-Tenant Branch Scoping**: A Branch Manager cannot mutate records or pull delta changes outside their assigned `branch_id`.
4. **Optimistic Concurrency Control**: All entity records track a numeric `version`. Stale client mutations are detected and routed through domain-specific conflict rules.

---

## 2. API Endpoints

### 2.1 Batch Mutation Push
- **Endpoint**: `POST /api/v1/sync/push`
- **Authentication**: Mandatory `Authorization: Bearer <jwt_token>`
- **Request Headers**:
  - `Content-Type: application/json`
  - `X-Branch-ID: <branch_id>` (optional, validated against token)
- **Request Body**:
```json
{
  "mutations": [
    {
      "mutationId": "mut_1793964000_abc123",
      "idempotencyKey": "customer:CREATE:CUST-901:1793964000",
      "entityType": "customer",
      "entityId": "CUST-901",
      "operation": "CREATE",
      "payload": {
        "id": "CUST-901",
        "code": "CUST-901",
        "name": "Tariq Mahmood",
        "phone": "+92 300 7654321",
        "branch_id": "BR-01"
      },
      "clientVersion": 1,
      "branchId": "BR-01"
    }
  ]
}
```

- **Response Body (`HTTP 200 OK`)**:
```json
{
  "ok": true,
  "results": [
    {
      "mutationId": "mut_1793964000_abc123",
      "status": "synced",
      "serverVersion": 1
    }
  ]
}
```

#### Mutation Status Codes
| Status | Meaning | Client Action |
| :--- | :--- | :--- |
| `synced` | Successfully applied or idempotently deduplicated | Remove from outbox, update local entity version |
| `conflict` | Version mismatch on strictly protected entity | Move to `conflicts` store, display manager review banner |
| `rejected` | Unauthorized (e.g. cross-branch violation) | Move to `rejected`, notify user of security denial |
| `failed` | Transient server or database failure | Retain in outbox, increment `retryCount`, schedule backoff |

---

### 2.2 Incremental Delta Pull
- **Endpoint**: `GET /api/v1/sync/pull?since=<iso_timestamp>`
- **Authentication**: Mandatory `Authorization: Bearer <jwt_token>`
- **Query Parameters**:
  - `since` (optional): ISO 8601 timestamp (e.g. `2026-11-06T10:00:00.000Z`). If omitted, returns baseline active records.
- **Branch Scoping Rule**:
  - Super Admin (`ROLE-ADMIN`): Receives all branch records.
  - Branch Manager (`ROLE-BM`): Automatically restricted to records where `branch_id = req.user.branch_id`.
- **Response Body (`HTTP 200 OK`)**:
```json
{
  "ok": true,
  "data": {
    "entities": {
      "customers": [ ... ],
      "quotations": [ ... ],
      "orders": [ ... ],
      "invoices": [ ... ],
      "payments": [ ... ],
      "leads": [ ... ],
      "products": [ ... ]
    },
    "tombstones": [
      {
        "id": "QT-402",
        "entityType": "quotation",
        "deletedAt": "2026-11-06T11:15:00.000Z"
      }
    ],
    "serverTimestamp": "2026-11-06T11:45:00.000Z"
  }
}
```

---

### 2.3 Subsystem Health & Telemetry
- **Endpoint**: `GET /api/v1/sync/status`
- **Authentication**: Mandatory `Authorization: Bearer <jwt_token>`
- **Response Body (`HTTP 200 OK`)**:
```json
{
  "ok": true,
  "data": {
    "status": "online",
    "serverTimestamp": "2026-11-06T11:45:00.000Z",
    "branchId": "BR-01",
    "isSuperAdmin": false
  }
}
```

---

## 3. Database Schema Extensions

### 3.1 Idempotency Ledger (`sync_mutations`)
```sql
CREATE TABLE IF NOT EXISTS `sync_mutations` (
  `id` VARCHAR(64) NOT NULL,
  `idempotency_key` VARCHAR(191) NOT NULL,
  `entity_type` VARCHAR(64) NOT NULL,
  `entity_id` VARCHAR(64) NOT NULL,
  `operation` VARCHAR(32) NOT NULL,
  `client_version` INT NOT NULL DEFAULT 1,
  `server_version` INT NOT NULL DEFAULT 1,
  `branch_id` VARCHAR(64) NULL,
  `user_id` VARCHAR(64) NULL,
  `status` VARCHAR(32) NOT NULL DEFAULT 'synced',
  `payload` JSON NULL,
  `response_data` JSON NULL,
  `error_message` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_sync_idempotency` (`idempotency_key`),
  KEY `idx_sync_entity` (`entity_type`, `entity_id`),
  KEY `idx_sync_branch` (`branch_id`),
  KEY `idx_sync_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3.2 Server Deletion Tracking (`sync_tombstones`)
```sql
CREATE TABLE IF NOT EXISTS `sync_tombstones` (
  `id` VARCHAR(64) NOT NULL,
  `entity_type` VARCHAR(64) NOT NULL,
  `entity_id` VARCHAR(64) NOT NULL,
  `branch_id` VARCHAR(64) NULL,
  `deleted_by` VARCHAR(64) NULL,
  `deleted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tombstone_entity` (`entity_type`, `entity_id`),
  KEY `idx_tombstone_branch` (`branch_id`),
  KEY `idx_tombstone_deleted` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```
