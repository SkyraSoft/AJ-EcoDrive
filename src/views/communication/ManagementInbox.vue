<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDown, Check, Plus, Search, CheckCircle2, MessageSquare } from 'lucide-vue-next'
import { store } from '@/store'
import CreateConversation from './CreateConversation.vue'

const router = useRouter()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)
const showCreateModal = ref(false)
const selectedConvToEdit = ref(null)
const showToast = ref(false)
const toastMessage = ref('')

// --- BRANCH MANAGER VIEW DATA ---
const branchKPIs = computed(() => {
  const currentBranch = user.value?.branchName || 'Peshawar'
  const list = store.conversations.filter(c => !c.branch || store.isBranchAllowed(c.branch))
  const unreadCount = list.filter(c => c.unread > 0 || c.status === 'Unread').length
  const stockReqCount = list.filter(c => c.linkedType === 'Stock Request' || (c.linked && c.linked.startsWith('SR'))).length
  const expenseCount = list.filter(c => c.linkedType === 'Expense' || (c.linked && c.linked.startsWith('EXP'))).length
  const serviceCount = list.filter(c => c.linkedType === 'Warranty Case' || (c.linked && (c.linked.startsWith('WAR') || c.linked.startsWith('SC')))).length
  return [
    { label: 'Unread', value: String(unreadCount), subtext: `${unreadCount} awaiting reply`, subtextClass: 'text-[#165A31] font-medium' },
    { label: 'Stock Requests', value: String(stockReqCount), subtext: 'Active threads', subtextClass: 'text-[#165A31] font-medium' },
    { label: 'Expense Questions', value: String(expenseCount), subtext: 'Financial notes', subtextClass: 'text-[#165A31] font-medium' },
    { label: 'Service Escalations', value: String(serviceCount), subtext: 'Claims & issues', subtextClass: 'text-[#165A31] font-medium' }
  ]
})

// Branch Manager Filter State
const branchStatusFilter = ref('All')
const branchDateFilter = ref('Date')
const branchSavedFilter = ref('Saved Filters')
const branchPriorityFilter = ref('All')
const branchLinkedTypeFilter = ref('All')
const branchSenderFilter = ref('All')
const branchSearchQuery = ref('')
const openBranchDropdown = ref(null)

// Column Visibility State for Branch View
const branchVisibleColumns = ref({
  thread: true,
  linked: true,
  from: true,
  lastMsg: true,
  priority: true,
  status: true,
  action: true
})

const toggleBranchColumn = (col) => {
  branchVisibleColumns.value[col] = !branchVisibleColumns.value[col]
}

const toggleBranchDropdown = (name) => {
  openBranchDropdown.value = openBranchDropdown.value === name ? null : name
}

const applyBranchSavedFilter = (f) => {
  branchSavedFilter.value = f
  if (f === 'Saved Filters' || f === 'All Conversations') {
    branchStatusFilter.value = 'All'
    branchDateFilter.value = 'Date'
    branchPriorityFilter.value = 'All'
    branchLinkedTypeFilter.value = 'All'
    branchSenderFilter.value = 'All'
  } else if (f === 'Unread Threads') {
    branchStatusFilter.value = 'Unread'
  } else if (f === 'Urgent & High Priority') {
    branchPriorityFilter.value = 'High'
  } else if (f === 'Stock Requests') {
    branchLinkedTypeFilter.value = 'Stock Request'
  } else if (f === 'Expense Inquiries') {
    branchLinkedTypeFilter.value = 'Expense'
  } else if (f === 'Warranty Escalations') {
    branchLinkedTypeFilter.value = 'Warranty Case'
  }
  openBranchDropdown.value = null
}

const clearBranchFilters = () => {
  branchStatusFilter.value = 'All'
  branchDateFilter.value = 'Date'
  branchSavedFilter.value = 'Saved Filters'
  branchPriorityFilter.value = 'All'
  branchLinkedTypeFilter.value = 'All'
  branchSenderFilter.value = 'All'
  branchSearchQuery.value = ''
  openBranchDropdown.value = null
}

const hasActiveBranchFilters = computed(() => {
  return branchStatusFilter.value !== 'All' ||
         branchDateFilter.value !== 'Date' ||
         branchSavedFilter.value !== 'Saved Filters' ||
         branchPriorityFilter.value !== 'All' ||
         branchLinkedTypeFilter.value !== 'All' ||
         branchSenderFilter.value !== 'All' ||
         branchSearchQuery.value.trim() !== ''
})

const filteredBranchConversations = computed(() => {
  return store.conversations.filter(item => {
    if (item.branch && !store.isBranchAllowed(item.branch)) {
      return false
    }
    // Status filter
    if (branchStatusFilter.value !== 'All') {
      if (item.status.toLowerCase() !== branchStatusFilter.value.toLowerCase()) {
        return false
      }
    }
    // Priority filter
    if (branchPriorityFilter.value !== 'All') {
      if (item.priority.toLowerCase() !== branchPriorityFilter.value.toLowerCase()) {
        return false
      }
    }
    // Linked Type filter
    if (branchLinkedTypeFilter.value !== 'All') {
      const type = (item.linkedType || item.category || '').toLowerCase()
      const linked = (item.linked || '').toLowerCase()
      const target = branchLinkedTypeFilter.value.toLowerCase()
      const isMatch = type.includes(target) || 
                      (target.includes('stock') && (linked.startsWith('sr') || type.includes('stock'))) ||
                      (target.includes('expense') && (linked.startsWith('exp') || type.includes('expense'))) ||
                      (target.includes('warranty') && (linked.startsWith('war') || linked.startsWith('sc') || type.includes('warranty') || type.includes('service'))) ||
                      (target.includes('order') && (linked.startsWith('ord') || linked.startsWith('so') || linked.startsWith('co') || type.includes('order')))
      if (!isMatch) return false
    }
    // Sender filter
    if (branchSenderFilter.value !== 'All') {
      const from = (item.from || '').toLowerCase()
      const target = branchSenderFilter.value.toLowerCase()
      if (target === 'super admin' && !from.includes('admin')) return false
      if (target === 'branch manager' && (from.includes('admin') || from.includes('finance'))) return false
      if (target === 'finance desk' && !from.includes('finance')) return false
    }
    // Date filter
    if (branchDateFilter.value !== 'Date' && branchDateFilter.value !== 'All Time') {
      const created = (item.created || item.lastReply || '').toLowerCase()
      if (branchDateFilter.value === 'Today' && !created.includes('today')) return false
      if (branchDateFilter.value === 'Yesterday' && !created.includes('yesterday')) return false
      if (branchDateFilter.value === 'This Week' && !created.includes('today') && !created.includes('yesterday') && !created.includes('aug') && !created.includes('sep')) return false
    }
    // Search query
    if (branchSearchQuery.value.trim()) {
      const q = branchSearchQuery.value.toLowerCase()
      const match = (item.title && item.title.toLowerCase().includes(q)) ||
                    (item.thread && item.thread.toLowerCase().includes(q)) ||
                    (item.linked && item.linked.toLowerCase().includes(q)) ||
                    (item.from && item.from.toLowerCase().includes(q)) ||
                    (item.lastMsg && item.lastMsg.toLowerCase().includes(q)) ||
                    (item.priority && item.priority.toLowerCase().includes(q))
      if (!match) return false
    }
    return true
  })
})

const exportBranchConversations = () => {
  openBranchDropdown.value = null
  const rows = filteredBranchConversations.value
  if (!rows.length) {
    toastMessage.value = 'No conversation records to export'
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 3000)
    return
  }
  
  const headers = ['Thread', 'Linked Record', 'From', 'Last Message', 'Priority', 'Status']
  const csvContent = 'data:text/csv;charset=utf-8,' + 
    [headers.join(','), ...rows.map(r => [
      `"${(r.title || r.thread || '').replace(/"/g, '""')}"`,
      `"${(r.linked || '').replace(/"/g, '""')}"`,
      `"${(r.from || '').replace(/"/g, '""')}"`,
      `"${(r.lastMsg || '').replace(/"/g, '""')}"`,
      `"${(r.priority || '').replace(/"/g, '""')}"`,
      `"${(r.status || '').replace(/"/g, '""')}"`
    ].join(','))].join('\n')
    
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `management_conversations_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  toastMessage.value = `Exported ${rows.length} conversations to CSV`
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 4000)
}

const getBranchStatusBadgeClass = (status) => {
  if (status === 'Unread') return 'bg-[#dbeafe] text-[#2563eb]'
  if (status === 'Open' || status === 'Resolved') return 'bg-[#dcfce7] text-[#16a34a]'
  if (status === 'Under Review' || status === 'In Progress') return 'bg-[#fff7ed] text-[#ea580c]'
  return 'bg-gray-100 text-gray-700'
}

const handleConversationCreated = (newConv) => {
  showCreateModal.value = false
  toastMessage.value = `Conversation "${newConv.title}" started!`
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 4000)
}

const handleConversationUpdated = (updatedConv) => {
  showCreateModal.value = false
  toastMessage.value = `Conversation "${updatedConv.title}" updated!`
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 4000)
}

// --- SUPER ADMIN VIEW DATA ---
const activeTab = ref('Inbox')
const tabs = ['Inbox', 'Sent', 'Unread']
const searchQuery = ref('')
const saStatusFilter = ref('All')
const saDateFilter = ref('Date')
const saSavedFilter = ref('Saved Filters')
const selectedBranch = ref('All Branches')
const selectedLinked = ref('All Types')
const selectedPriority = ref('All Priorities')
const openDropdown = ref(null)

const saVisibleColumns = ref({
  thread: true,
  branch: true,
  linked: true,
  from: true,
  lastMsg: true,
  priority: true,
  action: true
})

const toggleSaColumn = (col) => {
  saVisibleColumns.value[col] = !saVisibleColumns.value[col]
}

const branches = ['All Branches', 'Peshawar', 'Islamabad', 'Lahore', 'Rawalpindi']
const linkedTypes = ['All Types', 'Stock Request', 'Customer Order', 'Warranty Claim', 'Purchase Order', 'Expense']
const priorities = ['All Priorities', 'High', 'Medium', 'Low']

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const selectFilter = (type, val) => {
  if (type === 'branch') selectedBranch.value = val
  if (type === 'linked') selectedLinked.value = val
  if (type === 'priority') selectedPriority.value = val
  if (type === 'status') saStatusFilter.value = val
  if (type === 'date') saDateFilter.value = val
  openDropdown.value = null
}

const applySaSavedFilter = (f) => {
  saSavedFilter.value = f
  if (f === 'Saved Filters' || f === 'All Threads') {
    saStatusFilter.value = 'All'
    saDateFilter.value = 'Date'
    selectedBranch.value = 'All Branches'
    selectedLinked.value = 'All Types'
    selectedPriority.value = 'All Priorities'
  } else if (f === 'Unread Threads') {
    activeTab.value = 'Unread'
  } else if (f === 'Urgent Escalations') {
    selectedPriority.value = 'High'
  } else if (f === 'Stock Requests') {
    selectedLinked.value = 'Stock Request'
  } else if (f === 'Expense Inquiries') {
    selectedLinked.value = 'Expense'
  }
  openDropdown.value = null
}

const resetFilters = () => {
  activeTab.value = 'Inbox'
  searchQuery.value = ''
  saStatusFilter.value = 'All'
  saDateFilter.value = 'Date'
  saSavedFilter.value = 'Saved Filters'
  selectedBranch.value = 'All Branches'
  selectedLinked.value = 'All Types'
  selectedPriority.value = 'All Priorities'
  openDropdown.value = null
}

const hasActiveSaFilters = computed(() => {
  return searchQuery.value.trim() !== '' ||
         activeTab.value !== 'Inbox' ||
         saStatusFilter.value !== 'All' ||
         saDateFilter.value !== 'Date' ||
         saSavedFilter.value !== 'Saved Filters' ||
         selectedBranch.value !== 'All Branches' ||
         selectedLinked.value !== 'All Types' ||
         selectedPriority.value !== 'All Priorities'
})

const exportSAConversations = () => {
  openDropdown.value = null
  const rows = filteredConversations.value
  if (!rows.length) {
    toastMessage.value = 'No conversation records to export'
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 3000)
    return
  }
  
  const headers = ['Thread Topic', 'Branch', 'Linked Context', 'From', 'Last Message', 'Priority']
  const csvContent = 'data:text/csv;charset=utf-8,' + 
    [headers.join(','), ...rows.map(r => [
      `"${(r.thread || r.title || '').replace(/"/g, '""')}"`,
      `"${(r.branch || '').replace(/"/g, '""')}"`,
      `"${(r.linked || '').replace(/"/g, '""')}"`,
      `"${(r.from || '').replace(/"/g, '""')}"`,
      `"${(r.lastMsg || '').replace(/"/g, '""')}"`,
      `"${(r.priority || '').replace(/"/g, '""')}"`
    ].join(','))].join('\n')
    
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `sa_management_inbox_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  toastMessage.value = `Exported ${rows.length} threads to CSV`
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 4000)
}

const filteredConversations = computed(() => {
  return store.conversations.filter(item => {
    if (activeTab.value === 'Unread' && item.unread === 0 && item.status !== 'Unread') return false
    if (activeTab.value === 'Sent' && item.from !== 'Super Admin' && !item.from.includes('Admin')) return false
    if (saStatusFilter.value !== 'All' && item.status.toLowerCase() !== saStatusFilter.value.toLowerCase()) return false
    if (selectedBranch.value !== 'All Branches' && item.branch !== selectedBranch.value) return false
    if (selectedPriority.value !== 'All Priorities' && item.priority !== selectedPriority.value) return false
    if (selectedLinked.value !== 'All Types' && !item.linked.toLowerCase().includes(selectedLinked.value.toLowerCase().slice(0, 4))) return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = item.thread.toLowerCase().includes(q) ||
                    item.branch.toLowerCase().includes(q) ||
                    item.linked.toLowerCase().includes(q) ||
                    item.from.toLowerCase().includes(q) ||
                    item.lastMsg.toLowerCase().includes(q) ||
                    item.priority.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })
})

const openConversation = (item) => {
  store.markConversationRead(item.id)
  store.selectConversation(item)
  router.push({
    path: `/communication/inbox/${encodeURIComponent(item.id || item.linked)}`
  })
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
          Branch Manager / Management Inbox / <span class="font-medium text-gray-600">Management Inbox</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Management Inbox</h1>
        <p class="text-xs text-gray-500 mt-1">Operational conversations with Super Admin and management, separate from notifications.</p>
      </div>

      <!-- + New Conversation Button -->
      <button 
        @click="selectedConvToEdit = null; showCreateModal = true"
        class="bg-[#165A31] text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
      >
        <Plus class="w-4 h-4" /> <span>New Conversation</span>
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
        <!-- Status Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('status')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <span>Status: {{ branchStatusFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div 
            v-if="openBranchDropdown === 'status'" 
            class="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <button 
              v-for="st in ['All', 'Unread', 'Open', 'In Progress', 'Under Review', 'Resolved']" 
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
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('date')"
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
              v-for="d in ['Date', 'Today', 'Yesterday', 'This Week', 'This Month', 'All Time']" 
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
            @click="toggleBranchDropdown('savedFilters')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <span>{{ branchSavedFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div 
            v-if="openBranchDropdown === 'savedFilters'" 
            class="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <button 
              v-for="sf in ['All Conversations', 'Unread Threads', 'Urgent & High Priority', 'Stock Requests', 'Expense Inquiries', 'Warranty Escalations']" 
              :key="sf"
              @click="applyBranchSavedFilter(sf)"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
              :class="branchSavedFilter === sf ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ sf }}</span>
              <Check v-if="branchSavedFilter === sf" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <!-- Sub-filter: Priority Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('priority')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
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

        <!-- Sub-filter: Type / Linked Record Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('linkedType')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <span>Type: {{ branchLinkedTypeFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div 
            v-if="openBranchDropdown === 'linkedType'" 
            class="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <button 
              v-for="t in ['All', 'Stock Request', 'Expense', 'Warranty Case', 'Customer Order', 'General']" 
              :key="t"
              @click="branchLinkedTypeFilter = t; openBranchDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
              :class="branchLinkedTypeFilter === t ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ t }}</span>
              <Check v-if="branchLinkedTypeFilter === t" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <!-- Sub-filter: From / Sender Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('sender')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <span>From: {{ branchSenderFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div 
            v-if="openBranchDropdown === 'sender'" 
            class="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <button 
              v-for="s in ['All', 'Super Admin', 'Branch Manager', 'Finance Desk']" 
              :key="s"
              @click="branchSenderFilter = s; openBranchDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
              :class="branchSenderFilter === s ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ s }}</span>
              <Check v-if="branchSenderFilter === s" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <!-- Search Input -->
        <div class="relative w-44 sm:w-56 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            v-model="branchSearchQuery"
            type="text" 
            placeholder="Search conversations..." 
            class="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
          />
        </div>

        <!-- Clear Filters Button -->
        <button 
          v-if="hasActiveBranchFilters"
          @click="clearBranchFilters"
          class="text-xs font-semibold text-gray-400 hover:text-red-600 px-2 py-1 transition-colors cursor-pointer"
        >
          Clear
        </button>
      </div>

      <!-- Right Side: Columns & Export -->
      <div class="flex items-center gap-2">
        <!-- Columns Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('columns')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center gap-1.5"
          >
            <span>Columns</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div 
            v-if="openBranchDropdown === 'columns'" 
            class="absolute top-full right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <div class="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 mb-1">
              Toggle Columns
            </div>
            <label 
              v-for="(val, key) in branchVisibleColumns" 
              :key="key"
              @click.stop="toggleBranchColumn(key)"
              class="flex items-center justify-between px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer select-none capitalize"
            >
              <span>{{ key === 'lastMsg' ? 'Last Message' : (key === 'linked' ? 'Linked Record' : key) }}</span>
              <input 
                type="checkbox" 
                :checked="val" 
                class="accent-[#165A31] rounded cursor-pointer" 
              />
            </label>
          </div>
        </div>

        <!-- Export Button -->
        <button 
          @click="exportBranchConversations"
          class="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center gap-1.5"
        >
          <span>Export</span>
        </button>
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-bold text-gray-900">Conversations</h3>
        <span class="text-xs text-gray-400 font-medium">Showing {{ filteredBranchConversations.length }} conversations</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-100 text-[11px] font-semibold text-gray-400">
              <th v-if="branchVisibleColumns.thread" class="py-3 px-4">Thread</th>
              <th v-if="branchVisibleColumns.linked" class="py-3 px-4">Linked Record</th>
              <th v-if="branchVisibleColumns.from" class="py-3 px-4">From</th>
              <th v-if="branchVisibleColumns.lastMsg" class="py-3 px-4">Last Message</th>
              <th v-if="branchVisibleColumns.priority" class="py-3 px-4">Priority</th>
              <th v-if="branchVisibleColumns.status" class="py-3 px-4">Status</th>
              <th v-if="branchVisibleColumns.action" class="py-3 px-4 text-right"></th>
            </tr>
          </thead>
          <tbody class="text-xs divide-y divide-gray-50">
            <tr 
              v-for="item in filteredBranchConversations" 
              :key="item.id" 
              @click="openConversation(item)"
              class="hover:bg-gray-50/50 transition-colors cursor-pointer"
            >
              <td v-if="branchVisibleColumns.thread" class="py-4 px-4 font-semibold text-gray-900">{{ item.title || item.thread }}</td>
              <td v-if="branchVisibleColumns.linked" class="py-4 px-4 font-medium text-gray-800">{{ item.linked }}</td>
              <td v-if="branchVisibleColumns.from" class="py-4 px-4 font-medium text-gray-600">{{ item.from }}</td>
              <td v-if="branchVisibleColumns.lastMsg" class="py-4 px-4 font-medium text-gray-600 max-w-[200px] truncate">{{ item.lastMsg }}</td>
              <td v-if="branchVisibleColumns.priority" class="py-4 px-4">
                <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold', item.priorityClass]">
                  {{ item.priority }}
                </span>
              </td>
              <td v-if="branchVisibleColumns.status" class="py-4 px-4">
                <span :class="['inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-semibold', item.statusClass || getBranchStatusBadgeClass(item.status)]">
                  {{ item.status }}
                </span>
              </td>
              <td v-if="branchVisibleColumns.action" class="py-4 px-4 text-right">
                <button 
                  @click.stop="openConversation(item)" 
                  class="text-gray-500 hover:text-gray-900 text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
                >
                  Open <span class="text-gray-400">›</span>
                </button>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="filteredBranchConversations.length === 0">
              <td colspan="7" class="text-center py-12 text-gray-500">
                <p class="text-xs font-semibold text-gray-700">No conversations found matching the filter</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create / Edit Conversation Modal Popup -->
    <CreateConversation 
      v-if="showCreateModal" 
      :is-modal="true"
      :conversation="selectedConvToEdit"
      @close="showCreateModal = false" 
      @created="handleConversationCreated"
      @updated="handleConversationUpdated" 
    />
  </div>

  <!-- SUPER ADMIN VIEW -->
  <div v-else class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openDropdown = null">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Communication / <span class="font-bold text-gray-800">Management Inbox</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Management Inbox</h1>
        <p class="text-sm text-gray-500 mt-1">Audit and participate in branch-level operational discussions and escalation threads.</p>
      </div>
      <button 
        @click="showCreateModal = true"
        class="bg-[#165A31] text-white text-[11px] font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer"
      >
        <Plus class="w-4 h-4" />
        <span>New Thread</span>
      </button>
    </div>

    <!-- Filters Bar -->
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex flex-wrap items-center gap-2">
          <!-- Status Dropdown -->
          <div class="relative" @click.stop>
            <button 
              @click="toggleDropdown('status')"
              class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            >
              <span>Status: {{ saStatusFilter }}</span>
              <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
            </button>
            <div 
              v-if="openDropdown === 'status'" 
              class="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <button 
                v-for="st in ['All', 'Unread', 'Open', 'In Progress', 'Under Review', 'Pending Approval', 'Resolved']" 
                :key="st"
                @click="selectFilter('status', st)"
                class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
                :class="saStatusFilter === st ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
              >
                <span>{{ st }}</span>
                <Check v-if="saStatusFilter === st" class="w-3.5 h-3.5 text-[#165A31]" />
              </button>
            </div>
          </div>

          <!-- Date Dropdown -->
          <div class="relative" @click.stop>
            <button 
              @click="toggleDropdown('date')"
              class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            >
              <span>{{ saDateFilter }}</span>
              <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
            </button>
            <div 
              v-if="openDropdown === 'date'" 
              class="absolute top-full left-0 mt-1 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <button 
                v-for="d in ['Date', 'Today', 'Yesterday', 'This Week', 'This Month', 'All Time']" 
                :key="d"
                @click="selectFilter('date', d)"
                class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
                :class="saDateFilter === d ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
              >
                <span>{{ d }}</span>
                <Check v-if="saDateFilter === d" class="w-3.5 h-3.5 text-[#165A31]" />
              </button>
            </div>
          </div>

          <!-- Saved Filters Dropdown -->
          <div class="relative" @click.stop>
            <button 
              @click="toggleDropdown('savedFilters')"
              class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            >
              <span>{{ saSavedFilter }}</span>
              <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
            </button>
            <div 
              v-if="openDropdown === 'savedFilters'" 
              class="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <button 
                v-for="sf in ['All Threads', 'Unread Threads', 'Urgent Escalations', 'Stock Requests', 'Expense Inquiries']" 
                :key="sf"
                @click="applySaSavedFilter(sf)"
                class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
                :class="saSavedFilter === sf ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
              >
                <span>{{ sf }}</span>
                <Check v-if="saSavedFilter === sf" class="w-3.5 h-3.5 text-[#165A31]" />
              </button>
            </div>
          </div>

          <!-- Branch Dropdown -->
          <div class="relative" @click.stop>
            <button 
              @click="toggleDropdown('branch')"
              class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            >
              <span>Branch: {{ selectedBranch }}</span>
              <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
            </button>
            <div 
              v-if="openDropdown === 'branch'" 
              class="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <button 
                v-for="b in branches" 
                :key="b"
                @click="selectFilter('branch', b)"
                class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
                :class="selectedBranch === b ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
              >
                <span>{{ b }}</span>
                <Check v-if="selectedBranch === b" class="w-3.5 h-3.5 text-[#165A31]" />
              </button>
            </div>
          </div>

          <!-- Priority Dropdown -->
          <div class="relative" @click.stop>
            <button 
              @click="toggleDropdown('priority')"
              class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            >
              <span>Priority: {{ selectedPriority }}</span>
              <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
            </button>
            <div 
              v-if="openDropdown === 'priority'" 
              class="absolute top-full left-0 mt-1 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <button 
                v-for="p in priorities" 
                :key="p"
                @click="selectFilter('priority', p)"
                class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
                :class="selectedPriority === p ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
              >
                <span>{{ p }}</span>
                <Check v-if="selectedPriority === p" class="w-3.5 h-3.5 text-[#165A31]" />
              </button>
            </div>
          </div>

          <!-- Linked Type Dropdown -->
          <div class="relative" @click.stop>
            <button 
              @click="toggleDropdown('linked')"
              class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            >
              <span>Type: {{ selectedLinked }}</span>
              <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
            </button>
            <div 
              v-if="openDropdown === 'linked'" 
              class="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <button 
                v-for="lt in linkedTypes" 
                :key="lt"
                @click="selectFilter('linked', lt)"
                class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
                :class="selectedLinked === lt ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
              >
                <span>{{ lt }}</span>
                <Check v-if="selectedLinked === lt" class="w-3.5 h-3.5 text-[#165A31]" />
              </button>
            </div>
          </div>

          <!-- Search Input -->
          <div class="relative w-44 sm:w-56 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search thread, linked, from..." 
              class="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
            />
          </div>

          <!-- Clear Filters Button -->
          <button 
            v-if="hasActiveSaFilters"
            @click="resetFilters"
            class="text-xs font-semibold text-gray-400 hover:text-red-600 px-2 py-1 transition-colors cursor-pointer"
          >
            Clear
          </button>
        </div>

        <!-- Right Side: Columns & Export -->
        <div class="flex items-center gap-2">
          <!-- Columns Dropdown -->
          <div class="relative" @click.stop>
            <button 
              @click="toggleDropdown('columns')"
              class="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center gap-1.5"
            >
              <span>Columns</span>
              <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
            </button>
            <div 
              v-if="openDropdown === 'columns'" 
              class="absolute top-full right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <div class="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 mb-1">
                Toggle Columns
              </div>
              <label 
                v-for="(val, key) in saVisibleColumns" 
                :key="key"
                @click.stop="toggleSaColumn(key)"
                class="flex items-center justify-between px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer select-none capitalize"
              >
                <span>{{ key === 'lastMsg' ? 'Last Message' : (key === 'linked' ? 'Linked Context' : key) }}</span>
                <input 
                  type="checkbox" 
                  :checked="val" 
                  class="accent-[#165A31] rounded cursor-pointer" 
                />
              </label>
            </div>
          </div>

          <!-- Export Button -->
          <button 
            @click="exportSAConversations"
            class="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center gap-1.5"
          >
            <span>Export</span>
          </button>
        </div>
      </div>

      <!-- Table Container -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-[13px] font-bold text-gray-900">Conversations</h3>
          <span class="text-[11px] text-gray-400 font-medium">{{ filteredConversations.length }} threads</span>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th v-if="saVisibleColumns.thread" class="px-5 py-3">Thread Topic</th>
                <th v-if="saVisibleColumns.branch" class="px-5 py-3">Branch</th>
                <th v-if="saVisibleColumns.linked" class="px-5 py-3">Linked Context</th>
                <th v-if="saVisibleColumns.from" class="px-5 py-3">From</th>
                <th v-if="saVisibleColumns.lastMsg" class="px-5 py-3">Last Message Preview</th>
                <th v-if="saVisibleColumns.priority" class="px-5 py-3">Priority</th>
                <th v-if="saVisibleColumns.action" class="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr 
                v-for="item in filteredConversations" 
                :key="item.linked" 
                @click="openConversation(item)"
                class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer group"
              >
                <td v-if="saVisibleColumns.thread" class="px-5 py-4 font-bold text-gray-900 group-hover:text-[#165A31] transition-colors">{{ item.thread }}</td>
                <td v-if="saVisibleColumns.branch" class="px-5 py-4 text-gray-600 font-medium">{{ item.branch }}</td>
                <td v-if="saVisibleColumns.linked" class="px-5 py-4 text-gray-500 font-mono text-[10px]">{{ item.linked }}</td>
                <td v-if="saVisibleColumns.from" class="px-5 py-4 font-semibold text-gray-800">{{ item.from }}</td>
                <td v-if="saVisibleColumns.lastMsg" class="px-5 py-4 text-gray-600 max-w-[200px] truncate">{{ item.lastMsg }}</td>
                <td v-if="saVisibleColumns.priority" class="px-5 py-4">
                  <span 
                    class="inline-flex items-center px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold" 
                    :class="item.priorityClass"
                  >
                    {{ item.priority }}
                  </span>
                </td>
                <td v-if="saVisibleColumns.action" class="px-5 py-4 text-right">
                  <div class="flex items-center justify-end gap-1 text-gray-400 group-hover:text-[#165A31] font-medium tracking-wide">
                    <span>Open</span>
                    <span class="text-sm leading-none">&rarr;</span>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredConversations.length === 0">
                <td colspan="7" class="text-center py-12 text-gray-500">
                  <p class="text-xs font-semibold text-gray-700">No conversations found matching your criteria</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create Conversation Modal Popup -->
    <CreateConversation 
      v-if="showCreateModal" 
      :is-modal="true" 
      @close="showCreateModal = false" 
      @created="handleConversationCreated" 
    />
  </div>
</template>
