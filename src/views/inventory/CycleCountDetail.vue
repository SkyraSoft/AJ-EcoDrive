<script setup>
import { ref } from 'vue'

const activeTab = ref('Count Summary')
const tabs = ['Count Summary', 'Expected Stock', 'Physical Count', 'Discrepancies', 'Adjustment Proposal', 'Approval', 'Activity']

const expectedStock = [
  { product: 'BRG DS11', expected: '36' },
  { product: 'BRG EV-5', expected: '13' },
  { product: 'Cargo Pro', expected: '23' },
  { product: 'Other', expected: '46' }
]

const physicalCount = [
  { product: 'BRG DS11', system: '36', physical: '35', variance: '-1' },
  { product: 'BRG EV-5', system: '13', physical: '14', variance: '+1' },
  { product: 'Cargo Pro', system: '23', physical: '23', variance: '0' }
]

const discrepancies = [
  { product: 'BRG DS11', variance: '-1', investigation: 'Unit found in service bay', status: 'Resolved' },
  { product: 'BRG EV-5', variance: '+1', investigation: 'Receipt serial not posted', status: 'Open' }
]

const adjustmentProposals = [
  { product: 'BRG EV-5', change: '+1 unit', reason: 'Receipt posting correction' }
]

const activityLog = [
  { event: 'Count completed', time: '12:42' },
  { event: '2 discrepancies detected', time: '12:41' },
  { event: 'Count started', time: '09:00' }
]
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Inventory / Cycle Counts / <span class="font-bold text-gray-800">Cycle Count Detail — {{ activeTab }}</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Cycle Count Detail — {{ activeTab }}</h1>
        <p class="text-sm text-gray-500 mt-1">CC-091 - {{ activeTab }}</p>
      </div>
    </div>

    <!-- Overview Card -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <h2 class="text-[22px] font-bold text-gray-900">CC-091</h2>
        <p class="text-[11px] text-gray-500 mt-1 font-medium">Peshawar &middot; Main Showroom</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <span class="inline-flex items-center px-2 py-1 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">
          Review
        </span>
        <button class="px-4 py-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          Review Count
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
      
      <!-- Count Summary Tab -->
      <template v-if="activeTab === 'Count Summary'">
        <!-- KPI Cards -->
        <div class="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">Expected Units</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">118</div>
          </div>
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">Counted</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">118</div>
          </div>
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">Matched</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">116</div>
          </div>
          <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div class="text-[11px] font-semibold text-gray-400 mb-2">Discrepancy Lines</div>
            <div class="text-[22px] font-bold text-gray-900 leading-none">2</div>
          </div>
        </div>

        <!-- Scope Panel -->
        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
          <h3 class="text-[14px] font-bold text-gray-900 mb-6">Scope</h3>
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">Location</span>
              <span class="font-bold text-gray-900">Main Showroom</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">Started</span>
              <span class="font-bold text-gray-900">Aug 29 - 09:00</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">Completed</span>
              <span class="font-bold text-gray-900">Aug 29 - 12:42</span>
            </div>
          </div>
        </div>
      </template>

      <!-- Expected Stock Tab -->
      <div v-else-if="activeTab === 'Expected Stock'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">Expected Stock</h3>
        </div>
        <div class="overflow-x-auto p-6 pt-0">
          <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse mt-4">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                <th class="px-5 py-3 rounded-tl-lg">Product</th>
                <th class="px-5 py-3 rounded-tr-lg">Expected</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="item in expectedStock" :key="item.product" class="border-b border-gray-50 last:border-0">
                <td class="px-5 py-4 font-semibold text-gray-900">{{ item.product }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.expected }}</td>
              </tr>
            </tbody>
          </table></div>
        </div>
      </div>

      <!-- Physical Count Tab -->
      <div v-else-if="activeTab === 'Physical Count'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">Physical Count</h3>
        </div>
        <div class="overflow-x-auto p-6 pt-0">
          <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse mt-4">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                <th class="px-5 py-3 rounded-tl-lg">Product</th>
                <th class="px-5 py-3">System</th>
                <th class="px-5 py-3">Physical</th>
                <th class="px-5 py-3 rounded-tr-lg">Variance</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="item in physicalCount" :key="item.product" class="border-b border-gray-50 last:border-0">
                <td class="px-5 py-4 font-semibold text-gray-900">{{ item.product }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.system }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.physical }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.variance }}</td>
              </tr>
            </tbody>
          </table></div>
        </div>
      </div>

      <!-- Discrepancies Tab -->
      <div v-else-if="activeTab === 'Discrepancies'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">Discrepancies</h3>
        </div>
        <div class="overflow-x-auto p-6 pt-0">
          <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse mt-4">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                <th class="px-5 py-3 rounded-tl-lg">Product</th>
                <th class="px-5 py-3">Variance</th>
                <th class="px-5 py-3">Investigation</th>
                <th class="px-5 py-3 rounded-tr-lg">Status</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="item in discrepancies" :key="item.product" class="border-b border-gray-50 last:border-0">
                <td class="px-5 py-4 font-semibold text-gray-900">{{ item.product }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.variance }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.investigation }}</td>
                <td class="px-5 py-4 font-semibold text-gray-900">{{ item.status }}</td>
              </tr>
            </tbody>
          </table></div>
        </div>
      </div>

      <!-- Adjustment Proposal Tab -->
      <div v-else-if="activeTab === 'Adjustment Proposal'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">Adjustment Proposal</h3>
        </div>
        <div class="overflow-x-auto p-6 pt-0">
          <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse mt-4">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                <th class="px-5 py-3 rounded-tl-lg">Product</th>
                <th class="px-5 py-3">Proposed Change</th>
                <th class="px-5 py-3 rounded-tr-lg">Reason</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="item in adjustmentProposals" :key="item.product" class="border-b border-gray-50 last:border-0">
                <td class="px-5 py-4 font-semibold text-gray-900">{{ item.product }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.change }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.reason }}</td>
              </tr>
            </tbody>
          </table></div>
        </div>
      </div>

      <!-- Approval Tab -->
      <div v-else-if="activeTab === 'Approval'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">Approval</h3>
        <div class="flex flex-wrap items-center gap-3 mb-10">
          <span class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-amber-50 text-amber-600">Pending</span>
          <span class="text-[11px] font-bold text-gray-900">Adjustment proposal requires Super Admin approval.</span>
        </div>
        
        <div class="flex items-center justify-end gap-3 pt-2">
          <button class="px-4 py-2 text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors shadow-sm">
            Reject
          </button>
          <button class="px-4 py-2 text-[11px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#114a28] transition-colors shadow-sm">
            Approve &amp; Create Adjustment
          </button>
        </div>
      </div>

      <!-- Activity Tab -->
      <div v-else-if="activeTab === 'Activity'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">Activity</h3>
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
