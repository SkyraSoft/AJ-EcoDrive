<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ChevronDown, Search, Check, CheckCircle2, Plus, X, 
  ShieldAlert, AlertTriangle, Truck, DollarSign, Wrench, 
  FileCheck, ChevronRight, Download, ExternalLink, Calendar, 
  MapPin, Building, User, Tag, Clock, ArrowUpRight, CheckCircle, XCircle
} from 'lucide-vue-next'
import { store } from '@/store.js'

const router = useRouter()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

// Registry mapping for task types to detailed route inspection
const actionRouteRegistry = {
  'commercial_pricing': (item) => ({ path: '/sales/orders/detail', query: { id: item.recordRef || 'SO-8821' } }),
  'stock_reallocation': (item) => ({ path: '/inventory/transfers/detail', query: { id: item.recordRef || 'TR-221' } }),
  'operational_expense': (item) => ({ path: '/finance/expenses/detail', query: { id: item.recordRef || 'EXP-221' } }),
  'warranty_escalation': (item) => ({ path: '/after-sales/repairs/detail', query: { id: item.recordRef || 'RJ-109' } }),
  'inventory_governance': (item) => ({ path: '/inventory/quarantine/detail', query: { id: item.recordRef || 'QA-102' } })
}

const resolveActionRoute = (item) => {
  if (!item) return null
  const fn = actionRouteRegistry[item.flowType]
  if (fn) return fn(item)
  if (item.recordRef?.startsWith('SO')) return { path: '/sales/orders/detail', query: { id: item.recordRef } }
  if (item.recordRef?.startsWith('QT')) return { path: '/sales/quotations/detail', query: { id: item.recordRef } }
  if (item.recordRef?.startsWith('TR')) return { path: '/inventory/transfers/detail', query: { id: item.recordRef } }
  if (item.recordRef?.startsWith('EXP')) return { path: '/finance/expenses/detail', query: { id: item.recordRef } }
  if (item.recordRef?.startsWith('RJ') || item.recordRef?.startsWith('SC')) return { path: '/after-sales/repairs/detail', query: { id: item.recordRef } }
  if (item.recordRef?.startsWith('QA')) return { path: '/inventory/quarantine/detail', query: { id: item.recordRef } }
  return { path: '/dashboard/action-centre' }
}

// -------------------------------------------------------------
// TOAST NOTIFICATION
// -------------------------------------------------------------
const showToast = ref(false)
const toastMessage = ref('')
const triggerToast = (msg) => {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3500)
}

// -------------------------------------------------------------
// FILTERING & SEARCH
// -------------------------------------------------------------
const activePriority = ref('All')
const priorityTabs = ['All', 'Critical', 'High', 'Medium', 'Low']
const selectedFlowType = ref('All Types')
const selectedBranch = ref(isBranchUser.value ? user.value.branchName : 'All Branches')
const selectedStatus = ref('All')
const searchQuery = ref('')
const openDropdown = ref(null)

const flowTypes = [
  { key: 'All Types', label: 'All Action Types' },
  { key: 'commercial_pricing', label: 'Commercial & Pricing Exception' },
  { key: 'stock_reallocation', label: 'Inter-Branch Stock Reallocation' },
  { key: 'operational_expense', label: 'Emergency Operational Expenditure' },
  { key: 'warranty_escalation', label: 'Critical Warranty Claim' },
  { key: 'inventory_governance', label: 'Inventory Governance & Quarantine' }
]

const branches = ['All Branches', 'Peshawar', 'Islamabad', 'Lahore', 'Rawalpindi']

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const clearFilters = () => {
  activePriority.value = 'All'
  selectedFlowType.value = 'All Types'
  selectedBranch.value = isBranchUser.value ? user.value.branchName : 'All Branches'
  selectedStatus.value = 'All'
  searchQuery.value = ''
}

// -------------------------------------------------------------
// DATA COMPUTATIONS
// -------------------------------------------------------------
const actionItems = computed(() => {
  return store.actionQueue || []
})

const filteredQueue = computed(() => {
  const branchScope = isBranchUser.value ? user.value.branchName : selectedBranch.value

  return actionItems.value.filter(item => {
    // Branch filter
    if (branchScope && branchScope !== 'All Branches') {
      const matchBranch = item.branch?.toLowerCase() === branchScope.toLowerCase() ||
                          item.originBranch?.toLowerCase() === branchScope.toLowerCase() ||
                          item.branch === 'All Branches'
      if (!matchBranch) return false
    }

    // Priority filter
    if (activePriority.value !== 'All' && item.priority.toLowerCase() !== activePriority.value.toLowerCase()) {
      return false
    }

    // Flow Type filter
    if (selectedFlowType.value !== 'All Types' && item.flowType !== selectedFlowType.value) {
      return false
    }

    // Status filter
    if (selectedStatus.value !== 'All' && item.status.toLowerCase() !== selectedStatus.value.toLowerCase()) {
      return false
    }

    // Search filter
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = (item.title && item.title.toLowerCase().includes(q)) ||
                    (item.id && item.id.toLowerCase().includes(q)) ||
                    (item.recordRef && item.recordRef.toLowerCase().includes(q)) ||
                    (item.summary && item.summary.toLowerCase().includes(q)) ||
                    (item.typeLabel && item.typeLabel.toLowerCase().includes(q)) ||
                    (item.initiator && item.initiator.toLowerCase().includes(q))
      if (!match) return false
    }

    return true
  })
})

// Dynamic KPIs
const kpiStats = computed(() => {
  const all = actionItems.value
  const branchScope = isBranchUser.value ? user.value.branchName : null
  const scoped = branchScope ? all.filter(a => a.branch === branchScope || a.originBranch === branchScope || a.branch === 'All Branches') : all

  const pending = scoped.filter(a => a.status === 'Pending').length
  const critical = scoped.filter(a => a.priority === 'Critical' && a.status === 'Pending').length
  const dueToday = scoped.filter(a => a.due === 'Today' && a.status === 'Pending').length
  const resolved = scoped.filter(a => a.status === 'Approved' || a.status === 'Resolved' || a.status === 'Dispatched').length

  return {
    pending,
    critical,
    dueToday,
    resolved
  }
})

// -------------------------------------------------------------
// ACTION CREATION MODAL STATE & FORM
// -------------------------------------------------------------
const showCreateModal = ref(false)
const createStep = ref(1) // 1: Type Selection, 2: Detail Form
const selectedTypeForCreation = ref(null)

const standardTypes = [
  {
    id: 'commercial_pricing',
    title: 'Commercial & Pricing Exception',
    subtitle: 'Discount & Deal Terms Waiver',
    icon: DollarSign,
    colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400',
    description: 'Request special margin override, promotional rebate, or volume fleet price reduction exceeding branch policy limit.'
  },
  {
    id: 'stock_reallocation',
    title: 'Inter-Branch Stock Reallocation',
    subtitle: 'Urgent Vehicle Pull & Transfer',
    icon: Truck,
    colorClass: 'text-blue-700 bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400',
    description: 'Request expedited transfer of specific chassis VINs or vehicle units from another branch to meet immediate customer booking.'
  },
  {
    id: 'operational_expense',
    title: 'Emergency Operational Expenditure',
    subtitle: 'Branch Reimbursement & CapEx',
    icon: AlertTriangle,
    colorClass: 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400',
    description: 'Submit urgent showroom facilities repair, generator fuel, or logistics bills exceeding standard PKR 100,000 branch threshold.'
  },
  {
    id: 'warranty_escalation',
    title: 'Critical Warranty Claim',
    subtitle: 'High-Voltage & Technical Authorization',
    icon: Wrench,
    colorClass: 'text-red-700 bg-red-50 border-red-200 dark:bg-red-950/40 dark:text-red-400',
    description: 'Escalate workshop customer high-voltage battery degradation, motor controller faults, and request OEM replacement parts.'
  },
  {
    id: 'inventory_governance',
    title: 'Inventory Governance & Quarantine',
    subtitle: 'Cycle Discrepancy & Transit Damage',
    icon: ShieldAlert,
    colorClass: 'text-purple-700 bg-purple-50 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400',
    description: 'Document physical count variance, transit cargo crate damages, and request write-down or quarantine isolation release.'
  }
]

// Common action header fields
const actionForm = ref({
  title: '',
  priority: 'High',
  due: 'Today',
  branch: isBranchUser.value ? user.value.branchName : 'Peshawar',
  summary: '',

  // Type 1: Commercial Pricing
  pricing: {
    customerName: '',
    customerContact: '',
    quotationRef: 'QT-',
    orderRef: 'SO-',
    modelName: 'BRG E-125 Urban High-Speed Scooter',
    unitCount: 1,
    listPricePerUnit: 340000,
    requestedDiscountPercent: 10,
    competitorContext: '',
    standardMarginPercent: 24.5
  },

  // Type 2: Stock Reallocation
  stock: {
    originBranch: 'Lahore',
    destinationBranch: isBranchUser.value ? user.value.branchName : 'Peshawar',
    modelSku: 'BRG-EV-E125-GRN',
    modelName: 'BRG E-125 Urban High-Speed Scooter',
    requestedQty: 1,
    chassisVins: '',
    linkedBookingRef: 'SO-',
    requiredByDate: 'Tomorrow, 05:00 PM',
    logisticsCarrier: 'Dedicated Inter-Branch Van',
    freightCostEstimate: 25000,
    urgencyReason: ''
  },

  // Type 3: Operational Expense
  expense: {
    expenseCategory: 'Utilities & Power Backup',
    amountPkr: 125000,
    payeeVendor: '',
    vendorNtn: '',
    paymentMethod: 'Direct Vendor Bank Transfer',
    invoiceRef: 'BILL-',
    operationalEmergencyJustification: '',
    delayImpact: ''
  },

  // Type 4: Warranty Claim
  warranty: {
    customerName: '',
    customerPhone: '',
    vehicleVin: '',
    modelName: 'BRG E-125',
    odometerKm: 4500,
    defectComponent: 'Main Traction Battery Module 72V',
    diagnosticCode: 'BMS-ERR-042',
    technicianFindings: '',
    replacementSkuNeeded: 'PART-BAT-7252-NMC',
    estimatedPartCost: 185000,
    safetyRiskLevel: 'High'
  },

  // Type 5: Inventory Governance
  governance: {
    auditDate: '24 Sep 2026',
    affectedVinOrSku: '',
    modelName: 'BRG DS-11 Sports Commuter',
    systemRecordedQty: 1,
    physicalFoundQty: 0,
    discrepancyUnitCount: 1,
    estimatedVariancePkr: 320000,
    rootCauseClassification: 'Transit Mishandling',
    recommendedAction: 'Quarantine Segregation in Bay Q-3',
    incidentDescription: '',
    managerCertification: 'Confirmed physical inspection by Showroom BM'
  }
})

// Auto-calculations for Type 1 Pricing
const calculatedTotalListPrice = computed(() => {
  return (actionForm.value.pricing.unitCount || 1) * (actionForm.value.pricing.listPricePerUnit || 0)
})

const calculatedDiscountAmount = computed(() => {
  const total = calculatedTotalListPrice.value
  const pct = actionForm.value.pricing.requestedDiscountPercent || 0
  return (total * pct) / 100
})

const calculatedProposedPrice = computed(() => {
  return calculatedTotalListPrice.value - calculatedDiscountAmount.value
})

const calculatedProjectedMargin = computed(() => {
  const std = actionForm.value.pricing.standardMarginPercent || 24.5
  const discount = actionForm.value.pricing.requestedDiscountPercent || 0
  return Math.max(0, std - (discount * 0.95)).toFixed(1)
})

const openCreateModal = () => {
  createStep.value = 1
  selectedTypeForCreation.value = null
  actionForm.value.title = ''
  actionForm.value.summary = ''
  showCreateModal.value = true
}

const selectTypeForCreation = (type) => {
  selectedTypeForCreation.value = type
  createStep.value = 2

  // Pre-fill reasonable title
  if (type.id === 'commercial_pricing') {
    actionForm.value.title = 'Discount Exception Request - Special Deal Waiver'
  } else if (type.id === 'stock_reallocation') {
    actionForm.value.title = `Expedited Stock Reallocation to ${actionForm.value.branch} Showroom`
  } else if (type.id === 'operational_expense') {
    actionForm.value.title = `Emergency Branch Expense Requisition (${actionForm.value.expense.expenseCategory})`
  } else if (type.id === 'warranty_escalation') {
    actionForm.value.title = `Critical High-Voltage Warranty Escalation (${actionForm.value.warranty.defectComponent})`
  } else if (type.id === 'inventory_governance') {
    actionForm.value.title = `Inventory Discrepancy & Quarantine Sign-Off (${actionForm.value.governance.rootCauseClassification})`
  }
}

const submitCreateAction = () => {
  if (!actionForm.value.title.trim()) {
    triggerToast('Please provide an Action Title.')
    return
  }

  const type = selectedTypeForCreation.value
  let specificPayload = {}

  if (type.id === 'commercial_pricing') {
    specificPayload.pricingData = {
      ...actionForm.value.pricing,
      totalListPrice: calculatedTotalListPrice.value,
      requestedDiscountAmount: calculatedDiscountAmount.value,
      proposedDealValue: calculatedProposedPrice.value,
      projectedMarginPercent: parseFloat(calculatedProjectedMargin.value)
    }
    actionForm.value.summary = `${actionForm.value.pricing.requestedDiscountPercent}% discount requested on ${actionForm.value.pricing.unitCount}x ${actionForm.value.pricing.modelName} (Deal value: ${store.formatCurrency(calculatedProposedPrice.value)})`
  } else if (type.id === 'stock_reallocation') {
    specificPayload.stockData = { ...actionForm.value.stock }
    actionForm.value.summary = `Requesting ${actionForm.value.stock.requestedQty}x ${actionForm.value.stock.modelName} from ${actionForm.value.stock.originBranch} to ${actionForm.value.stock.destinationBranch}`
  } else if (type.id === 'operational_expense') {
    specificPayload.expenseData = { ...actionForm.value.expense }
    actionForm.value.summary = `${store.formatCurrency(actionForm.value.expense.amountPkr)} for ${actionForm.value.expense.expenseCategory} - Payee: ${actionForm.value.expense.payeeVendor || 'Vendor'}`
  } else if (type.id === 'warranty_escalation') {
    specificPayload.warrantyData = { ...actionForm.value.warranty }
    actionForm.value.summary = `Warranty replacement for ${actionForm.value.warranty.defectComponent} (${actionForm.value.warranty.diagnosticCode}) on ${actionForm.value.warranty.vehicleVin || 'Unit'}`
  } else if (type.id === 'inventory_governance') {
    specificPayload.governanceData = { ...actionForm.value.governance }
    actionForm.value.summary = `Quarantine/Discrepancy resolution for ${actionForm.value.governance.discrepancyUnitCount} unit(s) (${store.formatCurrency(actionForm.value.governance.estimatedVariancePkr)})`
  }

  const newItem = store.createActionItem({
    flowType: type.id,
    typeLabel: type.title,
    title: actionForm.value.title,
    priority: actionForm.value.priority,
    due: actionForm.value.due,
    branch: actionForm.value.branch,
    originBranch: type.id === 'stock_reallocation' ? actionForm.value.stock.originBranch : null,
    initiator: isBranchUser.value ? `${user.value.name || 'Branch Manager'} (${user.value.branchName})` : 'Super Admin (Head Office)',
    assignedTo: isBranchUser.value ? 'Super Admin' : `${actionForm.value.branch} Branch Manager`,
    recordRef: type.id === 'commercial_pricing' ? actionForm.value.pricing.orderRef :
               type.id === 'stock_reallocation' ? actionForm.value.stock.linkedBookingRef :
               type.id === 'operational_expense' ? actionForm.value.expense.invoiceRef :
               type.id === 'warranty_escalation' ? 'RJ-110' : 'QA-104',
    summary: actionForm.value.summary,
    ...specificPayload
  })

  showCreateModal.value = false
  triggerToast(`Action [${newItem.id}] created and routed successfully!`)
}

// -------------------------------------------------------------
// TREATMENT & RESOLUTION MODAL STATE
// -------------------------------------------------------------
const selectedActionForTreatment = ref(null)
const showTreatmentModal = ref(false)
const decisionNotes = ref('')
const counterDiscountPercent = ref(8)
const showCounterInput = ref(false)

const openTreatmentModal = (item) => {
  selectedActionForTreatment.value = item
  decisionNotes.value = item.resolution?.decisionNotes || ''
  showCounterInput.value = false
  counterDiscountPercent.value = 8
  showTreatmentModal.value = true
}

const executeDecision = (status, customResult = {}) => {
  if (!selectedActionForTreatment.value) return

  try {
    store.resolveActionItem(selectedActionForTreatment.value.id, {
      status,
      decisionNotes: decisionNotes.value,
      treatmentResult: customResult
    })

    triggerToast(`Action [${selectedActionForTreatment.value.id}] treated as: ${status}!`)
    showTreatmentModal.value = false
  } catch (e) {
    triggerToast(`Error: ${e.message}`)
  }
}

// Export Queue
const exportActionQueue = () => {
  const headers = ['ID', 'Priority', 'Type', 'Title', 'Branch', 'Initiator', 'Due', 'Status', 'Summary']
  const rows = filteredQueue.value.map(item => [
    item.id,
    item.priority,
    item.typeLabel,
    `"${item.title.replace(/"/g, '""')}"`,
    item.branch,
    item.initiator,
    item.due,
    item.status,
    `"${(item.summary || '').replace(/"/g, '""')}"`
  ])
  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `action_centre_export_${Date.now()}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  triggerToast(`Exported ${filteredQueue.value.length} actions successfully.`)
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openDropdown = null">
    <!-- Toast Notification -->
    <div 
      v-if="showToast" 
      class="fixed bottom-5 right-5 z-[110] bg-[#165A31] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200"
    >
      <CheckCircle2 class="w-5 h-5 text-green-300" />
      <span class="text-xs font-bold">{{ toastMessage }}</span>
    </div>

    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <div class="text-[11px] text-gray-400 mb-1">
          <span v-if="isBranchUser">Branch Manager / Dashboard / <span class="font-medium text-gray-600 dark:text-gray-300">Action Centre</span></span>
          <span v-else>Super Admin / Management / <span class="font-medium text-gray-600 dark:text-gray-300">Action Centre</span></span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900 dark:text-white">Action Centre</h1>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span v-if="isBranchUser">Showroom operational escalations, urgent transfer requests, and management approvals for {{ user.branchName }} Branch.</span>
          <span v-else>Nationwide operational command queue: pricing overrides, fleet transfers, high-value expenses, warranty escalations and audit sign-offs.</span>
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-3">
        <button 
          @click="openCreateModal"
          class="bg-[#165A31] hover:bg-[#124a28] text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <Plus class="w-4 h-4" />
          <span>{{ isBranchUser ? '+ Raise Action Request' : '+ Issue Action Directive' }}</span>
        </button>
      </div>
    </div>

    <!-- 4 KPI Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-slate-900 p-5 rounded-[12px] border border-gray-100 dark:border-gray-800 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <div class="text-xs font-semibold text-gray-400 mb-3">Pending Actions</div>
        <div class="flex items-baseline justify-between">
          <div class="text-[26px] font-bold text-gray-900 dark:text-white">{{ kpiStats.pending }}</div>
          <span class="text-[11px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded">Action Required</span>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 p-5 rounded-[12px] border border-gray-100 dark:border-gray-800 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <div class="text-xs font-semibold text-gray-400 mb-3">Critical Priority</div>
        <div class="flex items-baseline justify-between">
          <div class="text-[26px] font-bold text-red-600 dark:text-red-400">{{ kpiStats.critical }}</div>
          <span class="text-[11px] font-bold text-red-700 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded">High Severity</span>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 p-5 rounded-[12px] border border-gray-100 dark:border-gray-800 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <div class="text-xs font-semibold text-gray-400 mb-3">Due Today</div>
        <div class="flex items-baseline justify-between">
          <div class="text-[26px] font-bold text-gray-900 dark:text-white">{{ kpiStats.dueToday }}</div>
          <span class="text-[11px] font-bold text-blue-700 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded">Same Day SLA</span>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 p-5 rounded-[12px] border border-gray-100 dark:border-gray-800 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <div class="text-xs font-semibold text-gray-400 mb-3">Resolved / Treated</div>
        <div class="flex items-baseline justify-between">
          <div class="text-[26px] font-bold text-[#165A31] dark:text-emerald-400">{{ kpiStats.resolved }}</div>
          <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">Completed</span>
        </div>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-wrap items-center gap-2">
        <!-- Priority Tabs -->
        <div class="flex items-center bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-lg p-1 shadow-sm">
          <button 
            v-for="tab in priorityTabs" 
            :key="tab"
            @click="activePriority = tab"
            class="px-3 py-1 text-xs font-bold rounded transition-colors cursor-pointer"
            :class="activePriority === tab ? 'bg-[#eefcf2] text-[#165A31] dark:bg-emerald-950/60 dark:text-emerald-300' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'"
          >
            {{ tab }}
          </button>
        </div>

        <!-- Flow Type Dropdown (The 5 Enterprise Flows) -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleDropdown('type')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedFlowType !== 'All Types' }"
          >
            <span>{{ flowTypes.find(f => f.key === selectedFlowType)?.label || 'Action Type' }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div 
            v-if="openDropdown === 'type'" 
            class="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <button 
              v-for="t in flowTypes" 
              :key="t.key" 
              @click="selectedFlowType = t.key; openDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              :class="selectedFlowType === t.key ? 'font-bold text-[#165A31] bg-[#eefcf2]/50 dark:bg-emerald-950/50' : 'text-gray-700 dark:text-gray-200'"
            >
              <span>{{ t.label }}</span>
              <Check v-if="selectedFlowType === t.key" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <!-- Branch Dropdown (for Super Admin) -->
        <div v-if="!isBranchUser" class="relative" @click.stop>
          <button 
            @click="toggleDropdown('branch')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedBranch !== 'All Branches' }"
          >
            <span>Branch: {{ selectedBranch }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div 
            v-if="openDropdown === 'branch'" 
            class="absolute top-full left-0 mt-1 w-44 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <button 
              v-for="b in branches" 
              :key="b" 
              @click="selectedBranch = b; openDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              :class="selectedBranch === b ? 'font-bold text-[#165A31] bg-[#eefcf2]/50 dark:bg-emerald-950/50' : 'text-gray-700 dark:text-gray-200'"
            >
              <span>{{ b }}</span>
              <Check v-if="selectedBranch === b" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <!-- Status Filter Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleDropdown('status')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedStatus !== 'All' }"
          >
            <span>Status: {{ selectedStatus }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div 
            v-if="openDropdown === 'status'" 
            class="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <button 
              v-for="s in ['All', 'Pending', 'Approved', 'Resolved', 'Rejected']" 
              :key="s" 
              @click="selectedStatus = s; openDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              :class="selectedStatus === s ? 'font-bold text-[#165A31] bg-[#eefcf2]/50 dark:bg-emerald-950/50' : 'text-gray-700 dark:text-gray-200'"
            >
              <span>{{ s }}</span>
              <Check v-if="selectedStatus === s" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <!-- Search Input -->
        <div class="relative w-48 sm:w-60 shadow-sm">
          <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search actions, records, VINs..." 
            class="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
          />
        </div>

        <!-- Reset Button -->
        <button 
          v-if="searchQuery || activePriority !== 'All' || selectedFlowType !== 'All Types' || selectedStatus !== 'All'" 
          @click="clearFilters" 
          class="text-xs font-semibold text-gray-400 hover:text-red-600 px-2 py-1 transition-colors cursor-pointer"
        >
          Reset
        </button>
      </div>

      <!-- Export Button -->
      <div>
        <button 
          @click="exportActionQueue"
          class="px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
        >
          <Download class="w-3.5 h-3.5" />
          <span>Export Queue</span>
        </button>
      </div>
    </div>

    <!-- Main Action Queue Table -->
    <div class="bg-white dark:bg-slate-900 rounded-[12px] border border-gray-100 dark:border-gray-800 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div>
          <h3 class="text-sm font-bold text-gray-900 dark:text-white">Active Operational Work Queue</h3>
          <p class="text-[11px] text-gray-400 mt-0.5">Click any row to open the full case context and apply treatment/resolution decisions.</p>
        </div>
        <span class="text-xs font-semibold px-2.5 py-1 rounded bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300">
          {{ filteredQueue.length }} Active Tasks
        </span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50/50 dark:bg-slate-800/40 border-b border-gray-100 dark:border-gray-800 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <th class="px-5 py-3">Priority</th>
              <th class="px-5 py-3">Type</th>
              <th class="px-5 py-3">Action Description</th>
              <th class="px-5 py-3">Branch / Source</th>
              <th class="px-5 py-3">Linked Ref</th>
              <th class="px-5 py-3">Due</th>
              <th class="px-5 py-3">Status</th>
              <th class="px-5 py-3 text-right">Treatment</th>
            </tr>
          </thead>
          <tbody class="text-xs divide-y divide-gray-50 dark:divide-gray-800">
            <tr 
              v-for="item in filteredQueue" 
              :key="item.id"
              @click="openTreatmentModal(item)"
              class="hover:bg-gray-50/70 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
            >
              <td class="px-5 py-4 align-middle">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap" :class="item.priorityClass">
                  {{ item.priority }}
                </span>
              </td>
              <td class="px-5 py-4 align-middle font-semibold text-gray-700 dark:text-gray-200">
                <div class="flex items-center gap-1.5">
                  <DollarSign v-if="item.flowType === 'commercial_pricing'" class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <Truck v-else-if="item.flowType === 'stock_reallocation'" class="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <AlertTriangle v-else-if="item.flowType === 'operational_expense'" class="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <Wrench v-else-if="item.flowType === 'warranty_escalation'" class="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <ShieldAlert v-else class="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span class="truncate max-w-[140px]">{{ item.typeLabel }}</span>
                </div>
              </td>
              <td class="px-5 py-4 align-middle">
                <div class="font-bold text-gray-900 dark:text-white leading-tight line-clamp-1">{{ item.title }}</div>
                <div class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{{ item.summary }}</div>
              </td>
              <td class="px-5 py-4 align-middle text-gray-600 dark:text-gray-300 whitespace-nowrap">
                <span class="font-medium">{{ item.branch }}</span>
                <span v-if="item.originBranch" class="text-[10px] text-gray-400 block">From: {{ item.originBranch }}</span>
              </td>
              <td class="px-5 py-4 align-middle whitespace-nowrap font-mono text-[11px] text-[#165A31] dark:text-emerald-400 font-semibold">
                {{ item.recordRef || '—' }}
              </td>
              <td class="px-5 py-4 align-middle text-gray-600 dark:text-gray-300 whitespace-nowrap">
                {{ item.due }}
              </td>
              <td class="px-5 py-4 align-middle whitespace-nowrap">
                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold" :class="item.statusClass">
                  {{ item.status }}
                </span>
              </td>
              <td class="px-5 py-4 align-middle text-right whitespace-nowrap">
                <button 
                  @click.stop="openTreatmentModal(item)"
                  class="text-xs font-bold text-[#165A31] dark:text-emerald-400 hover:underline flex items-center justify-end gap-1 ml-auto cursor-pointer"
                >
                  Treat / Inspect &rarr;
                </button>
              </td>
            </tr>
            <tr v-if="filteredQueue.length === 0">
              <td colspan="8" class="text-center py-12 text-gray-500">
                <div class="flex flex-col items-center justify-center">
                  <span class="text-3xl mb-2">📋</span>
                  <p class="text-sm font-semibold text-gray-700 dark:text-gray-300">No action tasks found matching your filters</p>
                  <p class="text-xs text-gray-400 mt-1">Try resetting your filters or search terms</p>
                  <button @click="clearFilters" class="mt-3 px-3 py-1.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 text-xs font-semibold rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
                    Clear all filters
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- CREATE ACTION MODAL (5 SPECIALIZED ENTERPRISE FLOWS)             -->
    <!-- ================================================================= -->
    <div 
      v-if="showCreateModal" 
      class="fixed inset-0 z-[120] bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div class="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 max-h-[90vh] flex flex-col overflow-hidden">
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
          <div>
            <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Step {{ createStep }} of 2: {{ createStep === 1 ? 'Select Action Flow Category' : selectedTypeForCreation?.title }}
            </div>
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">
              {{ createStep === 1 ? 'Initiate Enterprise Operational Action' : `Configure ${selectedTypeForCreation?.title}` }}
            </h2>
          </div>
          <button @click="showCreateModal = false" class="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 overflow-y-auto flex-1 space-y-6">
          <!-- STEP 1: CHOOSE ONE OF THE 5 ENTERPRISE TYPES -->
          <div v-if="createStep === 1" class="space-y-4">
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Select the operational governance category. Each flow provides specialized validation, dedicated fields, and automated authorization routing.
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div 
                v-for="type in standardTypes" 
                :key="type.id"
                @click="selectTypeForCreation(type)"
                class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-[#165A31] dark:hover:border-emerald-500 hover:bg-[#eefcf2]/20 dark:hover:bg-emerald-950/20 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="w-8 h-8 rounded-lg flex items-center justify-center font-bold" :class="type.colorClass">
                      <component :is="type.icon" class="w-4 h-4" />
                    </span>
                    <span class="text-[10px] font-bold text-gray-400 group-hover:text-[#165A31] transition-colors flex items-center gap-0.5">
                      Select Flow &rsaquo;
                    </span>
                  </div>
                  <h4 class="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#165A31] transition-colors">{{ type.title }}</h4>
                  <div class="text-[11px] font-semibold text-[#165A31] dark:text-emerald-400 mt-0.5">{{ type.subtitle }}</div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">{{ type.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- STEP 2: TAILORED FORM FOR THE SELECTED TYPE -->
          <div v-else class="space-y-5">
            <!-- Common Fields -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="sm:col-span-2">
                <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Action Title *</label>
                <input 
                  v-model="actionForm.title" 
                  type="text" 
                  class="w-full px-3 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-slate-800 dark:text-white"
                  placeholder="Concise operational action title..."
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                <select 
                  v-model="actionForm.priority"
                  class="w-full px-3 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-slate-800 dark:text-white"
                >
                  <option value="Critical">Critical (Immediate SLA)</option>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <!-- TYPE 1: COMMERCIAL & PRICING EXCEPTION FORM -->
            <div v-if="selectedTypeForCreation?.id === 'commercial_pricing'" class="bg-gray-50/70 dark:bg-slate-800/40 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
              <div class="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign class="w-4 h-4" />
                <span>Commercial Terms & Margin Exception Details</span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Customer / Organization Name *</label>
                  <input v-model="actionForm.pricing.customerName" type="text" placeholder="e.g. Peshawar Logistics Co" class="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-slate-900" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Customer Phone</label>
                  <input v-model="actionForm.pricing.customerContact" type="text" placeholder="0300-XXXXXXX" class="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-slate-900" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Vehicle Model / Category</label>
                  <select v-model="actionForm.pricing.modelName" class="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-slate-900">
                    <option value="BRG E-125 Urban High-Speed Scooter">BRG E-125 Urban High-Speed Scooter</option>
                    <option value="BRG Cargo Delivery Electric Trike (72V 100Ah)">BRG Cargo Delivery Electric Trike (72V 100Ah)</option>
                    <option value="BRG DS-11 Sports Commuter">BRG DS-11 Sports Commuter</option>
                    <option value="BRG EV5 Classic Commuter">BRG EV5 Classic Commuter</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Quotation / Order Ref</label>
                  <input v-model="actionForm.pricing.orderRef" type="text" placeholder="SO-8821 or QT-8421" class="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-slate-900 font-mono" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Unit Count</label>
                  <input v-model.number="actionForm.pricing.unitCount" type="number" min="1" class="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-slate-900" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Requested Discount % (Showroom Limit: 8%)</label>
                  <input v-model.number="actionForm.pricing.requestedDiscountPercent" type="number" min="1" max="30" class="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-slate-900" />
                </div>
              </div>

              <!-- Live Financial Calculations Panel -->
              <div class="bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-emerald-100 dark:border-emerald-900/40 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div>
                  <div class="text-[10px] text-gray-400 font-semibold uppercase">Total Standard Price</div>
                  <div class="text-xs font-bold text-gray-800 dark:text-gray-200 mt-0.5">{{ store.formatCurrency(calculatedTotalListPrice) }}</div>
                </div>
                <div>
                  <div class="text-[10px] text-gray-400 font-semibold uppercase">Waiver / Discount Amount</div>
                  <div class="text-xs font-bold text-red-600 dark:text-red-400 mt-0.5">-{{ store.formatCurrency(calculatedDiscountAmount) }}</div>
                </div>
                <div>
                  <div class="text-[10px] text-gray-400 font-semibold uppercase">Net Proposed Price</div>
                  <div class="text-xs font-bold text-[#165A31] dark:text-emerald-400 mt-0.5">{{ store.formatCurrency(calculatedProposedPrice) }}</div>
                </div>
                <div>
                  <div class="text-[10px] text-gray-400 font-semibold uppercase">Projected Gross Margin</div>
                  <div class="text-xs font-bold mt-0.5" :class="calculatedProjectedMargin >= 15 ? 'text-green-600' : 'text-amber-600'">
                    {{ calculatedProjectedMargin }}%
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Competitor Context & Deal Justification *</label>
                <textarea v-model="actionForm.pricing.competitorContext" rows="2" placeholder="Why should Head Office grant this price reduction? (e.g. competitor offer, key trial deal)..." class="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-slate-900"></textarea>
              </div>
            </div>

            <!-- TYPE 2: INTER-BRANCH STOCK REALLOCATION FORM -->
            <div v-else-if="selectedTypeForCreation?.id === 'stock_reallocation'" class="bg-gray-50/70 dark:bg-slate-800/40 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
              <div class="text-xs font-bold text-blue-800 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <Truck class="w-4 h-4" />
                <span>Inter-Branch Stock Movement & Freight Dispatch Details</span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Origin Source Branch / Hub *</label>
                  <select v-model="actionForm.stock.originBranch" class="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-slate-900">
                    <option value="Lahore">Lahore Central Hub</option>
                    <option value="Islamabad">Islamabad Branch</option>
                    <option value="Rawalpindi">Rawalpindi Hub</option>
                    <option value="Peshawar">Peshawar Branch</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Destination Requesting Showroom *</label>
                  <select v-model="actionForm.stock.destinationBranch" class="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-slate-900">
                    <option value="Peshawar">Peshawar Showroom</option>
                    <option value="Islamabad">Islamabad Showroom</option>
                    <option value="Lahore">Lahore Showroom</option>
                    <option value="Rawalpindi">Rawalpindi Showroom</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Target Model SKU</label>
                  <input v-model="actionForm.stock.modelName" type="text" class="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-slate-900" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Units Required</label>
                  <input v-model.number="actionForm.stock.requestedQty" type="number" min="1" class="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-slate-900" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Specific Chassis VINs (if known)</label>
                  <input v-model="actionForm.stock.chassisVins" type="text" placeholder="e.g. VIN-LHE-2026-00411" class="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-slate-900 font-mono" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Linked Customer Booking / Order Ref</label>
                  <input v-model="actionForm.stock.linkedBookingRef" type="text" placeholder="SO-7910" class="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-slate-900 font-mono" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Logistics Carrier Mode</label>
                  <select v-model="actionForm.stock.logisticsCarrier" class="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-slate-900">
                    <option value="TCS Dedicated Inter-Branch Van">TCS Dedicated Inter-Branch Van</option>
                    <option value="Showroom Logistics Carrier">Showroom Logistics Carrier</option>
                    <option value="Flatbed Tow Truck (Heavy Trikes)">Flatbed Tow Truck (Heavy Trikes)</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Estimated Freight Cost (PKR)</label>
                  <input v-model.number="actionForm.stock.freightCostEstimate" type="number" class="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-slate-900" />
                </div>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Urgency & Operational Reason *</label>
                <textarea v-model="actionForm.stock.urgencyReason" rows="2" placeholder="Why is this stock pull required urgently? Customer deposit status, delivery deadline..." class="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-slate-900"></textarea>
              </div>
            </div>

            <!-- TYPE 3: OPERATIONAL EXPENSE FORM -->
            <div v-else-if="selectedTypeForCreation?.id === 'operational_expense'" class="bg-gray-50/70 dark:bg-slate-800/40 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
              <div class="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle class="w-4 h-4" />
                <span>Emergency Operational Expenditure & Branch Reimbursement</span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Expense Category *</label>
                  <select v-model="actionForm.expense.expenseCategory" class="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-slate-900">
                    <option value="Utilities & Power Backup">Utilities & Power Backup (Generator Fuel / Inverter)</option>
                    <option value="Facilities Repair">Facilities & Structural Glass Repair</option>
                    <option value="Emergency Logistics">Emergency Freight & Towing</option>
                    <option value="Local Marketing">Local Outdoor Showroom Marketing</option>
                    <option value="Municipal & Regulatory">Municipal & Showroom License Fees</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Invoice / Bill Amount (PKR) *</label>
                  <input v-model.number="actionForm.expense.amountPkr" type="number" min="1" class="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-slate-900 font-bold" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Payee Vendor / Contractor Name *</label>
                  <input v-model="actionForm.expense.payeeVendor" type="text" placeholder="Vendor company name" class="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-slate-900" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Vendor NTN / Tax ID</label>
                  <input v-model="actionForm.expense.vendorNtn" type="text" placeholder="NTN-XXXXXXX" class="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-slate-900" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Disbursement Mode</label>
                  <select v-model="actionForm.expense.paymentMethod" class="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-slate-900">
                    <option value="Direct Vendor Bank Transfer">Direct Vendor Bank Transfer</option>
                    <option value="Cash Petty Reimbursement">Cash Petty Reimbursement</option>
                    <option value="Head Office Cheque">Head Office Cross Cheque</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Bill / Invoice Reference #</label>
                  <input v-model="actionForm.expense.invoiceRef" type="text" placeholder="INV-XXXX" class="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-slate-900 font-mono" />
                </div>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Emergency Justification & Impact of Delay *</label>
                <textarea v-model="actionForm.expense.operationalEmergencyJustification" rows="2" placeholder="Why is this emergency expenditure necessary? Explain consequence of not approving..." class="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-slate-900"></textarea>
              </div>
            </div>

            <!-- TYPE 4: CRITICAL WARRANTY CLAIM FORM -->
            <div v-else-if="selectedTypeForCreation?.id === 'warranty_escalation'" class="bg-gray-50/70 dark:bg-slate-800/40 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
              <div class="text-xs font-bold text-red-800 dark:text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                <Wrench class="w-4 h-4" />
                <span>High-Voltage Technical Warranty & OEM Replacement Part Escalation</span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Customer Name & Phone *</label>
                  <input v-model="actionForm.warranty.customerName" type="text" placeholder="Customer Name" class="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-slate-900" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Vehicle Chassis VIN *</label>
                  <input v-model="actionForm.warranty.vehicleVin" type="text" placeholder="VIN-PK-BRG-XXXX-XXXXX" class="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-slate-900 font-mono" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Odometer Reading (km)</label>
                  <input v-model.number="actionForm.warranty.odometerKm" type="number" class="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-slate-900" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Defective Component *</label>
                  <select v-model="actionForm.warranty.defectComponent" class="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-slate-900">
                    <option value="Main Traction Battery Module 72V">Main Traction Battery Module 72V 52Ah</option>
                    <option value="BLDC Hub Motor & Rotor Assembly">BLDC Hub Motor & Rotor Assembly</option>
                    <option value="Sine-Wave Intelligent Controller">Sine-Wave Intelligent Controller</option>
                    <option value="On-board Fast Charging Unit">On-board Fast Charging Unit</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">OBD / BMS Diagnostic DTC Code</label>
                  <input v-model="actionForm.warranty.diagnosticCode" type="text" placeholder="e.g. BMS-ERR-042: Cell Under-Voltage" class="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-slate-900 font-mono" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Replacement OEM SKU Needed</label>
                  <input v-model="actionForm.warranty.replacementSkuNeeded" type="text" placeholder="PART-BAT-7252-NMC" class="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-slate-900 font-mono" />
                </div>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Workshop Technician Findings & Safety Assessment *</label>
                <textarea v-model="actionForm.warranty.technicianFindings" rows="2" placeholder="Describe cell voltage drift, temperature shutdown, lack of water damage/puncture..." class="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-slate-900"></textarea>
              </div>
            </div>

            <!-- TYPE 5: INVENTORY GOVERNANCE FORM -->
            <div v-else-if="selectedTypeForCreation?.id === 'inventory_governance'" class="bg-gray-50/70 dark:bg-slate-800/40 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
              <div class="text-xs font-bold text-purple-800 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert class="w-4 h-4" />
                <span>Inventory Discrepancy & Quarantine Release Sign-Off</span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Affected Serialized VIN(s) / SKU *</label>
                  <input v-model="actionForm.governance.affectedVinOrSku" type="text" placeholder="VIN-PK-BRG-2026-00941" class="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-slate-900 font-mono" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Vehicle Model</label>
                  <input v-model="actionForm.governance.modelName" type="text" class="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-slate-900" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Discrepancy / Damaged Unit Count</label>
                  <input v-model.number="actionForm.governance.discrepancyUnitCount" type="number" min="1" class="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-slate-900" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Estimated Financial Impact (PKR)</label>
                  <input v-model.number="actionForm.governance.estimatedVariancePkr" type="number" class="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-slate-900" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Root Cause Classification</label>
                  <select v-model="actionForm.governance.rootCauseClassification" class="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-slate-900">
                    <option value="Transit Mishandling by Karachi Port Logistics">Transit Mishandling by Transporter</option>
                    <option value="Physical Cycle Count Variance">Physical Cycle Count Variance</option>
                    <option value="Unrecorded Inter-Branch Shift">Unrecorded Inter-Branch Shift</option>
                    <option value="Manufacturing Defect Discovered in Pre-Delivery Inspection">Pre-Delivery Inspection Defect</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Proposed Resolution Action</label>
                  <select v-model="actionForm.governance.recommendedAction" class="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-slate-900">
                    <option value="Quarantine Segregation in Bay Q-3 & Insurance Claim">Quarantine Segregation & Insurance Claim</option>
                    <option value="Inventory Write-Down to P&L">Inventory Write-Down to P&L</option>
                    <option value="Release to Active Stock After Workshop Refurbishment">Release to Stock After Refurbishment</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Incident Report & Evidence Description *</label>
                <textarea v-model="actionForm.governance.incidentDescription" rows="2" placeholder="Detailed physical observations, damaged parts, crate status, delivery slip notations..." class="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-slate-900"></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-4 bg-gray-50 dark:bg-slate-800/80 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
          <button 
            v-if="createStep === 2" 
            @click="createStep = 1"
            class="text-xs font-semibold text-gray-600 dark:text-gray-300 hover:underline cursor-pointer"
          >
            &larr; Back to Categories
          </button>
          <div v-else></div>

          <div class="flex items-center gap-2">
            <button 
              @click="showCreateModal = false"
              class="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              v-if="createStep === 2"
              @click="submitCreateAction"
              class="px-5 py-2 text-xs font-semibold text-white bg-[#165A31] hover:bg-[#124a28] rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Submit Action Request
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- TREATMENT & RESOLUTION DRAWER / MODAL                             -->
    <!-- ================================================================= -->
    <div 
      v-if="showTreatmentModal && selectedActionForTreatment" 
      class="fixed inset-0 z-[120] bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div class="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 max-h-[92vh] flex flex-col overflow-hidden">
        <!-- Drawer Header -->
        <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0 bg-gray-50/50 dark:bg-slate-800/40">
          <div>
            <div class="flex items-center gap-2">
              <span class="font-mono text-xs font-bold text-[#165A31] dark:text-emerald-400">{{ selectedActionForTreatment.id }}</span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded" :class="selectedActionForTreatment.priorityClass">
                {{ selectedActionForTreatment.priority }}
              </span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full" :class="selectedActionForTreatment.statusClass">
                {{ selectedActionForTreatment.status }}
              </span>
            </div>
            <h2 class="text-base font-bold text-gray-900 dark:text-white mt-1">{{ selectedActionForTreatment.title }}</h2>
          </div>
          <button @click="showTreatmentModal = false" class="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Drawer Body -->
        <div class="p-6 overflow-y-auto flex-1 space-y-5">
          <!-- Metadata Strip -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-gray-50 dark:bg-slate-800/60 rounded-xl text-xs">
            <div>
              <span class="text-[10px] font-bold text-gray-400 uppercase block">Initiator</span>
              <span class="font-semibold text-gray-800 dark:text-gray-200">{{ selectedActionForTreatment.initiator }}</span>
            </div>
            <div>
              <span class="text-[10px] font-bold text-gray-400 uppercase block">Branch Location</span>
              <span class="font-semibold text-gray-800 dark:text-gray-200">{{ selectedActionForTreatment.branch }}</span>
            </div>
            <div>
              <span class="text-[10px] font-bold text-gray-400 uppercase block">Logged At</span>
              <span class="font-semibold text-gray-800 dark:text-gray-200">{{ selectedActionForTreatment.createdAt }}</span>
            </div>
            <div>
              <span class="text-[10px] font-bold text-gray-400 uppercase block">Linked Record</span>
              <span class="font-mono font-bold text-[#165A31] dark:text-emerald-400">{{ selectedActionForTreatment.recordRef || 'None' }}</span>
            </div>
          </div>

          <!-- Summary Card -->
          <div class="p-3.5 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-300 leading-relaxed">
            <span class="font-bold">Operational Context: </span>
            {{ selectedActionForTreatment.summary }}
          </div>

          <!-- TYPE 1: PRICING TREATMENT CARD -->
          <div v-if="selectedActionForTreatment.flowType === 'commercial_pricing' && selectedActionForTreatment.pricingData" class="space-y-3">
            <h4 class="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign class="w-4 h-4 text-emerald-600" />
              <span>Commercial Waiver Breakdown</span>
            </h4>
            
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 dark:bg-slate-800 p-3.5 rounded-xl text-center text-xs">
              <div>
                <div class="text-[10px] text-gray-400 font-bold uppercase">Customer</div>
                <div class="font-bold text-gray-800 dark:text-white mt-0.5 truncate">{{ selectedActionForTreatment.pricingData.customerName }}</div>
              </div>
              <div>
                <div class="text-[10px] text-gray-400 font-bold uppercase">Requested Discount</div>
                <div class="font-bold text-red-600 dark:text-red-400 mt-0.5">{{ selectedActionForTreatment.pricingData.requestedDiscountPercent }}% (-{{ store.formatCurrency(selectedActionForTreatment.pricingData.requestedDiscountAmount) }})</div>
              </div>
              <div>
                <div class="text-[10px] text-gray-400 font-bold uppercase">Proposed Deal</div>
                <div class="font-bold text-[#165A31] dark:text-emerald-400 mt-0.5">{{ store.formatCurrency(selectedActionForTreatment.pricingData.proposedDealValue) }}</div>
              </div>
              <div>
                <div class="text-[10px] text-gray-400 font-bold uppercase">Margin Impact</div>
                <div class="font-bold text-amber-600 mt-0.5">{{ selectedActionForTreatment.pricingData.standardMarginPercent }}% &rarr; {{ selectedActionForTreatment.pricingData.projectedMarginPercent }}%</div>
              </div>
            </div>

            <div class="text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-slate-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
              <span class="font-bold text-gray-800 dark:text-gray-200">Justification: </span>
              {{ selectedActionForTreatment.pricingData.competitorContext }}
            </div>
          </div>

          <!-- TYPE 2: STOCK REALLOCATION TREATMENT CARD -->
          <div v-else-if="selectedActionForTreatment.flowType === 'stock_reallocation' && selectedActionForTreatment.stockData" class="space-y-3">
            <h4 class="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
              <Truck class="w-4 h-4 text-blue-600" />
              <span>Inter-Branch Route & Allocation Details</span>
            </h4>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gray-50 dark:bg-slate-800 p-3.5 rounded-xl text-xs">
              <div>
                <div class="text-[10px] text-gray-400 font-bold uppercase">Transit Route</div>
                <div class="font-bold text-gray-800 dark:text-white mt-0.5">{{ selectedActionForTreatment.stockData.originBranch }} &rarr; {{ selectedActionForTreatment.stockData.destinationBranch }}</div>
              </div>
              <div>
                <div class="text-[10px] text-gray-400 font-bold uppercase">Model & Qty</div>
                <div class="font-bold text-gray-800 dark:text-white mt-0.5">{{ selectedActionForTreatment.stockData.requestedQty }}x {{ selectedActionForTreatment.stockData.modelName }}</div>
              </div>
              <div>
                <div class="text-[10px] text-gray-400 font-bold uppercase">Required By</div>
                <div class="font-bold text-red-600 dark:text-red-400 mt-0.5">{{ selectedActionForTreatment.stockData.requiredByDate }}</div>
              </div>
              <div>
                <div class="text-[10px] text-gray-400 font-bold uppercase">Assigned VINs</div>
                <div class="font-mono text-[11px] text-gray-700 dark:text-gray-300 mt-0.5">{{ selectedActionForTreatment.stockData.chassisVins || 'Auto-assign on dispatch' }}</div>
              </div>
              <div>
                <div class="text-[10px] text-gray-400 font-bold uppercase">Carrier</div>
                <div class="font-bold text-gray-700 dark:text-gray-300 mt-0.5">{{ selectedActionForTreatment.stockData.logisticsCarrier }}</div>
              </div>
              <div>
                <div class="text-[10px] text-gray-400 font-bold uppercase">Est. Freight</div>
                <div class="font-bold text-[#165A31] dark:text-emerald-400 mt-0.5">{{ store.formatCurrency(selectedActionForTreatment.stockData.freightCostEstimate) }}</div>
              </div>
            </div>

            <div class="text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-slate-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
              <span class="font-bold text-gray-800 dark:text-gray-200">Urgency Rationale: </span>
              {{ selectedActionForTreatment.stockData.urgencyReason }}
            </div>
          </div>

          <!-- TYPE 3: OPERATIONAL EXPENSE TREATMENT CARD -->
          <div v-else-if="selectedActionForTreatment.flowType === 'operational_expense' && selectedActionForTreatment.expenseData" class="space-y-3">
            <h4 class="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle class="w-4 h-4 text-amber-600" />
              <span>Reimbursement & Payee Verification</span>
            </h4>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gray-50 dark:bg-slate-800 p-3.5 rounded-xl text-xs">
              <div>
                <div class="text-[10px] text-gray-400 font-bold uppercase">Payee Vendor</div>
                <div class="font-bold text-gray-800 dark:text-white mt-0.5 truncate">{{ selectedActionForTreatment.expenseData.payeeVendor }}</div>
              </div>
              <div>
                <div class="text-[10px] text-gray-400 font-bold uppercase">Category</div>
                <div class="font-bold text-gray-800 dark:text-white mt-0.5">{{ selectedActionForTreatment.expenseData.expenseCategory }}</div>
              </div>
              <div>
                <div class="text-[10px] text-gray-400 font-bold uppercase">Invoice Amount</div>
                <div class="font-bold text-[#165A31] dark:text-emerald-400 mt-0.5">{{ store.formatCurrency(selectedActionForTreatment.expenseData.amountPkr) }}</div>
              </div>
              <div>
                <div class="text-[10px] text-gray-400 font-bold uppercase">Disbursement Mode</div>
                <div class="font-bold text-gray-700 dark:text-gray-300 mt-0.5">{{ selectedActionForTreatment.expenseData.paymentMethod }}</div>
              </div>
              <div>
                <div class="text-[10px] text-gray-400 font-bold uppercase">Vendor NTN</div>
                <div class="font-mono text-gray-700 dark:text-gray-300 mt-0.5">{{ selectedActionForTreatment.expenseData.vendorNtn || 'Unregistered' }}</div>
              </div>
              <div>
                <div class="text-[10px] text-gray-400 font-bold uppercase">Bill Ref</div>
                <div class="font-mono text-gray-700 dark:text-gray-300 mt-0.5">{{ selectedActionForTreatment.expenseData.invoiceRef || 'Pending Receipt' }}</div>
              </div>
            </div>

            <div class="text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-slate-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
              <span class="font-bold text-gray-800 dark:text-gray-200">Emergency Cause: </span>
              {{ selectedActionForTreatment.expenseData.operationalEmergencyJustification }}
            </div>
          </div>

          <!-- TYPE 4: WARRANTY CLAIM TREATMENT CARD -->
          <div v-else-if="selectedActionForTreatment.flowType === 'warranty_escalation' && selectedActionForTreatment.warrantyData" class="space-y-3">
            <h4 class="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
              <Wrench class="w-4 h-4 text-red-600" />
              <span>Technical Diagnostics & Warranty Sign-Off</span>
            </h4>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 dark:bg-slate-800 p-3.5 rounded-xl text-xs">
              <div>
                <div class="text-[10px] text-gray-400 font-bold uppercase">Customer & VIN</div>
                <div class="font-bold text-gray-800 dark:text-white mt-0.5 truncate">{{ selectedActionForTreatment.warrantyData.customerName }}</div>
                <div class="font-mono text-[10px] text-gray-500">{{ selectedActionForTreatment.warrantyData.vehicleVin }}</div>
              </div>
              <div>
                <div class="text-[10px] text-gray-400 font-bold uppercase">Component & DTC</div>
                <div class="font-bold text-red-600 dark:text-red-400 mt-0.5 truncate">{{ selectedActionForTreatment.warrantyData.defectComponent }}</div>
                <div class="font-mono text-[10px] text-gray-500">{{ selectedActionForTreatment.warrantyData.diagnosticCode }}</div>
              </div>
              <div>
                <div class="text-[10px] text-gray-400 font-bold uppercase">Odometer</div>
                <div class="font-bold text-gray-800 dark:text-white mt-0.5">{{ selectedActionForTreatment.warrantyData.odometerKm }} km</div>
                <div class="text-[10px] text-green-600 font-bold">Within 3-Yr Warranty</div>
              </div>
              <div>
                <div class="text-[10px] text-gray-400 font-bold uppercase">Part SKU & Value</div>
                <div class="font-mono font-bold text-gray-800 dark:text-white mt-0.5 truncate">{{ selectedActionForTreatment.warrantyData.replacementSkuNeeded }}</div>
                <div class="text-[10px] text-[#165A31] font-bold">{{ store.formatCurrency(selectedActionForTreatment.warrantyData.estimatedPartCost) }}</div>
              </div>
            </div>

            <div class="text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-slate-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
              <span class="font-bold text-gray-800 dark:text-gray-200">Diagnostic Findings: </span>
              {{ selectedActionForTreatment.warrantyData.technicianFindings }}
            </div>
          </div>

          <!-- TYPE 5: INVENTORY GOVERNANCE TREATMENT CARD -->
          <div v-else-if="selectedActionForTreatment.flowType === 'inventory_governance' && selectedActionForTreatment.governanceData" class="space-y-3">
            <h4 class="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert class="w-4 h-4 text-purple-600" />
              <span>Governance Audit & Quarantine Sign-Off</span>
            </h4>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 dark:bg-slate-800 p-3.5 rounded-xl text-xs">
              <div>
                <div class="text-[10px] text-gray-400 font-bold uppercase">Affected VINs</div>
                <div class="font-mono font-bold text-gray-800 dark:text-white mt-0.5 truncate">{{ selectedActionForTreatment.governanceData.affectedVinOrSku }}</div>
              </div>
              <div>
                <div class="text-[10px] text-gray-400 font-bold uppercase">Root Cause</div>
                <div class="font-bold text-amber-600 mt-0.5 truncate">{{ selectedActionForTreatment.governanceData.rootCauseClassification }}</div>
              </div>
              <div>
                <div class="text-[10px] text-gray-400 font-bold uppercase">Variance Loss</div>
                <div class="font-bold text-red-600 dark:text-red-400 mt-0.5">{{ store.formatCurrency(selectedActionForTreatment.governanceData.estimatedVariancePkr) }}</div>
              </div>
              <div>
                <div class="text-[10px] text-gray-400 font-bold uppercase">Recommended Action</div>
                <div class="font-bold text-[#165A31] dark:text-emerald-400 mt-0.5 truncate">{{ selectedActionForTreatment.governanceData.recommendedAction }}</div>
              </div>
            </div>

            <div class="text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-slate-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
              <span class="font-bold text-gray-800 dark:text-gray-200">Incident Narrative: </span>
              {{ selectedActionForTreatment.governanceData.incidentDescription }}
            </div>
          </div>

          <!-- Decision Notes Field -->
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Treatment & Decision Rationale Notes
            </label>
            <textarea 
              v-model="decisionNotes" 
              rows="2" 
              placeholder="Enter official sign-off notes, conditions, or instructions..."
              class="w-full px-3 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-slate-800 dark:text-white"
            ></textarea>
          </div>

          <!-- Counter-Offer Prompt for Pricing -->
          <div v-if="showCounterInput" class="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800 flex items-center justify-between gap-3 text-xs">
            <div>
              <span class="font-bold text-blue-900 dark:text-blue-200">Maximum Authorized Discount Cap:</span>
              <p class="text-[11px] text-blue-700 dark:text-blue-300">Set counter-cap for branch manager quotation</p>
            </div>
            <div class="flex items-center gap-2">
              <input v-model.number="counterDiscountPercent" type="number" min="1" max="15" class="w-16 px-2 py-1 text-xs border rounded bg-white dark:bg-slate-900 font-bold" />
              <span class="font-bold">%</span>
              <button 
                @click="executeDecision('Countered', { authorizedDiscountCap: `${counterDiscountPercent}%` })"
                class="px-3 py-1 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition-colors"
              >
                Apply Cap
              </button>
            </div>
          </div>

          <!-- Existing Resolution Details if already treated -->
          <div v-if="selectedActionForTreatment.resolution" class="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs space-y-1">
            <div class="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
              <CheckCircle class="w-4 h-4 text-emerald-600" />
              <span>Treated by {{ selectedActionForTreatment.resolution.decidedBy }} at {{ selectedActionForTreatment.resolution.decidedAt }}</span>
            </div>
            <p class="text-gray-700 dark:text-gray-300 pl-5.5">{{ selectedActionForTreatment.resolution.decisionNotes || 'Approved per standard operating procedure.' }}</p>
          </div>
        </div>

        <!-- Drawer Footer with Standard Treatment Buttons -->
        <div class="px-6 py-4 bg-gray-50 dark:bg-slate-800/80 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div class="flex items-center gap-2">
            <!-- Link to underlying source record -->
            <button 
              @click="router.push(resolveActionRoute(selectedActionForTreatment))"
              class="text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <ExternalLink class="w-3.5 h-3.5" />
              <span>Open Source Document</span>
            </button>
          </div>

          <!-- Flow-Specific Treatment Buttons -->
          <div class="flex flex-wrap items-center gap-2">
            <!-- TYPE 1: PRICING ACTIONS -->
            <template v-if="selectedActionForTreatment.flowType === 'commercial_pricing'">
              <button 
                @click="showCounterInput = !showCounterInput"
                class="px-3.5 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
              >
                Counter-Offer / Cap
              </button>
              <button 
                @click="executeDecision('Rejected', { reason: 'Margin below company hurdle rate' })"
                class="px-3.5 py-1.5 text-xs font-semibold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
              >
                Reject Waiver
              </button>
              <button 
                @click="executeDecision('Approved', { discountApproved: `${selectedActionForTreatment.pricingData?.requestedDiscountPercent}%` })"
                class="px-4 py-1.5 text-xs font-semibold text-white bg-[#165A31] hover:bg-[#124a28] rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Approve Full Discount
              </button>
            </template>

            <!-- TYPE 2: STOCK REALLOCATION ACTIONS -->
            <template v-else-if="selectedActionForTreatment.flowType === 'stock_reallocation'">
              <button 
                @click="executeDecision('Declined', { reason: 'Origin showroom required minimum buffer' })"
                class="px-3.5 py-1.5 text-xs font-semibold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
              >
                Decline Transfer
              </button>
              <button 
                @click="executeDecision('Approved', { authorizedUnits: 1, note: 'Partial 1 unit authorized' })"
                class="px-3.5 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
              >
                Partial Allocation (1 Unit)
              </button>
              <button 
                @click="executeDecision('Dispatched', { transferPermit: 'TR-PERMIT-8841', carrier: 'TCS Dedicated Van' })"
                class="px-4 py-1.5 text-xs font-semibold text-white bg-[#165A31] hover:bg-[#124a28] rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Authorize & Dispatch Units
              </button>
            </template>

            <!-- TYPE 3: OPERATIONAL EXPENSE ACTIONS -->
            <template v-else-if="selectedActionForTreatment.flowType === 'operational_expense'">
              <button 
                @click="executeDecision('On Audit Hold', { requirement: 'Physical tax invoice required' })"
                class="px-3.5 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
              >
                Demand Tax Invoice
              </button>
              <button 
                @click="executeDecision('Rejected', { reason: 'Exceeds branch budget envelope' })"
                class="px-3.5 py-1.5 text-xs font-semibold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
              >
                Reject Claim
              </button>
              <button 
                @click="executeDecision('Approved', { voucherStatus: 'VOUCHER_ISSUED', disbursedFrom: 'Imprest Fund' })"
                class="px-4 py-1.5 text-xs font-semibold text-white bg-[#165A31] hover:bg-[#124a28] rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Approve & Disburse Voucher
              </button>
            </template>

            <!-- TYPE 4: WARRANTY CLAIM ACTIONS -->
            <template v-else-if="selectedActionForTreatment.flowType === 'warranty_escalation'">
              <button 
                @click="executeDecision('Rejected', { reason: 'Battery casing shows unauthorized tampering' })"
                class="px-3.5 py-1.5 text-xs font-semibold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
              >
                Reject Warranty Claim
              </button>
              <button 
                @click="executeDecision('Approved', { coPayPercentage: '20%', customerContributionPkr: 37000 })"
                class="px-3.5 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
              >
                Approve with 20% Co-Pay
              </button>
              <button 
                @click="executeDecision('Approved', { partReleasePermit: 'WAR-REL-9912', coverage: '100% OEM Warranty' })"
                class="px-4 py-1.5 text-xs font-semibold text-white bg-[#165A31] hover:bg-[#124a28] rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Authorize 100% Part Dispatch
              </button>
            </template>

            <!-- TYPE 5: INVENTORY GOVERNANCE ACTIONS -->
            <template v-else-if="selectedActionForTreatment.flowType === 'inventory_governance'">
              <button 
                @click="executeDecision('Re-Audit Ordered', { auditOfficer: 'Independent Senior Auditor' })"
                class="px-3.5 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
              >
                Order Independent Recount
              </button>
              <button 
                @click="executeDecision('Insurance Claim Filed', { carrierClaimRef: 'CLM-TCS-2026-081' })"
                class="px-3.5 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
              >
                File Logistics Insurance Claim
              </button>
              <button 
                @click="executeDecision('Resolved', { writeDownStatus: 'EXECUTED_P_AND_L', quarantineRelease: true })"
                class="px-4 py-1.5 text-xs font-semibold text-white bg-[#165A31] hover:bg-[#124a28] rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Approve Write-Down & Release
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
