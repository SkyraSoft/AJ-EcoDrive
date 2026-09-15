<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const activeTab = ref('All')
const tabs = ['All', 'Requested', 'Approved', 'Picking', 'In Transit', 'Received']
const searchQuery = ref('')
const selectedBranch = ref('All Branches')
const openDropdown = ref(null)

const branches = ['All Branches', 'Peshawar', 'Islamabad', 'Lahore']

const transfers = ref([
  { id: 'TR-119', from: 'Islamabad', to: 'Peshawar', units: '4', requestedBy: 'Super Admin', dispatched: 'Aug 27', status: 'In Transit' },
  { id: 'TR-117', from: 'Lahore', to: 'Islamabad', units: '3', requestedBy: 'Hassan Ali', dispatched: 'Aug 25', status: 'Received' },
  { id: 'TR-120', from: 'Peshawar', to: 'Lahore', units: '2', requestedBy: 'Bilal Khan', dispatched: 'Aug 29', status: 'Requested' },
  { id: 'TR-121', from: 'Islamabad', to: 'Lahore', units: '5', requestedBy: 'Hamza Ali', dispatched: 'Aug 30', status: 'Approved' },
  { id: 'TR-122', from: 'Lahore', to: 'Peshawar', units: '1', requestedBy: 'Super Admin', dispatched: 'Aug 31', status: 'Picking' }
])

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const selectBranch = (branch) => {
  selectedBranch.value = branch
  openDropdown.value = null
}

const resetFilters = () => {
  activeTab.value = 'All'
  searchQuery.value = ''
  selectedBranch.value = 'All Branches'
}

const filteredTransfers = computed(() => {
  return transfers.value.filter(item => {
    if (activeTab.value !== 'All' && item.status.toLowerCase() !== activeTab.value.toLowerCase()) return false
    if (selectedBranch.value !== 'All Branches' && item.from !== selectedBranch.value && item.to !== selectedBranch.value) return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = item.id.toLowerCase().includes(q) ||
                    item.from.toLowerCase().includes(q) ||
                    item.to.toLowerCase().includes(q) ||
                    item.requestedBy.toLowerCase().includes(q) ||
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
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Inventory / <span class="font-bold text-gray-800">Transfers</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Transfers</h1>
        <p class="text-sm text-gray-500 mt-1">Control stock movement between AJ ECODRIVE branches.</p>
      </div>
      <button @click="router.push('/inventory/transfers/create')" class="px-4 py-2 bg-[#165A31] text-white text-[11px] font-bold rounded-lg hover:bg-[#114a28] transition-colors shadow-sm flex items-center gap-2">
        <span>+ Create Transfer</span>
      </button>
    </div>

    <!-- Tabs & Filter Bar -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-wrap items-center gap-2">
        <button 
          v-for="tab in tabs" 
          :key="tab"
          @click="activeTab = tab"
          class="px-4 py-1.5 rounded-lg text-[11px] font-bold transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] border cursor-pointer"
          :class="activeTab === tab ? 'bg-[#eefcf2] text-[#165A31] border-[#eefcf2]' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'"
        >
          {{ tab }}
        </button>
      </div>

      <div class="flex items-center gap-3">
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
            placeholder="Search transfer ID, branch..." 
            class="w-full pl-9 pr-3 py-1.5 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
          />
        </div>

        <!-- Branch dropdown -->
        <div class="relative">
          <button 
            @click.stop="toggleDropdown('branch')"
            class="px-3 py-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex items-center gap-2"
            :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedBranch !== 'All Branches' }"
          >
            <span>{{ selectedBranch }}</span>
            <span class="text-[8px] text-gray-400">▼</span>
          </button>
          <div v-if="openDropdown === 'branch'" class="absolute right-0 mt-1 w-40 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
            <button 
              v-for="b in branches" 
              :key="b" 
              @click.stop="selectBranch(b)"
              class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700"
              :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedBranch === b }"
            >
              {{ b }}
            </button>
          </div>
        </div>

        <button 
          v-if="searchQuery || activeTab !== 'All' || selectedBranch !== 'All Branches'" 
          @click="resetFilters" 
          class="text-[11px] font-semibold text-gray-500 hover:text-red-600 px-2 py-1 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>

    <!-- Table Container -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-[14px] font-bold text-gray-900">Transfers</h3>
        <span class="text-[11px] font-medium text-gray-500">Showing {{ filteredTransfers.length }} transfers</span>
      </div>
      
      <div class="overflow-x-auto">
        <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
              <th class="px-5 py-3">Transfer</th>
              <th class="px-5 py-3">From</th>
              <th class="px-5 py-3">To</th>
              <th class="px-5 py-3">Units</th>
              <th class="px-5 py-3">Requested By</th>
              <th class="px-5 py-3">Dispatched</th>
              <th class="px-5 py-3">Status</th>
              <th class="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr v-for="item in filteredTransfers" :key="item.id" @click="router.push('/inventory/transfers/detail')" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer">
              <td class="px-5 py-4 font-semibold text-gray-900">{{ item.id }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.from }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.to }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.units }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.requestedBy }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.dispatched }}</td>
              <td class="px-5 py-4">
                <span v-if="item.status === 'Received'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">{{ item.status }}</span>
                <span v-else-if="item.status === 'In Transit'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-blue-50 text-blue-600">{{ item.status }}</span>
                <span v-else-if="item.status === 'Picking'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-amber-50 text-amber-600">{{ item.status }}</span>
                <span v-else-if="item.status === 'Approved'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-emerald-50 text-emerald-600">{{ item.status }}</span>
                <span v-else class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-gray-100 text-gray-600">{{ item.status }}</span>
              </td>
              <td class="px-5 py-4 font-semibold text-gray-600 text-right">Open &rarr;</td>
            </tr>
            <tr v-if="filteredTransfers.length === 0">
              <td colspan="8" class="text-center py-12 text-gray-500">
                <div class="flex flex-col items-center justify-center">
                  <span class="text-2xl mb-2">🔍</span>
                  <p class="text-sm font-semibold text-gray-700">No transfers found</p>
                  <p class="text-xs text-gray-400 mt-1">Try adjusting your active tab or search query</p>
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

  <router-view />
</template>