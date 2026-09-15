<script setup>
import { ref } from 'vue'

const activeTab = ref('Summary')
const tabs = ['Summary', 'Received Lines', 'Serial & Chassis Units', 'Discrepancies', 'QC', 'Costs', 'Documents', 'Activity']

const receivedLines = [
  { product: 'BRG DS11', expected: '8', received: '8', short: '0', excess: '0', status: 'Complete' },
  { product: 'BRG EV-5', expected: '5', received: '5', short: '0', excess: '0', status: 'Complete' },
  { product: 'Cargo Pro', expected: '3', received: '3', short: '0', excess: '0', status: 'Complete' }
]

const serialUnits = [
  { product: 'BRG DS11', serial: 'DS11-01001', chassis: 'CH-90111', condition: 'Good', status: 'Available' },
  { product: 'BRG EV-5', serial: 'EVS-00441', chassis: 'CH-81104', condition: 'Scratch', status: 'QC Hold' }
]

const qcRecords = [
  { serial: 'DS11-01001', check: 'Visual + functional', finding: 'Pass', decision: 'Available', inspector: 'Ahsan Khan' },
  { serial: 'EVS-00441', check: 'Visual', finding: 'Minor scratch', decision: 'QC Hold', inspector: 'Ahsan Khan' }
]

const documents = [
  { name: 'Delivery_Note.pdf', type: 'Supplier', uploaded: 'Aug 29' },
  { name: 'Receiving_Photos.zip', type: 'Photos', uploaded: 'Aug 29' }
]

const activities = [
  { text: 'Receipt posted', date: 'Aug 29' },
  { text: 'QC completed', date: 'Aug 29' },
  { text: 'Draft receipt saved', date: 'Aug 28' }
]
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Procurement / Receipts / <span class="font-bold text-gray-800">Receipt Detail — {{ activeTab }}</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Receipt Detail — {{ activeTab }}</h1>
        <p class="text-sm text-gray-500 mt-1">GR-991 - {{ activeTab }}</p>
      </div>
    </div>

    <!-- PO Overview Card -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <h2 class="text-[22px] font-bold text-gray-900">GR-991</h2>
        <p class="text-[11px] text-gray-500 mt-1 font-medium">PO-2048 &middot; Peshawar Branch</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <span class="inline-flex items-center px-2 py-1 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">
          Posted
        </span>
        <button class="px-4 py-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          Open PO
        </button>
        <button class="px-3 py-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center gap-1">
          More <span class="text-[8px]">▼</span>
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex items-center gap-6 border-b border-gray-100 overflow-x-auto pb-[1px]">
      <button 
        v-for="tab in tabs" 
        :key="tab"
        @click="activeTab = tab"
        class="pb-3 text-[11px] font-bold tracking-wider relative transition-colors whitespace-nowrap"
        :class="activeTab === tab ? 'text-[#165A31]' : 'text-gray-400 hover:text-gray-600'"
      >
        {{ tab }}
        <div v-if="activeTab === tab" class="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#165A31] rounded-t-full"></div>
      </button>
    </div>

    <!-- Tab Content -->
    <div class="space-y-6">
      
      <!-- Tab Content: Summary -->
      <template v-if="activeTab === 'Summary'">
        <!-- KPI Cards -->
        <div class="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">Received Units</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">16</div>
          </div>
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">QC Pass</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">15</div>
          </div>
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">QC Hold</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">1</div>
          </div>
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">Discrepancies</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">0</div>
          </div>
        </div>

        <!-- Summary Details -->
        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
          <h3 class="text-[14px] font-bold text-gray-900 mb-6">Receipt Summary</h3>
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">PO</span>
              <span class="font-bold text-gray-900">PO-2048</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">Supplier</span>
              <span class="font-bold text-gray-900">BRG Factory</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">Receiver</span>
              <span class="font-bold text-gray-900">Ahsan Khan</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">Posted</span>
              <span class="font-bold text-gray-900">Aug 29 - 14:32</span>
            </div>
          </div>
        </div>
      </template>

      <!-- Tab Content: Received Lines -->
      <div v-else-if="activeTab === 'Received Lines'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">Received Lines</h3>
        </div>
        <div class="overflow-x-auto p-6 pt-0">
          <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse mt-4">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                <th class="px-5 py-3 rounded-tl-lg">Product</th>
                <th class="px-5 py-3">Expected</th>
                <th class="px-5 py-3">Received</th>
                <th class="px-5 py-3">Short</th>
                <th class="px-5 py-3">Excess</th>
                <th class="px-5 py-3 rounded-tr-lg">Status</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="(line, i) in receivedLines" :key="i" class="border-b border-gray-50 last:border-0">
                <td class="px-5 py-4 font-semibold text-gray-900">{{ line.product }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ line.expected }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ line.received }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ line.short }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ line.excess }}</td>
                <td class="px-5 py-4">
                  <span v-if="line.status === 'Complete'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">Complete</span>
                </td>
              </tr>
            </tbody>
          </table></div>
        </div>
      </div>

      <!-- Tab Content: Serial & Chassis Units -->
      <div v-else-if="activeTab === 'Serial & Chassis Units'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">Units</h3>
        </div>
        <div class="overflow-x-auto p-6 pt-0">
          <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse mt-4">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                <th class="px-5 py-3 rounded-tl-lg">Product</th>
                <th class="px-5 py-3">Serial</th>
                <th class="px-5 py-3">Chassis</th>
                <th class="px-5 py-3">Condition</th>
                <th class="px-5 py-3 rounded-tr-lg">Inventory Status</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="(unit, i) in serialUnits" :key="i" class="border-b border-gray-50 last:border-0">
                <td class="px-5 py-4 font-semibold text-gray-900">{{ unit.product }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ unit.serial }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ unit.chassis }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ unit.condition }}</td>
                <td class="px-5 py-4">
                  <span v-if="unit.status === 'Available'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">Available</span>
                  <span v-else-if="unit.status === 'QC Hold'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-amber-50 text-amber-600">QC Hold</span>
                </td>
              </tr>
            </tbody>
          </table></div>
        </div>
      </div>

      <!-- Tab Content: Discrepancies -->
      <div v-else-if="activeTab === 'Discrepancies'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">Discrepancies</h3>
        <div class="flex flex-wrap items-center gap-4 bg-[#fbfbfc] p-4 rounded-lg border border-gray-100">
          <span class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">None</span>
          <span class="text-[11px] font-bold text-gray-900">No quantity discrepancies on this receipt.</span>
        </div>
      </div>

      <!-- Tab Content: QC -->
      <div v-else-if="activeTab === 'QC'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">Quality Control</h3>
        </div>
        <div class="overflow-x-auto p-6 pt-0">
          <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse mt-4">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                <th class="px-5 py-3 rounded-tl-lg">Serial</th>
                <th class="px-5 py-3">Check</th>
                <th class="px-5 py-3">Finding</th>
                <th class="px-5 py-3">Decision</th>
                <th class="px-5 py-3 rounded-tr-lg">Inspector</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="(qc, i) in qcRecords" :key="i" class="border-b border-gray-50 last:border-0">
                <td class="px-5 py-4 font-semibold text-gray-900">{{ qc.serial }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ qc.check }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ qc.finding }}</td>
                <td class="px-5 py-4">
                  <span v-if="qc.decision === 'Available'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">Available</span>
                  <span v-else-if="qc.decision === 'QC Hold'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-amber-50 text-amber-600">QC Hold</span>
                </td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ qc.inspector }}</td>
              </tr>
            </tbody>
          </table></div>
        </div>
      </div>

      <!-- Tab Content: Costs -->
      <div v-else-if="activeTab === 'Costs'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">Receipt Costs</h3>
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Base Product Cost</span>
            <span class="font-bold text-gray-900">PKR 2.65M</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Landed Cost Allocation</span>
            <span class="font-bold text-gray-900">Pending</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Next Step</span>
            <button @click="$router.push('/procurement/landed-costs')" class="font-bold text-gray-900 hover:text-[#165A31] transition-colors">Open Landed Cost &rarr;</button>
          </div>
        </div>
      </div>

      <!-- Tab Content: Documents -->
      <div v-else-if="activeTab === 'Documents'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">Receipt Documents</h3>
        </div>
        <div class="overflow-x-auto p-6 pt-0">
          <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse mt-4">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                <th class="px-5 py-3 rounded-tl-lg">Document</th>
                <th class="px-5 py-3">Type</th>
                <th class="px-5 py-3 rounded-tr-lg">Uploaded</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="doc in documents" :key="doc.name" class="border-b border-gray-50 last:border-0">
                <td class="px-5 py-4 font-semibold text-gray-900">{{ doc.name }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ doc.type }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ doc.uploaded }}</td>
              </tr>
            </tbody>
          </table></div>
        </div>
      </div>

      <!-- Tab Content: Activity -->
      <div v-else-if="activeTab === 'Activity'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">Receipt Activity</h3>
        </div>
        <div class="p-6 space-y-4">
          <div v-for="(activity, i) in activities" :key="i" class="flex items-start gap-3">
            <div class="mt-1 w-1 h-3 rounded-full bg-[#165A31]"></div>
            <div class="flex-1 flex justify-between">
              <span class="text-[11px] font-bold text-gray-900">{{ activity.text }}</span>
              <span class="text-[11px] font-medium text-gray-500">{{ activity.date }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Placeholder for other tabs -->
      <div v-else class="p-12 text-center text-gray-400 text-[11px]">
        Content for {{ activeTab }} tab will be implemented here.
      </div>

    </div>
  </div>
</template>
