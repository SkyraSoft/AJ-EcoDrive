<script setup>
import { ref, computed } from 'vue'
import { store } from '../../store.js'
import BaseTrendChart from '../../components/charts/BaseTrendChart.vue'
import BaseBarTrendChart from '../../components/charts/BaseBarTrendChart.vue'
import BaseBreakdownCard from '../../components/charts/BaseBreakdownCard.vue'
import DateFilterBar from '../../components/charts/DateFilterBar.vue'

const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const selectedRange = ref('30d')
const customStart = ref('')
const customEnd = ref('')

// Branch Manager Data
const bmSalesTrendData = computed(() => [
  { label: 'Nov', value: 1400000, formattedValue: 'PKR 1.40M' },
  { label: 'Dec', value: 1850000, formattedValue: 'PKR 1.85M' },
  { label: 'Jan', value: 1600000, formattedValue: 'PKR 1.60M' },
  { label: 'Feb', value: 2300000, formattedValue: 'PKR 2.30M' },
  { label: 'Mar', value: 2100000, formattedValue: 'PKR 2.10M' },
  { label: 'Apr', value: 2750000, formattedValue: 'PKR 2.75M' }
])

const saSalesTrendPoints = computed(() => [
  { period: 'Nov', value: 4200000, formatted: 'PKR 4.20M' },
  { period: 'Dec', value: 5800000, formatted: 'PKR 5.80M' },
  { period: 'Jan', value: 5100000, formatted: 'PKR 5.10M' },
  { period: 'Feb', value: 6900000, formatted: 'PKR 6.90M' },
  { period: 'Mar', value: 7400000, formatted: 'PKR 7.40M' },
  { period: 'Apr', value: 8850000, formatted: 'PKR 8.85M' }
])

// Branch Manager Data
const branchKpis = computed(() => {
  const branchName = user.value?.branchName || 'Peshawar'
  const branchId = store.resolveCanonicalBranchId ? store.resolveCanonicalBranchId(branchName) : user.value?.branchCode
  const bmFin = store.calculateFinancialMetrics({ branch_id: branchId || branchName })
  const bmSoldUnits = store.serializedUnits.filter(u => store.isBranchAllowed(u.branch) && store.normalizeUnitStatus(u.status) === 'Sold').length
  const bmPayments = store.payments.filter(p => store.isBranchAllowed(p.branch))
  const bmCollections = bmPayments.reduce((sum, p) => sum + (typeof p.amount === 'number' ? p.amount : (store.parseMoney(p.amount) || 0)), 0)
  const bmInvoices = store.invoices.filter(i => store.isBranchAllowed(i.branch) && i.status !== 'Paid' && i.status !== 'Cancelled')
  const bmOutstanding = bmInvoices.reduce((sum, i) => sum + (i.outstandingAmount !== undefined ? i.outstandingAmount : (store.parseMoney(i.amount || i.total) - (i.paidAmount || 0))), 0)

  return [
    { label: "Today's Sales", value: store.formatCurrency(bmFin.netSales), sub: 'Net Sales' },
    { label: 'Units Sold', value: String(bmSoldUnits), sub: 'Units delivered' },
    { label: 'Collections', value: store.formatCurrency(bmCollections), sub: 'Recorded payments' },
    { label: 'Outstanding', value: store.formatCurrency(bmOutstanding), sub: `${bmInvoices.length} open balances` }
  ]
})

// Super Admin Data
const kpis = computed(() => {
  const globalFin = store.calculateFinancialMetrics({ branch_id: 'ALL' })
  const globalOrders = store.orders.filter(o => o.status !== 'Cancelled' && o.status !== 'Draft')
  const globalSoldUnits = store.serializedUnits.filter(u => store.normalizeUnitStatus(u.status) === 'Sold').length
  const avgSale = globalOrders.length > 0 ? globalFin.netSales / globalOrders.length : 0
  const globalPayments = store.payments.reduce((sum, p) => sum + (typeof p.amount === 'number' ? p.amount : (store.parseMoney(p.amount) || 0)), 0)
  const globalOutstandingInvoices = store.invoices.filter(i => i.status !== 'Paid' && i.status !== 'Cancelled')
  const globalOutstanding = globalOutstandingInvoices.reduce((sum, i) => sum + (i.outstandingAmount !== undefined ? i.outstandingAmount : (store.parseMoney(i.amount || i.total) - (i.paidAmount || 0))), 0)

  return [
    { label: 'Net Sales', value: store.formatCurrency(globalFin.netSales), change: '+12.8%', positive: true },
    { label: 'Units Sold', value: String(globalSoldUnits), change: '+8.2%', positive: true },
    { label: 'Orders', value: String(globalOrders.length), change: '+6.4%', positive: true },
    { label: 'Avg Sale', value: store.formatCurrency(avgSale), change: '+4.1%', positive: true },
    { label: 'Discounts', value: store.formatCurrency(globalFin.discounts) },
    { label: 'Gross Profit', value: store.formatCurrency(globalFin.grossProfit), change: '+15.0%', positive: true },
    { label: 'Collections', value: store.formatCurrency(globalPayments) },
    { label: 'Outstanding', value: store.formatCurrency(globalOutstanding), subtitle: `${globalOutstandingInvoices.length} open balances`, positive: false }
  ]
})

const branchSales = computed(() => {
  const branches = ['Peshawar', 'Islamabad', 'Lahore', 'Rawalpindi']
  const counts = branches.map(b => {
    const fin = store.calculateFinancialMetrics({ branch_id: b })
    return { name: b, sales: fin.netSales }
  })
  const max = Math.max(...counts.map(c => c.sales), 1)
  return counts.map(c => ({
    name: c.name,
    value: c.sales > 0 ? Math.round((c.sales / max) * 100) : 0,
    percentage: c.sales > 0 ? Math.round((c.sales / max) * 100) : 0
  }))
})

const branchSalesBreakdownItems = computed(() => {
  const branches = ['Peshawar', 'Islamabad', 'Lahore', 'Rawalpindi']
  const counts = branches.map(b => {
    const fin = store.calculateFinancialMetrics({ branch_id: b })
    return { name: b, sales: fin.netSales }
  })
  const max = Math.max(...counts.map(c => c.sales), 1)
  return counts.map(c => ({
    label: c.name,
    value: store.formatCurrency(c.sales),
    percentage: c.sales > 0 ? Math.round((c.sales / max) * 100) : 0
  }))
})

const topProducts = computed(() => {
  return store.products.slice(0, 3).map(p => {
    const units = store.serializedUnits.filter(u => u.product_id === p.id && store.normalizeUnitStatus(u.status) === 'Sold').length
    const price = typeof p.price === 'number' ? p.price : (store.parseMoney(p.price) || 0)
    return {
      name: p.name,
      revenue: store.formatCurrency(units * price),
      units: String(units),
      margin: '18.8%'
    }
  })
})

const collections = computed(() => {
  const branches = ['Peshawar', 'Islamabad', 'Lahore']
  return branches.map(b => {
    const payments = store.payments
      .filter(p => (p.branch || '').toLowerCase() === b.toLowerCase())
      .reduce((sum, p) => sum + (typeof p.amount === 'number' ? p.amount : (store.parseMoney(p.amount) || 0)), 0)
    const invoices = store.invoices.filter(i => (i.branch || '').toLowerCase() === b.toLowerCase() && i.status !== 'Paid')
    const outstanding = invoices.reduce((sum, i) => sum + (i.outstandingAmount !== undefined ? i.outstandingAmount : (store.parseMoney(i.amount || i.total) - (i.paidAmount || 0))), 0)
    return {
      branch: b,
      collected: store.formatCurrency(payments),
      outstanding: store.formatCurrency(outstanding),
      overdue: String(invoices.length)
    }
  })
})
</script>

<template>
  <!-- BRANCH MANAGER VIEW -->
  <div v-if="isBranchUser" class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div data-tour-id="bm.sales.dashboard.header" class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <div class="text-[11px] text-slate-500 mb-1">
          Branch Manager / Sales / <span class="font-medium text-slate-700">Sales Dashboard</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-slate-900">Sales Dashboard</h1>
        <p class="text-xs text-slate-500 mt-1">Branch sales, collections, outstanding balances and product performance.</p>
      </div>

      <DateFilterBar 
        v-model="selectedRange" 
        v-model:custom-start-date="customStart"
        v-model:custom-end-date="customEnd"
      />
    </div>

    <!-- 4 KPI Cards -->
    <div data-tour-id="bm.sales.dashboard.kpis" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="(kpi, index) in branchKpis" :key="index" class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <div class="text-xs font-semibold text-gray-400 mb-3">{{ kpi.label }}</div>
        <div>
          <div class="text-[26px] font-bold text-gray-900 leading-tight">{{ kpi.value }}</div>
          <div class="text-[11px] font-semibold text-[#165A31] mt-1">{{ kpi.sub }}</div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left Card: Sales Trend (Bar Chart) -->
      <div data-tour-id="bm.sales.dashboard.sales-trend" class="bg-white border border-slate-200/80 rounded-xl shadow-[0_1px_3px_rgba(15,23,42,0.03)] p-6 lg:col-span-8 flex flex-col justify-between">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-sm font-semibold text-slate-900">Sales Trend</h3>
            <p class="text-[11px] text-slate-500 mt-0.5">Monthly revenue progression for Peshawar showroom</p>
          </div>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
            6-Month Trend
          </span>
        </div>
        
        <BaseBarTrendChart :data="bmSalesTrendData" primary-color="#2563EB" :height="220" />
      </div>

      <!-- Right Card: Top Products -->
      <div data-tour-id="bm.sales.dashboard.top-products" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 lg:col-span-4 flex flex-col justify-between space-y-4">
        <h3 class="text-sm font-bold text-gray-900 mb-2">Top Products</h3>

        <!-- Product 1 -->
        <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex items-center justify-between">
          <span class="text-xs font-semibold text-gray-500">BRG E-125</span>
          <span class="text-xs font-bold text-gray-900">12 units</span>
        </div>

        <!-- Product 2 -->
        <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex items-center justify-between">
          <span class="text-xs font-semibold text-gray-500">BRG X7</span>
          <span class="text-xs font-bold text-gray-900">9 units</span>
        </div>

        <!-- Average Sale & Returns Split -->
        <div class="grid grid-cols-2 gap-3 pt-1">
          <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
            <span class="text-[10px] font-medium text-gray-400">Average Sale</span>
            <span class="text-sm font-bold text-gray-900 mt-1">PKR 280K</span>
          </div>
          <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
            <span class="text-[10px] font-medium text-gray-400">Returns</span>
            <span class="text-sm font-bold text-gray-900 mt-1">2</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- SUPER ADMIN VIEW -->
  <div v-else class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <div class="text-[10px] text-slate-500 mb-1">Super Admin / Sales & CRM / <span class="font-bold text-slate-800">Sales Dashboard</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-slate-900">Sales Dashboard</h1>
        <p class="text-sm text-slate-500 mt-1">Monitor sales, units, discounts, collections and branch performance.</p>
      </div>

      <DateFilterBar 
        v-model="selectedRange" 
        v-model:custom-start-date="customStart"
        v-model:custom-end-date="customEnd"
      />
    </div>

    <!-- 8 KPI Cards -->
    <div data-tour-id="sa.sales.dashboard.kpis" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="(kpi, index) in kpis" :key="index" class="bg-white p-5 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] flex flex-col justify-between">
        <div class="text-xs font-semibold text-slate-400 mb-3">{{ kpi.label }}</div>
        <div class="flex items-end justify-between">
          <div class="text-[22px] font-bold text-slate-900 leading-none">{{ kpi.value }}</div>
          
          <div v-if="kpi.change" class="text-[10px] font-bold flex items-center gap-0.5 pb-0.5" 
            :class="kpi.positive ? 'text-emerald-600' : 'text-red-500'">
            {{ kpi.change }}
          </div>
          <div v-else-if="kpi.subtitle" class="text-[10px] font-bold pb-0.5"
            :class="kpi.positive === false ? 'text-red-500' : 'text-slate-400'">
            {{ kpi.subtitle }}
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Sales Trend -->
      <div class="bg-white p-6 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] lg:col-span-2 flex flex-col">
        <div class="flex items-center justify-between mb-3">
          <div>
            <h3 class="text-sm font-semibold text-slate-900">Sales Trend</h3>
            <p class="text-[11px] text-slate-500 mt-0.5">Overall company sales trajectory</p>
          </div>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
            Monthly Performance
          </span>
        </div>
        <div class="flex-1 min-h-[220px]">
          <BaseBarTrendChart
            :data-points="saSalesTrendPoints"
            series-name="Sales Revenue"
            primary-color="#2563EB"
            height-class="h-60"
            :show-values="true"
          />
        </div>
      </div>
      
      <!-- Branch Sales -->
      <div class="bg-white p-6 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] flex flex-col">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-sm font-semibold text-slate-900">Branch Sales</h3>
            <p class="text-[11px] text-slate-500 mt-0.5">Net sales distribution across network</p>
          </div>
        </div>
        <div class="flex-1 flex flex-col justify-center">
          <BaseBreakdownCard :items="branchSalesBreakdownItems" primary-color="#2563EB" />
        </div>
      </div>
    </div>

    <!-- Bottom Grids -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Top Products -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h3 class="text-[13px] font-bold text-gray-900">Top Products</h3>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th class="px-5 py-3">Product</th>
                <th class="px-5 py-3">Revenue</th>
                <th class="px-5 py-3">Units</th>
                <th class="px-5 py-3">Margin</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="product in topProducts" :key="product.name" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td class="px-5 py-4 font-semibold text-gray-800">{{ product.name }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ product.revenue }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ product.units }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ product.margin }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Collections & Outstanding -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h3 class="text-[13px] font-bold text-gray-900">Collections & Outstanding</h3>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th class="px-5 py-3">Branch</th>
                <th class="px-5 py-3">Collected</th>
                <th class="px-5 py-3">Outstanding</th>
                <th class="px-5 py-3">Overdue</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="col in collections" :key="col.branch" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td class="px-5 py-4 font-semibold text-gray-800">{{ col.branch }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ col.collected }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ col.outstanding }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ col.overdue }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
