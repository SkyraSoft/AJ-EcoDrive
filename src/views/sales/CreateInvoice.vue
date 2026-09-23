<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../../store.js'
import { X, Plus, Trash2, Search, FileText } from 'lucide-vue-next'
import CreateCustomerModal from './CreateCustomer.vue'

const props = defineProps({
  isModal: {
    type: Boolean,
    default: true
  },
  invoice: {
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
  invoiceNo: '',
  customer: '',
  relatedReference: '',
  items: [{ description: '', quantity: 1, unitPrice: 0 }],
  discount: 0,
  tax: 0,
  issueDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  paymentTerms: 'Bank Transfer (Default)',
  notes: 'Thank you for your business.',
  status: 'Unpaid',
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
  return store.customers.filter(c => (c.name && c.name.toLowerCase().includes(q)) || (c.phone && c.phone.includes(q)))
})

const selectCustomer = (customer) => {
  if (customerBlurTimer) clearTimeout(customerBlurTimer)
  selectedCustomer.value = customer
  customerSearch.value = customer.name
  form.value.customer = customer.name
  showCustomerDropdown.value = false
}

const openCreateCustomer = () => {
  if (customerBlurTimer) clearTimeout(customerBlurTimer)
  showCustomerDropdown.value = false
  showCreateCustomerModal.value = true
}

const handleCustomerCreated = (c) => {
  store.addCustomer(c)
  selectCustomer(c)
  showCreateCustomerModal.value = false
}

const addItem = () => {
  form.value.items.push({ description: '', quantity: 1, unitPrice: 0 })
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
    id: data.id || data.invoiceNo || form.value.id,
    invoiceNo: data.invoiceNo || data.id || form.value.invoiceNo,
    customer: data.customer || form.value.customer,
    relatedReference: data.order || data.orderNo || form.value.relatedReference,
    items: data.items || form.value.items,
    discount: data.discount || form.value.discount,
    status: data.status || data.paymentStatus || form.value.status,
    branch: data.branch || form.value.branch
  }
}

onMounted(() => {
  if (props.invoice) {
    loadData(props.invoice)
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

watch(() => props.invoice, (newVal) => {
  if (newVal) loadData(newVal)
}, { immediate: true })

const close = () => {
  emit('close')
  if (router.currentRoute.value.path.includes('/create')) {
    router.push('/sales/invoices')
  }
}

const subtotal = computed(() => {
  return form.value.items.reduce((acc, curr) => acc + (Number(curr.unitPrice) * Number(curr.quantity)), 0)
})

const total = computed(() => {
  return subtotal.value - Number(form.value.discount) + Number(form.value.tax)
})

const saveAndSend = () => {
  if (!form.value.customer.trim() || form.value.items.some(i => !i.description.trim())) {
    showValidation.value = true
    return
  }

  const payload = {
    invoice: form.value.invoiceNo || `INV-${Math.floor(4000 + Math.random() * 999)}`,
    invoiceNo: form.value.invoiceNo || `INV-${Math.floor(4000 + Math.random() * 999)}`,
    customer: form.value.customer,
    orderNo: form.value.relatedReference || '-',
    order: form.value.relatedReference || '-',
    amount: `PKR ${total.value.toLocaleString()}`,
    status: form.value.status || 'Unpaid',
    paymentStatus: form.value.status || 'Unpaid',
    statusClass: 'bg-yellow-50 text-yellow-700',
    statusColor: 'bg-yellow-50 text-yellow-700',
    branch: form.value.branch || user.value?.branchName || 'Peshawar',
    issued: 'Today'
  }

  if (isEditMode.value) {
    store.updateInvoice(payload)
    emit('updated', payload)
  } else {
    store.addInvoice(payload)
    emit('created', payload)
  }
  close()
}
</script>

<template>
  <div class="fixed inset-0 bg-gray-900/50 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm" @click.self="close">
    <button @click="close" class="fixed top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-100 rounded-full z-[110] shadow-lg transition-colors cursor-pointer">
      <X class="w-5 h-5" />
    </button>

    <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <div>
            <div class="text-[10px] text-gray-500 mb-1">
              <span v-if="isBranchUser">Branch Manager / Invoices / <span class="font-bold text-gray-800">{{ isEditMode ? 'Edit Invoice' : 'Create Custom Invoice' }}</span></span>
              <span v-else>Super Admin / Sales / Invoices / <span class="font-bold text-gray-800">{{ isEditMode ? 'Edit Invoice' : 'Create Custom Invoice' }}</span></span>
            </div>
            <h1 class="text-[28px] sm:text-[32px] tracking-tight font-bold text-gray-900">{{ isEditMode ? 'Edit Invoice' : 'Create Custom Invoice' }}</h1>
            <p class="text-xs sm:text-sm text-gray-500 mt-1">Generate a standalone invoice for services, deposits, or non-serialized items.</p>
          </div>
        </div>

        <form @submit.prevent="saveAndSend" class="space-y-6">
          <div v-if="!isBranchUser" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
            <h3 class="text-sm font-bold text-gray-900 mb-2">Assignment</h3>
            <div class="max-w-xs">
              <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Branch</label>
              <select v-model="form.branch" class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:border-[#165A31] focus:ring-0">
                <option>Peshawar</option>
                <option>Islamabad</option>
                <option>Lahore</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
              <h3 class="text-sm font-bold text-gray-900 mb-4">Customer Details</h3>
              
              <div ref="customerDropdownRef" class="relative">
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Customer Name *</label>
                <div class="relative">
                  <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    v-model="customerSearch"
                    @focus="showCustomerDropdown = true"
                    @blur="onCustomerBlur"
                    @keydown.escape="showCustomerDropdown = false"
                    @input="showCustomerDropdown = true; form.customer = customerSearch"
                    type="text" 
                    placeholder="Search customer..."
                    class="w-full pl-9 pr-3.5 py-2 bg-white border rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                    :class="showValidation && !form.customer.trim() ? 'border-red-300 bg-red-50/20' : 'border-gray-200'"
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
                      <div class="text-xs font-bold text-gray-800">{{ c.name }}</div>
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
                <p v-if="showValidation && !form.customer.trim()" class="text-[10px] text-red-500 font-medium mt-1">Customer name is required</p>
              </div>

              <div v-if="selectedCustomer" class="p-3 bg-gray-50 rounded-lg border border-gray-100 text-[11px]">
                <div class="font-bold text-gray-800">{{ selectedCustomer.name }}</div>
                <div class="text-gray-500 mt-0.5">{{ selectedCustomer.phone }} &bull; {{ selectedCustomer.email }}</div>
              </div>
              
              <div class="pt-2">
                <h3 class="text-sm font-bold text-gray-900 mb-4 border-t border-gray-100 pt-4 flex items-center gap-2">
                  <FileText class="w-4 h-4 text-gray-400" /> Related Reference
                </h3>
                
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Link to Order or Quotation (Optional)</label>
                  <input v-model="form.relatedReference" type="text" class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:border-[#165A31] focus:ring-0" placeholder="e.g. QT-1882 or ORD-2241" />
                </div>
              </div>
            </div>

            <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
              <h3 class="text-sm font-bold text-gray-900 mb-2">Invoice Terms</h3>
              
              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Payment Terms / Instructions</label>
                <select v-model="form.paymentTerms" class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:border-[#165A31] focus:ring-0">
                  <option>Bank Transfer (Default)</option>
                  <option>Cash on Delivery</option>
                  <option>Corporate 30-Day Credit</option>
                  <option>Installment Plan</option>
                </select>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Issue Date</label>
                  <input v-model="form.issueDate" type="date" class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:border-[#165A31] focus:ring-0" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Due Date</label>
                  <input v-model="form.dueDate" type="date" class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:border-[#165A31] focus:ring-0" />
                </div>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Status</label>
                <select v-model="form.status" class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:border-[#165A31] focus:ring-0">
                  <option>Unpaid</option>
                  <option>Partial</option>
                  <option>Paid</option>
                </select>
              </div>
            </div>
          </div>

          <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 flex flex-col">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-bold text-gray-900">Line Items</h3>
              <button type="button" @click="addItem" class="text-xs font-bold text-[#165A31] bg-[#eefcf2] px-2 py-1 rounded hover:bg-[#dcfce7] transition-colors cursor-pointer flex items-center gap-1">
                <Plus class="w-3 h-3" /> Add Custom Item
              </button>
            </div>
            
            <div class="space-y-4 flex-1">
              <div v-for="(item, idx) in form.items" :key="idx" class="p-4 bg-gray-50 border border-gray-100 rounded-xl relative group">
                <button v-if="form.items.length > 1" type="button" @click="removeItem(idx)" class="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-white rounded cursor-pointer transition-colors">
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
                
                <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div class="sm:col-span-2">
                    <label class="block text-[10px] font-semibold text-gray-500 mb-1 uppercase tracking-wider">Description *</label>
                    <input v-model="item.description" type="text" placeholder="e.g. Advance Deposit for 5 E-Scooters" class="w-full px-3 py-1.5 bg-white border rounded text-xs focus:border-[#165A31] focus:ring-0" :class="showValidation && !item.description ? 'border-red-300' : 'border-gray-200'" />
                  </div>
                  
                  <div>
                    <label class="block text-[10px] font-semibold text-gray-500 mb-1 uppercase tracking-wider">Quantity</label>
                    <input v-model="item.quantity" type="number" min="1" class="w-full px-3 py-1.5 bg-white border border-gray-200 rounded text-xs focus:border-[#165A31] focus:ring-0" />
                  </div>
                  
                  <div>
                    <label class="block text-[10px] font-semibold text-gray-500 mb-1 uppercase tracking-wider">Unit Price (PKR)</label>
                    <input v-model="item.unitPrice" type="number" min="0" class="w-full px-3 py-1.5 bg-white border border-gray-200 rounded text-xs focus:border-[#165A31] focus:ring-0" />
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4 pt-4 border-t border-gray-100 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-gray-500">Subtotal</span>
                <span class="text-xs font-bold text-gray-800">PKR {{ subtotal.toLocaleString() }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-gray-500">Discount (Fixed)</span>
                <input v-model="form.discount" type="number" min="0" class="w-24 px-2 py-1 bg-white border border-gray-200 rounded text-xs text-right focus:border-[#165A31] focus:ring-0" />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-gray-500">Tax Amount</span>
                <input v-model="form.tax" type="number" min="0" class="w-24 px-2 py-1 bg-white border border-gray-200 rounded text-xs text-right focus:border-[#165A31] focus:ring-0" />
              </div>
              <div class="flex items-center justify-between pt-2 border-t border-gray-100">
                <span class="text-sm font-bold text-gray-900">Total Invoice Amount</span>
                <span class="text-lg font-bold text-[#165A31]">PKR {{ total.toLocaleString() }}</span>
              </div>
            </div>
          </div>

          <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
            <h3 class="text-sm font-bold text-gray-900 mb-2">Internal Notes & Custom Text</h3>
            <textarea 
              v-model="form.notes"
              rows="2"
              placeholder="Added to the bottom of the invoice..."
              class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors resize-none"
            ></textarea>
          </div>

          <div class="flex items-center justify-end gap-3 pt-2">
            <button 
              type="button" 
              @click="close" 
              class="px-5 py-2.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="bg-[#165A31] text-white text-xs font-bold px-6 py-2.5 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer"
            >
              {{ isEditMode ? 'Update Invoice' : 'Generate Invoice' }}
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
