<script setup>
import { ref, computed } from 'vue'
import { ChevronDown, Search } from 'lucide-vue-next'

const searchQuery = ref('')
const selectedModule = ref('All Modules')
const selectedUser = ref('All Users')
const selectedBranch = ref('All Branches')
const selectedDate = ref('All Dates')
const openDropdown = ref(null)

const modules = ['All Modules', 'Security', 'Sales', 'Inventory', 'Procurement', 'Finance']
const users = ['All Users', 'Ahsan Khan', 'Hamza Ali', 'Hassan Ali', 'Bilal Ahmad']
const branches = ['All Branches', 'Peshawar', 'Islamabad', 'Lahore']
const dates = ['All Dates', 'Aug 27', 'Aug 26', 'Aug 25']

const auditEvents = ref([
  { timestamp: 'Aug 27 22:01', user: 'Ahsan Khan', role: 'Branch Manager', branch: 'Peshawar', module: 'Security', operation: 'Login', record: 'Session', result: 'Successful' },
  { timestamp: 'Aug 27 18:44', user: 'Hamza Ali', role: 'Sales', branch: 'Peshawar', module: 'Sales', operation: 'Reserve Unit', record: 'SO-7740', result: 'DS11-00991 → Reserved' },
  { timestamp: 'Aug 27 16:20', user: 'Hassan Ali', role: 'Branch Manager', branch: 'Islamabad', module: 'Inventory', operation: 'Dispatch Transfer', record: 'TR-119', result: '4 units → In Transit' },
  { timestamp: 'Aug 27 14:32', user: 'Ahsan Khan', role: 'Branch Manager', branch: 'Peshawar', module: 'Procurement', operation: 'Post Receipt', record: 'GR-991', result: '15 units created' },
  { timestamp: 'Aug 26 11:15', user: 'Bilal Ahmad', role: 'Finance Executive', branch: 'Lahore', module: 'Finance', operation: 'Record Payment', record: 'PAY-3310', result: 'PKR 250K recorded' }
])

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const selectFilter = (type, val) => {
  if (type === 'module') selectedModule.value = val
  if (type === 'user') selectedUser.value = val
  if (type === 'branch') selectedBranch.value = val
  if (type === 'date') selectedDate.value = val
  openDropdown.value = null
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedModule.value = 'All Modules'
  selectedUser.value = 'All Users'
  selectedBranch.value = 'All Branches'
  selectedDate.value = 'All Dates'
}

const filteredEvents = computed(() => {
  return auditEvents.value.filter(event => {
    if (selectedModule.value !== 'All Modules' && event.module !== selectedModule.value) return false
    if (selectedUser.value !== 'All Users' && event.user !== selectedUser.value) return false
    if (selectedBranch.value !== 'All Branches' && event.branch !== selectedBranch.value) return false
    if (selectedDate.value !== 'All Dates' && !event.timestamp.startsWith(selectedDate.value)) return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = event.user.toLowerCase().includes(q) ||
                    event.role.toLowerCase().includes(q) ||
                    event.branch.toLowerCase().includes(q) ||
                    event.module.toLowerCase().includes(q) ||
                    event.operation.toLowerCase().includes(q) ||
                    event.record.toLowerCase().includes(q) ||
                    event.result.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })
})
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openDropdown = null">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / System / <span class="font-bold text-gray-800">Audit Log</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Audit Log</h1>
        <p class="text-sm text-gray-500 mt-1">Review security-sensitive and business-critical changes across the system.</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-3">
      <div class="relative w-full sm:w-64">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="User, record, operation..." 
          class="w-full pl-9 pr-4 py-2 text-[11px] font-medium border border-gray-200 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.01)] focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31]"
        />
      </div>
      
      <!-- Module Dropdown -->
      <div class="relative">
        <button 
          @click.stop="toggleDropdown('module')"
          class="flex items-center gap-2 text-xs font-medium text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:text-gray-900"
          :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedModule !== 'All Modules' }"
        >
          <span>{{ selectedModule }}</span>
          <ChevronDown class="w-3 h-3 text-gray-400" />
        </button>
        <div v-if="openDropdown === 'module'" class="absolute left-0 mt-1 w-40 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
          <button 
            v-for="m in modules" 
            :key="m" 
            @click.stop="selectFilter('module', m)"
            class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700"
            :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedModule === m }"
          >
            {{ m }}
          </button>
        </div>
      </div>

      <!-- User Dropdown -->
      <div class="relative">
        <button 
          @click.stop="toggleDropdown('user')"
          class="flex items-center gap-2 text-xs font-medium text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:text-gray-900"
          :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedUser !== 'All Users' }"
        >
          <span>{{ selectedUser }}</span>
          <ChevronDown class="w-3 h-3 text-gray-400" />
        </button>
        <div v-if="openDropdown === 'user'" class="absolute left-0 mt-1 w-40 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
          <button 
            v-for="u in users" 
            :key="u" 
            @click.stop="selectFilter('user', u)"
            class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700"
            :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedUser === u }"
          >
            {{ u }}
          </button>
        </div>
      </div>

      <!-- Branch Dropdown -->
      <div class="relative">
        <button 
          @click.stop="toggleDropdown('branch')"
          class="flex items-center gap-2 text-xs font-medium text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:text-gray-900"
          :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedBranch !== 'All Branches' }"
        >
          <span>{{ selectedBranch }}</span>
          <ChevronDown class="w-3 h-3 text-gray-400" />
        </button>
        <div v-if="openDropdown === 'branch'" class="absolute left-0 mt-1 w-40 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
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

      <!-- Date Dropdown -->
      <div class="relative">
        <button 
          @click.stop="toggleDropdown('date')"
          class="flex items-center gap-2 text-xs font-medium text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:text-gray-900"
          :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedDate !== 'All Dates' }"
        >
          <span>{{ selectedDate }}</span>
          <ChevronDown class="w-3 h-3 text-gray-400" />
        </button>
        <div v-if="openDropdown === 'date'" class="absolute left-0 mt-1 w-36 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
          <button 
            v-for="d in dates" 
            :key="d" 
            @click.stop="selectFilter('date', d)"
            class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700"
            :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedDate === d }"
          >
            {{ d }}
          </button>
        </div>
      </div>

      <button 
        v-if="searchQuery || selectedModule !== 'All Modules' || selectedUser !== 'All Users' || selectedBranch !== 'All Branches' || selectedDate !== 'All Dates'" 
        @click="resetFilters" 
        class="text-[11px] font-semibold text-gray-500 hover:text-red-600 px-2 py-1 transition-colors cursor-pointer"
      >
        Clear Filters
      </button>
    </div>

    <!-- Table Container -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-[13px] font-bold text-gray-900">Audit Events</h3>
        <span class="text-[11px] text-gray-400 font-medium">Showing {{ filteredEvents.length }} events</span>
      </div>
      
      <div class="overflow-x-auto">
        <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <th class="px-5 py-3">Timestamp</th>
              <th class="px-5 py-3">User</th>
              <th class="px-5 py-3">Role</th>
              <th class="px-5 py-3">Branch</th>
              <th class="px-5 py-3">Module</th>
              <th class="px-5 py-3">Operation</th>
              <th class="px-5 py-3">Record</th>
              <th class="px-5 py-3">Change / Result</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr v-for="(event, idx) in filteredEvents" :key="idx" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <td class="px-5 py-4 text-gray-600 font-medium whitespace-nowrap">{{ event.timestamp }}</td>
              <td class="px-5 py-4 font-semibold text-gray-800">{{ event.user }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ event.role }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ event.branch }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ event.module }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ event.operation }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ event.record }}</td>
              <td class="px-5 py-4 text-gray-800 font-medium">{{ event.result }}</td>
            </tr>
            <tr v-if="filteredEvents.length === 0">
              <td colspan="8" class="text-center py-12 text-gray-500">
                <div class="flex flex-col items-center justify-center">
                  <span class="text-2xl mb-2">🔍</span>
                  <p class="text-sm font-semibold text-gray-700">No audit events found</p>
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
</template>
