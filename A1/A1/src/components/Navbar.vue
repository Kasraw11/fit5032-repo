<template>
  <nav class="navbar navbar-expand-lg smartloop-navbar">
    <div class="container">
      <RouterLink class="navbar-brand" to="/"> SmartLoop ♻️ </RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNavbar"
        aria-controls="mainNavbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div id="mainNavbar" class="collapse navbar-collapse">
        <ul class="navbar-nav mx-lg-auto">
          <li class="nav-item mx-2">
            <RouterLink class="nav-link" to="/">Home</RouterLink>
          </li>

          <li class="nav-item mx-2">
            <RouterLink class="nav-link" to="/recycle-reuse"> Recycle & Reuse </RouterLink>
          </li>

          <li class="nav-item mx-2">
            <RouterLink class="nav-link" to="/locations"> Map </RouterLink>
          </li>

          <li class="nav-item mx-2">
            <RouterLink class="nav-link" to="/events"> Events </RouterLink>
          </li>

          <li class="nav-item mx-2">
            <RouterLink class="nav-link" to="/learn"> Learn </RouterLink>
          </li>

          <li class="nav-item mx-2">
            <RouterLink class="nav-link" to="/contact"> Contact </RouterLink>
          </li>

          <li class="nav-item mx-2">
            <RouterLink class="nav-link" to="/about"> About </RouterLink>
          </li>

          <li v-if="currentUser && currentUser.role === 'admin'" class="nav-item mx-2">
            <RouterLink class="nav-link" to="/admin">Admin Dashboard</RouterLink>
          </li>
        </ul>

        <div v-if="currentUser" class="d-flex gap-2">
          <RouterLink class="btn btn-outline-primary btn-sm" to="/account">Account</RouterLink>
          <button type="button" class="btn btn-outline-danger btn-sm" @click="logout">
            Logout
          </button>
        </div>

        <div v-else class="d-flex gap-2">
          <RouterLink class="btn btn-outline-primary btn-sm" to="/account/login">
            Login
          </RouterLink>
          <RouterLink class="btn btn-primary btn-sm" to="/signup">Sign Up</RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const currentUser = ref(JSON.parse(sessionStorage.getItem('currentUser')))

watch(
  () => route.path,
  () => {
    currentUser.value = JSON.parse(sessionStorage.getItem('currentUser'))
  },
)

const logout = () => {
  sessionStorage.removeItem('currentUser')
  currentUser.value = null
  router.push('/account/login')
}
</script>

<style scoped>
.smartloop-navbar {
  background-color: var(--navbar-background-color);
  border-bottom: 1px solid var(--navbar-border-color);
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  padding: 0.75rem 0;
}

.navbar-brand {
  color: #244d87;
  font-size: 1.4rem;
  font-weight: 700;
}

.nav-link {
  color: #374151;
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0.15rem;
}

.nav-link.router-link-active {
  color: #0d6efd;
  font-weight: 700;
}
</style>
