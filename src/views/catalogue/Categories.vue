<script setup>
import { Eye, Pencil, MoreHorizontal, Plus } from 'lucide-vue-next'
import { ref, computed } from 'vue'
import CreateCategory from './CreateCategory.vue'

const showCreateModal = ref(false)
const searchQuery = ref('')
const selectedStatus = ref('All Statuses')
const openDropdown = ref(null)

const statuses = ['All Statuses', 'Active', 'Archived']

const kpis = [
  { label: 'Categories', value: '8' },
  { label: 'Subcategories', value: '23' },
  { label: 'Active Products', value: '126' },
  { label: 'Archived', value: '4' }
]

const categories = ref([
  { name: 'Electric Bikes', subcategories: '4', products: '48', template: 'E-Bike Specs', status: 'Active' },
  { name: 'Scooters', subcategories: '3', products: '27', template: 'Scooter Specs', status: 'Active' },
  { name: 'Cargo', subcategories: '2', products: '18', template: 'Cargo Specs', status: 'Active' },
  { name: 'Accessories', subcategories: '7', products: '33', template: 'Accessory Specs', status: 'Active' },
  { name: 'Batteries & Cells', subcategories: '3', products: '12', template: 'Battery Specs', status: 'Active' },
  { name: 'Legacy Components', subcategories: '4', products: '4', template: 'General Specs', status: 'Archived' }
])

const templates = [
  { name: 'E-Bike', specs: 'Motor · Battery · Range · Speed' },
  { name: 'Cargo', specs: 'Payload · Bed · Motor · Range' },
  { name: 'Scooter', specs: 'Motor · Battery · Tyres · Range' },
  { name: 'Battery', specs: 'Voltage · Capacity · Cells · Chemistry' }
]

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const selectStatus = (status) => {
  selectedStatus.value = status
  openDropdown.value = null
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = 'All Statuses'
}

const filteredCategories = computed(() => {
  return categories.value.filter(item => {
    if (selectedStatus.value !== 'All Statuses' && item.status !== selectedStatus.value) return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = item.name.toLowerCase().includes(q) ||
                    item.template.toLowerCase().includes(q) ||
                    item.status.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })
})
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openDropdown = null">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Catalogue / <span class="font-bold text-gray-800">Categories</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Categories</h1>
        <p class="text-sm text-gray-500 mt-1">Manage BRG category hierarchy, subcategories and specification templates.</p>
      </div>
      <button @click="showCreateModal = true" class="bg-[#165A31] text-white text-[11px] font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer">
        <Plus class="w-4 h-4" /> <span>Add Category</span>
      </button>
    </div>

    <!-- 4 KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="(kpi, index) in kpis" :key="index" class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[88px]">
        <div class="text-[11px] font-semibold text-gray-400">{{ kpi.label }}</div>
        <div class="text-[22px] font-bold text-gray-900 leading-none">{{ kpi.value }}</div>
      </div>
    </div>

    <!-- Filters Bar -->
    <div class="flex flex-wrap items-center gap-3">
      <div class="relative w-full sm:w-64">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search category, template..." 
          class="w-full pl-9 pr-3 py-1.5 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
        />
      </div>

      <!-- Status Dropdown -->
      <div class="relative">
        <button 
          @click.stop="toggleDropdown('status')"
          class="px-3 py-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex items-center gap-2"
          :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedStatus !== 'All Statuses' }"
        >
          <span>{{ selectedStatus }}</span>
          <span class="text-[8px] text-gray-400">▼</span>
        </button>
        <div v-if="openDropdown === 'status'" class="absolute left-0 mt-1 w-36 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
          <button 
            v-for="s in statuses" 
            :key="s" 
            @click.stop="selectStatus(s)"
            class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700"
            :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedStatus === s }"
          >
            {{ s }}
          </button>
        </div>
      </div>

      <button 
        v-if="searchQuery || selectedStatus !== 'All Statuses'" 
        @click="resetFilters" 
        class="text-[11px] font-semibold text-gray-500 hover:text-red-600 px-2 py-1 transition-colors"
      >
        Clear Filters
      </button>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      <!-- Left Card: Category Hierarchy -->
      <div class="lg:col-span-7 bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-[14px] font-bold text-gray-900">Category Hierarchy</h3>
          <span class="text-[11px] font-medium text-gray-500">Showing {{ filteredCategories.length }} categories</span>
        </div>
        
        <div class="overflow-x-auto p-5 pt-0">
          <div class="w-full overflow-x-auto"><table class="w-full text-left">
            <thead>
              <tr class="border-b border-gray-100 text-[10px] font-bold text-gray-400 tracking-wider">
                <th class="py-3 font-semibold">Category</th>
                <th class="py-3 font-semibold">Subcategories</th>
                <th class="py-3 font-semibold">Products</th>
                <th class="py-3 font-semibold">Template</th>
                <th class="py-3 font-semibold">Status</th>
                <th class="py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="category in filteredCategories" :key="category.name" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td class="py-4 font-semibold text-gray-900">{{ category.name }}</td>
                <td class="py-4 text-gray-600 font-medium">{{ category.subcategories }}</td>
                <td class="py-4 text-gray-600 font-medium">{{ category.products }}</td>
                <td class="py-4 text-gray-600 font-medium">{{ category.template }}</td>
                <td class="py-4">
                  <span v-if="category.status === 'Active'" class="inline-flex items-center px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold bg-[#eefcf2] text-[#165A31]">
                    {{ category.status }}
                  </span>
                  <span v-else class="inline-flex items-center px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold bg-gray-100 text-gray-600">
                    {{ category.status }}
                  </span>
                </td>
                <td class="py-4 text-right text-gray-400 font-bold tracking-widest hover:text-gray-600 cursor-pointer">
                  <div class="flex items-center justify-end gap-3 text-gray-400">
                    <button title="Open" class="hover:text-gray-700 transition-colors"><Eye class="w-4 h-4" /></button>
                    <button title="Edit" class="hover:text-gray-700 transition-colors"><Pencil class="w-4 h-4" /></button>
                    <button title="More" class="hover:text-gray-700 transition-colors"><MoreHorizontal class="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredCategories.length === 0">
                <td colspan="6" class="text-center py-12 text-gray-500">
                  <div class="flex flex-col items-center justify-center">
                    <span class="text-2xl mb-2">🔍</span>
                    <p class="text-sm font-semibold text-gray-700">No categories found</p>
                    <p class="text-xs text-gray-400 mt-1">Try adjusting your search criteria or status filter</p>
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

      <!-- Right Card: Specification Templates -->
      <div class="lg:col-span-5 bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col h-full">
        <div class="px-5 py-4 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">Specification Templates</h3>
        </div>
        <div class="p-5 flex-1">
          <div class="space-y-4">
            <div v-for="template in templates" :key="template.name" class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 py-2 border-b border-gray-50 last:border-0">
              <span class="text-[12px] font-medium text-gray-600">{{ template.name }}</span>
              <span class="text-[11px] font-bold text-gray-900">{{ template.specs }}</span>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  </div>

  <!-- Create Category Modal Popup -->
  <CreateCategory v-if="showCreateModal" @close="showCreateModal = false" />

  <router-view />
</template>