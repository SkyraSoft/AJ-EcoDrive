<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search, ChevronDown, Check, Plus, Pencil, CheckCircle2 } from 'lucide-vue-next'
import { store } from '@/store'
import CreateCustomerModal from './CreateCustomer.vue'

const router = useRouter()
const showCreateModal = ref(false)
const selectedCustomerToEdit = ref(null)
const showToast = ref(false)
const toastMessage = ref('')

const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

// Branch Manager Data
const branchKPIs = computed(() => [
  { label: 'Customers', value: '1,284', change: '+34 this month', changeColor: 'text-gray-400' },
  { label: 'Repeat Buyers', value: '29%', change: '+3%', changeColor: 'text-gray-400' },
  { label: 'Outstanding', value: 'PKR 1.2M', change: '12 customers', changeColor: 'text-gray-400' },
  { label: 'Follow-ups', value: '17', change: '6 overdue', changeColor: 'text-gray-400' }
])

const branchStatusFilter = ref('All')
const branchSearchQuery = ref('')
const openBranchDropdown = ref(null)

const toggleBranchDropdown = (name) => {
  openBranchDropdown.value = openBranchDropdown.value === name ? null : name
}

const filteredBranchCustomers = computed(() => {
  const activeBranch = store.getActiveBranch().toLowerCase()
  return store.customers.filter(c => {
    // Filter by branch
    const cBranch = (c.branch || '').toLowerCase()
    if (cBranch && cBranch !== activeBranch && cBranch !== 'all branches' && cBranch !== 'all') {
      return false
    }
    if (branchStatusFilter.value !== 'All' && c.status !== branchStatusFilter.value) {
      return false
    }
    if (branchSearchQuery.value.trim()) {
      const q = branchSearchQuery.value.toLowerCase()
      const match = (c.code && c.code.toLowerCase().includes(q)) ||
                    (c.id && c.id.toLowerCase().includes(q)) ||
                    (c.name && c.name.toLowerCase().includes(q)) ||
                    (c.phone && c.phone.toLowerCase().includes(q))
      if (!match) return false
    }
    return true
  })
})

const openCreateModal = () => {
  selectedCustomerToEdit.value = null
  store.originalEditCustomer = null
  showCreateModal.value = true
}

const openEditModal = (customer) => {
  selectedCustomerToEdit.value = customer
  store.originalEditCustomer = customer
  showCreateModal.value = true
}

const handleCustomerCreated = (newCustomer) => {
  const added = store.addCustomer(newCustomer)
  toastMessage.value = `Customer ${added.name} added successfully!`
  showToast.value = true
  showCreateModal.value = false
  setTimeout(() => { showToast.value = false }, 4000)
}

const handleCustomerUpdated = (updatedCustomer) => {
  store.updateCustomer(updatedCustomer.id || updatedCustomer.code, updatedCustomer)
  toastMessage.value = `Customer ${updatedCustomer.name} updated successfully!`
  showToast.value = true
  showCreateModal.value = false
  setTimeout(() => { showToast.value = false }, 4000)
}

const openCustomerDetail = (customer) => {
  router.push({
    path: `/sales/customers/${customer.id || customer.customer_id || customer.code}`
  })
}

// Super Admin Data
const searchQuery = ref('')
const selectedBranch = ref('All Branches')
const selectedBalance = ref('All')
const openDropdown = ref(null)

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const summaryCards = computed(() => [
  { label: 'Customers', value: store.customers.length.toString() },
  { label: 'New This Month', value: '96' },
  { label: 'Receivables', value: 'PKR 2.9M' },
  { label: 'Owned Units', value: '1,108' }
])

const filteredCustomers = computed(() => {
  return store.customers.filter(c => {
    if (selectedBranch.value !== 'All Branches' && c.branch !== selectedBranch.value) {
      return false
    }
    if (selectedBalance.value === 'Outstanding Balance' && (c.rawBalance <= 0 || c.outstanding === 'PKR 0')) {
      return false
    }
    if (selectedBalance.value === 'Zero Balance' && c.rawBalance > 0) {
      return false
    }
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = 
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.branch.toLowerCase().includes(q) ||
        (c.id && c.id.toLowerCase().includes(q))
      if (!match) return false
    }
    return true
  })
})

const resetFilters = () => {
  searchQuery.value = ''
  selectedBranch.value = 'All Branches'
  selectedBalance.value = 'All'
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
          Branch Manager / Customers / <span class="font-medium text-gray-600">Customers</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Customers</h1>
        <p class="text-xs text-gray-500 mt-1">Search branch customers, purchases, owned units and outstanding balances.</p>
      </div>
      <button 
        @click="openCreateModal"
        class="bg-[#165A31] text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
      >
        <Plus class="w-4 h-4" /> <span>Add Customer</span>
      </button>
    </div>

    <!-- 4 KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div 
        v-for="kpi in branchKPIs" 
        :key="kpi.label"
        class="bg-white border border-gray-100 rounded-[12px] p-5 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between"
      >
        <span class="text-[11px] font-medium text-gray-400">{{ kpi.label }}</span>
        <div class="mt-2">
          <span class="text-2xl font-bold text-gray-900">{{ kpi.value }}</span>
          <p class="text-[11px] font-medium text-gray-400 mt-1">{{ kpi.change }}</p>
        </div>
      </div>
    </div>

    <!-- Filter Buttons Bar -->
    <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
      <div class="flex flex-wrap items-center gap-2">
        <!-- Search Input -->
        <div class="relative w-48 sm:w-60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            v-model="branchSearchQuery"
            type="text" 
            placeholder="Search customers..." 
            class="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
          />
        </div>

        <!-- Status Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('status')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <span>Status: {{ branchStatusFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openBranchDropdown === 'status'" class="absolute top-full left-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button 
              v-for="st in ['All', 'Active', 'Follow-up']"
              :key="st"
              @click="branchStatusFilter = st; openBranchDropdown = null"
              class="w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
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
        <button class="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          Columns
        </button>
        <button class="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          Export
        </button>
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="p-6">
        <h2 class="text-sm font-bold text-gray-900 mb-4">Branch Customers</h2>

        <div class="border border-gray-100 rounded-xl overflow-hidden">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-[#fbfcfc] border-b border-gray-100 text-[11px] font-semibold text-gray-400">
                <th class="px-5 py-3">Customer</th>
                <th class="px-5 py-3">Name</th>
                <th class="px-5 py-3">Phone</th>
                <th class="px-5 py-3">Orders</th>
                <th class="px-5 py-3">Outstanding</th>
                <th class="px-5 py-3">Status</th>
                <th class="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="text-xs">
              <tr 
                v-for="customer in filteredBranchCustomers" 
                :key="customer.code"
                class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
              >
                <td class="px-5 py-4 font-medium text-gray-700">{{ customer.code }}</td>
                <td class="px-5 py-4 font-bold text-gray-900">{{ customer.name }}</td>
                <td class="px-5 py-4 text-gray-600">{{ customer.phone }}</td>
                <td class="px-5 py-4 text-gray-700">{{ customer.orders }}</td>
                <td class="px-5 py-4 text-gray-700">{{ customer.outstanding }}</td>
                <td class="px-5 py-4">
                  <span :class="['inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-medium', customer.statusClass]">
                    {{ customer.status }}
                  </span>
                </td>
                <td class="px-5 py-4 text-right">
                  <div class="flex items-center justify-end gap-3 text-gray-400">
                    <button 
                      @click.stop="openEditModal(customer)" 
                      title="Edit Customer" 
                      class="hover:text-[#165A31] transition-colors cursor-pointer"
                    >
                      <Pencil class="w-4 h-4" />
                    </button>
                    <button 
                      @click.stop="openCustomerDetail(customer)"
                      class="text-xs text-gray-400 font-medium hover:text-gray-700 transition-colors"
                    >
                      Open ›
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-if="filteredBranchCustomers.length === 0">
                <td colspan="7" class="text-center py-12 text-gray-500">
                  <p class="text-xs font-semibold text-gray-700">No customers found matching the filter</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create / Edit Customer Modal -->
    <CreateCustomerModal 
      v-if="showCreateModal" 
      :is-modal="true"
      :customer="selectedCustomerToEdit"
      @close="showCreateModal = false" 
      @created="handleCustomerCreated"
      @updated="handleCustomerUpdated"
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

    <!-- Header Area -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Sales & CRM / <span class="font-bold text-gray-800">Customers</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Customers</h1>
        <p class="text-sm text-gray-500 mt-1">Manage customer profiles, balances, owned units and relationship history.</p>
      </div>
      <button 
        @click="openCreateModal" 
        class="bg-[#165A31] text-white text-[11px] font-bold px-4 py-2.5 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
      >
        <Plus class="w-4 h-4" /> <span>Add Customer</span>
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
      <div class="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-3 flex-1">
          <!-- Search -->
          <div class="relative flex-1 max-w-[300px] min-w-[200px]">
            <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search name, phone, branch..." 
              class="w-full pl-9 pr-4 py-1.5 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)]" 
            />
          </div>

          <!-- Branch Dropdown Filter -->
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

          <!-- Balance Dropdown Filter -->
          <div class="relative" @click.stop>
            <button 
              @click="toggleDropdown('balance')"
              class="px-3 py-1.5 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <span>Balance: {{ selectedBalance }}</span>
              <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
            </button>
            <div v-if="openDropdown === 'balance'" class="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <button 
                v-for="bal in ['All', 'Outstanding Balance', 'Zero Balance']"
                :key="bal"
                @click="selectedBalance = bal; openDropdown = null"
                class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
                :class="selectedBalance === bal ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
              >
                <span>{{ bal }}</span>
                <Check v-if="selectedBalance === bal" class="w-3.5 h-3.5 text-[#165A31]" />
              </button>
            </div>
          </div>
        </div>

        <button 
          v-if="searchQuery || selectedBranch !== 'All Branches' || selectedBalance !== 'All'"
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
              <th class="px-5 py-3">Customer</th>
              <th class="px-5 py-3">Phone</th>
              <th class="px-5 py-3">Branch</th>
              <th class="px-5 py-3">Orders</th>
              <th class="px-5 py-3">Owned Units</th>
              <th class="px-5 py-3">Lifetime Value</th>
              <th class="px-5 py-3">Balance</th>
              <th class="px-5 py-3">Last Activity</th>
              <th class="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr 
              v-for="customer in filteredCustomers" 
              :key="customer.name" 
              class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
            >
              <td class="px-5 py-4 text-gray-900 font-bold">{{ customer.name }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ customer.phone }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ customer.branch }}</td>
              <td class="px-5 py-4 text-gray-900 font-semibold">{{ customer.orders }}</td>
              <td class="px-5 py-4 text-gray-900 font-semibold">{{ customer.units }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ customer.ltv }}</td>
              <td class="px-5 py-4">
                <span :class="customer.rawBalance > 0 ? 'text-red-600 font-bold' : 'text-gray-600 font-medium'">
                  {{ customer.balance }}
                </span>
              </td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ customer.activity }}</td>
              <td class="px-5 py-4 text-right">
                <div class="flex items-center justify-end gap-3 text-gray-400">
                  <button 
                    @click.stop="openEditModal(customer)" 
                    title="Edit Customer" 
                    class="hover:text-[#165A31] transition-colors cursor-pointer"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>
                  <button @click.stop="router.push('/sales/customers/detail')" class="text-[#165A31] hover:underline font-semibold flex items-center justify-end gap-1 cursor-pointer">
                    Open &rarr;
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="filteredCustomers.length === 0">
              <td colspan="9" class="text-center py-12 text-gray-500">
                <div class="space-y-2">
                  <p class="text-xs font-semibold text-gray-700">No customers found matching the selected filters</p>
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
    
    <!-- Create / Edit Customer Modal -->
    <CreateCustomerModal 
      v-if="showCreateModal" 
      :is-modal="true"
      :customer="selectedCustomerToEdit"
      @close="showCreateModal = false" 
      @created="handleCustomerCreated"
      @updated="handleCustomerUpdated"
    />
  </div>
</template>
