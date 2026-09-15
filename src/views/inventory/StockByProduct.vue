<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search, ChevronDown, Check } from 'lucide-vue-next'

const router = useRouter()

const searchQuery = ref('')
const selectedBranch = ref('All Branches')
const selectedCategory = ref('All Categories')
const selectedHealth = ref('All')
const openDropdown = ref(null)

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const products = ref([
  { product: 'BRG DS11', sku: 'BRG-DS11', category: 'Passenger Scooter', total: 51, available: 34, reserved: 9, peshawar: 36, islamabad: 11, incoming: 7, reorder: 8, value: '6.4M' },
  { product: 'BRG EV-5', sku: 'BRG-EV5', category: 'Passenger Scooter', total: 29, available: 18, reserved: 5, peshawar: 13, islamabad: 9, incoming: 6, reorder: 10, value: '4.8M' },
  { product: 'Cargo Pro', sku: 'BRG-CARGO', category: 'Commercial Loader', total: 31, available: 22, reserved: 4, peshawar: 23, islamabad: 5, incoming: 5, reorder: 6, value: '6.7M' },
  { product: 'Eco Rider 3', sku: 'BRG-ER3', category: 'Passenger Scooter', total: 12, available: 4, reserved: 3, peshawar: 8, islamabad: 4, incoming: 10, reorder: 8, value: '2.1M' },
  { product: 'Cargo Mini', sku: 'BRG-CMINI', category: 'Commercial Loader', total: 18, available: 15, reserved: 1, peshawar: 10, islamabad: 8, incoming: 0, reorder: 5, value: '3.2M' }
])

const filteredProducts = computed(() => {
  return products.value.filter(item => {
    // Category Filter
    if (selectedCategory.value !== 'All Categories' && item.category !== selectedCategory.value) {
      return false
    }

    // Branch Filter
    if (selectedBranch.value === 'Peshawar' && item.peshawar === 0) return false
    if (selectedBranch.value === 'Islamabad' && item.islamabad === 0) return false

    // Stock Health Filter
    if (selectedHealth.value === 'Below Reorder' && item.available >= item.reorder) return false
    if (selectedHealth.value === 'Healthy Stock' && item.available < item.reorder) return false

    // Search Query
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
  selectedBranch.value = 'All Branches'
  selectedCategory.value = 'All Categories'
  selectedHealth.value = 'All'
  searchQuery.value = ''
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openDropdown = null">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Inventory / <span class="font-bold text-gray-800">Stock by Product</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Stock by Product</h1>
        <p class="text-sm text-gray-500 mt-1">Review inventory quantity and value at product and branch level.</p>
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
            class="px-3 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex items-center gap-1.5 cursor-pointer"
          >
            <span>{{ selectedBranch }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openDropdown === 'branch'" class="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button 
              v-for="branch in ['All Branches', 'Peshawar', 'Islamabad']"
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
