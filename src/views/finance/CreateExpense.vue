<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '@/store'
import { X, Check, AlertCircle, ShieldCheck, FileText, Upload } from 'lucide-vue-next'

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

const categories = [
  'Utilities (Electricity / Water / Internet)',
  'Facility & Maintenance',
  'Staff Welfare & Refreshments',
  'Local Logistics & Courier',
  'Showroom Marketing & Banners',
  'Office Stationery & Supplies',
  'Security & Municipal Fees',
  'Workshop Consumables & Cleaning',
  'Other Operating Expense'
]

const form = ref({
  id: '',
  category: 'Utilities (Electricity / Water / Internet)',
  amount: 'PKR 48,500',
  date: '27 Aug 2026',
  vendor: 'PESCO',
  paymentMethod: 'Bank Transfer',
  transactionId: 'TXN-PESCO-9812',
  description: 'Showroom 3-phase electricity consumption bill',
  receipt: 'pescobill_aug.pdf',
  notes: 'Submit for Super Admin / CFO approval',
  branch: user.value?.branchName || 'Peshawar'
})

// Clean numeric amount parsing
const parsedAmount = computed(() => {
  if (!form.value.amount) return 0
  const clean = String(form.value.amount).replace(/[^0-9]/g, '')
  return clean ? parseInt(clean, 10) : 0
})

// Dealership governance policy: PKR 15,000 threshold
const requiresHOApproval = computed(() => {
  return parsedAmount.value > 15000
})

const onAmountInput = (e) => {
  const val = e.target.value.replace(/[^0-9]/g, '')
  if (val) {
    const num = parseInt(val, 10)
    form.value.amount = `PKR ${num.toLocaleString()}`
  } else {
    form.value.amount = ''
  }
}

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

  const rawAmount = parsedAmount.value || 48500

  if (isEditMode.value) {
    const updatedExpense = {
      ...form.value,
      rawAmount: rawAmount,
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
    rawAmount: rawAmount,
    date: form.value.date.split(' ').slice(0, 2).join(' ') || '27 Aug',
    fullDate: form.value.date,
    approval: requiresHOApproval.value ? 'Pending' : 'Approved',
    approvalClass: requiresHOApproval.value ? 'bg-[#fef3c7] text-[#92400e]' : 'bg-[#dcfce7] text-[#165A31]',
    payment: 'Unpaid',
    paymentClass: 'text-gray-900 dark:text-gray-100 font-medium',
    branchLimit: 'PKR 15,000',
    decision: requiresHOApproval.value ? 'Awaiting Action Centre Approval' : 'Auto-Cleared Petty Cash',
    paymentMethod: form.value.paymentMethod,
    description: form.value.description,
    receiptFile: form.value.receipt || 'receipt_attached.pdf',
    receiptType: 'PDF Document',
    submittedBy: isBranchUser.value ? 'Branch Manager' : 'Super Admin',
    lastUpdate: 'Just now',
    notes: form.value.notes
  }

  store.addExpense(newExpense)
  emit('created', newExpense)
  close()
}
</script>

<template>
  <div class="fixed inset-0 bg-gray-900/60 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm" @click.self="close">
    <!-- Close button on top-right of screen overlay -->
    <button @click="close" class="fixed top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full z-[110] shadow-lg transition-colors cursor-pointer">
      <X class="w-5 h-5" />
    </button>

    <!-- Modal Card -->
    <div class="bg-white dark:bg-[#161d2b] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">
      <!-- Scrollable Body -->
      <div class="flex-1 overflow-y-auto p-6 sm:p-8">
        <div class="space-y-6">
          <!-- Header -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div>
              <div class="text-[11px] text-gray-400 dark:text-gray-500 mb-1">
                {{ isBranchUser ? 'Branch Manager' : 'Super Admin' }} / Expenses / <span class="font-medium text-gray-600 dark:text-gray-300">{{ isEditMode ? 'Edit Expense' : 'Create Expense' }}</span>
              </div>
              <h1 class="text-[28px] sm:text-[32px] tracking-tight font-bold text-gray-900 dark:text-white">{{ isEditMode ? 'Edit Expense' : 'Create Expense' }}</h1>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Submit or update a showroom expense with receipt evidence and clear disbursement routing.</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80">
                Branch: {{ form.branch }}
              </span>
            </div>
          </div>

          <!-- Policy Governance Notice -->
          <div 
            class="p-4 rounded-xl border transition-all flex items-start gap-3"
            :class="requiresHOApproval 
              ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200' 
              : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'"
          >
            <AlertCircle v-if="requiresHOApproval" class="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <ShieldCheck v-else class="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
            <div class="text-xs leading-relaxed">
              <span class="font-bold block mb-0.5">
                {{ requiresHOApproval ? 'Head Office Approval Triggered (> PKR 15,000)' : 'Branch Petty Cash Auto-Clearance (≤ PKR 15,000)' }}
              </span>
              <p v-if="requiresHOApproval" class="text-amber-800 dark:text-amber-300/90">
                This expense (<strong>{{ form.amount || 'PKR 0' }}</strong>) exceeds the branch discretionary limit of PKR 15,000. It will automatically submit into the <strong>Head Office Action Centre</strong> for CFO or Super Admin approval before cash can be disbursed.
              </p>
              <p v-else class="text-emerald-800 dark:text-emerald-300/90">
                This expense (<strong>{{ form.amount || 'PKR 0' }}</strong>) is within your showroom discretionary threshold. It will be logged to the branch petty cash ledger immediately upon submission.
              </p>
            </div>
          </div>

          <!-- Form Grid (2 Columns) -->
          <form @submit.prevent="submitForm" class="space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              
              <!-- Left Card: Expense Details -->
              <div class="bg-gray-50/50 dark:bg-[#1e293b]/50 p-6 rounded-xl border border-gray-100 dark:border-gray-800 space-y-4">
                <h3 class="text-sm font-bold text-gray-900 dark:text-white flex items-center justify-between">
                  <span>Expense Details</span>
                  <span class="text-[10px] text-gray-400 dark:text-gray-500 font-normal">Showroom Outflow</span>
                </h3>
                
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Category *</label>
                  <select 
                    v-model="form.category"
                    class="w-full px-3.5 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 transition-colors bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 focus:ring-[#165A31] focus:border-[#165A31] cursor-pointer"
                  >
                    <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                  </select>
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Amount (PKR) * 
                    <span class="text-gray-400 dark:text-gray-500 font-normal text-[10px]">(Type numbers only)</span>
                  </label>
                  <div class="relative">
                    <input 
                      :value="form.amount" 
                      @input="onAmountInput"
                      type="text" 
                      placeholder="e.g. PKR 48,500" 
                      class="w-full px-3.5 py-2 text-xs font-bold border rounded-lg focus:outline-none focus:ring-1 transition-colors bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white"
                      :class="showValidation && !form.amount.trim() ? 'border-red-300 bg-red-50/20 dark:border-red-500/50 focus:ring-red-400' : 'border-gray-200 dark:border-gray-700 focus:ring-[#165A31] focus:border-[#165A31]'"
                    />
                  </div>
                  <p v-if="showValidation && !form.amount.trim()" class="text-[10px] text-red-500 font-medium mt-1">Amount is required</p>
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Date of Expense</label>
                  <input 
                    v-model="form.date" 
                    type="text" 
                    placeholder="e.g. 27 Aug 2026" 
                    class="w-full px-3.5 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white" 
                  />
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Vendor / Payee Name *</label>
                  <input 
                    v-model="form.vendor" 
                    type="text" 
                    placeholder="e.g. PESCO Electric / Shell Petrol / City Landlord" 
                    class="w-full px-3.5 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 transition-colors bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white"
                    :class="showValidation && !form.vendor.trim() ? 'border-red-300 bg-red-50/20 dark:border-red-500/50 focus:ring-red-400' : 'border-gray-200 dark:border-gray-700 focus:ring-[#165A31] focus:border-[#165A31]'"
                  />
                  <p v-if="showValidation && !form.vendor.trim()" class="text-[10px] text-red-500 font-medium mt-1">Vendor name is required</p>
                </div>
              </div>

              <!-- Right Card: Payment & Evidence -->
              <div class="bg-gray-50/50 dark:bg-[#1e293b]/50 p-6 rounded-xl border border-gray-100 dark:border-gray-800 space-y-4">
                <h3 class="text-sm font-bold text-gray-900 dark:text-white flex items-center justify-between">
                  <span>Payment & Evidence</span>
                  <span class="text-[10px] text-gray-400 dark:text-gray-500 font-normal">Audit Compliance</span>
                </h3>
                
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Payment Method *</label>
                  <select 
                    v-model="form.paymentMethod" 
                    class="w-full px-3.5 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white cursor-pointer"
                  >
                    <option value="Bank Transfer">Bank Transfer / Online Portal</option>
                    <option value="Petty Cash">Showroom Petty Cash</option>
                    <option value="Company Cheque">Company Cheque</option>
                    <option value="Corporate Card">Corporate Card</option>
                  </select>
                </div>

                <div v-if="form.paymentMethod === 'Bank Transfer'" class="space-y-1 p-3 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-lg border border-emerald-100 dark:border-emerald-800/60">
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-200">Bank Transaction ID / Ref *</label>
                  <input 
                    v-model="form.transactionId" 
                    type="text" 
                    placeholder="e.g. TXN-EXP-5591" 
                    class="w-full px-3.5 py-1.5 text-xs font-mono border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white"
                    :class="showValidation && !form.transactionId?.trim() ? 'border-red-300 bg-red-50/20' : 'border-gray-200 dark:border-gray-700'"
                  />
                  <p v-if="showValidation && !form.transactionId?.trim()" class="text-[10px] text-red-500 font-medium">Transaction ID is required for bank transfer</p>
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Description / Purpose</label>
                  <input 
                    v-model="form.description" 
                    type="text" 
                    placeholder="e.g. Branch electricity bill / Generator oil change" 
                    class="w-full px-3.5 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white" 
                  />
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Receipt / Invoice File Attachment</label>
                  <div class="flex items-center gap-2">
                    <input 
                      v-model="form.receipt" 
                      type="text" 
                      placeholder="e.g. pescobill_aug.pdf" 
                      class="flex-1 px-3.5 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white" 
                    />
                    <span class="inline-flex items-center gap-1 px-2.5 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs border border-gray-200 dark:border-gray-700">
                      <FileText class="w-3.5 h-3.5 text-gray-500" />
                      Attached
                    </span>
                  </div>
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Internal Audit Notes</label>
                  <textarea 
                    v-model="form.notes" 
                    rows="2"
                    placeholder="Specific remarks for the CFO or finance auditor..." 
                    class="w-full px-3.5 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white resize-none" 
                  ></textarea>
                </div>
              </div>

            </div>

            <!-- Action Buttons -->
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
                class="px-6 py-2.5 text-xs font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer flex items-center gap-2"
              >
                <Check class="w-4 h-4" />
                {{ isEditMode ? 'Update Expense' : (requiresHOApproval ? 'Submit for HO Approval' : 'Submit & Clear Petty Cash') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
