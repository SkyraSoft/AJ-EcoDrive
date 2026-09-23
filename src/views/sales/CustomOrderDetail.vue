<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ChevronDown, Check, ArrowLeft, Phone, Mail, MapPin, Calendar, Clock, DollarSign, ShieldCheck, FileText, User } from 'lucide-vue-next'
import { store } from '@/store'
import CreateCustomOrderModal from './CreateCustomOrder.vue'

const router = useRouter()
const route = useRoute()
const showEditModal = ref(false)
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const activeTab = ref('Requirement')

const tabs = [
  'Requirement',
  'Customer',
  'Deposit',
  'Product or Product Request',
  'Stock Request',
  'Arrival',
  'Reservation',
  'Sale',
  'Communication',
  'Activity'
]

const orderData = ref({
  orderNo: 'CO-118',
  status: 'Sourcing',
  statusClass: 'bg-[#fef3c7] text-[#b45309]',
  statusColor: 'bg-yellow-50 text-yellow-700',
  customer: 'Jawad Khan',
  phone: '+92 300 9876543',
  cnic: '17301-8899221-3',
  city: 'Peshawar',
  requirement: 'BRG X7 / Black',
  product: 'BRG X7 / Black',
  branch: 'Peshawar',
  budget: 'PKR 360,000',
  deposit: 'PKR 100,000',
  balance: 'PKR 260,000',
  desiredDate: '15 Sep 2026',
  eta: '15 Sep 2026',
  productRequest: 'PR-088',
  stockRequest: 'SR-122',
  reservation: 'Pending arrival',
  owner: 'Hamza',
  notes: 'Customer accepts equivalent trim if approved'
})

const loadOrder = () => {
  const paramId = route.params.id || route.query.id
  const found = (paramId && store.getCustomOrderById(paramId)) || store.customOrders[0]
  if (found) {
    orderData.value = { ...orderData.value, ...found }
  }
}

onMounted(() => {
  loadOrder()
})

const handleEdit = () => {
  store.originalEditCustomOrder = { ...orderData.value }
  showEditModal.value = true
}

const handleOrderUpdated = (updatedRecord) => {
  const updated = store.updateCustomOrder(updatedRecord.orderNo || updatedRecord.id, updatedRecord)
  if (updated) {
    orderData.value = { ...orderData.value, ...updated }
  }
  showEditModal.value = false
}

const backToList = () => {
  router.push('/sales/custom-orders')
}
</script>

<template>
  <!-- BRANCH MANAGER VIEW -->
  <div v-if="isBranchUser" class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[11px] text-gray-400 mb-1">
          Branch Manager / Custom Orders / <span class="font-medium text-gray-600">Custom Order {{ orderData.orderNo }}</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Custom Order {{ orderData.orderNo }}</h1>
        <p class="text-xs text-gray-500 mt-1">Custom order detail — {{ activeTab }}.</p>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="border-b border-gray-100 flex items-center gap-6 overflow-x-auto no-scrollbar">
      <button 
        v-for="tab in tabs" 
        :key="tab"
        @click="activeTab = tab"
        :class="[
          'text-xs whitespace-nowrap pb-3 transition-colors cursor-pointer',
          activeTab === tab 
            ? 'text-[#165A31] font-bold border-b-2 border-[#165A31]' 
            : 'text-gray-500 hover:text-gray-800 font-medium'
        ]"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Tab 1: Requirement (Matching Screenshot 3) -->
    <div v-if="activeTab === 'Requirement'" class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <!-- Left Card: Requirement -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
        <h3 class="text-sm font-bold text-gray-900 mb-4">Requirement</h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <!-- Box 1: Status -->
          <div class="bg-[#fbfbfc] border border-gray-100 rounded-lg p-3.5 space-y-1">
            <span class="text-[10px] text-gray-400 font-medium block">Status</span>
            <span class="text-xs font-bold text-gray-900 block">{{ orderData.status }}</span>
          </div>

          <!-- Box 2: Customer -->
          <div class="bg-[#fbfbfc] border border-gray-100 rounded-lg p-3.5 space-y-1">
            <span class="text-[10px] text-gray-400 font-medium block">Customer</span>
            <span class="text-xs font-bold text-gray-900 block">{{ orderData.customer }}</span>
          </div>

          <!-- Box 3: Requirement -->
          <div class="bg-[#fbfbfc] border border-gray-100 rounded-lg p-3.5 space-y-1">
            <span class="text-[10px] text-gray-400 font-medium block">Requirement</span>
            <span class="text-xs font-bold text-gray-900 block">{{ orderData.requirement }}</span>
          </div>

          <!-- Box 4: Budget -->
          <div class="bg-[#fbfbfc] border border-gray-100 rounded-lg p-3.5 space-y-1">
            <span class="text-[10px] text-gray-400 font-medium block">Budget</span>
            <span class="text-xs font-bold text-gray-900 block">{{ orderData.budget }}</span>
          </div>

          <!-- Box 5: Deposit -->
          <div class="bg-[#fbfbfc] border border-gray-100 rounded-lg p-3.5 space-y-1">
            <span class="text-[10px] text-gray-400 font-medium block">Deposit</span>
            <span class="text-xs font-bold text-gray-900 block">{{ orderData.deposit }}</span>
          </div>

          <!-- Box 6: Desired Date -->
          <div class="bg-[#fbfbfc] border border-gray-100 rounded-lg p-3.5 space-y-1">
            <span class="text-[10px] text-gray-400 font-medium block">Desired Date</span>
            <span class="text-xs font-bold text-gray-900 block">{{ orderData.desiredDate }}</span>
          </div>
        </div>
      </div>

      <!-- Right Card: Related information -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
        <h3 class="text-sm font-bold text-gray-900 mb-4">Related information</h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <!-- Box 1: Product Request -->
          <div class="bg-[#fbfbfc] border border-gray-100 rounded-lg p-3.5 space-y-1">
            <span class="text-[10px] text-gray-400 font-medium block">Product Request</span>
            <span class="text-xs font-bold text-gray-900 block">{{ orderData.productRequest }}</span>
          </div>

          <!-- Box 2: Stock Request -->
          <div class="bg-[#fbfbfc] border border-gray-100 rounded-lg p-3.5 space-y-1">
            <span class="text-[10px] text-gray-400 font-medium block">Stock Request</span>
            <span class="text-xs font-bold text-gray-900 block">{{ orderData.stockRequest }}</span>
          </div>

          <!-- Box 3: Reservation -->
          <div class="bg-[#fbfbfc] border border-gray-100 rounded-lg p-3.5 space-y-1">
            <span class="text-[10px] text-gray-400 font-medium block">Reservation</span>
            <span class="text-xs font-bold text-gray-900 block">{{ orderData.reservation }}</span>
          </div>

          <!-- Box 4: Owner -->
          <div class="bg-[#fbfbfc] border border-gray-100 rounded-lg p-3.5 space-y-1">
            <span class="text-[10px] text-gray-400 font-medium block">Owner</span>
            <span class="text-xs font-bold text-gray-900 block">{{ orderData.owner }}</span>
          </div>
        </div>

        <p class="text-[11px] text-gray-400 mt-5 leading-relaxed">
          This view is scoped only to Peshawar Branch. Actions that require company-wide approval remain with management.
        </p>
      </div>
    </div>

    <!-- Tab 2: Customer -->
    <div v-else-if="activeTab === 'Customer'" class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
        <h3 class="text-sm font-bold text-gray-900 mb-2">Customer Profile</h3>
        <div class="space-y-3 text-xs">
          <div class="flex justify-between py-2 border-b border-gray-50">
            <span class="text-gray-400">Full Name</span>
            <span class="font-semibold text-gray-900">{{ orderData.customer }}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-gray-50">
            <span class="text-gray-400">Contact Number</span>
            <span class="font-semibold text-gray-900">{{ orderData.phone }}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-gray-50">
            <span class="text-gray-400">CNIC / Identification</span>
            <span class="font-semibold text-gray-900">{{ orderData.cnic }}</span>
          </div>
          <div class="flex justify-between py-2">
            <span class="text-gray-400">City / Region</span>
            <span class="font-semibold text-gray-900">{{ orderData.city }}</span>
          </div>
        </div>
      </div>
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
        <h3 class="text-sm font-bold text-gray-900 mb-2">Order History</h3>
        <p class="text-xs text-gray-500">Customer has 1 prior fulfilled delivery and 1 open custom order.</p>
        <div class="p-3.5 bg-gray-50 rounded-lg text-xs space-y-1">
          <div class="font-semibold text-gray-900">Total Sourced Value</div>
          <div class="text-sm font-bold text-[#165A31]">{{ orderData.budget }}</div>
        </div>
      </div>
    </div>

    <!-- Tab 3: Deposit -->
    <div v-else-if="activeTab === 'Deposit'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
      <h3 class="text-sm font-bold text-gray-900 mb-2">Deposit & Commercial Summary</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="p-4 bg-[#fbfbfc] border border-gray-100 rounded-lg">
          <span class="text-[11px] text-gray-400 block">Advance Deposit</span>
          <span class="text-xl font-bold text-[#165A31] block mt-1">{{ orderData.deposit }}</span>
          <span class="text-[10px] text-emerald-600 font-medium">Cleared via Bank Transfer</span>
        </div>
        <div class="p-4 bg-[#fbfbfc] border border-gray-100 rounded-lg">
          <span class="text-[11px] text-gray-400 block">Total Quoted Budget</span>
          <span class="text-xl font-bold text-gray-900 block mt-1">{{ orderData.budget }}</span>
          <span class="text-[10px] text-gray-400 font-medium">Agreed specification</span>
        </div>
        <div class="p-4 bg-[#fbfbfc] border border-gray-100 rounded-lg">
          <span class="text-[11px] text-gray-400 block">Balance Upon Handover</span>
          <span class="text-xl font-bold text-amber-700 block mt-1">{{ orderData.balance }}</span>
          <span class="text-[10px] text-gray-400 font-medium">Due at delivery scan</span>
        </div>
      </div>
    </div>

    <!-- Tab 4: Product or Product Request -->
    <div v-else-if="activeTab === 'Product or Product Request'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
      <h3 class="text-sm font-bold text-gray-900 mb-2">Product Request Detail</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="p-4 bg-gray-50 rounded-lg space-y-2">
          <div class="text-gray-400">Product Request ID</div>
          <div class="text-sm font-bold text-gray-900">{{ orderData.productRequest }}</div>
          <div class="text-gray-500">Requested for Peshawar branch direct delivery.</div>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg space-y-2">
          <div class="text-gray-400">Assigned Specification</div>
          <div class="text-sm font-bold text-[#165A31]">{{ orderData.requirement }}</div>
          <div class="text-gray-500">Batch Code: BATCH-2026-09-B</div>
        </div>
      </div>
    </div>

    <!-- Tab 5: Stock Request -->
    <div v-else-if="activeTab === 'Stock Request'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
      <h3 class="text-sm font-bold text-gray-900 mb-2">Stock Request Tracking</h3>
      <div class="p-4 bg-[#fbfbfc] border border-gray-100 rounded-lg space-y-3 text-xs">
        <div class="flex justify-between items-center">
          <span class="font-bold text-gray-900">{{ orderData.stockRequest }}</span>
          <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">Approved</span>
        </div>
        <p class="text-gray-500">Route: Central Warehouse &rarr; Peshawar Branch</p>
      </div>
    </div>

    <!-- Tab 6: Arrival -->
    <div v-else-if="activeTab === 'Arrival'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
      <h3 class="text-sm font-bold text-gray-900 mb-2">Inbound Arrival Logistics</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="p-4 bg-gray-50 rounded-lg space-y-1">
          <div class="text-gray-400">Estimated Arrival</div>
          <div class="text-sm font-bold text-gray-900">{{ orderData.desiredDate }}</div>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg space-y-1">
          <div class="text-gray-400">Receiving Bay</div>
          <div class="text-sm font-bold text-[#165A31]">Peshawar Inbound Bay 2</div>
        </div>
      </div>
    </div>

    <!-- Tab 7: Reservation -->
    <div v-else-if="activeTab === 'Reservation'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
      <h3 class="text-sm font-bold text-gray-900 mb-2">Reservation & Allocation</h3>
      <p class="text-xs text-gray-600">Unit will be automatically reserved for <strong>{{ orderData.customer }}</strong> immediately upon scanning the serial number at arrival dock.</p>
      <div class="p-4 bg-amber-50/60 border border-amber-200/60 rounded-lg text-xs text-amber-800">
        Status: <strong>{{ orderData.reservation }}</strong>
      </div>
    </div>

    <!-- Tab 8: Sale -->
    <div v-else-if="activeTab === 'Sale'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
      <h3 class="text-sm font-bold text-gray-900 mb-2">Sale Conversion</h3>
      <div class="flex justify-between items-center text-xs py-2 border-b border-gray-50">
        <span class="text-gray-500">Draft Order</span>
        <span class="font-bold text-gray-900">ORD-AUTO-PENDING</span>
      </div>
      <div class="flex justify-between items-center text-xs py-2">
        <span class="text-gray-500">Final Price</span>
        <span class="font-bold text-[#165A31]">{{ orderData.budget }}</span>
      </div>
    </div>

    <!-- Tab 9: Communication -->
    <div v-else-if="activeTab === 'Communication'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
      <h3 class="text-sm font-bold text-gray-900 mb-2">Customer Communication Log</h3>
      <div class="space-y-3 text-xs">
        <div class="p-3 bg-gray-50 rounded-lg space-y-1">
          <div class="flex justify-between text-[11px] text-gray-400">
            <span>WhatsApp / SMS Notification</span>
            <span>10 Sep 2026, 14:20</span>
          </div>
          <p class="text-gray-700">Advance deposit receipt of PKR 100,000 sent to customer mobile.</p>
        </div>
      </div>
    </div>

    <!-- Tab 10: Activity -->
    <div v-else-if="activeTab === 'Activity'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
      <h3 class="text-sm font-bold text-gray-900 mb-2">Activity & Audit Trail</h3>
      <div class="space-y-3 text-xs">
        <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div class="w-2 h-2 rounded-full bg-[#165A31]"></div>
          <div class="flex-1">
            <span class="font-semibold text-gray-800">Custom Order Created</span>
            <span class="text-gray-400 block text-[10px]">By Hamza · Peshawar Branch</span>
          </div>
          <span class="text-[10px] text-gray-400">10 Sep 2026</span>
        </div>
      </div>
    </div>
  </div>

  <!-- SUPER ADMIN VIEW -->
  <div v-else class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-8">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Sales & CRM / Custom Orders / <span class="font-bold text-gray-800">Custom Order Detail</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Custom Order Detail</h1>
        <p class="text-sm text-gray-500 mt-1">Connect a customer requirement to quotation, deposit, stock/procurement and final sale.</p>
      </div>
    </div>

    <!-- Status Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 rounded-xl">
      <div>
        <h2 class="text-xl font-bold text-gray-900">{{ orderData.orderNo }}</h2>
        <p class="text-[12px] text-gray-500 mt-1">{{ orderData.customer }} · {{ orderData.requirement || orderData.product }} · {{ orderData.branch }}</p>
      </div>
      <div class="flex items-center gap-3">
        <span :class="['inline-flex items-center px-2 py-1 rounded-[4px] text-[10px] font-bold', orderData.statusColor || orderData.statusClass]">
          {{ orderData.status }}
        </span>
        <button @click="handleEdit" class="px-4 py-2 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer">
          Update Custom Order
        </button>
        <button class="px-3 py-2 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center gap-1 cursor-pointer">
          More <ChevronDown class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- Financial Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="p-5 bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <p class="text-[11px] font-medium text-gray-500 mb-1">Deposit</p>
        <h3 class="text-2xl font-bold text-gray-900">{{ orderData.deposit }}</h3>
      </div>
      <div class="p-5 bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <p class="text-[11px] font-medium text-gray-500 mb-1">Quoted Price</p>
        <h3 class="text-2xl font-bold text-gray-900">{{ orderData.budget || orderData.total }}</h3>
      </div>
      <div class="p-5 bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <p class="text-[11px] font-medium text-gray-500 mb-1">Balance</p>
        <h3 class="text-2xl font-bold text-gray-900">{{ orderData.balance || 'PKR 0' }}</h3>
      </div>
      <div class="p-5 bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <p class="text-[11px] font-medium text-gray-500 mb-1">ETA</p>
        <h3 class="text-2xl font-bold text-gray-900">{{ orderData.desiredDate || orderData.eta }}</h3>
      </div>
    </div>

    <!-- Details Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-4 border-b border-gray-50 pb-3">Requirement</h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Product / Requirement</span>
            <span class="font-bold text-gray-900">{{ orderData.product || orderData.requirement }}</span>
          </div>
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Customer</span>
            <span class="font-bold text-gray-900">{{ orderData.customer }}</span>
          </div>
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Customer Need</span>
            <span class="font-bold text-gray-900">{{ orderData.notes || 'Standard Delivery' }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-4 border-b border-gray-50 pb-3">Fulfilment</h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Source Request</span>
            <span class="font-bold text-gray-900">{{ orderData.productRequest || 'PO-2049' }}</span>
          </div>
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Reservation</span>
            <span class="font-bold text-gray-900">{{ orderData.reservation || 'On receipt' }}</span>
          </div>
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Expected</span>
            <span class="font-bold text-gray-900">{{ orderData.desiredDate || orderData.eta }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Timeline -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
      <h3 class="text-[14px] font-bold text-gray-900 mb-4 border-b border-gray-50 pb-3">Communication & Activity</h3>
      <div class="space-y-4 relative pl-4 mt-4">
        <div class="absolute top-2 bottom-2 left-0 w-[2px] bg-gray-100"></div>
        
        <div class="relative flex items-center justify-between">
          <div class="absolute -left-4 w-[2px] h-full bg-[#eefcf2]"></div>
          <span class="text-[12px] font-bold text-gray-900 pl-4">Product / PO Request linked</span>
          <span class="text-[11px] text-gray-500">Recent</span>
        </div>
        
        <div class="relative flex items-center justify-between">
          <div class="absolute -left-4 w-[2px] h-full bg-[#eefcf2]"></div>
          <span class="text-[12px] font-bold text-gray-900 pl-4">Deposit of {{ orderData.deposit }} received</span>
          <span class="text-[11px] text-gray-500">Recorded</span>
        </div>

        <div class="relative flex items-center justify-between">
          <div class="absolute -left-4 w-[2px] h-full bg-[#eefcf2]"></div>
          <span class="text-[12px] font-bold text-gray-900 pl-4">Custom order created for {{ orderData.customer }}</span>
          <span class="text-[11px] text-gray-500">{{ orderData.desiredDate }}</span>
        </div>
      </div>
    </div>
    
    <CreateCustomOrderModal 
      v-if="showEditModal" 
      :is-modal="true" 
      :custom-order="orderData"
      @close="showEditModal = false" 
      @updated="handleOrderUpdated"
    />
  </div>
</template>
