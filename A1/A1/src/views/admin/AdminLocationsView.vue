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
        type="button"
        class="btn btn-primary mb-4"
        :disabled="!canOpenForm || !!loadError"
        @click="openForm()"
      >
        + Add Location or Event
      </button>
      <form v-if="showForm" class="card shadow-sm p-4 mb-4" novalidate @submit.prevent="saveItem">
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
                class="form-control"
                rows="4"
              ></textarea>
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
              v-model="searchTerm"
              type="search"
              class="form-control"
              placeholder="Name or address"
              :disabled="isLoading"
            /><button
              v-if="searchTerm"
              type="button"
              class="btn btn-outline-secondary"
              @click="resetFilters(false)"
            >
              Clear
            </button>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <label for="locations-filter" class="form-label">Search by category</label
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
      <div
        v-else
        class="table-responsive"
        tabindex="0"
        role="region"
        aria-label="Locations and events table"
      >
        <DataTable
          :key="searchTerm + '|' + selectedFilter"
          ref="locationsTable"
          :data="filteredItems"
          :columns="tableColumns"
          :options="tableOptions"
          class="table table-striped align-middle w-100"
          @draw="keepPageInRange"
        >
          <caption>
            Locations and Events
          </caption>
          <template #column-category="{ rowData: item }">
            {{ locationCategory(item) }}
          </template>
          <template #column-actions="{ rowData: item }">
            <div class="d-flex gap-2">
              <button
                type="button"
                class="btn btn-outline-primary btn-sm"
                :disabled="!canOpenForm"
                :aria-label="'Edit ' + item.name"
                @click="openForm(item)"
              >
                Edit</button
              ><button
                type="button"
                class="btn btn-outline-danger btn-sm"
                :disabled="!canOpenForm"
                :aria-label="'Delete ' + item.name"
                @click="requestDelete(item)"
              >
                Delete
              </button>
            </div>
          </template>
        </DataTable>
        <button
          v-if="filteredItems.length === 0"
          type="button"
          class="btn btn-link"
          @click="resetFilters(true)"
        >
          Show all locations and events
        </button>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
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
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-bs5'
import 'datatables.net-bs5/css/dataTables.bootstrap5.css'

DataTable.use(DataTablesCore)

const locationsTable = ref(null)
const tableOptions = {
  pageLength: 10,
  lengthChange: false,
  paging: true,
  searching: false,
  ordering: true,
  order: [[3, 'desc']],
  layout: { topStart: null, topEnd: null, bottomStart: 'info', bottomEnd: 'paging' },
  language: { emptyTable: 'No locations or events match your search or filter.' },
}
const tableColumns = [
  {
    data: 'name',
    title: 'Name',
    defaultContent: '',
    orderable: false,
    render: DataTablesCore.render.text(),
  },
  { data: 'category', title: 'Category', name: 'category', defaultContent: '', orderable: false },
  {
    data: 'address',
    title: 'Address',
    defaultContent: '',
    orderable: false,
    render: DataTablesCore.render.text(),
  },
  {
    data: 'date',
    title: 'Date',
    defaultContent: '',
    type: 'date',
    render: DataTablesCore.render.text(),
  },
  { data: null, title: 'Actions', name: 'actions', defaultContent: '', orderable: false },
]

function keepPageInRange() {
  const table = locationsTable.value?.dt
  if (!table) return
  const page = table.page.info()
  if (page.pages > 0 && page.page >= page.pages) table.page('last').draw('page')
}

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
const canOpenForm = computed(() => !isBusy.value && !showForm.value && !pendingDelete.value)
const searchTerm = ref('')
const selectedFilter = ref('')
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
const categoryTypes = {
  Donations: 'donation',
  Workshops: 'workshop',
  Events: 'event',
  'Recycling Centres': 'recycling',
  'Repair Centres': 'repair',
}

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

function resetFilters(clearCategory) {
  searchTerm.value = ''
  if (clearCategory) selectedFilter.value = ''
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
  } catch {
    loadError.value = 'Unable to load locations and events. Please try again.'
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
  } catch {
    locationError.value = 'Unable to find the address. Please try again.'
  } finally {
    geocodingController = null
    isFindingLocation.value = false
  }
}

function openForm(item) {
  if (!canOpenForm.value || (!item && loadError.value)) return
  editingId.value = item?.id || ''
  editingCollection.value = item?.collectionName || ''
  form.name = item?.name || ''
  form.category = item ? locationCategory(item) : ''
  form.address = item?.address || ''
  form.latitude = item?.location?.latitude ?? ''
  form.longitude = item?.location?.longitude ?? ''
  form.description = item?.description || ''
  form.date = item?.date || ''
  form.status = item?.status || 'draft'
  addressResults.value = []
  locationError.value = ''
  locationMessage.value = ''
  for (const field in errors) errors[field] = ''
  actionError.value = ''
  successMessage.value = ''
  showForm.value = true
}
function closeForm() {
  if (isBusy.value) return
  showForm.value = false
  editingId.value = ''
  editingCollection.value = ''
  actionError.value = ''
}

function validateForm() {
  for (const field in errors) errors[field] = ''
  if (!form.name.trim()) {
    errors.name = 'Enter a name.'
  }
  if (!form.address.trim()) {
    errors.address = 'Enter an address.'
  }
  if (form.latitude === '' || form.longitude === '') {
    errors.address = 'Click Find Location and choose an address before saving.'
  }

  if (!form.category) {
    errors.category = 'Choose a notification category.'
  }
  if (editingCollection.value === 'events' && !form.date) {
    errors.date = 'Choose a date for this event.'
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
  if (!validateForm()) return
  const latitude = Number(form.latitude)
  const longitude = Number(form.longitude)
  isSaving.value = true
  actionError.value = ''
  successMessage.value = ''
  const itemData = {
    name: form.name.trim(),
    type: categoryTypes[form.category],
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
  } catch {
    actionError.value =
      'Unable to save. Check your connection and admin permissions, then try again.'
  } finally {
    isSaving.value = false
  }
}

function requestDelete(item) {
  if (!canOpenForm.value) return
  pendingDelete.value = item
  actionError.value = ''
  successMessage.value = ''
}
function cancelDelete() {
  if (isBusy.value) return
  pendingDelete.value = null
  actionError.value = ''
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
  } catch {
    actionError.value =
      'Unable to delete the location. Check your connection and admin permissions, then try again.'
  } finally {
    isDeleting.value = false
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
