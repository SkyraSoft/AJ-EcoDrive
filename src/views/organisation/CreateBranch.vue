<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { X } from 'lucide-vue-next'

const props = defineProps({
  isModal: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close', 'created'])
const router = useRouter()

const form = ref({
  name: '',
  code: '',
  status: 'Active',
  address: '',
  city: 'Peshawar',
  area: '',
  phone: '',
  email: '',
  manager: 'Ahsan Khan',
  defaultLocation: 'Main Warehouse',
  hours: '9 AM - 6 PM',
  expenseLimit: '100000',
  discountLimit: '10%',
  salesRules: 'Standard BRG retail rules',
  notes: ''
})

const errors = ref({})
const showValidation = ref(false)

const validate = () => {
  errors.value = {}
  if (!form.value.name.trim()) errors.value.name = 'Branch name is required.'
  if (!form.value.code.trim()) errors.value.code = 'Branch code is required.'
  if (!form.value.city.trim()) errors.value.city = 'City is required.'
  if (!form.value.phone.trim()) errors.value.phone = 'Phone number is required.'
  if (!form.value.email.trim()) errors.value.email = 'Email address is required.'
  return Object.keys(errors.value).length === 0
}

const cancel = () => {
  emit('close')
  if (!props.isModal && router.currentRoute.value.path.includes('/create')) {
    router.push('/organisation/branches')
  }
}

const submitForm = () => {
  showValidation.value = true
  if (!validate()) return

  const newBranch = {
    ...form.value,
    sales: '0M',
    inventory: '0M',
    expenses: '0M',
    profit: '0M'
  }

  emit('created', newBranch)
  cancel()
}
</script>

<template>
  <div class="fixed inset-0 bg-gray-900/50 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm" @click.self="cancel">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">
      
      <!-- Close button on top right -->
      <button @click="cancel" class="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-100 rounded-full z-50 shadow-sm transition-colors cursor-pointer">
        <X class="w-5 h-5" />
      </button>

      <!-- Scrollable Body -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
        <div class="space-y-6">
          <!-- Header -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            <div>
              <div class="text-[10px] text-gray-500 mb-1">Super Admin / Organisation / Branches / <span class="font-bold text-gray-800">Create Branch</span></div>
              <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Create Branch</h1>
              <p class="text-sm text-gray-500 mt-1">Create a controlled operating location with manager, stock and expense settings.</p>
            </div>
          </div>

          <!-- Form Grid -->
          <form @submit.prevent="submitForm" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <!-- 1. Branch Identity -->
              <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
                <h3 class="text-[14px] font-bold text-gray-900 mb-2">1. Branch Identity</h3>
                
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Branch Name *</label>
                  <input 
                    v-model="form.name" 
                    type="text" 
                    placeholder="e.g. Peshawar Branch" 
                    :class="[
                      'w-full px-3.5 py-2 text-xs border rounded-lg focus:outline-none transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]',
                      showValidation && errors.name ? 'border-red-300 bg-red-50/20 focus:border-red-500' : 'border-gray-200 focus:border-[#165A31]'
                    ]"
                  />
                  <p v-if="showValidation && errors.name" class="text-[10px] text-red-500 mt-1 font-medium">{{ errors.name }}</p>
                </div>
                
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Branch Code *</label>
                  <input 
                    v-model="form.code" 
                    type="text" 
                    placeholder="e.g. PEW-01" 
                    :class="[
                      'w-full px-3.5 py-2 text-xs border rounded-lg focus:outline-none transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]',
                      showValidation && errors.code ? 'border-red-300 bg-red-50/20 focus:border-red-500' : 'border-gray-200 focus:border-[#165A31]'
                    ]"
                  />
                  <p v-if="showValidation && errors.code" class="text-[10px] text-red-500 mt-1 font-medium">{{ errors.code }}</p>
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Status</label>
                  <select v-model="form.status" class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <!-- 2. Location & Contact -->
              <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
                <h3 class="text-[14px] font-bold text-gray-900 mb-2">2. Location & Contact</h3>
                
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Address</label>
                  <input v-model="form.address" type="text" placeholder="e.g. 123 Main St" class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">City *</label>
                    <input 
                      v-model="form.city" 
                      type="text" 
                      placeholder="e.g. Peshawar" 
                      :class="[
                        'w-full px-3.5 py-2 text-xs border rounded-lg focus:outline-none transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]',
                        showValidation && errors.city ? 'border-red-300 bg-red-50/20 focus:border-red-500' : 'border-gray-200 focus:border-[#165A31]'
                      ]"
                    />
                    <p v-if="showValidation && errors.city" class="text-[10px] text-red-500 mt-1 font-medium">{{ errors.city }}</p>
                  </div>
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Area</label>
                    <input v-model="form.area" type="text" placeholder="e.g. Hayatabad" class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Phone *</label>
                    <input 
                      v-model="form.phone" 
                      type="text" 
                      placeholder="+92 300 1234567" 
                      :class="[
                        'w-full px-3.5 py-2 text-xs border rounded-lg focus:outline-none transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]',
                        showValidation && errors.phone ? 'border-red-300 bg-red-50/20 focus:border-red-500' : 'border-gray-200 focus:border-[#165A31]'
                      ]"
                    />
                    <p v-if="showValidation && errors.phone" class="text-[10px] text-red-500 mt-1 font-medium">{{ errors.phone }}</p>
                  </div>
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Email *</label>
                    <input 
                      v-model="form.email" 
                      type="email" 
                      placeholder="pew@ajecodrive.com" 
                      :class="[
                        'w-full px-3.5 py-2 text-xs border rounded-lg focus:outline-none transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]',
                        showValidation && errors.email ? 'border-red-300 bg-red-50/20 focus:border-red-500' : 'border-gray-200 focus:border-[#165A31]'
                      ]"
                    />
                    <p v-if="showValidation && errors.email" class="text-[10px] text-red-500 mt-1 font-medium">{{ errors.email }}</p>
                  </div>
                </div>
              </div>

              <!-- 3. Management & Operations -->
              <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
                <h3 class="text-[14px] font-bold text-gray-900 mb-2">3. Management & Operations</h3>
                
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Branch Manager</label>
                  <select v-model="form.manager" class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white">
                    <option value="Ahsan Khan">Ahsan Khan</option>
                    <option value="Hassan Ali">Hassan Ali</option>
                    <option value="Sami Ullah">Sami Ullah</option>
                    <option value="Usman Tariq">Usman Tariq</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Opening Hours</label>
                  <input v-model="form.hours" type="text" placeholder="e.g. 9 AM - 6 PM" class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Default Stock Location</label>
                  <input v-model="form.defaultLocation" type="text" placeholder="e.g. Main Warehouse" class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
                </div>
              </div>

              <!-- 4. Controls -->
              <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
                <h3 class="text-[14px] font-bold text-gray-900 mb-2">4. Controls & Policies</h3>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Expense Limit (PKR)</label>
                    <input v-model="form.expenseLimit" type="text" placeholder="100000" class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
                  </div>
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Discount Limit</label>
                    <input v-model="form.discountLimit" type="text" placeholder="10%" class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
                  </div>
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Sales Settings</label>
                  <input v-model="form.salesRules" type="text" placeholder="Standard BRG retail rules" class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Notes</label>
                  <input v-model="form.notes" type="text" placeholder="Optional internal notes..." class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
                </div>
              </div>

            </div>

            <!-- Actions -->
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button type="button" @click="cancel" class="px-5 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
                Cancel
              </button>
              <button type="submit" class="px-5 py-2 text-xs font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer">
                Create Branch
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>