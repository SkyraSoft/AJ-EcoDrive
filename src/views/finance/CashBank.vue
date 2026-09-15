<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const selectedAccount = ref('All Accounts')
const selectedStatus = ref('All Statuses')
const openDropdown = ref(null)

const accounts = ['All Accounts', 'Bank', 'Cash']
const statuses = ['All Statuses', 'Matched', 'Review']

const kpis = [
  { label: 'Bank Balance', value: 'PKR 18.6M' },
  { label: 'Cash on Hand', value: 'PKR 1.2M' },
  { label: 'Unreconciled', value: 'PKR 0.14M' },
  { label: 'Last Reconciled', value: 'Aug 26' }
]

const reconciliations = ref([
  {
    date: 'Aug 27',
    account: 'Bank',
    reference: 'PAY-3318',
    recorded: '100K',
    statement: '100K',
    difference: '0',
    status: 'Matched',
    statusClass: 'bg-[#eefcf2] text-[#165A31]',
    action: 'Open',
    actionClass: 'text-gray-500 hover:text-gray-900'
  },
  {
    date: 'Aug 27',
    account: 'Bank',
    reference: 'EXP-8821',
    recorded: '42K',
    statement: '42K',
    difference: '0',
    status: 'Matched',
    statusClass: 'bg-[#eefcf2] text-[#165A31]',
    action: 'Open',
    actionClass: 'text-gray-500 hover:text-gray-900'
  },
  {
    date: 'Aug 27',
    account: 'Cash',
    reference: 'CASH-1182',
    recorded: '28K',
    statement: '—',
    difference: '28K',
    status: 'Review',
    statusClass: 'bg-[#fff7ed] text-[#ea580c]',
    action: 'Match',
    actionClass: 'text-[#165A31] font-bold hover:underline'
  },
  {
    date: 'Aug 26',
    account: 'Bank',
    reference: 'PAY-3310',
    recorded: '250K',
    statement: '250K',
    difference: '0',
    status: 'Matched',
    statusClass: 'bg-[#eefcf2] text-[#165A31]',
    action: 'Open',
    actionClass: 'text-gray-500 hover:text-gray-900'
  }
])

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const selectFilter = (type, val) => {
  if (type === 'account') selectedAccount.value = val
  if (type === 'status') selectedStatus.value = val
  openDropdown.value = null
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedAccount.value = 'All Accounts'
  selectedStatus.value = 'All Statuses'
}

const filteredReconciliations = computed(() => {
  return reconciliations.value.filter(item => {
    if (selectedAccount.value !== 'All Accounts' && item.account !== selectedAccount.value) return false
    if (selectedStatus.value !== 'All Statuses' && item.status !== selectedStatus.value) return false
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = item.account.toLowerCase().includes(q) ||
                    item.reference.toLowerCase().includes(q) ||
                    item.date.toLowerCase().includes(q) ||
                    item.recorded.toLowerCase().includes(q) ||
                    item.status.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })
})
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12" @click="openDropdown = null">
    <!-- Header -->
    <div>
      <div class="text-[10px] text-gray-500 mb-1">
        Super Admin / Finance / <span class="font-bold text-gray-800">Cash / Bank</span>
      </div>
      <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Cash / Bank</h1>
      <p class="text-sm text-gray-500 mt-1">Reconcile operating cash and bank movements with recorded transactions.</p>
    </div>

    <!-- 4 KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div 
        v-for="(kpi, index) in kpis" 
        :key="index" 
        class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between"
      >
        <div class="text-xs font-semibold text-gray-400 mb-2">{{ kpi.label }}</div>
        <div class="text-[22px] font-bold text-gray-900 leading-none">{{ kpi.value }}</div>
      </div>
    </div>

    <!-- Filters Bar -->
    <div class="flex flex-wrap items-center gap-3">
      <div class="relative w-full sm:w-64">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search reference, account, date..." 
          class="w-full pl-9 pr-3 py-1.5 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
        />
      </div>

      <!-- Account Dropdown -->
      <div class="relative">
        <button 
          @click.stop="toggleDropdown('account')"
          class="px-3 py-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex items-center gap-2"
          :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedAccount !== 'All Accounts' }"
        >
          <span>{{ selectedAccount }}</span>
          <span class="text-[8px] text-gray-400">▼</span>
        </button>
        <div v-if="openDropdown === 'account'" class="absolute left-0 mt-1 w-36 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-[11px]">
          <button 
            v-for="a in accounts" 
            :key="a" 
            @click.stop="selectFilter('account', a)"
            class="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-medium text-gray-700"
            :class="{ 'text-[#165A31] font-bold bg-[#eefcf2]/50': selectedAccount === a }"
          >
            {{ a }}
          </button>
        </div>
      </div>

      <!-- Status Dropdown -->
      <div class="relative">
        <button 
          @click.stop="toggleDropdown('status')"
          class="px-3 py-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex items-center gap-2"
          :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': selectedStatus !== 'All Statuses' }"
        >
          <span>{{ selectedStatus }}</span>
          <span class="text-[8px] text-gray-400">▼</span>
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
        v-if="searchQuery || selectedAccount !== 'All Accounts' || selectedStatus !== 'All Statuses'" 
        @click="resetFilters" 
        class="text-[11px] font-semibold text-gray-500 hover:text-red-600 px-2 py-1 transition-colors"
      >
        Clear Filters
      </button>
    </div>

    <!-- Reconciliation Table -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-[13px] font-bold text-gray-900">Reconciliation</h3>
        <span class="text-[11px] font-medium text-gray-500">Showing {{ filteredReconciliations.length }} records</span>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <th class="px-6 py-3">Date</th>
              <th class="px-6 py-3">Account</th>
              <th class="px-6 py-3">Reference</th>
              <th class="px-6 py-3">Recorded</th>
              <th class="px-6 py-3">Statement</th>
              <th class="px-6 py-3">Difference</th>
              <th class="px-6 py-3">Status</th>
              <th class="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr 
              v-for="(item, idx) in filteredReconciliations" 
              :key="idx" 
              class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
            >
              <td class="px-6 py-4 text-gray-600 font-medium">{{ item.date }}</td>
              <td class="px-6 py-4 font-semibold text-gray-900">{{ item.account }}</td>
              <td class="px-6 py-4 text-gray-600 font-medium">{{ item.reference }}</td>
              <td class="px-6 py-4 text-gray-900 font-bold">{{ item.recorded }}</td>
              <td class="px-6 py-4 text-gray-600 font-medium">{{ item.statement }}</td>
              <td class="px-6 py-4 text-gray-900 font-bold">{{ item.difference }}</td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[9px] font-bold" :class="item.statusClass">
                  {{ item.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button class="cursor-pointer text-xs" :class="item.actionClass">
                  {{ item.action }}
                </button>
              </td>
            </tr>
            <tr v-if="filteredReconciliations.length === 0">
              <td colspan="8" class="text-center py-12 text-gray-500">
                <div class="flex flex-col items-center justify-center">
                  <span class="text-2xl mb-2">🔍</span>
                  <p class="text-sm font-semibold text-gray-700">No reconciliation records found</p>
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
</template>
