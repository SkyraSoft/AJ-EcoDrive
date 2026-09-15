<script setup>
import { ref, computed } from 'vue'
import { Search, ChevronDown, Eye, Pencil, MoreHorizontal } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { store } from '../../store.js'

const router = useRouter()

const activeStatusTab = ref('All')
const statusTabs = ['All', 'Active', 'Inactive']
const searchQuery = ref('')
const selectedCity = ref('All Cities')
const selectedManager = ref('All Managers')
const openDropdown = ref(null)

const cities = ['All Cities', 'Peshawar', 'Islamabad', 'Lahore', 'Rawalpindi']
const managers = ['All Managers', 'Ahsan Khan', 'Hassan Ali', 'Sami Ullah', 'Usman Tariq']

const isArchiveModalOpen = ref(false)

const kpis = [
  { label: 'Total Branches', value: '4' },
  { label: 'Active', value: '4' },
  { label: 'Inactive', value: '0' },
  { label: 'This Month Sales', value: 'PKR 28.4M' }
]

const branches = ref([
  { name: 'Peshawar', code: 'PEW-01', city: 'Peshawar', manager: 'Ahsan Khan', sales: '9.8M', inventory: '14.2M', expenses: '1.0M', profit: '1.4M', status: 'Active', address: '123 Main St', area: 'Hayatabad', phone: '+92 300 1234567', email: 'pew@ajecodrive.com', defaultLocation: 'Main Warehouse', hours: '9 AM - 6 PM', expenseLimit: '100000', discountLimit: '10%', salesRules: 'Standard', changeNote: '' },
  { name: 'Islamabad', code: 'ISB-01', city: 'Islamabad', manager: 'Hassan Ali', sales: '7.8M', inventory: '11.8M', expenses: '0.9M', profit: '0.9M', status: 'Active', address: '45 Blue Area', area: 'F-8', phone: '+92 300 1234568', email: 'isb@ajecodrive.com', defaultLocation: 'ISB Warehouse', hours: '9 AM - 6 PM', expenseLimit: '150000', discountLimit: '12%', salesRules: 'Standard', changeNote: '' },
  { name: 'Lahore', code: 'LHE-01', city: 'Lahore', manager: 'Sami Ullah', sales: '6.2M', inventory: '9.1M', expenses: '0.7M', profit: '0.7M', status: 'Active', address: '78 Gulberg', area: 'Gulberg III', phone: '+92 300 1234569', email: 'lhe@ajecodrive.com', defaultLocation: 'LHE Warehouse', hours: '10 AM - 8 PM', expenseLimit: '120000', discountLimit: '8%', salesRules: 'Standard', changeNote: '' },
  { name: 'Rawalpindi', code: 'RWP-01', city: 'Rawalpindi', manager: 'Usman Tariq', sales: '4.8M', inventory: '8.9M', expenses: '0.6M', profit: '0.7M', status: 'Active', address: '12 Saddar', area: 'Saddar', phone: '+92 300 1234570', email: 'rwp@ajecodrive.com', defaultLocation: 'RWP Warehouse', hours: '9 AM - 6 PM', expenseLimit: '80000', discountLimit: '5%', salesRules: 'Standard', changeNote: '' }
])

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const selectFilter = (type, val) => {
  if (type === 'city') selectedCity.value = val
  if (type === 'manager') selectedManager.value = val
  openDropdown.value = null
}

const resetFilters = () => {
  activeStatusTab.value = 'All'
  searchQuery.value = ''
  selectedCity.value = 'All Cities'
  selectedManager.value = 'All Managers'
}

const filteredBranches = computed(() => {
  return branches.value.filter(branch => {
    if (activeStatusTab.value !== 'All' && branch.status !== activeStatusTab.value) return false
    if (selectedCity.value !== 'All Cities' && branch.city !== selectedCity.value) return false
    if (selectedManager.value !== 'All Managers' && branch.manager !== selectedManager.value) return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = branch.name.toLowerCase().includes(q) ||
                    branch.code.toLowerCase().includes(q) ||
                    branch.city.toLowerCase().includes(q) ||
                    branch.manager.toLowerCase().includes(q) ||
                    branch.area.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })
})

const editBranch = (branch) => {
  store.originalEditBranch = branch
  router.push('/organisation/branches/edit')
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openDropdown = null">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Organisation / <span class="font-bold text-gray-800">Branches</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Branches</h1>
        <p class="text-sm text-gray-500 mt-1">Manage physical locations, their managers and branch-specific performance.</p>
      </div>
      <button @click="$router.push('/organisation/branches/create')" class="bg-[#165A31] text-white text-[11px] font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer">
        + Add Branch
      </button>
    </div>

    <!-- 4 KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="(kpi, index) in kpis" :key="index" class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <div class="text-xs font-semibold text-gray-400 mb-2">{{ kpi.label }}</div>
        <div class="text-[22px] font-bold text-gray-900 leading-none">{{ kpi.value }}</div>
      </div>
    </div>

    <!-- Filters & Table -->
    <div class="space-y-4">
      <!-- Filter Bar -->
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
          <button 
            v-for="tab in statusTabs" 
            :key="tab"
            @click="activeStatusTab = tab"
            class="px-4 py-1.5 text-xs font-bold rounded transition-colors cursor-pointer"
            :class="activeStatusTab === tab ? 'bg-[#eefcf2] text-[#165A31]' : 'text-gray-500 hover:text-gray-900'"
          >
            {{ tab }}
          </button>
        </div>

        <div class="relative w-full sm:w-64 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
          <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search branches..." 
            class="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
          />
        </div>

        <!-- City Dropdown -->
        <div class="relative">
          <button 
            @click.stop="toggleDropdown('city')"
            class="flex items-center gap-2 text-xs font-medium text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:bg-gray-50 transition-colors"
            :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedCity !== 'All Cities' }"
          >
            <span>{{ selectedCity }}</span>
            <ChevronDown class="w-3 h-3 text-gray-400" />
          </button>
          <div v-if="openDropdown === 'city'" class="absolute left-0 mt-1 w-40 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
            <button 
              v-for="c in cities" 
              :key="c" 
              @click.stop="selectFilter('city', c)"
              class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700"
              :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedCity === c }"
            >
              {{ c }}
            </button>
          </div>
        </div>

        <!-- Manager Dropdown -->
        <div class="relative">
          <button 
            @click.stop="toggleDropdown('manager')"
            class="flex items-center gap-2 text-xs font-medium text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:bg-gray-50 transition-colors"
            :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedManager !== 'All Managers' }"
          >
            <span>{{ selectedManager }}</span>
            <ChevronDown class="w-3 h-3 text-gray-400" />
          </button>
          <div v-if="openDropdown === 'manager'" class="absolute left-0 mt-1 w-44 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
            <button 
              v-for="m in managers" 
              :key="m" 
              @click.stop="selectFilter('manager', m)"
              class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700"
              :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedManager === m }"
            >
              {{ m }}
            </button>
          </div>
        </div>

        <button 
          v-if="searchQuery || activeStatusTab !== 'All' || selectedCity !== 'All Cities' || selectedManager !== 'All Managers'" 
          @click="resetFilters" 
          class="text-[11px] font-semibold text-gray-500 hover:text-red-600 px-2 py-1 transition-colors cursor-pointer"
        >
          Clear Filters
        </button>
      </div>

      <!-- Table Container -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-[13px] font-bold text-gray-900">Branches</h3>
          <span class="text-[11px] text-gray-400 font-medium">{{ filteredBranches.length }} branches</span>
        </div>
        
        <div class="overflow-x-auto">
          <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th class="px-5 py-3">Branch</th>
                <th class="px-5 py-3">Code</th>
                <th class="px-5 py-3">City</th>
                <th class="px-5 py-3">Manager</th>
                <th class="px-5 py-3">Sales</th>
                <th class="px-5 py-3">Inventory</th>
                <th class="px-5 py-3">Expenses</th>
                <th class="px-5 py-3">Net Profit</th>
                <th class="px-5 py-3">Status</th>
                <th class="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="branch in filteredBranches" :key="branch.code" @click="$router.push('/organisation/branches/detail')" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer">
                <td class="px-5 py-4 font-bold text-gray-900">{{ branch.name }}</td>
                <td class="px-5 py-4 text-gray-500 font-medium">{{ branch.code }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ branch.city }}</td>
                <td class="px-5 py-4 font-semibold text-gray-800">{{ branch.manager }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ branch.sales }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ branch.inventory }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ branch.expenses }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ branch.profit }}</td>
                <td class="px-5 py-4">
                  <span class="inline-flex items-center px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold bg-[#eefcf2] text-[#165A31]">
                    {{ branch.status }}
                  </span>
                </td>
                <td class="px-5 py-4 text-right text-gray-400 font-bold tracking-widest hover:text-gray-600">
                  <div class="flex items-center justify-end gap-3 text-gray-400">
                    <button title="Open" class="hover:text-gray-700 transition-colors cursor-pointer"><Eye class="w-4 h-4" /></button>
                    <button @click.stop="editBranch(branch)" title="Edit" class="hover:text-gray-700 transition-colors cursor-pointer"><Pencil class="w-4 h-4" /></button>
                    <button title="More" class="hover:text-gray-700 transition-colors cursor-pointer"><MoreHorizontal class="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredBranches.length === 0">
                <td colspan="10" class="text-center py-12 text-gray-500">
                  <div class="flex flex-col items-center justify-center">
                    <span class="text-2xl mb-2">🔍</span>
                    <p class="text-sm font-semibold text-gray-700">No branches found</p>
                    <p class="text-xs text-gray-400 mt-1">Try adjusting your filters or search query</p>
                    <button @click="resetFilters" class="mt-3 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors">
                      Reset filters
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table></div>
        </div>
      </div>
    </div>

    <!-- Archive Branch Modal Overlay -->
    <div v-if="isArchiveModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/20 backdrop-blur-[1px]">
      <div class="bg-white rounded-xl shadow-xl border border-gray-100 w-full max-w-[440px] p-8">
        <div class="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center mb-5 text-red-500 font-bold text-lg">
          !
        </div>
        <h2 class="text-[18px] font-bold text-gray-900 mb-2">Archive branch?</h2>
        <p class="text-[13px] text-gray-500 mb-8 leading-relaxed">
          Peshawar Branch will be hidden from active operations. Historical sales, inventory and audit records will remain available.
        </p>
        <div class="flex items-center justify-end gap-3">
          <button @click="isArchiveModalOpen = false" class="px-5 py-2 text-[12px] font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button @click="isArchiveModalOpen = false" class="px-5 py-2 text-[12px] font-semibold text-red-500 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
            Archive branch
          </button>
        </div>
      </div>
    </div>
  </div>

  <router-view />
</template>