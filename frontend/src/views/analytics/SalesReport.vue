<script setup>
import { ref, computed } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import { store } from '@/store.js'
import BaseTrendChart from '@/components/charts/BaseTrendChart.vue'
import BaseBarTrendChart from '@/components/charts/BaseBarTrendChart.vue'
import BaseBreakdownCard from '@/components/charts/BaseBreakdownCard.vue'
import DateFilterBar from '@/components/charts/DateFilterBar.vue'

const selectedBranch = ref('All Branches')
const selectedPeriod = ref('30d')
const customStart = ref('')
const customEnd = ref('')
const chartType = ref('bar')
const openDropdown = ref(null)

const branches = ['All Branches', 'Peshawar', 'Islamabad', 'Lahore', 'Rawalpindi']

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const selectFilter = (type, val) => {
  if (type === 'branch') selectedBranch.value = val
  if (type === 'period') selectedPeriod.value = val
  openDropdown.value = null
}

const resetFilters = () => {
  selectedBranch.value = 'All Branches'
  selectedPeriod.value = '30d'
  customStart.value = ''
  customEnd.value = ''
}

const kpis = computed(() => {
  const fin = store.calculateFinancialMetrics({ branch_id: selectedBranch.value })
  const units = store.serializedUnits.filter(u => {
    if (selectedBranch.value !== 'All Branches' && (u.branch || '').toLowerCase() !== selectedBranch.value.toLowerCase()) return false
    return store.normalizeUnitStatus(u.status) === 'Sold'
  }).length
  const orders = store.orders.filter(o => {
    if (selectedBranch.value !== 'All Branches' && (o.branch || '').toLowerCase() !== selectedBranch.value.toLowerCase()) return false
    return o.status !== 'Cancelled' && o.status !== 'Draft'
  }).length

  return [
    { label: 'Net Sales', value: store.formatCurrency(fin.netSales) },
    { label: 'Units', value: String(units) },
    { label: 'Orders', value: String(orders) },
    { label: 'Margin', value: fin.grossMarginFormatted }
  ]
})

const details = computed(() => {
  const branchesList = ['Peshawar', 'Islamabad', 'Lahore', 'Rawalpindi']
  return branchesList.map(b => {
    const fin = store.calculateFinancialMetrics({ branch_id: b })
    const units = store.serializedUnits.filter(u => (u.branch || '').toLowerCase() === b.toLowerCase() && store.normalizeUnitStatus(u.status) === 'Sold').length
    const orders = store.orders.filter(o => (o.branch || '').toLowerCase() === b.toLowerCase() && o.status !== 'Cancelled' && o.status !== 'Draft').length
    return {
      branch: b,
      sales: store.formatCurrency(fin.netSales),
      units: String(units),
      orders: String(orders),
      discount: store.formatCurrency(fin.discounts),
      margin: fin.grossMarginFormatted
    }
  })
})

const breakdown = computed(() => {
  const list = details.value
  const max = Math.max(...list.map(b => store.parseMoney(b.sales)), 1)
  return list.map(b => ({
    branch: b.branch,
    value: store.parseMoney(b.sales) > 0 ? Math.round((store.parseMoney(b.sales) / max) * 100) : 0
  }))
})

const trendData = computed(() => {
  const fin = store.calculateFinancialMetrics({ branch_id: selectedBranch.value })
  const base = fin.netSales > 0 ? (fin.netSales / 1000000) : 28.4
  const period = selectedPeriod.value
  if (period === '7d' || period === '7 Days') {
    return [
      { label: 'Day 1', value: +(base * 0.12).toFixed(1), fullValue: `PKR ${(base * 0.12).toFixed(1)}M` },
      { label: 'Day 2', value: +(base * 0.13).toFixed(1), fullValue: `PKR ${(base * 0.13).toFixed(1)}M` },
      { label: 'Day 3', value: +(base * 0.14).toFixed(1), fullValue: `PKR ${(base * 0.14).toFixed(1)}M` },
      { label: 'Day 4', value: +(base * 0.15).toFixed(1), fullValue: `PKR ${(base * 0.15).toFixed(1)}M` },
      { label: 'Day 5', value: +(base * 0.16).toFixed(1), fullValue: `PKR ${(base * 0.16).toFixed(1)}M` },
      { label: 'Day 6', value: +(base * 0.14).toFixed(1), fullValue: `PKR ${(base * 0.14).toFixed(1)}M` },
      { label: 'Day 7', value: +(base * 0.18).toFixed(1), fullValue: `PKR ${(base * 0.18).toFixed(1)}M` }
    ]
  }
  if (period === '3m' || period === '3 Months' || period === 'This Quarter') {
    return [
      { label: 'Month 1', value: +(base * 0.30).toFixed(1), fullValue: `PKR ${(base * 0.30).toFixed(1)}M` },
      { label: 'Month 2', value: +(base * 0.33).toFixed(1), fullValue: `PKR ${(base * 0.33).toFixed(1)}M` },
      { label: 'Month 3', value: +(base * 0.37).toFixed(1), fullValue: `PKR ${(base * 0.37).toFixed(1)}M` }
    ]
  }
  if (period === '1y' || period === '1 Year' || period === 'This Year') {
    return [
      { label: 'Apr', value: +(base * 0.22).toFixed(1), fullValue: `PKR ${(base * 0.22).toFixed(1)}M` },
      { label: 'May', value: +(base * 0.24).toFixed(1), fullValue: `PKR ${(base * 0.24).toFixed(1)}M` },
      { label: 'Jun', value: +(base * 0.26).toFixed(1), fullValue: `PKR ${(base * 0.26).toFixed(1)}M` },
      { label: 'Jul', value: +(base * 0.28).toFixed(1), fullValue: `PKR ${(base * 0.28).toFixed(1)}M` },
      { label: 'Aug', value: +(base * 0.32).toFixed(1), fullValue: `PKR ${(base * 0.32).toFixed(1)}M` },
      { label: 'Sep', value: +(base * 0.35).toFixed(1), fullValue: `PKR ${(base * 0.35).toFixed(1)}M` }
    ]
  }
  if (period === 'custom' || period === 'Custom Range') {
    return [
      { label: 'Period 1', value: +(base * 0.23).toFixed(1), fullValue: `PKR ${(base * 0.23).toFixed(1)}M` },
      { label: 'Period 2', value: +(base * 0.25).toFixed(1), fullValue: `PKR ${(base * 0.25).toFixed(1)}M` },
      { label: 'Period 3', value: +(base * 0.27).toFixed(1), fullValue: `PKR ${(base * 0.27).toFixed(1)}M` },
      { label: 'Period 4', value: +(base * 0.31).toFixed(1), fullValue: `PKR ${(base * 0.31).toFixed(1)}M` }
    ]
  }
  return [
    { label: 'Week 1', value: +(base * 0.21).toFixed(1), fullValue: `PKR ${(base * 0.21).toFixed(1)}M` },
    { label: 'Week 2', value: +(base * 0.24).toFixed(1), fullValue: `PKR ${(base * 0.24).toFixed(1)}M` },
    { label: 'Week 3', value: +(base * 0.26).toFixed(1), fullValue: `PKR ${(base * 0.26).toFixed(1)}M` },
    { label: 'Week 4', value: +(base * 0.29).toFixed(1), fullValue: `PKR ${(base * 0.29).toFixed(1)}M` }
  ]
})

const breakdownItems = computed(() => {
  return breakdown.value.map(b => {
    const matched = details.value.find(d => d.branch === b.branch)
    return {
      label: b.branch,
      value: b.value,
      percentage: b.value,
      formatted: matched ? `${matched.sales} (${b.value}%)` : `${b.value}%`
    }
  })
})

const filteredDetails = computed(() => {
  return details.value.filter(item => {
    if (selectedBranch.value !== 'All Branches' && item.branch !== selectedBranch.value) return false
    return true
  })
})
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openDropdown = null">
    <!-- Header -->
    <div data-tour-id="bm.analytics.sales.header" class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">
          Super Admin / Head Office /  <span class="font-bold text-gray-800">Sales Report</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Sales Report</h1>
        <p class="text-sm text-gray-500 mt-1">Operational sales report with branch and date filters.</p>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3">
        <button class="px-3.5 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
          Save View
        </button>
        <button class="px-3.5 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
          Schedule
        </button>
        <button class="px-4 py-1.5 text-xs font-bold text-white bg-[#165A31] hover:bg-[#124a28] rounded-lg transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer">
          Export <ChevronDown class="w-3.5 h-3.5 opacity-80" />
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div data-tour-id="bm.analytics.sales.filters" class="flex flex-wrap items-center gap-3">
      <!-- Branch Dropdown -->
      <div class="relative">
        <button 
          @click.stop="toggleDropdown('branch')"
          class="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs hover:bg-slate-50 cursor-pointer"
          :class="{ 'border-blue-600 text-blue-600 bg-blue-50/40': selectedBranch !== 'All Branches' }"
        >
          <span>{{ selectedBranch }}</span>
          <ChevronDown class="w-3 h-3 text-slate-400" />
        </button>
        <div v-if="openDropdown === 'branch'" class="absolute left-0 mt-1 w-40 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-20 text-xs">
          <button 
            v-for="b in branches" 
            :key="b" 
            @click.stop="selectFilter('branch', b)"
            class="w-full text-left px-3 py-1.5 hover:bg-slate-50 font-medium text-slate-700 cursor-pointer"
            :class="{ 'text-blue-600 font-bold bg-blue-50/50': selectedBranch === b }"
          >
            {{ b }}
          </button>
        </div>
      </div>

      <!-- Date Filter Bar (5 Controls: 7 Days, 30 Days, 3 Months, 1 Year, Custom Range) -->
      <DateFilterBar 
        v-model="selectedPeriod" 
        v-model:custom-start-date="customStart"
        v-model:custom-end-date="customEnd"
      />

      <button 
        v-if="selectedBranch !== 'All Branches' || selectedPeriod !== '30d'" 
        @click="resetFilters" 
        class="text-xs font-semibold text-slate-500 hover:text-red-600 px-2 py-1 transition-colors cursor-pointer"
      >
        Clear Filters
      </button>
    </div>

    <!-- 4 KPI Cards -->
    <div data-tour-id="bm.analytics.sales.kpis" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div 
        v-for="(kpi, index) in kpis" 
        :key="index" 
        class="bg-white p-5 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] flex flex-col justify-between"
      >
        <div class="text-xs font-semibold text-slate-400 mb-2">{{ kpi.label }}</div>
        <div class="text-[22px] font-bold text-slate-900 leading-none">{{ kpi.value }}</div>
      </div>
    </div>

    <!-- Charts Grid (Trend & Breakdown) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Sales Chart Card (Default: Bar Chart) -->
      <div data-tour-id="sa.analytics.sales.chart" class="bg-white p-6 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] flex flex-col justify-between">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2.5">
            <h3 class="text-sm font-semibold text-slate-900">Sales Trend</h3>
            <!-- Chart View Toggle (Default: Bar) -->
            <div class="inline-flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200/80">
              <button 
                type="button" 
                @click="chartType = 'bar'" 
                class="px-2 py-0.5 text-[11px] font-semibold rounded-md transition-all cursor-pointer"
                :class="chartType === 'bar' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
              >
                Bar
              </button>
              <button 
                type="button" 
                @click="chartType = 'line'" 
                class="px-2 py-0.5 text-[11px] font-semibold rounded-md transition-all cursor-pointer"
                :class="chartType === 'line' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
              >
                Line
              </button>
            </div>
          </div>
          <span class="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100/60">
            {{ selectedBranch }}
          </span>
        </div>

        <BaseBarTrendChart
          v-if="chartType === 'bar'"
          :data="trendData"
          series-name="Sales Revenue"
          primary-color="#2563EB"
          :format-value="(v) => 'PKR ' + v + 'M'"
          height-class="h-60"
          :show-values="true"
        />
        <BaseTrendChart
          v-else
          :data="trendData"
          series-name="Sales Revenue"
          stroke-color="#2563EB"
          :format-value="(v) => 'PKR ' + v + 'M'"
          height-class="h-60"
        />
      </div>

      <!-- Breakdown Bars Card -->
      <div class="bg-white p-6 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] flex flex-col justify-between">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-slate-900">Branch Breakdown</h3>
          <span class="text-xs text-slate-500 font-medium">Relative Volume</span>
        </div>
        <BaseBreakdownCard
          :items="breakdownItems"
          primary-color="#2563EB"
          value-suffix="%"
        />
      </div>
    </div>

    <!-- Detailed Report Table -->
    <div data-tour-id="bm.analytics.sales.table" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-[13px] font-bold text-gray-900">Detailed Report</h3>
        <span class="text-[11px] text-gray-400 font-medium">Showing {{ filteredDetails.length }} branches</span>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <th class="px-6 py-3">Branch</th>
              <th class="px-6 py-3">Sales</th>
              <th class="px-6 py-3">Units</th>
              <th class="px-6 py-3">Orders</th>
              <th class="px-6 py-3">Discount</th>
              <th class="px-6 py-3">Margin</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr 
              v-for="(item, idx) in filteredDetails" 
              :key="idx" 
              class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
            >
              <td class="px-6 py-4 font-semibold text-gray-900">{{ item.branch }}</td>
              <td class="px-6 py-4 text-gray-900 font-bold">{{ item.sales }}</td>
              <td class="px-6 py-4 text-gray-600 font-medium">{{ item.units }}</td>
              <td class="px-6 py-4 text-gray-600 font-medium">{{ item.orders }}</td>
              <td class="px-6 py-4 text-gray-600 font-medium">{{ item.discount }}</td>
              <td class="px-6 py-4 text-gray-900 font-bold">{{ item.margin }}</td>
            </tr>
            <tr v-if="filteredDetails.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-gray-400 text-xs">
                No branch data matching selected filter.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
