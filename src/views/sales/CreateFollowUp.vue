<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { X } from 'lucide-vue-next'
import { store } from '@/store'

const props = defineProps({
  isModal: {
    type: Boolean,
    default: true
  },
  followUp: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'created', 'updated'])
const router = useRouter()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const isEditMode = ref(false)
const showValidation = ref(false)

const form = ref({
  id: null,
  customer: '',
  linkedRecord: '',
  taskType: 'Payment Reminder',
  priority: 'High',
  channel: 'Phone Call',
  owner: 'Hamza',
  branch: user.value?.branchName || 'Peshawar',
  dueDate: 'Today',
  dueTime: '11:30',
  notes: '',
  sendReminder: true
})

const loadData = (data) => {
  if (!data) return
  isEditMode.value = true
  form.value = {
    ...form.value,
    id: data.id || form.value.id,
    customer: data.customer || form.value.customer,
    linkedRecord: data.linkedRecord || data.type || form.value.linkedRecord,
    taskType: data.taskType || data.type || form.value.taskType,
    priority: data.priority || form.value.priority,
    channel: data.channel || form.value.channel,
    owner: data.owner || form.value.owner,
    branch: data.branch || form.value.branch,
    dueDate: data.dueDate || (data.due ? data.due.split(' ')[0] : form.value.dueDate),
    dueTime: data.dueTime || (data.due ? data.due.split(' ')[1] : form.value.dueTime),
    notes: data.notes || form.value.notes
  }
}

onMounted(() => {
  if (props.followUp) {
    loadData(props.followUp)
  } else if (store.originalEditFollowUp) {
    loadData(store.originalEditFollowUp)
  }
})

watch(() => props.followUp, (newVal) => {
  if (newVal) loadData(newVal)
}, { immediate: true })

const close = () => {
  store.originalEditFollowUp = null
  emit('close')
  if (router.currentRoute.value.path.includes('/create')) {
    router.push('/sales/follow-ups')
  }
}

const saveFollowUp = () => {
  if (!form.value.customer.trim() || !form.value.linkedRecord.trim()) {
    showValidation.value = true
    return
  }

  const payload = {
    id: form.value.id || Date.now(),
    customer: form.value.customer,
    linkedRecord: form.value.linkedRecord,
    type: form.value.taskType,
    taskType: form.value.taskType,
    owner: form.value.owner,
    branch: form.value.branch,
    due: `${form.value.dueDate} ${form.value.dueTime}`,
    dueDate: form.value.dueDate,
    dueTime: form.value.dueTime,
    priority: form.value.priority,
    channel: form.value.channel,
    notes: form.value.notes,
    status: 'Due Today',
    statusClass: 'bg-[#fef3c7] text-[#b45309]',
    priorityColor: form.value.priority === 'High' ? 'bg-orange-50 text-orange-700' : 'bg-blue-50 text-blue-600'
  }

  if (form.value.sendReminder) {
    store.addNotification({
      title: 'Follow-up Task Scheduled',
      message: `${payload.taskType} scheduled for ${payload.customer} (${payload.linkedRecord}) due ${payload.due}.`,
      type: 'info',
      category: 'Sales',
      source_type: 'follow_up',
      source_id: String(payload.id),
      branch: payload.branch,
      priority: payload.priority
    })
  }

  if (isEditMode.value) {
    store.updateFollowUp(payload.id, payload)
    emit('updated', payload)
  } else {
    store.addFollowUp(payload)
    emit('created', payload)
  }
  close()
}
</script>

<template>
  <div class="fixed inset-0 bg-gray-900/50 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm" @click.self="close">
    <!-- Floating Close Button -->
    <button @click="close" class="fixed top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-100 rounded-full z-[110] shadow-lg transition-colors cursor-pointer">
      <X class="w-5 h-5" />
    </button>

    <!-- Modal Card -->
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">
      <div class="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <div>
            <div class="text-[10px] text-gray-500 mb-1">
              <span v-if="isBranchUser">Branch Manager / Follow-ups / <span class="font-bold text-gray-800">{{ isEditMode ? 'Edit Follow-up' : 'Schedule Follow-up' }}</span></span>
              <span v-else>Super Admin / Sales & CRM / Follow-ups / <span class="font-bold text-gray-800">{{ isEditMode ? 'Edit Follow-up' : 'Schedule Follow-up' }}</span></span>
            </div>
            <h1 class="text-[28px] sm:text-[32px] tracking-tight font-bold text-gray-900">{{ isEditMode ? 'Edit Follow-up' : 'Schedule Follow-up' }}</h1>
            <p class="text-xs sm:text-sm text-gray-500 mt-1">Schedule customer or lead follow-up task, priority, due date and assignment.</p>
          </div>
        </div>

        <!-- 2 Column Form Grid -->
        <form @submit.prevent="saveFollowUp" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <!-- Left Card -->
            <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
              <h3 class="text-sm font-bold text-gray-900 mb-4">Follow-up Details</h3>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1">Customer / Lead Name *</label>
                <input 
                  v-model="form.customer" 
                  type="text" 
                  placeholder="e.g. Bilal Shah or Sajid Khan" 
                  class="w-full px-3.5 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:border-[#165A31] transition-colors"
                  :class="showValidation && !form.customer.trim() ? 'border-red-300 bg-red-50/20' : 'border-gray-200'"
                />
                <p v-if="showValidation && !form.customer.trim()" class="text-[10px] text-red-500 mt-1">Customer name is required</p>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1">Linked Record (Order / Lead / Quote) *</label>
                <input 
                  v-model="form.linkedRecord" 
                  type="text" 
                  placeholder="e.g. ORD-2238 or LD-551" 
                  class="w-full px-3.5 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:border-[#165A31] transition-colors"
                  :class="showValidation && !form.linkedRecord.trim() ? 'border-red-300 bg-red-50/20' : 'border-gray-200'"
                />
                <p v-if="showValidation && !form.linkedRecord.trim()" class="text-[10px] text-red-500 mt-1">Linked record is required</p>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1">Task Type</label>
                <select 
                  v-model="form.taskType"
                  class="w-full px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors cursor-pointer"
                >
                  <option value="Payment Reminder">Payment Reminder / Collection</option>
                  <option value="Lead Inquiry Check">Lead Inquiry & Discussion</option>
                  <option value="Quotation Review">Quotation Follow-up</option>
                  <option value="Post-delivery Check">Post-delivery & Customer Satisfaction</option>
                  <option value="Warranty / Service">Warranty & Service Status</option>
                </select>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Priority</label>
                  <select 
                    v-model="form.priority"
                    class="w-full px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors cursor-pointer"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Channel</label>
                  <select 
                    v-model="form.channel"
                    class="w-full px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors cursor-pointer"
                  >
                    <option value="Phone Call">Phone Call</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Showroom Visit">Showroom Visit</option>
                    <option value="Email">Email</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Right Card -->
            <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
              <h3 class="text-sm font-bold text-gray-900 mb-4">Assignment & Timeline</h3>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Assigned Owner</label>
                  <input 
                    v-model="form.owner" 
                    type="text" 
                    placeholder="e.g. Hamza" 
                    class="w-full px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Branch</label>
                  <input 
                    v-model="form.branch" 
                    type="text" 
                    class="w-full px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-lg text-gray-700"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Due Date</label>
                  <input 
                    v-model="form.dueDate" 
                    type="text" 
                    placeholder="e.g. Today or 18 Sep 2026" 
                    class="w-full px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Due Time</label>
                  <input 
                    v-model="form.dueTime" 
                    type="text" 
                    placeholder="e.g. 11:30 or 14:00" 
                    class="w-full px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1">Follow-up Notes / Instructions</label>
                <textarea 
                  v-model="form.notes" 
                  rows="3" 
                  placeholder="Specify call purpose, outstanding amount or customer questions..." 
                  class="w-full px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors resize-none"
                ></textarea>
              </div>

              <div class="flex items-center gap-2 pt-2">
                <input 
                  id="reminder" 
                  v-model="form.sendReminder" 
                  type="checkbox" 
                  class="w-4 h-4 text-[#165A31] rounded border-gray-300 focus:ring-[#165A31]"
                />
                <label for="reminder" class="text-xs text-gray-700 font-medium cursor-pointer">
                  Send reminder notification to assignee
                </label>
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="flex items-center justify-end gap-3 pt-2">
            <button 
              type="button"
              @click="close" 
              class="bg-white border border-gray-200 text-gray-700 text-xs font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-sm"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="bg-[#165A31] text-white text-xs font-semibold px-5 py-2.5 rounded-lg hover:bg-[#124a28] transition-colors cursor-pointer shadow-sm"
            >
              {{ isEditMode ? 'Update Follow-up' : 'Schedule Follow-up' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
