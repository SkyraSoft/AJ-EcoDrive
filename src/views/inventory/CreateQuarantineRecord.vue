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
  quarantineItem: {
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
  unit: 'M3-01014',
  product: 'BRG M3',
  source: 'TR-221 (In Transit)',
  condition: 'Packaging damage',
  status: 'Quarantine',
  notes: 'Minor packaging damage identified upon unloading. Body inspection shows minor surface friction, internal components verified intact.',
  evidence: 'Photo_Inspection_01.jpg',
  decision: 'QC / service',
  reportedBy: computed(() => `Branch Manager (${user.value?.branchName || 'Peshawar'} Branch)`),
  approval: 'Branch Manager / HQ QC Approval',
  branch: user.value?.branchName || 'Peshawar'
})

const loadData = (data) => {
  if (!data) return
  isEditMode.value = true
  form.value = {
    ...form.value,
    id: data.id || data.unit || form.value.id,
    unit: data.unit || form.value.unit,
    product: data.product || data.model || form.value.product,
    source: data.source || form.value.source,
    condition: data.condition || data.defect || form.value.condition,
    status: data.status || form.value.status,
    notes: data.notes || data.details || form.value.notes,
    evidence: data.evidence || form.value.evidence,
    decision: data.decision || form.value.decision,
    branch: data.branch || form.value.branch
  }
}

onMounted(() => {
  if (props.quarantineItem) {
    loadData(props.quarantineItem)
  } else if (store.originalEditQuarantine) {
    loadData(store.originalEditQuarantine)
  }
})

watch(() => props.quarantineItem, (newVal) => {
  if (newVal) loadData(newVal)
}, { immediate: true })

const close = () => {
  store.originalEditQuarantine = null
  emit('close')
  if (router.currentRoute.value.path.includes('/create')) {
    router.push('/inventory/quarantine')
  }
}

const submitQuarantineRecord = () => {
  if (!form.value.unit.trim() || !form.value.product.trim() || !form.value.condition.trim()) {
    showValidation.value = true
    return
  }

  const payload = {
    id: form.value.id || form.value.unit,
    unit: form.value.unit,
    product: form.value.product,
    source: form.value.source,
    condition: form.value.condition,
    status: form.value.status || 'Quarantine',
    notes: form.value.notes,
    evidence: form.value.evidence,
    decision: form.value.decision,
    branch: form.value.branch || user.value?.branchName || 'Peshawar',
    date: 'Today'
  }

  if (isEditMode.value) {
    emit('updated', payload)
  } else {
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
              <span v-if="isBranchUser">Branch Manager / Damaged / Quarantine / <span class="font-bold text-gray-800">{{ isEditMode ? 'Edit Quarantine Record' : 'Report Damaged / Quarantine' }}</span></span>
              <span v-else>Super Admin / Inventory / Quarantine / <span class="font-bold text-gray-800">{{ isEditMode ? 'Edit Quarantine Record' : 'Report Damaged / Quarantine' }}</span></span>
            </div>
            <h1 class="text-[28px] sm:text-[32px] tracking-tight font-bold text-gray-900">{{ isEditMode ? 'Edit Quarantine Record' : 'Report Damaged / Quarantine' }}</h1>
            <p class="text-xs sm:text-sm text-gray-500 mt-1">Record affected unit, physical condition, evidence and propose disposition decision.</p>
          </div>
        </div>

        <!-- 2 Column Form Grid -->
        <form @submit.prevent="submitQuarantineRecord" class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Left Card: Unit & Defect Details -->
            <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
              <h3 class="text-sm font-bold text-gray-900 mb-2">Affected Unit Details</h3>
              
              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Unit / Serial Number *</label>
                <input 
                  v-model="form.unit"
                  type="text" 
                  placeholder="e.g. M3-01014"
                  class="w-full px-3.5 py-2 bg-white border rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                  :class="showValidation && !form.unit.trim() ? 'border-red-300 bg-red-50/20' : 'border-gray-200'"
                />
                <p v-if="showValidation && !form.unit.trim()" class="text-[10px] text-red-500 font-medium mt-1">Unit serial is required</p>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Product / Model *</label>
                <input 
                  v-model="form.product"
                  type="text" 
                  placeholder="e.g. BRG M3"
                  class="w-full px-3.5 py-2 bg-white border rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                  :class="showValidation && !form.product.trim() ? 'border-red-300 bg-red-50/20' : 'border-gray-200'"
                />
                <p v-if="showValidation && !form.product.trim()" class="text-[10px] text-red-500 font-medium mt-1">Product model is required</p>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Source / Origin</label>
                <input 
                  v-model="form.source"
                  type="text" 
                  placeholder="e.g. TR-221, Inbound INB-083, Showroom Floor"
                  class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                />
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Condition / Defect Description *</label>
                <input 
                  v-model="form.condition"
                  type="text" 
                  placeholder="e.g. Packaging damage, Body panel dent, Faulty battery"
                  class="w-full px-3.5 py-2 bg-white border rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                  :class="showValidation && !form.condition.trim() ? 'border-red-300 bg-red-50/20' : 'border-gray-200'"
                />
                <p v-if="showValidation && !form.condition.trim()" class="text-[10px] text-red-500 font-medium mt-1">Defect condition is required</p>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Initial Status</label>
                <select 
                  v-model="form.status"
                  class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-[#165A31] transition-colors cursor-pointer"
                >
                  <option value="Quarantine">Quarantine (Isolated)</option>
                  <option value="Decision Pending">Decision Pending</option>
                  <option value="QC Hold">QC Hold</option>
                  <option value="Service Route">Service Route</option>
                </select>
              </div>
            </div>

            <!-- Right Card: Inspection & Proposed Decision -->
            <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
              <h3 class="text-sm font-bold text-gray-900 mb-2">Inspection & Disposition</h3>
              
              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Proposed Decision / Route</label>
                <select 
                  v-model="form.decision"
                  class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-[#165A31] transition-colors cursor-pointer"
                >
                  <option value="QC / service">QC / service</option>
                  <option value="Supplier-return review">Supplier-return review</option>
                  <option value="Internal repair">Internal repair</option>
                  <option value="Scrap pending">Scrap pending</option>
                  <option value="Return to available stock">Return to available stock</option>
                </select>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Inspection Evidence / Attached File</label>
                <input 
                  v-model="form.evidence"
                  type="text" 
                  placeholder="e.g. Photo_Inspection_01.jpg"
                  class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                />
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Detailed Inspection Notes</label>
                <textarea 
                  v-model="form.notes"
                  rows="3"
                  placeholder="Describe visible damage, test results, or reason for quarantine..."
                  class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors resize-none"
                ></textarea>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Reported By</label>
                <input 
                  :value="form.reportedBy"
                  readonly
                  type="text" 
                  class="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 focus:outline-none"
                />
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Approval Required</label>
                <input 
                  v-model="form.approval"
                  type="text" 
                  class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-[#165A31] transition-colors"
                />
              </div>
            </div>
          </div>

          <!-- Bottom Notice Banner -->
          <div class="bg-[#f0fdf4] border border-[#dcfce7] rounded-xl px-5 py-3.5 text-xs text-gray-700 flex items-center justify-between">
            <span>Submitting this record flags the unit in quarantine and prevents it from being allocated to customer sales until resolution.</span>
            <span class="text-[11px] font-bold text-[#165A31] whitespace-nowrap ml-4">Isolation active upon submit</span>
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
              {{ isEditMode ? 'Update Record' : 'Submit for Approval' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
