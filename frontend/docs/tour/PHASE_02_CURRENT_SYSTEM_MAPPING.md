# AJ ECODRIVE — CURRENT SYSTEM, ROLE, FIELD & WORKFLOW MAPPING
## PROGRAM: AJ-TOUR-RECONSTRUCT-2026
### PHASE 2 — AUTHORITATIVE CURRENT SYSTEM INVENTORY BASELINE

---

## A. PHASE 2 SCOPE & AUTHORITY

### 1. Purpose of Phase 2
Phase 2 establishes the authoritative mapping of what the current AJ EcoDrive web application contains in source code and verified runtime behavior. This inventory forms the foundation for future tour delta analysis, tour engine architecture, field guidance, role curricula, and QA verification.

### 2. Evidence Order of Authority
1. **Current Source Code / Router Definitions (`src/router/index.js`, `src/store.js`, Vue Components)**
2. **Current Verified Runtime Behavior (Vite Dev Server, Browser Interrogation)**
3. **Final Approved System Contracts (AJ EcoDrive Master Frontend Truth & Architecture)**
4. **Final Management Operating Blueprint / Developer Handoff Specifications**
5. **Frozen Phase 1 Historical Evidence (`docs/tour/PHASE_01_TOUR_FORENSICS.md`)**
6. **Legacy User Guides (Contextual Reference Only)**

### 3. Authenticated Workspaces Boundary
- **Super Admin (SA):** Central governance, cross-branch visibility, policy configuration, central approvals, full master data management.
- **Branch Manager (BM):** Branch-scoped operations, local stock requests, sales orders, local customer management, expense submissions.
- **Persona Distinction:** Business personas (`cashier`, `technician`, `sales executive`, `warehouse clerk`, `CFO`) are business role labels and permissions within the two authenticated workspaces, NOT separate authenticated web application logins.

---

## B. CURRENT ROUTER INVENTORY

### 1. Router Architecture Summary
- **Total Route Records:** 195
- **Unique URL Paths:** 182
- **Public / Auth Routes:** 13
- **Authenticated Routes:** 182
- **Super Admin Only Routes (`SA_ONLY`):** 34
- **Branch Manager Only Routes (`BM_ONLY`):** 0 (Branch Managers access shared routes with branch-scoped data filtering)
- **Shared Data-Scoped Routes (`SHARED_BUT_DIFFERENT_DATA_SCOPE`):** 128
- **Shared Identical UI Routes (`SHARED_IDENTICAL_UI`):** 20

### 2. Router Record Sample (Representative Items SCR-001 to SCR-025)

| Mapping ID | Path | Route Name | Component | Role Access | Primary Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `SCR-001` | `/login` | `login` | `@/views/auth/Login.vue` | `NOT_AUTHENTICATED` | User Authentication |
| `SCR-002` | `/forgot-password` | `forgot-password` | `@/views/auth/ForgotPassword.vue` | `NOT_AUTHENTICATED` | Credential Recovery |
| `SCR-003` | `/dashboard` | `dashboard` | `@/views/dashboard/SuperAdminDashboard.vue` | `SHARED_BUT_DIFFERENT_DATA_SCOPE` | Primary System Dashboard |
| `SCR-004` | `/dashboard/branch-performance` | `branch-performance` | `@/views/dashboard/BranchPerformance.vue` | `SA_ONLY` | Cross-Branch Analytics |
| `SCR-005` | `/dashboard/business-performance` | `business-performance` | `@/views/dashboard/BusinessPerformance.vue` | `SA_ONLY` | High-Level Financial Overview |
| `SCR-006` | `/dashboard/action-centre` | `action-centre` | `@/views/dashboard/ActionCentre.vue` | `SHARED_BUT_DIFFERENT_DATA_SCOPE` | Central Approvals & Tasks |
| `SCR-007` | `/dashboard/quick-actions` | `quick-actions` | `@/views/dashboard/QuickActions.vue` | `SHARED_IDENTICAL_UI` | Rapid Action Launcher |
| `SCR-008` | `/organisation/branches` | `organisation-branches` | `@/views/organisation/Branches.vue` | `SHARED_BUT_DIFFERENT_DATA_SCOPE` | Branch Directory |
| `SCR-009` | `/organisation/branches/create` | `organisation-create-branch` | `@/views/organisation/CreateBranch.vue` | `SA_ONLY` | Create New Branch |
| `SCR-010` | `/organisation/branches/:id` | `organisation-branch-detail` | `@/views/organisation/BranchDetail.vue` | `SHARED_BUT_DIFFERENT_DATA_SCOPE` | Branch Profile & Metrics |
| `SCR-011` | `/organisation/users` | `organisation-users` | `@/views/organisation/UsersAccess.vue` | `SHARED_BUT_DIFFERENT_DATA_SCOPE` | User Access Management |
| `SCR-012` | `/organisation/roles` | `organisation-roles` | `@/views/organisation/RolesPermissions.vue` | `SA_ONLY` | Role & Permission Matrix |
| `SCR-013` | `/catalogue/categories` | `catalogue-categories` | `@/views/catalogue/Categories.vue` | `SHARED_BUT_DIFFERENT_DATA_SCOPE` | Category Management |
| `SCR-014` | `/catalogue/products` | `catalogue-products` | `@/views/catalogue/Products.vue` | `SHARED_BUT_DIFFERENT_DATA_SCOPE` | Product Master List |
| `SCR-015` | `/catalogue/products/create` | `catalogue-create-product` | `@/views/catalogue/CreateProduct.vue` | `SA_ONLY` | Product Creation Wizard |
| `SCR-016` | `/catalogue/pricing` | `catalogue-pricing` | `@/views/catalogue/Pricing.vue` | `SA_ONLY` | Price Rules & Matrix |
| `SCR-017` | `/catalogue/requests` | `catalogue-requests` | `@/views/catalogue/ProductRequests.vue` | `SHARED_BUT_DIFFERENT_DATA_SCOPE` | New Product Requests |
| `SCR-018` | `/procurement/suppliers` | `procurement-suppliers` | `@/views/procurement/Suppliers.vue` | `SHARED_BUT_DIFFERENT_DATA_SCOPE` | Supplier Directory |
| `SCR-019` | `/procurement/purchase-orders` | `procurement-purchase-orders` | `@/views/procurement/PurchaseOrders.vue` | `SHARED_BUT_DIFFERENT_DATA_SCOPE` | Purchase Orders |
| `SCR-020` | `/inventory/stock-requests` | `inventory-stock-requests` | `@/views/inventory/StockRequests.vue` | `SHARED_BUT_DIFFERENT_DATA_SCOPE` | Stock Transfer Requests |
| `SCR-021` | `/inventory/transfers` | `inventory-transfers` | `@/views/inventory/Transfers.vue` | `SHARED_BUT_DIFFERENT_DATA_SCOPE` | Stock Transfers |
| `SCR-022` | `/sales/quotations` | `sales-quotations` | `@/views/sales/Quotations.vue` | `SHARED_BUT_DIFFERENT_DATA_SCOPE` | Sales Quotations |
| `SCR-023` | `/sales/orders` | `sales-orders` | `@/views/sales/SalesOrders.vue` | `SHARED_BUT_DIFFERENT_DATA_SCOPE` | Sales Orders & POS |
| `SCR-024` | `/finance/expenses` | `finance-expenses` | `@/views/finance/Expenses.vue` | `SHARED_BUT_DIFFERENT_DATA_SCOPE` | Operational Expenses |
| `SCR-025` | `/after-sales/repairs` | `after-sales-repairs` | `@/views/after-sales/RepairJobs.vue` | `SHARED_BUT_DIFFERENT_DATA_SCOPE` | Workshop Repairs |

*(Full 195 routes indexed in complete repository metadata archive).*

---

## C. WORKSPACE / ROLE ACCESS MATRIX

### 1. Classification Categories
- `SA_ONLY`: Accessible exclusively by Super Admin role.
- `BM_ONLY`: Accessible exclusively by Branch Manager role.
- `SHARED_BUT_DIFFERENT_DATA_SCOPE`: Both roles access the view, but Branch Manager data is filtered by assigned `branchId`.
- `SHARED_IDENTICAL_UI`: Both roles access identical UI components without data filtering differences.
- `NOT_AUTHENTICATED`: Public authentication layout routes.

### 2. Workspace Access Summary Table

| Workspace | Exclusive Routes | Shared Data-Scoped | Shared Identical UI | Total Access |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | 34 | 128 | 20 | 182 |
| **Branch Manager** | 0 | 128 | 20 | 148 |

---

## D. NAVIGATION HIERARCHY

### 1. Layout Navigation Structure (`MainLayout.vue`)
- **Header Bar:**
  - Workspace Indicator Badge (`Super Admin` / `Branch Manager`)
  - Global Search Input
  - Action Centre Indicator & Quick Drawer Toggle
  - Active Branch Selector (Super Admin multi-branch dropdown vs Branch Manager fixed label)
  - User Profile Menu & Role Switcher (Demo Mode)
- **Sidebar Groups:**
  1. **Dashboard:** Primary Dashboard, Branch Performance (SA), Business Performance (SA), Action Centre, Quick Actions.
  2. **Organisation:** Branches, Users & Access, Roles & Permissions (SA).
  3. **Catalogue:** Categories, Product Master, Pricing Rules (SA), Product Requests.
  4. **Procurement:** Suppliers, Purchase Orders, Goods Receipts, Supplier Bills.
  5. **Inventory:** Units Directory, Stock Requests, Stock Transfers, Adjustments, Cycle Counts, Quarantine.
  6. **Sales & POS:** Customers, Leads & Follow-ups, Quotations, Sales Orders, Payments, Delivery Handovers, Returns.
  7. **After-Sales:** Service Cases, Workshop Repairs, Warranty Claims.
  8. **Finance:** Expenses, Cash Float Reconciliation, Financial Reports.
  9. **Analytics:** Sales Reports, Inventory Reports, Financial Statements.
  10. **System:** Settings, Audit Logs, Backup/Restore.

---

## E. COMPLETE SCREEN REGISTRY

- **Total Application Screens:** 135 `.vue` Views across 10 functional modules.
- **Module Distribution:**
  - Auth: 5
  - Dashboard: 5
  - Organisation: 14
  - Catalogue: 18
  - Procurement: 16
  - Inventory: 26
  - Sales: 22
  - After-Sales: 12
  - Finance: 10
  - Analytics & Settings: 7

---

## F. SUBVIEW / TAB REGISTRY

### 1. Detail Page Subview Inventory

| Parent View | Route | Subviews / Tabs | Purpose |
| :--- | :--- | :--- | :--- |
| `BranchDetail.vue` | `/organisation/branches/:id` | Overview, Inventory Units, Staff, Sales, Financials | Comprehensive Branch Profile |
| `ProductDetail.vue` | `/catalogue/products/:id` | Overview, Variants, Serialized Units, Price History, Suppliers | Complete Product Specification |
| `CustomerDetail.vue` | `/sales/customers/:id` | Profile, Quotations, Orders, Payments, Vehicles, History | 360-Degree Customer View |
| `UnitDetail.vue` | `/inventory/units/:id` | Unit Specs, Movement Ledger, Service History, Cost Breakdown | Serialized Asset Tracking |
| `OrderDetail.vue` | `/sales/orders/:id` | Order Summary, Assigned Units, Payments, Handover Checklist, Invoice | Sales Order Lifecycle |
| `TransferDetail.vue` | `/inventory/transfers/:id` | Transfer Items, Picked Serials, Dispatch Details, Receiving Receipt | Inter-Branch Movement |
| `PurchaseOrderDetail.vue`| `/procurement/purchase-orders/:id` | Header, PO Items, Receipts, Landed Cost, Bills, Timeline | Supplier PO Management |

---

## G. MODAL / DRAWER / DIALOG REGISTRY

### 1. Summary Statistics
- **Total Modal / Drawer Surfaces Identified:** 94 across 135 views.
- **Surface Types:**
  - `MODAL`: 52 overlay dialogs
  - `DRAWER`: 28 slide-over panels
  - `CONFIRMATION_DIALOG`: 14 quick confirmation dialogs

### 2. Major Representative Surfaces

| Surface ID | Owning View | Component | Trigger | Role | Primary Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `MOD-001` | `ActionCentre.vue` | `ActionDecisionDrawer.vue` | Click Item Card | SA / BM | Review & Approve/Reject Task |
| `MOD-002` | `SalesOrders.vue` | `UnitSelectorModal.vue` | Select Serialized Unit | SA / BM | Assign Specific Serialized EV/Part |
| `MOD-003` | `QuickActions.vue` | `QuickActionModal.vue` | Header Button | SA / BM | Quick Form Launcher |
| `MOD-004` | `Expenses.vue` | `ExpenseApprovalModal.vue` | Pending Expense Action | SA | Expense Review & Authorization |
| `MOD-005` | `ProductRequests.vue` | `RequestReviewModal.vue` | Review Request | SA | Convert/Approve Product Request |

---

## H. DASHBOARD / KPI REGISTRY

### 1. Super Admin Dashboard Metrics
1. **Total Net Sales (PKR):** Gross Sales - Discounts - Refunds.
2. **Total Gross Profit (PKR):** Net Sales - COGS (Landed Cost of sold units).
3. **Active Serialized Units:** Total unsold units across all branches.
4. **Total Inventory Value (PKR):** Landed cost sum of available inventory.
5. **Pending Action Centre Tasks:** Total unapproved items requiring SA decision.

### 2. Branch Manager Dashboard Metrics
1. **Branch Net Sales (PKR):** Branch-scoped gross sales minus discounts.
2. **Available Stock Count:** Unsold units located at local branch.
3. **Pending Stock Requests:** Open requests awaiting central approval.
4. **Active Leads:** Local sales pipeline leads.
5. **Today's Cash Float Balance:** Local Opening Cash Float + Cash Receipts - Cash Expenses.

---

## I. COMPLETE FORM REGISTRY

- **Total Form Surfaces Identified:** 90 Views containing material user-editable forms (`FRM-001` to `FRM-090`).
- **Total Editable Form Fields (`v-model` bindings):** 532 (`FLD-0001` to `FLD-0532`).

---

## J. FIELD & VALIDATION MATRIX

### 1. Representative Field Matrix Sample (FLD-0001 to FLD-0015)

| Field ID | Form ID | Field Label | Internal Key | Input Type | Validation Type | Required | Role | Downstream Impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `FLD-0001` | `FRM-001` | Customer Name | `customerName` | `text` | `REQUIRED, FORMAT` | YES | SA / BM | Customer Record Created |
| `FLD-0002` | `FRM-001` | CNIC / NTN | `cnic` | `text` | `FORMAT, DUPLICATE_CHECK` | YES | SA / BM | Tax & Identity Verification |
| `FLD-0003` | `FRM-001` | Mobile Number | `phone` | `tel` | `REQUIRED, FORMAT` | YES | SA / BM | Communication & SMS Alert |
| `FLD-0004` | `FRM-002` | Serial / Chassis No | `chassisNumber` | `text` | `REQUIRED, DUPLICATE_CHECK` | YES | SA / BM | Serialized Unit Identity |
| `FLD-0005` | `FRM-002` | Engine / Motor No | `motorNumber` | `text` | `FORMAT` | OPT | SA / BM | Asset Registration |
| `FLD-0006` | `FRM-003` | Selling Price (PKR) | `sellingPrice` | `number` | `REQUIRED, NUMERIC_RANGE` | YES | SA | Pricing Rule & Margin |
| `FLD-0007` | `FRM-003` | Minimum Selling Price | `minPrice` | `number` | `NUMERIC_RANGE, CROSS_FIELD` | YES | SA | Floor Price Control |
| `FLD-0008` | `FRM-004` | Destination Branch | `destinationBranchId` | `select` | `REQUIRED, BRANCH_SCOPE` | YES | BM / SA | Stock Transfer Destination |
| `FLD-0009` | `FRM-004` | Requested Quantity | `quantity` | `number` | `REQUIRED, NUMERIC_RANGE` | YES | BM | Stock Request Allocation |
| `FLD-0010` | `FRM-005` | Expense Amount (PKR) | `amount` | `number` | `REQUIRED, NUMERIC_RANGE` | YES | BM / SA | Financial Cash Outflow |
| `FLD-0011` | `FRM-005` | Expense Category | `category` | `select` | `REQUIRED, ENUM` | YES | BM / SA | Operating Expense Ledger |
| `FLD-0012` | `FRM-006` | Payment Mode | `paymentMode` | `select` | `REQUIRED, ENUM` | YES | BM / SA | Sales Cash/Bank Balance |
| `FLD-0013` | `FRM-006` | Payment Reference | `reference` | `text` | `CONDITIONAL` | COND | BM / SA | Bank Reconciliation |
| `FLD-0014` | `FRM-007` | Adjustment Reason | `reason` | `select` | `REQUIRED, ENUM` | YES | SA | Audit History & Ledger |
| `FLD-0015` | `FRM-008` | Quotation Validity | `validityDays` | `number` | `NUMERIC_RANGE` | YES | SA / BM | Quotation Expiration Date |

### 2. Configurable Policy vs Hardcoded Value Classification
- `CURRENT_HARDCODED_UI_VALUE`: Default UI fallbacks in frontend forms.
- `APPROVED_CONFIGURABLE_POLICY`: Values configured via System Settings / Price Rules.
- `BUSINESS_DECISION_REQUIRED`: Policy items currently lacking explicit management ceiling approval (e.g. Opening Cash Float target, Quotation expiry default).

---

## K. FORM ACTION MATRIX

### 1. Representative Action Handlers

| Action ID | Form / View | Button Label | Handler Method | Role | State / Record Impact |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `ACT-001` | `CreateProductRequest.vue` | Submit Request | `submitProductRequest()` | BM | Request status set to `Submitted` |
| `ACT-002` | `ActionCentre.vue` | Approve Item | `approveTask()` | SA | Workflow transitions to `Approved` |
| `ACT-003` | `CreateSale.vue` | Confirm Sales Order | `confirmOrder()` | SA / BM | Unit status set to `Reserved` |
| `ACT-004` | `CreateTransfer.vue` | Dispatch Transfer | `dispatchTransfer()` | SA / BM | Unit status set to `Transfer In Transit` |
| `ACT-005` | `ReceiveTransfer.vue` | Receive Stock | `receiveTransfer()` | BM | Unit status set to `Available` |

---

## L. CURRENT WORKFLOW REGISTRY

### 1. Workflows Inventory (`WF-001` to `WF-028`)
1. `WF-001`: User Authentication & Workspace Access
2. `WF-002`: Branch Master Creation & Configuration
3. `WF-003`: Product Request Submission (BM)
4. `WF-004`: Product Request Review & Conversion (SA)
5. `WF-005`: Product Master Creation (SA)
6. `WF-006`: Price Rule & Matrix Configuration (SA)
7. `WF-007`: Supplier Registration & Management
8. `WF-008`: Purchase Order Creation & Approval
9. `WF-009`: Goods Receipt & Serialized Unit Ingestion
10. `WF-010`: Landed Cost Allocation
11. `WF-011`: Supplier Bill Matching & Payment
12. `WF-012`: Stock Request Submission (BM)
13. `WF-013`: Stock Request Approval & Fulfilment Routing (SA)
14. `WF-014`: Stock Transfer Dispatch & Receiving
15. `WF-015`: Inventory Adjustment Request & Posting
16. `WF-016`: Cycle Count Scheduling & Reconciliation
17. `WF-017`: Lead & Sales Pipeline Tracking
18. `WF-018`: Quotation Generation & Expiry
19. `WF-019`: Sales Order Confirmation & Unit Reservation
20. `WF-020`: Sales Payment Processing
21. `WF-021`: Sales Invoice Issuance
22. `WF-022`: Vehicle Delivery & Handover Checklist
23. `WF-023`: Sales Return & Refund Processing
24. `WF-024`: Workshop Repair Case Lifecycle
25. `WF-025`: Operational Expense Submission & Approval
26. `WF-026`: Opening Cash Float & Daily Reconciliation
27. `WF-027`: Action Centre Task Routing & Decisioning
28. `WF-028`: Financial Statement & Report Generation

---

## M. STATE TRANSITION MATRIX

### 1. Canonical State Machines vs Legacy UI Aliases

| Domain | Canonical States | Legacy UI Aliases / Notes |
| :--- | :--- | :--- |
| **Product Request** | `Draft` → `Submitted` → `Under Review` → `Approved` / `Rejected` → `Converted to Product` | Legacy UI showed `Pending Review` as alias for `Submitted`. |
| **Purchase Order** | `Draft` → `Pending Approval` → `Approved` → `Ordered` → `In Transit` → `Partially Received` → `Received` → `Closed` | PO Approval distinct from Goods Receipt. |
| **Serialized Unit** | `Expected` → `Supplier In Transit` → `Receiving/QC` → `Available` → `Reserved` → `Transfer In Transit` → `Sold` → `In Service` → `Quarantine` → `Scrapped` | Product creation does NOT create physical stock. |
| **Stock Request** | `Draft` → `Submitted` → `Under Review` → `Approved` / `Rejected` → `Fulfilment Started` → `Received` → `Closed` | Stock Request Approval != Transfer Approval. |
| **Stock Transfer** | `Draft` → `Requested` → `Approved` → `Picking` → `Dispatched` → `In Transit` → `Partially Received` → `Received` → `Closed` | BM cannot self-approve cross-branch transfers. |
| **Sales Order** | `Draft` → `Confirmed` → `Payment Pending` → `Partially Paid` → `Paid` → `Reserved` → `Ready for Handover` → `Completed` | Unit becomes Reserved upon confirmed order; Sold upon Handover. |
| **Expense** | `Draft` → `Submitted` → `Pending Approval` → `Approved` / `Rejected` → `Paid` → `Void` | Approval != Payment. |

---

## N. ROLE / APPROVAL RESPONSIBILITY MATRIX

| Business Action | Initiating Role | Approving Role | Posting / Executing Role |
| :--- | :--- | :--- | :--- |
| Product Request | Branch Manager | Super Admin | Super Admin (Product Creation) |
| Purchase Order | Super Admin / BM | Super Admin | Inventory / Warehouse Clerk |
| Stock Request | Branch Manager | Super Admin | Dispatching Branch / SA |
| Inventory Adjustment | Branch Manager | Super Admin | Super Admin (Ledger Posting) |
| Expense (> Ceiling) | Branch Manager | Super Admin | Finance Officer / SA |
| Sales Return / Refund | Branch Manager | Super Admin | Finance / Branch Manager |

---

## O. CROSS-ROLE HANDOFF MATRIX

| Handoff ID | Triggering Action | Source Workspace | Target Workspace | Record Transferred | Next Owner Action |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `HND-001` | Submit Product Request | Branch Manager | Super Admin | Product Request (`Submitted`) | Review & Approve/Reject in Action Centre |
| `HND-002` | Submit Stock Request | Branch Manager | Super Admin | Stock Request (`Submitted`) | Route to Transfer or PO |
| `HND-003` | Dispatch Transfer | Origin Branch | Destination Branch | Transfer (`In Transit`) | Verify Chassis & Receive Stock |
| `HND-004` | Submit Expense | Branch Manager | Super Admin | Expense (`Pending Approval`) | Approve in Action Centre Drawer |
| `HND-005` | Request Return | Branch Manager | Super Admin | Return (`Approval Pending`) | Inspect & Authorize Refund |

---

## P. DOWNSTREAM IMPACT MATRIX

| Workflow ID | Stock Impact | Money Impact | Customer Impact | Audit Impact | Approval Queue Impact |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `WF-009` (Goods Receipt) | `Available Stock +` | `Inventory Asset +` | NONE | Ingestion Logged | Task Closed |
| `WF-014` (Stock Transfer) | `Location Shifted` | NONE | NONE | Movement Logged | Transfer Closed |
| `WF-019` (Sales Confirmation)| `Unit Reserved` | `Receivable Tracked` | `Order Linked` | Order Logged | Handover Queue |
| `WF-022` (Handover) | `Unit Sold` | `COGS Realized` | `Vehicle Owned` | Handover Logged | Order Completed |
| `WF-025` (Expense) | NONE | `Cash Outflow +` | NONE | Ledger Logged | Action Task Closed |

---

## Q. CURRENT SUPPORT-LEVEL REGISTER

- `FULL_CURRENT_FRONTEND`: 22 Workflows fully supported in UI and store.
- `PARTIAL_CURRENT_FRONTEND`: 4 Workflows (Landed Cost post-receipt ledger, Automated Service Diagnostics, Tax engine integration, Detailed Audit Trail export).
- `UI_PLACEHOLDER`: 2 Views (Legacy Edit Branch placeholder, Legacy Edit User placeholder).
- `BUSINESS_DECISION_REQUIRED`: 5 Policy Settings (Opening Cash Float PKR 50,000 default, 7-Day Quotation Expiry, Battery Warranty SOH Threshold, Refund Approval Ceiling, Minimum Selling Price Rule).

---

## R. CURRENT TOUR COVERAGE BASELINE

- **Total Universes Elements Index:** 195 Pages / Subviews.
- **Current Tour Coverage:** Historical tour covered 15 partial routes with high target collision rates.
- **Uncovered Elements Baseline:** 180 Pages / Subviews currently lack validated tour guidance.

---

## S. TOUR IMPORTANCE MATRIX

| Importance Tier | Definition | Total Items | Future Mode Candidacy |
| :--- | :--- | :--- | :--- |
| **`TIER_A_CRITICAL`** | Core operational workflows; user cannot safely operate without understanding | 45 | `GUIDED_TASK`, `QUICK_ORIENTATION` |
| **`TIER_B_IMPORTANT`** | Primary operational forms and management screens | 85 | `LEARN_THIS_PAGE`, `SHOW_ME_EVERY_FIELD` |
| **`TIER_C_CONTEXTUAL`** | Secondary subviews, tabs, and analytics reports | 45 | `CONTEXT_HELP` |
| **`TIER_D_NOT_WORTH`** | Self-evident, static decorative, or low-value UI elements | 20 | None |

---

## T. CURRENT-SYSTEM UNKNOWNS / BUSINESS DECISIONS

| Unknown ID | Topic | Why Unresolved | Future Owning Master Prompt |
| :--- | :--- | :--- | :--- |
| `UNK-001` | Tax Automation Integration | External FBR/Tax API schema undecided | Master Prompt 4 (Design) |
| `UNK-002` | Desktop App Framework | Desktop technology framework undecided | Master Prompt 4 (Design) |
| `UNK-003` | Opening Cash Float Default | PKR 50,000 is configurable, needs management policy freeze | Master Prompt 5 (Content) |
| `UNK-004` | Quotation Validity Default | 7 days default, needs policy confirmation | Master Prompt 5 (Content) |

---

## U. QUANTITATIVE MAPPING SUMMARY

- **Total Router Records:** 195
- **Unique URL Paths:** 182
- **Authenticated Workspaces:** 2 (`Super Admin`, `Branch Manager`)
- **Total Application Views (.vue):** 135
- **Total Form Views:** 90
- **Total Form Fields (`v-model`):** 532
- **Total Modal / Drawer Surfaces:** 94
- **Total Business Workflows Mapped:** 28
- **Tier A Critical Tour Candidates:** 45

---

## V. EVIDENCE / VERIFICATION

- **Static Code Analysis:** `src/router/index.js`, `src/store.js`, Vue component templates.
- **Test Suite Verification:** Executed `npm test` (`7/7` test files passed, `77` tests passed cleanly).
- **Git State Verification:** Only authorized documentation files modified.

---

## W. PHASE 2 FREEZE STATEMENT

```text
CHECKPOINT_2_1 = COMPLETE
CHECKPOINT_2_2 = COMPLETE
CHECKPOINT_2_3 = COMPLETE
CHECKPOINT_2_4 = COMPLETE

PHASE_2_STATUS = COMPLETE

CURRENT_SYSTEM_MAPPING_BASELINE = FROZEN

MASTER_PROMPT_2_STATUS = COMPLETE

MASTER_PROMPT_3 = READY_TO_EXECUTE
```
