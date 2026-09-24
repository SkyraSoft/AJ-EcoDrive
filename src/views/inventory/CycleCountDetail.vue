<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { store } from '../../store.js'

const route = useRoute()
const router = useRouter()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

// Branch Manager Data & Logic
const countId = computed(() => route.params.id || route.query.id || 'CC-031')
const isCC030 = computed(() => countId.value === 'CC-030')
const branchCurrentTab = ref('Count Summary')
const branchTabs = ['Count Summary', 'Expected Inventory', 'Physical Count', 'Serialized Confirmation', 'Discrepancy', 'Notes', 'Submit Count']

const branchTabData = computed(() => {
  const branchName = user.value?.branchName || 'Peshawar'

  switch (branchCurrentTab.value) {
    case 'Count Summary':
      return {
        title: 'Count Summary',
        items: [
          { label: 'Scope', value: isCC030.value ? 'Warehouse A' : 'Showroom' },
          { label: 'Expected', value: isCC030.value ? '36' : '20' },
          { label: 'Counted', value: isCC030.value ? '0' : '18' },
          { label: 'Matched', value: isCC030.value ? '0' : '17' },
          { label: 'Discrepancies', value: isCC030.value ? '0' : '1' },
          { label: 'Status', value: isCC030.value ? 'Scheduled' : 'In Progress' }
        ]
      }
    case 'Expected Inventory':
      return {
        title: 'Expected Inventory',
        items: [
          { label: 'Target Category', value: 'All Active Electric Vehicles' },
          { label: 'Registered Units', value: isCC030.value ? '36 in Warehouse' : '20 in Showroom' },
          { label: 'Chassis Assigned', value: isCC030.value ? '36 Units' : '20 Units' },
          { label: 'Snapshot Date', value: 'Today 08:00' },
          { label: 'System Lock', value: 'No Lock during count' },
          { label: 'Location Filter', value: `${branchName} - ${isCC030.value ? 'Warehouse A' : 'Showroom'}` }
        ]
      }
    case 'Physical Count':
      return {
        title: 'Physical Count',
        items: [
          { label: 'Count Session', value: isCC030.value ? 'Scheduled (Not Started)' : 'Active Session #1' },
          { label: 'Count Method', value: 'Barcode / QR Scan + Visual' },
          { label: 'Units Scanned', value: isCC030.value ? '0 / 36' : '18 / 20' },
          { label: 'Time Started', value: isCC030.value ? 'Pending' : 'Today 09:30' },
          { label: 'Count Operator', value: `${branchName} Inventory Team` },
          { label: 'Verification Method', value: 'Double Blind Check' }
        ]
      }
    case 'Serialized Confirmation':
      return {
        title: 'Serialized Confirmation',
        items: [
          { label: 'Chassis Verified', value: isCC030.value ? '0 Confirmed' : '17 Confirmed' },
          { label: 'Tags Scanned', value: isCC030.value ? '0 Tags' : '18 Tags' },
          { label: 'Battery Serials', value: 'Checked at Inspection' },
          { label: 'Unregistered Tags', value: '0 Found' },
          { label: 'Relocated Units', value: isCC030.value ? '0' : '1 (in QC Bay)' },
          { label: 'Scan Integrity', value: '100% Validated' }
        ]
      }
    case 'Discrepancy':
      return {
        title: 'Discrepancy',
        items: [
          { label: 'Total Discrepancies', value: isCC030.value ? '0' : '1 Unit Variance' },
          { label: 'Missing Units', value: '0' },
          { label: 'Status Mismatch', value: isCC030.value ? '0' : '1 (QC status not posted)' },
          { label: 'Affected Model', value: isCC030.value ? 'None' : 'BRG X5' },
          { label: 'Resolution Path', value: 'Initiate Stock Adjustment' },
          { label: 'Audit Impact', value: 'Minor / Non-financial' }
        ]
      }
    case 'Notes':
      return {
        title: 'Notes',
        items: [
          { label: 'Count Notes', value: 'Showroom units rechecked after morning deliveries.' },
          { label: 'Author', value: 'Branch Inventory Lead' },
          { label: 'Logged At', value: 'Today 11:20' },
          { label: 'Supervisor Remarks', value: 'Discrepancy unit located in QC bay.' },
          { label: 'Attachments', value: 'Count_Log_Aug28.pdf' },
          { label: 'Total Notes', value: '1 Active Note' }
        ]
      }
    case 'Submit Count':
      return {
        title: 'Submit Count',
        items: [
          { label: 'Submission Status', value: isCC030.value ? 'Not Ready' : 'Ready for Sign-off' },
          { label: 'Approving Manager', value: `${branchName} Branch Manager` },
          { label: 'Reconciliation', value: 'Pending Final Submission' },
          { label: 'Variance Threshold', value: 'Within Tolerances (<2%)' },
          { label: 'Next Cycle', value: 'Weekly Showroom Count' },
          { label: 'Action', value: 'Sign and submit count' }
        ]
      }
    default:
      return {
        title: 'Count Summary',
        items: []
      }
  }
})

// Super Admin Data
const activeTab = ref('Count Summary')
const tabs = ['Count Summary', 'Expected Stock', 'Physical Count', 'Discrepancies', 'Adjustment Proposal', 'Approval', 'Activity']

const adminTabData = computed(() => {
  switch (activeTab.value) {
    case 'Count Summary':
      return {
        title: 'Executive Cycle Count Summary',
        items: [
          { label: 'Audit Reference', value: countId.value },
          { label: 'Branch Audit Location', value: 'Peshawar Main Showroom & Yard' },
          { label: 'Audit Scope', value: isCC030.value ? 'Warehouse Bulk Inventory' : 'Showroom Active Display Units' },
          { label: 'Total Expected Units', value: isCC030.value ? '36 Units' : '20 Units' },
          { label: 'Physically Verified', value: isCC030.value ? '0 Units (Scheduled)' : '18 Units Scanned' },
          { label: 'Exact Serial Matches', value: isCC030.value ? '0' : '17 Units' },
          { label: 'Discrepancy Count', value: isCC030.value ? '0' : '1 Unit Pending Review' },
          { label: 'Audit Progress', value: isCC030.value ? 'Scheduled' : '90% Complete' }
        ]
      }
    case 'Expected Stock':
      return {
        title: 'System Expected Inventory Baseline',
        items: [
          { label: 'Snapshot Timestamp', value: 'Today 08:00 AM' },
          { label: 'System Freeze', value: 'No Freeze (Live Ledger Audit)' },
          { label: 'Registered Chassis', value: isCC030.value ? '36 VINs on Ledger' : '20 VINs on Ledger' },
          { label: 'Product Breakdown', value: '12x E-125, 6x X5, 2x City Mini' },
          { label: 'Ledger Value', value: 'PKR 5.6M' },
          { label: 'Active Reservations', value: '3 Units Flagged for Delivery' }
        ]
      }
    case 'Physical Count':
      return {
        title: 'Physical Audit Execution & Tally',
        items: [
          { label: 'Primary Auditor', value: 'Asim Raza (Senior Inventory Auditor)' },
          { label: 'Verification Scanner', value: 'Wireless 2D Handheld Barcode Scanner' },
          { label: 'Chassis Inspected', value: 'Visual Stamp + QR Code Confirmation' },
          { label: 'Battery Packs Checked', value: 'Serial matched with vehicle pack' },
          { label: 'Start Time', value: 'Today 09:30 AM' },
          { label: 'Tally Integrity', value: 'Dual-Sign Count Sheet Completed' }
        ]
      }
    case 'Discrepancies':
      return {
        title: 'Variance & Discrepancy Diagnostics',
        items: [
          { label: 'Total Variance', value: isCC030.value ? '0 Units' : '1 Unit Location Mismatch' },
          { label: 'Affected Vehicle', value: isCC030.value ? 'None' : 'BRG X5 (CH8-BRG-26-00401)' },
          { label: 'Discrepancy Category', value: 'Relocated to Quarantine Bay (Not Sold/Missing)' },
          { label: 'Financial Impact', value: 'PKR 0 (Physical Unit Found & Verified)' },
          { label: 'Recommended Action', value: 'Update Bay Location in System' },
          { label: 'Root Cause', value: 'Transit damage isolation without location transfer posting' }
        ]
      }
    case 'Adjustment Proposal':
      return {
        title: 'Proposed Ledger Adjustment & Rebalancing',
        items: [
          { label: 'Adjustment Required', value: isCC030.value ? 'No Adjustment Needed' : 'Location Bay Adjustment Only' },
          { label: 'Quantity Delta', value: '0 Units (Physical inventory matches ledger total)' },
          { label: 'Value Adjustment', value: 'PKR 0' },
          { label: 'Proposed GL Account', value: 'Inventory Rebalancing (Internal)' },
          { label: 'Adjustment Reference', value: `ADJ-PROP-${countId.value}` },
          { label: 'Status', value: 'Ready for Approving Authority' }
        ]
      }
    case 'Approval':
      return {
        title: 'Management Review & Sign-Off Matrix',
        items: [
          { label: 'Branch Inventory Lead', value: 'Signed & Submitted (09:45)' },
          { label: 'Branch Manager', value: 'Verified & Endorsed' },
          { label: 'Head Office Inventory Auditor', value: 'Review In Progress' },
          { label: 'Chief Financial Officer', value: 'Threshold Notification Issued' },
          { label: 'Audit Sign-Off Date', value: 'Pending Final Reconciliation' },
          { label: 'Approval Status', value: 'Ready for Executive Close' }
        ]
      }
    case 'Activity': {
      const logs = store.getAuditLogsForEntity('inventory_cycle_count', countId.value)
      const items = logs.length > 0 
        ? logs.map(l => ({
            label: l.timestamp || 'Recorded',
            value: `${l.action || l.operation}: ${l.description || l.result} (${l.user || l.actor_name || 'System'})`
          }))
        : [
            { label: 'Today 11:20', value: 'Showroom count session completed; 18 units verified' },
            { label: 'Today 09:30', value: 'Physical cycle count initiated on showroom floor' },
            { label: 'Today 08:00', value: 'Inventory ledger snapshot generated for CC-031' },
            { label: 'Audit Seal', value: 'Count recorded in permanent operational log' }
          ]
      return {
        title: 'Audit Trail & Event Log',
        items
      }
    }
    default:
      return {
        title: 'Count Summary',
        items: []
      }
  }
})
</script>

<template>
  <!-- BRANCH MANAGER VIEW -->
  <div v-if="isBranchUser" class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[11px] text-gray-400 mb-1">
          Branch Manager / Cycle Counts / <span class="font-medium text-gray-600">Cycle Count {{ countId }}</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Cycle Count {{ countId }}</h1>
        <p class="text-xs text-gray-500 mt-1">Expected inventory, physical confirmation, discrepancy and count submission.</p>
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

    <!-- Tab Content: Left Box (Data) & Right Box (Branch context) -->
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
              <span class="text-[10px] font-medium text-gray-400">Assignee</span>
              <span class="text-sm font-bold text-gray-900 mt-1">Branch Team</span>
            </div>
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Due</span>
              <span class="text-sm font-bold text-gray-900 mt-1">{{ isCC030 ? '30 Aug' : 'Today' }}</span>
            </div>
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Notes</span>
              <span class="text-sm font-bold text-gray-900 mt-1">1</span>
            </div>
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Submit</span>
              <span class="text-sm font-bold text-gray-900 mt-1">Pending</span>
            </div>
          </div>
        </div>
        
        <p class="text-[11px] text-gray-400 font-medium mt-3 px-1">
          Only {{ user?.branchName || 'Peshawar' }} Branch operational data is shown.
        </p>
      </div>
    </div>
  </div>

  <!-- SUPER ADMIN VIEW -->
  <div v-else class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Inventory / Cycle Counts / <span class="font-bold text-gray-800">Cycle Count Detail — {{ activeTab }}</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Cycle Count Detail — {{ activeTab }}</h1>
        <p class="text-sm text-gray-500 mt-1">CC-091 - {{ activeTab }}</p>
      </div>
    </div>

    <!-- Overview Card -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <h2 class="text-[22px] font-bold text-gray-900">CC-091</h2>
        <p class="text-[11px] text-gray-500 mt-1 font-medium">Peshawar &middot; Main Showroom</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <span class="inline-flex items-center px-2 py-1 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">
          Review
        </span>
        <button class="px-4 py-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          Review Count
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
  </div>
</template>
