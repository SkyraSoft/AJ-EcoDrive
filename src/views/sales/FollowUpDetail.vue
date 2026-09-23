<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { store } from '@/store'
import CreateFollowUp from './CreateFollowUp.vue'

const route = useRoute()
const router = useRouter()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const followUpId = computed(() => route.params.id || route.query.id || '1')
const customerName = computed(() => route.query.customer || (followUpId.value === '2' ? 'Sajid Khan' : 'Bilal Shah'))
const linkedRecord = computed(() => route.query.record || (followUpId.value === '2' ? 'LD-551' : 'ORD-2238'))
const dueTime = computed(() => route.query.due || (followUpId.value === '2' ? 'Today 14:00' : 'Today 11:30'))
const status = computed(() => route.query.status || (followUpId.value === '2' ? 'Due Today' : 'Overdue'))

const branchCurrentTab = ref('Overview')
const branchTabs = ['Overview', 'Linked Record', 'Customer', 'Notes & Actions', 'Activity']

const branchTabData = computed(() => {
  const isSajid = customerName.value.includes('Sajid')
  const branchName = user.value?.branchName || 'Peshawar'

  switch (branchCurrentTab.value) {
    case 'Overview':
      return {
        title: 'Overview',
        items: [
          { label: 'Customer', value: customerName.value },
          { label: 'Linked Record', value: linkedRecord.value },
          { label: 'Owner', value: 'Hamza' },
          { label: 'Due', value: dueTime.value },
          { label: 'Priority', value: isSajid ? 'Normal' : 'High Priority' },
          { label: 'Status', value: status.value }
        ]
      }
    case 'Linked Record':
      return {
        title: 'Linked Record Information',
        items: [
          { label: 'Record Type', value: isSajid ? 'Lead Inquiry (LD-551)' : 'Sale Order (ORD-2238)' },
          { label: 'Interested / Assigned Unit', value: isSajid ? 'BRG X7 (Lithium 72V)' : 'BRG X7 (CH 8-BRG-26-01731)' },
          { label: 'Financial Value', value: isSajid ? 'Budget: PKR 350,000' : 'Total: PKR 350,000' },
          { label: 'Outstanding Balance', value: isSajid ? 'PKR 0' : 'PKR 215,000' },
          { label: 'Operational Status', value: isSajid ? 'New Website Lead' : 'Awaiting Balance Payment' },
          { label: 'Allocated Branch', value: `${branchName} Branch` }
        ]
      }
    case 'Customer':
      return {
        title: 'Customer Profile',
        items: [
          { label: 'Customer ID', value: isSajid ? 'Lead Profile' : 'CUS-0744' },
          { label: 'Phone Number', value: isSajid ? '0312 553 8198' : '0333 118 2011' },
          { label: 'Total Orders', value: isSajid ? '0 (Prospect)' : '2 Completed' },
          { label: 'Lifetime Sales', value: isSajid ? 'PKR 0' : 'PKR 540,000' },
          { label: 'Preferred Channel', value: isSajid ? 'WhatsApp / Call' : 'Direct Call' },
          { label: 'Account Standing', value: isSajid ? 'Warm Prospect' : 'Follow-up Required' }
        ]
      }
    case 'Notes & Actions':
      return {
        title: 'Notes & Actions',
        items: [
          { label: 'Task Objective', value: isSajid ? 'Discuss financing and battery warranty' : 'Collect remaining balance PKR 215,000' },
          { label: 'Last Outreach', value: isSajid ? 'Inquiry registered Today 08:40' : 'Yesterday 16:00 (Promised payment today)' },
          { label: 'Next Step', value: isSajid ? 'Book showroom test drive' : 'Verify bank deposit with cashier' },
          { label: 'Assigned Staff', value: 'Hamza' },
          { label: 'Escalation Tier', value: isSajid ? 'Standard Sales Flow' : 'Branch Manager Alert' },
          { label: 'Target Completion', value: 'Today by 17:00' }
        ]
      }
    case 'Activity':
      return {
        title: 'Follow-up Activity Timeline',
        items: [
          { label: dueTime.value, value: `Follow-up status marked ${status.value}` },
          { label: 'Today 09:00', value: 'Daily reminder notification pushed to Hamza' },
          { label: 'Yesterday 16:00', value: 'Interaction history verified by branch team' },
          { label: 'Current State', value: 'Pending resolution' },
          { label: 'Logged By', value: 'System Audit' },
          { label: 'Branch Scope', value: `${branchName} Branch Operational Queue` }
        ]
      }
    default:
      return {
        title: 'Overview',
        items: []
      }
  }
})

// Super Admin Data
const showEditModal = ref(false)
const activeTab = ref('Overview')
const tabs = ['Overview', 'Linked Record', 'Customer', 'Notes & Actions', 'Activity']
</script>

<template>
  <!-- BRANCH MANAGER VIEW -->
  <div v-if="isBranchUser" class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[11px] text-gray-400 mb-1">
          Branch Manager / Follow-ups / <span class="font-medium text-gray-600">Follow-up — {{ customerName }}</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Follow-up — {{ customerName }}</h1>
        <p class="text-xs text-gray-500 mt-1">Follow-up detail — {{ branchCurrentTab }}.</p>
      </div>
    </div>

    <!-- Tabs Navigation Bar -->
    <div class="border-b border-gray-100 flex items-center gap-6 overflow-x-auto pb-1">
      <button 
        v-for="tab in branchTabs" 
        :key="tab"
        @click="branchCurrentTab = tab"
        class="pb-2 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer relative"
        :class="branchCurrentTab === tab ? 'text-[#165A31] font-bold' : 'text-gray-400 hover:text-gray-700'"
      >
        {{ tab }}
        <div v-if="branchCurrentTab === tab" class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#165A31] rounded-t-full"></div>
      </button>
    </div>

    <!-- Tab Content: Left Box (Data) & Right Box (Related information) -->
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

      <!-- Right Box: Related information -->
      <div class="lg:col-span-4 flex flex-col">
        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
          <h3 class="text-sm font-bold text-gray-900 mb-5">Related information</h3>
          
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Owner</span>
              <span class="text-sm font-bold text-gray-900 mt-1">Hamza</span>
            </div>
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Due</span>
              <span class="text-sm font-bold text-gray-900 mt-1">{{ dueTime }}</span>
            </div>
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Priority</span>
              <span class="text-sm font-bold text-gray-900 mt-1">{{ customerName.includes('Sajid') ? 'Normal' : 'High' }}</span>
            </div>
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Status</span>
              <span class="text-sm font-bold text-gray-900 mt-1">{{ status }}</span>
            </div>
          </div>
        </div>
        
        <p class="text-[11px] text-gray-400 font-medium mt-3 px-1">
          This view is scoped only to {{ user?.branchName || 'Peshawar' }} Branch. Actions that require company-wide approval remain with management.
        </p>
      </div>
    </div>
  </div>

  <!-- SUPER ADMIN VIEW -->
  <div v-else class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Sales & CRM / Follow-ups / <span class="font-bold text-gray-800">Follow-up Detail</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Follow-up Detail</h1>
        <p class="text-sm text-gray-500 mt-1">{{ customerName }} · {{ linkedRecord }}</p>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
      <h3 class="text-sm font-bold text-gray-900 mb-4">Follow-up Summary</h3>
      <div class="space-y-3">
        <div class="flex justify-between text-xs"><span class="text-gray-500">Customer:</span><span class="font-bold text-gray-900">{{ customerName }}</span></div>
        <div class="flex justify-between text-xs"><span class="text-gray-500">Linked Record:</span><span class="font-bold text-gray-900">{{ linkedRecord }}</span></div>
        <div class="flex justify-between text-xs"><span class="text-gray-500">Owner:</span><span class="font-bold text-gray-900">Hamza</span></div>
        <div class="flex justify-between text-xs"><span class="text-gray-500">Due:</span><span class="font-bold text-gray-900">{{ dueTime }}</span></div>
        <div class="flex justify-between text-xs"><span class="text-gray-500">Status:</span><span class="font-bold text-gray-900">{{ status }}</span></div>
      </div>
    </div>
  </div>
</template>
