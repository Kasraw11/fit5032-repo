<template>
  <main>
    <section class="page-hero">
      <div class="container">
        <h1>Login</h1>
        <p>Access your SmartLoop account.</p>
      </div>
    </section>

    <div class="container py-5">
      <div class="row justify-content-center">
      <div class="col-12 col-sm-8 col-md-6 col-lg-4">
        <div class="login-box">
          <form @submit.prevent="submitForm" novalidate>
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>

              <input id="email" v-model="form.email" type="email" class="form-control" />
              <p v-if="errors.email" class="text-danger mt-1">
                {{ errors.email }}
              </p>
            </div>

            <div class="mb-4">
              <label for="password" class="form-label">Password</label>

              <input id="password" v-model="form.password" type="password" class="form-control" />
              <p v-if="errors.password" class="text-danger mt-1">
                {{ errors.password }}
              </p>
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

<script setup>
import { reactive } from 'vue'

const form = reactive({
  email: '',
  password: '',
})

const errors = reactive({
  email: '',
  password: '',
})

const submitForm = () => {
  errors.email = ''
  errors.password = ''

  if (!form.email.trim()) {
    errors.email = 'Email is required.'
  }

  if (!form.password.trim()) {
    errors.password = 'Password is required.'
  }

  if (!errors.email && !errors.password) {
    console.log('Login form is valid')
  }
}
</script>
