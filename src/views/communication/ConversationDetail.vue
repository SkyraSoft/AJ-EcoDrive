<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '@/store'
import { ChevronDown, ArrowLeft, Send } from 'lucide-vue-next'

const router = useRouter()
const replyText = ref('')

const conversation = computed(() => {
  return store.selectedConversation || store.conversations[0] || {
    id: 'SR-1048',
    title: 'Stock Request · SR-1048',
    subtitle: 'Peshawar Branch · 5 x BRG DS11',
    linked: 'SR-1048',
    branch: 'Peshawar',
    status: 'Under Review',
    priority: 'High',
    messages: [
      { sender: 'Ahsan Khan', text: 'Need 5 units before the month-end campaign.', time: '10:14' },
      { sender: 'Super Admin', text: 'Checking Islamabad availability now.', time: '10:28' },
      { sender: 'Ahsan Khan', text: 'Thanks. Campaign launches Aug 31.', time: '10:31' }
    ]
  }
})

const sendReply = () => {
  if (!replyText.value.trim()) return

  const now = new Date()
  const timeStr = `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}`

  store.addMessageToConversation(conversation.value.id, {
    sender: 'Super Admin',
    text: replyText.value.trim(),
    time: timeStr
  })

  replyText.value = ''
}

const addInternalNote = () => {
  if (!replyText.value.trim()) return

  const now = new Date()
  const timeStr = `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}`

  store.addMessageToConversation(conversation.value.id, {
    sender: 'Super Admin (Internal Note)',
    text: `[Internal Note] ${replyText.value.trim()}`,
    time: timeStr
  })

  replyText.value = ''
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header & Breadcrumbs -->
    <div>
      <div class="text-[10px] text-gray-500 mb-1 flex items-center gap-1.5">
        <button @click="router.push('/communication/inbox')" class="hover:text-gray-900 transition-colors flex items-center gap-1">
          <ArrowLeft class="w-3 h-3" /> Back
        </button>
        <span>/</span>
        <span>Super Admin</span>
        <span>/</span>
        <span>Communication</span>
        <span>/</span>
        <span>Management Inbox</span>
        <span>/</span>
        <span class="font-bold text-gray-800">Conversation Detail</span>
      </div>
      <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Conversation Detail</h1>
      <p class="text-sm text-gray-500 mt-1">Discuss an operational record without losing business context.</p>
    </div>

    <!-- Header Identity Card -->
    <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-gray-900">{{ conversation.title || `Stock Request · ${conversation.id}` }}</h2>
        <div class="text-xs text-gray-500 font-medium mt-0.5">
          {{ conversation.subtitle || `${conversation.branch} Branch` }}
        </div>
      </div>

      <div class="flex items-center gap-3">
        <span class="px-2.5 py-1 text-[10px] font-bold rounded-md bg-[#eefcf2] text-[#165A31]">
          Open
        </span>

        <button class="px-3.5 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
          Assign
        </button>

        <button class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-1 cursor-pointer">
          More <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
        </button>
      </div>
    </div>

    <!-- 2 Column Layout (Conversation & Linked Record) -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Conversation History (2 cols wide) -->
      <div class="lg:col-span-2 bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <div>
          <h3 class="text-[13px] font-bold text-gray-900 mb-6">Conversation</h3>
          
          <div class="space-y-6">
            <div 
              v-for="(msg, index) in conversation.messages" 
              :key="index" 
              class="flex items-start justify-between gap-4 py-2 border-b border-gray-50 last:border-0"
            >
              <div class="flex-1 space-y-1">
                <div class="text-[11px] font-bold" :class="msg.sender.includes('Super Admin') ? 'text-[#165A31]' : 'text-gray-900'">
                  {{ msg.sender }}
                </div>
                <div class="text-xs text-gray-600 font-normal leading-relaxed">
                  {{ msg.text }}
                </div>
              </div>
              <div class="text-[10px] text-gray-400 font-medium whitespace-nowrap pt-0.5">
                {{ msg.time }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Linked Record Sidebar (1 col wide) -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-6">
        <div>
          <h3 class="text-[13px] font-bold text-gray-900 mb-5">Linked Record</h3>
          
          <div class="space-y-3.5">
            <div class="flex items-center justify-between text-xs py-1 border-b border-gray-50">
              <span class="text-gray-500 font-medium">Record</span>
              <span class="text-gray-900 font-bold">{{ conversation.linked }}</span>
            </div>

            <div class="flex items-center justify-between text-xs py-1 border-b border-gray-50">
              <span class="text-gray-500 font-medium">Branch</span>
              <span class="text-gray-900 font-bold">{{ conversation.branch }}</span>
            </div>

            <div class="flex items-center justify-between text-xs py-1 border-b border-gray-50">
              <span class="text-gray-500 font-medium">Status</span>
              <span class="text-gray-900 font-bold">{{ conversation.status || 'Under Review' }}</span>
            </div>

            <div class="flex items-center justify-between text-xs py-1">
              <span class="text-gray-500 font-medium">Priority</span>
              <span class="text-gray-900 font-bold">{{ conversation.priority || 'High' }}</span>
            </div>
          </div>
        </div>

        <div>
          <button 
            @click="router.push('/inventory/stock-requests')" 
            class="w-full bg-[#165A31] text-white text-[11px] font-bold px-4 py-2.5 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm text-center block cursor-pointer"
          >
            Open {{ conversation.linkedType || 'Stock Request' }}
          </button>
        </div>
      </div>

    </div>

    <!-- Reply Box Container -->
    <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
      <h3 class="text-[13px] font-bold text-gray-900">Reply</h3>
      
      <div class="space-y-2">
        <label class="block text-[11px] font-medium text-gray-600">Message</label>
        <textarea 
          v-model="replyText" 
          rows="3" 
          placeholder="Write a management reply..." 
          class="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] resize-none"
        ></textarea>
      </div>

      <div class="flex items-center justify-end gap-3 pt-2">
        <button 
          @click="addInternalNote" 
          type="button" 
          class="px-5 py-2 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
        >
          Add Internal Note
        </button>

        <button 
          @click="sendReply" 
          type="button" 
          class="px-5 py-2 text-[11px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer"
        >
          Send Reply
        </button>
      </div>
    </div>
  </div>
</template>
