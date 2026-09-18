<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { currentUser, role, logout } from '../authentication'

const router = useRouter()

const logoutError = ref('')
const loggingOut = ref(false)

const handleLogout = () => {
  if (loggingOut.value) return
  loggingOut.value = true
  logoutError.value = ''
  return logout()
    .then(() => router.push('/FireLogin'))
    .catch((error) => {
      console.error(error)
      logoutError.value = 'Logout failed. Please try again.'
    })
    .finally(() => {
      loggingOut.value = false
    })
}
</script>

<template>
  <div class="container">
    <header class="py-3">
      <ul class="nav nav-pills justify-content-center">
        <li class="nav-item">
          <RouterLink to="/" class="nav-link"> Home </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink to="/about" class="nav-link"> About </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink to="/FireLogin" class="nav-link"> Firebase Login </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink to="/FireRegister" class="nav-link"> Firebase Register </RouterLink>
        </li>

        <li v-if="currentUser" class="nav-item">
          <button type="button" class="nav-link" :disabled="loggingOut" @click="handleLogout">
            Logout
          </button>
        </li>
      </ul>
      <p v-if="currentUser" class="text-center mt-3" aria-live="polite">
        { Role: {{ role === 'admin' ? 'Admin' : 'User' }} }
      </p>
      <p v-if="logoutError" class="text-center text-danger" role="alert">{{ logoutError }}</p>
    </header>
  </div>
</template>
