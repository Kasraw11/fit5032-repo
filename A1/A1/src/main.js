import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './assets/main.css'
import './firebase/init'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initializeFirebaseAuth } from './authentication'

initializeFirebaseAuth()

const app = createApp(App)

app.use(router)
app.mount('#app')
