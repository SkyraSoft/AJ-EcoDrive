<script setup>
import { ref, computed } from 'vue'
import { Search, ChevronDown, Plus, Eye, MoreHorizontal, CheckCircle2 } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { store } from '../../store.js'
import CreateCaseModal from './CreateCase.vue'

const router = useRouter()
const showCreateModal = ref(false)
const showToast = ref(false)
const toastMessage = ref('')

const activeFilterTab = ref('All')
const filterTabs = ['All', 'Warranty', 'Service', 'Diagnosis', 'In Progress', 'Ready']

const searchQuery = ref('')
const selectedBranch = ref('All')

const resetFilters = () => {
  activeFilterTab.value = 'All'
  searchQuery.value = ''
  selectedBranch.value = 'All'
}

const filteredCases = computed(() => {
  return store.cases.filter(item => {
    // Filter by tab
    if (activeFilterTab.value === 'Warranty' && item.type !== 'Warranty') return false
    if (activeFilterTab.value === 'Service' && item.type !== 'Service') return false
    if (activeFilterTab.value === 'Diagnosis' && item.status !== 'Diagnosis') return false
    if (activeFilterTab.value === 'In Progress' && item.status !== 'In Progress') return false
    if (activeFilterTab.value === 'Ready' && item.status !== 'Ready') return false

    // Filter by branch
    if (selectedBranch.value !== 'All' && item.branch !== selectedBranch.value) return false

    // Search query
    if (searchQuery.value.trim() !== '') {
      const q = searchQuery.value.toLowerCase()
      const match = (
        item.caseId.toLowerCase().includes(q) ||
        item.customer.toLowerCase().includes(q) ||
        (item.unitSerial && item.unitSerial.toLowerCase().includes(q)) ||
        (item.unit && item.unit.toLowerCase().includes(q)) ||
        item.branch.toLowerCase().includes(q) ||
        (item.issue && item.issue.toLowerCase().includes(q))
      )
      if (!match) return false
    }

    return true
  })
})

const getWarrantyBadgeClass = (warranty) => {
  if (warranty === 'Active') return 'bg-[#eefcf2] text-[#165A31]'
  if (warranty === 'Paid') return 'text-gray-600 font-medium'
  return 'bg-gray-100 text-gray-500'
}

const getStatusBadgeClass = (status) => {
  if (status === 'Diagnosis') return 'bg-[#fef9c3] text-[#a16207]'
  if (status === 'In Progress') return 'bg-blue-50 text-blue-600'
  if (status === 'Parts Waiting') return 'bg-[#fff7ed] text-[#ea580c]'
  if (status === 'Ready' || status === 'Resolved') return 'bg-[#eefcf2] text-[#165A31]'
  return 'bg-gray-100 text-gray-600'
}

const openCaseDetail = (caseItem) => {
  store.selectCase(caseItem)
  router.push('/after-sales/warranty/detail')
}

const handleCaseCreated = (newCase) => {
  toastMessage.value = `Case ${newCase.caseId} created successfully!`
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 4000)
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Toast Notification -->
    <div 
      v-if="showToast" 
      class="fixed bottom-5 right-5 z-[110] bg-[#165A31] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200"
    >
      <CheckCircle2 class="w-5 h-5 text-green-300" />
      <span class="text-xs font-bold">{{ toastMessage }}</span>
    </div>

    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">
          Super Admin / After-sales / <span class="font-bold text-gray-800">Warranty & Service</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Warranty & Service</h1>
        <p class="text-sm text-gray-500 mt-1">Track warranty eligibility, service cases and resolution.</p>
      </div>
      
      <!-- Create Case Button -->
      <button 
        @click="showCreateModal = true" 
        class="bg-[#165A31] text-white text-[11px] font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer"
      >
        <Plus class="w-4 h-4" />
        + Create Case
      </button>
    </div>

    <!-- Filters & Table Area -->
    <div class="space-y-4">
      <!-- Filter Bar -->
      <div class="flex flex-wrap items-center gap-3">
        <!-- Filter Tabs -->
        <div class="flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
          <button 
            v-for="tab in filterTabs" 
            :key="tab"
            @click="activeFilterTab = tab"
            class="px-3.5 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer"
            :class="activeFilterTab === tab ? 'bg-[#eefcf2] text-[#165A31] font-bold' : 'text-gray-500 hover:text-gray-900'"
          >
            {{ tab }}
          </button>
        </div>

        <!-- Search Input -->
        <div class="relative flex-1 sm:max-w-xs shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
          <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search cases, customer, unit..." 
            class="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
          />
        </div>

        <!-- Branch Select -->
        <div class="relative">
          <select 
            v-model="selectedBranch"
            class="text-xs font-medium text-gray-700 bg-white px-3 py-2 pr-8 rounded-lg border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.01)] appearance-none focus:outline-none focus:border-[#165A31] cursor-pointer"
          >
            <option value="All">All Branches</option>
            <option value="Peshawar">Peshawar</option>
            <option value="Islamabad">Islamabad</option>
            <option value="Lahore">Lahore</option>
            <option value="Rawalpindi">Rawalpindi</option>
          </select>
          <ChevronDown class="w-3 h-3 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <button 
          v-if="searchQuery || activeFilterTab !== 'All' || selectedBranch !== 'All'" 
          @click="resetFilters" 
          class="text-[11px] font-semibold text-gray-500 hover:text-red-600 px-2 py-1 transition-colors cursor-pointer"
        >
          Clear Filters
        </button>
      </div>

      <!-- Table Container -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-[13px] font-bold text-gray-900">Warranty & Service Cases</h3>
          <span class="text-[11px] text-gray-400 font-medium">{{ filteredCases.length }} records</span>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th class="px-5 py-3">Case</th>
                <th class="px-5 py-3">Branch</th>
                <th class="px-5 py-3">Customer</th>
                <th class="px-5 py-3">Unit</th>
                <th class="px-5 py-3">Type</th>
                <th class="px-5 py-3">Opened</th>
                <th class="px-5 py-3">Warranty</th>
                <th class="px-5 py-3">Status</th>
                <th class="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr 
                v-for="item in filteredCases" 
                :key="item.caseId"
                @click="openCaseDetail(item)"
                class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer group"
              >
                <td class="px-5 py-4 font-semibold text-gray-900 group-hover:text-[#165A31] transition-colors">
                  {{ item.caseId }}
                </td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.branch }}</td>
                <td class="px-5 py-4 text-gray-800 font-semibold">{{ item.customer }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.unitSerial || item.unit }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.type }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.opened }}</td>
                <td class="px-5 py-4">
                  <span 
                    v-if="item.warranty === 'Active'" 
                    class="inline-flex items-center px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold" 
                    :class="getWarrantyBadgeClass(item.warranty)"
                  >
                    {{ item.warranty }}
                  </span>
                  <span v-else class="text-gray-600 font-medium text-[11px]">
                    {{ item.warranty }}
                  </span>
                </td>
                <td class="px-5 py-4">
                  <span 
                    class="inline-flex items-center px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold" 
                    :class="getStatusBadgeClass(item.status)"
                  >
                    {{ item.status }}
                  </span>
                </td>
                <td class="px-5 py-4 text-right">
                  <div class="flex items-center justify-end gap-1 text-gray-400 group-hover:text-[#165A31] font-medium tracking-wide">
                    <span>Open</span>
                    <span class="text-sm leading-none">&rarr;</span>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredCases.length === 0">
                <td colspan="9" class="px-5 py-10 text-center text-gray-400 text-xs">
                  <div class="flex flex-col items-center justify-center">
                    <span class="text-2xl mb-2">🔍</span>
                    <p class="text-sm font-semibold text-gray-700">No cases found matching your criteria</p>
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

    <!-- Create Case Popup Modal -->
    <CreateCaseModal 
      v-if="showCreateModal" 
      @close="showCreateModal = false" 
      @created="handleCaseCreated" 
    />

    <!-- Nested routes support -->
    <router-view />
  </div>
</template>
