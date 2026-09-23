<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Check, UploadCloud, X, FileText, Image as ImageIcon, Trash2 } from 'lucide-vue-next'

const router = useRouter()
const showSuccess = ref(false)

const images = ref([])
const brochureFile = ref(null)
const specSheetFile = ref(null)
const warrantyFile = ref(null)

const handleImageUpload = (event) => {
  const files = Array.from(event.target.files)
  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      images.value.push({
        file,
        preview: URL.createObjectURL(file),
        name: file.name
      })
    }
  })
}

const removeImage = (index) => {
  URL.revokeObjectURL(images.value[index].preview)
  images.value.splice(index, 1)
}

const handleDocumentUpload = (event, type) => {
  const file = event.target.files[0]
  if (!file) return
  if (type === 'brochure') brochureFile.value = file
  if (type === 'specSheet') specSheetFile.value = file
  if (type === 'warranty') warrantyFile.value = file
}

const removeDocument = (type) => {
  if (type === 'brochure') brochureFile.value = null
  if (type === 'specSheet') specSheetFile.value = null
  if (type === 'warranty') warrantyFile.value = null
}

const fileInputRef = ref(null)
const triggerImageSelect = () => {
  fileInputRef.value?.click()
}

const cancel = () => {
  router.push('/catalogue/products')
}

const save = () => {
  showSuccess.value = true
}

const finish = () => {
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
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Catalogue / Products / <span class="font-bold text-gray-800">Create Product</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Create Product</h1>
        <p class="text-sm text-gray-500 mt-1">Create a BRG product master. This action never creates physical inventory.</p>
      </div>
    </div>

    <!-- Form Grid -->
    <div v-if="!showSuccess" class="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- 1. Identity & Classification -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-[14px] font-bold text-gray-900 mb-2">1. Identity & Classification</h3>
        
        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Product Name</label>
          <input type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Category</label>
            <input type="text" placeholder="Electric Bikes" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
          </div>
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Subcategory</label>
            <input type="text" placeholder="Commuter" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Model</label>
            <input type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
          </div>
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">SKU</label>
            <input type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
          </div>
        </div>
      </div>

      <!-- 2. Tracking & Variants -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-[14px] font-bold text-gray-900 mb-2">2. Tracking & Variants</h3>
        
        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Tracking Method</label>
          <input type="text" placeholder="Serialized - Serial + Chassis" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
        </div>
        
        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Variants</label>
          <input type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Warranty</label>
          <input type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
        </div>
      </div>

      <!-- 3. Specifications & Media -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-[14px] font-bold text-gray-900 mb-2">3. Specifications & Media</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Motor</label>
            <input type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
          </div>
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Battery</label>
            <input type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Range</label>
            <input type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
          </div>
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Top Speed</label>
            <input type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Product Images</label>
          <div 
            class="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-[#165A31] transition-colors cursor-pointer group"
            @click="triggerImageSelect"
          >
            <div class="w-10 h-10 bg-[#eefcf2] rounded-full flex items-center justify-center mb-3 group-hover:bg-[#165A31] transition-colors">
              <UploadCloud class="w-5 h-5 text-[#165A31] group-hover:text-white transition-colors" />
            </div>
            <p class="text-[12px] font-bold text-gray-900 mb-1">Click to upload or drag and drop</p>
            <p class="text-[10px] text-gray-500">SVG, PNG, JPG or GIF (max. 5MB)</p>
            <input type="file" multiple accept="image/*" class="hidden" ref="fileInputRef" @change="handleImageUpload" />
          </div>
          
          <div v-if="images.length > 0" class="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            <div v-for="(img, idx) in images" :key="idx" class="relative group aspect-square rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <img :src="img.preview" class="w-full h-full object-cover" />
              <button 
                @click.stop="removeImage(idx)"
                class="absolute top-1 right-1 p-1 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600 shadow-sm"
              >
                <X class="w-3.5 h-3.5 text-gray-700 hover:text-red-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. Commercial Rules -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-[14px] font-bold text-gray-900 mb-2">4. Commercial Rules</h3>
        
        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Selling Price</label>
          <input type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Low Stock Threshold (Units)</label>
            <input type="number" min="0" placeholder="e.g. 5" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
          </div>
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Poor Stock Threshold (Days Unsold)</label>
            <input type="number" min="0" placeholder="e.g. 90" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-2.5">Documents</label>
          <div class="space-y-3">
            <!-- Brochure -->
            <div class="flex items-center justify-between p-3 border border-gray-200 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-[#eefcf2] flex items-center justify-center">
                  <FileText class="w-4 h-4 text-[#165A31]" />
                </div>
                <div>
                  <p class="text-[11px] font-bold text-gray-900">Brochure</p>
                  <p v-if="!brochureFile" class="text-[10px] text-gray-500">PDF, max 10MB</p>
                  <p v-else class="text-[10px] text-[#165A31] font-medium truncate w-32 sm:w-48">{{ brochureFile.name }}</p>
                </div>
              </div>
              <div>
                <label v-if="!brochureFile" class="text-[10px] font-bold text-[#165A31] bg-[#eefcf2] px-3 py-1.5 rounded hover:bg-[#dcfce7] transition-colors cursor-pointer">
                  Upload
                  <input type="file" accept=".pdf" class="hidden" @change="e => handleDocumentUpload(e, 'brochure')" />
                </label>
                <button v-else @click="removeDocument('brochure')" type="button" class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Specification Sheet -->
            <div class="flex items-center justify-between p-3 border border-gray-200 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-[#eefcf2] flex items-center justify-center">
                  <FileText class="w-4 h-4 text-[#165A31]" />
                </div>
                <div>
                  <p class="text-[11px] font-bold text-gray-900">Specification Sheet</p>
                  <p v-if="!specSheetFile" class="text-[10px] text-gray-500">PDF, max 10MB</p>
                  <p v-else class="text-[10px] text-[#165A31] font-medium truncate w-32 sm:w-48">{{ specSheetFile.name }}</p>
                </div>
              </div>
              <div>
                <label v-if="!specSheetFile" class="text-[10px] font-bold text-[#165A31] bg-[#eefcf2] px-3 py-1.5 rounded hover:bg-[#dcfce7] transition-colors cursor-pointer">
                  Upload
                  <input type="file" accept=".pdf" class="hidden" @change="e => handleDocumentUpload(e, 'specSheet')" />
                </label>
                <button v-else @click="removeDocument('specSheet')" type="button" class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Warranty Document -->
            <div class="flex items-center justify-between p-3 border border-gray-200 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-[#eefcf2] flex items-center justify-center">
                  <FileText class="w-4 h-4 text-[#165A31]" />
                </div>
                <div>
                  <p class="text-[11px] font-bold text-gray-900">Warranty Policy</p>
                  <p v-if="!warrantyFile" class="text-[10px] text-gray-500">PDF, max 10MB</p>
                  <p v-else class="text-[10px] text-[#165A31] font-medium truncate w-32 sm:w-48">{{ warrantyFile.name }}</p>
                </div>
              </div>
              <div>
                <label v-if="!warrantyFile" class="text-[10px] font-bold text-[#165A31] bg-[#eefcf2] px-3 py-1.5 rounded hover:bg-[#dcfce7] transition-colors cursor-pointer">
                  Upload
                  <input type="file" accept=".pdf" class="hidden" @change="e => handleDocumentUpload(e, 'warranty')" />
                </label>
                <button v-else @click="removeDocument('warranty')" type="button" class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Activation</label>
          <input type="text" placeholder="Active after review" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
        </div>
      </div>

    </div>

    <!-- Actions Footer -->
    <div v-if="!showSuccess" class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 pt-4">
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
        <button @click="save" class="px-5 py-2 text-[11px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          Review & Activate Product
        </button>
      </div>
    </div>

    <!-- Success State -->
    <div v-if="showSuccess" class="flex flex-col items-center justify-center py-24 animate-in fade-in zoom-in duration-300">
      <div class="w-16 h-16 bg-[#eefcf2] rounded-2xl flex items-center justify-center mb-6">
        <Check class="w-8 h-8 text-[#165A31]" />
      </div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Saved successfully</h2>
      <p class="text-sm text-gray-500 text-center max-w-sm mb-8">
        Product created successfully. Physical stock remains 0 until an approved inventory-entry flow is completed.
      </p>
      <button @click="finish" class="px-8 py-2.5 text-sm font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        Continue
      </button>
    </div>

    <!-- Toast Notification -->
    <div v-if="showSuccess" class="fixed top-24 right-8 bg-white border-l-4 border-[#165A31] shadow-lg rounded-r-lg p-4 max-w-sm animate-in slide-in-from-top-5 fade-in duration-300 z-50">
      <div class="flex items-start gap-3">
        <Check class="w-4 h-4 text-[#165A31] mt-0.5" />
        <div>
          <h4 class="text-sm font-bold text-gray-900 mb-1">Success</h4>
          <p class="text-xs text-gray-500">Product created successfully. Physical stock remains 0 until an approved inventory-entry flow is completed.</p>
        </div>
      </div>
    </div>
  </div>

      </div>
    </div>
  </div>
</template>