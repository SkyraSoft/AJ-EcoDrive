<script setup>
import { ref, computed } from 'vue'
import { ChevronDown, Search } from 'lucide-vue-next'

const activePriority = ref('All')
const priorityTabs = ['All', 'Critical', 'High', 'Medium', 'Low']
const searchQuery = ref('')
const selectedType = ref('All Types')
const selectedBranch = ref('All Branches')
const selectedAssignee = ref('All Assignees')
const openDropdown = ref(null)

const types = ['All Types', 'Inventory', 'Purchase Order', 'Expense', 'Refund', 'Stock Request', 'Service']
const branches = ['All Branches', 'Peshawar', 'Islamabad', 'Lahore', 'Rawalpindi']
const assignees = ['All Assignees', 'Super Admin', 'Hassan Ali', 'Ahsan Khan']

const kpis = [
  { label: 'Open Items', value: '27' },
  { label: 'Critical', value: '4' },
  { label: 'Due Today', value: '8' },
  { label: 'Overdue', value: '5' }
]

const workQueue = ref([
  { priority: 'Critical', priorityClass: 'bg-[#fef2f2] text-[#dc2626]', type: 'Inventory', record: 'SKU BRG-EV5', branch: 'Peshawar', summary: 'Available stock below reorder', assignee: 'Super Admin', due: 'Today', action: 'Review' },
  { priority: 'High', priorityClass: 'bg-[#fef9c3] text-[#a16207]', type: 'Purchase Order', record: 'PO-2049', branch: 'All Branches', summary: 'Awaiting approval - PKR 4.6M', assignee: 'Super Admin', due: 'Today', action: 'Approve' },
  { priority: 'High', priorityClass: 'bg-[#fef9c3] text-[#a16207]', type: 'Expense', record: 'EXP-8831', branch: 'Islamabad', summary: 'Above manager threshold', assignee: 'Super Admin', due: 'Today', action: 'Review' },
  { priority: 'High', priorityClass: 'bg-[#fef9c3] text-[#a16207]', type: 'Refund', record: 'RET-311', branch: 'Lahore', summary: 'Refund after inspection', assignee: 'Super Admin', due: 'Tomorrow', action: 'Decide' },
  { priority: 'Medium', priorityClass: 'bg-blue-50 text-blue-700', type: 'Stock Request', record: 'SR-1048', branch: 'Peshawar', summary: '5 x BRG DS11', assignee: 'Super Admin', due: 'Tomorrow', action: 'Review' },
  { priority: 'Medium', priorityClass: 'bg-blue-50 text-blue-700', type: 'Service', record: 'SRV-221', branch: 'Rawalpindi', summary: 'Warranty escalation', assignee: 'Super Admin', due: 'Aug 29', action: 'Open' },
  { priority: 'Low', priorityClass: 'bg-gray-100 text-gray-700', type: 'Inventory', record: 'SKU BRG-DS11', branch: 'Islamabad', summary: 'Periodic reconciliation check', assignee: 'Hassan Ali', due: 'Sep 02', action: 'Check' }
])

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const selectFilter = (type, val) => {
  if (type === 'type') selectedType.value = val
  if (type === 'branch') selectedBranch.value = val
  if (type === 'assignee') selectedAssignee.value = val
  openDropdown.value = null
}

const resetFilters = () => {
  activePriority.value = 'All'
  searchQuery.value = ''
  selectedType.value = 'All Types'
  selectedBranch.value = 'All Branches'
  selectedAssignee.value = 'All Assignees'
}

const filteredQueue = computed(() => {
  return workQueue.value.filter(item => {
    if (activePriority.value !== 'All' && item.priority.toLowerCase() !== activePriority.value.toLowerCase()) return false
    if (selectedType.value !== 'All Types' && item.type !== selectedType.value) return false
    if (selectedBranch.value !== 'All Branches' && item.branch !== selectedBranch.value && item.branch !== 'All Branches') return false
    if (selectedAssignee.value !== 'All Assignees' && item.assignee !== selectedAssignee.value) return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = item.record.toLowerCase().includes(q) ||
                    item.summary.toLowerCase().includes(q) ||
                    item.type.toLowerCase().includes(q) ||
                    item.branch.toLowerCase().includes(q) ||
                    item.assignee.toLowerCase().includes(q)
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
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / <span class="font-bold text-gray-800">Action Centre</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Action Centre</h1>
        <p class="text-sm text-gray-500 mt-1">Approvals, exceptions and operational tasks that require management action.</p>
      </div>
    </div>

    <!-- Filter Bar Top -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <!-- Toggle Group -->
      <div class="flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
        <button 
          v-for="tab in priorityTabs" 
          :key="tab"
          @click="activePriority = tab"
          class="px-4 py-1.5 text-[11px] font-bold rounded transition-colors cursor-pointer"
          :class="activePriority === tab ? 'bg-[#eefcf2] text-[#165A31]' : 'text-gray-500 hover:text-gray-900'"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Search & Dropdowns -->
      <div class="flex flex-wrap items-center gap-2">
        <div class="relative w-full sm:w-52 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
          <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search tasks..." 
            class="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-[11px] placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
          />
        </div>

        <!-- Type Dropdown -->
        <div class="relative">
          <button 
            @click.stop="toggleDropdown('type')"
            class="flex items-center gap-2 text-[11px] font-medium text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:text-gray-900"
            :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedType !== 'All Types' }"
          >
            <span>{{ selectedType }}</span>
            <ChevronDown class="w-3 h-3 text-gray-400" />
          </button>
          <div v-if="openDropdown === 'type'" class="absolute right-0 mt-1 w-40 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
            <button 
              v-for="t in types" 
              :key="t" 
              @click.stop="selectFilter('type', t)"
              class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700"
              :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedType === t }"
            >
              {{ t }}
            </button>
          </div>
        </div>

        <!-- Branch Dropdown -->
        <div class="relative">
          <button 
            @click.stop="toggleDropdown('branch')"
            class="flex items-center gap-2 text-[11px] font-medium text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:text-gray-900"
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

        <!-- Assignee Dropdown -->
        <div class="relative">
          <button 
            @click.stop="toggleDropdown('assignee')"
            class="flex items-center gap-2 text-[11px] font-medium text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:text-gray-900"
            :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedAssignee !== 'All Assignees' }"
          >
            <span>{{ selectedAssignee }}</span>
            <ChevronDown class="w-3 h-3 text-gray-400" />
          </button>
          <div v-if="openDropdown === 'assignee'" class="absolute right-0 mt-1 w-40 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
            <button 
              v-for="a in assignees" 
              :key="a" 
              @click.stop="selectFilter('assignee', a)"
              class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700"
              :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedAssignee === a }"
            >
              {{ a }}
            </button>
          </div>
        </div>

        <button 
          v-if="searchQuery || activePriority !== 'All' || selectedType !== 'All Types' || selectedBranch !== 'All Branches' || selectedAssignee !== 'All Assignees'" 
          @click="resetFilters" 
          class="text-[11px] font-semibold text-gray-500 hover:text-red-600 px-2 py-1 transition-colors cursor-pointer"
        >
          Clear
        </button>
      </div>
    </div>

    <!-- 4 KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="(kpi, index) in kpis" :key="index" class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <div class="text-xs font-semibold text-gray-400 mb-2">{{ kpi.label }}</div>
        <div class="text-[22px] font-bold text-gray-900 leading-none">{{ kpi.value }}</div>
      </div>
    </div>

    <!-- Table Container -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-[13px] font-bold text-gray-900">Management Work Queue</h3>
        <span class="text-[11px] text-gray-400 font-medium">{{ filteredQueue.length }} tasks</span>
      </div>
      
      <div class="overflow-x-auto">
        <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <th class="px-5 py-3">Priority</th>
              <th class="px-5 py-3">Type</th>
              <th class="px-5 py-3">Record</th>
              <th class="px-5 py-3">Branch</th>
              <th class="px-5 py-3">Summary</th>
              <th class="px-5 py-3">Assignee</th>
              <th class="px-5 py-3">Due</th>
              <th class="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr v-for="(item, idx) in filteredQueue" :key="idx" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <td class="px-5 py-4">
                <span class="inline-flex items-center px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold" :class="item.priorityClass">
                  {{ item.priority }}
                </span>
              </td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.type }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.record }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.branch }}</td>
              <td class="px-5 py-4 text-gray-800 font-medium">{{ item.summary }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.assignee }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.due }}</td>
              <td class="px-5 py-4 text-right text-gray-400 font-medium tracking-wide cursor-pointer hover:text-gray-600 flex items-center justify-end gap-1">
                {{ item.action }} <span class="text-lg leading-none">&rarr;</span>
              </td>
            </tr>
            <tr v-if="filteredQueue.length === 0">
              <td colspan="8" class="text-center py-12 text-gray-500">
                <div class="flex flex-col items-center justify-center">
                  <span class="text-2xl mb-2">🔍</span>
                  <p class="text-sm font-semibold text-gray-700">No action items found</p>
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
