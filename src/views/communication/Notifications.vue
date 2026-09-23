<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '@/store'
import { ChevronDown, Check, CheckCircle2, Search } from 'lucide-vue-next'

const router = useRouter()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

// --- BRANCH MANAGER VIEW DATA ---
const branchKPIs = computed(() => {
  const list = store.getNotificationsForUser(user.value)
  const unreadCount = list.filter(item => item.status === 'Unread' || item.read === 'No' || !item.isRead).length
  const inventoryCount = list.filter(item => item.category === 'Inventory').length
  const salesCount = list.filter(item => item.category === 'Sales').length
  const systemCount = list.filter(item => item.category === 'System' || item.category === 'Service' || item.category === 'Finance').length
  return [
    { label: 'Unread', value: String(unreadCount), subtext: 'Awaiting review', subtextClass: 'text-[#165A31] font-medium' },
    { label: 'Inventory', value: String(inventoryCount), subtext: 'Incoming / stock', subtextClass: 'text-[#165A31] font-medium' },
    { label: 'Sales', value: String(salesCount), subtext: 'Orders / payments', subtextClass: 'text-[#165A31] font-medium' },
    { label: 'System / Ops', value: String(systemCount), subtext: 'Operations & finance', subtextClass: 'text-[#165A31] font-medium' }
  ]
})

const branchStatusFilter = ref('All')
const branchDateFilter = ref('Date')
const branchSavedFilter = ref('Saved filters')
const branchCategoryFilter = ref('All Categories')
const branchSearchQuery = ref('')
const openBranchDropdown = ref(null)

const showToast = ref(false)
const toastMessage = ref('')

const branchColumns = ref([
  { key: 'time', label: 'Time', visible: true },
  { key: 'category', label: 'Category', visible: true },
  { key: 'notification', label: 'Notification', visible: true },
  { key: 'record', label: 'Record', visible: true },
  { key: 'status', label: 'Status', visible: true },
  { key: 'action', label: 'Action', visible: true }
])

const toggleBranchDropdown = (name) => {
  openBranchDropdown.value = openBranchDropdown.value === name ? null : name
}

const selectBranchSavedFilter = (preset) => {
  branchSavedFilter.value = preset
  if (preset === 'Unread Notifications') {
    branchStatusFilter.value = 'Unread'
  } else if (preset === 'Inventory Alerts') {
    branchCategoryFilter.value = 'Inventory'
  } else if (preset === 'Sales Events') {
    branchCategoryFilter.value = 'Sales'
  }
  openBranchDropdown.value = null
}

const clearBranchFilters = () => {
  branchStatusFilter.value = 'All'
  branchDateFilter.value = 'Date'
  branchSavedFilter.value = 'Saved filters'
  branchCategoryFilter.value = 'All Categories'
  branchSearchQuery.value = ''
}

const hasActiveBranchFilters = computed(() => {
  return branchStatusFilter.value !== 'All' ||
    branchDateFilter.value !== 'Date' ||
    branchSavedFilter.value !== 'Saved filters' ||
    branchCategoryFilter.value !== 'All Categories' ||
    branchSearchQuery.value.trim() !== ''
})

const filteredBranchNotifications = computed(() => {
  const list = store.getNotificationsForUser(user.value)
  return list.filter(item => {
    if (branchStatusFilter.value === 'Unread' && item.status !== 'Unread' && item.read !== 'No' && item.isRead) {
      return false
    }
    if (branchStatusFilter.value === 'Read' && (item.status === 'Unread' || item.read === 'No')) {
      return false
    }
    if (branchCategoryFilter.value !== 'All Categories' && item.category !== branchCategoryFilter.value) {
      return false
    }
    if (branchSearchQuery.value.trim()) {
      const q = branchSearchQuery.value.toLowerCase()
      const match = (item.notification && item.notification.toLowerCase().includes(q)) ||
                    (item.title && item.title.toLowerCase().includes(q)) ||
                    (item.message && item.message.toLowerCase().includes(q)) ||
                    (item.category && item.category.toLowerCase().includes(q)) ||
                    (item.record && String(item.record).toLowerCase().includes(q)) ||
                    (item.time && item.time.toLowerCase().includes(q))
      if (!match) return false
    }
    return true
  })
})

const exportBranchNotifications = () => {
  const headers = ['Time', 'Category', 'Notification', 'Record', 'Status']
  const rows = filteredBranchNotifications.value.map(item => [
    item.time,
    item.category,
    item.notification || item.title,
    item.record || item.source_id || '',
    item.status
  ])
  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `notifications_${Date.now()}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  toastMessage.value = `Exported ${filteredBranchNotifications.value.length} notifications successfully.`
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3000)
}

const getStatusBadgeClass = (status, read) => {
  if (status === 'Unread' || read === 'No') return 'bg-[#dbeafe] text-[#2563eb] font-bold'
  return 'bg-[#f3f4f6] text-[#6b7280]'
}

const markAsRead = (item) => {
  store.markNotificationRead(item.id)
  toastMessage.value = `Notification marked as read.`
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3000)
}

const markAllAsRead = () => {
  store.markAllNotificationsRead(user.value)
  toastMessage.value = `All notifications marked as read.`
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3000)
}

const openSourceRecord = (item) => {
  store.markNotificationRead(item.id)
  if (item.link && item.link !== '/communication/notifications') {
    router.push(item.link)
  } else {
    toastMessage.value = `Source record unavailable for ${item.record || item.title || 'this notification'}.`
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 4000)
  }
}

// --- SUPER ADMIN VIEW DATA ---
const activeFilter = ref('All')
const filterTabs = ['All', 'Unread']
const selectedCategory = ref('All Categories')
const searchQuery = ref('')

const categories = ['All Categories', 'Inventory', 'Sales', 'Procurement', 'Finance', 'Service', 'System']

const resetFilters = () => {
  activeFilter.value = 'All'
  selectedCategory.value = 'All Categories'
  searchQuery.value = ''
}

const filteredNotifications = computed(() => {
  const list = store.getNotificationsForUser(user.value)
  return list.filter(item => {
    if (activeFilter.value === 'Unread' && item.read !== 'No' && item.status !== 'Unread' && item.isRead) return false
    if (selectedCategory.value !== 'All Categories' && item.category.toLowerCase() !== selectedCategory.value.toLowerCase()) return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = (item.notification && item.notification.toLowerCase().includes(q)) ||
                    (item.title && item.title.toLowerCase().includes(q)) ||
                    (item.message && item.message.toLowerCase().includes(q)) ||
                    (item.category && item.category.toLowerCase().includes(q)) ||
                    (item.branch && item.branch.toLowerCase().includes(q)) ||
                    (item.time && item.time.toLowerCase().includes(q))
      if (!match) return false
    }
    return true
  })
})
</script>

<template>
  <!-- BRANCH MANAGER VIEW (Matching Screenshot 3 Pixel-Perfect) -->
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
          Branch Manager / Notifications / <span class="font-medium text-gray-600">Notifications</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Notifications</h1>
        <p class="text-xs text-gray-500 mt-1">Informational events only. Tasks requiring action stay in Action Centre.</p>
      </div>
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
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-wrap items-center gap-2">
        <!-- Status Dropdown -->
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
              v-for="st in ['All', 'Unread', 'Read']" 
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
              v-for="d in ['Date', 'Today', 'This Week', 'This Month', 'All Time']" 
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
            class="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <button 
              v-for="preset in ['Unread Notifications', 'Inventory Alerts', 'Sales Events']" 
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

        <!-- Sub-filter: Category -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('category')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': branchCategoryFilter !== 'All Categories' }"
          >
            <span>Category: {{ branchCategoryFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div 
            v-if="openBranchDropdown === 'category'" 
            class="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <button 
              v-for="cat in ['All Categories', 'Inventory', 'Sales', 'Service', 'System']" 
              :key="cat"
              @click="branchCategoryFilter = cat; openBranchDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
              :class="branchCategoryFilter === cat ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ cat }}</span>
              <Check v-if="branchCategoryFilter === cat" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <!-- Search Input -->
        <div class="relative w-44 sm:w-56 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            v-model="branchSearchQuery"
            type="text" 
            placeholder="Search notifications..." 
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

      <!-- Right Actions: Columns & Export -->
      <div class="flex items-center gap-2">
        <!-- Columns Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('columns')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            Columns
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
                class="rounded border-gray-300 text-[#165A31] focus:ring-[#165A31] mr-2.5 h-3.5 w-3.5 accent-[#165A31]"
              />
              <span>{{ col.label }}</span>
            </label>
          </div>
        </div>

        <!-- Export Button -->
        <button 
          @click="exportBranchNotifications"
          class="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
        >
          Export
        </button>
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <h3 class="text-sm font-bold text-gray-900">Notifications</h3>
          <button 
            @click="markAllAsRead" 
            class="text-[11px] font-semibold text-[#165A31] hover:underline cursor-pointer bg-[#eefcf2] px-2.5 py-0.5 rounded-full"
          >
            Mark all read
          </button>
        </div>
        <span class="text-xs text-gray-400 font-medium">{{ filteredBranchNotifications.length }} notifications</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-100 text-[11px] font-semibold text-gray-400">
              <th v-if="branchColumns.find(c => c.key === 'time')?.visible" class="py-3 px-4">Time</th>
              <th v-if="branchColumns.find(c => c.key === 'category')?.visible" class="py-3 px-4">Category</th>
              <th v-if="branchColumns.find(c => c.key === 'notification')?.visible" class="py-3 px-4">Notification</th>
              <th v-if="branchColumns.find(c => c.key === 'record')?.visible" class="py-3 px-4">Record</th>
              <th v-if="branchColumns.find(c => c.key === 'status')?.visible" class="py-3 px-4">Status</th>
              <th v-if="branchColumns.find(c => c.key === 'action')?.visible" class="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="text-xs divide-y divide-gray-50">
            <tr 
              v-for="(item, idx) in filteredBranchNotifications" 
              :key="idx" 
              class="hover:bg-gray-50/50 transition-colors cursor-pointer"
              :class="{ 'bg-emerald-50/20': item.status === 'Unread' || item.read === 'No' }"
              @click="openSourceRecord(item)"
            >
              <td v-if="branchColumns.find(c => c.key === 'time')?.visible" class="py-4 px-4 font-normal text-gray-700 whitespace-nowrap">{{ item.time }}</td>
              <td v-if="branchColumns.find(c => c.key === 'category')?.visible" class="py-4 px-4 font-normal text-gray-700">
                <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700">{{ item.category }}</span>
              </td>
              <td v-if="branchColumns.find(c => c.key === 'notification')?.visible" class="py-4 px-4 font-normal text-gray-800">
                <div class="font-semibold text-gray-900">{{ item.title || item.notification }}</div>
                <div class="text-[11px] text-gray-500 mt-0.5">{{ item.message || item.notification }}</div>
              </td>
              <td v-if="branchColumns.find(c => c.key === 'record')?.visible" class="py-4 px-4 font-medium text-gray-700">{{ item.record || item.source_id }}</td>
              <td v-if="branchColumns.find(c => c.key === 'status')?.visible" class="py-4 px-4">
                <span :class="['inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-medium', getStatusBadgeClass(item.status, item.read)]">
                  {{ (item.status === 'Unread' || item.read === 'No') ? 'Unread' : 'Read' }}
                </span>
              </td>
              <td v-if="branchColumns.find(c => c.key === 'action')?.visible" class="py-4 px-4 text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-2" @click.stop>
                  <button 
                    v-if="item.status === 'Unread' || item.read === 'No'"
                    @click="markAsRead(item)"
                    class="text-[11px] font-semibold text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                  >
                    Mark Read
                  </button>
                  <button 
                    @click="openSourceRecord(item)"
                    class="text-[11px] font-bold text-[#165A31] hover:underline"
                  >
                    Open
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="filteredBranchNotifications.length === 0">
              <td :colspan="branchColumns.filter(c => c.visible).length" class="text-center py-12 text-gray-500">
                <div class="flex flex-col items-center justify-center">
                  <span class="text-2xl mb-2">🔍</span>
                  <p class="text-sm font-semibold text-gray-700">No notifications match the selected filters</p>
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
  <div v-else class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div>
      <div class="text-[10px] text-gray-500 mb-1">
        Super Admin / Communication / <span class="font-bold text-gray-800">Notifications</span>
      </div>
      <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Notifications</h1>
      <p class="text-sm text-gray-500 mt-1">Informational system events. Notifications do not replace Action Centre tasks.</p>
    </div>

    <!-- Filters Bar -->
    <div class="space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <!-- Quick Tabs & Category Pills -->
        <div class="flex flex-wrap items-center gap-2">
          <div class="flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
            <button 
              v-for="tab in filterTabs" 
              :key="tab"
              @click="activeFilter = tab"
              class="px-4 py-1.5 text-[11px] font-medium rounded transition-colors cursor-pointer"
              :class="activeFilter === tab ? 'bg-[#eefcf2] text-[#165A31] font-bold' : 'text-gray-500 hover:text-gray-900'"
            >
              {{ tab }}
            </button>
          </div>

          <div class="flex flex-wrap items-center gap-1.5 ml-2">
            <button 
              v-for="cat in categories" 
              :key="cat"
              @click="selectedCategory = cat"
              class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] cursor-pointer"
              :class="selectedCategory === cat ? 'bg-[#165A31] text-white border-[#165A31]' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <!-- Search Bar -->
        <div class="flex items-center gap-2">
          <div class="relative w-full sm:w-60 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search notifications..." 
              class="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[11px] placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
            />
          </div>
          <button 
            v-if="searchQuery || activeFilter !== 'All' || selectedCategory !== 'All Categories'" 
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
          <div class="flex items-center gap-3">
            <h3 class="text-[13px] font-bold text-gray-900">Notifications</h3>
            <button 
              @click="markAllAsRead" 
              class="text-[11px] font-semibold text-[#165A31] hover:underline cursor-pointer bg-[#eefcf2] px-2.5 py-0.5 rounded-full"
            >
              Mark all read
            </button>
          </div>
          <span class="text-[11px] text-gray-400 font-medium">{{ filteredNotifications.length }} notifications</span>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th class="px-5 py-3">Time</th>
                <th class="px-5 py-3">Category</th>
                <th class="px-5 py-3">Notification</th>
                <th class="px-5 py-3">Branch</th>
                <th class="px-5 py-3">Read</th>
                <th class="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr 
                v-for="(item, idx) in filteredNotifications" 
                :key="idx" 
                class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
                :class="{ 'bg-emerald-50/20': item.read === 'No' || item.status === 'Unread' }"
                @click="openSourceRecord(item)"
              >
                <td class="px-5 py-4 text-gray-500 font-medium whitespace-nowrap">{{ item.time }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">
                  <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700">{{ item.category }}</span>
                </td>
                <td class="px-5 py-4 font-semibold text-gray-900">
                  <div>{{ item.title || item.notification }}</div>
                  <div v-if="item.message && item.message !== item.title" class="text-[10px] font-normal text-gray-500 mt-0.5">{{ item.message }}</div>
                </td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.branch }}</td>
                <td class="px-5 py-4 font-medium" :class="item.read === 'No' || item.status === 'Unread' ? 'text-emerald-700 font-bold' : 'text-gray-400'">
                  {{ (item.read === 'No' || item.status === 'Unread') ? 'No' : 'Yes' }}
                </td>
                <td class="px-5 py-4 text-right">
                  <span class="cursor-pointer text-xs font-bold text-[#165A31] hover:underline" @click.stop="openSourceRecord(item)">
                    {{ item.action || 'View' }}
                  </span>
                </td>
              </tr>
              <tr v-if="filteredNotifications.length === 0">
                <td colspan="6" class="text-center py-12 text-gray-500">
                  <div class="flex flex-col items-center justify-center">
                    <span class="text-2xl mb-2">🔍</span>
                    <p class="text-sm font-semibold text-gray-700">No notifications found</p>
                    <p class="text-xs text-gray-400 mt-1">Try adjusting your category filter or search query</p>
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
  </div>
</template>
