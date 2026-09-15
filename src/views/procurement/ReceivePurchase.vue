<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showDiscrepancyModal = ref(false)

const expectedActual = [
  { product: 'BRG DS11', expected: '8', actual: '8', short: '0', excess: '0' },
  { product: 'BRG EV-5', expected: '5', actual: '5', short: '0', excess: '0' },
  { product: 'Cargo Pro', expected: '3', actual: '3', short: '0', excess: '0' }
]

const serializedUnits = [
  { product: 'BRG DS11', serial: 'DS11-01001', chassis: 'CH-90111', condition: 'Good', qc: 'Pass' },
  { product: 'BRG DS11', serial: 'DS11-01002', chassis: 'CH-90112', condition: 'Good', qc: 'Pass' },
  { product: 'BRG EV-5', serial: 'EVS-00441', chassis: 'CH-81104', condition: 'Scratch', qc: 'QC Hold' }
]

const cancel = () => {
  router.push('/procurement/purchase-orders')
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Procurement / Purchase Orders / <span class="font-bold text-gray-800">Receive Purchase</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Receive Purchase</h1>
        <p class="text-sm text-gray-500 mt-1">Record the physical supplier receipt, serialized units, discrepancies and QC.</p>
      </div>
    </div>

    <!-- PO Overview Card -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <h2 class="text-[22px] font-bold text-gray-900">Receive Purchase &middot; PO-2048</h2>
        <p class="text-[11px] text-gray-500 mt-1 font-medium">BRG Factory &rarr; Peshawar Branch</p>
      </div>
      <div>
        <button class="px-4 py-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          Save Draft
        </button>
      </div>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- Receiving Summary -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-[14px] font-bold text-gray-900 mb-4">Receiving Summary</h3>
        
        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Receiving Location</label>
          <input type="text" value="Peshawar - Main Showroom" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
        </div>
        
        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Receiver</label>
          <input type="text" value="Ahsan Khan" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Receipt Date</label>
          <input type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
        </div>
      </div>

      <!-- Expected vs Actual -->
      <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
        <div class="p-6 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">Expected vs Actual</h3>
        </div>
        <div class="overflow-x-auto flex-1 p-6 pt-0">
          <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse mt-4">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                <th class="px-5 py-3 rounded-tl-lg">Product</th>
                <th class="px-5 py-3">Expected</th>
                <th class="px-5 py-3">Actual</th>
                <th class="px-5 py-3">Short</th>
                <th class="px-5 py-3 rounded-tr-lg">Excess</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="(item, index) in expectedActual" :key="index" class="border-b border-gray-50 last:border-0">
                <td class="px-5 py-4 font-semibold text-gray-900">{{ item.product }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.expected }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.actual }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.short }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.excess }}</td>
              </tr>
            </tbody>
          </table></div>
        </div>
      </div>

    </div>

    <!-- Serialized Unit Capture -->
    <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="p-6 border-b border-gray-100">
        <h3 class="text-[14px] font-bold text-gray-900">Serialized Unit Capture</h3>
      </div>
      <div class="overflow-x-auto p-6 pt-0">
        <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse mt-4">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
              <th class="px-5 py-3 rounded-tl-lg">Product</th>
              <th class="px-5 py-3">Serial</th>
              <th class="px-5 py-3">Chassis</th>
              <th class="px-5 py-3">Condition</th>
              <th class="px-5 py-3 rounded-tr-lg">QC</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr v-for="(unit, index) in serializedUnits" :key="index" class="border-b border-gray-50 last:border-0">
              <td class="px-5 py-4 font-semibold text-gray-900">{{ unit.product }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ unit.serial }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ unit.chassis }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ unit.condition }}</td>
              <td class="px-5 py-4">
                <span v-if="unit.qc === 'Pass'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">Pass</span>
                <span v-else-if="unit.qc === 'QC Hold'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-amber-50 text-amber-600">QC Hold</span>
                <span v-else class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-gray-100 text-gray-600">{{ unit.qc }}</span>
              </td>
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
        <button class="px-5 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          Save Draft
        </button>
        <button @click="showDiscrepancyModal = true" class="px-5 py-2 text-[11px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          Post Receipt
        </button>
      </div>
    </div>

    <!-- Discrepancy Modal -->
    <div v-if="showDiscrepancyModal" class="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-[16px] shadow-xl w-full max-w-[400px] p-6 relative">
        <div class="w-10 h-10 bg-red-50 rounded-[10px] flex items-center justify-center mb-5 text-red-500 text-lg font-bold">!</div>
        <h3 class="text-[18px] font-bold text-gray-900 mb-2">Resolve receipt discrepancy</h3>
        <p class="text-[12px] text-gray-500 mb-8">Expected 12 units; 11 scanned. Keep the receipt in discrepancy review until the missing unit is resolved.</p>
        <div class="flex items-center justify-end gap-3">
          <button @click="showDiscrepancyModal = false" class="px-5 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
          <button @click="$router.push('/procurement/receipts/detail')" class="px-5 py-2 text-[11px] font-bold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors">Keep in review</button>
        </div>
      </div>
    </div>
  </div>
</template>
