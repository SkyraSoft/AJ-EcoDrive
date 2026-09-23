<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search, ChevronDown, Check, Plus, Pencil, CheckCircle2 } from 'lucide-vue-next'
import { store } from '@/store'
import CreateCustomOrderModal from './CreateCustomOrder.vue'

const router = useRouter()
const showCreateModal = ref(false)
const selectedOrderToEdit = ref(null)
const showToast = ref(false)
const toastMessage = ref('')

const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

// Branch Manager KPI Cards
const branchKPIs = computed(() => [
  { label: 'Open', value: '7', sub: '3 awaiting product', isGreen: true },
  { label: 'Deposits', value: 'PKR 540K', sub: 'Held against orders', isGreen: false },
  { label: 'Arriving', value: '3', sub: 'Next 14 days', isGreen: false },
  { label: 'Ready', value: '2', sub: 'Contact customers', isGreen: false }
])

// Branch Manager Orders List
const branchCustomOrders = computed(() => {
  const currentBranch = user.value?.branchName || 'Peshawar'
  return store.customOrders.filter(co => !co.branch || co.branch === currentBranch)
})

const branchStatusFilter = ref('All')
const branchDateFilter = ref('All')
const branchSavedFilter = ref('All')
const branchSearchQuery = ref('')
const openBranchDropdown = ref(null)

const toggleBranchDropdown = (name) => {
  openBranchDropdown.value = openBranchDropdown.value === name ? null : name
}

const filteredBranchOrders = computed(() => {
  return branchCustomOrders.value.filter(item => {
    if (branchStatusFilter.value !== 'All' && item.status.toLowerCase() !== branchStatusFilter.value.toLowerCase()) {
      return false
    }
    if (branchSearchQuery.value.trim()) {
      const q = branchSearchQuery.value.toLowerCase()
      const match = (item.orderNo && item.orderNo.toLowerCase().includes(q)) ||
                    (item.customer && item.customer.toLowerCase().includes(q)) ||
                    (item.requirement && item.requirement.toLowerCase().includes(q))
      if (!match) return false
    }
    return true
  })
})

const openCreateModal = () => {
  selectedOrderToEdit.value = null
  store.originalEditCustomOrder = null
  showCreateModal.value = true
}

const openEditModal = (item) => {
  selectedOrderToEdit.value = item
  store.originalEditCustomOrder = item
  showCreateModal.value = true
}

const handleOrderCreated = (newRecord) => {
  const record = store.addCustomOrder(newRecord)
  toastMessage.value = `Custom Order ${record.orderNo || record.id} created successfully!`
  showToast.value = true
  showCreateModal.value = false
  setTimeout(() => { showToast.value = false }, 4000)
}

const handleOrderUpdated = (updatedRecord) => {
  const record = store.updateCustomOrder(updatedRecord.orderNo || updatedRecord.id, updatedRecord)
  toastMessage.value = `Custom Order ${updatedRecord.orderNo || updatedRecord.id} updated successfully!`
  showToast.value = true
  showCreateModal.value = false
  setTimeout(() => { showToast.value = false }, 4000)
}

const openCustomOrderDetail = (item) => {
  router.push({
    path: '/sales/custom-orders/detail',
    query: { id: item.orderNo || item.id }
  })
}

// Super Admin Data
const searchQuery = ref('')
const selectedStatus = ref('All Statuses')
const selectedBranch = ref('All Branches')
const openDropdown = ref(null)

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const orders = computed(() => store.customOrders)

const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    if (selectedStatus.value !== 'All Statuses' && order.status.toLowerCase() !== selectedStatus.value.toLowerCase()) {
      return false
    }
    if (selectedBranch.value !== 'All Branches' && order.branch !== selectedBranch.value) {
      return false
    }
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
  <!-- BRANCH MANAGER VIEW -->
  <div v-if="isBranchUser" class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openBranchDropdown = null">
    <!-- Toast Notification -->
    <div 
      v-if="showToast" 
      class="fixed bottom-5 right-5 z-[110] bg-[#165A31] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200"
    >
      <CheckCircle2 class="w-5 h-5 text-green-300" />
      <span class="text-xs font-bold">{{ toastMessage }}</span>
    </div>

    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[11px] text-gray-400 mb-1">
          Branch Manager / Custom Orders / <span class="font-medium text-gray-600">Custom Orders</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Custom Orders</h1>
        <p class="text-xs text-gray-500 mt-1">Track customer-specific sourcing, deposits, arrivals and reservations.</p>
      </div>
      <button 
        @click="openCreateModal" 
        class="bg-[#165A31] text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
      >
        <Plus class="w-4 h-4" /> <span>Custom Order</span>
      </button>
    </div>

    <!-- 4 KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div 
        v-for="kpi in branchKPIs" 
        :key="kpi.label" 
        class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]"
      >
        <p class="text-[11px] font-medium text-gray-400">{{ kpi.label }}</p>
        <h3 class="text-2xl font-bold text-gray-900 mt-1.5">{{ kpi.value }}</h3>
        <p :class="['text-[11px] mt-1 font-medium', kpi.isGreen ? 'text-[#165A31]' : 'text-gray-400']">{{ kpi.sub }}</p>
      </div>
    </div>

    <!-- Filters & Action Bar -->
    <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
      <!-- Left Filters -->
      <div class="flex flex-wrap items-center gap-2">
        <!-- Search Input -->
        <div class="relative w-48 sm:w-60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            v-model="branchSearchQuery"
            type="text" 
            placeholder="Search custom orders..." 
            class="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
          />
        </div>

        <!-- Status Filter -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('status')"
            class="px-3 py-1.5 text-[11px] font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <span>Status: {{ branchStatusFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openBranchDropdown === 'status'" class="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button 
              v-for="status in ['All', 'Sourcing', 'Arrived', 'Ready', 'Fulfilled']"
              :key="status"
              @click="branchStatusFilter = status; openBranchDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
              :class="branchStatusFilter === status ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ status }}</span>
              <Check v-if="branchStatusFilter === status" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <button 
          v-if="branchSearchQuery || branchStatusFilter !== 'All'"
          @click="branchSearchQuery = ''; branchStatusFilter = 'All'"
          class="text-xs font-semibold text-gray-400 hover:text-red-600 px-2 py-1 transition-colors cursor-pointer"
        >
          Clear
        </button>
      </div>

      <!-- Right Action Buttons -->
      <div class="flex items-center gap-2">
        <button class="px-3 py-1.5 text-[11px] font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm">
          <span>Columns</span>
        </button>
        <button class="px-3 py-1.5 text-[11px] font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm">
          <span>Export</span>
        </button>
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
      <h3 class="text-sm font-bold text-gray-900">Custom Orders</h3>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-100 text-[11px] font-semibold text-gray-400">
              <th class="py-3 px-4">Custom Order</th>
              <th class="py-3 px-4">Customer</th>
              <th class="py-3 px-4">Requirement</th>
              <th class="py-3 px-4">Deposit</th>
              <th class="py-3 px-4">Status</th>
              <th class="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="text-xs divide-y divide-gray-50">
            <tr 
              v-for="order in filteredBranchOrders" 
              :key="order.orderNo" 
              class="hover:bg-gray-50/50 transition-colors"
            >
              <td class="py-4 px-4 font-semibold text-gray-900">{{ order.orderNo }}</td>
              <td class="py-4 px-4 font-medium text-gray-800">{{ order.customer }}</td>
              <td class="py-4 px-4 font-medium text-gray-600">{{ order.requirement || order.product }}</td>
              <td class="py-4 px-4 font-medium text-gray-700">{{ order.deposit }}</td>
              <td class="py-4 px-4">
                <span :class="['inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-semibold', order.statusClass]">
                  {{ order.status }}
                </span>
              </td>
              <td class="py-4 px-4 text-right">
                <div class="flex items-center justify-end gap-3 text-gray-400">
                  <button 
                    @click.stop="openEditModal(order)" 
                    title="Edit Custom Order"
                    class="hover:text-[#165A31] transition-colors cursor-pointer"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>
                  <button 
                    @click.stop="openCustomOrderDetail(order)" 
                    class="text-gray-500 hover:text-gray-900 text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    Open <span class="text-gray-400">›</span>
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="filteredBranchOrders.length === 0">
              <td colspan="6" class="text-center py-12 text-gray-500">
                <p class="text-xs font-semibold text-gray-700">No custom orders found matching the filter</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create / Edit Custom Order Modal -->
    <CreateCustomOrderModal 
      v-if="showCreateModal" 
      :is-modal="true" 
      :custom-order="selectedOrderToEdit"
      @close="showCreateModal = false" 
      @created="handleOrderCreated"
      @updated="handleOrderUpdated"
    />
  </div>

  <!-- SUPER ADMIN VIEW -->
  <div v-else class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openDropdown = null">
    <!-- Toast Notification -->
    <div 
      v-if="showToast" 
      class="fixed bottom-5 right-5 z-[110] bg-[#165A31] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200"
    >
      <CheckCircle2 class="w-5 h-5 text-green-300" />
      <span class="text-xs font-bold">{{ toastMessage }}</span>
    </div>

    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Sales & CRM / <span class="font-bold text-gray-800">Custom Orders / Reservations</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Custom Orders & Reservations</h1>
        <p class="text-sm text-gray-500 mt-1">Manage unfulfilled orders that require special procurement or backorders.</p>
      </div>
      <button 
        @click="openCreateModal" 
        class="bg-[#165A31] text-white text-[11px] font-bold px-4 py-2.5 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
      >
        <Plus class="w-4 h-4" /> <span>Create Custom Order</span>
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
                v-for="status in ['All Statuses', 'Procurement', 'Pending Quote', 'In Assembly', 'Sourcing', 'Arrived']"
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
              <th class="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr 
              v-for="order in filteredOrders" 
              :key="order.orderNo" 
              class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
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
                <div class="flex items-center justify-end gap-3 text-gray-400">
                  <button 
                    @click.stop="openEditModal(order)" 
                    title="Edit Order"
                    class="hover:text-[#165A31] transition-colors cursor-pointer"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>
                  <button 
                    @click.stop="router.push({ path: '/sales/custom-orders/detail', query: { id: order.orderNo || order.id } })" 
                    class="text-[#165A31] hover:underline font-semibold flex items-center justify-end gap-1 cursor-pointer"
                  >
                    Open &rarr;
                  </button>
                </div>
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

    <!-- Create / Edit Custom Order Modal -->
    <CreateCustomOrderModal 
      v-if="showCreateModal" 
      :is-modal="true" 
      :custom-order="selectedOrderToEdit"
      @close="showCreateModal = false" 
      @created="handleOrderCreated"
      @updated="handleOrderUpdated"
    />
  </div>
</template>
