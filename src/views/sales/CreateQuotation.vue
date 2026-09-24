<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../../store.js'
import { X, Plus, Trash2, Search } from 'lucide-vue-next'
import CreateCustomerModal from './CreateCustomer.vue'

const props = defineProps({
  isModal: {
    type: Boolean,
    default: true
  },
  quotation: {
    type: Object,
    default: null
  },
  customer: {
    type: [Object, String],
    default: null
  }
})

const emit = defineEmits(['close', 'created', 'updated'])
const router = useRouter()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const isEditMode = ref(false)
const showValidation = ref(false)

const form = ref({
  id: '',
  quote: '',
  customer: '',
  items: [{ product: 'BRG E-125', quantity: 1, sellingPrice: 280000, warranty: '1-Year Standard Service' }],
  discount: 5000,
  validity: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  paymentTerms: '100% Advance / Bank Transfer',
  taxRegFees: 'Included in Quote',
  deliveryLeadTime: 'Within 3 business days',
  notes: 'Customer requested delivery within 3 days',
  status: 'Open',
  branch: user.value?.branchName || 'Peshawar'
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
  form.value.customer = customer.name
  form.value.customer_id = customer.id || customer.customer_id
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

const addItem = () => {
  form.value.items.push({ product: '', quantity: 1, sellingPrice: 0, warranty: '1-Year Standard Service' })
}

const removeItem = (idx) => {
  if (form.value.items.length > 1) {
    form.value.items.splice(idx, 1)
  }
}

const loadData = (data) => {
  if (!data) return
  isEditMode.value = true
  
  if (data.customer) {
    customerSearch.value = data.customer
    form.value.customer = data.customer
  }

  form.value = {
    ...form.value,
    id: data.id || data.quote || form.value.id,
    quote: data.quote || data.id || form.value.quote,
    customer: data.customer || form.value.customer,
    items: data.items || form.value.items,
    discount: data.discount ? parseInt(String(data.discount).replace(/[^0-9]/g, '')) : form.value.discount,
    validity: data.validity || form.value.validity,
    paymentTerms: data.paymentTerms || form.value.paymentTerms,
    taxRegFees: data.taxRegFees || form.value.taxRegFees,
    deliveryLeadTime: data.deliveryLeadTime || form.value.deliveryLeadTime,
    notes: data.notes || form.value.notes,
    status: data.status || form.value.status,
    branch: data.branch || form.value.branch
  }
}

onMounted(() => {
  if (props.quotation) {
    loadData(props.quotation)
  } else if (store.originalEditQuotation) {
    loadData(store.originalEditQuotation)
  } else if (props.customer) {
    const custObj = typeof props.customer === 'string' ? store.customers.find(c => c.name === props.customer) : props.customer
    if (custObj) {
      selectCustomer(custObj)
    } else if (typeof props.customer === 'string') {
      form.value.customer = props.customer
      customerSearch.value = props.customer
    }
  }
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  if (customerBlurTimer) clearTimeout(customerBlurTimer)
})

watch(() => props.quotation, (newVal) => {
  if (newVal) loadData(newVal)
}, { immediate: true })

const close = () => {
  store.originalEditQuotation = null
  emit('close')
  if (router.currentRoute.value.path.includes('/create')) {
    router.push('/sales/quotations')
  }
}

const saveAndSend = () => {
  if (!form.value.customer.trim() || form.value.items.some(i => !i.product.trim())) {
    showValidation.value = true
    return
  }

  const subtotal = form.value.items.reduce((acc, curr) => acc + (Number(curr.sellingPrice) * Number(curr.quantity)), 0)
  const discount = Number(form.value.discount) || 0
  const netTotal = Math.max(0, subtotal - discount)

  const payload = {
    id: form.value.quote || `QT-${Math.floor(1885 + Math.random() * 100)}`,
    quote: form.value.quote || `QT-${Math.floor(1885 + Math.random() * 100)}`,
    quote_id: form.value.quote || `QT-${Math.floor(1885 + Math.random() * 100)}`,
    customer: form.value.customer,
    customer_id: selectedCustomer.value?.id || (store.customers.find(c => c.name === form.value.customer)?.id) || 'CUST-101',
    items: form.value.items,
    product: form.value.items[0]?.product || 'BRG E-125',
    product_id: store.getProductById(form.value.items[0]?.product)?.id || 'PROD-001',
    quantity: form.value.items.reduce((acc, curr) => acc + Number(curr.quantity), 0) + ' units',
    sellingPrice: `PKR ${subtotal.toLocaleString()}`,
    subtotal: `PKR ${subtotal.toLocaleString()}`,
    rawSubtotal: subtotal,
    discount: `PKR ${discount.toLocaleString()}`,
    rawDiscount: discount,
    total: `PKR ${netTotal.toLocaleString()}`,
    rawTotal: netTotal,
    value: `PKR ${netTotal.toLocaleString()}`,
    validity: form.value.validity,
    validTill: form.value.validity,
    paymentTerms: form.value.paymentTerms,
    taxRegFees: form.value.taxRegFees,
    deliveryLeadTime: form.value.deliveryLeadTime,
    notes: form.value.notes,
    status: form.value.status || 'Sent',
    statusClass: form.value.status === 'Accepted' ? 'bg-[#dcfce7] text-[#165A31]' : 'bg-[#eff6ff] text-[#2563eb]',
    branch: form.value.branch || user.value?.branchName || 'Peshawar',
    branch_id: form.value.branch === 'Islamabad' ? 'BR-02' : form.value.branch === 'Lahore' ? 'BR-03' : form.value.branch === 'Rawalpindi' ? 'BR-04' : 'BR-01',
    date: 'Today'
  }

  if (isEditMode.value) {
    store.updateQuotation(payload.id, payload)
    emit('updated', payload)
  } else {
    store.addQuotation(payload)
    emit('created', payload)
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

    <div class="bg-white dark:bg-[#161d2b] border border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">
      <!-- Scrollable Body -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <div>
            <div class="text-[10px] text-gray-500 dark:text-gray-400 mb-1">
              <span v-if="isBranchUser">Branch Manager / Quotations / <span class="font-bold text-gray-800 dark:text-gray-200">{{ isEditMode ? 'Edit Quotation' : 'Create Quotation' }}</span></span>
              <span v-else>Super Admin / Sales / Quotations / <span class="font-bold text-gray-800 dark:text-gray-200">{{ isEditMode ? 'Edit Quotation' : 'Create Quotation' }}</span></span>
            </div>
            <h1 class="text-[28px] sm:text-[32px] tracking-tight font-bold text-gray-900 dark:text-white">{{ isEditMode ? 'Edit Quotation' : 'Create Quotation' }}</h1>
            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Generate an official commercial price quotation with live catalog pricing, terms, and authorized discounts.</p>
          </div>
        </div>

        <!-- 2 Column Form Grid -->
        <form @submit.prevent="saveAndSend" class="space-y-6">
          <!-- Super Admin Branch Selector -->
          <div v-if="!isBranchUser" class="bg-white dark:bg-[#1e293b]/70 border border-gray-100 dark:border-gray-800 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
            <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-2">Branch Assignment</h3>
            <div class="max-w-xs">
              <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Origin Showroom</label>
              <select v-model="form.branch" class="w-full px-3.5 py-2 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-lg text-xs focus:border-[#165A31] focus:ring-0">
                <option>Peshawar</option>
                <option>Islamabad</option>
                <option>Lahore</option>
                <option>Rawalpindi</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Left Card: Customer & Details -->
            <div class="bg-white dark:bg-[#1e293b]/70 border border-gray-100 dark:border-gray-800 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
              <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-4">Customer & Commercial Terms</h3>
              
              <!-- Customer Autocomplete -->
              <div ref="customerDropdownRef" class="relative">
                <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Customer Name / Phone *</label>
                <div class="relative">
                  <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    v-model="customerSearch"
                    @focus="showCustomerDropdown = true"
                    @blur="onCustomerBlur"
                    @keydown.escape="showCustomerDropdown = false"
                    @input="showCustomerDropdown = true; form.customer = customerSearch"
                    type="text" 
                    placeholder="Search customer by name, mobile, or CNIC..."
                    class="w-full pl-9 pr-3.5 py-2 bg-white dark:bg-[#0f172a] border rounded-lg text-xs text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-[#165A31] transition-colors"
                    :class="showValidation && !form.customer.trim() ? 'border-red-300 bg-red-50/20' : 'border-gray-200 dark:border-gray-700'"
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
                      <div class="text-xs font-bold text-gray-800 dark:text-gray-200">{{ c.name }}</div>
                      <div class="text-[10px] text-gray-500 dark:text-gray-400">{{ c.phone }}</div>
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
                <p v-if="showValidation && !form.customer.trim()" class="text-[10px] text-red-500 font-medium mt-1">Customer name is required</p>
              </div>

              <!-- Selected Customer Preview -->
              <div v-if="selectedCustomer" class="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-100 dark:border-gray-700 text-[11px]">
                <div class="font-bold text-gray-800 dark:text-gray-200">{{ selectedCustomer.name }}</div>
                <div class="text-gray-500 dark:text-gray-400 mt-0.5">{{ selectedCustomer.phone }} &bull; {{ selectedCustomer.email || 'No email' }}</div>
              </div>
              
              <div class="pt-2">
                <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-4 border-t border-gray-100 dark:border-gray-800 pt-4">Delivery & Validity Terms</h3>
                
                <div class="space-y-4">
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Payment Terms</label>
                    <select v-model="form.paymentTerms" class="w-full px-3.5 py-2 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-lg text-xs focus:border-[#165A31] focus:ring-0">
                      <option>100% Advance / Bank Transfer</option>
                      <option>50% Deposit / 50% on Handover</option>
                      <option>Corporate Fleet 30-Day Terms</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Tax / Registration Fees</label>
                    <select v-model="form.taxRegFees" class="w-full px-3.5 py-2 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-lg text-xs focus:border-[#165A31] focus:ring-0">
                      <option>Included in Quote</option>
                      <option>Excluded (Paid Separately at Excise)</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Delivery Lead Time</label>
                    <input v-model="form.deliveryLeadTime" type="text" class="w-full px-3.5 py-2 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-lg text-xs focus:border-[#165A31] focus:ring-0" placeholder="e.g. Within 3 business days" />
                  </div>
                  
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Quotation Valid Until</label>
                    <input v-model="form.validity" type="date" class="w-full px-3.5 py-2 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-lg text-xs focus:border-[#165A31] focus:ring-0" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Card: Line Items -->
            <div class="bg-white dark:bg-[#1e293b]/70 border border-gray-100 dark:border-gray-800 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 flex flex-col">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h3 class="text-sm font-bold text-gray-900 dark:text-white">Vehicles & Quoted Items</h3>
                  <p class="text-[11px] text-gray-500 dark:text-gray-400">All prices in Pakistani Rupees (PKR)</p>
                </div>
                <button type="button" @click="addItem" class="text-xs font-bold text-[#165A31] dark:text-emerald-400 bg-[#eefcf2] dark:bg-emerald-950/60 px-2.5 py-1.5 rounded-lg hover:bg-[#dcfce7] dark:hover:bg-emerald-950/80 transition-colors cursor-pointer flex items-center gap-1">
                  <Plus class="w-3.5 h-3.5" /> Add Vehicle
                </button>
              </div>
              
              <div class="space-y-4 flex-1">
                <div v-for="(item, idx) in form.items" :key="idx" class="p-4 bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 rounded-xl relative group">
                  <button v-if="form.items.length > 1" type="button" @click="removeItem(idx)" class="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-white dark:hover:bg-gray-700 rounded cursor-pointer transition-colors">
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                  
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="sm:col-span-2">
                      <label class="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Product Model *</label>
                      <select v-model="item.product" class="w-full px-3 py-2 bg-white dark:bg-[#0f172a] border rounded text-xs text-gray-800 dark:text-gray-100 focus:border-[#165A31] focus:ring-0" :class="showValidation && !item.product ? 'border-red-300' : 'border-gray-200 dark:border-gray-700'">
                        <option value="">Select a product...</option>
                        <option>BRG E-125</option>
                        <option>BRG X7</option>
                        <option>BRG M3</option>
                        <option>BRG DS11</option>
                        <option>Standard Fast Charger 72V</option>
                        <option>Safety Helmet (Certified)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label class="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Quantity</label>
                      <input v-model="item.quantity" type="number" min="1" class="w-full px-3 py-2 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded text-xs focus:border-[#165A31] focus:ring-0" />
                    </div>
                    
                    <div>
                      <label class="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Unit Price (PKR)</label>
                      <input v-model="item.sellingPrice" type="number" min="0" class="w-full px-3 py-2 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded text-xs focus:border-[#165A31] focus:ring-0" />
                    </div>
                    
                    <div class="sm:col-span-2">
                      <label class="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Warranty Package</label>
                      <select v-model="item.warranty" class="w-full px-3 py-2 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded text-xs focus:border-[#165A31] focus:ring-0">
                        <option>1-Year Standard Service</option>
                        <option>2-Year Official Battery & Motor Warranty</option>
                        <option>No Warranty (Accessories)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">Subtotal</span>
                  <span class="text-xs font-bold text-gray-800 dark:text-gray-200">PKR {{ form.items.reduce((acc, curr) => acc + (Number(curr.sellingPrice) * Number(curr.quantity)), 0).toLocaleString() }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 block">Overall Discount (PKR)</span>
                    <span class="text-[10px] text-gray-400 dark:text-gray-500">Max 8% branch allowance</span>
                  </div>
                  <input v-model="form.discount" type="number" min="0" class="w-28 px-2.5 py-1.5 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded text-xs text-right focus:border-[#165A31] focus:ring-0 font-semibold" />
                </div>
                <div class="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                  <span class="text-sm font-bold text-gray-900 dark:text-white">Net Quoted Total</span>
                  <span class="text-lg font-bold text-[#165A31] dark:text-emerald-400">PKR {{ (form.items.reduce((acc, curr) => acc + (Number(curr.sellingPrice) * Number(curr.quantity)), 0) - Number(form.discount)).toLocaleString() }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-[#1e293b]/70 border border-gray-100 dark:border-gray-800 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
            <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-2">Remarks & Internal Justification</h3>
            <textarea 
              v-model="form.notes"
              rows="3"
              placeholder="Enter customer special requests or business justification for special pricing..."
              class="w-full px-3.5 py-2 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-[#165A31] transition-colors resize-none"
            ></textarea>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 pt-2">
            <button 
              type="button" 
              @click="close" 
              class="px-5 py-2.5 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="bg-[#165A31] hover:bg-[#124a28] text-white text-xs font-bold px-6 py-2.5 rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              {{ isEditMode ? 'Update Quotation' : 'Save & Send' }}
            </button>
          </div>
        </form>
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
