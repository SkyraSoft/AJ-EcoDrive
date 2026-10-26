/**
 * AJ ECODRIVE — WAVE 5 FINANCIAL KPI TRUTH TEST
 * Master Artifact ID: 73158
 */

const assert = require('assert');
const { store } = require('../src/store.js');

console.log('--- STARTING TEST: WAVE 5 FINANCIAL KPI TRUTH ---');

// 1. Verify store.calculateFinancialMetrics returns canonical Wave 4 structure
console.log('1. Testing canonical financial metrics contract...');
const metrics = store.calculateFinancialMetrics('All Branches');

assert(typeof metrics.netSales === 'number', 'netSales must be a number');
assert(typeof metrics.cogs === 'number', 'cogs must be a number');
assert(typeof metrics.grossProfit === 'number', 'grossProfit must be a number');
assert(typeof metrics.operatingExpenses === 'number', 'operatingExpenses must be a number');
assert(typeof metrics.netOperatingProfit === 'number', 'netOperatingProfit must be a number');
assert(typeof metrics.grossMarginPercent === 'number', 'grossMarginPercent must be a number');

// Gross Profit = Net Sales - COGS
assert.strictEqual(
  metrics.grossProfit, 
  metrics.netSales - metrics.cogs, 
  'Gross Profit must exactly equal Net Sales minus COGS'
);

// Net Operating Profit = Gross Profit - Operating Expenses
assert.strictEqual(
  metrics.netOperatingProfit, 
  metrics.grossProfit - metrics.operatingExpenses, 
  'Net Operating Profit must exactly equal Gross Profit minus Operating Expenses'
);
console.log('  ✓ Core financial formulas verified against Wave 4 canonical truth');

// 2. Controlled Financial Event Fixture
console.log('2. Testing controlled financial mutations...');
const origInvoices = [...store.invoices];
const origOrders = [...store.orders];
const origExpenses = [...store.expenses];
const origUnits = [...store.serializedUnits];
const origPOs = [...store.purchaseOrders];
const origProducts = [...store.products];
const origTransfers = [...store.transfers];
const origReturns = [...store.salesReturns];

// Set isolated state
store.orders = [
  { id: 'ORD-T01', order_id: 'ORD-T01', status: 'Completed', grossAmount: 300000, discount: 0, returnsAmount: 0, branch: 'Peshawar', branch_id: 'BR-01', unit_ids: ['U-T01'] }
];
store.invoices = [
  { id: 'INV-T01', invoiceNo: 'INV-T01', status: 'Paid', total: 300000, branch: 'Peshawar', branch_id: 'BR-01' }
];
store.serializedUnits = [
  { id: 'U-T01', unit_id: 'U-T01', serial: 'SN-T01', status: 'Sold', landedCost: 200000, branch: 'Peshawar', branch_id: 'BR-01' },
  { id: 'U-T02', unit_id: 'U-T02', serial: 'SN-T02', status: 'Available', landedCost: 180000, branch: 'Peshawar', branch_id: 'BR-01' }
];
store.expenses = [
  { id: 'EXP-T01', amount: '50,000', status: 'Approved', approval: 'Approved', branch: 'Peshawar', branch_id: 'BR-01' }
];
store.purchaseOrders = [];
store.products = [];
store.transfers = [];
store.salesReturns = [];

const peshawarFin = store.calculateFinancialMetrics({ branch_id: 'BR-01' });
assert.strictEqual(peshawarFin.netSales, 300000, 'Net Sales must be 300,000');
assert.strictEqual(peshawarFin.cogs, 200000, 'COGS must be 200,000 (sold unit landed cost only)');
assert.strictEqual(peshawarFin.grossProfit, 100000, 'Gross profit must be 100,000');
assert.strictEqual(peshawarFin.operatingExpenses, 50000, 'Operating expenses must be 50,000');
assert.strictEqual(peshawarFin.netOperatingProfit, 50000, 'Net Operating Profit must be 50,000');
assert.strictEqual(Math.round(peshawarFin.grossMarginPct * 10) / 10, 33.3, 'Gross margin % must be ~33.3%');

// Unsold units must NOT be in COGS or OpEx
assert.notStrictEqual(peshawarFin.cogs, 380000, 'Available unit landed cost must not be counted in COGS');
assert.notStrictEqual(peshawarFin.operatingExpenses, 230000, 'Purchased inventory must not be counted in operating expenses');

// Inventory valuation
const valuation = store.getInventoryValuation({ branch_id: 'BR-01' });
assert.strictEqual(valuation.onHandValue, 180000, 'Available unit valued at on-hand landed cost 180,000');
assert.strictEqual(valuation.totalOwnedValue, 180000, 'Total owned valuation is 180,000');
console.log('  ✓ Financial presentation accurately reflects Wave 4 rules');

// 3. Zero State Financials
console.log('3. Testing zero state financial reporting...');
store.orders = [];
store.invoices = [];
store.expenses = [];
store.serializedUnits = [];
store.purchaseOrders = [];
store.products = [];
store.transfers = [];
store.salesReturns = [];

const zeroFin = store.calculateFinancialMetrics({ branch_id: 'BR-01' });
assert.strictEqual(zeroFin.netSales, 0, 'Zero sales must be 0');
assert.strictEqual(zeroFin.cogs, 0, 'Zero cogs must be 0');
assert.strictEqual(zeroFin.grossProfit, 0, 'Zero gross profit must be 0');
assert.strictEqual(zeroFin.operatingExpenses, 0, 'Zero operating expenses must be 0');
assert.strictEqual(zeroFin.netOperatingProfit, 0, 'Zero net profit must be 0');
assert.strictEqual(zeroFin.grossMarginPct, 0, 'Zero margin % must be 0');
console.log('  ✓ Honest zero reporting on empty store');

// 4. Non-Finalized Sales Order Exclusion & Completed Sales State Machine
console.log('4. Testing non-finalized sales order exclusion & Completed Sales contract...');

// 4A. Test 9 individual lifecycle states against Completed Sales metric
const testLifecycleStates = [
  { status: 'Draft', expectedCompletedSales: 0 },
  { status: 'Confirmed', expectedCompletedSales: 0 },
  { status: 'Payment Pending', expectedCompletedSales: 0 },
  { status: 'Partially Paid', expectedCompletedSales: 0 },
  { status: 'Paid', expectedCompletedSales: 0 },
  { status: 'Reserved', expectedCompletedSales: 0 },
  { status: 'Ready for Handover', expectedCompletedSales: 0 },
  { status: 'Cancelled', expectedCompletedSales: 0 },
  { status: 'Completed', expectedCompletedSales: 1 }
];

testLifecycleStates.forEach(({ status, expectedCompletedSales }) => {
  store.orders = [
    { id: `ORD-${status.replace(/\s+/g, '-')}`, status, branch_id: 'BR-01', grossAmount: 250000 }
  ];
  const count = store.getCompletedSalesCount({ branch_id: 'BR-01' });
  assert.strictEqual(
    count, 
    expectedCompletedSales, 
    `Status '${status}' must yield exactly ${expectedCompletedSales} Completed Sales (Actual: ${count})`
  );
});
console.log('  ✓ 9-state lifecycle contract for Completed Sales verified (Draft..Ready for Handover = 0, Completed = 1)');

// 4B. Quotation Isolation Test
const origQuotes = [...store.quotations];
store.orders = [
  { id: 'ORD-CMP-01', status: 'Completed', branch_id: 'BR-01', grossAmount: 300000 }
];
store.quotations = [
  { id: 'QT-TEST-01', quote: 'QT-TEST-01', status: 'Approved', total: 'PKR 500,000', branch_id: 'BR-01' },
  { id: 'QT-TEST-02', quote: 'QT-TEST-02', status: 'Sent', total: 'PKR 300,000', branch_id: 'BR-01' }
];
const quoteIsolatedCount = store.getCompletedSalesCount({ branch_id: 'BR-01' });
assert.strictEqual(quoteIsolatedCount, 1, 'Quotations must never enter Completed Sales');
console.log('  ✓ Quotations strictly isolated from sales metrics');

// 4C. Collections Qualification Test (Collected vs Non-Collected Payment States)
const origPayments = [...store.payments];
store.payments = [
  { id: 'PAY-COL-01', status: 'Reconciled', rawAmount: 100000, branch_id: 'BR-01' },
  { id: 'PAY-COL-02', status: 'Completed', rawAmount: 50000, branch_id: 'BR-01' },
  { id: 'PAY-UNCOL-01', status: 'Draft', rawAmount: 20000, branch_id: 'BR-01' },
  { id: 'PAY-UNCOL-02', status: 'Pending', rawAmount: 30000, branch_id: 'BR-01' },
  { id: 'PAY-UNCOL-03', status: 'Failed', rawAmount: 15000, branch_id: 'BR-01' },
  { id: 'PAY-UNCOL-04', status: 'Cancelled', rawAmount: 40000, branch_id: 'BR-01' },
  { id: 'PAY-UNCOL-05', status: 'Reversed', rawAmount: 25000, branch_id: 'BR-01' }
];

const totalCollections = store.getCollections({ branch_id: 'BR-01' });
assert.strictEqual(totalCollections, 150000, 'Collections must count ONLY verified collected funds (100k + 50k = 150k), ignoring Draft/Pending/Failed/Cancelled/Reversed');
console.log('  ✓ Collections accurately qualifies only cleared funds');

// 4D. Outstanding Receivables Qualification Test (Issued vs Draft/Cancelled Invoices)
store.invoices = [
  { id: 'INV-REC-01', status: 'Unpaid', outstandingAmount: 120000, branch_id: 'BR-01' },
  { id: 'INV-REC-02', status: 'Partial', outstandingAmount: 80000, branch_id: 'BR-01' },
  { id: 'INV-REC-03', status: 'Paid', outstandingAmount: 0, branch_id: 'BR-01' },
  { id: 'INV-DRAFT-01', status: 'Draft', outstandingAmount: 50000, branch_id: 'BR-01' },
  { id: 'INV-CANC-01', status: 'Cancelled', outstandingAmount: 90000, branch_id: 'BR-01' },
  { id: 'INV-VOID-01', status: 'Void', outstandingAmount: 45000, branch_id: 'BR-01' }
];

const totalReceivables = store.getOutstandingReceivables({ branch_id: 'BR-01' });
assert.strictEqual(totalReceivables, 200000, 'Outstanding receivables must count ONLY issued active invoices (120k + 80k = 200k), ignoring Draft, Void, and Cancelled');
console.log('  ✓ Outstanding receivables accurately excludes unissued drafts and cancelled invoices');

// 4E. Net Sales and Financial Metrics Calculation
store.orders = [
  { id: 'ORD-COMPLETED', order_id: 'ORD-COMPLETED', status: 'Completed', grossAmount: 300000, discount: 10000, branch_id: 'BR-01' }
];
store.salesReturns = [
  { id: 'RET-01', status: 'Approved', refundAmount: 50000, branch_id: 'BR-01' }
];

const completedFin = store.calculateFinancialMetrics({ branch_id: 'BR-01' });
// Net Sales = 300,000 (Gross) - 10,000 (Discount) - 50,000 (Return) = 240,000
assert.strictEqual(completedFin.netSales, 240000, 'Realized Net Sales must equal Gross minus Discount minus Sales Returns');
console.log('  ✓ Realized Net Sales calculated correctly');

// Restore original collections
store.orders = origOrders;
store.invoices = origInvoices;
store.expenses = origExpenses;
store.serializedUnits = origUnits;
store.purchaseOrders = origPOs;
store.products = origProducts;
store.transfers = origTransfers;
store.salesReturns = origReturns;
store.quotations = origQuotes;
store.payments = origPayments;

console.log('=== TEST PASSED: WAVE 5 FINANCIAL KPI TRUTH ===');

