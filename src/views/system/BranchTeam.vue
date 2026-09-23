<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '@/store'
import { ChevronDown, Check, Plus, Pencil, X, CheckCircle2, Search } from 'lucide-vue-next'

const router = useRouter()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

// --- 4 KPI Cards ---
const kpis = computed(() => {
  const activeCount = teamMembers.value.filter(m => m.status === 'Active').length
  const salesCount = teamMembers.value.filter(m => m.role.toLowerCase().includes('sales')).length
  const serviceCount = teamMembers.value.filter(m => m.role.toLowerCase().includes('tech') || m.role.toLowerCase().includes('service')).length
  return [
    { label: 'Team Members', value: String(teamMembers.value.length || 8), subtext: `${activeCount} active`, subtextClass: 'text-[#165A31] font-medium' },
    { label: 'Sales', value: String(salesCount || 3), subtext: 'Assigned', subtextClass: 'text-[#165A31] font-medium' },
    { label: 'Service', value: String(serviceCount || 2), subtext: 'Assigned', subtextClass: 'text-[#165A31] font-medium' },
    { label: 'Sessions', value: String(activeCount || 6), subtext: 'Currently active', subtextClass: 'text-[#165A31] font-medium' }
  ]
})

const statusFilter = ref('All')
const searchQuery = ref('')
const openDropdown = ref(null)
const showCreateModal = ref(false)
const selectedMemberToEdit = ref(null)
const showToast = ref(false)
const toastMessage = ref('')

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const teamMembers = computed(() => {
  const currentBranch = user.value?.branchName || 'Peshawar'
  return store.users
    .filter(u => !u.branch || u.branch === currentBranch)
    .map(u => ({
      id: u.id,
      name: u.name,
      role: u.role,
      contact: u.mobile || '+92 300 0000000',
      email: u.email,
      lastActive: u.lastLogin || 'Recent',
      status: u.status || 'Active',
      statusClass: u.statusClass || (u.status === 'Active' ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-gray-100 text-gray-700')
    }))
})

const filteredTeam = computed(() => {
  return teamMembers.value.filter(item => {
    if (statusFilter.value !== 'All' && item.status !== statusFilter.value) {
      return false
    }
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = item.name.toLowerCase().includes(q) ||
                    item.role.toLowerCase().includes(q) ||
                    item.contact.toLowerCase().includes(q) ||
                    (item.email && item.email.toLowerCase().includes(q))
      if (!match) return false
    }
    return true
  })
})

// Modal Form State
const memberForm = ref({
  id: null,
  name: '',
  role: 'Sales Specialist',
  contact: '',
  email: '',
  status: 'Active'
})
const showValidation = ref(false)
const isEditMode = ref(false)

const openCreateModal = () => {
  isEditMode.value = false
  selectedMemberToEdit.value = null
  memberForm.value = {
    id: null,
    name: '',
    role: 'Sales Specialist',
    contact: '',
    email: '',
    status: 'Active'
  }
  showValidation.value = false
  showCreateModal.value = true
}

const openEditModal = (item) => {
  isEditMode.value = true
  selectedMemberToEdit.value = item
  memberForm.value = {
    id: item.id,
    name: item.name,
    role: item.role,
    contact: item.contact,
    email: item.email || '',
    status: item.status
  }
  showValidation.value = false
  showCreateModal.value = true
}

const closeMemberModal = () => {
  showCreateModal.value = false
  selectedMemberToEdit.value = null
}

const saveMember = () => {
  if (!memberForm.value.name.trim() || !memberForm.value.contact.trim()) {
    showValidation.value = true
    return
  }

  const currentBranch = user.value?.branchName || 'Peshawar'

  if (isEditMode.value) {
    store.updateUser(memberForm.value.id, {
      name: memberForm.value.name,
      role: memberForm.value.role,
      mobile: memberForm.value.contact,
      email: memberForm.value.email || `${memberForm.value.name.toLowerCase().replace(/\s+/g, '.')}@ecodrive.pk`,
      status: memberForm.value.status,
      statusClass: memberForm.value.status === 'Active' ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-gray-100 text-gray-700'
    })
    toastMessage.value = `Team member ${memberForm.value.name} updated successfully!`
  } else {
    store.addUser({
      name: memberForm.value.name,
      role: memberForm.value.role,
      mobile: memberForm.value.contact,
      email: memberForm.value.email || `${memberForm.value.name.toLowerCase().replace(/\s+/g, '.')}@ecodrive.pk`,
      branch: currentBranch,
      lastLogin: 'Just now',
      status: memberForm.value.status,
      statusClass: memberForm.value.status === 'Active' ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-gray-100 text-gray-700'
    })
    toastMessage.value = `Team member ${memberForm.value.name} added successfully!`
  }

  showToast.value = true
  closeMemberModal()
  setTimeout(() => { showToast.value = false }, 4000)
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openDropdown = null">
    <!-- Toast Notification -->
    <div 
      v-if="showToast" 
      class="fixed bottom-5 right-5 z-[110] bg-[#165A31] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200"
    >
      <CheckCircle2 class="w-5 h-5 text-green-300" />
      <span class="text-xs font-bold">{{ toastMessage }}</span>
    </div>

    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[11px] text-gray-400 mb-1">
          Branch Manager / Branch Team / <span class="font-medium text-gray-600">Branch Team</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Branch Team</h1>
        <p class="text-xs text-gray-500 mt-1">Users and staff assigned to {{ user?.branchName || 'Peshawar' }} Branch showroom and workshop.</p>
      </div>
      <button 
        @click="openCreateModal"
        class="bg-[#165A31] text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
      >
        <Plus class="w-4 h-4" />
        <span>Add Team Member</span>
      </button>
    </div>

    <!-- 4 KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div 
        v-for="kpi in kpis" 
        :key="kpi.label" 
        class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]"
      >
        <div class="text-[11px] font-semibold text-gray-500 mb-2">{{ kpi.label }}</div>
        <div class="text-2xl font-bold text-gray-900">{{ kpi.value }}</div>
        <div :class="['text-[11px] mt-1', kpi.subtextClass]">{{ kpi.subtext }}</div>
      </div>
    </div>

    <!-- Filters Row -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="flex flex-wrap items-center gap-2">
        <!-- Search Input -->
        <div class="relative w-48 sm:w-60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search staff, role, contact..." 
            class="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
          />
        </div>

        <!-- Status Dropdown -->
        <div class="relative">
          <button 
            @click.stop="toggleDropdown('status')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <span>Status: {{ statusFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div 
            v-if="openDropdown === 'status'" 
            class="absolute top-full left-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <button 
              v-for="st in ['All', 'Active', 'Inactive']" 
              :key="st"
              @click="statusFilter = st; openDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
              :class="statusFilter === st ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ st }}</span>
              <Check v-if="statusFilter === st" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <button 
          v-if="searchQuery || statusFilter !== 'All'"
          @click="searchQuery = ''; statusFilter = 'All'"
          class="text-xs font-semibold text-gray-400 hover:text-red-600 px-2 py-1 transition-colors cursor-pointer"
        >
          Clear
        </button>
      </div>

      <div class="flex items-center gap-2">
        <button class="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          Columns
        </button>
        <button class="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          Export
        </button>
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
      <h3 class="text-sm font-bold text-gray-900">Branch Staff</h3>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-100 text-[11px] font-semibold text-gray-400">
              <th class="py-3 px-4">Team Member</th>
              <th class="py-3 px-4">Role / Function</th>
              <th class="py-3 px-4">Phone Contact</th>
              <th class="py-3 px-4">Email Address</th>
              <th class="py-3 px-4">Last Active</th>
              <th class="py-3 px-4">Status</th>
              <th class="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="text-xs divide-y divide-gray-50">
            <tr 
              v-for="item in filteredTeam" 
              :key="item.id" 
              class="hover:bg-gray-50/50 transition-colors"
            >
              <td class="py-4 px-4 font-bold text-gray-900">{{ item.name }}</td>
              <td class="py-4 px-4 font-medium text-gray-700">{{ item.role }}</td>
              <td class="py-4 px-4 font-medium text-gray-600">{{ item.contact }}</td>
              <td class="py-4 px-4 text-gray-500">{{ item.email || '—' }}</td>
              <td class="py-4 px-4 text-gray-500">{{ item.lastActive }}</td>
              <td class="py-4 px-4">
                <span :class="['inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-semibold', item.statusClass]">
                  {{ item.status }}
                </span>
              </td>
              <td class="py-4 px-4 text-right">
                <div class="flex items-center justify-end gap-3 text-gray-400">
                  <button 
                    @click.stop="openEditModal(item)" 
                    title="Edit Team Member" 
                    class="hover:text-[#165A31] transition-colors cursor-pointer"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="filteredTeam.length === 0">
              <td colspan="7" class="text-center py-12 text-gray-500">
                <p class="text-xs font-semibold text-gray-700">No team members match the filter</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create / Edit Team Member Modal Dialog -->
    <div 
      v-if="showCreateModal" 
      class="fixed inset-0 bg-gray-900/50 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm"
      @click.self="closeMemberModal"
    >
      <button 
        @click="closeMemberModal" 
        class="fixed top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-100 rounded-full z-[110] shadow-lg transition-colors cursor-pointer"
      >
        <X class="w-5 h-5" />
      </button>

      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">
        <div class="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          <div>
            <div class="text-[10px] text-gray-500 mb-1">
              Branch Manager / Branch Team / <span class="font-bold text-gray-800">{{ isEditMode ? 'Edit Member' : 'Add Team Member' }}</span>
            </div>
            <h1 class="text-[28px] tracking-tight font-bold text-gray-900">{{ isEditMode ? 'Edit Team Member' : 'Add Team Member' }}</h1>
            <p class="text-xs text-gray-500 mt-1">Manage staff assigned to showroom, technical repairs and store operations.</p>
          </div>

          <form @submit.prevent="saveMember" class="space-y-4">
            <div>
              <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Full Name *</label>
              <input 
                v-model="memberForm.name"
                type="text" 
                placeholder="e.g. Hamza Khan"
                class="w-full px-3.5 py-2 bg-white border rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                :class="showValidation && !memberForm.name.trim() ? 'border-red-300 bg-red-50/20' : 'border-gray-200'"
              />
              <p v-if="showValidation && !memberForm.name.trim()" class="text-[10px] text-red-500 font-medium mt-1">Name is required</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Role / Function</label>
                <select 
                  v-model="memberForm.role"
                  class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-[#165A31] transition-colors cursor-pointer"
                >
                  <option value="Sales Specialist">Sales Specialist</option>
                  <option value="Lead Technician">Lead Technician</option>
                  <option value="Service Advisor">Service Advisor</option>
                  <option value="Inventory Officer">Inventory Officer</option>
                  <option value="Customer Relationship Officer">Customer Relationship Officer</option>
                  <option value="Accountant / Cashier">Accountant / Cashier</option>
                </select>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Status</label>
                <select 
                  v-model="memberForm.status"
                  class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-[#165A31] transition-colors cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Phone Contact *</label>
                <input 
                  v-model="memberForm.contact"
                  type="text" 
                  placeholder="e.g. 0300 111 2211"
                  class="w-full px-3.5 py-2 bg-white border rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                  :class="showValidation && !memberForm.contact.trim() ? 'border-red-300 bg-red-50/20' : 'border-gray-200'"
                />
                <p v-if="showValidation && !memberForm.contact.trim()" class="text-[10px] text-red-500 font-medium mt-1">Phone contact is required</p>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Email Address</label>
                <input 
                  v-model="memberForm.email"
                  type="email" 
                  placeholder="e.g. hamza@ecodrive.pk"
                  class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
                />
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button 
                type="button" 
                @click="closeMemberModal" 
                class="px-5 py-2.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="bg-[#165A31] text-white text-xs font-bold px-6 py-2.5 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer"
              >
                {{ isEditMode ? 'Update Member' : 'Add Member' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
