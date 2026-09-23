<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../../store.js'

const router = useRouter()
const emit = defineEmits(['close'])

const closeForm = () => {
  emit('close')
  if (window.history.state?.back) {
    router.back()
  } else {
    router.push('/procurement/purchase-orders')
  }
}

const form = ref({
  supplier: 'BRG Factory',
  destination: store.getActiveBranch() || 'Peshawar',
  expectedArrival: '2026-09-30',
  qtyDs11: 8,
  qtyEv5: 5,
  qtyCargo: 3,
  expectedCost: 'PKR 2,650,000',
  estimatedFreight: 'PKR 150,000',
  shipmentMethod: 'Sea + Road',
  paymentTerms: '30 days',
  documents: 'Supplier_Proforma.pdf',
  notes: 'September replenishment consignment.'
})

const handleSave = (status = 'Pending Approval') => {
  const items = []
  if (form.value.qtyDs11 > 0) {
    items.push({
      product_id: 'PROD-003',
      product: 'BRG DS11',
      sku: 'SKU-DS11-BLU',
      ordered: parseInt(form.value.qtyDs11),
      previouslyReceived: 0,
      received: 0,
      cost: 'PKR 146,000',
      subtotal: `PKR ${(form.value.qtyDs11 * 146000).toLocaleString()}`,
      isSerialized: true
    })
  }
  if (form.value.qtyEv5 > 0) {
    items.push({
      product_id: 'PROD-004',
      product: 'BRG EV-5',
      sku: 'SKU-EV5-01',
      ordered: parseInt(form.value.qtyEv5),
      previouslyReceived: 0,
      received: 0,
      cost: 'PKR 168,000',
      subtotal: `PKR ${(form.value.qtyEv5 * 168000).toLocaleString()}`,
      isSerialized: true
    })
  }
  if (form.value.qtyCargo > 0) {
    items.push({
      product_id: 'PROD-006',
      product: 'Cargo Pro',
      sku: 'SKU-CPRO-YEL',
      ordered: parseInt(form.value.qtyCargo),
      previouslyReceived: 0,
      received: 0,
      cost: 'PKR 214,000',
      subtotal: `PKR ${(form.value.qtyCargo * 214000).toLocaleString()}`,
      isSerialized: true
    })
  }

  const totalUnits = items.reduce((s, i) => s + i.ordered, 0)
  const poNumber = `PO-${Math.floor(2050 + Math.random() * 900)}`

  const newPo = store.addPurchaseOrder({
    po: poNumber,
    po_id: poNumber,
    supplier_id: 'SUP-01',
    supplier: form.value.supplier,
    destination: form.value.destination,
    branch_id: form.value.destination === 'Islamabad' ? 'BR-02' : (form.value.destination === 'Lahore' ? 'BR-03' : 'BR-01'),
    branch: form.value.destination,
    amount: form.value.expectedCost,
    units: String(totalUnits),
    totalOrdered: totalUnits,
    totalReceived: 0,
    remainingUnits: totalUnits,
    orderDate: new Date().toISOString().split('T')[0],
    expected: 'Sep 30',
    expectedDate: form.value.expectedArrival,
    carrier: form.value.shipmentMethod,
    tracking: `TRK-${poNumber}`,
    status,
    match: `0/${totalUnits}`,
    action: status === 'Approved' ? 'Open · Receive' : 'Open',
    items,
    documents: [
      { name: `${poNumber}.pdf`, type: 'Purchase Order', uploaded: 'Today' }
    ],
    activities: [
      { text: `PO created with status: ${status}`, date: 'Today' }
    ]
  })

  emit('close')
  router.push(`/procurement/purchase-orders/${newPo.po}`)
}
</script>

<template>
  <div class="fixed inset-0 bg-gray-900/50 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm" @click.self="closeForm">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      
      <!-- Close button on top right -->
      <button @click="closeForm" class="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-100 rounded-full z-50 shadow-sm transition-colors cursor-pointer">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Scrollable Body -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
        
        <div class="space-y-6">
          <!-- Header -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            <div>
              <div class="text-[10px] text-gray-500 mb-1">Super Admin / Procurement / Purchase Orders / <span class="font-bold text-gray-800">Create Purchase Order</span></div>
              <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Create Purchase Order</h1>
              <p class="text-sm text-gray-500 mt-1">Create procurement demand without changing inventory.</p>
            </div>
          </div>

          <!-- Form Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-6">
            
            <!-- 1. Supplier & Destination -->
            <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
              <h3 class="text-[14px] font-bold text-gray-900 mb-2">1. Supplier & Destination</h3>
              
              <div>
                <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Supplier</label>
                <input v-model="form.supplier" type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
              </div>
              
              <div>
                <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Destination</label>
                <select v-model="form.destination" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
                  <option value="Peshawar">Peshawar</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                  <option value="All Branches">All Branches</option>
                </select>
              </div>

              <div>
                <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Expected Arrival</label>
                <input v-model="form.expectedArrival" type="date" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
              </div>
            </div>

            <!-- 2. Products -->
            <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
              <h3 class="text-[14px] font-bold text-gray-900 mb-2">2. Products</h3>
              
              <div>
                <label class="block text-[11px] font-medium text-gray-700 mb-1.5">BRG DS11 - Qty</label>
                <input v-model.number="form.qtyDs11" type="number" min="0" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
              </div>

              <div>
                <label class="block text-[11px] font-medium text-gray-700 mb-1.5">BRG EV-5 - Qty</label>
                <input v-model.number="form.qtyEv5" type="number" min="0" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
              </div>

              <div>
                <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Cargo Pro - Qty</label>
                <input v-model.number="form.qtyCargo" type="number" min="0" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
              </div>
            </div>

            <!-- 3. Costs & Shipment -->
            <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
              <h3 class="text-[14px] font-bold text-gray-900 mb-2">3. Costs & Shipment</h3>
              
              <div>
                <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Expected Product Cost</label>
                <input v-model="form.expectedCost" type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
              </div>
              
              <div>
                <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Estimated Freight</label>
                <input v-model="form.estimatedFreight" type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
              </div>

              <div>
                <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Shipment Method</label>
                <input v-model="form.shipmentMethod" type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
              </div>
            </div>

            <!-- 4. Terms & Review -->
            <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
              <h3 class="text-[14px] font-bold text-gray-900 mb-2">4. Terms & Review</h3>
              
              <div>
                <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Payment Terms</label>
                <input v-model="form.paymentTerms" type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
              </div>

              <div>
                <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Documents</label>
                <input v-model="form.documents" type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
              </div>

              <div>
                <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Notes</label>
                <textarea v-model="form.notes" rows="2" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]"></textarea>
              </div>
            </div>
          </div>

          <!-- Actions Footer -->
          <div class="flex items-center justify-end pt-4">
            <div class="flex flex-wrap items-center gap-3">
              <button @click="closeForm" class="px-5 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer">
                Cancel
              </button>
              <button @click="handleSave('Draft')" class="px-5 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer">
                Save Draft
              </button>
              <button @click="handleSave('Pending Approval')" class="px-5 py-2 text-[11px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05)] cursor-pointer">
                Submit for Approval
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>