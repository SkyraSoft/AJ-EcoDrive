<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  TrendingUp, 
  TrendingDown, 
  MoreHorizontal,
  ArrowUpRight,
  ChevronRight,
  ExternalLink
} from 'lucide-vue-next'
import { store } from '@/store.js'

const router = useRouter()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

// --- Branch Manager Specific Data ---
const branchManagerKpis = computed(() => {
  const branchName = user.value?.branchName || 'Peshawar'
  const branchId = store.resolveCanonicalBranchId ? store.resolveCanonicalBranchId(branchName) : user.value?.branchCode
  const fin = store.calculateFinancialMetrics({ branch_id: branchId || branchName })
  
  const bmSoldUnits = store.serializedUnits.filter(u => store.isBranchAllowed(u.branch) && store.normalizeUnitStatus(u.status) === 'Sold').length
  const bmPayments = store.payments.filter(p => store.isBranchAllowed(p.branch))
  const bmPaymentsTotal = bmPayments.reduce((sum, p) => sum + (typeof p.amount === 'number' ? p.amount : (store.parseMoney(p.amount) || 0)), 0)

  return [
    { label: "Today's Sales", value: store.formatCurrency(fin.netSales), change: '+12.4%', route: { path: '/sales/orders' } },
    { label: 'Units Sold', value: String(bmSoldUnits), change: '+2 vs yesterday', route: { path: '/sales/orders' } },
    { label: 'Payments Collected', value: store.formatCurrency(bmPaymentsTotal), change: '84%', route: { path: '/sales/payments' } },
    { label: 'Expenses', value: store.formatCurrency(fin.operatingExpenses), change: 'Today', route: { path: '/finance/expenses' } }
  ]
})

const branchSnapshot = computed(() => {
  const branch = user.value?.branchName || 'Peshawar'
  const stats = store.getInventoryStats(branch)
  
  const openOrdersCount = store.orders 
    ? store.orders.filter(o => store.isBranchAllowed(o.branch) && o.status !== 'Completed' && o.status !== 'Cancelled' && o.status !== 'Returned').length
    : 0

  const incomingCount = store.transfers
    ? store.transfers.filter(t => (!t.to || store.isBranchAllowed(t.to)) && t.status !== 'Received' && t.status !== 'Draft').length
    : 0

  const lowStockCount = store.products
    ? store.products.filter(p => (p.available ?? 0) <= (p.reorderLevel || p.reorder || 8)).length
    : 0

  const serviceCasesCount = store.cases
    ? store.cases.filter(c => store.isBranchAllowed(c.branch) && c.status !== 'Resolved' && c.status !== 'Cancelled').length
    : 0

  return [
    { 
      label: 'Open Orders', 
      value: String(openOrdersCount), 
      route: { path: '/sales/orders', query: { status: 'Open' } },
      targetDesc: 'View pending and active sales orders'
    },
    { 
      label: 'Available Stock', 
      value: String(stats.available), 
      route: { path: '/inventory/serialized-units', query: { status: 'Available' } },
      targetDesc: 'Inspect showroom inventory ready for sale'
    },
    { 
      label: 'Reserved', 
      value: String(stats.reserved), 
      route: { path: '/inventory/serialized-units', query: { status: 'Reserved' } },
      targetDesc: 'Units assigned to customer orders'
    },
    { 
      label: 'Incoming', 
      value: String(incomingCount), 
      route: { path: '/inventory/transfers' },
      targetDesc: 'In-transit stock transfers awaiting receipt'
    },
    { 
      label: 'Low Stock', 
      value: `${lowStockCount} products`, 
      route: { path: '/inventory/stock-by-product', query: { filter: 'low-stock' } },
      targetDesc: 'SKUs below minimum reorder threshold'
    },
    { 
      label: 'Service Cases', 
      value: `${serviceCasesCount} open`, 
      route: { path: '/after-sales/warranty' },
      targetDesc: 'Active warranty claims and repair jobs'
    }
  ]
})

const actionRequiredItems = [
  {
    priority: 'High / Med',
    priorityClass: 'bg-[#fee2e2] text-[#dc2626]',
    item: 'Incoming stock to receive • Transfer to dispatch • Low stock / request stock • Unpaid or partially paid order • Overdue customer follow-up',
    recordBadges: [
      { code: 'TR', route: '/inventory/transfers', label: 'Transfers' },
      { code: 'PO', route: '/procurement/purchase-orders', label: 'Purchase Orders' },
      { code: 'SKU', route: '/inventory/stock-requests', label: 'Stock Requests' },
      { code: 'ORD', route: '/sales/orders', label: 'Sales Orders' },
      { code: 'LD', route: '/sales/leads', label: 'Leads' }
    ],
    record: 'TR / PO / SKU / ORD / LD',
    status: 'Priority actions',
    statusClass: 'bg-[#fef3c7] text-[#b45309]',
    actionRoute: { path: '/dashboard/action-centre', query: { priority: 'Critical' } }
  },
  {
    priority: 'Med / High',
    priorityClass: 'bg-[#fef3c7] text-[#b45309]',
    item: 'Expense correction • Return pending inspection • Warranty / service task • Management task from Super Admin',
    recordBadges: [
      { code: 'EXP', route: '/finance/expenses', label: 'Expenses' },
      { code: 'RET', route: '/sales/returns', label: 'Returns' },
      { code: 'SC', route: '/after-sales/warranty', label: 'Service Cases' },
      { code: 'TASK', route: '/dashboard/action-centre', label: 'HQ Tasks' }
    ],
    record: 'EXP / RET / SC / TASK',
    status: 'Due / overdue',
    statusClass: 'bg-[#dbeafe] text-[#1d4ed8]',
    actionRoute: { path: '/dashboard/action-centre', query: { priority: 'High' } }
  }
]

// --- Super Admin Specific Data ---
const globalInventoryStats = computed(() => store.getInventoryStats('All Branches'))

const superAdminKpis = computed(() => {
  const fin = store.calculateFinancialMetrics({ branch_id: 'ALL' })
  const val = store.getInventoryValuation({ branch_id: 'ALL' })
  const soldCount = store.serializedUnits.filter(u => store.normalizeUnitStatus(u.status) === 'Sold').length
  const purchasesTotal = store.purchaseOrders
    .filter(p => p.status !== 'Cancelled' && p.status !== 'Draft')
    .reduce((sum, p) => sum + (p.totalAmount || store.parseMoney(p.total) || 0), 0)
  const receivablesTotal = store.invoices
    .filter(i => i.status !== 'Paid' && i.status !== 'Cancelled')
    .reduce((sum, i) => sum + (i.outstandingAmount !== undefined ? i.outstandingAmount : (store.parseMoney(i.amount || i.total) - (i.paidAmount || 0))), 0)

  return [
    { label: 'Net Sales', value: store.formatCurrency(fin.netSales), change: '+12.8%', positive: true, route: '/sales/dashboard' },
    { label: 'Units Sold', value: String(soldCount), change: '+8.2%', positive: true, route: '/sales/orders' },
    { label: 'Purchases', value: store.formatCurrency(purchasesTotal), change: '+4.1%', positive: true, route: '/procurement/purchase-orders' },
    { label: 'Operating Expenses', value: store.formatCurrency(fin.operatingExpenses), change: '-2.4%', positive: true, route: '/finance/expenses' },
    { label: 'Gross Profit', value: store.formatCurrency(fin.grossProfit), change: '+15.0%', positive: true, route: '/dashboard/business-performance' },
    { label: 'Net Operating Profit', value: store.formatCurrency(fin.netOperatingProfit), change: '+21.4%', positive: true, route: '/dashboard/business-performance' },
    { label: 'Inventory Value', value: store.formatCurrency(val.onHandValue), subtitle: `${globalInventoryStats.value.available} units`, positive: null, route: '/inventory/dashboard' },
    { label: 'Receivables', value: store.formatCurrency(receivablesTotal), subtitle: 'Active receivables', positive: false, route: '/sales/payments' }
  ]
})

const branchPerformance = computed(() => {
  const branches = ['Peshawar', 'Islamabad', 'Lahore', 'Rawalpindi']
  const counts = branches.map(b => ({
    name: b,
    count: store.serializedUnits.filter(u => (u.branch || '').toLowerCase() === b.toLowerCase()).length
  }))
  const max = Math.max(...counts.map(c => c.count), 1)
  return counts.map(c => ({
    name: c.name,
    value: Math.round((c.count / max) * 100)
  }))
})

const expenseSummary = computed(() => {
  const categories = ['Salaries', 'Rent', 'Utilities', 'Marketing', 'Logistics']
  return categories.map(cat => {
    const total = store.expenses
      .filter(e => (e.category || '').toLowerCase().includes(cat.toLowerCase()) && (e.status === 'Approved' || e.status === 'Paid'))
      .reduce((sum, e) => sum + (typeof e.amount === 'number' ? e.amount : (store.parseMoney(e.amount) || 0)), 0)
    return { name: cat, value: total > 0 ? Math.min(100, Math.round(total / 1000)) : 0 }
  })
})

const navigateTo = (route) => {
  if (!route) return
  if (typeof route === 'string') {
    router.push(route)
  } else {
    router.push(route)
  }
}
</script>

<template>
  <!-- BRANCH MANAGER VIEW -->
  <div v-if="isBranchUser" class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Showroom Command Hub Overview Container -->
    <div id="dap-dashboard-overview" class="space-y-6">
      <!-- Breadcrumb & Header -->
      <div id="dap-dashboard-header">
        <div class="text-[11px] text-gray-400 mb-1">
          Branch Manager / Dashboard / <span class="font-medium text-gray-600">Branch Manager Dashboard</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Branch Manager Dashboard</h1>
        <p class="text-xs text-gray-500 mt-1">{{ user.branchName }} Branch operational overview and priorities.</p>
      </div>

      <!-- 4 KPI Cards (Clickable) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          v-for="(kpi, index) in branchManagerKpis" 
          :key="index" 
          :id="index === 3 ? 'dap-kpi-cash-float' : undefined"
          :data-tour-id="index === 0 ? 'bm.dashboard.kpi.net-sales' : (index === 1 ? 'bm.dashboard.kpi.floor-stock' : undefined)"
          @click="navigateTo(kpi.route)"
          class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between cursor-pointer hover:border-[#209249]/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
        >
          <div class="flex items-center justify-between text-xs font-semibold text-gray-400 mb-3">
            <span>{{ kpi.label }}</span>
            <ArrowUpRight class="w-3.5 h-3.5 text-gray-300 group-hover:text-[#209249] transition-colors" />
          </div>
          <div>
            <div class="text-[26px] font-bold text-gray-900 leading-tight">{{ kpi.value }}</div>
            <div class="text-[11px] font-bold text-[#209249] mt-1 flex items-center gap-1">
              <span>{{ kpi.change }}</span>
              <span class="text-[10px] text-gray-400 font-normal group-hover:text-gray-600">· Click to view &rsaquo;</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Middle Row: Sales Trend & Branch Snapshot -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <!-- Sales Trend -->
      <div 
        @click="navigateTo('/sales/dashboard')"
        class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] lg:col-span-7 flex flex-col justify-between min-h-[260px] cursor-pointer hover:border-gray-200 transition-all group"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-bold text-gray-900">Sales Trend</h3>
          <span class="text-[11px] text-gray-400 font-medium group-hover:text-[#209249] flex items-center gap-1">
            View Sales Analytics <ArrowUpRight class="w-3 h-3" />
          </span>
        </div>
        <div class="flex-1 min-h-[160px] bg-[#f8faf9] rounded-xl flex items-end justify-center gap-6 pt-8 pb-4 px-6">
          <div class="w-10 bg-[#a7f3d0] rounded-t-md group-hover:bg-[#86efac] transition-all" style="height: 45%;"></div>
          <div class="w-10 bg-[#6ee7b7] rounded-t-md group-hover:bg-[#4ade80] transition-all" style="height: 70%;"></div>
          <div class="w-10 bg-[#a7f3d0] rounded-t-md group-hover:bg-[#86efac] transition-all" style="height: 55%;"></div>
          <div class="w-10 bg-[#34d399] rounded-t-md group-hover:bg-[#22c55e] transition-all" style="height: 90%;"></div>
          <div class="w-10 bg-[#a7f3d0] rounded-t-md group-hover:bg-[#86efac] transition-all" style="height: 75%;"></div>
        </div>
      </div>

      <!-- Branch Snapshot (Clickable Interactive KPI Grid) -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] lg:col-span-5 flex flex-col">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-bold text-gray-900">Branch Snapshot</h3>
          <span class="text-[10px] text-gray-400 font-medium">Click tile to open module</span>
        </div>
        <div class="grid grid-cols-2 gap-3 flex-1">
          <div 
            v-for="(item, idx) in branchSnapshot" 
            :key="idx" 
            :id="item.label === 'Available Stock' ? 'dap-kpi-available-stock' : (item.label === 'Open Orders' ? 'dap-kpi-open-orders' : undefined)"
            @click="navigateTo(item.route)"
            :title="item.targetDesc"
            class="bg-[#fbfcfc] hover:bg-[#f0fdf4] border border-gray-100/90 hover:border-[#209249]/40 rounded-lg p-3.5 flex flex-col justify-between cursor-pointer transition-all duration-150 shadow-[0_1px_2px_rgba(0,0,0,0.01)] hover:shadow-sm group"
          >
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-semibold text-gray-500 group-hover:text-[#165A31]">{{ item.label }}</span>
              <ArrowUpRight class="w-3 h-3 text-gray-300 group-hover:text-[#209249] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <div class="flex items-baseline justify-between mt-1">
              <span class="text-sm font-bold text-gray-900 group-hover:text-[#165A31]">{{ item.value }}</span>
              <span class="text-[9px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity font-medium">Open &rsaquo;</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Required Table (Clickable Rows & Direct Open Links) -->
    <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
      <div class="flex items-center justify-between mb-5">
        <div>
          <h3 class="text-sm font-bold text-gray-900">Action Required</h3>
          <p class="text-[11px] text-gray-500 mt-0.5">Pending operational tasks, threshold warnings, and approval requests for this branch.</p>
        </div>
        <button 
          @click="navigateTo('/dashboard/action-centre')"
          class="text-xs font-semibold text-[#209249] hover:text-[#165A31] flex items-center gap-1 hover:underline cursor-pointer"
        >
          View Full Action Centre &rsaquo;
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="text-[10px] font-bold text-gray-400 border-b border-gray-100 pb-3 uppercase tracking-wider">
              <th class="pb-3 font-semibold w-28">Priority</th>
              <th class="pb-3 font-semibold">Item</th>
              <th class="pb-3 font-semibold w-64">Record</th>
              <th class="pb-3 font-semibold w-40">Status</th>
              <th class="pb-3 font-semibold w-20 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="text-xs divide-y divide-gray-50">
            <tr 
              v-for="(action, index) in actionRequiredItems" 
              :key="index" 
              class="hover:bg-emerald-50/20 transition-colors group cursor-pointer"
              @click="navigateTo(action.actionRoute)"
            >
              <td class="py-4 align-top">
                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap" :class="action.priorityClass">
                  {{ action.priority }}
                </span>
              </td>
              <td class="py-4 pr-4 align-top text-gray-700 leading-relaxed font-medium">
                {{ action.item }}
              </td>
              <td class="py-4 align-top text-gray-600 font-medium" @click.stop>
                <div class="flex flex-wrap gap-1">
                  <button
                    v-for="badge in action.recordBadges"
                    :key="badge.code"
                    @click="navigateTo(badge.route)"
                    :title="'Open ' + badge.label"
                    class="px-1.5 py-0.5 text-[9px] font-bold rounded bg-gray-100 hover:bg-[#209249] hover:text-white text-gray-600 transition-colors cursor-pointer"
                  >
                    {{ badge.code }}
                  </button>
                </div>
              </td>
              <td class="py-4 align-top">
                <span class="px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap" :class="action.statusClass">
                  {{ action.status }}
                </span>
              </td>
              <td class="py-4 align-top text-right whitespace-nowrap">
                <button 
                  @click.stop="navigateTo(action.actionRoute)"
                  class="text-xs font-semibold text-gray-400 group-hover:text-[#209249] cursor-pointer flex items-center justify-end gap-1 ml-auto px-2 py-1 rounded hover:bg-emerald-50 transition-colors"
                >
                  <span>Open</span>
                  <ChevronRight class="w-3.5 h-3.5 text-gray-400 group-hover:text-[#209249]" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- SUPER ADMIN VIEW -->
  <div v-else class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Breadcrumb & Header -->
    <div>
      <div class="text-[10px] text-gray-500 mb-1">
        Super Admin / <span class="font-bold text-gray-800">Super Admin Dashboard</span>
      </div>
      <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Super Admin Dashboard</h1>
      <p class="text-sm text-gray-500 mt-1">Company-wide command center across every AJ ECODRIVE branch.</p>
    </div>

    <!-- 8 KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div 
        v-for="(kpi, index) in superAdminKpis" 
        :key="index" 
        :data-tour-id="kpi.label === 'Net Sales' ? 'sa.dashboard.kpi.net-sales' : (kpi.label === 'Gross Profit' ? 'sa.dashboard.kpi.gross-profit' : (kpi.label === 'Inventory Value' ? 'sa.dashboard.kpi.inventory-value' : undefined))"
        @click="navigateTo(kpi.route)"
        class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between cursor-pointer hover:border-[#209249]/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
      >
        <div class="flex items-center justify-between text-xs font-semibold text-gray-400 mb-3">
          <span>{{ kpi.label }}</span>
          <ArrowUpRight class="w-3.5 h-3.5 text-gray-300 group-hover:text-[#209249] transition-colors" />
        </div>
        <div class="flex items-end justify-between">
          <div class="text-[22px] font-bold text-gray-900 leading-none group-hover:text-[#165A31] transition-colors">{{ kpi.value }}</div>
          
          <div v-if="kpi.change" class="text-[10px] font-bold flex items-center gap-0.5 pb-0.5" 
            :class="kpi.positive ? 'text-[#209249]' : 'text-red-500'">
            {{ kpi.change }}
          </div>
          <div v-else-if="kpi.subtitle" class="text-[10px] font-bold pb-0.5"
            :class="kpi.positive === false ? 'text-red-500' : 'text-gray-400'">
            {{ kpi.subtitle }}
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Sales Performance -->
      <div 
        @click="navigateTo('/dashboard/business-performance')"
        class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] lg:col-span-2 flex flex-col cursor-pointer hover:border-gray-200 transition-all group"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xs font-bold text-gray-900">Sales Performance</h3>
          <span class="text-[10px] text-gray-400 group-hover:text-[#209249] flex items-center gap-1 font-medium">
            Business Performance <ArrowUpRight class="w-3 h-3" />
          </span>
        </div>
        <div class="flex-1 min-h-[160px] bg-[#f0f9f4] rounded-lg flex items-center justify-center relative">
           <!-- Simple SVG Line placeholder -->
           <svg class="w-full h-[120px] absolute bottom-6" viewBox="0 0 100 30" preserveAspectRatio="none">
             <polyline points="5,25 25,23 45,21 65,18 85,14 100,10" fill="none" stroke="#209249" stroke-width="0.5" vector-effect="non-scaling-stroke"/>
           </svg>
           <div class="absolute bottom-3 left-4 text-[9px] text-gray-400 font-medium tracking-wide">Apr · May · Jun · Jul · Aug</div>
        </div>
      </div>
      
      <!-- Branch Performance -->
      <div 
        @click="navigateTo('/dashboard/branch-performance')" data-tour-id="sa.dashboard.table.branch-performance"
        class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col cursor-pointer hover:border-gray-200 transition-all group"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xs font-bold text-gray-900">Branch Performance</h3>
          <span class="text-[10px] text-gray-400 group-hover:text-[#209249] flex items-center gap-1 font-medium">
            Branch Reports <ArrowUpRight class="w-3 h-3" />
          </span>
        </div>
        <div class="space-y-4 flex-1 flex flex-col justify-center">
          <div v-for="branch in branchPerformance" :key="branch.name" class="flex flex-wrap items-center gap-3">
            <div class="w-16 text-[10px] font-medium text-gray-800">{{ branch.name }}</div>
            <div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full bg-[#165A31] rounded-full" :style="{ width: branch.value + '%' }"></div>
            </div>
            <div class="w-4 text-right text-[10px] font-bold text-gray-900">{{ branch.value }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Grids -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Inventory Overview -->
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xs font-bold text-gray-900">Inventory Overview</h3>
          <button @click="navigateTo('/inventory/dashboard')" class="text-[10px] font-semibold text-[#209249] hover:underline cursor-pointer">
            View All &rsaquo;
          </button>
        </div>
        <div class="space-y-3">
          <div @click="navigateTo('/inventory/stock-by-product')" class="flex justify-between items-center p-1.5 rounded hover:bg-gray-50 cursor-pointer transition-colors">
            <span class="text-[11px] text-gray-500 font-medium">Available</span>
            <span class="text-[11px] font-bold text-gray-900">{{ globalInventoryStats.available }} &rsaquo;</span>
          </div>
          <div @click="navigateTo('/inventory/serialized-units')" class="flex justify-between items-center p-1.5 rounded hover:bg-gray-50 cursor-pointer transition-colors">
            <span class="text-[11px] text-gray-500 font-medium">Reserved</span>
            <span class="text-[11px] font-bold text-gray-900">{{ globalInventoryStats.reserved }} &rsaquo;</span>
          </div>
          <div @click="navigateTo('/procurement/purchase-orders')" class="flex justify-between items-center p-1.5 rounded hover:bg-gray-50 cursor-pointer transition-colors">
            <span class="text-[11px] text-gray-500 font-medium">Supplier In Transit</span>
            <span class="text-[11px] font-bold text-gray-900">{{ globalInventoryStats.supplierInTransit }} &rsaquo;</span>
          </div>
          <div @click="navigateTo('/inventory/transfers')" class="flex justify-between items-center p-1.5 rounded hover:bg-gray-50 cursor-pointer transition-colors">
            <span class="text-[11px] text-gray-500 font-medium">Transfer In Transit</span>
            <span class="text-[11px] font-bold text-gray-900">{{ globalInventoryStats.transferInTransit }} &rsaquo;</span>
          </div>
          <div @click="navigateTo('/inventory/quarantine')" class="flex justify-between items-center p-1.5 rounded hover:bg-gray-50 cursor-pointer transition-colors">
            <span class="text-[11px] text-gray-500 font-medium">QC / Quarantine</span>
            <span class="text-[11px] font-bold text-gray-900">{{ globalInventoryStats.receivingQc + globalInventoryStats.damagedQuarantine }} &rsaquo;</span>
          </div>
        </div>
      </div>

      <!-- Expense Summary -->
      <div 
        @click="navigateTo('/finance/expenses')"
        class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] cursor-pointer hover:border-gray-200 transition-all group"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xs font-bold text-gray-900">Expense Summary</h3>
          <span class="text-[10px] text-gray-400 group-hover:text-[#209249] flex items-center gap-1 font-medium">
            Manage Expenses <ArrowUpRight class="w-3 h-3" />
          </span>
        </div>
        <div class="space-y-3.5">
          <div v-for="expense in expenseSummary" :key="expense.name" class="flex flex-wrap items-center gap-3">
            <div class="w-16 text-[10px] font-medium text-gray-800">{{ expense.name }}</div>
            <div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full bg-[#165A31] rounded-full" :style="{ width: expense.value + '%' }"></div>
            </div>
            <div class="w-4 text-right text-[10px] font-bold text-gray-900">{{ expense.value }}</div>
          </div>
        </div>
      </div>

      <!-- Action Required -->
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xs font-bold text-gray-900">Action Required</h3>
          <button @click="navigateTo('/dashboard/action-centre')" class="text-[10px] font-semibold text-[#209249] hover:underline cursor-pointer">
            Action Centre &rsaquo;
          </button>
        </div>
        <div class="space-y-4">
          <div 
            @click="navigateTo('/inventory/stock-by-product')" 
            class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 p-1.5 rounded hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div class="flex items-center gap-2">
              <span class="px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold bg-[#fef2f2] text-[#dc2626]">Critical</span>
              <span class="text-[11px] font-bold text-gray-900">2 low-stock SKUs</span>
            </div>
            <span class="text-[9px] text-[#209249] font-medium">Open Inventory &rsaquo;</span>
          </div>
          <div 
            @click="navigateTo('/dashboard/action-centre?priority=High')" 
            class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 p-1.5 rounded hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div class="flex items-center gap-2">
              <span class="px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold bg-[#fff7ed] text-[#ea580c]">High</span>
              <span class="text-[11px] font-bold text-gray-900">3 PO approvals</span>
            </div>
            <span class="text-[9px] text-[#209249] font-medium">Action Centre &rsaquo;</span>
          </div>
          <div 
            @click="navigateTo('/sales/payments')" 
            class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 p-1.5 rounded hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div class="flex items-center gap-2">
              <span class="px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold bg-[#fff7ed] text-[#ea580c]">High</span>
              <span class="text-[11px] font-bold text-gray-900">5 overdue receivables</span>
            </div>
            <span class="text-[9px] text-[#209249] font-medium">Receivables &rsaquo;</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Lowest Grids -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] md:col-span-2">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xs font-bold text-gray-900">Management Communication</h3>
          <button @click="navigateTo('/dashboard/action-centre')" class="text-[10px] font-semibold text-[#209249] hover:underline cursor-pointer">
            Open Tasks &rsaquo;
          </button>
        </div>
        <div class="space-y-4">
          <div 
            @click="navigateTo('/inventory/stock-requests')"
            class="flex justify-between items-start p-1.5 rounded hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div class="flex gap-6">
              <span class="text-[11px] font-bold text-gray-900 w-16">Peshawar</span>
              <span class="text-[11px] text-gray-600 font-medium">Stock request SR-1048 needs review</span>
            </div>
            <span class="text-[9px] text-gray-400 font-medium">8 min</span>
          </div>
          <div 
            @click="navigateTo('/finance/expenses')"
            class="flex justify-between items-start p-1.5 rounded hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div class="flex gap-6">
              <span class="text-[11px] font-bold text-gray-900 w-16">Islamabad</span>
              <span class="text-[11px] text-gray-600 font-medium">Expense correction submitted</span>
            </div>
            <span class="text-[9px] text-gray-400 font-medium">23 min</span>
          </div>
        </div>
      </div>

      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <h3 class="text-xs font-bold text-gray-900 mb-4">Recent Activity</h3>
        <div class="space-y-3.5 relative">
          <div class="flex justify-between items-center relative pl-3">
            <div class="absolute left-0 w-[3px] h-full bg-[#165A31] rounded-full"></div>
            <span class="text-[11px] font-bold text-gray-900">PO-2044 approved</span>
            <span class="text-[9px] text-gray-400 font-medium">10:42</span>
          </div>
          <div class="flex justify-between items-center relative pl-3">
            <span class="text-[11px] text-gray-600 font-medium">Unit BRG-DS11-992 received</span>
            <span class="text-[9px] text-gray-400 font-medium">10:26</span>
          </div>
          <div class="flex justify-between items-center relative pl-3">
            <span class="text-[11px] text-gray-600 font-medium">Order SO-7731 completed</span>
            <span class="text-[9px] text-gray-400 font-medium">09:58</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

