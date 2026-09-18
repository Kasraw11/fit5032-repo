import 'bootstrap/dist/css/bootstrap.min.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCBv04TVVWjp4eQcxTyNqDuYcz9zKFUJnI',
  authDomain: 'fit-5032-w6.firebaseapp.com',
  projectId: 'fit-5032-w6',
  storageBucket: 'fit-5032-w6.firebasestorage.app',
  messagingSenderId: '903263033630',
  appId: '1:903263033630:web:79e57083b0349e6174910f'
}

// Initialize Firebase
initializeApp(firebaseConfig)

const app = createApp(App)
app.use(PrimeVue, { theme: { preset: Aura } })
app.use(router)
app.mount('#app')
