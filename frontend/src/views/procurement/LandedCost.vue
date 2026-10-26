<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isSaved = ref(false)
const showToast = ref(false)

const handlePost = () => {
  isSaved.value = true
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 4000)
}

const costComponents = [
  { component: 'Base Product Cost', amount: '2.650M', source: 'PO' },
  { component: 'Freight', amount: '180K', source: 'Pak Logistics' },
  { component: 'Duties', amount: '98K', source: 'Customs' },
  { component: 'Insurance', amount: '16K', source: 'Policy' },
  { component: 'Handling', amount: '22K', source: 'Warehouse' }
]

const allocatedUnits = [
  { product: 'BRG DS11', qty: '8', base: '146K', addon: '17.4K', final: '163.4K' },
  { product: 'BRG EV-5', qty: '5', base: '168K', addon: '20.0K', final: '188.0K' },
  { product: 'Cargo Pro', qty: '3', base: '214K', addon: '25.4K', final: '239.4K' }
]

const cancel = () => {
  router.push('/procurement/receipts/detail')
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Toast Notification -->
    <div v-if="showToast" class="fixed top-6 right-6 bg-white rounded-[12px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-100 p-4 w-full sm:w-80 z-50 flex items-start gap-3 border-l-4 border-l-[#165A31]">
      <div class="text-[#165A31] font-bold mt-0.5">✓</div>
      <div>
        <h4 class="text-[12px] font-bold text-gray-900 mb-1">Success</h4>
        <p class="text-[11px] text-gray-500 leading-snug">Landed cost allocation saved and unit costs have been updated.</p>
      </div>
    </div>

    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Procurement / <span class="font-bold text-gray-800">Landed Cost</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Landed Cost</h1>
        <p class="text-sm text-gray-500 mt-1">Allocate freight, duties and other procurement charges to received units.</p>
      </div>
    </div>

    <template v-if="!isSaved">
      <!-- Title Card -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <h2 class="text-[22px] font-bold text-gray-900">Landed Cost &middot; GR-991</h2>
        <p class="text-[11px] text-gray-500 mt-1 font-medium">PO-2048 &middot; 16 received units</p>
      </div>
      <div>
        <button class="px-4 py-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          Save Draft
        </button>
      </div>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- Cost Components -->
      <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-4">Cost Components</h3>
        <div class="w-full overflow-x-auto"><table class="w-full text-left">
          <thead>
            <tr class="text-[10px] font-bold text-gray-400">
              <th class="py-2 font-medium">Component</th>
              <th class="py-2 font-medium">Amount</th>
              <th class="py-2 font-medium">Source</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr v-for="(item, index) in costComponents" :key="index" class="border-b border-gray-50 last:border-0">
              <td class="py-3 font-semibold text-gray-900">{{ item.component }}</td>
              <td class="py-3 text-gray-600 font-medium">{{ item.amount }}</td>
              <td class="py-3 text-gray-600 font-medium">{{ item.source }}</td>
            </tr>
          </tbody>
        </table></div>
      </div>

      <!-- Allocation Rule -->
      <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 flex flex-col">
        <h3 class="text-[14px] font-bold text-gray-900 mb-4">Allocation Rule</h3>
        
        <div class="mb-6">
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Method</label>
          <select class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white text-gray-900 appearance-none">
            <option>By Base Cost</option>
            <option>By Quantity</option>
            <option>Manual</option>
          </select>
        </div>

        <div class="space-y-3 mt-auto">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 border-t border-gray-100 pt-4">
            <span class="text-[11px] text-gray-500 font-medium">Total Added Cost</span>
            <span class="text-[12px] font-bold text-gray-900">316K</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            <span class="text-[11px] text-gray-500 font-medium">Total Landed Cost</span>
            <span class="text-[12px] font-bold text-gray-900">2.966M</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Allocated Unit Cost -->
    <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="p-6 border-b border-gray-100">
        <h3 class="text-[14px] font-bold text-gray-900">Allocated Unit Cost</h3>
      </div>
      <div class="overflow-x-auto p-6 pt-0">
        <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse mt-4">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
              <th class="px-5 py-3 rounded-tl-lg">Product</th>
              <th class="px-5 py-3">Qty</th>
              <th class="px-5 py-3">Base / Unit</th>
              <th class="px-5 py-3">Allocated Add-on</th>
              <th class="px-5 py-3 rounded-tr-lg">Final Landed / Unit</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr v-for="(item, index) in allocatedUnits" :key="index" class="border-b border-gray-50 last:border-0">
              <td class="px-5 py-4 font-semibold text-gray-900">{{ item.product }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.qty }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.base }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.addon }}</td>
              <td class="px-5 py-4 font-bold text-gray-900">{{ item.final }}</td>
            </tr>
          </tbody>
        </table></div>
      </div>
    </div>

      <!-- Actions Footer -->
      <div class="flex items-center justify-end pt-4">
        <div class="flex flex-wrap items-center gap-3">
          <button @click="cancel" class="px-5 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            Cancel
          </button>
          <button @click="handlePost" class="px-5 py-2 text-[11px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            Post Landed Cost
          </button>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="flex flex-col items-center justify-center py-32 bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] mt-6">
        <div class="w-16 h-16 bg-[#eefcf2] rounded-[16px] flex items-center justify-center mb-6 text-[#165A31] text-3xl font-bold">✓</div>
        <h2 class="text-[24px] font-bold text-gray-900 mb-2">Saved successfully</h2>
        <p class="text-[13px] text-gray-500 mb-8">Landed cost allocation saved and unit costs have been updated.</p>
        <button @click="$router.push('/procurement/receipts/detail')" class="px-6 py-2.5 text-[12px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-sm">Continue</button>
      </div>
    </template>
  </div>
</template>
