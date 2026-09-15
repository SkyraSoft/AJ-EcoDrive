<script setup>
import { ref, computed } from 'vue'
import { Eye, Pencil } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { store } from '../../store.js'

const router = useRouter()

const searchQuery = ref('')
const selectedRole = ref('All Roles')
const selectedBranch = ref('All Branches')
const selectedStatus = ref('All Statuses')
const openDropdown = ref(null)

const roles = ['All Roles', 'Branch Manager', 'Sales Executive', 'CRM Executive', 'Super Admin']
const branches = ['All Branches', 'Peshawar', 'Islamabad', 'Lahore', 'Unassigned']
const statuses = ['All Statuses', 'Active', 'Pending']

const users = ref([
  { name: 'Ahsan Khan', email: 'ahsan@ajecodrive.com', mobile: '+92 300 555 0191', role: 'Branch Manager', branch: 'Peshawar', mfa: 'On', lastLogin: 'Today 22:01', status: 'Active', invitation: 'Accepted', sessionPolicy: 'Standard' },
  { name: 'Hassan Ali', email: 'hassan@ajecodrive.com', mobile: '+92 300 555 0192', role: 'Branch Manager', branch: 'Islamabad', mfa: 'On', lastLogin: 'Today 21:44', status: 'Active', invitation: 'Accepted', sessionPolicy: 'Standard' },
  { name: 'Sana Noor', email: 'sana@ajecodrive.com', mobile: '+92 300 555 0193', role: 'CRM Executive', branch: 'Peshawar', mfa: 'On', lastLogin: 'Today 20:16', status: 'Active', invitation: 'Accepted', sessionPolicy: 'Strict' },
  { name: 'Bilal Ahmad', email: 'bilal@ajecodrive.com', mobile: '+92 300 555 0194', role: 'Branch Manager', branch: 'Unassigned', mfa: 'Off', lastLogin: 'Invite pending', status: 'Pending', invitation: 'Pending', sessionPolicy: 'Standard' },
  { name: 'Hamza Ali', email: 'hamza@ajecodrive.com', mobile: '+92 300 555 0195', role: 'Sales Executive', branch: 'Lahore', mfa: 'On', lastLogin: 'Today 18:30', status: 'Active', invitation: 'Accepted', sessionPolicy: 'Standard' }
])

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const selectFilter = (type, val) => {
  if (type === 'role') selectedRole.value = val
  if (type === 'branch') selectedBranch.value = val
  if (type === 'status') selectedStatus.value = val
  openDropdown.value = null
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedRole.value = 'All Roles'
  selectedBranch.value = 'All Branches'
  selectedStatus.value = 'All Statuses'
}

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    if (selectedRole.value !== 'All Roles' && user.role !== selectedRole.value) return false
    if (selectedBranch.value !== 'All Branches' && user.branch !== selectedBranch.value) return false
    if (selectedStatus.value !== 'All Statuses' && user.status !== selectedStatus.value) return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = user.name.toLowerCase().includes(q) ||
                    user.email.toLowerCase().includes(q) ||
                    user.mobile.toLowerCase().includes(q) ||
                    user.role.toLowerCase().includes(q) ||
                    user.branch.toLowerCase().includes(q) ||
                    user.status.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })
})

const editUser = (user) => {
  store.originalEditUser = user
  router.push('/organisation/users/edit')
}
</script>

<template>
  <div class="max-w-7xl mx-auto pb-12" @click="openDropdown = null">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Organisation / <span class="font-bold text-gray-800">Users & Access</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Users & Access</h1>
        <p class="text-[13px] text-gray-500 mt-1">Manage users, branch assignments, account state and access controls.</p>
      </div>
      <button @click="$router.push('/organisation/users/create')" class="bg-[#165A31] text-white text-[11px] font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer">
        + Add User
      </button>
    </div>

    <!-- 4 KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[100px]">
        <div class="text-xs font-semibold text-gray-400">Users</div>
        <div class="text-[22px] font-bold text-gray-900 leading-none">18</div>
      </div>
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[100px]">
        <div class="text-xs font-semibold text-gray-400">Active</div>
        <div class="text-[22px] font-bold text-gray-900 leading-none">16</div>
      </div>
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[100px]">
        <div class="text-xs font-semibold text-gray-400">Pending Invite</div>
        <div class="text-[22px] font-bold text-gray-900 leading-none">1</div>
      </div>
      <div class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[100px]">
        <div class="text-xs font-semibold text-gray-400">MFA Enabled</div>
        <div class="text-[22px] font-bold text-gray-900 leading-none">15</div>
      </div>
    </div>

    <!-- Table Filters & Search -->
    <div class="flex flex-wrap items-center gap-3 mb-6">
      <div class="relative w-full sm:w-64">
        <svg class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search users..." 
          class="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[11px] placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] focus:ring-1 focus:ring-[#165A31] transition-colors shadow-sm"
        />
      </div>
      
      <!-- Role Dropdown -->
      <div class="relative">
        <button 
          @click.stop="toggleDropdown('role')"
          class="flex items-center gap-1.5 text-[11px] font-medium text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 shadow-sm transition-colors"
          :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedRole !== 'All Roles' }"
        >
          <span>{{ selectedRole }}</span>
          <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        </button>
        <div v-if="openDropdown === 'role'" class="absolute left-0 mt-1 w-44 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
          <button 
            v-for="r in roles" 
            :key="r" 
            @click.stop="selectFilter('role', r)"
            class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700"
            :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedRole === r }"
          >
            {{ r }}
          </button>
        </div>
      </div>

      <!-- Branch Dropdown -->
      <div class="relative">
        <button 
          @click.stop="toggleDropdown('branch')"
          class="flex items-center gap-1.5 text-[11px] font-medium text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 shadow-sm transition-colors"
          :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedBranch !== 'All Branches' }"
        >
          <span>{{ selectedBranch }}</span>
          <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        </button>
        <div v-if="openDropdown === 'branch'" class="absolute left-0 mt-1 w-40 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
          <button 
            v-for="b in branches" 
            :key="b" 
            @click.stop="selectFilter('branch', b)"
            class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700"
            :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedBranch === b }"
          >
            {{ b }}
          </button>
        </div>
      </div>

      <!-- Status Dropdown -->
      <div class="relative">
        <button 
          @click.stop="toggleDropdown('status')"
          class="flex items-center gap-1.5 text-[11px] font-medium text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 shadow-sm transition-colors"
          :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedStatus !== 'All Statuses' }"
        >
          <span>{{ selectedStatus }}</span>
          <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        </button>
        <div v-if="openDropdown === 'status'" class="absolute left-0 mt-1 w-36 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
          <button 
            v-for="s in statuses" 
            :key="s" 
            @click.stop="selectFilter('status', s)"
            class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700"
            :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedStatus === s }"
          >
            {{ s }}
          </button>
        </div>
      </div>

      <button 
        v-if="searchQuery || selectedRole !== 'All Roles' || selectedBranch !== 'All Branches' || selectedStatus !== 'All Statuses'" 
        @click="resetFilters" 
        class="text-[11px] font-semibold text-gray-500 hover:text-red-600 px-2 py-1 transition-colors cursor-pointer"
      >
        Clear Filters
      </button>
    </div>

    <!-- Users Table -->
    <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <h3 class="text-[13px] font-bold text-gray-900">Users & Access</h3>
        <span class="text-[11px] text-gray-400 font-medium">Showing {{ filteredUsers.length }} users</span>
      </div>
      <div class="overflow-x-auto">
        <div class="w-full overflow-x-auto"><table class="w-full text-left">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
              <th class="px-6 py-3">User</th>
              <th class="px-6 py-3">Role</th>
              <th class="px-6 py-3">Branch</th>
              <th class="px-6 py-3">MFA</th>
              <th class="px-6 py-3">Last Login</th>
              <th class="px-6 py-3">Status</th>
              <th class="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr v-for="(user, index) in filteredUsers" :key="index" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4 font-semibold text-gray-900">{{ user.name }}</td>
              <td class="px-6 py-4 text-gray-500">{{ user.role }}</td>
              <td class="px-6 py-4 text-gray-900">{{ user.branch }}</td>
              <td class="px-6 py-4 text-gray-900">{{ user.mfa }}</td>
              <td class="px-6 py-4 text-gray-900">{{ user.lastLogin }}</td>
              <td class="px-6 py-4">
                <span v-if="user.status === 'Active'" class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[9px] font-bold text-[#165A31] bg-[#eefcf2]">
                  {{ user.status }}
                </span>
                <span v-else class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[9px] font-bold text-orange-600 bg-orange-50">
                  {{ user.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-1 text-gray-400 font-medium">
                  <button @click="$router.push('/organisation/users/detail')" class="hover:text-gray-900 transition-colors cursor-pointer" title="Open"><Eye class="w-4 h-4" /></button>
                  <span>&middot;</span>
                  <button @click="editUser(user)" class="hover:text-gray-900 transition-colors cursor-pointer" title="Edit"><Pencil class="w-4 h-4" /></button>
                  <span>&middot;</span>
                  <button class="hover:text-gray-900 transition-colors cursor-pointer">...</button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="7" class="text-center py-12 text-gray-500">
                <div class="flex flex-col items-center justify-center">
                  <span class="text-2xl mb-2">🔍</span>
                  <p class="text-sm font-semibold text-gray-700">No users found</p>
                  <p class="text-xs text-gray-400 mt-1">Try adjusting your filters or search query</p>
                  <button @click="resetFilters" class="mt-3 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors">
                    Reset filters
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table></div>
      </div>
    </div>
  </div>

  <router-view />
</template>