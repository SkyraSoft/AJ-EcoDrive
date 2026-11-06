# Phase 6: Offline-First Architecture Gap Analysis & Synchronization Audit

**System:** AJ EcoDrive EV Dealership Management System  
**Audit Date:** 2026-11-06  
**Auditor:** Lead Systems Architect & Security Engineer  
**Environments:**  
- Production Frontend: `https://aj-eco-drive.vercel.app` (Vue 3 / Vite SPA)  
- Production Backend: `https://ecodrive.skyrasoft.com/api/v1` (Node.js / Express / PM2 / MySQL)  
- Local Monorepo: `D:\ECodrive`  

---

## 1. Executive Summary

Phase 6 initiates the transformation of AJ EcoDrive from an online-dependent client into a resilient, enterprise-grade, **offline-first local-first synchronized system**. 

A deep forensic inspection of the frontend (`frontend/src/`) and backend (`backend/src/`) reveals that while optimistic updates and a rudimentary in-memory `syncOutbox` exist in `frontend/src/store.js`, **zero persistent offline storage (IndexedDB / SQLite) is currently utilized for business entities**. If a user loses internet connectivity or refreshes the browser while offline, all queued mutations, unsaved records, and pending state are completely obliterated. Furthermore, the backend lacks incremental delta pull endpoints, durable idempotency registries, and entity tombstone tracking.

This report documents every concrete vulnerability, online dependency, architectural gap, and the required implementation roadmap before native packaging (MSI / APK) can be safely considered.

---

## 2. Frontend Architecture Inspection & Concrete Findings

### Finding 1: Volatile In-Memory Outbox with Non-Serializable Closures
- **File:** `frontend/src/store.js` (lines 31, 230–242)
- **Current Behavior:** Outbox items are stored in a reactive in-memory array `syncOutbox: []`. Each item includes `retryFn: apiCallFn`, which is an anonymous JavaScript closure.
- **Why It Fails Offline:** On browser refresh, tab close, or device reboot, the JavaScript heap is destroyed. All pending offline mutations are permanently lost. Furthermore, closures cannot be serialized to IndexedDB or localStorage, making persistence impossible without refactoring outbox items into declarative command objects.
- **Recommended Correction:** Replace `retryFn` with serializable, declarative mutation descriptors (`entityType`, `entityId`, `operation`, `payload`, `mutationId`, `idempotencyKey`). Persist the outbox durably to an IndexedDB object store (`ecodrive_outbox`).

### Finding 2: In-Memory Entity Collections Reset to Static Mocks on Refresh
- **File:** `frontend/src/store.js` (lines 2360–12000, 382–404)
- **Current Behavior:** All operational collections (`customers`, `orders`, `quotations`, `invoices`, `payments`, `serializedUnits`, etc.) are held in memory initialized from hardcoded mock arrays. When `fetchRemote*()` is called offline, it catches the network error and falls back to whatever is currently in memory.
- **Why It Fails Offline:** If an operator opens the application while offline or refreshes the page, the application discards any previously downloaded or locally mutated records and reverts to the compile-time seed data.
- **Recommended Correction:** Implement an IndexedDB local repository pattern (`OfflineStorageEngine`) that caches every fetched entity and reads from local IndexedDB first before querying the network.

### Finding 3: Direct API Service Calls in Views Bypass Store Outbox
- **File:** `frontend/src/views/procurement/CreatePurchaseOrder.vue` (lines 376–380), `frontend/src/views/finance/CashBank.vue` (lines 22–25), `frontend/src/views/procurement/CreateSupplier.vue` (line 49)
- **Current Behavior:** Certain views call `api.procurement.createPurchaseOrder()`, `api.finance.getCashBank()`, or `api.procurement.createSupplier()` directly instead of dispatching through a managed local store or outbox.
- **Why It Fails Offline:** When offline, these direct calls reject immediately with an `ApiError (status: 0, isOffline: true)`. The view displays a red toast error, fails the user action, and loses the entered form data.
- **Recommended Correction:** Route all transactional mutations through a unified storage repository that writes to local IndexedDB and enqueues an outbox mutation when the network is unreachable.

### Finding 4: Absence of Service Worker / Cache Storage for SPA Assets
- **File:** `frontend/index.html`, `frontend/vite.config.js`
- **Current Behavior:** There is no Service Worker registration or Web App Manifest (`manifest.json`).
- **Why It Fails Offline:** When disconnected, refreshing the browser returns Chrome's `ERR_INTERNET_DISCONNECTED` dinosaur page because the HTML, JavaScript, CSS, and font assets are not cached by a service worker.
- **Recommended Correction:** Configure Vite PWA / Service Worker to precache application shells (`index.html`, compiled JS/CSS bundles, Lucide icons, fonts) enabling instant offline application loading.

### Finding 5: No Offline / Sync Status Indicators or Unload Protection
- **File:** `frontend/src/layouts/MainLayout.vue`
- **Current Behavior:** The UI contains no visible indicator showing whether the client is online, offline, or has pending unsynchronized mutations. There is no `window.onbeforeunload` handler.
- **Why It Fails Offline:** Operators have no idea whether their changes are saved on the server or only locally. If they close the browser tab while mutations are queued, data loss occurs without warning.
- **Recommended Correction:** Add an enterprise sync status bar and header pill showing connection state (`Online`, `Offline`, `Syncing (N)`), last synchronized timestamp, manual "Sync Now" button, and a `beforeunload` warning when `pendingMutationsCount > 0`.

---

## 3. Backend Synchronization Readiness Inspection

### 1. Primary Keys & Identifiers
- **Schema Inspection:** All primary operational tables (`customers`, `orders`, `quotations`, `invoices`, `payments`, `serialized_units`, `service_cases`, `repair_jobs`, `expenses`) use `VARCHAR(64)` primary keys (e.g. `CUST-101`, `ORD-2026-001`, `INV-001`).
- **Sync Readiness:** High. Client-side ID generation (UUIDv4 or prefixed cryptographically random IDs) is already supported by the schema and avoids ID collision upon synchronization.

### 2. Timestamps & Change Tracking
- **Schema Inspection:** Tables have `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP` and `updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`.
- **Sync Gap:** There is no `version` integer column for optimistic concurrency checking. If two clients modify the same customer or order offline, the last synced push silently overwrites the previous write without conflict detection.
- **Required Change:** Add `version INT NOT NULL DEFAULT 1` to mutable entities, incrementing on each update.

### 3. Deletion Handling (Tombstones)
- **Schema Inspection:** All deletion queries use hard `DELETE FROM <table> WHERE id = ?`.
- **Sync Gap:** When an entity is deleted on the server or on another device, an offline client that synchronizes later has no record of the deletion. Hard-deleted rows simply vanish from the server query result, leaving stale orphan records in the offline client's cache.
- **Required Change:** Introduce a dedicated `sync_tombstones` table (`entity_type`, `entity_id`, `branch_id`, `deleted_at`) or soft-delete timestamps (`deleted_at`) to broadcast deletions during incremental pulls.

### 4. Idempotency Support
- **Schema Inspection:** The database does not track client mutation request IDs or idempotency keys.
- **Sync Gap:** If an offline client transmits a batch of mutations and the network drops before receiving the HTTP 200 response, the client will retry the batch upon reconnect. Without an `idempotency_keys` registry, non-idempotent operations (such as recording a customer payment or issuing inventory stock) will execute twice, corrupting ledger totals and double-deducting stock.
- **Required Change:** Implement a durable `sync_mutations` / `idempotency_keys` table on MySQL to guarantee strict exactly-once execution for retried synchronization payloads.

---

## 5. Entity-by-Entity Synchronization & Conflict Risk Matrix

| Entity Category | Offline Creation Safe? | Offline Edit Safe? | Conflict Strategy | Rationale & Invariants |
| :--- | :--- | :--- | :--- | :--- |
| **Customers** | **YES** | **YES** | Field-Level Merge / Server-Wins on Conflict | Customers are local to branch. New customers can be created with client UUIDs. Phone/CNIC conflicts flagged if duplicated. |
| **Quotations** | **YES** | **YES** | Version Check (Optimistic Locking) | Quotations are drafts until approved. Offline edits permitted; rejected if quotation converted to Order on server. |
| **Sales Orders** | **CONDITIONAL** | **NO** | Server Validation / Transaction Lock | Orders allocate high-value vehicle units. Unit allocation requires verifying VIN availability on server. |
| **Serialized Units / VINs** | **NO** | **NO** | Strictly Server-Authoritative | Vehicle chassis/VIN numbers are physical, high-value assets. Offline reassignment could lead to double-selling the same vehicle. |
| **Inventory Stock Ledger** | **NO** | **NO** | Delta Event Journal (Append-Only) | Direct stock balance overwrites cause inventory drift. Must synchronize as discrete movement events (`StockMovement`). |
| **Invoices** | **YES (Draft)** | **NO** | Immutable once issued | Invoices represent tax and legal records. Cannot be mutated offline once finalized. |
| **Payments** | **YES (Receipt)** | **NO** | Strictly Append-Only (No Edits) | Cash/bank collections must be recorded as discrete immutable transaction events with idempotency keys. |
| **Branch Transfers** | **NO** | **NO** | Server Multi-Branch Handshake | Inter-branch inventory dispatch requires dual-branch verification on central server. |
| **Leads & Follow-ups** | **YES** | **YES** | Last-Write-Wins (Field Merge) | Safe for sales representatives on the showroom floor or field visits. |
| **Service Cases & Repairs** | **YES** | **YES** | State-Machine Transition Guard | Repair job status can advance offline (e.g. In Progress -> Completed); validated against valid state machine transitions. |
| **Expenses** | **YES** | **NO** | Append-Only (Approval Required) | Petty cash vouchers created locally in pending status; require Super Admin approval upon sync. |

---

## 6. Required Implementation Scope for Phase 6

1. **Local Storage Abstraction Layer (`frontend/src/offline/storage/`):**
   - Abstract `StorageAdapter` interface allowing browser IndexedDB now and SQLite (Capacitor/Electron) in Phase 7.
   - Durable object stores: `entities`, `outbox`, `conflicts`, `sync_state`, `tombstones`.
2. **Offline Outbox & Mutation Queue (`frontend/src/offline/queue/`):**
   - Fully serializable mutation commands with client-generated `mutationId` and `idempotencyKey`.
   - Automatic retry scheduler with exponential backoff and network status monitor (`navigator.onLine`).
3. **Backend Synchronization Endpoints (`backend/src/controllers/sync.controller.js`):**
   - `POST /api/v1/sync/push`: Batch mutation ingestion with idempotency and conflict detection.
   - `GET /api/v1/sync/pull`: Incremental delta pull using `since` timestamp cursor and branch isolation.
4. **Backend Database Migrations (`backend/src/db/migrations.js`):**
   - Table `sync_mutations` for server-side idempotency.
   - Table `sync_tombstones` for propagating deletions.
   - `version` columns for optimistic concurrency control.
5. **User Interface Synchronization Center:**
   - Visual connectivity indicator, pending changes badge, manual sync button, and modal conflict resolution.
