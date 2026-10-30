<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { store } from './store.js'

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
  }
})
</script>

<template>
  <RouterView />
</template>
