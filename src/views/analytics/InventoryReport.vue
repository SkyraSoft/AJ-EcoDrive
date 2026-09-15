<script setup>
import { ref, computed } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

const selectedBranch = ref('All Branches')
const selectedPeriod = ref('This Month')
const openDropdown = ref(null)

const branches = ['All Branches', 'Peshawar', 'Islamabad', 'Lahore', 'Rawalpindi']
const periods = ['This Month', 'Last Month', 'This Quarter', 'This Year']

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
  selectedPeriod.value = 'This Month'
}

const kpis = [
  { label: 'Inventory Value', value: '41.8M' },
  { label: 'Units', value: '312' },
  { label: 'Available', value: '228' },
  { label: 'Low Stock', value: '9' }
]

const breakdown = [
  { branch: 'Peshawar', value: 92 },
  { branch: 'Islamabad', value: 74 },
  { branch: 'Lahore', value: 59 },
  { branch: 'Rawalpindi', value: 46 }
]

const details = ref([
  { product: 'BRG DS11', total: '51', available: '34', reserved: '9', incoming: '7', value: '6.4M' },
  { product: 'BRG EV-5', total: '29', available: '18', reserved: '5', incoming: '6', value: '4.8M' },
  { product: 'Cargo Pro', total: '22', available: '17', reserved: '2', incoming: '3', value: '4.1M' },
  { product: 'City Mini E-Scoot', total: '15', available: '12', reserved: '1', incoming: '2', value: '1.5M' }
])
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openDropdown = null">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">
          Super Admin / Analytics / Reports / <span class="font-bold text-gray-800">Inventory Report</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Inventory Report</h1>
        <p class="text-sm text-gray-500 mt-1">Operational inventory report with branch and date filters.</p>
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
          class="flex items-center gap-2 text-xs font-medium text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:bg-gray-50 cursor-pointer"
          :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedBranch !== 'All Branches' }"
        >
          <span>{{ selectedBranch }}</span>
          <ChevronDown class="w-3 h-3 text-gray-400" />
        </button>
        <div v-if="openDropdown === 'branch'" class="absolute left-0 mt-1 w-40 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
          <button 
            v-for="b in branches" 
            :key="b" 
            @click.stop="selectFilter('branch', b)"
            class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700 cursor-pointer"
            :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedBranch === b }"
          >
            {{ b }}
          </button>
        </div>
      </div>

      <!-- Period Dropdown -->
      <div class="relative">
        <button 
          @click.stop="toggleDropdown('period')"
          class="flex items-center gap-2 text-xs font-medium text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:bg-gray-50 cursor-pointer"
          :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedPeriod !== 'This Month' }"
        >
          <span>{{ selectedPeriod }}</span>
          <ChevronDown class="w-3 h-3 text-gray-400" />
        </button>
        <div v-if="openDropdown === 'period'" class="absolute left-0 mt-1 w-40 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
          <button 
            v-for="p in periods" 
            :key="p" 
            @click.stop="selectFilter('period', p)"
            class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700 cursor-pointer"
            :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedPeriod === p }"
          >
            {{ p }}
          </button>
        </div>
      </div>

      <button 
        v-if="selectedBranch !== 'All Branches' || selectedPeriod !== 'This Month'" 
        @click="resetFilters" 
        class="text-[11px] font-semibold text-gray-500 hover:text-red-600 px-2 py-1 transition-colors cursor-pointer"
      >
        Clear Filters
      </button>
    </div>

    <!-- 4 KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div 
        v-for="(kpi, index) in kpis" 
        :key="index" 
        class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between"
      >
        <div class="text-xs font-semibold text-gray-400 mb-2">{{ kpi.label }}</div>
        <div class="text-[22px] font-bold text-gray-900 leading-none">{{ kpi.value }}</div>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <h3 class="text-[13px] font-bold text-gray-900 mb-4">Trend ({{ selectedPeriod }})</h3>
        <div class="h-44 flex items-center justify-center p-2 bg-[#fcfdfd] rounded-lg">
          <svg class="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke="#165A31"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
              points="10,95 70,90 140,84 210,76 280,68 350,58 390,52"
            />
          </svg>
        </div>
      </div>

      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <h3 class="text-[13px] font-bold text-gray-900 mb-4">Breakdown</h3>
        <div class="space-y-3.5">
          <div v-for="item in breakdown" :key="item.branch" class="flex items-center gap-3">
            <span class="w-20 text-[11px] font-medium text-gray-600 truncate">{{ item.branch }}</span>
            <div class="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
              <div class="bg-[#165A31] h-full rounded-full" :style="{ width: `${item.value}%` }"></div>
            </div>
            <span class="w-6 text-right text-[11px] font-bold text-gray-900">{{ item.value }}</span>
          </div>
        </div>
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
              <th class="px-6 py-3">Product</th>
              <th class="px-6 py-3">Total</th>
              <th class="px-6 py-3">Available</th>
              <th class="px-6 py-3">Reserved</th>
              <th class="px-6 py-3">Incoming</th>
              <th class="px-6 py-3">Value</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr 
              v-for="(item, idx) in details" 
              :key="idx" 
              class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
            >
              <td class="px-6 py-4 font-semibold text-gray-900">{{ item.product }}</td>
              <td class="px-6 py-4 text-gray-900 font-bold">{{ item.total }}</td>
              <td class="px-6 py-4 text-gray-600 font-medium">{{ item.available }}</td>
              <td class="px-6 py-4 text-gray-600 font-medium">{{ item.reserved }}</td>
              <td class="px-6 py-4 text-gray-600 font-medium">{{ item.incoming }}</td>
              <td class="px-6 py-4 text-gray-900 font-bold">{{ item.value }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
