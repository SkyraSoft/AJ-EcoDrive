<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDown } from 'lucide-vue-next'
import { store } from '@/store'
import CreateCustomOrderModal from './CreateCustomOrder.vue'

const router = useRouter()
const showEditModal = ref(false)

const handleEdit = () => {
  store.originalEditCustomOrder = {
    customer: 'Zain Khan',
    product: 'Cargo Pro',
    variant: 'Red',
    customerNeed: 'Commercial delivery use',
    deposit: '75000',
    quotedPrice: '280000',
    eta: 'Sep 18'
  }
  showEditModal.value = true
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-8">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Sales & CRM / Custom Orders / <span class="font-bold text-gray-800">Custom Order Detail</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Custom Order Detail</h1>
        <p class="text-sm text-gray-500 mt-1">Connect a customer requirement to quotation, deposit, stock/procurement and final sale.</p>
      </div>
    </div>

    <!-- Status Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 rounded-xl">
      <div>
        <h2 class="text-xl font-bold text-gray-900">CO-119</h2>
        <p class="text-[12px] text-gray-500 mt-1">Zain Khan · Cargo Pro · Red</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="inline-flex items-center px-2 py-1 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">Procurement</span>
        <button @click="handleEdit" class="px-4 py-2 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          Update Custom Order
        </button>
        <button class="px-3 py-2 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center gap-1">
          More <ChevronDown class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- Financial Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="p-5 bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <p class="text-[11px] font-medium text-gray-500 mb-1">Deposit</p>
        <h3 class="text-2xl font-bold text-gray-900">PKR 75K</h3>
      </div>
      <div class="p-5 bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <p class="text-[11px] font-medium text-gray-500 mb-1">Quoted Price</p>
        <h3 class="text-2xl font-bold text-gray-900">PKR 280K</h3>
      </div>
      <div class="p-5 bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <p class="text-[11px] font-medium text-gray-500 mb-1">Balance</p>
        <h3 class="text-2xl font-bold text-gray-900">PKR 205K</h3>
      </div>
      <div class="p-5 bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <p class="text-[11px] font-medium text-gray-500 mb-1">ETA</p>
        <h3 class="text-2xl font-bold text-gray-900">Sep 18</h3>
      </div>
    </div>

    <!-- Details Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-4 border-b border-gray-50 pb-3">Requirement</h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Product</span>
            <span class="font-bold text-gray-900">Cargo Pro</span>
          </div>
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Variant</span>
            <span class="font-bold text-gray-900">Red</span>
          </div>
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Customer Need</span>
            <span class="font-bold text-gray-900">Commercial delivery use</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-4 border-b border-gray-50 pb-3">Fulfilment</h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Source</span>
            <span class="font-bold text-gray-900">PO-2049</span>
          </div>
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Reservation</span>
            <span class="font-bold text-gray-900">On receipt</span>
          </div>
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Expected</span>
            <span class="font-bold text-gray-900">Sep 18</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Timeline -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
      <h3 class="text-[14px] font-bold text-gray-900 mb-4 border-b border-gray-50 pb-3">Communication & Activity</h3>
      <div class="space-y-4 relative pl-4 mt-4">
        <div class="absolute top-2 bottom-2 left-0 w-[2px] bg-gray-100"></div>
        
        <div class="relative flex items-center justify-between">
          <div class="absolute -left-4 w-[2px] h-full bg-[#eefcf2]"></div>
          <span class="text-[12px] font-bold text-gray-900 pl-4">PO-2049 linked</span>
          <span class="text-[11px] text-gray-500">Aug 27</span>
        </div>
        
        <div class="relative flex items-center justify-between">
          <div class="absolute -left-4 w-[2px] h-full bg-[#eefcf2]"></div>
          <span class="text-[12px] font-bold text-gray-900 pl-4">Deposit received</span>
          <span class="text-[11px] text-gray-500">Aug 26</span>
        </div>

        <div class="relative flex items-center justify-between">
          <div class="absolute -left-4 w-[2px] h-full bg-[#eefcf2]"></div>
          <span class="text-[12px] font-bold text-gray-900 pl-4">Custom order created</span>
          <span class="text-[11px] text-gray-500">Aug 26</span>
        </div>
      </div>
    </div>
    
    <CreateCustomOrderModal v-if="showEditModal" @close="showEditModal = false" />
  </div>
</template>
