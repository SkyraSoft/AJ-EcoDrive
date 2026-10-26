const fs = require('fs');
const routerContent = fs.readFileSync('src/router/index.js', 'utf8');

const targets = [
  { stepId: 'sa-02-01', targetId: 'sa.dashboard.kpi.net-sales', route: '/dashboard' },
  { stepId: 'sa-02-02', targetId: 'sa.dashboard.kpi.gross-profit', route: '/dashboard' },
  { stepId: 'sa-02-03', targetId: 'sa.dashboard.kpi.inventory-value', route: '/dashboard' },
  { stepId: 'sa-03-01', targetId: 'sa.organisation.branches.table', route: '/organisation/branches' },
  { stepId: 'sa-03-02', targetId: 'sa.organisation.branches.create-btn', route: '/organisation/branches' },
  { stepId: 'sa-04-01', targetId: 'sa.organisation.users.table', route: '/organisation/users' },
  { stepId: 'sa-05-01', targetId: 'sa.catalogue.products.table', route: '/catalogue/products' },
  { stepId: 'sa-05-02', targetId: 'sa.catalogue.products.create-btn', route: '/catalogue/products' },
  { stepId: 'sa-06-01', targetId: 'sa.catalogue.requests.queue', route: '/catalogue/requests' },
  { stepId: 'sa-07-01', targetId: 'sa.catalogue.pricing.table', route: '/catalogue/pricing' },
  { stepId: 'sa-08-01', targetId: 'sa.procurement.po.table', route: '/procurement/purchase-orders' },
  { stepId: 'sa-09-01', targetId: 'sa.procurement.receipts.table', route: '/procurement/receipts' },
  { stepId: 'sa-10-01', targetId: 'sa.inventory.units.table', route: '/inventory/units' },
  { stepId: 'sa-11-01', targetId: 'sa.inventory.requests.table', route: '/inventory/stock-requests' },
  { stepId: 'sa-12-01', targetId: 'sa.inventory.transfers.table', route: '/inventory/transfers' },
  { stepId: 'sa-13-01', targetId: 'sa.inventory.adjustments.table', route: '/inventory/adjustments' },
  { stepId: 'sa-14-01', targetId: 'sa.sales.orders.table', route: '/sales/orders' },
  { stepId: 'sa-15-01', targetId: 'sa.sales.returns.table', route: '/sales/returns' },
  { stepId: 'sa-16-01', targetId: 'sa.service.cases.table', route: '/after-sales/cases' },
  { stepId: 'sa-17-01', targetId: 'sa.finance.expenses.table', route: '/finance/expenses' },
  { stepId: 'sa-18-01', targetId: 'sa.finance.bills.table', route: '/procurement/bills' },
  { stepId: 'sa-20-01', targetId: 'sa.analytics.sales.chart', route: '/analytics/sales' }
];

for (const t of targets) {
  const cleanPath = t.route.replace(/^\//, '');
  const regex = new RegExp(`path:\\s*['"]${cleanPath}['"][\\s\\S]*?component:\\s*\\(\\)\\s*=>\\s*import\\(['"]([^'"]+)['"]\\)`);
  const match = routerContent.match(regex);
  if (match) {
    console.log(`${t.stepId} (${t.targetId}) -> route: ${t.route} -> component: ${match[1]}`);
  } else {
    // Check if there is a redirect or alias
    const redirectRegex = new RegExp(`path:\\s*['"]${cleanPath}['"][\\s\\S]*?redirect:\\s*['"]([^'"]+)['"]`);
    const redMatch = routerContent.match(redirectRegex);
    if (redMatch) {
      console.log(`${t.stepId} (${t.targetId}) -> route: ${t.route} -> REDIRECT TO: ${redMatch[1]}`);
    } else {
      console.log(`${t.stepId} (${t.targetId}) -> route: ${t.route} -> NOT FOUND`);
    }
  }
}
