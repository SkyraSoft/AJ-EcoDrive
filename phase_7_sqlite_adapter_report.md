# AJ EcoDrive ERP — Phase 7: SQLite Storage Adapter Report

**Status:** APPROVED & TESTED (100% GREEN)  
**Component:** `SQLiteStorageAdapter.js`  
**Underlying Driver:** `@tauri-apps/plugin-sql` (embedded `libsqlite3` via Rust)  
**Database File:** `ecodrive.db` (stored in Windows `%LOCALAPPDATA%/com.skyrasoft.ecodrive/`)  
**Test Suite:** `frontend/tests/test_sqlite_storage_adapter.test.js` (7 passed / 7 tests)  

---

## 1. Overview & Objectives

In web browser environments, offline data is stored inside browser IndexedDB. However, in Windows desktop environments, IndexedDB suffers from browser storage quotas, potential cache eviction during Windows disk cleanup, and lack of atomic multi-table transaction guarantees.

Phase 7 introduces the native **`SQLiteStorageAdapter`**, allowing AJ EcoDrive ERP to store its offline entity cache, outbox queue, conflict store, and sync state in an embedded SQLite database with full ACID guarantees, Write-Ahead Logging (WAL), and robust restart recovery.

---

## 2. SQLite Database Schema

The database schema is initialized and maintained through automated migrations managed directly within `SQLiteStorageAdapter.init()`:

```sql
-- 1. Entity Cache: Stores cached records across all business collections
CREATE TABLE IF NOT EXISTS entities (
    collection TEXT NOT NULL,
    id TEXT NOT NULL,
    branch_id TEXT,
    data TEXT NOT NULL,
    updated_at INTEGER NOT NULL,
    PRIMARY KEY (collection, id)
);
CREATE INDEX IF NOT EXISTS idx_entities_branch ON entities (collection, branch_id);

-- 2. Outbox Queue: Stores pending mutations awaiting server synchronization
CREATE TABLE IF NOT EXISTS outbox (
    mutation_id TEXT PRIMARY KEY,
    idempotency_key TEXT UNIQUE NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    action TEXT NOT NULL,
    payload TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    retry_count INTEGER DEFAULT 0,
    last_error TEXT,
    branch_id TEXT,
    user_id TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_outbox_status ON outbox (status, created_at);

-- 3. Conflicts Store: Quarantined records requiring Manager intervention
CREATE TABLE IF NOT EXISTS conflicts (
    conflict_id TEXT PRIMARY KEY,
    mutation_id TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    local_payload TEXT NOT NULL,
    server_payload TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending_review',
    created_at INTEGER NOT NULL
);

-- 4. Sync State Store: Tracks high-water mark timestamps and metadata
CREATE TABLE IF NOT EXISTS sync_state (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at INTEGER NOT NULL
);

-- 5. Tombstones Store: Tracks deletions across offline sessions
CREATE TABLE IF NOT EXISTS tombstones (
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    deleted_at INTEGER NOT NULL,
    branch_id TEXT,
    PRIMARY KEY (entity_type, entity_id)
);

-- 6. Schema Migrations: Tracks schema versioning
CREATE TABLE IF NOT EXISTS schema_migrations (
    version INTEGER PRIMARY KEY,
    applied_at INTEGER NOT NULL
);
```

---

## 3. Storage Adapter Interface Implementation

`SQLiteStorageAdapter.js` implements 100% of the methods mandated by `StorageAdapterInterface`:

### 3.1 Entity Operations
- `getEntity(collection, id)`: Executes `SELECT data FROM entities WHERE collection = ? AND id = ?` and parses JSON data.
- `putEntity(collection, id, data, branchId)`: Executes `INSERT OR REPLACE INTO entities ...` with serialized JSON and current epoch timestamp.
- `deleteEntity(collection, id)`: Deletes entity and writes a deletion entry to the `tombstones` table.
- `getEntities(collection, filter)`: Supports optional filtering by `branch_id`.

### 3.2 Outbox Queue Operations
- `enqueueMutation(mutation)`: Persists pending mutation with unique `idempotency_key`.
- `getPendingMutations(limit)`: Retrieves pending mutations ordered by `created_at ASC`.
- `updateMutationStatus(mutationId, status, error)`: Updates retry counts and error logs on retry failure.
- `removeMutation(mutationId)`: Cleans up synchronized mutations upon server acknowledgement.
- `batchExecuteOutbox(mutations)`: Atomically inserts multiple mutations in a single transaction.

### 3.3 Conflict & Sync State Operations
- `quarantineConflict(conflict)`: Isolates 409 conflict payload for manager inspection without corrupting the local entity store.
- `getConflicts()`: Lists active unresolved conflicts.
- `resolveConflict(conflictId, resolution)`: Updates conflict status after managerial review.
- `getSyncState(key)` / `setSyncState(key, value)`: Tracks last successful server pull timestamp (`since`).

---

## 4. Test Verification Results

The SQLite Storage Adapter was tested using Vitest against in-memory SQLite emulation and schema validation:

```
 RUN  v5.0.3 C:/Users/USER/Downloads/EV Showroom Management system/frontend

 ✓ tests/test_sqlite_storage_adapter.test.js (7 tests) 10ms
   ✓ AJ EcoDrive — Phase 7 SQLite Storage Adapter Suite (7)
     ✓ 1. Initialization: Initializes SQLite database tables and schema migrations
     ✓ 2. Entity Operations: CRUD operations in entities table with branch isolation
     ✓ 3. Outbox Queue: Enqueue, retrieve pending, and acknowledge mutations
     ✓ 4. Idempotency & Batching: Prevents duplicate idempotency keys and handles batch operations
     ✓ 5. Conflict Quarantine: Stores and resolves optimistic concurrency conflicts
     ✓ 6. Sync State & Tombstones: Persists synchronization metadata and records deletions
     ✓ 7. Dynamic Adapter Resolution: OfflineStorageEngine resolves SQLite in Tauri and IndexedDB in Web

 Test Files  1 passed (1)
      Tests  7 passed (7)
   Start at  12:54:00
   Duration  1.20s
```

All 7 test cases passed with zero errors or regressions.
