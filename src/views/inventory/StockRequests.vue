<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search, ChevronDown, Check, Plus, Pencil } from 'lucide-vue-next'
import { store } from '../../store.js'
import CreateStockRequestModal from './CreateStockRequest.vue'

const router = useRouter()
const showCreateModal = ref(false)
const selectedRequestToEdit = ref(null)

const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

// Branch Manager Data
const branchKpis = computed(() => {
  const reqs = branchRequests.value
  const open = reqs.filter(r => r.status === 'Pending' || r.status === 'Open').length
  const approved = reqs.filter(r => r.status === 'Approved').length
  const partial = reqs.filter(r => r.status === 'Partial').length
  const fulfilled = reqs.filter(r => r.status === 'Fulfilled' || r.status === 'Received').length
  return [
    { label: 'Open', value: String(open) },
    { label: 'Approved', value: String(approved), sub: 'This month' },
    { label: 'Partial', value: String(partial) },
    { label: 'Fulfilled', value: String(fulfilled), sub: 'This month' }
  ]
})

const branchRequests = computed(() => {
  const branchName = user.value?.branchName || 'Peshawar'
  return store.stockRequests
    .filter(r => !r.branch || r.branch === branchName || r.branch.toLowerCase().includes(branchName.toLowerCase()))
    .map(r => ({
      ...r,
      request: r.id || r.requestNo,
      expected: r.expected || r.needBy || '31 Aug',
      statusClass: r.status === 'Approved' ? 'bg-[#dcfce7] text-[#165A31]' : (r.status === 'Rejected' ? 'bg-red-50 text-red-600' : 'bg-[#e0e7ff] text-[#3730a3]')
    }))
})

const branchStatusFilter = ref('All')
const openBranchDropdown = ref(null)
const branchSearchQuery = ref('')

const toggleBranchDropdown = (name) => {
  openBranchDropdown.value = openBranchDropdown.value === name ? null : name
}

const filteredBranchRequests = computed(() => {
  return branchRequests.value.filter(item => {
    if (branchStatusFilter.value !== 'All' && item.status.toLowerCase() !== branchStatusFilter.value.toLowerCase()) {
      return false
    }
    if (branchSearchQuery.value.trim()) {
      const q = branchSearchQuery.value.toLowerCase()
      const match = (item.request && item.request.toLowerCase().includes(q)) ||
                    (item.product && item.product.toLowerCase().includes(q)) ||
                    (item.reason && item.reason.toLowerCase().includes(q)) ||
                    (item.status && item.status.toLowerCase().includes(q))
      if (!match) return false
    }
    return true
  })
})

const openCreateModal = () => {
  selectedRequestToEdit.value = null
  showCreateModal.value = true
}

const openEditModal = (req) => {
  selectedRequestToEdit.value = { ...req }
  showCreateModal.value = true
}

const handleCreated = (item) => {
  if (!store.getStockRequestById(item.id)) {
    store.addStockRequest(item)
  }
}

const handleUpdated = (item) => {
  store.updateStockRequest(item)
}

// Super Admin Data
const activeTab = ref('All')
const tabs = ['All', 'Pending', 'Approved', 'Partial', 'Rejected']
const searchQuery = ref('')
const selectedBranch = ref('All Branches')
const selectedPriority = ref('All Priorities')
const openDropdown = ref(null)

const branches = ['All Branches', 'Peshawar', 'Islamabad', 'Lahore']
const priorities = ['All Priorities', 'High', 'Medium', 'Low']

const requests = computed(() => {
  return store.stockRequests.map(r => ({
    ...r,
    products: r.product || 'BRG DS11',
    units: String(r.qty || r.units || 1),
    needBy: r.needBy || r.expected || 'Aug 31',
    actionText: r.status === 'Pending' ? 'Review' : 'Open'
  }))
})

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const selectFilter = (type, val) => {
  if (type === 'branch') selectedBranch.value = val
  if (type === 'priority') selectedPriority.value = val
  openDropdown.value = null
}

const resetFilters = () => {
  activeTab.value = 'All'
  searchQuery.value = ''
  selectedBranch.value = 'All Branches'
  selectedPriority.value = 'All Priorities'
}

const filteredRequests = computed(() => {
  return requests.value.filter(item => {
    if (activeTab.value !== 'All' && item.status.toLowerCase() !== activeTab.value.toLowerCase()) return false
    if (selectedBranch.value !== 'All Branches' && item.branch !== selectedBranch.value) return false
    if (selectedPriority.value !== 'All Priorities' && item.priority !== selectedPriority.value) return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = item.id.toLowerCase().includes(q) ||
                    item.branch.toLowerCase().includes(q) ||
                    item.products.toLowerCase().includes(q) ||
                    item.priority.toLowerCase().includes(q) ||
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
          Branch Manager / Stock Requests / <span class="font-medium text-gray-600">Stock Requests</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Stock Requests</h1>
        <p class="text-xs text-gray-500 mt-1">Branch stock requests and expected fulfilment.</p>
      </div>
      <button 
        @click="openCreateModal" 
        class="bg-[#165A31] text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer"
      >
        <Plus class="w-4 h-4" />
        <span>New Stock Request</span>
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
              v-for="st in ['All', 'Submitted', 'Approved', 'Pending', 'Fulfilled']"
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
            placeholder="Search request or product..." 
            class="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
          />
        </div>
      </div>
    </div>

    <!-- Stock Requests Table Card -->
    <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-bold text-gray-900">Stock Requests</h3>
        <span class="text-xs text-gray-400 font-medium">Showing {{ filteredBranchRequests.length }} requests</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="text-[10px] font-bold text-gray-400 border-b border-gray-100 pb-3 uppercase tracking-wider">
              <th class="pb-3 font-semibold w-36">Request</th>
              <th class="pb-3 font-semibold w-48">Product</th>
              <th class="pb-3 font-semibold w-24">Qty</th>
              <th class="pb-3 font-semibold w-36">Expected</th>
              <th class="pb-3 font-semibold w-32">Status</th>
              <th class="pb-3 font-semibold w-24 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="text-xs divide-y divide-gray-50">
            <tr 
              v-for="(req, index) in filteredBranchRequests" 
              :key="index" 
              @click="router.push(`/inventory/stock-requests/${req.id || req.request}`)"
              class="hover:bg-gray-50/50 transition-colors cursor-pointer"
            >
              <td class="py-4 align-middle font-bold text-gray-900">
                {{ req.request }}
              </td>
              <td class="py-4 align-middle text-gray-800 font-semibold">
                {{ req.product }}
              </td>
              <td class="py-4 align-middle text-gray-700 font-medium">
                {{ req.qty }}
              </td>
              <td class="py-4 align-middle text-gray-600 font-medium">
                {{ req.expected }}
              </td>
              <td class="py-4 align-middle">
                <span class="px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap" :class="req.statusClass">
                  {{ req.status }}
                </span>
              </td>
              <td class="py-4 align-middle text-right whitespace-nowrap">
                <button 
                  @click.stop="openEditModal(req)" 
                  class="p-1.5 text-gray-400 hover:text-[#165A31] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center"
                  title="Edit Stock Request"
                >
                  <Pencil class="w-4 h-4 text-[#165A31]" />
                </button>
              </td>
            </tr>
            <tr v-if="filteredBranchRequests.length === 0">
              <td colspan="6" class="text-center py-8 text-xs text-gray-400">
                No stock requests match your filters.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Popup -->
    <CreateStockRequestModal 
      v-if="showCreateModal" 
      :request-item="selectedRequestToEdit"
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
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Inventory / <span class="font-bold text-gray-800">Stock Requests</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Stock Requests</h1>
        <p class="text-sm text-gray-500 mt-1">Review branch requests for replenishment or specific units.</p>
      </div>
      <button 
        @click="openCreateModal" 
        class="bg-[#165A31] text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer"
      >
        <Plus class="w-4 h-4" />
        <span>New Stock Request</span>
      </button>
    </div>

    <!-- Filters & Tabs -->
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

      <div class="flex flex-wrap items-center gap-2">
        <!-- Search -->
        <div class="relative w-full sm:w-56">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search class="h-4 w-4" />
          </span>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search request..." 
            class="w-full pl-9 pr-3 py-1.5 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
          />
        </div>

        <!-- Branch Dropdown -->
        <div class="relative">
          <button 
            @click.stop="toggleDropdown('branch')"
            class="px-3 py-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex items-center gap-2"
            :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedBranch !== 'All Branches' }"
          >
            <span>{{ selectedBranch }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openDropdown === 'branch'" class="absolute right-0 mt-1 w-40 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
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

        <!-- Priority Dropdown -->
        <div class="relative">
          <button 
            @click.stop="toggleDropdown('priority')"
            class="px-3 py-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex items-center gap-2"
            :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedPriority !== 'All Priorities' }"
          >
            <span>{{ selectedPriority }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openDropdown === 'priority'" class="absolute right-0 mt-1 w-40 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
            <button 
              v-for="p in priorities" 
              :key="p" 
              @click.stop="selectFilter('priority', p)"
              class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700"
              :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedPriority === p }"
            >
              {{ p }}
            </button>
          </div>
        </div>

        <button 
          v-if="searchQuery || activeTab !== 'All' || selectedBranch !== 'All Branches' || selectedPriority !== 'All Priorities'" 
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
        <h3 class="text-[14px] font-bold text-gray-900">Stock Requests</h3>
        <span class="text-[11px] font-medium text-gray-500">Showing {{ filteredRequests.length }} requests</span>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
              <th class="px-5 py-3">Request</th>
              <th class="px-5 py-3">Branch</th>
              <th class="px-5 py-3">Products</th>
              <th class="px-5 py-3">Units</th>
              <th class="px-5 py-3">Need By</th>
              <th class="px-5 py-3">Priority</th>
              <th class="px-5 py-3">Status</th>
              <th class="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr v-for="item in filteredRequests" :key="item.id" @click="router.push(`/inventory/stock-requests/${item.id}`)" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer">
              <td class="px-5 py-4 font-semibold text-gray-900">{{ item.id }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.branch }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.products }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.units }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.needBy }}</td>
              <td class="px-5 py-4">
                <span v-if="item.priority === 'High'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-orange-50 text-orange-600">{{ item.priority }}</span>
                <span v-else-if="item.priority === 'Medium'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-blue-50 text-blue-600">{{ item.priority }}</span>
                <span v-else class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-gray-100 text-gray-600">{{ item.priority }}</span>
              </td>
              <td class="px-5 py-4">
                <span v-if="item.status === 'Pending'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-amber-50 text-amber-600">{{ item.status }}</span>
                <span v-else-if="item.status === 'Approved'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">{{ item.status }}</span>
                <span v-else-if="item.status === 'Partial'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-blue-50 text-blue-600">{{ item.status }}</span>
                <span v-else-if="item.status === 'Rejected'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-red-50 text-red-600">{{ item.status }}</span>
                <span v-else class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-gray-100 text-gray-600">{{ item.status }}</span>
              </td>
              <td class="px-5 py-4 text-right">
                <button @click.stop="router.push(`/inventory/stock-requests/${item.id}`)" class="text-[#165A31] font-bold hover:underline cursor-pointer">
                  {{ item.actionText }} &rarr;
                </button>
              </td>
            </tr>
            <tr v-if="filteredRequests.length === 0">
              <td colspan="8" class="text-center py-12 text-gray-500">
                <div class="flex flex-col items-center justify-center">
                  <span class="text-2xl mb-2">🔍</span>
                  <p class="text-sm font-semibold text-gray-700">No stock requests found</p>
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

    <!-- Modal Popup -->
    <CreateStockRequestModal 
      v-if="showCreateModal" 
      :request-item="selectedRequestToEdit"
      @close="showCreateModal = false"
      @created="handleCreated"
      @updated="handleUpdated"
    />
  </div>
</template>
