<template>
  <main>
    <section class="page-hero">
      <div class="container">
        <h1>Notify Users</h1>
        <p>Send an email notification to users subscribed to a SmartLoop category.</p>
      </div>
    </section>

    <section class="container py-4">
      <form class="card p-3 p-md-4" novalidate @submit.prevent="submitForm">
        <fieldset :disabled="isSending">
          <legend class="visually-hidden">Category notification</legend>
          <div class="mb-3">
            <label for="notify-category" class="form-label">Notification Category</label>
            <select
              id="notify-category"
              v-model="selectedCategory"
              class="form-select"
              :class="{ 'is-invalid': categoryError }"
              :aria-invalid="Boolean(categoryError)"
              :aria-describedby="categoryError ? 'notify-category-error' : undefined"
              @change="loadSubscriberCount"
            >
              <option value="">Select a category</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
            <p v-if="categoryError" id="notify-category-error" class="text-danger mt-1 mb-0">
              {{ categoryError }}
            </p>
          </div>

          <div class="mb-3" aria-live="polite">
            <h2 class="h6">Subscriber/s</h2>
            <p v-if="!selectedCategory" class="text-muted mb-0">
              Select a category to view its subscriber count.
            </p>
            <LoadingIndicator v-else-if="isLoadingCount" message="Loading subscriber count..." />
            <div v-else-if="countError">
              <p class="text-danger mb-2" role="alert">{{ countError }}</p>
              <button
                type="button"
                class="btn btn-outline-secondary btn-sm"
                @click="loadSubscriberCount"
              >
                Try Again
              </button>
            </div>
            <p v-else-if="countLoaded && subscriberCount === 0" class="mb-0">
              No users are currently subscribed to this category.
            </p>
            <p v-else-if="countLoaded" class="mb-0">
              {{ subscriberCount }} user/s subscribed to {{ selectedCategory }}
            </p>
          </div>

          <div class="mb-3">
            <label for="notify-subject" class="form-label">Email Subject</label>
            <input
              id="notify-subject"
              v-model="subject"
              class="form-control"
              type="text"
              maxlength="200"
              placeholder="New SmartLoop Event"
              :class="{ 'is-invalid': subjectError }"
              :aria-invalid="Boolean(subjectError)"
              :aria-describedby="subjectError ? 'notify-subject-error' : undefined"
              @input="notice = ''"
            />
            <p v-if="subjectError" id="notify-subject-error" class="text-danger mt-1 mb-0">
              {{ subjectError }}
            </p>
          </div>

          <div class="mb-3">
            <label for="notify-message" class="form-label">Message</label>
            <textarea
              id="notify-message"
              v-model="message"
              class="form-control"
              rows="7"
              maxlength="5000"
              style="resize: none"
              :class="{ 'is-invalid': messageError }"
              :aria-invalid="Boolean(messageError)"
              :aria-describedby="messageError ? 'notify-message-error' : undefined"
              @input="notice = ''"
            ></textarea>
            <p v-if="messageError" id="notify-message-error" class="text-danger mt-1 mb-0">
              {{ messageError }}
            </p>
          </div>

          <div class="mb-3">
            <label for="notify-image" class="form-label">Image attachment (optional)</label>
            <input
              id="notify-image"
              ref="imageInput"
              type="file"
              class="form-control"
              accept=".png,.jpg,.jpeg,image/png,image/jpeg"
              :class="{ 'is-invalid': imageError }"
              :aria-invalid="Boolean(imageError)"
              :aria-describedby="imageError ? 'image-help image-error' : 'image-help'"
              @change="chooseImage"
            />
            <p id="image-help" class="form-text">One PNG or JPG image, smaller than 3 MB.</p>
            <p v-if="imageError" id="image-error" class="text-danger" role="alert">
              {{ imageError }}
            </p>
            <button
              v-if="image"
              type="button"
              class="btn btn-outline-secondary btn-sm"
              @click="removeImage"
            >
              Remove image
            </button>
          </div>

          <button type="submit" class="btn btn-primary" :disabled="isLoadingCount">
            {{
              subscriberCount > 0
                ? 'Send to ' + subscriberCount + ' Subscribers'
                : 'Send to Subscribers'
            }}
          </button>
        </fieldset>
        <LoadingIndicator v-if="isSending" class="mt-3" message="Sending notifications..." />
        <FeedbackMessage v-model:message="notice" />
        <FeedbackMessage v-model:message="sendError" type="error" />
      </form>
    </section>
  </main>
</template>

<script setup>
import FeedbackMessage from '@/components/FeedbackMessage.vue'
import { ref } from 'vue'
import LoadingIndicator from '@/components/LoadingIndicator.vue'
import axios from 'axios'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { auth, db } from '@/firebase/init'

const categories = ['Donations', 'Workshops', 'Events', 'Recycling Centres', 'Repair Centres']
const selectedCategory = ref('')
const subscriberCount = ref(0)
const isLoadingCount = ref(false)
const countLoaded = ref(false)
const countError = ref('')
const subject = ref('')
const message = ref('')
const categoryError = ref('')
const subjectError = ref('')
const messageError = ref('')
const isSending = ref(false)
const notice = ref('')
const sendError = ref('')
const image = ref(null)
const imageInput = ref(null)
const imageError = ref('')
const bulkEmailUrl = import.meta.env.VITE_BULK_EMAIL_FUNCTION_URL

function validateImage() {
  imageError.value = ''
  if (!image.value) return
  const file = image.value
  const filename = file.name.toLowerCase()
  const isPng = file.type === 'image/png' && filename.endsWith('.png')
  const isJpg =
    file.type === 'image/jpeg' && (filename.endsWith('.jpg') || filename.endsWith('.jpeg'))
  if (!isPng && !isJpg) imageError.value = 'Please select a PNG or JPG image.'
  else if (file.size === 0 || file.size >= 3 * 1024 * 1024)
    imageError.value = 'Choose an image smaller than 3 MB that is not empty.'
}

function chooseImage(event) {
  image.value = event.target.files[0] || null
  notice.value = ''
  sendError.value = ''
  validateImage()
}

function removeImage() {
  image.value = null
  imageError.value = ''
  if (imageInput.value) imageInput.value.value = ''
}

function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1])
    reader.onerror = reject
    reader.onabort = reject
    reader.readAsDataURL(file)
  })
}

async function loadSubscriberCount() {
  const category = selectedCategory.value
  subscriberCount.value = 0
  countLoaded.value = false
  countError.value = ''
  categoryError.value = ''
  notice.value = ''
  sendError.value = ''
  isLoadingCount.value = false
  if (!category) return

  isLoadingCount.value = true
  try {
    const subscriptionsQuery = query(
      collection(db, 'categorySubscriptions'),
      where('category', '==', category),
    )
    const snapshot = await getDocs(subscriptionsQuery)
    if (selectedCategory.value !== category) return
    subscriberCount.value = snapshot.size
    countLoaded.value = true
  } catch {
    if (selectedCategory.value === category) {
      countError.value = 'Unable to load subscriber count. Please try again.'
    }
  } finally {
    if (selectedCategory.value === category) isLoadingCount.value = false
  }
}

async function submitForm() {
  if (isSending.value || isLoadingCount.value) return
  notice.value = ''
  sendError.value = ''
  categoryError.value = ''
  subjectError.value = ''
  messageError.value = ''

  if (!categories.includes(selectedCategory.value)) {
    categoryError.value = 'Please select a notification category.'
  } else if (!countLoaded.value) {
    categoryError.value = ' load the subscriber count before sending.'
  } else if (subscriberCount.value === 0) {
    categoryError.value = 'No users are subscribed to this category.'
  }
  if (!subject.value.trim()) subjectError.value = 'Please enter an email subject.'
  if (!message.value.trim()) messageError.value = 'Please enter a message.'
  validateImage()

  let invalidField = ''
  if (categoryError.value) invalidField = 'notify-category'
  else if (subjectError.value) invalidField = 'notify-subject'
  else if (messageError.value) invalidField = 'notify-message'
  else if (imageError.value) invalidField = 'notify-image'
  if (invalidField) {
    document.getElementById(invalidField)?.focus()
    return
  }
  if (!auth.currentUser || !bulkEmailUrl) {
    sendError.value = 'Unable to send notification emails.'

    return
  }

  isSending.value = true
  try {
    const token = await auth.currentUser.getIdToken()
    const emailData = {
      category: selectedCategory.value,
      subject: subject.value.trim(),
      message: message.value.trim(),
    }
    if (image.value) {
      const file = image.value
      const content = await readImage(file)
      emailData.attachment = { filename: file.name, type: file.type, content }
    }
    const response = await axios.post(bulkEmailUrl, emailData, {
      headers: { Authorization: 'Bearer ' + token },
      timeout: 310000,
    })
    if (!response.data.success) throw new Error('Notification request failed.')
    notice.value = 'Notification sent to ' + response.data.sentCount + ' subscribers.'
    removeImage()
  } catch (error) {
    sendError.value = 'Unable to send notification emails.'
    if (error.response?.data?.message === 'No subscribers found for this category.') {
      subscriberCount.value = 0
      sendError.value = 'No users are subscribed to this category.'
    } else if (error.response?.data?.sentCount > 0) {
      sendError.value +=
        ' ' + error.response.data.sentCount + ' subscribers already received this notification.'
    }
  } finally {
    isSending.value = false
  }
}
</script>
