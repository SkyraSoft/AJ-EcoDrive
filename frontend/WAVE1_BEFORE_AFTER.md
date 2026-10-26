# AJ ECODRIVE — WAVE 1 BEFORE / AFTER FORENSIC EVIDENCE

## SECURITY, BRANCH AUTHORIZATION, RECORD IDENTITY & INVALID-ID INTEGRITY

**Baseline Reference Commit:** `480b57f`  
**Evaluation Scope:** Wave 1 source code, central store architecture, branch authorization primitives, and 29 detail views across all business modules.  
**Execution Timestamp:** 2026-10-01  
**Verification Method:** `STORE_RUNTIME_VERIFIED` / `COMPONENT_JSDOM_VERIFIED` / `SOURCE_VERIFIED`

---

### EXECUTIVE SUMMARY

In the pre-fix baseline (`480b57f`), branch authorization existed exclusively as visual table filtering in list views (`v-if` and `.filter(...)`). Direct record lookup via store getters (`store.getCustomerById`, `store.getOrderById`, `store.getExpenseById`, etc.) operated as global unscoped lookups. Consequently, a Branch Manager could load, view, and mutate foreign-branch records simply by supplying a foreign record identifier into route parameters, query strings, or direct store mutation actions. Furthermore, detail views across the frontend exhibited dangerous fallback behaviors: falling back to `array[0]`, falling back to hardcoded mock records (e.g., Ahsan Khan, PKR 280,000, CH8-BRG-26-01882), or displaying silent blanks without not-found handling.

Under Wave 1 implementation:
1. **Centralized Access Control Primitives (`src/utils/branchAuth.js`):** Established comprehensive branch code/name mapping, role normalization, entity branch property mappings for all 21 branch entities, and fail-closed evaluation functions (`canReadRecord`, `canMutateRecord`, `assertRecordMutationAccess`).
2. **Store Security Architecture (`src/store.js`):** Integrated `branchAuth.js` into store getters and mutations. All 21 branch-scoped getters now fail closed (`return null`) when accessed by unauthorized branch users. All 24 mutation entry points enforce `this.assertRecordMutationAccess` and reject cross-branch operations with `UNAUTHORIZED_CROSS_BRANCH_MUTATION`, guaranteeing 100% byte-for-byte immutability. Creation actions enforce trusted session branch derivation.
3. **Record Identity & Detail Resolution:** Eliminated all `array[0]` / `records[0]` fallbacks and fabricated mock displays across all 29 detail views. Integrated a shared, secure `NotFoundState.vue` component that exposes zero stale data, zero foreign identifiers, zero mutation controls, and safe navigation back.

---

### 1. BEFORE VS AFTER COMPARISON TABLE

| Control Domain | Baseline Before-State (`480b57f`) | Wave 1 Remediated After-State | Root Defect Remediation |
| :--- | :--- | :--- | :--- |
| **Cross-Branch Direct Read** | Branch Manager could direct-read foreign records via `store.get*ById(foreignId)` without check. | Getter checks `canReadRecord(user, entity, record)`. Returns `null` (Fail-Closed). | **DG-SEC-001** (Instance SEC-01) |
| **Cross-Branch Direct Mutation** | Branch Manager could call `store.updateExpense`, `store.updateOrder`, etc. on foreign records without error. | Mutation calls `assertRecordMutationAccess`. Throws `UNAUTHORIZED_CROSS_BRANCH_MUTATION`; record remains byte-for-byte unchanged. | **DG-SEC-001** (Instance SEC-02) |
| **Branch Manager Create Forgery** | Create forms accepted arbitrary `branch` / `branchId` payloads. | `addExpense`, `addOrder`, `addCustomer` overwrite payload with authenticated session branch (`currentUser.branchName`). | **DG-SEC-001** (Instance SEC-03) |
| **Inter-Branch Transfer Access** | Unscoped global access; any branch could dispatch or receive transfers. | Source branch can dispatch; Destination branch can receive; 3rd branch blocked from both read and mutate; Super Admin global. | **DG-SEC-001** (Instance SEC-04) |
| **First-Record Fallback (`array[0]`)** | `PaymentDetail`, `InvoiceDetail`, `CustomerDetail`, `SupplierDetail`, `ReceiptDetail`, `PurchaseReturnDetail`, `BranchDetail`, `UserDetail` fell back to `store.*[0]`. | All `array[0]` fallbacks eliminated. Missing/invalid IDs evaluate to `null` and render `NotFoundState.vue`. | **DG-RECORD-001** |
| **Fabricated Record Fallback** | `OrderDetail`, `PurchaseOrderDetail`, `CustomOrderDetail` rendered hardcoded mock data ("Ahsan Khan", "PKR 280,000", "Jawad Khan") when record resolution failed. | Fabricated mock fallbacks removed. Missing/invalid records render truthful `NotFoundState.vue`. | **DG-RECORD-002** |
| **Missing Not-Found State Class** | `CycleCountDetail`, `QuarantineDetail`, `ProductDetail`, `ExpenseDetail`, `ReturnDetail`, etc. lacked controlled not-found handling. | Standardized `NotFoundState.vue` component integrated across all detail views. | **DG-RECORD-003** |
| **Getter Bypass in Detail Views** | `CaseDetail.vue` and `RepairDetail.vue` bypassed branch getters using `|| store.cases.find(...)` and `|| store.repairs.find(...)`. | Removed direct array search bypasses. Components strictly query `getCaseById` and `getRepairById`. | **DG-SEC-001** / **DG-RECORD-001** |

---

### 2. ARCHITECTURAL EVIDENCE

#### A. Centralized Security Primitives (`src/utils/branchAuth.js`)
- Canonical bidirectional branch mapping between codes (`BR-01`, `BR-02`, `BR-03`, `BR-04`) and location names (`Peshawar`, `Islamabad`, `Lahore`, `Rawalpindi`).
- Role normalization mapping (`'SuperAdmin'` $\rightarrow$ `'Super Admin'`, `'BranchManager'` $\rightarrow$ `'Branch Manager'`).
- `ENTITY_BRANCH_PROPERTY_MAP` defining explicit property ownership for all 21 branch entities and classifying global master entities (`products`, `suppliers`, `branches`).
- `canReadRecord(user, entityType, record)`: Global entities readable by all authenticated users; Transfers dual-branch aware; Branch-scoped entities fail-closed unless user branch matches record branch; Super Admin global read.
- `canMutateRecord(user, entityType, record, operation)`: Global master entities modifiable only by Super Admin; Transfers state-aware (`dispatch` by source, `receive` by destination); Branch entities modifiable only by own branch or Super Admin.

#### B. Store Layer Defense-in-Depth (`src/store.js`)
- All 21 branch getters (`getCustomerById`, `getOrderById`, `getExpenseById`, `getPaymentById`, `getInvoiceById`, `getDeliveryById`, `getUnitById`, `getTransferById`, `getStockRequestById`, `getAdjustmentById`, `getQuotationById`, `getLeadById`, `getCustomOrderById`, `getSalesReturnById`, `getPurchaseOrderById`, `getPurchaseReturnById`, `getCaseById`, `getRepairById`, `getWarrantyById`, `getConversationById`, `getReceiptById`) enforce `this.canReadRecord(user, entityType, record)` and return `null` on unauthorized foreign access.
- All 24 mutation methods call `this.assertRecordMutationAccess(entityType, record, operation)`.
- Creation mutations force session branch assignment for branch managers.

#### C. Shared Error State (`src/components/common/NotFoundState.vue`)
- Implements secure fail-closed UI:
  - Clean error message with zero business data leakage.
  - Zero sensitive identifiers (no CNIC, VIN, phone, financial numbers).
  - Zero mutation buttons or actions.
  - Safe navigation back to authorized list route.

---

### 3. VERIFICATION & TEST METRICS

- **Pre-Fix Failure Demonstration:** Confirmed 5 baseline failure modes in `tests/test_wave1_pre_fix_failures.cjs` (logged to `scratch/forensic/final/wave1_pre_fix_failures.json`).
- **Comprehensive Wave 1 Security Suite:** Executed `tests/test_wave1_security_and_identity.cjs`:
  - **Total Assertions:** 476
  - **Passed Assertions:** 476
  - **Failed Assertions:** 0
  - **Coverage:** All 21 branch-scoped entities, 3 global catalogue/master entities, inter-branch transfers, mutation immutability, invalid ID resolution, and 29 detail views.
- **Existing Regression Test Suite:** Executed `npx vitest run`:
  - **Test Files:** 2 passed (2)
  - **Tests:** 25 passed (25)
  - **Regressions:** 0
- **Production Build:** Executed `npm run build`:
  - **Exit Code:** 0
  - **Build Duration:** 3.06s
  - **Bundle Integrity:** Clean production bundle generated in `dist/`.
