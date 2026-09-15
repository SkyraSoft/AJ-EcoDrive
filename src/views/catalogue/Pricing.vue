<script setup>
import { ref, computed } from 'vue'
import { Search, ChevronDown, Pencil, Clock } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { store } from '../../store.js'

const router = useRouter()
const showHistory = ref(false)
const selectedHistoryProduct = ref('')

const searchQuery = ref('')
const selectedCategory = ref('All Categories')
const selectedOverride = ref('All Overrides')
const openDropdown = ref(null)

const categories = ['All Categories', 'Electric Bikes', 'Cargo', 'Scooters']
const overrides = ['All Overrides', 'With Override', 'No Override']

const pricingData = ref([
  { product: 'BRG DS11', category: 'Electric Bikes', sellingPrice: '185K', landedCostRef: '146K', markup: '26.7%', margin: '21.1%', minimum: '176K', branchOverride: 'None', effective: 'Aug 01' },
  { product: 'BRG EV-5', category: 'Electric Bikes', sellingPrice: '210K', landedCostRef: '168K', markup: '25.0%', margin: '20.0%', minimum: '198K', branchOverride: 'Peshawar: 205K', effective: 'Aug 10' },
  { product: 'Cargo Pro', category: 'Cargo', sellingPrice: '275K', landedCostRef: '214K', markup: '28.5%', margin: '22.2%', minimum: '260K', branchOverride: 'None', effective: 'Jul 15' },
  { product: 'City Mini E-Scoot', category: 'Scooters', sellingPrice: '125K', landedCostRef: '95K', markup: '31.5%', margin: '24.0%', minimum: '115K', branchOverride: 'Lahore: 120K', effective: 'Aug 15' }
])

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const selectFilter = (type, val) => {
  if (type === 'category') selectedCategory.value = val
  if (type === 'override') selectedOverride.value = val
  openDropdown.value = null
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'All Categories'
  selectedOverride.value = 'All Overrides'
}

const filteredPricing = computed(() => {
  return pricingData.value.filter(item => {
    if (selectedCategory.value !== 'All Categories' && item.category !== selectedCategory.value) return false
    if (selectedOverride.value === 'With Override' && item.branchOverride === 'None') return false
    if (selectedOverride.value === 'No Override' && item.branchOverride !== 'None') return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = item.product.toLowerCase().includes(q) ||
                    item.category.toLowerCase().includes(q) ||
                    item.branchOverride.toLowerCase().includes(q) ||
                    item.sellingPrice.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })
})

const editRule = (rule) => {
  store.originalEditPriceRule = rule
  router.push('/catalogue/pricing/edit')
}

const openHistory = (productName) => {
  selectedHistoryProduct.value = productName
  showHistory.value = true
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openDropdown = null">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Catalogue / <span class="font-bold text-gray-800">Pricing</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Pricing</h1>
        <p class="text-sm text-gray-500 mt-1">Control catalogue selling prices, margin rules and branch overrides.</p>
      </div>
      <button @click="$router.push('/catalogue/pricing/create')" class="bg-[#165A31] text-white text-[11px] font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer">
        + New Price Rule
      </button>
    </div>

    <!-- Filters & Table -->
    <div class="space-y-4">
      <!-- Filter Bar -->
      <div class="flex flex-wrap items-center gap-4">
        <div class="relative w-full sm:w-64 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search product..." 
            class="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-[11px] placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
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

        <!-- Branch Override Dropdown -->
        <div class="relative">
          <button 
            @click.stop="toggleDropdown('override')"
            class="flex items-center gap-2 text-[11px] font-medium text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:bg-gray-50 transition-colors"
            :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedOverride !== 'All Overrides' }"
          >
            <span>{{ selectedOverride }}</span>
            <ChevronDown class="w-3 h-3 text-gray-400" />
          </button>
          <div v-if="openDropdown === 'override'" class="absolute left-0 mt-1 w-40 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
            <button 
              v-for="o in overrides" 
              :key="o" 
              @click.stop="selectFilter('override', o)"
              class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700"
              :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedOverride === o }"
            >
              {{ o }}
            </button>
          </div>
        </div>

        <button 
          v-if="searchQuery || selectedCategory !== 'All Categories' || selectedOverride !== 'All Overrides'" 
          @click="resetFilters" 
          class="text-[11px] font-semibold text-gray-500 hover:text-red-600 px-2 py-1 transition-colors cursor-pointer"
        >
          Clear Filters
        </button>
      </div>

      <!-- Table Container -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-[14px] font-bold text-gray-900">Pricing Matrix</h3>
          <span class="text-[11px] font-medium text-gray-500">Showing {{ filteredPricing.length }} rules</span>
        </div>
        
        <div class="overflow-x-auto">
          <div class="w-full overflow-x-auto"><table class="w-full text-left">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                <th class="px-5 py-3">Product</th>
                <th class="px-5 py-3">Category</th>
                <th class="px-5 py-3">Selling Price</th>
                <th class="px-5 py-3">Landed Cost Ref</th>
                <th class="px-5 py-3">Markup</th>
                <th class="px-5 py-3">Margin</th>
                <th class="px-5 py-3">Minimum</th>
                <th class="px-5 py-3">Branch Override</th>
                <th class="px-5 py-3">Effective</th>
                <th class="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="item in filteredPricing" :key="item.product" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td class="px-5 py-4 font-semibold text-gray-900">{{ item.product }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.category }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.sellingPrice }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.landedCostRef }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.markup }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.margin }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.minimum }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">
                  <span v-if="item.branchOverride !== 'None'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-amber-50 text-amber-600">{{ item.branchOverride }}</span>
                  <span v-else class="text-gray-400">{{ item.branchOverride }}</span>
                </td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.effective }}</td>
                <td class="px-5 py-4 text-right">
                  <div class="flex items-center justify-end gap-3 text-gray-400">
                    <span @click.stop="editRule(item)" title="Edit" class="cursor-pointer hover:text-gray-700 transition-colors"><Pencil class="w-4 h-4" /></span>
                    <span @click.stop="openHistory(item.product)" title="History" class="cursor-pointer hover:text-gray-700 transition-colors"><Clock class="w-4 h-4" /></span>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredPricing.length === 0">
                <td colspan="10" class="text-center py-12 text-gray-500">
                  <div class="flex flex-col items-center justify-center">
                    <span class="text-2xl mb-2">🔍</span>
                    <p class="text-sm font-semibold text-gray-700">No pricing rules found</p>
                    <p class="text-xs text-gray-400 mt-1">Try adjusting your filters or search query</p>
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
  </div>

  <!-- History Modal -->
  <div v-if="showHistory" class="fixed inset-0 bg-gray-900/50 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm" @click.self="showHistory = false">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <div class="flex items-center justify-between p-6 border-b border-gray-100">
        <div>
          <h3 class="text-[18px] font-bold text-gray-900">Pricing History</h3>
          <p class="text-[12px] text-gray-500 mt-1">{{ selectedHistoryProduct }}</p>
        </div>
        <button @click="showHistory = false" class="p-2 text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-100 rounded-full transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="overflow-y-auto p-6">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <th class="px-4 py-3">Date</th>
              <th class="px-4 py-3">Old Price</th>
              <th class="px-4 py-3">New Price</th>
              <th class="px-4 py-3">Changed By</th>
              <th class="px-4 py-3">Reason</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <td class="px-4 py-4 text-gray-900 font-medium">Aug 01, 2026</td>
              <td class="px-4 py-4 text-gray-500">180K</td>
              <td class="px-4 py-4 text-[#165A31] font-bold">185K</td>
              <td class="px-4 py-4 text-gray-600">Super Admin</td>
              <td class="px-4 py-4 text-gray-500">Market adjustment</td>
            </tr>
            <tr class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <td class="px-4 py-4 text-gray-900 font-medium">Jun 15, 2026</td>
              <td class="px-4 py-4 text-gray-500">175K</td>
              <td class="px-4 py-4 text-gray-900 font-bold">180K</td>
              <td class="px-4 py-4 text-gray-600">System</td>
              <td class="px-4 py-4 text-gray-500">Cost increase</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-4 border-t border-gray-100 flex justify-end">
        <button @click="showHistory = false" class="px-5 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          Close
        </button>
      </div>
    </div>
  </div>

  <router-view />
</template>