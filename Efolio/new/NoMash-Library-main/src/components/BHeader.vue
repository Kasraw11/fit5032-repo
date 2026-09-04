<script setup>
import { useRouter } from 'vue-router'
import { isAuthenticated, logout } from '../authentication'

const router = useRouter()

const handleLogout = () => {
  logout()
  router.push('/login')
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

        <li v-if="!isAuthenticated" class="nav-item">
          <RouterLink to="/login" class="nav-link"> Login </RouterLink>
        </li>

        <li v-else class="nav-item">
          <button type="button" class="nav-link" @click="handleLogout">Logout</button>
        </li>
      </ul>
    </header>
  </div>
</template>
