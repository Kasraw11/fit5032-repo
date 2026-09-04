<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goToLogin() {
  router.push('/login')
}
</script>

<template>
  <div>
    <h1>Access Denied</h1>

    <p>You must be logged in to access this page.</p>

    <button @click="goToLogin">Go to Login</button>
  </div>
</template>
