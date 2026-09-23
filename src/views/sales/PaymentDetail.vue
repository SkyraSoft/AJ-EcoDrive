<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { store } from '../../store.js'
import { ArrowLeft, Plus } from 'lucide-vue-next'
import CreatePaymentModal from './CreatePayment.vue'

const route = useRoute()
const router = useRouter()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)
const showCreateModal = ref(false)

const rawPayId = computed(() => route.params.id || route.query.id)
const currentPayment = computed(() => {
  if (rawPayId.value) return store.getPaymentById(rawPayId.value)
  return store.payments[0] || null
})

const paymentId = computed(() => currentPayment.value?.id || currentPayment.value?.payment || rawPayId.value || 'PAY-7791')
const is7788 = computed(() => paymentId.value === 'PAY-7788')

const linkedInvoice = computed(() => {
  if (!currentPayment.value) return null
  const invId = currentPayment.value.invoice_id || (currentPayment.value.order ? `INV-${currentPayment.value.order.replace('ORD-', '')}` : null)
  return invId ? store.getInvoiceById(invId) : null
})

const linkedOrder = computed(() => {
  if (!currentPayment.value) return null
  const ordId = currentPayment.value.order_id || currentPayment.value.order
  return ordId ? store.getOrderById(ordId) : null
})

const branchCurrentTab = ref('Summary')
const branchTabs = ['Summary', 'Allocation', 'Bank Details', 'Customer Account', 'Activity']

const branchTabData = computed(() => {
  const p = currentPayment.value
  if (!p) return { title: 'Summary', items: [] }

  const branchName = user.value?.branchName || p.branch || 'Peshawar'
  const customerName = p.customer || 'Ahsan Khan'
  const amount = p.amount || 'PKR 280,000'
  const method = p.method || 'Bank Transfer'
  const status = p.status || 'Reconciled'
  const orderRef = p.order || p.orderNo || 'ORD-2241'

  const totalBilled = linkedOrder.value?.total || linkedInvoice.value?.total ? ('PKR ' + (linkedOrder.value?.total || linkedInvoice.value?.total).toLocaleString()) : (is7788.value ? 'PKR 340,000' : 'PKR 280,000')
  const remainingBal = linkedInvoice.value?.outstandingAmount !== undefined ? ('PKR ' + linkedInvoice.value.outstandingAmount.toLocaleString()) : (is7788.value ? 'PKR 215,000' : 'PKR 0')

  switch (branchCurrentTab.value) {
    case 'Summary':
      return {
        title: 'Summary',
        items: [
          { label: 'Payment', value: p.id || paymentId.value },
          { label: 'Customer', value: customerName },
          { label: 'Method', value: method },
          { label: 'Amount', value: amount },
          { label: 'Order Reference', value: orderRef },
          { label: 'Status', value: status }
        ]
      }
    case 'Allocation':
      return {
        title: 'Allocation',
        items: [
          { label: 'Applied Invoice', value: p.invoice_id || `INV-${orderRef.replace('ORD-', '')}` },
          { label: 'Total Order Value', value: totalBilled },
          { label: 'Payment Allocation', value: `${amount} applied` },
          { label: 'Unallocated Funds', value: 'PKR 0' },
          { label: 'Remaining Balance', value: remainingBal },
          { label: 'Allocation Rule', value: 'First In First Out' }
        ]
      }
    case 'Bank Details':
      return {
        title: 'Bank Details',
        items: [
          { label: 'Deposit Account', value: p.bankAccount || 'Meezan Bank - Main Operational Account' },
          { label: 'Transaction Slip', value: p.ref || p.transactionRef || `TXN-${paymentId.value.replace('PAY-', '')}-MEEZAN` },
          { label: 'Bank Branch', value: `${branchName} Saddar Road` },
          { label: 'Clearing Date', value: p.date || 'Today 10:45' },
          { label: 'Bank Fee / Charges', value: 'PKR 0' },
          { label: 'Reconciliation State', value: is7788.value ? 'Cash Drawer Unverified' : 'Bank Matched 100%' }
        ]
      }
    case 'Customer Account':
      return {
        title: 'Customer Account',
        items: [
          { label: 'Account Holder', value: customerName },
          { label: 'Total Lifetime Orders', value: '2 Completed' },
          { label: 'Credit Limit', value: 'PKR 0 (Advance only)' },
          { label: 'Current Receivables', value: remainingBal },
          { label: 'Payment Reliability', value: 'Excellent (Prompt Pay)' },
          { label: 'Branch Account', value: `${branchName} Customer Ledger` }
        ]
      }
    case 'Activity':
      return {
        title: 'Activity',
        items: [
          { label: '10:45', value: `Payment of ${amount} posted and receipt generated` },
          { label: '10:15', value: 'Bank transaction confirmed by cashier' },
          { label: '09:40', value: `Payment requested for order ${orderRef}` },
          { label: 'Current State', value: status },
          { label: 'Logged By', value: 'Hamza (Sales Executive)' },
          { label: 'Audit Trail', value: 'Financial Entry Active' }
        ]
      }
    default:
      return {
        title: 'Summary',
        items: []
      }
  }
})

// Super Admin Data
const activeTab = ref('Summary')
const tabs = ['Summary', 'Allocation', 'Bank Details', 'Customer Account', 'Activity']
</script>

<template>
  <div v-if="!currentPayment" class="max-w-[1400px] mx-auto py-16 text-center space-y-4">
    <h2 class="text-2xl font-bold text-gray-900">Payment Not Found</h2>
    <p class="text-sm text-gray-500">No payment transaction matches identifier "{{ rawPayId }}".</p>
    <button @click="router.push('/sales/payments')" class="inline-flex items-center gap-2 px-4 py-2 bg-[#165A31] text-white text-xs font-bold rounded-lg hover:bg-[#124a28]">
      <ArrowLeft class="w-4 h-4" /> Back to Payments
    </button>
  </div>

  <div v-else-if="isBranchUser" class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[11px] text-gray-400 mb-1">
          Branch Manager / Payments / <span class="font-medium text-gray-600">Payment {{ paymentId }}</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Payment {{ paymentId }}</h1>
        <p class="text-xs text-gray-500 mt-1">Payment detail — {{ branchCurrentTab }}.</p>
      </div>
      <div class="flex items-center gap-2">
        <button 
          @click="router.push('/sales/payments')" 
          class="bg-white border border-gray-200 text-gray-700 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
        >
          Back to List
        </button>
        <button 
          @click="showCreateModal = true" 
          class="bg-[#165A31] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <Plus class="w-4 h-4" /> <span>Record Payment</span>
        </button>
      </div>
    </div>

    <!-- Tabs Navigation Bar -->
    <div class="border-b border-gray-100 flex items-center gap-6 overflow-x-auto pb-1">
      <button 
        v-for="tab in branchTabs" 
        :key="tab"
        @click="branchCurrentTab = tab"
        class="pb-2 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer relative"
        :class="branchCurrentTab === tab ? 'text-[#165A31] font-bold' : 'text-gray-400 hover:text-gray-700'"
      >
        {{ tab }}
        <div v-if="branchCurrentTab === tab" class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#165A31] rounded-t-full"></div>
      </button>
    </div>

    <!-- Tab Content: Left Box (Data) & Right Box (Related information) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left Box -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 lg:col-span-8 flex flex-col justify-between">
        <div>
          <h3 class="text-sm font-bold text-gray-900 mb-5">{{ branchTabData.title }}</h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div v-for="(item, idx) in branchTabData.items" :key="idx" class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">{{ item.label }}</span>
              <span class="text-sm font-bold text-gray-900 mt-1">{{ item.value }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Box: Related information -->
      <div class="lg:col-span-4 flex flex-col">
        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
          <h3 class="text-sm font-bold text-gray-900 mb-5">Related information</h3>
          
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Receipt</span>
              <span class="text-sm font-bold text-gray-900 mt-1">Posted</span>
            </div>
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Settlement</span>
              <span class="text-sm font-bold text-gray-900 mt-1">Immediate</span>
            </div>
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Reconciled</span>
              <span class="text-sm font-bold text-gray-900 mt-1">{{ is7788 ? 'Pending' : 'Yes' }}</span>
            </div>
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Owner</span>
              <span class="text-sm font-bold text-gray-900 mt-1">Hamza</span>
            </div>
          </div>
        </div>
        
        <p class="text-[11px] text-gray-400 font-medium mt-3 px-1">
          This view is scoped only to {{ user?.branchName || 'Peshawar' }} Branch. Actions that require company-wide approval remain with management.
        </p>
      </div>
    </div>
  </div>

  <!-- SUPER ADMIN VIEW -->
  <div v-else class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
      <h1 class="text-[28px] font-bold text-gray-900">Payment {{ paymentId }}</h1>
      <p class="text-xs text-gray-500 mt-1">Super Admin Payment View</p>
    </div>
  </div>

  <!-- Create Payment Modal Popup -->
  <CreatePaymentModal 
    v-if="showCreateModal" 
    :is-modal="true" 
    @close="showCreateModal = false" 
  />
</template>
