<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../../store.js'
import { 
  ChevronDown, ArrowLeft, Check, CheckCircle2, Clock, 
  Wrench, FileText, Plus, Download, ShieldCheck, User
} from 'lucide-vue-next'

const router = useRouter()

const repairData = computed(() => {
  return store.selectedRepair || store.repairs[0] || {
    repairId: 'REP-721',
    caseRef: 'WAR-442',
    branch: 'Peshawar',
    customer: 'Faisal Khan',
    unit: 'EV5-00322',
    unitModel: 'BRG EV-5',
    diagnosis: 'Battery replacement',
    fault: 'Battery capacity below warranty threshold',
    decision: 'Replace battery',
    partsName: 'Battery',
    status: 'Approved',
    readyDate: 'Aug 30',
    technician: 'Usman',
    workPlan: [
      { task: 'Remove battery', technician: 'Usman', status: 'Pending' },
      { task: 'Install replacement', technician: 'Usman', status: 'Pending' },
      { task: 'Road test', technician: 'Usman', status: 'Pending' }
    ],
    partsList: [
      { part: '72V Battery Pack', qty: 1, cost: '68K', source: 'Service Stock', status: 'Reserved' }
    ],
    labourList: [
      { work: 'Battery replacement', hours: 1.5, rate: '2,500/hr', amount: '3,750' },
      { work: 'Road test', hours: 0.5, rate: '500/hr', amount: '250' }
    ],
    costSummary: {
      partsTotal: 'PKR 68,000',
      labourTotal: 'PKR 4,000',
      total: 'PKR 72,000',
      warrantyCoverage: '100% Covered (OEM Claim)',
      customerPayable: 'PKR 0'
    },
    warrantyCoverage: {
      status: '100% OEM Warranty Claim',
      policy: 'Standard 3-Year Battery Warranty',
      approvalId: 'OEM-CLM-9921',
      payable: 'PKR 0'
    },
    customerApproval: {
      status: 'Approved',
      approvedBy: 'Faisal Khan',
      approvedDate: 'Aug 25, 2026 · 02:40 PM',
      method: 'Digital SMS OTP Verification',
      notes: 'Customer approved full battery replacement schedule under warranty.'
    },
    timeline: [
      { title: 'Parts Reserved from Service Stock', time: 'Aug 25, 2026 · 03:00 PM', actor: 'Store Manager' },
      { title: 'Customer Approved Repair Schedule', time: 'Aug 25, 2026 · 02:40 PM', actor: 'Faisal Khan' },
      { title: 'Technical Diagnosis & Battery Decision', time: 'Aug 25, 2026 · 01:15 PM', actor: 'Usman (Tech Lead)' },
      { title: 'Repair Job REP-721 Created', time: 'Aug 25, 2026 · 11:30 AM', actor: 'Peshawar Workshop' }
    ]
  }
})

const activeTab = ref('Diagnosis')
const tabs = [
  'Diagnosis',
  'Work',
  'Parts',
  'Labour',
  'Cost',
  'Warranty Coverage',
  'Photos & Documents',
  'Customer Approval',
  'Timeline'
]

const showActionsDropdown = ref(false)
const showMoreDropdown = ref(false)

const updateStatus = (newStatus) => {
  repairData.value.status = newStatus
  showActionsDropdown.value = false
}

const getStatusBadgeClass = (status) => {
  if (status === 'Approved') return 'bg-[#eefcf2] text-[#165A31]'
  if (status === 'In Progress') return 'bg-blue-50 text-blue-600'
  if (status === 'Parts Waiting') return 'bg-[#fff7ed] text-[#ea580c]'
  if (status === 'Ready' || status === 'Completed') return 'bg-[#eefcf2] text-[#165A31]'
  return 'bg-gray-100 text-gray-600'
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Breadcrumb & Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1 flex items-center gap-1">
          <router-link to="/after-sales/repairs" class="hover:text-gray-800">Super Admin</router-link> /
          <router-link to="/after-sales/dashboard" class="hover:text-gray-800">After-sales</router-link> /
          <router-link to="/after-sales/repairs" class="hover:text-gray-800">Repairs</router-link> /
          <span class="font-bold text-gray-800">Repair Detail — {{ activeTab }}</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">
          Repair Detail — {{ activeTab }}
        </h1>
        <p class="text-sm text-gray-500 mt-1">{{ repairData.repairId }} · {{ activeTab }}</p>
      </div>

      <button 
        @click="router.push('/after-sales/repairs')"
        class="flex items-center gap-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 px-3.5 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
      >
        <ArrowLeft class="w-3.5 h-3.5" /> Back to Repairs
      </button>
    </div>

    <!-- Main Header Card -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">{{ repairData.repairId }}</h2>
          <p class="text-[12px] text-gray-500 mt-0.5 font-medium">
            {{ repairData.caseRef || 'WAR-442' }} · {{ repairData.unit }} · {{ repairData.branch }}
          </p>
        </div>

        <div class="flex items-center gap-3">
          <!-- Status Badge -->
          <span 
            class="inline-flex items-center px-2.5 py-1 rounded-[4px] text-[10px] font-bold"
            :class="getStatusBadgeClass(repairData.status)"
          >
            {{ repairData.status }}
          </span>

          <!-- Repair Actions Dropdown -->
          <div class="relative">
            <button 
              @click="showActionsDropdown = !showActionsDropdown"
              class="px-4 py-2 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center gap-1.5 cursor-pointer"
            >
              Repair Actions <ChevronDown class="w-3.5 h-3.5" />
            </button>

            <div 
              v-if="showActionsDropdown" 
              class="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-30 text-xs text-gray-700 animate-in fade-in zoom-in-95 duration-150"
            >
              <div class="px-3 py-1 text-[10px] font-bold uppercase text-gray-400">Update Status</div>
              <button @click="updateStatus('Approved')" class="w-full text-left px-4 py-1.5 hover:bg-gray-50 text-gray-700 flex items-center justify-between">
                <span>Approved</span>
                <Check v-if="repairData.status === 'Approved'" class="w-3.5 h-3.5 text-[#165A31]" />
              </button>
              <button @click="updateStatus('In Progress')" class="w-full text-left px-4 py-1.5 hover:bg-gray-50 text-gray-700 flex items-center justify-between">
                <span>In Progress</span>
                <Check v-if="repairData.status === 'In Progress'" class="w-3.5 h-3.5 text-[#165A31]" />
              </button>
              <button @click="updateStatus('Parts Waiting')" class="w-full text-left px-4 py-1.5 hover:bg-gray-50 text-gray-700 flex items-center justify-between">
                <span>Parts Waiting</span>
                <Check v-if="repairData.status === 'Parts Waiting'" class="w-3.5 h-3.5 text-[#165A31]" />
              </button>
              <button @click="updateStatus('Ready')" class="w-full text-left px-4 py-1.5 hover:bg-gray-50 text-gray-700 flex items-center justify-between">
                <span>Ready / Completed</span>
                <Check v-if="repairData.status === 'Ready'" class="w-3.5 h-3.5 text-[#165A31]" />
              </button>
              <div class="border-t border-gray-100 my-1"></div>
              <button @click="showActionsDropdown = false; activeTab = 'Work'" class="w-full text-left px-4 py-1.5 hover:bg-gray-50 text-gray-700">
                Manage Work Plan
              </button>
              <button @click="showActionsDropdown = false; activeTab = 'Parts'" class="w-full text-left px-4 py-1.5 hover:bg-gray-50 text-gray-700">
                Reserve More Parts
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
              <button @click="showMoreDropdown = false" class="w-full text-left px-4 py-1.5 hover:bg-gray-50 text-gray-700">Print Job Card</button>
              <button @click="showMoreDropdown = false" class="w-full text-left px-4 py-1.5 hover:bg-gray-50 text-gray-700">Generate Invoice</button>
              <button @click="showMoreDropdown = false" class="w-full text-left px-4 py-1.5 hover:bg-gray-50 text-red-600">Cancel Repair Job</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs (Exact styling) -->
      <div class="flex flex-wrap items-center gap-6 border-b border-gray-100 -mb-2">
        <button 
          v-for="tab in tabs" 
          :key="tab"
          @click="activeTab = tab"
          class="pb-3 text-[12px] font-bold transition-colors relative cursor-pointer whitespace-nowrap"
          :class="activeTab === tab ? 'text-[#165A31]' : 'text-gray-400 hover:text-gray-600'"
        >
          {{ tab }}
          <div v-if="activeTab === tab" class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#165A31] rounded-t-full"></div>
        </button>
      </div>
    </div>

    <!-- TAB CONTENTS -->

    <!-- 1. DIAGNOSIS TAB (Exact match with Screenshot 2) -->
    <div v-if="activeTab === 'Diagnosis'" class="animate-in fade-in duration-150">
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">Diagnosis</h3>
        </div>
        <div class="p-6 space-y-4 text-xs">
          <div class="flex items-center justify-between py-2 border-b border-gray-50">
            <span class="text-gray-500 font-medium">Fault</span>
            <span class="font-bold text-gray-900">{{ repairData.fault }}</span>
          </div>
          <div class="flex items-center justify-between py-2 border-b border-gray-50">
            <span class="text-gray-500 font-medium">Decision</span>
            <span class="font-bold text-gray-900">{{ repairData.decision }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. WORK TAB (Exact match with Screenshot 3) -->
    <div v-if="activeTab === 'Work'" class="animate-in fade-in duration-150">
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">Work Plan</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th class="px-6 py-3">Task</th>
                <th class="px-6 py-3">Technician</th>
                <th class="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="(item, idx) in repairData.workPlan" :key="idx" class="border-b border-gray-50 hover:bg-gray-50/50">
                <td class="px-6 py-4 text-gray-800 font-medium">{{ item.task }}</td>
                <td class="px-6 py-4 text-gray-600 font-medium">{{ item.technician }}</td>
                <td class="px-6 py-4 text-gray-600 font-medium">{{ item.status }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 3. PARTS TAB (Exact match with Screenshot 4) -->
    <div v-if="activeTab === 'Parts'" class="animate-in fade-in duration-150">
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">Parts</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th class="px-6 py-3">Part</th>
                <th class="px-6 py-3">Qty</th>
                <th class="px-6 py-3">Cost</th>
                <th class="px-6 py-3">Source</th>
                <th class="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="(p, idx) in repairData.partsList" :key="idx" class="border-b border-gray-50 hover:bg-gray-50/50">
                <td class="px-6 py-4 text-gray-800 font-medium">{{ p.part }}</td>
                <td class="px-6 py-4 text-gray-600 font-medium">{{ p.qty }}</td>
                <td class="px-6 py-4 text-gray-600 font-medium">{{ p.cost }}</td>
                <td class="px-6 py-4 text-gray-600 font-medium">{{ p.source }}</td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold bg-[#fff7ed] text-[#ea580c]">
                    {{ p.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 4. LABOUR TAB (Exact match with Screenshot 5) -->
    <div v-if="activeTab === 'Labour'" class="animate-in fade-in duration-150">
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">Labour</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th class="px-6 py-3">Work</th>
                <th class="px-6 py-3">Hours</th>
                <th class="px-6 py-3">Rate</th>
                <th class="px-6 py-3">Amount</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="(l, idx) in repairData.labourList" :key="idx" class="border-b border-gray-50 hover:bg-gray-50/50">
                <td class="px-6 py-4 text-gray-800 font-medium">{{ l.work }}</td>
                <td class="px-6 py-4 text-gray-600 font-medium">{{ l.hours }}</td>
                <td class="px-6 py-4 text-gray-600 font-medium">{{ l.rate }}</td>
                <td class="px-6 py-4 text-gray-900 font-semibold">{{ l.amount }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 5. COST TAB -->
    <div v-if="activeTab === 'Cost'" class="animate-in fade-in duration-150">
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-[14px] font-bold text-gray-900">Cost Summary</h3>
        <div class="space-y-3 text-xs">
          <div class="flex justify-between py-2 border-b border-gray-50">
            <span class="text-gray-500">Parts Total</span>
            <span class="font-bold text-gray-900">{{ repairData.costSummary.partsTotal }}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-gray-50">
            <span class="text-gray-500">Labour Total</span>
            <span class="font-bold text-gray-900">{{ repairData.costSummary.labourTotal }}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-gray-50 font-bold">
            <span class="text-gray-900">Total Workshop Cost</span>
            <span class="text-gray-900">{{ repairData.costSummary.total }}</span>
          </div>
          <div class="flex justify-between py-2 bg-[#eefcf2] p-3 rounded-lg text-[#165A31] font-bold">
            <span>Warranty Coverage</span>
            <span>{{ repairData.costSummary.warrantyCoverage }}</span>
          </div>
          <div class="flex justify-between py-2 text-sm font-bold">
            <span>Customer Payable</span>
            <span class="text-[#165A31]">{{ repairData.costSummary.customerPayable }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 6. WARRANTY COVERAGE TAB -->
    <div v-if="activeTab === 'Warranty Coverage'" class="animate-in fade-in duration-150">
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-[14px] font-bold text-gray-900">OEM Warranty Claim Verification</h3>
        <div class="space-y-3 text-xs">
          <div class="flex justify-between py-2 border-b border-gray-50">
            <span class="text-gray-500">Claim Status:</span>
            <span class="font-bold text-[#165A31]">{{ repairData.warrantyCoverage.status }}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-gray-50">
            <span class="text-gray-500">Policy:</span>
            <span class="font-semibold text-gray-800">{{ repairData.warrantyCoverage.policy }}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-gray-50">
            <span class="text-gray-500">OEM Approval Reference:</span>
            <span class="font-mono text-gray-800">{{ repairData.warrantyCoverage.approvalId }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 7. PHOTOS & DOCUMENTS TAB -->
    <div v-if="activeTab === 'Photos & Documents'" class="animate-in fade-in duration-150">
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-[14px] font-bold text-gray-900">Job Files & Diagnostics</h3>
          <button class="text-xs font-bold text-[#165A31] hover:underline flex items-center gap-1">
            <Plus class="w-3.5 h-3.5" /> Upload Photo / Document
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div class="p-4 rounded-xl border border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div class="flex items-center gap-3">
              <FileText class="w-6 h-6 text-[#165A31]" />
              <div>
                <p class="font-bold text-gray-900">Job_Card_REP721.pdf</p>
                <p class="text-[10px] text-gray-400">820 KB · Generated by Workshop</p>
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
                <p class="font-bold text-gray-900">Battery_Capacity_Test_Report.pdf</p>
                <p class="text-[10px] text-gray-400">1.2 MB · Verified</p>
              </div>
            </div>
            <button class="p-2 text-gray-500 hover:text-gray-800">
              <Download class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 8. CUSTOMER APPROVAL TAB -->
    <div v-if="activeTab === 'Customer Approval'" class="animate-in fade-in duration-150">
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-[14px] font-bold text-gray-900">Customer Authorization Record</h3>
        <div class="space-y-3 text-xs">
          <div class="flex justify-between py-2 border-b border-gray-50">
            <span class="text-gray-500">Approval Status:</span>
            <span class="font-bold text-[#165A31]">{{ repairData.customerApproval.status }}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-gray-50">
            <span class="text-gray-500">Authorized By:</span>
            <span class="font-bold text-gray-900">{{ repairData.customerApproval.approvedBy }}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-gray-50">
            <span class="text-gray-500">Timestamp:</span>
            <span class="font-medium text-gray-800">{{ repairData.customerApproval.approvedDate }}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-gray-50">
            <span class="text-gray-500">Method:</span>
            <span class="font-medium text-gray-800">{{ repairData.customerApproval.method }}</span>
          </div>
          <div class="p-3 bg-gray-50 rounded-lg text-gray-700">
            {{ repairData.customerApproval.notes }}
          </div>
        </div>
      </div>
    </div>

    <!-- 9. TIMELINE TAB -->
    <div v-if="activeTab === 'Timeline'" class="animate-in fade-in duration-150">
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-5">
        <h3 class="text-[14px] font-bold text-gray-900">Workshop & Repair History</h3>
        <div class="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
          <div v-for="(t, idx) in repairData.timeline" :key="idx" class="relative">
            <div class="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-[#165A31] border-2 border-white"></div>
            <div class="text-xs font-bold text-gray-900">{{ t.title }}</div>
            <div class="text-[10px] text-gray-400">{{ t.time }} · by {{ t.actor }}</div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
