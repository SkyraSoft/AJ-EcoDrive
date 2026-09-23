<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDown, Search, Check, CheckCircle2, Plus } from 'lucide-vue-next'
import { store } from '../../store.js'
import CreateInvoiceModal from './CreateInvoice.vue'

const router = useRouter()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const showToast = ref(false)
const toastMessage = ref('')
const showCreateModal = ref(false)
const invoiceToEdit = ref(null)

const handleInvoiceCreated = (invoice) => {
  store.addInvoice(invoice)
  toastMessage.value = `Custom invoice ${invoice.invoiceNo || invoice.invoice} generated successfully`
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3000)
}

const handleInvoiceUpdated = (invoice) => {
  store.updateInvoice(invoice)
  toastMessage.value = `Invoice ${invoice.invoiceNo || invoice.invoice} updated successfully`
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3000)
}

const openCreateModal = () => {
  invoiceToEdit.value = null
  showCreateModal.value = true
}

// Branch Manager Data
const branchKpis = [
  { label: 'Paid', value: '31', sub: 'This month' },
  { label: 'Partial', value: '4', sub: 'PKR 280K due' },
  { label: 'Unpaid', value: '3', sub: 'PKR 410K due' },
  { label: 'Overdue', value: '1', sub: 'Follow up today' }
]

const branchInvoices = computed(() => {
  const branchName = user.value?.branchName || 'Peshawar'
  return store.invoices
    .filter(i => !i.branch || i.branch === branchName || i.branch.toLowerCase().includes(branchName.toLowerCase()))
    .map(i => ({
      ...i,
      invoice: i.id || i.invoiceNo || i.invoice,
      statusClass: (i.status || i.paymentStatus) === 'Paid' ? 'bg-[#dcfce7] text-[#165A31]' : ((i.status || i.paymentStatus) === 'Partial' ? 'bg-[#fef3c7] text-[#b45309]' : ((i.status || i.paymentStatus) === 'Overdue' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-700'))
    }))
})

const branchStatusFilter = ref('All')
const branchDateFilter = ref('Date')
const branchSavedFilter = ref('Saved Filters')
const branchAmountFilter = ref('All Amounts')
const branchSearchQuery = ref('')
const openBranchDropdown = ref(null)

const toggleBranchDropdown = (name) => {
  openBranchDropdown.value = openBranchDropdown.value === name ? null : name
}

const selectBranchSavedFilter = (filterName) => {
  branchSavedFilter.value = filterName
  if (filterName === 'All Invoices' || filterName === 'Saved Filters') {
    branchStatusFilter.value = 'All'
    branchAmountFilter.value = 'All Amounts'
  } else if (filterName === 'Paid Invoices') {
    branchStatusFilter.value = 'Paid'
  } else if (filterName === 'Unpaid & Partial') {
    branchStatusFilter.value = 'Unpaid'
  } else if (filterName === 'Overdue Invoices') {
    branchStatusFilter.value = 'Overdue'
  }
  openBranchDropdown.value = null
}

const hasActiveBranchFilters = computed(() => {
  return branchStatusFilter.value !== 'All' ||
         branchDateFilter.value !== 'Date' ||
         branchSavedFilter.value !== 'Saved Filters' ||
         branchAmountFilter.value !== 'All Amounts' ||
         branchSearchQuery.value.trim() !== ''
})

const clearBranchFilters = () => {
  branchStatusFilter.value = 'All'
  branchDateFilter.value = 'Date'
  branchSavedFilter.value = 'Saved Filters'
  branchAmountFilter.value = 'All Amounts'
  branchSearchQuery.value = ''
  openBranchDropdown.value = null
}

const branchVisibleColumns = ref({
  invoice: true,
  customer: true,
  order: true,
  amount: true,
  status: true,
  actions: true
})

const toggleBranchColumn = (col) => {
  branchVisibleColumns.value[col] = !branchVisibleColumns.value[col]
}

const exportBranchInvoices = () => {
  openBranchDropdown.value = null
  const rows = filteredBranchInvoices.value
  if (!rows.length) {
    toastMessage.value = 'No invoices match the filter to export'
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 3000)
    return
  }
  const headers = ['Invoice #', 'Customer', 'Order #', 'Amount', 'Status']
  const csvContent = 'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map(i => [
      `"${(i.invoice || '').replace(/"/g, '""')}"`,
      `"${(i.customer || '').replace(/"/g, '""')}"`,
      `"${(i.order || '').replace(/"/g, '""')}"`,
      `"${(i.amount || '').replace(/"/g, '""')}"`,
      `"${(i.status || '').replace(/"/g, '""')}"`
    ].join(','))].join('\n')
  
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `branch_invoices_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  toastMessage.value = `Exported ${rows.length} invoice records to CSV`
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 4000)
}

const filteredBranchInvoices = computed(() => {
  return branchInvoices.value.filter(item => {
    if (branchStatusFilter.value !== 'All' && item.status.toLowerCase() !== branchStatusFilter.value.toLowerCase()) {
      return false
    }
    if (branchAmountFilter.value === 'Under PKR 200k') {
      const num = parseInt((item.amount || '').replace(/[^0-9]/g, '')) || 0
      if (num >= 200000) return false
    } else if (branchAmountFilter.value === 'PKR 200k - 300k') {
      const num = parseInt((item.amount || '').replace(/[^0-9]/g, '')) || 0
      if (num < 200000 || num > 300000) return false
    } else if (branchAmountFilter.value === 'Above PKR 300k') {
      const num = parseInt((item.amount || '').replace(/[^0-9]/g, '')) || 0
      if (num < 300000) return false
    }
    if (branchSearchQuery.value.trim()) {
      const q = branchSearchQuery.value.toLowerCase()
      const match = (item.invoice && item.invoice.toLowerCase().includes(q)) ||
                    (item.customer && item.customer.toLowerCase().includes(q)) ||
                    (item.order && item.order.toLowerCase().includes(q)) ||
                    (item.amount && item.amount.toLowerCase().includes(q))
      if (!match) return false
    }
    return true
  })
})

// Super Admin Data
const searchQuery = ref('')
const selectedBranch = ref('All Branches')
const selectedStatus = ref('All Statuses')
const openDropdown = ref(null)

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const invoices = computed(() => {
  return store.invoices.map(i => ({
    ...i,
    invoiceNo: i.id || i.invoiceNo || i.invoice,
    orderNo: i.orderNo || i.order || '-',
    branch: i.branch || 'Peshawar',
    customer: i.customer || 'Customer',
    amount: i.amount || 'PKR 185K',
    issued: i.issued || i.date || 'Aug 27',
    paymentStatus: i.paymentStatus || i.status || 'Paid',
    statusColor: (i.paymentStatus || i.status) === 'Paid' ? 'bg-[#eefcf2] text-[#165A31]' : 'bg-yellow-50 text-yellow-700'
  }))
})

const filteredInvoices = computed(() => {
  return invoices.value.filter(item => {
    if (selectedBranch.value !== 'All Branches' && item.branch !== selectedBranch.value) return false
    if (selectedStatus.value !== 'All Statuses' && item.paymentStatus.toLowerCase() !== selectedStatus.value.toLowerCase()) return false
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
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Invoices & Receivables</h1>
        <p class="text-sm text-gray-500 mt-1">Manage billing, track payments, and follow up on overdue amounts.</p>
      </div>
      <div class="flex items-center gap-3 w-full sm:w-auto">
        <button @click="openCreateModal" class="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#165A31] text-white px-4 py-2 text-[12px] font-bold rounded-lg hover:bg-[#124a28] transition-colors shadow-sm">
          <Plus class="w-4 h-4" /> Create Invoice
        </button>
      </div>
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
        <!-- Status Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('status')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <span>Status: {{ branchStatusFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openBranchDropdown === 'status'" class="absolute top-full left-0 mt-1 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button 
              v-for="st in ['All', 'Paid', 'Partial', 'Unpaid', 'Overdue']"
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

        <!-- Date Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('date')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <span>{{ branchDateFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openBranchDropdown === 'date'" class="absolute top-full left-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button 
              v-for="d in ['Date', 'Today', 'This Week', 'This Month', 'All Time']"
              :key="d"
              @click="branchDateFilter = d; openBranchDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
              :class="branchDateFilter === d ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ d }}</span>
              <Check v-if="branchDateFilter === d" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <!-- Saved Filters Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('saved')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <span>{{ branchSavedFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openBranchDropdown === 'saved'" class="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button 
              v-for="f in ['All Invoices', 'Paid Invoices', 'Unpaid & Partial', 'Overdue Invoices']"
              :key="f"
              @click="selectBranchSavedFilter(f)"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
              :class="branchSavedFilter === f ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ f }}</span>
              <Check v-if="branchSavedFilter === f" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <!-- Sub-filter: Amount Range Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('amount')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <span>Amount: {{ branchAmountFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openBranchDropdown === 'amount'" class="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button 
              v-for="am in ['All Amounts', 'Under PKR 200k', 'PKR 200k - 300k', 'Above PKR 300k']"
              :key="am"
              @click="branchAmountFilter = am; openBranchDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
              :class="branchAmountFilter === am ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ am }}</span>
              <Check v-if="branchAmountFilter === am" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <!-- Search Input -->
        <div class="relative w-44 sm:w-56 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            v-model="branchSearchQuery"
            type="text" 
            placeholder="Search invoice, customer, order..." 
            class="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
          />
        </div>

        <button 
          v-if="hasActiveBranchFilters"
          @click="clearBranchFilters"
          class="text-xs font-semibold text-gray-400 hover:text-red-600 px-2 py-1 transition-colors cursor-pointer"
        >
          Clear
        </button>
      </div>

      <!-- Right Side: Columns & Export -->
      <div class="flex items-center gap-2">
        <!-- Columns Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('columns')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center gap-1.5"
          >
            <span>Columns</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div 
            v-if="openBranchDropdown === 'columns'" 
            class="absolute top-full right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <div class="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 mb-1">
              Toggle Columns
            </div>
            <label 
              v-for="(val, key) in branchVisibleColumns" 
              :key="key"
              @click.stop="toggleBranchColumn(key)"
              class="flex items-center justify-between px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer select-none capitalize"
            >
              <span>{{ key === 'invoice' ? 'Invoice #' : key }}</span>
              <input 
                type="checkbox" 
                :checked="val" 
                class="accent-[#165A31] rounded cursor-pointer" 
              />
            </label>
          </div>
        </div>

        <!-- Export Button -->
        <button 
          @click="exportBranchInvoices"
          class="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center gap-1.5"
        >
          <span>Export</span>
        </button>
      </div>
    </div>

    <!-- Invoices Table Card -->
    <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
      <div class="flex items-center justify-between mb-5">
        <h3 class="text-sm font-bold text-gray-900">Invoices</h3>
        <span class="text-xs text-gray-400 font-medium">Showing {{ filteredBranchInvoices.length }} invoices</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="text-[10px] font-bold text-gray-400 border-b border-gray-100 pb-3 uppercase tracking-wider">
              <th v-if="branchVisibleColumns.invoice" class="pb-3 font-semibold">Invoice</th>
              <th v-if="branchVisibleColumns.customer" class="pb-3 font-semibold">Customer</th>
              <th v-if="branchVisibleColumns.order" class="pb-3 font-semibold">Order</th>
              <th v-if="branchVisibleColumns.amount" class="pb-3 font-semibold">Amount</th>
              <th v-if="branchVisibleColumns.status" class="pb-3 font-semibold">Status</th>
              <th v-if="branchVisibleColumns.actions" class="pb-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="text-xs divide-y divide-gray-50">
            <tr 
              v-for="(item, index) in filteredBranchInvoices" 
              :key="index" 
              @click="router.push(`/sales/invoices/detail?id=${item.invoice}`)"
              class="hover:bg-gray-50/50 transition-colors cursor-pointer"
            >
              <td v-if="branchVisibleColumns.invoice" class="py-4 align-middle font-medium text-gray-900">
                {{ item.invoice }}
              </td>
              <td v-if="branchVisibleColumns.customer" class="py-4 align-middle text-gray-800 font-medium">
                {{ item.customer }}
              </td>
              <td v-if="branchVisibleColumns.order" class="py-4 align-middle text-gray-700 font-medium">
                {{ item.order }}
              </td>
              <td v-if="branchVisibleColumns.amount" class="py-4 align-middle text-gray-900 font-bold">
                {{ item.amount }}
              </td>
              <td v-if="branchVisibleColumns.status" class="py-4 align-middle">
                <span class="px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap" :class="item.statusClass">
                  {{ item.status }}
                </span>
              </td>
              <td v-if="branchVisibleColumns.actions" class="py-4 align-middle text-right whitespace-nowrap">
                <button 
                  @click.stop="router.push(`/sales/invoices/detail?id=${item.invoice}`)"
                  class="text-xs font-medium text-gray-400 hover:text-gray-700 cursor-pointer flex items-center justify-end gap-0.5 ml-auto"
                >
                  Open &rsaquo;
                </button>
              </td>
            </tr>

            <tr v-if="filteredBranchInvoices.length === 0">
              <td colspan="6" class="text-center py-12 text-gray-500">
                <p class="text-xs font-semibold text-gray-700">No invoices found matching the filter</p>
                <button 
                  @click="clearBranchFilters"
                  class="mt-3 px-3 py-1.5 text-xs font-semibold text-[#165A31] bg-[#eefcf2] hover:bg-[#e2f9ea] rounded-lg transition-colors cursor-pointer"
                >
                  Clear all filters
                </button>
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
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Invoices</h1>
        <p class="text-sm text-gray-500 mt-1">Network-wide billing and collections oversight.</p>
      </div>
      <div class="flex items-center gap-3 w-full sm:w-auto">
        <button @click="openCreateModal" class="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#165A31] text-white px-4 py-2 text-[12px] font-bold rounded-lg hover:bg-[#124a28] transition-colors shadow-sm">
          <Plus class="w-4 h-4" /> Create Invoice
        </button>
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <!-- Filter Bar -->
      <div class="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-3 flex-1">
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
                @click="router.push(`/sales/invoices/detail?id=${invoice.invoiceNo}`)"
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
                  <button @click.stop="router.push(`/sales/invoices/detail?id=${invoice.invoiceNo}`)" class="text-[#165A31] hover:underline font-semibold cursor-pointer">Open</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <!-- Create Invoice Modal -->
    <CreateInvoiceModal
      v-if="showCreateModal"
      :isModal="true"
      :invoice="invoiceToEdit"
      @close="showCreateModal = false"
      @created="handleInvoiceCreated"
      @updated="handleInvoiceUpdated"
    />
  </div>
</template>
