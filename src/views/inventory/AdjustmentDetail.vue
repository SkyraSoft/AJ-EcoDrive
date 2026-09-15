<script setup>
import { ref } from 'vue'

const activeTab = ref('Adjustment')
const showApproveModal = ref(false)
const showRejectModal = ref(false)
const tabs = ['Adjustment', 'Reason', 'Before & After', 'Approval', 'Documents', 'Activity']

const beforeAfter = [
  { field: 'Inventory Status', before: 'QC Hold', after: 'Damaged / Quarantine' },
  { field: 'Location', before: 'QC Area', after: 'Quarantine Bay' },
  { field: 'Sellable', before: 'No', after: 'No' }
]

const documents = [
  { name: 'Damage_Photo_1.jpg', type: 'Photo', uploaded: 'Aug 29' },
  { name: 'QC_Report.pdf', type: 'QC', uploaded: 'Aug 29' }
]

const activityLog = [
  { event: 'Adjustment submitted', time: 'Aug 29 16:05' },
  { event: 'QC finding attached', time: 'Aug 29 15:58' }
]
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Inventory / Adjustments / <span class="font-bold text-gray-800">Adjustment Detail — {{ activeTab }}</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Adjustment Detail — {{ activeTab }}</h1>
        <p class="text-sm text-gray-500 mt-1">ADJ-221 - {{ activeTab }}</p>
      </div>
    </div>

    <!-- Overview Card -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <h2 class="text-[22px] font-bold text-gray-900">ADJ-221</h2>
        <p class="text-[11px] text-gray-500 mt-1 font-medium">Peshawar &middot; EV5-00441</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <span class="inline-flex items-center px-2 py-1 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">
          Pending
        </span>
        <button class="px-4 py-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          Review Adjustment
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
      
      <!-- Adjustment Tab -->
      <template v-if="activeTab === 'Adjustment'">
        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
          <h3 class="text-[14px] font-bold text-gray-900 mb-6">Adjustment</h3>
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">Unit</span>
              <span class="font-bold text-gray-900">EV5-00441</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">Requested Change</span>
              <span class="font-bold text-gray-900">QC Hold &rarr; Damaged / Quarantine</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">Quantity Effect</span>
              <span class="font-bold text-gray-900">0</span>
            </div>
          </div>
        </div>
      </template>

      <!-- Reason Tab -->
      <div v-else-if="activeTab === 'Reason'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">Reason</h3>
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Reason Code</span>
            <span class="font-bold text-gray-900">Transit cosmetic damage</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
            <span class="text-gray-500 font-medium">Notes</span>
            <span class="font-bold text-gray-900">Scratch exceeds retail acceptance threshold.</span>
          </div>
        </div>
      </div>

      <!-- Before & After Tab -->
      <div v-else-if="activeTab === 'Before & After'" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h3 class="text-[14px] font-bold text-gray-900">Before &amp; After</h3>
        </div>
        <div class="overflow-x-auto p-6 pt-0">
          <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse mt-4">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                <th class="px-5 py-3 rounded-tl-lg">Field</th>
                <th class="px-5 py-3">Before</th>
                <th class="px-5 py-3 rounded-tr-lg">After</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="item in beforeAfter" :key="item.field" class="border-b border-gray-50 last:border-0">
                <td class="px-5 py-4 font-semibold text-gray-900">{{ item.field }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.before }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.after }}</td>
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
          <span class="text-[11px] font-bold text-gray-900">Awaiting Super Admin decision.</span>
        </div>
        
        <div class="flex items-center justify-end gap-3 pt-2">
          <button @click="showRejectModal = true" class="px-4 py-2 text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors shadow-sm">
            Reject
          </button>
          <button @click="showApproveModal = true" class="px-4 py-2 text-[11px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#114a28] transition-colors shadow-sm">
            Approve Adjustment
          </button>
        </div>
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

    <!-- Approve Modal -->
    <div v-if="showApproveModal" class="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <div class="bg-white rounded-[16px] shadow-xl w-full max-w-md p-6 relative">
        <div class="w-10 h-10 rounded-full bg-[#eefcf2] text-[#165A31] flex items-center justify-center mb-4">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="text-[18px] font-bold text-gray-900 mb-2">Approve stock adjustment?</h3>
        <p class="text-[12px] text-gray-500 mb-8 leading-relaxed">
          Adjustment ADJ-018 changes BRC E9 Pro stock from 12 to 11 units. Reason: physical count variance.
        </p>
        <div class="flex items-center justify-end gap-3">
          <button @click="showApproveModal = false" class="px-4 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button @click="showApproveModal = false" class="px-4 py-2 text-[11px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#114a28] transition-colors shadow-sm">
            Approve adjustment
          </button>
        </div>
      </div>
    </div>

    <!-- Reject Modal -->
    <div v-if="showRejectModal" class="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <div class="bg-white rounded-[16px] shadow-xl w-full max-w-md p-6 relative">
        <div class="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4">
          <span class="text-xl font-bold font-serif">!</span>
        </div>
        <h3 class="text-[18px] font-bold text-gray-900 mb-2">Reject stock adjustment?</h3>
        <p class="text-[12px] text-gray-500 mb-8 leading-relaxed">
          Return ADJ-018 to the branch with a required rejection reason.
        </p>
        <div class="flex items-center justify-end gap-3">
          <button @click="showRejectModal = false" class="px-4 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button @click="showRejectModal = false" class="px-4 py-2 text-[11px] font-bold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors shadow-sm">
            Reject adjustment
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
