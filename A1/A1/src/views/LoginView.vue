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
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                  focusable="false"
                >
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

async function redirectAfterLogin(user) {
  await waitForAuthReady()
  const adminAllowed = await checkAdminRole(user)
  successMessage.value = 'Login successful!'
  await new Promise((resolve) => setTimeout(resolve, 1000))
  await router.push(adminAllowed ? '/admin' : '/account')
}

async function signInWithGoogle() {
  if (isLoading.value) return
  successMessage.value = ''
  googleError.value = ''
  loginError.value = ''
  errors.email = ''
  errors.password = ''
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
    } catch (error) {
      await logout()
      googleError.value =
        error.code === 'permission-denied'
          ? 'Unable to create your profile. Please contact support or use email and password.'
          : 'Unable to load your profile. Check your internet connection and try again.'
      return
    }
    await redirectAfterLogin(result.user)
  } catch (error) {
    switch (error.code) {
      case 'auth/popup-closed-by-user':
      case 'auth/cancelled-popup-request':
        googleError.value = 'Google sign-in was cancelled. You can try again.'
        break
      case 'auth/popup-blocked':
        googleError.value =
          'Your browser blocked the sign-in popup. Allow popups for SmartLoop and try again.'
        break
      case 'auth/account-exists-with-different-credential':
        googleError.value =
          'This account uses another sign-in method. Please use your original method, such as email and password.'
        break
      case 'auth/too-many-requests':
        googleError.value = 'Too many attempts. Please try again later.'
        break
      case 'auth/network-request-failed':
        googleError.value = 'Please check your internet connection and try again.'
        break
      case 'auth/user-disabled':
        googleError.value = 'This account has been disabled.'
        break
      case 'auth/unauthorized-domain':
      case 'auth/operation-not-allowed':
        googleError.value =
          'Google sign-in is unavailable on this site. Please use email and password.'
        break
      default:
        googleError.value =
          'Unable to sign in with Google. Please try again or use email and password.'
    }
  } finally {
    isLoading.value = false
  }
}

const submitForm = async () => {
  if (isLoading.value) return
  successMessage.value = ''
  googleError.value = ''
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

  isLoading.value = true
  try {
    const result = await signInWithEmailAndPassword(auth, form.email.trim(), form.password)
    await redirectAfterLogin(result.user)
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
  } finally {
    isLoading.value = false
  }
}
</script>
