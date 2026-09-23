<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '@/store'
import { X, Check } from 'lucide-vue-next'

const props = defineProps({
  isModal: {
    type: Boolean,
    default: true
  },
  expense: {
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
  id: '',
  category: 'Utilities',
  amount: 'PKR 48,500',
  date: '27 Aug 2026',
  vendor: 'PESCO',
  paymentMethod: 'Bank Transfer',
  transactionId: '',
  description: 'Branch electricity bill',
  receipt: 'pescobill_aug.pdf',
  notes: 'Submit for approval',
  branch: user.value?.branchName || 'Peshawar'
})

const loadData = (data) => {
  if (!data) return
  isEditMode.value = true
  form.value = {
    ...form.value,
    id: data.id || form.value.id,
    category: data.category || form.value.category,
    amount: data.amount || form.value.amount,
    date: data.fullDate || data.date || form.value.date,
    vendor: data.vendor || form.value.vendor,
    paymentMethod: data.paymentMethod || form.value.paymentMethod,
    description: data.description || form.value.description,
    receipt: data.receiptFile || data.receipt || form.value.receipt,
    notes: data.notes || form.value.notes,
    branch: data.branch || form.value.branch
  }
}

onMounted(() => {
  if (props.expense) {
    loadData(props.expense)
  } else if (store.originalEditExpense) {
    loadData(store.originalEditExpense)
  }
})

watch(() => props.expense, (newVal) => {
  if (newVal) loadData(newVal)
}, { immediate: true })

const close = () => {
  store.originalEditExpense = null
  emit('close')
  if (router.currentRoute.value.path.includes('/create')) {
    router.push('/finance/expenses')
  }
}

const submitForm = () => {
  if (!form.value.category.trim() || !form.value.amount.trim() || !form.value.vendor.trim()) {
    showValidation.value = true
    return
  }

  if (form.value.paymentMethod === 'Bank Transfer' && !form.value.transactionId?.trim()) {
    showValidation.value = true
    return
  }

  if (isEditMode.value) {
    const updatedExpense = {
      ...form.value,
      rawAmount: form.value.amount.replace(/[^0-9]/g, '') || '48,500',
      date: form.value.date.split(' ').slice(0, 2).join(' ') || form.value.date,
      fullDate: form.value.date,
      receiptFile: form.value.receipt || 'receipt.pdf'
    }
    const idx = store.expenses.findIndex(e => e.id === form.value.id)
    if (idx !== -1) {
      store.expenses[idx] = { ...store.expenses[idx], ...updatedExpense }
    }
    emit('updated', updatedExpense)
    close()
    return
  }

  const newId = `EXP-${Math.floor(400 + Math.random() * 50)}`
  const newExpense = {
    id: newId,
    branch: form.value.branch,
    category: form.value.category,
    vendor: form.value.vendor,
    amount: form.value.amount,
    rawAmount: form.value.amount.replace(/[^0-9]/g, '') || '48,500',
    date: form.value.date.split(' ').slice(0, 2).join(' ') || '27 Aug',
    fullDate: form.value.date,
    approval: 'Pending',
    approvalClass: 'bg-[#fef3c7] text-[#92400e]',
    payment: 'Unpaid',
    paymentClass: 'text-gray-900 font-medium',
    branchLimit: 'PKR 100K',
    decision: 'Awaiting management',
    paymentMethod: form.value.paymentMethod,
    description: form.value.description,
    receiptFile: form.value.receipt || 'pescobill_aug.pdf',
    receiptType: 'PDF Document',
    submittedBy: 'Branch Manager',
    lastUpdate: 'Just now',
    notes: form.value.notes
  }

  store.addExpense(newExpense)
  emit('created', newExpense)
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
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">
      <!-- Scrollable Body -->
      <div class="flex-1 overflow-y-auto p-6 sm:p-8">
        <div class="space-y-6">
          <!-- Header -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            <div>
              <div class="text-[11px] text-gray-400 mb-1">
                Branch Manager / Expenses / <span class="font-medium text-gray-600">{{ isEditMode ? 'Edit Expense' : 'Create Expense' }}</span>
              </div>
              <h1 class="text-[32px] tracking-tight font-bold text-gray-900">{{ isEditMode ? 'Edit Expense' : 'Create Expense' }}</h1>
              <p class="text-xs text-gray-500 mt-1">Submit or update a branch expense with category, payment details and evidence.</p>
            </div>
          </div>

          <!-- Form Grid (2 Columns) -->
          <form @submit.prevent="submitForm" class="space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              
              <!-- Left Card: Expense Details -->
              <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
                <h3 class="text-sm font-bold text-gray-900 mb-4">Expense Details</h3>
                
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Category *</label>
                  <input 
                    v-model="form.category" 
                    type="text" 
                    placeholder="e.g. Utilities" 
                    class="w-full px-3.5 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 transition-colors bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
                    :class="showValidation && !form.category.trim() ? 'border-red-300 bg-red-50/20 focus:ring-red-400 focus:border-red-400' : 'border-gray-200 focus:ring-[#165A31] focus:border-[#165A31]'"
                  />
                  <p v-if="showValidation && !form.category.trim()" class="text-[10px] text-red-500 font-medium mt-1">Category is required</p>
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Amount *</label>
                  <input 
                    v-model="form.amount" 
                    type="text" 
                    placeholder="e.g. PKR 48,500" 
                    class="w-full px-3.5 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 transition-colors bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
                    :class="showValidation && !form.amount.trim() ? 'border-red-300 bg-red-50/20 focus:ring-red-400 focus:border-red-400' : 'border-gray-200 focus:ring-[#165A31] focus:border-[#165A31]'"
                  />
                  <p v-if="showValidation && !form.amount.trim()" class="text-[10px] text-red-500 font-medium mt-1">Amount is required</p>
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Date</label>
                  <input 
                    v-model="form.date" 
                    type="text" 
                    placeholder="e.g. 27 Aug 2026" 
                    class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)]" 
                  />
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Vendor / Recipient *</label>
                  <input 
                    v-model="form.vendor" 
                    type="text" 
                    placeholder="e.g. PESCO" 
                    class="w-full px-3.5 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 transition-colors bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
                    :class="showValidation && !form.vendor.trim() ? 'border-red-300 bg-red-50/20 focus:ring-red-400 focus:border-red-400' : 'border-gray-200 focus:ring-[#165A31] focus:border-[#165A31]'"
                  />
                  <p v-if="showValidation && !form.vendor.trim()" class="text-[10px] text-red-500 font-medium mt-1">Vendor is required</p>
                </div>
              </div>

              <!-- Right Card: Payment & Evidence -->
              <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
                <h3 class="text-sm font-bold text-gray-900 mb-4">Payment & Evidence</h3>
                
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Payment Method *</label>
                  <select 
                    v-model="form.paymentMethod" 
                    class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)] cursor-pointer"
                  >
                    <option value="Bank Transfer">Bank Transfer / Online</option>
                    <option value="Petty Cash">Petty Cash</option>
                    <option value="Company Cheque">Company Cheque</option>
                    <option value="Corporate Card">Corporate Card</option>
                  </select>
                </div>

                <div v-if="form.paymentMethod === 'Bank Transfer'" class="space-y-1 p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
                  <label class="block text-[11px] font-semibold text-gray-700">Bank Transaction ID / Ref *</label>
                  <input 
                    v-model="form.transactionId" 
                    type="text" 
                    placeholder="e.g. TXN-EXP-5591" 
                    class="w-full px-3.5 py-1.5 text-xs font-mono border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white"
                    :class="showValidation && !form.transactionId?.trim() ? 'border-red-300 bg-red-50/20' : 'border-gray-200'"
                  />
                  <p v-if="showValidation && !form.transactionId?.trim()" class="text-[10px] text-red-500 font-medium">Transaction ID is required for bank transfer</p>
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Description</label>
                  <input 
                    v-model="form.description" 
                    type="text" 
                    placeholder="e.g. Branch electricity bill" 
                    class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)]" 
                  />
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Receipt / Invoice</label>
                  <input 
                    v-model="form.receipt" 
                    type="text" 
                    placeholder="e.g. pescobill_aug.pdf" 
                    class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)]" 
                  />
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Notes</label>
                  <textarea 
                    v-model="form.notes" 
                    rows="3"
                    placeholder="e.g. Submit for approval" 
                    class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)] resize-none" 
                  ></textarea>
                </div>
              </div>

            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button 
                type="button"
                @click="close" 
                class="px-5 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="px-5 py-2 text-[11px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05)] cursor-pointer"
              >
                {{ isEditMode ? 'Update Expense' : 'Submit Expense' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
