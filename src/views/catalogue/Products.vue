<script setup>
import { Search, ChevronDown, Eye, Pencil, MoreHorizontal } from 'lucide-vue-next'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../../store.js'

const router = useRouter()

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

const products = ref([
  { name: 'BRG DS11', sku: 'BRG-DS11', category: 'Electric Bikes', subcategory: 'Commuter', model: '2025', tracking: 'Serialized', variants: 'Red, Blue', warranty: '1 Year', motor: '1000W', battery: '72V 20Ah', range: '80km', speed: '60km/h', price: 'PKR 185K', reorderLevel: '10', documents: 'User Manual', activation: 'Active', total: '30', available: '24', reserved: '6', incoming: '5', lowStock: false, status: 'Active' },
  { name: 'BRG EV-5', sku: 'BRG-EVS', category: 'Electric Bikes', subcategory: 'Sports', model: '2025', tracking: 'Serialized', variants: 'Black', warranty: '1 Year', motor: '1500W', battery: '72V 32Ah', range: '100km', speed: '75km/h', price: 'PKR 210K', reorderLevel: '5', documents: 'User Manual', activation: 'Active', total: '13', available: '9', reserved: '2', incoming: '2', lowStock: true, status: 'Active' },
  { name: 'Cargo Pro', sku: 'BRG-CARGO', category: 'Cargo', subcategory: 'Heavy Duty', model: '2025', tracking: 'Serialized', variants: 'Green', warranty: '6 Months', motor: '2000W', battery: '72V 40Ah', range: '120km', speed: '50km/h', price: 'PKR 275K', reorderLevel: '5', documents: 'Manual', activation: 'Active', total: '22', available: '17', reserved: '2', incoming: '3', lowStock: false, status: 'Active' },
  { name: 'City Mini E-Scoot', sku: 'BRG-SCT01', category: 'Scooters', subcategory: 'Lightweight', model: '2025', tracking: 'Serialized', variants: 'White', warranty: '1 Year', motor: '800W', battery: '48V 15Ah', range: '45km', speed: '40km/h', price: 'PKR 125K', reorderLevel: '8', documents: 'Manual', activation: 'Draft', total: '0', available: '0', reserved: '0', incoming: '10', lowStock: false, status: 'Draft' },
  { name: 'BRG DS9 (Legacy)', sku: 'BRG-DS09', category: 'Electric Bikes', subcategory: 'Classic', model: '2023', tracking: 'Serialized', variants: 'Silver', warranty: 'Expired', motor: '750W', battery: '60V 20Ah', range: '50km', speed: '45km/h', price: 'PKR 140K', reorderLevel: '0', documents: 'Archived', activation: 'Archived', total: '2', available: '2', reserved: '0', incoming: '0', lowStock: false, status: 'Archived' }
])

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
      const match = p.name.toLowerCase().includes(q) ||
                    p.sku.toLowerCase().includes(q) ||
                    p.category.toLowerCase().includes(q) ||
                    p.subcategory.toLowerCase().includes(q) ||
                    p.status.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })
})

const editProduct = (product) => {
  store.originalEditProduct = product
  router.push('/catalogue/products/edit')
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
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openDropdown = null; openMenuIndex = null">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Catalogue / <span class="font-bold text-gray-800">Products</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Products</h1>
        <p class="text-sm text-gray-500 mt-1">Manage BRG product masters without creating physical stock.</p>
      </div>
      <button @click="$router.push('/catalogue/products/create')" class="bg-[#165A31] text-white text-[11px] font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer">
        + Create Product
      </button>
    </div>

    <!-- 4 KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <ChevronDown class="w-3 h-3 text-gray-400" />
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
            <ChevronDown class="w-3 h-3 text-gray-400" />
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
          <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse">
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
          </table></div>
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

  <router-view />
</template>