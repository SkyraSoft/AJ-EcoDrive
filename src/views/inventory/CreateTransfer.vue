<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../../store.js'
import { X, AlertCircle } from 'lucide-vue-next'

const props = defineProps({
  isModal: {
    type: Boolean,
    default: true
  },
  transferItem: {
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
const errorMessage = ref('')

const branchOptions = computed(() => ['Peshawar', 'Islamabad', 'Lahore', 'Rawalpindi'])

const form = ref({
  id: '',
  fromBranch: user.value?.branchName || 'Peshawar',
  toBranch: (user.value?.branchName || 'Peshawar') === 'Lahore' ? 'Peshawar' : 'Lahore',
  productId: 'PROD-003',
  units: '2',
  requestedDate: 'Today',
  carrier: 'Internal logistics / AJ Logistics Truck #4',
  expectedArrival: 'Tomorrow',
  notes: 'Showroom stock balancing',
  status: 'Pending Approval'
})

const selectedProduct = computed(() => {
  return store.getProductById(form.value.productId) || store.products[0]
})

const availableAtSource = computed(() => {
  if (!selectedProduct.value) return 0
  const branchKey = (form.value.fromBranch || '').toLowerCase().replace(/\s+/g, '')
  if (selectedProduct.value.isSerialized) {
    return store.serializedUnits.filter(u => 
      ((u.product_id && u.product_id === selectedProduct.value.id) || (u.product && u.product.toLowerCase() === selectedProduct.value.name.toLowerCase())) &&
      (u.branch || '').toLowerCase() === (form.value.fromBranch || '').toLowerCase() &&
      u.status === 'Available'
    ).length
  } else {
    return selectedProduct.value[branchKey] ?? selectedProduct.value.available ?? 0
  }
})

const loadData = (data) => {
  if (!data) return
  isEditMode.value = true
  form.value = {
    ...form.value,
    id: data.id || form.value.id,
    fromBranch: data.from || data.fromBranch || form.value.fromBranch,
    toBranch: data.to || data.toBranch || form.value.toBranch,
    productId: data.items?.[0]?.product_id || form.value.productId,
    units: String(data.units || form.value.units),
    requestedDate: data.dispatched || data.requestedDate || form.value.requestedDate,
    carrier: data.carrier || form.value.carrier,
    expectedArrival: data.expectedArrival || form.value.expectedArrival,
    notes: data.notes || form.value.notes,
    status: data.status || form.value.status
  }
}

onMounted(() => {
  if (props.transferItem) {
    loadData(props.transferItem)
  }
})

watch(() => props.transferItem, (newVal) => {
  if (newVal) loadData(newVal)
}, { immediate: true })

const close = () => {
  emit('close')
  if (router.currentRoute.value.path.includes('/create')) {
    router.push('/inventory/transfers')
  }
}

const submitTransfer = () => {
  errorMessage.value = ''
  showValidation.value = true

  if (!form.value.fromBranch.trim() || !form.value.toBranch.trim() || !String(form.value.units).trim()) {
    errorMessage.value = 'Please fill in all required fields.'
    return
  }

  if (form.value.fromBranch.trim().toLowerCase() === form.value.toBranch.trim().toLowerCase()) {
    errorMessage.value = 'Origin and destination branches must be different.'
    return
  }

  const requestedCount = parseInt(form.value.units || 1)
  if (isNaN(requestedCount) || requestedCount <= 0) {
    errorMessage.value = 'Requested units count must be a positive integer.'
    return
  }

  if (requestedCount > availableAtSource.value) {
    errorMessage.value = `Cannot transfer ${requestedCount} units. Only ${availableAtSource.value} units available at ${form.value.fromBranch}.`
    return
  }

  const payload = {
    id: form.value.id || `TR-${Math.floor(225 + Math.random() * 100)}`,
    from: form.value.fromBranch,
    to: form.value.toBranch,
    product_id: selectedProduct.value?.id || 'PROD-003',
    product: selectedProduct.value?.name || 'BRG DS11',
    sku: selectedProduct.value?.sku || 'SKU-DS11-BLU',
    isSerialized: selectedProduct.value?.isSerialized !== false,
    units: String(requestedCount),
    requestedBy: user.value?.name || 'Branch Manager',
    dispatched: form.value.requestedDate || 'Today',
    status: isBranchUser.value ? 'Pending Approval' : 'Approved',
    carrier: form.value.carrier,
    expectedArrival: form.value.expectedArrival,
    notes: form.value.notes
  }

  try {
    if (isEditMode.value) {
      store.updateTransfer(payload.id, payload)
      emit('updated', payload)
    } else {
      store.addTransfer(payload)
      emit('created', payload)
    }
    close()
  } catch (err) {
    errorMessage.value = err.message
  }
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
              <span v-if="isBranchUser">Branch Manager / Transfers / <span class="font-bold text-gray-800">{{ isEditMode ? 'Edit Transfer' : 'Create Transfer' }}</span></span>
              <span v-else>Super Admin / Inventory / Transfers / <span class="font-bold text-gray-800">{{ isEditMode ? 'Edit Transfer' : 'Create Transfer' }}</span></span>
            </div>
            <h1 class="text-[28px] sm:text-[32px] tracking-tight font-bold text-gray-900">{{ isEditMode ? 'Edit Transfer' : 'Create Transfer' }}</h1>
            <p class="text-xs sm:text-sm text-gray-500 mt-1">Move exact units between branches with dispatch and receiving control.</p>
          </div>
        </div>

        <!-- Error Alert Banner -->
        <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3.5 flex items-center gap-2.5">
          <AlertCircle class="w-4 h-4 shrink-0 text-red-600" />
          <span class="font-medium">{{ errorMessage }}</span>
        </div>

        <!-- 2 Column Form Grid -->
        <form @submit.prevent="submitTransfer" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Left Column: Route & Product Selection -->
            <div class="space-y-6">
              <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
                <h3 class="text-[14px] font-bold text-gray-900">Transfer Route</h3>
                
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">From Branch *</label>
                  <select 
                    v-model="form.fromBranch" 
                    :disabled="isBranchUser"
                    class="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                  >
                    <option v-for="b in branchOptions" :key="b" :value="b">{{ b }} Branch</option>
                  </select>
                  <p v-if="isBranchUser" class="text-[10px] text-gray-400 mt-1">Locked to authorized branch session.</p>
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">To Branch *</label>
                  <select 
                    v-model="form.toBranch" 
                    class="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors"
                  >
                    <option v-for="b in branchOptions.filter(b => b !== form.fromBranch)" :key="b" :value="b">{{ b }} Branch</option>
                  </select>
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Product to Move *</label>
                  <select 
                    v-model="form.productId" 
                    class="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors"
                  >
                    <option v-for="prod in store.products" :key="prod.id" :value="prod.id">
                      {{ prod.name }} ({{ prod.isSerialized ? 'Serialized Vehicle' : 'Bulk Stock' }})
                    </option>
                  </select>
                  <div class="flex items-center justify-between text-[11px] mt-1 text-gray-500">
                    <span>Available at {{ form.fromBranch }}:</span>
                    <span class="font-bold" :class="availableAtSource > 0 ? 'text-[#165A31]' : 'text-red-500'">{{ availableAtSource }} units</span>
                  </div>
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Units to Move *</label>
                  <input 
                    v-model="form.units" 
                    type="number" 
                    min="1"
                    :max="availableAtSource || 1"
                    placeholder="e.g. 2" 
                    class="w-full px-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:border-[#165A31] transition-colors"
                    :class="showValidation && (!String(form.units).trim() || parseInt(form.units) > availableAtSource) ? 'border-red-300 bg-red-50/20' : 'border-gray-200'"
                  />
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Requested / Dispatch Date</label>
                  <input v-model="form.requestedDate" type="text" placeholder="e.g. Today" class="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors" />
                </div>
              </div>
            </div>

            <!-- Right Column: Dispatch & Logistics -->
            <div class="space-y-6">
              <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
                <h3 class="text-[14px] font-bold text-gray-900">Dispatch & Logistics</h3>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Carrier</label>
                  <input v-model="form.carrier" type="text" placeholder="e.g. Internal logistics / TCS" class="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Expected Arrival</label>
                  <input v-model="form.expectedArrival" type="text" placeholder="e.g. Tomorrow 14:00" class="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Notes</label>
                  <textarea v-model="form.notes" rows="4" placeholder="Handling instructions, route priority..." class="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors resize-none"></textarea>
                </div>
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
              {{ isEditMode ? 'Update Transfer' : 'Initiate Transfer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>