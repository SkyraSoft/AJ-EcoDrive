import { store } from '../src/store.js'

console.log('=====================================================')
console.log('AJ ECODRIVE — CROSS-ENTITY VALIDATION TEST SUITE')
console.log('=====================================================\n')

let passed = 0
let failed = 0

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`)
    passed++
  } else {
    console.error(`[FAIL] ${message}`)
    failed++
  }
}

// TEST 1: Customer Cross-Check
console.log('\n--- TEST 1: Customer Cross-Check ---')
const testCust = store.addCustomer({
  name: 'Tariq Mehmood Test',
  phone: '+92 333 7788990',
  city: 'Peshawar',
  email: 'tariq.test@example.com'
})
assert(testCust.id && testCust.id.startsWith('CUST-'), `Customer created with ID ${testCust.id}`)
const fetchedCust = store.getCustomerById(testCust.id)
assert(fetchedCust && fetchedCust.name === 'Tariq Mehmood Test', `Customer fetched by ID matches name`)

store.updateCustomer(testCust.id, { city: 'Islamabad', phone: '+92 333 1111111' })
const updatedCust = store.getCustomerById(testCust.id)
assert(updatedCust.city === 'Islamabad' && updatedCust.phone === '+92 333 1111111', `Customer update verified across store`)

// TEST 2: Product Master Validation
console.log('\n--- TEST 2: Product Master Validation ---')
const prod = store.getProductById('PROD-001')
assert(prod && prod.name.includes('BRG E-125'), `Product PROD-001 retrieved correctly`)
store.updateProduct('PROD-001', { price: 'PKR 290,000' })
const updatedProd = store.getProductById('PROD-001')
assert(updatedProd.price === 'PKR 290,000', `Product price updated to PKR 290,000 in store`)

// TEST 3: Serialized Unit Lifecycle
console.log('\n--- TEST 3: Serialized Unit Lifecycle ---')
const unit = store.getUnitById('CHS-01882')
assert(unit && unit.chassisNo.includes('01882'), `Unit CHS-01882 retrieved correctly`)
assert(unit.product_id === 'PROD-002', `Unit product_id correctly references PROD-002`)
const unitProd = store.getProductById(unit.product_id)
assert(unitProd && unitProd.name.includes('BRG X7'), `Unit product_id resolves to BRG X7 in product master`)

// TEST 4: Branch Consistency
console.log('\n--- TEST 4: Branch Consistency ---')
const branches = store.branches
assert(branches.length >= 4, `Branch master has at least 4 branches (Count: ${branches.length})`)
const pewBranch = store.getBranchById('BR-01')
assert(pewBranch && pewBranch.name === 'Peshawar', `Branch BR-01 resolves to Peshawar`)
const branchOptions = store.getBranchOptions()
assert(branchOptions.length >= 4 && branchOptions.includes('Peshawar'), `Branch options helper returns active branches`)

// TEST 5: User & Role Alignment
console.log('\n--- TEST 5: User & Role Alignment ---')
const users = store.users
assert(users.length >= 5, `User master has at least 5 users (Count: ${users.length})`)
const techList = store.getTechnicians()
assert(techList.length >= 2, `getTechnicians() returns technicians (Count: ${techList.length})`)
const techPew = store.getTechnicians('Peshawar')
assert(techPew.length >= 1, `getTechnicians('Peshawar') returns branch technicians`)

// TEST 6: Procurement & Suppliers
console.log('\n--- TEST 6: Procurement & Suppliers ---')
const supplier = store.getSupplierById('SUP-01')
assert(supplier && supplier.name === 'BRG Factory', `Supplier SUP-01 resolves to BRG Factory`)
const po = store.getPurchaseOrderById('PO-2048')
assert(po && po.supplier_id === 'SUP-01', `PO-2048 references SUP-01`)
const poSup = store.getSupplierById(po.supplier_id)
assert(poSup && poSup.name === 'BRG Factory', `PO supplier_id resolves correctly to supplier master`)

// TEST 7: Finance & Expenses
console.log('\n--- TEST 7: Finance & Expenses ---')
const exp = store.getExpenseById('EXP-402')
assert(exp && exp.branch === 'Peshawar', `EXP-402 belongs to Peshawar branch`)
const newExp = store.addExpense({
  id: 'EXP-999',
  branch: 'Peshawar',
  category: 'Utilities',
  amount: 'PKR 15,000',
  vendor: 'PESCO'
})
assert(store.getExpenseById('EXP-999'), `Newly added expense retrieved by ID`)

// TEST 8: Custom Orders & Sales Returns
console.log('\n--- TEST 8: Custom Orders & Sales Returns ---')
const co = store.getCustomOrderById('CO-118')
assert(co && co.customer === 'Jawad Khan', `CO-118 retrieved with customer Jawad Khan`)
const sReturn = store.getSalesReturnById('RET-104')
assert(sReturn && sReturn.customer === 'Noman Ali', `RET-104 retrieved with customer Noman Ali`)

// TEST 9: After-Sales Cases & Repairs
console.log('\n--- TEST 9: After-Sales Cases & Repairs ---')
const scCase = store.getCaseById('SC-229')
assert(scCase && (scCase.customerName === 'Faisal Khan' || scCase.customerName === 'Ahsan Khan' || scCase.customer === 'Ahsan Khan'), `SC-229 references valid customer (${scCase?.customerName || scCase?.customer})`)
const rj = store.getRepairById('RJ-188')
assert(rj && rj.case_id === 'SC-229', `RJ-188 references SC-229`)

// TEST 10: Communications & Notifications
console.log('\n--- TEST 10: Communications & Notifications ---')
assert(store.conversations.length >= 2, `Conversations array populated in store (Count: ${store.conversations.length})`)
assert(store.notifications.length >= 4, `Notifications array populated in store (Count: ${store.notifications.length})`)

console.log(`\n=====================================================`)
console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`)
console.log(`=====================================================\n`)

if (failed > 0) {
  process.exit(1)
}
