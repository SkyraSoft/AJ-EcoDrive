<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search, ChevronDown, Check, Plus, Pencil, CheckCircle2 } from 'lucide-vue-next'
import { store } from '@/store'
import CreateFollowUp from './CreateFollowUp.vue'

const router = useRouter()
const showCreateModal = ref(false)
const selectedFollowUpToEdit = ref(null)
const showToast = ref(false)
const toastMessage = ref('')

const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

// Branch Manager Data
const branchKPIs = computed(() => {
  const list = store.getFollowUpsForUser(store.currentUser)
  const todayCount = list.filter(f => (f.status === 'Due Today' || (f.due && f.due.toLowerCase().includes('today'))) && f.status !== 'Completed').length
  const overdueCount = list.filter(f => f.status === 'Overdue').length
  const upcomingCount = list.filter(f => f.status === 'Upcoming' || (f.dueDate && f.dueDate.toLowerCase().includes('tomorrow'))).length
  const completedCount = list.filter(f => f.status === 'Completed').length
  return [
    { label: 'Today', value: String(todayCount), change: `${todayCount} pending action` },
    { label: 'Overdue', value: String(overdueCount), change: overdueCount > 0 ? 'Needs action' : 'All clear' },
    { label: 'Upcoming', value: String(upcomingCount), change: 'Next 7 days' },
    { label: 'Completed', value: String(completedCount), change: 'Recorded' }
  ]
})

const branchFollowUps = computed(() => {
  return store.getFollowUpsForUser(store.currentUser)
})

const branchStatusFilter = ref('All')
const branchSearchQuery = ref('')
const openBranchDropdown = ref(null)

const toggleBranchDropdown = (name) => {
  openBranchDropdown.value = openBranchDropdown.value === name ? null : name
}

const filteredBranchFollowUps = computed(() => {
  return branchFollowUps.value.filter(item => {
    if (branchStatusFilter.value !== 'All' && item.status !== branchStatusFilter.value) {
      return false
    }
    if (branchSearchQuery.value.trim()) {
      const q = branchSearchQuery.value.toLowerCase()
      const match = (item.customer && item.customer.toLowerCase().includes(q)) ||
                    (item.linkedRecord && item.linkedRecord.toLowerCase().includes(q)) ||
                    (item.owner && item.owner.toLowerCase().includes(q))
      if (!match) return false
    }
    return true
  })
})

const openCreateModal = () => {
  selectedFollowUpToEdit.value = null
  store.originalEditFollowUp = null
  showCreateModal.value = true
}

const openEditModal = (item) => {
  selectedFollowUpToEdit.value = item
  store.originalEditFollowUp = item
  showCreateModal.value = true
}

const handleFollowUpCreated = (newRecord) => {
  store.addFollowUp(newRecord)
  toastMessage.value = `Follow-up for ${newRecord.customer} scheduled successfully!`
  showToast.value = true
  showCreateModal.value = false
  setTimeout(() => { showToast.value = false }, 4000)
}

const handleFollowUpUpdated = (updatedRecord) => {
  store.updateFollowUp(updatedRecord.id, updatedRecord)
  toastMessage.value = `Follow-up for ${updatedRecord.customer} updated successfully!`
  showToast.value = true
  showCreateModal.value = false
  setTimeout(() => { showToast.value = false }, 4000)
}

const openFollowUpDetail = (item) => {
  router.push({
    path: '/sales/follow-ups/detail',
    query: {
      id: item.id,
      customer: item.customer,
      record: item.linkedRecord,
      due: item.due,
      status: item.status
    }
  })
}

// Super Admin Data
const tabs = ['All', 'Today', 'Upcoming', 'Overdue', 'Completed']
const activeTab = ref('Today')
const searchQuery = ref('')
const selectedBranch = ref('All Branches')
const selectedOwner = ref('All Owners')
const openDropdown = ref(null)

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const followUps = computed(() => store.followUps)

const filteredFollowUps = computed(() => {
  return followUps.value.filter(item => {
    const bucket = item.timeBucket || (item.status === 'Completed' ? 'Completed' : item.status === 'Overdue' ? 'Overdue' : (item.due && item.due.toLowerCase().includes('today')) ? 'Today' : 'Upcoming')
    if (activeTab.value !== 'All' && bucket.toLowerCase() !== activeTab.value.toLowerCase()) {
      return false
    }
    if (selectedBranch.value !== 'All Branches' && item.branch !== selectedBranch.value) {
      return false
    }
    if (selectedOwner.value !== 'All Owners' && item.owner !== selectedOwner.value) {
      return false
    }
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = 
        (item.customer && item.customer.toLowerCase().includes(q)) ||
        (item.type && item.type.toLowerCase().includes(q)) ||
        (item.branch && item.branch.toLowerCase().includes(q)) ||
        (item.owner && item.owner.toLowerCase().includes(q))
      if (!match) return false
    }
    return true
  })
})

const resetFilters = () => {
  activeTab.value = 'All'
  selectedBranch.value = 'All Branches'
  selectedOwner.value = 'All Owners'
  searchQuery.value = ''
}

const toggleComplete = (item) => {
  if (item.status === 'Completed') {
    item.status = 'Open'
    item.statusColor = 'bg-blue-50 text-blue-600'
    item.statusClass = 'bg-blue-50 text-blue-600'
    item.timeBucket = 'Today'
  } else {
    store.completeFollowUp(item.id)
    item.timeBucket = 'Completed'
    toastMessage.value = `Follow-up for ${item.customer} completed`
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 3000)
  }
}
</script>

<template>
  <!-- BRANCH MANAGER VIEW -->
  <div v-if="isBranchUser" class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openBranchDropdown = null">
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
          Branch Manager / Follow-ups / <span class="font-medium text-gray-600">Follow-ups</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Follow-ups</h1>
        <p class="text-xs text-gray-500 mt-1">Today, overdue and upcoming customer follow-ups.</p>
      </div>
      <button 
        @click="openCreateModal"
        class="bg-[#165A31] text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
      >
        <Plus class="w-4 h-4" /> <span>Follow-up</span>
      </button>
    </div>

    <!-- 4 KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div 
        v-for="kpi in branchKPIs" 
        :key="kpi.label"
        class="bg-white border border-gray-100 rounded-[12px] p-5 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between"
      >
        <span class="text-[11px] font-medium text-gray-400">{{ kpi.label }}</span>
        <div class="mt-2">
          <span class="text-2xl font-bold text-gray-900">{{ kpi.value }}</span>
          <p class="text-[11px] font-medium text-gray-400 mt-1">{{ kpi.change }}</p>
        </div>
      </div>
    </div>

    <!-- Filter Buttons Bar -->
    <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
      <div class="flex flex-wrap items-center gap-2">
        <!-- Search Input -->
        <div class="relative w-48 sm:w-60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            v-model="branchSearchQuery"
            type="text" 
            placeholder="Search follow-ups..." 
            class="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
          />
        </div>

        <!-- Status Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('status')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <span>Status: {{ branchStatusFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openBranchDropdown === 'status'" class="absolute top-full left-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button 
              v-for="st in ['All', 'Overdue', 'Due Today', 'Upcoming', 'Completed']"
              :key="st"
              @click="branchStatusFilter = st; openBranchDropdown = null"
              class="w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
              :class="branchStatusFilter === st ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ st }}</span>
              <Check v-if="branchStatusFilter === st" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <button 
          v-if="branchSearchQuery || branchStatusFilter !== 'All'"
          @click="branchSearchQuery = ''; branchStatusFilter = 'All'"
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
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="p-6">
        <h2 class="text-sm font-bold text-gray-900 mb-4">Customer Follow-ups</h2>

        <div class="border border-gray-100 rounded-xl overflow-hidden">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-[#fbfcfc] border-b border-gray-100 text-[11px] font-semibold text-gray-400">
                <th class="px-5 py-3">Customer</th>
                <th class="px-5 py-3">Linked Record</th>
                <th class="px-5 py-3">Owner</th>
                <th class="px-5 py-3">Due</th>
                <th class="px-5 py-3">Status</th>
                <th class="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="text-xs">
              <tr 
                v-for="item in filteredBranchFollowUps" 
                :key="item.id"
                class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
              >
                <td class="px-5 py-4 font-bold text-gray-900">{{ item.customer }}</td>
                <td class="px-5 py-4 font-medium text-gray-700">{{ item.linkedRecord }}</td>
                <td class="px-5 py-4 text-gray-600">{{ item.owner }}</td>
                <td class="px-5 py-4 text-gray-700">{{ item.due }}</td>
                <td class="px-5 py-4">
                  <span :class="['inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-medium', item.statusClass]">
                    {{ item.status }}
                  </span>
                </td>
                <td class="px-5 py-4 text-right">
                  <div class="flex items-center justify-end gap-3 text-gray-400">
                    <button 
                      v-if="item.status !== 'Completed'"
                      @click.stop="store.completeFollowUp(item.id); toastMessage = `Follow-up for ${item.customer} completed`; showToast = true; setTimeout(() => showToast = false, 3000)"
                      class="text-xs font-semibold px-2.5 py-1 rounded border border-[#165A31] text-[#165A31] hover:bg-[#eefcf2] cursor-pointer transition-colors"
                    >
                      Complete
                    </button>
                    <button 
                      @click.stop="openEditModal(item)" 
                      title="Edit Follow-up"
                      class="hover:text-[#165A31] transition-colors cursor-pointer"
                    >
                      <Pencil class="w-4 h-4" />
                    </button>
                    <button 
                      @click.stop="openFollowUpDetail(item)"
                      class="text-xs text-gray-400 font-medium hover:text-gray-700 transition-colors cursor-pointer"
                    >
                      Open ›
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-if="filteredBranchFollowUps.length === 0">
                <td colspan="6" class="text-center py-12 text-gray-500">
                  <p class="text-xs font-semibold text-gray-700">No follow-ups match the selected filters</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create / Edit Follow-up Modal -->
    <CreateFollowUp 
      v-if="showCreateModal" 
      :isModal="true"
      :follow-up="selectedFollowUpToEdit"
      @close="showCreateModal = false" 
      @created="handleFollowUpCreated"
      @updated="handleFollowUpUpdated"
    />
  </div>

  <!-- SUPER ADMIN VIEW -->
  <div v-else class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openDropdown = null">
    <!-- Toast Notification -->
    <div 
      v-if="showToast" 
      class="fixed bottom-5 right-5 z-[110] bg-[#165A31] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200"
    >
      <CheckCircle2 class="w-5 h-5 text-green-300" />
      <span class="text-xs font-bold">{{ toastMessage }}</span>
    </div>

    <!-- Header Area -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Sales & CRM / <span class="font-bold text-gray-800">Follow-ups</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Follow-ups</h1>
        <p class="text-sm text-gray-500 mt-1">Manage due, upcoming and overdue sales or customer follow-up tasks.</p>
      </div>
      <button 
        @click="openCreateModal" 
        class="bg-[#165A31] text-white text-[11px] font-bold px-4 py-2.5 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
      >
        <Plus class="w-4 h-4" /> <span>Schedule Follow-up</span>
      </button>
    </div>

    <!-- Filters & Tabs -->
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
      <div class="flex flex-wrap items-center gap-3 flex-1">
        <!-- Tabs -->
        <div class="flex items-center bg-gray-50/80 p-1 rounded-lg border border-gray-100 overflow-x-auto">
          <button 
            v-for="tab in tabs" 
            :key="tab"
            @click="activeTab = tab"
            :class="[
              'px-3.5 py-1.5 text-[11px] font-bold rounded-md transition-all cursor-pointer whitespace-nowrap',
              activeTab === tab ? 'bg-white text-[#165A31] shadow-[0_1px_2px_rgba(0,0,0,0.05)]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
            ]"
          >
            {{ tab }}
          </button>
        </div>

        <!-- Search -->
        <div class="relative flex-1 max-w-[260px] min-w-[180px]">
          <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search follow-ups..." 
            class="w-full pl-9 pr-4 py-1.5 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)]" 
          />
        </div>
        
        <!-- Branch Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleDropdown('branch')"
            class="px-3 py-1.5 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <span>{{ selectedBranch }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openDropdown === 'branch'" class="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button 
              v-for="branch in ['All Branches', 'Peshawar', 'Islamabad', 'Lahore']"
              :key="branch"
              @click="selectedBranch = branch; openDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
              :class="selectedBranch === branch ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ branch }}</span>
              <Check v-if="selectedBranch === branch" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <!-- Owner Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleDropdown('owner')"
            class="px-3 py-1.5 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <span>{{ selectedOwner }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openDropdown === 'owner'" class="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button 
              v-for="owner in ['All Owners', 'Sana Noor', 'Hamza Ali', 'Ali Raza']"
              :key="owner"
              @click="selectedOwner = owner; openDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
              :class="selectedOwner === owner ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ owner }}</span>
              <Check v-if="selectedOwner === owner" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>
      </div>

      <button 
        v-if="activeTab !== 'All' || selectedBranch !== 'All Branches' || selectedOwner !== 'All Owners' || searchQuery"
        @click="resetFilters" 
        class="text-[11px] text-[#165A31] font-semibold hover:underline cursor-pointer"
      >
        Reset Filters
      </button>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-[14px] font-bold text-gray-900">Follow-up Queue ({{ filteredFollowUps.length }})</h2>
        </div>

        <div class="border border-gray-100 rounded-xl overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th class="px-5 py-3">Due</th>
                <th class="px-5 py-3">Customer / Lead</th>
                <th class="px-5 py-3">Type</th>
                <th class="px-5 py-3">Branch</th>
                <th class="px-5 py-3">Owner</th>
                <th class="px-5 py-3">Priority</th>
                <th class="px-5 py-3">Status</th>
                <th class="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr v-for="item in filteredFollowUps" :key="item.id" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td class="px-5 py-4 text-gray-900 font-bold">{{ item.due }}</td>
                <td class="px-5 py-4 text-gray-800 font-semibold">{{ item.customer }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.type }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.branch }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.owner }}</td>
                <td class="px-5 py-4">
                  <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold', item.priorityColor]">
                    {{ item.priority }}
                  </span>
                </td>
                <td class="px-5 py-4">
                  <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold', item.statusColor]">
                    {{ item.status }}
                  </span>
                </td>
                <td class="px-5 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button 
                      @click.stop="openEditModal(item)" 
                      title="Edit Follow-up"
                      class="hover:text-[#165A31] transition-colors cursor-pointer text-gray-400 p-1"
                    >
                      <Pencil class="w-4 h-4" />
                    </button>
                    <button 
                      @click="toggleComplete(item)" 
                      class="text-xs font-semibold px-2.5 py-1 rounded-md border cursor-pointer transition-colors"
                      :class="item.status === 'Completed' ? 'border-gray-200 text-gray-600 hover:bg-gray-50' : 'border-[#165A31] text-[#165A31] hover:bg-[#eefcf2]'"
                    >
                      {{ item.status === 'Completed' ? 'Reopen' : 'Complete' }}
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-if="filteredFollowUps.length === 0">
                <td colspan="8" class="text-center py-12 text-gray-500">
                  <div class="space-y-2">
                    <p class="text-xs font-semibold text-gray-700">No follow-ups match the selected filters</p>
                    <button @click="resetFilters" class="text-xs text-[#165A31] font-bold underline cursor-pointer">
                      Reset filters
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create / Edit Follow-up Modal -->
    <CreateFollowUp 
      v-if="showCreateModal" 
      :isModal="true"
      :follow-up="selectedFollowUpToEdit"
      @close="showCreateModal = false" 
      @created="handleFollowUpCreated"
      @updated="handleFollowUpUpdated"
    />
  </div>
</template>
