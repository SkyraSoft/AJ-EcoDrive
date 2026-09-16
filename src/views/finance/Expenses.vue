<script setup>
import { ref, computed } from 'vue'
import { ChevronDown, CheckCircle2 } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { store } from '@/store'
import CreateExpense from './CreateExpense.vue'

const router = useRouter()
const showCreateExpense = ref(false)
const showToast = ref(false)
const toastMessage = ref('')

const activeFilterTab = ref('All')
const filterTabs = ['All', 'Pending', 'Approved', 'Paid', 'Rejected']
const searchQuery = ref('')
const selectedBranch = ref('All Branches')
const selectedCategory = ref('All Categories')
const openDropdown = ref(null)

const branches = ['All Branches', 'Peshawar', 'Islamabad', 'Lahore']
const categories = ['All Categories', 'Utilities', 'Rent', 'Marketing', 'Logistics', 'Maintenance']

const kpis = [
  { label: 'Period Expenses', value: 'PKR 3.2M' },
  { label: 'Pending', value: '9' },
  { label: 'Approved', value: '114' },
  { label: 'Recurring', value: '27' }
]

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
    // Branch Authorization Scoping
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
  router.push('/finance/expenses/detail')
}

const handleExpenseCreated = (newExpense) => {
  toastMessage.value = `Expense ${newExpense.id} recorded successfully!`
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 4000)
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openDropdown = null">
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
        @click="showCreateExpense = true" 
        class="bg-[#165A31] text-white text-[11px] font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer"
      >
        + Record Expense
      </button>
    </div>

    <!-- 4 KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="(kpi, index) in kpis" :key="index" class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <div class="text-xs font-semibold text-gray-400 mb-2">{{ kpi.label }}</div>
        <div class="text-[22px] font-bold text-gray-900 leading-none">{{ kpi.value }}</div>
      </div>
    </div>

    <!-- Filters & Table -->
    <div class="space-y-4">
      <!-- Filter Bar -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
          <button 
            v-for="tab in filterTabs" 
            :key="tab"
            @click="activeFilterTab = tab"
            class="px-4 py-1.5 text-[11px] font-medium rounded transition-colors cursor-pointer"
            :class="activeFilterTab === tab ? 'bg-[#eefcf2] text-[#165A31] font-bold' : 'text-gray-500 hover:text-gray-900'"
          >
            {{ tab }}
          </button>
        </div>

        <div class="flex items-center gap-3">
          <!-- Search -->
          <div class="relative w-full sm:w-60 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search expense, vendor..." 
              class="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[11px] placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
            />
          </div>

          <!-- Branch Dropdown -->
          <div class="relative">
            <button 
              @click.stop="toggleDropdown('branch')"
              class="flex items-center gap-2 text-xs font-medium text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:bg-gray-50 transition-colors"
              :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedBranch !== 'All Branches' }"
            >
              <span>{{ selectedBranch }}</span>
              <ChevronDown class="w-3 h-3 text-gray-400" />
            </button>
            <div v-if="openDropdown === 'branch'" class="absolute right-0 mt-1 w-40 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
              <button 
                v-for="b in branches" 
                :key="b" 
                @click.stop="selectFilter('branch', b)"
                class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700"
                :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedBranch === b }"
              >
                {{ b }}
              </button>
            </div>
          </div>

          <!-- Category Dropdown -->
          <div class="relative">
            <button 
              @click.stop="toggleDropdown('category')"
              class="flex items-center gap-2 text-xs font-medium text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:bg-gray-50 transition-colors"
              :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedCategory !== 'All Categories' }"
            >
              <span>{{ selectedCategory }}</span>
              <ChevronDown class="w-3 h-3 text-gray-400" />
            </button>
            <div v-if="openDropdown === 'category'" class="absolute right-0 mt-1 w-40 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
              <button 
                v-for="c in categories" 
                :key="c" 
                @click.stop="selectFilter('category', c)"
                class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700"
                :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedCategory === c }"
              >
                {{ c }}
              </button>
            </div>
          </div>

          <button 
            v-if="searchQuery || activeFilterTab !== 'All' || selectedBranch !== 'All Branches' || selectedCategory !== 'All Categories'" 
            @click="resetFilters" 
            class="text-[11px] font-semibold text-gray-500 hover:text-red-600 px-2 py-1 transition-colors cursor-pointer"
          >
            Clear
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
                <th class="px-5 py-3">Expense</th>
                <th class="px-5 py-3">Branch</th>
                <th class="px-5 py-3">Category</th>
                <th class="px-5 py-3">Vendor</th>
                <th class="px-5 py-3">Amount</th>
                <th class="px-5 py-3">Date</th>
                <th class="px-5 py-3">Approval</th>
                <th class="px-5 py-3">Payment</th>
                <th class="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr 
                v-for="item in filteredExpenses" 
                :key="item.id" 
                @click="openExpenseDetail(item)"
                class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer group"
              >
                <td class="px-5 py-4 font-semibold text-gray-900 group-hover:text-[#165A31] transition-colors">{{ item.id }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.branch }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.category }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.vendor }}</td>
                <td class="px-5 py-4 text-gray-900 font-bold">{{ item.amount }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.date }}</td>
                <td class="px-5 py-4">
                  <span class="inline-flex items-center px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold" :class="item.approvalClass">
                    {{ item.approval }}
                  </span>
                </td>
                <td class="px-5 py-4">
                  <span class="text-[10px]" :class="item.paymentClass">{{ item.payment }}</span>
                </td>
                <td class="px-5 py-4 text-right">
                  <div class="flex items-center justify-end gap-1 text-gray-400 group-hover:text-[#165A31] font-medium tracking-wide">
                    <span>Open</span>
                    <span class="text-sm leading-none">&rarr;</span>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredExpenses.length === 0">
                <td colspan="9" class="text-center py-12 text-gray-500">
                  <div class="flex flex-col items-center justify-center">
                    <span class="text-2xl mb-2">🔍</span>
                    <p class="text-sm font-semibold text-gray-700">No expenses found</p>
                    <p class="text-xs text-gray-400 mt-1">Try adjusting your filters or search query</p>
                    <button @click="resetFilters" class="mt-3 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors">
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

    <!-- Create Expense Modal -->
    <CreateExpense 
      v-if="showCreateExpense" 
      @close="showCreateExpense = false" 
      @created="handleExpenseCreated"
    />

    <!-- Nested routes support -->
    <router-view />
  </div>
</template>
