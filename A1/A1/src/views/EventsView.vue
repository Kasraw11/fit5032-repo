<template>
  <main>
    <section class="page-hero">
      <div class="container">
        <h1>Events</h1>
        <p>Browse, register for, and manage sustainability events.</p>
      </div>
    </section>

    <section class="container py-5">
      <div class="row g-4">
        <div v-for="event in events" :key="event.id" class="col-12 col-md-6">
          <div class="card h-100">
            <div class="card-body">
              <h2 class="card-title h4">{{ event.name }}</h2>
              <p class="card-text"><strong>Date:</strong> {{ event.date }}</p>
              <p class="card-text"><strong>Location:</strong> {{ event.location }}</p>
              <p class="card-text">{{ event.description }}</p>

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

                <button
                  type="button"
                  class="btn btn-primary"
                  @click="submitRating(event.id)"
                >
                  Submit Rating
                </button>

                <p v-if="messages[event.id]" class="mt-3 mb-0">
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

const currentUser = ref(JSON.parse(sessionStorage.getItem('currentUser')))
const selectedRatings = ref({})
const messages = ref({})

const submitRating = (eventId) => {
  const rating = Number(selectedRatings.value[eventId])

  if (rating < 1 || rating > 5) {
    messages.value[eventId] = 'Please select a rating from 1 to 5.'
    return
  }

  const ratings = JSON.parse(localStorage.getItem('ratings')) || []
  const existingRatingIndex = ratings.findIndex(
    (savedRating) =>
      savedRating.eventId === eventId && savedRating.userId === currentUser.value.id,
  )

  const ratingToSave = {
    eventId: eventId,
    userId: currentUser.value.id,
    rating: rating,
  }

  if (existingRatingIndex === -1) {
    ratings.push(ratingToSave)
    messages.value[eventId] = 'Your rating has been saved.'
  } else {
    ratings[existingRatingIndex] = ratingToSave
    messages.value[eventId] = 'Your rating has been updated.'
  }

  localStorage.setItem('ratings', JSON.stringify(ratings))
}
</script>
