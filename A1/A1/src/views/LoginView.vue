<template>
  <main>
    <PageHero
      title="Welcome Back"
      subtitle="Log in to access your SmartLoop account."
      :image="public_hero"
    />

    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-12 col-sm-8 col-md-6 col-lg-4">
          <div class="login-box">
            <form class="form-card" @submit.prevent="submitForm" novalidate>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>

                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  class="form-control"
                  :disabled="isLoading"
                />
                <p v-if="errors.email" class="text-danger mt-1">
                  {{ errors.email }}
                </p>
              </div>

              <div class="mb-4">
                <label for="password" class="form-label">Password</label>

                <input
                  id="password"
                  v-model="form.password"
                  type="password"
                  class="form-control"
                  :disabled="isLoading"
                />
                <p v-if="errors.password" class="text-danger mt-1">
                  {{ errors.password }}
                </p>
              </div>

              <FeedbackMessage v-model:message="loginError" type="error" />
              <FeedbackMessage v-model:message="successMessage" />

              <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
                Login
              </button>
              <LoadingIndicator v-if="isLoading" class="mt-3" message="Logging in..." />

              <p class="text-center text-muted my-3">or</p>
              <button
                type="button"
                class="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2"
                :disabled="isLoading"
                @click="signInWithGoogle"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24" height="24">
                  <path
                    fill="#4285F4"
                    d="M43.61 24.46c0-1.36-.12-2.66-.35-3.92H24v7.42h11a9.4 9.4 0 0 1-4.08 6.17v5.12h6.61c3.87-3.57 6.08-8.83 6.08-14.79z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 44c5.5 0 10.12-1.82 13.53-4.95l-6.61-5.12c-1.83 1.23-4.18 1.98-6.92 1.98-5.32 0-9.84-3.59-11.46-8.43H5.72v5.28A20 20 0 0 0 24 44z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M12.54 27.48a12 12 0 0 1 0-6.96v-5.28H5.72a20 20 0 0 0 0 17.52z"
                  />
                  <path
                    fill="#EA4335"
                    d="M24 12.09c3 0 5.68 1.03 7.8 3.05l5.85-5.85A19.6 19.6 0 0 0 24 4 20 20 0 0 0 5.72 15.24l6.82 5.28C14.16 15.68 18.68 12.09 24 12.09z"
                  />
                </svg>
                Continue with Google
              </button>
              <p v-if="googleError" class="text-danger mt-3 mb-0" role="alert">
                {{ googleError }}
              </p>

              <p class="account-link">
                Don't have an account?
                <RouterLink to="/signup" class="btn btn-outline-primary mt-2">
                  Create account
                </RouterLink>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import FeedbackMessage from '@/components/FeedbackMessage.vue'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { doc, runTransaction, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/firebase/init'
import { logout, checkAdminRole, waitForAuthReady } from '@/authentication'
import PageHero from '@/components/PageHero.vue'
import LoadingIndicator from '@/components/LoadingIndicator.vue'
import public_hero from '@/assets/images/public_hero.png'

const router = useRouter()
const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

const form = reactive({
  email: '',
  password: '',
})

const errors = reactive({
  email: '',
  password: '',
})

const loginError = ref('')
const successMessage = ref('')
const isLoading = ref(false)
const googleError = ref('')

function resetMessages() {
  successMessage.value = ''
  googleError.value = ''
  loginError.value = ''
  errors.email = ''
  errors.password = ''
}

async function redirectAfterLogin(user) {
  await waitForAuthReady()
  const adminAllowed = await checkAdminRole(user)
  successMessage.value = 'Login successful!'
  await new Promise((resolve) => setTimeout(resolve, 1000))
  await router.push(adminAllowed ? '/admin' : '/account')
}

async function signInWithGoogle() {
  if (isLoading.value) return
  resetMessages()
  isLoading.value = true
  try {
    const result = await signInWithPopup(auth, googleProvider)
    try {
      const profile = doc(db, 'users', result.user.uid)
      await runTransaction(db, async (transaction) => {
        const existingProfile = await transaction.get(profile)
        if (!existingProfile.exists()) {
          transaction.set(profile, {
            role: 'user',
            createdAt: serverTimestamp(),
          })
        }
      })
    } catch {
      await logout()
      googleError.value = 'Unable to prepare your account. Please try again.'
      return
    }
    await redirectAfterLogin(result.user)
  } catch {
    googleError.value = 'Unable to sign in with Google. Please try again or use email and password.'
  } finally {
    isLoading.value = false
  }
}

async function submitForm() {
  if (isLoading.value) return
  resetMessages()

  if (!form.email.trim()) {
    errors.email = 'Email is required.'
  }

  if (!form.password.trim()) {
    errors.password = 'Password is required.'
  }

  if (errors.email || errors.password) {
    return
  }

  isLoading.value = true
  try {
    const result = await signInWithEmailAndPassword(auth, form.email.trim(), form.password)
    await redirectAfterLogin(result.user)
  } catch {
    loginError.value = 'Unable to log in. Check your email and password or try again later.'
  } finally {
    isLoading.value = false
  }
}
</script>
