<script setup>
import { ref, computed } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
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

const kpis = [
  { label: 'Expenses', value: '3.2M' },
  { label: 'Pending', value: '9' },
  { label: 'Recurring', value: '27' },
  { label: 'Largest Category', value: 'Salaries' }
]

const breakdown = [
  { branch: 'Peshawar', value: 92, formatted: 'PKR 1.2M (92%)' },
  { branch: 'Islamabad', value: 74, formatted: 'PKR 0.9M (74%)' },
  { branch: 'Lahore', value: 59, formatted: 'PKR 0.7M (59%)' },
  { branch: 'Rawalpindi', value: 46, formatted: 'PKR 0.4M (46%)' }
]

const trendData = computed(() => {
  const p = selectedPeriod.value
  if (p === '7d' || p === '7 Days') {
    return [
      { label: 'Day 1', value: 0.42, fullValue: 'PKR 0.42M' },
      { label: 'Day 2', value: 0.44, fullValue: 'PKR 0.44M' },
      { label: 'Day 3', value: 0.46, fullValue: 'PKR 0.46M' },
      { label: 'Day 4', value: 0.45, fullValue: 'PKR 0.45M' },
      { label: 'Day 5', value: 0.48, fullValue: 'PKR 0.48M' },
      { label: 'Day 6', value: 0.47, fullValue: 'PKR 0.47M' },
      { label: 'Day 7', value: 0.50, fullValue: 'PKR 0.50M' }
    ]
  }
  if (p === '3m' || p === '3 Months' || p === 'This Quarter') {
    return [
      { label: 'Month 1', value: 2.9, fullValue: 'PKR 2.9M' },
      { label: 'Month 2', value: 3.0, fullValue: 'PKR 3.0M' },
      { label: 'Month 3', value: 3.2, fullValue: 'PKR 3.2M' }
    ]
  }
  if (p === '1y' || p === '1 Year' || p === 'This Year') {
    return [
      { label: 'Apr', value: 2.6, fullValue: 'PKR 2.6M' },
      { label: 'May', value: 2.7, fullValue: 'PKR 2.7M' },
      { label: 'Jun', value: 2.9, fullValue: 'PKR 2.9M' },
      { label: 'Jul', value: 3.0, fullValue: 'PKR 3.0M' },
      { label: 'Aug', value: 3.1, fullValue: 'PKR 3.1M' },
      { label: 'Sep', value: 3.2, fullValue: 'PKR 3.2M' }
    ]
  }
  if (p === 'custom' || p === 'Custom Range') {
    return [
      { label: 'Period 1', value: 0.72, fullValue: 'PKR 0.72M' },
      { label: 'Period 2', value: 0.78, fullValue: 'PKR 0.78M' },
      { label: 'Period 3', value: 0.82, fullValue: 'PKR 0.82M' },
      { label: 'Period 4', value: 0.85, fullValue: 'PKR 0.85M' }
    ]
  }
  return [
    { label: 'Week 1', value: 0.7, fullValue: 'PKR 0.7M' },
    { label: 'Week 2', value: 0.8, fullValue: 'PKR 0.8M' },
    { label: 'Week 3', value: 0.85, fullValue: 'PKR 0.85M' },
    { label: 'Week 4', value: 0.85, fullValue: 'PKR 0.85M' }
  ]
})

const details = ref([
  { category: 'Salaries', amount: '1.4M', share: '44%', budget: '1.5M', variance: '-0.1M' },
  { category: 'Rent', amount: '0.6M', share: '19%', budget: '0.6M', variance: '0' },
  { category: 'Utilities', amount: '0.4M', share: '12%', budget: '0.35M', variance: '+0.05M' },
  { category: 'Marketing', amount: '0.5M', share: '15%', budget: '0.6M', variance: '-0.1M' }
])
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openDropdown = null">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">
          Super Admin / Head Office /  <span class="font-bold text-gray-800">Expense Report</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Expense Report</h1>
        <p class="text-sm text-gray-500 mt-1">Operational expense report with branch and date filters.</p>
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

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] flex flex-col justify-between">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2.5">
            <h3 class="text-sm font-semibold text-slate-900">Operating Expenses Trend</h3>
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
          series-name="Operating Spend"
          primary-color="#2563EB"
          :format-value="(v) => 'PKR ' + v + 'M'"
          height-class="h-60"
          :show-values="true"
        />
        <BaseTrendChart
          v-else
          :data="trendData"
          series-name="Operating Spend"
          stroke-color="#2563EB"
          :format-value="(v) => 'PKR ' + v + 'M'"
          height-class="h-60"
        />
      </div>

      <div class="bg-white p-6 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] flex flex-col justify-between">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-slate-900">Branch Expense Distribution</h3>
          <span class="text-xs text-slate-500 font-medium">Relative Outlay</span>
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
        <h3 class="text-[13px] font-bold text-gray-900">Detailed Report</h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <th class="px-6 py-3">Category</th>
              <th class="px-6 py-3">Amount</th>
              <th class="px-6 py-3">Share</th>
              <th class="px-6 py-3">Budget</th>
              <th class="px-6 py-3">Variance</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr 
              v-for="(item, idx) in details" 
              :key="idx" 
              class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
            >
              <td class="px-6 py-4 font-semibold text-gray-900">{{ item.category }}</td>
              <td class="px-6 py-4 text-gray-900 font-bold">{{ item.amount }}</td>
              <td class="px-6 py-4 text-gray-600 font-medium">{{ item.share }}</td>
              <td class="px-6 py-4 text-gray-600 font-medium">{{ item.budget }}</td>
              <td class="px-6 py-4 text-gray-900 font-bold">{{ item.variance }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
