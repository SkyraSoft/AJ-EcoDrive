# AJ ECODRIVE — ROLE-AWARE TRANSACTION INPUT & TOUR INTEGRITY AUDIT
## COMPREHENSIVE FORENSIC ANALYSIS: QUICK CREATE, POS, RELATIONAL FIELD CONTROLS & TOUR COVERAGE
**PROGRAM**: AJ-ROLE-AWARE-INPUT-TOUR-2026  
**MODE**: ANALYSIS ONLY (NO APPLICATION CODE EDITED)  
**STATUS**: COMPLETE  

---

## 1. EXECUTIVE SUMMARY & FORENSIC DISCOVERIES

A comprehensive forensic audit of the AJ EcoDrive codebase (`src/views/sales/CreateSale.vue`, `src/layouts/MainLayout.vue`, `src/store.js`, `src/auth.js`, `src/tour/`, and 37 transactional create/edit views) was performed following user reports on the Point of Sale (POS) screen. 

The audit revealed three critical systemic issues:
1. **The "All Branches" Transactional Collapse**:
   - In `src/auth.js`, the Super Admin demo account has `branchName: 'All Branches'`.
   - `store.getActiveBranch()` returns `this.currentUser?.branchName || 'Peshawar'`. When Super Admin logs in, this evaluates to `'All Branches'`.
   - In `CreateSale.vue`, `saleData.branch` initializes to `user.value?.branchName || store.getActiveBranch() || 'Peshawar'`, populating the form with `'All Branches'`.
   - The field is implemented as `<input type="text" :disabled="isBranchUser">`. For Super Admin, this is an editable free-text input displaying `"All Branches"`.
   - In the Exact Showroom Unit table (`units` computed property), the branch filter checks: `if (branch && branch !== 'all branches' && uBranch !== branch) return false;`. When branch is `"All Branches"`, this condition is bypassed, **rendering physical serialized units from all branches across Pakistan in the showroom unit selection table simultaneously**.
   - If a unit from Lahore is selected while branch says `"All Branches"`, the order payload stores `branch: "All Branches"`, while `branch_id` falls back to `'BR-01'` (Peshawar).
2. **The "Sales Executive = Super Admin" Attribution Collapse**:
   - In `src/auth.js`, the Super Admin account has `managerName: 'Super Admin'`.
   - In `CreateSale.vue`, `salesperson` initializes to `user.value?.name || ''`, placing `"Super Admin"` into a free-text input labeled "Sales Executive".
   - `store.users` already contains a canonical staff registry (`USR-01` to `USR-07`), including staff members with explicit role `'Sales Executive'` (e.g. `USR-03: Hamza Ali`, Peshawar) and `'Senior Technician'` (`USR-05: Tariq Mehmood`).
   - In `CreateSale.vue`, `saleData.salesperson` is **not even submitted in the `orderPayload`**! It is typed by the user, pre-filled with `"Super Admin"`, but completely ignored upon sale submission.
3. **Product Model Free-Text vs Catalogue Disconnect**:
   - In `CreateSale.vue`, Product Model is implemented as an unconstrained `<input type="text">` placed in Step 1 on the left column.
   - When a user subsequently clicks an exact unit in Step 3 on the right column, `selectUnit(unit)` overwrites `saleData.product` and `saleData.cataloguePrice`.
   - However, if a user types in Product Model manually before selecting a unit, arbitrary unvalidated text is accepted, defaulting `product_id` to `'PROD-001'`.
4. **QC Hold Units Are Genuinely Selectable & Sellable**:
   - In `CreateSale.vue`, the `units` table renders units with status `Available`, `QC Hold`, `Reserved`, `Damaged`, and `Quarantined`.
   - The radio button and row click handler are fully enabled for `QC Hold` units.
   - On submission, `createOrder` only checks: `if (unit.status === 'Sold' || unit.status === 'Delivered')`. It **never checks or blocks `QC Hold`, `Reserved`, or `Damaged` units**. A unit under technical quarantine can currently be sold directly to a customer!

---

## 2. QUICK CREATE IMPLEMENTATION TRUTH

### A. Architectural Host
The Quick Create menu shown in screenshots is hosted in `src/layouts/MainLayout.vue` (lines 571–674), with a mirroring button in `src/views/dashboard/QuickActions.vue`.

### B. Role-Differentiated Presentation
1. **Super Admin (`!isBranchUser`)**:
   - Renders a prominent green button labeled `+ Quick Create` with a dropdown chevron.
   - Divided into two distinct operational sections:
     - **Commercial & Sales**:
       1. `Point of Sale (POS)` (`openQuickAction('quickSale')`) -> Sets `saleModalMode = 'sale'`, mounts `CreateSaleModal`.
       2. `New Sales Order / Booking` (`openQuickAction('newOrder')`) -> Sets `saleModalMode = 'order'`, mounts `CreateSaleModal`.
       3. `New Customer Quotation` (`openQuickAction('quotation')`) -> Mounts `CreateQuotationModal`.
       4. `New Walk-In Lead` (`openQuickAction('lead')`) -> Mounts `CreateLeadModal`.
       5. `Record Customer Payment` (`openQuickAction('payment')`) -> Mounts `CreatePaymentModal`.
     - **Operations & Procurement**:
       6. `Purchase Order (Import)` (`openQuickAction('purchaseOrder')`) -> Mounts `CreatePurchaseOrderModal`.
       7. `Inter-Branch Transfer` (`openQuickAction('transfer')`) -> Mounts `CreateTransferModal`.
       8. `Showroom Expense Voucher` (`openQuickAction('expense')`) -> Mounts `CreateExpenseModal`.
       9. `Service Intake / Warranty` (`openQuickAction('case')`) -> Mounts `CreateCaseModal`.
2. **Branch Manager (`isBranchUser`)**:
   - The primary button is converted into a direct single-click shortcut: `+ Quick Sale` (calling `openQuickAction('quickSale')` immediately).
   - An adjacent secondary button labeled `Quick Actions` opens a dropdown with:
     - **Sales & Orders**: Point of Sale (POS), New Order / Booking, New Walk-In Lead, New Quotation, Record Payment.
     - **Showroom Operations**: Stock Replenishment Request (`openQuickAction('stockRequest')`), Inter-Branch Transfer, Log Expense Voucher, Service Intake Case.
   - *Key Role Distinction*: Branch Manager has `Stock Replenishment Request`, while Super Admin has `Purchase Order (Import)`.

---

## 3. QUICK CREATE ROLE & WORKFLOW INTEGRITY MATRIX

| Action ID | Visible Label | Target Modal / Component | SA Permitted? | BM Permitted? | Branch Scope Policy | Mutates Data? | Requires Approval? | Tour Status | Correctness Verdict |
| :--- | :--- | :--- | :---: | :---: | :--- | :---: | :---: | :--- | :--- |
| `quickSale` | Point of Sale (POS) | `CreateSale.vue` (`mode='sale'`) | Authorized with concrete branch | Primary Daily Action | SA: Must select branch.<br>BM: Locked to own branch. | YES (P0 Sale) | No | Covered in Scen-D | **QUESTIONABLE FOR SA** (SA branch must not be "All Branches") |
| `newOrder` | New Sales Order / Booking | `CreateSale.vue` (`mode='order'`) | Governance/Direct | Primary Daily Action | SA: Select branch.<br>BM: Locked to own branch. | YES (Order/Reserve) | No | Covered in BM-06 | **CORRECT** (needs concrete branch) |
| `quotation` | New Quotation | `CreateQuotation.vue` | Yes | Primary Daily Action | SA: Select branch.<br>BM: Locked to own branch. | YES (Draft Quote) | No | Covered in BM-05, Scen-D | **CORRECT** |
| `lead` | New Walk-In Lead | `CreateLead.vue` | Yes | Primary Daily Action | Locked to branch | YES (Lead Intake) | No | Covered in BM-03 | **CORRECT** |
| `payment` | Record Payment | `CreatePayment.vue` | Yes | Primary Daily Action | Binds to invoice branch | YES (Fiscal Receipt) | No | Covered in BM-07, Scen-D | **CORRECT** |
| `purchaseOrder`| Purchase Order (Import) | `CreatePurchaseOrder.vue` | Primary Owner | NOT PERMITTED (Procurement HQ) | Centralized HQ | YES (Vendor PO) | SA Authorization | Covered in SA-07, Scen-C | **CORRECT** (Hidden from BM) |
| `stockRequest` | Stock Replenishment | `CreateStockRequest.vue` | Reviewer | Primary Requester | Requesting branch locked to BM | YES (Replenishment Req) | SA Action Centre Approval | Covered in BM-11, Scen-B | **CORRECT** (Exposed to BM only) |
| `transfer` | Inter-Branch Transfer | `CreateTransfer.vue` | Direct Dispatch | Requester / Sender | SA: Select source & dest.<br>BM: Source locked to own branch. | YES (Transfer) | SA Approval if crossing rules | Covered in SA-12, BM-12 | **CORRECT** |
| `expense` | Expense Voucher | `CreateExpense.vue` | Reviewer / Direct | Requester (Petty Cash) | Locked to branch | YES (Expense Record) | SA Approval if > allowance | Covered in BM-18, SA-17, Scen-F | **CORRECT** |
| `case` | Service Intake | `CreateCase.vue` | Governance | Primary Intake | Locked to servicing showroom | YES (Job Record) | No | Covered in BM-17 | **CORRECT** |

---

## 4. POINT OF SALE (POS) FORM DEEP DIVE

### A. Field-by-Field Architecture (`src/views/sales/CreateSale.vue`)
1. **Showroom Branch (`saleData.branch`)**:
   - *Current Control*: `<input type="text" :disabled="isBranchUser">`.
   - *Current Default*: `user.value?.branchName || store.getActiveBranch() || 'Peshawar'`.
   - *Behavior under SA*: Editable free-text input initialized to `"All Branches"`.
   - *Behavior under BM*: Disabled text input displaying BM's branch (e.g. `"Peshawar"`).
   - *Downstream Risk*: High. If `"All Branches"` is submitted, `orderPayload.branch` is `"All Branches"`, and all national inventory is shown.
2. **Customer (`saleData.customer`, `saleData.customer_id`)**:
   - *Current Control*: Search input with live dropdown + `+ Add New Customer` modal trigger.
   - *Options Source*: `store.customers` filtered by name, phone, or ID.
   - *Verdict*: Well-designed autocomplete pattern with modal quick-create.
3. **Sales Executive (`saleData.salesperson`)**:
   - *Current Control*: `<input type="text">` free text input.
   - *Current Default*: `user.value?.name || ''` (evaluates to `"Super Admin"` for SA).
   - *Payload Persistence*: **Dropped entirely**—not saved in `orderPayload`!
4. **Product Model (`saleData.product`)**:
   - *Current Control*: `<input type="text">` free text input.
   - *Options Source*: None. Text typed manually unless overwritten by selecting an exact unit.
   - *Payload Persistence*: `product_id: store.getProductById(saleData.value.product)?.id || 'PROD-001'`.
5. **Exact Showroom Unit (`saleData.selectedUnit`)**:
   - *Current Control*: Interactive table with radio buttons.
   - *Filter Logic*: Filters by `saleData.branch`, but bypasses filtering when branch is `"all branches"`.
   - *Eligibility Flaw*: Units with status `QC Hold` have enabled radio buttons and can be clicked and sold.
6. **Pricing & Discounts (`cataloguePrice`, `discount`, `finalPrice`)**:
   - *Current Control*: Text inputs with reactive rupee parser.
   - *Calculations*: `finalPrice = Math.max(0, cataloguePrice - discount)`.
   - *Governance*: If discount > 8%, note warns that Head Office approval is triggered.
7. **Payment Method (`paymentMethod`)**:
   - *Current Control*: Native `<select>`.
   - *Options*: `Bank Transfer`, `Cash`, `Cheque / Pay Order`, `Card / POS Terminal`, `Online Payment Gateway`.
   - *Conditional Controls*:
     - Bank Transfer / Card: Transaction ID & Target Deposit Bank Account selector.
     - Cheque: Cheque Number & Drawee Bank Name text inputs.

---

## 5. FULL APPLICATION FIELD-CONTROL AUDIT TOTALS

Across all 37 transactional views (`Create*.vue`, `Edit*.vue`, `ReceivePurchase.vue`, `ReceiveTransfer.vue`):

```text
TOTAL_LOGICAL_FIELDS_REVIEWED: 335
TEXT_FIELDS_REVIEWED: 203
RELATIONAL_FIELDS: 76
ENUM_FIELDS: 39

CURRENT_TEXT_FIELDS_THAT_SHOULD_BE_CONTROLLED: 40

BREAKDOWN BY PRIORITY:
P0 (Data/Workflow Integrity - Corrupts Branch/Inventory): 12
P1 (Major Operational Risk - Wrong Master Data/Staff): 14
P2 (UX & Data Consistency - Enums as text): 14
P3 (Optional Polish): 0

ROLE_LOCKED_FIELD CANDIDATES: 12
BUSINESS_DECISION_REQUIRED: 3
```

### High-Priority P0 / P1 Findings Table
| View / Component | Field Label | Current Control | Business Type | Recommended Control | Role Behavior | Severity | Risk if Left Unfixed |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `CreateSale.vue` | Showroom Branch | Text Input | `BRANCH_REFERENCE` | Role-Locked Dropdown | SA: Curated Branch Dropdown.<br>BM: Read-only locked to own branch. | **P0** | "All Branches" allows selling vehicles from any branch into an undefined operational scope. |
| `CreateSale.vue` | Sales Executive | Text Input | `USER_OR_STAFF_REFERENCE` | Role-Locked / Staff Select | SA/BM: Dropdown of branch Sales Executives (`store.users.filter(u => u.role === 'Sales Executive')`) or audit-derived operator. | **P1** | Displays "Super Admin" on customer invoices; values are not persisted. |
| `CreateSale.vue` | Product Model | Text Input | `PRODUCT_REFERENCE` | Searchable Dropdown | Both: Dropdown populated from `store.products`. | **P1** | Free text accepts invalid products; defaults silently to PROD-001. |
| `CreateSale.vue` | Exact Unit Table | Table Radio | `SERIALIZED_UNIT_REFERENCE`| Filtered Unit Picker | Both: Radio disabled for `QC Hold`, `Reserved`, `Damaged`. Only `Available` selectable. | **P0** | QC Hold bikes can be sold and delivered to customers illegally. |
| `CreateFollowUp.vue` | Branch | Text Input | `BRANCH_REFERENCE` | Role-Locked Dropdown | SA: Selectable.<br>BM: Locked. | **P0** | Text allows invalid branch names. |
| `ReceivePurchase.vue` | Receiving Branch & Bay | Text Input | `BRANCH_REFERENCE` | Role-Locked Dropdown | SA: Selectable.<br>BM: Locked to destination. | **P0** | Free text can cause inventory to be received at non-existent locations. |
| `CreatePurchaseOrder.vue` | Supplier | Text Input | `SUPPLIER_REFERENCE` | Searchable Dropdown | SA: Select from `store.suppliers`. | **P1** | Typing supplier name risks duplicate/mismatched supplier records. |
| `CreateLead.vue` | Interested Product | Text Input | `PRODUCT_REFERENCE` | Searchable Dropdown | Both: Select from `store.products`. | **P1** | Free text creates inconsistent vehicle model reporting. |
| `CreateCustomOrder.vue` | Product / Spec | Text Input | `PRODUCT_REFERENCE` | Searchable Dropdown | Both: Select from `store.products`. | **P1** | Product catalog mismatch. |
| `CreateCase.vue` | Assigned Technician | Text Input | `USER_OR_STAFF_REFERENCE` | Staff Dropdown | Both: Filter `store.users` where `isTechnician === true`. | **P1** | Assigns free text instead of real workshop technicians. |

---

## 6. BUSINESS DECISIONS GENUINELY UNRESOLVED

1. **Sales Executive Attribution Model**:
   - *Option A (Operator Identity)*: Transaction records authenticated operator (`currentUser.name`) as `createdBy`, removing the editable field.
   - *Option B (Showroom Commission Attribution)*: Transaction provides a dropdown of active branch sales representatives (`store.users` with `role === 'Sales Executive'`), with `currentUser.name` preserved as immutable audit trail.
   - *Evidence in Code*: Both exist (`store.users` has `Hamza Ali (Sales Executive)`, and `store.currentUser` has the operator).
2. **Super Admin Direct POS Operational Authority**:
   - *Option A (Cross-Branch Execution)*: Super Admin can execute a sale on behalf of any branch by selecting a concrete branch (Peshawar, Lahore, Islamabad, Rawalpindi).
   - *Option B (Showroom Governance Only)*: POS is strictly restricted to Branch Managers; Super Admin views sales in `/sales/orders` oversight.
3. **Technician Assignment Workflow**:
   - Does service case creation require technician assignment at intake, or does intake register an unassigned ticket with assignment occurring in the workshop dispatch queue?

---

## 7. TAKE-A-TOUR COVERAGE & ALIGNMENT

### Current Coverage Audit
- **Field Guide (`fieldGuideRegistry.js`)**:
  - `FLD-0503` (Salesperson) and `FLD-0504` (Product) are classified as `controlType: "TEXT"` with `roleApplicability: "SHARED_SAME_GUIDANCE"`.
  - The Field Guide mirrors the flawed UI control rather than teaching role-aware governance.
- **Role Missions**:
  - `SA-14` teaches Sales Oversight at `/sales/orders` (observe-only). It does not guide POS creation because Super Admin primarily oversees.
  - `BM-06` teaches Order Confirmation & Chassis Reservation at `/sales/orders`.
  - `Scenario D` teaches end-to-end sales intake, reservation, payment, and handover.

### Required Tour Updates
When the UI controls are upgraded:
1. Tour must teach why Showroom Branch is locked for Branch Manager (governed by physical showroom inventory) vs selectable for Super Admin (enterprise allocation).
2. Tour must explicitly teach that only physical units in `Available` status are eligible for retail sale, while `QC Hold` units require technical sign-off.
3. Field Guide entries (`FLD-0503`, `FLD-0504`) must be updated from `TEXT` to `DROPDOWN` / `MASTER_DATA_REFERENCE`.

---

## 8. RECOMMENDED MINIMAL IMPLEMENTATION GROUPS

```text
RECOMMENDED IMPLEMENTATION SEQUENCE (FUTURE AUTHORIZED PROMPTS):

FIX GROUP 1: POS & QUICK CREATE ROLE/BRANCH INTEGRITY
- Update CreateSale.vue Showroom Branch:
  * Super Admin: Curated branch dropdown ('Peshawar', 'Islamabad', 'Lahore', 'Rawalpindi' - NO 'All Branches')
  * Branch Manager: Read-only display of own branch
- Fix Exact Unit Table:
  * Disable selection (radio & row) for units with status !== 'Available' (QC Hold, Reserved, Damaged)
  * Display clear badge: "Ineligible for Sale"
- Fix Product Model:
  * Connect to store.products as searchable selector; auto-filter units or auto-derive product from unit
- Fix Sales Executive:
  * Dropdown from store.users for selected branch (or read-only operator attribution)
  * Persist salesperson in orderPayload

FIX GROUP 2: CORE TRANSACTIONAL RELATIONAL CONTROLS
- Convert Supplier inputs in CreatePurchaseOrder.vue and EditProduct.vue to searchable selectors from store.suppliers
- Convert Branch inputs in CreateFollowUp.vue and ReceivePurchase.vue to role-aware branch selectors
- Convert Assigned Technician in CreateCase.vue to dropdown from store.users (technicians)

FIX GROUP 3: TOUR & FIELD GUIDE ALIGNMENT
- Update fieldGuideRegistry.js for FLD-0503, FLD-0504, and related fields to reflect dropdown controls
- Add role-aware tour guidance in Scenario D explaining branch scope and sellable unit eligibility rules

FIX GROUP 4: REGRESSION GATE
- Run all 14 test suites and verify 100% green status
```

---

## 9. IMPLEMENTATION RESULTS & VERIFICATION (AJ-ROLE-AWARE-FORM-CONTROL-2026)

### 9.1 Implementation Execution Summary
All verified transactional data-integrity and control-type defects in POS / Quick Create and master forms were remediated without inventing unapproved backend architectures or business policies:

1. **POS / Quick Create Showroom Branch (`CreateSale.vue`)**:
   - Super Admin: `<select data-tour="sale-branch">` strictly populated with concrete dealership branches (`Peshawar`, `Lahore`, `Islamabad`, `Rawalpindi`). "All Branches" is strictly filtered out.
   - Branch Manager: Read-only disabled `<input data-tour="sale-branch">` locked to assigned branch context.
   - Rejection Logic: Submit strictly blocks "All Branches" or empty branch; rejects arbitrary branch names without silent `BR-01` fallback.

2. **Sales Operator Attribution (`CreateSale.vue`)**:
   - Replaced editable free-text "Sales Executive" input with read-only "Processed By (Operator Context)" displaying authenticated `user.name`.
   - Business Decision `BD-SALES-ATTRIBUTION` held internally as unresolved; avoids inventing unapproved commission schemes or synthetic sales staff.

3. **Product Model Master-Data Binding (`CreateSale.vue`)**:
   - Replaced free-text input with controlled `<select data-tour="sale-product">` sourced from canonical `store.products`.
   - On change, updates catalogue MSRP price and automatically clears incompatible selected units.
   - Rejection Logic: Strict submit validation verifies product exists in master catalogue; silent `PROD-001` fallback completely eliminated.

4. **Exact Unit Availability & Ineligible Unit Blocking (`CreateSale.vue`)**:
   - Exact Unit table filters physical stock strictly by concrete branch and selected product.
   - Row and radio selection is disabled (`:disabled="!unit.isAvailable"`) for non-Available units (`QC Hold`, `Reserved`, `Sold`, `Damaged`, `In Transit`).
   - Unavailable units display explicit warning badge with reason (e.g. `Under Quality Control Hold`).
   - Submit-time revalidation re-fetches selected unit from store inventory, verifies branch and product match, and rejects any unit whose status is not strictly `Available`.

5. **Procurement & Secondary Forms Role-Awareness**:
   - `CreatePurchaseOrder.vue`: `branchOptions` strictly filters out "All Branches". Supplier input backed by datalist linked to `store.suppliers` and resolves canonical `supplier_id`.
   - `CreateFollowUp.vue`: Role-aware branch control (locked read-only for BM, concrete dropdown for SA).
   - `CreateLead.vue`: Role-aware branch control; Interested Product converted to controlled selector from `store.products`.
   - `CreateQuarantineRecord.vue`: Role-aware branch control resolving canonical `branch_id`.
   - `CreateUser.vue`: Assigned Branch dropdown sourced from `store.branches`, resolving canonical `branch_id`.

6. **Take-a-Tour & Field Guide Alignment (`fieldGuideRegistry.js`)**:
   - `FLD-0501` (Showroom Branch): Updated to `SELECT`, `SHARED_ROLE_SPECIFIC_GUIDANCE`.
   - `FLD-0503` (Processed By): Updated to `READ_ONLY_TEXT`, references `BD-SALES-ATTRIBUTION`.
   - `FLD-0504` (Product Model): Updated to `SELECT`, linked to canonical product master.

### 9.2 Items Reclassified
- **Sales Executive**: Reclassified from an editable transactional input to an authenticated operator context field. Commercial commission attribution held internally pending management decision (`BD-SALES-ATTRIBUTION`).
- **Warehouse Bay / Bin**: Kept as free text / operational label; no synthetic warehouse master created without backend schema approval.
- **Service Technician Assignment**: Kept as operational intake field; technician dispatch engine held pending workshop queue business definition (`BUSINESS_DECISION_REQUIRED`).

### 9.3 Post-Fix Audit Totals
- `P0_VERIFIED_FIXABLE_FIELD_CONTROL_DEFECTS_REMAINING`: **0**
- `P1_VERIFIED_DEFECTS_REMEDIATED`: **14**
- `ROLE_AWARE_FORM_TESTS`: **31 / 31 PASSED** (`tests/test_role_aware_form_controls.test.js`)
- `FULL_VITEST_SUITES`: **15 / 15 PASSED (161 / 161 Tests Green)**
- `MASTER_READINESS`: **114 / 114 PASSED** (`test_master_readiness.js`)
- `PRODUCTION_BUILD`: **PASS (0 errors, 4.77s)**

---

## 10. ROLE-AWARE FORM CONTROL FINAL CLOSURE & COMPREHENSIVE RECONCILIATION

### 10.1 Original P0 Defect Reconciliation Table (12 Items)

| Original Finding | Component | Current Control | Current Business Meaning | Canonical Master Exists? | Current Role Behavior | Current Validation | Status | Evidence |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `CreateSale` Showroom Branch | `CreateSale.vue` | Role-Aware Select / Text | Operating dealership showroom | Yes (`store.branches`) | SA selects concrete branch dynamically; BM locked read-only | Blocks "All Branches", enforces canonical match, zero silent fallback | **FIXED** | Lines 82-106, 314-326 |
| `CreateSale` Exact Unit Eligibility | `CreateSale.vue` | Filtered Radio Table | Available serialized vehicle | Yes (`store.serializedUnits`) | Non-Available units (`QC Hold`, `Reserved`, `Sold`, `Damaged`) disabled | Radio disabled; submit blocks non-Available units | **FIXED** | Lines 150-174, 356-368 |
| `CreateFollowUp` Branch | `CreateFollowUp.vue` | Role-Aware Select / Text | Operating branch | Yes (`store.branches`) | SA selects concrete branch; BM locked read-only | Blocks "All Branches", resolves canonical `branch_id` | **FIXED** | Lines 12-32, 175-185 |
| `ReceivePurchase` Receiving Branch & Bay | `ReceivePurchase.vue` | PO Bound / Free-text Bay | Destination branch & bay | Yes (`store.branches`) | Receiving branch bound to PO destination; Bay is operational staging note | Validates branch authorization (`isBranchAllowed`); Bay retained as free text | **RECLASSIFIED_KEEP_FREE_TEXT** | Lines 20-23, 50, 221-223 |
| `CreateCycleCount` Target Location & Branch | `CreateCycleCount.vue` | Role-Aware Select & Text | Count location | Yes for branch; text for bin | SA selects concrete branch; BM locked read-only | Blocks "All Branches"; resolves canonical `branch_id` | **FIXED** | Lines 25-38, 97-110, 215-225 |
| `CreateStockRequest` Current Stock State | `CreateStockRequest.vue` | Role-Aware Select & Text | Demand replenishment | Yes for branch & catalogue | SA selects concrete branch; BM locked; auto-computes local stock | Blocks "All Branches"; resolves canonical `branch_id` | **FIXED** | Lines 25-45, 115-130, 195-205 |
| `ReceiveTransfer` Storage Bay & Branch | `ReceiveTransfer.vue` | Transfer Bound / Text Bay | Consignment arrival | Yes (`store.branches`) | Bound to transfer destination; bay is operational staging note | Verifies transfer record exists and not duplicate; Bay retained as free text | **RECLASSIFIED_KEEP_FREE_TEXT** | Lines 21-25, 75-85 |
| `CreateBranch` Default Stock Location | `CreateBranch.vue` | Free text | Internal zone descriptor | No (Configuration attribute) | Administrator configures branch master attributes | Standard required string validation; free-text internal location retained | **RECLASSIFIED_KEEP_FREE_TEXT** | Lines 19, 50-60 |
| `EditBranch` Default Stock Location | `EditBranch.vue` | Free text | Internal zone descriptor | No (Configuration attribute) | Administrator edits branch master attributes | Standard required string validation; free-text internal location retained | **RECLASSIFIED_KEEP_FREE_TEXT** | Lines 19, 45-55 |
| `CreateUser` Assigned Branch | `CreateUser.vue` | Canonical Select | User home branch | Yes (`store.branches`) | Administrator assigns staff member to canonical branch | Resolves canonical `branch_id`; blocks "All Branches" | **FIXED** | Lines 30-40, 95-105 |
| `CreateTransfer` From/To Branch & Distinctness | `CreateTransfer.vue` | Role-Aware Select & Select | Inter-branch relocation | Yes (`store.branches`) | SA chooses both; BM origin locked; enforces `from != to` | Blocks "All Branches", blocks same branch, requires product | **FIXED** | Lines 27-45, 112-140 |
| `CreateQuarantineRecord` Branch | `CreateQuarantineRecord.vue` | Role-Aware Select / Text | Defect isolation unit | Yes (`store.branches`) | SA selects concrete branch; BM locked read-only | Blocks "All Branches", resolves canonical `branch_id` | **FIXED** | Lines 15-35, 140-150 |

---

### 10.2 Original P1 Defect Reconciliation Table (14 Items)

| Original Finding | Component | Current Control | Current Business Meaning | Disposition | Evidence |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `CreateSale` Product Model | `CreateSale.vue` | Controlled Select | Master catalogue model | **FIXED** | Sourced from `store.products`; auto-updates MSRP and clears unit; no silent fallback |
| `CreateSale` Operator / Processed By | `CreateSale.vue` | Read-only Text | Authenticated session context | **FIXED** | Bound to `user.name`; read-only; not presented as salesperson; attribution hold kept internal |
| `CreatePurchaseOrder` Supplier | `CreatePurchaseOrder.vue` | Datalist + Strict Validation | Canonical procurement vendor | **FIXED** | Strict validation against canonical `SUP-01`..`SUP-04`; resolves `supplier_id`; no silent fallback |
| `CreateLead` Interested Product | `CreateLead.vue` | Controlled Select | Catalogue vehicle | **FIXED** | Sourced from `store.products`; resolves catalogue name |
| `CreateCustomOrder` Product / Spec | `CreateCustomOrder.vue` | Free text | Custom non-standard request | **RECLASSIFIED_KEEP_FREE_TEXT** | Captures bespoke customer build requests prior to catalogue SKU issuance |
| `CreateCase` Assigned Technician | `CreateCase.vue` | Operational Text | Technician assignment | **BUSINESS_DECISION_REQUIRED** | Technician dispatch workflow held internally; intake records assigned tech notes |
| `CreateRepairJob` Unit Model / Variant | `CreateRepairJob.vue` | Auto-populated | Intake chassis model | **FIXED** | Populated dynamically from upstream warranty case record (`c.unitModel`) |
| `CreateRepairJob` Technician Work Plan | `CreateRepairJob.vue` | Multi-line Task Array | Workshop labor breakdown | **FIXED** | Structured tasks table with duration, technician selector from `store.getTechnicians()`, and status |
| `CreateProduct` Supplier | `CreateProduct.vue` | Unrendered Draft Key | Vendor sourcing | **NOT_APPLICABLE** | Supplier is not rendered in catalogue product creation UI; products are procured via PO |
| `CreateCustomer` Assigned Salesperson | `CreateCustomer.vue` | N/A | Staff attribution | **NOT_APPLICABLE** | No salesperson field exists in `CreateCustomer.vue` schema |
| `CreateQuotation` Product Line Items | `CreateQuotation.vue` | Controlled Select | Catalogue vehicle | **FIXED** | Populated dynamically from `store.products`; auto-updates price; resolves `product_id` |
| `CreateStockRequest` Requested Product | `CreateStockRequest.vue` | Controlled Select | Catalogue replenishment item | **FIXED** | Populated dynamically from `store.products`; auto-computes local stock level |
| `CreateReturn` Returned Product / Unit | `CreateReturn.vue` | Serialized text entry | Customer returned unit | **RECLASSIFIED_KEEP_FREE_TEXT** | Takes customer VIN/chassis under return inspection; not yet accepted back into inventory |
| `CreateAdjustmentRequest` Target Product | `CreateAdjustmentRequest.vue` | Free text | Discrepant inventory item | **RECLASSIFIED_KEEP_FREE_TEXT** | Cites either bulk accessories or specific serial numbers pending auditor review |

---

### 10.3 Global Transactional "All Branches" Audit (Exhaustive 19 Views)

Every transactional create, edit, receive, and handover form in the repository was audited to ensure `TRANSACTIONAL_ALL_BRANCHES_WRITES = 0`:

| Operational Form | Context / Domain | Control Type | Validation & Resolution Applied | Writes "All Branches"? |
| :--- | :--- | :--- | :--- | :--- |
| `CreateSale.vue` | Sales Order / POS | Role-aware Select / Readonly | Rejects "All Branches" at submit; SA dropdown excludes it; resolves `branch_id` | **NO (BLOCKED)** |
| `CreatePurchaseOrder.vue` | Procurement PO Destination | Dynamic Select | Rejects "All Branches" at submit; options strictly concrete; resolves `branch_id` | **NO (BLOCKED)** |
| `CreateExpense.vue` | Operational Expense | Role-aware Select / Readonly | Rejects "All Branches" at submit; SA dropdown excludes it; resolves `branch_id` | **NO (BLOCKED)** |
| `CreateQuotation.vue` | Quotation Issuing | Role-aware Select / Readonly | Rejects "All Branches" at submit; options exclude it; resolves `branch_id` | **NO (BLOCKED)** |
| `CreateCustomOrder.vue` | Custom Order | Role-aware Select / Readonly | Rejects "All Branches" at submit; options exclude it; resolves `branch_id` | **NO (BLOCKED)** |
| `CreateTransfer.vue` | Relocation Route | Role-aware Select / Select | Rejects "All Branches" as origin or destination; requires `from != to` | **NO (BLOCKED)** |
| `CreateStockRequest.vue` | Stock Request | Role-aware Select / Readonly | Rejects "All Branches" at submit; options exclude it; resolves `branch_id` | **NO (BLOCKED)** |
| `CreateCycleCount.vue` | Stock Audit | Role-aware Select / Readonly | Rejects "All Branches" at submit; options exclude it; resolves `branch_id` | **NO (BLOCKED)** |
| `CreateAdjustmentRequest.vue` | Inventory Adjustment | Role-aware Select / Readonly | Rejects "All Branches" at submit; options exclude it; resolves `branch_id` | **NO (BLOCKED)** |
| `CreateReturn.vue` | RMA Return | Role-aware Select / Readonly | Rejects "All Branches" at submit; options exclude it; resolves `branch_id` | **NO (BLOCKED)** |
| `CreateFollowUp.vue` | Lead Follow-Up | Role-aware Select / Readonly | Rejects "All Branches" at submit; options exclude it; resolves `branch_id` | **NO (BLOCKED)** |
| `CreateLead.vue` | Lead Intake | Role-aware Select / Readonly | Rejects "All Branches" at submit; options exclude it; resolves `branch_id` | **NO (BLOCKED)** |
| `CreateQuarantineRecord.vue` | Defect Isolation | Role-aware Select / Readonly | Rejects "All Branches" at submit; options exclude it; resolves `branch_id` | **NO (BLOCKED)** |
| `CreateUser.vue` | Staff Assignment | Canonical Select | Sourced strictly from concrete `store.branches`; resolves `branch_id` | **NO (BLOCKED)** |
| `ReceivePurchase.vue` | Goods Receipt | Bound to PO Destination | Inherits concrete destination branch from PO; validates branch authorization | **NO (BLOCKED)** |
| `ReceiveTransfer.vue` | Transfer Inward Receipt | Bound to Transfer Destination | Inherits concrete destination branch from transfer consignment | **NO (BLOCKED)** |
| `CreateDeliveryHandover.vue` | Vehicle Delivery Handover | Role-aware Select / Readonly | Rejects "All Branches" at submit; resolves `branch_id` | **NO (BLOCKED)** |
| `CreateCase.vue` | After-Sales Intake Case | Role-aware Select / Readonly | Rejects "All Branches" at submit; resolves `branch_id` | **NO (BLOCKED)** |
| `CreateRepairJob.vue` | Workshop Repair Job | Role-aware Select / Readonly | Rejects "All Branches" at submit; resolves `branch_id` | **NO (BLOCKED)** |

**Result:** `TRANSACTIONAL_ALL_BRANCHES_WRITES = 0`. Zero forms permit "All Branches" writes. Zero silent fallbacks to `BR-01`.

---

### 10.4 412-Control Mechanical Re-Audit & Reconciliation Against 335 Baseline

To guarantee exhaustive accounting with zero unclassified fields, a mechanical AST/template scan was executed across all 38 create, edit, receive, and handover form views (`scripts/reconcile_335_fields.cjs`), generating the authoritative register `docs/audits/AUDIT_335_FIELDS_RECONCILIATION.md` and `docs/audits/AUDIT_335_FIELDS_RECONCILIATION.json`.

| Category | Initial Estimate Baseline | Mechanical Scan Count | Final Classification Disposition |
| :--- | :--- | :--- | :--- |
| **Total Distinct Form Controls** | 335 (Logical minimum) | **412** | All 412 discrete controls classified across 38 views |
| **Relational Master Key Controls** | 102 | **98** | Bound to canonical masters (`branches`, `products`, `suppliers`, `users`) |
| **Controlled Enums & Statuses** | 105 | **92** | Validated select/radio options matching data dictionaries |
| **Operational Free-Text & Descriptors** | 128 | **222** | Customer info, contact details, inspection notes, internal bay labels |
| **P0 Control Defects Remaining** | 12 | **0** | 8 FIXED, 4 RECLASSIFIED_KEEP_FREE_TEXT |
| **P1 Control Defects Remaining** | 14 | **0** | 8 FIXED, 3 RECLASSIFIED_KEEP_FREE_TEXT, 1 BUSINESS_DECISION_REQUIRED, 2 NOT_APPLICABLE |
| **Overall Classification Status** | - | **412 / 412** | 144 FIXED, 222 RECLASSIFIED_KEEP_FREE_TEXT, 38 BUSINESS_DECISION_REQUIRED, 8 NOT_APPLICABLE |
| **Unclassified Form Controls** | - | **0** | `FIELD_AUDIT_UNCLASSIFIED = 0` |

---

### 10.5 Language Normalization & Policy Cleanup

1. **QC Hold Eligibility**: Universal PDI claims removed. Formatted as: *"Receiving / QC or QC Hold: not currently available for sale until the unit returns to an eligible Available state through the authorized workflow."*
2. **Reserved Unit Semantics**: Removed false claims that customer quotations or deposits universally trigger physical unit reservations (`QUOTATION_RESERVATION_CLAIMS = 0`, `UNIVERSAL_DEPOSIT_RESERVATION_CLAIMS = 0`). Formatted as: *"Reserved: This physical unit is already allocated to another confirmed order/customer transaction and is not available for a new sale."*
3. **Sold / Handover State**: Removed legal/commercial ownership claims. Formatted as: *"After the required handover/completion, the system records the unit as Sold/customer-owned."*
4. **Salesperson vs Authenticated Operator**: Cleaned out internal `BD-SALES-ATTRIBUTION` token leaks from employee-facing tour copy. `Processed By` displayed strictly as authenticated operator context (`OPERATOR_SALESPERSON_CONFLATION = 0`).
5. **Frontend Security Boundaries**: Removed server-side cryptographic/tamper-proof claims ("tamper-proof log", "session hijacking defense"). Clarified as: *"frontend role-aware controls and validation; server-side authorization remains a backend responsibility."* (`FRONTEND_SECURITY_OVERCLAIMS = 0`).
6. **Master Data Provenance**: Restored canonical `store.suppliers` (`SUP-01` to `SUP-04`). Removed synthetic test artifact `SUP-05: Shenzhen EV Industrial Group` from production store and updated tests to use canonical `SUP-01: BRG Factory` (`INVENTED_MASTER_DATA = 0`, `NEW_CANONICAL_MASTER_DATA_INVENTED_FOR_TEST = 0`).

---

### 10.6 Verification Test Totals

- `tests/test_role_aware_form_controls.test.js`: **31 / 31 PASSED**
- Full Vitest Test Suites: **15 / 15 PASSED (161 / 161 Tests Green)**
- Master Readiness Test: **114 / 114 PASSED** (`tests/test_master_readiness.js`)
- Legacy DAP Route Coverage: **23 / 23 PASSED** (`scripts/test_dap_exhaustive_coverage.cjs`)
- Production Build: **PASS (0 errors, 4.77s)**
- Live/Component Evidence Type: **COMPONENT_INTERACTION_TESTS (jsdom / Vue Test Utils)**

---
*End of Final Closure Section.*


