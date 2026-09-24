<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { X, Check, Search, Plus } from 'lucide-vue-next'
import { store } from '../../store.js'
import CreateCustomerModal from './CreateCustomer.vue'

const props = defineProps({
  isModal: {
    type: Boolean,
    default: true
  },
  order: {
    type: Object,
    default: null
  },
  customer: {
    type: [Object, String],
    default: null
  }
})

const router = useRouter()
const emit = defineEmits(['close', 'created', 'updated'])

const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const isEditMode = ref(false)
const showValidation = ref(false)

const saleData = ref({
  orderNo: '',
  branch: user.value?.branchName || 'Peshawar',
  customer: 'Faisal Khan',
  customer_id: 'CUST-101',
  salesperson: 'Hamza Ali',
  product: 'BRG DS11',
  selectedUnit: 'DS11-00997',
  cataloguePrice: 'PKR 240,000',
  discount: 'PKR 10,000',
  finalPrice: 'PKR 230,000',
  paymentMethod: 'Bank Transfer',
  transactionId: '',
  bankAccount: 'Meezan Bank - Main Operations (PK02MEZN00123456789)',
  chequeNo: '',
  draweeBank: '',
  amountReceived: 'PKR 230,000',
  balance: 'PKR 0',
  status: 'Ready'
})

const units = computed(() => {
  const branch = (saleData.value.branch || store.getActiveBranch()).toLowerCase()
  return store.serializedUnits.filter(u => {
    const uBranch = (u.branch || '').toLowerCase()
    if (branch && branch !== 'all branches' && uBranch && uBranch !== branch) {
      return false
    }
    return true
  }).map(u => ({
    ...u,
    serial: u.serial || u.unit_id || u.id,
    chassis: u.chassisNumber || u.chassis || '—',
    statusColor: u.status === 'Available' ? 'bg-[#eefcf2] text-[#165A31]' : (u.statusClass || 'bg-gray-100 text-gray-700'),
    landedCost: u.landedCost || '145.8K'
  }))
})

const customerSearch = ref('')
const showCustomerDropdown = ref(false)
const showCreateCustomerModal = ref(false)
const selectedCustomer = ref(null)
const customerDropdownRef = ref(null)
let customerBlurTimer = null

const handleClickOutside = (e) => {
  if (customerDropdownRef.value && !customerDropdownRef.value.contains(e.target)) {
    showCustomerDropdown.value = false
  }
}

const onCustomerBlur = () => {
  customerBlurTimer = setTimeout(() => {
    showCustomerDropdown.value = false
  }, 200)
}

const filteredCustomers = computed(() => {
  const q = customerSearch.value.toLowerCase()
  if (!q) return store.customers
  return store.customers.filter(c => (c.name && c.name.toLowerCase().includes(q)) || (c.phone && c.phone.includes(q)) || (c.id && c.id.toLowerCase().includes(q)))
})

const selectCustomer = (customer) => {
  if (customerBlurTimer) clearTimeout(customerBlurTimer)
  selectedCustomer.value = customer
  customerSearch.value = customer.name
  saleData.value.customer = customer.name
  saleData.value.customer_id = customer.id || customer.customer_id
  showCustomerDropdown.value = false
}

const openCreateCustomer = () => {
  if (customerBlurTimer) clearTimeout(customerBlurTimer)
  showCustomerDropdown.value = false
  showCreateCustomerModal.value = true
}

const handleCustomerCreated = (c) => {
  const newC = store.addCustomer(c)
  selectCustomer(newC)
  showCreateCustomerModal.value = false
}

const loadData = (data) => {
  if (!data) return
  isEditMode.value = true
  
  if (data.customer) {
    customerSearch.value = data.customer
    saleData.value.customer = data.customer
  }

  saleData.value = {
    ...saleData.value,
    orderNo: data.order || data.orderNo || saleData.value.orderNo,
    branch: data.branch || saleData.value.branch,
    customer: data.customer || saleData.value.customer,
    product: data.product || saleData.value.product,
    selectedUnit: data.unit || data.selectedUnit || saleData.value.selectedUnit,
    finalPrice: data.total || data.amount || saleData.value.finalPrice,
    status: data.status || saleData.value.status,
    paymentMethod: data.paymentMethod || data.method || saleData.value.paymentMethod,
    transactionId: data.transactionId || data.transactionRef || data.ref || '',
    bankAccount: data.bankAccount || saleData.value.bankAccount
  }
}

const parseRupees = (val) => parseFloat(String(val || '0').replace(/[^0-9.]/g, '')) || 0
const formatRupees = (num) => `PKR ${Math.round(num).toLocaleString()}`

watch([() => saleData.value.cataloguePrice, () => saleData.value.discount], () => {
  const cat = parseRupees(saleData.value.cataloguePrice)
  const disc = parseRupees(saleData.value.discount)
  const final = Math.max(0, cat - disc)
  saleData.value.finalPrice = formatRupees(final)
  const recv = parseRupees(saleData.value.amountReceived)
  saleData.value.balance = formatRupees(Math.max(0, final - recv))
})

watch(() => saleData.value.amountReceived, (newRecv) => {
  const final = parseRupees(saleData.value.finalPrice)
  const recv = parseRupees(newRecv)
  saleData.value.balance = formatRupees(Math.max(0, final - recv))
})

const selectUnit = (unit) => {
  saleData.value.selectedUnit = unit.serial
  if (unit.product) saleData.value.product = unit.product
  const p = store.products.find(prod => prod.name === unit.product || prod.id === unit.product_id)
  if (p && p.price) {
    saleData.value.cataloguePrice = p.price
  }
}

onMounted(() => {
  if (props.order) {
    loadData(props.order)
  } else if (store.originalEditOrder) {
    loadData(store.originalEditOrder)
  } else if (props.customer) {
    const custObj = typeof props.customer === 'string' ? store.customers.find(c => c.name === props.customer) : props.customer
    if (custObj) {
      selectCustomer(custObj)
    } else if (typeof props.customer === 'string') {
      saleData.value.customer = props.customer
      customerSearch.value = props.customer
    }
  }
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  if (customerBlurTimer) clearTimeout(customerBlurTimer)
})

watch(() => props.order, (newVal) => {
  if (newVal) loadData(newVal)
})

const close = () => {
  store.originalEditOrder = null
  emit('close')
  if (router.currentRoute.value.path.includes('/create')) {
    router.push('/sales/orders')
  }
}

const createOrder = () => {
  if (!saleData.value.branch || !saleData.value.customer || !saleData.value.selectedUnit || !saleData.value.product) {
    showValidation.value = true
    return
  }

  // Validate Transaction ID if paymentMethod is Bank Transfer
  if (saleData.value.paymentMethod === 'Bank Transfer' && !saleData.value.transactionId?.trim()) {
    showValidation.value = true
    return
  }

  if (saleData.value.paymentMethod === 'Cheque / Pay Order' && !saleData.value.chequeNo?.trim()) {
    showValidation.value = true
    return
  }

  // Prevent selling an already sold or delivered unit
  const unit = store.getUnitById(saleData.value.selectedUnit)
  if (unit && (unit.status === 'Sold' || unit.status === 'Delivered')) {
    alert(`Unit ${unit.serial || saleData.value.selectedUnit} has already been sold and delivered. It cannot be sold again.`)
    return
  }

  const totalNum = parseFloat(String(saleData.value.finalPrice || '0').replace(/[^0-9.]/g, '')) || 230000
  const paidNum = parseFloat(String(saleData.value.amountReceived || '0').replace(/[^0-9.]/g, '')) || 0
  const balanceNum = Math.max(0, totalNum - paidNum)

  const newOrderNo = saleData.value.orderNo || `ORD-${Math.floor(2242 + Math.random() * 100)}`
  const orderPayload = {
    id: isEditMode.value ? (saleData.value.orderNo || 'ORD-2241') : newOrderNo,
    order: isEditMode.value ? (saleData.value.orderNo || 'ORD-2241') : newOrderNo,
    order_id: isEditMode.value ? (saleData.value.orderNo || 'ORD-2241') : newOrderNo,
    orderNo: isEditMode.value ? (saleData.value.orderNo || 'ORD-2241') : newOrderNo,
    branch: saleData.value.branch,
    branch_id: saleData.value.branch === 'Islamabad' ? 'BR-02' : saleData.value.branch === 'Lahore' ? 'BR-03' : saleData.value.branch === 'Rawalpindi' ? 'BR-04' : 'BR-01',
    customer: saleData.value.customer,
    customer_id: selectedCustomer.value?.id || (store.customers.find(c => c.name === saleData.value.customer)?.id) || 'CUST-101',
    product: saleData.value.product,
    product_id: store.getProductById(saleData.value.product)?.id || 'PROD-001',
    unit: saleData.value.selectedUnit,
    unit_id: saleData.value.selectedUnit,
    total: saleData.value.finalPrice || `PKR ${totalNum.toLocaleString()}`,
    rawTotal: totalNum,
    paid: saleData.value.amountReceived || `PKR ${paidNum.toLocaleString()}`,
    rawPaid: paidNum,
    balance: `PKR ${balanceNum.toLocaleString()}`,
    paymentMethod: saleData.value.paymentMethod,
    transactionId: saleData.value.transactionId || '',
    bankAccount: saleData.value.bankAccount || '',
    status: balanceNum === 0 ? 'Ready' : 'Processing',
    statusClass: balanceNum === 0 ? 'bg-[#dcfce7] text-[#165A31]' : 'bg-[#eff6ff] text-[#2563eb]',
    delivery: 'Ready'
  }

  if (isEditMode.value) {
    store.updateOrder(orderPayload.id, orderPayload)
    emit('updated', orderPayload)
  } else {
    store.addOrder(orderPayload)
    // Transition unit to Sold
    store.completeUnitSale(saleData.value.selectedUnit, orderPayload.customer_id, orderPayload.id)
    
    // Create matching invoice
    const invId = `INV-${orderPayload.id.replace('ORD-', '')}`
    const invoice = store.addInvoice({
      id: invId,
      invoice_id: invId,
      invoiceNo: invId,
      order_id: orderPayload.id,
      customer_id: orderPayload.customer_id,
      customer: orderPayload.customer,
      subtotal: totalNum,
      discount: parseFloat(String(saleData.value.discount || '0').replace(/[^0-9.]/g, '')) || 0,
      tax: 0,
      total: totalNum,
      paidAmount: paidNum,
      outstandingAmount: balanceNum,
      status: balanceNum === 0 ? 'Paid' : (paidNum > 0 ? 'Partial' : 'Unpaid'),
      branch: orderPayload.branch,
      items: [
        { description: `${orderPayload.product} (Unit: ${orderPayload.unit})`, quantity: 1, unitPrice: totalNum, total: totalNum }
      ]
    })

    // If initial payment received, record it
    if (paidNum > 0) {
      store.recordInvoicePayment({
        invoiceId: invoice.id,
        amount: paidNum,
        method: saleData.value.paymentMethod || 'Bank Transfer',
        notes: `Initial payment on sale ${orderPayload.id}${saleData.value.transactionId ? ` (Ref: ${saleData.value.transactionId})` : ''}`
      })
    }

    // Schedule delivery handover
    store.addDelivery({
      order: orderPayload.id,
      order_id: orderPayload.id,
      customer: orderPayload.customer,
      customer_id: orderPayload.customer_id,
      unit: orderPayload.unit,
      unit_id: orderPayload.unit,
      branch: orderPayload.branch,
      scheduled: 'Today 16:00',
      status: 'Ready'
    })

    emit('created', orderPayload)
  }
  close()
}
</script>

<template>
  <div class="fixed inset-0 bg-gray-900/60 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm" @click.self="close">
    
    <!-- Close button on top-right of screen overlay -->
    <button @click="close" class="fixed top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full z-[110] shadow-lg transition-colors cursor-pointer border border-gray-200 dark:border-gray-700">
      <X class="w-5 h-5" />
    </button>

    <!-- Modal Card -->
    <div class="bg-white dark:bg-[#161d2b] border border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">
      
      <!-- Scrollable Form Body -->
      <div class="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
        <!-- Header -->
        <div>
          <div class="text-[10px] text-gray-500 dark:text-gray-400 mb-1">
            <span v-if="isBranchUser">Branch Manager / Orders / <span class="font-bold text-gray-800 dark:text-gray-200">{{ isEditMode ? 'Edit Sale / POS' : 'Create Sale / POS' }}</span></span>
            <span v-else>Super Admin / Sales & CRM / <span class="font-bold text-gray-800 dark:text-gray-200">{{ isEditMode ? 'Edit Sale / POS' : 'Create Sale / POS' }}</span></span>
          </div>
          <h1 class="text-[28px] sm:text-[32px] tracking-tight font-bold text-gray-900 dark:text-white">{{ isEditMode ? 'Edit Sale / POS' : 'Create Sale / POS' }}</h1>
          <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Book an electric vehicle sale against a physical showroom chassis VIN, customer profile, and payment receipt.</p>
        </div>

        <!-- 2-Column Grid Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          <!-- Left Column -->
          <div class="space-y-6">
            <!-- 1. Sale Context Card -->
            <div class="bg-white dark:bg-[#1e293b]/70 p-6 rounded-[12px] border border-gray-100 dark:border-gray-800 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="text-[14px] font-bold text-gray-900 dark:text-white">1. Dealership & Customer</h3>
                <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-medium">Step 1 of 4</span>
              </div>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Showroom Branch *</label>
                  <input 
                    v-model="saleData.branch" 
                    type="text" 
                    :disabled="isBranchUser"
                    :class="[
                      'w-full px-3 py-2 text-[12px] bg-white dark:bg-[#0f172a] border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors text-gray-900 dark:text-gray-100',
                      showValidation && !saleData.branch ? 'border-red-500 bg-red-50/20' : 'border-gray-200 dark:border-gray-700',
                      isBranchUser ? 'bg-gray-50 dark:bg-gray-900/60 text-gray-500 dark:text-gray-400 cursor-not-allowed' : ''
                    ]" 
                  />
                  <p v-if="showValidation && !saleData.branch" class="text-[10px] text-red-500 mt-0.5">Branch is required</p>
                </div>
                
                <div ref="customerDropdownRef" class="relative">
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Customer (Name or Mobile #) *</label>
                  <div class="relative">
                    <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      v-model="customerSearch"
                      @focus="showCustomerDropdown = true"
                      @blur="onCustomerBlur"
                      @keydown.escape="showCustomerDropdown = false"
                      @input="showCustomerDropdown = true; saleData.customer = customerSearch"
                      type="text" 
                      placeholder="Search by customer name, phone, or CNIC..."
                      class="w-full pl-9 pr-3.5 py-2 text-[12px] bg-white dark:bg-[#0f172a] border rounded-lg text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-[#165A31] transition-colors"
                      :class="showValidation && !saleData.customer.trim() ? 'border-red-500 bg-red-50/20' : 'border-gray-200 dark:border-gray-700'"
                    />
                  </div>
                  
                  <div v-if="showCustomerDropdown" class="absolute z-20 w-full mt-1 bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                    <button 
                      v-for="c in filteredCustomers" 
                      :key="c.id"
                      type="button"
                      @mousedown.prevent="selectCustomer(c)"
                      @click="selectCustomer(c)"
                      class="w-full text-left px-4 py-2 hover:bg-[#eefcf2] dark:hover:bg-emerald-950/40 flex items-center justify-between border-b border-gray-50 dark:border-gray-800 last:border-0 cursor-pointer"
                    >
                      <div>
                        <div class="text-[12px] font-bold text-gray-800 dark:text-gray-200">{{ c.name }}</div>
                        <div class="text-[10px] text-gray-500 dark:text-gray-400">{{ c.phone }} &bull; {{ c.city || 'Pakistan' }}</div>
                      </div>
                    </button>
                    <button 
                      v-if="filteredCustomers.length === 0" 
                      type="button"
                      @mousedown.prevent="openCreateCustomer"
                      @click="openCreateCustomer"
                      class="w-full text-left px-4 py-3 bg-[#eefcf2] dark:bg-emerald-950/50 hover:bg-[#e2f9ea] dark:hover:bg-emerald-950/70 text-[#165A31] dark:text-emerald-400 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Plus class="w-4 h-4" /> Create New Customer
                    </button>
                    <button 
                      v-else
                      type="button"
                      @mousedown.prevent="openCreateCustomer"
                      @click="openCreateCustomer"
                      class="w-full text-left px-4 py-2 bg-gray-50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 text-[11px] font-semibold border-t border-gray-200 dark:border-gray-700 cursor-pointer transition-colors text-center"
                    >
                      + Add New Customer
                    </button>
                  </div>
                  <p v-if="showValidation && !saleData.customer.trim()" class="text-[10px] text-red-500 font-medium mt-1">Customer selection is required</p>
                </div>
                
                <!-- Selected Customer Preview -->
                <div v-if="selectedCustomer" class="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-100 dark:border-gray-700 text-[11px] mt-1">
                  <div class="font-bold text-gray-800 dark:text-gray-200">{{ selectedCustomer.name }}</div>
                  <div class="text-gray-500 dark:text-gray-400 mt-0.5">{{ selectedCustomer.phone }} &bull; {{ selectedCustomer.email || 'No email' }}</div>
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Sales Executive</label>
                  <input v-model="saleData.salesperson" type="text" class="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Product Model *</label>
                  <input 
                    v-model="saleData.product" 
                    type="text" 
                    :class="['w-full px-3 py-2 text-[12px] bg-white dark:bg-[#0f172a] border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors text-gray-800 dark:text-gray-100', showValidation && !saleData.product ? 'border-red-500 bg-red-50/20' : 'border-gray-200 dark:border-gray-700']" 
                  />
                  <p v-if="showValidation && !saleData.product" class="text-[10px] text-red-500 mt-0.5">Product is required</p>
                </div>
              </div>
            </div>

            <!-- 2. Pricing Card -->
            <div class="bg-white dark:bg-[#1e293b]/70 p-6 rounded-[12px] border border-gray-100 dark:border-gray-800 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="text-[14px] font-bold text-gray-900 dark:text-white">2. Vehicle Price & Discounts</h3>
                <span class="text-[10px] text-gray-500 dark:text-gray-400">All amounts in PKR</span>
              </div>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">MSRP / Catalogue Price</label>
                  <input v-model="saleData.cataloguePrice" type="text" placeholder="e.g. PKR 240,000" class="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
                </div>
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300">Authorized Discount</label>
                    <span class="text-[10px] text-gray-400">Max 8% branch allowance</span>
                  </div>
                  <input v-model="saleData.discount" type="text" placeholder="e.g. PKR 10,000" class="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
                  <p class="text-[10px] text-gray-400 dark:text-gray-500 mt-1">Discounts exceeding 8% will automatically prompt for Head Office Action Centre approval.</p>
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-gray-800 dark:text-gray-200 mb-1">Net Vehicle Sale Price (Payable)</label>
                  <input v-model="saleData.finalPrice" type="text" placeholder="e.g. PKR 230,000" class="w-full px-3 py-2 text-[12px] bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 font-bold rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] transition-colors" />
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-6">
            <!-- 3. Exact Unit Selection Card -->
            <div class="bg-white dark:bg-[#1e293b]/70 p-6 rounded-[12px] border border-gray-100 dark:border-gray-800 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4 overflow-hidden">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-[14px] font-bold text-gray-900 dark:text-white">3. Exact Showroom Unit (Chassis / VIN)</h3>
                  <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Select the physical bike parked on your showroom floor</p>
                </div>
                <span class="text-[10px] px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-medium">{{ units.length }} In Stock</span>
              </div>
              
              <div class="overflow-x-auto max-h-48 overflow-y-auto rounded-lg border border-gray-100 dark:border-gray-800">
                <table class="w-full text-left border-collapse">
                  <thead class="sticky top-0 bg-[#fbfbfc] dark:bg-gray-800/90 backdrop-blur-sm z-10 border-b border-gray-100 dark:border-gray-700 text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider">
                    <tr>
                      <th class="px-4 py-2.5">Serial</th>
                      <th class="px-4 py-2.5">Chassis (VIN)</th>
                      <th class="px-4 py-2.5 text-center">Status</th>
                      <th class="px-4 py-2.5 text-right">Landed Cost</th>
                      <th class="px-4 py-2.5 text-center">Select</th>
                    </tr>
                  </thead>
                  <tbody class="text-[11px]">
                    <tr 
                      v-for="unit in units" 
                      :key="unit.serial" 
                      class="border-b border-gray-50 dark:border-gray-800/60 hover:bg-gray-50/50 dark:hover:bg-gray-800/40 cursor-pointer transition-colors"
                      :class="saleData.selectedUnit === unit.serial ? 'bg-emerald-50/40 dark:bg-emerald-950/30' : ''"
                      @click="selectUnit(unit)"
                    >
                      <td class="px-4 py-3 text-gray-900 dark:text-gray-100 font-semibold">{{ unit.serial }}</td>
                      <td class="px-4 py-3 text-gray-600 dark:text-gray-300 font-medium font-mono text-[10px]">{{ unit.chassis }}</td>
                      <td class="px-4 py-3 text-center">
                        <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold', unit.statusColor]">
                          {{ unit.status }}
                        </span>
                      </td>
                      <td class="px-4 py-3 text-right text-gray-500 dark:text-gray-400 font-medium">{{ unit.landedCost }}</td>
                      <td class="px-4 py-3 text-center">
                        <input type="radio" :value="unit.serial" v-model="saleData.selectedUnit" class="w-3.5 h-3.5 text-[#165A31] focus:ring-[#165A31] border-gray-300 dark:border-gray-600 cursor-pointer" @click.stop="selectUnit(unit)" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p v-if="showValidation && !saleData.selectedUnit" class="text-[10px] text-red-500 font-medium">Please select an available vehicle chassis number</p>
            </div>

            <!-- 4. Payment Card -->
            <div class="bg-white dark:bg-[#1e293b]/70 p-6 rounded-[12px] border border-gray-100 dark:border-gray-800 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="text-[14px] font-bold text-gray-900 dark:text-white">4. Payment & Down Deposit</h3>
                <span class="text-[10px] px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 font-medium">Step 4 of 4</span>
              </div>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Payment Method *</label>
                  <select 
                    v-model="saleData.paymentMethod" 
                    class="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors cursor-pointer"
                  >
                    <option value="Bank Transfer">Bank Transfer / Online Wire (IBFT)</option>
                    <option value="Cash">Cash at Counter (Showroom Register)</option>
                    <option value="Cheque / Pay Order">Cheque / Pay Order</option>
                    <option value="Card / POS Terminal">Debit / Credit Card (POS Terminal)</option>
                    <option value="Online Payment Gateway">Digital QR / Mobile Gateway</option>
                  </select>
                </div>

                <!-- Conditional Transaction ID & Bank Account for Bank Transfer / Card / Online -->
                <div v-if="saleData.paymentMethod === 'Bank Transfer' || saleData.paymentMethod === 'Card / POS Terminal' || saleData.paymentMethod === 'Online Payment Gateway'" class="space-y-3 p-3.5 bg-emerald-50/40 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-800/60">
                  <div>
                    <label class="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Bank Transaction ID / IBFT Ref # *
                    </label>
                    <input 
                      v-model="saleData.transactionId" 
                      type="text" 
                      placeholder="e.g. TXN-984210-MEEZAN" 
                      class="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#0f172a] border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors font-mono text-gray-900 dark:text-gray-100"
                      :class="showValidation && saleData.paymentMethod === 'Bank Transfer' && !saleData.transactionId?.trim() ? 'border-red-500 bg-red-50/20' : 'border-gray-200 dark:border-gray-700'"
                    />
                    <p v-if="showValidation && saleData.paymentMethod === 'Bank Transfer' && !saleData.transactionId?.trim()" class="text-[10px] text-red-500 font-medium mt-1">Transaction ID is required for bank transfer</p>
                  </div>
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Target Deposit Bank Account</label>
                    <select 
                      v-model="saleData.bankAccount"
                      class="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors cursor-pointer"
                    >
                      <option value="Meezan Bank - Main Operations (PK02MEZN00123456789)">Meezan Bank - Main Operations (PK02MEZN00123456789)</option>
                      <option value="Habib Bank Limited (HBL) - Corporate (PK12HABB00987654321)">Habib Bank Limited (HBL) - Corporate (PK12HABB00987654321)</option>
                      <option value="Bank Alfalah - Commercial Collections (PK34ALFH00456123789)">Bank Alfalah - Commercial Collections (PK34ALFH00456123789)</option>
                    </select>
                  </div>
                </div>

                <!-- Conditional Cheque fields -->
                <div v-if="saleData.paymentMethod === 'Cheque / Pay Order'" class="space-y-3 p-3.5 bg-amber-50/40 dark:bg-amber-950/30 rounded-xl border border-amber-100 dark:border-amber-800/60">
                  <div>
                    <label class="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">Cheque / Pay Order # *</label>
                    <input 
                      v-model="saleData.chequeNo" 
                      type="text" 
                      placeholder="e.g. CHQ-889012" 
                      class="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#0f172a] border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors text-gray-900 dark:text-gray-100"
                      :class="showValidation && !saleData.chequeNo?.trim() ? 'border-red-500 bg-red-50/20' : 'border-gray-200 dark:border-gray-700'"
                    />
                  </div>
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Drawee Bank Name</label>
                    <input 
                      v-model="saleData.draweeBank" 
                      type="text" 
                      placeholder="e.g. MCB Bank Limited" 
                      class="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Amount Received</label>
                    <input v-model="saleData.amountReceived" type="text" placeholder="e.g. PKR 230,000" class="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 font-semibold rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
                  </div>
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Remaining Balance</label>
                    <input v-model="saleData.balance" type="text" placeholder="PKR 0" readonly class="w-full px-3 py-2 text-[12px] bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-lg cursor-not-allowed" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-between gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div class="text-[11px] text-gray-500 dark:text-gray-400">
            Booking reserves chassis VIN immediately. Balance must reach PKR 0 before handover gate pass is issued.
          </div>
          <div class="flex items-center gap-3">
            <button @click="close" class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer shadow-sm">
              Cancel
            </button>
            <button @click="createOrder" class="bg-[#165A31] hover:bg-[#124a28] text-white text-xs font-semibold px-6 py-2.5 rounded-lg transition-colors cursor-pointer shadow-md flex items-center gap-2">
              <Check class="w-4 h-4" />
              {{ isEditMode ? 'Update Order' : 'Create Order & Reserve Unit' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <Teleport to="body">
      <CreateCustomerModal 
        v-if="showCreateCustomerModal" 
        :isModal="true" 
        @close="showCreateCustomerModal = false"
        @created="handleCustomerCreated"
      />
    </Teleport>
  </div>
</template>
