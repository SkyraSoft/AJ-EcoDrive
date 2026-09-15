<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const selectedBranch = ref('All Branches')
const selectedStatus = ref('All Statuses')
const selectedProduct = ref('All Products')
const openDropdown = ref(null)

const branches = ['All Branches', 'Peshawar', 'Islamabad', 'Lahore']
const statuses = ['All Statuses', 'Available', 'Reserved', 'QC Hold']
const products = ['All Products', 'BRG DS11', 'BRG EV-5']

const serializedUnits = ref([
  { serial: 'DS11-01001', chassis: 'CH-90111', product: 'BRG DS11', branch: 'Peshawar', location: 'Main Showroom', sourcePo: 'PO-2048', landedCost: '183.4K', status: 'Available', customer: '—', order: '—' },
  { serial: 'DS11-00991', chassis: 'CH-88194', product: 'BRG DS11', branch: 'Peshawar', location: 'Reserved Bay', sourcePo: 'PO-1992', landedCost: '145.8K', status: 'Reserved', customer: 'Faisal Khan', order: 'SO-7740' },
  { serial: 'EVS-00441', chassis: 'CH-81104', product: 'BRG EV-5', branch: 'Peshawar', location: 'QC Area', sourcePo: 'PO-2048', landedCost: '188.0K', status: 'QC Hold', customer: '—', order: '—' },
  { serial: 'DS11-00971', chassis: 'CH-88155', product: 'BRG DS11', branch: 'Islamabad', location: 'Showroom Floor', sourcePo: 'PO-1980', landedCost: '182.0K', status: 'Available', customer: '—', order: '—' },
  { serial: 'EVS-00439', chassis: 'CH-81099', product: 'BRG EV-5', branch: 'Lahore', location: 'Storage Bay 2', sourcePo: 'PO-2012', landedCost: '187.5K', status: 'Reserved', customer: 'Tariq Mehmood', order: 'SO-7729' }
])

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
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openDropdown = null">
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
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
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
          <span class="text-[8px] text-gray-400">▼</span>
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
          <span class="text-[8px] text-gray-400">▼</span>
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
          <span class="text-[8px] text-gray-400">▼</span>
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
        <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse">
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
            <tr v-for="(item, i) in filteredUnits" :key="i" @click="$router.push('/inventory/serialized-units/detail')" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer">
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
        </table></div>
      </div>
    </div>
  </div>
</template>
