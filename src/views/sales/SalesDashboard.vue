<script setup>
const kpis = [
  { label: 'Net Sales', value: 'PKR 28.4M', change: '+12.8%', positive: true },
  { label: 'Units Sold', value: '184', change: '+8.2%', positive: true },
  { label: 'Orders', value: '197', change: '+6.4%', positive: true },
  { label: 'Avg Sale', value: 'PKR 144K', change: '+4.1%', positive: true },
  { label: 'Discounts', value: 'PKR 0.9M' },
  { label: 'Gross Profit', value: 'PKR 6.9M', change: '+15.0%', positive: true },
  { label: 'Collections', value: 'PKR 25.5M' },
  { label: 'Outstanding', value: 'PKR 2.9M', subtitle: '17 overdue', positive: false }
]

const branchSales = [
  { name: 'Peshawar', value: 98, percentage: 100 },
  { name: 'Islamabad', value: 76, percentage: 78 },
  { name: 'Lahore', value: 62, percentage: 63 },
  { name: 'Rawalpindi', value: 49, percentage: 50 }
]

const topProducts = [
  { name: 'BRG DS11', revenue: '6.4M', units: '41', margin: '18.8%' },
  { name: 'BRG EV-5', revenue: '5.1M', units: '35', margin: '16.4%' },
  { name: 'Cargo Pro', revenue: '3.8M', units: '21', margin: '20.2%' }
]

const collections = [
  { branch: 'Peshawar', collected: '8.9M', outstanding: '0.9M', overdue: '3' },
  { branch: 'Islamabad', collected: '6.8M', outstanding: '0.8M', overdue: '5' },
  { branch: 'Lahore', collected: '5.8M', outstanding: '0.6M', overdue: '4' }
]
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Sales & CRM / <span class="font-bold text-gray-800">Sales Dashboard</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Sales Dashboard</h1>
        <p class="text-sm text-gray-500 mt-1">Monitor sales, units, discounts, collections and branch performance.</p>
      </div>
    </div>

    <!-- 8 KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="(kpi, index) in kpis" :key="index" class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <div class="text-xs font-semibold text-gray-400 mb-3">{{ kpi.label }}</div>
        <div class="flex items-end justify-between">
          <div class="text-[22px] font-bold text-gray-900 leading-none">{{ kpi.value }}</div>
          
          <div v-if="kpi.change" class="text-[10px] font-bold flex items-center gap-0.5 pb-0.5" 
            :class="kpi.positive ? 'text-[#209249]' : 'text-red-500'">
            {{ kpi.change }}
          </div>
          <div v-else-if="kpi.subtitle" class="text-[10px] font-bold pb-0.5"
            :class="kpi.positive === false ? 'text-red-500' : 'text-gray-400'">
            {{ kpi.subtitle }}
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Sales Trend -->
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] lg:col-span-2 flex flex-col">
        <h3 class="text-[13px] font-bold text-gray-900 mb-4">Sales Trend</h3>
        <div class="flex-1 min-h-[160px] bg-[#f0f9f4] rounded-lg flex items-center justify-center relative">
           <!-- Simple SVG Line placeholder -->
           <svg class="w-full h-[120px]" viewBox="0 0 100 30" preserveAspectRatio="none">
             <polyline points="0,25 20,24 40,22 60,20 80,18 100,16" fill="none" stroke="#209249" stroke-width="0.5" vector-effect="non-scaling-stroke"/>
           </svg>
        </div>
      </div>
      
      <!-- Branch Sales -->
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col">
        <h3 class="text-[13px] font-bold text-gray-900 mb-5">Branch Sales</h3>
        <div class="space-y-4 flex-1 flex flex-col justify-center">
          <div v-for="branch in branchSales" :key="branch.name" class="flex flex-wrap items-center gap-4">
            <div class="w-16 text-[11px] font-medium text-gray-800">{{ branch.name }}</div>
            <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full bg-[#209249] rounded-full" :style="{ width: branch.percentage + '%' }"></div>
            </div>
            <div class="w-6 text-right text-[11px] font-bold text-gray-900">{{ branch.value }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Grids -->
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
                <th class="px-5 py-3">Margin</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="product in topProducts" :key="product.name" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td class="px-5 py-4 font-semibold text-gray-800">{{ product.name }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ product.revenue }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ product.units }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ product.margin }}</td>
              </tr>
            </tbody>
          </table></div>
        </div>
      </div>

      <!-- Collections & Outstanding -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h3 class="text-[13px] font-bold text-gray-900">Collections & Outstanding</h3>
        </div>
        
        <div class="overflow-x-auto">
          <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th class="px-5 py-3">Branch</th>
                <th class="px-5 py-3">Collected</th>
                <th class="px-5 py-3">Outstanding</th>
                <th class="px-5 py-3">Overdue</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="col in collections" :key="col.branch" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td class="px-5 py-4 font-semibold text-gray-800">{{ col.branch }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ col.collected }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ col.outstanding }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ col.overdue }}</td>
              </tr>
            </tbody>
          </table></div>
        </div>
      </div>

    </div>
  </div>
</template>
