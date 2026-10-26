const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const actionCentreUsages = [
  {
    actionId: 'SEM-ACT-268',
    component: 'src/views/finance/ExpenseDetail.vue',
    label: 'Approve Expense',
    entity: 'Expense',
    crossRole: true,
    crossBranch: false,
    asyncWorkQueueRequired: true,
    classification: 'ACTION_CENTRE_REQUIRED',
    rationale: 'Expenses exceeding PKR 15,000 threshold are governance escalations requiring Head Office Action Centre approval queue with audit trail.'
  },
  {
    actionId: 'SEM-ACT-312',
    component: 'src/views/inventory/CreateTransfer.vue',
    label: 'Authorize Inter-Branch Allocation',
    entity: 'StockTransfer',
    crossRole: true,
    crossBranch: true,
    asyncWorkQueueRequired: true,
    classification: 'ACTION_CENTRE_REQUIRED',
    rationale: 'Inter-branch vehicle reallocations involve cross-dealership inventory transfers and require Head Office Action Centre dispatch authorization.'
  },
  {
    actionId: 'SEM-ACT-300',
    component: 'src/views/inventory/AdjustmentDetail.vue',
    label: 'Approve Stock Adjustment',
    entity: 'StockAdjustment',
    crossRole: true,
    crossBranch: false,
    asyncWorkQueueRequired: true,
    classification: 'UNRESOLVED_BUSINESS_DECISION',
    rationale: 'Requires dealership governance policy decision: minor adjustments (< PKR 5k) valid for direct BM approval; major write-offs require Action Centre queue.'
  },
  {
    actionId: 'SEM-ACT-171',
    component: 'src/views/catalogue/ProductRequestDetail.vue',
    label: 'Approve SKU Sourcing',
    entity: 'ProductRequest',
    crossRole: false,
    crossBranch: false,
    asyncWorkQueueRequired: false,
    classification: 'DIRECT_APPROVAL_VALID',
    rationale: 'Super Admin directly approving a new catalogue product request on the detail view is a valid synchronous administrative action.'
  },
  {
    actionId: 'SEM-ACT-033',
    component: 'src/views/after-sales/RepairDetail.vue',
    label: 'Approve Warranty Claim / Job',
    entity: 'RepairJob',
    crossRole: false,
    crossBranch: false,
    asyncWorkQueueRequired: false,
    classification: 'DIRECT_APPROVAL_VALID',
    rationale: 'Workshop Service Manager approving a technician repair job on the workshop job sheet is a valid direct operational action.'
  },
  {
    actionId: 'SEM-ACT-398',
    component: 'src/views/inventory/StockRequestDetail.vue',
    label: 'Approve Stock Reorder',
    entity: 'StockRequest',
    crossRole: false,
    crossBranch: false,
    asyncWorkQueueRequired: false,
    classification: 'DIRECT_APPROVAL_VALID',
    rationale: 'Direct approval on stock request detail page by inventory controller is a valid synchronous action.'
  }
];

fs.writeFileSync(
  path.join(rootDir, 'scratch/forensic/baseline/action_centre_usage_reaudit.json'),
  JSON.stringify(actionCentreUsages, null, 2),
  'utf8'
);

console.log('=== ACTION CENTRE USAGE RE-AUDIT ===');
actionCentreUsages.forEach(a => console.log(`  - [${a.classification}] ${a.actionId} in ${a.component}: ${a.label}`));
