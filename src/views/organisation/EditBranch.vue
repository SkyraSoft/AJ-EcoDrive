<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { X } from 'lucide-vue-next'
import { store } from '../../store.js'

const props = defineProps({
  isModal: {
    type: Boolean,
    default: true
  },
  branch: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'updated'])
const router = useRouter()

const branchData = ref({
  name: '',
  code: '',
  status: 'Active',
  address: '',
  city: '',
  area: '',
  phone: '',
  email: '',
  manager: '',
  defaultLocation: '',
  hours: '',
  expenseLimit: '',
  discountLimit: '',
  salesRules: '',
  changeNote: ''
})

const errors = ref({})
const showValidation = ref(false)

const loadData = () => {
  const source = props.branch || store.originalEditBranch || {
    name: 'Peshawar',
    code: 'PEW-01',
    city: 'Peshawar',
    manager: 'Ahsan Khan',
    sales: '9.8M',
    inventory: '14.2M',
    expenses: '1.0M',
    profit: '1.4M',
    status: 'Active',
    address: '123 Main St',
    area: 'Hayatabad',
    phone: '+92 300 1234567',
    email: 'pew@ajecodrive.com',
    defaultLocation: 'Main Warehouse',
    hours: '9 AM - 6 PM',
    expenseLimit: '100000',
    discountLimit: '10%',
    salesRules: 'Standard',
    changeNote: ''
  }

  branchData.value = { ...branchData.value, ...source }
}

onMounted(() => {
  loadData()
})

watch(() => props.branch, () => {
  loadData()
})

const validate = () => {
  errors.value = {}
  if (!branchData.value.name.trim()) errors.value.name = 'Branch name is required.'
  if (!branchData.value.code.trim()) errors.value.code = 'Branch code is required.'
  if (!branchData.value.city.trim()) errors.value.city = 'City is required.'
  if (!branchData.value.phone.trim()) errors.value.phone = 'Phone is required.'
  if (!branchData.value.email.trim()) errors.value.email = 'Email is required.'
  return Object.keys(errors.value).length === 0
}

const cancel = () => {
  emit('close')
  if (!props.isModal && router.currentRoute.value.path.includes('/edit')) {
    router.push('/organisation/branches')
  }
}

const saveChanges = () => {
  showValidation.value = true
  if (!validate()) return

  if (store.originalEditBranch) {
    store.applyEdit(store.originalEditBranch, branchData.value)
  }

  emit('updated', branchData.value)
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
              <div class="text-[10px] text-gray-500 mb-1">Super Admin / Organisation / Branches / <span class="font-bold text-gray-800">Edit Branch</span></div>
              <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Edit Branch</h1>
              <p class="text-[13px] text-gray-500 mt-1">Update branch configuration or archive the location without deleting history.</p>
            </div>
          </div>

          <!-- Top Status Banner -->
          <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 class="text-lg font-bold text-gray-900 leading-tight">{{ branchData.name || 'Branch' }}</h2>
              <div class="text-xs font-medium text-gray-500 mt-0.5">
                {{ branchData.code }} · {{ branchData.city }} · <span class="text-[#165A31] font-semibold">{{ branchData.status }}</span>
              </div>
            </div>
            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#eefcf2] text-[#165A31]">
              {{ branchData.status }}
            </span>
          </div>

          <!-- Form Grid -->
          <form @submit.prevent="saveChanges" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <!-- 1. Identity -->
              <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
                <h3 class="text-[13px] font-bold text-gray-900 mb-2">1. Identity</h3>
                
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Branch Name *</label>
                  <input 
                    v-model="branchData.name" 
                    type="text" 
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
                    v-model="branchData.code" 
                    type="text" 
                    :class="[
                      'w-full px-3.5 py-2 text-xs border rounded-lg focus:outline-none transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]',
                      showValidation && errors.code ? 'border-red-300 bg-red-50/20 focus:border-red-500' : 'border-gray-200 focus:border-[#165A31]'
                    ]" 
                  />
                  <p v-if="showValidation && errors.code" class="text-[10px] text-red-500 mt-1 font-medium">{{ errors.code }}</p>
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Status</label>
                  <select v-model="branchData.status" class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <!-- 2. Location & Contact -->
              <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
                <h3 class="text-[13px] font-bold text-gray-900 mb-2">2. Location & Contact</h3>
                
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Address</label>
                  <input v-model="branchData.address" type="text" class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">City *</label>
                    <input 
                      v-model="branchData.city" 
                      type="text" 
                      :class="[
                        'w-full px-3.5 py-2 text-xs border rounded-lg focus:outline-none transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]',
                        showValidation && errors.city ? 'border-red-300 bg-red-50/20 focus:border-red-500' : 'border-gray-200 focus:border-[#165A31]'
                      ]" 
                    />
                    <p v-if="showValidation && errors.city" class="text-[10px] text-red-500 mt-1 font-medium">{{ errors.city }}</p>
                  </div>
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Area</label>
                    <input v-model="branchData.area" type="text" class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Phone *</label>
                    <input 
                      v-model="branchData.phone" 
                      type="text" 
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
                      v-model="branchData.email" 
                      type="email" 
                      :class="[
                        'w-full px-3.5 py-2 text-xs border rounded-lg focus:outline-none transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]',
                        showValidation && errors.email ? 'border-red-300 bg-red-50/20 focus:border-red-500' : 'border-gray-200 focus:border-[#165A31]'
                      ]" 
                    />
                    <p v-if="showValidation && errors.email" class="text-[10px] text-red-500 mt-1 font-medium">{{ errors.email }}</p>
                  </div>
                </div>
              </div>

              <!-- 3. Manager & Operations -->
              <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
                <h3 class="text-[13px] font-bold text-gray-900 mb-2">3. Manager & Operations</h3>
                
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Branch Manager</label>
                  <input v-model="branchData.manager" type="text" class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
                </div>
                
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Default Stock Location</label>
                  <input v-model="branchData.defaultLocation" type="text" class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Opening Hours</label>
                  <input v-model="branchData.hours" type="text" class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
                </div>
              </div>

              <!-- 4. Controls -->
              <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
                <h3 class="text-[13px] font-bold text-gray-900 mb-2">4. Controls & Policies</h3>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Expense Limit (PKR)</label>
                    <input v-model="branchData.expenseLimit" type="text" class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
                  </div>
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Discount Limit</label>
                    <input v-model="branchData.discountLimit" type="text" class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
                  </div>
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Sales Rules</label>
                  <input v-model="branchData.salesRules" type="text" class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Change Note</label>
                  <input v-model="branchData.changeNote" type="text" placeholder="Quarterly branch configuration review." class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
                </div>
              </div>

            </div>

            <!-- Actions -->
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button type="button" @click="cancel" class="px-5 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
                Cancel
              </button>
              <button type="submit" class="px-5 py-2 text-xs font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>