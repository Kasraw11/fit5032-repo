<template>
  <main class="container-fluid p-3">
    <PageHero
      title="My Events"
      subtitle="Manage your saved events and notification preferences."
      :image="public_hero"
    />
    <div class="row mt-4">
      <aside class="col-12 col-md-3 mb-3">
        <AccountSidebar />
      </aside>

      <section class="col-12 col-md-6">
        <div class="card card-gradient-1 shadow-sm mb-4 py-3">
          <h2 class="h5 p-1">Upcoming Events</h2>
          <p class="mb-0">Your upcoming events will appear here.</p>
        </div>

        <div class="card card-gradient-1 shadow-sm mb-4 py-3">
          <h2 class="h5 p-1">Event History</h2>
          <p class="mb-0">Events you attended in the past will appear here.</p>
        </div>

        <div class="card card-gradient-1 shadow-sm mb-4 py-3">
          <h2 ref="savedEventsHeading" class="h5 p-1" tabindex="-1">Saved Events</h2>
          <FeedbackMessage v-model:message="savedEventMessage" />
          <FeedbackMessage v-model:message="savedEventError" type="error" />

          <p v-if="savedEvents.length === 0" class="mb-0">You have not saved any events yet.</p>

          <div
            v-for="event in savedEvents"
            :key="event.id"
            class="card card-gradient-7 shadow-sm mb-4 py-3"
          >
            <h3 class="h6">{{ event.name }}</h3>
            <p><strong>Date:</strong> {{ event.date }}</p>
            <p>
              <strong>Address:</strong>
              {{
                event.address ||
                (typeof event.location === 'string' ? event.location : 'Address not provided')
              }}
            </p>
            <RouterLink
              v-if="
                event.location &&
                typeof event.location.latitude === 'number' &&
                typeof event.location.longitude === 'number'
              "
              class="btn btn-outline-primary btn-sm align-self-start"
              :to="{ name: 'locations', query: { eventId: event.id } }"
              >View on Map</RouterLink
            >
            <button
              type="button"
              class="btn btn-outline-danger btn-sm mt-2 align-self-start"
              :aria-label="'Remove ' + event.name + ' from saved events'"
              @click="removeSavedEvent(event.id)"
            >
              Remove saved event
            </button>
          </div>
        </div>
        <form
          id="event-notifications"
          class="card p-3"
          novalidate
          @submit.prevent="saveNotifications"
        >
          <h2 class="h5 p-1">Notification Preferences</h2>
          <p v-if="!currentUser" class="text-danger" role="alert">
            Sign in to manage your event notifications.
          </p>
          <p v-if="isLoadingNotifications" role="status">Loading your event notifications...</p>
          <p v-if="notificationError" class="text-danger" role="alert">{{ notificationError }}</p>
          <button
            v-if="!notificationsLoaded && notificationError"
            type="button"
            class="btn btn-outline-secondary mb-3 align-self-start"
            :disabled="isLoadingNotifications || isSavingNotifications || !currentUser"
            @click="loadNotifications"
          >
            Try Again
          </button>
          <fieldset
            :disabled="
              !currentUser ||
              !notificationsLoaded ||
              isLoadingNotifications ||
              isSavingNotifications
            "
          >
            <legend class="visually-hidden">Notification preferences</legend>
            <div class="mb-3">
              <label for="notification-email" class="form-label">Notification Email</label>
              <input
                id="notification-email"
                v-model="notificationEmail"
                type="email"
                class="form-control"
                autocomplete="email"
                maxlength="254"
                required
                :aria-invalid="Boolean(notificationEmailError)"
                :aria-describedby="notificationEmailError ? 'notification-email-error' : undefined"
                @input="clearEmailMessage"
              />
              <p
                v-if="notificationEmailError"
                id="notification-email-error"
                class="text-danger mt-1 mb-0"
                role="alert"
              >
                {{ notificationEmailError }}
              </p>
            </div>
            <p>Choose which SmartLoop updates you want to hear about:</p>
            <div v-for="category in notificationCategories" :key="category" class="form-check mb-2">
              <input
                :id="'notification-' + category.replaceAll(' ', '-')"
                v-model="selectedCategories"
                class="form-check-input"
                type="checkbox"
                :value="category"
                @change="notificationMessage = ''"
              />
              <label
                class="form-check-label"
                :for="'notification-' + category.replaceAll(' ', '-')"
              >
                {{ category }}
              </label>
            </div>
            <button type="submit" class="btn btn-primary mt-2">Save Notifications</button>
          </fieldset>
          <p v-if="isSavingNotifications" class="mt-3 mb-0" role="status">
            Saving notifications...
          </p>
          <FeedbackMessage v-model:message="notificationMessage" />
        </form>
      </section>
    </div>
  </main>
</template>

<script setup>
import PageHero from '@/components/PageHero.vue'
import public_hero from '@/assets/images/public_hero.png'
import FeedbackMessage from '@/components/FeedbackMessage.vue'
import { nextTick, ref, watch } from 'vue'
import { getAuth } from 'firebase/auth'
import { collection, doc, getDocs, query, where, writeBatch } from 'firebase/firestore'
import { db } from '@/firebase/init'
import AccountSidebar from '@/components/AccountSidebar.vue'
import { currentUser } from '@/authentication'

const savedEvents = ref([])
const savedEventsHeading = ref(null)
const savedEventMessage = ref('')
const savedEventError = ref('')

async function removeSavedEvent(eventId) {
  const user = currentUser.value
  if (!user) return
  savedEventMessage.value = ''
  savedEventError.value = ''
  try {
    const storageKey = 'savedEvents-' + user.uid
    const storedEvents = JSON.parse(localStorage.getItem(storageKey))
    if (!Array.isArray(storedEvents)) throw new Error('Saved events unavailable.')
    const remainingEvents = storedEvents.filter((event) => event.id !== eventId)
    localStorage.setItem(storageKey, JSON.stringify(remainingEvents))
    savedEvents.value = remainingEvents
    savedEventMessage.value = 'Event removed from saved events.'
    await nextTick()
    savedEventsHeading.value?.focus()
  } catch {
    savedEventError.value = 'Unable to remove this saved event. Please try again.'
  }
}

function loadSavedEvents() {
  savedEventMessage.value = ''
  savedEventError.value = ''
  savedEvents.value = []
  if (!currentUser.value) return
  try {
    const saved = JSON.parse(localStorage.getItem('savedEvents-' + currentUser.value.uid))
    if (Array.isArray(saved)) savedEvents.value = saved
  } catch {
    savedEvents.value = []
  }
}

watch(() => currentUser.value?.uid, loadSavedEvents, { immediate: true })
const auth = getAuth()
const notificationEmail = ref(auth.currentUser?.email || '')
const notificationEmailError = ref('')
const notificationCategories = [
  'Donations',
  'Workshops',
  'Events',
  'Recycling Centres',
  'Repair Centres',
]
const selectedCategories = ref([])
const loadedSubscriptions = ref([])
const notificationsLoaded = ref(false)
const isLoadingNotifications = ref(false)
const isSavingNotifications = ref(false)
const notificationError = ref('')
const notificationMessage = ref('')

function clearEmailMessage() {
  notificationEmailError.value = ''
  notificationMessage.value = ''
}

async function loadNotifications() {
  const user = auth.currentUser
  notificationEmail.value = user?.email || ''
  notificationEmailError.value = ''
  selectedCategories.value = []
  loadedSubscriptions.value = []
  notificationsLoaded.value = false
  notificationError.value = ''
  notificationMessage.value = ''
  isLoadingNotifications.value = false
  if (!user) return

  isLoadingNotifications.value = true
  try {
    const subscriptionsQuery = query(
      collection(db, 'categorySubscriptions'),
      where('userId', '==', user.uid),
    )
    const snapshot = await getDocs(subscriptionsQuery)
    if (auth.currentUser?.uid !== user.uid) return
    let savedEmailLoaded = false
    snapshot.forEach((item) => {
      const subscription = item.data()
      loadedSubscriptions.value.push({ id: item.id, category: subscription.category })
      if (
        notificationCategories.includes(subscription.category) &&
        !selectedCategories.value.includes(subscription.category)
      ) {
        selectedCategories.value.push(subscription.category)
      }
      if (
        !savedEmailLoaded &&
        typeof subscription.email === 'string' &&
        subscription.email.trim()
      ) {
        notificationEmail.value = subscription.email
        savedEmailLoaded = true
      }
    })
    notificationsLoaded.value = true
  } catch {
    if (auth.currentUser?.uid === user.uid) {
      notificationError.value = 'Unable to load your notification preferences. Please try again.'
    }
  } finally {
    if (auth.currentUser?.uid === user.uid) isLoadingNotifications.value = false
  }
}

async function saveNotifications() {
  const user = auth.currentUser
  if (
    !user ||
    !notificationsLoaded.value ||
    isLoadingNotifications.value ||
    isSavingNotifications.value
  )
    return
  notificationError.value = ''
  notificationMessage.value = ''
  notificationEmailError.value = ''
  const email = notificationEmail.value.trim()
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    notificationEmailError.value = 'Enter a valid notification email address.'
    document.getElementById('notification-email')?.focus()
    return
  }

  isSavingNotifications.value = true
  const categories = [...selectedCategories.value]
  try {
    const batch = writeBatch(db)
    notificationCategories.forEach((category) => {
      const subscription = doc(db, 'categorySubscriptions', user.uid + '_' + category)
      if (categories.includes(category)) {
        batch.set(subscription, { userId: user.uid, email, category })
      }
    })
    loadedSubscriptions.value.forEach((subscription) => {
      if (
        !categories.includes(subscription.category) ||
        subscription.id !== user.uid + '_' + subscription.category
      ) {
        batch.delete(doc(db, 'categorySubscriptions', subscription.id))
      }
    })
    await batch.commit()
    if (auth.currentUser?.uid !== user.uid) return
    notificationEmail.value = email
    loadedSubscriptions.value = categories.map((category) => ({
      id: user.uid + '_' + category,
      category,
    }))
    notificationMessage.value = 'Your notification preferences have been updated.'
  } catch {
    if (auth.currentUser?.uid === user.uid) {
      notificationError.value = 'Unable to save your notification preferences. Please try again.'
    }
  } finally {
    isSavingNotifications.value = false
  }
}

watch(() => currentUser.value?.uid, loadNotifications, { immediate: true })
</script>
