<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CheckCircle2, Loader2, ArrowLeft, Pencil } from 'lucide-vue-next'
import { store } from '@/store'
import api from '@/services/api'
import CreateFollowUp from './CreateFollowUp.vue'
import NotFoundState from '@/components/common/NotFoundState.vue'

const route = useRoute()
const router = useRouter()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const followUpId = computed(() => route.params.id || route.query.id || '')
const remoteFollowUp = ref(null)
const loading = ref(false)
const loadError = ref(null)
const completing = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const showEditModal = ref(false)

const loadFollowUpData = async () => {
  if (!followUpId.value) return
  loading.value = true
  loadError.value = null
  try {
    const response = await api.followUps.getById(followUpId.value)
    const res = response?.data || response
    if (res) {
      remoteFollowUp.value = res.followUp || res
    }
  } catch (err) {
    loadError.value = err
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadFollowUpData()
})

const currentFollowUp = computed(() => {
  if (remoteFollowUp.value) return remoteFollowUp.value
  if (!followUpId.value) return null
  return store.getFollowUpById(followUpId.value)
})

const isValidFollowUp = computed(() => {
  if (loading.value) return true
  if (currentFollowUp.value) return true
  if (route.query.customer) return true
  return ['1', '2'].includes(String(followUpId.value))
})

const customerName = computed(() => currentFollowUp.value?.customer || currentFollowUp.value?.customer_name || route.query.customer || (followUpId.value === '2' ? 'Sajid Khan' : (followUpId.value === '1' ? 'Bilal Shah' : 'Customer')))
const linkedRecord = computed(() => currentFollowUp.value?.linkedRecord || currentFollowUp.value?.linked_record || route.query.record || (followUpId.value === '2' ? 'LD-551' : (followUpId.value === '1' ? 'ORD-2238' : 'Record')))
const dueTime = computed(() => currentFollowUp.value?.due || currentFollowUp.value?.due_date || route.query.due || (followUpId.value === '2' ? 'Today 14:00' : 'Today 11:30'))
const status = computed(() => currentFollowUp.value?.status || route.query.status || (followUpId.value === '2' ? 'Due Today' : 'Overdue'))
const isCompleted = computed(() => status.value === 'Completed')

const markComplete = async () => {
  if (!followUpId.value) return
  completing.value = true
  try {
    await api.followUps.complete(followUpId.value)
    if (remoteFollowUp.value) {
      remoteFollowUp.value.status = 'Completed'
    }
    store.completeFollowUp(followUpId.value)
    toastMessage.value = `Follow-up for ${customerName.value} completed successfully!`
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 3500)
  } catch (err) {
    toastMessage.value = err?.message || 'Failed to complete follow-up'
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 3500)
  } finally {
    completing.value = false
  }
}

const branchCurrentTab = ref('Overview')
const branchTabs = ['Overview', 'Linked Record', 'Customer', 'Notes & Actions', 'Activity']

const branchTabData = computed(() => {
  const isSajid = customerName.value.includes('Sajid')
  const branchName = user.value?.branchName || currentFollowUp.value?.branch || 'Peshawar'

  switch (branchCurrentTab.value) {
    case 'Overview':
      return {
        title: 'Overview',
        items: [
          { label: 'Customer', value: customerName.value },
          { label: 'Linked Record', value: linkedRecord.value },
          { label: 'Owner', value: currentFollowUp.value?.owner || 'Hamza' },
          { label: 'Due', value: dueTime.value },
          { label: 'Priority', value: currentFollowUp.value?.priority || (isSajid ? 'Normal' : 'High Priority') },
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
          { label: 'Phone Number', value: currentFollowUp.value?.phone || (isSajid ? '0312 553 8198' : '0333 118 2011') },
          { label: 'Total Orders', value: isSajid ? '0 (Prospect)' : '2 Completed' },
          { label: 'Lifetime Sales', value: isSajid ? 'PKR 0' : 'PKR 540,000' },
          { label: 'Preferred Channel', value: currentFollowUp.value?.channel || (isSajid ? 'WhatsApp / Call' : 'Direct Call') },
          { label: 'Account Standing', value: isSajid ? 'Warm Prospect' : 'Follow-up Required' }
        ]
      }
    case 'Notes & Actions':
      return {
        title: 'Notes & Actions',
        items: [
          { label: 'Task Objective', value: currentFollowUp.value?.notes || (isSajid ? 'Discuss financing and battery warranty' : 'Collect remaining balance PKR 215,000') },
          { label: 'Last Outreach', value: isSajid ? 'Inquiry registered Today 08:40' : 'Yesterday 16:00 (Promised payment today)' },
          { label: 'Next Step', value: isSajid ? 'Book showroom test drive' : 'Verify bank deposit with cashier' },
          { label: 'Assigned Staff', value: currentFollowUp.value?.owner || 'Hamza' },
          { label: 'Escalation Tier', value: isSajid ? 'Standard Sales Flow' : 'Branch Manager Alert' },
          { label: 'Target Completion', value: dueTime.value }
        ]
      }
    case 'Activity':
      return {
        title: 'Follow-up Activity Timeline',
        items: [
          { label: dueTime.value, value: `Follow-up status marked ${status.value}` },
          { label: 'Today 09:00', value: `Daily reminder notification pushed to ${currentFollowUp.value?.owner || 'Hamza'}` },
          { label: 'Interaction Recorded', value: currentFollowUp.value?.notes || 'Interaction history verified by branch team' },
          { label: 'Current State', value: isCompleted.value ? 'Resolved & Closed' : 'Pending resolution' },
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
</script>

<template>
  <div v-if="loading" class="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
    <Loader2 class="w-8 h-8 animate-spin text-[#165A31] mb-2" />
    <p class="text-xs font-medium">Loading follow-up details...</p>
  </div>
  <NotFoundState
    v-else-if="!isValidFollowUp"
    title="Follow-up Not Found"
    message="The requested follow-up could not be found or is not accessible from your current branch context."
    back-link="/sales/follow-ups"
    back-text="Back to Follow-ups"
  />
  <!-- BRANCH MANAGER VIEW -->
  <div v-else-if="isBranchUser" class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[11px] text-gray-400 mb-1 flex items-center gap-1.5">
          <router-link to="/sales/follow-ups" class="hover:text-gray-600 flex items-center gap-1">
            <ArrowLeft class="w-3 h-3" /> Follow-ups
          </router-link>
          <span>/</span>
          <span class="font-medium text-gray-600">Follow-up — {{ customerName }}</span>
        </div>
        <div class="flex items-center gap-3">
          <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Follow-up — {{ customerName }}</h1>
          <span v-if="isCompleted" class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
            Completed
          </span>
        </div>
        <p class="text-xs text-gray-500 mt-1">Follow-up detail — {{ branchCurrentTab }}.</p>
      </div>

      <div class="flex items-center gap-2">
        <button 
          v-if="!isCompleted"
          @click="markComplete" 
          :disabled="completing"
          class="bg-[#165A31] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <Loader2 v-if="completing" class="w-3.5 h-3.5 animate-spin" />
          <CheckCircle2 v-else class="w-3.5 h-3.5" />
          <span>Complete Follow-up</span>
        </button>
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
              <span class="text-sm font-bold text-gray-900 mt-1">{{ currentFollowUp?.owner || 'Hamza' }}</span>
            </div>
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Due</span>
              <span class="text-sm font-bold text-gray-900 mt-1">{{ dueTime }}</span>
            </div>
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Priority</span>
              <span class="text-sm font-bold text-gray-900 mt-1">{{ currentFollowUp?.priority || (customerName.includes('Sajid') ? 'Normal' : 'High') }}</span>
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
        <div class="text-[10px] text-gray-500 mb-1 flex items-center gap-1.5">
          <router-link to="/sales/follow-ups" class="hover:text-gray-700 flex items-center gap-1">
            <ArrowLeft class="w-3 h-3" /> Follow-ups
          </router-link>
          <span>/</span>
          <span class="font-bold text-gray-800">Follow-up Detail</span>
        </div>
        <div class="flex items-center gap-3">
          <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Follow-up Detail</h1>
          <span v-if="isCompleted" class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
            Completed
          </span>
        </div>
        <p class="text-sm text-gray-500 mt-1">{{ customerName }} · {{ linkedRecord }}</p>
      </div>

      <div class="flex items-center gap-2">
        <button 
          v-if="!isCompleted"
          @click="markComplete" 
          :disabled="completing"
          class="bg-[#165A31] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <Loader2 v-if="completing" class="w-3.5 h-3.5 animate-spin" />
          <CheckCircle2 v-else class="w-3.5 h-3.5" />
          <span>Complete Follow-up</span>
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
      <h3 class="text-sm font-bold text-gray-900 mb-4">Follow-up Summary</h3>
      <div class="space-y-3">
        <div class="flex justify-between text-xs"><span class="text-gray-500">Customer:</span><span class="font-bold text-gray-900">{{ customerName }}</span></div>
        <div class="flex justify-between text-xs"><span class="text-gray-500">Linked Record:</span><span class="font-bold text-gray-900">{{ linkedRecord }}</span></div>
        <div class="flex justify-between text-xs"><span class="text-gray-500">Owner:</span><span class="font-bold text-gray-900">{{ currentFollowUp?.owner || 'Hamza' }}</span></div>
        <div class="flex justify-between text-xs"><span class="text-gray-500">Due:</span><span class="font-bold text-gray-900">{{ dueTime }}</span></div>
        <div class="flex justify-between text-xs"><span class="text-gray-500">Status:</span><span class="font-bold text-gray-900">{{ status }}</span></div>
        <div class="flex justify-between text-xs"><span class="text-gray-500">Priority:</span><span class="font-bold text-gray-900">{{ currentFollowUp?.priority || 'Normal' }}</span></div>
        <div v-if="currentFollowUp?.notes" class="flex justify-between text-xs pt-2 border-t border-gray-50"><span class="text-gray-500">Notes:</span><span class="font-medium text-gray-700 max-w-md text-right">{{ currentFollowUp.notes }}</span></div>
      </div>
    </div>
  </div>

  <!-- Toast Notification -->
  <div 
    v-if="showToast" 
    class="fixed bottom-5 right-5 z-[110] bg-[#165A31] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200"
  >
    <CheckCircle2 class="w-4 h-4 flex-shrink-0" />
    <span class="text-xs font-bold">{{ toastMessage }}</span>
  </div>

  <CreateFollowUp 
    v-if="showEditModal" 
    :isModal="true" 
    :followUp="currentFollowUp" 
    @close="showEditModal = false" 
    @updated="loadFollowUpData" 
  />
</template>
