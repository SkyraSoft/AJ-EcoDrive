// scratch/test_phase3_prompt5.js
// Automated verification script for AJ ECODRIVE Phase 3 Prompt 5

import { store } from '../src/store.js'

console.log('=================================================================')
console.log('AJ ECODRIVE — PHASE 3 PROMPT 5: END-TO-END INTEGRATION TEST SUITE')
console.log('=================================================================\n')

let passed = 0
let failed = 0

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`)
    passed++
  } else {
    console.error(`  [FAIL] ${message}`)
    failed++
  }
}

// -------------------------------------------------------------
// PART 1: SEEDED REFERENCE DATA RECONCILIATION
// -------------------------------------------------------------
console.log('--- PART 1: Seeded Reference Data Coherence ---')

// 1.1 Customer CUST-101
const ahsan = store.customers.find(c => c.id === 'CUST-101')
assert(!!ahsan && ahsan.name === 'Ahsan Khan', 'Customer CUST-101 (Ahsan Khan) exists in store')

// 1.2 Sales Order ORD-2241
const ord2241 = store.getOrderById('ORD-2241')
assert(!!ord2241 && ord2241.customer_id === 'CUST-101', 'Order ORD-2241 is linked to CUST-101')
assert(ord2241.unit_id === 'CH 8-BRG-26-01731' || ord2241.unit_id === 'DS11-00997', `Order ORD-2241 links to unit: ${ord2241?.unit_id}`)

// 1.3 Invoice INV-2241
const inv2241 = store.getInvoiceById('INV-2241')
assert(!!inv2241 && inv2241.customer_id === 'CUST-101' && inv2241.order_id === 'ORD-2241', 'Invoice INV-2241 is linked to CUST-101 and ORD-2241')

// 1.4 Payment PAY-7791
const pay7791 = store.getPaymentById('PAY-7791')
assert(!!pay7791 && pay7791.invoice_id === 'INV-2241' && pay7791.customer_id === 'CUST-101', 'Payment PAY-7791 is linked to INV-2241 and CUST-101')

// 1.5 Unit CH 8-BRG-26-01731
const unit1731 = store.getUnitById('CH 8-BRG-26-01731') || store.getUnitById('DS11-00997')
assert(!!unit1731 && unit1731.customer_id === 'CUST-101', `Unit ${unit1731?.id} is registered to CUST-101`)

// 1.6 Delivery DEL-101
const del101 = store.getDeliveryById('DEL-101')
assert(!!del101 && del101.customer_id === 'CUST-101' && del101.order_id === 'ORD-2241', 'Delivery DEL-101 is linked to CUST-101 and ORD-2241')

// 1.7 Warranty WAR-101
const war101 = store.getWarrantyById('WAR-101')
assert(!!war101 && war101.customer_id === 'CUST-101', 'Warranty WAR-101 is linked to CUST-101')

// 1.8 Service Case SC-229
const sc229 = store.getCaseById('SC-229')
assert(!!sc229 && sc229.customer_id === 'CUST-101' && sc229.warranty_id === 'WAR-101', 'Service Case SC-229 is linked to CUST-101 and WAR-101')

// 1.9 Repair Job RJ-188
const rj188 = store.getRepairById('RJ-188')
assert(!!rj188 && rj188.case_id === 'SC-229' && rj188.customer_id === 'CUST-101', 'Repair Job RJ-188 is linked to SC-229 and CUST-101')

// -------------------------------------------------------------
// PART 2: 16-STEP END-TO-END POSITIVE INTEGRATION WORKFLOW
// -------------------------------------------------------------
console.log('\n--- PART 2: 16-Step Positive Lifecycle Workflow ---')

// Step 1: Lead creation & conversion
console.log('Step 1: Convert Lead to Customer...')
const newLead = store.addLead({
  name: 'Zubair Ahmed',
  phone: '+92 333 9988112',
  email: 'zubair.ahmed@example.com',
  city: 'Peshawar',
  branch: 'Peshawar'
})
const leadRes = store.convertLeadToCustomer(newLead.id)
const newCustomer = leadRes.customer
assert(!!newCustomer && newCustomer.id.startsWith('CUST-'), `Step 1 & 2: Customer created from Lead with ID ${newCustomer.id}`)

// Step 3: Quotation creation
console.log('Step 3: Create Quotation...')
const newQuote = store.createQuotation({
  customer_id: newCustomer.id,
  customerName: newCustomer.name,
  branch: 'Peshawar',
  items: [
    { id: 1, name: 'BRG E-Scooter V3', qty: 1, unitPrice: 250000, total: 250000 }
  ],
  subtotal: 250000,
  discount: 10000,
  netTotal: 240000
})
assert(!!newQuote && (newQuote.id.startsWith('QT-') || newQuote.id.startsWith('QUO-')), `Step 3: Quotation ${newQuote.id} created with netTotal PKR 240,000`)

// Step 4 & 5: Convert Quotation to Sales Order
console.log('Step 4 & 5: Convert Quotation to Sales Order...')
const orderRes = store.convertQuotationToOrder(newQuote.id)
assert(orderRes.success && orderRes.order, `Step 4: Quotation converted to Sales Order ${orderRes.order?.id}`)
const newOrder = orderRes.order
assert(newOrder.customer_id === newCustomer.id, `Step 5: Order linked to Customer ${newCustomer.id}`)
assert(newQuote.status === 'Converted' || newQuote.status === 'Accepted', 'Quotation marked as Converted/Accepted')

// Step 6: Find an available unit and Reserve it
console.log('Step 6: Unit Reservation...')
const availableUnit = store.serializedUnits.find(u => u.status === 'Available')
assert(!!availableUnit, `Found available unit: ${availableUnit?.serial || availableUnit?.id}`)
const reserveSuccess = store.reserveUnit(availableUnit.serial || availableUnit.id, newOrder.id, newCustomer.id)
assert(reserveSuccess, `Step 6: Unit ${availableUnit.serial} reserved for Order ${newOrder.id}`)
assert(availableUnit.status === 'Reserved' && (availableUnit.reserved_for_order === newOrder.id || availableUnit.order_id === newOrder.id), 'Unit status is now Reserved')

// Step 7: Sale execution
console.log('Step 7: Complete Unit Sale...')
const saleRes = store.completeUnitSale(availableUnit.serial || availableUnit.id, { orderId: newOrder.id, customerId: newCustomer.id })
assert(saleRes.success, `Step 7: Sale completed for unit ${availableUnit.serial}`)
assert(availableUnit.status === 'Sold' && availableUnit.customer_id === newCustomer.id, 'Unit status is now Sold and customer_id assigned')

// Step 8: Invoice verification / generation
console.log('Step 8: Invoice Generation...')
const newInv = store.addInvoice({
  order_id: newOrder.id,
  customer_id: newCustomer.id,
  customer: newCustomer.name,
  branch: 'Peshawar',
  total: 240000,
  items: newOrder.items
})
assert(!!newInv && newInv.id.startsWith('INV-'), `Step 8: Invoice ${newInv.id} created for PKR 240,000 (status: ${newInv.status})`)

// Step 9: Partial & Full Payment Settlement
console.log('Step 9: Payments (Partial then Full)...')
const payRes1 = store.recordInvoicePayment({
  invoiceId: newInv.id,
  amount: 140000,
  method: 'Bank Transfer',
  transactionRef: 'TXN-BANK-PARTIAL-01'
})
assert(newInv.paidAmount === 140000 && newInv.outstandingAmount === 100000, 'Partial payment recorded: PKR 140K paid, PKR 100K outstanding')
assert(newInv.status === 'Partial', 'Invoice status updated to Partial')

const payRes2 = store.recordInvoicePayment({
  invoiceId: newInv.id,
  amount: 100000,
  method: 'Cash',
  transactionRef: 'TXN-CASH-FULL-02'
})
assert(newInv.paidAmount === 240000 && newInv.outstandingAmount === 0, 'Full payment settled: PKR 240K paid, PKR 0 outstanding')
assert(newInv.status === 'Paid', 'Invoice status updated to Paid')

// Step 10, 11, 12: Delivery Handover, Ownership & Warranty Activation
console.log('Step 10, 11, 12: Delivery Handover, Ownership & Warranty...')
const newDelivery = store.addDelivery({
  order_id: newOrder.id,
  customer_id: newCustomer.id,
  customer: newCustomer.name,
  unit_id: availableUnit.serial,
  unit: availableUnit.serial,
  branch: 'Peshawar',
  invoice_id: newInv.id
})
assert(!!newDelivery && newDelivery.id.startsWith('DEL-'), `Delivery record ${newDelivery.id} created`)

const deliveryRes = store.completeDelivery(newDelivery.id)
assert(deliveryRes.success, `Step 10: Delivery completed for ${newDelivery.id}`)
assert(availableUnit.status === 'Delivered', 'Unit status transitioned to Delivered')
assert(!!deliveryRes.ownership, `Step 11: Ownership record ${deliveryRes.ownership?.id} created`)
assert(!!deliveryRes.warranty, `Step 12: Warranty record ${deliveryRes.warranty?.id} activated`)

// Step 13: Service Case Intake
console.log('Step 13: Service Case Intake...')
const newCase = store.addCase({
  customer_id: newCustomer.id,
  customer: newCustomer.name,
  unit_id: availableUnit.serial,
  unit: availableUnit.serial,
  warranty_id: deliveryRes.warranty.id,
  issue: 'Motor high pitch whistling sound',
  branch: 'Peshawar'
})
assert(!!newCase && newCase.id.startsWith('SC-'), `Step 13: Service Case ${newCase.id} registered for unit ${availableUnit.serial}`)
assert(availableUnit.status === 'Maintenance', 'Unit status updated to Maintenance')

// Step 14 & 15: Repair Job, Parts/Labour & Cost Calculation
console.log('Step 14 & 15: Repair Job & Cost Calculation...')
const partsList = [
  { id: 1, part: 'Motor Bearing Kit', qty: 1, unitPrice: 8000, total: 8000 }
]
const labourList = [
  { id: 1, description: 'Motor disassembly & bearing swap', hours: 2, rate: 1500, total: 3000 }
]
const costCalc = store.calculateRepairCostSummary({
  partsList,
  labourList,
  warrantyCoverageType: 'OEM Full Coverage'
})
assert(costCalc.rawSubtotal === 11000, `Subtotal calculated: parts (8K) + labour (3K) = PKR ${costCalc.rawSubtotal}`)
assert(costCalc.rawWarrantyCoverage === 11000, 'Warranty coverage is 100% (PKR 11,000)')
assert(costCalc.rawCustomerPayable === 0, 'Customer payable is PKR 0')

const newRepair = store.addRepairJob({
  case_id: newCase.id,
  customer_id: newCustomer.id,
  customer: newCustomer.name,
  unit_id: availableUnit.serial,
  warranty_id: deliveryRes.warranty.id,
  partsList,
  labourList,
  costSummary: costCalc,
  status: 'In Progress',
  branch: 'Peshawar'
})
assert(!!newRepair && newRepair.id.startsWith('RJ-'), `Step 14 & 15: Repair Job ${newRepair.id} created`)

// Step 16: Post Repair to Finance
console.log('Step 16: Post Repair to Finance...')
// Test with a paid repair
const paidCostCalc = store.calculateRepairCostSummary({
  partsList: [{ id: 1, part: 'Custom Side Mirror', qty: 2, unitPrice: 2500, total: 5000 }],
  labourList: [{ id: 1, description: 'Installation', hours: 1, rate: 1500, total: 1500 }],
  warrantyCoverageType: 'Expired'
})
assert(paidCostCalc.rawCustomerPayable === 6500, `Non-warranty customer payable: PKR ${paidCostCalc.rawCustomerPayable}`)
newRepair.costSummary = paidCostCalc

const financeRes = store.postRepairToFinance(newRepair.id)
assert(financeRes.success && financeRes.invoice, `Step 16: Repair posted to finance as Invoice ${financeRes.invoice?.id}`)
assert(financeRes.invoice.source_type === 'Repair Job' && financeRes.invoice.rawAmount === 6500, 'Invoice generated with source_type Repair Job and PKR 6,500 payable')
assert(newRepair.posted_to_finance === true, 'Repair job marked as posted_to_finance')

// -------------------------------------------------------------
// PART 3: 7 NEGATIVE VALIDATION TESTS
// -------------------------------------------------------------
console.log('\n--- PART 3: 7 Negative Validation Tests ---')

// Neg 1: Customer Deletion Prevention
const custCheck = store.canDeleteCustomer(newCustomer.id)
assert(!custCheck.canDelete && custCheck.reasons.length > 0, `Neg 1: Deleting customer with active records prevented (${custCheck.reasons[0]})`)

// Neg 2: Selling already Sold/Delivered unit fails
const doubleSale = store.completeUnitSale(availableUnit.serial, 'CUST-999', 'ORD-999')
assert(!doubleSale.success, `Neg 2: Selling unit already in state '${availableUnit.status}' is rejected`)

// Neg 3: Reserving already Reserved/Sold/Delivered unit fails
let neg3Passed = false
try {
  store.reserveUnit(availableUnit.serial, 'ORD-999', 'CUST-999')
} catch (e) {
  neg3Passed = true
  assert(true, `Neg 3: Reserving unit in state '${availableUnit.status}' blocked with error: "${e.message}"`)
}
if (!neg3Passed) assert(false, 'Neg 3: Reserving unavailable unit was erroneously allowed')

// Neg 4: Payment exceeding invoice outstanding balance
let neg4Passed = false
try {
  store.recordInvoicePayment({
    invoiceId: financeRes.invoice.id,
    amount: 50000 // Balance is 6500
  })
} catch (e) {
  neg4Passed = true
  assert(true, `Neg 4: Overpayment blocked with error: "${e.message}"`)
}
if (!neg4Passed) assert(false, 'Neg 4: Overpayment was erroneously allowed')

// Neg 5: Payment on cancelled invoice throws error
const cancelInv = store.addInvoice({
  order_id: 'ORD-CANCEL-TEST',
  customer_id: 'CUST-101',
  customer: 'Ahsan Khan',
  total: 50000,
  status: 'Cancelled'
})
let neg5Passed = false
try {
  store.recordInvoicePayment({
    invoiceId: cancelInv.id,
    amount: 10000
  })
} catch (e) {
  neg5Passed = true
  assert(true, `Neg 5: Payment on cancelled invoice blocked with error: "${e.message}"`)
}
if (!neg5Passed) assert(false, 'Neg 5: Payment on cancelled invoice was erroneously allowed')

// Neg 6: Posting already posted repair job to finance fails
const rePost = store.postRepairToFinance(newRepair.id)
assert(!rePost.success, `Neg 6: Duplicate post to finance blocked with error: "${rePost.error}"`)

// Neg 7: Direct route-ID lookups for non-existent IDs return null
assert(store.getOrderById('ORD-NON-EXISTENT') === null, 'Neg 7a: getOrderById returns null on invalid ID')
assert(store.getInvoiceById('INV-NON-EXISTENT') === null, 'Neg 7b: getInvoiceById returns null on invalid ID')
assert(store.getDeliveryById('DEL-NON-EXISTENT') === null, 'Neg 7c: getDeliveryById returns null on invalid ID')
assert(store.getWarrantyById('WAR-NON-EXISTENT') === null, 'Neg 7d: getWarrantyById returns null on invalid ID')
assert(store.getCaseById('SC-NON-EXISTENT') === null, 'Neg 7e: getCaseById returns null on invalid ID')
assert(store.getRepairById('RJ-NON-EXISTENT') === null, 'Neg 7f: getRepairById returns null on invalid ID')

// -------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------
console.log('\n=============================================================')
console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`)
console.log('=============================================================\n')

if (failed > 0) {
  process.exit(1)
} else {
  console.log('ALL TESTS PASSED SUCCESSFULLY! PROMPT 5 INTEGRATION COMPLETE.')
}
