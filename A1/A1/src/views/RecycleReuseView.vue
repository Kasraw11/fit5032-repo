<template>
  <main>
    <PageHero
      title="Recycle & Reuse"
      subtitle="Learn how to properly recycle, reuse, and dispose of common items."
      :image="public_hero"
    />

    <div class="container py-5">
      <div class="row mb-4">
        <div class="col-12 col-md-6 mb-3">
          <label for="search" class="form-label">Search by item name or category</label>

          <div class="input-group">
            <input
              id="search"
              ref="searchInput"
              v-model="searchTerm"
              type="search"
              class="form-control"
              placeholder="Type an item name or category"
              :disabled="isLoading"
            />
          </div>
        </div>

        <div class="col-12 col-md-3 mb-4">
          <label for="category" class="form-label"> Filter by category </label>

          <select
            id="category"
            v-model="selectedCategory"
            class="form-select"
            :disabled="isLoading"
          >
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
      </div>

      <p v-if="isLoading" role="status">Loading recycling items...</p>
      <div v-else-if="loadError" class="alert alert-danger" role="alert">
        <p>{{ loadError }}</p>
        <button type="button" class="btn btn-outline-danger" @click="loadItems">Try Again</button>
      </div>
      <p v-else-if="filteredItems.length === 0">No items found.</p>
      <div v-else class="row">
        <div v-for="item in filteredItems" :key="item.id" class="col-12 col-md-3 mb-4">
          <div class="card h-100 p-3 selectable-card card-gradient-1">
            <h2 class="h5">
              <button
                type="button"
                class="stretched-link text-start text-reset bg-transparent border-0 p-0"
                style="font: inherit"
                data-bs-toggle="modal"
                data-bs-target="#itemDetailsModal"
                @click="selectItem(item)"
              >
                {{ item.name }}
              </button>
            </h2>

            <p>
              <strong>Category:</strong>
              {{ item.category }}
            </p>

            <p>
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>

      <div
        id="itemDetailsModal"
        class="modal fade"
        tabindex="-1"
        aria-hidden="true"
        aria-labelledby="item-details-title"
      >
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
          <div class="modal-content rounded-4 overflow-hidden">
            <div class="modal-header card-gradient-1 px-4">
              <h2 id="item-details-title" class="modal-title fs-5">
                {{ selectedItem?.name }}
              </h2>

              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div v-if="selectedItem" class="modal-body p-3 p-md-4">
              <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
                <span class="badge bg-primary">{{ selectedItem.category }}</span>
                <span class="small text-muted">
                  Best option: <strong>{{ selectedItem.bestOption || 'Not specified' }}</strong>
                </span>
              </div>

              <h3 class="h6">Item Details</h3>
              <p>{{ selectedItem.description }}</p>

              <div class="row g-3 mb-4">
                <div class="col-12 col-md-6">
                  <section class="card card-gradient-2 p-3 h-100">
                    <h3 class="h6">Reuse Options</h3>
                    <p class="small mb-0">
                      {{ selectedItem.reuse || 'No reuse information provided yet.' }}
                    </p>
                  </section>
                </div>
                <div class="col-12 col-sm-6">
                  <section class="card card-gradient-4 p-3 h-100">
                    <h3 class="h6">Repair Options</h3>
                    <p class="small mb-0">
                      {{ selectedItem.repair || 'No repair information provided yet.' }}
                    </p>
                  </section>
                </div>
                <div class="col-12 col-sm-6">
                  <section class="card card-gradient-1 p-3 h-100">
                    <h3 class="h6">Recycle Instructions</h3>
                    <p class="small mb-0">
                      {{ selectedItem.recycle || 'No recycling information provided yet.' }}
                    </p>
                  </section>
                </div>
                <div class="col-12 col-sm-6">
                  <section class="card card-gradient-7 p-3 h-100">
                    <h3 class="h6">Disposal Instructions</h3>
                    <p class="small mb-0">
                      {{ selectedItem.dispose || 'No disposal information provided yet.' }}
                    </p>
                  </section>
                </div>
              </div>

              <section
                v-if="currentUser"
                class="card card-gradient-1 p-3"
                aria-labelledby="reuse-ideas-title"
              >
                <h3 id="reuse-ideas-title" class="h6">AI reuse ideas</h3>
                <div>
                  <p class="small text-muted">Get three ideas for reusing this item.</p>
                  <button
                    type="button"
                    class="btn btn-primary btn-sm"
                    :disabled="isGettingIdeas"
                    @click="getReuseIdeas"
                  >
                    {{ isGettingIdeas ? 'Getting ideas...' : 'Suggest ways to reuse this' }}
                  </button>
                  <p v-if="isGettingIdeas" class="mt-2" role="status">
                    Generating three reuse ideas...
                  </p>

                  <div
                    v-if="reuseIdeas.length"
                    class="card card-gradient-2 p-3 mt-3 small"
                    aria-live="polite"
                    aria-labelledby="reuse-results-title"
                  >
                    <h4 id="reuse-results-title" class="h6 mb-2">Your reuse ideas</h4>
                    <ol class="ps-3 mb-2">
                      <li v-for="idea in reuseIdeas" :key="idea" class="mb-1">{{ idea }}</li>
                    </ol>
                    <p class="small text-muted mb-0">
                      AI-generated suggestions. Check that an idea is safe for your item.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { auth, db } from '@/firebase/init'
import { currentUser } from '@/authentication'
import { getFunctions, httpsCallable } from 'firebase/functions'
import PageHero from '@/components/PageHero.vue'
import public_hero from '@/assets/images/public_hero.png'

const recycleItems = ref([])
const isLoading = ref(false)
const loadError = ref('')
const searchTerm = ref('')
const searchInput = ref(null)

const selectedCategory = ref('')

const selectedItem = ref(null)
const reuseIdeas = ref([])
const aiError = ref('')
const isGettingIdeas = ref(false)
const requestReuseIdeas = httpsCallable(getFunctions(auth.app, 'us-central1'), 'getReuseIdeas', {
  timeout: 45000,
})
let aiRequestId = 0

function resetReuseIdeas() {
  aiRequestId += 1
  reuseIdeas.value = []
  aiError.value = ''
  isGettingIdeas.value = false
}

async function getReuseIdeas() {
  if (isGettingIdeas.value || !selectedItem.value) return
  aiError.value = ''
  reuseIdeas.value = []
  if (!currentUser.value) {
    aiError.value = 'Please sign in to get reuse ideas.'
    return
  }
  const requestId = ++aiRequestId
  isGettingIdeas.value = true
  try {
    const response = await requestReuseIdeas({
      itemId: selectedItem.value.id,
    })
    if (requestId !== aiRequestId) return
    const ideas = response.data.ideas
    if (
      !Array.isArray(ideas) ||
      ideas.length !== 3 ||
      ideas.some((idea) => typeof idea !== 'string')
    ) {
      throw new Error('Invalid ideas response.')
    }
    reuseIdeas.value = ideas
  } catch {
    if (requestId !== aiRequestId) return
    aiError.value = 'Unable to get reuse ideas. Please try again later.'
  } finally {
    if (requestId === aiRequestId) isGettingIdeas.value = false
  }
}

watch(() => currentUser.value?.uid, resetReuseIdeas)

const categories = computed(() => {
  const categoryList = []
  for (const item of recycleItems.value) {
    if (item.category && !categoryList.includes(item.category)) {
      categoryList.push(item.category)
    }
  }
  return categoryList.sort((a, b) => a.localeCompare(b))
})

const filteredItems = computed(() => {
  const search = searchTerm.value.trim().toLowerCase()

  return recycleItems.value.filter((item) => {
    const name = String(item.name || '').toLowerCase()
    const category = String(item.category || '').toLowerCase()
    const matchesSearch = name.includes(search) || category.includes(search)
    const matchesCategory =
      selectedCategory.value === '' || item.category === selectedCategory.value

    return matchesSearch && matchesCategory
  })
})

const loadItems = async () => {
  if (isLoading.value) return
  isLoading.value = true
  loadError.value = ''
  try {
    const snapshot = await getDocs(collection(db, 'recycleItems'))
    recycleItems.value = snapshot.docs.map((item) => ({ ...item.data(), id: item.id }))
  } catch {
    loadError.value = 'Unable to load recycling items. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const selectItem = (item) => {
  resetReuseIdeas()
  selectedItem.value = item
}

onMounted(loadItems)
</script>
