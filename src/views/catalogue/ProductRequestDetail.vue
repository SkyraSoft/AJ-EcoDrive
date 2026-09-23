<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { store } from '../../store.js'

const router = useRouter()
const route = useRoute()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const requestId = computed(() => route.params.id || route.query.id || 'PR-088')

// Branch Manager Tabs
const branchCurrentTab = ref('Request')
const branchTabs = ['Request', 'Super Admin Response', 'Linked Product', 'Conversation', 'Activity']

const branchTabData = computed(() => {
  switch (branchCurrentTab.value) {
    case 'Request':
      return {
        title: 'Request',
        items: [
          { label: 'Requested Product', value: 'BRG Urban Mini' },
          { label: 'Category', value: 'Electric Scooter' },
          { label: 'Status', value: 'Submitted' },
          { label: 'Requested Qty', value: '4' },
          { label: 'Reason', value: 'Customer demand' },
          { label: 'Urgency', value: 'Medium' }
        ]
      }
    case 'Super Admin Response':
      return {
        title: 'Super Admin Response',
        items: [
          { label: 'Review Status', value: 'Under Review' },
          { label: 'Assigned Reviewer', value: 'Catalogue Team' },
          { label: 'Feasibility', value: 'Evaluating Specs' },
          { label: 'Estimated Decision', value: 'Within 3 business days' },
          { label: 'Feedback Notes', value: 'Reviewing market pricing fit' },
          { label: 'Action Needed', value: 'None from branch' }
        ]
      }
    case 'Linked Product':
      return {
        title: 'Linked Product',
        items: [
          { label: 'Master Product ID', value: 'Pending creation' },
          { label: 'SKU Assigned', value: 'Not assigned' },
          { label: 'Catalogue Category', value: 'Electric Scooter' },
          { label: 'Target Launch', value: 'Q4 2026' },
          { label: 'Target Price', value: 'PKR 325,000' },
          { label: 'Availability Scope', value: 'All Branches once created' }
        ]
      }
    case 'Conversation':
      return {
        title: 'Conversation',
        items: [
          { label: 'Latest Message', value: 'Request received and queued for review.' },
          { label: 'Sender', value: 'Head Office - Product Team' },
          { label: 'Timestamp', value: '28 Aug 14:22' },
          { label: 'Total Messages', value: '2 messages' },
          { label: 'Branch Sender', value: `${user.value?.branchName || 'Peshawar'} Branch Manager` },
          { label: 'Channel', value: 'Internal Catalogue Thread' }
        ]
      }
    case 'Activity':
      return {
        title: 'Activity',
        items: [
          { label: 'Created', value: '26 Aug 10:15 by Branch Manager' },
          { label: 'Status Changed', value: 'Submitted on 26 Aug' },
          { label: 'Acknowledged', value: '28 Aug by Catalogue Admin' },
          { label: 'Branch Audit', value: `${user.value?.branchName || 'Peshawar'} Branch PR log` },
          { label: 'Priority Tag', value: 'Medium Priority' },
          { label: 'Next SLA Step', value: 'Initial Decision by 31 Aug' }
        ]
      }
    default:
      return {
        title: 'Request',
        items: []
      }
  }
})
</script>

<template>
  <!-- BRANCH MANAGER VIEW -->
  <div v-if="isBranchUser" class="max-w-[1400px] mx-auto pb-12 space-y-6">
    <!-- Header -->
    <div>
      <div class="text-[11px] text-gray-400 mb-1">
        Branch Manager / Product Requests / <span class="font-medium text-gray-600">Product Request PR-028</span>
      </div>
      <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Product Request PR-028</h1>
      <p class="text-xs text-gray-500 mt-1">Track Super Admin response, linked product, conversation and activity.</p>
    </div>

    <!-- Tabs Navigation Bar -->
    <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-2">
      <div class="flex items-center gap-2 overflow-x-auto">
        <button 
          v-for="tab in branchTabs" 
          :key="tab"
          @click="branchCurrentTab = tab"
          class="px-3 py-1.5 text-xs rounded-lg whitespace-nowrap transition-colors cursor-pointer"
          :class="branchCurrentTab === tab ? 'bg-[#dcfce7] text-[#165A31] font-bold' : 'text-gray-500 hover:text-gray-900 font-medium'"
        >
          {{ tab }}
        </button>
      </div>
    </div>

    <!-- Tab Content: Left Box (Request) & Right Box (Branch context) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left Box -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 lg:col-span-8 flex flex-col justify-between">
        <div>
          <h3 class="text-sm font-bold text-gray-900 mb-5">{{ branchTabData.title }}</h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div v-for="(item, idx) in branchTabData.items" :key="idx" class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">{{ item.label }}</span>
              <span class="text-sm font-bold text-gray-900 mt-1">{{ item.value }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Box -->
      <div class="lg:col-span-4 flex flex-col">
        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
          <h3 class="text-sm font-bold text-gray-900 mb-5">Branch context</h3>
          
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Super Admin</span>
              <span class="text-sm font-bold text-gray-900 mt-1">Catalogue Team</span>
            </div>
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Linked Product</span>
              <span class="text-sm font-bold text-gray-900 mt-1">Not yet created</span>
            </div>
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Conversation</span>
              <span class="text-sm font-bold text-gray-900 mt-1">2 messages</span>
            </div>
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Last Activity</span>
              <span class="text-sm font-bold text-gray-900 mt-1">28 Aug 14:22</span>
            </div>
          </div>
        </div>
        
        <p class="text-[11px] text-gray-400 font-medium mt-3 px-1">
          Only {{ user.branchName }} Branch operational data is shown.
        </p>
      </div>
    </div>
  </div>

  <!-- SUPER ADMIN VIEW -->
  <div v-else class="max-w-[1400px] mx-auto space-y-6 pb-12">
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
