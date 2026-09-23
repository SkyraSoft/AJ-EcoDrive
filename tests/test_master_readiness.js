// AJ ECODRIVE — MASTER FRONTEND INTEGRATION & READINESS TEST SUITE
import { store } from '../src/store.js'

let totalTests = 0
let passedTests = 0

function assert(condition, message) {
  totalTests++
  if (condition) {
    passedTests++
    console.log(`  ✅ [PASS] ${message}`)
  } else {
    console.error(`  ❌ [FAIL] ${message}`)
    throw new Error(`Assertion failed: ${message}`)
  }
}

console.log('======================================================================')
console.log('AJ ECODRIVE — MASTER FRONTEND INTEGRATION & SYSTEM READINESS AUDIT')
console.log('======================================================================\n')

// ======================================================================
// PART 1: CANONICAL SETTINGS & CONFIGURATION INTEGRITY
// ======================================================================
console.log('--- PART 1: CANONICAL SETTINGS & CONFIGURATION INTEGRITY ---')

assert(store.settings && typeof store.settings === 'object', 'store.settings is reactive object')
assert(store.settings.company && store.settings.company.name === 'AJ EcoDrive Ltd', 'Canonical company legal name is AJ EcoDrive Ltd')
assert(store.settings.finance && store.settings.finance.currency === 'PKR', 'Canonical currency is PKR')
assert(store.settings.numbering && store.settings.numbering.orderPrefix === 'SO-', 'Order prefix defaults to SO-')
assert(store.settings.numbering.invoicePrefix === 'INV-', 'Invoice prefix defaults to INV-')
assert(store.settings.numbering.quotationPrefix === 'QT-', 'Quotation prefix defaults to QT-')

// Currency and Date formatting helpers
assert(store.formatCurrency(280000) === 'PKR 280,000', 'formatCurrency formats 280000 to "PKR 280,000"')
assert(store.formatCurrency('PKR 15,500') === 'PKR 15,500', 'formatCurrency handles string inputs')
assert(store.formatDate('2026-09-15') === '15 Sep 2026', 'formatDate formats ISO string to "15 Sep 2026"')

// Update Settings with validation
const updateRes = store.updateSettings('company', {
  name: 'AJ EcoDrive Pakistan Pvt Ltd',
  email: 'ops@ajecodrive.com.pk'
})
assert(updateRes.success === true, 'store.updateSettings succeeded for company')
assert(store.settings.company.name === 'AJ EcoDrive Pakistan Pvt Ltd', 'Company name mutated in canonical store')

// Settings validation check
let validationThrew = false
try {
  store.updateSettings('company', { name: '   ' })
} catch (e) {
  validationThrew = true
}
assert(validationThrew, 'store.updateSettings rejects empty company name')

// Custom numbering prefix propagation
store.updateSettings('numbering', { orderPrefix: 'AJ-SO-' })
assert(store.settings.numbering.orderPrefix === 'AJ-SO-', 'numbering.orderPrefix updated to AJ-SO-')
const customDocId = store.generateDocumentId('order')
assert(customDocId.startsWith('AJ-SO-'), `generateDocumentId('order') reflects custom prefix: ${customDocId}`)

// Verify Audit entry for Settings update
const settingsAudit = store.auditLogs.find(a => a.event_type === 'SETTINGS_UPDATED')
assert(!!settingsAudit, 'Settings update created audit log with event_type SETTINGS_UPDATED')

// Restore Settings Defaults without destroying transactional data
const initialCustomersCount = store.customers.length
const initialUnitsCount = store.serializedUnits.length
store.resetSettingsToDefault()
assert(store.settings.company.name === 'AJ EcoDrive Ltd', 'resetSettingsToDefault restored default company name')
assert(store.settings.numbering.orderPrefix === 'SO-', 'resetSettingsToDefault restored orderPrefix to SO-')
assert(store.customers.length === initialCustomersCount, 'resetSettingsToDefault PRESERVED customer records')
assert(store.serializedUnits.length === initialUnitsCount, 'resetSettingsToDefault PRESERVED serialized units')

// ======================================================================
// PART 2: USER PROFILE & PRIVILEGE PROTECTION
// ======================================================================
console.log('\n--- PART 2: USER PROFILE & PRIVILEGE PROTECTION ---')

// Set an active session
store.setSession({
  id: 'USR-02',
  name: 'Hamza Ali',
  email: 'hamza.ali@ajecodrive.com',
  role: 'Branch Manager',
  branchCode: 'PEW-01',
  branchName: 'Peshawar',
  isSuperAdmin: false
}, false)

assert(store.currentUser.role === 'Branch Manager', 'Current session role is Branch Manager')

// Attempt to self-escalate role via profile update
store.updateUserProfile({
  name: 'Hamza Ali Updated',
  email: 'hamza.updated@ajecodrive.com',
  phone: '+92 300 111 2233',
  role: 'Super Admin', // Malicious attempt to elevate privileges
  isSuperAdmin: true
})

assert(store.currentUser.name === 'Hamza Ali Updated', 'Profile name updated')
assert(store.currentUser.role === 'Branch Manager', 'User role protected from privilege elevation')
assert(store.currentUser.isSuperAdmin === false, 'isSuperAdmin flag protected from privilege elevation')

const profileAudit = store.auditLogs.find(a => a.event_type === 'USER_PROFILE_UPDATED')
assert(!!profileAudit, 'Profile update generated USER_PROFILE_UPDATED audit log')

// ======================================================================
// PART 3: MASTER BUSINESS JOURNEY 1 — PROCUREMENT
// ======================================================================
console.log('\n--- PART 3: MASTER BUSINESS JOURNEY 1 — PROCUREMENT ---')

// 1. Supplier
const supplier = store.suppliers[0]
assert(!!supplier, `Supplier exists: ${supplier.name} (${supplier.id})`)

// 2. Create Purchase Order
const newPO = store.addPurchaseOrder({
  supplier_id: supplier.id,
  supplier: supplier.name,
  branch: 'Peshawar',
  destination: 'Peshawar',
  branch_id: 'BR-01',
  deliveryDate: '2026-10-01',
  items: [
    { product_id: 'PROD-001', product: 'BRG E-125', ordered: 1, cost: 'PKR 210,000', subtotal: 'PKR 210,000', isSerialized: true }
  ],
  totalAmount: 'PKR 210,000',
  status: 'Pending Approval'
})

assert(newPO.id.startsWith('PO-'), `PO generated with valid ID: ${newPO.id}`)
assert(newPO.status === 'Pending Approval', 'PO status is Pending Approval')

// 3. Approve PO
store.setSession({ name: 'Admin', role: 'Super Admin', isSuperAdmin: true }, false)
store.approvePurchaseOrder(newPO.id)
assert(newPO.status === 'Approved', 'PO status transitioned to Approved')

// 4. Receive Purchase Order (GRN) with Serialized Unit
const initialProd1Stock = store.getProductById('PROD-001').stock
const initialTotalUnits = store.serializedUnits.length
const testVin = `TEST-VIN-PROC-${Date.now()}`

const receiptRes = store.postReceipt({
  receiptData: {
    po_id: newPO.id,
    po: newPO.id,
    received_by: 'Warehouse In-charge',
    receipt_date: '2026-09-22',
    lines: [
      { product_id: 'PROD-001', product: 'BRG E-125', orderedQty: 1, receivedQty: 1, acceptedQty: 1, rejectedQty: 0, cost: 210000, totalCost: 210000, isSerialized: true }
    ],
    serializedUnits: [
      { product_id: 'PROD-001', product: 'BRG E-125', vin: testVin, chassis: testVin, motorSerial: `MOT-${Date.now()}`, batterySerial: `BAT-${Date.now()}`, color: 'Green Metallic' }
    ]
  },
  updateInventory: true
})

assert(receiptRes.success === true, 'Receipt posted successfully')
assert(receiptRes.receipt.id.startsWith('GRN-') || receiptRes.receipt.id.startsWith('GR-'), `GRN ID generated: ${receiptRes.receipt.id}`)

// Verify PO status and received counts
assert(newPO.status === 'Fully Received', `PO status updated to Fully Received: ${newPO.status}`)
assert(newPO.totalReceived === 1, 'PO totalReceived is 1')
assert(newPO.remainingUnits === 0, 'PO remainingUnits is 0')

// Verify inventory reflection
const updatedProd1 = store.getProductById('PROD-001')
assert(parseInt(updatedProd1.stock) === parseInt(initialProd1Stock) + 1, `Product stock incremented by 1 (was ${initialProd1Stock}, now ${updatedProd1.stock})`)

// Verify serialized unit in inventory
const createdUnit = store.getUnitById(testVin)
assert(!!createdUnit, `Serialized unit created and searchable by VIN: ${testVin}`)
assert(createdUnit.status === 'Available', 'New serialized unit status is Available')
assert(createdUnit.branch === 'Peshawar', 'New serialized unit branch is Peshawar')
assert(store.serializedUnits.length === initialTotalUnits + 1, 'Total serialized units increased by 1')

// Verify Procurement Audit Log
const poAudit = store.auditLogs.find(a => a.entity_id === newPO.id && a.action === 'Approved')
assert(!!poAudit, `Audit log found for PO approval: ${newPO.id}`)

// ======================================================================
// PART 4: MASTER BUSINESS JOURNEY 2 — SALES & FULFILLMENT
// ======================================================================
console.log('\n--- PART 4: MASTER BUSINESS JOURNEY 2 — SALES & FULFILLMENT ---')

// 1. Lead Conversion to Customer
const testLead = store.addLead({
  customerName: 'Kashif Mehmood',
  phone: '+92 321 987 6543',
  email: 'kashif.mehmood@example.com',
  city: 'Peshawar',
  branch: 'Peshawar',
  modelOfInterest: 'BRG E-125',
  status: 'Qualified'
})

const customerResult = store.convertLeadToCustomer(testLead.id)
assert(customerResult.customer.name === 'Kashif Mehmood', 'Lead converted to customer Kashif Mehmood')
const canonicalCust = customerResult.customer
assert(canonicalCust.id.startsWith('CUST-'), `Customer ID generated: ${canonicalCust.id}`)

// 2. Create Quotation
const newQuote = store.addQuotation({
  customer: canonicalCust.name,
  customer_id: canonicalCust.id,
  branch: 'Peshawar',
  items: [{ product: 'BRG E-125', quantity: 1, sellingPrice: 280000, warranty: '2-Year OEM Warranty' }],
  discount: 10000,
  sellingPrice: 'PKR 280,000',
  total: 'PKR 270,000',
  status: 'Open'
})
assert(newQuote.id.startsWith('QT-'), `Quotation created with ID: ${newQuote.id}`)

// 3. Convert Quotation to Sales Order with Unit Reservation
const orderResult = store.convertQuotationToOrder(newQuote.id, {
  unitId: createdUnit.id,
  assignedSalesperson: 'Hamza Ali'
})
const convertedOrder = orderResult.order

assert(convertedOrder.id.startsWith('SO-') || convertedOrder.id.startsWith('ORD-'), `Sales Order created: ${convertedOrder.id}`)
assert(convertedOrder.customer_id === canonicalCust.id, 'Sales Order connected to same customer_id')
assert(convertedOrder.unit_id === createdUnit.id, 'Sales Order connected to reserved unit_id')

// Verify Unit state transitioned to Reserved
assert(createdUnit.status === 'Reserved', `Unit status transitioned to Reserved for order ${convertedOrder.id}`)
assert(createdUnit.reserved_for_order === convertedOrder.id, 'Unit reserved_for_order properly set')

// 4. Complete Unit Sale
store.completeSale(createdUnit.id, {
  customerId: canonicalCust.id,
  customerName: canonicalCust.name,
  orderId: convertedOrder.id
})
assert(createdUnit.status === 'Sold', 'Unit status transitioned to Sold')

// 5. Generate Invoice
const invoice = store.addInvoice({
  order_id: convertedOrder.id,
  customer_id: canonicalCust.id,
  customer: canonicalCust.name,
  branch: 'Peshawar',
  subtotal: 280000,
  discount: 10000,
  total: 270000,
  paidAmount: 0,
  outstandingAmount: 270000,
  status: 'Unpaid'
})
assert(invoice.id.startsWith('INV-'), `Invoice generated with ID: ${invoice.id}`)
assert(invoice.outstandingAmount === 270000, 'Invoice outstanding balance is 270,000')

// 6. Record Payments (Partial then Full)
store.recordInvoicePayment({
  invoiceId: invoice.id,
  amount: 150000,
  method: 'Bank Transfer',
  transactionRef: 'TXN-BANK-PARTIAL'
})
assert(invoice.paidAmount === 150000, 'Invoice paidAmount updated to 150,000')
assert(invoice.outstandingAmount === 120000, 'Invoice outstandingAmount updated to 120,000')
assert(invoice.status === 'Partial', 'Invoice status is Partial')

store.recordInvoicePayment({
  invoiceId: invoice.id,
  amount: 120000,
  method: 'Cash',
  transactionRef: 'TXN-CASH-FINAL'
})
assert(invoice.paidAmount === 270000, 'Invoice paidAmount updated to 270,000')
assert(invoice.outstandingAmount === 0, 'Invoice outstandingAmount settled to 0')
assert(invoice.status === 'Paid', 'Invoice status is Paid')

// 7. Delivery Handover & Ownership Transfer
const delivery = store.addDelivery({
  order_id: convertedOrder.id,
  customer_id: canonicalCust.id,
  customer: canonicalCust.name,
  unit_id: createdUnit.id,
  branch: 'Peshawar',
  status: 'Ready'
})
assert(delivery.id.startsWith('DEL-'), `Delivery record created: ${delivery.id}`)

store.completeDelivery(delivery.id, {
  deliveredDate: '2026-09-22',
  officer: 'Hamza Ali',
  notes: 'Vehicle handed over with 2 keys and charger.'
})

assert(delivery.status === 'Delivered', 'Delivery status is Delivered')
assert(createdUnit.status === 'Delivered', 'Unit status is Delivered')
assert(createdUnit.ownership_status === 'Customer Owned', 'Unit ownership_status is Customer Owned')
assert(createdUnit.customer_id === canonicalCust.id, 'Unit customer_id linked to customer')

// 8. Verify Ownership and Warranty activation
const ownership = store.ownerships.find(o => o.unit_id === createdUnit.unit_id || o.unit_id === createdUnit.id || o.customer_id === canonicalCust.id)
assert(!!ownership, `Ownership registered: ${ownership?.id} for customer ${ownership?.customer}`)

const warranty = store.warranties.find(w => w.unit_id === createdUnit.unit_id || w.unit_id === createdUnit.id || w.customer_id === canonicalCust.id)
assert(!!warranty, `2-Year Warranty registered: ${warranty?.id} with status ${warranty?.status}`)
assert(warranty?.customer_id === canonicalCust.id, 'Warranty customer_id matches customer')

// ======================================================================
// PART 5: MASTER BUSINESS JOURNEY 3 — AFTER-SALES SERVICE & REPAIR
// ======================================================================
console.log('\n--- PART 5: MASTER BUSINESS JOURNEY 3 — AFTER-SALES SERVICE & REPAIR ---')

// 1. Service Case Intake against under-warranty unit
const serviceCase = store.addCase({
  customer_id: canonicalCust.id,
  customer: canonicalCust.name,
  unit_id: createdUnit.id,
  warranty_id: warranty.id,
  branch: 'Peshawar',
  priority: 'High',
  type: 'Warranty Claim',
  category: 'Electrical',
  description: 'Throttle response stuttering at low speeds.'
})
assert(serviceCase.id.startsWith('SC-'), `Service case created: ${serviceCase.id}`)

// 2. Repair Job with Parts & Labour (Under 100% Warranty)
const repairJob = store.addRepairJob({
  case_id: serviceCase.id,
  caseId: serviceCase.id,
  customer_id: canonicalCust.id,
  customer: canonicalCust.name,
  unit_id: createdUnit.id,
  warranty_id: warranty.id,
  jobType: 'Warranty Repair',
  partsList: [
    { partNo: 'PRT-THROT-01', name: 'Electronic Throttle Assembly', qty: 1, unitCost: 4500, totalCost: 4500 }
  ],
  labourList: [
    { desc: 'Diagnostic & Throttle Replacement', hours: 1.5, rate: 1000, totalCost: 1500 }
  ],
  warrantyCoverageType: 'full',
  status: 'In Progress'
})

assert(repairJob.id.startsWith('RJ-'), `Repair job created: ${repairJob.id}`)
assert(repairJob.costSummary.rawSubtotal === 6000, 'Gross repair cost is 6,000 (4500 + 1500)')
assert(repairJob.costSummary.rawWarrantyCoverage === 6000, 'Warranty coverage is 100% (6,000)')
assert(repairJob.costSummary.rawCustomerPayable === 0, 'Customer payable is PKR 0 under warranty')

// Complete repair job
store.updateRepairStatus(repairJob.id, 'Completed')
assert(repairJob.status === 'Completed', 'Repair job status transitioned to Completed')

// 3. Post Paid Repair Job to Finance (Non-Warranty Customer Payable)
const paidRepairJob = store.addRepairJob({
  case_id: serviceCase.id,
  customer_id: canonicalCust.id,
  customer: canonicalCust.name,
  unit_id: createdUnit.id,
  jobType: 'Standard Repair',
  partsList: [
    { partNo: 'PRT-TYRE-01', name: 'Rear Tubeless Tyre', qty: 1, unitCost: 3500, totalCost: 3500 }
  ],
  labourList: [
    { desc: 'Tyre Fitment & Balancing', hours: 1, rate: 1000, totalCost: 1000 }
  ],
  warrantyCoverageType: 'none',
  status: 'Completed'
})

assert(paidRepairJob.costSummary.rawCustomerPayable === 4500, 'Non-warranty payable is 4,500')
const repInvRes = store.postRepairToFinance(paidRepairJob.id)
assert(repInvRes.success === true, 'postRepairToFinance returned success')
const repInv = repInvRes.invoice
assert(repInv.id.startsWith('INV-'), `Repair invoice posted to finance: ${repInv.id}`)
assert(repInv.rawTotal === 4500, 'Invoice rawTotal matches customer payable (4,500)')
assert(paidRepairJob.posted_to_finance === true, 'Repair job marked posted_to_finance')

// ======================================================================
// PART 6: MASTER BUSINESS JOURNEY 4 — INVENTORY TRANSFER
// ======================================================================
console.log('\n--- PART 6: MASTER BUSINESS JOURNEY 4 — INVENTORY TRANSFER ---')

// Pick an Available unit in Peshawar
const availUnit = store.serializedUnits.find(u => u.branch === 'Peshawar' && u.status === 'Available')
assert(!!availUnit, `Found Available unit in Peshawar: ${availUnit.id}`)
const transferVin = availUnit.vin || availUnit.chassis || availUnit.id
const initialSystemUnits = store.serializedUnits.length

// Create Transfer to Islamabad
const transfer = store.createTransfer({
  fromBranch: 'Peshawar',
  toBranch: 'Islamabad',
  unitsCount: 1,
  items: [{ product: availUnit.product || 'BRG DS11', requestedQty: 1, isSerialized: true, serials: [transferVin] }]
})
assert(transfer.id.startsWith('TR-'), `Transfer created: ${transfer.id}`)
assert(transfer.status === 'Approved' || transfer.status === 'Pending Approval' || transfer.status === 'Draft' || transfer.status === 'Pending', `Transfer status is valid: ${transfer.status}`)

// Dispatch Transfer
store.dispatchTransfer(transfer.id)
assert(transfer.status === 'In Transit', 'Transfer status is In Transit')
assert(availUnit.status === 'In Transit', 'Unit status is In Transit')

// Receive Transfer at Destination (Islamabad)
store.receiveTransfer(transfer.id, {
  receivedItems: [{ product: availUnit.product || 'BRG DS11', receivedQty: 1 }],
  notes: 'Received in good condition at Islamabad showroom.'
})
assert(transfer.status === 'Received', 'Transfer status is Received')
assert(availUnit.branch === 'Islamabad', `Unit branch moved to Islamabad: ${availUnit.branch}`)
assert(availUnit.status === 'Available', 'Unit status is restored to Available at new branch')
assert(store.serializedUnits.length === initialSystemUnits, 'NO duplicate unit created; total system units constant')

// ======================================================================
// PART 7: MASTER BUSINESS JOURNEY 5 — ADMINISTRATION & ROLE ENFORCEMENT
// ======================================================================
console.log('\n--- PART 7: MASTER BUSINESS JOURNEY 5 — ADMINISTRATION & ROLE ENFORCEMENT ---')

// 1. Create User
const newStaff = store.createUser({
  name: 'Tariq Mehmood',
  email: 'tariq.bm@ajecodrive.com',
  role: 'Branch Manager',
  branch: 'Islamabad',
  status: 'Active'
})
assert(newStaff.id.startsWith('USR-'), `User created: ${newStaff.id}`)

// 2. Set Session as Tariq (Islamabad Branch Manager)
store.setSession({
  id: newStaff.id,
  name: newStaff.name,
  email: newStaff.email,
  role: 'Branch Manager',
  branchCode: 'ISB-01',
  branchName: 'Islamabad',
  isSuperAdmin: false
}, false)

assert(store.isBranchUser() === true, 'User recognized as branch-scoped user')
assert(store.getActiveBranch() === 'Islamabad', 'Active branch is Islamabad')

// 3. Strict Branch Scoping Verification
assert(store.isBranchAllowed('Islamabad') === true, 'Islamabad record is allowed for Islamabad BM')
assert(store.isBranchAllowed('Peshawar') === false, 'Peshawar record is strictly BLOCKED for Islamabad BM')
assert(store.isBranchAllowed('All Branches') === true, 'Global broadcast/all branches is allowed')

// 4. Branch Options Scoping
const bmOptions = store.getBranchOptions()
assert(bmOptions.length === 1 && bmOptions[0] === 'Islamabad', 'getBranchOptions returns only own branch for BM')

// 5. Restore Super Admin
store.setSession({ name: 'Admin', role: 'Super Admin', isSuperAdmin: true }, false)
assert(store.isBranchUser() === false, 'Super admin recognized as non-branch-scoped')
assert(store.isBranchAllowed('Peshawar') === true, 'Super Admin can access Peshawar')
assert(store.isBranchAllowed('Islamabad') === true, 'Super Admin can access Islamabad')
assert(store.getBranchOptions().length > 1, 'Super Admin receives all branch options')

// ======================================================================
// PART 8: FINANCIAL RECONCILIATION & INTEGRITY
// ======================================================================
console.log('\n--- PART 8: FINANCIAL RECONCILIATION & INTEGRITY ---')

// Reconcile all invoices
store.invoices.forEach(inv => {
  const tot = typeof inv.total === 'number' ? inv.total : parseFloat(String(inv.total || inv.amount || '0').replace(/[^0-9.]/g, ''))
  const paid = inv.paidAmount !== undefined ? inv.paidAmount : 0
  const outstanding = inv.outstandingAmount !== undefined ? inv.outstandingAmount : Math.max(0, tot - paid)
  assert(paid + outstanding === tot, `Invoice ${inv.id}: paid (${paid}) + outstanding (${outstanding}) equals total (${tot})`)
})

// Overpayment prevention
let overpaymentBlocked = false
const openInv = store.invoices.find(i => i.status === 'Partial' || i.status === 'Unpaid')
if (openInv) {
  try {
    store.recordInvoicePayment({
      invoiceId: openInv.id,
      amount: 999999999, // Impossible amount
      method: 'Cash'
    })
  } catch (e) {
    overpaymentBlocked = true
  }
  assert(overpaymentBlocked, `Overpayment on invoice ${openInv.id} was strictly blocked by store validation`)
}

// ======================================================================
// PART 9: INVENTORY RECONCILIATION & INTEGRITY
// ======================================================================
console.log('\n--- PART 9: INVENTORY RECONCILIATION & INTEGRITY ---')

store.reconcileInventoryTotals()
const unitsByStatus = {}
store.serializedUnits.forEach(u => {
  unitsByStatus[u.status] = (unitsByStatus[u.status] || 0) + 1
})
console.log('  Serialized Units Status Breakdown:', unitsByStatus)
assert(unitsByStatus['Available'] > 0, 'Available units exist in system')
assert(unitsByStatus['Maintenance'] > 0 || unitsByStatus['Delivered'] > 0, 'Customer-owned / Maintenance units exist in system')

// VIN Duplicate Prevention
let vinDuplicateBlocked = false
try {
  store.addSerializedUnit({
    product_id: 'PROD-001',
    vin: testVin, // Already exists from earlier receipt
    chassis: testVin,
    branch: 'Peshawar'
  })
} catch (e) {
  vinDuplicateBlocked = true
}
assert(vinDuplicateBlocked, `Duplicate VIN ${testVin} was blocked from registration`)

// ======================================================================
// PART 10: NON-EXISTENT / GRACEFUL ERROR HANDLING
// ======================================================================
console.log('\n--- PART 10: NON-EXISTENT / GRACEFUL ERROR HANDLING ---')

assert(store.getCustomerById('NON-EXISTENT-ID') === null, 'getCustomerById returns null for unknown ID')
assert(store.getProductById('NON-EXISTENT-ID') === null, 'getProductById returns null for unknown ID')
assert(store.getUnitById('NON-EXISTENT-ID') === null, 'getUnitById returns null for unknown ID')
assert(store.getOrderById('NON-EXISTENT-ID') === null, 'getOrderById returns null for unknown ID')
assert(store.getInvoiceById('NON-EXISTENT-ID') === null, 'getInvoiceById returns null for unknown ID')
assert(store.getQuotationById('NON-EXISTENT-ID') === null, 'getQuotationById returns null for unknown ID')
assert(store.getPurchaseOrderById('NON-EXISTENT-ID') === null, 'getPurchaseOrderById returns null for unknown ID')
assert(store.getTransferById('NON-EXISTENT-ID') === null, 'getTransferById returns null for unknown ID')
assert(store.getAuditLogById('NON-EXISTENT-ID') === null, 'getAuditLogById returns null for unknown ID')

console.log('\n======================================================================')
console.log(`MASTER AUDIT & INTEGRATION TESTS FINISHED: ${passedTests}/${totalTests} PASSED`)
console.log('======================================================================\n')
