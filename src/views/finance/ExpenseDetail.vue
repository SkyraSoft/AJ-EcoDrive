<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { store } from '@/store'
import { ChevronDown, ArrowLeft, CheckCircle2, FileText } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const showToast = ref(false)
const toastMessage = ref('')

const currentExpense = computed(() => {
  const paramId = route.params.id || route.query.id
  if (paramId) {
    const found = store.getExpenseById(paramId) || store.expenses.find(e => e.id === paramId || e.expenseId === paramId)
    if (found) return found
  }
  if (store.selectedExpense) return store.selectedExpense
  return store.expenses[0] || {
    id: 'EXP-402',
    branch: 'Peshawar',
    category: 'Utilities',
    vendor: 'PESCO',
    amount: 'PKR 48,500',
    rawAmount: '48,500',
    date: '27 Aug',
    fullDate: '27 Aug 2026',
    approval: 'Pending',
    approvalClass: 'bg-[#fef3c7] text-[#92400e]',
    payment: 'Unpaid',
    paymentClass: 'text-gray-900 font-medium',
    branchLimit: 'PKR 100K',
    decision: 'Awaiting management',
    paymentMethod: 'Bank',
    description: 'Branch electricity bill',
    receiptFile: 'pescobill_aug.pdf',
    receiptType: 'PDF Document',
    submittedBy: 'Branch Manager',
    lastUpdate: 'Today 08:20',
    notes: 'Submit for approval'
  }
})

// --- BRANCH MANAGER TABS & DATA ---
const branchCurrentTab = ref('Details')
const branchTabs = [
  'Details',
  'Approval Status',
  'Payment',
  'Receipt',
  'Notes',
  'Activity'
]

const branchTabData = computed(() => {
  const exp = currentExpense.value
  const branchName = user.value?.branchName || exp.branch || 'Peshawar'

  switch (branchCurrentTab.value) {
    case 'Details':
      return {
        title: 'Details',
        items: [
          { label: 'Status', value: exp.approval || 'Pending' },
          { label: 'Category', value: exp.category || 'Utilities' },
          { label: 'Vendor', value: exp.vendor || 'PESCO' },
          { label: 'Amount', value: exp.amount || 'PKR 48,500' },
          { label: 'Date', value: exp.fullDate || exp.date || '27 Aug 2026' },
          { label: 'Payment Method', value: exp.paymentMethod || 'Bank' }
        ],
        relatedItems: [
          { label: 'Submitted by', value: exp.submittedBy || 'Branch Manager' },
          { label: 'Approval', value: exp.decision || 'Awaiting management' },
          { label: 'Receipt', value: exp.receiptFile ? 'Attached' : 'None' },
          { label: 'Last Update', value: exp.lastUpdate || 'Today 08:20' }
        ]
      }
    case 'Approval Status':
      return {
        title: 'Approval Status & Governance',
        items: [
          { label: 'Current Approval', value: exp.approval === 'Approved' ? 'Approved by Policy' : 'Pending Management Review' },
          { label: 'Branch Threshold', value: `${exp.branchLimit || 'PKR 100K'} (Within Branch Policy)` },
          { label: 'Approving Authority', value: 'Central Finance Lead / Super Admin' },
          { label: 'Submission Date', value: `${exp.fullDate || exp.date} · 08:20 AM` },
          { label: 'Policy Verification', value: 'Compliant with branch monthly budget' },
          { label: 'Audit Status', value: 'Under Automated Compliance Check' }
        ],
        relatedItems: [
          { label: 'SLA Window', value: '24 Hours' },
          { label: 'Priority', value: 'Normal' },
          { label: 'Approver Role', value: 'Super Admin' },
          { label: 'Escalation', value: 'Not required' }
        ]
      }
    case 'Payment':
      return {
        title: 'Payment Details & Settlement',
        items: [
          { label: 'Payment Status', value: exp.payment || 'Unpaid' },
          { label: 'Disbursement Method', value: exp.paymentMethod || 'Bank IBFT' },
          { label: 'Beneficiary Name', value: exp.vendor || 'PESCO' },
          { label: 'Billing Period', value: 'August 2026' },
          { label: 'Settlement Amount', value: exp.amount || 'PKR 48,500' },
          { label: 'Due Date', value: '05 Sep 2026' }
        ],
        relatedItems: [
          { label: 'Total Due', value: exp.amount || 'PKR 48,500' },
          { label: 'Currency', value: 'PKR' },
          { label: 'Ledger Code', value: `EXP-${exp.category?.toUpperCase() || 'UTL'}-771` },
          { label: 'Tax Deducted', value: 'PKR 0' }
        ]
      }
    case 'Receipt':
      return {
        title: 'Receipt & Evidence Document',
        items: [
          { label: 'Attached File', value: exp.receiptFile || 'pescobill_aug.pdf' },
          { label: 'Document Type', value: exp.receiptType || 'PDF Document' },
          { label: 'File Size', value: '1.4 MB' },
          { label: 'Uploaded By', value: `${exp.submittedBy || 'Branch Manager'} (${branchName})` },
          { label: 'Verification Status', value: 'Verified & Legible' },
          { label: 'Storage Node', value: 'Encrypted Document Vault' }
        ],
        relatedItems: [
          { label: 'Files Count', value: '1 Document' },
          { label: 'File Format', value: 'PDF' },
          { label: 'Scan Quality', value: '300 DPI' },
          { label: 'Intake Date', value: exp.fullDate || exp.date || '27 Aug 2026' }
        ]
      }
    case 'Notes':
      return {
        title: 'Notes & Manager Justification',
        items: [
          { label: 'Submission Note', value: exp.notes || 'Submit for approval' },
          { label: 'Manager Description', value: exp.description || 'Branch electricity bill' },
          { label: 'Cost Center', value: `${branchName} Branch Operational Expense` },
          { label: 'Billing Month', value: 'August 2026' },
          { label: 'Special Instructions', value: 'Disburse before due date to avoid surcharge' },
          { label: 'Vendor Reference', value: `${exp.vendor || 'PESCO'} Consumer Account` }
        ],
        relatedItems: [
          { label: 'Department', value: 'Administration' },
          { label: 'Branch', value: `${branchName} Branch` },
          { label: 'Tag', value: 'Operational' },
          { label: 'Risk Tier', value: 'Low' }
        ]
      }
    case 'Activity':
      return {
        title: 'Activity & Audit Log',
        items: [
          { label: 'Today · 08:20 AM', value: `Expense claim ${exp.id} submitted by ${exp.submittedBy || 'Branch Manager'}` },
          { label: `${exp.date} · 08:15 AM`, value: `Scanned document ${exp.receiptFile || 'pescobill_aug.pdf'} attached` },
          { label: `${exp.date} · 08:00 AM`, value: `Invoice received from ${exp.vendor || 'vendor'}` },
          { label: 'Current State', value: exp.approval === 'Approved' ? 'Expense approved and settled' : 'Awaiting Central Management approval' },
          { label: 'Assigned Queue', value: 'Head Office Accounts Payable' },
          { label: 'Audit Trail Ref', value: `AUD-${exp.id}-2026` }
        ],
        relatedItems: [
          { label: 'Logged By', value: 'System Audit' },
          { label: 'Total Events', value: '4 Entries' },
          { label: 'Branch', value: `${branchName} Branch` },
          { label: 'Integrity', value: 'Tamper-Proof Log' }
        ]
      }
    default:
      return {
        title: 'Details',
        items: [],
        relatedItems: []
      }
  }
})

// --- SUPER ADMIN ACTIONS ---
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
  <!-- BRANCH MANAGER VIEW -->
  <div v-if="isBranchUser" class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[11px] text-gray-400 mb-1">
          Branch Manager / Expenses / <span class="font-medium text-gray-600">Expense {{ currentExpense.id }}</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Expense {{ currentExpense.id }}</h1>
        <p class="text-xs text-gray-500 mt-1">Expense detail — {{ branchCurrentTab }}.</p>
      </div>
    </div>

    <!-- Navigation Tabs (6 horizontal tabs matching Screenshot 3) -->
    <div class="border-b border-gray-100 flex items-center gap-6 overflow-x-auto no-scrollbar pb-1">
      <button 
        v-for="tab in branchTabs" 
        :key="tab"
        @click="branchCurrentTab = tab"
        :class="[
          'text-xs whitespace-nowrap pb-2 font-semibold transition-colors cursor-pointer relative',
          branchCurrentTab === tab ? 'text-[#165A31] font-bold' : 'text-gray-400 hover:text-gray-700'
        ]"
      >
        {{ tab }}
        <div v-if="branchCurrentTab === tab" class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#165A31] rounded-t-full"></div>
      </button>
    </div>

    <!-- 2-Card Layout (Matching Screenshot 3) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Left Card (Span 8) -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 lg:col-span-8 flex flex-col justify-between">
        <div>
          <h3 class="text-sm font-bold text-gray-900 mb-4">{{ branchTabData.title }}</h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div 
              v-for="(item, idx) in branchTabData.items" 
              :key="idx" 
              class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between"
            >
              <span class="text-[10px] font-medium text-gray-400">{{ item.label }}</span>
              <span class="text-xs font-bold text-gray-900 mt-1">{{ item.value }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Card: Related information (Span 4) -->
      <div class="lg:col-span-4 flex flex-col">
        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
          <h3 class="text-sm font-bold text-gray-900 mb-4">Related information</h3>
          
          <div class="grid grid-cols-2 gap-3.5">
            <div 
              v-for="(item, idx) in branchTabData.relatedItems" 
              :key="idx" 
              class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between"
            >
              <span class="text-[10px] font-medium text-gray-400">{{ item.label }}</span>
              <span class="text-xs font-bold text-gray-900 mt-1">{{ item.value }}</span>
            </div>
          </div>
        </div>
        
        <p class="text-[11px] text-gray-400 font-medium mt-3 px-1 leading-relaxed">
          This view is scoped only to {{ user?.branchName || 'Peshawar' }} Branch. Actions that require company-wide approval remain with management.
        </p>
      </div>
    </div>
  </div>

  <!-- SUPER ADMIN VIEW -->
  <div v-else class="max-w-[1400px] mx-auto space-y-6 pb-12">
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

        <button @click="approveExpense" class="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer">
          Approve
        </button>

        <button @click="rejectExpense" class="px-3.5 py-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors shadow-sm cursor-pointer">
          Reject
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
            <span class="text-gray-900 font-bold">{{ currentExpense.fullDate || currentExpense.date }}</span>
          </div>
        </div>
      </div>

      <!-- 2. Approval & Payment -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-[13px] font-bold text-gray-900">Approval & Payment</h3>
        
        <div class="space-y-3 pt-2">
          <div class="flex items-center justify-between text-xs py-1 border-b border-gray-50">
            <span class="text-gray-500 font-medium">Payment Method</span>
            <span class="text-gray-900 font-bold">{{ currentExpense.paymentMethod }}</span>
          </div>

          <div class="flex items-center justify-between text-xs py-1 border-b border-gray-50">
            <span class="text-gray-500 font-medium">Payment Status</span>
            <span :class="currentExpense.paymentClass || 'font-bold text-gray-900'">{{ currentExpense.payment }}</span>
          </div>

          <div class="flex items-center justify-between text-xs py-1 border-b border-gray-50">
            <span class="text-gray-500 font-medium">Policy Check</span>
            <span class="text-gray-900 font-bold">{{ currentExpense.decision }}</span>
          </div>

          <div class="flex items-center justify-between text-xs py-1">
            <span class="text-gray-500 font-medium">Receipt File</span>
            <span class="text-[#165A31] font-bold flex items-center gap-1 cursor-pointer hover:underline">
              <FileText class="w-3.5 h-3.5" /> {{ currentExpense.receiptFile }}
            </span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
