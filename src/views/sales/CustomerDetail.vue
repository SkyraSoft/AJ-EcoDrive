<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDown } from 'lucide-vue-next'
import { store } from '@/store'
import CreateCustomerModal from './CreateCustomer.vue'

const router = useRouter()
const showEditModal = ref(false)
const activeTab = ref('Overview')
const tabs = ['Overview', 'Contact', 'Orders', 'Payments', 'Owned Units', 'Returns', 'Warranty & Service', 'Leads', 'Follow-ups', 'Documents & Notes', 'Activity']

const handleEdit = () => {
  store.originalEditCustomer = {
    firstName: 'Faisal',
    lastName: 'Khan',
    phone: '+92 300 1234567',
    email: 'faisal@example.com',
    cnic: '15602-1234567-1',
    address: 'Hayatabad',
    city: 'Peshawar',
    branch: 'Peshawar',
    notes: 'VIP customer - prefers WhatsApp'
  }
  showEditModal.value = true
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header Area -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Sales & CRM / Customers / <span class="font-bold text-gray-800">Customer Detail — {{ activeTab }}</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900 flex items-center gap-3">
          Customer Detail — {{ activeTab }}
        </h1>
        <p class="text-sm text-gray-500 mt-1">Faisal Khan · {{ activeTab }}</p>
      </div>
    </div>

    <!-- Status & Actions Card -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-gray-900">Faisal Khan</h2>
          <p class="text-[12px] text-gray-500 mt-1">Customer C-2041 · Peshawar · +92 300 1234567</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="inline-flex items-center px-2 py-1 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">Active</span>
          <button @click="handleEdit" class="px-4 py-2 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            Edit Customer
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
        
        <!-- Overview Tab -->
        <div v-if="activeTab === 'Overview'" class="animate-in fade-in duration-200 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="p-5 bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
              <p class="text-[11px] font-medium text-gray-500 mb-1">Lifetime Value</p>
              <h3 class="text-2xl font-bold text-gray-900">PKR 540K</h3>
            </div>
            <div class="p-5 bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
              <p class="text-[11px] font-medium text-gray-500 mb-1">Orders</p>
              <h3 class="text-2xl font-bold text-gray-900">3</h3>
            </div>
            <div class="p-5 bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
              <p class="text-[11px] font-medium text-gray-500 mb-1">Owned Units</p>
              <h3 class="text-2xl font-bold text-gray-900">2</h3>
            </div>
            <div class="p-5 bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
              <p class="text-[11px] font-medium text-gray-500 mb-1">Balance</p>
              <h3 class="text-2xl font-bold text-gray-900">PKR 85K</h3>
            </div>
          </div>
          
          <div>
            <h3 class="text-[13px] font-bold text-gray-900 mb-3">Customer Summary</h3>
            <div class="bg-gray-50/50 rounded-lg p-1">
              <div class="flex items-center justify-between p-3 border-b border-gray-100">
                <span class="text-[11px] font-medium text-gray-500">Customer Since</span>
                <span class="text-[12px] font-bold text-gray-900">Jan 2026</span>
              </div>
              <div class="flex items-center justify-between p-3 border-b border-gray-100">
                <span class="text-[11px] font-medium text-gray-500">Primary Branch</span>
                <span class="text-[12px] font-bold text-gray-900">Peshawar</span>
              </div>
              <div class="flex items-center justify-between p-3 border-b border-gray-100">
                <span class="text-[11px] font-medium text-gray-500">Assigned Rep</span>
                <span class="text-[12px] font-bold text-gray-900">Hamza Ali</span>
              </div>
              <div class="flex items-center justify-between p-3">
                <span class="text-[11px] font-medium text-gray-500">Segment</span>
                <span class="text-[12px] font-bold text-gray-900">VIP</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Tab -->
        <div v-if="activeTab === 'Contact'" class="animate-in fade-in duration-200">
          <h3 class="text-[13px] font-bold text-gray-900 mb-3">Contact</h3>
          <div class="bg-gray-50/50 rounded-lg p-1">
            <div class="flex items-center justify-between p-3 border-b border-gray-100">
              <span class="text-[11px] font-medium text-gray-500">Phone</span>
              <span class="text-[12px] font-bold text-gray-900">+92 300 1234567</span>
            </div>
            <div class="flex items-center justify-between p-3 border-b border-gray-100">
              <span class="text-[11px] font-medium text-gray-500">Email</span>
              <span class="text-[12px] font-bold text-gray-900">faisal@example.com</span>
            </div>
            <div class="flex items-center justify-between p-3">
              <span class="text-[11px] font-medium text-gray-500">Address</span>
              <span class="text-[12px] font-bold text-gray-900">Hayatabad, Peshawar</span>
            </div>
          </div>
        </div>

        <!-- Orders Tab -->
        <div v-if="activeTab === 'Orders'" class="animate-in fade-in duration-200">
          <h3 class="text-[13px] font-bold text-gray-900 mb-3">Orders</h3>
          <div class="border border-gray-100 rounded-xl overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                  <th class="px-5 py-3">Order</th>
                  <th class="px-5 py-3">Unit</th>
                  <th class="px-5 py-3">Amount</th>
                  <th class="px-5 py-3">Status</th>
                  <th class="px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody class="text-[11px]">
                <tr class="border-b border-gray-50">
                  <td class="px-5 py-4 text-gray-900 font-bold">SO-7740</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">DS11-00991</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">185K</td>
                  <td class="px-5 py-4">
                    <span class="inline-flex items-center px-2 py-1 rounded-[4px] text-[10px] font-bold bg-orange-100 text-orange-800">Reserved</span>
                  </td>
                  <td class="px-5 py-4 text-gray-600 font-medium">Aug 27</td>
                </tr>
                <tr class="border-b border-gray-50">
                  <td class="px-5 py-4 text-gray-900 font-bold">SO-7510</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">DS11-00877</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">175K</td>
                  <td class="px-5 py-4">
                    <span class="inline-flex items-center px-2 py-1 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">Completed</span>
                  </td>
                  <td class="px-5 py-4 text-gray-600 font-medium">Jun 11</td>
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
                  <th class="px-5 py-3">Order</th>
                  <th class="px-5 py-3">Amount</th>
                  <th class="px-5 py-3">Method</th>
                  <th class="px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody class="text-[11px]">
                <tr class="border-b border-gray-50">
                  <td class="px-5 py-4 text-gray-900 font-bold">PAY-3318</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">SO-7740</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">100K</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">Bank</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">Aug 27</td>
                </tr>
                <tr class="border-b border-gray-50">
                  <td class="px-5 py-4 text-gray-900 font-bold">PAY-2891</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">SO-7510</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">175K</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">Cash</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">Jun 11</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Owned Units Tab -->
        <div v-if="activeTab === 'Owned Units'" class="animate-in fade-in duration-200">
          <h3 class="text-[13px] font-bold text-gray-900 mb-3">Owned Units</h3>
          <div class="border border-gray-100 rounded-xl overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                  <th class="px-5 py-3">Serial</th>
                  <th class="px-5 py-3">Product</th>
                  <th class="px-5 py-3">Purchased</th>
                  <th class="px-5 py-3">Warranty</th>
                  <th class="px-5 py-3 text-center">Service Cases</th>
                </tr>
              </thead>
              <tbody class="text-[11px]">
                <tr class="border-b border-gray-50">
                  <td class="px-5 py-4 text-gray-900 font-bold">DS11-00877</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">BRG DS11</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">Jun 11</td>
                  <td class="px-5 py-4">
                    <span class="inline-flex items-center px-2 py-1 rounded-[4px] text-[10px] font-bold text-[#165A31]">Active</span>
                  </td>
                  <td class="px-5 py-4 text-gray-600 font-medium text-center">0</td>
                </tr>
                <tr class="border-b border-gray-50">
                  <td class="px-5 py-4 text-gray-900 font-bold">EV5-00322</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">BRG EV-5</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">Feb 18</td>
                  <td class="px-5 py-4">
                    <span class="inline-flex items-center px-2 py-1 rounded-[4px] text-[10px] font-bold text-[#165A31]">Active</span>
                  </td>
                  <td class="px-5 py-4 text-gray-600 font-medium text-center">1</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Returns Tab -->
        <div v-if="activeTab === 'Returns'" class="animate-in fade-in duration-200">
          <h3 class="text-[13px] font-bold text-gray-900 mb-3">Returns</h3>
          <div class="border border-gray-100 rounded-xl overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                  <th class="px-5 py-3">Return</th>
                  <th class="px-5 py-3">Unit</th>
                  <th class="px-5 py-3">Reason</th>
                  <th class="px-5 py-3">Decision</th>
                  <th class="px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody class="text-[11px]">
                <tr class="border-b border-gray-50">
                  <td class="px-5 py-4 text-gray-900 font-bold">RET-304</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">DS11-00911</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">Exchange</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">Completed</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">Aug 22</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Warranty & Service Tab -->
        <div v-if="activeTab === 'Warranty & Service'" class="animate-in fade-in duration-200">
          <h3 class="text-[13px] font-bold text-gray-900 mb-3">Warranty & Service</h3>
          <div class="border border-gray-100 rounded-xl overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                  <th class="px-5 py-3">Case</th>
                  <th class="px-5 py-3">Unit</th>
                  <th class="px-5 py-3">Type</th>
                  <th class="px-5 py-3">Status</th>
                  <th class="px-5 py-3">Opened</th>
                </tr>
              </thead>
              <tbody class="text-[11px]">
                <tr class="border-b border-gray-50">
                  <td class="px-5 py-4 text-gray-900 font-bold">SRV-192</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">EV5-00322</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">Service</td>
                  <td class="px-5 py-4">
                    <span class="inline-flex items-center px-2 py-1 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">Resolved</span>
                  </td>
                  <td class="px-5 py-4 text-gray-600 font-medium">May 20</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Leads Tab -->
        <div v-if="activeTab === 'Leads'" class="animate-in fade-in duration-200">
          <h3 class="text-[13px] font-bold text-gray-900 mb-3">Lead History</h3>
          <div class="border border-gray-100 rounded-xl overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                  <th class="px-5 py-3">Lead</th>
                  <th class="px-5 py-3">Source</th>
                  <th class="px-5 py-3">Interest</th>
                  <th class="px-5 py-3">Stage</th>
                  <th class="px-5 py-3">Created</th>
                </tr>
              </thead>
              <tbody class="text-[11px]">
                <tr class="border-b border-gray-50">
                  <td class="px-5 py-4 text-gray-900 font-bold">LD-778</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">Referral</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">BRG DS11</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">Converted</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">Jan 04</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Follow-ups Tab -->
        <div v-if="activeTab === 'Follow-ups'" class="animate-in fade-in duration-200">
          <h3 class="text-[13px] font-bold text-gray-900 mb-3">Follow-ups</h3>
          <div class="border border-gray-100 rounded-xl overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                  <th class="px-5 py-3">Due</th>
                  <th class="px-5 py-3">Type</th>
                  <th class="px-5 py-3">Owner</th>
                  <th class="px-5 py-3">Status</th>
                  <th class="px-5 py-3">Note</th>
                </tr>
              </thead>
              <tbody class="text-[11px]">
                <tr class="border-b border-gray-50">
                  <td class="px-5 py-4 text-gray-900 font-bold">Sep 05</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">Payment</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">Hamza Ali</td>
                  <td class="px-5 py-4">
                    <span class="inline-flex items-center px-2 py-1 rounded-[4px] text-[10px] font-bold bg-blue-100 text-blue-800">Upcoming</span>
                  </td>
                  <td class="px-5 py-4 text-gray-600 font-medium">Collect remaining 85K</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Documents & Notes Tab -->
        <div v-if="activeTab === 'Documents & Notes'" class="animate-in fade-in duration-200">
          <h3 class="text-[13px] font-bold text-gray-900 mb-3">Documents & Notes</h3>
          <div class="border border-gray-100 rounded-xl overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                  <th class="px-5 py-3">Item</th>
                  <th class="px-5 py-3">Type</th>
                  <th class="px-5 py-3">Updated</th>
                </tr>
              </thead>
              <tbody class="text-[11px]">
                <tr class="border-b border-gray-50">
                  <td class="px-5 py-4 text-gray-900 font-bold">CNIC_Verified.pdf</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">Identity</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">Jan 04</td>
                </tr>
                <tr class="border-b border-gray-50">
                  <td class="px-5 py-4 text-gray-900 font-bold">VIP customer - prefers WhatsApp</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">Note</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">Aug 27</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Activity Tab -->
        <div v-if="activeTab === 'Activity'" class="animate-in fade-in duration-200">
          <h3 class="text-[13px] font-bold text-gray-900 mb-4">Customer Activity</h3>
          <div class="space-y-4 relative pl-4">
            <!-- Timeline line -->
            <div class="absolute top-2 bottom-2 left-0 w-[2px] bg-gray-100"></div>
            
            <div class="relative flex items-center justify-between">
              <div class="absolute -left-4 w-[2px] h-full bg-[#eefcf2]"></div>
              <span class="text-[11px] font-bold text-gray-900 pl-4">Payment PAY-3318 posted</span>
              <span class="text-[10px] text-gray-500">Today</span>
            </div>
            
            <div class="relative flex items-center justify-between">
              <div class="absolute -left-4 w-[2px] h-full bg-[#eefcf2]"></div>
              <span class="text-[11px] font-bold text-gray-900 pl-4">Order SO-7740 created</span>
              <span class="text-[10px] text-gray-500">Today</span>
            </div>

            <div class="relative flex items-center justify-between">
              <div class="absolute -left-4 w-[2px] h-full bg-[#eefcf2]"></div>
              <span class="text-[11px] font-bold text-gray-900 pl-4">Quotation QT-1108 sent</span>
              <span class="text-[10px] text-gray-500">Today</span>
            </div>
          </div>
        </div>

      </div>
    </div>
    
    <CreateCustomerModal v-if="showEditModal" @close="showEditModal = false" />
  </div>
</template>
