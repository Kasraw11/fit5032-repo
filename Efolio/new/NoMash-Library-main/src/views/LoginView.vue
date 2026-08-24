<script setup>
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const formData = ref({
  username: '',
  password: ''
})

const submittedCards = ref([])

const errors = ref({
  username: null,
  password: null
})

const submitForm = () => {
  validateName(true)
  validatePassword(true)
  validateConfirmPassword(true)
  validateGender()

  if (!errors.value.username && !errors.value.password) {
    submittedCards.value.push({
      ...formData.value
    })

    clearForm()
  }
}

const clearForm = () => {
  formData.value = {
    username: '',
    password: ''
  }

  errors.value = {
    username: null,
    password: null
  }
}
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-10 offset-md-1">
        <h1 class="text-center">🗄️ W5. Library login Form</h1>

        <p class="text-center">Welcome to week 5's library login form!</p>

        <form @submit.prevent="submitForm">
          <!-- Username, Password and Confirm Password -->
          <div class="row mb-4">
            <!-- Username -->
            <div class="col-md-4 mb-4">
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
          </div>

          <!-- Buttons -->
          <div class="text-center">
            <button type="submit" class="btn btn-primary me-2">Login</button>

            <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
          </div>
        </form>
      </div>
    </div>

    <!-- User Cards -->
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
