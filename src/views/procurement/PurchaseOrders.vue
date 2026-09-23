<script setup>
import { Eye, Plus } from 'lucide-vue-next'
import { ref, computed } from 'vue'
import CreatePurchaseOrder from './CreatePurchaseOrder.vue'

import { store } from '../../store.js'

const activeFilter = ref('All')
const showCreateModal = ref(false)
const filters = ['All', 'Draft', 'Pending Approval', 'Approved', 'In Transit', 'Partially Received', 'Fully Received']
const searchQuery = ref('')
const selectedDestination = ref('All Destinations')
const openDropdown = ref(null)

const destinations = ['All Destinations', 'All Branches', 'Peshawar', 'Islamabad', 'Lahore']

const purchaseOrders = computed(() => store.purchaseOrders)

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const selectDestination = (dest) => {
  selectedDestination.value = dest
  openDropdown.value = null
}

const resetFilters = () => {
  activeFilter.value = 'All'
  searchQuery.value = ''
  selectedDestination.value = 'All Destinations'
}

const filteredOrders = computed(() => {
  return purchaseOrders.value.filter(item => {
    if (activeFilter.value !== 'All') {
      const filterLower = activeFilter.value.toLowerCase()
      const statusLower = (item.status || '').toLowerCase()
      if (filterLower === 'partially received' || filterLower === 'partial') {
        if (!statusLower.includes('parti')) return false
      } else if (filterLower === 'fully received' || filterLower === 'received') {
        if (!statusLower.includes('receiv') && statusLower !== 'fully received') return false
      } else if (statusLower !== filterLower) {
        return false
      }
    }
    if (selectedDestination.value !== 'All Destinations' && item.destination !== selectedDestination.value) return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = item.po.toLowerCase().includes(q) ||
                    item.supplier.toLowerCase().includes(q) ||
                    (item.destination || '').toLowerCase().includes(q) ||
                    (item.amount || '').toLowerCase().includes(q) ||
                    (item.status || '').toLowerCase().includes(q)
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
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Procurement / <span class="font-bold text-gray-800">Purchase Orders</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Purchase Orders</h1>
        <p class="text-sm text-gray-500 mt-1">Control BRG procurement from draft through receipt and closure.</p>
      </div>
      <button @click="showCreateModal = true" class="bg-[#165A31] text-white text-[11px] font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer">
        <Plus class="w-4 h-4" /> <span>Create Purchase Order</span>
      </button>
    </div>

    <!-- Filters Row -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center bg-white border border-gray-100 rounded-lg p-1 shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-x-auto max-w-full">
        <button 
          v-for="filter in filters" 
          :key="filter"
          @click="activeFilter = filter"
          class="px-4 py-1.5 text-[11px] font-bold rounded-md transition-colors whitespace-nowrap cursor-pointer"
          :class="activeFilter === filter ? 'bg-[#eefcf2] text-[#165A31]' : 'text-gray-600 hover:bg-gray-50'"
        >
          {{ filter }}
        </button>
      </div>

      <div class="flex items-center gap-3">
        <div class="relative w-full sm:w-64 shrink-0">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-3.5 w-3.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </div>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search PO..." 
            class="block w-full pl-9 pr-3 py-1.5 text-[11px] bg-white border border-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] placeholder-gray-400 text-gray-900"
          >
        </div>

        <!-- Destination Dropdown -->
        <div class="relative">
          <button 
            @click.stop="toggleDropdown('destination')"
            class="px-3 py-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex items-center gap-2"
            :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedDestination !== 'All Destinations' }"
          >
            <span>{{ selectedDestination }}</span>
            <span class="text-[8px] text-gray-400">▼</span>
          </button>
          <div v-if="openDropdown === 'destination'" class="absolute right-0 mt-1 w-44 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
            <button 
              v-for="d in destinations" 
              :key="d" 
              @click.stop="selectDestination(d)"
              class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700"
              :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedDestination === d }"
            >
              {{ d }}
            </button>
          </div>
        </div>

        <button 
          v-if="searchQuery || activeFilter !== 'All' || selectedDestination !== 'All Destinations'" 
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
        <h3 class="text-[14px] font-bold text-gray-900">Purchase Orders</h3>
        <span class="text-[11px] font-medium text-gray-500">Showing {{ filteredOrders.length }} purchase orders</span>
      </div>
      
      <div class="overflow-x-auto">
        <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
              <th class="px-5 py-3">PO</th>
              <th class="px-5 py-3">Supplier</th>
              <th class="px-5 py-3">Destination</th>
              <th class="px-5 py-3">Amount</th>
              <th class="px-5 py-3">Units</th>
              <th class="px-5 py-3">Expected</th>
              <th class="px-5 py-3">Status</th>
              <th class="px-5 py-3">Match</th>
              <th class="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr v-for="item in filteredOrders" :key="item.po" @click="$router.push(`/procurement/purchase-orders/${item.po}`)" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer">
              <td class="px-5 py-4 font-semibold text-gray-900">{{ item.po }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.supplier }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.destination || item.branch }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.amount }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.totalOrdered || item.units }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.expected || item.expectedDate }}</td>
              <td class="px-5 py-4">
                <span v-if="item.status === 'Pending Approval'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-amber-50 text-amber-600">{{ item.status }}</span>
                <span v-else-if="item.status === 'In Transit'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-blue-50 text-blue-600">{{ item.status }}</span>
                <span v-else-if="item.status === 'Partial' || item.status === 'Partially Received'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-orange-50 text-orange-600">{{ item.status }}</span>
                <span v-else-if="item.status === 'Approved' || item.status === 'Received' || item.status === 'Fully Received'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">{{ item.status }}</span>
                <span v-else class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-gray-100 text-gray-600">{{ item.status }}</span>
              </td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.match }}</td>
              <td class="px-5 py-4 text-right">
                <div class="flex items-center justify-end gap-3 text-gray-400">
                  <span @click.stop="$router.push(`/procurement/purchase-orders/${item.po}`)" class="cursor-pointer hover:text-gray-600 transition-colors" title="Open"><Eye class="w-4 h-4" /></span>
                  <button 
                    v-if="item.status !== 'Fully Received' && (item.remainingUnits === undefined || item.remainingUnits > 0)"
                    @click.stop="$router.push(`/procurement/purchase-orders/${item.po}/receive`)" 
                    class="cursor-pointer hover:text-[#165A31] text-[#165A31] transition-colors font-bold text-[11px]"
                  >
                    Receive
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredOrders.length === 0">
              <td colspan="9" class="text-center py-12 text-gray-500">
                <div class="flex flex-col items-center justify-center">
                  <span class="text-2xl mb-2">🔍</span>
                  <p class="text-sm font-semibold text-gray-700">No purchase orders found</p>
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

  <!-- Create Purchase Order Modal Popup -->
  <CreatePurchaseOrder v-if="showCreateModal" @close="showCreateModal = false" />

  <router-view />
</template>