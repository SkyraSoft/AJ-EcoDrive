<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ChevronDown, Check, CheckCircle2, Pencil, Search, Plus } from 'lucide-vue-next'
import { store } from '../../store.js'
import CreatePaymentModal from './CreatePayment.vue'

const router = useRouter()
const route = useRoute()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const showCreateModal = ref(false)
const selectedPaymentToEdit = ref(null)
const initialCustomer = ref(null)
const showToast = ref(false)
const toastMessage = ref('')

onMounted(() => {
  if (route.query.action === 'new' || route.query.customer) {
    initialCustomer.value = route.query.customer || null
    showCreateModal.value = true
  }
})

// Branch Manager Data
const branchKpis = [
  { label: 'Collected', value: 'PKR 8.7M', sub: 'This month' },
  { label: 'Cash', value: 'PKR 1.4M', sub: '16%' },
  { label: 'Bank', value: 'PKR 6.8M', sub: '78%' },
  { label: 'Unreconciled', value: '3', sub: 'Review required' }
]

const branchPayments = computed(() => {
  const branchName = user.value?.branchName || 'Peshawar'
  return store.payments
    .filter(p => !p.branch || p.branch === branchName || p.branch.toLowerCase().includes(branchName.toLowerCase()))
    .map(p => ({
      ...p,
      payment: p.id || p.payment || p.paymentNo,
      statusClass: (p.status === 'Reconciled' || p.status === 'Posted') ? 'bg-[#dcfce7] text-[#165A31]' : 'bg-[#fef3c7] text-[#b45309]'
    }))
})

const branchStatusFilter = ref('All')
const branchSearchQuery = ref('')
const openBranchDropdown = ref(null)

const toggleBranchDropdown = (name) => {
  openBranchDropdown.value = openBranchDropdown.value === name ? null : name
}

const filteredBranchPayments = computed(() => {
  return branchPayments.value.filter(item => {
    if (branchStatusFilter.value !== 'All' && item.status.toLowerCase() !== branchStatusFilter.value.toLowerCase()) {
      return false
    }
    if (branchSearchQuery.value.trim()) {
      const q = branchSearchQuery.value.toLowerCase()
      const match = (item.payment && item.payment.toLowerCase().includes(q)) ||
                    (item.customer && item.customer.toLowerCase().includes(q)) ||
                    (item.order && item.order.toLowerCase().includes(q)) ||
                    (item.method && item.method.toLowerCase().includes(q))
      if (!match) return false
    }
    return true
  })
})

const openCreateModal = () => {
  selectedPaymentToEdit.value = null
  store.originalEditPayment = null
  showCreateModal.value = true
}

const openEditModal = (item) => {
  selectedPaymentToEdit.value = item
  store.originalEditPayment = item
  showCreateModal.value = true
}

const handlePaymentCreated = (newPayment) => {
  if (!store.payments.some(p => (p.id && p.id === (newPayment.id || newPayment.payment)) || (p.payment_id && p.payment_id === (newPayment.id || newPayment.payment)))) {
    store.addPayment(newPayment)
  }
  toastMessage.value = `Payment ${newPayment.id || newPayment.payment || newPayment.paymentNo} recorded successfully!`
  showToast.value = true
  showCreateModal.value = false
  setTimeout(() => { showToast.value = false }, 4000)
}

const handlePaymentUpdated = (updatedPayment) => {
  store.updatePayment(updatedPayment)
  toastMessage.value = `Payment ${updatedPayment.id || updatedPayment.payment || updatedPayment.paymentNo} updated successfully!`
  showToast.value = true
  showCreateModal.value = false
  setTimeout(() => { showToast.value = false }, 4000)
}

// Super Admin Data
const searchQuery = ref('')
const selectedBranch = ref('All Branches')
const selectedMethod = ref('All Methods')
const openDropdown = ref(null)

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const summaryCards = [
  { label: 'Collected This Month', value: 'PKR 25.5M' },
  { label: 'Unallocated', value: 'PKR 0' },
  { label: 'Refunded', value: 'PKR 0.4M' },
  { label: 'Outstanding', value: 'PKR 2.9M' }
]

const payments = computed(() => {
  return store.payments.map(p => ({
    ...p,
    paymentNo: p.id || p.paymentNo || p.payment,
    orderNo: p.orderNo || p.order || 'SO-7740',
    statusColor: (p.status === 'Posted' || p.status === 'Reconciled') ? 'bg-[#eefcf2] text-[#165A31]' : 'bg-[#fef3c7] text-[#b45309]'
  }))
})

const filteredPayments = computed(() => {
  return payments.value.filter(item => {
    if (selectedBranch.value !== 'All Branches' && item.branch !== selectedBranch.value) return false
    if (selectedMethod.value !== 'All Methods' && item.method !== selectedMethod.value) return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = 
        item.paymentNo.toLowerCase().includes(q) ||
        item.orderNo.toLowerCase().includes(q) ||
        item.customer.toLowerCase().includes(q) ||
        item.branch.toLowerCase().includes(q) ||
        item.method.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })
})

const resetFilters = () => {
  selectedBranch.value = 'All Branches'
  selectedMethod.value = 'All Methods'
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
          Branch Manager / Payments / <span class="font-medium text-gray-600">Payments</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Payments</h1>
        <p class="text-xs text-gray-500 mt-1">{{ user?.branchName || 'Peshawar' }} Branch records only.</p>
      </div>
      <button 
        @click="openCreateModal" 
        class="bg-[#165A31] text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
      >
        <Plus class="w-4 h-4" /> <span>Record Payment</span>
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

    <!-- Filter Buttons Row -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex flex-wrap items-center gap-2">
        <!-- Search Input -->
        <div class="relative w-48 sm:w-60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            v-model="branchSearchQuery"
            type="text" 
            placeholder="Search payments..." 
            class="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
          />
        </div>

        <!-- Status Dropdown -->
        <div class="relative">
          <button 
            @click.stop="toggleBranchDropdown('status')"
            class="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center gap-1.5 hover:bg-gray-50 cursor-pointer"
          >
            <span>Status: {{ branchStatusFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div 
            v-if="openBranchDropdown === 'status'"
            class="absolute top-full left-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <button 
              v-for="st in ['All', 'Reconciled', 'Pending']"
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

        <button 
          v-if="branchSearchQuery || branchStatusFilter !== 'All'"
          @click="branchSearchQuery = ''; branchStatusFilter = 'All'"
          class="text-xs font-semibold text-gray-400 hover:text-red-600 px-2 py-1 transition-colors cursor-pointer"
        >
          Clear
        </button>
      </div>

      <div class="flex items-center gap-2">
        <button class="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer">
          Columns
        </button>
        <button class="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer">
          Export
        </button>
      </div>
    </div>

    <!-- Payments Table Card -->
    <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
      <h3 class="text-sm font-bold text-gray-900 mb-5">Payments</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="text-[10px] font-bold text-gray-400 border-b border-gray-100 pb-3 uppercase tracking-wider">
              <th class="pb-3 font-semibold w-36">Payment</th>
              <th class="pb-3 font-semibold w-48">Customer</th>
              <th class="pb-3 font-semibold w-48">Method</th>
              <th class="pb-3 font-semibold w-36">Amount</th>
              <th class="pb-3 font-semibold w-36">Status</th>
              <th class="pb-3 font-semibold w-24 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="text-xs divide-y divide-gray-50">
            <tr 
              v-for="(item, index) in filteredBranchPayments" 
              :key="index" 
              class="hover:bg-gray-50/50 transition-colors"
            >
              <td class="py-4 align-middle font-medium text-gray-900">
                {{ item.payment }}
              </td>
              <td class="py-4 align-middle text-gray-800 font-medium">
                {{ item.customer }}
              </td>
              <td class="py-4 align-middle text-gray-700 font-medium">
                {{ item.method }}
              </td>
              <td class="py-4 align-middle text-gray-900 font-bold">
                {{ item.amount }}
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
                    title="Edit Payment"
                    class="hover:text-[#165A31] transition-colors cursor-pointer"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>
                  <button 
                    @click.stop="router.push(`/sales/payments/detail?id=${item.payment}`)"
                    class="text-xs font-medium text-gray-400 hover:text-gray-700 cursor-pointer flex items-center justify-end gap-0.5"
                  >
                    Open &rsaquo;
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="filteredBranchPayments.length === 0">
              <td colspan="6" class="text-center py-12 text-gray-500">
                <p class="text-xs font-semibold text-gray-700">No payment records found</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create / Edit Payment Modal -->
    <CreatePaymentModal 
      v-if="showCreateModal" 
      :is-modal="true"
      :payment="selectedPaymentToEdit"
      @close="showCreateModal = false"
      @created="handlePaymentCreated"
      @updated="handlePaymentUpdated"
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
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Sales & CRM / <span class="font-bold text-gray-800">Payments</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Payments</h1>
        <p class="text-sm text-gray-500 mt-1">Track customer collections and payment allocation.</p>
      </div>
      <button 
        @click="openCreateModal" 
        class="bg-[#165A31] text-white text-[11px] font-bold px-4 py-2.5 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
      >
        <Plus class="w-4 h-4" /> <span>Record Payment</span>
      </button>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <div v-for="card in summaryCards" :key="card.label" class="p-5 bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <p class="text-[11px] font-medium text-gray-500 mb-1">{{ card.label }}</p>
        <h3 class="text-2xl font-bold text-gray-900">{{ card.value }}</h3>
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="p-6">
        <div class="border border-gray-100 rounded-xl overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th class="px-5 py-3">Payment</th>
                <th class="px-5 py-3">Order</th>
                <th class="px-5 py-3">Customer</th>
                <th class="px-5 py-3">Branch</th>
                <th class="px-5 py-3">Method</th>
                <th class="px-5 py-3">Amount</th>
                <th class="px-5 py-3">Date</th>
                <th class="px-5 py-3 text-center">Status</th>
                <th class="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="payment in filteredPayments" :key="payment.paymentNo" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td class="px-5 py-4 text-gray-900 font-bold">{{ payment.paymentNo }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ payment.orderNo }}</td>
                <td class="px-5 py-4 text-gray-800 font-semibold">{{ payment.customer }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ payment.branch }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ payment.method }}</td>
                <td class="px-5 py-4 text-gray-900 font-bold">{{ payment.amount }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ payment.date }}</td>
                <td class="px-5 py-4 text-center">
                  <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold', payment.statusColor]">
                    {{ payment.status }}
                  </span>
                </td>
                <td class="px-5 py-4 text-right">
                  <button 
                    @click.stop="openEditModal(payment)" 
                    title="Edit Payment"
                    class="hover:text-[#165A31] transition-colors cursor-pointer text-gray-400"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create / Edit Payment Modal -->
    <CreatePaymentModal 
      v-if="showCreateModal" 
      :is-modal="true"
      :payment="selectedPaymentToEdit"
      :customer="initialCustomer"
      @close="showCreateModal = false"
      @created="handlePaymentCreated"
      @updated="handlePaymentUpdated"
    />
  </div>
</template>
