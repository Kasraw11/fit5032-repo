<script setup>
import { ref, computed } from 'vue'
import { recycleItems } from '../data/recycleItems'

const searchTerm = ref('')

const filteredItems = computed(() => {
  return recycleItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.value.toLowerCase()),
  )
})
</script>

<template>
  <main class="container mt-4">
    <h1>Recycle & Reuse</h1>

    <div class="mb-4 mt-3">
      <label for="search" class="form-label">Search item</label>

      <input
        id="search"
        v-model="searchTerm"
        type="text"
        class="form-control"
        placeholder="Search for an item"
      />
    </div>

    <div class="row">
      <div v-for="item in filteredItems" :key="item.id" class="col-12 col-sm-6 mb-3">
        <div class="card h-100">
          <div class="card-body">
            <h2 class="h5">
              {{ item.name }}
            </h2>

            <p>
              <strong>Category:</strong>
              {{ item.category }}
            </p>

            <p>
              {{ item.instruction }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <p v-if="filteredItems.length === 0">No items found.</p>
  </main>
</template>
