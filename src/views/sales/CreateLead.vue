<script setup>
import { ref, onMounted } from 'vue'
import { X } from 'lucide-vue-next'
import { store } from '@/store'

const emit = defineEmits(['close'])
const formData = ref({
  name: '',
  phone: '',
  source: 'Walk-in',
  branch: 'Peshawar',
  owner: '',
  product: '',
  budget: '',
  stage: 'New',
  nextFollowUp: ''
})

const showValidation = ref(false)
const isEditMode = ref(false)

onMounted(() => {
  if (store.originalEditLead) {
    isEditMode.value = true
    formData.value = { ...store.originalEditLead }
  }
})

const close = () => {
  store.originalEditLead = null
  emit('close')
}

const saveLead = () => {
  if (!formData.value.name || !formData.value.phone) {
    showValidation.value = true
    return
  }
  
  if (isEditMode.value) {
    store.applyEdit(store.originalEditLead, formData.value)
    store.originalEditLead = null
  }
  emit('close')
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
            Super Admin / Sales & CRM / Leads / <span class="font-bold text-gray-800">{{ isEditMode ? 'Edit Lead' : 'Add Lead' }}</span>
          </div>
          <h1 class="text-[32px] tracking-tight font-bold text-gray-900">{{ isEditMode ? 'Edit Lead' : 'Add Lead' }}</h1>
          <p class="text-sm text-gray-500 mt-1">Capture prospect details, interest level, channel and follow-up timeline.</p>
        </div>

        <!-- 2-Column Card Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          
          <!-- 1. Lead Information Card -->
          <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
            <h3 class="text-[14px] font-bold text-gray-900 mb-4">Lead Information</h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1">Name *</label>
                <input v-model="formData.name" type="text" placeholder="Full name..." class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
                <p v-if="showValidation && !formData.name" class="text-[10px] text-red-500 mt-1">This field is required</p>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1">Phone *</label>
                <input v-model="formData.phone" type="text" placeholder="+92 3XX XXXXXXX" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
                <p v-if="showValidation && !formData.phone" class="text-[10px] text-red-500 mt-1">This field is required</p>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1">Source</label>
                <select v-model="formData.source" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors">
                  <option value="Website">Website</option>
                  <option value="Walk-in">Walk-in</option>
                  <option value="Referral">Referral</option>
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
                <select v-model="formData.branch" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors">
                  <option value="Peshawar">Peshawar</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Lahore">Lahore</option>
                </select>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1">Owner</label>
                <input v-model="formData.owner" type="text" placeholder="Assigned staff..." class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1">Stage</label>
                <select v-model="formData.stage" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors">
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
                <input v-model="formData.product" type="text" placeholder="e.g. BRG EV-5" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1">Budget Estimate</label>
                <input v-model="formData.budget" type="text" placeholder="e.g. PKR 220K" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
              </div>
            </div>
          </div>

          <!-- 4. Follow-up Card -->
          <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
            <h3 class="text-[14px] font-bold text-gray-900 mb-4">Follow-up Timeline</h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1">Next Follow-up Date</label>
                <input v-model="formData.nextFollowUp" type="text" placeholder="e.g. Aug 28" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
              </div>
            </div>
          </div>

        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-end gap-3 pt-2">
          <button @click="close" class="bg-white border border-gray-200 text-gray-700 text-xs font-semibold px-5 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-sm">
            Cancel
          </button>
          <button @click="saveLead" class="bg-[#165A31] text-white text-xs font-semibold px-5 py-2 rounded-lg hover:bg-[#124a28] transition-colors cursor-pointer shadow-sm">
            {{ isEditMode ? 'Update Lead' : 'Save Lead' }}
          </button>
        </div>
      </div>

    </div>
  </div>
</template>
