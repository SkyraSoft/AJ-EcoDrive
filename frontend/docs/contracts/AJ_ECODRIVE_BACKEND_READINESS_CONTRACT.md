# AJ ECODRIVE — BACKEND READINESS & IMPLEMENTATION CONTRACT

**Document Type:** Technical Backend Enforcement Contract  
**Master Artifact ID:** `73158`  
**Purpose:** What the Future Backend MUST Guarantee

---

## 1. ZERO-TRUST CLIENT ARCHITECTURE

### Mandatory Principle
The current frontend application is an **advisory presentation and validation layer**. It does **NOT** constitute server-grade security.

The future backend engineering team must implement authoritative server-side security, RBAC enforcement, query scoping, transaction atomicity, and invariant validation for every incoming request.

Client-submitted branch IDs, actor roles, or status override fields must **NEVER** be trusted without server verification.

---

## 2. SERVER-SIDE AUTHORIZATION & BRANCH SCOPING

### A. Authenticated Session Derivation
- On every mutating or querying request, the backend must extract user identity, authenticated role (`Super Admin` or `Branch Manager`), and canonical `branchId` directly from the verified server session context.
- If a `Branch Manager` attempts to query or mutate a record where `entity.branch_id !== session.branch_id`, the backend must immediately reject the request with a stable authorization error (`FORBIDDEN_RECORD`).

### B. Global Master Protection
- Mutations targeting global master records (`branches`, `users`, `categories`, `products`, `pricingRules`, `suppliers`) are restricted exclusively to `Super Admin`. Any request from a `Branch Manager` must be rejected with an authorization error.

### C. Actor Non-Impersonation
- When a `Super Admin` operates within a specific branch filter, the audit trail and created records must preserve the explicit identity and role of the `Super Admin`. The backend must never silently forge or impersonate a Branch Manager account.

---

## 3. CANONICAL STATE MACHINE ENFORCEMENT

The backend must validate all state transitions against the approved state graph in the persistence store before applying mutations:

- **Serialized Units:**
  - `Expected` $\rightarrow$ `Supplier In Transit` $\rightarrow$ `Receiving / QC` $\rightarrow$ `Available` $\rightarrow$ `Reserved` $\rightarrow$ `Transfer In Transit` $\rightarrow$ `Sold` $\rightarrow$ `Returned` $\rightarrow$ `In Service` $\rightarrow$ `Damaged / Quarantine` $\rightarrow$ `Scrapped`.
  - Non-canonical status values (`Delivered`, `QC Hold`, `Maintenance`, `Allocated`, generic `In Transit`) must be rejected on new writes and mapped to canonical values on legacy read paths.
- **Sales Orders:**
  - `Draft` $\rightarrow$ `Confirmed` $\rightarrow$ `Payment Pending` $\rightarrow$ `Partially Paid` $\rightarrow$ `Paid` $\rightarrow$ `Reserved` $\rightarrow$ `Ready for Handover` $\rightarrow$ `Completed` $\rightarrow$ `Cancelled` $\rightarrow$ `Returned / Partially Returned`.
  - Non-canonical status values (`Under Financing`, `Delivered`, `Refunded`) must not be written as primary order statuses.
- **Stock Requests:**
  - `Draft` $\rightarrow$ `Submitted` $\rightarrow$ `Under Review` $\rightarrow$ `Approved` / `Partially Approved` / `Rejected` $\rightarrow$ `Fulfilment Started` $\rightarrow$ `In Transit` $\rightarrow$ `Received` $\rightarrow$ `Closed` / `Cancelled`.
- **Transfers:**
  - `Draft` $\rightarrow$ `Requested` $\rightarrow$ `Approved` $\rightarrow$ `Picking` $\rightarrow$ `Dispatched` $\rightarrow$ `In Transit` $\rightarrow$ `Partially Received` $\rightarrow$ `Received` $\rightarrow$ `Closed` / `Cancelled`.
- **Action Centre Tasks:**
  - `Pending` $\rightarrow$ `Resolved` / `Rejected` / `Stale`.

---

## 4. CONCURRENCY & TRANSACTION ATOMICITY

The backend must guarantee transaction atomicity and safe concurrency handling across all high-risk dealership workflows without prescribing specific database technology:

### A. Double-Sale & Double-Reservation Prevention
- When an order booking attempts to reserve a physical chassis, the backend must verify that `status === 'Available'` and `ownership_status === 'Dealership Stock'`.
- Under concurrent checkout requests, exactly one request commits the reservation; any concurrent attempt fails safely with a concurrency conflict response.

### B. Inter-Branch Transfer Dispatch & Receipt
- **Dispatch Atomicity:** Validates that the transfer is in `Approved` state and that all assigned units are currently `Available` at the origin branch. Atomically transitions the transfer to `In Transit`, transitions unit statuses to `Transfer In Transit`, deducts origin branch stock balance, and logs `TRANSFER_DISPATCHED`.
- **Receipt Atomicity:** Validates that the transfer is in `In Transit` state. Atomically transitions the transfer to `Received`, updates unit branch ownership to the destination branch, restores accepted units to `Available`, isolates damaged units in `Damaged / Quarantine`, resolves destination receiving tasks, and logs `TRANSFER_RECEIVED`.

### C. Physical Goods Receipt Posting (GRN)
- Validates PO status (`Approved`, `Ordered`, `In Transit`).
- Atomically creates physical serialized unit records with unique serial and chassis identifiers, locks the unit landed acquisition cost, updates product stock balances, increments PO receipt counters, and logs `GOODS_RECEIPT_POSTED`.
- If any unit fails uniqueness validation, the entire transaction rolls back completely.

### D. Action Centre Task Idempotency
- When an administrator resolves or rejects an Action Centre task, the backend must atomically update the task to `Resolved` or `Rejected` and apply the corresponding domain record state change.
- A duplicate submission for an already resolved task must return `TASK_ALREADY_RESOLVED` and execute zero second domain mutations.

---

## 5. FINANCIAL DOMAIN & LANDED COST INTEGRITY

- **Net Sales Enforcement:** $\text{Net Sales} = \text{Gross Selling Amount} - \text{Discounts} - \text{Sales Returns / Refund Adjustments}$.
- **COGS Calculation:** COGS must equal the exact sum of historical unit landed costs for the specific serialized units sold.
- **PO Commercial Order Separation:** Purchase Orders represent commercial supply commitments and do not automatically generate financial ledger liabilities. Vendor Bills represent the formal supplier payable invoice.
- **Historical Cost Immutability:** The unit landed cost locked upon physical goods receipt is permanently immutable. Subsequent batch receipts, freight adjustments, or price list updates must never overwrite the historical landed cost of already sold or existing inventory units.

---

## 6. AUDIT TRAIL & COMPLIANCE

- **Append-Only Store:** All sensitive business mutations must generate immutable audit log records. No `UPDATE` or `DELETE` operations are permitted on the audit log store.
- **Actor Event Separation:** Audit records must preserve distinct event actor fields (`created_by`, `approved_by`, `dispatched_by`, `received_by`, `posted_by`) to maintain clear accountability across multi-step approval workflows.

---

## 7. SEMANTIC ERROR CONTRACT

The backend must return structured JSON error payloads conforming to standard domain semantic failure categories:
- `VALIDATION_ERROR`: Input payload failed field validation or domain schema constraints.
- `UNAUTHORIZED`: Request missing authenticated session context.
- `FORBIDDEN_RECORD`: User lacks authority or branch scope to access target entity.
- `NOT_FOUND`: Target entity ID does not exist in registry.
- `STATE_CONFLICT`: Entity is in an invalid state for requested lifecycle transition.
- `DUPLICATE_IDENTITY`: Unique constraint violation on physical serial, chassis, or branch code.
- `TASK_ALREADY_RESOLVED`: Action Centre task was already resolved; duplicate resolution rejected.
- `CONCURRENCY_CONFLICT`: Target record was concurrently modified by another transaction.
- `BUSINESS_RULE_VIOLATION`: Operation violates a domain business rule (e.g., dispatching unapproved transfer, overpaying invoice).
