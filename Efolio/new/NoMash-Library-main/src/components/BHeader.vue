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

        <li class="nav-item">
          <RouterLink to="/FireLogin" class="nav-link"> Firebase Login </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink to="/FireRegister" class="nav-link"> Firebase Register </RouterLink>
        </li>
      </ul>
    </header>
  </div>
</template>
