<template>
  <main>
    <section class="page-hero">
      <div class="container">
        <h1>Manage Locations</h1>
        <p>Add, edit and manage locations.</p>
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
        + Add Location
      </button>
      <form
        v-if="showForm"
        ref="formElement"
        class="card shadow-sm p-4 mb-4"
        novalidate
        @submit.prevent="saveItem"
      >
        <h2 class="h4">{{ editingId ? 'Edit Location' : 'Add Location' }}</h2>
        <fieldset :disabled="isBusy">
          <div class="row g-3">
            <div class="col-12 col-md-6">
              <label class="form-label" for="locations-name">Location Name (required)</label
              ><input
                id="locations-name"
                v-model="form.name"
                :aria-invalid="!!errors.name"
                :aria-describedby="errors.name ? 'locations-name-error' : undefined"
                ref="nameInput"
                class="form-control"
                type="text"
              />
              <p v-if="errors.name" id="locations-name-error" class="text-danger mt-1 mb-0">
                {{ errors.name }}
              </p>
            </div>
            <div class="col-12 col-md-6">
              <label class="form-label" for="locations-type">Type (required)</label
              ><select
                id="locations-type"
                v-model="form.type"
                :aria-invalid="!!errors.type"
                :aria-describedby="errors.type ? 'locations-type-error' : undefined"
                class="form-select"
              >
                <option value="recycling">Recycling</option>
                <option value="donation">Donation</option>
                <option value="repair">Repair</option>
              </select>
              <p v-if="errors.type" id="locations-type-error" class="text-danger mt-1 mb-0">
                {{ errors.type }}
              </p>
            </div>
            <div class="col-12 col-md-6">
              <label class="form-label" for="locations-address">Address (required)</label
              ><input
                id="locations-address"
                v-model="form.address"
                @input="addressChanged"
                :aria-invalid="!!errors.address"
                :aria-describedby="errors.address ? 'locations-address-error' : undefined"
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
              <p v-if="errors.address" id="locations-address-error" class="text-danger mt-1 mb-0">
                {{ errors.address }}
              </p>
            </div>
            <div class="col-12 col-md-6">
              <label class="form-label" for="locations-latitude">Latitude (required)</label
              ><input
                id="locations-latitude"
                v-model="form.latitude"
                :aria-invalid="!!errors.latitude"
                :aria-describedby="errors.latitude ? 'locations-latitude-error' : undefined"
                class="form-control"
                type="number"
                step="any"
              />
              <p v-if="errors.latitude" id="locations-latitude-error" class="text-danger mt-1 mb-0">
                {{ errors.latitude }}
              </p>
            </div>
            <div class="col-12 col-md-6">
              <label class="form-label" for="locations-longitude">Longitude (required)</label
              ><input
                id="locations-longitude"
                v-model="form.longitude"
                :aria-invalid="!!errors.longitude"
                :aria-describedby="errors.longitude ? 'locations-longitude-error' : undefined"
                class="form-control"
                type="number"
                step="any"
              />
              <p
                v-if="errors.longitude"
                id="locations-longitude-error"
                class="text-danger mt-1 mb-0"
              >
                {{ errors.longitude }}
              </p>
            </div>
            <div class="col-12">
              <label class="form-label" for="locations-description">Description</label
              ><textarea
                id="locations-description"
                v-model="form.description"
                :aria-invalid="!!errors.description"
                :aria-describedby="errors.description ? 'locations-description-error' : undefined"
                class="form-control"
                rows="4"
              ></textarea>
              <p
                v-if="errors.description"
                id="locations-description-error"
                class="text-danger mt-1 mb-0"
              >
                {{ errors.description }}
              </p>
            </div>
          </div>
          <p class="text-muted mt-3">
            Enter an address and click Find Location to fill the coordinates. You can adjust them
            manually if needed.
          </p>
          <div class="d-flex gap-2 mt-3">
            <button type="submit" class="btn btn-primary">
              {{ isSaving ? 'Saving...' : 'Save Location' }}</button
            ><button type="button" class="btn btn-outline-secondary" @click="closeForm">
              Cancel
            </button>
          </div>
        </fieldset>
      </form>
      <div v-if="pendingDelete" class="card border-danger p-4 mb-4">
        <h2 class="h4">Delete {{ pendingDelete.name }}?</h2>
        <p>This permanently removes the location from SmartLoop.</p>
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
            {{ isDeleting ? 'Deleting...' : 'Delete Location' }}
          </button>
        </div>
      </div>
      <div class="row mb-4">
        <div class="col-12 col-md-6 mb-3">
          <label for="locations-search" class="form-label">Search locations</label>
          <div class="input-group">
            <input
              id="locations-search"
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
          <label for="locations-filter" class="form-label">Filter by type</label
          ><select
            id="locations-filter"
            v-model="selectedFilter"
            class="form-select"
            :disabled="isLoading"
          >
            <option value="">All Types</option>
            <option value="recycling">Recycling</option>
            <option value="donation">Donation</option>
            <option value="repair">Repair</option>
          </select>
        </div>
      </div>
      <p v-if="isLoading" role="status">Loading locations...</p>
      <div v-else-if="loadError" class="alert alert-danger" role="alert">
        <p>{{ loadError }}</p>
        <button type="button" class="btn btn-outline-danger" @click="loadItems">Try Again</button>
      </div>
      <p v-else-if="items.length === 0">
        No locations yet. Use Add Location to create the first one.
      </p>
      <div v-else class="table-responsive">
        <table class="table table-striped align-middle">
          <caption>
            Locations
          </caption>
          <thead>
            <tr>
              <th scope="col">Location Name</th>
              <th scope="col">Type</th>
              <th scope="col">Address</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredItems.length === 0">
              <td colspan="4">
                No locations match your search or filter.
                <button type="button" class="btn btn-link" @click="resetFilters">
                  Show all locations
                </button>
              </td>
            </tr>
            <tr v-for="item in filteredItems" :key="item.id">
              <td>{{ item.name }}</td>
              <td>{{ item.type }}</td>
              <td>{{ item.address }}</td>
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
  type: 'recycling',
  address: '',
  latitude: '',
  longitude: '',
  description: '',
})
const errors = reactive({})

const filteredItems = computed(() => {
  const search = searchTerm.value.trim().toLowerCase()
  return items.value.filter((item) => {
    const name = String(item.name || '').toLowerCase()
    const address = String(item.address || '').toLowerCase()
    const matchesSearch = name.includes(search) || address.includes(search)
    const matchesFilter = selectedFilter.value === '' || item.type === selectedFilter.value
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

async function loadItems() {
  if (isBusy.value) return
  isLoading.value = true
  loadError.value = ''
  try {
    const snapshot = await getDocs(collection(db, 'locations'))
    items.value = snapshot.docs.map((item) => ({ ...item.data(), id: item.id }))
  } catch (error) {
    loadError.value = 'Unable to load locations. Please try again.'
    console.error('Unable to load locations:', error)
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
  form.type = 'recycling'
  form.address = ''
  form.latitude = ''
  form.longitude = ''
  form.description = ''
  await openForm()
}
async function startEdit(item) {
  if (isBusy.value || showForm.value || pendingDelete.value) return
  editingId.value = item.id
  form.name = item.name || ''
  form.type = item.type || 'recycling'
  form.address = item.address || ''
  form.latitude = item.location?.latitude ?? ''
  form.longitude = item.location?.longitude ?? ''
  form.description = item.description || ''
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
    errors.name = 'Enter a location name.'
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
  if (!['recycling', 'donation', 'repair'].includes(form.type)) {
    errors.type = 'Choose recycling, donation or repair.'
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
    type: form.type.trim(),
    address: form.address.trim(),
    description: form.description.trim(),
    location: new GeoPoint(latitude, longitude),
  }
  try {
    if (editingId.value) {
      await updateDoc(doc(db, 'locations', editingId.value), itemData)
      items.value = items.value.map((item) => {
        if (item.id === editingId.value) {
          return { ...item, ...itemData }
        }
        return item
      })
      successMessage.value = 'Location updated.'
    } else {
      const newItem = await addDoc(collection(db, 'locations'), itemData)
      items.value.push({ ...itemData, id: newItem.id })
      successMessage.value = 'Location added.'
    }
    showForm.value = false
    editingId.value = ''
  } catch (error) {
    actionError.value =
      'Unable to save the location. Check your connection and admin permissions, then try again.'
    console.error('Unable to save location:', error)
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
    await deleteDoc(doc(db, 'locations', id))
    items.value = items.value.filter((item) => item.id !== id)
    pendingDelete.value = null
    successMessage.value = 'Location deleted.'
  } catch (error) {
    actionError.value =
      'Unable to delete the location. Check your connection and admin permissions, then try again.'
    console.error('Unable to delete location:', error)
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

<style scoped>
textarea {
  resize: none;
}
</style>
