<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDown, Search, Check, Plus, Pencil } from 'lucide-vue-next'
import { store } from '../../store.js'
import CreateQuarantineRecordModal from './CreateQuarantineRecord.vue'

const router = useRouter()
const showCreateModal = ref(false)
const selectedQuarantineToEdit = ref(null)

const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

// Branch Manager Data
const branchKpis = [
  { label: 'Affected Units', value: '4' },
  { label: 'Quarantine', value: '2' },
  { label: 'Service Route', value: '1' },
  { label: 'Decision Pending', value: '1' }
]

const branchAffectedUnits = ref([
  {
    id: 'M3-01014',
    unit: 'M3-01014',
    product: 'BRG M3',
    condition: 'Packaging damage',
    source: 'TR-221',
    decision: 'QC / service',
    notes: 'Minor packaging damage identified upon unloading. Body inspection shows minor surface friction, internal components verified intact.',
    status: 'Quarantine',
    statusClass: 'bg-[#fef3c7] text-[#b45309]'
  },
  {
    id: 'X5-00401',
    unit: 'X5-00401',
    product: 'BRG X5',
    condition: 'Body panel dent',
    source: 'Inbound INB-083',
    decision: 'Supplier-return review',
    notes: 'Deep dent on right side fairing.',
    status: 'Decision Pending',
    statusClass: 'bg-[#fee2e2] text-[#b91c1c]'
  }
])

const branchStatusFilter = ref('All')
const openBranchDropdown = ref(null)
const branchSearchQuery = ref('')

const toggleBranchDropdown = (name) => {
  openBranchDropdown.value = openBranchDropdown.value === name ? null : name
}

const filteredBranchAffectedUnits = computed(() => {
  return branchAffectedUnits.value.filter(item => {
    if (branchStatusFilter.value !== 'All' && item.status.toLowerCase() !== branchStatusFilter.value.toLowerCase()) {
      return false
    }
    if (branchSearchQuery.value.trim()) {
      const q = branchSearchQuery.value.toLowerCase()
      const match = item.unit.toLowerCase().includes(q) ||
                    item.product.toLowerCase().includes(q) ||
                    item.condition.toLowerCase().includes(q) ||
                    item.status.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })
})

const openCreateModal = () => {
  selectedQuarantineToEdit.value = null
  showCreateModal.value = true
}

const openEditModal = (item) => {
  selectedQuarantineToEdit.value = { ...item }
  showCreateModal.value = true
}

const handleCreated = (item) => {
  branchAffectedUnits.value.unshift({
    ...item,
    unit: item.unit || item.id,
    statusClass: 'bg-[#fef3c7] text-[#b45309]'
  })
}

const handleUpdated = (item) => {
  const idx = branchAffectedUnits.value.findIndex(q => q.id === item.id || q.unit === item.unit || q.unit === item.id)
  if (idx !== -1) {
    branchAffectedUnits.value[idx] = {
      ...branchAffectedUnits.value[idx],
      ...item,
      unit: item.unit || item.id
    }
  }
}

// Super Admin Data
const searchQuery = ref('')
const selectedBranch = ref('All Branches')
const selectedStatus = ref('All Statuses')
const openDropdown = ref(null)

const branches = ['All Branches', 'Peshawar', 'Islamabad', 'Lahore']
const statuses = ['All Statuses', 'Review', 'Approval', 'QC Hold', 'Scrap Pending']

const quarantineItems = ref([
  { serial: 'EV5-00441', unit: 'EV5-00441', product: 'BRG EV-5', branch: 'Peshawar', condition: 'Transit scratch', reason: 'Transit scratch', since: 'Aug 29', proposed: 'Supplier claim', decision: 'Supplier-return review', status: 'Review' },
  { serial: 'DS11-00831', unit: 'DS11-00831', product: 'BRG DS11', branch: 'Lahore', condition: 'Accident damage', reason: 'Accident damage', since: 'Aug 22', proposed: 'Scrap', decision: 'Scrap pending', status: 'Approval' },
  { serial: 'EV5-00438', unit: 'EV5-00438', product: 'BRG EV-5', branch: 'Islamabad', condition: 'Battery fault', reason: 'Battery fault', since: 'Aug 25', proposed: 'Supplier claim', decision: 'QC / service', status: 'Review' },
  { serial: 'DS11-00810', unit: 'DS11-00810', product: 'BRG DS11', branch: 'Peshawar', condition: 'Electrical issue', reason: 'Electrical issue', since: 'Aug 18', proposed: 'Internal repair', decision: 'Internal repair', status: 'QC Hold' }
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
  <!-- BRANCH MANAGER VIEW -->
  <div v-if="isBranchUser" class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openBranchDropdown = null">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[11px] text-gray-400 mb-1">
          Branch Manager / Damaged / Quarantine / <span class="font-medium text-gray-600">Damaged / Quarantine</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Damaged / Quarantine</h1>
        <p class="text-xs text-gray-500 mt-1">Local affected units awaiting service, supplier-return or management decision.</p>
      </div>
      <button 
        @click="openCreateModal" 
        class="bg-[#165A31] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
      >
        <Plus class="w-4 h-4" />
        <span>Report Damaged / Quarantine</span>
      </button>
    </div>

    <!-- 4 KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="(kpi, index) in branchKpis" :key="index" class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <div class="text-xs font-semibold text-gray-400 mb-3">{{ kpi.label }}</div>
        <div>
          <div class="text-[26px] font-bold text-gray-900 leading-tight">{{ kpi.value }}</div>
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
          <div v-if="openBranchDropdown === 'status'" class="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button 
              v-for="st in ['All', 'Quarantine', 'Decision Pending', 'QC Hold', 'Service Route']"
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
            placeholder="Search unit or product..." 
            class="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
          />
        </div>
      </div>
    </div>

    <!-- Affected Units Table Card -->
    <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-bold text-gray-900">Affected Units</h3>
        <span class="text-xs text-gray-400 font-medium">Showing {{ filteredBranchAffectedUnits.length }} units</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="text-[10px] font-bold text-gray-400 border-b border-gray-100 pb-3 uppercase tracking-wider">
              <th class="pb-3 font-semibold w-36">Unit</th>
              <th class="pb-3 font-semibold w-36">Product</th>
              <th class="pb-3 font-semibold w-48">Condition</th>
              <th class="pb-3 font-semibold w-36">Source</th>
              <th class="pb-3 font-semibold w-48">Decision</th>
              <th class="pb-3 font-semibold w-36">Status</th>
              <th class="pb-3 font-semibold w-24 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="text-xs divide-y divide-gray-50">
            <tr 
              v-for="(item, index) in filteredBranchAffectedUnits" 
              :key="index" 
              class="hover:bg-gray-50/50 transition-colors"
            >
              <td class="py-4 align-middle font-bold text-gray-900">
                {{ item.unit }}
              </td>
              <td class="py-4 align-middle text-gray-800 font-semibold">
                {{ item.product }}
              </td>
              <td class="py-4 align-middle text-gray-700 font-medium">
                {{ item.condition }}
              </td>
              <td class="py-4 align-middle text-gray-700 font-medium">
                {{ item.source }}
              </td>
              <td class="py-4 align-middle text-gray-700 font-medium">
                {{ item.decision }}
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
                  title="Edit Record"
                >
                  <Pencil class="w-4 h-4 text-[#165A31]" />
                </button>
              </td>
            </tr>
            <tr v-if="filteredBranchAffectedUnits.length === 0">
              <td colspan="7" class="text-center py-8 text-xs text-gray-400">
                No quarantine units match your filters.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Popup -->
    <CreateQuarantineRecordModal 
      v-if="showCreateModal" 
      :quarantine-item="selectedQuarantineToEdit"
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
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Inventory / <span class="font-bold text-gray-800">Damaged / Quarantine / Scrap</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Damaged / Quarantine / Scrap</h1>
        <p class="text-sm text-gray-500 mt-1">Inspect and decide disposition of non-sellable physical units.</p>
      </div>
      <button 
        @click="openCreateModal" 
        class="px-4 py-2 bg-[#165A31] text-white text-[11px] font-bold rounded-lg hover:bg-[#114a28] transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
      >
        <Plus class="w-4 h-4" />
        <span>Report Damaged / Quarantine</span>
      </button>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

    <!-- Filters Row -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-wrap items-center gap-2">
        <div class="relative w-full sm:w-64">
          <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search serial, model..." 
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
              @click.stop="selectFilter('branch', b)"
              class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700"
              :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedBranch === b }"
            >
              {{ b }}
            </button>
          </div>
        </div>

        <button 
          v-if="searchQuery || selectedBranch !== 'All Branches' || selectedStatus !== 'All Statuses'" 
          @click="resetFilters" 
          class="text-xs font-semibold text-gray-500 hover:text-red-600 px-2 py-1 transition-colors cursor-pointer"
        >
          Clear
        </button>
      </div>
    </div>

    <!-- Table Container -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-[14px] font-bold text-gray-900">Quarantine Units</h3>
        <span class="text-xs text-gray-400 font-medium">Showing {{ filteredItems.length }} units</span>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
              <th class="px-5 py-3">Serial</th>
              <th class="px-5 py-3">Product</th>
              <th class="px-5 py-3">Branch</th>
              <th class="px-5 py-3">Reason</th>
              <th class="px-5 py-3">Since</th>
              <th class="px-5 py-3">Proposed Action</th>
              <th class="px-5 py-3">Status</th>
              <th class="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr v-for="item in filteredItems" :key="item.serial" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <td class="px-5 py-4 font-semibold text-gray-900">{{ item.serial }}</td>
              <td class="px-5 py-4 text-gray-900 font-medium">{{ item.product }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.branch }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.reason }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.since }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.proposed }}</td>
              <td class="px-5 py-4">
                <span class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-amber-50 text-amber-600">{{ item.status }}</span>
              </td>
              <td class="px-5 py-4 text-right">
                <button @click="openEditModal(item)" class="text-[#165A31] font-bold hover:underline cursor-pointer">
                  Edit &rarr;
                </button>
              </td>
            </tr>
            <tr v-if="filteredItems.length === 0">
              <td colspan="8" class="text-center py-8 text-xs text-gray-400">
                No quarantine units match your filters.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Popup -->
    <CreateQuarantineRecordModal 
      v-if="showCreateModal" 
      :quarantine-item="selectedQuarantineToEdit"
      @close="showCreateModal = false"
      @created="handleCreated"
      @updated="handleUpdated"
    />
  </div>
</template>
