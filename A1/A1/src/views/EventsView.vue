<template>
  <main>
    <PageHero
      title="Events"
      subtitle="Browse, register for, and manage sustainability events."
      :image="public_hero"
    />

    <section class="container py-5">
      <div class="d-flex flex-wrap align-items-end gap-3 mb-4">
        <fieldset class="mb-0">
          <legend class="h6">View events as</legend>
          <div class="btn-group">
            <input
              id="events-cards"
              v-model="viewMode"
              type="radio"
              name="event-view"
              value="cards"
              class="btn-check"
            />
            <label for="events-cards" class="btn btn-outline-primary btn-sm">Cards</label>
            <input
              id="events-list"
              v-model="viewMode"
              type="radio"
              name="event-view"
              value="list"
              class="btn-check"
            />
            <label for="events-list" class="btn btn-outline-primary btn-sm">List</label>
          </div>
        </fieldset>
        <div>
          <label for="event-category" class="form-label">Category</label>
          <select
            id="event-category"
            v-model="selectedCategory"
            class="form-select form-select-sm"
            :disabled="isLoading"
            @change="closeDetails"
          >
            <option value="">All categories</option>
            <option v-for="category in eventCategories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
      </div>
      <p v-if="isLoading" role="status">Loading events...</p>
      <div v-else-if="loadError" class="alert alert-danger" role="alert">
        <p>{{ loadError }}</p>
        <button type="button" class="btn btn-outline-danger" @click="loadEvents">Try Again</button>
      </div>
      <p v-else-if="events.length === 0">No events are available yet.</p>
      <p v-else-if="filteredEvents.length === 0" role="status">No events match this category.</p>
      <div v-else class="row" :class="viewMode === 'list' ? 'g-2 event-list' : 'g-4'">
        <div
          v-for="event in filteredEvents"
          :key="event.id"
          :class="viewMode === 'cards' ? 'col-12 col-md-6' : 'col-12'"
        >
          <div class="card card-gradient-2 h-100">
            <div class="card-body">
              <div class="event-summary">
                <div class="event-heading">
                  <h2 class="card-title" :class="viewMode === 'list' ? 'h6 mb-1' : 'h4'">
                    {{ event.name }}
                  </h2>
                  <span v-if="viewMode === 'list'" class="badge bg-primary mb-1">
                    {{ event.category || 'Uncategorised' }}
                  </span>
                  <p class="card-text"><strong>Date:</strong> {{ formatDate(event.date) }}</p>
                </div>
                <div v-if="viewMode === 'cards'">
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
                </div>
                <div class="event-buttons d-flex flex-wrap gap-2">
                  <button
                    v-if="viewMode === 'list'"
                    type="button"
                    class="btn btn-outline-primary btn-sm"
                    :aria-expanded="expandedEventId === event.id"
                    :aria-controls="'event-details-' + event.id"
                    @click="toggleDetails(event.id)"
                  >
                    {{ expandedEventId === event.id ? 'Hide details' : 'View details' }}
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-primary btn-sm"
                    @click="saveEvent(event)"
                  >
                    Save Event
                  </button>
                </div>
                <p v-if="saveMessages[event.id]" class="text-success mt-3 mb-0" role="status">
                  {{ saveMessages[event.id] }}
                </p>
              </div>
              <div
                v-show="viewMode === 'cards' || expandedEventId === event.id"
                :id="'event-details-' + event.id"
                class="event-interactions"
              >
                <div v-if="viewMode === 'list'" class="mb-3">
                  <p v-if="event.category"><strong>Category:</strong> {{ event.category }}</p>
                  <p><strong>Address:</strong> {{ event.address || 'Address not provided' }}</p>
                  <p>{{ event.description }}</p>
                  <RouterLink
                    v-if="hasValidLocation(event)"
                    class="btn btn-outline-primary btn-sm"
                    :to="{ name: 'locations', query: { eventId: event.id } }"
                    >View on Map</RouterLink
                  >
                  <p v-else class="text-muted">Map location not available yet.</p>
                </div>
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
                  <label :for="'rating-' + event.id" class="form-label">Rating:</label>
                  <select
                    :id="'rating-' + event.id"
                    v-model="selectedRatings[event.id]"
                    class="form-select mb-3"
                    :disabled="isRatingDisabled(event.id)"
                  >
                    <option value="">Choose a rating</option>
                    <option v-for="rating in 5" :key="rating" :value="rating">
                      {{ rating }}
                    </option>
                  </select>
                  <button
                    type="button"
                    class="btn btn-primary"
                    :disabled="isRatingDisabled(event.id)"
                    @click="submitRating(event.id)"
                  >
                    Submit Rating
                  </button>
                  <p v-if="savingReviews[event.id]" class="mt-3 mb-0" role="status">
                    Saving rating...
                  </p>

                  <p
                    v-if="messages[event.id]"
                    class="mt-3 mb-0"
                    role="status"
                    :class="
                      messages[event.id] === 'Your rating has been saved.'
                        ? 'text-success'
                        : 'text-danger'
                    "
                  >
                    {{ messages[event.id] }}
                  </p>
                </div>
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
import { computed, onMounted, ref } from 'vue'
import { collection, doc, getDocs, setDoc } from 'firebase/firestore'
import { db } from '@/firebase/init'
import PageHero from '@/components/PageHero.vue'
import public_hero from '@/assets/images/public_hero.png'
import { currentUser } from '@/authentication'

const events = ref([])
const viewMode = ref('cards')
const expandedEventId = ref('')
const selectedCategory = ref('')
const eventCategories = computed(() => {
  const categories = []
  for (const event of events.value) {
    const category = event.category || 'Uncategorised'
    if (!categories.includes(category)) categories.push(category)
  }
  return categories.sort()
})

const filteredEvents = computed(() => {
  if (selectedCategory.value === '') return events.value
  const results = []
  for (const event of events.value) {
    const category = event.category || 'Uncategorised'
    if (category === selectedCategory.value) results.push(event)
  }
  return results
})

const isLoading = ref(false)
const loadError = ref('')
const selectedRatings = ref({})
const messages = ref({})
const saveMessages = ref({})
const reviews = ref({})
const loadingReviews = ref({})
const savingReviews = ref({})
const reviewLoadErrors = ref({})

function toggleDetails(eventId) {
  if (expandedEventId.value === eventId) {
    expandedEventId.value = ''
  } else {
    expandedEventId.value = eventId
  }
}

function closeDetails() {
  expandedEventId.value = ''
}

function isRatingDisabled(eventId) {
  if (!currentUser.value) return true
  if (loadingReviews.value[eventId]) return true
  if (savingReviews.value[eventId]) return true
  if (reviewLoadErrors.value[eventId]) return true
  return false
}

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
    events.value = []
    for (const document of snapshot.docs) {
      const event = document.data()
      event.id = document.id
      events.value.push(event)
    }
    for (const event of events.value) {
      await loadReviews(event.id)
    }
  } catch {
    loadError.value = 'Unable to load events. Please try again.'
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
      selectedRatings.value[eventId] = ''
      for (const review of eventReviews) {
        if (review.userId === user.uid) {
          selectedRatings.value[eventId] = review.rating
          break
        }
      }
    }
    return true
  } catch {
    reviewLoadErrors.value[eventId] = 'Unable to load ratings. Please try again.'
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
  } catch {
    messages.value[eventId] = 'Unable to save your rating.'
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

  for (const savedEvent of savedEvents) {
    if (savedEvent.id === event.id) {
      saveMessages.value[event.id] = 'This event is already saved.'
      return
    }
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

<style scoped>
.event-summary,
.event-interactions {
  min-width: 0;
  overflow-wrap: anywhere;
}

.event-list .card-body {
  padding: 0.85rem 1rem;
}

.event-list .event-summary {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.event-list .event-heading p {
  margin-bottom: 0;
  font-size: 0.875rem;
}

.event-list .event-interactions {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #d9e2ea;
}
</style>
