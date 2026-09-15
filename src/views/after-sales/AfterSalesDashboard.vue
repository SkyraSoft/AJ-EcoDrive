<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../../store.js'

const router = useRouter()

const kpis = computed(() => [
  { label: 'Open Warranty', value: store.cases.filter(c => c.type === 'Warranty').length.toString() || '18' },
  { label: 'Open Repairs', value: store.repairs.length.toString() || '23' },
  { label: 'Overdue Service', value: '6' },
  { label: 'Ready for Customer', value: store.cases.filter(c => c.status === 'Ready').length.toString() || '11' }
])

const branchWorkload = [
  { name: 'Peshawar', value: 18, percentage: 100 },
  { name: 'Islamabad', value: 14, percentage: 77 },
  { name: 'Lahore', value: 10, percentage: 55 },
  { name: 'Rawalpindi', value: 7, percentage: 38 }
]

const responseTime = [
  { name: 'Same day', value: 72, percentage: 100 },
  { name: '1-2 days', value: 21, percentage: 29 },
  { name: '3+ days', value: 7, percentage: 10 }
]

const priorityCases = computed(() => {
  return store.cases.slice(0, 5).map(c => ({
    ...c,
    badgeClass: c.status === 'Diagnosis' ? 'bg-[#fef9c3] text-[#a16207]' : (c.status === 'Parts Waiting' ? 'bg-[#fff7ed] text-[#ea580c]' : 'bg-[#eefcf2] text-[#165A31]')
  }))
})

const openCase = (item) => {
  store.selectCase(item)
  router.push('/after-sales/warranty/detail')
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / After-sales / <span class="font-bold text-gray-800">After-sales Dashboard</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">After-sales Dashboard</h1>
        <p class="text-sm text-gray-500 mt-1">Monitor warranty, service and repair work across branches.</p>
      </div>
    </div>

    <!-- 4 KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="(kpi, index) in kpis" :key="index" class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <div class="text-xs font-semibold text-gray-400 mb-2">{{ kpi.label }}</div>
        <div class="text-[22px] font-bold text-gray-900 leading-none">{{ kpi.value }}</div>
      </div>
    </div>

    <!-- Middle Grids -->
    <div class="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Branch Workload -->
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col">
        <h3 class="text-[13px] font-bold text-gray-900 mb-5">Branch Workload</h3>
        <div class="space-y-4">
          <div v-for="branch in branchWorkload" :key="branch.name" class="flex flex-wrap items-center gap-4">
            <div class="w-16 text-[11px] font-medium text-gray-800">{{ branch.name }}</div>
            <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full bg-[#209249] rounded-full" :style="{ width: branch.percentage + '%' }"></div>
            </div>
            <div class="w-6 text-right text-[11px] font-bold text-gray-900">{{ branch.value }}</div>
          </div>
        </div>
      </div>

      <!-- Response Time -->
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col">
        <h3 class="text-[13px] font-bold text-gray-900 mb-5">Response Time</h3>
        <div class="space-y-4">
          <div v-for="time in responseTime" :key="time.name" class="flex flex-wrap items-center gap-4">
            <div class="w-16 text-[11px] font-medium text-gray-800">{{ time.name }}</div>
            <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full bg-[#209249] rounded-full" :style="{ width: time.percentage + '%' }"></div>
            </div>
            <div class="w-6 text-right text-[11px] font-bold text-gray-900">{{ time.value }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Priority Cases Table -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100">
        <h3 class="text-[13px] font-bold text-gray-900">Priority Cases</h3>
      </div>
      
      <div class="overflow-x-auto">
        <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <th class="px-5 py-3">Case</th>
              <th class="px-5 py-3">Branch</th>
              <th class="px-5 py-3">Customer</th>
              <th class="px-5 py-3">Unit</th>
              <th class="px-5 py-3">Type</th>
              <th class="px-5 py-3">Age</th>
              <th class="px-5 py-3">Status</th>
              <th class="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
            <tbody class="text-[11px]">
              <tr 
                v-for="(item, idx) in priorityCases" 
                :key="idx" 
                @click="openCase(item)"
                class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer group"
              >
                <td class="px-5 py-4 font-semibold text-gray-900 group-hover:text-[#165A31] transition-colors">{{ item.caseId }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.branch }}</td>
                <td class="px-5 py-4 text-gray-800 font-semibold">{{ item.customer }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.unitSerial || item.unit }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.type }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.age }}</td>
                <td class="px-5 py-4">
                  <span class="inline-flex items-center px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold" :class="item.badgeClass">
                    {{ item.status }}
                  </span>
                </td>
                <td class="px-5 py-4 text-right">
                  <div class="flex items-center justify-end gap-1 text-gray-400 group-hover:text-[#165A31] font-medium tracking-wide">
                    <span>Open</span>
                    <span class="text-sm leading-none">&rarr;</span>
                  </div>
                </td>
              </tr>
            </tbody>
        </table></div>
      </div>
    </div>
  </div>
</template>
