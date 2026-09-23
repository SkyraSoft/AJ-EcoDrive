<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChevronDown } from 'lucide-vue-next'
import { store } from '@/store'
import CreateLeadModal from './CreateLead.vue'

const route = useRoute()
const router = useRouter()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const leadId = computed(() => route.params.id || route.query.id || 'LD-551')
const currentLead = computed(() => store.getLeadById(leadId.value) || store.leads[0] || {
  id: leadId.value,
  name: 'Sajid Khan',
  customer: 'Sajid Khan',
  phone: '0312 553 8198',
  product: 'BRG X7',
  budget: 'PKR 350,000',
  source: 'Website',
  owner: 'Hamza',
  stage: 'New',
  branch: 'Peshawar'
})
const leadCustomer = computed(() => route.query.name || currentLead.value.name || currentLead.value.customer || 'Sajid Khan')

const branchCurrentTab = ref('Requirement')
const branchTabs = ['Requirement', 'Contact', 'Messages', 'Follow-ups', 'Quotation', 'Conversion']

const branchTabData = computed(() => {
  const l = currentLead.value
  const branchName = user.value?.branchName || l.branch || 'Peshawar'

  switch (branchCurrentTab.value) {
    case 'Requirement':
      return {
        title: 'Requirement',
        items: [
          { label: 'Customer', value: leadCustomer.value },
          { label: 'Phone', value: l.phone || '0312 553 8198' },
          { label: 'Desired Product', value: l.product || l.interest || 'BRG X7' },
          { label: 'Budget', value: l.budget || 'PKR 350,000' },
          { label: 'Source', value: l.source || 'Website' },
          { label: 'Owner', value: l.owner || 'Hamza' }
        ]
      }
    case 'Contact':
      return {
        title: 'Contact Information',
        items: [
          { label: 'Phone Number', value: '0312 553 8198' },
          { label: 'Email Address', value: 'sajid.khan@gmail.com' },
          { label: 'City', value: 'Peshawar' },
          { label: 'Preferred Channel', value: 'WhatsApp' },
          { label: 'Preferred Time', value: '2 PM - 6 PM' },
          { label: 'Alt Phone', value: '091 584 1122' }
        ]
      }
    case 'Messages':
      return {
        title: 'Inquiry & Messages',
        items: [
          { label: 'Latest Message', value: 'Inquiry received via Web Portal for BRG X7' },
          { label: 'Received Time', value: 'Today 08:40' },
          { label: 'Communication Channel', value: 'Web Chat / Website Form' },
          { label: 'Assigned Agent', value: 'Hamza' },
          { label: 'Auto-reply Status', value: 'Sent' },
          { label: 'Read Status', value: 'Read by Branch Team' }
        ]
      }
    case 'Follow-ups':
      return {
        title: 'Follow-up Schedule',
        items: [
          { label: 'Next Scheduled Action', value: 'Call today' },
          { label: 'Assigned Representative', value: 'Hamza' },
          { label: 'Discussion Focus', value: 'Vehicle specifications and financing options' },
          { label: 'Priority', value: 'High Priority' },
          { label: 'Last Contact Attempt', value: 'Pending first outreach' },
          { label: 'Target Date', value: 'Today (Immediate)' }
        ]
      }
    case 'Quotation':
      return {
        title: 'Quotation Preparation',
        items: [
          { label: 'Quotation Status', value: 'Not created' },
          { label: 'Requested Model', value: 'BRG X7 (Lithium 72V)' },
          { label: 'Estimated Price', value: 'PKR 350,000' },
          { label: 'Available Discounts', value: 'Eligible for Branch Promo' },
          { label: 'Payment Terms', value: 'Full Advance / Installment Option' },
          { label: 'Action', value: 'Ready to generate quote' }
        ]
      }
    case 'Conversion':
      return {
        title: 'Conversion Pipeline',
        items: [
          { label: 'Current Pipeline Stage', value: 'Initial Qualification' },
          { label: 'Win Probability', value: '60%' },
          { label: 'Target Close Window', value: 'Within 7–14 Days' },
          { label: 'Lead Quality Tier', value: 'Warm / Hot' },
          { label: 'Branch Assignment', value: `${branchName} Branch` },
          { label: 'Next Milestone', value: 'Showroom Visit & Test Drive' }
        ]
      }
    default:
      return {
        title: 'Requirement',
        items: []
      }
  }
})

// Super Admin Data
const showEditModal = ref(false)
const showToast = ref(false)
const toastMessage = ref('')

const handleEdit = () => {
  store.originalEditLead = {
    name: leadCustomer.value,
    phone: currentLead.value?.phone || '0312 553 8198',
    source: currentLead.value?.source || 'Website',
    branch: currentLead.value?.branch || 'Peshawar',
    owner: currentLead.value?.owner || 'Hamza',
    product: currentLead.value?.product || 'BRG X7',
    budget: currentLead.value?.budget || 'PKR 350K',
    stage: currentLead.value?.stage || 'New',
    nextFollowUp: 'Today'
  }
  showEditModal.value = true
}

const convertToCustomer = () => {
  try {
    const res = store.convertLeadToCustomer(leadId.value)
    toastMessage.value = `Lead converted to customer: ${res.customer.name} (${res.customer.id})`
    showToast.value = true
    setTimeout(() => {
      router.push('/sales/customers')
    }, 1200)
  } catch (err) {
    alert(err.message)
  }
}

const createQuotation = () => {
  router.push({
    path: '/sales/quotations',
    query: {
      customer: leadCustomer.value,
      product: currentLead.value?.product || currentLead.value?.interest || 'BRG E-125'
    }
  })
}
</script>

<template>
  <!-- BRANCH MANAGER VIEW -->
  <div v-if="isBranchUser" class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[11px] text-gray-400 mb-1">
          Branch Manager / Leads / <span class="font-medium text-gray-600">Lead {{ leadId }}</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Lead {{ leadId }}</h1>
        <p class="text-xs text-gray-500 mt-1">Requirement, contact history, follow-ups and conversion.</p>
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
              <span class="text-[10px] font-medium text-gray-400">Next Action</span>
              <span class="text-sm font-bold text-gray-900 mt-1">Call today</span>
            </div>
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Quotation</span>
              <span class="text-sm font-bold text-gray-900 mt-1">Not created</span>
            </div>
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Status</span>
              <span class="text-sm font-bold text-gray-900 mt-1">New</span>
            </div>
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Created</span>
              <span class="text-sm font-bold text-gray-900 mt-1">Today 08:40</span>
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
        <h2 class="text-xl font-bold text-gray-900">{{ currentLead.id || leadId }} · {{ leadCustomer }}</h2>
        <p class="text-[12px] text-gray-500 mt-1">{{ currentLead.source || 'Website' }} lead · Interested in {{ currentLead.product || currentLead.interest || 'BRG X7' }}</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="inline-flex items-center px-2 py-1 rounded-[4px] text-[10px] font-bold bg-blue-50 text-blue-600">{{ currentLead.stage || currentLead.status || 'New' }}</span>
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
            <span class="font-bold text-gray-900">{{ currentLead.phone || '0312 553 8198' }}</span>
          </div>
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Source</span>
            <span class="font-bold text-gray-900">{{ currentLead.source || 'Website' }}</span>
          </div>
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Branch</span>
            <span class="font-bold text-gray-900">{{ currentLead.branch || 'Peshawar' }}</span>
          </div>
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Owner</span>
            <span class="font-bold text-gray-900">{{ currentLead.owner || 'Hamza' }}</span>
          </div>
        </div>
      </div>

      <!-- Opportunity -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-4 border-b border-gray-50 pb-3">Opportunity</h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Product</span>
            <span class="font-bold text-gray-900">{{ currentLead.product || currentLead.interest || 'BRG X7' }}</span>
          </div>
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Budget</span>
            <span class="font-bold text-gray-900">{{ currentLead.budget || 'PKR 350K' }}</span>
          </div>
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Stage</span>
            <span class="font-bold text-gray-900">{{ currentLead.stage || currentLead.status || 'New' }}</span>
          </div>
          <div class="flex justify-between items-center text-[12px]">
            <span class="text-gray-500">Next Follow-up</span>
            <span class="font-bold text-gray-900">{{ currentLead.followUp || currentLead.nextFollowUp || 'Today' }}</span>
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
          <span class="text-[12px] font-bold text-gray-900 pl-4">Product inquiry registered</span>
          <span class="text-[11px] text-gray-500">Today 08:40</span>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div 
      v-if="showToast" 
      class="fixed bottom-5 right-5 z-[110] bg-[#165A31] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200"
    >
      <span class="text-xs font-bold">{{ toastMessage }}</span>
    </div>

    <!-- Actions -->
    <div class="flex justify-end gap-3 pt-4">
      <button 
        @click="createQuotation"
        class="px-5 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer"
      >
        Create Quotation
      </button>
      <button 
        v-if="currentLead.stage !== 'Converted'"
        @click="convertToCustomer"
        class="px-5 py-2 text-[11px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05)] cursor-pointer"
      >
        Convert to Customer
      </button>
    </div>
    
    <CreateLeadModal v-if="showEditModal" @close="showEditModal = false" />
  </div>
</template>

