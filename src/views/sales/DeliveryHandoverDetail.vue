<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { store } from '@/store'
import { CheckCircle2, ArrowLeft } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const rawId = computed(() => route.params.id || route.query.id || 'DEL-2241')
const deliveryRecord = computed(() => store.getDeliveryById(rawId.value) || (route.query.id ? null : store.deliveries[0]))
const orderRecord = computed(() => deliveryRecord.value?.order ? store.getOrderById(deliveryRecord.value.order) : null)

const showToast = ref(false)
const toastMessage = ref('')

const orderId = computed(() => deliveryRecord.value?.order || deliveryRecord.value?.order_id || rawId.value)
const customerName = computed(() => deliveryRecord.value?.customer || route.query.customer || 'Ahsan Khan')
const unitCode = computed(() => deliveryRecord.value?.unit || deliveryRecord.value?.unit_id || route.query.unit || 'CH 8-BRG-26-01731')
const scheduledTime = computed(() => deliveryRecord.value?.scheduled || deliveryRecord.value?.scheduledTime || route.query.scheduled || 'Today 16:00')
const status = computed(() => deliveryRecord.value?.status || route.query.status || 'Ready')

const branchCurrentTab = ref('Handover Details')
const branchTabs = ['Handover Details', 'Checklist', 'Unit & Battery', 'Customer & Payment', 'Documents', 'Activity']

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
  const idToComplete = deliveryRecord.value.delivery_id || deliveryRecord.value.id || rawId.value
  const res = store.completeDelivery(idToComplete)
  if (res.success) {
    toastMessage.value = `Handover completed successfully! Unit marked Delivered and warranty WAR-101 active.`
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 4000)
  }
}
</script>

<template>
  <div v-if="!deliveryRecord" class="max-w-[1400px] mx-auto py-16 text-center space-y-4">
    <h2 class="text-2xl font-bold text-gray-900">Delivery Handover Record Not Found</h2>
    <p class="text-sm text-gray-500">No delivery or handover record matches identifier "{{ rawId }}".</p>
    <button @click="router.push('/sales/delivery')" class="inline-flex items-center gap-2 px-4 py-2 bg-[#165A31] text-white text-xs font-bold rounded-lg hover:bg-[#124a28]">
      <ArrowLeft class="w-4 h-4" /> Back to Delivery List
    </button>
  </div>

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
  </div>
</template>
