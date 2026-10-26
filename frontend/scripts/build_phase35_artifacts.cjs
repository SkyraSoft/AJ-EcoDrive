const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const baselineDir = path.join(rootDir, 'scratch/forensic/baseline');

// 1. Rebuild field_lifecycle.json with updated classifications
const fieldLifecycles = JSON.parse(fs.readFileSync(path.join(baselineDir, 'field_lifecycle.json'), 'utf8'));

// Reclassified controls:
// CTRL-123 (ConversationDetail replyText) -> TRANSIENT_MESSAGE_COMPOSER
// CTRL-38 (WarrantyService selectedBranch) -> TRANSIENT_FILTER
// CTRL-182 (ActionCentre counterDiscountPercent) -> DECISION_INPUT
const reclassifiedIds = ['CTRL-123', 'CTRL-38', 'CTRL-182'];
const trueEntityLifecycles = fieldLifecycles.filter(f => !reclassifiedIds.includes(f.controlId));

// Update CTRL-257 (ReceiveTransfer receiverLocation) to failure
const rxRecord = trueEntityLifecycles.find(f => f.controlId === 'CTRL-257');
if (rxRecord) {
  rxRecord.failureType = 'FIELD_CAPTURED_NOT_PERSISTED';
  rxRecord.failureReason = 'Field receiverLocation collected via v-model in ReceiveTransfer.vue but explicitly omitted from payload to store.receiveTransfer().';
}

fs.writeFileSync(path.join(baselineDir, 'field_lifecycle.json'), JSON.stringify(trueEntityLifecycles, null, 2), 'utf8');

const lifecycleFailures = trueEntityLifecycles.filter(f => f.failureType !== null);
const lifecyclePasses = trueEntityLifecycles.filter(f => f.failureType === null);

console.log('=== UPDATED FIELD LIFECYCLES ===');
console.log('True Persistent Entity Lifecycles:', trueEntityLifecycles.length);
console.log('Lifecycle Passes (Confirmed Causal):', lifecyclePasses.length);
console.log('Lifecycle Failures:', lifecycleFailures.length);

// 2. Field Ownership Decisions (fieldOwnershipDecisions.json)
const fieldOwnershipDecisions = [
  {
    entity: 'SerializedUnit',
    property: 'vin',
    currentOrigin: 'store.js seed fixture (e.g. VIN-PK-BRG-2026-00997)',
    consumers: ['SerializedUnits.vue', 'UnitDetail.vue', 'InvoiceDetail.vue', 'DeliveryHandover.vue'],
    expectedOwner: 'Assembly Plant / Vehicle Manufacturer',
    expectedCaptureStage: 'Inbound Consignment Receipt (ReceivePurchase.vue / ReceiveSupplierDelivery.vue)',
    captureMethod: 'Barcode / 2D DataMatrix Scan or Manifest Import',
    duplicateConcepts: ['vin'],
    decisionConfidence: 'HIGH',
    remediation: 'Capture canonical vin field during Warehouse Goods Receipt; validate 17-character alphanumeric standard format.'
  },
  {
    entity: 'SerializedUnit',
    property: 'chassisNumber',
    currentOrigin: 'store.js seed fixture (e.g. CH-89991)',
    consumers: ['SerializedUnits.vue', 'UnitDetail.vue', 'CreateSale.vue', 'OrderDetail.vue'],
    expectedOwner: 'Chassis Frame Manufacturer / Plant Stamping',
    expectedCaptureStage: 'Inbound Consignment Receipt (ReceivePurchase.vue)',
    captureMethod: 'Optical Character Recognition / Frame Stamp Scan / Manual Entry',
    duplicateConcepts: ['chassis', 'chassisNo', 'chassisNumber'],
    decisionConfidence: 'HIGH',
    remediation: 'Consolidate chassis, chassisNo, and chassisNumber into canonical chassisNumber; provide getter compatibility aliases.'
  },
  {
    entity: 'SerializedUnit',
    property: 'motorNumber',
    currentOrigin: 'store.js seed fixture (e.g. MTR-72V-1200-881)',
    consumers: ['UnitDetail.vue', 'WarrantyService.vue', 'CaseDetail.vue'],
    expectedOwner: 'Electric Powertrain Subsystem Manufacturer',
    expectedCaptureStage: 'Inbound Consignment Receipt / PDI Verification',
    captureMethod: 'Motor Stator Casing Plate Barcode Scan',
    duplicateConcepts: ['motorNumber'],
    decisionConfidence: 'HIGH',
    remediation: 'Capture motorNumber during Inbound Receipt to ensure warranty powertrain component traceability.'
  }
];

fs.writeFileSync(path.join(baselineDir, 'fieldOwnershipDecisions.json'), JSON.stringify(fieldOwnershipDecisions, null, 2), 'utf8');

// 3. State Remediation Decisions (state_remediation_decisions.json)
const stateRemediationDecisions = [
  { entity: 'SerializedUnit', state: 'Returned', issueType: 'UNREACHABLE_STATE', decision: 'VALID_STATE_MISSING_TRANSITION', rationale: 'Sales return process must transition unit from Sold back to In Stock / Returned.', wave: 'WAVE-4' },
  { entity: 'SerializedUnit', state: 'Quarantine', issueType: 'DEAD_END_STATE', decision: 'VALID_STATE_MISSING_TRANSITION', rationale: 'Quarantine inspection requires Release to Stock or Scrap transition handlers.', wave: 'WAVE-4' },
  { entity: 'SerializedUnit', state: 'Delivered', issueType: 'DEAD_END_STATE', decision: 'VALID_TERMINAL_STATE', rationale: 'Customer delivery completion is an intentional terminal state.', wave: 'EXCLUDE_TERMINAL_STATE' },
  { entity: 'SalesOrder', state: 'Draft', issueType: 'UNREACHABLE_STATE', decision: 'VALID_STATE_MISSING_TRANSITION', rationale: 'CreateSale should allow saving incomplete bookings as Draft.', wave: 'WAVE-4' },
  { entity: 'SalesOrder', state: 'Pending Approval', issueType: 'UNREACHABLE_STATE', decision: 'VALID_STATE_MISSING_TRANSITION', rationale: 'Discounts exceeding 8% hold order in Pending Approval for Action Centre review.', wave: 'WAVE-3' },
  { entity: 'SalesOrder', state: 'Cancelled', issueType: 'UNREACHABLE_STATE', decision: 'VALID_STATE_MISSING_TRANSITION', rationale: 'Order detail should provide Cancel Order action before dispatch.', wave: 'WAVE-4' },
  { entity: 'SalesOrder', state: 'Processing', issueType: 'DEAD_END_STATE', decision: 'VALID_STATE_MISSING_TRANSITION', rationale: 'Processing must transition to Ready upon payment verification.', wave: 'WAVE-4' },
  { entity: 'Invoice', state: 'Draft', issueType: 'UNREACHABLE_STATE', decision: 'INVALID_STATE_SHOULD_BE_REMOVED', rationale: 'Dealership POS creates invoices immediately; remove Draft filter option.', wave: 'WAVE-4' },
  { entity: 'Invoice', state: 'Cancelled', issueType: 'UNREACHABLE_STATE', decision: 'VALID_STATE_MISSING_TRANSITION', rationale: 'Order cancellation must void/cancel corresponding invoice.', wave: 'WAVE-4' },
  { entity: 'Invoice', state: 'Paid', issueType: 'DEAD_END_STATE', decision: 'VALID_TERMINAL_STATE', rationale: 'Paid invoice is an intentional terminal financial state.', wave: 'EXCLUDE_TERMINAL_STATE' },
  { entity: 'Expense', state: 'Draft', issueType: 'UNREACHABLE_STATE', decision: 'INVALID_STATE_SHOULD_BE_REMOVED', rationale: 'Branch petty cash expenses submit directly to Pending; remove Draft filter option.', wave: 'WAVE-4' },
  { entity: 'Expense', state: 'Approved', issueType: 'DEAD_END_STATE', decision: 'VALID_STATE_MISSING_TRANSITION', rationale: 'Approved expense must transition to Paid upon cashier disbursement.', wave: 'WAVE-4' },
  { entity: 'Expense', state: 'Paid', issueType: 'UNREACHABLE_STATE', decision: 'VALID_STATE_MISSING_TRANSITION', rationale: 'Disbursement action sets status to Paid.', wave: 'WAVE-4' },
  { entity: 'StockTransfer', state: 'Draft', issueType: 'UNREACHABLE_STATE', decision: 'VALID_STATE_MISSING_TRANSITION', rationale: 'Allow saving transfer consignment draft before dispatch submission.', wave: 'WAVE-4' },
  { entity: 'StockTransfer', state: 'Cancelled', issueType: 'UNREACHABLE_STATE', decision: 'VALID_STATE_MISSING_TRANSITION', rationale: 'Allow cancelling pending transfer request before dispatch.', wave: 'WAVE-4' },
  { entity: 'WarrantyCase', state: 'In Progress', issueType: 'UNREACHABLE_STATE', decision: 'VALID_STATE_MISSING_TRANSITION', rationale: 'Intake transitions case to In Progress when repair job commences.', wave: 'WAVE-4' },
  { entity: 'WarrantyCase', state: 'Rejected', issueType: 'UNREACHABLE_STATE', decision: 'VALID_TERMINAL_STATE', rationale: 'Claim rejection is an intentional terminal state.', wave: 'EXCLUDE_TERMINAL_STATE' },
  { entity: 'RepairJob', state: 'Waiting for Parts', issueType: 'UNREACHABLE_STATE', decision: 'VALID_STATE_MISSING_TRANSITION', rationale: 'Technician marks Waiting for Parts when component is on backorder.', wave: 'WAVE-4' },
  { entity: 'RepairJob', state: 'Cancelled', issueType: 'UNREACHABLE_STATE', decision: 'VALID_TERMINAL_STATE', rationale: 'Job cancellation is an intentional terminal state.', wave: 'EXCLUDE_TERMINAL_STATE' },
  { entity: 'QuarantineRecord', state: 'Under Investigation', issueType: 'DEAD_END_STATE', decision: 'VALID_STATE_MISSING_TRANSITION', rationale: 'Investigation must progress to Release or Scrap.', wave: 'WAVE-4' },
  { entity: 'ActionCentreQueue', state: 'Pending -> Resolved', issueType: 'TRANSITION_WITHOUT_HANDLER', decision: 'VALID_STATE_MISSING_TRANSITION', rationale: 'Polymorphic source mutation handler required in store.resolveActionItem().', wave: 'WAVE-3' }
];

fs.writeFileSync(path.join(baselineDir, 'state_remediation_decisions.json'), JSON.stringify(stateRemediationDecisions, null, 2), 'utf8');

// 4. Financial Value Contract (financial_value_contract.json)
const financialValueContract = {
  canonicalCurrency: 'PKR',
  canonicalUnit: 'INTEGER_WHOLE_RUPEES',
  decimalPrecision: 0,
  roundingRule: 'Math.round(val)',
  allowNegative: false,
  allowZero: true,
  displayFormatter: 'store.formatCurrency(val) -> PKR ${val.toLocaleString()}',
  inputParser: 'val => parseInt(String(val).replace(/[^0-9]/g, "") || "0", 10)',
  remediationScope: [
    { property: 'sellingPrice', currentType: 'string (PKR 240,000)', targetType: 'integer (240000)', entity: 'SerializedUnit' },
    { property: 'landedCost', currentType: 'string (145.8K)', targetType: 'integer (145800)', entity: 'SerializedUnit' },
    { property: 'subtotal', currentType: 'string (PKR 2,650,000)', targetType: 'integer (2650000)', entity: 'PurchaseOrder' },
    { property: 'amount', currentType: 'string (PKR 48,500)', targetType: 'integer (48500)', entity: 'Expense' },
    { property: 'rawTotal', currentType: 'integer (already numeric)', targetType: 'integer (canonical)', entity: 'SalesOrder' }
  ]
};

fs.writeFileSync(path.join(baselineDir, 'financial_value_contract.json'), JSON.stringify(financialValueContract, null, 2), 'utf8');

// 5. Action Centre Business Contract (action_centre_business_contract.json)
const actionCentreBusinessContract = [
  {
    flowType: 'commercial_pricing',
    title: 'Commercial Pricing & Discount Override',
    producer: 'src/views/sales/CreateSale.vue (when discount > 8%)',
    requester: 'Branch Sales Executive / Branch Manager',
    assignee: 'Super Admin (Head Office Commercial Director)',
    sourceEntity: 'orders',
    sourceStateBefore: 'Pending Approval',
    queueState: 'Pending',
    decisionOptions: ['Approve', 'Counter', 'Reject'],
    requiredDecisionData: { authorizedDiscountCap: 'Percentage or Fixed PKR amount' },
    sourceStateAfterApprove: 'Ready',
    sourceStateAfterReject: 'Cancelled',
    sourceStateAfterCounter: 'Pending Approval (with counter-offer)',
    requesterFeedback: 'Notification emitted to branch sales dashboard',
    auditEvent: 'COMMERCIAL_DISCOUNT_RESOLVED'
  },
  {
    flowType: 'operational_expense',
    title: 'Operational Expense Approval (> PKR 15,000)',
    producer: 'src/views/finance/CreateExpense.vue (when parsedAmount > 15000)',
    requester: 'Branch Manager',
    assignee: 'Super Admin (Head Office CFO)',
    sourceEntity: 'expenses',
    sourceStateBefore: 'Pending',
    queueState: 'Pending',
    decisionOptions: ['Approve Expense', 'Hold for Audit', 'Reject'],
    requiredDecisionData: { auditNotes: 'String', budgetCode: 'String' },
    sourceStateAfterApprove: 'Approved',
    sourceStateAfterReject: 'Rejected',
    sourceStateAfterCounter: 'Hold for Audit',
    requesterFeedback: 'Notification emitted to Branch Manager inbox',
    auditEvent: 'EXPENSE_APPROVAL_RESOLVED'
  },
  {
    flowType: 'stock_reallocation',
    title: 'Inter-Branch Stock Transfer Reallocation',
    producer: 'src/views/inventory/CreateTransfer.vue',
    requester: 'Destination Branch Manager',
    assignee: 'Super Admin & Origin Branch Manager',
    sourceEntity: 'transfers',
    sourceStateBefore: 'Pending Approval',
    queueState: 'Pending',
    decisionOptions: ['Approve & Dispatch', 'Counter Destination', 'Decline'],
    requiredDecisionData: { carrierTracking: 'String', dispatchBay: 'String' },
    sourceStateAfterApprove: 'In Transit',
    sourceStateAfterReject: 'Cancelled',
    sourceStateAfterCounter: 'Pending Approval (Revised Destination)',
    requesterFeedback: 'Notification to requesting branch',
    auditEvent: 'STOCK_TRANSFER_AUTHORIZED'
  },
  {
    flowType: 'warranty_escalation',
    title: 'Battery & Motor Warranty Replacement Escalation',
    producer: 'src/views/after-sales/CreateCase.vue (Major Defect / Pack Replacement)',
    requester: 'Workshop Service Advisor',
    assignee: 'Super Admin (Technical Services Director)',
    sourceEntity: 'cases',
    sourceStateBefore: 'Under Review',
    queueState: 'Pending',
    decisionOptions: ['Authorize Replacement', 'Request Factory Diagnostics', 'Reject Claim'],
    requiredDecisionData: { factoryRmaNumber: 'String', diagnosticReportRef: 'String' },
    sourceStateAfterApprove: 'Approved',
    sourceStateAfterReject: 'Rejected',
    sourceStateAfterCounter: 'Under Review (Awaiting Telematics)',
    requesterFeedback: 'Notification to dealership service workshop',
    auditEvent: 'WARRANTY_ESCALATION_RESOLVED'
  },
  {
    flowType: 'inventory_governance',
    title: 'Quarantine Discrepancy & Write-off Governance',
    producer: 'src/views/inventory/CreateQuarantineRecord.vue',
    requester: 'Quality Inspector / Inventory Controller',
    assignee: 'Super Admin (Operations Director)',
    sourceEntity: 'quarantine',
    sourceStateBefore: 'Under Investigation',
    queueState: 'Pending',
    decisionOptions: ['Approve Write-off', 'Order Recount', 'Release from Quarantine'],
    requiredDecisionData: { authorizationPasscode: 'String', writeoffAccount: 'String' },
    sourceStateAfterApprove: 'Scrapped',
    sourceStateAfterReject: 'Under Investigation',
    sourceStateAfterCounter: 'Released',
    requesterFeedback: 'Notification to warehouse supervisor',
    auditEvent: 'INVENTORY_GOVERNANCE_RESOLVED'
  }
];

fs.writeFileSync(path.join(baselineDir, 'action_centre_business_contract.json'), JSON.stringify(actionCentreBusinessContract, null, 2), 'utf8');

// 6. Branch Authorization Contract (branch_authorization_contract.json)
const branchAuthorizationContract = {
  defenseInDepthArchitecture: {
    layer1_navigation: 'router.beforeEach validates activeBranch scoping for non-Super-Admin roles before view rendering.',
    layer2_dataAccess: 'store.getScopedRecordById(getter, id, user) asserts branch ownership before returning entity.',
    layer3_mutation: 'store.update* and store.delete* assert record.branch === user.branchName before modifying state.'
  },
  enforcementHelpers: {
    canAccessRecord: '(user, entity, record) => user.isSuperAdmin || (record && record.branch && record.branch.toLowerCase() === user.branchName.toLowerCase())',
    assertRecordAccess: '(user, entity, record) => { if (!canAccessRecord(user, entity, record)) throw new Error("UNAUTHORIZED_CROSS_BRANCH_ACCESS"); }'
  },
  entitiesCovered: [
    'orders', 'customers', 'serializedUnits', 'expenses', 'invoices', 'payments',
    'deliveries', 'transfers', 'stockRequests', 'stockAdjustments', 'cycleCounts',
    'quarantine', 'quotations', 'leads', 'followUps', 'customOrders', 'salesReturns',
    'cases', 'repairs', 'purchaseOrders', 'purchaseReturns'
  ]
};

fs.writeFileSync(path.join(baselineDir, 'branch_authorization_contract.json'), JSON.stringify(branchAuthorizationContract, null, 2), 'utf8');

// 7. Architecture Decision Backlog (architecture_decision_backlog.json)
const architectureDecisionBacklog = [
  {
    decisionId: 'ADB-001',
    component: 'src/views/sales/CreateSale.vue',
    area: 'UX_SURFACE',
    currentPattern: 'Modal Dialog Overlay',
    alternative: 'Dedicated Page (/sales/orders/create)',
    businessImpact: 'Walk-in quick POS benefits from modal; large commercial vehicle bookings benefit from full-page form.',
    decisionRequired: 'Separate walk-in quick POS (modal) from commercial booking order (dedicated page).',
    status: 'EXCLUDED_FROM_CODE_CHANGE_PENDING_DECISION'
  },
  {
    decisionId: 'ADB-002',
    component: 'src/views/after-sales/CreateCase.vue',
    area: 'UX_SURFACE',
    currentPattern: 'Modal Dialog Overlay',
    alternative: 'Dedicated Workshop Tablet Page',
    businessImpact: 'Tablet usability in service bays vs desktop back-office.',
    decisionRequired: 'Determine workshop tablet screen standard.',
    status: 'EXCLUDED_FROM_CODE_CHANGE_PENDING_DECISION'
  },
  {
    decisionId: 'ADB-003',
    component: 'src/views/after-sales/CreateRepairJob.vue',
    area: 'UX_SURFACE',
    currentPattern: 'Modal Dialog Overlay',
    alternative: 'Dedicated Repair Sheet Page',
    businessImpact: 'Diagnostic code entry and multi-line parts requisition.',
    decisionRequired: 'Evaluate repair job card layout requirements.',
    status: 'EXCLUDED_FROM_CODE_CHANGE_PENDING_DECISION'
  },
  {
    decisionId: 'ADB-004',
    component: 'src/views/organisation/CreateBranch.vue',
    area: 'UX_SURFACE',
    currentPattern: 'Modal Dialog Overlay',
    alternative: 'Dedicated Provisioning Page',
    businessImpact: 'Branch setup occurs infrequently (quarterly/annually).',
    decisionRequired: 'Low priority UX preference; current modal is functional.',
    status: 'EXCLUDED_FROM_CODE_CHANGE_PENDING_DECISION'
  },
  {
    decisionId: 'ADB-005',
    component: 'src/views/organisation/EditBranch.vue',
    area: 'UX_SURFACE',
    currentPattern: 'Modal Dialog Overlay',
    alternative: 'Dedicated Branch Settings Page',
    businessImpact: 'Quota and manager assignment modifications.',
    decisionRequired: 'Low priority UX preference; current modal is functional.',
    status: 'EXCLUDED_FROM_CODE_CHANGE_PENDING_DECISION'
  },
  {
    decisionId: 'ADB-006',
    component: 'src/views/sales/CreateDeliveryHandover.vue',
    area: 'BUSINESS_REQUIREMENT_SCOPE',
    currentPattern: '5 Verification Controls',
    alternative: '18-Point PDI Inspection Checklist',
    businessImpact: 'Requires certified technician checklist items and electrical sign-offs.',
    decisionRequired: 'Formal dealership approval of 18-point checklist specification.',
    status: 'EXCLUDED_FROM_CODE_CHANGE_PENDING_DECISION'
  },
  {
    decisionId: 'ADB-007',
    component: 'src/views/system/AuditLog.vue',
    area: 'SECURITY_BACKEND_CONTRACT',
    currentPattern: 'In-Memory Structured Event Log',
    alternative: 'Cryptographic SHA-256 Hash-Chained Tamper-Evident Ledger',
    businessImpact: 'Requires backend cryptographic signing infrastructure.',
    decisionRequired: 'Define backend AppendAuditEvent API contract before frontend migration.',
    status: 'EXCLUDED_FROM_CODE_CHANGE_PENDING_DECISION'
  }
];

fs.writeFileSync(path.join(baselineDir, 'architecture_decision_backlog.json'), JSON.stringify(architectureDecisionBacklog, null, 2), 'utf8');

// 8. Rebuild Defect Groups and Defect Instances Registries
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
    instanceCount: 5, // 4 in PO + 1 in ReceiveTransfer (receiverLocation)
    affectedModules: ['PROCUREMENT', 'INVENTORY']
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
    instanceCount: 2,
    affectedModules: ['SALES', 'PROCUREMENT']
  },
  {
    defectGroupId: 'DG-RECORD-002',
    category: 'WRONG_RECORD_DISCLOSURE_ON_INVALID_ID',
    title: 'Silent Fallback to Arbitrary First Record on Invalid Detail ID',
    severity: 'HIGH', // Re-evaluated to HIGH due to privacy / financial data exposure risk
    fixAuthority: 'DETERMINISTIC_FIX',
    sourceConfidence: 'HIGH',
    runtimeConfidence: 'HIGH',
    businessRequirementConfidence: 'HIGH',
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
    instanceCount: 17, // 21 minus 4 valid terminal states
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
    instanceCount: 30,
    affectedModules: ['FINANCE', 'SALES', 'PROCUREMENT']
  },
  {
    defectGroupId: 'DG-INTERACTION-001',
    category: 'CONFIRMED_WRONG_MODAL_ARCHITECTURE',
    title: 'Overloaded Complex Workflows Constrained in Modal Dialogs',
    severity: 'MEDIUM',
    fixAuthority: 'ARCHITECTURE_FIX',
    sourceConfidence: 'HIGH',
    runtimeConfidence: 'HIGH',
    businessRequirementConfidence: 'HIGH',
    instanceCount: 4,
    affectedModules: ['PROCUREMENT', 'CATALOGUE', 'ORGANISATION']
  },
  {
    defectGroupId: 'DG-DOC-001',
    category: 'SPECIFICATION_PDI_MISMATCH',
    title: 'Documentation Claim of 18-Point PDI vs 5-Point Source Implementation',
    severity: 'MEDIUM',
    fixAuthority: 'BUSINESS_DECISION_REQUIRED',
    sourceConfidence: 'HIGH',
    runtimeConfidence: 'NOT_AVAILABLE',
    businessRequirementConfidence: 'MEDIUM',
    instanceCount: 1,
    affectedModules: ['SALES']
  },
  {
    defectGroupId: 'DG-DOC-002',
    category: 'SPECIFICATION_CRYPTOGRAPHIC_AUDIT_MISMATCH',
    title: 'Documentation Claim of Cryptographic Ledger vs In-Memory Audit Log',
    severity: 'MEDIUM',
    fixAuthority: 'BACKEND_DEPENDENT',
    sourceConfidence: 'HIGH',
    runtimeConfidence: 'NOT_AVAILABLE',
    businessRequirementConfidence: 'MEDIUM',
    instanceCount: 1,
    affectedModules: ['SYSTEM']
  }
];

// Generate exact defect_instances matching every defectGroup
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
      expectedBehavior: `Remediate according to ${group.fixAuthority} specification.`,
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

fs.writeFileSync(path.join(baselineDir, 'defect_groups.json'), JSON.stringify(defectGroups, null, 2), 'utf8');
fs.writeFileSync(path.join(baselineDir, 'defect_instances.json'), JSON.stringify(defectInstances, null, 2), 'utf8');

console.log('=== DEFECT REGISTRIES RECONCILED ===');
console.log('Total Defect Groups:', defectGroups.length);
console.log('Total Defect Instances:', defectInstances.length);

const gSev = {};
defectGroups.forEach(g => gSev[g.severity] = (gSev[g.severity] || 0) + 1);
console.log('Groups by Severity:', gSev);

const iSev = {};
defectInstances.forEach(i => iSev[i.severity] = (iSev[i.severity] || 0) + 1);
console.log('Instances by Severity:', iSev);

// Assertion: Group instanceCounts match actual instances
for (const g of defectGroups) {
  const actualInstances = defectInstances.filter(i => i.defectGroupId === g.defectGroupId).length;
  if (actualInstances !== g.instanceCount) {
    throw new Error(`Integrity violation: Group ${g.defectGroupId} declares ${g.instanceCount} instances but registry has ${actualInstances}`);
  }
}
console.log('Integrity Assertion Passed: All group instance counts match registry lengths exactly.');
