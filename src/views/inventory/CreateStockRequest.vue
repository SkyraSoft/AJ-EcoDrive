<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../../store.js'
import { X, Check, PackagePlus, AlertCircle, Info } from 'lucide-vue-next'

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
  productId: 'PROD-001',
  product: 'BRG X5',
  currentStock: '6 available / 1 reserved',
  requestedQty: '4',
  urgency: 'High',
  expectedDemand: '2 customer showroom walk-ins + 1 fleet quotation',
  orderLink: '',
  reason: 'Stock is below showroom safety threshold (5 units)',
  notes: 'Dispatch via internal logistics truck as priority',
  status: 'Pending',
  branch: user.value?.branchName || 'Peshawar'
})

const onProductSelect = (prodId) => {
  const p = store.products.find(item => item.id === prodId)
  if (p) {
    form.value.productId = p.id
    form.value.product = p.name
    const branchKey = (form.value.branch || '').toLowerCase().replace(/\s+/g, '')
    const avail = p[branchKey] ?? p.available ?? 0
    form.value.currentStock = `${avail} units currently at ${form.value.branch}`
  }
}

const loadData = (data) => {
  if (!data) return
  isEditMode.value = true
  form.value = {
    ...form.value,
    id: data.id || data.requestNo || form.value.id,
    product: data.product || form.value.product,
    currentStock: data.currentStock || form.value.currentStock,
    requestedQty: String(data.qty || data.units || data.requestedQty || form.value.requestedQty),
    urgency: data.urgency || form.value.urgency,
    expectedDemand: data.expectedDemand || form.value.expectedDemand,
    orderLink: data.orderLink || form.value.orderLink,
    reason: data.reason || form.value.reason,
    notes: data.notes || form.value.notes,
    status: data.status || form.value.status,
    branch: data.branch || form.value.branch
  }
  const matchedProd = store.products.find(p => p.name.toLowerCase() === (data.product || '').toLowerCase())
  if (matchedProd) {
    form.value.productId = matchedProd.id
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
  <div class="fixed inset-0 bg-gray-900/60 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm" @click.self="close">
    <!-- Close button on top-right of screen overlay -->
    <button @click="close" class="fixed top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full z-[110] shadow-lg transition-colors cursor-pointer">
      <X class="w-5 h-5" />
    </button>

    <div class="bg-white dark:bg-[#161d2b] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">
      <!-- Scrollable Body -->
      <div class="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <div class="text-[10px] text-gray-400 dark:text-gray-500 mb-1">
              <span v-if="isBranchUser">Branch Manager / Stock Requests / <span class="font-bold text-gray-700 dark:text-gray-300">{{ isEditMode ? 'Edit Stock Request' : 'Create Stock Request' }}</span></span>
              <span v-else>Super Admin / Inventory / Stock Requests / <span class="font-bold text-gray-700 dark:text-gray-300">{{ isEditMode ? 'Edit Stock Request' : 'Create Stock Request' }}</span></span>
            </div>
            <h1 class="text-[28px] sm:text-[32px] tracking-tight font-bold text-gray-900 dark:text-white">{{ isEditMode ? 'Edit Stock Request' : 'Create Stock Request' }}</h1>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Submit showroom replenishment request to Head Office for inventory rebalancing.</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80">
              Requesting Branch: {{ form.branch }}
            </span>
          </div>
        </div>

        <!-- Flow Explanation Banner -->
        <div class="p-3.5 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 rounded-xl flex items-start gap-3">
          <Info class="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div class="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
            <span class="font-bold">Dealership Replenishment Workflow:</span>
            Submitting this request alerts the <strong>Super Admin & Central Warehouse</strong>. Once approved, warehouse staff will initiate an official <strong>Stock Transfer (Gate Pass)</strong> to dispatch vehicles or batteries to your branch.
          </div>
        </div>

        <!-- 2 Column Form Grid -->
        <form @submit.prevent="submitRequest" class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Left Card: Stock Requirement -->
            <div class="bg-gray-50/50 dark:bg-[#1e293b]/50 border border-gray-100 dark:border-gray-800 rounded-xl p-6 space-y-4">
              <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <PackagePlus class="w-4 h-4 text-[#165A31]" />
                Stock Requirement
              </h3>
              
              <div>
                <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Select Vehicle / Item *</label>
                <select 
                  v-model="form.productId"
                  @change="onProductSelect(form.productId)"
                  class="w-full px-3.5 py-2 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:border-[#165A31] transition-colors cursor-pointer"
                >
                  <option v-for="p in store.products" :key="p.id" :value="p.id">
                    {{ p.name }} ({{ p.sku }}) — {{ p.available || 0 }} network total
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Current Branch Stock State</label>
                <input 
                  v-model="form.currentStock"
                  type="text" 
                  placeholder="e.g. 6 available / 1 reserved"
                  class="w-full px-3.5 py-2 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                />
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Requested Units Qty *</label>
                <input 
                  v-model="form.requestedQty"
                  type="number" 
                  min="1"
                  placeholder="e.g. 4"
                  class="w-full px-3.5 py-2 bg-white dark:bg-[#0f172a] border rounded-lg text-xs font-bold text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                  :class="showValidation && !String(form.requestedQty).trim() ? 'border-red-300 bg-red-50/20' : 'border-gray-200 dark:border-gray-700'"
                />
                <p v-if="showValidation && !String(form.requestedQty).trim()" class="text-[10px] text-red-500 font-medium mt-1">Requested quantity is required</p>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Urgency Level</label>
                <select 
                  v-model="form.urgency"
                  class="w-full px-3.5 py-2 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:border-[#165A31] transition-colors cursor-pointer"
                >
                  <option value="Low">Low — Routine monthly replenishment</option>
                  <option value="Medium">Medium — Stock nearing minimum buffer</option>
                  <option value="High">High — Multiple walk-ins waiting</option>
                  <option value="Critical">Critical — Showroom stock exhausted (0 available)</option>
                </select>
              </div>
            </div>

            <!-- Right Card: Demand Context -->
            <div class="bg-gray-50/50 dark:bg-[#1e293b]/50 border border-gray-100 dark:border-gray-800 rounded-xl p-6 space-y-4">
              <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-2">Demand & Justification</h3>
              
              <div>
                <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Expected Demand / Pipeline</label>
                <input 
                  v-model="form.expectedDemand"
                  type="text" 
                  placeholder="e.g. 2 active quotations + corporate fleet visit"
                  class="w-full px-3.5 py-2 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                />
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Customer / Order Link (Optional)</label>
                <input 
                  v-model="form.orderLink"
                  type="text" 
                  placeholder="e.g. SO-9723 / QT-402"
                  class="w-full px-3.5 py-2 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                />
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Reason for Request *</label>
                <textarea 
                  v-model="form.reason"
                  rows="2"
                  placeholder="Explain why stock replenishment is necessary now..."
                  class="w-full px-3.5 py-2 bg-white dark:bg-[#0f172a] border rounded-lg text-xs text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors resize-none"
                  :class="showValidation && !form.reason.trim() ? 'border-red-300 bg-red-50/20' : 'border-gray-200 dark:border-gray-700'"
                ></textarea>
                <p v-if="showValidation && !form.reason.trim()" class="text-[10px] text-red-500 font-medium mt-1">Reason is required</p>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Logistics & Handling Notes</label>
                <textarea 
                  v-model="form.notes" 
                  rows="2"
                  placeholder="Specific delivery gate or unloading instructions..."
                  class="w-full px-3.5 py-2 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button 
              type="button" 
              @click="close" 
              class="px-5 py-2.5 text-xs font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="bg-[#165A31] text-white text-xs font-bold px-6 py-2.5 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer flex items-center gap-2"
            >
              <Check class="w-4 h-4" />
              {{ isEditMode ? 'Update Request' : 'Submit Stock Request' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
