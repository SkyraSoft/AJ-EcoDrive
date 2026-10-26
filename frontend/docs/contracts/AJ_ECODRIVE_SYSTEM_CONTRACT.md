# AJ ECODRIVE — MASTER SYSTEM CONTRACT

**Document Type:** Final Authoritative System & Technical Product Contract  
**Master Artifact ID:** `73158`  
**Remediation Program Status:** Closed & Verified (Waves 1–7)

---

## 1. PRODUCT SCOPE & ARCHITECTURE BOUNDARIES

AJ EcoDrive is a specialized Dealership Management System (DMS) engineered for multi-branch electric vehicle (EV) dealership operations, commercial vehicle retail, parts inventory distribution, and after-sales service workshops.

### Role Universe & Identity Boundary
The authenticated system role universe is strictly limited to exactly two canonical roles:
1. **Super Admin (`Super Admin`)**: Global cross-branch administrative authority. Sole authorization to create and mutate global masters (Products, Pricing Rules, Suppliers, Branches, Users) and resolve Action Centre executive approval boundaries.
2. **Branch Manager (`Branch Manager`)**: Single-branch operational authority. Scoped strictly to their assigned canonical `branchId` (e.g. `BR-01`). Forbidden from mutating foreign branch records, approving global catalogue additions, or accessing consolidated multi-branch financial accounting data.

*Non-Authenticated Roles:* Operational personas such as Technicians, Sales Representatives, Cashiers, and Receptionists represent business metadata attributes on work orders and transactions; they are **not** authenticated system security roles.

### Branch Model & Custody
- Every branch represents an independent physical showroom, depot, or workshop facility identified by an immutable canonical `branchId` (e.g., `BR-01`, `BR-02`).
- A physical serialized vehicle or spare part resides in exactly one canonical branch location or in an in-transit custody state (`Transfer In Transit`).
- An asset can never be simultaneously `Available` in more than one branch.

---

## 2. CANONICAL STATE DICTIONARY

All domain models conform strictly to the approved canonical state vocabulary.

### A. Serialized Units (`serializedUnits`)
- **Canonical States:**
  - `Expected` — Unit ordered via supplier PO; awaiting factory shipment.
  - `Supplier In Transit` — Dispatched by OEM supplier; in international/domestic freight.
  - `Receiving / QC` — Arrived at depot/branch; undergoing physical intake and serial/chassis inspection.
  - `Available` — Verified and cleared for retail booking or inter-branch transfer.
  - `Reserved` — Allocated to an active commercial customer sales order deposit.
  - `Transfer In Transit` — Dispatched from source branch; in transit to destination branch.
  - `Sold` — Commercial sale finalized and ownership transferred to customer.
  - `Returned` — Returned by customer; awaiting triage or restocking inspection.
  - `In Service` — Under active repair, maintenance, or warranty service in workshop bay.
  - `Damaged / Quarantine` — Physical defect, transit damage, or quarantine isolation.
  - `Scrapped` — Decommissioned, written off, or dismantled for salvage.
- **Prohibited from Canonical Vocabulary:** `Delivered`, `QC Hold`, `Maintenance`, `Allocated`, generic `In Transit`.
- **Legacy Compatibility Mappings (Read-Only):**
  - `QC Hold` $\rightarrow$ `Receiving / QC`
  - `Maintenance` $\rightarrow$ `In Service`
  - `Allocated` $\rightarrow$ `Reserved`
  - `In Transit` $\rightarrow$ `Transfer In Transit`
  - `Delivered` $\rightarrow$ `Sold`

### B. Sales Orders (`orders`)
- **Canonical States:**
  - `Draft` — Initial quotation draft or incomplete order form.
  - `Confirmed` — Customer verified order; commercial terms locked.
  - `Payment Pending` — Order confirmed; awaiting initial deposit or banking terms.
  - `Partially Paid` — Down payment / installment received; balance outstanding.
  - `Paid` — 100% full invoice settlement received and verified.
  - `Reserved` — Physical chassis allocated and locked in inventory.
  - `Ready for Handover` — Vehicle PDI complete, registration processed, ready for customer handover.
  - `Completed` — Physical delivery completed, handover acceptance signed, ownership registered.
  - `Cancelled` — Commercial booking cancelled prior to handover.
  - `Returned / Partially Returned` — Post-handover commercial return processed.
- **Prohibited from Canonical Vocabulary:** `Under Financing`, `Delivered`, `Refunded`.
- **Legacy Compatibility Mappings (Read-Only):**
  - `Under Financing` $\rightarrow$ Valid non-canonical attribute / financing sub-status.
  - `Delivered` $\rightarrow$ `Ready for Handover` / `Completed`.
  - `Refunded` $\rightarrow$ `Cancelled` / `Returned / Partially Returned`.

### C. Purchase Orders (`purchaseOrders`)
- `Draft` $\rightarrow$ `Pending Approval` $\rightarrow$ `Approved` $\rightarrow$ `Ordered` $\rightarrow$ `In Transit` $\rightarrow$ `Partially Received` $\rightarrow$ `Received` $\rightarrow$ `Closed` / `Cancelled`.

### D. Stock Requests (`stockRequests`)
- `Draft` $\rightarrow$ `Submitted` $\rightarrow$ `Under Review` $\rightarrow$ `Approved` / `Partially Approved` / `Rejected` $\rightarrow$ `Fulfilment Started` $\rightarrow$ `In Transit` $\rightarrow$ `Received` $\rightarrow$ `Closed` / `Cancelled`.
- *Compatibility:* Legacy `Pending Approval` maps to canonical `Submitted`.

### E. Transfers (`transfers`)
- `Draft` $\rightarrow$ `Requested` $\rightarrow$ `Approved` $\rightarrow$ `Picking` $\rightarrow$ `Dispatched` $\rightarrow$ `In Transit` $\rightarrow$ `Partially Received` $\rightarrow$ `Received` $\rightarrow$ `Closed` / `Cancelled`.

### F. Action Centre Tasks (`actionQueue`)
- `Pending` $\rightarrow$ `Resolved` / `Rejected` / `Stale`.
- *Domain / Task Separation:* Domain status (e.g., `ProductRequest.status = 'Approved'`) is strictly distinct from task state (`ActionItem.status = 'Resolved'`).

---

## 3. FINANCIAL DOMAIN CONTRACT

### Canonical Currency & Precision
- Base currency: `PKR`.
- Storage precision: Standard decimal with 2 decimal places. UI formats to integer strings where appropriate (`PKR XXX,XXX`).

### Master Financial Formulas
1. $\text{Gross Selling Amount} = \sum(\text{Line Item Subtotals})$
2. $\text{Net Sales} = \text{Gross Selling Amount} - \text{Discounts} - \text{Sales Returns / Refund Adjustments}$
3. $\text{COGS (Cost of Goods Sold)} = \sum(\text{Actual Historical Landed Cost of Specific Serialized Units Sold})$
4. $\text{Gross Profit} = \text{Net Sales} - \text{COGS}$
5. $\text{Gross Margin \%} = \left(\frac{\text{Gross Profit}}{\text{Net Sales}}\right) \times 100$
6. $\text{Operating Expenses} = \sum(\text{Approved Operating Expenses})$
7. $\text{Net Operating Profit} = \text{Gross Profit} - \text{Operating Expenses}$
8. $\text{Inventory Asset Value} = \sum(\text{Unit Landed Cost of all In-Stock Units in Available, Reserved, Receiving / QC, and Transfer In Transit})$

### Landed Cost Invariants
- **Commercial Order vs Financial Liability:** A Purchase Order is a commercial procurement order and does **not** automatically create an accounting liability. The Vendor Bill is the supplier payable invoice document.
- **Physical Unit Valuation:** The unit landed acquisition cost is locked upon physical goods receipt (GRN) and comprises: $\text{Base Factory Price} + \text{Apportioned Freight} + \text{Customs Duty} + \text{Port Handling}$.
- **Immutability:** Subsequent batch receipts or supplier price revisions must **never** retroactively alter the unit landed cost of already sold or existing inventory units.
- **Specific Unit COGS:** COGS is computed strictly against the specific serialized physical units sold and is not broadened to ambiguous handover timing while statutory revenue recognition is undecided.

---

## 4. INVENTORY & SERIALIZED ASSET INVARIANTS

- **Physical Identifiers:** Every serialized vehicle is identified by unique physical attributes (`serial`, `chassis`, `serializedUnitId`).
- **Uniqueness Constraint:** The backend must enforce global uniqueness on `serial` and `chassis` across active inventory.
- **Sellable Stock Invariant:** Only units in `Available` status with `ownership_status === 'Dealership Stock'` can be allocated to commercial sales orders.
- **Double-Sale Prevention:** Concurrent requests attempting to allocate, reserve, or sell the same physical unit must fail safely; exactly one transaction succeeds and any concurrent attempt receives a concurrency conflict response.
- **Inter-Branch Transfer Custody:**
  - Transfer dispatch transitions transfer to `In Transit` and units to `Transfer In Transit`.
  - Units are removed from the source branch sellable stock and cannot be sold or reserved while in transit.
  - Destination receipt transitions transfer to `Received` and units to `Available` at the destination branch.

---

## 5. ACTION CENTRE & APPROVAL GOVERNANCE

- **Task Lifecycle:** Action Centre tasks use `Pending`, `Resolved`, `Rejected`, and `Stale`.
- **Double-Resolution Guard:** Resolving or rejecting a task updates the underlying domain record atomically. Repeat resolution attempts are rejected with `TASK_ALREADY_RESOLVED` and trigger zero second domain mutations.
- **Role Isolation:** Super Admin tasks are resolvable only by Super Admin. Branch tasks are resolvable only by the designated recipient Branch Manager.
- **No Speculative Warranty Approval:** Workshop warranty coverage is derived deterministically from registered customer warranty contracts. Whole-vehicle replacement approval remains a separate governance policy.

---

## 6. BUSINESS DECISIONS REQUIRED REGISTER

The following 9 strategic and accounting policies remain formally registered awaiting executive client sign-off:
1. `VARIANT_MASTER_ARCHITECTURE`: Future normalized SKU variant model vs composite product schema.
2. `REVENUE_RECOGNITION_EVENT`: Accounting recognition point (Invoice issuance vs 100% full payment vs Handover completion vs Order Completed).
3. `COLLECTION_RECOGNITION`: Statutory recognition point for cash in hand vs bank clearance.
4. `RECEIVABLE_RECOGNITION`: Commercial accounts receivable recognition point.
5. `APPROVAL_THRESHOLD_CONFIGURATION`: Dynamic monetary thresholds for automated PO/Expense routing.
6. `WARRANTY_REPLACEMENT_GOVERNANCE`: Executive authorization policy for whole-vehicle replacements.
7. `DISCOUNT_OVERRIDE_GOVERNANCE`: Maximum allowable discount percentage before Super Admin approval.
8. `CUSTOMER_CREDIT_GOVERNANCE`: Customer credit limits and installment default risk governance.
9. `QUARANTINE_WRITEDOWN_ACCOUNTING`: Financial write-down policy for damaged/quarantined units.

---

## 7. QUARANTINED / DEFERRED REGISTER

The following items remain outside current remediation scope:
1. `EIGHTEEN_POINT_PDI_INSPECTION`: Electronic pre-delivery checklist execution.
2. `CRYPTOGRAPHIC_TAMPER_EVIDENT_AUDIT`: Blockchain/hash-chain audit trail implementation.
3. `GRANULAR_PERSONAS_SUB_ROLES`: Dedicated sub-roles (Cashier, QC Inspector, Parts Specialist) outside the two canonical roles.
