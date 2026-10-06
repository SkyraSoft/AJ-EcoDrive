/**
 * AJ ECODRIVE — WAVE 5 OPERATIONAL TRUTH & INVENTORY KPI TEST
 * Master Artifact ID: 73158
 */

const assert = require('assert');
const { store } = require('../src/store.js');

console.log('--- STARTING TEST: WAVE 5 OPERATIONAL TRUTH ---');

// 1. Controlled Fixture Test for Inventory Status Separation
console.log('1. Testing controlled fixture for inventory status separation...');

// Backup existing serialized units
const originalUnits = [...store.serializedUnits];

// Create controlled fixture: exactly 1 unit in each key state for Peshawar branch
const testBranch = 'Peshawar';
const testBranchId = 'BR-01';
store.serializedUnits = [
  { id: 'U-01', unit_id: 'U-01', serial: 'SN-01', status: 'Available', branch_id: testBranchId, branch: testBranch, product: 'BRG X5' },
  { id: 'U-02', unit_id: 'U-02', serial: 'SN-02', status: 'Reserved', branch_id: testBranchId, branch: testBranch, product: 'BRG X5' },
  { id: 'U-03', unit_id: 'U-03', serial: 'SN-03', status: 'Supplier In Transit', branch_id: testBranchId, branch: testBranch, product: 'BRG X5' },
  { id: 'U-04', unit_id: 'U-04', serial: 'SN-04', status: 'Transfer In Transit', branch_id: testBranchId, branch: testBranch, product: 'BRG X5' },
  { id: 'U-05', unit_id: 'U-05', serial: 'SN-05', status: 'Receiving / QC', branch_id: testBranchId, branch: testBranch, product: 'BRG X5' },
  { id: 'U-06', unit_id: 'U-06', serial: 'SN-06', status: 'Damaged / Quarantine', branch_id: testBranchId, branch: testBranch, product: 'BRG X5' },
  { id: 'U-07', unit_id: 'U-07', serial: 'SN-07', status: 'Sold', branch_id: testBranchId, branch: testBranch, product: 'BRG X5' },
  { id: 'U-08', unit_id: 'U-08', serial: 'SN-08', status: 'Returned', branch_id: testBranchId, branch: testBranch, product: 'BRG X5' },
  { id: 'U-09', unit_id: 'U-09', serial: 'SN-09', status: 'In Service', branch_id: testBranchId, branch: testBranch, product: 'BRG X5' },
  { id: 'U-10', unit_id: 'U-10', serial: 'SN-10', status: 'Scrapped', branch_id: testBranchId, branch: testBranch, product: 'BRG X5' },
  { id: 'U-11', unit_id: 'U-11', serial: 'SN-11', status: 'Expected', branch_id: testBranchId, branch: testBranch, product: 'BRG X5' }
];

const stats = store.getInventoryStats(testBranch);

assert.strictEqual(stats.available, 1, 'Available must be exactly 1');
assert.strictEqual(stats.reserved, 1, 'Reserved must be exactly 1');
assert.strictEqual(stats.supplierInTransit, 1, 'Supplier In Transit must be exactly 1');
assert.strictEqual(stats.transferInTransit, 1, 'Transfer In Transit must be exactly 1');
assert.strictEqual(stats.receivingQc, 1, 'Receiving / QC must be exactly 1');
assert.strictEqual(stats.damagedQuarantine, 1, 'Damaged / Quarantine must be exactly 1');
assert.strictEqual(stats.sold, 1, 'Sold must be exactly 1');
assert.strictEqual(stats.returned, 1, 'Returned must be exactly 1');
assert.strictEqual(stats.inService, 1, 'In Service must be exactly 1');
assert.strictEqual(stats.scrapped, 1, 'Scrapped must be exactly 1');
assert.strictEqual(stats.expected, 1, 'Expected must be exactly 1');

// Available must NOT collapse other states
assert.notStrictEqual(stats.available, 11, 'Available must not include non-available stock');
console.log('  ✓ Controlled status separation verified');

// 2. Branch Scoping Test
console.log('2. Testing branch-scoped metric isolation...');
// Add a unit in Islamabad branch
store.serializedUnits.push({
  id: 'U-12', unit_id: 'U-12', serial: 'SN-12', status: 'Available', branch_id: 'BR-02', branch: 'Islamabad', product: 'BRG X7'
});

const peshawarStats = store.getInventoryStats('Peshawar');
const islamabadStats = store.getInventoryStats('Islamabad');
const allStats = store.getInventoryStats('All Branches');

assert.strictEqual(peshawarStats.available, 1, 'Peshawar available must remain 1');
assert.strictEqual(islamabadStats.available, 1, 'Islamabad available must be 1');
assert.strictEqual(allStats.available, 2, 'All branches available must be 2');
console.log('  ✓ Branch-scoped metrics properly isolated');

// 3. Zero State Test
console.log('3. Testing zero state behavior...');
const lahoreStats = store.getInventoryStats('Lahore');
assert.strictEqual(lahoreStats.available, 0, 'Lahore available must be 0');
assert.strictEqual(lahoreStats.reserved, 0, 'Lahore reserved must be 0');
assert.strictEqual(lahoreStats.totalUnits, 0, 'Lahore total units must be 0');
console.log('  ✓ Zero state returns honest 0 counts');

// 4. KPI ↔ Table Agreement Test
console.log('4. Testing KPI and table agreement...');
const matchingTableUnits = store.serializedUnits.filter(u => 
  u.branch === 'Peshawar' && u.status === 'Available'
);
assert.strictEqual(peshawarStats.available, matchingTableUnits.length, 'KPI available must equal table row count');
console.log('  ✓ KPI and table rows match exactly');

// 5. Reactive Mutation Test
console.log('5. Testing reactive domain mutations...');
// Business Event 1: Receive transferred unit (Transfer In Transit -> Available)
const transferUnit = store.serializedUnits.find(u => u.id === 'U-04');
transferUnit.status = 'Available';

const updatedStats1 = store.getInventoryStats('Peshawar');
assert.strictEqual(updatedStats1.transferInTransit, 0, 'Transfer in transit must decrease to 0');
assert.strictEqual(updatedStats1.available, 2, 'Available must increase to 2');

// Business Event 2: Reserve an available unit (Available -> Reserved)
const availUnit = store.serializedUnits.find(u => u.id === 'U-01');
availUnit.status = 'Reserved';

const updatedStats2 = store.getInventoryStats('Peshawar');
assert.strictEqual(updatedStats2.available, 1, 'Available must decrease to 1');
assert.strictEqual(updatedStats2.reserved, 2, 'Reserved must increase to 2');
console.log('  ✓ Domain mutations reactively update KPI statistics');

// 6. Blocker 1 Canonical Branch Identity Suite
console.log('6. Testing canonical branch identity invariants (Blocker 1)...');

// 6A. Normal Canonical Scope: BM branchId = BR-01
const br01Stats = store.getInventoryStats('BR-01');
assert.strictEqual(br01Stats.available, 1, 'BR-01 canonical scope must return 1 available unit');

// 6B. Branch Rename Test: Peshawar -> Peshawar Flagship
const origBranchObj = store.branches.find(b => b.id === 'BR-01' || b.branch_id === 'BR-01');
const origBranchName = origBranchObj.name;
origBranchObj.name = 'Peshawar Flagship';

// BM branchId remains BR-01
const renamedBranchStatsById = store.getInventoryStats('BR-01');
const renamedBranchStatsByName = store.getInventoryStats('Peshawar Flagship');
assert.strictEqual(renamedBranchStatsById.available, 1, 'Metric result remains identical when using canonical branchId BR-01 after rename');
assert.strictEqual(renamedBranchStatsByName.available, 1, 'Metric result resolves newly renamed branch name to canonical BR-01');

// Restore branch name
origBranchObj.name = origBranchName;

// 6C. Conflicting Display Name Test: Record has branch_id = BR-02, branch = Peshawar
store.serializedUnits.push({
  id: 'U-CONFLICT-01',
  unit_id: 'U-CONFLICT-01',
  serial: 'SN-CONF-01',
  status: 'Available',
  branch_id: 'BR-02',
  branch: 'Peshawar' // Conflict!
});

const br01ConflictStats = store.getInventoryStats('BR-01');
const br02ConflictStats = store.getInventoryStats('BR-02');

// Canonical branch_id wins: BR-01 must NOT count this unit, BR-02 MUST count it
assert.strictEqual(br01ConflictStats.available, 1, 'BR-01 Branch Manager must NOT count unit with foreign branch_id BR-02 despite matching branch string');
assert.strictEqual(br02ConflictStats.available, 2, 'BR-02 Branch Manager MUST count unit with canonical branch_id BR-02');
console.log('  ✓ Canonical branch_id wins over conflicting display name string');

// 6D. Missing Branch Identity Test: Fail Closed
const invalidBranchStats = store.getInventoryStats('NON_EXISTENT_BRANCH_UNKNOWN');
const nullBranchStats = store.getInventoryStats('');
assert.strictEqual(invalidBranchStats.available, 0, 'Unknown branch must fail closed to 0 count');
assert.strictEqual(invalidBranchStats.totalUnits, 0, 'Unknown branch must return 0 total units');
console.log('  ✓ Missing or invalid branch identity fails closed');

// Restore original serialized units
store.serializedUnits = originalUnits;

console.log('=== TEST PASSED: WAVE 5 OPERATIONAL TRUTH ===');
