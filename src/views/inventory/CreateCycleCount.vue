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
  countItem: {
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
  countName: 'Showroom Count',
  scope: 'Showroom Units',
  assignedTo: 'Branch Team',
  scheduledDate: 'Today',
  expectedUnits: '20 units',
  targetLocation: 'Main Showroom',
  notes: 'Verify chassis & serial tags on all displayed EV units.',
  status: 'In Progress',
  branch: user.value?.branchName || 'Peshawar'
})

const loadData = (data) => {
  if (!data) return
  isEditMode.value = true
  form.value = {
    ...form.value,
    id: data.id || data.session || form.value.id,
    countName: data.name || data.countName || form.value.countName,
    scope: data.scope || form.value.scope,
    assignedTo: data.assignedTo || data.assignee || form.value.assignedTo,
    scheduledDate: data.date || data.scheduledDate || form.value.scheduledDate,
    expectedUnits: data.expected || data.expectedUnits || form.value.expectedUnits,
    targetLocation: data.location || data.targetLocation || form.value.targetLocation,
    notes: data.notes || form.value.notes,
    status: data.status || form.value.status,
    branch: data.branch || form.value.branch
  }
}

onMounted(() => {
  if (props.countItem) {
    loadData(props.countItem)
  } else if (store.originalEditCycleCount) {
    loadData(store.originalEditCycleCount)
  }
})

watch(() => props.countItem, (newVal) => {
  if (newVal) loadData(newVal)
}, { immediate: true })

const close = () => {
  store.originalEditCycleCount = null
  emit('close')
  if (router.currentRoute.value.path.includes('/create')) {
    router.push('/inventory/cycle-counts')
  }
}

const startSession = () => {
  if (!form.value.countName.trim() || !form.value.scope.trim()) {
    showValidation.value = true
    return
  }

  const payload = {
    id: form.value.id || `CC-${Math.floor(100 + Math.random() * 900)}`,
    session: form.value.id || `CC-${Math.floor(100 + Math.random() * 900)}`,
    name: form.value.countName,
    scope: form.value.scope,
    assignedTo: form.value.assignedTo,
    date: form.value.scheduledDate || 'Today',
    expected: form.value.expectedUnits || '20 units',
    counted: '0 units',
    variance: '0',
    location: form.value.targetLocation,
    notes: form.value.notes,
    status: form.value.status || 'In Progress',
    branch: form.value.branch || user.value?.branchName || 'Peshawar'
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
              <span v-if="isBranchUser">Branch Manager / Cycle Counts / <span class="font-bold text-gray-800">{{ isEditMode ? 'Edit Cycle Count' : 'Start Cycle Count' }}</span></span>
              <span v-else>Super Admin / Inventory / Cycle Counts / <span class="font-bold text-gray-800">{{ isEditMode ? 'Edit Cycle Count' : 'Start Cycle Count' }}</span></span>
            </div>
            <h1 class="text-[28px] sm:text-[32px] tracking-tight font-bold text-gray-900">{{ isEditMode ? 'Edit Cycle Count' : 'Start Cycle Count' }}</h1>
            <p class="text-xs sm:text-sm text-gray-500 mt-1">Initialize physical count session for {{ user?.branchName || 'Peshawar' }} Branch.</p>
          </div>
        </div>

        <!-- 2 Column Form Grid -->
        <form @submit.prevent="startSession" class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Left Card: Count Scope -->
            <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
              <h3 class="text-sm font-bold text-gray-900 mb-2">Count Scope</h3>
              
              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Count Name *</label>
                <input 
                  v-model="form.countName"
                  type="text" 
                  placeholder="e.g. Showroom Count"
                  class="w-full px-3.5 py-2 bg-white border rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                  :class="showValidation && !form.countName.trim() ? 'border-red-300 bg-red-50/20' : 'border-gray-200'"
                />
                <p v-if="showValidation && !form.countName.trim()" class="text-[10px] text-red-500 font-medium mt-1">Count name is required</p>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Scope Area *</label>
                <input 
                  v-model="form.scope"
                  type="text" 
                  placeholder="e.g. Showroom Units or Battery Storage"
                  class="w-full px-3.5 py-2 bg-white border rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                  :class="showValidation && !form.scope.trim() ? 'border-red-300 bg-red-50/20' : 'border-gray-200'"
                />
                <p v-if="showValidation && !form.scope.trim()" class="text-[10px] text-red-500 font-medium mt-1">Scope area is required</p>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Assigned Team / Auditor</label>
                <input 
                  v-model="form.assignedTo"
                  type="text" 
                  placeholder="e.g. Branch Team"
                  class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                />
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Scheduled Date</label>
                <input 
                  v-model="form.scheduledDate"
                  type="text" 
                  placeholder="e.g. Today or 30 Aug"
                  class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                />
              </div>
            </div>

            <!-- Right Card: Target & Notes -->
            <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
              <h3 class="text-sm font-bold text-gray-900 mb-2">Count Target & Location</h3>
              
              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Expected Units Count</label>
                <input 
                  v-model="form.expectedUnits"
                  type="text" 
                  placeholder="e.g. 20 units"
                  class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                />
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Target Location</label>
                <input 
                  v-model="form.targetLocation"
                  type="text" 
                  placeholder="e.g. Main Showroom & Staging Area"
                  class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                />
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Instructions & Notes</label>
                <textarea 
                  v-model="form.notes"
                  rows="4"
                  placeholder="Instructions for team e.g. verify barcode & serial tags..."
                  class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Alert Notice Banner -->
          <div class="bg-[#f0fdf4] border border-[#dcfce7] rounded-xl px-5 py-3.5 text-xs text-gray-700">
            Starting a count generates an active counting session with pre-populated expected quantities.
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
              {{ isEditMode ? 'Update Session' : 'Start Count Session' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>