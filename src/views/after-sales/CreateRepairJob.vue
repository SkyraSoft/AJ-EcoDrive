<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '@/store'
import { X, Check, Search, ChevronDown, Wrench, ShieldCheck, User, Calendar, Plus, FileText } from 'lucide-vue-next'

const props = defineProps({
  isModal: {
    type: Boolean,
    default: true
  },
  repair: {
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

// Case Autocomplete Search State
const caseSearch = ref('')
const showCaseDropdown = ref(false)

const availableTechnicians = computed(() => {
  return store.getTechnicians(form.value.branch)
})

const availableCases = computed(() => store.cases || [])

const filteredCases = computed(() => {
  const q = caseSearch.value.toLowerCase().trim()
  if (!q) return availableCases.value
  return availableCases.value.filter(c => 
    c.caseId.toLowerCase().includes(q) || 
    c.customer.toLowerCase().includes(q) || 
    c.unitSerial.toLowerCase().includes(q)
  )
})

let caseBlurTimer = null

const onCaseBlur = () => {
  caseBlurTimer = setTimeout(() => {
    showCaseDropdown.value = false
  }, 250)
}

const selectCaseRef = (c) => {
  if (caseBlurTimer) clearTimeout(caseBlurTimer)
  form.value.caseRef = c.caseId || c.id
  form.value.case_id = c.id || c.caseId
  form.value.customer = c.customer
  form.value.customer_id = c.customer_id || 'CUST-101'
  form.value.customerPhone = c.customerPhone || c.phone || '+92 300 1234567'
  form.value.unit = c.unitSerial || c.unit || 'CH 8-BRG-26-01731'
  form.value.unit_id = c.unit_id || c.unitSerial || c.unit || 'CH 8-BRG-26-01731'
  form.value.unitModel = c.unitModel || `BRG ${c.unit}`
  form.value.warranty_id = c.warranty_id || 'WAR-101'
  form.value.branch = c.branch || user.value?.branchName || 'Peshawar'
  form.value.diagnosis = c.issue || 'Controller fault'
  form.value.fault = c.notes || c.issue || 'Intake issue inspection required'
  form.value.decision = `Execute ${c.type || 'Service'} Repair`
  form.value.technician = c.assignedTech || 'Usman'
  caseSearch.value = `${c.caseId || c.id} - ${c.customer}`
  showCaseDropdown.value = false
}

const form = ref({
  repairId: '',
  caseRef: 'SC-229',
  case_id: 'SC-229',
  customer_id: 'CUST-101',
  customer: 'Ahsan Khan',
  customerPhone: '+92 312 553 8198',
  unit: 'CH 8-BRG-26-01731',
  unit_id: 'CH 8-BRG-26-01731',
  unitModel: 'BRG X7 Electric (2026 Edition)',
  warranty_id: 'WAR-101',
  branch: user.value?.branchName || 'Peshawar',
  branch_id: 'BR-01',
  diagnosis: 'Controller fault',
  fault: 'Controller intermittently loses power under load',
  decision: 'Replace 72V MOSFET controller unit',
  technician: 'Usman',
  partsName: 'Controller & Harness',
  partItem: '72V Smart Controller Module',
  partQty: 1,
  partCost: '18000',
  partSource: 'Service Stock',
  labourWork: 'Controller replacement & wiring harness test',
  labourHours: 1.5,
  labourRate: '2,000/hr',
  labourAmount: '3500',
  readyDate: '30 Aug',
  status: 'In Progress',
  warrantyStatus: '100% Covered Under Warranty',
  warrantyPolicy: '2-Year Electrical Component Warranty',
  customerApprovalStatus: 'Approved',
  customerApprovalMethod: 'In-Person Intake Form',
  customerApprovalNotes: 'Customer dropped vehicle with charger and key.',
  tasks: [
    { name: 'Inspect wiring harness and throttle feed', tech: 'Usman' },
    { name: 'Replace 72V MOSFET controller unit', tech: 'Usman' },
    { name: 'Bench test and road calibration', tech: 'Usman' }
  ]
})

const loadData = (data) => {
  if (!data) return
  isEditMode.value = true
  form.value = {
    ...form.value,
    repairId: data.repairId || form.value.repairId,
    caseRef: data.caseRef || form.value.caseRef,
    customer: data.customer || form.value.customer,
    customerPhone: data.customerPhone || form.value.customerPhone,
    unit: data.unit || form.value.unit,
    unitModel: data.unitModel || form.value.unitModel,
    branch: data.branch || form.value.branch,
    diagnosis: data.diagnosis || form.value.diagnosis,
    fault: data.fault || form.value.fault,
    decision: data.decision || form.value.decision,
    technician: data.technician || form.value.technician,
    partsName: data.partsName || form.value.partsName,
    status: data.status || form.value.status,
    readyDate: data.readyDate || data.promised || form.value.readyDate
  }
  if (data.workPlan && data.workPlan.length) {
    form.value.tasks = data.workPlan.map(t => ({ name: t.task || t.name, tech: t.technician || t.tech }))
  }
  if (data.partsList && data.partsList.length) {
    form.value.partItem = data.partsList[0].part || form.value.partItem
    form.value.partQty = data.partsList[0].qty || form.value.partQty
    form.value.partCost = data.partsList[0].cost || form.value.partCost
    form.value.partSource = data.partsList[0].source || form.value.partSource
  }
  caseSearch.value = form.value.caseRef ? `${form.value.caseRef} - ${form.value.customer}` : ''
}

onMounted(() => {
  if (props.repair) {
    loadData(props.repair)
  } else if (store.originalEditRepair) {
    loadData(store.originalEditRepair)
  } else if (store.selectedCase) {
    selectCaseRef(store.selectedCase)
  } else {
    caseSearch.value = `${form.value.caseRef} - ${form.value.customer}`
  }
})

watch(() => props.repair, (newVal) => {
  if (newVal) loadData(newVal)
}, { immediate: true })

const newTaskName = ref('')
const addTask = () => {
  if (newTaskName.value.trim()) {
    form.value.tasks.push({
      name: newTaskName.value.trim(),
      tech: form.value.technician || 'Technician'
    })
    newTaskName.value = ''
  }
}

const removeTask = (index) => {
  form.value.tasks.splice(index, 1)
}

const close = () => {
  store.originalEditRepair = null
  emit('close')
  if (router.currentRoute.value.path.includes('/create')) {
    router.push('/after-sales/repairs')
  }
}

const submitForm = () => {
  if (!form.value.customer.trim() || !form.value.unit.trim() || !form.value.diagnosis.trim()) {
    showValidation.value = true
    return
  }

  const newRepairId = isEditMode.value ? form.value.repairId : `RJ-${Math.floor(200 + Math.random() * 800)}`
  const partCostNum = (parseFloat(String(form.value.partCost || '0').replace(/[^0-9.]/g, '')) || 0) * (parseInt(form.value.partQty) || 1)
  const labourCostNum = parseFloat(String(form.value.labourAmount || '0').replace(/[^0-9.]/g, '')) || 0
  const subtotal = partCostNum + labourCostNum
  const isWarrantyCovered = form.value.warrantyStatus.includes('Covered') || form.value.warrantyStatus.includes('100%') || form.value.warrantyStatus === 'Active'
  const warrantyCoverageAmt = isWarrantyCovered ? subtotal : 0
  const customerPayableAmt = subtotal - warrantyCoverageAmt

  const jobObj = {
    id: newRepairId,
    repairId: newRepairId,
    repair_id: newRepairId,
    case_id: form.value.caseRef || form.value.case_id || 'SC-229',
    caseRef: form.value.caseRef || form.value.case_id || 'SC-229',
    branch: form.value.branch,
    branch_id: form.value.branch_id || 'BR-01',
    customer_id: form.value.customer_id || 'CUST-101',
    customer: form.value.customer,
    customerPhone: form.value.customerPhone,
    unit_id: form.value.unit_id || form.value.unit || 'CH 8-BRG-26-01731',
    unit: form.value.unit || 'CH 8-BRG-26-01731',
    unitModel: form.value.unitModel,
    warranty_id: form.value.warranty_id || 'WAR-101',
    diagnosis: form.value.diagnosis,
    fault: form.value.fault,
    decision: form.value.decision,
    partsName: form.value.partsName,
    status: form.value.status,
    statusClass: form.value.status === 'Ready' ? 'bg-[#dcfce7] text-[#15803d]' : form.value.status === 'In Progress' ? 'bg-blue-50 text-blue-700' : 'bg-[#fef3c7] text-[#b45309]',
    readyDate: form.value.readyDate || '30 Aug',
    promised: form.value.readyDate || '30 Aug',
    technician: form.value.technician,
    posted_to_finance: false,
    workPlan: form.value.tasks.map(t => ({
      task: t.name,
      technician: t.tech,
      status: 'In Progress'
    })),
    partsList: [
      {
        part: form.value.partItem,
        qty: form.value.partQty,
        cost: form.value.partCost,
        rawCost: partCostNum,
        source: form.value.partSource,
        status: 'Allocated'
      }
    ],
    labourList: [
      { work: form.value.labourWork, hours: form.value.labourHours, rate: form.value.labourRate, amount: form.value.labourAmount, rawAmount: labourCostNum }
    ],
    costSummary: {
      partsTotal: `PKR ${partCostNum.toLocaleString()}`,
      rawPartsTotal: partCostNum,
      labourTotal: `PKR ${labourCostNum.toLocaleString()}`,
      rawLabourTotal: labourCostNum,
      tax: 'PKR 0',
      rawTax: 0,
      subtotal: `PKR ${subtotal.toLocaleString()}`,
      rawSubtotal: subtotal,
      total: `PKR ${subtotal.toLocaleString()}`,
      rawTotal: subtotal,
      warrantyCoverage: form.value.warrantyStatus,
      rawWarrantyCoverage: warrantyCoverageAmt,
      customerPayable: `PKR ${customerPayableAmt.toLocaleString()}`,
      rawCustomerPayable: customerPayableAmt
    },
    warrantyCoverage: {
      status: form.value.warrantyStatus,
      policy: form.value.warrantyPolicy,
      approvalId: `OEM-CLM-${Math.floor(1000 + Math.random() * 9000)}`,
      payable: `PKR ${customerPayableAmt.toLocaleString()}`
    },
    customerApproval: {
      status: form.value.customerApprovalStatus,
      approvedBy: form.value.customer,
      approvedDate: 'Today',
      method: form.value.customerApprovalMethod,
      notes: form.value.customerApprovalNotes
    },
    timeline: [
      { title: `Parts Allocated from ${form.value.branch} Store`, time: 'Today · 11:15 AM', actor: 'Store Manager' },
      { title: `Diagnosis Completed: ${form.value.diagnosis}`, time: 'Today · 10:45 AM', actor: form.value.technician },
      { title: `Repair Job ${newRepairId} Created`, time: 'Today · 10:05 AM', actor: `${form.value.branch} Workshop` }
    ]
  }

  if (isEditMode.value) {
    const idx = store.repairs.findIndex(r => r.repairId === form.value.repairId)
    if (idx !== -1) {
      store.repairs[idx] = { ...store.repairs[idx], ...jobObj }
    }
    store.selectedRepair = jobObj
    emit('updated', jobObj)
  } else {
    store.addRepairJob(jobObj)
    store.selectedRepair = jobObj
    emit('created', jobObj)
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
      
      <!-- Scrollable Body -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
        <div class="space-y-6">
          
          <!-- Header -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 pb-4 border-b border-gray-100">
            <div>
              <div class="text-[10px] text-gray-500 mb-1">
                <span v-if="isBranchUser">Branch Manager / Repairs / <span class="font-bold text-gray-800">{{ isEditMode ? 'Edit Repair Job' : 'Create Repair Job Card' }}</span></span>
                <span v-else>Super Admin / After-sales / Repair Jobs / <span class="font-bold text-gray-800">{{ isEditMode ? 'Edit Repair Job' : 'Create Repair Job Card' }}</span></span>
              </div>
              <h1 class="text-[28px] sm:text-[32px] tracking-tight font-bold text-gray-900">{{ isEditMode ? 'Edit Repair Job' : 'Create Repair Job Card' }}</h1>
              <p class="text-xs sm:text-sm text-gray-500 mt-1">Select Service Case reference to auto-fill customer & vehicle details, allocate parts, labor & work tasks.</p>
            </div>
          </div>

          <!-- Form Grid (4 Sections) -->
          <form @submit.prevent="submitForm" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <!-- 1. Case Reference & Customer -->
              <div class="bg-white p-5 sm:p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
                <h3 class="text-[13px] font-bold text-gray-900 flex items-center gap-2">
                  <FileText class="w-4 h-4 text-[#165A31]" />
                  1. Service Case & Customer Reference
                </h3>
                
                <!-- Case Autocomplete -->
                <div class="relative">
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Link Service Case (SC / WAR) *</label>
                  <div class="relative">
                    <input 
                      v-model="caseSearch"
                      type="text"
                      placeholder="Search active case (e.g. SC-229)..."
                      @focus="showCaseDropdown = true"
                      @blur="onCaseBlur"
                      @keydown.escape="showCaseDropdown = false"
                      @input="showCaseDropdown = true; form.caseRef = caseSearch"
                      class="w-full pl-9 pr-8 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 transition-colors bg-white border-gray-200 focus:ring-[#165A31] focus:border-[#165A31]"
                    />
                    <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <ChevronDown class="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>

                  <!-- Dropdown Menu -->
                  <div 
                    v-if="showCaseDropdown" 
                    class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-lg shadow-xl py-1 z-50 max-h-44 overflow-y-auto"
                  >
                    <button 
                      v-for="c in filteredCases" 
                      :key="c.caseId"
                      type="button"
                      @mousedown.prevent="selectCaseRef(c)"
                      @click="selectCaseRef(c)"
                      class="w-full text-left px-3.5 py-2 text-xs hover:bg-[#eefcf2] hover:text-[#165A31] flex flex-col transition-colors cursor-pointer"
                    >
                      <span class="font-bold text-gray-800">{{ c.caseId }} &middot; {{ c.customer }}</span>
                      <span class="text-[10px] text-gray-500">Unit: {{ c.unitSerial || c.unit }} &middot; {{ c.issue }}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Customer Name *</label>
                  <input 
                    v-model="form.customer" 
                    type="text" 
                    placeholder="Enter customer name..." 
                    class="w-full px-3 py-2 text-[12px] border rounded-lg focus:outline-none focus:ring-1 transition-colors"
                    :class="showValidation && !form.customer.trim() ? 'border-red-300 bg-red-50/20 focus:ring-red-400' : 'border-gray-200 focus:ring-[#165A31] focus:border-[#165A31]'"
                  />
                  <p v-if="showValidation && !form.customer.trim()" class="text-[10px] text-red-500 font-medium mt-1">Customer name is required</p>
                </div>
                
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Unit Serial / Chassis *</label>
                    <input 
                      v-model="form.unit" 
                      type="text" 
                      placeholder="e.g. CHS-01882" 
                      class="w-full px-3 py-2 text-[12px] border rounded-lg focus:outline-none focus:ring-1 transition-colors"
                      :class="showValidation && !form.unit.trim() ? 'border-red-300 bg-red-50/20 focus:ring-red-400' : 'border-gray-200 focus:ring-[#165A31] focus:border-[#165A31]'"
                    />
                    <p v-if="showValidation && !form.unit.trim()" class="text-[10px] text-red-500 font-medium mt-1">Unit serial is required</p>
                  </div>
                  <div>
                    <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Branch</label>
                    <select 
                      v-model="form.branch" 
                      class="w-full px-3 py-2 text-[12px] text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] bg-white cursor-pointer"
                    >
                      <option value="Peshawar">Peshawar</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Lahore">Lahore</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Unit Model & Variant</label>
                  <input v-model="form.unitModel" type="text" placeholder="e.g. BRG X7 Electric / Black" class="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg" />
                </div>
              </div>

              <!-- 2. Diagnosis & Work Decision -->
              <div class="bg-white p-5 sm:p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
                <h3 class="text-[13px] font-bold text-gray-900 flex items-center gap-2">
                  <Wrench class="w-4 h-4 text-[#165A31]" />
                  2. Diagnosis & Decision
                </h3>
                
                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Diagnosis Category *</label>
                  <input 
                    v-model="form.diagnosis" 
                    type="text" 
                    placeholder="e.g. Controller fault, Battery replacement" 
                    class="w-full px-3 py-2 text-[12px] border rounded-lg focus:outline-none focus:ring-1 transition-colors"
                    :class="showValidation && !form.diagnosis.trim() ? 'border-red-300 bg-red-50/20 focus:ring-red-400' : 'border-gray-200 focus:ring-[#165A31] focus:border-[#165A31]'"
                  />
                  <p v-if="showValidation && !form.diagnosis.trim()" class="text-[10px] text-red-500 font-medium mt-1">Diagnosis is required</p>
                </div>

                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Fault Details</label>
                  <input 
                    v-model="form.fault" 
                    type="text" 
                    placeholder="e.g. Controller intermittently loses power under load" 
                    class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31]" 
                  />
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Work Decision</label>
                    <input 
                      v-model="form.decision" 
                      type="text" 
                      placeholder="e.g. Replace 72V controller" 
                      class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31]" 
                    />
                  </div>
                  <div>
                    <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Lead Technician</label>
                    <select 
                      v-if="availableTechnicians.length > 0"
                      v-model="form.technician" 
                      class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] bg-white cursor-pointer" 
                    >
                      <option v-for="t in availableTechnicians" :key="t.id" :value="t.name">{{ t.name }} ({{ t.role || 'Tech' }})</option>
                    </select>
                    <input 
                      v-else
                      v-model="form.technician" 
                      type="text" 
                      placeholder="e.g. Usman" 
                      class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31]" 
                    />
                  </div>
                </div>
              </div>

              <!-- 3. Parts & Materials -->
              <div class="bg-white p-5 sm:p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
                <h3 class="text-[13px] font-bold text-gray-900 flex items-center gap-2">
                  <ShieldCheck class="w-4 h-4 text-[#165A31]" />
                  3. Parts & Materials Allocation
                </h3>
                
                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Required Part Name</label>
                  <input 
                    v-model="form.partItem" 
                    type="text" 
                    placeholder="e.g. 72V Smart Controller Module" 
                    class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31]" 
                  />
                </div>

                <div class="grid grid-cols-3 gap-3">
                  <div>
                    <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Qty</label>
                    <input 
                      v-model="form.partQty" 
                      type="number" 
                      min="1"
                      class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31]" 
                    />
                  </div>
                  <div>
                    <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Est. Cost</label>
                    <input 
                      v-model="form.partCost" 
                      type="text" 
                      placeholder="18K" 
                      class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31]" 
                    />
                  </div>
                  <div>
                    <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Source Stock</label>
                    <select 
                      v-model="form.partSource" 
                      class="w-full px-3 py-2 text-[12px] text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] bg-white cursor-pointer"
                    >
                      <option value="Service Stock">Service Stock</option>
                      <option value="Central Warehouse">Central WH</option>
                      <option value="OEM Supplier">OEM Supplier</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- 4. Work Plan & Schedule -->
              <div class="bg-white p-5 sm:p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
                <h3 class="text-[13px] font-bold text-gray-900 flex items-center gap-2">
                  <Calendar class="w-4 h-4 text-[#165A31]" />
                  4. Work Plan & Target Schedule
                </h3>
                
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Target Delivery Date</label>
                    <input 
                      v-model="form.readyDate" 
                      type="text" 
                      placeholder="e.g. 30 Aug" 
                      class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31]" 
                    />
                  </div>
                  <div>
                    <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Job Status</label>
                    <select 
                      v-model="form.status" 
                      class="w-full px-3 py-2 text-[12px] text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] bg-white cursor-pointer"
                    >
                      <option value="Approved">Approved</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Parts Waiting">Parts Waiting</option>
                      <option value="Ready">Ready</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Technician Work Plan Tasks</label>
                  <div class="space-y-1.5 mb-2">
                    <div 
                      v-for="(t, idx) in form.tasks" 
                      :key="idx" 
                      class="flex items-center justify-between text-xs bg-gray-50 px-2.5 py-1.5 rounded border border-gray-100"
                    >
                      <span class="font-medium text-gray-800">{{ t.name }} ({{ t.tech }})</span>
                      <button type="button" @click="removeTask(idx)" class="text-gray-400 hover:text-red-500 cursor-pointer">
                        <X class="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <input 
                      v-model="newTaskName" 
                      type="text" 
                      placeholder="Add task step..." 
                      class="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31]"
                      @keyup.enter.prevent="addTask"
                    />
                    <button 
                      type="button" 
                      @click="addTask" 
                      class="px-3 py-1.5 text-xs font-bold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>

            </div>

            <!-- Actions Bar -->
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button 
                type="button" 
                @click="close" 
                class="px-5 py-2.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="px-6 py-2.5 text-[11px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer"
              >
                {{ isEditMode ? 'Update Repair Job' : 'Create Repair Job Card' }}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  </div>
</template>
