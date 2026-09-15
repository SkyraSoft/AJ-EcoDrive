<script setup>
import { ref, computed } from 'vue'
import { Plus, CheckCircle2, ChevronDown, Search } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { store } from '../../store.js'
import CreateRepairJobModal from './CreateRepairJob.vue'

const router = useRouter()
const showCreateModal = ref(false)
const showToast = ref(false)
const toastMessage = ref('')

const activeFilterTab = ref('All')
const filterTabs = ['All', 'Diagnosis', 'Approved', 'In Progress', 'Parts Waiting', 'Ready', 'Completed']
const searchQuery = ref('')
const selectedBranch = ref('All Branches')
const openDropdown = ref(null)

const branches = ['All Branches', 'Peshawar', 'Islamabad', 'Lahore', 'Rawalpindi']

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const selectBranch = (b) => {
  selectedBranch.value = b
  openDropdown.value = null
}

const resetFilters = () => {
  activeFilterTab.value = 'All'
  searchQuery.value = ''
  selectedBranch.value = 'All Branches'
}

const filteredRepairs = computed(() => {
  return store.repairs.filter(item => {
    if (activeFilterTab.value !== 'All' && item.status.toLowerCase() !== activeFilterTab.value.toLowerCase()) return false
    if (selectedBranch.value !== 'All Branches' && item.branch !== selectedBranch.value) return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = item.repairId.toLowerCase().includes(q) ||
                    item.branch.toLowerCase().includes(q) ||
                    item.customer.toLowerCase().includes(q) ||
                    item.unit.toLowerCase().includes(q) ||
                    item.diagnosis.toLowerCase().includes(q) ||
                    item.status.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })
})

const getStatusBadgeClass = (status) => {
  if (status === 'Approved') return 'bg-blue-50 text-blue-600'
  if (status === 'In Progress') return 'bg-blue-50 text-blue-600'
  if (status === 'Parts Waiting') return 'bg-[#fff7ed] text-[#ea580c]'
  if (status === 'Ready' || status === 'Completed') return 'bg-[#eefcf2] text-[#165A31]'
  return 'bg-gray-100 text-gray-600'
}

const openRepairDetail = (job) => {
  store.selectRepair(job)
  router.push('/after-sales/repairs/detail')
}

const handleRepairCreated = (newJob) => {
  toastMessage.value = `Repair Job ${newJob.repairId} created successfully!`
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 4000)
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openDropdown = null">
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
          Super Admin / After-sales / <span class="font-bold text-gray-800">Repair Jobs</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Repair Jobs</h1>
        <p class="text-sm text-gray-500 mt-1">Track workshop jobs, parts, labour, approval and completion.</p>
      </div>

      <!-- Create Repair Job Button -->
      <button 
        @click="showCreateModal = true" 
        class="bg-[#165A31] text-white text-[11px] font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer"
      >
        <Plus class="w-4 h-4" />
        + Create Repair Job
      </button>
    </div>

    <!-- Filters Bar -->
    <div class="space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <!-- Status Tabs -->
        <div class="flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-[0_2px_4px_rgba(0,0,0,0.01)] overflow-x-auto max-w-full">
          <button 
            v-for="tab in filterTabs" 
            :key="tab"
            @click="activeFilterTab = tab"
            class="px-3.5 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap cursor-pointer"
            :class="activeFilterTab === tab ? 'bg-[#eefcf2] text-[#165A31] font-bold' : 'text-gray-500 hover:text-gray-900'"
          >
            {{ tab }}
          </button>
        </div>

        <div class="flex items-center gap-3">
          <!-- Search -->
          <div class="relative w-full sm:w-60 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
            <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search repair, customer..." 
              class="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
            />
          </div>

          <!-- Branch Dropdown -->
          <div class="relative">
            <button 
              @click.stop="toggleDropdown('branch')"
              class="flex items-center gap-2 text-xs font-medium text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:bg-gray-50 transition-colors"
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
            v-if="searchQuery || activeFilterTab !== 'All' || selectedBranch !== 'All Branches'" 
            @click="resetFilters" 
            class="text-[11px] font-semibold text-gray-500 hover:text-red-600 px-2 py-1 transition-colors cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      <!-- Table Container -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-[13px] font-bold text-gray-900">Repair Jobs</h3>
          <span class="text-[11px] text-gray-400 font-medium">{{ filteredRepairs.length }} jobs</span>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th class="px-5 py-3">Repair</th>
                <th class="px-5 py-3">Branch</th>
                <th class="px-5 py-3">Customer</th>
                <th class="px-5 py-3">Unit</th>
                <th class="px-5 py-3">Diagnosis</th>
                <th class="px-5 py-3">Parts</th>
                <th class="px-5 py-3">Status</th>
                <th class="px-5 py-3">Ready</th>
                <th class="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr 
                v-for="item in filteredRepairs" 
                :key="item.repairId"
                @click="openRepairDetail(item)"
                class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer group"
              >
                <td class="px-5 py-4 font-semibold text-gray-900 group-hover:text-[#165A31] transition-colors">
                  {{ item.repairId }}
                </td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.branch }}</td>
                <td class="px-5 py-4 text-gray-800 font-semibold">{{ item.customer }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.unit }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.diagnosis }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.partsName }}</td>
                <td class="px-5 py-4">
                  <span 
                    class="inline-flex items-center px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold" 
                    :class="getStatusBadgeClass(item.status)"
                  >
                    {{ item.status }}
                  </span>
                </td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.readyDate }}</td>
                <td class="px-5 py-4 text-right">
                  <div class="flex items-center justify-end gap-1 text-gray-400 group-hover:text-[#165A31] font-medium tracking-wide">
                    <span>Open</span>
                    <span class="text-sm leading-none">&rarr;</span>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredRepairs.length === 0">
                <td colspan="9" class="text-center py-12 text-gray-500">
                  <div class="flex flex-col items-center justify-center">
                    <span class="text-2xl mb-2">🔍</span>
                    <p class="text-sm font-semibold text-gray-700">No repair jobs found</p>
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

    <!-- Create Repair Job Popup Modal -->
    <CreateRepairJobModal 
      v-if="showCreateModal" 
      @close="showCreateModal = false" 
      @created="handleRepairCreated" 
    />

    <!-- Nested routes support -->
    <router-view />
  </div>
</template>
