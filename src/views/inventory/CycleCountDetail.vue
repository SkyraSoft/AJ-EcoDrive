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
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">{{ activeTab }}</h3>
        <p class="text-[12px] text-gray-600">Cycle count records for CC-091.</p>
      </div>
    </div>
  </div>
</template>
