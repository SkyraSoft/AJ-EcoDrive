<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../../store.js'
import { X, AlertCircle, Truck, ShieldCheck, Check, ArrowRight } from 'lucide-vue-next'

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
  carrier: 'AJ Logistics Truck #4 (LES-4921)',
  driverContact: 'Tariq Mehmood (0301-5558192)',
  gatePassNo: 'GP-TR-8812',
  expectedArrival: 'Tomorrow 14:00',
  notes: 'Inter-showroom inventory rebalancing for weekend sales drive',
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
    productId: data.items?.[0]?.product_id || data.product_id || form.value.productId,
    units: String(data.units || form.value.units),
    requestedDate: data.dispatched || data.requestedDate || form.value.requestedDate,
    carrier: data.carrier || form.value.carrier,
    driverContact: data.driverContact || form.value.driverContact,
    gatePassNo: data.gatePassNo || form.value.gatePassNo,
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
    errorMessage.value = 'Please fill in all required transfer fields.'
    return
  }

  if (form.value.fromBranch.trim().toLowerCase() === form.value.toBranch.trim().toLowerCase()) {
    errorMessage.value = 'Origin and destination branches must be different.'
    return
  }

  const requestedCount = parseInt(form.value.units, 10)
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
    requestedBy: user.value?.name || (isBranchUser.value ? 'Branch Manager' : 'Super Admin'),
    dispatched: form.value.requestedDate || 'Today',
    status: isBranchUser.value ? 'Pending Approval' : 'Approved',
    carrier: form.value.carrier,
    driverContact: form.value.driverContact,
    gatePassNo: form.value.gatePassNo,
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
              <span v-if="isBranchUser">Branch Manager / Transfers / <span class="font-bold text-gray-700 dark:text-gray-300">{{ isEditMode ? 'Edit Transfer' : 'Create Transfer' }}</span></span>
              <span v-else>Super Admin / Inventory / Transfers / <span class="font-bold text-gray-700 dark:text-gray-300">{{ isEditMode ? 'Edit Transfer' : 'Create Transfer' }}</span></span>
            </div>
            <h1 class="text-[28px] sm:text-[32px] tracking-tight font-bold text-gray-900 dark:text-white">{{ isEditMode ? 'Edit Transfer' : 'Create Transfer' }}</h1>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Move serialized units between branches with automated In-Transit custody and receiving control.</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80 flex items-center gap-1.5">
              <span>{{ form.fromBranch }}</span>
              <ArrowRight class="w-3.5 h-3.5" />
              <span>{{ form.toBranch }}</span>
            </span>
          </div>
        </div>

        <!-- Transfer Custody Info Banner -->
        <div class="p-3.5 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 rounded-xl flex items-start gap-3">
          <Truck class="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div class="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
            <span class="font-bold">Dealership Custody Rule:</span>
            Dispatched vehicles immediately enter <strong>"In-Transit"</strong> status and are removed from the origin branch's active sellable stock. The destination Branch Manager must inspect physical VINs upon truck arrival and click <strong>"Receive Transfer"</strong> to finalize custody.
          </div>
        </div>

        <!-- Error Alert Banner -->
        <div v-if="errorMessage" class="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300 text-xs rounded-xl p-3.5 flex items-center gap-2.5">
          <AlertCircle class="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
          <span class="font-medium">{{ errorMessage }}</span>
        </div>

        <!-- 2 Column Form Grid -->
        <form @submit.prevent="submitTransfer" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Left Column: Route & Product Selection -->
            <div class="space-y-6">
              <div class="bg-gray-50/50 dark:bg-[#1e293b]/50 border border-gray-100 dark:border-gray-800 rounded-xl p-6 space-y-4">
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">Transfer Route & Stock</h3>
                
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">From Branch (Origin) *</label>
                  <select 
                    v-model="form.fromBranch" 
                    :disabled="isBranchUser"
                    class="w-full px-3 py-2 text-xs bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#165A31] transition-colors disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <option v-for="b in branchOptions" :key="b" :value="b">{{ b }} Branch</option>
                  </select>
                  <p v-if="isBranchUser" class="text-[10px] text-gray-400 dark:text-gray-500 mt-1">Locked to current branch session.</p>
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">To Branch (Destination) *</label>
                  <select 
                    v-model="form.toBranch" 
                    class="w-full px-3 py-2 text-xs bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#165A31] transition-colors cursor-pointer"
                  >
                    <option v-for="b in branchOptions.filter(b => b !== form.fromBranch)" :key="b" :value="b">{{ b }} Branch</option>
                  </select>
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Product to Move *</label>
                  <select 
                    v-model="form.productId" 
                    class="w-full px-3 py-2 text-xs bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#165A31] transition-colors cursor-pointer"
                  >
                    <option v-for="prod in store.products" :key="prod.id" :value="prod.id">
                      {{ prod.name }} ({{ prod.isSerialized ? 'Serialized Vehicle' : 'Bulk Spare Part' }})
                    </option>
                  </select>
                  <div class="flex items-center justify-between text-[11px] mt-1.5 p-2 bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/60 rounded-lg">
                    <span class="text-gray-600 dark:text-gray-400">Available at {{ form.fromBranch }}:</span>
                    <span class="font-bold" :class="availableAtSource > 0 ? 'text-[#165A31] dark:text-emerald-400' : 'text-red-500'">{{ availableAtSource }} units</span>
                  </div>
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Units to Move *</label>
                  <input 
                    v-model="form.units" 
                    type="number" 
                    min="1"
                    :max="availableAtSource || 1"
                    placeholder="e.g. 2" 
                    class="w-full px-3 py-2 text-xs font-bold bg-white dark:bg-[#0f172a] border rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#165A31] transition-colors"
                    :class="showValidation && (!String(form.units).trim() || parseInt(form.units) > availableAtSource) ? 'border-red-300 bg-red-50/20 dark:border-red-500/50' : 'border-gray-200 dark:border-gray-700'"
                  />
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Requested / Dispatch Date</label>
                  <input v-model="form.requestedDate" type="text" placeholder="e.g. Today" class="w-full px-3 py-2 text-xs bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#165A31] transition-colors" />
                </div>
              </div>
            </div>

            <!-- Right Column: Dispatch & Logistics -->
            <div class="space-y-6">
              <div class="bg-gray-50/50 dark:bg-[#1e293b]/50 border border-gray-100 dark:border-gray-800 rounded-xl p-6 space-y-4">
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">Dispatch & Carrier Logistics</h3>
                
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Carrier / Truck Vehicle No.</label>
                  <input v-model="form.carrier" type="text" placeholder="e.g. AJ Logistics Truck #4 (LES-4921) / TCS" class="w-full px-3 py-2 text-xs bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#165A31] transition-colors" />
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Driver Name & Mobile No.</label>
                  <input v-model="form.driverContact" type="text" placeholder="e.g. Tariq Mehmood (0301-5558192)" class="w-full px-3 py-2 text-xs bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#165A31] transition-colors" />
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Outbound Gate Pass Reference</label>
                  <input v-model="form.gatePassNo" type="text" placeholder="e.g. GP-TR-8812" class="w-full px-3 py-2 text-xs bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#165A31] transition-colors font-mono" />
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Expected Arrival Date/Time</label>
                  <input v-model="form.expectedArrival" type="text" placeholder="e.g. Tomorrow 14:00" class="w-full px-3 py-2 text-xs bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#165A31] transition-colors" />
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Handling & Priority Notes</label>
                  <textarea v-model="form.notes" rows="2" placeholder="Secure battery tie-down ropes, avoid rain exposure..." class="w-full px-3 py-2 text-xs bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#165A31] transition-colors resize-none"></textarea>
                </div>
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
              {{ isEditMode ? 'Update Transfer' : (isBranchUser ? 'Submit Transfer Request' : 'Approve & Dispatch Transfer') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>