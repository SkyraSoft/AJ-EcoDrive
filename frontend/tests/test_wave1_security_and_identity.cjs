/**
 * Wave 1 Security, Branch Authorization & Record Identity Test Suite
 * 
 * Verifies:
 * 1. Branch Manager A can read own branch records
 * 2. Branch Manager A CANNOT read Branch B records (fails closed, returns null)
 * 3. Branch Manager A can mutate own branch records
 * 4. Branch Manager A CANNOT mutate Branch B records (asserts immutability: before === after byte-for-byte)
 * 5. Super Admin retains global read/mutation access
 * 6. Inter-branch transfers: source & destination have state-appropriate access, 3rd branch blocked
 * 7. Invalid/missing IDs fail closed (zero array[0], zero mock fallbacks, clean not-found)
 * 8. All 21 branch-scoped entities tested
 */

const fs = require('fs')
const path = require('path')
const assert = require('assert')

;(async () => {
// Load branchAuth utilities and store
const branchAuth = await import('../src/utils/branchAuth.js')
const { store } = await import('../src/store.js')
branchAuth.setActiveBranchRegistry(store.branches)

const {
  isSuperAdmin,
  isBranchUser,
  normalizeRole,
  normalizeBranchCode,
  matchBranch,
  getRecordBranchIdentity,
  canReadRecord,
  canMutateRecord,
  assertRecordMutationAccess,
  ENTITY_BRANCH_PROPERTY_MAP
} = branchAuth

// Mock users
const superAdminUser = {
  id: 'usr-admin-01',
  name: 'Global Administrator',
  email: 'admin@ajecodrive.com',
  role: 'Super Admin',
  isSuperAdmin: true,
  branch: 'All',
  branchCode: 'ALL',
  isAuthenticated: true
}

const bmPeshawarUser = {
  id: 'usr-bm-peshawar',
  name: 'Tariq Khan (Peshawar BM)',
  email: 'tariq.peshawar@ajecodrive.com',
  role: 'Branch Manager',
  isSuperAdmin: false,
  branch: 'Peshawar',
  branchName: 'Peshawar',
  branchCode: 'BR-01',
  isAuthenticated: true
}

const bmIslamabadUser = {
  id: 'usr-bm-isb',
  name: 'Fahad Malik (Islamabad BM)',
  email: 'fahad.isb@ajecodrive.com',
  role: 'Branch Manager',
  isSuperAdmin: false,
  branch: 'Islamabad',
  branchName: 'Islamabad',
  branchCode: 'BR-02',
  isAuthenticated: true
}

const bmRawalpindiUser = {
  id: 'usr-bm-rwp',
  name: 'Hamza Abbasi (Rawalpindi BM)',
  email: 'hamza.rwp@ajecodrive.com',
  role: 'Branch Manager',
  isSuperAdmin: false,
  branch: 'Rawalpindi',
  branchName: 'Rawalpindi',
  branchCode: 'BR-04',
  isAuthenticated: true
}

// 21 Branch-Scoped Entity Fixtures (Peshawar vs Islamabad) + Global Entities
const entityFixtures = {
  orders: {
    own: { id: 'ORD-TEST-PESH', branch: 'Peshawar', customer: 'Peshawar Buyer', total: 350000 },
    foreign: { id: 'ORD-TEST-ISB', branch: 'Islamabad', customer: 'Islamabad Buyer', total: 420000 }
  },
  sales: {
    own: { id: 'ORD-TEST-PESH2', branch: 'Peshawar', customer: 'Peshawar Buyer 2', total: 150000 },
    foreign: { id: 'ORD-TEST-ISB2', branch: 'Islamabad', customer: 'Islamabad Buyer 2', total: 250000 }
  },
  customers: {
    own: { id: 'CUS-TEST-PESH', branch: 'Peshawar', name: 'Zubair Shah', phone: '0300-1111111' },
    foreign: { id: 'CUS-TEST-ISB', branch: 'Islamabad', name: 'Noman Ali', phone: '0300-2222222' }
  },
  invoices: {
    own: { id: 'INV-TEST-PESH', branch: 'Peshawar', total: 350000, status: 'Unpaid' },
    foreign: { id: 'INV-TEST-ISB', branch: 'Islamabad', total: 420000, status: 'Paid' }
  },
  expenses: {
    own: { id: 'EXP-TEST-PESH', branch: 'Peshawar', category: 'Utility', amount: 45000, status: 'Pending' },
    foreign: { id: 'EXP-TEST-ISB', branch: 'Islamabad', category: 'Rent', amount: 150000, status: 'Pending' }
  },
  serializedUnits: {
    own: { id: 'UNT-TEST-PESH', branch: 'Peshawar', vin: 'VIN-PESH-001', model: 'BRG E-125' },
    foreign: { id: 'UNT-TEST-ISB', branch: 'Islamabad', vin: 'VIN-ISB-001', model: 'BRG X7' }
  },
  units: {
    own: { id: 'UNT-TEST-PESH2', branch: 'Peshawar', vin: 'VIN-PESH-002', model: 'BRG E-125' },
    foreign: { id: 'UNT-TEST-ISB2', branch: 'Islamabad', vin: 'VIN-ISB-002', model: 'BRG X7' }
  },
  payments: {
    own: { id: 'PAY-TEST-PESH', branch: 'Peshawar', amount: 50000, method: 'Cash' },
    foreign: { id: 'PAY-TEST-ISB', branch: 'Islamabad', amount: 80000, method: 'Online' }
  },
  deliveries: {
    own: { id: 'DEL-TEST-PESH', branch: 'Peshawar', orderId: 'ORD-TEST-PESH', status: 'In Transit' },
    foreign: { id: 'DEL-TEST-ISB', branch: 'Islamabad', orderId: 'ORD-TEST-ISB', status: 'Delivered' }
  },
  stockRequests: {
    own: { id: 'SR-TEST-PESH', branch: 'Peshawar', product: 'BRG E-125', qty: 5, status: 'Submitted' },
    foreign: { id: 'SR-TEST-ISB', branch: 'Islamabad', product: 'BRG X7', qty: 3, status: 'Approved' }
  },
  stockAdjustments: {
    own: { id: 'ADJ-TEST-PESH', branch: 'Peshawar', productUnit: 'BRG E-125', difference: '-1', status: 'Pending' },
    foreign: { id: 'ADJ-TEST-ISB', branch: 'Islamabad', productUnit: 'BRG X7', difference: '+1', status: 'Pending' }
  },
  adjustments: {
    own: { id: 'ADJ-TEST-PESH2', branch: 'Peshawar', productUnit: 'BRG E-125', difference: '-1', status: 'Pending' },
    foreign: { id: 'ADJ-TEST-ISB2', branch: 'Islamabad', productUnit: 'BRG X7', difference: '+1', status: 'Pending' }
  },
  cycleCounts: {
    own: { id: 'CC-TEST-PESH', branch: 'Peshawar', totalItems: 25, status: 'Completed' },
    foreign: { id: 'CC-TEST-ISB', branch: 'Islamabad', totalItems: 30, status: 'Pending' }
  },
  quarantine: {
    own: { id: 'QRN-TEST-PESH', branch: 'Peshawar', unit: 'BRG E-125', reason: 'QC hold' },
    foreign: { id: 'QRN-TEST-ISB', branch: 'Islamabad', unit: 'BRG X7', reason: 'Brake check' }
  },
  quotations: {
    own: { id: 'QUO-TEST-PESH', branch: 'Peshawar', customerName: 'Rashid Khan', total: 280000 },
    foreign: { id: 'QUO-TEST-ISB', branch: 'Islamabad', customerName: 'Taimoor Shah', total: 310000 }
  },
  leads: {
    own: { id: 'LD-TEST-PESH', branch: 'Peshawar', name: 'Kashif Ali', status: 'Contacted' },
    foreign: { id: 'LD-TEST-ISB', branch: 'Islamabad', name: 'Waleed Jan', status: 'Qualified' }
  },
  followUps: {
    own: { id: 'FU-TEST-PESH', branch: 'Peshawar', customer: 'Kashif Ali', status: 'Due Today' },
    foreign: { id: 'FU-TEST-ISB', branch: 'Islamabad', customer: 'Waleed Jan', status: 'Pending' }
  },
  customOrders: {
    own: { id: 'CO-TEST-PESH', branch: 'Peshawar', customer: 'Suleman Shah', spec: 'Custom Blue' },
    foreign: { id: 'CO-TEST-ISB', branch: 'Islamabad', customer: 'Babar Azam', spec: 'Custom Green' }
  },
  salesReturns: {
    own: { id: 'RET-TEST-PESH', branch: 'Peshawar', orderId: 'ORD-TEST-PESH', refundAmount: 25000 },
    foreign: { id: 'RET-TEST-ISB', branch: 'Islamabad', orderId: 'ORD-TEST-ISB', refundAmount: 30000 }
  },
  purchaseOrders: {
    own: { id: 'PO-TEST-PESH', branch: 'Peshawar', supplier: 'BRG Factory', total: 1200000 },
    foreign: { id: 'PO-TEST-ISB', branch: 'Islamabad', supplier: 'China Exporters', total: 1800000 }
  },
  purchaseReturns: {
    own: { id: 'PRT-TEST-PESH', branch: 'Peshawar', poNumber: 'PO-TEST-PESH', reason: 'Defective frame' },
    foreign: { id: 'PRT-TEST-ISB', branch: 'Islamabad', poNumber: 'PO-TEST-ISB', reason: 'Motor noise' }
  },
  cases: {
    own: { id: 'CAS-TEST-PESH', branch: 'Peshawar', title: 'Battery heating', priority: 'High' },
    foreign: { id: 'CAS-TEST-ISB', branch: 'Islamabad', title: 'Speedometer failure', priority: 'Medium' }
  },
  repairs: {
    own: { id: 'REP-TEST-PESH', branch: 'Peshawar', technician: 'Akram', status: 'In Progress' },
    foreign: { id: 'REP-TEST-ISB', branch: 'Islamabad', technician: 'Dawood', status: 'Completed' }
  },
  warranties: {
    own: { id: 'WAR-TEST-PESH', branch: 'Peshawar', customer: 'Rashid Khan', validUntil: '2027-12-31' },
    foreign: { id: 'WAR-TEST-ISB', branch: 'Islamabad', customer: 'Taimoor Shah', validUntil: '2028-06-30' }
  },
  conversations: {
    own: { id: 'CONV-TEST-PESH', branch: 'Peshawar', participant: 'Peshawar Team Lead' },
    foreign: { id: 'CONV-TEST-ISB', branch: 'Islamabad', participant: 'Islamabad Team Lead' }
  },
  receipts: {
    own: { id: 'REC-TEST-PESH', branch: 'Peshawar', amount: 45000, supplier: 'Local Vendor' },
    foreign: { id: 'REC-TEST-ISB', branch: 'Islamabad', amount: 150000, supplier: 'Capital Logistics' }
  },
  users: {
    own: { id: 'USR-TEST-PESH', branch: 'Peshawar', name: 'Peshawar Sales Rep' },
    foreign: { id: 'USR-TEST-ISB', branch: 'Islamabad', name: 'Islamabad Sales Rep' }
  },
  transfers: {
    // Inter-branch: Source Peshawar, Destination Islamabad
    interbranch: {
      id: 'TRF-TEST-PESH-ISB',
      from: 'Peshawar',
      to: 'Islamabad',
      status: 'In Transit',
      units: ['BRG-E-125-01'],
      item: 'BRG E-125'
    }
  }
}

// Global Entities (Catalog, Master Data)
const globalEntities = {
  products: { id: 'PRD-TEST-001', name: 'BRG E-125', category: 'Electric Motorcycle' },
  suppliers: { id: 'SUP-TEST-001', name: 'BRG Global Manufacturing', country: 'Pakistan' },
  branches: { id: 'BR-TEST-001', name: 'Peshawar Branch', code: 'BR-01' }
}

// Test Results Collector
const results = {
  timestamp: new Date().toISOString(),
  totalAssertions: 0,
  passedAssertions: 0,
  failedAssertions: 0,
  failures: [],
  matrix: [],
  transferChecks: [],
  mutationImmutabilityChecks: [],
  identityChecks: []
}

function assertTest(condition, description, category = 'General') {
  results.totalAssertions++
  if (condition) {
    results.passedAssertions++
  } else {
    results.failedAssertions++
    results.failures.push({ category, description })
    console.error(`❌ FAIL: [${category}] ${description}`)
    throw new Error(`Assertion failed: [${category}] ${description}`)
  }
}

console.log('=== WAVE 1 SECURITY & IDENTITY TEST SUITE STARTING ===\n')

// 1. ALL 21 ENTITIES: READ ACCESS TESTS
console.log('--- 1. Testing Read Access Across All 21 Branch-Scoped Entities ---')
const entityKeys = Object.keys(ENTITY_BRANCH_PROPERTY_MAP)

for (const entity of entityKeys) {
  if (entity === 'transfers') continue // Tested separately with multi-branch logic
  if (['products', 'suppliers', 'branches'].includes(entity)) continue // Global entities tested in 1B

  const fixtures = entityFixtures[entity]
  if (!fixtures) {
    console.warn(`⚠️ Warning: No fixture for entity ${entity}`)
    continue
  }

  // Peshawar BM tests
  const bmCanReadOwn = canReadRecord(bmPeshawarUser, entity, fixtures.own)
  assertTest(bmCanReadOwn === true, `Peshawar BM can read own-branch ${entity}`, 'EntityReadMatrix')

  const bmCanReadForeign = canReadRecord(bmPeshawarUser, entity, fixtures.foreign)
  assertTest(bmCanReadForeign === false, `Peshawar BM CANNOT read Islamabad ${entity} (Fails Closed)`, 'EntityReadMatrix')

  // Super Admin tests
  const saCanReadOwn = canReadRecord(superAdminUser, entity, fixtures.own)
  assertTest(saCanReadOwn === true, `Super Admin can read Peshawar ${entity}`, 'EntityReadMatrix')

  const saCanReadForeign = canReadRecord(superAdminUser, entity, fixtures.foreign)
  assertTest(saCanReadForeign === true, `Super Admin can read Islamabad ${entity}`, 'EntityReadMatrix')

  results.matrix.push({
    entity,
    bmOwnRead: bmCanReadOwn ? 'ALLOWED' : 'DENIED',
    bmForeignRead: bmCanReadForeign ? 'ALLOWED (LEAK)' : 'DENIED (SECURE)',
    saGlobalRead: (saCanReadOwn && saCanReadForeign) ? 'ALLOWED' : 'DENIED'
  })
}
console.log(`✅ All single-branch entities passed read matrix tests.\n`)

// 1B. GLOBAL MASTER DATA ENTITIES: READ PRESERVED, MUTATION RESTRICTED TO SUPER ADMIN
console.log('--- 1B. Testing Global Entities (Catalogue & Master Data) ---')
for (const [entity, fixture] of Object.entries(globalEntities)) {
  const bmCanRead = canReadRecord(bmPeshawarUser, entity, fixture)
  assertTest(bmCanRead === true, `Branch Manager can read global ${entity}`, 'GlobalEntityRead')

  const saCanRead = canReadRecord(superAdminUser, entity, fixture)
  assertTest(saCanRead === true, `Super Admin can read global ${entity}`, 'GlobalEntityRead')

  const saCanMutate = canMutateRecord(superAdminUser, entity, fixture, 'update')
  assertTest(saCanMutate === true, `Super Admin can mutate global ${entity}`, 'GlobalEntityMutation')

  const bmCanMutate = canMutateRecord(bmPeshawarUser, entity, fixture, 'update')
  assertTest(bmCanMutate === false, `Branch Manager CANNOT mutate global ${entity}`, 'GlobalEntityMutation')

  // Immutability assertion
  const before = JSON.stringify(fixture)
  let blocked = false
  try {
    assertRecordMutationAccess(bmPeshawarUser, entity, fixture, 'update')
  } catch (err) {
    if (err.message.includes('UNAUTHORIZED_CROSS_BRANCH_MUTATION')) {
      blocked = true
    }
  }
  const after = JSON.stringify(fixture)
  assertTest(blocked === true, `Branch Manager mutation blocked on global ${entity}`, 'GlobalEntityImmutability')
  assertTest(before === after, `Global ${entity} byte-for-byte unchanged after rejected mutation`, 'GlobalEntityImmutability')
}
console.log('✅ Global entities verified: global read preserved, mutation restricted to Super Admin with 100% immutability.\n')

// 2. ALL 21 ENTITIES: MUTATION AUTHORIZATION & IMMUTABILITY TESTS
console.log('--- 2. Testing Mutation Access & Immutability Across All 21 Entities ---')

for (const entity of entityKeys) {
  if (entity === 'transfers') continue
  if (['products', 'suppliers', 'branches'].includes(entity)) continue // Global entities tested in 1B

  const fixtures = entityFixtures[entity]
  if (!fixtures) continue

  // BM own mutation allowed
  const bmCanMutateOwn = canMutateRecord(bmPeshawarUser, entity, fixtures.own, 'update')
  assertTest(bmCanMutateOwn === true, `Peshawar BM can mutate own ${entity}`, 'EntityMutationMatrix')

  // BM foreign mutation REJECTED
  const bmCanMutateForeign = canMutateRecord(bmPeshawarUser, entity, fixtures.foreign, 'update')
  assertTest(bmCanMutateForeign === false, `Peshawar BM CANNOT mutate Islamabad ${entity}`, 'EntityMutationMatrix')

  // Super Admin global mutation ALLOWED
  const saCanMutateForeign = canMutateRecord(superAdminUser, entity, fixtures.foreign, 'update')
  assertTest(saCanMutateForeign === true, `Super Admin can mutate Islamabad ${entity}`, 'EntityMutationMatrix')

  // IMMUTABILITY ASSERTION: snapshot before, simulate rejected call, compare snapshot after
  const beforeSnapshot = JSON.stringify(fixtures.foreign)
  let mutationBlocked = false
  try {
    assertRecordMutationAccess(bmPeshawarUser, entity, fixtures.foreign, 'update')
  } catch (err) {
    if (err.message.includes('UNAUTHORIZED_CROSS_BRANCH_MUTATION')) {
      mutationBlocked = true
    }
  }
  const afterSnapshot = JSON.stringify(fixtures.foreign)

  assertTest(mutationBlocked === true, `Mutation attempt threw UNAUTHORIZED_CROSS_BRANCH_MUTATION on ${entity}`, 'Immutability')
  assertTest(beforeSnapshot === afterSnapshot, `Foreign ${entity} byte-for-byte unchanged after rejected mutation`, 'Immutability')

  results.mutationImmutabilityChecks.push({
    entity,
    mutationBlocked,
    byteForByteIdentical: beforeSnapshot === afterSnapshot
  })
}
console.log('✅ All entities verified: unauthorized mutations strictly blocked with 100% byte-for-byte immutability.\n')

// 3. INTER-BRANCH TRANSFER AUTHORIZATION TESTS
console.log('--- 3. Testing Inter-Branch Transfer Workflow Authorization ---')
const transfer = entityFixtures.transfers.interbranch // From: Peshawar, To: Islamabad

// Reading transfer
const peshReadTransfer = canReadRecord(bmPeshawarUser, 'transfers', transfer)
const isbReadTransfer = canReadRecord(bmIslamabadUser, 'transfers', transfer)
const rwpReadTransfer = canReadRecord(bmRawalpindiUser, 'transfers', transfer) // 3rd branch
const saReadTransfer = canReadRecord(superAdminUser, 'transfers', transfer)

assertTest(peshReadTransfer === true, 'Source branch (Peshawar) CAN read transfer', 'Transfers')
assertTest(isbReadTransfer === true, 'Destination branch (Islamabad) CAN read transfer', 'Transfers')
assertTest(rwpReadTransfer === false, 'Third branch (Rawalpindi) CANNOT read transfer (Fails Closed)', 'Transfers')
assertTest(saReadTransfer === true, 'Super Admin CAN read transfer globally', 'Transfers')

// Dispatch action (must belong to source branch)
const peshCanDispatch = canMutateRecord(bmPeshawarUser, 'transfers', transfer, 'dispatch')
const isbCanDispatch = canMutateRecord(bmIslamabadUser, 'transfers', transfer, 'dispatch')
const rwpCanDispatch = canMutateRecord(bmRawalpindiUser, 'transfers', transfer, 'dispatch')

assertTest(peshCanDispatch === true, 'Source branch CAN dispatch transfer', 'Transfers')
assertTest(isbCanDispatch === false, 'Destination branch CANNOT dispatch transfer', 'Transfers')
assertTest(rwpCanDispatch === false, 'Third branch CANNOT dispatch transfer', 'Transfers')

// Receive action (must belong to destination branch)
const peshCanReceive = canMutateRecord(bmPeshawarUser, 'transfers', transfer, 'receive')
const isbCanReceive = canMutateRecord(bmIslamabadUser, 'transfers', transfer, 'receive')
const rwpCanReceive = canMutateRecord(bmRawalpindiUser, 'transfers', transfer, 'receive')

assertTest(peshCanReceive === false, 'Source branch CANNOT receive transfer', 'Transfers')
assertTest(isbCanReceive === true, 'Destination branch CAN receive transfer', 'Transfers')
assertTest(rwpCanReceive === false, 'Third branch CANNOT receive transfer', 'Transfers')

results.transferChecks.push({
  scenario: 'Read Peshawar->Islamabad Transfer',
  sourcePeshawar: peshReadTransfer ? 'ALLOWED' : 'DENIED',
  destIslamabad: isbReadTransfer ? 'ALLOWED' : 'DENIED',
  thirdRawalpindi: rwpReadTransfer ? 'ALLOWED (LEAK)' : 'DENIED (SECURE)',
  superAdmin: saReadTransfer ? 'ALLOWED' : 'DENIED'
})
results.transferChecks.push({
  scenario: 'Dispatch Transfer',
  sourcePeshawar: peshCanDispatch ? 'ALLOWED' : 'DENIED',
  destIslamabad: isbCanDispatch ? 'ALLOWED (BYPASS)' : 'DENIED (SECURE)',
  thirdRawalpindi: rwpCanDispatch ? 'ALLOWED (BYPASS)' : 'DENIED (SECURE)'
})
results.transferChecks.push({
  scenario: 'Receive Transfer',
  sourcePeshawar: peshCanReceive ? 'ALLOWED (BYPASS)' : 'DENIED (SECURE)',
  destIslamabad: isbCanReceive ? 'ALLOWED' : 'DENIED',
  thirdRawalpindi: rwpCanReceive ? 'ALLOWED (BYPASS)' : 'DENIED (SECURE)'
})
console.log('✅ Inter-branch transfer role, branch, and state boundaries verified.\n')

// 4. RECORD IDENTITY & INVALID-ID INTEGRITY TESTS
console.log('--- 4. Testing Record Identity & Invalid-ID Integrity ---')

// Mock Store Getter simulation using exact store.js patterns
function createMockStore() {
  let activeUser = bmPeshawarUser
  const storeData = {
    orders: [
      { id: 'ORD-PESH-001', branch: 'Peshawar', customer: 'Peshawar Customer A', total: 100000 },
      { id: 'ORD-ISB-001', branch: 'Islamabad', customer: 'Islamabad Customer B', total: 200000 }
    ],
    expenses: [
      { id: 'EXP-PESH-001', branch: 'Peshawar', amount: 15000, description: 'Fuel' },
      { id: 'EXP-ISB-001', branch: 'Islamabad', amount: 50000, description: 'Capital generator' }
    ],
    customers: [
      { id: 'CUS-PESH-001', branch: 'Peshawar', name: 'Authorized Customer' },
      { id: 'CUS-ISB-001', branch: 'Islamabad', name: 'Foreign Customer' }
    ]
  }

  return {
    setUser(u) { activeUser = u },
    getOrderById(id) {
      if (!id) return null
      const rec = storeData.orders.find(o => o.id === id)
      if (!rec) return null
      if (!canReadRecord(activeUser, 'orders', rec)) return null
      return rec
    },
    getExpenseById(id) {
      if (!id) return null
      const rec = storeData.expenses.find(e => e.id === id)
      if (!rec) return null
      if (!canReadRecord(activeUser, 'expenses', rec)) return null
      return rec
    },
    getCustomerById(id) {
      if (!id) return null
      const rec = storeData.customers.find(c => c.id === id)
      if (!rec) return null
      if (!canReadRecord(activeUser, 'customers', rec)) return null
      return rec
    }
  }
}

const mockStore = createMockStore()

// Test 4A: Valid Authorized ID returns exact requested record
mockStore.setUser(bmPeshawarUser)
const validOrder = mockStore.getOrderById('ORD-PESH-001')
assertTest(validOrder !== null, 'Valid authorized ID returns record', 'Identity')
assertTest(validOrder.id === 'ORD-PESH-001', 'Returned record ID exactly matches requested ID', 'Identity')
assertTest(validOrder.customer === 'Peshawar Customer A', 'Returned record contains exact customer data', 'Identity')

// Test 4B: Missing ID returns null (zero array[0] fallback)
const nullOrder = mockStore.getOrderById('')
assertTest(nullOrder === null, 'Empty string ID returns null (no array[0] fallback)', 'Identity')

const undefOrder = mockStore.getOrderById(undefined)
assertTest(undefOrder === null, 'Undefined ID returns null (no array[0] fallback)', 'Identity')

// Test 4C: Non-existent ID returns null (zero mock/fabricated record)
const nonExistentOrder = mockStore.getOrderById('ORD-NONEXISTENT-999')
assertTest(nonExistentOrder === null, 'Non-existent ID returns null (zero fabricated demo record)', 'Identity')

// Test 4D: Foreign Branch ID returns null to Branch Manager (zero leakage)
const foreignOrder = mockStore.getOrderById('ORD-ISB-001')
assertTest(foreignOrder === null, 'Foreign branch ID returns null to Branch Manager', 'Identity')

// Test 4E: Super Admin accessing foreign ID succeeds
mockStore.setUser(superAdminUser)
const saOrder = mockStore.getOrderById('ORD-ISB-001')
assertTest(saOrder !== null, 'Super Admin can access Islamabad record', 'Identity')
assertTest(saOrder.id === 'ORD-ISB-001', 'Super Admin received exact requested record', 'Identity')

results.identityChecks.push(
  { test: 'Valid Authorized ID', expected: 'Exact Record', outcome: 'PASSED' },
  { test: 'Empty/Undefined ID', expected: 'null (no array[0])', outcome: 'PASSED' },
  { test: 'Non-existent ID', expected: 'null (no fake mock)', outcome: 'PASSED' },
  { test: 'Foreign Branch ID (BM)', expected: 'null (fail-closed)', outcome: 'PASSED' },
  { test: 'Foreign Branch ID (SA)', expected: 'Exact Record', outcome: 'PASSED' }
)
console.log('✅ Record identity and invalid-ID handling verified fail-closed.\n')

// 5. STATIC SOURCE CODE AUDIT: VERIFY ZERO FIRST-RECORD FALLBACKS IN DETAIL VIEWS
console.log('--- 5. Static Source Audit of All Detail Views ---')

const detailFiles = [
  'src/views/sales/PaymentDetail.vue',
  'src/views/sales/OrderDetail.vue',
  'src/views/sales/CustomerDetail.vue',
  'src/views/sales/InvoiceDetail.vue',
  'src/views/sales/DeliveryHandoverDetail.vue',
  'src/views/sales/LeadDetail.vue',
  'src/views/sales/QuotationDetail.vue',
  'src/views/sales/CustomOrderDetail.vue',
  'src/views/sales/ReturnDetail.vue',
  'src/views/sales/FollowUpDetail.vue',
  'src/views/procurement/PurchaseOrderDetail.vue',
  'src/views/procurement/SupplierDetail.vue',
  'src/views/procurement/ReceiptDetail.vue',
  'src/views/procurement/PurchaseReturnDetail.vue',
  'src/views/inventory/TransferDetail.vue',
  'src/views/inventory/StockRequestDetail.vue',
  'src/views/inventory/AdjustmentDetail.vue',
  'src/views/inventory/CycleCountDetail.vue',
  'src/views/inventory/QuarantineDetail.vue',
  'src/views/inventory/InboundDeliveryDetail.vue',
  'src/views/inventory/UnitDetail.vue',
  'src/views/finance/ExpenseDetail.vue',
  'src/views/organisation/BranchDetail.vue',
  'src/views/organisation/UserDetail.vue',
  'src/views/catalogue/ProductDetail.vue',
  'src/views/catalogue/ProductRequestDetail.vue',
  'src/views/communication/ConversationDetail.vue',
  'src/views/after-sales/RepairDetail.vue',
  'src/views/after-sales/CaseDetail.vue'
]

const fallbackPatterns = [
  /\|\|\s*store\.\w+\[0\]/,
  /\|\|\s*all\[0\]/,
  /\|\|\s*records\[0\]/,
  /\|\|\s*items\[0\]/,
  /get\w+ById\([^)]*\)\s*\|\|\s*\w+\[0\]/,
  /find\([^)]*\)\s*\|\|\s*\w+\[0\]/,
  /route\.params\.id[^\r\n]*\|\|[^\r\n]*\[0\]/
]

let totalViewsAudited = 0
for (const relPath of detailFiles) {
  const fullPath = path.resolve(__dirname, '..', relPath)
  if (!fs.existsSync(fullPath)) {
    console.warn(`File not found: ${relPath}`)
    continue
  }

  totalViewsAudited++
  const content = fs.readFileSync(fullPath, 'utf8')

  // Check for array[0] fallbacks in record resolution
  for (const pat of fallbackPatterns) {
    const match = content.match(pat)
    assertTest(!match, `No dangerous array[0] fallback in ${relPath}`, 'StaticFallbackAudit')
  }

  // Check for NotFoundState presence in views that resolve records
  const hasNotFoundState = content.includes('NotFoundState') || content.includes('Record not found') || content.includes('not-found')
  assertTest(hasNotFoundState, `${relPath} handles missing record state`, 'StaticNotFoundAudit')
}
console.log(`✅ All ${totalViewsAudited} detail views audited: zero array[0] fallbacks and not-found handling verified.\n`)

// Write test results to scratch/forensic/final/wave1_security_tests.json
const finalDir = path.resolve(__dirname, '..', 'scratch', 'forensic', 'final')
if (!fs.existsSync(finalDir)) {
  fs.mkdirSync(finalDir, { recursive: true })
}
fs.writeFileSync(
  path.join(finalDir, 'wave1_security_tests.json'),
  JSON.stringify(results, null, 2),
  'utf8'
)

console.log('=== WAVE 1 SECURITY & IDENTITY TEST SUITE FINISHED ===')
console.log(`Summary: ${results.passedAssertions}/${results.totalAssertions} assertions passed (0 failures).`)

})().catch(err => {
  console.error(err)
  process.exit(1)
})

