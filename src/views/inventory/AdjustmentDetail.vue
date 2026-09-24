<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CheckCircle2, ArrowLeft, Check, X, AlertCircle } from 'lucide-vue-next'
import { store } from '../../store.js'

const route = useRoute()
const router = useRouter()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

// Toast State
const showToast = ref(false)
const toastMessage = ref('')

const triggerToast = (msg) => {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3500)
}

// Resolve Adjustment
const adjustmentId = computed(() => route.params.id || route.query.id || 'ADJ-018')
const adjustment = computed(() => store.getAdjustmentById(adjustmentId.value))
const currentStatus = computed(() => adjustment.value?.status || 'Pending')

const branchCurrentTab = ref('Request')
const branchTabs = ['Request', 'Before & After', 'Evidence', 'Approval', 'Activity']

const approveAdjustment = () => {
  if (!adjustment.value) return
  store.approveStockAdjustment(adjustment.value.id, user.value?.name || 'Branch Manager')
  triggerToast(`Stock Adjustment ${adjustment.value.id} has been approved and inventory ledger updated.`)
}

const rejectAdjustment = () => {
  if (!adjustment.value) return
  store.rejectStockAdjustment(adjustment.value.id, 'Physical recount required', user.value?.name || 'Branch Manager')
  triggerToast(`Stock Adjustment ${adjustment.value.id} rejected. Physical recount requested.`)
}

const branchTabData = computed(() => {
  if (!adjustment.value) return { title: '', items: [] }
  const adj = adjustment.value
  const branchName = adj.branch || user.value?.branchName || 'Peshawar'
  const isApproved = adj.status === 'Approved'

  switch (branchCurrentTab.value) {
    case 'Request':
      return {
        title: 'Request',
        items: [
          { label: 'Product / Unit', value: adj.productUnit || adj.unitProduct || 'BRG Product' },
          { label: 'Before State', value: adj.existingState || '6 available' },
          { label: 'After State', value: adj.correctedState || '5 available' },
          { label: 'Reason', value: adj.reason || 'Count variance' },
          { label: 'Status', value: adj.status },
          { label: 'Evidence', value: adj.evidence || '1 attachment' }
        ]
      }
    case 'Before & After':
      return {
        title: 'Before & After',
        items: [
          { label: 'Product / Unit', value: `${adj.productUnit || adj.unitProduct}` },
          { label: 'Before State', value: adj.existingState || 'Available' },
          { label: 'After State', value: adj.correctedState || 'QC' },
          { label: 'Net Difference', value: adj.difference || adj.qtyEffect || 'Status change' },
          { label: 'Financial Impact', value: isApproved ? 'Adjusted in ledger' : 'Pending HQ Review' },
          { label: 'Affected Branch', value: `${branchName} Store` }
        ]
      }
    case 'Evidence':
      return {
        title: 'Evidence',
        items: [
          { label: 'Attached Evidence', value: adj.evidence || 'Physical_Count_Sheet.pdf' },
          { label: 'Uploaded By', value: adj.requestedBy || 'Branch Manager' },
          { label: 'Upload Timestamp', value: adj.requestedAt || 'Today 10:15' },
          { label: 'Verification Note', value: adj.notes || 'Reconciliation variance recorded' },
          { label: 'Audit Standard', value: 'Branch Cycle Audit Standard' },
          { label: 'Total Files', value: '1 Document' }
        ]
      }
    case 'Approval':
      return {
        title: 'Approval',
        items: [
          { label: 'Approval Status', value: isApproved ? 'Approved & Posted' : (adj.status === 'Rejected' || adj.status === 'Recount Required' ? 'Rejected / Recount' : 'Awaiting Decision') },
          { label: 'Approved By', value: adj.approvedBy || 'Pending Supervisor' },
          { label: 'Target SLA', value: '24 Hours' },
          { label: 'Conditions', value: 'Physical recount & evidence verification' },
          { label: 'Posting Authority', value: 'Branch Manager & HQ Audit' },
          { label: 'Audit Ledger', value: isApproved ? 'Posted to Stock Movement Ledger' : 'Pending Final Post' }
        ]
      }
    case 'Activity':
      return {
        title: 'Activity',
        items: (adj.timeline && adj.timeline.length > 0)
          ? adj.timeline.map(t => ({ label: t.timestamp || t.time || 'Logged', value: `${t.status || t.event}: ${t.note || ''} (${t.user || 'System'})` }))
          : [
            { label: 'Requested', value: `Submitted by ${adj.requestedBy || 'Store Officer'}` },
            { label: 'Current Stage', value: adj.status }
          ]
      }
    default:
      return { title: 'Request', items: [] }
  }
})

// Super Admin Tabs
const activeTab = ref('Adjustment')
const tabs = ['Adjustment', 'Reason', 'Before & After', 'Approval', 'Documents', 'Activity']

const adminTabData = computed(() => {
  const adj = adjustment.value || {}
  const isApproved = currentStatus.value === 'Approved'

  switch (activeTab.value) {
    case 'Adjustment':
      return {
        title: 'Executive Stock Adjustment Summary',
        items: [
          { label: 'Adjustment Reference', value: adjustmentId.value },
          { label: 'Branch Location', value: adj.branch || 'Peshawar' },
          { label: 'Affected Vehicle / Product', value: adj.productUnit || adj.unitProduct || 'BRG E-125' },
          { label: 'Serial / Chassis', value: adj.serial || 'CH8-BRG-26-01882' },
          { label: 'Quantity Effect', value: adj.qtyEffect || adj.difference || '0' },
          { label: 'Adjustment Status', value: currentStatus.value },
          { label: 'Submission Date', value: adj.date || 'Today' },
          { label: 'Requested By', value: adj.requestedBy || 'Store Officer' }
        ]
      }
    case 'Reason':
      return {
        title: 'Adjustment Justification & Root Cause',
        items: [
          { label: 'Primary Reason', value: adj.reason || 'Cycle count physical reconciliation variance' },
          { label: 'Variance Classification', value: 'Physical Tally Correction' },
          { label: 'Discrepancy Source', value: 'Pre-delivery inspection bay reallocation' },
          { label: 'Stock Loss Assessment', value: 'Zero Inventory Shrinkage (Count Variance Only)' },
          { label: 'Preventive Action', value: 'Mandatory barcode scan at showroom bay transit' },
          { label: 'Remarks', value: adj.notes || 'Reconciliation variance recorded during weekly cycle count.' }
        ]
      }
    case 'Before & After':
      return {
        title: 'Inventory Ledger State Reconciliation',
        items: [
          { label: 'Initial Ledger State', value: adj.existingState || 'Available (Showroom Floor)' },
          { label: 'Corrected Ledger State', value: adj.correctedState || 'QC Bay (Service Hold)' },
          { label: 'Net Unit Delta', value: adj.qtyEffect || '0 Units' },
          { label: 'Financial Balance Impact', value: 'PKR 0 (Internal Relocation)' },
          { label: 'Costing Valuation', value: 'Standard Landed Cost Maintained' },
          { label: 'GL Rebalancing Account', value: 'Inventory Inter-Bay Ledger (Peshawar)' }
        ]
      }
    case 'Approval':
      return {
        title: 'Executive Approval & Posting Authorization',
        items: [
          { label: 'Current Approval Status', value: isApproved ? 'Approved & Posted' : (currentStatus.value === 'Rejected' ? 'Rejected' : 'Pending Authorization') },
          { label: 'Authorized Officer', value: adj.approvedBy || (isApproved ? (user.value?.name || 'Super Admin') : 'Executive Inventory Controller') },
          { label: 'Sign-Off Authority', value: 'Head Office Inventory Governance' },
          { label: 'SLA Window', value: '24 Business Hours' },
          { label: 'Ledger Post Status', value: isApproved ? 'Posted to Stock Movement Ledger' : 'Queued for Post Approval' },
          { label: 'Compliance Audit', value: 'Audit Seal Verified' }
        ]
      }
    case 'Documents':
      return {
        title: 'Supporting Audit Evidence & Attachments',
        items: [
          { label: 'Signed Count Sheet', value: 'Cycle_Count_Sheet_Signed.pdf' },
          { label: 'Physical Inspection Record', value: 'Bay_Allocation_Scan.pdf' },
          { label: 'Stock Adjustment Form', value: `ADJ_${adjustmentId.value}_Signed.pdf` },
          { label: 'Evidence Filename', value: adj.evidence || 'Physical_Audit_Evidence.jpg' },
          { label: 'Attachment Verified', value: 'Verified by Branch Inventory Lead' },
          { label: 'Document Security', value: 'Archived in central immutable store' }
        ]
      }
    case 'Activity': {
      const logs = store.getAuditLogsForEntity('stock_adjustment', adjustmentId.value)
      const items = logs.length > 0 
        ? logs.map(l => ({
            label: l.timestamp || 'Recorded',
            value: `${l.action || l.operation}: ${l.description || l.result} (${l.user || l.actor_name || 'System'})`
          }))
        : (adj.timeline && adj.timeline.length > 0)
          ? adj.timeline.map(t => ({ label: t.timestamp || t.time || 'Logged', value: `${t.status || t.event}: ${t.note || ''} (${t.user || 'System'})` }))
          : [
              { label: 'Today 11:30', value: `Adjustment ${adjustmentId.value} submitted for review` },
              { label: 'Today 10:15', value: 'Variance detected during cycle count audit' },
              { label: 'Current State', value: currentStatus.value }
            ]
      return {
        title: 'Stock Adjustment Audit Timeline',
        items
      }
    }
    default:
      return {
        title: 'Adjustment',
        items: []
      }
  }
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
  <div v-if="!adjustment" class="max-w-[800px] mx-auto py-16 text-center space-y-4">
    <div class="inline-flex p-3 rounded-full bg-red-50 text-red-600 mb-2">
      <AlertCircle class="w-8 h-8" />
    </div>
    <h2 class="text-xl font-bold text-gray-900">Stock Adjustment Not Found</h2>
    <p class="text-xs text-gray-500">Adjustment reference "{{ adjustmentId }}" was not found in inventory records.</p>
    <button @click="router.push('/inventory/stock-adjustments')" class="px-4 py-2 bg-[#165A31] text-white rounded-lg text-xs font-bold hover:bg-[#124a28] cursor-pointer">
      &larr; Back to Stock Adjustments
    </button>
  </div>

  <!-- BRANCH MANAGER VIEW -->
  <div v-else-if="isBranchUser" class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[11px] text-gray-400 mb-1">
          Branch Manager / Adjustments / <span class="font-medium text-gray-600">Adjustment {{ adjustment.id }}</span>
        </div>
        <div class="flex items-center gap-3">
          <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Adjustment {{ adjustment.id }}</h1>
          <span 
            class="px-2.5 py-1 rounded-full text-[10px] font-bold"
            :class="currentStatus === 'Approved' ? 'bg-[#eefcf2] text-[#165A31]' : (currentStatus === 'Rejected' || currentStatus === 'Recount Required') ? 'bg-red-50 text-red-700' : 'bg-[#fef3c7] text-[#b45309]'"
          >
            {{ currentStatus }}
          </span>
        </div>
        <p class="text-xs text-gray-500 mt-1">Adjustment detail — {{ branchCurrentTab }}.</p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2.5">
        <button 
          @click="router.push('/inventory/stock-adjustments')"
          class="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
        >
          <ArrowLeft class="w-3.5 h-3.5" /> Back
        </button>

        <button 
          v-if="currentStatus === 'Pending'"
          @click="rejectAdjustment"
          class="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors shadow-sm cursor-pointer"
        >
          <X class="w-3.5 h-3.5" /> Reject / Recount
        </button>

        <button 
          v-if="currentStatus === 'Pending'"
          @click="approveAdjustment"
          class="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#165A31] hover:bg-[#124a28] rounded-lg transition-colors shadow-sm cursor-pointer"
        >
          <Check class="w-3.5 h-3.5" /> Approve Adjustment
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
          <h3 class="text-sm font-bold text-gray-900 mb-5">{{ branchTabData.title }}</h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div v-for="(item, idx) in branchTabData.items" :key="idx" class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">{{ item.label }}</span>
              <span class="text-sm font-bold text-gray-900 mt-1">{{ item.value }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Box -->
      <div class="lg:col-span-4 flex flex-col">
        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
          <h3 class="text-sm font-bold text-gray-900 mb-5">Branch context</h3>
          
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Approval</span>
              <span class="text-sm font-bold text-gray-900 mt-1">{{ currentStatus }}</span>
            </div>
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Branch</span>
              <span class="text-sm font-bold text-gray-900 mt-1">{{ adjustment.branch || user?.branchName || 'Peshawar' }}</span>
            </div>
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Posted</span>
              <span class="text-sm font-bold text-gray-900 mt-1">{{ currentStatus === 'Approved' ? 'Yes' : 'No' }}</span>
            </div>
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Activity</span>
              <span class="text-sm font-bold text-gray-900 mt-1">{{ (adjustment.timeline?.length || 1) }} events</span>
            </div>
          </div>
        </div>
        
        <p class="text-[11px] text-gray-400 font-medium mt-3 px-1">
          Branch operational data for {{ adjustment.branch || user?.branchName || 'Peshawar' }} Branch.
        </p>
      </div>
    </div>
  </div>

  <!-- SUPER ADMIN VIEW -->
  <div v-else class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Inventory / Adjustments / <span class="font-bold text-gray-800">Adjustment Detail — {{ activeTab }}</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Adjustment Detail — {{ activeTab }}</h1>
        <p class="text-sm text-gray-500 mt-1">{{ adjustment.id }} - {{ activeTab }}</p>
      </div>
      <button 
        @click="router.push('/inventory/stock-adjustments')"
        class="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
      >
        <ArrowLeft class="w-3.5 h-3.5" /> Back
      </button>
    </div>

    <!-- Overview Card -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <h2 class="text-[22px] font-bold text-gray-900">{{ adjustment.id }}</h2>
        <p class="text-[11px] text-gray-500 mt-1 font-medium">{{ adjustment.branch }} &middot; {{ adjustment.productUnit || adjustment.unitProduct }}</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <span 
          class="inline-flex items-center px-2 py-1 rounded-[4px] text-[10px] font-bold"
          :class="currentStatus === 'Approved' ? 'bg-[#eefcf2] text-[#165A31]' : (currentStatus === 'Rejected' || currentStatus === 'Recount Required') ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-600'"
        >
          {{ currentStatus }}
        </span>
        <button 
          v-if="currentStatus === 'Pending'"
          @click="approveAdjustment" 
          class="px-4 py-1.5 text-[11px] font-bold text-white bg-[#165A31] hover:bg-[#124a28] rounded-lg transition-colors shadow-sm cursor-pointer"
        >
          Approve Adjustment
        </button>
        <button 
          v-if="currentStatus === 'Pending'"
          @click="rejectAdjustment" 
          class="px-3 py-1.5 text-[11px] font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors shadow-sm cursor-pointer"
        >
          Reject
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
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
      <h3 class="text-sm font-bold text-gray-900 mb-4">{{ adminTabData.title }}</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div v-for="(item, idx) in adminTabData.items" :key="idx" class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
          <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{{ item.label }}</span>
          <span class="text-xs font-bold text-gray-900 mt-1 break-words">{{ item.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
