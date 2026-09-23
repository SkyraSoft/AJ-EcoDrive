<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, CheckCircle2, MessageSquare, Check, X, AlertTriangle, Truck } from 'lucide-vue-next'
import { store } from '../../store.js'

const router = useRouter()
const route = useRoute()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

// Toast State
const showToast = ref(false)
const toastMessage = ref('')

const triggerToast = (msg) => {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3500)
}

const requestId = computed(() => route.params.id || route.query.id || 'SR-104')
const currentRequest = computed(() => store.getStockRequestById(requestId.value))

const branchCurrentTab = ref('Request')
const branchTabs = ['Request & Items', 'Approval Status', 'Fulfilment', 'Timeline']

const approveRequest = () => {
  try {
    store.approveStockRequest(requestId.value, {
      approvedBy: user.value?.name || 'Central Inventory Lead'
    })
    triggerToast(`Stock Request ${requestId.value} approved! Transfer order can now be initiated.`)
  } catch (err) {
    alert(err.message)
  }
}

const rejectRequest = () => {
  try {
    store.rejectStockRequest(requestId.value, 'Rejected after inventory capacity review.')
    triggerToast(`Stock Request ${requestId.value} rejected.`)
  } catch (err) {
    alert(err.message)
  }
}

const branchTabData = computed(() => {
  const req = currentRequest.value
  if (!req) return { title: '', items: [] }

  switch (branchCurrentTab.value) {
    case 'Request & Items':
      return {
        title: 'Request Details',
        items: [
          { label: 'Request ID', value: req.id },
          { label: 'Requesting Branch', value: `${req.branch} Branch` },
          { label: 'Requested By', value: req.requestedBy },
          { label: 'Primary Product', value: req.product },
          { label: 'Total Units Requested', value: String(req.qty || 1) },
          { label: 'Reason for Request', value: req.reason || 'Replenishment' },
          { label: 'Target Need Date', value: req.needBy || req.expected || '31 Aug' },
          { label: 'Priority', value: req.priority || 'Normal' }
        ]
      }
    case 'Approval Status':
      return {
        title: 'Approval & Decision',
        items: [
          { label: 'Current Status', value: req.status },
          { label: 'Approved By', value: req.approvedBy || (req.status === 'Approved' ? 'Central Inventory Lead' : 'Pending Decision') },
          { label: 'Approval Date', value: req.approvedDate || (req.status === 'Approved' ? 'Today' : '—') },
          { label: 'Rejection Reason', value: req.rejectionReason || 'None' },
          { label: 'Approved Units', value: req.status === 'Approved' ? `${req.qty} Units` : 'Pending Decision' },
          { label: 'Fulfilment Route', value: req.status === 'Approved' ? `Approved from Central Pool &rarr; ${req.branch}` : 'Pending route assignment' }
        ]
      }
    case 'Fulfilment':
      return {
        title: 'Fulfilment Logistics',
        items: [
          { label: 'Fulfillment Type', value: 'Inter-branch Transfer' },
          { label: 'Linked Transfer ID', value: req.linkedTransferId || (req.status === 'Approved' ? 'TR-224 (Ready to Dispatch)' : 'Pending Approval') },
          { label: 'Courier / Fleet', value: 'BRG Dedicated Logistics' },
          { label: 'Receiving Location', value: `${req.branch} Branch` },
          { label: 'Destination Bay', value: 'Intake Bay 1' },
          { label: 'SLA Target', value: 'Within 48 Hours' }
        ]
      }
    case 'Timeline':
      return {
        title: 'Timeline Milestones',
        items: (req.timeline || []).map(tl => ({
          label: tl.date || 'Milestone',
          value: `${tl.title} — ${tl.desc} (${tl.user || 'System'})`
        }))
      }
    default:
      return { title: 'Request', items: [] }
  }
})
</script>

<template>
  <!-- Toast Notification -->
  <div 
    v-if="showToast" 
    class="fixed bottom-5 right-5 z-[110] bg-[#165A31] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200"
  >
    <CheckCircle2 class="w-5 h-5 text-green-300" />
    <span class="text-xs font-bold">{{ toastMessage }}</span>
  </div>

  <div class="max-w-[1400px] mx-auto pb-12 space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[11px] text-gray-400 mb-1">
          <span v-if="isBranchUser">Branch Manager / Stock Requests / <span class="font-medium text-gray-600">Stock Request {{ requestId }}</span></span>
          <span v-else>Super Admin / Inventory / Stock Requests / <span class="font-medium text-gray-600">Stock Request {{ requestId }}</span></span>
        </div>
        <div class="flex items-center gap-3">
          <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Stock Request {{ requestId }}</h1>
          <span 
            v-if="currentRequest"
            class="px-2.5 py-1 rounded-full text-[10px] font-bold"
            :class="currentRequest.status === 'Approved' ? 'bg-[#eefcf2] text-[#165A31]' : currentRequest.status === 'Rejected' ? 'bg-red-50 text-red-700' : 'bg-[#fef3c7] text-[#b45309]'"
          >
            {{ currentRequest.status }}
          </span>
        </div>
        <p class="text-xs text-gray-500 mt-1">Multi-item inter-branch replenishment demand record.</p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2.5">
        <button 
          @click="router.push('/inventory/stock-requests')"
          class="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
        >
          <ArrowLeft class="w-3.5 h-3.5" /> Back
        </button>

        <template v-if="currentRequest && currentRequest.status === 'Pending Approval'">
          <button 
            @click="rejectRequest"
            class="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            <X class="w-3.5 h-3.5" /> Reject
          </button>
          <button 
            @click="approveRequest"
            class="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#165A31] hover:bg-[#124a28] rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            <Check class="w-3.5 h-3.5" /> Approve Request
          </button>
        </template>

        <button 
          v-if="currentRequest && currentRequest.status === 'Approved'"
          @click="router.push('/inventory/transfers/create')"
          class="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#165A31] hover:bg-[#124a28] rounded-lg transition-colors shadow-sm cursor-pointer"
        >
          <Truck class="w-3.5 h-3.5" /> Create Transfer Order
        </button>
      </div>
    </div>

    <!-- NOT FOUND STATE -->
    <div v-if="!currentRequest" class="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm space-y-3">
      <div class="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
        <AlertTriangle class="w-6 h-6" />
      </div>
      <h2 class="text-lg font-bold text-gray-900">Stock Request Not Found</h2>
      <p class="text-xs text-gray-500 max-w-md mx-auto">The stock request identifier "{{ requestId }}" does not exist in the canonical stock request registry.</p>
      <div class="pt-2">
        <button 
          @click="router.push('/inventory/stock-requests')" 
          class="px-4 py-2 text-xs font-bold text-[#165A31] bg-[#eefcf2] hover:bg-[#dcfce7] rounded-lg transition-colors"
        >
          Return to Stock Requests
        </button>
      </div>
    </div>

    <!-- ACTIVE RECORD VIEW -->
    <div v-else class="space-y-6">
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

      <!-- Tab Content Grid -->
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

            <!-- Requested Line Items Table -->
            <div v-if="branchCurrentTab === 'Request & Items'" class="mt-6 space-y-3">
              <h4 class="text-xs font-bold text-gray-900">Requested Products Line Items</h4>
              <div class="overflow-x-auto">
                <table class="w-full text-left text-xs border border-gray-100 rounded-lg overflow-hidden">
                  <thead class="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <tr>
                      <th class="p-3">Product</th>
                      <th class="p-3">SKU</th>
                      <th class="p-3 text-center">Requested Qty</th>
                      <th class="p-3 text-center">Approved Qty</th>
                      <th class="p-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-50">
                    <tr v-for="(line, idx) in (currentRequest.items || [])" :key="idx">
                      <td class="p-3 font-bold text-gray-900">{{ line.product }}</td>
                      <td class="p-3 text-gray-500">{{ line.sku || '—' }}</td>
                      <td class="p-3 text-center font-bold text-gray-800">{{ line.requestedQty }}</td>
                      <td class="p-3 text-center font-bold" :class="currentRequest.status === 'Approved' ? 'text-[#165A31]' : 'text-gray-400'">
                        {{ currentRequest.status === 'Approved' ? line.requestedQty : '0' }}
                      </td>
                      <td class="p-3 text-right">
                        <span class="px-2 py-0.5 rounded text-[10px] font-bold" :class="currentRequest.status === 'Approved' ? 'bg-[#dcfce7] text-[#165A31]' : (currentRequest.status === 'Rejected' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700')">
                          {{ currentRequest.status }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Box -->
        <div class="lg:col-span-4 flex flex-col space-y-6">
          <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
            <h3 class="text-sm font-bold text-gray-900">Branch &amp; Audit Context</h3>
            
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5">
                <span class="text-[10px] font-medium text-gray-400">Request Branch</span>
                <span class="text-sm font-bold text-gray-900 mt-1 block">{{ currentRequest.branch }}</span>
              </div>
              <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5">
                <span class="text-[10px] font-medium text-gray-400">Total Items</span>
                <span class="text-sm font-bold text-gray-900 mt-1 block">{{ currentRequest.items?.length || 1 }}</span>
              </div>
              <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5">
                <span class="text-[10px] font-medium text-gray-400">Priority</span>
                <span class="text-sm font-bold text-gray-900 mt-1 block">{{ currentRequest.priority || 'Normal' }}</span>
              </div>
              <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5">
                <span class="text-[10px] font-medium text-gray-400">Required By</span>
                <span class="text-sm font-bold text-gray-900 mt-1 block">{{ currentRequest.needBy || '31 Aug' }}</span>
              </div>
            </div>

            <div class="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100/60 text-[11px] text-gray-600 leading-relaxed">
              Approved stock requests directly initiate the inter-branch transfer process without recreating line items.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
