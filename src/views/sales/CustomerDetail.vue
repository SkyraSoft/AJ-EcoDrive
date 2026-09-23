<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  FileText, 
  ShieldCheck, 
  Clock, 
  Pencil, 
  Plus, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  DollarSign,
  Package,
  Wrench
} from 'lucide-vue-next'
import { store } from '@/store'
import CreateCustomerModal from './CreateCustomer.vue'
import CreateSaleModal from './CreateSale.vue'
import CreateQuotationModal from './CreateQuotation.vue'
import CreatePaymentModal from './CreatePayment.vue'

const route = useRoute()
const router = useRouter()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

// Resolve Customer Record
const customerId = computed(() => route.params.id || route.query.id || 'CUST-101')

const customerRecord = computed(() => {
  const c = store.getCustomerById(customerId.value)
  if (c) return c
  // Fallback if not found by direct ID
  const all = store.customers || []
  return all.find(item => item.id === customerId.value || item.customer_id === customerId.value || item.code === customerId.value || item.name === customerId.value) || all[0] || {
    id: customerId.value,
    code: customerId.value,
    name: 'Customer',
    firstName: 'Valued',
    lastName: 'Customer',
    phone: '0300 0000000',
    email: 'customer@example.com',
    cnic: '17301-0000000-1',
    address: 'Main Showroom',
    city: 'Peshawar',
    branch: 'Peshawar',
    status: 'Active',
    statusClass: 'bg-[#dcfce7] text-[#165A31]',
    orders: 0,
    ordersCount: 0,
    totalPurchases: 'PKR 0',
    ltv: '0',
    outstanding: 'PKR 0',
    units: 0
  }
})

const customerName = computed(() => customerRecord.value?.name || `${customerRecord.value?.firstName || ''} ${customerRecord.value?.lastName || ''}`.trim() || 'Customer')
const customerBranch = computed(() => customerRecord.value?.branch || user.value?.branchName || 'Peshawar')

// Dynamic Tabs
const activeTab = ref('Overview')
const tabs = [
  'Overview',
  'Contact & Profile',
  'Orders & Purchases',
  'Invoices',
  'Payments',
  'Owned Vehicles',
  'Warranty & Service',
  'Leads & Inquiries',
  'Documents & Notes',
  'Activity & Timeline'
]

// Modal & Toast State
const showEditModal = ref(false)
const showCreateOrderModal = ref(false)
const showCreateQuoteModal = ref(false)
const showRecordPaymentModal = ref(false)
const showToast = ref(false)
const toastMessage = ref('')

const triggerToast = (msg) => {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3500)
}

const handleEdit = () => {
  showEditModal.value = true
}

const handleCustomerUpdated = (updated) => {
  showEditModal.value = false
  triggerToast(`Customer ${updated.name || customerName.value} updated successfully!`)
}

const handleOrderCreated = (order) => {
  showCreateOrderModal.value = false
  triggerToast(`Order ${order.order || order.id || order.orderNo} created successfully for ${customerName.value}!`)
}

const handleQuoteCreated = (quote) => {
  showCreateQuoteModal.value = false
  triggerToast(`Quotation ${quote.quote || quote.id} created successfully for ${customerName.value}!`)
}

const handlePaymentCreated = (payment) => {
  showRecordPaymentModal.value = false
  triggerToast(`Payment ${payment.payment || payment.id} recorded successfully for ${customerName.value}!`)
}

// ----------------------------------------------------
// DYNAMIC CONNECTED RECORDS FOR THIS SPECIFIC CUSTOMER
// ----------------------------------------------------

const matchesCustomer = (entity) => {
  if (!entity || !customerRecord.value) return false
  const cId = (customerRecord.value.id || '').toLowerCase()
  const cCode = (customerRecord.value.code || '').toLowerCase()
  const cName = (customerName.value || '').toLowerCase()
  const cPhone = (customerRecord.value.phone || '').replace(/[^0-9]/g, '')

  const eCustId = String(entity.customer_id || '').toLowerCase()
  const eCustName = String(entity.customer || entity.customerName || entity.name || '').toLowerCase()
  const eCustPhone = String(entity.phone || entity.customer_phone || '').replace(/[^0-9]/g, '')

  if (cId && eCustId === cId) return true
  if (cCode && eCustId === cCode) return true
  if (cName && (eCustName === cName || eCustName.includes(cName) || cName.includes(eCustName))) return true
  if (cPhone && eCustPhone && cPhone === eCustPhone) return true
  return false
}

// 1. Orders
const customerOrders = computed(() => {
  const list = (store.orders || []).filter(matchesCustomer)
  if (list.length > 0) return list
  // If baseline customer record has historical order count but list is empty, provide baseline item
  const count = Number(customerRecord.value?.orders || customerRecord.value?.ordersCount || 0)
  if (count > 0) {
    return [
      {
        id: `SO-${customerRecord.value.code?.replace('CUS-', '') || '2188'}`,
        order: `SO-${customerRecord.value.code?.replace('CUS-', '') || '2188'}`,
        orderNo: `SO-${customerRecord.value.code?.replace('CUS-', '') || '2188'}`,
        date: customerRecord.value.createdAt || '18 Aug 2026',
        createdAt: customerRecord.value.createdAt || '18 Aug 2026',
        unit: 'BRG E-125 (CH 8-BRG-26-01731)',
        product: 'BRG E-125',
        total: customerRecord.value.totalPurchases || 'PKR 280,000',
        amount: customerRecord.value.totalPurchases || 'PKR 280,000',
        paid: customerRecord.value.outstanding === 'PKR 0' ? (customerRecord.value.totalPurchases || 'PKR 280,000') : 'PKR 100,000',
        balance: customerRecord.value.outstanding || 'PKR 0',
        status: 'Completed',
        statusClass: 'bg-[#dcfce7] text-[#165A31]'
      }
    ]
  }
  return []
})

// 2. Invoices
const customerInvoices = computed(() => {
  const list = (store.invoices || []).filter(matchesCustomer)
  if (list.length > 0) return list
  if (customerOrders.value.length > 0) {
    const o = customerOrders.value[0]
    return [
      {
        id: `INV-${o.id?.replace(/[^0-9]/g, '') || '8812'}`,
        invoice: `INV-${o.id?.replace(/[^0-9]/g, '') || '8812'}`,
        date: o.date || o.createdAt || 'Today',
        dueDate: 'Settled on Delivery',
        total: o.total || o.amount || 'PKR 280,000',
        paidAmount: o.paid || 'PKR 280,000',
        outstandingAmount: o.balance === 'PKR 0' ? 'PKR 0' : (o.balance || 'PKR 0'),
        status: o.balance === 'PKR 0' ? 'Paid' : 'Partial',
        statusClass: o.balance === 'PKR 0' ? 'bg-[#dcfce7] text-[#165A31]' : 'bg-[#fef3c7] text-[#b45309]'
      }
    ]
  }
  return []
})

// 3. Payments
const customerPayments = computed(() => {
  const list = (store.payments || []).filter(matchesCustomer)
  if (list.length > 0) return list
  if (customerOrders.value.length > 0) {
    const o = customerOrders.value[0]
    return [
      {
        id: `PAY-${o.id?.replace(/[^0-9]/g, '') || '7791'}`,
        payment: `PAY-${o.id?.replace(/[^0-9]/g, '') || '7791'}`,
        order: o.id || 'SO-2188',
        amount: o.paid || 'PKR 280,000',
        method: 'Bank Transfer / Cash',
        date: o.date || 'Recent',
        ref: `TXN-${o.id || '8821'}`,
        status: 'Reconciled',
        statusClass: 'bg-[#dcfce7] text-[#165A31]'
      }
    ]
  }
  return []
})

// 4. Owned Vehicles / Units
const customerUnits = computed(() => {
  const list = (store.serializedUnits || []).filter(matchesCustomer)
  if (list.length > 0) return list
  const unitCount = Number(customerRecord.value?.units || 0)
  if (unitCount > 0) {
    return [
      {
        id: 'UNIT-CUS-1',
        serial: 'CH 8-BRG-26-01731',
        chassis: 'CH 8-BRG-26-01731',
        vin: 'VIN-PK-BRG-2026-01731',
        modelName: 'BRG E-125 EcoDrive',
        color: 'Racing Green',
        purchaseDate: customerRecord.value.createdAt || '18 Aug 2026',
        branch: customerBranch.value,
        warrantyStatus: 'Active (2-Year OEM Warranty)',
        warrantyStatusClass: 'bg-[#dcfce7] text-[#165A31]'
      }
    ]
  }
  return []
})

// 5. Warranties & Cases
const customerWarranties = computed(() => {
  const wars = (store.warranties || []).filter(matchesCustomer)
  if (wars.length > 0) return wars
  if (customerUnits.value.length > 0) {
    return [
      {
        id: `WAR-${customerRecord.value.code || '101'}`,
        unit_id: customerUnits.value[0].vin || customerUnits.value[0].chassis || 'CH 8-BRG-26-01731',
        policy: '2-Year Battery & Controller OEM Warranty',
        tier: 'Full Comprehensive',
        startDate: customerUnits.value[0].purchaseDate || '2026-08-18',
        expiryDate: '2028-08-18',
        status: 'Active',
        statusClass: 'bg-[#dcfce7] text-[#165A31]',
        claimCount: 0
      }
    ]
  }
  return []
})

const customerCases = computed(() => {
  return (store.cases || []).filter(matchesCustomer)
})

// 6. Leads
const customerLeads = computed(() => {
  return (store.leads || []).filter(matchesCustomer)
})

// 7. Audit Logs
const customerAuditLogs = computed(() => {
  const cId = customerRecord.value?.id || customerId.value
  const cCode = customerRecord.value?.code || ''
  const cName = customerName.value
  const directLogs = store.getAuditLogsForEntity('customer', cId)
  const relatedLogs = (store.auditLogs || []).filter(a => {
    if (directLogs.some(dl => dl.id === a.id)) return false
    const str = JSON.stringify(a).toLowerCase()
    return str.includes(cId.toLowerCase()) || 
      (cCode && str.includes(cCode.toLowerCase())) || 
      (cName && str.includes(cName.toLowerCase()))
  })
  return [...directLogs, ...relatedLogs].sort((a, b) => new Date(b.created_at || b.timestamp || 0) - new Date(a.created_at || a.timestamp || 0))
})

// ----------------------------------------------------
// DYNAMIC FINANCIAL & KPI CALCULATIONS
// ----------------------------------------------------

const calculatedTotalPurchases = computed(() => {
  let sum = 0
  customerOrders.value.forEach(o => {
    const val = parseFloat(String(o.total || o.amount || '0').replace(/[^0-9.]/g, '')) || 0
    sum += val
  })
  if (sum > 0) return `PKR ${sum.toLocaleString()}`
  return customerRecord.value?.totalPurchases || (customerRecord.value?.ltv ? `PKR ${customerRecord.value.ltv}` : 'PKR 0')
})

const calculatedTotalPaid = computed(() => {
  let sum = 0
  customerPayments.value.forEach(p => {
    const val = parseFloat(String(p.amount || '0').replace(/[^0-9.]/g, '')) || 0
    sum += val
  })
  if (sum > 0) return `PKR ${sum.toLocaleString()}`
  return 'PKR 0'
})

const calculatedOutstanding = computed(() => {
  let sum = 0
  let hasInvoices = false
  customerInvoices.value.forEach(i => {
    hasInvoices = true
    const val = parseFloat(String(i.outstandingAmount || '0').replace(/[^0-9.]/g, '')) || 0
    sum += val
  })
  if (hasInvoices) return `PKR ${sum.toLocaleString()}`
  return customerRecord.value?.outstanding || 'PKR 0'
})

const totalOrdersCount = computed(() => {
  const dynamicCount = customerOrders.value.length
  const storedCount = Number(customerRecord.value?.ordersCount || customerRecord.value?.orders || 0)
  return Math.max(dynamicCount, storedCount)
})

const totalUnitsCount = computed(() => {
  const dynamicCount = customerUnits.value.length
  const storedCount = Number(customerRecord.value?.units || 0)
  return Math.max(dynamicCount, storedCount)
})
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12 animate-in fade-in duration-200">
    
    <!-- Toast Notification -->
    <div 
      v-if="showToast" 
      class="fixed bottom-6 right-6 z-50 bg-[#165A31] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300"
    >
      <CheckCircle2 class="w-5 h-5 text-emerald-300" />
      <span class="text-xs font-semibold">{{ toastMessage }}</span>
    </div>

    <!-- Header Navigation & Title -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <div class="text-[11px] text-gray-500 mb-1 flex items-center gap-2">
          <button @click="router.push('/sales/customers')" class="hover:text-gray-900 transition-colors flex items-center gap-1 cursor-pointer">
            <ArrowLeft class="w-3.5 h-3.5" /> Back to Customers
          </button>
          <span>/</span>
          <span v-if="isBranchUser">Branch Manager</span>
          <span v-else>Super Admin</span>
          <span>/</span>
          <span class="font-bold text-gray-800">{{ customerName }}</span>
        </div>
        
        <div class="flex items-center gap-3">
          <h1 class="text-[28px] sm:text-[32px] tracking-tight font-bold text-gray-900">{{ customerName }}</h1>
          <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold', customerRecord.statusClass || 'bg-[#dcfce7] text-[#165A31]']">
            {{ customerRecord.status || 'Active' }}
          </span>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700">
            {{ customerBranch }} Branch
          </span>
          <span class="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#eff6ff] text-[#2563eb]">
            {{ customerRecord.code || customerRecord.id }}
          </span>
        </div>
        
        <p class="text-xs text-gray-500 mt-1">
          National ID: {{ customerRecord.cnic || '17301-8891234-1' }} · Phone: {{ customerRecord.phone || '0300 1234567' }} · City: {{ customerRecord.city || 'Peshawar' }}
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2.5 flex-wrap">
        <button 
          @click="handleEdit" 
          class="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm cursor-pointer"
        >
          <Pencil class="w-3.5 h-3.5 text-[#165A31]" />
          Edit Customer
        </button>

        <button 
          @click="showCreateQuoteModal = true" 
          class="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
        >
          <Plus class="w-3.5 h-3.5 text-gray-500" />
          New Quote
        </button>

        <button 
          @click="showCreateOrderModal = true" 
          class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#165A31] hover:bg-[#124a28] rounded-lg transition-colors shadow-sm cursor-pointer"
        >
          <Plus class="w-3.5 h-3.5 text-white" />
          Create Order
        </button>
      </div>
    </div>

    <!-- 4 Key Financial & Operational Metric Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-5 bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Lifetime Sales</p>
          <DollarSign class="w-4 h-4 text-emerald-600" />
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mt-2">{{ calculatedTotalPurchases }}</h3>
        <p class="text-[10px] text-gray-400 mt-1">Confirmed orders & paid invoices</p>
      </div>

      <div class="p-5 bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Total Orders</p>
          <Package class="w-4 h-4 text-blue-600" />
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mt-2">{{ totalOrdersCount }}</h3>
        <p class="text-[10px] text-gray-400 mt-1">{{ customerOrders.length }} active order records</p>
      </div>

      <div class="p-5 bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Owned Vehicles</p>
          <ShieldCheck class="w-4 h-4 text-purple-600" />
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mt-2">{{ totalUnitsCount }}</h3>
        <p class="text-[10px] text-gray-400 mt-1">Registered chassis on road</p>
      </div>

      <div class="p-5 bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Outstanding Balance</p>
          <CreditCard class="w-4 h-4" :class="calculatedOutstanding === 'PKR 0' ? 'text-gray-400' : 'text-amber-600'" />
        </div>
        <h3 class="text-2xl font-bold mt-2" :class="calculatedOutstanding === 'PKR 0' ? 'text-gray-900' : 'text-amber-700'">
          {{ calculatedOutstanding }}
        </h3>
        <p class="text-[10px] mt-1" :class="calculatedOutstanding === 'PKR 0' ? 'text-emerald-600 font-semibold' : 'text-amber-600'">
          {{ calculatedOutstanding === 'PKR 0' ? 'Account clear (Zero balance)' : 'Pending customer collection' }}
        </p>
      </div>
    </div>

    <!-- Navigation Tabs Bar -->
    <div class="border-b border-gray-200 flex items-center gap-6 overflow-x-auto pb-1">
      <button 
        v-for="tab in tabs" 
        :key="tab"
        @click="activeTab = tab"
        class="pb-3 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer relative"
        :class="activeTab === tab ? 'text-[#165A31] font-bold' : 'text-gray-400 hover:text-gray-700'"
      >
        {{ tab }}
        <span 
          v-if="tab === 'Orders & Purchases' && customerOrders.length > 0" 
          class="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-gray-100 text-gray-600 font-bold"
        >
          {{ customerOrders.length }}
        </span>
        <span 
          v-if="tab === 'Payments' && customerPayments.length > 0" 
          class="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-gray-100 text-gray-600 font-bold"
        >
          {{ customerPayments.length }}
        </span>
        <div v-if="activeTab === tab" class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#165A31] rounded-t-full"></div>
      </button>
    </div>

    <!-- TAB CONTENTS -->
    <div class="space-y-6">

      <!-- 1. OVERVIEW TAB -->
      <div v-if="activeTab === 'Overview'" class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <!-- Left: Customer Summary Profile Card -->
          <div class="bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 lg:col-span-7 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <User class="w-4 h-4 text-[#165A31]" />
                  Customer Profile & Contact
                </h3>
                <button @click="handleEdit" class="text-xs font-bold text-[#165A31] hover:underline flex items-center gap-1 cursor-pointer">
                  <Pencil class="w-3 h-3" /> Edit Profile
                </button>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="bg-gray-50/70 border border-gray-100 rounded-lg p-3">
                  <span class="text-[10px] font-medium text-gray-400">Customer Code</span>
                  <p class="text-xs font-bold text-gray-900 mt-0.5">{{ customerRecord.code || customerRecord.id }}</p>
                </div>
                <div class="bg-gray-50/70 border border-gray-100 rounded-lg p-3">
                  <span class="text-[10px] font-medium text-gray-400">Primary Phone</span>
                  <p class="text-xs font-bold text-gray-900 mt-0.5">{{ customerRecord.phone || '0300 1234567' }}</p>
                </div>
                <div class="bg-gray-50/70 border border-gray-100 rounded-lg p-3">
                  <span class="text-[10px] font-medium text-gray-400">Email Address</span>
                  <p class="text-xs font-bold text-gray-900 mt-0.5 truncate">{{ customerRecord.email || 'customer@example.com' }}</p>
                </div>
                <div class="bg-gray-50/70 border border-gray-100 rounded-lg p-3">
                  <span class="text-[10px] font-medium text-gray-400">National ID (CNIC)</span>
                  <p class="text-xs font-bold text-gray-900 mt-0.5">{{ customerRecord.cnic || '17301-8891234-1' }}</p>
                </div>
                <div class="bg-gray-50/70 border border-gray-100 rounded-lg p-3 sm:col-span-2">
                  <span class="text-[10px] font-medium text-gray-400">Address</span>
                  <p class="text-xs font-bold text-gray-900 mt-0.5">{{ customerRecord.address || 'Showroom Address' }}, {{ customerRecord.city || 'Peshawar' }}</p>
                </div>
                <div class="bg-gray-50/70 border border-gray-100 rounded-lg p-3">
                  <span class="text-[10px] font-medium text-gray-400">Registered Branch</span>
                  <p class="text-xs font-bold text-[#165A31] mt-0.5">{{ customerBranch }}</p>
                </div>
                <div class="bg-gray-50/70 border border-gray-100 rounded-lg p-3">
                  <span class="text-[10px] font-medium text-gray-400">Client Tier / Segment</span>
                  <p class="text-xs font-bold text-gray-900 mt-0.5">VIP Retail Client</p>
                </div>
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
              <span>Customer registered: {{ customerRecord.createdAt || 'Aug 2026' }}</span>
              <span>Last account interaction: {{ customerRecord.activity || 'Recent' }}</span>
            </div>
          </div>

          <!-- Right: Financial Summary & Quick Actions -->
          <div class="bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 lg:col-span-5 flex flex-col justify-between">
            <div>
              <h3 class="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard class="w-4 h-4 text-emerald-600" />
                Financial Health & Collections
              </h3>

              <div class="space-y-3">
                <div class="flex items-center justify-between p-3 bg-gray-50/60 rounded-lg border border-gray-100">
                  <span class="text-xs text-gray-600 font-medium">Total Billed</span>
                  <span class="text-xs font-bold text-gray-900">{{ calculatedTotalPurchases }}</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-gray-50/60 rounded-lg border border-gray-100">
                  <span class="text-xs text-gray-600 font-medium">Total Received</span>
                  <span class="text-xs font-bold text-emerald-700">{{ calculatedTotalPaid }}</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-amber-50/50 rounded-lg border border-amber-100">
                  <span class="text-xs text-amber-900 font-medium">Current Balance Due</span>
                  <span class="text-xs font-bold" :class="calculatedOutstanding === 'PKR 0' ? 'text-gray-900' : 'text-amber-800'">
                    {{ calculatedOutstanding }}
                  </span>
                </div>
                <div class="flex items-center justify-between p-3 bg-gray-50/60 rounded-lg border border-gray-100">
                  <span class="text-xs text-gray-600 font-medium">Payment Performance</span>
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#dcfce7] text-[#165A31]">
                    Prompt Payer (Good Standing)
                  </span>
                </div>
              </div>
            </div>

            <!-- Quick Action Links -->
            <div class="mt-5 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2">
              <button 
                @click="showCreateOrderModal = true"
                class="px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors text-center cursor-pointer"
              >
                + New Order
              </button>
              <button 
                @click="showRecordPaymentModal = true"
                class="px-3 py-2 text-xs font-semibold text-[#165A31] bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 rounded-lg transition-colors text-center cursor-pointer"
              >
                + Record Payment
              </button>
            </div>
          </div>
        </div>

        <!-- Recent Orders & Recent Payments Previews -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Recent Orders Card -->
          <div class="bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-bold text-gray-900">Recent Sales Orders</h3>
              <button @click="activeTab = 'Orders & Purchases'" class="text-xs font-bold text-[#165A31] hover:underline cursor-pointer">
                View All ({{ customerOrders.length }}) ›
              </button>
            </div>
            
            <div v-if="customerOrders.length > 0" class="space-y-2.5">
              <div 
                v-for="order in customerOrders.slice(0, 3)" 
                :key="order.id" 
                class="p-3 border border-gray-100 rounded-lg flex items-center justify-between hover:bg-gray-50/50 transition-colors"
              >
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-gray-900">{{ order.id || order.order }}</span>
                    <span :class="['px-2 py-0.5 rounded text-[10px] font-bold', order.statusClass || 'bg-gray-100 text-gray-700']">
                      {{ order.status || 'Ready' }}
                    </span>
                  </div>
                  <p class="text-[11px] text-gray-500 mt-0.5">{{ order.unit || order.product || 'Electric Vehicle' }}</p>
                </div>
                <div class="text-right">
                  <p class="text-xs font-bold text-gray-900">{{ order.total || order.amount || 'PKR 0' }}</p>
                  <p class="text-[10px] text-gray-400 mt-0.5">{{ order.date || order.createdAt || 'Recent' }}</p>
                </div>
              </div>
            </div>
            <div v-else class="py-8 text-center text-gray-400 text-xs">
              No orders recorded for this customer yet.
            </div>
          </div>

          <!-- Recent Payments Card -->
          <div class="bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-bold text-gray-900">Recent Payment Records</h3>
              <button @click="activeTab = 'Payments'" class="text-xs font-bold text-[#165A31] hover:underline cursor-pointer">
                View All ({{ customerPayments.length }}) ›
              </button>
            </div>

            <div v-if="customerPayments.length > 0" class="space-y-2.5">
              <div 
                v-for="payment in customerPayments.slice(0, 3)" 
                :key="payment.id" 
                class="p-3 border border-gray-100 rounded-lg flex items-center justify-between hover:bg-gray-50/50 transition-colors"
              >
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-gray-900">{{ payment.id || payment.payment }}</span>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-[#dcfce7] text-[#165A31]">
                      {{ payment.status || 'Reconciled' }}
                    </span>
                  </div>
                  <p class="text-[11px] text-gray-500 mt-0.5">{{ payment.method || 'Bank Transfer' }} · Ref: {{ payment.ref || 'Direct' }}</p>
                </div>
                <div class="text-right">
                  <p class="text-xs font-bold text-emerald-700">{{ payment.amount || 'PKR 0' }}</p>
                  <p class="text-[10px] text-gray-400 mt-0.5">{{ payment.date || 'Today' }}</p>
                </div>
              </div>
            </div>
            <div v-else class="py-8 text-center text-gray-400 text-xs">
              No payments recorded for this customer yet.
            </div>
          </div>
        </div>
      </div>

      <!-- 2. CONTACT & PROFILE TAB -->
      <div v-if="activeTab === 'Contact & Profile'" class="bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-6">
        <div class="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 class="text-sm font-bold text-gray-900">Comprehensive Contact & Identification Details</h3>
            <p class="text-xs text-gray-500 mt-0.5">Customer verification details and communication channels.</p>
          </div>
          <button @click="handleEdit" class="px-3.5 py-1.5 text-xs font-bold text-[#165A31] bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5">
            <Pencil class="w-3.5 h-3.5" /> Edit Profile
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <h4 class="text-xs font-bold text-gray-700 uppercase tracking-wider">Personal Identity</h4>
            
            <div class="p-3 bg-gray-50/70 rounded-lg border border-gray-100 flex items-center justify-between">
              <span class="text-xs text-gray-500">Full Legal Name</span>
              <span class="text-xs font-bold text-gray-900">{{ customerName }}</span>
            </div>
            <div class="p-3 bg-gray-50/70 rounded-lg border border-gray-100 flex items-center justify-between">
              <span class="text-xs text-gray-500">CNIC / National ID</span>
              <span class="text-xs font-bold text-gray-900">{{ customerRecord.cnic || '17301-8891234-1' }}</span>
            </div>
            <div class="p-3 bg-gray-50/70 rounded-lg border border-gray-100 flex items-center justify-between">
              <span class="text-xs text-gray-500">Account Classification</span>
              <span class="text-xs font-bold text-gray-900">Retail EV Consumer</span>
            </div>
            <div class="p-3 bg-gray-50/70 rounded-lg border border-gray-100 flex items-center justify-between">
              <span class="text-xs text-gray-500">Account Status</span>
              <span :class="['px-2 py-0.5 rounded text-[10px] font-bold', customerRecord.statusClass || 'bg-[#dcfce7] text-[#165A31]']">
                {{ customerRecord.status || 'Active' }}
              </span>
            </div>
          </div>

          <div class="space-y-4">
            <h4 class="text-xs font-bold text-gray-700 uppercase tracking-wider">Contact & Address</h4>
            
            <div class="p-3 bg-gray-50/70 rounded-lg border border-gray-100 flex items-center justify-between">
              <span class="text-xs text-gray-500">Primary Phone (Mobile)</span>
              <span class="text-xs font-bold text-gray-900">{{ customerRecord.phone || '0300 1234567' }}</span>
            </div>
            <div class="p-3 bg-gray-50/70 rounded-lg border border-gray-100 flex items-center justify-between">
              <span class="text-xs text-gray-500">Email Address</span>
              <span class="text-xs font-bold text-gray-900 truncate">{{ customerRecord.email || 'customer@example.com' }}</span>
            </div>
            <div class="p-3 bg-gray-50/70 rounded-lg border border-gray-100 flex items-center justify-between">
              <span class="text-xs text-gray-500">Residential City</span>
              <span class="text-xs font-bold text-gray-900">{{ customerRecord.city || 'Peshawar' }}</span>
            </div>
            <div class="p-3 bg-gray-50/70 rounded-lg border border-gray-100 flex items-center justify-between">
              <span class="text-xs text-gray-500">Associated Showroom Branch</span>
              <span class="text-xs font-bold text-[#165A31]">{{ customerBranch }}</span>
            </div>
          </div>
        </div>

        <div class="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
          <span class="text-xs font-bold text-gray-700">Residential / Delivery Address</span>
          <p class="text-xs text-gray-800 leading-relaxed font-medium">
            {{ customerRecord.address || 'Main Showroom Area, University Town' }}, {{ customerRecord.city || 'Peshawar' }}, Pakistan
          </p>
        </div>

        <div class="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
          <span class="text-xs font-bold text-gray-700">Internal Dealership Notes</span>
          <p class="text-xs text-gray-600 leading-relaxed">
            {{ customerRecord.notes || 'Loyal client with high interest in electric scooter technology. Always prioritizes warranty clarity.' }}
          </p>
        </div>
      </div>

      <!-- 3. ORDERS & PURCHASES TAB -->
      <div v-if="activeTab === 'Orders & Purchases'" class="bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 class="text-sm font-bold text-gray-900">Customer Sales Orders ({{ customerOrders.length }})</h3>
            <p class="text-xs text-gray-500 mt-0.5">All official vehicle purchase agreements and booking orders.</p>
          </div>
          <button 
            @click="showCreateOrderModal = true"
            class="px-3.5 py-1.5 text-xs font-bold text-white bg-[#165A31] hover:bg-[#124a28] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus class="w-3.5 h-3.5" /> Create New Order
          </button>
        </div>

        <div v-if="customerOrders.length > 0" class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-gray-50/80 border-b border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                <th class="px-5 py-3">Order Number</th>
                <th class="px-5 py-3">Date</th>
                <th class="px-5 py-3">Vehicle / Model</th>
                <th class="px-5 py-3">Total Amount</th>
                <th class="px-5 py-3">Paid Amount</th>
                <th class="px-5 py-3">Balance</th>
                <th class="px-5 py-3">Status</th>
                <th class="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="text-xs divide-y divide-gray-50">
              <tr v-for="order in customerOrders" :key="order.id" class="hover:bg-gray-50/50 transition-colors">
                <td class="px-5 py-4 font-bold text-gray-900">{{ order.id || order.order }}</td>
                <td class="px-5 py-4 text-gray-600">{{ order.date || order.createdAt || 'Recent' }}</td>
                <td class="px-5 py-4 font-medium text-gray-800">{{ order.unit || order.product || 'BRG E-125' }}</td>
                <td class="px-5 py-4 font-bold text-gray-900">{{ order.total || order.amount || 'PKR 0' }}</td>
                <td class="px-5 py-4 text-emerald-700 font-semibold">{{ order.paid || 'PKR 0' }}</td>
                <td class="px-5 py-4" :class="order.balance === 'PKR 0' ? 'text-gray-500' : 'text-amber-700 font-bold'">
                  {{ order.balance || 'PKR 0' }}
                </td>
                <td class="px-5 py-4">
                  <span :class="['inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold', order.statusClass || 'bg-gray-100 text-gray-700']">
                    {{ order.status || 'Ready' }}
                  </span>
                </td>
                <td class="px-5 py-4 text-right">
                  <button 
                    @click="router.push(`/sales/orders/detail?id=${order.id || order.order}`)" 
                    class="text-xs font-bold text-[#165A31] hover:underline cursor-pointer"
                  >
                    View Order ›
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="p-12 text-center space-y-3">
          <p class="text-xs font-semibold text-gray-600">No sales orders found for this customer.</p>
          <button 
            @click="showCreateOrderModal = true"
            class="px-4 py-2 text-xs font-bold text-white bg-[#165A31] rounded-lg shadow-sm hover:bg-[#124a28] cursor-pointer"
          >
            Create First Order
          </button>
        </div>
      </div>

      <!-- 4. INVOICES TAB -->
      <div v-if="activeTab === 'Invoices'" class="bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 class="text-sm font-bold text-gray-900">Customer Tax Invoices ({{ customerInvoices.length }})</h3>
            <p class="text-xs text-gray-500 mt-0.5">Commercial invoices and payment tracking.</p>
          </div>
          <button 
            @click="router.push(`/sales/invoices`)"
            class="px-3.5 py-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
          >
            Go to Invoices Hub
          </button>
        </div>

        <div v-if="customerInvoices.length > 0" class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-gray-50/80 border-b border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                <th class="px-5 py-3">Invoice Number</th>
                <th class="px-5 py-3">Issue Date</th>
                <th class="px-5 py-3">Due Date</th>
                <th class="px-5 py-3">Total Amount</th>
                <th class="px-5 py-3">Paid Amount</th>
                <th class="px-5 py-3">Outstanding</th>
                <th class="px-5 py-3">Payment Status</th>
                <th class="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="text-xs divide-y divide-gray-50">
              <tr v-for="inv in customerInvoices" :key="inv.id" class="hover:bg-gray-50/50 transition-colors">
                <td class="px-5 py-4 font-bold text-gray-900">{{ inv.id || inv.invoice }}</td>
                <td class="px-5 py-4 text-gray-600">{{ inv.date || inv.issued || 'Today' }}</td>
                <td class="px-5 py-4 text-gray-600">{{ inv.dueDate || '14 Days' }}</td>
                <td class="px-5 py-4 font-bold text-gray-900">{{ inv.amount || (inv.total ? `PKR ${inv.total.toLocaleString()}` : 'PKR 0') }}</td>
                <td class="px-5 py-4 text-emerald-700 font-semibold">{{ inv.paidAmount ? `PKR ${inv.paidAmount.toLocaleString()}` : 'PKR 0' }}</td>
                <td class="px-5 py-4 font-bold" :class="inv.outstandingAmount === 0 || inv.outstandingAmount === 'PKR 0' ? 'text-gray-500' : 'text-amber-700'">
                  {{ inv.outstandingAmount ? (typeof inv.outstandingAmount === 'number' ? `PKR ${inv.outstandingAmount.toLocaleString()}` : inv.outstandingAmount) : 'PKR 0' }}
                </td>
                <td class="px-5 py-4">
                  <span :class="['inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold', inv.statusClass || (inv.status === 'Paid' ? 'bg-[#dcfce7] text-[#165A31]' : 'bg-[#fef3c7] text-[#b45309]')]">
                    {{ inv.status || 'Paid' }}
                  </span>
                </td>
                <td class="px-5 py-4 text-right">
                  <button 
                    @click="router.push(`/sales/invoices/detail?id=${inv.id || inv.invoice}`)" 
                    class="text-xs font-bold text-[#165A31] hover:underline cursor-pointer"
                  >
                    View Invoice ›
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="p-12 text-center text-gray-400 text-xs">
          No invoices generated for this customer yet.
        </div>
      </div>

      <!-- 5. PAYMENTS TAB -->
      <div v-if="activeTab === 'Payments'" class="bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 class="text-sm font-bold text-gray-900">Customer Payment Receipts ({{ customerPayments.length }})</h3>
            <p class="text-xs text-gray-500 mt-0.5">Cleared customer collections, bank deposits, and receipts.</p>
          </div>
          <button 
            @click="showRecordPaymentModal = true"
            class="px-3.5 py-1.5 text-xs font-bold text-white bg-[#165A31] hover:bg-[#124a28] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus class="w-3.5 h-3.5" /> Record Payment
          </button>
        </div>

        <div v-if="customerPayments.length > 0" class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-gray-50/80 border-b border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                <th class="px-5 py-3">Receipt / Payment #</th>
                <th class="px-5 py-3">Linked Order</th>
                <th class="px-5 py-3">Amount Cleared</th>
                <th class="px-5 py-3">Payment Method</th>
                <th class="px-5 py-3">Date</th>
                <th class="px-5 py-3">Reference / Slip</th>
                <th class="px-5 py-3">Status</th>
                <th class="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="text-xs divide-y divide-gray-50">
              <tr v-for="pay in customerPayments" :key="pay.id" class="hover:bg-gray-50/50 transition-colors">
                <td class="px-5 py-4 font-bold text-gray-900">{{ pay.id || pay.payment }}</td>
                <td class="px-5 py-4 text-gray-700 font-medium">{{ pay.order || pay.order_id || 'Direct Sale' }}</td>
                <td class="px-5 py-4 font-bold text-emerald-700">{{ pay.amount }}</td>
                <td class="px-5 py-4 text-gray-600">{{ pay.method || 'Bank Transfer' }}</td>
                <td class="px-5 py-4 text-gray-600">{{ pay.date || 'Today' }}</td>
                <td class="px-5 py-4 font-mono text-[11px] text-gray-500">{{ pay.ref || pay.transactionRef || 'N/A' }}</td>
                <td class="px-5 py-4">
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#dcfce7] text-[#165A31]">
                    {{ pay.status || 'Reconciled' }}
                  </span>
                </td>
                <td class="px-5 py-4 text-right">
                  <button 
                    @click="router.push(`/sales/payments/detail?id=${pay.id || pay.payment}`)" 
                    class="text-xs font-bold text-[#165A31] hover:underline cursor-pointer"
                  >
                    View Receipt ›
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="p-12 text-center space-y-3">
          <p class="text-xs font-semibold text-gray-600">No payment records found for this customer.</p>
          <button 
            @click="showRecordPaymentModal = true"
            class="px-4 py-2 text-xs font-bold text-white bg-[#165A31] rounded-lg shadow-sm hover:bg-[#124a28] cursor-pointer"
          >
            Record First Payment
          </button>
        </div>
      </div>

      <!-- 6. OWNED VEHICLES TAB -->
      <div v-if="activeTab === 'Owned Vehicles'" class="bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 class="text-sm font-bold text-gray-900">Registered Vehicles & Chassis ({{ customerUnits.length }})</h3>
            <p class="text-xs text-gray-500 mt-0.5">Vehicles delivered and owned under this customer account.</p>
          </div>
        </div>

        <div v-if="customerUnits.length > 0" class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-gray-50/80 border-b border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                <th class="px-5 py-3">Chassis / VIN</th>
                <th class="px-5 py-3">Product Model</th>
                <th class="px-5 py-3">Branch Location</th>
                <th class="px-5 py-3">Handover Date</th>
                <th class="px-5 py-3">Warranty Coverage</th>
                <th class="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="text-xs divide-y divide-gray-50">
              <tr v-for="unit in customerUnits" :key="unit.id" class="hover:bg-gray-50/50 transition-colors">
                <td class="px-5 py-4 font-mono font-bold text-gray-900">{{ unit.vin || unit.chassis || unit.serial }}</td>
                <td class="px-5 py-4 font-semibold text-gray-800">{{ unit.modelName || unit.product || 'BRG E-125' }}</td>
                <td class="px-5 py-4 text-gray-600">{{ unit.branch || customerBranch }}</td>
                <td class="px-5 py-4 text-gray-600">{{ unit.purchaseDate || '18 Aug 2026' }}</td>
                <td class="px-5 py-4">
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#dcfce7] text-[#165A31]">
                    Active 2-Year OEM Warranty
                  </span>
                </td>
                <td class="px-5 py-4 text-right">
                  <button 
                    @click="router.push(`/inventory/serialized-units/detail?id=${unit.id || unit.serial}`)" 
                    class="text-xs font-bold text-[#165A31] hover:underline cursor-pointer"
                  >
                    View Vehicle ›
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="p-12 text-center text-gray-400 text-xs">
          No delivered vehicles registered under this customer account.
        </div>
      </div>

      <!-- 7. WARRANTY & SERVICE TAB -->
      <div v-if="activeTab === 'Warranty & Service'" class="space-y-6">
        <!-- Warranty Card -->
        <div class="bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
          <h3 class="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ShieldCheck class="w-4 h-4 text-[#165A31]" />
            Active OEM Warranties
          </h3>

          <div v-if="customerWarranties.length > 0" class="space-y-3">
            <div 
              v-for="war in customerWarranties" 
              :key="war.id"
              class="p-4 bg-emerald-50/40 border border-emerald-100 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-gray-900">{{ war.id }}</span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-[#dcfce7] text-[#165A31]">Active Coverage</span>
                </div>
                <p class="text-xs font-semibold text-gray-800 mt-1">{{ war.policy || '2-Year Battery & Controller OEM Warranty' }}</p>
                <p class="text-[11px] text-gray-500 mt-0.5">Assigned to Unit: {{ war.unit_id }} · Valid through: {{ war.expiryDate || '2028' }}</p>
              </div>
              <button 
                @click="router.push(`/after-sales/warranties`)"
                class="px-3 py-1.5 text-xs font-bold text-[#165A31] bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
              >
                Warranty Certificate ›
              </button>
            </div>
          </div>
          <div v-else class="text-xs text-gray-400 py-4 text-center">
            No active warranties found.
          </div>
        </div>

        <!-- Service Cases Card -->
        <div class="bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Wrench class="w-4 h-4 text-blue-600" />
              Workshop Service & Repair Cases ({{ customerCases.length }})
            </h3>
            <button 
              @click="router.push(`/after-sales/cases/create?customer=${encodeURIComponent(customerName)}`)"
              class="px-3 py-1.5 text-xs font-bold text-[#165A31] bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              + Log Service Case
            </button>
          </div>

          <div v-if="customerCases.length > 0" class="space-y-3">
            <div 
              v-for="c in customerCases" 
              :key="c.id"
              class="p-4 border border-gray-100 rounded-xl flex items-center justify-between hover:bg-gray-50/50 transition-colors"
            >
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-gray-900">{{ c.id || c.caseNo }}</span>
                  <span :class="['px-2 py-0.5 rounded text-[10px] font-bold', c.statusClass || 'bg-blue-100 text-blue-800']">
                    {{ c.status || 'In Progress' }}
                  </span>
                </div>
                <p class="text-xs font-semibold text-gray-800 mt-1">{{ c.type || c.issue || 'Routine EV Maintenance' }}</p>
                <p class="text-[11px] text-gray-500 mt-0.5">Technician: {{ c.technician || 'Workshop Lead' }} · Unit: {{ c.unit || c.vin || 'EV Unit' }}</p>
              </div>
              <button 
                @click="router.push(`/after-sales/cases/detail?id=${c.id || c.caseNo}`)" 
                class="text-xs font-bold text-[#165A31] hover:underline cursor-pointer"
              >
                View Job Card ›
              </button>
            </div>
          </div>
          <div v-else class="text-xs text-gray-400 py-6 text-center">
            No workshop service cases logged for this customer.
          </div>
        </div>
      </div>

      <!-- 8. LEADS & INQUIRIES TAB -->
      <div v-if="activeTab === 'Leads & Inquiries'" class="bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
        <h3 class="text-sm font-bold text-gray-900 mb-4">Showroom Inquiries & Lead History</h3>
        
        <div v-if="customerLeads.length > 0" class="space-y-3">
          <div 
            v-for="lead in customerLeads" 
            :key="lead.id" 
            class="p-4 border border-gray-100 rounded-xl flex items-center justify-between hover:bg-gray-50/50"
          >
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-gray-900">{{ lead.id || lead.code }}</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-[#dcfce7] text-[#165A31]">
                  {{ lead.status || 'Converted' }}
                </span>
              </div>
              <p class="text-xs font-semibold text-gray-800 mt-1">Interest: {{ lead.model || lead.vehicle || 'BRG E-125' }}</p>
              <p class="text-[11px] text-gray-500 mt-0.5">Source: {{ lead.source || 'Walk-in Showroom' }} · Assigned Rep: {{ lead.salesperson || 'Hamza Ali' }}</p>
            </div>
            <button 
              @click="router.push(`/sales/leads/detail?id=${lead.id}`)"
              class="text-xs font-bold text-[#165A31] hover:underline cursor-pointer"
            >
              View Lead ›
            </button>
          </div>
        </div>
        <div v-else class="text-xs text-gray-400 py-6 text-center">
          No prior showroom lead inquiries recorded. Customer was registered directly.
        </div>
      </div>

      <!-- 9. DOCUMENTS & NOTES TAB -->
      <div v-if="activeTab === 'Documents & Notes'" class="space-y-6">
        <div class="bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
          <h3 class="text-sm font-bold text-gray-900">Official Document Verification Checklist</h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="p-3.5 bg-emerald-50/40 border border-emerald-100 rounded-lg flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <CheckCircle2 class="w-4 h-4 text-emerald-600" />
                <div>
                  <p class="text-xs font-bold text-gray-900">National CNIC Verified</p>
                  <p class="text-[10px] text-gray-500">{{ customerRecord.cnic || '17301-8891234-1' }}</p>
                </div>
              </div>
              <span class="text-[10px] font-bold text-emerald-700">Verified</span>
            </div>

            <div class="p-3.5 bg-emerald-50/40 border border-emerald-100 rounded-lg flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <CheckCircle2 class="w-4 h-4 text-emerald-600" />
                <div>
                  <p class="text-xs font-bold text-gray-900">Sales Agreement Contract</p>
                  <p class="text-[10px] text-gray-500">Official Terms & Signatures</p>
                </div>
              </div>
              <span class="text-[10px] font-bold text-emerald-700">Signed</span>
            </div>

            <div class="p-3.5 bg-emerald-50/40 border border-emerald-100 rounded-lg flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <CheckCircle2 class="w-4 h-4 text-emerald-600" />
                <div>
                  <p class="text-xs font-bold text-gray-900">Pre-Delivery Inspection (PDI)</p>
                  <p class="text-[10px] text-gray-500">10-Point Technical Check</p>
                </div>
              </div>
              <span class="text-[10px] font-bold text-emerald-700">Passed</span>
            </div>

            <div class="p-3.5 bg-emerald-50/40 border border-emerald-100 rounded-lg flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <CheckCircle2 class="w-4 h-4 text-emerald-600" />
                <div>
                  <p class="text-xs font-bold text-gray-900">OEM Warranty Booklet</p>
                  <p class="text-[10px] text-gray-500">2-Year Battery Guarantee</p>
                </div>
              </div>
              <span class="text-[10px] font-bold text-emerald-700">Activated</span>
            </div>
          </div>
        </div>

        <div class="bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-gray-900">Internal Customer Notes</h3>
            <button @click="handleEdit" class="text-xs font-bold text-[#165A31] hover:underline cursor-pointer">
              Edit Notes
            </button>
          </div>
          <p class="text-xs text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
            {{ customerRecord.notes || 'Client contacted showroom for electric bike inquiry. Values punctuality, warranty coverage, and high quality battery longevity.' }}
          </p>
        </div>
      </div>

      <!-- 10. ACTIVITY & TIMELINE TAB -->
      <div v-if="activeTab === 'Activity & Timeline'" class="bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-sm font-bold text-gray-900">Customer Audit Trail & System Events</h3>
            <p class="text-xs text-gray-500 mt-0.5">Immutable record of all interactions, orders, payments, and profile edits.</p>
          </div>
          <span class="text-xs text-gray-400 font-semibold">{{ customerAuditLogs.length }} events recorded</span>
        </div>

        <div class="relative pl-6 space-y-6">
          <!-- Continuous Timeline Vertical Line -->
          <div class="absolute top-2 bottom-2 left-2.5 w-[2px] bg-gray-200"></div>

          <div 
            v-for="(log, idx) in (customerAuditLogs.length > 0 ? customerAuditLogs : [
              { id: '1', action: 'Payment Received', description: `Full payment of ${calculatedTotalPurchases} confirmed and reconciled`, timestamp: 'Recent', user: 'Ahsan Khan' },
              { id: '2', action: 'Vehicle Handover', description: 'Handover protocol signed and warranty activated', timestamp: 'Recent', user: 'Ahsan Khan' },
              { id: '3', action: 'Order Created', description: `Sales order confirmed for ${customerName}`, timestamp: 'Recent', user: 'Ahsan Khan' },
              { id: '4', action: 'Customer Registered', description: `Customer profile ${customerRecord.code || customerRecord.id} registered in ${customerBranch} Branch`, timestamp: customerRecord.createdAt || '2026', user: 'System' }
            ])" 
            :key="log.id || idx"
            class="relative flex items-start gap-4"
          >
            <!-- Timeline Pin -->
            <div class="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#165A31] border-2 border-white shadow-sm"></div>

            <div class="flex-1 bg-gray-50/70 border border-gray-100 rounded-lg p-3.5">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-bold text-gray-900">{{ log.action || log.operation || 'Event' }}</span>
                <span class="text-[10px] text-gray-400">{{ log.timestamp || log.created_at || 'Recorded' }}</span>
              </div>
              <p class="text-xs text-gray-700">{{ log.description || log.result }}</p>
              <div class="mt-2 text-[10px] text-gray-400 flex items-center gap-2">
                <span>By: <strong class="text-gray-600">{{ log.user || log.actor_name || 'Staff' }}</strong></span>
                <span>·</span>
                <span>Branch: <strong class="text-gray-600">{{ log.branch || customerBranch }}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Edit Customer Modal (Unified for Super Admin & Branch Manager) -->
    <CreateCustomerModal 
      v-if="showEditModal" 
      :is-modal="true"
      :customer="customerRecord" 
      @close="showEditModal = false" 
      @updated="handleCustomerUpdated"
    />

    <!-- In-Context Create Sale / Order Modal -->
    <CreateSaleModal 
      v-if="showCreateOrderModal" 
      :customer="customerRecord" 
      @close="showCreateOrderModal = false" 
      @created="handleOrderCreated"
    />

    <!-- In-Context Create Quotation Modal -->
    <CreateQuotationModal 
      v-if="showCreateQuoteModal" 
      :customer="customerRecord" 
      @close="showCreateQuoteModal = false" 
      @created="handleQuoteCreated"
    />

    <!-- In-Context Record Payment Modal -->
    <CreatePaymentModal 
      v-if="showRecordPaymentModal" 
      :customer="customerRecord" 
      @close="showRecordPaymentModal = false" 
      @created="handlePaymentCreated"
    />

  </div>
</template>
