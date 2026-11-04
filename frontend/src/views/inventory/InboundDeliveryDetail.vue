<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { store } from '../../store.js'
import { Plus } from 'lucide-vue-next'
import NotFoundState from '@/components/common/NotFoundState.vue'

const route = useRoute()
const router = useRouter()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

// Dynamic Inbound Lookup
const inboundId = computed(() => route.params.id || route.query.id || '')
const matchedTransfer = computed(() => inboundId.value ? store.getTransferById(inboundId.value) : null)
const matchedPO = computed(() => inboundId.value ? (store.purchaseOrders?.find(p => p.id === inboundId.value || p.po === inboundId.value || p.po_number === inboundId.value)) : null)
const isTransfer = computed(() => !!matchedTransfer.value || String(inboundId.value).startsWith('TR-'))

const isValidInbound = computed(() => {
  if (!inboundId.value) return false
  if (matchedTransfer.value || matchedPO.value) return true
  return ['INB-088', 'INB-091', 'INB-085', 'INB-082', 'PO-181', 'PO-188'].includes(inboundId.value) || inboundId.value.length > 2
})

const isINB088 = computed(() => inboundId.value === 'INB-088')
const branchCurrentTab = ref('Summary')
const branchTabs = ['Summary', 'Items & Units', 'Inspection', 'Receiving', 'Discrepancies', 'Documents', 'Activity']

const branchTabData = computed(() => {
  const branchName = user.value?.branchName || 'Peshawar'
  const poRef = matchedTransfer.value?.transferNumber || matchedPO.value?.po || (isINB088.value ? 'PO-181' : 'PO-188')
  const supplierName = matchedPO.value?.supplier || (matchedTransfer.value ? `${matchedTransfer.value.from} Depot (Transfer)` : 'BRG Supply')
  const expectedDate = matchedPO.value?.expected || (matchedTransfer.value?.dispatched_at ? new Date(matchedTransfer.value.dispatched_at).toLocaleDateString() : (isINB088.value ? '28 Aug' : 'Today'))
  const destBranch = matchedTransfer.value?.to || matchedPO.value?.branch || `${branchName} Branch`
  const statusStr = matchedTransfer.value?.status || matchedPO.value?.status || (isINB088.value ? 'Awaiting Receive' : 'In Transit')
  const totalUnits = matchedTransfer.value?.units || matchedTransfer.value?.totalUnits || matchedPO.value?.totalOrdered || 2

  switch (branchCurrentTab.value) {
    case 'Summary':
      return {
        title: 'Summary',
        items: [
          { label: 'Inbound', value: inboundId.value },
          { label: isTransfer.value ? 'Transfer Reference' : 'PO Reference', value: poRef },
          { label: isTransfer.value ? 'Origin Facility' : 'Supplier', value: supplierName },
          { label: 'Expected Date', value: expectedDate },
          { label: 'Destination', value: destBranch },
          { label: 'Status', value: statusStr }
        ]
      }
    case 'Items & Units':
      return {
        title: 'Items & Units',
        items: [
          { label: 'Expected Products', value: `${totalUnits} Units Assigned` },
          { label: 'Total Units', value: String(totalUnits) },
          { label: 'Serialized Tracking', value: `${totalUnits} / ${totalUnits} Serialized` },
          { label: 'Consignment Ref', value: matchedTransfer.value?.transferNumber || matchedPO.value?.po || 'BAT-2024-SUP-09' },
          { label: 'Packaging', value: `${totalUnits} Standard Crates / Secured Fleet` },
          { label: 'Unit Cost Scope', value: 'Restricted (HQ Procurement)' }
        ]
      }
    case 'Inspection':
      return {
        title: 'Inspection',
        items: [
          { label: 'Inspection Status', value: statusStr === 'Received' ? 'Completed' : 'Pending on Arrival' },
          { label: 'Required Checks', value: 'Visual, Battery, Frame, Odometer' },
          { label: 'Logistics Documentation', value: isTransfer.value ? 'Inter-Branch Transfer Manifest & Gate Pass' : 'Goods Receipt Note & Bilty' },
          { label: 'Assigned Inspector', value: `${branchName} QC Lead` },
          { label: 'QC Standard', value: 'Zero Tolerance Discrepancy Policy' },
          { label: 'Condition', value: 'Good' }
        ]
      }
    case 'Receiving':
      return {
        title: 'Receiving',
        items: [
          { label: 'Receiving Status', value: statusStr },
          { label: 'Expected Arrival', value: expectedDate },
          { label: 'Receiving Location', value: `${branchName} Delivery Bay` },
          { label: 'Assigned Receiver', value: `${branchName} Branch Manager` },
          { label: 'Carrier / Logistics', value: matchedTransfer.value?.carrier || 'AJ Express Fleet' },
          { label: 'Challan / Gate Pass', value: matchedTransfer.value?.gate_pass_number || 'GP-INB-091' }
        ]
      }
    case 'Discrepancies':
      return {
        title: 'Discrepancies',
        items: [
          { label: 'Discrepancies Recorded', value: matchedTransfer.value?.discrepancy_notes ? 'Discrepancy Reported' : 'None' },
          { label: 'Notes', value: matchedTransfer.value?.discrepancy_notes || 'All items intact' },
          { label: 'Shortage', value: '0' },
          { label: 'Damaged Units', value: '0' },
          { label: 'Report Status', value: 'Clear' },
          { label: 'Resolution Note', value: 'No active claim required' }
        ]
      }
    case 'Documents':
      return {
        title: 'Documents',
        items: [
          { label: isTransfer.value ? 'Transfer Manifest' : 'PO Document', value: `${poRef}.pdf (Approved)` },
          { label: 'Gate Pass', value: matchedTransfer.value?.gate_pass_number || 'GP-INB-091.pdf' },
          { label: 'Inspection Checklist', value: 'QC-CHECK-v2.pdf' },
          { label: 'Attached Photos', value: '2 Images attached' },
          { label: 'Total Verified', value: '2 Documents' },
          { label: 'Audit Seal', value: 'Verified Digital Hash' }
        ]
      }
    case 'Activity':
      return {
        title: 'Activity',
        items: [
          { label: 'Latest Milestone', value: `Consignment status: ${statusStr}` },
          { label: 'Gate Pass Issuance', value: 'Gate pass generated & sealed' },
          { label: 'Authorization', value: 'Approved for branch transit' },
          { label: 'Current Stage', value: statusStr },
          { label: 'Logged By', value: 'System Logistics Integration' },
          { label: 'Audit Trail', value: 'Immutable Ledger Record' }
        ]
      }
    default:
      return {
        title: 'Summary',
        items: []
      }
  }
})

const handleReceiveNavigation = () => {
  if (isTransfer.value) {
    router.push(`/inventory/transfers/receive?id=${inboundId.value}`)
  } else {
    router.push(`/procurement/receipts/new?po_id=${inboundId.value}`)
  }
}
</script>

<template>
  <NotFoundState
    v-if="!isValidInbound"
    title="Inbound Delivery Not Found"
    message="The requested inbound delivery could not be found or is not accessible from your current branch context."
    back-link="/inventory/inbound-deliveries"
    back-text="Back to Inbound Deliveries"
  />
  <div v-else class="max-w-[1400px] mx-auto space-y-6 pb-12">
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
        @click="handleReceiveNavigation" 
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
