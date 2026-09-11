<template>
  <main>
    <PageHero
      title="Welcome Back"
      subtitle="Log in to access your SmartLoop account."
      :image="sign_hero"
    />

    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-12 col-sm-8 col-md-6 col-lg-4">
          <div class="login-box">
            <form class="form-card" @submit.prevent="submitForm" novalidate>
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

              <p v-if="loginError" class="text-danger">
                {{ loginError }}
              </p>

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
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import PageHero from '@/components/PageHero.vue'
import sign_hero from '@/assets/images/sign_hero.png'

const router = useRouter()

const form = reactive({
  email: '',
  password: '',
})

const errors = reactive({
  email: '',
  password: '',
})

const loginError = ref('')

const ADMIN_EMAIL = 'admin@smartloop.com'
const ADMIN_PASSWORD = 'Admin123!'

const submitForm = () => {
  errors.email = ''
  errors.password = ''
  loginError.value = ''

  if (!form.email.trim()) {
    errors.email = 'Email is required.'
  }

  if (!form.password.trim()) {
    errors.password = 'Password is required.'
  }

  if (!errors.email && !errors.password) {
    const email = form.email.trim().toLowerCase()

    if (email === ADMIN_EMAIL && form.password === ADMIN_PASSWORD) {
      sessionStorage.setItem(
        'currentUser',
        JSON.stringify({
          id: 0,
          name: 'Administrator',
          email: ADMIN_EMAIL,
          role: 'admin',
        }),
      )

      router.push('/admin')
      return
    }

    const users = JSON.parse(localStorage.getItem('users')) || []
    const user = users.find((user) => user.email.toLowerCase() === email)

    if (!user || user.password !== form.password) {
      loginError.value = 'Invalid email or password.'
      return
    }

    const currentUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }

    sessionStorage.setItem('currentUser', JSON.stringify(currentUser))
    router.push('/account')
  }
}
</script>
