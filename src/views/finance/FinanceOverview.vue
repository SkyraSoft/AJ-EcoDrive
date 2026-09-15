<script setup>
const kpis = [
  { label: 'Net Sales', value: 'PKR 28.4M' },
  { label: 'Collections', value: 'PKR 25.5M' },
  { label: 'Receivables', value: 'PKR 2.9M' },
  { label: 'Payables', value: 'PKR 6.1M' },
  { label: 'Expenses', value: 'PKR 3.2M' },
  { label: 'COGS', value: 'PKR 14.6M' },
  { label: 'Gross Profit', value: 'PKR 6.9M' },
  { label: 'Net Operating Profit', value: 'PKR 3.7M' }
]

const branchContributions = [
  { branch: 'Peshawar', percentage: 35 },
  { branch: 'Islamabad', percentage: 27 },
  { branch: 'Lahore', percentage: 22 },
  { branch: 'Rawalpindi', percentage: 16 }
]
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div>
      <div class="text-[10px] text-gray-500 mb-1">
        Super Admin / Finance / <span class="font-bold text-gray-800">Finance Overview</span>
      </div>
      <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Finance Overview</h1>
      <p class="text-sm text-gray-500 mt-1">Operational view of collections, receivables, payables, expenses and profitability.</p>
    </div>

    <!-- 8 KPI Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div 
        v-for="(kpi, index) in kpis" 
        :key="index" 
        class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between"
      >
        <div class="text-xs font-semibold text-gray-400 mb-2">{{ kpi.label }}</div>
        <div class="text-[22px] font-bold text-gray-900 leading-none">{{ kpi.value }}</div>
      </div>
    </div>

    <!-- Charts & Analytics Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- Branch Contribution -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-5">
        <h3 class="text-[13px] font-bold text-gray-900">Branch Contribution</h3>
        
        <div class="space-y-4 pt-2">
          <div v-for="item in branchContributions" :key="item.branch" class="space-y-1.5">
            <div class="flex items-center justify-between text-xs">
              <span class="font-medium text-gray-700">{{ item.branch }}</span>
              <span class="font-bold text-gray-900">{{ item.percentage }}%</span>
            </div>
            <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div 
                class="bg-[#165A31] h-full rounded-full transition-all duration-500" 
                :style="{ width: `${item.percentage}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cash Collections Trend -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-5 flex flex-col justify-between">
        <h3 class="text-[13px] font-bold text-gray-900">Cash Collections</h3>
        
        <div class="h-48 flex items-center justify-center relative p-4">
          <!-- Simplified SVG Trend Line -->
          <svg class="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke="#165A31"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
              points="10,95 70,88 140,82 210,75 280,68 350,55 390,48"
            />
          </svg>
        </div>

        <div class="flex items-center justify-between text-[11px] text-gray-400 border-t border-gray-50 pt-3">
          <span>Week 1</span>
          <span>Week 2</span>
          <span>Week 3</span>
          <span>Week 4</span>
        </div>
      </div>

    </div>
  </div>
</template>
