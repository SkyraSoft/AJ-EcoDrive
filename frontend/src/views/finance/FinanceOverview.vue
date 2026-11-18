<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '../../services/api.js'
import { store } from '@/store.js'
import BaseBarTrendChart from '@/components/charts/BaseBarTrendChart.vue'
import BaseBreakdownCard from '@/components/charts/BaseBreakdownCard.vue'
import DateFilterBar from '@/components/charts/DateFilterBar.vue'

const isBranchUser = computed(() => store.isBranchUser())
const branchName = computed(() => store.getActiveBranchName() || 'Peshawar')

const selectedRange = ref('30d')
const customStart = ref('')
const customEnd = ref('')

const kpis = ref([
  { label: 'Net Sales', value: 'PKR 28.4M' },
  { label: 'Collections', value: 'PKR 25.5M' },
  { label: 'Receivables', value: 'PKR 2.9M' },
  { label: 'Payables', value: 'PKR 6.1M' },
  { label: 'Expenses', value: 'PKR 3.2M' },
  { label: 'COGS', value: 'PKR 14.6M' },
  { label: 'Gross Profit', value: 'PKR 6.9M' },
  { label: 'Net Operating Profit', value: 'PKR 3.7M' }
])

const branchContributions = ref([
  { branch: 'Peshawar', percentage: 35 },
  { branch: 'Islamabad', percentage: 27 },
  { branch: 'Lahore', percentage: 22 },
  { branch: 'Rawalpindi', percentage: 16 }
])

const branchContributionItems = computed(() => {
  return branchContributions.value.map(b => ({
    label: b.branch,
    value: `${b.percentage}% share`,
    percentage: b.percentage
  }))
})

const cashCollectionsTrend = computed(() => [
  { period: 'Week 1', value: 5800000, formatted: 'PKR 5.80M' },
  { period: 'Week 2', value: 6400000, formatted: 'PKR 6.40M' },
  { period: 'Week 3', value: 6900000, formatted: 'PKR 6.90M' },
  { period: 'Week 4', value: 6400000, formatted: 'PKR 6.40M' }
])

onMounted(async () => {
  try {
    const res = await api.finance.getOverview()
    if (res && Array.isArray(res.kpiList)) {
      kpis.value = res.kpiList
    } else if (res && Array.isArray(res.kpis)) {
      kpis.value = res.kpis
    }
    if (res && Array.isArray(res.branchContributions)) {
      branchContributions.value = res.branchContributions
    }
  } catch (err) {
    // Graceful fallback to baseline
  }
})
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div data-tour-id="bm.finance.overview.header" class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <div class="text-[10px] text-slate-500 mb-1">
          <span v-if="isBranchUser">Branch Manager / {{ branchName }} Branch / <span class="font-bold text-slate-800">Finance Overview</span></span>
          <span v-else>Super Admin / Head Office / <span class="font-bold text-slate-800">Finance Overview</span></span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-slate-900">Finance Overview</h1>
        <p class="text-sm text-slate-500 mt-1">Operational view of collections, receivables, payables, expenses and profitability.</p>
      </div>

      <DateFilterBar 
        v-model="selectedRange" 
        v-model:custom-start-date="customStart"
        v-model:custom-end-date="customEnd"
      />
    </div>

    <!-- 8 KPI Cards Grid -->
    <div data-tour-id="bm.finance.overview.kpis" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div 
        v-for="(kpi, index) in kpis" 
        :key="index" 
        class="bg-white p-5 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] flex flex-col justify-between"
      >
        <div class="text-xs font-semibold text-slate-500 mb-2">{{ kpi.label }}</div>
        <div class="text-[22px] font-bold text-slate-900 leading-none">{{ kpi.value }}</div>
      </div>
    </div>

    <!-- Charts & Analytics Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- Branch Contribution -->
      <div data-tour-id="bm.finance.overview.contributions" class="bg-white p-6 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] flex flex-col justify-between">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-sm font-semibold text-slate-900">Branch Contribution</h3>
            <p class="text-xs text-slate-500 mt-0.5">Revenue collection share across showroom network</p>
          </div>
        </div>
        
        <div class="flex-1 flex flex-col justify-center">
          <BaseBreakdownCard :items="branchContributionItems" primary-color="#2563EB" />
        </div>
      </div>

      <!-- Cash Collections Bar Graph -->
      <div data-tour-id="bm.finance.overview.collections" class="bg-white p-6 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] flex flex-col justify-between">
        <div class="flex items-center justify-between mb-3">
          <div>
            <h3 class="text-sm font-semibold text-slate-900">Cash Collections</h3>
            <p class="text-xs text-slate-500 mt-0.5">Collections bar volume progression</p>
          </div>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
            Collections
          </span>
        </div>
        
        <div class="flex-1 min-h-[220px]">
          <BaseBarTrendChart
            :data-points="cashCollectionsTrend"
            series-name="Collections"
            primary-color="#2563EB"
            height-class="h-60"
            :show-values="true"
          />
        </div>
      </div>

    </div>
  </div>
</template>
