<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { store } from './store.js'
import { syncCoordinator } from './offline/queue/SyncCoordinator.js'

onMounted(() => {
  if (store.currentUser?.isAuthenticated) {
    store.syncAllWithBackend().catch(err => {
      console.warn('[EcoDrive] Initial remote sync note:', err.message)
    })
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('ecodrive:unauthorized', () => {
      store.logout()
    })

    // Web browser beforeunload reminder for tab closures
    window.addEventListener('beforeunload', (e) => {
      if (syncCoordinator?.state?.pendingCount > 0) {
        e.preventDefault()
        e.returnValue = 'You have pending changes saved locally waiting to synchronize.'
        return e.returnValue
      }
    })
  }
})
</script>

<template>
  <RouterView />
</template>
