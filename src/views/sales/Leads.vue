<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search, ChevronDown, Check, ChevronRight, Plus, CheckCircle2 } from 'lucide-vue-next'
import { store } from '@/store'
import CreateLeadModal from './CreateLead.vue'

const router = useRouter()
const showCreateModal = ref(false)
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

// Branch Manager Data
const branchKPIs = computed(() => [
  { label: 'New', value: '14', change: 'Today +3' },
  { label: 'Contacted', value: '21', change: 'This week' },
  { label: 'Quoted', value: '9', change: '43%' },
  { label: 'Overdue', value: '4', change: 'Needs action' }
])

const branchLeads = computed(() => {
  const branchName = user.value?.branchName || 'Peshawar'
  return store.leads
    .filter(l => !l.branch || l.branch === branchName || l.branch.toLowerCase().includes(branchName.toLowerCase()))
    .map(l => ({
      ...l,
      leadNo: l.id || l.leadNo,
      customer: l.name || l.customer,
      status: l.status || l.stage || 'New',
      statusClass: (l.status || l.stage) === 'Quoted' ? 'bg-[#dcfce7] text-[#165A31]' : ((l.status || l.stage) === 'Converted' ? 'bg-[#eefcf2] text-[#165A31]' : 'bg-[#eff6ff] text-[#2563eb]'),
      date: l.date || 'Today'
    }))
})

const branchStatusFilter = ref('All')
const branchDateFilter = ref('Date')
const branchSavedFilter = ref('Saved filters')
const branchSourceFilter = ref('All Sources')
const branchProductFilter = ref('All Products')
const branchSearchQuery = ref('')
const openBranchDropdown = ref(null)

const showToast = ref(false)
const toastMessage = ref('')

const branchColumns = ref([
  { key: 'leadNo', label: 'Lead #', visible: true },
  { key: 'customer', label: 'Customer', visible: true },
  { key: 'source', label: 'Source', visible: true },
  { key: 'product', label: 'Product', visible: true },
  { key: 'status', label: 'Status', visible: true }
])

const toggleBranchDropdown = (name) => {
  openBranchDropdown.value = openBranchDropdown.value === name ? null : name
}

const selectBranchSavedFilter = (preset) => {
  branchSavedFilter.value = preset
  if (preset === 'New Leads Today') {
    branchStatusFilter.value = 'New'
    branchDateFilter.value = 'Today'
  } else if (preset === 'Quoted Opportunities') {
    branchStatusFilter.value = 'Quoted'
  } else if (preset === 'Website Inquiries') {
    branchSourceFilter.value = 'Website'
  }
  openBranchDropdown.value = null
}

const clearBranchFilters = () => {
  branchStatusFilter.value = 'All'
  branchDateFilter.value = 'Date'
  branchSavedFilter.value = 'Saved filters'
  branchSourceFilter.value = 'All Sources'
  branchProductFilter.value = 'All Products'
  branchSearchQuery.value = ''
}

const hasActiveBranchFilters = computed(() => {
  return branchStatusFilter.value !== 'All' ||
    branchDateFilter.value !== 'Date' ||
    branchSavedFilter.value !== 'Saved filters' ||
    branchSourceFilter.value !== 'All Sources' ||
    branchProductFilter.value !== 'All Products' ||
    branchSearchQuery.value.trim() !== ''
})

const filteredBranchLeads = computed(() => {
  return branchLeads.value.filter(lead => {
    if (branchStatusFilter.value !== 'All' && lead.status !== branchStatusFilter.value) {
      return false
    }
    if (branchSourceFilter.value !== 'All Sources' && lead.source !== branchSourceFilter.value) {
      return false
    }
    if (branchProductFilter.value !== 'All Products' && lead.product !== branchProductFilter.value) {
      return false
    }
    if (branchDateFilter.value === 'Today' && lead.date !== 'Today') {
      return false
    }
    if (branchSearchQuery.value.trim()) {
      const q = branchSearchQuery.value.toLowerCase()
      const match = lead.leadNo.toLowerCase().includes(q) ||
                    lead.customer.toLowerCase().includes(q) ||
                    lead.source.toLowerCase().includes(q) ||
                    lead.product.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })
})

const exportBranchLeads = () => {
  const headers = ['Lead #', 'Customer', 'Source', 'Product', 'Status']
  const rows = filteredBranchLeads.value.map(item => [
    item.leadNo,
    item.customer,
    item.source,
    item.product,
    item.status
  ])
  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `branch_leads_${Date.now()}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  toastMessage.value = `Exported ${filteredBranchLeads.value.length} leads successfully.`
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3000)
}

const openBranchLead = (lead) => {
  router.push({
    path: '/sales/leads/detail',
    query: { id: lead.leadNo, name: lead.customer }
  })
}

// Super Admin Data
const tabs = ['All', 'New', 'Contacted', 'Qualified', 'Quoted', 'Converted']
const activeTab = ref('All')
const searchQuery = ref('')

const leads = computed(() => {
  return store.leads.map(l => ({
    ...l,
    leadNo: l.id || l.leadNo,
    name: l.name || l.customer,
    phone: l.phone || '+92 300 1122334',
    interest: l.interest || l.product || 'BRG EV-5',
    budget: l.budget || 'PKR 220K',
    stage: l.stage || l.status || 'New',
    stageColor: (l.stage || l.status) === 'Converted' ? 'bg-green-50 text-[#165A31]' : ((l.stage || l.status) === 'Quoted' ? 'bg-yellow-50 text-yellow-700' : 'bg-purple-50 text-purple-600'),
    followUp: l.followUp || l.nextFollowUp || 'Aug 30'
  }))
})

const filteredLeads = computed(() => {
  return leads.value.filter(lead => {
    if (!store.isBranchAllowed(lead.branch)) {
      return false
    }
    if (activeTab.value !== 'All') {
      const stage = (lead.stage || lead.status || '').toLowerCase()
      const tab = activeTab.value.toLowerCase()
      if (tab === 'new') {
        if (stage !== 'new' && stage !== 'inquiry' && stage !== 'open') return false
      } else if (tab === 'contacted') {
        if (stage !== 'contacted' && stage !== 'in progress') return false
      } else if (tab === 'qualified') {
        if (stage !== 'qualified' && stage !== 'interested') return false
      } else if (tab === 'quoted') {
        if (stage !== 'quoted' && stage !== 'proposal') return false
      } else if (tab === 'converted') {
        if (stage !== 'converted' && stage !== 'won') return false
      } else if (stage !== tab) {
        return false
      }
    }
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const match = 
        lead.leadNo.toLowerCase().includes(q) ||
        lead.name.toLowerCase().includes(q) ||
        lead.interest.toLowerCase().includes(q) ||
        lead.branch.toLowerCase().includes(q) ||
        lead.owner.toLowerCase().includes(q) ||
        lead.source.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })
})

const resetFilters = () => {
  activeTab.value = 'All'
  searchQuery.value = ''
}

const openLead = (lead) => {
  router.push('/sales/leads/detail')
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
          Branch Manager / Leads / <span class="font-medium text-gray-600">Leads & Inquiries</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Leads & Inquiries</h1>
        <p class="text-xs text-gray-500 mt-1">Manage website, walk-in and phone leads assigned to {{ user?.branchName || 'Peshawar' }} Branch.</p>
      </div>
      <button 
        @click="showCreateModal = true"
        class="bg-[#165A31] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
      >
        <Plus class="w-4 h-4" /> <span>Add Lead</span>
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
        <!-- Status Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('status')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': branchStatusFilter !== 'All' }"
          >
            <span>Status: {{ branchStatusFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openBranchDropdown === 'status'" class="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button 
              v-for="st in ['All', 'New', 'Contacted', 'Quoted', 'Converted']"
              :key="st"
              @click="branchStatusFilter = st; openBranchDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
              :class="branchStatusFilter === st ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ st }}</span>
              <Check v-if="branchStatusFilter === st" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <!-- Date Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('date')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': branchDateFilter !== 'Date' }"
          >
            <span>{{ branchDateFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openBranchDropdown === 'date'" class="absolute top-full left-0 mt-1 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button 
              v-for="d in ['Date', 'Today', 'This Week', 'This Month', 'All Time']"
              :key="d"
              @click="branchDateFilter = d; openBranchDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
              :class="branchDateFilter === d ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ d }}</span>
              <Check v-if="branchDateFilter === d" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <!-- Saved Filters Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('saved')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': branchSavedFilter !== 'Saved filters' }"
          >
            <span>{{ branchSavedFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openBranchDropdown === 'saved'" class="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button 
              v-for="preset in ['New Leads Today', 'Quoted Opportunities', 'Website Inquiries']"
              :key="preset"
              @click="selectBranchSavedFilter(preset)"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
              :class="branchSavedFilter === preset ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ preset }}</span>
              <Check v-if="branchSavedFilter === preset" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <!-- Sub-filter: Source -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('source')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': branchSourceFilter !== 'All Sources' }"
          >
            <span>Source: {{ branchSourceFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openBranchDropdown === 'source'" class="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button 
              v-for="s in ['All Sources', 'Website', 'Walk-in', 'Referral']"
              :key="s"
              @click="branchSourceFilter = s; openBranchDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
              :class="branchSourceFilter === s ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ s }}</span>
              <Check v-if="branchSourceFilter === s" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <!-- Sub-filter: Product -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('product')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            :class="{ 'border-[#165A31] text-[#165A31] bg-[#eefcf2]/30': branchProductFilter !== 'All Products' }"
          >
            <span>Product: {{ branchProductFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openBranchDropdown === 'product'" class="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button 
              v-for="p in ['All Products', 'BRG X7', 'BRG E-125', 'BRG EV-5', 'Cargo Pro']"
              :key="p"
              @click="branchProductFilter = p; openBranchDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors"
              :class="branchProductFilter === p ? 'font-bold text-[#165A31] bg-[#eefcf2]/50' : 'text-gray-700'"
            >
              <span>{{ p }}</span>
              <Check v-if="branchProductFilter === p" class="w-3.5 h-3.5 text-[#165A31]" />
            </button>
          </div>
        </div>

        <!-- Search Input -->
        <div class="relative w-44 sm:w-56 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            v-model="branchSearchQuery"
            type="text" 
            placeholder="Search leads..." 
            class="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
          />
        </div>

        <!-- Clear Button -->
        <button 
          v-if="hasActiveBranchFilters" 
          @click="clearBranchFilters" 
          class="text-xs font-semibold text-gray-400 hover:text-red-600 px-2 py-1 transition-colors cursor-pointer"
        >
          Clear
        </button>
      </div>

      <!-- Right Actions: Columns & Export -->
      <div class="flex items-center gap-2">
        <!-- Columns Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('columns')"
            class="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            Columns
          </button>
          <div 
            v-if="openBranchDropdown === 'columns'" 
            class="absolute top-full right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <div class="px-3 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 mb-1">
              Toggle Columns
            </div>
            <label 
              v-for="col in branchColumns" 
              :key="col.key" 
              class="flex items-center px-3.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input 
                type="checkbox" 
                v-model="col.visible" 
                class="rounded border-gray-300 text-[#165A31] focus:ring-[#165A31] mr-2.5 h-3.5 w-3.5 accent-[#165A31]"
              />
              <span>{{ col.label }}</span>
            </label>
          </div>
        </div>

        <!-- Export Button -->
        <button 
          @click="exportBranchLeads"
          class="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
        >
          Export
        </button>
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm font-bold text-gray-900">Branch Leads</h2>
          <span class="text-xs text-gray-400 font-medium">{{ filteredBranchLeads.length }} leads</span>
        </div>

        <div class="border border-gray-100 rounded-xl overflow-hidden">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-[#fbfcfc] border-b border-gray-100 text-[11px] font-semibold text-gray-400">
                <th v-if="branchColumns.find(c => c.key === 'leadNo')?.visible" class="px-5 py-3">Lead</th>
                <th v-if="branchColumns.find(c => c.key === 'customer')?.visible" class="px-5 py-3">Customer</th>
                <th v-if="branchColumns.find(c => c.key === 'source')?.visible" class="px-5 py-3">Source</th>
                <th v-if="branchColumns.find(c => c.key === 'product')?.visible" class="px-5 py-3">Product</th>
                <th v-if="branchColumns.find(c => c.key === 'status')?.visible" class="px-5 py-3">Status</th>
                <th class="px-5 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody class="text-xs">
              <tr 
                v-for="lead in filteredBranchLeads" 
                :key="lead.leadNo"
                class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
                @click="openBranchLead(lead)"
              >
                <td v-if="branchColumns.find(c => c.key === 'leadNo')?.visible" class="px-5 py-4 font-medium text-gray-700">{{ lead.leadNo }}</td>
                <td v-if="branchColumns.find(c => c.key === 'customer')?.visible" class="px-5 py-4 font-bold text-gray-900">{{ lead.customer }}</td>
                <td v-if="branchColumns.find(c => c.key === 'source')?.visible" class="px-5 py-4 text-gray-600">{{ lead.source }}</td>
                <td v-if="branchColumns.find(c => c.key === 'product')?.visible" class="px-5 py-4 text-gray-700">{{ lead.product }}</td>
                <td v-if="branchColumns.find(c => c.key === 'status')?.visible" class="px-5 py-4">
                  <span :class="['inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-medium', lead.statusClass]">
                    {{ lead.status }}
                  </span>
                </td>
                <td class="px-5 py-4 text-right">
                  <span class="text-xs text-gray-400 font-medium hover:text-gray-700 transition-colors">
                    Open ›
                  </span>
                </td>
              </tr>
              <tr v-if="filteredBranchLeads.length === 0">
                <td colspan="6" class="text-center py-12 text-gray-500">
                  <div class="flex flex-col items-center justify-center">
                    <span class="text-2xl mb-2">🔍</span>
                    <p class="text-sm font-semibold text-gray-700">No leads match the selected filters</p>
                    <p class="text-xs text-gray-400 mt-1">Try adjusting your filters or search query</p>
                    <button @click="clearBranchFilters" class="mt-3 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer">
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

    <!-- Create Lead Modal -->
    <CreateLeadModal v-if="showCreateModal" @close="showCreateModal = false" />
  </div>

  <!-- SUPER ADMIN VIEW -->
  <div v-else class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Sales & CRM / <span class="font-bold text-gray-800">Leads & Inquiries</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Leads & Inquiries</h1>
        <p class="text-sm text-gray-500 mt-1">Track prospective customers from first inquiry through conversion.</p>
      </div>
      <button @click="showCreateModal = true" class="bg-[#165A31] text-white text-[11px] font-bold px-4 py-2 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer">
        <Plus class="w-4 h-4" /> <span>Add Lead</span>
      </button>
    </div>

    <!-- Filters & Tabs -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-3">
      <div class="flex items-center bg-gray-50/80 p-1 rounded-lg border border-gray-100 overflow-x-auto max-w-full">
        <button 
          v-for="tab in tabs" 
          :key="tab"
          @click="activeTab = tab"
          :class="[
            'px-3.5 py-1.5 text-[11px] font-bold rounded-md transition-all cursor-pointer whitespace-nowrap',
            activeTab === tab ? 'bg-white text-gray-900 shadow-[0_1px_2px_rgba(0,0,0,0.05)]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
          ]"
        >
          {{ tab }}
        </button>
      </div>
      
      <div class="relative w-full sm:w-72">
        <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search by lead #, name, product, branch..." 
          class="w-full pl-9 pr-4 py-1.5 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)]" 
        />
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-[14px] font-bold text-gray-900">Leads ({{ filteredLeads.length }})</h2>
          <button 
            v-if="activeTab !== 'All' || searchQuery"
            @click="resetFilters" 
            class="text-[11px] text-[#165A31] font-semibold hover:underline cursor-pointer"
          >
            Clear Filters
          </button>
        </div>

        <div class="border border-gray-100 rounded-xl overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th class="px-5 py-3">Lead</th>
                <th class="px-5 py-3">Name</th>
                <th class="px-5 py-3">Source</th>
                <th class="px-5 py-3">Interest</th>
                <th class="px-5 py-3">Branch</th>
                <th class="px-5 py-3">Owner</th>
                <th class="px-5 py-3">Stage</th>
                <th class="px-5 py-3">Next Follow-up</th>
                <th class="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr 
                v-for="lead in filteredLeads" 
                :key="lead.leadNo" 
                class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
                @click="openLead(lead)"
              >
                <td class="px-5 py-4 text-gray-900 font-bold">{{ lead.leadNo }}</td>
                <td class="px-5 py-4 text-gray-800 font-semibold">{{ lead.name }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ lead.source }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ lead.interest }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ lead.branch }}</td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ lead.owner }}</td>
                <td class="px-5 py-4">
                  <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold', lead.stageColor]">
                    {{ lead.stage }}
                  </span>
                </td>
                <td class="px-5 py-4 text-gray-600 font-medium">{{ lead.followUp }}</td>
                <td class="px-5 py-4 text-right">
                  <button @click.stop="openLead(lead)" class="text-xs font-semibold text-[#165A31] hover:underline cursor-pointer">
                    View
                  </button>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-if="filteredLeads.length === 0">
                <td colspan="9" class="text-center py-12 text-gray-500">
                  <div class="space-y-2">
                    <p class="text-xs font-semibold text-gray-700">No leads match the selected filters</p>
                    <button @click="resetFilters" class="text-xs text-[#165A31] font-bold underline cursor-pointer">
                      Reset all filters
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create Modal -->
    <CreateLeadModal v-if="showCreateModal" @close="showCreateModal = false" />
  </div>
</template>

