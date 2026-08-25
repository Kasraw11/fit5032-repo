<template>
  <main class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-12 col-sm-6">
        <h1>Create Account</h1>
        <p class="mb-4 pt-2">Create a new account to get started.</p>

        <form @submit.prevent="submitForm" novalidate>
          <div class="mb-3">
            <label for="name" class="form-label">Name</label>

            <input
              id="name"
              v-model="form.name"
              type="text"
              class="form-control"
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
              @blur="validatePassword(true)"
              @input="validatePassword(false)"
            />

            <p v-if="errors.password" class="text-danger mt-1">
              {{ errors.password }}
            </p>
          </div>

          <div class="mb-3">
            <label for="confirmPassword" class="form-label"> Confirm Password </label>

            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              class="form-control"
              placeholder="Confirm your password"
              @blur="validateConfirmPassword(true)"
              @input="validateConfirmPassword(false)"
            />

            <p v-if="errors.confirmPassword" class="text-danger mt-1">
              {{ errors.confirmPassword }}
            </p>
          </div>

          <div class="text-center">
            <button type="submit" class="btn btn-primary">Sign Up</button>
          </div>

          <p v-if="successMessage" class="text-success mt-3">
            {{ successMessage }}
          </p>

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
import { reactive, ref } from 'vue'

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

const successMessage = ref('')

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

const submitForm = () => {
  successMessage.value = ''

  validateName(true)
  validateEmail(true)
  validatePassword(true)
  validateConfirmPassword(true)

  if (!errors.name && !errors.email && !errors.password && !errors.confirmPassword) {
    successMessage.value = ` Welcome! ${form.name}, your registration was successful.`
  }
}
</script>
