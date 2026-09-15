<script setup>
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
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / <span class="font-bold text-gray-800">Business Performance</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Business Performance</h1>
        <p class="text-sm text-gray-500 mt-1">Organisation-wide revenue, cost, profitability and collection analysis.</p>
      </div>
    </div>

    <!-- 8 KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
    <div class="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Profitability Trend (Line chart placeholder) -->
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col">
        <h3 class="text-[13px] font-bold text-gray-900 mb-4">Profitability Trend</h3>
        <div class="flex-1 min-h-[160px] bg-[#f8faf9] rounded-lg flex items-center justify-center relative overflow-hidden">
           <!-- Simple SVG Line placeholder -->
           <svg class="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
             <!-- Secondary line -->
             <polyline points="0,22 30,20 60,18 100,16" fill="none" stroke="#d1d5db" stroke-width="0.5" vector-effect="non-scaling-stroke"/>
             <!-- Primary line -->
             <polyline points="0,20 30,18 60,16 100,13" fill="none" stroke="#209249" stroke-width="0.5" vector-effect="non-scaling-stroke"/>
           </svg>
        </div>
      </div>
      
      <!-- Branch Contribution -->
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col">
        <h3 class="text-[13px] font-bold text-gray-900 mb-5">Branch Contribution</h3>
        <div class="space-y-4 flex-1 flex flex-col justify-center">
          <div v-for="branch in branchContribution" :key="branch.name" class="flex flex-wrap items-center gap-4">
            <div class="w-16 text-[11px] font-medium text-gray-800">{{ branch.name }}</div>
            <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full bg-[#209249] rounded-full" :style="{ width: branch.percentage + '%' }"></div>
            </div>
            <div class="w-6 text-right text-[11px] font-bold text-gray-900">{{ branch.value }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Tables Grid -->
    <div class="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-4">
      
      <!-- Top Products -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
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
