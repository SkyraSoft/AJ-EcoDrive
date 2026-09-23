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

// --- Branch Manager Specific Data ---
const branchManagerKpis = [
  { label: "Today's Sales", value: 'PKR 842K', change: '+12.4%' },
  { label: 'Units Sold', value: '7', change: '+2 vs yesterday' },
  { label: 'Payments Collected', value: 'PKR 710K', change: '84%' },
  { label: 'Expenses', value: 'PKR 42K', change: 'Today' }
]

const branchSnapshot = [
  { label: 'Open Orders', value: '14' },
  { label: 'Available Stock', value: '48' },
  { label: 'Reserved', value: '7' },
  { label: 'Incoming', value: '8' },
  { label: 'Low Stock', value: '6 products' },
  { label: 'Service Cases', value: '4 open' }
]

const actionRequiredItems = [
  {
    priority: 'High / Med',
    priorityClass: 'bg-[#fee2e2] text-[#dc2626]',
    item: 'Incoming stock to receive • Transfer to dispatch • Low stock / request stock • Unpaid or partially paid order • Overdue customer follow-up',
    record: 'TR / PO / SKU / ORD / LD',
    status: 'Priority actions',
    statusClass: 'bg-[#fef3c7] text-[#b45309]'
  },
  {
    priority: 'Med / High',
    priorityClass: 'bg-[#fef3c7] text-[#b45309]',
    item: 'Expense correction • Return pending inspection • Warranty / service task • Management task from Super Admin',
    record: 'EXP / RET / SC / TASK',
    status: 'Due / overdue',
    statusClass: 'bg-[#dbeafe] text-[#1d4ed8]'
  }
]

// --- Super Admin Specific Data ---
const superAdminKpis = [
  { label: 'Net Sales', value: 'PKR 28.4M', change: '+12.8%', positive: true },
  { label: 'Units Sold', value: '184', change: '+8.2%', positive: true },
  { label: 'Purchases', value: 'PKR 14.6M', change: '+4.1%', positive: true },
  { label: 'Operating Expenses', value: 'PKR 3.2M', change: '-2.4%', positive: true },
  { label: 'Gross Profit', value: 'PKR 6.9M', change: '+15.0%', positive: true },
  { label: 'Net Operating Profit', value: 'PKR 3.7M', change: '+21.4%', positive: true },
  { label: 'Inventory Value', value: 'PKR 41.8M', subtitle: '312 units', positive: null },
  { label: 'Receivables', value: 'PKR 2.9M', subtitle: '17 overdue', positive: false }
]

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
  <!-- BRANCH MANAGER VIEW -->
  <div v-if="isBranchUser" class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Breadcrumb & Header -->
    <div>
      <div class="text-[11px] text-gray-400 mb-1">
        Branch Manager / Dashboard / <span class="font-medium text-gray-600">Branch Manager Dashboard</span>
      </div>
      <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Branch Manager Dashboard</h1>
      <p class="text-xs text-gray-500 mt-1">{{ user.branchName }} Branch operational overview and priorities.</p>
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

    <!-- Middle Row: Sales Trend & Branch Snapshot -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <!-- Sales Trend -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] lg:col-span-7 flex flex-col justify-between min-h-[260px]">
        <h3 class="text-sm font-bold text-gray-900 mb-4">Sales Trend</h3>
        <div class="flex-1 min-h-[160px] bg-[#f8faf9] rounded-xl flex items-end justify-center gap-6 pt-8 pb-4 px-6">
          <div class="w-10 bg-[#a7f3d0] rounded-t-md" style="height: 45%;"></div>
          <div class="w-10 bg-[#6ee7b7] rounded-t-md" style="height: 70%;"></div>
          <div class="w-10 bg-[#a7f3d0] rounded-t-md" style="height: 55%;"></div>
          <div class="w-10 bg-[#34d399] rounded-t-md" style="height: 90%;"></div>
          <div class="w-10 bg-[#a7f3d0] rounded-t-md" style="height: 75%;"></div>
        </div>
      </div>

      <!-- Branch Snapshot -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] lg:col-span-5 flex flex-col">
        <h3 class="text-sm font-bold text-gray-900 mb-4">Branch Snapshot</h3>
        <div class="grid grid-cols-2 gap-3 flex-1">
          <div v-for="(item, idx) in branchSnapshot" :key="idx" class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
            <span class="text-[10px] font-medium text-gray-400">{{ item.label }}</span>
            <span class="text-sm font-bold text-gray-900 mt-1">{{ item.value }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Required Table -->
    <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
      <h3 class="text-sm font-bold text-gray-900 mb-5">Action Required</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="text-[10px] font-bold text-gray-400 border-b border-gray-100 pb-3 uppercase tracking-wider">
              <th class="pb-3 font-semibold w-28">Priority</th>
              <th class="pb-3 font-semibold">Item</th>
              <th class="pb-3 font-semibold w-56">Record</th>
              <th class="pb-3 font-semibold w-40">Status</th>
              <th class="pb-3 font-semibold w-16 text-right"></th>
            </tr>
          </thead>
          <tbody class="text-xs divide-y divide-gray-50">
            <tr v-for="(action, index) in actionRequiredItems" :key="index" class="hover:bg-gray-50/50 transition-colors">
              <td class="py-4 align-top">
                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap" :class="action.priorityClass">
                  {{ action.priority }}
                </span>
              </td>
              <td class="py-4 pr-4 align-top text-gray-700 leading-relaxed font-medium">
                {{ action.item }}
              </td>
              <td class="py-4 align-top text-gray-600 font-medium whitespace-nowrap">
                {{ action.record }}
              </td>
              <td class="py-4 align-top">
                <span class="px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap" :class="action.statusClass">
                  {{ action.status }}
                </span>
              </td>
              <td class="py-4 align-top text-right whitespace-nowrap">
                <button class="text-xs font-medium text-gray-400 hover:text-gray-700 cursor-pointer flex items-center justify-end gap-0.5 ml-auto">
                  Open &rsaquo;
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
      <div v-for="(kpi, index) in superAdminKpis" :key="index" class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
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
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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

