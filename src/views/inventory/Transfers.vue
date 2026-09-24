<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDown, ChevronRight, Search, Plus, Pencil, Check, X } from 'lucide-vue-next'
import { store } from '../../store.js'
import CreateTransferModal from './CreateTransfer.vue'

const router = useRouter()
const showCreateModal = ref(false)
const showReceiveModal = ref(false)
const selectedTransferToEdit = ref(null)
const expandedBranchRows = ref([])
const expandedReceive = ref(null)

const toggleBranchRow = (id) => {
  if (expandedBranchRows.value.includes(id)) {
    expandedBranchRows.value = expandedBranchRows.value.filter(rowId => rowId !== id)
  } else {
    expandedBranchRows.value.push(id)
  }
}

const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

// Branch Manager Data
const branchTransfers = computed(() => {
  const branchName = user.value?.branchName || 'Peshawar'
  return store.transfers
    .filter(t => !t.from || !t.to || t.from === branchName || t.to === branchName)
    .map(t => ({
      ...t,
      direction: t.to === branchName ? 'Inbound' : 'Outbound',
      fromTo: `${t.from} → ${t.to}`,
      statusClass: t.status === 'Received' ? 'bg-[#dcfce7] text-[#165A31]' : (t.status === 'In Transit' ? 'bg-blue-50 text-blue-700' : 'bg-[#fef3c7] text-[#b45309]')
    }))
})

const branchKpis = computed(() => [
  { label: 'Incoming', value: String(branchTransfers.value.filter(t => t.direction === 'Inbound' && t.status !== 'Received').length) },
  { label: 'Outgoing', value: String(branchTransfers.value.filter(t => t.direction === 'Outbound' && t.status !== 'Received').length) },
  { label: 'In Transit', value: String(branchTransfers.value.filter(t => t.status === 'In Transit').length) },
  { label: 'Received', value: String(branchTransfers.value.filter(t => t.status === 'Received').length), sub: 'This month' }
])

const pendingIncomingTransfers = computed(() => {
  return branchTransfers.value.filter(t => t.direction === 'Inbound' && t.status === 'In Transit')
})

const acceptTransfer = (id) => {
  router.push(`/inventory/transfers/receive?id=${id}`)
}

const rejectTransfer = (id) => {
  const t = store.getTransferById(id)
  if (t) {
    store.updateTransfer(id, { status: 'Rejected', statusClass: 'bg-red-50 text-red-700' })
  }
}

const branchStatusFilter = ref('All')
const openBranchDropdown = ref(null)
const branchSearchQuery = ref('')

const toggleBranchDropdown = (name) => {
  openBranchDropdown.value = openBranchDropdown.value === name ? null : name
}

const filteredBranchTransfers = computed(() => {
  return branchTransfers.value.filter(item => {
    if (branchStatusFilter.value !== 'All' && item.status.toLowerCase() !== branchStatusFilter.value.toLowerCase()) {
      return false
    }
    if (branchSearchQuery.value.trim()) {
      const q = branchSearchQuery.value.toLowerCase()
      const match = item.id.toLowerCase().includes(q) ||
                    (item.fromTo && item.fromTo.toLowerCase().includes(q)) ||
                    (item.status && item.status.toLowerCase().includes(q))
      if (!match) return false
    }
    return true
  })
})

const openCreateModal = () => {
  selectedTransferToEdit.value = null
  showCreateModal.value = true
}

const openEditModal = (item) => {
  selectedTransferToEdit.value = { ...item }
  showCreateModal.value = true
}

const handleCreated = (item) => {
  try {
    store.addTransfer(item)
  } catch (err) {
    alert(err.message)
  }
}

const handleUpdated = (item) => {
  store.updateTransfer(item.id, item)
}

// Super Admin Data
const activeTab = ref('All')
const tabs = ['All', 'Requested', 'Approved', 'Picking', 'In Transit', 'Received']
const searchQuery = ref('')
const selectedBranch = ref('All Branches')
const openDropdown = ref(null)

const branches = ['All Branches', 'Peshawar', 'Islamabad', 'Lahore']

const transfers = computed(() => store.transfers)

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const selectBranch = (branch) => {
  selectedBranch.value = branch
  openDropdown.value = null
}

const resetFilters = () => {
  activeTab.value = 'All'
  searchQuery.value = ''
  selectedBranch.value = 'All Branches'
}

const filteredTransfers = computed(() => {
  return transfers.value.filter(item => {
    if (activeTab.value !== 'All') {
      const st = (item.status || '').toLowerCase()
      const tab = activeTab.value.toLowerCase()
      if (tab === 'requested') {
        if (st !== 'requested' && st !== 'pending' && st !== 'draft') return false
      } else if (tab === 'approved') {
        if (st !== 'approved') return false
      } else if (tab === 'picking') {
        if (st !== 'picking' && st !== 'preparing') return false
      } else if (tab === 'in transit') {
        if (st !== 'in transit' && st !== 'dispatched') return false
      } else if (tab === 'received') {
        if (st !== 'received' && st !== 'completed') return false
      } else if (st !== tab) {
        return false
      }
    }
    if (selectedBranch.value !== 'All Branches' && item.from !== selectedBranch.value && item.to !== selectedBranch.value) return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = item.id.toLowerCase().includes(q) ||
                    item.from.toLowerCase().includes(q) ||
                    item.to.toLowerCase().includes(q) ||
                    item.requestedBy.toLowerCase().includes(q) ||
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
          Branch Manager / Transfers / <span class="font-medium text-gray-600">Transfers</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Transfers</h1>
        <p class="text-xs text-gray-500 mt-1">Incoming and outgoing transfers involving {{ user?.branchName || 'Peshawar' }} Branch only.</p>
      </div>
      <div class="flex items-center gap-2">
        <button 
          @click="openCreateModal" 
          class="bg-[#165A31] text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer"
        >
          <Plus class="w-4 h-4" />
          <span>Create Transfer</span>
        </button>
        <button 
          @click="showReceiveModal = true" 
          class="bg-white text-gray-700 border border-gray-200 text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer relative"
        >
          Receive Transfer
          <span v-if="pendingIncomingTransfers.length > 0" class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
            {{ pendingIncomingTransfers.length }}
          </span>
        </button>
      </div>
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
              v-for="st in ['All', 'In Transit', 'Dispatched', 'Received']"
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
            placeholder="Search transfer ID..." 
            class="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
          />
        </div>
      </div>
    </div>

    <!-- Branch Transfers Table Card -->
    <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-bold text-gray-900">Branch Transfers</h3>
        <span class="text-xs text-gray-400 font-medium">Showing {{ filteredBranchTransfers.length }} transfers</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="text-[10px] font-bold text-gray-400 border-b border-gray-100 pb-3 uppercase tracking-wider">
              <th class="pb-3 w-8"></th>
              <th class="pb-3 font-semibold w-24">Transfer</th>
              <th class="pb-3 font-semibold w-24">Direction</th>
              <th class="pb-3 font-semibold w-48">From / To</th>
              <th class="pb-3 font-semibold w-20">Units</th>
              <th class="pb-3 font-semibold w-28">Dispatched</th>
              <th class="pb-3 font-semibold w-28">Expected</th>
              <th class="pb-3 font-semibold w-28">Status</th>
              <th class="pb-3 font-semibold w-20 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="text-xs divide-y divide-gray-50">
            <template v-for="item in filteredBranchTransfers" :key="item.id">
              <tr class="hover:bg-gray-50/50 transition-colors">
                <td class="py-4 align-middle px-2">
                  <button @click="toggleBranchRow(item.id)" class="p-1 rounded hover:bg-gray-200 text-gray-400 transition-colors">
                    <ChevronDown v-if="expandedBranchRows.includes(item.id)" class="w-4 h-4" />
                    <ChevronRight v-else class="w-4 h-4" />
                  </button>
                </td>
                <td class="py-4 align-middle font-bold text-gray-900">
                  {{ item.id }}
                </td>
              <td class="py-4 align-middle text-gray-700 font-medium">
                {{ item.direction }}
              </td>
              <td class="py-4 align-middle text-gray-700 font-medium">
                {{ item.fromTo }}
              </td>
              <td class="py-4 align-middle text-gray-700 font-medium">
                {{ item.units }}
              </td>
              <td class="py-4 align-middle text-gray-700 font-medium">
                {{ item.dispatched }}
              </td>
              <td class="py-4 align-middle text-gray-700 font-medium">
                {{ item.expectedArrival }}
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
                    title="Edit Transfer"
                  >
                    <Pencil class="w-4 h-4 text-[#165A31]" />
                  </button>
                  <button 
                    @click="router.push(`/inventory/transfers/detail?id=${item.id}`)"
                    class="text-xs font-medium text-gray-400 hover:text-gray-700 cursor-pointer flex items-center justify-end gap-0.5"
                  >
                    Open &rsaquo;
                  </button>
                </div>
              </td>
            </tr>
            <!-- Expanded Row Details -->
            <tr v-if="expandedBranchRows.includes(item.id)" class="bg-gray-50/30">
              <td colspan="9" class="px-6 py-4 border-b border-gray-100">
                <div class="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                  <div class="px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-700 flex items-center justify-between">
                    <span>Transfer Contents</span>
                    <span class="text-gray-400 font-medium">{{ item.items?.length || 0 }} products</span>
                  </div>
                  <table class="w-full text-left text-xs">
                    <thead>
                      <tr class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                        <th class="px-4 py-2">Category</th>
                        <th class="px-4 py-2">Product Name</th>
                        <th class="px-4 py-2 text-right">Quantity</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                      <tr v-for="(prod, pIdx) in item.items" :key="pIdx">
                        <td class="px-4 py-2 text-gray-500 font-medium">{{ prod.category }}</td>
                        <td class="px-4 py-2 text-gray-800 font-semibold">{{ prod.name }}</td>
                        <td class="px-4 py-2 text-right text-gray-700 font-bold">{{ prod.count }}</td>
                      </tr>
                      <tr v-if="!item.items || item.items.length === 0">
                        <td colspan="3" class="px-4 py-4 text-center text-gray-400 text-xs">No items detailed</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
            </template>
            <tr v-if="filteredBranchTransfers.length === 0">
              <td colspan="8" class="text-center py-8 text-xs text-gray-400">
                No transfers found matching filters.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Receive Transfers Modal -->
    <div v-if="showReceiveModal" class="fixed inset-0 bg-gray-900/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" @click.self="showReceiveModal = false">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div class="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 class="text-lg font-bold text-gray-900">Pending Incoming Transfers</h2>
            <p class="text-xs text-gray-500 mt-0.5">Transfers dispatched to your branch requiring receipt.</p>
          </div>
          <button @click="showReceiveModal = false" class="text-gray-400 hover:text-gray-600 rounded bg-gray-50 hover:bg-gray-100 p-1.5 transition-colors cursor-pointer">
            <X class="w-4 h-4" />
          </button>
        </div>
        <div class="p-5 max-h-[60vh] overflow-y-auto">
          <div v-if="pendingIncomingTransfers.length === 0" class="text-center py-8">
            <div class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check class="w-5 h-5 text-gray-400" />
            </div>
            <p class="text-sm font-bold text-gray-700">You're all caught up!</p>
            <p class="text-xs text-gray-500 mt-1">No pending incoming transfers to receive.</p>
          </div>
          <div v-else class="space-y-3">
            <div v-for="t in pendingIncomingTransfers" :key="t.id" class="border border-gray-100 rounded-lg p-4 flex flex-col justify-between gap-4 shadow-sm hover:border-gray-200 transition-colors">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <span class="font-bold text-sm text-gray-900">{{ t.id }}</span>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-[#e0e7ff] text-[#3730a3]">{{ t.units }} Units</span>
                  </div>
                  <div class="text-xs text-gray-500">From: <span class="font-medium text-gray-700">{{ t.from }}</span></div>
                  <div class="text-[11px] text-gray-400 mt-1">Dispatched: {{ t.dispatched }} | Expected: <span class="text-gray-600 font-medium">{{ t.expectedArrival }}</span></div>
                </div>
                <div class="flex items-center gap-2">
                  <button @click="rejectTransfer(t.id)" class="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer">
                    Reject Entire
                  </button>
                  <button v-if="expandedReceive !== t.id" @click="expandedReceive = t.id" class="px-4 py-1.5 text-xs font-bold text-[#165A31] bg-[#eefcf2] hover:bg-[#dcfce7] rounded-lg transition-colors cursor-pointer border border-[#165A31]/20">
                    Process Receipt
                  </button>
                </div>
              </div>
              
              <!-- Checklist Form -->
              <div v-if="expandedReceive === t.id" class="mt-2 border-t border-gray-100 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <h4 class="text-xs font-bold text-gray-800 mb-2">Receipt Checklist</h4>
                <div class="space-y-3">
                  <div v-for="(prod, pIdx) in t.items" :key="pIdx" class="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                    <div>
                      <div class="text-[11px] font-bold text-gray-900">{{ prod.name }}</div>
                      <div class="text-[10px] text-gray-500 mt-0.5">Expected: {{ prod.count }}</div>
                    </div>
                    <div class="flex flex-wrap items-center gap-3">
                      <div>
                        <label class="block text-[9px] font-semibold text-gray-500 mb-1">Received Qty</label>
                        <input type="number" :defaultValue="prod.count" min="0" class="w-16 px-2 py-1 text-xs border border-gray-200 rounded focus:border-[#165A31] focus:outline-none transition-colors" />
                      </div>
                      <div>
                        <label class="block text-[9px] font-semibold text-gray-500 mb-1">Condition</label>
                        <select class="w-24 px-2 py-1 text-[10px] font-medium border border-gray-200 rounded focus:border-[#165A31] focus:outline-none transition-colors bg-white">
                          <option>Good</option>
                          <option>Damaged</option>
                          <option>Missing</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="mt-4 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
                  <div>
                    <label class="block text-[10px] font-bold text-gray-700 mb-1">Date Received</label>
                    <input type="date" :defaultValue="new Date().toISOString().split('T')[0]" class="px-3 py-1.5 text-xs border border-gray-200 rounded focus:border-[#165A31] focus:outline-none transition-colors" />
                  </div>
                  <div class="flex items-center gap-2">
                    <button @click="expandedReceive = null" class="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 cursor-pointer">
                      Cancel
                    </button>
                    <button @click="acceptTransfer(t.id); expandedReceive = null" class="px-5 py-2 text-xs font-bold text-white bg-[#165A31] hover:bg-[#124a28] rounded-lg transition-colors cursor-pointer shadow-sm">
                      Confirm Receipt
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Popup -->
    <CreateTransferModal 
      v-if="showCreateModal" 
      :transfer-item="selectedTransferToEdit"
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
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Inventory / <span class="font-bold text-gray-800">Transfers</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Transfers</h1>
        <p class="text-sm text-gray-500 mt-1">Control stock movement between AJ ECODRIVE branches.</p>
      </div>
      <button @click="openCreateModal" class="px-4 py-2 bg-[#165A31] text-white text-[11px] font-bold rounded-lg hover:bg-[#114a28] transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
        <Plus class="w-4 h-4" />
        <span>Create Transfer</span>
      </button>
    </div>

    <!-- Tabs & Filter Bar -->
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

      <div class="flex items-center gap-3">
        <!-- Search -->
        <div class="relative w-full sm:w-64">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search class="h-4 w-4" />
          </span>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search transfer ID, branch..." 
            class="w-full pl-9 pr-3 py-1.5 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
          />
        </div>

        <!-- Branch dropdown -->
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

    <!-- Table Container -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-[14px] font-bold text-gray-900">Transfers</h3>
        <span class="text-[11px] font-medium text-gray-500">Showing {{ filteredTransfers.length }} transfers</span>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
              <th class="px-5 py-3">Transfer</th>
              <th class="px-5 py-3">From</th>
              <th class="px-5 py-3">To</th>
              <th class="px-5 py-3">Units</th>
              <th class="px-5 py-3">Requested By</th>
              <th class="px-5 py-3">Dispatched</th>
              <th class="px-5 py-3">Status</th>
              <th class="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr v-for="item in filteredTransfers" :key="item.id" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <td class="px-5 py-4 font-semibold text-gray-900">{{ item.id }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.from }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.to }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.units }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.requestedBy }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.dispatched }}</td>
              <td class="px-5 py-4">
                <span v-if="item.status === 'Received'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">{{ item.status }}</span>
                <span v-else-if="item.status === 'In Transit'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-blue-50 text-blue-600">{{ item.status }}</span>
                <span v-else-if="item.status === 'Picking'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-amber-50 text-amber-600">{{ item.status }}</span>
                <span v-else-if="item.status === 'Approved'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-emerald-50 text-emerald-600">{{ item.status }}</span>
                <span v-else class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-gray-100 text-gray-600">{{ item.status }}</span>
              </td>
              <td class="px-5 py-4 text-right">
                <button @click="openEditModal(item)" class="text-[#165A31] font-bold hover:underline cursor-pointer">
                  Edit &rarr;
                </button>
              </td>
            </tr>
            <tr v-if="filteredTransfers.length === 0">
              <td colspan="8" class="text-center py-12 text-gray-500">
                <div class="flex flex-col items-center justify-center">
                  <span class="text-2xl mb-2">🔍</span>
                  <p class="text-sm font-semibold text-gray-700">No transfers found</p>
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
    <CreateTransferModal 
      v-if="showCreateModal" 
      :transfer-item="selectedTransferToEdit"
      @close="showCreateModal = false"
      @created="handleCreated"
      @updated="handleUpdated"
    />
  </div>
</template>