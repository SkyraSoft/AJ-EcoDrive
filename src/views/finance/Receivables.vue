<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const selectedBranch = ref('All Branches')
const selectedAge = ref('All Statuses')
const openDropdown = ref(null)

const branches = ['All Branches', 'Peshawar', 'Islamabad', 'Lahore']
const ageStatuses = ['All Statuses', 'Current', 'Overdue']

const kpis = [
  { label: 'Total Receivables', value: 'PKR 2.9M' },
  { label: 'Current', value: 'PKR 2.0M' },
  { label: 'Overdue', value: 'PKR 0.9M' },
  { label: 'Customers Overdue', value: '17' }
]

const receivables = ref([
  { customer: 'Faisal Khan', branch: 'Peshawar', order: 'SO-7740', total: '185K', paid: '100K', balance: '85K', due: 'Aug 31', age: 'Current', actionText: 'Open >', actionClass: 'text-gray-500 hover:text-gray-900' },
  { customer: 'Ahmad Traders', branch: 'Lahore', order: 'SO-7658', total: '540K', paid: '300K', balance: '240K', due: 'Aug 20', age: '7d overdue', actionText: 'Collect >', actionClass: 'text-[#165A31] font-bold hover:underline' },
  { customer: 'Tariq Mehmood', branch: 'Islamabad', order: 'SO-7712', total: '210K', paid: '150K', balance: '60K', due: 'Sep 05', age: 'Current', actionText: 'Open >', actionClass: 'text-gray-500 hover:text-gray-900' },
  { customer: 'Bilal Motors', branch: 'Peshawar', order: 'SO-7601', total: '720K', paid: '200K', balance: '520K', due: 'Aug 10', age: '15d overdue', actionText: 'Collect >', actionClass: 'text-[#165A31] font-bold hover:underline' }
])

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const selectFilter = (type, val) => {
  if (type === 'branch') selectedBranch.value = val
  if (type === 'age') selectedAge.value = val
  openDropdown.value = null
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedBranch.value = 'All Branches'
  selectedAge.value = 'All Statuses'
}

const filteredReceivables = computed(() => {
  return receivables.value.filter(item => {
    if (selectedBranch.value !== 'All Branches' && item.branch !== selectedBranch.value) return false
    if (selectedAge.value === 'Current' && item.age !== 'Current') return false
    if (selectedAge.value === 'Overdue' && !item.age.toLowerCase().includes('overdue')) return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = item.customer.toLowerCase().includes(q) ||
                    item.branch.toLowerCase().includes(q) ||
                    item.order.toLowerCase().includes(q) ||
                    item.balance.toLowerCase().includes(q) ||
                    item.age.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })
})
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openDropdown = null">
    <!-- Header -->
    <div>
      <div class="text-[10px] text-gray-500 mb-1">
        Super Admin / Finance / <span class="font-bold text-gray-800">Receivables</span>
      </div>
      <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Receivables</h1>
      <p class="text-sm text-gray-500 mt-1">Track customer balances and overdue collections.</p>
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

    <!-- Filters Bar -->
    <div class="flex flex-wrap items-center gap-3">
      <div class="relative w-full sm:w-64">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search customer, order, balance..." 
          class="w-full pl-9 pr-3 py-1.5 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
        />
      </div>

      <!-- Branch Dropdown -->
      <div class="relative">
        <button 
          @click.stop="toggleDropdown('branch')"
          class="px-3 py-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex items-center gap-2"
          :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedBranch !== 'All Branches' }"
        >
          <span>{{ selectedBranch }}</span>
          <span class="text-[8px] text-gray-400">▼</span>
        </button>
        <div v-if="openDropdown === 'branch'" class="absolute left-0 mt-1 w-40 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
          <button 
            v-for="b in branches" 
            :key="b" 
            @click.stop="selectFilter('branch', b)"
            class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700"
            :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedBranch === b }"
          >
            {{ b }}
          </button>
        </div>
      </div>

      <!-- Age Status Dropdown -->
      <div class="relative">
        <button 
          @click.stop="toggleDropdown('age')"
          class="px-3 py-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex items-center gap-2"
          :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedAge !== 'All Statuses' }"
        >
          <span>{{ selectedAge }}</span>
          <span class="text-[8px] text-gray-400">▼</span>
        </button>
        <div v-if="openDropdown === 'age'" class="absolute left-0 mt-1 w-36 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
          <button 
            v-for="a in ageStatuses" 
            :key="a" 
            @click.stop="selectFilter('age', a)"
            class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700"
            :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedAge === a }"
          >
            {{ a }}
          </button>
        </div>
      </div>

      <button 
        v-if="searchQuery || selectedBranch !== 'All Branches' || selectedAge !== 'All Statuses'" 
        @click="resetFilters" 
        class="text-[11px] font-semibold text-gray-500 hover:text-red-600 px-2 py-1 transition-colors"
      >
        Clear Filters
      </button>
    </div>

    <!-- Table Container -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-[13px] font-bold text-gray-900">Receivables</h3>
        <span class="text-[11px] font-medium text-gray-500">Showing {{ filteredReceivables.length }} receivables</span>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <th class="px-6 py-3">Customer</th>
              <th class="px-6 py-3">Branch</th>
              <th class="px-6 py-3">Order</th>
              <th class="px-6 py-3">Total</th>
              <th class="px-6 py-3">Paid</th>
              <th class="px-6 py-3">Balance</th>
              <th class="px-6 py-3">Due</th>
              <th class="px-6 py-3">Age</th>
              <th class="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr 
              v-for="(item, idx) in filteredReceivables" 
              :key="idx" 
              class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
            >
              <td class="px-6 py-4 font-semibold text-gray-900">{{ item.customer }}</td>
              <td class="px-6 py-4 text-gray-600 font-medium">{{ item.branch }}</td>
              <td class="px-6 py-4 text-gray-600 font-medium">{{ item.order }}</td>
              <td class="px-6 py-4 text-gray-600 font-medium">{{ item.total }}</td>
              <td class="px-6 py-4 text-gray-600 font-medium">{{ item.paid }}</td>
              <td class="px-6 py-4 text-gray-900 font-bold">{{ item.balance }}</td>
              <td class="px-6 py-4 text-gray-600 font-medium">{{ item.due }}</td>
              <td class="px-6 py-4">
                <span v-if="item.age === 'Current'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">
                  {{ item.age }}
                </span>
                <span v-else class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-amber-50 text-amber-600">
                  {{ item.age }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <span class="cursor-pointer text-xs" :class="item.actionClass">
                  {{ item.actionText }}
                </span>
              </td>
            </tr>
            <tr v-if="filteredReceivables.length === 0">
              <td colspan="9" class="text-center py-12 text-gray-500">
                <div class="flex flex-col items-center justify-center">
                  <span class="text-2xl mb-2">🔍</span>
                  <p class="text-sm font-semibold text-gray-700">No receivables found</p>
                  <p class="text-xs text-gray-400 mt-1">Try adjusting your filters or search query</p>
                  <button @click="resetFilters" class="mt-3 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors">
                    Reset filters
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
