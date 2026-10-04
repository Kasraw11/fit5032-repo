<template>
  <main>
    <PageHero
      title="Map & Locations"
      subtitle="Find sustainability events and recycling locations near you."
      :image="public_hero"
    />

    <div class="container py-5">
      <section class="mb-4">
        <div class="row">
          <div class="col-12 col-md-6">
            <label class="form-label" for="location-filter">Filter locations</label>
            <select class="form-select" id="location-filter">
              <option value="all">All</option>
              <option value="events">Events</option>
              <option value="recycling">Recycling Locations</option>
              <option value="donation">Donation Centers</option>
            </select>
          </div>
        </div>
      </section>

      <div id="map" class="mb-4" style="height: 500px"></div>

      <div class="justify-content-center row">
        <div class="col-12 col-md-6">
          <section class="card card-gradient-1" aria-labelledby="selected-location-heading">
            <div class="card-body p-3">
              <h2 class="h5" id="selected-location-heading">Selected Location</h2>
              <p class="mb-0">Select a location on the map to view more information.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import PageHero from '@/components/PageHero.vue'
import public_hero from '@/assets/images/public_hero.png'
import { onMounted, onUnmounted } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

let map

onMounted(() => {
  map = new mapboxgl.Map({
    accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [145.13, -37.91],
    zoom: 11,
  })
})

onUnmounted(() => {
  if (map) {
    map.remove()
  }
})
</script>
