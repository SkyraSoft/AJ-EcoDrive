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

    // Web browser close protection
    window.addEventListener('beforeunload', (e) => {
      if (syncCoordinator?.state?.pendingCount > 0) {
        e.preventDefault()
        e.returnValue = 'You have pending changes saved locally waiting to synchronize.'
        return e.returnValue
      }
    })

    // Tauri Desktop safe close protection
    if (window.__TAURI_INTERNALS__ || window.__TAURI__) {
      import('@tauri-apps/api/window').then(({ getCurrentWindow }) => {
        const appWindow = getCurrentWindow()
        appWindow.onCloseRequested(async (event) => {
          if (syncCoordinator?.state?.pendingCount > 0) {
            // Attempt fast online sync before closing
            if (syncCoordinator?.state?.isOnline) {
              try {
                await syncCoordinator.syncNow()
              } catch (err) {
                // Ignore sync errors during close
              }
            }

            if (syncCoordinator?.state?.pendingCount > 0) {
              const proceed = window.confirm(
                `You have ${syncCoordinator.state.pendingCount} pending offline change(s) queued. ` +
                `All changes are durably saved locally and will resume synchronization on next launch. ` +
                `Close AJ EcoDrive ERP now?`
              )
              if (!proceed) {
                event.preventDefault()
              }
            }
          }
        })
      }).catch(err => {
        console.warn('[EcoDrive] Tauri window close handler registration note:', err?.message)
      })
    }
  }
})
</script>

<template>
  <RouterView />
</template>
