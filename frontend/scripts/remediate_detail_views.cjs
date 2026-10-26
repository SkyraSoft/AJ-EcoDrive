const fs = require('fs');
const path = require('path');

function patchFile(relPath, fn) {
  const fullPath = path.resolve(__dirname, '..', relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`File not found: ${fullPath}`);
    return;
  }
  let content = fs.readFileSync(fullPath, 'utf-8');
  const updated = fn(content);
  if (updated !== content) {
    fs.writeFileSync(fullPath, updated);
    console.log(`✓ Patched ${relPath}`);
  } else {
    console.log(`- No change needed or pattern not matched for ${relPath}`);
  }
}

// 1. PaymentDetail.vue
patchFile('src/views/sales/PaymentDetail.vue', content => {
  if (!content.includes('NotFoundState')) {
    content = content.replace(
      "import CreatePaymentModal from './CreatePayment.vue'",
      "import CreatePaymentModal from './CreatePayment.vue'\nimport NotFoundState from '@/components/common/NotFoundState.vue'"
    );
  }
  content = content.replace(
    /const currentPayment = computed\(\(\) => \{[\s\S]*?if \(rawPayId\.value\) return store\.getPaymentById\(rawPayId\.value\)[\s\S]*?return store\.payments\[0\] \|\| null[\s\S]*?\}\)/,
    `const currentPayment = computed(() => {
  if (!rawPayId.value) return null
  return store.getPaymentById(rawPayId.value)
})`
  );
  if (!content.includes('<NotFoundState v-if="!currentPayment"')) {
    content = content.replace(
      '<div class="p-6 max-w-7xl mx-auto space-y-6">',
      `<NotFoundState v-if="!currentPayment" title="Payment Not Found" message="The requested payment record does not exist or you do not have permission to view it in your current branch context." backRoute="/sales/payments" />\n  <div v-else class="p-6 max-w-7xl mx-auto space-y-6">`
    );
  }
  return content;
});

// 2. InvoiceDetail.vue
patchFile('src/views/sales/InvoiceDetail.vue', content => {
  if (!content.includes('NotFoundState')) {
    content = content.replace(
      "import { store } from '../../store.js'",
      "import { store } from '../../store.js'\nimport NotFoundState from '@/components/common/NotFoundState.vue'"
    );
  }
  content = content.replace(
    /const currentInvoice = computed\(\(\) => \{[\s\S]*?if \(rawInvId\.value\) return store\.getInvoiceById\(rawInvId\.value\)[\s\S]*?return store\.invoices\[0\] \|\| null[\s\S]*?\}\)/,
    `const currentInvoice = computed(() => {
  if (!rawInvId.value) return null
  return store.getInvoiceById(rawInvId.value)
})`
  );
  if (!content.includes('<NotFoundState v-if="!currentInvoice"')) {
    content = content.replace(
      '<div class="p-6 max-w-7xl mx-auto space-y-6">',
      `<NotFoundState v-if="!currentInvoice" title="Invoice Not Found" message="The requested invoice does not exist or you do not have permission to view it in your current branch context." backRoute="/sales/invoices" />\n  <div v-else class="p-6 max-w-7xl mx-auto space-y-6">`
    );
  }
  return content;
});

// 3. CustomerDetail.vue
patchFile('src/views/sales/CustomerDetail.vue', content => {
  if (!content.includes('NotFoundState')) {
    content = content.replace(
      "import CreatePaymentModal from './CreatePayment.vue'",
      "import CreatePaymentModal from './CreatePayment.vue'\nimport NotFoundState from '@/components/common/NotFoundState.vue'"
    );
  }
  content = content.replace(
    /const customerId = computed\(\(\) => route\.params\.id \|\| route\.query\.id \|\| 'CUST-101'\)/,
    `const customerId = computed(() => route.params.id || route.query.id || '')`
  );
  content = content.replace(
    /const customerRecord = computed\(\(\) => \{[\s\S]*?return all\.find\(item => item\.id === customerId\.value[\s\S]*?ordersCount: 0[\s\S]*?outstanding: 'PKR 0'[\s\S]*?\}\s*\}\)/,
    `const customerRecord = computed(() => {
  if (!customerId.value) return null
  return store.getCustomerById(customerId.value)
})`
  );
  if (!content.includes('<NotFoundState v-if="!customerRecord"')) {
    content = content.replace(
      '<div class="p-6 max-w-7xl mx-auto space-y-6">',
      `<NotFoundState v-if="!customerRecord" title="Customer Not Found" message="The requested customer record does not exist or you do not have permission to view it in your current branch context." backRoute="/sales/customers" />\n  <div v-else class="p-6 max-w-7xl mx-auto space-y-6">`
    );
  }
  return content;
});

// 4. OrderDetail.vue
patchFile('src/views/sales/OrderDetail.vue', content => {
  if (!content.includes('NotFoundState')) {
    content = content.replace(
      "import CreateSaleModal from './CreateSale.vue'",
      "import CreateSaleModal from './CreateSale.vue'\nimport NotFoundState from '@/components/common/NotFoundState.vue'"
    );
  }
  content = content.replace(
    /const orderId = computed\(\(\) => route\.params\.id \|\| route\.query\.id \|\| 'ORD-2241'\)/,
    `const orderId = computed(() => route.params.id || route.query.id || '')`
  );
  content = content.replace(
    /const customerName = o\?\.customer \|\| c\?\.name \|\| 'Ahsan Khan'/,
    `const customerName = o?.customer || c?.name || ''`
  );
  content = content.replace(
    /const productName = o\?\.product \|\| u\?\.product \|\| 'BRG E-125'/,
    `const productName = o?.product || u?.product || ''`
  );
  content = content.replace(
    /const chassisNo = u\?\.chassisNumber \|\| u\?\.chassis \|\| o\?\.unit \|\| 'CH8-BRG-26-01882'/,
    `const chassisNo = u?.chassisNumber || u?.chassis || o?.unit || ''`
  );
  content = content.replace(
    /const orderTotal = o\?\.total \|\| 'PKR 280,000'/,
    `const orderTotal = o?.total || 'PKR 0'`
  );
  if (!content.includes('<NotFoundState v-if="!orderRecord"')) {
    content = content.replace(
      '<div class="p-6 max-w-7xl mx-auto space-y-6">',
      `<NotFoundState v-if="!orderRecord" title="Order Not Found" message="The requested order does not exist or you do not have permission to view it in your current branch context." backRoute="/sales/orders" />\n  <div v-else class="p-6 max-w-7xl mx-auto space-y-6">`
    );
  }
  return content;
});

// 5. PurchaseOrderDetail.vue
patchFile('src/views/procurement/PurchaseOrderDetail.vue', content => {
  if (!content.includes('NotFoundState')) {
    content = content.replace(
      "import { store } from '../../store.js'",
      "import { store } from '../../store.js'\nimport NotFoundState from '@/components/common/NotFoundState.vue'"
    );
  }
  content = content.replace(
    /const poId = computed\(\(\) => route\.params\.id \|\| route\.query\.id \|\| 'PO-2048'\)/,
    `const poId = computed(() => route.params.id || route.query.id || '')`
  );
  content = content.replace(
    /const poRecord = computed\(\(\) => \{[\s\S]*?return store\.getPurchaseOrderById\(poId\.value\) \|\| store\.purchaseOrders\[0\] \|\| \{[\s\S]*?status: 'In Transit'[\s\S]*?\}\s*\}\)/,
    `const poRecord = computed(() => {
  if (!poId.value) return null
  return store.getPurchaseOrderById(poId.value)
})`
  );
  if (!content.includes('<NotFoundState v-if="!poRecord"')) {
    content = content.replace(
      '<div class="p-6 max-w-7xl mx-auto space-y-6">',
      `<NotFoundState v-if="!poRecord" title="Purchase Order Not Found" message="The requested purchase order does not exist or you do not have permission to view it." backRoute="/procurement/purchase-orders" />\n  <div v-else class="p-6 max-w-7xl mx-auto space-y-6">`
    );
  }
  return content;
});

// 6. SupplierDetail.vue
patchFile('src/views/procurement/SupplierDetail.vue', content => {
  if (!content.includes('NotFoundState')) {
    content = content.replace(
      "import { store } from '../../store.js'",
      "import { store } from '../../store.js'\nimport NotFoundState from '@/components/common/NotFoundState.vue'"
    );
  }
  content = content.replace(
    /const supplierId = computed\(\(\) => route\.params\.id \|\| route\.query\.id \|\| 'SUP-01'\)/,
    `const supplierId = computed(() => route.params.id || route.query.id || '')`
  );
  content = content.replace(
    /const supplierRecord = computed\(\(\) => \{[\s\S]*?return store\.getSupplierById\(supplierId\.value\) \|\| store\.suppliers\[0\] \|\| \{[\s\S]*?performance: '98%'[\s\S]*?\}\s*\}\)/,
    `const supplierRecord = computed(() => {
  if (!supplierId.value) return null
  return store.getSupplierById(supplierId.value)
})`
  );
  if (!content.includes('<NotFoundState v-if="!supplierRecord"')) {
    content = content.replace(
      '<div class="p-6 max-w-7xl mx-auto space-y-6">',
      `<NotFoundState v-if="!supplierRecord" title="Supplier Not Found" message="The requested supplier does not exist." backRoute="/procurement/suppliers" />\n  <div v-else class="p-6 max-w-7xl mx-auto space-y-6">`
    );
  }
  return content;
});

// 7. DeliveryHandoverDetail.vue
patchFile('src/views/sales/DeliveryHandoverDetail.vue', content => {
  if (!content.includes('NotFoundState')) {
    content = content.replace(
      "import { store } from '../../store.js'",
      "import { store } from '../../store.js'\nimport NotFoundState from '@/components/common/NotFoundState.vue'"
    );
  }
  content = content.replace(
    /const deliveryRecord = computed\(\(\) => store\.getDeliveryById\(rawId\.value\) \|\| \(route\.query\.id \? null : store\.deliveries\[0\]\)\)/,
    `const deliveryRecord = computed(() => rawId.value ? store.getDeliveryById(rawId.value) : null)`
  );
  if (!content.includes('<NotFoundState v-if="!deliveryRecord"')) {
    content = content.replace(
      '<div class="p-6 max-w-7xl mx-auto space-y-6">',
      `<NotFoundState v-if="!deliveryRecord" title="Delivery Not Found" message="The requested delivery handover record does not exist or you do not have permission to view it in your current branch context." backRoute="/sales/deliveries" />\n  <div v-else class="p-6 max-w-7xl mx-auto space-y-6">`
    );
  }
  return content;
});

// 8. QuotationDetail.vue
patchFile('src/views/sales/QuotationDetail.vue', content => {
  if (!content.includes('NotFoundState')) {
    content = content.replace(
      "import { store } from '../../store.js'",
      "import { store } from '../../store.js'\nimport NotFoundState from '@/components/common/NotFoundState.vue'"
    );
  }
  content = content.replace(
    /const quoteRecord = computed\(\(\) => store\.getQuotationById\(quoteId\.value\) \|\| \(route\.query\.id \? null : store\.quotations\[0\]\)\)/,
    `const quoteRecord = computed(() => quoteId.value ? store.getQuotationById(quoteId.value) : null)`
  );
  if (!content.includes('<NotFoundState v-if="!quoteRecord"')) {
    content = content.replace(
      '<div class="p-6 max-w-7xl mx-auto space-y-6">',
      `<NotFoundState v-if="!quoteRecord" title="Quotation Not Found" message="The requested quotation does not exist or you do not have permission to view it in your current branch context." backRoute="/sales/quotations" />\n  <div v-else class="p-6 max-w-7xl mx-auto space-y-6">`
    );
  }
  return content;
});

// 9. LeadDetail.vue
patchFile('src/views/sales/LeadDetail.vue', content => {
  if (!content.includes('NotFoundState')) {
    content = content.replace(
      "import { store } from '../../store.js'",
      "import { store } from '../../store.js'\nimport NotFoundState from '@/components/common/NotFoundState.vue'"
    );
  }
  content = content.replace(
    /const currentLead = computed\(\(\) => store\.getLeadById\(leadId\.value\) \|\| store\.leads\[0\] \|\| \{[\s\S]*?stage: 'Discovery'[\s\S]*?\}\)/,
    `const currentLead = computed(() => leadId.value ? store.getLeadById(leadId.value) : null)`
  );
  if (!content.includes('<NotFoundState v-if="!currentLead"')) {
    content = content.replace(
      '<div class="p-6 max-w-7xl mx-auto space-y-6">',
      `<NotFoundState v-if="!currentLead" title="Lead Not Found" message="The requested lead does not exist or you do not have permission to view it in your current branch context." backRoute="/sales/leads" />\n  <div v-else class="p-6 max-w-7xl mx-auto space-y-6">`
    );
  }
  return content;
});

// 10. CustomOrderDetail.vue
patchFile('src/views/sales/CustomOrderDetail.vue', content => {
  if (!content.includes('NotFoundState')) {
    content = content.replace(
      "import { store } from '../../store.js'",
      "import { store } from '../../store.js'\nimport NotFoundState from '@/components/common/NotFoundState.vue'"
    );
  }
  content = content.replace(
    /const found = \(paramId && store\.getCustomOrderById\(paramId\)\) \|\| store\.customOrders\[0\]/,
    `const found = (paramId && store.getCustomOrderById(paramId)) || null`
  );
  if (!content.includes('<NotFoundState v-if="!order"')) {
    content = content.replace(
      '<div class="p-6 max-w-7xl mx-auto space-y-6">',
      `<NotFoundState v-if="!order" title="Custom Order Not Found" message="The requested custom order does not exist or you do not have permission to view it in your current branch context." backRoute="/sales/custom-orders" />\n  <div v-else class="p-6 max-w-7xl mx-auto space-y-6">`
    );
  }
  return content;
});

// 11. ReturnDetail.vue
patchFile('src/views/sales/ReturnDetail.vue', content => {
  if (!content.includes('NotFoundState')) {
    content = content.replace(
      "import { store } from '../../store.js'",
      "import { store } from '../../store.js'\nimport NotFoundState from '@/components/common/NotFoundState.vue'"
    );
  }
  content = content.replace(
    /const returnRecord = computed\(\(\) => store\.getSalesReturnById\(returnId\.value\) \|\| store\.salesReturns\[0\] \|\| \{\}\)/,
    `const returnRecord = computed(() => returnId.value ? store.getSalesReturnById(returnId.value) : null)`
  );
  if (!content.includes('<NotFoundState v-if="!returnRecord"')) {
    content = content.replace(
      '<div class="p-6 max-w-7xl mx-auto space-y-6">',
      `<NotFoundState v-if="!returnRecord" title="Return Not Found" message="The requested sales return does not exist or you do not have permission to view it in your current branch context." backRoute="/sales/returns" />\n  <div v-else class="p-6 max-w-7xl mx-auto space-y-6">`
    );
  }
  return content;
});

// 12. BranchDetail.vue
patchFile('src/views/organisation/BranchDetail.vue', content => {
  if (!content.includes('NotFoundState')) {
    content = content.replace(
      "import { store } from '../../store.js'",
      "import { store } from '../../store.js'\nimport NotFoundState from '@/components/common/NotFoundState.vue'"
    );
  }
  content = content.replace(
    /const branchId = computed\(\(\) => route\.params\.id \|\| route\.query\.id \|\| 'BR-01'\)/,
    `const branchId = computed(() => route.params.id || route.query.id || '')`
  );
  content = content.replace(
    /const branchRecord = computed\(\(\) => \{[\s\S]*?return store\.getBranchById\(branchId\.value\) \|\| store\.branches\[0\] \|\| \{[\s\S]*?status: 'Active'[\s\S]*?\}\s*\}\)/,
    `const branchRecord = computed(() => {
  if (!branchId.value) return null
  return store.getBranchById(branchId.value)
})`
  );
  if (!content.includes('<NotFoundState v-if="!branchRecord"')) {
    content = content.replace(
      '<div class="p-6 max-w-7xl mx-auto space-y-6">',
      `<NotFoundState v-if="!branchRecord" title="Branch Not Found" message="The requested branch does not exist." backRoute="/organisation/branches" />\n  <div v-else class="p-6 max-w-7xl mx-auto space-y-6">`
    );
  }
  return content;
});

// 13. UserDetail.vue
patchFile('src/views/organisation/UserDetail.vue', content => {
  if (!content.includes('NotFoundState')) {
    content = content.replace(
      "import { store } from '../../store.js'",
      "import { store } from '../../store.js'\nimport NotFoundState from '@/components/common/NotFoundState.vue'"
    );
  }
  content = content.replace(
    /const userId = computed\(\(\) => route\.params\.id \|\| route\.query\.id \|\| 'USR-01'\)/,
    `const userId = computed(() => route.params.id || route.query.id || '')`
  );
  content = content.replace(
    /const userRecord = computed\(\(\) => \{[\s\S]*?return store\.getUserById\(userId\.value\) \|\| store\.users\[0\] \|\| \{[\s\S]*?role: 'Branch Manager'[\s\S]*?\}\s*\}\)/,
    `const userRecord = computed(() => {
  if (!userId.value) return null
  return store.getUserById(userId.value)
})`
  );
  if (!content.includes('<NotFoundState v-if="!userRecord"')) {
    content = content.replace(
      '<div class="p-6 max-w-7xl mx-auto space-y-6">',
      `<NotFoundState v-if="!userRecord" title="User Not Found" message="The requested user profile does not exist." backRoute="/organisation/users" />\n  <div v-else class="p-6 max-w-7xl mx-auto space-y-6">`
    );
  }
  return content;
});

// 14. ExpenseDetail.vue
patchFile('src/views/finance/ExpenseDetail.vue', content => {
  if (!content.includes('NotFoundState')) {
    content = content.replace(
      "import { store } from '../../store.js'",
      "import { store } from '../../store.js'\nimport NotFoundState from '@/components/common/NotFoundState.vue'"
    );
  }
  content = content.replace(
    /const currentExpense = computed\(\(\) => \{[\s\S]*?return store\.expenses\[0\] \|\| \{[\s\S]*?notes: 'Monthly utility bill'[\s\S]*?\}\s*\}\)/,
    `const currentExpense = computed(() => {
  if (!rawExpId.value) return null
  return store.getExpenseById(rawExpId.value)
})`
  );
  if (!content.includes('<NotFoundState v-if="!currentExpense"')) {
    content = content.replace(
      '<div class="p-6 max-w-7xl mx-auto space-y-6">',
      `<NotFoundState v-if="!currentExpense" title="Expense Not Found" message="The requested expense record does not exist or you do not have permission to view it in your current branch context." backRoute="/finance/expenses" />\n  <div v-else class="p-6 max-w-7xl mx-auto space-y-6">`
    );
  }
  return content;
});

// 15. ReceiptDetail.vue
patchFile('src/views/procurement/ReceiptDetail.vue', content => {
  if (!content.includes('NotFoundState')) {
    content = content.replace(
      "import { store } from '../../store.js'",
      "import { store } from '../../store.js'\nimport NotFoundState from '@/components/common/NotFoundState.vue'"
    );
  }
  content = content.replace(
    /const receiptId = computed\(\(\) => route\.params\.id \|\| route\.query\.id \|\| 'GRN-4401'\)/,
    `const receiptId = computed(() => route.params.id || route.query.id || '')`
  );
  content = content.replace(
    /const receiptRecord = computed\(\(\) => \{[\s\S]*?return store\.getReceiptById\(receiptId\.value\) \|\| store\.receipts\[0\] \|\| \{[\s\S]*?status: 'Approved'[\s\S]*?\}\s*\}\)/,
    `const receiptRecord = computed(() => {
  if (!receiptId.value) return null
  return store.getReceiptById(receiptId.value)
})`
  );
  if (!content.includes('<NotFoundState v-if="!receiptRecord"')) {
    content = content.replace(
      '<div class="p-6 max-w-7xl mx-auto space-y-6">',
      `<NotFoundState v-if="!receiptRecord" title="Receipt Not Found" message="The requested goods receipt does not exist or you do not have permission to view it." backRoute="/procurement/receipts" />\n  <div v-else class="p-6 max-w-7xl mx-auto space-y-6">`
    );
  }
  return content;
});

// 16. PurchaseReturnDetail.vue
patchFile('src/views/procurement/PurchaseReturnDetail.vue', content => {
  if (!content.includes('NotFoundState')) {
    content = content.replace(
      "import { store } from '../../store.js'",
      "import { store } from '../../store.js'\nimport NotFoundState from '@/components/common/NotFoundState.vue'"
    );
  }
  content = content.replace(
    /const returnId = computed\(\(\) => route\.params\.id \|\| route\.query\.id \|\| 'PRTN-044'\)/,
    `const returnId = computed(() => route.params.id || route.query.id || '')`
  );
  content = content.replace(
    /const returnRecord = computed\(\(\) => \{[\s\S]*?return store\.getPurchaseReturnById\(returnId\.value\) \|\| store\.purchaseReturns\[0\] \|\| \{[\s\S]*?credit: '152K'[\s\S]*?\}\s*\}\)/,
    `const returnRecord = computed(() => {
  if (!returnId.value) return null
  return store.getPurchaseReturnById(returnId.value)
})`
  );
  if (!content.includes('<NotFoundState v-if="!returnRecord"')) {
    content = content.replace(
      '<div class="p-6 max-w-7xl mx-auto space-y-6">',
      `<NotFoundState v-if="!returnRecord" title="Purchase Return Not Found" message="The requested purchase return does not exist or you do not have permission to view it." backRoute="/procurement/purchase-returns" />\n  <div v-else class="p-6 max-w-7xl mx-auto space-y-6">`
    );
  }
  return content;
});

// 17. ConversationDetail.vue
patchFile('src/views/communication/ConversationDetail.vue', content => {
  if (!content.includes('NotFoundState')) {
    content = content.replace(
      "import { store } from '../../store.js'",
      "import { store } from '../../store.js'\nimport NotFoundState from '@/components/common/NotFoundState.vue'"
    );
  }
  content = content.replace(
    /const currentConversation = computed\(\(\) => \{[\s\S]*?return \(store\.conversations && store\.conversations\[0\]\) \|\| \{[\s\S]*?status: 'Open'[\s\S]*?\}\s*\}\)/,
    `const currentConversation = computed(() => {
  const paramId = route.params.id || route.query.id
  if (!paramId) return null
  return store.getConversationById(paramId)
})`
  );
  if (!content.includes('<NotFoundState v-if="!currentConversation"')) {
    content = content.replace(
      '<div class="p-6 max-w-7xl mx-auto space-y-6">',
      `<NotFoundState v-if="!currentConversation" title="Conversation Not Found" message="The requested conversation does not exist or you do not have permission to view it in your current branch context." backRoute="/communication/conversations" />\n  <div v-else class="p-6 max-w-7xl mx-auto space-y-6">`
    );
  }
  return content;
});

console.log('Finished patching detail views.');
