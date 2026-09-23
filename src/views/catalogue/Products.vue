<script setup>
import { Search, ChevronDown, Eye, Pencil, MoreHorizontal, Plus, Check, CheckCircle2 } from 'lucide-vue-next'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../../store.js'
import CreateProduct from './CreateProduct.vue'
import EditProduct from './EditProduct.vue'

const router = useRouter()
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showToast = ref(false)
const toastMessage = ref('')

const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

// Branch Manager Data
const branchKpis = [
  { label: 'Active Products', value: '38' },
  { label: 'Available Units', value: '46' },
  { label: 'Reserved', value: '7' },
  { label: 'Low Stock', value: '6', sub: 'Needs stock' }
]

const branchProducts = computed(() => {
  return store.products.map(p => {
    let available = typeof p.stock === 'number' ? p.stock : (parseInt(String(p.stock || '12').replace(/[^0-9]/g, '')) || 12)
    let reserved = 2
    let incoming = 4
    let reorderLevel = 5
    let poorStockThreshold = 90
    let daysUnsold = 10

    let status = p.status || 'Available'
    let statusClass = p.statusClass || 'bg-[#dcfce7] text-[#165A31]'

    if (available === 0) {
      status = 'Out of Stock'
      statusClass = 'bg-red-50 text-red-600'
    } else if (available <= reorderLevel) {
      status = 'Low Stock'
      statusClass = 'bg-[#fef3c7] text-[#b45309]'
    }

    return {
      ...p,
      sku: p.sku || 'SKU-001',
      category: p.category || 'Electric Scooters',
      price: typeof p.price === 'string' ? p.price : `PKR ${(p.price || 240000).toLocaleString()}`,
      available,
      reserved,
      incoming,
      reorderLevel,
      poorStockThreshold,
      daysUnsold,
      status,
      statusClass
    }
  })
})

const openBranchMenuIndex = ref(null)

const toggleBranchMenu = (index, event) => {
  event.stopPropagation()
  openBranchMenuIndex.value = openBranchMenuIndex.value === index ? null : index
}

const forceBranchStatus = (sku, overrideType) => {
  const p = rawBranchProducts.value.find(item => item.sku === sku)
  if (!p) return

  if (overrideType === 'Low Stock') {
    p.reorderLevel = p.available
    toastMessage.value = `Threshold updated to ${p.available}. Marked as Low Stock.`
  } else if (overrideType === 'Poor Stock') {
    p.poorStockThreshold = p.daysUnsold
    toastMessage.value = `Threshold updated to ${p.daysUnsold} days. Marked as Poor Stock.`
  }
  
  openBranchMenuIndex.value = null
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 4000)
}

// Branch Manager Filter State
const branchStatusFilter = ref('All')
const branchDateFilter = ref('Date')
const branchSavedFilter = ref('Saved Filters')
const branchCategoryFilter = ref('All Categories')
const branchStockFilter = ref('All Stock')
const branchPriceFilter = ref('All Prices')
const branchSearchQuery = ref('')
const openBranchDropdown = ref(null)

const toggleBranchDropdown = (name) => {
  openBranchDropdown.value = openBranchDropdown.value === name ? null : name
}

const selectBranchSavedFilter = (filterName) => {
  branchSavedFilter.value = filterName
  if (filterName === 'All Products' || filterName === 'Saved Filters') {
    branchStatusFilter.value = 'All'
    branchStockFilter.value = 'All Stock'
    branchCategoryFilter.value = 'All Categories'
    branchPriceFilter.value = 'All Prices'
  } else if (filterName === 'Low Stock Alert') {
    branchStatusFilter.value = 'Low Stock'
    branchStockFilter.value = 'Low Stock (<=6)'
  } else if (filterName === 'High Availability') {
    branchStatusFilter.value = 'Available'
    branchStockFilter.value = 'High Stock (>10)'
  } else if (filterName === 'Incoming Stock') {
    branchStockFilter.value = 'Incoming Units'
  }
  openBranchDropdown.value = null
}

const hasActiveBranchFilters = computed(() => {
  return branchStatusFilter.value !== 'All' ||
         branchDateFilter.value !== 'Date' ||
         branchSavedFilter.value !== 'Saved Filters' ||
         branchCategoryFilter.value !== 'All Categories' ||
         branchStockFilter.value !== 'All Stock' ||
         branchPriceFilter.value !== 'All Prices' ||
         branchSearchQuery.value.trim() !== ''
})

const clearBranchFilters = () => {
  branchStatusFilter.value = 'All'
  branchDateFilter.value = 'Date'
  branchSavedFilter.value = 'Saved Filters'
  branchCategoryFilter.value = 'All Categories'
  branchStockFilter.value = 'All Stock'
  branchPriceFilter.value = 'All Prices'
  branchSearchQuery.value = ''
  openBranchDropdown.value = null
}

// Columns Visibility
const branchVisibleColumns = ref({
  product: true,
  sku: true,
  category: true,
  price: true,
  available: true,
  reserved: true,
  incoming: true,
  status: true,
  actions: true
})

const toggleBranchColumn = (col) => {
  branchVisibleColumns.value[col] = !branchVisibleColumns.value[col]
}

const exportBranchProducts = () => {
  openBranchDropdown.value = null
  const rows = filteredBranchProducts.value
  if (!rows.length) {
    toastMessage.value = 'No products match the filter to export'
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 3000)
    return
  }
  const headers = ['Product', 'SKU', 'Category', 'Selling Price', 'Available', 'Reserved', 'Incoming', 'Status']
  const csvContent = 'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map(p => [
      `"${(p.name || '').replace(/"/g, '""')}"`,
      `"${(p.sku || '').replace(/"/g, '""')}"`,
      `"${(p.category || '').replace(/"/g, '""')}"`,
      `"${(p.price || '').replace(/"/g, '""')}"`,
      `"${p.available}"`,
      `"${p.reserved}"`,
      `"${p.incoming}"`,
      `"${(p.status || '').replace(/"/g, '""')}"`
    ].join(','))].join('\n')
  
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `branch_products_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  toastMessage.value = `Exported ${rows.length} product records to CSV`
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 4000)
}

const filteredBranchProducts = computed(() => {
  return branchProducts.value.filter(p => {
    if (branchStatusFilter.value !== 'All' && p.status.toLowerCase() !== branchStatusFilter.value.toLowerCase()) return false
    if (branchCategoryFilter.value !== 'All Categories' && p.category && p.category !== branchCategoryFilter.value) return false
    if (branchStockFilter.value === 'Low Stock (<=6)' && p.available > 6) return false
    if (branchStockFilter.value === 'High Stock (>10)' && p.available <= 10) return false
    if (branchStockFilter.value === 'Incoming Units' && p.incoming <= 0) return false
    if (branchPriceFilter.value === 'Under PKR 500k') {
      const num = parseInt((p.price || '').replace(/[^0-9]/g, '')) || 0
      if (num >= 500000) return false
    } else if (branchPriceFilter.value === 'Above PKR 500k') {
      const num = parseInt((p.price || '').replace(/[^0-9]/g, '')) || 0
      if (num < 500000) return false
    }
    if (branchSearchQuery.value.trim()) {
      const q = branchSearchQuery.value.toLowerCase()
      const match = p.name.toLowerCase().includes(q) ||
                    p.sku.toLowerCase().includes(q) ||
                    (p.category && p.category.toLowerCase().includes(q)) ||
                    (p.price && p.price.toLowerCase().includes(q))
      if (!match) return false
    }
    return true
  })
})

// Super Admin Data
const kpis = [
  { label: 'Products', value: '134' },
  { label: 'Active', value: '126' },
  { label: 'Draft', value: '4' },
  { label: 'Low Stock', value: '9' }
]

const activeStatusTab = ref('All')
const statusTabs = ['All', 'Active', 'Draft', 'Archived']
const searchQuery = ref('')
const selectedCategory = ref('All Categories')
const selectedStockStatus = ref('All Stock')
const openDropdown = ref(null)

const categories = ['All Categories', 'Electric Bikes', 'Cargo', 'Scooters']
const stockStatuses = ['All Stock', 'Low Stock Only', 'Healthy Stock']

const products = computed(() => {
  return store.products.map(p => ({
    ...p,
    subcategory: p.subcategory || 'Standard',
    model: p.model || '2026',
    tracking: 'Serialized',
    variants: p.variants || 'Standard',
    warranty: p.warranty || '2 Years',
    motor: p.motor || '1200W',
    battery: p.battery || '72V 30Ah',
    range: p.range || '85km',
    speed: p.speed || '65km/h',
    price: typeof p.price === 'string' ? p.price : `PKR ${(p.price || 280000).toLocaleString()}`,
    reorderLevel: '5',
    documents: 'User Manual',
    activation: p.status || 'Active',
    total: typeof p.stock === 'number' ? String(p.stock) : (p.stock || '18 units'),
    available: typeof p.stock === 'number' ? String(p.stock) : (p.stock || '18 units'),
    reserved: '2',
    incoming: '4',
    lowStock: p.status === 'Low Stock' || (typeof p.stock === 'number' && p.stock <= 5),
    status: p.status || 'Active'
  }))
})

const showArchiveModal = ref(false)
const selectedProductToArchive = ref(null)
const openMenuIndex = ref(null)

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const selectFilter = (type, val) => {
  if (type === 'category') selectedCategory.value = val
  if (type === 'stock') selectedStockStatus.value = val
  openDropdown.value = null
}

const toggleMenu = (index, event) => {
  event.stopPropagation()
  openMenuIndex.value = openMenuIndex.value === index ? null : index
}

const clearFilters = () => {
  activeStatusTab.value = 'All'
  searchQuery.value = ''
  selectedCategory.value = 'All Categories'
  selectedStockStatus.value = 'All Stock'
}

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    if (activeStatusTab.value !== 'All' && p.status.toLowerCase() !== activeStatusTab.value.toLowerCase()) return false
    if (selectedCategory.value !== 'All Categories' && p.category !== selectedCategory.value) return false
    if (selectedStockStatus.value === 'Low Stock Only' && !p.lowStock) return false
    if (selectedStockStatus.value === 'Healthy Stock' && p.lowStock) return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = (p.name && p.name.toLowerCase().includes(q)) ||
                    (p.sku && p.sku.toLowerCase().includes(q)) ||
                    (p.category && p.category.toLowerCase().includes(q)) ||
                    (p.status && p.status.toLowerCase().includes(q))
      if (!match) return false
    }
    return true
  })
})

const editProduct = (product) => {
  store.originalEditProduct = product
  showEditModal.value = true
}

const openArchiveModal = (product, event) => {
  event.stopPropagation()
  selectedProductToArchive.value = product
  showArchiveModal.value = true
  openMenuIndex.value = null
}

const closeArchiveModal = () => {
  showArchiveModal.value = false
  selectedProductToArchive.value = null
}

const confirmArchive = () => {
  if (selectedProductToArchive.value) {
    selectedProductToArchive.value.status = 'Archived'
  }
  closeArchiveModal()
}
</script>

<template>
  <!-- BRANCH MANAGER VIEW -->
  <div v-if="isBranchUser" class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openBranchDropdown = null; openBranchMenuIndex = null">
    <!-- Toast Notification -->
    <div 
      v-if="showToast" 
      class="fixed bottom-5 right-5 z-[110] bg-[#165A31] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200"
    >
      <CheckCircle2 class="w-5 h-5 text-green-300" />
      <span class="text-xs font-bold">{{ toastMessage }}</span>
    </div>

    <!-- Branch Manager Header -->
    <div>
      <div class="text-[11px] text-gray-400 mb-1">
        Branch Manager / Products / <span class="font-medium text-gray-600">Products</span>
      </div>
      <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Products</h1>
      <p class="text-xs text-gray-500 mt-1">Global active catalogue visible for selling, with {{ user?.branchName || 'Peshawar' }} Branch availability.</p>
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
        <!-- Status Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('status')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <span>Status: {{ branchStatusFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div 
            v-if="openBranchDropdown === 'status'" 
            class="absolute top-full left-0 mt-1 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <button 
              v-for="st in ['All', 'Available', 'Low Stock', 'Out of Stock']" 
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
          <div 
            v-if="openBranchDropdown === 'date'" 
            class="absolute top-full left-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
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
          <div 
            v-if="openBranchDropdown === 'saved'" 
            class="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <button 
              v-for="f in ['All Products', 'Low Stock Alert', 'High Availability', 'Incoming Stock']" 
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

        <!-- Page Sub-filter: Category Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('category')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <span>Category: {{ branchCategoryFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div 
            v-if="openBranchDropdown === 'category'" 
            class="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <button 
              v-for="c in ['All Categories', 'Electric Bikes', 'Cargo', 'Scooters']" 
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

        <!-- Page Sub-filter: Stock Level Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('stock')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <span>Stock: {{ branchStockFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div 
            v-if="openBranchDropdown === 'stock'" 
            class="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <button 
              v-for="s in ['All Stock', 'High Stock (>10)', 'Low Stock (<=6)', 'Incoming Units']" 
              :key="s"
              @click="branchStockFilter = s; openBranchDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
              :class="branchStockFilter === s ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ s }}</span>
              <Check v-if="branchStockFilter === s" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <!-- Page Sub-filter: Price Range Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('price')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <span>Price: {{ branchPriceFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div 
            v-if="openBranchDropdown === 'price'" 
            class="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <button 
              v-for="pr in ['All Prices', 'Under PKR 500k', 'Above PKR 500k']" 
              :key="pr"
              @click="branchPriceFilter = pr; openBranchDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
              :class="branchPriceFilter === pr ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ pr }}</span>
              <Check v-if="branchPriceFilter === pr" class="w-3.5 h-3.5 text-[#165A31]" />
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

        <!-- Clear Filters Button -->
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
              <span>{{ key === 'sku' ? 'SKU' : (key === 'actions' ? 'Actions' : key) }}</span>
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
          @click="exportBranchProducts"
          class="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center gap-1.5"
        >
          <span>Export</span>
        </button>
      </div>
    </div>

    <!-- Branch Product Catalogue Table -->
    <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
      <div class="flex items-center justify-between mb-5">
        <h3 class="text-sm font-bold text-gray-900">Branch Product Catalogue</h3>
        <span class="text-xs text-gray-400 font-medium">Showing {{ filteredBranchProducts.length }} products</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="text-[10px] font-bold text-gray-400 border-b border-gray-100 pb-3 uppercase tracking-wider">
              <th v-if="branchVisibleColumns.product" class="pb-3 font-semibold">Product</th>
              <th v-if="branchVisibleColumns.sku" class="pb-3 font-semibold">SKU</th>
              <th v-if="branchVisibleColumns.category" class="pb-3 font-semibold">Category</th>
              <th v-if="branchVisibleColumns.price" class="pb-3 font-semibold">Selling Price</th>
              <th v-if="branchVisibleColumns.available" class="pb-3 font-semibold">Available</th>
              <th v-if="branchVisibleColumns.reserved" class="pb-3 font-semibold">Reserved</th>
              <th v-if="branchVisibleColumns.incoming" class="pb-3 font-semibold">Incoming</th>
              <th v-if="branchVisibleColumns.status" class="pb-3 font-semibold">Status</th>
              <th v-if="branchVisibleColumns.actions" class="pb-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="text-xs divide-y divide-gray-50">
            <tr 
              v-for="(product, index) in filteredBranchProducts" 
              :key="index" 
              @click="$router.push('/catalogue/products/detail')"
              class="hover:bg-gray-50/50 transition-colors cursor-pointer"
            >
              <td v-if="branchVisibleColumns.product" class="py-4 align-middle font-medium text-gray-800">
                {{ product.name }}
              </td>
              <td v-if="branchVisibleColumns.sku" class="py-4 align-middle text-gray-500 font-medium">
                {{ product.sku }}
              </td>
              <td v-if="branchVisibleColumns.category" class="py-4 align-middle text-gray-600 font-medium">
                {{ product.category }}
              </td>
              <td v-if="branchVisibleColumns.price" class="py-4 align-middle text-gray-700 font-medium">
                {{ product.price }}
              </td>
              <td v-if="branchVisibleColumns.available" class="py-4 align-middle text-gray-700 font-medium">
                {{ product.available }}
              </td>
              <td v-if="branchVisibleColumns.reserved" class="py-4 align-middle text-gray-700 font-medium">
                {{ product.reserved }}
              </td>
              <td v-if="branchVisibleColumns.incoming" class="py-4 align-middle text-gray-700 font-medium">
                {{ product.incoming }}
              </td>
              <td v-if="branchVisibleColumns.status" class="py-4 align-middle">
                <span class="px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap" :class="product.statusClass">
                  {{ product.status }}
                </span>
              </td>
              <td v-if="branchVisibleColumns.actions" class="py-4 align-middle text-right whitespace-nowrap relative">
                <button @click.stop="toggleBranchMenu(index, $event)" class="text-xs font-medium text-gray-400 hover:text-gray-700 cursor-pointer flex items-center justify-end gap-0.5 ml-auto">
                  <MoreHorizontal class="w-4 h-4" />
                </button>
                <div v-if="openBranchMenuIndex === index" class="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-100 rounded-lg shadow-xl z-50 text-left overflow-hidden">
                  <button @click.stop="$router.push('/catalogue/products/detail')" class="w-full px-4 py-2 text-[11px] font-bold text-gray-700 hover:bg-gray-50 text-left">
                    View Details
                  </button>
                  <button @click.stop="forceBranchStatus(product.sku, 'Low Stock')" class="w-full px-4 py-2 text-[11px] font-bold text-amber-600 hover:bg-amber-50 text-left border-t border-gray-50">
                    Mark as Low Stock
                  </button>
                  <button @click.stop="forceBranchStatus(product.sku, 'Poor Stock')" class="w-full px-4 py-2 text-[11px] font-bold text-gray-600 hover:bg-gray-100 text-left border-t border-gray-50">
                    Mark as Poor Stock
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="filteredBranchProducts.length === 0">
              <td colspan="9" class="text-center py-12 text-gray-500">
                <p class="text-xs font-semibold text-gray-700">No products found matching the filter</p>
                <p class="text-[11px] text-gray-400 mt-1">Change the search, category, availability or price filters.</p>
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
  <div v-else class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openDropdown = null; openMenuIndex = null">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Catalogue / <span class="font-bold text-gray-800">Products</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Products</h1>
        <p class="text-sm text-gray-500 mt-1">Manage BRG product masters without creating physical stock.</p>
      </div>
      <button @click="showCreateModal = true" class="bg-[#165A31] text-white text-[11px] font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer">
        <Plus class="w-4 h-4" /> <span>Create Product</span>
      </button>
    </div>

    <!-- 4 KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="(kpi, index) in kpis" :key="index" class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[88px]">
        <div class="text-[11px] font-semibold text-gray-400">{{ kpi.label }}</div>
        <div class="text-[22px] font-bold text-gray-900 leading-none">{{ kpi.value }}</div>
      </div>
    </div>

    <!-- Filters & Table -->
    <div class="space-y-4">
      <!-- Filter Bar -->
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
          <button 
            v-for="tab in statusTabs" 
            :key="tab"
            @click="activeStatusTab = tab"
            class="px-4 py-1.5 text-[11px] font-bold rounded transition-colors cursor-pointer"
            :class="activeStatusTab === tab ? 'bg-[#eefcf2] text-[#165A31]' : 'text-gray-500 hover:text-gray-900'"
          >
            {{ tab }}
          </button>
        </div>

        <div class="relative w-full sm:w-72 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
          <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search product / SKU..." 
            class="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-[11px] placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
          />
        </div>

        <!-- Category Dropdown -->
        <div class="relative">
          <button 
            @click.stop="toggleDropdown('category')"
            class="flex items-center gap-2 text-[11px] font-medium text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:bg-gray-50 transition-colors"
            :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedCategory !== 'All Categories' }"
          >
            <span>{{ selectedCategory }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openDropdown === 'category'" class="absolute left-0 mt-1 w-44 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
            <button 
              v-for="c in categories" 
              :key="c" 
              @click.stop="selectFilter('category', c)"
              class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700"
              :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedCategory === c }"
            >
              {{ c }}
            </button>
          </div>
        </div>

        <!-- Stock Status Dropdown -->
        <div class="relative">
          <button 
            @click.stop="toggleDropdown('stock')"
            class="flex items-center gap-2 text-[11px] font-medium text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:bg-gray-50 transition-colors"
            :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedStockStatus !== 'All Stock' }"
          >
            <span>{{ selectedStockStatus }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openDropdown === 'stock'" class="absolute left-0 mt-1 w-44 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
            <button 
              v-for="st in stockStatuses" 
              :key="st" 
              @click.stop="selectFilter('stock', st)"
              class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700"
              :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedStockStatus === st }"
            >
              {{ st }}
            </button>
          </div>
        </div>

        <button 
          v-if="searchQuery || activeStatusTab !== 'All' || selectedCategory !== 'All Categories' || selectedStockStatus !== 'All Stock'" 
          @click="clearFilters" 
          class="text-[11px] font-semibold text-gray-500 hover:text-red-600 px-2 py-1 transition-colors cursor-pointer"
        >
          Clear Filters
        </button>
      </div>

      <!-- Table Container -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-[14px] font-bold text-gray-900">Product Catalogue</h3>
          <span class="text-[11px] font-medium text-gray-500">Showing {{ filteredProducts.length }} products</span>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th class="px-5 py-3">Product</th>
                <th class="px-5 py-3">SKU</th>
                <th class="px-5 py-3">Category</th>
                <th class="px-5 py-3">Selling Price</th>
                <th class="px-5 py-3">Total</th>
                <th class="px-5 py-3">Available</th>
                <th class="px-5 py-3">Reserved</th>
                <th class="px-5 py-3">Incoming</th>
                <th class="px-5 py-3">Low Stock</th>
                <th class="px-5 py-3">Status</th>
                <th class="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody v-if="filteredProducts.length > 0" class="text-[11px]">
              <tr v-for="(product, index) in filteredProducts" :key="product.sku" @click="$router.push('/catalogue/products/detail')" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer relative">
                <td class="px-5 py-4 font-bold text-gray-900">{{ product.name }}</td>
                <td class="px-5 py-4 text-gray-500 font-medium">{{ product.sku }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ product.category }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ product.price }}</td>
                <td class="px-5 py-4 font-semibold text-gray-800">{{ product.total }}</td>
                <td class="px-5 py-4 font-semibold text-gray-800">{{ product.available }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ product.reserved }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ product.incoming }}</td>
                <td class="px-5 py-4">
                  <span v-if="product.lowStock" class="inline-flex items-center px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold bg-amber-50 text-amber-600">
                    Low
                  </span>
                  <span v-else class="text-gray-300 font-medium">&mdash;</span>
                </td>
                <td class="px-5 py-4">
                  <span v-if="product.status === 'Active'" class="inline-flex items-center px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold bg-[#eefcf2] text-[#165A31]">
                    {{ product.status }}
                  </span>
                  <span v-else-if="product.status === 'Draft'" class="inline-flex items-center px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold bg-amber-50 text-amber-600">
                    {{ product.status }}
                  </span>
                  <span v-else class="inline-flex items-center px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold bg-gray-100 text-gray-600">
                    {{ product.status }}
                  </span>
                </td>
                <td class="px-5 py-4 text-right text-gray-400 font-bold tracking-widest relative" @click.stop>
                  <div class="flex items-center justify-end gap-3 text-gray-400">
                    <button @click="$router.push('/catalogue/products/detail')" title="Open" class="hover:text-gray-700 transition-colors focus:outline-none"><Eye class="w-4 h-4" /></button>
                    <button @click="editProduct(product)" title="Edit" class="hover:text-gray-700 transition-colors focus:outline-none"><Pencil class="w-4 h-4" /></button>
                    <button @click="(e) => toggleMenu(index, e)" title="More" class="hover:text-gray-700 transition-colors focus:outline-none">
                      <MoreHorizontal class="w-4 h-4" />
                    </button>
                  </div>
                  
                  <!-- Dropdown Menu -->
                  <div v-if="openMenuIndex === index" class="absolute right-5 top-12 w-48 bg-white border border-gray-100 rounded-lg shadow-lg z-10 py-1 text-left text-[11px] font-medium text-gray-700 tracking-normal normal-case">
                    <div @click="$router.push('/inventory/stock-by-product')" class="px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors">View stock by branch</div>
                    <div @click="$router.push('/inventory/serialized-units')" class="px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors">View serialized units</div>
                    <div class="border-t border-gray-100 my-1"></div>
                    <div @click="(e) => openArchiveModal(product, e)" class="px-4 py-2 hover:bg-red-50 text-red-500 cursor-pointer transition-colors">Archive product</div>
                  </div>
                </td>
              </tr>
            </tbody>
            
            <tbody v-else>
              <tr>
                <td colspan="11">
                  <div class="py-16 flex flex-col items-center justify-center text-center">
                    <div class="w-12 h-12 bg-[#eefcf2] rounded-xl flex items-center justify-center mb-4">
                      <Search class="w-5 h-5 text-[#165A31]" />
                    </div>
                    <h3 class="text-[14px] font-bold text-gray-900 mb-1">No matching results</h3>
                    <p class="text-[11px] text-gray-500 mb-4 max-w-sm">Try changing the search, status filter, category or stock status.</p>
                    <button @click="clearFilters" class="px-4 py-1.5 text-[11px] font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer">
                      Clear filters
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Footer Note -->
      <div class="text-[9px] text-gray-400 font-medium px-2 pb-6">
        Product creation does not create stock. Physical inventory appears only through receiving, transfer receipt, accepted return or controlled opening inventory.
      </div>
    </div>
    
    <!-- Archive Modal Overlay -->
    <div v-if="showArchiveModal" class="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <div class="bg-white rounded-[12px] shadow-xl w-full max-w-[400px] mx-4 overflow-hidden border border-gray-100">
        <div class="p-6">
          <div class="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center mb-4">
            <span class="text-red-500 font-bold text-lg">!</span>
          </div>
          <h3 class="text-[16px] font-bold text-gray-900 mb-2">Archive product?</h3>
          <p class="text-[11px] text-gray-500 leading-relaxed">
            This product will no longer be available for new sales or procurement selection. Existing historical records remain intact.
          </p>
        </div>
        <div class="px-6 py-4 bg-[#fbfbfc] flex items-center justify-end gap-3 border-t border-gray-50">
          <button @click="closeArchiveModal" class="px-4 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            Cancel
          </button>
          <button @click="confirmArchive" class="px-4 py-2 text-[11px] font-bold text-red-500 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            Archive product
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Create & Edit Product Modal Popups -->
  <CreateProduct v-if="showCreateModal" @close="showCreateModal = false" />
  <EditProduct v-if="showEditModal" @close="showEditModal = false" />

  <router-view />
</template>