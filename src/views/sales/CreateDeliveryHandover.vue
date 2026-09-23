<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { X, Check } from 'lucide-vue-next'
import { store } from '@/store'

const props = defineProps({
  isModal: {
    type: Boolean,
    default: true
  },
  handover: {
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

const availableOrders = computed(() => {
  const branchName = user.value?.branchName || 'Peshawar'
  return store.orders.filter(o => !isBranchUser.value || !o.branch || o.branch === branchName)
})

const form = ref({
  delivery_id: '',
  order: '',
  customer: '',
  customer_id: '',
  unit: '',
  unit_id: '',
  scheduled: 'Today 16:00',
  officer: 'Hamza',
  status: 'Ready',
  branch: user.value?.branchName || 'Peshawar',
  branch_id: 'BR-01',
  identityVerified: true,
  paymentComplete: true,
  chassisVerified: true,
  accessoriesIncluded: true,
  warrantyBriefed: true,
  notes: 'Vehicle cleaned, charged and prepared for customer handover.'
})

const onOrderSelect = (orderId) => {
  const o = store.getOrderById(orderId)
  if (o) {
    form.value.order = o.id || o.order
    form.value.customer = o.customer
    form.value.customer_id = o.customer_id
    form.value.unit = o.unit || o.unit_id
    form.value.unit_id = o.unit_id || o.unit
    form.value.branch = o.branch || form.value.branch
    form.value.branch_id = o.branch_id || form.value.branch_id
  }
}

const loadData = (data) => {
  if (!data) return
  isEditMode.value = true
  form.value = {
    ...form.value,
    delivery_id: data.delivery_id || data.id || form.value.delivery_id,
    order: data.order || data.order_id || form.value.order,
    customer: data.customer || form.value.customer,
    customer_id: data.customer_id || form.value.customer_id,
    unit: data.unit || data.unit_id || form.value.unit,
    unit_id: data.unit_id || data.unit || form.value.unit_id,
    scheduled: data.scheduled || data.scheduledTime || form.value.scheduled,
    officer: data.officer || form.value.officer,
    status: data.status || form.value.status,
    branch: data.branch || form.value.branch,
    branch_id: data.branch_id || form.value.branch_id,
    identityVerified: data.identityVerified !== undefined ? data.identityVerified : form.value.identityVerified,
    paymentComplete: data.paymentComplete !== undefined ? data.paymentComplete : form.value.paymentComplete,
    chassisVerified: data.chassisVerified !== undefined ? data.chassisVerified : form.value.chassisVerified,
    accessoriesIncluded: data.accessoriesIncluded !== undefined ? data.accessoriesIncluded : form.value.accessoriesIncluded,
    warrantyBriefed: data.warrantyBriefed !== undefined ? data.warrantyBriefed : form.value.warrantyBriefed,
    notes: data.notes || form.value.notes
  }
}

onMounted(() => {
  if (props.handover) {
    loadData(props.handover)
  } else if (store.originalEditHandover) {
    loadData(store.originalEditHandover)
  }
})

watch(() => props.handover, (newVal) => {
  if (newVal) loadData(newVal)
}, { immediate: true })

const close = () => {
  store.originalEditHandover = null
  emit('close')
  if (router.currentRoute.value.path.includes('/create')) {
    router.push('/sales/delivery')
  }
}

const saveHandover = () => {
  if (!form.value.order.trim() || !form.value.customer.trim() || !form.value.unit.trim()) {
    showValidation.value = true
    return
  }

  const delivId = isEditMode.value ? (props.handover?.delivery_id || props.handover?.id || form.value.delivery_id || form.value.order) : `DEL-${Math.floor(1000 + Math.random() * 9000)}`

  const payload = {
    id: delivId,
    delivery_id: delivId,
    order: form.value.order,
    order_id: form.value.order,
    customer: form.value.customer,
    customer_id: form.value.customer_id || (store.customers.find(c => c.name === form.value.customer)?.id) || 'CUST-101',
    unit: form.value.unit,
    unit_id: form.value.unit_id || form.value.unit,
    scheduled: form.value.scheduled,
    scheduledTime: form.value.scheduled,
    status: form.value.status,
    officer: form.value.officer,
    branch: form.value.branch || user.value?.branchName || 'Peshawar',
    branch_id: form.value.branch_id || 'BR-01',
    identityVerified: form.value.identityVerified,
    paymentComplete: form.value.paymentComplete,
    chassisVerified: form.value.chassisVerified,
    accessoriesIncluded: form.value.accessoriesIncluded,
    warrantyBriefed: form.value.warrantyBriefed,
    notes: form.value.notes,
    statusClass: form.value.status === 'Ready' ? 'bg-[#dcfce7] text-[#165A31]' : (form.value.status === 'Delivered' ? 'bg-[#165A31] text-white' : 'bg-[#eff6ff] text-[#2563eb]')
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
    <!-- Floating Close Button -->
    <button @click="close" class="fixed top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-100 rounded-full z-[110] shadow-lg transition-colors cursor-pointer">
      <X class="w-5 h-5" />
    </button>

    <!-- Modal Card -->
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">
      <div class="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <div>
            <div class="text-[10px] text-gray-500 mb-1">
              <span v-if="isBranchUser">Branch Manager / Delivery / Handover / <span class="font-bold text-gray-800">{{ isEditMode ? 'Edit Handover' : 'Schedule Handover' }}</span></span>
              <span v-else>Super Admin / Sales & CRM / Delivery / <span class="font-bold text-gray-800">{{ isEditMode ? 'Edit Handover' : 'Schedule Handover' }}</span></span>
            </div>
            <h1 class="text-[28px] sm:text-[32px] tracking-tight font-bold text-gray-900">{{ isEditMode ? 'Edit Handover' : 'Schedule Delivery / Handover' }}</h1>
            <p class="text-xs sm:text-sm text-gray-500 mt-1">Verify customer clearance, unit preparation, checklist, and schedule physical handover.</p>
          </div>
        </div>

        <!-- 2 Column Form Grid -->
        <form @submit.prevent="saveHandover" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <!-- Left Card -->
            <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
              <h3 class="text-sm font-bold text-gray-900 mb-4">Handover & Order Details</h3>

              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="block text-[11px] font-semibold text-gray-700">Order / Sale ID *</label>
                  <select 
                    @change="onOrderSelect($event.target.value)"
                    class="text-[10px] bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5 text-gray-600 focus:outline-none cursor-pointer"
                  >
                    <option value="">Select from active orders...</option>
                    <option v-for="o in availableOrders" :key="o.id" :value="o.id">
                      {{ o.id }} — {{ o.customer }}
                    </option>
                  </select>
                </div>
                <input 
                  v-model="form.order" 
                  type="text" 
                  placeholder="e.g. ORD-2241 or ORD-2235" 
                  class="w-full px-3.5 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:border-[#165A31] transition-colors"
                  :class="showValidation && !form.order.trim() ? 'border-red-300 bg-red-50/20' : 'border-gray-200'"
                />
                <p v-if="showValidation && !form.order.trim()" class="text-[10px] text-red-500 mt-1">Order reference is required</p>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1">Customer Name *</label>
                <input 
                  v-model="form.customer" 
                  type="text" 
                  placeholder="e.g. Ahsan Khan or Sami Ullah" 
                  class="w-full px-3.5 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:border-[#165A31] transition-colors"
                  :class="showValidation && !form.customer.trim() ? 'border-red-300 bg-red-50/20' : 'border-gray-200'"
                />
                <p v-if="showValidation && !form.customer.trim()" class="text-[10px] text-red-500 mt-1">Customer name is required</p>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1">Unit / Chassis Number *</label>
                <input 
                  v-model="form.unit" 
                  type="text" 
                  placeholder="e.g. CHS-01882 or CH 8-BRG-26-01731" 
                  class="w-full px-3.5 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:border-[#165A31] transition-colors"
                  :class="showValidation && !form.unit.trim() ? 'border-red-300 bg-red-50/20' : 'border-gray-200'"
                />
                <p v-if="showValidation && !form.unit.trim()" class="text-[10px] text-red-500 mt-1">Unit / Chassis is required</p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Scheduled Time</label>
                  <input 
                    v-model="form.scheduled" 
                    type="text" 
                    placeholder="e.g. Today 16:00" 
                    class="w-full px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Handover Status</label>
                  <select 
                    v-model="form.status"
                    class="w-full px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors cursor-pointer"
                  >
                    <option value="Ready">Ready</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Right Card -->
            <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
              <h3 class="text-sm font-bold text-gray-900 mb-4">Pre-delivery Verification Checklist</h3>

              <div class="space-y-3 bg-gray-50/50 p-3.5 rounded-lg border border-gray-100">
                <label class="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" v-model="form.identityVerified" class="w-4 h-4 text-[#165A31] rounded border-gray-300 focus:ring-[#165A31]" />
                  <span class="text-xs text-gray-800 font-medium">Customer CNIC / Identity verified</span>
                </label>

                <label class="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" v-model="form.paymentComplete" class="w-4 h-4 text-[#165A31] rounded border-gray-300 focus:ring-[#165A31]" />
                  <span class="text-xs text-gray-800 font-medium">Payment completed and invoice issued</span>
                </label>

                <label class="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" v-model="form.chassisVerified" class="w-4 h-4 text-[#165A31] rounded border-gray-300 focus:ring-[#165A31]" />
                  <span class="text-xs text-gray-800 font-medium">Chassis & Serial numbers verified</span>
                </label>

                <label class="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" v-model="form.accessoriesIncluded" class="w-4 h-4 text-[#165A31] rounded border-gray-300 focus:ring-[#165A31]" />
                  <span class="text-xs text-gray-800 font-medium">Standard accessories & charger included</span>
                </label>

                <label class="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" v-model="form.warrantyBriefed" class="w-4 h-4 text-[#165A31] rounded border-gray-300 focus:ring-[#165A31]" />
                  <span class="text-xs text-gray-800 font-medium">Warranty terms and booklet handed over</span>
                </label>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1">Handover Notes / Instructions</label>
                <textarea 
                  v-model="form.notes" 
                  rows="3" 
                  placeholder="Enter handover details or customer special requests..." 
                  class="w-full px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors resize-none"
                ></textarea>
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
              {{ isEditMode ? 'Update Handover' : 'Schedule Handover' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
