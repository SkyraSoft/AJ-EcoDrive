<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../../store.js'
import { 
  ChevronDown, ArrowLeft, CheckCircle2, AlertCircle, Clock, User, 
  ShieldCheck, Wrench, FileText, MessageSquare, DollarSign, Cpu, 
  Calendar, Phone, Mail, MapPin, Check, Plus, Paperclip, Download
} from 'lucide-vue-next'

const router = useRouter()

// Get case from store or fallback to first case
const caseData = computed(() => {
  return store.selectedCase || store.cases[0] || {
    caseId: 'WAR-442',
    branch: 'Peshawar',
    customer: 'Faisal Khan',
    customerPhone: '+92 300 1234567',
    customerEmail: 'faisal.khan@example.com',
    customerAddress: 'House 42, Street 8, Hayatabad Phase 3, Peshawar',
    unit: 'EV5-00322 - BRG EV-5',
    unitSerial: 'EV5-00322',
    unitModel: 'BRG EV-5 (2025 Long Range Edition)',
    vin: 'BRG-EV5-2025-00322',
    motorNo: 'MOT-72V-3000W-8821',
    batterySerial: 'BAT-72V-50AH-9982-EV',
    odometer: '4,820 km',
    purchaseDate: 'Jan 12, 2025',
    warrantyStart: 'Jan 12, 2025',
    warrantyEnd: 'Jan 12, 2028',
    type: 'Warranty',
    opened: 'Aug 25',
    warranty: 'Active',
    status: 'Diagnosis',
    age: '2 days',
    priority: 'High',
    eligibility: 'Active (Under Warranty)',
    batteryCoverage: 'Standard 3-Year Battery Warranty',
    issue: 'Battery range reduced',
    notes: 'Range dropped after recent charge cycles. Vehicle struggles beyond 35 km on single charge compared to normal 85 km range.',
    owner: 'Peshawar Service Team',
    assignedTech: 'Hamza Farooq (Senior EV Specialist)',
    diagnosisSummary: 'Cell group 4 voltage delta exceeds 120mV under 20A discharge load. Recommended replacement of BMS sensor harness and cell balancing cycle.',
    estimatedCompletion: 'Aug 28, 2026',
    totalCost: 'PKR 18,500',
    coveredByWarranty: '100% (PKR 18,500 covered by BRG OEM)',
    customerPayable: 'PKR 0'
  }
})

const activeTab = ref('Summary')
const tabs = [
  'Summary', 
  'Customer', 
  'Unit & Warranty', 
  'Diagnosis', 
  'Resolution', 
  'Costs', 
  'Communication', 
  'Documents', 
  'Timeline'
]

const showActionsDropdown = ref(false)
const showMoreDropdown = ref(false)
const showStatusModal = ref(false)
const statusNote = ref('')
const selectedNewStatus = ref(caseData.value.status)

const updateStatus = (newStatus) => {
  caseData.value.status = newStatus
  showActionsDropdown.value = false
  showStatusModal.value = false
}

const getStatusBadgeClass = (status) => {
  if (status === 'Diagnosis') return 'bg-[#fef9c3] text-[#a16207]'
  if (status === 'In Progress') return 'bg-blue-50 text-blue-600'
  if (status === 'Parts Waiting') return 'bg-[#fff7ed] text-[#ea580c]'
  if (status === 'Ready' || status === 'Resolved') return 'bg-[#eefcf2] text-[#165A31]'
  return 'bg-gray-100 text-gray-600'
}

// Checklist for Diagnosis
const diagnosticChecklist = ref([
  { task: 'Connect BRG CAN Diagnostics tool to OBD Port', done: true },
  { task: 'Perform full BMS telemetry scan & read error fault codes', done: true },
  { task: 'Perform 20A controlled discharge load test on battery module', done: true },
  { task: 'Check cell temperature sensors & wiring harness integrity', done: false },
  { task: 'Measure cell delta voltage variance (<50mV acceptable)', done: false }
])

// Communication logs
const commLogs = ref([
  { sender: 'System SMS', time: 'Aug 25, 10:15 AM', text: 'Dear Faisal Khan, case WAR-442 for unit EV5-00322 has been registered at Peshawar Branch.' },
  { sender: 'Hamza Farooq (Tech)', time: 'Aug 25, 02:30 PM', text: 'Vehicle received in bay 2. Initial diagnostic scan initiated.' },
  { sender: 'WhatsApp Bot', time: 'Aug 25, 04:00 PM', text: 'Status update sent to customer: Diagnosis underway.' }
])

const newNoteText = ref('')
const addCommunicationNote = () => {
  if (!newNoteText.value.trim()) return
  commLogs.value.unshift({
    sender: 'Super Admin',
    time: 'Just now',
    text: newNoteText.value
  })
  newNoteText.value = ''
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1 flex items-center gap-1">
          <router-link to="/after-sales/warranty" class="hover:text-gray-800">Super Admin</router-link> /
          <router-link to="/after-sales/dashboard" class="hover:text-gray-800">After-sales</router-link> /
          <router-link to="/after-sales/warranty" class="hover:text-gray-800">Warranty & Service</router-link> /
          <span class="font-bold text-gray-800">Case Detail — {{ activeTab }}</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">
          Case Detail — {{ activeTab }}
        </h1>
        <p class="text-sm text-gray-500 mt-1">{{ caseData.caseId }} - {{ activeTab }}</p>
      </div>

      <button 
        @click="router.push('/after-sales/warranty')"
        class="flex items-center gap-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 px-3.5 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
      >
        <ArrowLeft class="w-3.5 h-3.5" /> Back to Cases
      </button>
    </div>

    <!-- Case Header / Main Card -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">{{ caseData.caseId }}</h2>
          <p class="text-[12px] text-gray-500 mt-0.5 font-medium">
            {{ caseData.customer }} · {{ caseData.unitSerial || caseData.unit }} · {{ caseData.branch }}
          </p>
        </div>

        <div class="flex items-center gap-3">
          <!-- Status Badge -->
          <span 
            class="inline-flex items-center px-2.5 py-1 rounded-[4px] text-[10px] font-bold"
            :class="getStatusBadgeClass(caseData.status)"
          >
            {{ caseData.status }}
          </span>

          <!-- Case Actions Dropdown -->
          <div class="relative">
            <button 
              @click="showActionsDropdown = !showActionsDropdown"
              class="px-4 py-2 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center gap-1.5 cursor-pointer"
            >
              Case Actions <ChevronDown class="w-3.5 h-3.5" />
            </button>

            <div 
              v-if="showActionsDropdown" 
              class="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-30 text-xs text-gray-700 animate-in fade-in zoom-in-95 duration-150"
            >
              <div class="px-3 py-1 text-[10px] font-bold uppercase text-gray-400">Change Status</div>
              <button @click="updateStatus('Diagnosis')" class="w-full text-left px-4 py-1.5 hover:bg-gray-50 text-gray-700 flex items-center justify-between">
                <span>Diagnosis</span>
                <Check v-if="caseData.status === 'Diagnosis'" class="w-3.5 h-3.5 text-[#165A31]" />
              </button>
              <button @click="updateStatus('In Progress')" class="w-full text-left px-4 py-1.5 hover:bg-gray-50 text-gray-700 flex items-center justify-between">
                <span>In Progress</span>
                <Check v-if="caseData.status === 'In Progress'" class="w-3.5 h-3.5 text-[#165A31]" />
              </button>
              <button @click="updateStatus('Parts Waiting')" class="w-full text-left px-4 py-1.5 hover:bg-gray-50 text-gray-700 flex items-center justify-between">
                <span>Parts Waiting</span>
                <Check v-if="caseData.status === 'Parts Waiting'" class="w-3.5 h-3.5 text-[#165A31]" />
              </button>
              <button @click="updateStatus('Ready')" class="w-full text-left px-4 py-1.5 hover:bg-gray-50 text-gray-700 flex items-center justify-between">
                <span>Ready for Customer</span>
                <Check v-if="caseData.status === 'Ready'" class="w-3.5 h-3.5 text-[#165A31]" />
              </button>
              <div class="border-t border-gray-100 my-1"></div>
              <button @click="showActionsDropdown = false; activeTab = 'Communication'" class="w-full text-left px-4 py-1.5 hover:bg-gray-50 text-gray-700">
                Send SMS Update
              </button>
              <button @click="showActionsDropdown = false; activeTab = 'Resolution'" class="w-full text-left px-4 py-1.5 hover:bg-gray-50 text-gray-700">
                Generate Work Order
              </button>
            </div>
          </div>

          <!-- More Dropdown -->
          <div class="relative">
            <button 
              @click="showMoreDropdown = !showMoreDropdown"
              class="px-3 py-2 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center gap-1 cursor-pointer"
            >
              More <ChevronDown class="w-3.5 h-3.5" />
            </button>
            <div 
              v-if="showMoreDropdown" 
              class="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-30 text-xs text-gray-700 animate-in fade-in zoom-in-95 duration-150"
            >
              <button @click="showMoreDropdown = false" class="w-full text-left px-4 py-1.5 hover:bg-gray-50 text-gray-700">Print Case Sheet</button>
              <button @click="showMoreDropdown = false" class="w-full text-left px-4 py-1.5 hover:bg-gray-50 text-gray-700">Export PDF Report</button>
              <button @click="showMoreDropdown = false" class="w-full text-left px-4 py-1.5 hover:bg-gray-50 text-red-600">Close / Archive Case</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Horizontal Tabs Navigation -->
      <div class="flex flex-wrap items-center gap-6 border-b border-gray-100 -mb-2">
        <button 
          v-for="tab in tabs" 
          :key="tab"
          @click="activeTab = tab"
          class="pb-3 text-[12px] font-bold transition-colors relative cursor-pointer"
          :class="activeTab === tab ? 'text-[#165A31]' : 'text-gray-400 hover:text-gray-600'"
        >
          {{ tab }}
          <div v-if="activeTab === tab" class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#165A31] rounded-t-full"></div>
        </button>
      </div>
    </div>

    <!-- TAB CONTENTS -->
    
    <!-- 1. SUMMARY TAB (Exact Match with Screenshot 4) -->
    <div v-if="activeTab === 'Summary'" class="space-y-6 animate-in fade-in duration-150">
      <!-- 4 KPI Stat Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
          <div class="text-[11px] font-medium text-gray-400 mb-1.5">Age</div>
          <div class="text-[24px] font-bold text-gray-900 leading-none">{{ caseData.age || '2 days' }}</div>
        </div>
        <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
          <div class="text-[11px] font-medium text-gray-400 mb-1.5">Priority</div>
          <div class="text-[24px] font-bold text-gray-900 leading-none">{{ caseData.priority || 'High' }}</div>
        </div>
        <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
          <div class="text-[11px] font-medium text-gray-400 mb-1.5">Warranty</div>
          <div class="text-[24px] font-bold text-gray-900 leading-none">{{ caseData.warranty || 'Active' }}</div>
        </div>
        <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
          <div class="text-[11px] font-medium text-gray-400 mb-1.5">Status</div>
          <div class="text-[24px] font-bold text-gray-900 leading-none">{{ caseData.status || 'Diagnosis' }}</div>
        </div>
      </div>

      <!-- Case Summary Card -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-5">
        <h3 class="text-[14px] font-bold text-gray-900">Case Summary</h3>

        <div class="space-y-3.5 text-xs">
          <div class="flex items-center justify-between py-2 border-b border-gray-50">
            <span class="text-gray-500 font-medium">Issue</span>
            <span class="font-bold text-gray-900">{{ caseData.issue }}</span>
          </div>
          <div class="flex items-center justify-between py-2 border-b border-gray-50">
            <span class="text-gray-500 font-medium">Opened</span>
            <span class="font-bold text-gray-900">{{ caseData.opened }}</span>
          </div>
          <div class="flex items-center justify-between py-2 border-b border-gray-50">
            <span class="text-gray-500 font-medium">Owner</span>
            <span class="font-bold text-gray-900">{{ caseData.owner }}</span>
          </div>
          <div class="flex items-center justify-between py-2 border-b border-gray-50">
            <span class="text-gray-500 font-medium">Assigned Technician</span>
            <span class="font-semibold text-gray-800">{{ caseData.assignedTech || 'Hamza Farooq' }}</span>
          </div>
        </div>

        <div class="pt-2">
          <div class="text-[11px] font-bold text-gray-700 mb-1.5">Customer Notes & Problem Description</div>
          <div class="bg-gray-50 p-3.5 rounded-lg border border-gray-100 text-xs text-gray-700 leading-relaxed">
            {{ caseData.notes || 'Range dropped after recent charge cycles. Vehicle struggles beyond 35 km on single charge.' }}
          </div>
        </div>
      </div>
    </div>

    <!-- 2. CUSTOMER TAB -->
    <div v-if="activeTab === 'Customer'" class="space-y-6 animate-in fade-in duration-150">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
          <h3 class="text-[14px] font-bold text-gray-900">Customer Profile</h3>
          <div class="space-y-3 text-xs">
            <div class="flex items-center gap-3">
              <User class="w-4 h-4 text-gray-400" />
              <div>
                <p class="text-[10px] text-gray-400">Full Name</p>
                <p class="font-bold text-gray-900">{{ caseData.customer }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <Phone class="w-4 h-4 text-gray-400" />
              <div>
                <p class="text-[10px] text-gray-400">Phone</p>
                <p class="font-semibold text-gray-800">{{ caseData.customerPhone || '+92 300 1234567' }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <Mail class="w-4 h-4 text-gray-400" />
              <div>
                <p class="text-[10px] text-gray-400">Email</p>
                <p class="font-semibold text-gray-800">{{ caseData.customerEmail || 'customer@example.com' }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <MapPin class="w-4 h-4 text-gray-400" />
              <div>
                <p class="text-[10px] text-gray-400">Address</p>
                <p class="font-medium text-gray-700">{{ caseData.customerAddress || 'Hayatabad, Peshawar' }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
          <h3 class="text-[14px] font-bold text-gray-900">Account Standing</h3>
          <div class="space-y-3 text-xs">
            <div class="flex justify-between py-2 border-b border-gray-50">
              <span class="text-gray-500">Tier:</span>
              <span class="font-bold text-[#165A31]">VIP EV Owner</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-50">
              <span class="text-gray-500">Units Owned:</span>
              <span class="font-bold text-gray-900">2 Vehicles</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-50">
              <span class="text-gray-500">Total Service Cases:</span>
              <span class="font-bold text-gray-900">1 (First Warranty Claim)</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-50">
              <span class="text-gray-500">Primary Branch:</span>
              <span class="font-bold text-gray-900">{{ caseData.branch }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. UNIT & WARRANTY TAB -->
    <div v-if="activeTab === 'Unit & Warranty'" class="space-y-6 animate-in fade-in duration-150">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
          <h3 class="text-[14px] font-bold text-gray-900">Vehicle Specifications</h3>
          <div class="space-y-3 text-xs">
            <div class="flex justify-between py-1.5 border-b border-gray-50">
              <span class="text-gray-500">Model:</span>
              <span class="font-bold text-gray-900">{{ caseData.unitModel || caseData.unit }}</span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-gray-50">
              <span class="text-gray-500">Unit Serial / Plate:</span>
              <span class="font-bold text-gray-900">{{ caseData.unitSerial || 'EV5-00322' }}</span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-gray-50">
              <span class="text-gray-500">VIN / Frame No:</span>
              <span class="font-mono text-gray-800">{{ caseData.vin || 'BRG-EV5-2025-00322' }}</span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-gray-50">
              <span class="text-gray-500">Motor Serial:</span>
              <span class="font-mono text-gray-800">{{ caseData.motorNo || 'MOT-72V-3000W-8821' }}</span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-gray-50">
              <span class="text-gray-500">Battery Serial:</span>
              <span class="font-mono text-gray-800">{{ caseData.batterySerial || 'BAT-72V-50AH-9982-EV' }}</span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-gray-50">
              <span class="text-gray-500">Odometer:</span>
              <span class="font-bold text-gray-900">{{ caseData.odometer || '4,820 km' }}</span>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
          <h3 class="text-[14px] font-bold text-gray-900">Warranty Coverage Policy</h3>
          <div class="space-y-3 text-xs">
            <div class="flex justify-between py-1.5 border-b border-gray-50">
              <span class="text-gray-500">Eligibility Status:</span>
              <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">
                {{ caseData.eligibility || 'Active (Under Warranty)' }}
              </span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-gray-50">
              <span class="text-gray-500">Coverage Type:</span>
              <span class="font-semibold text-gray-900">{{ caseData.batteryCoverage || 'Standard 3-Year Battery Warranty' }}</span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-gray-50">
              <span class="text-gray-500">Purchase Date:</span>
              <span class="font-medium text-gray-800">{{ caseData.purchaseDate || 'Jan 12, 2025' }}</span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-gray-50">
              <span class="text-gray-500">Warranty Start:</span>
              <span class="font-medium text-gray-800">{{ caseData.warrantyStart || 'Jan 12, 2025' }}</span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-gray-50">
              <span class="text-gray-500">Warranty Expiration:</span>
              <span class="font-medium text-gray-800">{{ caseData.warrantyEnd || 'Jan 12, 2028' }} (18 months remaining)</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 4. DIAGNOSIS TAB -->
    <div v-if="activeTab === 'Diagnosis'" class="space-y-6 animate-in fade-in duration-150">
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-5">
        <div class="flex items-center justify-between">
          <h3 class="text-[14px] font-bold text-gray-900">Technical Diagnostic Inspection</h3>
          <span class="text-[10px] font-bold px-2 py-1 bg-yellow-50 text-yellow-700 rounded">
            In Progress by {{ caseData.assignedTech }}
          </span>
        </div>

        <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div class="text-[11px] font-bold text-gray-800 mb-1">Diagnostic Report Summary</div>
          <p class="text-xs text-gray-700 leading-relaxed">
            {{ caseData.diagnosisSummary }}
          </p>
        </div>

        <!-- Checklist -->
        <div>
          <div class="text-[12px] font-bold text-gray-900 mb-3">Diagnostic Inspection Checklist</div>
          <div class="space-y-2.5">
            <div 
              v-for="(item, idx) in diagnosticChecklist" 
              :key="idx"
              @click="item.done = !item.done"
              class="flex items-center gap-3 p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div 
                class="w-4 h-4 rounded flex items-center justify-center border transition-colors"
                :class="item.done ? 'bg-[#165A31] border-[#165A31] text-white' : 'border-gray-300 bg-white'"
              >
                <Check v-if="item.done" class="w-3 h-3" />
              </div>
              <span class="text-xs font-medium" :class="item.done ? 'text-gray-900' : 'text-gray-500'">
                {{ item.task }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 5. RESOLUTION TAB -->
    <div v-if="activeTab === 'Resolution'" class="space-y-6 animate-in fade-in duration-150">
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-5">
        <h3 class="text-[14px] font-bold text-gray-900">Resolution Plan & Action Items</h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div class="p-4 bg-[#fbfbfc] border border-gray-100 rounded-xl">
            <div class="text-[10px] text-gray-400 font-bold uppercase mb-1">Step 1</div>
            <div class="font-bold text-gray-900 mb-1">Part Replacement</div>
            <p class="text-gray-500 text-[11px]">Install new OEM Smart BMS Control Board (Part #BMS-72-50-PRO).</p>
          </div>
          <div class="p-4 bg-[#fbfbfc] border border-gray-100 rounded-xl">
            <div class="text-[10px] text-gray-400 font-bold uppercase mb-1">Step 2</div>
            <div class="font-bold text-gray-900 mb-1">Cell Balancing Cycle</div>
            <p class="text-gray-500 text-[11px]">Execute 12-hour automated equalization charge to balance bank 4.</p>
          </div>
          <div class="p-4 bg-[#fbfbfc] border border-gray-100 rounded-xl">
            <div class="text-[10px] text-gray-400 font-bold uppercase mb-1">Step 3</div>
            <div class="font-bold text-gray-900 mb-1">Road & Range Verification</div>
            <p class="text-gray-500 text-[11px]">Conduct 20 km test drive to verify telemetry and range restoration.</p>
          </div>
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <p class="text-xs text-gray-500 font-medium">Estimated Handover Time</p>
            <p class="text-sm font-bold text-gray-900">{{ caseData.estimatedCompletion || 'Aug 28, 2026' }}</p>
          </div>
          <button @click="updateStatus('Ready')" class="bg-[#165A31] text-white text-[11px] font-bold px-4 py-2 rounded-lg hover:bg-[#124a28] transition-colors cursor-pointer">
            Mark Ready for Handover
          </button>
        </div>
      </div>
    </div>

    <!-- 6. COSTS TAB -->
    <div v-if="activeTab === 'Costs'" class="space-y-6 animate-in fade-in duration-150">
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-5">
        <h3 class="text-[14px] font-bold text-gray-900">Cost & Warranty Billing Breakdown</h3>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase">
                <th class="py-2.5">Item Description</th>
                <th class="py-2.5">Category</th>
                <th class="py-2.5 text-right">Standard Cost</th>
                <th class="py-2.5 text-right">Warranty Coverage</th>
                <th class="py-2.5 text-right">Customer Payable</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr>
                <td class="py-3 font-semibold text-gray-900">BRG Smart BMS Unit 72V 50Ah</td>
                <td class="py-3 text-gray-500">Spare Part</td>
                <td class="py-3 text-right font-medium text-gray-800">PKR 14,500</td>
                <td class="py-3 text-right text-[#165A31] font-semibold">- PKR 14,500 (100%)</td>
                <td class="py-3 text-right font-bold text-gray-900">PKR 0</td>
              </tr>
              <tr>
                <td class="py-3 font-semibold text-gray-900">High-Voltage Cell Diagnostic & Calibration Labor</td>
                <td class="py-3 text-gray-500">Technical Labor</td>
                <td class="py-3 text-right font-medium text-gray-800">PKR 4,000</td>
                <td class="py-3 text-right text-[#165A31] font-semibold">- PKR 4,000 (100%)</td>
                <td class="py-3 text-right font-bold text-gray-900">PKR 0</td>
              </tr>
              <tr class="bg-gray-50/50 font-bold">
                <td colspan="2" class="py-3 px-2 text-gray-900">Total Claim Value</td>
                <td class="py-3 text-right text-gray-900">PKR 18,500</td>
                <td class="py-3 text-right text-[#165A31]">PKR 18,500 OEM Reimbursed</td>
                <td class="py-3 text-right text-base text-[#165A31]">PKR 0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 7. COMMUNICATION TAB -->
    <div v-if="activeTab === 'Communication'" class="space-y-6 animate-in fade-in duration-150">
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-5">
        <h3 class="text-[14px] font-bold text-gray-900">Customer Communication & Activity Log</h3>

        <!-- Add Message input -->
        <div class="flex gap-2">
          <input 
            v-model="newNoteText"
            type="text" 
            placeholder="Type note or SMS message update to customer..." 
            class="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31]"
            @keyup.enter="addCommunicationNote"
          />
          <button 
            @click="addCommunicationNote"
            class="bg-[#165A31] text-white text-[11px] font-bold px-4 py-2 rounded-lg hover:bg-[#124a28] transition-colors cursor-pointer"
          >
            Send / Log
          </button>
        </div>

        <div class="space-y-3 pt-2">
          <div 
            v-for="(log, idx) in commLogs" 
            :key="idx" 
            class="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-1"
          >
            <div class="flex items-center justify-between text-[11px]">
              <span class="font-bold text-gray-800">{{ log.sender }}</span>
              <span class="text-gray-400 text-[10px]">{{ log.time }}</span>
            </div>
            <p class="text-xs text-gray-600">{{ log.text }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 8. DOCUMENTS TAB -->
    <div v-if="activeTab === 'Documents'" class="space-y-6 animate-in fade-in duration-150">
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-5">
        <div class="flex items-center justify-between">
          <h3 class="text-[14px] font-bold text-gray-900">Attached Documents & Diagnostic Reports</h3>
          <button class="text-xs font-bold text-[#165A31] hover:underline flex items-center gap-1">
            <Plus class="w-3.5 h-3.5" /> Upload File
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div class="p-4 rounded-xl border border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div class="flex items-center gap-3">
              <FileText class="w-6 h-6 text-[#165A31]" />
              <div>
                <p class="font-bold text-gray-900">Battery_Diagnostics_Log_WAR442.pdf</p>
                <p class="text-[10px] text-gray-400">1.4 MB · Uploaded Aug 25</p>
              </div>
            </div>
            <button class="p-2 text-gray-500 hover:text-gray-800">
              <Download class="w-4 h-4" />
            </button>
          </div>

          <div class="p-4 rounded-xl border border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div class="flex items-center gap-3">
              <FileText class="w-6 h-6 text-[#165A31]" />
              <div>
                <p class="font-bold text-gray-900">Warranty_Claim_Certificate.pdf</p>
                <p class="text-[10px] text-gray-400">680 KB · Verified by OEM</p>
              </div>
            </div>
            <button class="p-2 text-gray-500 hover:text-gray-800">
              <Download class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 9. TIMELINE TAB -->
    <div v-if="activeTab === 'Timeline'" class="space-y-6 animate-in fade-in duration-150">
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-5">
        <h3 class="text-[14px] font-bold text-gray-900">Audit & Milestone Timeline</h3>

        <div class="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
          <div class="relative">
            <div class="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-[#165A31] border-2 border-white"></div>
            <div class="text-xs font-bold text-gray-900">Diagnostic Scan Completed</div>
            <div class="text-[10px] text-gray-400">Aug 25, 2026 · 03:45 PM · by Hamza Farooq</div>
            <p class="text-xs text-gray-600 mt-1">Confirmed cell 4 variance on 72V pack. Warranty claim submitted to OEM.</p>
          </div>

          <div class="relative">
            <div class="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-[#165A31] border-2 border-white"></div>
            <div class="text-xs font-bold text-gray-900">Intake Inspection at Peshawar Service Bay</div>
            <div class="text-[10px] text-gray-400">Aug 25, 2026 · 10:30 AM · by Ahsan Khan</div>
            <p class="text-xs text-gray-600 mt-1">Vehicle checked in. Odometer recorded at 4,820 km.</p>
          </div>

          <div class="relative">
            <div class="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-gray-300 border-2 border-white"></div>
            <div class="text-xs font-bold text-gray-900">Case Created</div>
            <div class="text-[10px] text-gray-400">Aug 25, 2026 · 09:15 AM · by Super Admin</div>
            <p class="text-xs text-gray-600 mt-1">Customer complaint registered for battery range degradation.</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
