<script setup>
import { computed } from 'vue'
import { store } from '@/store.js'

const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

// Branch Manager KPIs
const branchManagerKpis = [
  { label: 'Period Sales', value: 'PKR 8.7M', change: '+10% vs prior' },
  { label: 'Units Sold', value: '31', change: '+4' },
  { label: 'Operating Expenses', value: 'PKR 482K', change: '+6%' },
  { label: 'Net Operating Profit', value: 'PKR 1.28M', change: '14.7% margin' }
]

// Super Admin KPIs
const superAdminKpis = [
  { label: 'Organisation Sales', value: 'PKR 28.4M', change: '+12.8%' },
  { label: 'Gross Profit', value: 'PKR 6.9M', change: '+15.0%' },
  { label: 'Net Profit', value: 'PKR 3.7M', change: '+21.4%' },
  { label: 'Units Sold', value: '184', change: '+8.2%' }
]

const branchRanking = [
  { name: 'Peshawar', value: 94, percentage: 100 },
  { name: 'Islamabad', value: 81, percentage: 86 },
  { name: 'Lahore', value: 68, percentage: 72 },
  { name: 'Rawalpindi', value: 55, percentage: 58 }
]

const detailedComparison = [
  { branch: 'Peshawar', sales: '9.8M', cogs: '5.7M', grossProfit: '2.4M', opex: '1.0M', netProfit: '1.4M', units: '68', margin: '24.5%', inventory: '14.2M' },
  { branch: 'Islamabad', sales: '7.6M', cogs: '4.5M', grossProfit: '1.8M', opex: '0.9M', netProfit: '0.9M', units: '51', margin: '23.7%', inventory: '11.8M' },
  { branch: 'Lahore', sales: '6.2M', cogs: '3.8M', grossProfit: '1.4M', opex: '0.7M', netProfit: '0.7M', units: '39', margin: '22.8%', inventory: '9.1M' },
  { branch: 'Rawalpindi', sales: '4.8M', cogs: '2.9M', grossProfit: '1.3M', opex: '0.6M', netProfit: '0.7M', units: '28', margin: '27.1%', inventory: '8.9M' }
]
</script>

<template>
  <!-- BRANCH MANAGER VIEW -->
  <div v-if="isBranchUser" class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div>
      <div class="text-[11px] text-gray-400 mb-1">
        Branch Manager / My Branch Performance / <span class="font-medium text-gray-600">My Branch Performance</span>
      </div>
      <h1 class="text-[32px] tracking-tight font-bold text-gray-900">My Branch Performance</h1>
      <p class="text-xs text-gray-500 mt-1">Period performance for {{ user.branchName }} Branch only; no other-branch financial data.</p>
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
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] lg:col-span-7 flex flex-col justify-between min-h-[260px]">
        <h3 class="text-sm font-bold text-gray-900 mb-4">Target vs Actual</h3>
        <div class="flex-1 min-h-[160px] bg-[#f8faf9] rounded-xl flex items-end justify-center gap-6 pt-8 pb-4 px-6">
          <div class="w-10 bg-[#a7f3d0] rounded-t-md" style="height: 60%;"></div>
          <div class="w-10 bg-[#34d399] rounded-t-md" style="height: 88%;"></div>
          <div class="w-10 bg-[#a7f3d0] rounded-t-md" style="height: 52%;"></div>
          <div class="w-10 bg-[#6ee7b7] rounded-t-md" style="height: 80%;"></div>
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
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / <span class="font-bold text-gray-800">Branch Performance</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Branch Performance</h1>
        <p class="text-sm text-gray-500 mt-1">Compare branch contribution, profitability and operating results.</p>
      </div>
    </div>

    <!-- 4 KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="(kpi, index) in superAdminKpis" :key="index" class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <div class="text-xs font-semibold text-gray-400 mb-3">{{ kpi.label }}</div>
        <div class="flex items-end justify-between">
          <div class="text-[22px] font-bold text-gray-900 leading-none">{{ kpi.value }}</div>
          <div class="text-[10px] font-bold flex items-center gap-0.5 pb-0.5 text-[#209249]">
            {{ kpi.change }}
          </div>
        </div>
      </div>
    </div>

    <!-- Middle Grids -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Branch Ranking -->
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col">
        <h3 class="text-[13px] font-bold text-gray-900 mb-5">Branch Ranking</h3>
        <div class="space-y-4 flex-1 flex flex-col justify-center">
          <div v-for="branch in branchRanking" :key="branch.name" class="flex flex-wrap items-center gap-4">
            <div class="w-16 text-[11px] font-medium text-gray-800">{{ branch.name }}</div>
            <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full bg-[#209249] rounded-full" :style="{ width: branch.percentage + '%' }"></div>
            </div>
            <div class="w-6 text-right text-[11px] font-bold text-gray-900">{{ branch.value }}</div>
          </div>
        </div>
      </div>

      <!-- Sales vs Expenses (Mockup Bar Chart) -->
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col">
        <h3 class="text-[13px] font-bold text-gray-900 mb-5">Sales vs Expenses</h3>
        <div class="flex-1 min-h-[140px] bg-[#f8faf9] rounded-lg flex items-end justify-start px-6 pt-6 pb-4 gap-4 relative">
          <div class="w-8 bg-[#209249] rounded-t-sm" style="height: 100%;"></div>
          <div class="w-8 bg-[#209249] rounded-t-sm" style="height: 75%;"></div>
          <div class="w-8 bg-[#209249] rounded-t-sm" style="height: 85%;"></div>
          <div class="w-8 bg-[#209249] rounded-t-sm" style="height: 60%;"></div>
        </div>
      </div>
    </div>

    <!-- Detailed Branch Comparison Table -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
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

