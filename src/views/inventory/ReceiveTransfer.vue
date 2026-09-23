<script setup>
import { ref, computed, reactive, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, CheckCircle2, AlertCircle, PackageCheck, AlertTriangle } from 'lucide-vue-next'
import { store } from '../../store.js'

const router = useRouter()
const route = useRoute()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const transferId = computed(() => route.params.id || route.query.id || 'TR-221')
const showToast = ref(false)
const toastMessage = ref('')
const errorMessage = ref('')

const transfer = computed(() => store.getTransferById(transferId.value))

// Receiving form state initialized from transfer items
const receivingLines = ref([])
const receiverName = ref(user.value?.name || 'Branch Manager')
const receiverNotes = ref('Verified consignment on branch loading bay.')
const receiverLocation = ref(`${user.value?.branchName || 'Peshawar'} Warehouse Bay 1`)

const initializeReceivingLines = (t) => {
  if (!t || !t.items) {
    receivingLines.value = []
    return
  }
  receivingLines.value = t.items.map(item => {
    const remainingToReceive = Math.max(0, (item.dispatchedQty || item.requestedQty || 0) - (item.receivedQty || 0))
    return {
      product_id: item.product_id,
      product: item.product,
      sku: item.sku,
      dispatchedQty: item.dispatchedQty || item.requestedQty || 0,
      previouslyReceived: item.receivedQty || 0,
      remainingToReceive,
      currentReceived: remainingToReceive, // default to receiving the remaining
      damagedQty: 0,
      isSerialized: item.isSerialized,
      serials: item.serials || []
    }
  })
}

watch(transfer, (newVal) => {
  if (newVal) initializeReceivingLines(newVal)
}, { immediate: true })

const totalDispatched = computed(() => {
  return receivingLines.value.reduce((s, l) => s + (l.dispatchedQty || 0), 0)
})

const totalCurrentReceived = computed(() => {
  return receivingLines.value.reduce((s, l) => s + (parseInt(l.currentReceived) || 0), 0)
})

const totalDamaged = computed(() => {
  return receivingLines.value.reduce((s, l) => s + (parseInt(l.damagedQty) || 0), 0)
})

const totalRemainingAfterReceipt = computed(() => {
  return receivingLines.value.reduce((s, l) => {
    const rem = l.remainingToReceive - (parseInt(l.currentReceived) || 0)
    return s + Math.max(0, rem)
  }, 0)
})

const isPartialReceipt = computed(() => {
  return totalRemainingAfterReceipt.value > 0
})

const confirmArrival = () => {
  errorMessage.value = ''
  if (!transfer.value) {
    errorMessage.value = 'Cannot process: transfer record not found.'
    return
  }

  if (transfer.value.status === 'Received') {
    errorMessage.value = `Transfer ${transferId.value} is already marked complete and received.`
    return
  }

  // Validate line items
  for (const line of receivingLines.value) {
    const curr = parseInt(line.currentReceived || 0)
    const dam = parseInt(line.damagedQty || 0)

    if (isNaN(curr) || curr < 0) {
      errorMessage.value = `Invalid received quantity for ${line.product}.`
      return
    }
    if (isNaN(dam) || dam < 0) {
      errorMessage.value = `Invalid damaged quantity for ${line.product}.`
      return
    }
    if (dam > curr) {
      errorMessage.value = `Damaged quantity cannot exceed received quantity for ${line.product}.`
      return
    }
    if (curr > line.remainingToReceive) {
      errorMessage.value = `Cannot receive ${curr} units for ${line.product}. Only ${line.remainingToReceive} units outstanding.`
      return
    }
  }

  if (totalCurrentReceived.value === 0) {
    errorMessage.value = 'Please enter at least one received unit.'
    return
  }

  try {
    store.receiveTransfer({
      transferId: transferId.value,
      receivedItems: receivingLines.value.map(l => ({
        product_id: l.product_id,
        product: l.product,
        receivedQty: parseInt(l.currentReceived || 0),
        damagedQty: parseInt(l.damagedQty || 0)
      })),
      receiverNotes: receiverNotes.value,
      receiverName: receiverName.value
    })

    toastMessage.value = isPartialReceipt.value
      ? `Partial receipt recorded (${totalCurrentReceived.value} units). Remaining ${totalRemainingAfterReceipt.value} units remain In Transit.`
      : `Transfer ${transferId.value} received in full and destination inventory updated!`
    
    showToast.value = true
    setTimeout(() => {
      router.push(`/inventory/transfers/detail?id=${transferId.value}`)
    }, 1200)
  } catch (err) {
    errorMessage.value = err.message
  }
}
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

  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[11px] text-gray-400 mb-1">
          <span v-if="isBranchUser">Branch Manager / Transfers / <span class="font-medium text-gray-600">Receive Transfer {{ transferId }}</span></span>
          <span v-else>Super Admin / Transfers / <span class="font-medium text-gray-600">Receive Transfer {{ transferId }}</span></span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Receive Transfer {{ transferId }}</h1>
        <p class="text-xs text-gray-500 mt-1">Verify expected consignment, record damaged / short quantities, and update destination stock.</p>
      </div>
      <div class="flex items-center gap-2.5">
        <button 
          @click="router.push('/inventory/transfers')" 
          class="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
        >
          <ArrowLeft class="w-3.5 h-3.5" /> Back
        </button>
        <button 
          v-if="transfer && transfer.status !== 'Received'"
          @click="confirmArrival" 
          class="bg-[#165A31] text-white text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
        >
          <PackageCheck class="w-4 h-4" />
          {{ isPartialReceipt ? 'Confirm Partial Receipt' : 'Confirm Full Arrival' }}
        </button>
      </div>
    </div>

    <!-- Error Alert Banner -->
    <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-4 flex items-center gap-2.5">
      <AlertCircle class="w-4 h-4 shrink-0 text-red-600" />
      <span class="font-medium">{{ errorMessage }}</span>
    </div>

    <!-- NOT FOUND STATE -->
    <div v-if="!transfer" class="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm space-y-3">
      <div class="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
        <AlertTriangle class="w-6 h-6" />
      </div>
      <h2 class="text-lg font-bold text-gray-900">Transfer Record Not Found</h2>
      <p class="text-xs text-gray-500 max-w-md mx-auto">No transfer matches the identifier "{{ transferId }}". Please verify the ID or return to the transfer register.</p>
      <div class="pt-2">
        <button 
          @click="router.push('/inventory/transfers')" 
          class="px-4 py-2 text-xs font-bold text-[#165A31] bg-[#eefcf2] hover:bg-[#dcfce7] rounded-lg transition-colors"
        >
          View All Transfers
        </button>
      </div>
    </div>

    <!-- ALREADY RECEIVED STATE -->
    <div v-else-if="transfer.status === 'Received'" class="bg-emerald-50 border border-emerald-200 rounded-xl p-6 flex items-start gap-4 shadow-sm">
      <CheckCircle2 class="w-6 h-6 text-[#165A31] shrink-0 mt-0.5" />
      <div class="space-y-1">
        <h3 class="text-sm font-bold text-[#165A31]">Transfer Already Fully Received</h3>
        <p class="text-xs text-gray-600">This transfer was successfully completed on {{ transfer.receivedDate || 'earlier' }}. All units and products have already been credited to {{ transfer.to }} Branch inventory.</p>
        <div class="pt-2">
          <button 
            @click="router.push(`/inventory/transfers/detail?id=${transfer.id}`)"
            class="text-xs font-bold text-[#165A31] underline cursor-pointer"
          >
            View Complete Transfer Details &rsaquo;
          </button>
        </div>
      </div>
    </div>

    <!-- ACTIVE RECEIVING WORKFLOW -->
    <div v-else class="space-y-6">
      <!-- Route & Logistics Summary Card -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Origin Branch</span>
            <span class="font-bold text-gray-900 mt-1 block">{{ transfer.from }} Branch</span>
          </div>
          <div>
            <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Destination Branch</span>
            <span class="font-bold text-[#165A31] mt-1 block">{{ transfer.to }} Branch</span>
          </div>
          <div>
            <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Carrier / Vehicle</span>
            <span class="font-medium text-gray-700 mt-1 block">{{ transfer.carrier || 'Internal logistics' }}</span>
          </div>
          <div>
            <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Dispatched Date</span>
            <span class="font-medium text-gray-700 mt-1 block">{{ transfer.dispatched || 'Today' }}</span>
          </div>
        </div>
      </div>

      <!-- Consignment Items Table -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-bold text-gray-900">Consignment Verification Checklist</h3>
          <span class="text-xs text-gray-500 font-medium">Verify actual counts unloaded at bay</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2.5">
                <th class="pb-2.5">Product</th>
                <th class="pb-2.5">Type</th>
                <th class="pb-2.5 text-center">Dispatched</th>
                <th class="pb-2.5 text-center">Prev. Received</th>
                <th class="pb-2.5 text-center">Remaining</th>
                <th class="pb-2.5 text-center w-28">Received Now *</th>
                <th class="pb-2.5 text-center w-28">Damaged Qty</th>
                <th class="pb-2.5 text-center">Shortage</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="(line, idx) in receivingLines" :key="idx" class="hover:bg-gray-50/50">
                <td class="py-3 font-semibold text-gray-900">
                  {{ line.product }}
                  <div class="text-[10px] text-gray-400 font-normal">{{ line.sku }}</div>
                </td>
                <td class="py-3 text-gray-600">
                  <span class="px-2 py-0.5 rounded text-[10px] font-medium" :class="line.isSerialized ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-100 text-gray-700'">
                    {{ line.isSerialized ? 'Serialized Unit' : 'Bulk Product' }}
                  </span>
                </td>
                <td class="py-3 text-center font-bold text-gray-700">
                  {{ line.dispatchedQty }}
                </td>
                <td class="py-3 text-center text-gray-500">
                  {{ line.previouslyReceived }}
                </td>
                <td class="py-3 text-center font-bold text-[#165A31]">
                  {{ line.remainingToReceive }}
                </td>
                <td class="py-3 text-center">
                  <input 
                    v-model.number="line.currentReceived" 
                    type="number" 
                    min="0" 
                    :max="line.remainingToReceive"
                    class="w-20 px-2.5 py-1 text-center font-bold bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31]"
                  />
                </td>
                <td class="py-3 text-center">
                  <input 
                    v-model.number="line.damagedQty" 
                    type="number" 
                    min="0" 
                    :max="line.currentReceived || 0"
                    class="w-20 px-2.5 py-1 text-center font-bold bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-red-500 text-amber-700"
                  />
                </td>
                <td class="py-3 text-center font-bold" :class="Math.max(0, line.remainingToReceive - (line.currentReceived || 0)) > 0 ? 'text-red-500' : 'text-gray-400'">
                  {{ Math.max(0, line.remainingToReceive - (line.currentReceived || 0)) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Serial Units Details if Serialized -->
        <div v-for="(line, idx) in receivingLines.filter(l => l.isSerialized && l.serials?.length > 0)" :key="'ser-' + idx" class="bg-gray-50/50 rounded-xl p-4 border border-gray-100 space-y-2">
          <div class="text-xs font-bold text-gray-800 flex items-center justify-between">
            <span>Chassis Serials In Transit for {{ line.product }}:</span>
            <span class="text-[11px] text-gray-500 font-normal">First {{ line.currentReceived || 0 }} units will be inwarded to {{ transfer.to }}</span>
          </div>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="(s, sIdx) in line.serials" 
              :key="s" 
              class="px-2.5 py-1 rounded-md text-[11px] font-mono border"
              :class="sIdx < (line.currentReceived || 0) ? (sIdx < line.damagedQty ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-emerald-50 text-[#165A31] border-emerald-200 font-bold') : 'bg-gray-100 text-gray-400 border-gray-200 line-through'"
            >
              {{ s }} {{ sIdx < line.damagedQty ? '(QC Hold)' : '' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Receiver Information & Notes -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
          <h3 class="text-sm font-bold text-gray-900">Intake Details</h3>
          <div>
            <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Receiving Officer</label>
            <input 
              v-model="receiverName"
              type="text" 
              class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-[#165A31] transition-colors"
            />
          </div>
          <div>
            <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Storage Bay / Local Location</label>
            <input 
              v-model="receiverLocation"
              type="text" 
              class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-[#165A31] transition-colors"
            />
          </div>
        </div>

        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
          <h3 class="text-sm font-bold text-gray-900">Condition Notes &amp; Discrepancy Remarks</h3>
          <div>
            <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Receiver Observations</label>
            <textarea 
              v-model="receiverNotes"
              rows="4"
              placeholder="Record any exterior box defects, seal integrity, packaging discrepancies..."
              class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-[#165A31] transition-colors resize-none"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Bottom Reconciliation Summary Banner -->
      <div class="bg-[#f0fdf4] border border-[#dcfce7] rounded-xl px-5 py-4 text-xs text-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span class="font-bold text-gray-900 block">Inventory Ledger Impact:</span>
          <span class="text-gray-600">
            {{ totalCurrentReceived - totalDamaged }} units will become <strong class="text-[#165A31]">Available</strong> at {{ transfer.to }}.
            <span v-if="totalDamaged > 0"> {{ totalDamaged }} units will be placed on <strong class="text-amber-700">QC Hold</strong>.</span>
            <span v-if="isPartialReceipt"> {{ totalRemainingAfterReceipt }} units will remain <strong class="text-blue-700">In Transit</strong>.</span>
          </span>
        </div>
        <button 
          @click="confirmArrival" 
          class="bg-[#165A31] text-white text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer whitespace-nowrap"
        >
          Confirm Arrival &amp; Post
        </button>
      </div>
    </div>
  </div>
</template>
