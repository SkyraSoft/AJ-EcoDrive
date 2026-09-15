<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '@/store'
import { ChevronDown, ArrowLeft, CheckCircle2, FileText } from 'lucide-vue-next'

const router = useRouter()

const showToast = ref(false)
const toastMessage = ref('')

const currentExpense = computed(() => {
  return store.selectedExpense || store.expenses[0] || {
    id: 'EXP-8831',
    branch: 'Islamabad',
    category: 'Logistics',
    vendor: 'Pak Logistics',
    amount: 'PKR 95K',
    date: 'Aug 27',
    approval: 'Pending',
    approvalClass: 'bg-[#fff7ed] text-[#ea580c]',
    payment: 'Unpaid',
    branchLimit: 'PKR 75K',
    decision: 'Super Admin approval required',
    receiptFile: 'logistics_invoice.pdf',
    receiptType: 'Receipt'
  }
})

const approveExpense = () => {
  if (currentExpense.value) {
    currentExpense.value.approval = 'Approved'
    currentExpense.value.approvalClass = 'bg-[#eefcf2] text-[#165A31]'
    currentExpense.value.payment = 'Paid'
    currentExpense.value.paymentClass = 'text-[#165A31] font-bold'
    currentExpense.value.decision = 'Approved by Super Admin'
    
    toastMessage.value = `Expense ${currentExpense.value.id} approved successfully!`
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
    }, 3000)
  }
}

const rejectExpense = () => {
  if (currentExpense.value) {
    currentExpense.value.approval = 'Rejected'
    currentExpense.value.approvalClass = 'bg-red-50 text-red-700'
    
    toastMessage.value = `Expense ${currentExpense.value.id} rejected.`
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
    }, 3000)
  }
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Toast Notification -->
    <div 
      v-if="showToast" 
      class="fixed bottom-5 right-5 z-[110] bg-[#165A31] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200"
    >
      <CheckCircle2 class="w-5 h-5 text-green-300" />
      <span class="text-xs font-bold">{{ toastMessage }}</span>
    </div>

    <!-- Header & Breadcrumb -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1 flex items-center gap-1.5">
          <button @click="router.push('/finance/expenses')" class="hover:text-gray-900 transition-colors flex items-center gap-1">
            <ArrowLeft class="w-3 h-3" /> Back
          </button>
          <span>/</span>
          <span>Super Admin</span>
          <span>/</span>
          <span>Finance</span>
          <span>/</span>
          <span>Expenses</span>
          <span>/</span>
          <span class="font-bold text-gray-800">Expense Detail</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Expense Detail</h1>
        <p class="text-sm text-gray-500 mt-1">Review expense details, approval, payment, attachments and history.</p>
      </div>
    </div>

    <!-- Expense Top Identity Card -->
    <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-gray-900">{{ currentExpense.id }}</h2>
        <div class="text-xs text-gray-500 font-medium mt-0.5">
          {{ currentExpense.branch }} · {{ currentExpense.category }} · {{ currentExpense.amount }}
        </div>
      </div>

      <div class="flex items-center gap-3">
        <span 
          class="px-2.5 py-1 text-[10px] font-bold rounded-md"
          :class="currentExpense.approvalClass || 'bg-[#fff7ed] text-[#ea580c]'"
        >
          {{ currentExpense.approval }}
        </span>

        <button class="px-3.5 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
          Review Expense
        </button>

        <button class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-1">
          More <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
        </button>
      </div>
    </div>

    <!-- 2 Column Details Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 1. Expense Details -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-[13px] font-bold text-gray-900">Expense Details</h3>
        
        <div class="space-y-3 pt-2">
          <div class="flex items-center justify-between text-xs py-1 border-b border-gray-50">
            <span class="text-gray-500 font-medium">Category</span>
            <span class="text-gray-900 font-bold">{{ currentExpense.category }}</span>
          </div>
          
          <div class="flex items-center justify-between text-xs py-1 border-b border-gray-50">
            <span class="text-gray-500 font-medium">Vendor</span>
            <span class="text-gray-900 font-bold">{{ currentExpense.vendor }}</span>
          </div>

          <div class="flex items-center justify-between text-xs py-1 border-b border-gray-50">
            <span class="text-gray-500 font-medium">Amount</span>
            <span class="text-gray-900 font-bold">{{ currentExpense.amount }}</span>
          </div>

          <div class="flex items-center justify-between text-xs py-1">
            <span class="text-gray-500 font-medium">Date</span>
            <span class="text-gray-900 font-bold">{{ currentExpense.date }}</span>
          </div>
        </div>
      </div>

      <!-- 2. Approval & Payment -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-[13px] font-bold text-gray-900">Approval & Payment</h3>
        
        <div class="space-y-3 pt-2">
          <div class="flex items-center justify-between text-xs py-1 border-b border-gray-50">
            <span class="text-gray-500 font-medium">Branch Limit</span>
            <span class="text-gray-900 font-bold">{{ currentExpense.branchLimit || 'PKR 75K' }}</span>
          </div>

          <div class="flex items-center justify-between text-xs py-1 border-b border-gray-50">
            <span class="text-gray-500 font-medium">Decision</span>
            <span class="text-gray-900 font-bold">{{ currentExpense.decision || 'Super Admin approval required' }}</span>
          </div>

          <div class="flex items-center justify-between text-xs py-1">
            <span class="text-gray-500 font-medium">Payment</span>
            <span class="text-gray-900 font-bold">{{ currentExpense.payment }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Attachment Section -->
    <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100">
        <h3 class="text-[13px] font-bold text-gray-900">Attachment</h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <th class="px-6 py-3">File</th>
              <th class="px-6 py-3">Type</th>
              <th class="px-6 py-3">Uploaded</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4 font-semibold text-gray-800 flex items-center gap-2">
                <FileText class="w-4 h-4 text-gray-400" />
                {{ currentExpense.receiptFile || 'logistics_invoice.pdf' }}
              </td>
              <td class="px-6 py-4 text-gray-600 font-medium">{{ currentExpense.receiptType || 'Receipt' }}</td>
              <td class="px-6 py-4 text-gray-600 font-medium">{{ currentExpense.date || 'Aug 27' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Actions Bar -->
    <div class="flex items-center justify-end gap-3 pt-4">
      <button 
        @click="rejectExpense"
        class="px-5 py-2 text-[11px] font-bold text-red-600 bg-red-50/60 border border-red-200 rounded-lg hover:bg-red-100 transition-colors shadow-sm cursor-pointer"
      >
        Reject
      </button>

      <button 
        class="px-5 py-2 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
      >
        Request Changes
      </button>

      <button 
        @click="approveExpense"
        class="px-5 py-2 text-[11px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer"
      >
        Approve Expense
      </button>
    </div>
  </div>
</template>
