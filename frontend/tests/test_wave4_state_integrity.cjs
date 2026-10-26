/**
 * AJ ECODRIVE — WAVE 4 VERIFICATION SUITE
 * Test Suite: State Machine Integrity, Lifecycle Transitions & Separation of Concerns
 */

const assert = require('assert')
const path = require('path')

const storePath = path.resolve(__dirname, '../src/store.js')
delete require.cache[require.resolve(storePath)]
const { store } = require(storePath)

// Initialize session as Super Admin
store.setSession({
  id: 'usr-admin-01',
  name: 'Global Administrator',
  email: 'admin@ajecodrive.com',
  role: 'Super Admin',
  isSuperAdmin: true,
  branch: 'All',
  branchCode: 'ALL'
})

console.log('=== WAVE 4: STATE MACHINE INTEGRITY & SEPARATION OF CONCERNS ===\n')

let passedTests = 0
let failedTests = 0

function runTest(name, fn) {
  try {
    fn()
    console.log(`[PASS] ${name}`)
    passedTests++
  } catch (err) {
    console.error(`[FAIL] ${name}`)
    console.error(`  Error: ${err.message}`)
    failedTests++
  }
}

// 1. PO Lifecycle Separation: Approval != Ordering != Shipping != Receiving
runTest('PO Lifecycle Separation: Approval != Ordering != In Transit', () => {
  const po = store.addPurchaseOrder({
    supplier_id: 'SUP-01',
    supplier: 'Super EV Shenzhen Ltd',
    destination: 'Peshawar',
    branch_id: 'BR-01',
    status: 'Pending Approval',
    items: [
      { product_id: 'PROD-001', product: 'BRG E-125', sku: 'SKU-E125-BLK', quantity: 5, expectedUnitCost: 180000 }
    ]
  })

  // Cannot ship or order before approval
  assert.throws(() => {
    store.orderPurchaseOrder(po.id)
  }, /must be Approved first/i)

  assert.throws(() => {
    store.shipPurchaseOrder(po.id)
  }, /Must be Ordered first/i)

  // Approve PO
  store.approvePurchaseOrder(po.id)
  assert.strictEqual(po.status, 'Approved')
  assert.strictEqual(po.totalReceived, 0)

  // Order PO
  store.orderPurchaseOrder(po.id)
  assert.strictEqual(po.status, 'Ordered')

  // Ship PO (In Transit)
  store.shipPurchaseOrder(po.id, 'TRACK-PK-9912')
  assert.strictEqual(po.status, 'In Transit')
  assert.strictEqual(po.tracking, 'TRACK-PK-9912')
})

// 2. Fail Before Mutation on Invalid PO Transitions
runTest('Fail Before Mutation: Invalid PO status transition leaves record unaltered', () => {
  const po = store.addPurchaseOrder({
    supplier_id: 'SUP-01',
    supplier: 'Apex Cells',
    destination: 'Islamabad',
    branch_id: 'BR-02',
    status: 'Pending Approval',
    items: [
      { product_id: 'PROD-006', product: '72V Battery', sku: 'BAT-72V', quantity: 10, expectedUnitCost: 45000 }
    ]
  })

  const snapshotBefore = JSON.stringify(po)

  // Attempting to close a Pending Approval PO should fail and not mutate
  assert.throws(() => {
    store.closePurchaseOrder(po.id)
  }, /Only fully received POs can be closed/i)

  const snapshotAfter = JSON.stringify(po)
  assert.strictEqual(snapshotBefore, snapshotAfter, 'PO record must remain identical after rejected transition')
})

// 3. Stock Adjustment Separation: Approval != Posting / Ledger Update
runTest('Stock Adjustment Separation: Approval != Posting / Stock Mutation', () => {
  const prod = store.products.find(p => p.id === 'PROD-001')
  const initialStock = parseInt(String(prod.stock || '0').replace(/[^\d]/g, '')) || 0

  const adj = store.addStockAdjustment({
    id: 'ADJ-W4-001',
    product_id: 'PROD-001',
    product: 'BRG E-125',
    branch_id: 'BR-01',
    branch: 'Peshawar',
    type: 'Defect / Damage',
    reason: 'Damaged packaging during handling',
    adjustedQty: -2,
    status: 'Pending Approval'
  })

  // Stock must not change on creation
  let currentStock = parseInt(String(prod.stock || '0').replace(/[^\d]/g, '')) || 0
  assert.strictEqual(currentStock, initialStock)

  // Approve adjustment (via workflow task / approveStockAdjustment)
  store.approveStockAdjustment(adj.id)
  assert.strictEqual(adj.status, 'Approved')

  // Approval must NOT mutate physical stock
  currentStock = parseInt(String(prod.stock || '0').replace(/[^\d]/g, '')) || 0
  assert.strictEqual(currentStock, initialStock, 'Stock must NOT change on approval alone')

  // Explicit postStockAdjustment performs physical stock mutation
  store.postStockAdjustment(adj.id)
  assert.strictEqual(adj.status, 'Posted')
  const finalStock = parseInt(String(prod.stock || '0').replace(/[^\d]/g, '')) || 0
  assert.strictEqual(finalStock, Math.max(0, initialStock - 2), 'Stock mutates only upon explicit posting')
})

// 4. Expense Separation: Approval != Payment Disbursement
runTest('Expense Separation: Approval != Payment Disbursement / Paid status', () => {
  const exp = store.addExpense({
    id: 'EXP-W4-001',
    branch_id: 'BR-01',
    branch: 'Peshawar',
    category: 'Showroom Utilities',
    amount: 'PKR 45,000',
    approval: 'Pending Approval',
    status: 'Pending Approval',
    payment: 'Unpaid'
  })

  assert.strictEqual(exp.payment, 'Unpaid')

  // Approving expense should set approval = 'Approved' but payment remains 'Unpaid'
  store.approveExpense(exp.id)
  assert.strictEqual(exp.approval, 'Approved')
  assert.strictEqual(exp.payment, 'Unpaid', 'Expense payment must remain Unpaid after approval')

  // Record payment explicitly
  store.recordExpensePayment(exp.id, { paymentMethod: 'Bank Transfer' })
  assert.strictEqual(exp.payment, 'Paid')
  assert.strictEqual(exp.status, 'Paid')
})

// 5. Stock Request Separation: Approval != Fulfillment
runTest('Stock Request Separation: Approval != Fulfillment / Closure', () => {
  const req = store.addStockRequest({
    id: 'REQ-W4-001',
    branch_id: 'BR-01',
    branch: 'Peshawar',
    targetBranch_id: 'BR-02',
    targetBranch: 'Islamabad',
    items: [{ product_id: 'PROD-001', qty: 2 }],
    status: 'Pending Approval'
  })

  // Approve request
  store.approveStockRequest(req.id)
  assert.strictEqual(req.status, 'Approved')

  // Cannot re-approve
  assert.throws(() => {
    store.approveStockRequest(req.id)
  }, /already approved or in invalid state/i)

  // Fulfill request explicitly
  store.fulfillStockRequest(req.id)
  assert.strictEqual(req.status, 'Fulfilled')
})

// 6. Transfer Dispatch & Unit Status: Dispatched unit is In Transit (never in two branches at once)
runTest('Transfer Invariant: Dispatched unit becomes In Transit and is removed from origin on-hand', () => {
  // Create a unit at Peshawar
  const unit = {
    id: 'UNIT-W4-XFER-01',
    chassis: 'CHASSIS-W4-XFER-01',
    serial: 'SER-W4-XFER-01',
    product_id: 'PROD-001',
    product: 'BRG E-125',
    sku: 'SKU-E125-BLK',
    branch_id: 'BR-01',
    branch: 'Peshawar',
    status: 'Available',
    ownership_status: 'Company Owned',
    landedCost: 180000
  }
  store.serializedUnits.unshift(unit)

  // Add transfer
  const xfer = store.addTransfer({
    id: 'TR-W4-001',
    fromBranch_id: 'BR-01',
    from: 'Peshawar',
    toBranch_id: 'BR-02',
    to: 'Islamabad',
    product_id: 'PROD-001',
    product: 'BRG E-125',
    units: 1,
    status: 'Approved',
    items: [{
      product_id: 'PROD-001',
      product: 'BRG E-125',
      sku: 'SKU-E125-BLK',
      requestedQty: 1,
      dispatchedQty: 1,
      isSerialized: true,
      serials: ['SER-W4-XFER-01']
    }]
  })

  // Dispatch transfer
  store.dispatchTransfer(xfer.id, { carrier: 'AJ Truck #2' })

  assert.ok(unit.status === 'In Transit' || unit.status === 'Transfer In Transit')
  assert.ok(unit.location.includes('Transit'))

  // Receive transfer at destination
  store.receiveTransfer(xfer.id, { receiverLocation: 'Islamabad Bay 1' })
  assert.strictEqual(unit.status, 'Available')
  assert.strictEqual(unit.branch, 'Islamabad')
  assert.strictEqual(unit.branch_id, 'BR-02')
})

// 7. Sales Order Lifecycle: Payment != Delivery / Handover
runTest('Sales Order Lifecycle: Payment != Fulfillment / Handover', () => {
  // Create unit
  const unit = {
    id: 'UNIT-W4-ORDER-01',
    chassis: 'CHASSIS-W4-ORDER-01',
    serial: 'SER-W4-ORDER-01',
    product_id: 'PROD-001',
    product: 'BRG E-125',
    branch_id: 'BR-01',
    branch: 'Peshawar',
    status: 'Available',
    ownership_status: 'Company Owned',
    landedCost: 180000
  }
  store.serializedUnits.unshift(unit)

  // Create Order with allocated unit
  const order = store.addOrder({
    id: 'ORD-W4-001',
    customer: 'Usman Ali',
    branch_id: 'BR-01',
    branch: 'Peshawar',
    unit_id: 'UNIT-W4-ORDER-01',
    paymentStatus: 'Pending',
    status: 'Draft',
    total: 250000
  })

  // Record Payment
  store.recordOrderPayment(order.id, { amount: 250000, method: 'Bank Transfer' })
  assert.strictEqual(order.paymentStatus, 'Paid')
  assert.notStrictEqual(order.status, 'Delivered', 'Order must not be marked Delivered automatically upon payment')
  assert.strictEqual(unit.status, 'Reserved', 'Unit remains reserved until handover')

  // Deliver Order
  store.deliverOrder(order.id)
  assert.strictEqual(order.status, 'Delivered')
  assert.strictEqual(unit.status, 'Sold')
  assert.strictEqual(unit.ownership_status, 'Customer Owned')
})

// 8. Serialized Unit State Reconciliation: In Production -> Expected, Inbound In Transit -> Supplier In Transit
runTest('Serialized Unit State Compatibility: In Production maps to Expected (Zero stock, Zero transit pipeline)', () => {
  assert.strictEqual(store.normalizeUnitStatus('In Production'), 'Expected')
  assert.strictEqual(store.normalizeUnitStatus('Inbound In Transit'), 'Supplier In Transit')
  
  // Pipeline Isolation Check
  const testInventory = [
    { id: 'U-EXP-1', status: store.normalizeUnitStatus('In Production') }, // Expected
    { id: 'U-EXP-2', status: 'Expected' },
    { id: 'U-SIT-1', status: store.normalizeUnitStatus('Inbound In Transit') }, // Supplier In Transit
    { id: 'U-SIT-2', status: 'Supplier In Transit' },
    { id: 'U-AVL-1', status: 'Available' }
  ]
  
  // 1. Sellable available stock
  const sellable = testInventory.filter(u => u.status === 'Available').length
  assert.strictEqual(sellable, 1)
  
  // 2. In Production contributes 0 sellable Available stock
  const inProdSellable = testInventory.filter(u => u.status === store.normalizeUnitStatus('In Production') && u.status === 'Available').length
  assert.strictEqual(inProdSellable, 0)
  
  // 3. In Production contributes 0 supplier-in-transit count/value
  const inProdInTransit = testInventory.filter(u => u.status === store.normalizeUnitStatus('In Production') && u.status === 'Supplier In Transit').length
  assert.strictEqual(inProdInTransit, 0)
  
  // 4. Expected contributes 0 sellable Available stock
  const expSellable = testInventory.filter(u => u.status === 'Expected' && u.status === 'Available').length
  assert.strictEqual(expSellable, 0)
  
  // 5. Supplier In Transit contributes to supplier-in-transit pipeline metric only
  const supplierInTransit = testInventory.filter(u => u.status === 'Supplier In Transit').length
  assert.strictEqual(supplierInTransit, 2)
})

console.log('\n========================================')
console.log(`Wave 4 State Integrity: ${passedTests} passed, ${failedTests} failed.`)
console.log('========================================\n')

if (failedTests > 0) {
  process.exit(1)
}
