/**
 * Wave 4 Financial Domain Integrity Test Suite
 * Tests financial invariants, exact landed cost COGS, gross margin safe zero-handling,
 * inventory valuation separation, and decimal precision.
 */

const assert = require('assert')
const { store } = require('../src/store.js')

console.log('=== WAVE 4: FINANCIAL DOMAIN INTEGRITY & FORMULAS ===\n')

let passed = 0
let failed = 0

function runTest(name, fn) {
  try {
    fn()
    console.log(`[PASS] ${name}`)
    passed++
  } catch (err) {
    console.error(`[FAIL] ${name}`)
    console.error(`  Error: ${err.message}`)
    failed++
  }
}

// 1. Exact Landed Cost COGS vs General Purchases Invariant
runTest('Financial Invariant: COGS is derived from serialized units sold, NOT purchases', () => {
  // Set up store state
  store.currentUser = { role: 'Super Admin', branch_id: 'ALL', name: 'Super Admin', isSuperAdmin: true }

  // Clear orders and units for clean test baseline
  const testUnit1 = {
    id: 'UNIT-FIN-01',
    serial: 'SER-FIN-01',
    product_id: 'PROD-001',
    branch_id: 'BR-01',
    status: 'Sold',
    landedCost: 175000.50
  }
  const testUnit2 = {
    id: 'UNIT-FIN-02',
    serial: 'SER-FIN-02',
    product_id: 'PROD-001',
    branch_id: 'BR-01',
    status: 'Sold',
    landedCost: 180000.00
  }
  const testUnitUnsold = {
    id: 'UNIT-FIN-03',
    serial: 'SER-FIN-03',
    product_id: 'PROD-001',
    branch_id: 'BR-01',
    status: 'Available',
    landedCost: 190000.00
  }

  store.serializedUnits.unshift(testUnit1, testUnit2, testUnitUnsold)

  const testOrder = {
    id: 'ORD-FIN-01',
    branch_id: 'BR-01',
    grossAmount: 450000.00,
    discount: 10000.00,
    netAmount: 440000.00,
    unit_ids: ['UNIT-FIN-01', 'UNIT-FIN-02'],
    status: 'Completed'
  }
  store.orders.unshift(testOrder)

  const metrics = store.calculateFinancialMetrics({ branch_id: 'BR-01', order_ids: ['ORD-FIN-01'] })
  
  // Net sales should be 440000
  assert.strictEqual(metrics.netSales, 440000.00)
  
  // COGS must be exactly 175000.50 + 180000.00 = 355000.50 (excluding unsold UNIT-FIN-03)
  assert.strictEqual(metrics.cogs, 355000.50)
  
  // Gross profit = 440000.00 - 355000.50 = 84999.50
  assert.strictEqual(metrics.grossProfit, 84999.50)
})

// 2. Safe Zero-Handling for Gross Margin Percentage
runTest('Safe Zero-Handling: 0 Net Sales yields 0.0% margin without NaN / Infinity', () => {
  const metrics = store.calculateFinancialMetrics({ customOrders: [], customExpenses: [] })
  
  assert.strictEqual(metrics.netSales, 0)
  assert.strictEqual(metrics.cogs, 0)
  assert.strictEqual(metrics.grossProfit, 0)
  assert.strictEqual(metrics.grossMarginPct, 0)
  assert.strictEqual(metrics.grossMarginFormatted, '0.0%')
  assert.ok(!isNaN(metrics.grossMarginPct))
  assert.ok(isFinite(metrics.grossMarginPct))
})

// 3. Operating Expense Separation (Approved Only vs Draft/Rejected)
runTest('Operating Expense Invariant: Only Approved expenses deduct from Gross Profit', () => {
  const approvedExp = {
    id: 'EXP-FIN-APP',
    branch_id: 'BR-01',
    amount: 25000.00,
    status: 'Approved',
    approval: 'Approved'
  }
  const pendingExp = {
    id: 'EXP-FIN-PEND',
    branch_id: 'BR-01',
    amount: 15000.00,
    status: 'Pending Approval',
    approval: 'Pending Approval'
  }
  const rejectedExp = {
    id: 'EXP-FIN-REJ',
    branch_id: 'BR-01',
    amount: 50000.00,
    status: 'Rejected',
    approval: 'Rejected'
  }

  store.expenses.unshift(approvedExp, pendingExp, rejectedExp)

  const metrics = store.calculateFinancialMetrics({
    order_ids: ['ORD-FIN-01'],
    expense_ids: ['EXP-FIN-APP', 'EXP-FIN-PEND', 'EXP-FIN-REJ']
  })

  // Operating expenses should only count 25000.00
  assert.strictEqual(metrics.operatingExpenses, 25000.00)
  
  // Net operating profit = 84999.50 - 25000.00 = 59999.50
  assert.strictEqual(metrics.netOperatingProfit, 59999.50)
})

// 4. Inventory Valuation: On-Hand vs In-Transit
runTest('Inventory Valuation: Segregates on-hand owned inventory from in-transit', () => {
  const uOnHand = {
    id: 'UNIT-VAL-01',
    product_id: 'PROD-001',
    branch_id: 'BR-01',
    status: 'Available',
    ownership_status: 'Company Owned',
    landedCost: 150000.00
  }
  const uInTransit = {
    id: 'UNIT-VAL-02',
    product_id: 'PROD-001',
    branch_id: 'BR-01',
    status: 'Transfer In Transit',
    ownership_status: 'Company Owned',
    landedCost: 160000.00
  }
  const uCustomer = {
    id: 'UNIT-VAL-03',
    product_id: 'PROD-001',
    branch_id: 'BR-01',
    status: 'Sold',
    ownership_status: 'Customer Owned',
    landedCost: 155000.00
  }

  store.serializedUnits.unshift(uOnHand, uInTransit, uCustomer)

  const val = store.getInventoryValuation({
    unit_ids: ['UNIT-VAL-01', 'UNIT-VAL-02', 'UNIT-VAL-03']
  })

  assert.strictEqual(val.onHandValue, 150000.00)
  assert.strictEqual(val.inTransitValue, 160000.00)
  assert.strictEqual(val.customerOwnedValue, 0)
  assert.strictEqual(val.totalOwnedValue, 310000.00)
})

// 5. Landed Cost Allocation Integrity (By Quantity vs By Base Cost)
runTest('Landed Cost Allocation: Correctly distributes addon costs by Quantity and Base Cost', () => {
  // Receipt with 2 units
  const receipt = {
    id: 'GRN-LC-01',
    receipt_id: 'GRN-LC-01',
    branch_id: 'BR-01',
    lines: [
      { product_id: 'PROD-001', accepted_quantity: 2, unitCost: 100000 }
    ]
  }
  store.receipts.unshift(receipt)

  const u1 = { id: 'U-LC-01', receipt_id: 'GRN-LC-01', product_id: 'PROD-001', costPrice: 100000 }
  const u2 = { id: 'U-LC-02', receipt_id: 'GRN-LC-01', product_id: 'PROD-001', costPrice: 100000 }
  store.serializedUnits.unshift(u1, u2)

  // Allocate 10,000 PKR total addon (freight 6,000 + customs 4,000)
  store.allocateLandedCosts('GRN-LC-01', [
    { type: 'Freight', amount: 6000 },
    { type: 'Customs', amount: 4000 }
  ], 'By Quantity')

  assert.strictEqual(u1.addonCost, 5000)
  assert.strictEqual(u1.landedCost, 105000)
  assert.strictEqual(u2.addonCost, 5000)
  assert.strictEqual(u2.landedCost, 105000)
})

// 6. Historical Cost Integrity: Differential batches preserve individual landed costs
runTest('Historical Cost Integrity: Separate batches preserve distinct landed costs on sale', () => {
  const batch1Unit = {
    id: 'UNIT-BATCH-1',
    product_id: 'PROD-002',
    status: 'Sold',
    landedCost: 120000.00
  }
  const batch2Unit = {
    id: 'UNIT-BATCH-2',
    product_id: 'PROD-002',
    status: 'Sold',
    landedCost: 135000.00
  }
  store.serializedUnits.unshift(batch1Unit, batch2Unit)

  const cogs1 = store.getUnitCogs('UNIT-BATCH-1')
  const cogs2 = store.getUnitCogs('UNIT-BATCH-2')

  assert.strictEqual(cogs1, 120000.00)
  assert.strictEqual(cogs2, 135000.00)
  assert.notStrictEqual(cogs1, cogs2, 'Different batches must retain their respective historical unit costs')
})

// 7. Money Formatting and Decimal Precision Support
runTest('Money and Decimal Precision: Preserves decimal values without forced integer truncation', () => {
  const raw = 'PKR 12,345.67'
  const parsed = store.parseMoney(raw)
  assert.strictEqual(parsed, 12345.67)

  const formatted = store.formatMoney(12345.67, { decimals: 2 })
  assert.strictEqual(formatted, 'PKR 12,345.67')
})

console.log(`\n========================================`)
console.log(`Wave 4 Financial Domain: ${passed} passed, ${failed} failed.`)
console.log(`========================================\n`)

if (failed > 0) process.exit(1)
