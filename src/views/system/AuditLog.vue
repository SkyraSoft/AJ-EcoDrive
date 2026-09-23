<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  ChevronDown, 
  Search, 
  ExternalLink, 
  Eye, 
  X, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Building2, 
  User, 
  Layers,
  ArrowRight,
  AlertCircle
} from 'lucide-vue-next'
import { store } from '@/store.js'

const router = useRouter()
const route = useRoute()

const searchQuery = ref('')
const selectedModule = ref('All Modules')
const selectedEntityType = ref('All Entities')
const selectedUser = ref('All Users')
const selectedBranch = ref('All Branches')
const selectedDate = ref('All Dates')
const openDropdown = ref(null)

const selectedEvent = ref(null)
const showDetailModal = ref(false)
const notFoundState = ref({ show: false, id: null, message: '' })

const currentUser = computed(() => store.currentUser || { 
  id: 'USR-01', 
  name: 'Super Admin', 
  role: 'Super Admin', 
  branchName: 'All Branches', 
  isSuperAdmin: true 
})

const isSuperAdmin = computed(() => !!currentUser.value.isSuperAdmin)

// Scoped audit events from canonical store
const auditEvents = computed(() => {
  return store.getAuditLogsForUser(currentUser.value)
})

// Dynamic filter options based on available logs
const modules = computed(() => {
  const set = new Set(auditEvents.value.map(e => e.module).filter(Boolean))
  return ['All Modules', ...Array.from(set)]
})

const entityLabels = {
  sales_order: 'Sales Order',
  purchase_order: 'Purchase Order',
  customer: 'Customer',
  product: 'Product',
  lead: 'Lead',
  quotation: 'Quotation',
  sale: 'Sale / Booking',
  invoice: 'Invoice',
  payment: 'Payment',
  delivery: 'Delivery',
  warranty: 'Warranty',
  service_case: 'Service Case',
  repair_job: 'Repair Job',
  transfer: 'Stock Transfer',
  stock_request: 'Stock Request',
  stock_adjustment: 'Stock Adjustment',
  goods_receipt: 'Goods Receipt',
  inventory_unit: 'Serialized Unit',
  user: 'User Account',
  branch: 'Branch Location',
  expense: 'Expense',
  role: 'Role & Permissions',
  system: 'System Event'
}

const getEntityLabel = (type) => {
  if (!type || type === 'All Entities') return 'All Entities'
  return entityLabels[type] || type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

const entityTypes = computed(() => {
  const set = new Set(auditEvents.value.map(e => e.entity_type).filter(Boolean))
  return ['All Entities', ...Array.from(set)]
})

const users = computed(() => {
  if (isSuperAdmin.value) {
    const set = new Set(auditEvents.value.map(e => e.user || e.actor_name).filter(Boolean))
    return ['All Users', ...Array.from(set)]
  }
  const branchUsers = store.users.filter(u => u.branch === currentUser.value.branchName).map(u => u.name)
  return ['All Users', ...Array.from(new Set(branchUsers))]
})

const branches = computed(() => {
  if (isSuperAdmin.value) {
    const list = store.branches ? store.branches.map(b => b.name) : ['Peshawar', 'Islamabad', 'Lahore', 'Rawalpindi']
    return ['All Branches', ...list]
  }
  return [currentUser.value.branchName || 'Peshawar']
})

const dateOptions = ['All Dates', 'Today', 'Yesterday', 'This Week', 'This Month']

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const selectFilter = (type, val) => {
  if (type === 'module') selectedModule.value = val
  if (type === 'entity') selectedEntityType.value = val
  if (type === 'user') selectedUser.value = val
  if (type === 'branch') selectedBranch.value = val
  if (type === 'date') selectedDate.value = val
  openDropdown.value = null
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedModule.value = 'All Modules'
  selectedEntityType.value = 'All Entities'
  selectedUser.value = 'All Users'
  selectedBranch.value = isSuperAdmin.value ? 'All Branches' : (currentUser.value.branchName || 'Peshawar')
  selectedDate.value = 'All Dates'
}

const matchesDate = (event, dateFilter) => {
  if (dateFilter === 'All Dates') return true
  if (!event.created_at && !event.timestamp) return true

  const now = new Date()
  const eventDate = event.created_at ? new Date(event.created_at) : null

  if (dateFilter === 'Today') {
    if (event.timestamp && event.timestamp.toLowerCase().includes('today')) return true
    if (!eventDate) return false
    return eventDate.toDateString() === now.toDateString()
  }
  if (dateFilter === 'Yesterday') {
    if (event.timestamp && event.timestamp.toLowerCase().includes('yesterday')) return true
    if (!eventDate) return false
    const y = new Date(now)
    y.setDate(y.getDate() - 1)
    return eventDate.toDateString() === y.toDateString()
  }
  if (dateFilter === 'This Week') {
    if (!eventDate) return true
    const diffDays = (now - eventDate) / (1000 * 60 * 60 * 24)
    return diffDays >= 0 && diffDays <= 7
  }
  if (dateFilter === 'This Month') {
    if (!eventDate) return true
    return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear()
  }

  return event.timestamp && event.timestamp.startsWith(dateFilter)
}

const filteredEvents = computed(() => {
  return auditEvents.value.filter(event => {
    if (selectedModule.value !== 'All Modules' && event.module !== selectedModule.value) return false
    if (selectedEntityType.value !== 'All Entities' && event.entity_type !== selectedEntityType.value) return false
    if (selectedUser.value !== 'All Users' && (event.user !== selectedUser.value && event.actor_name !== selectedUser.value)) return false
    if (selectedBranch.value !== 'All Branches' && event.branch !== selectedBranch.value) return false
    if (!matchesDate(event, selectedDate.value)) return false
    
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = (event.user && event.user.toLowerCase().includes(q)) ||
                    (event.role && event.role.toLowerCase().includes(q)) ||
                    (event.branch && event.branch.toLowerCase().includes(q)) ||
                    (event.module && event.module.toLowerCase().includes(q)) ||
                    (event.operation && event.operation.toLowerCase().includes(q)) ||
                    (event.action && event.action.toLowerCase().includes(q)) ||
                    (event.record && event.record.toLowerCase().includes(q)) ||
                    (event.entity_id && event.entity_id.toLowerCase().includes(q)) ||
                    (event.event_type && event.event_type.toLowerCase().includes(q)) ||
                    (event.result && event.result.toLowerCase().includes(q)) ||
                    (event.description && event.description.toLowerCase().includes(q))
      if (!match) return false
    }
    return true
  })
})

const inspectEvent = (event) => {
  selectedEvent.value = event
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  if (route.params.id || route.query.id) {
    router.replace('/system/audit-log')
  }
}

const navigateToRecord = (link) => {
  if (!link || link === '/system/audit-log' || link === '#') return
  showDetailModal.value = false
  router.push(link)
}

const formatMetadata = (meta) => {
  if (!meta || Object.keys(meta).length === 0) return null
  return meta
}

const resolveFromRoute = () => {
  const id = route.params.id || route.query.id
  if (!id) return
  const log = store.getAuditLogById(id)
  if (log) {
    const isAllowed = isSuperAdmin.value || 
      !log.branch || 
      log.branch === 'All Branches' || 
      log.branch.toLowerCase() === (currentUser.value.branchName || '').toLowerCase()
    
    if (isAllowed) {
      selectedEvent.value = log
      showDetailModal.value = true
      notFoundState.value = { show: false, id: null, message: '' }
    } else {
      notFoundState.value = {
        show: true,
        id,
        message: `Audit record "${id}" is restricted to branch "${log.branch}" and cannot be viewed in your current branch context.`
      }
    }
  } else {
    notFoundState.value = {
      show: true,
      id,
      message: `Audit log entry "${id}" could not be found in the current audit registry.`
    }
  }
}

onMounted(() => {
  resolveFromRoute()
})

watch(() => [route.params.id, route.query.id], () => {
  resolveFromRoute()
})
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openDropdown = null">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">
          <span class="font-medium">{{ isSuperAdmin ? 'Super Admin' : (currentUser.role || 'Branch Manager') }}</span> / System / <span class="font-bold text-gray-800">Audit Log</span>
        </div>
        <div class="flex items-center gap-3">
          <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Audit Log</h1>
          <span 
            class="px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1"
            :class="isSuperAdmin ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'"
          >
            <ShieldCheck class="w-3 h-3" />
            {{ isSuperAdmin ? 'Global Traceability' : `${currentUser.branchName || 'Branch'} Scoped` }}
          </span>
          <span class="px-2 py-0.5 text-[10px] font-semibold bg-gray-100 text-gray-600 rounded border border-gray-200">
            Immutable Ledger
          </span>
        </div>
        <p class="text-sm text-gray-500 mt-1">
          Chronological record of business operations, administrative actions, and status changes with full entity traceability.
        </p>
      </div>

      <!-- Quick Metrics -->
      <div class="flex items-center gap-2">
        <div class="bg-white border border-gray-100 rounded-xl px-4 py-2 text-right shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
          <div class="text-[10px] uppercase font-bold text-gray-400">Total Visible Events</div>
          <div class="text-lg font-bold text-gray-900">{{ auditEvents.length }}</div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-3">
      <!-- Search -->
      <div class="relative w-full sm:w-60">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="User, record, operation, description..." 
          class="w-full pl-9 pr-4 py-2 text-[11px] font-medium border border-gray-200 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.01)] focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31]"
        />
      </div>
      
      <!-- Module Dropdown -->
      <div class="relative">
        <button 
          @click.stop="toggleDropdown('module')"
          class="flex items-center gap-2 text-xs font-medium text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:text-gray-900 cursor-pointer"
          :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedModule !== 'All Modules' }"
        >
          <span>{{ selectedModule }}</span>
          <ChevronDown class="w-3 h-3 text-gray-400" />
        </button>
        <div v-if="openDropdown === 'module'" class="absolute left-0 mt-1 w-44 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
          <button 
            v-for="m in modules" 
            :key="m" 
            @click.stop="selectFilter('module', m)"
            class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700 cursor-pointer"
            :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedModule === m }"
          >
            {{ m }}
          </button>
        </div>
      </div>

      <!-- Entity Type Dropdown -->
      <div class="relative">
        <button 
          @click.stop="toggleDropdown('entity')"
          class="flex items-center gap-2 text-xs font-medium text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:text-gray-900 cursor-pointer"
          :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedEntityType !== 'All Entities' }"
        >
          <span>{{ getEntityLabel(selectedEntityType) }}</span>
          <ChevronDown class="w-3 h-3 text-gray-400" />
        </button>
        <div v-if="openDropdown === 'entity'" class="absolute left-0 mt-1 w-52 max-h-60 overflow-y-auto bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
          <button 
            v-for="e in entityTypes" 
            :key="e" 
            @click.stop="selectFilter('entity', e)"
            class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700 cursor-pointer flex items-center justify-between"
            :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedEntityType === e }"
          >
            <span>{{ getEntityLabel(e) }}</span>
          </button>
        </div>
      </div>

      <!-- User Dropdown -->
      <div class="relative">
        <button 
          @click.stop="toggleDropdown('user')"
          class="flex items-center gap-2 text-xs font-medium text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:text-gray-900 cursor-pointer"
          :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedUser !== 'All Users' }"
        >
          <span>{{ selectedUser }}</span>
          <ChevronDown class="w-3 h-3 text-gray-400" />
        </button>
        <div v-if="openDropdown === 'user'" class="absolute left-0 mt-1 w-44 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
          <button 
            v-for="u in users" 
            :key="u" 
            @click.stop="selectFilter('user', u)"
            class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700 cursor-pointer"
            :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedUser === u }"
          >
            {{ u }}
          </button>
        </div>
      </div>

      <!-- Branch Dropdown -->
      <div class="relative" v-if="isSuperAdmin">
        <button 
          @click.stop="toggleDropdown('branch')"
          class="flex items-center gap-2 text-xs font-medium text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:text-gray-900 cursor-pointer"
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
            class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700 cursor-pointer"
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
          class="flex items-center gap-2 text-xs font-medium text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:text-gray-900 cursor-pointer"
          :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedDate !== 'All Dates' }"
        >
          <span>{{ selectedDate }}</span>
          <ChevronDown class="w-3 h-3 text-gray-400" />
        </button>
        <div v-if="openDropdown === 'date'" class="absolute left-0 mt-1 w-36 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
          <button 
            v-for="d in dateOptions" 
            :key="d" 
            @click.stop="selectFilter('date', d)"
            class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700 cursor-pointer"
            :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedDate === d }"
          >
            {{ d }}
          </button>
        </div>
      </div>

      <button 
        v-if="searchQuery || selectedModule !== 'All Modules' || selectedEntityType !== 'All Entities' || selectedUser !== 'All Users' || (isSuperAdmin && selectedBranch !== 'All Branches') || selectedDate !== 'All Dates'" 
        @click="resetFilters" 
        class="text-[11px] font-semibold text-gray-500 hover:text-red-600 px-2 py-1 transition-colors cursor-pointer"
      >
        Clear Filters
      </button>
    </div>

    <!-- Table Container -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <h3 class="text-[13px] font-bold text-gray-900">Audit Events</h3>
          <span class="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
            {{ filteredEvents.length }} Events
          </span>
        </div>
        <span class="text-[11px] text-gray-400 font-medium">Click record or row to inspect</span>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <th class="px-5 py-3">Timestamp</th>
              <th class="px-5 py-3">User / Actor</th>
              <th class="px-5 py-3">Role</th>
              <th class="px-5 py-3">Branch</th>
              <th class="px-5 py-3">Module</th>
              <th class="px-5 py-3">Operation</th>
              <th class="px-5 py-3">Affected Record</th>
              <th class="px-5 py-3">Change / Description</th>
              <th class="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr 
              v-for="(event, idx) in filteredEvents" 
              :key="event.id || idx" 
              @click="inspectEvent(event)"
              class="border-b border-gray-50 hover:bg-gray-50/70 transition-colors cursor-pointer group"
            >
              <td class="px-5 py-3.5 text-gray-600 font-medium whitespace-nowrap">
                <div class="flex items-center gap-1.5">
                  <Clock class="w-3.5 h-3.5 text-gray-300" />
                  <span>{{ event.timestamp }}</span>
                </div>
              </td>
              <td class="px-5 py-3.5 font-semibold text-gray-800">
                {{ event.user || event.actor_name }}
              </td>
              <td class="px-5 py-3.5 text-gray-600 font-medium">
                {{ event.role || event.actor_role }}
              </td>
              <td class="px-5 py-3.5">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700">
                  {{ event.branch }}
                </span>
              </td>
              <td class="px-5 py-3.5 text-gray-600 font-medium">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">
                  {{ event.module }}
                </span>
              </td>
              <td class="px-5 py-3.5 font-semibold text-gray-900">
                {{ event.operation || event.action }}
              </td>
              <td class="px-5 py-3.5">
                <button 
                  v-if="event.link && event.link !== '/system/audit-log' && event.link !== '#'"
                  @click.stop="navigateToRecord(event.link)"
                  class="inline-flex items-center gap-1 text-[#165A31] hover:underline font-bold hover:text-[#0e3b20] cursor-pointer"
                  title="Open source record"
                >
                  <span>{{ event.record || event.entity_id }}</span>
                  <ExternalLink class="w-3 h-3 text-[#165A31] opacity-70 group-hover:opacity-100" />
                </button>
                <span v-else class="text-gray-600 font-medium">
                  {{ event.record || event.entity_id }}
                </span>
              </td>
              <td class="px-5 py-3.5 text-gray-700 font-normal max-w-xs truncate">
                {{ event.result || event.description }}
              </td>
              <td class="px-4 py-3.5 text-right" @click.stop>
                <button 
                  @click="inspectEvent(event)"
                  class="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                  title="Inspect event details"
                >
                  <Eye class="w-4 h-4" />
                </button>
              </td>
            </tr>
            <tr v-if="filteredEvents.length === 0">
              <td colspan="9" class="text-center py-12 text-gray-500">
                <div class="flex flex-col items-center justify-center">
                  <span class="text-2xl mb-2">🔍</span>
                  <p class="text-sm font-semibold text-gray-700">No audit events found</p>
                  <p class="text-xs text-gray-400 mt-1">Try adjusting your filters or search query</p>
                  <button 
                    @click="resetFilters" 
                    class="mt-3 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Reset filters
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Audit Event Detail Modal -->
    <div 
      v-if="showDetailModal && selectedEvent" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
      @click.self="closeDetailModal"
    >
      <div class="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#fbfbfc]">
          <div class="flex items-center gap-2">
            <ShieldCheck class="w-5 h-5 text-[#165A31]" />
            <div>
              <h3 class="text-base font-bold text-gray-900">Audit Event Trace</h3>
              <p class="text-[11px] text-gray-500 font-mono">{{ selectedEvent.id }}</p>
            </div>
          </div>
          <button 
            @click="closeDetailModal" 
            class="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-[12px]">
          <!-- Key Meta Badges -->
          <div class="flex flex-wrap items-center gap-2 pb-3 border-b border-gray-100">
            <span class="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#eefcf2] text-[#165A31]">
              {{ selectedEvent.module }}
            </span>
            <span class="px-2.5 py-1 rounded-md text-[11px] font-bold bg-gray-100 text-gray-800">
              {{ selectedEvent.event_type }}
            </span>
            <span class="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700">
              {{ selectedEvent.branch }}
            </span>
            <span class="ml-auto text-[11px] text-gray-500 font-medium">
              {{ selectedEvent.timestamp }}
            </span>
          </div>

          <!-- Event Grid Info -->
          <div class="grid grid-cols-2 gap-3 bg-gray-50/80 p-3.5 rounded-xl border border-gray-100">
            <div>
              <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Actor</div>
              <div class="font-bold text-gray-900">{{ selectedEvent.user || selectedEvent.actor_name }}</div>
              <div class="text-[11px] text-gray-500">{{ selectedEvent.role || selectedEvent.actor_role }}</div>
            </div>
            <div>
              <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Affected Record</div>
              <div class="font-bold text-gray-900 font-mono">{{ selectedEvent.record || selectedEvent.entity_id }}</div>
              <div class="text-[11px] text-gray-500 capitalize">{{ getEntityLabel(selectedEvent.entity_type) }}</div>
            </div>
            <div>
              <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Operation</div>
              <div class="font-semibold text-gray-900">{{ selectedEvent.operation || selectedEvent.action }}</div>
            </div>
            <div>
              <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Branch Location</div>
              <div class="font-semibold text-gray-900">{{ selectedEvent.branch }} ({{ selectedEvent.branch_id || 'BR-01' }})</div>
            </div>
          </div>

          <!-- Description / Summary -->
          <div>
            <div class="text-[11px] font-bold text-gray-700 mb-1">Audit Description</div>
            <div class="p-3 bg-white border border-gray-200 rounded-lg text-gray-800 font-medium leading-relaxed">
              {{ selectedEvent.description || selectedEvent.result }}
            </div>
          </div>

          <!-- Metadata Key-Values -->
          <div v-if="formatMetadata(selectedEvent.metadata)">
            <div class="text-[11px] font-bold text-gray-700 mb-1">State Transition / Metadata Payload</div>
            <div class="bg-gray-900 text-gray-100 p-3 rounded-xl font-mono text-[11px] overflow-x-auto">
              <div v-for="(val, key) in selectedEvent.metadata" :key="key" class="py-0.5">
                <span class="text-emerald-400">{{ key }}:</span>
                <span class="text-amber-200 ml-2">{{ typeof val === 'object' ? JSON.stringify(val) : val }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-3.5 border-t border-gray-100 bg-[#fbfbfc] flex items-center justify-between">
          <div class="text-[11px] text-gray-400 font-medium">
            System Origin: In-Memory Audit Ledger
          </div>
          <div class="flex items-center gap-2">
            <button 
              @click="closeDetailModal"
              class="px-3.5 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
            <button 
              v-if="selectedEvent.link && selectedEvent.link !== '/system/audit-log' && selectedEvent.link !== '#'"
              @click="navigateToRecord(selectedEvent.link)"
              class="px-4 py-1.5 bg-[#165A31] hover:bg-[#124827] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>View Source Record</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Audit Record Not Found / Unauthorized Modal -->
    <div 
      v-if="notFoundState.show" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
      @click.self="notFoundState.show = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden p-6 text-center">
        <div class="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <AlertCircle class="w-6 h-6" />
        </div>
        <h3 class="text-base font-bold text-gray-900 mb-1">Audit Record Notice</h3>
        <p class="text-xs text-gray-400 mb-3 font-mono">{{ notFoundState.id }}</p>
        <p class="text-xs text-gray-600 leading-relaxed mb-6">{{ notFoundState.message }}</p>
        <div class="flex items-center justify-center gap-3">
          <button 
            @click="notFoundState.show = false; router.replace('/system/audit-log')" 
            class="px-4 py-2 bg-[#165A31] text-white text-xs font-semibold rounded-lg hover:bg-[#124a28] transition-colors cursor-pointer shadow-sm"
          >
            Return to Audit Log
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
