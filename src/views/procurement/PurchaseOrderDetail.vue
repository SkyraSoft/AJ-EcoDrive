<script setup>
import { Pencil } from 'lucide-vue-next'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('Summary')
const showMoreMenu = ref(false)
const showCancelModal = ref(false)
const tabs = ['Summary', 'Items', 'Shipment', 'Receipts', 'Landed Costs', 'Vendor Bills', 'Payments', 'Documents', 'Activity']

const items = [
  { product: 'BRG DS11', sku: 'BRG-DS11', qty: '8', cost: '146K', subtotal: '1.168M', received: '0' },
  { product: 'BRG EV-5', sku: 'BRG-EV5', qty: '5', cost: '168K', subtotal: '840K', received: '0' },
  { product: 'Cargo Pro', sku: 'BRG-CARGO', qty: '3', cost: '214K', subtotal: '642K', received: '0' }
]

const documents = [
  { name: 'PO-2048.pdf', type: 'Purchase Order', uploaded: 'Aug 12' },
  { name: 'Proforma.pdf', type: 'Supplier', uploaded: 'Aug 10' },
  { name: 'Shipping_Doc.pdf', type: 'Shipment', uploaded: 'Aug 18' }
]

const activities = [
  { text: 'Shipment marked In Transit', date: 'Aug 18' },
  { text: 'PO approved', date: 'Aug 12' },
  { text: 'PO submitted', date: 'Aug 11' }
]
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Procurement / Purchase Orders / <span class="font-bold text-gray-800">Purchase Order Detail — {{ activeTab }}</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Purchase Order Detail — {{ activeTab }}</h1>
        <p class="text-sm text-gray-500 mt-1">PO-2048 - {{ activeTab }}</p>
      </div>
    </div>

    <!-- PO Overview Card -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <h2 class="text-[22px] font-bold text-gray-900">PO-2048</h2>
        <p class="text-[11px] text-gray-500 mt-1 font-medium">BRG Factory - Destination: Peshawar Branch</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <span class="inline-flex items-center px-2 py-1 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">
          Approved
        </span>
        <button class="px-4 py-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]" title="Edit"><Pencil class="w-4 h-4" /></button>
        <div class="relative">
          <button @click="showMoreMenu = !showMoreMenu" class="px-3 py-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center gap-1">
            More <span class="text-[8px]">▼</span>
          </button>
          <div v-if="showMoreMenu" class="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-[12px] shadow-lg py-2 z-10">
            <div class="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Actions</div>
            <button class="w-full text-left px-4 py-2 text-[11px] font-medium text-gray-700 hover:bg-gray-50">Open purchase order</button>
            <button class="w-full text-left px-4 py-2 text-[11px] font-medium text-gray-700 hover:bg-gray-50">Edit draft</button>
            <button class="w-full text-left px-4 py-2 text-[11px] font-medium text-gray-700 hover:bg-gray-50">Send for approval</button>
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
        <p class="text-[11px] text-gray-500 mb-6">Are you sure you want to cancel PO-2048? This action cannot be undone.</p>
        <div class="flex flex-wrap justify-end gap-3">
          <button @click="showCancelModal = false" class="px-4 py-2 text-[11px] font-bold text-gray-600 hover:text-gray-900">Keep PO</button>
          <button @click="showCancelModal = false" class="px-4 py-2 text-[11px] font-bold text-white bg-red-600 rounded-lg hover:bg-red-700">Confirm Cancel</button>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex items-center gap-6 border-b border-gray-100">
      <button 
        v-for="tab in tabs" 
        :key="tab"
        @click="activeTab = tab"
        class="pb-3 text-[11px] font-bold tracking-wider relative transition-colors"
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
            <div class="text-[11px] font-semibold text-gray-400 mb-2">PO Value</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">PKR 2.8M</div>
          </div>
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">Units</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">16</div>
          </div>
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">Received</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">0</div>
          </div>
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">ETA</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">Aug 29</div>
          </div>
        </div>

        <!-- Summary Details -->
        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
          <h3 class="text-[14px] font-bold text-gray-900 mb-6">Summary</h3>
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">Supplier</span>
              <span class="font-bold text-gray-900">BRG Factory</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">Destination</span>
              <span class="font-bold text-gray-900">Peshawar Branch</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">Approval</span>
              <span class="font-bold text-gray-900">Approved Aug 12</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">Shipment</span>
              <span class="font-bold text-gray-900">In transit</span>
            </div>
          </div>
        </div>
      </template>

      <!-- Tab Content: Items -->
      <div v-else-if="activeTab === 'Items'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">PO Items</h3>
        </div>
        <div class="overflow-x-auto">
          <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                <th class="px-5 py-3">Product</th>
                <th class="px-5 py-3">SKU</th>
                <th class="px-5 py-3">Qty</th>
                <th class="px-5 py-3">Expected Unit Cost</th>
                <th class="px-5 py-3">Subtotal</th>
                <th class="px-5 py-3">Received</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="item in items" :key="item.sku" class="border-b border-gray-50">
                <td class="px-5 py-4 font-semibold text-gray-900">{{ item.product }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.sku }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.qty }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.cost }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.subtotal }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.received }}</td>
              </tr>
            </tbody>
          </table></div>
        </div>
      </div>

      <!-- Tab Content: Shipment -->
      <div v-else-if="activeTab === 'Shipment'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">Shipment</h3>
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Carrier</span>
            <span class="font-bold text-gray-900">Pak Logistics</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Tracking</span>
            <span class="font-bold text-gray-900">PL-88-2048</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Departed</span>
            <span class="font-bold text-gray-900">Aug 18</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Expected</span>
            <span class="font-bold text-gray-900">Aug 29</span>
          </div>
        </div>
      </div>

      <!-- Tab Content: Receipts -->
      <div v-else-if="activeTab === 'Receipts'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">Receipts</h3>
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 bg-[#fbfbfc] p-4 rounded-lg border border-gray-100">
          <div class="flex flex-wrap items-center gap-4">
            <span class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-blue-50 text-blue-600">Expected</span>
            <span class="text-[11px] font-bold text-gray-900">No receipt posted yet</span>
          </div>
          <button @click="$router.push('/procurement/receipts')" class="text-[11px] font-medium text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1">
            Receive Purchase &rarr;
          </button>
        </div>
      </div>

      <!-- Tab Content: Landed Costs -->
      <div v-else-if="activeTab === 'Landed Costs'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">Landed Cost Status</h3>
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Base Cost</span>
            <span class="font-bold text-gray-900">PKR 2.65M</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Freight Estimate</span>
            <span class="font-bold text-gray-900">PKR 150K</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Allocation</span>
            <span class="font-bold text-gray-900">Pending receipt</span>
          </div>
        </div>
      </div>

      <!-- Tab Content: Vendor Bills -->
      <div v-else-if="activeTab === 'Vendor Bills'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">Vendor Bills</h3>
        <div class="flex flex-wrap items-center gap-4 bg-[#fbfbfc] p-4 rounded-lg border border-gray-100">
          <span class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-orange-50 text-orange-600">Not Received</span>
          <span class="text-[11px] font-bold text-gray-900">No supplier bill linked yet</span>
        </div>
      </div>

      <!-- Tab Content: Payments -->
      <div v-else-if="activeTab === 'Payments'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">Payments</h3>
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Payment Terms</span>
            <span class="font-bold text-gray-900">30 days</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Paid</span>
            <span class="font-bold text-gray-900">PKR 0</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Outstanding</span>
            <span class="font-bold text-gray-900">Pending supplier bill</span>
          </div>
        </div>
      </div>

      <!-- Tab Content: Documents -->
      <div v-else-if="activeTab === 'Documents'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">Documents</h3>
        </div>
        <div class="overflow-x-auto">
          <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse">
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
          </table></div>
        </div>
      </div>

      <!-- Tab Content: Activity -->
      <div v-else-if="activeTab === 'Activity'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">PO Activity</h3>
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

    <!-- Cancel PO Modal -->
    <div v-if="showCancelModal" class="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-[16px] shadow-xl w-full max-w-[400px] p-6 relative">
        <div class="w-10 h-10 bg-red-50 rounded-[10px] flex items-center justify-center mb-5 text-red-500 text-lg font-bold">!</div>
        <h3 class="text-[18px] font-bold text-gray-900 mb-2">Cancel purchase order?</h3>
        <p class="text-[12px] text-gray-500 mb-8">PO-1048 will be cancelled. Received stock and posted financial records are not deleted.</p>
        <div class="flex items-center justify-end gap-3">
          <button @click="showCancelModal = false" class="px-5 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
          <button @click="showCancelModal = false" class="px-5 py-2 text-[11px] font-bold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors">Cancel PO</button>
        </div>
      </div>
    </div>
  </div>
</template>
