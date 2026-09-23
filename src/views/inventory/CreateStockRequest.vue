<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../../store.js'
import { X } from 'lucide-vue-next'

const props = defineProps({
  isModal: {
    type: Boolean,
    default: true
  },
  requestItem: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'created', 'updated'])
const router = useRouter()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const isEditMode = ref(false)
const showValidation = ref(false)

const form = ref({
  id: '',
  product: 'BRG X5',
  currentStock: '6 available / 1 reserved',
  requestedQty: '4',
  urgency: 'High',
  expectedDemand: '2 active quotations',
  orderLink: '',
  reason: 'Stock is below reorder level',
  notes: 'Any network source acceptable',
  status: 'Pending',
  branch: user.value?.branchName || 'Peshawar'
})

const loadData = (data) => {
  if (!data) return
  isEditMode.value = true
  form.value = {
    ...form.value,
    id: data.id || data.requestNo || form.value.id,
    product: data.product || form.value.product,
    currentStock: data.currentStock || form.value.currentStock,
    requestedQty: data.qty || data.units || data.requestedQty || form.value.requestedQty,
    urgency: data.urgency || form.value.urgency,
    expectedDemand: data.expectedDemand || form.value.expectedDemand,
    orderLink: data.orderLink || form.value.orderLink,
    reason: data.reason || form.value.reason,
    notes: data.notes || form.value.notes,
    status: data.status || form.value.status,
    branch: data.branch || form.value.branch
  }
}

onMounted(() => {
  if (props.requestItem) {
    loadData(props.requestItem)
  } else if (store.originalEditStockRequest) {
    loadData(store.originalEditStockRequest)
  }
})

watch(() => props.requestItem, (newVal) => {
  if (newVal) loadData(newVal)
}, { immediate: true })

const close = () => {
  store.originalEditStockRequest = null
  emit('close')
  if (router.currentRoute.value.path.includes('/create')) {
    router.push('/inventory/stock-requests')
  }
}

const submitRequest = () => {
  if (!form.value.product.trim() || !String(form.value.requestedQty).trim() || !form.value.reason.trim()) {
    showValidation.value = true
    return
  }

  const payload = {
    id: form.value.id || `SR-${Math.floor(200 + Math.random() * 800)}`,
    requestNo: form.value.id || `SR-${Math.floor(200 + Math.random() * 800)}`,
    product: form.value.product,
    currentStock: form.value.currentStock,
    qty: form.value.requestedQty,
    units: form.value.requestedQty,
    urgency: form.value.urgency,
    expectedDemand: form.value.expectedDemand,
    orderLink: form.value.orderLink,
    reason: form.value.reason,
    notes: form.value.notes,
    status: form.value.status || 'Pending',
    branch: form.value.branch || user.value?.branchName || 'Peshawar',
    date: 'Today'
  }

  if (isEditMode.value) {
    if (typeof store.updateStockRequest === 'function') {
      store.updateStockRequest(payload.id, payload)
    }
    emit('updated', payload)
  } else {
    store.addStockRequest(payload)
    emit('created', payload)
  }
  close()
}
</script>

<template>
  <div class="fixed inset-0 bg-gray-900/50 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm" @click.self="close">
    <!-- Close button on top-right of screen overlay -->
    <button @click="close" class="fixed top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-100 rounded-full z-[110] shadow-lg transition-colors cursor-pointer">
      <X class="w-5 h-5" />
    </button>

    <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">
      <!-- Scrollable Body -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <div>
            <div class="text-[10px] text-gray-500 mb-1">
              <span v-if="isBranchUser">Branch Manager / Stock Requests / <span class="font-bold text-gray-800">{{ isEditMode ? 'Edit Stock Request' : 'Create Stock Request' }}</span></span>
              <span v-else>Super Admin / Inventory / Stock Requests / <span class="font-bold text-gray-800">{{ isEditMode ? 'Edit Stock Request' : 'Create Stock Request' }}</span></span>
            </div>
            <h1 class="text-[28px] sm:text-[32px] tracking-tight font-bold text-gray-900">{{ isEditMode ? 'Edit Stock Request' : 'Create Stock Request' }}</h1>
            <p class="text-xs sm:text-sm text-gray-500 mt-1">Request stock using current branch levels, urgency and expected demand.</p>
          </div>
        </div>

        <!-- 2 Column Form Grid -->
        <form @submit.prevent="submitRequest" class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Left Card: Stock Requirement -->
            <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
              <h3 class="text-sm font-bold text-gray-900 mb-2">Stock Requirement</h3>
              
              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Product *</label>
                <input 
                  v-model="form.product"
                  type="text" 
                  placeholder="e.g. BRG X5"
                  class="w-full px-3.5 py-2 bg-white border rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                  :class="showValidation && !form.product.trim() ? 'border-red-300 bg-red-50/20' : 'border-gray-200'"
                />
                <p v-if="showValidation && !form.product.trim()" class="text-[10px] text-red-500 font-medium mt-1">Product is required</p>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Current Branch Stock</label>
                <input 
                  v-model="form.currentStock"
                  type="text" 
                  placeholder="e.g. 6 available / 1 reserved"
                  class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                />
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Requested Quantity *</label>
                <input 
                  v-model="form.requestedQty"
                  type="text" 
                  placeholder="e.g. 4"
                  class="w-full px-3.5 py-2 bg-white border rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                  :class="showValidation && !String(form.requestedQty).trim() ? 'border-red-300 bg-red-50/20' : 'border-gray-200'"
                />
                <p v-if="showValidation && !String(form.requestedQty).trim()" class="text-[10px] text-red-500 font-medium mt-1">Requested quantity is required</p>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Urgency</label>
                <select 
                  v-model="form.urgency"
                  class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-[#165A31] transition-colors"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            <!-- Right Card: Demand Context -->
            <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
              <h3 class="text-sm font-bold text-gray-900 mb-2">Demand Context</h3>
              
              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Expected Demand</label>
                <input 
                  v-model="form.expectedDemand"
                  type="text" 
                  placeholder="e.g. 2 active quotations"
                  class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                />
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Customer / Custom Order Link</label>
                <input 
                  v-model="form.orderLink"
                  type="text" 
                  placeholder="e.g. ORD-2241 (Optional)"
                  class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                />
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Reason *</label>
                <textarea 
                  v-model="form.reason"
                  rows="2"
                  placeholder="Explain why stock replenishment is required..."
                  class="w-full px-3.5 py-2 bg-white border rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors resize-none"
                  :class="showValidation && !form.reason.trim() ? 'border-red-300 bg-red-50/20' : 'border-gray-200'"
                ></textarea>
                <p v-if="showValidation && !form.reason.trim()" class="text-[10px] text-red-500 font-medium mt-1">Reason is required</p>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Notes</label>
                <textarea 
                  v-model="form.notes"
                  rows="2"
                  placeholder="Optional delivery or routing notes..."
                  class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 pt-2">
            <button 
              type="button" 
              @click="close" 
              class="px-5 py-2.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="bg-[#165A31] text-white text-xs font-bold px-6 py-2.5 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer"
            >
              {{ isEditMode ? 'Update Request' : 'Submit Request' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
