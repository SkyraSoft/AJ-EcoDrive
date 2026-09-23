<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search, ChevronDown, Check, CheckCircle2 } from 'lucide-vue-next'
import { store } from '@/store.js'

const router = useRouter()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const showToast = ref(false)
const toastMessage = ref('')

// Branch Manager Data
const branchKpis = computed(() => {
  const branchName = user.value?.branchName || 'Peshawar'
  const stats = store.getInventoryStats(branchName)
  return [
    { label: 'Units', value: String(stats.serialized) },
    { label: 'Available', value: String(stats.available) },
    { label: 'Reserved', value: String(stats.reserved) },
    { label: 'QC / Service', value: String(stats.qcHold + stats.maintenance) }
  ]
})

const branchSerializedUnits = computed(() => {
  const branchName = user.value?.branchName || 'Peshawar'
  return store.serializedUnits
    .filter(u => !u.branch || u.branch === branchName || u.branch.toLowerCase().includes(branchName.toLowerCase()))
    .map(u => ({
      id: u.id || u.serial,
      serial: u.serial || u.id,
      product: u.product || 'BRG DS11',
      location: u.location || 'Showroom',
      status: u.status || 'Available',
      statusClass: u.status === 'Available' ? 'bg-[#dcfce7] text-[#165A31]' : (u.status === 'Reserved' ? 'bg-[#e0e7ff] text-[#3730a3]' : 'bg-amber-50 text-amber-700'),
      customer: u.customer || '—',
      source: u.source || u.sourcePo || 'Transfer TR-209'
    }))
})

const branchStatusFilter = ref('All')
const branchDateFilter = ref('Date')
const branchSavedFilter = ref('Saved Filters')
const branchProductFilter = ref('All Products')
const branchLocationFilter = ref('All Locations')
const branchSearchQuery = ref('')
const openBranchDropdown = ref(null)

const toggleBranchDropdown = (name) => {
  openBranchDropdown.value = openBranchDropdown.value === name ? null : name
}

const selectBranchSavedFilter = (filterName) => {
  branchSavedFilter.value = filterName
  if (filterName === 'All Units' || filterName === 'Saved Filters') {
    branchStatusFilter.value = 'All'
    branchProductFilter.value = 'All Products'
    branchLocationFilter.value = 'All Locations'
  } else if (filterName === 'Available in Showroom') {
    branchStatusFilter.value = 'Available'
    branchLocationFilter.value = 'Showroom'
  } else if (filterName === 'Reserved Units') {
    branchStatusFilter.value = 'Reserved'
  } else if (filterName === 'QC Hold') {
    branchStatusFilter.value = 'QC Hold'
  }
  openBranchDropdown.value = null
}

const hasActiveBranchFilters = computed(() => {
  return branchStatusFilter.value !== 'All' ||
         branchDateFilter.value !== 'Date' ||
         branchSavedFilter.value !== 'Saved Filters' ||
         branchProductFilter.value !== 'All Products' ||
         branchLocationFilter.value !== 'All Locations' ||
         branchSearchQuery.value.trim() !== ''
})

const clearBranchFilters = () => {
  branchStatusFilter.value = 'All'
  branchDateFilter.value = 'Date'
  branchSavedFilter.value = 'Saved Filters'
  branchProductFilter.value = 'All Products'
  branchLocationFilter.value = 'All Locations'
  branchSearchQuery.value = ''
  openBranchDropdown.value = null
}

const branchVisibleColumns = ref({
  serial: true,
  product: true,
  location: true,
  status: true,
  customer: true,
  source: true,
  actions: true
})

const toggleBranchColumn = (col) => {
  branchVisibleColumns.value[col] = !branchVisibleColumns.value[col]
}

const exportBranchUnits = () => {
  openBranchDropdown.value = null
  const rows = filteredBranchUnits.value
  if (!rows.length) {
    toastMessage.value = 'No units match the filter to export'
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 3000)
    return
  }
  const headers = ['Serial / Chassis', 'Product', 'Location', 'Status', 'Order / Customer', 'Source']
  const csvContent = 'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map(u => [
      `"${(u.serial || '').replace(/"/g, '""')}"`,
      `"${(u.product || '').replace(/"/g, '""')}"`,
      `"${(u.location || '').replace(/"/g, '""')}"`,
      `"${(u.status || '').replace(/"/g, '""')}"`,
      `"${(u.customer || '').replace(/"/g, '""')}"`,
      `"${(u.source || '').replace(/"/g, '""')}"`
    ].join(','))].join('\n')
  
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `branch_serialized_units_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  toastMessage.value = `Exported ${rows.length} unit records to CSV`
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 4000)
}

const filteredBranchUnits = computed(() => {
  return branchSerializedUnits.value.filter(item => {
    if (branchStatusFilter.value !== 'All' && item.status.toLowerCase() !== branchStatusFilter.value.toLowerCase()) {
      return false
    }
    if (branchProductFilter.value !== 'All Products' && item.product !== branchProductFilter.value) {
      return false
    }
    if (branchLocationFilter.value !== 'All Locations' && item.location !== branchLocationFilter.value) {
      return false
    }
    if (branchSearchQuery.value.trim()) {
      const q = branchSearchQuery.value.toLowerCase()
      const match = (item.serial && item.serial.toLowerCase().includes(q)) ||
                    (item.product && item.product.toLowerCase().includes(q)) ||
                    (item.location && item.location.toLowerCase().includes(q)) ||
                    (item.customer && item.customer.toLowerCase().includes(q)) ||
                    (item.source && item.source.toLowerCase().includes(q)) ||
                    (item.status && item.status.toLowerCase().includes(q))
      if (!match) return false
    }
    return true
  })
})

// Super Admin Data
const searchQuery = ref('')
const selectedBranch = ref('All Branches')
const selectedStatus = ref('All Statuses')
const selectedProduct = ref('All Products')
const openDropdown = ref(null)

const branches = ['All Branches', 'Peshawar', 'Islamabad', 'Lahore']
const statuses = ['All Statuses', 'Available', 'Reserved', 'QC Hold']
const products = ['All Products', 'BRG DS11', 'BRG EV-5']

const serializedUnits = computed(() => {
  return store.serializedUnits.map(u => ({
    id: u.id || u.serial,
    serial: u.serial || u.id,
    chassis: u.chassis || 'CH-90111',
    product: u.product || 'BRG DS11',
    branch: u.branch || 'Peshawar',
    location: u.location || 'Main Showroom',
    sourcePo: u.sourcePo || u.source || 'PO-2048',
    landedCost: u.landedCost || '183.4K',
    status: u.status || 'Available',
    customer: u.customer || '—',
    order: u.order || '—'
  }))
})

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const selectFilter = (type, val) => {
  if (type === 'branch') selectedBranch.value = val
  if (type === 'status') selectedStatus.value = val
  if (type === 'product') selectedProduct.value = val
  openDropdown.value = null
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedBranch.value = 'All Branches'
  selectedStatus.value = 'All Statuses'
  selectedProduct.value = 'All Products'
}

const filteredUnits = computed(() => {
  return serializedUnits.value.filter(item => {
    if (selectedBranch.value !== 'All Branches' && item.branch !== selectedBranch.value) return false
    if (selectedStatus.value !== 'All Statuses' && item.status !== selectedStatus.value) return false
    if (selectedProduct.value !== 'All Products' && item.product !== selectedProduct.value) return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = item.serial.toLowerCase().includes(q) ||
                    item.chassis.toLowerCase().includes(q) ||
                    item.product.toLowerCase().includes(q) ||
                    item.branch.toLowerCase().includes(q) ||
                    item.location.toLowerCase().includes(q) ||
                    item.sourcePo.toLowerCase().includes(q) ||
                    item.customer.toLowerCase().includes(q) ||
                    item.order.toLowerCase().includes(q) ||
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
    <!-- Toast Notification -->
    <div 
      v-if="showToast" 
      class="fixed bottom-5 right-5 z-[110] bg-[#165A31] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200"
    >
      <CheckCircle2 class="w-5 h-5 text-green-300" />
      <span class="text-xs font-bold">{{ toastMessage }}</span>
    </div>

    <!-- Header -->
    <div>
      <div class="text-[11px] text-gray-400 mb-1">
        Branch Manager / Serialized Units / <span class="font-medium text-gray-600">Serialized Units</span>
      </div>
      <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Serialized Units</h1>
      <p class="text-xs text-gray-500 mt-1">Individual chassis / serial units assigned to {{ user?.branchName || 'Peshawar' }} Branch.</p>
    </div>

    <!-- 4 KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="(kpi, index) in branchKpis" :key="index" class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <div class="text-xs font-semibold text-gray-400 mb-3">{{ kpi.label }}</div>
        <div class="text-[26px] font-bold text-gray-900 leading-tight">{{ kpi.value }}</div>
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
          <div v-if="openBranchDropdown === 'status'" class="absolute top-full left-0 mt-1 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button 
              v-for="st in ['All', 'Available', 'Reserved', 'QC Hold']"
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
              v-for="f in ['All Units', 'Available in Showroom', 'Reserved Units', 'QC Hold']"
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

        <!-- Sub-filter: Product Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('product')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <span>Product: {{ branchProductFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openBranchDropdown === 'product'" class="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button 
              v-for="p in ['All Products', 'BRG E9 Pro', 'BRG X5', 'BRG DS11', 'BRG EV-5']"
              :key="p"
              @click="branchProductFilter = p; openBranchDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
              :class="branchProductFilter === p ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ p }}</span>
              <Check v-if="branchProductFilter === p" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <!-- Sub-filter: Location Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('location')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <span>Location: {{ branchLocationFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openBranchDropdown === 'location'" class="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button 
              v-for="loc in ['All Locations', 'Showroom', 'Warehouse Bay 2', 'Service Bay']"
              :key="loc"
              @click="branchLocationFilter = loc; openBranchDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
              :class="branchLocationFilter === loc ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ loc }}</span>
              <Check v-if="branchLocationFilter === loc" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <!-- Search Input -->
        <div class="relative w-44 sm:w-56 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            v-model="branchSearchQuery"
            type="text" 
            placeholder="Search serial, chassis, product..." 
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
              <span>{{ key === 'serial' ? 'Serial / Chassis' : (key === 'customer' ? 'Order / Customer' : key) }}</span>
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
          @click="exportBranchUnits"
          class="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center gap-1.5"
        >
          <span>Export</span>
        </button>
      </div>
    </div>

    <!-- Table Card: Serialized Unit Register -->
    <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
      <div class="flex items-center justify-between mb-5">
        <h3 class="text-sm font-bold text-gray-900">Serialized Unit Register</h3>
        <span class="text-xs text-gray-400 font-medium">Showing {{ filteredBranchUnits.length }} units</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="text-[10px] font-bold text-gray-400 border-b border-gray-100 pb-3 uppercase tracking-wider">
              <th v-if="branchVisibleColumns.serial" class="pb-3 font-semibold">Serial / Chassis</th>
              <th v-if="branchVisibleColumns.product" class="pb-3 font-semibold">Product</th>
              <th v-if="branchVisibleColumns.location" class="pb-3 font-semibold">Location</th>
              <th v-if="branchVisibleColumns.status" class="pb-3 font-semibold">Status</th>
              <th v-if="branchVisibleColumns.customer" class="pb-3 font-semibold">Order / Customer</th>
              <th v-if="branchVisibleColumns.source" class="pb-3 font-semibold">Source</th>
              <th v-if="branchVisibleColumns.actions" class="pb-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="text-xs divide-y divide-gray-50">
            <tr 
              v-for="(unit, index) in filteredBranchUnits" 
              :key="index" 
              @click="$router.push(`/inventory/serialized-units/${unit.serial || unit.id}`)"
              class="hover:bg-gray-50/50 transition-colors cursor-pointer"
            >
              <td v-if="branchVisibleColumns.serial" class="py-4 align-middle font-medium text-gray-800">
                {{ unit.serial }}
              </td>
              <td v-if="branchVisibleColumns.product" class="py-4 align-middle text-gray-800 font-medium">
                {{ unit.product }}
              </td>
              <td v-if="branchVisibleColumns.location" class="py-4 align-middle text-gray-600 font-medium">
                {{ unit.location }}
              </td>
              <td v-if="branchVisibleColumns.status" class="py-4 align-middle">
                <span class="px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap" :class="unit.statusClass">
                  {{ unit.status }}
                </span>
              </td>
              <td v-if="branchVisibleColumns.customer" class="py-4 align-middle text-gray-600 font-medium">
                {{ unit.customer }}
              </td>
              <td v-if="branchVisibleColumns.source" class="py-4 align-middle text-gray-600 font-medium">
                {{ unit.source }}
              </td>
              <td v-if="branchVisibleColumns.actions" class="py-4 align-middle text-right whitespace-nowrap">
                <button class="text-xs font-medium text-gray-400 hover:text-gray-700 cursor-pointer flex items-center justify-end gap-0.5 ml-auto">
                  Open &rsaquo;
                </button>
              </td>
            </tr>

            <tr v-if="filteredBranchUnits.length === 0">
              <td colspan="7" class="text-center py-12 text-gray-500">
                <p class="text-xs font-semibold text-gray-700">No units found matching the filter</p>
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

  <!-- SUPER ADMIN VIEW -->
  <div v-else class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openDropdown = null">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Inventory / <span class="font-bold text-gray-800">Serialized Units</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Serialized Units</h1>
        <p class="text-sm text-gray-500 mt-1">Search and manage exact physical BRG units by serial and chassis.</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-3">
      <div class="relative w-full sm:w-72">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <Search class="h-4 w-4" />
        </span>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Serial, chassis, product, customer, order..." 
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
        <div v-if="openDropdown === 'branch'" class="absolute left-0 mt-1 w-40 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
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
      
      <!-- Status Dropdown -->
      <div class="relative">
        <button 
          @click.stop="toggleDropdown('status')"
          class="px-3 py-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex items-center gap-2"
          :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedStatus !== 'All Statuses' }"
        >
          <span>{{ selectedStatus }}</span>
          <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
        </button>
        <div v-if="openDropdown === 'status'" class="absolute left-0 mt-1 w-40 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
          <button 
            v-for="s in statuses" 
            :key="s" 
            @click.stop="selectFilter('status', s)"
            class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700"
            :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedStatus === s }"
          >
            {{ s }}
          </button>
        </div>
      </div>

      <!-- Product Dropdown -->
      <div class="relative">
        <button 
          @click.stop="toggleDropdown('product')"
          class="px-3 py-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex items-center gap-2"
          :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedProduct !== 'All Products' }"
        >
          <span>{{ selectedProduct }}</span>
          <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
        </button>
        <div v-if="openDropdown === 'product'" class="absolute left-0 mt-1 w-40 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
          <button 
            v-for="p in products" 
            :key="p" 
            @click.stop="selectFilter('product', p)"
            class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700"
            :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedProduct === p }"
          >
            {{ p }}
          </button>
        </div>
      </div>

      <button 
        v-if="searchQuery || selectedBranch !== 'All Branches' || selectedStatus !== 'All Statuses' || selectedProduct !== 'All Products'" 
        @click="resetFilters" 
        class="text-[11px] font-semibold text-gray-500 hover:text-red-600 px-2 py-1 transition-colors"
      >
        Clear Filters
      </button>
    </div>

    <!-- Table Container -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-[14px] font-bold text-gray-900">Serialized Units</h3>
        <span class="text-[11px] font-medium text-gray-500">Showing {{ filteredUnits.length }} units</span>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
              <th class="px-5 py-3">Serial</th>
              <th class="px-5 py-3">Chassis</th>
              <th class="px-5 py-3">Product</th>
              <th class="px-5 py-3">Branch</th>
              <th class="px-5 py-3">Location</th>
              <th class="px-5 py-3">Source PO</th>
              <th class="px-5 py-3">Landed Cost</th>
              <th class="px-5 py-3">Status</th>
              <th class="px-5 py-3">Customer</th>
              <th class="px-5 py-3">Order</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr v-for="(item, i) in filteredUnits" :key="i" @click="$router.push(`/inventory/serialized-units/${item.serial || item.id}`)" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer">
              <td class="px-5 py-4 font-semibold text-gray-900">{{ item.serial }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.chassis }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.product }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.branch }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.location }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.sourcePo }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.landedCost }}</td>
              <td class="px-5 py-4">
                <span v-if="item.status === 'Available'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">{{ item.status }}</span>
                <span v-else-if="item.status === 'Reserved'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-orange-50 text-orange-600">{{ item.status }}</span>
                <span v-else-if="item.status === 'QC Hold'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-amber-50 text-amber-600">{{ item.status }}</span>
                <span v-else class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-gray-100 text-gray-600">{{ item.status }}</span>
              </td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.customer }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.order }}</td>
            </tr>
            <tr v-if="filteredUnits.length === 0">
              <td colspan="10" class="text-center py-12 text-gray-500">
                <div class="flex flex-col items-center justify-center">
                  <span class="text-2xl mb-2">🔍</span>
                  <p class="text-sm font-semibold text-gray-700">No serialized units found</p>
                  <p class="text-xs text-gray-400 mt-1">Try adjusting your search query or filter options</p>
                  <button @click="resetFilters" class="mt-3 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors">
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
</template>
