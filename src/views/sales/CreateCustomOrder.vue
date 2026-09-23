<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '@/store'
import { X } from 'lucide-vue-next'

const props = defineProps({
  isModal: {
    type: Boolean,
    default: true
  },
  customOrder: {
    type: Object,
    default: null
  }
})

const router = useRouter()
const emit = defineEmits(['close', 'created', 'updated'])
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const isEditMode = ref(false)
const showValidation = ref(false)

const form = ref({
  orderNo: '',
  customer: 'Jawad Khan',
  product: 'BRG X7 / Black',
  budget: 'PKR 360,000',
  desiredDate: '15 Sep 2026',
  deposit: 'PKR 100,000',
  paymentMethod: 'Bank Transfer',
  transactionId: '',
  reservation: 'On arrival',
  notes: 'Customer accepts equivalent trim if approved',
  status: 'Sourcing',
  branch: user.value?.branchName || 'Peshawar'
})

const loadData = (data) => {
  if (!data) return
  isEditMode.value = true
  form.value = {
    ...form.value,
    orderNo: data.orderNo || data.id || form.value.orderNo,
    customer: data.customer || form.value.customer,
    product: data.product || data.requirement || form.value.product,
    budget: data.budget || data.total || form.value.budget,
    desiredDate: data.desiredDate || data.eta || form.value.desiredDate,
    deposit: data.deposit || form.value.deposit,
    paymentMethod: data.paymentMethod || form.value.paymentMethod,
    reservation: data.reservation || form.value.reservation,
    notes: data.notes || form.value.notes,
    status: data.status || form.value.status,
    branch: data.branch || form.value.branch
  }
}

onMounted(() => {
  if (props.customOrder) {
    loadData(props.customOrder)
  } else if (store.originalEditCustomOrder) {
    loadData(store.originalEditCustomOrder)
  }
})

watch(() => props.customOrder, (newVal) => {
  if (newVal) loadData(newVal)
}, { immediate: true })

const close = () => {
  store.originalEditCustomOrder = null
  emit('close')
  if (router.currentRoute.value.path.includes('/create')) {
    router.push('/sales/custom-orders')
  }
}

const saveOrder = () => {
  if (!form.value.customer.trim() || !form.value.product.trim() || !form.value.deposit.trim()) {
    showValidation.value = true
    return
  }

  if (form.value.paymentMethod === 'Bank Transfer' && !form.value.transactionId?.trim()) {
    showValidation.value = true
    return
  }

  const payload = {
    orderNo: form.value.orderNo || `CO-${Math.floor(100 + Math.random() * 900)}`,
    customer: form.value.customer,
    requirement: form.value.product,
    product: form.value.product,
    budget: form.value.budget,
    total: form.value.budget,
    desiredDate: form.value.desiredDate,
    eta: form.value.desiredDate,
    deposit: form.value.deposit,
    paymentMethod: form.value.paymentMethod,
    reservation: form.value.reservation,
    notes: form.value.notes,
    status: form.value.status || 'Sourcing',
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
    <!-- Floating Close Button -->
    <button @click="close" class="fixed top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-100 rounded-full z-[110] shadow-lg transition-colors cursor-pointer">
      <X class="w-5 h-5" />
    </button>

    <!-- Modal Card -->
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">
      <!-- Scrollable Form Body -->
      <div class="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <div>
            <div class="text-[10px] text-gray-500 mb-1">
              <span v-if="isBranchUser">Branch Manager / Custom Orders / <span class="font-bold text-gray-800">{{ isEditMode ? 'Edit Custom Order' : 'Create Custom Order' }}</span></span>
              <span v-else>Super Admin / Sales & CRM / Custom Orders / <span class="font-bold text-gray-800">{{ isEditMode ? 'Edit Custom Order' : 'Create Custom Order' }}</span></span>
            </div>
            <h1 class="text-[28px] sm:text-[32px] tracking-tight font-bold text-gray-900">{{ isEditMode ? 'Edit Custom Order' : 'Create Custom Order' }}</h1>
            <p class="text-xs sm:text-sm text-gray-500 mt-1">Record customer requirement, budget, deposit and desired delivery schedule.</p>
          </div>
        </div>

        <!-- 2 Column Grid -->
        <form @submit.prevent="saveOrder" class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <!-- Left Card: Requirement -->
            <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
              <h3 class="text-sm font-bold text-gray-900 mb-2">Requirement & Customer</h3>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Customer Name *</label>
                <input 
                  v-model="form.customer"
                  type="text" 
                  placeholder="e.g. Jawad Khan"
                  class="w-full px-3.5 py-2 bg-white border rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                  :class="showValidation && !form.customer.trim() ? 'border-red-300 bg-red-50/20' : 'border-gray-200'"
                />
                <p v-if="showValidation && !form.customer.trim()" class="text-[10px] text-red-500 font-medium mt-1">Customer name is required</p>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Product / Specification *</label>
                <input 
                  v-model="form.product"
                  type="text" 
                  placeholder="e.g. BRG X7 / Matte Black"
                  class="w-full px-3.5 py-2 bg-white border rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                  :class="showValidation && !form.product.trim() ? 'border-red-300 bg-red-50/20' : 'border-gray-200'"
                />
                <p v-if="showValidation && !form.product.trim()" class="text-[10px] text-red-500 font-medium mt-1">Product specification is required</p>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Customer Budget</label>
                  <input 
                    v-model="form.budget"
                    type="text" 
                    placeholder="e.g. PKR 360,000"
                    class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                  />
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Target ETA / Date</label>
                  <input 
                    v-model="form.desiredDate"
                    type="text" 
                    placeholder="e.g. 15 Sep 2026"
                    class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                  />
                </div>
              </div>
            </div>

            <!-- Right Card: Commercial -->
            <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
              <h3 class="text-sm font-bold text-gray-900 mb-2">Commercial & Reservation</h3>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Deposit Amount *</label>
                  <input 
                    v-model="form.deposit"
                    type="text" 
                    placeholder="e.g. PKR 100,000"
                    class="w-full px-3.5 py-2 bg-white border rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors font-bold text-gray-900"
                    :class="showValidation && !form.deposit.trim() ? 'border-red-300 bg-red-50/20' : 'border-gray-200'"
                  />
                  <p v-if="showValidation && !form.deposit.trim()" class="text-[10px] text-red-500 font-medium mt-1">Deposit amount is required</p>
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Payment Method</label>
                  <select 
                    v-model="form.paymentMethod"
                    class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-[#165A31] transition-colors cursor-pointer"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash at Counter</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Card">Card</option>
                  </select>
                </div>
              </div>

              <!-- Conditional Transaction ID for Bank Transfer -->
              <div v-if="form.paymentMethod === 'Bank Transfer'" class="space-y-1 p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
                <label class="block text-[11px] font-semibold text-gray-700">Bank Transaction ID / Ref *</label>
                <input 
                  v-model="form.transactionId"
                  type="text" 
                  placeholder="e.g. TXN-CUSTOM-8812"
                  class="w-full px-3.5 py-1.5 bg-white border rounded-lg text-xs font-mono text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                  :class="showValidation && !form.transactionId?.trim() ? 'border-red-300 bg-red-50/20' : 'border-gray-200'"
                />
                <p v-if="showValidation && !form.transactionId?.trim()" class="text-[10px] text-red-500 font-medium">Transaction ID is required for bank transfer</p>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Status</label>
                  <select 
                    v-model="form.status"
                    class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-[#165A31] transition-colors cursor-pointer"
                  >
                    <option value="Sourcing">Sourcing</option>
                    <option value="Procurement">Procurement</option>
                    <option value="In Assembly">In Assembly</option>
                    <option value="Arrived">Arrived</option>
                    <option value="Ready">Ready</option>
                  </select>
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Reservation Rule</label>
                  <input 
                    v-model="form.reservation"
                    type="text" 
                    placeholder="e.g. On arrival"
                    class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Notes & Special Requirements</label>
                <textarea 
                  v-model="form.notes"
                  rows="2"
                  placeholder="Customer notes or special specs..."
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
              {{ isEditMode ? 'Update Custom Order' : 'Create Custom Order' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
