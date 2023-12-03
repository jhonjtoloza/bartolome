import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import type { ToastContainerOptions } from 'vue3-toastify'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(Vue3Toastify, {
  autoClose: 2500,
  position: 'top-right',
  pauseOnHover: true
} as ToastContainerOptions)
app.use(createPinia())
app.use(router)

app.mount('#app')
