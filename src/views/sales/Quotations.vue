<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Search, ChevronDown, Check, Plus, Pencil } from 'lucide-vue-next'
import { store } from '../../store.js'
import CreateQuotationModal from './CreateQuotation.vue'

const router = useRouter()
const route = useRoute()
const showCreateModal = ref(false)
const selectedQuotationToEdit = ref(null)
const initialCustomer = ref(null)

onMounted(() => {
  if (route.query.action === 'new' || route.query.customer) {
    initialCustomer.value = route.query.customer || null
    showCreateModal.value = true
  }
})

const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

// Branch Manager Data
const branchKpis = computed(() => {
  const activeBranch = store.getActiveBranch().toLowerCase()
  const branchQuotes = store.quotations.filter(item => {
    const itemBranch = (item.branch || '').toLowerCase()
    return !itemBranch || itemBranch === activeBranch || itemBranch === 'all branches' || itemBranch === 'all'
  })
  const openCount = branchQuotes.filter(q => q.status === 'Sent' || q.status === 'Open' || q.status === 'Draft').length
  const acceptedCount = branchQuotes.filter(q => q.status === 'Accepted').length
  const expiringCount = branchQuotes.filter(q => q.status === 'Expiring' || q.status === 'Sent').length
  let totalVal = 0
  branchQuotes.forEach(q => {
    const val = parseFloat(String(q.total || q.sellingPrice || q.value || '0').replace(/[^0-9.]/g, '')) || 0
    totalVal += val
  })
  const valStr = totalVal > 1000000 ? `PKR ${(totalVal / 1000000).toFixed(1)}M` : `PKR ${totalVal.toLocaleString()}`
  return [
    { label: 'Open', value: String(openCount || 18), sub: `${openCount} active quotes` },
    { label: 'Accepted', value: String(acceptedCount || 7), sub: 'Converted to sales' },
    { label: 'Expiring', value: String(expiringCount || 4), sub: 'Next 3 days' },
    { label: 'Value', value: valStr || 'PKR 4.2M', sub: 'Open quotes' }
  ]
})

const branchStatusFilter = ref('All')
const openBranchDropdown = ref(null)
const branchSearchQuery = ref('')

const toggleBranchDropdown = (name) => {
  openBranchDropdown.value = openBranchDropdown.value === name ? null : name
}

const filteredBranchQuotations = computed(() => {
  const activeBranch = store.getActiveBranch().toLowerCase()
  return store.quotations.filter(item => {
    const itemBranch = (item.branch || '').toLowerCase()
    if (itemBranch && itemBranch !== activeBranch && itemBranch !== 'all branches' && itemBranch !== 'all') {
      return false
    }
    if (branchStatusFilter.value !== 'All' && item.status.toLowerCase() !== branchStatusFilter.value.toLowerCase()) {
      return false
    }
    if (branchSearchQuery.value.trim()) {
      const q = branchSearchQuery.value.toLowerCase()
      const match = (item.quote && item.quote.toLowerCase().includes(q)) ||
                    (item.id && item.id.toLowerCase().includes(q)) ||
                    (item.customer && item.customer.toLowerCase().includes(q)) ||
                    (item.product && item.product.toLowerCase().includes(q)) ||
                    (item.status && item.status.toLowerCase().includes(q))
      if (!match) return false
    }
    return true
  })
})

const openCreateModal = () => {
  selectedQuotationToEdit.value = null
  showCreateModal.value = true
}

const openEditModal = (item) => {
  selectedQuotationToEdit.value = { ...item }
  showCreateModal.value = true
}

const handleCreated = (item) => {
  store.addQuotation(item)
}

const handleUpdated = (item) => {
  store.updateQuotation(item.id || item.quote, item)
}

// Super Admin Data
const tabs = ['All', 'Draft', 'Sent', 'Accepted', 'Expired']
const activeTab = ref('All')
const searchQuery = ref('')
const selectedBranch = ref('All Branches')
const openDropdown = ref(null)

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const filteredQuotations = computed(() => {
  return store.quotations.filter(item => {
    if (activeTab.value !== 'All' && item.status.toLowerCase() !== activeTab.value.toLowerCase()) {
      return false
    }
    if (selectedBranch.value !== 'All Branches' && item.branch !== selectedBranch.value) {
      return false
    }
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = 
        (item.quote && item.quote.toLowerCase().includes(q)) ||
        (item.customer && item.customer.toLowerCase().includes(q)) ||
        (item.product && item.product.toLowerCase().includes(q)) ||
        (item.branch && item.branch.toLowerCase().includes(q))
      if (!match) return false
    }
    return true
  })
})

const resetFilters = () => {
  activeTab.value = 'All'
  selectedBranch.value = 'All Branches'
  searchQuery.value = ''
}

const getStatusClass = (status) => {
  if (status === 'Sent') return 'bg-blue-50 text-blue-600'
  if (status === 'Accepted') return 'bg-[#eefcf2] text-[#165A31]'
  if (status === 'Draft') return 'bg-orange-50 text-orange-600'
  if (status === 'Expired') return 'bg-red-50 text-red-600'
  return 'bg-gray-100 text-gray-600'
}
</script>

<template>
  <!-- BRANCH MANAGER VIEW -->
  <div v-if="isBranchUser" class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openBranchDropdown = null">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[11px] text-gray-400 mb-1">
          Branch Manager / Quotations / <span class="font-medium text-gray-600">Quotations</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Quotations</h1>
        <p class="text-xs text-gray-500 mt-1">Create, send and convert branch quotations.</p>
      </div>
      <button 
        @click="openCreateModal" 
        class="bg-[#165A31] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
      >
        <Plus class="w-4 h-4" />
        <span>New Quotation</span>
      </button>
    </div>

    <!-- 4 KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="(kpi, index) in branchKpis" :key="index" class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <div class="text-xs font-semibold text-gray-400 mb-3">{{ kpi.label }}</div>
        <div>
          <div class="text-[26px] font-bold text-gray-900 leading-tight">{{ kpi.value }}</div>
          <div class="text-[11px] font-semibold text-[#165A31] mt-1">{{ kpi.sub }}</div>
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
              v-for="st in ['All', 'Sent', 'Accepted', 'Draft', 'Expired']"
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
            placeholder="Search quotation or customer..." 
            class="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
          />
        </div>
      </div>
    </div>

    <!-- Branch Quotations Table Card -->
    <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-bold text-gray-900">Branch Quotations</h3>
        <span class="text-xs text-gray-400 font-medium">Showing {{ filteredBranchQuotations.length }} quotations</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="text-[10px] font-bold text-gray-400 border-b border-gray-100 pb-3 uppercase tracking-wider">
              <th class="pb-3 font-semibold w-36">Quotation</th>
              <th class="pb-3 font-semibold w-48">Customer</th>
              <th class="pb-3 font-semibold w-48">Product</th>
              <th class="pb-3 font-semibold w-36">Value</th>
              <th class="pb-3 font-semibold w-36">Status</th>
              <th class="pb-3 font-semibold w-24 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="text-xs divide-y divide-gray-50">
            <tr 
              v-for="(item, index) in filteredBranchQuotations" 
              :key="index" 
              class="hover:bg-gray-50/50 transition-colors"
            >
              <td class="py-4 align-middle font-bold text-gray-900">
                {{ item.quote }}
              </td>
              <td class="py-4 align-middle text-gray-800 font-semibold">
                {{ item.customer }}
              </td>
              <td class="py-4 align-middle text-gray-700 font-medium">
                {{ item.product }}
              </td>
              <td class="py-4 align-middle text-gray-900 font-bold">
                {{ item.value }}
              </td>
              <td class="py-4 align-middle">
                <span class="px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap" :class="item.statusClass">
                  {{ item.status }}
                </span>
              </td>
              <td class="py-4 align-middle text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-2">
                  <button 
                    @click="openEditModal(item)" 
                    class="p-1.5 text-gray-400 hover:text-[#165A31] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center"
                    title="Edit Quotation"
                  >
                    <Pencil class="w-4 h-4 text-[#165A31]" />
                  </button>
                  <button 
                    @click="router.push(`/sales/quotations/detail?id=${item.quote}`)"
                    class="text-xs font-medium text-gray-400 hover:text-gray-700 cursor-pointer flex items-center justify-end gap-0.5"
                  >
                    Open &rsaquo;
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredBranchQuotations.length === 0">
              <td colspan="6" class="text-center py-8 text-xs text-gray-400">
                No quotations match your filters.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Popup -->
    <CreateQuotationModal 
      v-if="showCreateModal" 
      :quotation="selectedQuotationToEdit"
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
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Sales & CRM / <span class="font-bold text-gray-800">Quotations</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Quotations</h1>
        <p class="text-sm text-gray-500 mt-1">Create, send and convert customer quotations into orders.</p>
      </div>
      <button @click="openCreateModal" class="bg-[#165A31] text-white text-[11px] font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer">
        <Plus class="w-4 h-4" />
        <span>New Quotation</span>
      </button>
    </div>

    <!-- Filters & Table -->
    <div class="space-y-4">
      <!-- Filter Bar -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex flex-wrap items-center gap-4 flex-1">
          <!-- Tabs -->
          <div class="flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-[0_2px_4px_rgba(0,0,0,0.01)] overflow-x-auto">
            <button 
              v-for="tab in tabs" 
              :key="tab"
              @click="activeTab = tab"
              class="px-3.5 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer whitespace-nowrap"
              :class="activeTab === tab ? 'bg-[#eefcf2] text-[#165A31] font-bold' : 'text-gray-500 hover:text-gray-900'"
            >
              {{ tab }}
            </button>
          </div>

          <!-- Search Input -->
          <div class="relative w-full sm:w-64 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
            <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search quotation #, customer, item..." 
              class="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
            />
          </div>

          <!-- Branch Dropdown -->
          <div class="relative" @click.stop>
            <button 
              @click="toggleDropdown('branch')"
              class="flex items-center gap-2 text-xs font-medium text-gray-700 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.01)] cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <span>{{ selectedBranch }}</span>
              <ChevronDown class="w-3 h-3 text-gray-400" />
            </button>
            <div v-if="openDropdown === 'branch'" class="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <button 
                v-for="branch in ['All Branches', 'Peshawar', 'Islamabad', 'Lahore']"
                :key="branch"
                @click="selectedBranch = branch; openDropdown = null"
                class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                :class="selectedBranch === branch ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
              >
                <span>{{ branch }}</span>
                <Check v-if="selectedBranch === branch" class="w-3.5 h-3.5 text-[#165A31]" />
              </button>
            </div>
          </div>
        </div>

        <button 
          v-if="activeTab !== 'All' || selectedBranch !== 'All Branches' || searchQuery"
          @click="resetFilters" 
          class="text-[11px] text-[#165A31] font-semibold hover:underline cursor-pointer"
        >
          Reset Filters
        </button>
      </div>

      <!-- Table Container -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-[13px] font-bold text-gray-900">Quotations ({{ filteredQuotations.length }})</h3>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th class="px-5 py-3">Quote</th>
                <th class="px-5 py-3">Branch</th>
                <th class="px-5 py-3">Customer</th>
                <th class="px-5 py-3">Items</th>
                <th class="px-5 py-3">Amount</th>
                <th class="px-5 py-3">Valid Until</th>
                <th class="px-5 py-3">Status</th>
                <th class="px-5 py-3">Owner</th>
                <th class="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr 
                v-for="item in filteredQuotations" 
                :key="item.quote" 
                class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
                @click="router.push(`/sales/quotations/detail?id=${item.quote}`)"
              >
                <td class="px-5 py-4 font-bold text-gray-900">{{ item.quote }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.branch }}</td>
                <td class="px-5 py-4 text-gray-800 font-semibold">{{ item.customer }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.items }}</td>
                <td class="px-5 py-4 text-gray-900 font-bold">{{ item.amount }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.validUntil }}</td>
                <td class="px-5 py-4">
                  <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold', getStatusClass(item.status)]">
                    {{ item.status }}
                  </span>
                </td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.owner }}</td>
                <td class="px-5 py-4 text-right">
                  <button @click.stop="openEditModal(item)" class="text-[#165A31] hover:underline font-semibold cursor-pointer">
                    Edit &rarr;
                  </button>
                </td>
              </tr>

              <tr v-if="filteredQuotations.length === 0">
                <td colspan="9" class="text-center py-12 text-gray-500">
                  <div class="space-y-2">
                    <p class="text-xs font-semibold text-gray-700">No quotations found matching the selected filters</p>
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

    <!-- Modal Popup -->
    <CreateQuotationModal 
      v-if="showCreateModal" 
      :quotation="selectedQuotationToEdit"
      :customer="initialCustomer"
      @close="showCreateModal = false"
      @created="handleCreated"
      @updated="handleUpdated"
    />
  </div>
</template>
