<template>
  <main>
    <PageHero
      title="Contact us"
      subtitle="Get in touch about collaboration, support, or SmartLoop."
      :image="contact_hero"
    />

    <form
      class="form-card mx-auto my-5"
      style="max-width: 600px"
      novalidate
      @submit.prevent="submitForm"
    >
      <div class="mb-3">
        <label for="subject" class="form-label">Subject</label>
        <input
          id="subject"
          v-model="subject"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': subjectError }"
          placeholder="Enter a subject"
          :aria-describedby="subjectError ? 'subject-error' : undefined"
          :aria-invalid="Boolean(subjectError)"
        />
        <p v-if="subjectError" id="subject-error" class="text-danger mt-1">
          {{ subjectError }}
        </p>
      </div>

      <div class="mb-3">
        <label for="message" class="form-label">Message</label>
        <textarea
          id="message"
          v-model="message"
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

      <button type="submit" class="btn btn-primary">Send</button>
    </form>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import PageHero from '@/components/PageHero.vue'
import contact_hero from '@/assets/images/contact_hero.png'

const subject = ref('')
const message = ref('')
const subjectError = ref('')
const messageError = ref('')

const submitForm = () => {
  if (!subject.value.trim()) {
    subjectError.value = 'Subject cannot be empty.'
  } else if (subject.value.trim().length <= 10) {
    subjectError.value = 'Subject must be more than 10 characters.'
  } else {
    subjectError.value = ''
  }

  if (!message.value.trim()) {
    messageError.value = 'Message cannot be empty.'
  } else if (message.value.trim().length <= 10) {
    messageError.value = 'Message must be more than 10 characters.'
  } else {
    messageError.value = ''
  }
}
</script>
