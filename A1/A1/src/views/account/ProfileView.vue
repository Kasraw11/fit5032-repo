<template>
  <main class="container-fluid p-3">
    <PageHero
      title="Profile"
      subtitle="Manage your account information and settings."
      :image="public_hero"
    />

    <div class="row mt-4">
      <aside class="col-12 col-md-3 mb-3">
        <AccountSidebar />
      </aside>

      <section class="col-12 col-md-9">
        <div class="card p-3 mb-3">
          <h2 class="h4 mb-3">Account Information</h2>

          <form v-if="isEditing" @submit.prevent="saveName">
            <div class="mb-3 name-field">
              <label for="profileName" class="form-label"><strong>Name</strong></label>
              <input
                id="profileName"
                v-model="name"
                type="text"
                autocomplete="name"
                class="form-control"
              />
              <p v-if="nameError" class="text-danger mt-1 mb-0">
                {{ nameError }}
              </p>
            </div>
          </form>

          <p v-else><strong>Name:</strong> {{ currentUser?.displayName || 'User' }}</p>

          <FeedbackMessage v-model:message="successMessage" />

          <div class="mt-2">
            <button
              v-if="!isEditing"
              type="button"
              class="btn btn-outline-primary btn-sm"
              @click="startEditing"
            >
              Edit name
            </button>

            <div v-else class="d-flex gap-2">
              <button
                type="button"
                class="btn btn-primary btn-sm"
                :disabled="isSaving"
                @click="saveName"
              >
                {{ isSaving ? 'Saving...' : 'Save' }}
              </button>
              <button
                type="button"
                class="btn btn-secondary btn-sm"
                :disabled="isSaving"
                @click="cancelEditing"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import FeedbackMessage from '@/components/FeedbackMessage.vue'
import { ref, triggerRef } from 'vue'
import { getAuth, updateProfile } from 'firebase/auth'
import AccountSidebar from '@/components/AccountSidebar.vue'
import { currentUser } from '@/authentication'
import PageHero from '@/components/PageHero.vue'
import public_hero from '@/assets/images/public_hero.png'

const name = ref(currentUser.value?.displayName || '')
const nameError = ref('')
const successMessage = ref('')
const isSaving = ref(false)
const isEditing = ref(false)

const startEditing = () => {
  name.value = currentUser.value?.displayName || ''
  nameError.value = ''
  successMessage.value = ''
  isEditing.value = true
}

const cancelEditing = () => {
  name.value = currentUser.value?.displayName || ''
  nameError.value = ''
  isEditing.value = false
}

const saveName = async () => {
  nameError.value = ''
  successMessage.value = ''

  if (name.value.trim().length < 2) {
    nameError.value = 'Name must be at least 2 characters long.'
    return
  }

  try {
    isSaving.value = true
    const auth = getAuth()

    await updateProfile(auth.currentUser, {
      displayName: name.value.trim(),
    })

    triggerRef(currentUser)
    successMessage.value = 'Your name has been updated.'
    isEditing.value = false
  } catch (error) {
    nameError.value = 'Unable to update your name. Please try again.'
    console.error(error)
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.name-field {
  max-width: 400px;
}
</style>
