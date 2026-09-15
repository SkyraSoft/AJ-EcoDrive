<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '@/store'
import { X } from 'lucide-vue-next'

const router = useRouter()
const emit = defineEmits(['close', 'created'])

const form = ref({
  branch: 'Peshawar',
  category: 'Maintenance',
  amount: '42,000',
  date: 'Aug 28',
  vendor: 'City Workshop',
  paymentMethod: 'Bank',
  paymentStatus: 'Paid',
  receipt: 'repair_receipt_8821.pdf',
  description: 'Showroom gate repair.'
})

const policy = ref({
  branchLimit: 'PKR 100K',
  currentExpense: 'PKR 42K',
  approval: 'Within manager policy'
})

const close = () => {
  emit('close')
  if (router.currentRoute.value.path.includes('/create')) {
    router.back()
  }
}

const submitForm = () => {
  const newId = `EXP-${Math.floor(8800 + Math.random() * 100)}`
  const numAmount = form.value.amount.replace(/[^0-9]/g, '')
  const displayAmount = numAmount ? (parseInt(numAmount) >= 1000 ? `${(parseInt(numAmount) / 1000).toFixed(0)}K` : numAmount) : form.value.amount

  const newExpense = {
    id: newId,
    branch: form.value.branch,
    category: form.value.category,
    vendor: form.value.vendor,
    amount: form.value.amount.includes('PKR') ? form.value.amount : `PKR ${displayAmount}`,
    rawAmount: form.value.amount,
    date: form.value.date || 'Aug 28',
    approval: form.value.paymentStatus === 'Paid' ? 'Approved' : 'Pending',
    approvalClass: form.value.paymentStatus === 'Paid' ? 'bg-[#eefcf2] text-[#165A31]' : 'bg-[#fff7ed] text-[#ea580c]',
    payment: form.value.paymentStatus,
    paymentClass: form.value.paymentStatus === 'Paid' ? 'text-[#165A31] font-bold' : 'text-gray-900 font-medium',
    branchLimit: policy.value.branchLimit,
    decision: policy.value.approval,
    paymentMethod: form.value.paymentMethod,
    description: form.value.description,
    receiptFile: form.value.receipt || 'receipt.pdf',
    receiptType: 'Receipt'
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
          <div>
            <div class="text-[10px] text-gray-500 mb-1">
              Super Admin / Finance / Expenses / <span class="font-bold text-gray-800">Create Expense</span>
            </div>
            <h1 class="text-[28px] sm:text-[32px] tracking-tight font-bold text-gray-900">Create Expense</h1>
            <p class="text-xs sm:text-sm text-gray-500 mt-1">Record an operating expense with branch, category, payment and evidence.</p>
          </div>

          <!-- Form Grid (4 Cards matching Screenshot) -->
          <form @submit.prevent="submitForm" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <!-- 1. Expense Card -->
              <div class="bg-white p-5 sm:p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
                <h3 class="text-[13px] font-bold text-gray-900">Expense</h3>
                
                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Branch</label>
                  <select 
                    v-model="form.branch" 
                    class="w-full px-3 py-2 text-[12px] text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white"
                  >
                    <option value="Peshawar">Peshawar</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Category</label>
                  <select 
                    v-model="form.category" 
                    class="w-full px-3 py-2 text-[12px] text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white"
                  >
                    <option value="Maintenance">Maintenance</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Office Supplies">Office Supplies</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                  </select>
                </div>

                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Amount</label>
                  <input 
                    v-model="form.amount" 
                    type="text" 
                    placeholder="Enter amount (e.g. 42,000)" 
                    required
                    class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" 
                  />
                </div>

                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Date</label>
                  <input 
                    v-model="form.date" 
                    type="text" 
                    placeholder="e.g. Aug 28" 
                    required
                    class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" 
                  />
                </div>
              </div>

              <!-- 2. Vendor & Payment Card -->
              <div class="bg-white p-5 sm:p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
                <h3 class="text-[13px] font-bold text-gray-900">Vendor & Payment</h3>
                
                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Vendor</label>
                  <input 
                    v-model="form.vendor" 
                    type="text" 
                    placeholder="Enter vendor name..." 
                    required
                    class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" 
                  />
                </div>

                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Payment Method</label>
                  <select 
                    v-model="form.paymentMethod" 
                    class="w-full px-3 py-2 text-[12px] text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white"
                  >
                    <option value="Bank">Bank</option>
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Online Transfer">Online Transfer</option>
                  </select>
                </div>

                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Payment Status</label>
                  <select 
                    v-model="form.paymentStatus" 
                    class="w-full px-3 py-2 text-[12px] text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                    <option value="Partial">Partial</option>
                  </select>
                </div>
              </div>

              <!-- 3. Evidence Card -->
              <div class="bg-white p-5 sm:p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
                <h3 class="text-[13px] font-bold text-gray-900">Evidence</h3>
                
                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Receipt</label>
                  <input 
                    v-model="form.receipt" 
                    type="text" 
                    placeholder="Attach or enter receipt filename..." 
                    class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" 
                  />
                </div>

                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Description</label>
                  <textarea 
                    v-model="form.description" 
                    rows="3" 
                    placeholder="Showroom gate repair." 
                    class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] resize-none"
                  ></textarea>
                </div>
              </div>

              <!-- 4. Policy Card -->
              <div class="bg-white p-5 sm:p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4 flex flex-col justify-between">
                <div>
                  <h3 class="text-[13px] font-bold text-gray-900 mb-4">Policy</h3>
                  
                  <div class="space-y-3">
                    <div class="flex items-center justify-between py-1 border-b border-gray-50">
                      <span class="text-[11px] font-medium text-gray-600">Branch Limit</span>
                      <span class="text-[12px] font-bold text-gray-900">{{ policy.branchLimit }}</span>
                    </div>

                    <div class="flex items-center justify-between py-1 border-b border-gray-50">
                      <span class="text-[11px] font-medium text-gray-600">Current Expense</span>
                      <span class="text-[12px] font-bold text-gray-900">{{ policy.currentExpense }}</span>
                    </div>

                    <div class="flex items-center justify-between py-1">
                      <span class="text-[11px] font-medium text-gray-600">Approval</span>
                      <span class="text-[12px] font-semibold text-[#165A31] bg-[#eefcf2] px-2 py-0.5 rounded">
                        {{ policy.approval }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="p-3 bg-gray-50 rounded-lg border border-gray-100 text-[10px] text-gray-500">
                  Expenses within standard branch limits are automatically validated for policy compliance.
                </div>
              </div>

            </div>

            <!-- Actions Bar -->
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
                Record Expense
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  </div>
</template>
