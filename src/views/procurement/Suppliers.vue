<script setup>
import { Eye, Pencil } from 'lucide-vue-next'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../../store.js'

const router = useRouter()
const searchQuery = ref('')
const selectedStatus = ref('All Statuses')
const openDropdown = ref(null)

const statuses = ['All Statuses', 'Active', 'Inactive']

const kpis = [
  { label: 'Suppliers', value: '12' },
  { label: 'Active', value: '10' },
  { label: 'Open POs', value: '9' },
  { label: 'Payables', value: 'PKR 6.1M' }
]

const suppliers = ref([
  { name: 'BRG Factory', contact: 'Li Wei', products: '48', openPos: '5', purchases: '38.4M', payable: '4.2M', onTime: '92%', status: 'Active' },
  { name: 'Pak Logistics', contact: 'Usman Shah', products: '—', openPos: '2', purchases: '3.8M', payable: '0.7M', onTime: '88%', status: 'Active' },
  { name: 'PowerCell Co.', contact: 'Aamir Raza', products: '12', openPos: '2', purchases: '8.6M', payable: '1.2M', onTime: '95%', status: 'Active' },
  { name: 'GreenDrive Parts', contact: 'Zubair Ahmed', products: '6', openPos: '0', purchases: '1.4M', payable: '0.0M', onTime: '98%', status: 'Active' },
  { name: 'Volt Battery Tech', contact: 'Chen Dong', products: '15', openPos: '0', purchases: '4.2M', payable: '0.0M', onTime: '82%', status: 'Inactive' }
])

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

const filteredSuppliers = computed(() => {
  return suppliers.value.filter(item => {
    if (selectedStatus.value !== 'All Statuses' && item.status !== selectedStatus.value) return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = item.name.toLowerCase().includes(q) ||
                    item.contact.toLowerCase().includes(q) ||
                    item.status.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })
})

const editSupplier = (supplier) => {
  store.originalEditSupplier = supplier
  router.push('/procurement/suppliers/edit')
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openDropdown = null">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Procurement / <span class="font-bold text-gray-800">Suppliers</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Suppliers</h1>
        <p class="text-sm text-gray-500 mt-1">Manage BRG suppliers, procurement relationships and performance.</p>
      </div>
      <button @click="$router.push('/procurement/suppliers/create')" class="bg-[#165A31] text-white text-[11px] font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer">
        + Add Supplier
      </button>
    </div>

    <!-- 4 KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="(kpi, index) in kpis" :key="index" class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[88px]">
        <div class="text-[11px] font-semibold text-gray-400">{{ kpi.label }}</div>
        <div class="text-[22px] font-bold text-gray-900 leading-none">{{ kpi.value }}</div>
      </div>
    </div>

    <!-- Search & Filter Bar -->
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
          placeholder="Search supplier, contact..." 
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

    <!-- Table Container -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-[14px] font-bold text-gray-900">Suppliers</h3>
        <span class="text-[11px] font-medium text-gray-500">Showing {{ filteredSuppliers.length }} suppliers</span>
      </div>
      
      <div class="overflow-x-auto">
        <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
              <th class="px-5 py-3">Supplier</th>
              <th class="px-5 py-3">Contact</th>
              <th class="px-5 py-3">Products</th>
              <th class="px-5 py-3">Open POs</th>
              <th class="px-5 py-3">Purchases YTD</th>
              <th class="px-5 py-3">Payable</th>
              <th class="px-5 py-3">On-Time</th>
              <th class="px-5 py-3">Status</th>
              <th class="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr v-for="supplier in filteredSuppliers" :key="supplier.name" @click="$router.push('/procurement/suppliers/detail')" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer">
              <td class="px-5 py-4 font-semibold text-gray-900">{{ supplier.name }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ supplier.contact }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ supplier.products }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ supplier.openPos }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ supplier.purchases }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ supplier.payable }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ supplier.onTime }}</td>
              <td class="px-5 py-4">
                <span v-if="supplier.status === 'Active'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">
                  {{ supplier.status }}
                </span>
                <span v-else class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-gray-100 text-gray-600">
                  {{ supplier.status }}
                </span>
              </td>
              <td class="px-5 py-4 text-right">
                <div class="flex items-center justify-end gap-3 text-gray-400">
                  <span @click.stop="$router.push('/procurement/suppliers/detail')" class="hover:text-gray-600 cursor-pointer transition-colors" title="Open"><Eye class="w-4 h-4" /></span>
                  <span @click.stop="editSupplier(supplier)" class="hover:text-gray-600 cursor-pointer transition-colors" title="Edit"><Pencil class="w-4 h-4" /></span>
                </div>
              </td>
            </tr>
            <tr v-if="filteredSuppliers.length === 0">
              <td colspan="9" class="text-center py-12 text-gray-500">
                <div class="flex flex-col items-center justify-center">
                  <span class="text-2xl mb-2">🔍</span>
                  <p class="text-sm font-semibold text-gray-700">No suppliers found</p>
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

  <router-view />
</template>