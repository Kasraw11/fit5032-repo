<template>
  <main class="container-fluid p-3">
    <div class="row">
      <aside class="col-12 col-md-3 mb-3">
        <AccountSidebar />
      </aside>

      <section class="col-12 col-md-9">
        <h1 class="h2 mb-3">My Events</h1>

        <div class="card p-3 mb-3">
          <h2 class="h5">Upcoming Events</h2>
          <p class="mb-0">Your upcoming events will appear here.</p>
        </div>

        <div class="card p-3 mb-3">
          <h2 class="h5">Event History</h2>
          <p class="mb-0">Events you attended in the past will appear here.</p>
        </div>

        <div class="card p-3 mb-3">
          <h2 class="h5">Saved Events</h2>

          <p v-if="savedEvents.length === 0" class="mb-0">You have not saved any events yet.</p>

          <div v-for="event in savedEvents" :key="event.id" class="border rounded p-3 mt-3">
            <h3 class="h6">{{ event.name }}</h3>
            <p><strong>Date:</strong> {{ event.date }}</p>
            <p class="mb-0"><strong>Location:</strong> {{ event.location }}</p>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import AccountSidebar from '@/components/AccountSidebar.vue'
import { currentUser } from '@/authentication'
import PageHero from '@/components/PageHero.vue'
import public_hero from '@/assets/images/public_hero.png'

const storageKey = `savedEvents-${currentUser.value.uid}`

const savedEvents = JSON.parse(localStorage.getItem(storageKey)) || []
</script>
