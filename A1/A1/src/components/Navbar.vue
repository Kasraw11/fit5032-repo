<template>
  <nav class="navbar navbar-expand-lg smartloop-navbar">
    <div class="container">
      <RouterLink class="navbar-brand" to="/">
        <img src="/logo.png" alt="SmartLoop logo" class="brand-logo" />
      </RouterLink>
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

        </ul>

        <div v-if="currentUser" class="d-flex gap-2">
          <RouterLink class="btn btn-outline-primary btn-sm" to="/account">
            {{ currentUser.displayName || currentUser.email }}
          </RouterLink>
          <button type="button" class="btn btn-outline-danger btn-sm" @click="handleLogout">
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
import { useRouter } from 'vue-router'
import { currentUser, logout } from '@/authentication'

const router = useRouter()

const handleLogout = async () => {
  try {
    await logout()
    await router.push('/account/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.brand-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.nav-link {
  color: #17365d;
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0.15rem;
}

.nav-link.router-link-active {
  color: #2b7efc;
  font-weight: 700;
}
</style>
