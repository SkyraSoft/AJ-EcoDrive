<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { store } from '../../store.js'
import { ChevronDown } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const branchId = computed(() => route.params.id || route.query.id || 'PEW-01')
const branchRecord = computed(() => {
  return store.getBranchById(branchId.value) || store.branches[0] || {
    name: 'Peshawar',
    code: 'PEW-01',
    city: 'Peshawar',
    manager: 'Ahsan Khan',
    sales: '9.8M',
    inventory: '14.2M',
    expenses: '1.0M',
    profit: '1.4M',
    status: 'Active',
    address: '123 Main St', 
    area: 'Hayatabad', 
    phone: '+92 300 1234567', 
    email: 'pew@ajecodrive.com', 
    defaultLocation: 'Main Warehouse', 
    hours: '9 AM - 6 PM', 
    expenseLimit: '100000', 
    discountLimit: '10%', 
    salesRules: 'Standard', 
    changeNote: ''
  }
})

const tabs = [
  'Overview', 'Performance', 'Inventory', 'Sales', 'Procurement & Inbound', 
  'Expenses', 'Customers', 'Team', 'Communication', 'Documents', 'Activity'
]
const activeTab = ref('Performance')

const editBranch = () => {
  store.originalEditBranch = { ...branchRecord.value }
  router.push('/organisation/branches/edit')
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Organisation / Branches / <span class="font-bold text-gray-800">Branch Detail &mdash; {{ activeTab }}</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Branch Detail &mdash; {{ activeTab }}</h1>
        <p class="text-[13px] text-gray-500 mt-1">Peshawar Branch - {{ activeTab }}</p>
      </div>
    </div>

    <!-- Main Card -->
    <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
      
      <!-- Card Header: Title & Actions -->
      <div class="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <div>
          <h2 class="text-[20px] font-bold text-gray-900 leading-none mb-2">Peshawar Branch</h2>
          <div class="text-[11px] font-medium text-gray-500">
            PEW-01 &middot; Peshawar &middot; Manager: Ahsan Khan
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <span class="inline-flex items-center px-2 py-1 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">
            Active
          </span>
          <button @click="editBranch" class="text-[11px] font-bold text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 shadow-sm transition-colors">
            Edit Branch
          </button>
          <button class="flex items-center gap-1 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 shadow-sm transition-colors">
            More <ChevronDown class="w-3 h-3 text-gray-400" />
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="px-6 flex items-center gap-6 overflow-x-auto border-b border-gray-100">
        <button 
          v-for="tab in tabs" 
          :key="tab"
          @click="activeTab = tab"
          class="py-4 text-[11px] font-bold whitespace-nowrap border-b-2 transition-colors"
          :class="activeTab === tab ? 'border-[#165A31] text-[#165A31]' : 'border-transparent text-gray-500 hover:text-gray-900'"
        >
          {{ tab }}
        </button>
      </div>

    </div>

    <!-- Overview Tab Content -->
    <template v-if="activeTab === 'Overview'">
      <!-- 4 KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Net Sales -->
        <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[100px]">
          <div class="text-xs font-semibold text-gray-400">Net Sales</div>
          <div class="flex items-end justify-between">
            <div class="text-[22px] font-bold text-gray-900 leading-none">PKR 9.8M</div>
            <div class="text-[10px] font-bold text-[#165A31]">+14.2%</div>
          </div>
        </div>
        <!-- Units Sold -->
        <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[100px]">
          <div class="text-xs font-semibold text-gray-400">Units Sold</div>
          <div class="flex items-end justify-between">
            <div class="text-[22px] font-bold text-gray-900 leading-none">66</div>
            <div class="text-[10px] font-bold text-[#165A31]">+8.1%</div>
          </div>
        </div>
        <!-- Inventory Value -->
        <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[100px]">
          <div class="text-xs font-semibold text-gray-400">Inventory Value</div>
          <div class="flex items-end justify-between">
            <div class="text-[22px] font-bold text-gray-900 leading-none">PKR 14.2M</div>
            <div class="text-[10px] font-medium text-gray-400">118 units</div>
          </div>
        </div>
        <!-- Net Profit -->
        <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[100px]">
          <div class="text-xs font-semibold text-gray-400">Net Profit</div>
          <div class="flex items-end justify-between">
            <div class="text-[22px] font-bold text-gray-900 leading-none">PKR 1.4M</div>
            <div class="text-[10px] font-bold text-[#165A31]">+19.6%</div>
          </div>
        </div>
      </div>

      <!-- Bottom 2 Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-4">
        
        <!-- Branch Identity -->
        <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] min-h-[220px]">
          <h3 class="text-[13px] font-bold text-gray-900 mb-6">Branch Identity</h3>
          <div class="space-y-4">
            <div class="flex justify-between items-center pb-3 border-b border-gray-50">
              <span class="text-[11px] font-medium text-gray-500">Manager</span>
              <span class="text-[11px] font-bold text-gray-900">Ahsan Khan</span>
            </div>
            <div class="flex justify-between items-center pb-3 border-b border-gray-50">
              <span class="text-[11px] font-medium text-gray-500">Phone</span>
              <span class="text-[11px] font-bold text-gray-900">+92 91 555 0101</span>
            </div>
            <div class="flex justify-between items-center pb-3 border-b border-gray-50">
              <span class="text-[11px] font-medium text-gray-500">Email</span>
              <span class="text-[11px] font-bold text-gray-900">peshawar@ajecodrive.com</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-[11px] font-medium text-gray-500">Stock Location</span>
              <span class="text-[11px] font-bold text-gray-900">Main Showroom</span>
            </div>
          </div>
        </div>

        <!-- Current Alerts -->
        <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] min-h-[220px]">
          <h3 class="text-[13px] font-bold text-gray-900 mb-6">Current Alerts</h3>
          <div class="space-y-4">
            
            <div class="flex flex-wrap items-center gap-3">
              <span class="bg-orange-50 text-orange-600 px-2 py-0.5 rounded text-[9px] font-bold">High</span>
              <span class="text-[11px] font-bold text-gray-900">BRG EV-5 low stock</span>
            </div>
            
            <div class="flex flex-wrap items-center gap-3">
              <span class="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[9px] font-bold">Medium</span>
              <span class="text-[11px] font-bold text-gray-900">2 inbound deliveries due</span>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <span class="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[9px] font-bold">Medium</span>
              <span class="text-[11px] font-bold text-gray-900">3 expenses pending</span>
            </div>

          </div>
        </div>

      </div>
    </template>

    <!-- Performance Tab Content -->
    <template v-if="activeTab === 'Performance'">
      <!-- 4 KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[100px]">
          <div class="text-xs font-semibold text-gray-400">Revenue</div>
          <div class="text-[22px] font-bold text-gray-900 leading-none">PKR 9.8M</div>
        </div>
        <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[100px]">
          <div class="text-xs font-semibold text-gray-400">COGS</div>
          <div class="text-[22px] font-bold text-gray-900 leading-none">PKR 5.7M</div>
        </div>
        <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[100px]">
          <div class="text-xs font-semibold text-gray-400">Gross Profit</div>
          <div class="text-[22px] font-bold text-gray-900 leading-none">PKR 2.4M</div>
        </div>
        <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[100px]">
          <div class="text-xs font-semibold text-gray-400">OpEx</div>
          <div class="text-[22px] font-bold text-gray-900 leading-none">PKR 1.0M</div>
        </div>
      </div>

      <!-- Bottom 2 Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-4">
        
        <!-- Revenue Trend -->
        <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] min-h-[220px]">
          <h3 class="text-[13px] font-bold text-gray-900 mb-6">Revenue Trend</h3>
          <div class="h-32 bg-[#f4fcf6] rounded-lg relative overflow-hidden flex items-center justify-center border border-gray-50/50">
            <!-- Mock Line Chart SVG -->
            <svg class="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path d="M 5,80 L 30,75 L 60,65 L 95,50" fill="none" stroke="#165A31" stroke-width="1.5" vector-effect="non-scaling-stroke" />
            </svg>
          </div>
        </div>

        <!-- Period Comparison -->
        <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] min-h-[220px]">
          <h3 class="text-[13px] font-bold text-gray-900 mb-6">Period Comparison</h3>
          <div class="w-full overflow-x-auto"><table class="w-full text-left">
            <thead>
              <tr class="border-b border-gray-100 text-[10px] text-gray-500 font-medium tracking-wide">
                <th class="pb-2 font-medium w-1/4">Metric</th>
                <th class="pb-2 font-medium w-1/4">Current</th>
                <th class="pb-2 font-medium w-1/4">Previous</th>
                <th class="pb-2 font-medium w-1/4">Variance</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr class="border-b border-gray-50">
                <td class="py-3 font-semibold text-gray-900">Revenue</td>
                <td class="py-3 text-gray-600">9.8M</td>
                <td class="py-3 text-gray-600">8.6M</td>
                <td class="py-3 font-bold text-gray-900">+14%</td>
              </tr>
              <tr class="border-b border-gray-50">
                <td class="py-3 font-semibold text-gray-900">Units</td>
                <td class="py-3 text-gray-600">66</td>
                <td class="py-3 text-gray-600">61</td>
                <td class="py-3 font-bold text-gray-900">+8%</td>
              </tr>
              <tr>
                <td class="py-3 font-semibold text-gray-900">Net Profit</td>
                <td class="py-3 text-gray-600">1.4M</td>
                <td class="py-3 text-gray-600">1.17M</td>
                <td class="py-3 font-bold text-gray-900">+20%</td>
              </tr>
            </tbody>
          </table></div>
        </div>

      </div>
    </template>

    <!-- Inventory Tab Content -->
    <template v-if="activeTab === 'Inventory'">
      <!-- 4 KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[100px]">
          <div class="text-xs font-semibold text-gray-400">Available</div>
          <div class="text-[22px] font-bold text-gray-900 leading-none">83</div>
        </div>
        <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[100px]">
          <div class="text-xs font-semibold text-gray-400">Reserved</div>
          <div class="text-[22px] font-bold text-gray-900 leading-none">14</div>
        </div>
        <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[100px]">
          <div class="text-xs font-semibold text-gray-400">Incoming</div>
          <div class="text-[22px] font-bold text-gray-900 leading-none">12</div>
        </div>
        <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[100px]">
          <div class="text-xs font-semibold text-gray-400">QC / Damaged</div>
          <div class="text-[22px] font-bold text-gray-900 leading-none">5</div>
        </div>
      </div>

      <!-- Inventory Table -->
      <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100">
          <h3 class="text-[13px] font-bold text-gray-900">Product Inventory</h3>
        </div>
        <div class="overflow-x-auto">
          <div class="w-full overflow-x-auto"><table class="w-full text-left">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                <th class="px-6 py-3 w-[15%]">Product</th>
                <th class="px-6 py-3 w-[15%]">SKU</th>
                <th class="px-6 py-3 w-[10%]">Available</th>
                <th class="px-6 py-3 w-[10%]">Reserved</th>
                <th class="px-6 py-3 w-[10%]">Incoming</th>
                <th class="px-6 py-3 w-[10%]">QC</th>
                <th class="px-6 py-3 w-[10%]">Total</th>
                <th class="px-6 py-3 w-[20%]">Value</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr class="border-b border-gray-50">
                <td class="px-6 py-4 font-semibold text-gray-900">BRG DST1</td>
                <td class="px-6 py-4 text-gray-500">BRG-DST1</td>
                <td class="px-6 py-4 text-gray-900">24</td>
                <td class="px-6 py-4 text-gray-900">6</td>
                <td class="px-6 py-4 text-gray-900">5</td>
                <td class="px-6 py-4 text-gray-900">1</td>
                <td class="px-6 py-4 text-gray-900">36</td>
                <td class="px-6 py-4 text-gray-900">4.3M</td>
              </tr>
              <tr class="border-b border-gray-50">
                <td class="px-6 py-4 font-semibold text-gray-900">BRG EV-5</td>
                <td class="px-6 py-4 text-gray-500">BRG-EV5</td>
                <td class="px-6 py-4 text-gray-900">8</td>
                <td class="px-6 py-4 text-gray-900">3</td>
                <td class="px-6 py-4 text-gray-900">2</td>
                <td class="px-6 py-4 text-gray-900">0</td>
                <td class="px-6 py-4 text-gray-900">13</td>
                <td class="px-6 py-4 text-gray-900">2.1M</td>
              </tr>
              <tr>
                <td class="px-6 py-4 font-semibold text-gray-900">Cargo Pro</td>
                <td class="px-6 py-4 text-gray-500">BRG-CARGO</td>
                <td class="px-6 py-4 text-gray-900">17</td>
                <td class="px-6 py-4 text-gray-900">2</td>
                <td class="px-6 py-4 text-gray-900">3</td>
                <td class="px-6 py-4 text-gray-900">1</td>
                <td class="px-6 py-4 text-gray-900">23</td>
                <td class="px-6 py-4 text-gray-900">3.0M</td>
              </tr>
            </tbody>
          </table></div>
        </div>
      </div>
    </template>

    <!-- Sales Tab Content -->
    <template v-if="activeTab === 'Sales'">
      <!-- 4 KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[100px]">
          <div class="text-xs font-semibold text-gray-400">Sales</div>
          <div class="text-[22px] font-bold text-gray-900 leading-none">PKR 9.8M</div>
        </div>
        <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[100px]">
          <div class="text-xs font-semibold text-gray-400">Orders</div>
          <div class="text-[22px] font-bold text-gray-900 leading-none">71</div>
        </div>
        <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[100px]">
          <div class="text-xs font-semibold text-gray-400">Units</div>
          <div class="text-[22px] font-bold text-gray-900 leading-none">66</div>
        </div>
        <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[100px]">
          <div class="text-xs font-semibold text-gray-400">Avg Sale</div>
          <div class="text-[22px] font-bold text-gray-900 leading-none">PKR 148K</div>
        </div>
      </div>

      <!-- Bottom 2 Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-4">
        
        <!-- Sales Trend -->
        <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] min-h-[220px]">
          <h3 class="text-[13px] font-bold text-gray-900 mb-6">Sales Trend</h3>
          <div class="h-32 bg-[#f4fcf6] rounded-lg relative overflow-hidden flex items-center justify-center border border-gray-50/50">
            <!-- Mock Line Chart SVG -->
            <svg class="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path d="M 5,80 L 30,75 L 60,65 L 95,50" fill="none" stroke="#165A31" stroke-width="1.5" vector-effect="non-scaling-stroke" />
            </svg>
          </div>
        </div>

        <!-- Top Products -->
        <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] min-h-[220px]">
          <h3 class="text-[13px] font-bold text-gray-900 mb-6">Top Products</h3>
          <div class="space-y-4">
            
            <div class="flex items-center text-[10px]">
              <div class="w-20 text-gray-500 font-medium">BRG DST1</div>
              <div class="flex-1 mx-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full bg-[#165A31] w-[92%] rounded-full"></div>
              </div>
              <div class="w-6 text-right font-bold text-gray-900">92</div>
            </div>
            
            <div class="flex items-center text-[10px]">
              <div class="w-20 text-gray-500 font-medium">EV-5</div>
              <div class="flex-1 mx-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full bg-[#165A31] w-[73%] rounded-full"></div>
              </div>
              <div class="w-6 text-right font-bold text-gray-900">73</div>
            </div>
            
            <div class="flex items-center text-[10px]">
              <div class="w-20 text-gray-500 font-medium">Cargo Pro</div>
              <div class="flex-1 mx-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full bg-[#165A31] w-[58%] rounded-full"></div>
              </div>
              <div class="w-6 text-right font-bold text-gray-900">58</div>
            </div>

          </div>
        </div>

      </div>
    </template>

    <!-- Procurement & Inbound Tab Content -->
    <template v-if="activeTab === 'Procurement & Inbound'">
      <!-- 4 KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[100px]">
          <div class="text-xs font-semibold text-gray-400">Supplier Inbound</div>
          <div class="text-[22px] font-bold text-gray-900 leading-none">2</div>
        </div>
        <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[100px]">
          <div class="text-xs font-semibold text-gray-400">Transfer Inbound</div>
          <div class="text-[22px] font-bold text-gray-900 leading-none">3</div>
        </div>
        <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[100px]">
          <div class="text-xs font-semibold text-gray-400">Pending QC</div>
          <div class="text-[22px] font-bold text-gray-900 leading-none">3</div>
        </div>
        <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[100px]">
          <div class="text-xs font-semibold text-gray-400">Overdue</div>
          <div class="text-[22px] font-bold text-gray-900 leading-none">1</div>
        </div>
      </div>

      <!-- Inbound Queue Table -->
      <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100">
          <h3 class="text-[13px] font-bold text-gray-900">Inbound Queue</h3>
        </div>
        <div class="overflow-x-auto">
          <div class="w-full overflow-x-auto"><table class="w-full text-left">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                <th class="px-6 py-3 w-[15%]">Type</th>
                <th class="px-6 py-3 w-[15%]">Reference</th>
                <th class="px-6 py-3 w-[20%]">Source</th>
                <th class="px-6 py-3 w-[15%]">ETA</th>
                <th class="px-6 py-3 w-[10%]">Units</th>
                <th class="px-6 py-3 w-[15%]">Status</th>
                <th class="px-6 py-3 w-[10%] text-right">Action</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr class="border-b border-gray-50">
                <td class="px-6 py-4 font-semibold text-gray-900">Supplier</td>
                <td class="px-6 py-4 text-gray-500">PO-2048</td>
                <td class="px-6 py-4 text-gray-900">BRG Factory</td>
                <td class="px-6 py-4 text-gray-900">Aug 29</td>
                <td class="px-6 py-4 text-gray-900">8</td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[9px] font-bold text-blue-600 bg-blue-50">
                    In Transit
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <button class="text-gray-500 hover:text-gray-900 font-medium">Open &rarr;</button>
                </td>
              </tr>
              <tr class="border-b border-gray-50">
                <td class="px-6 py-4 font-semibold text-gray-900">Transfer</td>
                <td class="px-6 py-4 text-gray-500">TR-119</td>
                <td class="px-6 py-4 text-gray-900">Islamabad</td>
                <td class="px-6 py-4 text-gray-900">Aug 28</td>
                <td class="px-6 py-4 text-gray-900">4</td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[9px] font-bold text-blue-600 bg-blue-50">
                    In Transit
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <button class="text-gray-500 hover:text-gray-900 font-medium">Open &rarr;</button>
                </td>
              </tr>
              <tr>
                <td class="px-6 py-4 font-semibold text-gray-900">Supplier</td>
                <td class="px-6 py-4 text-gray-500">PO-2042</td>
                <td class="px-6 py-4 text-gray-900">BRG Factory</td>
                <td class="px-6 py-4 text-gray-900">Aug 27</td>
                <td class="px-6 py-4 text-gray-900">3</td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[9px] font-bold text-orange-600 bg-orange-50">
                    QC
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <button class="text-gray-500 hover:text-gray-900 font-medium">Receive &rarr;</button>
                </td>
              </tr>
            </tbody>
          </table></div>
        </div>
      </div>
    </template>

    <!-- Expenses Tab Content -->
    <template v-if="activeTab === 'Expenses'">
      <!-- 4 KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[100px]">
          <div class="text-xs font-semibold text-gray-400">This Month</div>
          <div class="text-[22px] font-bold text-gray-900 leading-none">PKR 1.0M</div>
        </div>
        <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[100px]">
          <div class="text-xs font-semibold text-gray-400">Pending</div>
          <div class="text-[22px] font-bold text-gray-900 leading-none">3</div>
        </div>
        <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[100px]">
          <div class="text-xs font-semibold text-gray-400">Approved</div>
          <div class="text-[22px] font-bold text-gray-900 leading-none">19</div>
        </div>
        <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[100px]">
          <div class="text-xs font-semibold text-gray-400">Recurring</div>
          <div class="text-[22px] font-bold text-gray-900 leading-none">8</div>
        </div>
      </div>

      <!-- Bottom 2 Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-4">
        
        <!-- Expense Categories -->
        <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] min-h-[220px]">
          <h3 class="text-[13px] font-bold text-gray-900 mb-6">Expense Categories</h3>
          <div class="space-y-4">
            
            <div class="flex items-center text-[10px]">
              <div class="w-20 text-gray-500 font-medium">Salaries</div>
              <div class="flex-1 mx-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full bg-[#165A31] w-[86%] rounded-full"></div>
              </div>
              <div class="w-6 text-right font-bold text-gray-900">86</div>
            </div>
            
            <div class="flex items-center text-[10px]">
              <div class="w-20 text-gray-500 font-medium">Rent</div>
              <div class="flex-1 mx-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full bg-[#165A31] w-[62%] rounded-full"></div>
              </div>
              <div class="w-6 text-right font-bold text-gray-900">62</div>
            </div>
            
            <div class="flex items-center text-[10px]">
              <div class="w-20 text-gray-500 font-medium">Utilities</div>
              <div class="flex-1 mx-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full bg-[#165A31] w-[44%] rounded-full"></div>
              </div>
              <div class="w-6 text-right font-bold text-gray-900">44</div>
            </div>
            
            <div class="flex items-center text-[10px]">
              <div class="w-20 text-gray-500 font-medium">Logistics</div>
              <div class="flex-1 mx-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full bg-[#165A31] w-[32%] rounded-full"></div>
              </div>
              <div class="w-6 text-right font-bold text-gray-900">32</div>
            </div>
            
            <div class="flex items-center text-[10px]">
              <div class="w-20 text-gray-500 font-medium">Marketing</div>
              <div class="flex-1 mx-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full bg-[#165A31] w-[25%] rounded-full"></div>
              </div>
              <div class="w-6 text-right font-bold text-gray-900">25</div>
            </div>

          </div>
        </div>

        <!-- Pending Decisions -->
        <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-100">
            <h3 class="text-[13px] font-bold text-gray-900">Pending Decisions</h3>
          </div>
          <div class="overflow-x-auto">
            <div class="w-full overflow-x-auto"><table class="w-full text-left">
              <thead>
                <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                  <th class="px-6 py-3">Expense</th>
                  <th class="px-6 py-3">Category</th>
                  <th class="px-6 py-3">Amount</th>
                  <th class="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody class="text-[11px]">
                <tr class="border-b border-gray-50">
                  <td class="px-6 py-4 font-semibold text-gray-900">EXP-8831</td>
                  <td class="px-6 py-4 text-gray-500">Logistics</td>
                  <td class="px-6 py-4 text-gray-900">95K</td>
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[9px] font-bold text-orange-600 bg-orange-50">
                      Pending
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="px-6 py-4 font-semibold text-gray-900">EXP-8819</td>
                  <td class="px-6 py-4 text-gray-500">Maintenance</td>
                  <td class="px-6 py-4 text-gray-900">42K</td>
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[9px] font-bold text-orange-600 bg-orange-50">
                      Pending
                    </span>
                  </td>
                </tr>
              </tbody>
            </table></div>
          </div>
        </div>

      </div>
    </template>

    <!-- Customers Tab Content -->
    <template v-if="activeTab === 'Customers'">
      <!-- 4 KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[100px]">
          <div class="text-xs font-semibold text-gray-400">Customers</div>
          <div class="text-[22px] font-bold text-gray-900 leading-none">428</div>
        </div>
        <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[100px]">
          <div class="text-xs font-semibold text-gray-400">Active Leads</div>
          <div class="text-[22px] font-bold text-gray-900 leading-none">31</div>
        </div>
        <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[100px]">
          <div class="text-xs font-semibold text-gray-400">Owned Units</div>
          <div class="text-[22px] font-bold text-gray-900 leading-none">366</div>
        </div>
        <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[100px]">
          <div class="text-xs font-semibold text-gray-400">Receivables</div>
          <div class="text-[22px] font-bold text-gray-900 leading-none">PKR 0.9M</div>
        </div>
      </div>

      <!-- Recent Customers Table -->
      <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100">
          <h3 class="text-[13px] font-bold text-gray-900">Recent Customers</h3>
        </div>
        <div class="overflow-x-auto">
          <div class="w-full overflow-x-auto"><table class="w-full text-left">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                <th class="px-6 py-3">Customer</th>
                <th class="px-6 py-3">Contact</th>
                <th class="px-6 py-3">Orders</th>
                <th class="px-6 py-3">Owned Units</th>
                <th class="px-6 py-3">Balance</th>
                <th class="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr class="border-b border-gray-50">
                <td class="px-6 py-4 font-semibold text-gray-900">Faisal Khan</td>
                <td class="px-6 py-4 text-gray-500">+92 300 1234567</td>
                <td class="px-6 py-4 text-gray-900">3</td>
                <td class="px-6 py-4 text-gray-900">2</td>
                <td class="px-6 py-4 text-gray-900">0</td>
                <td class="px-6 py-4 text-right">
                  <button class="text-gray-500 hover:text-gray-900 font-medium">Open &rarr;</button>
                </td>
              </tr>
              <tr class="border-b border-gray-50">
                <td class="px-6 py-4 font-semibold text-gray-900">Saad Ahmad</td>
                <td class="px-6 py-4 text-gray-500">+92 333 2221000</td>
                <td class="px-6 py-4 text-gray-900">2</td>
                <td class="px-6 py-4 text-gray-900">1</td>
                <td class="px-6 py-4 text-gray-900">120K</td>
                <td class="px-6 py-4 text-right">
                  <button class="text-gray-500 hover:text-gray-900 font-medium">Open &rarr;</button>
                </td>
              </tr>
              <tr>
                <td class="px-6 py-4 font-semibold text-gray-900">M. Bilal</td>
                <td class="px-6 py-4 text-gray-500">+92 321 5559944</td>
                <td class="px-6 py-4 text-gray-900">1</td>
                <td class="px-6 py-4 text-gray-900">1</td>
                <td class="px-6 py-4 text-gray-900">0</td>
                <td class="px-6 py-4 text-right">
                  <button class="text-gray-500 hover:text-gray-900 font-medium">Open &rarr;</button>
                </td>
              </tr>
            </tbody>
          </table></div>
        </div>
      </div>
    </template>

    <!-- Team Tab Content -->
    <template v-if="activeTab === 'Team'">
      <!-- 4 KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[100px]">
          <div class="text-xs font-semibold text-gray-400">Branch Manager</div>
          <div class="text-[22px] font-bold text-gray-900 leading-none">1</div>
        </div>
        <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[100px]">
          <div class="text-xs font-semibold text-gray-400">Assigned Users</div>
          <div class="text-[22px] font-bold text-gray-900 leading-none">7</div>
        </div>
        <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[100px]">
          <div class="text-xs font-semibold text-gray-400">Active Today</div>
          <div class="text-[22px] font-bold text-gray-900 leading-none">6</div>
        </div>
        <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[100px]">
          <div class="text-xs font-semibold text-gray-400">Pending Invite</div>
          <div class="text-[22px] font-bold text-gray-900 leading-none">1</div>
        </div>
      </div>

      <!-- Branch Team Table -->
      <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100">
          <h3 class="text-[13px] font-bold text-gray-900">Branch Team</h3>
        </div>
        <div class="overflow-x-auto">
          <div class="w-full overflow-x-auto"><table class="w-full text-left">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                <th class="px-6 py-3">Name</th>
                <th class="px-6 py-3">Role</th>
                <th class="px-6 py-3">Last Active</th>
                <th class="px-6 py-3">Status</th>
                <th class="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr class="border-b border-gray-50">
                <td class="px-6 py-4 font-semibold text-gray-900">Ahsan Khan</td>
                <td class="px-6 py-4 text-gray-500">Branch Manager</td>
                <td class="px-6 py-4 text-gray-900">2 min ago</td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[9px] font-bold text-[#165A31] bg-[#eefcf2]">
                    Active
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <button class="text-gray-500 hover:text-gray-900 font-medium">Open &rarr;</button>
                </td>
              </tr>
              <tr class="border-b border-gray-50">
                <td class="px-6 py-4 font-semibold text-gray-900">Hamza Ali</td>
                <td class="px-6 py-4 text-gray-500">Sales Executive</td>
                <td class="px-6 py-4 text-gray-900">8 min ago</td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[9px] font-bold text-[#165A31] bg-[#eefcf2]">
                    Active
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <button class="text-gray-500 hover:text-gray-900 font-medium">Open &rarr;</button>
                </td>
              </tr>
              <tr>
                <td class="px-6 py-4 font-semibold text-gray-900">Sana Noor</td>
                <td class="px-6 py-4 text-gray-500">CRM Executive</td>
                <td class="px-6 py-4 text-gray-900">1 hr ago</td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[9px] font-bold text-[#165A31] bg-[#eefcf2]">
                    Active
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <button class="text-gray-500 hover:text-gray-900 font-medium">Open &rarr;</button>
                </td>
              </tr>
            </tbody>
          </table></div>
        </div>
      </div>
    </template>

    <!-- Communication Tab Content -->
    <template v-if="activeTab === 'Communication'">
      <!-- Management Conversations Table -->
      <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100">
          <h3 class="text-[13px] font-bold text-gray-900">Management Conversations</h3>
        </div>
        <div class="p-2">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 px-4 py-3 hover:bg-gray-50 transition-colors rounded-lg">
            <div class="flex items-center gap-6">
              <span class="font-bold text-[11px] text-gray-900 w-20">SR-1048</span>
              <span class="text-[11px] text-gray-600">Need 5 x BRG DST1 before month-end campaign.</span>
            </div>
            <span class="text-[10px] font-medium text-gray-400">12 min</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 px-4 py-3 hover:bg-gray-50 transition-colors rounded-lg">
            <div class="flex items-center gap-6">
              <span class="font-bold text-[11px] text-gray-900 w-20">EXP-8831</span>
              <span class="text-[11px] text-gray-600">Transport receipt uploaded after correction.</span>
            </div>
            <span class="text-[10px] font-medium text-gray-400">34 min</span>
          </div>
        </div>
      </div>
    </template>

    <!-- Documents Tab Content -->
    <template v-if="activeTab === 'Documents'">
      <!-- Branch Documents Table -->
      <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100">
          <h3 class="text-[13px] font-bold text-gray-900">Branch Documents</h3>
        </div>
        <div class="overflow-x-auto">
          <div class="w-full overflow-x-auto"><table class="w-full text-left">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                <th class="px-6 py-3">Document</th>
                <th class="px-6 py-3">Category</th>
                <th class="px-6 py-3">Uploaded</th>
                <th class="px-6 py-3">Expiry</th>
                <th class="px-6 py-3">Status</th>
                <th class="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr class="border-b border-gray-50">
                <td class="px-6 py-4 font-semibold text-gray-900 flex items-center gap-2">Lease Agreement.pdf</td>
                <td class="px-6 py-4 text-gray-500">Legal</td>
                <td class="px-6 py-4 text-gray-900">Jan 12</td>
                <td class="px-6 py-4 text-gray-900">Dec 31</td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[9px] font-bold text-[#165A31] bg-[#eefcf2]">
                    Valid
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <button class="text-gray-500 hover:text-gray-900 font-medium">Preview</button>
                </td>
              </tr>
              <tr class="border-b border-gray-50">
                <td class="px-6 py-4 font-semibold text-gray-900 flex items-center gap-2">Fire Safety Certificate.pdf</td>
                <td class="px-6 py-4 text-gray-500">Compliance</td>
                <td class="px-6 py-4 text-gray-900">Mar 02</td>
                <td class="px-6 py-4 text-gray-900">Sep 30</td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[9px] font-bold text-orange-600 bg-orange-50">
                    Expiring
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <button class="text-gray-500 hover:text-gray-900 font-medium">Preview</button>
                </td>
              </tr>
              <tr>
                <td class="px-6 py-4 font-semibold text-gray-900 flex items-center gap-2">Insurance.pdf</td>
                <td class="px-6 py-4 text-gray-500">Insurance</td>
                <td class="px-6 py-4 text-gray-900">Apr 18</td>
                <td class="px-6 py-4 text-gray-900">Apr 18, 2027</td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[9px] font-bold text-[#165A31] bg-[#eefcf2]">
                    Valid
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <button class="text-gray-500 hover:text-gray-900 font-medium">Preview</button>
                </td>
              </tr>
            </tbody>
          </table></div>
        </div>
      </div>
    </template>

    <!-- Activity Tab Content -->
    <template v-if="activeTab === 'Activity'">
      <!-- Branch Activity Card -->
      <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100">
          <h3 class="text-[13px] font-bold text-gray-900">Branch Activity</h3>
        </div>
        <div class="p-4 space-y-1">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 px-4 py-2.5 hover:bg-gray-50 transition-colors rounded-lg group">
            <div class="flex flex-wrap items-center gap-3">
              <div class="w-[3px] h-4 bg-[#165A31] rounded-full opacity-70 group-hover:opacity-100 transition-opacity"></div>
              <span class="text-[11px] font-bold text-gray-800">Stock transfer TR-119 dispatched</span>
            </div>
            <span class="text-[10px] font-medium text-gray-400">11:18</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 px-4 py-2.5 hover:bg-gray-50 transition-colors rounded-lg group">
            <div class="flex flex-wrap items-center gap-3">
              <div class="w-[3px] h-4 bg-[#165A31] rounded-full opacity-70 group-hover:opacity-100 transition-opacity"></div>
              <span class="text-[11px] font-bold text-gray-800">Order SO-7731 completed</span>
            </div>
            <span class="text-[10px] font-medium text-gray-400">10:42</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 px-4 py-2.5 hover:bg-gray-50 transition-colors rounded-lg group">
            <div class="flex flex-wrap items-center gap-3">
              <div class="w-[3px] h-4 bg-[#165A31] rounded-full opacity-70 group-hover:opacity-100 transition-opacity"></div>
              <span class="text-[11px] font-bold text-gray-800">Expense EXP-8831 updated</span>
            </div>
            <span class="text-[10px] font-medium text-gray-400">09:56</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 px-4 py-2.5 hover:bg-gray-50 transition-colors rounded-lg group">
            <div class="flex flex-wrap items-center gap-3">
              <div class="w-[3px] h-4 bg-[#165A31] rounded-full opacity-70 group-hover:opacity-100 transition-opacity"></div>
              <span class="text-[11px] font-bold text-gray-800">Unit BRG-DST1-992 moved to Available</span>
            </div>
            <span class="text-[10px] font-medium text-gray-400">09:31</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
