<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../../store.js'

const router = useRouter()
const emit = defineEmits(['close', 'updated'])

const products = computed(() => {
  const list = (store.products || []).map(p => p.name).filter(Boolean)
  return ['All Products', ...new Set(list)]
})

const branches = [
  { id: 'ALL', name: 'All Branches' },
  { id: 'BR-01', name: 'Peshawar' },
  { id: 'BR-02', name: 'Islamabad' },
  { id: 'BR-03', name: 'Lahore' },
  { id: 'BR-04', name: 'Rawalpindi' }
]

const form = ref({
  id: '',
  ruleName: '',
  product: '',
  productVariant: '',
  branchId: 'ALL',
  branch: 'All Branches',
  customerSegment: 'Standard',
  basePrice: '',
  minimumPrice: '',
  minMarginPercent: '15',
  maxDiscountPercent: '0',
  maxDiscountPkr: '0',
  requiresApproval: true,
  effectiveFrom: '',
  effectiveTo: '',
  priority: 1,
  policyClassification: 'Unconfirmed configuration',
  status: 'Draft',
  reason: ''
})

const showValidation = ref(false)

onMounted(() => {
  const orig = store.originalEditPriceRule
  if (orig) {
    const raw = orig.rawRule || orig
    form.value = {
      id: raw.id || orig.id,
      ruleName: raw.rule_name || raw.ruleName || orig.product || 'Standard Policy',
      product: raw.product || orig.product,
      productVariant: raw.product_variant || orig.productVariant || '',
      branchId: raw.branch_id || (orig.branchOverride !== 'None' ? orig.branchOverride : 'ALL'),
      branch: raw.branch || (orig.branchOverride !== 'None' ? orig.branchOverride : 'All Branches'),
      customerSegment: raw.customer_segment || orig.customerSegment || 'Standard',
      basePrice: String(raw.base_price || orig.sellingPrice || '').replace(/[^0-9.]/g, ''),
      minimumPrice: String(raw.minimum_price || orig.minimum || '').replace(/[^0-9.]/g, ''),
      minMarginPercent: String(raw.min_margin_percent || '15'),
      maxDiscountPercent: String(raw.max_discount_percent ?? orig.maxDiscountPercent ?? 0),
      maxDiscountPkr: String(raw.max_discount_pkr ?? orig.maxDiscountPkr ?? 0),
      requiresApproval: raw.requires_approval !== undefined ? Boolean(raw.requires_approval) : (orig.requiresApproval !== undefined ? Boolean(orig.requiresApproval) : true),
      effectiveFrom: raw.effective_from || orig.effective || '',
      effectiveTo: raw.effective_to || '',
      priority: raw.priority || orig.priority || 1,
      policyClassification: raw.policy_classification || orig.policyClassification || (orig.status === 'Demo' ? 'Demo/example data' : 'Unconfirmed configuration'),
      status: raw.status || orig.status || 'Draft',
      reason: raw.reason || ''
    }
  }
})

const onBranchChange = () => {
  const found = branches.find(b => b.id === form.value.branchId)
  if (found) form.value.branch = found.name
}

const saveChanges = () => {
  if (!form.value.product || !form.value.basePrice || !form.value.minimumPrice) {
    showValidation.value = true
    return
  }

  const numBase = parseFloat(form.value.basePrice) || 0
  const numMin = parseFloat(form.value.minimumPrice) || 0
  const numDiscPct = parseFloat(form.value.maxDiscountPercent) || 0
  const numDiscPkr = parseFloat(form.value.maxDiscountPkr) || 0

  const updatedPayload = {
    ...form.value,
    rule_name: form.value.ruleName,
    ruleName: form.value.ruleName,
    base_price: numBase,
    basePrice: numBase,
    sellingPrice: `${Math.round(numBase / 1000)}K`,
    branch_price: numBase,
    branchPrice: numBase,
    minimum_price: numMin,
    minimumPrice: numMin,
    minimum: `${Math.round(numMin / 1000)}K`,
    branch_id: form.value.branchId,
    branchId: form.value.branchId,
    branch: form.value.branch,
    branchOverride: form.value.branchId !== 'ALL' ? form.value.branch : 'None',
    customer_segment: form.value.customerSegment,
    customerSegment: form.value.customerSegment,
    min_margin_percent: parseFloat(form.value.minMarginPercent) || 15,
    max_discount_percent: numDiscPct,
    maxDiscountPercent: numDiscPct,
    max_discount_pkr: numDiscPkr,
    maxDiscountPkr: numDiscPkr,
    requires_approval: form.value.requiresApproval ? 1 : 0,
    requiresApproval: form.value.requiresApproval,
    effective_from: form.value.effectiveFrom || null,
    effective_to: form.value.effectiveTo || null,
    effective: form.value.effectiveFrom || 'Immediate',
    priority: parseInt(form.value.priority, 10) || 1,
    status: form.value.status,
    policy_classification: form.value.policyClassification,
    policyClassification: form.value.policyClassification,
    approved_by: form.value.policyClassification === 'Business-approved' ? (store.currentUser?.name || 'Super Admin') : null
  }

  if (typeof store.updatePriceRule === 'function') {
    store.updatePriceRule(form.value.id || form.value.product, updatedPayload)
  }

  emit('updated', updatedPayload)
  emit('close')
  if (router.currentRoute.value.path.includes('/edit')) {
    router.push('/catalogue/pricing')
  }
}

const cancel = () => {
  emit('close')
  if (router.currentRoute.value.path.includes('/edit')) {
    router.push('/catalogue/pricing')
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-gray-900/50 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm" @click.self="cancel">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      
      <!-- Close button on top right -->
      <button @click="cancel" class="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-100 rounded-full z-50 shadow-sm transition-colors cursor-pointer">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Scrollable Body -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
        <div class="space-y-6">
          <!-- Header -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            <div>
              <div class="text-[10px] text-gray-500 mb-1">Super Admin / Catalogue / Pricing / <span class="font-bold text-gray-800">Edit Rule</span></div>
              <h1 class="text-[28px] tracking-tight font-bold text-gray-900">Edit Price Rule & Policy</h1>
              <p class="text-xs text-gray-500 mt-1">Modify pricing thresholds, discount limits, and business approval status.</p>
            </div>
          </div>

          <!-- Form Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <!-- 1. Scope & Targeting -->
            <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <h3 class="text-xs font-bold text-gray-900 uppercase tracking-wider">1. Scope & Target Segmentation</h3>
              
              <div>
                <label class="block text-[11px] font-medium text-gray-700 mb-1">Target Product *</label>
                <select v-model="form.product" class="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] bg-white">
                  <option v-for="p in products" :key="p" :value="p">{{ p }}</option>
                </select>
              </div>

              <div>
                <label class="block text-[11px] font-medium text-gray-700 mb-1">Product Variant (Optional)</label>
                <input v-model="form.productVariant" type="text" placeholder="e.g. 72V 30Ah Graphene Edition" class="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31]" />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1">Showroom Branch *</label>
                  <select v-model="form.branchId" @change="onBranchChange" class="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] bg-white">
                    <option v-for="b in branches" :key="b.id" :value="b.id">{{ b.name }}</option>
                  </select>
                </div>

                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1">Customer Segment</label>
                  <select v-model="form.customerSegment" class="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] bg-white">
                    <option value="Standard">Standard Retail</option>
                    <option value="Commercial">Commercial / Cargo</option>
                    <option value="Corporate">Corporate & Fleet</option>
                    <option value="VIP">VIP / Repeat Client</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1">Effective From</label>
                  <input v-model="form.effectiveFrom" type="date" class="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31]" />
                </div>
                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1">Effective To (Optional)</label>
                  <input v-model="form.effectiveTo" type="date" class="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31]" />
                </div>
              </div>
            </div>

            <!-- 2. Pricing & Margin Controls -->
            <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <h3 class="text-xs font-bold text-gray-900 uppercase tracking-wider">2. Price Floors & Discount Limits</h3>
              
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1">Catalogue Base Price (PKR) *</label>
                  <input v-model="form.basePrice" type="number" placeholder="280000" class="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] font-mono" />
                </div>
                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1">Minimum Floor Price (PKR) *</label>
                  <input v-model="form.minimumPrice" type="number" placeholder="266000" class="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] font-mono" />
                </div>
              </div>

              <div class="grid grid-cols-3 gap-3">
                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1">Max Disc %</label>
                  <input v-model="form.maxDiscountPercent" type="number" step="0.5" placeholder="0" class="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] font-mono" />
                </div>
                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1">Max Disc PKR</label>
                  <input v-model="form.maxDiscountPkr" type="number" step="1000" placeholder="0" class="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] font-mono" />
                </div>
                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1">Min Margin %</label>
                  <input v-model="form.minMarginPercent" type="number" placeholder="15" class="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] font-mono" />
                </div>
              </div>

              <div class="pt-2">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input v-model="form.requiresApproval" type="checkbox" class="w-4 h-4 text-[#165A31] rounded border-gray-300 focus:ring-[#165A31]" />
                  <span class="text-xs text-gray-800 font-medium">Require Super Admin approval if discount exceeds limit or sells below floor</span>
                </label>
              </div>

              <div>
                <label class="block text-[11px] font-medium text-gray-700 mb-1">Rule Priority (Higher = Takes Precedence)</label>
                <input v-model="form.priority" type="number" min="1" max="10" class="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31]" />
              </div>
            </div>

            <!-- 3. Policy Classification & Approval -->
            <div class="md:col-span-2 bg-gray-50/70 p-5 rounded-xl border border-gray-200 space-y-4">
              <h3 class="text-xs font-bold text-gray-900 uppercase tracking-wider">3. Dealership Policy Ratification</h3>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1">Policy Classification *</label>
                  <select v-model="form.policyClassification" class="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] bg-white">
                    <option value="Unconfirmed configuration">Unconfirmed configuration</option>
                    <option value="Demo/example data">Demo/example data</option>
                    <option value="Business-approved">Business-approved</option>
                  </select>
                  <p class="text-[10px] text-gray-500 mt-1">Setting to 'Business-approved' ratifies this rule into official dealership policy.</p>
                </div>

                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1">Status *</label>
                  <select v-model="form.status" class="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] bg-white">
                    <option value="Draft">Draft</option>
                    <option value="Demo">Demo</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1">Policy Reason / Audit Notes</label>
                  <input v-model="form.reason" type="text" placeholder="e.g. Official policy approved by Director" class="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] bg-white" />
                </div>
              </div>
            </div>

          </div>

          <!-- Actions Footer -->
          <div class="flex items-center justify-end pt-4 border-t border-gray-100 gap-3">
            <button @click="cancel" class="px-5 py-2.5 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              Cancel
            </button>
            <button @click="saveChanges" class="px-6 py-2.5 text-xs font-bold text-white bg-[#165A31] hover:bg-[#124a28] rounded-lg shadow-sm cursor-pointer transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
