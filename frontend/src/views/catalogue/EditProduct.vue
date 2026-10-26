<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../../store.js'

const router = useRouter()

// Canonical Category & Subcategory Master Map
const CATEGORY_SUBCATEGORY_MAP = {
  'Electric Scooters': ['Commuter', 'High Speed', 'Urban Mini'],
  'Electric Bikes': ['Commuter', 'Mountain / Off-Road', 'Standard'],
  'Commercial & Cargo': ['Cargo Loader', 'Heavy Duty'],
  'Batteries & Chargers': ['Lithium Packs', 'Fast Chargers'],
  'Spare Parts & Accessories': ['Body Panels', 'Motors & Controllers', 'Accessories']
}

const canonicalCategories = computed(() => {
  if (store.categories && store.categories.length > 0) {
    return store.categories.map(c => c.name)
  }
  return Object.keys(CATEGORY_SUBCATEGORY_MAP)
})

const computedSubcategories = computed(() => {
  const selected = productData.value.category
  if (CATEGORY_SUBCATEGORY_MAP[selected]) {
    return CATEGORY_SUBCATEGORY_MAP[selected]
  }
  return ['Standard', 'General']
})

const trackingOptions = [
  'Serialized - Serial + Chassis',
  'Non-Serialized - Batch/Lot'
]

const variantOptions = [
  'Standard',
  'Red / Black',
  'Blue / White',
  'Grey / Silver',
  'Custom Spec / Color'
]

const warrantyOptions = [
  '2 Years / 20,000 km',
  '3-Year Battery & Controller',
  '1 Year Standard',
  'No Warranty'
]

const activationOptions = [
  'Active after review',
  'Active',
  'Draft'
]

const computedVariantOptions = computed(() => {
  const opts = [...variantOptions]
  if (productData.value.variants && !opts.includes(productData.value.variants)) {
    opts.push(productData.value.variants)
  }
  return opts
})

const computedWarrantyOptions = computed(() => {
  const opts = [...warrantyOptions]
  if (productData.value.warranty && !opts.includes(productData.value.warranty)) {
    opts.push(productData.value.warranty)
  }
  return opts
})

const productData = ref({
  name: '',
  category: 'Electric Scooters',
  subcategory: 'Commuter',
  model: '',
  sku: '',
  tracking: 'Serialized - Serial + Chassis',
  variants: 'Standard',
  warranty: '2 Years / 20,000 km',
  motor: '',
  battery: '',
  range: '',
  speed: '',
  supplier: '',
  price: '',
  stock: '',
  reorderLevel: '',
  documents: '',
  media: '',
  activation: 'Active'
})

onMounted(() => {
  if (store.originalEditProduct) {
    productData.value = { ...productData.value, ...store.originalEditProduct }
  }
})

// Keep subcategory valid when category changes
watch(() => productData.value.category, (newCategory) => {
  const validSubs = CATEGORY_SUBCATEGORY_MAP[newCategory] || ['Standard']
  if (!validSubs.includes(productData.value.subcategory)) {
    productData.value.subcategory = validSubs[0] || 'Standard'
  }
})

const showValidation = ref(false)

const saveChanges = () => {
  if (!productData.value.name || !productData.value.sku || !productData.value.price) {
    showValidation.value = true
    return
  }

  const targetId = productData.value.id || productData.value.product_id || productData.value.name || productData.value.sku
  store.updateProduct(targetId, productData.value)
  if (store.originalEditProduct) {
    store.applyEdit(store.originalEditProduct, productData.value)
  }
  router.push('/catalogue/products')
}

const cancel = () => {
  router.push('/catalogue/products')
}
</script>

<template>
  <div class="fixed inset-0 bg-gray-900/50 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm" @click.self="router.back()">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      
      <!-- Close button on top right -->
      <button @click="router.back()" class="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-100 rounded-full z-50 shadow-sm transition-colors">
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
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Catalogue / Products / <span class="font-bold text-gray-800">Edit Product</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Edit Product</h1>
        <p class="text-sm text-gray-500 mt-1">Update product master data without changing physical stock.</p>
      </div>
    </div>

    <!-- Form Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- 1. Identity & Classification -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-[14px] font-bold text-gray-900 mb-2">1. Identity & Classification</h3>
        
        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Product Name</label>
          <input v-model="productData.name" type="text" :class="showValidation && !productData.name ? 'border-red-300 bg-red-50/30 text-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-[#165A31] focus:border-[#165A31]'" class="w-full px-3 py-2 text-[12px] border rounded-lg focus:outline-none focus:ring-1 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
          <p v-if="showValidation && !productData.name" class="text-[10px] text-red-500 mt-1.5 font-medium">This field is required.</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Category</label>
            <select v-model="productData.category" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white cursor-pointer">
              <option v-for="cat in canonicalCategories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Subcategory</label>
            <select v-model="productData.subcategory" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white cursor-pointer">
              <option v-for="sub in computedSubcategories" :key="sub" :value="sub">{{ sub }}</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Model</label>
            <input v-model="productData.model" type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
          </div>
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">SKU</label>
            <input v-model="productData.sku" type="text" :class="showValidation && !productData.sku ? 'border-red-300 bg-red-50/30 text-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-[#165A31] focus:border-[#165A31]'" class="w-full px-3 py-2 text-[12px] border rounded-lg focus:outline-none focus:ring-1 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
            <p v-if="showValidation && !productData.sku" class="text-[10px] text-red-500 mt-1.5 font-medium">This field is required.</p>
          </div>
        </div>
      </div>

      <!-- 2. Tracking & Variants -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-[14px] font-bold text-gray-900 mb-2">2. Tracking & Variants</h3>
        
        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Tracking Method</label>
          <select v-model="productData.tracking" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white cursor-pointer">
            <option v-for="track in trackingOptions" :key="track" :value="track">{{ track }}</option>
          </select>
        </div>
        
        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Variants</label>
          <select v-model="productData.variants" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white cursor-pointer">
            <option v-for="varOpt in computedVariantOptions" :key="varOpt" :value="varOpt">{{ varOpt }}</option>
          </select>
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Warranty</label>
          <select v-model="productData.warranty" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white cursor-pointer">
            <option v-for="warr in computedWarrantyOptions" :key="warr" :value="warr">{{ warr }}</option>
          </select>
        </div>
      </div>

      <!-- 3. Specifications & Media -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-[14px] font-bold text-gray-900 mb-2">3. Specifications & Media</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Motor</label>
            <input v-model="productData.motor" type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
          </div>
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Battery</label>
            <input v-model="productData.battery" type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Range</label>
            <input v-model="productData.range" type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
          </div>
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Top Speed</label>
            <input v-model="productData.speed" type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Media</label>
          <input v-model="productData.media" type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
        </div>
      </div>

      <!-- 4. Commercial Rules -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-[14px] font-bold text-gray-900 mb-2">4. Commercial Rules</h3>
        
        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Selling Price</label>
          <input v-model="productData.price" type="text" :class="showValidation && !productData.price ? 'border-red-300 bg-red-50/30 text-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-[#165A31] focus:border-[#165A31]'" class="w-full px-3 py-2 text-[12px] border rounded-lg focus:outline-none focus:ring-1 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
          <p v-if="showValidation && !productData.price" class="text-[10px] text-red-500 mt-1.5 font-medium">This field is required.</p>
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Reorder Level</label>
          <input v-model="productData.reorderLevel" type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Documents</label>
          <input v-model="productData.documents" type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Activation</label>
          <select v-model="productData.activation" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white cursor-pointer">
            <option v-for="act in activationOptions" :key="act" :value="act">{{ act }}</option>
          </select>
        </div>
      </div>

    </div>

    <!-- Actions Footer -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 pt-4">
      <div class="text-[9px] text-gray-500">
        Activation creates the catalogue record only. <span class="font-bold text-gray-700">Physical stock remains 0.</span>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <button @click="cancel" class="px-5 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          Cancel
        </button>
        <button class="px-5 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          Save Draft
        </button>
        <button @click="saveChanges" class="px-5 py-2 text-[11px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          Save Product Changes
        </button>
      </div>
    </div>
  </div>

      </div>
    </div>
  </div>
</template>