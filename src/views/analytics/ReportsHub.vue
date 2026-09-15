<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, CheckCircle2 } from 'lucide-vue-next'
import BuildReportModal from './BuildReport.vue'

const router = useRouter()
const showBuildReportModal = ref(false)
const showToast = ref(false)
const toastMessage = ref('')

const reportTypes = [
  { title: 'Sales Reports', desc: 'Net sales, units, orders, discounts, payments and collections.', route: '/analytics/reports/sales' },
  { title: 'Inventory Reports', desc: 'Stock, valuation, aging, movement, serialized units.', route: '/analytics/reports/inventory' },
  { title: 'Procurement Reports', desc: 'POs, receipts, landed cost, supplier performance.', route: '/analytics/reports/procurement' },
  { title: 'Expense Reports', desc: 'Expense categories, branches, approval and recurring spend.', route: '/analytics/reports/expense' },
  { title: 'Profitability Reports', desc: 'Gross profit, net operating profit, branch and product margin.', route: '/analytics/reports/profitability' },
  { title: 'CRM Reports', desc: 'Leads, conversion, follow-ups, customer value and balances.', route: '/analytics/reports/crm' }
]

const recentReports = ref([
  { report: 'Monthly Branch P&L', owner: 'Super Admin', scope: 'All Branches', lastRun: 'Today', schedule: 'Monthly', route: '/analytics/reports/profitability' },
  { report: 'Low Stock & Aging', owner: 'Super Admin', scope: 'All Branches', lastRun: 'Today', schedule: 'Weekly', route: '/analytics/reports/inventory' }
])

const handleReportCreated = (newReport) => {
  recentReports.value.unshift({
    ...newReport,
    route: '/analytics/reports/sales'
  })
  toastMessage.value = `Report "${newReport.report}" built successfully!`
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 4000)
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Toast Notification -->
    <div 
      v-if="showToast" 
      class="fixed bottom-5 right-5 z-[110] bg-[#165A31] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200"
    >
      <CheckCircle2 class="w-5 h-5 text-green-300" />
      <span class="text-xs font-bold">{{ toastMessage }}</span>
    </div>

    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">
          Super Admin / Analytics / <span class="font-bold text-gray-800">Reports Hub</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Reports Hub</h1>
        <p class="text-sm text-gray-500 mt-1">Run, save, export and schedule operational reports.</p>
      </div>
      
      <button 
        @click="showBuildReportModal = true"
        class="bg-[#165A31] text-white text-[11px] font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer"
      >
        <Plus class="w-4 h-4" />
        + Build Report
      </button>
    </div>

    <!-- Report Types Grid (6 Cards) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="(type, idx) in reportTypes" 
        :key="idx" 
        @click="router.push(type.route)"
        class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] cursor-pointer hover:border-[#165A31] hover:shadow-md transition-all group"
      >
        <h3 class="text-[13px] font-bold text-gray-900 mb-2 group-hover:text-[#165A31] transition-colors">{{ type.title }}</h3>
        <p class="text-xs text-gray-600 leading-relaxed">{{ type.desc }}</p>
      </div>
    </div>

    <!-- Saved & Recent Reports Table -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100">
        <h3 class="text-[13px] font-bold text-gray-900">Saved & Recent Reports</h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <th class="px-5 py-3">Report</th>
              <th class="px-5 py-3">Owner</th>
              <th class="px-5 py-3">Scope</th>
              <th class="px-5 py-3">Last Run</th>
              <th class="px-5 py-3">Schedule</th>
              <th class="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr 
              v-for="(report, idx) in recentReports" 
              :key="idx" 
              @click="router.push(report.route)"
              class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer group"
            >
              <td class="px-5 py-4 font-semibold text-gray-900 group-hover:text-[#165A31] transition-colors">{{ report.report }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ report.owner }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ report.scope }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ report.lastRun }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ report.schedule }}</td>
              <td class="px-5 py-4 text-right">
                <div class="flex items-center justify-end gap-1 text-gray-400 group-hover:text-[#165A31] font-medium tracking-wide">
                  <span>Open</span>
                  <span class="text-sm leading-none">&rarr;</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Build Report Modal -->
    <BuildReportModal 
      v-if="showBuildReportModal" 
      @close="showBuildReportModal = false" 
      @created="handleReportCreated"
    />
  </div>
</template>
