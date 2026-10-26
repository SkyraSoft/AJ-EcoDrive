const fs = require('fs');
const content = fs.readFileSync('src/store.js', 'utf-8');

const getterNames = [
  'getCustomerById(id)',
  'getOrderById(id)',
  'getExpenseById(id)',
  'getPaymentById(id)',
  'getInvoiceById(id)',
  'getDeliveryById(id)',
  'getUnitById(id)',
  'getTransferById(id)',
  'getStockRequestById(id)',
  'getAdjustmentById(id)',
  'getQuotationById(id)',
  'getLeadById(id)',
  'getCustomOrderById(id)',
  'getSalesReturnById(id)',
  'getPurchaseOrderById(id)',
  'getPurchaseReturnById(id)',
  'getReceiptById(id)',
  'getCaseById(id)',
  'getRepairById(id)',
  'getWarrantyById(id)',
  'getConversationById(id)'
];

const lines = content.split(/\r?\n/);
getterNames.forEach(name => {
  const lineIdx = lines.findIndex(l => l.includes(name));
  if (lineIdx !== -1) {
    console.log(`=== ${name} at line ${lineIdx + 1} ===`);
    console.log(lines.slice(lineIdx, lineIdx + 12).join('\n'));
    console.log('');
  }
});
