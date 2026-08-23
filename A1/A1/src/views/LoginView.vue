<template>
  <main class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-12 col-sm-6">
        <h1>Welcome to Smartloop</h1>

        <h2 class="mt-4">Login</h2>

        <form>
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>

            <input id="email" v-model="form.email" type="email" class="form-control" />
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">Password</label>

            <input id="password" v-model="form.password" type="password" class="form-control" />
          </div>

          <button type="submit" class="btn btn-primary">Login</button>
        </form>
        <p class="mt-3">
          Not registered yet?
          <RouterLink to="/signup">Sign Up</RouterLink>
        </p>
      </div>
    </div>
  </main>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  email: '',
  password: '',
})
</script>
