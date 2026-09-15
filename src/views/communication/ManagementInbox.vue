<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDown } from 'lucide-vue-next'
import { store } from '@/store'

const router = useRouter()
const activeTab = ref('Inbox')
const tabs = ['Inbox', 'Sent', 'Unread']
const searchQuery = ref('')
const selectedBranch = ref('All Branches')
const selectedLinked = ref('All Types')
const selectedPriority = ref('All Priorities')
const openDropdown = ref(null)

const branches = ['All Branches', 'Peshawar', 'Islamabad', 'Lahore']
const linkedTypes = ['All Types', 'Stock Request', 'Customer Order', 'Warranty Claim', 'Purchase Order']
const priorities = ['All Priorities', 'High', 'Medium', 'Low']

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const selectFilter = (type, val) => {
  if (type === 'branch') selectedBranch.value = val
  if (type === 'linked') selectedLinked.value = val
  if (type === 'priority') selectedPriority.value = val
  openDropdown.value = null
}

const resetFilters = () => {
  activeTab.value = 'Inbox'
  searchQuery.value = ''
  selectedBranch.value = 'All Branches'
  selectedLinked.value = 'All Types'
  selectedPriority.value = 'All Priorities'
}

const filteredConversations = computed(() => {
  return store.conversations.filter(item => {
    if (activeTab.value === 'Unread' && item.unread === 0) return false
    if (activeTab.value === 'Sent' && item.from !== 'Super Admin' && !item.from.includes('Admin')) return false
    if (selectedBranch.value !== 'All Branches' && item.branch !== selectedBranch.value) return false
    if (selectedPriority.value !== 'All Priorities' && item.priority !== selectedPriority.value) return false
    if (selectedLinked.value !== 'All Types' && !item.linked.toLowerCase().includes(selectedLinked.value.toLowerCase().slice(0, 4))) return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = item.thread.toLowerCase().includes(q) ||
                    item.branch.toLowerCase().includes(q) ||
                    item.linked.toLowerCase().includes(q) ||
                    item.from.toLowerCase().includes(q) ||
                    item.lastMsg.toLowerCase().includes(q) ||
                    item.priority.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })
})

const openConversation = (item) => {
  store.selectConversation(item)
  router.push('/communication/inbox/detail')
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openDropdown = null">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">
          Super Admin / Communication / <span class="font-bold text-gray-800">Management Inbox</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Management Inbox</h1>
        <p class="text-sm text-gray-500 mt-1">Operational conversations tied to branches and business records.</p>
      </div>
    </div>

    <!-- Filters & Table -->
    <div class="space-y-4">
      <!-- Filter Bar -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
          <button 
            v-for="tab in tabs" 
            :key="tab"
            @click="activeTab = tab"
            class="px-4 py-1.5 text-[11px] font-medium rounded transition-colors cursor-pointer"
            :class="activeTab === tab ? 'bg-[#eefcf2] text-[#165A31] font-bold' : 'text-gray-500 hover:text-gray-900'"
          >
            {{ tab }}
          </button>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <!-- Search -->
          <div class="relative w-full sm:w-56 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search conversation..." 
              class="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[11px] placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
            />
          </div>

          <!-- Branch Dropdown -->
          <div class="relative">
            <button 
              @click.stop="toggleDropdown('branch')"
              class="flex items-center gap-2 text-xs font-medium text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:bg-gray-50 transition-colors"
              :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedBranch !== 'All Branches' }"
            >
              <span>{{ selectedBranch }}</span>
              <ChevronDown class="w-3 h-3 text-gray-400" />
            </button>
            <div v-if="openDropdown === 'branch'" class="absolute right-0 mt-1 w-40 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
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

          <!-- Linked Type Dropdown -->
          <div class="relative">
            <button 
              @click.stop="toggleDropdown('linked')"
              class="flex items-center gap-2 text-xs font-medium text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:bg-gray-50 transition-colors"
              :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedLinked !== 'All Types' }"
            >
              <span>{{ selectedLinked }}</span>
              <ChevronDown class="w-3 h-3 text-gray-400" />
            </button>
            <div v-if="openDropdown === 'linked'" class="absolute right-0 mt-1 w-44 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
              <button 
                v-for="l in linkedTypes" 
                :key="l" 
                @click.stop="selectFilter('linked', l)"
                class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700"
                :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedLinked === l }"
              >
                {{ l }}
              </button>
            </div>
          </div>

          <!-- Priority Dropdown -->
          <div class="relative">
            <button 
              @click.stop="toggleDropdown('priority')"
              class="flex items-center gap-2 text-xs font-medium text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:bg-gray-50 transition-colors"
              :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedPriority !== 'All Priorities' }"
            >
              <span>{{ selectedPriority }}</span>
              <ChevronDown class="w-3 h-3 text-gray-400" />
            </button>
            <div v-if="openDropdown === 'priority'" class="absolute right-0 mt-1 w-40 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
              <button 
                v-for="p in priorities" 
                :key="p" 
                @click.stop="selectFilter('priority', p)"
                class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700"
                :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedPriority === p }"
              >
                {{ p }}
              </button>
            </div>
          </div>

          <button 
            v-if="searchQuery || activeTab !== 'Inbox' || selectedBranch !== 'All Branches' || selectedLinked !== 'All Types' || selectedPriority !== 'All Priorities'" 
            @click="resetFilters" 
            class="text-[11px] font-semibold text-gray-500 hover:text-red-600 px-2 py-1 transition-colors cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      <!-- Table Container -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-[13px] font-bold text-gray-900">Conversations</h3>
          <span class="text-[11px] text-gray-400 font-medium">{{ filteredConversations.length }} records</span>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th class="px-5 py-3">Thread</th>
                <th class="px-5 py-3">Branch</th>
                <th class="px-5 py-3">Linked Record</th>
                <th class="px-5 py-3">From</th>
                <th class="px-5 py-3">Last Message</th>
                <th class="px-5 py-3">Priority</th>
                <th class="px-5 py-3">Unread</th>
                <th class="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr 
                v-for="(item, idx) in filteredConversations" 
                :key="idx" 
                @click="openConversation(item)"
                class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer group" 
                :class="item.unread > 0 ? 'bg-[#fcfdfd]' : ''"
              >
                <td class="px-5 py-4 font-semibold text-gray-900 group-hover:text-[#165A31] transition-colors">{{ item.thread }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.branch }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.linked }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.from }}</td>
                <td class="px-5 py-4 text-gray-900" :class="item.unread > 0 ? 'font-bold' : 'font-medium'">{{ item.lastMsg }}</td>
                <td class="px-5 py-4">
                  <span class="inline-flex items-center px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold" :class="item.priorityClass">
                    {{ item.priority }}
                  </span>
                </td>
                <td class="px-5 py-4 font-bold text-gray-900">{{ item.unread }}</td>
                <td class="px-5 py-4 text-right">
                  <div class="flex items-center justify-end gap-1 text-gray-400 group-hover:text-[#165A31] font-medium tracking-wide">
                    <span>Open</span>
                    <span class="text-sm leading-none">&rarr;</span>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredConversations.length === 0">
                <td colspan="8" class="text-center py-12 text-gray-500">
                  <div class="flex flex-col items-center justify-center">
                    <span class="text-2xl mb-2">🔍</span>
                    <p class="text-sm font-semibold text-gray-700">No conversations found</p>
                    <p class="text-xs text-gray-400 mt-1">Try adjusting your filters or search query</p>
                    <button @click="resetFilters" class="mt-3 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors">
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
  </div>
</template>
