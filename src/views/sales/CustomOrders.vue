<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search, ChevronDown, Check } from 'lucide-vue-next'
import CreateCustomOrderModal from './CreateCustomOrder.vue'

const router = useRouter()
const showCreateModal = ref(false)

const searchQuery = ref('')
const selectedStatus = ref('All Statuses')
const selectedBranch = ref('All Branches')
const openDropdown = ref(null)

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const orders = ref([
  {
    orderNo: 'CO-119',
    customer: 'Zain Khan',
    branch: 'Islamabad',
    product: 'Cargo Pro - Red',
    deposit: '75K',
    total: '280K',
    eta: 'Sep 18',
    status: 'Procurement',
    statusColor: 'bg-[#eefcf2] text-[#165A31]'
  },
  {
    orderNo: 'CO-118',
    customer: 'Faisal Khan',
    branch: 'Peshawar',
    product: 'DS11 - Custom Paint',
    deposit: '150K',
    total: '600K',
    eta: 'Oct 05',
    status: 'Pending Quote',
    statusColor: 'bg-yellow-50 text-yellow-700'
  },
  {
    orderNo: 'CO-115',
    customer: 'M. Bilal',
    branch: 'Lahore',
    product: 'EV-5 Extended Range',
    deposit: '100K',
    total: '340K',
    eta: 'Sep 25',
    status: 'In Assembly',
    statusColor: 'bg-blue-50 text-blue-700'
  }
])

const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    // Status Filter
    if (selectedStatus.value !== 'All Statuses' && order.status.toLowerCase() !== selectedStatus.value.toLowerCase()) {
      return false
    }

    // Branch Filter
    if (selectedBranch.value !== 'All Branches' && order.branch !== selectedBranch.value) {
      return false
    }

    // Search Query
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = 
        order.orderNo.toLowerCase().includes(q) ||
        order.customer.toLowerCase().includes(q) ||
        order.product.toLowerCase().includes(q) ||
        (order.branch && order.branch.toLowerCase().includes(q))
      if (!match) return false
    }

    return true
  })
})

const resetFilters = () => {
  selectedStatus.value = 'All Statuses'
  selectedBranch.value = 'All Branches'
  searchQuery.value = ''
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openDropdown = null">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Sales & CRM / <span class="font-bold text-gray-800">Custom Orders / Reservations</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Custom Orders & Reservations</h1>
        <p class="text-sm text-gray-500 mt-1">Manage unfulfilled orders that require special procurement or backorders.</p>
      </div>
      <button @click="showCreateModal = true" class="bg-[#165A31] text-white text-[11px] font-bold px-4 py-2 rounded-lg hover:bg-[#124a28] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05)] cursor-pointer">
        + Create Custom Order
      </button>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <!-- Filters -->
      <div class="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-3 flex-1">
          <!-- Status Dropdown -->
          <div class="relative" @click.stop>
            <button 
              @click="toggleDropdown('status')"
              class="px-3 py-1.5 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <span>{{ selectedStatus }}</span>
              <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
            </button>
            <div v-if="openDropdown === 'status'" class="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <button 
                v-for="status in ['All Statuses', 'Procurement', 'Pending Quote', 'In Assembly']"
                :key="status"
                @click="selectedStatus = status; openDropdown = null"
                class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
                :class="selectedStatus === status ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
              >
                <span>{{ status }}</span>
                <Check v-if="selectedStatus === status" class="w-3.5 h-3.5 text-[#165A31]" />
              </button>
            </div>
          </div>

          <!-- Branch Dropdown -->
          <div class="relative" @click.stop>
            <button 
              @click="toggleDropdown('branch')"
              class="px-3 py-1.5 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <span>{{ selectedBranch }}</span>
              <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
            </button>
            <div v-if="openDropdown === 'branch'" class="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <button 
                v-for="branch in ['All Branches', 'Peshawar', 'Islamabad', 'Lahore']"
                :key="branch"
                @click="selectedBranch = branch; openDropdown = null"
                class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
                :class="selectedBranch === branch ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
              >
                <span>{{ branch }}</span>
                <Check v-if="selectedBranch === branch" class="w-3.5 h-3.5 text-[#165A31]" />
              </button>
            </div>
          </div>

          <!-- Search Input -->
          <div class="relative flex-1 max-w-[300px]">
            <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search order #, customer, product..." 
              class="w-full pl-9 pr-4 py-1.5 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)]" 
            />
          </div>
        </div>

        <button 
          v-if="selectedStatus !== 'All Statuses' || selectedBranch !== 'All Branches' || searchQuery"
          @click="resetFilters" 
          class="text-[11px] text-[#165A31] font-semibold hover:underline cursor-pointer"
        >
          Reset Filters
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <th class="px-5 py-3">Order</th>
              <th class="px-5 py-3">Customer</th>
              <th class="px-5 py-3">Branch</th>
              <th class="px-5 py-3">Product</th>
              <th class="px-5 py-3">Deposit</th>
              <th class="px-5 py-3">Total</th>
              <th class="px-5 py-3">ETA</th>
              <th class="px-5 py-3">Status</th>
              <th class="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr 
              v-for="order in filteredOrders" 
              :key="order.orderNo" 
              class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
              @click="router.push('/sales/custom-orders/detail')"
            >
              <td class="px-5 py-4 text-gray-900 font-bold">{{ order.orderNo }}</td>
              <td class="px-5 py-4 text-gray-800 font-semibold">{{ order.customer }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ order.branch }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ order.product }}</td>
              <td class="px-5 py-4 text-[#165A31] font-bold">{{ order.deposit }}</td>
              <td class="px-5 py-4 text-gray-900 font-bold">{{ order.total }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ order.eta }}</td>
              <td class="px-5 py-4">
                <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold', order.statusColor]">
                  {{ order.status }}
                </span>
              </td>
              <td class="px-5 py-4 text-right">
                <button @click.stop="router.push('/sales/custom-orders/detail')" class="text-[#165A31] hover:underline font-semibold flex items-center justify-end gap-1 ml-auto cursor-pointer">
                  Open &rarr;
                </button>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="filteredOrders.length === 0">
              <td colspan="9" class="text-center py-12 text-gray-500">
                <div class="space-y-2">
                  <p class="text-xs font-semibold text-gray-700">No custom orders found matching the selected filters</p>
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

    <CreateCustomOrderModal v-if="showCreateModal" @close="showCreateModal = false" />
  </div>
</template>
