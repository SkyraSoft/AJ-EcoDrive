<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search, ChevronRight } from 'lucide-vue-next'
import CreateLeadModal from './CreateLead.vue'
import { store } from '@/store'

const router = useRouter()
const showCreateModal = ref(false)

const tabs = ['All', 'New', 'Contacted', 'Qualified', 'Quoted', 'Converted']
const activeTab = ref('All')
const searchQuery = ref('')

const leads = ref([
  {
    leadNo: 'LD-982',
    name: 'Usman Ali',
    phone: '+92 300 1122334',
    source: 'Website',
    interest: 'BRG EV-5',
    budget: 'PKR 220K',
    branch: 'Peshawar',
    owner: 'Sana Noor',
    stage: 'Qualified',
    stageColor: 'bg-blue-50 text-blue-600',
    followUp: 'Aug 28'
  },
  {
    leadNo: 'LD-978',
    name: 'Zain Khan',
    phone: '+92 333 9988776',
    source: 'Walk-in',
    interest: 'Cargo Pro',
    budget: 'PKR 310K',
    branch: 'Islamabad',
    owner: 'Ali Raza',
    stage: 'Quoted',
    stageColor: 'bg-yellow-50 text-yellow-700',
    followUp: 'Aug 29'
  },
  {
    leadNo: 'LD-975',
    name: 'Haris Rauf',
    phone: '+92 321 5566778',
    source: 'Referral',
    interest: 'BRG DS11',
    budget: 'PKR 185K',
    branch: 'Lahore',
    owner: 'Hamza Tariq',
    stage: 'New',
    stageColor: 'bg-purple-50 text-purple-600',
    followUp: 'Aug 30'
  },
  {
    leadNo: 'LD-969',
    name: 'Bilal Ahmed',
    phone: '+92 345 6677889',
    source: 'Website',
    interest: 'BRG EV-5',
    budget: 'PKR 220K',
    branch: 'Peshawar',
    owner: 'Sana Noor',
    stage: 'Contacted',
    stageColor: 'bg-orange-50 text-orange-600',
    followUp: 'Sep 02'
  },
  {
    leadNo: 'LD-960',
    name: 'Tariq Mehmood',
    phone: '+92 312 3344556',
    source: 'Walk-in',
    interest: 'BRG DS11',
    budget: 'PKR 185K',
    branch: 'Islamabad',
    owner: 'Ali Raza',
    stage: 'Converted',
    stageColor: 'bg-green-50 text-[#165A31]',
    followUp: 'Completed'
  }
])

const filteredLeads = computed(() => {
  return leads.value.filter(lead => {
    // Branch Authorization Scoping
    if (!store.isBranchAllowed(lead.branch)) {
      return false
    }

    // Tab filter
    if (activeTab.value !== 'All' && lead.stage.toLowerCase() !== activeTab.value.toLowerCase()) {
      return false
    }

    // Search filter
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
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Sales & CRM / <span class="font-bold text-gray-800">Leads & Inquiries</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Leads & Inquiries</h1>
        <p class="text-sm text-gray-500 mt-1">Track prospective customers from first inquiry through conversion.</p>
      </div>
      <button @click="showCreateModal = true" class="bg-[#165A31] text-white text-[11px] font-bold px-4 py-2 rounded-lg hover:bg-[#124a28] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05)] cursor-pointer">
        + Add Lead
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
