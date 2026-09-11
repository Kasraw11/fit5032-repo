<template>
  <main>
    <PageHero
      title="Events"
      subtitle="Browse, register for, and manage sustainability events."
      :image="events_hero"
    />

    <section class="container py-5">
      <div class="row g-4">
        <div v-for="event in events" :key="event.id" class="col-12 col-md-6">
          <div class="card h-100">
            <div class="card-body">
              <h2 class="card-title h4">{{ event.name }}</h2>
              <p class="card-text"><strong>Date:</strong> {{ event.date }}</p>
              <p class="card-text"><strong>Location:</strong> {{ event.location }}</p>
              <p class="card-text">{{ event.description }}</p>

              <p class="mb-1">
                <strong>Average Rating: </strong>
                <span v-if="getRatingCount(event.id) > 0">
                  {{ getAverageRating(event.id) }}
                </span>
                <span v-else>No ratings yet</span>
              </p>
              <p class="mb-0">reviews: {{ getRatingCount(event.id) }}</p>

              <div class="mt-4">
                <label :for="`rating-${event.id}`" class="form-label">Rating:</label>
                <select
                  :id="`rating-${event.id}`"
                  v-model="selectedRatings[event.id]"
                  class="form-select mb-3"
                >
                  <option value="">Choose a rating</option>
                  <option v-for="rating in 5" :key="rating" :value="rating">
                    {{ rating }}
                  </option>
                </select>

                <button type="button" class="btn btn-primary" @click="submitRating(event.id)">
                  Submit Rating
                </button>

                <p
                  v-if="messages[event.id]"
                  class="mt-3 mb-0"
                  :class="{
                    'text-danger': messages[event.id] === 'Please select a rating from 1 to 5.',
                    'text-success': messages[event.id] === 'Your rating has been updated.',
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
  </main>
</template>

<script setup>
import { ref } from 'vue'
import events from '../data/event.json'
import PageHero from '@/components/PageHero.vue'
import events_hero from '@/assets/images/events_hero.png'

const currentUser = ref(JSON.parse(sessionStorage.getItem('currentUser')))
const selectedRatings = ref({})
const messages = ref({})
const ratings = ref(JSON.parse(localStorage.getItem('ratings')) || [])

const getEventRatings = (eventId) => {
  return ratings.value.filter((rating) => rating.eventId === eventId)
}

const getAverageRating = (eventId) => {
  const eventRatings = getEventRatings(eventId)
  const total = eventRatings.reduce((sum, rating) => sum + rating.rating, 0)

  return (total / eventRatings.length).toFixed(1)
}

const getRatingCount = (eventId) => {
  return getEventRatings(eventId).length
}

const submitRating = (eventId) => {
  const rating = Number(selectedRatings.value[eventId])

  if (!rating || rating < 1 || rating > 5) {
    messages.value[eventId] = 'Please select a rating from 1 to 5.'
    return
  }

  const existingRatingIndex = ratings.value.findIndex(
    (savedRating) => savedRating.eventId === eventId && savedRating.userId === currentUser.value.id,
  )

  const ratingToSave = {
    eventId: eventId,
    userId: currentUser.value.id,
    rating: rating,
  }

  if (existingRatingIndex === -1) {
    ratings.value.push(ratingToSave)
    messages.value[eventId] = 'Your rating has been saved.'
  } else {
    ratings.value[existingRatingIndex] = ratingToSave
    messages.value[eventId] = 'Your rating has been updated.'
  }

  localStorage.setItem('ratings', JSON.stringify(ratings.value))
}
</script>
