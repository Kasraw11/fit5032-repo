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
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import PageHero from '@/components/PageHero.vue'
import sign_hero from '@/assets/images/sign_hero.png'

const router = useRouter()
const auth = getAuth()

const form = reactive({
  email: '',
  password: '',
})

const errors = reactive({
  email: '',
  password: '',
})

const loginError = ref('')

const submitForm = async () => {
  errors.email = ''
  errors.password = ''
  loginError.value = ''

  if (!form.email.trim()) {
    errors.email = 'Email is required.'
  }

  if (!form.password.trim()) {
    errors.password = 'Password is required.'
  }

  if (errors.email || errors.password) {
    return
  }

  try {
    await signInWithEmailAndPassword(auth, form.email.trim(), form.password)

    router.push('/account')
  } catch (error) {
    switch (error.code) {
      case 'auth/invalid-email':
        errors.email = 'Please enter a valid email address.'
        break

      case 'auth/invalid-credential':
        loginError.value = 'Incorrect email or password.'
        break

      case 'auth/user-disabled':
        loginError.value = 'This account has been disabled.'
        break

      case 'auth/too-many-requests':
        loginError.value = 'Too many attempts. Please try again later.'
        break

      case 'auth/network-request-failed':
        loginError.value = 'Please check your internet connection.'
        break

      default:
        loginError.value = 'Login failed. Please try again.'
        console.error(error)
    }
  }
}
</script>
