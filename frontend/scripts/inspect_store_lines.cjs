const fs = require('fs');
const content = fs.readFileSync('src/store.js', 'utf-8');
const lines = content.split('\n');

const mutations = [
  'updateExpense(id,',
  'approveExpense(id)',
  'rejectExpense(id,',
  'updateOrder(id,',
  'updateCustomer(id,',
  'deleteCustomer(customerId)',
  'updateInvoice(id,',
  'recordInvoicePayment({',
  'updatePayment(id,',
  'updateDelivery(id,',
  'completeDelivery(id,',
  'updateSerializedUnit(id,',
  'updateStockRequest(id,',
  'approveStockRequest(id,',
  'rejectStockRequest(id,',
  'updateStockAdjustment(id,',
  'approveStockAdjustment(id,',
  'rejectStockAdjustment(id,',
  'updateQuotation(id,',
  'updateLead(id,',
  'updateCustomOrder(id,',
  'updateSalesReturn(id,',
  'updateCase(id,',
  'updateRepairJob(id,',
  'updatePurchaseOrder(id,',
  'approvePurchaseOrder(id,',
  'rejectPurchaseOrder(id,',
  'updatePurchaseReturn(id,',
  'updateTransfer(id,'
];

mutations.forEach(t => {
  lines.forEach((line, idx) => {
    if (line.includes(t)) {
      console.log(t + ' found at line ' + (idx + 1));
    }
  });
});
