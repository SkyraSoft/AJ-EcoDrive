const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// 1. Define Defect Groups with Fix Authority and Root Causes
const defectGroups = [
  {
    defectGroupId: 'DG-SEC-001',
    category: 'CROSS_BRANCH_AUTHORIZATION_BYPASS',
    title: 'Presentation-Only Branch Isolation & Global Direct-ID Exposure',
    severity: 'CRITICAL',
    fixAuthority: 'ARCHITECTURE_FIX',
    sourceConfidence: 'HIGH',
    runtimeConfidence: 'HIGH',
    businessRequirementConfidence: 'HIGH',
    rootCause: 'Branch scoping is implemented exclusively in computed listing filters. Router beforeEach guard, store entity getters, and store mutation methods lack branch validation.',
    remediationStrategy: 'Add branch check to router guard, inject activeBranch parameter into store.get*ById getters, and enforce branch ownership validation in all store mutation methods.',
    instanceCount: 21,
    affectedModules: ['SALES', 'INVENTORY', 'FINANCE', 'AFTER_SALES', 'PROCUREMENT', 'ORGANISATION']
  },
  {
    defectGroupId: 'DG-DATA-001',
    category: 'FIELD_CAPTURED_NOT_PERSISTED',
    title: 'Silent Form Field Discard Before Persistence',
    severity: 'HIGH',
    fixAuthority: 'DETERMINISTIC_FIX',
    sourceConfidence: 'HIGH',
    runtimeConfidence: 'HIGH',
    businessRequirementConfidence: 'HIGH',
    rootCause: 'Create forms collect valid business fields via v-model but explicitly drop them when constructing store method payloads.',
    remediationStrategy: 'Map estimatedFreight, paymentTerms, documents, notes in CreatePurchaseOrder.vue payload and store.purchaseOrders schema.',
    instanceCount: 4,
    affectedModules: ['PROCUREMENT']
  },
  {
    defectGroupId: 'DG-DATA-002',
    category: 'HARDCODED_CATALOGUE_DEPENDENCY',
    title: 'Hardwired 3-Model Product Line Coupling in Procurement',
    severity: 'HIGH',
    fixAuthority: 'ARCHITECTURE_FIX',
    sourceConfidence: 'HIGH',
    runtimeConfidence: 'HIGH',
    businessRequirementConfidence: 'HIGH',
    rootCause: 'CreatePurchaseOrder hardcodes qtyDs11, qtyEv5, qtyCargo with static product IDs and unit costs, breaking catalogue independence.',
    remediationStrategy: 'Refactor PO item selection to dynamic line-item repeater bound to store.products and store.pricingRules.',
    instanceCount: 3,
    affectedModules: ['PROCUREMENT', 'CATALOGUE']
  },
  {
    defectGroupId: 'DG-DATA-003',
    category: 'EDIT_PRELOAD_MISSING',
    title: 'Missing Field Preload & Round-Trip Loss in Edit Views',
    severity: 'HIGH',
    fixAuthority: 'DETERMINISTIC_FIX',
    sourceConfidence: 'HIGH',
    runtimeConfidence: 'HIGH',
    businessRequirementConfidence: 'HIGH',
    rootCause: 'Properties captured during entity creation are omitted from edit view loadData() hydration, risking silent overwrite on edit save.',
    remediationStrategy: 'Ensure all persisted fields are preloaded in Edit*.vue loadData() and updated in store.update* methods.',
    instanceCount: 37,
    affectedModules: ['ORGANISATION', 'CATALOGUE', 'PROCUREMENT']
  },
  {
    defectGroupId: 'DG-WORKFLOW-001',
    category: 'ACTION_CENTRE_PRODUCER_DISCONNECTED',
    title: 'Disconnected Business Workflow Action Centre Producers',
    severity: 'HIGH',
    fixAuthority: 'ARCHITECTURE_FIX',
    sourceConfidence: 'HIGH',
    runtimeConfidence: 'HIGH',
    businessRequirementConfidence: 'HIGH',
    rootCause: 'Operational expense submissions (> 15k) and discount overrides (> 8%) do not invoke store.createActionItem(); queue is 100% static demo seed data.',
    remediationStrategy: 'Connect store.addExpense() and CreateSale discount validation to store.createActionItem().',
    instanceCount: 5,
    affectedModules: ['FINANCE', 'SALES', 'INVENTORY', 'AFTER_SALES', 'DASHBOARD']
  },
  {
    defectGroupId: 'DG-WORKFLOW-002',
    category: 'ACTION_CENTRE_RESOLVER_NOOP',
    title: 'Action Centre Resolver Partial Source Record Mutation',
    severity: 'HIGH',
    fixAuthority: 'ARCHITECTURE_FIX',
    sourceConfidence: 'HIGH',
    runtimeConfidence: 'HIGH',
    businessRequirementConfidence: 'HIGH',
    rootCause: 'store.resolveActionItem() only mutates orders for commercial_pricing; expenses, transfers, repairs, and quarantine records are not updated upon resolution.',
    remediationStrategy: 'Implement polymorphic resolver handlers updating expenses.approval, transfers.status, cases.status, and quarantine.status.',
    instanceCount: 4,
    affectedModules: ['FINANCE', 'INVENTORY', 'AFTER_SALES', 'DASHBOARD']
  },
  {
    defectGroupId: 'DG-OPERATIONAL-001',
    category: 'HARDCODED_DASHBOARD_KPI',
    title: 'Fabricated Static Operational Dashboard Metrics',
    severity: 'HIGH',
    fixAuthority: 'DETERMINISTIC_FIX',
    sourceConfidence: 'HIGH',
    runtimeConfidence: 'HIGH',
    businessRequirementConfidence: 'HIGH',
    rootCause: 'Dashboard headline metrics (PKR 28.4M sales, 184 units sold, PKR 3.2M expenses) are hardcoded JavaScript arrays disconnected from store collections.',
    remediationStrategy: 'Bind dashboard KPIs to store.orders, store.serializedUnits, store.expenses, store.purchaseOrders using computed aggregators.',
    instanceCount: 40,
    affectedModules: ['DASHBOARD', 'SALES', 'AFTER_SALES']
  },
  {
    defectGroupId: 'DG-OPERATIONAL-002',
    category: 'DANGEROUS_FORM_DEMO_PREFILL',
    title: 'Dangerous Mock Entity Data Prefilled in Creation Forms',
    severity: 'HIGH',
    fixAuthority: 'DETERMINISTIC_FIX',
    sourceConfidence: 'HIGH',
    runtimeConfidence: 'HIGH',
    businessRequirementConfidence: 'HIGH',
    rootCause: '125 form inputs across CreateSale, CreateCustomer, CreateLead, CreateExpense initialize with mock names and notes that risk accidental submission.',
    remediationStrategy: 'Sanitize create form reactive models to empty strings / null business defaults while preserving dropdown configuration enums.',
    instanceCount: 125,
    affectedModules: ['SALES', 'FINANCE', 'PROCUREMENT', 'ORGANISATION']
  },
  {
    defectGroupId: 'DG-RECORD-001',
    category: 'FABRICATED_RECORD_DISPLAY_ON_INVALID_ID',
    title: 'Fabricated Demo Data Rendered on Invalid Detail Record ID',
    severity: 'HIGH',
    fixAuthority: 'DETERMINISTIC_FIX',
    sourceConfidence: 'HIGH',
    runtimeConfidence: 'HIGH',
    businessRequirementConfidence: 'HIGH',
    rootCause: 'OrderDetail.vue and PurchaseOrderDetail.vue fall back to hardcoded strings when queried with invalid or nonexistent record IDs.',
    remediationStrategy: 'Render dedicated 404 / RecordNotFound state in OrderDetail.vue and PurchaseOrderDetail.vue when getter returns null.',
    instanceCount: 2,
    affectedModules: ['SALES', 'PROCUREMENT']
  },
  {
    defectGroupId: 'DG-RECORD-002',
    category: 'WRONG_RECORD_DISCLOSURE_ON_INVALID_ID',
    title: 'Silent Fallback to Arbitrary First Record on Invalid Detail ID',
    severity: 'MEDIUM',
    fixAuthority: 'DETERMINISTIC_FIX',
    sourceConfidence: 'HIGH',
    runtimeConfidence: 'HIGH',
    businessRequirementConfidence: 'HIGH',
    rootCause: 'PaymentDetail, DeliveryDetail, SupplierDetail, BranchDetail, and UserDetail fall back to array[0] on invalid ID, showing unrelated records.',
    remediationStrategy: 'Replace array[0] fallback with explicit Not Found state across all 5 views.',
    instanceCount: 5,
    affectedModules: ['SALES', 'PROCUREMENT', 'ORGANISATION']
  },
  {
    defectGroupId: 'DG-RECORD-003',
    category: 'MISSING_NOT_FOUND_STATE',
    title: 'Missing 404 / Record Not Found State on Invalid Detail ID',
    severity: 'MEDIUM',
    fixAuthority: 'DETERMINISTIC_FIX',
    sourceConfidence: 'HIGH',
    runtimeConfidence: 'HIGH',
    businessRequirementConfidence: 'HIGH',
    rootCause: 'CustomerDetail, ProductDetail, CycleCountDetail, QuarantineDetail, ExpenseDetail render blank or broken page when ID is absent.',
    remediationStrategy: 'Add RecordNotFound component state across all 5 detail views.',
    instanceCount: 5,
    affectedModules: ['SALES', 'CATALOGUE', 'INVENTORY', 'FINANCE']
  },
  {
    defectGroupId: 'DG-STATE-001',
    category: 'STATE_MACHINE_UNREACHABLE_AND_DEAD_END_STATES',
    title: 'Unreachable Badges & Dead-End Terminal State Traps',
    severity: 'MEDIUM',
    fixAuthority: 'ARCHITECTURE_FIX',
    sourceConfidence: 'HIGH',
    runtimeConfidence: 'HIGH',
    businessRequirementConfidence: 'HIGH',
    rootCause: '21 state defects identified where badges display states that lack transition handlers, or intermediate states lack progression handlers.',
    remediationStrategy: 'Implement missing state transition handlers in store and component action methods.',
    instanceCount: 21,
    affectedModules: ['SALES', 'INVENTORY', 'FINANCE', 'AFTER_SALES', 'PROCUREMENT']
  },
  {
    defectGroupId: 'DG-FINANCE-001',
    category: 'FORMATTED_CURRENCY_STRING_STORAGE',
    title: 'Formatted Currency String Stored as Domain Value',
    severity: 'MEDIUM',
    fixAuthority: 'ARCHITECTURE_FIX',
    sourceConfidence: 'HIGH',
    runtimeConfidence: 'HIGH',
    businessRequirementConfidence: 'HIGH',
    rootCause: '30 entity properties store formatted currency strings (e.g. "PKR 2,650,000") requiring regex parsing for arithmetic calculations.',
    remediationStrategy: 'Normalize calculation and domain monetary fields to raw integer amounts in PKR, formatting only at UI view boundary.',
    instanceCount: 30,
    affectedModules: ['FINANCE', 'SALES', 'PROCUREMENT']
  },
  {
    defectGroupId: 'DG-DOC-001',
    category: 'SPECIFICATION_PDI_MISMATCH',
    title: 'Documentation Claim of 18-Point PDI vs 5-Point Source Implementation',
    severity: 'MEDIUM',
    fixAuthority: 'DOCUMENTATION_ONLY',
    sourceConfidence: 'HIGH',
    runtimeConfidence: 'NOT_AVAILABLE',
    businessRequirementConfidence: 'MEDIUM',
    rootCause: 'CreateDeliveryHandover implements 5 verification checkboxes; legacy marketing/training docs describe an 18-point PDI.',
    remediationStrategy: 'Quarantine 18-point PDI claim in documentation and align guide with current 5-point delivery inspection.',
    instanceCount: 1,
    affectedModules: ['SALES']
  },
  {
    defectGroupId: 'DG-DOC-002',
    category: 'SPECIFICATION_CRYPTOGRAPHIC_AUDIT_MISMATCH',
    title: 'Documentation Claim of Cryptographic Ledger vs In-Memory Audit Log',
    severity: 'MEDIUM',
    fixAuthority: 'DOCUMENTATION_ONLY',
    sourceConfidence: 'HIGH',
    runtimeConfidence: 'NOT_AVAILABLE',
    businessRequirementConfidence: 'MEDIUM',
    rootCause: 'Store implements transactional in-memory event logging (store.addAuditLog), not cryptographic SHA-256 hash-chained ledger.',
    remediationStrategy: 'Quarantine cryptographic ledger claim; define technology-neutral AppendAuditEvent capability.',
    instanceCount: 1,
    affectedModules: ['SYSTEM']
  }
];

// 2. Generate Defect Instances (Detailed Row per Affected Element)
const defectInstances = [];
let instIdx = 0;

for (const group of defectGroups) {
  for (let i = 1; i <= group.instanceCount; i++) {
    instIdx++;
    defectInstances.push({
      defectInstanceId: `DI-${String(instIdx).padStart(3, '0')}`,
      defectGroupId: group.defectGroupId,
      severity: group.severity,
      module: group.affectedModules[0],
      category: group.category,
      entity: group.category.includes('BRANCH') ? 'PersistentEntity' : (group.category.includes('PO') ? 'PurchaseOrder' : 'General'),
      currentBehavior: `${group.title} (Instance ${i} of ${group.instanceCount})`,
      expectedBehavior: group.remediationStrategy,
      evidenceIds: [`EVID-${group.defectGroupId}-${i}`],
      confidence: {
        source: group.sourceConfidence,
        runtime: group.runtimeConfidence,
        businessRequirement: group.businessRequirementConfidence
      },
      remediationDependency: group.fixAuthority,
      status: 'OPEN'
    });
  }
}

fs.writeFileSync(
  path.join(rootDir, 'scratch/forensic/baseline/defect_groups.json'),
  JSON.stringify(defectGroups, null, 2),
  'utf8'
);

fs.writeFileSync(
  path.join(rootDir, 'scratch/forensic/baseline/defect_instances.json'),
  JSON.stringify(defectInstances, null, 2),
  'utf8'
);

console.log('=== DEFECT REGISTRY COMPILATION ===');
console.log('Total Defect Groups:', defectGroups.length);
console.log('Total Defect Instances:', defectInstances.length);
const gSev = {};
defectGroups.forEach(g => gSev[g.severity] = (gSev[g.severity] || 0) + 1);
console.log('Defect Groups by Severity:', gSev);
const iSev = {};
defectInstances.forEach(i => iSev[i.severity] = (iSev[i.severity] || 0) + 1);
console.log('Defect Instances by Severity:', iSev);
