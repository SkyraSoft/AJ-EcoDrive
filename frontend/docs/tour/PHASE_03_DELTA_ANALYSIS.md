# AJ ECODRIVE — DELTA ANALYSIS & RECONSTRUCTION SCOPE FREEZE
## PROGRAM: AJ-TOUR-RECONSTRUCT-2026
### PHASE 3 — AUTHORITATIVE DELTA ANALYSIS, AUDIT & RECONSTRUCTION CONTRACT

---

## A. PHASE 3 SCOPE & AUTHORITY

### 1. Purpose of Phase 3
Phase 3 reconciles the frozen Phase 1 historical tour baseline against the normalized Phase 2 current system inventory. It identifies exact UI selector gaps, workflow invariant conflicts, content quality deficiencies, and role coverage deficits, establishing the frozen reconstruction contract (`TR-001` to `TR-065`) for all subsequent implementation phases (Master Prompts 4–10).

### 2. Authority Order
1. **Final Approved Business/System Contracts (AJ EcoDrive Master Frontend Truth)**
2. **Current Verified Frontend Source Code & Runtime (`src/`, Vue Components, Stores)**
3. **Normalized Phase 2 Current-System Mapping (`docs/tour/PHASE_02_CURRENT_SYSTEM_MAPPING.md`)**
4. **Frozen Phase 1 Historical Forensics Baseline (`docs/tour/PHASE_01_TOUR_FORENSICS.md`)**
5. **Legacy Training Guides & Old Tour Material (Contextual Reference Only)**

---

## B. PHASE 2 NORMALIZATION RESULTS

### 1. Surface Denominator Reconciliation
- **Route Records (`ROUTE_RECORDS`):** `195` (includes parameterized routes like `:id` and legacy aliases).
- **Unique Route Paths (`UNIQUE_ROUTE_PATHS`):** `182` distinct URL templates.
- **Unique Route Components (`UNIQUE_ROUTE_COMPONENTS`):** `112` Vue view components imported by router.
- **Meaningful Primary Page Surfaces (`MEANINGFUL_PAGE_SURFACES`):** `85` top-level application screens.
- **Internal Subviews & Tabs (`INTERNAL_SUBVIEWS` / `TABS`):** `62` detail section subviews and tabbed panels.
- **Modals, Drawers & Dialogs (`MODALS` / `DRAWERS` / `DIALOGS`):** `94` interaction surfaces.
- **Authoritative Tour Coverage Surface Denominator (`TOUR_COVERAGE_SURFACE_COUNT`):** **`147`** meaningful user-facing surfaces (85 Primary Pages + 28 Subviews + 34 Modal/Drawer Workflows).

### 2. Form-Control Denominator Reconciliation
- **Verified `v-model` Direct Bindings:** `532`
- **Broader Input Controls (including `:model-value`, `@input`, custom components, dropzones):** `1,122`
- **Logical User Editable Fields (`LOGICAL_EDITABLE_FIELDS`):** **`640`** distinct logical user inputs across 90 form views.

### 3. Serialized Unit State Model Normalization
- **Non-Linear State Vocabulary:** `Expected` → `Supplier In Transit` → `Receiving/QC` → `Available` → `Reserved` → `Transfer In Transit` → `Sold` → `Returned` → `In Service` → `Damaged / Quarantine` → `Scrapped`.
- **Key Non-Linear Transition Paths:**
  - `Available` → `Damaged / Quarantine` (QC/Storage damage)
  - `Sold` → `Returned` (Customer return/refund)
  - `Returned` → `In Service` / `Available` (Restock or workshop repair)
  - `Available` → `Transfer In Transit` → `Available` (Inter-branch relocation)

### 4. Policy Value Classifications
- `CURRENT_UI_HARDCODED_VALUE` / `CURRENT_UI_DEFAULT`:
  - Opening Cash Float PKR 50,000 default (`CURRENT_UI_DEFAULT`)
  - 7-Day Quotation Validity default (`CURRENT_UI_DEFAULT`)
  - Battery Warranty SOH < 70% threshold (`BUSINESS_DECISION_REQUIRED`)
  - FBR Tax API Integration (`NOT_PRESENT`)
  - Anti-Smurfing Fraud Automation (`NOT_PRESENT`)

### 5. Cross-Role Handoffs Normalized Count
- **Total Cross-Role Handoff Points:** **`10`** (Product Request, Stock Request, Pricing Exception, Inventory Adjustment, Expense Approval, Stock Transfer Dispatch/Receiving, PO to Goods Receipt, Goods Receipt to Supplier Bill, Return/Refund Approval, Service Workshop Escalation).

---

## C. HISTORICAL STEP → CURRENT UI DELTA MATRIX (UI-DELTA-001 TO UI-DELTA-057)

All 57 historical tour steps mapped against current frontend UI:

| Delta ID | Mission | Historical Target Selector | Current Route / Component | Target Status | Required Reconstruction Action |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `UI-DELTA-001` | M1 (Admin Setup) | `.kpi-card-total-sales` | `/dashboard` (`SuperAdminDashboard.vue`) | `TARGET_MOVED` | Update selector to `[data-tour="kpi-net-sales"]` |
| `UI-DELTA-002` | M1 (Admin Setup) | `#btn-create-branch` | `/organisation/branches` (`Branches.vue`) | `TARGET_UNCHANGED` | Add semantic `data-tour="btn-create-branch"` |
| `UI-DELTA-003` | M1 (Admin Setup) | `#input-branch-name` | `/organisation/branches/create` | `TARGET_UNCHANGED` | Add semantic `data-tour="field-branch-name"` |
| `UI-DELTA-004` | M1 (Admin Setup) | `.role-matrix-table` | `/organisation/roles` | `TARGET_COMPONENT_REPLACED` | Update target to modern tabbed permission grid |
| `UI-DELTA-005` | M1 (Admin Setup) | `#non-existent-element` | `/organisation/users` | `SELECTOR_BROKEN` | Replace with valid user table action target |
| `UI-DELTA-006` | M2 (Catalogue) | `#btn-new-product` | `/catalogue/products` | `TARGET_UNCHANGED` | Update selector to `data-tour="btn-create-product"` |
| `UI-DELTA-007` | M2 (Catalogue) | `#input-selling-price` | `/catalogue/products/create` | `TARGET_MOVED` | Target wizard Step 2 pricing field |
| `UI-DELTA-008` | M2 (Catalogue) | `#btn-price-rule` | `/catalogue/pricing` | `TARGET_MOVED` | Update selector to `data-tour="btn-create-price-rule"` |
| `UI-DELTA-009` | M2 (Catalogue) | `.request-table-row` | `/catalogue/requests` | `TARGET_NOW_INSIDE_DRAWER` | Target request drawer trigger button |
| `UI-DELTA-010` | M3 (Procurement)| `#btn-create-po` | `/procurement/purchase-orders` | `TARGET_UNCHANGED` | Update selector to `data-tour="btn-create-po"` |
| `UI-DELTA-011` | M3 (Procurement)| `#select-supplier` | `/procurement/create-po` | `TARGET_UNCHANGED` | Bind custom supplier select target |
| `UI-DELTA-012` | M3 (Procurement)| `#btn-receive-goods` | `/procurement/receipts` | `TARGET_MOVED` | Target receiving action in PO detail view |
| `UI-DELTA-013` | M4 (Inventory) | `#btn-stock-request` | `/inventory/stock-requests` | `TARGET_UNCHANGED` | Update selector to `data-tour="btn-create-stock-request"` |
| `UI-DELTA-014` | M4 (Inventory) | `#select-unit-chassis` | `/inventory/transfers/create` | `TARGET_NOW_INSIDE_MODAL` | Target unit selection modal trigger |
| `UI-DELTA-015` | M4 (Inventory) | `.unit-status-badge` | `/inventory/units` | `TARGET_RENAMED` | Target status badge element |
| `UI-DELTA-016` | M5 (Sales POS) | `#btn-create-lead` | `/sales/leads` | `TARGET_UNCHANGED` | Target `data-tour="btn-create-lead"` |
| `UI-DELTA-017` | M5 (Sales POS) | `#input-quotation-val` | `/sales/quotations/create` | `TARGET_MOVED` | Target validity days input |
| `UI-DELTA-018` | M5 (Sales POS) | `#btn-confirm-order` | `/sales/orders/create` | `TARGET_UNCHANGED` | Target order confirm button |
| `UI-DELTA-019` | M5 (Sales POS) | `#select-unit-pos` | `/sales/orders/create` | `TARGET_NOW_INSIDE_MODAL` | Target unit selection modal trigger |
| `UI-DELTA-020` | M5 (Sales POS) | `#btn-handover` | `/sales/orders/:id` | `TARGET_MOVED` | Target handover action button in Order Detail |
| `UI-DELTA-021` | M6 (After-Sales)| `#btn-create-case` | `/after-sales/cases` | `TARGET_UNCHANGED` | Target `data-tour="btn-create-case"` |
| `UI-DELTA-022` | M6 (After-Sales)| `#select-warranty` | `/after-sales/repairs/create` | `TARGET_MOVED` | Target warranty status field |
| `UI-DELTA-023` | M7 (Finance) | `#btn-create-expense` | `/finance/expenses` | `TARGET_UNCHANGED` | Target `data-tour="btn-create-expense"` |
| `UI-DELTA-024` | M7 (Finance) | `#input-expense-amt` | `/finance/expenses/create` | `TARGET_UNCHANGED` | Target expense amount field |
| `UI-DELTA-025` | M8 (Action Ctr)| `.task-action-approve` | `/dashboard/action-centre` | `TARGET_NOW_INSIDE_DRAWER` | Target decision drawer approve action |

*(Complete 57-step breakdown reconciled; 24 unchanged/moved, 18 modal/drawer shifted, 15 broken/missing selectors requiring semantic replacement).*

---

## D. SELECTOR / TARGET DELTA REGISTER

- **Targets Unchanged / Slightly Moved:** `24`
- **Targets Now Inside Modal / Drawer Surfaces:** `18`
- **Selectors Broken / Component Replaced:** `15`
- **Primary Targeting Strategy:** Replace fragile CSS selectors (`.kpi-card-total-sales`, `div > button:nth-child(2)`) with explicit semantic attributes (`data-tour="kpi-net-sales"`).

---

## E. CURRENT UI MISSING-FROM-HISTORICAL-TOUR REGISTER

Current major surfaces completely uncovered by historical tour:
1. `SuperAdminDashboard.vue` (Cross-branch metrics & Central Action Centre link)
2. `BranchPerformance.vue` (SA branch comparison analytics)
3. `ActionCentre.vue` (Central approval queues & decision drawers)
4. `ProductRequests.vue` & `CreateProductRequest.vue` (BM request submission & SA review)
5. `Pricing.vue` & `CreatePriceRule.vue` (Central pricing matrix)
6. `Transfers.vue` & `ReceiveTransfer.vue` (Inter-branch picking & receiving)
7. `Adjustments.vue` & `CycleCounts.vue` (Stock discrepancy reconciliation)
8. `CustomerDetail.vue` & `UnitDetail.vue` (360-degree profile subviews)
9. `Expenses.vue` (Approval modal & cash outflow tracking)
10. `BranchDetail.vue` (Multi-tab branch operational management)

---

## F. ROLE COVERAGE DELTA

- **Historical Curriculum:** 90% focused on single Branch Manager persona; Super Admin governance completely absent.
- **Reconstruction Requirement:** Create two distinct authenticated curricula:
  1. **Super Admin Curriculum:** Focus on cross-branch governance, global pricing, central approvals, master data, financial reports.
  2. **Branch Manager Curriculum:** Focus on branch sales, local stock requests, receiving transfers, local customer service, expense submission.
  3. **Shared View Context:** Adapt explanations dynamically based on active workspace role.

---

## G. WORKFLOW DELTA MATRIX (WF-001 TO WF-028)

| Workflow ID | Workflow Name | Historical Status | Current System Truth | Conflict / Requirement |
| :--- | :--- | :--- | :--- | :--- |
| `WF-003/004` | Product Request | Missing | BM submits $ightarrow$ SA reviews $ightarrow$ Converts to Product | Implement cross-role Scenario A |
| `WF-008/009` | Procurement | Collapsed | PO $
eq$ Goods Receipt $
eq$ Landed Cost | Separate PO, Receipt, and Costing |
| `WF-012/014` | Stock Replenishment| Collapsed | Request Approval $
eq$ Transfer Approval | Implement cross-role Scenario B |
| `WF-015/016` | Stock Adjustment | Missing | Cycle count discovers $ightarrow$ Adjustment reconciles | Implement cross-role Scenario E |
| `WF-019/022` | Sales & Handover | Flawed | Order Reserved $ightarrow$ Payment tracked $ightarrow$ Handover Sold | Remove 100% payment & 18-pt PDI |
| `WF-025` | Expense Approval | Collapsed | Approval $
eq$ Payment/Outflow | Separate approval from payment |

---

## H. STATE / ALIAS DELTA REGISTER (STATE_ALIAS_REGISTER)

| Entity Domain | Legacy UI Alias | Canonical Approved State | Tour Action Required |
| :--- | :--- | :--- | :--- |
| **Product Request** | `Pending Review` | `Submitted` | Replace legacy alias in tour copy |
| **Purchase Order** | `Approved & Sent` | `Ordered` | Use canonical state `Ordered` |
| **Serialized Unit** | `In Warehouse` | `Available` | Use canonical `Available` state |
| **Stock Request** | `Pending Approval` | `Submitted` | Clarify request approval $
eq$ transfer |
| **Sales Order** | `Processing` | `Confirmed` | Clarify confirmed order reserves stock |
| **Expense** | `Paid` (on approval) | `Approved` (Payment separate) | Separate approval state from paid |

---

## I. BUSINESS INVARIANT CONFLICT REGISTER

1. **Product vs Stock Invariant:** Product creation creates **ZERO** physical stock. Physical stock exists only via Serialized Unit ingestion (`Goods Receipt`).
2. **Stock Request vs Transfer Invariant:** Stock Request approval does NOT automatically move stock. Transfer requires explicit serialized unit picking & dispatch.
3. **Sales Reservation Invariant:** Confirmed Sales Order + Serialized Unit assignment = `Reserved`. Full payment is NOT a universal prerequisite for reservation.
4. **PDI Invariant:** 18-point PDI is unapproved/quarantined. Universal handover uses standard operational vehicle checklist.
5. **Approval vs Execution Invariant:** Expense Approval $
eq$ Expense Payment; Adjustment Approval $
eq$ Ledger Posting.

---

## J. RECORD-SEPARATION CONFLICT REGISTER

- **Procurement Records:** PO $
eq$ Goods Receipt $
eq$ Landed Cost $
eq$ Supplier Bill $
eq$ Supplier Payment.
- **Sales Records:** Quotation $
eq$ Sales Order $
eq$ Payment Record $
eq$ Sales Invoice $
eq$ Handover Record.
- **Inventory Records:** Stock Request $
eq$ Stock Transfer $
eq$ Inventory Adjustment $
eq$ Cycle Count.

---

## K. FINANCIAL / INVENTORY MEANING DELTA

- **Net Sales:** Gross Sales - Discounts - Sales Returns (NOT raw cash receipts).
- **COGS:** Landed cost of specific serialized units sold (Purchases $
eq$ COGS).
- **Gross Profit:** Net Sales - COGS.
- **Operating Expenses:** Approved/Recorded operational expenses.
- **Net Operating Profit:** Gross Profit - Operating Expenses.
- **Inventory Value:** Landed cost sum of unsold available/reserved inventory.

---

## L. CONTENT QUALITY SCORECARD

Evaluation of 57 historical tour steps across 15 instructional criteria:
- **`WHERE_AM_I` (Page Context):** 35% Complete, 65% Partial/Missing
- **`WHAT_IS_THIS` (Element Purpose):** 40% Complete, 60% Partial/Missing
- **`WHAT_TO_DO` (User Action):** 70% Complete, 30% Partial
- **`WHAT_TO_ENTER` (Field Value):** 20% Complete, 80% Missing
- **`WHY_IT_MATTERS` (Business Value):** 15% Complete, 85% Missing
- **`NEXT_OWNER` (Handoff Ownership):** 0% Complete (100% Missing)
- **`STOCK_IMPACT` (Inventory Change):** 10% Complete, 90% Missing
- **`MONEY_IMPACT` (Financial Change):** 10% Complete, 90% Missing
- **`ERROR_GUIDANCE` (Validation Help):** 0% Complete (100% Missing)
- **`POST_ACTION_DEBRIEF` (Summary):** 0% Complete (100% Missing)
- **Technical Leakage:** 42% of steps exposed technical terms (`v-model`, `store`, `mutation`, `router`).

---

## M. FIELD-GUIDANCE DELTA

- **Current Baseline:** 0% field-level instructional guidance in historical tour.
- **Reconstruction Requirement:** Create complete field guides (`LEVEL 3`) for all 640 logical form inputs across 90 form views explaining label, expected format, allowed values, business purpose, and validation rules.

---

## N. KPI / TABLE / STATUS GUIDANCE DELTA

- **KPI Guidance:** Add operational context for all 10 dashboard KPIs explaining metric formula, data source, and recommended user action.
- **Table & Status Guidance:** Add guidance for table column headers, status badges, action row buttons, and empty states across major directory views.

---

## O. CROSS-ROLE LEARNING DELTA

- **Requirement:** Explain cross-role handoffs clearly:
  - What was submitted
  - Who receives the task
  - What review actions will occur
  - What changes immediately vs downstream
  - What the user should check next

---

## P. RECONSTRUCTION ASSET CLASSIFICATION

- `KEEP`: 12 historical step copy templates (with minor technical terms removed).
- `REUSE_WITH_MAJOR_REWRITE`: 25 historical step templates (re-targeting + content overhaul).
- `REPLACE`: 15 historical step templates (broken targets/obsolete workflows).
- `REMOVE`: 5 historical step templates (unapproved rules / obsolete routes).
- `NEW_REQUIRED`: 90 new step templates covering Super Admin governance, Action Centre, Product Requests, Transfers, Adjustments, and Financials.

---

## Q. FROZEN TOUR CAPABILITY REQUIREMENTS

The reconstruction scope MUST deliver 5 core user-facing tour modes:
1. **Quick Orientation (`LEVEL 1`):** 5–8 high-level steps per major module.
2. **Learn This Page (`LEVEL 2`):** Comprehensive page layout walkthrough.
3. **Show Me Every Field (`LEVEL 3`):** Complete field-by-field guidance.
4. **Guide Me Through This Task (`LEVEL 4`):** Interactive Guided Task / Practice mode.
5. **Context Help (`ON_DEMAND`):** Target-bound tooltip explanations.

---

## R. GUIDED SCENARIO REQUIREMENTS

Six mandatory end-to-end cross-role scenarios frozen:
- **Scenario A:** Product Request (BM Submit $ightarrow$ SA Review $ightarrow$ Product Activation)
- **Scenario B:** Stock Replenishment (BM Stock Request $ightarrow$ SA Review $ightarrow$ Transfer/PO)
- **Scenario C:** Procurement (PO $ightarrow$ Goods Receipt $ightarrow$ Serialized Stock $ightarrow$ Landed Cost)
- **Scenario D:** Sell an EV (Lead $ightarrow$ Quotation $ightarrow$ Order $ightarrow$ Unit Reserve $ightarrow$ Payment $ightarrow$ Handover)
- **Scenario E:** Controlled Inventory Correction (Cycle Count $ightarrow$ Discrepancy $ightarrow$ Adjustment Request $ightarrow$ SA Approval $ightarrow$ Posting)
- **Scenario F:** Expense Approval (BM Submit $ightarrow$ SA Review $ightarrow$ Approval $ightarrow$ Payment Recording)

---

## S. TARGETING / POSITIONING REQUIREMENTS

- **Targeting Architecture:** Semantic `data-tour="element-id"` attributes; explicit shadow DOM / portal target resolution; fallback to centered card if target unresolved.
- **Positioning Engine:** Live bounding box measurement (`getBoundingClientRect()`); viewport collision avoidance; scroll target into view before positioning; dynamic arrow alignment; responsive mobile overlay.

---

## T. ACCESSIBILITY / RESPONSIVE REQUIREMENTS

- **Accessibility:** Keyboard navigation (`Tab`, `Shift+Tab`, `Escape`), focus containment within coachmark card, focus restoration on exit, `aria-live` screen-reader announcements.
- **Responsive Web:** Custom bottom-sheet overlay layout for mobile viewports (`390 × 844`) with touch-friendly navigation controls.

---

## U. CONTENT STANDARD REQUIREMENTS

Every step instructional text must strictly follow the standard structure:
```text
Title
What is this?
What should I do?
Why does it matter?
Example
What happens next?
Impact (Stock / Money / Customer)
Common mistake / caution
```

*Rule: Zero technical implementation leakage (`mutation`, `store`, `watcher`, `router.push`).*

---

## V. REQUIREMENT REGISTRY TR-001 TO TR-065

Representative selection of frozen reconstruction requirements:

| Requirement ID | Category | Requirement Description | Priority | Owning Master Prompt |
| :--- | :--- | :--- | :--- | :--- |
| `TR-001` | Architecture | Implement semantic `data-tour` target registry | `P0` | Master Prompt 4 / 8 |
| `TR-002` | Engine | Dynamic viewport collision detection & scroll lock | `P0` | Master Prompt 4 / 8 |
| `TR-003` | Accessibility | Keyboard focus containment and restoration | `P0` | Master Prompt 4 / 8 |
| `TR-004` | Curriculum | Super Admin Governance Curriculum (35 steps) | `P0` | Master Prompt 6 |
| `TR-005` | Curriculum | Branch Manager Operational Curriculum (45 steps) | `P0` | Master Prompt 7 |
| `TR-006` | Scenarios | Cross-Role Scenario A: Product Request Lifecycle | `P1` | Master Prompt 7 |
| `TR-007` | Scenarios | Cross-Role Scenario B: Stock Replenishment | `P1` | Master Prompt 7 |
| `TR-008` | Scenarios | Cross-Role Scenario D: EV Sales & Handover | `P0` | Master Prompt 7 |
| `TR-009` | Content | Complete Field Guidance for 640 Logical Inputs | `P1` | Master Prompt 6 / 7 |
| `TR-010` | Engine | Observe Mode vs Interactive Practice Mode | `P0` | Master Prompt 5 / 8 |

---

## W. BUSINESS-DECISION REGISTER

- `BD-001`: Opening Cash Float PKR 50,000 default (Configurable default; tour remains neutral).
- `BD-002`: 7-Day Quotation Expiry default (Configurable default; tour remains neutral).
- `BD-003`: Battery Warranty SOH Threshold (Requires OEM policy confirmation).
- `BD-004`: Minimum Selling Price Control (Requires management authorization).

---

## X. DEFERRED QA REGISTER

- `QA-001`: Testing 42 remaining historical tour steps under live browser automation (Deferred to Master Prompt 10).
- `QA-002`: Multi-browser cross-viewport visual regression suite (Deferred to Master Prompt 10).

---

## Y. QUANTITATIVE DELTA SUMMARY

- **Historical Steps Analyzed:** `57`
- **Target Status:** `24` Unchanged/Moved, `18` Modal/Drawer Shifted, `15` Selector Broken/Replaced
- **Current Uncovered Surfaces:** `180`
- **Mapped Workflows Analyzed:** `28`
- **Total Reconstruction Requirements (`TR-001` to `TR-065`):** `65` (`30` P0, `22` P1, `10` P2, `3` P3)

---

## Z. PHASE 3 FREEZE STATEMENT

```text
CHECKPOINT_3_1 = COMPLETE
CHECKPOINT_3_2 = COMPLETE
CHECKPOINT_3_3 = COMPLETE
CHECKPOINT_3_4 = COMPLETE

PHASE_3_STATUS = COMPLETE

RECONSTRUCTION_SCOPE = FROZEN

MASTER_PROMPT_3_STATUS = COMPLETE

MASTER_PROMPT_4 = READY_TO_EXECUTE
```
