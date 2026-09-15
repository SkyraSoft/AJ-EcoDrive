<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDown } from 'lucide-vue-next'
import { store } from '@/store'
import CreateLeadModal from './CreateLead.vue'

const router = useRouter()
const showEditModal = ref(false)

const handleEdit = () => {
  store.originalEditLead = {
    name: 'Usman Ali',
    phone: '+92 333 6677889',
    source: 'Website',
    branch: 'Peshawar',
    owner: 'Sana Noor',
    product: 'BRG EV-5',
    budget: 'PKR 220K',
    stage: 'Qualified',
    nextFollowUp: 'Aug 28'
  }
  showEditModal.value = true
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-8">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Sales & CRM / Leads / <span class="font-bold text-gray-800">Lead Detail</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Lead Detail</h1>
        <p class="text-sm text-gray-500 mt-1">Manage a prospective customer, qualification, communication and conversion.</p>
      </div>
    </div>

    <!-- Status Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 rounded-xl">
      <div>
        <h2 class="text-xl font-bold text-gray-900">LD-982 · Usman Ali</h2>
        <p class="text-[12px] text-gray-500 mt-1">Website lead · Interested in BRG EV-5</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="inline-flex items-center px-2 py-1 rounded-[4px] text-[10px] font-bold bg-blue-50 text-blue-600">Qualified</span>
        <button @click="handleEdit" class="px-4 py-2 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          Edit Lead
        </button>
        <button class="px-3 py-2 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center gap-1">
          More <ChevronDown class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- Info Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Lead Profile -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-4 border-b border-gray-50 pb-3">Lead Profile</h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Phone</span>
            <span class="font-bold text-gray-900">+92 333 6677889</span>
          </div>
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Source</span>
            <span class="font-bold text-gray-900">Website</span>
          </div>
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Branch</span>
            <span class="font-bold text-gray-900">Peshawar</span>
          </div>
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Owner</span>
            <span class="font-bold text-gray-900">Sana Noor</span>
          </div>
        </div>
      </div>

      <!-- Opportunity -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-4 border-b border-gray-50 pb-3">Opportunity</h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Product</span>
            <span class="font-bold text-gray-900">BRG EV-5</span>
          </div>
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Budget</span>
            <span class="font-bold text-gray-900">PKR 220K</span>
          </div>
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Stage</span>
            <span class="font-bold text-gray-900">Qualified</span>
          </div>
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Next Follow-up</span>
            <span class="font-bold text-gray-900">Aug 28</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Timeline -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
      <h3 class="text-[14px] font-bold text-gray-900 mb-4 border-b border-gray-50 pb-3">Timeline</h3>
      <div class="space-y-4 relative pl-4 mt-4">
        <div class="absolute top-2 bottom-2 left-0 w-[2px] bg-gray-100"></div>
        
        <div class="relative flex items-center justify-between">
          <div class="absolute -left-4 w-[2px] h-full bg-[#eefcf2]"></div>
          <span class="text-[12px] font-bold text-gray-900 pl-4">Product brochure sent</span>
          <span class="text-[11px] text-gray-500">Aug 27</span>
        </div>
        
        <div class="relative flex items-center justify-between">
          <div class="absolute -left-4 w-[2px] h-full bg-[#eefcf2]"></div>
          <span class="text-[12px] font-bold text-gray-900 pl-4">Lead qualified</span>
          <span class="text-[11px] text-gray-500">Aug 27</span>
        </div>

        <div class="relative flex items-center justify-between">
          <div class="absolute -left-4 w-[2px] h-full bg-[#eefcf2]"></div>
          <span class="text-[12px] font-bold text-gray-900 pl-4">Website inquiry received</span>
          <span class="text-[11px] text-gray-500">Aug 26</span>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-end gap-3 pt-4">
      <button class="px-5 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        Create Follow-up
      </button>
      <button class="px-5 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        Create Quotation
      </button>
      <button class="px-5 py-2 text-[11px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        Convert to Customer
      </button>
    </div>
    
    <CreateLeadModal v-if="showEditModal" @close="showEditModal = false" />
  </div>
</template>
