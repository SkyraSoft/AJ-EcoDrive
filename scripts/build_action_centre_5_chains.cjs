const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const chains = [
  {
    flowType: 'commercial_pricing',
    title: 'Commercial Pricing & Discount Override',
    triggerSource: 'src/views/sales/CreateSale.vue line 475 (discount > 8% policy)',
    producerExists: false,
    queueInsertionCode: 'NONE in CreateSale.vue (only exists via manual ActionCentre modal)',
    linkedSourceEntity: 'orders',
    linkedRecordId: 'ORD-902 (in seeded demo data)',
    recipient: 'Super Admin',
    saVisibility: 'Action Centre Commercial tab & Orders grid',
    decisionOptions: ['Approve', 'Counter', 'Reject'],
    resolver: 'store.resolveActionItem(id, decisionData)',
    sourceMutation: 'Updates order.approvalStatus = "Approved" and order.specialDiscountApproved = true (PARTIALLY WIRED FOR COMMERCIAL ONLY)',
    originatingRoleResult: 'Branch Manager sees order updated if orderRef matches; but live create sale never pushes to queue',
    notificationResultFeedback: 'Toast in ActionCentre; Audit log appended',
    runtimeVerified: 'VERIFIED_DISCONNECTED_AT_SOURCE',
    classification: 'SEEDED_DEMO_QUEUE_ITEM_ONLY'
  },
  {
    flowType: 'stock_reallocation',
    title: 'Inter-Branch Stock Transfer Reallocation',
    triggerSource: 'src/views/inventory/CreateTransfer.vue & CreateStockRequest.vue',
    producerExists: false,
    queueInsertionCode: 'NONE in CreateTransfer.vue / CreateStockRequest.vue',
    linkedSourceEntity: 'transfers / serializedUnits',
    linkedRecordId: 'TRF-301 (in seeded demo data)',
    recipient: 'Super Admin & Origin Branch Manager',
    saVisibility: 'Action Centre Stock tab & Transfers grid',
    decisionOptions: ['Approve & Dispatch', 'Counter Destination', 'Decline'],
    resolver: 'store.resolveActionItem(id, decisionData)',
    sourceMutation: 'ZERO MUTATION on transfers or serializedUnits; status in store.transfers remains unchanged',
    originatingRoleResult: 'No feedback or status progression on transfer record',
    notificationResultFeedback: 'Toast in ActionCentre; Audit log appended',
    runtimeVerified: 'VERIFIED_DISCONNECTED_AT_SOURCE',
    classification: 'SEEDED_DEMO_QUEUE_ITEM_ONLY'
  },
  {
    flowType: 'operational_expense',
    title: 'Operational Expense Approval (> PKR 15,000)',
    triggerSource: 'src/views/finance/CreateExpense.vue line 60 (parsedAmount > 15000)',
    producerExists: false,
    queueInsertionCode: 'NONE. CreateExpense.vue calls store.addExpense() which creates notification & audit log, but NEVER calls createActionItem()',
    linkedSourceEntity: 'expenses',
    linkedRecordId: 'EXP-103 (in seeded demo data)',
    recipient: 'Super Admin',
    saVisibility: 'Action Centre Expense tab & Expenses grid',
    decisionOptions: ['Approve Expense', 'Hold for Audit', 'Reject'],
    resolver: 'store.resolveActionItem(id, decisionData)',
    sourceMutation: 'ZERO MUTATION on expenses; store.resolveActionItem() does NOT update expense.approval or expense.status',
    originatingRoleResult: 'BM submits expense > 15k, sees status Pending in Expenses.vue; SA can only approve in Expenses.vue, NOT via Action Centre',
    notificationResultFeedback: 'Notification created in store.addExpense(); No Action Centre item produced',
    runtimeVerified: 'VERIFIED_DISCONNECTED_AT_SOURCE',
    classification: 'SEEDED_DEMO_QUEUE_ITEM_ONLY'
  },
  {
    flowType: 'warranty_escalation',
    title: 'Warranty Battery/Motor Replacement Escalation',
    triggerSource: 'src/views/after-sales/CreateCase.vue & CreateRepairJob.vue',
    producerExists: false,
    queueInsertionCode: 'NONE in CreateCase.vue / CreateRepairJob.vue',
    linkedSourceEntity: 'cases / repairs',
    linkedRecordId: 'CAS-402 (in seeded demo data)',
    recipient: 'Super Admin / Technical Director',
    saVisibility: 'Action Centre Warranty tab & WarrantyService grid',
    decisionOptions: ['Authorize Replacement', 'Request Factory Diagnostics', 'Reject Claim'],
    resolver: 'store.resolveActionItem(id, decisionData)',
    sourceMutation: 'ZERO MUTATION on cases or repairs; status in store.cases remains unchanged',
    originatingRoleResult: 'No status update propagated to warranty case',
    notificationResultFeedback: 'Toast in ActionCentre; Audit log appended',
    runtimeVerified: 'VERIFIED_DISCONNECTED_AT_SOURCE',
    classification: 'SEEDED_DEMO_QUEUE_ITEM_ONLY'
  },
  {
    flowType: 'inventory_governance',
    title: 'Inventory Governance & Quarantine Discrepancy',
    triggerSource: 'src/views/inventory/CreateQuarantineRecord.vue & CreateAdjustmentRequest.vue',
    producerExists: false,
    queueInsertionCode: 'NONE in CreateQuarantineRecord.vue / CreateAdjustmentRequest.vue',
    linkedSourceEntity: 'quarantine / stockAdjustments',
    linkedRecordId: 'QR-201 (in seeded demo data)',
    recipient: 'Super Admin',
    saVisibility: 'Action Centre Governance tab & Quarantine grid',
    decisionOptions: ['Approve Write-off', 'Order Recount', 'Release from Quarantine'],
    resolver: 'store.resolveActionItem(id, decisionData)',
    sourceMutation: 'ZERO MUTATION on quarantine or stockAdjustments; quarantine record status remains unchanged',
    originatingRoleResult: 'No status update propagated to quarantine record',
    notificationResultFeedback: 'Toast in ActionCentre; Audit log appended',
    runtimeVerified: 'VERIFIED_DISCONNECTED_AT_SOURCE',
    classification: 'SEEDED_DEMO_QUEUE_ITEM_ONLY'
  }
];

fs.writeFileSync(
  path.join(rootDir, 'scratch/forensic/baseline/action_centre_5_chains.json'),
  JSON.stringify(chains, null, 2),
  'utf8'
);

console.log('Saved scratch/forensic/baseline/action_centre_5_chains.json');
