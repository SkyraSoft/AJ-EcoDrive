<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { store } from '../../store.js'
import { ArrowLeft, Plus, Printer } from 'lucide-vue-next'
import CreatePaymentModal from './CreatePayment.vue'
import NotFoundState from '@/components/common/NotFoundState.vue'

const route = useRoute()
const router = useRouter()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)
const showCreateModal = ref(false)

const handlePrint = () => {
  window.print()
}

onMounted(() => {
  store.fetchRemotePayments().catch(e => console.warn('[PaymentDetail] Remote sync note:', e.message))
  store.fetchRemoteInvoices().catch(e => console.warn('[PaymentDetail] Remote sync note:', e.message))
})

const rawPayId = computed(() => route.params.id || route.query.id)
const currentPayment = computed(() => {
  if (!rawPayId.value) return null
  return store.getPaymentById(rawPayId.value)
})

const branchRecord = computed(() => {
  const bName = currentPayment.value?.branch || user.value?.branchName || 'Peshawar'
  return store.branches?.find(b => b.name?.toLowerCase() === bName.toLowerCase() || b.id === bName || b.code === bName) || null
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
  <NotFoundState
    v-if="!currentPayment"
    title="Payment Not Found"
    :message="`Payment '${rawPayId}' was not found or is not accessible for your branch.`"
    back-path="/sales/payments"
    back-label="Back to Payments"
  />

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
          @click="handlePrint" 
          class="bg-white border border-gray-200 text-gray-700 text-xs font-bold px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
        >
          <Printer class="w-4 h-4" /> Print Receipt
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

  <!-- PRINTABLE PAYMENT RECEIPT (Hidden on screen, visible on print) -->
  <div class="print-document hidden print:block bg-white text-black p-8 font-sans max-w-2xl mx-auto border-2 border-black">
    <div class="border-b-2 border-black pb-4 mb-6">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-2xl font-black tracking-tight uppercase">{{ store.settings?.company?.name || 'AJ ECODRIVE LTD' }} / {{ store.settings?.company?.brand || 'BRG ELECTRIC VEHICLES' }}</h1>
          <p class="text-xs text-gray-700 mt-1 uppercase">{{ branchRecord?.name || currentPayment?.branch || 'Peshawar' }} Showroom & Cash Office</p>
          <p class="text-[11px] text-gray-600">{{ branchRecord?.address || `${currentPayment?.branch || 'Peshawar'}, Pakistan` }}</p>
          <p class="text-[11px] text-gray-600">Phone: {{ branchRecord?.phone || store.settings?.company?.phone || 'Not configured' }} | NTN: {{ store.settings?.company?.taxNumber || 'Not configured' }} | STRN: {{ store.settings?.company?.strn || store.settings?.company?.registrationNumber || 'Not configured' }}</p>
        </div>
        <div class="text-right">
          <span class="inline-block border-2 border-black px-3 py-1 text-sm font-black uppercase">PAYMENT RECEIPT</span>
          <div class="text-xs text-right mt-2 space-y-0.5">
            <p><strong>Receipt No:</strong> {{ paymentId }}</p>
            <p><strong>Date:</strong> {{ currentPayment?.date || new Date().toLocaleDateString() }}</p>
            <p><strong>Customer File:</strong> #FILE-{{ String(currentPayment?.order || '2241').replace(/[^0-9]/g, '').slice(-4) || '101' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Receipt Body -->
    <div class="border border-gray-300 p-4 mb-6 text-xs space-y-3">
      <div class="flex justify-between border-b pb-2">
        <span class="text-gray-600">Received With Thanks From:</span>
        <span class="font-bold text-sm uppercase">{{ currentPayment?.customer || 'Valued Customer' }}</span>
      </div>
      <div class="flex justify-between border-b pb-2">
        <span class="text-gray-600">On Account Of / Order Reference:</span>
        <span class="font-bold">{{ currentPayment?.order || currentPayment?.orderNo || 'ORD-2241' }} (Vehicle Booking)</span>
      </div>
      <div class="flex justify-between border-b pb-2">
        <span class="text-gray-600">Payment Instrument / Mode:</span>
        <span class="font-bold">{{ currentPayment?.method || 'Bank Transfer' }}</span>
      </div>
      <div class="flex justify-between border-b pb-2">
        <span class="text-gray-600">Deposit Account / Slip Ref:</span>
        <span class="font-mono">{{ currentPayment?.ref || currentPayment?.transactionRef || currentPayment?.bankAccount || 'Meezan Bank Operations' }}</span>
      </div>
      <div class="flex justify-between pt-2 text-base font-black border-t-2 border-black">
        <span>Total Amount Received:</span>
        <span class="text-[#165A31]">{{ currentPayment?.amount || 'PKR 280,000' }}</span>
      </div>
    </div>

    <!-- Triple Signature Blocks & Stamp Box -->
    <div class="grid grid-cols-3 gap-6 pt-10 text-center text-xs">
      <div class="border-t border-black pt-2">
        <p class="font-bold">Received By Cashier</p>
        <p class="text-[10px] text-gray-500 mt-6">{{ currentPayment?.cashier || user?.name || 'Showroom Cashier' }}</p>
      </div>
      <div class="border-t border-black pt-2">
        <p class="font-bold">Customer Signature</p>
        <p class="text-[10px] text-gray-500 mt-6">Depositor / Payer</p>
      </div>
      <div class="border border-black p-2 h-24 flex items-center justify-center">
        <span class="text-[9px] text-gray-400 font-bold uppercase tracking-wider">OFFICIAL CASH OFFICE STAMP</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media print {
  :deep(.no-print),
  .no-print,
  nav,
  aside,
  header {
    display: none !important;
  }
  .print-document {
    display: block !important;
  }
  body {
    background: white !important;
    color: black !important;
  }
}
</style>
