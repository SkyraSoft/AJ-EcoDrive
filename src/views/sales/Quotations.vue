<script setup>
import { ref, computed } from 'vue'
import { Search, ChevronDown, Check } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import CreateQuotationModal from './CreateQuotation.vue'

const router = useRouter()
const showCreateModal = ref(false)

const tabs = ['All', 'Draft', 'Sent', 'Accepted', 'Expired']
const activeTab = ref('All')
const searchQuery = ref('')
const selectedBranch = ref('All Branches')
const openDropdown = ref(null)

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const quotations = ref([
  { quote: 'QT-1108', branch: 'Peshawar', customer: 'Faisal Khan', items: 'BRG DS11', amount: '185K', validUntil: 'Sep 02', status: 'Sent', owner: 'Hamza Ali' },
  { quote: 'QT-1104', branch: 'Islamabad', customer: 'Saad Ahmad', items: 'BRG EV-5', amount: '210K', validUntil: 'Aug 31', status: 'Accepted', owner: 'Ali Raza' },
  { quote: 'QT-1098', branch: 'Lahore', customer: 'M. Bilal', items: 'Cargo Pro', amount: '275K', validUntil: 'Aug 29', status: 'Draft', owner: 'Sami Ullah' },
  { quote: 'QT-1092', branch: 'Peshawar', customer: 'Tariq Mehmood', items: 'BRG DS11', amount: '185K', validUntil: 'Aug 15', status: 'Expired', owner: 'Hamza Ali' },
  { quote: 'QT-1085', branch: 'Islamabad', customer: 'Zubair Shah', items: 'BRG EV-5', amount: '220K', validUntil: 'Aug 12', status: 'Accepted', owner: 'Ali Raza' }
])

const filteredQuotations = computed(() => {
  return quotations.value.filter(item => {
    // Status Tab
    if (activeTab.value !== 'All' && item.status.toLowerCase() !== activeTab.value.toLowerCase()) {
      return false
    }

    // Branch Filter
    if (selectedBranch.value !== 'All Branches' && item.branch !== selectedBranch.value) {
      return false
    }

    // Search Query
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = 
        item.quote.toLowerCase().includes(q) ||
        item.customer.toLowerCase().includes(q) ||
        item.items.toLowerCase().includes(q) ||
        item.branch.toLowerCase().includes(q) ||
        item.owner.toLowerCase().includes(q)
      if (!match) return false
    }

    return true
  })
})

const resetFilters = () => {
  activeTab.value = 'All'
  selectedBranch.value = 'All Branches'
  searchQuery.value = ''
}

const getStatusClass = (status) => {
  if (status === 'Sent') return 'bg-blue-50 text-blue-600'
  if (status === 'Accepted') return 'bg-[#eefcf2] text-[#165A31]'
  if (status === 'Draft') return 'bg-orange-50 text-orange-600'
  if (status === 'Expired') return 'bg-red-50 text-red-600'
  return 'bg-gray-100 text-gray-600'
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openDropdown = null">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Sales & CRM / <span class="font-bold text-gray-800">Quotations</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Quotations</h1>
        <p class="text-sm text-gray-500 mt-1">Create, send and convert customer quotations into orders.</p>
      </div>
      <button @click="showCreateModal = true" class="bg-[#165A31] text-white text-[11px] font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer">
        + New Quotation
      </button>
    </div>

    <!-- Filters & Table -->
    <div class="space-y-4">
      <!-- Filter Bar -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex flex-wrap items-center gap-4 flex-1">
          <!-- Tabs -->
          <div class="flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-[0_2px_4px_rgba(0,0,0,0.01)] overflow-x-auto">
            <button 
              v-for="tab in tabs" 
              :key="tab"
              @click="activeTab = tab"
              class="px-3.5 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer whitespace-nowrap"
              :class="activeTab === tab ? 'bg-[#eefcf2] text-[#165A31] font-bold' : 'text-gray-500 hover:text-gray-900'"
            >
              {{ tab }}
            </button>
          </div>

          <!-- Search Input -->
          <div class="relative w-full sm:w-64 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
            <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search quotation #, customer, item..." 
              class="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
            />
          </div>

          <!-- Branch Dropdown -->
          <div class="relative" @click.stop>
            <button 
              @click="toggleDropdown('branch')"
              class="flex items-center gap-2 text-xs font-medium text-gray-700 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.01)] cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <span>{{ selectedBranch }}</span>
              <ChevronDown class="w-3 h-3 text-gray-400" />
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
        </div>

        <button 
          v-if="activeTab !== 'All' || selectedBranch !== 'All Branches' || searchQuery"
          @click="resetFilters" 
          class="text-[11px] text-[#165A31] font-semibold hover:underline cursor-pointer"
        >
          Reset Filters
        </button>
      </div>

      <!-- Table Container -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-[13px] font-bold text-gray-900">Quotations ({{ filteredQuotations.length }})</h3>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th class="px-5 py-3">Quote</th>
                <th class="px-5 py-3">Branch</th>
                <th class="px-5 py-3">Customer</th>
                <th class="px-5 py-3">Items</th>
                <th class="px-5 py-3">Amount</th>
                <th class="px-5 py-3">Valid Until</th>
                <th class="px-5 py-3">Status</th>
                <th class="px-5 py-3">Owner</th>
                <th class="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr 
                v-for="item in filteredQuotations" 
                :key="item.quote" 
                class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
                @click="router.push('/sales/quotations/detail')"
              >
                <td class="px-5 py-4 font-bold text-gray-900">{{ item.quote }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.branch }}</td>
                <td class="px-5 py-4 text-gray-800 font-semibold">{{ item.customer }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.items }}</td>
                <td class="px-5 py-4 text-gray-900 font-bold">{{ item.amount }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.validUntil }}</td>
                <td class="px-5 py-4">
                  <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold', getStatusClass(item.status)]">
                    {{ item.status }}
                  </span>
                </td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.owner }}</td>
                <td class="px-5 py-4 text-right">
                  <button @click.stop="router.push('/sales/quotations/detail')" class="text-[#165A31] hover:underline font-semibold cursor-pointer">
                    View
                  </button>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-if="filteredQuotations.length === 0">
                <td colspan="9" class="text-center py-12 text-gray-500">
                  <div class="space-y-2">
                    <p class="text-xs font-semibold text-gray-700">No quotations found matching the selected filters</p>
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

    <CreateQuotationModal v-if="showCreateModal" @close="showCreateModal = false" />
  </div>
</template>
