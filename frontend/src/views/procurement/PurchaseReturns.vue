<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Plus } from 'lucide-vue-next'
import { store } from '../../store.js'
import { api } from '@/services/api.js'
import CreatePurchaseReturn from './CreatePurchaseReturn.vue'

const router = useRouter()
const activeFilter = ref('All')
const filters = ['All', 'Draft', 'Approved', 'Shipped', 'Credited', 'Closed']
const searchQuery = ref('')
const selectedSupplier = ref('All Suppliers')
const openDropdown = ref(null)
const showCreateModal = ref(false)
const isLoading = ref(false)
const apiError = ref(null)

const suppliers = computed(() => {
  const list = ['All Suppliers']
  const names = new Set()
  ;(store.purchaseReturns || []).forEach(r => { if (r.supplier) names.add(r.supplier) })
  ;(store.suppliers || []).forEach(s => { if (s.name) names.add(s.name) })
  return [...list, ...Array.from(names)]
})

const returns = computed(() => store.purchaseReturns || [])

onMounted(async () => {
  isLoading.value = true
  apiError.value = null
  try {
    const res = await api.procurement.getPurchaseReturns()
    const data = res?.data || res
    if (Array.isArray(data) && data.length > 0) {
      store.purchaseReturns = data
    }
  } catch (err) {
    console.warn('API error fetching purchase returns, using store cache:', err)
    apiError.value = err.message
  } finally {
    isLoading.value = false
  }
})

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const selectSupplier = (sup) => {
  selectedSupplier.value = sup
  openDropdown.value = null
}

const resetFilters = () => {
  activeFilter.value = 'All'
  searchQuery.value = ''
  selectedSupplier.value = 'All Suppliers'
}

const filteredReturns = computed(() => {
  return returns.value.filter(item => {
    if (activeFilter.value !== 'All' && String(item.status || '').toLowerCase() !== activeFilter.value.toLowerCase()) return false
    if (selectedSupplier.value !== 'All Suppliers' && item.supplier !== selectedSupplier.value) return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = String(item.returnNo || item.return_number || item.id || '').toLowerCase().includes(q) ||
                    String(item.supplier || '').toLowerCase().includes(q) ||
                    String(item.po || item.po_number || '').toLowerCase().includes(q) ||
                    String(item.reason || '').toLowerCase().includes(q) ||
                    String(item.status || '').toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })
})

const openDetail = (item) => {
  const targetId = item.id || item.returnNo || item.return_number
  router.push(`/procurement/returns/${targetId}`)
}

const onReturnCreated = (newRet) => {
  showCreateModal.value = false
  if (newRet) {
    store.addPurchaseReturn(newRet)
  }
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openDropdown = null">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Procurement / <span class="font-bold text-gray-800">Purchase Returns</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Purchase Returns</h1>
        <p class="text-sm text-gray-500 mt-1">Return defective or rejected supplier units with credit tracking and vendor debit notes.</p>
      </div>
      <div>
        <button @click="showCreateModal = true" class="px-4 py-2 text-[11px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex items-center gap-2 cursor-pointer">
          <Plus class="w-4 h-4" /> <span>Create Purchase Return</span>
        </button>
      </div>
    </div>

    <!-- Error Banner -->
    <div v-if="apiError" class="p-3.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center justify-between">
      <span>{{ apiError }}</span>
      <button @click="apiError = null" class="text-red-500 hover:text-red-800 font-bold ml-2 cursor-pointer">&times;</button>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-wrap items-center gap-2">
        <button 
          v-for="filter in filters" 
          :key="filter"
          @click="activeFilter = filter"
          class="px-4 py-1.5 rounded-full text-[11px] font-bold transition-colors cursor-pointer"
          :class="activeFilter === filter ? 'bg-[#eefcf2] text-[#165A31]' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'"
        >
          {{ filter }}
        </button>
      </div>

      <div class="flex items-center gap-3">
        <div class="relative w-full sm:w-60">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input data-tour="searchquery" 
            v-model="searchQuery"
            type="text" 
            placeholder="Search return, supplier, reason..." 
            class="w-full pl-9 pr-3 py-1.5 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
          />
        </div>

        <!-- Supplier Dropdown -->
        <div class="relative">
          <button 
            @click.stop="toggleDropdown('supplier')"
            class="px-3 py-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex items-center gap-2"
            :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedSupplier !== 'All Suppliers' }"
          >
            <span>{{ selectedSupplier }}</span>
            <span class="text-[8px]">▼</span>
          </button>

          <div 
            v-if="openDropdown === 'supplier'" 
            class="absolute right-0 mt-1 w-48 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20"
          >
            <button 
              v-for="s in suppliers" 
              :key="s"
              @click.stop="selectSupplier(s)"
              class="w-full text-left px-3 py-1.5 text-[11px] text-gray-700 hover:bg-gray-50 flex items-center justify-between"
              :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedSupplier === s }"
            >
              {{ s }}
            </button>
          </div>
        </div>

        <button 
          v-if="searchQuery || activeFilter !== 'All' || selectedSupplier !== 'All Suppliers'" 
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
        <h3 class="text-[14px] font-bold text-gray-900">Purchase Returns</h3>
        <span class="text-[11px] font-medium text-gray-500">Showing {{ filteredReturns.length }} returns</span>
      </div>
      
      <div class="overflow-x-auto">
        <div class="w-full overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                <th class="px-5 py-3">Return #</th>
                <th class="px-5 py-3">Supplier</th>
                <th class="px-5 py-3">PO #</th>
                <th class="px-5 py-3">Units</th>
                <th class="px-5 py-3">Reason</th>
                <th class="px-5 py-3">Credit</th>
                <th class="px-5 py-3">Status</th>
                <th class="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="item in filteredReturns" :key="item.returnNo || item.id" @click="openDetail(item)" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer">
                <td class="px-5 py-4 font-semibold text-gray-900">{{ item.returnNo || item.return_number || item.id }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.supplier }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.po || item.po_number || '—' }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.units || item.total_units || '0' }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.reason }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.creditFormatted || item.credit || '—' }}</td>
                <td class="px-5 py-4">
                  <span v-if="item.status === 'Closed'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">Closed</span>
                  <span v-else-if="item.status === 'Approved'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-[#dcfce7] text-[#165A31]">Approved</span>
                  <span v-else-if="item.status === 'Shipped'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-blue-50 text-blue-600">Shipped</span>
                  <span v-else class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-gray-100 text-gray-600">{{ item.status }}</span>
                </td>
                <td @click.stop="openDetail(item)" class="px-5 py-4 text-gray-400 font-medium hover:text-gray-600 cursor-pointer text-right">
                  Open &rarr;
                </td>
              </tr>
              <tr v-if="filteredReturns.length === 0">
                <td colspan="8" class="text-center py-12 text-gray-500">
                  <div class="flex flex-col items-center justify-center">
                    <span class="text-2xl mb-2">🔍</span>
                    <p class="text-sm font-semibold text-gray-700">No purchase returns found</p>
                    <p class="text-xs text-gray-400 mt-1">Try adjusting your filters or search query</p>
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
  </div>

  <!-- Create Modal -->
  <CreatePurchaseReturn v-if="showCreateModal" @close="showCreateModal = false" @created="onReturnCreated" />

  <router-view />
</template>