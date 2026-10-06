/**
 * AJ ECODRIVE — WAVE 7 CONTRACT CONSISTENCY SUITE
 * Master Artifact ID: 73158
 */

const assert = require('assert')
const fs = require('fs')
const path = require('path')

console.log('======================================================================')
console.log('   AJ ECODRIVE — WAVE 7 CONTRACT CONSISTENCY SUITE')
console.log('======================================================================\n')

const artifactsDir = path.resolve(__dirname, '../scratch/forensic/final')

function loadJson(name) {
  const p = path.join(artifactsDir, name)
  assert.ok(fs.existsSync(p), `Artifact ${name} must exist`)
  return JSON.parse(fs.readFileSync(p, 'utf8'))
}

// 1. Role Contract Consistency
console.log('--- 1. Authenticated Role Universe Consistency ---')
const roleContract = loadJson('wave7_role_permission_contract.json')
assert.deepStrictEqual(roleContract.authenticatedRoles, ['Super Admin', 'Branch Manager'], 'Authenticated roles must be strictly Super Admin and Branch Manager')
assert.ok(!roleContract.authenticatedRoles.includes('Technician'), 'Technician must NOT be an authenticated workspace role')
assert.ok(!roleContract.authenticatedRoles.includes('Sales Representative'), 'Sales Representative must NOT be an authenticated workspace role')
console.log('  ✓ [PASS] Role contract restricts workspace authentication to verified Super Admin and Branch Manager')

// 2. Canonical State Machine Consistency
console.log('\n--- 2. Canonical State Machine Consistency ---')
const stateContract = loadJson('wave7_state_contract.json')
const sm = stateContract.stateMachines

// Stock Request Lifecycle
assert.ok(sm.stockRequests.canonicalStates.includes('Submitted'), 'Stock Request states must include Submitted')
assert.ok(sm.stockRequests.canonicalStates.includes('Approved'), 'Stock Request states must include Approved')
assert.strictEqual(sm.stockRequests.legacyAliases['Pending Approval'], 'Submitted', 'Pending Approval must map to Submitted')

// Transfer Lifecycle
assert.ok(sm.transfers.canonicalStates.includes('Requested'), 'Transfer states must include Requested')
assert.ok(sm.transfers.canonicalStates.includes('Approved'), 'Transfer states must include Approved')
assert.ok(sm.transfers.canonicalStates.includes('In Transit'), 'Transfer states must include In Transit')
assert.ok(sm.transfers.canonicalStates.includes('Received'), 'Transfer states must include Received')

// Serialized Unit Canonical Vocabulary & Prohibitions
const expectedUnitStates = ["Expected", "Supplier In Transit", "Receiving / QC", "Available", "Reserved", "Transfer In Transit", "Sold", "Returned", "In Service", "Damaged / Quarantine", "Scrapped"]
assert.deepStrictEqual(sm.serializedUnits.canonicalStates, expectedUnitStates, 'Serialized unit canonical states must match approved authority exactly')
assert.ok(!sm.serializedUnits.canonicalStates.includes('Delivered'), 'Delivered must NOT be in canonical serialized unit states')
assert.ok(!sm.serializedUnits.canonicalStates.includes('QC Hold'), 'QC Hold must NOT be in canonical serialized unit states')
assert.ok(!sm.serializedUnits.canonicalStates.includes('Maintenance'), 'Maintenance must NOT be in canonical serialized unit states')
assert.ok(!sm.serializedUnits.canonicalStates.includes('Allocated'), 'Allocated must NOT be in canonical serialized unit states')
assert.ok(!sm.serializedUnits.canonicalStates.includes('In Transit'), 'Generic In Transit must NOT be in canonical serialized unit states')
assert.strictEqual(sm.serializedUnits.legacyAliases['QC Hold'], 'Receiving / QC', 'QC Hold legacy alias maps to Receiving / QC')
assert.strictEqual(sm.serializedUnits.legacyAliases['Maintenance'], 'In Service', 'Maintenance legacy alias maps to In Service')
assert.strictEqual(sm.serializedUnits.legacyAliases['Allocated'], 'Reserved', 'Allocated legacy alias maps to Reserved')
assert.strictEqual(sm.serializedUnits.legacyAliases['In Transit'], 'Transfer In Transit', 'In Transit legacy alias maps to Transfer In Transit')
assert.strictEqual(sm.serializedUnits.legacyAliases['Delivered'], 'Sold', 'Delivered legacy alias maps to Sold')

// Sales Order Canonical Vocabulary & Prohibitions
const expectedOrderStates = ["Draft", "Confirmed", "Payment Pending", "Partially Paid", "Paid", "Reserved", "Ready for Handover", "Completed", "Cancelled", "Returned / Partially Returned"]
assert.deepStrictEqual(sm.orders.canonicalStates, expectedOrderStates, 'Sales Order canonical states must match approved authority exactly')
assert.ok(!sm.orders.canonicalStates.includes('Under Financing'), 'Under Financing must NOT be in canonical Sales Order states')
assert.ok(!sm.orders.canonicalStates.includes('Delivered'), 'Delivered must NOT be in canonical Sales Order states')
assert.ok(!sm.orders.canonicalStates.includes('Refunded'), 'Refunded must NOT be in canonical Sales Order states')

// Action Queue Task States
assert.deepStrictEqual(sm.actionQueue.canonicalStates, ["Pending", "Resolved", "Rejected", "Stale"], 'Action Queue task states must match Wave 3 technical truth')
console.log('  ✓ [PASS] Canonical state machines consistent across all core domain entities')

// 3. Approval Trigger & Task Boundary Consistency
console.log('\n--- 3. Approval Trigger & Task Boundary Consistency ---')
const approvalContract = loadJson('wave7_approval_contract.json')
const trApproval = approvalContract.find(a => a.workflowId === 'WF-TR-01')
assert.ok(trApproval, 'WF-TR-01 approval contract must exist')
assert.strictEqual(trApproval.decisionActor, 'Super Admin')
assert.strictEqual(trApproval.approvedState, 'Approved')

const srApproval = approvalContract.find(a => a.workflowId === 'WF-SR-01')
assert.ok(srApproval, 'WF-SR-01 approval contract must exist')
assert.ok(srApproval.prohibitedSideEffects.some(p => p.includes('Does NOT automatically create Transfer')), 'Stock request approval must not create transfer')

approvalContract.forEach(appr => {
  assert.strictEqual(appr.taskStateLifecycle.initial, 'Pending', `Task initial state must be Pending for ${appr.workflowId}`)
  assert.strictEqual(appr.taskStateLifecycle.resolved, 'Resolved', `Task resolved state must be Resolved for ${appr.workflowId}`)
  assert.ok(appr.backendEnforcement.includes('TASK_ALREADY_RESOLVED'), `Backend enforcement must specify TASK_ALREADY_RESOLVED for ${appr.workflowId}`)
})
console.log('  ✓ [PASS] Approval boundaries enforce separation between Requisitions, Transfers, and Purchasing')

// 4. Financial Contract Consistency
console.log('\n--- 4. Financial Contract Consistency ---')
const finContract = loadJson('wave7_financial_backend_contract.json')
assert.strictEqual(finContract.currency, 'PKR', 'Canonical currency is PKR')
assert.strictEqual(finContract.financialFormulas['Net Sales'], 'Gross Selling Amount - Discounts - Sales Returns / Refund adjustments', 'Net Sales formula must include Returns/Refunds')
assert.strictEqual(finContract.financialFormulas['COGS (Cost of Goods Sold)'], 'Actual historical unit landed cost of specific serialized units sold', 'COGS formula must reference specific serialized units sold')
assert.ok(finContract.landedCostInvariants.rule1.includes('Purchase Order is a commercial order document and does NOT automatically create an accounting liability'), 'PO liability invariant documented')
assert.ok(finContract.landedCostInvariants.rule4.includes('specific serialized units sold'), 'COGS not broadened to ambiguous handover timing')
console.log('  ✓ [PASS] Financial contract enforces exact formulas and landed cost invariants')

console.log('\n======================================================================')
console.log('   TOTAL TESTS: 4 SUITES | ALL PASSED (0 FAILURES)')
console.log('   WAVE 7 CONTRACT CONSISTENCY STATUS: VERIFIED')
console.log('======================================================================\n')
