<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { store } from '../../store.js'
import { Plus } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

// Branch Manager Data & Logic
const inboundId = computed(() => route.params.id || route.query.id || 'INB-091')
const isINB088 = computed(() => inboundId.value === 'INB-088')
const branchCurrentTab = ref('Summary')
const branchTabs = ['Summary', 'Items & Units', 'Inspection', 'Receiving', 'Discrepancies', 'Documents', 'Activity']

const branchTabData = computed(() => {
  const branchName = user.value?.branchName || 'Peshawar'

  switch (branchCurrentTab.value) {
    case 'Summary':
      return {
        title: 'Summary',
        items: [
          { label: 'Inbound', value: inboundId.value },
          { label: 'PO Reference', value: isINB088.value ? 'PO-181' : 'PO-188' },
          { label: 'Supplier', value: 'BRG Supply' },
          { label: 'Expected Date', value: isINB088.value ? '28 Aug' : 'Today' },
          { label: 'Destination', value: `${branchName} Branch` },
          { label: 'Status', value: isINB088.value ? 'Awaiting Receive' : 'In Transit' }
        ]
      }
    case 'Items & Units':
      return {
        title: 'Items & Units',
        items: [
          { label: 'Expected Products', value: isINB088.value ? 'BRG M3 × 2' : 'BRG E9 Pro × 2' },
          { label: 'Total Units', value: '2' },
          { label: 'Serialized Tracking', value: '2 / 2 Serialized' },
          { label: 'Source Batch', value: 'BAT-2024-SUP-09' },
          { label: 'Packaging', value: '2 Standard Crates' },
          { label: 'Unit Cost Scope', value: 'Restricted (HQ Procurement)' }
        ]
      }
    case 'Inspection':
      return {
        title: 'Inspection',
        items: [
          { label: 'Inspection Status', value: isINB088.value ? 'Pending Physical Check' : 'Pending on Arrival' },
          { label: 'Required Checks', value: 'Visual, Battery, Frame' },
          { label: 'Photos Required', value: '2 Attached' },
          { label: 'Assigned Inspector', value: `${branchName} QC Lead` },
          { label: 'QC Standard', value: 'Zero Tolerance Policy' },
          { label: 'Condition', value: 'Good' }
        ]
      }
    case 'Receiving':
      return {
        title: 'Receiving',
        items: [
          { label: 'Receiving Status', value: isINB088.value ? 'Awaiting Receive' : 'In Transit' },
          { label: 'Expected Arrival', value: isINB088.value ? '28 Aug 15:00' : 'Today 17:30' },
          { label: 'Receiving Location', value: 'Warehouse A' },
          { label: 'Assigned Receiver', value: 'Branch Manager' },
          { label: 'Logistics Fleet', value: 'BRG Dedicated Fleet' },
          { label: 'Challan / Waybill', value: 'DC-SUP-9104' }
        ]
      }
    case 'Discrepancies':
      return {
        title: 'Discrepancies',
        items: [
          { label: 'Discrepancies Recorded', value: 'None' },
          { label: 'Shortage', value: '0' },
          { label: 'Overage', value: '0' },
          { label: 'Damaged Units', value: '0' },
          { label: 'Report Status', value: 'Clear' },
          { label: 'Resolution Note', value: 'No active claim required' }
        ]
      }
    case 'Documents':
      return {
        title: 'Documents',
        items: [
          { label: 'PO Document', value: isINB088.value ? 'PO-181.pdf (Approved)' : 'PO-188.pdf (Approved)' },
          { label: 'Delivery Challan', value: 'DC-SUP-9104.pdf' },
          { label: 'Gate Pass', value: 'GP-INB-091.pdf' },
          { label: 'Inspection Checklist', value: 'QC-CHECK-v2.pdf' },
          { label: 'Attached Photos', value: '2 Images attached' },
          { label: 'Total Verified', value: '2 Documents' }
        ]
      }
    case 'Activity':
      return {
        title: 'Activity',
        items: [
          { label: 'Latest Milestone', value: 'Shipment dispatched by supplier hub' },
          { label: 'Gate Pass Issuance', value: 'Gate pass generated & sealed' },
          { label: 'PO Approval', value: 'PO approved for dispatch' },
          { label: 'Order Scheduling', value: 'Supplier delivery order confirmed' },
          { label: 'Current Stage', value: isINB088.value ? 'Awaiting Receive' : 'In Transit (On Schedule)' },
          { label: 'Logged By', value: 'System Logistics Integration' }
        ]
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
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[11px] text-gray-400 mb-1">
          Branch Manager / Inbound Deliveries / <span class="font-medium text-gray-600">Inbound Delivery {{ inboundId }}</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Inbound Delivery {{ inboundId }}</h1>
        <p class="text-xs text-gray-500 mt-1">Inbound delivery detail — {{ branchCurrentTab }}.</p>
      </div>
      <button 
        @click="router.push(`/inventory/inbound-deliveries/receive?id=${inboundId}`)" 
        class="bg-[#165A31] text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer"
      >
        <Plus class="w-4 h-4" /> <span>Receive Delivery</span>
      </button>
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
              <span class="text-[10px] font-medium text-gray-400">PO Reference</span>
              <span class="text-sm font-bold text-gray-900 mt-1">{{ isINB088 ? 'PO-181' : 'PO-188' }}</span>
            </div>
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Expected</span>
              <span class="text-sm font-bold text-gray-900 mt-1">{{ isINB088 ? '28 Aug' : 'Today' }}</span>
            </div>
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Discrepancies</span>
              <span class="text-sm font-bold text-gray-900 mt-1">None</span>
            </div>
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Documents</span>
              <span class="text-sm font-bold text-gray-900 mt-1">2</span>
            </div>
          </div>
        </div>
        
        <p class="text-[11px] text-gray-400 font-medium mt-3 px-1">
          Only {{ user?.branchName || 'Peshawar' }} Branch operational data is shown.
        </p>
      </div>
    </div>
  </div>
</template>
