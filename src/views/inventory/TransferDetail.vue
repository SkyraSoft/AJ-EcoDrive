<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { store } from '../../store.js'
import { ArrowLeft, Plus, CheckCircle2, AlertTriangle, Truck, PackageCheck, Send } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const showToast = ref(false)
const toastMessage = ref('')

const branchTransferId = computed(() => route.params.id || route.query.id || 'TR-221')
const currentTransfer = computed(() => store.getTransferById(branchTransferId.value))

const branchCurrentTab = ref('Summary')
const branchTabs = ['Summary', 'Items & Units', 'Dispatch & Logistics', 'Receiving & Discrepancies', 'Timeline']

const canDispatch = computed(() => {
  if (!currentTransfer.value) return false
  if (currentTransfer.value.status === 'In Transit' || currentTransfer.value.status === 'Received') return false
  if (isBranchUser.value) {
    return currentTransfer.value.from.toLowerCase() === (user.value?.branchName || '').toLowerCase()
  }
  return true
})

const canReceive = computed(() => {
  if (!currentTransfer.value) return false
  if (currentTransfer.value.status === 'Received') return false
  if (currentTransfer.value.status !== 'In Transit' && currentTransfer.value.status !== 'Partially Received') return false
  if (isBranchUser.value) {
    return currentTransfer.value.to.toLowerCase() === (user.value?.branchName || '').toLowerCase()
  }
  return true
})

const handleDispatch = () => {
  try {
    store.dispatchTransfer(currentTransfer.value.id, {
      dispatched: new Date().toISOString().split('T')[0],
      carrier: currentTransfer.value.carrier
    })
    toastMessage.value = `Transfer ${currentTransfer.value.id} dispatched! Units marked In Transit.`
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 3500)
  } catch (err) {
    alert(err.message)
  }
}

const branchTabData = computed(() => {
  const t = currentTransfer.value
  if (!t) return { title: '', items: [] }
  const branchName = user.value?.branchName || t.to || 'Peshawar'

  switch (branchCurrentTab.value) {
    case 'Summary':
      return {
        title: 'Summary',
        items: [
          { label: 'Direction', value: t.to === branchName ? 'Inbound' : 'Outbound' },
          { label: 'From Branch', value: `${t.from} Branch` },
          { label: 'To Branch', value: `${t.to} Branch` },
          { label: 'Total Units', value: String(t.units || t.totalUnits || 0) },
          { label: 'Status', value: t.status || 'In Transit' },
          { label: 'ETA / Arrival', value: t.expectedArrival || 'Tomorrow' }
        ]
      }
    case 'Items & Units':
      return {
        title: 'Items & Units',
        items: [
          { label: 'Primary Product', value: t.product || t.items?.[0]?.product || 'BRG EV' },
          { label: 'Line Items Count', value: `${t.items?.length || 1} product lines` },
          { label: 'Total Units', value: String(t.units || t.totalUnits || 0) },
          { label: 'Dispatched Count', value: `${t.items?.reduce((s, it) => s + (it.dispatchedQty || it.requestedQty || 0), 0) || t.units} Units` },
          { label: 'Received Count', value: `${t.items?.reduce((s, it) => s + (it.receivedQty || 0), 0)} Units` },
          { label: 'Notes', value: t.notes || 'Standard transfer' }
        ]
      }
    case 'Dispatch & Logistics':
      return {
        title: 'Dispatch & Logistics',
        items: [
          { label: 'Dispatched Date', value: t.dispatched || 'Pending dispatch' },
          { label: 'Dispatched By', value: t.dispatchedBy || 'Depot Officer' },
          { label: 'Carrier / Logistics', value: t.carrier || 'Internal logistics' },
          { label: 'Expected Arrival', value: t.expectedArrival || 'Tomorrow 14:00' },
          { label: 'Authorized Origin', value: `${t.from} Depot` },
          { label: 'Origin Notes', value: t.notes || '—' }
        ]
      }
    case 'Receiving & Discrepancies':
      return {
        title: 'Receiving & Discrepancies',
        items: [
          { label: 'Receiving Status', value: t.status === 'Received' ? 'Fully Received' : (t.status === 'Partially Received' ? 'Partial Intake Recorded' : 'Pending Intake') },
          { label: 'Received Date', value: t.receivedDate || 'Awaiting bay arrival' },
          { label: 'Receiver Notes', value: t.receiverNotes || 'Awaiting unloading inspection' },
          { label: 'Damaged Units Recorded', value: `${t.items?.reduce((s, it) => s + (it.damagedQty || 0), 0) || 0} Units` },
          { label: 'Shortage Detected', value: `${t.items?.reduce((s, it) => s + (it.shortQty || 0), 0) || 0} Units` },
          { label: 'Receiving Location', value: `${t.to} Main Showroom` }
        ]
      }
    case 'Timeline':
      return {
        title: 'Transfer Lifecycle Milestones',
        items: (t.timeline || []).map(tl => ({
          label: tl.date || 'Milestone',
          value: `${tl.title} — ${tl.desc} (${tl.user || 'System'})`
        }))
      }
    default:
      return { title: 'Summary', items: [] }
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

  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[11px] text-gray-400 mb-1">
          <span v-if="isBranchUser">Branch Manager / Transfers / <span class="font-medium text-gray-600">Transfer {{ branchTransferId }}</span></span>
          <span v-else>Super Admin / Inventory / Transfers / <span class="font-medium text-gray-600">Transfer {{ branchTransferId }}</span></span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Transfer {{ branchTransferId }}</h1>
        <p class="text-xs text-gray-500 mt-1">Movement record and serialized consignment tracking.</p>
      </div>
      <div class="flex items-center gap-2.5">
        <button 
          @click="router.push('/inventory/transfers')" 
          class="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
        >
          <ArrowLeft class="w-3.5 h-3.5" /> Back
        </button>

        <button 
          v-if="canDispatch"
          @click="handleDispatch" 
          class="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
        >
          <Send class="w-3.5 h-3.5" /> <span>Dispatch Transfer</span>
        </button>

        <button 
          v-if="canReceive"
          @click="router.push(`/inventory/transfers/receive?id=${branchTransferId}`)" 
          class="bg-[#165A31] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer"
        >
          <PackageCheck class="w-4 h-4" /> <span>Receive Consignment</span>
        </button>
      </div>
    </div>

    <!-- NOT FOUND STATE -->
    <div v-if="!currentTransfer" class="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm space-y-3">
      <div class="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
        <AlertTriangle class="w-6 h-6" />
      </div>
      <h2 class="text-lg font-bold text-gray-900">Transfer Not Found</h2>
      <p class="text-xs text-gray-500 max-w-md mx-auto">The transfer identifier "{{ branchTransferId }}" does not match any record in the canonical transfer master.</p>
      <div class="pt-2">
        <button 
          @click="router.push('/inventory/transfers')" 
          class="px-4 py-2 text-xs font-bold text-[#165A31] bg-[#eefcf2] hover:bg-[#dcfce7] rounded-lg transition-colors"
        >
          Return to Transfers
        </button>
      </div>
    </div>

    <!-- ACTIVE RECORD VIEW -->
    <div v-else class="space-y-6">
      <!-- Route & Status Overview Card -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-3">
            <h2 class="text-[24px] font-bold text-gray-900">{{ currentTransfer.id }}</h2>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold whitespace-nowrap" :class="currentTransfer.statusClass || 'bg-[#dcfce7] text-[#165A31]'">
              {{ currentTransfer.status }}
            </span>
          </div>
          <p class="text-xs text-gray-500 mt-1 font-medium flex items-center gap-2">
            <span>{{ currentTransfer.from }} Branch</span>
            <span>&rarr;</span>
            <span class="font-bold text-[#165A31]">{{ currentTransfer.to }} Branch</span>
            <span>&middot;</span>
            <span>{{ currentTransfer.units }} units</span>
            <span>&middot;</span>
            <span>Carrier: {{ currentTransfer.carrier }}</span>
          </p>
        </div>

        <div class="flex items-center gap-3 text-xs">
          <div class="bg-gray-50 rounded-lg px-3.5 py-2 border border-gray-100 text-right">
            <span class="text-[10px] text-gray-400 font-semibold uppercase block">Requested By</span>
            <span class="font-bold text-gray-900 block mt-0.5">{{ currentTransfer.requestedBy }}</span>
          </div>
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

            <!-- If on Items & Units tab, show detailed table with serials -->
            <div v-if="branchCurrentTab === 'Items & Units'" class="mt-6 space-y-4">
              <h4 class="text-xs font-bold text-gray-900">Consigned Item Details</h4>
              <div class="overflow-x-auto">
                <table class="w-full text-left text-xs border border-gray-100 rounded-lg overflow-hidden">
                  <thead class="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <tr>
                      <th class="p-3">Product</th>
                      <th class="p-3">SKU</th>
                      <th class="p-3 text-center">Dispatched</th>
                      <th class="p-3 text-center">Received</th>
                      <th class="p-3">Serial Numbers</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-50">
                    <tr v-for="(item, i) in currentTransfer.items" :key="i">
                      <td class="p-3 font-bold text-gray-900">{{ item.product }}</td>
                      <td class="p-3 text-gray-500">{{ item.sku }}</td>
                      <td class="p-3 text-center font-bold text-gray-800">{{ item.dispatchedQty || item.requestedQty }}</td>
                      <td class="p-3 text-center font-bold text-[#165A31]">{{ item.receivedQty || 0 }}</td>
                      <td class="p-3">
                        <div v-if="item.serials && item.serials.length > 0" class="flex flex-wrap gap-1.5">
                          <router-link 
                            v-for="s in item.serials" 
                            :key="s"
                            :to="`/inventory/serialized-units/${s}`"
                            class="px-2 py-0.5 bg-gray-100 hover:bg-[#dcfce7] text-gray-700 hover:text-[#165A31] text-[10px] font-mono rounded transition-colors"
                          >
                            {{ s }}
                          </router-link>
                        </div>
                        <span v-else class="text-gray-400 text-[11px]">Bulk Quantity</span>
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
            <h3 class="text-sm font-bold text-gray-900">Branch Scope &amp; Context</h3>
            
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5">
                <span class="text-[10px] font-medium text-gray-400">Dispatch</span>
                <span class="text-sm font-bold text-gray-900 mt-1 block">{{ currentTransfer.dispatched || 'Pending' }}</span>
              </div>
              <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5">
                <span class="text-[10px] font-medium text-gray-400">Receiving</span>
                <span class="text-sm font-bold text-gray-900 mt-1 block">{{ currentTransfer.status === 'Received' ? 'Completed' : 'Pending' }}</span>
              </div>
              <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5">
                <span class="text-[10px] font-medium text-gray-400">Shortage</span>
                <span class="text-sm font-bold text-gray-900 mt-1 block">{{ currentTransfer.items?.reduce((s, it) => s + (it.shortQty || 0), 0) || 0 }}</span>
              </div>
              <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5">
                <span class="text-[10px] font-medium text-gray-400">Damaged</span>
                <span class="text-sm font-bold text-gray-900 mt-1 block">{{ currentTransfer.items?.reduce((s, it) => s + (it.damagedQty || 0), 0) || 0 }}</span>
              </div>
            </div>

            <div class="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100/60 text-[11px] text-gray-600">
              Transfer is linked to the canonical inventory ledger. Changes apply atomically.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
