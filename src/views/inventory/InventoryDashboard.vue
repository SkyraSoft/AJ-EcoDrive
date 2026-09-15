<script setup>
const agedLowStock = [
  { product: 'BRG EV-5', branch: 'Peshawar', available: 8, reorder: 10, age: '18d', alertType: 'Low', alertClass: 'bg-amber-50 text-amber-600' },
  { product: 'BRG City Mini', branch: 'Islamabad', available: 2, reorder: 6, age: '42d', alertType: 'Critical', alertClass: 'bg-red-50 text-red-600' }
]

const branchStock = [
  { name: 'Peshawar', count: 118, percentage: '100%' },
  { name: 'Islamabad', count: 84, percentage: '71%' },
  { name: 'Lahore', count: 63, percentage: '53%' },
  { name: 'Rawalpindi', count: 47, percentage: '40%' }
]

const stockHealth = [
  { name: 'Healthy', count: 79, percentage: '100%' },
  { name: 'Low', count: 14, percentage: '18%' },
  { name: 'Critical', count: 7, percentage: '9%' }
]
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Inventory / <span class="font-bold text-gray-800">Inventory Dashboard</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Inventory Dashboard</h1>
        <p class="text-sm text-gray-500 mt-1">Monitor owned physical stock across branches and inventory states.</p>
      </div>
    </div>

    <!-- KPI Cards - Row 1 -->
    <div class="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <div class="text-[11px] font-semibold text-gray-400 mb-2">Total Units</div>
        <div class="text-[28px] font-bold text-gray-900 leading-none">312</div>
      </div>
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <div class="text-[11px] font-semibold text-gray-400 mb-2">Available</div>
        <div class="text-[28px] font-bold text-gray-900 leading-none">228</div>
      </div>
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <div class="text-[11px] font-semibold text-gray-400 mb-2">Reserved</div>
        <div class="text-[28px] font-bold text-gray-900 leading-none">31</div>
      </div>
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <div class="text-[11px] font-semibold text-gray-400 mb-2">Supplier In Transit</div>
        <div class="text-[28px] font-bold text-gray-900 leading-none">26</div>
      </div>
    </div>

    <!-- KPI Cards - Row 2 -->
    <div class="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <div class="text-[11px] font-semibold text-gray-400 mb-2">Transfer In Transit</div>
        <div class="text-[28px] font-bold text-gray-900 leading-none">8</div>
      </div>
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <div class="text-[11px] font-semibold text-gray-400 mb-2">QC</div>
        <div class="text-[28px] font-bold text-gray-900 leading-none">7</div>
      </div>
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <div class="text-[11px] font-semibold text-gray-400 mb-2">Damaged / Quarantine</div>
        <div class="text-[28px] font-bold text-gray-900 leading-none">5</div>
      </div>
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <div class="text-[11px] font-semibold text-gray-400 mb-2">Inventory Value</div>
        <div class="text-[28px] font-bold text-gray-900 leading-none">PKR 41.8M</div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Stock by Branch -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">Stock by Branch</h3>
        <div class="space-y-4">
          <div v-for="branch in branchStock" :key="branch.name" class="flex flex-wrap items-center gap-4">
            <div class="w-24 text-[11px] text-gray-600 font-medium truncate">{{ branch.name }}</div>
            <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full bg-[#165A31] rounded-full" :style="{ width: branch.percentage }"></div>
            </div>
            <div class="w-8 text-right text-[11px] font-bold text-gray-900">{{ branch.count }}</div>
          </div>
        </div>
      </div>

      <!-- Stock Health -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-6">Stock Health</h3>
        <div class="space-y-4">
          <div v-for="health in stockHealth" :key="health.name" class="flex flex-wrap items-center gap-4">
            <div class="w-24 text-[11px] text-gray-600 font-medium truncate">{{ health.name }}</div>
            <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full bg-[#165A31] rounded-full" :style="{ width: health.percentage }"></div>
            </div>
            <div class="w-8 text-right text-[11px] font-bold text-gray-900">{{ health.count }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table Container -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100">
        <h3 class="text-[14px] font-bold text-gray-900">Aged & Low Stock</h3>
      </div>
      
      <div class="overflow-x-auto">
        <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
              <th class="px-5 py-3">Product</th>
              <th class="px-5 py-3">Branch</th>
              <th class="px-5 py-3">Available</th>
              <th class="px-5 py-3">Reorder</th>
              <th class="px-5 py-3">Age</th>
              <th class="px-5 py-3">Alert</th>
              <th class="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr v-for="item in agedLowStock" :key="item.product + item.branch" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer">
              <td class="px-5 py-4 font-semibold text-gray-900">{{ item.product }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.branch }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.available }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.reorder }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.age }}</td>
              <td class="px-5 py-4">
                <span class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold" :class="item.alertClass">
                  {{ item.alertType }}
                </span>
              </td>
              <td class="px-5 py-4 font-semibold text-gray-600 text-right">Open &rarr;</td>
            </tr>
          </tbody>
        </table></div>
      </div>
    </div>
  </div>
</template>
