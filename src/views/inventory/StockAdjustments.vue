<script setup>
const adjustments = [
  { id: 'ADJ-221', branch: 'Peshawar', unitProduct: 'EV5-00441', type: 'Status', qtyEffect: '0', reason: 'QC finding', status: 'Pending', requestedBy: 'Ahsan Khan', actionText: 'Review' },
  { id: 'ADJ-218', branch: 'Lahore', unitProduct: 'BRG DS11', type: 'Quantity', qtyEffect: '-1', reason: 'Count variance', status: 'Approved', requestedBy: 'Sami Ullah', actionText: 'Open' }
]
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Inventory / <span class="font-bold text-gray-800">Stock Adjustments</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Stock Adjustments</h1>
        <p class="text-sm text-gray-500 mt-1">Control non-routine inventory corrections through approval.</p>
      </div>
      <button class="px-4 py-2 bg-[#165A31] text-white text-[11px] font-bold rounded-lg hover:bg-[#114a28] transition-colors shadow-sm flex items-center gap-2">
        <span>+ New Adjustment</span>
      </button>
    </div>

    <!-- Table Container -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100">
        <h3 class="text-[14px] font-bold text-gray-900">Adjustments</h3>
      </div>
      
      <div class="overflow-x-auto">
        <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
              <th class="px-5 py-3">Adjustment</th>
              <th class="px-5 py-3">Branch</th>
              <th class="px-5 py-3">Unit/Product</th>
              <th class="px-5 py-3">Type</th>
              <th class="px-5 py-3">Qty Effect</th>
              <th class="px-5 py-3">Reason</th>
              <th class="px-5 py-3">Status</th>
              <th class="px-5 py-3">Requested By</th>
              <th class="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr v-for="item in adjustments" :key="item.id" @click="$router.push('/inventory/stock-adjustments/detail')" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer">
              <td class="px-5 py-4 font-semibold text-gray-900">{{ item.id }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.branch }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.unitProduct }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.type }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.qtyEffect }}</td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.reason }}</td>
              <td class="px-5 py-4">
                <span v-if="item.status === 'Pending'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-amber-50 text-amber-600">{{ item.status }}</span>
                <span v-else-if="item.status === 'Approved'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">{{ item.status }}</span>
                <span v-else class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-gray-100 text-gray-600">{{ item.status }}</span>
              </td>
              <td class="px-5 py-4 text-gray-600 font-medium">{{ item.requestedBy }}</td>
              <td class="px-5 py-4 font-semibold text-gray-600 text-right">{{ item.actionText }} &rarr;</td>
            </tr>
          </tbody>
        </table></div>
      </div>
    </div>
  </div>
</template>
