const fs = require('fs');
const path = require('path');

const storePath = path.resolve(__dirname, '../src/store.js');
let code = fs.readFileSync(storePath, 'utf-8');

// updateInvoice
code = code.replace(
  /updateInvoice\(id,\s*updatedData\)\s*\{[\s\S]*?const index = this\.invoices\.findIndex\(i => i\.id === id \|\| i\.invoice === id \|\| i\.invoice_id === id \|\| i\.invoiceNo === id\)[\s\S]*?if \(index !== -1\) \{([\s\S]*?return this\.invoices\[index\][\s\S]*?)\}/,
  `updateInvoice(id, updatedData) {
    const index = this.invoices.findIndex(i => i.id === id || i.invoice === id || i.invoice_id === id || i.invoiceNo === id)
    if (index !== -1) {
      this.assertRecordMutationAccess('invoices', this.invoices[index], 'update')
      this.invoices[index] = { ...this.invoices[index], ...updatedData }
      return this.invoices[index]
    }`
);

// updatePayment
code = code.replace(
  /updatePayment\(id,\s*updatedData\)\s*\{[\s\S]*?const index = this\.payments\.findIndex\(p => p\.id === id \|\| p\.payment === id \|\| p\.payment_id === id \|\| p\.paymentNo === id\)[\s\S]*?if \(index !== -1\) \{([\s\S]*?return this\.payments\[index\][\s\S]*?)\}/,
  `updatePayment(id, updatedData) {
    const index = this.payments.findIndex(p => p.id === id || p.payment === id || p.payment_id === id || p.paymentNo === id)
    if (index !== -1) {
      this.assertRecordMutationAccess('payments', this.payments[index], 'update')
      this.payments[index] = { ...this.payments[index], ...updatedData }
      return this.payments[index]
    }`
);

// updateDelivery
code = code.replace(
  /updateDelivery\(id,\s*updatedData\)\s*\{[\s\S]*?const index = this\.deliveries\.findIndex\(d => d\.id === id \|\| d\.delivery === id \|\| d\.delivery_id === id\)[\s\S]*?if \(index !== -1\) \{([\s\S]*?return this\.deliveries\[index\][\s\S]*?)\}/,
  `updateDelivery(id, updatedData) {
    const index = this.deliveries.findIndex(d => d.id === id || d.delivery === id || d.delivery_id === id)
    if (index !== -1) {
      this.assertRecordMutationAccess('deliveries', this.deliveries[index], 'update')
      this.deliveries[index] = { ...this.deliveries[index], ...updatedData }
      return this.deliveries[index]
    }`
);

// updateSerializedUnit
code = code.replace(
  /updateSerializedUnit\(id,\s*updatedData\)\s*\{[\s\S]*?const index = this\.serializedUnits\.findIndex\(u => u\.id === id \|\| u\.unit_id === id \|\| u\.serial === id \|\| u\.vin === id \|\| u\.chassisNumber === id \|\| u\.chassis === id\)[\s\S]*?if \(index !== -1\) \{([\s\S]*?return this\.serializedUnits\[index\][\s\S]*?)\}/,
  `updateSerializedUnit(id, updatedData) {
    const index = this.serializedUnits.findIndex(u => u.id === id || u.unit_id === id || u.serial === id || u.vin === id || u.chassisNumber === id || u.chassis === id)
    if (index !== -1) {
      this.assertRecordMutationAccess('serializedUnits', this.serializedUnits[index], 'update')
      this.serializedUnits[index] = { ...this.serializedUnits[index], ...updatedData }
      return this.serializedUnits[index]
    }`
);

// updateStockRequest
code = code.replace(
  /updateStockRequest\(id,\s*updatedData\)\s*\{[\s\S]*?const index = this\.stockRequests\.findIndex\(s => s\.id === id \|\| s\.requestId === id \|\| s\.requestNo === id\)[\s\S]*?if \(index !== -1\) \{([\s\S]*?return this\.stockRequests\[index\][\s\S]*?)\}/,
  `updateStockRequest(id, updatedData) {
    const index = this.stockRequests.findIndex(s => s.id === id || s.requestId === id || s.requestNo === id)
    if (index !== -1) {
      this.assertRecordMutationAccess('stockRequests', this.stockRequests[index], 'update')
      this.stockRequests[index] = { ...this.stockRequests[index], ...updatedData }
      return this.stockRequests[index]
    }`
);

// approveStockRequest & rejectStockRequest
code = code.replace(
  /approveStockRequest\(id,\s*approvalData = \{\}\)\s*\{[\s\S]*?const req = this\.getStockRequestById\(id\)[\s\S]*?if \(!req\) throw new Error\(`Stock request \$\{id\} not found\.\`\)/,
  `approveStockRequest(id, approvalData = {}) {
    const req = this.stockRequests.find(s => s.id === id || s.requestId === id || s.requestNo === id)
    if (!req) throw new Error(\`Stock request \${id} not found.\`)
    this.assertRecordMutationAccess('stockRequests', req, 'approve')`
);

code = code.replace(
  /rejectStockRequest\(id,\s*reason = ''\)\s*\{[\s\S]*?const req = this\.getStockRequestById\(id\)[\s\S]*?if \(!req\) throw new Error\(`Stock request \$\{id\} not found\.\`\)/,
  `rejectStockRequest(id, reason = '') {
    const req = this.stockRequests.find(s => s.id === id || s.requestId === id || s.requestNo === id)
    if (!req) throw new Error(\`Stock request \${id} not found.\`)
    this.assertRecordMutationAccess('stockRequests', req, 'reject')`
);

// updateStockAdjustment
code = code.replace(
  /updateStockAdjustment\(id,\s*updatedData\)\s*\{[\s\S]*?const index = this\.stockAdjustments\.findIndex\(a => a\.id === id \|\| a\.adjustment_id === id \|\| a\.adjustmentNo === id\)[\s\S]*?if \(index !== -1\) \{([\s\S]*?return this\.stockAdjustments\[index\][\s\S]*?)\}/,
  `updateStockAdjustment(id, updatedData) {
    const index = this.stockAdjustments.findIndex(a => a.id === id || a.adjustment_id === id || a.adjustmentNo === id)
    if (index !== -1) {
      this.assertRecordMutationAccess('stockAdjustments', this.stockAdjustments[index], 'update')
      this.stockAdjustments[index] = { ...this.stockAdjustments[index], ...updatedData }
      return this.stockAdjustments[index]
    }`
);

// rejectStockAdjustment
code = code.replace(
  /rejectStockAdjustment\(id,\s*reason = ''\)\s*\{[\s\S]*?const adj = this\.getAdjustmentById\(id\)[\s\S]*?if \(!adj\) throw new Error\(`Adjustment \$\{id\} not found\.\`\)/,
  `rejectStockAdjustment(id, reason = '') {
    const adj = this.stockAdjustments.find(a => a.id === id || a.adjustment_id === id || a.adjustmentNo === id)
    if (!adj) throw new Error(\`Adjustment \${id} not found.\`)
    this.assertRecordMutationAccess('stockAdjustments', adj, 'reject')`
);

// updateQuotation
code = code.replace(
  /updateQuotation\(id,\s*updatedData\)\s*\{[\s\S]*?const index = this\.quotations\.findIndex\(q => q\.id === id \|\| q\.quote_id === id \|\| q\.quote === id\)[\s\S]*?if \(index !== -1\) \{([\s\S]*?return this\.quotations\[index\][\s\S]*?)\}/,
  `updateQuotation(id, updatedData) {
    const index = this.quotations.findIndex(q => q.id === id || q.quote_id === id || q.quote === id)
    if (index !== -1) {
      this.assertRecordMutationAccess('quotations', this.quotations[index], 'update')
      this.quotations[index] = { ...this.quotations[index], ...updatedData }
      return this.quotations[index]
    }`
);

// updateLead
code = code.replace(
  /updateLead\(id,\s*updatedData\)\s*\{[\s\S]*?const index = this\.leads\.findIndex\(l => l\.id === id \|\| l\.lead_id === id \|\| l\.leadNo === id\)[\s\S]*?if \(index !== -1\) \{([\s\S]*?return this\.leads\[index\][\s\S]*?)\}/,
  `updateLead(id, updatedData) {
    const index = this.leads.findIndex(l => l.id === id || l.lead_id === id || l.leadNo === id)
    if (index !== -1) {
      this.assertRecordMutationAccess('leads', this.leads[index], 'update')
      this.leads[index] = { ...this.leads[index], ...updatedData }
      return this.leads[index]
    }`
);

// updateCustomOrder
code = code.replace(
  /updateCustomOrder\(id,\s*updatedData\)\s*\{[\s\S]*?const index = this\.customOrders\.findIndex\(c => c\.id === id \|\| c\.orderNo === id\)[\s\S]*?if \(index !== -1\) \{([\s\S]*?return this\.customOrders\[index\][\s\S]*?)\}/,
  `updateCustomOrder(id, updatedData) {
    const index = this.customOrders.findIndex(c => c.id === id || c.orderNo === id)
    if (index !== -1) {
      this.assertRecordMutationAccess('customOrders', this.customOrders[index], 'update')
      this.customOrders[index] = { ...this.customOrders[index], ...updatedData }
      return this.customOrders[index]
    }`
);

// updateSalesReturn
code = code.replace(
  /updateSalesReturn\(id,\s*updatedData\)\s*\{[\s\S]*?const index = this\.salesReturns\.findIndex\(r => r\.id === id \|\| r\.returnNo === id\)[\s\S]*?if \(index !== -1\) \{([\s\S]*?return this\.salesReturns\[index\][\s\S]*?)\}/,
  `updateSalesReturn(id, updatedData) {
    const index = this.salesReturns.findIndex(r => r.id === id || r.returnNo === id)
    if (index !== -1) {
      this.assertRecordMutationAccess('salesReturns', this.salesReturns[index], 'update')
      this.salesReturns[index] = { ...this.salesReturns[index], ...updatedData }
      return this.salesReturns[index]
    }`
);

// updateCase
code = code.replace(
  /updateCase\(id,\s*updatedData\)\s*\{[\s\S]*?const index = this\.cases\.findIndex\(c => c\.id === id \|\| c\.caseId === id \|\| c\.case_id === id\)[\s\S]*?if \(index !== -1\) \{([\s\S]*?return this\.cases\[index\][\s\S]*?)\}/,
  `updateCase(id, updatedData) {
    const index = this.cases.findIndex(c => c.id === id || c.caseId === id || c.case_id === id)
    if (index !== -1) {
      this.assertRecordMutationAccess('cases', this.cases[index], 'update')
      this.cases[index] = { ...this.cases[index], ...updatedData }
      return this.cases[index]
    }`
);

// updateRepairJob
code = code.replace(
  /updateRepairJob\(id,\s*updatedData\)\s*\{[\s\S]*?const index = this\.repairs\.findIndex\(r => r\.id === id \|\| r\.jobId === id \|\| r\.repair_id === id\)[\s\S]*?if \(index !== -1\) \{([\s\S]*?return this\.repairs\[index\][\s\S]*?)\}/,
  `updateRepairJob(id, updatedData) {
    const index = this.repairs.findIndex(r => r.id === id || r.jobId === id || r.repair_id === id)
    if (index !== -1) {
      this.assertRecordMutationAccess('repairs', this.repairs[index], 'update')
      this.repairs[index] = { ...this.repairs[index], ...updatedData }
      return this.repairs[index]
    }`
);

// updatePurchaseOrder
code = code.replace(
  /updatePurchaseOrder\(id,\s*updatedData\)\s*\{[\s\S]*?const index = this\.purchaseOrders\.findIndex\(p => p\.id === id \|\| p\.po === id \|\| p\.po_id === id\)[\s\S]*?if \(index !== -1\) \{([\s\S]*?return this\.purchaseOrders\[index\][\s\S]*?)\}/,
  `updatePurchaseOrder(id, updatedData) {
    const index = this.purchaseOrders.findIndex(p => p.id === id || p.po === id || p.po_id === id)
    if (index !== -1) {
      this.assertRecordMutationAccess('purchaseOrders', this.purchaseOrders[index], 'update')
      this.purchaseOrders[index] = { ...this.purchaseOrders[index], ...updatedData }
      return this.purchaseOrders[index]
    }`
);

// updatePurchaseReturn
code = code.replace(
  /updatePurchaseReturn\(id,\s*updatedData\)\s*\{[\s\S]*?const index = this\.purchaseReturns\.findIndex\(r => r\.id === id \|\| r\.returnNo === id\)[\s\S]*?if \(index !== -1\) \{([\s\S]*?return this\.purchaseReturns\[index\][\s\S]*?)\}/,
  `updatePurchaseReturn(id, updatedData) {
    const index = this.purchaseReturns.findIndex(r => r.id === id || r.returnNo === id)
    if (index !== -1) {
      this.assertRecordMutationAccess('purchaseReturns', this.purchaseReturns[index], 'update')
      this.purchaseReturns[index] = { ...this.purchaseReturns[index], ...updatedData }
      return this.purchaseReturns[index]
    }`
);

// updateTransfer
code = code.replace(
  /updateTransfer\(id,\s*updatedData\)\s*\{[\s\S]*?const index = this\.transfers\.findIndex\(t => t\.id === id \|\| t\.transfer_id === id\)[\s\S]*?if \(index !== -1\) \{([\s\S]*?return this\.transfers\[index\][\s\S]*?)\}/,
  `updateTransfer(id, updatedData) {
    const index = this.transfers.findIndex(t => t.id === id || t.transfer_id === id)
    if (index !== -1) {
      this.assertRecordMutationAccess('transfers', this.transfers[index], 'update')
      this.transfers[index] = { ...this.transfers[index], ...updatedData }
      return this.transfers[index]
    }`
);

fs.writeFileSync(storePath, code);
console.log('Successfully patched all remaining mutations in store.js');
