<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDown, Search, Check, Plus, Pencil } from 'lucide-vue-next'
import { store } from '../../store.js'
import CreateAdjustmentRequestModal from './CreateAdjustmentRequest.vue'

const router = useRouter()
const showCreateModal = ref(false)
const selectedAdjustmentToEdit = ref(null)

const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

// Branch Manager Data
const branchAdjustments = computed(() => {
  const branchName = user.value?.branchName || 'Peshawar'
  return store.stockAdjustments
    .filter(item => !item.branch || item.branch === branchName || branchName === 'All Branches')
    .map(item => ({
      ...item,
      adjustment: item.id || item.adjNo,
      productUnit: item.productUnit || item.unitProduct || item.product || item.unit,
      before: item.existingState || item.before || '0',
      after: item.correctedState || item.after || '0',
      statusClass: item.status === 'Approved' ? 'bg-[#dcfce7] text-[#165A31]' : (item.status === 'Pending' ? 'bg-[#fef3c7] text-[#b45309]' : 'bg-red-50 text-red-700')
    }))
})

const branchKpis = computed(() => {
  const items = branchAdjustments.value
  const pending = items.filter(a => a.status === 'Pending').length
  const approved = items.filter(a => a.status === 'Approved').length
  const posted = items.filter(a => a.status === 'Approved' || a.status === 'Posted').length
  const rejected = items.filter(a => a.status === 'Rejected' || a.status === 'Recount Required').length
  return [
    { label: 'Pending', value: String(pending) },
    { label: 'Approved', value: String(approved), sub: 'This month' },
    { label: 'Posted', value: String(posted) },
    { label: 'Rejected', value: String(rejected) }
  ]
})

const branchStatusFilter = ref('All')
const openBranchDropdown = ref(null)
const branchSearchQuery = ref('')

const toggleBranchDropdown = (name) => {
  openBranchDropdown.value = openBranchDropdown.value === name ? null : name
}

const filteredBranchAdjustments = computed(() => {
  return branchAdjustments.value.filter(item => {
    if (branchStatusFilter.value !== 'All' && item.status.toLowerCase() !== branchStatusFilter.value.toLowerCase()) {
      return false
    }
    if (branchSearchQuery.value.trim()) {
      const q = branchSearchQuery.value.toLowerCase()
      const match = (item.adjustment && item.adjustment.toLowerCase().includes(q)) ||
                    (item.productUnit && item.productUnit.toLowerCase().includes(q)) ||
                    (item.reason && item.reason.toLowerCase().includes(q)) ||
                    (item.status && item.status.toLowerCase().includes(q))
      if (!match) return false
    }
    return true
  })
})

const openCreateModal = () => {
  selectedAdjustmentToEdit.value = null
  showCreateModal.value = true
}

const openEditModal = (item) => {
  selectedAdjustmentToEdit.value = { ...item }
  showCreateModal.value = true
}

const handleCreated = (item) => {
  // Store handles insertion
}

const handleUpdated = (item) => {
  // Store handles update
}

// Super Admin Data
const searchQuery = ref('')
const selectedBranch = ref('All Branches')
const selectedStatus = ref('All')
const openDropdown = ref(null)

const branches = ['All Branches', 'Peshawar', 'Islamabad', 'Lahore']

const adjustments = computed(() => {
  return store.stockAdjustments.map(a => ({
    id: a.id,
    branch: a.branch || 'Peshawar',
    unitProduct: a.unitProduct || a.productUnit || a.product || a.unit,
    productUnit: a.productUnit || a.unitProduct || a.product || a.unit,
    type: a.type || 'Status',
    qtyEffect: a.qtyEffect || (a.difference ? String(a.difference) : '0'),
    existingState: a.existingState,
    correctedState: a.correctedState,
    reason: a.reason,
    status: a.status,
    requestedBy: a.requestedBy || 'Store Lead',
    actionText: a.status === 'Pending' ? 'Review' : 'Open'
  }))
})

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

const filteredAdjustments = computed(() => {
  return adjustments.value.filter(item => {
    if (selectedStatus.value !== 'All' && item.status.toLowerCase() !== selectedStatus.value.toLowerCase()) return false
    if (selectedBranch.value !== 'All Branches' && item.branch !== selectedBranch.value) return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = item.id.toLowerCase().includes(q) ||
                    item.branch.toLowerCase().includes(q) ||
                    item.unitProduct.toLowerCase().includes(q) ||
                    item.reason.toLowerCase().includes(q) ||
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
          Branch Manager / Adjustments / <span class="font-medium text-gray-600">Stock Adjustments</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Stock Adjustments</h1>
        <p class="text-xs text-gray-500 mt-1">Branch inventory corrections with approval and posting status.</p>
      </div>
      <button 
        @click="openCreateModal" 
        class="bg-[#165A31] text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer"
      >
        <Plus class="w-4 h-4" />
        <span>Adjustment Request</span>
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
              v-for="st in ['All', 'Pending', 'Approved', 'Posted', 'Rejected']"
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
            placeholder="Search adjustment..." 
            class="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
          />
        </div>
      </div>
    </div>

    <!-- Adjustments Table Card -->
    <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-bold text-gray-900">Adjustments</h3>
        <span class="text-xs text-gray-400 font-medium">Showing {{ filteredBranchAdjustments.length }} adjustments</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="text-[10px] font-bold text-gray-400 border-b border-gray-100 pb-3 uppercase tracking-wider">
              <th class="pb-3 font-semibold w-36">Adjustment</th>
              <th class="pb-3 font-semibold w-48">Product / Unit</th>
              <th class="pb-3 font-semibold w-32">Before</th>
              <th class="pb-3 font-semibold w-32">After</th>
              <th class="pb-3 font-semibold w-48">Reason</th>
              <th class="pb-3 font-semibold w-32">Status</th>
              <th class="pb-3 font-semibold w-24 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="text-xs divide-y divide-gray-50">
            <tr 
              v-for="(item, index) in filteredBranchAdjustments" 
              :key="item.id || index" 
              @click="router.push(`/inventory/adjustments/${item.id || item.adjustment}`)"
              class="hover:bg-gray-50/50 transition-colors cursor-pointer"
            >
              <td class="py-4 align-middle font-bold text-gray-900">
                {{ item.adjustment }}
              </td>
              <td class="py-4 align-middle text-gray-800 font-semibold">
                {{ item.productUnit }}
              </td>
              <td class="py-4 align-middle text-gray-700 font-medium">
                {{ item.before }}
              </td>
              <td class="py-4 align-middle text-gray-700 font-medium">
                {{ item.after }}
              </td>
              <td class="py-4 align-middle text-gray-700 font-medium">
                {{ item.reason }}
              </td>
              <td class="py-4 align-middle">
                <span class="px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap" :class="item.statusClass">
                  {{ item.status }}
                </span>
              </td>
              <td class="py-4 align-middle text-right whitespace-nowrap">
                <button 
                  @click.stop="openEditModal(item)" 
                  class="p-1.5 text-gray-400 hover:text-[#165A31] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center"
                  title="Edit Adjustment"
                >
                  <Pencil class="w-4 h-4 text-[#165A31]" />
                </button>
              </td>
            </tr>
            <tr v-if="filteredBranchAdjustments.length === 0">
              <td colspan="7" class="text-center py-8 text-xs text-gray-400">
                No adjustments found matching filters.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Popup -->
    <CreateAdjustmentRequestModal 
      v-if="showCreateModal" 
      :adjustment-item="selectedAdjustmentToEdit"
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
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Inventory / <span class="font-bold text-gray-800">Stock Adjustments</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Stock Adjustments</h1>
        <p class="text-sm text-gray-500 mt-1">Control non-routine inventory corrections through approval.</p>
      </div>
      <button 
        @click="openCreateModal" 
        class="px-4 py-2 bg-[#165A31] text-white text-[11px] font-bold rounded-lg hover:bg-[#114a28] transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
      >
        <Plus class="w-4 h-4" />
        <span>New Adjustment</span>
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
            placeholder="Search adjustments..." 
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
      <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-[14px] font-bold text-gray-900">Adjustments</h3>
        <span class="text-xs text-gray-400 font-medium">Showing {{ filteredAdjustments.length }} records</span>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
              <th class="px-5 py-3">Adjustment</th>
              <th class="px-5 py-3">Branch</th>
              <th class="px-5 py-3">Unit/Product</th>
              <th class="px-5 py-3">Type</th>
              <th class="px-5 py-3">Qty Effect</th>
              <th class="px-5 py-3">Reason</th>
              <th class="px-5 py-3">Status</th>
              <th class="px-5 py-3">Requested By</th>
              <th class="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr v-for="item in filteredAdjustments" :key="item.id" @click="router.push(`/inventory/adjustments/${item.id}`)" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer">
              <td class="px-5 py-4 font-semibold text-gray-900">{{ item.id }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.branch }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.unitProduct }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.type }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.qtyEffect }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.reason }}</td>
              <td class="px-5 py-4">
                <span v-if="item.status === 'Pending'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-amber-50 text-amber-600">{{ item.status }}</span>
                <span v-else-if="item.status === 'Approved'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">{{ item.status }}</span>
                <span v-else class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-gray-100 text-gray-600">{{ item.status }}</span>
              </td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.requestedBy }}</td>
              <td class="px-5 py-4 text-right">
                <button @click.stop="router.push(`/inventory/adjustments/${item.id}`)" class="text-[#165A31] font-bold hover:underline cursor-pointer">
                  {{ item.actionText }} &rarr;
                </button>
              </td>
            </tr>
            <tr v-if="filteredAdjustments.length === 0">
              <td colspan="9" class="text-center py-8 text-xs text-gray-400">
                No adjustments found matching filters.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Popup -->
    <CreateAdjustmentRequestModal 
      v-if="showCreateModal" 
      :adjustment-item="selectedAdjustmentToEdit"
      @close="showCreateModal = false"
      @created="handleCreated"
      @updated="handleUpdated"
    />
  </div>
</template>
