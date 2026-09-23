<script setup>
import { Search, ChevronDown, Check, Plus, Pencil } from 'lucide-vue-next'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../../store.js'
import CreateProductRequestModal from './CreateProductRequest.vue'

const router = useRouter()
const showCreateModal = ref(false)
const selectedRequestToEdit = ref(null)

const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

// Branch Manager Data
const branchKpis = [
  { label: 'Open', value: '3' },
  { label: 'Submitted', value: '2', sub: 'Head Office review' },
  { label: 'Approved', value: '8', sub: 'This quarter' },
  { label: 'Rejected', value: '1', sub: 'This quarter' }
]

const branchRequests = ref([
  {
    id: 'PR-028',
    request: 'PR-028',
    product: 'BRG Urban Mini',
    category: 'Electric Scooter',
    specifications: 'Compact urban electric model',
    reference: 'REF-EV-2026',
    customerDemand: '4 recent inquiries',
    urgency: 'Medium',
    images: '2 references attached',
    reason: 'Customer demand',
    submitted: '26 Aug',
    status: 'Submitted',
    statusClass: 'bg-[#e0e7ff] text-[#3730a3]'
  },
  {
    id: 'PR-024',
    request: 'PR-024',
    product: 'BRG X5 / Sand Beige',
    category: 'Electric Motorcycle',
    specifications: 'Special paint edition',
    reference: 'REF-X5-BEIGE',
    customerDemand: '6 advance deposits',
    urgency: 'High',
    images: '1 color swatch',
    reason: 'Requested variant',
    submitted: '20 Aug',
    status: 'Approved',
    statusClass: 'bg-[#dcfce7] text-[#165A31]'
  }
])

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
      const match = item.request.toLowerCase().includes(q) ||
                    item.product.toLowerCase().includes(q) ||
                    item.reason.toLowerCase().includes(q) ||
                    item.status.toLowerCase().includes(q)
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
  branchRequests.value.unshift({
    ...item,
    request: item.id,
    submitted: 'Today',
    statusClass: 'bg-[#e0e7ff] text-[#3730a3]'
  })
}

const handleUpdated = (item) => {
  const idx = branchRequests.value.findIndex(r => r.id === item.id || r.request === item.id)
  if (idx !== -1) {
    branchRequests.value[idx] = {
      ...branchRequests.value[idx],
      ...item,
      request: item.id
    }
  }
}

// Super Admin Data
const activeTab = ref('All')
const tabs = ['All', 'Pending', 'Approved', 'Rejected']
const searchQuery = ref('')
const selectedBranch = ref('All Branches')
const openDropdown = ref(null)

const branches = ['All Branches', 'Peshawar', 'Islamabad', 'Lahore']

const requestsData = ref([
  { id: 'PR-0181', request: 'PR-0181', branch: 'Peshawar', product: 'BRG DS12', category: 'Electric Motorcycle', specifications: 'High torque version', reason: 'Customer demand', submitted: 'Aug 27', status: 'Pending', action: 'Review' },
  { id: 'PR-0178', request: 'PR-0178', branch: 'Lahore', product: 'BRG Cargo Max', category: 'Electric Cargo', specifications: 'Extended payload bed', reason: 'Commercial lead', submitted: 'Aug 20', status: 'Pending', action: 'Review' },
  { id: 'PR-0162', request: 'PR-0162', branch: 'Islamabad', product: 'BRG City Mini', category: 'Electric Scooter', specifications: 'Foldable commuter model', reason: 'New segment', submitted: 'Aug 19', status: 'Approved', action: 'Open' },
  { id: 'PR-0155', request: 'PR-0155', branch: 'Peshawar', product: 'BRG HyperSport', category: 'Electric Superbike', specifications: 'Track spec package', reason: 'Custom racing request', submitted: 'Aug 10', status: 'Rejected', action: 'View' }
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
  <!-- BRANCH MANAGER VIEW -->
  <div v-if="isBranchUser" class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openBranchDropdown = null">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[11px] text-gray-400 mb-1">
          Branch Manager / Product Requests / <span class="font-medium text-gray-600">Product Requests</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Product Requests</h1>
        <p class="text-xs text-gray-500 mt-1">Requests for products or variants not yet in the approved catalogue.</p>
      </div>
      <button 
        @click="openCreateModal" 
        class="bg-[#165A31] text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer"
      >
        <Plus class="w-4 h-4" />
        <span>New Product Request</span>
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
              v-for="st in ['All', 'Submitted', 'Approved', 'Rejected']"
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

    <!-- Product Requests Table Card -->
    <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-bold text-gray-900">Product Requests</h3>
        <span class="text-xs text-gray-400 font-medium">Showing {{ filteredBranchRequests.length }} requests</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="text-[10px] font-bold text-gray-400 border-b border-gray-100 pb-3 uppercase tracking-wider">
              <th class="pb-3 font-semibold w-32">Request</th>
              <th class="pb-3 font-semibold w-56">Requested Product</th>
              <th class="pb-3 font-semibold">Reason</th>
              <th class="pb-3 font-semibold w-32">Submitted</th>
              <th class="pb-3 font-semibold w-28">Status</th>
              <th class="pb-3 font-semibold w-24 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="text-xs divide-y divide-gray-50">
            <tr 
              v-for="(req, index) in filteredBranchRequests" 
              :key="index" 
              class="hover:bg-gray-50/50 transition-colors"
            >
              <td class="py-4 align-middle font-bold text-gray-900">
                {{ req.request }}
              </td>
              <td class="py-4 align-middle text-gray-800 font-semibold">
                {{ req.product }}
              </td>
              <td class="py-4 align-middle text-gray-600 font-medium">
                {{ req.reason }}
              </td>
              <td class="py-4 align-middle text-gray-600 font-medium">
                {{ req.submitted }}
              </td>
              <td class="py-4 align-middle">
                <span class="px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap" :class="req.statusClass">
                  {{ req.status }}
                </span>
              </td>
              <td class="py-4 align-middle text-right whitespace-nowrap">
                <button 
                  @click="openEditModal(req)" 
                  class="p-1.5 text-gray-400 hover:text-[#165A31] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center"
                  title="Edit Product Request"
                >
                  <Pencil class="w-4 h-4 text-[#165A31]" />
                </button>
              </td>
            </tr>
            <tr v-if="filteredBranchRequests.length === 0">
              <td colspan="6" class="text-center py-8 text-xs text-gray-400">
                No product requests match your filters.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Popup -->
    <CreateProductRequestModal 
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
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Catalogue / <span class="font-bold text-gray-800">Product Requests</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Product Requests</h1>
        <p class="text-sm text-gray-500 mt-1">Review branch requests for missing products or catalogue additions.</p>
      </div>
      <button 
        @click="openCreateModal" 
        class="bg-[#165A31] text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer"
      >
        <Plus class="w-4 h-4" />
        <span>New Product Request</span>
      </button>
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
        <table class="w-full text-left">
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
            <tr v-for="item in filteredRequests" :key="item.request" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
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
              <td class="px-5 py-4 text-right">
                <button @click="openEditModal(item)" class="text-[#165A31] font-bold hover:underline cursor-pointer">
                  {{ item.action }} &rarr;
                </button>
              </td>
            </tr>
            <tr v-if="filteredRequests.length === 0">
              <td colspan="7" class="text-center py-12 text-gray-500">
                <div class="flex flex-col items-center justify-center">
                  <span class="text-2xl mb-2">🔍</span>
                  <p class="text-sm font-semibold text-gray-700">No product requests found</p>
                  <p class="text-xs text-gray-400 mt-1">Try adjusting your active tab or search query</p>
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
    <CreateProductRequestModal 
      v-if="showCreateModal" 
      :request-item="selectedRequestToEdit"
      @close="showCreateModal = false"
      @created="handleCreated"
      @updated="handleUpdated"
    />
  </div>
</template>
