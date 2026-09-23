<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDown, Check, Plus, Pencil, CheckCircle2, Search } from 'lucide-vue-next'
import { store } from '@/store'
import CreateDeliveryHandover from './CreateDeliveryHandover.vue'

const router = useRouter()
const showCreateModal = ref(false)
const selectedHandoverToEdit = ref(null)
const showToast = ref(false)
const toastMessage = ref('')

const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

// Branch Manager Data derived from store
const branchKpis = computed(() => {
  const branchName = user.value?.branchName || 'Peshawar'
  const list = store.deliveries.filter(d => !d.branch || d.branch === branchName || !isBranchUser.value)
  const readyToday = list.filter(d => d.status === 'Ready').length
  const completed = list.filter(d => d.status === 'Delivered' || d.status === 'Completed').length
  const docsPending = list.filter(d => !d.identityVerified || !d.paymentComplete).length
  const accCheck = list.filter(d => !d.accessoriesIncluded).length
  return [
    { label: 'Ready Today', value: String(readyToday || 6), sub: '2 before noon' },
    { label: 'Completed', value: String(completed || 18), sub: 'This month' },
    { label: 'Documents Pending', value: String(docsPending || 2), sub: 'Needs action' },
    { label: 'Accessories Check', value: String(accCheck || 1), sub: 'Open checklist' }
  ]
})

const branchStatusFilter = ref('All')
const branchSearchQuery = ref('')
const openBranchDropdown = ref(null)

const toggleBranchDropdown = (name) => {
  openBranchDropdown.value = openBranchDropdown.value === name ? null : name
}

const filteredBranchDeliveries = computed(() => {
  const branchName = user.value?.branchName || 'Peshawar'
  return store.deliveries.filter(item => {
    if (isBranchUser.value && item.branch && item.branch !== branchName) {
      return false
    }
    if (branchStatusFilter.value !== 'All' && item.status !== branchStatusFilter.value) {
      return false
    }
    if (branchSearchQuery.value.trim()) {
      const q = branchSearchQuery.value.toLowerCase()
      const match = (item.order && item.order.toLowerCase().includes(q)) ||
                    (item.order_id && item.order_id.toLowerCase().includes(q)) ||
                    (item.delivery_id && item.delivery_id.toLowerCase().includes(q)) ||
                    (item.customer && item.customer.toLowerCase().includes(q)) ||
                    (item.unit && item.unit.toLowerCase().includes(q)) ||
                    (item.unit_id && item.unit_id.toLowerCase().includes(q))
      if (!match) return false
    }
    return true
  })
})

const openCreateModal = () => {
  selectedHandoverToEdit.value = null
  store.originalEditHandover = null
  showCreateModal.value = true
}

const openEditModal = (item) => {
  selectedHandoverToEdit.value = item
  store.originalEditHandover = item
  showCreateModal.value = true
}

const handleHandoverCreated = (newRecord) => {
  store.addDelivery(newRecord)
  toastMessage.value = `Handover for ${newRecord.customer} scheduled successfully!`
  showToast.value = true
  showCreateModal.value = false
  setTimeout(() => { showToast.value = false }, 4000)
}

const handleHandoverUpdated = (updatedRecord) => {
  store.updateDelivery(updatedRecord.id || updatedRecord.delivery_id || updatedRecord.order, updatedRecord)
  toastMessage.value = `Handover for ${updatedRecord.customer} updated successfully!`
  showToast.value = true
  showCreateModal.value = false
  setTimeout(() => { showToast.value = false }, 4000)
}

const openDeliveryDetail = (item) => {
  const delivId = item.id || item.delivery_id || item.order
  router.push({
    path: '/sales/delivery/detail',
    query: {
      id: delivId,
      customer: item.customer,
      unit: item.unit || item.unit_id,
      scheduled: item.scheduled || item.scheduledTime,
      status: item.status
    }
  })
}

// Super Admin Data
const superAdminDelivery = computed(() => store.deliveries[0] || {
  order: 'SO-7731',
  customer: 'Saad Ahmad',
  unit: 'DS11-00988',
  status: 'Ready'
})

const formData = ref({
  recipientName: '',
  handoverDate: '',
  notes: 'Unit inspected and accepted by customer.'
})

const submitHandover = () => {
  if (superAdminDelivery.value && (superAdminDelivery.value.delivery_id || superAdminDelivery.value.id || superAdminDelivery.value.order)) {
    store.completeDelivery(superAdminDelivery.value.delivery_id || superAdminDelivery.value.id || superAdminDelivery.value.order)
  }
  router.push('/sales/orders')
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
          Branch Manager / Delivery / Handover / <span class="font-medium text-gray-600">Delivery / Handover</span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Delivery / Handover</h1>
        <p class="text-xs text-gray-500 mt-1">{{ user?.branchName || 'Peshawar' }} Branch records only.</p>
      </div>
      <button 
        @click="openCreateModal"
        class="bg-[#165A31] text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
      >
        <Plus class="w-4 h-4" /> <span>Schedule Handover</span>
      </button>
    </div>

    <!-- 4 KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="(kpi, index) in branchKpis" :key="index" class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <div class="text-xs font-semibold text-gray-400 mb-3">{{ kpi.label }}</div>
        <div>
          <div class="text-[26px] font-bold text-gray-900 leading-tight">{{ kpi.value }}</div>
          <div class="text-[11px] font-semibold text-[#165A31] mt-1">{{ kpi.sub }}</div>
        </div>
      </div>
    </div>

    <!-- Filter Buttons Row -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex flex-wrap items-center gap-2">
        <!-- Search Input -->
        <div class="relative w-48 sm:w-60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            v-model="branchSearchQuery"
            type="text" 
            placeholder="Search handovers..." 
            class="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#165A31] transition-colors"
          />
        </div>

        <!-- Status Dropdown -->
        <div class="relative" @click.stop>
          <button 
            @click="toggleBranchDropdown('status')"
            class="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center gap-1.5 hover:bg-gray-50 cursor-pointer"
          >
            <span>Status: {{ branchStatusFilter }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="openBranchDropdown === 'status'" class="absolute top-full left-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button 
              v-for="st in ['All', 'Ready', 'Scheduled', 'In Progress']"
              :key="st"
              @click="branchStatusFilter = st; openBranchDropdown = null"
              class="w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
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
        <button class="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer">
          Columns
        </button>
        <button class="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer">
          Export
        </button>
      </div>
    </div>

    <!-- Delivery / Handover Table Card -->
    <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
      <h3 class="text-sm font-bold text-gray-900 mb-5">Delivery / Handover</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="text-[10px] font-bold text-gray-400 border-b border-gray-100 pb-3 uppercase tracking-wider">
              <th class="pb-3 font-semibold w-36">Order</th>
              <th class="pb-3 font-semibold w-48">Customer</th>
              <th class="pb-3 font-semibold w-48">Unit</th>
              <th class="pb-3 font-semibold w-36">Scheduled</th>
              <th class="pb-3 font-semibold w-36">Status</th>
              <th class="pb-3 font-semibold w-24 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="text-xs divide-y divide-gray-50">
            <tr 
              v-for="(item, index) in filteredBranchDeliveries" 
              :key="index" 
              class="hover:bg-gray-50/50 transition-colors"
            >
              <td class="py-4 align-middle font-medium text-gray-900">
                {{ item.order }}
              </td>
              <td class="py-4 align-middle text-gray-800 font-medium">
                {{ item.customer }}
              </td>
              <td class="py-4 align-middle text-gray-700 font-medium">
                {{ item.unit }}
              </td>
              <td class="py-4 align-middle text-gray-900 font-medium">
                {{ item.scheduled }}
              </td>
              <td class="py-4 align-middle">
                <span class="px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap" :class="item.statusClass">
                  {{ item.status }}
                </span>
              </td>
              <td class="py-4 align-middle text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-3 text-gray-400">
                  <button 
                    @click.stop="openEditModal(item)" 
                    title="Edit Handover"
                    class="hover:text-[#165A31] transition-colors cursor-pointer"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>
                  <button 
                    @click.stop="openDeliveryDetail(item)"
                    class="text-xs font-medium text-gray-400 hover:text-gray-700 cursor-pointer flex items-center justify-end gap-0.5"
                  >
                    Open &rsaquo;
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="filteredBranchDeliveries.length === 0">
              <td colspan="6" class="text-center py-12 text-gray-500">
                <p class="text-xs font-semibold text-gray-700">No scheduled deliveries found</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create / Edit Delivery Handover Modal -->
    <CreateDeliveryHandover 
      v-if="showCreateModal" 
      :isModal="true"
      :handover="selectedHandoverToEdit"
      @close="showCreateModal = false" 
      @created="handleHandoverCreated"
      @updated="handleHandoverUpdated"
    />
  </div>

  <!-- SUPER ADMIN VIEW -->
  <div v-else class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-8">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Sales & CRM / <span class="font-bold text-gray-800">Delivery / Handover</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Delivery / Handover</h1>
        <p class="text-sm text-gray-500 mt-1">Complete customer handover and move the reserved unit to Sold.</p>
      </div>
      <button 
        @click="openCreateModal"
        class="bg-[#165A31] text-white text-[11px] font-bold px-4 py-2.5 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
      >
        <Plus class="w-4 h-4" /> <span>Schedule Handover</span>
      </button>
    </div>

    <!-- Status Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 rounded-xl">
      <div>
        <h2 class="text-xl font-bold text-gray-900">Handover · SO-7731</h2>
        <p class="text-[12px] text-gray-500 mt-1">Saad Ahmad · DS11-00988</p>
      </div>
      <div>
        <span class="inline-flex items-center px-3 py-1.5 rounded-[4px] text-[11px] font-bold bg-[#eefcf2] text-[#165A31]">Ready</span>
      </div>
    </div>

    <!-- Verification Checklists -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-4">Customer Verification</h3>
        <div class="grid grid-cols-2 gap-y-4">
          <div class="flex items-center gap-2">
            <Check class="w-4 h-4 text-gray-400" />
            <span class="text-[12px] text-gray-700">Customer Identity verified</span>
          </div>
          <div class="flex items-center gap-2">
            <Check class="w-4 h-4 text-gray-400" />
            <span class="text-[12px] text-gray-700">Payment complete</span>
          </div>
          <div class="flex items-center gap-2">
            <Check class="w-4 h-4 text-gray-400" />
            <span class="text-[12px] text-gray-700">Invoice issued</span>
          </div>
          <div class="flex items-center gap-2">
            <Check class="w-4 h-4 text-gray-400" />
            <span class="text-[12px] text-gray-700">Order signed</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-4">Unit Verification</h3>
        <div class="grid grid-cols-2 gap-y-4">
          <div class="flex items-center gap-2">
            <Check class="w-4 h-4 text-gray-400" />
            <span class="text-[12px] text-gray-700">Serial DS11-00988</span>
          </div>
          <div class="flex items-center gap-2">
            <Check class="w-4 h-4 text-gray-400" />
            <span class="text-[12px] text-gray-700">Chassis CH-88165</span>
          </div>
          <div class="flex items-center gap-2">
            <Check class="w-4 h-4 text-gray-400" />
            <span class="text-[12px] text-gray-700">Accessories included</span>
          </div>
          <div class="flex items-center gap-2">
            <Check class="w-4 h-4 text-gray-400" />
            <span class="text-[12px] text-gray-700">Warranty explained</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Handover Confirmation Form -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-6">
      <h3 class="text-[14px] font-bold text-gray-900">Handover Confirmation</h3>
      
      <div>
        <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Recipient Name</label>
        <input v-model="formData.recipientName" type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
      </div>

      <div>
        <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Handover Date</label>
        <input v-model="formData.handoverDate" type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
      </div>

      <div>
        <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Notes</label>
        <textarea v-model="formData.notes" rows="3" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors"></textarea>
      </div>
    </div>

    <!-- Footer Actions -->
    <div class="flex justify-end gap-3 pt-4">
      <button class="px-5 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        Cancel
      </button>
      <button @click="submitHandover" class="px-5 py-2 text-[11px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        Complete Handover & Mark Sold
      </button>
    </div>

    <!-- Create / Edit Delivery Handover Modal -->
    <CreateDeliveryHandover 
      v-if="showCreateModal" 
      :isModal="true"
      :handover="selectedHandoverToEdit"
      @close="showCreateModal = false" 
      @created="handleHandoverCreated"
      @updated="handleHandoverUpdated"
    />
  </div>
</template>
