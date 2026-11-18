<script setup>
import { ref, computed } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import BaseTrendChart from '@/components/charts/BaseTrendChart.vue'
import BaseBarTrendChart from '@/components/charts/BaseBarTrendChart.vue'
import BaseBreakdownCard from '@/components/charts/BaseBreakdownCard.vue'
import DateFilterBar from '@/components/charts/DateFilterBar.vue'

const selectedBranch = ref('Peshawar')
const selectedPeriod = ref('30d')
const customStart = ref('')
const customEnd = ref('')
const chartType = ref('bar')
const openDropdown = ref(null)

const branches = ['Peshawar', 'Islamabad', 'Lahore', 'Rawalpindi']

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const selectFilter = (type, val) => {
  if (type === 'branch') selectedBranch.value = val
  if (type === 'period') selectedPeriod.value = val
  openDropdown.value = null
}

const resetFilters = () => {
  selectedBranch.value = 'Peshawar'
  selectedPeriod.value = '30d'
  customStart.value = ''
  customEnd.value = ''
}

const kpis = [
  { label: 'Sales', value: '9.8M' },
  { label: 'Units', value: '66' },
  { label: 'Expenses', value: '1.0M' },
  { label: 'Net Operating Profit', value: '1.4M' }
]

const breakdown = [
  { branch: 'Peshawar', value: 92, formatted: 'PKR 9.8M (92%)' },
  { branch: 'Islamabad', value: 74, formatted: 'PKR 7.9M (74%)' },
  { branch: 'Lahore', value: 59, formatted: 'PKR 6.3M (59%)' },
  { branch: 'Rawalpindi', value: 46, formatted: 'PKR 4.9M (46%)' }
]

const trendData = computed(() => {
  const p = selectedPeriod.value
  if (p === '7d' || p === '7 Days') {
    return [
      { label: 'Day 1', value: 1.2, fullValue: 'PKR 1.2M' },
      { label: 'Day 2', value: 1.3, fullValue: 'PKR 1.3M' },
      { label: 'Day 3', value: 1.4, fullValue: 'PKR 1.4M' },
      { label: 'Day 4', value: 1.35, fullValue: 'PKR 1.35M' },
      { label: 'Day 5', value: 1.5, fullValue: 'PKR 1.5M' },
      { label: 'Day 6', value: 1.45, fullValue: 'PKR 1.45M' },
      { label: 'Day 7', value: 1.6, fullValue: 'PKR 1.6M' }
    ]
  }
  if (p === '3m' || p === '3 Months' || p === 'This Quarter') {
    return [
      { label: 'Month 1', value: 8.9, fullValue: 'PKR 8.9M' },
      { label: 'Month 2', value: 9.4, fullValue: 'PKR 9.4M' },
      { label: 'Month 3', value: 9.8, fullValue: 'PKR 9.8M' }
    ]
  }
  if (p === '1y' || p === '1 Year' || p === 'This Year') {
    return [
      { label: 'Apr', value: 7.2, fullValue: 'PKR 7.2M' },
      { label: 'May', value: 7.8, fullValue: 'PKR 7.8M' },
      { label: 'Jun', value: 8.3, fullValue: 'PKR 8.3M' },
      { label: 'Jul', value: 8.9, fullValue: 'PKR 8.9M' },
      { label: 'Aug', value: 9.4, fullValue: 'PKR 9.4M' },
      { label: 'Sep', value: 9.8, fullValue: 'PKR 9.8M' }
    ]
  }
  if (p === 'custom' || p === 'Custom Range') {
    return [
      { label: 'Period 1', value: 2.2, fullValue: 'PKR 2.2M' },
      { label: 'Period 2', value: 2.4, fullValue: 'PKR 2.4M' },
      { label: 'Period 3', value: 2.6, fullValue: 'PKR 2.6M' },
      { label: 'Period 4', value: 2.8, fullValue: 'PKR 2.8M' }
    ]
  }
  return [
    { label: 'Week 1', value: 2.1, fullValue: 'PKR 2.1M' },
    { label: 'Week 2', value: 2.3, fullValue: 'PKR 2.3M' },
    { label: 'Week 3', value: 2.6, fullValue: 'PKR 2.6M' },
    { label: 'Week 4', value: 2.8, fullValue: 'PKR 2.8M' }
  ]
})

const details = ref([
  { metric: 'Sales', peshawar: '9.8M', previous: '8.6M', variance: '+14%', positive: true },
  { metric: 'Units', peshawar: '66', previous: '61', variance: '+8%', positive: true },
  { metric: 'Gross Profit', peshawar: '2.4M', previous: '2.1M', variance: '+14%', positive: true },
  { metric: 'Operating Expenses', peshawar: '1.0M', previous: '0.93M', variance: '+7%', positive: false },
  { metric: 'Net Operating Profit', peshawar: '1.4M', previous: '1.17M', variance: '+20%', positive: true }
])
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openDropdown = null">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">
          Super Admin / Head Office /  <span class="font-bold text-gray-800">Branch Report</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Branch Report</h1>
        <p class="text-sm text-gray-500 mt-1">Operational branch report with branch and date filters.</p>
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
          :class="{ 'border-blue-600 text-blue-600 bg-blue-50/40': selectedBranch !== 'Peshawar' }"
        >
          <span>{{ selectedBranch }} Branch</span>
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
        v-if="selectedBranch !== 'Peshawar' || selectedPeriod !== '30d'" 
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

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] flex flex-col justify-between">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2.5">
            <h3 class="text-sm font-semibold text-slate-900">{{ selectedBranch }} Performance Trend</h3>
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
          series-name="Sales Volume"
          primary-color="#2563EB"
          :format-value="(v) => 'PKR ' + v + 'M'"
          height-class="h-60"
          :show-values="true"
        />
        <BaseTrendChart
          v-else
          :data="trendData"
          series-name="Sales Volume"
          stroke-color="#2563EB"
          :format-value="(v) => 'PKR ' + v + 'M'"
          height-class="h-60"
        />
      </div>

      <div class="bg-white p-6 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] flex flex-col justify-between">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-slate-900">Branch Performance Comparison</h3>
          <span class="text-xs text-slate-500 font-medium">Achievement Ratio</span>
        </div>
        <BaseBreakdownCard
          :items="breakdown"
          primary-color="#2563EB"
          value-suffix="%"
        />
      </div>
    </div>

    <!-- Detailed Report Table -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100">
        <h3 class="text-[13px] font-bold text-gray-900">{{ selectedBranch }} Performance Breakdown</h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <th class="px-6 py-3">Metric</th>
              <th class="px-6 py-3">{{ selectedBranch }}</th>
              <th class="px-6 py-3">Previous</th>
              <th class="px-6 py-3">Variance</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr 
              v-for="(item, idx) in details" 
              :key="idx" 
              class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
            >
              <td class="px-6 py-4 font-semibold text-gray-900">{{ item.metric }}</td>
              <td class="px-6 py-4 text-gray-900 font-bold">{{ item.peshawar }}</td>
              <td class="px-6 py-4 text-gray-600 font-medium">{{ item.previous }}</td>
              <td class="px-6 py-4 text-gray-900 font-bold text-[#165A31]">{{ item.variance }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
