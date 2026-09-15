<script setup>
import { ref, computed } from 'vue'
import { store } from '@/store'

const activeFilter = ref('All')
const filterTabs = ['All', 'Unread']
const selectedCategory = ref('All Categories')
const searchQuery = ref('')

const categories = ['All Categories', 'Inventory', 'Sales', 'Procurement', 'Finance', 'Service', 'Security']

const resetFilters = () => {
  activeFilter.value = 'All'
  selectedCategory.value = 'All Categories'
  searchQuery.value = ''
}

const filteredNotifications = computed(() => {
  return store.notifications.filter(item => {
    if (activeFilter.value === 'Unread' && item.read !== 'No') return false
    if (selectedCategory.value !== 'All Categories' && item.category.toLowerCase() !== selectedCategory.value.toLowerCase()) return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = item.notification.toLowerCase().includes(q) ||
                    item.category.toLowerCase().includes(q) ||
                    item.branch.toLowerCase().includes(q) ||
                    item.time.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })
})
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div>
      <div class="text-[10px] text-gray-500 mb-1">
        Super Admin / Communication / <span class="font-bold text-gray-800">Notifications</span>
      </div>
      <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Notifications</h1>
      <p class="text-sm text-gray-500 mt-1">Informational system events. Notifications do not replace Action Centre tasks.</p>
    </div>

    <!-- Filters Bar -->
    <div class="space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <!-- Quick Tabs & Category Pills -->
        <div class="flex flex-wrap items-center gap-2">
          <div class="flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
            <button 
              v-for="tab in filterTabs" 
              :key="tab"
              @click="activeFilter = tab"
              class="px-4 py-1.5 text-[11px] font-medium rounded transition-colors cursor-pointer"
              :class="activeFilter === tab ? 'bg-[#eefcf2] text-[#165A31] font-bold' : 'text-gray-500 hover:text-gray-900'"
            >
              {{ tab }}
            </button>
          </div>

          <div class="flex flex-wrap items-center gap-1.5 ml-2">
            <button 
              v-for="cat in categories" 
              :key="cat"
              @click="selectedCategory = cat"
              class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] cursor-pointer"
              :class="selectedCategory === cat ? 'bg-[#165A31] text-white border-[#165A31]' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <!-- Search Bar -->
        <div class="flex items-center gap-2">
          <div class="relative w-full sm:w-60 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search notifications..." 
              class="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[11px] placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
            />
          </div>
          <button 
            v-if="searchQuery || activeFilter !== 'All' || selectedCategory !== 'All Categories'" 
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
          <h3 class="text-[13px] font-bold text-gray-900">Notifications</h3>
          <span class="text-[11px] text-gray-400 font-medium">{{ filteredNotifications.length }} notifications</span>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th class="px-5 py-3">Time</th>
                <th class="px-5 py-3">Category</th>
                <th class="px-5 py-3">Notification</th>
                <th class="px-5 py-3">Branch</th>
                <th class="px-5 py-3">Read</th>
                <th class="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr 
                v-for="(item, idx) in filteredNotifications" 
                :key="idx" 
                class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
              >
                <td class="px-5 py-4 text-gray-500 font-medium">{{ item.time }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">
                  <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700">{{ item.category }}</span>
                </td>
                <td class="px-5 py-4 font-semibold text-gray-900">{{ item.notification }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ item.branch }}</td>
                <td class="px-5 py-4 font-medium" :class="item.read === 'No' ? 'text-emerald-700 font-bold' : 'text-gray-400'">
                  {{ item.read }}
                </td>
                <td class="px-5 py-4 text-right">
                  <span class="cursor-pointer text-xs" :class="item.actionClass">
                    {{ item.action }}
                  </span>
                </td>
              </tr>
              <tr v-if="filteredNotifications.length === 0">
                <td colspan="6" class="text-center py-12 text-gray-500">
                  <div class="flex flex-col items-center justify-center">
                    <span class="text-2xl mb-2">🔍</span>
                    <p class="text-sm font-semibold text-gray-700">No notifications found</p>
                    <p class="text-xs text-gray-400 mt-1">Try adjusting your category filter or search query</p>
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
