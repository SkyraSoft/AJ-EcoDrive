<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { store } from '@/store'
import { 
  ChevronDown, ArrowLeft, CheckCircle2, AlertCircle, Clock, User, 
  ShieldCheck, Wrench, FileText, MessageSquare, DollarSign, Cpu, 
  Calendar, Phone, Mail, MapPin, Check, Plus, Paperclip, Download
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const activeTab = ref('Summary')
const tabs = [
  'Summary',
  'Customer',
  'Unit',
  'Warranty',
  'Diagnosis',
  'Resolution',
  'Cost',
  'Communication',
  'Documents',
  'Timeline'
]

const caseData = computed(() => {
  const paramId = route.params.id || route.query.id
  if (paramId) {
    const found = store.getCaseById(paramId) || store.cases.find(c => c.caseId === paramId || c.id === paramId)
    if (found) return found
    return null
  }
  if (store.selectedCase) return store.selectedCase
  return null
})

const linkedRepairs = computed(() => {
  if (!caseData.value) return []
  const cid = caseData.value.id || caseData.value.caseId
  return store.getRepairsByCaseId(cid)
})

const caseAuditLogs = computed(() => {
  if (!caseData.value) return []
  const cid = caseData.value.id || caseData.value.caseId
  return store.getAuditLogsForEntity('service_case', cid)
})

const createRepairFromCase = () => {
  store.selectedCase = caseData.value
  router.push('/after-sales/repairs/create')
}

// Super Admin Variables
const showActionsDropdown = ref(false)
const showMoreDropdown = ref(false)
const showStatusModal = ref(false)
const statusNote = ref('')
const selectedNewStatus = ref(caseData.value?.status || 'Diagnosis')

const updateStatus = (newStatus) => {
  if (caseData.value) {
    caseData.value.status = newStatus
  }
  showActionsDropdown.value = false
  showStatusModal.value = false
}

const getStatusBadgeClass = (status) => {
  if (status === 'Diagnosis') return 'bg-[#fef9c3] text-[#a16207]'
  if (status === 'In Progress') return 'bg-blue-50 text-blue-600'
  if (status === 'Parts Waiting' || status === 'Awaiting Parts') return 'bg-[#fff7ed] text-[#ea580c]'
  if (status === 'Ready' || status === 'Resolved') return 'bg-[#eefcf2] text-[#165A31]'
  return 'bg-gray-100 text-gray-600'
}

const diagnosticChecklist = ref([
  { task: 'Connect BRG CAN Diagnostics tool to OBD Port', done: true },
  { task: 'Perform full BMS & controller error code scan', done: true },
  { task: 'Perform 20A controlled discharge load test', done: true },
  { task: 'Check MOSFET & thermal sensor wiring integrity', done: false },
  { task: 'Verify throttle hall sensor voltage curve', done: false }
])

const commLogs = ref([
  { sender: 'System SMS', time: 'Aug 25, 10:15 AM', text: 'Dear customer, case registered at Peshawar Branch.' },
  { sender: 'Usman (Tech)', time: 'Aug 25, 02:30 PM', text: 'Vehicle received in bay 1. Initial diagnostic scan initiated.' },
  { sender: 'WhatsApp Bot', time: 'Today, 10:05 AM', text: 'Status update sent to customer: Diagnosis underway.' }
])
</script>

<template>
  <!-- NOT FOUND STATE -->
  <div v-if="!caseData" class="max-w-[800px] mx-auto py-16 px-4 text-center">
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-4">
      <div class="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
        <ShieldCheck class="w-6 h-6" />
      </div>
      <h2 class="text-xl font-bold text-gray-900">Service Case Not Found</h2>
      <p class="text-xs text-gray-500 max-w-md mx-auto">
        The requested service case could not be located. It may have been resolved, deleted or the link is invalid.
      </p>
      <div class="pt-2">
        <router-link to="/after-sales/warranty" class="inline-flex items-center gap-2 px-4 py-2 bg-[#165A31] text-white text-xs font-bold rounded-lg hover:bg-[#124a28] transition-colors">
          <ArrowLeft class="w-4 h-4" /> Back to Warranty & Cases
        </router-link>
      </div>
    </div>
  </div>

  <!-- BRANCH MANAGER VIEW -->
  <div v-else-if="isBranchUser" class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[11px] text-gray-400 mb-1">
          Branch Manager / Warranty & Service / <span class="font-medium text-gray-600">Service Case {{ caseData.caseId }}</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Service Case {{ caseData.caseId }}</h1>
        <p class="text-xs text-gray-500 mt-1">Warranty/service case detail — {{ activeTab }}.</p>
      </div>

      <!-- Action Button -->
      <div class="flex items-center gap-2">
        <button 
          @click="createRepairFromCase"
          class="bg-[#165A31] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <Wrench class="w-3.5 h-3.5" />
          <span>+ Create Repair Job</span>
        </button>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="border-b border-gray-100 flex items-center gap-6 overflow-x-auto no-scrollbar">
      <button 
        v-for="tab in tabs" 
        :key="tab"
        @click="activeTab = tab"
        :class="[
          'text-xs whitespace-nowrap pb-3 transition-colors cursor-pointer',
          activeTab === tab 
            ? 'text-[#165A31] font-bold border-b-2 border-[#165A31]' 
            : 'text-gray-500 hover:text-gray-800 font-medium'
        ]"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Tab 1: Summary (Matching Screenshot 4) -->
    <div v-if="activeTab === 'Summary'" class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <!-- Left Card: Summary -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
        <h3 class="text-sm font-bold text-gray-900 mb-4">Summary</h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <!-- Box 1: Status -->
          <div class="bg-[#fbfbfc] border border-gray-100 rounded-lg p-3.5 space-y-1">
            <span class="text-[10px] text-gray-400 font-medium block">Status</span>
            <span class="text-xs font-bold text-gray-900 block">{{ caseData.status }}</span>
          </div>

          <!-- Box 2: Customer -->
          <div class="bg-[#fbfbfc] border border-gray-100 rounded-lg p-3.5 space-y-1">
            <span class="text-[10px] text-gray-400 font-medium block">Customer</span>
            <span class="text-xs font-bold text-gray-900 block">{{ caseData.customer }}</span>
          </div>

          <!-- Box 3: Unit -->
          <div class="bg-[#fbfbfc] border border-gray-100 rounded-lg p-3.5 space-y-1">
            <span class="text-[10px] text-gray-400 font-medium block">Unit</span>
            <span class="text-xs font-bold text-gray-900 block">{{ caseData.unit }}</span>
          </div>

          <!-- Box 4: Warranty -->
          <div class="bg-[#fbfbfc] border border-gray-100 rounded-lg p-3.5 space-y-1">
            <span class="text-[10px] text-gray-400 font-medium block">Warranty</span>
            <span class="text-xs font-bold text-gray-900 block">{{ caseData.warranty }}</span>
          </div>

          <!-- Box 5: Priority -->
          <div class="bg-[#fbfbfc] border border-gray-100 rounded-lg p-3.5 space-y-1">
            <span class="text-[10px] text-gray-400 font-medium block">Priority</span>
            <span class="text-xs font-bold text-gray-900 block">{{ caseData.priority }}</span>
          </div>

          <!-- Box 6: Issue -->
          <div class="bg-[#fbfbfc] border border-gray-100 rounded-lg p-3.5 space-y-1">
            <span class="text-[10px] text-gray-400 font-medium block">Issue</span>
            <span class="text-xs font-bold text-gray-900 block">{{ caseData.issue }}</span>
          </div>
        </div>
      </div>

      <!-- Right Card: Related Information -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
        <h3 class="text-sm font-bold text-gray-900 mb-4">Related Information</h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <!-- Box 1: Technician -->
          <div class="bg-[#fbfbfc] border border-gray-100 rounded-lg p-3.5 space-y-1">
            <span class="text-[10px] text-gray-400 font-medium block">Technician</span>
            <span class="text-xs font-bold text-gray-900 block">{{ caseData.technician }}</span>
          </div>

          <!-- Box 2: Promised Date -->
          <div class="bg-[#fbfbfc] border border-gray-100 rounded-lg p-3.5 space-y-1">
            <span class="text-[10px] text-gray-400 font-medium block">Promised Date</span>
            <span class="text-xs font-bold text-gray-900 block">{{ caseData.promisedDate }}</span>
          </div>

          <!-- Box 3: Cost -->
          <div class="bg-[#fbfbfc] border border-gray-100 rounded-lg p-3.5 space-y-1">
            <span class="text-[10px] text-gray-400 font-medium block">Cost</span>
            <span class="text-xs font-bold text-gray-900 block">{{ caseData.cost }}</span>
          </div>

          <!-- Box 4: Last Update -->
          <div class="bg-[#fbfbfc] border border-gray-100 rounded-lg p-3.5 space-y-1">
            <span class="text-[10px] text-gray-400 font-medium block">Last Update</span>
            <span class="text-xs font-bold text-gray-900 block">{{ caseData.lastUpdate }}</span>
          </div>
        </div>

        <p class="text-[11px] text-gray-400 mt-5 leading-relaxed">
          This view is scoped only to Peshawar Branch. Actions that require company-wide approval remain with management.
        </p>

        <!-- Linked Repair Jobs -->
        <div v-if="linkedRepairs.length > 0" class="mt-4 pt-4 border-t border-gray-100">
          <span class="text-[11px] font-bold text-gray-700 block mb-2">Linked Repair Jobs</span>
          <div class="space-y-2">
            <div 
              v-for="rep in linkedRepairs" 
              :key="rep.id || rep.repairId"
              class="flex items-center justify-between p-2.5 bg-emerald-50/50 border border-emerald-100 rounded-lg text-xs"
            >
              <div class="flex items-center gap-2">
                <Wrench class="w-3.5 h-3.5 text-[#165A31]" />
                <span class="font-bold text-gray-900">{{ rep.id || rep.repairId }}</span>
                <span class="text-[10px] text-gray-500">• {{ rep.status }}</span>
              </div>
              <router-link 
                :to="`/after-sales/repairs/${rep.id || rep.repairId}`"
                class="text-[11px] font-bold text-[#165A31] hover:underline"
              >
                View Repair →
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 2: Customer -->
    <div v-else-if="activeTab === 'Customer'" class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
        <h3 class="text-sm font-bold text-gray-900 mb-2">Customer Details</h3>
        <div class="space-y-3 text-xs">
          <div class="flex justify-between py-2 border-b border-gray-50">
            <span class="text-gray-400">Customer Name</span>
            <span class="font-semibold text-gray-900">{{ caseData.customer }}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-gray-50">
            <span class="text-gray-400">Phone Number</span>
            <span class="font-semibold text-gray-900">{{ caseData.phone }}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-gray-50">
            <span class="text-gray-400">Email Address</span>
            <span class="font-semibold text-gray-900">{{ caseData.email }}</span>
          </div>
          <div class="flex justify-between py-2">
            <span class="text-gray-400">Registered Address</span>
            <span class="font-semibold text-gray-900">{{ caseData.address }}</span>
          </div>
        </div>
      </div>
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
        <h3 class="text-sm font-bold text-gray-900 mb-2">Service History</h3>
        <p class="text-xs text-gray-500">Customer has had 1 prior routine maintenance service at Peshawar Branch.</p>
      </div>
    </div>

    <!-- Tab 3: Unit -->
    <div v-else-if="activeTab === 'Unit'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
      <h3 class="text-sm font-bold text-gray-900 mb-2">Vehicle Specification</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div class="p-4 bg-[#fbfbfc] border border-gray-100 rounded-lg">
          <span class="text-gray-400 block text-[10px]">Chassis / Unit Serial</span>
          <span class="text-sm font-bold text-gray-900 block mt-1">{{ caseData.unitSerial }}</span>
        </div>
        <div class="p-4 bg-[#fbfbfc] border border-gray-100 rounded-lg">
          <span class="text-gray-400 block text-[10px]">Model & Variant</span>
          <span class="text-sm font-bold text-[#165A31] block mt-1">BRG X7 Electric</span>
        </div>
        <div class="p-4 bg-[#fbfbfc] border border-gray-100 rounded-lg">
          <span class="text-gray-400 block text-[10px]">Odometer Reading</span>
          <span class="text-sm font-bold text-gray-900 block mt-1">4,200 km</span>
        </div>
      </div>
    </div>

    <!-- Tab 4: Warranty -->
    <div v-else-if="activeTab === 'Warranty'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
      <h3 class="text-sm font-bold text-gray-900 mb-2">Warranty Verification</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="p-4 bg-emerald-50/60 border border-emerald-200/60 rounded-lg">
          <span class="font-bold text-[#165A31] block text-sm">Active OEM Coverage</span>
          <span class="text-emerald-800 block mt-1">Valid through {{ caseData.warrantyExpiry }}</span>
          <span class="text-[10px] text-emerald-700 block mt-1">Covers Controller, Motor & BMS electronics.</span>
        </div>
        <div class="p-4 bg-gray-50 border border-gray-100 rounded-lg">
          <span class="font-bold text-gray-900 block text-sm">Policy Terms</span>
          <span class="text-gray-600 block mt-1">Zero deductible on certified warranty repair.</span>
        </div>
      </div>
    </div>

    <!-- Tab 5: Diagnosis -->
    <div v-else-if="activeTab === 'Diagnosis'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
      <h3 class="text-sm font-bold text-gray-900 mb-2">Diagnostic Scan & Checklist</h3>
      <div class="space-y-2">
        <div v-for="(item, idx) in diagnosticChecklist" :key="idx" class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-xs">
          <div :class="['w-4 h-4 rounded flex items-center justify-center', item.done ? 'bg-[#165A31] text-white' : 'border border-gray-300']">
            <Check v-if="item.done" class="w-3 h-3" />
          </div>
          <span :class="item.done ? 'text-gray-900 font-medium' : 'text-gray-500'">{{ item.task }}</span>
        </div>
      </div>
    </div>

    <!-- Tab 6: Resolution -->
    <div v-else-if="activeTab === 'Resolution'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
      <h3 class="text-sm font-bold text-gray-900 mb-2">Action Plan & Resolution</h3>
      <p class="text-xs text-gray-700 leading-relaxed">
        Recommended replacement of the 72V 3000W electronic speed controller module. Part SKU <strong>CTL-72V-BRG</strong> requested from central hub.
      </p>
    </div>

    <!-- Tab 7: Cost -->
    <div v-else-if="activeTab === 'Cost'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
      <h3 class="text-sm font-bold text-gray-900 mb-2">Service Cost Estimation</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div class="p-4 bg-gray-50 rounded-lg">
          <span class="text-gray-400 block text-[10px]">Estimated Parts Cost</span>
          <span class="text-sm font-bold text-gray-900 block mt-1">PKR 14,000</span>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg">
          <span class="text-gray-400 block text-[10px]">Labour Charge</span>
          <span class="text-sm font-bold text-gray-900 block mt-1">PKR 2,500</span>
        </div>
        <div class="p-4 bg-emerald-50 rounded-lg">
          <span class="text-emerald-700 block text-[10px]">Customer Payable</span>
          <span class="text-base font-bold text-[#165A31] block mt-1">PKR 0 (Warranty)</span>
        </div>
      </div>
    </div>

    <!-- Tab 8: Communication -->
    <div v-else-if="activeTab === 'Communication'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
      <h3 class="text-sm font-bold text-gray-900 mb-2">Customer Communication</h3>
      <div class="space-y-3">
        <div v-for="(log, idx) in commLogs" :key="idx" class="p-3 bg-gray-50 rounded-lg text-xs space-y-1">
          <div class="flex justify-between text-gray-400 text-[10px]">
            <span class="font-bold text-gray-700">{{ log.sender }}</span>
            <span>{{ log.time }}</span>
          </div>
          <p class="text-gray-700">{{ log.text }}</p>
        </div>
      </div>
    </div>

    <!-- Tab 9: Documents -->
    <div v-else-if="activeTab === 'Documents'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
      <h3 class="text-sm font-bold text-gray-900 mb-2">Case Evidence & Attachments</h3>
      <div class="space-y-2 text-xs">
        <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span class="font-medium text-gray-800">odometer_cluster.jpg</span>
          <span class="text-gray-400">1.2 MB</span>
        </div>
        <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span class="font-medium text-gray-800">controller_wiring.jpg</span>
          <span class="text-gray-400">2.4 MB</span>
        </div>
      </div>
    </div>

    <!-- Tab 10: Timeline -->
    <div v-else-if="activeTab === 'Timeline'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-sm font-bold text-gray-900">Activity Timeline</h3>
        <span class="text-[11px] text-gray-400 font-medium">{{ caseAuditLogs.length }} events recorded</span>
      </div>
      <div class="space-y-3 text-xs">
        <div 
          v-for="(log, idx) in (caseAuditLogs.length > 0 ? caseAuditLogs : [
            { id: '1', action: 'Intake Inspection', description: 'Intake Inspection Completed', user: 'Usman', branch: 'Peshawar Service Bay 1', timestamp: 'Today 10:05' }
          ])"
          :key="log.id || idx"
          class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
        >
          <div class="w-2 h-2 rounded-full bg-[#165A31]"></div>
          <div class="flex-1">
            <span class="font-semibold text-gray-800">{{ log.action || log.operation }}: {{ log.description || log.result }}</span>
            <span class="text-gray-400 block text-[10px]">By {{ log.user || log.actor_name || 'Technician' }} · {{ log.branch || 'Service Bay' }}</span>
          </div>
          <span class="text-[10px] text-gray-400 whitespace-nowrap">{{ log.timestamp }}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- SUPER ADMIN VIEW -->
  <div v-else class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">
          Super Admin / After-sales / Warranty & Service / <span class="font-bold text-gray-800">{{ caseData.caseId }}</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Warranty Case Detail</h1>
        <p class="text-sm text-gray-500 mt-1">Manage claim investigation, technician dispatch, warranty coverage and customer handover.</p>
      </div>

      <button 
        @click="createRepairFromCase"
        class="bg-[#165A31] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
      >
        <Wrench class="w-3.5 h-3.5" />
        <span>+ Create Repair Job</span>
      </button>
    </div>

    <!-- Status Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 rounded-xl">
      <div>
        <h2 class="text-xl font-bold text-gray-900">{{ caseData.caseId }}</h2>
        <p class="text-[12px] text-gray-500 mt-1">{{ caseData.customer }} · {{ caseData.unit }}</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="inline-flex items-center px-2 py-1 rounded-[4px] text-[10px] font-bold" :class="getStatusBadgeClass(caseData.status)">
          {{ caseData.status }}
        </span>
      </div>
    </div>
  </div>
</template>
