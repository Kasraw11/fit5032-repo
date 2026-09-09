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

              <p class="mb-2">Rate event:</p>
              <button
                v-for="rating in 5"
                :key="rating"
                type="button"
                class="btn btn-outline-primary me-2"
                @click="rateEvent(event.id, rating)"
              >
                {{ rating }}
              </button>

              <p v-if="ratings[event.id]" class="text-success mt-3 mb-0">
                You rated this event {{ ratings[event.id] }}/5.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { reactive } from 'vue'
import events from '../data/event.json'

const savedRatings = JSON.parse(localStorage.getItem('eventRatings')) || {}
const ratings = reactive(savedRatings)

const rateEvent = (eventId, rating) => {
  ratings[eventId] = rating
  localStorage.setItem('eventRatings', JSON.stringify(ratings))
}
</script>
