<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const availability = [
  { branch: 'Islamabad', available: '7', reserve: '2' },
  { branch: 'Lahore', available: '3', reserve: '0' },
  { branch: 'Rawalpindi', available: '2', reserve: '0' }
]
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Inventory / Stock Requests / <span class="font-bold text-gray-800">Stock Request Detail</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Stock Request Detail</h1>
        <p class="text-sm text-gray-500 mt-1">Decide whether to fulfill from existing stock or procurement.</p>
      </div>
    </div>

    <!-- Overview Card -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <h2 class="text-[22px] font-bold text-gray-900">SR-1048</h2>
        <p class="text-[11px] text-gray-500 mt-1 font-medium">Peshawar Branch &middot; 5 &times; BRG DS11</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <span class="inline-flex items-center px-2 py-1 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">
          Pending
        </span>
        <button class="px-4 py-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          Review Request
        </button>
        <button class="px-3 py-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center gap-1">
          More <span class="text-[8px]">▼</span>
        </button>
      </div>
    </div>

    <!-- 2-Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-6 items-start">
      
      <!-- Left Column -->
      <div class="space-y-6">
        <!-- Request Panel -->
        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
          <h3 class="text-[14px] font-bold text-gray-900 mb-6">Request</h3>
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">Product</span>
              <span class="font-bold text-gray-900">BRG DS11</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">Quantity</span>
              <span class="font-bold text-gray-900">5</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">Need By</span>
              <span class="font-bold text-gray-900">Aug 31</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">Reason</span>
              <span class="font-bold text-gray-900">Month-end campaign</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="space-y-6">
        <!-- Network Availability Panel -->
        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100">
            <h3 class="text-[14px] font-bold text-gray-900">Network Availability</h3>
          </div>
          <div class="overflow-x-auto p-6 pt-0">
            <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse mt-4">
              <thead>
                <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                  <th class="px-5 py-3 rounded-tl-lg">Branch</th>
                  <th class="px-5 py-3">Available</th>
                  <th class="px-5 py-3 rounded-tr-lg">Reserve After Transfer</th>
                </tr>
              </thead>
              <tbody class="text-[11px]">
                <tr v-for="item in availability" :key="item.branch" class="border-b border-gray-50 last:border-0">
                  <td class="px-5 py-4 font-semibold text-gray-900">{{ item.branch }}</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">{{ item.available }}</td>
                  <td class="px-5 py-4 text-gray-600 font-medium">{{ item.reserve }}</td>
                </tr>
              </tbody>
            </table></div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-end gap-3 pt-2">
          <button @click="router.push('/inventory/stock-requests')" class="px-4 py-2 text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors shadow-sm">
            Reject
          </button>
          <button @click="router.push('/inventory/stock-requests')" class="px-4 py-2 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            Partially Approve
          </button>
          <button @click="router.push('/inventory/transfers/create')" class="px-4 py-2 text-[11px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#114a28] transition-colors shadow-sm">
            Approve &amp; Create Transfer
          </button>
        </div>
      </div>

    </div>
  </div>
</template>
