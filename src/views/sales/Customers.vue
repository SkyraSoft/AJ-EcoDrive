<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search, ChevronDown, Check } from 'lucide-vue-next'
import CreateCustomerModal from './CreateCustomer.vue'

const router = useRouter()
const showCreateModal = ref(false)

const searchQuery = ref('')
const selectedBranch = ref('All Branches')
const selectedBalance = ref('All')
const openDropdown = ref(null)

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const summaryCards = computed(() => [
  { label: 'Customers', value: customers.value.length.toString() },
  { label: 'New This Month', value: '96' },
  { label: 'Receivables', value: 'PKR 2.9M' },
  { label: 'Owned Units', value: '1,108' }
])

const customers = ref([
  { id: 'CUST-101', name: 'Faisal Khan', phone: '+92 300 1234567', branch: 'Peshawar', orders: 3, units: 2, ltv: '540K', balance: '85K', rawBalance: 85000, activity: 'Today' },
  { id: 'CUST-102', name: 'Saad Ahmad', phone: '+92 333 2221000', branch: 'Islamabad', orders: 2, units: 1, ltv: '385K', balance: '0', rawBalance: 0, activity: 'Today' },
  { id: 'CUST-103', name: 'M. Bilal', phone: '+92 321 5559944', branch: 'Lahore', orders: 1, units: 1, ltv: '275K', balance: '0', rawBalance: 0, activity: 'Aug 27' },
  { id: 'CUST-104', name: 'Kamran Akmal', phone: '+92 301 9988776', branch: 'Peshawar', orders: 4, units: 3, ltv: '720K', balance: '120K', rawBalance: 120000, activity: 'Aug 25' },
  { id: 'CUST-105', name: 'Zubair Shah', phone: '+92 345 1122334', branch: 'Islamabad', orders: 1, units: 1, ltv: '185K', balance: '0', rawBalance: 0, activity: 'Aug 20' }
])

const filteredCustomers = computed(() => {
  return customers.value.filter(c => {
    // Branch Filter
    if (selectedBranch.value !== 'All Branches' && c.branch !== selectedBranch.value) {
      return false
    }

    // Balance Filter
    if (selectedBalance.value === 'Outstanding Balance' && c.rawBalance <= 0) {
      return false
    }
    if (selectedBalance.value === 'Zero Balance' && c.rawBalance > 0) {
      return false
    }

    // Search Filter
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
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openDropdown = null">
    <!-- Header Area -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Sales & CRM / <span class="font-bold text-gray-800">Customers</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Customers</h1>
        <p class="text-sm text-gray-500 mt-1">Manage customer profiles, balances, owned units and relationship history.</p>
      </div>
      <button @click="showCreateModal = true" class="bg-[#165A31] text-white text-[11px] font-bold px-4 py-2 rounded-lg hover:bg-[#124a28] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05)] cursor-pointer">
        + Add Customer
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
              <th class="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr 
              v-for="customer in filteredCustomers" 
              :key="customer.name" 
              class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
              @click="router.push('/sales/customers/detail')"
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
                <button @click.stop="router.push('/sales/customers/detail')" class="text-[#165A31] hover:underline font-semibold flex items-center justify-end gap-1 ml-auto cursor-pointer">
                  Open &rarr;
                </button>
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
    
    <CreateCustomerModal v-if="showCreateModal" @close="showCreateModal = false" />
  </div>
</template>
