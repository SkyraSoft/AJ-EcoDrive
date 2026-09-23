<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Search, ChevronDown, Check, Pencil, Eye, CheckCircle2, Plus } from 'lucide-vue-next'
import CreateSaleModal from './CreateSale.vue'
import { store } from '@/store.js'

const router = useRouter()
const route = useRoute()
const showCreateModal = ref(false)
const selectedOrderToEdit = ref(null)
const initialCustomer = ref(null)
const showToast = ref(false)
const toastMessage = ref('')

onMounted(() => {
  if (route.query.action === 'new') {
    initialCustomer.value = route.query.customer || null
    openCreateModal()
  }
})

const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

// Branch Manager Data
const branchKpis = computed(() => [
  { label: 'Open Orders', value: '24', sub: '6 ready' },
  { label: 'Reserved Units', value: '18', sub: 'Linked to orders' },
  { label: 'Unpaid / Partial', value: '5', sub: 'Needs follow-up' },
  { label: 'Completed', value: '31', sub: 'This month' }
])

const branchSearchQuery = ref('')
const branchStatusFilter = ref('All')
const openBranchDropdown = ref(null)

const toggleBranchDropdown = (name) => {
  openBranchDropdown.value = openBranchDropdown.value === name ? null : name
}

const filteredBranchOrders = computed(() => {
  const activeBranch = store.getActiveBranch().toLowerCase()
  return store.orders.filter(item => {
    const itemBranch = (item.branch || '').toLowerCase()
    if (itemBranch && itemBranch !== activeBranch && itemBranch !== 'all branches' && itemBranch !== 'all') {
      return false
    }
    if (branchStatusFilter.value !== 'All') {
      if (item.status.toLowerCase() !== branchStatusFilter.value.toLowerCase()) return false
    }
    if (branchSearchQuery.value.trim()) {
      const q = branchSearchQuery.value.toLowerCase()
      const match = (item.order && item.order.toLowerCase().includes(q)) ||
                    (item.id && item.id.toLowerCase().includes(q)) ||
                    (item.orderNo && item.orderNo.toLowerCase().includes(q)) ||
                    (item.customer && item.customer.toLowerCase().includes(q)) ||
                    (item.product && item.product.toLowerCase().includes(q)) ||
                    (item.unit && item.unit.toLowerCase().includes(q))
      if (!match) return false
    }
    return true
  })
})

// Super Admin Data
const activeTab = ref('All')
const tabs = ['All', 'New', 'Confirmed', 'Payment Pending', 'Reserved', 'Ready', 'Completed', 'Returned']
const searchQuery = ref('')
const selectedBranch = ref('All Branches')
const branchOptions = computed(() => store.getBranchOptions())
const openDropdown = ref(null)

const toggleDropdown = (name) => {
  if (name === 'branch' && isBranchUser.value) return
  openDropdown.value = openDropdown.value === name ? null : name
}

const filteredOrders = computed(() => {
  return store.orders.filter(order => {
    if (!store.isBranchAllowed(order.branch)) {
      return false
    }
    if (activeTab.value !== 'All' && order.status.toLowerCase() !== activeTab.value.toLowerCase()) {
      return false
    }
    if (selectedBranch.value !== 'All Branches' && order.branch !== selectedBranch.value) {
      return false
    }
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = 
        (order.orderNo && order.orderNo.toLowerCase().includes(q)) ||
        (order.order && order.order.toLowerCase().includes(q)) ||
        (order.customer && order.customer.toLowerCase().includes(q)) ||
        (order.unit && order.unit.toLowerCase().includes(q)) ||
        (order.branch && order.branch.toLowerCase().includes(q))
      if (!match) return false
    }
    return true
  })
})

const resetFilters = () => {
  activeTab.value = 'All'
  selectedBranch.value = isBranchUser.value ? store.currentUser.branchName : 'All Branches'
  searchQuery.value = ''
}

const openCreateModal = () => {
  selectedOrderToEdit.value = null
  store.originalEditOrder = null
  showCreateModal.value = true
}

const openEditModal = (order) => {
  selectedOrderToEdit.value = order
  store.originalEditOrder = order
  showCreateModal.value = true
}

const handleOrderCreated = (newOrder) => {
  const added = store.addOrder(newOrder)
  toastMessage.value = `Order ${added.order || added.orderNo} created successfully!`
  showToast.value = true
  showCreateModal.value = false
  setTimeout(() => {
    showToast.value = false
  }, 4000)
}

const handleOrderUpdated = (updatedOrder) => {
  store.updateOrder(updatedOrder.id || updatedOrder.order || updatedOrder.orderNo, updatedOrder)
  toastMessage.value = `Order ${updatedOrder.order || updatedOrder.orderNo} updated successfully!`
  showToast.value = true
  showCreateModal.value = false
  setTimeout(() => {
    showToast.value = false
  }, 4000)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Toast Notification -->
    <div 
      v-if="showToast" 
      class="fixed bottom-5 right-5 z-[110] bg-[#165A31] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200"
    >
      <CheckCircle2 class="w-5 h-5 text-green-300" />
      <span class="text-xs font-bold">{{ toastMessage }}</span>
    </div>

    <!-- BRANCH MANAGER VIEW -->
    <div v-if="isBranchUser" class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openBranchDropdown = null">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <div>
          <div class="text-[11px] text-gray-400 mb-1">
            Branch Manager / Orders / <span class="font-medium text-gray-600">Orders</span>
          </div>
          <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Orders</h1>
          <p class="text-xs text-gray-500 mt-1">Manage branch orders from confirmation through delivery and returns.</p>
        </div>
        <button 
          @click="openCreateModal" 
          class="bg-[#165A31] text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <Plus class="w-4 h-4" /> <span>Create Sale</span>
        </button>
      </div>

      <!-- 4 KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="(kpi, index) in branchKpis" :key="index" class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div class="text-xs font-semibold text-gray-400 mb-3">{{ kpi.label }}</div>
          <div>
            <div class="text-[26px] font-bold text-gray-900 leading-tight">{{ kpi.value }}</div>
            <div class="text-[11px] font-semibold text-[#165A31] mt-1">{{ kpi.sub }}</div>
          </div>
        </div>
      </div>

      <!-- Filters & Search Row -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex flex-wrap items-center gap-2">
          <!-- Search Input -->
          <div class="relative w-48 sm:w-60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              v-model="branchSearchQuery"
              type="text" 
              placeholder="Search orders, customer..." 
              class="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
            />
          </div>

          <!-- Status Dropdown -->
          <div class="relative">
            <button 
              @click.stop="toggleBranchDropdown('status')"
              class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            >
              <span>Status: {{ branchStatusFilter }}</span>
              <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
            </button>
            <div 
              v-if="openBranchDropdown === 'status'" 
              class="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <button 
                v-for="st in ['All', 'Ready', 'Partial', 'Completed']" 
                :key="st"
                @click="branchStatusFilter = st; openBranchDropdown = null"
                class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
                :class="branchStatusFilter === st ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
              >
                <span>{{ st }}</span>
                <Check v-if="branchStatusFilter === st" class="w-3.5 h-3.5 text-[#165A31]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Branch Orders Table Card -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <h3 class="text-sm font-bold text-gray-900 mb-5">Branch Orders</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="text-[10px] font-bold text-gray-400 border-b border-gray-100 pb-3 uppercase tracking-wider">
                <th class="pb-3 font-semibold w-36">Order</th>
                <th class="pb-3 font-semibold w-48">Customer</th>
                <th class="pb-3 font-semibold w-48">Product</th>
                <th class="pb-3 font-semibold w-36">Total</th>
                <th class="pb-3 font-semibold w-36">Status</th>
                <th class="pb-3 font-semibold w-28 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="text-xs divide-y divide-gray-50">
              <tr 
                v-for="(item, index) in filteredBranchOrders" 
                :key="index" 
                @click="router.push(`/sales/orders/detail?id=${item.order}`)"
                class="hover:bg-gray-50/50 transition-colors cursor-pointer"
              >
                <td class="py-4 align-middle font-medium text-gray-900">
                  {{ item.order }}
                </td>
                <td class="py-4 align-middle text-gray-800 font-medium">
                  {{ item.customer }}
                </td>
                <td class="py-4 align-middle text-gray-700 font-medium">
                  {{ item.product }}
                </td>
                <td class="py-4 align-middle text-gray-900 font-bold">
                  {{ item.total }}
                </td>
                <td class="py-4 align-middle">
                  <span class="px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap" :class="item.statusClass">
                    {{ item.status }}
                  </span>
                </td>
                <td class="py-4 align-middle text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-3 text-gray-400">
                    <button 
                      @click.stop="openEditModal(item)" 
                      title="Edit Order" 
                      class="hover:text-[#165A31] transition-colors cursor-pointer"
                    >
                      <Pencil class="w-4 h-4" />
                    </button>
                    <button 
                      @click.stop="router.push(`/sales/orders/detail?id=${item.order}`)" 
                      class="text-xs font-medium text-gray-400 hover:text-gray-700 cursor-pointer flex items-center justify-end gap-0.5"
                    >
                      Open &rsaquo;
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredBranchOrders.length === 0">
                <td colspan="6" class="text-center py-10 text-gray-500">
                  <p class="text-xs font-semibold text-gray-700">No orders found matching the criteria</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- SUPER ADMIN VIEW -->
    <div v-else class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openDropdown = null">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <div>
          <div class="text-[10px] text-gray-500 mb-1">
            Super Admin / Sales & CRM / <span class="font-bold text-gray-800">Orders</span>
          </div>
          <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Orders</h1>
          <p class="text-sm text-gray-500 mt-1">
            Track confirmed sales from payment through reservation and handover.
          </p>
        </div>
        <button @click="openCreateModal" class="bg-[#165A31] text-white text-[11px] font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer">
          <Plus class="w-4 h-4" /> <span>Create Order</span>
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
                :disabled="isBranchUser"
                class="px-3 py-1.5 text-[12px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] disabled:opacity-75 disabled:cursor-not-allowed"
              >
                <span>Branch: {{ selectedBranch }}</span>
                <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
              </button>

              <div 
                v-if="openDropdown === 'branch'" 
                class="absolute left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20 text-[12px]"
              >
                <div 
                  v-for="branch in branchOptions" 
                  :key="branch"
                  @click="selectedBranch = branch; openDropdown = null"
                  class="px-3 py-2 hover:bg-[#eefcf2] hover:text-[#165A31] cursor-pointer flex items-center justify-between"
                  :class="selectedBranch === branch ? 'text-[#165A31] font-bold' : 'text-gray-700'"
                >
                  <span>{{ branch }}</span>
                  <Check v-if="selectedBranch === branch" class="w-3.5 h-3.5 text-[#165A31]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Status Filter Tabs -->
        <div class="px-4 py-2 border-b border-gray-100 flex flex-wrap items-center gap-2">
          <button 
            v-for="tab in tabs" 
            :key="tab"
            @click="activeTab = tab"
            :class="[
              'px-3 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer',
              activeTab === tab ? 'bg-[#165A31] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            {{ tab }}
          </button>
        </div>

        <!-- Orders Table -->
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
                @click="router.push(`/sales/orders/detail?id=${order.orderNo}`)"
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
                  <div class="flex items-center justify-end gap-3 text-gray-400">
                    <button 
                      @click.stop="openEditModal(order)" 
                      title="Edit Order" 
                      class="hover:text-[#165A31] transition-colors cursor-pointer"
                    >
                      <Pencil class="w-4 h-4" />
                    </button>
                    <button 
                      @click.stop="router.push(`/sales/orders/detail?id=${order.orderNo}`)" 
                      class="text-[#165A31] hover:underline font-semibold cursor-pointer"
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>

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
    </div>

    <!-- Create / Edit Modal Popup -->
    <CreateSaleModal 
      v-if="showCreateModal" 
      :order="selectedOrderToEdit"
      :customer="initialCustomer"
      @close="showCreateModal = false" 
      @created="handleOrderCreated"
      @updated="handleOrderUpdated"
    />
  </div>
</template>
