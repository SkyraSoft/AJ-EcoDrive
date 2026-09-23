<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search, ChevronDown, Check, Plus, CheckCircle2, Pencil, Eye } from 'lucide-vue-next'
import { store } from '@/store'
import CreateCaseModal from './CreateCase.vue'

const router = useRouter()
const showCreateModal = ref(false)
const selectedCaseToEdit = ref(null)
const showToast = ref(false)
const toastMessage = ref('')
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

// Branch Manager KPI Cards
const branchKpis = computed(() => {
  const branchList = store.cases.filter(item => !item.branch || store.isBranchAllowed(item.branch))
  const openCount = branchList.filter(c => c.status !== 'Resolved' && c.status !== 'Ready').length
  const warrantyCount = branchList.filter(c => c.warranty === 'Active').length
  const outOfWarrantyCount = branchList.filter(c => c.warranty !== 'Active').length
  return [
    { label: 'Open', value: String(openCount || 14), sub: '4 high priority', isGreen: true },
    { label: 'Warranty', value: String(warrantyCount || 8), sub: 'Covered', isGreen: true },
    { label: 'Out of Warranty', value: String(outOfWarrantyCount || 6), sub: 'Customer approval', isGreen: true },
    { label: 'Overdue', value: '3', sub: 'Escalate', isGreen: true }
  ]
})

const branchStatusFilter = ref('All')
const branchDateFilter = ref('All')
const branchSearchQuery = ref('')
const openBranchDropdown = ref(null)

const toggleBranchDropdown = (name) => {
  openBranchDropdown.value = openBranchDropdown.value === name ? null : name
}

const filteredBranchCases = computed(() => {
  return store.cases.filter(item => {
    if (item.branch && !store.isBranchAllowed(item.branch)) {
      return false
    }
    if (branchStatusFilter.value !== 'All' && item.status.toLowerCase() !== branchStatusFilter.value.toLowerCase()) {
      return false
    }
    if (branchSearchQuery.value.trim()) {
      const q = branchSearchQuery.value.toLowerCase()
      const match = item.caseId.toLowerCase().includes(q) ||
                    item.customer.toLowerCase().includes(q) ||
                    (item.unit && item.unit.toLowerCase().includes(q)) ||
                    (item.unitSerial && item.unitSerial.toLowerCase().includes(q)) ||
                    (item.issue && item.issue.toLowerCase().includes(q))
      if (!match) return false
    }
    return true
  })
})

const openCaseDetail = (caseItem) => {
  store.selectCase(caseItem)
  router.push({
    path: '/after-sales/warranty/detail',
    query: { id: caseItem.caseId }
  })
}

const openCreateModal = () => {
  selectedCaseToEdit.value = null
  store.originalEditCase = null
  showCreateModal.value = true
}

const openEditModal = (caseItem) => {
  selectedCaseToEdit.value = caseItem
  store.originalEditCase = caseItem
  showCreateModal.value = true
}

// Super Admin Data
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
    if (activeFilterTab.value === 'Warranty' && item.type !== 'Warranty') return false
    if (activeFilterTab.value === 'Service' && item.type !== 'Service') return false
    if (activeFilterTab.value === 'Diagnosis' && item.status !== 'Diagnosis') return false
    if (activeFilterTab.value === 'In Progress' && item.status !== 'In Progress') return false
    if (activeFilterTab.value === 'Ready' && item.status !== 'Ready') return false
    if (selectedBranch.value !== 'All' && item.branch !== selectedBranch.value) return false

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

const handleCaseCreated = (newCase) => {
  toastMessage.value = `Case ${newCase.caseId} created successfully!`
  showToast.value = true
  showCreateModal.value = false
  setTimeout(() => {
    showToast.value = false
  }, 4000)
}

const handleCaseUpdated = (updatedCase) => {
  toastMessage.value = `Case ${updatedCase.caseId} updated successfully!`
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
          Branch Manager / Warranty & Service / <span class="font-medium text-gray-600">Warranty & Service Cases</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Warranty & Service Cases</h1>
        <p class="text-xs text-gray-500 mt-1">Branch service cases, warranty status, priority and assignee.</p>
      </div>
      <button 
        @click="openCreateModal" 
        class="bg-[#165A31] text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
      >
        <Plus class="w-4 h-4" /> <span>Create Case</span>
      </button>
    </div>

    <!-- 4 KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div 
        v-for="kpi in branchKpis" 
        :key="kpi.label" 
        class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]"
      >
        <div class="text-[11px] font-semibold text-gray-500 mb-2">{{ kpi.label }}</div>
        <div class="text-2xl font-bold text-gray-900">{{ kpi.value }}</div>
        <div class="text-[11px] font-medium text-[#165A31] mt-1">{{ kpi.sub }}</div>
      </div>
    </div>

    <!-- Filters Row -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="flex flex-wrap items-center gap-2">
        <!-- Search Input -->
        <div class="relative w-48 sm:w-60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            v-model="branchSearchQuery"
            type="text" 
            placeholder="Search cases..." 
            class="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
          />
        </div>

        <!-- Status Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('status')"
            class="px-3 py-1.5 text-[11px] font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <span>Status: {{ branchStatusFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openBranchDropdown === 'status'" class="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button 
              v-for="st in ['All', 'Diagnosis', 'In Progress', 'Parts Waiting', 'Ready']"
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
            class="px-3 py-1.5 text-[11px] font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <span>Date</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openBranchDropdown === 'date'" class="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button 
              v-for="d in ['All Dates', 'Last 7 days', 'Last 30 days', 'This Month']"
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

        <button 
          v-if="branchSearchQuery || branchStatusFilter !== 'All' || branchDateFilter !== 'All'"
          @click="branchSearchQuery = ''; branchStatusFilter = 'All'; branchDateFilter = 'All'"
          class="text-xs font-semibold text-gray-400 hover:text-red-600 px-2 py-1 transition-colors cursor-pointer"
        >
          Clear
        </button>
      </div>

      <!-- Right Buttons -->
      <div class="flex items-center gap-2">
        <button class="px-3 py-1.5 text-[11px] font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm">
          <span>Columns</span>
        </button>
        <button class="px-3 py-1.5 text-[11px] font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm">
          <span>Export</span>
        </button>
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
      <h3 class="text-sm font-bold text-gray-900">Service Cases</h3>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-100 text-[11px] font-semibold text-gray-400">
              <th class="py-3 px-4">Case</th>
              <th class="py-3 px-4">Customer</th>
              <th class="py-3 px-4">Unit</th>
              <th class="py-3 px-4">Issue</th>
              <th class="py-3 px-4">Priority</th>
              <th class="py-3 px-4">Status</th>
              <th class="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="text-xs divide-y divide-gray-50">
            <tr 
              v-for="item in filteredBranchCases" 
              :key="item.caseId" 
              class="hover:bg-gray-50/50 transition-colors"
            >
              <td class="py-4 px-4 font-semibold text-gray-900">{{ item.caseId }}</td>
              <td class="py-4 px-4 font-medium text-gray-800">{{ item.customer }}</td>
              <td class="py-4 px-4 font-medium text-gray-600">{{ item.unit || item.unitSerial }}</td>
              <td class="py-4 px-4 font-medium text-gray-600">{{ item.issue }}</td>
              <td class="py-4 px-4">
                <span :class="['inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-semibold', item.priorityClass || (item.priority === 'High' ? 'bg-[#fee2e2] text-[#b91c1c]' : 'bg-[#fef3c7] text-[#b45309]')]">
                  {{ item.priority }}
                </span>
              </td>
              <td class="py-4 px-4">
                <span :class="['inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-semibold', item.statusClass || getStatusBadgeClass(item.status)]">
                  {{ item.status }}
                </span>
              </td>
              <td class="py-4 px-4 text-right">
                <div class="flex items-center justify-end gap-3 text-gray-400">
                  <button 
                    @click.stop="openEditModal(item)" 
                    title="Edit Case" 
                    class="hover:text-[#165A31] transition-colors cursor-pointer"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>
                  <button 
                    @click.stop="openCaseDetail(item)" 
                    class="text-gray-500 hover:text-gray-900 text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    Open <span class="text-gray-400">›</span>
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="filteredBranchCases.length === 0">
              <td colspan="7" class="text-center py-12 text-gray-500">
                <p class="text-xs font-semibold text-gray-700">No service cases found matching the filter</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create / Edit Case Modal Popup -->
    <CreateCaseModal 
      v-if="showCreateModal" 
      :is-modal="true"
      :case-item="selectedCaseToEdit"
      @close="showCreateModal = false" 
      @created="handleCaseCreated" 
      @updated="handleCaseUpdated"
    />
  </div>

  <!-- SUPER ADMIN VIEW -->
  <div v-else class="max-w-[1400px] mx-auto space-y-6 pb-12">
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
        @click="openCreateModal" 
        class="bg-[#165A31] text-white text-[11px] font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer"
      >
        <Plus class="w-4 h-4" /> <span>Create Case</span>
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
                <th class="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr 
                v-for="item in filteredCases" 
                :key="item.caseId" 
                class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
              >
                <td class="px-5 py-4 font-semibold text-gray-900">
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
                  <div class="flex items-center justify-end gap-3 text-gray-400">
                    <button 
                      @click.stop="openEditModal(item)" 
                      title="Edit Case" 
                      class="hover:text-[#165A31] transition-colors cursor-pointer"
                    >
                      <Pencil class="w-4 h-4" />
                    </button>
                    <button 
                      @click.stop="openCaseDetail(item)" 
                      title="View Details" 
                      class="hover:text-[#165A31] transition-colors cursor-pointer"
                    >
                      <Eye class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredCases.length === 0">
                <td colspan="9" class="px-5 py-10 text-center text-gray-400 text-xs">
                  <div class="flex flex-col items-center justify-center">
                    <span class="text-2xl mb-2">🔍</span>
                    <p class="text-sm font-semibold text-gray-700">No cases found matching your criteria</p>
                    <p class="text-xs text-gray-400 mt-1">Try adjusting your filters or search query</p>
                    <button @click="resetFilters" class="mt-3 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer">
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

    <!-- Create / Edit Case Popup Modal -->
    <CreateCaseModal 
      v-if="showCreateModal" 
      :is-modal="true"
      :case-item="selectedCaseToEdit"
      @close="showCreateModal = false" 
      @created="handleCaseCreated" 
      @updated="handleCaseUpdated"
    />
  </div>
</template>
