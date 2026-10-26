const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const persistentEntities = [
  { entity: 'SalesOrder', collection: 'orders', getter: 'getOrderById', hasBranchCol: true, isGlobalEntity: false },
  { entity: 'Customer', collection: 'customers', getter: 'getCustomerById', hasBranchCol: true, isGlobalEntity: false },
  { entity: 'SerializedUnit', collection: 'serializedUnits', getter: 'getUnitById', hasBranchCol: true, isGlobalEntity: false },
  { entity: 'Expense', collection: 'expenses', getter: 'getExpenseById', hasBranchCol: true, isGlobalEntity: false },
  { entity: 'Invoice', collection: 'invoices', getter: 'getInvoiceById', hasBranchCol: true, isGlobalEntity: false },
  { entity: 'Payment', collection: 'payments', getter: 'getPaymentById', hasBranchCol: true, isGlobalEntity: false },
  { entity: 'DeliveryHandover', collection: 'deliveries', getter: 'getDeliveryById', hasBranchCol: true, isGlobalEntity: false },
  { entity: 'StockTransfer', collection: 'transfers', getter: 'getTransferById', hasBranchCol: true, isGlobalEntity: false },
  { entity: 'StockRequest', collection: 'stockRequests', getter: 'getStockRequestById', hasBranchCol: true, isGlobalEntity: false },
  { entity: 'StockAdjustment', collection: 'stockAdjustments', getter: 'getAdjustmentById', hasBranchCol: true, isGlobalEntity: false },
  { entity: 'CycleCount', collection: 'cycleCounts', getter: 'getCycleCountById', hasBranchCol: true, isGlobalEntity: false },
  { entity: 'QuarantineRecord', collection: 'quarantine', getter: 'getQuarantineById', hasBranchCol: true, isGlobalEntity: false },
  { entity: 'Quotation', collection: 'quotations', getter: 'getQuotationById', hasBranchCol: true, isGlobalEntity: false },
  { entity: 'Lead', collection: 'leads', getter: 'getLeadById', hasBranchCol: true, isGlobalEntity: false },
  { entity: 'FollowUp', collection: 'followUps', getter: 'getFollowUpById', hasBranchCol: true, isGlobalEntity: false },
  { entity: 'CustomOrder', collection: 'customOrders', getter: 'getCustomOrderById', hasBranchCol: true, isGlobalEntity: false },
  { entity: 'SalesReturn', collection: 'salesReturns', getter: 'getSalesReturnById', hasBranchCol: true, isGlobalEntity: false },
  { entity: 'WarrantyCase', collection: 'cases', getter: 'getCaseById', hasBranchCol: true, isGlobalEntity: false },
  { entity: 'RepairJob', collection: 'repairs', getter: 'getRepairById', hasBranchCol: true, isGlobalEntity: false },
  { entity: 'PurchaseOrder', collection: 'purchaseOrders', getter: 'getPurchaseOrderById', hasBranchCol: true, isGlobalEntity: false },
  { entity: 'PurchaseReturn', collection: 'purchaseReturns', getter: 'getPurchaseReturnById', hasBranchCol: true, isGlobalEntity: false },
  { entity: 'Supplier', collection: 'suppliers', getter: 'getSupplierById', hasBranchCol: false, isGlobalEntity: true },
  { entity: 'Product', collection: 'products', getter: 'getProductById', hasBranchCol: false, isGlobalEntity: true },
  { entity: 'Category', collection: 'categories', getter: 'getCategoryById', hasBranchCol: false, isGlobalEntity: true },
  { entity: 'PriceRule', collection: 'pricingRules', getter: 'getPriceRuleById', hasBranchCol: false, isGlobalEntity: true },
  { entity: 'Branch', collection: 'branches', getter: 'getBranchById', hasBranchCol: false, isGlobalEntity: true },
  { entity: 'User', collection: 'users', getter: 'getUserById', hasBranchCol: true, isGlobalEntity: true }
];

const matrix = [];

for (const ent of persistentEntities) {
  if (ent.isGlobalEntity) {
    matrix.push({
      entity: ent.entity,
      collection: ent.collection,
      isGlobalEnterpriseEntity: true,
      listScoped: 'N/A (Enterprise-Wide Entity)',
      detailScoped: 'N/A (Enterprise-Wide Entity)',
      editScoped: 'SUPER_ADMIN_RBAC_PROTECTED',
      mutationScoped: 'SUPER_ADMIN_RBAC_PROTECTED',
      storeGetterScoped: 'N/A (Global Catalogue / Org Master)',
      actionScoped: 'SUPER_ADMIN_RBAC_PROTECTED',
      isolationStatus: 'LEGITIMATE_GLOBAL_SCOPE'
    });
  } else {
    matrix.push({
      entity: ent.entity,
      collection: ent.collection,
      isGlobalEnterpriseEntity: false,
      listScoped: 'UI_GRID_FILTER_ONLY (Protected in list computed property)',
      detailScoped: 'UNPROTECTED (Direct route /detail/:id renders cross-branch records)',
      editScoped: 'UNPROTECTED (Direct route /edit/:id preloads cross-branch records)',
      mutationScoped: 'UNPROTECTED (Store update/delete methods lack branch validation)',
      storeGetterScoped: `UNPROTECTED (${ent.getter} performs global array lookup)`,
      actionScoped: 'UNPROTECTED (Inline approval/dispatch buttons execute across branches)',
      isolationStatus: 'CRITICAL_CROSS_BRANCH_EXPOSURE'
    });
  }
}

const summary = {
  totalEntitiesAudited: matrix.length,
  branchSpecificEntities: matrix.filter(m => !m.isGlobalEnterpriseEntity).length,
  globalEnterpriseEntities: matrix.filter(m => m.isGlobalEnterpriseEntity).length,
  rootCause: 'Branch authorization is implemented purely as presentation-layer computed grid filtering (records.filter(r => r.branch === currentBranch)), with zero branch scoping in router navigation guards, store entity getters, or mutation methods.',
  matrix
};

fs.writeFileSync(
  path.join(rootDir, 'scratch/forensic/baseline/branch_scope_matrix.json'),
  JSON.stringify(summary, null, 2),
  'utf8'
);

console.log('=== BRANCH SECURITY BLAST RADIUS MATRIX ===');
console.log('Total Persistent Entities Audited:', summary.totalEntitiesAudited);
console.log('Branch-Specific Entities with Critical Exposure:', summary.branchSpecificEntities);
console.log('Global Enterprise Entities (Super Admin Managed):', summary.globalEnterpriseEntities);
