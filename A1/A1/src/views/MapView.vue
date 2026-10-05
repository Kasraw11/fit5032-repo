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
            <select
              class="form-select"
              id="location-filter"
              v-model="selectedFilter"
              @change="updateMarkers"
            >
              <option value="all">All</option>
              <option value="events">Events</option>
              <option value="recycling">Recycling Locations</option>
              <option value="donation">Donation Centers</option>
              <option value="repair">Repair Services</option>
            </select>
          </div>
        </div>
      </section>

      <section class="mb-4" aria-label="Starting location">
        <button type="button" class="btn btn-primary" :disabled="isLocating" @click="useMyLocation">
          Use My Location
        </button>
        <p class="mt-2 mb-0">Or click an empty area of the map to pin your starting location.</p>
        <div class="mt-2" aria-live="polite">
          <p v-if="isLocating" class="mb-0" role="status">Finding your current location...</p>
          <p v-if="originError" class="text-danger mb-0" role="alert">{{ originError }}</p>
          <p v-if="originLocation" class="mb-0">Starting location: {{ originLocation.name }}</p>
        </div>
      </section>

      <p v-if="isLoading" role="status">Loading map locations...</p>
      <p v-if="loadError" class="text-danger" role="alert">{{ loadError }}</p>
      <p v-if="eventMessage" class="text-danger" role="alert">{{ eventMessage }}</p>

      <div id="map" class="mb-4" style="height: 500px"></div>

      <div class="row g-4">
        <div class="col-12 col-md-6">
          <section
            class="card card-gradient-7 shadow-sm h-100"
            aria-labelledby="selected-location-heading"
          >
            <div class="card-header card-gradient-1 border-0 p-4">
              <h2 class="h5 mb-0" id="selected-location-heading">Selected Location</h2>
            </div>
            <div class="card-body p-4" aria-live="polite">
              <p v-if="!selectedItem" class="text-muted mb-0">
                Select a location on the map to view more information.
              </p>
              <div v-else>
                <span class="badge bg-primary mb-3">
                  {{ selectedKind === 'event' ? 'Event' : locationTypeLabel(selectedItem.type) }}
                </span>
                <h3 class="h4 mb-3">{{ selectedItem.name || 'Unnamed location' }}</h3>
                <p v-if="selectedKind === 'location' && selectedItem.description" class="mb-3">
                  {{ selectedItem.description }}
                </p>
                <dl class="mb-0">
                  <dt class="small text-muted">Address</dt>
                  <dd>{{ selectedItem.address || 'Address not provided' }}</dd>
                  <template v-if="selectedKind === 'event' && selectedItem.category">
                    <dt class="small text-muted">Category</dt>
                    <dd>{{ selectedItem.category }}</dd>
                  </template>
                  <template v-if="selectedKind === 'event' && selectedItem.date">
                    <dt class="small text-muted">Date</dt>
                    <dd class="mb-0">{{ formatDate(selectedItem.date) }}</dd>
                  </template>
                </dl>
              </div>
            </div>
          </section>
        </div>

        <div class="col-12 col-md-6">
          <section
            class="card card-gradient-7 shadow-sm h-100"
            aria-labelledby="directions-heading"
          >
            <div class="card-header card-gradient-1 border-0 p-4">
              <h2 class="h5 mb-0" id="directions-heading">Directions</h2>
            </div>
            <div class="card-body p-4" aria-live="polite">
              <p class="text-muted mb-3">Plan a driving route to your selected location.</p>
              <dl class="mb-3">
                <dt class="small text-muted">Starting location</dt>
                <dd>
                  {{ originLocation ? originLocation.name : 'Use My Location or pin the map.' }}
                </dd>
                <dt class="small text-muted">Destination</dt>
                <dd class="mb-0">
                  {{
                    selectedItem ? selectedItem.name || 'Unnamed location' : 'Select a map marker.'
                  }}
                </dd>
              </dl>
              <button
                type="button"
                class="btn btn-primary w-100"
                :disabled="isRouting"
                @click="getDirections"
              >
                Get Directions
              </button>
              <p v-if="isRouting" class="mt-2 mb-0" role="status">Calculating directions...</p>
              <p v-if="directionsError" class="text-danger mt-2 mb-0" role="alert">
                {{ directionsError }}
              </p>
              <div v-if="tripInformation" class="mt-4 pt-3 border-top">
                <h3 class="h6 mb-3">Trip Information</h3>
                <div class="row g-3">
                  <div class="col-6">
                    <p class="small text-muted mb-1">Distance</p>
                    <p class="h4 mb-0">
                      {{ tripInformation.distanceKm }} <span class="h6">km</span>
                    </p>
                  </div>
                  <div class="col-6">
                    <p class="small text-muted mb-1">Estimated driving time</p>
                    <p class="h4 mb-0">
                      {{ tripInformation.durationMinutes }} <span class="h6">min</span>
                    </p>
                  </div>
                </div>
              </div>
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
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/init'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const route = useRoute()
const eventMessage = ref('')
const events = ref([])
const locations = ref([])
const selectedFilter = ref('all')
const selectedItem = ref(null)
const selectedKind = ref('')
const isLoading = ref(false)
const loadError = ref('')
const originLocation = ref(null)
const originError = ref('')
const isLocating = ref(false)
const isRouting = ref(false)
const directionsError = ref('')
const tripInformation = ref(null)
let map
let markers = []
let originMarker
let locationRequest = 0
let directionsController

function clearRoute() {
  if (directionsController) directionsController.abort()
  directionsController = null
  isRouting.value = false
  directionsError.value = ''
  tripInformation.value = null
  if (map?.getLayer('trip-route')) map.removeLayer('trip-route')
  if (map?.getSource('trip-route')) map.removeSource('trip-route')
}

function drawRoute(geometry) {
  if (!map.isStyleLoaded()) throw new Error('The map style is not ready. Try directions again.')
  const bounds = new mapboxgl.LngLatBounds()
  for (const coordinates of geometry.coordinates) {
    const [longitude, latitude] = coordinates
    if (!hasValidLocation({ location: { longitude, latitude } })) {
      throw new Error('The directions response contains invalid coordinates.')
    }
    bounds.extend(coordinates)
  }
  map.addSource('trip-route', {
    type: 'geojson',
    data: { type: 'Feature', properties: {}, geometry },
  })
  map.addLayer({
    id: 'trip-route',
    type: 'line',
    source: 'trip-route',
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint: { 'line-color': '#0d6efd', 'line-width': 5 },
  })
  map.fitBounds(bounds, { padding: 40, maxZoom: 15 })
}

async function getDirections() {
  if (isRouting.value) return
  clearRoute()
  const origin = originLocation.value
  const destination = selectedItem.value
  if (!origin) {
    directionsError.value = 'Use your current location or pin a starting location first.'
    return
  }
  if (!destination || !hasValidLocation(destination)) {
    directionsError.value = 'Select an event or location first.'
    return
  }

  isRouting.value = true
  const controller = new AbortController()
  directionsController = controller
  const timeout = setTimeout(() => controller.abort(), 15000)
  try {
    const token = import.meta.env.VITE_MAPBOX_TOKEN || import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
    if (!token) throw new Error('Mapbox access token is missing.')
    const coordinates =
      origin.longitude +
      ',' +
      origin.latitude +
      ';' +
      destination.location.longitude +
      ',' +
      destination.location.latitude
    const parameters = new URLSearchParams({
      access_token: token,
      geometries: 'geojson',
      overview: 'full',
      alternatives: 'false',
      steps: 'false',
    })
    const response = await fetch(
      'https://api.mapbox.com/directions/v5/mapbox/driving/' + coordinates + '?' + parameters,
      { signal: controller.signal },
    )
    if (!response.ok) throw new Error('Mapbox directions failed with status ' + response.status)
    const data = await response.json()
    if (directionsController !== controller || !map) return
    if (data.code === 'NoRoute' || data.code === 'NoSegment') {
      directionsError.value = 'No route could be found.'
      return
    }
    if (data.code !== 'Ok') throw new Error('Mapbox directions returned ' + data.code)
    const drivingRoute = data.routes?.[0]
    if (!drivingRoute) {
      directionsError.value = 'No route could be found.'
      return
    }
    if (
      drivingRoute.geometry?.type !== 'LineString' ||
      !Array.isArray(drivingRoute.geometry.coordinates) ||
      drivingRoute.geometry.coordinates.length < 2 ||
      !Number.isFinite(drivingRoute.distance) ||
      drivingRoute.distance < 0 ||
      !Number.isFinite(drivingRoute.duration) ||
      drivingRoute.duration < 0
    ) {
      throw new Error('Mapbox directions returned an invalid route.')
    }
    drawRoute(drivingRoute.geometry)
    tripInformation.value = {
      from: origin.name,
      to: destination.name || 'Unnamed location',
      distanceKm: (drivingRoute.distance / 1000).toFixed(1),
      durationMinutes: Math.max(1, Math.round(drivingRoute.duration / 60)),
    }
  } catch (error) {
    if (directionsController !== controller) return
    clearRoute()
    directionsError.value = 'Unable to calculate directions.'
    console.error('Unable to calculate directions:', error)
  } finally {
    clearTimeout(timeout)
    if (directionsController === controller) {
      directionsController = null
      isRouting.value = false
    }
  }
}

function setOriginLocation(name, longitude, latitude) {
  if (!map || !hasValidLocation({ location: { longitude, latitude } })) return
  locationRequest++
  isLocating.value = false
  originError.value = ''
  clearRoute()
  originLocation.value = { name, longitude, latitude }
  if (!originMarker) {
    originMarker = new mapboxgl.Marker({ color: '#dc3545' })
    originMarker.getElement().addEventListener('click', (event) => event.stopPropagation())
  }
  originMarker.setLngLat([longitude, latitude]).addTo(map)
  originMarker.getElement().setAttribute('aria-label', 'Starting location: ' + name)
  map.flyTo({ center: [longitude, latitude], zoom: 15 })
}

function pinStartingLocation(event) {
  if (event.originalEvent?.target?.closest?.('.mapboxgl-marker')) return
  setOriginLocation('Pinned location', event.lngLat.lng, event.lngLat.lat)
}

function useMyLocation() {
  if (isLocating.value || !map) return
  originError.value = ''
  const request = ++locationRequest

  function locationFailed(error) {
    if (request !== locationRequest || !map) return
    isLocating.value = false
    originError.value =
      'Unable to access your current location. You can pin a location on the map instead.'
    console.error('Unable to access your current location:', error)
  }

  if (!navigator.geolocation) {
    locationFailed(new Error('Browser geolocation is unavailable.'))
    return
  }
  isLocating.value = true
  try {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (request !== locationRequest || !map) return
        const { longitude, latitude } = position.coords
        if (!hasValidLocation({ location: { longitude, latitude } })) {
          locationFailed(new Error('Browser geolocation returned invalid coordinates.'))
          return
        }
        setOriginLocation('Your current location', longitude, latitude)
      },
      locationFailed,
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    )
  } catch (error) {
    locationFailed(error)
  }
}

async function loadMapData() {
  isLoading.value = true
  loadError.value = ''
  const results = await Promise.allSettled([
    getDocs(collection(db, 'events')),
    getDocs(collection(db, 'locations')),
  ])

  if (results[0].status === 'fulfilled') {
    events.value = results[0].value.docs.map((item) => ({ ...item.data(), id: item.id }))
  } else {
    loadError.value = 'Unable to load map data.'
    console.error('Unable to load events:', results[0].reason)
  }

  if (results[1].status === 'fulfilled') {
    locations.value = results[1].value.docs.map((item) => ({ ...item.data(), id: item.id }))
  } else {
    loadError.value = 'Unable to load map data.'
    console.error('Unable to load locations:', results[1].reason)
  }

  isLoading.value = false
  updateMarkers()
  focusRequestedEvent()
}

function focusRequestedEvent() {
  if (!map || isLoading.value) return
  eventMessage.value = ''
  const eventId = route.query.eventId
  if (typeof eventId !== 'string' || !eventId) return
  const event = events.value.find((item) => item.id === eventId)
  if (!event) {
    clearRoute()
    selectedItem.value = null
    selectedKind.value = ''
    eventMessage.value = 'The requested event could not be found.'
    return
  }
  selectedFilter.value = 'events'
  updateMarkers()
  selectEvent(event)
  if (!hasValidLocation(event)) {
    eventMessage.value = 'This event does not have a valid map location yet.'
    return
  }
  map.flyTo({ center: [event.location.longitude, event.location.latitude], zoom: 15 })
}

function hasValidLocation(item) {
  const latitude = item.location?.latitude
  const longitude = item.location?.longitude
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  )
}

function selectEvent(event) {
  clearRoute()
  selectedItem.value = event
  selectedKind.value = 'event'
}

function selectLocation(location) {
  clearRoute()
  selectedItem.value = location
  selectedKind.value = 'location'
}

function addMarker(item, color, selectItem) {
  if (!hasValidLocation(item)) return
  const marker = new mapboxgl.Marker({ color })
    .setLngLat([item.location.longitude, item.location.latitude])
    .addTo(map)
  const element = marker.getElement()
  element.style.cursor = 'pointer'
  element.setAttribute('role', 'button')
  element.setAttribute('tabindex', '0')
  element.setAttribute('aria-label', 'Show details for ' + (item.name || 'location'))
  element.addEventListener('click', (event) => {
    event.stopPropagation()
    selectItem(item)
  })
  element.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      selectItem(item)
    }
  })
  markers.push(marker)
}

function addEventMarkers() {
  if (selectedFilter.value !== 'all' && selectedFilter.value !== 'events') return
  for (const event of events.value) {
    addMarker(event, '#0d6efd', selectEvent)
  }
}

function addLocationMarkers() {
  if (selectedFilter.value === 'events') return
  for (const location of locations.value) {
    if (selectedFilter.value !== 'all' && location.type !== selectedFilter.value) continue
    let color = '#6c757d'
    if (location.type === 'recycling') color = '#198754'
    if (location.type === 'donation') color = '#6f42c1'
    if (location.type === 'repair') color = '#fd7e14'
    addMarker(location, color, selectLocation)
  }
}

function removeMarkers() {
  for (const marker of markers) marker.remove()
  markers = []
}

function updateMarkers() {
  if (!map) return
  clearRoute()
  removeMarkers()
  selectedItem.value = null
  selectedKind.value = ''
  addEventMarkers()
  addLocationMarkers()
}

function locationTypeLabel(type) {
  if (type === 'recycling') return 'Recycling'
  if (type === 'donation') return 'Donation'
  if (type === 'repair') return 'Repair'
  return type || 'Location'
}

function formatDate(value) {
  const date = typeof value.toDate === 'function' ? value.toDate() : new Date(value)
  if (Number.isNaN(date.getTime())) return typeof value === 'string' ? value : ''
  return date.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Australia/Sydney',
  })
}

watch(() => route.query.eventId, focusRequestedEvent)

onMounted(async () => {
  map = new mapboxgl.Map({
    accessToken: import.meta.env.VITE_MAPBOX_TOKEN || import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [145.13, -37.91],
    zoom: 11,
  })
  map.on('click', pinStartingLocation)
  await loadMapData()
})

onUnmounted(() => {
  locationRequest++
  clearRoute()
  if (originMarker) originMarker.remove()
  originMarker = null
  removeMarkers()
  if (map) {
    map.remove()
    map = null
  }
})
</script>
