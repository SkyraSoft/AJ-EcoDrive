/**
 * Navigation & Route Context Resolver for Interactive Tour
 * Provides human-readable breadcrumb, module, page, tab, section,
 * and sidebar navigation pathway instructions for any tour route.
 */

const ROUTE_DIRECTORY = [
  // Dashboard
  { prefix: '/dashboard/branch-performance', module: 'HOME', page: 'Branch Performance', path: 'Home › Branch Performance', nav: 'Left Sidebar → Home → Branch Performance', defaultTab: 'Branch Performance Matrix' },
  { prefix: '/dashboard/business-performance', module: 'HOME', page: 'Business Performance', path: 'Home › Business Performance', nav: 'Left Sidebar → Home → Business Performance', defaultTab: 'Commercial Financials' },
  { prefix: '/dashboard/action-centre', module: 'HOME', page: 'Action Centre', path: 'Home › Action Centre', nav: 'Left Sidebar → Home → Action Centre', defaultTab: 'Active Task Queues' },
  { prefix: '/dashboard/quick-actions', module: 'HOME', page: 'Quick Actions', path: 'Home › Quick Actions', nav: 'Left Sidebar → Home → Quick Actions', defaultTab: 'Shortcuts' },
  { prefix: '/dashboard', module: 'HOME', page: 'Executive Dashboard', path: 'Home › Dashboard', nav: 'Left Sidebar → Home → Dashboard', defaultTab: 'Overview KPIs' },

  // Organisation
  { prefix: '/organisation/branches/create', module: 'ORGANISATION', page: 'Create Dealership Branch', path: 'Organisation › Branches › Create Branch', nav: 'Left Sidebar → Organisation → Branches → + Add Branch', defaultTab: 'New Branch Registration' },
  { prefix: '/organisation/branches/edit', module: 'ORGANISATION', page: 'Edit Branch', path: 'Organisation › Branches › Edit', nav: 'Left Sidebar → Organisation → Branches → Edit', defaultTab: 'Branch Profile' },
  { prefix: '/organisation/branches/detail', module: 'ORGANISATION', page: 'Branch Detail', path: 'Organisation › Branches › Detail', nav: 'Left Sidebar → Organisation → Branches → View', defaultTab: 'Branch Profile' },
  { prefix: '/organisation/branches', module: 'ORGANISATION', page: 'Branch Network', path: 'Organisation › Branches', nav: 'Left Sidebar → Organisation → Branches', defaultTab: 'Dealership Roster (All Branches)' },
  { prefix: '/organisation/users/create', module: 'ORGANISATION', page: 'Create System User', path: 'Organisation › Users & Access › Create User', nav: 'Left Sidebar → Organisation → Users & Access → + Add User', defaultTab: 'New User Registration' },
  { prefix: '/organisation/users/edit', module: 'ORGANISATION', page: 'Edit System User', path: 'Organisation › Users & Access › Edit User', nav: 'Left Sidebar → Organisation → Users & Access → Edit', defaultTab: 'User Profile' },
  { prefix: '/organisation/users', module: 'ORGANISATION', page: 'Users & Access', path: 'Organisation › Users & Access', nav: 'Left Sidebar → Organisation → Users & Access', defaultTab: 'User Directory (All Accounts)' },
  { prefix: '/organisation/roles/create', module: 'ORGANISATION', page: 'Create Role', path: 'Organisation › Roles & Permissions › Create Role', nav: 'Left Sidebar → Organisation → Roles & Permissions → + Add Role', defaultTab: 'New Role Definition' },
  { prefix: '/organisation/roles', module: 'ORGANISATION', page: 'Roles & Permissions', path: 'Organisation › Roles & Permissions', nav: 'Left Sidebar → Organisation → Roles & Permissions', defaultTab: 'Permissions Matrix' },

  // Catalogue
  { prefix: '/catalogue/categories', module: 'CATALOGUE', page: 'Categories', path: 'Catalogue › Categories', nav: 'Left Sidebar → Catalogue → Categories', defaultTab: 'Vehicle Categories' },
  { prefix: '/catalogue/products/create', module: 'CATALOGUE', page: 'Create EV Product', path: 'Catalogue › Products › Create Product', nav: 'Left Sidebar → Catalogue → Products → + Add Product', defaultTab: 'New Model Specification' },
  { prefix: '/catalogue/products/edit', module: 'CATALOGUE', page: 'Edit EV Product', path: 'Catalogue › Products › Edit Product', nav: 'Left Sidebar → Catalogue → Products → Edit', defaultTab: 'Model Specifications' },
  { prefix: '/catalogue/products', module: 'CATALOGUE', page: 'EV Models & Products', path: 'Catalogue › Products', nav: 'Left Sidebar → Catalogue → Products', defaultTab: 'Model Catalogue' },
  { prefix: '/catalogue/pricing', module: 'CATALOGUE', page: 'Pricing Matrix & Margins', path: 'Catalogue › Pricing', nav: 'Left Sidebar → Catalogue → Pricing', defaultTab: 'Pricing Rules Matrix' },
  { prefix: '/catalogue/requests', module: 'CATALOGUE', page: 'Showroom Product Requests', path: 'Catalogue › Product Requests', nav: 'Left Sidebar → Catalogue → Product Requests', defaultTab: 'Showroom Requests Queue' },

  // Procurement
  { prefix: '/procurement/suppliers', module: 'PROCUREMENT', page: 'Suppliers Directory', path: 'Procurement › Suppliers', nav: 'Left Sidebar → Procurement → Suppliers', defaultTab: 'OEM Suppliers' },
  { prefix: '/procurement/purchase-orders/create', module: 'PROCUREMENT', page: 'Create Purchase Order', path: 'Procurement › Purchase Orders › Create PO', nav: 'Left Sidebar → Procurement → Purchase Orders → + Create PO', defaultTab: 'New PO Form' },
  { prefix: '/procurement/purchase-orders', module: 'PROCUREMENT', page: 'Purchase Orders', path: 'Procurement › Purchase Orders', nav: 'Left Sidebar → Procurement → Purchase Orders', defaultTab: 'Purchase Orders Register' },
  { prefix: '/procurement/receipts', module: 'PROCUREMENT', page: 'Goods Receipts (GRN)', path: 'Procurement › Receipts', nav: 'Left Sidebar → Procurement → Receipts', defaultTab: 'Goods Receipts Log' },
  { prefix: '/procurement/landed-costs', module: 'PROCUREMENT', page: 'Landed Cost Adjustments', path: 'Procurement › Landed Costs', nav: 'Left Sidebar → Procurement → Landed Costs', defaultTab: 'Landed Cost Allocations' },
  { prefix: '/procurement/vendor-bills', module: 'PROCUREMENT', page: 'Vendor Bills & Invoices', path: 'Procurement › Vendor Bills', nav: 'Left Sidebar → Procurement → Vendor Bills', defaultTab: 'Vendor Bills Register' },
  { prefix: '/procurement/purchase-returns', module: 'PROCUREMENT', page: 'Purchase Returns', path: 'Procurement › Purchase Returns', nav: 'Left Sidebar → Procurement → Purchase Returns', defaultTab: 'Purchase Returns Log' },

  // Inventory
  { prefix: '/inventory/dashboard', module: 'INVENTORY', page: 'Inventory Dashboard', path: 'Inventory › Dashboard', nav: 'Left Sidebar → Inventory → Inventory Dashboard', defaultTab: 'Stock Overview' },
  { prefix: '/inventory/stock-by-product', module: 'INVENTORY', page: 'Stock by Product', path: 'Inventory › Stock by Product', nav: 'Left Sidebar → Inventory → Stock by Product', defaultTab: 'Stock by Product' },
  { prefix: '/inventory/serialized-units', module: 'INVENTORY', page: 'Serialized Units (VINs)', path: 'Inventory › Serialized Units', nav: 'Left Sidebar → Inventory → Serialized Units', defaultTab: 'All Chassis Units (VINs)' },
  { prefix: '/inventory/transfers/create', module: 'INVENTORY', page: 'Create Stock Transfer', path: 'Inventory › Transfers › Create Transfer', nav: 'Left Sidebar → Inventory → Transfers → + Create Transfer', defaultTab: 'Dispatch Transfer' },
  { prefix: '/inventory/transfers', module: 'INVENTORY', page: 'Inter-Branch Transfers', path: 'Inventory › Transfers', nav: 'Left Sidebar → Inventory → Transfers', defaultTab: 'Transfer Dispatches' },
  { prefix: '/inventory/stock-requests', module: 'INVENTORY', page: 'Stock Requests', path: 'Inventory › Stock Requests', nav: 'Left Sidebar → Inventory → Stock Requests', defaultTab: 'Replenishment Queue' },
  { prefix: '/inventory/stock-adjustments', module: 'INVENTORY', page: 'Stock Adjustments', path: 'Inventory › Stock Adjustments', nav: 'Left Sidebar → Inventory → Stock Adjustments', defaultTab: 'Adjustment Log' },
  { prefix: '/inventory/cycle-counts', module: 'INVENTORY', page: 'Cycle Counts', path: 'Inventory › Cycle Counts', nav: 'Left Sidebar → Inventory → Cycle Counts', defaultTab: 'Physical Audit Counts' },
  { prefix: '/inventory/stock-movement-ledger', module: 'INVENTORY', page: 'Stock Movement Ledger', path: 'Inventory › Movement Ledger', nav: 'Left Sidebar → Inventory → Stock Movement Ledger', defaultTab: 'Movement Ledger' },
  { prefix: '/inventory/quarantine', module: 'INVENTORY', page: 'Quarantine & Damaged Units', path: 'Inventory › Quarantine', nav: 'Left Sidebar → Inventory → Damaged / Quarantine', defaultTab: 'Quarantine Units' },

  // Sales & CRM
  { prefix: '/sales/dashboard', module: 'SALES & CRM', page: 'Sales Dashboard', path: 'Sales › Dashboard', nav: 'Left Sidebar → Sales & CRM → Sales Dashboard', defaultTab: 'Sales Analytics' },
  { prefix: '/sales/quotations', module: 'SALES & CRM', page: 'Commercial Quotations', path: 'Sales › Quotations', nav: 'Left Sidebar → Sales & CRM → Quotations', defaultTab: 'Quotations Register' },
  { prefix: '/sales/orders', module: 'SALES & CRM', page: 'Sales Orders', path: 'Sales › Orders', nav: 'Left Sidebar → Sales & CRM → Orders', defaultTab: 'Orders Register' },
  { prefix: '/sales/invoices', module: 'SALES & CRM', page: 'Customer Invoices', path: 'Sales › Invoices', nav: 'Left Sidebar → Sales & CRM → Invoices', defaultTab: 'Invoices Register' },
  { prefix: '/sales/payments', module: 'SALES & CRM', page: 'Payment Receipts', path: 'Sales › Payments', nav: 'Left Sidebar → Sales & CRM → Payments', defaultTab: 'Payments Log' },
  { prefix: '/sales/customers', module: 'SALES & CRM', page: 'Customer Directory', path: 'Sales › Customers', nav: 'Left Sidebar → Sales & CRM → Customers', defaultTab: 'Customer Directory' },
  { prefix: '/sales/leads', module: 'SALES & CRM', page: 'Leads & Inquiries', path: 'Sales › Leads', nav: 'Left Sidebar → Sales & CRM → Leads & Inquiries', defaultTab: 'Leads Pipeline' },
  { prefix: '/sales/follow-ups', module: 'SALES & CRM', page: 'Sales Follow-ups', path: 'Sales › Follow-ups', nav: 'Left Sidebar → Sales & CRM → Follow-ups', defaultTab: 'Follow-ups Schedule' },
  { prefix: '/sales/custom-orders', module: 'SALES & CRM', page: 'Custom Orders', path: 'Sales › Custom Orders', nav: 'Left Sidebar → Sales & CRM → Custom Orders', defaultTab: 'Custom Vehicle Orders' },
  { prefix: '/sales/returns', module: 'SALES & CRM', page: 'Returns & Refunds', path: 'Sales › Returns', nav: 'Left Sidebar → Sales & CRM → Returns & Refunds', defaultTab: 'Returns & Refunds Queue' },
  { prefix: '/sales/delivery', module: 'SALES & CRM', page: 'Delivery & Handover', path: 'Sales › Delivery', nav: 'Left Sidebar → Sales & CRM → Delivery / Handover', defaultTab: 'Deliveries Schedule' },

  // After-Sales
  { prefix: '/after-sales/dashboard', module: 'AFTER-SALES', page: 'After-sales Dashboard', path: 'After-Sales › Dashboard', nav: 'Left Sidebar → After-Sales → After-sales Dashboard', defaultTab: 'Workshop Overview' },
  { prefix: '/after-sales/warranty', module: 'AFTER-SALES', page: 'Warranty & Service', path: 'After-Sales › Warranty', nav: 'Left Sidebar → After-Sales → Warranty & Service', defaultTab: 'Service Cases Queue' },
  { prefix: '/after-sales/repairs', module: 'AFTER-SALES', page: 'Repair Jobs', path: 'After-Sales › Repairs', nav: 'Left Sidebar → After-Sales → Repair Jobs', defaultTab: 'Repair Jobs Register' },

  // Finance
  { prefix: '/finance/expenses', module: 'FINANCE', page: 'Operating Expenses', path: 'Finance › Expenses', nav: 'Left Sidebar → Finance → Expenses', defaultTab: 'Petty Cash Expenses' },
  { prefix: '/finance/overview', module: 'FINANCE', page: 'Finance Overview', path: 'Finance › Overview', nav: 'Left Sidebar → Finance → Finance Overview', defaultTab: 'Financial Overview' },
  { prefix: '/finance/receivables', module: 'FINANCE', page: 'Receivables', path: 'Finance › Receivables', nav: 'Left Sidebar → Finance → Receivables', defaultTab: 'Accounts Receivable' },
  { prefix: '/finance/payables', module: 'FINANCE', page: 'Payables', path: 'Finance › Payables', nav: 'Left Sidebar → Finance → Payables', defaultTab: 'Accounts Payable' },
  { prefix: '/finance/cash-bank', module: 'FINANCE', page: 'Cash & Bank Accounts', path: 'Finance › Cash & Bank', nav: 'Left Sidebar → Finance → Cash / Bank', defaultTab: 'Bank Accounts' },

  // Analytics & System
  { prefix: '/analytics/reports-hub', module: 'ANALYTICS', page: 'Reports Hub', path: 'Analytics › Reports Hub', nav: 'Left Sidebar → Analytics → Reports Hub', defaultTab: 'Reports Hub' },
  { prefix: '/analytics/reports/sales', module: 'ANALYTICS', page: 'Sales Analytics', path: 'Analytics › Reports Hub › Sales', nav: 'Left Sidebar → Analytics → Reports Hub', defaultTab: 'Sales Analytics' },
  { prefix: '/system/audit-log', module: 'SYSTEM', page: 'Audit Log & History', path: 'System › Audit Log', nav: 'Left Sidebar → System → Audit Log', defaultTab: 'Audit Log & History' },
  { prefix: '/system/settings', module: 'SYSTEM', page: 'Settings', path: 'System › Settings', nav: 'Left Sidebar → System → Settings', defaultTab: 'System Configuration' },
  { prefix: '/system/security', module: 'SYSTEM', page: 'Security Sessions', path: 'System › Security', nav: 'Left Sidebar → System → Security', defaultTab: 'Active Sessions' },
  { prefix: '/system/branch-team', module: 'SYSTEM', page: 'Branch Team', path: 'System › Branch Team', nav: 'Left Sidebar → System → Branch Team', defaultTab: 'Team Roster' },
]

/**
 * Returns complete navigational context for a step, route, or mission
 * @param {string} routePath Current route path (e.g. '/organisation/users')
 * @param {Object} step Current active step
 * @param {Object} mission Current active mission
 * @returns {Object} { module, page, breadcrumb, tab, section, navigationGuide }
 */
export function getNavigationContext(routePath = '', step = null, mission = null) {
  const cleanPath = String(step?.route || routePath || mission?.route || '').split('?')[0].replace(/\/+$/, '')

  // Find longest matching route prefix
  let match = ROUTE_DIRECTORY
    .filter(r => cleanPath === r.prefix || cleanPath.startsWith(r.prefix + '/'))
    .sort((a, b) => b.prefix.length - a.prefix.length)[0]

  // Fallback if no exact prefix found
  if (!match) {
    const parts = cleanPath.split('/').filter(Boolean)
    const moduleName = (mission?.category || parts[0] || 'APPLICATION').toUpperCase()
    const pageName = mission?.surface || (parts[1] ? parts[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Overview')
    match = {
      module: moduleName,
      page: pageName,
      path: `${moduleName} › ${pageName}`,
      nav: `Left Sidebar → ${moduleName} → ${pageName}`,
      defaultTab: 'Main View'
    }
  }

  // Derive human-readable section name
  const section = step?.section || step?.title || mission?.surface || null

  // Tab context if provided by step or detected from route match
  const tab = step?.tabContext || step?.tab || match.defaultTab || 'Main View'

  return {
    module: match.module,
    page: step?.pageContext || match.page,
    breadcrumb: step?.pageContext ? step.pageContext : match.path,
    tab: tab,
    section: section,
    navigationGuide: step?.navigationHint || match.nav
  }
}
