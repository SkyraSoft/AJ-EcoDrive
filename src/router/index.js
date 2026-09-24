import { createRouter, createWebHistory } from 'vue-router'
import { store } from '@/store.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    // Authentication Routes
    {
      path: '/',
      component: () => import('@/layouts/AuthLayout.vue'),
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/auth/Login.vue'),
          meta: { isPublic: true }
        },
        {
          path: 'forgot-password',
          name: 'forgot-password',
          component: () => import('@/views/auth/ForgotPassword.vue'),
          meta: { isPublic: true }
        },
        {
          path: 'verify-identity',
          name: 'verify-identity',
          component: () => import('@/views/auth/VerifyIdentity.vue'),
          meta: { isPublic: true }
        },
        {
          path: 'create-new-password',
          name: 'create-new-password',
          component: () => import('@/views/auth/CreateNewPassword.vue'),
          meta: { isPublic: true }
        },
        {
          path: 'password-updated',
          name: 'password-updated',
          component: () => import('@/views/auth/PasswordUpdated.vue'),
          meta: { isPublic: true }
        }
      ]
    },
    // Main Application Routes
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      children: [
        // --- DASHBOARD ---
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/dashboard/SuperAdminDashboard.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'dashboard/branch-performance',
          name: 'branch-performance',
          component: () => import('@/views/dashboard/BranchPerformance.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin'] }
        },
        {
          path: 'dashboard/business-performance',
          name: 'business-performance',
          component: () => import('@/views/dashboard/BusinessPerformance.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin'] }
        },
        {
          path: 'dashboard/action-centre',
          name: 'action-centre',
          component: () => import('@/views/dashboard/ActionCentre.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'dashboard/quick-actions',
          name: 'quick-actions',
          component: () => import('@/views/dashboard/QuickActions.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },

        // --- ORGANISATION ---
        {
          path: 'organisation/branches',
          name: 'organisation-branches',
          component: () => import('@/views/organisation/Branches.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'organisation/branches/create',
          name: 'organisation-create-branch',
          component: () => import('@/views/organisation/CreateBranch.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin'] }
        },
        {
          path: 'organisation/branches/edit',
          name: 'organisation-edit-branch-legacy',
          component: () => import('@/views/organisation/EditBranch.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin'] }
        },
        {
          path: 'organisation/branches/edit/:id',
          name: 'organisation-edit-branch',
          component: () => import('@/views/organisation/EditBranch.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin'] }
        },
        {
          path: 'organisation/branches/detail',
          name: 'organisation-branch-detail-legacy',
          component: () => import('@/views/organisation/BranchDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'organisation/branches/:id',
          name: 'organisation-branch-detail',
          component: () => import('@/views/organisation/BranchDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'organisation/users',
          name: 'organisation-users',
          component: () => import('@/views/organisation/UsersAccess.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'organisation/users/create',
          name: 'organisation-create-user',
          component: () => import('@/views/organisation/CreateUser.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin'] }
        },
        {
          path: 'organisation/users/edit',
          name: 'organisation-edit-user-legacy',
          component: () => import('@/views/organisation/EditUser.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin'] }
        },
        {
          path: 'organisation/users/edit/:id',
          name: 'organisation-edit-user',
          component: () => import('@/views/organisation/EditUser.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin'] }
        },
        {
          path: 'organisation/users/detail',
          name: 'organisation-user-detail-legacy',
          component: () => import('@/views/organisation/UserDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'organisation/users/:id',
          name: 'organisation-user-detail',
          component: () => import('@/views/organisation/UserDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'organisation/roles',
          name: 'organisation-roles',
          component: () => import('@/views/organisation/RolesPermissions.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin'] }
        },
        {
          path: 'organisation/roles/create',
          name: 'organisation-create-role',
          component: () => import('@/views/organisation/CreateRole.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin'] }
        },

        // --- CATALOGUE ---
        {
          path: 'catalogue/categories',
          name: 'catalogue-categories',
          component: () => import('@/views/catalogue/Categories.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'catalogue/categories/create',
          name: 'catalogue-create-category',
          component: () => import('@/views/catalogue/CreateCategory.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin'] }
        },
        {
          path: 'catalogue/products',
          name: 'catalogue-products',
          component: () => import('@/views/catalogue/Products.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'catalogue/products/create',
          name: 'catalogue-create-product',
          component: () => import('@/views/catalogue/CreateProduct.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin'] }
        },
        {
          path: 'catalogue/create-product',
          name: 'catalogue-create-product-alias',
          component: () => import('@/views/catalogue/CreateProduct.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin'] }
        },
        {
          path: 'catalogue/products/edit',
          name: 'catalogue-edit-product-legacy',
          component: () => import('@/views/catalogue/EditProduct.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin'] }
        },
        {
          path: 'catalogue/products/edit/:id',
          name: 'catalogue-edit-product',
          component: () => import('@/views/catalogue/EditProduct.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin'] }
        },
        {
          path: 'catalogue/edit-product/:id',
          name: 'catalogue-edit-product-alias',
          component: () => import('@/views/catalogue/EditProduct.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin'] }
        },
        {
          path: 'catalogue/products/detail',
          name: 'catalogue-product-detail-legacy',
          component: () => import('@/views/catalogue/ProductDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'catalogue/products/:id',
          name: 'catalogue-product-detail',
          component: () => import('@/views/catalogue/ProductDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'catalogue/pricing',
          name: 'catalogue-pricing',
          component: () => import('@/views/catalogue/Pricing.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin'] }
        },
        {
          path: 'catalogue/pricing/create',
          name: 'catalogue-create-price-rule',
          component: () => import('@/views/catalogue/CreatePriceRule.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin'] }
        },
        {
          path: 'catalogue/pricing/edit',
          name: 'catalogue-edit-price-rule-legacy',
          component: () => import('@/views/catalogue/EditPriceRule.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin'] }
        },
        {
          path: 'catalogue/pricing/edit/:id',
          name: 'catalogue-edit-price-rule',
          component: () => import('@/views/catalogue/EditPriceRule.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin'] }
        },
        {
          path: 'catalogue/requests',
          name: 'catalogue-requests',
          component: () => import('@/views/catalogue/ProductRequests.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'catalogue/requests/create',
          name: 'catalogue-create-request',
          component: () => import('@/views/catalogue/CreateProductRequest.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'catalogue/create-request',
          name: 'catalogue-create-request-alias',
          component: () => import('@/views/catalogue/CreateProductRequest.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'catalogue/requests/detail',
          name: 'catalogue-request-detail-legacy',
          component: () => import('@/views/catalogue/ProductRequestDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'catalogue/requests/:id',
          name: 'catalogue-request-detail',
          component: () => import('@/views/catalogue/ProductRequestDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },

        // --- PROCUREMENT ---
        {
          path: 'procurement/suppliers',
          name: 'procurement-suppliers',
          component: () => import('@/views/procurement/Suppliers.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'procurement/suppliers/create',
          name: 'procurement-create-supplier',
          component: () => import('@/views/procurement/CreateSupplier.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin'] }
        },
        {
          path: 'procurement/suppliers/edit',
          name: 'procurement-edit-supplier-legacy',
          component: () => import('@/views/procurement/EditSupplier.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin'] }
        },
        {
          path: 'procurement/suppliers/edit/:id',
          name: 'procurement-edit-supplier',
          component: () => import('@/views/procurement/EditSupplier.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin'] }
        },
        {
          path: 'procurement/suppliers/detail',
          name: 'procurement-supplier-detail-legacy',
          component: () => import('@/views/procurement/SupplierDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'procurement/suppliers/:id',
          name: 'procurement-supplier-detail',
          component: () => import('@/views/procurement/SupplierDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'procurement/purchase-orders',
          name: 'procurement-purchase-orders',
          component: () => import('@/views/procurement/PurchaseOrders.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'procurement/purchase-orders/create',
          name: 'procurement-create-purchase-order',
          component: () => import('@/views/procurement/CreatePurchaseOrder.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'procurement/create-po',
          name: 'procurement-create-po-alias',
          component: () => import('@/views/procurement/CreatePurchaseOrder.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'procurement/purchase-orders/detail',
          name: 'procurement-purchase-order-detail-legacy',
          component: () => import('@/views/procurement/PurchaseOrderDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'procurement/purchase-orders/:id',
          name: 'procurement-purchase-order-detail',
          component: () => import('@/views/procurement/PurchaseOrderDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'procurement/purchase-orders/:id/receive',
          name: 'procurement-receive-purchase-order',
          component: () => import('@/views/procurement/ReceivePurchase.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'procurement/receipts',
          name: 'procurement-receipts',
          component: () => import('@/views/procurement/ReceivePurchase.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'procurement/receive-purchase',
          name: 'procurement-receive-purchase-alias',
          component: () => import('@/views/procurement/ReceivePurchase.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'procurement/receipts/detail',
          name: 'procurement-receipt-detail-legacy',
          component: () => import('@/views/procurement/ReceiptDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'procurement/receipts/:id',
          name: 'procurement-receipt-detail',
          component: () => import('@/views/procurement/ReceiptDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'procurement/landed-costs',
          name: 'procurement-landed-costs',
          component: () => import('@/views/procurement/LandedCost.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin'] }
        },
        {
          path: 'procurement/vendor-bills',
          name: 'procurement-vendor-bills',
          component: () => import('@/views/procurement/VendorBills.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin'] }
        },
        {
          path: 'procurement/purchase-returns',
          name: 'procurement-purchase-returns',
          component: () => import('@/views/procurement/PurchaseReturns.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'procurement/purchase-returns/create',
          name: 'procurement-create-purchase-return',
          component: () => import('@/views/procurement/CreatePurchaseReturn.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'procurement/purchase-returns/detail',
          name: 'procurement-purchase-return-detail-legacy',
          component: () => import('@/views/procurement/PurchaseReturnDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'procurement/purchase-returns/:id',
          name: 'procurement-purchase-return-detail',
          component: () => import('@/views/procurement/PurchaseReturnDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },

        // --- INVENTORY ---
        {
          path: 'inventory/dashboard',
          name: 'inventory-dashboard',
          component: () => import('@/views/inventory/InventoryDashboard.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'inventory/stock-by-product',
          name: 'inventory-stock-by-product',
          component: () => import('@/views/inventory/StockByProduct.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'inventory/serialized-units',
          name: 'inventory-serialized-units',
          component: () => import('@/views/inventory/SerializedUnits.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'inventory/serialized-units/detail',
          name: 'inventory-unit-detail-legacy',
          component: () => import('@/views/inventory/UnitDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'inventory/serialized-units/:id',
          name: 'inventory-unit-detail',
          component: () => import('@/views/inventory/UnitDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'inventory/units/:id',
          name: 'inventory-unit-detail-alias',
          component: () => import('@/views/inventory/UnitDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'inventory/purchase-orders',
          redirect: '/procurement/purchase-orders'
        },
        {
          path: 'inventory/transfers',
          name: 'inventory-transfers',
          component: () => import('@/views/inventory/Transfers.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'inventory/transfers/create',
          name: 'inventory-create-transfer',
          component: () => import('@/views/inventory/CreateTransfer.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'inventory/transfers/receive',
          name: 'inventory-receive-transfer',
          component: () => import('@/views/inventory/ReceiveTransfer.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'inventory/transfers/receive/:id',
          name: 'inventory-receive-transfer-id',
          component: () => import('@/views/inventory/ReceiveTransfer.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'inventory/transfers/:id/receive',
          name: 'inventory-receive-transfer-param',
          component: () => import('@/views/inventory/ReceiveTransfer.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'inventory/transfers/detail',
          name: 'inventory-transfer-detail-legacy',
          component: () => import('@/views/inventory/TransferDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'inventory/transfers/:id',
          name: 'inventory-transfer-detail',
          component: () => import('@/views/inventory/TransferDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'inventory/inbound-deliveries',
          name: 'inventory-inbound-deliveries',
          component: () => import('@/views/inventory/InboundDeliveries.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'inventory/inbound-deliveries/detail',
          name: 'inventory-inbound-delivery-detail-legacy',
          component: () => import('@/views/inventory/InboundDeliveryDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'inventory/inbound-deliveries/:id',
          name: 'inventory-inbound-delivery-detail',
          component: () => import('@/views/inventory/InboundDeliveryDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'inventory/inbound-deliveries/receive',
          name: 'inventory-receive-supplier-delivery',
          component: () => import('@/views/inventory/ReceiveSupplierDelivery.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'inventory/stock-requests',
          name: 'inventory-stock-requests',
          component: () => import('@/views/inventory/StockRequests.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'inventory/stock-requests/create',
          name: 'inventory-create-stock-request',
          component: () => import('@/views/inventory/CreateStockRequest.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'inventory/stock-requests/detail',
          name: 'inventory-stock-request-detail-legacy',
          component: () => import('@/views/inventory/StockRequestDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'inventory/stock-requests/:id',
          name: 'inventory-stock-request-detail',
          component: () => import('@/views/inventory/StockRequestDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'inventory/stock-adjustments',
          name: 'inventory-stock-adjustments',
          component: () => import('@/views/inventory/StockAdjustments.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'inventory/stock-adjustments/create',
          name: 'inventory-create-adjustment-request',
          component: () => import('@/views/inventory/CreateAdjustmentRequest.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'inventory/stock-adjustments/detail',
          name: 'inventory-adjustment-detail-legacy',
          component: () => import('@/views/inventory/AdjustmentDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'inventory/stock-adjustments/:id',
          name: 'inventory-adjustment-detail',
          component: () => import('@/views/inventory/AdjustmentDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'inventory/adjustments/:id',
          name: 'inventory-adjustment-detail-alias',
          component: () => import('@/views/inventory/AdjustmentDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'inventory/cycle-counts',
          name: 'inventory-cycle-counts',
          component: () => import('@/views/inventory/CycleCounts.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'inventory/cycle-counts/create',
          name: 'inventory-create-cycle-count',
          component: () => import('@/views/inventory/CreateCycleCount.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'inventory/cycle-counts/detail',
          name: 'inventory-cycle-count-detail-legacy',
          component: () => import('@/views/inventory/CycleCountDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'inventory/cycle-counts/:id',
          name: 'inventory-cycle-count-detail',
          component: () => import('@/views/inventory/CycleCountDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'inventory/stock-movement-ledger',
          name: 'inventory-stock-movement-ledger',
          component: () => import('@/views/inventory/StockMovementLedger.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'inventory/quarantine',
          name: 'inventory-quarantine',
          component: () => import('@/views/inventory/Quarantine.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'inventory/quarantine/create',
          name: 'inventory-create-quarantine',
          component: () => import('@/views/inventory/CreateQuarantineRecord.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'inventory/quarantine/detail',
          name: 'inventory-quarantine-detail-legacy',
          component: () => import('@/views/inventory/QuarantineDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'inventory/quarantine/:id',
          name: 'inventory-quarantine-detail',
          component: () => import('@/views/inventory/QuarantineDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },

        // --- SALES ---
        {
          path: 'sales/dashboard',
          name: 'sales-dashboard',
          component: () => import('@/views/sales/SalesDashboard.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/quotations',
          name: 'sales-quotations',
          component: () => import('@/views/sales/Quotations.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/quotations/create',
          name: 'sales-create-quotation',
          component: () => import('@/views/sales/CreateQuotation.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/quotations/detail',
          name: 'sales-quotation-detail-legacy',
          component: () => import('@/views/sales/QuotationDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/quotations/:id',
          name: 'sales-quotation-detail',
          component: () => import('@/views/sales/QuotationDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/orders',
          name: 'sales-orders',
          component: () => import('@/views/sales/Orders.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/orders/create',
          name: 'sales-create-order',
          component: () => import('@/views/sales/CreateSale.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/create-sale',
          name: 'sales-create-sale-alias',
          component: () => import('@/views/sales/CreateSale.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/orders/detail',
          name: 'sales-order-detail-legacy',
          component: () => import('@/views/sales/OrderDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/orders/:id',
          name: 'sales-order-detail',
          component: () => import('@/views/sales/OrderDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/invoices',
          name: 'sales-invoices',
          component: () => import('@/views/sales/Invoices.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/invoices/create',
          name: 'sales-create-invoice',
          component: () => import('@/views/sales/CreateInvoice.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/invoices/detail',
          name: 'sales-invoice-detail-legacy',
          component: () => import('@/views/sales/InvoiceDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/invoices/:id',
          name: 'sales-invoice-detail',
          component: () => import('@/views/sales/InvoiceDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/payments',
          name: 'sales-payments',
          component: () => import('@/views/sales/Payments.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/payments/create',
          name: 'sales-create-payment',
          component: () => import('@/views/sales/CreatePayment.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/payments/detail',
          name: 'sales-payment-detail-legacy',
          component: () => import('@/views/sales/PaymentDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/payments/:id',
          name: 'sales-payment-detail',
          component: () => import('@/views/sales/PaymentDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/customers',
          name: 'sales-customers',
          component: () => import('@/views/sales/Customers.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/customers/create',
          name: 'sales-create-customer',
          component: () => import('@/views/sales/CreateCustomer.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/customers/detail',
          name: 'sales-customer-detail-legacy',
          component: () => import('@/views/sales/CustomerDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/customers/:id',
          name: 'sales-customer-detail',
          component: () => import('@/views/sales/CustomerDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/leads',
          name: 'sales-leads',
          component: () => import('@/views/sales/Leads.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/leads/create',
          name: 'sales-create-lead',
          component: () => import('@/views/sales/CreateLead.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/leads/detail',
          name: 'sales-lead-detail-legacy',
          component: () => import('@/views/sales/LeadDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/leads/:id',
          name: 'sales-lead-detail',
          component: () => import('@/views/sales/LeadDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/follow-ups',
          name: 'sales-follow-ups',
          component: () => import('@/views/sales/FollowUps.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/follow-ups/create',
          name: 'sales-create-follow-up',
          component: () => import('@/views/sales/CreateFollowUp.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/follow-ups/detail',
          name: 'sales-follow-up-detail-legacy',
          component: () => import('@/views/sales/FollowUpDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/follow-ups/:id',
          name: 'sales-follow-up-detail',
          component: () => import('@/views/sales/FollowUpDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/custom-orders',
          name: 'sales-custom-orders',
          component: () => import('@/views/sales/CustomOrders.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/custom-orders/create',
          name: 'sales-create-custom-order',
          component: () => import('@/views/sales/CreateCustomOrder.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/custom-orders/detail',
          name: 'sales-custom-order-detail-legacy',
          component: () => import('@/views/sales/CustomOrderDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/custom-orders/:id',
          name: 'sales-custom-order-detail',
          component: () => import('@/views/sales/CustomOrderDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/delivery',
          name: 'sales-delivery',
          component: () => import('@/views/sales/DeliveryHandover.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/delivery/create',
          name: 'sales-create-delivery',
          component: () => import('@/views/sales/CreateDeliveryHandover.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/delivery/detail',
          name: 'sales-delivery-detail-legacy',
          component: () => import('@/views/sales/DeliveryHandoverDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/delivery/:id',
          name: 'sales-delivery-detail',
          component: () => import('@/views/sales/DeliveryHandoverDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/returns',
          name: 'sales-returns',
          component: () => import('@/views/sales/Returns.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/returns/create',
          name: 'sales-create-return',
          component: () => import('@/views/sales/CreateReturn.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/returns/detail',
          name: 'sales-return-detail-legacy',
          component: () => import('@/views/sales/ReturnDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'sales/returns/:id',
          name: 'sales-return-detail',
          component: () => import('@/views/sales/ReturnDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },

        // --- AFTER-SALES ---
        {
          path: 'after-sales/dashboard',
          name: 'after-sales-dashboard',
          component: () => import('@/views/after-sales/AfterSalesDashboard.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'after-sales/warranty',
          name: 'after-sales-warranty',
          component: () => import('@/views/after-sales/WarrantyService.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'after-sales/warranty/create',
          name: 'after-sales-create-case',
          component: () => import('@/views/after-sales/CreateCase.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'after-sales/create-case',
          name: 'after-sales-create-case-alias',
          component: () => import('@/views/after-sales/CreateCase.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'after-sales/warranty/detail',
          name: 'after-sales-case-detail-legacy',
          component: () => import('@/views/after-sales/CaseDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'after-sales/warranty/:id',
          name: 'after-sales-case-detail',
          component: () => import('@/views/after-sales/CaseDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'after-sales/cases/:id',
          name: 'after-sales-case-detail-canonical',
          component: () => import('@/views/after-sales/CaseDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'after-sales/cases',
          redirect: '/after-sales/warranty'
        },
        {
          path: 'after-sales/warranties',
          redirect: '/after-sales/warranty'
        },
        {
          path: 'after-sales/repairs',
          name: 'after-sales-repairs',
          component: () => import('@/views/after-sales/RepairJobs.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'after-sales/repairs/create',
          name: 'after-sales-create-repair',
          component: () => import('@/views/after-sales/CreateRepairJob.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'after-sales/create-repair',
          name: 'after-sales-create-repair-alias',
          component: () => import('@/views/after-sales/CreateRepairJob.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'after-sales/repairs/detail',
          name: 'after-sales-repair-detail-legacy',
          component: () => import('@/views/after-sales/RepairDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'after-sales/repairs/:id',
          name: 'after-sales-repair-detail',
          component: () => import('@/views/after-sales/RepairDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },

        // --- FINANCE ---
        {
          path: 'finance/expenses',
          name: 'finance-expenses',
          component: () => import('@/views/finance/Expenses.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'finance/expenses/create',
          name: 'finance-create-expense',
          component: () => import('@/views/finance/CreateExpense.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'finance/create-expense',
          name: 'finance-create-expense-alias',
          component: () => import('@/views/finance/CreateExpense.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'finance/expenses/detail',
          name: 'finance-expense-detail-legacy',
          component: () => import('@/views/finance/ExpenseDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'finance/expenses/:id',
          name: 'finance-expense-detail',
          component: () => import('@/views/finance/ExpenseDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'finance/overview',
          name: 'finance-overview',
          component: () => import('@/views/finance/FinanceOverview.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin'] }
        },
        {
          path: 'finance/receivables',
          name: 'finance-receivables',
          component: () => import('@/views/finance/Receivables.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin'] }
        },
        {
          path: 'finance/payables',
          name: 'finance-payables',
          component: () => import('@/views/finance/Payables.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin'] }
        },
        {
          path: 'finance/cash-bank',
          name: 'finance-cash-bank',
          component: () => import('@/views/finance/CashBank.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },

        // --- COMMUNICATION ---
        {
          path: 'communication/inbox',
          name: 'communication-inbox',
          component: () => import('@/views/communication/ManagementInbox.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'communication/inbox/create',
          name: 'communication-create-conversation',
          component: () => import('@/views/communication/CreateConversation.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'communication/inbox/detail',
          name: 'communication-inbox-detail-legacy',
          component: () => import('@/views/communication/ConversationDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'communication/inbox/:id',
          name: 'communication-inbox-detail',
          component: () => import('@/views/communication/ConversationDetail.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'communication/notifications',
          name: 'communication-notifications',
          component: () => import('@/views/communication/Notifications.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },

        // --- ANALYTICS ---
        {
          path: 'analytics/reports-hub',
          name: 'analytics-reports-hub',
          component: () => import('@/views/analytics/ReportsHub.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'analytics/reports/build',
          name: 'analytics-build-report',
          component: () => import('@/views/analytics/BuildReport.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'analytics/reports/sales',
          name: 'analytics-sales-report',
          component: () => import('@/views/analytics/SalesReport.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'analytics/reports/inventory',
          name: 'analytics-inventory-report',
          component: () => import('@/views/analytics/InventoryReport.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'analytics/reports/procurement',
          name: 'analytics-procurement-report',
          component: () => import('@/views/analytics/ProcurementReport.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin'] }
        },
        {
          path: 'analytics/reports/expense',
          name: 'analytics-expense-report',
          component: () => import('@/views/analytics/ExpenseReport.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin'] }
        },
        {
          path: 'analytics/reports/profitability',
          name: 'analytics-profitability-report',
          component: () => import('@/views/analytics/ProfitabilityReport.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin'] }
        },
        {
          path: 'analytics/reports/crm',
          name: 'analytics-crm-report',
          component: () => import('@/views/analytics/CrmReport.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'analytics/reports/branch',
          name: 'analytics-branch-report',
          component: () => import('@/views/analytics/BranchReport.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin'] }
        },

        // --- SYSTEM ---
        {
          path: 'system/audit-log',
          name: 'system-audit-log',
          component: () => import('@/views/system/AuditLog.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'system/audit-log/:id',
          name: 'system-audit-log-detail',
          component: () => import('@/views/system/AuditLog.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'audit-logs/:id',
          name: 'audit-log-direct-alias',
          component: () => import('@/views/system/AuditLog.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'audit-log/:id',
          name: 'audit-log-direct-alias-2',
          component: () => import('@/views/system/AuditLog.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'system/settings',
          name: 'system-settings',
          component: () => import('@/views/system/Settings.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin'] }
        },
        {
          path: 'system/branch-team',
          name: 'system-branch-team',
          component: () => import('@/views/system/BranchTeam.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'system/account',
          name: 'system-account',
          component: () => import('@/views/system/Account.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'system/security',
          name: 'system-security',
          component: () => import('@/views/system/SecuritySessions.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin'] }
        },
        {
          path: 'system/preferences',
          name: 'system-preferences',
          component: () => import('@/views/system/Preferences.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        },
        {
          path: 'system/logout',
          name: 'system-logout',
          component: () => import('@/views/system/Logout.vue'),
          meta: { requiresAuth: true, roles: ['Super Admin', 'Branch Manager'] }
        }
      ]
    },
    // Catch-all 404 Route
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard'
    }
  ]
})

// Authentication & Role-Based Authorization Guard
router.beforeEach((to, from, next) => {
  // Public auth paths that don't require login
  const publicPaths = ['/login', '/forgot-password', '/verify-identity', '/create-new-password', '/password-updated']
  const isPublic = publicPaths.includes(to.path) || (to.meta && to.meta.isPublic)
  const isAuthenticated = store.currentUser && store.currentUser.isAuthenticated

  if (!isAuthenticated && !isPublic) {
    // Redirect unauthenticated requests to login
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }

  if (isAuthenticated && isPublic && to.path === '/login') {
    // Already authenticated, redirect to dashboard
    return next({ path: '/dashboard' })
  }

  // Check Role Authorization
  if (isAuthenticated && to.meta && to.meta.roles && Array.isArray(to.meta.roles)) {
    const userRole = store.currentUser.role || (store.currentUser.isSuperAdmin ? 'Super Admin' : 'Branch Manager')
    const isSuperAdmin = store.currentUser.isSuperAdmin || userRole === 'Super Admin'
    
    // Super Admin can access everything; other roles must match meta.roles
    const isAuthorized = isSuperAdmin || to.meta.roles.includes(userRole)
    
    if (!isAuthorized) {
      console.warn(`[Auth Guard] Access denied to ${to.path} for role ${userRole}`)
      return next({ path: '/dashboard' })
    }
  }

  next()
})

export default router
