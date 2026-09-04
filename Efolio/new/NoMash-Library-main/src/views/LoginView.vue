<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../authentication'

const username = ref('')
const password = ref('')
const errorMessage = ref('')

const router = useRouter()

const handleLogin = () => {
  const success = login(username.value, password.value)

  if (success) {
    router.push('/about')
  } else {
    errorMessage.value = 'Incorrect username or password.'
  }
}
</script>

<template>
  <div class="container mt-5">
    <div class="card p-4 mx-auto">
      <h1 class="text-center mb-4">Login</h1>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>

          <input id="username" v-model="username" type="text" class="form-control" required />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Password</label>

          <input id="password" v-model="password" type="password" class="form-control" required />
        </div>

        <p v-if="errorMessage" class="text-danger">
          {{ errorMessage }}
        </p>

        <button type="submit" class="btn btn-primary w-100">Login</button>
      </form>
    </div>
  </div>
</template>
