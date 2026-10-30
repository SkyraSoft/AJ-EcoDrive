<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
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
</template>
