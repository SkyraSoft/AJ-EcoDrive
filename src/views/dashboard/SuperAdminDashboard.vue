<script setup>
import { computed } from 'vue'
import { 
  TrendingUp, 
  TrendingDown, 
  MoreHorizontal
} from 'lucide-vue-next'
import { store } from '@/store.js'

const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const dashboardTitle = computed(() => {
  if (isBranchUser.value) {
    return `${user.value.branchName} Branch Dashboard`
  }
  return 'Super Admin Dashboard'
})

const dashboardSubtitle = computed(() => {
  if (isBranchUser.value) {
    return `Branch command center & operations overview for ${user.value.branchName} (${user.value.branchCode}).`
  }
  return 'Company-wide command center across every AJ ECODRIVE branch.'
})

const kpis = computed(() => {
  if (isBranchUser.value && user.value.branchName === 'Peshawar') {
    return [
      { label: 'Net Sales', value: 'PKR 9.8M', change: '+14.2%', positive: true },
      { label: 'Units Sold', value: '64', change: '+9.1%', positive: true },
      { label: 'Purchases', value: 'PKR 4.8M', change: '+3.5%', positive: true },
      { label: 'Operating Expenses', value: 'PKR 1.0M', change: '-1.8%', positive: true },
      { label: 'Gross Profit', value: 'PKR 2.4M', change: '+16.5%', positive: true },
      { label: 'Net Operating Profit', value: 'PKR 1.4M', change: '+22.0%', positive: true },
      { label: 'Inventory Value', value: 'PKR 14.2M', subtitle: '108 units', positive: null },
      { label: 'Receivables', value: 'PKR 850K', subtitle: '4 overdue', positive: false }
    ]
  }
  return [
    { label: 'Net Sales', value: 'PKR 28.4M', change: '+12.8%', positive: true },
    { label: 'Units Sold', value: '184', change: '+8.2%', positive: true },
    { label: 'Purchases', value: 'PKR 14.6M', change: '+4.1%', positive: true },
    { label: 'Operating Expenses', value: 'PKR 3.2M', change: '-2.4%', positive: true },
    { label: 'Gross Profit', value: 'PKR 6.9M', change: '+15.0%', positive: true },
    { label: 'Net Operating Profit', value: 'PKR 3.7M', change: '+21.4%', positive: true },
    { label: 'Inventory Value', value: 'PKR 41.8M', subtitle: '312 units', positive: null },
    { label: 'Receivables', value: 'PKR 2.9M', subtitle: '17 overdue', positive: false }
  ]
})

const branchPerformance = [
  { name: 'Peshawar', value: 92 },
  { name: 'Islamabad', value: 78 },
  { name: 'Lahore', value: 64 },
  { name: 'Rawalpindi', value: 51 }
]

const expenseSummary = [
  { name: 'Salaries', value: 84 },
  { name: 'Rent', value: 61 },
  { name: 'Utilities', value: 43 },
  { name: 'Marketing', value: 31 },
  { name: 'Logistics', value: 27 }
]
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Breadcrumb & Header -->
    <div>
      <div class="text-[10px] text-gray-500 mb-1">
        {{ isBranchUser ? user.branchName : 'Super Admin' }} / <span class="font-bold text-gray-800">{{ dashboardTitle }}</span>
      </div>
      <h1 class="text-[32px] tracking-tight font-bold text-gray-900">{{ dashboardTitle }}</h1>
      <p class="text-sm text-gray-500 mt-1">{{ dashboardSubtitle }}</p>
    </div>

    <!-- 8 KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="(kpi, index) in kpis" :key="index" class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <div class="text-xs font-semibold text-gray-400 mb-3">{{ kpi.label }}</div>
        <div class="flex items-end justify-between">
          <div class="text-[22px] font-bold text-gray-900 leading-none">{{ kpi.value }}</div>
          
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
    <div class="grid grid-cols-1 lg:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Sales Performance -->
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] lg:col-span-2 flex flex-col">
        <h3 class="text-xs font-bold text-gray-900 mb-4">Sales Performance</h3>
        <div class="flex-1 min-h-[160px] bg-[#f0f9f4] rounded-lg flex items-center justify-center relative">
           <!-- Simple SVG Line placeholder -->
           <svg class="w-full h-[120px] absolute bottom-6" viewBox="0 0 100 30" preserveAspectRatio="none">
             <polyline points="5,25 25,23 45,21 65,18 85,14 100,10" fill="none" stroke="#209249" stroke-width="0.5" vector-effect="non-scaling-stroke"/>
           </svg>
           <div class="absolute bottom-3 left-4 text-[9px] text-gray-400 font-medium tracking-wide">Apr · May · Jun · Jul · Aug</div>
        </div>
      </div>
      
      <!-- Branch Performance -->
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col">
        <h3 class="text-xs font-bold text-gray-900 mb-4">Branch Performance</h3>
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
    <div class="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Inventory Overview -->
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <h3 class="text-xs font-bold text-gray-900 mb-4">Inventory Overview</h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-[11px] text-gray-500 font-medium">Available</span>
            <span class="text-[11px] font-bold text-gray-900">228</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-[11px] text-gray-500 font-medium">Reserved</span>
            <span class="text-[11px] font-bold text-gray-900">31</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-[11px] text-gray-500 font-medium">Supplier In Transit</span>
            <span class="text-[11px] font-bold text-gray-900">26</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-[11px] text-gray-500 font-medium">Transfer In Transit</span>
            <span class="text-[11px] font-bold text-gray-900">8</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-[11px] text-gray-500 font-medium">QC / Quarantine</span>
            <span class="text-[11px] font-bold text-gray-900">19</span>
          </div>
        </div>
      </div>

      <!-- Expense Summary -->
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <h3 class="text-xs font-bold text-gray-900 mb-4">Expense Summary</h3>
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
        <h3 class="text-xs font-bold text-gray-900 mb-4">Action Required</h3>
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            <div class="flex items-center gap-2">
              <span class="px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold bg-[#fef2f2] text-[#dc2626]">Critical</span>
              <span class="text-[11px] font-bold text-gray-900">2 low-stock SKUs</span>
            </div>
            <span class="text-[9px] text-gray-400 font-medium">Open Inventory</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            <div class="flex items-center gap-2">
              <span class="px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold bg-[#fff7ed] text-[#ea580c]">High</span>
              <span class="text-[11px] font-bold text-gray-900">3 PO approvals</span>
            </div>
            <span class="text-[9px] text-gray-400 font-medium">Action Centre</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            <div class="flex items-center gap-2">
              <span class="px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold bg-[#fff7ed] text-[#ea580c]">High</span>
              <span class="text-[11px] font-bold text-gray-900">5 overdue receivables</span>
            </div>
            <span class="text-[9px] text-gray-400 font-medium">Receivables</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Lowest Grids -->
    <div class="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] md:col-span-2">
        <h3 class="text-xs font-bold text-gray-900 mb-4">Management Communication</h3>
        <div class="space-y-4">
          <div class="flex justify-between items-start">
            <div class="flex gap-6">
              <span class="text-[11px] font-bold text-gray-900 w-16">Peshawar</span>
              <span class="text-[11px] text-gray-600 font-medium">Stock request SR-1048 needs review</span>
            </div>
            <span class="text-[9px] text-gray-400 font-medium">8 min</span>
          </div>
          <div class="flex justify-between items-start">
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
