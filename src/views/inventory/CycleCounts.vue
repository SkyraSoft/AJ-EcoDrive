<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDown, Search, Check, Plus, Pencil } from 'lucide-vue-next'
import { store } from '../../store.js'
import CreateCycleCountModal from './CreateCycleCount.vue'

const router = useRouter()
const showCreateModal = ref(false)
const selectedCountToEdit = ref(null)

const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

// Branch Manager Data
const branchKpis = [
  { label: 'Open', value: '2' },
  { label: 'Due Today', value: '1' },
  { label: 'Discrepancies', value: '3' },
  { label: 'Completed', value: '9', sub: 'This month' }
]

const branchCycleCounts = ref([
  {
    id: 'CC-031',
    count: 'CC-031',
    name: 'Showroom Count',
    scope: 'Showroom units',
    assignedTo: 'Branch Team',
    due: 'Today',
    expected: '20',
    counted: '18',
    targetLocation: 'Main Showroom',
    status: 'In Progress',
    statusClass: 'bg-[#e0e7ff] text-[#3730a3]'
  },
  {
    id: 'CC-030',
    count: 'CC-030',
    name: 'Warehouse A Audit',
    scope: 'Warehouse A',
    assignedTo: 'Auditor & Storekeeper',
    due: '30 Aug',
    expected: '36',
    counted: '0',
    targetLocation: 'Warehouse Staging',
    status: 'Scheduled',
    statusClass: 'bg-[#f1f5f9] text-[#475569]'
  }
])

const branchStatusFilter = ref('All')
const openBranchDropdown = ref(null)
const branchSearchQuery = ref('')

const toggleBranchDropdown = (name) => {
  openBranchDropdown.value = openBranchDropdown.value === name ? null : name
}

const filteredBranchCycleCounts = computed(() => {
  return branchCycleCounts.value.filter(item => {
    if (branchStatusFilter.value !== 'All' && item.status.toLowerCase() !== branchStatusFilter.value.toLowerCase()) {
      return false
    }
    if (branchSearchQuery.value.trim()) {
      const q = branchSearchQuery.value.toLowerCase()
      const match = item.count.toLowerCase().includes(q) ||
                    item.scope.toLowerCase().includes(q) ||
                    item.status.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })
})

const openCreateModal = () => {
  selectedCountToEdit.value = null
  showCreateModal.value = true
}

const openEditModal = (item) => {
  selectedCountToEdit.value = { ...item }
  showCreateModal.value = true
}

const handleCreated = (item) => {
  branchCycleCounts.value.unshift({
    ...item,
    count: item.id || item.session,
    due: item.scheduledDate || 'Today',
    statusClass: 'bg-[#e0e7ff] text-[#3730a3]'
  })
}

const handleUpdated = (item) => {
  const idx = branchCycleCounts.value.findIndex(c => c.id === item.id || c.count === item.id || c.count === item.session)
  if (idx !== -1) {
    branchCycleCounts.value[idx] = {
      ...branchCycleCounts.value[idx],
      ...item,
      count: item.id || item.session
    }
  }
}

// Super Admin Data
const searchQuery = ref('')
const selectedBranch = ref('All Branches')
const selectedStatus = ref('All')
const openDropdown = ref(null)

const branches = ['All Branches', 'Peshawar', 'Islamabad', 'Lahore']

const cycleCounts = ref([
  { id: 'CC-091', branch: 'Peshawar', scope: 'Main Showroom', countName: 'Showroom Audit', expected: '118', counted: '116', variance: '2 loss', status: 'Review', owner: 'Ahsan Khan', actionText: 'Review' },
  { id: 'CC-088', branch: 'Islamabad', scope: 'Full Branch', countName: 'Quarterly Audit', expected: '84', counted: '84', variance: '0', status: 'Closed', owner: 'Hassan Ali', actionText: 'Open' }
])

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const selectBranch = (b) => {
  selectedBranch.value = b
  openDropdown.value = null
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedBranch.value = 'All Branches'
  selectedStatus.value = 'All'
}

const filteredCycleCounts = computed(() => {
  return cycleCounts.value.filter(item => {
    if (selectedStatus.value !== 'All' && item.status.toLowerCase() !== selectedStatus.value.toLowerCase()) return false
    if (selectedBranch.value !== 'All Branches' && item.branch !== selectedBranch.value) return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = item.id.toLowerCase().includes(q) ||
                    item.branch.toLowerCase().includes(q) ||
                    item.scope.toLowerCase().includes(q) ||
                    item.status.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })
})
</script>

<template>
  <!-- BRANCH MANAGER VIEW -->
  <div v-if="isBranchUser" class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openBranchDropdown = null">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[11px] text-gray-400 mb-1">
          Branch Manager / Cycle Counts / <span class="font-medium text-gray-600">Cycle Counts</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Cycle Counts</h1>
        <p class="text-xs text-gray-500 mt-1">Assigned and scheduled {{ user?.branchName || 'Peshawar' }} Branch physical counts.</p>
      </div>
      <button 
        @click="openCreateModal" 
        class="bg-[#165A31] text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer"
      >
        <Plus class="w-4 h-4" />
        <span>Start Count</span>
      </button>
    </div>

    <!-- 4 KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="(kpi, index) in branchKpis" :key="index" class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <div class="text-xs font-semibold text-gray-400 mb-3">{{ kpi.label }}</div>
        <div>
          <div class="text-[26px] font-bold text-gray-900 leading-tight">{{ kpi.value }}</div>
          <div v-if="kpi.sub" class="text-[11px] font-bold text-[#165A31] mt-1">{{ kpi.sub }}</div>
        </div>
      </div>
    </div>

    <!-- Filter Buttons Row -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex flex-wrap items-center gap-2">
        <!-- Status Filter Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('status')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <span>Status: {{ branchStatusFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openBranchDropdown === 'status'" class="absolute top-full left-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button 
              v-for="st in ['All', 'In Progress', 'Scheduled', 'Closed']"
              :key="st"
              @click="branchStatusFilter = st; openBranchDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
              :class="branchStatusFilter === st ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ st }}</span>
              <Check v-if="branchStatusFilter === st" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <!-- Search Input -->
        <div class="relative w-48 sm:w-64">
          <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            v-model="branchSearchQuery"
            type="text" 
            placeholder="Search count or scope..." 
            class="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
          />
        </div>
      </div>
    </div>

    <!-- Cycle Counts Table Card -->
    <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-bold text-gray-900">Cycle Counts</h3>
        <span class="text-xs text-gray-400 font-medium">Showing {{ filteredBranchCycleCounts.length }} count sessions</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="text-[10px] font-bold text-gray-400 border-b border-gray-100 pb-3 uppercase tracking-wider">
              <th class="pb-3 font-semibold w-36">Count</th>
              <th class="pb-3 font-semibold w-48">Scope</th>
              <th class="pb-3 font-semibold w-36">Due</th>
              <th class="pb-3 font-semibold w-32">Expected</th>
              <th class="pb-3 font-semibold w-32">Counted</th>
              <th class="pb-3 font-semibold w-36">Status</th>
              <th class="pb-3 font-semibold w-24 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="text-xs divide-y divide-gray-50">
            <tr 
              v-for="(item, index) in filteredBranchCycleCounts" 
              :key="index" 
              class="hover:bg-gray-50/50 transition-colors"
            >
              <td class="py-4 align-middle font-bold text-gray-900">
                {{ item.count }}
              </td>
              <td class="py-4 align-middle text-gray-700 font-medium">
                {{ item.scope }}
              </td>
              <td class="py-4 align-middle text-gray-700 font-medium">
                {{ item.due }}
              </td>
              <td class="py-4 align-middle text-gray-700 font-medium">
                {{ item.expected }}
              </td>
              <td class="py-4 align-middle text-gray-700 font-medium">
                {{ item.counted }}
              </td>
              <td class="py-4 align-middle">
                <span class="px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap" :class="item.statusClass">
                  {{ item.status }}
                </span>
              </td>
              <td class="py-4 align-middle text-right whitespace-nowrap">
                <button 
                  @click="openEditModal(item)" 
                  class="p-1.5 text-gray-400 hover:text-[#165A31] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center"
                  title="Edit Cycle Count"
                >
                  <Pencil class="w-4 h-4 text-[#165A31]" />
                </button>
              </td>
            </tr>
            <tr v-if="filteredBranchCycleCounts.length === 0">
              <td colspan="7" class="text-center py-8 text-xs text-gray-400">
                No cycle counts match your filters.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Popup -->
    <CreateCycleCountModal 
      v-if="showCreateModal" 
      :count-item="selectedCountToEdit"
      @close="showCreateModal = false"
      @created="handleCreated"
      @updated="handleUpdated"
    />
  </div>

  <!-- SUPER ADMIN VIEW -->
  <div v-else class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openDropdown = null">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Inventory / <span class="font-bold text-gray-800">Cycle Counts</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Cycle Counts</h1>
        <p class="text-sm text-gray-500 mt-1">Verify physical stock against system records.</p>
      </div>
      <button 
        @click="openCreateModal" 
        class="px-4 py-2 bg-[#165A31] text-white text-[11px] font-bold rounded-lg hover:bg-[#114a28] transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
      >
        <Plus class="w-4 h-4" />
        <span>Create Cycle Count</span>
      </button>
    </div>

    <!-- Filters Row -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-wrap items-center gap-2">
        <div class="relative w-full sm:w-64">
          <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search cycle counts..." 
            class="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
          />
        </div>

        <div class="relative">
          <button 
            @click.stop="toggleDropdown('branch')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span>{{ selectedBranch }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openDropdown === 'branch'" class="absolute left-0 mt-1 w-40 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-xs">
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
          v-if="searchQuery || selectedBranch !== 'All Branches'" 
          @click="resetFilters" 
          class="text-xs font-semibold text-gray-500 hover:text-red-600 px-2 py-1 transition-colors cursor-pointer"
        >
          Clear
        </button>
      </div>
    </div>

    <!-- Table Container -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100">
        <h3 class="text-[14px] font-bold text-gray-900">Cycle Counts</h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
              <th class="px-5 py-3">Count</th>
              <th class="px-5 py-3">Branch</th>
              <th class="px-5 py-3">Scope</th>
              <th class="px-5 py-3">Expected Units</th>
              <th class="px-5 py-3">Counted</th>
              <th class="px-5 py-3">Variance</th>
              <th class="px-5 py-3">Status</th>
              <th class="px-5 py-3">Owner</th>
              <th class="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr v-for="item in filteredCycleCounts" :key="item.id" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <td class="px-5 py-4 font-semibold text-gray-900">{{ item.id }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.branch }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.scope }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.expected }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.counted }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.variance }}</td>
              <td class="px-5 py-4">
                <span v-if="item.status === 'Review'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-amber-50 text-amber-600">{{ item.status }}</span>
                <span v-else-if="item.status === 'Closed'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">{{ item.status }}</span>
                <span v-else class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-gray-100 text-gray-600">{{ item.status }}</span>
              </td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.owner }}</td>
              <td class="px-5 py-4 text-right">
                <button @click="openEditModal(item)" class="text-[#165A31] font-bold hover:underline cursor-pointer">
                  {{ item.actionText }} &rarr;
                </button>
              </td>
            </tr>
            <tr v-if="filteredCycleCounts.length === 0">
              <td colspan="9" class="text-center py-8 text-xs text-gray-400">
                No cycle counts match your filters.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Popup -->
    <CreateCycleCountModal 
      v-if="showCreateModal" 
      :count-item="selectedCountToEdit"
      @close="showCreateModal = false"
      @created="handleCreated"
      @updated="handleUpdated"
    />
  </div>
</template>