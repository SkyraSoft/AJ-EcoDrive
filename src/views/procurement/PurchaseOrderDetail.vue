<script setup>
import { Pencil, ArrowLeft, PackageCheck, Truck, ShieldCheck, Eye } from 'lucide-vue-next'
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { store } from '../../store.js'

const router = useRouter()
const route = useRoute()

const poId = computed(() => route.params.id || route.query.id || 'PO-2048')
const poRecord = computed(() => {
  return store.getPurchaseOrderById(poId.value) || store.purchaseOrders[0] || {
    id: 'PO-2048',
    po: 'PO-2048',
    supplier: 'BRG Factory',
    destination: 'Peshawar',
    amount: 'PKR 2.8M',
    units: '16',
    totalOrdered: 16,
    totalReceived: 0,
    remainingUnits: 16,
    expected: 'Aug 29',
    status: 'In Transit'
  }
})

const activeTab = ref('Summary')
const showMoreMenu = ref(false)
const showCancelModal = ref(false)
const tabs = ['Summary', 'Items', 'Shipment', 'Receipts', 'Landed Costs', 'Vendor Bills', 'Payments', 'Documents', 'Activity']

// Reactive items from canonical PO
const poItems = computed(() => {
  if (poRecord.value?.items && poRecord.value.items.length > 0) {
    return poRecord.value.items.map(item => {
      const ordered = parseInt(item.ordered || item.qty || 0)
      const received = parseInt(item.received || item.previouslyReceived || 0)
      const remaining = Math.max(0, ordered - received)
      return {
        product: item.product || item.name,
        sku: item.sku || 'SKU-GEN',
        qty: String(ordered),
        ordered,
        received,
        remaining,
        cost: item.cost || item.unitCost || 'PKR 150K',
        subtotal: item.subtotal || 'PKR 0'
      }
    })
  }
  return [
    { product: 'BRG DS11', sku: 'BRG-DS11', qty: '8', ordered: 8, received: 0, remaining: 8, cost: '146K', subtotal: '1.168M' },
    { product: 'BRG EV-5', sku: 'BRG-EV5', qty: '5', ordered: 5, received: 0, remaining: 5, cost: '168K', subtotal: '840K' },
    { product: 'Cargo Pro', sku: 'BRG-CARGO', qty: '3', ordered: 3, received: 0, remaining: 3, cost: '214K', subtotal: '642K' }
  ]
})

// Reactive receipts associated with this PO
const poReceipts = computed(() => {
  return store.getReceiptsByPoId(poId.value)
})

const documents = computed(() => poRecord.value?.documents || [
  { name: `${poRecord.value?.po || 'PO-2048'}.pdf`, type: 'Purchase Order', uploaded: 'Aug 12' },
  { name: 'Proforma_Invoice.pdf', type: 'Supplier', uploaded: 'Aug 10' },
  { name: 'Shipping_Doc.pdf', type: 'Shipment', uploaded: 'Aug 18' }
])

const activities = computed(() => {
  const id = poRecord.value?.po || poRecord.value?.id || poId.value
  const logs = store.getAuditLogsForEntity('purchase_order', id)
  if (logs && logs.length > 0) {
    return logs.map(l => ({
      text: `${l.action || l.operation}: ${l.description || l.result} (${l.user || l.actor_name || 'System'})`,
      date: l.timestamp || 'Recorded'
    }))
  }
  return poRecord.value?.activities || [
    { text: `Shipment marked ${poRecord.value?.status || 'In Transit'}`, date: 'Aug 18' },
    { text: 'PO approved by Super Admin', date: 'Aug 12' },
    { text: 'PO submitted by Branch Manager', date: 'Aug 11' }
  ]
})

const handleReceiveShipment = () => {
  router.push(`/procurement/purchase-orders/${poRecord.value.po}/receive`)
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1 flex items-center gap-1">
          <router-link to="/procurement/purchase-orders" class="hover:underline">Purchase Orders</router-link>
          <span>/</span>
          <span class="font-bold text-gray-800">{{ poRecord.po }} &bull; {{ activeTab }}</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Purchase Order {{ poRecord.po }}</h1>
        <p class="text-sm text-gray-500 mt-1">{{ poRecord.supplier }} &rarr; {{ poRecord.destination || poRecord.branch }}</p>
      </div>

      <div class="flex items-center gap-3">
        <button 
          @click="$router.push('/procurement/purchase-orders')" 
          class="px-4 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-1.5"
        >
          <ArrowLeft class="w-3.5 h-3.5" /> Back to Orders
        </button>
      </div>
    </div>

    <!-- PO Overview Card -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="flex items-center gap-3">
          <h2 class="text-[22px] font-bold text-gray-900">{{ poRecord.po }}</h2>
          <span 
            class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold"
            :class="poRecord.status === 'Fully Received' || poRecord.status === 'Received' ? 'bg-[#eefcf2] text-[#165A31]' : (poRecord.status === 'Partially Received' ? 'bg-orange-50 text-orange-700' : (poRecord.status === 'In Transit' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-700'))"
          >
            {{ poRecord.status }}
          </span>
        </div>
        <p class="text-[11px] text-gray-500 mt-1 font-medium">{{ poRecord.supplier }} &bull; Destination: {{ poRecord.destination || poRecord.branch }} Branch</p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <!-- Receive Shipment Button -->
        <button 
          v-if="poRecord.status !== 'Fully Received' && (poRecord.remainingUnits === undefined || poRecord.remainingUnits > 0)"
          @click="handleReceiveShipment" 
          class="px-4 py-2 text-[11px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <PackageCheck class="w-4 h-4" /> Receive Shipment
        </button>

        <span v-else class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#eefcf2] text-[#165A31]">
          <PackageCheck class="w-4 h-4" /> Fully Inwarded
        </span>

        <button class="px-3 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm" title="Edit">
          <Pencil class="w-3.5 h-3.5" />
        </button>

        <div class="relative">
          <button @click="showMoreMenu = !showMoreMenu" class="px-3 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-1">
            More <span class="text-[8px]">▼</span>
          </button>
          <div v-if="showMoreMenu" class="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-[12px] shadow-lg py-2 z-10">
            <div class="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Actions</div>
            <button @click="handleReceiveShipment; showMoreMenu = false" class="w-full text-left px-4 py-2 text-[11px] font-medium text-gray-700 hover:bg-gray-50">Receive goods</button>
            <button class="w-full text-left px-4 py-2 text-[11px] font-medium text-gray-700 hover:bg-gray-50">Duplicate PO</button>
            <div class="my-1 border-t border-gray-50"></div>
            <button @click="showCancelModal = true; showMoreMenu = false" class="w-full text-left px-4 py-2 text-[11px] font-medium text-red-600 hover:bg-red-50">Cancel PO</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Cancel Modal -->
    <div v-if="showCancelModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-[12px] w-[400px] shadow-xl">
        <h3 class="text-lg font-bold text-gray-900 mb-2">Cancel Purchase Order</h3>
        <p class="text-[11px] text-gray-500 mb-6">Are you sure you want to cancel {{ poRecord.po }}? This action cannot be undone.</p>
        <div class="flex flex-wrap justify-end gap-3">
          <button @click="showCancelModal = false" class="px-4 py-2 text-[11px] font-bold text-gray-600 hover:text-gray-900">Keep PO</button>
          <button @click="showCancelModal = false" class="px-4 py-2 text-[11px] font-bold text-white bg-red-600 rounded-lg hover:bg-red-700">Confirm Cancel</button>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex items-center gap-6 border-b border-gray-100 overflow-x-auto">
      <button 
        v-for="tab in tabs" 
        :key="tab"
        @click="activeTab = tab"
        class="pb-3 text-[11px] font-bold tracking-wider relative transition-colors whitespace-nowrap cursor-pointer"
        :class="activeTab === tab ? 'text-[#165A31]' : 'text-gray-400 hover:text-gray-600'"
      >
        {{ tab }}
        <span v-if="tab === 'Receipts' && poReceipts.length > 0" class="ml-1 px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] rounded-full">
          {{ poReceipts.length }}
        </span>
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
            <div class="text-[11px] font-semibold text-gray-400 mb-2">PO Value</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">{{ poRecord.amount }}</div>
          </div>
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">Ordered Units</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">{{ poRecord.totalOrdered || poRecord.units }}</div>
          </div>
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">Received Units</div>
            <div class="text-[22px] font-bold text-blue-700 leading-none">{{ poRecord.totalReceived || 0 }}</div>
          </div>
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">Remaining Units</div>
            <div class="text-[22px] font-bold text-[#165A31] leading-none">{{ poRecord.remainingUnits !== undefined ? poRecord.remainingUnits : (parseInt(poRecord.units || 0) - (poRecord.totalReceived || 0)) }}</div>
          </div>
        </div>

        <!-- Summary Details -->
        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
          <h3 class="text-[14px] font-bold text-gray-900 mb-6">Summary</h3>
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px]">
              <span class="text-gray-500 font-medium">Supplier</span>
              <span class="font-bold text-gray-900">{{ poRecord.supplier }}</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px]">
              <span class="text-gray-500 font-medium">Destination Branch</span>
              <span class="font-bold text-gray-900">{{ poRecord.destination || poRecord.branch }} Branch</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px]">
              <span class="text-gray-500 font-medium">Approval</span>
              <span class="font-bold text-gray-900">Approved &bull; Order Date: {{ poRecord.orderDate || 'Aug 11' }}</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px]">
              <span class="text-gray-500 font-medium">Shipment Status</span>
              <span class="font-bold text-gray-900">{{ poRecord.carrier || 'Pak Logistics' }} ({{ poRecord.tracking || 'PL-88-2048' }}) &bull; {{ poRecord.status }}</span>
            </div>
          </div>
        </div>
      </template>

      <!-- Tab Content: Items -->
      <div v-else-if="activeTab === 'Items'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-[14px] font-bold text-gray-900">PO Items & Delivery Progress</h3>
          <span class="text-xs text-gray-500">Total Ordered: <strong>{{ poRecord.totalOrdered || poRecord.units }}</strong> &bull; Total Received: <strong>{{ poRecord.totalReceived || 0 }}</strong></span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase">
                <th class="px-5 py-3">Product</th>
                <th class="px-5 py-3">SKU</th>
                <th class="px-4 py-3 text-center">Ordered</th>
                <th class="px-4 py-3 text-center">Received</th>
                <th class="px-4 py-3 text-center">Remaining</th>
                <th class="px-5 py-3">Unit Cost</th>
                <th class="px-5 py-3">Subtotal</th>
              </tr>
            </thead>
            <tbody class="text-[11px] divide-y divide-gray-50">
              <tr v-for="item in poItems" :key="item.sku" class="hover:bg-gray-50/50">
                <td class="px-5 py-4 font-semibold text-gray-900">{{ item.product }}</td>
                <td class="px-5 py-4 text-gray-600 font-mono text-[10px]">{{ item.sku }}</td>
                <td class="px-4 py-4 text-center font-bold text-gray-800">{{ item.ordered }}</td>
                <td class="px-4 py-4 text-center font-bold text-blue-700">{{ item.received }}</td>
                <td class="px-4 py-4 text-center font-bold" :class="item.remaining === 0 ? 'text-[#165A31]' : 'text-amber-700'">
                  {{ item.remaining }}
                </td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.cost }}</td>
                <td class="px-5 py-4 text-gray-900 font-bold">{{ item.subtotal }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab Content: Shipment -->
      <div v-else-if="activeTab === 'Shipment'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">Shipment & Logistics</h3>
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px]">
            <span class="text-gray-500 font-medium">Carrier</span>
            <span class="font-bold text-gray-900">{{ poRecord.carrier || 'Pak Logistics' }}</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px]">
            <span class="text-gray-500 font-medium">Tracking #</span>
            <span class="font-bold text-gray-900 font-mono">{{ poRecord.tracking || 'PL-88-2048' }}</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px]">
            <span class="text-gray-500 font-medium">Departed</span>
            <span class="font-bold text-gray-900">{{ poRecord.orderDate || 'Aug 18' }}</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px]">
            <span class="text-gray-500 font-medium">Expected Delivery</span>
            <span class="font-bold text-gray-900">{{ poRecord.expected || poRecord.expectedDate || 'Aug 29' }}</span>
          </div>
        </div>
      </div>

      <!-- Tab Content: Receipts (Dynamic GRN List) -->
      <div v-else-if="activeTab === 'Receipts'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 class="text-[14px] font-bold text-gray-900">Goods Receipts (GRN) for {{ poRecord.po }}</h3>
            <p class="text-xs text-gray-500">Record of physical deliveries inwarded against this purchase order.</p>
          </div>
          
          <button 
            v-if="poRecord.status !== 'Fully Received' && (poRecord.remainingUnits === undefined || poRecord.remainingUnits > 0)"
            @click="handleReceiveShipment"
            class="px-3.5 py-1.5 text-xs font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] flex items-center gap-1.5 shadow-sm"
          >
            <PackageCheck class="w-3.5 h-3.5" /> Receive New Consignment
          </button>
        </div>

        <div v-if="poReceipts.length > 0" class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase">
                <th class="px-5 py-3">GRN #</th>
                <th class="px-5 py-3">Receipt Date</th>
                <th class="px-5 py-3">Receiver</th>
                <th class="px-4 py-3 text-center">Items Received</th>
                <th class="px-5 py-3">Status</th>
                <th class="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="rec in poReceipts" :key="rec.id" class="hover:bg-gray-50/50">
                <td class="px-5 py-3.5 font-bold font-mono text-gray-900">{{ rec.id }}</td>
                <td class="px-5 py-3.5 text-gray-600">{{ rec.receipt_date }}</td>
                <td class="px-5 py-3.5 text-gray-700 font-medium">{{ rec.received_by || rec.receiver }}</td>
                <td class="px-4 py-3.5 text-center font-bold text-[#165A31]">
                  {{ rec.lines ? rec.lines.reduce((s, l) => s + (l.current_received_quantity || l.received || 0), 0) : '—' }} units
                </td>
                <td class="px-5 py-3.5">
                  <span 
                    class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold"
                    :class="rec.status === 'Posted' ? 'bg-[#eefcf2] text-[#165A31]' : 'bg-gray-100 text-gray-700'"
                  >
                    {{ rec.status }}
                  </span>
                </td>
                <td class="px-5 py-3.5 text-right">
                  <router-link 
                    :to="`/procurement/receipts/${rec.id}`" 
                    class="inline-flex items-center gap-1 text-[11px] font-bold text-[#165A31] hover:underline"
                  >
                    <Eye class="w-3.5 h-3.5" /> View GRN
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="p-8 text-center space-y-3">
          <Truck class="w-8 h-8 text-gray-300 mx-auto" />
          <p class="text-xs text-gray-500">No goods receipts have been posted against this PO yet.</p>
          <button 
            @click="handleReceiveShipment"
            class="px-4 py-2 bg-[#165A31] text-white text-xs font-bold rounded-lg hover:bg-[#124a28] shadow-sm"
          >
            Inward Physical Consignment
          </button>
        </div>
      </div>

      <!-- Tab Content: Landed Costs -->
      <div v-else-if="activeTab === 'Landed Costs'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">Landed Cost Status</h3>
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px]">
            <span class="text-gray-500 font-medium">Base Cost</span>
            <span class="font-bold text-gray-900">{{ poRecord.amount }}</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px]">
            <span class="text-gray-500 font-medium">Freight Estimate</span>
            <span class="font-bold text-gray-900">PKR 150K</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px]">
            <span class="text-gray-500 font-medium">Allocation</span>
            <span class="font-bold text-gray-900">{{ poRecord.status === 'Fully Received' ? 'Allocated to Inventory' : 'Pending final receipt' }}</span>
          </div>
        </div>
      </div>

      <!-- Tab Content: Vendor Bills -->
      <div v-else-if="activeTab === 'Vendor Bills'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">Vendor Bills</h3>
        <div class="flex flex-wrap items-center gap-4 bg-[#fbfbfc] p-4 rounded-lg border border-gray-100">
          <span class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-orange-50 text-orange-600">
            {{ poReceipts.length > 0 ? 'Ready for Invoicing' : 'Pending Receipt' }}
          </span>
          <span class="text-[11px] font-bold text-gray-900">
            {{ poReceipts.length > 0 ? `Matched with ${poReceipts.length} GRN receipt(s)` : 'Awaiting receipt confirmation before bill generation' }}
          </span>
        </div>
      </div>

      <!-- Tab Content: Payments -->
      <div v-else-if="activeTab === 'Payments'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">Payments</h3>
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px]">
            <span class="text-gray-500 font-medium">Payment Terms</span>
            <span class="font-bold text-gray-900">30 days from GRN</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px]">
            <span class="text-gray-500 font-medium">Paid Amount</span>
            <span class="font-bold text-gray-900">PKR 0</span>
          </div>
        </div>
      </div>

      <!-- Tab Content: Documents -->
      <div v-else-if="activeTab === 'Documents'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">Documents</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                <th class="px-5 py-3">Document</th>
                <th class="px-5 py-3">Type</th>
                <th class="px-5 py-3">Uploaded</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="doc in documents" :key="doc.name" class="border-b border-gray-50">
                <td class="px-5 py-4 font-semibold text-gray-900">{{ doc.name }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ doc.type }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ doc.uploaded }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab Content: Activity -->
      <div v-else-if="activeTab === 'Activity'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">PO Activity Log</h3>
        </div>
        <div class="p-6 space-y-4">
          <div v-for="(activity, i) in activities" :key="i" class="flex items-start gap-3">
            <div class="mt-1 w-1.5 h-1.5 rounded-full bg-[#165A31]"></div>
            <div class="flex-1 flex justify-between">
              <span class="text-[11px] font-bold text-gray-900">{{ activity.text }}</span>
              <span class="text-[11px] font-medium text-gray-500">{{ activity.date }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

