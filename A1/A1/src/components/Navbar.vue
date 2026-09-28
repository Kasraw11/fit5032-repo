<template>
  <nav class="navbar navbar-expand-lg navbar-light smartloop-navbar">
    <div class="container">
      <RouterLink class="navbar-brand" to="/" aria-label="SmartLoop home">
        <img src="/logo.png" alt="SmartLoop logo" class="brand-logo" />
        <span class="brand-name">SmartLoop</span>
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
        <ul class="navbar-nav mx-lg-auto gap-lg-1">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/">Home</RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link" to="/recycle-reuse"> Recycle & Reuse </RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link" to="/locations"> Map </RouterLink>
          </li>

          <li v-if="currentUser" class="nav-item">
            <RouterLink class="nav-link" to="/events"> Events </RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link" to="/learn"> Learn </RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link" to="/contact"> Contact </RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link" to="/about"> About </RouterLink>
          </li>
        </ul>

        <div v-if="currentUser" class="navbar-actions d-flex align-items-center gap-2">
          <RouterLink class="btn btn-outline-primary btn-sm account-button" to="/account">
            {{ currentUser.displayName || currentUser.email }}
          </RouterLink>
          <button
            type="button"
            class="btn btn-outline-danger btn-sm logout-button"
            @click="handleLogout"
          >
            Logout
          </button>
        </div>

        <div v-else class="navbar-actions d-flex align-items-center gap-2">
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
  background: linear-gradient(90deg, rgba(239, 248, 255, 0.98), rgba(232, 247, 237, 0.98));
  border-top: 3px solid #2f8f68;
  border-bottom: 1px solid #c9dce8;
  box-shadow: 0 4px 18px rgba(23, 54, 93, 0.08);
  font-family: 'Segoe UI', Arial, sans-serif;
  padding: 0.65rem 0;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #184780;
  font-family: Georgia;
  font-size: 1.4rem;
  font-weight: 700;
}

.brand-name {
  line-height: 1;
}

.nav-link {
  color: #294a68;
  font-family: 'Segoe UI', Arial, sans-serif;
  font-size: 1rem;
  font-weight: 500;
}

.brand-logo {
  width: 44px;
  height: 44px;
  object-fit: contain;
}

.navbar .navbar-nav .nav-link {
  border-radius: 100px;
  padding: 1.1rem;
  transition: background-color 0.2s ease;
}

.navbar .navbar-nav .nav-link:hover {
  background-color: rgba(255, 255, 255, 0.72);
  color: #1f6f50;
  transform: translateY(-1px);
}

.navbar .navbar-nav .nav-link.router-link-active {
  background-color: #d7edff;
  color: #174c83;
}

@media (max-width: 1200px) {
  .brand-name {
    display: none;
  }
}

@media (max-width: 990px) {
  .smartloop-navbar {
    padding: 1rem;
  }

  .navbar-collapse {
    padding-top: 1rem;
  }

  .navbar-nav {
    gap: 0.25rem;
    margin-bottom: 1rem;
  }

  .navbar .navbar-nav .nav-link {
    border-radius: 0.6rem;
    padding: 0.65rem 0.8rem;
  }

  .navbar-actions {
    padding-bottom: 0.5rem;
  }

  .brand-name {
    display: inline;
  }
}
</style>
