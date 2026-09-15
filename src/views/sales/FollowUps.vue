<script setup>
import { ref, computed } from 'vue'
import { Search, ChevronDown, Check } from 'lucide-vue-next'

const tabs = ['All', 'Today', 'Upcoming', 'Overdue', 'Completed']
const activeTab = ref('Today')
const searchQuery = ref('')
const selectedBranch = ref('All Branches')
const selectedOwner = ref('All Owners')
const openDropdown = ref(null)

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const followUps = ref([
  {
    id: 1,
    due: 'Today 11:00',
    timeBucket: 'Today',
    customer: 'Usman Ali',
    type: 'Lead follow-up',
    branch: 'Peshawar',
    owner: 'Sana Noor',
    priority: 'High',
    priorityColor: 'bg-orange-50 text-orange-700',
    status: 'Open',
    statusColor: 'bg-blue-50 text-blue-600',
    action: 'Complete'
  },
  {
    id: 2,
    due: 'Today 15:30',
    timeBucket: 'Today',
    customer: 'Faisal Khan',
    type: 'Payment Reminder',
    branch: 'Peshawar',
    owner: 'Hamza Ali',
    priority: 'High',
    priorityColor: 'bg-orange-50 text-orange-700',
    status: 'Open',
    statusColor: 'bg-blue-50 text-blue-600',
    action: 'Complete'
  },
  {
    id: 3,
    due: 'Aug 28',
    timeBucket: 'Upcoming',
    customer: 'Zain Khan',
    type: 'Quotation Review',
    branch: 'Islamabad',
    owner: 'Ali Raza',
    priority: 'Medium',
    priorityColor: 'bg-blue-50 text-blue-600',
    status: 'Upcoming',
    statusColor: 'bg-blue-50 text-blue-600',
    action: 'Open'
  },
  {
    id: 4,
    due: 'Aug 20',
    timeBucket: 'Overdue',
    customer: 'M. Bilal',
    type: 'Delivery Check',
    branch: 'Lahore',
    owner: 'Sana Noor',
    priority: 'High',
    priorityColor: 'bg-red-50 text-red-600',
    status: 'Overdue',
    statusColor: 'bg-red-50 text-red-600',
    action: 'Follow Up'
  },
  {
    id: 5,
    due: 'Aug 18',
    timeBucket: 'Completed',
    customer: 'Tariq Mehmood',
    type: 'Post-Sale Inquiry',
    branch: 'Peshawar',
    owner: 'Hamza Ali',
    priority: 'Low',
    priorityColor: 'bg-gray-50 text-gray-600',
    status: 'Completed',
    statusColor: 'bg-[#eefcf2] text-[#165A31]',
    action: 'Archived'
  }
])

const filteredFollowUps = computed(() => {
  return followUps.value.filter(item => {
    // Tab filter
    if (activeTab.value !== 'All' && item.timeBucket.toLowerCase() !== activeTab.value.toLowerCase()) {
      return false
    }

    // Branch filter
    if (selectedBranch.value !== 'All Branches' && item.branch !== selectedBranch.value) {
      return false
    }

    // Owner filter
    if (selectedOwner.value !== 'All Owners' && item.owner !== selectedOwner.value) {
      return false
    }

    // Search query
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = 
        item.customer.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q) ||
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
  selectedOwner.value = 'All Owners'
  searchQuery.value = ''
}

const toggleComplete = (item) => {
  if (item.status === 'Completed') {
    item.status = 'Open'
    item.statusColor = 'bg-blue-50 text-blue-600'
    item.timeBucket = 'Today'
  } else {
    item.status = 'Completed'
    item.statusColor = 'bg-[#eefcf2] text-[#165A31]'
    item.timeBucket = 'Completed'
  }
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openDropdown = null">
    <!-- Header Area -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Sales & CRM / <span class="font-bold text-gray-800">Follow-ups</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Follow-ups</h1>
        <p class="text-sm text-gray-500 mt-1">Manage due, upcoming and overdue sales or customer follow-up tasks.</p>
      </div>
    </div>

    <!-- Filters & Tabs -->
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
      <div class="flex flex-wrap items-center gap-3 flex-1">
        <!-- Tabs -->
        <div class="flex items-center bg-gray-50/80 p-1 rounded-lg border border-gray-100 overflow-x-auto">
          <button 
            v-for="tab in tabs" 
            :key="tab"
            @click="activeTab = tab"
            :class="[
              'px-3.5 py-1.5 text-[11px] font-bold rounded-md transition-all cursor-pointer whitespace-nowrap',
              activeTab === tab ? 'bg-white text-[#165A31] shadow-[0_1px_2px_rgba(0,0,0,0.05)]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
            ]"
          >
            {{ tab }}
          </button>
        </div>

        <!-- Search -->
        <div class="relative flex-1 max-w-[260px] min-w-[180px]">
          <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search follow-ups..." 
            class="w-full pl-9 pr-4 py-1.5 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)]" 
          />
        </div>
        
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

        <!-- Owner Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleDropdown('owner')"
            class="px-3 py-1.5 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <span>{{ selectedOwner }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openDropdown === 'owner'" class="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button 
              v-for="owner in ['All Owners', 'Sana Noor', 'Hamza Ali', 'Ali Raza']"
              :key="owner"
              @click="selectedOwner = owner; openDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
              :class="selectedOwner === owner ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ owner }}</span>
              <Check v-if="selectedOwner === owner" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>
      </div>

      <button 
        v-if="activeTab !== 'All' || selectedBranch !== 'All Branches' || selectedOwner !== 'All Owners' || searchQuery"
        @click="resetFilters" 
        class="text-[11px] text-[#165A31] font-semibold hover:underline cursor-pointer"
      >
        Reset Filters
      </button>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-[14px] font-bold text-gray-900">Follow-up Queue ({{ filteredFollowUps.length }})</h2>
        </div>

        <div class="border border-gray-100 rounded-xl overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th class="px-5 py-3">Due</th>
                <th class="px-5 py-3">Customer / Lead</th>
                <th class="px-5 py-3">Type</th>
                <th class="px-5 py-3">Branch</th>
                <th class="px-5 py-3">Owner</th>
                <th class="px-5 py-3">Priority</th>
                <th class="px-5 py-3">Status</th>
                <th class="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="item in filteredFollowUps" :key="item.id" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td class="px-5 py-4 text-gray-900 font-bold">{{ item.due }}</td>
                <td class="px-5 py-4 text-gray-800 font-semibold">{{ item.customer }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.type }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.branch }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.owner }}</td>
                <td class="px-5 py-4">
                  <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold', item.priorityColor]">
                    {{ item.priority }}
                  </span>
                </td>
                <td class="px-5 py-4">
                  <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold', item.statusColor]">
                    {{ item.status }}
                  </span>
                </td>
                <td class="px-5 py-4 text-right">
                  <button 
                    @click="toggleComplete(item)" 
                    class="text-xs font-semibold px-2.5 py-1 rounded-md border cursor-pointer transition-colors"
                    :class="item.status === 'Completed' ? 'border-gray-200 text-gray-600 hover:bg-gray-50' : 'border-[#165A31] text-[#165A31] hover:bg-[#eefcf2]'"
                  >
                    {{ item.status === 'Completed' ? 'Reopen' : 'Complete' }}
                  </button>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-if="filteredFollowUps.length === 0">
                <td colspan="8" class="text-center py-12 text-gray-500">
                  <div class="space-y-2">
                    <p class="text-xs font-semibold text-gray-700">No follow-ups match the selected filters</p>
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
