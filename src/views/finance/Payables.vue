<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const selectedSupplier = ref('All Suppliers')
const selectedMatch = ref('All Statuses')
const openDropdown = ref(null)

const suppliers = ['All Suppliers', 'BRG Factory', 'Pak Logistics', 'PowerCell Co.']
const matchStatuses = ['All Statuses', 'Matched', 'Paid', 'Review']

const kpis = [
  { label: 'Total Payables', value: 'PKR 6.1M' },
  { label: 'Due This Week', value: 'PKR 2.4M' },
  { label: 'Overdue', value: 'PKR 0.7M' },
  { label: 'Suppliers', value: '6' }
]

const payables = ref([
  {
    supplier: 'BRG Factory',
    bill: 'BILL-791',
    po: 'PO-2048',
    amount: '2.65M',
    paid: '0',
    outstanding: '2.65M',
    due: 'Sep 28',
    match: 'Matched',
    matchClass: 'bg-[#eefcf2] text-[#165A31]',
    action: 'Pay >',
    actionClass: 'text-[#165A31] font-bold hover:underline'
  },
  {
    supplier: 'Pak Logistics',
    bill: 'BILL-778',
    po: 'PO-1992',
    amount: '180K',
    paid: '180K',
    outstanding: '0',
    due: 'Sep 02',
    match: 'Paid',
    matchClass: 'bg-[#eefcf2] text-[#165A31]',
    action: 'Open >',
    actionClass: 'text-gray-400 hover:text-gray-700'
  },
  {
    supplier: 'PowerCell Co.',
    bill: 'BILL-762',
    po: 'PO-1950',
    amount: '850K',
    paid: '0',
    outstanding: '850K',
    due: 'Sep 15',
    match: 'Review',
    matchClass: 'bg-amber-50 text-amber-600',
    action: 'Review >',
    actionClass: 'text-amber-600 font-bold hover:underline'
  }
])

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const selectFilter = (type, val) => {
  if (type === 'supplier') selectedSupplier.value = val
  if (type === 'match') selectedMatch.value = val
  openDropdown.value = null
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedSupplier.value = 'All Suppliers'
  selectedMatch.value = 'All Statuses'
}

const filteredPayables = computed(() => {
  return payables.value.filter(item => {
    if (selectedSupplier.value !== 'All Suppliers' && item.supplier !== selectedSupplier.value) return false
    if (selectedMatch.value !== 'All Statuses' && item.match !== selectedMatch.value) return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = item.supplier.toLowerCase().includes(q) ||
                    item.bill.toLowerCase().includes(q) ||
                    item.po.toLowerCase().includes(q) ||
                    item.amount.toLowerCase().includes(q) ||
                    item.match.toLowerCase().includes(q)
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
        Super Admin / Finance / <span class="font-bold text-gray-800">Payables</span>
      </div>
      <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Payables</h1>
      <p class="text-sm text-gray-500 mt-1">Track supplier bills and due payments.</p>
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
          placeholder="Search supplier, bill, PO..." 
          class="w-full pl-9 pr-3 py-1.5 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
        />
      </div>

      <!-- Supplier Dropdown -->
      <div class="relative">
        <button 
          @click.stop="toggleDropdown('supplier')"
          class="px-3 py-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex items-center gap-2"
          :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedSupplier !== 'All Suppliers' }"
        >
          <span>{{ selectedSupplier }}</span>
          <span class="text-[8px] text-gray-400">▼</span>
        </button>
        <div v-if="openDropdown === 'supplier'" class="absolute left-0 mt-1 w-40 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
          <button 
            v-for="s in suppliers" 
            :key="s" 
            @click.stop="selectFilter('supplier', s)"
            class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700"
            :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedSupplier === s }"
          >
            {{ s }}
          </button>
        </div>
      </div>

      <!-- Match Status Dropdown -->
      <div class="relative">
        <button 
          @click.stop="toggleDropdown('match')"
          class="px-3 py-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex items-center gap-2"
          :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedMatch !== 'All Statuses' }"
        >
          <span>{{ selectedMatch }}</span>
          <span class="text-[8px] text-gray-400">▼</span>
        </button>
        <div v-if="openDropdown === 'match'" class="absolute left-0 mt-1 w-36 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
          <button 
            v-for="m in matchStatuses" 
            :key="m" 
            @click.stop="selectFilter('match', m)"
            class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700"
            :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedMatch === m }"
          >
            {{ m }}
          </button>
        </div>
      </div>

      <button 
        v-if="searchQuery || selectedSupplier !== 'All Suppliers' || selectedMatch !== 'All Statuses'" 
        @click="resetFilters" 
        class="text-[11px] font-semibold text-gray-500 hover:text-red-600 px-2 py-1 transition-colors"
      >
        Clear Filters
      </button>
    </div>

    <!-- Table Container -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-[13px] font-bold text-gray-900">Payables</h3>
        <span class="text-[11px] font-medium text-gray-500">Showing {{ filteredPayables.length }} payables</span>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <th class="px-6 py-3">Supplier</th>
              <th class="px-6 py-3">Bill</th>
              <th class="px-6 py-3">PO</th>
              <th class="px-6 py-3">Amount</th>
              <th class="px-6 py-3">Paid</th>
              <th class="px-6 py-3">Outstanding</th>
              <th class="px-6 py-3">Due</th>
              <th class="px-6 py-3">Match</th>
              <th class="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr 
              v-for="(item, idx) in filteredPayables" 
              :key="idx" 
              class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
            >
              <td class="px-6 py-4 font-semibold text-gray-900">{{ item.supplier }}</td>
              <td class="px-6 py-4 text-gray-600 font-medium">{{ item.bill }}</td>
              <td class="px-6 py-4 text-gray-600 font-medium">{{ item.po }}</td>
              <td class="px-6 py-4 text-gray-900 font-bold">{{ item.amount }}</td>
              <td class="px-6 py-4 text-gray-600 font-medium">{{ item.paid }}</td>
              <td class="px-6 py-4 text-gray-900 font-bold">{{ item.outstanding }}</td>
              <td class="px-6 py-4 text-gray-600 font-medium">{{ item.due }}</td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[9px] font-bold" :class="item.matchClass">
                  {{ item.match }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button class="cursor-pointer text-xs" :class="item.actionClass">
                  {{ item.action }}
                </button>
              </td>
            </tr>
            <tr v-if="filteredPayables.length === 0">
              <td colspan="9" class="text-center py-12 text-gray-500">
                <div class="flex flex-col items-center justify-center">
                  <span class="text-2xl mb-2">🔍</span>
                  <p class="text-sm font-semibold text-gray-700">No payables found</p>
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
