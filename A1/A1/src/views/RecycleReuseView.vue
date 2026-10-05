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
              placeholder="For example, jar or glass"
              :disabled="isLoading"
            />
            <button
              v-if="searchTerm"
              type="button"
              class="btn btn-outline-secondary"
              :disabled="isLoading"
              @click="clearSearch"
            >
              Clear
            </button>
          </div>
        </div>

        <div class="col-12 col-md-4 mb-4">
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
      <div v-if="loadError" class="alert alert-danger" role="alert">
        <p>{{ loadError }}</p>
        <button type="button" class="btn btn-outline-danger" @click="loadItems">Try Again</button>
      </div>
      <div v-if="!isLoading && !loadError" class="row">
        <div v-for="item in filteredItems" :key="item.id" class="col-12 col-sm-6 mb-3">
          <div
            class="card h-100 item-card card-gradient-1"
            data-bs-toggle="modal"
            data-bs-target="#itemDetailsModal"
            @click="selectItem(item)"
          >
            <div class="card-body">
              <h2 class="h5">
                {{ item.name }}
              </h2>

              <p>
                <strong>Category:</strong>
                {{ item.category }}
              </p>

              <p>
                {{ item.description }}
              </p>

              <button
                type="button"
                class="btn btn-outline-primary w-20 mt-2"
                data-bs-toggle="modal"
                data-bs-target="#itemDetailsModal"
                @click="selectItem(item)"
              >
                View details
              </button>
            </div>
          </div>
        </div>
      </div>

      <p v-if="!isLoading && !loadError && filteredItems.length === 0">No items found.</p>

      <div id="itemDetailsModal" class="modal fade" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h2 class="modal-title fs-5">
                {{ selectedItem?.name }}
              </h2>

              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div v-if="selectedItem" class="modal-body">
              <p class="text-center">
                <strong>{{ selectedItem.category }}</strong>
              </p>

              <h3 class="h6">Item Details</h3>
              <p>{{ selectedItem.description }}</p>

              <h3 class="h6">Reuse Options</h3>
              <p>{{ selectedItem.reuse }}</p>

              <h3 class="h6">Repair Options</h3>
              <p>{{ selectedItem.repair || 'No repair information provided yet.' }}</p>

              <h3 class="h6">Recycle Instructions</h3>
              <p>{{ selectedItem.recycle }}</p>

              <h3 class="h6">Disposal Instructions</h3>
              <p>{{ selectedItem.dispose }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.item-card {
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.item-card:hover {
  transform: translateY(-5px);
}
</style>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/init'
import PageHero from '@/components/PageHero.vue'
import public_hero from '@/assets/images/public_hero.png'

const recycleItems = ref([])
const isLoading = ref(false)
const loadError = ref('')
const searchTerm = ref('')
const searchInput = ref(null)

const selectedCategory = ref('')

const selectedItem = ref(null)

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

const clearSearch = () => {
  searchTerm.value = ''
  searchInput.value?.focus()
}

const loadItems = async () => {
  if (isLoading.value) return
  isLoading.value = true
  loadError.value = ''
  try {
    const snapshot = await getDocs(collection(db, 'recycleItems'))
    recycleItems.value = snapshot.docs.map((item) => ({ ...item.data(), id: item.id }))
  } catch (error) {
    loadError.value = 'Unable to load recycling items. Please try again.'
    console.error('Unable to load recycling items:', error)
  } finally {
    isLoading.value = false
  }
}

const selectItem = (item) => {
  selectedItem.value = item
}

onMounted(loadItems)
</script>
