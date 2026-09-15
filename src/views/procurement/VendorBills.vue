<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const selectedMatch = ref('All Statuses')
const selectedSupplier = ref('All Suppliers')
const openDropdown = ref(null)

const matchStatuses = ['All Statuses', 'Matched', 'Review', 'Paid']
const suppliers = ['All Suppliers', 'BRG Factory', 'Pak Logistics', 'PowerCell Co.']

const vendorBills = ref([
  { bill: 'BILL-791', supplier: 'BRG Factory', po: 'PO-2048', receipt: 'GR-991', amount: '2.65M', due: 'Sep 28', paid: '0', outstanding: '2.65M', match: 'Matched', action: 'Open · Pay' },
  { bill: 'BILL-784', supplier: 'BRG Factory', po: 'PO-2022', receipt: 'GR-975', amount: '2.2M', due: 'Sep 10', paid: '0', outstanding: '2.2M', match: 'Review', action: 'Open' },
  { bill: 'BILL-778', supplier: 'Pak Logistics', po: 'PO-1992', receipt: 'GR-982', amount: '180K', due: 'Sep 02', paid: '180K', outstanding: '0', match: 'Paid', action: 'Open' },
  { bill: 'BILL-770', supplier: 'PowerCell Co.', po: 'PO-1960', receipt: 'GR-960', amount: '1.2M', due: 'Aug 15', paid: '1.2M', outstanding: '0', match: 'Paid', action: 'Open' }
])

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const selectFilter = (type, val) => {
  if (type === 'match') selectedMatch.value = val
  if (type === 'supplier') selectedSupplier.value = val
  openDropdown.value = null
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedMatch.value = 'All Statuses'
  selectedSupplier.value = 'All Suppliers'
}

const filteredBills = computed(() => {
  return vendorBills.value.filter(item => {
    if (selectedMatch.value !== 'All Statuses' && item.match !== selectedMatch.value) return false
    if (selectedSupplier.value !== 'All Suppliers' && item.supplier !== selectedSupplier.value) return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = item.bill.toLowerCase().includes(q) ||
                    item.supplier.toLowerCase().includes(q) ||
                    item.po.toLowerCase().includes(q) ||
                    item.receipt.toLowerCase().includes(q) ||
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
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Procurement / <span class="font-bold text-gray-800">Vendor Bills</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Vendor Bills</h1>
        <p class="text-sm text-gray-500 mt-1">Match supplier invoices against purchase orders and receipts.</p>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <div class="text-[11px] font-semibold text-gray-400 mb-2">Open Bills</div>
        <div class="text-[22px] font-bold text-gray-900 leading-none">7</div>
      </div>
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <div class="text-[11px] font-semibold text-gray-400 mb-2">Due This Week</div>
        <div class="text-[22px] font-bold text-gray-900 leading-none">3</div>
      </div>
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <div class="text-[11px] font-semibold text-gray-400 mb-2">Outstanding</div>
        <div class="text-[22px] font-bold text-gray-900 leading-none">PKR 6.1M</div>
      </div>
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <div class="text-[11px] font-semibold text-gray-400 mb-2">3-Way Exceptions</div>
        <div class="text-[22px] font-bold text-gray-900 leading-none">2</div>
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
          placeholder="Search bill, supplier, PO..." 
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
        v-if="searchQuery || selectedMatch !== 'All Statuses' || selectedSupplier !== 'All Suppliers'" 
        @click="resetFilters" 
        class="text-[11px] font-semibold text-gray-500 hover:text-red-600 px-2 py-1 transition-colors"
      >
        Clear Filters
      </button>
    </div>

    <!-- Table Container -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-[14px] font-bold text-gray-900">Vendor Bills</h3>
        <span class="text-[11px] font-medium text-gray-500">Showing {{ filteredBills.length }} bills</span>
      </div>
      
      <div class="overflow-x-auto">
        <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
              <th class="px-5 py-3">Bill</th>
              <th class="px-5 py-3">Supplier</th>
              <th class="px-5 py-3">PO</th>
              <th class="px-5 py-3">Receipt</th>
              <th class="px-5 py-3">Amount</th>
              <th class="px-5 py-3">Due</th>
              <th class="px-5 py-3">Paid</th>
              <th class="px-5 py-3">Outstanding</th>
              <th class="px-5 py-3">Match</th>
              <th class="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr v-for="item in filteredBills" :key="item.bill" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer">
              <td class="px-5 py-4 font-semibold text-gray-900">{{ item.bill }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.supplier }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.po }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.receipt }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.amount }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.due }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.paid }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.outstanding }}</td>
              <td class="px-5 py-4">
                <span v-if="item.match === 'Matched' || item.match === 'Paid'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">{{ item.match }}</span>
                <span v-else-if="item.match === 'Review'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-amber-50 text-amber-600">{{ item.match }}</span>
                <span v-else class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-gray-100 text-gray-600">{{ item.match }}</span>
              </td>
              <td class="px-5 py-4 text-gray-400 font-bold tracking-widest hover:text-gray-600 cursor-pointer text-right">
                {{ item.action.split(' · ').join(' &middot; ') }}
              </td>
            </tr>
            <tr v-if="filteredBills.length === 0">
              <td colspan="10" class="text-center py-12 text-gray-500">
                <div class="flex flex-col items-center justify-center">
                  <span class="text-2xl mb-2">🔍</span>
                  <p class="text-sm font-semibold text-gray-700">No vendor bills found</p>
                  <p class="text-xs text-gray-400 mt-1">Try adjusting your filters or search query</p>
                  <button @click="resetFilters" class="mt-3 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors">
                    Reset filters
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table></div>
      </div>
    </div>
  </div>
</template>
