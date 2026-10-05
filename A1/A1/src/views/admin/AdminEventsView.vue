<template>
  <main>
    <section class="page-hero">
      <div class="container">
        <h1>Manage Events</h1>
        <p>Add, edit and manage events.</p>
      </div>
    </section>
    <section class="container py-5">
      <p v-if="successMessage" class="alert alert-success" role="status">{{ successMessage }}</p>
      <p v-if="actionError" class="alert alert-danger" role="alert">{{ actionError }}</p>
      <button
        ref="addButton"
        type="button"
        class="btn btn-primary mb-4"
        :disabled="isBusy || !!loadError || showForm || !!pendingDelete"
        @click="startAdd"
      >
        + Add Event
      </button>
      <form
        v-if="showForm"
        ref="formElement"
        class="card shadow-sm p-4 mb-4"
        novalidate
        @submit.prevent="saveItem"
      >
        <h2 class="h4">{{ editingId ? 'Edit Event' : 'Add Event' }}</h2>
        <fieldset :disabled="isBusy">
          <div class="row g-3">
            <div class="col-12 col-md-6">
              <label class="form-label" for="events-name">Event Name (required)</label
              ><input
                id="events-name"
                v-model="form.name"
                :aria-invalid="!!errors.name"
                :aria-describedby="errors.name ? 'events-name-error' : undefined"
                ref="nameInput"
                class="form-control"
                type="text"
              />
              <p v-if="errors.name" id="events-name-error" class="text-danger mt-1 mb-0">
                {{ errors.name }}
              </p>
            </div>
            <div class="col-12 col-md-6">
              <label class="form-label" for="events-category">Category (required)</label
              ><input
                id="events-category"
                v-model="form.category"
                :aria-invalid="!!errors.category"
                :aria-describedby="errors.category ? 'events-category-error' : undefined"
                class="form-control"
                type="text"
              />
              <p v-if="errors.category" id="events-category-error" class="text-danger mt-1 mb-0">
                {{ errors.category }}
              </p>
            </div>
            <div class="col-12 col-md-6">
              <label class="form-label" for="events-date">Date (required)</label
              ><input
                id="events-date"
                v-model="form.date"
                :aria-invalid="!!errors.date"
                :aria-describedby="errors.date ? 'events-date-error' : undefined"
                class="form-control"
                type="date"
              />
              <p v-if="errors.date" id="events-date-error" class="text-danger mt-1 mb-0">
                {{ errors.date }}
              </p>
            </div>
            <div class="col-12 col-md-6">
              <label class="form-label" for="events-address">Address (required)</label
              ><input
                id="events-address"
                v-model="form.address"
                @input="addressChanged"
                :aria-invalid="!!errors.address"
                :aria-describedby="errors.address ? 'events-address-error' : undefined"
                class="form-control"
                type="text"
              />
              <button type="button" class="btn btn-outline-primary mt-2" @click="findLocation">
                {{ isFindingLocation ? 'Finding Location...' : 'Find Location' }}
              </button>
              <p v-if="locationError" class="text-danger mt-2 mb-0" role="alert">
                {{ locationError }}
              </p>
              <p v-if="locationMessage" class="text-success mt-2 mb-0" role="status">
                {{ locationMessage }}
              </p>
              <div v-if="addressResults.length" class="mt-3">
                <p class="mb-2">Choose the correct address:</p>
                <div class="list-group">
                  <button
                    v-for="result in addressResults"
                    :key="result.id"
                    type="button"
                    class="list-group-item list-group-item-action"
                    @click="chooseAddress(result)"
                  >
                    {{ result.address }}
                  </button>
                </div>
              </div>
              <p v-if="errors.address" id="events-address-error" class="text-danger mt-1 mb-0">
                {{ errors.address }}
              </p>
            </div>
            <div class="col-12 col-md-6">
              <label class="form-label" for="events-latitude">Latitude (required)</label
              ><input
                id="events-latitude"
                v-model="form.latitude"
                :aria-invalid="!!errors.latitude"
                :aria-describedby="errors.latitude ? 'events-latitude-error' : undefined"
                class="form-control"
                type="number"
                step="any"
              />
              <p v-if="errors.latitude" id="events-latitude-error" class="text-danger mt-1 mb-0">
                {{ errors.latitude }}
              </p>
            </div>
            <div class="col-12 col-md-6">
              <label class="form-label" for="events-longitude">Longitude (required)</label
              ><input
                id="events-longitude"
                v-model="form.longitude"
                :aria-invalid="!!errors.longitude"
                :aria-describedby="errors.longitude ? 'events-longitude-error' : undefined"
                class="form-control"
                type="number"
                step="any"
              />
              <p v-if="errors.longitude" id="events-longitude-error" class="text-danger mt-1 mb-0">
                {{ errors.longitude }}
              </p>
            </div>
            <div class="col-12 col-md-6">
              <label class="form-label" for="events-status">Status</label
              ><select
                id="events-status"
                v-model="form.status"
                :aria-invalid="!!errors.status"
                :aria-describedby="errors.status ? 'events-status-error' : undefined"
                class="form-select"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="cancelled">Cancelled</option>
                <option
                  v-if="form.status && !['draft', 'published', 'cancelled'].includes(form.status)"
                  :value="form.status"
                >
                  {{ form.status }}
                </option>
              </select>
              <p v-if="errors.status" id="events-status-error" class="text-danger mt-1 mb-0">
                {{ errors.status }}
              </p>
            </div>
          </div>
          <p class="text-muted mt-3">
            Enter an address and click Find Location to fill the coordinates. You can adjust them
            manually if needed.
          </p>
          <div class="d-flex gap-2 mt-3">
            <button type="submit" class="btn btn-primary">
              {{ isSaving ? 'Saving...' : 'Save Event' }}</button
            ><button type="button" class="btn btn-outline-secondary" @click="closeForm">
              Cancel
            </button>
          </div>
        </fieldset>
      </form>
      <div v-if="pendingDelete" class="card border-danger p-4 mb-4">
        <h2 class="h4">Delete {{ pendingDelete.name }}?</h2>
        <p>This permanently removes the event from SmartLoop.</p>
        <div class="d-flex gap-2">
          <button
            ref="cancelDeleteButton"
            type="button"
            class="btn btn-outline-secondary"
            :disabled="isBusy"
            @click="cancelDelete"
          >
            Cancel</button
          ><button type="button" class="btn btn-danger" :disabled="isBusy" @click="deleteItem">
            {{ isDeleting ? 'Deleting...' : 'Delete Event' }}
          </button>
        </div>
      </div>
      <div class="row mb-4">
        <div class="col-12 col-md-6 mb-3">
          <label for="events-search" class="form-label">Search events</label>
          <div class="input-group">
            <input
              id="events-search"
              ref="searchInput"
              v-model="searchTerm"
              type="search"
              class="form-control"
              placeholder="Name or address"
              :disabled="isLoading"
            /><button
              v-if="searchTerm"
              type="button"
              class="btn btn-outline-secondary"
              @click="clearSearch"
            >
              Clear
            </button>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <label for="events-filter" class="form-label">Filter by category</label
          ><select
            id="events-filter"
            v-model="selectedFilter"
            class="form-select"
            :disabled="isLoading"
          >
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
            <option
              v-if="selectedFilter && !categories.includes(selectedFilter)"
              :value="selectedFilter"
            >
              {{ selectedFilter }}
            </option>
          </select>
        </div>
      </div>
      <p v-if="isLoading" role="status">Loading events...</p>
      <div v-else-if="loadError" class="alert alert-danger" role="alert">
        <p>{{ loadError }}</p>
        <button type="button" class="btn btn-outline-danger" @click="loadItems">Try Again</button>
      </div>
      <p v-else-if="items.length === 0">No events yet. Use Add Event to create the first one.</p>
      <div v-else class="table-responsive">
        <table class="table table-striped align-middle">
          <caption>
            Events
          </caption>
          <thead>
            <tr>
              <th scope="col">Event Name</th>
              <th scope="col">Category</th>
              <th scope="col">Date</th>
              <th scope="col">Address</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredItems.length === 0">
              <td colspan="6">
                No events match your search or filter.
                <button type="button" class="btn btn-link" @click="resetFilters">
                  Show all events
                </button>
              </td>
            </tr>
            <tr v-for="item in filteredItems" :key="item.id">
              <td>{{ item.name }}</td>
              <td>{{ item.category }}</td>
              <td>{{ dateForInput(item.date) }}</td>
              <td>{{ item.address }}</td>
              <td>{{ item.status }}</td>
              <td>
                <div class="d-flex gap-2">
                  <button
                    type="button"
                    class="btn btn-outline-primary btn-sm"
                    :disabled="isBusy || showForm || !!pendingDelete"
                    :aria-label="'Edit ' + item.name"
                    @click="startEdit(item)"
                  >
                    Edit</button
                  ><button
                    type="button"
                    class="btn btn-outline-danger btn-sm"
                    :disabled="isBusy || showForm || !!pendingDelete"
                    :aria-label="'Delete ' + item.name"
                    @click="requestDelete(item)"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, reactive, ref } from 'vue'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  GeoPoint,
  getDocs,
  updateDoc,
} from 'firebase/firestore'
import { db } from '@/firebase/init'

const items = ref([])
const isLoading = ref(false)
const isSaving = ref(false)
const isDeleting = ref(false)
const isFindingLocation = ref(false)
const addressResults = ref([])
const locationError = ref('')
const locationMessage = ref('')
let geocodingController
const isBusy = computed(
  () => isLoading.value || isSaving.value || isDeleting.value || isFindingLocation.value,
)
const loadError = ref('')
const actionError = ref('')
const successMessage = ref('')
const showForm = ref(false)
const editingId = ref('')
const pendingDelete = ref(null)
const searchTerm = ref('')
const selectedFilter = ref('')
const nameInput = ref(null)
const searchInput = ref(null)
const formElement = ref(null)
const addButton = ref(null)
const cancelDeleteButton = ref(null)
const form = reactive({
  name: '',
  category: '',
  date: '',
  address: '',
  latitude: '',
  longitude: '',
  status: 'draft',
})
const errors = reactive({})

const categories = computed(() => {
  const result = []
  for (const item of items.value) {
    if (item.category && !result.includes(item.category)) result.push(item.category)
  }
  return result.sort((a, b) => a.localeCompare(b))
})

const filteredItems = computed(() => {
  const search = searchTerm.value.trim().toLowerCase()
  return items.value.filter((item) => {
    const name = String(item.name || '').toLowerCase()
    const address = String(item.address || '').toLowerCase()
    const matchesSearch = name.includes(search) || address.includes(search)
    const matchesFilter = selectedFilter.value === '' || item.category === selectedFilter.value
    return matchesSearch && matchesFilter
  })
})

function clearSearch() {
  searchTerm.value = ''
  searchInput.value?.focus()
}
function resetFilters() {
  selectedFilter.value = ''
  clearSearch()
}

function dateForInput(value) {
  if (!value) return ''
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  let date
  if (typeof value.toDate === 'function') {
    date = value.toDate()
  } else {
    date = new Date(value)
  }
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-CA', { timeZone: 'Australia/Sydney' })
}

async function loadItems() {
  if (isBusy.value) return
  isLoading.value = true
  loadError.value = ''
  try {
    const snapshot = await getDocs(collection(db, 'events'))
    items.value = snapshot.docs.map((item) => ({ ...item.data(), id: item.id }))
  } catch (error) {
    loadError.value = 'Unable to load events. Please try again.'
    console.error('Unable to load events:', error)
  } finally {
    isLoading.value = false
  }
}

function addressChanged() {
  form.latitude = ''
  form.longitude = ''
  addressResults.value = []
  locationError.value = ''
  locationMessage.value = ''
}

function chooseAddress(result) {
  form.address = result.address
  form.latitude = result.latitude
  form.longitude = result.longitude
  errors.address = ''
  errors.latitude = ''
  errors.longitude = ''
  addressResults.value = []
  locationError.value = ''
  locationMessage.value = 'Coordinates filled. Check the address before saving.'
}

async function findLocation() {
  if (isBusy.value) return
  locationError.value = ''
  locationMessage.value = ''
  addressResults.value = []
  if (!form.address.trim()) {
    errors.address = 'Enter an address first.'
    return
  }
  errors.address = ''
  const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
  if (!token) {
    locationError.value = 'Address lookup is unavailable because the Mapbox token is missing.'
    return
  }

  isFindingLocation.value = true
  geocodingController = new AbortController()
  const timeout = setTimeout(() => geocodingController.abort(), 15000)
  try {
    const parameters = new URLSearchParams({
      q: form.address.trim(),
      country: 'au',
      proximity: '145.13,-37.91',
      autocomplete: 'false',
      limit: '5',
      permanent: 'true',
      access_token: token,
    })
    const response = await fetch('https://api.mapbox.com/search/geocode/v6/forward?' + parameters, {
      signal: geocodingController.signal,
    })
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        locationError.value =
          'Address lookup was denied. Check your Mapbox token and permanent geocoding access.'
      } else {
        locationError.value = 'Unable to find the address. Please try again.'
      }
      console.error('Address lookup failed with status:', response.status)
      return
    }
    const data = await response.json()
    for (const feature of data.features || []) {
      const longitude = feature.geometry?.coordinates?.[0]
      const latitude = feature.geometry?.coordinates?.[1]
      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude) ||
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
      )
        continue
      const address =
        feature.properties?.full_address ||
        [feature.properties?.name, feature.properties?.place_formatted].filter(Boolean).join(', ')
      if (!address) continue
      addressResults.value.push({ id: feature.id || address, address, latitude, longitude })
    }
    if (addressResults.value.length === 1) {
      chooseAddress(addressResults.value[0])
    } else if (addressResults.value.length === 0) {
      locationError.value =
        'No matching address found. Include a street, suburb and postcode, then try again.'
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      locationError.value = 'Address lookup timed out or was cancelled. Please try again.'
    } else {
      locationError.value = 'Unable to find the address. Check your connection and try again.'
    }
  } finally {
    clearTimeout(timeout)
    geocodingController = null
    isFindingLocation.value = false
  }
}

async function openForm() {
  addressResults.value = []
  locationError.value = ''
  locationMessage.value = ''
  for (const field in errors) errors[field] = ''
  actionError.value = ''
  successMessage.value = ''
  showForm.value = true
  await nextTick()
  nameInput.value?.focus()
}
async function startAdd() {
  if (isBusy.value || loadError.value || showForm.value || pendingDelete.value) return
  editingId.value = ''
  form.name = ''
  form.category = ''
  form.date = ''
  form.address = ''
  form.latitude = ''
  form.longitude = ''
  form.status = 'draft'
  await openForm()
}
async function startEdit(item) {
  if (isBusy.value || showForm.value || pendingDelete.value) return
  editingId.value = item.id
  form.name = item.name || ''
  form.category = item.category || ''
  form.date = dateForInput(item.date)
  form.address = item.address || ''
  form.latitude = item.location?.latitude ?? ''
  form.longitude = item.location?.longitude ?? ''
  form.status = item.status || 'draft'
  await openForm()
}
async function closeForm() {
  if (isBusy.value) return
  showForm.value = false
  editingId.value = ''
  actionError.value = ''
  await nextTick()
  addButton.value?.focus()
}

function validateForm() {
  for (const field in errors) errors[field] = ''
  if (!String(form.name).trim()) {
    errors.name = 'Enter an event name.'
  }
  if (!String(form.category).trim()) {
    errors.category = 'Enter a category.'
  }
  if (!String(form.address).trim()) {
    errors.address = 'Enter an address.'
  }
  const latitude = Number(form.latitude)
  const longitude = Number(form.longitude)
  if (
    String(form.latitude).trim() === '' ||
    !Number.isFinite(latitude) ||
    latitude < -90 ||
    latitude > 90
  ) {
    errors.latitude = 'Enter a latitude between -90 and 90.'
  }
  if (
    String(form.longitude).trim() === '' ||
    !Number.isFinite(longitude) ||
    longitude < -180 ||
    longitude > 180
  ) {
    errors.longitude = 'Enter a longitude between -180 and 180.'
  }
  const date = new Date(form.date)
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(form.date) ||
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== form.date
  ) {
    errors.date = 'Enter a valid date.'
  }
  for (const field in errors) {
    if (errors[field]) return false
  }
  return true
}

async function saveItem() {
  if (isBusy.value || !showForm.value) return
  if (!validateForm()) {
    await nextTick()
    formElement.value?.querySelector('[aria-invalid="true"]')?.focus()
    return
  }
  const latitude = Number(form.latitude)
  const longitude = Number(form.longitude)
  isSaving.value = true
  actionError.value = ''
  successMessage.value = ''
  const itemData = {
    name: form.name.trim(),
    category: form.category.trim(),
    date: form.date.trim(),
    address: form.address.trim(),
    status: form.status.trim(),
    location: new GeoPoint(latitude, longitude),
  }
  try {
    if (editingId.value) {
      await updateDoc(doc(db, 'events', editingId.value), itemData)
      items.value = items.value.map((item) => {
        if (item.id === editingId.value) {
          return { ...item, ...itemData }
        }
        return item
      })
      successMessage.value = 'Event updated.'
    } else {
      const newItem = await addDoc(collection(db, 'events'), itemData)
      items.value.push({ ...itemData, id: newItem.id })
      successMessage.value = 'Event added.'
    }
    showForm.value = false
    editingId.value = ''
  } catch (error) {
    actionError.value =
      'Unable to save the event. Check your connection and admin permissions, then try again.'
    console.error('Unable to save event:', error)
  } finally {
    isSaving.value = false
    if (!showForm.value) {
      await nextTick()
      addButton.value?.focus()
    }
  }
}

async function requestDelete(item) {
  if (isBusy.value || showForm.value || pendingDelete.value) return
  pendingDelete.value = item
  actionError.value = ''
  successMessage.value = ''
  await nextTick()
  cancelDeleteButton.value?.focus()
}
async function cancelDelete() {
  if (isBusy.value) return
  pendingDelete.value = null
  actionError.value = ''
  await nextTick()
  addButton.value?.focus()
}
async function deleteItem() {
  if (isBusy.value || !pendingDelete.value) return
  isDeleting.value = true
  actionError.value = ''
  const id = pendingDelete.value.id
  try {
    await deleteDoc(doc(db, 'events', id))
    items.value = items.value.filter((item) => item.id !== id)
    pendingDelete.value = null
    successMessage.value = 'Event deleted.'
  } catch (error) {
    actionError.value =
      'Unable to delete the event. Check your connection and admin permissions, then try again.'
    console.error('Unable to delete event:', error)
  } finally {
    isDeleting.value = false
    await nextTick()
    if (pendingDelete.value) cancelDeleteButton.value?.focus()
    else addButton.value?.focus()
  }
}

onMounted(loadItems)
onUnmounted(() => geocodingController?.abort())
</script>
