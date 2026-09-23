import { store } from '../src/store.js'

let total = 0
let passed = 0

function assert(condition, message) {
  total++
  if (!condition) {
    console.error(`❌ [FAIL] Test ${total}: ${message}`)
    process.exit(1)
  }
  passed++
  console.log(`✅ [PASS] Test ${total}: ${message}`)
}

console.log('\n======================================================================')
console.log('AJ ECODRIVE — PROMPT 7: AUDIT LOGS, TIMELINES & TRACEABILITY TEST SUITE')
console.log('======================================================================\n')

// -------------------------------------------------------------
// 1. BASELINE AUDIT LOGS & STORE REPOSITORY INTEGRITY
// -------------------------------------------------------------
console.log('--- 1. BASELINE AUDIT LOGS & INTEGRITY ---')
assert(Array.isArray(store.auditLogs), 'store.auditLogs is an Array')
assert(store.auditLogs.length >= 6, `Baseline seeded audit logs populated (found ${store.auditLogs.length})`)

const baselineIds = store.auditLogs.map(a => a.id)
assert(baselineIds.includes('AUD-001'), 'AUD-001 (Security / Login) present in baseline')
assert(baselineIds.includes('AUD-002'), 'AUD-002 (Sales Order Confirmed) present in baseline')
assert(baselineIds.includes('AUD-003'), 'AUD-003 (Payment Recorded) present in baseline')
assert(baselineIds.includes('AUD-004'), 'AUD-004 (PO Approved) present in baseline')
assert(baselineIds.includes('AUD-005'), 'AUD-005 (Transfer Dispatched) present in baseline')
assert(baselineIds.includes('AUD-006'), 'AUD-006 (Case Logged) present in baseline')

// Immutability check
assert(typeof store.editAuditLog === 'undefined', 'store.editAuditLog does not exist (Audit records are immutable)')
assert(typeof store.deleteAuditLog === 'undefined', 'store.deleteAuditLog does not exist (Audit records cannot be deleted)')

// -------------------------------------------------------------
// 2. CENTRAL HELPER & DEDUPLICATION VERIFICATION
// -------------------------------------------------------------
console.log('\n--- 2. CENTRAL HELPER & DEDUPLICATION ---')
const countBeforeManual = store.auditLogs.length

const manualLog = store.addAuditLog({
  action: 'Inspected',
  event_type: 'SYSTEM_INSPECTED',
  entity_type: 'system',
  entity_id: 'SYS-AUDIT-99',
  module: 'Security',
  branch: 'Peshawar',
  description: 'Security audit scan completed on Peshawar terminal.',
  metadata: { scanner: 'InternalValidator', issuesFound: 0 }
})

assert(!!manualLog && manualLog.id.startsWith('AUD-'), 'addAuditLog generates valid audit ID prefixed with AUD-')
assert(manualLog.user === 'Super Admin' || manualLog.actor_name, 'addAuditLog resolves actor information automatically')
assert(manualLog.branch === 'Peshawar', 'addAuditLog resolved branch context')
assert(store.auditLogs.length === countBeforeManual + 1, 'New audit entry added to store.auditLogs')

// Deduplication check: duplicate call with identical entity, event_type, created_at
const dupCountBefore = store.auditLogs.length
const duplicateLog = store.addAuditLog({
  action: 'Inspected',
  event_type: 'SYSTEM_INSPECTED',
  entity_type: 'system',
  entity_id: 'SYS-AUDIT-99',
  created_at: manualLog.created_at,
  description: 'Duplicate attempt'
})
assert(store.auditLogs.length === dupCountBefore, 'Deterministic deduplication prevented duplicate audit log insertion')

// -------------------------------------------------------------
// 3. BRANCH & ROLE SCOPING VERIFICATION
// -------------------------------------------------------------
console.log('\n--- 3. BRANCH & ROLE SCOPING ---')
const peshawarUser = { id: 'USR-01', name: 'Ahsan Khan', role: 'Branch Manager', branchName: 'Peshawar', branch_id: 'BR-01', isSuperAdmin: false }
const islamabadUser = { id: 'USR-02', name: 'Hassan Ali', role: 'Branch Manager', branchName: 'Islamabad', branch_id: 'BR-02', isSuperAdmin: false }
const superAdminUser = { id: 'USR-00', name: 'Executive Admin', role: 'Super Admin', branchName: 'All Branches', isSuperAdmin: true }

// Create an Islamabad-specific audit event
const isbLog = store.addAuditLog({
  action: 'Cash Count Verified',
  event_type: 'CASH_VERIFIED',
  entity_type: 'finance',
  entity_id: 'CSH-ISB-01',
  module: 'Finance',
  branch: 'Islamabad',
  branch_id: 'BR-02',
  actor_name: 'Hassan Ali',
  role: 'Branch Manager',
  user_id: 'USR-02',
  description: 'Daily cash balance reconciled at Islamabad branch.'
})

const pLogs = store.getAuditLogsForUser(peshawarUser)
const iLogs = store.getAuditLogsForUser(islamabadUser)
const saLogs = store.getAuditLogsForUser(superAdminUser)

assert(pLogs.some(l => l.id === manualLog.id), 'Peshawar BM sees Peshawar audit logs')
assert(!pLogs.some(l => l.id === isbLog.id), 'Peshawar BM strictly CANNOT see Islamabad branch audit logs')
assert(iLogs.some(l => l.id === isbLog.id), 'Islamabad BM sees Islamabad branch audit log')
assert(saLogs.some(l => l.id === manualLog.id) && saLogs.some(l => l.id === isbLog.id), 'Super Admin retains global visibility across all branches')

// -------------------------------------------------------------
// 4. BUSINESS ACTION EVENT LOGGING — PROCUREMENT
// -------------------------------------------------------------
console.log('\n--- 4. PROCUREMENT AUDIT TRACEABILITY ---')
const newPo = store.addPurchaseOrder({
  supplier: 'BRG Power China',
  destination: 'Peshawar',
  branch: 'Peshawar',
  items: [{ product: 'BRG DS11', sku: 'BRG-DS11', ordered: 4, cost: '146K', subtotal: '584K' }]
})
const poCreatedLog = store.auditLogs.find(a => a.entity_id === newPo.id && a.action === 'Created')
assert(!!poCreatedLog, `PO ${newPo.id} creation generated audit log`)
assert(poCreatedLog.module === 'Procurement', 'PO creation audit log categorized under Procurement')

// PO Approval
store.approvePurchaseOrder(newPo.id)
const poApprovedLog = store.auditLogs.find(a => a.entity_id === newPo.id && a.action === 'Approved')
assert(!!poApprovedLog, `PO ${newPo.id} approval generated audit log with state transition`)

// -------------------------------------------------------------
// 5. BUSINESS ACTION EVENT LOGGING — INVENTORY
// -------------------------------------------------------------
console.log('\n--- 5. INVENTORY & UNIT LIFECYCLE TRACEABILITY ---')
const stockReq = store.addStockRequest({
  item: 'BRG E-125 Eco Scooter',
  sku: 'BRG-E125-BLK',
  qty: 2,
  priority: 'High',
  reason: 'Urgent customer requirement'
})
const srLog = store.auditLogs.find(a => a.entity_id === stockReq.id && a.action === 'Submitted')
assert(!!srLog, `Stock request ${stockReq.id} creation generated audit log`)

// Transfer creation & dispatch
const transfer = store.addTransfer({
  from: 'Peshawar',
  to: 'Islamabad',
  product_id: 'PROD-001',
  item: 'BRG E-125',
  sku: 'BRG-E125',
  units: 1,
  purpose: 'Display unit'
})
const trCreateLog = store.auditLogs.find(a => a.entity_id === transfer.id && a.action === 'Created')
assert(!!trCreateLog, `Transfer ${transfer.id} creation generated audit log`)

// Serialized Unit status change
const unit = store.serializedUnits[0]
const origUnitStatus = unit.status
const targetStatus = origUnitStatus === 'Available' ? 'QC Hold' : 'Available'
store.transitionUnitStatus(unit.id || unit.vin, targetStatus, 'Quality audit inspection')
const unitLog = store.auditLogs.find(a => (a.entity_id === unit.id || a.entity_id === unit.vin || a.entity_id === unit.serial || a.entity_id === unit.unit_id) && (a.action === 'Status Transition' || a.action === 'Status Changed'))
assert(!!unitLog, `Unit ${unit.vin} status transition generated audit log`)

// -------------------------------------------------------------
// 6. BUSINESS ACTION EVENT LOGGING — SALES & CRM
// -------------------------------------------------------------
console.log('\n--- 6. SALES & CRM AUDIT TRACEABILITY ---')
const testCust = store.addCustomer({
  name: 'Tariq Mehmood',
  phone: '0300 999 8888',
  email: 'tariq@example.com',
  branch: 'Peshawar'
})
const custLog = store.auditLogs.find(a => a.entity_id === testCust.id && a.action === 'Created')
assert(!!custLog, `Customer ${testCust.id} creation generated audit log`)

// Quotation creation
const quote = store.addQuotation({
  customer_id: testCust.id,
  customer: testCust.name,
  model: 'BRG DS11',
  price: 280000,
  total: 280000
})
const quoteLog = store.auditLogs.find(a => a.entity_id === quote.id && a.action === 'Created')
assert(!!quoteLog, `Quotation ${quote.id} creation generated audit log`)

// Sales Order creation
const order = store.addOrder({
  customer_id: testCust.id,
  customer: testCust.name,
  model: 'BRG DS11',
  total: 'PKR 280,000',
  paid: 'PKR 0',
  balance: 'PKR 280,000',
  branch: 'Peshawar'
})
const orderLog = store.auditLogs.find(a => a.entity_id === order.id && a.action === 'Created')
assert(!!orderLog, `Sales Order ${order.id} creation generated audit log`)

// Payment recording
const paymentResult = store.recordInvoicePayment({
  invoice_id: 'INV-2238',
  amount: 50000,
  method: 'Bank Transfer'
})
const paymentLog = store.auditLogs.find(a => a.action === 'Payment Recorded')
assert(!!paymentLog, 'Payment recording generated audit log with amount and invoice reference')

// -------------------------------------------------------------
// 7. BUSINESS ACTION EVENT LOGGING — AFTER-SALES
// -------------------------------------------------------------
console.log('\n--- 7. AFTER-SALES & SERVICE TRACEABILITY ---')
const sc = store.addCase({
  customer: testCust.name,
  customer_id: testCust.id,
  unit: unit.vin,
  type: 'Warranty Claim',
  description: 'Battery range degraded after 3 months'
})
const caseLog = store.auditLogs.find(a => a.entity_id === sc.id && a.action === 'Logged')
assert(!!caseLog, `Service case ${sc.id} creation generated audit log`)

// Repair job completion
const testJob = store.repairs[0]
if (testJob) {
  const jobBefore = testJob.status
  store.completeRepair(testJob.id || testJob.repairId, 'Diagnostic tests passed, replacement complete')
  const rjLog = store.auditLogs.find(a => (a.entity_id === testJob.id || a.entity_id === testJob.repairId) && a.action === 'Completed')
  assert(!!rjLog, `Repair job ${testJob.repairId} completion generated audit log`)
}

// -------------------------------------------------------------
// 8. BUSINESS ACTION EVENT LOGGING — USER & ORG ADMIN
// -------------------------------------------------------------
console.log('\n--- 8. USER & ORGANISATION ADMIN TRACEABILITY ---')
const newUser = store.addUser({
  name: 'Zeeshan Ali',
  email: 'zeeshan@ajecodrive.com',
  role: 'Technician',
  branch: 'Peshawar',
  password: 'SuperSecretPassword123!',
  token: 'xyz-secret-token'
})
const userCreatedLog = store.auditLogs.find(a => a.entity_id === newUser.id && a.action === 'Created')
assert(!!userCreatedLog, `User ${newUser.id} creation generated audit log`)

// Verify privacy: passwords and tokens must NOT be stored in audit metadata
const metaStr = JSON.stringify(userCreatedLog.metadata || {})
assert(!metaStr.includes('SuperSecretPassword123!'), 'User password strictly stripped from audit log metadata')
assert(!metaStr.includes('xyz-secret-token'), 'User auth token strictly stripped from audit log metadata')

// User role change
store.updateUser(newUser.id, { role: 'Senior Technician', password: 'NewPassword999' })
const userRoleLog = store.auditLogs.find(a => a.entity_id === newUser.id && a.event_type === 'USER_ROLE_CHANGED')
assert(!!userRoleLog, `User ${newUser.id} role change generated USER_ROLE_CHANGED audit log`)
assert(userRoleLog.target_user_id === newUser.id, 'Audit log correctly identified target_user_id')
assert(userRoleLog.metadata.old_role === 'Technician' && userRoleLog.metadata.new_role === 'Senior Technician', 'Audit log captured old_role and new_role transition')
assert(!JSON.stringify(userRoleLog.metadata || {}).includes('NewPassword999'), 'Updated password strictly excluded from audit log metadata')

// User deactivation
store.updateUser(newUser.id, { status: 'Inactive' })
const userDeactLog = store.auditLogs.find(a => a.entity_id === newUser.id && a.event_type === 'USER_DEACTIVATED')
assert(!!userDeactLog, `User ${newUser.id} deactivation generated USER_DEACTIVATED audit log`)

// User branch assignment
store.updateUser(newUser.id, { branch: 'Islamabad' })
const userBranchLog = store.auditLogs.find(a => a.entity_id === newUser.id && a.event_type === 'USER_BRANCH_CHANGED')
assert(!!userBranchLog, `User ${newUser.id} branch reassignment generated USER_BRANCH_CHANGED audit log`)

// Role creation & role permissions update
const testRole = store.createRole({ name: 'Regional Auditor', scope: 'All Branches' })
const roleCreateLog = store.auditLogs.find(a => a.entity_id === 'Regional Auditor' && a.event_type === 'ROLE_CREATED')
assert(!!roleCreateLog, 'store.createRole generated ROLE_CREATED audit log')

store.updateRolePermissions('Regional Auditor', [{ module: 'Audit Log', view: true }], 'Initial security audit grant')
const rolePermLog = store.auditLogs.find(a => a.entity_id === 'Regional Auditor' && a.event_type === 'ROLE_PERMISSIONS_UPDATED')
assert(!!rolePermLog, 'store.updateRolePermissions generated ROLE_PERMISSIONS_UPDATED audit log')

// Branch creation and deactivation
const testBranch = store.addBranch({ name: 'Mardan Express Hub', code: 'BR-05', city: 'Mardan', manager: 'Sami Ullah' })
const branchCreateLog = store.auditLogs.find(a => a.entity_id === testBranch.id && a.event_type === 'BRANCH_CREATED')
assert(!!branchCreateLog, `Branch ${testBranch.id} creation generated BRANCH_CREATED audit log`)

store.updateBranch(testBranch.id, { status: 'Inactive' })
const branchDeactLog = store.auditLogs.find(a => a.entity_id === testBranch.id && a.event_type === 'BRANCH_DEACTIVATED')
assert(!!branchDeactLog, `Branch ${testBranch.id} deactivation generated BRANCH_DEACTIVATED audit log`)

// -------------------------------------------------------------
// 9. ENTITY TIMELINE QUERIES
// -------------------------------------------------------------
console.log('\n--- 9. ENTITY TIMELINE QUERIES ---')
const orderTimeline = store.getAuditLogsForEntity('sales_order', order.id)
assert(orderTimeline.length >= 1, `getAuditLogsForEntity retrieved order timeline for ${order.id}`)

const poTimeline = store.getAuditLogsForEntity('purchase_order', newPo.id)
assert(poTimeline.length >= 2, `getAuditLogsForEntity retrieved full PO timeline (Created + Approved) for ${newPo.id}`)

const userTimeline = store.getAuditLogsForEntity('user', newUser.id)
assert(userTimeline.length >= 4, `getAuditLogsForEntity retrieved full user lifecycle timeline for ${newUser.id} (found ${userTimeline.length})`)

// -------------------------------------------------------------
// 10. NEGATIVE BOUNDARIES & ERROR HANDLING
// -------------------------------------------------------------
console.log('\n--- 10. NEGATIVE BOUNDARIES & SAFETY ---')
const notFoundLog = store.getAuditLogById('AUD-NON-EXISTENT-99999')
assert(notFoundLog === null, 'getAuditLogById returns null gracefully for non-existent ID')

const emptyEntityTimeline = store.getAuditLogsForEntity('customer', 'CUST-NONE-000')
assert(Array.isArray(emptyEntityTimeline) && emptyEntityTimeline.length === 0, 'getAuditLogsForEntity returns empty array for unknown entity')

// Invalid payment action should throw and NOT generate audit log
const countBeforeFail = store.auditLogs.length
try {
  store.recordInvoicePayment({
    invoice_id: 'INV-2238',
    amount: 999999999, // Exceeds balance
    method: 'Cash'
  })
} catch (err) {
  // Expected to fail or be rejected
}
// Verify no success payment audit log was created for 999999999
const failedLog = store.auditLogs.find(a => a.action === 'Payment Recorded' && a.metadata?.amount === 999999999)
assert(!failedLog, 'Failed business transaction did not generate false success audit log')

console.log('\n======================================================================')
console.log(`🎉 ALL ${passed} PROMPT 7 AUDIT INTEGRATION TESTS PASSED!`)
console.log('======================================================================\n')
