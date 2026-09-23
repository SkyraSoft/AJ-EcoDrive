<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { X } from 'lucide-vue-next'
import { store } from '@/store'

const props = defineProps({
  isModal: {
    type: Boolean,
    default: true
  },
  returnItem: {
    type: Object,
    default: null
  }
})

const router = useRouter()
const emit = defineEmits(['close', 'created', 'updated'])
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const showValidation = ref(false)
const isEditMode = ref(false)

const formData = ref({
  returnNo: '',
  orderNo: '',
  customer: '',
  unit: '',
  branch: user.value?.branchName || 'Peshawar',
  reason: 'Performance Issue',
  requested: 'Exchange',
  status: 'Inspection',
  notes: ''
})

const loadData = (data) => {
  if (!data) return
  isEditMode.value = true
  formData.value = {
    ...formData.value,
    returnNo: data.returnNo || formData.value.returnNo,
    orderNo: data.order || data.orderNo || formData.value.orderNo,
    customer: data.customer || formData.value.customer,
    unit: data.unit || formData.value.unit,
    branch: data.branch || formData.value.branch,
    reason: data.reason || formData.value.reason,
    requested: data.requested || formData.value.requested,
    status: data.status || formData.value.status,
    notes: data.notes || formData.value.notes
  }
}

onMounted(() => {
  if (props.returnItem) {
    loadData(props.returnItem)
  } else if (store.originalEditReturn) {
    loadData(store.originalEditReturn)
  }
})

watch(() => props.returnItem, (newVal) => {
  if (newVal) loadData(newVal)
}, { immediate: true })

const close = () => {
  store.originalEditReturn = null
  emit('close')
  if (router.currentRoute.value.path.includes('/create')) {
    router.push('/sales/returns')
  }
}

const createReturn = () => {
  if (!formData.value.orderNo.trim() || !formData.value.unit.trim() || !formData.value.customer.trim()) {
    showValidation.value = true
    return
  }
  
  const payload = {
    returnNo: formData.value.returnNo || `RET-${Math.floor(100 + Math.random() * 900)}`,
    order: formData.value.orderNo,
    orderNo: formData.value.orderNo,
    customer: formData.value.customer,
    unit: formData.value.unit,
    branch: formData.value.branch || user.value?.branchName || 'Peshawar',
    reason: formData.value.reason,
    requested: formData.value.requested || 'Exchange',
    status: formData.value.status || 'Inspection',
    statusClass: formData.value.status === 'Completed' ? 'bg-[#dcfce7] text-[#165A31]' : 'bg-orange-50 text-orange-700',
    statusColor: formData.value.status === 'Completed' ? 'bg-[#eefcf2] text-[#165A31]' : 'bg-orange-50 text-orange-700',
    notes: formData.value.notes
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

    <!-- Modal Card -->
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">
      
      <!-- Scrollable Form Body -->
      <div class="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
        <!-- Header -->
        <div>
          <div class="text-[10px] text-gray-500 mb-1">
            <span v-if="isBranchUser">Branch Manager / Returns & Refunds / <span class="font-bold text-gray-800">{{ isEditMode ? 'Edit Return' : 'Create Return' }}</span></span>
            <span v-else>Super Admin / Sales & CRM / Returns & Refunds / <span class="font-bold text-gray-800">{{ isEditMode ? 'Edit Return' : 'Create Return' }}</span></span>
          </div>
          <h1 class="text-[32px] tracking-tight font-bold text-gray-900">{{ isEditMode ? 'Edit Return' : 'Create Return' }}</h1>
          <p class="text-sm text-gray-500 mt-1">Initiate customer unit return, refund assessment and inventory restocking routing.</p>
        </div>

        <form @submit.prevent="createReturn" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <!-- 1. Order & Customer Info Card -->
            <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
              <h3 class="text-[14px] font-bold text-gray-900 mb-4">Original Order & Customer</h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Original Order No *</label>
                  <input 
                    v-model="formData.orderNo" 
                    type="text" 
                    placeholder="e.g. ORD-2188 or SO-7702" 
                    class="w-full px-3.5 py-2 text-[12px] bg-white border rounded-lg focus:outline-none focus:border-[#165A31] transition-colors"
                    :class="showValidation && !formData.orderNo.trim() ? 'border-red-300 bg-red-50/20' : 'border-gray-200'"
                  />
                  <p v-if="showValidation && !formData.orderNo.trim()" class="text-[10px] text-red-500 mt-1">Order number is required</p>
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Customer Name *</label>
                  <input 
                    v-model="formData.customer" 
                    type="text" 
                    placeholder="e.g. Noman Ali" 
                    class="w-full px-3.5 py-2 text-[12px] bg-white border rounded-lg focus:outline-none focus:border-[#165A31] transition-colors"
                    :class="showValidation && !formData.customer.trim() ? 'border-red-300 bg-red-50/20' : 'border-gray-200'"
                  />
                  <p v-if="showValidation && !formData.customer.trim()" class="text-[10px] text-red-500 mt-1">Customer name is required</p>
                </div>
              </div>
            </div>

            <!-- 2. Unit & Branch Card -->
            <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
              <h3 class="text-[14px] font-bold text-gray-900 mb-4">Unit & Destination</h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Unit Serial No *</label>
                  <input 
                    v-model="formData.unit" 
                    type="text" 
                    placeholder="e.g. CH 8-BRG-26-01731" 
                    class="w-full px-3.5 py-2 text-[12px] bg-white border rounded-lg focus:outline-none focus:border-[#165A31] transition-colors"
                    :class="showValidation && !formData.unit.trim() ? 'border-red-300 bg-red-50/20' : 'border-gray-200'"
                  />
                  <p v-if="showValidation && !formData.unit.trim()" class="text-[10px] text-red-500 mt-1">Unit serial is required</p>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-700 mb-1">Receiving Branch</label>
                    <select v-model="formData.branch" class="w-full px-3.5 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors">
                      <option value="Peshawar">Peshawar</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Lahore">Lahore</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-700 mb-1">Requested Action</label>
                    <select v-model="formData.requested" class="w-full px-3.5 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors">
                      <option value="Exchange">Exchange</option>
                      <option value="Refund">Refund</option>
                      <option value="Repair / Service">Repair / Service</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. Reason & Notes Card -->
          <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
            <h3 class="text-[14px] font-bold text-gray-900 mb-4">Return Reason & Inspection</h3>
            
            <div class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Reason for Return</label>
                  <select v-model="formData.reason" class="w-full px-3.5 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors">
                    <option value="Battery Issue">Battery Issue</option>
                    <option value="Performance Issue">Performance Issue</option>
                    <option value="Customer Dissatisfaction">Customer Dissatisfaction</option>
                    <option value="Damaged in Transit">Damaged in Transit</option>
                    <option value="Wrong Specification">Wrong Specification</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Inspection Status</label>
                  <select v-model="formData.status" class="w-full px-3.5 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors">
                    <option value="Inspection">Under Inspection</option>
                    <option value="Pending Approval">Pending Approval</option>
                    <option value="Refund Approved">Refund Approved</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1">Inspection Notes</label>
                <textarea v-model="formData.notes" rows="3" placeholder="Condition details, battery health or reason specifics..." class="w-full px-3.5 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors resize-none"></textarea>
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="flex items-center justify-end gap-3 pt-2">
            <button 
              type="button" 
              @click="close" 
              class="bg-white border border-gray-200 text-gray-700 text-xs font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-sm"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="bg-[#165A31] text-white text-xs font-semibold px-5 py-2.5 rounded-lg hover:bg-[#124a28] transition-colors cursor-pointer shadow-sm"
            >
              {{ isEditMode ? 'Update Return' : 'Create Return' }}
            </button>
          </div>
        </form>
      </div>

    </div>
  </div>
</template>
