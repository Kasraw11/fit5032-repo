<template>
  <main>
    <section class="page-hero">
      <div class="container">
        <h1>Manage Recycle &amp; Reuse</h1>
        <p>Add, edit and manage recycling information.</p>
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
        + Add Item
      </button>

      <form v-if="showForm" class="card shadow-sm p-4 mb-4" novalidate @submit.prevent="saveItem">
        <h2 class="h4">{{ editingId ? 'Edit Item' : 'Add Item' }}</h2>
        <fieldset :disabled="isBusy">
          <div class="row g-3">
            <div class="col-12 col-md-6">
              <label for="item-name" class="form-label">Item Name (required)</label>
              <input
                id="item-name"
                ref="nameInput"
                v-model="form.name"
                type="text"
                class="form-control"
                :aria-invalid="!!errors.name"
                :aria-describedby="errors.name ? 'name-error' : undefined"
              />
              <p v-if="errors.name" id="name-error" class="text-danger mb-0 mt-1">
                {{ errors.name }}
              </p>
            </div>
            <div class="col-12 col-md-6">
              <label for="item-category" class="form-label">Category (required)</label>
              <input
                id="item-category"
                ref="categoryInput"
                v-model="form.category"
                type="text"
                class="form-control"
                :aria-invalid="!!errors.category"
                :aria-describedby="errors.category ? 'category-error' : undefined"
              />
              <p v-if="errors.category" id="category-error" class="text-danger mb-0 mt-1">
                {{ errors.category }}
              </p>
            </div>
            <div class="col-12 col-md-6">
              <label for="item-bestOption" class="form-label">Best Option</label>
              <input
                id="item-bestOption"
                v-model="form.bestOption"
                type="text"
                class="form-control"
              />
            </div>
            <div class="col-12">
              <label for="item-description" class="form-label">Item Details</label>
              <textarea
                id="item-description"
                v-model="form.description"
                class="form-control"
                rows="3"
              ></textarea>
            </div>
            <div class="col-12">
              <label for="item-reuse" class="form-label">Reuse Options</label>
              <textarea
                id="item-reuse"
                v-model="form.reuse"
                class="form-control"
                rows="3"
              ></textarea>
            </div>
            <div class="col-12">
              <label for="item-repair" class="form-label">Repair Options</label>
              <textarea
                id="item-repair"
                v-model="form.repair"
                class="form-control"
                rows="3"
              ></textarea>
            </div>
            <div class="col-12">
              <label for="item-recycle" class="form-label">Recycle Instructions</label>
              <textarea
                id="item-recycle"
                v-model="form.recycle"
                class="form-control"
                rows="3"
              ></textarea>
            </div>
            <div class="col-12">
              <label for="item-dispose" class="form-label">Disposal Instructions</label>
              <textarea
                id="item-dispose"
                v-model="form.dispose"
                class="form-control"
                rows="3"
              ></textarea>
            </div>
          </div>
          <div class="d-flex gap-2 mt-4">
            <button type="submit" class="btn btn-primary">
              {{ isSaving ? 'Saving...' : 'Save Item' }}
            </button>
            <button type="button" class="btn btn-outline-secondary" @click="closeForm">
              Cancel
            </button>
          </div>
        </fieldset>
      </form>

      <div v-if="pendingDelete" class="card border-danger p-4 mb-4">
        <h2 class="h4">Delete {{ pendingDelete.name }}?</h2>
        <p>This permanently removes the item from SmartLoop recycling information.</p>
        <div class="d-flex gap-2">
          <button
            ref="cancelDeleteButton"
            type="button"
            class="btn btn-outline-secondary"
            :disabled="isBusy"
            @click="cancelDelete"
          >
            Cancel
          </button>
          <button type="button" class="btn btn-danger" :disabled="isBusy" @click="deleteItem">
            {{ deletingId ? 'Deleting...' : 'Delete Item' }}
          </button>
        </div>
      </div>

      <div class="row mb-4">
        <div class="col-12 col-md-6 mb-3">
          <label for="admin-item-search" class="form-label">Search items</label>
          <div class="input-group">
            <input
              id="admin-item-search"
              ref="searchInput"
              v-model="searchTerm"
              type="search"
              class="form-control"
              placeholder="Item name, category or best option"
              :disabled="isLoading || !!loadError"
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
        <div class="col-12 col-md-6">
          <label for="category-filter" class="form-label">Filter by category</label>
          <select
            id="category-filter"
            v-model="selectedCategory"
            class="form-select"
            :disabled="isBusy || !!loadError"
          >
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
            <option
              v-if="selectedCategory && !categories.includes(selectedCategory)"
              :value="selectedCategory"
            >
              {{ selectedCategory }}
            </option>
          </select>
        </div>
      </div>
      <p v-if="isLoading" role="status">Loading recycling items...</p>
      <div v-else-if="loadError" class="alert alert-danger" role="alert">
        <p>{{ loadError }}</p>
        <button type="button" class="btn btn-outline-danger" :disabled="isBusy" @click="loadItems">
          Try Again
        </button>
      </div>
      <p v-else-if="items.length === 0">
        No recycling items yet. Use Add Item to create the first one.
      </p>
      <div v-else class="table-responsive">
        <table class="table table-striped align-middle">
          <caption>
            Recycling items
          </caption>
          <thead>
            <tr>
              <th scope="col" :aria-sort="sortColumn === 'name' ? sortDirection : 'none'">
                <button
                  type="button"
                  class="btn btn-link p-0 fw-bold text-decoration-none"
                  @click="sortBy('name')"
                >
                  Item Name
                  <span v-if="sortColumn === 'name'" aria-hidden="true">{{
                    sortDirection === 'ascending' ? '(A-Z)' : '(Z-A)'
                  }}</span>
                </button>
              </th>
              <th scope="col" :aria-sort="sortColumn === 'category' ? sortDirection : 'none'">
                <button
                  type="button"
                  class="btn btn-link p-0 fw-bold text-decoration-none"
                  @click="sortBy('category')"
                >
                  Category
                  <span v-if="sortColumn === 'category'" aria-hidden="true">{{
                    sortDirection === 'ascending' ? '(A-Z)' : '(Z-A)'
                  }}</span>
                </button>
              </th>
              <th scope="col" :aria-sort="sortColumn === 'bestOption' ? sortDirection : 'none'">
                <button
                  type="button"
                  class="btn btn-link p-0 fw-bold text-decoration-none"
                  @click="sortBy('bestOption')"
                >
                  Best Option
                  <span v-if="sortColumn === 'bestOption'" aria-hidden="true">{{
                    sortDirection === 'ascending' ? '(A-Z)' : '(Z-A)'
                  }}</span>
                </button>
              </th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredItems.length === 0">
              <td colspan="4">
                No items match your search or category.
                <button type="button" class="btn btn-link" @click="resetFilters">
                  Show all items
                </button>
              </td>
            </tr>
            <tr v-for="item in sortedItems" :key="item.id">
              <td>{{ item.name }}</td>
              <td>{{ item.category }}</td>
              <td>{{ item.bestOption || 'Not set' }}</td>
              <td>
                <div class="d-flex gap-2">
                  <button
                    type="button"
                    class="btn btn-outline-primary btn-sm"
                    :disabled="isBusy || showForm || !!pendingDelete"
                    :aria-label="'Edit ' + item.name"
                    @click="startEdit(item)"
                  >
                    Edit
                  </button>
                  <button
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
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from '@/firebase/init'

const items = ref([])
const searchTerm = ref('')
const searchInput = ref(null)
const selectedCategory = ref('')
const sortColumn = ref('name')
const sortDirection = ref('ascending')

const categories = computed(() => {
  const categoryList = []
  for (const item of items.value) {
    if (item.category && !categoryList.includes(item.category)) {
      categoryList.push(item.category)
    }
  }
  return categoryList.sort((a, b) => a.localeCompare(b))
})

const filteredItems = computed(() => {
  const search = searchTerm.value.trim().toLowerCase()

  return items.value.filter((item) => {
    const name = String(item.name || '').toLowerCase()
    const category = String(item.category || '').toLowerCase()
    const bestOption = String(item.bestOption || '').toLowerCase()
    const matchesSearch =
      name.includes(search) || category.includes(search) || bestOption.includes(search)
    const matchesCategory =
      selectedCategory.value === '' || item.category === selectedCategory.value

    return matchesSearch && matchesCategory
  })
})

const sortedItems = computed(() => {
  const result = [...filteredItems.value]
  result.sort((a, b) => {
    const firstValue = String(a[sortColumn.value] || '')
    const secondValue = String(b[sortColumn.value] || '')
    const comparison = firstValue.localeCompare(secondValue, 'en', {
      sensitivity: 'base',
      numeric: true,
    })
    if (sortDirection.value === 'ascending') return comparison
    return -comparison
  })
  return result
})

function clearSearch() {
  searchTerm.value = ''
  searchInput.value?.focus()
}

function resetFilters() {
  selectedCategory.value = ''
  clearSearch()
}

function sortBy(column) {
  if (sortColumn.value === column) {
    if (sortDirection.value === 'ascending') {
      sortDirection.value = 'descending'
    } else {
      sortDirection.value = 'ascending'
    }
  } else {
    sortColumn.value = column
    sortDirection.value = 'ascending'
  }
}
const isLoading = ref(false)
const isSaving = ref(false)
const deletingId = ref('')
const loadError = ref('')
const actionError = ref('')
const successMessage = ref('')
const showForm = ref(false)
const editingId = ref('')
const pendingDelete = ref(null)
const nameInput = ref(null)
const categoryInput = ref(null)
const addButton = ref(null)
const cancelDeleteButton = ref(null)
const isBusy = computed(() => isLoading.value || isSaving.value || !!deletingId.value)

const form = reactive({
  name: '',
  category: '',
  bestOption: '',
  description: '',
  reuse: '',
  repair: '',
  recycle: '',
  dispose: '',
})
const errors = reactive({ name: '', category: '' })

async function loadItems() {
  if (isBusy.value) return
  isLoading.value = true
  loadError.value = ''
  try {
    const snapshot = await getDocs(collection(db, 'recycleItems'))
    items.value = snapshot.docs.map((item) => ({ ...item.data(), id: item.id }))
  } catch (error) {
    loadError.value = 'Unable to load recycling items. Please try again.'
    console.error('Unable to load recycling items:', error)
  } finally {
    isLoading.value = false
  }
}

async function startAdd() {
  if (isBusy.value || loadError.value || showForm.value || pendingDelete.value) return
  editingId.value = ''
  for (const field in form) form[field] = ''
  errors.name = ''
  errors.category = ''
  actionError.value = ''
  successMessage.value = ''
  showForm.value = true
  await nextTick()
  nameInput.value?.focus()
}

async function startEdit(item) {
  if (isBusy.value || showForm.value || pendingDelete.value) return
  editingId.value = item.id
  for (const field in form) {
    if (typeof item[field] === 'string') {
      form[field] = item[field]
    } else {
      form[field] = ''
    }
  }
  errors.name = ''
  errors.category = ''
  actionError.value = ''
  successMessage.value = ''
  showForm.value = true
  await nextTick()
  nameInput.value?.focus()
}

async function closeForm() {
  if (isBusy.value) return
  showForm.value = false
  editingId.value = ''
  actionError.value = ''
  await nextTick()
  addButton.value?.focus()
}

async function saveItem() {
  if (isBusy.value || !showForm.value) return
  errors.name = ''
  errors.category = ''
  if (!form.name.trim()) errors.name = 'Enter an item name.'
  if (!form.category.trim()) errors.category = 'Enter a category.'
  if (errors.name || errors.category) {
    await nextTick()
    if (errors.name) nameInput.value?.focus()
    else categoryInput.value?.focus()
    return
  }

  isSaving.value = true
  actionError.value = ''
  successMessage.value = ''
  const itemData = {
    name: form.name.trim(),
    category: form.category.trim(),
    bestOption: form.bestOption.trim(),
    description: form.description.trim(),
    reuse: form.reuse.trim(),
    repair: form.repair.trim(),
    recycle: form.recycle.trim(),
    dispose: form.dispose.trim(),
  }
  try {
    if (editingId.value) {
      await updateDoc(doc(db, 'recycleItems', editingId.value), itemData)
      items.value = items.value.map((item) => {
        if (item.id === editingId.value) {
          return { ...item, ...itemData }
        }
        return item
      })
      successMessage.value = 'Item updated.'
    } else {
      itemData.createdAt = serverTimestamp()
      const newItem = await addDoc(collection(db, 'recycleItems'), itemData)
      items.value.push({ ...itemData, id: newItem.id })
      successMessage.value = 'Item added.'
    }
    showForm.value = false
    editingId.value = ''
  } catch (error) {
    actionError.value =
      'Unable to save the item. Check your connection and admin permissions, then try again.'
    console.error('Unable to save recycling item:', error)
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
  deletingId.value = pendingDelete.value.id
  actionError.value = ''
  try {
    await deleteDoc(doc(db, 'recycleItems', deletingId.value))
    items.value = items.value.filter((item) => item.id !== deletingId.value)
    pendingDelete.value = null
    successMessage.value = 'Item deleted.'
  } catch (error) {
    actionError.value =
      'Unable to delete the item. Check your connection and admin permissions, then try again.'
    console.error('Unable to delete recycling item:', error)
  } finally {
    deletingId.value = ''
    await nextTick()
    if (pendingDelete.value) cancelDeleteButton.value?.focus()
    else addButton.value?.focus()
  }
}

onMounted(loadItems)
</script>

<style scoped>
textarea {
  resize: none;
}
</style>
