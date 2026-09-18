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

        <li class="nav-item">
          <RouterLink to="/FireLogin" class="nav-link"> Firebase Login </RouterLink>
        </li>
      </ul>
    </header>
  </div>
</template>
