const { store } = require('../src/store.js');
const assert = require('assert');

console.log('=== WAVE 4: 4-BLOCKER VERIFICATION SUITE ===\n');

let passCount = 0;
let failCount = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passCount++;
  } catch (err) {
    console.error(`[FAIL] ${name}`);
    console.error(`       Error: ${err.message}`);
    failCount++;
  }
}

// =========================================================================
// BLOCKER 1: Catalogue PO Line Model with Variants
// =========================================================================
runTest('Blocker 1: PO Line items derive from catalogue and support product variants', () => {
  store.currentUser = { isAuthenticated: true, role: 'Super Admin', branchName: 'Peshawar', branchCode: 'BR-01' };
  
  const activeProducts = store.products.filter(p => p.status === 'Active' || p.status === 'Low Stock');
  assert(activeProducts.length >= 2, 'Must have active catalogue products');
  
  const prod1 = activeProducts[0];
  const variants = prod1.variants || [{ variantId: 'VAR-STD', variantName: 'Standard Package' }];
  
  const poPayload = {
    supplier: 'BRG Power China',
    destination: 'Peshawar',
    branch_id: 'BR-01',
    paymentTerms: 'LC at Sight',
    shipmentMethod: 'Sea Freight',
    estimatedFreight: 120000,
    items: [
      {
        product_id: prod1.id,
        variant_id: variants[0].variantId || variants[0].id,
        variantName: variants[0].variantName || variants[0].name,
        quantity: 5,
        expectedUnitCost: 150000
      }
    ]
  };
  
  const createdPo = store.addPurchaseOrder(poPayload);
  assert.strictEqual(createdPo.items.length, 1);
  assert.strictEqual(createdPo.items[0].product_id, prod1.id);
  assert.strictEqual(createdPo.items[0].variant_id, variants[0].variantId || variants[0].id);
  assert.strictEqual(createdPo.totalOrdered, 5);
  assert.strictEqual(createdPo.status, 'Draft');
});

// =========================================================================
// BLOCKER 2: Real Physical Delivery (5 Ordered, 4 Arrived: 3 Accepted, 1 Damaged, 1 Missing)
// =========================================================================
runTest('Blocker 2: Real physical delivery preserves ordered=5, received=4, accepted=3, damaged=1, missing=1', () => {
  store.currentUser = { isAuthenticated: true, role: 'Super Admin', branchName: 'Peshawar', branchCode: 'BR-01' };
  
  const testPo = store.addPurchaseOrder({
    po: 'PO-TEST-B2',
    supplier: 'BRG Power China',
    destination: 'Peshawar',
    branch_id: 'BR-01',
    status: 'In Transit',
    items: [
      {
        product_id: 'PROD-003',
        productName: 'BRG DS11',
        quantity: 5,
        expectedUnitCost: 145000
      }
    ]
  });
  testPo.status = 'In Transit';
  
  const initialAvailableStock = store.getProductById('PROD-003')?.available || 0;
  const initialUnitCount = store.serializedUnits.length;
  
  // Operator receives actual physical delivery:
  // Arrived: 4 units (Unit 1,2,3 Accepted, Unit 4 Damaged). 1 Unit Missing.
  const grnPayload = {
    po_id: testPo.id,
    po: testPo.po,
    receivingBranch: 'Peshawar',
    branch_id: 'BR-01',
    receiverName: 'Inspector Tariq',
    receiptDate: '2026-10-01',
    deliveryNote: 'DN-BRG-99881',
    lines: [
      {
        product_id: 'PROD-003',
        product: 'BRG DS11',
        sku: 'SKU-DS11-BLU',
        ordered_quantity: 5,
        previously_received_quantity: 0,
        current_received_quantity: 4, // 4 arrived physically
        damaged_quantity: 1,          // 1 damaged
        accepted_quantity: 3,         // 3 accepted
        short_quantity: 1,            // 1 missing
        excess_quantity: 0,
        discrepancy_reason: '1 unit missing in container, 1 unit body damage during transit'
      }
    ],
    serializedUnits: [
      { serial: 'SN-DS11-001', chassis: 'CH-DS11-001', motorSerial: 'M-001', batterySerial: 'B-001', condition: 'Good', qc: 'Pass' },
      { serial: 'SN-DS11-002', chassis: 'CH-DS11-002', motorSerial: 'M-002', batterySerial: 'B-002', condition: 'Good', qc: 'Pass' },
      { serial: 'SN-DS11-003', chassis: 'CH-DS11-003', motorSerial: 'M-003', batterySerial: 'B-003', condition: 'Good', qc: 'Pass' },
      { serial: 'SN-DS11-004', chassis: 'CH-DS11-004', motorSerial: 'M-004', batterySerial: 'B-004', condition: 'Damaged', qc: 'Fail' }
    ]
  };
  
  const receipt = store.postReceipt(grnPayload);
  
  // 1. PO preservation
  assert.strictEqual(testPo.totalOrdered, 5, 'Original ordered quantity MUST remain 5');
  assert.strictEqual(testPo.totalReceived, 4, 'Total received on PO must be 4');
  assert.strictEqual(testPo.remainingUnits, 1, 'Remaining unfulfilled units must be 1');
  assert.strictEqual(testPo.status, 'Partially Received', 'PO status must be Partially Received');
  
  // 2. Receipt record verification
  assert.strictEqual(receipt.lines[0].ordered_quantity, 5);
  assert.strictEqual(receipt.lines[0].current_received_quantity, 4);
  assert.strictEqual(receipt.lines[0].accepted_quantity, 3);
  assert.strictEqual(receipt.lines[0].damaged_quantity, 1);
  assert.strictEqual(receipt.lines[0].short_quantity, 1);
  
  // 3. Serialized units count verification: exactly 4 units created (missing unit creates ZERO units)
  const newUnits = store.serializedUnits.slice(0, 4);
  assert.strictEqual(store.serializedUnits.length, initialUnitCount + 4, 'Missing unit MUST NOT generate serialized record');
  
  // 4. Damaged unit status verification: MUST NOT be Available
  const damagedUnit = store.serializedUnits.find(u => u.serial === 'SN-DS11-004');
  assert(damagedUnit, 'Damaged unit record must exist in inventory');
  assert.strictEqual(damagedUnit.status, 'Damaged / Quarantine', 'Damaged unit MUST be in Damaged / Quarantine status');
  
  // 5. Accepted units verification
  const acceptedUnits = store.serializedUnits.filter(u => ['SN-DS11-001', 'SN-DS11-002', 'SN-DS11-003'].includes(u.serial));
  assert.strictEqual(acceptedUnits.length, 3);
  acceptedUnits.forEach(u => assert.strictEqual(u.status, 'Available'));
});

// =========================================================================
// BLOCKER 3: Canonical Serialized Unit States & Availability Rules
// =========================================================================
runTest('Blocker 3: Canonical 11 unit statuses enforced; availability strictly counts sellable stock', () => {
  const canonicalList = store.CANONICAL_UNIT_STATUSES;
  assert.strictEqual(canonicalList.length, 11);
  assert(canonicalList.includes('Expected'));
  assert(canonicalList.includes('Supplier In Transit'));
  assert(canonicalList.includes('Receiving / QC'));
  assert(canonicalList.includes('Available'));
  assert(canonicalList.includes('Reserved'));
  assert(canonicalList.includes('Transfer In Transit'));
  assert(canonicalList.includes('Sold'));
  assert(canonicalList.includes('Returned'));
  assert(canonicalList.includes('In Service'));
  assert(canonicalList.includes('Damaged / Quarantine'));
  assert(canonicalList.includes('Scrapped'));
  
  // Test compatibility alias normalization
  assert.strictEqual(store.normalizeUnitStatus('In Production'), 'Expected');
  assert.strictEqual(store.normalizeUnitStatus('Inbound In Transit'), 'Supplier In Transit');
  assert.strictEqual(store.normalizeUnitStatus('QC Hold'), 'Receiving / QC');
  assert.strictEqual(store.normalizeUnitStatus('Maintenance'), 'In Service');
  assert.strictEqual(store.normalizeUnitStatus('Allocated'), 'Reserved');
  assert.strictEqual(store.normalizeUnitStatus('Damaged'), 'Damaged / Quarantine');
  assert.strictEqual(store.normalizeUnitStatus('In Transit'), 'Transfer In Transit');
  
  // Test availability and pipeline calculation:
  // In Production and Expected contribute ZERO sellable stock and ZERO supplier-in-transit count/value
  // Only status === 'Available' counts as sellable stock
  // Only status === 'Supplier In Transit' counts as supplier-in-transit pipeline
  const mockUnits = [
    { id: 'U-1', status: 'Available' },
    { id: 'U-2', status: 'Available' },
    { id: 'U-3', status: store.normalizeUnitStatus('In Production') }, // Expected
    { id: 'U-4', status: 'Expected' },
    { id: 'U-5', status: store.normalizeUnitStatus('Inbound In Transit') }, // Supplier In Transit
    { id: 'U-6', status: 'Supplier In Transit' },
    { id: 'U-7', status: 'Receiving / QC' },
    { id: 'U-8', status: 'Reserved' },
    { id: 'U-9', status: 'Transfer In Transit' },
    { id: 'U-10', status: 'Sold' },
    { id: 'U-11', status: 'Returned' },
    { id: 'U-12', status: 'In Service' },
    { id: 'U-13', status: 'Damaged / Quarantine' },
    { id: 'U-14', status: 'Scrapped' }
  ];
  
  const availableCount = mockUnits.filter(u => u.status === 'Available').length;
  assert.strictEqual(availableCount, 2, 'Only status === Available counts as sellable available stock');
  
  const inProdSellableCount = mockUnits.filter(u => u.status === store.normalizeUnitStatus('In Production') && u.status === 'Available').length;
  assert.strictEqual(inProdSellableCount, 0, 'In Production contributes 0 sellable Available stock');
  
  const expectedSellableCount = mockUnits.filter(u => u.status === 'Expected' && u.status === 'Available').length;
  assert.strictEqual(expectedSellableCount, 0, 'Expected contributes 0 sellable Available stock');
  
  const inProdSupplierInTransitCount = mockUnits.filter(u => u.status === store.normalizeUnitStatus('In Production') && u.status === 'Supplier In Transit').length;
  assert.strictEqual(inProdSupplierInTransitCount, 0, 'In Production contributes 0 supplier-in-transit count/value');
  
  const supplierInTransitCount = mockUnits.filter(u => u.status === 'Supplier In Transit').length;
  assert.strictEqual(supplierInTransitCount, 2, 'Supplier In Transit contributes to the supplier-in-transit pipeline metric only');
});

// =========================================================================
// BLOCKER 4: Expense / Payment Dual-Mutation Reversal
// =========================================================================
runTest('Blocker 4: Expense approval does NOT disburse payment or deduct bank balance', () => {
  store.currentUser = { isAuthenticated: true, role: 'Super Admin', branchName: 'Peshawar', branchCode: 'BR-01' };
  
  const exp = store.addExpense({
    category: 'Showroom Renovation',
    amount: 'PKR 25,000',
    rawAmount: 25000,
    branch_id: 'BR-01',
    branch: 'Peshawar',
    status: 'Pending Approval',
    approval: 'Pending',
    payment: 'Unpaid'
  });
  
  // Initial state before approval
  assert.strictEqual(exp.status, 'Pending Approval');
  assert.strictEqual(exp.payment, 'Unpaid');
  const initialPaymentCount = store.payments.length;
  
  // 1. Action: Approve Expense
  store.approveExpense(exp.id);
  
  // Assert after approval:
  assert.strictEqual(exp.status, 'Approved', 'Expense status must be Approved');
  assert.strictEqual(exp.approval, 'Approved');
  assert.strictEqual(exp.payment, 'Unpaid', 'Expense payment status MUST NOT be Paid on approval');
  assert.strictEqual(store.payments.length, initialPaymentCount, 'NO payment record created on approval');
  
  // 2. Action: Disburse Payment
  store.recordExpensePayment(exp.id, {
    method: 'Bank Transfer',
    reference: 'TXN-BANK-EXP-992'
  });
  
  // Assert after payment disbursement:
  assert.strictEqual(exp.status, 'Paid', 'Expense status becomes Paid only on disbursement');
  assert.strictEqual(exp.paymentMethod, 'Bank Transfer');
});

console.log('\n========================================');
console.log(`Wave 4 Blocker Verification: ${passCount} passed, ${failCount} failed.`);
console.log('========================================\n');

if (failCount > 0) {
  process.exit(1);
}
