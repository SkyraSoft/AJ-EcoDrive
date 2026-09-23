<script setup>
import { ref, computed } from 'vue'
import { ChevronDown, Search, Check, CheckCircle2 } from 'lucide-vue-next'
import { store } from '../../store.js'

const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const showToast = ref(false)
const toastMessage = ref('')

// Branch Manager Data
const branchKpis = [
  { label: 'Today', value: '18 movements' },
  { label: 'Receipts', value: '4' },
  { label: 'Sales', value: '7' },
  { label: 'Transfers', value: '5' }
]

const branchMovements = ref([
  {
    time: '10:18',
    unitProduct: 'E9P-00881',
    movement: 'Sale',
    from: 'Showroom',
    to: 'Customer',
    reference: 'ORD-3842',
    user: 'Hamza'
  },
  {
    time: '09:41',
    unitProduct: 'M3-01014',
    movement: 'Receipt',
    from: 'In Transit',
    to: 'QC Bay',
    reference: 'TR-221',
    user: 'Sami'
  },
  {
    time: '08:30',
    unitProduct: 'DS11-00991',
    movement: 'Transfer Out',
    from: 'Showroom',
    to: 'Islamabad Branch',
    reference: 'TR-219',
    user: 'Bilal Khan'
  },
  {
    time: 'Yesterday',
    unitProduct: 'EV5-00412',
    movement: 'Adjustment',
    from: 'QC Bay',
    to: 'Showroom',
    reference: 'ADJ-104',
    user: 'Ahsan'
  }
])

const branchStatusFilter = ref('All')
const branchDateFilter = ref('Date')
const branchSavedFilter = ref('Saved Filters')
const branchMovementTypeFilter = ref('All Types')
const branchLocationFilter = ref('All Locations')
const branchSearchQuery = ref('')
const openBranchDropdown = ref(null)

const toggleBranchDropdown = (name) => {
  openBranchDropdown.value = openBranchDropdown.value === name ? null : name
}

const selectBranchSavedFilter = (filterName) => {
  branchSavedFilter.value = filterName
  if (filterName === 'All Movements' || filterName === 'Saved Filters') {
    branchMovementTypeFilter.value = 'All Types'
    branchLocationFilter.value = 'All Locations'
  } else if (filterName === 'Sales Out') {
    branchMovementTypeFilter.value = 'Sale'
  } else if (filterName === 'Stock Receipts') {
    branchMovementTypeFilter.value = 'Receipt'
  } else if (filterName === 'Branch Transfers') {
    branchMovementTypeFilter.value = 'Transfer Out'
  }
  openBranchDropdown.value = null
}

const hasActiveBranchFilters = computed(() => {
  return branchStatusFilter.value !== 'All' ||
         branchDateFilter.value !== 'Date' ||
         branchSavedFilter.value !== 'Saved Filters' ||
         branchMovementTypeFilter.value !== 'All Types' ||
         branchLocationFilter.value !== 'All Locations' ||
         branchSearchQuery.value.trim() !== ''
})

const clearBranchFilters = () => {
  branchStatusFilter.value = 'All'
  branchDateFilter.value = 'Date'
  branchSavedFilter.value = 'Saved Filters'
  branchMovementTypeFilter.value = 'All Types'
  branchLocationFilter.value = 'All Locations'
  branchSearchQuery.value = ''
  openBranchDropdown.value = null
}

const branchVisibleColumns = ref({
  time: true,
  unitProduct: true,
  movement: true,
  from: true,
  to: true,
  reference: true,
  user: true
})

const toggleBranchColumn = (col) => {
  branchVisibleColumns.value[col] = !branchVisibleColumns.value[col]
}

const exportBranchMovements = () => {
  openBranchDropdown.value = null
  const rows = filteredBranchMovements.value
  if (!rows.length) {
    toastMessage.value = 'No movements match the filter to export'
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 3000)
    return
  }
  const headers = ['Time', 'Unit / Product', 'Movement', 'From', 'To', 'Reference', 'User']
  const csvContent = 'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map(m => [
      `"${(m.time || '').replace(/"/g, '""')}"`,
      `"${(m.unitProduct || '').replace(/"/g, '""')}"`,
      `"${(m.movement || '').replace(/"/g, '""')}"`,
      `"${(m.from || '').replace(/"/g, '""')}"`,
      `"${(m.to || '').replace(/"/g, '""')}"`,
      `"${(m.reference || '').replace(/"/g, '""')}"`,
      `"${(m.user || '').replace(/"/g, '""')}"`
    ].join(','))].join('\n')
  
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `branch_stock_movements_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  toastMessage.value = `Exported ${rows.length} movement records to CSV`
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 4000)
}

const filteredBranchMovements = computed(() => {
  return branchMovements.value.filter(item => {
    if (branchMovementTypeFilter.value !== 'All Types' && item.movement !== branchMovementTypeFilter.value) {
      return false
    }
    if (branchLocationFilter.value !== 'All Locations' && item.from !== branchLocationFilter.value && item.to !== branchLocationFilter.value) {
      return false
    }
    if (branchSearchQuery.value.trim()) {
      const q = branchSearchQuery.value.toLowerCase()
      const match = (item.unitProduct && item.unitProduct.toLowerCase().includes(q)) ||
                    (item.movement && item.movement.toLowerCase().includes(q)) ||
                    (item.from && item.from.toLowerCase().includes(q)) ||
                    (item.to && item.to.toLowerCase().includes(q)) ||
                    (item.reference && item.reference.toLowerCase().includes(q)) ||
                    (item.user && item.user.toLowerCase().includes(q))
      if (!match) return false
    }
    return true
  })
})

// Super Admin Data
const searchQuery = ref('')
const selectedBranch = ref('All Branches')
const selectedType = ref('All Types')
const selectedDate = ref('All Dates')
const openDropdown = ref(null)

const branches = ['All Branches', 'Peshawar', 'Islamabad', 'Lahore', 'Main Showroom', 'QC Area']
const movementTypes = ['All Types', 'QC → Available', 'Supplier Receipt', 'Transfer Dispatch', 'Sale']
const dates = ['All Dates', 'Aug 29', 'Aug 27', 'Aug 25']

const ledgerItems = ref([
  { time: 'Aug 29 15:04', unit: 'DS11-01001', movement: 'QC → Available', from: 'QC Area', to: 'Main Showroom', reference: 'GR-991', user: 'Ahsan Khan' },
  { time: 'Aug 29 14:32', unit: 'DS11-01001', movement: 'Supplier Receipt', from: 'Supplier', to: 'Peshawar', reference: 'GR-991', user: 'Ahsan Khan' },
  { time: 'Aug 27 16:20', unit: 'DS11-00971', movement: 'Transfer Dispatch', from: 'Islamabad', to: 'In Transit', reference: 'TR-119', user: 'Hassan Ali' },
  { time: 'Aug 27 11:18', unit: 'DS11-00988', movement: 'Sale', from: 'Islamabad', to: 'Customer', reference: 'SO-7731', user: 'Hamza Ali' },
  { time: 'Aug 25 10:15', unit: 'EVS-00441', movement: 'Supplier Receipt', from: 'Supplier', to: 'Lahore', reference: 'GR-988', user: 'Bilal Khan' }
])

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const selectFilter = (type, val) => {
  if (type === 'branch') selectedBranch.value = val
  if (type === 'movementType') selectedType.value = val
  if (type === 'date') selectedDate.value = val
  openDropdown.value = null
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedBranch.value = 'All Branches'
  selectedType.value = 'All Types'
  selectedDate.value = 'All Dates'
}

const filteredLedger = computed(() => {
  return ledgerItems.value.filter(item => {
    if (selectedBranch.value !== 'All Branches' && item.from !== selectedBranch.value && item.to !== selectedBranch.value) return false
    if (selectedType.value !== 'All Types' && item.movement !== selectedType.value) return false
    if (selectedDate.value !== 'All Dates' && !item.time.startsWith(selectedDate.value)) return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = item.unit.toLowerCase().includes(q) ||
                    item.movement.toLowerCase().includes(q) ||
                    item.from.toLowerCase().includes(q) ||
                    item.to.toLowerCase().includes(q) ||
                    item.reference.toLowerCase().includes(q) ||
                    item.user.toLowerCase().includes(q) ||
                    item.time.toLowerCase().includes(q)
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
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[11px] text-gray-400 mb-1">
          Branch Manager / Stock Movements / <span class="font-medium text-gray-600">Stock Movement Ledger</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Stock Movement Ledger</h1>
        <p class="text-xs text-gray-500 mt-1">Immutable ledger for receipts, sales, transfers and adjustments at {{ user?.branchName || 'Peshawar' }} Branch.</p>
      </div>
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
          <div v-if="openBranchDropdown === 'status'" class="absolute top-full left-0 mt-1 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button 
              v-for="st in ['All', 'Completed', 'Pending', 'In Transit']"
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
              v-for="f in ['All Movements', 'Sales Out', 'Stock Receipts', 'Branch Transfers']" 
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

        <!-- Sub-filter: Movement Type Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('movementType')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <span>Type: {{ branchMovementTypeFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openBranchDropdown === 'movementType'" class="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button 
              v-for="m in ['All Types', 'Sale', 'Receipt', 'Transfer Out', 'Adjustment']" 
              :key="m"
              @click="branchMovementTypeFilter = m; openBranchDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
              :class="branchMovementTypeFilter === m ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ m }}</span>
              <Check v-if="branchMovementTypeFilter === m" class="w-3.5 h-3.5 text-[#165A31]" />
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
              v-for="loc in ['All Locations', 'Showroom', 'QC Bay', 'In Transit', 'Customer']" 
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
            placeholder="Search unit, reference, user..." 
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
              <span>{{ key === 'unitProduct' ? 'Unit / Product' : key }}</span>
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
          @click="exportBranchMovements"
          class="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center gap-1.5"
        >
          <span>Export</span>
        </button>
      </div>
    </div>

    <!-- Movement Ledger Table Card -->
    <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
      <div class="flex items-center justify-between mb-5">
        <h3 class="text-sm font-bold text-gray-900">Movement Ledger</h3>
        <span class="text-xs text-gray-400 font-medium">Showing {{ filteredBranchMovements.length }} movements</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="text-[10px] font-bold text-gray-400 border-b border-gray-100 pb-3 uppercase tracking-wider">
              <th v-if="branchVisibleColumns.time" class="pb-3 font-semibold w-28">Time</th>
              <th v-if="branchVisibleColumns.unitProduct" class="pb-3 font-semibold w-40">Unit / Product</th>
              <th v-if="branchVisibleColumns.movement" class="pb-3 font-semibold w-36">Movement</th>
              <th v-if="branchVisibleColumns.from" class="pb-3 font-semibold w-36">From</th>
              <th v-if="branchVisibleColumns.to" class="pb-3 font-semibold w-36">To</th>
              <th v-if="branchVisibleColumns.reference" class="pb-3 font-semibold w-36">Reference</th>
              <th v-if="branchVisibleColumns.user" class="pb-3 font-semibold w-28">User</th>
            </tr>
          </thead>
          <tbody class="text-xs divide-y divide-gray-50">
            <tr 
              v-for="(item, index) in filteredBranchMovements" 
              :key="index" 
              class="hover:bg-gray-50/50 transition-colors"
            >
              <td v-if="branchVisibleColumns.time" class="py-4 align-middle text-gray-700 font-medium">
                {{ item.time }}
              </td>
              <td v-if="branchVisibleColumns.unitProduct" class="py-4 align-middle font-medium text-gray-900">
                {{ item.unitProduct }}
              </td>
              <td v-if="branchVisibleColumns.movement" class="py-4 align-middle text-gray-700 font-medium">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold" :class="item.movement === 'Sale' ? 'bg-[#dcfce7] text-[#165A31]' : (item.movement === 'Receipt' ? 'bg-[#dbeafe] text-[#2563eb]' : 'bg-gray-100 text-gray-700')">
                  {{ item.movement }}
                </span>
              </td>
              <td v-if="branchVisibleColumns.from" class="py-4 align-middle text-gray-700 font-medium">
                {{ item.from }}
              </td>
              <td v-if="branchVisibleColumns.to" class="py-4 align-middle text-gray-700 font-medium">
                {{ item.to }}
              </td>
              <td v-if="branchVisibleColumns.reference" class="py-4 align-middle text-gray-700 font-medium">
                {{ item.reference }}
              </td>
              <td v-if="branchVisibleColumns.user" class="py-4 align-middle text-gray-700 font-medium">
                {{ item.user }}
              </td>
            </tr>

            <tr v-if="filteredBranchMovements.length === 0">
              <td colspan="7" class="text-center py-12 text-gray-500">
                <p class="text-xs font-semibold text-gray-700">No movements found matching the filter</p>
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
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Inventory / <span class="font-bold text-gray-800">Stock Movement Ledger</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Stock Movement Ledger</h1>
        <p class="text-sm text-gray-500 mt-1">Immutable-style operational history of every inventory movement.</p>
      </div>
    </div>

    <!-- Filters Toolbar -->
    <div class="flex flex-wrap items-center gap-3">
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
          placeholder="Serial, SKU, reference..." 
          class="w-full pl-9 pr-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
        />
      </div>

      <!-- Branch Dropdown -->
      <div class="relative">
        <button 
          @click.stop="toggleDropdown('branch')"
          class="px-3 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex items-center gap-1"
          :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedBranch !== 'All Branches' }"
        >
          <span>{{ selectedBranch }}</span> <span class="text-[8px] text-gray-400">▼</span>
        </button>
        <div v-if="openDropdown === 'branch'" class="absolute left-0 mt-1 w-44 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
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
    </div>

    <!-- Table Container -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-[14px] font-bold text-gray-900">Movement Ledger</h3>
        <span class="text-[11px] font-medium text-gray-500">Showing {{ filteredLedger.length }} records</span>
      </div>
      
      <div class="overflow-x-auto">
        <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
              <th class="px-5 py-3">Time</th>
              <th class="px-5 py-3">Unit / Product</th>
              <th class="px-5 py-3">Movement</th>
              <th class="px-5 py-3">From</th>
              <th class="px-5 py-3">To</th>
              <th class="px-5 py-3">Reference</th>
              <th class="px-5 py-3">User</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr v-for="(item, i) in filteredLedger" :key="i" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <td class="px-5 py-4 font-semibold text-gray-900">{{ item.time }}</td>
              <td class="px-5 py-4 text-gray-900 font-medium">{{ item.unit }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.movement }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.from }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.to }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.reference }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.user }}</td>
            </tr>
          </tbody>
        </table></div>
      </div>
    </div>
  </div>
</template>
