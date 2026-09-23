<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDown, ChevronRight, Plus, Search, Check, CheckCircle2, X } from 'lucide-vue-next'
import { store } from '../../store.js'

const router = useRouter()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const showToast = ref(false)
const toastMessage = ref('')
const showReceiveModal = ref(false)
const expandedBranchRows = ref([])
const expandedReceive = ref(null)

const toggleBranchRow = (id) => {
  if (expandedBranchRows.value.includes(id)) {
    expandedBranchRows.value = expandedBranchRows.value.filter(rowId => rowId !== id)
  } else {
    expandedBranchRows.value.push(id)
  }
}

// Branch Manager Data
const branchKpis = [
  { label: 'Expected Today', value: '2' },
  { label: 'In Transit', value: '8 units' },
  { label: 'Awaiting Receive', value: '1' },
  { label: 'Discrepancies', value: '1' }
]

const branchDeliveries = ref([
  {
    inbound: 'INB-091',
    poRef: 'PO-188',
    supplier: 'BRG Supply',
    expected: 'Today',
    products: 'BRG E9 Pro × 2',
    status: 'In Transit',
    statusClass: 'bg-[#e0e7ff] text-[#3730a3]',
    items: [
      { name: 'BRG E9 Pro', category: 'E-Scooter', count: 2 }
    ]
  },
  {
    inbound: 'INB-088',
    poRef: 'PO-181',
    supplier: 'BRG Supply',
    expected: '28 Aug',
    products: 'BRG M3 × 2',
    status: 'Awaiting Receive',
    statusClass: 'bg-[#fef3c7] text-[#b45309]',
    items: [
      { name: 'BRG M3', category: 'Accessories', count: 2 }
    ]
  },
  {
    inbound: 'INB-084',
    poRef: 'PO-177',
    supplier: 'PowerCell Co.',
    expected: 'Today',
    products: 'BRG DS11 × 4',
    status: 'Expected',
    statusClass: 'bg-[#dcfce7] text-[#165A31]',
    items: [
      { name: 'BRG DS11', category: 'E-Scooter', count: 4 }
    ]
  }
])

const pendingIncomingDeliveries = computed(() => {
  return branchDeliveries.value.filter(d => d.status === 'In Transit' || d.status === 'Awaiting Receive')
})

const acceptDelivery = (id) => {
  const d = branchDeliveries.value.find(item => item.inbound === id)
  if (d) {
    d.status = 'Received'
    d.statusClass = 'bg-[#dcfce7] text-[#165A31]'
    toastMessage.value = 'Delivery Received Successfully'
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 3000)
  }
}

const rejectDelivery = (id) => {
  const d = branchDeliveries.value.find(item => item.inbound === id)
  if (d) {
    d.status = 'Discrepancy'
    d.statusClass = 'bg-red-50 text-red-600'
  }
}

const branchStatusFilter = ref('All')
const branchDateFilter = ref('Date')
const branchSavedFilter = ref('Saved Filters')
const branchSupplierFilter = ref('All Suppliers')
const branchSearchQuery = ref('')
const openBranchDropdown = ref(null)

const toggleBranchDropdown = (name) => {
  openBranchDropdown.value = openBranchDropdown.value === name ? null : name
}

const selectBranchSavedFilter = (filterName) => {
  branchSavedFilter.value = filterName
  if (filterName === 'All Deliveries' || filterName === 'Saved Filters') {
    branchStatusFilter.value = 'All'
    branchSupplierFilter.value = 'All Suppliers'
  } else if (filterName === 'Expected Today') {
    branchStatusFilter.value = 'Expected'
  } else if (filterName === 'In Transit') {
    branchStatusFilter.value = 'In Transit'
  } else if (filterName === 'Awaiting Receive') {
    branchStatusFilter.value = 'Awaiting Receive'
  }
  openBranchDropdown.value = null
}

const hasActiveBranchFilters = computed(() => {
  return branchStatusFilter.value !== 'All' ||
         branchDateFilter.value !== 'Date' ||
         branchSavedFilter.value !== 'Saved Filters' ||
         branchSupplierFilter.value !== 'All Suppliers' ||
         branchSearchQuery.value.trim() !== ''
})

const clearBranchFilters = () => {
  branchStatusFilter.value = 'All'
  branchDateFilter.value = 'Date'
  branchSavedFilter.value = 'Saved Filters'
  branchSupplierFilter.value = 'All Suppliers'
  branchSearchQuery.value = ''
  openBranchDropdown.value = null
}

const branchVisibleColumns = ref({
  inbound: true,
  poRef: true,
  supplier: true,
  expected: true,
  products: true,
  status: true,
  actions: true
})

const toggleBranchColumn = (col) => {
  branchVisibleColumns.value[col] = !branchVisibleColumns.value[col]
  openBranchDropdown.value = null
}

const exportBranchDeliveries = () => {
  openBranchDropdown.value = null
  const rows = filteredBranchDeliveries.value
  if (!rows.length) {
    toastMessage.value = 'No deliveries match the filter to export'
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 3000)
    return
  }
  const headers = ['Inbound #', 'PO Reference', 'Supplier', 'Expected', 'Products', 'Status']
  const csvContent = 'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map(d => [
      `"${(d.inbound || '').replace(/"/g, '""')}"`,
      `"${(d.poRef || '').replace(/"/g, '""')}"`,
      `"${(d.supplier || '').replace(/"/g, '""')}"`,
      `"${(d.expected || '').replace(/"/g, '""')}"`,
      `"${(d.products || '').replace(/"/g, '""')}"`,
      `"${(d.status || '').replace(/"/g, '""')}"`
    ].join(','))].join('\n')
  
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `branch_inbound_deliveries_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  toastMessage.value = `Exported ${rows.length} delivery records to CSV`
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 4000)
}

const filteredBranchDeliveries = computed(() => {
  return branchDeliveries.value.filter(item => {
    if (branchStatusFilter.value !== 'All' && item.status.toLowerCase() !== branchStatusFilter.value.toLowerCase()) {
      return false
    }
    if (branchSupplierFilter.value !== 'All Suppliers' && item.supplier !== branchSupplierFilter.value) {
      return false
    }
    if (branchSearchQuery.value.trim()) {
      const q = branchSearchQuery.value.toLowerCase()
      const match = (item.inbound && item.inbound.toLowerCase().includes(q)) ||
                    (item.poRef && item.poRef.toLowerCase().includes(q)) ||
                    (item.supplier && item.supplier.toLowerCase().includes(q)) ||
                    (item.products && item.products.toLowerCase().includes(q)) ||
                    (item.status && item.status.toLowerCase().includes(q))
      if (!match) return false
    }
    return true
  })
})

// Super Admin Data
const activeTab = ref('All')
const tabs = ['All', 'Scheduled', 'In Transit', 'Received', 'Discrepancy']
const searchQuery = ref('')
const selectedBranch = ref('All Branches')
const openDropdown = ref(null)

const branches = ['All Branches', 'Peshawar', 'Islamabad', 'Lahore']

const deliveries = ref([
  { id: 'INB-091', po: 'PO-188', supplier: 'BRG Supply', branch: 'Peshawar', expected: 'Today', products: 'BRG E9 Pro × 2', status: 'In Transit' },
  { id: 'INB-088', po: 'PO-181', supplier: 'BRG Supply', branch: 'Peshawar', expected: '28 Aug', products: 'BRG M3 × 2', status: 'Awaiting Receive' },
  { id: 'INB-085', po: 'PO-179', supplier: 'PowerCell Co.', branch: 'Lahore', expected: '25 Aug', products: 'BRG DS11 × 5', status: 'Received' },
  { id: 'INB-082', po: 'PO-175', supplier: 'Apex Motors', branch: 'Islamabad', expected: '20 Aug', products: 'BRG EV-5 × 4', status: 'Received' }
])

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

const filteredDeliveries = computed(() => {
  return deliveries.value.filter(item => {
    if (activeTab.value !== 'All' && item.status.toLowerCase() !== activeTab.value.toLowerCase()) return false
    if (selectedBranch.value !== 'All Branches' && item.branch !== selectedBranch.value) return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = item.id.toLowerCase().includes(q) ||
                    item.po.toLowerCase().includes(q) ||
                    item.supplier.toLowerCase().includes(q) ||
                    item.branch.toLowerCase().includes(q) ||
                    item.products.toLowerCase().includes(q) ||
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
          Branch Manager / Inbound Deliveries / <span class="font-medium text-gray-600">Inbound Deliveries</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Inbound Deliveries</h1>
        <p class="text-xs text-gray-500 mt-1">Supplier deliveries specifically destined for {{ user?.branchName || 'Peshawar' }} Branch, with restricted procurement terms.</p>
      </div>
      <button 
        @click="showReceiveModal = true" 
        class="bg-[#165A31] text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer relative"
      >
        <Plus class="w-4 h-4" /> <span>Receive Supplier Delivery</span>
        <span v-if="pendingIncomingDeliveries.length > 0" class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
          {{ pendingIncomingDeliveries.length }}
        </span>
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
        <!-- Status Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('status')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <span>Status: {{ branchStatusFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openBranchDropdown === 'status'" class="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button 
              v-for="st in ['All', 'Expected', 'In Transit', 'Awaiting Receive', 'Received']"
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
          >
            <span>{{ branchSavedFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openBranchDropdown === 'saved'" class="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button 
              v-for="f in ['All Deliveries', 'Expected Today', 'In Transit', 'Awaiting Receive']" 
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

        <!-- Sub-filter: Supplier Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('supplier')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <span>Supplier: {{ branchSupplierFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openBranchDropdown === 'supplier'" class="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button 
              v-for="s in ['All Suppliers', 'BRG Supply', 'PowerCell Co.']" 
              :key="s"
              @click="branchSupplierFilter = s; openBranchDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
              :class="branchSupplierFilter === s ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ s }}</span>
              <Check v-if="branchSupplierFilter === s" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <!-- Search Input -->
        <div class="relative w-44 sm:w-56 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            v-model="branchSearchQuery"
            type="text" 
            placeholder="Search inbound, PO, supplier..." 
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
              <span>{{ key === 'poRef' ? 'PO Reference' : key }}</span>
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
          @click="exportBranchDeliveries"
          class="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center gap-1.5"
        >
          <span>Export</span>
        </button>
      </div>
    </div>

    <!-- Inbound Deliveries Table Card -->
    <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
      <div class="flex items-center justify-between mb-5">
        <h3 class="text-sm font-bold text-gray-900">Inbound Deliveries</h3>
        <span class="text-xs text-gray-400 font-medium">Showing {{ filteredBranchDeliveries.length }} deliveries</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="text-[10px] font-bold text-gray-400 border-b border-gray-100 pb-3 uppercase tracking-wider">
              <th class="pb-3 w-8"></th>
              <th v-if="branchVisibleColumns.inbound" class="pb-3 font-semibold w-32">Inbound</th>
              <th v-if="branchVisibleColumns.poRef" class="pb-3 font-semibold w-36">PO Reference</th>
              <th v-if="branchVisibleColumns.supplier" class="pb-3 font-semibold w-40">Supplier</th>
              <th v-if="branchVisibleColumns.expected" class="pb-3 font-semibold w-32">Expected</th>
              <th v-if="branchVisibleColumns.products" class="pb-3 font-semibold w-48">Products</th>
              <th v-if="branchVisibleColumns.status" class="pb-3 font-semibold w-36">Status</th>
              <th v-if="branchVisibleColumns.actions" class="pb-3 font-semibold w-24 text-right"></th>
            </tr>
          </thead>
          <tbody class="text-xs divide-y divide-gray-50">
            <template v-for="(item, index) in filteredBranchDeliveries" :key="index">
            <tr 
              class="hover:bg-gray-50/50 transition-colors"
            >
              <td class="py-4 align-middle px-2">
                <button @click.stop="toggleBranchRow(item.inbound)" class="p-1 rounded hover:bg-gray-200 text-gray-400 transition-colors cursor-pointer">
                  <ChevronDown v-if="expandedBranchRows.includes(item.inbound)" class="w-4 h-4" />
                  <ChevronRight v-else class="w-4 h-4" />
                </button>
              </td>
              <td v-if="branchVisibleColumns.inbound" class="py-4 align-middle font-medium text-gray-900 cursor-pointer" @click="router.push(`/inventory/inbound-deliveries/detail?id=${item.inbound}`)">
                {{ item.inbound }}
              </td>
              <td v-if="branchVisibleColumns.poRef" class="py-4 align-middle text-gray-700 font-medium">
                {{ item.poRef }}
              </td>
              <td v-if="branchVisibleColumns.supplier" class="py-4 align-middle text-gray-700 font-medium">
                {{ item.supplier }}
              </td>
              <td v-if="branchVisibleColumns.expected" class="py-4 align-middle text-gray-700 font-medium">
                {{ item.expected }}
              </td>
              <td v-if="branchVisibleColumns.products" class="py-4 align-middle text-gray-700 font-medium">
                {{ item.products }}
              </td>
              <td v-if="branchVisibleColumns.status" class="py-4 align-middle">
                <span class="px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap" :class="item.statusClass">
                  {{ item.status }}
                </span>
              </td>
              <td v-if="branchVisibleColumns.actions" class="py-4 align-middle text-right whitespace-nowrap">
                <button 
                  @click.stop="router.push(`/inventory/inbound-deliveries/detail?id=${item.inbound}`)"
                  class="text-xs font-medium text-gray-400 hover:text-gray-700 cursor-pointer flex items-center justify-end gap-0.5 ml-auto"
                >
                  Open &rsaquo;
                </button>
              </td>
            </tr>
            <!-- Expanded Row Details -->
            <tr v-if="expandedBranchRows.includes(item.inbound)" class="bg-gray-50/30">
              <td :colspan="Object.values(branchVisibleColumns).filter(Boolean).length + 1" class="px-6 py-4 border-b border-gray-100">
                <div class="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                  <div class="px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-700 flex items-center justify-between">
                    <span>Delivery Contents</span>
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
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
            </template>

            <tr v-if="filteredBranchDeliveries.length === 0">
              <td colspan="7" class="text-center py-12 text-gray-500">
                <p class="text-xs font-semibold text-gray-700">No deliveries found matching the filter</p>
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

    <!-- Receive Deliveries Modal -->
    <div v-if="showReceiveModal" class="fixed inset-0 bg-gray-900/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" @click.self="showReceiveModal = false">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div class="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 class="text-lg font-bold text-gray-900">Pending Inbound Deliveries</h2>
            <p class="text-xs text-gray-500 mt-0.5">Supplier shipments arriving at your branch requiring receipt.</p>
          </div>
          <button @click="showReceiveModal = false" class="text-gray-400 hover:text-gray-600 rounded bg-gray-50 hover:bg-gray-100 p-1.5 transition-colors cursor-pointer">
            <X class="w-4 h-4" />
          </button>
        </div>
        <div class="p-5 max-h-[60vh] overflow-y-auto">
          <div v-if="pendingIncomingDeliveries.length === 0" class="text-center py-8">
            <div class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check class="w-5 h-5 text-gray-400" />
            </div>
            <p class="text-sm font-bold text-gray-700">You're all caught up!</p>
            <p class="text-xs text-gray-500 mt-1">No pending inbound deliveries to receive.</p>
          </div>
          <div v-else class="space-y-3">
            <div v-for="t in pendingIncomingDeliveries" :key="t.inbound" class="border border-gray-100 rounded-lg p-4 flex flex-col justify-between gap-4 shadow-sm hover:border-gray-200 transition-colors">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <span class="font-bold text-sm text-gray-900">{{ t.inbound }}</span>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-[#fef3c7] text-[#b45309]">{{ t.poRef }}</span>
                  </div>
                  <div class="text-xs text-gray-500">Supplier: <span class="font-medium text-gray-700">{{ t.supplier }}</span></div>
                  <div class="text-[11px] text-gray-400 mt-1">Expected: <span class="text-gray-600 font-medium">{{ t.expected }}</span></div>
                </div>
                <div class="flex items-center gap-2">
                  <button @click="rejectDelivery(t.inbound)" class="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer">
                    Flag Discrepancy
                  </button>
                  <button v-if="expandedReceive !== t.inbound" @click="expandedReceive = t.inbound" class="px-4 py-1.5 text-xs font-bold text-[#165A31] bg-[#eefcf2] hover:bg-[#dcfce7] rounded-lg transition-colors cursor-pointer border border-[#165A31]/20">
                    Process Receipt
                  </button>
                </div>
              </div>
              
              <!-- Checklist Form -->
              <div v-if="expandedReceive === t.inbound" class="mt-2 border-t border-gray-100 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
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
                    <button @click="acceptDelivery(t.inbound); expandedReceive = null" class="px-5 py-2 text-xs font-bold text-white bg-[#165A31] hover:bg-[#124a28] rounded-lg transition-colors cursor-pointer shadow-sm">
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
  </div>

  <!-- SUPER ADMIN VIEW -->
  <div v-else class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openDropdown = null">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Inventory / <span class="font-bold text-gray-800">Inbound Deliveries</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Inbound Deliveries</h1>
        <p class="text-sm text-gray-500 mt-1">Manage purchase order shipments and direct supplier deliveries across all branches.</p>
      </div>
      <button @click="router.push('/procurement/receipts')" class="px-4 py-2 bg-[#165A31] text-white text-[11px] font-bold rounded-lg hover:bg-[#114a28] transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
        <Plus class="w-4 h-4" /> <span>Receive Purchase</span>
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
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search inbound ID, PO, supplier..." 
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
            <span class="text-[8px] text-gray-400">▼</span>
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
          class="text-[11px] font-semibold text-gray-500 hover:text-red-600 px-2 py-1 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>

    <!-- Table Container -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-[14px] font-bold text-gray-900">Inbound Shipments</h3>
        <span class="text-[11px] font-medium text-gray-500">Showing {{ filteredDeliveries.length }} shipments</span>
      </div>
      
      <div class="overflow-x-auto">
        <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
              <th class="px-5 py-3">Inbound</th>
              <th class="px-5 py-3">PO Reference</th>
              <th class="px-5 py-3">Supplier</th>
              <th class="px-5 py-3">Destination</th>
              <th class="px-5 py-3">Expected</th>
              <th class="px-5 py-3">Products</th>
              <th class="px-5 py-3">Status</th>
              <th class="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr v-for="item in filteredDeliveries" :key="item.id" @click="router.push(`/procurement/receipts/detail`)" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer">
              <td class="px-5 py-4 font-semibold text-gray-900">{{ item.id }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.po }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.supplier }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.branch }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.expected }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.products }}</td>
              <td class="px-5 py-4">
                <span v-if="item.status === 'Received'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">{{ item.status }}</span>
                <span v-else-if="item.status === 'In Transit'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-blue-50 text-blue-600">{{ item.status }}</span>
                <span v-else-if="item.status === 'Awaiting Receive'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-amber-50 text-amber-600">{{ item.status }}</span>
                <span v-else class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-gray-100 text-gray-600">{{ item.status }}</span>
              </td>
              <td class="px-5 py-4 font-semibold text-gray-600 text-right">Receive &rarr;</td>
            </tr>
            <tr v-if="filteredDeliveries.length === 0">
              <td colspan="8" class="text-center py-12 text-gray-500">
                <div class="flex flex-col items-center justify-center">
                  <span class="text-2xl mb-2">🔍</span>
                  <p class="text-sm font-semibold text-gray-700">No inbound deliveries found</p>
                  <p class="text-xs text-gray-400 mt-1">Try adjusting your active tab or search query</p>
                  <button @click="resetFilters" class="mt-3 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors">
                    Reset filters
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table></div>
      </div>
    </div>
  </div>
</template>
