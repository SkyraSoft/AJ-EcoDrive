<script setup>
import { ref, computed } from 'vue'
import { Eye, Search, Plus } from 'lucide-vue-next'
import CreateRole from './CreateRole.vue'

const showCreateModal = ref(false)
const selectedRole = ref('Branch Manager')
const searchQuery = ref('')

const handleRoleCreated = (newRole) => {
  roles.value.push({
    name: newRole.name,
    users: '0',
    scope: newRole.scope || 'Assigned Branch',
    status: 'Active'
  })
  selectedRole.value = newRole.name
  showCreateModal.value = false
}

const roles = ref([
  { name: 'Super Admin', users: '2', scope: 'All Branches', status: 'Active' },
  { name: 'Branch Manager', users: '4', scope: 'Assigned Branch', status: 'Active' },
  { name: 'Sales Executive', users: '6', scope: 'Assigned Branch', status: 'Active' },
  { name: 'CRM Executive', users: '3', scope: 'Assigned Branch', status: 'Active' },
  { name: 'Technician', users: '5', scope: 'Workshop Only', status: 'Active' }
])

const permissionsMap = {
  'Super Admin': [
    { module: 'Catalogue', view: true, create: 'Full', edit: true, approve: true, export: true },
    { module: 'Inventory', view: true, create: 'Full', edit: true, approve: true, export: true },
    { module: 'Sales & CRM', view: true, create: 'Full', edit: true, approve: true, export: true },
    { module: 'Expenses', view: true, create: 'Full', edit: true, approve: true, export: true },
    { module: 'Finance', view: true, create: 'Full', edit: true, approve: true, export: true },
    { module: 'Organisation', view: true, create: 'Full', edit: true, approve: true, export: true }
  ],
  'Branch Manager': [
    { module: 'Catalogue', view: true, create: 'Request only', edit: false, approve: false, export: true },
    { module: 'Inventory', view: true, create: true, edit: true, approve: 'Request/Receive', export: true },
    { module: 'Sales & CRM', view: true, create: true, edit: true, approve: true, export: true },
    { module: 'Expenses', view: true, create: true, edit: true, approve: 'Within policy', export: true },
    { module: 'Finance', view: 'Branch only', create: false, edit: false, approve: false, export: 'Limited' },
    { module: 'Organisation', view: 'Team only', create: false, edit: false, approve: false, export: false }
  ],
  'Sales Executive': [
    { module: 'Catalogue', view: true, create: false, edit: false, approve: false, export: false },
    { module: 'Inventory', view: 'View only', create: false, edit: false, approve: false, export: false },
    { module: 'Sales & CRM', view: true, create: true, edit: 'Own only', approve: false, export: false },
    { module: 'Expenses', view: false, create: 'Submit only', edit: false, approve: false, export: false },
    { module: 'Finance', view: false, create: false, edit: false, approve: false, export: false },
    { module: 'Organisation', view: false, create: false, edit: false, approve: false, export: false }
  ],
  'CRM Executive': [
    { module: 'Catalogue', view: true, create: false, edit: false, approve: false, export: false },
    { module: 'Inventory', view: false, create: false, edit: false, approve: false, export: false },
    { module: 'Sales & CRM', view: true, create: true, edit: true, approve: false, export: true },
    { module: 'Expenses', view: false, create: false, edit: false, approve: false, export: false },
    { module: 'Finance', view: false, create: false, edit: false, approve: false, export: false },
    { module: 'Organisation', view: false, create: false, edit: false, approve: false, export: false }
  ],
  'Technician': [
    { module: 'Catalogue', view: true, create: false, edit: false, approve: false, export: false },
    { module: 'Inventory', view: 'Parts only', create: false, edit: false, approve: false, export: false },
    { module: 'Sales & CRM', view: 'Service only', create: false, edit: false, approve: false, export: false },
    { module: 'Expenses', view: false, create: false, edit: false, approve: false, export: false },
    { module: 'Finance', view: false, create: false, edit: false, approve: false, export: false },
    { module: 'Organisation', view: false, create: false, edit: false, approve: false, export: false }
  ]
}

const currentPermissions = computed(() => {
  return permissionsMap[selectedRole.value] || permissionsMap['Branch Manager']
})

const filteredRoles = computed(() => {
  if (!searchQuery.value.trim()) return roles.value
  const q = searchQuery.value.toLowerCase()
  return roles.value.filter(r => r.name.toLowerCase().includes(q) || r.scope.toLowerCase().includes(q))
})
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Organisation / Users & Access / <span class="font-bold text-gray-800">Roles & Permissions</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Roles & Permissions</h1>
        <p class="text-[13px] text-gray-500 mt-1">Configure role capabilities, branch scope and sensitive-data access.</p>
      </div>
      <button @click="showCreateModal = true" class="bg-[#165A31] text-white text-[11px] font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer">
        <Plus class="w-4 h-4" /> <span>Create Role</span>
      </button>
    </div>

    <!-- Top Grid: Roles Table and Permission Model -->
    <div class="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- Roles -->
      <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
          <h3 class="text-[13px] font-bold text-gray-900">Roles</h3>
          <div class="relative w-48">
            <Search class="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search role..." 
              class="w-full pl-8 pr-3 py-1 bg-white border border-gray-200 rounded-lg text-[11px] placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
            />
          </div>
        </div>
        <div class="overflow-x-auto">
          <div class="w-full overflow-x-auto"><table class="w-full text-left">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                <th class="px-6 py-3">Role</th>
                <th class="px-6 py-3">Users</th>
                <th class="px-6 py-3">Scope</th>
                <th class="px-6 py-3">Status</th>
                <th class="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr 
                v-for="role in filteredRoles" 
                :key="role.name"
                @click="selectedRole = role.name"
                class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
                :class="selectedRole === role.name ? 'border-l-[3px] border-l-[#165A31] bg-white font-semibold' : 'bg-gray-50/30'"
              >
                <td class="px-6 py-4 font-semibold text-gray-900">{{ role.name }}</td>
                <td class="px-6 py-4 font-medium text-gray-900">{{ role.users }}</td>
                <td class="px-6 py-4 text-gray-500">{{ role.scope }}</td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[9px] font-bold text-[#165A31] bg-[#eefcf2]">
                    {{ role.status }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <button class="text-gray-900 font-medium hover:text-gray-600 transition-colors" title="Open"><Eye class="w-4 h-4" /></button>
                </td>
              </tr>
              <tr v-if="filteredRoles.length === 0">
                <td colspan="5" class="px-6 py-8 text-center text-gray-400 text-xs">
                  No roles found.
                </td>
              </tr>
            </tbody>
          </table></div>
        </div>
      </div>

      <!-- Permission Model -->
      <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100">
          <h3 class="text-[13px] font-bold text-gray-900">Permission Model</h3>
        </div>
        <div class="p-6 space-y-4">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 border-b border-gray-50 pb-4">
            <span class="text-[11px] font-medium text-gray-500">Role Scope</span>
            <span class="text-[11px] font-bold text-gray-900">Organisation or assigned branch</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 border-b border-gray-50 pb-4">
            <span class="text-[11px] font-medium text-gray-500">Sensitive Cost Visibility</span>
            <span class="text-[11px] font-bold text-gray-900">Permission controlled</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 border-b border-gray-50 pb-4">
            <span class="text-[11px] font-medium text-gray-500">Approval Rights</span>
            <span class="text-[11px] font-bold text-gray-900">Explicit module permission</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            <span class="text-[11px] font-medium text-gray-500">Audit</span>
            <span class="text-[11px] font-bold text-gray-900">All changes logged</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Selected Role Matrix -->
    <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-[13px] font-bold text-gray-900">Selected Role · {{ selectedRole }}</h3>
        <span class="text-xs font-semibold text-[#165A31] bg-[#eefcf2] px-3 py-1 rounded-full">Viewing permissions for {{ selectedRole }}</span>
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
            <tr v-for="p in currentPermissions" :key="p.module" class="border-b border-gray-50">
              <td class="px-6 py-4 font-semibold">{{ p.module }}</td>
              <td class="px-6 py-4">
                <span v-if="p.view === true" class="text-[#165A31] font-bold">&check;</span>
                <span v-else-if="p.view === false" class="text-gray-300">&mdash;</span>
                <span v-else class="text-gray-600">{{ p.view }}</span>
              </td>
              <td class="px-6 py-4">
                <span v-if="p.create === true" class="text-[#165A31] font-bold">&check;</span>
                <span v-else-if="p.create === false" class="text-gray-300">&mdash;</span>
                <span v-else class="text-gray-600">{{ p.create }}</span>
              </td>
              <td class="px-6 py-4">
                <span v-if="p.edit === true" class="text-[#165A31] font-bold">&check;</span>
                <span v-else-if="p.edit === false" class="text-gray-300">&mdash;</span>
                <span v-else class="text-gray-600">{{ p.edit }}</span>
              </td>
              <td class="px-6 py-4">
                <span v-if="p.approve === true" class="text-[#165A31] font-bold">&check;</span>
                <span v-else-if="p.approve === false" class="text-gray-300">&mdash;</span>
                <span v-else class="text-gray-600">{{ p.approve }}</span>
              </td>
              <td class="px-6 py-4">
                <span v-if="p.export === true" class="text-[#165A31] font-bold">&check;</span>
                <span v-else-if="p.export === false" class="text-gray-300">&mdash;</span>
                <span v-else class="text-gray-600">{{ p.export }}</span>
              </td>
            </tr>
          </tbody>
        </table></div>
      </div>
    </div>

  </div>

  <!-- Create Role Modal Popup -->
  <CreateRole v-if="showCreateModal" @close="showCreateModal = false" @created="handleRoleCreated" />

  <router-view />
</template>