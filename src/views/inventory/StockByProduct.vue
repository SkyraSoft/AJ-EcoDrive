<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search, ChevronDown, Check, Lock, CheckCircle2 } from 'lucide-vue-next'
import { store } from '@/store.js'

const router = useRouter()

const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const showToast = ref(false)
const toastMessage = ref('')

// Branch Manager Data
const branchStockProducts = computed(() => {
  const branchKey = (user.value?.branchName || 'peshawar').toLowerCase()
  return store.products.map(p => {
    const branchQty = typeof p[branchKey] === 'number' ? p[branchKey] : (p.available ?? 0)
    return {
      id: p.id,
      product: p.name || p.product,
      sku: p.sku,
      category: p.category,
      available: branchQty,
      reserved: Math.min(branchQty, p.reserved ?? 0),
      incoming: p.incoming ?? 0,
      reorderLevel: p.reorderLevel || p.reorder || 8
    }
  })
})

const branchKpis = computed(() => {
  const products = branchStockProducts.value
  const lowStock = products.filter(p => p.available < p.reorderLevel && p.available > 0).length
  const outOfStock = products.filter(p => p.available === 0).length
  const totalIncoming = products.reduce((sum, p) => sum + (p.incoming || 0), 0)
  return [
    { label: 'Products', value: String(products.length) },
    { label: 'Low Stock', value: String(lowStock) },
    { label: 'Incoming', value: `${totalIncoming} units` },
    { label: 'Out of Stock', value: String(outOfStock) }
  ]
})

const branchStatusFilter = ref('All')
const branchDateFilter = ref('Date')
const branchSavedFilter = ref('Saved Filters')
const branchCategoryFilter = ref('All Categories')
const branchReorderFilter = ref('All Stock')
const branchSearchQuery = ref('')
const openBranchDropdown = ref(null)

const toggleBranchDropdown = (name) => {
  openBranchDropdown.value = openBranchDropdown.value === name ? null : name
}

const selectBranchSavedFilter = (filterName) => {
  branchSavedFilter.value = filterName
  if (filterName === 'All Products' || filterName === 'Saved Filters') {
    branchStatusFilter.value = 'All'
    branchCategoryFilter.value = 'All Categories'
    branchReorderFilter.value = 'All Stock'
  } else if (filterName === 'Low Stock Alert') {
    branchReorderFilter.value = 'Below Reorder'
  } else if (filterName === 'High Availability') {
    branchReorderFilter.value = 'Healthy Stock'
  }
  openBranchDropdown.value = null
}

const hasActiveBranchFilters = computed(() => {
  return branchStatusFilter.value !== 'All' ||
         branchDateFilter.value !== 'Date' ||
         branchSavedFilter.value !== 'Saved Filters' ||
         branchCategoryFilter.value !== 'All Categories' ||
         branchReorderFilter.value !== 'All Stock' ||
         branchSearchQuery.value.trim() !== ''
})

const clearBranchFilters = () => {
  branchStatusFilter.value = 'All'
  branchDateFilter.value = 'Date'
  branchSavedFilter.value = 'Saved Filters'
  branchCategoryFilter.value = 'All Categories'
  branchReorderFilter.value = 'All Stock'
  branchSearchQuery.value = ''
  openBranchDropdown.value = null
}

const branchVisibleColumns = ref({
  product: true,
  sku: true,
  category: true,
  available: true,
  reserved: true,
  incoming: true,
  reorderLevel: true,
  actions: true
})

const toggleBranchColumn = (col) => {
  branchVisibleColumns.value[col] = !branchVisibleColumns.value[col]
}

const exportBranchStock = () => {
  openBranchDropdown.value = null
  const rows = filteredBranchStock.value
  if (!rows.length) {
    toastMessage.value = 'No stock records match the filter to export'
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 3000)
    return
  }
  const headers = ['Product', 'SKU', 'Category', 'Available', 'Reserved', 'Incoming', 'Reorder Level']
  const csvContent = 'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map(p => [
      `"${(p.product || '').replace(/"/g, '""')}"`,
      `"${(p.sku || '').replace(/"/g, '""')}"`,
      `"${(p.category || '').replace(/"/g, '""')}"`,
      `"${p.available}"`,
      `"${p.reserved}"`,
      `"${p.incoming}"`,
      `"${p.reorderLevel}"`
    ].join(','))].join('\n')
  
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `branch_stock_by_product_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  toastMessage.value = `Exported ${rows.length} stock records to CSV`
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 4000)
}

const filteredBranchStock = computed(() => {
  return branchStockProducts.value.filter(item => {
    if (branchCategoryFilter.value !== 'All Categories' && item.category !== branchCategoryFilter.value) {
      return false
    }
    if (branchReorderFilter.value === 'Below Reorder' && item.available >= item.reorderLevel) {
      return false
    }
    if (branchReorderFilter.value === 'Healthy Stock' && item.available < item.reorderLevel) {
      return false
    }
    if (branchSearchQuery.value.trim()) {
      const q = branchSearchQuery.value.toLowerCase()
      const match = (item.product && item.product.toLowerCase().includes(q)) ||
                    (item.sku && item.sku.toLowerCase().includes(q)) ||
                    (item.category && item.category.toLowerCase().includes(q))
      if (!match) return false
    }
    return true
  })
})

// Super Admin Data
const searchQuery = ref('')
const selectedBranch = ref(store.isBranchUser() ? store.currentUser.branchName : 'All Branches')
const branchOptions = computed(() => store.getBranchOptions())
const selectedCategory = ref('All Categories')
const selectedHealth = ref('All')
const openDropdown = ref(null)

const toggleDropdown = (name) => {
  if (name === 'branch' && isBranchUser.value) return
  openDropdown.value = openDropdown.value === name ? null : name
}

const products = computed(() => {
  return store.products.map(p => ({
    id: p.id,
    product: p.name || p.product,
    sku: p.sku,
    category: p.category,
    total: p.total ?? ((p.available || 0) + (p.reserved || 0)),
    available: p.available ?? 10,
    reserved: p.reserved ?? 2,
    peshawar: p.peshawar ?? 15,
    islamabad: p.islamabad ?? 8,
    lahore: p.lahore ?? 0,
    rawalpindi: p.rawalpindi ?? 0,
    incoming: p.incoming ?? 4,
    reorder: p.reorder || p.reorderLevel || 8,
    value: p.value || (p.price ? (p.price * (p.total || 10) / 1000000).toFixed(1) + 'M' : '5.0M')
  }))
})

const filteredProducts = computed(() => {
  return products.value.filter(item => {
    if (selectedCategory.value !== 'All Categories' && item.category !== selectedCategory.value) {
      return false
    }
    const effectiveBranch = isBranchUser.value ? store.currentUser.branchName : selectedBranch.value
    if (effectiveBranch === 'Peshawar' && item.peshawar === 0) return false
    if (effectiveBranch === 'Islamabad' && item.islamabad === 0) return false
    if (effectiveBranch === 'Lahore' && item.lahore === 0) return false
    if (effectiveBranch === 'Rawalpindi' && item.rawalpindi === 0) return false

    if (selectedHealth.value === 'Below Reorder' && item.available >= item.reorder) return false
    if (selectedHealth.value === 'Healthy Stock' && item.available < item.reorder) return false

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = 
        item.product.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      if (!match) return false
    }

    return true
  })
})

const resetFilters = () => {
  selectedBranch.value = isBranchUser.value ? store.currentUser.branchName : 'All Branches'
  selectedCategory.value = 'All Categories'
  selectedHealth.value = 'All'
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
    <div>
      <div class="text-[11px] text-gray-400 mb-1">
        Branch Manager / Stock by Product / <span class="font-medium text-gray-600">Stock by Product</span>
      </div>
      <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Stock by Product</h1>
      <p class="text-xs text-gray-500 mt-1">Product-level availability, incoming quantities and reorder levels for {{ user?.branchName || 'Peshawar' }} Branch.</p>
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
              v-for="st in ['All', 'Healthy Stock', 'Low Stock', 'Out of Stock']"
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
              v-for="f in ['All Products', 'Low Stock Alert', 'High Availability']"
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

        <!-- Sub-filter: Category Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('category')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <span>Category: {{ branchCategoryFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openBranchDropdown === 'category'" class="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button 
              v-for="c in ['All Categories', 'Passenger Scooter', 'Commercial Loader']"
              :key="c"
              @click="branchCategoryFilter = c; openBranchDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
              :class="branchCategoryFilter === c ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ c }}</span>
              <Check v-if="branchCategoryFilter === c" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <!-- Sub-filter: Reorder Status Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('reorder')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <span>Stock: {{ branchReorderFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openBranchDropdown === 'reorder'" class="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button 
              v-for="r in ['All Stock', 'Below Reorder', 'Healthy Stock']"
              :key="r"
              @click="branchReorderFilter = r; openBranchDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
              :class="branchReorderFilter === r ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ r }}</span>
              <Check v-if="branchReorderFilter === r" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <!-- Search Input -->
        <div class="relative w-44 sm:w-56 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            v-model="branchSearchQuery"
            type="text" 
            placeholder="Search product, SKU..." 
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
              <span>{{ key === 'sku' ? 'SKU' : (key === 'reorderLevel' ? 'Reorder Level' : key) }}</span>
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
          @click="exportBranchStock"
          class="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center gap-1.5"
        >
          <span>Export</span>
        </button>
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
      <div class="flex items-center justify-between mb-5">
        <h3 class="text-sm font-bold text-gray-900">Stock by Product</h3>
        <span class="text-xs text-gray-400 font-medium">Showing {{ filteredBranchStock.length }} products</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="text-[10px] font-bold text-gray-400 border-b border-gray-100 pb-3 uppercase tracking-wider">
              <th v-if="branchVisibleColumns.product" class="pb-3 font-semibold w-48">Product</th>
              <th v-if="branchVisibleColumns.sku" class="pb-3 font-semibold w-40">SKU</th>
              <th v-if="branchVisibleColumns.category" class="pb-3 font-semibold w-36">Category</th>
              <th v-if="branchVisibleColumns.available" class="pb-3 font-semibold w-28">Available</th>
              <th v-if="branchVisibleColumns.reserved" class="pb-3 font-semibold w-28">Reserved</th>
              <th v-if="branchVisibleColumns.incoming" class="pb-3 font-semibold w-28">Incoming</th>
              <th v-if="branchVisibleColumns.reorderLevel" class="pb-3 font-semibold w-32">Reorder Level</th>
              <th v-if="branchVisibleColumns.actions" class="pb-3 font-semibold w-32 text-right"></th>
            </tr>
          </thead>
          <tbody class="text-xs divide-y divide-gray-50">
            <tr 
              v-for="(item, index) in filteredBranchStock" 
              :key="index" 
              class="hover:bg-gray-50/50 transition-colors"
            >
              <td v-if="branchVisibleColumns.product" class="py-4 align-middle font-medium text-gray-800">
                {{ item.product }}
              </td>
              <td v-if="branchVisibleColumns.sku" class="py-4 align-middle text-gray-500 font-medium">
                {{ item.sku }}
              </td>
              <td v-if="branchVisibleColumns.category" class="py-4 align-middle text-gray-600 font-medium">
                {{ item.category }}
              </td>
              <td v-if="branchVisibleColumns.available" class="py-4 align-middle text-gray-700 font-medium">
                {{ item.available }}
              </td>
              <td v-if="branchVisibleColumns.reserved" class="py-4 align-middle text-gray-700 font-medium">
                {{ item.reserved }}
              </td>
              <td v-if="branchVisibleColumns.incoming" class="py-4 align-middle text-gray-700 font-medium">
                {{ item.incoming }}
              </td>
              <td v-if="branchVisibleColumns.reorderLevel" class="py-4 align-middle text-gray-700 font-medium">
                <span :class="item.available < item.reorderLevel ? 'text-amber-600 font-bold' : ''">{{ item.reorderLevel }}</span>
              </td>
              <td v-if="branchVisibleColumns.actions" class="py-4 align-middle text-right whitespace-nowrap">
                <button 
                  @click="$router.push('/inventory/stock-requests')" 
                  class="text-xs font-semibold text-[#165A31] hover:underline cursor-pointer"
                >
                  Request Stock
                </button>
              </td>
            </tr>

            <tr v-if="filteredBranchStock.length === 0">
              <td colspan="8" class="text-center py-12 text-gray-500">
                <p class="text-xs font-semibold text-gray-700">No products found matching the filter</p>
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
        <div class="text-[10px] text-gray-500 mb-1">
          Super Admin / Inventory / <span class="font-bold text-gray-800">Stock by Product</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Stock by Product</h1>
        <p class="text-sm text-gray-500 mt-1">
          Review inventory quantity and value at product and branch level.
        </p>
      </div>
    </div>

    <!-- Filters Toolbar -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-wrap items-center gap-3 flex-1">
        <!-- Search -->
        <div class="relative w-full sm:w-64">
          <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search product / SKU..." 
            class="w-full pl-9 pr-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
          />
        </div>

        <!-- Branch Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleDropdown('branch')"
            class="px-3 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex items-center gap-1.5 hover:bg-gray-50 cursor-pointer"
          >
            <span>{{ selectedBranch }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openDropdown === 'branch'" class="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button 
              v-for="branch in branchOptions" 
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

        <!-- Category Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleDropdown('category')"
            class="px-3 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex items-center gap-1.5 cursor-pointer"
          >
            <span>{{ selectedCategory }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openDropdown === 'category'" class="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button 
              v-for="cat in ['All Categories', 'Passenger Scooter', 'Commercial Loader']"
              :key="cat"
              @click="selectedCategory = cat; openDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
              :class="selectedCategory === cat ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ cat }}</span>
              <Check v-if="selectedCategory === cat" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <!-- Stock Health Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleDropdown('health')"
            class="px-3 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex items-center gap-1.5 cursor-pointer"
          >
            <span>Stock Health: {{ selectedHealth }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openDropdown === 'health'" class="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button 
              v-for="h in ['All', 'Healthy Stock', 'Below Reorder']"
              :key="h"
              @click="selectedHealth = h; openDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
              :class="selectedHealth === h ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ h }}</span>
              <Check v-if="selectedHealth === h" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>
      </div>

      <button 
        v-if="selectedBranch !== 'All Branches' || selectedCategory !== 'All Categories' || selectedHealth !== 'All' || searchQuery"
        @click="resetFilters" 
        class="text-[11px] text-[#165A31] font-semibold hover:underline cursor-pointer"
      >
        Reset Filters
      </button>
    </div>

    <!-- Table Container -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-[14px] font-bold text-gray-900">Stock by Product ({{ filteredProducts.length }})</h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <th class="px-5 py-3">Product</th>
              <th class="px-5 py-3">SKU</th>
              <th class="px-5 py-3">Category</th>
              <th class="px-5 py-3">Total</th>
              <th class="px-5 py-3">Available</th>
              <th class="px-5 py-3">Reserved</th>
              <th class="px-5 py-3">Peshawar</th>
              <th class="px-5 py-3">Islamabad</th>
              <th class="px-5 py-3">Incoming</th>
              <th class="px-5 py-3">Reorder</th>
              <th class="px-5 py-3">Value</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr 
              v-for="item in filteredProducts" 
              :key="item.sku" 
              class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
            >
              <td class="px-5 py-4 font-bold text-gray-900">{{ item.product }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.sku }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.category }}</td>
              <td class="px-5 py-4 text-gray-900 font-bold">{{ item.total }}</td>
              <td class="px-5 py-4 text-[#165A31] font-bold">{{ item.available }}</td>
              <td class="px-5 py-4 text-orange-600 font-medium">{{ item.reserved }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.peshawar }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.islamabad }}</td>
              <td class="px-5 py-4 text-blue-600 font-medium">{{ item.incoming }}</td>
              <td class="px-5 py-4" :class="item.available < item.reorder ? 'text-red-600 font-bold' : 'text-gray-600 font-medium'">
                {{ item.reorder }}
              </td>
              <td class="px-5 py-4 text-gray-900 font-bold">{{ item.value }}</td>
            </tr>

            <!-- Empty State -->
            <tr v-if="filteredProducts.length === 0">
              <td colspan="11" class="text-center py-12 text-gray-500">
                <div class="space-y-2">
                  <p class="text-xs font-semibold text-gray-700">No products match the selected filters</p>
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
</template>
