<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  ArrowLeft, CheckCircle2, AlertTriangle, AlertCircle, 
  Package, ShieldCheck, FileText, Check, Plus, Trash2, RefreshCw
} from 'lucide-vue-next'
import { store } from '../../store.js'

const router = useRouter()
const route = useRoute()

// 1. PO Binding from Route
const poId = computed(() => route.params.id || route.query.po || route.query.id || 'PO-2048')
const po = computed(() => store.getPurchaseOrderById(poId.value))

// Branch & Authorization
const isBranchUser = computed(() => store.isBranchUser())
const activeBranch = computed(() => store.getActiveBranch())
const isAuthorized = computed(() => {
  if (!po.value) return false
  return store.isBranchAllowed(po.value.destination || po.value.branch)
})

// UI State
const showConfirmModal = ref(false)
const showDiscrepancyModal = ref(false)
const validationErrors = ref([])
const showSuccessToast = ref(false)
const toastMessage = ref('')
const activeStep = ref('receive') // 'receive' | 'review'

// Header and Receiving Meta Form
const receivingForm = ref({
  location: 'Peshawar - Main Showroom & Warehouse',
  receiver: store.currentUser?.name || 'Ahsan Khan',
  receiptDate: new Date().toISOString().split('T')[0],
  deliveryNote: '',
  notes: 'Supplier consignment verified upon delivery at receiving bay.'
})

// Receiving Line Items State (Reactive mapping from PO items)
const lineItems = ref([])
const serializedRows = ref([])

// Initialize receiving lines from PO data
const initFromPo = () => {
  if (!po.value) return

  receivingForm.value.location = `${po.value.destination || po.value.branch || 'Peshawar'} - Warehouse Bay 1`
  receivingForm.value.deliveryNote = po.value.tracking || `DN-${po.value.po}-01`
  receivingForm.value.receiver = store.currentUser?.name || 'Store Officer'

  const items = po.value.items && po.value.items.length > 0 ? po.value.items : [
    { product_id: 'PROD-003', product: 'BRG DS11', sku: 'SKU-DS11-BLU', ordered: 8, previouslyReceived: 0, cost: 'PKR 146K', isSerialized: true },
    { product_id: 'PROD-004', product: 'BRG EV-5', sku: 'SKU-EV5-01', ordered: 5, previouslyReceived: 0, cost: 'PKR 168K', isSerialized: true },
    { product_id: 'PROD-006', product: 'Cargo Pro', sku: 'SKU-CPRO-YEL', ordered: 3, previouslyReceived: 0, cost: 'PKR 214K', isSerialized: true }
  ]

  lineItems.value = items.map(item => {
    const ordered = parseInt(item.ordered || item.qty || 0)
    const prev = parseInt(item.previouslyReceived || item.received || 0)
    const outstanding = Math.max(0, ordered - prev)
    const isSerialized = item.isSerialized !== false && !String(item.product || '').toLowerCase().includes('battery') && !String(item.product || '').toLowerCase().includes('part')

    return {
      product_id: item.product_id || item.id,
      product: item.product || item.name,
      sku: item.sku || 'SKU-GEN',
      ordered_quantity: ordered,
      previously_received_quantity: prev,
      outstanding_quantity: outstanding,
      current_received_quantity: outstanding, // default to remaining
      damaged_quantity: 0,
      discrepancy_reason: '',
      isSerialized,
      unitCost: item.cost || item.unitCost || 'PKR 0'
    }
  })

  syncSerializedRows()
}

// Keep serialized rows in sync with current received quantity of serialized items
const syncSerializedRows = () => {
  const newRows = []
  
  lineItems.value.forEach(item => {
    if (!item.isSerialized) return
    const recCount = parseInt(item.current_received_quantity) || 0
    if (recCount <= 0) return

    // Find existing rows for this product
    const existing = serializedRows.value.filter(r => r.product_id === item.product_id || r.product === item.product)
    
    for (let i = 0; i < recCount; i++) {
      if (existing[i]) {
        newRows.push(existing[i])
      } else {
        const randomNum = Math.floor(1000 + Math.random() * 9000)
        const prefix = (item.product || 'EV').replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase()
        newRows.push({
          id: `TEMP-${Date.now()}-${i}-${randomNum}`,
          product_id: item.product_id,
          product: item.product,
          sku: item.sku,
          serial: `${prefix}-${randomNum}`,
          chassis: `CH-${prefix}-${randomNum}`,
          vin: `VIN-PK-BRG-26-${randomNum}`,
          motorNumber: `MTR-72V-${Math.floor(1000 + Math.random() * 9000)}`,
          batteryNumber: `BAT-7230-${Math.floor(1000 + Math.random() * 9000)}`,
          condition: 'Good',
          qc: 'Pass',
          location: 'Showroom Floor'
        })
      }
    }
  })

  serializedRows.value = newRows
}

watch(po, () => {
  initFromPo()
}, { immediate: true })

// Helper to calculate line accepted, short, and excess
const getLineStats = (line) => {
  const ordered = parseInt(line.ordered_quantity) || 0
  const prev = parseInt(line.previously_received_quantity) || 0
  const outstanding = Math.max(0, ordered - prev)
  const current = parseInt(line.current_received_quantity) || 0
  const damaged = parseInt(line.damaged_quantity) || 0
  const accepted = Math.max(0, current - damaged)
  const short = Math.max(0, outstanding - current)
  const excess = Math.max(0, current - outstanding)
  return { ordered, prev, outstanding, current, damaged, accepted, short, excess }
}

// Summary Metrics
const summaryStats = computed(() => {
  let totalOrdered = 0
  let totalPrev = 0
  let totalOutstanding = 0
  let totalCurrent = 0
  let totalDamaged = 0
  let totalAccepted = 0
  let totalShort = 0
  let totalExcess = 0

  lineItems.value.forEach(l => {
    const stats = getLineStats(l)
    totalOrdered += stats.ordered
    totalPrev += stats.prev
    totalOutstanding += stats.outstanding
    totalCurrent += stats.current
    totalDamaged += stats.damaged
    totalAccepted += stats.accepted
    totalShort += stats.short
    totalExcess += stats.excess
  })

  return {
    totalOrdered,
    totalPrev,
    totalOutstanding,
    totalCurrent,
    totalDamaged,
    totalAccepted,
    totalShort,
    totalExcess,
    hasDiscrepancy: totalShort > 0 || totalExcess > 0 || totalDamaged > 0
  }
})

// Duplicate Serial Checks
const duplicateCheckErrors = computed(() => {
  const errors = []
  const seenLocalChassis = new Set()
  const seenLocalMotor = new Set()

  serializedRows.value.forEach((unit, idx) => {
    const chassis = (unit.chassis || '').trim()
    const motor = (unit.motorNumber || '').trim()

    if (!chassis) {
      errors.push(`Row ${idx + 1} (${unit.product}): Chassis / VIN cannot be empty.`)
      return
    }

    // Check duplicate within current receipt
    const chassisLower = chassis.toLowerCase()
    if (seenLocalChassis.has(chassisLower)) {
      errors.push(`Duplicate Chassis number in form: "${chassis}". Each unit must be unique.`)
    }
    seenLocalChassis.add(chassisLower)

    if (motor && motor !== '—') {
      const motorLower = motor.toLowerCase()
      if (seenLocalMotor.has(motorLower)) {
        errors.push(`Duplicate Motor number in form: "${motor}".`)
      }
      seenLocalMotor.add(motorLower)
    }

    // Check against existing units in store
    const existingUnit = store.getUnitById(chassis)
    if (existingUnit) {
      errors.push(`Chassis "${chassis}" already exists in ${existingUnit.branch || 'system'} inventory.`)
    }
  })

  return errors
})

// Validation before Review / Post
const validateReceipt = () => {
  const errors = []

  if (!po.value) {
    errors.push('Purchase order not found.')
    return errors
  }

  if (!isAuthorized.value) {
    errors.push(`Unauthorized branch: Current user cannot receive PO for ${po.value.destination || po.value.branch}.`)
  }

  if ((po.value.status === 'Fully Received' || po.value.status === 'Received') && po.value.remainingUnits <= 0) {
    errors.push(`Purchase order ${po.value.po} is already fully received.`)
  }

  if (summaryStats.value.totalCurrent <= 0) {
    errors.push('Total received quantity must be greater than 0.')
  }

  lineItems.value.forEach(l => {
    const stats = getLineStats(l)
    if (stats.current < 0) {
      errors.push(`${l.product}: Received quantity cannot be negative.`)
    }
    if (stats.damaged < 0) {
      errors.push(`${l.product}: Damaged quantity cannot be negative.`)
    }
    if (stats.damaged > stats.current) {
      errors.push(`${l.product}: Damaged quantity (${stats.damaged}) cannot exceed received quantity (${stats.current}).`)
    }
    if ((stats.short > 0 || stats.excess > 0) && !l.discrepancy_reason.trim()) {
      errors.push(`${l.product}: Discrepancy reason is required for ${stats.short > 0 ? 'shortage' : 'excess'}.`)
    }
  })

  // Add duplicate/missing serial errors
  duplicateCheckErrors.value.forEach(err => errors.push(err))

  return errors
}

// Handlers
const handleProceedToReview = () => {
  validationErrors.value = validateReceipt()
  if (validationErrors.value.length > 0) {
    return
  }
  activeStep.value = 'review'
}

const handleOpenPostModal = () => {
  validationErrors.value = validateReceipt()
  if (validationErrors.value.length > 0) {
    return
  }
  showConfirmModal.value = true
}

const handleSaveDraft = () => {
  if (!po.value) return
  const draftData = {
    po_id: po.value.po_id || po.value.po,
    po: po.value.po,
    supplier_id: po.value.supplier_id,
    supplier: po.value.supplier,
    branch_id: po.value.branch_id || 'BR-01',
    branch: po.value.destination || po.value.branch || 'Peshawar',
    receipt_date: receivingForm.value.receiptDate,
    received_by: receivingForm.value.receiver,
    notes: receivingForm.value.notes,
    deliveryNote: receivingForm.value.deliveryNote,
    location: receivingForm.value.location,
    lines: lineItems.value.map(l => {
      const stats = getLineStats(l)
      return {
        product_id: l.product_id,
        product: l.product,
        sku: l.sku,
        ordered_quantity: stats.ordered,
        previously_received_quantity: stats.prev,
        current_received_quantity: stats.current,
        damaged_quantity: stats.damaged,
        accepted_quantity: stats.accepted,
        short_quantity: stats.short,
        excess_quantity: stats.excess,
        discrepancy_reason: l.discrepancy_reason,
        status: stats.short > 0 ? 'Short' : (stats.excess > 0 ? 'Excess' : 'Complete')
      }
    }),
    serializedUnits: [...serializedRows.value]
  }

  const res = store.saveReceiptDraft(draftData)
  toastMessage.value = `Draft saved successfully (GRN: ${res.receipt.id}). Inventory has not been modified.`
  showSuccessToast.value = true
  setTimeout(() => {
    showSuccessToast.value = false
  }, 4000)
}

const handlePostReceipt = () => {
  validationErrors.value = validateReceipt()
  if (validationErrors.value.length > 0) {
    showConfirmModal.value = false
    return
  }

  try {
    const receiptPayload = {
      po_id: po.value.po_id || po.value.po,
      po: po.value.po,
      receipt_date: receivingForm.value.receiptDate,
      received_by: receivingForm.value.receiver,
      notes: receivingForm.value.notes,
      location: receivingForm.value.location,
      deliveryNote: receivingForm.value.deliveryNote,
      lines: lineItems.value.map(l => {
        const stats = getLineStats(l)
        return {
          product_id: l.product_id,
          product: l.product,
          sku: l.sku,
          ordered_quantity: stats.ordered,
          previously_received_quantity: stats.prev,
          current_received_quantity: stats.current,
          damaged_quantity: stats.damaged,
          accepted_quantity: stats.accepted,
          short_quantity: stats.short,
          excess_quantity: stats.excess,
          discrepancy_reason: l.discrepancy_reason
        }
      }),
      serializedUnits: serializedRows.value.map(u => ({
        ...u,
        location: receivingForm.value.location
      })),
      qcRecords: serializedRows.value.map(u => ({
        serial: u.chassis || u.serial,
        check: 'Visual + Functional EV Diagnostic',
        finding: u.condition === 'Good' ? 'Pass (100%)' : u.condition,
        decision: u.qc,
        inspector: receivingForm.value.receiver
      }))
    }

    const result = store.postReceipt({ receiptData: receiptPayload, updateInventory: true })
    showConfirmModal.value = false

    // Route to receipt detail
    router.push(`/procurement/receipts/${result.receipt.id}`)
  } catch (err) {
    showConfirmModal.value = false
    validationErrors.value = [err.message || 'Failed to post receipt.']
  }
}

const cancel = () => {
  if (po.value) {
    router.push(`/procurement/purchase-orders/${po.value.po}`)
  } else {
    router.push('/procurement/purchase-orders')
  }
}

// Regenerate test serial numbers helper
const regenerateSerials = () => {
  serializedRows.value = []
  syncSerializedRows()
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-16">
    <!-- Breadcrumb & Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1 flex items-center gap-1">
          <router-link to="/procurement/purchase-orders" class="hover:underline">Procurement</router-link>
          <span>/</span>
          <router-link :to="`/procurement/purchase-orders/${poId}`" class="hover:underline">{{ poId }}</router-link>
          <span>/</span>
          <span class="font-bold text-gray-800">Receive Purchase (GRN)</span>
        </div>
        <h1 class="text-[30px] tracking-tight font-bold text-gray-900 flex items-center gap-3">
          <span>Goods Receipt & Inwarding</span>
          <span v-if="po" class="text-sm font-semibold px-2.5 py-1 bg-gray-100 rounded-lg text-gray-700">
            {{ po.po }}
          </span>
        </h1>
        <p class="text-xs text-gray-500 mt-1">
          Inward supplier shipment against Purchase Order into branch inventory with discrepancy and serialized QC tracking.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button 
          @click="cancel" 
          class="px-4 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-1.5"
        >
          <ArrowLeft class="w-3.5 h-3.5" /> Back to PO
        </button>
      </div>
    </div>

    <!-- PO Not Found Alert -->
    <div v-if="!po" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center space-y-3">
      <AlertCircle class="w-10 h-10 text-red-500 mx-auto" />
      <h3 class="text-lg font-bold text-gray-900">Purchase Order Not Found</h3>
      <p class="text-xs text-gray-600">The requested purchase order <span class="font-mono font-bold">{{ poId }}</span> does not exist in the procurement registry.</p>
      <router-link to="/procurement/purchase-orders" class="inline-block px-4 py-2 bg-[#165A31] text-white text-xs font-bold rounded-lg hover:bg-[#124a28]">
        View All Purchase Orders
      </router-link>
    </div>

    <!-- Unauthorized Branch Alert -->
    <div v-else-if="!isAuthorized" class="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center space-y-3">
      <AlertTriangle class="w-10 h-10 text-amber-600 mx-auto" />
      <h3 class="text-lg font-bold text-gray-900">Unauthorized Branch Access</h3>
      <p class="text-xs text-gray-600">
        You are logged in under <span class="font-bold">{{ activeBranch }}</span> branch, but this PO is destined for <span class="font-bold">{{ po.destination || po.branch }}</span>.
      </p>
      <router-link to="/procurement/purchase-orders" class="inline-block px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg">
        Return to Purchase Orders
      </router-link>
    </div>

    <!-- Main Receiving Workspace -->
    <div v-else class="space-y-6">

      <!-- PO Summary Banner Card -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-lg font-bold text-gray-900">{{ po.po }} &middot; {{ po.supplier }}</span>
            <span 
              class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold"
              :class="po.status === 'Fully Received' || po.status === 'Received' ? 'bg-[#eefcf2] text-[#165A31]' : (po.status === 'Partially Received' ? 'bg-orange-50 text-orange-700' : 'bg-blue-50 text-blue-700')"
            >
              {{ po.status }}
            </span>
          </div>
          <p class="text-xs text-gray-500">
            Destination: <span class="font-bold text-gray-800">{{ po.destination || po.branch }}</span> &bull; 
            Ordered: <span class="font-bold text-gray-800">{{ po.totalOrdered || po.units }} units</span> &bull; 
            Previously Received: <span class="font-bold text-gray-800">{{ po.totalReceived || 0 }} units</span> &bull; 
            Remaining: <span class="font-bold text-[#165A31]">{{ po.remainingUnits }} units</span>
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button 
            @click="handleSaveDraft"
            class="px-4 py-2 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
          >
            Save Draft
          </button>
          
          <button 
            v-if="activeStep === 'receive'"
            @click="handleProceedToReview"
            class="px-5 py-2 text-[11px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
          >
            Review GRN &rarr;
          </button>
          
          <button 
            v-else
            @click="activeStep = 'receive'"
            class="px-4 py-2 text-[11px] font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Edit Quantities
          </button>
        </div>
      </div>

      <!-- Validation Errors Display -->
      <div v-if="validationErrors.length > 0" class="bg-red-50 border border-red-200 rounded-xl p-4 space-y-1.5">
        <div class="flex items-center gap-2 text-red-700 font-bold text-xs">
          <AlertCircle class="w-4 h-4 shrink-0" />
          <span>Please correct the following errors before proceeding:</span>
        </div>
        <ul class="list-disc list-inside text-xs text-red-600 space-y-0.5 pl-2">
          <li v-for="(err, idx) in validationErrors" :key="idx">{{ err }}</li>
        </ul>
      </div>

      <!-- Toast Notification -->
      <div v-if="showSuccessToast" class="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm animate-in fade-in">
        <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
        <span>{{ toastMessage }}</span>
      </div>

      <!-- STEP 1: RECEIVE ENTRY VIEW -->
      <div v-if="activeStep === 'receive'" class="space-y-6">
        
        <!-- Grid: Inwarding Meta & Header Info -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-3">
            <h3 class="text-xs font-bold text-gray-900 uppercase tracking-wider text-gray-500">1. Inwarding Location</h3>
            <div>
              <label class="block text-[11px] font-medium text-gray-600 mb-1">Receiving Branch & Bay</label>
              <input 
                v-model="receivingForm.location"
                type="text" 
                class="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors"
              />
            </div>
          </div>

          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-3">
            <h3 class="text-xs font-bold text-gray-900 uppercase tracking-wider text-gray-500">2. Receiving Personnel</h3>
            <div>
              <label class="block text-[11px] font-medium text-gray-600 mb-1">Receiver Name</label>
              <input 
                v-model="receivingForm.receiver"
                type="text" 
                class="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors"
              />
            </div>
          </div>

          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-3">
            <h3 class="text-xs font-bold text-gray-900 uppercase tracking-wider text-gray-500">3. Delivery Logistics</h3>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-[11px] font-medium text-gray-600 mb-1">Receipt Date</label>
                <input 
                  v-model="receivingForm.receiptDate"
                  type="date" 
                  class="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors"
                />
              </div>
              <div>
                <label class="block text-[11px] font-medium text-gray-600 mb-1">Delivery Note / Tracking</label>
                <input 
                  v-model="receivingForm.deliveryNote"
                  type="text" 
                  placeholder="DN-2048-01"
                  class="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Section: Line Items Expected vs Actual (Dynamic from PO) -->
        <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
          <div class="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 class="text-[15px] font-bold text-gray-900">Line Items &bull; Expected vs Actual</h3>
              <p class="text-xs text-gray-500">Ordered and previously received quantities are automatically loaded from {{ po.po }}.</p>
            </div>
            
            <!-- Quick Discrepancy Status Badges -->
            <div class="flex items-center gap-2">
              <span v-if="!summaryStats.hasDiscrepancy" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-[#eefcf2] text-[#165A31]">
                <Check class="w-3.5 h-3.5" /> Quantities Match Expected
              </span>
              <span v-else class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700">
                <AlertTriangle class="w-3.5 h-3.5" /> Discrepancies Detected
              </span>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th class="px-5 py-3">Product / SKU</th>
                  <th class="px-4 py-3 text-center">Ordered</th>
                  <th class="px-4 py-3 text-center">Prev. Received</th>
                  <th class="px-4 py-3 text-center">Outstanding</th>
                  <th class="px-4 py-3 text-center w-28">Current Received</th>
                  <th class="px-4 py-3 text-center w-24">Damaged</th>
                  <th class="px-4 py-3 text-center">Accepted</th>
                  <th class="px-4 py-3 text-center">Short</th>
                  <th class="px-4 py-3 text-center">Excess</th>
                  <th class="px-5 py-3">Discrepancy Reason</th>
                </tr>
              </thead>
              <tbody class="text-xs divide-y divide-gray-50">
                <tr v-for="(line, idx) in lineItems" :key="idx" class="hover:bg-gray-50/50 transition-colors">
                  <td class="px-5 py-3.5 font-medium text-gray-900">
                    <div class="font-bold text-gray-900">{{ line.product }}</div>
                    <div class="text-[10px] text-gray-400 font-mono">{{ line.sku }} &bull; {{ line.unitCost }}</div>
                  </td>
                  <td class="px-4 py-3.5 text-center font-semibold text-gray-700">{{ line.ordered_quantity }}</td>
                  <td class="px-4 py-3.5 text-center text-gray-500 font-medium">{{ line.previously_received_quantity }}</td>
                  <td class="px-4 py-3.5 text-center font-bold text-[#165A31]">{{ line.outstanding_quantity }}</td>
                  <td class="px-4 py-3.5 text-center">
                    <input 
                      v-model.number="line.current_received_quantity" 
                      @input="syncSerializedRows"
                      type="number" 
                      min="0"
                      class="w-20 px-2.5 py-1 text-center font-bold text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31]"
                    />
                  </td>
                  <td class="px-4 py-3.5 text-center">
                    <input 
                      v-model.number="line.damaged_quantity" 
                      type="number" 
                      min="0"
                      :max="line.current_received_quantity"
                      class="w-16 px-2 py-1 text-center text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
                      :class="line.damaged_quantity > 0 ? 'border-red-300 bg-red-50 text-red-700 font-bold' : 'border-gray-200'"
                    />
                  </td>
                  <td class="px-4 py-3.5 text-center font-bold text-gray-900">
                    {{ getLineStats(line).accepted }}
                  </td>
                  <td class="px-4 py-3.5 text-center">
                    <span v-if="getLineStats(line).short > 0" class="inline-flex px-2 py-0.5 text-[11px] font-bold rounded bg-amber-50 text-amber-700">
                      -{{ getLineStats(line).short }}
                    </span>
                    <span v-else class="text-gray-400">0</span>
                  </td>
                  <td class="px-4 py-3.5 text-center">
                    <span v-if="getLineStats(line).excess > 0" class="inline-flex px-2 py-0.5 text-[11px] font-bold rounded bg-blue-50 text-blue-700">
                      +{{ getLineStats(line).excess }}
                    </span>
                    <span v-else class="text-gray-400">0</span>
                  </td>
                  <td class="px-5 py-3.5">
                    <input 
                      v-if="getLineStats(line).short > 0 || getLineStats(line).excess > 0 || getLineStats(line).damaged > 0"
                      v-model="line.discrepancy_reason"
                      type="text" 
                      placeholder="e.g. Damaged in transit, Supplier short shipment"
                      class="w-full px-2.5 py-1 text-xs border border-amber-300 bg-amber-50/30 rounded-lg focus:outline-none focus:border-amber-600 text-gray-800 placeholder:text-gray-400"
                    />
                    <span v-else class="text-[11px] text-gray-400 italic">No discrepancy</span>
                  </td>
                </tr>
              </tbody>
              <!-- Table Footer with Authoritative Dynamic Calculations -->
              <tfoot>
                <tr class="bg-gray-50/80 font-bold text-xs text-gray-900 border-t border-gray-200">
                  <td class="px-5 py-3">Total Consignment</td>
                  <td class="px-4 py-3 text-center">{{ summaryStats.totalOrdered }}</td>
                  <td class="px-4 py-3 text-center text-gray-600">{{ summaryStats.totalPrev }}</td>
                  <td class="px-4 py-3 text-center text-[#165A31]">{{ summaryStats.totalOutstanding }}</td>
                  <td class="px-4 py-3 text-center text-blue-700">{{ summaryStats.totalCurrent }}</td>
                  <td class="px-4 py-3 text-center text-red-600">{{ summaryStats.totalDamaged }}</td>
                  <td class="px-4 py-3 text-center text-emerald-700">{{ summaryStats.totalAccepted }}</td>
                  <td class="px-4 py-3 text-center text-amber-700">{{ summaryStats.totalShort }}</td>
                  <td class="px-4 py-3 text-center text-blue-700">{{ summaryStats.totalExcess }}</td>
                  <td class="px-5 py-3 text-xs font-normal text-gray-500">
                    Accepted: <strong class="text-gray-900">{{ summaryStats.totalAccepted }}</strong> &bull; 
                    Hold: <strong class="text-gray-900">{{ summaryStats.totalDamaged }}</strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <!-- Section: Serialized Unit Capture (For EVs & Serialized Products) -->
        <div v-if="serializedRows.length > 0" class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
          <div class="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 class="text-[15px] font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck class="w-4 h-4 text-[#165A31]" />
                <span>Serialized Unit & QC Capture ({{ serializedRows.length }} Units)</span>
              </h3>
              <p class="text-xs text-gray-500">
                Individual VIN/Chassis, Motor Serial and Battery IDs for electric vehicles entering branch stock.
              </p>
            </div>

            <div class="flex items-center gap-2">
              <button 
                @click="regenerateSerials" 
                class="px-3 py-1.5 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <RefreshCw class="w-3.5 h-3.5" /> Re-scan / Generate IDs
              </button>
            </div>
          </div>

          <!-- Duplicate warnings inside serial capture -->
          <div v-if="duplicateCheckErrors.length > 0" class="p-4 bg-red-50 border-b border-red-100 text-xs text-red-700 font-medium">
            <div class="font-bold flex items-center gap-1.5 mb-1">
              <AlertCircle class="w-4 h-4" /> Duplicate Identifier Warning:
            </div>
            <div v-for="(err, i) in duplicateCheckErrors" :key="i">&bull; {{ err }}</div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th class="px-5 py-3">#</th>
                  <th class="px-5 py-3">Product</th>
                  <th class="px-4 py-3">Chassis / VIN</th>
                  <th class="px-4 py-3">Motor Serial</th>
                  <th class="px-4 py-3">Battery Serial</th>
                  <th class="px-4 py-3">Condition</th>
                  <th class="px-4 py-3">QC Decision</th>
                </tr>
              </thead>
              <tbody class="text-xs divide-y divide-gray-50">
                <tr v-for="(unit, index) in serializedRows" :key="unit.id" class="hover:bg-gray-50/50">
                  <td class="px-5 py-3 font-mono text-gray-400 text-[11px]">{{ index + 1 }}</td>
                  <td class="px-5 py-3 font-semibold text-gray-900">{{ unit.product }}</td>
                  <td class="px-4 py-3">
                    <input 
                      v-model="unit.chassis" 
                      type="text" 
                      class="w-full px-2.5 py-1 text-xs border border-gray-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-[#165A31]"
                      placeholder="CH-XXXX-XXXX"
                    />
                  </td>
                  <td class="px-4 py-3">
                    <input 
                      v-model="unit.motorNumber" 
                      type="text" 
                      class="w-full px-2.5 py-1 text-xs border border-gray-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-[#165A31]"
                      placeholder="MTR-72V-XXXX"
                    />
                  </td>
                  <td class="px-4 py-3">
                    <input 
                      v-model="unit.batteryNumber" 
                      type="text" 
                      class="w-full px-2.5 py-1 text-xs border border-gray-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-[#165A31]"
                      placeholder="BAT-7230-XXXX"
                    />
                  </td>
                  <td class="px-4 py-3">
                    <select 
                      v-model="unit.condition"
                      class="px-2.5 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31]"
                    >
                      <option value="Good">Good (New)</option>
                      <option value="Minor Scratch">Minor Scratch</option>
                      <option value="Cosmetic Defect">Cosmetic Defect</option>
                      <option value="Damaged">Damaged</option>
                    </select>
                  </td>
                  <td class="px-4 py-3">
                    <select 
                      v-model="unit.qc"
                      class="px-2.5 py-1 text-xs font-bold rounded-lg border focus:outline-none"
                      :class="unit.qc === 'Pass' ? 'bg-[#eefcf2] text-[#165A31] border-emerald-200' : (unit.qc === 'QC Hold' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200')"
                    >
                      <option value="Pass">Pass (Available)</option>
                      <option value="QC Hold">QC Hold</option>
                      <option value="Reject">Reject</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Notes Card -->
        <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-2">
          <label class="block text-xs font-bold text-gray-900">Receipt Inspection Notes</label>
          <textarea 
            v-model="receivingForm.notes" 
            rows="2" 
            class="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] text-gray-800 placeholder:text-gray-400"
            placeholder="Add any specific observations or freight remarks..."
          ></textarea>
        </div>

        <!-- Actions Footer -->
        <div class="flex items-center justify-between pt-2">
          <button 
            @click="cancel" 
            class="px-5 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
          >
            Cancel
          </button>
          
          <div class="flex items-center gap-3">
            <button 
              @click="handleSaveDraft" 
              class="px-5 py-2 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
            >
              Save Draft
            </button>
            <button 
              @click="handleProceedToReview" 
              class="px-6 py-2.5 text-[11px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer flex items-center gap-2"
            >
              <span>Review GRN</span> &rarr;
            </button>
          </div>
        </div>

      </div>

      <!-- STEP 2: REVIEW STAGE & FINAL CONFIRMATION -->
      <div v-else class="space-y-6">
        
        <!-- Review Overview Card -->
        <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
            <div>
              <h2 class="text-xl font-bold text-gray-900">Review Goods Receipt Summary</h2>
              <p class="text-xs text-gray-500">Verify all line quantities, discrepancy reasons, and serialized units before posting.</p>
            </div>
            <button 
              @click="activeStep = 'receive'" 
              class="px-3.5 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              &larr; Make Changes
            </button>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span class="text-gray-400 block text-[10px] uppercase font-bold">PO Reference</span>
              <span class="font-bold text-gray-900">{{ po.po }}</span>
            </div>
            <div>
              <span class="text-gray-400 block text-[10px] uppercase font-bold">Supplier</span>
              <span class="font-bold text-gray-900">{{ po.supplier }}</span>
            </div>
            <div>
              <span class="text-gray-400 block text-[10px] uppercase font-bold">Receiving Branch</span>
              <span class="font-bold text-gray-900">{{ po.destination || po.branch }}</span>
            </div>
            <div>
              <span class="text-gray-400 block text-[10px] uppercase font-bold">Receiver</span>
              <span class="font-bold text-gray-900">{{ receivingForm.receiver }}</span>
            </div>
          </div>
        </div>

        <!-- Discrepancy & Quantities Breakdown Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div class="bg-white p-4 rounded-[12px] border border-gray-100 shadow-sm">
            <div class="text-[10px] font-bold text-gray-400 uppercase">Total Received</div>
            <div class="text-2xl font-bold text-blue-700 mt-1">{{ summaryStats.totalCurrent }}</div>
            <div class="text-[11px] text-gray-500 mt-0.5">Physical units received</div>
          </div>
          <div class="bg-white p-4 rounded-[12px] border border-gray-100 shadow-sm">
            <div class="text-[10px] font-bold text-gray-400 uppercase">Accepted & Available</div>
            <div class="text-2xl font-bold text-[#165A31] mt-1">{{ summaryStats.totalAccepted }}</div>
            <div class="text-[11px] text-gray-500 mt-0.5">Entering active stock</div>
          </div>
          <div class="bg-white p-4 rounded-[12px] border border-gray-100 shadow-sm">
            <div class="text-[10px] font-bold text-gray-400 uppercase">Damaged / QC Hold</div>
            <div class="text-2xl font-bold text-red-600 mt-1">{{ summaryStats.totalDamaged }}</div>
            <div class="text-[11px] text-gray-500 mt-0.5">Isolated from stock</div>
          </div>
          <div class="bg-white p-4 rounded-[12px] border border-gray-100 shadow-sm">
            <div class="text-[10px] font-bold text-gray-400 uppercase">Remaining PO Balance</div>
            <div class="text-2xl font-bold text-gray-900 mt-1">
              {{ Math.max(0, summaryStats.totalOutstanding - summaryStats.totalCurrent) }}
            </div>
            <div class="text-[11px] text-gray-500 mt-0.5">
              {{ (summaryStats.totalOutstanding - summaryStats.totalCurrent) <= 0 ? 'PO will be closed' : 'PO partially received' }}
            </div>
          </div>
        </div>

        <!-- Review Lines Table -->
        <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
          <div class="p-5 border-b border-gray-100">
            <h3 class="text-sm font-bold text-gray-900">Line Items to Post</h3>
          </div>
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase">
                <th class="px-5 py-3">Product</th>
                <th class="px-4 py-3 text-center">Ordered</th>
                <th class="px-4 py-3 text-center">Prev. Rec</th>
                <th class="px-4 py-3 text-center">Current Rec</th>
                <th class="px-4 py-3 text-center">Accepted</th>
                <th class="px-4 py-3 text-center">Short</th>
                <th class="px-4 py-3 text-center">Excess</th>
                <th class="px-4 py-3 text-center">Damaged</th>
                <th class="px-5 py-3">Discrepancy Notes</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="(line, idx) in lineItems" :key="idx">
                <td class="px-5 py-3 font-semibold text-gray-900">{{ line.product }}</td>
                <td class="px-4 py-3 text-center text-gray-600">{{ line.ordered_quantity }}</td>
                <td class="px-4 py-3 text-center text-gray-500">{{ line.previously_received_quantity }}</td>
                <td class="px-4 py-3 text-center font-bold text-blue-700">{{ line.current_received_quantity }}</td>
                <td class="px-4 py-3 text-center font-bold text-[#165A31]">{{ getLineStats(line).accepted }}</td>
                <td class="px-4 py-3 text-center text-amber-600 font-semibold">{{ getLineStats(line).short }}</td>
                <td class="px-4 py-3 text-center text-blue-600 font-semibold">{{ getLineStats(line).excess }}</td>
                <td class="px-4 py-3 text-center text-red-600 font-semibold">{{ getLineStats(line).damaged }}</td>
                <td class="px-5 py-3 text-gray-600 italic">{{ line.discrepancy_reason || '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Serialized Units to be Created -->
        <div v-if="serializedRows.length > 0" class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
          <div class="p-5 border-b border-gray-100">
            <h3 class="text-sm font-bold text-gray-900">Serialized Units to be Created in Inventory ({{ serializedRows.length }})</h3>
          </div>
          <div class="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div v-for="unit in serializedRows" :key="unit.id" class="p-3 bg-gray-50 rounded-lg border border-gray-100 text-xs space-y-1">
              <div class="font-bold text-gray-900 flex items-center justify-between">
                <span>{{ unit.product }}</span>
                <span 
                  class="text-[10px] px-1.5 py-0.5 rounded font-bold"
                  :class="unit.qc === 'Pass' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'"
                >
                  {{ unit.qc }}
                </span>
              </div>
              <div class="text-gray-500 text-[11px] font-mono">Chassis: <strong class="text-gray-800">{{ unit.chassis }}</strong></div>
              <div class="text-gray-500 text-[11px] font-mono">Motor: {{ unit.motorNumber }}</div>
              <div class="text-gray-400 text-[10px]">Condition: {{ unit.condition }}</div>
            </div>
          </div>
        </div>

        <!-- Review Action Buttons -->
        <div class="flex items-center justify-between pt-4">
          <button 
            @click="activeStep = 'receive'" 
            class="px-5 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            &larr; Back to Quantity Entry
          </button>
          
          <button 
            @click="handleOpenPostModal" 
            class="px-6 py-2.5 text-[11px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-md cursor-pointer flex items-center gap-2"
          >
            <CheckCircle2 class="w-4 h-4" />
            <span>Confirm & Post Receipt</span>
          </button>
        </div>

      </div>

    </div>

    <!-- Final Confirmation Modal -->
    <div v-if="showConfirmModal" class="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-[16px] shadow-2xl w-full max-w-[480px] p-6 space-y-5 animate-in fade-in zoom-in-95">
        <div class="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-[#165A31]">
          <ShieldCheck class="w-6 h-6" />
        </div>

        <div>
          <h3 class="text-lg font-bold text-gray-900">Post Physical Receipt to Inventory</h3>
          <p class="text-xs text-gray-500 mt-1">
            You are about to finalize Goods Receipt for <strong class="text-gray-800">{{ po.po }}</strong> into <strong class="text-gray-800">{{ po.destination || po.branch }}</strong> inventory.
          </p>
        </div>

        <div class="bg-gray-50 rounded-xl p-4 space-y-2 text-xs">
          <div class="flex justify-between">
            <span class="text-gray-500">Accepted Units (Active Stock):</span>
            <span class="font-bold text-[#165A31]">{{ summaryStats.totalAccepted }} units</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Damaged / Hold Units:</span>
            <span class="font-bold text-red-600">{{ summaryStats.totalDamaged }} units</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Serialized Vehicles Created:</span>
            <span class="font-bold text-gray-900">{{ serializedRows.length }} units</span>
          </div>
          <div class="flex justify-between border-t border-gray-200 pt-2 font-bold">
            <span class="text-gray-700">New PO Status:</span>
            <span :class="(summaryStats.totalOutstanding - summaryStats.totalCurrent) <= 0 ? 'text-[#165A31]' : 'text-orange-600'">
              {{ (summaryStats.totalOutstanding - summaryStats.totalCurrent) <= 0 ? 'Fully Received' : 'Partially Received' }}
            </span>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pt-2">
          <button 
            @click="showConfirmModal = false" 
            class="px-4 py-2 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="handlePostReceipt" 
            class="px-5 py-2 text-xs font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Check class="w-4 h-4" /> Post Receipt Now
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

