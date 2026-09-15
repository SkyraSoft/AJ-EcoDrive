<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '@/store'
import { X, FileText, CheckCircle2 } from 'lucide-vue-next'

const router = useRouter()
const emit = defineEmits(['close', 'created'])

const form = ref({
  name: 'Custom Operations Audit',
  category: 'Sales Reports',
  scope: 'All Branches',
  dateRange: 'This Month',
  comparison: 'Previous Period',
  status: 'All Active',
  schedule: 'Monthly',
  format: 'PDF Summary',
  email: 'admin@ajecodrive.com',
  metrics: {
    revenue: true,
    volume: true,
    orders: true,
    margins: true,
    kpi: true
  }
})

const close = () => {
  emit('close')
}

const submitForm = () => {
  const newReport = {
    report: form.value.name,
    owner: 'Super Admin',
    scope: form.value.scope,
    lastRun: 'Just now',
    schedule: form.value.schedule
  }

  emit('created', newReport)
  close()
}
</script>

<template>
  <div class="fixed inset-0 bg-gray-900/50 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm" @click.self="close">
    <!-- Close button on top-right of screen overlay -->
    <button @click="close" class="fixed top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-100 rounded-full z-[110] shadow-lg transition-colors cursor-pointer">
      <X class="w-5 h-5" />
    </button>

    <div class="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">

      <!-- Scrollable Body -->
      <div class="flex-1 overflow-y-auto p-6 sm:p-8">
        <div class="space-y-6">
          
          <!-- Header -->
          <div>
            <div class="text-[10px] text-gray-500 mb-1">
              Super Admin / Analytics / Reports Hub / <span class="font-bold text-gray-800">Build Custom Report</span>
            </div>
            <h1 class="text-[28px] sm:text-[32px] tracking-tight font-bold text-gray-900">Build Report</h1>
            <p class="text-xs sm:text-sm text-gray-500 mt-1">Configure custom operational parameters, filters, metrics and schedule.</p>
          </div>

          <!-- Form Grid (4 Cards) -->
          <form @submit.prevent="submitForm" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <!-- 1. Report Setup -->
              <div class="bg-white p-5 sm:p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
                <h3 class="text-[13px] font-bold text-gray-900">Report Setup</h3>
                
                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Report Title</label>
                  <input 
                    v-model="form.name" 
                    type="text" 
                    placeholder="Enter report title..." 
                    required
                    class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" 
                  />
                </div>
                
                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Category</label>
                  <select 
                    v-model="form.category" 
                    class="w-full px-3 py-2 text-[12px] text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white"
                  >
                    <option value="Sales Reports">Sales Reports</option>
                    <option value="Inventory Reports">Inventory Reports</option>
                    <option value="Procurement Reports">Procurement Reports</option>
                    <option value="Expense Reports">Expense Reports</option>
                    <option value="Profitability Reports">Profitability Reports</option>
                    <option value="CRM Reports">CRM Reports</option>
                  </select>
                </div>

                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Branch Scope</label>
                  <select 
                    v-model="form.scope" 
                    class="w-full px-3 py-2 text-[12px] text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white"
                  >
                    <option value="All Branches">All Branches</option>
                    <option value="Peshawar">Peshawar</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                  </select>
                </div>
              </div>

              <!-- 2. Date Range & Filter -->
              <div class="bg-white p-5 sm:p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
                <h3 class="text-[13px] font-bold text-gray-900">Date & Comparison</h3>
                
                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Date Range</label>
                  <select 
                    v-model="form.dateRange" 
                    class="w-full px-3 py-2 text-[12px] text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white"
                  >
                    <option value="This Month">This Month</option>
                    <option value="Last 30 Days">Last 30 Days</option>
                    <option value="This Quarter">This Quarter</option>
                    <option value="Year to Date">Year to Date</option>
                    <option value="Custom Range">Custom Range</option>
                  </select>
                </div>

                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Comparison Benchmark</label>
                  <select 
                    v-model="form.comparison" 
                    class="w-full px-3 py-2 text-[12px] text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white"
                  >
                    <option value="Previous Period">Previous Period</option>
                    <option value="Previous Year">Previous Year (YoY)</option>
                    <option value="None">None (Absolute Values)</option>
                  </select>
                </div>

                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Status Filter</label>
                  <select 
                    v-model="form.status" 
                    class="w-full px-3 py-2 text-[12px] text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white"
                  >
                    <option value="All Active">All Active Records</option>
                    <option value="Completed Only">Completed / Settled Only</option>
                    <option value="Pending Only">Pending / In Review Only</option>
                  </select>
                </div>
              </div>

              <!-- 3. Metrics & Data Breakdown -->
              <div class="bg-white p-5 sm:p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
                <h3 class="text-[13px] font-bold text-gray-900">Included Metrics</h3>
                
                <div class="space-y-2.5 pt-1">
                  <label class="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer">
                    <input type="checkbox" v-model="form.metrics.revenue" class="rounded text-[#165A31] focus:ring-[#165A31] w-4 h-4" />
                    <span>Net Sales & Revenue Breakdown</span>
                  </label>

                  <label class="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer">
                    <input type="checkbox" v-model="form.metrics.volume" class="rounded text-[#165A31] focus:ring-[#165A31] w-4 h-4" />
                    <span>Unit Volumes & Inventory Inflow/Outflow</span>
                  </label>

                  <label class="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer">
                    <input type="checkbox" v-model="form.metrics.orders" class="rounded text-[#165A31] focus:ring-[#165A31] w-4 h-4" />
                    <span>Order & Transaction Counts</span>
                  </label>

                  <label class="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer">
                    <input type="checkbox" v-model="form.metrics.margins" class="rounded text-[#165A31] focus:ring-[#165A31] w-4 h-4" />
                    <span>Gross Profit Margins & Discounts</span>
                  </label>

                  <label class="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer">
                    <input type="checkbox" v-model="form.metrics.kpi" class="rounded text-[#165A31] focus:ring-[#165A31] w-4 h-4" />
                    <span>Variance against Target Budgets</span>
                  </label>
                </div>
              </div>

              <!-- 4. Schedule & Automation -->
              <div class="bg-white p-5 sm:p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
                <h3 class="text-[13px] font-bold text-gray-900">Schedule & Delivery</h3>
                
                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Schedule Frequency</label>
                  <select 
                    v-model="form.schedule" 
                    class="w-full px-3 py-2 text-[12px] text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white"
                  >
                    <option value="One-time (Now)">One-time (Run immediately)</option>
                    <option value="Daily">Daily Summary</option>
                    <option value="Weekly">Weekly Digest</option>
                    <option value="Monthly">Monthly Full Report</option>
                  </select>
                </div>

                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Export Format</label>
                  <select 
                    v-model="form.format" 
                    class="w-full px-3 py-2 text-[12px] text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white"
                  >
                    <option value="PDF Summary">PDF Document (.pdf)</option>
                    <option value="Excel / CSV">Excel Spreadsheet (.xlsx / .csv)</option>
                    <option value="Interactive View">Interactive Dashboard View</option>
                  </select>
                </div>

                <div>
                  <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Recipient Notification</label>
                  <input 
                    v-model="form.email" 
                    type="email" 
                    placeholder="admin@ajecodrive.com" 
                    class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" 
                  />
                </div>
              </div>

            </div>

            <!-- Actions Bar -->
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button 
                type="button" 
                @click="close" 
                class="px-5 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="px-5 py-2 text-[11px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05)] cursor-pointer"
              >
                Generate Report
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  </div>
</template>
