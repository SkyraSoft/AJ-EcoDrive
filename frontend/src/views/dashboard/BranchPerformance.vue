<script setup>
import { ref, computed } from 'vue'
import { store } from '@/store.js'
import BaseBarTrendChart from '@/components/charts/BaseBarTrendChart.vue'
import BaseBreakdownCard from '@/components/charts/BaseBreakdownCard.vue'
import DateFilterBar from '@/components/charts/DateFilterBar.vue'

const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const selectedRange = ref('30d')
const customStart = ref('')
const customEnd = ref('')

// Target vs Actual Data for Branch Manager
const actualSalesData = computed(() => [
  { label: 'Jan', value: 2250000, fullValue: 'PKR 2.25M' },
  { label: 'Feb', value: 2450000, fullValue: 'PKR 2.45M' },
  { label: 'Mar', value: 2350000, fullValue: 'PKR 2.35M' },
  { label: 'Apr', value: 2850000, fullValue: 'PKR 2.85M' }
])

const targetSalesData = computed(() => [
  { label: 'Jan', value: 2000000, fullValue: 'PKR 2.00M' },
  { label: 'Feb', value: 2200000, fullValue: 'PKR 2.20M' },
  { label: 'Mar', value: 2500000, fullValue: 'PKR 2.50M' },
  { label: 'Apr', value: 2600000, fullValue: 'PKR 2.60M' }
])

// Branch Manager KPIs
const branchManagerKpis = computed(() => {
  const branchName = user.value?.branchName || 'Peshawar'
  const branchId = store.resolveCanonicalBranchId ? store.resolveCanonicalBranchId(branchName) : user.value?.branchCode
  const fin = store.calculateFinancialMetrics({ branch_id: branchId || branchName })
  const unitsSold = store.serializedUnits.filter(u => store.isBranchAllowed(u.branch) && store.normalizeUnitStatus(u.status) === 'Sold').length

  return [
    { label: 'Period Sales', value: store.formatCurrency(fin.netSales), change: '+10% vs prior' },
    { label: 'Units Sold', value: String(unitsSold), change: '+4' },
    { label: 'Operating Expenses', value: store.formatCurrency(fin.operatingExpenses), change: '+6%' },
    { label: 'Net Operating Profit', value: store.formatCurrency(fin.netOperatingProfit), change: fin.grossMarginFormatted }
  ]
})

// Super Admin KPIs
const superAdminKpis = computed(() => {
  const fin = store.calculateFinancialMetrics({ branch_id: 'ALL' })
  const unitsSold = store.serializedUnits.filter(u => store.normalizeUnitStatus(u.status) === 'Sold').length

  return [
    { label: 'Organisation Sales', value: store.formatCurrency(fin.netSales), change: '+12.8%' },
    { label: 'Gross Profit', value: store.formatCurrency(fin.grossProfit), change: '+15.0%' },
    { label: 'Net Profit', value: store.formatCurrency(fin.netOperatingProfit), change: '+21.4%' },
    { label: 'Units Sold', value: String(unitsSold), change: '+8.2%' }
  ]
})

const detailedComparison = computed(() => {
  const branches = ['Peshawar', 'Islamabad', 'Lahore', 'Rawalpindi']
  return branches.map(b => {
    const fin = store.calculateFinancialMetrics({ branch_id: b })
    const val = store.getInventoryValuation({ branch_id: b })
    const units = store.serializedUnits.filter(u => (u.branch || '').toLowerCase() === b.toLowerCase() && store.normalizeUnitStatus(u.status) === 'Sold').length
    return {
      branch: b,
      sales: store.formatCurrency(fin.netSales),
      cogs: store.formatCurrency(fin.cogs),
      grossProfit: store.formatCurrency(fin.grossProfit),
      opex: store.formatCurrency(fin.operatingExpenses),
      netProfit: store.formatCurrency(fin.netOperatingProfit),
      units: String(units),
      margin: fin.grossMarginFormatted,
      inventory: store.formatCurrency(val.onHandValue)
    }
  })
})

const branchRanking = computed(() => {
  const list = detailedComparison.value
  const max = Math.max(...list.map(b => store.parseMoney(b.sales)), 1)
  return list.map(b => {
    const val = store.parseMoney(b.sales)
    return {
      name: b.branch,
      value: val > 0 ? Math.round((val / max) * 100) : 0,
      percentage: val > 0 ? Math.round((val / max) * 100) : 0
    }
  })
})

const branchRankingItems = computed(() => {
  const list = detailedComparison.value
  const max = Math.max(...list.map(b => store.parseMoney(b.sales)), 1)
  return list.map(b => {
    const val = store.parseMoney(b.sales)
    return {
      label: b.branch,
      value: b.sales,
      percentage: val > 0 ? Math.round((val / max) * 100) : 0
    }
  })
})

const branchSalesData = computed(() => {
  return detailedComparison.value.map(b => ({
    label: b.branch,
    value: store.parseMoney(b.sales),
    fullValue: b.sales
  }))
})

const branchOpexData = computed(() => {
  return detailedComparison.value.map(b => ({
    label: b.branch,
    value: store.parseMoney(b.opex),
    fullValue: b.opex
  }))
})
</script>

<template>
  <!-- BRANCH MANAGER VIEW -->
  <div v-if="isBranchUser" class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <div class="text-[11px] text-slate-500 mb-1">
          Branch Manager / My Branch Performance / <span class="font-medium text-slate-700">My Branch Performance</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-slate-900">My Branch Performance</h1>
        <p class="text-xs text-slate-500 mt-1">Period performance for {{ user.branchName }} Branch only; no other-branch financial data.</p>
      </div>

      <DateFilterBar 
        v-model="selectedRange" 
        v-model:custom-start-date="customStart"
        v-model:custom-end-date="customEnd"
      />
    </div>

    <!-- 4 KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="(kpi, index) in branchManagerKpis" :key="index" class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <div class="text-xs font-semibold text-gray-400 mb-3">{{ kpi.label }}</div>
        <div>
          <div class="text-[26px] font-bold text-gray-900 leading-tight">{{ kpi.value }}</div>
          <div class="text-[11px] font-bold text-[#209249] mt-1">{{ kpi.change }}</div>
        </div>
      </div>
    </div>

    <!-- Middle Grids: Target vs Actual & Performance Indicators -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <!-- Target vs Actual -->
      <div class="bg-white p-6 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] lg:col-span-7 flex flex-col justify-between min-h-[260px]">
        <div class="flex items-center justify-between mb-2">
          <div>
            <h3 class="text-sm font-semibold text-slate-900">Target vs Actual</h3>
            <p class="text-[11px] text-slate-500 mt-0.5">Monthly sales performance vs branch quota</p>
          </div>
        </div>
        <div class="flex-1 mt-2">
          <BaseBarTrendChart
            :data="actualSalesData"
            :secondary-data="targetSalesData"
            series-name="Actual"
            secondary-series-name="Target"
            primary-color="#2563EB"
            secondary-color="#94A3B8"
            :format-value="(v) => 'PKR ' + (v >= 1000000 ? (v/1000000).toFixed(1) + 'M' : (v/1000).toFixed(0) + 'k')"
            height-class="h-56"
            :show-values="true"
          />
        </div>
      </div>

      <!-- Performance Indicators -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] lg:col-span-5 flex flex-col">
        <h3 class="text-sm font-bold text-gray-900 mb-4">Performance Indicators</h3>
        <div class="grid grid-cols-2 gap-3 flex-1">
          <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
            <span class="text-[10px] font-medium text-gray-400">Gross Profit</span>
            <span class="text-sm font-bold text-gray-900 mt-1">PKR 1.76M</span>
          </div>
          <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
            <span class="text-[10px] font-medium text-gray-400">Margin</span>
            <span class="text-sm font-bold text-gray-900 mt-1">20.2%</span>
          </div>
          <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
            <span class="text-[10px] font-medium text-gray-400">Inventory Value</span>
            <span class="text-sm font-bold text-gray-900 mt-1">Authorised view</span>
          </div>
          <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
            <span class="text-[10px] font-medium text-gray-400">Top Category</span>
            <span class="text-sm font-bold text-gray-900 mt-1">E-Series</span>
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
        <div class="text-[10px] text-slate-500 mb-1">Super Admin / <span class="font-bold text-slate-800">Branch Performance</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-slate-900">Branch Performance</h1>
        <p class="text-sm text-slate-500 mt-1">Compare branch contribution, profitability and operating results.</p>
      </div>

      <DateFilterBar 
        v-model="selectedRange" 
        v-model:custom-start-date="customStart"
        v-model:custom-end-date="customEnd"
      />
    </div>

    <!-- 4 KPI Cards -->
    <div data-tour-id="sa.dashboard.branch-perf.kpis" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="(kpi, index) in superAdminKpis" :key="index" class="bg-white p-5 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] flex flex-col justify-between">
        <div class="text-xs font-semibold text-slate-500 mb-3">{{ kpi.label }}</div>
        <div class="flex items-end justify-between">
          <div class="text-[22px] font-bold text-slate-900 leading-none">{{ kpi.value }}</div>
          <div class="text-[10px] font-bold flex items-center gap-0.5 pb-0.5 text-emerald-600">
            {{ kpi.change }}
          </div>
        </div>
      </div>
    </div>

    <!-- Middle Grids -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Branch Ranking -->
      <div data-tour-id="sa.dashboard.branch-perf.ranking" class="bg-white p-6 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] flex flex-col">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-sm font-semibold text-slate-900">Branch Ranking</h3>
            <p class="text-[11px] text-slate-500 mt-0.5">Sales contribution percentage per showroom</p>
          </div>
        </div>
        <div class="flex-1 flex flex-col justify-center">
          <BaseBreakdownCard :items="branchRankingItems" primary-color="#2563EB" />
        </div>
      </div>

      <!-- Sales vs Expenses (Grouped Bar Chart) -->
      <div class="bg-white p-6 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] flex flex-col">
        <div class="flex items-center justify-between mb-2">
          <div>
            <h3 class="text-sm font-semibold text-slate-900">Sales vs Expenses</h3>
            <p class="text-[11px] text-slate-500 mt-0.5">Net sales comparison against branch operating costs</p>
          </div>
        </div>
        <div class="flex-1 mt-2">
          <BaseBarTrendChart
            :data="branchSalesData"
            :secondary-data="branchOpexData"
            series-name="Net Sales"
            secondary-series-name="OpEx"
            primary-color="#2563EB"
            secondary-color="#94A3B8"
            :format-value="(v) => 'PKR ' + (v >= 1000000 ? (v/1000000).toFixed(1) + 'M' : (v/1000).toFixed(0) + 'k')"
            height-class="h-56"
            :show-values="true"
          />
        </div>
      </div>
    </div>

    <!-- Detailed Branch Comparison Table -->
    <div data-tour-id="sa.dashboard.branch-perf.table" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100">
        <h3 class="text-[13px] font-bold text-gray-900">Detailed Branch Comparison</h3>
      </div>
      
      <div class="overflow-x-auto">
        <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <th class="px-5 py-3">Branch</th>
              <th class="px-5 py-3">Sales</th>
              <th class="px-5 py-3">COGS</th>
              <th class="px-5 py-3">Gross Profit</th>
              <th class="px-5 py-3">OpEx</th>
              <th class="px-5 py-3">Net Profit</th>
              <th class="px-5 py-3">Units</th>
              <th class="px-5 py-3">Margin</th>
              <th class="px-5 py-3">Inventory</th>
              <th class="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr v-for="(item, idx) in detailedComparison" :key="idx" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <td class="px-5 py-4 font-semibold text-gray-800">{{ item.branch }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.sales }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.cogs }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.grossProfit }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.opex }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.netProfit }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.units }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.margin }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.inventory }}</td>
              <td class="px-5 py-4 text-right text-gray-400 font-medium tracking-wide cursor-pointer hover:text-gray-600 flex items-center justify-end gap-1">
                Open <span class="text-lg leading-none">&rarr;</span>
              </td>
            </tr>
          </tbody>
        </table></div>
      </div>
    </div>
  </div>
</template>

