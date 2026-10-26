/**
 * AJ ECODRIVE — WAVE 1 PRE-FIX FAILURE REGRESSION TEST
 * Demonstrates and records the baseline security, record identity, and fallback defects
 * before Wave 1 architectural remediation is applied.
 */

const fs = require('fs');
const path = require('path');

async function runPreFixTests() {
  console.log('=== RUNNING WAVE 1 PRE-FIX FAILURE VERIFICATION ===\n');
  const results = [];

  // Import reactive store
  const { store } = await import('../src/store.js');

  // Test 1: Foreign Branch Direct-Read via Getter succeeds before fix
  // Setup: Current user is Branch Manager of 'Islamabad'
  store.currentUser = {
    isAuthenticated: true,
    branchCode: 'ISB-01',
    branchName: 'Islamabad',
    role: 'Branch Manager',
    name: 'Tariq Mehmood',
    email: 'bm.isb@ajecodrive.com',
    isSuperAdmin: false
  };

  // Peshawar records exist in store (e.g., CUST-101, EXP-001, ORD-2241)
  const peshawarCustomer = store.customers.find(c => c.branch === 'Peshawar' || c.branch_id === 'BR-01');
  const readResult = store.getCustomerById(peshawarCustomer.id);
  const test1Vulnerable = (readResult !== null && readResult.id === peshawarCustomer.id);
  results.push({
    testId: 'PRE-SEC-001',
    category: 'foreign branch direct-read succeeds before fix',
    description: 'Islamabad BM directly reads Peshawar customer via store.getCustomerById',
    vulnerable: test1Vulnerable,
    outcome: test1Vulnerable ? 'CONFIRMED VULNERABLE: Cross-branch record returned without authorization check' : 'SECURE'
  });

  // Test 2: Foreign Branch Mutation succeeds before fix
  const peshawarExpense = store.expenses.find(e => e.branch === 'Peshawar');
  const originalAmount = peshawarExpense.amount;
  // Attempt unauthorized mutation by Islamabad BM
  const mutatedExpense = store.updateExpense(peshawarExpense.id, { amount: 'PKR 999,999' });
  const checkUpdated = store.expenses.find(e => e.id === peshawarExpense.id);
  const test2Vulnerable = (mutatedExpense !== null && checkUpdated.amount === 'PKR 999,999');
  // Revert for cleanliness
  store.updateExpense(peshawarExpense.id, { amount: originalAmount });
  results.push({
    testId: 'PRE-SEC-002',
    category: 'foreign branch mutation succeeds before fix',
    description: 'Islamabad BM directly mutates Peshawar expense via store.updateExpense',
    vulnerable: test2Vulnerable,
    outcome: test2Vulnerable ? 'CONFIRMED VULNERABLE: Cross-branch mutation succeeded without branch validation' : 'SECURE'
  });

  // Test 3: Invalid ID returns wrong first record (array[0] fallback)
  // PaymentDetail.vue line 17 returns store.payments[0] when id is not found or empty
  const paymentDetailSource = fs.readFileSync(path.resolve(__dirname, '../src/views/sales/PaymentDetail.vue'), 'utf-8');
  const hasPaymentArrayZeroFallback = paymentDetailSource.includes('store.payments[0]');
  results.push({
    testId: 'PRE-RECORD-001',
    category: 'invalid ID returns wrong first record',
    description: 'PaymentDetail resolves to store.payments[0] on missing/invalid ID',
    vulnerable: hasPaymentArrayZeroFallback,
    outcome: hasPaymentArrayZeroFallback ? 'CONFIRMED VULNERABLE: Silent fallback to store.payments[0]' : 'SECURE'
  });

  // Test 4: Invalid ID renders fabricated record
  // OrderDetail.vue lines 29-35 render 'Ahsan Khan', 'PKR 280,000', 'CH8-BRG-26-01882' when orderRecord is null
  const orderDetailSource = fs.readFileSync(path.resolve(__dirname, '../src/views/sales/OrderDetail.vue'), 'utf-8');
  const hasFabricatedOrderDetail = orderDetailSource.includes('Ahsan Khan') && orderDetailSource.includes('CH8-BRG-26-01882');
  results.push({
    testId: 'PRE-RECORD-002',
    category: 'invalid ID renders fabricated record',
    description: 'OrderDetail renders hardcoded fake record fixtures on null orderRecord',
    vulnerable: hasFabricatedOrderDetail,
    outcome: hasFabricatedOrderDetail ? 'CONFIRMED VULNERABLE: Fabricated customer name and chassis rendered' : 'SECURE'
  });

  // Test 5: Detail page lacks not-found behavior
  // CustomerDetail.vue line 42 has `|| all[0] || { name: 'Customer', ... }` instead of rendering a 404 state
  const customerDetailSource = fs.readFileSync(path.resolve(__dirname, '../src/views/sales/CustomerDetail.vue'), 'utf-8');
  const lacksNotFoundState = customerDetailSource.includes('all[0]') && !customerDetailSource.includes('NotFoundState');
  results.push({
    testId: 'PRE-RECORD-003',
    category: 'detail page lacks not-found behavior',
    description: 'CustomerDetail uses all[0] and mock fallback instead of NotFoundState component',
    vulnerable: lacksNotFoundState,
    outcome: lacksNotFoundState ? 'CONFIRMED VULNERABLE: Missing 404 / NotFoundState handling' : 'SECURE'
  });

  console.table(results);

  // Write pre-fix baseline evidence
  fs.mkdirSync(path.resolve(__dirname, '../scratch/forensic/final'), { recursive: true });
  fs.writeFileSync(
    path.resolve(__dirname, '../scratch/forensic/final/wave1_pre_fix_failures.json'),
    JSON.stringify(results, null, 2)
  );

  const allVulnerable = results.every(r => r.vulnerable);
  if (allVulnerable) {
    console.log('\n✓ ALL 5 PRE-FIX FAILURE MODES INDEPENDENTLY CONFIRMED VULNERABLE.');
    console.log('✓ Wave 1 baseline before-state successfully frozen.\n');
  } else {
    console.error('\n✗ Error: Some pre-fix failure tests did not reproduce expected vulnerability.');
    process.exit(1);
  }
}

runPreFixTests().catch(err => {
  console.error('Fatal error in pre-fix tests:', err);
  process.exit(1);
});
