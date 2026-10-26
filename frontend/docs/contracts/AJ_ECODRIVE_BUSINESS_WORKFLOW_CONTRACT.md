# AJ ECODRIVE — BUSINESS WORKFLOW CONTRACT

**Document Type:** Dealership Business Operations & Workflow Specification  
**Master Artifact ID:** `73158`  
**Target Audience:** Dealership Business Owners, General Managers & Engineering Teams

---

## 1. AUTHENTICATION & BRANCH ENTRY (`WF-AUTH-01`)
- **Actor:** Super Admin / Branch Manager
- **Real-World Trigger:** Dealership employee logs in at start of business shift.
- **Workflow Journey:** User enters credentials $\rightarrow$ System validates role and assigned branch context $\rightarrow$ Router initializes dashboard with scoped operational views.
- **State Changes:** User session established (`Active`).
- **Inventory & Financial Impact:** Zero.
- **Backend Safeguards:** Mandatory session validation on every request; server enforces branch scoping based on authenticated session context.

---

## 2. BRANCH FACILITY MANAGEMENT (`WF-BR-01`)
- **Actor:** Super Admin
- **Real-World Trigger:** Dealership opens a new regional showroom, warehouse depot, or workshop facility.
- **Workflow Journey:** Super Admin navigates to `/organisation/branches/create` $\rightarrow$ Enters branch details, code, operating limits, and assigned manager $\rightarrow$ Submits creation. Discarding form triggers zero mutations.
- **State Changes:** Branch created with `Active` status.
- **Inventory & Financial Impact:** Establishes physical location target for stock and branch cost centre.
- **Backend Safeguards:** Strict Super Admin authorization; uniqueness enforcement on branch code.

---

## 3. VEHICLE / SKU CATALOGUE REQUISITION (`WF-PR-01`)
- **Actor:** Branch Manager (Request) $\rightarrow$ Super Admin (Review & Decision)
- **Real-World Trigger:** Dealership branch identifies local customer demand for an unlisted EV motorcycle variant or accessory.
- **Workflow Journey:** Branch Manager completes requisition form $\rightarrow$ Status set to `Submitted` $\rightarrow$ Action Centre task routed to Super Admin $\rightarrow$ Super Admin approves or rejects request in Action Centre drawer.
- **State Changes:** Product Request transitions `Draft` $\rightarrow$ `Submitted` $\rightarrow$ `Approved` or `Rejected`. Task transitions `Pending` $\rightarrow$ `Resolved`.
- **Inventory & Financial Impact:** Zero. Approval does **NOT** automatically create Product Master records, purchase orders, or stock.
- **Backend Safeguards:** Super Admin authorization on decision; double resolution returns `TASK_ALREADY_RESOLVED` with zero second domain mutation.

---

## 4. OEM FACTORY PROCUREMENT & RECEIVING (`WF-PO-01`, `WF-GRN-01`, `WF-LC-01`)
- **Actor:** Super Admin (PO Creation & Approval) $\rightarrow$ Warehouse Receiving Officer (Intake)
- **Real-World Trigger:** Dealership places bulk order for EV motorcycles with manufacturing factory.
- **Workflow Journey:**
  1. Super Admin creates Purchase Order with dynamic variant line items $\rightarrow$ Status: `Pending Approval` $\rightarrow$ Approved $\rightarrow$ `Ordered` $\rightarrow$ `In Transit`.
  2. Factory shipment arrives at depot $\rightarrow$ Receiving officer opens `ReceivePurchase.vue` $\rightarrow$ Enters physical serial and chassis identifiers, inspects unit condition, enters freight/duty expenses $\rightarrow$ Posts goods receipt (GRN).
- **State Changes:** PO transitions to `Partially Received` or `Received`. Individual serialized unit records created with status `Available` (or `Damaged / Quarantine`).
- **Inventory & Financial Impact:**
  - PO creation creates **zero** physical stock and is a commercial order document (not an accounting liability until Vendor Bill).
  - GRN posting increments warehouse inventory and locks historical landed acquisition cost per serialized unit.
- **Backend Safeguards:** Unique constraint on `serial` and `chassis`; immutable historical landed cost; zero partial unit creation on failure.

---

## 5. BRANCH STOCK REQUISITION & INTER-BRANCH TRANSFER (`WF-SR-01`, `WF-TR-01`)
- **Actor:** Branch Manager (Requisition) $\rightarrow$ Super Admin (Approval) $\rightarrow$ Origin BM (Dispatch) $\rightarrow$ Destination BM (Intake)
- **Real-World Trigger:** Branch showroom runs low on stock and requests units from another branch hub.
- **Workflow Journey:**
  1. Requesting Branch Manager creates Stock Request $\rightarrow$ Status: `Submitted`.
  2. Super Admin approves demand in Action Centre $\rightarrow$ Stock Request status: `Approved` (zero phantom transfers generated).
  3. Transfer created (`Draft` / `Requested`) $\rightarrow$ Super Admin approves transfer (`Approved`).
  4. Origin Branch Manager selects exact physical chassis and executes dispatch $\rightarrow$ Transfer status: `In Transit`; Serialized units: `Transfer In Transit`.
  5. Destination Branch Manager receives shipment $\rightarrow$ Verifies serials $\rightarrow$ Transfer status: `Received`; Units arrive at destination with status: `Available`.
- **State Changes:**
  - Stock Request: `Submitted` $\rightarrow$ `Approved` $\rightarrow$ `Fulfilment Started` $\rightarrow$ `Closed`.
  - Transfer: `Requested` $\rightarrow$ `Approved` $\rightarrow$ `In Transit` $\rightarrow$ `Received`.
  - Units: `Available` (origin) $\rightarrow$ `Transfer In Transit` $\rightarrow$ `Available` (destination).
- **Inventory & Financial Impact:** Units in transit are temporarily non-sellable; asset balance moves between branch cost centres upon destination receipt.
- **Backend Safeguards:** Unapproved transfers cannot be dispatched; atomic removal and arrival of physical custody; prevention of duplicate dispatch/receipt.

---

## 6. COMMERCIAL VEHICLE SALES, INVOICING & HANDOVER (`WF-SO-01`, `WF-RES-01`, `WF-INV-01`, `WF-PAY-01`, `WF-HO-01`)
- **Actor:** Sales Representative / Branch Sales Manager
- **Real-World Trigger:** Customer books and purchases an electric motorcycle.
- **Workflow Journey:**
  1. Sales rep opens full-page `CreateSale.vue` $\rightarrow$ Selects customer and available chassis $\rightarrow$ Submits order booking.
  2. Order created (`Confirmed` / `Reserved`); unit locked (`Reserved`).
  3. Commercial invoice issued $\rightarrow$ Customer pays deposit or full amount $\rightarrow$ Cashier records payment (`Partially Paid` / `Paid`).
  4. Dealership prepares vehicle PDI $\rightarrow$ Order marked `Ready for Handover`.
  5. Customer completes physical pickup $\rightarrow$ Handover executed $\rightarrow$ Order marked `Completed`; Serialized unit marked `Sold`; 2-Year warranty instantiated.
- **State Changes:**
  - Order: `Draft` $\rightarrow$ `Confirmed` $\rightarrow$ `Reserved` $\rightarrow$ `Partially Paid` $\rightarrow$ `Paid` $\rightarrow$ `Ready for Handover` $\rightarrow$ `Completed`.
  - Unit: `Available` $\rightarrow$ `Reserved` $\rightarrow$ `Sold`.
- **Inventory & Financial Impact:**
  - Reservation locks exact chassis.
  - Full payment records liquid collection.
  - Completion triggers fulfillment and recognizes COGS based on exact unit landed cost.
- **Backend Safeguards:** Double-sale prevention under concurrent bookings; immutable invoice totals once issued; separation of Paid vs Ready for Handover vs Completed.

---

## 7. AFTER-SALES SERVICE, WORKSHOP REPAIRS & WARRANTY (`WF-CASE-01`, `WF-REP-01`)
- **Actor:** Service Advisor / Workshop Technician
- **Real-World Trigger:** Customer brings motorcycle to workshop for scheduled service, repair, or warranty claim.
- **Workflow Journey:**
  1. Service Advisor logs intake in `CreateCase.vue` $\rightarrow$ Customer and chassis linked.
  2. Technician creates repair job in `CreateRepairJob.vue` $\rightarrow$ Adds labor tasks and replacement parts.
  3. System evaluates customer warranty $\rightarrow$ If covered, customer payable is PKR 0.
  4. Technician completes repair $\rightarrow$ Repair marked `Completed` $\rightarrow$ Posted to finance for invoicing.
- **State Changes:**
  - Case: `Open` $\rightarrow$ `In Diagnosis` $\rightarrow$ `Resolved` $\rightarrow$ `Closed`.
  - Repair: `Draft` $\rightarrow$ `Scheduled` $\rightarrow$ `In Progress` $\rightarrow$ `Completed` $\rightarrow$ `Invoiced`.
  - Unit: `In Service` $\rightarrow$ `Available` (restored to customer).
- **Inventory & Financial Impact:** Replacement spare parts deducted from workshop inventory; invoice generated with warranty ratio applied.
- **Backend Safeguards:** Atomic parts deduction; warranty ratio snapshot locked upon invoice generation; branch isolation on work orders.

---

## 8. OPERATING EXPENSES & ACTION CENTRE GOVERNANCE (`WF-EXP-01`, `WF-ACT-01`)
- **Actor:** Branch Manager (Submission) $\rightarrow$ Super Admin (Decision)
- **Real-World Trigger:** Branch incurs operational overhead (rent, utilities, showroom maintenance).
- **Workflow Journey:** Branch Manager submits expense in `CreateExpense.vue` $\rightarrow$ Status: `Pending Approval` $\rightarrow$ Task routed to Super Admin in Action Centre $\rightarrow$ Super Admin approves $\rightarrow$ Status: `Approved` (un-disbursed).
- **State Changes:** Expense: `Draft` $\rightarrow$ `Pending Approval` $\rightarrow$ `Approved` $\rightarrow$ `Paid`. Task: `Pending` $\rightarrow$ `Resolved`.
- **Inventory & Financial Impact:** Accrues branch operational expense. Approval authorizes disbursement without marking expense Paid prematurely.
- **Backend Safeguards:** Super Admin authorization check; double resolution rejected with `TASK_ALREADY_RESOLVED`.
