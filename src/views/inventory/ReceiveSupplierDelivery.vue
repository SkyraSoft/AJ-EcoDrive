<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { store } from '../../store.js'

const router = useRouter()
const route = useRoute()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const inboundId = computed(() => route.query.id || 'INB-091')

const form = ref({
  inbound: inboundId.value,
  poReference: inboundId.value === 'INB-088' ? 'PO-181' : 'PO-188',
  expectedProducts: inboundId.value === 'INB-088' ? 'BRG M3 × 2' : 'BRG E9 Pro × 2',
  receivingLocation: 'Warehouse A',
  serializedUnits: '2 expected / 2 scanned',
  condition: 'Good',
  photos: inboundId.value === 'INB-088' ? '1 attached' : '2 attached',
  discrepancy: 'None'
})

const postReceipt = () => {
  router.push('/inventory/inbound-deliveries')
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[11px] text-gray-400 mb-1">
          Branch Manager / Inbound Deliveries / <span class="font-medium text-gray-600">Receive Supplier Delivery</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Receive Supplier Delivery</h1>
        <p class="text-xs text-gray-500 mt-1">Verify approved inbound document, serialized units, inspection and discrepancies.</p>
      </div>
      <button 
        @click="postReceipt" 
        class="bg-[#165A31] text-white text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer"
      >
        Post Receipt
      </button>
    </div>

    <!-- 2 Column Form Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Left Card: Approved Inbound -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
        <h3 class="text-sm font-bold text-gray-900 mb-2">Approved Inbound</h3>
        
        <div>
          <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Inbound</label>
          <input 
            v-model="form.inbound"
            type="text" 
            class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
          />
        </div>

        <div>
          <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">PO Reference</label>
          <input 
            v-model="form.poReference"
            type="text" 
            class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
          />
        </div>

        <div>
          <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Expected Products</label>
          <input 
            v-model="form.expectedProducts"
            type="text" 
            class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
          />
        </div>

        <div>
          <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Receiving Location</label>
          <input 
            v-model="form.receivingLocation"
            type="text" 
            class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
          />
        </div>
      </div>

      <!-- Right Card: Inspection -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
        <h3 class="text-sm font-bold text-gray-900 mb-2">Inspection</h3>
        
        <div>
          <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Serialized Units</label>
          <input 
            v-model="form.serializedUnits"
            type="text" 
            class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
          />
        </div>

        <div>
          <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Condition</label>
          <input 
            v-model="form.condition"
            type="text" 
            class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
          />
        </div>

        <div>
          <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Photos</label>
          <input 
            v-model="form.photos"
            type="text" 
            class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
          />
        </div>

        <div>
          <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Discrepancy</label>
          <input 
            v-model="form.discrepancy"
            type="text" 
            class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
          />
        </div>
      </div>
    </div>

    <!-- Bottom Banner -->
    <div class="bg-[#f0fdf4] border border-[#dcfce7] rounded-xl px-5 py-3.5 text-xs text-gray-700">
      Supplier purchasing terms and global procurement administration remain outside the Branch Manager role.
    </div>
  </div>
</template>
