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
  <div class="fixed inset-0 bg-gray-900/50 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm" @click.self="close">
    
    <!-- Close button on top-right of screen overlay -->
    <button @click="close" class="fixed top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-100 rounded-full z-[110] shadow-lg transition-colors cursor-pointer">
      <X class="w-5 h-5" />
    </button>

    <!-- Modal Card -->
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">
      
      <!-- Scrollable Form Body -->
      <div class="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
        <!-- Header -->
        <div>
          <div class="text-[10px] text-gray-500 mb-1">
            <span v-if="isBranchUser">Branch Manager / Orders / <span class="font-bold text-gray-800">{{ isEditMode ? 'Edit Sale / POS' : 'Create Sale / POS' }}</span></span>
            <span v-else>Super Admin / Sales & CRM / <span class="font-bold text-gray-800">{{ isEditMode ? 'Edit Sale / POS' : 'Create Sale / POS' }}</span></span>
          </div>
          <h1 class="text-[32px] tracking-tight font-bold text-gray-900">{{ isEditMode ? 'Edit Sale / POS' : 'Create Sale / POS' }}</h1>
          <p class="text-sm text-gray-500 mt-1">Create a sale against an exact serialized unit, customer and payment record.</p>
        </div>

        <!-- 2-Column Grid Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          <!-- Left Column -->
          <div class="space-y-6">
            <!-- 1. Sale Context Card -->
            <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
              <h3 class="text-[14px] font-bold text-gray-900 mb-4">Sale Context</h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Branch *</label>
                  <input 
                    v-model="saleData.branch" 
                    type="text" 
                    :disabled="isBranchUser"
                    :class="[
                      'w-full px-3 py-2 text-[12px] bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors',
                      showValidation && !saleData.branch ? 'border-red-500 bg-red-50/20' : 'border-gray-200',
                      isBranchUser ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''
                    ]" 
                  />
                  <p v-if="showValidation && !saleData.branch" class="text-[10px] text-red-500 mt-0.5">Branch is required</p>
                </div>
                
                <div ref="customerDropdownRef" class="relative">
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Customer *</label>
                  <div class="relative">
                    <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      v-model="customerSearch"
                      @focus="showCustomerDropdown = true"
                      @blur="onCustomerBlur"
                      @keydown.escape="showCustomerDropdown = false"
                      @input="showCustomerDropdown = true; saleData.customer = customerSearch"
                      type="text" 
                      placeholder="Search customer..."
                      class="w-full pl-9 pr-3.5 py-2 text-[12px] bg-white border rounded-lg text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                      :class="showValidation && !saleData.customer.trim() ? 'border-red-500 bg-red-50/20' : 'border-gray-200'"
                    />
                  </div>
                  
                  <div v-if="showCustomerDropdown" class="absolute z-20 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                    <button 
                      v-for="c in filteredCustomers" 
                      :key="c.id"
                      type="button"
                      @mousedown.prevent="selectCustomer(c)"
                      @click="selectCustomer(c)"
                      class="w-full text-left px-4 py-2 hover:bg-[#eefcf2] flex items-center justify-between border-b border-gray-50 last:border-0 cursor-pointer"
                    >
                      <div>
                        <div class="text-[12px] font-bold text-gray-800">{{ c.name }}</div>
                        <div class="text-[10px] text-gray-500">{{ c.phone }}</div>
                      </div>
                    </button>
                    <button 
                      v-if="filteredCustomers.length === 0" 
                      type="button"
                      @mousedown.prevent="openCreateCustomer"
                      @click="openCreateCustomer"
                      class="w-full text-left px-4 py-3 bg-[#eefcf2] hover:bg-[#e2f9ea] text-[#165A31] text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Plus class="w-4 h-4" /> Create New Customer
                    </button>
                    <button 
                      v-else
                      type="button"
                      @mousedown.prevent="openCreateCustomer"
                      @click="openCreateCustomer"
                      class="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 text-[11px] font-semibold border-t border-gray-200 cursor-pointer transition-colors text-center"
                    >
                      + Add New Customer
                    </button>
                  </div>
                  <p v-if="showValidation && !saleData.customer.trim()" class="text-[10px] text-red-500 font-medium mt-1">Customer name is required</p>
                </div>
                
                <!-- Selected Customer Preview -->
                <div v-if="selectedCustomer" class="p-3 bg-gray-50 rounded-lg border border-gray-100 text-[11px] mt-1">
                  <div class="font-bold text-gray-800">{{ selectedCustomer.name }}</div>
                  <div class="text-gray-500 mt-0.5">{{ selectedCustomer.phone }} &bull; {{ selectedCustomer.email }}</div>
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Salesperson</label>
                  <input v-model="saleData.salesperson" type="text" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Product *</label>
                  <input 
                    v-model="saleData.product" 
                    type="text" 
                    :class="['w-full px-3 py-2 text-[12px] bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors', showValidation && !saleData.product ? 'border-red-500 bg-red-50/20' : 'border-gray-200']" 
                  />
                  <p v-if="showValidation && !saleData.product" class="text-[10px] text-red-500 mt-0.5">Product is required</p>
                </div>
              </div>
            </div>

            <!-- 2. Pricing Card -->
            <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
              <h3 class="text-[14px] font-bold text-gray-900 mb-4">Pricing</h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Catalogue Price</label>
                  <input v-model="saleData.cataloguePrice" type="text" placeholder="e.g. PKR 240,000" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Discount</label>
                  <input v-model="saleData.discount" type="text" placeholder="e.g. PKR 10,000" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Final Price</label>
                  <input v-model="saleData.finalPrice" type="text" placeholder="e.g. PKR 230,000" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-6">
            <!-- 3. Exact Unit Selection Card -->
            <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4 overflow-hidden">
              <h3 class="text-[14px] font-bold text-gray-900 mb-4">Exact Unit Selection</h3>
              
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      <th class="px-4 py-3">Serial</th>
                      <th class="px-4 py-3">Chassis</th>
                      <th class="px-4 py-3 text-center">Status</th>
                      <th class="px-4 py-3 text-right">Landed Cost</th>
                      <th class="px-4 py-3 text-center">Select</th>
                    </tr>
                  </thead>
                  <tbody class="text-[11px]">
                    <tr v-for="unit in units" :key="unit.serial" class="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer" @click="saleData.selectedUnit = unit.serial">
                      <td class="px-4 py-3.5 text-gray-900 font-semibold">{{ unit.serial }}</td>
                      <td class="px-4 py-3.5 text-gray-600 font-medium">{{ unit.chassis }}</td>
                      <td class="px-4 py-3.5 text-center">
                        <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold', unit.statusColor]">
                          {{ unit.status }}
                        </span>
                      </td>
                      <td class="px-4 py-3.5 text-right text-gray-600 font-medium">{{ unit.landedCost }}</td>
                      <td class="px-4 py-3.5 text-center">
                        <input type="radio" :value="unit.serial" v-model="saleData.selectedUnit" class="w-3.5 h-3.5 text-[#165A31] focus:ring-[#165A31] border-gray-300 cursor-pointer" @click.stop />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- 4. Payment Card -->
            <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
              <h3 class="text-[14px] font-bold text-gray-900 mb-4">Payment</h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Payment Method *</label>
                  <select 
                    v-model="saleData.paymentMethod" 
                    class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors cursor-pointer"
                  >
                    <option value="Bank Transfer">Bank Transfer / Direct Wire</option>
                    <option value="Cash">Cash at Counter</option>
                    <option value="Cheque / Pay Order">Cheque / Pay Order</option>
                    <option value="Card / POS Terminal">Card / POS Terminal</option>
                    <option value="Online Payment Gateway">Online Payment Gateway</option>
                  </select>
                </div>

                <!-- Conditional Transaction ID & Bank Account for Bank Transfer / Card / Online -->
                <div v-if="saleData.paymentMethod === 'Bank Transfer' || saleData.paymentMethod === 'Card / POS Terminal' || saleData.paymentMethod === 'Online Payment Gateway'" class="space-y-3 p-3.5 bg-emerald-50/40 rounded-xl border border-emerald-100">
                  <div>
                    <label class="block text-[11px] font-bold text-gray-700 mb-1">
                      Transaction ID / Reference Number *
                    </label>
                    <input 
                      v-model="saleData.transactionId" 
                      type="text" 
                      placeholder="e.g. TXN-984210-MEEZAN" 
                      class="w-full px-3 py-2 text-[12px] bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors font-mono"
                      :class="showValidation && saleData.paymentMethod === 'Bank Transfer' && !saleData.transactionId?.trim() ? 'border-red-500 bg-red-50/20' : 'border-gray-200'"
                    />
                    <p v-if="showValidation && saleData.paymentMethod === 'Bank Transfer' && !saleData.transactionId?.trim()" class="text-[10px] text-red-500 font-medium mt-1">Transaction ID is required for bank transfer</p>
                  </div>
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-700 mb-1">Target Deposit Bank Account</label>
                    <select 
                      v-model="saleData.bankAccount"
                      class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors cursor-pointer"
                    >
                      <option value="Meezan Bank - Main Operations (PK02MEZN00123456789)">Meezan Bank - Main Operations (PK02MEZN00123456789)</option>
                      <option value="Habib Bank Limited (HBL) - Corporate (PK12HABB00987654321)">Habib Bank Limited (HBL) - Corporate (PK12HABB00987654321)</option>
                      <option value="Bank Alfalah - Commercial Collections (PK34ALFH00456123789)">Bank Alfalah - Commercial Collections (PK34ALFH00456123789)</option>
                    </select>
                  </div>
                </div>

                <!-- Conditional Cheque fields -->
                <div v-if="saleData.paymentMethod === 'Cheque / Pay Order'" class="space-y-3 p-3.5 bg-amber-50/40 rounded-xl border border-amber-100">
                  <div>
                    <label class="block text-[11px] font-bold text-gray-700 mb-1">Cheque / Pay Order # *</label>
                    <input 
                      v-model="saleData.chequeNo" 
                      type="text" 
                      placeholder="e.g. CHQ-889012" 
                      class="w-full px-3 py-2 text-[12px] bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors"
                      :class="showValidation && !saleData.chequeNo?.trim() ? 'border-red-500 bg-red-50/20' : 'border-gray-200'"
                    />
                  </div>
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-700 mb-1">Drawee Bank Name</label>
                    <input 
                      v-model="saleData.draweeBank" 
                      type="text" 
                      placeholder="e.g. MCB Bank Limited" 
                      class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Amount Received</label>
                  <input v-model="saleData.amountReceived" type="text" placeholder="e.g. PKR 230,000" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Balance</label>
                  <input v-model="saleData.balance" type="text" placeholder="PKR 0" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-end gap-3 pt-2">
          <button @click="close" class="bg-white border border-gray-200 text-gray-700 text-xs font-semibold px-5 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-sm">
            Cancel
          </button>
          <button @click="createOrder" class="bg-[#165A31] text-white text-xs font-semibold px-5 py-2 rounded-lg hover:bg-[#124a28] transition-colors cursor-pointer shadow-sm">
            {{ isEditMode ? 'Update Order' : 'Create Order & Reserve Unit' }}
          </button>
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
