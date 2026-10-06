<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Trash2, AlertCircle } from 'lucide-vue-next'
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

// Active catalogue products for procurement line selection
const activeProducts = computed(() => {
  return (store.products || []).filter(p => p.status === 'Active' || !p.status)
})

// Destination branch options
const branchOptions = computed(() => {
  if (store.branches && store.branches.length > 0) {
    return store.branches.map(b => b.name || b.branchName || b.id)
  }
  return ['Peshawar', 'Islamabad', 'Lahore', 'Rawalpindi']
})

// Validation error list
const formErrors = ref([])

// Helper to get variants for a product
const getVariantsForProduct = (productId) => {
  return store.getProductVariants(productId)
}

// Form state
const form = ref({
  supplier: '',
  destination: store.getActiveBranch() || 'Peshawar',
  expectedArrival: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
  items: [
    {
      id: 1,
      productId: '',
      variantId: 'NOT_APPLICABLE',
      variantName: '',
      quantity: 1,
      expectedUnitCost: 0
    }
  ],
  estimatedFreight: '',
  shipmentMethod: 'Sea + Road',
  paymentTerms: '30 days',
  documents: [],
  notes: ''
})

// Next line unique identifier
let nextLineId = 2

// Add a new dynamic catalogue product line
const addLine = () => {
  formErrors.value = []
  const candidate = activeProducts.value[0]
  
  if (!candidate) {
    formErrors.value = ['No active products available in catalogue.']
    return
  }

  const candId = candidate.id || candidate.product_id
  const variants = getVariantsForProduct(candId)
  const initialVariant = variants[0] || { variantId: 'NOT_APPLICABLE', variantName: 'Standard' }
  const cost = typeof candidate.costPrice === 'number' ? candidate.costPrice : (parseInt(String(candidate.costPrice || candidate.price || 0).replace(/[^\d.]/g, '')) || 100000)

  form.value.items.push({
    id: nextLineId++,
    productId: candId,
    variantId: initialVariant.variantId || initialVariant.id || 'NOT_APPLICABLE',
    variantName: initialVariant.variantName || initialVariant.name || 'Standard',
    quantity: 1,
    expectedUnitCost: cost
  })
}

// Remove a dynamic line
const removeLine = (index) => {
  formErrors.value = []
  if (form.value.items.length <= 1) {
    formErrors.value = ['A purchase order must have at least one product line.']
    return
  }
  form.value.items.splice(index, 1)
}

// On product selection change, default the variant and expected unit cost
const onProductChange = (line) => {
  const prod = store.getProductById(line.productId)
  if (prod) {
    const variants = getVariantsForProduct(line.productId)
    const initialVariant = variants[0] || { variantId: 'NOT_APPLICABLE', variantName: 'Standard' }
    line.variantId = initialVariant.variantId || initialVariant.id || 'NOT_APPLICABLE'
    line.variantName = initialVariant.variantName || initialVariant.name || 'Standard'
    const cost = typeof prod.costPrice === 'number' ? prod.costPrice : (parseInt(String(prod.costPrice || prod.price || 0).replace(/[^\d.]/g, '')) || 0)
    line.expectedUnitCost = cost
  }
}

// On variant selection change
const onVariantChange = (line) => {
  const variants = getVariantsForProduct(line.productId)
  const sel = variants.find(v => (v.variantId || v.id) === line.variantId)
  if (sel) {
    line.variantName = sel.variantName || sel.name || 'Standard'
  }
}

// Calculate total product cost derived from catalogue lines
const totalExpectedProductCost = computed(() => {
  return form.value.items.reduce((sum, line) => {
    const qty = Number(line.quantity) || 0
    const cost = Number(line.expectedUnitCost) || 0
    return sum + (qty * cost)
  }, 0)
})

// Calculate total ordered units
const totalOrderedUnits = computed(() => {
  return form.value.items.reduce((sum, line) => sum + (parseInt(line.quantity) || 0), 0)
})

// Validate form before submission
const validateForm = () => {
  const errors = []
  if (!form.value.supplier || !form.value.supplier.trim()) {
    errors.push('Supplier name is required.')
  }
  if (!form.value.destination) {
    errors.push('Destination branch is required.')
  }
  if (!form.value.items || form.value.items.length === 0) {
    errors.push('Purchase order must contain at least one product line.')
    return errors
  }

  const seenLineKeys = new Set()
  form.value.items.forEach((line, idx) => {
    const lineNum = idx + 1
    if (!line.productId) {
      errors.push(`Line ${lineNum}: Please select a product.`)
      return
    }
    
    // Check product exists and is active
    const prod = store.getProductById(line.productId)
    if (!prod) {
      errors.push(`Line ${lineNum}: Invalid product ID "${line.productId}". Product not found in catalogue.`)
      return
    }
    if (prod.status && prod.status !== 'Active') {
      errors.push(`Line ${lineNum}: Product "${prod.name}" (${prod.id}) is archived/inactive and cannot be added to a new PO.`)
    }

    // Duplicate product/variant check (Policy: Deterministic rejection of duplicate product+variant lines)
    const varId = line.variantId || 'NOT_APPLICABLE'
    const lineKey = `${line.productId}::${varId}`
    if (seenLineKeys.has(lineKey)) {
      const varDesc = line.variantName && line.variantName !== 'Standard' ? ` variant '${line.variantName}'` : (varId !== 'NOT_APPLICABLE' ? ` variant '${varId}'` : '')
      errors.push(`Line ${lineNum}: Duplicate product "${prod.name}"${varDesc}. Each product variant can only appear once per PO. Please adjust quantity on the existing line.`)
    }
    seenLineKeys.add(lineKey)

    // Quantity validation (Reject <= 0, no silent conversion)
    const qty = Number(line.quantity)
    if (isNaN(qty) || qty <= 0) {
      errors.push(`Line ${lineNum} (${prod.name}): Quantity must be greater than 0.`)
    }

    // Cost validation
    const cost = Number(line.expectedUnitCost)
    if (isNaN(cost) || cost < 0) {
      errors.push(`Line ${lineNum} (${prod.name}): Expected unit cost cannot be negative.`)
    }
  })

  return errors
}

const handleSave = (status = 'Pending Approval') => {
  formErrors.value = validateForm()
  if (formErrors.value.length > 0) {
    return
  }

  // Construct dynamic line items using canonical product catalogue metadata
  const items = form.value.items.map((line, idx) => {
    const prod = store.getProductById(line.productId)
    const qty = parseInt(line.quantity) || 1
    const unitCost = Number(line.expectedUnitCost) || 0
    const subtotal = qty * unitCost
    const isSerialized = prod?.isSerialized !== false && !String(prod?.name || '').toLowerCase().includes('battery') && !String(prod?.name || '').toLowerCase().includes('part')
    const variants = getVariantsForProduct(line.productId)
    const selectedVariant = variants.find(v => (v.variantId || v.id) === line.variantId)

    return {
      lineId: `LINE-${idx + 1}`,
      product_id: prod?.id || line.productId,
      productId: prod?.id || line.productId,
      variant_id: line.variantId || 'NOT_APPLICABLE',
      variantId: line.variantId || 'NOT_APPLICABLE',
      variantName: line.variantName || selectedVariant?.variantName || selectedVariant?.name || 'Standard',
      product: prod?.name || prod?.modelName || 'Catalogue Product',
      productName: prod?.name || prod?.modelName || 'Catalogue Product',
      sku: selectedVariant?.sku || prod?.sku || 'SKU-GEN',
      ordered: qty,
      quantity: qty,
      previouslyReceived: 0,
      received: 0,
      unitCost: `PKR ${unitCost.toLocaleString()}`,
      expectedUnitCost: unitCost,
      cost: `PKR ${unitCost.toLocaleString()}`,
      subtotal: `PKR ${subtotal.toLocaleString()}`,
      subtotalAmount: subtotal,
      lineSubtotal: subtotal,
      isSerialized
    }
  })

  const totalUnits = items.reduce((s, i) => s + i.ordered, 0)
  const totalCostNum = items.reduce((s, i) => s + (i.subtotalAmount || 0), 0)
  const poNumber = `PO-${Math.floor(2050 + Math.random() * 900)}`

  // Format documents array properly preserving Wave 2 structure
  let docs = []
  if (Array.isArray(form.value.documents)) {
    docs = form.value.documents.map(d => typeof d === 'string' ? { name: d, type: 'Supplier Document', uploaded: 'Today' } : d)
  } else if (typeof form.value.documents === 'string' && form.value.documents.trim()) {
    docs = [{ name: form.value.documents.trim(), type: 'Supplier Proforma', uploaded: 'Today' }]
  } else {
    docs = [{ name: `${poNumber}.pdf`, type: 'Purchase Order', uploaded: 'Today' }]
  }

  const newPo = store.addPurchaseOrder({
    po: poNumber,
    po_id: poNumber,
    supplier_id: 'SUP-01',
    supplier: form.value.supplier,
    destination: form.value.destination,
    branch_id: store.resolveCanonicalBranchId(form.value.destination),
    branch: form.value.destination,
    amount: `PKR ${totalCostNum.toLocaleString()}`,
    totalAmount: totalCostNum,
    expectedCost: `PKR ${totalCostNum.toLocaleString()}`,
    units: String(totalUnits),
    totalOrdered: totalUnits,
    totalReceived: 0,
    remainingUnits: totalUnits,
    orderDate: new Date().toISOString().split('T')[0],
    expected: 'Sep 30',
    expectedDate: form.value.expectedArrival,
    expectedArrival: form.value.expectedArrival,
    carrier: form.value.shipmentMethod,
    shipmentMethod: form.value.shipmentMethod,
    estimatedFreight: form.value.estimatedFreight,
    paymentTerms: form.value.paymentTerms,
    notes: form.value.notes,
    tracking: `TRK-${poNumber}`,
    status,
    match: `0/${totalUnits}`,
    action: status === 'Approved' ? 'Open · Receive' : 'Open',
    items,
    documents: docs,
    activities: [
      { text: `PO created with status: ${status}`, date: 'Today' }
    ]
  })

  emit('close')
  router.push(`/procurement/purchase-orders/${newPo.po}`)
}

defineExpose({
  form,
  formErrors,
  handleSave,
  addLine,
  removeLine,
  onProductChange,
  onVariantChange,
  getVariantsForProduct
})
</script>

<template>
  <div class="fixed inset-0 bg-gray-900/50 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm" @click.self="closeForm">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      
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
              <h1 class="text-[30px] tracking-tight font-bold text-gray-900">Create Purchase Order</h1>
              <p class="text-xs text-gray-500 mt-1">Select products from the canonical catalogue to generate procurement demand without creating physical inventory.</p>
            </div>
          </div>

          <!-- Error Alert -->
          <div v-if="formErrors.length > 0" class="bg-red-50 border border-red-200 rounded-xl p-4 space-y-1">
            <div class="flex items-center gap-2 text-red-700 font-bold text-xs">
              <AlertCircle class="w-4 h-4 shrink-0" />
              <span>Validation failed:</span>
            </div>
            <ul class="list-disc list-inside text-xs text-red-600 space-y-0.5 pl-2">
              <li v-for="(err, idx) in formErrors" :key="idx">{{ err }}</li>
            </ul>
          </div>

          <!-- Form Grid -->
          <div class="space-y-6">
            
            <!-- 1. Supplier & Logistics -->
            <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
              <h3 class="text-[14px] font-bold text-gray-900 border-b border-gray-50 pb-2">1. Supplier & Destination</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Supplier</label>
                  <input data-tour="po-supplier" v-model="form.supplier" type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
                </div>
                
                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Destination Branch</label>
                  <select data-tour="po-destination" v-model="form.destination" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white">
                    <option v-for="branch in branchOptions" :key="branch" :value="branch">{{ branch }}</option>
                  </select>
                </div>

                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Expected Arrival</label>
                  <input data-tour="po-expected-arrival" v-model="form.expectedArrival" type="date" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
                </div>
              </div>
            </div>

            <!-- 2. Catalogue-Driven Product Line Items (Replaces Hardcoded 3-Product Model) -->
            <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
              <div class="flex items-center justify-between border-b border-gray-50 pb-2">
                <div>
                  <h3 class="text-[14px] font-bold text-gray-900">2. Catalogue Line Items</h3>
                  <p class="text-[11px] text-gray-500">Add arbitrary active catalogue products. Line items are dynamically looked up by canonical Product ID.</p>
                </div>
                <button 
                  id="dap-add-po-line-btn"
                  type="button" 
                  data-tour="po-add-line-btn"
                  @click="addLine" 
                  class="px-3 py-1.5 text-xs font-bold text-[#165A31] bg-[#eefcf2] hover:bg-[#dcfce7] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus class="w-3.5 h-3.5" /> Add Product Line
                </button>
              </div>

              <!-- Lines Table -->
              <div class="overflow-x-auto">
                <table id="dap-po-lines-table" class="w-full text-left border-collapse">
                  <thead>
                    <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      <th class="px-4 py-2.5 w-12">#</th>
                      <th class="px-4 py-2.5">Product (Catalogue)</th>
                      <th class="px-4 py-2.5 w-44">Variant</th>
                      <th class="px-4 py-2.5 w-24 text-center">Quantity</th>
                      <th class="px-4 py-2.5 w-36 text-right">Expected Unit Cost</th>
                      <th class="px-4 py-2.5 w-36 text-right">Line Subtotal</th>
                      <th class="px-4 py-2.5 w-16 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody class="text-xs divide-y divide-gray-50">
                    <tr v-for="(line, idx) in form.items" :key="line.id" class="hover:bg-gray-50/50">
                      <td class="px-4 py-3 text-gray-400 font-mono">{{ idx + 1 }}</td>
                      <td class="px-4 py-3">
                        <select 
                          :id="`dap-po-prod-${idx}`"
                          data-tour="po-product-select"
                          v-model="line.productId" 
                          @change="onProductChange(line)"
                          class="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] bg-white font-medium"
                        >
                          <option v-for="prod in activeProducts" :key="prod.id || prod.product_id" :value="prod.id || prod.product_id">
                            {{ prod.name }} ({{ prod.sku || prod.id }}) &middot; {{ prod.category || 'Product' }}
                          </option>
                        </select>
                      </td>
                      <td class="px-4 py-3">
                        <select 
                          :id="`dap-po-variant-${idx}`"
                          data-tour="po-variant-select"
                          v-model="line.variantId"
                          @change="onVariantChange(line)"
                          class="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] bg-white font-medium"
                        >
                          <option v-for="v in getVariantsForProduct(line.productId)" :key="v.variantId || v.id" :value="v.variantId || v.id">
                            {{ v.variantName || v.name }}
                          </option>
                        </select>
                      </td>
                      <td class="px-4 py-3 text-center">
                        <input 
                          :id="`dap-po-qty-${idx}`"
                          data-tour="po-line-qty"
                          v-model.number="line.quantity" 
                          type="number" 
                          min="1" 
                          step="1"
                          class="w-20 px-2 py-1.5 text-center text-xs font-bold border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31]"
                        />
                      </td>
                      <td class="px-4 py-3 text-right">
                        <div class="relative inline-block w-32">
                          <input 
                            :id="`dap-po-cost-${idx}`"
                            data-tour="po-expected-cost"
                            v-model.number="line.expectedUnitCost" 
                            type="number" 
                            min="0"
                            step="100"
                            class="w-full px-2.5 py-1.5 text-right text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31]"
                          />
                        </div>
                      </td>
                      <td class="px-4 py-3 text-right font-bold text-gray-900">
                        PKR {{ ((Number(line.quantity) || 0) * (Number(line.expectedUnitCost) || 0)).toLocaleString() }}
                      </td>
                      <td class="px-4 py-3 text-center">
                        <button 
                          :id="`dap-po-remove-${idx}`"
                          type="button" 
                          data-tour="po-remove-line-btn"
                          @click="removeLine(idx)" 
                          class="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                          :disabled="form.items.length <= 1"
                          :class="form.items.length <= 1 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'"
                          title="Remove line"
                        >
                          <Trash2 class="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr class="bg-gray-50/80 font-bold text-xs text-gray-900 border-t border-gray-200">
                      <td colspan="3" class="px-4 py-3 text-gray-600">Total Purchase Demand</td>
                      <td class="px-4 py-3 text-center text-emerald-700">{{ totalOrderedUnits }} units</td>
                      <td class="px-4 py-3 text-right text-gray-500">Estimated Total:</td>
                      <td class="px-4 py-3 text-right text-gray-900 text-sm">PKR {{ totalExpectedProductCost.toLocaleString() }}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <!-- 3. Shipment & Financial Terms (Preserves Wave 2 Fields) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
                <h3 class="text-[14px] font-bold text-gray-900 border-b border-gray-50 pb-2">3. Logistics & Freight</h3>
                
                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Estimated Freight</label>
                  <input data-tour="po-estimated-freight" v-model="form.estimatedFreight" type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
                </div>

                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Shipment Method / Carrier</label>
                  <input data-tour="po-shipment-method" v-model="form.shipmentMethod" type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
                </div>
              </div>

              <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
                <h3 class="text-[14px] font-bold text-gray-900 border-b border-gray-50 pb-2">4. Terms & Documentation</h3>
                
                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Payment Terms</label>
                  <input data-tour="po-payment-terms" v-model="form.paymentTerms" type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
                </div>

                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Documents / Proforma</label>
                  <input data-tour="po-documents" v-model="form.documents" type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
                </div>
              </div>
            </div>

            <!-- Notes Card -->
            <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-2">
              <label class="block text-[11px] font-medium text-gray-700">Procurement Notes & Instructions</label>
              <textarea data-tour="po-notes" v-model="form.notes" rows="2" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors"></textarea>
            </div>
          </div>

          <!-- Actions Footer -->
          <div class="flex items-center justify-end pt-4">
            <div class="flex flex-wrap items-center gap-3">
              <button data-tour="po-cancel-btn" @click="closeForm" class="px-5 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer">
                Cancel
              </button>
              <button data-tour="po-draft-btn" @click="handleSave('Draft')" class="px-5 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer">
                Save Draft
              </button>
              <button data-tour="po-submit-btn" @click="handleSave('Pending Approval')" class="px-5 py-2 text-[11px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05)] cursor-pointer">
                Submit for Approval
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>