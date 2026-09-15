<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../../store.js'
import { ChevronDown } from 'lucide-vue-next'
import CreateQuotationModal from './CreateQuotation.vue'

const router = useRouter()
const showEditModal = ref(false)
const activeTab = ref('Summary')
const tabs = ['Summary', 'Items', 'Customer', 'Pricing', 'Communication', 'Documents', 'Activity']

const editQuote = () => {
  store.originalEditQuotation = {
    branch: 'Peshawar Branch',
    customer: 'Faisal Khan',
    validUntil: '2026-09-02',
    product: 'BRG DS11',
    quantity: '1',
    sellingPrice: '185K',
    discount: '0',
    taxFees: '',
    total: '185K',
    notes: 'Quote valid while stock remains available.',
    deliveryEstimate: ''
  }
  showEditModal.value = true
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header Area -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Sales & CRM / Quotations / <span class="font-bold text-gray-800">Quotation Detail — {{ activeTab }}</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900 flex items-center gap-3">
          Quotation Detail — {{ activeTab }}
        </h1>
        <p class="text-sm text-gray-500 mt-1">QT-1108 · {{ activeTab }}</p>
      </div>
    </div>

    <!-- Status & Actions Card -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-gray-900">QT-1108</h2>
          <p class="text-[12px] text-gray-500 mt-1">Peshawar · Faisal Khan · Valid until Sep 02</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="inline-flex items-center px-2 py-1 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">Sent</span>
          <button @click="editQuote" class="px-4 py-2 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            Edit Quote
          </button>
          <button class="px-3 py-2 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center gap-1">
            More <ChevronDown class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="flex flex-wrap items-center gap-6 mt-6 border-b border-gray-100">
        <button 
          v-for="tab in tabs" 
          :key="tab"
          @click="activeTab = tab"
          class="pb-3 text-[12px] font-bold transition-colors relative"
          :class="activeTab === tab ? 'text-[#165A31]' : 'text-gray-400 hover:text-gray-600'"
        >
          {{ tab }}
          <div v-if="activeTab === tab" class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#165A31] rounded-t-full"></div>
        </button>
      </div>

      <!-- Tab Contents -->
      <div class="pt-6">
        
        <!-- Summary Tab -->
        <div v-if="activeTab === 'Summary'" class="animate-in fade-in duration-200 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="p-5 bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
              <p class="text-[11px] font-medium text-gray-500 mb-1">Quote Total</p>
              <h3 class="text-2xl font-bold text-gray-900">PKR 185K</h3>
            </div>
            <div class="p-5 bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
              <p class="text-[11px] font-medium text-gray-500 mb-1">Items</p>
              <h3 class="text-2xl font-bold text-gray-900">1</h3>
            </div>
            <div class="p-5 bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
              <p class="text-[11px] font-medium text-gray-500 mb-1">Valid Until</p>
              <h3 class="text-2xl font-bold text-gray-900">Sep 02</h3>
            </div>
            <div class="p-5 bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
              <p class="text-[11px] font-medium text-gray-500 mb-1">Status</p>
              <h3 class="text-2xl font-bold text-gray-900">Sent</h3>
            </div>
          </div>
          
          <div>
            <h3 class="text-[13px] font-bold text-gray-900 mb-3">Summary</h3>
            <div class="bg-gray-50/50 rounded-lg p-1">
              <div class="flex items-center justify-between p-3 border-b border-gray-100">
                <span class="text-[11px] font-medium text-gray-500">Branch</span>
                <span class="text-[12px] font-bold text-gray-900">Peshawar</span>
              </div>
              <div class="flex items-center justify-between p-3 border-b border-gray-100">
                <span class="text-[11px] font-medium text-gray-500">Customer</span>
                <span class="text-[12px] font-bold text-gray-900">Faisal Khan</span>
              </div>
              <div class="flex items-center justify-between p-3 border-b border-gray-100">
                <span class="text-[11px] font-medium text-gray-500">Owner</span>
                <span class="text-[12px] font-bold text-gray-900">Hamza Ali</span>
              </div>
              <div class="flex items-center justify-between p-3">
                <span class="text-[11px] font-medium text-gray-500">Created</span>
                <span class="text-[12px] font-bold text-gray-900">Aug 27</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Items Tab -->
        <div v-if="activeTab === 'Items'" class="animate-in fade-in duration-200">
          <h3 class="text-[13px] font-bold text-gray-900 mb-3">Quote Items</h3>
          <div class="border border-gray-100 rounded-xl overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                  <th class="px-5 py-3">Product</th>
                  <th class="px-5 py-3">Qty</th>
                  <th class="px-5 py-3">Unit Price</th>
                  <th class="px-5 py-3">Discount</th>
                  <th class="px-5 py-3">Line Total</th>
                </tr>
              </thead>
              <tbody class="text-[11px]">
                <tr class="border-b border-gray-50">
                  <td class="px-5 py-4 text-gray-900 font-bold">BRG DS11</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">1</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">185K</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">0</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">185K</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Customer Tab -->
        <div v-if="activeTab === 'Customer'" class="animate-in fade-in duration-200">
          <h3 class="text-[13px] font-bold text-gray-900 mb-3">Customer</h3>
          <div class="bg-gray-50/50 rounded-lg p-1">
            <div class="flex items-center justify-between p-3 border-b border-gray-100">
              <span class="text-[11px] font-medium text-gray-500">Name</span>
              <span class="text-[12px] font-bold text-gray-900">Faisal Khan</span>
            </div>
            <div class="flex items-center justify-between p-3 border-b border-gray-100">
              <span class="text-[11px] font-medium text-gray-500">Phone</span>
              <span class="text-[12px] font-bold text-gray-900">+92 300 1234567</span>
            </div>
            <div class="flex items-center justify-between p-3 border-b border-gray-100">
              <span class="text-[11px] font-medium text-gray-500">Email</span>
              <span class="text-[12px] font-bold text-gray-900">faisal@example.com</span>
            </div>
            <div class="flex items-center justify-between p-3">
              <span class="text-[11px] font-medium text-gray-500">Owned Units</span>
              <span class="text-[12px] font-bold text-gray-900">2</span>
            </div>
          </div>
        </div>

        <!-- Pricing Tab -->
        <div v-if="activeTab === 'Pricing'" class="animate-in fade-in duration-200">
          <h3 class="text-[13px] font-bold text-gray-900 mb-3">Pricing</h3>
          <div class="border border-gray-100 rounded-xl overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                  <th class="px-5 py-3">Line</th>
                  <th class="px-5 py-3">List Price</th>
                  <th class="px-5 py-3">Applied Price</th>
                  <th class="px-5 py-3">Discount</th>
                  <th class="px-5 py-3">Margin</th>
                </tr>
              </thead>
              <tbody class="text-[11px]">
                <tr class="border-b border-gray-50">
                  <td class="px-5 py-4 text-gray-900 font-bold">BRG DS11</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">185K</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">185K</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">0</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">21.1%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Communication Tab -->
        <div v-if="activeTab === 'Communication'" class="animate-in fade-in duration-200">
          <h3 class="text-[13px] font-bold text-gray-900 mb-3">Communication</h3>
          <div class="space-y-4">
            <div class="flex gap-4">
              <div class="w-32 text-[10px] font-bold text-gray-900 flex-shrink-0 pt-1">Aug 27 15:12</div>
              <div class="flex-1 text-[11px] text-gray-600">Quotation sent by WhatsApp and email.</div>
              <div class="w-32 text-[10px] text-gray-400 text-right flex-shrink-0 pt-1">Hamza Ali</div>
            </div>
            <div class="flex gap-4">
              <div class="w-32 text-[10px] font-bold text-gray-900 flex-shrink-0 pt-1">Aug 27 16:33</div>
              <div class="flex-1 text-[11px] text-gray-600">Customer asked for delivery confirmation.</div>
              <div class="w-32 text-[10px] text-gray-400 text-right flex-shrink-0 pt-1">Faisal Khan</div>
            </div>
          </div>
        </div>

        <!-- Documents Tab -->
        <div v-if="activeTab === 'Documents'" class="animate-in fade-in duration-200">
          <h3 class="text-[13px] font-bold text-gray-900 mb-3">Documents</h3>
          <div class="border border-gray-100 rounded-xl overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                  <th class="px-5 py-3">Document</th>
                  <th class="px-5 py-3">Type</th>
                  <th class="px-5 py-3">Generated</th>
                </tr>
              </thead>
              <tbody class="text-[11px]">
                <tr class="border-b border-gray-50">
                  <td class="px-5 py-4 text-gray-900 font-bold">QT-1108.pdf</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">Quotation</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">Aug 27</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Activity Tab -->
        <div v-if="activeTab === 'Activity'" class="animate-in fade-in duration-200">
          <h3 class="text-[13px] font-bold text-gray-900 mb-4">Activity</h3>
          <div class="space-y-4 relative pl-4">
            <!-- Timeline line -->
            <div class="absolute top-2 bottom-2 left-0 w-[2px] bg-gray-100"></div>
            
            <div class="relative flex items-center justify-between">
              <div class="absolute -left-4 w-[2px] h-full bg-[#165A31]"></div>
              <span class="text-[11px] font-bold text-gray-900 pl-4">Quotation sent</span>
              <span class="text-[10px] text-gray-500">18:12</span>
            </div>
            
            <div class="relative flex items-center justify-between">
              <div class="absolute -left-4 w-[2px] h-full bg-[#eefcf2]"></div>
              <span class="text-[11px] font-bold text-gray-900 pl-4">Quotation created</span>
              <span class="text-[10px] text-gray-500">17:56</span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <CreateQuotationModal v-if="showEditModal" @close="showEditModal = false" />
  </div>
</template>
