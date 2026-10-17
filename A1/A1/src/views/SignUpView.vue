<template>
  <main>
    <PageHero
      title="Welcome"
      subtitle="Create an account and join us today to get started."
      :image="sign_hero"
    />

    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-12 col-sm-6">
          <form class="form-card" @submit.prevent="submitForm" novalidate>
            <div class="mb-3">
              <label for="name" class="form-label">Name</label>

              <input
                id="name"
                v-model="form.name"
                type="text"
                class="form-control"
                :disabled="isLoading"
                @blur="validateName(true)"
                @input="validateName(false)"
              />

              <p v-if="errors.name" class="text-danger mt-1">
                {{ errors.name }}
              </p>
            </div>

            <div class="mb-3">
              <label for="email" class="form-label">Email</label>

              <input
                id="email"
                v-model="form.email"
                type="email"
                class="form-control"
                :disabled="isLoading"
                @blur="validateEmail(true)"
                @input="validateEmail(false)"
              />

              <p v-if="errors.email" class="text-danger mt-1">
                {{ errors.email }}
              </p>
            </div>

            <div class="mb-3">
              <label for="password" class="form-label">Password</label>

              <input
                id="password"
                v-model="form.password"
                type="password"
                class="form-control"
                :disabled="isLoading"
                @blur="validatePassword(true)"
                @input="validatePassword(false)"
              />

              <p v-if="errors.password" class="text-danger mt-1">
                {{ errors.password }}
              </p>
              <div class="password-requirements">
                <p class="mb-2"><strong>Password requirements:</strong></p>

                <ul class="mb-0">
                  <li>At least 8 characters</li>
                  <li>At least one uppercase letter</li>
                  <li>At least one lowercase letter</li>
                  <li>At least one number</li>
                  <li>At least one special character</li>
                </ul>
              </div>
            </div>

            <div class="mb-3">
              <label for="confirmPassword" class="form-label"> Confirm Password </label>

              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                class="form-control"
                :disabled="isLoading"
                placeholder="Confirm your password"
                @blur="validateConfirmPassword(true)"
                @input="validateConfirmPassword(false)"
              />

              <p v-if="errors.confirmPassword" class="text-danger mt-1">
                {{ errors.confirmPassword }}
              </p>
            </div>

            <div class="text-center">
              <button type="submit" class="btn btn-primary" :disabled="isLoading">Sign Up</button>
            </div>
            <LoadingIndicator v-if="isLoading" class="mt-3" message="Creating your account..." />

            <FeedbackMessage v-model:message="successMessage" />

            <FeedbackMessage v-model:message="authError" type="error" />

            <p class="mt-3">
              have an account?
              <RouterLink to="account/login">Login</RouterLink>
            </p>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import FeedbackMessage from '@/components/FeedbackMessage.vue'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import PageHero from '@/components/PageHero.vue'
import LoadingIndicator from '@/components/LoadingIndicator.vue'
import sign_hero from '@/assets/images/sign_hero.png'
import { createUserWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth'

const router = useRouter()
const auth = getAuth()

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const authError = ref('')
const successMessage = ref('')
const isLoading = ref(false)

const validateName = (blur) => {
  if (form.name.trim().length < 2) {
    if (blur) {
      errors.name = 'Name must be at least 2 characters long.'
    }
  } else {
    errors.name = ''
  }
}

const validateEmail = (blur) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailPattern.test(form.email)) {
    if (blur) {
      errors.email = 'Please enter a valid email address.'
    }
  } else {
    errors.email = ''
  }
}

const validatePassword = (blur) => {
  const password = form.password
  const minLength = 8

  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    if (blur) {
      errors.password = `Password must be at least ${minLength} characters long.`
    }
  } else if (!hasUppercase) {
    if (blur) {
      errors.password = 'Password must contain at least one uppercase letter.'
    }
  } else if (!hasLowercase) {
    if (blur) {
      errors.password = 'Password must contain at least one lowercase letter.'
    }
  } else if (!hasNumber) {
    if (blur) {
      errors.password = 'Password must contain at least one number.'
    }
  } else if (!hasSpecialChar) {
    if (blur) {
      errors.password = 'Password must contain at least one special character.'
    }
  } else {
    errors.password = ''
  }
}

const validateConfirmPassword = (blur) => {
  if (form.confirmPassword !== form.password) {
    if (blur) {
      errors.confirmPassword = 'Passwords do not match.'
    }
  } else {
    errors.confirmPassword = ''
  }
}

const submitForm = async () => {
  if (isLoading.value) return
  successMessage.value = ''
  authError.value = ''

  validateName(true)
  validateEmail(true)
  validatePassword(true)
  validateConfirmPassword(true)

  if (errors.name || errors.email || errors.password || errors.confirmPassword) {
    return
  }

  isLoading.value = true
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      form.email.trim(),
      form.password,
    )

    await updateProfile(userCredential.user, {
      displayName: form.name.trim(),
    })

    successMessage.value = 'Account created successfully! Redirecting...'
    console.log('Firebase user created')

    await new Promise((resolve) => setTimeout(resolve, 1000))
    await router.push('/account')
  } catch (error) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        errors.email = 'An account with this email already exists.'
        break

      case 'auth/invalid-email':
        errors.email = 'Please enter a valid email address.'
        break

      default:
        authError.value = 'Registration failed. Please try again.'
        console.error(error)
    }
  } finally {
    isLoading.value = false
  }
}
</script>
