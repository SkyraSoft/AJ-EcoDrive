<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { syncCoordinator } from '@/offline/queue/SyncCoordinator.js'
import { Wifi, WifiOff, RefreshCw, CheckCircle2, Clock, AlertTriangle } from 'lucide-vue-next'

const syncState = syncCoordinator.state

const isOnline = computed(() => syncState.isOnline)
const isSyncing = computed(() => syncState.syncStatus === 'syncing')
const pendingCount = computed(() => syncState.pendingCount)
const conflictCount = computed(() => syncState.conflictCount)
const lastSyncTime = computed(() => {
  if (!syncState.lastSyncTime) return 'Never'
  try {
    const d = new Date(syncState.lastSyncTime)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  } catch (e) {
    return 'Recently'
  }
})

const triggerSync = async () => {
  if (isSyncing.value || !isOnline.value) return
  await syncCoordinator.syncNow()
}

onMounted(() => {
  syncCoordinator.init()
  syncCoordinator.startAutoSync(30000)
})

onUnmounted(() => {
  syncCoordinator.stopAutoSync()
})
</script>

<template>
  <div class="sync-status-bar flex flex-wrap items-center justify-between px-4 py-2 text-xs border-b transition-colors"
    :class="[
      !isOnline 
        ? 'bg-amber-500/10 border-amber-500/20 text-amber-900 dark:text-amber-200' 
        : conflictCount > 0
          ? 'bg-orange-500/10 border-orange-500/20 text-orange-900 dark:text-orange-200'
          : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
    ]"
  >
    <!-- Left: Connection & Sync Status -->
    <div class="flex items-center space-x-3">
      <!-- Online/Offline Badge -->
      <span class="inline-flex items-center gap-1.5 font-medium px-2 py-0.5 rounded-full"
        :class="isOnline ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'"
      >
        <component :is="isOnline ? Wifi : WifiOff" class="w-3.5 h-3.5" />
        {{ isOnline ? 'Online' : 'Offline Mode' }}
      </span>

      <!-- Sync Activity State -->
      <span v-if="isSyncing" class="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400 font-medium">
        <RefreshCw class="w-3.5 h-3.5 animate-spin" />
        Syncing changes...
      </span>
      <span v-else-if="pendingCount > 0" class="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 font-medium">
        <Clock class="w-3.5 h-3.5" />
        {{ pendingCount }} change{{ pendingCount === 1 ? '' : 's' }} queued locally
      </span>
      <span v-else class="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
        <CheckCircle2 class="w-3.5 h-3.5 text-emerald-500" />
        All changes synchronized
      </span>

      <!-- Conflict Warning Banner -->
      <span v-if="conflictCount > 0" class="inline-flex items-center gap-1 text-red-600 dark:text-red-400 font-semibold px-2 py-0.5 bg-red-100 dark:bg-red-950/60 rounded">
        <AlertTriangle class="w-3.5 h-3.5" />
        {{ conflictCount }} conflict{{ conflictCount === 1 ? '' : 's' }} require review
      </span>
    </div>

    <!-- Right: Last Synced Time & Manual Trigger Button -->
    <div class="flex items-center space-x-3 mt-1 sm:mt-0">
      <span class="text-[11px] opacity-75">
        Last sync: {{ lastSyncTime }}
      </span>

      <button 
        type="button"
        @click="triggerSync"
        :disabled="isSyncing || !isOnline"
        class="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium border transition-colors shadow-sm focus:outline-none"
        :class="[
          isOnline && !isSyncing
            ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
            : 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800 border-transparent text-slate-400'
        ]"
      >
        <RefreshCw class="w-3 h-3" :class="{ 'animate-spin': isSyncing }" />
        {{ isSyncing ? 'Syncing...' : 'Sync Now' }}
      </button>
    </div>
  </div>
</template>
