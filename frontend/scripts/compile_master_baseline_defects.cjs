const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const defects = [
  // 1. HIGH: FIELD_CAPTURED_NOT_PERSISTED
  {
    defectId: 'DEF-001',
    module: 'PROCUREMENT',
    severity: 'HIGH',
    category: 'DATA_LOSS',
    route: '/procurement/purchase-orders/create',
    component: 'src/views/procurement/CreatePurchaseOrder.vue',
    currentBehavior: 'Form captures estimatedFreight, paymentTerms, documents, and notes via v-model, but drops all 4 fields when building the store.addPurchaseOrder() payload.',
    expectedBehavior: 'All 4 collected procurement fields must be included in the submission payload and persisted to store.purchaseOrders.',
    evidenceIds: ['CTRL-352', 'CTRL-355', 'CTRL-356', 'CTRL-357', 'LIFECYCLE-PO-ESTIMATED-FREIGHT'],
    impact: 'Silent commercial data loss on every purchase order created; logistics terms and proforma attachments vanish.',
    remediationCandidate: 'Include estimatedFreight, paymentTerms, documents, notes in newPo payload and store.purchaseOrders schema.',
    status: 'OPEN'
  },

  // 2. HIGH: HARDCODED_CATALOGUE_DEPENDENCY
  {
    defectId: 'DEF-002',
    module: 'PROCUREMENT',
    severity: 'HIGH',
    category: 'ARCHITECTURAL_COUPLING',
    route: '/procurement/purchase-orders/create',
    component: 'src/views/procurement/CreatePurchaseOrder.vue',
    currentBehavior: 'Form template and submit handler hardcode qtyDs11, qtyEv5, qtyCargo with static product IDs PROD-003, PROD-004, PROD-006 and hardcoded unit costs.',
    expectedBehavior: 'PO creation must dynamically bind to store.products and allow arbitrary catalogue items and quantities to be added.',
    evidenceIds: ['CTRL-348', 'CTRL-349', 'CTRL-350', 'PO-ITEMS-LINE-35-74'],
    impact: 'Any new product created in /catalogue/products/create cannot be procured; disabled/deleted models remain hardcoded.',
    remediationCandidate: 'Refactor PO item selection to dynamic line-item builder pulling SKUs and costs from catalogue store.',
    status: 'OPEN'
  },

  // 3. HIGH: ACTION_CENTRE_PRODUCER_DISCONNECTED
  {
    defectId: 'DEF-003',
    module: 'DASHBOARD',
    severity: 'HIGH',
    category: 'BROKEN_WORKFLOW',
    route: '/dashboard/action-centre',
    component: 'src/views/dashboard/ActionCentre.vue',
    currentBehavior: 'Operational expense submissions (> 15k) and discount overrides (> 8%) do not call store.createActionItem(); queue is 100% populated with static demo fixtures.',
    expectedBehavior: 'Live business workflows requiring Super Admin / Head Office authorization must dispatch actionable work items to store.actionQueue.',
    evidenceIds: ['EXP-SUBMIT-LINE-167', 'SALE-DISCOUNT-LINE-475', 'STORE-ACTION-QUEUE-LINE-502'],
    impact: 'Action Centre functions as an isolated simulation showcase rather than the central operational governance hub.',
    remediationCandidate: 'Connect store.addExpense() and CreateSale discount validation to store.createActionItem().',
    status: 'OPEN'
  },

  // 4. HIGH: ACTION_CENTRE_PARTIAL_SOURCE_MUTATION
  {
    defectId: 'DEF-004',
    module: 'DASHBOARD',
    severity: 'HIGH',
    category: 'INTEGRITY_DRIFT',
    route: '/dashboard/action-centre',
    component: 'src/store.js',
    currentBehavior: 'store.resolveActionItem() only mutates orders for commercial_pricing; stock_reallocation, operational_expense, warranty_escalation, and inventory_governance leave linked records un-updated.',
    expectedBehavior: 'Resolving an action queue item must update the linked source record (expenses, transfers, cases, quarantine) to its resolved state.',
    evidenceIds: ['STORE-RESOLVE-ACTION-LINE-822-829'],
    impact: 'Resolving an expense or stock transfer in Action Centre does not approve the expense or dispatch the transfer in domain modules.',
    remediationCandidate: 'Implement polymorphic status mutation across expenses, transfers, cases, and quarantine upon Action Centre resolution.',
    status: 'OPEN'
  },

  // 5. HIGH: CROSS_BRANCH_DIRECT_ID_EXPOSURE
  {
    defectId: 'DEF-005',
    module: 'ORGANISATION',
    severity: 'CRITICAL',
    category: 'AUTHORIZATION_BYPASS',
    route: '/sales/orders/:id',
    component: 'src/store.js',
    currentBehavior: 'Direct entity getters (getOrderById, getCustomerById, getExpenseById, getUnitById) perform global lookups without branch validation; router guard checks only role.',
    expectedBehavior: 'Direct route navigation and store lookups by Branch Managers must verify that the requested record belongs to their active branch or return an authorization error.',
    evidenceIds: ['STORE-GET-ORDER-LINE-3274', 'ROUTER-GUARD-LINE-1205'],
    impact: 'Branch Manager at Peshawar can view and mutate orders, customer records, and petty cash expenses belonging to Lahore or Islamabad.',
    remediationCandidate: 'Enforce branch authorization check in router navigation guard and store entity lookup methods.',
    status: 'OPEN'
  },

  // 6. HIGH: DATA_LEAK_ON_UNKNOWN_ID
  {
    defectId: 'DEF-006',
    module: 'SALES',
    severity: 'HIGH',
    category: 'DATA_INTEGRITY',
    route: '/sales/orders/:id',
    component: 'src/views/sales/OrderDetail.vue',
    currentBehavior: 'OrderDetail falls back to hardcoded strings (Ahsan Khan, PKR 280,000) when given an invalid, nonexistent, or missing order ID.',
    expectedBehavior: 'Detail view must display a clean 404 / Not Found state when an invalid or nonexistent ID is queried.',
    evidenceIds: ['ORDER-DETAIL-LINE-29-35'],
    impact: 'Users querying nonexistent order IDs are shown fabricated customer and financial data, confusing operators and masking broken links.',
    remediationCandidate: 'Replace hardcoded demo fallback in OrderDetail.vue with a dedicated RecordNotFound component state.',
    status: 'OPEN'
  },

  // 7. HIGH: PURCHASE_ORDER_DETAIL_DEMO_LEAK
  {
    defectId: 'DEF-007',
    module: 'PROCUREMENT',
    severity: 'HIGH',
    category: 'DATA_INTEGRITY',
    route: '/procurement/purchase-orders/:id',
    component: 'src/views/procurement/PurchaseOrderDetail.vue',
    currentBehavior: 'PurchaseOrderDetail falls back to hardcoded supplier and item data when an invalid or nonexistent PO ID is supplied.',
    expectedBehavior: 'PurchaseOrderDetail must render an explicit Not Found state on invalid ID.',
    evidenceIds: ['PO-DETAIL-INVALID-ID-FALLBACK'],
    impact: 'Fabricated PO data rendered for nonexistent procurement records.',
    remediationCandidate: 'Add record not found check before rendering PO detail cards.',
    status: 'OPEN'
  },

  // 8. MEDIUM: DETAIL_SILENT_FIRST_RECORD_FALLBACK
  {
    defectId: 'DEF-008',
    module: 'SALES',
    severity: 'MEDIUM',
    category: 'DATA_INTEGRITY',
    route: '/sales/payments/:id',
    component: 'src/views/sales/PaymentDetail.vue',
    currentBehavior: 'PaymentDetail, DeliveryHandoverDetail, SupplierDetail, BranchDetail, and UserDetail fall back to array[0] on invalid ID.',
    expectedBehavior: 'Detail routes must display Not Found state when the specific queried record is absent.',
    evidenceIds: ['INVALID-ID-AUDIT-ARRAY-0'],
    impact: 'Users navigate to invalid ID and are silently shown an arbitrary unrelated record without warning.',
    remediationCandidate: 'Enforce strict 404 handling across all detail views.',
    status: 'OPEN'
  },

  // 9. HIGH: HARDCODED_OPERATIONAL_KPIS
  {
    defectId: 'DEF-009',
    module: 'DASHBOARD',
    severity: 'HIGH',
    category: 'MISLEADING_OPERATIONAL_DATA',
    route: '/dashboard',
    component: 'src/views/dashboard/SuperAdminDashboard.vue',
    currentBehavior: '40 dashboard KPIs (Net Sales PKR 28.4M, Units Sold 184, Purchases PKR 14.6M, Operating Expenses PKR 3.2M, etc.) are hardcoded static JavaScript arrays.',
    expectedBehavior: 'Executive and showroom dashboard KPIs must be dynamically aggregated from store domain arrays.',
    evidenceIds: ['SUPER-ADMIN-KPIS-LINE-121-130', 'KPIS-JSON-40-DEFECTS'],
    impact: 'Management views fabricated metrics that do not reflect actual sales, inventory counts, or branch expenses.',
    remediationCandidate: 'Bind dashboard KPIs to store.orders, store.serializedUnits, store.expenses, store.purchaseOrders.',
    status: 'OPEN'
  },

  // 10. HIGH: DANGEROUS_FORM_DEMO_PREFILLS
  {
    defectId: 'DEF-010',
    module: 'SALES',
    severity: 'HIGH',
    category: 'DATA_INTEGRITY',
    route: '/sales/orders/create',
    component: 'src/views/sales/CreateSale.vue',
    currentBehavior: '175 form inputs across CreateSale, CreateExpense, CreateCustomer, CreateLead are prefilled with non-empty demo text.',
    expectedBehavior: 'Create forms must initialize with empty/safe defaults so operators do not accidentally commit demo records.',
    evidenceIds: ['PREFILL-AUDIT-175-DANGEROUS'],
    impact: 'Submitting a form without full manual editing silently creates records with fake customer names, CNICs, and phone numbers.',
    remediationCandidate: 'Sanitize create form reactive models to empty strings / null business defaults.',
    status: 'OPEN'
  },

  // 11. MEDIUM: MISSING_PDI_CHECKLIST_ITEMS
  {
    defectId: 'DEF-011',
    module: 'SALES',
    severity: 'MEDIUM',
    category: 'SPECIFICATION_GAP',
    route: '/sales/delivery/create',
    component: 'src/views/sales/CreateDeliveryHandover.vue',
    currentBehavior: 'Source code implements 5 verification checkboxes; project documentation and training guides cite an 18-point PDI checklist.',
    expectedBehavior: 'Distinguish current 5-point verification from future 18-point PDI; quarantine stale documentation claiming 18-point PDI is implemented.',
    evidenceIds: ['DELIVERY-HANDOVER-CHECKBOXES-1-5'],
    impact: 'Documentation and marketing materials misrepresent quality inspection capabilities to dealerships.',
    remediationCandidate: 'Align documentation with 5-point verification or officially specify the 18-point inspection checklist in Phase 3.',
    status: 'OPEN'
  },

  // 12. MEDIUM: CRYPTOGRAPHIC_FEATURE_UNIMPLEMENTED
  {
    defectId: 'DEF-012',
    module: 'SYSTEM',
    severity: 'MEDIUM',
    category: 'SPECIFICATION_GAP',
    route: '/system/audit-log',
    component: 'src/store.js',
    currentBehavior: 'Audit system is an in-memory transactional application event log (store.addAuditLog), lacking SHA-256 cryptographic hash-chaining or tamper-evidence.',
    expectedBehavior: 'Document current system as structured application audit logging; classify cryptographic hash-chaining as expected future backend capability.',
    evidenceIds: ['STORE-ADD-AUDIT-LOG-LINE-831'],
    impact: 'Dealership audit trails are subject to in-memory reset and lack tamper-evident proof.',
    remediationCandidate: 'Quarantine cryptographic claims in master docs; define technology-neutral AppendAuditEvent contract.',
    status: 'OPEN'
  },

  // 13. MEDIUM: ARCHIVE_BRANCH_MISSING_CONFIRMATION
  {
    defectId: 'DEF-013',
    module: 'ORGANISATION',
    severity: 'MEDIUM',
    category: 'INTERACTION_DEFECT',
    route: '/organisation/branches',
    component: 'src/views/organisation/Branches.vue',
    currentBehavior: 'Archive Branch action mutates branch status immediately without a high-friction confirmation dialog.',
    expectedBehavior: 'Destructive organization actions must require explicit modal confirmation.',
    evidenceIds: ['SEM-ACT-434', 'BRANCHES-ARCHIVE-CLICK'],
    impact: 'Risk of accidental dealership branch deactivation.',
    remediationCandidate: 'Wrap archive action in confirmation modal.',
    status: 'OPEN'
  },

  // 14. MEDIUM: UNREACHABLE_AND_DEAD_END_STATES
  {
    defectId: 'DEF-014',
    module: 'SYSTEM',
    severity: 'MEDIUM',
    category: 'STATE_MACHINE_DEFECT',
    route: 'Global',
    component: 'src/store.js',
    currentBehavior: '21 state defects identified across 9 entities, including unreachable states (e.g. SalesOrder Draft/Cancelled) and dead-end states (e.g. SalesOrder Processing, Unit Quarantine).',
    expectedBehavior: 'All business entity lifecycles must define explicit incoming handlers and valid progression paths.',
    evidenceIds: ['STATE-DEFECTS-JSON-21-ITEMS'],
    impact: 'Entities can become trapped in intermediate states with no UI action available to progress or resolve them.',
    remediationCandidate: 'Implement missing state transition handlers in store and views.',
    status: 'OPEN'
  },

  // 15. MEDIUM: FORMATTED_CURRENCY_STRING_STORAGE
  {
    defectId: 'DEF-015',
    module: 'FINANCE',
    severity: 'MEDIUM',
    category: 'DATA_TYPES',
    route: 'Global',
    component: 'src/store.js',
    currentBehavior: '30 entity properties in store.js store formatted currency strings (e.g. "PKR 2,650,000") instead of numeric integers/floats.',
    expectedBehavior: 'Financial amounts must be stored as canonical numeric integers/cents; formatted strings should only be rendered via formatCurrency() at UI boundary.',
    evidenceIds: ['FINANCIAL-STORAGE-AUDIT-30-ITEMS'],
    impact: 'Financial aggregation requires regex parsing (replace(/[^0-9]/g, \'\')); risk of NaN errors or currency mismatch.',
    remediationCandidate: 'Migrate financial entity properties to numeric fields.',
    status: 'OPEN'
  }
];

// Write defects.json
fs.writeFileSync(
  path.join(rootDir, 'scratch/forensic/baseline/defects.json'),
  JSON.stringify(defects, null, 2),
  'utf8'
);

// Breakdown
const severityCounts = { BLOCKER: 0, CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0, INFO: 0, UNRESOLVED: 0 };
const moduleCounts = {};
const categoryCounts = {};

for (const d of defects) {
  severityCounts[d.severity] = (severityCounts[d.severity] || 0) + 1;
  moduleCounts[d.module] = (moduleCounts[d.module] || 0) + 1;
  categoryCounts[d.category] = (categoryCounts[d.category] || 0) + 1;
}

console.log('=== BASELINE MASTER DEFECT REGISTRY COMPILED ===');
console.log(`TOTAL DEFECTS CATALOGED: ${defects.length}`);
console.log('Severity Breakdown:', severityCounts);
console.log('Module Breakdown:', moduleCounts);
console.log('Category Breakdown:', categoryCounts);
