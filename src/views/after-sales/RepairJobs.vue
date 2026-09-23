<script setup>
import { ref, computed } from 'vue'
import { Plus, CheckCircle2, ChevronDown, Search, Check, Pencil, Eye } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { store } from '../../store.js'
import CreateRepairJobModal from './CreateRepairJob.vue'

const router = useRouter()
const showCreateModal = ref(false)
const selectedRepairToEdit = ref(null)
const showToast = ref(false)
const toastMessage = ref('')

const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

// --- BRANCH MANAGER VIEW DATA ---
const branchKPIs = computed(() => {
  const currentBranch = user.value?.branchName || 'Peshawar'
  const branchList = store.repairs.filter(item => !item.branch || store.isBranchAllowed(item.branch))
  const openCount = branchList.filter(r => r.status === 'In Progress' || r.status === 'Diagnosis').length
  const partsCount = branchList.filter(r => r.status === 'Parts Waiting' || r.status === 'Awaiting Parts').length
  const approvalCount = branchList.filter(r => r.status === 'Approval Needed' || r.status === 'Approved').length
  const readyCount = branchList.filter(r => r.status === 'Ready' || r.status === 'Completed').length
  return [
    { label: 'Open Jobs', value: String(openCount || 9), subtext: '3 due today', subtextClass: 'text-[#165A31] font-medium' },
    { label: 'Awaiting Parts', value: String(partsCount || 5), subtext: '2 overdue', subtextClass: 'text-gray-400 font-medium' },
    { label: 'Approval Needed', value: String(approvalCount || 2), subtext: 'Customer decision', subtextClass: 'text-gray-400 font-medium' },
    { label: 'Ready', value: String(readyCount || 6), subtext: 'Notify customers', subtextClass: 'text-gray-400 font-medium' }
  ]
})

const branchStatusFilter = ref('All')
const branchDateFilter = ref('Date')
const branchSavedFilter = ref('Saved filters')
const branchTechnicianFilter = ref('All Technicians')
const branchUnitFilter = ref('All Units')
const branchSearchQuery = ref('')
const openBranchDropdown = ref(null)

const branchColumns = ref([
  { key: 'repairId', label: 'Repair', visible: true },
  { key: 'caseRef', label: 'Case', visible: true },
  { key: 'customer', label: 'Customer', visible: true },
  { key: 'unit', label: 'Unit', visible: true },
  { key: 'technician', label: 'Technician', visible: true },
  { key: 'promised', label: 'Promised', visible: true },
  { key: 'status', label: 'Status', visible: true }
])

const toggleBranchDropdown = (name) => {
  openBranchDropdown.value = openBranchDropdown.value === name ? null : name
}

const selectBranchSavedFilter = (preset) => {
  branchSavedFilter.value = preset
  if (preset === 'Awaiting Parts') {
    branchStatusFilter.value = 'Awaiting Parts'
  } else if (preset === 'Approval Needed') {
    branchStatusFilter.value = 'Approval Needed'
  } else if (preset === 'Ready for Customer') {
    branchStatusFilter.value = 'Ready'
  }
  openBranchDropdown.value = null
}

const clearBranchFilters = () => {
  branchStatusFilter.value = 'All'
  branchDateFilter.value = 'Date'
  branchSavedFilter.value = 'Saved filters'
  branchTechnicianFilter.value = 'All Technicians'
  branchUnitFilter.value = 'All Units'
  branchSearchQuery.value = ''
}

const hasActiveBranchFilters = computed(() => {
  return branchStatusFilter.value !== 'All' ||
    branchDateFilter.value !== 'Date' ||
    branchSavedFilter.value !== 'Saved filters' ||
    branchTechnicianFilter.value !== 'All Technicians' ||
    branchUnitFilter.value !== 'All Units' ||
    branchSearchQuery.value.trim() !== ''
})

const filteredBranchRepairs = computed(() => {
  const currentBranch = user.value?.branchName || 'Peshawar'
  return store.repairs.filter(item => {
    if (item.branch && !store.isBranchAllowed(item.branch)) {
      return false
    }
    if (branchStatusFilter.value !== 'All') {
      if (item.status.toLowerCase() !== branchStatusFilter.value.toLowerCase()) {
        return false
      }
    }
    if (branchTechnicianFilter.value !== 'All Technicians' && item.technician !== branchTechnicianFilter.value) {
      return false
    }
    if (branchUnitFilter.value !== 'All Units' && (!item.unit || !item.unit.includes(branchUnitFilter.value))) {
      return false
    }
    if (branchDateFilter.value === 'Today' && item.promised !== 'Today' && item.readyDate !== 'Today') {
      return false
    }
    if (branchSearchQuery.value.trim()) {
      const q = branchSearchQuery.value.toLowerCase()
      const match = item.repairId.toLowerCase().includes(q) ||
                    (item.caseRef && item.caseRef.toLowerCase().includes(q)) ||
                    item.customer.toLowerCase().includes(q) ||
                    item.unit.toLowerCase().includes(q) ||
                    (item.technician && item.technician.toLowerCase().includes(q)) ||
                    item.diagnosis.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })
})

const exportBranchRepairs = () => {
  const headers = ['Repair ID', 'Case Ref', 'Customer', 'Unit', 'Technician', 'Promised', 'Status']
  const rows = filteredBranchRepairs.value.map(item => [
    item.repairId,
    item.caseRef || '',
    item.customer,
    item.unit,
    item.technician || '',
    item.promised || item.readyDate || '',
    item.status
  ])
  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `repair_jobs_${Date.now()}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  toastMessage.value = `Exported ${filteredBranchRepairs.value.length} repair jobs successfully.`
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3000)
}

const getBranchStatusBadgeClass = (status) => {
  if (status === 'In Progress') return 'bg-[#fef3c7] text-[#92400e]'
  if (status === 'Ready' || status === 'Completed') return 'bg-[#dcfce7] text-[#15803d]'
  if (status === 'Awaiting Parts' || status === 'Parts Waiting') return 'bg-[#fff7ed] text-[#ea580c]'
  if (status === 'Approval Needed' || status === 'Approved') return 'bg-blue-50 text-blue-700'
  return 'bg-gray-100 text-gray-700'
}

// --- SUPER ADMIN VIEW DATA ---
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
  if (status === 'Parts Waiting' || status === 'Awaiting Parts') return 'bg-[#fff7ed] text-[#ea580c]'
  if (status === 'Ready' || status === 'Completed') return 'bg-[#eefcf2] text-[#165A31]'
  return 'bg-gray-100 text-gray-600'
}

const openRepairDetail = (job) => {
  store.selectRepair(job)
  router.push({
    path: '/after-sales/repairs/detail',
    query: { id: job.repairId }
  })
}

const openCreateModal = () => {
  selectedRepairToEdit.value = null
  store.originalEditRepair = null
  showCreateModal.value = true
}

const openEditModal = (job) => {
  selectedRepairToEdit.value = job
  store.originalEditRepair = job
  showCreateModal.value = true
}

const handleRepairCreated = (newJob) => {
  toastMessage.value = `Repair Job ${newJob.repairId} created successfully!`
  showToast.value = true
  showCreateModal.value = false
  setTimeout(() => {
    showToast.value = false
  }, 4000)
}

const handleRepairUpdated = (updatedJob) => {
  toastMessage.value = `Repair Job ${updatedJob.repairId} updated successfully!`
  showToast.value = true
  showCreateModal.value = false
  setTimeout(() => {
    showToast.value = false
  }, 4000)
}
</script>

<template>
  <!-- BRANCH MANAGER VIEW -->
  <div v-if="isBranchUser" class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openBranchDropdown = null">
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
        <div class="text-[11px] text-gray-400 mb-1">
          Branch Manager / Repairs / <span class="font-medium text-gray-600">Repair Jobs</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Repair Jobs</h1>
        <p class="text-xs text-gray-500 mt-1">Technician work, parts, approvals and promised completion.</p>
      </div>

      <!-- Create Repair Job Button -->
      <button 
        @click="openCreateModal" 
        class="bg-[#165A31] text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
      >
        <Plus class="w-4 h-4" /> <span>Create Repair Job</span>
      </button>
    </div>

    <!-- 4 KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div 
        v-for="kpi in branchKPIs" 
        :key="kpi.label" 
        class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]"
      >
        <div class="text-[11px] font-semibold text-gray-500 mb-2">{{ kpi.label }}</div>
        <div class="text-2xl font-bold text-gray-900">{{ kpi.value }}</div>
        <div :class="['text-[11px] mt-1', kpi.subtextClass]">{{ kpi.subtext }}</div>
      </div>
    </div>

    <!-- Filters Row -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-wrap items-center gap-2">
        <!-- Status Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('status')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': branchStatusFilter !== 'All' }"
          >
            <span>Status: {{ branchStatusFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div 
            v-if="openBranchDropdown === 'status'" 
            class="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <button 
              v-for="st in ['All', 'In Progress', 'Ready', 'Awaiting Parts', 'Approval Needed']" 
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

        <!-- Date Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('date')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': branchDateFilter !== 'Date' }"
          >
            <span>{{ branchDateFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div 
            v-if="openBranchDropdown === 'date'" 
            class="absolute top-full left-0 mt-1 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <button 
              v-for="d in ['Date', 'Today', 'This Week', 'This Month', 'All Time']" 
              :key="d"
              @click="branchDateFilter = d; openBranchDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
              :class="branchDateFilter === d ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ d }}</span>
              <Check v-if="branchDateFilter === d" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <!-- Saved Filters Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('saved')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': branchSavedFilter !== 'Saved filters' }"
          >
            <span>{{ branchSavedFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div 
            v-if="openBranchDropdown === 'saved'" 
            class="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <button 
              v-for="preset in ['Awaiting Parts', 'Approval Needed', 'Ready for Customer']" 
              :key="preset"
              @click="selectBranchSavedFilter(preset)"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
              :class="branchSavedFilter === preset ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ preset }}</span>
              <Check v-if="branchSavedFilter === preset" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <!-- Sub-filter: Technician -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('technician')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': branchTechnicianFilter !== 'All Technicians' }"
          >
            <span>Technician: {{ branchTechnicianFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div 
            v-if="openBranchDropdown === 'technician'" 
            class="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <button 
              v-for="tech in ['All Technicians', 'Technician Ali', 'Hamza Tariq', 'Zain Malik', 'Bilal Khan']" 
              :key="tech"
              @click="branchTechnicianFilter = tech; openBranchDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
              :class="branchTechnicianFilter === tech ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ tech }}</span>
              <Check v-if="branchTechnicianFilter === tech" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <!-- Sub-filter: Unit Model -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('unit')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': branchUnitFilter !== 'All Units' }"
          >
            <span>Unit: {{ branchUnitFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div 
            v-if="openBranchDropdown === 'unit'" 
            class="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <button 
              v-for="u in ['All Units', 'BRG E9 Pro', 'BRG X5', 'BRG DS11', 'BRG EV-5']" 
              :key="u"
              @click="branchUnitFilter = u; openBranchDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
              :class="branchUnitFilter === u ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ u }}</span>
              <Check v-if="branchUnitFilter === u" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <!-- Search Input -->
        <div class="relative w-44 sm:w-56 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            v-model="branchSearchQuery"
            type="text" 
            placeholder="Search repairs..." 
            class="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
          />
        </div>

        <!-- Clear Button -->
        <button 
          v-if="hasActiveBranchFilters"
          @click="clearBranchFilters"
          class="text-xs font-semibold text-gray-400 hover:text-red-600 px-2 py-1 transition-colors cursor-pointer"
        >
          Clear
        </button>
      </div>

      <!-- Right Actions: Columns & Export -->
      <div class="flex items-center gap-2">
        <!-- Columns Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('columns')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            Columns
          </button>
          <div 
            v-if="openBranchDropdown === 'columns'" 
            class="absolute top-full right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <div class="px-3 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 mb-1">
              Toggle Columns
            </div>
            <label 
              v-for="col in branchColumns" 
              :key="col.key" 
              class="flex items-center px-3.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input 
                type="checkbox" 
                v-model="col.visible" 
                class="rounded border-gray-300 text-[#165A31] focus:ring-[#165A31] mr-2.5 h-3.5 w-3.5 accent-[#165A31]"
              />
              <span>{{ col.label }}</span>
            </label>
          </div>
        </div>

        <!-- Export Button -->
        <button 
          @click="exportBranchRepairs"
          class="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
        >
          Export
        </button>
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-bold text-gray-900">Repair Jobs</h3>
        <span class="text-xs text-gray-400 font-medium">{{ filteredBranchRepairs.length }} records</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-100 text-[11px] font-semibold text-gray-400">
              <th v-if="branchColumns.find(c => c.key === 'repairId')?.visible" class="py-3 px-4">Repair</th>
              <th v-if="branchColumns.find(c => c.key === 'caseRef')?.visible" class="py-3 px-4">Case</th>
              <th v-if="branchColumns.find(c => c.key === 'customer')?.visible" class="py-3 px-4">Customer</th>
              <th v-if="branchColumns.find(c => c.key === 'unit')?.visible" class="py-3 px-4">Unit</th>
              <th v-if="branchColumns.find(c => c.key === 'technician')?.visible" class="py-3 px-4">Technician</th>
              <th v-if="branchColumns.find(c => c.key === 'promised')?.visible" class="py-3 px-4">Promised</th>
              <th v-if="branchColumns.find(c => c.key === 'status')?.visible" class="py-3 px-4">Status</th>
              <th class="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="text-xs divide-y divide-gray-50">
            <tr 
              v-for="item in filteredBranchRepairs" 
              :key="item.repairId" 
              class="hover:bg-gray-50/50 transition-colors"
            >
              <td v-if="branchColumns.find(c => c.key === 'repairId')?.visible" class="py-4 px-4 font-semibold text-gray-900">{{ item.repairId }}</td>
              <td v-if="branchColumns.find(c => c.key === 'caseRef')?.visible" class="py-4 px-4 font-medium text-gray-800">{{ item.caseRef || '—' }}</td>
              <td v-if="branchColumns.find(c => c.key === 'customer')?.visible" class="py-4 px-4 font-medium text-gray-800">{{ item.customer }}</td>
              <td v-if="branchColumns.find(c => c.key === 'unit')?.visible" class="py-4 px-4 font-medium text-gray-600">{{ item.unit }}</td>
              <td v-if="branchColumns.find(c => c.key === 'technician')?.visible" class="py-4 px-4 font-medium text-gray-600">{{ item.technician }}</td>
              <td v-if="branchColumns.find(c => c.key === 'promised')?.visible" class="py-4 px-4 font-medium text-gray-600">{{ item.promised || item.readyDate }}</td>
              <td v-if="branchColumns.find(c => c.key === 'status')?.visible" class="py-4 px-4">
                <span :class="['inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-semibold', item.statusClass || getBranchStatusBadgeClass(item.status)]">
                  {{ item.status }}
                </span>
              </td>
              <td class="py-4 px-4 text-right">
                <div class="flex items-center justify-end gap-3 text-gray-400">
                  <button 
                    @click.stop="openEditModal(item)" 
                    title="Edit Repair" 
                    class="hover:text-[#165A31] transition-colors cursor-pointer"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>
                  <button 
                    @click.stop="openRepairDetail(item)" 
                    class="text-gray-500 hover:text-gray-900 text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    Open <span class="text-gray-400">›</span>
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="filteredBranchRepairs.length === 0">
              <td colspan="8" class="text-center py-12 text-gray-500">
                <div class="flex flex-col items-center justify-center">
                  <span class="text-2xl mb-2">🔍</span>
                  <p class="text-sm font-semibold text-gray-700">No repair jobs match the selected filters</p>
                  <p class="text-xs text-gray-400 mt-1">Try adjusting your filters or search query</p>
                  <button @click="clearBranchFilters" class="mt-3 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer">
                    Reset filters
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create / Edit Repair Job Modal Popup -->
    <CreateRepairJobModal 
      v-if="showCreateModal" 
      :is-modal="true"
      :repair="selectedRepairToEdit"
      @close="showCreateModal = false" 
      @created="handleRepairCreated"
      @updated="handleRepairUpdated"
    />
  </div>

  <!-- SUPER ADMIN VIEW -->
  <div v-else class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openDropdown = null">
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
        @click="openCreateModal" 
        class="bg-[#165A31] text-white text-[11px] font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer"
      >
        <Plus class="w-4 h-4" /> <span>Create Repair Job</span>
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

        <div class="flex flex-wrap items-center gap-3">
          <!-- Search Input -->
          <div class="relative w-48 sm:w-64 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
            <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search repair, unit, customer..." 
              class="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
            />
          </div>

          <!-- Branch Dropdown -->
          <div class="relative">
            <button 
              @click.stop="toggleDropdown('branch')"
              class="flex items-center gap-2 text-xs font-medium text-gray-700 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <span>{{ selectedBranch }}</span>
              <ChevronDown class="w-3 h-3 text-gray-400" />
            </button>
            <div v-if="openDropdown === 'branch'" class="absolute left-0 mt-1 w-40 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
              <button 
                v-for="b in branches" 
                :key="b" 
                @click.stop="selectBranch(b)"
                class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700 flex items-center justify-between"
                :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedBranch === b }"
              >
                <span>{{ b }}</span>
                <Check v-if="selectedBranch === b" class="w-3.5 h-3.5 text-[#165A31]" />
              </button>
            </div>
          </div>

          <button 
            v-if="searchQuery || activeFilterTab !== 'All' || selectedBranch !== 'All Branches'" 
            @click="resetFilters" 
            class="text-[11px] font-semibold text-gray-500 hover:text-red-600 px-2 py-1 transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <!-- Table Container -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-[13px] font-bold text-gray-900">Repair Jobs</h3>
          <span class="text-[11px] text-gray-400 font-medium">{{ filteredRepairs.length }} records</span>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th class="px-5 py-3">Repair ID</th>
                <th class="px-5 py-3">Branch</th>
                <th class="px-5 py-3">Customer</th>
                <th class="px-5 py-3">Unit Serial</th>
                <th class="px-5 py-3">Diagnosis</th>
                <th class="px-5 py-3">Status</th>
                <th class="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr 
                v-for="job in filteredRepairs" 
                :key="job.repairId" 
                class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
              >
                <td class="px-5 py-4 font-bold text-gray-900">{{ job.repairId }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ job.branch }}</td>
                <td class="px-5 py-4 text-gray-800 font-semibold">{{ job.customer }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ job.unit }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ job.diagnosis }}</td>
                <td class="px-5 py-4">
                  <span 
                    class="inline-flex items-center px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold" 
                    :class="getStatusBadgeClass(job.status)"
                  >
                    {{ job.status }}
                  </span>
                </td>
                <td class="px-5 py-4 text-right">
                  <div class="flex items-center justify-end gap-3 text-gray-400">
                    <button 
                      @click.stop="openEditModal(job)" 
                      title="Edit Repair" 
                      class="hover:text-[#165A31] transition-colors cursor-pointer"
                    >
                      <Pencil class="w-4 h-4" />
                    </button>
                    <button 
                      @click.stop="openRepairDetail(job)" 
                      title="View Details" 
                      class="hover:text-[#165A31] transition-colors cursor-pointer"
                    >
                      <Eye class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredRepairs.length === 0">
                <td colspan="7" class="text-center py-12 text-gray-500">
                  <p class="text-xs font-semibold text-gray-700">No repair jobs found matching your criteria</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create / Edit Modal Popup -->
    <CreateRepairJobModal 
      v-if="showCreateModal" 
      :is-modal="true"
      :repair="selectedRepairToEdit"
      @close="showCreateModal = false" 
      @created="handleRepairCreated"
      @updated="handleRepairUpdated"
    />
  </div>
</template>
