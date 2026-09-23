<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { store } from '@/store'
import { 
  ChevronDown, 
  ArrowLeft, 
  Send, 
  Paperclip, 
  FileText, 
  Download, 
  Eye, 
  User, 
  CheckCircle2, 
  Building2, 
  ShieldCheck, 
  Plus, 
  X,
  FileCheck,
  Users,
  ExternalLink
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

// Find active conversation from store or route query
const conversation = computed(() => {
  const paramId = route.params.id || route.query.id
  if (paramId) {
    const found = store.getConversationById(paramId) || (store.conversations || []).find(c => c.id === paramId || c.linked === paramId)
    if (found) return found
  }
  if (store.selectedConversation) return store.selectedConversation
  return (store.conversations && store.conversations[0]) || {
    id: 'SR-122',
    title: 'Inter-Branch Stock Transfer Coordination',
    subtitle: 'Conversation — Stock Request SR-122 (Peshawar & Lahore)',
    thread: 'Inter-Branch Stock Transfer Coordination',
    branch: 'Peshawar',
    linked: 'SR-122',
    linkedType: 'Stock Request',
    from: 'Super Admin',
    lastMsg: 'Lahore dispatch authorized for 5x BRG E-125 units via Carrier TR-401.',
    priority: 'High',
    status: 'Open',
    participants: 'Ahsan Khan (Peshawar), Sami Ullah (Lahore), Super Admin (Head Office)',
    lastReply: 'Today 11:42',
    owner: 'Branch Manager (Peshawar)',
    created: 'Yesterday',
    replies: 4,
    messages: []
  }
})

// Unified Tabs
const currentTab = ref('Thread')
const tabs = ['Thread', 'Attachments', 'Linked Record', 'Participants']

// Toast State
const showToast = ref(false)
const toastMessage = ref('')

const triggerToast = (msg) => {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3500)
}

// ----------------------------------------------------
// DYNAMIC ATTACHMENTS (TABLE FORMAT WITH DUMMY DOWNLOAD)
// ----------------------------------------------------
const conversationAttachments = computed(() => {
  const conv = conversation.value
  if (conv?.attachments && conv.attachments.length > 0) {
    return conv.attachments
  }
  // Default mock attachments for demo realism
  return [
    {
      id: 'att-101',
      name: conv?.attachment || 'customer_requirement_sr122.pdf',
      size: '245 KB',
      type: 'Adobe PDF Document',
      uploadedBy: 'Ahsan Khan (Branch Manager — Peshawar)',
      branch: 'Peshawar',
      date: 'Yesterday 09:30 AM',
      scope: 'Customer Booking Evidence'
    },
    {
      id: 'att-102',
      name: 'signed_sales_order_ORD2241.pdf',
      size: '512 KB',
      type: 'Adobe PDF Document',
      uploadedBy: 'Ahsan Khan (Branch Manager — Peshawar)',
      branch: 'Peshawar',
      date: 'Yesterday 10:15 AM',
      scope: 'Advance Deposit Clearance'
    },
    {
      id: 'att-103',
      name: 'lahore_transfer_dispatch_slip.pdf',
      size: '380 KB',
      type: 'Adobe PDF Document',
      uploadedBy: 'Sami Ullah (Branch Manager — Lahore)',
      branch: 'Lahore',
      date: 'Today 10:45 AM',
      scope: 'Inter-Branch Stock Dispatch Slip'
    },
    {
      id: 'att-104',
      name: 'hq_allocation_approval_memo.pdf',
      size: '185 KB',
      type: 'Adobe PDF Document',
      uploadedBy: 'Super Admin (Head Office)',
      branch: 'All Branches',
      date: 'Today 11:30 AM',
      scope: 'Executive Transfer Authorization'
    }
  ]
})

const downloadAttachment = (att) => {
  triggerToast(`Downloading ${att.name} (${att.size} - Simulated Document)...`)
}

const previewAttachment = (att) => {
  triggerToast(`Opening preview for ${att.name} · Shared by ${att.uploadedBy}`)
}

// Upload Attachment Modal
const showUploadModal = ref(false)
const uploadForm = ref({
  name: '',
  scope: 'Customer Booking Evidence',
  size: '320 KB'
})

const submitAttachmentUpload = () => {
  if (!uploadForm.value.name.trim()) return

  const branchName = user.value?.branchName || (isBranchUser.value ? 'Peshawar' : 'Head Office')
  const uploader = isBranchUser.value 
    ? `${user.value?.name || 'Branch Manager'} (Branch Manager — ${branchName})` 
    : 'Super Admin (Head Office Operations)'

  store.addAttachmentToConversation(conversation.value.id, {
    name: uploadForm.value.name.trim().endsWith('.pdf') ? uploadForm.value.name.trim() : `${uploadForm.value.name.trim()}.pdf`,
    size: uploadForm.value.size || '320 KB',
    type: 'Adobe PDF Document',
    uploadedBy: uploader,
    branch: branchName,
    date: 'Just now',
    scope: uploadForm.value.scope
  })

  // Post reference message in conversation
  store.addMessageToConversation(conversation.value.id, {
    sender: uploader,
    role: branchName,
    branch: branchName,
    text: `📎 Attached document: ${uploadForm.value.name.trim()} (${uploadForm.value.scope})`,
    time: 'Just now'
  })

  uploadForm.value.name = ''
  showUploadModal.value = false
  triggerToast(`Document attached to conversation successfully!`)
}

// ----------------------------------------------------
// MULTI-BRANCH PARTICIPANTS LIST
// ----------------------------------------------------
const conversationParticipants = computed(() => {
  const conv = conversation.value
  if (conv?.participantsList && conv.participantsList.length > 0) {
    return conv.participantsList
  }
  const branchName = user.value?.branchName || conv?.branch || 'Peshawar'
  return [
    { name: 'Ahsan Khan', role: 'Branch Manager', branch: 'Peshawar', branch_id: 'BR-01', scope: 'Originating Showroom' },
    { name: 'Sami Ullah', role: 'Branch Manager', branch: 'Lahore', branch_id: 'BR-03', scope: 'Regional Stock Contributor' },
    { name: 'Super Admin', role: 'Head Office Executive', branch: 'All Branches', branch_id: 'HQ', scope: 'Authorizing Lead' },
    { name: 'Tariq Mehmood', role: 'Logistics Coordinator', branch: 'Central Warehouse', branch_id: 'CWH', scope: 'Carrier Fleet Dispatch' }
  ]
})

// Dynamic Sender Badge Helper for Multi-Branch Messages
const getSenderBadge = (msg) => {
  const s = `${msg.sender || ''} ${msg.from || ''} ${msg.role || ''} ${msg.branch || ''}`.toLowerCase()
  if (s.includes('peshawar')) return { text: 'Peshawar Showroom', class: 'bg-[#dcfce7] text-[#165A31] border border-emerald-200' }
  if (s.includes('lahore')) return { text: 'Lahore Showroom', class: 'bg-blue-50 text-blue-700 border border-blue-200' }
  if (s.includes('islamabad')) return { text: 'Islamabad Showroom', class: 'bg-amber-50 text-amber-700 border border-amber-200' }
  if (s.includes('rawalpindi')) return { text: 'Rawalpindi Showroom', class: 'bg-teal-50 text-teal-700 border border-teal-200' }
  if (s.includes('finance')) return { text: 'Finance Operations', class: 'bg-indigo-50 text-indigo-700 border border-indigo-200' }
  if (s.includes('customer')) return { text: 'Customer Direct', class: 'bg-emerald-50 text-emerald-800 border border-emerald-200' }
  return { text: 'Head Office Executive', class: 'bg-purple-50 text-purple-700 border border-purple-200' }
}

// Dynamic Navigation to Linked Operational Record
const openLinkedRecord = (conv) => {
  if (!conv) return
  const linked = conv.linked || ''
  const linkedType = (conv.linkedType || '').toLowerCase()

  if (linkedType.includes('stock') || linked.startsWith('SR')) {
    router.push('/inventory/stock-requests')
  } else if (linkedType.includes('expense') || linked.startsWith('EXP')) {
    router.push('/finance/expenses')
  } else if (linkedType.includes('warranty') || linkedType.includes('service') || linked.startsWith('WAR') || linked.startsWith('SC') || linked.startsWith('RJ')) {
    router.push('/after-sales/repairs')
  } else if (linkedType.includes('order') || linked.startsWith('ORD') || linked.startsWith('SO')) {
    router.push('/sales/orders')
  } else if (linkedType.includes('purchase') || linked.startsWith('PO')) {
    router.push('/inventory/purchase-orders')
  } else if (linkedType.includes('transfer') || linked.startsWith('TR')) {
    router.push('/inventory/transfers')
  } else {
    router.push('/inventory/stock-requests')
  }
}

// Reply Submission
const replyText = ref('')

const sendReply = () => {
  if (!replyText.value.trim()) return

  const branchName = user.value?.branchName || (isBranchUser.value ? 'Peshawar' : 'Head Office')
  const senderName = isBranchUser.value 
    ? `${user.value?.name || 'Branch Manager'} (Branch Manager — ${branchName})` 
    : 'Super Admin (Head Office Operations)'

  store.addMessageToConversation(conversation.value.id, {
    sender: senderName,
    role: branchName,
    branch: branchName,
    text: replyText.value.trim()
  })

  replyText.value = ''
  triggerToast('Reply dispatched across multi-branch thread successfully!')
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12 animate-in fade-in duration-200">
    
    <!-- Toast Notification -->
    <div 
      v-if="showToast" 
      class="fixed bottom-6 right-6 z-50 bg-[#165A31] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300"
    >
      <CheckCircle2 class="w-5 h-5 text-emerald-300" />
      <span class="text-xs font-semibold">{{ toastMessage }}</span>
    </div>

    <!-- Header & Breadcrumbs -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <div class="text-[11px] text-gray-500 mb-1 flex items-center gap-2">
          <button @click="router.push('/communication/inbox')" class="hover:text-gray-900 transition-colors flex items-center gap-1 cursor-pointer">
            <ArrowLeft class="w-3.5 h-3.5" /> Back to Management Inbox
          </button>
          <span>/</span>
          <span v-if="isBranchUser">Branch Manager</span>
          <span v-else>Super Admin</span>
          <span>/</span>
          <span class="font-bold text-gray-800">{{ conversation.title }}</span>
        </div>

        <div class="flex items-center gap-3">
          <h1 class="text-[26px] sm:text-[30px] tracking-tight font-bold text-gray-900">
            {{ conversation.title }}
          </h1>
          <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#eefcf2] text-[#165A31]">
            {{ conversation.status || 'Open' }}
          </span>
          <span class="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            Priority: {{ conversation.priority || 'High' }}
          </span>
        </div>

        <p class="text-xs text-gray-500 mt-1">
          Multi-Branch Coordination · Linked Record: <strong class="text-gray-700">{{ conversation.linked }}</strong> ({{ conversation.linkedType || 'Stock Request' }}) · Showrooms: {{ conversation.participants }}
        </p>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex items-center gap-2.5 flex-wrap">
        <button 
          @click="showUploadModal = true" 
          class="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
        >
          <Paperclip class="w-3.5 h-3.5 text-[#165A31]" />
          Attach File
        </button>

        <button 
          @click="openLinkedRecord(conversation)" 
          class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#165A31] hover:bg-[#124a28] rounded-lg transition-colors shadow-sm cursor-pointer"
        >
          <ExternalLink class="w-3.5 h-3.5 text-white" />
          View {{ conversation.linkedType || 'Record' }}
        </button>
      </div>
    </div>

    <!-- Navigation Tabs Bar -->
    <div class="border-b border-gray-200 flex items-center gap-6 overflow-x-auto pb-1">
      <button 
        v-for="tab in tabs" 
        :key="tab"
        @click="currentTab = tab"
        class="pb-3 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer relative"
        :class="currentTab === tab ? 'text-[#165A31] font-bold' : 'text-gray-400 hover:text-gray-700'"
      >
        {{ tab }}
        <span 
          v-if="tab === 'Attachments'" 
          class="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-[#165A31] font-bold"
        >
          {{ conversationAttachments.length }}
        </span>
        <span 
          v-if="tab === 'Participants'" 
          class="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-blue-700 font-bold"
        >
          {{ conversationParticipants.length }}
        </span>
        <div v-if="currentTab === tab" class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#165A31] rounded-t-full"></div>
      </button>
    </div>

    <!-- TAB 1: THREAD (Conversation Messages & Thread Summary) -->
    <div v-if="currentTab === 'Thread'" class="space-y-6">
      
      <!-- Thread Information Banner -->
      <div class="p-4 bg-gray-50/80 border border-gray-100 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-emerald-100 text-[#165A31] flex items-center justify-center font-bold text-xs">
            HQ
          </div>
          <div>
            <p class="text-xs font-bold text-gray-900">Multi-Branch Thread Coordination</p>
            <p class="text-[11px] text-gray-500">
              Showroom branches involved: 
              <span class="font-semibold text-gray-800">Peshawar (Requester)</span>, 
              <span class="font-semibold text-gray-800">Lahore (Supplier)</span>, and 
              <span class="font-semibold text-[#165A31]">Head Office Operations</span>
            </p>
          </div>
        </div>
        <div class="text-[11px] text-gray-400 font-medium">
          {{ (conversation.messages || []).length }} messages recorded in this audit thread
        </div>
      </div>

      <!-- Messages Timeline Stream -->
      <div class="bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">
        <h3 class="text-sm font-bold text-gray-900 mb-2">Conversation Messages</h3>

        <div class="space-y-3.5">
          <div 
            v-for="(msg, idx) in conversation.messages" 
            :key="msg.id || idx"
            class="p-4 rounded-xl border transition-colors"
            :class="msg.sender.includes('Head Office') || msg.sender.includes('Super Admin') 
              ? 'bg-purple-50/20 border-purple-100/60' 
              : (msg.sender.includes('Lahore') ? 'bg-blue-50/20 border-blue-100/60' : 'bg-gray-50/70 border-gray-100')"
          >
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs font-bold text-gray-900">{{ msg.sender || msg.from }}</span>
                <span :class="['px-2 py-0.5 rounded text-[10px] font-bold', getSenderBadge(msg).class]">
                  {{ getSenderBadge(msg).text }}
                </span>
              </div>
              <span class="text-[10px] text-gray-400 font-medium whitespace-nowrap">{{ msg.time || msg.date || 'Recent' }}</span>
            </div>

            <p class="text-xs text-gray-700 leading-relaxed font-normal">
              {{ msg.text || msg.body }}
            </p>
          </div>
        </div>

        <!-- Reply Input Box -->
        <div class="pt-5 border-t border-gray-100 space-y-3">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-bold text-gray-700">Reply to Multi-Branch Thread</label>
            <span class="text-[11px] text-gray-400">
              Sending as: 
              <strong class="text-gray-700">
                {{ isBranchUser ? `${user?.name || 'Branch Manager'} (${user?.branchName || 'Peshawar'})` : 'Super Admin (Head Office)' }}
              </strong>
            </span>
          </div>

          <textarea 
            v-model="replyText" 
            rows="3" 
            placeholder="Write your update or reply... (visible to all participating showroom managers and Head Office)" 
            class="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors shadow-sm resize-none"
            @keyup.enter.exact.prevent="sendReply"
          ></textarea>

          <div class="flex items-center justify-between">
            <button 
              @click="showUploadModal = true"
              type="button"
              class="text-xs font-bold text-[#165A31] hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <Paperclip class="w-3.5 h-3.5" /> Attach Document
            </button>

            <button 
              @click="sendReply" 
              class="px-5 py-2 text-xs font-bold text-white bg-[#165A31] hover:bg-[#124a28] rounded-lg transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <Send class="w-3.5 h-3.5" /> Send Reply
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: ATTACHMENTS (PROPER TABLE FORMAT AS REQUESTED) -->
    <div v-if="currentTab === 'Attachments'" class="bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      
      <!-- Table Header & Actions -->
      <div class="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Paperclip class="w-4 h-4 text-[#165A31]" />
            Attached Documents & Verification Records ({{ conversationAttachments.length }})
          </h3>
          <p class="text-xs text-gray-500 mt-0.5">
            Official operational documents, signed booking forms, transfer dispatch slips, and approval memos.
          </p>
        </div>

        <button 
          @click="showUploadModal = true" 
          class="px-3.5 py-1.5 text-xs font-bold text-white bg-[#165A31] hover:bg-[#124a28] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <Plus class="w-3.5 h-3.5" /> Upload Attachment
        </button>
      </div>

      <!-- Attachments Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-gray-50/80 border-b border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              <th class="px-5 py-3">Document Name</th>
              <th class="px-5 py-3">Shared / Uploaded By</th>
              <th class="px-5 py-3">Date & Time</th>
              <th class="px-5 py-3">File Size & Format</th>
              <th class="px-5 py-3">Operational Purpose</th>
              <th class="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="text-xs divide-y divide-gray-50">
            <tr 
              v-for="att in conversationAttachments" 
              :key="att.id" 
              class="hover:bg-gray-50/50 transition-colors"
            >
              <!-- Document Name -->
              <td class="px-5 py-4 font-bold text-gray-900">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded bg-red-50 text-red-600 flex items-center justify-center font-bold text-[10px]">
                    PDF
                  </div>
                  <div>
                    <p class="text-xs font-bold text-gray-900 hover:text-[#165A31] transition-colors cursor-pointer" @click="previewAttachment(att)">
                      {{ att.name }}
                    </p>
                    <span class="text-[10px] text-gray-400 font-normal">Secure Hash Verified</span>
                  </div>
                </div>
              </td>

              <!-- Uploaded By & Branch -->
              <td class="px-5 py-4">
                <p class="text-xs font-semibold text-gray-800">{{ att.uploadedBy }}</p>
                <span class="inline-block mt-0.5 px-2 py-0.2 rounded text-[10px] font-bold bg-gray-100 text-gray-600">
                  {{ att.branch || 'Peshawar' }}
                </span>
              </td>

              <!-- Date & Time -->
              <td class="px-5 py-4 text-gray-600 font-medium">
                {{ att.date }}
              </td>

              <!-- File Size -->
              <td class="px-5 py-4 text-gray-600">
                <span class="font-semibold text-gray-800">{{ att.size }}</span> · {{ att.type }}
              </td>

              <!-- Scope / Purpose -->
              <td class="px-5 py-4">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#eff6ff] text-[#2563eb]">
                  {{ att.scope }}
                </span>
              </td>

              <!-- Action Buttons -->
              <td class="px-5 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button 
                    @click="previewAttachment(att)" 
                    class="px-2.5 py-1 text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded transition-colors flex items-center gap-1 cursor-pointer"
                    title="View Document Details"
                  >
                    <Eye class="w-3.5 h-3.5 text-gray-500" /> Preview
                  </button>
                  <button 
                    @click="downloadAttachment(att)" 
                    class="px-2.5 py-1 text-xs font-bold text-[#165A31] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors flex items-center gap-1 cursor-pointer"
                    title="Download File"
                  >
                    <Download class="w-3.5 h-3.5 text-[#165A31]" /> Download
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="conversationAttachments.length === 0" class="p-12 text-center text-gray-400 text-xs">
        No documents attached to this conversation yet.
      </div>
    </div>

    <!-- TAB 3: LINKED RECORD TAB -->
    <div v-if="currentTab === 'Linked Record'" class="bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-6">
      <div class="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h3 class="text-sm font-bold text-gray-900">Linked Business Record Details</h3>
          <p class="text-xs text-gray-500 mt-0.5">This conversation is formally linked to operational transactions in the system.</p>
        </div>
        <button 
          @click="openLinkedRecord(conversation)" 
          class="px-3.5 py-1.5 text-xs font-bold text-white bg-[#165A31] hover:bg-[#124a28] rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-sm"
        >
          Open {{ conversation.linkedType || 'Record' }} &rarr;
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div class="p-4 bg-gray-50/70 border border-gray-100 rounded-lg">
          <span class="text-[10px] font-medium text-gray-400">Record Type</span>
          <p class="text-xs font-bold text-gray-900 mt-1">{{ conversation.linkedType || 'Stock Request' }}</p>
        </div>
        <div class="p-4 bg-gray-50/70 border border-gray-100 rounded-lg">
          <span class="text-[10px] font-medium text-gray-400">Record Identifier</span>
          <p class="text-xs font-bold text-[#165A31] mt-1">{{ conversation.linked }}</p>
        </div>
        <div class="p-4 bg-gray-50/70 border border-gray-100 rounded-lg">
          <span class="text-[10px] font-medium text-gray-400">Originating Branch</span>
          <p class="text-xs font-bold text-gray-900 mt-1">{{ conversation.branch || 'Peshawar' }} Showroom</p>
        </div>
        <div class="p-4 bg-gray-50/70 border border-gray-100 rounded-lg">
          <span class="text-[10px] font-medium text-gray-400">Quantity / Units</span>
          <p class="text-xs font-bold text-gray-900 mt-1">5 x BRG E-125 Electric Scooters</p>
        </div>
        <div class="p-4 bg-gray-50/70 border border-gray-100 rounded-lg">
          <span class="text-[10px] font-medium text-gray-400">Transfer Carrier</span>
          <p class="text-xs font-bold text-gray-900 mt-1">Truck TR-401 (Lahore to Peshawar)</p>
        </div>
        <div class="p-4 bg-gray-50/70 border border-gray-100 rounded-lg">
          <span class="text-[10px] font-medium text-gray-400">Operational Status</span>
          <p class="text-xs font-bold text-emerald-700 mt-1">Dispatched / In Transit</p>
        </div>
      </div>
    </div>

    <!-- TAB 4: PARTICIPANTS TAB -->
    <div v-if="currentTab === 'Participants'" class="bg-white border border-gray-100 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-6">
      <div>
        <h3 class="text-sm font-bold text-gray-900">Multi-Branch Thread Participants</h3>
        <p class="text-xs text-gray-500 mt-0.5">Managers and executives authorized to read and participate in this thread.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div 
          v-for="p in conversationParticipants" 
          :key="p.name"
          class="p-4 border border-gray-100 rounded-xl bg-gray-50/60 flex items-start gap-3.5"
        >
          <div class="w-10 h-10 rounded-full bg-[#165A31] text-white flex items-center justify-center font-bold text-xs shrink-0">
            {{ p.name.split(' ').map(n => n[0]).join('') }}
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-bold text-gray-900">{{ p.name }}</h4>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700">
                {{ p.branch }}
              </span>
            </div>
            <p class="text-xs text-gray-600 mt-0.5">{{ p.role }}</p>
            <p class="text-[11px] font-semibold text-[#165A31] mt-1.5 flex items-center gap-1">
              <ShieldCheck class="w-3 h-3" /> Scope: {{ p.scope }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- UPLOAD ATTACHMENT MODAL -->
    <div 
      v-if="showUploadModal" 
      class="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      @click.self="showUploadModal = false"
    >
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-5 animate-in zoom-in-95 duration-200">
        <div class="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Paperclip class="w-4 h-4 text-[#165A31]" />
            Upload Document Attachment
          </h3>
          <button @click="showUploadModal = false" class="text-gray-400 hover:text-gray-600 cursor-pointer">
            <X class="w-4 h-4" />
          </button>
        </div>

        <form @submit.prevent="submitAttachmentUpload" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Document / File Name *</label>
            <input 
              v-model="uploadForm.name" 
              type="text" 
              placeholder="e.g. transfer_dispatch_receipt.pdf" 
              class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors"
              required
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Operational Purpose / Scope</label>
            <select 
              v-model="uploadForm.scope" 
              class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors"
            >
              <option value="Customer Booking Evidence">Customer Booking Evidence</option>
              <option value="Inter-Branch Dispatch Slip">Inter-Branch Dispatch Slip</option>
              <option value="Physical PDI Inspection Checklist">Physical PDI Inspection Checklist</option>
              <option value="Executive Management Sign-off">Executive Management Sign-off</option>
              <option value="Verified Payment Receipt">Verified Payment Receipt</option>
              <option value="Technical Diagnostic Report">Technical Diagnostic Report</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Simulated File Size</label>
            <input 
              v-model="uploadForm.size" 
              type="text" 
              placeholder="e.g. 380 KB" 
              class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors"
            />
          </div>

          <div class="flex items-center justify-end gap-2.5 pt-2">
            <button 
              type="button" 
              @click="showUploadModal = false" 
              class="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="px-5 py-2 text-xs font-bold text-white bg-[#165A31] hover:bg-[#124a28] rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              Attach File
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>
