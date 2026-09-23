<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDown, Search, Check, CheckCircle2 } from 'lucide-vue-next'
import { store } from '@/store.js'

const router = useRouter()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

// Registry mapping for task types to routes
const actionRouteRegistry = {
  'Stock Adjustment': { path: '/inventory/stock-adjustments/detail' },
  'Transfer': (item) => {
    if (item.action?.toLowerCase().includes('receive') || item.action?.toLowerCase().includes('discrepancy')) {
      return { path: '/inventory/transfers/receive', query: { id: item.record } }
    }
    return { path: '/inventory/transfers/detail', query: { id: item.record } }
  },
  'Stock Request': { path: '/inventory/stock-requests/detail' },
  'Service': { path: '/after-sales/repairs/detail' },
  'Sales Order': { path: '/sales/orders/detail' },
  'Return': { path: '/sales/returns/detail' },
  'Refund': { path: '/sales/returns/detail' },
  'Expense': { path: '/finance/expenses/detail' },
  'Purchase Order': { path: '/procurement/purchase-orders/detail' },
  'Complaint': { path: '/communication/cases/detail' },
  'Case': { path: '/communication/cases/detail' },
  'HR Alert': { path: '/organisation/users/detail' },
  'Low Stock Alert': { path: '/inventory/stock-by-product' },
  'Cycle Count': { path: '/inventory/cycle-counts/detail' },
  'Quarantine': { path: '/inventory/quarantine/detail' },
  'POS Variance': { path: '/finance/pos-variance' },
  'Promotion': { path: '/catalogue/marketing/promotions' },
  'Inventory': { path: '/inventory/stock-by-product' }
}

const resolveActionRoute = (item) => {
  if (!item) return null
  
  const routeConfig = actionRouteRegistry[item.type]
  if (!routeConfig) {
    // Try to guess based on prefix if type is missing or not in registry
    if (item.record?.startsWith('ADJ')) return { path: '/inventory/stock-adjustments/detail', query: { id: item.record } }
    if (item.record?.startsWith('TR')) return actionRouteRegistry['Transfer'](item)
    if (item.record?.startsWith('SR-')) return { path: '/inventory/stock-requests/detail', query: { id: item.record } }
    if (item.record?.startsWith('SRV') || item.record?.startsWith('RJ') || item.record?.startsWith('SC')) return { path: '/after-sales/repairs/detail', query: { id: item.record } }
    if (item.record?.startsWith('SO')) return { path: '/sales/orders/detail', query: { id: item.record } }
    if (item.record?.startsWith('RET')) return { path: '/sales/returns/detail', query: { id: item.record } }
    if (item.record?.startsWith('EXP')) return { path: '/finance/expenses/detail', query: { id: item.record } }
    if (item.record?.startsWith('PO')) return { path: '/procurement/purchase-orders/detail', query: { id: item.record } }
    if (item.record?.startsWith('SKU')) return { path: '/inventory/stock-by-product' }
    return null
  }

  if (typeof routeConfig === 'function') return routeConfig(item)
  
  // Routes without ID query parameter
  if (routeConfig.path === '/inventory/stock-by-product' || routeConfig.path === '/finance/pos-variance' || routeConfig.path === '/catalogue/marketing/promotions') {
    return { path: routeConfig.path }
  }

  return { path: routeConfig.path, query: { id: item.record } }
}

// Navigation Handlers for Action Queue
const openBranchTask = (item) => {
  const route = resolveActionRoute(item)
  if (route) {
    router.push(route)
  } else {
    toastMessage.value = 'This task type is not yet supported. Please navigate manually.'
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 3000)
  }
}

const openSuperAdminTask = (item) => {
  const route = resolveActionRoute(item)
  if (route) {
    router.push(route)
  } else {
    toastMessage.value = 'This task type is not yet supported. Please navigate manually.'
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 3000)
  }
}

// Branch Manager Data
const branchManagerKpis = [
  { label: 'Pending Actions', value: '9', sub: '3 high priority', positive: false },
  { label: 'Due Today', value: '4' },
  { label: 'Overdue', value: '2', sub: 'Needs attention', positive: false },
  { label: 'Completed Today', value: '11', sub: '+4', positive: true }
]

const branchActionQueue = ref([
  {
    priority: 'Critical',
    priorityClass: 'bg-[#fee2e2] text-[#dc2626]',
    action: 'Sign-off high value order',
    type: 'Sales Order',
    record: 'SO-8821',
    due: 'Today',
    status: 'Pending',
    statusClass: 'bg-[#fef3c7] text-[#b45309]'
  },
  {
    priority: 'High',
    priorityClass: 'bg-[#fee2e2] text-[#dc2626]',
    action: 'Approve stock adjustment',
    type: 'Stock Adjustment',
    record: 'ADJ-018',
    due: 'Today',
    status: 'Pending',
    statusClass: 'bg-[#fef3c7] text-[#b45309]'
  },
  {
    priority: 'High',
    priorityClass: 'bg-[#fee2e2] text-[#dc2626]',
    action: 'Receive transfer discrepancy',
    type: 'Transfer',
    record: 'TR-221',
    due: 'Today',
    status: 'Review',
    statusClass: 'bg-[#fef3c7] text-[#b45309]'
  },
  {
    priority: 'High',
    priorityClass: 'bg-[#fee2e2] text-[#dc2626]',
    action: 'Final sign-off on return',
    type: 'Return',
    record: 'RET-092',
    due: 'Today',
    status: 'Pending',
    statusClass: 'bg-[#fef3c7] text-[#b45309]'
  },
  {
    priority: 'High',
    priorityClass: 'bg-[#fee2e2] text-[#dc2626]',
    action: 'Resolve POS cash variance',
    type: 'POS Variance',
    record: 'POS-092',
    due: 'Today',
    status: 'Review',
    statusClass: 'bg-[#fef3c7] text-[#b45309]'
  },
  {
    priority: 'Medium',
    priorityClass: 'bg-[#fef3c7] text-[#b45309]',
    action: 'Escalated customer complaint',
    type: 'Complaint',
    record: 'CASE-912',
    due: 'Today',
    status: 'Pending',
    statusClass: 'bg-[#fef3c7] text-[#b45309]'
  },
  {
    priority: 'Medium',
    priorityClass: 'bg-[#fef3c7] text-[#b45309]',
    action: 'Review attendance anomaly',
    type: 'HR Alert',
    record: 'HR-011',
    due: 'Today',
    status: 'Review',
    statusClass: 'bg-[#fef3c7] text-[#b45309]'
  },
  {
    priority: 'Medium',
    priorityClass: 'bg-[#fef3c7] text-[#b45309]',
    action: 'Approve branch expense',
    type: 'Expense',
    record: 'EXP-221',
    due: 'Today',
    status: 'Pending',
    statusClass: 'bg-[#fef3c7] text-[#b45309]'
  },
  {
    priority: 'Medium',
    priorityClass: 'bg-[#fef3c7] text-[#b45309]',
    action: 'Review low stock item',
    type: 'Low Stock Alert',
    record: 'SKU BRG-E9',
    due: 'Tomorrow',
    status: 'Pending',
    statusClass: 'bg-[#fef3c7] text-[#b45309]'
  },
  {
    priority: 'Medium',
    priorityClass: 'bg-[#fef3c7] text-[#b45309]',
    action: 'Open cycle count',
    type: 'Cycle Count',
    record: 'CC-201',
    due: 'Tomorrow',
    status: 'Pending',
    statusClass: 'bg-[#fef3c7] text-[#b45309]'
  },
  {
    priority: 'Medium',
    priorityClass: 'bg-[#fef3c7] text-[#b45309]',
    action: 'Review quarantined items',
    type: 'Quarantine',
    record: 'QA-102',
    due: 'Tomorrow',
    status: 'Pending',
    statusClass: 'bg-[#fef3c7] text-[#b45309]'
  },
  {
    priority: 'Medium',
    priorityClass: 'bg-[#fef3c7] text-[#b45309]',
    action: 'Approve local promotion',
    type: 'Promotion',
    record: 'PROM-221',
    due: 'Tomorrow',
    status: 'Pending',
    statusClass: 'bg-[#fef3c7] text-[#b45309]'
  },
  {
    priority: 'Medium',
    priorityClass: 'bg-[#fef3c7] text-[#b45309]',
    action: 'Respond to stock request',
    type: 'Stock Request',
    record: 'SR-104',
    due: 'Tomorrow',
    status: 'Pending',
    statusClass: 'bg-[#fef3c7] text-[#b45309]'
  },
  {
    priority: 'Low',
    priorityClass: 'bg-gray-100 text-gray-700',
    action: 'Schedule periodic service check',
    type: 'Service',
    record: 'SRV-109',
    due: 'Tomorrow',
    status: 'Pending',
    statusClass: 'bg-[#fef3c7] text-[#b45309]'
  }
])

const branchStatusFilter = ref('All')
const branchDateFilter = ref('Date')
const branchSavedFilter = ref('Saved filters')
const branchPriorityFilter = ref('All')
const branchRecordTypeFilter = ref('All Types')
const branchSearchQuery = ref('')
const openBranchDropdown = ref(null)

const showToast = ref(false)
const toastMessage = ref('')

const branchColumns = ref([
  { key: 'priority', label: 'Priority', visible: true },
  { key: 'action', label: 'Action', visible: true },
  { key: 'record', label: 'Record', visible: true },
  { key: 'due', label: 'Due', visible: true },
  { key: 'status', label: 'Status', visible: true }
])

const toggleBranchDropdown = (name) => {
  openBranchDropdown.value = openBranchDropdown.value === name ? null : name
}

const selectBranchSavedFilter = (preset) => {
  branchSavedFilter.value = preset
  if (preset === 'High Priority Due Today') {
    branchPriorityFilter.value = 'High'
    branchDateFilter.value = 'Today'
    branchStatusFilter.value = 'All'
  } else if (preset === 'Pending Approvals') {
    branchStatusFilter.value = 'Pending'
    branchRecordTypeFilter.value = 'Stock Adjustment'
  } else if (preset === 'Discrepancies') {
    branchRecordTypeFilter.value = 'Transfer'
  }
  openBranchDropdown.value = null
}

const clearBranchFilters = () => {
  branchStatusFilter.value = 'All'
  branchDateFilter.value = 'Date'
  branchSavedFilter.value = 'Saved filters'
  branchPriorityFilter.value = 'All'
  branchRecordTypeFilter.value = 'All Types'
  branchSearchQuery.value = ''
}

const hasActiveBranchFilters = computed(() => {
  return branchStatusFilter.value !== 'All' ||
    branchDateFilter.value !== 'Date' ||
    branchSavedFilter.value !== 'Saved filters' ||
    branchPriorityFilter.value !== 'All' ||
    branchRecordTypeFilter.value !== 'All Types' ||
    branchSearchQuery.value.trim() !== ''
})

const filteredBranchQueue = computed(() => {
  return branchActionQueue.value.filter(item => {
    if (branchStatusFilter.value !== 'All' && item.status.toLowerCase() !== branchStatusFilter.value.toLowerCase()) return false
    if (branchPriorityFilter.value !== 'All' && item.priority.toLowerCase() !== branchPriorityFilter.value.toLowerCase()) return false
    if (branchRecordTypeFilter.value !== 'All Types' && item.type !== branchRecordTypeFilter.value) return false
    if (branchDateFilter.value === 'Today' && item.due !== 'Today') return false
    if (branchDateFilter.value === 'Tomorrow' && item.due !== 'Tomorrow') return false
    if (branchSearchQuery.value.trim()) {
      const q = branchSearchQuery.value.toLowerCase()
      const match = item.action.toLowerCase().includes(q) ||
                    item.record.toLowerCase().includes(q) ||
                    item.priority.toLowerCase().includes(q) ||
                    item.status.toLowerCase().includes(q) ||
                    (item.type && item.type.toLowerCase().includes(q))
      if (!match) return false
    }
    return true
  })
})

const exportBranchQueue = () => {
  const headers = ['Priority', 'Action', 'Type', 'Record', 'Due', 'Status']
  const rows = filteredBranchQueue.value.map(item => [
    item.priority,
    item.action,
    item.type || '',
    item.record,
    item.due,
    item.status
  ])
  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `action_centre_branch_${Date.now()}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  toastMessage.value = `Exported ${filteredBranchQueue.value.length} action items successfully.`
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3000)
}

// Super Admin Data
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

const superAdminKpis = [
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
    <div>
      <div class="text-[11px] text-gray-400 mb-1">
        Branch Manager / Action Centre / <span class="font-medium text-gray-600">Action Centre</span>
      </div>
      <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Action Centre</h1>
      <p class="text-xs text-gray-500 mt-1">Tasks requiring action in {{ user.branchName }} Branch; informational events remain in Notifications.</p>
    </div>

    <!-- 4 KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="(kpi, index) in branchManagerKpis" :key="index" class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <div class="text-xs font-semibold text-gray-400 mb-3">{{ kpi.label }}</div>
        <div>
          <div class="text-[26px] font-bold text-gray-900 leading-tight">{{ kpi.value }}</div>
          <div v-if="kpi.sub" class="text-[11px] font-bold mt-1" :class="kpi.positive ? 'text-[#209249]' : 'text-emerald-700'">
            {{ kpi.sub }}
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Buttons Row -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-wrap items-center gap-2">
        <!-- Status Filter Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('status')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': branchStatusFilter !== 'All' }"
          >
            <span>Status: {{ branchStatusFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div 
            v-if="openBranchDropdown === 'status'" 
            class="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <button 
              v-for="st in ['All', 'Pending', 'Review', 'Completed']" 
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

        <!-- Date Filter Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('date')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': branchDateFilter !== 'Date' }"
          >
            <span>{{ branchDateFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div 
            v-if="openBranchDropdown === 'date'" 
            class="absolute top-full left-0 mt-1 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <button 
              v-for="d in ['Date', 'Today', 'Tomorrow', 'This Week', 'This Month']" 
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
            :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': branchSavedFilter !== 'Saved filters' }"
          >
            <span>{{ branchSavedFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div 
            v-if="openBranchDropdown === 'saved'" 
            class="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <button 
              v-for="preset in ['High Priority Due Today', 'Pending Approvals', 'Discrepancies']" 
              :key="preset"
              @click="selectBranchSavedFilter(preset)"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
              :class="branchSavedFilter === preset ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ preset }}</span>
              <Check v-if="branchSavedFilter === preset" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <!-- Sub-filter: Priority -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('priority')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': branchPriorityFilter !== 'All' }"
          >
            <span>Priority: {{ branchPriorityFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div 
            v-if="openBranchDropdown === 'priority'" 
            class="absolute top-full left-0 mt-1 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <button 
              v-for="p in ['All', 'High', 'Medium', 'Low']" 
              :key="p"
              @click="branchPriorityFilter = p; openBranchDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
              :class="branchPriorityFilter === p ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ p }}</span>
              <Check v-if="branchPriorityFilter === p" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <!-- Sub-filter: Task Type -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('type')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': branchRecordTypeFilter !== 'All Types' }"
          >
            <span>Type: {{ branchRecordTypeFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div 
            v-if="openBranchDropdown === 'type'" 
            class="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <button 
              v-for="t in ['All Types', 'Stock Adjustment', 'Transfer', 'Stock Request', 'Service', 'Sales Order', 'Return', 'POS Variance', 'Complaint', 'HR Alert', 'Expense', 'Low Stock Alert', 'Cycle Count', 'Quarantine', 'Promotion']" 
              :key="t"
              @click="branchRecordTypeFilter = t; openBranchDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
              :class="branchRecordTypeFilter === t ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ t }}</span>
              <Check v-if="branchRecordTypeFilter === t" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <!-- Search Input -->
        <div class="relative w-44 sm:w-56 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            v-model="branchSearchQuery"
            type="text" 
            placeholder="Search actions..." 
            class="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
          />
        </div>

        <!-- Clear Button -->
        <button 
          v-if="hasActiveBranchFilters" 
          @click="clearBranchFilters" 
          class="text-xs font-semibold text-gray-400 hover:text-red-600 px-2 py-1 transition-colors cursor-pointer"
        >
          Clear
        </button>
      </div>

      <!-- Right Action Controls -->
      <div class="flex items-center gap-2">
        <!-- Columns Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('columns')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <span>Columns</span>
          </button>
          <div 
            v-if="openBranchDropdown === 'columns'" 
            class="absolute top-full right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <div class="px-3 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 mb-1">
              Toggle Columns
            </div>
            <label 
              v-for="col in branchColumns" 
              :key="col.key" 
              class="flex items-center px-3.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input 
                type="checkbox" 
                v-model="col.visible" 
                @change="openBranchDropdown = null"
                class="rounded border-gray-300 text-[#165A31] focus:ring-[#165A31] mr-2.5 h-3.5 w-3.5 accent-[#165A31]"
              />
              <span>{{ col.label }}</span>
            </label>
          </div>
        </div>

        <!-- Export Button -->
        <button 
          @click="exportBranchQueue"
          class="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
        >
          <span>Export</span>
        </button>
      </div>
    </div>

    <!-- My Action Queue Table -->
    <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
      <div class="flex items-center justify-between mb-5">
        <h3 class="text-sm font-bold text-gray-900">My Action Queue</h3>
        <span class="text-xs text-gray-400 font-medium">{{ filteredBranchQueue.length }} tasks</span>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="text-[10px] font-bold text-gray-400 border-b border-gray-100 pb-3 uppercase tracking-wider">
              <th v-if="branchColumns.find(c => c.key === 'priority')?.visible" class="pb-3 font-semibold w-24">Priority</th>
              <th v-if="branchColumns.find(c => c.key === 'action')?.visible" class="pb-3 font-semibold">Action</th>
              <th v-if="branchColumns.find(c => c.key === 'record')?.visible" class="pb-3 font-semibold w-40">Record</th>
              <th v-if="branchColumns.find(c => c.key === 'due')?.visible" class="pb-3 font-semibold w-28">Due</th>
              <th v-if="branchColumns.find(c => c.key === 'status')?.visible" class="pb-3 font-semibold w-32">Status</th>
              <th class="pb-3 font-semibold w-16 text-right"></th>
            </tr>
          </thead>
          <tbody class="text-xs divide-y divide-gray-50">
            <tr 
              v-for="(item, index) in filteredBranchQueue" 
              :key="index" 
              @click="openBranchTask(item)"
              class="hover:bg-gray-50/50 transition-colors cursor-pointer group"
            >
              <td v-if="branchColumns.find(c => c.key === 'priority')?.visible" class="py-4 align-middle">
                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap" :class="item.priorityClass">
                  {{ item.priority }}
                </span>
              </td>
              <td v-if="branchColumns.find(c => c.key === 'action')?.visible" class="py-4 align-middle text-gray-700 font-medium">
                {{ item.action }}
              </td>
              <td v-if="branchColumns.find(c => c.key === 'record')?.visible" class="py-4 align-middle text-gray-600 font-medium">
                {{ item.record }}
              </td>
              <td v-if="branchColumns.find(c => c.key === 'due')?.visible" class="py-4 align-middle text-gray-600 font-medium">
                {{ item.due }}
              </td>
              <td v-if="branchColumns.find(c => c.key === 'status')?.visible" class="py-4 align-middle">
                <span class="px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap" :class="item.statusClass">
                  {{ item.status }}
                </span>
              </td>
              <td class="py-4 align-middle text-right whitespace-nowrap">
                <button 
                  @click.stop="openBranchTask(item)"
                  class="text-xs font-medium text-gray-400 group-hover:text-gray-700 hover:text-gray-900 cursor-pointer flex items-center justify-end gap-0.5 ml-auto"
                >
                  Open &rsaquo;
                </button>
              </td>
            </tr>
            <tr v-if="filteredBranchQueue.length === 0">
              <td colspan="6" class="text-center py-12 text-gray-500">
                <div class="flex flex-col items-center justify-center">
                  <span class="text-2xl mb-2">🔍</span>
                  <p class="text-sm font-semibold text-gray-700">No action items match the selected filters</p>
                  <p class="text-xs text-gray-400 mt-1">Try adjusting your filters or search query</p>
                  <button @click="clearBranchFilters" class="mt-3 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer">
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

  <!-- SUPER ADMIN VIEW -->
  <div v-else class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openDropdown = null">
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
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="(kpi, index) in superAdminKpis" :key="index" class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
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
        <table class="w-full text-left border-collapse">
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
            <tr 
              v-for="(item, idx) in filteredQueue" 
              :key="idx" 
              @click="openSuperAdminTask(item)"
              class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer group"
            >
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
              <td class="px-5 py-4 text-right text-gray-400 group-hover:text-gray-700 hover:text-gray-900 font-medium tracking-wide cursor-pointer flex items-center justify-end gap-1">
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
        </table>
      </div>
    </div>
  </div>
</template>

