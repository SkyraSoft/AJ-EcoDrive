# AJ ECODRIVE — PRE-REMEDIATION FIX SPECIFICATIONS & ARCHITECTURAL FREEZE
**Document Version:** 3.5.0  
**Status:** FROZEN — PRE-REMEDIATION GATE COMPLIANT  
**Date:** 2026-10-01  
**Scope:** Complete implementation contracts for all reconciled defect groups and instances.

---

## Executive Summary

Phase 3.5 has eliminated false passes from the field lifecycle baseline, reconciled all defect group and instance arithmetic to 100% mathematical precision, established definitive domain contracts for financial fields, entity ownership, state machines, and branch authorization, and quarantined unresolved business features in the Architecture Decision Backlog.

This document and `PRE_REMEDIATION_FIX_SPEC.json` define the strict, frozen specifications for each remediation wave. Under the Phase 3.5 zero-trust directive, **only fixes classified as DETERMINISTIC or ARCHITECTURAL are admitted into code implementation waves**. Backlog and backend-dependent items are strictly deferred.

---

## Master Fix Specification Registry

### FIX-SEC-001: Centralized Branch Scoping & Authorization for Store Getters, Mutations, and Router Navigation

- **Remediation Wave:** `WAVE 1`
- **Fix Authority:** `ARCHITECTURAL`
- **Covered Defect Groups:** `DG-SEC-001`
- **Covered Defect Instances (21):** `DI-001`, `DI-002`, `DI-003`, `DI-004`, `DI-005` ... and 16 more
- **Approved Requirement Source:** AJ EcoDrive Security & Branch Isolation Policy; branch_authorization_contract.json
- **Current Behavior:**
  > Branch isolation is enforced solely at the view list level. Direct getter calls (e.g. getCustomerById, getSaleById) and store mutations do not verify branch ownership. A Branch Manager can view or modify records belonging to other branches by navigating to direct URLs or invoking store actions.
- **Expected Behavior:**
  > Implement centralized access control in store.js (canAccessRecord, assertRecordAccess, getScopedRecordById). Super Admin has global access; Branch Managers and staff are strictly restricted to records matching currentUser.branchId. Unauthorized access attempts trigger an audit event and return null or reject the mutation.
- **Files Likely Affected:**
  - `src/store.js`
  - `src/router/index.js`
  - `src/views/CustomerDetail.vue`
  - `src/views/SaleDetail.vue`
  - `src/views/InventoryDetail.vue`
- **Schema Changes:** None to persistent storage; adds branchId enforcement to all 21 branch-scoped entity getters and mutations.
- **Backward Compatibility:** Super Admin retains unrestricted global access across all branches. System-wide entities (Users, Roles, Global Settings) remain accessible as defined by role permissions.
- **Identified Risks:** Potential UI regressions if views fail to handle null return values gracefully when a user attempts to access an unauthorized record.
- **Tests Before Execution:** `tests/unit/branch_isolation_baseline.spec.js`
- **Tests After Execution:** `tests/unit/branch_authorization_centralized.spec.js`
- **Rollback Consideration:** Revert store.js getter/mutation wrappers to original unscoped array find operations.

---

### FIX-RECORD-001: Eliminate Fallback to First Record (array[0]) and Fabricated Record Display on Invalid Route ID

- **Remediation Wave:** `WAVE 1`
- **Fix Authority:** `DETERMINISTIC`
- **Covered Defect Groups:** `DG-RECORD-001`, `DG-RECORD-002`, `DG-RECORD-003`
- **Covered Defect Instances (12):** `DI-241`, `DI-242`, `DI-243`, `DI-244`, `DI-245` ... and 7 more
- **Approved Requirement Source:** Zero-Trust Forensic Data Privacy Contract; DG-RECORD Root-Cause Remediation Spec
- **Current Behavior:**
  > When an invalid, non-existent, or cross-branch ID is passed in the route params, detail views (PaymentDetail, DeliveryDetail, SupplierDetail, BranchDetail, UserDetail) silently fall back to records[0] or render hardcoded demo fixtures, leaking real personal/financial data or displaying false information.
- **Expected Behavior:**
  > Detail views must verify that the record exists and is authorized. If the record is not found or access is denied, render an explicit "Record Not Found / Access Denied" 404 state with a return button. Zero fallback to records[0] or synthetic demo records.
- **Files Likely Affected:**
  - `src/views/PaymentDetail.vue`
  - `src/views/DeliveryDetail.vue`
  - `src/views/SupplierDetail.vue`
  - `src/views/BranchDetail.vue`
  - `src/views/UserDetail.vue`
  - `src/components/common/NotFoundState.vue`
- **Schema Changes:** None.
- **Backward Compatibility:** Valid IDs continue to resolve and display correct domain data. Invalid URLs stop exposing unrelated customer/financial records.
- **Identified Risks:** Existing tests expecting automatic default data rendering on empty routes will fail and must be updated to expect the 404 state.
- **Tests Before Execution:** `tests/unit/detail_view_fallback_baseline.spec.js`
- **Tests After Execution:** `tests/unit/detail_view_not_found_integrity.spec.js`
- **Rollback Consideration:** Restore original route parameter fallback defaults in the target detail components.

---

### FIX-DATA-001: Fix Silent Form Field Discarding on Submit and Broken Edit Round-Trip Lifecycle

- **Remediation Wave:** `WAVE 2`
- **Fix Authority:** `DETERMINISTIC`
- **Covered Defect Groups:** `DG-DATA-001`, `DG-DATA-003`
- **Covered Defect Instances (42):** `DI-022`, `DI-023`, `DI-024`, `DI-025`, `DI-026` ... and 37 more
- **Approved Requirement Source:** field_lifecycle.json causal audit; fieldOwnershipDecisions.json
- **Current Behavior:**
  > Form fields captured in UI inputs (e.g. ReceiveTransfer receiverLocation, CreateSupplier taxNumber/notes, CreateCustomer secondaryPhone/cnic, CreateSale paymentNotes) are dropped before payload dispatch or ignored during store mutation. Edit forms fail to preload existing properties.
- **Expected Behavior:**
  > Ensure complete causal transmission: Input Model -> Form Payload -> Store Mutation -> Entity State -> Edit Preload -> Update -> Redisplay. Every persistent entity field must be stored and preserved.
- **Files Likely Affected:**
  - `src/views/ReceiveTransfer.vue`
  - `src/views/CreateSupplier.vue`
  - `src/views/EditSupplier.vue`
  - `src/views/CreateCustomer.vue`
  - `src/views/EditCustomer.vue`
  - `src/views/CreateSale.vue`
  - `src/store.js`
- **Schema Changes:** Align entity state schemas in store.js to store all captured business fields (taxNumber, secondaryPhone, cnic, paymentNotes, receiverLocation, etc.).
- **Backward Compatibility:** Existing stored records without these fields will default to empty strings/nulls gracefully without crashing.
- **Identified Risks:** Minor validation adjustments if previously ignored fields now enforce data formats.
- **Tests Before Execution:** `tests/unit/field_lifecycle_baseline.spec.js`
- **Tests After Execution:** `tests/unit/field_lifecycle_causal_integrity.spec.js`
- **Rollback Consideration:** Revert store mutation payload mappings to previous subsets.

---

### FIX-DATA-002: Decouple Procurement and Inbound Receiving from Hardwired 3-Model Product Line

- **Remediation Wave:** `WAVE 4`
- **Fix Authority:** `ARCHITECTURAL`
- **Covered Defect Groups:** `DG-DATA-002`
- **Covered Defect Instances (3):** `DI-027`, `DI-028`, `DI-029`
- **Approved Requirement Source:** AJ EcoDrive Dynamic Product Catalogue Contract; DG-DATA-002 Forensic Finding
- **Current Behavior:**
  > Procurement creation forms and PO line items are hardwired to only 3 static vehicle models (EcoStandard, EcoDeluxe, EcoCargo), making it impossible to procure newly configured catalog models, parts, or accessories.
- **Expected Behavior:**
  > Procurement forms dynamically source available products from store.catalog / store.products with category and supplier filtering. Line items support any active product.
- **Files Likely Affected:**
  - `src/views/CreatePurchaseOrder.vue`
  - `src/views/ReceivePurchaseOrder.vue`
  - `src/store.js`
- **Schema Changes:** Ensure PO line items reference productId, productCode, and title dynamically from catalog state.
- **Backward Compatibility:** Existing PO records with standard model names remain valid and render seamlessly.
- **Identified Risks:** If catalog has zero items loaded, PO form must display a friendly empty-catalogue warning.
- **Tests Before Execution:** `tests/unit/procurement_products_baseline.spec.js`
- **Tests After Execution:** `tests/unit/procurement_dynamic_catalog.spec.js`
- **Rollback Consideration:** Restore static product options dropdown in CreatePurchaseOrder.vue.

---

### FIX-WORKFLOW-001: Establish Live Action Centre Producers, Resolvers, and Downstream Domain Mutations

- **Remediation Wave:** `WAVE 3`
- **Fix Authority:** `ARCHITECTURAL`
- **Covered Defect Groups:** `DG-WORKFLOW-001`, `DG-WORKFLOW-002`
- **Covered Defect Instances (9):** `DI-067`, `DI-068`, `DI-069`, `DI-070`, `DI-071` ... and 4 more
- **Approved Requirement Source:** action_centre_business_contract.json; AJ EcoDrive Cross-Role Operational Governance Policy
- **Current Behavior:**
  > Action Centre items are seeded with static mock fixtures. Live operational events (sale discount >8%, expense approval >15k, credit limit override, warranty claim, transfer approval) do not create queue items. Resolving items in Action Centre does not mutate source domain records.
- **Expected Behavior:**
  > Implement live event emission in source workflows using action_centre_business_contract.json. When Action Centre approve/reject is triggered, execute transactional mutations on the source entity (Sale, Expense, Customer, Warranty, Transfer) and log audit events.
- **Files Likely Affected:**
  - `src/store.js`
  - `src/views/ActionCenter.vue`
  - `src/views/CreateSale.vue`
  - `src/views/CreateExpense.vue`
  - `src/views/InventoryTransfers.vue`
- **Schema Changes:** Add sourceEntity, sourceEntityId, requestPayload, and auditLog tracking to Action Centre queue items.
- **Backward Compatibility:** Mock initial seed records replaced with realistic initial items or empty state if clean queue.
- **Identified Risks:** Asynchronous approval flow requires sales/expenses to remain in Pending state until resolved.
- **Tests Before Execution:** `tests/unit/action_centre_baseline.spec.js`
- **Tests After Execution:** `tests/unit/action_centre_end_to_end_chains.spec.js`
- **Rollback Consideration:** Decouple Action Centre resolution handler from source store mutations.

---

### FIX-OPERATIONAL-001: Replace Hardcoded Dashboard Metrics and Counters with Real Dynamic Store Aggregations

- **Remediation Wave:** `WAVE 5`
- **Fix Authority:** `DETERMINISTIC`
- **Covered Defect Groups:** `DG-OPERATIONAL-001`
- **Covered Defect Instances (40):** `DI-076`, `DI-077`, `DI-078`, `DI-079`, `DI-080` ... and 35 more
- **Approved Requirement Source:** AJ EcoDrive Executive KPI Reporting Contract; DG-OPERATIONAL-001 Forensic Finding
- **Current Behavior:**
  > Executive, Branch Manager, and Service dashboards render static hardcoded numbers (e.g. fixed 42 deliveries, 1,240,000 PKR revenue, 98% efficiency) regardless of actual store data.
- **Expected Behavior:**
  > Derive all dashboard KPI cards, summary charts, and counters dynamically from scoped store entities (sales, deliveries, inventory, expenses, service jobs) using reactive computed getters.
- **Files Likely Affected:**
  - `src/views/Dashboard.vue`
  - `src/views/ServiceDashboard.vue`
  - `src/views/InventoryDashboard.vue`
  - `src/store.js`
- **Schema Changes:** Add reusable getter aggregations to store.js (e.g. getBranchRevenue, getActiveDeliveriesCount).
- **Backward Compatibility:** Zero visual regression; metrics reflect actual operational state rather than unmoving constants.
- **Identified Risks:** If store has empty datasets, KPIs will display 0 or empty state instead of impressive mock metrics.
- **Tests Before Execution:** `tests/unit/dashboard_metrics_baseline.spec.js`
- **Tests After Execution:** `tests/unit/dashboard_metrics_dynamic_integrity.spec.js`
- **Rollback Consideration:** Restore static metric constants in dashboard view templates.

---

### FIX-OPERATIONAL-002: Purge 125 Dangerous Prefills and 62 Demo Data Fixtures from Production Creation Forms

- **Remediation Wave:** `WAVE 5`
- **Fix Authority:** `DETERMINISTIC`
- **Covered Defect Groups:** `DG-OPERATIONAL-002`
- **Covered Defect Instances (125):** `DI-116`, `DI-117`, `DI-118`, `DI-119`, `DI-120` ... and 120 more
- **Approved Requirement Source:** form_defaults.json audit; AJ EcoDrive Data Governance Directive
- **Current Behavior:**
  > Creation forms (CreateSale, CreateCustomer, CreateSupplier, CreateExpense, CreateJobCard, etc.) initialize with pre-filled names, CNICs, phone numbers, fixed future dates, and preset financial amounts. Users submitting without editing inadvertently create duplicate garbage records.
- **Expected Behavior:**
  > All operational creation forms must initialize with empty input fields or valid business defaults (e.g. today's date, logged-in user's branch, default unit 1). Placeholders provide guidance without submitting fake data.
- **Files Likely Affected:**
  - `src/views/CreateSale.vue`
  - `src/views/CreateCustomer.vue`
  - `src/views/CreateSupplier.vue`
  - `src/views/CreateExpense.vue`
  - `src/views/CreateRepairJob.vue`
  - `src/views/CreatePurchaseOrder.vue`
- **Schema Changes:** None.
- **Backward Compatibility:** All form submission handlers and field validators function identically; users enter genuine data.
- **Identified Risks:** Forms with required field validation will now require manual user entry before submit is enabled.
- **Tests Before Execution:** `tests/unit/form_prefill_baseline.spec.js`
- **Tests After Execution:** `tests/unit/form_clean_initialization_integrity.spec.js`
- **Rollback Consideration:** Re-insert default mock strings into reactive ref initializers.

---

### FIX-STATE-001: Implement Valid State Transitions and Eliminate Unreachable State Badges

- **Remediation Wave:** `WAVE 4`
- **Fix Authority:** `DETERMINISTIC`
- **Covered Defect Groups:** `DG-STATE-001`
- **Covered Defect Instances (17):** `DI-253`, `DI-254`, `DI-255`, `DI-256`, `DI-257` ... and 12 more
- **Approved Requirement Source:** state_remediation_decisions.json (21 verified state decisions)
- **Current Behavior:**
  > Various domain entities (Sale, Delivery, Warranty, JobCard) display badge colors for states that cannot be reached through UI actions, or trap records in dead-end states. Meanwhile, filter dropdowns list states not supported by business workflows.
- **Expected Behavior:**
  > Apply decisions from state_remediation_decisions.json: remove invalid UI filter options (e.g. Invoice.Draft, Expense.Draft), preserve intentional terminal states (Delivered, Paid, Rejected, Cancelled), and implement verified business transitions (e.g. PDI.Scheduled -> In_Progress -> Passed).
- **Files Likely Affected:**
  - `src/store.js`
  - `src/views/Deliveries.vue`
  - `src/views/Invoices.vue`
  - `src/views/Expenses.vue`
  - `src/views/PDIInspection.vue`
  - `src/views/JobCardDetail.vue`
- **Schema Changes:** Ensure state machine enum in store.js contains only valid business states and allowed transitions.
- **Backward Compatibility:** Existing records in terminal states remain undisturbed. Unreachable fake badges removed from UI.
- **Identified Risks:** State transition guards must prevent illegal out-of-order jumps.
- **Tests Before Execution:** `tests/unit/state_machine_baseline.spec.js`
- **Tests After Execution:** `tests/unit/state_machine_transitions_integrity.spec.js`
- **Rollback Consideration:** Revert state validation logic in store mutation handlers.

---

### FIX-FINANCE-001: Standardize Monetary Fields to Canonical Whole-Integer PKR and Centralize Formatters

- **Remediation Wave:** `WAVE 4`
- **Fix Authority:** `ARCHITECTURAL`
- **Covered Defect Groups:** `DG-FINANCE-001`
- **Covered Defect Instances (30):** `DI-270`, `DI-271`, `DI-272`, `DI-273`, `DI-274` ... and 25 more
- **Approved Requirement Source:** financial_value_contract.json; AJ EcoDrive Financial Data Integrity Standard
- **Current Behavior:**
  > Monetary amounts are stored inconsistently across the codebase as raw numbers, strings with currency symbols (e.g. "PKR 1,500,000"), or floating-point numbers subject to rounding anomalies.
- **Expected Behavior:**
  > Store all domain money fields as non-negative whole-integer PKR (0 decimal places, Math.round). Use standard input parsing (parseCurrency) and presentation formatting (formatCurrency) helpers.
- **Files Likely Affected:**
  - `src/store.js`
  - `src/utils/formatters.js`
  - `src/views/CreateSale.vue`
  - `src/views/CreateExpense.vue`
  - `src/views/Sales.vue`
  - `src/views/Invoices.vue`
- **Schema Changes:** Normalize store initial data and mutation payloads to store clean integer values for all 30 audited financial fields.
- **Backward Compatibility:** Formatters ensure visual representation in UI continues to display "Rs. X,XXX,XXX" or "PKR X,XXX,XXX" consistently.
- **Identified Risks:** Existing code doing direct string concatenation with currency values must be refactored to use formatters.
- **Tests Before Execution:** `tests/unit/financial_fields_baseline.spec.js`
- **Tests After Execution:** `tests/unit/financial_fields_canonical_integrity.spec.js`
- **Rollback Consideration:** Revert store payload sanitizers in financial mutations.

---

### FIX-INTERACTION-001: Remediate Confirmed Wrong-Pattern Modals to Dedicated Responsive Workflow Views

- **Remediation Wave:** `WAVE 6`
- **Fix Authority:** `DETERMINISTIC`
- **Covered Defect Groups:** `DG-INTERACTION-001`
- **Covered Defect Instances (4):** `DI-300`, `DI-301`, `DI-302`, `DI-303`
- **Approved Requirement Source:** architecture_decision_backlog.json (ADB-001..ADB-004); UX Pattern Contract
- **Current Behavior:**
  > Four complex operational workflows (CreateSale, CreateCase, CreateRepairJob, CreateBranch) are constrained within cramped modal overlays, causing scroll traps, poor mobile ergonomics, and data loss upon accidental backdrop dismissal.
- **Expected Behavior:**
  > Provide dedicated full-page routes for complex multi-step workflows while retaining lightweight modals strictly for quick confirmations and simple atomic actions. Ensure form state persistence or exit confirmation.
- **Files Likely Affected:**
  - `src/router/index.js`
  - `src/views/Sales.vue`
  - `src/views/Cases.vue`
  - `src/views/RepairJobs.vue`
  - `src/views/Branches.vue`
- **Schema Changes:** None.
- **Backward Compatibility:** Existing modal triggers can redirect to full-page route or open responsive view container seamlessly.
- **Identified Risks:** Navigation flow change from in-place modal to full page requires proper back-button breadcrumb support.
- **Tests Before Execution:** `tests/unit/modal_interaction_baseline.spec.js`
- **Tests After Execution:** `tests/unit/workflow_navigation_integrity.spec.js`
- **Rollback Consideration:** Revert router entries and re-enable modal dialog wrappers.

---

### FIX-DOC-001: Align PDI Inspection Scope in Documentation with Source Truth Pending Business Decision

- **Remediation Wave:** `BACKLOG / QUARANTINED`
- **Fix Authority:** `BUSINESS_DECISION_REQUIRED`
- **Covered Defect Groups:** `DG-DOC-001`
- **Covered Defect Instances (1):** `INST-DOC-001`
- **Approved Requirement Source:** architecture_decision_backlog.json (ADB-006); Directive Instruction 24 & 26
- **Current Behavior:**
  > Documentation claims an 18-point comprehensive PDI inspection process, whereas source code implements a 5-point verification checklist.
- **Expected Behavior:**
  > Update documentation to accurately reflect the 5-point verification checklist currently implemented in source code. Do NOT implement 18-point checklist until formal business approval is granted.
- **Files Likely Affected:**
  - `AJ_ECODRIVE_MASTER_FRONTEND_TRUTH_AND_ARCHITECTURE.md`
  - `AJ_ECODRIVE_COMPLETE_CLIENT_GUIDE_QA.md`
- **Schema Changes:** None.
- **Backward Compatibility:** Source code remains untouched; documentation aligns with reality.
- **Identified Risks:** None.
- **Tests Before Execution:** None (Documentation)
- **Tests After Execution:** None (Documentation)
- **Rollback Consideration:** Revert documentation edits.

---

### FIX-DOC-002: Synchronize Cryptographic Ledger Claims in Documentation with In-Memory Structured Audit Log

- **Remediation Wave:** `BACKLOG / QUARANTINED`
- **Fix Authority:** `BACKEND_DEPENDENT`
- **Covered Defect Groups:** `DG-DOC-002`
- **Covered Defect Instances (1):** `INST-DOC-002`
- **Approved Requirement Source:** architecture_decision_backlog.json (ADB-007); Directive Instruction 25 & 27
- **Current Behavior:**
  > Documentation references a future cryptographic tamper-evident blockchain/hash-chained audit ledger, whereas frontend source implements in-memory structured audit logs.
- **Expected Behavior:**
  > Update documentation to document structured audit event logging as CURRENT truth and classify cryptographic ledger as FUTURE_BACKEND_DEPENDENT. Zero cryptographic code added to frontend.
- **Files Likely Affected:**
  - `AJ_ECODRIVE_MASTER_FRONTEND_TRUTH_AND_ARCHITECTURE.md`
  - `PLATFORM_SUPPORT_POLICY.md`
- **Schema Changes:** None.
- **Backward Compatibility:** Source code remains untouched; documentation claims accurate.
- **Identified Risks:** None.
- **Tests Before Execution:** None (Documentation)
- **Tests After Execution:** None (Documentation)
- **Rollback Consideration:** Revert documentation edits.

---

## Reconciled Implementation Waves

| Wave | Domain Focus | Fix IDs | Fix Authority |
|---|---|---|---|
| **WAVE 1** | Security, Branch Authorization & Detail Fallbacks | `FIX-SEC-001`, `FIX-RECORD-001` | ARCHITECTURAL / DETERMINISTIC |
| **WAVE 2** | Form Data Loss & Edit Round-Trip Lifecycles | `FIX-DATA-001` | DETERMINISTIC |
| **WAVE 3** | Action Centre Live Queue Producers & Resolvers | `FIX-WORKFLOW-001` | ARCHITECTURAL |
| **WAVE 4** | Dynamic Catalogue, State Machines & Integer PKR | `FIX-DATA-002`, `FIX-STATE-001`, `FIX-FINANCE-001` | DETERMINISTIC / ARCHITECTURAL |
| **WAVE 5** | Operational KPIs & Creation Form Prefill Purge | `FIX-OPERATIONAL-001`, `FIX-OPERATIONAL-002` | DETERMINISTIC |
| **WAVE 6** | Modal-to-Page Responsive Interaction Workflows | `FIX-INTERACTION-001` | DETERMINISTIC |
| **BACKLOG** | PDI Scope & Cryptographic Audit Claims | `FIX-DOC-001`, `FIX-DOC-002` | BUSINESS_DECISION_REQUIRED / BACKEND_DEPENDENT |

---
*Generated by AJ EcoDrive Phase 3.5 Automation Suite. All counts validated by tests/test_forensic_registry_integrity.cjs.*
