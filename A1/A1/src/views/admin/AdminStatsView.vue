<template>
  <main>
    <PageHero
      title="Stats &amp; Charts"
      subtitle="A simple overview of SmartLoop events, locations and recycling information."
      :image="public_hero"
    />
    <section class="container py-5">
      <LoadingIndicator v-if="isLoading" message="Loading chart data..." />
      <div v-if="loadError" class="alert alert-danger" role="alert">
        <p>{{ loadError }}</p>
        <button class="btn btn-outline-danger" type="button" @click="loadData">Try Again</button>
      </div>

      <template v-if="dataLoaded">
        <h2 class="h4 mb-3">Summary</h2>
        <div class="summary-grid mb-4">
          <article class="card card-gradient-4 p-4 shadow-sm">
            <h3 class="h6 text-body-secondary mb-3">Registered Accounts</h3>
            <LoadingIndicator v-if="isLoadingUsers" message="Counting users..." />
            <div v-else-if="userCountError">
              <p class="small text-danger" role="alert">{{ userCountError }}</p>
              <button type="button" class="btn btn-outline-secondary btn-sm" @click="loadUserCount">
                Try Again
              </button>
            </div>
            <template v-else>
              <p class="display-6 fw-semibold mb-2">{{ userCount }}</p>
              <p class="mb-0">Users: {{ regularUserCount }} · Admins: {{ adminCount }}</p>
            </template>
          </article>
          <article class="card card-gradient-1 p-4 shadow-sm">
            <h3 class="h6 text-body-secondary mb-3">Total Events</h3>
            <p class="display-6 fw-semibold text-primary mb-0">{{ events.length }}</p>
          </article>
          <article class="card card-gradient-2 p-4 shadow-sm">
            <h3 class="h6 text-body-secondary mb-3">Total Locations</h3>
            <p class="display-6 fw-semibold text-success mb-0">{{ locations.length }}</p>
          </article>
          <article class="card card-gradient-3 p-4 shadow-sm">
            <h3 class="h6 text-body-secondary mb-3">Recycle Items</h3>
            <p class="display-6 fw-semibold items-total mb-0">{{ recycleItems.length }}</p>
          </article>
        </div>

        <h2 id="charts-heading" class="h4 mb-2">Charts</h2>
        <p class="text-body-secondary mb-4">Compare the number of records in each group.</p>
        <div class="charts-grid">
          <article class="card p-4 shadow-sm">
            <h3 class="h5 mb-2">Events &amp; Locations by Category</h3>
            <p class="small text-body-secondary mb-4">
              Number of events and locations in each category
            </p>
            <p v-if="!values.length" class="text-body-secondary py-5 text-center">
              No events or locations available.
            </p>
            <div v-show="values.length" class="chart-container">
              <canvas
                ref="entriesCanvas"
                role="img"
                :aria-label="
                  chartDescription(values, 'category', 'Events and locations by category')
                "
              ></canvas>
            </div>
          </article>

          <article class="card p-4 shadow-sm">
            <h3 class="h5 mb-2">Recycle Items by Category</h3>
            <p class="small text-body-secondary mb-4">Number of recycling items in each category</p>
            <p v-if="!recycleItems.length" class="text-body-secondary py-5 text-center">
              No recycle items available.
            </p>
            <div v-show="recycleItems.length" class="chart-container">
              <canvas
                ref="itemsCanvas"
                role="img"
                :aria-label="
                  chartDescription(recycleItems, 'category', 'Recycle items by category')
                "
              ></canvas>
            </div>
          </article>
        </div>
      </template>
    </section>
  </main>
</template>

<script setup>
import { computed, nextTick, onMounted, onBeforeUnmount, ref } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { auth, db } from '@/firebase/init'
import axios from 'axios'
import Chart from 'chart.js/auto'
import PageHero from '@/components/PageHero.vue'
import LoadingIndicator from '@/components/LoadingIndicator.vue'
import public_hero from '@/assets/images/public_hero.png'

const events = ref([])
const locations = ref([])
const values = computed(() => [...events.value, ...locations.value])
const recycleItems = ref([])
const isLoading = ref(false)
const dataLoaded = ref(false)
const loadError = ref('')
const userCount = ref(null)
const regularUserCount = ref(null)
const adminCount = ref(null)
const isLoadingUsers = ref(false)
const userCountError = ref('')
const entriesCanvas = ref(null)
const itemsCanvas = ref(null)
let charts = []
let pageClosed = false

async function loadUserCount() {
  if (isLoadingUsers.value) return
  isLoadingUsers.value = true
  userCountError.value = ''
  try {
    const user = auth.currentUser
    const url = import.meta.env.VITE_USER_COUNT_URL
    if (!user || !url) throw new Error('User count is unavailable.')
    const token = await user.getIdToken()
    const response = await axios.post(
      url,
      {},
      {
        headers: { Authorization: 'Bearer ' + token },
        timeout: 125000,
      },
    )
    const counts = response.data
    if (!counts.success) throw new Error('Unable to count users.')
    for (const count of [counts.userCount, counts.regularUserCount, counts.adminCount]) {
      if (!Number.isInteger(count) || count < 0) throw new Error('Invalid user count.')
    }
    userCount.value = counts.userCount
    regularUserCount.value = counts.regularUserCount
    adminCount.value = counts.adminCount
  } catch {
    userCountError.value = 'Unable to load user and admin counts. Please try again.'
  } finally {
    isLoadingUsers.value = false
  }
}

async function loadData() {
  if (isLoading.value) return
  isLoading.value = true
  loadError.value = ''
  dataLoaded.value = false
  destroyCharts()
  try {
    const eventSnapshot = await getDocs(collection(db, 'events'))
    const locationSnapshot = await getDocs(collection(db, 'locations'))
    const itemSnapshot = await getDocs(collection(db, 'recycleItems'))
    if (pageClosed) return
    events.value = []
    locations.value = []
    recycleItems.value = []
    eventSnapshot.forEach((document) => events.value.push(document.data()))
    locationSnapshot.forEach((document) => locations.value.push(document.data()))
    itemSnapshot.forEach((document) => recycleItems.value.push(document.data()))
    dataLoaded.value = true
    await nextTick()
    if (pageClosed) return
    drawChart(entriesCanvas.value, values.value, 'category', 'Events & Locations', '#0d6efd')
    drawChart(itemsCanvas.value, recycleItems.value, 'category', 'Recycle items', '#6f42c1')
  } catch {
    dataLoaded.value = false
    destroyCharts()
    loadError.value = 'Unable to load chart data.'
  } finally {
    isLoading.value = false
  }
}

function countGroups(records, field) {
  const labels = []
  const counts = []
  for (const record of records) {
    const label = String(record[field] || 'Uncategorized')
    const index = labels.indexOf(label)
    if (index === -1) {
      labels.push(label)
      counts.push(1)
    } else counts[index] += 1
  }
  return { labels, counts }
}

function chartDescription(records, field, title) {
  const groups = countGroups(records, field)
  const descriptions = []
  for (let index = 0; index < groups.labels.length; index++) {
    descriptions.push(groups.labels[index] + ': ' + groups.counts[index])
  }
  return title + '. ' + (descriptions.join(', ') || 'No records available.')
}

function drawChart(canvas, records, field, label, color) {
  if (!records.length) return
  const groups = countGroups(records, field)
  charts.push(
    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: groups.labels,
        datasets: [
          {
            label,
            data: groups.counts,
            backgroundColor: color,
            borderRadius: 5,
            maxBarThickness: 28,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: {
          x: {
            beginAtZero: true,
            ticks: { precision: 0 },
            grid: { color: '#edf0f3' },
            border: { display: false },
          },
          y: { grid: { display: false }, border: { display: false } },
        },
      },
    }),
  )
}

function destroyCharts() {
  for (const chart of charts) chart.destroy()
  charts = []
}

onMounted(() => {
  loadData()
  loadUserCount()
})
onBeforeUnmount(() => {
  pageClosed = true
  destroyCharts()
})
</script>

<style scoped>
.summary-grid,
.charts-grid {
  display: grid;
  gap: 1rem;
}

@media (min-width: 768px) {
  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1200px) {
  .summary-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .charts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.items-total {
  color: #6f42c1;
}

.chart-container {
  position: relative;
  height: 300px;
}
</style>
