<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../../store.js'
import { api } from '@/services/api.js'

const router = useRouter()
const emit = defineEmits(['close', 'created'])

const isSubmitting = ref(false)
const apiError = ref(null)
const validationErrors = ref([])

// Form model
const form = ref({
  supplier: '',
  po: '',
  receipt: '',
  reason: '',
  notes: '',
  items: [
    {
      productId: 'PROD-001',
      product: 'E-Scooter Standard',
      serial: '',
      quantity: 1,
      unitCost: 168000,
      condition: 'Defective',
      isFromQcHold: false
    }
  ]
})

const suppliers = computed(() => {
  return (store.suppliers || []).filter(s => s.status === 'Active' || !s.status)
})

const eligiblePurchaseOrders = computed(() => {
  if (!form.value.supplier) return store.purchaseOrders || []
  const supLower = form.value.supplier.toLowerCase().trim()
  return (store.purchaseOrders || []).filter(p => 
    (p.supplier && p.supplier.toLowerCase().includes(supLower)) ||
    (p.supplier_id && p.supplier_id.toLowerCase() === supLower)
  )
})

onMounted(async () => {
  if (!store.suppliers || store.suppliers.length === 0) {
    try {
      const res = await api.procurement.getSuppliers()
      const data = res?.data || res
      if (Array.isArray(data)) store.suppliers = data
    } catch (err) {
      console.warn('Failed to load suppliers:', err)
    }
  }

  if (!store.purchaseOrders || store.purchaseOrders.length === 0) {
    try {
      const res = await api.procurement.getPurchaseOrders()
      const data = res?.data || res
      if (Array.isArray(data)) store.purchaseOrders = data
    } catch (err) {
      console.warn('Failed to load purchase orders:', err)
    }
  }

  // Default supplier if available
  if (suppliers.value.length > 0 && !form.value.supplier) {
    form.value.supplier = suppliers.value[0].name
  }
})

const addItem = () => {
  form.value.items.push({
    productId: 'PROD-001',
    product: 'E-Scooter Standard',
    serial: '',
    quantity: 1,
    unitCost: 168000,
    condition: 'Defective',
    isFromQcHold: false
  })
}

const removeItem = (idx) => {
  if (form.value.items.length <= 1) {
    validationErrors.value = ['At least one item is required in the purchase return.']
    return
  }
  form.value.items.splice(idx, 1)
}

const totalUnits = computed(() => {
  return form.value.items.reduce((sum, item) => sum + (parseInt(item.quantity || 0, 10) || 0), 0)
})

const totalCredit = computed(() => {
  return form.value.items.reduce((sum, item) => {
    const qty = parseInt(item.quantity || 0, 10) || 0
    const cost = parseFloat(item.unitCost || 0) || 0
    return sum + (qty * cost)
  }, 0)
})

const validateForm = () => {
  const errors = []
  if (!form.value.supplier || !form.value.supplier.trim()) {
    errors.push('Supplier is required.')
  }
  if (!form.value.reason || !form.value.reason.trim()) {
    errors.push('Reason for return is required.')
  }
  if (!form.value.items || form.value.items.length === 0) {
    errors.push('At least one item is required.')
  }

  form.value.items.forEach((item, idx) => {
    const qty = parseInt(item.quantity, 10)
    if (isNaN(qty) || qty <= 0) {
      errors.push(`Line ${idx + 1}: Quantity must be greater than 0.`)
    }
    const cost = parseFloat(item.unitCost)
    if (isNaN(cost) || cost < 0) {
      errors.push(`Line ${idx + 1}: Unit credit cost cannot be negative.`)
    }
  })

  return errors
}

const handleSubmit = async (submitStatus = 'Draft') => {
  validationErrors.value = validateForm()
  if (validationErrors.value.length > 0) return

  isSubmitting.value = true
  apiError.value = null

  const supObj = (store.suppliers || []).find(s => 
    s.name?.toLowerCase() === form.value.supplier.toLowerCase().trim() ||
    s.id?.toLowerCase() === form.value.supplier.toLowerCase().trim()
  )
  const supplierId = supObj ? (supObj.id || supObj.code) : form.value.supplier

  const payload = {
    supplier_id: supplierId,
    supplier: form.value.supplier,
    po_id: form.value.po || null,
    po_number: form.value.po || null,
    reason: form.value.reason.trim(),
    notes: form.value.notes?.trim() || null,
    lines: form.value.items.map(i => ({
      product_id: i.productId,
      product: i.product,
      quantity: parseInt(i.quantity, 10),
      unit_cost: parseFloat(i.unitCost),
      serial: i.serial?.trim() || null,
      unit_id: i.serial?.trim() || null,
      condition: i.condition,
      is_from_qc_hold: Boolean(i.isFromQcHold)
    }))
  }

  try {
    const res = await api.procurement.createPurchaseReturn(payload)
    let returnRecord = res?.data || res

    // If submitStatus is 'Approved', immediately approve the draft return
    if (submitStatus === 'Approved' && returnRecord?.id) {
      const approveRes = await api.procurement.approvePurchaseReturn(returnRecord.id)
      returnRecord = approveRes?.data || approveRes || returnRecord
    }

    if (returnRecord) {
      store.addPurchaseReturn(returnRecord)
      emit('created', returnRecord)
    }

    emit('close')
    router.push('/procurement/purchase-returns')
  } catch (err) {
    console.error('Failed to create purchase return via API:', err)
    apiError.value = err.data?.message || err.message || 'Failed to submit purchase return to server.'
  } finally {
    isSubmitting.value = false
  }
}

const cancel = () => {
  emit('close')
  router.push('/procurement/purchase-returns')
}
</script>

<template>
  <div class="fixed inset-0 bg-gray-900/50 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm" @click.self="cancel">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      
      <!-- Close button on top right -->
      <button @click="cancel" class="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-100 rounded-full z-50 shadow-sm transition-colors cursor-pointer">
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
              <div class="text-[10px] text-gray-500 mb-1">Super Admin / Procurement / Purchase Returns / <span class="font-bold text-gray-800">Create</span></div>
              <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Create Purchase Return</h1>
              <p class="text-sm text-gray-500 mt-1">Initiate a return for defective or rejected units with vendor debit note issuance.</p>
            </div>
            <div>
              <button 
                :disabled="isSubmitting"
                @click="handleSubmit('Draft')" 
                class="px-4 py-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer disabled:opacity-50"
              >
                <span v-if="isSubmitting">Saving...</span>
                <span v-else>Save Draft</span>
              </button>
            </div>
          </div>

          <!-- Error Banners -->
          <div v-if="apiError" class="p-3.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center justify-between">
            <span>{{ apiError }}</span>
            <button @click="apiError = null" class="text-red-500 hover:text-red-800 font-bold ml-2 cursor-pointer">&times;</button>
          </div>

          <div v-if="validationErrors.length > 0" class="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs space-y-1">
            <div v-for="(msg, i) in validationErrors" :key="i">{{ msg }}</div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <!-- Main Form -->
            <div class="lg:col-span-2 space-y-6">
              
              <!-- Return Details -->
              <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
                <h2 class="text-[14px] font-bold text-gray-900 mb-4">Return Details</h2>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Supplier <span class="text-red-500">*</span></label>
                    <select v-model="form.supplier" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white cursor-pointer">
                      <option value="">Select Supplier</option>
                      <option v-for="s in suppliers" :key="s.id || s.code" :value="s.name">{{ s.name }} ({{ s.code || s.id }})</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Original PO / Receipt</label>
                    <select v-model="form.po" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white cursor-pointer">
                      <option value="">Select PO (Optional)</option>
                      <option v-for="p in eligiblePurchaseOrders" :key="p.po || p.id" :value="p.po || p.po_number">
                        {{ p.po || p.po_number }} &middot; {{ p.supplier }} ({{ p.status }})
                      </option>
                    </select>
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Reason for Return <span class="text-red-500">*</span></label>
                    <input 
                      data-tour="e-g-transit-damage-qc-failure" 
                      v-model="form.reason"
                      type="text" 
                      placeholder="e.g. Transit damage, QC failure" 
                      class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" 
                    />
                  </div>
                </div>
              </div>

              <!-- Units to Return -->
              <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
                <div class="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                  <h3 class="text-[14px] font-bold text-gray-900">Units to Return</h3>
                  <button @click="addItem" type="button" class="text-[11px] font-bold text-[#165A31] hover:text-[#124a28] transition-colors cursor-pointer">+ Add Item</button>
                </div>
                <div class="overflow-x-auto flex-1 p-6 pt-0">
                  <div class="w-full overflow-x-auto">
                    <table class="w-full text-left border-collapse mt-4">
                      <thead>
                        <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                          <th class="px-5 py-3 rounded-tl-lg">Product / Serial</th>
                          <th class="px-5 py-3">Quantity</th>
                          <th class="px-5 py-3">Credit Value (PKR)</th>
                          <th class="px-5 py-3">Source QC</th>
                          <th class="px-5 py-3 rounded-tr-lg"></th>
                        </tr>
                      </thead>
                      <tbody class="text-[11px]">
                        <tr v-for="(item, idx) in form.items" :key="idx" class="border-b border-gray-50">
                          <td class="px-5 py-4 space-y-1.5">
                            <input 
                              data-tour="select-product-or-scan-serial" 
                              v-model="item.product"
                              type="text" 
                              placeholder="Select product or scan serial" 
                              class="w-full px-3 py-1.5 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31]" 
                            />
                            <input 
                              v-model="item.serial"
                              type="text" 
                              placeholder="Serial / Chassis # (optional)" 
                              class="w-full px-3 py-1 text-[10px] border border-gray-200 rounded focus:outline-none text-gray-600 font-mono" 
                            />
                          </td>
                          <td class="px-5 py-4">
                            <input 
                              v-model.number="item.quantity"
                              type="number" 
                              min="1"
                              class="w-20 px-3 py-1.5 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31]" 
                            />
                          </td>
                          <td class="px-5 py-4">
                            <input 
                              data-tour="pkr" 
                              v-model.number="item.unitCost"
                              type="number" 
                              min="0"
                              placeholder="PKR" 
                              class="w-full px-3 py-1.5 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31]" 
                            />
                          </td>
                          <td class="px-5 py-4">
                            <label class="flex items-center gap-1.5 text-[11px] text-gray-600 cursor-pointer">
                              <input type="checkbox" v-model="item.isFromQcHold" class="rounded text-[#165A31]" />
                              <span>QC Hold</span>
                            </label>
                          </td>
                          <td class="px-5 py-4 text-right">
                            <button @click="removeItem(idx)" type="button" class="text-gray-400 hover:text-red-500 font-bold cursor-pointer">&times;</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sidebar Form Summary -->
            <div class="space-y-6">
              <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
                <h3 class="text-[14px] font-bold text-gray-900 mb-4">Summary</h3>
                <div class="space-y-3">
                  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
                    <span class="text-gray-500 font-medium">Total Units</span>
                    <span class="font-bold text-gray-900">{{ totalUnits }}</span>
                  </div>
                  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
                    <span class="text-gray-500 font-medium">Estimated Credit</span>
                    <span class="font-bold text-gray-900">PKR {{ totalCredit.toLocaleString() }}</span>
                  </div>
                  <div class="pt-4 mt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                    <span class="text-[11px] font-bold text-gray-900">Action Status</span>
                    <span class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-green-50 text-[#165A31]">Submit &amp; Approve</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Actions Footer -->
          <div class="flex items-center justify-end pt-4">
            <div class="flex flex-wrap items-center gap-3">
              <button 
                :disabled="isSubmitting"
                @click="cancel" 
                class="px-5 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                :disabled="isSubmitting"
                @click="handleSubmit('Approved')" 
                class="px-5 py-2 text-[11px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05)] cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                <span v-if="isSubmitting">Processing Return...</span>
                <span v-else>Submit &amp; Approve Return</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>