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
  adjustmentItem: {
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
  productUnit: 'BRG X5',
  existingState: '6 available',
  correctedState: '5 available',
  reason: 'Physical count variance',
  evidence: 'Count sheet attached',
  notes: 'One unit not found during count',
  requestedBy: 'Branch Manager',
  approval: 'Required before posting',
  status: 'Pending',
  branch: user.value?.branchName || 'Peshawar'
})

const loadData = (data) => {
  if (!data) return
  isEditMode.value = true
  form.value = {
    ...form.value,
    id: data.id || data.adjNo || form.value.id,
    productUnit: data.unit || data.product || data.productUnit || form.value.productUnit,
    existingState: data.systemQty || data.existingState || form.value.existingState,
    correctedState: data.actualQty || data.correctedState || form.value.correctedState,
    reason: data.reason || form.value.reason,
    evidence: data.evidence || form.value.evidence,
    notes: data.notes || form.value.notes,
    requestedBy: data.requestedBy || form.value.requestedBy,
    approval: data.approval || form.value.approval,
    status: data.status || form.value.status,
    branch: data.branch || form.value.branch
  }
}

onMounted(() => {
  if (props.adjustmentItem) {
    loadData(props.adjustmentItem)
  } else if (store.originalEditAdjustment) {
    loadData(store.originalEditAdjustment)
  }
})

watch(() => props.adjustmentItem, (newVal) => {
  if (newVal) loadData(newVal)
}, { immediate: true })

const close = () => {
  store.originalEditAdjustment = null
  emit('close')
  if (router.currentRoute.value.path.includes('/create')) {
    router.push('/inventory/stock-adjustments')
  }
}

const submitForApproval = () => {
  if (!form.value.productUnit.trim() || !form.value.reason.trim()) {
    showValidation.value = true
    return
  }

  const payload = {
    id: form.value.id || `ADJ-${Math.floor(100 + Math.random() * 900)}`,
    adjNo: form.value.id || `ADJ-${Math.floor(100 + Math.random() * 900)}`,
    product: form.value.productUnit,
    unit: form.value.productUnit,
    productUnit: form.value.productUnit,
    unitProduct: form.value.productUnit,
    existingState: form.value.existingState,
    correctedState: form.value.correctedState,
    reason: form.value.reason,
    evidence: form.value.evidence,
    notes: form.value.notes,
    requestedBy: form.value.requestedBy || `${user.value?.branchName || 'Peshawar'} Branch Manager`,
    status: form.value.status || 'Pending',
    branch: form.value.branch || user.value?.branchName || 'Peshawar',
    date: 'Today'
  }

  if (isEditMode.value) {
    if (typeof store.updateStockAdjustment === 'function') {
      store.updateStockAdjustment(payload.id, payload)
    }
    emit('updated', payload)
  } else {
    store.addStockAdjustment(payload)
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
              <span v-if="isBranchUser">Branch Manager / Adjustments / <span class="font-bold text-gray-800">{{ isEditMode ? 'Edit Adjustment Request' : 'Create Adjustment Request' }}</span></span>
              <span v-else>Super Admin / Inventory / Stock Adjustments / <span class="font-bold text-gray-800">{{ isEditMode ? 'Edit Adjustment Request' : 'Create Adjustment Request' }}</span></span>
            </div>
            <h1 class="text-[28px] sm:text-[32px] tracking-tight font-bold text-gray-900">{{ isEditMode ? 'Edit Adjustment Request' : 'Create Adjustment Request' }}</h1>
            <p class="text-xs sm:text-sm text-gray-500 mt-1">Submit corrected state, reason and evidence for supervisor approval.</p>
          </div>
        </div>

        <!-- 2 Column Form Grid -->
        <form @submit.prevent="submitForApproval" class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Left Card: Adjustment -->
            <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
              <h3 class="text-sm font-bold text-gray-900 mb-2">Adjustment Details</h3>
              
              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Product / Unit *</label>
                <input 
                  v-model="form.productUnit"
                  type="text" 
                  placeholder="e.g. BRG X5 or CHS-01882"
                  class="w-full px-3.5 py-2 bg-white border rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                  :class="showValidation && !form.productUnit.trim() ? 'border-red-300 bg-red-50/20' : 'border-gray-200'"
                />
                <p v-if="showValidation && !form.productUnit.trim()" class="text-[10px] text-red-500 font-medium mt-1">Product / Unit is required</p>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Existing System State</label>
                <input 
                  v-model="form.existingState"
                  type="text" 
                  placeholder="e.g. 6 available"
                  class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                />
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Corrected / Physical State</label>
                <input 
                  v-model="form.correctedState"
                  type="text" 
                  placeholder="e.g. 5 available"
                  class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                />
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Reason for Adjustment *</label>
                <textarea 
                  v-model="form.reason"
                  rows="3"
                  placeholder="e.g. Physical count variance, damaged in showroom..."
                  class="w-full px-3.5 py-2 bg-white border rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors resize-none"
                  :class="showValidation && !form.reason.trim() ? 'border-red-300 bg-red-50/20' : 'border-gray-200'"
                ></textarea>
                <p v-if="showValidation && !form.reason.trim()" class="text-[10px] text-red-500 font-medium mt-1">Reason is required</p>
              </div>
            </div>

            <!-- Right Card: Evidence -->
            <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
              <h3 class="text-sm font-bold text-gray-900 mb-2">Evidence & Verification</h3>
              
              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Evidence Attachment</label>
                <input 
                  v-model="form.evidence"
                  type="text" 
                  placeholder="e.g. Count_Sheet_Aug28.pdf"
                  class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                />
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Notes</label>
                <textarea 
                  v-model="form.notes"
                  rows="3"
                  placeholder="Additional observations or stock keeper remarks..."
                  class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors resize-none"
                ></textarea>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Requested By</label>
                <input 
                  v-model="form.requestedBy"
                  type="text" 
                  class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                />
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Approval Hierarchy</label>
                <input 
                  v-model="form.approval"
                  type="text" 
                  class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                />
              </div>
            </div>
          </div>

          <!-- Bottom Banner -->
          <div class="bg-[#f0fdf4] border border-[#dcfce7] rounded-xl px-5 py-3.5 text-xs text-gray-700">
            Submitting the request does not immediately alter inventory balances. Head office QC / Auditor approval is required.
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
              {{ isEditMode ? 'Update Request' : 'Submit for Approval' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
