<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search, ChevronDown, Check, Plus, Pencil, CheckCircle2 } from 'lucide-vue-next'
import { store } from '@/store'
import CreateReturnModal from './CreateReturn.vue'

const router = useRouter()
const showCreateModal = ref(false)
const selectedReturnToEdit = ref(null)
const showToast = ref(false)
const toastMessage = ref('')

const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

// Branch Manager Data
const branchKPIs = computed(() => [
  { label: 'In Inspection', value: '1', change: 'Active claim' },
  { label: 'Pending Approval', value: '1', change: 'Central sign-off' },
  { label: 'Exchanges', value: '1', change: 'Approved replacement' },
  { label: 'Refunds', value: '0', change: 'Zero monetary claims' }
])

const branchReturns = computed(() => {
  const currentBranch = user.value?.branchName || 'Peshawar'
  return store.salesReturns.filter(r => !r.branch || r.branch === currentBranch)
})

const branchStatusFilter = ref('All')
const branchDateFilter = ref('Date')
const branchSavedFilter = ref('Saved Filters')
const branchReasonFilter = ref('All Reasons')
const branchRequestedFilter = ref('All Resolutions')
const branchSearchQuery = ref('')
const openBranchDropdown = ref(null)

const toggleBranchDropdown = (name) => {
  openBranchDropdown.value = openBranchDropdown.value === name ? null : name
}

const selectBranchSavedFilter = (filterName) => {
  branchSavedFilter.value = filterName
  if (filterName === 'All Returns' || filterName === 'Saved Filters') {
    branchStatusFilter.value = 'All'
    branchReasonFilter.value = 'All Reasons'
    branchRequestedFilter.value = 'All Resolutions'
  } else if (filterName === 'In Inspection') {
    branchStatusFilter.value = 'Inspection'
  } else if (filterName === 'Pending Approval') {
    branchStatusFilter.value = 'Approval'
  } else if (filterName === 'Approved Exchanges') {
    branchRequestedFilter.value = 'Exchange'
  } else if (filterName === 'Refund Claims') {
    branchRequestedFilter.value = 'Refund'
  }
  openBranchDropdown.value = null
}

const hasActiveBranchFilters = computed(() => {
  return branchStatusFilter.value !== 'All' ||
         branchDateFilter.value !== 'Date' ||
         branchSavedFilter.value !== 'Saved Filters' ||
         branchReasonFilter.value !== 'All Reasons' ||
         branchRequestedFilter.value !== 'All Resolutions' ||
         branchSearchQuery.value.trim() !== ''
})

const clearBranchFilters = () => {
  branchStatusFilter.value = 'All'
  branchDateFilter.value = 'Date'
  branchSavedFilter.value = 'Saved Filters'
  branchReasonFilter.value = 'All Reasons'
  branchRequestedFilter.value = 'All Resolutions'
  branchSearchQuery.value = ''
  openBranchDropdown.value = null
}

const branchVisibleColumns = ref({
  returnNo: true,
  order: true,
  customer: true,
  unit: true,
  reason: true,
  requested: true,
  status: true,
  actions: true
})

const toggleBranchColumn = (col) => {
  branchVisibleColumns.value[col] = !branchVisibleColumns.value[col]
}

const exportBranchReturns = () => {
  openBranchDropdown.value = null
  const rows = filteredBranchReturns.value
  if (!rows.length) {
    toastMessage.value = 'No returns match the filter to export'
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 3000)
    return
  }
  const headers = ['Return #', 'Order', 'Customer', 'Unit', 'Reason', 'Resolution Requested', 'Status']
  const csvContent = 'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map(r => [
      `"${(r.returnNo || '').replace(/"/g, '""')}"`,
      `"${(r.order || '').replace(/"/g, '""')}"`,
      `"${(r.customer || '').replace(/"/g, '""')}"`,
      `"${(r.unit || '').replace(/"/g, '""')}"`,
      `"${(r.reason || '').replace(/"/g, '""')}"`,
      `"${(r.requested || '').replace(/"/g, '""')}"`,
      `"${(r.status || '').replace(/"/g, '""')}"`
    ].join(','))].join('\n')
  
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `branch_returns_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  toastMessage.value = `Exported ${rows.length} return records to CSV`
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 4000)
}

const filteredBranchReturns = computed(() => {
  return branchReturns.value.filter(item => {
    if (branchStatusFilter.value !== 'All' && item.status.toLowerCase() !== branchStatusFilter.value.toLowerCase()) {
      return false
    }
    if (branchReasonFilter.value !== 'All Reasons' && item.reason !== branchReasonFilter.value) {
      return false
    }
    if (branchRequestedFilter.value !== 'All Resolutions' && item.requested !== branchRequestedFilter.value) {
      return false
    }
    if (branchSearchQuery.value.trim()) {
      const q = branchSearchQuery.value.toLowerCase()
      const match = (item.returnNo && item.returnNo.toLowerCase().includes(q)) ||
                    (item.order && item.order.toLowerCase().includes(q)) ||
                    (item.customer && item.customer.toLowerCase().includes(q)) ||
                    (item.unit && item.unit.toLowerCase().includes(q)) ||
                    (item.reason && item.reason.toLowerCase().includes(q)) ||
                    (item.requested && item.requested.toLowerCase().includes(q))
      if (!match) return false
    }
    return true
  })
})

const openCreateModal = () => {
  selectedReturnToEdit.value = null
  store.originalEditReturn = null
  showCreateModal.value = true
}

const openEditModal = (item) => {
  selectedReturnToEdit.value = item
  store.originalEditReturn = item
  showCreateModal.value = true
}

const handleReturnCreated = (newRecord) => {
  const record = store.addSalesReturn(newRecord)
  toastMessage.value = `Return ${record.returnNo || record.id} created successfully!`
  showToast.value = true
  showCreateModal.value = false
  setTimeout(() => { showToast.value = false }, 4000)
}

const handleReturnUpdated = (updatedRecord) => {
  const record = store.updateSalesReturn(updatedRecord.returnNo || updatedRecord.id, updatedRecord)
  toastMessage.value = `Return ${updatedRecord.returnNo || updatedRecord.id} updated successfully!`
  showToast.value = true
  showCreateModal.value = false
  setTimeout(() => { showToast.value = false }, 4000)
}

const openBranchReturn = (item) => {
  router.push({
    path: '/sales/returns/detail',
    query: { id: item.returnNo || item.id }
  })
}

// Super Admin Data
const searchQuery = ref('')
const selectedStatus = ref('All Statuses')
const selectedBranch = ref('All Branches')
const openDropdown = ref(null)

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const returnsList = computed(() => store.salesReturns)

const filteredReturns = computed(() => {
  return returnsList.value.filter(item => {
    if (selectedStatus.value !== 'All Statuses' && item.status.toLowerCase() !== selectedStatus.value.toLowerCase()) {
      return false
    }
    if (selectedBranch.value !== 'All Branches' && item.branch !== selectedBranch.value) {
      return false
    }
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = 
        item.returnNo.toLowerCase().includes(q) ||
        item.order.toLowerCase().includes(q) ||
        item.customer.toLowerCase().includes(q) ||
        item.unit.toLowerCase().includes(q) ||
        item.branch.toLowerCase().includes(q) ||
        item.reason.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })
})

const resetFilters = () => {
  selectedStatus.value = 'All Statuses'
  selectedBranch.value = 'All Branches'
  searchQuery.value = ''
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
          Branch Manager / Returns / <span class="font-medium text-gray-600">Returns</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Returns</h1>
        <p class="text-xs text-gray-500 mt-1">{{ user?.branchName || 'Peshawar' }} Branch records only.</p>
      </div>
      <button 
        @click="openCreateModal"
        class="bg-[#165A31] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#124a28] transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
      >
        <Plus class="w-4 h-4" />
        <span>Create Return</span>
      </button>
    </div>

    <!-- 4 KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div 
        v-for="(kpi, idx) in branchKPIs" 
        :key="idx" 
        class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between"
      >
        <div class="text-xs font-semibold text-gray-400 mb-3">{{ kpi.label }}</div>
        <div>
          <div class="text-[26px] font-bold text-gray-900 leading-tight">{{ kpi.value }}</div>
          <div class="text-[11px] font-semibold text-[#165A31] mt-1">{{ kpi.change }}</div>
        </div>
      </div>
    </div>

    <!-- Filters & Actions Bar -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex flex-wrap items-center gap-2">
        <!-- Status Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('status')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <span>Status: {{ branchStatusFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openBranchDropdown === 'status'" class="absolute top-full left-0 mt-1 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button 
              v-for="st in ['All', 'Inspection', 'Approval', 'Refund Approved', 'Completed']"
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
          >
            <span>{{ branchDateFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openBranchDropdown === 'date'" class="absolute top-full left-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button 
              v-for="d in ['Date', 'Today', 'Yesterday', 'This Week', 'This Month', 'All Time']" 
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
          >
            <span>{{ branchSavedFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openBranchDropdown === 'saved'" class="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button 
              v-for="f in ['All Returns', 'In Inspection', 'Pending Approval', 'Approved Exchanges', 'Refund Claims']" 
              :key="f"
              @click="selectBranchSavedFilter(f)"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
              :class="branchSavedFilter === f ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ f }}</span>
              <Check v-if="branchSavedFilter === f" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <!-- Sub-filter: Reason Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('reason')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <span>Reason: {{ branchReasonFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openBranchDropdown === 'reason'" class="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button 
              v-for="r in ['All Reasons', 'Battery Issue', 'Performance Issue', 'Wrong Specification', 'Exchange']" 
              :key="r"
              @click="branchReasonFilter = r; openBranchDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
              :class="branchReasonFilter === r ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ r }}</span>
              <Check v-if="branchReasonFilter === r" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <!-- Sub-filter: Resolution Requested Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('requested')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <span>Resolution: {{ branchRequestedFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openBranchDropdown === 'requested'" class="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button 
              v-for="res in ['All Resolutions', 'Exchange', 'Refund', 'Inspection']" 
              :key="res"
              @click="branchRequestedFilter = res; openBranchDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
              :class="branchRequestedFilter === res ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ res }}</span>
              <Check v-if="branchRequestedFilter === res" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <!-- Search Input -->
        <div class="relative w-44 sm:w-56 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            v-model="branchSearchQuery"
            type="text" 
            placeholder="Search return, order, unit..." 
            class="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
          />
        </div>

        <button 
          v-if="hasActiveBranchFilters"
          @click="clearBranchFilters"
          class="text-xs font-semibold text-gray-400 hover:text-red-600 px-2 py-1 transition-colors cursor-pointer"
        >
          Clear
        </button>
      </div>

      <!-- Right Side: Columns & Export -->
      <div class="flex items-center gap-2">
        <!-- Columns Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('columns')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center gap-1.5"
          >
            <span>Columns</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div 
            v-if="openBranchDropdown === 'columns'" 
            class="absolute top-full right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <div class="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 mb-1">
              Toggle Columns
            </div>
            <label 
              v-for="(val, key) in branchVisibleColumns" 
              :key="key"
              @click.stop="toggleBranchColumn(key)"
              class="flex items-center justify-between px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer select-none capitalize"
            >
              <span>{{ key === 'returnNo' ? 'Return #' : (key === 'requested' ? 'Resolution' : key) }}</span>
              <input 
                type="checkbox" 
                :checked="val" 
                class="accent-[#165A31] rounded cursor-pointer" 
              />
            </label>
          </div>
        </div>

        <!-- Export Button -->
        <button 
          @click="exportBranchReturns"
          class="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center gap-1.5"
        >
          <span>Export</span>
        </button>
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm font-bold text-gray-900">Branch Returns</h2>
          <span class="text-xs text-gray-400 font-medium">Showing {{ filteredBranchReturns.length }} returns</span>
        </div>

        <div class="border border-gray-100 rounded-xl overflow-hidden">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-[#fbfcfc] border-b border-gray-100 text-[11px] font-semibold text-gray-400">
                <th v-if="branchVisibleColumns.returnNo" class="px-5 py-3">Return</th>
                <th v-if="branchVisibleColumns.order" class="px-5 py-3">Order</th>
                <th v-if="branchVisibleColumns.customer" class="px-5 py-3">Customer</th>
                <th v-if="branchVisibleColumns.unit" class="px-5 py-3">Unit</th>
                <th v-if="branchVisibleColumns.reason" class="px-5 py-3">Reason</th>
                <th v-if="branchVisibleColumns.requested" class="px-5 py-3">Requested</th>
                <th v-if="branchVisibleColumns.status" class="px-5 py-3">Status</th>
                <th v-if="branchVisibleColumns.actions" class="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="text-xs">
              <tr 
                v-for="item in filteredBranchReturns" 
                :key="item.returnNo"
                class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
              >
                <td v-if="branchVisibleColumns.returnNo" class="px-5 py-4 font-bold text-gray-900">{{ item.returnNo }}</td>
                <td v-if="branchVisibleColumns.order" class="px-5 py-4 font-medium text-gray-700">{{ item.order }}</td>
                <td v-if="branchVisibleColumns.customer" class="px-5 py-4 font-bold text-gray-900">{{ item.customer }}</td>
                <td v-if="branchVisibleColumns.unit" class="px-5 py-4 font-medium text-gray-700">{{ item.unit }}</td>
                <td v-if="branchVisibleColumns.reason" class="px-5 py-4 text-gray-600">{{ item.reason }}</td>
                <td v-if="branchVisibleColumns.requested" class="px-5 py-4 text-gray-600">{{ item.requested }}</td>
                <td v-if="branchVisibleColumns.status" class="px-5 py-4">
                  <span :class="['inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-medium', item.statusClass]">
                    {{ item.status }}
                  </span>
                </td>
                <td v-if="branchVisibleColumns.actions" class="px-5 py-4 text-right">
                  <div class="flex items-center justify-end gap-3 text-gray-400">
                    <button 
                      @click.stop="openEditModal(item)" 
                      title="Edit Return" 
                      class="hover:text-[#165A31] transition-colors cursor-pointer"
                    >
                      <Pencil class="w-4 h-4" />
                    </button>
                    <button 
                      @click.stop="openBranchReturn(item)"
                      class="text-xs text-gray-400 font-medium hover:text-gray-700 transition-colors"
                    >
                      Open ›
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-if="filteredBranchReturns.length === 0">
                <td colspan="8" class="text-center py-12 text-gray-500">
                  <p class="text-xs font-semibold text-gray-700">No returns found matching the filter</p>
                  <button 
                    @click="clearBranchFilters"
                    class="mt-3 px-3 py-1.5 text-xs font-semibold text-[#165A31] bg-[#eefcf2] hover:bg-[#e2f9ea] rounded-lg transition-colors cursor-pointer"
                  >
                    Clear all filters
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create / Edit Return Modal -->
    <CreateReturnModal 
      v-if="showCreateModal" 
      :is-modal="true"
      :return-item="selectedReturnToEdit"
      @close="showCreateModal = false" 
      @created="handleReturnCreated"
      @updated="handleReturnUpdated"
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
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Sales & CRM / <span class="font-bold text-gray-800">Returns & Refunds</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Returns & Refunds</h1>
        <p class="text-sm text-gray-500 mt-1">Inspect returned sold units and control refund, exchange or stock disposition.</p>
      </div>
      <button 
        @click="openCreateModal" 
        class="bg-[#165A31] text-white text-[11px] font-bold px-4 py-2.5 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
      >
        <Plus class="w-4 h-4" /> <span>Create Return</span>
      </button>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <!-- Filter Bar -->
      <div class="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-3 flex-1">
          <!-- Status Dropdown -->
          <div class="relative" @click.stop>
            <button 
              @click="toggleDropdown('status')"
              class="px-3 py-1.5 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <span>{{ selectedStatus }}</span>
              <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
            </button>
            <div v-if="openDropdown === 'status'" class="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <button 
                v-for="status in ['All Statuses', 'Inspection', 'Refund Approved', 'Completed']"
                :key="status"
                @click="selectedStatus = status; openDropdown = null"
                class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
                :class="selectedStatus === status ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
              >
                <span>{{ status }}</span>
                <Check v-if="selectedStatus === status" class="w-3.5 h-3.5 text-[#165A31]" />
              </button>
            </div>
          </div>

          <!-- Branch Dropdown -->
          <div class="relative" @click.stop>
            <button 
              @click="toggleDropdown('branch')"
              class="px-3 py-1.5 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <span>{{ selectedBranch }}</span>
              <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
            </button>
            <div v-if="openDropdown === 'branch'" class="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <button 
                v-for="branch in ['All Branches', 'Peshawar', 'Islamabad', 'Lahore']"
                :key="branch"
                @click="selectedBranch = branch; openDropdown = null"
                class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
                :class="selectedBranch === branch ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
              >
                <span>{{ branch }}</span>
                <Check v-if="selectedBranch === branch" class="w-3.5 h-3.5 text-[#165A31]" />
              </button>
            </div>
          </div>

          <!-- Search Input -->
          <div class="relative flex-1 max-w-[300px]">
            <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search return #, order #, unit..." 
              class="w-full pl-9 pr-4 py-1.5 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)]" 
            />
          </div>
        </div>

        <button 
          v-if="selectedStatus !== 'All Statuses' || selectedBranch !== 'All Branches' || searchQuery"
          @click="resetFilters" 
          class="text-[11px] text-[#165A31] font-semibold hover:underline cursor-pointer"
        >
          Reset Filters
        </button>
      </div>

      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-[14px] font-bold text-gray-900">Returns ({{ filteredReturns.length }})</h2>
        </div>
        
        <div class="border border-gray-100 rounded-xl overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th class="px-5 py-3">Return</th>
                <th class="px-5 py-3">Order</th>
                <th class="px-5 py-3">Customer</th>
                <th class="px-5 py-3">Unit</th>
                <th class="px-5 py-3">Branch</th>
                <th class="px-5 py-3">Reason</th>
                <th class="px-5 py-3">Requested</th>
                <th class="px-5 py-3">Status</th>
                <th class="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr 
                v-for="item in filteredReturns" 
                :key="item.returnNo" 
                class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
              >
                <td class="px-5 py-4 text-gray-900 font-bold">{{ item.returnNo }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.order }}</td>
                <td class="px-5 py-4 text-gray-800 font-semibold">{{ item.customer }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.unit }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.branch }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.reason }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.requested }}</td>
                <td class="px-5 py-4">
                  <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold', item.statusColor]">
                    {{ item.status }}
                  </span>
                </td>
                <td class="px-5 py-4 text-right">
                  <div class="flex items-center justify-end gap-3 text-gray-400">
                    <button 
                      @click.stop="openEditModal(item)" 
                      title="Edit Return" 
                      class="hover:text-[#165A31] transition-colors cursor-pointer"
                    >
                      <Pencil class="w-4 h-4" />
                    </button>
                    <button 
                      @click.stop="router.push({ path: '/sales/returns/detail', query: { id: item.returnNo || item.id } })" 
                      class="text-[#165A31] hover:underline font-semibold flex items-center justify-end gap-1 cursor-pointer"
                    >
                      Open &rarr;
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-if="filteredReturns.length === 0">
                <td colspan="9" class="text-center py-12 text-gray-500">
                  <div class="space-y-2">
                    <p class="text-xs font-semibold text-gray-700">No returns found matching the selected filters</p>
                    <button @click="resetFilters" class="text-xs text-[#165A31] font-bold underline cursor-pointer">
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
    
    <!-- Create / Edit Return Modal -->
    <CreateReturnModal 
      v-if="showCreateModal" 
      :is-modal="true"
      :return-item="selectedReturnToEdit"
      @close="showCreateModal = false" 
      @created="handleReturnCreated"
      @updated="handleReturnUpdated"
    />
  </div>
</template>
