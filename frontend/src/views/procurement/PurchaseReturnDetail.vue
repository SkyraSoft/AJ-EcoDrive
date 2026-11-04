<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Printer } from 'lucide-vue-next'
import { store } from '../../store.js'
import { api } from '@/services/api.js'
import NotFoundState from '@/components/common/NotFoundState.vue'
import CreatePurchaseReturn from './CreatePurchaseReturn.vue'

const route = useRoute()
const returnId = computed(() => route.params.id || route.query.id || '')
const returnRecord = computed(() => {
  if (!returnId.value) return null
  return store.getPurchaseReturnById(returnId.value) || null
})

const handlePrint = () => {
  window.print()
}

const activeTab = ref('Summary')
const showEditModal = ref(false)
const isLoading = ref(false)
const isApproving = ref(false)
const apiError = ref(null)

const tabs = ['Summary', 'Units', 'Shipment Back', 'Supplier Credit', 'Financial Effect', 'Documents', 'Activity']

onMounted(async () => {
  if (!returnId.value) return
  isLoading.value = true
  apiError.value = null
  try {
    const res = await api.procurement.getPurchaseReturnById(returnId.value)
    const data = res?.data || res
    if (data && (data.id || data.return_number || data.returnNo)) {
      store.addPurchaseReturn(data)
    }
  } catch (err) {
    console.warn('API error fetching purchase return detail:', err)
    apiError.value = err.message
  } finally {
    isLoading.value = false
  }
})

const handleApprove = async () => {
  if (!returnRecord.value) return
  isApproving.value = true
  apiError.value = null
  const targetId = returnRecord.value.id || returnRecord.value.returnNo || returnRecord.value.return_number
  try {
    const res = await api.procurement.approvePurchaseReturn(targetId)
    const updated = res?.data || res
    if (updated) {
      store.addPurchaseReturn(updated)
    } else {
      returnRecord.value.status = 'Approved'
      returnRecord.value.statusClass = 'bg-[#dcfce7] text-[#165A31]'
    }
  } catch (err) {
    console.error('Failed to approve purchase return:', err)
    apiError.value = err.data?.message || err.message || 'Failed to approve return.'
  } finally {
    isApproving.value = false
  }
}

const displayLines = computed(() => {
  if (returnRecord.value?.lines && returnRecord.value.lines.length > 0) {
    return returnRecord.value.lines
  }
  if (returnRecord.value?.items && returnRecord.value.items.length > 0) {
    return returnRecord.value.items
  }
  return [
    { serial: 'EVS-00431', product: 'BRG EV-5', condition: 'Battery fault', status: 'Quarantine', subtotal: 168000 },
    { serial: 'EVS-00432', product: 'BRG EV-5', condition: 'Controller fault', status: 'Quarantine', subtotal: 168000 }
  ]
})

const financialEffects = computed(() => {
  const credit = returnRecord.value?.creditFormatted || returnRecord.value?.credit || 'PKR 336K'
  return [
    { account: 'Inventory cost removed', amount: credit, status: 'On approval/debit note' },
    { account: 'Supplier payable reduction', amount: credit, status: 'Vendor Debit Note Applied' }
  ]
})

const documents = [
  { name: 'QC_Report.pdf', type: 'QC', uploaded: 'Aug 26' },
  { name: 'Supplier_Approval.eml', type: 'Approval', uploaded: 'Aug 27' }
]

const activities = computed(() => {
  const list = [
    { text: `Return created with reason: ${returnRecord.value?.reason || 'QC failure'}`, date: 'Today' }
  ]
  if (returnRecord.value?.status === 'Approved') {
    list.unshift({ text: `Return approved by ${returnRecord.value?.approved_by || 'Super Admin'} with Vendor Debit Note issued`, date: 'Today' })
  }
  return list
})
</script>

<template>
  <NotFoundState
    v-if="!returnRecord && !isLoading"
    title="Purchase Return Not Found"
    message="The requested purchase return could not be found or is not accessible from your current branch context."
    back-link="/procurement/purchase-returns"
    back-text="Back to Purchase Returns"
  />
  <div v-else-if="returnRecord" class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Procurement / Purchase Returns / <span class="font-bold text-gray-800">{{ returnRecord.returnNo || returnRecord.return_number || returnRecord.id }}</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">{{ returnRecord.returnNo || returnRecord.return_number || returnRecord.id }} &middot; Detail</h1>
        <p class="text-sm text-gray-500 mt-1">{{ returnRecord.supplier }} &middot; {{ returnRecord.po || returnRecord.po_number || 'Direct Return' }}</p>
      </div>
    </div>

    <!-- Error Banner -->
    <div v-if="apiError" class="p-3.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center justify-between">
      <span>{{ apiError }}</span>
      <button @click="apiError = null" class="text-red-500 hover:text-red-800 font-bold ml-2 cursor-pointer">&times;</button>
    </div>

    <!-- Overview Card -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <h2 class="text-[22px] font-bold text-gray-900">{{ returnRecord.returnNo || returnRecord.return_number || returnRecord.id }}</h2>
        <p class="text-[11px] text-gray-500 mt-1 font-medium">{{ returnRecord.supplier }} &middot; {{ returnRecord.po || returnRecord.po_number || 'PO-2022' }}</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <span 
          class="inline-flex items-center px-2.5 py-1 rounded-[4px] text-[10px] font-bold"
          :class="returnRecord.status === 'Approved' ? 'bg-[#dcfce7] text-[#165A31]' : (returnRecord.status === 'Draft' ? 'bg-gray-100 text-gray-700' : 'bg-blue-50 text-blue-700')"
        >
          {{ returnRecord.status }}
        </span>

        <!-- Approve Button if in Draft state -->
        <button 
          v-if="returnRecord.status === 'Draft'"
          :disabled="isApproving"
          @click="handleApprove"
          class="px-4 py-1.5 text-[11px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
        >
          <span v-if="isApproving">Approving...</span>
          <span v-else>Approve Return</span>
        </button>

        <button 
          @click="handlePrint" 
          class="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
        >
          <Printer class="w-3.5 h-3.5" /> Print Debit Note / Return
        </button>

        <button @click="showEditModal = true" class="px-4 py-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer">
          New Return
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
            <div class="text-[11px] font-semibold text-gray-400 mb-2">Units</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">{{ returnRecord.units || returnRecord.total_units || displayLines.length }}</div>
          </div>
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">Expected Credit</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">{{ returnRecord.creditFormatted || returnRecord.credit || 'PKR 0' }}</div>
          </div>
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">Shipped</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">{{ returnRecord.status === 'Shipped' || returnRecord.status === 'Closed' ? 'Yes' : 'No' }}</div>
          </div>
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">Status</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">{{ returnRecord.status }}</div>
          </div>
        </div>

        <!-- Summary Details -->
        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
          <h3 class="text-[14px] font-bold text-gray-900 mb-6">Summary</h3>
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">Reason</span>
              <span class="font-bold text-gray-900">{{ returnRecord.reason || 'QC failure' }}</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">Source PO</span>
              <span class="font-bold text-gray-900">{{ returnRecord.po || returnRecord.po_number || 'Direct Return' }}</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">Branch</span>
              <span class="font-bold text-gray-900">{{ returnRecord.branch || 'Peshawar' }}</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">Created By</span>
              <span class="font-bold text-gray-900">{{ returnRecord.created_by || 'Store Lead' }}</span>
            </div>
            <div v-if="returnRecord.approved_by" class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">Approved By</span>
              <span class="font-bold text-[#165A31]">{{ returnRecord.approved_by }}</span>
            </div>
          </div>
        </div>
      </template>

      <!-- Tab Content: Units -->
      <div v-else-if="activeTab === 'Units'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-[14px] font-bold text-gray-900">Return Units</h3>
          <span class="text-[11px] text-gray-500 font-medium">{{ displayLines.length }} line items</span>
        </div>
        <div class="overflow-x-auto p-6 pt-0">
          <div class="w-full overflow-x-auto">
            <table class="w-full text-left border-collapse mt-4">
              <thead>
                <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                  <th class="px-5 py-3 rounded-tl-lg">Product</th>
                  <th class="px-5 py-3">Serial #</th>
                  <th class="px-5 py-3">Quantity</th>
                  <th class="px-5 py-3">Credit (PKR)</th>
                  <th class="px-5 py-3">Condition / Source</th>
                </tr>
              </thead>
              <tbody class="text-[11px]">
                <tr v-for="(line, i) in displayLines" :key="i" class="border-b border-gray-50 last:border-0">
                  <td class="px-5 py-4 font-semibold text-gray-900">{{ line.product }}</td>
                  <td class="px-5 py-4 text-gray-600 font-mono text-[10px]">{{ line.serial || line.serial_number || '—' }}</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">{{ line.quantity || line.units || 1 }}</td>
                  <td class="px-5 py-4 text-gray-900 font-bold">PKR {{ (line.subtotal || (line.quantity * (line.unit_cost || 0))).toLocaleString() }}</td>
                  <td class="px-5 py-4">
                    <span v-if="line.is_from_qc_hold" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-amber-50 text-amber-700">QC Hold</span>
                    <span v-else class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-gray-100 text-gray-700">{{ line.condition || 'Defective' }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Tab Content: Shipment Back -->
      <div v-else-if="activeTab === 'Shipment Back'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">Shipment Back</h3>
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Carrier</span>
            <span class="font-bold text-gray-900">Pak Logistics</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Tracking</span>
            <span class="font-bold text-gray-900 font-mono">TRK-RET-{{ returnRecord.returnNo || '044' }}</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Dispatch Status</span>
            <span class="font-bold text-[#165A31]">Inward return transit documented</span>
          </div>
        </div>
      </div>

      <!-- Tab Content: Supplier Credit -->
      <div v-else-if="activeTab === 'Supplier Credit'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">Vendor Debit Note &amp; Supplier Credit</h3>
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Expected Credit</span>
            <span class="font-bold text-gray-900">{{ returnRecord.creditFormatted || returnRecord.credit }}</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Vendor Debit Note</span>
            <span class="font-bold text-[#165A31] font-mono">{{ returnRecord.debit_notes?.[0]?.debit_note_number || 'VDN-Issued' }}</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Applied To</span>
            <span class="font-bold text-gray-900">{{ returnRecord.debit_notes?.[0]?.vendor_bill_id ? `Vendor Bill ${returnRecord.debit_notes[0].vendor_bill_id}` : 'Open Vendor Credit' }}</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Reconciliation Status</span>
            <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#dcfce7] text-[#165A31]">{{ returnRecord.debit_notes?.[0]?.status || 'Applied' }}</span>
          </div>
        </div>
      </div>

      <!-- Tab Content: Financial Effect -->
      <div v-else-if="activeTab === 'Financial Effect'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">Financial Effect</h3>
        </div>
        <div class="overflow-x-auto p-6 pt-0">
          <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse mt-4">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                <th class="px-5 py-3 rounded-tl-lg">Account Effect</th>
                <th class="px-5 py-3">Amount</th>
                <th class="px-5 py-3 rounded-tr-lg">Status</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="(effect, i) in financialEffects" :key="i" class="border-b border-gray-50 last:border-0">
                <td class="px-5 py-4 font-semibold text-gray-900">{{ effect.account }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ effect.amount }}</td>
                <td class="px-5 py-4 text-[#165A31] font-semibold">{{ effect.status }}</td>
              </tr>
            </tbody>
          </table></div>
        </div>
      </div>

      <!-- Tab Content: Documents -->
      <div v-else-if="activeTab === 'Documents'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">Documents</h3>
        </div>
        <div class="overflow-x-auto p-6 pt-0">
          <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse mt-4">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                <th class="px-5 py-3 rounded-tl-lg">Document</th>
                <th class="px-5 py-3">Type</th>
                <th class="px-5 py-3 rounded-tr-lg">Uploaded</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="doc in documents" :key="doc.name" class="border-b border-gray-50 last:border-0">
                <td class="px-5 py-4 font-semibold text-gray-900">{{ doc.name }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ doc.type }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ doc.uploaded }}</td>
              </tr>
            </tbody>
          </table></div>
        </div>
      </div>

      <!-- Tab Content: Activity -->
      <div v-else-if="activeTab === 'Activity'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">Return Activity</h3>
        </div>
        <div class="p-6 space-y-4">
          <div v-for="(activity, i) in activities" :key="i" class="flex items-start gap-3">
            <div class="mt-1 w-1 h-3 rounded-full bg-[#165A31]"></div>
            <div class="flex-1 flex justify-between">
              <span class="text-[11px] font-bold text-gray-900">{{ activity.text }}</span>
              <span class="text-[11px] font-medium text-gray-500">{{ activity.date }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>

  <!-- Create Modal -->
  <CreatePurchaseReturn v-if="showEditModal" @close="showEditModal = false" />

  <!-- PRINTABLE PURCHASE RETURN / VENDOR DEBIT NOTE -->
  <div class="print-document hidden font-sans p-8 max-w-4xl mx-auto bg-white text-black">
    <!-- Header -->
    <div class="border-b-2 border-black pb-4 mb-6 flex justify-between items-start">
      <div>
        <h1 class="text-2xl font-bold tracking-wider uppercase text-gray-900">AJ ECODRIVE LTD / BRG ELECTRIC VEHICLES</h1>
        <p class="text-xs text-gray-700 mt-1">Official OEM Procurement & Logistics &middot; Pakistan Network</p>
        <p class="text-[10px] text-gray-500 font-mono mt-0.5">NTN: {{ store.settings?.company?.taxNumber || 'Not configured' }} | STRN: {{ store.settings?.company?.strn || store.settings?.company?.registrationNumber || 'Not configured' }} | Form: PROC-VDN-REV2</p>
      </div>
      <div class="text-right">
        <div class="inline-block bg-black text-white px-3 py-1 font-bold text-sm tracking-widest uppercase mb-1">
          VENDOR DEBIT NOTE & RETURN
        </div>
        <div class="text-xs font-mono font-bold text-gray-800">REF: {{ returnRecord.returnNo || returnRecord.return_number || returnRecord.id }}</div>
        <div class="text-[10px] text-gray-600">Date: {{ returnRecord.date || new Date().toLocaleDateString('en-GB') }}</div>
      </div>
    </div>

    <!-- Particulars Grid -->
    <div class="grid grid-cols-2 gap-4 border border-gray-400 p-4 mb-6 text-xs bg-gray-50/50">
      <div>
        <h4 class="font-bold border-b pb-1 mb-2 uppercase text-gray-800 text-[10px]">Supplier / Vendor Details</h4>
        <p class="mb-1"><strong class="text-gray-900">Vendor:</strong> {{ returnRecord.supplier || 'BRG Manufacturing Ltd' }}</p>
        <p class="mb-1"><strong class="text-gray-900">Vendor Ref / Code:</strong> {{ returnRecord.supplierCode || 'VEND-OEM-01' }}</p>
        <p class="mb-1"><strong class="text-gray-900">Orig. Purchase Order:</strong> {{ returnRecord.po || returnRecord.po_number || 'PO-2022' }}</p>
        <p class="mb-1"><strong class="text-gray-900">Inbound Delivery Ref:</strong> {{ returnRecord.grn || 'GRN-INB-088' }}</p>
      </div>
      <div>
        <h4 class="font-bold border-b pb-1 mb-2 uppercase text-gray-800 text-[10px]">Debit & Dispatch Particulars</h4>
        <p class="mb-1"><strong class="text-gray-900">Return Status:</strong> <span class="font-bold uppercase">{{ returnRecord.status }}</span></p>
        <p class="mb-1"><strong class="text-gray-900">Origin Warehouse / Branch:</strong> Central Hub / Islamabad Receiving Bay</p>
        <p class="mb-1"><strong class="text-gray-900">Debit Note Applied:</strong> Vendor Ledger Account Credited</p>
        <p class="mb-1"><strong class="text-gray-900">Total Credit Amount:</strong> <span class="font-bold text-green-800">{{ returnRecord.creditFormatted || returnRecord.credit || 'PKR 336,000' }}</span></p>
      </div>
    </div>

    <!-- Returned Units Table -->
    <table class="w-full text-left text-xs border border-collapse border-black mb-6">
      <thead>
        <tr class="bg-gray-100 border-b border-black text-[10px] uppercase font-bold">
          <th class="p-2 border-r border-black">#</th>
          <th class="p-2 border-r border-black">Product / Unit Particulars</th>
          <th class="p-2 border-r border-black font-mono">Serial / Chassis #</th>
          <th class="p-2 border-r border-black">QC Fault / Return Reason</th>
          <th class="p-2 border-r border-black text-center">Unit State</th>
          <th class="p-2 text-right">Debit Amount (PKR)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(line, idx) in displayLines" :key="idx" class="border-b border-gray-300">
          <td class="p-2 border-r border-gray-300">{{ idx + 1 }}</td>
          <td class="p-2 border-r border-gray-300 font-bold">{{ line.product || 'BRG EV-5' }}</td>
          <td class="p-2 border-r border-gray-300 font-mono text-[11px]">{{ line.serial || 'EVS-00431' }}</td>
          <td class="p-2 border-r border-gray-300 text-red-600 font-semibold">{{ line.condition || line.reason || returnRecord.reason || 'Factory QC Failure' }}</td>
          <td class="p-2 border-r border-gray-300 text-center">{{ line.status || 'Quarantine' }}</td>
          <td class="p-2 text-right font-mono font-bold">{{ line.subtotal ? `PKR ${line.subtotal.toLocaleString()}` : (line.amount || 'PKR 168,000') }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="border-t-2 border-black bg-gray-50 font-bold">
          <td colspan="5" class="p-2 text-right uppercase text-[10px]">Total Vendor Debit Note Value:</td>
          <td class="p-2 text-right font-mono text-sm text-green-900">{{ returnRecord.creditFormatted || returnRecord.credit || 'PKR 336,000' }}</td>
        </tr>
      </tfoot>
    </table>

    <!-- Carrier & Transport Authorization -->
    <div class="border border-gray-400 p-4 mb-6 text-xs bg-gray-50/50">
      <h4 class="font-bold uppercase text-gray-800 text-[10px] mb-2">Carrier & Dispatch Handover:</h4>
      <div class="grid grid-cols-3 gap-3">
        <div><strong>Transporter:</strong> Central Logistics / Vendor Carrier</div>
        <div><strong>Vehicle Reg #:</strong> ICT-TX-9921</div>
        <div><strong>Driver / Bilty #:</strong> BL-99218 / Muhammad Nawaz</div>
      </div>
      <p class="text-[10px] text-gray-500 italic mt-2">
        Note: The items listed above are dispatched under RMA / Warranty Claim. The issuing supplier's ledger is debited accordingly.
      </p>
    </div>

    <!-- Quad Signature Blocks -->
    <div class="grid grid-cols-4 gap-4 pt-10 text-center text-xs">
      <div class="border-t border-black pt-2">
        <p class="font-bold">QC Inspector</p>
        <p class="text-[9px] text-gray-500 mt-6">Inspected & Documented</p>
      </div>
      <div class="border-t border-black pt-2">
        <p class="font-bold">Procurement Manager</p>
        <p class="text-[9px] text-gray-500 mt-6">Debit Note Approved</p>
      </div>
      <div class="border-t border-black pt-2">
        <p class="font-bold">Super Admin / Authorized</p>
        <p class="text-[9px] text-gray-500 mt-6">Executive Sign-off</p>
      </div>
      <div class="border border-black p-2 h-20 flex items-center justify-center">
        <span class="text-[8px] text-gray-400 font-bold uppercase tracking-wider">OFFICIAL DEALERSHIP STAMP</span>
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
