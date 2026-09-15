<script setup>
import { ref, computed } from 'vue'
import { Search, ChevronDown, Check } from 'lucide-vue-next'

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

const payments = ref([
  {
    paymentNo: 'PAY-3318',
    orderNo: 'SO-7740',
    customer: 'Faisal Khan',
    branch: 'Peshawar',
    method: 'Bank Transfer',
    amount: '100K',
    date: 'Aug 27',
    status: 'Posted',
    statusColor: 'bg-[#eefcf2] text-[#165A31]'
  },
  {
    paymentNo: 'PAY-3308',
    orderNo: 'SO-7731',
    customer: 'Saad Ahmad',
    branch: 'Islamabad',
    method: 'Cash',
    amount: '185K',
    date: 'Aug 27',
    status: 'Posted',
    statusColor: 'bg-[#eefcf2] text-[#165A31]'
  },
  {
    paymentNo: 'PAY-3295',
    orderNo: 'SO-7724',
    customer: 'M. Bilal',
    branch: 'Lahore',
    method: 'Cheque',
    amount: '275K',
    date: 'Aug 26',
    status: 'Posted',
    statusColor: 'bg-[#eefcf2] text-[#165A31]'
  },
  {
    paymentNo: 'PAY-3280',
    orderNo: 'SO-7718',
    customer: 'Ali Raza',
    branch: 'Peshawar',
    method: 'Cash',
    amount: '50K',
    date: 'Aug 24',
    status: 'Pending Clearance',
    statusColor: 'bg-yellow-50 text-yellow-700'
  }
])

const filteredPayments = computed(() => {
  return payments.value.filter(item => {
    // Branch Filter
    if (selectedBranch.value !== 'All Branches' && item.branch !== selectedBranch.value) {
      return false
    }

    // Method Filter
    if (selectedMethod.value !== 'All Methods' && item.method !== selectedMethod.value) {
      return false
    }

    // Search Query
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
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openDropdown = null">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Sales & CRM / <span class="font-bold text-gray-800">Payments</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Payments</h1>
        <p class="text-sm text-gray-500 mt-1">Track customer collections and payment allocation.</p>
      </div>
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
      <!-- Filter Bar -->
      <div class="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-3 flex-1">
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
                class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                :class="selectedBranch === branch ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
              >
                <span>{{ branch }}</span>
                <Check v-if="selectedBranch === branch" class="w-3.5 h-3.5 text-[#165A31]" />
              </button>
            </div>
          </div>

          <!-- Method Dropdown -->
          <div class="relative" @click.stop>
            <button 
              @click="toggleDropdown('method')"
              class="px-3 py-1.5 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <span>{{ selectedMethod }}</span>
              <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
            </button>
            <div v-if="openDropdown === 'method'" class="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <button 
                v-for="m in ['All Methods', 'Bank Transfer', 'Cash', 'Cheque']"
                :key="m"
                @click="selectedMethod = m; openDropdown = null"
                class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                :class="selectedMethod === m ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
              >
                <span>{{ m }}</span>
                <Check v-if="selectedMethod === m" class="w-3.5 h-3.5 text-[#165A31]" />
              </button>
            </div>
          </div>

          <!-- Search Input -->
          <div class="relative flex-1 max-w-[300px]">
            <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search payment #, order, customer..." 
              class="w-full pl-9 pr-4 py-1.5 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)]" 
            />
          </div>
        </div>

        <button 
          v-if="selectedBranch !== 'All Branches' || selectedMethod !== 'All Methods' || searchQuery"
          @click="resetFilters" 
          class="text-[11px] text-[#165A31] font-semibold hover:underline cursor-pointer"
        >
          Reset Filters
        </button>
      </div>

      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-[14px] font-bold text-gray-900">Payments ({{ filteredPayments.length }})</h2>
        </div>

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
                <th class="px-5 py-3 text-right">Action</th>
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
                  <button class="text-[#165A31] hover:underline font-semibold cursor-pointer">Open</button>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-if="filteredPayments.length === 0">
                <td colspan="9" class="text-center py-12 text-gray-500">
                  <div class="space-y-2">
                    <p class="text-xs font-semibold text-gray-700">No payments found matching the selected filters</p>
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
  </div>
</template>
