<script setup>
import { ref } from 'vue'
import { CheckCircle2, Shield, Lock, Key, AlertTriangle } from 'lucide-vue-next'

const stats = [
  { label: 'MFA', value: 'Enabled' },
  { label: 'Active Sessions', value: '2' },
  { label: 'Trusted Devices', value: '2' },
  { label: 'Last Password Change', value: 'Jul 22' }
]

const activeSessions = ref([
  { device: 'Chrome · Windows', location: 'Peshawar', started: 'Today 20:11', lastActive: 'Now', action: 'Current', current: true },
  { device: 'Safari · iPhone', location: 'Peshawar', started: 'Aug 26', lastActive: 'Aug 26 20:03', action: 'Revoke', current: false }
])

const loginHistory = ref([
  { time: 'Today 20:11', device: 'Chrome · Windows', location: 'Peshawar', result: 'Success' },
  { time: 'Aug 26 18:42', device: 'Safari · iPhone', location: 'Peshawar', result: 'Success' }
])

const showToast = ref(false)
const toastMessage = ref('')

const revokeSession = (session) => {
  activeSessions.value = activeSessions.value.filter(s => s !== session)
  toastMessage.value = `Session for ${session.device} revoked successfully.`
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3000)
}

const revokeAll = () => {
  activeSessions.value = activeSessions.value.filter(s => s.current)
  toastMessage.value = 'All other active sessions revoked.'
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3000)
}

const triggerAction = (name) => {
  toastMessage.value = `${name} requested.`
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3000)
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Toast Notification -->
    <div 
      v-if="showToast" 
      class="fixed bottom-5 right-5 z-[110] bg-[#165A31] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200"
    >
      <CheckCircle2 class="w-5 h-5 text-green-300" />
      <span class="text-xs font-bold">{{ toastMessage }}</span>
    </div>

    <!-- Header & Breadcrumbs -->
    <div>
      <div class="text-[10px] text-gray-500 mb-1">
        Super Admin / System / <span class="font-bold text-gray-800">Security & Sessions</span>
      </div>
      <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Security & Sessions</h1>
      <p class="text-sm text-gray-500 mt-1">Manage password, MFA, sessions and login history.</p>
    </div>

    <!-- 4 KPI Stats Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div 
        v-for="(stat, idx) in stats" 
        :key="idx"
        class="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-2"
      >
        <div class="text-xs font-medium text-gray-500">{{ stat.label }}</div>
        <div class="text-2xl font-bold text-gray-900 tracking-tight">{{ stat.value }}</div>
      </div>
    </div>

    <!-- 2-Column Grid: Security Controls & Active Sessions -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <!-- Security Controls Card -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-5">
        <h3 class="text-[13px] font-bold text-gray-900">Security Controls</h3>

        <div class="space-y-4">
          <div>
            <button 
              @click="triggerAction('Change Password')"
              class="text-xs font-medium text-gray-800 hover:text-[#165A31] transition-colors cursor-pointer block"
            >
              Change Password
            </button>
          </div>

          <div>
            <button 
              @click="triggerAction('Regenerate Recovery Codes')"
              class="text-xs font-medium text-gray-800 hover:text-[#165A31] transition-colors cursor-pointer block"
            >
              Regenerate Recovery Codes
            </button>
          </div>

          <div class="pt-1">
            <button 
              @click="revokeAll"
              class="border border-red-200 text-red-600 bg-red-50/20 hover:bg-red-50 text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer inline-block"
            >
              Revoke All Sessions
            </button>
          </div>
        </div>
      </div>

      <!-- Active Sessions Card -->
      <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100">
          <h3 class="text-[13px] font-bold text-gray-900">Active Sessions</h3>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th class="px-6 py-3.5">Device</th>
                <th class="px-6 py-3.5">Location</th>
                <th class="px-6 py-3.5">Started</th>
                <th class="px-6 py-3.5">Last Active</th>
                <th class="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="text-[11px]">
              <tr 
                v-for="(session, idx) in activeSessions" 
                :key="idx" 
                class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
              >
                <td class="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">{{ session.device }}</td>
                <td class="px-6 py-4 text-gray-600 font-medium whitespace-nowrap">{{ session.location }}</td>
                <td class="px-6 py-4 text-gray-600 font-medium whitespace-nowrap">{{ session.started }}</td>
                <td class="px-6 py-4 text-gray-600 font-medium whitespace-nowrap">{{ session.lastActive }}</td>
                <td class="px-6 py-4 text-right whitespace-nowrap">
                  <span v-if="session.current" class="text-gray-400 font-medium">
                    Current
                  </span>
                  <button 
                    v-else 
                    @click="revokeSession(session)"
                    class="text-xs font-semibold text-gray-600 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Bottom Full Width Card: Login History -->
    <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100">
        <h3 class="text-[13px] font-bold text-gray-900">Login History</h3>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <th class="px-6 py-3.5">Time</th>
              <th class="px-6 py-3.5">Device</th>
              <th class="px-6 py-3.5">Location</th>
              <th class="px-6 py-3.5 text-right">Result</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr 
              v-for="(item, idx) in loginHistory" 
              :key="idx" 
              class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
            >
              <td class="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">{{ item.time }}</td>
              <td class="px-6 py-4 text-gray-600 font-medium whitespace-nowrap">{{ item.device }}</td>
              <td class="px-6 py-4 text-gray-600 font-medium whitespace-nowrap">{{ item.location }}</td>
              <td class="px-6 py-4 text-right whitespace-nowrap">
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#eefcf2] text-[#165A31]">
                  {{ item.result }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>
