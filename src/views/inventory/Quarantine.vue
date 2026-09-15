<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const selectedBranch = ref('All Branches')
const selectedStatus = ref('All Statuses')
const openDropdown = ref(null)

const branches = ['All Branches', 'Peshawar', 'Islamabad', 'Lahore']
const statuses = ['All Statuses', 'Review', 'Approval', 'QC Hold', 'Scrap Pending']

const quarantineItems = ref([
  { serial: 'EV5-00441', product: 'BRG EV-5', branch: 'Peshawar', reason: 'Transit scratch', since: 'Aug 29', proposed: 'Supplier claim', status: 'Review' },
  { serial: 'DS11-00831', product: 'BRG DS11', branch: 'Lahore', reason: 'Accident damage', since: 'Aug 22', proposed: 'Scrap', status: 'Approval' },
  { serial: 'EV5-00438', product: 'BRG EV-5', branch: 'Islamabad', reason: 'Battery fault', since: 'Aug 25', proposed: 'Supplier claim', status: 'Review' },
  { serial: 'DS11-00810', product: 'BRG DS11', branch: 'Peshawar', reason: 'Electrical issue', since: 'Aug 18', proposed: 'Internal repair', status: 'QC Hold' }
])

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const selectFilter = (type, val) => {
  if (type === 'branch') selectedBranch.value = val
  if (type === 'status') selectedStatus.value = val
  openDropdown.value = null
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedBranch.value = 'All Branches'
  selectedStatus.value = 'All Statuses'
}

const filteredItems = computed(() => {
  return quarantineItems.value.filter(item => {
    if (selectedBranch.value !== 'All Branches' && item.branch !== selectedBranch.value) return false
    if (selectedStatus.value !== 'All Statuses' && item.status !== selectedStatus.value) return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = item.serial.toLowerCase().includes(q) ||
                    item.product.toLowerCase().includes(q) ||
                    item.branch.toLowerCase().includes(q) ||
                    item.reason.toLowerCase().includes(q) ||
                    item.proposed.toLowerCase().includes(q) ||
                    item.status.toLowerCase().includes(q)
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
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Inventory / <span class="font-bold text-gray-800">Damaged / Quarantine / Scrap</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Damaged / Quarantine / Scrap</h1>
        <p class="text-sm text-gray-500 mt-1">Inspect and decide disposition of non-sellable physical units.</p>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <div class="text-[11px] font-semibold text-gray-400 mb-2">QC Hold</div>
        <div class="text-[22px] font-bold text-gray-900 leading-none">7</div>
      </div>
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <div class="text-[11px] font-semibold text-gray-400 mb-2">Damaged</div>
        <div class="text-[22px] font-bold text-gray-900 leading-none">5</div>
      </div>
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <div class="text-[11px] font-semibold text-gray-400 mb-2">Supplier Claim</div>
        <div class="text-[22px] font-bold text-gray-900 leading-none">2</div>
      </div>
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <div class="text-[11px] font-semibold text-gray-400 mb-2">Scrap Pending</div>
        <div class="text-[22px] font-bold text-gray-900 leading-none">1</div>
      </div>
    </div>

    <!-- Filters Toolbar -->
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
          placeholder="Search unit, reason, proposed..." 
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
          <span>{{ selectedBranch }}</span> <span class="text-[8px] text-gray-400">▼</span>
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

      <!-- Status Dropdown -->
      <div class="relative">
        <button 
          @click.stop="toggleDropdown('status')"
          class="px-3 py-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex items-center gap-2"
          :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedStatus !== 'All Statuses' }"
        >
          <span>{{ selectedStatus }}</span> <span class="text-[8px] text-gray-400">▼</span>
        </button>
        <div v-if="openDropdown === 'status'" class="absolute left-0 mt-1 w-40 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
          <button 
            v-for="s in statuses" 
            :key="s" 
            @click.stop="selectFilter('status', s)"
            class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700"
            :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedStatus === s }"
          >
            {{ s }}
          </button>
        </div>
      </div>

      <button 
        v-if="searchQuery || selectedBranch !== 'All Branches' || selectedStatus !== 'All Statuses'" 
        @click="resetFilters" 
        class="text-[11px] font-semibold text-gray-500 hover:text-red-600 px-2 py-1 transition-colors"
      >
        Clear
      </button>
    </div>

    <!-- Table Container -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-[14px] font-bold text-gray-900">Units Requiring Disposition</h3>
        <span class="text-[11px] font-medium text-gray-500">Showing {{ filteredItems.length }} units</span>
      </div>
      
      <div class="overflow-x-auto">
        <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
              <th class="px-5 py-3">Serial</th>
              <th class="px-5 py-3">Product</th>
              <th class="px-5 py-3">Branch</th>
              <th class="px-5 py-3">Reason</th>
              <th class="px-5 py-3">Since</th>
              <th class="px-5 py-3">Proposed</th>
              <th class="px-5 py-3">Status</th>
              <th class="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr v-for="item in filteredItems" :key="item.serial" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer">
              <td class="px-5 py-4 font-semibold text-gray-900">{{ item.serial }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.product }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.branch }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.reason }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.since }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.proposed }}</td>
              <td class="px-5 py-4">
                <span class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-amber-50 text-amber-600">{{ item.status }}</span>
              </td>
              <td class="px-5 py-4 font-semibold text-gray-600 text-right">Inspect &rarr;</td>
            </tr>
            <tr v-if="filteredItems.length === 0">
              <td colspan="8" class="text-center py-12 text-gray-500">
                <div class="flex flex-col items-center justify-center">
                  <span class="text-2xl mb-2">🔍</span>
                  <p class="text-sm font-semibold text-gray-700">No quarantine units found</p>
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
