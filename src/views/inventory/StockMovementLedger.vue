<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const selectedBranch = ref('All Branches')
const selectedType = ref('All Types')
const selectedDate = ref('All Dates')
const openDropdown = ref(null)

const branches = ['All Branches', 'Peshawar', 'Islamabad', 'Lahore', 'Main Showroom', 'QC Area']
const movementTypes = ['All Types', 'QC → Available', 'Supplier Receipt', 'Transfer Dispatch', 'Sale']
const dates = ['All Dates', 'Aug 29', 'Aug 27', 'Aug 25']

const ledgerItems = ref([
  { time: 'Aug 29 15:04', unit: 'DS11-01001', movement: 'QC → Available', from: 'QC Area', to: 'Main Showroom', reference: 'GR-991', user: 'Ahsan Khan' },
  { time: 'Aug 29 14:32', unit: 'DS11-01001', movement: 'Supplier Receipt', from: 'Supplier', to: 'Peshawar', reference: 'GR-991', user: 'Ahsan Khan' },
  { time: 'Aug 27 16:20', unit: 'DS11-00971', movement: 'Transfer Dispatch', from: 'Islamabad', to: 'In Transit', reference: 'TR-119', user: 'Hassan Ali' },
  { time: 'Aug 27 11:18', unit: 'DS11-00988', movement: 'Sale', from: 'Islamabad', to: 'Customer', reference: 'SO-7731', user: 'Hamza Ali' },
  { time: 'Aug 25 10:15', unit: 'EVS-00441', movement: 'Supplier Receipt', from: 'Supplier', to: 'Lahore', reference: 'GR-988', user: 'Bilal Khan' }
])

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const selectFilter = (type, val) => {
  if (type === 'branch') selectedBranch.value = val
  if (type === 'movementType') selectedType.value = val
  if (type === 'date') selectedDate.value = val
  openDropdown.value = null
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedBranch.value = 'All Branches'
  selectedType.value = 'All Types'
  selectedDate.value = 'All Dates'
}

const filteredLedger = computed(() => {
  return ledgerItems.value.filter(item => {
    if (selectedBranch.value !== 'All Branches' && item.from !== selectedBranch.value && item.to !== selectedBranch.value) return false
    if (selectedType.value !== 'All Types' && item.movement !== selectedType.value) return false
    if (selectedDate.value !== 'All Dates' && !item.time.startsWith(selectedDate.value)) return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = item.unit.toLowerCase().includes(q) ||
                    item.movement.toLowerCase().includes(q) ||
                    item.from.toLowerCase().includes(q) ||
                    item.to.toLowerCase().includes(q) ||
                    item.reference.toLowerCase().includes(q) ||
                    item.user.toLowerCase().includes(q) ||
                    item.time.toLowerCase().includes(q)
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
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Inventory / <span class="font-bold text-gray-800">Stock Movement Ledger</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Stock Movement Ledger</h1>
        <p class="text-sm text-gray-500 mt-1">Immutable-style operational history of every inventory movement.</p>
      </div>
    </div>

    <!-- Filters Toolbar -->
    <div class="flex flex-wrap items-center gap-3">
      <!-- Search -->
      <div class="relative w-full sm:w-64">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Serial, SKU, reference..." 
          class="w-full pl-9 pr-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
        />
      </div>

      <!-- Branch Dropdown -->
      <div class="relative">
        <button 
          @click.stop="toggleDropdown('branch')"
          class="px-3 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex items-center gap-1"
          :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedBranch !== 'All Branches' }"
        >
          <span>{{ selectedBranch }}</span> <span class="text-[8px] text-gray-400">▼</span>
        </button>
        <div v-if="openDropdown === 'branch'" class="absolute left-0 mt-1 w-44 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
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

      <!-- Movement Type Dropdown -->
      <div class="relative">
        <button 
          @click.stop="toggleDropdown('type')"
          class="px-3 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex items-center gap-1"
          :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedType !== 'All Types' }"
        >
          <span>{{ selectedType }}</span> <span class="text-[8px] text-gray-400">▼</span>
        </button>
        <div v-if="openDropdown === 'type'" class="absolute left-0 mt-1 w-44 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
          <button 
            v-for="t in movementTypes" 
            :key="t" 
            @click.stop="selectFilter('movementType', t)"
            class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700"
            :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedType === t }"
          >
            {{ t }}
          </button>
        </div>
      </div>

      <!-- Date Dropdown -->
      <div class="relative">
        <button 
          @click.stop="toggleDropdown('date')"
          class="px-3 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex items-center gap-1"
          :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedDate !== 'All Dates' }"
        >
          <span>{{ selectedDate }}</span> <span class="text-[8px] text-gray-400">▼</span>
        </button>
        <div v-if="openDropdown === 'date'" class="absolute left-0 mt-1 w-36 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
          <button 
            v-for="d in dates" 
            :key="d" 
            @click.stop="selectFilter('date', d)"
            class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700"
            :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedDate === d }"
          >
            {{ d }}
          </button>
        </div>
      </div>

      <button 
        v-if="searchQuery || selectedBranch !== 'All Branches' || selectedType !== 'All Types' || selectedDate !== 'All Dates'" 
        @click="resetFilters" 
        class="text-[11px] font-semibold text-gray-500 hover:text-red-600 px-2 py-1 transition-colors"
      >
        Clear Filters
      </button>
    </div>

    <!-- Table Container -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-[14px] font-bold text-gray-900">Movement Ledger</h3>
        <span class="text-[11px] font-medium text-gray-500">Showing {{ filteredLedger.length }} logs</span>
      </div>
      
      <div class="overflow-x-auto">
        <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
              <th class="px-5 py-3">Time</th>
              <th class="px-5 py-3">Unit / SKU</th>
              <th class="px-5 py-3">Movement</th>
              <th class="px-5 py-3">From</th>
              <th class="px-5 py-3">To</th>
              <th class="px-5 py-3">Reference</th>
              <th class="px-5 py-3">User</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr v-for="item in filteredLedger" :key="item.time + item.unit" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer">
              <td class="px-5 py-4 font-semibold text-gray-900">{{ item.time }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.unit }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.movement }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.from }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.to }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.reference }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.user }}</td>
            </tr>
            <tr v-if="filteredLedger.length === 0">
              <td colspan="7" class="text-center py-12 text-gray-500">
                <div class="flex flex-col items-center justify-center">
                  <span class="text-2xl mb-2">🔍</span>
                  <p class="text-sm font-semibold text-gray-700">No movement records found</p>
                  <p class="text-xs text-gray-400 mt-1">Try adjusting your search criteria or filters</p>
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
