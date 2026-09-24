<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { store } from '../../store.js'
import { ChevronDown } from 'lucide-vue-next'
import CreateSaleModal from './CreateSale.vue'

const route = useRoute()
const router = useRouter()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

// Branch Manager Data & Logic
const orderId = computed(() => route.params.id || route.query.id || 'ORD-2241')
const is2238 = computed(() => orderId.value === 'ORD-2238')
const orderRecord = computed(() => store.getOrderById(orderId.value))
const customerRecord = computed(() => store.getCustomerById(orderRecord.value?.customer_id || orderRecord.value?.customer))
const unitRecord = computed(() => store.getUnitById(orderRecord.value?.unit_id || orderRecord.value?.unit))

const branchCurrentTab = ref('Summary')
const branchTabs = ['Summary', 'Items & Unit', 'Customer', 'Payment', 'Invoice', 'Delivery', 'Return', 'Warranty', 'Documents', 'Activity']

const branchTabData = computed(() => {
  const o = orderRecord.value
  const c = customerRecord.value
  const u = unitRecord.value
  const branchName = user.value?.branchName || o?.branch || 'Peshawar'

  const customerName = o?.customer || c?.name || 'Ahsan Khan'
  const productName = o?.product || u?.product || 'BRG E-125'
  const chassisNo = u?.chassisNumber || u?.chassis || o?.unit || 'CH8-BRG-26-01882'
  const orderTotal = o?.total || 'PKR 280,000'
  const paidAmount = o?.paid || (is2238.value ? 'PKR 125,000' : (o?.total || 'PKR 280,000'))
  const orderStatus = o?.status || 'Ready'
  const outstandingBal = o?.balance || (is2238.value ? 'PKR 215,000' : 'PKR 0')

  switch (branchCurrentTab.value) {
    case 'Summary':
      return {
        title: 'Summary',
        items: [
          { label: 'Status', value: orderStatus },
          { label: 'Customer', value: customerName },
          { label: 'Product', value: productName },
          { label: 'Chassis', value: chassisNo },
          { label: 'Order Total', value: orderTotal },
          { label: 'Paid', value: paidAmount }
        ]
      }
    case 'Items & Unit':
      return {
        title: 'Items & Unit',
        items: [
          { label: 'Product Model', value: productName },
          { label: 'Chassis Number', value: chassisNo },
          { label: 'Allocated Unit', value: u?.serial || o?.unit || `${productName.split(' ')[1] || 'DS11'}-00881` },
          { label: 'Variant / Color', value: 'Pearl White / Metallic' },
          { label: 'Battery Serial', value: u?.batteryNumber || 'BAT-2026-9904' },
          { label: 'QC Inspection', value: 'Passed 100% Checklist' }
        ]
      }
    case 'Customer':
      return {
        title: 'Customer',
        items: [
          { label: 'Full Name', value: customerName },
          { label: 'Contact Phone', value: c?.phone || '+92 300 1234567' },
          { label: 'CNIC / National ID', value: c?.cnic || '17301-8849201-3' },
          { label: 'Delivery Address', value: c?.address || `${branchName} City Center` },
          { label: 'Customer Segment', value: 'Retail Individual' },
          { label: 'Account History', value: 'Verified Buyer' }
        ]
      }
    case 'Payment':
      return {
        title: 'Payment',
        items: [
          { label: 'Total Billed', value: orderTotal },
          { label: 'Amount Received', value: paidAmount },
          { label: 'Outstanding Balance', value: outstandingBal },
          { label: 'Payment Method', value: 'Bank Direct Deposit' },
          { label: 'Transaction Ref', value: `TXN-${orderId.value.replace('ORD-', '')}-99` },
          { label: 'Payment Status', value: outstandingBal !== 'PKR 0' && outstandingBal !== '0' ? 'Partial Receipt' : 'Fully Cleared' }
        ]
      }
    case 'Invoice':
      return {
        title: 'Invoice',
        items: [
          { label: 'Invoice Number', value: `INV-${orderId.value.replace('ORD-', '')}` },
          { label: 'Issue Date', value: 'Today' },
          { label: 'Tax Status', value: 'FBR Verified Invoice' },
          { label: 'Payment Terms', value: 'Due Upon Receipt' },
          { label: 'Digital Stamp', value: 'Active Official Seal' },
          { label: 'Invoice PDF', value: `INV-${orderId.value.replace('ORD-', '')}.pdf` }
        ]
      }
    case 'Delivery':
      return {
        title: 'Delivery',
        items: [
          { label: 'Handover Schedule', value: 'Today 16:00' },
          { label: 'Delivery Status', value: outstandingBal !== 'PKR 0' && outstandingBal !== '0' ? 'Awaiting Final Balance' : 'Ready for Handover' },
          { label: 'Dispatch Location', value: `${branchName} Main Showroom` },
          { label: 'Handover Executive', value: 'Hamza Ali' },
          { label: 'Transport Method', value: 'Customer Pickup' },
          { label: 'Gate Pass State', value: outstandingBal !== 'PKR 0' && outstandingBal !== '0' ? 'Locked' : 'Issued' }
        ]
      }
    case 'Return':
      return {
        title: 'Return',
        items: [
          { label: 'Return Requests', value: '0 Active' },
          { label: 'Replacement Claims', value: 'None' },
          { label: 'Refund Status', value: 'Not Applicable' },
          { label: 'Inspection State', value: 'Original Sale Good' },
          { label: 'Return Policy', value: '7-Day Branch Warranty' },
          { label: 'Dispute Status', value: 'Clean Record' }
        ]
      }
    case 'Warranty':
      return {
        title: 'Warranty',
        items: [
          { label: 'Warranty Period', value: '12 months' },
          { label: 'Warranty Coverage', value: 'Battery, Motor & Controller' },
          { label: 'Service Center', value: `${branchName} Authorized Service` },
          { label: 'Free Services', value: '2 Vouchers Included' },
          { label: 'Activation Date', value: 'Effective from Handover' },
          { label: 'Warranty Certificate', value: 'Issued with Vehicle Pack' }
        ]
      }
    case 'Documents':
      return {
        title: 'Documents',
        items: [
          { label: 'Sales Agreement', value: `${orderId.value}_Contract.pdf` },
          { label: 'Invoice Document', value: `INV-${orderId.value.replace('ORD-', '')}.pdf` },
          { label: 'Delivery Handover Sheet', value: 'Handover_Checklist.pdf' },
          { label: 'Customer CNIC Copy', value: 'CNIC_Verified.jpg' },
          { label: 'Warranty Registration', value: 'Warranty_Card.pdf' },
          { label: 'Total Files', value: '5 Verified Documents' }
        ]
      }
    case 'Activity': {
      const logs = store.getAuditLogsForEntity('sales_order', orderId.value)
      const items = logs.length > 0 
        ? logs.map(l => ({
            label: l.timestamp || 'Recorded',
            value: `${l.action || l.operation}: ${l.description || l.result} (${l.user || l.actor_name || 'System'})`
          }))
        : [
            { label: '11:20', value: 'Delivery scheduled for Today 16:00' },
            { label: '10:45', value: `Payment of ${paidAmount} posted to ledger` },
            { label: '10:15', value: `Unit ${chassisNo} reserved from showroom` },
            { label: '09:30', value: `Order ${orderId.value} created from quotation` },
            { label: 'Current State', value: orderStatus },
            { label: 'Audit Trail', value: 'Logged in system' }
          ]
      return {
        title: 'Activity',
        items
      }
    }
    default:
      return {
        title: 'Summary',
        items: []
      }
  }
})

// Super Admin Data
const showEditModal = ref(false)
const activeTab = ref('Summary')
const tabs = ['Summary', 'Items & Serialized Unit', 'Customer', 'Price & Margin', 'Payments', 'Invoice', 'Delivery', 'Returns', 'Warranty', 'Documents', 'Activity']

const adminTabData = computed(() => {
  const o = orderRecord.value
  const c = customerRecord.value
  const u = unitRecord.value
  const branchName = o?.branch || 'Peshawar'
  const customerName = o?.customer || c?.name || 'Ahsan Khan'
  const productName = o?.product || u?.product || 'BRG E-125'
  const chassisNo = u?.chassisNumber || u?.chassis || o?.unit || 'CH8-BRG-26-01882'
  const orderTotal = o?.total || 'PKR 280,000'
  const paidAmount = o?.paid || (is2238.value ? 'PKR 125,000' : (o?.total || 'PKR 280,000'))
  const orderStatus = o?.status || 'Ready'
  const outstandingBal = o?.balance || (is2238.value ? 'PKR 215,000' : 'PKR 0')

  switch (activeTab.value) {
    case 'Summary':
      return {
        title: 'Executive Order Summary',
        items: [
          { label: 'Order Reference', value: orderId.value },
          { label: 'Branch Location', value: branchName },
          { label: 'Order Status', value: orderStatus },
          { label: 'Customer', value: customerName },
          { label: 'Assigned Vehicle', value: `${productName} (${chassisNo})` },
          { label: 'Order Value', value: orderTotal },
          { label: 'Total Paid', value: paidAmount },
          { label: 'Outstanding Balance', value: outstandingBal }
        ]
      }
    case 'Items & Serialized Unit':
      return {
        title: 'Vehicle & Serialized Unit Details',
        items: [
          { label: 'Product Model', value: productName },
          { label: 'Chassis / VIN', value: chassisNo },
          { label: 'Motor Serial', value: u?.motorNumber || 'MTR-72V-1200W-0881' },
          { label: 'Battery Pack ID', value: u?.batteryNumber || 'BAT-72V-32AH-9904' },
          { label: 'Color / Variant', value: u?.color || 'Pearl White / Metallic' },
          { label: 'Floor Location', value: `${branchName} Showroom Bay 2` },
          { label: 'QC Inspection', value: 'Passed 100% Checklist' },
          { label: 'PDI Pre-Delivery Status', value: 'Completed & Certified' }
        ]
      }
    case 'Customer':
      return {
        title: 'Customer Profile & Commercial Account',
        items: [
          { label: 'Full Legal Name', value: customerName },
          { label: 'CNIC / National ID', value: c?.cnic || '17301-8849201-3' },
          { label: 'Registered Phone', value: c?.phone || '+92 300 1234567' },
          { label: 'Email Address', value: c?.email || 'customer@example.com' },
          { label: 'Residential Address', value: c?.address || `${branchName} City Center` },
          { label: 'City & Branch', value: `${c?.city || branchName}` },
          { label: 'Customer Segment', value: 'Retail Individual' },
          { label: 'Credit Risk / Tier', value: 'Standard (Good Standing)' }
        ]
      }
    case 'Price & Margin':
      return {
        title: 'Commercial Terms, Costing & Margin Analysis',
        items: [
          { label: 'Catalogue Price', value: orderTotal },
          { label: 'Approved Discount', value: 'PKR 0 (Standard List Price)' },
          { label: 'Final Net Price', value: orderTotal },
          { label: 'Estimated Landed Cost', value: 'PKR 224,000' },
          { label: 'Gross Profit', value: 'PKR 56,000' },
          { label: 'Gross Margin %', value: '20.0%' },
          { label: 'Sales Tax / Levies', value: 'Included (Exempt / Documented)' },
          { label: 'Price Approval Authority', value: 'Head Office Master Tariff' }
        ]
      }
    case 'Payments':
      return {
        title: 'Payment Schedule & Settlement Ledger',
        items: [
          { label: 'Total Billed Amount', value: orderTotal },
          { label: 'Total Received to Date', value: paidAmount },
          { label: 'Outstanding Balance', value: outstandingBal },
          { label: 'Settlement Status', value: outstandingBal === 'PKR 0' || outstandingBal === '0' ? 'Fully Settled' : 'Partial Payment' },
          { label: 'Primary Payment Method', value: 'Bank Direct Deposit / Pay Order' },
          { label: 'Transaction Reference', value: `TXN-${orderId.value.replace('ORD-', '')}-99` },
          { label: 'Deposit Clearing Bank', value: 'Meezan Bank (Dealership Ops A/C)' },
          { label: 'Cashier Verification', value: 'Verified & Reconciled' }
        ]
      }
    case 'Invoice':
      return {
        title: 'Tax Invoice & Billing Record',
        items: [
          { label: 'Invoice Number', value: `INV-${orderId.value.replace('ORD-', '')}` },
          { label: 'Billing Date', value: 'Today' },
          { label: 'Tax Regulatory Status', value: 'FBR POS Integrated / Compliant' },
          { label: 'Payment Terms', value: 'Due Upon Vehicle Delivery' },
          { label: 'Invoice PDF Document', value: `INV-${orderId.value.replace('ORD-', '')}.pdf` },
          { label: 'Commercial Terms', value: 'Ex-Showroom with Warranty' }
        ]
      }
    case 'Delivery':
      return {
        title: 'Vehicle Dispatch & Handover Protocol',
        items: [
          { label: 'Handover Schedule', value: 'Today 16:00' },
          { label: 'Delivery Readiness', value: outstandingBal !== 'PKR 0' && outstandingBal !== '0' ? 'Pending Final Payment' : 'Ready for Handover' },
          { label: 'Handover Executive', value: 'Hamza Ali (Showroom Manager)' },
          { label: 'Dispatch Location', value: `${branchName} Main Showroom` },
          { label: 'Gate Pass Status', value: outstandingBal !== 'PKR 0' && outstandingBal !== '0' ? 'Locked (Requires Full Settlement)' : 'Issued & Validated' },
          { label: 'Tool Kit & Charger Pack', value: 'Verified 100% Present' }
        ]
      }
    case 'Returns':
      return {
        title: 'Return, Replacement & Exchange Status',
        items: [
          { label: 'Active Return Claims', value: '0 Open Claims' },
          { label: 'Replacement Policy', value: '7-Day Return / Exchange Warranty' },
          { label: 'Dispute Status', value: 'Clean Record (No Complaints)' },
          { label: 'Vehicle Condition', value: 'Brand New (Zero Defects)' },
          { label: 'Odometer at Dispatch', value: '0.4 km (Pre-Delivery Road Test)' }
        ]
      }
    case 'Warranty':
      return {
        title: 'OEM Warranty Registration & Coverage',
        items: [
          { label: 'Warranty Policy', value: '2-Year Battery & Controller OEM Warranty' },
          { label: 'Coverage Scope', value: 'Battery Pack, BLDC Motor & Controller' },
          { label: 'Effective Start Date', value: 'From Physical Delivery Date' },
          { label: 'Expiry Date', value: '24 Months Post-Delivery' },
          { label: 'Free Periodic Services', value: '2 Complimentary Service Vouchers' },
          { label: 'Authorized Center', value: `${branchName} Authorized Workshop` }
        ]
      }
    case 'Documents':
      return {
        title: 'Linked Legal & Transactional Documents',
        items: [
          { label: 'Sales Agreement & Booking Contract', value: `${orderId.value}_Contract.pdf` },
          { label: 'Official Tax Invoice', value: `INV-${orderId.value.replace('ORD-', '')}.pdf` },
          { label: 'Customer CNIC Identity Copy', value: 'Verified_CNIC_Document.pdf' },
          { label: 'OEM Warranty Certificate', value: 'Warranty_Card_Registration.pdf' },
          { label: 'PDI Pre-Delivery Checklist', value: 'PDI_Checklist_Signed.pdf' },
          { label: 'Gate Pass Clearance Slip', value: 'GatePass_Issued.pdf' }
        ]
      }
    case 'Activity': {
      const logs = store.getAuditLogsForEntity('sales_order', orderId.value)
      const items = logs.length > 0 
        ? logs.map(l => ({
            label: l.timestamp || 'Recorded',
            value: `${l.action || l.operation}: ${l.description || l.result} (${l.user || l.actor_name || 'System'})`
          }))
        : [
            { label: '11:20', value: 'Delivery scheduled for Today 16:00' },
            { label: '10:45', value: `Payment of ${paidAmount} posted to ledger` },
            { label: '10:15', value: `Unit ${chassisNo} reserved from showroom` },
            { label: '09:30', value: `Order ${orderId.value} created from quotation` },
            { label: 'Audit Trail', value: 'Cryptographically logged in enterprise audit table' }
          ]
      return {
        title: 'Audit Log & Change Activity',
        items
      }
    }
    default:
      return {
        title: 'Summary',
        items: []
      }
  }
})

const editOrder = () => {
  store.originalEditOrder = {
    branch: 'Peshawar Branch',
    customer: 'Ahsan Khan',
    salesperson: 'Hamza Ali',
    product: 'BRG E-125',
    selectedUnit: 'E125-00881',
    cataloguePrice: '280K',
    discount: '0',
    finalPrice: orderRecord.value?.total || '280K',
    paymentMethod: 'Bank Transfer',
    amountReceived: orderRecord.value?.paid || '280K',
    balance: orderRecord.value?.balance || '0'
  }
  showEditModal.value = true
}

const convertToDelivery = () => {
  const o = orderRecord.value
  if (!o) return
  let deliv = store.deliveries.find(d => d.order === o.id || d.order_id === o.id)
  if (!deliv) {
    deliv = store.addDelivery({
      order: o.id,
      order_id: o.id,
      customer: o.customer,
      customer_id: o.customer_id,
      unit: o.unit,
      unit_id: o.unit_id,
      branch: o.branch,
      scheduled: 'Today 16:00',
      status: 'Ready'
    })
  }
  router.push({
    path: '/sales/delivery/detail',
    query: { id: deliv.delivery_id || deliv.id }
  })
}

const cancelOrder = () => {
  const o = orderRecord.value
  if (!o) return
  if (o.status === 'Delivered') {
    alert('Delivered order cannot be cancelled.')
    return
  }
  if (confirm(`Are you sure you want to cancel order ${o.id}? Any reserved unit will be released back to available inventory.`)) {
    if (o.unit_id) {
      store.releaseUnitReservation(o.unit_id, `Order ${o.id} cancelled`)
    }
    o.status = 'Cancelled'
    o.statusClass = 'bg-red-50 text-red-700'
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
          Branch Manager / Orders / <span class="font-medium text-gray-600">Order {{ orderId }}</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Order {{ orderId }}</h1>
        <p class="text-xs text-gray-500 mt-1">Order detail — {{ branchCurrentTab }}.</p>
      </div>
      <div class="flex items-center gap-2">
        <button 
          @click="router.push('/sales/orders')" 
          class="bg-white border border-gray-200 text-gray-700 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
        >
          Back to List
        </button>
        <button 
          v-if="orderRecord?.status !== 'Cancelled' && orderRecord?.status !== 'Delivered'"
          @click="convertToDelivery" 
          class="bg-[#165A31] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer"
        >
          Delivery Handover
        </button>
        <button 
          v-if="orderRecord?.status !== 'Cancelled' && orderRecord?.status !== 'Delivered'"
          @click="cancelOrder" 
          class="bg-white border border-red-200 text-red-600 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-red-50 transition-colors shadow-sm cursor-pointer"
        >
          Cancel Order
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
              <span class="text-[10px] font-medium text-gray-400">Invoice</span>
              <span class="text-sm font-bold text-gray-900 mt-1">INV-{{ orderId.replace('ORD-', '') }}</span>
            </div>
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Delivery</span>
              <span class="text-sm font-bold text-gray-900 mt-1">Today 16:00</span>
            </div>
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Warranty</span>
              <span class="text-sm font-bold text-gray-900 mt-1">12 months</span>
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
    <!-- Header Area -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Sales & CRM / Orders / <span class="font-bold text-gray-800">Order Detail — {{ activeTab }}</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900 flex items-center gap-3">
          Order Detail — {{ activeTab }}
        </h1>
        <p class="text-sm text-gray-500 mt-1">{{ orderId }} · {{ activeTab }}</p>
      </div>
      <div class="flex items-center gap-2">
        <button 
          @click="router.push('/sales/orders')" 
          class="bg-white border border-gray-200 text-gray-700 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
        >
          Back to List
        </button>
        <button 
          v-if="orderRecord?.status !== 'Cancelled' && orderRecord?.status !== 'Delivered'"
          @click="convertToDelivery" 
          class="bg-[#165A31] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer"
        >
          Delivery Handover
        </button>
      </div>
    </div>

    <!-- Status & Actions Card -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-gray-900">{{ orderId }}</h2>
          <p class="text-[12px] text-gray-500 mt-1">{{ orderRecord?.branch || 'Peshawar' }} · {{ orderRecord?.customer || 'Customer' }} · {{ orderRecord?.unit || 'CH8-BRG-26-01882' }}</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="inline-flex items-center px-2 py-1 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">{{ orderRecord?.status || 'Ready' }}</span>
          <button @click="editOrder" class="px-4 py-2 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            Order Actions
          </button>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="flex flex-wrap items-center gap-6 mt-6 border-b border-gray-100">
        <button 
          v-for="tab in tabs" 
          :key="tab"
          @click="activeTab = tab"
          class="pb-3 text-[12px] font-bold transition-colors relative"
          :class="activeTab === tab ? 'text-[#165A31]' : 'text-gray-400 hover:text-gray-600'"
        >
          {{ tab }}
          <div v-if="activeTab === tab" class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#165A31] rounded-t-full"></div>
        </button>
      </div>

      <!-- Tab Contents -->
      <div class="pt-6 space-y-6">
        <!-- Top KPI Row -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="p-5 bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <p class="text-[11px] font-medium text-gray-500 mb-1">Order Total</p>
            <h3 class="text-2xl font-bold text-gray-900">{{ orderRecord?.total || 'PKR 280,000' }}</h3>
          </div>
          <div class="p-5 bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <p class="text-[11px] font-medium text-gray-500 mb-1">Paid</p>
            <h3 class="text-2xl font-bold text-gray-900">{{ orderRecord?.paid || 'PKR 0' }}</h3>
          </div>
          <div class="p-5 bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <p class="text-[11px] font-medium text-gray-500 mb-1">Balance</p>
            <h3 class="text-2xl font-bold text-gray-900">{{ orderRecord?.balance || 'PKR 0' }}</h3>
          </div>
          <div class="p-5 bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <p class="text-[11px] font-medium text-gray-500 mb-1">Status</p>
            <h3 class="text-2xl font-bold text-gray-900">{{ orderRecord?.status || 'Ready' }}</h3>
          </div>
        </div>

        <!-- Dynamic Panel Content based on activeTab -->
        <div class="bg-[#fbfcfc] border border-gray-100 rounded-xl p-6">
          <h3 class="text-sm font-bold text-gray-900 mb-4">{{ adminTabData.title }}</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div v-for="(item, idx) in adminTabData.items" :key="idx" class="bg-white border border-gray-100 rounded-lg p-3.5 shadow-sm flex flex-col justify-between">
              <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{{ item.label }}</span>
              <span class="text-xs font-bold text-gray-900 mt-1 break-words">{{ item.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <CreateSaleModal v-if="showEditModal" @close="showEditModal = false" />
</template>
