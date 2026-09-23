<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, CheckCircle2, ChevronDown, Check, Download } from 'lucide-vue-next'
import { store } from '@/store'
import BuildReportModal from './BuildReport.vue'

const router = useRouter()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

// --- BRANCH MANAGER VIEW DATA ---
const branchKPIs = [
  { label: 'Current Period', value: 'PKR 8.7M', subtext: 'Selected period', subtextClass: 'text-[#165A31] font-medium' },
  { label: 'Prior Period', value: 'PKR 7.9M', subtext: '+10%', subtextClass: 'text-[#165A31] font-medium' },
  { label: 'Records', value: '248', subtext: 'Branch only', subtextClass: 'text-[#165A31] font-medium' },
  { label: 'Export', value: 'Ready', subtext: 'CSV / PDF', subtextClass: 'text-[#165A31] font-medium' }
]

const selectedDateRange = ref('This Month')
const selectedSavedView = ref('Saved View')
const openDropdown = ref(null)

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const showToast = ref(false)
const toastMessage = ref('')

const triggerExport = (type) => {
  toastMessage.value = `Exporting ${type} report for ${user.value?.branchName || 'Peshawar'} Branch...`
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3000)
}

// Bars for Trend chart (matching screenshot 1)
const trendBars = [
  { height: '55%' },
  { height: '75%' },
  { height: '65%' },
  { height: '90%' },
  { height: '80%' },
  { height: '100%' }
]

// --- SUPER ADMIN VIEW DATA ---
const showBuildReportModal = ref(false)

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
  <!-- Toast Notification -->
  <div 
    v-if="showToast" 
    class="fixed bottom-5 right-5 z-[110] bg-[#165A31] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200"
  >
    <CheckCircle2 class="w-5 h-5 text-green-300" />
    <span class="text-xs font-bold">{{ toastMessage }}</span>
  </div>

  <!-- BRANCH MANAGER VIEW (Matching Screenshot 1) -->
  <div v-if="isBranchUser" class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openDropdown = null">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[11px] text-gray-400 mb-1">
          Branch Manager / My Branch Reports / <span class="font-medium text-gray-600">Reports Hub</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Reports Hub</h1>
        <p class="text-xs text-gray-500 mt-1">Branch-only report library with date filters, saved views and exports.</p>
      </div>
    </div>

    <!-- 4 KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div 
        v-for="kpi in branchKPIs" 
        :key="kpi.label" 
        class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]"
      >
        <div class="text-[11px] font-semibold text-gray-500 mb-2">{{ kpi.label }}</div>
        <div class="text-2xl font-bold text-gray-900">{{ kpi.value }}</div>
        <div :class="['text-[11px] mt-1', kpi.subtextClass]">{{ kpi.subtext }}</div>
      </div>
    </div>

    <!-- Filters Row -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="flex flex-wrap items-center gap-2">
        <!-- Date Filter Dropdown -->
        <div class="relative">
          <button 
            @click.stop="toggleDropdown('date')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <span>{{ selectedDateRange }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div 
            v-if="openDropdown === 'date'" 
            class="absolute top-full left-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <button 
              v-for="d in ['Today', 'This Week', 'This Month', 'Last 30 days', 'All Time']" 
              :key="d"
              @click="selectedDateRange = d; openDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
              :class="selectedDateRange === d ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ d }}</span>
              <Check v-if="selectedDateRange === d" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <!-- Saved View Dropdown -->
        <div class="relative">
          <button 
            @click.stop="toggleDropdown('view')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <span>{{ selectedSavedView }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div 
            v-if="openDropdown === 'view'" 
            class="absolute top-full left-0 mt-1 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <button 
              v-for="v in ['Saved View', 'Default Overview', 'Branch Target View', 'Performance Summary']" 
              :key="v"
              @click="selectedSavedView = v; openDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
              :class="selectedSavedView === v ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ v }}</span>
              <Check v-if="selectedSavedView === v" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>
      </div>

      <!-- Export Buttons -->
      <div class="flex items-center gap-2">
        <button 
          @click="triggerExport('CSV')" 
          class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
        >
          Export CSV
        </button>
        <button 
          @click="triggerExport('PDF')" 
          class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
        >
          Export PDF
        </button>
      </div>
    </div>

    <!-- 2-Card Layout (Matching Screenshot 1) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Left Card: Trend (Span 7) -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 lg:col-span-7 flex flex-col justify-between min-h-[280px]">
        <h3 class="text-sm font-bold text-gray-900 mb-6">Trend</h3>
        
        <!-- Bar Chart (Matching Screenshot 1 light green columns) -->
        <div class="flex-1 flex items-end justify-between px-4 sm:px-8 pb-4 h-48 gap-3 sm:gap-4">
          <div 
            v-for="(bar, idx) in trendBars" 
            :key="idx" 
            class="flex-1 max-w-[42px] bg-[#86efac] rounded-t-[4px] transition-all hover:bg-[#4ade80]"
            :style="{ height: bar.height }"
          ></div>
        </div>
      </div>

      <!-- Right Card: Key Breakdown (Span 5) -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 lg:col-span-5 space-y-4">
        <h3 class="text-sm font-bold text-gray-900 mb-4">Key Breakdown</h3>
        
        <div class="grid grid-cols-2 gap-3.5">
          <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
            <span class="text-[10px] font-medium text-gray-400">Top Segment</span>
            <span class="text-xs font-bold text-gray-900 mt-1">BRG E-Series</span>
          </div>

          <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
            <span class="text-[10px] font-medium text-gray-400">Contribution</span>
            <span class="text-xs font-bold text-gray-900 mt-1">38%</span>
          </div>

          <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
            <span class="text-[10px] font-medium text-gray-400">Comparison</span>
            <span class="text-xs font-bold text-gray-900 mt-1">+10%</span>
          </div>

          <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
            <span class="text-[10px] font-medium text-gray-400">Scope</span>
            <span class="text-xs font-bold text-gray-900 mt-1">{{ user?.branchName || 'Peshawar' }} Branch</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- SUPER ADMIN VIEW -->
  <div v-else class="max-w-[1400px] mx-auto space-y-6 pb-12">
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
        <span>Build Report</span>
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
