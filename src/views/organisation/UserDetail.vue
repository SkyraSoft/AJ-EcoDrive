<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { store } from '../../store.js'

const router = useRouter()
const route = useRoute()
const userId = computed(() => route.params.id || route.query.id || 'USR-01')
const userRecord = computed(() => {
  return store.getUserById(userId.value) || store.users[0] || {
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
})

const activeTab = ref('Profile')
const tabs = ['Profile', 'Role & Permissions', 'Assigned Branch', 'Sessions', 'Security', 'Activity']

const editUser = () => {
  store.originalEditUser = { ...userRecord.value }
  router.push('/organisation/users/edit')
}

const userAuditLogs = computed(() => {
  const u = userRecord.value
  const uid = u.id || u.user_id || userId.value
  const uname = u.name
  return store.auditLogs.filter(a => {
    if (a.user_id === uid || a.target_user_id === uid) return true
    if (a.user === uname || a.actor_name === uname) return true
    if (a.entity_type === 'user' && (a.entity_id === uid || a.record === uid)) return true
    return false
  }).sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
})
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-6 pb-12">
    
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">
          Super Admin / Organisation / Users & Access / <span class="font-bold text-gray-800">User Detail — {{ activeTab }}</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">User Detail — {{ activeTab }}</h1>
        <p class="text-[13px] text-gray-500 mt-1">Ahsan Khan - {{ activeTab }}</p>
      </div>
    </div>

    <!-- Top Card (User Info) -->
    <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
      <div class="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 class="text-[20px] font-bold text-gray-900 leading-none mb-2">Ahsan Khan</h2>
          <div class="text-[11px] font-medium text-gray-500">
            Branch Manager · Peshawar Branch · ahsan@ajecodrive.com
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <span class="inline-flex items-center px-2 py-1 rounded-[4px] text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">
            Active
          </span>
          <button @click="editUser" class="text-[11px] font-bold text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 shadow-sm transition-colors">
            Edit User
          </button>
          <button class="flex items-center gap-1 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 shadow-sm transition-colors">
            More
            <svg class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="px-6 border-t border-gray-100 flex overflow-x-auto hide-scrollbar">
        <div class="flex gap-6">
          <button 
            v-for="tab in tabs" 
            :key="tab"
            @click="activeTab = tab"
            class="py-4 text-[11px] font-bold relative whitespace-nowrap transition-colors"
            :class="activeTab === tab ? 'text-[#165A31]' : 'text-gray-400 hover:text-gray-600'"
          >
            {{ tab }}
            <div v-if="activeTab === tab" class="absolute bottom-0 left-0 right-0 h-[2px] bg-[#165A31] rounded-t-full"></div>
          </button>
        </div>
      </div>
    </div>

    <!-- Tab Contents -->

    <!-- Profile Tab -->
    <template v-if="activeTab === 'Profile'">
      <div class="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Profile Details -->
        <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-100">
            <h3 class="text-[13px] font-bold text-gray-900">Profile</h3>
          </div>
          <div class="p-6 space-y-4">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
              <span class="text-[11px] font-medium text-gray-500">Full Name</span>
              <span class="text-[11px] font-bold text-gray-900">Ahsan Khan</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
              <span class="text-[11px] font-medium text-gray-500">Email</span>
              <span class="text-[11px] font-bold text-gray-900">ahsan@ajecodrive.com</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
              <span class="text-[11px] font-medium text-gray-500">Mobile</span>
              <span class="text-[11px] font-bold text-gray-900">+92 300 555 0191</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
              <span class="text-[11px] font-medium text-gray-500">Joined</span>
              <span class="text-[11px] font-bold text-gray-900">Apr 10, 2028</span>
            </div>
          </div>
        </div>

        <!-- Account Summary -->
        <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-100">
            <h3 class="text-[13px] font-bold text-gray-900">Account Summary</h3>
          </div>
          <div class="p-6 space-y-4">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
              <span class="text-[11px] font-medium text-gray-500">Role</span>
              <span class="text-[11px] font-bold text-gray-900">Branch Manager</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
              <span class="text-[11px] font-medium text-gray-500">Branch</span>
              <span class="text-[11px] font-bold text-gray-900">Peshawar</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
              <span class="text-[11px] font-medium text-gray-500">MFA</span>
              <span class="text-[11px] font-bold text-gray-900">Enabled</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
              <span class="text-[11px] font-medium text-gray-500">Last Login</span>
              <span class="text-[11px] font-bold text-gray-900">Today 22:01</span>
            </div>
          </div>
        </div>

      </div>
    </template>

    <!-- Role & Permissions Tab -->
    <template v-if="activeTab === 'Role & Permissions'">
      <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100">
          <h3 class="text-[13px] font-bold text-gray-900">Permission Matrix</h3>
        </div>
        <div class="overflow-x-auto">
          <div class="w-full overflow-x-auto"><table class="w-full text-left">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                <th class="px-6 py-3">Module</th>
                <th class="px-6 py-3">View</th>
                <th class="px-6 py-3">Create</th>
                <th class="px-6 py-3">Edit</th>
                <th class="px-6 py-3">Approve</th>
                <th class="px-6 py-3">Export</th>
              </tr>
            </thead>
            <tbody class="text-[11px] font-medium text-gray-900">
              <tr class="border-b border-gray-50">
                <td class="px-6 py-4">Sales</td>
                <td class="px-6 py-4">&check;</td>
                <td class="px-6 py-4">&check;</td>
                <td class="px-6 py-4">&check;</td>
                <td class="px-6 py-4 text-gray-400">&mdash;</td>
                <td class="px-6 py-4">&check;</td>
              </tr>
              <tr class="border-b border-gray-50">
                <td class="px-6 py-4">Inventory</td>
                <td class="px-6 py-4">&check;</td>
                <td class="px-6 py-4">&check;</td>
                <td class="px-6 py-4">&check;</td>
                <td class="px-6 py-4">Request</td>
                <td class="px-6 py-4">&check;</td>
              </tr>
              <tr class="border-b border-gray-50">
                <td class="px-6 py-4">Expenses</td>
                <td class="px-6 py-4">&check;</td>
                <td class="px-6 py-4">&check;</td>
                <td class="px-6 py-4">&check;</td>
                <td class="px-6 py-4">Within limit</td>
                <td class="px-6 py-4">&check;</td>
              </tr>
              <tr class="border-b border-gray-50">
                <td class="px-6 py-4">Procurement</td>
                <td class="px-6 py-4">Inbound only</td>
                <td class="px-6 py-4 text-gray-400">&mdash;</td>
                <td class="px-6 py-4 text-gray-400">&mdash;</td>
                <td class="px-6 py-4 text-gray-400">&mdash;</td>
                <td class="px-6 py-4 text-gray-400">&mdash;</td>
              </tr>
              <tr class="border-b border-gray-50">
                <td class="px-6 py-4">Global Finance</td>
                <td class="px-6 py-4 text-gray-400">&mdash;</td>
                <td class="px-6 py-4 text-gray-400">&mdash;</td>
                <td class="px-6 py-4 text-gray-400">&mdash;</td>
                <td class="px-6 py-4 text-gray-400">&mdash;</td>
                <td class="px-6 py-4 text-gray-400">&mdash;</td>
              </tr>
            </tbody>
          </table></div>
        </div>
      </div>
    </template>

    <!-- Assigned Branch Tab -->
    <template v-if="activeTab === 'Assigned Branch'">
      <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100">
          <h3 class="text-[13px] font-bold text-gray-900">Branch Assignment</h3>
        </div>
        <div class="p-6 space-y-4">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 border-b border-gray-50 pb-4">
            <span class="text-[11px] font-medium text-gray-500">Assigned Branch</span>
            <span class="text-[11px] font-bold text-gray-900">Peshawar Branch</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 border-b border-gray-50 pb-4">
            <span class="text-[11px] font-medium text-gray-500">Assignment Type</span>
            <span class="text-[11px] font-bold text-gray-900">Fixed</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 border-b border-gray-50 pb-4">
            <span class="text-[11px] font-medium text-gray-500">Effective Since</span>
            <span class="text-[11px] font-bold text-gray-900">Apr 10, 2028</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            <span class="text-[11px] font-medium text-gray-500">Cross-Branch Access</span>
            <span class="text-[11px] font-bold text-gray-900">Not permitted</span>
          </div>
        </div>
      </div>
    </template>

    <!-- Sessions Tab -->
    <template v-if="activeTab === 'Sessions'">
      <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100">
          <h3 class="text-[13px] font-bold text-gray-900">Active Sessions</h3>
        </div>
        <div class="overflow-x-auto">
          <div class="w-full overflow-x-auto"><table class="w-full text-left">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                <th class="px-6 py-3">Device</th>
                <th class="px-6 py-3">Location</th>
                <th class="px-6 py-3">IP</th>
                <th class="px-6 py-3">Started</th>
                <th class="px-6 py-3">Last Active</th>
                <th class="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody class="text-[11px] font-medium text-gray-900">
              <tr class="border-b border-gray-50">
                <td class="px-6 py-4">Chrome · Windows</td>
                <td class="px-6 py-4">Peshawar</td>
                <td class="px-6 py-4">103.12.xx.18</td>
                <td class="px-6 py-4">Today 20:11</td>
                <td class="px-6 py-4">Now</td>
                <td class="px-6 py-4">
                  <button class="text-gray-900 hover:text-gray-600 transition-colors">Revoke</button>
                </td>
              </tr>
              <tr class="border-b border-gray-50">
                <td class="px-6 py-4">Safari · iPhone</td>
                <td class="px-6 py-4">Peshawar</td>
                <td class="px-6 py-4">103.12.xx.18</td>
                <td class="px-6 py-4">Aug 26 18:42</td>
                <td class="px-6 py-4">Aug 26 20:03</td>
                <td class="px-6 py-4">
                  <button class="text-gray-900 hover:text-gray-600 transition-colors">Revoke</button>
                </td>
              </tr>
            </tbody>
          </table></div>
        </div>
      </div>
    </template>

    <!-- Security Tab -->
    <template v-if="activeTab === 'Security'">
      <div class="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Security Status -->
        <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-100">
            <h3 class="text-[13px] font-bold text-gray-900">Security Status</h3>
          </div>
          <div class="p-6 space-y-4">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 border-b border-gray-50 pb-4">
              <span class="text-[11px] font-medium text-gray-500">MFA</span>
              <span class="text-[11px] font-bold text-gray-900">Enabled</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 border-b border-gray-50 pb-4">
              <span class="text-[11px] font-medium text-gray-500">Password Changed</span>
              <span class="text-[11px] font-bold text-gray-900">Jul 22, 2026</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
              <span class="text-[11px] font-medium text-gray-500">Recovery Codes</span>
              <span class="text-[11px] font-bold text-gray-900">Available</span>
            </div>
          </div>
        </div>

        <!-- Controls -->
        <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-100">
            <h3 class="text-[13px] font-bold text-gray-900">Controls</h3>
          </div>
          <div class="p-6 flex flex-col gap-3 items-start">
            <button class="text-[11px] font-bold text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 shadow-sm transition-colors">
              Reset Password
            </button>
            <button class="text-[11px] font-bold text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 shadow-sm transition-colors">
              Reset MFA
            </button>
            <button class="text-[11px] font-bold text-red-600 bg-red-50 border border-red-100 px-4 py-2 rounded-lg hover:bg-red-100 shadow-sm transition-colors mt-2">
              Revoke All Sessions
            </button>
          </div>
        </div>

      </div>
    </template>

    <!-- Activity Tab -->
    <template v-if="activeTab === 'Activity'">
      <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-[13px] font-bold text-gray-900">User Activity</h3>
          <span class="text-[11px] text-gray-400 font-medium">{{ userAuditLogs.length }} events recorded</span>
        </div>
        <div class="p-6 space-y-4">
          <template v-if="userAuditLogs.length > 0">
            <div 
              v-for="(log, idx) in userAuditLogs" 
              :key="log.id || idx"
              class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pl-3 border-l-[2px] border-[#165A31]"
            >
              <div>
                <span class="text-[11px] font-bold text-gray-900">{{ log.action || log.operation }}: </span>
                <span class="text-[11px] text-gray-700">{{ log.description || log.result }}</span>
                <span class="text-[10px] text-gray-400 ml-2" v-if="log.record && log.record !== 'Session'">({{ log.record }})</span>
              </div>
              <span class="text-[10px] font-medium text-gray-500 whitespace-nowrap">{{ log.timestamp }}</span>
            </div>
          </template>
          <template v-else>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 pl-3 border-l-[2px] border-[#eefcf2]">
              <span class="text-[11px] font-bold text-gray-900">User logged in to Showroom terminal</span>
              <span class="text-[10px] font-medium text-gray-500">Today</span>
            </div>
          </template>
        </div>
      </div>
    </template>

  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
