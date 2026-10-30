<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChevronDown, CheckCircle2, UserCheck, Loader2, AlertCircle, ExternalLink, X } from 'lucide-vue-next'
import { store } from '@/store'
import api from '@/services/api'
import CreateLeadModal from './CreateLead.vue'
import NotFoundState from '@/components/common/NotFoundState.vue'

const route = useRoute()
const router = useRouter()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const leadId = computed(() => route.params.id || route.query.id || '')
const remoteLead = ref(null)
const loading = ref(false)
const loadError = ref(null)

const loadLeadData = async () => {
  if (!leadId.value) return
  loading.value = true
  loadError.value = null
  try {
    const response = await api.leads.getById(leadId.value)
    const res = response?.data || response
    if (res) {
      remoteLead.value = res.lead || res
    }
  } catch (err) {
    loadError.value = err
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadLeadData()
})

const currentLead = computed(() => {
  if (remoteLead.value) return remoteLead.value
  if (!leadId.value) return null
  return store.getLeadById(leadId.value)
})

const leadCustomer = computed(() => route.query.name || currentLead.value?.customer_name || currentLead.value?.name || currentLead.value?.customer || '')

const canConvert = computed(() => {
  if (user.value?.isSuperAdmin || user.value?.role === 'Super Admin') return true
  const perms = user.value?.permissions || []
  return perms.includes('leads.convert')
})

const isConverted = computed(() => {
  const l = currentLead.value
  if (!l) return false
  return Boolean(l.customer_id) || l.stage === 'Converted' || l.status === 'Converted'
})

const branchCurrentTab = ref('Requirement')
const branchTabs = ['Requirement', 'Contact', 'Messages', 'Follow-ups', 'Quotation', 'Conversion']

const branchTabData = computed(() => {
  const l = currentLead.value || {}
  const branchName = user.value?.branchName || l.branch || 'Peshawar'

  switch (branchCurrentTab.value) {
    case 'Requirement':
      return {
        title: 'Requirement',
        items: [
          { label: 'Customer', value: leadCustomer.value || 'Prospect' },
          { label: 'Phone', value: l.phone || '—' },
          { label: 'Desired Product', value: l.product || l.product_name || l.interest || 'BRG X7' },
          { label: 'Budget', value: l.budget || (l.budget_amount ? `PKR ${l.budget_amount.toLocaleString()}` : '—') },
          { label: 'Source', value: l.source || 'Website' },
          { label: 'Owner', value: l.owner || 'Hamza' }
        ]
      }
    case 'Contact':
      return {
        title: 'Contact Information',
        items: [
          { label: 'Phone Number', value: l.phone || '—' },
          { label: 'Email Address', value: l.email || '—' },
          { label: 'City', value: l.city || branchName },
          { label: 'Preferred Channel', value: 'WhatsApp' },
          { label: 'Registered Branch', value: `${l.branch || branchName} (${l.branch_id || 'BR-01'})` },
          { label: 'Lead ID', value: l.lead_number || l.leadNo || l.id }
        ]
      }
    case 'Messages':
      return {
        title: 'Inquiry & Messages',
        items: [
          { label: 'Latest Message', value: l.notes || `Inquiry received for ${l.product || l.product_name || 'Vehicle'}` },
          { label: 'Registered Time', value: l.createdAt || 'Recent' },
          { label: 'Communication Channel', value: l.source || 'Website' },
          { label: 'Assigned Agent', value: l.owner || 'Hamza' },
          { label: 'Lead Stage', value: l.stage || l.status || 'New' },
          { label: 'Read Status', value: 'Verified by Branch Team' }
        ]
      }
    case 'Follow-ups':
      return {
        title: 'Follow-up Schedule',
        items: [
          { label: 'Next Scheduled Action', value: l.next_follow_up || l.nextFollowUp || 'Call today' },
          { label: 'Assigned Representative', value: l.owner || 'Hamza' },
          { label: 'Discussion Focus', value: 'Vehicle specifications and financing options' },
          { label: 'Priority', value: 'High Priority' },
          { label: 'Last Contact Attempt', value: 'Recent outreach' },
          { label: 'Target Date', value: l.next_follow_up || 'Immediate' }
        ]
      }
    case 'Quotation':
      return {
        title: 'Quotation Preparation',
        items: [
          { label: 'Quotation Status', value: l.stage === 'Quoted' ? 'Quotation Sent' : 'Not created' },
          { label: 'Requested Model', value: l.product || l.product_name || 'BRG X7' },
          { label: 'Estimated Budget', value: l.budget || '—' },
          { label: 'Available Discounts', value: 'Eligible for Branch Promo' },
          { label: 'Payment Terms', value: 'Full Advance / Installment Option' },
          { label: 'Action', value: 'Ready to generate quote' }
        ]
      }
    case 'Conversion':
      return {
        title: 'Conversion Pipeline',
        items: [
          { label: 'Current Pipeline Stage', value: l.stage || l.status || 'New' },
          { label: 'Conversion Status', value: isConverted.value ? `Converted (Customer: ${l.customer_id || 'Registered'})` : 'Qualified Prospect' },
          { label: 'Customer Linkage', value: l.customer_id || 'Not Yet Linked' },
          { label: 'Lead Quality Tier', value: 'Warm / Hot' },
          { label: 'Branch Assignment', value: `${branchName} Branch` },
          { label: 'Action', value: isConverted.value ? 'Customer Registered' : 'Ready for Conversion' }
        ]
      }
    default:
      return {
        title: 'Requirement',
        items: []
      }
  }
})

// Conversion Modal State
const showConvertModal = ref(false)
const converting = ref(false)
const convertError = ref('')
const convertSuccessResult = ref(null)

const convertForm = ref({
  name: '',
  phone: '',
  cnic: '',
  city: '',
  address: '',
  type: 'Individual',
  notes: ''
})

const openConvertModal = () => {
  if (!currentLead.value) return
  convertForm.value = {
    name: currentLead.value.customer_name || currentLead.value.name || currentLead.value.customer || '',
    phone: currentLead.value.phone || '',
    cnic: currentLead.value.cnic || '',
    city: currentLead.value.city || currentLead.value.branch || 'Peshawar',
    address: currentLead.value.address || '',
    type: 'Individual',
    notes: currentLead.value.notes || `Converted from lead ${currentLead.value.lead_number || currentLead.value.leadNo || currentLead.value.id}`
  }
  convertError.value = ''
  convertSuccessResult.value = null
  showConvertModal.value = true
}

const executeConversion = async () => {
  converting.value = true
  convertError.value = ''
  try {
    const response = await api.leads.convertToCustomer(leadId.value, convertForm.value)
    const res = response?.data || response
    convertSuccessResult.value = res
    if (res?.lead) {
      remoteLead.value = { ...currentLead.value, ...res.lead }
      store.updateLead(leadId.value, res.lead)
    }
    if (res?.customer) {
      store.addCustomer(res.customer)
    }
    toastMessage.value = res?.isExistingCustomer
      ? `Lead linked to existing customer: ${res.customer?.name} (${res.customer?.id})`
      : `Lead converted to new customer: ${res?.customer?.name} (${res?.customer?.id})`
    showToast.value = true
  } catch (err) {
    convertError.value = err.data?.message || err.message || 'Conversion failed. Please try again.'
  } finally {
    converting.value = false
  }
}

const navigateToCustomer = (customerId) => {
  showConvertModal.value = false
  if (customerId) {
    router.push(`/sales/customers/${customerId}`)
  } else {
    router.push('/sales/customers')
  }
}

// Super Admin Data
const showEditModal = ref(false)
const showToast = ref(false)
const toastMessage = ref('')

const handleEdit = () => {
  store.originalEditLead = {
    ...currentLead.value,
    leadNo: currentLead.value?.lead_number || currentLead.value?.leadNo || currentLead.value?.id,
    name: leadCustomer.value,
    customer: leadCustomer.value,
    phone: currentLead.value?.phone || '',
    source: currentLead.value?.source || 'Website',
    branch: currentLead.value?.branch || 'Peshawar',
    owner: currentLead.value?.owner || 'Hamza',
    product: currentLead.value?.product || currentLead.value?.product_name || 'BRG X7',
    budget: currentLead.value?.budget || 'PKR 350K',
    stage: currentLead.value?.stage || 'New',
    nextFollowUp: currentLead.value?.next_follow_up || 'Today'
  }
  showEditModal.value = true
}

const createQuotation = () => {
  router.push({
    path: '/sales/quotations',
    query: {
      customer: leadCustomer.value,
      product: currentLead.value?.product || currentLead.value?.product_name || currentLead.value?.interest || 'BRG E-125'
    }
  })
}
</script>

<template>
  <div v-if="loading" class="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
    <Loader2 class="w-8 h-8 animate-spin text-[#165A31] mb-2" />
    <p class="text-xs font-medium">Loading lead details...</p>
  </div>
  <NotFoundState
    v-else-if="!currentLead"
    title="Lead Not Found"
    message="The requested lead does not exist or you do not have permission to view it in your current branch context."
    backRoute="/sales/leads"
  />
  <!-- BRANCH MANAGER VIEW -->
  <div v-else-if="isBranchUser" class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[11px] text-gray-400 mb-1">
          Branch Manager / Leads / <span class="font-medium text-gray-600">Lead {{ leadId }}</span>
        </div>
        <div class="flex items-center gap-3">
          <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Lead {{ leadId }}</h1>
          <span v-if="isConverted" class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
            Converted
          </span>
        </div>
        <p class="text-xs text-gray-500 mt-1">Requirement, contact history, follow-ups and conversion.</p>
      </div>

      <div class="flex items-center gap-2">
        <button
          v-if="isConverted"
          @click="navigateToCustomer(currentLead.customer_id)"
          class="px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <UserCheck class="w-3.5 h-3.5" />
          Customer: {{ currentLead.customer_id }}
        </button>
        <button
          v-else-if="canConvert"
          @click="openConvertModal"
          class="px-4 py-2 text-xs font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <UserCheck class="w-3.5 h-3.5" />
          Convert to Customer
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

          <!-- Conversion Tab Actions -->
          <div v-if="branchCurrentTab === 'Conversion'" class="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div class="text-xs font-bold text-gray-800">Customer Conversion Workflow</div>
              <div class="text-[11px] text-gray-500">
                {{ isConverted ? 'This lead has been successfully converted and linked to a registered customer.' : 'Qualify prospect and establish registered customer account.' }}
              </div>
            </div>
            <button 
              v-if="!isConverted && canConvert"
              @click="openConvertModal"
              class="px-4 py-2 text-xs font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap self-start sm:self-auto"
            >
              <UserCheck class="w-3.5 h-3.5" />
              Convert to Customer
            </button>
            <button
              v-else-if="isConverted"
              @click="navigateToCustomer(currentLead.customer_id)"
              class="px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap self-start sm:self-auto"
            >
              <UserCheck class="w-3.5 h-3.5" />
              View Customer ({{ currentLead.customer_id }})
            </button>
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
              <span class="text-sm font-bold text-gray-900 mt-1">{{ currentLead.next_follow_up || 'Call today' }}</span>
            </div>
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Quotation</span>
              <span class="text-sm font-bold text-gray-900 mt-1">{{ currentLead.stage === 'Quoted' ? 'Quotation Sent' : 'Not created' }}</span>
            </div>
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Status</span>
              <span class="text-sm font-bold text-gray-900 mt-1">{{ currentLead.stage || currentLead.status || 'New' }}</span>
            </div>
            <div class="bg-[#fbfcfc] border border-gray-100/80 rounded-lg p-3.5 flex flex-col justify-between">
              <span class="text-[10px] font-medium text-gray-400">Customer Link</span>
              <span class="text-sm font-bold text-gray-900 mt-1">{{ currentLead.customer_id || 'None' }}</span>
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
        <div class="flex items-center gap-2">
          <h2 class="text-xl font-bold text-gray-900">{{ currentLead.lead_number || currentLead.id || leadId }} · {{ leadCustomer }}</h2>
          <span v-if="isConverted" class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
            Converted
          </span>
        </div>
        <p class="text-[12px] text-gray-500 mt-1">{{ currentLead.source || 'Website' }} lead · Interested in {{ currentLead.product || currentLead.product_name || currentLead.interest || 'BRG X7' }}</p>
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
            <span class="text-gray-500">Customer Link</span>
            <span class="font-bold text-gray-900">{{ currentLead.customer_id || 'Not Converted' }}</span>
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
          <span class="text-[11px] text-gray-500">{{ currentLead.createdAt || 'Recent' }}</span>
        </div>
      </div>
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
        v-if="isConverted"
        @click="navigateToCustomer(currentLead.customer_id)"
        class="px-5 py-2 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05)] cursor-pointer flex items-center gap-1.5"
      >
        <UserCheck class="w-3.5 h-3.5" />
        View Customer ({{ currentLead.customer_id }})
      </button>
      <button 
        v-else-if="canConvert"
        @click="openConvertModal"
        class="px-5 py-2 text-[11px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05)] cursor-pointer flex items-center gap-1.5"
      >
        <UserCheck class="w-3.5 h-3.5" />
        Convert to Customer
      </button>
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

  <!-- Lead-to-Customer Conversion Modal -->
  <div 
    v-if="showConvertModal"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200"
  >
    <div class="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div>
          <h3 class="text-base font-bold text-gray-900">Convert Lead to Customer</h3>
          <p class="text-xs text-gray-500 mt-0.5">
            Lead: <span class="font-medium text-gray-700">{{ currentLead?.lead_number || currentLead?.leadNo || currentLead?.id }}</span>
          </p>
        </div>
        <button 
          @click="showConvertModal = false" 
          :disabled="converting"
          class="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Success Body -->
      <div v-if="convertSuccessResult" class="p-6 space-y-4">
        <div class="p-4 rounded-xl flex items-start gap-3" :class="convertSuccessResult.isExistingCustomer ? 'bg-amber-50 border border-amber-100' : 'bg-emerald-50 border border-emerald-100'">
          <CheckCircle2 class="w-5 h-5 flex-shrink-0 mt-0.5" :class="convertSuccessResult.isExistingCustomer ? 'text-amber-600' : 'text-emerald-600'" />
          <div>
            <h4 class="text-xs font-bold" :class="convertSuccessResult.isExistingCustomer ? 'text-amber-900' : 'text-emerald-900'">
              {{ convertSuccessResult.isExistingCustomer ? 'Linked to Existing Customer' : 'Customer Created Successfully' }}
            </h4>
            <p class="text-xs mt-1" :class="convertSuccessResult.isExistingCustomer ? 'text-amber-700' : 'text-emerald-700'">
              {{ convertSuccessResult.message || 'Lead has been converted and linked to customer profile.' }}
            </p>
            <div class="mt-2 text-xs font-mono font-medium" :class="convertSuccessResult.isExistingCustomer ? 'text-amber-800' : 'text-emerald-800'">
              Customer ID: {{ convertSuccessResult.customer?.id }} ({{ convertSuccessResult.customer?.name }})
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <button 
            @click="showConvertModal = false" 
            class="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button 
            @click="navigateToCustomer(convertSuccessResult.customer?.id)" 
            class="px-4 py-2 text-xs font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <ExternalLink class="w-3.5 h-3.5" />
            View Customer Profile
          </button>
        </div>
      </div>

      <!-- Conversion Form Body -->
      <div v-else class="p-6 space-y-4 overflow-y-auto">
        <!-- Error alert -->
        <div v-if="convertError" class="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-xs text-red-700">
          <AlertCircle class="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <div>{{ convertError }}</div>
        </div>

        <p class="text-xs text-gray-500">
          Verify the customer information before conversion. If a customer with this phone number already exists in your branch, the lead will be safely linked to their existing record.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div class="sm:col-span-2">
            <label class="block text-xs font-semibold text-gray-700 mb-1">Customer Name <span class="text-red-500">*</span></label>
            <input 
              v-model="convertForm.name" 
              type="text" 
              required
              class="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31]"
              placeholder="Full name"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Phone Number <span class="text-red-500">*</span></label>
            <input 
              v-model="convertForm.phone" 
              type="text" 
              required
              class="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31]"
              placeholder="03XX XXXXXXX"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">CNIC</label>
            <input 
              v-model="convertForm.cnic" 
              type="text" 
              class="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31]"
              placeholder="17301-XXXXXXX-X"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">City</label>
            <input 
              v-model="convertForm.city" 
              type="text" 
              class="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31]"
              placeholder="City"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Customer Type</label>
            <select 
              v-model="convertForm.type"
              class="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] bg-white"
            >
              <option value="Individual">Individual</option>
              <option value="Corporate">Corporate</option>
              <option value="Fleet">Fleet</option>
            </select>
          </div>

          <div class="sm:col-span-2">
            <label class="block text-xs font-semibold text-gray-700 mb-1">Address</label>
            <input 
              v-model="convertForm.address" 
              type="text" 
              class="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31]"
              placeholder="Street address"
            />
          </div>

          <div class="sm:col-span-2">
            <label class="block text-xs font-semibold text-gray-700 mb-1">Notes</label>
            <textarea 
              v-model="convertForm.notes" 
              rows="2"
              class="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] resize-none"
              placeholder="Additional notes"
            ></textarea>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-3 border-t border-gray-100">
          <button 
            type="button"
            @click="showConvertModal = false" 
            :disabled="converting"
            class="px-4 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            type="button"
            @click="executeConversion" 
            :disabled="converting || !convertForm.name || !convertForm.phone"
            class="px-5 py-2 text-xs font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Loader2 v-if="converting" class="w-3.5 h-3.5 animate-spin" />
            <UserCheck v-else class="w-3.5 h-3.5" />
            <span>{{ converting ? 'Converting...' : 'Confirm & Convert' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <CreateLeadModal v-if="showEditModal" @close="showEditModal = false" />
</template>

