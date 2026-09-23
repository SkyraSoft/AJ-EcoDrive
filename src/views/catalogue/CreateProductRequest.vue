<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../../store.js'
import { X, Check, ChevronDown, Plus } from 'lucide-vue-next'

const props = defineProps({
  isModal: {
    type: Boolean,
    default: true
  },
  requestItem: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'created', 'updated'])
const router = useRouter()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const isEditMode = ref(false)
const showValidation = ref(false)
const isCategoryDropdownOpen = ref(false)

const availableCategories = [
  'Electric Bikes',
  'Electric Scooter',
  'Electric Motorcycle',
  'Cargo',
  'Accessories',
  'Batteries & Cells',
  'Spare Parts & Components',
  'Custom Builds & Conversions'
]

const form = ref({
  id: '',
  productName: 'BRG Urban Mini',
  category: 'Electric Scooter',
  specifications: 'Compact urban electric model',
  reference: 'REF-EV-2026',
  customerDemand: '4 recent inquiries',
  urgency: 'Medium',
  images: '2 references attached',
  reason: 'Customers requested an entry model below PKR 325,000',
  status: 'Under Review'
})

const filteredCategories = computed(() => {
  const query = (form.value.category || '').trim().toLowerCase()
  if (!query) {
    return availableCategories
  }
  return availableCategories.filter(cat => cat.toLowerCase().includes(query))
})

const isCustomCategory = computed(() => {
  const query = (form.value.category || '').trim()
  if (!query) return false
  return !availableCategories.some(cat => cat.toLowerCase() === query.toLowerCase())
})

const selectCategory = (category) => {
  form.value.category = category
  isCategoryDropdownOpen.value = false
}

const toggleCategoryDropdown = () => {
  isCategoryDropdownOpen.value = !isCategoryDropdownOpen.value
}

const loadData = (data) => {
  if (!data) return
  isEditMode.value = true
  form.value = {
    ...form.value,
    id: data.id || data.requestId || form.value.id,
    productName: data.product || data.productName || form.value.productName,
    category: data.category || form.value.category,
    specifications: data.specifications || form.value.specifications,
    reference: data.reference || form.value.reference,
    customerDemand: data.customerDemand || data.demand || form.value.customerDemand,
    urgency: data.urgency || form.value.urgency,
    images: data.images || form.value.images,
    reason: data.reason || form.value.reason,
    status: data.status || form.value.status
  }
}

onMounted(() => {
  if (props.requestItem) {
    loadData(props.requestItem)
  } else if (store.originalEditProductRequest) {
    loadData(store.originalEditProductRequest)
  }
})

watch(() => props.requestItem, (newVal) => {
  if (newVal) loadData(newVal)
}, { immediate: true })

const close = () => {
  store.originalEditProductRequest = null
  emit('close')
  if (router.currentRoute.value.path.includes('/create')) {
    router.push('/catalogue/requests')
  }
}

const submitRequest = () => {
  if (!form.value.productName.trim() || !form.value.category.trim() || !form.value.reason.trim()) {
    showValidation.value = true
    return
  }

  const payload = {
    id: form.value.id || `PR-${Math.floor(100 + Math.random() * 900)}`,
    product: form.value.productName,
    productName: form.value.productName,
    category: form.value.category,
    specifications: form.value.specifications,
    reference: form.value.reference,
    customerDemand: form.value.customerDemand,
    urgency: form.value.urgency,
    images: form.value.images,
    reason: form.value.reason,
    status: form.value.status || 'Under Review',
    branch: user.value?.branchName || 'Peshawar',
    date: 'Today'
  }

  if (isEditMode.value) {
    emit('updated', payload)
  } else {
    emit('created', payload)
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

    <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">
      <!-- Scrollable Body -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6" @click="isCategoryDropdownOpen = false">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <div>
            <div class="text-[10px] text-gray-500 mb-1">
              <span v-if="isBranchUser">Branch Manager / Product Requests / <span class="font-bold text-gray-800">{{ isEditMode ? 'Edit Product Request' : 'Create Product Request' }}</span></span>
              <span v-else>Super Admin / Catalogue / Requests / <span class="font-bold text-gray-800">{{ isEditMode ? 'Edit Product Request' : 'Create Product Request' }}</span></span>
            </div>
            <h1 class="text-[28px] sm:text-[32px] tracking-tight font-bold text-gray-900">{{ isEditMode ? 'Edit Product Request' : 'Create Product Request' }}</h1>
            <p class="text-xs sm:text-sm text-gray-500 mt-1">Propose a product/model or variant for Super Admin catalogue review.</p>
          </div>
        </div>

        <!-- 2 Column Form Grid -->
        <form @submit.prevent="submitRequest" class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Left Card: Requested Product -->
            <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
              <h3 class="text-sm font-bold text-gray-900 mb-2">Requested Product</h3>
              
              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Proposed Product / Model *</label>
                <input 
                  v-model="form.productName"
                  type="text" 
                  placeholder="e.g. BRG Urban Mini"
                  class="w-full px-3.5 py-2 bg-white border rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                  :class="showValidation && !form.productName.trim() ? 'border-red-300 bg-red-50/20' : 'border-gray-200'"
                />
                <p v-if="showValidation && !form.productName.trim()" class="text-[10px] text-red-500 font-medium mt-1">Product model name is required</p>
              </div>

              <!-- Category Combobox -->
              <div class="relative" @click.stop>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Category *</label>
                <div class="relative">
                  <input 
                    v-model="form.category"
                    type="text" 
                    placeholder="e.g. Electric Scooter"
                    @focus="isCategoryDropdownOpen = true"
                    @keydown.down.prevent="isCategoryDropdownOpen = true"
                    @keydown.esc="isCategoryDropdownOpen = false"
                    @keydown.enter.prevent="isCategoryDropdownOpen = false"
                    class="w-full pl-3.5 pr-9 py-2 bg-white border rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                    :class="showValidation && !form.category.trim() ? 'border-red-300 bg-red-50/20' : 'border-gray-200'"
                  />
                  <button 
                    type="button"
                    tabindex="-1"
                    @click="toggleCategoryDropdown"
                    class="absolute right-0 top-0 bottom-0 px-2.5 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    <ChevronDown class="w-3.5 h-3.5 transition-transform duration-200" :class="{ 'rotate-180': isCategoryDropdownOpen }" />
                  </button>
                </div>

                <!-- Dropdown Menu -->
                <div 
                  v-if="isCategoryDropdownOpen" 
                  class="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 max-h-56 overflow-y-auto animate-in fade-in zoom-in-95 duration-150"
                >
                  <div class="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 mb-1 flex items-center justify-between">
                    <span>Existing Categories</span>
                    <span v-if="filteredCategories.length > 0" class="text-[9px] font-medium text-gray-400">{{ filteredCategories.length }}</span>
                  </div>

                  <!-- Existing Categories Options -->
                  <button 
                    v-for="cat in filteredCategories" 
                    :key="cat"
                    type="button"
                    @click="selectCategory(cat)"
                    class="w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                    :class="form.category.trim().toLowerCase() === cat.toLowerCase() ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
                  >
                    <span>{{ cat }}</span>
                    <Check v-if="form.category.trim().toLowerCase() === cat.toLowerCase()" class="w-3.5 h-3.5 text-[#165A31]" />
                  </button>

                  <!-- Custom Category Option -->
                  <div v-if="isCustomCategory" class="border-t border-gray-100 mt-1 pt-1">
                    <button 
                      type="button"
                      @click="selectCategory(form.category.trim())"
                      class="w-full text-left px-3.5 py-2 text-xs flex items-center justify-between text-[#165A31] bg-[#eefcf2]/40 hover:bg-[#eefcf2]/70 font-semibold transition-colors cursor-pointer"
                    >
                      <div class="flex items-center gap-1.5">
                        <Plus class="w-3.5 h-3.5 text-[#165A31]" />
                        <span>Use custom: "<strong>{{ form.category.trim() }}</strong>"</span>
                      </div>
                      <span class="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#165A31]/10 text-[#165A31] font-bold">Custom</span>
                    </button>
                  </div>

                  <!-- Empty state when no matches and query is empty -->
                  <div v-if="filteredCategories.length === 0 && !isCustomCategory" class="px-3.5 py-3 text-center text-xs text-gray-400">
                    No matching categories. Type to enter a custom category.
                  </div>
                </div>

                <p v-if="showValidation && !form.category.trim()" class="text-[10px] text-red-500 font-medium mt-1">Category is required</p>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Specifications</label>
                <input 
                  v-model="form.specifications"
                  type="text" 
                  placeholder="e.g. Compact urban electric model"
                  class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                />
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Supplier / Product Reference</label>
                <input 
                  v-model="form.reference"
                  type="text" 
                  placeholder="e.g. Optional reference code"
                  class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                />
              </div>
            </div>

            <!-- Right Card: Demand & Evidence -->
            <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
              <h3 class="text-sm font-bold text-gray-900 mb-2">Demand & Evidence</h3>
              
              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Customer Demand</label>
                <input 
                  v-model="form.customerDemand"
                  type="text" 
                  placeholder="e.g. 4 recent inquiries"
                  class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                />
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Urgency</label>
                <select 
                  v-model="form.urgency"
                  class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-[#165A31] transition-colors"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Images / Evidence Attachment</label>
                <input 
                  v-model="form.images"
                  type="text" 
                  placeholder="e.g. 2 references attached"
                  class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                />
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Reason for Request *</label>
                <textarea 
                  v-model="form.reason"
                  rows="3"
                  placeholder="Explain why this model should be added to the catalogue..."
                  class="w-full px-3.5 py-2 bg-white border rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors resize-none"
                  :class="showValidation && !form.reason.trim() ? 'border-red-300 bg-red-50/20' : 'border-gray-200'"
                ></textarea>
                <p v-if="showValidation && !form.reason.trim()" class="text-[10px] text-red-500 font-medium mt-1">Reason is required</p>
              </div>
            </div>
          </div>

          <!-- Alert Notice Banner -->
          <div class="bg-[#f0fdf4] border border-[#dcfce7] rounded-lg p-3.5 text-[11px] text-gray-600 leading-relaxed font-medium">
            Submitting this request does not create a Product or physical inventory. Super Admin must approve/create the catalogue item.
          </div>

          <!-- Actions -->
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
              {{ isEditMode ? 'Update Request' : 'Submit Request' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
