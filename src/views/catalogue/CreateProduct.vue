<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Check } from 'lucide-vue-next'

const router = useRouter()
const showSuccess = ref(false)

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
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Media</label>
          <input type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
        </div>
      </div>

      <!-- 4. Commercial Rules -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-[14px] font-bold text-gray-900 mb-2">4. Commercial Rules</h3>
        
        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Selling Price</label>
          <input type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Reorder Level</label>
          <input type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Documents</label>
          <input type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
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