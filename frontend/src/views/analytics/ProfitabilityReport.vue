<script setup>
import { ref, computed } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import BaseBarTrendChart from '@/components/charts/BaseBarTrendChart.vue'
import BaseBreakdownCard from '@/components/charts/BaseBreakdownCard.vue'
import DateFilterBar from '@/components/charts/DateFilterBar.vue'

const selectedBranch = ref('All Branches')
const selectedPeriod = ref('30d')
const customStart = ref('')
const customEnd = ref('')
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

const kpis = [
  { label: 'Gross Profit', value: '6.9M' },
  { label: 'Net Op Profit', value: '3.7M' },
  { label: 'Gross Margin', value: '24.3%' },
  { label: 'Net Margin', value: '13.0%' }
]

const breakdown = [
  { branch: 'Peshawar', value: 92, formatted: 'PKR 1.4M (92%)' },
  { branch: 'Islamabad', value: 74, formatted: 'PKR 0.9M (74%)' },
  { branch: 'Lahore', value: 59, formatted: 'PKR 0.8M (59%)' },
  { branch: 'Rawalpindi', value: 46, formatted: 'PKR 0.6M (46%)' }
]

const trendData = computed(() => {
  const p = selectedPeriod.value
  if (p === '7d' || p === '7 Days') {
    return [
      { label: 'Day 1', value: 0.45, fullValue: 'PKR 0.45M Net Profit' },
      { label: 'Day 2', value: 0.48, fullValue: 'PKR 0.48M Net Profit' },
      { label: 'Day 3', value: 0.52, fullValue: 'PKR 0.52M Net Profit' },
      { label: 'Day 4', value: 0.50, fullValue: 'PKR 0.50M Net Profit' },
      { label: 'Day 5', value: 0.55, fullValue: 'PKR 0.55M Net Profit' },
      { label: 'Day 6', value: 0.53, fullValue: 'PKR 0.53M Net Profit' },
      { label: 'Day 7', value: 0.58, fullValue: 'PKR 0.58M Net Profit' }
    ]
  }
  if (p === '3m' || p === '3 Months' || p === 'This Quarter') {
    return [
      { label: 'Month 1', value: 3.1, fullValue: 'PKR 3.1M Net Profit' },
      { label: 'Month 2', value: 3.4, fullValue: 'PKR 3.4M Net Profit' },
      { label: 'Month 3', value: 3.7, fullValue: 'PKR 3.7M Net Profit' }
    ]
  }
  if (p === '1y' || p === '1 Year' || p === 'This Year') {
    return [
      { label: 'Apr', value: 2.7, fullValue: 'PKR 2.7M Net Profit' },
      { label: 'May', value: 2.9, fullValue: 'PKR 2.9M Net Profit' },
      { label: 'Jun', value: 3.1, fullValue: 'PKR 3.1M Net Profit' },
      { label: 'Jul', value: 3.3, fullValue: 'PKR 3.3M Net Profit' },
      { label: 'Aug', value: 3.5, fullValue: 'PKR 3.5M Net Profit' },
      { label: 'Sep', value: 3.7, fullValue: 'PKR 3.7M Net Profit' }
    ]
  }
  if (p === 'custom' || p === 'Custom Range') {
    return [
      { label: 'Period 1', value: 0.85, fullValue: 'PKR 0.85M Net Profit' },
      { label: 'Period 2', value: 0.92, fullValue: 'PKR 0.92M Net Profit' },
      { label: 'Period 3', value: 0.98, fullValue: 'PKR 0.98M Net Profit' },
      { label: 'Period 4', value: 1.05, fullValue: 'PKR 1.05M Net Profit' }
    ]
  }
  return [
    { label: 'Week 1', value: 0.8, fullValue: 'PKR 0.8M Net Profit' },
    { label: 'Week 2', value: 0.9, fullValue: 'PKR 0.9M Net Profit' },
    { label: 'Week 3', value: 0.95, fullValue: 'PKR 0.95M Net Profit' },
    { label: 'Week 4', value: 1.05, fullValue: 'PKR 1.05M Net Profit' }
  ]
})

const grossTrendData = computed(() => {
  const p = selectedPeriod.value
  if (p === '7d' || p === '7 Days') {
    return [0.9, 0.95, 1.05, 1.0, 1.1, 1.05, 1.15]
  }
  if (p === '3m' || p === '3 Months' || p === 'This Quarter') {
    return [6.0, 6.4, 6.9]
  }
  if (p === '1y' || p === '1 Year' || p === 'This Year') {
    return [5.4, 5.7, 6.0, 6.3, 6.6, 6.9]
  }
  if (p === 'custom' || p === 'Custom Range') {
    return [1.6, 1.7, 1.8, 1.95]
  }
  return [1.5, 1.7, 1.8, 1.9]
})

const details = ref([
  { branch: 'Peshawar', sales: '9.8M', cogs: '7.4M', grossProfit: '2.4M', opex: '1.0M', netOpProfit: '1.4M' },
  { branch: 'Islamabad', sales: '7.6M', cogs: '5.8M', grossProfit: '1.8M', opex: '0.9M', netOpProfit: '0.9M' },
  { branch: 'Lahore', sales: '6.2M', cogs: '4.7M', grossProfit: '1.5M', opex: '0.7M', netOpProfit: '0.8M' },
  { branch: 'Rawalpindi', sales: '4.8M', cogs: '3.6M', grossProfit: '1.2M', opex: '0.6M', netOpProfit: '0.6M' }
])

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
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">
          Super Admin / Head Office /  <span class="font-bold text-gray-800">Profitability Report</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Profitability Report</h1>
        <p class="text-sm text-gray-500 mt-1">Operational profitability report with branch and date filters.</p>
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
    <div class="flex flex-wrap items-center gap-3">
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

      <!-- Date Filter Bar (Design 3 5-Controls) -->
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
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
      <!-- Profitability Bar Card -->
      <div class="bg-white p-6 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] flex flex-col justify-between">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-slate-900">Profitability Performance</h3>
          <span class="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100/60">
            {{ selectedBranch }}
          </span>
        </div>
        <BaseBarTrendChart
          :data="trendData"
          :secondary-data="grossTrendData"
          series-name="Net Op Profit"
          primary-color="#10B981"
          secondary-series-name="Gross Profit"
          secondary-color="#2563EB"
          :format-value="(v) => 'PKR ' + v + 'M'"
          height-class="h-60"
          :show-values="true"
        />
      </div>

      <!-- Breakdown Bars Card -->
      <div class="bg-white p-6 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] flex flex-col justify-between">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-slate-900">Branch Profit Contribution</h3>
          <span class="text-xs text-slate-500 font-medium">Operating Net</span>
        </div>
        <BaseBreakdownCard
          :items="breakdown"
          primary-color="#10B981"
          value-suffix="%"
        />
      </div>
    </div>

    <!-- Detailed Report Table -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100">
        <h3 class="text-[13px] font-bold text-gray-900">Detailed Report</h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <th class="px-6 py-3">Branch</th>
              <th class="px-6 py-3">Sales</th>
              <th class="px-6 py-3">COGS</th>
              <th class="px-6 py-3">Gross Profit</th>
              <th class="px-6 py-3">OpEx</th>
              <th class="px-6 py-3">Net Operating Profit</th>
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
              <td class="px-6 py-4 text-gray-600 font-medium">{{ item.cogs }}</td>
              <td class="px-6 py-4 text-gray-900 font-bold">{{ item.grossProfit }}</td>
              <td class="px-6 py-4 text-gray-600 font-medium">{{ item.opex }}</td>
              <td class="px-6 py-4 text-gray-900 font-bold text-[#165A31]">{{ item.netOpProfit }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
