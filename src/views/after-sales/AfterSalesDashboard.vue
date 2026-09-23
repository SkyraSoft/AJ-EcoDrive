<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '@/store'

const router = useRouter()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

// Branch Manager KPIs (Matching Screenshot 1)
const branchKpis = [
  { label: 'Open Cases', value: '14', sub: '4 high priority', isGreen: true },
  { label: 'Repairs In Progress', value: '9', sub: '3 due today', isGreen: true },
  { label: 'Awaiting Parts', value: '5', sub: '2 overdue', isGreen: true },
  { label: 'Ready', value: '6', sub: 'Notify customers', isGreen: false }
]

// Branch Manager Service Workload Table
const branchWorkloadList = [
  {
    caseJob: 'SC-229',
    customer: 'Ahsan Khan',
    unit: 'CHS-01882',
    issue: 'Controller fault',
    status: 'Diagnosis',
    statusClass: 'bg-[#fef3c7] text-[#b45309]',
    route: '/after-sales/warranty/detail?id=SC-229'
  },
  {
    caseJob: 'RJ-188',
    customer: 'Bilal Shah',
    unit: 'CHS-01790',
    issue: 'Brake service',
    status: 'Ready',
    statusClass: 'bg-[#dcfce7] text-[#165A31]',
    route: '/after-sales/repairs/detail?id=RJ-188'
  }
]

const openItem = (item) => {
  router.push(item.route)
}

// Super Admin Data
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

const openSuperAdminCase = (item) => {
  store.selectCase(item)
  router.push('/after-sales/warranty/detail')
}
</script>

<template>
  <!-- BRANCH MANAGER VIEW -->
  <div v-if="isBranchUser" class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div>
      <div class="text-[11px] text-gray-400 mb-1">
        Branch Manager / Warranty & Service / <span class="font-medium text-gray-600">After-sales Dashboard</span>
      </div>
      <h1 class="text-[32px] tracking-tight font-bold text-gray-900">After-sales Dashboard</h1>
      <p class="text-xs text-gray-500 mt-1">Warranty, service and repair workload for Peshawar Branch.</p>
    </div>

    <!-- 4 KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div 
        v-for="kpi in branchKpis" 
        :key="kpi.label" 
        class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]"
      >
        <p class="text-[11px] font-medium text-gray-400">{{ kpi.label }}</p>
        <h3 class="text-2xl font-bold text-gray-900 mt-1.5">{{ kpi.value }}</h3>
        <p :class="['text-[11px] mt-1 font-medium', kpi.isGreen ? 'text-[#165A31]' : 'text-gray-400']">{{ kpi.sub }}</p>
      </div>
    </div>

    <!-- Table Card: Service Workload -->
    <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
      <h3 class="text-sm font-bold text-gray-900">Service Workload</h3>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-100 text-[11px] font-semibold text-gray-400">
              <th class="py-3 px-4">Case / Job</th>
              <th class="py-3 px-4">Customer</th>
              <th class="py-3 px-4">Unit</th>
              <th class="py-3 px-4">Issue</th>
              <th class="py-3 px-4">Status</th>
              <th class="py-3 px-4 text-right"></th>
            </tr>
          </thead>
          <tbody class="text-xs divide-y divide-gray-50">
            <tr 
              v-for="item in branchWorkloadList" 
              :key="item.caseJob" 
              @click="openItem(item)"
              class="hover:bg-gray-50/50 transition-colors cursor-pointer"
            >
              <td class="py-4 px-4 font-semibold text-gray-900">{{ item.caseJob }}</td>
              <td class="py-4 px-4 font-medium text-gray-800">{{ item.customer }}</td>
              <td class="py-4 px-4 font-medium text-gray-600">{{ item.unit }}</td>
              <td class="py-4 px-4 font-medium text-gray-600">{{ item.issue }}</td>
              <td class="py-4 px-4">
                <span :class="['inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-semibold', item.statusClass]">
                  {{ item.status }}
                </span>
              </td>
              <td class="py-4 px-4 text-right">
                <button 
                  @click.stop="openItem(item)" 
                  class="text-gray-500 hover:text-gray-900 text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
                >
                  Open <span class="text-gray-400">›</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- SUPER ADMIN VIEW -->
  <div v-else class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / After-sales / <span class="font-bold text-gray-800">After-sales Dashboard</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">After-sales Dashboard</h1>
        <p class="text-sm text-gray-500 mt-1">Monitor warranty, service and repair work across branches.</p>
      </div>
    </div>

    <!-- 4 KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="(kpi, index) in kpis" :key="index" class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <div class="text-xs font-semibold text-gray-400 mb-2">{{ kpi.label }}</div>
        <div class="text-[22px] font-bold text-gray-900 leading-none">{{ kpi.value }}</div>
      </div>
    </div>

    <!-- Middle Grids -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <table class="w-full text-left border-collapse">
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
              @click="openSuperAdminCase(item)"
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
        </table>
      </div>
    </div>
  </div>
</template>
