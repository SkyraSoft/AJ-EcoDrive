<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const cancel = () => {
  router.push('/catalogue/requests')
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Catalogue / Product Requests / <span class="font-bold text-gray-800">Product Request Detail</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Product Request Detail</h1>
        <p class="text-sm text-gray-500 mt-1">Review duplicate risk, business need and convert an approved request to a product.</p>
      </div>
    </div>

    <!-- Main Card -->
    <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <!-- Card Header -->
      <div class="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <div>
          <h2 class="text-[20px] font-bold text-gray-900 mb-1">PR-0181 - BRG DS12</h2>
          <div class="text-[11px] text-gray-500 font-medium">Peshawar Branch - Submitted by Ahsan Khan</div>
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
      
      <div class="p-6 grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-6 bg-[#fbfbfc]">
        <!-- Request Details -->
        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
          <h3 class="text-[14px] font-bold text-gray-900 mb-6">Request</h3>
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="font-medium text-gray-500">Requested Name</span>
              <span class="font-bold text-gray-900">BRG DS12</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="font-medium text-gray-500">Category</span>
              <span class="font-bold text-gray-900">Electric Bikes</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="font-medium text-gray-500">Business Need</span>
              <span class="font-bold text-gray-900">Customer demand</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="font-medium text-gray-500">Desired Date</span>
              <span class="font-bold text-gray-900">Sep 10</span>
            </div>
          </div>
        </div>

        <!-- Duplicate Check -->
        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
          <h3 class="text-[14px] font-bold text-gray-900 mb-6">Duplicate Check</h3>
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="font-medium text-gray-500">Exact SKU Match</span>
              <span class="font-bold text-gray-900">None</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="font-medium text-gray-500">Similar Models</span>
              <span class="font-bold text-gray-900">DS11, DS10</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="font-medium text-gray-500">Recommendation</span>
              <span class="font-bold text-gray-900">Safe to create new model</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions Footer -->
    <div class="flex items-center justify-end pt-4">
      <div class="flex flex-wrap items-center gap-3">
        <button class="px-5 py-2 text-[11px] font-bold text-red-500 bg-red-50/50 border border-red-200 rounded-lg hover:bg-red-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          Reject
        </button>
        <button class="px-5 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          Request Information
        </button>
        <button class="px-5 py-2 text-[11px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          Approve & Convert to Product
        </button>
      </div>
    </div>
  </div>
</template>
