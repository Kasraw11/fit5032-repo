<template>
  <main>
    <PageHero
      title="Locations &amp; Events"
      subtitle="Add, edit and delete locations and events for SmartLoop."
      :image="public_hero"
    />
    <section class="container py-5">
      <FeedbackMessage v-model:message="successMessage" />
      <p v-if="actionError" class="alert alert-danger" role="alert">{{ actionError }}</p>
      <button
        ref="addButton"
        type="button"
        class="btn btn-primary mb-4"
        :disabled="isBusy || !!loadError || showForm || !!pendingDelete"
        @click="startAdd"
      >
        + Add Location or Event
      </button>
      <form
        v-if="showForm"
        ref="formElement"
        class="card shadow-sm p-4 mb-4"
        novalidate
        @submit.prevent="saveItem"
      >
        <h2 class="h4">{{ editingId ? 'Edit Location or Event' : 'Add Location or Event' }}</h2>
        <fieldset :disabled="isBusy">
          <div class="row g-3">
            <div class="col-12 col-md-6">
              <label class="form-label" for="locations-name">
                Name
                <span class="text-danger" aria-hidden="true">*</span>
              </label>
              <input
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
              <label class="form-label" for="locations-category">
                Category
                <span class="text-danger" aria-hidden="true">*</span>
              </label>
              <select
                id="locations-category"
                v-model="form.category"
                class="form-select"
                :aria-invalid="!!errors.category"
                :aria-describedby="errors.category ? 'locations-category-error' : undefined"
              >
                <option value="">Select a category</option>
                <option
                  v-for="category in notificationCategories"
                  :key="category"
                  :value="category"
                >
                  {{ category }}
                </option>
              </select>
              <p v-if="errors.category" id="locations-category-error" class="text-danger mt-1 mb-0">
                {{ errors.category }}
              </p>
            </div>
            <div class="col-12 col-md-6">
              <label class="form-label" for="locations-address">
                Address
                <span class="text-danger" aria-hidden="true">*</span>
              </label>
              <input
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
              <label class="form-label" for="locations-date"> Event Date </label>
              <input
                id="locations-date"
                v-model="form.date"
                type="date"
                class="form-control"
                :aria-invalid="!!errors.date"
                aria-describedby="locations-date-help locations-date-error"
              />
              <p id="locations-date-help" class="form-text">
                Add a date for an event. Leave it empty for a location.
              </p>
              <p v-if="errors.date" id="locations-date-error" class="text-danger">
                {{ errors.date }}
              </p>
            </div>
            <div v-if="form.date || editingCollection === 'events'" class="col-12 col-md-6">
              <label class="form-label" for="locations-status">Event Status</label>
              <select id="locations-status" v-model="form.status" class="form-select">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="cancelled">Cancelled</option>
              </select>
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
            Enter an address, click Find Location, and choose the correct address before saving.
          </p>
          <div class="d-flex gap-2 mt-3">
            <button type="submit" class="btn btn-primary">
              {{ isSaving ? 'Saving...' : 'Save' }}</button
            ><button type="button" class="btn btn-outline-secondary" @click="closeForm">
              Cancel
            </button>
          </div>
        </fieldset>
      </form>
      <div v-if="pendingDelete" class="card border-danger p-4 mb-4">
        <h2 class="h4">Delete {{ pendingDelete.name }}?</h2>
        <p>This permanently removes this location or event from SmartLoop.</p>
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
            {{ isDeleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
      <div class="row mb-4">
        <div class="col-12 col-md-6 mb-3">
          <label for="locations-search" class="form-label">Search locations and events</label>
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
          <label for="locations-filter" class="form-label">Filter by category</label
          ><select
            id="locations-filter"
            v-model="selectedFilter"
            class="form-select"
            :disabled="isLoading"
          >
            <option value="">All Categories</option>
            <option v-for="category in notificationCategories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
      </div>
      <p v-if="isLoading" role="status">Loading locations and events...</p>
      <div v-else-if="loadError" class="alert alert-danger" role="alert">
        <p>{{ loadError }}</p>
        <button type="button" class="btn btn-outline-danger" @click="loadItems">Try Again</button>
      </div>
      <p v-else-if="items.length === 0">
        No locations or events yet. Use Add Location or Event to create the first one.
      </p>
      <div v-else class="table-responsive">
        <table class="table table-striped align-middle">
          <caption>
            Locations and Events
          </caption>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Category</th>
              <th scope="col">Address</th>
              <th scope="col">Date</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredItems.length === 0">
              <td colspan="5">
                No locations or events match your search or filter.
                <button type="button" class="btn btn-link" @click="resetFilters">
                  Show all locations and events
                </button>
              </td>
            </tr>
            <tr v-for="item in filteredItems" :key="item.collectionName + '_' + item.id">
              <td>{{ item.name }}</td>
              <td>{{ locationCategory(item) }}</td>
              <td>{{ item.address }}</td>
              <td>{{ item.date || '—' }}</td>
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
import { auth, db } from '@/firebase/init'
import axios from 'axios'
import PageHero from '@/components/PageHero.vue'
import FeedbackMessage from '@/components/FeedbackMessage.vue'
import public_hero from '@/assets/images/public_hero.png'

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
const editingCollection = ref('')
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
  address: '',
  latitude: '',
  longitude: '',
  description: '',
  date: '',
  status: 'draft',
})
const errors = reactive({})
const notificationCategories = [
  'Donations',
  'Workshops',
  'Events',
  'Recycling Centres',
  'Repair Centres',
]

const filteredItems = computed(() => {
  const search = searchTerm.value.trim().toLowerCase()
  return items.value.filter((item) => {
    const name = String(item.name || '').toLowerCase()
    const address = String(item.address || '').toLowerCase()
    const matchesSearch = name.includes(search) || address.includes(search)
    const matchesFilter =
      selectedFilter.value === '' || locationCategory(item) === selectedFilter.value
    return matchesSearch && matchesFilter
  })
})

function locationCategory(item) {
  if (item.category === 'Workshop') return 'Workshops'
  if (notificationCategories.includes(item.category)) return item.category
  if (item.collectionName === 'events') return 'Events'
  if (item.type === 'donation') return 'Donations'
  if (item.type === 'repair') return 'Repair Centres'
  if (item.type === 'workshop') return 'Workshops'
  if (item.type === 'event') return 'Events'
  return 'Recycling Centres'
}

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
    const locations = await getDocs(collection(db, 'locations'))
    const events = await getDocs(collection(db, 'events'))
    items.value = []
    for (const item of locations.docs) {
      items.value.push({ ...item.data(), id: item.id, collectionName: 'locations' })
    }
    for (const item of events.docs) {
      items.value.push({ ...item.data(), id: item.id, collectionName: 'events' })
    }
  } catch (error) {
    loadError.value = 'Unable to load locations and events. Please try again.'
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
  addressResults.value = []
  locationError.value = ''
  locationMessage.value = 'Location selected. Check the address before saving.'
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
  const lookupUrl = import.meta.env.VITE_FIND_LOCATION_URL
  if (!lookupUrl || !auth.currentUser) {
    locationError.value = 'Address lookup is unavailable. Please sign in and try again.'
    return
  }

  isFindingLocation.value = true
  geocodingController = new AbortController()
  try {
    const token = await auth.currentUser.getIdToken()
    const response = await axios.post(
      lookupUrl,
      { address: form.address.trim() },
      {
        headers: { Authorization: 'Bearer ' + token },
        signal: geocodingController.signal,
        timeout: 20000,
      },
    )
    if (!response.data.success) throw new Error('Address lookup failed.')
    addressResults.value = response.data.locations
    if (addressResults.value.length === 1) {
      chooseAddress(addressResults.value[0])
    } else if (addressResults.value.length === 0) {
      locationError.value =
        'No matching address found. Include a street, suburb and postcode, then try again.'
    }
  } catch (error) {
    locationError.value = 'Unable to find the address. Please try again.'
    console.error('Address lookup failed:', error.response?.status)
  } finally {
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
  editingCollection.value = ''
  form.name = ''
  form.category = ''
  form.address = ''
  form.latitude = ''
  form.longitude = ''
  form.description = ''
  form.date = ''
  form.status = 'draft'
  await openForm()
}
async function startEdit(item) {
  if (isBusy.value || showForm.value || pendingDelete.value) return
  editingId.value = item.id
  editingCollection.value = item.collectionName
  form.name = item.name || ''
  form.category = locationCategory(item)
  form.address = item.address || ''
  form.latitude = item.location?.latitude ?? ''
  form.longitude = item.location?.longitude ?? ''
  form.description = item.description || ''
  form.date = item.date || ''
  form.status = item.status || 'draft'
  await openForm()
}
async function closeForm() {
  if (isBusy.value) return
  showForm.value = false
  editingId.value = ''
  editingCollection.value = ''
  actionError.value = ''
  await nextTick()
  addButton.value?.focus()
}

function validateForm() {
  for (const field in errors) errors[field] = ''
  if (!String(form.name).trim()) {
    errors.name = 'Enter a name.'
  }
  if (!String(form.address).trim()) {
    errors.address = 'Enter an address.'
  }
  const latitude = Number(form.latitude)
  const longitude = Number(form.longitude)
  if (
    String(form.latitude).trim() === '' ||
    String(form.longitude).trim() === '' ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    errors.address = 'Click Find Location and choose an address before saving.'
  }

  if (!notificationCategories.includes(form.category)) {
    errors.category = 'Choose a notification category.'
  }
  if (editingCollection.value === 'events' && !form.date) {
    errors.date = 'Choose a date for this event.'
  }
  if (form.date) {
    const date = new Date(form.date)
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(form.date) ||
      !Number.isFinite(date.getTime()) ||
      date.toISOString().slice(0, 10) !== form.date
    ) {
      errors.date = 'Choose a valid event date.'
    }
    if (!['draft', 'published', 'cancelled'].includes(form.status)) {
      errors.date = 'Choose a valid event status.'
    }
  }
  if (editingCollection.value === 'locations' && form.date) {
    errors.date = 'This is an existing location. Add a new entry for a dated event.'
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
    type: {
      Donations: 'donation',
      Workshops: 'workshop',
      Events: 'event',
      'Recycling Centres': 'recycling',
      'Repair Centres': 'repair',
    }[form.category],
    category: form.category,
    address: form.address.trim(),
    description: form.description.trim(),
    location: new GeoPoint(latitude, longitude),
  }
  const collectionName = editingCollection.value || (form.date ? 'events' : 'locations')
  if (collectionName === 'events') {
    itemData.date = form.date
    itemData.status = form.status
  }
  try {
    if (editingId.value) {
      await updateDoc(doc(db, collectionName, editingId.value), itemData)
      items.value = items.value.map((item) => {
        if (item.id === editingId.value && item.collectionName === collectionName) {
          return { ...item, ...itemData }
        }
        return item
      })
      successMessage.value = 'Entry updated.'
    } else {
      const newItem = await addDoc(collection(db, collectionName), itemData)
      items.value.push({ ...itemData, id: newItem.id, collectionName })
      successMessage.value = 'Entry added.'
    }
    showForm.value = false
    editingId.value = ''
    editingCollection.value = ''
  } catch (error) {
    actionError.value =
      'Unable to save. Check your connection and admin permissions, then try again.'
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
  const collectionName = pendingDelete.value.collectionName
  try {
    await deleteDoc(doc(db, collectionName, id))
    items.value = items.value.filter(
      (item) => item.id !== id || item.collectionName !== collectionName,
    )
    pendingDelete.value = null
    successMessage.value = 'Entry deleted.'
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
