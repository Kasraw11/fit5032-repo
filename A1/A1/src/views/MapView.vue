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
              <option value="Donations">Donations</option>
              <option value="Workshops">Workshops</option>
              <option value="Events">Events</option>
              <option value="Recycling Centres">Recycling Centres</option>
              <option value="Repair Centres">Repair Centres</option>
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
import axios from 'axios'
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
let locationRequestId = 0
let directionsRequestId = 0

// Remove the previous route and stop older directions results from being shown.
function clearRoute() {
  directionsRequestId += 1
  isRouting.value = false
  directionsError.value = ''
  tripInformation.value = null
  if (!map) return
  if (map.getLayer('trip-route')) map.removeLayer('trip-route')
  if (map.getSource('trip-route')) map.removeSource('trip-route')
}

function drawRoute(geometry) {
  if (!map.isStyleLoaded()) throw new Error('The map style is not ready. Try directions again.')
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
  const requestId = directionsRequestId
  try {
    const token = import.meta.env.VITE_MAPBOX_TOKEN || import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
    if (!token) throw new Error('Mapbox access token is missing.')
    const start = `${origin.longitude},${origin.latitude}`
    const end = `${destination.location.longitude},${destination.location.latitude}`
    const response = await axios.get(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${start};${end}`,
      {
        params: {
          access_token: token,
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
    if (data.code === 'NoRoute' || data.code === 'NoSegment') {
      directionsError.value = 'No route could be found.'
      return
    }
    if (data.code !== 'Ok') throw new Error('Mapbox directions returned ' + data.code)
    if (!data.routes || data.routes.length === 0) {
      directionsError.value = 'No route could be found.'
      return
    }
    const drivingRoute = data.routes[0]
    if (
      !drivingRoute.geometry ||
      drivingRoute.geometry.type !== 'LineString' ||
      !Array.isArray(drivingRoute.geometry.coordinates) ||
      drivingRoute.geometry.coordinates.length < 2 ||
      !Number.isFinite(drivingRoute.distance) ||
      drivingRoute.distance < 0 ||
      !Number.isFinite(drivingRoute.duration) ||
      drivingRoute.duration < 0
    ) {
      throw new Error('Mapbox returned invalid route information.')
    }
    drawRoute(drivingRoute.geometry)
    tripInformation.value = {
      distanceKm: (drivingRoute.distance / 1000).toFixed(1),
      durationMinutes: Math.max(1, Math.round(drivingRoute.duration / 60)),
    }
  } catch (error) {
    if (requestId !== directionsRequestId) return
    clearRoute()
    directionsError.value = 'Unable to calculate directions.'
    console.error('Unable to calculate directions:', error)
  } finally {
    if (requestId === directionsRequestId) {
      isRouting.value = false
    }
  }
}

function setOriginLocation(name, longitude, latitude) {
  if (!map || !hasValidCoordinates(longitude, latitude)) return
  locationRequestId += 1
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
  const clickedElement = event.originalEvent && event.originalEvent.target
  if (clickedElement && clickedElement.closest('.mapboxgl-marker')) return
  setOriginLocation('Pinned location', event.lngLat.lng, event.lngLat.lat)
}

function useMyLocation() {
  if (isLocating.value || !map) return
  originError.value = ''
  locationRequestId += 1
  const requestId = locationRequestId

  function locationFailed(error) {
    if (requestId !== locationRequestId || !map) return
    isLocating.value = false
    originError.value =
      'Unable to access your current location. You can pin a location on the map instead.'
    console.error('Unable to access your current location:', error)
  }

  if (!navigator.geolocation) {
    locationFailed(new Error('Browser geolocation is unavailable.'))
    return
  }
  // Use the browser's coordinates unless the user has already chosen another start.
  function locationFound(position) {
    if (requestId !== locationRequestId || !map) return
    const longitude = position.coords.longitude
    const latitude = position.coords.latitude
    if (!hasValidCoordinates(longitude, latitude)) {
      locationFailed(new Error('Browser geolocation returned invalid coordinates.'))
      return
    }
    setOriginLocation('Your current location', longitude, latitude)
  }

  isLocating.value = true
  try {
    navigator.geolocation.getCurrentPosition(locationFound, locationFailed, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    })
  } catch (error) {
    locationFailed(error)
  }
}

async function loadMapData() {
  isLoading.value = true
  loadError.value = ''

  for (const collectionName of ['events', 'locations']) {
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
    } catch (error) {
      loadError.value = 'Unable to load map data.'
      console.error('Unable to load ' + collectionName + ':', error)
    }
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
  let event = null
  for (const item of events.value) {
    if (item.id === eventId) {
      event = item
      break
    }
  }
  if (!event) {
    clearRoute()
    selectedItem.value = null
    selectedKind.value = ''
    eventMessage.value = 'The requested event could not be found.'
    return
  }
  selectedFilter.value = mapCategory(event, true)
  updateMarkers()
  selectItem(event, 'event')
  if (!hasValidLocation(event)) {
    eventMessage.value = 'This event does not have a valid map location yet.'
    return
  }
  map.flyTo({ center: [event.location.longitude, event.location.latitude], zoom: 15 })
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

function addMarker(item, color, kind) {
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

  for (const event of events.value) {
    if (selectedFilter.value !== 'all' && mapCategory(event, true) !== selectedFilter.value)
      continue
    addMarker(event, '#0d6efd', 'event')
  }

  for (const location of locations.value) {
    if (selectedFilter.value !== 'all' && mapCategory(location) !== selectedFilter.value) continue
    let color = '#6c757d'
    if (location.type === 'recycling') color = '#198754'
    if (location.type === 'donation') color = '#6f42c1'
    if (location.type === 'repair') color = '#fd7e14'
    addMarker(location, color, 'location')
  }
}

function removeMarkers() {
  for (const marker of markers) marker.remove()
  markers = []
}

// Return the category used by the filter, including records with older category names.
function mapCategory(item, isEvent = false) {
  if (item.category) {
    if (item.category === 'Workshop') return 'Workshops'
    if (
      ['Donations', 'Workshops', 'Events', 'Recycling Centres', 'Repair Centres'].includes(
        item.category,
      )
    )
      return item.category
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
    accessToken: import.meta.env.VITE_MAPBOX_TOKEN || import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [145.13, -37.91],
    zoom: 11,
  })
  map.on('click', pinStartingLocation)
  await loadMapData()
}

// Remove the map and markers, and ignore pending results when leaving the page.
function closeMap() {
  locationRequestId += 1
  clearRoute()
  if (originMarker) originMarker.remove()
  originMarker = null
  removeMarkers()
  if (map) {
    map.remove()
    map = null
  }
}

onMounted(setupMap)
onUnmounted(closeMap)
</script>
