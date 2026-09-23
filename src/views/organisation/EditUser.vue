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
  user: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'updated'])
const router = useRouter()

const userData = ref({
  name: '',
  email: '',
  mobile: '',
  role: 'Branch Manager',
  branch: 'Peshawar',
  status: 'Active',
  mfa: 'On',
  invitation: 'Accepted',
  sessionPolicy: 'Standard'
})

const errors = ref({})
const showValidation = ref(false)

const loadData = () => {
  const source = props.user || store.originalEditUser || {
    name: 'Ahsan Khan',
    email: 'ahsan@ajecodrive.com',
    mobile: '+92 300 555 0191',
    role: 'Branch Manager',
    branch: 'Peshawar',
    mfa: 'On',
    lastLogin: 'Today 22:01',
    status: 'Active',
    invitation: 'Accepted',
    sessionPolicy: 'Standard'
  }

  userData.value = { ...userData.value, ...source }
}

onMounted(() => {
  loadData()
})

watch(() => props.user, () => {
  loadData()
})

const validate = () => {
  errors.value = {}
  if (!userData.value.name.trim()) errors.value.name = 'Full name is required.'
  if (!userData.value.email.trim()) errors.value.email = 'Email address is required.'
  if (!userData.value.role.trim()) errors.value.role = 'Role is required.'
  if (!userData.value.branch.trim()) errors.value.branch = 'Branch is required.'
  return Object.keys(errors.value).length === 0
}

const cancel = () => {
  emit('close')
  if (!props.isModal && router.currentRoute.value.path.includes('/edit')) {
    router.push('/organisation/users')
  }
}

const saveChanges = () => {
  showValidation.value = true
  if (!validate()) return

  if (store.originalEditUser) {
    store.applyEdit(store.originalEditUser, userData.value)
  }

  emit('updated', userData.value)
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
              <div class="text-[10px] text-gray-500 mb-1">Super Admin / Organisation / Users & Access / <span class="font-bold text-gray-800">Edit User</span></div>
              <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Edit User</h1>
              <p class="text-[13px] text-gray-500 mt-1">Update user information, role assignment, branch scope and security controls.</p>
            </div>
          </div>

          <!-- Top Status Banner -->
          <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 class="text-lg font-bold text-gray-900 leading-tight">{{ userData.name || 'User' }}</h2>
              <div class="text-xs font-medium text-gray-500 mt-0.5">
                {{ userData.email }} · {{ userData.role }} · <span class="text-[#165A31] font-semibold">{{ userData.branch }}</span>
              </div>
            </div>
            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#eefcf2] text-[#165A31]">
              {{ userData.status }}
            </span>
          </div>

          <!-- Form Grid -->
          <form @submit.prevent="saveChanges" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <!-- 1. User Identity -->
              <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
                <h3 class="text-[13px] font-bold text-gray-900 mb-2">1. User Identity</h3>
                
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Full Name *</label>
                  <input 
                    v-model="userData.name" 
                    type="text" 
                    :class="[
                      'w-full px-3.5 py-2 text-xs border rounded-lg focus:outline-none transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]',
                      showValidation && errors.name ? 'border-red-300 bg-red-50/20 focus:border-red-500' : 'border-gray-200 focus:border-[#165A31]'
                    ]" 
                  />
                  <p v-if="showValidation && errors.name" class="text-[10px] text-red-500 mt-1 font-medium">{{ errors.name }}</p>
                </div>
                
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Email *</label>
                  <input 
                    v-model="userData.email" 
                    type="email" 
                    :class="[
                      'w-full px-3.5 py-2 text-xs border rounded-lg focus:outline-none transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]',
                      showValidation && errors.email ? 'border-red-300 bg-red-50/20 focus:border-red-500' : 'border-gray-200 focus:border-[#165A31]'
                    ]" 
                  />
                  <p v-if="showValidation && errors.email" class="text-[10px] text-red-500 mt-1 font-medium">{{ errors.email }}</p>
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Mobile</label>
                  <input v-model="userData.mobile" type="text" class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
                </div>
              </div>

              <!-- 2. Role & Scope -->
              <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
                <h3 class="text-[13px] font-bold text-gray-900 mb-2">2. Role & Scope</h3>
                
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Role *</label>
                  <select v-model="userData.role" class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white">
                    <option value="Branch Manager">Branch Manager</option>
                    <option value="Sales Executive">Sales Executive</option>
                    <option value="CRM Executive">CRM Executive</option>
                    <option value="Technician">Technician</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Assigned Branch *</label>
                  <select v-model="userData.branch" class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white">
                    <option value="Peshawar">Peshawar Branch</option>
                    <option value="Islamabad">Islamabad Branch</option>
                    <option value="Lahore">Lahore Branch</option>
                    <option value="Rawalpindi">Rawalpindi Branch</option>
                    <option value="Unassigned">Unassigned</option>
                  </select>
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Status</label>
                  <select v-model="userData.status" class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white">
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <!-- 3. Security -->
              <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
                <h3 class="text-[13px] font-bold text-gray-900 mb-2">3. Security & Access</h3>
                
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">MFA Requirement</label>
                  <select v-model="userData.mfa" class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white">
                    <option value="On">Required (On)</option>
                    <option value="Off">Optional (Off)</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Session Policy</label>
                  <select v-model="userData.sessionPolicy" class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white">
                    <option value="Standard">Standard (24h token)</option>
                    <option value="Strict">Strict (8h token with IP lock)</option>
                  </select>
                </div>
              </div>

              <!-- 4. Permissions Scope -->
              <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-3">
                <h3 class="text-[13px] font-bold text-gray-900 mb-2">4. Permissions Scope</h3>
                <div class="space-y-2 text-xs text-gray-700">
                  <div class="flex items-center gap-2">
                    <div class="w-4 h-4 rounded bg-[#eefcf2] text-[#165A31] flex items-center justify-center text-[10px] font-bold">✓</div>
                    <span>View assigned branch operations</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-4 h-4 rounded bg-[#eefcf2] text-[#165A31] flex items-center justify-center text-[10px] font-bold">✓</div>
                    <span>Sales, Orders & Customer records</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-4 h-4 rounded bg-[#eefcf2] text-[#165A31] flex items-center justify-center text-[10px] font-bold">✓</div>
                    <span>Inventory stock & serialized units</span>
                  </div>
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