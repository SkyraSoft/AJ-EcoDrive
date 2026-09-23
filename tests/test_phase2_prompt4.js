// Automated Verification Script for Phase 2 / Prompt 4:
// Inventory, Serialized Units, Transfers, Stock Requests & Stock Adjustments

import { store } from '../src/store.js';

let passedCount = 0;
let totalCount = 0;

function assert(condition, message) {
  totalCount++;
  if (condition) {
    passedCount++;
    console.log(`[PASS] Test ${totalCount}: ${message}`);
  } else {
    console.error(`[FAIL] Test ${totalCount}: ${message}`);
    process.exitCode = 1;
  }
}

console.log('--- RUNNING PHASE 2 / PROMPT 4 VERIFICATION TESTS ---\n');

// TEST 1: Initial inventory state and non-conflicting serialized units across branches
assert(store.serializedUnits.length >= 8, 'Initial canonical serializedUnits populated with non-conflicting dataset');
const peshawarUnits = store.serializedUnits.filter(u => u.branch === 'Peshawar');
const islamabadUnits = store.serializedUnits.filter(u => u.branch === 'Islamabad');
const lahoreUnits = store.serializedUnits.filter(u => u.branch === 'Lahore');
assert(peshawarUnits.length > 0 && islamabadUnits.length > 0 && lahoreUnits.length > 0, 'Serialized units distributed properly across Peshawar, Islamabad, and Lahore');

// TEST 2: Duplicate serial validation across VIN, chassis, motor, and battery
const existingUnit = store.serializedUnits[0];
const motorVal = existingUnit.motorSerial || existingUnit.motorNumber;
const battVal = existingUnit.batterySerial || existingUnit.batteryNumber;
assert(store.isSerialDuplicate(existingUnit.vin, 'vin') === true, 'isSerialDuplicate catches existing VIN');
assert(store.isSerialDuplicate(existingUnit.chassis, 'chassis') === true, 'isSerialDuplicate catches existing chassis');
assert(store.isSerialDuplicate(motorVal, 'motorSerial') === true, 'isSerialDuplicate catches existing motorSerial');
assert(store.isSerialDuplicate(battVal, 'batterySerial') === true, 'isSerialDuplicate catches existing batterySerial');
assert(store.isSerialDuplicate('COMPLETELY-NEW-SERIAL-999', 'vin') === false, 'isSerialDuplicate accepts non-duplicate serial');

// TEST 3: Serialized unit status transitions & blocking direct transition to Sold
assert(store.canTransitionUnitStatus('Available', 'QC Hold') === true, 'Available -> QC Hold allowed');
assert(store.canTransitionUnitStatus('QC Hold', 'Available') === true, 'QC Hold -> Available allowed');
assert(store.canTransitionUnitStatus('Available', 'Maintenance') === true, 'Available -> Maintenance allowed');
assert(store.canTransitionUnitStatus('Available', 'Sold') === false, 'Direct manual transition to Sold blocked');
assert(store.canTransitionUnitStatus('QC Hold', 'Sold') === false, 'Direct manual transition from QC Hold to Sold blocked');

// TEST 4: Stock transfer creation with origin != destination validation & QC hold transfer rejection
try {
  store.addTransfer({
    from: 'Peshawar',
    to: 'Peshawar',
    product_id: 'PROD-003',
    units: 2
  });
  assert(false, 'Should throw on identical from and to branches');
} catch (e) {
  assert(true, 'Transfer creation rejects same origin and destination branch');
}

try {
  // DS11-01001 is on QC Hold - transferring it MUST be rejected
  store.addTransfer({
    from: 'Peshawar',
    to: 'Islamabad',
    product_id: 'PROD-003',
    units: 1,
    serials: ['DS11-01001']
  });
  assert(false, 'Should throw when transferring a unit on QC Hold');
} catch (e) {
  assert(true, 'Transfer creation properly rejects transferring units on QC Hold');
}

// TEST 5: Stock transfer creation & dispatch with Available unit
const availablePeshBefore = store.products.find(p => p.id === 'PROD-003').peshawar;
const newTransfer = store.addTransfer({
  id: 'TR-TEST-001',
  from: 'Peshawar',
  to: 'Islamabad',
  product_id: 'PROD-003',
  product: 'BRG DS11',
  sku: 'SKU-DS11-BLU',
  isSerialized: true,
  units: 1,
  serials: ['DS11-00997']
});
assert(newTransfer && newTransfer.id === 'TR-TEST-001', 'Transfer TR-TEST-001 created successfully');

store.dispatchTransfer('TR-TEST-001', 'Transporter Express');
const dispatchedTransfer = store.getTransferById('TR-TEST-001');
assert(dispatchedTransfer.status === 'In Transit', 'Transfer status changed to In Transit upon dispatch');

const transferredUnit = store.getUnitById('DS11-00997');
assert(transferredUnit.status === 'In Transit', 'Serialized unit status changed to In Transit upon transfer dispatch');

// TEST 6: Transfer receiving with full receipt & destination stock arrival
store.receiveTransfer({
  transferId: 'TR-TEST-001',
  receivedItems: [{ product_id: 'PROD-003', receivedQty: 1, damagedQty: 0 }],
  receiverName: 'Test Receiver'
});
const receivedTransfer = store.getTransferById('TR-TEST-001');
assert(receivedTransfer.status === 'Received', 'Transfer marked Received after full receipt');
const receivedUnit = store.getUnitById('DS11-00997');
assert(receivedUnit.status === 'Available' && receivedUnit.branch === 'Islamabad', 'Unit moved to Islamabad and set to Available');

// TEST 7: Partial transfer receipt & shortage / damage handling
const bulkProd = store.products.find(p => p.id === 'PROD-008'); // Ceramic Disc Brake Pads
const initialPeshBulk = bulkProd.peshawar;
const initialIslBulk = bulkProd.islamabad;

const bulkTransfer = store.addTransfer({
  id: 'TR-BULK-002',
  from: 'Peshawar',
  to: 'Islamabad',
  product_id: 'PROD-008',
  product: bulkProd.name,
  sku: bulkProd.sku,
  isSerialized: false,
  units: 10
});
store.dispatchTransfer('TR-BULK-002');
assert(store.getTransferById('TR-BULK-002').status === 'In Transit', 'Bulk transfer dispatched');

// Receive partial: 6 received (1 damaged), 4 remaining
store.receiveTransfer({
  transferId: 'TR-BULK-002',
  receivedItems: [{ product_id: 'PROD-008', receivedQty: 6, damagedQty: 1 }],
  receiverName: 'Islamabad Store Manager'
});
const partialTransfer = store.getTransferById('TR-BULK-002');
assert(partialTransfer.status === 'Partially Received', 'Transfer status marked Partially Received');
assert(partialTransfer.items[0].receivedQty === 6, 'Line item receivedQty updated to 6');
assert(partialTransfer.items[0].damagedQty === 1, 'Line item damagedQty updated to 1');

// TEST 8: Stock request creation and approval
const newRequest = store.addStockRequest({
  id: 'SR-TEST-001',
  branch: 'Peshawar',
  product: 'BRG EV-5',
  productId: 'PROD-001',
  qty: 2,
  priority: 'High',
  reason: 'Showroom stock depleted'
});
assert(newRequest && (newRequest.status === 'Pending' || newRequest.status === 'Pending Approval'), 'Stock request created with Pending status');

store.approveStockRequest('SR-TEST-001', { approvedBy: 'Super Admin HQ' });
const approvedRequest = store.getStockRequestById('SR-TEST-001');
assert(approvedRequest.status === 'Approved', 'Stock request status updated to Approved');
assert(approvedRequest.approvedBy === 'Super Admin HQ', 'Stock request approvedBy recorded');

// TEST 9: Stock adjustment lifecycle (Quantity adjustment)
const brakePad = store.products.find(p => p.id === 'PROD-008');
const brakePadPeshBefore = brakePad.peshawar;
const newAdj = store.addStockAdjustment({
  id: 'ADJ-TEST-001',
  branch: 'Peshawar',
  productUnit: brakePad.name,
  productId: brakePad.id,
  type: 'Quantity',
  existingState: String(brakePadPeshBefore),
  correctedState: String(brakePadPeshBefore - 2),
  difference: -2,
  reason: 'Cycle count shortage'
});
assert(newAdj.status === 'Pending', 'Adjustment created as Pending without immediate inventory alteration');

store.approveStockAdjustment('ADJ-TEST-001', 'HQ Auditor');
const approvedAdj = store.getAdjustmentById('ADJ-TEST-001');
assert(approvedAdj.status === 'Approved', 'Adjustment status changed to Approved');
assert(store.products.find(p => p.id === 'PROD-008').peshawar === brakePadPeshBefore - 2, 'Product branch inventory adjusted upon approval');

// TEST 10: Stock adjustment lifecycle (Unit Status correction)
const testUnit = store.serializedUnits.find(u => u.status === 'Available');
const unitBeforeStatus = testUnit.status;
const unitAdj = store.addStockAdjustment({
  id: 'ADJ-TEST-002',
  branch: testUnit.branch,
  productUnit: testUnit.serial,
  unitId: testUnit.id,
  type: 'Status',
  existingState: unitBeforeStatus,
  correctedState: 'QC Hold',
  reason: 'Scratch found during showroom audit'
});
store.approveStockAdjustment('ADJ-TEST-002', 'Branch Quality Officer');
const targetUnitAfter = store.getUnitById(testUnit.id);
assert(targetUnitAfter.status === 'QC Hold', 'Serialized unit status updated upon adjustment approval');

// TEST 11: Inventory Reconciliation across Views
store.reconcileInventoryTotals();
const peshawarStats = store.getInventoryStats('Peshawar');
const allStats = store.getInventoryStats('All Branches');
assert(allStats.total >= allStats.available + allStats.reserved + allStats.inTransit + allStats.qcHold, 'Reconciled global totals are mathematically consistent');
assert(peshawarStats.total > 0 && peshawarStats.available > 0, 'Branch stats calculate non-zero balances properly');

// TEST 12: Route ID lookup & not-found protection (no fallback to [0])
const nonExistentUnit = store.getUnitById('NON-EXISTENT-UNIT-999');
assert(!nonExistentUnit, 'store.getUnitById returns null/undefined for unknown ID without index 0 fallback');

const nonExistentTransfer = store.getTransferById('TR-NON-EXISTENT');
assert(!nonExistentTransfer, 'store.getTransferById returns null/undefined for unknown transfer ID');

const nonExistentRequest = store.getStockRequestById('SR-NON-EXISTENT');
assert(!nonExistentRequest, 'store.getStockRequestById returns null/undefined for unknown stock request ID');

const nonExistentAdjustment = store.getAdjustmentById('ADJ-NON-EXISTENT');
assert(!nonExistentAdjustment, 'store.getAdjustmentById returns null/undefined for unknown adjustment ID');

console.log(`\n--- ALL ${totalCount} TESTS COMPLETED: ${passedCount}/${totalCount} PASSED ---`);
