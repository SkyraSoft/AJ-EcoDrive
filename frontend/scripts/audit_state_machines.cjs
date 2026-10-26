const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const storeContent = fs.readFileSync(path.join(rootDir, 'src/store.js'), 'utf8');

// Entity status definitions observed in store seed data and methods
const entityStateModels = {
  purchaseOrders: {
    entity: 'PurchaseOrder',
    initialState: 'Draft / Pending Approval',
    observedStates: ['Draft', 'Pending Approval', 'Approved', 'Partially Received', 'Received', 'Cancelled'],
    terminalStates: ['Received', 'Cancelled'],
    transitions: [
      { from: 'Draft', to: 'Pending Approval', handler: 'CreatePurchaseOrder.vue handleSave()', role: 'Dealership Staff' },
      { from: 'Pending Approval', to: 'Approved', handler: 'PurchaseOrderDetail.vue approvePO()', role: 'Super Admin' },
      { from: 'Approved', to: 'Partially Received', handler: 'ReceivePurchase.vue receiveUnits()', role: 'Warehouse Staff' },
      { from: 'Partially Received', to: 'Received', handler: 'ReceivePurchase.vue receiveUnits()', role: 'Warehouse Staff' },
      { from: 'Approved', to: 'Received', handler: 'ReceivePurchase.vue receiveUnits()', role: 'Warehouse Staff' },
      { from: 'Pending Approval', to: 'Cancelled', handler: 'PurchaseOrderDetail.vue cancelPO()', role: 'Super Admin' }
    ]
  },
  serializedUnits: {
    entity: 'SerializedUnit',
    initialState: 'In Transit',
    observedStates: ['In Transit', 'In Stock', 'Reserved', 'Sold', 'Delivered', 'In Repair', 'Quarantine', 'Returned'],
    terminalStates: ['Delivered', 'Returned'],
    transitions: [
      { from: 'In Transit', to: 'In Stock', handler: 'store.receivePurchaseOrder() / store.receiveInboundDelivery()', role: 'Warehouse Staff' },
      { from: 'In Stock', to: 'Reserved', handler: 'store.addQuotation() / store.addCustomOrder()', role: 'Sales Executive' },
      { from: 'Reserved', to: 'Sold', handler: 'store.completeUnitSale()', role: 'Cashier / Sales Executive' },
      { from: 'In Stock', to: 'Sold', handler: 'store.completeUnitSale()', role: 'Cashier / Sales Executive' },
      { from: 'Sold', to: 'Delivered', handler: 'store.completeDelivery()', role: 'Delivery Officer' },
      { from: 'In Stock', to: 'Quarantine', handler: 'store.addQuarantineRecord()', role: 'Quality Inspector' },
      { from: 'In Stock', to: 'In Repair', handler: 'store.addRepair()', role: 'Service Technician' },
      { from: 'In Repair', to: 'In Stock', handler: 'store.completeRepair()', role: 'Service Manager' }
    ]
  },
  orders: {
    entity: 'SalesOrder',
    initialState: 'Processing / Ready',
    observedStates: ['Draft', 'Pending Approval', 'Processing', 'Ready', 'Completed', 'Cancelled'],
    terminalStates: ['Completed', 'Cancelled'],
    transitions: [
      { from: 'Draft', to: 'Ready', handler: 'CreateSale.vue completeSale()', role: 'Sales Executive' },
      { from: 'Ready', to: 'Completed', handler: 'DeliveryHandover.vue completeDelivery()', role: 'Delivery Officer' },
      { from: 'Pending Approval', to: 'Processing', handler: 'store.resolveActionItem() (commercial_pricing)', role: 'Super Admin' }
    ]
  },
  invoices: {
    entity: 'Invoice',
    initialState: 'Unpaid',
    observedStates: ['Draft', 'Unpaid', 'Partial', 'Paid', 'Cancelled'],
    terminalStates: ['Paid', 'Cancelled'],
    transitions: [
      { from: 'Unpaid', to: 'Partial', handler: 'store.recordInvoicePayment()', role: 'Cashier / Accountant' },
      { from: 'Partial', to: 'Paid', handler: 'store.recordInvoicePayment()', role: 'Cashier / Accountant' },
      { from: 'Unpaid', to: 'Paid', handler: 'store.recordInvoicePayment()', role: 'Cashier / Accountant' }
    ]
  },
  expenses: {
    entity: 'Expense',
    initialState: 'Pending',
    observedStates: ['Draft', 'Pending', 'Approved', 'Rejected', 'Paid'],
    terminalStates: ['Paid', 'Rejected'],
    transitions: [
      { from: 'Draft', to: 'Pending', handler: 'CreateExpense.vue submitForm()', role: 'Branch Manager' },
      { from: 'Pending', to: 'Approved', handler: 'Expenses.vue approveExpense()', role: 'Super Admin' },
      { from: 'Pending', to: 'Rejected', handler: 'Expenses.vue rejectExpense()', role: 'Super Admin' }
    ]
  },
  transfers: {
    entity: 'StockTransfer',
    initialState: 'Pending Approval',
    observedStates: ['Draft', 'Pending Approval', 'In Transit', 'Received', 'Cancelled'],
    terminalStates: ['Received', 'Cancelled'],
    transitions: [
      { from: 'Draft', to: 'Pending Approval', handler: 'CreateTransfer.vue', role: 'Branch Manager' },
      { from: 'Pending Approval', to: 'In Transit', handler: 'Transfers.vue dispatchTransfer()', role: 'Origin BM / Super Admin' },
      { from: 'In Transit', to: 'Received', handler: 'ReceiveTransfer.vue confirmReceive()', role: 'Destination BM' }
    ]
  },
  cases: {
    entity: 'WarrantyCase',
    initialState: 'Open',
    observedStates: ['Open', 'Under Review', 'Approved', 'In Progress', 'Resolved', 'Rejected'],
    terminalStates: ['Resolved', 'Rejected'],
    transitions: [
      { from: 'Open', to: 'Under Review', handler: 'CreateCase.vue', role: 'Service Advisor' },
      { from: 'Under Review', to: 'Approved', handler: 'WarrantyService.vue', role: 'Service Manager / Super Admin' },
      { from: 'Approved', to: 'Resolved', handler: 'WarrantyService.vue', role: 'Service Technician' }
    ]
  },
  repairs: {
    entity: 'RepairJob',
    initialState: 'Scheduled',
    observedStates: ['Scheduled', 'In Progress', 'Waiting for Parts', 'Completed', 'Cancelled'],
    terminalStates: ['Completed', 'Cancelled'],
    transitions: [
      { from: 'Scheduled', to: 'In Progress', handler: 'RepairDetail.vue startRepair()', role: 'Technician' },
      { from: 'In Progress', to: 'Completed', handler: 'RepairDetail.vue completeRepair()', role: 'Technician' }
    ]
  },
  quarantine: {
    entity: 'QuarantineRecord',
    initialState: 'Active',
    observedStates: ['Active', 'Under Investigation', 'Released', 'Scrapped'],
    terminalStates: ['Released', 'Scrapped'],
    transitions: [
      { from: 'Active', to: 'Under Investigation', handler: 'CreateQuarantineRecord.vue', role: 'Quality Inspector' },
      { from: 'Under Investigation', to: 'Released', handler: 'QuarantineDetail.vue release()', role: 'Super Admin' },
      { from: 'Under Investigation', to: 'Scrapped', handler: 'QuarantineDetail.vue scrap()', role: 'Super Admin' }
    ]
  }
};

// Scan for State Defects
const stateDefects = [];

for (const [key, model] of Object.entries(entityStateModels)) {
  const allFromStates = model.transitions.map(t => t.from);
  const allToStates = model.transitions.map(t => t.to);

  // Check unreachable states (not initial and never transitioned to)
  for (const s of model.observedStates) {
    if (!model.initialState.includes(s) && !allToStates.includes(s)) {
      stateDefects.push({
        entity: model.entity,
        defectType: 'UNREACHABLE_STATE',
        state: s,
        description: `State '${s}' is observed in schema/badges but has no incoming transition handlers in source`
      });
    }
  }

  // Check dead-end states (not terminal and no outgoing transitions)
  for (const s of model.observedStates) {
    if (!model.terminalStates.includes(s) && !allFromStates.includes(s)) {
      stateDefects.push({
        entity: model.entity,
        defectType: 'DEAD_END_STATE',
        state: s,
        description: `State '${s}' has no outgoing transitions defined, trapping records indefinitely`
      });
    }
  }
}

// Action Centre link defect
stateDefects.push({
  entity: 'ActionCentreQueue',
  defectType: 'TRANSITION_WITHOUT_HANDLER',
  state: 'Pending -> Resolved',
  description: 'store.resolveActionItem() marks action queue item resolved but lacks transition handlers to update source records for stock, expense, warranty, and governance'
});

fs.writeFileSync(
  path.join(rootDir, 'scratch/forensic/baseline/state_machines.json'),
  JSON.stringify({
    entityStateModels,
    stateDefectsCount: stateDefects.length,
    stateDefects
  }, null, 2),
  'utf8'
);

console.log(`Audited ${Object.keys(entityStateModels).length} entity state machines.`);
console.log(`Detected ${stateDefects.length} state defects.`);
stateDefects.forEach(d => console.log(`  - [${d.defectType}] ${d.entity}: ${d.description}`));
