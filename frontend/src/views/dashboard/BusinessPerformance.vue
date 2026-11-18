<script setup>
import { ref, computed } from 'vue'
import BaseBarTrendChart from '../../components/charts/BaseBarTrendChart.vue'
import BaseBreakdownCard from '../../components/charts/BaseBreakdownCard.vue'
import DateFilterBar from '../../components/charts/DateFilterBar.vue'

const selectedRange = ref('30d')
const customStart = ref('')
const customEnd = ref('')

const kpis = [
  { label: 'Revenue', value: 'PKR 28.4M', change: '+12.8%' },
  { label: 'Purchases', value: 'PKR 14.6M', change: '+4.1%' },
  { label: 'COGS', value: 'PKR 16.7M', change: '+7.5%' },
  { label: 'Expenses', value: 'PKR 3.2M', change: '-2.4%' },
  { label: 'Gross Profit', value: 'PKR 6.9M', change: '+15.0%' },
  { label: 'Net Operating Profit', value: 'PKR 3.7M', change: '+21.4%' },
  { label: 'Margin', value: '13.0%', change: '+1.2 pts' },
  { label: 'Collections', value: 'PKR 25.5M', change: '89.8%' }
]

const branchContribution = [
  { name: 'Peshawar', value: 35, percentage: 100 },
  { name: 'Islamabad', value: 27, percentage: 77 },
  { name: 'Lahore', value: 22, percentage: 62 },
  { name: 'Rawalpindi', value: 16, percentage: 45 }
]

const branchContributionItems = branchContribution.map(b => ({
  label: b.name,
  value: `${b.value}% share`,
  percentage: b.percentage
}))

const baseProfitabilityPoints = [
  { period: 'Nov', value: 24200000, formatted: 'PKR 24.2M' },
  { period: 'Dec', value: 25800000, formatted: 'PKR 25.8M' },
  { period: 'Jan', value: 26100000, formatted: 'PKR 26.1M' },
  { period: 'Feb', value: 27400000, formatted: 'PKR 27.4M' },
  { period: 'Mar', value: 27900000, formatted: 'PKR 27.9M' },
  { period: 'Apr', value: 28400000, formatted: 'PKR 28.4M' }
]

const baseNetProfitPoints = [
  { period: 'Nov', value: 2800000, formatted: 'PKR 2.80M' },
  { period: 'Dec', value: 3100000, formatted: 'PKR 3.10M' },
  { period: 'Jan', value: 3200000, formatted: 'PKR 3.20M' },
  { period: 'Feb', value: 3400000, formatted: 'PKR 3.40M' },
  { period: 'Mar', value: 3550000, formatted: 'PKR 3.55M' },
  { period: 'Apr', value: 3700000, formatted: 'PKR 3.70M' }
]

const profitabilityPoints = computed(() => {
  if (selectedRange.value === '7d') {
    return [
      { period: 'Day 1', value: 3800000, formatted: 'PKR 3.8M' },
      { period: 'Day 2', value: 4100000, formatted: 'PKR 4.1M' },
      { period: 'Day 3', value: 3950000, formatted: 'PKR 3.9M' },
      { period: 'Day 4', value: 4300000, formatted: 'PKR 4.3M' },
      { period: 'Day 5', value: 4500000, formatted: 'PKR 4.5M' },
      { period: 'Day 6', value: 4200000, formatted: 'PKR 4.2M' },
      { period: 'Day 7', value: 4700000, formatted: 'PKR 4.7M' }
    ]
  }
  if (selectedRange.value === '30d') {
    return [
      { period: 'Week 1', value: 6800000, formatted: 'PKR 6.8M' },
      { period: 'Week 2', value: 7100000, formatted: 'PKR 7.1M' },
      { period: 'Week 3', value: 7200000, formatted: 'PKR 7.2M' },
      { period: 'Week 4', value: 7300000, formatted: 'PKR 7.3M' }
    ]
  }
  if (selectedRange.value === '3m') {
    return baseProfitabilityPoints.slice(-3)
  }
  return baseProfitabilityPoints
})

const netProfitPoints = computed(() => {
  if (selectedRange.value === '7d') {
    return [
      { period: 'Day 1', value: 480000, formatted: 'PKR 0.48M' },
      { period: 'Day 2', value: 520000, formatted: 'PKR 0.52M' },
      { period: 'Day 3', value: 510000, formatted: 'PKR 0.51M' },
      { period: 'Day 4', value: 550000, formatted: 'PKR 0.55M' },
      { period: 'Day 5', value: 580000, formatted: 'PKR 0.58M' },
      { period: 'Day 6', value: 540000, formatted: 'PKR 0.54M' },
      { period: 'Day 7', value: 610000, formatted: 'PKR 0.61M' }
    ]
  }
  if (selectedRange.value === '30d') {
    return [
      { period: 'Week 1', value: 880000, formatted: 'PKR 0.88M' },
      { period: 'Week 2', value: 920000, formatted: 'PKR 0.92M' },
      { period: 'Week 3', value: 940000, formatted: 'PKR 0.94M' },
      { period: 'Week 4', value: 960000, formatted: 'PKR 0.96M' }
    ]
  }
  if (selectedRange.value === '3m') {
    return baseNetProfitPoints.slice(-3)
  }
  return baseNetProfitPoints
})

const topProducts = [
  { name: 'BRG DS11', revenue: '6.4M', units: '41', margin: '18.8%' },
  { name: 'BRG EV-5', revenue: '5.1M', units: '35', margin: '16.4%' },
  { name: 'Cargo Pro', revenue: '3.8M', units: '21', margin: '20.2%' }
]

const topCategories = [
  { name: 'Electric Bikes', revenue: '16.8M', grossProfit: '4.2M', share: '59%' },
  { name: 'Cargo', revenue: '7.2M', grossProfit: '1.7M', share: '25%' },
  { name: 'Scooters', revenue: '4.4M', grossProfit: '1.0M', share: '16%' }
]
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <div class="text-[10px] text-slate-500 mb-1">Super Admin / <span class="font-bold text-slate-800">Business Performance</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-slate-900">Business Performance</h1>
        <p class="text-sm text-slate-500 mt-1">Organisation-wide revenue, cost, profitability and collection analysis.</p>
      </div>

      <!-- Date Filter Bar (Design 3 5-Controls) -->
      <DateFilterBar 
        v-model="selectedRange" 
        v-model:custom-start-date="customStart"
        v-model:custom-end-date="customEnd"
      />
    </div>

    <!-- 8 KPI Cards -->
    <div data-tour-id="sa.dashboard.biz-perf.kpis" class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="(kpi, index) in kpis" :key="index" class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <div class="text-xs font-semibold text-gray-400 mb-3">{{ kpi.label }}</div>
        <div class="flex items-end justify-between">
          <div class="text-[22px] font-bold text-gray-900 leading-none">{{ kpi.value }}</div>
          <div class="text-[10px] font-bold flex items-center gap-0.5 pb-0.5 text-[#209249]">
            {{ kpi.change }}
          </div>
        </div>
      </div>
    </div>

    <!-- Middle Grids -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Profitability Trend (Grouped Bar Chart: Blue Revenue + Green Net Profit) -->
      <div data-tour-id="sa.dashboard.biz-perf.trend" class="bg-white p-6 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] flex flex-col justify-between">
        <div class="flex items-center justify-between mb-3">
          <div>
            <h3 class="text-sm font-semibold text-slate-900">Profitability Performance</h3>
            <p class="text-xs text-slate-500 mt-0.5">Revenue & net operating profit bar comparison</p>
          </div>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
            Profit & Margin
          </span>
        </div>
        <div class="flex-1 min-h-[220px]">
          <BaseBarTrendChart
            :data-points="profitabilityPoints"
            series-name="Revenue"
            primary-color="#2563EB"
            :secondary-points="netProfitPoints"
            secondary-series-name="Net Profit"
            secondary-color="#10B981"
            :format-value="(v) => 'PKR ' + (v / 1000000).toFixed(1) + 'M'"
            height-class="h-60"
            :show-values="true"
          />
        </div>
      </div>
      
      <!-- Branch Contribution -->
      <div class="bg-white p-6 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] flex flex-col">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-sm font-semibold text-slate-900">Branch Contribution</h3>
            <p class="text-xs text-slate-500 mt-0.5">Revenue share percentage across showroom network</p>
          </div>
        </div>
        <div class="flex-1 flex flex-col justify-center">
          <BaseBreakdownCard :items="branchContributionItems" primary-color="#2563EB" />
        </div>
      </div>
    </div>

    <!-- Bottom Tables Grid -->
    <div class="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-4">
      
      <!-- Top Products -->
      <div data-tour-id="sa.dashboard.biz-perf.top-products" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h3 class="text-[13px] font-bold text-gray-900">Top Products</h3>
        </div>
        
        <div class="overflow-x-auto">
          <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th class="px-5 py-3">Product</th>
                <th class="px-5 py-3">Revenue</th>
                <th class="px-5 py-3">Units</th>
                <th class="px-5 py-3 text-right">Margin</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="product in topProducts" :key="product.name" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td class="px-5 py-4 font-semibold text-gray-800">{{ product.name }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ product.revenue }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ product.units }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium text-right">{{ product.margin }}</td>
              </tr>
            </tbody>
          </table></div>
        </div>
      </div>

      <!-- Top Categories -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h3 class="text-[13px] font-bold text-gray-900">Top Categories</h3>
        </div>
        
        <div class="overflow-x-auto">
          <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th class="px-5 py-3">Category</th>
                <th class="px-5 py-3">Revenue</th>
                <th class="px-5 py-3">Gross Profit</th>
                <th class="px-5 py-3 text-right">Share</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="category in topCategories" :key="category.name" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td class="px-5 py-4 font-semibold text-gray-800">{{ category.name }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ category.revenue }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ category.grossProfit }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium text-right">{{ category.share }}</td>
              </tr>
            </tbody>
          </table></div>
        </div>
      </div>

    </div>
  </div>
</template>
