<template>
  <main class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-12 col-sm-6">
        <h1>Sign Up</h1>

        <form>
          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input id="name" v-model="form.name" type="text" class="form-control" />
          </div>

          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input id="email" v-model="form.email" type="email" class="form-control" />
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input id="password" v-model="form.password" type="password" class="form-control" />
          </div>

          <div class="mb-3">
            <label for="confirmPassword" class="form-label"> Confirm Password </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              class="form-control"
            />
          </div>

          <button type="submit" class="btn btn-primary">Sign Up</button>

          <p class="mt-3">
            Already have an account?
            <RouterLink to="/login">Login</RouterLink>
          </p>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})
</script>
