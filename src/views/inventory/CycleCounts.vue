<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const cycleCounts = [
  { id: 'CC-091', branch: 'Peshawar', scope: 'Main Showroom', expected: '118', counted: '116', variance: '2 loss', status: 'Review', owner: 'Ahsan Khan', actionText: 'Open' },
  { id: 'CC-088', branch: 'Islamabad', scope: 'Full Branch', expected: '84', counted: '84', variance: '0', status: 'Closed', owner: 'Hassan Ali', actionText: 'Open' }
]
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Inventory / <span class="font-bold text-gray-800">Cycle Counts</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Cycle Counts</h1>
        <p class="text-sm text-gray-500 mt-1">Verify physical stock against system records.</p>
      </div>
      <button @click="router.push('/inventory/cycle-counts/create')" class="px-4 py-2 bg-[#165A31] text-white text-[11px] font-bold rounded-lg hover:bg-[#114a28] transition-colors shadow-sm flex items-center gap-2">
        <span>+ Create Cycle Count</span>
      </button>
    </div>

    <!-- Table Container -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100">
        <h3 class="text-[14px] font-bold text-gray-900">Cycle Counts</h3>
      </div>
      
      <div class="overflow-x-auto">
        <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
              <th class="px-5 py-3">Count</th>
              <th class="px-5 py-3">Branch</th>
              <th class="px-5 py-3">Scope</th>
              <th class="px-5 py-3">Expected Units</th>
              <th class="px-5 py-3">Counted</th>
              <th class="px-5 py-3">Variance</th>
              <th class="px-5 py-3">Status</th>
              <th class="px-5 py-3">Owner</th>
              <th class="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr v-for="item in cycleCounts" :key="item.id" @click="$router.push('/inventory/cycle-counts/detail')" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer">
              <td class="px-5 py-4 font-semibold text-gray-900">{{ item.id }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.branch }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.scope }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.expected }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.counted }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.variance }}</td>
              <td class="px-5 py-4">
                <span v-if="item.status === 'Review'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-amber-50 text-amber-600">{{ item.status }}</span>
                <span v-else-if="item.status === 'Closed'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">{{ item.status }}</span>
                <span v-else class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-gray-100 text-gray-600">{{ item.status }}</span>
              </td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.owner }}</td>
              <td class="px-5 py-4 font-semibold text-gray-600 text-right">{{ item.actionText }} &rarr;</td>
            </tr>
          </tbody>
        </table></div>
      </div>
    </div>
  </div>

  <router-view />
</template>