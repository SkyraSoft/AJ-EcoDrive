<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '@/store'

const router = useRouter()
const emit = defineEmits(['close', 'created'])

const form = ref({
  name: '',
  code: '',
  description: '',
  type: 'Primary Category',
  parentCategory: '',
  template: 'E-Bike Specs'
})

const showValidation = ref(false)
const errorMessage = ref('')

const validate = () => {
  errorMessage.value = ''
  if (!form.value.name.trim()) {
    errorMessage.value = 'Category Name is required.'
    return false
  }
  if (!form.value.code.trim()) {
    errorMessage.value = 'Category Code is required.'
    return false
  }
  return true
}

const cancel = () => {
  emit('close')
  if (router.currentRoute.value.path.includes('/create')) {
    router.push('/catalogue/categories')
  }
}

const handleSubmit = () => {
  showValidation.value = true
  if (!validate()) return

  const newCategory = {
    id: `CAT-${form.value.code.trim().toUpperCase().replace(/\s+/g, '-')}`,
    name: form.value.name.trim(),
    code: form.value.code.trim().toUpperCase(),
    description: form.value.description.trim(),
    type: form.value.type,
    template: form.value.template,
    subcategories: form.value.type === 'Primary Category' ? '0' : '—',
    products: '0',
    status: 'Active'
  }

  // Persist directly into canonical store
  if (typeof store.addCategory === 'function') {
    store.addCategory(newCategory)
  }

  emit('created', newCategory)
  emit('close')

  if (router.currentRoute.value.path.includes('/create')) {
    router.push('/catalogue/categories')
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-gray-900/50 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm" @click.self="cancel">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      
      <!-- Close button on top right -->
      <button @click="cancel" class="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-100 rounded-full z-50 shadow-sm transition-colors cursor-pointer">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Scrollable Body -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Header -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            <div>
              <div class="text-[10px] text-gray-500 mb-1">Super Admin / Catalogue / Categories / <span class="font-bold text-gray-800">Create Category</span></div>
              <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Create Category</h1>
              <p class="text-sm text-gray-500 mt-1">Add a new category or subcategory to the catalogue hierarchy.</p>
            </div>
          </div>

          <!-- Error Alert Banner -->
          <div v-if="showValidation && errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-xs text-red-600 font-medium">{{ errorMessage }}</p>
          </div>

          <!-- Form Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-6">
            
            <!-- 1. Category Details -->
            <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
              <h3 class="text-[14px] font-bold text-gray-900 mb-2">1. Category Details</h3>
              
              <div>
                <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Category Name *</label>
                <input 
                  v-model="form.name"
                  type="text" 
                  placeholder="e.g. Electric Bikes" 
                  class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" 
                />
              </div>
              
              <div>
                <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Category Code *</label>
                <input 
                  v-model="form.code"
                  type="text" 
                  placeholder="e.g. E-BIKE" 
                  class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" 
                />
              </div>

              <div>
                <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Description (Optional)</label>
                <textarea 
                  v-model="form.description"
                  rows="3" 
                  placeholder="Operational category notes or description..."
                  class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
                ></textarea>
              </div>
            </div>

            <!-- 2. Hierarchy & Templates -->
            <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
              <h3 class="text-[14px] font-bold text-gray-900 mb-2">2. Hierarchy & Templates</h3>
              
              <div>
                <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Category Type</label>
                <select 
                  v-model="form.type"
                  class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white"
                >
                  <option value="Primary Category">Primary Category</option>
                  <option value="Subcategory">Subcategory</option>
                </select>
              </div>
              
              <div>
                <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Parent Category (If Subcategory)</label>
                <select 
                  v-model="form.parentCategory"
                  :disabled="form.type === 'Primary Category'"
                  class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white disabled:bg-gray-50 disabled:text-gray-400"
                >
                  <option value="">Select Parent Category...</option>
                  <option value="Electric Bikes">Electric Bikes</option>
                  <option value="Scooters">Scooters</option>
                  <option value="Cargo">Cargo</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div>
                <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Specification Template</label>
                <select 
                  v-model="form.template"
                  class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white"
                >
                  <option value="E-Bike Specs">E-Bike Specs</option>
                  <option value="Scooter Specs">Scooter Specs</option>
                  <option value="Cargo Specs">Cargo Specs</option>
                  <option value="Accessory Specs">Accessory Specs</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Actions Footer -->
          <div class="flex items-center justify-end pt-4">
            <div class="flex flex-wrap items-center gap-3">
              <button type="button" @click="cancel" class="px-5 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer">
                Cancel
              </button>
              <button type="submit" class="px-5 py-2 text-[11px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05)] cursor-pointer">
                Create Category
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>