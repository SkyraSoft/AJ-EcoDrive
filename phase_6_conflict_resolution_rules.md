# Phase 6: Operational Synchronization Conflict Resolution Rules & Taxonomy

**System:** AJ EcoDrive EV Dealership Management System  
**Document Version:** 1.0.0  
**Effective Scope:** Web SPA, Desktop (MSI), Mobile (APK/AAB), and Central Backend Services  

---

## 1. Conflict Philosophy & Invariants

In an enterprise EV dealership operations network with multiple branch showrooms, repair workshops, and head office executives:
1. **Financial & Inventory Integrity is Absolute:** Blind "Last-Write-Wins" (LWW) is strictly prohibited for monetary transactions, tax invoices, vehicle chassis allocations, and warehouse stock tallies.
2. **Deterministic Event Invariants:** Incompatible mutations must never be silently merged into corrupted intermediate states.
3. **Transparent Operator Accountability:** Any offline conflict that cannot be deterministically resolved by domain rules must generate an auditable `ConflictRecord` for human review in the Super Admin Action Centre.

---

## 2. Domain-by-Domain Conflict Resolution Rules

### 1. Serialized Units & VIN Allocation
- **Rule:** **Strict Server Authority with Reservation Lock.**
- **Conflict Scenario:** Branch A assigns VIN `VIN-AJ-EV2026-0042` to Customer Order X while offline. Simultaneously, Branch B (or Super Admin) sells or reserves the same VIN online.
- **Resolution Behavior:**
  - Upon sync push, the backend locks the unit row with `SELECT FOR UPDATE`.
  - If the unit is no longer in `Available` status or is assigned to another branch/order, the server **REJECTS** the allocation mutation with error `CONFLICT_UNIT_UNAVAILABLE`.
  - The client mutation state transitions to `conflict`.
  - The local Order is flagged: *"Vehicle allocation conflict: VIN-AJ-EV2026-0042 was assigned elsewhere. Please select an alternate available unit."*
  - The order itself is not deleted; only the unit binding is held for re-selection.

### 2. Inventory Movements & Stock Balances
- **Rule:** **Append-Only Delta Event Journaling.**
- **Conflict Scenario:** Branch workshop consumes 2 brake pads offline (local balance: 8 -> 6). Simultaneously, head office dispatches 5 units (server balance: 8 -> 13).
- **Resolution Behavior:**
  - Clients never push absolute stock balance numbers (`total_stock = 6`).
  - Clients push discrete delta movement events: `{ operation: 'STOCK_ISSUE', qty: -2, reference: 'JOB-042' }`.
  - The server verifies available stock at execution time inside a database transaction:
    - If `current_stock - delta >= 0`, the transaction succeeds, deducts the quantity, appends a `stock_movements` row, and returns the new authoritative server balance.
    - If `current_stock - delta < 0`, the mutation transitions to `conflict` (`INSUFFICIENT_STOCK_EVENT`), and a discrepancy notice is dispatched to the Store Manager.

### 3. Customer Master Data (CRM)
- **Rule:** **Field-Level 3-Way Merge with Server Authority on Core Identifiers.**
- **Conflict Scenario:** A sales rep updates the customer's phone number offline. Simultaneously, head office updates the customer's billing address.
- **Resolution Behavior:**
  - If modified fields are disjoint (`phone` vs `address`), the server automatically merges both changes.
  - If the same field was updated concurrently (`phone` = X on client, `phone` = Y on server), the server applies the change with the higher `updated_at` timestamp if within a trusted 10-minute window, but logs an audit notice.
  - **Unique Constraints (CNIC / National ID):** If an offline customer creation attempts to use a CNIC that was registered online in the interim, the server rejects the creation with `DUPLICATE_CNIC_CONFLICT`, links the local orders to the existing customer ID, and alerts the operator.

### 4. Payments, Cash Receipts & Invoices
- **Rule:** **Strict Idempotency with Zero-Merge Immutable Financial Events.**
- **Conflict Scenario:** Network drops during a bank transfer payment submission. The operator taps "Retry" after reconnecting.
- **Resolution Behavior:**
  - Every payment mutation carries an immutable client-generated `idempotencyKey` (`UUIDv4`).
  - When the server processes the payment, it checks `sync_mutations` for the idempotency key:
    - If already processed, it immediately returns the existing transaction receipt (`HTTP 200 / 201`) without re-charging or re-posting to the general ledger.
    - If the invoice balance is already PKR 0 (fully paid by another terminal), an overpayment conflict is generated: `{ error: 'INVOICE_ALREADY_SETTLED', status: 'conflict' }`.
  - Invoices and payments are **never overwritten or merged**.

### 5. Inter-Branch Stock Transfers
- **Rule:** **Two-Phase Multi-Branch Handshake.**
- **Conflict Scenario:** Branch Manager initiates a stock transfer dispatch offline.
- **Resolution Behavior:**
  - Inter-branch transfers require active server routing.
  - While offline, a transfer is saved locally as `Draft Dispatch (Pending Sync)`.
  - The status cannot transition to `In Transit` until the server accepts the dispatch and reserves the units from the sending branch floor.
  - Destination branch cannot accept a transfer offline unless the server has confirmed the `In Transit` manifest.

### 6. Service Cases & Workshop Repair Jobs
- **Rule:** **Ordered State Machine Transition Guard.**
- **Conflict Scenario:** Workshop technician marks a job card `Completed` while offline, but the service manager placed the job on `Waiting for Parts` on the portal.
- **Resolution Behavior:**
  - Valid status transitions are governed by a state machine table:
    `Draft -> Assigned -> In Progress -> (Waiting Parts / QC Hold) -> Completed -> Delivered -> Invoiced`.
  - If the client's current status is a valid successor of the server status, the transition is accepted.
  - If the server has progressed past the client (e.g. Server is already `Invoiced`, client attempts `In Progress`), the client mutation is rejected with `ILLEGAL_STATE_TRANSITION` and the server state prevails.

### 7. Petty Cash & Showroom Expenses
- **Rule:** **Append-Only Voucher Ingestion with Mandatory Executive Approval.**
- **Conflict Scenario:** Offline branch manager records a PKR 4,500 fuel expense voucher.
- **Resolution Behavior:**
  - Local voucher is stored with status `Pending Server Audit`.
  - Upon sync, the voucher is created in the database with status `Pending Approval`.
  - It does not mutate the authoritative cash register account until Super Admin approves or automated branch threshold rules validate it.
  - Overlapping expense voucher numbers are automatically assigned sequential server IDs while preserving the client reference.

---

## 3. Conflict Record Schema & Lifecycle

When an automatic resolution is not possible, the mutation is moved to the **Local & Server Conflict Store**:

```json
{
  "conflictId": "CONF-8941",
  "mutationId": "MUT-2026-f83a",
  "entityType": "orders",
  "entityId": "ORD-PEW-0091",
  "branchId": "BR-01",
  "conflictType": "UNIT_ALREADY_ALLOCATED",
  "localPayload": {
    "orderId": "ORD-PEW-0091",
    "unitId": "UNIT-EV-042",
    "customer": "Kashif Afridi"
  },
  "serverPayload": {
    "unitId": "UNIT-EV-042",
    "status": "Sold",
    "allocatedToOrder": "ORD-ISB-0012"
  },
  "detectedAt": "2026-11-06T10:45:00.000Z",
  "resolutionStatus": "UNRESOLVED",
  "resolvedBy": null,
  "resolutionAction": null
}
```

Operators are surfaced a **Conflict Review Banner** in the navigation header with two explicit actions:
1. **Accept Server State:** Discards local mutation and updates the local entity to match the server.
2. **Amend & Resubmit:** Opens the entity edit form pre-populated with local data and highlights conflicting fields for operator modification.
