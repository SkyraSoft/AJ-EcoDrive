<script setup>
import { Search, ChevronDown } from 'lucide-vue-next'
import { ref, computed } from 'vue'

const activeTab = ref('All')
const tabs = ['All', 'Pending', 'Approved', 'Rejected']
const searchQuery = ref('')
const selectedBranch = ref('All Branches')
const openDropdown = ref(null)

const branches = ['All Branches', 'Peshawar', 'Islamabad', 'Lahore']

const requestsData = ref([
  { request: 'PR-0181', branch: 'Peshawar', product: 'BRG DS12', reason: 'Customer demand', submitted: 'Aug 27', status: 'Pending', action: 'Review' },
  { request: 'PR-0178', branch: 'Lahore', product: 'BRG Cargo Max', reason: 'Commercial lead', submitted: 'Aug 20', status: 'Pending', action: 'Review' },
  { request: 'PR-0162', branch: 'Islamabad', product: 'BRG City Mini', reason: 'New segment', submitted: 'Aug 19', status: 'Approved', action: 'Open' },
  { request: 'PR-0155', branch: 'Peshawar', product: 'BRG HyperSport', reason: 'Custom racing request', submitted: 'Aug 10', status: 'Rejected', action: 'View' }
])

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const selectBranch = (b) => {
  selectedBranch.value = b
  openDropdown.value = null
}

const resetFilters = () => {
  activeTab.value = 'All'
  searchQuery.value = ''
  selectedBranch.value = 'All Branches'
}

const filteredRequests = computed(() => {
  return requestsData.value.filter(item => {
    if (activeTab.value !== 'All' && item.status.toLowerCase() !== activeTab.value.toLowerCase()) return false
    if (selectedBranch.value !== 'All Branches' && item.branch !== selectedBranch.value) return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = item.request.toLowerCase().includes(q) ||
                    item.branch.toLowerCase().includes(q) ||
                    item.product.toLowerCase().includes(q) ||
                    item.reason.toLowerCase().includes(q) ||
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
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Catalogue / <span class="font-bold text-gray-800">Product Requests</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Product Requests</h1>
        <p class="text-sm text-gray-500 mt-1">Review branch requests for missing products or catalogue additions.</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <!-- Tabs -->
      <div class="flex items-center gap-2">
        <button 
          v-for="tab in tabs" 
          :key="tab"
          @click="activeTab = tab"
          class="px-4 py-1.5 rounded-full text-[11px] font-bold transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] border cursor-pointer"
          :class="activeTab === tab ? 'bg-[#eefcf2] text-[#165A31] border-[#eefcf2]' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'"
        >
          {{ tab }}
        </button>
      </div>

      <div class="flex items-center gap-3">
        <!-- Search -->
        <div class="relative w-full sm:w-64 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search request..." 
            class="w-full px-4 py-1.5 bg-white border border-gray-200 rounded-lg text-[11px] placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
          />
        </div>

        <!-- Branch Dropdown -->
        <div class="relative">
          <button 
            @click.stop="toggleDropdown('branch')"
            class="flex items-center gap-2 text-[11px] font-medium text-gray-600 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:bg-gray-50 transition-colors"
            :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedBranch !== 'All Branches' }"
          >
            <span>{{ selectedBranch }}</span>
            <ChevronDown class="w-3 h-3 text-gray-400" />
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
          class="text-[11px] font-semibold text-gray-500 hover:text-red-600 px-2 py-1 transition-colors cursor-pointer"
        >
          Clear
        </button>
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-[14px] font-bold text-gray-900">Requests</h3>
        <span class="text-[11px] font-medium text-gray-500">Showing {{ filteredRequests.length }} requests</span>
      </div>
      
      <div class="overflow-x-auto">
        <div class="w-full overflow-x-auto"><table class="w-full text-left">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
              <th class="px-5 py-3">Request</th>
              <th class="px-5 py-3">Branch</th>
              <th class="px-5 py-3">Requested Product</th>
              <th class="px-5 py-3">Reason</th>
              <th class="px-5 py-3">Submitted</th>
              <th class="px-5 py-3">Status</th>
              <th class="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr v-for="item in filteredRequests" :key="item.request" @click="$router.push('/catalogue/requests/detail')" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer">
              <td class="px-5 py-4 font-semibold text-gray-900">{{ item.request }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.branch }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.product }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.reason }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.submitted }}</td>
              <td class="px-5 py-4">
                <span v-if="item.status === 'Pending'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-amber-50 text-amber-600">{{ item.status }}</span>
                <span v-else-if="item.status === 'Approved'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">{{ item.status }}</span>
                <span v-else-if="item.status === 'Rejected'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-red-50 text-red-600">{{ item.status }}</span>
              </td>
              <td class="px-5 py-4 text-gray-600 font-medium cursor-pointer hover:text-gray-900 text-right">
                {{ item.action }} &rarr;
              </td>
            </tr>
            <tr v-if="filteredRequests.length === 0">
              <td colspan="7" class="text-center py-12 text-gray-500">
                <div class="flex flex-col items-center justify-center">
                  <span class="text-2xl mb-2">🔍</span>
                  <p class="text-sm font-semibold text-gray-700">No product requests found</p>
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
</template>
