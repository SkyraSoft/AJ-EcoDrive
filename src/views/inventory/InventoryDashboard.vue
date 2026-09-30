<script setup>
import { computed } from 'vue'
import { store } from '../../store.js'

const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

// Branch Manager Data
const branchName = computed(() => user.value?.branchName || 'Peshawar')
const branchStats = computed(() => store.getInventoryStats(branchName.value))

const branchTopKpis = computed(() => [
  { label: 'Available', value: String(branchStats.value.available) },
  { label: 'Reserved', value: String(branchStats.value.reserved) },
  { label: 'Transfer In Transit', value: String(branchStats.value.inTransit) },
  { label: 'Supplier In Transit', value: '2' }
])

const branchStatusItems = computed(() => {
  const branchKey = branchName.value.toLowerCase()
  const lowStockCount = store.products.filter(p => {
    const qty = typeof p[branchKey] === 'number' ? p[branchKey] : (p.available || 0)
    return qty < (p.reorder || p.reorderLevel || 8)
  }).length

  return [
    { label: 'QC Hold', value: String(branchStats.value.qcHold) },
    { label: 'Returned', value: '1' },
    { label: 'Service / Maint.', value: String(branchStats.value.maintenance) },
    { label: 'Serialized Units', value: String(branchStats.value.serialized) },
    { label: 'Low Stock Alert', value: `${lowStockCount} products` },
    { label: 'Total Catalog', value: `${store.products.length} products` }
  ]
})

// Super Admin Data
const globalStats = computed(() => store.getInventoryStats('All Branches'))

const agedLowStock = computed(() => [
  { product: 'BRG EV-5', branch: 'Peshawar', available: 8, reorder: 10, age: '18d', alertType: 'Low', alertClass: 'bg-amber-50 text-amber-600' },
  { product: 'BRG City Mini', branch: 'Islamabad', available: 2, reorder: 6, age: '42d', alertType: 'Critical', alertClass: 'bg-red-50 text-red-600' }
])

const branchStock = computed(() => {
  const pesh = store.getInventoryStats('Peshawar').total
  const isl = store.getInventoryStats('Islamabad').total
  const lhr = store.getInventoryStats('Lahore').total
  const rwp = store.getInventoryStats('Rawalpindi').total
  const max = Math.max(pesh, isl, lhr, rwp, 1)
  return [
    { name: 'Peshawar', count: pesh, percentage: `${Math.round((pesh / max) * 100)}%` },
    { name: 'Islamabad', count: isl, percentage: `${Math.round((isl / max) * 100)}%` },
    { name: 'Lahore', count: lhr, percentage: `${Math.round((lhr / max) * 100)}%` },
    { name: 'Rawalpindi', count: rwp, percentage: `${Math.round((rwp / max) * 100)}%` }
  ]
})

const stockHealth = computed(() => {
  const total = store.products.length
  const low = store.products.filter(p => (p.available || 0) < (p.reorder || 8) && (p.available || 0) > 0).length
  const critical = store.products.filter(p => (p.available || 0) === 0).length
  const healthy = Math.max(0, total - low - critical)
  const max = Math.max(healthy, low, critical, 1)
  return [
    { name: 'Healthy', count: healthy, percentage: `${Math.round((healthy / max) * 100)}%` },
    { name: 'Low', count: low, percentage: `${Math.round((low / max) * 100)}%` },
    { name: 'Critical', count: critical, percentage: `${Math.round((critical / max) * 100)}%` }
  ]
})
</script>

<template>
  <!-- BRANCH MANAGER VIEW -->
  <div v-if="isBranchUser" class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div>
      <div class="text-[11px] text-gray-400 mb-1">
        Branch Manager / My Inventory / <span class="font-medium text-gray-600">Branch Inventory Dashboard</span>
      </div>
      <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Branch Inventory Dashboard</h1>
      <p class="text-xs text-gray-500 mt-1">Complete {{ user.branchName || 'Peshawar' }} Branch inventory status overview.</p>
    </div>

    <!-- 4 KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="(kpi, index) in branchTopKpis" :key="index" class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <div class="text-xs font-semibold text-gray-400 mb-3">{{ kpi.label }}</div>
        <div class="text-[26px] font-bold text-gray-900 leading-tight">{{ kpi.value }}</div>
      </div>
    </div>

    <!-- 2 Column Details Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left Card: Inventory Status -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 lg:col-span-8">
        <h3 class="text-sm font-bold text-gray-900 mb-5">Inventory Status</h3>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div v-for="(item, idx) in branchStatusItems" :key="idx" class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
            <span class="text-[10px] font-medium text-gray-400">{{ item.label }}</span>
            <span class="text-sm font-bold text-gray-900 mt-1">{{ item.value }}</span>
          </div>
        </div>
      </div>

      <!-- Right Card: Branch Inventory Value -->
      <div class="lg:col-span-4 flex flex-col">
        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 flex flex-col justify-between flex-1">
          <div>
            <h3 class="text-sm font-bold text-gray-900 mb-5">Branch Inventory Value</h3>
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between mb-4">
              <span class="text-[10px] font-medium text-gray-400">Visibility</span>
              <span class="text-sm font-bold text-gray-900 mt-1">Shown only if authorised</span>
            </div>
          </div>

          <!-- Alert Notice Banner -->
          <div class="bg-[#f0fdf4] border border-[#dcfce7] rounded-lg p-3.5 text-[11px] text-gray-600 leading-relaxed font-medium">
            Branch scope is fixed. Company-wide inventory values are not exposed.
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
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Inventory / <span class="font-bold text-gray-800">Inventory Dashboard</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Inventory Dashboard</h1>
        <p class="text-sm text-gray-500 mt-1">Monitor owned physical stock across branches and inventory states.</p>
      </div>
    </div>

    <!-- KPI Cards - Row 1 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <div class="text-[11px] font-semibold text-gray-400 mb-2">Total Units</div>
        <div class="text-[28px] font-bold text-gray-900 leading-none">{{ globalStats.total }}</div>
      </div>
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <div class="text-[11px] font-semibold text-gray-400 mb-2">Available</div>
        <div class="text-[28px] font-bold text-gray-900 leading-none">{{ globalStats.available }}</div>
      </div>
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <div class="text-[11px] font-semibold text-gray-400 mb-2">Reserved</div>
        <div class="text-[28px] font-bold text-gray-900 leading-none">{{ globalStats.reserved }}</div>
      </div>
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <div class="text-[11px] font-semibold text-gray-400 mb-2">Supplier In Transit</div>
        <div class="text-[28px] font-bold text-gray-900 leading-none">26</div>
      </div>
    </div>

    <!-- KPI Cards - Row 2 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <div class="text-[11px] font-semibold text-gray-400 mb-2">Transfer In Transit</div>
        <div class="text-[28px] font-bold text-gray-900 leading-none">{{ globalStats.inTransit }}</div>
      </div>
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <div class="text-[11px] font-semibold text-gray-400 mb-2">QC Hold</div>
        <div class="text-[28px] font-bold text-gray-900 leading-none">{{ globalStats.qcHold }}</div>
      </div>
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <div class="text-[11px] font-semibold text-gray-400 mb-2">Maintenance / Service</div>
        <div class="text-[28px] font-bold text-gray-900 leading-none">{{ globalStats.maintenance }}</div>
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
        <table class="w-full text-left border-collapse">
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
        </table>
      </div>
    </div>
  </div>
</template>
