<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../../store.js'
import { X, Check, ShieldCheck, CreditCard, AlertCircle } from 'lucide-vue-next'

const props = defineProps({
  isModal: {
    type: Boolean,
    default: true
  },
  payment: {
    type: Object,
    default: null
  },
  customer: {
    type: [Object, String],
    default: null
  },
  order: {
    type: [Object, String],
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

const availableInvoices = computed(() => store.invoices.filter(i => i.status !== 'Cancelled'))

const bankAccounts = [
  'Meezan Bank - Main Dealership Operations (PK02MEZN0012345678901234)',
  'Bank Alfalah - Commercial Collections (PK34ALFH0098765432109876)',
  'Habib Bank Limited (HBL) - Escrow / Fleet Clearing',
  'Showroom Cash Drawer (Vault Petty Cash)'
]

const form = ref({
  id: '',
  payment: '',
  invoice_id: '',
  customer_id: '',
  customer: '',
  order: '',
  method: 'Bank Transfer',
  amount: '',
  transactionRef: '',
  date: 'Today',
  bankAccount: bankAccounts[0],
  notes: '',
  status: 'Reconciled',
  branch: user.value?.branchName || 'Peshawar'
})

const selectedInvoice = computed(() => {
  if (!form.value.invoice_id) return null
  return store.getInvoiceById(form.value.invoice_id)
})

const onInvoiceChange = () => {
  if (selectedInvoice.value) {
    const inv = selectedInvoice.value
    form.value.customer = inv.customer || ''
    form.value.customer_id = inv.customer_id || ''
    form.value.order = inv.order_id || inv.order || ''
    const outBal = inv.outstandingAmount !== undefined ? inv.outstandingAmount : (
      (typeof inv.total === 'number' ? inv.total : parseFloat(String(inv.amount || '0').replace(/[^0-9.]/g, ''))) - (inv.paidAmount || 0)
    )
    form.value.amount = `PKR ${outBal.toLocaleString()}`
    form.value.branch = inv.branch || form.value.branch
    form.value.notes = `Settlement for Invoice ${inv.id} (${inv.customer})`
  }
}

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
    id: data.id || data.payment || form.value.id,
    payment: data.payment || data.id || form.value.payment,
    invoice_id: data.invoice_id || form.value.invoice_id,
    customer_id: data.customer_id || form.value.customer_id,
    customer: data.customer || form.value.customer,
    order: data.order || form.value.order,
    method: data.method || form.value.method,
    amount: data.amount || form.value.amount,
    transactionRef: data.ref || data.transactionRef || form.value.transactionRef,
    date: data.date || form.value.date,
    bankAccount: data.bankAccount || form.value.bankAccount,
    notes: data.notes || form.value.notes,
    status: data.status || form.value.status,
    branch: data.branch || form.value.branch
  }
}

onMounted(() => {
  if (props.payment) {
    loadData(props.payment)
  } else if (store.originalEditPayment) {
    loadData(store.originalEditPayment)
  }
})

watch(() => props.payment, (newVal) => {
  if (newVal) loadData(newVal)
}, { immediate: true })

const close = () => {
  store.originalEditPayment = null
  emit('close')
  if (router.currentRoute.value.path.includes('/create')) {
    router.push('/sales/payments')
  }
}

const savePayment = () => {
  errorMessage.value = ''
  showValidation.value = true

  if (!form.value.customer.trim()) {
    errorMessage.value = 'Customer name is required.'
    return
  }

  if (!form.value.order.trim()) {
    errorMessage.value = 'Linked Order or Invoice reference is required.'
    return
  }

  if (!form.value.amount.trim()) {
    errorMessage.value = 'Payment amount is required.'
    return
  }

  if (form.value.method === 'Bank Transfer' && !form.value.transactionRef.trim()) {
    errorMessage.value = 'Bank Transaction Reference / Deposit Slip No. is required.'
    return
  }

  const rawAmt = parseInt(String(form.value.amount).replace(/[^0-9]/g, '') || '0', 10)
  if (rawAmt <= 0) {
    errorMessage.value = 'Payment amount must be greater than zero.'
    return
  }

  if (isEditMode.value) {
    const payload = {
      id: form.value.payment || form.value.id,
      payment: form.value.payment || form.value.id,
      customer: form.value.customer,
      order: form.value.order,
      method: form.value.method,
      amount: form.value.amount,
      rawAmount: rawAmt,
      ref: form.value.transactionRef,
      transactionRef: form.value.transactionRef,
      date: form.value.date || 'Today',
      bankAccount: form.value.bankAccount,
      notes: form.value.notes,
      status: form.value.status || 'Reconciled',
      branch: form.value.branch || user.value?.branchName || 'Peshawar'
    }
    store.updatePayment(payload)
    emit('updated', payload)
    close()
    return
  }

  // New Payment flow
  if (form.value.invoice_id) {
    try {
      const res = store.recordInvoicePayment({
        invoiceId: form.value.invoice_id,
        amount: rawAmt,
        method: form.value.method,
        transactionRef: form.value.transactionRef || `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        bankAccount: form.value.bankAccount,
        date: form.value.date || 'Today',
        notes: form.value.notes
      })
      emit('created', res.payment)
      close()
    } catch (err) {
      errorMessage.value = err.message || 'Error recording payment.'
    }
  } else {
    const payId = form.value.payment || `PAY-${Math.floor(7800 + Math.random() * 100)}`
    const payload = {
      id: payId,
      payment: payId,
      payment_id: payId,
      paymentNo: payId,
      customer: form.value.customer,
      customer_id: form.value.customer_id || 'CUST-101',
      order: form.value.order,
      order_id: form.value.order,
      method: form.value.method,
      amount: `PKR ${rawAmt.toLocaleString()}`,
      rawAmount: rawAmt,
      ref: form.value.transactionRef || `TXN-${payId}`,
      transactionRef: form.value.transactionRef || `TXN-${payId}`,
      date: form.value.date || 'Today',
      bankAccount: form.value.bankAccount,
      notes: form.value.notes,
      status: form.value.status || 'Reconciled',
      branch: form.value.branch || user.value?.branchName || 'Peshawar'
    }
    store.addPayment(payload)
    emit('created', payload)
    close()
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
              <span v-if="isBranchUser">Branch Manager / Payments / <span class="font-bold text-gray-700 dark:text-gray-300">{{ isEditMode ? 'Edit Payment' : 'Record Payment' }}</span></span>
              <span v-else>Super Admin / Sales / Payments / <span class="font-bold text-gray-700 dark:text-gray-300">{{ isEditMode ? 'Edit Payment' : 'Record Payment' }}</span></span>
            </div>
            <h1 class="text-[28px] sm:text-[32px] tracking-tight font-bold text-gray-900 dark:text-white">{{ isEditMode ? 'Edit Payment' : 'Record Customer Collection' }}</h1>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Record verified customer payments with double-entry ledger allocation and bank deposit tracking.</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80">
              Receiving Branch: {{ form.branch }}
            </span>
          </div>
        </div>

        <!-- Anti-Fraud & Reconciliation Policy Banner -->
        <div class="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl flex items-start gap-3">
          <ShieldCheck class="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div class="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
            <span class="font-bold">Dealership Cash Rule:</span>
            Every receipt must link directly to an existing <strong>Sales Invoice</strong> or approved <strong>Sales Order</strong>. Cash collections will update the branch drawer register, while bank transfers update the dealership company ledger upon clearance.
          </div>
        </div>

        <!-- Error Banner -->
        <div v-if="errorMessage" class="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl text-xs font-semibold text-red-700 dark:text-red-300 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <AlertCircle class="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
            <span>{{ errorMessage }}</span>
          </div>
          <button @click="errorMessage = ''" type="button" class="text-red-500 hover:text-red-700 ml-3">✕</button>
        </div>

        <!-- 2 Column Form Grid -->
        <form @submit.prevent="savePayment" class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Left Card: Payment Details -->
            <div class="bg-gray-50/50 dark:bg-[#1e293b]/50 border border-gray-100 dark:border-gray-800 rounded-xl p-6 space-y-4">
              <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <CreditCard class="w-4 h-4 text-[#165A31]" />
                Collection Details
              </h3>
              
              <div v-if="!isEditMode">
                <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Select Invoice to Settle</label>
                <select 
                  v-model="form.invoice_id"
                  @change="onInvoiceChange"
                  class="w-full px-3.5 py-2 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:border-[#165A31] transition-colors cursor-pointer"
                >
                  <option value="">-- Direct Payment / Manual Order Reference --</option>
                  <option 
                    v-for="inv in availableInvoices" 
                    :key="inv.id" 
                    :value="inv.id"
                  >
                    {{ inv.id }} • {{ inv.customer }} (Bal: PKR {{ ((inv.outstandingAmount !== undefined ? inv.outstandingAmount : (inv.total - (inv.paidAmount || 0)))).toLocaleString() }})
                  </option>
                </select>
                <p v-if="selectedInvoice" class="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium mt-1">
                  Total: PKR {{ ((selectedInvoice.total !== undefined ? selectedInvoice.total : (selectedInvoice.outstandingAmount || 0))).toLocaleString() }} | 
                  Paid: PKR {{ (selectedInvoice.paidAmount || 0).toLocaleString() }} | 
                  Outstanding: PKR {{ ((selectedInvoice.outstandingAmount !== undefined ? selectedInvoice.outstandingAmount : (selectedInvoice.total - (selectedInvoice.paidAmount || 0)))).toLocaleString() }}
                </p>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Customer Name *</label>
                <input 
                  v-model="form.customer"
                  type="text" 
                  placeholder="e.g. Ahsan Khan"
                  class="w-full px-3.5 py-2 bg-white dark:bg-[#0f172a] border rounded-lg text-xs text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                  :class="showValidation && !form.customer.trim() ? 'border-red-300 bg-red-50/20 dark:border-red-500/50' : 'border-gray-200 dark:border-gray-700'"
                />
                <p v-if="showValidation && !form.customer.trim()" class="text-[10px] text-red-500 font-medium mt-1">Customer name is required</p>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Linked Order / Invoice Reference *</label>
                <input 
                  v-model="form.order"
                  type="text" 
                  placeholder="e.g. SO-9723 / INV-0492"
                  class="w-full px-3.5 py-2 bg-white dark:bg-[#0f172a] border rounded-lg text-xs text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors font-mono"
                  :class="showValidation && !form.order.trim() ? 'border-red-300 bg-red-50/20 dark:border-red-500/50' : 'border-gray-200 dark:border-gray-700'"
                />
                <p v-if="showValidation && !form.order.trim()" class="text-[10px] text-red-500 font-medium mt-1">Linked order reference is required</p>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Payment Method</label>
                <select 
                  v-model="form.method"
                  class="w-full px-3.5 py-2 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:border-[#165A31] transition-colors cursor-pointer"
                >
                  <option value="Bank Transfer">Bank Transfer / Online Portal</option>
                  <option value="Cash">Cash at Counter (Physical)</option>
                  <option value="Cheque">Company / Bank Cheque</option>
                  <option value="Card / POS">Card / POS Terminal</option>
                </select>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Amount Collected (PKR) *</label>
                <input 
                  :value="form.amount"
                  @input="onAmountInput"
                  type="text" 
                  placeholder="e.g. PKR 280,000"
                  class="w-full px-3.5 py-2 bg-white dark:bg-[#0f172a] border rounded-lg text-xs font-bold text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                  :class="showValidation && !form.amount.trim() ? 'border-red-300 bg-red-50/20 dark:border-red-500/50' : 'border-gray-200 dark:border-gray-700'"
                />
                <p v-if="showValidation && !form.amount.trim()" class="text-[10px] text-red-500 font-medium mt-1">Amount is required</p>
              </div>
            </div>

            <!-- Right Card: Allocation & Verification -->
            <div class="bg-gray-50/50 dark:bg-[#1e293b]/50 border border-gray-100 dark:border-gray-800 rounded-xl p-6 space-y-4">
              <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-2">Verification & Reconciliation</h3>
              
              <div>
                <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Bank Transaction Reference / Slip Number
                  <span v-if="form.method === 'Bank Transfer'" class="text-red-500 font-bold">* (Mandatory for Bank Transfer)</span>
                </label>
                <input 
                  v-model="form.transactionRef"
                  type="text" 
                  placeholder="e.g. TXN-2241-BANK-01"
                  class="w-full px-3.5 py-2 bg-white dark:bg-[#0f172a] border rounded-lg text-xs text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors font-mono"
                  :class="showValidation && form.method === 'Bank Transfer' && !form.transactionRef.trim() ? 'border-red-300 bg-red-50/20 dark:border-red-500/50' : 'border-gray-200 dark:border-gray-700'"
                />
                <p v-if="showValidation && form.method === 'Bank Transfer' && !form.transactionRef.trim()" class="text-[10px] text-red-500 font-medium mt-1">Transaction reference is required for bank transfer</p>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Deposit Bank Account / Vault</label>
                <select 
                  v-model="form.bankAccount"
                  class="w-full px-3.5 py-2 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:border-[#165A31] transition-colors cursor-pointer"
                >
                  <option v-for="acct in bankAccounts" :key="acct" :value="acct">{{ acct }}</option>
                </select>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Payment Date</label>
                <input 
                  v-model="form.date" 
                  type="text" 
                  placeholder="e.g. Today" 
                  class="w-full px-3.5 py-2 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors" 
                />
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Collector & Reconciliation Remarks</label>
                <textarea 
                  v-model="form.notes" 
                  rows="3" 
                  placeholder="Counter teller notes, customer CNIC match, or installment remarks..." 
                  class="w-full px-3.5 py-2 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors resize-none"
                ></textarea>
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
              {{ isEditMode ? 'Update Payment Record' : 'Confirm & Record Payment' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
