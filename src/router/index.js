import { createRouter, createWebHistory } from 'vue-router'

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
          component: () => import('@/views/auth/Login.vue')
        },
        {
          path: 'forgot-password',
          name: 'forgot-password',
          component: () => import('@/views/auth/ForgotPassword.vue')
        },
        {
          path: 'verify-identity',
          name: 'verify-identity',
          component: () => import('@/views/auth/VerifyIdentity.vue')
        },
        {
          path: 'create-new-password',
          name: 'create-new-password',
          component: () => import('@/views/auth/CreateNewPassword.vue')
        },
        {
          path: 'password-updated',
          name: 'password-updated',
          component: () => import('@/views/auth/PasswordUpdated.vue')
        }
      ]
    },
    // Main Application Routes
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/dashboard/SuperAdminDashboard.vue')
        },
        {
          path: 'dashboard/branch-performance',
          name: 'branch-performance',
          component: () => import('@/views/dashboard/BranchPerformance.vue')
        },
        {
          path: 'dashboard/business-performance',
          name: 'business-performance',
          component: () => import('@/views/dashboard/BusinessPerformance.vue')
        },
        {
          path: 'dashboard/action-centre',
          name: 'action-centre',
          component: () => import('@/views/dashboard/ActionCentre.vue')
        },
        {
          path: 'organisation/branches',
          name: 'organisation-branches',
          component: () => import('@/views/organisation/Branches.vue'),
          children: [
            {
              path: 'create',
              name: 'organisation-create-branch',
              component: () => import('@/views/organisation/CreateBranch.vue')
            },
            {
              path: 'edit',
              name: 'organisation-edit-branch',
              component: () => import('@/views/organisation/EditBranch.vue')
            }
          ]
        },
        {
          path: 'organisation/branches/detail',
          name: 'organisation-branch-detail',
          component: () => import('@/views/organisation/BranchDetail.vue')
        },
        {
          path: 'organisation/users',
          name: 'organisation-users',
          component: () => import('@/views/organisation/UsersAccess.vue'),
          children: [
            {
              path: 'create',
              name: 'organisation-create-user',
              component: () => import('@/views/organisation/CreateUser.vue')
            },
            {
              path: 'edit',
              name: 'organisation-edit-user',
              component: () => import('@/views/organisation/EditUser.vue')
            }
          ]
        },
        {
          path: 'organisation/roles',
          name: 'organisation-roles',
          component: () => import('@/views/organisation/RolesPermissions.vue'),
          children: [
            {
              path: 'create',
              name: 'organisation-create-role',
              component: () => import('@/views/organisation/CreateRole.vue')
            }
          ]
        },
        {
          path: 'organisation/users/detail',
          name: 'organisation-user-detail',
          component: () => import('@/views/organisation/UserDetail.vue')
        },
        {
          path: 'catalogue/categories',
          name: 'catalogue-categories',
          component: () => import('@/views/catalogue/Categories.vue'),
          children: [
            {
              path: 'create',
              name: 'catalogue-create-category',
              component: () => import('@/views/catalogue/CreateCategory.vue')
            }
          ]
        },
        {
          path: 'catalogue/products',
          name: 'catalogue-products',
          component: () => import('@/views/catalogue/Products.vue'),
          children: [
            {
              path: 'create',
              name: 'catalogue-create-product',
              component: () => import('@/views/catalogue/CreateProduct.vue')
            },
            {
              path: 'edit',
              name: 'catalogue-edit-product',
              component: () => import('@/views/catalogue/EditProduct.vue')
            }
          ]
        },
        {
          path: 'catalogue/products/detail',
          name: 'catalogue-product-detail',
          component: () => import('@/views/catalogue/ProductDetail.vue')
        },
        {
          path: 'catalogue/pricing',
          name: 'catalogue-pricing',
          component: () => import('@/views/catalogue/Pricing.vue'),
          children: [
            {
              path: 'create',
              name: 'catalogue-create-price-rule',
              component: () => import('@/views/catalogue/CreatePriceRule.vue')
            },
            {
              path: 'edit',
              name: 'catalogue-edit-price-rule',
              component: () => import('@/views/catalogue/EditPriceRule.vue')
            }
          ]
        },
        {
          path: 'catalogue/requests',
          name: 'catalogue-requests',
          component: () => import('@/views/catalogue/ProductRequests.vue')
        },
        {
          path: 'catalogue/requests/detail',
          name: 'catalogue-request-detail',
          component: () => import('@/views/catalogue/ProductRequestDetail.vue')
        },
        {
          path: 'procurement/suppliers',
          name: 'procurement-suppliers',
          component: () => import('@/views/procurement/Suppliers.vue'),
          children: [
            {
              path: 'create',
              name: 'procurement-create-supplier',
              component: () => import('@/views/procurement/CreateSupplier.vue')
            },
            {
              path: 'edit',
              name: 'procurement-edit-supplier',
              component: () => import('@/views/procurement/EditSupplier.vue')
            }
          ]
        },
        {
          path: 'procurement/suppliers/detail',
          name: 'procurement-supplier-detail',
          component: () => import('@/views/procurement/SupplierDetail.vue')
        },
        {
          path: 'procurement/purchase-orders',
          name: 'procurement-purchase-orders',
          component: () => import('@/views/procurement/PurchaseOrders.vue'),
          children: [
            {
              path: 'create',
              name: 'procurement-create-purchase-order',
              component: () => import('@/views/procurement/CreatePurchaseOrder.vue')
            }
          ]
        },
        {
          path: 'procurement/purchase-orders/detail',
          name: 'procurement-purchase-order-detail',
          component: () => import('@/views/procurement/PurchaseOrderDetail.vue')
        },
        {
          path: 'procurement/receipts',
          name: 'procurement-receipts',
          component: () => import('@/views/procurement/ReceivePurchase.vue')
        },
        {
          path: 'procurement/receipts/detail',
          name: 'procurement-receipt-detail',
          component: () => import('@/views/procurement/ReceiptDetail.vue')
        },
        {
          path: 'procurement/landed-costs',
          name: 'procurement-landed-costs',
          component: () => import('@/views/procurement/LandedCost.vue')
        },
        {
          path: 'procurement/vendor-bills',
          name: 'procurement-vendor-bills',
          component: () => import('@/views/procurement/VendorBills.vue')
        },
        {
          path: 'procurement/purchase-returns',
          name: 'procurement-purchase-returns',
          component: () => import('@/views/procurement/PurchaseReturns.vue'),
          children: [
            {
              path: 'create',
              name: 'procurement-create-purchase-return',
              component: () => import('@/views/procurement/CreatePurchaseReturn.vue')
            }
          ]
        },
        {
          path: 'procurement/purchase-returns/detail',
          name: 'procurement-purchase-return-detail',
          component: () => import('@/views/procurement/PurchaseReturnDetail.vue')
        },
        {
          path: 'inventory/dashboard',
          name: 'inventory-dashboard',
          component: () => import('@/views/inventory/InventoryDashboard.vue')
        },
        {
          path: 'inventory/stock-by-product',
          name: 'inventory-stock-by-product',
          component: () => import('@/views/inventory/StockByProduct.vue')
        },
        {
          path: 'inventory/serialized-units',
          name: 'inventory-serialized-units',
          component: () => import('@/views/inventory/SerializedUnits.vue')
        },
        {
          path: 'inventory/serialized-units/detail',
          name: 'inventory-serialized-unit-detail',
          component: () => import('@/views/inventory/UnitDetail.vue')
        },
        {
          path: 'inventory/transfers',
          name: 'inventory-transfers',
          component: () => import('@/views/inventory/Transfers.vue'),
          children: [
            {
              path: 'create',
              name: 'inventory-create-transfer',
              component: () => import('@/views/inventory/CreateTransfer.vue')
            }
          ]
        },
        {
          path: 'inventory/transfers/detail',
          name: 'inventory-transfer-detail',
          component: () => import('@/views/inventory/TransferDetail.vue')
        },
        {
          path: 'inventory/stock-requests',
          name: 'inventory-stock-requests',
          component: () => import('@/views/inventory/StockRequests.vue')
        },
        {
          path: 'inventory/stock-requests/detail',
          name: 'inventory-stock-request-detail',
          component: () => import('@/views/inventory/StockRequestDetail.vue')
        },
        {
          path: 'inventory/stock-adjustments',
          name: 'inventory-stock-adjustments',
          component: () => import('@/views/inventory/StockAdjustments.vue')
        },
        {
          path: 'inventory/stock-adjustments/detail',
          name: 'inventory-stock-adjustment-detail',
          component: () => import('@/views/inventory/AdjustmentDetail.vue')
        },
        {
          path: 'inventory/cycle-counts',
          name: 'inventory-cycle-counts',
          component: () => import('@/views/inventory/CycleCounts.vue'),
          children: [
            {
              path: 'create',
              name: 'inventory-create-cycle-count',
              component: () => import('@/views/inventory/CreateCycleCount.vue')
            }
          ]
        },
        {
          path: 'inventory/cycle-counts/detail',
          name: 'inventory-cycle-count-detail',
          component: () => import('@/views/inventory/CycleCountDetail.vue')
        },
        {
          path: 'inventory/stock-movement-ledger',
          name: 'inventory-stock-movement-ledger',
          component: () => import('@/views/inventory/StockMovementLedger.vue')
        },
        {
          path: 'inventory/quarantine',
          name: 'inventory-quarantine',
          component: () => import('@/views/inventory/Quarantine.vue')
        },
        {
          path: 'sales/dashboard',
          name: 'sales-dashboard',
          component: () => import('@/views/sales/SalesDashboard.vue')
        },
        {
          path: 'sales/quotations',
          name: 'sales-quotations',
          component: () => import('@/views/sales/Quotations.vue'),
        },
        {
          path: 'sales/quotations/detail',
          name: 'sales-quotation-detail',
          component: () => import('@/views/sales/QuotationDetail.vue')
        },
        {
          path: 'sales/orders',
          name: 'sales-orders',
          component: () => import('@/views/sales/Orders.vue')
        },
        {
          path: 'sales/orders/detail',
          name: 'sales-order-detail',
          component: () => import('@/views/sales/OrderDetail.vue')
        },
        {
          path: 'sales/invoices',
          name: 'sales-invoices',
          component: () => import('@/views/sales/Invoices.vue')
        },
        {
          path: 'sales/invoices/detail',
          name: 'sales-invoice-detail',
          component: () => import('@/views/sales/InvoiceDetail.vue')
        },
        {
          path: 'sales/payments',
          name: 'sales-payments',
          component: () => import('@/views/sales/Payments.vue')
        },
        {
          path: 'sales/customers',
          name: 'sales-customers',
          component: () => import('@/views/sales/Customers.vue')
        },
        {
          path: 'sales/customers/detail',
          name: 'sales-customer-detail',
          component: () => import('@/views/sales/CustomerDetail.vue')
        },

        {
          path: 'sales/leads',
          name: 'sales-leads',
          component: () => import('@/views/sales/Leads.vue')
        },
        {
          path: 'sales/leads/detail',
          name: 'sales-lead-detail',
          component: () => import('@/views/sales/LeadDetail.vue')
        },
        {
          path: 'sales/follow-ups',
          name: 'sales-follow-ups',
          component: () => import('@/views/sales/FollowUps.vue')
        },
        {
          path: 'sales/custom-orders',
          name: 'sales-custom-orders',
          component: () => import('@/views/sales/CustomOrders.vue')
        },
        {
          path: 'sales/custom-orders/detail',
          name: 'sales-custom-order-detail',
          component: () => import('@/views/sales/CustomOrderDetail.vue')
        },

        {
          path: 'sales/delivery',
          name: 'sales-delivery',
          component: () => import('@/views/sales/DeliveryHandover.vue')
        },
        {
          path: 'sales/returns',
          name: 'sales-returns',
          component: () => import('@/views/sales/Returns.vue')
        },
        {
          path: 'sales/returns/detail',
          name: 'sales-return-detail',
          component: () => import('@/views/sales/ReturnDetail.vue')
        },
        {
          path: 'after-sales/dashboard',
          name: 'after-sales-dashboard',
          component: () => import('@/views/after-sales/AfterSalesDashboard.vue')
        },
        {
          path: 'after-sales/warranty',
          name: 'after-sales-warranty',
          component: () => import('@/views/after-sales/WarrantyService.vue'),
          children: [
            {
              path: 'create',
              name: 'after-sales-create-case',
              component: () => import('@/views/after-sales/CreateCase.vue')
            }
          ]
        },
        {
          path: 'after-sales/warranty/detail',
          name: 'after-sales-case-detail',
          component: () => import('@/views/after-sales/CaseDetail.vue')
        },
        {
          path: 'after-sales/repairs',
          name: 'after-sales-repairs',
          component: () => import('@/views/after-sales/RepairJobs.vue'),
          children: [
            {
              path: 'create',
              name: 'after-sales-create-repair',
              component: () => import('@/views/after-sales/CreateRepairJob.vue')
            }
          ]
        },
        {
          path: 'after-sales/repairs/detail',
          name: 'after-sales-repair-detail',
          component: () => import('@/views/after-sales/RepairDetail.vue')
        },
        {
          path: 'finance/expenses',
          name: 'finance-expenses',
          component: () => import('@/views/finance/Expenses.vue'),
          children: [
            {
              path: 'create',
              name: 'finance-create-expense',
              component: () => import('@/views/finance/CreateExpense.vue')
            }
          ]
        },
        {
          path: 'finance/expenses/detail',
          name: 'finance-expense-detail',
          component: () => import('@/views/finance/ExpenseDetail.vue')
        },
        {
          path: 'finance/overview',
          name: 'finance-overview',
          component: () => import('@/views/finance/FinanceOverview.vue')
        },
        {
          path: 'finance/receivables',
          name: 'finance-receivables',
          component: () => import('@/views/finance/Receivables.vue')
        },
        {
          path: 'finance/payables',
          name: 'finance-payables',
          component: () => import('@/views/finance/Payables.vue')
        },
        {
          path: 'finance/cash-bank',
          name: 'finance-cash-bank',
          component: () => import('@/views/finance/CashBank.vue')
        },
        {
          path: 'communication/inbox',
          name: 'communication-inbox',
          component: () => import('@/views/communication/ManagementInbox.vue')
        },
        {
          path: 'communication/inbox/detail',
          name: 'communication-inbox-detail',
          component: () => import('@/views/communication/ConversationDetail.vue')
        },
        {
          path: 'communication/notifications',
          name: 'communication-notifications',
          component: () => import('@/views/communication/Notifications.vue')
        },
        {
          path: 'analytics/reports-hub',
          name: 'analytics-reports-hub',
          component: () => import('@/views/analytics/ReportsHub.vue')
        },
        {
          path: 'analytics/reports/sales',
          name: 'analytics-sales-report',
          component: () => import('@/views/analytics/SalesReport.vue')
        },
        {
          path: 'analytics/reports/inventory',
          name: 'analytics-inventory-report',
          component: () => import('@/views/analytics/InventoryReport.vue')
        },
        {
          path: 'analytics/reports/procurement',
          name: 'analytics-procurement-report',
          component: () => import('@/views/analytics/ProcurementReport.vue')
        },
        {
          path: 'analytics/reports/expense',
          name: 'analytics-expense-report',
          component: () => import('@/views/analytics/ExpenseReport.vue')
        },
        {
          path: 'analytics/reports/profitability',
          name: 'analytics-profitability-report',
          component: () => import('@/views/analytics/ProfitabilityReport.vue')
        },
        {
          path: 'analytics/reports/crm',
          name: 'analytics-crm-report',
          component: () => import('@/views/analytics/CrmReport.vue')
        },
        {
          path: 'analytics/reports/branch',
          name: 'analytics-branch-report',
          component: () => import('@/views/analytics/BranchReport.vue')
        },
        {
          path: 'system/audit-log',
          name: 'system-audit-log',
          component: () => import('@/views/system/AuditLog.vue')
        },
        {
          path: 'system/settings',
          name: 'system-settings',
          component: () => import('@/views/system/Settings.vue')
        },
        {
          path: 'system/account',
          name: 'system-account',
          component: () => import('@/views/system/Account.vue')
        },
        {
          path: 'system/security',
          name: 'system-security',
          component: () => import('@/views/system/SecuritySessions.vue')
        },
        {
          path: 'system/preferences',
          name: 'system-preferences',
          component: () => import('@/views/system/Preferences.vue')
        },
        {
          path: 'system/logout',
          name: 'system-logout',
          component: () => import('@/views/system/Logout.vue')
        }
      ]
    }
  ],
})

export default router
