const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const remediationWaves = [
  {
    waveId: 'WAVE-1',
    name: 'Security, Branch Authorization & Record Identity',
    priority: 'CRITICAL',
    defectGroupIds: ['DG-SEC-001', 'DG-RECORD-001', 'DG-RECORD-002', 'DG-RECORD-003'],
    affectedFiles: [
      'src/router/index.js',
      'src/store.js',
      'src/views/sales/OrderDetail.vue',
      'src/views/sales/CustomerDetail.vue',
      'src/views/sales/PaymentDetail.vue',
      'src/views/sales/DeliveryHandoverDetail.vue',
      'src/views/procurement/PurchaseOrderDetail.vue',
      'src/views/procurement/SupplierDetail.vue',
      'src/views/catalogue/ProductDetail.vue',
      'src/views/inventory/CycleCountDetail.vue',
      'src/views/inventory/QuarantineDetail.vue',
      'src/views/finance/ExpenseDetail.vue',
      'src/views/organisation/BranchDetail.vue',
      'src/views/organisation/UserDetail.vue'
    ],
    dependencies: [],
    fixAuthority: 'ARCHITECTURE_FIX',
    remediationActions: [
      'Implement activeBranch validation in router.beforeEach guard for non-Super-Admin roles.',
      'Inject activeBranch parameter into store entity getters (getOrderById, getCustomerById, getExpenseById, getUnitById) to prevent cross-branch leaks.',
      'Enforce branch match assertion in all store record mutation and deletion methods.',
      'Replace hardcoded demo fallbacks and array[0] fallbacks with standard RecordNotFound 404 UI state across all detail views.'
    ],
    testPlan: {
      preFixVerification: 'Direct route navigation to cross-branch ID (e.g. Peshawar BM accessing Lahore ORD-902) currently succeeds.',
      negativeTests: [
        'BM-A directly navigates to /sales/orders/ORD-902 (Branch B) -> Redirected with 403/NotFound error.',
        'BM-A attempts store.updateOrder(ORD-902, ...) -> Throws branch authorization exception.',
        'BM-A queries store.getOrderById(ORD-902) -> Returns null.',
        'Super Admin navigates to /sales/orders/ORD-902 -> Succeeded (Global Access).'
      ],
      regressionTests: 'Same-branch BM list and detail navigation verified intact.'
    }
  },
  {
    waveId: 'WAVE-2',
    name: 'Form Data Preservation, Edit Round-Trip & Financial Storage',
    priority: 'HIGH',
    defectGroupIds: ['DG-DATA-001', 'DG-DATA-003', 'DG-FINANCE-001'],
    affectedFiles: [
      'src/views/procurement/CreatePurchaseOrder.vue',
      'src/views/organisation/EditBranch.vue',
      'src/views/organisation/EditUser.vue',
      'src/views/catalogue/EditProduct.vue',
      'src/views/procurement/EditSupplier.vue',
      'src/views/catalogue/EditPriceRule.vue',
      'src/store.js'
    ],
    dependencies: ['WAVE-1'],
    fixAuthority: 'DETERMINISTIC_FIX',
    remediationActions: [
      'Include estimatedFreight, paymentTerms, documents, and notes in CreatePurchaseOrder.vue payload and store.purchaseOrders schema.',
      'Hydrate all 37 missing fields in loadData() across EditBranch, EditUser, EditProduct, EditSupplier, EditPriceRule.',
      'Normalize store financial entity fields from formatted PKR strings to raw integer amounts in store.js, keeping formatCurrency at UI boundary.'
    ],
    testPlan: {
      sentinelFieldTests: [
        'Submit PO with unique sentinel values (freight="PKR 888,888", terms="Net 45 Custom", notes="SENTINEL_NOTE_XYZ") -> Verify exact preservation in store.purchaseOrders.',
        'Load record in EditProduct, modify name, save -> Verify specs and battery attributes are not wiped out.'
      ],
      currencyMathTests: 'Verify sum of store.expenses and store.orders uses numeric addition without regex parse failures.'
    }
  },
  {
    waveId: 'WAVE-3',
    name: 'Action Centre Producer Connectivity & Polymorphic Resolvers',
    priority: 'HIGH',
    defectGroupIds: ['DG-WORKFLOW-001', 'DG-WORKFLOW-002'],
    affectedFiles: [
      'src/views/finance/CreateExpense.vue',
      'src/views/sales/CreateSale.vue',
      'src/views/inventory/CreateTransfer.vue',
      'src/views/inventory/CreateQuarantineRecord.vue',
      'src/views/after-sales/CreateCase.vue',
      'src/store.js'
    ],
    dependencies: ['WAVE-1', 'WAVE-2'],
    fixAuthority: 'ARCHITECTURE_FIX',
    remediationActions: [
      'Wire store.addExpense() when amount > 15,000 to automatically call store.createActionItem().',
      'Wire CreateSale discount > 8% validation to dispatch commercial_pricing action queue item and hold sale in Pending Approval state.',
      'Wire CreateTransfer inter-branch requests to dispatch stock_reallocation action item.',
      'Extend store.resolveActionItem() to polymorphically update source records for expenses, transfers, cases, and quarantine.'
    ],
    testPlan: {
      independentFlowTests: [
        'BM submits expense PKR 48,500 -> Verify new item in store.actionQueue with EXP id -> SA resolves Approved -> Verify store.expenses status transitions to Approved.',
        'BM creates sale with 12% discount -> Verify sale held in Pending Approval -> SA approves in Action Centre -> Verify order transitions to Ready.'
      ]
    }
  },
  {
    waveId: 'WAVE-4',
    name: 'Catalogue-Driven Procurement & State Machine Completion',
    priority: 'HIGH',
    defectGroupIds: ['DG-DATA-002', 'DG-STATE-001'],
    affectedFiles: [
      'src/views/procurement/CreatePurchaseOrder.vue',
      'src/store.js',
      'src/views/inventory/SerializedUnits.vue',
      'src/views/sales/Orders.vue',
      'src/views/finance/Expenses.vue',
      'src/views/inventory/Transfers.vue',
      'src/views/after-sales/WarrantyService.vue',
      'src/views/after-sales/Repairs.vue'
    ],
    dependencies: ['WAVE-2', 'WAVE-3'],
    fixAuthority: 'ARCHITECTURE_FIX',
    remediationActions: [
      'Refactor CreatePurchaseOrder item selection from hardcoded 3-model inputs to a dynamic line-item repeater pulling active products from store.products.',
      'Implement missing state transition handlers in store and views for the 21 identified unreachable/dead-end states (e.g. Unit Quarantine Release, Order Cancellation, Expense Payment).'
    ],
    testPlan: {
      catalogueDynamicTests: [
        'Create new custom EV model in Catalogue -> Open Create PO -> Verify new model is selectable with dynamic unit cost -> Submit PO -> Verify received in Warehouse.'
      ],
      stateMachineLifecycleTests: 'Step each of the 9 formal state machines through their full end-to-end lifecycle from initial to terminal state.'
    }
  },
  {
    waveId: 'WAVE-5',
    name: 'Operational Data Truth & Form Initialization Hygiene',
    priority: 'HIGH',
    defectGroupIds: ['DG-OPERATIONAL-001', 'DG-OPERATIONAL-002'],
    affectedFiles: [
      'src/views/dashboard/SuperAdminDashboard.vue',
      'src/views/dashboard/BranchPerformance.vue',
      'src/views/dashboard/BusinessPerformance.vue',
      'src/views/sales/SalesDashboard.vue',
      'src/views/after-sales/AfterSalesDashboard.vue',
      'src/views/sales/CreateSale.vue',
      'src/views/sales/CreateCustomer.vue',
      'src/views/sales/CreateLead.vue',
      'src/views/finance/CreateExpense.vue'
    ],
    dependencies: ['WAVE-2', 'WAVE-4'],
    fixAuthority: 'DETERMINISTIC_FIX',
    remediationActions: [
      'Bind all 40 dashboard KPIs to live computed aggregators over store.orders, store.serializedUnits, store.expenses, store.purchaseOrders.',
      'Sanitize create form reactive models across CreateSale, CreateCustomer, CreateLead, CreateExpense to empty strings / null business defaults.'
    ],
    testPlan: {
      kpiReconciliationTests: [
        'Record 2 new sales of PKR 250,000 in store -> Verify SuperAdminDashboard Net Sales increments by exactly PKR 500,000.',
        'Open CreateCustomer -> Verify name, phone, CNIC are blank.'
      ]
    }
  },
  {
    waveId: 'WAVE-6',
    name: 'Interaction Architecture & High-Friction Workflows',
    priority: 'MEDIUM',
    defectGroupIds: [],
    affectedFiles: [
      'src/views/procurement/CreatePurchaseOrder.vue',
      'src/views/catalogue/CreateProduct.vue',
      'src/views/catalogue/EditProduct.vue',
      'src/views/organisation/CreateRole.vue'
    ],
    dependencies: ['WAVE-4', 'WAVE-5'],
    fixAuthority: 'ARCHITECTURE_FIX',
    remediationActions: [
      'Convert confirmed wrong modal patterns (CreatePurchaseOrder, CreateProduct, EditProduct, CreateRole) to dedicated full-page views or full-height scrollable drawers.',
      'Preserve current acceptable modal patterns for quick operational overlays.'
    ],
    testPlan: {
      uxErgonomicsTests: 'Verify multi-section scrolling, file attachment upload dropzones, and role permission matrices render without modal clipping.'
    }
  },
  {
    waveId: 'WAVE-7',
    name: 'Documentation Alignment & Future Backend Technology Contracts',
    priority: 'LOW',
    defectGroupIds: ['DG-DOC-001', 'DG-DOC-002'],
    affectedFiles: [
      'AJ_ECODRIVE_MASTER_FRONTEND_TRUTH_AND_ARCHITECTURE.md',
      'PLATFORM_SUPPORT_POLICY.md'
    ],
    dependencies: ['WAVE-1', 'WAVE-2', 'WAVE-3', 'WAVE-4', 'WAVE-5', 'WAVE-6'],
    fixAuthority: 'DOCUMENTATION_ONLY',
    remediationActions: [
      'Update master architecture documentation from verified post-remediation evidence.',
      'Clearly specify technology-neutral future backend requirements (AppendAuditEvent, InboundWebhook, TelemetryIngress) while removing false claims of current cryptographic or 18-point PDI implementation.'
    ],
    testPlan: {
      manifestSyncTest: 'Run forensic extraction suite and verify 100% agreement between source code, test suite, and generated master documentation.'
    }
  }
];

fs.writeFileSync(
  path.join(rootDir, 'scratch/forensic/baseline/remediation_dependency_graph.json'),
  JSON.stringify({
    totalWaves: remediationWaves.length,
    waves: remediationWaves
  }, null, 2),
  'utf8'
);

console.log('=== REMEDIATION DEPENDENCY GRAPH & WAVES GENERATED ===');
console.log('Total Remediation Waves:', remediationWaves.length);
remediationWaves.forEach(w => console.log(`  - [${w.waveId}] ${w.name} (${w.priority}, ${w.defectGroupIds.length} Defect Groups)`));
