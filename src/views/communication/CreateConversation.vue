<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '@/store'
import { X, Send } from 'lucide-vue-next'

const props = defineProps({
  isModal: {
    type: Boolean,
    default: true
  },
  conversation: {
    type: Object,
    default: null
  }
})

const router = useRouter()
const emit = defineEmits(['close', 'created', 'updated'])
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const isEditMode = ref(false)
const showValidation = ref(false)

const form = ref({
  id: '',
  title: '',
  linkedType: 'Stock Request',
  linked: 'SR-122',
  recipient: 'Super Admin',
  priority: 'Medium',
  message: '',
  attachment: '',
  branch: user.value?.branchName || 'Peshawar'
})

const loadData = (data) => {
  if (!data) return
  isEditMode.value = true
  form.value = {
    ...form.value,
    id: data.id || form.value.id,
    title: data.title || data.thread || form.value.title,
    linkedType: data.linkedType || form.value.linkedType,
    linked: data.linked || form.value.linked,
    recipient: data.from || form.value.recipient,
    priority: data.priority || form.value.priority,
    message: data.lastMsg || data.message || form.value.message,
    attachment: data.attachment || form.value.attachment,
    branch: data.branch || form.value.branch
  }
}

onMounted(() => {
  if (props.conversation) {
    loadData(props.conversation)
  }
})

watch(() => props.conversation, (newVal) => {
  if (newVal) loadData(newVal)
}, { immediate: true })

const close = () => {
  emit('close')
  if (router.currentRoute.value.path.includes('/create')) {
    router.push('/communication/inbox')
  }
}

const submitForm = () => {
  if (!form.value.title.trim()) {
    showValidation.value = true
    return
  }

  const now = new Date()
  const timeStr = `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}`

  if (isEditMode.value) {
    const updatedConv = {
      ...form.value,
      lastMsg: form.value.message || 'Updated thread',
      priorityClass: form.value.priority === 'High' ? 'bg-[#fff7ed] text-[#ea580c]' : 'bg-blue-50 text-blue-700'
    }
    const idx = store.conversations.findIndex(c => c.id === form.value.id)
    if (idx !== -1) {
      store.conversations[idx] = { ...store.conversations[idx], ...updatedConv }
    }
    emit('updated', updatedConv)
    close()
    return
  }

  const newId = form.value.linked ? `${form.value.linked}-CONV` : `CONV-${Math.floor(100 + Math.random() * 900)}`
  const newConv = {
    id: newId,
    title: form.value.title.trim(),
    subtitle: `Conversation — ${form.value.title.trim()}`,
    thread: form.value.title.trim(),
    branch: form.value.branch,
    linked: form.value.linked ? form.value.linked.trim() : 'General',
    linkedType: form.value.linkedType,
    from: isBranchUser.value ? form.value.recipient : 'Super Admin',
    recipient: form.value.recipient,
    lastMsg: form.value.message || 'New conversation started',
    priority: form.value.priority,
    priorityClass: form.value.priority === 'High' ? 'bg-[#fff7ed] text-[#ea580c]' : 'bg-blue-50 text-blue-700',
    unread: 0,
    status: 'Open',
    statusClass: 'bg-[#dcfce7] text-[#15803d]',
    participants: isBranchUser.value ? `Branch Manager, ${form.value.recipient}` : `Super Admin, ${form.value.recipient}`,
    lastReply: `Today ${timeStr}`,
    message: form.value.message || form.value.title,
    attachment: form.value.attachment || 'document.pdf',
    owner: isBranchUser.value ? 'Branch Manager' : 'Super Admin',
    created: 'Just now',
    replies: 1,
    messages: [
      {
        sender: isBranchUser.value ? 'Branch Manager' : 'Super Admin',
        text: form.value.message || `Started thread regarding ${form.value.title}`,
        time: `Today ${timeStr}`
      }
    ]
  }

  const created = store.addConversation(newConv)
  store.selectConversation(created)
  emit('created', created)
  close()
}
</script>

<template>
  <div class="fixed inset-0 bg-gray-900/50 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm" @click.self="close">
    <!-- Close button on top-right of screen overlay -->
    <button @click="close" class="fixed top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-100 rounded-full z-[110] shadow-lg transition-colors cursor-pointer">
      <X class="w-5 h-5" />
    </button>

    <!-- Modal Card -->
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">
      <!-- Scrollable Body -->
      <div class="flex-1 overflow-y-auto p-6 sm:p-8">
        <div class="space-y-6">
          <!-- Header -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            <div>
              <div class="text-[11px] text-gray-400 mb-1">
                Branch Manager / Management Inbox / <span class="font-medium text-gray-600">{{ isEditMode ? 'Edit Conversation' : 'New Conversation' }}</span>
              </div>
              <h1 class="text-[32px] tracking-tight font-bold text-gray-900">{{ isEditMode ? 'Edit Conversation' : 'Start Conversation' }}</h1>
              <p class="text-xs text-gray-500 mt-1">Start an operational thread with Super Admin and head office management.</p>
            </div>
          </div>

          <!-- Form Grid (2 Columns) -->
          <form @submit.prevent="submitForm" class="space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              
              <!-- Left Card: Conversation Subject & Linked Context -->
              <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
                <h3 class="text-sm font-bold text-gray-900 mb-4">Topic & Linked Record</h3>
                
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Conversation Title / Subject *</label>
                  <input 
                    v-model="form.title" 
                    type="text" 
                    placeholder="e.g. Stock request clarification" 
                    class="w-full px-3.5 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 transition-colors bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
                    :class="showValidation && !form.title.trim() ? 'border-red-300 bg-red-50/20 focus:ring-red-400 focus:border-red-400' : 'border-gray-200 focus:ring-[#165A31] focus:border-[#165A31]'"
                  />
                  <p v-if="showValidation && !form.title.trim()" class="text-[10px] text-red-500 font-medium mt-1">Conversation title is required</p>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Linked Type</label>
                    <select 
                      v-model="form.linkedType" 
                      class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
                    >
                      <option value="Stock Request">Stock Request</option>
                      <option value="Expense">Expense</option>
                      <option value="Warranty Case">Warranty Case</option>
                      <option value="Customer Order">Customer Order</option>
                      <option value="Transfer">Transfer</option>
                      <option value="General">General Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Linked Record ID</label>
                    <input 
                      v-model="form.linked" 
                      type="text" 
                      placeholder="e.g. SR-122" 
                      class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)]" 
                    />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Recipient</label>
                    <select 
                      v-model="form.recipient" 
                      class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
                    >
                      <option value="Super Admin">Super Admin</option>
                      <option value="Head Office Operations">Operations Team</option>
                      <option value="Finance">Finance Department</option>
                      <option value="Central Warehouse">Central Warehouse</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Priority</label>
                    <select 
                      v-model="form.priority" 
                      class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Right Card: Initial Message & Attachment -->
              <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
                <h3 class="text-sm font-bold text-gray-900 mb-4">Message & Documents</h3>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Initial Message / Context</label>
                  <textarea 
                    v-model="form.message" 
                    rows="4" 
                    placeholder="Provide details or questions regarding the linked operational record..."
                    class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)] resize-none"
                  ></textarea>
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Attachment File</label>
                  <input 
                    v-model="form.attachment" 
                    type="text" 
                    placeholder="e.g. customer_requirement.pdf" 
                    class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)]" 
                  />
                </div>
              </div>

            </div>

            <!-- Actions Bar -->
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button 
                type="button" 
                @click="close" 
                class="px-5 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="px-5 py-2 text-[11px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05)] cursor-pointer flex items-center gap-1.5"
              >
                <Send class="w-3.5 h-3.5" /> {{ isEditMode ? 'Update Thread' : 'Start Thread' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
