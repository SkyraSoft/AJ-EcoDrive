<script setup>
import { ref, computed } from 'vue'
import { ChevronDown, Check, CheckCircle2, Search } from 'lucide-vue-next'
import { store } from '@/store'

const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const kpis = [
  { label: 'MFA', value: 'Enabled', subtext: 'Recommended', subtextClass: 'text-[#165A31] font-medium' },
  { label: 'Active Sessions', value: '2', subtext: 'Web + mobile', subtextClass: 'text-[#165A31] font-medium' },
  { label: 'Last Login', value: 'Today 08:02', subtext: 'Peshawar', subtextClass: 'text-[#165A31] font-medium' },
  { label: 'Password', value: 'Changed 41d ago', subtext: 'Healthy', subtextClass: 'text-[#165A31] font-medium' }
]

const statusFilter = ref('All')
const dateFilter = ref('Date')
const savedFilter = ref('Saved filters')
const deviceFilter = ref('All Devices')
const locationFilter = ref('All Locations')
const searchQuery = ref('')
const openDropdown = ref(null)

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const activeSessions = ref([
  { session: 'Current', device: 'Chrome / Windows', location: 'Peshawar', lastActive: 'Now', status: 'Current', statusClass: 'bg-[#dcfce7] text-[#15803d]', isCurrent: true, date: 'Today' },
  { session: 'Mobile', device: 'Android', location: 'Peshawar', lastActive: '22 min ago', status: 'Active', statusClass: 'bg-[#dbeafe] text-[#2563eb]', isCurrent: false, date: 'Today' },
  { session: 'Tablet', device: 'iOS / Safari', location: 'Islamabad', lastActive: '2 days ago', status: 'Active', statusClass: 'bg-[#dbeafe] text-[#2563eb]', isCurrent: false, date: 'This Week' }
])

const columns = ref([
  { key: 'session', label: 'Session', visible: true },
  { key: 'device', label: 'Device', visible: true },
  { key: 'location', label: 'Location', visible: true },
  { key: 'lastActive', label: 'Last Active', visible: true },
  { key: 'status', label: 'Status', visible: true }
])

const showToast = ref(false)
const toastMessage = ref('')

const selectSavedFilter = (preset) => {
  savedFilter.value = preset
  if (preset === 'Current Active Only') {
    statusFilter.value = 'Current'
  } else if (preset === 'Mobile Devices') {
    deviceFilter.value = 'Android'
  }
  openDropdown.value = null
}

const clearFilters = () => {
  statusFilter.value = 'All'
  dateFilter.value = 'Date'
  savedFilter.value = 'Saved filters'
  deviceFilter.value = 'All Devices'
  locationFilter.value = 'All Locations'
  searchQuery.value = ''
}

const hasActiveFilters = computed(() => {
  return statusFilter.value !== 'All' ||
    dateFilter.value !== 'Date' ||
    savedFilter.value !== 'Saved filters' ||
    deviceFilter.value !== 'All Devices' ||
    locationFilter.value !== 'All Locations' ||
    searchQuery.value.trim() !== ''
})

const filteredSessions = computed(() => {
  return activeSessions.value.filter(item => {
    if (statusFilter.value !== 'All' && item.status !== statusFilter.value) return false
    if (deviceFilter.value !== 'All Devices' && item.device !== deviceFilter.value) return false
    if (locationFilter.value !== 'All Locations' && item.location !== locationFilter.value) return false
    if (dateFilter.value === 'Today' && item.date !== 'Today') return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = item.session.toLowerCase().includes(q) ||
                    item.device.toLowerCase().includes(q) ||
                    item.location.toLowerCase().includes(q) ||
                    item.status.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })
})

const exportSessions = () => {
  const headers = ['Session', 'Device', 'Location', 'Last Active', 'Status']
  const rows = filteredSessions.value.map(item => [
    item.session,
    item.device,
    item.location,
    item.lastActive,
    item.status
  ])
  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `security_sessions_${Date.now()}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  toastMessage.value = `Exported ${filteredSessions.value.length} sessions successfully.`
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3000)
}

const revokeSession = (idx) => {
  const s = filteredSessions.value[idx]
  const originalIdx = activeSessions.value.findIndex(item => item === s)
  if (originalIdx > -1) {
    activeSessions.value.splice(originalIdx, 1)
  }
  toastMessage.value = `Revoked session on ${s.device} successfully.`
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3000)
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openDropdown = null">
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
          Branch Manager / Security / <span class="font-medium text-gray-600">Security & Sessions</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Security & Sessions</h1>
        <p class="text-xs text-gray-500 mt-1">Password, MFA, login history and active session controls.</p>
      </div>
    </div>

    <!-- 4 KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div 
        v-for="kpi in kpis" 
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
            @click="toggleDropdown('status')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': statusFilter !== 'All' }"
          >
            <span>Status: {{ statusFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div 
            v-if="openDropdown === 'status'" 
            class="absolute top-full left-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <button 
              v-for="st in ['All', 'Active', 'Current']" 
              :key="st"
              @click="statusFilter = st; openDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
              :class="statusFilter === st ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ st }}</span>
              <Check v-if="statusFilter === st" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <!-- Date Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleDropdown('date')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': dateFilter !== 'Date' }"
          >
            <span>{{ dateFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div 
            v-if="openDropdown === 'date'" 
            class="absolute top-full left-0 mt-1 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <button 
              v-for="d in ['Date', 'Today', 'This Week', 'This Month', 'All Time']" 
              :key="d"
              @click="dateFilter = d; openDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
              :class="dateFilter === d ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ d }}</span>
              <Check v-if="dateFilter === d" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <!-- Saved Filters Button -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleDropdown('saved')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': savedFilter !== 'Saved filters' }"
          >
            <span>{{ savedFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div 
            v-if="openDropdown === 'saved'" 
            class="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <button 
              v-for="preset in ['Current Active Only', 'Mobile Devices']" 
              :key="preset"
              @click="selectSavedFilter(preset)"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
              :class="savedFilter === preset ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ preset }}</span>
              <Check v-if="savedFilter === preset" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <!-- Sub-filter: Device -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleDropdown('device')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': deviceFilter !== 'All Devices' }"
          >
            <span>Device: {{ deviceFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div 
            v-if="openDropdown === 'device'" 
            class="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <button 
              v-for="dev in ['All Devices', 'Chrome / Windows', 'Android', 'iOS / Safari']" 
              :key="dev"
              @click="deviceFilter = dev; openDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
              :class="deviceFilter === dev ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ dev }}</span>
              <Check v-if="deviceFilter === dev" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <!-- Sub-filter: Location -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleDropdown('location')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': locationFilter !== 'All Locations' }"
          >
            <span>Location: {{ locationFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div 
            v-if="openDropdown === 'location'" 
            class="absolute top-full left-0 mt-1 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <button 
              v-for="loc in ['All Locations', 'Peshawar', 'Islamabad', 'Lahore']" 
              :key="loc"
              @click="locationFilter = loc; openDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
              :class="locationFilter === loc ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ loc }}</span>
              <Check v-if="locationFilter === loc" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <!-- Search Input -->
        <div class="relative w-44 sm:w-56 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search sessions..." 
            class="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
          />
        </div>

        <!-- Clear Button -->
        <button 
          v-if="hasActiveFilters" 
          @click="clearFilters" 
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
            @click="toggleDropdown('columns')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            Columns
          </button>
          <div 
            v-if="openDropdown === 'columns'" 
            class="absolute top-full right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <div class="px-3 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 mb-1">
              Toggle Columns
            </div>
            <label 
              v-for="col in columns" 
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
          @click="exportSessions"
          class="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
        >
          Export
        </button>
      </div>
    </div>

    <!-- Table Card: Active Sessions -->
    <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-bold text-gray-900">Active Sessions</h3>
        <span class="text-xs text-gray-400 font-medium">{{ filteredSessions.length }} sessions</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-100 text-[11px] font-semibold text-gray-400">
              <th v-if="columns.find(c => c.key === 'session')?.visible" class="py-3 px-4">Session</th>
              <th v-if="columns.find(c => c.key === 'device')?.visible" class="py-3 px-4">Device</th>
              <th v-if="columns.find(c => c.key === 'location')?.visible" class="py-3 px-4">Location</th>
              <th v-if="columns.find(c => c.key === 'lastActive')?.visible" class="py-3 px-4">Last Active</th>
              <th v-if="columns.find(c => c.key === 'status')?.visible" class="py-3 px-4">Status</th>
              <th class="py-3 px-4 text-right"></th>
            </tr>
          </thead>
          <tbody class="text-xs divide-y divide-gray-50">
            <tr 
              v-for="(item, idx) in filteredSessions" 
              :key="idx" 
              class="hover:bg-gray-50/50 transition-colors"
            >
              <td v-if="columns.find(c => c.key === 'session')?.visible" class="py-4 px-4 font-normal text-gray-900">{{ item.session }}</td>
              <td v-if="columns.find(c => c.key === 'device')?.visible" class="py-4 px-4 font-normal text-gray-700">{{ item.device }}</td>
              <td v-if="columns.find(c => c.key === 'location')?.visible" class="py-4 px-4 font-normal text-gray-700">{{ item.location }}</td>
              <td v-if="columns.find(c => c.key === 'lastActive')?.visible" class="py-4 px-4 font-normal text-gray-700">{{ item.lastActive }}</td>
              <td v-if="columns.find(c => c.key === 'status')?.visible" class="py-4 px-4">
                <span :class="['inline-flex items-center px-4 py-0.5 rounded-full text-[11px] font-medium', item.statusClass]">
                  {{ item.status }}
                </span>
              </td>
              <td class="py-4 px-4 text-right">
                <span v-if="item.isCurrent" class="text-gray-400 font-medium">—</span>
                <button 
                  v-else 
                  @click="revokeSession(idx)" 
                  class="text-xs font-semibold text-gray-600 hover:text-red-600 transition-colors cursor-pointer"
                >
                  Revoke
                </button>
              </td>
            </tr>
            <tr v-if="filteredSessions.length === 0">
              <td colspan="6" class="text-center py-12 text-gray-500">
                <div class="flex flex-col items-center justify-center">
                  <span class="text-2xl mb-2">🔍</span>
                  <p class="text-sm font-semibold text-gray-700">No sessions match the selected filters</p>
                  <p class="text-xs text-gray-400 mt-1">Try adjusting your filters or search query</p>
                  <button @click="clearFilters" class="mt-3 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer">
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
