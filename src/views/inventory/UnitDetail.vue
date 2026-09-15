<script setup>
import { ref } from 'vue'

const activeTab = ref('Overview')
const tabs = ['Overview', 'Identification', 'Cost', 'Current Location', 'Purchase Source', 'Transfer History', 'Sale & Customer', 'Warranty & Service', 'Documents', 'Full Timeline']

const costs = [
  { component: 'Base unit cost', amount: '146K' },
  { component: 'Freight allocation', amount: '8.3K' },
  { component: 'Duty allocation', amount: '5.1K' },
  { component: 'Other allocation', amount: '4.0K' },
  { component: 'Final landed cost', amount: '163.4K' }
]

const documents = [
  { name: 'Receiving Photo 1.jpg', type: 'Photo', uploaded: 'Aug 29' },
  { name: 'QC Checklist.pdf', type: 'QC', uploaded: 'Aug 29' }
]

const timeline = [
  { event: 'Moved to Available after QC', time: '15:04' },
  { event: 'Landed cost posted', time: '14:58' },
  { event: 'Receipt GR-991 posted', time: '14:32' }
]
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Inventory / Serialized Units / <span class="font-bold text-gray-800">Unit Detail — {{ activeTab }}</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Unit Detail — {{ activeTab }}</h1>
        <p class="text-sm text-gray-500 mt-1">DS11-01001 - {{ activeTab }}</p>
      </div>
    </div>

    <!-- Overview Card -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <h2 class="text-[22px] font-bold text-gray-900">DS11-01001</h2>
        <p class="text-[11px] text-gray-500 mt-1 font-medium">BRG DS11 &middot; Chassis CH-90111 &middot; Peshawar</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <span class="inline-flex items-center px-2 py-1 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">
          Available
        </span>
        <button class="px-4 py-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          Actions
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
      
      <!-- Tab Content: Overview -->
      <template v-if="activeTab === 'Overview'">
        <!-- KPI Cards -->
        <div class="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">Status</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">Available</div>
          </div>
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">Landed Cost</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">PKR 163.4K</div>
          </div>
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">Branch</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">Peshawar</div>
          </div>
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">Age</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">0 days</div>
          </div>
        </div>

        <!-- Summary Details -->
        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
          <h3 class="text-[14px] font-bold text-gray-900 mb-6">Unit Summary</h3>
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">Serial</span>
              <span class="font-bold text-gray-900">DS11-01001</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">Chassis</span>
              <span class="font-bold text-gray-900">CH-90111</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">Product</span>
              <span class="font-bold text-gray-900">BRG DS11</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">Tracking</span>
              <span class="font-bold text-gray-900">Serialized</span>
            </div>
          </div>
        </div>
      </template>

      <!-- Tab Content: Identification -->
      <div v-else-if="activeTab === 'Identification'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">Identification</h3>
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Serial</span>
            <span class="font-bold text-gray-900">DS11-01001</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Chassis</span>
            <span class="font-bold text-gray-900">CH-90111</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Variant</span>
            <span class="font-bold text-gray-900">Black</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Motor Serial</span>
            <span class="font-bold text-gray-900">MTR-44102</span>
          </div>
        </div>
      </div>

      <!-- Tab Content: Cost -->
      <div v-else-if="activeTab === 'Cost'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">Cost</h3>
        </div>
        <div class="overflow-x-auto p-6 pt-0">
          <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse mt-4">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                <th class="px-5 py-3 rounded-tl-lg">Component</th>
                <th class="px-5 py-3 rounded-tr-lg">Amount</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="(cost, i) in costs" :key="i" class="border-b border-gray-50 last:border-0">
                <td class="px-5 py-4 font-semibold text-gray-900">{{ cost.component }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ cost.amount }}</td>
              </tr>
            </tbody>
          </table></div>
        </div>
      </div>

      <!-- Tab Content: Current Location -->
      <div v-else-if="activeTab === 'Current Location'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">Current Location</h3>
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Branch</span>
            <span class="font-bold text-gray-900">Peshawar Branch</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Location</span>
            <span class="font-bold text-gray-900">Main Showroom</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Status</span>
            <span class="font-bold text-gray-900">Available</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Since</span>
            <span class="font-bold text-gray-900">Aug 29 &middot; 15:04</span>
          </div>
        </div>
      </div>

      <!-- Tab Content: Purchase Source -->
      <div v-else-if="activeTab === 'Purchase Source'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">Purchase Source</h3>
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Supplier</span>
            <span class="font-bold text-gray-900">BRG Factory</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">PO</span>
            <span class="font-bold text-gray-900">PO-2048</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Receipt</span>
            <span class="font-bold text-gray-900">GR-991</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Received</span>
            <span class="font-bold text-gray-900">Aug 29</span>
          </div>
        </div>
      </div>

      <!-- Tab Content: Transfer History -->
      <div v-else-if="activeTab === 'Transfer History'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">Transfer History</h3>
        <p class="text-[11px] font-bold text-gray-900">No branch transfers yet.</p>
      </div>

      <!-- Tab Content: Sale & Customer -->
      <div v-else-if="activeTab === 'Sale & Customer'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">Sale & Customer</h3>
        <p class="text-[11px] font-bold text-gray-900">Unit is unsold and not assigned to a customer.</p>
      </div>

      <!-- Tab Content: Warranty & Service -->
      <div v-else-if="activeTab === 'Warranty & Service'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">Warranty & Service</h3>
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Warranty Start</span>
            <span class="font-bold text-gray-900">Starts on sale/handover</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Service Cases</span>
            <span class="font-bold text-gray-900">0</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Warranty Cases</span>
            <span class="font-bold text-gray-900">0</span>
          </div>
        </div>
      </div>

      <!-- Tab Content: Documents -->
      <div v-else-if="activeTab === 'Documents'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">Unit Documents</h3>
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

      <!-- Tab Content: Full Timeline -->
      <div v-else-if="activeTab === 'Full Timeline'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">Unit Timeline</h3>
        <div class="space-y-4">
          <div v-for="(item, i) in timeline" :key="i" class="flex items-start gap-3">
            <div class="mt-1 w-1 h-3 rounded-full bg-[#165A31]"></div>
            <div class="flex-1 flex justify-between">
              <span class="text-[11px] font-bold text-gray-900">{{ item.event }}</span>
              <span class="text-[11px] font-medium text-gray-500">{{ item.time }}</span>
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
