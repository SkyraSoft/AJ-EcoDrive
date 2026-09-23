<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { X } from 'lucide-vue-next'
import { store } from '@/store'

const props = defineProps({
  isModal: {
    type: Boolean,
    default: true
  },
  lead: {
    type: Object,
    default: null
  }
})

const router = useRouter()
const emit = defineEmits(['close', 'created', 'updated'])
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const showValidation = ref(false)
const isEditMode = ref(false)

const formData = ref({
  leadNo: '',
  name: '',
  customer: '',
  phone: '',
  source: 'Walk-in',
  branch: user.value?.branchName || 'Peshawar',
  owner: 'Hamza',
  product: 'BRG X7',
  budget: 'PKR 220K',
  stage: 'New',
  nextFollowUp: 'Aug 30'
})

const loadData = (data) => {
  if (!data) return
  isEditMode.value = true
  formData.value = {
    ...formData.value,
    leadNo: data.leadNo || formData.value.leadNo,
    name: data.name || data.customer || formData.value.name,
    customer: data.customer || data.name || formData.value.customer,
    phone: data.phone || formData.value.phone,
    source: data.source || formData.value.source,
    branch: data.branch || formData.value.branch,
    owner: data.owner || formData.value.owner,
    product: data.product || data.interest || formData.value.product,
    budget: data.budget || formData.value.budget,
    stage: data.stage || data.status || formData.value.stage,
    nextFollowUp: data.nextFollowUp || data.followUp || formData.value.nextFollowUp
  }
}

onMounted(() => {
  if (props.lead) {
    loadData(props.lead)
  } else if (store.originalEditLead) {
    loadData(store.originalEditLead)
  }
})

watch(() => props.lead, (newVal) => {
  if (newVal) loadData(newVal)
}, { immediate: true })

const close = () => {
  store.originalEditLead = null
  emit('close')
  if (router.currentRoute.value.path.includes('/create')) {
    router.push('/sales/leads')
  }
}

const saveLead = () => {
  if ((!formData.value.name.trim() && !formData.value.customer.trim()) || !formData.value.phone.trim()) {
    showValidation.value = true
    return
  }

  const leadName = formData.value.name.trim() || formData.value.customer.trim()
  const payload = {
    leadNo: formData.value.leadNo || `LD-${Math.floor(100 + Math.random() * 900)}`,
    name: leadName,
    customer: leadName,
    phone: formData.value.phone,
    source: formData.value.source,
    branch: formData.value.branch || user.value?.branchName || 'Peshawar',
    owner: formData.value.owner,
    product: formData.value.product,
    interest: formData.value.product,
    budget: formData.value.budget,
    stage: formData.value.stage,
    status: formData.value.stage,
    statusClass: formData.value.stage === 'Quoted' ? 'bg-[#dcfce7] text-[#165A31]' : 'bg-[#eff6ff] text-[#2563eb]',
    stageColor: formData.value.stage === 'Converted' ? 'bg-green-50 text-[#165A31]' : 'bg-blue-50 text-blue-600',
    followUp: formData.value.nextFollowUp,
    nextFollowUp: formData.value.nextFollowUp
  }

  if (isEditMode.value) {
    store.updateLead(payload)
    emit('updated', payload)
  } else {
    store.addLead(payload)
    emit('created', payload)
  }
  close()
}
</script>

<template>
  <div class="fixed inset-0 bg-gray-900/50 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm" @click.self="close">
    
    <!-- Close button on top-right of screen overlay -->
    <button @click="close" class="fixed top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-100 rounded-full z-[110] shadow-lg transition-colors cursor-pointer">
      <X class="w-5 h-5" />
    </button>

    <!-- Modal Card -->
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">
      
      <!-- Scrollable Form Body -->
      <div class="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
        <!-- Header -->
        <div>
          <div class="text-[10px] text-gray-500 mb-1">
            <span v-if="isBranchUser">Branch Manager / Leads / <span class="font-bold text-gray-800">{{ isEditMode ? 'Edit Lead' : 'Add Lead' }}</span></span>
            <span v-else>Super Admin / Sales & CRM / Leads / <span class="font-bold text-gray-800">{{ isEditMode ? 'Edit Lead' : 'Add Lead' }}</span></span>
          </div>
          <h1 class="text-[32px] tracking-tight font-bold text-gray-900">{{ isEditMode ? 'Edit Lead' : 'Add Lead' }}</h1>
          <p class="text-sm text-gray-500 mt-1">Capture prospect details, interest level, channel and follow-up timeline.</p>
        </div>

        <form @submit.prevent="saveLead" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            <!-- 1. Lead Information Card -->
            <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
              <h3 class="text-[14px] font-bold text-gray-900 mb-4">Lead Information</h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Lead / Customer Name *</label>
                  <input 
                    v-model="formData.name" 
                    type="text" 
                    placeholder="Full name..." 
                    class="w-full px-3.5 py-2 text-[12px] bg-white border rounded-lg focus:outline-none focus:border-[#165A31] transition-colors"
                    :class="showValidation && !formData.name.trim() && !formData.customer.trim() ? 'border-red-300 bg-red-50/20' : 'border-gray-200'"
                  />
                  <p v-if="showValidation && !formData.name.trim() && !formData.customer.trim()" class="text-[10px] text-red-500 mt-1">Name is required</p>
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Phone Number *</label>
                  <input 
                    v-model="formData.phone" 
                    type="text" 
                    placeholder="+92 3XX XXXXXXX" 
                    class="w-full px-3.5 py-2 text-[12px] bg-white border rounded-lg focus:outline-none focus:border-[#165A31] transition-colors"
                    :class="showValidation && !formData.phone.trim() ? 'border-red-300 bg-red-50/20' : 'border-gray-200'"
                  />
                  <p v-if="showValidation && !formData.phone.trim()" class="text-[10px] text-red-500 mt-1">Phone number is required</p>
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Lead Source</label>
                  <select v-model="formData.source" class="w-full px-3.5 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors">
                    <option value="Website">Website Inquiry</option>
                    <option value="Walk-in">Walk-in Showroom</option>
                    <option value="Referral">Customer Referral</option>
                    <option value="Phone Call">Phone Call</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- 2. Assignment & Scope Card -->
            <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
              <h3 class="text-[14px] font-bold text-gray-900 mb-4">Assignment & Scope</h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Branch</label>
                  <select v-model="formData.branch" class="w-full px-3.5 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors">
                    <option value="Peshawar">Peshawar</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Lahore">Lahore</option>
                  </select>
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Assigned Sales Owner</label>
                  <input v-model="formData.owner" type="text" placeholder="e.g. Hamza Ali" class="w-full px-3.5 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors" />
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Stage / Status</label>
                  <select v-model="formData.stage" class="w-full px-3.5 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors">
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Quoted">Quoted</option>
                    <option value="Converted">Converted</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- 3. Opportunity Card -->
            <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
              <h3 class="text-[14px] font-bold text-gray-900 mb-4">Opportunity</h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Interested Product</label>
                  <input v-model="formData.product" type="text" placeholder="e.g. BRG X7 / EV-5" class="w-full px-3.5 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors" />
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Budget Estimate</label>
                  <input v-model="formData.budget" type="text" placeholder="e.g. PKR 220K" class="w-full px-3.5 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors" />
                </div>
              </div>
            </div>

            <!-- 4. Follow-up Card -->
            <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
              <h3 class="text-[14px] font-bold text-gray-900 mb-4">Follow-up Timeline</h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Next Follow-up Date</label>
                  <input v-model="formData.nextFollowUp" type="text" placeholder="e.g. Aug 30" class="w-full px-3.5 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors" />
                </div>
              </div>
            </div>

          </div>

          <!-- Footer Actions -->
          <div class="flex items-center justify-end gap-3 pt-2">
            <button 
              type="button" 
              @click="close" 
              class="bg-white border border-gray-200 text-gray-700 text-xs font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-sm"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="bg-[#165A31] text-white text-xs font-semibold px-5 py-2.5 rounded-lg hover:bg-[#124a28] transition-colors cursor-pointer shadow-sm"
            >
              {{ isEditMode ? 'Update Lead' : 'Save Lead' }}
            </button>
          </div>
        </form>
      </div>

    </div>
  </div>
</template>
