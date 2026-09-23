<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { store } from '../../store.js'
import { 
  ChevronDown, ArrowLeft, Check, CheckCircle2, Clock, 
  Wrench, FileText, Plus, Download, ShieldCheck, User
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const repairData = computed(() => {
  const paramId = route.params.id || route.query.id
  if (paramId) {
    const found = store.getRepairById(paramId) || store.repairs.find(r => r.repairId === paramId || r.id === paramId)
    if (found) return found
    return null
  }
  if (store.selectedRepair) return store.selectedRepair
  return null
})

const repairAuditLogs = computed(() => {
  if (!repairData.value) return []
  const id = repairData.value.id || repairData.value.repairId
  return store.getAuditLogsForEntity('repair_job', id)
})

const postToFinance = () => {
  if (!repairData.value) return
  const id = repairData.value.id || repairData.value.repairId
  const result = store.postRepairToFinance(id)
  if (result.success) {
    triggerToast(`Repair ${id} successfully posted to Finance as Invoice ${result.invoice.id}!`)
  } else {
    triggerToast(result.error || 'Failed to post repair to finance.')
  }
}

// Toast State
const showToast = ref(false)
const toastMessage = ref('')

const triggerToast = (msg) => {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3500)
}

const confirmSchedule = () => {
  if (repairData.value) {
    repairData.value.status = 'Scheduled'
  }
  triggerToast(`Service check ${repairData.value.repairId} scheduled and technician allocated.`)
}

const completeService = () => {
  if (repairData.value) {
    repairData.value.status = 'Ready'
  }
  triggerToast(`Service job ${repairData.value.repairId} marked as completed and ready for customer.`)
}

// --- BRANCH MANAGER TABS & DATA ---
const branchCurrentTab = ref('Diagnosis')
const branchTabs = [
  'Diagnosis',
  'Work',
  'Parts',
  'Labour',
  'Warranty',
  'Customer Approval',
  'Completion',
  'Photos',
  'Timeline'
]

const branchTabData = computed(() => {
  const job = repairData.value
  const branchName = user.value?.branchName || job.branch || 'Peshawar'

  switch (branchCurrentTab.value) {
    case 'Diagnosis':
      return {
        title: 'Diagnosis',
        items: [
          { label: 'Status', value: job.status || 'In Progress' },
          { label: 'Case', value: job.caseRef || 'SC-229' },
          { label: 'Unit', value: `${job.unit || 'CHS-01882'} (${job.unitModel || 'BRG EV'})` },
          { label: 'Technician', value: job.technician || 'Usman' },
          { label: 'Diagnosis', value: job.diagnosis || 'Controller fault' },
          { label: 'Parts', value: job.partsName || 'Service Kit' }
        ],
        relatedItems: [
          { label: 'Labour', value: job.labourList && job.labourList[0] ? `${job.labourList[0].hours} hours` : '1.5 hours' },
          { label: 'Warranty', value: job.warrantyCoverage?.status ? 'Covered' : 'Standard' },
          { label: 'Customer Approval', value: job.customerApproval?.status || 'Confirmed' },
          { label: 'Promised', value: job.promised || 'Tomorrow' }
        ]
      }
    case 'Work':
      return {
        title: 'Work Plan & Tasks',
        items: [
          { label: 'Work Plan', value: job.workPlan ? job.workPlan.map(w => w.task).join('; ') : 'Diagnostics and calibration' },
          { label: 'Current Step', value: job.workPlan && job.workPlan[0] ? job.workPlan[0].task : 'Inspection' },
          { label: 'Bay Assigned', value: 'Bay 2 (Electrical & Service)' },
          { label: 'Lead Technician', value: job.technician || 'Technician Ali' },
          { label: 'Work Order Ref', value: `WO-${job.repairId}-01` },
          { label: 'Target Completion', value: job.promised || 'Tomorrow' }
        ],
        relatedItems: [
          { label: 'Total Tasks', value: job.workPlan ? `${job.workPlan.length} Tasks` : '3 Tasks' },
          { label: 'Progress', value: job.status === 'Ready' ? '100% Done' : job.status === 'Pending' ? 'Scheduled' : '50% Done' },
          { label: 'Lead Tech', value: job.technician || 'Technician Ali' },
          { label: 'Est. Time', value: job.labourList && job.labourList[0] ? `${job.labourList[0].hours} Hours` : '1.5 Hours' }
        ]
      }
    case 'Parts':
      return {
        title: 'Parts & Allocation',
        items: [
          { label: 'Primary Part', value: job.partsList && job.partsList[0] ? `${job.partsList[0].part} (${job.partsList[0].qty} Qty)` : (job.partsName || 'Service Consumables & Kit') },
          { label: 'Part SKU', value: `PRT-${job.repairId}-01` },
          { label: 'Allocated Qty', value: job.partsList && job.partsList[0] ? `${job.partsList[0].qty} Unit` : '1 Unit' },
          { label: 'Stock Location', value: `${branchName} Service Store` },
          { label: 'Unit Cost', value: job.costSummary?.partsTotal || 'PKR 2,500' },
          { label: 'Allocation Status', value: job.partsList && job.partsList[0]?.status || 'Allocated & Verified' }
        ],
        relatedItems: [
          { label: 'Parts Total', value: job.costSummary?.partsTotal || 'PKR 2,500' },
          { label: 'Availability', value: 'In Stock' },
          { label: 'Requisition', value: `REQ-${job.repairId}` },
          { label: 'Handler', value: 'Store Manager' }
        ]
      }
    case 'Labour':
      return {
        title: 'Labour & Charges',
        items: [
          { label: 'Primary Labour', value: job.labourList && job.labourList[0]?.work || 'Scheduled Service Package' },
          { label: 'Standard Hours', value: job.labourList && job.labourList[0] ? `${job.labourList[0].hours} Hours @ PKR ${job.labourList[0].rate}` : '1.5 Hours @ PKR 1,500/hr' },
          { label: 'Technician', value: job.technician || 'Technician Ali' },
          { label: 'Hourly Rate', value: job.labourList && job.labourList[0]?.rate || 'PKR 1,500/hr' },
          { label: 'Total Labour Charge', value: job.costSummary?.labourTotal || 'PKR 2,250' },
          { label: 'Billing Allocation', value: job.costSummary?.warrantyCoverage || 'Complimentary / OEM Reimbursed' }
        ],
        relatedItems: [
          { label: 'Hourly Rate', value: job.labourList && job.labourList[0]?.rate || 'PKR 1,500/hr' },
          { label: 'Total Hours', value: job.labourList && job.labourList[0] ? `${job.labourList[0].hours} Hours` : '1.5 Hours' },
          { label: 'Tech Lead', value: job.technician || 'Technician Ali' },
          { label: 'Labour Total', value: job.costSummary?.labourTotal || 'PKR 2,250' }
        ]
      }
    case 'Warranty':
      return {
        title: 'Warranty Validation',
        items: [
          { label: 'Warranty Status', value: job.warrantyCoverage?.status || 'Active Coverage' },
          { label: 'Policy Coverage', value: job.warrantyCoverage?.policy || 'Annual Service Plan' },
          { label: 'Approval Ref', value: job.warrantyCoverage?.approvalId || `DIR-${job.repairId}` },
          { label: 'Total Value', value: job.costSummary?.total || 'PKR 4,750' },
          { label: 'Customer Liability', value: job.costSummary?.customerPayable || 'PKR 0' },
          { label: 'Coverage Note', value: job.costSummary?.warrantyCoverage || '100% Covered' }
        ],
        relatedItems: [
          { label: 'Claim Status', value: 'Approved' },
          { label: 'Warranty Tier', value: 'Full Coverage' },
          { label: 'Approved Date', value: 'Today' },
          { label: 'Reimbursement', value: 'Direct Credit' }
        ]
      }
    case 'Customer Approval':
      return {
        title: 'Customer Authorization',
        items: [
          { label: 'Customer Decision', value: job.customerApproval?.status || 'Confirmed' },
          { label: 'Approved By', value: job.customerApproval?.approvedBy || job.customer || 'Kamran Tariq' },
          { label: 'Approval Channel', value: job.customerApproval?.method || 'App Booking' },
          { label: 'Customer Phone', value: job.customerPhone || '+92 321 8899771' },
          { label: 'Quoted Amount', value: job.costSummary?.customerPayable ? `PKR ${job.costSummary.customerPayable}` : 'PKR 0 (Free Scheduled Check)' },
          { label: 'Intake Notes', value: job.customerApproval?.notes || 'Customer scheduled periodic check.' }
        ],
        relatedItems: [
          { label: 'Customer Phone', value: job.customerPhone || '+92 321 8899771' },
          { label: 'Customer Tier', value: 'Registered Owner' },
          { label: 'Channel', value: job.customerApproval?.method || 'App Booking' },
          { label: 'Promised Date', value: job.promised || 'Tomorrow' }
        ]
      }
    case 'Completion':
      return {
        title: 'Job Completion & Inspection',
        items: [
          { label: 'Job Stage', value: job.status === 'Ready' ? 'Completed & QC Passed' : `${job.status || 'Pending'} (Target: ${job.promised || 'Tomorrow'})` },
          { label: 'QC Inspector', value: 'Asad (QC Lead)' },
          { label: 'Road Test Inspection', value: job.status === 'Ready' ? 'Passed 100%' : 'Scheduled with road test' },
          { label: 'Diagnostics Scan', value: 'BMS & Motor firmware scan' },
          { label: 'Ready Notification', value: 'SMS notification configured on completion' },
          { label: 'Handover Protocol', value: `Gatepass GP-${job.repairId} configured` }
        ],
        relatedItems: [
          { label: 'Target Date', value: job.promised || 'Tomorrow' },
          { label: 'Duration', value: '1 Day' },
          { label: 'Gatepass', value: `GP-${job.repairId}` },
          { label: 'Disposition', value: 'Customer Handover' }
        ]
      }
    case 'Photos':
      return {
        title: 'Intake & Diagnostic Media',
        items: [
          { label: 'Intake Photo', value: `Intake_${job.repairId}_Odometer.jpg` },
          { label: 'Brake & Tyre Inspection', value: `Inspection_${job.repairId}_Brakes.jpg` },
          { label: 'Diagnostic Scan', value: `Diagnostic_Scan_${job.repairId}.pdf` },
          { label: 'Intake Slip', value: `Intake_Slip_${job.repairId}.pdf` },
          { label: 'Uploaded By', value: `${job.technician || 'Technician Ali'} (Workshop)` },
          { label: 'Total Files', value: '4 Attached Records' }
        ],
        relatedItems: [
          { label: 'Files Count', value: '4 Documents' },
          { label: 'Storage', value: 'Cloud Sync' },
          { label: 'Intake Date', value: 'Today' },
          { label: 'Last Updated', value: 'Today' }
        ]
      }
    case 'Timeline': {
      const logs = repairAuditLogs.value
      const items = logs.length > 0
        ? logs.map(l => ({
            label: l.timestamp || 'Recorded',
            value: `${l.action || l.operation}: ${l.description || l.result} (${l.user || l.actor_name || 'Technician'})`
          }))
        : ((job.timeline && job.timeline.length > 0) ? job.timeline.map(t => ({
            label: t.time,
            value: `${t.title} (${t.actor})`
          })) : [
            { label: 'Today · 11:30 AM', value: `Scheduled periodic service check for ${job.repairId}` },
            { label: 'Today · 09:15 AM', value: `Customer booking received for unit ${job.unit}` },
            { label: 'Current State', value: 'Ready for workshop intake and diagnostic execution' }
          ])
      return {
        title: 'Service Timeline & Audit Log',
        items,
        relatedItems: [
          { label: 'Created', value: 'Today' },
          { label: 'Last Event', value: 'Today' },
          { label: 'Audit ID', value: `AUD-${job.repairId}-01` },
          { label: 'Branch Scope', value: `${branchName} Workshop` }
        ]
      }
    }
    default:
      return {
        title: 'Diagnosis',
        items: [],
        relatedItems: []
      }
  }
})

// --- SUPER ADMIN VARIABLES ---
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
  if (status === 'Parts Waiting' || status === 'Awaiting Parts') return 'bg-[#fff7ed] text-[#ea580c]'
  if (status === 'Ready' || status === 'Completed') return 'bg-[#eefcf2] text-[#165A31]'
  return 'bg-gray-100 text-gray-600'
}
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
  <div v-if="!repairData" class="max-w-[800px] mx-auto py-16 px-4 text-center">
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-4">
      <div class="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
        <Wrench class="w-6 h-6" />
      </div>
      <h2 class="text-xl font-bold text-gray-900">Repair Job Not Found</h2>
      <p class="text-xs text-gray-500 max-w-md mx-auto">
        The requested repair job could not be located. It may have been deleted or the link is invalid.
      </p>
      <div class="pt-2">
        <router-link to="/after-sales/repairs" class="inline-flex items-center gap-2 px-4 py-2 bg-[#165A31] text-white text-xs font-bold rounded-lg hover:bg-[#124a28] transition-colors">
          <ArrowLeft class="w-4 h-4" /> Back to Repairs
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
          Branch Manager / Repairs / <span class="font-medium text-gray-600">Repair Job {{ repairData.repairId }}</span>
        </div>
        <div class="flex items-center gap-3">
          <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Repair Job {{ repairData.repairId }}</h1>
          <span 
            class="px-2.5 py-1 rounded-full text-[10px] font-bold"
            :class="repairData.status === 'Ready' || repairData.status === 'Completed' ? 'bg-[#eefcf2] text-[#165A31]' : repairData.status === 'Scheduled' || repairData.status === 'In Progress' ? 'bg-blue-50 text-blue-700' : 'bg-[#fef3c7] text-[#b45309]'"
          >
            {{ repairData.status || 'Pending' }}
          </span>
        </div>
        <p class="text-xs text-gray-500 mt-1">Repair job detail — {{ branchCurrentTab }}.</p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2.5">
        <button 
          @click="router.push('/dashboard/action-centre')"
          class="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
        >
          <ArrowLeft class="w-3.5 h-3.5" /> Back
        </button>

        <span 
          v-if="repairData.posted_to_finance" 
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"
        >
          <CheckCircle2 class="w-3.5 h-3.5" /> Posted: {{ repairData.finance_invoice_id }}
        </span>
        <button 
          v-else
          @click="postToFinance"
          class="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors shadow-sm cursor-pointer"
        >
          <FileText class="w-3.5 h-3.5 text-gray-500" /> Post to Finance
        </button>

        <button 
          v-if="repairData.status !== 'Ready' && repairData.status !== 'Completed'"
          @click="confirmSchedule"
          class="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
        >
          <Clock class="w-3.5 h-3.5 text-gray-500" /> Confirm Schedule
        </button>

        <button 
          v-if="repairData.status !== 'Ready' && repairData.status !== 'Completed'"
          @click="completeService"
          class="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#165A31] hover:bg-[#124a28] rounded-lg transition-colors shadow-sm cursor-pointer"
        >
          <Check class="w-3.5 h-3.5" /> Complete Service
        </button>
      </div>
    </div>

    <!-- Navigation Tabs (Exact 9 tabs matching screenshot) -->
    <div class="border-b border-gray-100 flex items-center gap-6 overflow-x-auto no-scrollbar pb-1">
      <button 
        v-for="tab in branchTabs" 
        :key="tab"
        @click="branchCurrentTab = tab"
        :class="[
          'text-xs whitespace-nowrap pb-2 font-semibold transition-colors cursor-pointer relative',
          branchCurrentTab === tab ? 'text-[#165A31] font-bold' : 'text-gray-400 hover:text-gray-700'
        ]"
      >
        {{ tab }}
        <div v-if="branchCurrentTab === tab" class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#165A31] rounded-t-full"></div>
      </button>
    </div>

    <!-- 2-Card Layout (Matching Screenshot) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Left Card (Span 8) -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 lg:col-span-8 flex flex-col justify-between">
        <div>
          <h3 class="text-sm font-bold text-gray-900 mb-4">{{ branchTabData.title }}</h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div 
              v-for="(item, idx) in branchTabData.items" 
              :key="idx" 
              class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between"
            >
              <span class="text-[10px] font-medium text-gray-400">{{ item.label }}</span>
              <span class="text-xs font-bold text-gray-900 mt-1">{{ item.value }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Card: Related information (Span 4) -->
      <div class="lg:col-span-4 flex flex-col">
        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
          <h3 class="text-sm font-bold text-gray-900 mb-4">Related information</h3>
          
          <div class="grid grid-cols-2 gap-3.5">
            <div 
              v-for="(item, idx) in branchTabData.relatedItems" 
              :key="idx" 
              class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between"
            >
              <span class="text-[10px] font-medium text-gray-400">{{ item.label }}</span>
              <span class="text-xs font-bold text-gray-900 mt-1">{{ item.value }}</span>
            </div>
          </div>
        </div>
        
        <p class="text-[11px] text-gray-400 font-medium mt-3 px-1 leading-relaxed">
          This view is scoped only to {{ user?.branchName || 'Peshawar' }} Branch. Actions that require company-wide approval remain with management.
        </p>
      </div>
    </div>
  </div>

  <!-- SUPER ADMIN VIEW -->
  <div v-else class="max-w-[1400px] mx-auto space-y-6 pb-12">
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

          <span 
            v-if="repairData.posted_to_finance" 
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"
          >
            <CheckCircle2 class="w-3.5 h-3.5" /> Posted: {{ repairData.finance_invoice_id }}
          </span>
          <button 
            v-else
            @click="postToFinance"
            class="px-4 py-2 text-[11px] font-bold text-white bg-[#165A31] hover:bg-[#124a28] rounded-lg transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <FileText class="w-3.5 h-3.5" /> Post to Finance
          </button>

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

    <!-- 1. DIAGNOSIS TAB -->
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

    <!-- 2. WORK TAB -->
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

    <!-- 3. PARTS TAB -->
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

    <!-- 4. LABOUR TAB -->
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
        <div class="flex items-center justify-between">
          <h3 class="text-[14px] font-bold text-gray-900">Workshop & Repair History</h3>
          <span class="text-[11px] text-gray-400 font-medium">{{ repairAuditLogs.length }} events recorded</span>
        </div>
        <div class="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
          <template v-if="repairAuditLogs.length > 0">
            <div v-for="(t, idx) in repairAuditLogs" :key="t.id || idx" class="relative">
              <div class="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-[#165A31] border-2 border-white"></div>
              <div class="text-xs font-bold text-gray-900">{{ t.action || t.operation }}: {{ t.description || t.result }}</div>
              <div class="text-[10px] text-gray-400">{{ t.timestamp }} · by {{ t.user || t.actor_name || 'Technician' }}</div>
            </div>
          </template>
          <template v-else>
            <div v-for="(t, idx) in (repairData?.timeline || [])" :key="idx" class="relative">
              <div class="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-[#165A31] border-2 border-white"></div>
              <div class="text-xs font-bold text-gray-900">{{ t.title }}</div>
              <div class="text-[10px] text-gray-400">{{ t.time }} · by {{ t.actor }}</div>
            </div>
          </template>
        </div>
      </div>
    </div>

  </div>
</template>
