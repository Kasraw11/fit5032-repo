<script setup>
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const formData = ref({
  username: '',
  password: '',
  confirmPassword: '',
  isAustralian: false,
  reason: '',
  validateReason: '',
  gender: '',
  suburb: 'Clayton'
})

const submittedCards = ref([])

const errors = ref({
  username: null,
  password: null,
  confirmPassword: null,
  validateReason: null,
  gender: null
})

const validateName = (blur) => {
  if (formData.value.username.length < 3) {
    if (blur) {
      errors.value.username = 'Name must be at least 3 characters.'
    }
  } else {
    errors.value.username = null
  }
}

const validateReason = (blur) => {
  if (formData.value.reason.length < 10) {
    if (blur) {
      errors.value.reason = 'Reason must be at least 10 characters.'
    }
  } else {
    if (formData.value.reason.trim() == 'friend') {
      errors.value.reason = 'great to have a friend '
    }
  }
}

const validatePassword = (blur) => {
  const password = formData.value.password
  const minLength = 8

  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    if (blur) {
      errors.value.password = `Password must be at least ${minLength} characters long.`
    }
  } else if (!hasUppercase) {
    if (blur) {
      errors.value.password = 'Password must contain at least one uppercase letter.'
    }
  } else if (!hasLowercase) {
    if (blur) {
      errors.value.password = 'Password must contain at least one lowercase letter.'
    }
  } else if (!hasNumber) {
    if (blur) {
      errors.value.password = 'Password must contain at least one number.'
    }
  } else if (!hasSpecialChar) {
    if (blur) {
      errors.value.password = 'Password must contain at least one special character.'
    }
  } else {
    errors.value.password = null
  }

  if (formData.value.confirmPassword) {
    validateConfirmPassword(blur)
  }
}

const validateConfirmPassword = (blur) => {
  if (!formData.value.confirmPassword) {
    if (blur) {
      errors.value.confirmPassword = 'Please confirm your password.'
    }
  } else if (formData.value.password !== formData.value.confirmPassword) {
    if (blur) {
      errors.value.confirmPassword = 'Passwords do not match.'
    }
  } else {
    errors.value.confirmPassword = null
  }
}

const validateGender = () => {
  if (!formData.value.gender) {
    errors.value.gender = 'Please select a gender.'
  } else {
    errors.value.gender = null
  }
}

const submitForm = () => {
  validateName(true)
  validatePassword(true)
  validateConfirmPassword(true)
  validateGender()

  if (
    !errors.value.username &&
    !errors.value.password &&
    !errors.value.confirmPassword &&
    !errors.value.gender
  ) {
    submittedCards.value.push({
      ...formData.value
    })

    clearForm()
  }
}

const clearForm = () => {
  formData.value = {
    username: '',
    password: '',
    confirmPassword: '',
    isAustralian: false,
    reason: '',
    gender: ''
  }

  errors.value = {
    username: null,
    password: null,
    confirmPassword: null,
    gender: null
  }
}
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-10 offset-md-1">
        <h1 class="text-center">🗄️ W5. Library Registration Form</h1>

        <p class="text-center">
          This form includes validation. Registered users are displayed in a PrimeVue data table
          below.
        </p>

        <form @submit.prevent="submitForm">
          <div class="row mb-3">
            <div class="col-md-4 mb-3">
              <label for="username" class="form-label"> Username </label>

              <input
                id="username"
                v-model="formData.username"
                type="text"
                class="form-control"
                @blur="validateName(true)"
                @input="validateName(false)"
              />

              <div v-if="errors.username" class="text-danger mt-1">
                {{ errors.username }}
              </div>
            </div>

            <div class="col-md-5 mb-3">
              <label for="gender" class="form-label"> Gender </label>

              <select
                id="gender"
                v-model="formData.gender"
                class="form-select"
                @change="validateGender"
              >
                <option value="" disabled>Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <div v-if="errors.gender" class="text-danger mt-1">
                {{ errors.gender }}
              </div>
            </div>

            <div class="col-md-4 mb-3">
              <label for="password" class="form-label"> Password </label>

              <input
                id="password"
                v-model="formData.password"
                type="password"
                class="form-control"
                @blur="validatePassword(true)"
                @input="validatePassword(false)"
              />

              <div v-if="errors.password" class="text-danger mt-1">
                {{ errors.password }}
              </div>
            </div>

            <!-- Confirm Password -->
            <div class="col-md-4 mb-3">
              <label for="confirm-password" class="form-label"> Confirm Password </label>

              <input
                id="confirm-password"
                v-model="formData.confirmPassword"
                type="password"
                class="form-control"
                @blur="validateConfirmPassword(true)"
                @input="validateConfirmPassword(false)"
              />

              <div v-if="errors.confirmPassword" class="text-danger mt-1">
                {{ errors.confirmPassword }}
              </div>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-6 mb-3">
              <div class="form-check mt-4">
                <input
                  id="isAustralian"
                  v-model="formData.isAustralian"
                  type="checkbox"
                  class="form-check-input"
                />

                <label class="form-check-label" for="isAustralian"> Australian Resident? </label>
              </div>
            </div>
          </div>

          <div class="mb-3">
            <label for="reason" class="form-label"> Reason for joining </label>

            <textarea
              id="reason"
              v-model="formData.reason"
              class="form-control"
              rows="3"
              placeholder="Enter your reason for joining the library"
            ></textarea>
          </div>

          <div class="mb-3">
            <label for="reason" class="form-label">Suburb</label>
            <input type="text" class="form-control" id="suburb" v-bind:value="formData.suburb" />
          </div>

          <div class="text-center">
            <button type="submit" class="btn btn-primary me-2">Submit</button>

            <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
          </div>
        </form>
      </div>
    </div>

    <div class="row mt-5">
      <div class="col-12">
        <h4>This is a PrimeVue DataTable.</h4>

        <DataTable :value="submittedCards" tableStyle="min-width: 50rem" stripedRows>
          <Column field="username" header="Username" />

          <Column field="isAustralian" header="Australian Resident">
            <template #body="slotProps">
              {{ slotProps.data.isAustralian ? 'Yes' : 'No' }}
            </template>
          </Column>

          <Column field="gender" header="Gender" />

          <Column field="reason" header="Reason" />
        </DataTable>
      </div>
    </div>

    <div v-if="submittedCards.length" class="row mt-5">
      <div class="col-12">
        <h4>Registered Users</h4>

        <div class="d-flex flex-wrap justify-content-start">
          <div
            v-for="(card, index) in submittedCards"
            :key="index"
            class="card m-2"
            style="width: 18rem"
          >
            <div class="card-header">User Information</div>

            <ul class="list-group list-group-flush">
              <li class="list-group-item">Username: {{ card.username }}</li>

              <li class="list-group-item">
                Australian Resident:
                {{ card.isAustralian ? 'Yes' : 'No' }}
              </li>

              <li class="list-group-item">Gender: {{ card.gender }}</li>

              <li class="list-group-item">Reason: {{ card.reason }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 80vw;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
}

#username:focus,
#password:focus,
#confirm-password:focus,
#gender:focus,
#isAustralian:focus {
  border-color: #275fda;
  box-shadow: 0 0 0 0.2rem rgba(39, 95, 218, 0.2);
}

.card {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #275fda;
  color: white;
  padding: 10px;
  border-radius: 10px 10px 0 0;
}

.list-group-item {
  padding: 10px;
}

.text-danger {
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .container {
    max-width: 95vw;
  }
}
</style>
