<script setup>
import { ref, computed } from 'vue'
import { ChevronDown, CheckCircle2, Check, Search, Plus, Pencil, Eye } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { store } from '@/store'
import CreateExpenseModal from './CreateExpense.vue'

const router = useRouter()
const showCreateExpense = ref(false)
const selectedExpenseToEdit = ref(null)
const showToast = ref(false)
const toastMessage = ref('')

const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

// --- BRANCH MANAGER VIEW DATA ---
const branchKPIs = computed(() => {
  const currentBranch = user.value?.branchName || 'Peshawar'
  const branchList = store.expenses.filter(item => !item.branch || store.isBranchAllowed(item.branch))
  const submittedCount = branchList.length
  const pendingCount = branchList.filter(e => e.approval === 'Pending').length
  const paidCount = branchList.filter(e => e.payment === 'Paid').length
  return [
    { label: 'This Month', value: 'PKR 482K', subtext: '+6% vs prior', subtextClass: 'text-[#165A31] font-medium' },
    { label: 'Submitted', value: String(submittedCount || 8), subtext: 'PKR 116K', subtextClass: 'text-[#165A31] font-medium' },
    { label: 'Pending', value: String(pendingCount || 3), subtext: 'Needs management', subtextClass: 'text-gray-400 font-medium' },
    { label: 'Paid', value: String(paidCount || 21), subtext: 'PKR 331K', subtextClass: 'text-gray-400 font-medium' }
  ]
})

const branchStatusFilter = ref('All')
const branchDateFilter = ref('Date')
const branchSearchQuery = ref('')
const openBranchDropdown = ref(null)

const toggleBranchDropdown = (name) => {
  openBranchDropdown.value = openBranchDropdown.value === name ? null : name
}

const filteredBranchExpenses = computed(() => {
  return store.expenses.filter(item => {
    if (item.branch && !store.isBranchAllowed(item.branch)) {
      return false
    }
    if (branchStatusFilter.value !== 'All') {
      if (item.approval.toLowerCase() !== branchStatusFilter.value.toLowerCase() && item.payment.toLowerCase() !== branchStatusFilter.value.toLowerCase()) {
        return false
      }
    }
    if (branchSearchQuery.value.trim()) {
      const q = branchSearchQuery.value.toLowerCase()
      const match = item.id.toLowerCase().includes(q) ||
                    item.category.toLowerCase().includes(q) ||
                    item.vendor.toLowerCase().includes(q) ||
                    item.amount.toLowerCase().includes(q) ||
                    (item.description && item.description.toLowerCase().includes(q))
      if (!match) return false
    }
    return true
  })
})

const getBranchStatusBadgeClass = (approval, payment) => {
  if (approval === 'Approved' || payment === 'Paid') return 'bg-[#dcfce7] text-[#15803d]'
  if (approval === 'Pending') return 'bg-[#fef3c7] text-[#92400e]'
  if (approval === 'Rejected') return 'bg-red-50 text-red-700'
  return 'bg-gray-100 text-gray-700'
}

// --- SUPER ADMIN VIEW DATA ---
const activeFilterTab = ref('All')
const filterTabs = ['All', 'Pending', 'Approved', 'Paid', 'Rejected']
const searchQuery = ref('')
const selectedBranch = ref('All Branches')
const selectedCategory = ref('All Categories')
const openDropdown = ref(null)

const branches = ['All Branches', 'Peshawar', 'Islamabad', 'Lahore']
const categories = ['All Categories', 'Utilities', 'Rent', 'Marketing', 'Logistics', 'Maintenance']

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const selectFilter = (type, val) => {
  if (type === 'branch') selectedBranch.value = val
  if (type === 'category') selectedCategory.value = val
  openDropdown.value = null
}

const resetFilters = () => {
  activeFilterTab.value = 'All'
  searchQuery.value = ''
  selectedBranch.value = 'All Branches'
  selectedCategory.value = 'All Categories'
}

const filteredExpenses = computed(() => {
  return store.expenses.filter(item => {
    if (!store.isBranchAllowed(item.branch)) return false

    if (activeFilterTab.value === 'Pending' && item.approval !== 'Pending') return false
    if (activeFilterTab.value === 'Approved' && item.approval !== 'Approved') return false
    if (activeFilterTab.value === 'Paid' && item.payment !== 'Paid') return false
    if (activeFilterTab.value === 'Rejected' && item.approval !== 'Rejected') return false
    if (selectedBranch.value !== 'All Branches' && item.branch !== selectedBranch.value) return false
    if (selectedCategory.value !== 'All Categories' && item.category !== selectedCategory.value) return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = item.id.toLowerCase().includes(q) ||
                    item.branch.toLowerCase().includes(q) ||
                    item.category.toLowerCase().includes(q) ||
                    item.vendor.toLowerCase().includes(q) ||
                    item.amount.toLowerCase().includes(q) ||
                    item.approval.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })
})

const openExpenseDetail = (expense) => {
  store.selectExpense(expense)
  router.push({
    path: '/finance/expenses/detail',
    query: { id: expense.id }
  })
}

const openCreateModal = () => {
  selectedExpenseToEdit.value = null
  store.originalEditExpense = null
  showCreateExpense.value = true
}

const openEditModal = (expense) => {
  selectedExpenseToEdit.value = expense
  store.originalEditExpense = expense
  showCreateExpense.value = true
}

const handleExpenseCreated = (newExpense) => {
  toastMessage.value = `Expense ${newExpense.id} recorded successfully!`
  showToast.value = true
  showCreateExpense.value = false
  setTimeout(() => {
    showToast.value = false
  }, 4000)
}

const handleExpenseUpdated = (updatedExpense) => {
  toastMessage.value = `Expense ${updatedExpense.id} updated successfully!`
  showToast.value = true
  showCreateExpense.value = false
  setTimeout(() => {
    showToast.value = false
  }, 4000)
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
          Branch Manager / Expenses / <span class="font-medium text-gray-600">Expenses</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Expenses</h1>
        <p class="text-xs text-gray-500 mt-1">Capture and track {{ user?.branchName || 'Peshawar' }} Branch operating expenses and approval outcomes.</p>
      </div>

      <!-- Add Expense Button -->
      <button 
        @click="openCreateModal" 
        class="bg-[#165A31] text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
      >
        <Plus class="w-4 h-4" /> <span>Add Expense</span>
      </button>
    </div>

    <!-- 4 KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div 
        v-for="kpi in branchKPIs" 
        :key="kpi.label" 
        class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]"
      >
        <div class="text-[11px] font-semibold text-gray-500 mb-2">{{ kpi.label }}</div>
        <div class="text-2xl font-bold text-gray-900">{{ kpi.value }}</div>
        <div :class="['text-[11px] mt-1', kpi.subtextClass]">{{ kpi.subtext }}</div>
      </div>
    </div>

    <!-- Filters Row -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="flex flex-wrap items-center gap-2">
        <!-- Search Input -->
        <div class="relative w-48 sm:w-60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            v-model="branchSearchQuery"
            type="text" 
            placeholder="Search expenses..." 
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
            class="absolute top-full left-0 mt-1 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <button 
              v-for="st in ['All', 'Pending', 'Approved', 'Paid', 'Rejected']" 
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
        <div class="relative">
          <button 
            @click.stop="toggleBranchDropdown('date')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <span>{{ branchDateFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div 
            v-if="openBranchDropdown === 'date'" 
            class="absolute top-full left-0 mt-1 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
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

        <button 
          v-if="branchSearchQuery || branchStatusFilter !== 'All' || branchDateFilter !== 'Date'"
          @click="branchSearchQuery = ''; branchStatusFilter = 'All'; branchDateFilter = 'Date'"
          class="text-xs font-semibold text-gray-400 hover:text-red-600 px-2 py-1 transition-colors cursor-pointer"
        >
          Clear
        </button>
      </div>

      <div class="flex items-center gap-2">
        <button class="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          Columns
        </button>
        <button class="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          Export
        </button>
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
      <h3 class="text-sm font-bold text-gray-900">Branch Expenses</h3>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-100 text-[11px] font-semibold text-gray-400">
              <th class="py-3 px-4">Expense</th>
              <th class="py-3 px-4">Category</th>
              <th class="py-3 px-4">Vendor</th>
              <th class="py-3 px-4">Amount</th>
              <th class="py-3 px-4">Date</th>
              <th class="py-3 px-4">Status</th>
              <th class="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="text-xs divide-y divide-gray-50">
            <tr 
              v-for="item in filteredBranchExpenses" 
              :key="item.id" 
              class="hover:bg-gray-50/50 transition-colors"
            >
              <td class="py-4 px-4 font-semibold text-gray-900">{{ item.id }}</td>
              <td class="py-4 px-4 font-medium text-gray-800">{{ item.category }}</td>
              <td class="py-4 px-4 font-medium text-gray-600">{{ item.vendor }}</td>
              <td class="py-4 px-4 font-medium text-gray-600">{{ item.amount }}</td>
              <td class="py-4 px-4 font-medium text-gray-600">{{ item.date }}</td>
              <td class="py-4 px-4">
                <span :class="['inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-semibold', item.approvalClass || getBranchStatusBadgeClass(item.approval, item.payment)]">
                  {{ item.approval }}
                </span>
              </td>
              <td class="py-4 px-4 text-right">
                <div class="flex items-center justify-end gap-3 text-gray-400">
                  <button 
                    @click.stop="openEditModal(item)" 
                    title="Edit Expense" 
                    class="hover:text-[#165A31] transition-colors cursor-pointer"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>
                  <button 
                    @click.stop="openExpenseDetail(item)" 
                    class="text-gray-500 hover:text-gray-900 text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    Open <span class="text-gray-400">›</span>
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="filteredBranchExpenses.length === 0">
              <td colspan="7" class="text-center py-12 text-gray-500">
                <p class="text-xs font-semibold text-gray-700">No expenses found matching the filter</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create / Edit Expense Modal Popup -->
    <CreateExpenseModal 
      v-if="showCreateExpense" 
      :is-modal="true"
      :expense="selectedExpenseToEdit"
      @close="showCreateExpense = false" 
      @created="handleExpenseCreated"
      @updated="handleExpenseUpdated" 
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
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Finance / <span class="font-bold text-gray-800">Expenses</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Expenses</h1>
        <p class="text-sm text-gray-500 mt-1">Manage branch and company operating expenses with policy approval.</p>
      </div>
      <button 
        @click="openCreateModal" 
        class="bg-[#165A31] text-white text-[11px] font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer"
      >
        <Plus class="w-4 h-4" /> <span>Add Expense</span>
      </button>
    </div>

    <!-- Filters Bar -->
    <div class="space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <!-- Status Tabs -->
        <div class="flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-[0_2px_4px_rgba(0,0,0,0.01)] overflow-x-auto max-w-full">
          <button 
            v-for="tab in filterTabs" 
            :key="tab"
            @click="activeFilterTab = tab"
            class="px-3.5 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap cursor-pointer"
            :class="activeFilterTab === tab ? 'bg-[#eefcf2] text-[#165A31] font-bold' : 'text-gray-500 hover:text-gray-900'"
          >
            {{ tab }}
          </button>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <!-- Search Input -->
          <div class="relative w-48 sm:w-64 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
            <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search ID, vendor, category..." 
              class="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
            />
          </div>

          <!-- Branch Dropdown -->
          <div class="relative">
            <button 
              @click.stop="toggleDropdown('branch')"
              class="flex items-center gap-2 text-xs font-medium text-gray-700 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <span>{{ selectedBranch }}</span>
              <ChevronDown class="w-3 h-3 text-gray-400" />
            </button>
            <div v-if="openDropdown === 'branch'" class="absolute left-0 mt-1 w-40 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
              <button 
                v-for="b in branches" 
                :key="b" 
                @click.stop="selectFilter('branch', b)"
                class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700 flex items-center justify-between"
                :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedBranch === b }"
              >
                <span>{{ b }}</span>
                <Check v-if="selectedBranch === b" class="w-3.5 h-3.5 text-[#165A31]" />
              </button>
            </div>
          </div>

          <!-- Category Dropdown -->
          <div class="relative">
            <button 
              @click.stop="toggleDropdown('category')"
              class="flex items-center gap-2 text-xs font-medium text-gray-700 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <span>{{ selectedCategory }}</span>
              <ChevronDown class="w-3 h-3 text-gray-400" />
            </button>
            <div v-if="openDropdown === 'category'" class="absolute left-0 mt-1 w-40 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
              <button 
                v-for="c in categories" 
                :key="c" 
                @click.stop="selectFilter('category', c)"
                class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700 flex items-center justify-between"
                :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedCategory === c }"
              >
                <span>{{ c }}</span>
                <Check v-if="selectedCategory === c" class="w-3.5 h-3.5 text-[#165A31]" />
              </button>
            </div>
          </div>

          <button 
            v-if="searchQuery || activeFilterTab !== 'All' || selectedBranch !== 'All Branches' || selectedCategory !== 'All Categories'" 
            @click="resetFilters" 
            class="text-[11px] font-semibold text-gray-500 hover:text-red-600 px-2 py-1 transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <!-- Table Container -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-[13px] font-bold text-gray-900">Expenses</h3>
          <span class="text-[11px] text-gray-400 font-medium">{{ filteredExpenses.length }} records</span>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th class="px-5 py-3">Expense ID</th>
                <th class="px-5 py-3">Branch</th>
                <th class="px-5 py-3">Category</th>
                <th class="px-5 py-3">Vendor</th>
                <th class="px-5 py-3">Amount</th>
                <th class="px-5 py-3">Status</th>
                <th class="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr 
                v-for="expense in filteredExpenses" 
                :key="expense.id" 
                class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
              >
                <td class="px-5 py-4 font-bold text-gray-900">{{ expense.id }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ expense.branch }}</td>
                <td class="px-5 py-4 text-gray-800 font-semibold">{{ expense.category }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ expense.vendor }}</td>
                <td class="px-5 py-4 text-gray-900 font-bold">{{ expense.amount }}</td>
                <td class="px-5 py-4">
                  <span 
                    class="inline-flex items-center px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold" 
                    :class="expense.approvalClass || getBranchStatusBadgeClass(expense.approval, expense.payment)"
                  >
                    {{ expense.approval }}
                  </span>
                </td>
                <td class="px-5 py-4 text-right">
                  <div class="flex items-center justify-end gap-3 text-gray-400">
                    <button 
                      @click.stop="openEditModal(expense)" 
                      title="Edit Expense" 
                      class="hover:text-[#165A31] transition-colors cursor-pointer"
                    >
                      <Pencil class="w-4 h-4" />
                    </button>
                    <button 
                      @click.stop="openExpenseDetail(expense)" 
                      title="View Details" 
                      class="hover:text-[#165A31] transition-colors cursor-pointer"
                    >
                      <Eye class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredExpenses.length === 0">
                <td colspan="7" class="text-center py-12 text-gray-500">
                  <p class="text-xs font-semibold text-gray-700">No expenses found matching your criteria</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create / Edit Expense Modal Popup -->
    <CreateExpenseModal 
      v-if="showCreateExpense" 
      :is-modal="true"
      :expense="selectedExpenseToEdit"
      @close="showCreateExpense = false" 
      @created="handleExpenseCreated"
      @updated="handleExpenseUpdated" 
    />
  </div>
</template>
