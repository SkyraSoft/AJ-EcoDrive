<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { store } from '@/store'
import CreateReturnModal from './CreateReturn.vue'

const route = useRoute()
const router = useRouter()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const returnId = computed(() => route.params.id || route.query.id || 'RET-104')
const returnRecord = computed(() => store.getSalesReturnById(returnId.value) || store.salesReturns[0] || {})

const branchCurrentTab = ref('Request')
const branchTabs = ['Request', 'Original Sale', 'Inspection', 'Approval', 'Refund or Exchange', 'Unit Disposition', 'Documents', 'Activity']

const branchTabData = computed(() => {
  const branchName = returnRecord.value.branch || user.value?.branchName || 'Peshawar'
  const item = returnRecord.value

  switch (branchCurrentTab.value) {
    case 'Request':
      return {
        title: 'Request',
        items: [
          { label: 'Status', value: item.status || 'Inspection' },
          { label: 'Original Order', value: item.order || item.orderNo || 'ORD-2188' },
          { label: 'Customer', value: item.customer || 'Noman Ali' },
          { label: 'Unit', value: item.unit || 'CH 8-BRG-26-01731' },
          { label: 'Reason', value: item.reason || 'Battery Issue' },
          { label: 'Requested', value: item.requested || 'Exchange' }
        ]
      }
    case 'Original Sale':
      return {
        title: 'Original Sale',
        items: [
          { label: 'Original Order', value: item.order || item.orderNo || 'ORD-2188' },
          { label: 'Sale Amount', value: 'PKR 245,000' },
          { label: 'Sale Date', value: '14 Aug 2026' },
          { label: 'Salesperson', value: 'Hamza Ali' },
          { label: 'Payment Method', value: 'Bank Direct Deposit' },
          { label: 'Branch of Origin', value: `${branchName} Branch` }
        ]
      }
    case 'Inspection':
      return {
        title: 'Inspection',
        items: [
          { label: 'Inspected By', value: 'Usman (QC Lead)' },
          { label: 'Battery Capacity', value: 'Degraded to 58% (Cell variance)' },
          { label: 'Motor Test', value: 'Passed 100%' },
          { label: 'Cosmetic State', value: 'Excellent (No physical impacts)' },
          { label: 'Warranty Validation', value: 'Active Coverage (Day 18 of 365)' },
          { label: 'Inspection Report', value: `QC_Inspection_${item.returnNo || 'RET104'}.pdf` }
        ]
      }
    case 'Approval':
      return {
        title: 'Approval',
        items: [
          { label: 'Approval Status', value: item.status === 'Completed' ? 'Approved & Signed Off' : 'Pending Management Sign-off' },
          { label: 'Approving Authority', value: 'Central HQ Warranty Lead' },
          { label: 'Branch Recommendation', value: 'Approve Immediate Exchange' },
          { label: 'Customer Goodwill', value: 'High Priority VIP' },
          { label: 'SLA Target', value: '24 Hours' },
          { label: 'Ledger Authorization', value: item.status === 'Completed' ? 'Authorized' : 'Pending Approval' }
        ]
      }
    case 'Refund or Exchange':
      return {
        title: 'Refund or Exchange',
        items: [
          { label: 'Resolution Path', value: item.requested === 'Refund' ? 'Direct Refund' : 'Direct Unit Exchange' },
          { label: 'Replacement Model', value: 'BRG M3 (Identical Spec)' },
          { label: 'Allocated Unit', value: 'M3-01014 (Floor Stock)' },
          { label: 'Financial Adjustment', value: 'PKR 0 (Zero Diff)' },
          { label: 'Exchange Voucher', value: `EXCH-2026-${item.returnNo ? item.returnNo.replace('RET-', '') : '104'}` },
          { label: 'Handover State', value: item.status === 'Completed' ? 'Completed' : 'Ready upon final sign-off' }
        ]
      }
    case 'Unit Disposition':
      return {
        title: 'Unit Disposition',
        items: [
          { label: 'Physical Location', value: `${branchName} - Quarantine QC Bay` },
          { label: 'Proposed Disposition', value: 'Return to Supplier (RMA Claim)' },
          { label: 'Supplier Claim Ref', value: 'CLM-BRG-8821' },
          { label: 'Battery Replacement', value: 'Supplier Warranty Reimbursed' },
          { label: 'Inventory State', value: 'Locked in Quarantine' },
          { label: 'Disposal / Scrapping', value: 'Not Required' }
        ]
      }
    case 'Documents':
      return {
        title: 'Documents',
        items: [
          { label: 'Return Claim Form', value: `Return_Claim_${item.returnNo || 'RET104'}.pdf` },
          { label: 'Battery Health Log', value: 'BMS_Diagnostic_Data.pdf' },
          { label: 'Original Invoice', value: 'INV-2188.pdf' },
          { label: 'Customer Declaration', value: 'Signed_Declaration.jpg' },
          { label: 'Uploaded By', value: 'Usman' },
          { label: 'Total Files', value: '4 Documents' }
        ]
      }
    case 'Activity':
      return {
        title: 'Activity',
        items: [
          { label: '10:12', value: 'Battery diagnostic BMS report attached by Usman' },
          { label: '09:45', value: `Customer returned unit ${item.unit || ''} to ${branchName} Branch` },
          { label: '09:15', value: 'Return claim initiated under warranty' },
          { label: 'Current State', value: item.status || 'Under Technical Inspection' },
          { label: 'Logged By', value: 'System Audit' },
          { label: 'Branch Scope', value: `${branchName} Branch Operational Data` }
        ]
      }
    default:
      return {
        title: 'Request',
        items: []
      }
  }
})

// Super Admin Data
const showEditModal = ref(false)
const activeTab = ref('Request')
const tabs = ['Request', 'Original Sale', 'Unit', 'Inspection', 'Decision', 'Refund or Exchange', 'Stock Disposition', 'Documents', 'Activity']

const adminTabData = computed(() => {
  const r = returnRecord.value || {}
  const branchName = r.branch || 'Peshawar'
  const customerName = r.customer || 'Ahsan Khan'
  const unitRef = r.unit || 'CH8-BRG-26-01882'
  const orderRef = r.order || r.orderNo || 'ORD-2188'

  switch (activeTab.value) {
    case 'Request':
      return {
        title: 'Return Request & Claim Overview',
        items: [
          { label: 'Return Reference', value: returnId.value },
          { label: 'Branch Location', value: branchName },
          { label: 'Customer Name', value: customerName },
          { label: 'Original Sales Order', value: orderRef },
          { label: 'Reported Issue', value: r.reason || 'Controller intermittent cutoff under load' },
          { label: 'Customer Request', value: 'Unit Exchange for same model' },
          { label: 'Claim Date', value: r.date || 'Today' },
          { label: 'Status', value: r.status || 'Under Technical Review' }
        ]
      }
    case 'Original Sale':
      return {
        title: 'Original Sales & Delivery Reference',
        items: [
          { label: 'Sales Order Number', value: orderRef },
          { label: 'Tax Invoice Number', value: `INV-${orderRef.replace('ORD-', '')}` },
          { label: 'Original Sale Price', value: 'PKR 280,000' },
          { label: 'Payment Terms', value: '100% Cleared (Bank Transfer)' },
          { label: 'Delivery Date', value: '24 Aug 2026' },
          { label: 'Salesperson', value: 'Hamza Ali (Showroom Executive)' }
        ]
      }
    case 'Unit':
      return {
        title: 'Returned Vehicle & Serialized Profile',
        items: [
          { label: 'Model Name', value: 'BRG E-125 EcoDrive' },
          { label: 'Chassis / VIN', value: unitRef },
          { label: 'Motor Serial', value: 'MTR-72V-1200W-0881' },
          { label: 'Battery Serial', value: 'BAT-72V-32AH-9904' },
          { label: 'Odometer at Return', value: '42 km' },
          { label: 'Cosmetic Grade', value: 'Grade A- (Minor pedal scuff)' }
        ]
      }
    case 'Inspection':
      return {
        title: 'Technical Inspection & Diagnostic Report',
        items: [
          { label: 'Inspected By', value: 'Usman Farooq (Lead Service Technician)' },
          { label: 'Inspection Date', value: 'Today 10:15 AM' },
          { label: 'Battery Capacity Test', value: '100% SOH (60.2V nominal)' },
          { label: 'Controller Test', value: 'Thermal throttling sensor trigger confirmed' },
          { label: 'Frame & Fork Integrity', value: '100% Straight, No Impact Signs' },
          { label: 'Inspection Verdict', value: 'Defective Controller (Warranty Eligible)' }
        ]
      }
    case 'Decision':
      return {
        title: 'Executive Management Resolution & Decision',
        items: [
          { label: 'Authorized Outcome', value: 'Approve Immediate Customer Exchange' },
          { label: 'Decision Officer', value: 'Head of Customer Experience & QC' },
          { label: 'Turnaround Target', value: 'Same-day showroom handover' },
          { label: 'Customer Satisfaction Protocol', value: 'Complimentary helmet & first 3 services free' },
          { label: 'Decision Timestamp', value: 'Today 11:00 AM' },
          { label: 'Approval Status', value: 'Final Executive Sign-off Granted' }
        ]
      }
    case 'Refund or Exchange':
      return {
        title: 'Commercial Settlement & Replacement Unit',
        items: [
          { label: 'Resolution Mechanism', value: 'Unit Replacement / Exchange' },
          { label: 'Replacement Model', value: 'BRG E-125 (Brand New Floor Unit)' },
          { label: 'Replacement Chassis', value: 'CH8-BRG-26-02194' },
          { label: 'Additional Cost to Customer', value: 'PKR 0' },
          { label: 'Credit Note Reference', value: `CN-${returnId.value}` },
          { label: 'New Warranty Activation', value: 'Full 2-Year OEM Warranty from today' }
        ]
      }
    case 'Stock Disposition':
      return {
        title: 'Returned Asset Quarantine & Reconditioning',
        items: [
          { label: 'Asset Quarantine Location', value: `${branchName} Workshop Quarantine Bay` },
          { label: 'Reconditioning Workflow', value: 'Replace controller with OEM spare pack' },
          { label: 'Defective Part Destination', value: 'RMA Supplier Return to BRG Factory' },
          { label: 'Inventory Re-entry', value: 'Post-repair Certified Pre-owned or Demo' },
          { label: 'Inventory Write-down', value: 'PKR 0 (Covered under OEM supplier warranty)' },
          { label: 'Stock Status', value: 'Isolated in Quarantine Bay' }
        ]
      }
    case 'Documents':
      return {
        title: 'Legal, Inspection & Claim Documents',
        items: [
          { label: 'Customer Return Slip', value: `Return_${returnId.value}_Signed.pdf` },
          { label: 'PDI Technical Report', value: 'Diagnostic_Checklist_0128.pdf' },
          { label: 'Replacement Agreement', value: 'Exchange_Handover_Contract.pdf' },
          { label: 'Customer CNIC Copy', value: 'CNIC_Verified.pdf' },
          { label: 'Total Files Attached', value: '4 Verified Documents' }
        ]
      }
    case 'Activity': {
      const logs = store.getAuditLogsForEntity('sales_return', returnId.value)
      const items = logs.length > 0 
        ? logs.map(l => ({
            label: l.timestamp || 'Recorded',
            value: `${l.action || l.operation}: ${l.description || l.result} (${l.user || l.actor_name || 'System'})`
          }))
        : [
            { label: 'Today 11:00', value: 'Return approved for replacement unit exchange' },
            { label: 'Today 10:15', value: 'Technical inspection completed by lead technician' },
            { label: 'Today 09:30', value: `Return request ${returnId.value} submitted at showroom` },
            { label: 'Audit Trail', value: 'Logged in enterprise sales return registry' }
          ]
      return {
        title: 'Return Lifecycle Timeline',
        items
      }
    }
    default:
      return {
        title: 'Request',
        items: []
      }
  }
})

const handleReturnUpdated = (updatedRecord) => {
  store.updateSalesReturn(updatedRecord.returnNo || updatedRecord.id, updatedRecord)
  showEditModal.value = false
}
</script>

<template>
  <!-- BRANCH MANAGER VIEW -->
  <div v-if="isBranchUser" class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[11px] text-gray-400 mb-1">
          Branch Manager / Returns & Refunds / <span class="font-medium text-gray-600">Return {{ returnId }}</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Return {{ returnId }}</h1>
        <p class="text-xs text-gray-500 mt-1">Return detail — {{ branchCurrentTab }}.</p>
      </div>
    </div>

    <!-- Tabs Navigation Bar -->
    <div class="border-b border-gray-100 flex items-center gap-6 overflow-x-auto pb-1">
      <button 
        v-for="tab in branchTabs" 
        :key="tab"
        @click="branchCurrentTab = tab"
        class="pb-2 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer relative"
        :class="branchCurrentTab === tab ? 'text-[#165A31] font-bold' : 'text-gray-400 hover:text-gray-700'"
      >
        {{ tab }}
        <div v-if="branchCurrentTab === tab" class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#165A31] rounded-t-full"></div>
      </button>
    </div>

    <!-- Tab Content: Left Box (Data) & Right Box (Related information) -->
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

      <!-- Right Box: Related information -->
      <div class="lg:col-span-4 flex flex-col">
        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
          <h3 class="text-sm font-bold text-gray-900 mb-5">Related information</h3>
          
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Inspector</span>
              <span class="text-sm font-bold text-gray-900 mt-1">Usman</span>
            </div>
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Approval</span>
              <span class="text-sm font-bold text-gray-900 mt-1">Pending</span>
            </div>
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Disposition</span>
              <span class="text-sm font-bold text-gray-900 mt-1">To be decided</span>
            </div>
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Last Update</span>
              <span class="text-sm font-bold text-gray-900 mt-1">Today 10:12</span>
            </div>
          </div>
        </div>
        
        <p class="text-[11px] text-gray-400 font-medium mt-3 px-1">
          This view is scoped only to {{ user?.branchName || 'Peshawar' }} Branch. Actions that require company-wide approval remain with management.
        </p>
      </div>
    </div>
  </div>

  <!-- SUPER ADMIN VIEW -->
  <div v-else class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Sales & CRM / Returns / <span class="font-bold text-gray-800">Return Detail — {{ activeTab }}</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900 flex items-center gap-3">
          Return Detail — {{ activeTab }}
        </h1>
        <p class="text-sm text-gray-500 mt-1">{{ returnId }} · {{ activeTab }}</p>
      </div>
    </div>

    <!-- Status Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 rounded-xl">
      <div>
        <h2 class="text-xl font-bold text-gray-900">{{ returnRecord.returnNo || returnId }}</h2>
        <p class="text-[12px] text-gray-500 mt-1">{{ returnRecord.order || returnRecord.orderNo }} · {{ returnRecord.customer }} · {{ returnRecord.unit }}</p>
      </div>
      <div class="flex items-center gap-3">
        <span :class="['inline-flex items-center px-2 py-1 rounded-[4px] text-[10px] font-bold', returnRecord.statusColor || returnRecord.statusClass || 'bg-[#eefcf2] text-[#165A31]']">{{ returnRecord.status || 'Inspection' }}</span>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="border-b border-gray-100">
      <div class="flex overflow-x-auto hide-scrollbar">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="activeTab = tab"
          :class="[
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-[12px] mr-8 transition-colors',
            activeTab === tab
              ? 'border-[#165A31] text-[#165A31]'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
          ]"
        >
          {{ tab }}
        </button>
      </div>
    </div>

    <!-- Tab Content Area -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
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
