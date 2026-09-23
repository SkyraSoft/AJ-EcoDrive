<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, AlertCircle, CheckCircle2, ShieldCheck, Wrench, RefreshCw, X } from 'lucide-vue-next'
import { store } from '@/store.js'

const route = useRoute()
const router = useRouter()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const showToast = ref(false)
const toastMessage = ref('')

const triggerToast = (msg) => {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3500)
}

const unitId = computed(() => route.params.id || route.query.id || '')
// Strict lookup without fallback to first unit
const currentUnit = computed(() => unitId.value ? store.getUnitById(unitId.value) : null)

// Modal for Status Change
const showStatusModal = ref(false)
const targetStatus = ref('')
const statusReason = ref('')

const openStatusChange = (status) => {
  targetStatus.value = status
  statusReason.value = ''
  showStatusModal.value = true
}

const confirmStatusChange = () => {
  if (!currentUnit.value || !targetStatus.value) return
  const success = store.transitionUnitStatus(
    currentUnit.value.id || currentUnit.value.serial,
    targetStatus.value,
    statusReason.value || `Manual update to ${targetStatus.value}`,
    user.value?.name || 'Inventory Officer'
  )
  if (success) {
    triggerToast(`Unit ${currentUnit.value.serial} status changed to ${targetStatus.value}`)
    showStatusModal.value = false
  } else {
    triggerToast(`Cannot transition unit from ${currentUnit.value.status} to ${targetStatus.value}`)
  }
}

// Allowed status transitions
const availableTransitions = computed(() => {
  if (!currentUnit.value) return []
  const current = currentUnit.value.status
  const targets = ['Available', 'QC Hold', 'Maintenance', 'Reserved']
  return targets.filter(t => t !== current && store.canTransitionUnitStatus(current, t))
})

// Branch Manager Tabs & Data
const branchCurrentTab = ref('Overview')
const branchTabs = [
  'Overview',
  'Identification',
  'Location',
  'Movement History',
  'Sale & Reservation',
  'Documents',
  'Timeline'
]

const branchUnitItems = computed(() => {
  if (!currentUnit.value) return []
  const u = currentUnit.value
  const branchName = u.branch || user.value?.branchName || 'Peshawar'

  switch (branchCurrentTab.value) {
    case 'Overview':
      return [
        { label: 'Product', value: u.product || 'BRG DS11' },
        { label: 'Serial Number', value: u.serial || u.id },
        { label: 'Chassis Number', value: u.chassis || 'CH-90111' },
        { label: 'VIN', value: u.vin || u.chassis || 'VIN-UNKNOWN' },
        { label: 'Current Status', value: u.status || 'Available' },
        { label: 'Branch / Bay', value: `${branchName} — ${u.location || 'Showroom'}` }
      ]
    case 'Identification':
      return [
        { label: 'VIN', value: u.vin || u.chassis || 'N/A' },
        { label: 'Chassis No.', value: u.chassis || 'N/A' },
        { label: 'Motor Serial', value: u.motorSerial || 'MTR-44102' },
        { label: 'Battery Serial', value: u.batterySerial || 'BAT-88210' },
        { label: 'Color / Variant', value: u.color || 'Onyx Black' },
        { label: 'Product Model', value: u.product || 'BRG DS11' }
      ]
    case 'Location':
      return [
        { label: 'Assigned Branch', value: `${branchName} Branch` },
        { label: 'Current Bay', value: u.location || 'Showroom Floor' },
        { label: 'Storage Sub-zone', value: 'Display Zone A' },
        { label: 'Status at Location', value: u.status },
        { label: 'Last Inspected', value: 'Recent cycle count' },
        { label: 'Assigned Handler', value: 'Branch Inventory Lead' }
      ]
    case 'Movement History':
      return [
        { label: 'Latest Movement', value: u.source || u.sourcePo || 'Initial Inwarding' },
        { label: 'Source Inwarding', value: u.sourcePo || 'PO-2026-001' },
        { label: 'Current Location', value: `${branchName}` },
        { label: 'Physical Transfer State', value: u.status === 'In Transit' ? 'In Transit between branches' : 'Stationed at branch' }
      ]
    case 'Sale & Reservation':
      return [
        { label: 'Sale Status', value: u.status === 'Sold' ? 'Sold to Customer' : 'Unsold (In Inventory)' },
        { label: 'Reservation State', value: u.status === 'Reserved' ? `Reserved for ${u.customer || 'Customer Order'}` : 'Not reserved' },
        { label: 'Customer Name', value: u.customer || '—' },
        { label: 'Linked Order', value: u.order || '—' },
        { label: 'Warranty Trigger', value: 'Activates upon customer sale delivery' }
      ]
    case 'Documents':
      return [
        { label: 'Inspection Sheet', value: 'PDI_Inspection_Report.pdf' },
        { label: 'Inwarding GRN', value: `${u.sourcePo || 'GRN-01'}_Receipt.pdf` },
        { label: 'QC Certificate', value: 'Passed_QC_Stamp.pdf' },
        { label: 'Total Attached', value: '3 documents' }
      ]
    case 'Timeline':
      return []
    default:
      return []
  }
})

// Super Admin Tabs & Data
const activeTab = ref('Overview')
const tabs = ['Overview', 'Identification', 'Cost', 'Location', 'Purchase Source', 'Timeline']

const costs = computed(() => {
  const cost = currentUnit.value?.landedCost || '163.4K'
  return [
    { component: 'Base Unit Cost', amount: '146.0K' },
    { component: 'Freight Allocation', amount: '8.3K' },
    { component: 'Duty Allocation', amount: '5.1K' },
    { component: 'Other Allocation', amount: '4.0K' },
    { component: 'Total Landed Cost', amount: typeof cost === 'number' ? `PKR ${cost.toLocaleString()}` : `PKR ${cost}` }
  ]
})
</script>

<template>
  <!-- Toast Notification -->
  <div 
    v-if="showToast" 
    class="fixed bottom-5 right-5 z-[110] bg-[#165A31] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200"
  >
    <CheckCircle2 class="w-5 h-5 text-green-300" />
    <span class="text-xs font-bold">{{ toastMessage }}</span>
  </div>

  <!-- NOT FOUND STATE -->
  <div v-if="!currentUnit" class="max-w-[800px] mx-auto py-16 text-center space-y-4">
    <div class="inline-flex p-3 rounded-full bg-red-50 text-red-600 mb-2">
      <AlertCircle class="w-8 h-8" />
    </div>
    <h2 class="text-xl font-bold text-gray-900">Serialized Unit Not Found</h2>
    <p class="text-xs text-gray-500">Unit ID or Serial "{{ unitId }}" does not exist in inventory records.</p>
    <button @click="router.push('/inventory/serialized-units')" class="px-4 py-2 bg-[#165A31] text-white rounded-lg text-xs font-bold hover:bg-[#124a28] cursor-pointer">
      &larr; Back to Serialized Units
    </button>
  </div>

  <!-- BRANCH MANAGER VIEW -->
  <div v-else-if="isBranchUser" class="max-w-[1400px] mx-auto pb-12 space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[11px] text-gray-400 mb-1">
          Branch Manager / Serialized Units / <span class="font-medium text-gray-600">Unit {{ currentUnit.serial }}</span>
        </div>
        <div class="flex items-center gap-3">
          <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Unit {{ currentUnit.serial }}</h1>
          <span 
            class="px-2.5 py-1 rounded-full text-[10px] font-bold"
            :class="currentUnit.status === 'Available' ? 'bg-[#dcfce7] text-[#165A31]' : (currentUnit.status === 'Reserved' ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700')"
          >
            {{ currentUnit.status }}
          </span>
        </div>
        <p class="text-xs text-gray-500 mt-1">Serialized-unit detail — {{ branchCurrentTab }}.</p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2.5">
        <button 
          @click="router.push('/inventory/serialized-units')"
          class="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
        >
          <ArrowLeft class="w-3.5 h-3.5" /> Back
        </button>

        <!-- Dynamic Status Transition Buttons -->
        <button 
          v-for="target in availableTransitions" 
          :key="target"
          @click="openStatusChange(target)"
          class="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition-colors shadow-sm cursor-pointer"
          :class="target === 'Available' ? 'bg-[#165A31] text-white hover:bg-[#124a28]' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'"
        >
          <span>Move to {{ target }}</span>
        </button>
      </div>
    </div>

    <!-- Tabs Navigation Bar -->
    <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-2">
      <div class="flex items-center gap-2 overflow-x-auto">
        <button 
          v-for="tab in branchTabs" 
          :key="tab"
          @click="branchCurrentTab = tab"
          class="px-3 py-1.5 text-xs rounded-lg whitespace-nowrap transition-colors cursor-pointer"
          :class="branchCurrentTab === tab ? 'bg-[#dcfce7] text-[#165A31] font-bold' : 'text-gray-500 hover:text-gray-900 font-medium'"
        >
          {{ tab }}
        </button>
      </div>
    </div>

    <!-- Tab Content: Left Box & Right Box -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left Box -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 lg:col-span-8 flex flex-col justify-between">
        <div>
          <h3 class="text-sm font-bold text-gray-900 mb-5">{{ branchCurrentTab }}</h3>
          
          <!-- Timeline View -->
          <div v-if="branchCurrentTab === 'Timeline'" class="space-y-4">
            <div v-for="(item, idx) in currentUnit.timeline" :key="idx" class="flex items-start gap-3 border-l-2 border-[#165A31] pl-4 py-1">
              <div>
                <div class="text-xs font-bold text-gray-900">{{ item.status || item.event }}</div>
                <div class="text-[11px] text-gray-600">{{ item.note || '' }}</div>
                <div class="text-[10px] text-gray-400 mt-0.5">{{ item.timestamp || item.time }} &middot; {{ item.user }}</div>
              </div>
            </div>
            <div v-if="!currentUnit.timeline || currentUnit.timeline.length === 0" class="text-xs text-gray-400">
              No historical events recorded for this unit.
            </div>
          </div>

          <!-- Other Tabs View -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <div v-for="(item, idx) in branchUnitItems" :key="idx" class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">{{ item.label }}</span>
              <span class="text-sm font-bold text-gray-900 mt-1">{{ item.value }}</span>
            </div>
          </div>
        </div>

        <!-- Alert Notice Banner -->
        <div class="bg-[#f0fdf4] border border-[#dcfce7] rounded-lg p-3.5 text-[11px] text-gray-600 leading-relaxed font-medium">
          Landed-cost visibility is permission controlled and is not displayed by default in branch manager view.
        </div>
      </div>

      <!-- Right Box -->
      <div class="lg:col-span-4 flex flex-col">
        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
          <h3 class="text-sm font-bold text-gray-900 mb-5">Branch Context</h3>
          
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Status</span>
              <span class="text-sm font-bold text-gray-900 mt-1">{{ currentUnit.status }}</span>
            </div>
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Branch</span>
              <span class="text-sm font-bold text-gray-900 mt-1">{{ currentUnit.branch || user?.branchName || 'Peshawar' }}</span>
            </div>
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Location</span>
              <span class="text-sm font-bold text-gray-900 mt-1">{{ currentUnit.location || 'Showroom' }}</span>
            </div>
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Timeline Events</span>
              <span class="text-sm font-bold text-gray-900 mt-1">{{ (currentUnit.timeline?.length || 1) }}</span>
            </div>
          </div>
        </div>
        
        <p class="text-[11px] text-gray-400 font-medium mt-3 px-1">
          Direct manual transition to 'Sold' is disabled. Sale state is reserved for customer delivery in Phase 3.
        </p>
      </div>
    </div>
  </div>

  <!-- SUPER ADMIN VIEW -->
  <div v-else class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Inventory / Serialized Units / <span class="font-bold text-gray-800">Unit Detail — {{ activeTab }}</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Unit Detail — {{ activeTab }}</h1>
        <p class="text-sm text-gray-500 mt-1">{{ currentUnit.serial }} - {{ activeTab }}</p>
      </div>
      <button 
        @click="router.push('/inventory/serialized-units')"
        class="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
      >
        <ArrowLeft class="w-3.5 h-3.5" /> Back
      </button>
    </div>

    <!-- Overview Card -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <h2 class="text-[22px] font-bold text-gray-900">{{ currentUnit.serial }}</h2>
        <p class="text-[11px] text-gray-500 mt-1 font-medium">{{ currentUnit.product }} &middot; Chassis {{ currentUnit.chassis }} &middot; {{ currentUnit.branch }}</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <span class="inline-flex items-center px-2 py-1 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">
          {{ currentUnit.status }}
        </span>
        <!-- Dynamic Status Transition Buttons -->
        <button 
          v-for="target in availableTransitions" 
          :key="target"
          @click="openStatusChange(target)"
          class="px-3 py-1.5 text-[11px] font-bold rounded-lg border transition-colors shadow-sm cursor-pointer"
          :class="target === 'Available' ? 'bg-[#165A31] text-white border-[#165A31]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'"
        >
          Move to {{ target }}
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex items-center gap-6 border-b border-gray-100 overflow-x-auto pb-[1px]">
      <button 
        v-for="tab in tabs" 
        :key="tab"
        @click="activeTab = tab"
        class="pb-3 text-[11px] font-bold tracking-wider relative transition-colors whitespace-nowrap"
        :class="activeTab === tab ? 'text-[#165A31]' : 'text-gray-400 hover:text-gray-600'"
      >
        {{ tab }}
        <div v-if="activeTab === tab" class="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#165A31] rounded-t-full"></div>
      </button>
    </div>

    <!-- Tab Content -->
    <div class="space-y-6">
      <!-- Tab Content: Overview -->
      <template v-if="activeTab === 'Overview'">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">Status</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">{{ currentUnit.status }}</div>
          </div>
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">Landed Cost</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">PKR {{ currentUnit.landedCost || '163.4K' }}</div>
          </div>
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">Branch</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">{{ currentUnit.branch || 'Peshawar' }}</div>
          </div>
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">Location Bay</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">{{ currentUnit.location || 'Main Store' }}</div>
          </div>
        </div>

        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
          <h3 class="text-[14px] font-bold text-gray-900 mb-6">Unit Summary</h3>
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">Serial</span>
              <span class="font-bold text-gray-900">{{ currentUnit.serial }}</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">Chassis</span>
              <span class="font-bold text-gray-900">{{ currentUnit.chassis }}</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">VIN</span>
              <span class="font-bold text-gray-900">{{ currentUnit.vin || currentUnit.chassis }}</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">Product</span>
              <span class="font-bold text-gray-900">{{ currentUnit.product }}</span>
            </div>
          </div>
        </div>
      </template>

      <!-- Tab Content: Identification -->
      <div v-else-if="activeTab === 'Identification'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">Identification</h3>
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Serial</span>
            <span class="font-bold text-gray-900">{{ currentUnit.serial }}</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Chassis</span>
            <span class="font-bold text-gray-900">{{ currentUnit.chassis }}</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">VIN</span>
            <span class="font-bold text-gray-900">{{ currentUnit.vin || currentUnit.chassis }}</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Motor Serial</span>
            <span class="font-bold text-gray-900">{{ currentUnit.motorSerial || 'MTR-44102' }}</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Battery Serial</span>
            <span class="font-bold text-gray-900">{{ currentUnit.batterySerial || 'BAT-88210' }}</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Color / Variant</span>
            <span class="font-bold text-gray-900">{{ currentUnit.color || 'Onyx Black' }}</span>
          </div>
        </div>
      </div>

      <!-- Tab Content: Cost -->
      <div v-else-if="activeTab === 'Cost'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">Cost Breakdown</h3>
        </div>
        <div class="overflow-x-auto p-6 pt-0">
          <table class="w-full text-left border-collapse mt-4">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                <th class="px-5 py-3 rounded-tl-lg">Component</th>
                <th class="px-5 py-3 rounded-tr-lg">Amount</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="(cost, i) in costs" :key="i" class="border-b border-gray-50 last:border-0">
                <td class="px-5 py-4 font-semibold text-gray-900">{{ cost.component }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ cost.amount }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab Content: Location -->
      <div v-else-if="activeTab === 'Location'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">Current Location</h3>
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Branch</span>
            <span class="font-bold text-gray-900">{{ currentUnit.branch }}</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Location Bay</span>
            <span class="font-bold text-gray-900">{{ currentUnit.location }}</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Current Status</span>
            <span class="font-bold text-gray-900">{{ currentUnit.status }}</span>
          </div>
        </div>
      </div>

      <!-- Tab Content: Purchase Source -->
      <div v-else-if="activeTab === 'Purchase Source'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">Source & Origin</h3>
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Inwarding / PO</span>
            <span class="font-bold text-gray-900">{{ currentUnit.sourcePo || 'PO-2026-001' }}</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Source Type</span>
            <span class="font-bold text-gray-900">{{ currentUnit.source || 'Purchase Order Inwarding' }}</span>
          </div>
        </div>
      </div>

      <!-- Tab Content: Timeline -->
      <div v-else-if="activeTab === 'Timeline'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">Unit Timeline</h3>
        <div class="space-y-4">
          <div v-for="(item, i) in currentUnit.timeline" :key="i" class="flex items-start gap-3">
            <div class="mt-1 w-1.5 h-3.5 rounded-full bg-[#165A31]"></div>
            <div class="flex-1 flex justify-between">
              <div>
                <span class="text-[11px] font-bold text-gray-900">{{ item.status || item.event }}</span>
                <span class="text-[10px] text-gray-500 block">{{ item.note || '' }} &middot; {{ item.user }}</span>
              </div>
              <span class="text-[11px] font-medium text-gray-500">{{ item.timestamp || item.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- STATUS CHANGE MODAL -->
  <div v-if="showStatusModal" class="fixed inset-0 bg-gray-900/50 z-[120] flex items-center justify-center p-4 backdrop-blur-sm" @click.self="showStatusModal = false">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
      <div class="flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 class="text-sm font-bold text-gray-900">Change Unit Status</h3>
        <button @click="showStatusModal = false" class="text-gray-400 hover:text-gray-600">
          <X class="w-4 h-4" />
        </button>
      </div>

      <div class="space-y-3">
        <div class="text-xs text-gray-600">
          Transitioning <span class="font-bold text-gray-900">{{ currentUnit?.serial }}</span> from <span class="font-bold">{{ currentUnit?.status }}</span> to <span class="font-bold text-[#165A31]">{{ targetStatus }}</span>.
        </div>

        <div>
          <label class="block text-[11px] font-semibold text-gray-700 mb-1">Reason / Note *</label>
          <input 
            v-model="statusReason" 
            type="text" 
            placeholder="e.g. Minor paint touchup needed, QC verification passed..."
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#165A31]"
          />
        </div>
      </div>

      <div class="flex justify-end gap-2 pt-2">
        <button @click="showStatusModal = false" class="px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
          Cancel
        </button>
        <button @click="confirmStatusChange" class="px-4 py-1.5 text-xs font-bold text-white bg-[#165A31] hover:bg-[#124a28] rounded-lg cursor-pointer">
          Confirm Transition
        </button>
      </div>
    </div>
  </div>
</template>
