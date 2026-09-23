<script setup>
import { ArrowLeft, CheckCircle2, AlertTriangle, ShieldCheck, FileText, Package, Eye } from 'lucide-vue-next'
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { store } from '../../store.js'

const router = useRouter()
const route = useRoute()

const receiptId = computed(() => route.params.id || route.query.id || 'GR-991')

const receipt = computed(() => {
  return store.getReceiptById(receiptId.value) || store.receipts[0] || {
    id: 'GR-991',
    receipt_id: 'GR-991',
    po_id: 'PO-2048',
    po: 'PO-2048',
    supplier: 'BRG Factory',
    branch: 'Peshawar',
    receipt_date: '2026-08-29',
    received_by: 'Ahsan Khan',
    status: 'Posted',
    notes: 'Consignment received at bay 1 and verified.',
    lines: [
      { product: 'BRG DS11', ordered_quantity: 8, previously_received_quantity: 0, current_received_quantity: 8, short_quantity: 0, excess_quantity: 0, damaged_quantity: 0, accepted_quantity: 8, status: 'Complete' },
      { product: 'BRG EV-5', ordered_quantity: 5, previously_received_quantity: 0, current_received_quantity: 5, short_quantity: 0, excess_quantity: 0, damaged_quantity: 0, accepted_quantity: 5, status: 'Complete' },
      { product: 'Cargo Pro', ordered_quantity: 3, previously_received_quantity: 0, current_received_quantity: 3, short_quantity: 0, excess_quantity: 0, damaged_quantity: 0, accepted_quantity: 3, status: 'Complete' }
    ],
    serializedUnits: [
      { product: 'BRG DS11', serial: 'DS11-01001', chassis: 'CH-90111', condition: 'Good', qc: 'Pass', status: 'Available' },
      { product: 'BRG EV-5', serial: 'EVS-00441', chassis: 'CH-81104', condition: 'Good', qc: 'Pass', status: 'Available' }
    ],
    qcRecords: [
      { serial: 'CH-90111', check: 'Visual + Functional EV Diagnostic', finding: 'Pass (100%)', decision: 'Pass', inspector: 'Ahsan Khan' },
      { serial: 'CH-81104', check: 'Visual + Functional EV Diagnostic', finding: 'Pass (100%)', decision: 'Pass', inspector: 'Ahsan Khan' }
    ]
  }
})

const activeTab = ref('Summary')
const tabs = ['Summary', 'Received Lines', 'Serial & Chassis Units', 'Discrepancies', 'QC', 'Costs', 'Documents', 'Activity']

// Calculated receipt statistics
const totalUnitsReceived = computed(() => {
  if (!receipt.value?.lines) return 0
  return receipt.value.lines.reduce((s, l) => s + (l.current_received_quantity || l.received || 0), 0)
})

const totalUnitsAccepted = computed(() => {
  if (!receipt.value?.lines) return 0
  return receipt.value.lines.reduce((s, l) => s + (l.accepted_quantity ?? (l.current_received_quantity - (l.damaged_quantity || 0)) ?? 0), 0)
})

const totalUnitsDamaged = computed(() => {
  if (!receipt.value?.lines) return 0
  return receipt.value.lines.reduce((s, l) => s + (l.damaged_quantity || 0), 0)
})

const totalDiscrepancies = computed(() => {
  if (!receipt.value?.lines) return 0
  return receipt.value.lines.filter(l => (l.short_quantity > 0 || l.excess_quantity > 0 || l.damaged_quantity > 0)).length
})

const discrepanciesList = computed(() => {
  if (!receipt.value?.lines) return []
  return receipt.value.lines.filter(l => (l.short_quantity > 0 || l.excess_quantity > 0 || l.damaged_quantity > 0))
})

const documents = computed(() => [
  { name: `Delivery_Note_${receipt.value.po_id || receipt.value.po}.pdf`, type: 'Delivery Note', uploaded: receipt.value.receipt_date },
  { name: `GRN_${receipt.value.id}.pdf`, type: 'Goods Receipt Note', uploaded: receipt.value.receipt_date }
])

const activities = computed(() => [
  { text: `GRN ${receipt.value.id} posted into ${receipt.value.branch} inventory`, date: receipt.value.receipt_date },
  { text: `QC and physical inspection completed by ${receipt.value.received_by || receipt.value.receiver}`, date: receipt.value.receipt_date },
  { text: `Delivery consignment received for ${receipt.value.po_id || receipt.value.po}`, date: receipt.value.receipt_date }
])

const openPo = () => {
  if (receipt.value?.po_id || receipt.value?.po) {
    router.push(`/procurement/purchase-orders/${receipt.value.po_id || receipt.value.po}`)
  } else {
    router.push('/procurement/purchase-orders')
  }
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1 flex items-center gap-1">
          <router-link to="/procurement/purchase-orders" class="hover:underline">Procurement</router-link>
          <span>/</span>
          <router-link :to="`/procurement/purchase-orders/${receipt.po_id || receipt.po}`" class="hover:underline">{{ receipt.po_id || receipt.po }}</router-link>
          <span>/</span>
          <span class="font-bold text-gray-800">GRN {{ receipt.id }}</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Goods Receipt {{ receipt.id }}</h1>
        <p class="text-sm text-gray-500 mt-1">Inwarded against {{ receipt.po_id || receipt.po }} &bull; {{ receipt.branch }} Branch</p>
      </div>

      <div class="flex items-center gap-3">
        <button 
          @click="openPo" 
          class="px-4 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-1.5"
        >
          <ArrowLeft class="w-3.5 h-3.5" /> Back to PO
        </button>
      </div>
    </div>

    <!-- PO Overview Card -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="flex items-center gap-3">
          <h2 class="text-[22px] font-bold text-gray-900">{{ receipt.id }}</h2>
          <span 
            class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold"
            :class="receipt.status === 'Posted' ? 'bg-[#eefcf2] text-[#165A31]' : 'bg-gray-100 text-gray-700'"
          >
            {{ receipt.status }}
          </span>
        </div>
        <p class="text-[11px] text-gray-500 mt-1 font-medium">PO: <strong class="text-gray-900">{{ receipt.po_id || receipt.po }}</strong> &bull; Supplier: <strong class="text-gray-900">{{ receipt.supplier }}</strong> &bull; Destination: {{ receipt.branch }}</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <button 
          @click="openPo" 
          class="px-4 py-1.5 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-1.5"
        >
          <Eye class="w-3.5 h-3.5" /> Open PO
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex items-center gap-6 border-b border-gray-100 overflow-x-auto pb-[1px]">
      <button 
        v-for="tab in tabs" 
        :key="tab"
        @click="activeTab = tab"
        class="pb-3 text-[11px] font-bold tracking-wider relative transition-colors whitespace-nowrap cursor-pointer"
        :class="activeTab === tab ? 'text-[#165A31]' : 'text-gray-400 hover:text-gray-600'"
      >
        {{ tab }}
        <div v-if="activeTab === tab" class="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#165A31] rounded-t-full"></div>
      </button>
    </div>

    <!-- Tab Content -->
    <div class="space-y-6">
      
      <!-- Tab Content: Summary -->
      <template v-if="activeTab === 'Summary'">
        <!-- KPI Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">Total Received</div>
            <div class="text-[22px] font-bold text-blue-700 leading-none">{{ totalUnitsReceived }}</div>
          </div>
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">Accepted into Stock</div>
            <div class="text-[22px] font-bold text-[#165A31] leading-none">{{ totalUnitsAccepted }}</div>
          </div>
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">Damaged / QC Hold</div>
            <div class="text-[22px] font-bold text-red-600 leading-none">{{ totalUnitsDamaged }}</div>
          </div>
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">Discrepancy Items</div>
            <div class="text-[22px] font-bold text-amber-600 leading-none">{{ totalDiscrepancies }}</div>
          </div>
        </div>

        <!-- Summary Details -->
        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
          <h3 class="text-[14px] font-bold text-gray-900 mb-6">Receipt Metadata</h3>
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px]">
              <span class="text-gray-500 font-medium">Purchase Order</span>
              <span class="font-bold text-gray-900 cursor-pointer hover:underline" @click="openPo">{{ receipt.po_id || receipt.po }}</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px]">
              <span class="text-gray-500 font-medium">Supplier</span>
              <span class="font-bold text-gray-900">{{ receipt.supplier }}</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px]">
              <span class="text-gray-500 font-medium">Receiver</span>
              <span class="font-bold text-gray-900">{{ receipt.received_by || receipt.receiver }}</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px]">
              <span class="text-gray-500 font-medium">Receipt Date</span>
              <span class="font-bold text-gray-900">{{ receipt.receipt_date }}</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px]">
              <span class="text-gray-500 font-medium">Inspection Notes</span>
              <span class="font-medium text-gray-700 max-w-lg text-right">{{ receipt.notes || 'Goods receipt verified and posted into branch inventory.' }}</span>
            </div>
          </div>
        </div>
      </template>

      <!-- Tab Content: Received Lines -->
      <div v-else-if="activeTab === 'Received Lines'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-[14px] font-bold text-gray-900">Inwarded Line Items</h3>
          <span class="text-xs text-gray-500">Total Lines: <strong>{{ receipt.lines?.length || 0 }}</strong></span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase">
                <th class="px-5 py-3">Product</th>
                <th class="px-4 py-3 text-center">Ordered</th>
                <th class="px-4 py-3 text-center">Prev. Received</th>
                <th class="px-4 py-3 text-center">Received</th>
                <th class="px-4 py-3 text-center">Accepted</th>
                <th class="px-4 py-3 text-center">Short</th>
                <th class="px-4 py-3 text-center">Excess</th>
                <th class="px-4 py-3 text-center">Damaged</th>
                <th class="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="(line, i) in (receipt.lines || [])" :key="i" class="hover:bg-gray-50/50">
                <td class="px-5 py-3.5 font-semibold text-gray-900">
                  <div>{{ line.product }}</div>
                  <div v-if="line.discrepancy_reason" class="text-[10px] text-amber-700 font-normal">Reason: {{ line.discrepancy_reason }}</div>
                </td>
                <td class="px-4 py-3.5 text-center text-gray-600">{{ line.ordered_quantity }}</td>
                <td class="px-4 py-3.5 text-center text-gray-500">{{ line.previously_received_quantity || 0 }}</td>
                <td class="px-4 py-3.5 text-center font-bold text-blue-700">{{ line.current_received_quantity }}</td>
                <td class="px-4 py-3.5 text-center font-bold text-[#165A31]">{{ line.accepted_quantity ?? (line.current_received_quantity - (line.damaged_quantity || 0)) }}</td>
                <td class="px-4 py-3.5 text-center text-amber-600 font-semibold">{{ line.short_quantity || 0 }}</td>
                <td class="px-4 py-3.5 text-center text-blue-600 font-semibold">{{ line.excess_quantity || 0 }}</td>
                <td class="px-4 py-3.5 text-center text-red-600 font-semibold">{{ line.damaged_quantity || 0 }}</td>
                <td class="px-5 py-3.5">
                  <span 
                    class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold"
                    :class="line.status === 'Complete' ? 'bg-[#eefcf2] text-[#165A31]' : (line.status === 'QC Hold' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700')"
                  >
                    {{ line.status || 'Complete' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab Content: Serial & Chassis Units -->
      <div v-else-if="activeTab === 'Serial & Chassis Units'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">Serialized Units Inwarded ({{ receipt.serializedUnits?.length || 0 }})</h3>
        </div>
        <div v-if="receipt.serializedUnits && receipt.serializedUnits.length > 0" class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase">
                <th class="px-5 py-3">#</th>
                <th class="px-5 py-3">Product</th>
                <th class="px-4 py-3">Chassis / VIN</th>
                <th class="px-4 py-3">Motor Serial</th>
                <th class="px-4 py-3">Battery Serial</th>
                <th class="px-4 py-3">Condition</th>
                <th class="px-5 py-3">QC Decision</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="(unit, i) in receipt.serializedUnits" :key="i" class="hover:bg-gray-50/50">
                <td class="px-5 py-3.5 font-mono text-gray-400">{{ i + 1 }}</td>
                <td class="px-5 py-3.5 font-semibold text-gray-900">{{ unit.product }}</td>
                <td class="px-4 py-3.5 font-mono font-bold text-gray-900">{{ unit.chassis || unit.serial }}</td>
                <td class="px-4 py-3.5 font-mono text-gray-600">{{ unit.motorNumber || '—' }}</td>
                <td class="px-4 py-3.5 font-mono text-gray-600">{{ unit.batteryNumber || '—' }}</td>
                <td class="px-4 py-3.5 text-gray-700">{{ unit.condition || 'Good' }}</td>
                <td class="px-5 py-3.5">
                  <span 
                    class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold"
                    :class="unit.qc === 'Pass' ? 'bg-[#eefcf2] text-[#165A31]' : 'bg-amber-50 text-amber-700'"
                  >
                    {{ unit.qc || 'Pass' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="p-8 text-center text-xs text-gray-400">
          No serialized vehicle records entered for this receipt (non-serialized parts or bulk items).
        </div>
      </div>

      <!-- Tab Content: Discrepancies -->
      <div v-else-if="activeTab === 'Discrepancies'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-4">Discrepancy Audit</h3>
        <div v-if="discrepanciesList.length > 0" class="space-y-3">
          <div v-for="(disc, i) in discrepanciesList" :key="i" class="p-4 bg-amber-50/50 border border-amber-200 rounded-xl space-y-1 text-xs">
            <div class="flex items-center justify-between font-bold text-gray-900">
              <span>{{ disc.product }}</span>
              <span class="text-amber-700">
                {{ disc.short_quantity > 0 ? `Short: ${disc.short_quantity} units` : (disc.excess_quantity > 0 ? `Excess: ${disc.excess_quantity} units` : `Damaged: ${disc.damaged_quantity} units`) }}
              </span>
            </div>
            <p class="text-gray-600"><strong>Discrepancy Reason:</strong> {{ disc.discrepancy_reason || 'Logged upon physical intake' }}</p>
          </div>
        </div>
        <div v-else class="flex items-center gap-3 bg-[#fbfbfc] p-4 rounded-lg border border-gray-100 text-xs">
          <CheckCircle2 class="w-5 h-5 text-[#165A31]" />
          <span class="font-bold text-gray-900">No discrepancies recorded on this receipt. All quantities reconciled.</span>
        </div>
      </div>

      <!-- Tab Content: QC -->
      <div v-else-if="activeTab === 'QC'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">Quality Control Log</h3>
        </div>
        <div v-if="receipt.qcRecords && receipt.qcRecords.length > 0" class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase">
                <th class="px-5 py-3">Unit / Serial</th>
                <th class="px-5 py-3">Inspection Check</th>
                <th class="px-5 py-3">Diagnostic Finding</th>
                <th class="px-4 py-3">Decision</th>
                <th class="px-5 py-3">Inspector</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="(qc, i) in receipt.qcRecords" :key="i" class="hover:bg-gray-50/50">
                <td class="px-5 py-3.5 font-mono font-semibold text-gray-900">{{ qc.serial }}</td>
                <td class="px-5 py-3.5 text-gray-600">{{ qc.check }}</td>
                <td class="px-5 py-3.5 text-gray-700">{{ qc.finding }}</td>
                <td class="px-4 py-3.5">
                  <span 
                    class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold"
                    :class="qc.decision === 'Pass' || qc.decision === 'Available' ? 'bg-[#eefcf2] text-[#165A31]' : 'bg-amber-50 text-amber-700'"
                  >
                    {{ qc.decision }}
                  </span>
                </td>
                <td class="px-5 py-3.5 text-gray-600 font-medium">{{ qc.inspector }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="p-8 text-center text-xs text-gray-400">
          Standard visual intake completed with no QC failures recorded.
        </div>
      </div>

      <!-- Tab Content: Costs -->
      <div v-else-if="activeTab === 'Costs'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">Receipt Valuation</h3>
        <div class="space-y-4 text-xs">
          <div class="flex justify-between">
            <span class="text-gray-500 font-medium">Receipt Inward Value</span>
            <span class="font-bold text-gray-900">Valued against PO standard cost</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500 font-medium">Landed Cost Allocation</span>
            <span class="font-bold text-gray-900">Recorded</span>
          </div>
        </div>
      </div>

      <!-- Tab Content: Documents -->
      <div v-else-if="activeTab === 'Documents'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">Receipt Documents</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase">
                <th class="px-5 py-3">Document</th>
                <th class="px-5 py-3">Type</th>
                <th class="px-5 py-3">Uploaded</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="doc in documents" :key="doc.name" class="hover:bg-gray-50/50">
                <td class="px-5 py-3.5 font-semibold text-gray-900">{{ doc.name }}</td>
                <td class="px-5 py-3.5 text-gray-600">{{ doc.type }}</td>
                <td class="px-5 py-3.5 text-gray-600">{{ doc.uploaded }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab Content: Activity -->
      <div v-else-if="activeTab === 'Activity'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">Receipt Timeline</h3>
        <div class="space-y-4">
          <div v-for="(activity, i) in activities" :key="i" class="flex items-start gap-3 text-xs">
            <div class="mt-1 w-1.5 h-1.5 rounded-full bg-[#165A31]"></div>
            <div class="flex-1 flex justify-between">
              <span class="font-bold text-gray-900">{{ activity.text }}</span>
              <span class="text-gray-400 text-[11px]">{{ activity.date }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

