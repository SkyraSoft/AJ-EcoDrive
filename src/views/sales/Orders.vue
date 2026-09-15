<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search, ChevronDown, Check } from 'lucide-vue-next'
import CreateSaleModal from './CreateSale.vue'

const router = useRouter()
const showCreateModal = ref(false)
const activeTab = ref('All')
const tabs = ['All', 'New', 'Confirmed', 'Payment Pending', 'Reserved', 'Ready', 'Completed', 'Returned']
const searchQuery = ref('')
const selectedBranch = ref('All Branches')
const openDropdown = ref(null)

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const orders = ref([
  {
    orderNo: 'SO-7740',
    branch: 'Peshawar',
    customer: 'Faisal Khan',
    unit: 'DS11-00991',
    amount: '185K',
    paid: '100K',
    balance: '85K',
    status: 'Reserved',
    statusColor: 'bg-orange-100 text-orange-800',
    delivery: 'Pending'
  },
  {
    orderNo: 'SO-7731',
    branch: 'Islamabad',
    customer: 'Saad Ahmad',
    unit: 'DS11-00988',
    amount: '185K',
    paid: '185K',
    balance: '0',
    status: 'Completed',
    statusColor: 'bg-[#eefcf2] text-[#165A31]',
    delivery: 'Delivered'
  },
  {
    orderNo: 'SO-7724',
    branch: 'Lahore',
    customer: 'M. Bilal',
    unit: 'CARGO-00318',
    amount: '275K',
    paid: '275K',
    balance: '0',
    status: 'Ready',
    statusColor: 'bg-blue-100 text-blue-800',
    delivery: 'Today'
  },
  {
    orderNo: 'SO-7718',
    branch: 'Peshawar',
    customer: 'Ali Raza',
    unit: 'DS11-00974',
    amount: '185K',
    paid: '50K',
    balance: '135K',
    status: 'Payment Pending',
    statusColor: 'bg-yellow-100 text-yellow-800',
    delivery: 'Pending Payment'
  },
  {
    orderNo: 'SO-7710',
    branch: 'Islamabad',
    customer: 'Javed Iqbal',
    unit: 'EV5-00102',
    amount: '220K',
    paid: '220K',
    balance: '0',
    status: 'Confirmed',
    statusColor: 'bg-indigo-100 text-indigo-800',
    delivery: 'Queued'
  }
])

const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    // Tab Filter
    if (activeTab.value !== 'All' && order.status.toLowerCase() !== activeTab.value.toLowerCase()) {
      return false
    }

    // Branch Filter
    if (selectedBranch.value !== 'All Branches' && order.branch !== selectedBranch.value) {
      return false
    }

    // Search Filter
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = 
        order.orderNo.toLowerCase().includes(q) ||
        order.customer.toLowerCase().includes(q) ||
        order.unit.toLowerCase().includes(q) ||
        order.branch.toLowerCase().includes(q)
      if (!match) return false
    }

    return true
  })
})

const resetFilters = () => {
  activeTab.value = 'All'
  selectedBranch.value = 'All Branches'
  searchQuery.value = ''
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openDropdown = null">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Sales & CRM / <span class="font-bold text-gray-800">Orders</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Orders</h1>
        <p class="text-sm text-gray-500 mt-1">Track confirmed sales from payment through reservation and handover.</p>
      </div>
      <button @click="showCreateModal = true" class="bg-[#165A31] text-white text-[11px] font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer">
        <span class="text-lg leading-none">+</span> Create Order
      </button>
    </div>

    <!-- Filters & Table -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <!-- Search & Branch Filter Row -->
      <div class="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-3 flex-1">
          <div class="relative flex-1 max-w-[300px] min-w-[200px]">
            <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search order #, customer, unit..." 
              class="w-full pl-9 pr-4 py-1.5 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)]" 
            />
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
        </div>

        <button 
          v-if="activeTab !== 'All' || selectedBranch !== 'All Branches' || searchQuery"
          @click="resetFilters" 
          class="text-[11px] text-[#165A31] font-semibold hover:underline cursor-pointer"
        >
          Reset Filters
        </button>
      </div>

      <!-- Status Tabs -->
      <div class="px-4 py-3 bg-[#fbfbfc] border-b border-gray-100 flex items-center gap-2 overflow-x-auto">
        <button 
          v-for="tab in tabs" 
          :key="tab"
          @click="activeTab = tab"
          class="px-3.5 py-1 text-[11px] font-bold rounded-full transition-colors whitespace-nowrap border cursor-pointer"
          :class="activeTab === tab ? 'bg-[#eefcf2] text-[#165A31] border-[#d1f4e0]' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <th class="px-5 py-4">Order</th>
              <th class="px-5 py-4">Branch</th>
              <th class="px-5 py-4">Customer</th>
              <th class="px-5 py-4">Unit</th>
              <th class="px-5 py-4">Amount</th>
              <th class="px-5 py-4">Paid</th>
              <th class="px-5 py-4">Balance</th>
              <th class="px-5 py-4 text-center">Status</th>
              <th class="px-5 py-4 text-center">Delivery</th>
              <th class="px-5 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="text-[12px] divide-y divide-gray-50">
            <tr 
              v-for="order in filteredOrders" 
              :key="order.orderNo" 
              class="hover:bg-gray-50/50 transition-colors cursor-pointer"
              @click="router.push('/sales/orders/detail')"
            >
              <td class="px-5 py-4 text-gray-900 font-bold">{{ order.orderNo }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ order.branch }}</td>
              <td class="px-5 py-4 text-gray-800 font-semibold">{{ order.customer }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ order.unit }}</td>
              <td class="px-5 py-4 text-gray-900 font-bold">{{ order.amount }}</td>
              <td class="px-5 py-4 text-[#165A31] font-semibold">{{ order.paid }}</td>
              <td class="px-5 py-4" :class="order.balance !== '0' ? 'text-orange-600 font-bold' : 'text-gray-600 font-medium'">
                {{ order.balance }}
              </td>
              <td class="px-5 py-4 text-center">
                <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold', order.statusColor]">
                  {{ order.status }}
                </span>
              </td>
              <td class="px-5 py-4 text-center text-gray-600 font-medium">{{ order.delivery }}</td>
              <td class="px-5 py-4 text-right">
                <button @click.stop="router.push('/sales/orders/detail')" class="text-[#165A31] hover:underline font-semibold cursor-pointer">
                  View
                </button>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="filteredOrders.length === 0">
              <td colspan="10" class="text-center py-12 text-gray-500">
                <div class="space-y-2">
                  <p class="text-xs font-semibold text-gray-700">No orders found matching the selected filters</p>
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

    <CreateSaleModal v-if="showCreateModal" @close="showCreateModal = false" />
  </div>
</template>
