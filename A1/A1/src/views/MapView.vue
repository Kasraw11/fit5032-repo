<template>
  <main>
    <PageHero
      title="Map & Locations"
      subtitle="Find sustainability events and recycling locations near you."
      :image="public_hero"
    />

    <div class="container py-5">
      <section class="mb-4" aria-label="Starting location">
        <button type="button" class="btn btn-primary" :disabled="isLocating" @click="useMyLocation">
          Use My Location
        </button>
        <p class="mt-2 mb-0">Or click an empty area of the map to pin your starting location.</p>
        <div class="mt-2" aria-live="polite">
          <p v-if="isLocating" class="mb-0" role="status">Finding your current location...</p>
          <p v-if="locationError" class="text-danger mb-0" role="alert">{{ locationError }}</p>
          <p v-if="startLocation" class="mb-0">Starting location: {{ startLocation.name }}</p>
        </div>
      </section>

      <p v-if="isLoading" role="status">Loading map locations...</p>
      <p v-if="loadError" class="text-danger" role="alert">{{ loadError }}</p>
      <p v-if="eventMessage" class="text-danger" role="alert">{{ eventMessage }}</p>

      <div class="row g-4 mb-4">
        <div class="col-12 col-lg-4">
          <section
            class="card card-gradient-7 shadow-sm map-list-card"
            aria-labelledby="map-list-heading"
          >
            <div class="card-header card-gradient-1 p-3">
              <h2 id="map-list-heading" class="h5 mb-0">Events &amp; Locations</h2>
            </div>
            <div
              class="card-body p-3 map-list"
              tabindex="0"
              role="region"
              aria-label="Events and locations list"
            >
              <p class="small text-muted">Choose a type, then select an event or location.</p>
              <div class="d-flex flex-wrap gap-2 mb-3" role="group" aria-label="Filter by type">
                <button
                  v-for="type in mapTypes"
                  :key="type"
                  type="button"
                  class="btn btn-sm"
                  :class="selectedFilter === type ? 'btn-primary' : 'btn-outline-primary'"
                  :aria-pressed="selectedFilter === type"
                  @click="changeType(type)"
                >
                  {{ type === 'all' ? 'All' : type }}
                </button>
              </div>

              <div v-if="!isLoading" aria-label="Events and locations">
                <p v-if="filteredMapItems.length === 0" class="text-muted mb-0" role="status">
                  No events or locations match this type.
                </p>
                <article
                  v-for="entry in filteredMapItems"
                  :key="entry.kind + '-' + entry.item.id"
                  class="border rounded p-3 mb-3"
                  :class="{
                    'border-primary':
                      selectedItem?.id === entry.item.id && selectedKind === entry.kind,
                  }"
                >
                  <span class="badge bg-primary mb-2">{{
                    mapCategory(entry.item, entry.kind === 'event')
                  }}</span>
                  <h3 class="h6">{{ entry.item.name || 'Unnamed location' }}</h3>
                  <p v-if="entry.item.date" class="small mb-1">{{ formatDate(entry.item.date) }}</p>
                  <p class="small mb-2">{{ entry.item.address || 'Address not provided' }}</p>
                  <button
                    type="button"
                    class="btn btn-outline-primary btn-sm"
                    @click="showMapItem(entry)"
                  >
                    {{ hasValidLocation(entry.item) ? 'View on map' : 'View details' }}
                  </button>
                  <p v-if="!hasValidLocation(entry.item)" class="small text-muted mt-2 mb-0">
                    Map location is not available yet.
                  </p>
                </article>
              </div>
            </div>
          </section>
        </div>
        <div class="col-12 col-lg-8">
          <div id="map" style="height: 500px"></div>
        </div>
      </div>

      <div class="d-flex flex-column flex-md-row gap-4 map-details">
        <section
          class="card card-gradient-7 shadow-sm w-100"
          aria-labelledby="selected-location-heading"
        >
          <div class="card-header card-gradient-1 border-0 p-4">
            <h2 class="h5 mb-0" id="selected-location-heading">Selected Location</h2>
          </div>
          <div class="card-body p-4" aria-live="polite">
            <p v-if="!selectedItem" class="text-muted mb-0">
              Select a location on the map to view more information.
            </p>
            <template v-else>
              <span class="badge bg-primary mb-3">
                {{ selectedKind === 'event' ? 'Event' : mapCategory(selectedItem) }}
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
            </template>
          </div>
        </section>
        <section class="card card-gradient-7 shadow-sm w-100" aria-labelledby="directions-heading">
          <div class="card-header card-gradient-1 border-0 p-4">
            <h2 class="h5 mb-0" id="directions-heading">Directions</h2>
          </div>
          <div class="card-body p-4" aria-live="polite">
            <p class="text-muted mb-3">
              Plan a driving or walking route to your selected location.
            </p>
            <dl class="mb-3">
              <dt class="small text-muted">Starting location</dt>
              <dd>
                {{ startLocation ? startLocation.name : 'Use My Location or pin the map.' }}
              </dd>
              <dt class="small text-muted">Destination</dt>
              <dd class="mb-0">
                {{
                  selectedItem ? selectedItem.name || 'Unnamed location' : 'Select a map marker.'
                }}
              </dd>
            </dl>
            <label for="travel-mode" class="form-label">Travel mode</label>
            <select
              id="travel-mode"
              v-model="travelMode"
              class="form-select mb-3"
              @change="clearRoute"
            >
              <option value="driving">Driving</option>
              <option value="walking">Walking</option>
            </select>
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
            <div v-if="tripDetails" class="mt-4 pt-3 border-top">
              <h3 class="h6 mb-3">Trip Information</h3>
              <div class="d-flex flex-wrap gap-4">
                <p class="mb-0">
                  <span class="d-block small text-muted mb-1">Distance</span>
                  <span class="h4">{{ tripDetails.distanceKm }}</span>
                  <span class="h6">km</span>
                </p>
                <p class="mb-0">
                  <span class="d-block small text-muted mb-1">Estimated travel time</span>
                  <span class="h4">{{ tripDetails.durationMinutes }}</span>
                  <span class="h6">min</span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<script setup>
import PageHero from '@/components/PageHero.vue'
import public_hero from '@/assets/images/public_hero.png'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/init'
import { currentUser } from '@/authentication'
import axios from 'axios'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const route = useRoute()
const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
const markerColor = '#0d6efd'
const mapTypes = ['all', 'Donations', 'Workshops', 'Events', 'Recycling Centres', 'Repair Centres']

const travelMode = ref('driving')
const eventMessage = ref('')
const events = ref([])
const locations = ref([])
const selectedFilter = ref('all')
const selectedItem = ref(null)
const selectedKind = ref('')
const isLoading = ref(false)
const loadError = ref('')
const startLocation = ref(null)
const locationError = ref('')
const isLocating = ref(false)
const isRouting = ref(false)
const directionsError = ref('')
const tripDetails = ref(null)

let map
let markers = []
let startMarker
let locationRequestId = 0
let directionsRequestId = 0

const filteredMapItems = computed(() => {
  const matchingItems = []

  for (const event of events.value) {
    if (selectedFilter.value === 'all' || mapCategory(event, true) === selectedFilter.value) {
      matchingItems.push({ item: event, kind: 'event' })
    }
  }

  for (const location of locations.value) {
    if (selectedFilter.value === 'all' || mapCategory(location) === selectedFilter.value) {
      matchingItems.push({ item: location, kind: 'location' })
    }
  }

  return matchingItems
})

function changeType(type) {
  selectedFilter.value = type
  updateMarkers()
}

function showMapItem(entry) {
  const item = entry.item
  selectItem(item, entry.kind)
  if (map && hasValidLocation(item)) {
    map.flyTo({ center: [item.location.longitude, item.location.latitude], zoom: 15 })
  }
}

// clear route and ignore old results
function clearRoute() {
  directionsRequestId += 1
  isRouting.value = false
  directionsError.value = ''
  tripDetails.value = null
  if (!map) return
  if (map.getLayer('trip-route')) map.removeLayer('trip-route')
  if (map.getSource('trip-route')) map.removeSource('trip-route')
}

function drawRoute(geometry) {
  const bounds = new mapboxgl.LngLatBounds()
  for (const coordinates of geometry.coordinates) {
    if (!hasValidCoordinates(coordinates[0], coordinates[1])) {
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
  const origin = startLocation.value
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
  const requestId = directionsRequestId
  try {
    const start = `${origin.longitude},${origin.latitude}`
    const end = `${destination.location.longitude},${destination.location.latitude}`
    const response = await axios.get(
      `https://api.mapbox.com/directions/v5/mapbox/${travelMode.value}/${start};${end}`,
      {
        params: {
          access_token: mapboxToken,
          geometries: 'geojson',
          overview: 'full',
          alternatives: false,
          steps: false,
        },
        timeout: 15000,
      },
    )
    if (requestId !== directionsRequestId || !map) return
    const data = response.data
    const routeDetails = data.routes?.[0]
    if (
      data.code !== 'Ok' ||
      !routeDetails ||
      !routeDetails.geometry ||
      routeDetails.geometry.type !== 'LineString' ||
      !Array.isArray(routeDetails.geometry.coordinates) ||
      routeDetails.geometry.coordinates.length < 2 ||
      !Number.isFinite(routeDetails.distance) ||
      routeDetails.distance < 0 ||
      !Number.isFinite(routeDetails.duration) ||
      routeDetails.duration < 0
    ) {
      throw new Error('Unable to calculate directions.')
    }
    drawRoute(routeDetails.geometry)
    const distanceKm = (routeDetails.distance / 1000).toFixed(1)
    const durationMinutes = Math.max(1, Math.round(routeDetails.duration / 60))
    tripDetails.value = {
      distanceKm,
      durationMinutes,
    }
  } catch {
    if (requestId !== directionsRequestId) return
    clearRoute()
    directionsError.value = 'Unable to calculate directions.'
  } finally {
    if (requestId === directionsRequestId) {
      isRouting.value = false
    }
  }
}

function setStartLocation(name, longitude, latitude) {
  if (!map || !hasValidCoordinates(longitude, latitude)) return
  locationRequestId += 1
  isLocating.value = false
  locationError.value = ''
  clearRoute()
  startLocation.value = { name, longitude, latitude }
  if (!startMarker) {
    startMarker = new mapboxgl.Marker({ color: '#dc3545' })
    startMarker.getElement().addEventListener('click', (event) => event.stopPropagation())
  }
  startMarker.setLngLat([longitude, latitude]).addTo(map)
  startMarker.getElement().setAttribute('aria-label', 'Starting location: ' + name)
  map.flyTo({ center: [longitude, latitude], zoom: 15 })
}

function pinStartingLocation(event) {
  const clickedElement = event.originalEvent && event.originalEvent.target
  if (clickedElement && clickedElement.closest('.mapboxgl-marker')) return
  setStartLocation('Pinned location', event.lngLat.lng, event.lngLat.lat)
}

function useMyLocation() {
  if (isLocating.value || !map) return
  locationError.value = ''
  locationRequestId += 1
  const requestId = locationRequestId

  function locationFailed() {
    if (requestId !== locationRequestId || !map) return
    isLocating.value = false
    locationError.value = 'Unable to access your current location. '
  }

  if (!navigator.geolocation) {
    locationFailed()
    return
  }
  // use current location
  function locationFound(position) {
    if (requestId !== locationRequestId || !map) return
    const longitude = position.coords.longitude
    const latitude = position.coords.latitude
    if (!hasValidCoordinates(longitude, latitude)) {
      locationFailed()
      return
    }
    setStartLocation('Your current location', longitude, latitude)
  }

  isLocating.value = true
  try {
    navigator.geolocation.getCurrentPosition(locationFound, locationFailed, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    })
  } catch {
    locationFailed()
  }
}

async function loadMapData() {
  isLoading.value = true
  loadError.value = ''

  for (const collectionName of ['events', 'locations']) {
    if (collectionName === 'events' && !currentUser.value) {
      events.value = []
      continue
    }
    try {
      const snapshot = await getDocs(collection(db, collectionName))
      const records = []
      for (const document of snapshot.docs) {
        const item = document.data()
        item.id = document.id
        records.push(item)
      }
      if (collectionName === 'events') events.value = records
      else locations.value = records
    } catch {
      loadError.value = 'Unable to load map data.'
    }
  }

  isLoading.value = false
  updateMarkers()
  if (map) {
    const bounds = new mapboxgl.LngLatBounds()
    const allItems = events.value.concat(locations.value)
    for (const item of allItems) {
      if (hasValidLocation(item)) bounds.extend([item.location.longitude, item.location.latitude])
    }
    if (!bounds.isEmpty()) map.fitBounds(bounds, { padding: 40, maxZoom: 13 })
  }
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
  selectedFilter.value = mapCategory(event, true)
  updateMarkers()
  showMapItem({ item: event, kind: 'event' })
  if (!hasValidLocation(event)) {
    eventMessage.value = 'This event does not have a valid map location yet.'
  }
}

function hasValidLocation(item) {
  if (!item || !item.location) return false
  return hasValidCoordinates(item.location.longitude, item.location.latitude)
}

function hasValidCoordinates(longitude, latitude) {
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  )
}

function selectItem(item, kind) {
  clearRoute()
  selectedItem.value = item
  selectedKind.value = kind
}

function addMarker(item, kind) {
  if (!hasValidLocation(item)) return
  const marker = new mapboxgl.Marker({ color: markerColor })
    .setLngLat([item.location.longitude, item.location.latitude])
    .addTo(map)
  const element = marker.getElement()
  element.style.cursor = 'pointer'
  element.setAttribute('role', 'button')
  element.setAttribute('tabindex', '0')
  element.setAttribute('aria-label', 'Show details for ' + (item.name || 'location'))
  element.addEventListener('click', (event) => {
    event.stopPropagation()
    selectItem(item, kind)
  })
  element.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      selectItem(item, kind)
    }
  })
  markers.push(marker)
}

function updateMarkers() {
  if (!map) return
  clearRoute()
  removeMarkers()
  selectedItem.value = null
  selectedKind.value = ''

  for (const entry of filteredMapItems.value) {
    addMarker(entry.item, entry.kind)
  }
}

function removeMarkers() {
  for (const marker of markers) marker.remove()
  markers = []
}

// match category names
function mapCategory(item, isEvent = false) {
  if (item.category) {
    if (item.category === 'Workshop') return 'Workshops'
    if (mapTypes.includes(item.category) && item.category !== 'all') return item.category
  }
  if (isEvent || item.type === 'event') return 'Events'
  if (item.type === 'donation') return 'Donations'
  if (item.type === 'repair') return 'Repair Centres'
  if (item.type === 'workshop') return 'Workshops'
  return 'Recycling Centres'
}

function formatDate(value) {
  if (!value) return ''
  let date
  if (typeof value.toDate === 'function') date = value.toDate()
  else date = new Date(value)
  if (Number.isNaN(date.getTime())) return typeof value === 'string' ? value : ''
  return date.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Australia/Sydney',
  })
}

watch(() => route.query.eventId, focusRequestedEvent)

async function setupMap() {
  map = new mapboxgl.Map({
    accessToken: mapboxToken,
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [144.9631, -37.8136],
    zoom: 11,
  })
  map.on('click', pinStartingLocation)
  await loadMapData()
}

// clean up map
function closeMap() {
  locationRequestId += 1
  clearRoute()
  if (startMarker) startMarker.remove()
  startMarker = null
  removeMarkers()
  if (map) {
    map.remove()
    map = null
  }
}

onMounted(setupMap)
onUnmounted(closeMap)
</script>

<style scoped>
.map-list-card {
  height: 500px;
  overflow: hidden;
}

.map-list-card .card-header {
  flex-shrink: 0;
}

.map-list {
  min-height: 0;
  overflow-y: auto;
  scrollbar-gutter: stable;
}

.map-details > section {
  min-width: 0;
}
</style>
