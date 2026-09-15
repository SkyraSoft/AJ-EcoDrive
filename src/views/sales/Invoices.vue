<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search, ChevronDown, Check } from 'lucide-vue-next'

const router = useRouter()

const searchQuery = ref('')
const selectedBranch = ref('All Branches')
const selectedStatus = ref('All Statuses')
const openDropdown = ref(null)

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const invoices = ref([
  {
    invoiceNo: 'INV-4402',
    orderNo: 'SO-7731',
    branch: 'Islamabad',
    customer: 'Saad Ahmad',
    amount: '185K',
    issued: 'Aug 27',
    paymentStatus: 'Paid',
    statusColor: 'bg-[#eefcf2] text-[#165A31]'
  },
  {
    invoiceNo: 'INV-4394',
    orderNo: 'SO-7719',
    branch: 'Peshawar',
    customer: 'Faisal Khan',
    amount: '175K',
    issued: 'Aug 25',
    paymentStatus: 'Paid',
    statusColor: 'bg-[#eefcf2] text-[#165A31]'
  },
  {
    invoiceNo: 'INV-4388',
    orderNo: 'SO-7710',
    branch: 'Lahore',
    customer: 'M. Bilal',
    amount: '275K',
    issued: 'Aug 20',
    paymentStatus: 'Unpaid',
    statusColor: 'bg-yellow-50 text-yellow-700'
  }
])

const filteredInvoices = computed(() => {
  return invoices.value.filter(item => {
    // Branch Filter
    if (selectedBranch.value !== 'All Branches' && item.branch !== selectedBranch.value) {
      return false
    }

    // Status Filter
    if (selectedStatus.value !== 'All Statuses' && item.paymentStatus.toLowerCase() !== selectedStatus.value.toLowerCase()) {
      return false
    }

    // Search Query
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = 
        item.invoiceNo.toLowerCase().includes(q) ||
        item.orderNo.toLowerCase().includes(q) ||
        item.customer.toLowerCase().includes(q) ||
        item.branch.toLowerCase().includes(q)
      if (!match) return false
    }

    return true
  })
})

const resetFilters = () => {
  selectedBranch.value = 'All Branches'
  selectedStatus.value = 'All Statuses'
  searchQuery.value = ''
}

const handleOpen = (invoiceNo) => {
  router.push(`/sales/invoices/detail`)
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openDropdown = null">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Sales & CRM / <span class="font-bold text-gray-800">Invoices</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Invoices</h1>
        <p class="text-sm text-gray-500 mt-1">Review issued sales invoices and linked orders.</p>
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
                v-for="status in ['All Statuses', 'Paid', 'Unpaid']"
                :key="status"
                @click="selectedStatus = status; openDropdown = null"
                class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                :class="selectedStatus === status ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
              >
                <span>{{ status }}</span>
                <Check v-if="selectedStatus === status" class="w-3.5 h-3.5 text-[#165A31]" />
              </button>
            </div>
          </div>

          <!-- Search Input -->
          <div class="relative flex-1 max-w-[300px]">
            <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search invoice #, order, customer..." 
              class="w-full pl-9 pr-4 py-1.5 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)]" 
            />
          </div>
        </div>

        <button 
          v-if="selectedBranch !== 'All Branches' || selectedStatus !== 'All Statuses' || searchQuery"
          @click="resetFilters" 
          class="text-[11px] text-[#165A31] font-semibold hover:underline cursor-pointer"
        >
          Reset Filters
        </button>
      </div>

      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-[14px] font-bold text-gray-900">Invoices ({{ filteredInvoices.length }})</h2>
        </div>

        <div class="border border-gray-100 rounded-xl overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th class="px-5 py-3">Invoice</th>
                <th class="px-5 py-3">Order</th>
                <th class="px-5 py-3">Branch</th>
                <th class="px-5 py-3">Customer</th>
                <th class="px-5 py-3">Amount</th>
                <th class="px-5 py-3">Issued</th>
                <th class="px-5 py-3 text-center">Payment Status</th>
                <th class="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr 
                v-for="invoice in filteredInvoices" 
                :key="invoice.invoiceNo" 
                class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
                @click="handleOpen(invoice.invoiceNo)"
              >
                <td class="px-5 py-4 text-gray-900 font-bold">{{ invoice.invoiceNo }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ invoice.orderNo }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ invoice.branch }}</td>
                <td class="px-5 py-4 text-gray-800 font-semibold">{{ invoice.customer }}</td>
                <td class="px-5 py-4 text-gray-900 font-bold">{{ invoice.amount }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ invoice.issued }}</td>
                <td class="px-5 py-4 text-center">
                  <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold', invoice.statusColor]">
                    {{ invoice.paymentStatus }}
                  </span>
                </td>
                <td class="px-5 py-4 text-right text-gray-500 font-medium">
                  <button @click.stop="handleOpen(invoice.invoiceNo)" class="text-[#165A31] hover:underline font-semibold cursor-pointer">Open</button>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-if="filteredInvoices.length === 0">
                <td colspan="8" class="text-center py-12 text-gray-500">
                  <div class="space-y-2">
                    <p class="text-xs font-semibold text-gray-700">No invoices found matching the selected filters</p>
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
