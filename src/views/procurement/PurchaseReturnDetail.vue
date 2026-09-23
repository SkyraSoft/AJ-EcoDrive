<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { store } from '../../store.js'
import CreatePurchaseReturn from './CreatePurchaseReturn.vue'

const route = useRoute()
const returnId = computed(() => route.params.id || route.query.id || 'PRTN-044')
const returnRecord = computed(() => {
  return store.getPurchaseReturnById(returnId.value) || store.purchaseReturns[0] || {
    returnNo: 'PRTN-044',
    supplier: 'BRG Factory',
    po: 'PO-2022',
    status: 'Approved'
  }
})

const activeTab = ref('Summary')
const showEditModal = ref(false)
const tabs = ['Summary', 'Units', 'Shipment Back', 'Supplier Credit', 'Financial Effect', 'Documents', 'Activity']

const returnUnits = [
  { serial: 'EVS-00431', product: 'BRG EV-5', issue: 'Battery fault', status: 'Quarantine' },
  { serial: 'EVS-00432', product: 'BRG EV-5', issue: 'Controller fault', status: 'Quarantine' }
]

const financialEffects = [
  { account: 'Inventory cost removed', amount: '336K', status: 'On shipment/credit' },
  { account: 'Supplier payable reduction', amount: '336K', status: 'Pending credit note' }
]

const documents = [
  { name: 'QC_Report.pdf', type: 'QC', uploaded: 'Aug 26' },
  { name: 'Supplier_Approval.eml', type: 'Approval', uploaded: 'Aug 27' }
]

const activities = [
  { text: 'Return approved', date: 'Aug 27' },
  { text: 'Supplier accepted claim', date: 'Aug 27' },
  { text: 'QC report attached', date: 'Aug 26' }
]
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Procurement / Purchase Returns / <span class="font-bold text-gray-800">Purchase Return Detail — {{ activeTab }}</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Purchase Return Detail — {{ activeTab }}</h1>
        <p class="text-sm text-gray-500 mt-1">PRTN-044 - {{ activeTab }}</p>
      </div>
    </div>

    <!-- Overview Card -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <h2 class="text-[22px] font-bold text-gray-900">PRTN-044</h2>
        <p class="text-[11px] text-gray-500 mt-1 font-medium">BRG Factory &middot; PO-2022</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <span class="inline-flex items-center px-2 py-1 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">
          Approved
        </span>
        <button @click="showEditModal = true" class="px-4 py-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer">
          Update Return
        </button>
        <button class="px-3 py-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center gap-1">
          More <span class="text-[8px]">▼</span>
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
      
      <!-- Tab Content: Summary -->
      <template v-if="activeTab === 'Summary'">
        <!-- KPI Cards -->
        <div class="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">Units</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">2</div>
          </div>
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">Expected Credit</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">PKR 336K</div>
          </div>
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">Shipped</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">No</div>
          </div>
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">Supplier Decision</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">Approved</div>
          </div>
        </div>

        <!-- Summary Details -->
        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
          <h3 class="text-[14px] font-bold text-gray-900 mb-6">Summary</h3>
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">Reason</span>
              <span class="font-bold text-gray-900">QC failure</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">Source Receipt</span>
              <span class="font-bold text-gray-900">GR-976</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">Approved By</span>
              <span class="font-bold text-gray-900">Super Admin</span>
            </div>
          </div>
        </div>
      </template>

      <!-- Tab Content: Units -->
      <div v-else-if="activeTab === 'Units'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">Return Units</h3>
        </div>
        <div class="overflow-x-auto p-6 pt-0">
          <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse mt-4">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                <th class="px-5 py-3 rounded-tl-lg">Serial</th>
                <th class="px-5 py-3">Product</th>
                <th class="px-5 py-3">Issue</th>
                <th class="px-5 py-3 rounded-tr-lg">Status</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="(unit, i) in returnUnits" :key="i" class="border-b border-gray-50 last:border-0">
                <td class="px-5 py-4 font-semibold text-gray-900">{{ unit.serial }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ unit.product }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ unit.issue }}</td>
                <td class="px-5 py-4">
                  <span v-if="unit.status === 'Quarantine'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-amber-50 text-amber-600">Quarantine</span>
                </td>
              </tr>
            </tbody>
          </table></div>
        </div>
      </div>

      <!-- Tab Content: Shipment Back -->
      <div v-else-if="activeTab === 'Shipment Back'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">Shipment Back</h3>
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Carrier</span>
            <span class="font-bold text-gray-900">Not booked</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Tracking</span>
            <span class="font-bold text-gray-900">&mdash;</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Action</span>
            <span class="font-bold text-gray-900 cursor-pointer hover:text-[#165A31]">Book shipment</span>
          </div>
        </div>
      </div>

      <!-- Tab Content: Supplier Credit -->
      <div v-else-if="activeTab === 'Supplier Credit'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">Supplier Credit</h3>
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Expected Credit</span>
            <span class="font-bold text-gray-900">PKR 336K</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Credit Note</span>
            <span class="font-bold text-gray-900">Pending</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Apply To</span>
            <span class="font-bold text-gray-900">Vendor payable</span>
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
                <td class="px-5 py-4 text-gray-600 font-medium">{{ effect.status }}</td>
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

      <!-- Placeholder for other tabs -->
      <div v-else class="p-12 text-center text-gray-400 text-[11px]">
        Content for {{ activeTab }} tab will be implemented here.
      </div>

    </div>
  </div>

  <!-- Edit Purchase Return Modal Popup -->
  <CreatePurchaseReturn v-if="showEditModal" @close="showEditModal = false" />
</template>
