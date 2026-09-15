<script setup>
import { ref } from 'vue'

const activeTab = ref('Summary')
const isDropdownOpen = ref(false)
const tabs = ['Summary', 'Items & Units', 'Dispatch', 'In Transit', 'Receiving', 'Discrepancies', 'Documents', 'Activity']

const items = [
  { serial: 'DS11-00971', product: 'BRG DS11', fromLocation: 'Islamabad Showroom', status: 'Transfer in Transit' },
  { serial: 'EV5-00402', product: 'BRG EV-5', fromLocation: 'Islamabad Showroom', status: 'Transfer in Transit' }
]

const documents = [
  { name: 'Transfer_Note.pdf', type: 'Transfer', uploaded: 'Aug 27' },
  { name: 'Dispatch_Photos.zip', type: 'Photos', uploaded: 'Aug 27' }
]

const activityLog = [
  { event: 'Transfer dispatched', time: '16:20' },
  { event: 'Units picked', time: '15:48' },
  { event: 'Transfer approved', time: '14:05' }
]
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Inventory / Transfers / <span class="font-bold text-gray-800">Transfer Detail — {{ activeTab }}</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Transfer Detail — {{ activeTab }}</h1>
        <p class="text-sm text-gray-500 mt-1">TR-119 - {{ activeTab }}</p>
      </div>
    </div>

    <!-- Overview Card -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <h2 class="text-[22px] font-bold text-gray-900">TR-119</h2>
        <p class="text-[11px] text-gray-500 mt-1 font-medium">Islamabad &rarr; Peshawar &middot; 4 units</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <span class="inline-flex items-center px-2 py-1 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">
          In Transit
        </span>
        <button class="px-4 py-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          Print Note
        </button>
        <div class="relative">
          <button @click="isDropdownOpen = !isDropdownOpen" class="px-3 py-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center gap-1">
            More <span class="text-[8px]">▼</span>
          </button>
          
          <div v-if="isDropdownOpen" class="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-[12px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] py-2 z-50">
            <div class="px-4 py-2 text-[9px] font-bold text-gray-400 tracking-wider">ACTIONS</div>
            <button class="w-full text-left px-4 py-2 text-[11px] font-medium text-gray-700 hover:bg-gray-50 transition-colors">Open transfer</button>
            <button class="w-full text-left px-4 py-2 text-[11px] font-medium text-gray-700 hover:bg-gray-50 transition-colors">Print dispatch note</button>
            <button class="w-full text-left px-4 py-2 text-[11px] font-medium text-gray-700 hover:bg-gray-50 transition-colors">Track in transit</button>
            <button class="w-full text-left px-4 py-2 text-[11px] font-medium text-gray-700 hover:bg-gray-50 transition-colors">Receive transfer</button>
            <button class="w-full text-left px-4 py-2 text-[11px] font-medium text-gray-700 hover:bg-gray-50 transition-colors">Report discrepancy</button>
          </div>
        </div>
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
      
      <!-- Summary Tab -->
      <template v-if="activeTab === 'Summary'">
        <!-- KPI Cards -->
        <div class="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">Units</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">4</div>
          </div>
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">From</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">Islamabad</div>
          </div>
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">To</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">Peshawar</div>
          </div>
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">ETA</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">Aug 28</div>
          </div>
        </div>

        <!-- Transfer Summary List -->
        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
          <h3 class="text-[14px] font-bold text-gray-900 mb-6">Transfer Summary</h3>
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">Requested By</span>
              <span class="font-bold text-gray-900">Super Admin</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">Approved</span>
              <span class="font-bold text-gray-900">Aug 27</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">Dispatched</span>
              <span class="font-bold text-gray-900">Aug 27 &middot; 16:20</span>
            </div>
          </div>
        </div>
      </template>

      <!-- Items & Units Tab -->
      <div v-else-if="activeTab === 'Items & Units'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">Items & Units</h3>
        </div>
        <div class="overflow-x-auto p-6 pt-0">
          <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse mt-4">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                <th class="px-5 py-3 rounded-tl-lg">Serial</th>
                <th class="px-5 py-3">Product</th>
                <th class="px-5 py-3">From Location</th>
                <th class="px-5 py-3 rounded-tr-lg">Status</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="item in items" :key="item.serial" class="border-b border-gray-50 last:border-0">
                <td class="px-5 py-4 font-semibold text-gray-900">{{ item.serial }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.product }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.fromLocation }}</td>
                <td class="px-5 py-4">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-blue-50 text-blue-600">{{ item.status }}</span>
                </td>
              </tr>
            </tbody>
          </table></div>
        </div>
      </div>

      <!-- Dispatch Tab -->
      <div v-else-if="activeTab === 'Dispatch'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">Dispatch</h3>
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Dispatcher</span>
            <span class="font-bold text-gray-900">Hassan Ali</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Carrier</span>
            <span class="font-bold text-gray-900">Internal logistics</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Dispatch Time</span>
            <span class="font-bold text-gray-900">Aug 27 &middot; 16:20</span>
          </div>
        </div>
      </div>

      <!-- In Transit Tab -->
      <div v-else-if="activeTab === 'In Transit'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">In Transit</h3>
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Current Status</span>
            <span class="font-bold text-gray-900">In transit</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">ETA</span>
            <span class="font-bold text-gray-900">Aug 28 &middot; 11:00</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Tracking Note</span>
            <span class="font-bold text-gray-900">Departed Islamabad</span>
          </div>
        </div>
      </div>

      <!-- Receiving Tab -->
      <div v-else-if="activeTab === 'Receiving'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">Receiving</h3>
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <div class="flex flex-wrap items-center gap-3">
            <span class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-orange-50 text-orange-600">Pending</span>
            <span class="text-[11px] font-bold text-gray-900">Peshawar Branch has not received this transfer yet.</span>
          </div>
          <span class="text-[11px] font-semibold text-gray-400 cursor-not-allowed">Receive Transfer &rarr;</span>
        </div>
      </div>

      <!-- Discrepancies Tab -->
      <div v-else-if="activeTab === 'Discrepancies'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">Discrepancies</h3>
        <p class="text-[11px] font-bold text-gray-900">No discrepancies recorded.</p>
      </div>

      <!-- Documents Tab -->
      <div v-else-if="activeTab === 'Documents'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">Documents</h3>
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

      <!-- Activity Tab -->
      <div v-else-if="activeTab === 'Activity'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">Transfer Activity</h3>
        <div class="space-y-4">
          <div v-for="(item, i) in activityLog" :key="i" class="flex items-start gap-3">
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
