<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CheckCircle2, ArrowLeft, Check, X, AlertCircle, Printer } from 'lucide-vue-next'
import { store } from '../../store.js'

import NotFoundState from '@/components/common/NotFoundState.vue'

const route = useRoute()
const router = useRouter()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const handlePrint = () => {
  window.print()
}

// Toast State
const showToast = ref(false)
const toastMessage = ref('')

const triggerToast = (msg) => {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3500)
}

// Resolve Adjustment
const adjustmentId = computed(() => route.params.id || route.query.id || '')
const adjustment = computed(() => adjustmentId.value ? store.getAdjustmentById(adjustmentId.value) : null)
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
  <NotFoundState
    v-if="!adjustment"
    title="Stock Adjustment Not Found"
    message="The requested stock adjustment could not be found or is not accessible from your current branch context."
    back-link="/inventory/stock-adjustments"
    back-text="Back to Stock Adjustments"
  />

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
          @click="handlePrint"
          class="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
        >
          <Printer class="w-3.5 h-3.5" /> Print Adjustment Sheet
        </button>

        <button 
          v-if="currentStatus === 'Pending'"
          @click="rejectAdjustment"
          class="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors shadow-sm cursor-pointer"
        >
          <X class="w-3.5 h-3.5" /> Reject / Recount
        </button>

        <span 
          v-if="currentStatus === 'Pending'"
          class="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg"
          title="Stock adjustments must be reviewed and approved by Super Admin / Head Office."
        >
          <AlertCircle class="w-3.5 h-3.5 text-amber-600" /> Awaiting HQ Approval
        </span>
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
          @click="handlePrint"
          class="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
        >
          <Printer class="w-3.5 h-3.5" /> Print Adjustment Sheet
        </button>

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

  <!-- PRINTABLE STOCK RECONCILIATION & ADJUSTMENT SHEET -->
  <div class="print-document hidden font-sans p-8 max-w-4xl mx-auto bg-white text-black">
    <!-- Header -->
    <div class="border-b-2 border-black pb-4 mb-6 flex justify-between items-start">
      <div>
        <h1 class="text-2xl font-bold tracking-wider uppercase text-gray-900">AJ ECODRIVE LTD / BRG ELECTRIC VEHICLES</h1>
        <p class="text-xs text-gray-700 mt-1">Official Showroom & Warehouse Inventory Control &middot; Pakistan Network</p>
        <p class="text-[10px] text-gray-500 font-mono mt-0.5">NTN: {{ store.settings?.company?.taxNumber || 'Not configured' }} | STRN: {{ store.settings?.company?.strn || store.settings?.company?.registrationNumber || 'Not configured' }} | Form: INV-ADJ-REV3</p>
      </div>
      <div class="text-right">
        <div class="inline-block bg-black text-white px-3 py-1 font-bold text-sm tracking-widest uppercase mb-1">
          STOCK ADJUSTMENT VOUCHER
        </div>
        <div class="text-xs font-mono font-bold text-gray-800">REF: {{ adjustment?.id || adjustmentId }}</div>
        <div class="text-[10px] text-gray-600">Date: {{ adjustment?.date || new Date().toLocaleDateString('en-GB') }}</div>
      </div>
    </div>

    <!-- Summary Particulars -->
    <div class="grid grid-cols-2 gap-4 border border-gray-400 p-4 mb-6 text-xs bg-gray-50/50">
      <div>
        <p class="mb-1"><strong class="text-gray-900">Showroom / Branch:</strong> {{ adjustment?.branch || user?.branchName || 'Peshawar' }} Showroom</p>
        <p class="mb-1"><strong class="text-gray-900">Stock Bay / Location:</strong> {{ adjustment?.location || 'Main Showroom Floor / Bay 1' }}</p>
        <p class="mb-1"><strong class="text-gray-900">Submitted By:</strong> {{ adjustment?.requestedBy || 'Store Inventory Officer' }}</p>
        <p class="mb-1"><strong class="text-gray-900">Reason Classification:</strong> {{ adjustment?.reason || 'Cycle count physical reconciliation variance' }}</p>
      </div>
      <div>
        <p class="mb-1"><strong class="text-gray-900">Approval State:</strong> <span class="font-bold uppercase">{{ currentStatus }}</span></p>
        <p class="mb-1"><strong class="text-gray-900">Approving Authority:</strong> {{ adjustment?.approvedBy || (currentStatus === 'Approved' ? 'Head Office Executive Auditor' : 'Pending Super Admin Sign-off') }}</p>
        <p class="mb-1"><strong class="text-gray-900">Ledger Posting:</strong> {{ currentStatus === 'Approved' ? 'Posted to Stock Movement Ledger' : 'Pending Posting' }}</p>
        <p class="mb-1"><strong class="text-gray-900">Audit Compliance:</strong> Standard Showroom Stock Governance Protocol</p>
      </div>
    </div>

    <!-- Variance Table -->
    <table class="w-full text-left text-xs border border-collapse border-black mb-6">
      <thead>
        <tr class="bg-gray-100 border-b border-black text-[10px] uppercase font-bold">
          <th class="p-2 border-r border-black">#</th>
          <th class="p-2 border-r border-black">Vehicle / Product Particulars</th>
          <th class="p-2 border-r border-black font-mono">Chassis / Serial #</th>
          <th class="p-2 border-r border-black text-center">System State</th>
          <th class="p-2 border-r border-black text-center">Physical Count</th>
          <th class="p-2 border-r border-black text-center">Variance (Delta)</th>
          <th class="p-2 text-right">Ledger Valuation</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b border-gray-300">
          <td class="p-2 border-r border-gray-300">1</td>
          <td class="p-2 border-r border-gray-300 font-bold">{{ adjustment?.productUnit || adjustment?.unitProduct || 'BRG Electric Bike' }}</td>
          <td class="p-2 border-r border-gray-300 font-mono text-[11px]">{{ adjustment?.serial || 'CH8-BRG-26-01882' }}</td>
          <td class="p-2 border-r border-gray-300 text-center">{{ adjustment?.existingState || '6 Units' }}</td>
          <td class="p-2 border-r border-gray-300 text-center font-bold">{{ adjustment?.correctedState || '5 Units' }}</td>
          <td class="p-2 border-r border-gray-300 text-center font-bold text-red-600">{{ adjustment?.qtyEffect || adjustment?.difference || '-1 Unit' }}</td>
          <td class="p-2 text-right font-mono font-bold">{{ adjustment?.financialImpact || 'Standard Landed Cost' }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Investigation & Root Cause Remarks -->
    <div class="border border-gray-400 p-4 mb-6 text-xs space-y-2">
      <h4 class="font-bold uppercase text-gray-900 text-[10px] tracking-wider">Root Cause Analysis & Corrective Actions:</h4>
      <p class="text-gray-800 leading-relaxed">
        {{ adjustment?.notes || 'Physical recount verified by branch store custodian. Discrepancy reconciled between bay staging and floor inventory. Corrective serial scan updated in the primary vehicle register.' }}
      </p>
      <p class="text-[10px] text-gray-500 italic mt-2">
        Notice: In accordance with AJ EcoDrive / BRG dealership policy, no physical inventory write-off or stock adjustment may take effect without Super Admin authorization and physical count sheet verification.
      </p>
    </div>

    <!-- Quad Signature Blocks -->
    <div class="grid grid-cols-4 gap-4 pt-10 text-center text-xs">
      <div class="border-t border-black pt-2">
        <p class="font-bold">Counted / Prepared By</p>
        <p class="text-[9px] text-gray-500 mt-6">{{ adjustment?.requestedBy || 'Showroom Store Officer' }}</p>
      </div>
      <div class="border-t border-black pt-2">
        <p class="font-bold">Branch Manager</p>
        <p class="text-[9px] text-gray-500 mt-6">Verified & Recommended</p>
      </div>
      <div class="border-t border-black pt-2">
        <p class="font-bold">Super Admin / Head Office</p>
        <p class="text-[9px] text-gray-500 mt-6">Approved & Authorized</p>
      </div>
      <div class="border border-black p-2 h-20 flex items-center justify-center">
        <span class="text-[8px] text-gray-400 font-bold uppercase tracking-wider">SHOWROOM AUDIT STAMP</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media print {
  :deep(.no-print),
  .no-print,
  nav,
  aside,
  header {
    display: none !important;
  }
  .print-document {
    display: block !important;
  }
  body {
    background: white !important;
    color: black !important;
  }
}
</style>
