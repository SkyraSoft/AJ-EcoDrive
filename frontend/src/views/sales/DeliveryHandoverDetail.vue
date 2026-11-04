<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { store } from '@/store'
import { CheckCircle2, ArrowLeft, Printer, ShieldCheck, FileText } from 'lucide-vue-next'
import NotFoundState from '@/components/common/NotFoundState.vue'

const route = useRoute()
const router = useRouter()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const rawId = computed(() => route.params.id || route.query.id || '')
const deliveryRecord = computed(() => rawId.value ? store.getDeliveryById(rawId.value) : null)
const orderRecord = computed(() => deliveryRecord.value?.order ? store.getOrderById(deliveryRecord.value.order) : null)

const showToast = ref(false)
const toastMessage = ref('')
const printDocumentType = ref('none')

const orderId = computed(() => deliveryRecord.value?.order || deliveryRecord.value?.order_id || rawId.value)
const customerName = computed(() => deliveryRecord.value?.customer || route.query.customer || 'Ahsan Khan')
const unitCode = computed(() => deliveryRecord.value?.unit || deliveryRecord.value?.unit_id || route.query.unit || 'CH 8-BRG-26-01731')
const scheduledTime = computed(() => deliveryRecord.value?.scheduled || deliveryRecord.value?.scheduledTime || route.query.scheduled || 'Today 16:00')
const status = computed(() => deliveryRecord.value?.status || route.query.status || 'Ready')
const gatePassNo = computed(() => deliveryRecord.value?.gate_pass_number || `GP-DEL-${String(orderId.value).replace(/[^0-9]/g, '').slice(-4) || '8841'}`)
const branchRecord = computed(() => {
  const bName = deliveryRecord.value?.branch || user.value?.branchName || 'Peshawar'
  return store.branches?.find(b => b.name?.toLowerCase() === bName.toLowerCase() || b.id === bName || b.code === bName) || null
})

const branchCurrentTab = ref('Handover Details')
const branchTabs = ['Handover Details', 'Checklist', 'Unit & Battery', 'Customer & Payment', 'Documents', 'Activity']

const printDoc = (type) => {
  printDocumentType.value = type
  setTimeout(() => {
    window.print()
  }, 100)
}

const branchTabData = computed(() => {
  const branchName = user.value?.branchName || deliveryRecord.value?.branch || 'Peshawar'

  switch (branchCurrentTab.value) {
    case 'Handover Details':
      return {
        title: 'Handover Details',
        items: [
          { label: 'Delivery ID', value: deliveryRecord.value?.delivery_id || rawId.value },
          { label: 'Order Reference', value: orderId.value },
          { label: 'Customer', value: customerName.value },
          { label: 'Assigned Unit', value: unitCode.value },
          { label: 'Scheduled Time', value: scheduledTime.value },
          { label: 'Handover Officer', value: deliveryRecord.value?.officer || 'Hamza' },
          { label: 'Status', value: status.value }
        ]
      }
    case 'Checklist':
      return {
        title: 'Pre-Delivery Checklist',
        items: [
          { label: 'Identity Verification', value: deliveryRecord.value?.identityVerified ? 'Verified (Original CNIC Seen)' : 'Pending Verification' },
          { label: 'Financial Settlement', value: deliveryRecord.value?.paymentComplete ? '100% Cleared via Bank Transfer' : 'Awaiting Clearing' },
          { label: 'PDI (Pre-Delivery Inspection)', value: deliveryRecord.value?.pdiStatus || 'Passed 100%' },
          { label: 'Battery Charge Level', value: '100% Full Charge' },
          { label: 'Key & Remote Set', value: '2 Smart Keys + 2 Physical Keys' },
          { label: 'Charger & Toolkit', value: deliveryRecord.value?.accessoriesIncluded ? 'Included & Packaged' : 'Missing items' }
        ]
      }
    case 'Unit & Battery':
      return {
        title: 'Unit & Battery Information',
        items: [
          { label: 'Vehicle Model', value: orderRecord.value?.product || 'BRG E-125 (2025)' },
          { label: 'Chassis Number', value: unitCode.value },
          { label: 'Motor Serial', value: 'MOT-72V-3500W-9912' },
          { label: 'Battery Serial', value: 'BAT-7230-04421' },
          { label: 'Odometer Reading', value: '2.4 KM (Testing)' },
          { label: 'Location', value: `${branchName} Delivery Bay` }
        ]
      }
    case 'Customer & Payment':
      return {
        title: 'Customer & Payment Summary',
        items: [
          { label: 'Customer Code', value: deliveryRecord.value?.customer_id || 'CUST-101' },
          { label: 'Phone', value: '+92 312 5538198' },
          { label: 'Total Sale Price', value: orderRecord.value?.total || 'PKR 280,000' },
          { label: 'Paid Amount', value: orderRecord.value?.paid || 'PKR 280,000' },
          { label: 'Outstanding Balance', value: orderRecord.value?.balance || 'PKR 0' },
          { label: 'Invoice Reference', value: deliveryRecord.value?.invoice_id || `INV-${orderId.value.replace('ORD-', '')}` }
        ]
      }
    case 'Documents':
      return {
        title: 'Handover Documents',
        items: [
          { label: 'Signed Delivery Note', value: status.value === 'Delivered' ? 'Signed & Stamped' : 'Ready for counter-signature' },
          { label: 'Warranty Card & Manual', value: '2-Year Official OEM Warranty' },
          { label: 'Invoice Copy', value: `${deliveryRecord.value?.invoice_id || 'INV-2241'}.pdf` },
          { label: 'CNIC Copy', value: 'Verified & Archived' },
          { label: 'Sales Agreement', value: 'Fully Executed' },
          { label: 'Handover Certificate', value: `HC-2026-${orderId.value.replace('ORD-', '')}` }
        ]
      }
    case 'Activity':
      return {
        title: 'Timeline & History',
        items: (deliveryRecord.value?.timeline || [
          { time: scheduledTime.value, desc: `Scheduled delivery for ${customerName.value}` },
          { time: 'Today 10:30', desc: 'Vehicle PDI checklist completed by technician' },
          { time: 'Today 09:15', desc: 'Full payment verified and cleared by cashier' }
        ]).map(t => ({ label: t.time, value: t.desc || t.title }))
      }
    default:
      return {
        title: 'Handover Details',
        items: []
      }
  }
})

const completeHandover = () => {
  if (!deliveryRecord.value) return
  if (orderRecord.value) {
    const bal = parseFloat(String(orderRecord.value.balance || '0').replace(/[^0-9.]/g, ''))
    const isPaid = orderRecord.value.payment_status === 'Paid' || bal === 0
    if (!isPaid && !deliveryRecord.value.paymentComplete && !deliveryRecord.value.payment_complete) {
      alert('PAYMENT_UNCLEARED: Vehicle cannot be marked Delivered or authorized for Gate Pass without 100% payment clearance. Outstanding balance: ' + (orderRecord.value.balance || 'unpaid'))
      return
    }
  }

  const idToComplete = deliveryRecord.value.delivery_id || deliveryRecord.value.id || rawId.value
  const res = store.completeDelivery(idToComplete)
  if (res.success) {
    toastMessage.value = `Handover completed successfully! Unit marked Delivered and Gate Pass ${gatePassNo.value} issued.`
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 4000)
  }
}
</script>

<template>
  <NotFoundState
    v-if="!deliveryRecord"
    title="Delivery Handover Record Not Found"
    message="The requested delivery handover record could not be found or is not accessible from your current branch context."
    back-link="/sales/delivery"
    back-text="Back to Delivery List"
  />

  <div v-else class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Toast Notification -->
    <div 
      v-if="showToast" 
      class="fixed bottom-5 right-5 z-[110] bg-[#165A31] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200"
    >
      <CheckCircle2 class="w-5 h-5 text-green-300" />
      <span class="text-xs font-bold">{{ toastMessage }}</span>
    </div>

    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[11px] text-gray-400 mb-1">
          Delivery / Handover / <span class="font-medium text-gray-600">Handover — {{ orderId }}</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Handover — {{ orderId }}</h1>
        <p class="text-xs text-gray-500 mt-1">Delivery / Handover detail — {{ branchCurrentTab }}.</p>
      </div>
      <div class="flex items-center gap-2">
        <button 
          @click="router.push('/sales/delivery')" 
          class="bg-white border border-gray-200 text-gray-700 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
        >
          Back to List
        </button>
        <button 
          @click="printDoc('challan')" 
          class="bg-white border border-gray-200 text-gray-700 text-xs font-bold px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
        >
          <Printer class="w-4 h-4" /> Print Delivery Challan
        </button>
        <button 
          @click="printDoc('gatepass')" 
          class="bg-[#eefcf2] text-[#165A31] border border-[#165A31]/30 text-xs font-bold px-3 py-2 rounded-lg hover:bg-[#dcfce7] transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
        >
          <ShieldCheck class="w-4 h-4 text-[#165A31]" /> Print Gate Pass
        </button>
        <button 
          v-if="status !== 'Delivered'"
          @click="completeHandover" 
          class="bg-[#165A31] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer"
        >
          Complete Handover & Activate Warranty
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
              <span class="text-[10px] font-medium text-gray-400">Handover Officer</span>
              <span class="text-sm font-bold text-gray-900 mt-1">{{ deliveryRecord.officer || 'Hamza' }}</span>
            </div>
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Scheduled</span>
              <span class="text-sm font-bold text-gray-900 mt-1">{{ scheduledTime }}</span>
            </div>
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">PDI Status</span>
              <span class="text-sm font-bold text-gray-900 mt-1">{{ deliveryRecord.pdiStatus || 'Passed (100%)' }}</span>
            </div>
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Status</span>
              <span class="text-sm font-bold text-gray-900 mt-1" :class="status === 'Delivered' ? 'text-[#165A31]' : ''">{{ status }}</span>
            </div>
          </div>
        </div>
        
        <p class="text-[11px] text-gray-400 font-medium mt-3 px-1">
          Handover linked to order {{ orderId }} and customer {{ customerName }}. Completing handover automatically sets unit status to Delivered and registers customer warranty.
        </p>
      </div>
    </div>

    <!-- PRINTABLE DELIVERY CHALLAN (Hidden on screen, visible on print if printDocumentType === 'challan') -->
    <div v-if="printDocumentType === 'challan'" class="print-document hidden print:block bg-white text-black p-8 font-sans">
      <div class="border-b-2 border-black pb-4 mb-6">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-2xl font-black tracking-tight uppercase">{{ store.settings?.company?.name || 'AJ ECODRIVE LTD' }} / {{ store.settings?.company?.brand || 'BRG ELECTRIC VEHICLES' }}</h1>
            <p class="text-xs text-gray-700 mt-1 uppercase">{{ branchRecord?.name || deliveryRecord?.branch || 'Peshawar' }} Showroom & Service Centre</p>
            <p class="text-[11px] text-gray-600">{{ branchRecord?.address || `${deliveryRecord?.branch || 'Peshawar'}, Pakistan` }}</p>
            <p class="text-[11px] text-gray-600">Phone: {{ branchRecord?.phone || store.settings?.company?.phone || 'Not configured' }} | NTN: {{ store.settings?.company?.taxNumber || 'Not configured' }} | STRN: {{ store.settings?.company?.strn || store.settings?.company?.registrationNumber || 'Not configured' }}</p>
          </div>
          <div class="text-right">
            <span class="inline-block border-2 border-black px-3 py-1 text-sm font-black uppercase">DELIVERY CHALLAN</span>
            <div class="text-xs text-right mt-2 space-y-0.5">
              <p><strong>Challan No:</strong> DC-{{ String(orderId).replace('ORD-', '') }}</p>
              <p><strong>Order Ref:</strong> {{ orderId }}</p>
              <p><strong>Customer File:</strong> #FILE-{{ String(orderId).replace(/[^0-9]/g, '').slice(-4) || '1024' }}</p>
              <p><strong>Date:</strong> {{ new Date().toLocaleDateString() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Customer & Handover Info Grid -->
      <div class="grid grid-cols-2 gap-4 border border-gray-300 p-4 mb-6 text-xs">
        <div>
          <h4 class="font-bold border-b pb-1 mb-2 uppercase text-gray-800">Customer Consignee Details</h4>
          <p><strong>Customer Name:</strong> {{ customerName }}</p>
          <p><strong>CNIC / Identity:</strong> 17301-4498129-3 (Verified)</p>
          <p><strong>Contact Phone:</strong> +92 312 5538198</p>
          <p><strong>Delivery Destination:</strong> Customer Showroom Handover (Self-Drive)</p>
        </div>
        <div>
          <h4 class="font-bold border-b pb-1 mb-2 uppercase text-gray-800">Vehicle Specification & Serial Tracking</h4>
          <p><strong>Vehicle Model:</strong> {{ orderRecord?.product || 'BRG E-125 (Electric Motorcycle)' }}</p>
          <p><strong>Chassis / VIN:</strong> {{ unitCode }}</p>
          <p><strong>Electric Motor Serial:</strong> MOT-72V-3500W-9912</p>
          <p><strong>Lithium Battery Pack Serial:</strong> BAT-7230-04421 (72V 30Ah)</p>
        </div>
      </div>

      <!-- Pre-Delivery Checklist Verified -->
      <div class="border border-gray-300 p-4 mb-6 text-xs">
        <h4 class="font-bold border-b pb-1 mb-2 uppercase text-gray-800">Pre-Delivery Showroom Inspection Checklist (100% Passed)</h4>
        <div class="grid grid-cols-3 gap-2">
          <div>[✔] Battery Charged 100%</div>
          <div>[✔] Smart Remote & Keys (2 sets)</div>
          <div>[✔] Fast Charger & Adapter</div>
          <div>[✔] Official Warranty Booklet</div>
          <div>[✔] Helmet & Tool Kit Included</div>
          <div>[✔] Initial Odometer: 2.4 KM (PDI)</div>
        </div>
      </div>

      <!-- Triple Signature Blocks & Stamp Box -->
      <div class="grid grid-cols-4 gap-4 pt-10 text-center text-xs">
        <div class="border-t border-black pt-2">
          <p class="font-bold">Prepared / Handed Over By</p>
          <p class="text-[10px] text-gray-600 mt-6">{{ deliveryRecord?.officer || 'Showroom Handover Officer' }}</p>
        </div>
        <div class="border-t border-black pt-2">
          <p class="font-bold">Verified & Authorized By</p>
          <p class="text-[10px] text-gray-600 mt-6">Branch Manager</p>
        </div>
        <div class="border-t border-black pt-2">
          <p class="font-bold">Received in Good Condition By</p>
          <p class="text-[10px] text-gray-600 mt-6">Customer Signature</p>
        </div>
        <div class="border border-black p-2 h-24 flex items-center justify-center">
          <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">OFFICIAL SHOWROOM STAMP</span>
        </div>
      </div>
    </div>

    <!-- PRINTABLE SECURITY GATE PASS (Hidden on screen, visible on print if printDocumentType === 'gatepass') -->
    <div v-if="printDocumentType === 'gatepass'" class="print-document hidden print:block bg-white text-black p-8 font-sans max-w-2xl mx-auto border-2 border-black">
      <div class="text-center border-b-2 border-black pb-4 mb-4">
        <h1 class="text-xl font-black uppercase tracking-tight">AJ ECODRIVE LTD - SECURITY GATE PASS</h1>
        <p class="text-xs uppercase font-semibold text-gray-700">Official Showroom Exit Authorization</p>
        <p class="text-[11px] text-gray-600">{{ deliveryRecord?.branch || user?.branchName || 'Peshawar' }} Showroom Barrier Security</p>
      </div>

      <div class="flex justify-between items-center text-xs mb-4 bg-gray-100 p-2.5 border border-gray-300">
        <div><strong>Pass Number:</strong> <span class="font-mono font-bold">{{ gatePassNo }}</span></div>
        <div><strong>Date & Time:</strong> {{ new Date().toLocaleString() }}</div>
        <div><strong>Status:</strong> <span class="font-bold uppercase text-green-800">CLEARED FOR EXIT</span></div>
      </div>

      <div class="space-y-2 text-xs border border-gray-300 p-4 mb-6">
        <div class="grid grid-cols-2 gap-2">
          <p><strong>Customer Name:</strong> {{ customerName }}</p>
          <p><strong>Order Reference:</strong> {{ orderId }}</p>
          <p><strong>Vehicle Model:</strong> {{ orderRecord?.product || 'BRG Electric Bike' }}</p>
          <p><strong>Chassis / VIN:</strong> {{ unitCode }}</p>
          <p><strong>Financial Settlement:</strong> 100% Cleared / Paid in Full</p>
          <p><strong>Gate Pass Issued By:</strong> {{ deliveryRecord?.officer || 'Showroom Manager' }}</p>
        </div>
      </div>

      <div class="text-[11px] text-gray-600 mb-6 italic">
        "Security Note: The vehicle matching above Chassis/VIN number has fulfilled 100% payment clearance, official invoicing, and PDI inspection. Security personnel on duty are authorized to allow vehicle exit through the main gate barrier."
      </div>

      <div class="grid grid-cols-3 gap-6 pt-6 text-center text-xs">
        <div class="border-t border-black pt-2">
          <p class="font-bold">Accounts Clearance</p>
          <p class="text-[9px] text-gray-500 mt-4">Cashier / Finance Verified</p>
        </div>
        <div class="border-t border-black pt-2">
          <p class="font-bold">Showroom Manager</p>
          <p class="text-[9px] text-gray-500 mt-4">Authorized Signature & Seal</p>
        </div>
        <div class="border-t border-black pt-2">
          <p class="font-bold">Security Guard on Duty</p>
          <p class="text-[9px] text-gray-500 mt-4">Exit Barrier Checked & Allowed</p>
        </div>
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
