<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '@/store'
import { X, Check, Search, ChevronDown, User, ShieldCheck, Wrench, Calendar, MapPin, Phone, Mail } from 'lucide-vue-next'

const props = defineProps({
  isModal: {
    type: Boolean,
    default: true
  },
  caseItem: {
    type: Object,
    default: null
  }
})

const router = useRouter()
const emit = defineEmits(['close', 'created', 'updated'])
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const isEditMode = ref(false)
const showValidation = ref(false)

// Pre-configured Customers List derived from central store
const availableCustomers = computed(() => {
  return store.customers.map(c => ({
    id: c.id,
    customer_id: c.id,
    name: c.name,
    phone: c.phone || c.mobile || '+92 300 0000000',
    email: c.email || `${(c.name || 'user').toLowerCase().replace(/\s+/g, '.')}@example.com`,
    address: c.address || `${c.city || 'Peshawar'}, Pakistan`
  }))
})

// Pre-configured Serialized Units Database derived from central store
const availableUnits = computed(() => {
  return store.serializedUnits.map(u => ({
    unit_id: u.unit_id || u.chassisNo || u.serial || u.id,
    serial: u.serial || u.chassisNo || u.unit_id || u.id,
    shortSerial: u.shortSerial || u.serial || u.id,
    model: u.model || u.product || 'BRG EV',
    customer_id: u.customer_id,
    warranty_id: u.warranty_id || 'WAR-101',
    vin: u.vin || u.chassisNo || `VIN-PK-BRG-${u.serial || '2026'}`,
    motorNo: u.motorNo || 'MOT-72V-3500W-9912',
    batterySerial: u.batteryNo || u.batterySerial || 'BAT-72V-60AH-4412',
    purchaseDate: u.purchaseDate || 'Aug 15, 2025',
    warrantyEnd: u.warrantyExpiry || u.warrantyEnd || 'Aug 15, 2027',
    warrantyStatus: u.warrantyStatus || (u.warranty === 'Valid' ? 'Active' : 'Active'),
    coverage: u.coverage || 'Full System 2-Year OEM Warranty'
  }))
})

// Autocomplete State
const customerSearch = ref('')
const showCustomerDropdown = ref(false)
const unitSearch = ref('')
const showUnitDropdown = ref(false)

const filteredCustomers = computed(() => {
  const q = customerSearch.value.toLowerCase().trim()
  if (!q) return availableCustomers.value
  return availableCustomers.value.filter(c => 
    c.name.toLowerCase().includes(q) || c.phone.includes(q)
  )
})

const filteredUnits = computed(() => {
  const q = unitSearch.value.toLowerCase().trim()
  if (!q) return availableUnits.value
  return availableUnits.value.filter(u => 
    u.serial.toLowerCase().includes(q) || 
    u.model.toLowerCase().includes(q) || 
    u.vin.toLowerCase().includes(q)
  )
})

let customerBlurTimer = null
let unitBlurTimer = null
const customerDropdownRef = ref(null)
const unitDropdownRef = ref(null)

const handleClickOutside = (e) => {
  if (customerDropdownRef.value && !customerDropdownRef.value.contains(e.target)) {
    showCustomerDropdown.value = false
  }
  if (unitDropdownRef.value && !unitDropdownRef.value.contains(e.target)) {
    showUnitDropdown.value = false
  }
}

const onCustomerBlur = () => {
  customerBlurTimer = setTimeout(() => {
    showCustomerDropdown.value = false
  }, 250)
}

const onUnitBlur = () => {
  unitBlurTimer = setTimeout(() => {
    showUnitDropdown.value = false
  }, 250)
}

const selectCustomer = (c) => {
  if (customerBlurTimer) clearTimeout(customerBlurTimer)
  form.value.customer_id = c.id || c.customer_id || 'CUST-101'
  form.value.customer = c.name
  form.value.customerPhone = c.phone
  form.value.customerEmail = c.email
  form.value.customerAddress = c.address
  customerSearch.value = c.name
  showCustomerDropdown.value = false
}

const selectUnit = (u) => {
  if (unitBlurTimer) clearTimeout(unitBlurTimer)
  form.value.unit_id = u.unit_id || u.serial
  form.value.warranty_id = u.warranty_id || 'WAR-101'
  form.value.serializedUnit = u.serial
  form.value.unitShort = u.shortSerial
  form.value.unitModel = u.model
  form.value.vin = u.vin
  form.value.motorNo = u.motorNo
  form.value.batterySerial = u.batterySerial
  form.value.purchaseDate = u.purchaseDate
  form.value.warrantyEnd = u.warrantyEnd
  form.value.warrantyCheck = `${u.warrantyStatus} (Valid until ${u.warrantyEnd})`
  form.value.warrantyStatus = u.warrantyStatus
  form.value.batteryCoverage = u.coverage
  unitSearch.value = `${u.serial} - ${u.model}`
  showUnitDropdown.value = false
}

const form = ref({
  caseId: '',
  customer_id: 'CUST-101',
  customer: 'Ahsan Khan',
  customerPhone: '+92 312 553 8198',
  customerEmail: 'ahsan.khan@example.com',
  customerAddress: 'University Road, Phase 3, Peshawar',
  unit_id: 'CH 8-BRG-26-01731',
  warranty_id: 'WAR-101',
  serializedUnit: 'CH 8-BRG-26-01731',
  unitShort: 'CH 8-BRG-26-01731',
  unitModel: 'BRG X7 Electric (2026 Edition)',
  vin: 'BRG-X7-2026-01731',
  motorNo: 'MOT-72V-3500W-9912',
  batterySerial: 'BAT-72V-60AH-4412-X7',
  odometer: '4,200 km',
  purchaseDate: 'Aug 15, 2025',
  warrantyEnd: 'Aug 15, 2027',
  warrantyCheck: 'Active until 15 Aug 2027',
  warrantyStatus: 'Active',
  batteryCoverage: 'Full System 2-Year OEM Warranty',
  category: 'Electrical',
  complaint: 'Controller intermittently loses power during initial acceleration.',
  notes: 'Unit received with charger and key. Diagnostics scan recommended.',
  urgency: 'High',
  branch: user.value?.branchName || 'Peshawar',
  assignedTech: 'Usman (Senior Tech)',
  estimatedCompletion: '30 Aug 2026',
  totalCost: 'PKR 21,500',
  coveredByWarranty: '100% Covered (OEM Warranty)',
  customerPayable: 'PKR 0'
})

const loadData = (data) => {
  if (!data) return
  isEditMode.value = true
  form.value = {
    ...form.value,
    caseId: data.caseId || form.value.caseId,
    customer: data.customer || form.value.customer,
    customerPhone: data.customerPhone || form.value.customerPhone,
    customerEmail: data.customerEmail || form.value.customerEmail,
    customerAddress: data.customerAddress || form.value.customerAddress,
    serializedUnit: data.unitSerial || data.unit || form.value.serializedUnit,
    unitShort: data.unit || form.value.unitShort,
    unitModel: data.unitModel || form.value.unitModel,
    vin: data.vin || form.value.vin,
    motorNo: data.motorNo || form.value.motorNo,
    batterySerial: data.batterySerial || form.value.batterySerial,
    odometer: data.odometer || form.value.odometer,
    purchaseDate: data.purchaseDate || form.value.purchaseDate,
    warrantyEnd: data.warrantyEnd || form.value.warrantyEnd,
    warrantyCheck: data.warranty || form.value.warrantyCheck,
    warrantyStatus: data.warranty || form.value.warrantyStatus,
    batteryCoverage: data.batteryCoverage || form.value.batteryCoverage,
    category: data.type || form.value.category,
    complaint: data.issue || data.complaint || form.value.complaint,
    notes: data.notes || form.value.notes,
    urgency: data.priority || form.value.urgency,
    branch: data.branch || form.value.branch,
    assignedTech: data.assignedTech || form.value.assignedTech,
    estimatedCompletion: data.estimatedCompletion || form.value.estimatedCompletion,
    totalCost: data.totalCost || form.value.totalCost,
    coveredByWarranty: data.coveredByWarranty || form.value.coveredByWarranty,
    customerPayable: data.customerPayable || form.value.customerPayable
  }
  customerSearch.value = form.value.customer
  unitSearch.value = form.value.serializedUnit
}

onMounted(() => {
  if (props.caseItem) {
    loadData(props.caseItem)
  } else if (store.originalEditCase) {
    loadData(store.originalEditCase)
  } else {
    customerSearch.value = form.value.customer
    unitSearch.value = form.value.serializedUnit
  }
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  if (customerBlurTimer) clearTimeout(customerBlurTimer)
  if (unitBlurTimer) clearTimeout(unitBlurTimer)
})

watch(() => props.caseItem, (newVal) => {
  if (newVal) loadData(newVal)
}, { immediate: true })

const close = () => {
  store.originalEditCase = null
  emit('close')
  if (router.currentRoute.value.path.includes('/create')) {
    router.push('/after-sales/warranty')
  }
}

const submitForm = () => {
  if (!form.value.customer.trim() || !form.value.serializedUnit.trim() || !form.value.complaint.trim()) {
    showValidation.value = true
    return
  }

  const cid = isEditMode.value ? form.value.caseId : `SC-${Math.floor(200 + Math.random() * 800)}`
  const caseObj = {
    id: cid,
    caseId: cid,
    customer_id: form.value.customer_id || 'CUST-101',
    unit_id: form.value.unit_id || form.value.serializedUnit,
    warranty_id: form.value.warranty_id || 'WAR-101',
    branch_id: form.value.branch_id || 'BR-01',
    branch: form.value.branch,
    customer: form.value.customer,
    customerPhone: form.value.customerPhone,
    customerEmail: form.value.customerEmail,
    customerAddress: form.value.customerAddress,
    unit: form.value.unitShort || form.value.serializedUnit,
    unitSerial: form.value.serializedUnit,
    unitModel: form.value.unitModel,
    vin: form.value.vin,
    motorNo: form.value.motorNo,
    batterySerial: form.value.batterySerial,
    odometer: form.value.odometer,
    purchaseDate: form.value.purchaseDate,
    warrantyStart: form.value.purchaseDate,
    warrantyEnd: form.value.warrantyEnd,
    type: form.value.category,
    opened: 'Today',
    warranty: form.value.warrantyStatus,
    status: 'Diagnosis',
    statusClass: 'bg-[#fef3c7] text-[#b45309]',
    priority: form.value.urgency,
    priorityClass: form.value.urgency === 'High' ? 'bg-[#fee2e2] text-[#b91c1c]' : 'bg-[#fef3c7] text-[#b45309]',
    eligibility: form.value.warrantyStatus === 'Active' ? 'Active (Under Warranty)' : 'Out of Warranty / Customer Paid',
    batteryCoverage: form.value.batteryCoverage,
    issue: form.value.complaint,
    notes: form.value.notes,
    owner: `${form.value.branch} Service Team`,
    assignedTech: form.value.assignedTech,
    diagnosisSummary: `Diagnosis initiated for ${form.value.complaint}. Technical inspection assigned to ${form.value.assignedTech}.`,
    estimatedCompletion: form.value.estimatedCompletion,
    totalCost: form.value.totalCost,
    coveredByWarranty: form.value.coveredByWarranty,
    customerPayable: form.value.customerPayable
  }

  if (isEditMode.value) {
    const idx = store.cases.findIndex(c => c.caseId === form.value.caseId)
    if (idx !== -1) {
      store.cases[idx] = { ...store.cases[idx], ...caseObj }
    }
    store.selectedCase = caseObj
    emit('updated', caseObj)
  } else {
    store.addCase(caseObj)
    store.selectedCase = caseObj
    emit('created', caseObj)
  }
  close()
}
</script>

<template>
  <div class="fixed inset-0 bg-gray-900/50 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm" @click.self="close">
    <!-- Close Button -->
    <button @click="close" class="fixed top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-100 rounded-full z-[110] shadow-lg transition-colors cursor-pointer">
      <X class="w-5 h-5" />
    </button>

    <!-- Modal Container -->
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">
      
      <!-- Scrollable Form Body -->
      <div class="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 pb-4 border-b border-gray-100">
          <div>
            <div class="text-[11px] text-gray-400 mb-1">
              {{ isBranchUser ? 'Branch Manager' : 'Super Admin' }} / Warranty & Service / <span class="font-semibold text-gray-700">{{ isEditMode ? 'Edit Case' : 'Register Service Case' }}</span>
            </div>
            <h1 class="text-[28px] sm:text-[32px] tracking-tight font-bold text-gray-900">{{ isEditMode ? 'Edit Case' : 'Register Service Case' }}</h1>
            <p class="text-xs text-gray-500 mt-1">Select customer & unit to auto-fill vehicle specs, warranty validity, odometer & complaint details.</p>
          </div>
        </div>

        <form @submit.prevent="submitForm" class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            
            <!-- LEFT CARD: Customer & Vehicle Unit -->
            <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
              <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2">
                <User class="w-4 h-4 text-[#165A31]" />
                Customer & Vehicle Lookup
              </h3>

              <!-- Customer Autocomplete -->
              <div ref="customerDropdownRef" class="relative">
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Customer Name *</label>
                <div class="relative">
                  <input 
                    v-model="customerSearch"
                    type="text"
                    placeholder="Search existing customer..."
                    @focus="showCustomerDropdown = true"
                    @blur="onCustomerBlur"
                    @keydown.escape="showCustomerDropdown = false"
                    @input="showCustomerDropdown = true; form.customer = customerSearch"
                    class="w-full pl-9 pr-8 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 transition-colors bg-white"
                    :class="showValidation && !form.customer.trim() ? 'border-red-300 bg-red-50/20 focus:ring-red-400' : 'border-gray-200 focus:ring-[#165A31] focus:border-[#165A31]'"
                  />
                  <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <ChevronDown class="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>

                <!-- Customer Dropdown Menu -->
                <div 
                  v-if="showCustomerDropdown" 
                  class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-lg shadow-xl py-1 z-50 max-h-48 overflow-y-auto"
                >
                  <button 
                    v-for="c in filteredCustomers" 
                    :key="c.phone"
                    type="button"
                    @mousedown.prevent="selectCustomer(c)"
                    @click="selectCustomer(c)"
                    class="w-full text-left px-3.5 py-2 text-xs hover:bg-[#eefcf2] hover:text-[#165A31] flex flex-col transition-colors cursor-pointer"
                  >
                    <span class="font-bold text-gray-800">{{ c.name }}</span>
                    <span class="text-[10px] text-gray-500">{{ c.phone }} &middot; {{ c.address }}</span>
                  </button>
                  <div v-if="filteredCustomers.length === 0" class="px-3.5 py-2 text-xs text-gray-400">
                    No matching customer found. Custom entry set to "{{ customerSearch }}".
                  </div>
                </div>
                <p v-if="showValidation && !form.customer.trim()" class="text-[10px] text-red-500 font-medium mt-1">Customer name is required</p>
              </div>

              <!-- Customer Contact Sub-Grid -->
              <div class="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input v-model="form.customerPhone" type="text" placeholder="+92 300 0000000" class="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Email Address</label>
                  <input v-model="form.customerEmail" type="email" placeholder="customer@example.com" class="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs" />
                </div>
              </div>

              <!-- Serialized Unit Autocomplete -->
              <div ref="unitDropdownRef" class="relative pt-2 border-t border-gray-100">
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Serialized Unit / Chassis *</label>
                <div class="relative">
                  <input 
                    v-model="unitSearch"
                    type="text"
                    placeholder="Search chassis/serial (e.g. EV5-00322)..."
                    @focus="showUnitDropdown = true"
                    @blur="onUnitBlur"
                    @keydown.escape="showUnitDropdown = false"
                    @input="showUnitDropdown = true; form.serializedUnit = unitSearch"
                    class="w-full pl-9 pr-8 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 transition-colors bg-white"
                    :class="showValidation && !form.serializedUnit.trim() ? 'border-red-300 bg-red-50/20 focus:ring-red-400' : 'border-gray-200 focus:ring-[#165A31] focus:border-[#165A31]'"
                  />
                  <Wrench class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <ChevronDown class="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>

                <!-- Unit Dropdown Menu -->
                <div 
                  v-if="showUnitDropdown" 
                  class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-lg shadow-xl py-1 z-50 max-h-48 overflow-y-auto"
                >
                  <button 
                    v-for="u in filteredUnits" 
                    :key="u.serial"
                    type="button"
                    @mousedown.prevent="selectUnit(u)"
                    @click="selectUnit(u)"
                    class="w-full text-left px-3.5 py-2 text-xs hover:bg-[#eefcf2] hover:text-[#165A31] flex flex-col transition-colors cursor-pointer"
                  >
                    <span class="font-bold text-gray-800">{{ u.serial }} &middot; {{ u.model }}</span>
                    <span class="text-[10px] text-gray-500">VIN: {{ u.vin }} &middot; Warranty: {{ u.warrantyStatus }}</span>
                  </button>
                </div>
                <p v-if="showValidation && !form.serializedUnit.trim()" class="text-[10px] text-red-500 font-medium mt-1">Serialized unit is required</p>
              </div>

              <!-- Auto-Filled Vehicle Metadata Card -->
              <div class="bg-[#f9fafb] border border-gray-100 rounded-lg p-3.5 space-y-2 text-xs">
                <div class="flex justify-between items-center text-[11px] font-bold text-gray-800">
                  <span>{{ form.unitModel || 'BRG Electric Vehicle' }}</span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold" :class="form.warrantyStatus === 'Active' ? 'bg-[#eefcf2] text-[#165A31]' : 'bg-amber-50 text-amber-700'">
                    {{ form.warrantyStatus || 'Active' }}
                  </span>
                </div>
                <div class="grid grid-cols-2 gap-2 text-[10px] text-gray-500">
                  <div><strong class="text-gray-700">VIN:</strong> {{ form.vin || 'BRG-EV-2025' }}</div>
                  <div><strong class="text-gray-700">Motor No:</strong> {{ form.motorNo || 'MOT-72V-3000W' }}</div>
                  <div><strong class="text-gray-700">Battery SN:</strong> {{ form.batterySerial || 'BAT-72V-50AH' }}</div>
                  <div><strong class="text-gray-700">Warranty End:</strong> {{ form.warrantyEnd || '15 Aug 2027' }}</div>
                </div>
              </div>

              <!-- Odometer & Purchase Date -->
              <div class="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Odometer Reading (km)</label>
                  <input v-model="form.odometer" type="text" placeholder="e.g. 4,200 km" class="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Purchase Date</label>
                  <input v-model="form.purchaseDate" type="text" placeholder="Jan 12, 2025" class="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs" />
                </div>
              </div>
            </div>

            <!-- RIGHT CARD: Complaint, Intake & Diagnosis -->
            <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
              <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck class="w-4 h-4 text-[#165A31]" />
                Complaint & Intake Details
              </h3>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Issue Category *</label>
                <select v-model="form.category" class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-[#165A31] cursor-pointer">
                  <option value="Electrical">Electrical / Controller</option>
                  <option value="Battery">Battery & BMS Telemetry</option>
                  <option value="Mechanical">Mechanical & Suspension</option>
                  <option value="Brake">Brake System</option>
                  <option value="Software">Software & Console Code</option>
                  <option value="Service">Routine Periodic Maintenance</option>
                </select>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Customer Complaint & Symptoms *</label>
                <textarea 
                  v-model="form.complaint" 
                  rows="3"
                  placeholder="Describe reported vehicle symptoms or complaint details..."
                  class="w-full px-3.5 py-2 bg-white border rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 resize-none"
                  :class="showValidation && !form.complaint.trim() ? 'border-red-300 bg-red-50/20 focus:ring-red-400' : 'border-gray-200 focus:ring-[#165A31] focus:border-[#165A31]'"
                ></textarea>
                <p v-if="showValidation && !form.complaint.trim()" class="text-[10px] text-red-500 font-medium mt-1">Complaint description is required</p>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Priority / Urgency</label>
                  <select v-model="form.urgency" class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-[#165A31] cursor-pointer">
                    <option value="High">High (Immediate)</option>
                    <option value="Medium">Medium (Standard)</option>
                    <option value="Low">Low (Routine)</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Branch Location</label>
                  <select v-model="form.branch" class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-[#165A31] cursor-pointer">
                    <option value="Peshawar">Peshawar</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Assigned Technician</label>
                  <input v-model="form.assignedTech" type="text" placeholder="e.g. Usman (Senior Tech)" class="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Target Completion Date</label>
                  <input v-model="form.estimatedCompletion" type="text" placeholder="e.g. 30 Aug 2026" class="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs" />
                </div>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Intake Notes & Condition</label>
                <input v-model="form.notes" type="text" placeholder="Vehicle received with key, charger & mirror accessories..." class="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-xs" />
              </div>

              <!-- Cost & Warranty Coverage Split -->
              <div class="bg-[#f0fdf4] border border-[#dcfce7] rounded-lg p-3.5 grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span class="text-[10px] text-gray-500 block font-medium">Estimated Cost</span>
                  <span class="font-bold text-gray-900 block mt-0.5">{{ form.totalCost }}</span>
                </div>
                <div>
                  <span class="text-[10px] text-gray-500 block font-medium">Warranty Covered</span>
                  <span class="font-bold text-[#165A31] block mt-0.5">{{ form.coveredByWarranty }}</span>
                </div>
                <div>
                  <span class="text-[10px] text-gray-500 block font-medium">Customer Payable</span>
                  <span class="font-bold text-gray-900 block mt-0.5">{{ form.customerPayable }}</span>
                </div>
              </div>

            </div>
          </div>

          <!-- Footer Actions -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" @click="close" class="bg-white border border-gray-200 text-gray-700 text-xs font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-sm">
              Cancel
            </button>
            <button type="submit" class="bg-[#165A31] text-white text-xs font-semibold px-6 py-2.5 rounded-lg hover:bg-[#124a28] transition-colors cursor-pointer shadow-sm">
              {{ isEditMode ? 'Update Service Case' : 'Register Service Case' }}
            </button>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>
