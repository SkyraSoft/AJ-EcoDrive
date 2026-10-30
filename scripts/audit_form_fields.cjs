const fs = require('fs');
const path = require('path');

const forms = [
  'after-sales/CreateCase.vue',
  'after-sales/CreateRepairJob.vue',
  'analytics/BuildReport.vue',
  'auth/CreateNewPassword.vue',
  'auth/ForgotPassword.vue',
  'auth/Login.vue',
  'auth/VerifyIdentity.vue',
  'catalogue/CreateCategory.vue',
  'catalogue/CreatePriceRule.vue',
  'catalogue/CreateProduct.vue',
  'catalogue/CreateProductRequest.vue',
  'catalogue/EditPriceRule.vue',
  'catalogue/EditProduct.vue',
  'communication/ConversationDetail.vue',
  'communication/CreateConversation.vue',
  'finance/CreateExpense.vue',
  'inventory/CreateAdjustmentRequest.vue',
  'inventory/CreateCycleCount.vue',
  'inventory/CreateQuarantineRecord.vue',
  'inventory/CreateStockRequest.vue',
  'inventory/CreateTransfer.vue',
  'organisation/CreateBranch.vue',
  'organisation/CreateRole.vue',
  'organisation/CreateUser.vue',
  'organisation/EditBranch.vue',
  'organisation/EditUser.vue',
  'procurement/CreatePurchaseOrder.vue',
  'procurement/CreatePurchaseReturn.vue',
  'procurement/CreateSupplier.vue',
  'procurement/EditSupplier.vue',
  'sales/CreateCustomer.vue',
  'sales/CreateCustomOrder.vue',
  'sales/CreateDeliveryHandover.vue',
  'sales/CreateFollowUp.vue',
  'sales/CreateInvoice.vue',
  'sales/CreateLead.vue',
  'sales/CreatePayment.vue',
  'sales/CreateQuotation.vue',
  'sales/CreateReturn.vue',
  'sales/CreateSale.vue',
  'system/BranchTeam.vue'
];

const results = [];
for (const rel of forms) {
  const full = path.join(__dirname, '../frontend/src/views', rel);
  if (!fs.existsSync(full)) {
    results.push({ file: rel, exists: false });
    continue;
  }
  const code = fs.readFileSync(full, 'utf8');
  const vmodels = Array.from(new Set(Array.from(code.matchAll(/v-model(?:\.[a-z]+)*="([^"]+)"/g)).map(m => m[1])));
  const hasApi = code.includes('api.');
  const apiCalls = Array.from(new Set(Array.from(code.matchAll(/api\.([a-zA-Z0-9_.]+)/g)).map(m => m[1])));
  const storeMutations = Array.from(new Set(Array.from(code.matchAll(/store\.([a-zA-Z0-9_]+)/g)).map(m => m[1])))
    .filter(m => m.startsWith('add') || m.startsWith('update') || m.startsWith('delete') || m.startsWith('create') || m.startsWith('set'));

  results.push({
    file: rel,
    fields: vmodels,
    hasApi,
    apiCalls,
    storeMutations
  });
}

console.log(JSON.stringify(results, null, 2));
fs.writeFileSync(path.join(__dirname, 'form_fields_audit.json'), JSON.stringify(results, null, 2));
