<template>
  <main>
    <PageHero
      title="Events"
      subtitle="Browse, register for, and manage sustainability events."
      :image="public_hero"
    />

    <section class="container py-5">
      <p v-if="isLoading" role="status">Loading events...</p>
      <div v-else-if="loadError" class="alert alert-danger" role="alert">
        <p>{{ loadError }}</p>
        <button type="button" class="btn btn-outline-danger" @click="loadEvents">Try Again</button>
      </div>
      <p v-else-if="events.length === 0">No events are available yet.</p>
      <div v-else class="row g-4">
        <div v-for="event in events" :key="event.id" class="col-12 col-md-6">
          <div class="card h-100">
            <div class="card-body">
              <h2 class="card-title h4">{{ event.name }}</h2>
              <p class="card-text"><strong>Date:</strong> {{ formatDate(event.date) }}</p>
              <p class="card-text">
                <strong>Address:</strong> {{ event.address || 'Address not provided' }}
              </p>
              <p class="card-text">{{ event.description }}</p>

              <RouterLink
                v-if="hasValidLocation(event)"
                class="btn btn-outline-primary mb-3"
                :to="{ name: 'locations', query: { eventId: event.id } }"
                >View on Map</RouterLink
              >
              <p v-else class="text-muted">Map location not available yet.</p>

              <p v-if="loadingReviews[event.id]" role="status">Loading ratings...</p>
              <div v-else-if="reviewLoadErrors[event.id]" class="mb-3">
                <p class="text-danger" role="alert">{{ reviewLoadErrors[event.id] }}</p>
                <button
                  type="button"
                  class="btn btn-outline-primary"
                  :disabled="savingReviews[event.id]"
                  @click="loadReviews(event.id)"
                >
                  Try Again
                </button>
              </div>
              <div v-else>
                <p class="mb-1">
                  <strong>Average Rating: </strong>
                  <span v-if="getRatingCount(event.id) > 0">
                    {{ getAverageRating(event.id) }} / 5
                  </span>
                  <span v-else>No ratings yet</span>
                </p>
                <p class="mb-0">
                  {{ getRatingCount(event.id) }}
                  {{ getRatingCount(event.id) === 1 ? 'rating' : 'ratings' }}
                </p>
              </div>

              <div class="mt-4">
                <label :for="`rating-${event.id}`" class="form-label">Rating:</label>
                <select
                  :id="`rating-${event.id}`"
                  v-model="selectedRatings[event.id]"
                  class="form-select mb-3"
                  :disabled="
                    !currentUser ||
                    loadingReviews[event.id] ||
                    savingReviews[event.id] ||
                    !!reviewLoadErrors[event.id]
                  "
                >
                  <option value="">Choose a rating</option>
                  <option v-for="rating in 5" :key="rating" :value="rating">
                    {{ rating }}
                  </option>
                </select>
                <div class="d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    class="btn btn-primary"
                    :disabled="
                      !currentUser ||
                      loadingReviews[event.id] ||
                      savingReviews[event.id] ||
                      !!reviewLoadErrors[event.id]
                    "
                    @click="submitRating(event.id)"
                  >
                    Submit Rating
                  </button>
                  <button type="button" class="btn btn-outline-primary" @click="saveEvent(event)">
                    Save Event
                  </button>
                </div>
                <p v-if="savingReviews[event.id]" class="mt-3 mb-0" role="status">
                  Saving rating...
                </p>
                <p v-if="saveMessages[event.id]" class="text-success mt-3 mb-0">
                  {{ saveMessages[event.id] }}
                </p>

                <p
                  v-if="messages[event.id]"
                  class="mt-3 mb-0"
                  role="status"
                  :class="{
                    'text-success': messages[event.id] === 'Your rating has been saved.',
                    'text-danger': messages[event.id] !== 'Your rating has been saved.',
                  }"
                >
                  {{ messages[event.id] }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="container pb-5">
      <RouterLink class="btn btn-outline-primary" to="/account/my-events">
        Manage event notifications
      </RouterLink>
    </section>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { collection, doc, getDocs, setDoc } from 'firebase/firestore'
import { db } from '@/firebase/init'
import PageHero from '@/components/PageHero.vue'
import public_hero from '@/assets/images/public_hero.png'
import { currentUser } from '@/authentication'

const events = ref([])
const isLoading = ref(false)
const loadError = ref('')
const selectedRatings = ref({})
const messages = ref({})
const saveMessages = ref({})
const reviews = ref({})
const loadingReviews = ref({})
const savingReviews = ref({})
const reviewLoadErrors = ref({})

function readSavedArray(key) {
  try {
    const saved = JSON.parse(localStorage.getItem(key))
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

async function loadEvents() {
  if (isLoading.value) return
  isLoading.value = true
  loadError.value = ''
  try {
    const snapshot = await getDocs(collection(db, 'events'))
    events.value = snapshot.docs.map((item) => ({ ...item.data(), id: item.id }))
    for (const event of events.value) {
      await loadReviews(event.id)
    }
  } catch (error) {
    loadError.value = 'Unable to load events. Please try again.'
    console.error('Unable to load events:', error)
  } finally {
    isLoading.value = false
  }
}

function hasValidLocation(event) {
  const latitude = event.location?.latitude
  const longitude = event.location?.longitude
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  )
}

function formatDate(value) {
  if (!value) return 'Date not provided'
  let date
  if (typeof value.toDate === 'function') date = value.toDate()
  else date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Date not provided'
  return date.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Australia/Sydney',
  })
}

function getEventRatings(eventId) {
  return reviews.value[eventId] || []
}

function getAverageRating(eventId) {
  const eventRatings = getEventRatings(eventId)
  if (eventRatings.length === 0) return '0.0'
  let total = 0
  for (const review of eventRatings) {
    total += review.rating
  }

  return (total / eventRatings.length).toFixed(1)
}

function getRatingCount(eventId) {
  return getEventRatings(eventId).length
}

async function loadReviews(eventId) {
  if (loadingReviews.value[eventId]) return false
  loadingReviews.value[eventId] = true
  reviewLoadErrors.value[eventId] = ''
  const user = currentUser.value
  try {
    const snapshot = await getDocs(collection(db, 'events', eventId, 'reviews'))
    const eventReviews = []
    for (const item of snapshot.docs) {
      const review = item.data()
      if (!Number.isInteger(review.rating) || review.rating < 1 || review.rating > 5) continue
      eventReviews.push({ userId: item.id, rating: review.rating })
    }
    reviews.value[eventId] = eventReviews
    if (user && currentUser.value?.uid === user.uid) {
      const ownReview = eventReviews.find((review) => review.userId === user.uid)
      selectedRatings.value[eventId] = ownReview ? ownReview.rating : ''
    }
    return true
  } catch (error) {
    reviewLoadErrors.value[eventId] = 'Unable to load ratings. Please try again.'
    console.error('Unable to load ratings:', error)
    return false
  } finally {
    loadingReviews.value[eventId] = false
  }
}

async function submitRating(eventId) {
  if (savingReviews.value[eventId] || loadingReviews.value[eventId]) return
  messages.value[eventId] = ''
  const user = currentUser.value
  if (!user) {
    messages.value[eventId] = 'You must be signed in to submit a rating.'
    return
  }
  const rating = Number(selectedRatings.value[eventId])

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    messages.value[eventId] = 'Please select a rating from 1 to 5.'
    return
  }

  savingReviews.value[eventId] = true
  try {
    await setDoc(doc(db, 'events', eventId, 'reviews', user.uid), {
      rating,
    })
    messages.value[eventId] = 'Your rating has been saved.'
    await loadReviews(eventId)
  } catch (error) {
    messages.value[eventId] = 'Unable to save your rating.'
    console.error('Unable to save your rating:', error)
  } finally {
    savingReviews.value[eventId] = false
  }
}

function saveEvent(event) {
  const user = currentUser.value

  if (!user) {
    return
  }

  const storageKey = `savedEvents-${user.uid}`
  const savedEvents = readSavedArray(storageKey)

  const alreadySaved = savedEvents.some((savedEvent) => savedEvent.id === event.id)

  if (alreadySaved) {
    saveMessages.value[event.id] = 'This event is already saved.'
    return
  }

  const savedEvent = {
    id: event.id,
    name: event.name,
    date: formatDate(event.date),
    address: event.address || '',
  }
  if (hasValidLocation(event)) {
    savedEvent.location = { latitude: event.location.latitude, longitude: event.location.longitude }
  }
  savedEvents.push(savedEvent)
  try {
    localStorage.setItem(storageKey, JSON.stringify(savedEvents))
    saveMessages.value[event.id] = 'Event saved successfully.'
  } catch {
    saveMessages.value[event.id] = 'Unable to save this event on this device.'
  }
}
onMounted(loadEvents)
</script>
