import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

import { dapStore } from './stores/dapStore.js'
import { store } from './store.js'

if (typeof window !== 'undefined') {
  window.dapStore = dapStore
  window.store = store
  window.router = router
}

const app = createApp(App)

app.use(router)

app.mount('#app')
