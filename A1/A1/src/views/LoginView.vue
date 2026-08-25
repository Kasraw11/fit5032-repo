<script setup>
import { reactive } from 'vue'

const form = reactive({
  email: '',
  password: '',
})
</script>

<template>
  <main class="login-page pt-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-sm-8 col-md-6 col-lg-4">
          <div class="login-box">
            <h1>Login</h1>
            <p class="login-subtitle">Access to your SmartLoop account</p>

            <form>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>

                <input id="email" v-model="form.email" type="email" class="form-control" />
              </div>

              <div class="mb-4">
                <label for="password" class="form-label">Password</label>

                <input id="password" v-model="form.password" type="password" class="form-control" />
              </div>

              <button type="submit" class="btn btn-primary w-100">Login</button>

              <p class="account-link">
                Don't have an account?
                <RouterLink to="/signup">Create account</RouterLink>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
