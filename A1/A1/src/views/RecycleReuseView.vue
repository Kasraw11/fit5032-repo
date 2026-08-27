<script setup>
import { ref, computed } from 'vue'
import { recycleItems } from '../data/recycleItems.js'

const searchTerm = ref('')

const selectedCategory = ref('All')

const selectedItem = ref(null)

const filteredItems = computed(() => {
  return recycleItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.value.toLowerCase())

    const matchesCategory =
      selectedCategory.value === 'All' || item.category === selectedCategory.value

    return matchesSearch && matchesCategory
  })
})

const selectItem = (item) => {
  selectedItem.value = item
}
</script>

<template>
  <main class="container mt-4 pt-5">
    <h1>Recycle & Reuse</h1>

    <div class="row mt-3 mb-4">
      <div class="col-12 col-sm-6 mb-3">
        <label for="search" class="form-label"> Search item </label>

        <input
          id="search"
          v-model="searchTerm"
          type="text"
          class="form-control"
          placeholder="Search for an item"
        />
      </div>

      <div class="col-12 col-sm-6 mb-3">
        <label for="category" class="form-label"> Filter by category </label>

        <select id="category" v-model="selectedCategory" class="form-select">
          <option value="All">All Categories</option>
          <option value="Plastic">Plastic</option>
          <option value="Paper">Paper</option>
          <option value="Glass">Glass</option>
          <option value="E-Waste">E-Waste</option>
        </select>
      </div>
    </div>

    <div class="row">
      <div v-for="item in filteredItems" :key="item.id" class="col-12 col-sm-6 mb-3">
        <div
          class="card h-100 item-card"
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
              {{ item.details }}
            </p>

            <span class="text-primary"> View details </span>
          </div>
        </div>
      </div>
    </div>

    <p v-if="filteredItems.length === 0">No items found.</p>

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
            <p>{{ selectedItem.details }}</p>

            <h3 class="h6">Reuse Options</h3>
            <p>{{ selectedItem.reuse }}</p>

            <h3 class="h6">Repair Options</h3>
            <p>{{ selectedItem.repair }}</p>

            <h3 class="h6">Recycle Instructions</h3>
            <p>{{ selectedItem.recycle }}</p>

            <h3 class="h6">Disposal Instructions</h3>
            <p>{{ selectedItem.disposal }}</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.item-card {
  cursor: pointer;
}

.item-card:hover {
  transform: translateY(-2px);
}
</style>
