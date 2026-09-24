<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { store } from '../../store.js'
import { Plus } from 'lucide-vue-next'
import CreateQuarantineRecordModal from './CreateQuarantineRecord.vue'

const route = useRoute()
const router = useRouter()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)
const showCreateModal = ref(false)

// Branch Manager Data & Logic
const unitId = computed(() => route.params.id || route.query.id || 'M3-01014')
const isX5 = computed(() => unitId.value === 'X5-00401')
const branchCurrentTab = ref('Summary')
const branchTabs = ['Summary', 'Defect & Condition', 'Evidence & Inspection', 'Disposition & Approval', 'Activity & History']

const branchTabData = computed(() => {
  const branchName = user.value?.branchName || 'Peshawar'

  switch (branchCurrentTab.value) {
    case 'Summary':
      return {
        title: 'Summary',
        items: [
          { label: 'Unit', value: isX5.value ? 'X5-00401' : 'M3-01014' },
          { label: 'Product', value: isX5.value ? 'BRG X5' : 'BRG M3' },
          { label: 'Condition', value: isX5.value ? 'Body panel dent' : 'Packaging damage' },
          { label: 'Source', value: isX5.value ? 'Inbound INB-083' : 'TR-221' },
          { label: 'Decision', value: isX5.value ? 'Supplier-return review' : 'QC / service' },
          { label: 'Status', value: isX5.value ? 'Decision Pending' : 'Quarantine' }
        ]
      }
    case 'Defect & Condition':
      return {
        title: 'Defect & Condition',
        items: [
          { label: 'Defect Classification', value: isX5.value ? 'Exterior Panel Cosmetic Damage' : 'Transit Packaging & Casing Damage' },
          { label: 'Severity Level', value: isX5.value ? 'Moderate (Surface Dent)' : 'Low (Protective Packaging Only)' },
          { label: 'Physical Location', value: `${branchName} - Quarantine QC Bay 2` },
          { label: 'Isolation Status', value: 'Quarantine Lock Active' },
          { label: 'Drive / Operable State', value: isX5.value ? 'Operable (Awaiting Bodywork)' : 'Fully Functional (Repack Needed)' },
          { label: 'Safety Hazard', value: 'None Reported' }
        ]
      }
    case 'Evidence & Inspection':
      return {
        title: 'Evidence & Inspection',
        items: [
          { label: 'Attached Inspection', value: isX5.value ? 'Panel_Dent_Photo_01.jpg' : 'Packaging_Tear_Log.pdf' },
          { label: 'Inspected By', value: `${branchName} QC Specialist` },
          { label: 'Inspection Timestamp', value: 'Today 10:15' },
          { label: 'Physical Findings', value: isX5.value ? '3cm dent on right rear door panel' : 'Outer carton torn during transit unloading' },
          { label: 'Checklist Signed', value: 'Yes (100% Passed Safety)' },
          { label: 'Supporting Files', value: '2 Files Attached' }
        ]
      }
    case 'Disposition & Approval':
      return {
        title: 'Disposition & Approval',
        items: [
          { label: 'Proposed Disposition', value: isX5.value ? 'Supplier Return / Warranty Claim' : 'Internal Service & Re-pack' },
          { label: 'Assigned Service Bay', value: isX5.value ? 'Supplier RMA Dept' : `${branchName} Service Center` },
          { label: 'Approving Authority', value: 'Central HQ QC Lead' },
          { label: 'Estimated Turnaround', value: isX5.value ? '3-5 Business Days' : '24 Hours' },
          { label: 'Cost Allocation', value: isX5.value ? 'Supplier Inbound Claim' : 'Internal Logistics' },
          { label: 'Disposition Status', value: isX5.value ? 'Awaiting HQ Sign-off' : 'Approved for Service' }
        ]
      }
    case 'Activity & History':
      return {
        title: 'Activity & History',
        items: [
          { label: '10:45', value: 'Unit isolated to Quarantine QC Bay' },
          { label: '10:15', value: 'Defect report & photos uploaded' },
          { label: '09:30', value: 'Damage identified during delivery receipt' },
          { label: 'Current State', value: isX5.value ? 'Decision Pending' : 'Quarantine Active' },
          { label: 'Logged By', value: 'Branch Inventory System' },
          { label: 'Isolation Tag', value: `QR-${unitId.value}-HOLD` }
        ]
      }
    default:
      return {
        title: 'Summary',
        items: []
      }
  }
})

// Super Admin Data
const activeTab = ref('Quarantine Overview')
const tabs = ['Quarantine Overview', 'Defect Analysis', 'Disposition', 'Supplier Claim', 'Approval', 'Activity']

const adminTabData = computed(() => {
  switch (activeTab.value) {
    case 'Quarantine Overview':
      return {
        title: 'Executive Quarantine Overview',
        items: [
          { label: 'Unit Reference', value: unitId.value },
          { label: 'Product Model', value: isX5.value ? 'BRG X5 Heavy Scooter' : 'BRG M3 Urban EV' },
          { label: 'Branch Location', value: 'Peshawar Central Showroom' },
          { label: 'Chassis / Serial', value: `CH8-PK-2026-${unitId.value}` },
          { label: 'Current State', value: 'Quarantine Hold Active' },
          { label: 'Source Event', value: isX5.value ? 'Inbound Container INB-083' : 'Branch Transfer TR-221' },
          { label: 'Estimated Unit Cost', value: 'PKR 142,000' },
          { label: 'Floor Isolation', value: 'Bay 2 (Restricted Secure Area)' }
        ]
      }
    case 'Defect Analysis':
      return {
        title: 'Technical Defect Inspection & Diagnostics',
        items: [
          { label: 'Defect Category', value: isX5.value ? 'Cosmetic Panel Dent & Scratch' : 'Transit Casing & Outer Cracking' },
          { label: 'Severity Rating', value: 'Moderate - Non-Structural' },
          { label: 'Battery Integrity Test', value: 'Passed 100% (No Cell Damage)' },
          { label: 'Electrical Diagnostics', value: 'Passed (Controller & Wiring Intact)' },
          { label: 'Inspection Specialist', value: 'Tariq Mehmood (Senior QC Engineer)' },
          { label: 'Photographic Evidence', value: '4 High-Res Images Logged' }
        ]
      }
    case 'Disposition':
      return {
        title: 'Proposed & Approved Disposition Workflow',
        items: [
          { label: 'Recommended Action', value: isX5.value ? 'Supplier Return & RMA Replacement' : 'Internal Workshop Reconditioning' },
          { label: 'Estimated Repair Cost', value: isX5.value ? 'PKR 0 (Supplier Liability)' : 'PKR 12,500 (Parts & Labour)' },
          { label: 'Target Completion', value: 'Within 3 Business Days' },
          { label: 'Re-entry Target', value: 'Refurbished Grade A Showroom Stock' },
          { label: 'Disposition Authority', value: 'Central Technical Director' },
          { label: 'Insurance Notification', value: 'Not Required (Under Threshold)' }
        ]
      }
    case 'Supplier Claim':
      return {
        title: 'Supplier Warranty & Transit Claim Tracking',
        items: [
          { label: 'Supplier Name', value: 'BRG Electric Vehicles Ltd.' },
          { label: 'RMA Case Reference', value: `RMA-${unitId.value}-2026` },
          { label: 'Claim Amount', value: 'PKR 142,000 (Full Inbound Credit)' },
          { label: 'Carrier Transit Slip', value: 'BL-EXP-088192-KHI' },
          { label: 'Supplier Response SLA', value: '48 Hours' },
          { label: 'Debit Note Reference', value: 'DN-2026-0041' }
        ]
      }
    case 'Approval':
      return {
        title: 'Management Approval & Sign-Off Matrix',
        items: [
          { label: 'Showroom QC Lead', value: 'Approved (Inspection Confirmed)' },
          { label: 'Branch Manager Sign-off', value: 'Approved & Isolated' },
          { label: 'Central Inventory Controller', value: 'Pending Final Disposition Review' },
          { label: 'Head of Operations', value: 'Notification Dispatched' },
          { label: 'Financial Write-down', value: 'Zero Loss Anticipated (Recoverable)' },
          { label: 'Approval Status', value: 'Under Executive Review' }
        ]
      }
    case 'Activity': {
      const logs = store.getAuditLogsForEntity('inventory_quarantine', unitId.value)
      const items = logs.length > 0 
        ? logs.map(l => ({
            label: l.timestamp || 'Recorded',
            value: `${l.action || l.operation}: ${l.description || l.result} (${l.user || l.actor_name || 'System'})`
          }))
        : [
            { label: 'Today 11:00', value: 'Unit physical inspection report signed by QC engineer' },
            { label: 'Today 10:45', value: 'Quarantine lock and serial tag QR-HOLD applied to vehicle' },
            { label: 'Today 09:30', value: 'Unit received with transit packaging defects from delivery receipt' },
            { label: 'Security Stamp', value: 'Physical tag attached to handlebar & battery compartment' }
          ]
      return {
        title: 'Quarantine Event Audit History',
        items
      }
    }
    default:
      return {
        title: 'Summary',
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
          Branch Manager / Damaged / Quarantine / <span class="font-medium text-gray-600">Unit {{ unitId }}</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Quarantine Unit {{ unitId }}</h1>
        <p class="text-xs text-gray-500 mt-1">Affected unit inspection, quarantine status and disposition details — {{ branchCurrentTab }}.</p>
      </div>
      <div class="flex items-center gap-2">
        <button 
          @click="router.push('/inventory/quarantine')" 
          class="bg-white border border-gray-200 text-gray-700 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
        >
          Back to List
        </button>
        <button 
          @click="showCreateModal = true" 
          class="bg-[#165A31] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <Plus class="w-4 h-4" /> <span>Report Unit</span>
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
              <span class="text-sm font-bold text-gray-900 mt-1">Today</span>
            </div>
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Notes</span>
              <span class="text-sm font-bold text-gray-900 mt-1">1</span>
            </div>
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Submit</span>
              <span class="text-sm font-bold text-gray-900 mt-1">{{ isX5 ? 'Pending Review' : 'Quarantined' }}</span>
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
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Inventory / Damaged / Quarantine / <span class="font-bold text-gray-800">Unit Detail — {{ activeTab }}</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Quarantine Unit {{ unitId }}</h1>
        <p class="text-sm text-gray-500 mt-1">{{ unitId }} - {{ activeTab }}</p>
      </div>
    </div>

    <!-- Overview Card -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <h2 class="text-[22px] font-bold text-gray-900">{{ unitId }}</h2>
        <p class="text-[11px] text-gray-500 mt-1 font-medium">Peshawar &middot; BRG M3</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <span class="inline-flex items-center px-2 py-1 rounded-[4px] text-[10px] font-bold bg-amber-50 text-amber-700">
          Quarantine
        </span>
        <button class="px-4 py-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          Disposition Review
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

  <!-- Create Quarantine Modal Popup -->
  <CreateQuarantineRecordModal 
    v-if="showCreateModal" 
    :is-modal="true" 
    @close="showCreateModal = false" 
  />
</template>
