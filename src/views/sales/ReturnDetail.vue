<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDown } from 'lucide-vue-next'
import { store } from '@/store'
import CreateReturnModal from './CreateReturn.vue'

const router = useRouter()
const showEditModal = ref(false)

const tabs = ['Request', 'Original Sale', 'Unit', 'Inspection', 'Decision', 'Refund or Exchange', 'Stock Disposition', 'Documents', 'Activity']
const activeTab = ref('Request')

const inspectionItems = [
  { check: 'Battery health', result: 'Fail', finding: 'Capacity 61%' },
  { check: 'Motor', result: 'Pass', finding: 'Normal' },
  { check: 'Controller', result: 'Pass', finding: 'Normal' },
  { check: 'Cosmetic', result: 'Pass', finding: 'Good' }
]

const handleEdit = () => {
  store.originalEditReturn = {
    orderNo: 'SO-7702',
    customer: 'M. Bilal',
    unit: 'EV5-00398',
    branch: 'Lahore',
    reason: 'Performance Issue',
    notes: 'Refund if defect confirmed'
  }
  showEditModal.value = true
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Sales & CRM / Returns / <span class="font-bold text-gray-800">Return Detail — {{ activeTab }}</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900 flex items-center gap-3">
          Return Detail — {{ activeTab }}
        </h1>
        <p class="text-sm text-gray-500 mt-1">RET-311 · {{ activeTab }}</p>
      </div>
    </div>

    <!-- Status Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 rounded-xl">
      <div>
        <h2 class="text-xl font-bold text-gray-900">RET-311</h2>
        <p class="text-[12px] text-gray-500 mt-1">SO-7702 · M. Bilal · EV5-00398</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="inline-flex items-center px-2 py-1 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">Inspection</span>
        <button @click="handleEdit" class="px-4 py-2 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          Review Return
        </button>
        <button class="px-3 py-2 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center gap-1">
          More <ChevronDown class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="border-b border-gray-100">
      <div class="flex overflow-x-auto hide-scrollbar">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="activeTab = tab"
          :class="[
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-[12px] mr-8 transition-colors',
            activeTab === tab
              ? 'border-[#165A31] text-[#165A31]'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
          ]"
        >
          {{ tab }}
        </button>
      </div>
    </div>

    <!-- Tab Content Area -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      
      <!-- Request Tab -->
      <div v-if="activeTab === 'Request'" class="p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-4 border-b border-gray-50 pb-3">Return Request</h3>
        <div class="space-y-4 max-w-3xl">
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Reason</span>
            <span class="font-bold text-gray-900">Performance issue</span>
          </div>
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Requested</span>
            <span class="font-bold text-gray-900">Aug 27</span>
          </div>
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Customer Request</span>
            <span class="font-bold text-gray-900">Refund if defect confirmed</span>
          </div>
        </div>
      </div>

      <!-- Original Sale Tab -->
      <div v-if="activeTab === 'Original Sale'" class="p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-4 border-b border-gray-50 pb-3">Original Sale</h3>
        <div class="space-y-4 max-w-3xl">
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Order</span>
            <span class="font-bold text-gray-900">SO-7702</span>
          </div>
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Sale Price</span>
            <span class="font-bold text-gray-900">PKR 208K</span>
          </div>
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Sold</span>
            <span class="font-bold text-gray-900">Aug 12</span>
          </div>
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Branch</span>
            <span class="font-bold text-gray-900">Lahore</span>
          </div>
        </div>
      </div>

      <!-- Unit Tab -->
      <div v-if="activeTab === 'Unit'" class="p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-4 border-b border-gray-50 pb-3">Unit</h3>
        <div class="space-y-4 max-w-3xl">
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Serial</span>
            <span class="font-bold text-gray-900">EV5-00398</span>
          </div>
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Chassis</span>
            <span class="font-bold text-gray-900">CH-80192</span>
          </div>
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Landed Cost</span>
            <span class="font-bold text-gray-900">PKR 167K</span>
          </div>
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Warranty</span>
            <span class="font-bold text-gray-900">Active</span>
          </div>
        </div>
      </div>

      <!-- Inspection Tab -->
      <div v-if="activeTab === 'Inspection'" class="p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-4 border-b border-gray-50 pb-3">Inspection</h3>
        <table class="w-full text-left">
          <thead>
            <tr class="border-b border-gray-100 text-[10px] font-bold text-gray-400">
              <th class="py-3">Check</th>
              <th class="py-3">Result</th>
              <th class="py-3">Finding</th>
            </tr>
          </thead>
          <tbody class="text-[12px]">
            <tr v-for="item in inspectionItems" :key="item.check" class="border-b border-gray-50">
              <td class="py-4 text-gray-600">{{ item.check }}</td>
              <td class="py-4 text-gray-900 font-bold">{{ item.result }}</td>
              <td class="py-4 text-gray-600">{{ item.finding }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Decision Tab -->
      <div v-if="activeTab === 'Decision'" class="p-6">
        <div class="flex items-center justify-between border-b border-gray-50 pb-3 mb-4">
          <h3 class="text-[14px] font-bold text-gray-900">Decision</h3>
          <div class="flex items-center gap-3">
            <button class="px-4 py-2 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              Repair Under Warranty
            </button>
            <button class="px-4 py-2 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              Exchange
            </button>
            <button class="px-4 py-2 text-[11px] font-bold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              Reject
            </button>
            <button class="px-4 py-2 text-[11px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              Approve Refund
            </button>
          </div>
        </div>
        <div class="h-32 flex items-center justify-center text-gray-400 text-sm">
          No decision recorded yet.
        </div>
      </div>

      <!-- Refund or Exchange Tab -->
      <div v-if="activeTab === 'Refund or Exchange'" class="p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-4 border-b border-gray-50 pb-3">Refund / Exchange</h3>
        <div class="space-y-4 max-w-3xl">
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Refund Basis</span>
            <span class="font-bold text-gray-900">Original selling price</span>
          </div>
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Proposed Refund</span>
            <span class="font-bold text-gray-900">PKR 208K</span>
          </div>
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Payment Method</span>
            <span class="font-bold text-gray-900">Original method</span>
          </div>
        </div>
      </div>

      <!-- Stock Disposition Tab -->
      <div v-if="activeTab === 'Stock Disposition'" class="p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-4 border-b border-gray-50 pb-3">Stock Disposition</h3>
        <div class="space-y-4 max-w-3xl">
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Current Status</span>
            <span class="font-bold text-gray-900">Returned / Inspection</span>
          </div>
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Proposed</span>
            <span class="font-bold text-gray-900">In Service</span>
          </div>
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">After Repair</span>
            <span class="font-bold text-gray-900">QC &rarr; Available or Warranty replacement stock</span>
          </div>
        </div>
      </div>

      <!-- Documents Tab -->
      <div v-if="activeTab === 'Documents'" class="p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-4 border-b border-gray-50 pb-3">Documents</h3>
        <table class="w-full text-left">
          <thead>
            <tr class="border-b border-gray-100 text-[10px] font-bold text-gray-400">
              <th class="py-3">Document</th>
              <th class="py-3">Type</th>
              <th class="py-3">Uploaded</th>
            </tr>
          </thead>
          <tbody class="text-[12px]">
            <tr class="border-b border-gray-50">
              <td class="py-4 text-gray-600">Inspection_Report.pdf</td>
              <td class="py-4 text-gray-600">Inspection</td>
              <td class="py-4 text-gray-600">Aug 27</td>
            </tr>
            <tr class="border-b border-gray-50">
              <td class="py-4 text-gray-600">Customer_Request.pdf</td>
              <td class="py-4 text-gray-600">Customer</td>
              <td class="py-4 text-gray-600">Aug 27</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Activity Tab -->
      <div v-if="activeTab === 'Activity'" class="p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-4 border-b border-gray-50 pb-3">Activity</h3>
        <div class="space-y-4 relative pl-4 mt-4">
          <div class="absolute top-2 bottom-2 left-0 w-[2px] bg-gray-100"></div>
          
          <div class="relative flex items-center justify-between">
            <div class="absolute -left-4 w-[2px] h-full bg-[#eefcf2]"></div>
            <span class="text-[12px] font-bold text-gray-900 pl-4">Inspection started</span>
            <span class="text-[11px] text-gray-500">14:18</span>
          </div>
          
          <div class="relative flex items-center justify-between">
            <div class="absolute -left-4 w-[2px] h-full bg-[#eefcf2]"></div>
            <span class="text-[12px] font-bold text-gray-900 pl-4">Return request received</span>
            <span class="text-[11px] text-gray-500">11:42</span>
          </div>
        </div>
      </div>
      
    </div>
    
    <CreateReturnModal v-if="showEditModal" @close="showEditModal = false" />
  </div>
</template>
