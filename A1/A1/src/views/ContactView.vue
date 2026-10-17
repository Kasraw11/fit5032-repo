<template>
  <main>
    <PageHero
      title="Contact us"
      subtitle="Get in touch about collaboration, support, or SmartLoop."
      :image="public_hero"
    />

    <form
      class="form-card mx-auto my-5"
      style="max-width: 600px"
      novalidate
      @submit.prevent="submitForm"
    >
      <fieldset :disabled="isSending">
        <div class="mb-3">
          <label for="contact-name" class="form-label">Name</label>
          <input
            id="contact-name"
            v-model="name"
            :readonly="Boolean(currentUser?.displayName)"
            type="text"
            autocomplete="name"
            class="form-control"
            maxlength="100"
            :class="{ 'is-invalid': nameError }"
            :aria-describedby="nameError ? 'name-error' : undefined"
            :aria-invalid="Boolean(nameError)"
          />
          <p v-if="nameError" id="name-error" class="text-danger mt-1">{{ nameError }}</p>
        </div>
        <div class="mb-3">
          <label for="contact-email" class="form-label">Contact email</label>
          <input
            id="contact-email"
            v-model="email"
            type="email"
            class="form-control"
            autocomplete="email"
            maxlength="254"
            :class="{ 'is-invalid': emailError }"
            :aria-describedby="emailError ? 'email-error' : undefined"
            :aria-invalid="Boolean(emailError)"
          />
          <p v-if="emailError" id="email-error" class="text-danger mt-1">{{ emailError }}</p>
        </div>
        <div class="mb-3">
          <label for="subject" class="form-label">Subject</label>
          <select
            id="subject"
            v-model="subject"
            class="form-select"
            :class="{ 'is-invalid': subjectError }"
            :aria-describedby="subjectError ? 'subject-error' : undefined"
            :aria-invalid="Boolean(subjectError)"
          >
            <option value="">Select a subject...</option>
            <option value="Support">Support</option>
            <option value="Suggest">Suggest</option>
            <option value="Question">Question</option>
            <option value="other">Other</option>
          </select>
          <p v-if="subjectError" id="subject-error" class="text-danger mt-1">
            {{ subjectError }}
          </p>
        </div>

        <div class="mb-3">
          <label for="message" class="form-label">Message</label>
          <textarea
            id="message"
            v-model="message"
            maxlength="5000"
            style="resize: none"
            class="form-control"
            :class="{ 'is-invalid': messageError }"
            rows="4"
            placeholder="Write your message"
            :aria-describedby="messageError ? 'message-error' : undefined"
            :aria-invalid="Boolean(messageError)"
          ></textarea>
          <p v-if="messageError" id="message-error" class="text-danger mt-1">
            {{ messageError }}
          </p>
        </div>

        <div class="mb-3">
          <label for="attachment" class="form-label">Image attachment (optional)</label>
          <input
            id="attachment"
            ref="attachmentInput"
            type="file"
            class="form-control"
            accept="image/png,image/jpeg"
            :class="{ 'is-invalid': attachmentError }"
            :aria-invalid="attachmentError !== ''"
            :aria-describedby="
              attachmentError ? 'attachment-help attachment-error' : 'attachment-help'
            "
            @change="chooseAttachment"
          />
          <p id="attachment-help" class="form-text">One PNG or JPG image, smaller than 3 MB.</p>
          <p v-if="attachmentError" id="attachment-error" class="text-danger mt-1" role="alert">
            {{ attachmentError }}
          </p>
          <button
            v-if="attachment"
            type="button"
            class="btn btn-outline-secondary btn-sm"
            @click="removeAttachment"
          >
            Remove attachment
          </button>
        </div>

        <button type="submit" class="btn btn-primary">Send Message</button>
      </fieldset>
      <LoadingIndicator v-if="isSending" class="mt-3" message="Sending your message..." />
      <FeedbackMessage v-model:message="successMessage" />
      <FeedbackMessage v-model:message="sendError" type="error" />
    </form>
  </main>
</template>

<script setup>
import FeedbackMessage from '@/components/FeedbackMessage.vue'
import { ref, watch } from 'vue'
import axios from 'axios'
import { currentUser } from '@/authentication'
import PageHero from '@/components/PageHero.vue'
import LoadingIndicator from '@/components/LoadingIndicator.vue'
import public_hero from '@/assets/images/public_hero.png'

const name = ref('')
const email = ref('')
const subject = ref('')
const message = ref('')
const subjectError = ref('')
const messageError = ref('')
const nameError = ref('')
const emailError = ref('')
const attachment = ref(null)
const attachmentInput = ref(null)
const attachmentError = ref('')
const isSending = ref(false)
const successMessage = ref('')
const sendError = ref('')

watch(
  currentUser,
  (user) => {
    name.value = user?.displayName || ''
  },
  { immediate: true },
)

function validateAttachment(file) {
  if (!file) return ''
  const filename = file.name.toLowerCase()
  let allowedType = false
  if (file.type === 'image/png' && filename.endsWith('.png')) allowedType = true
  if (file.type === 'image/jpeg' && (filename.endsWith('.jpg') || filename.endsWith('.jpeg')))
    allowedType = true
  if (!allowedType) return 'Please select a PNG or JPG image.'
  if (file.size === 0) return 'Attachment cannot be empty.'
  if (file.size >= 3 * 1024 * 1024) return 'Attachment must be smaller than 3 MB.'
  return ''
}

function chooseAttachment(event) {
  attachment.value = event.target.files[0] || null
  attachmentError.value = validateAttachment(attachment.value)
  successMessage.value = ''
  sendError.value = ''
}

function removeAttachment() {
  attachment.value = null
  attachmentError.value = ''
  if (attachmentInput.value) attachmentInput.value.value = ''
}

function readAttachment(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1])
    reader.onerror = reject
    reader.onabort = reject
    reader.readAsDataURL(file)
  })
}

function validateForm() {
  nameError.value = ''
  emailError.value = ''
  subjectError.value = ''
  messageError.value = ''
  if (!name.value.trim()) nameError.value = 'Name cannot be empty.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()))
    emailError.value = 'Please enter a valid email.'
  if (!['Support', 'Suggest', 'Question', 'other'].includes(subject.value))
    subjectError.value = 'Please select a subject.'
  if (!message.value.trim()) messageError.value = 'Message cannot be empty.'
  if (name.value.trim().length > 100) nameError.value = 'Name must be 100 characters or less'
  if (email.value.trim().length > 254) emailError.value = 'Please enter a valid email.'
  if (message.value.trim().length > 5000)
    messageError.value = 'Message must be 5000 characters or fewer.'
  attachmentError.value = validateAttachment(attachment.value)
  let invalidField = ''
  if (nameError.value) invalidField = 'contact-name'
  else if (emailError.value) invalidField = 'contact-email'
  else if (subjectError.value) invalidField = 'subject'
  else if (messageError.value) invalidField = 'message'
  else if (attachmentError.value) invalidField = 'attachment'
  if (invalidField) {
    document.getElementById(invalidField)?.focus()
    return false
  }
  return true
}

async function submitForm() {
  if (isSending.value) return
  successMessage.value = ''
  sendError.value = ''
  if (!validateForm()) return
  isSending.value = true
  try {
    const supportUrl = import.meta.env.VITE_SUPPORT_EMAIL_URL
    if (!supportUrl) throw new Error('VITE_SUPPORT_EMAIL_URL is not configured.')
    const supportMessage = {
      name: name.value.trim(),
      email: email.value.trim(),
      subject: subject.value.trim(),
      message: message.value.trim(),
    }
    if (attachment.value) {
      const file = attachment.value
      const content = await readAttachment(file)
      supportMessage.attachment = { filename: file.name, type: file.type, content }
    }
    const response = await axios.post(supportUrl, supportMessage, { timeout: 15000 })
    if (response.data.success !== true)
      throw new Error('Support service returned an unsuccessful response.')
    successMessage.value = response.data.message
    removeAttachment()
  } catch {
    sendError.value = 'Unable to send your message. Please try again.'
  } finally {
    isSending.value = false
  }
}
</script>
