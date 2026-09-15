<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../../store.js'
import { ChevronDown } from 'lucide-vue-next'
import CreateSaleModal from './CreateSale.vue'

const router = useRouter()
const showEditModal = ref(false)
const activeTab = ref('Summary')
const tabs = ['Summary', 'Items & Serialized Unit', 'Customer', 'Price & Margin', 'Payments', 'Invoice', 'Delivery', 'Returns', 'Warranty', 'Documents', 'Activity']

const editOrder = () => {
  store.originalEditOrder = {
    branch: 'Peshawar Branch',
    customer: 'Faisal Khan',
    salesperson: 'Hamza Ali',
    product: 'BRG DS11',
    selectedUnit: 'DS11-00991',
    cataloguePrice: '185K',
    discount: '0',
    finalPrice: '185K',
    paymentMethod: 'Bank Transfer',
    amountReceived: '100K',
    balance: '0'
  }
  showEditModal.value = true
}

</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header Area -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Sales & CRM / Orders / <span class="font-bold text-gray-800">Order Detail — {{ activeTab }}</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900 flex items-center gap-3">
          Order Detail — {{ activeTab }}
        </h1>
        <p class="text-sm text-gray-500 mt-1">SO-7740 · {{ activeTab }}</p>
      </div>
    </div>

    <!-- Status & Actions Card -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-gray-900">SO-7740</h2>
          <p class="text-[12px] text-gray-500 mt-1">Peshawar · Faisal Khan · DS11-00991</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="inline-flex items-center px-2 py-1 rounded-[4px] text-[10px] font-bold bg-orange-100 text-orange-800">Reserved</span>
          <button @click="editOrder" class="px-4 py-2 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            Order Actions
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
              <p class="text-[11px] font-medium text-gray-500 mb-1">Order Total</p>
              <h3 class="text-2xl font-bold text-gray-900">PKR 185K</h3>
            </div>
            <div class="p-5 bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
              <p class="text-[11px] font-medium text-gray-500 mb-1">Paid</p>
              <h3 class="text-2xl font-bold text-gray-900">PKR 100K</h3>
            </div>
            <div class="p-5 bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
              <p class="text-[11px] font-medium text-gray-500 mb-1">Balance</p>
              <h3 class="text-2xl font-bold text-gray-900">PKR 85K</h3>
            </div>
            <div class="p-5 bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
              <p class="text-[11px] font-medium text-gray-500 mb-1">Status</p>
              <h3 class="text-2xl font-bold text-gray-900">Reserved</h3>
            </div>
          </div>
          
          <div>
            <h3 class="text-[13px] font-bold text-gray-900 mb-3">Order Summary</h3>
            <div class="bg-gray-50/50 rounded-lg p-1">
              <div class="flex items-center justify-between p-3 border-b border-gray-100">
                <span class="text-[11px] font-medium text-gray-500">Branch</span>
                <span class="text-[12px] font-bold text-gray-900">Peshawar</span>
              </div>
              <div class="flex items-center justify-between p-3 border-b border-gray-100">
                <span class="text-[11px] font-medium text-gray-500">Salesperson</span>
                <span class="text-[12px] font-bold text-gray-900">Hamza Ali</span>
              </div>
              <div class="flex items-center justify-between p-3 border-b border-gray-100">
                <span class="text-[11px] font-medium text-gray-500">Created</span>
                <span class="text-[12px] font-bold text-gray-900">Aug 27</span>
              </div>
              <div class="flex items-center justify-between p-3">
                <span class="text-[11px] font-medium text-gray-500">Delivery</span>
                <span class="text-[12px] font-bold text-gray-900">Pending balance</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Items & Serialized Unit Tab -->
        <div v-if="activeTab === 'Items & Serialized Unit'" class="animate-in fade-in duration-200">
          <h3 class="text-[13px] font-bold text-gray-900 mb-3">Item & Unit</h3>
          <div class="border border-gray-100 rounded-xl overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                  <th class="px-5 py-3">Product</th>
                  <th class="px-5 py-3">Serial</th>
                  <th class="px-5 py-3">Chassis</th>
                  <th class="px-5 py-3">Status</th>
                  <th class="px-5 py-3">Price</th>
                </tr>
              </thead>
              <tbody class="text-[11px]">
                <tr class="border-b border-gray-50">
                  <td class="px-5 py-4 text-gray-900 font-bold">BRG DS11</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">DS11-00991</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">CH-88194</td>
                  <td class="px-5 py-4">
                    <span class="inline-flex items-center px-2 py-1 rounded-[4px] text-[10px] font-bold bg-orange-100 text-orange-800">Reserved</span>
                  </td>
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
              <span class="text-[11px] font-medium text-gray-500">Orders</span>
              <span class="text-[12px] font-bold text-gray-900">3</span>
            </div>
            <div class="flex items-center justify-between p-3">
              <span class="text-[11px] font-medium text-gray-500">Owned Units</span>
              <span class="text-[12px] font-bold text-gray-900">2</span>
            </div>
          </div>
        </div>

        <!-- Price & Margin Tab -->
        <div v-if="activeTab === 'Price & Margin'" class="animate-in fade-in duration-200">
          <h3 class="text-[13px] font-bold text-gray-900 mb-3">Price & Margin</h3>
          <div class="border border-gray-100 rounded-xl overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                  <th class="px-5 py-3">List Price</th>
                  <th class="px-5 py-3">Final Price</th>
                  <th class="px-5 py-3">Landed Cost</th>
                  <th class="px-5 py-3">Gross Profit</th>
                  <th class="px-5 py-3">Margin</th>
                </tr>
              </thead>
              <tbody class="text-[11px]">
                <tr class="border-b border-gray-50">
                  <td class="px-5 py-4 text-gray-600 font-medium">185K</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">185K</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">145.8K</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">39.2K</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">21.2%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Payments Tab -->
        <div v-if="activeTab === 'Payments'" class="animate-in fade-in duration-200">
          <h3 class="text-[13px] font-bold text-gray-900 mb-3">Payments</h3>
          <div class="border border-gray-100 rounded-xl overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                  <th class="px-5 py-3">Payment</th>
                  <th class="px-5 py-3">Method</th>
                  <th class="px-5 py-3">Amount</th>
                  <th class="px-5 py-3">Date</th>
                  <th class="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody class="text-[11px]">
                <tr class="border-b border-gray-50">
                  <td class="px-5 py-4 text-gray-900 font-bold">PAY-3318</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">Bank Transfer</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">100K</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">Aug 27</td>
                  <td class="px-5 py-4">
                    <span class="inline-flex items-center px-2 py-1 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">Posted</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Invoice Tab -->
        <div v-if="activeTab === 'Invoice'" class="animate-in fade-in duration-200">
          <h3 class="text-[13px] font-bold text-gray-900 mb-3">Invoice</h3>
          <div class="bg-gray-50/50 rounded-lg p-1">
            <div class="flex items-center justify-between p-3 border-b border-gray-100">
              <span class="text-[11px] font-medium text-gray-500">Invoice</span>
              <span class="text-[12px] font-bold text-gray-900">Pending final payment</span>
            </div>
            <div class="flex items-center justify-between p-3">
              <span class="text-[11px] font-medium text-gray-500">Issue Rule</span>
              <span class="text-[12px] font-bold text-gray-900">Generate on payment completion</span>
            </div>
          </div>
        </div>

        <!-- Delivery Tab -->
        <div v-if="activeTab === 'Delivery'" class="animate-in fade-in duration-200">
          <h3 class="text-[13px] font-bold text-gray-900 mb-3">Delivery / Handover</h3>
          <div class="bg-white border border-gray-100 rounded-xl p-6 shadow-[0_2px_4px_rgba(0,0,0,0.01)] flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="inline-flex items-center px-2 py-1 rounded-[4px] text-[10px] font-bold bg-orange-100 text-orange-800">Blocked</span>
              <span class="text-[12px] font-bold text-gray-900">Outstanding balance PKR 85K.</span>
            </div>
            <span class="text-[11px] text-gray-500">Complete payment first</span>
          </div>
        </div>

        <!-- Returns Tab -->
        <div v-if="activeTab === 'Returns'" class="animate-in fade-in duration-200">
          <h3 class="text-[13px] font-bold text-gray-900 mb-3">Returns</h3>
          <div class="bg-white border border-gray-100 rounded-xl p-6 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
            <p class="text-[12px] font-bold text-gray-900">No returns linked to this order.</p>
          </div>
        </div>

        <!-- Warranty Tab -->
        <div v-if="activeTab === 'Warranty'" class="animate-in fade-in duration-200">
          <h3 class="text-[13px] font-bold text-gray-900 mb-3">Warranty</h3>
          <div class="bg-gray-50/50 rounded-lg p-1">
            <div class="flex items-center justify-between p-3 border-b border-gray-100">
              <span class="text-[11px] font-medium text-gray-500">Warranty Start</span>
              <span class="text-[12px] font-bold text-gray-900">Starts on handover</span>
            </div>
            <div class="flex items-center justify-between p-3">
              <span class="text-[11px] font-medium text-gray-500">Coverage</span>
              <span class="text-[12px] font-bold text-gray-900">24 months</span>
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
                  <th class="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody class="text-[11px]">
                <tr class="border-b border-gray-50">
                  <td class="px-5 py-4 text-gray-900 font-bold">Order_Agreement.pdf</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">Order</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">Signed</td>
                </tr>
                <tr class="border-b border-gray-50">
                  <td class="px-5 py-4 text-gray-900 font-bold">Customer_ID.pdf</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">Customer</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">Verified</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Activity Tab -->
        <div v-if="activeTab === 'Activity'" class="animate-in fade-in duration-200">
          <h3 class="text-[13px] font-bold text-gray-900 mb-4">Order Activity</h3>
          <div class="space-y-4 relative pl-4">
            <!-- Timeline line -->
            <div class="absolute top-2 bottom-2 left-0 w-[2px] bg-gray-100"></div>
            
            <div class="relative flex items-center justify-between">
              <div class="absolute -left-4 w-[2px] h-full bg-[#eefcf2]"></div>
              <span class="text-[11px] font-bold text-gray-900 pl-4">Unit DS11-00991 reserved</span>
              <span class="text-[10px] text-gray-500">18:44</span>
            </div>
            
            <div class="relative flex items-center justify-between">
              <div class="absolute -left-4 w-[2px] h-full bg-[#eefcf2]"></div>
              <span class="text-[11px] font-bold text-gray-900 pl-4">Payment PAY-3318 posted</span>
              <span class="text-[10px] text-gray-500">18:42</span>
            </div>

            <div class="relative flex items-center justify-between">
              <div class="absolute -left-4 w-[2px] h-full bg-[#eefcf2]"></div>
              <span class="text-[11px] font-bold text-gray-900 pl-4">Order created</span>
              <span class="text-[10px] text-gray-500">18:39</span>
            </div>
          </div>
        </div>

      </div>
    </div>
    
    <CreateSaleModal v-if="showEditModal" @close="showEditModal = false" />
  </div>
</template>
