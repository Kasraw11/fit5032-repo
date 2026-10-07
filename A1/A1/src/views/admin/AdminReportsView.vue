<template>
  <main>
    <section class="page-hero">
      <div class="container">
        <h1>Reports &amp; Export</h1>
        <p>View, search and export SmartLoop data.</p>
      </div>
    </section>
    <section class="container py-4">
      <p v-if="isLoading" role="status">Loading report data...</p>
      <div v-if="loadError" class="alert alert-danger" role="alert">
        <p>{{ loadError }}</p>
        <button class="btn btn-outline-danger" type="button" @click="loadData">Try Again</button>
      </div>
      <template v-if="dataLoaded">
        <section class="card p-3 p-md-4" aria-labelledby="report-heading">
          <h2 id="report-heading" class="h4 mb-3">Report Data</h2>
          <div class="d-flex flex-wrap gap-2 mb-3" role="group" aria-label="Choose report">
            <button
              type="button"
              class="btn"
              :class="selectedReport === 'events' ? 'btn-primary' : 'btn-outline-primary'"
              :aria-pressed="selectedReport === 'events'"
              @click="selectReport('events')"
            >
              Events
            </button>
            <button
              type="button"
              class="btn"
              :class="selectedReport === 'items' ? 'btn-primary' : 'btn-outline-primary'"
              :aria-pressed="selectedReport === 'items'"
              @click="selectReport('items')"
            >
              Recycle &amp; Reuse
            </button>
          </div>
          <h3 class="h5">{{ selectedReport === 'events' ? 'Events' : 'Recycle & Reuse Items' }}</h3>
          <div class="mb-3">
            <label for="report-search" class="form-label">Search this report</label>
            <div class="input-group">
              <input
                id="report-search"
                v-model="globalSearch"
                type="search"
                class="form-control"
                @input="searchReport"
              />
              <button
                v-if="globalSearch"
                type="button"
                class="btn btn-outline-secondary"
                @click="clearGlobalSearch"
              >
                Clear
              </button>
            </div>
          </div>
          <fieldset class="mb-3">
            <legend class="h6">Column filters</legend>
            <div class="row g-2">
              <div
                v-for="(column, index) in reportColumns"
                :key="selectedReport + column.title"
                class="col-12 col-sm-6 col-lg-4"
              >
                <label :for="'report-filter-' + index" class="form-label">{{ column.title }}</label>
                <input
                  :id="'report-filter-' + index"
                  v-model="columnSearch[index]"
                  type="search"
                  class="form-control"
                  @input="searchColumn(index)"
                />
              </div>
            </div>
            <button
              type="button"
              class="btn btn-outline-secondary btn-sm mt-2"
              @click="clearFilters"
            >
              Clear column filters
            </button>
          </fieldset>
          <div class="table-responsive">
            <DataTable
              :key="selectedReport"
              ref="reportTable"
              :data="reportRows"
              :columns="reportColumns"
              :options="tableOptions"
              class="table table-striped table-hover w-100"
            >
              <caption class="visually-hidden">
                {{
                  selectedReport === 'events' ? 'Events report' : 'Recycle and reuse report'
                }}
              </caption>
            </DataTable>
          </div>
        </section>

        <section class="card p-3 p-md-4 mt-4" aria-labelledby="export-heading">
          <h2 id="export-heading" class="h4 mb-2">Export Data</h2>
          <p class="text-muted mb-3">Download event or recycle item records as a CSV file.</p>
          <div class="d-flex flex-wrap gap-2">
            <button
              type="button"
              class="btn btn-outline-primary"
              :disabled="!events.length"
              @click="exportEvents"
            >
              Export Events CSV
            </button>
            <button
              type="button"
              class="btn btn-outline-primary"
              :disabled="!recycleItems.length"
              @click="exportItems"
            >
              Export Recycle Items CSV
            </button>
          </div>
          <p class="small text-muted mt-2 mb-0">
            CSV exports include all loaded records, including rows hidden by search or pagination.
          </p>
        </section>
      </template>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/init'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-bs5'
import 'datatables.net-bs5/css/dataTables.bootstrap5.css'

DataTable.use(DataTablesCore)

const events = ref([])
const recycleItems = ref([])
const isLoading = ref(false)
const dataLoaded = ref(false)
const loadError = ref('')
const selectedReport = ref('events')
const reportTable = ref(null)
const globalSearch = ref('')
const columnSearch = ref([])
let pageClosed = false

const eventHeaders = ['Event Name', 'Category', 'Date', 'Location', 'Status']
const itemHeaders = ['Item Name', 'Category', 'Best Option']
const tableOptions = {
  pageLength: 10,
  lengthChange: false,
  searching: true,
  ordering: true,
  paging: true,
  order: [[0, 'asc']],
  layout: { topStart: null, topEnd: null, bottomStart: 'info', bottomEnd: 'paging' },
  language: { emptyTable: 'No records available.', zeroRecords: 'No records match your search.' },
}

const eventRows = computed(() => {
  const rows = []
  events.value.forEach((event) => {
    rows.push([
      event.name || '',
      event.category || '',
      formatDate(event.date),
      eventLocation(event),
      event.status || '',
    ])
  })
  return rows
})

const itemRows = computed(() => {
  const rows = []
  recycleItems.value.forEach((item) =>
    rows.push([item.name || '', item.category || '', item.bestOption || '']),
  )
  return rows
})

const reportRows = computed(() =>
  selectedReport.value === 'events' ? eventRows.value : itemRows.value,
)
const reportColumns = computed(() => {
  const columns = []
  const headers = selectedReport.value === 'events' ? eventHeaders : itemHeaders
  headers.forEach((title) => columns.push({ title, render: DataTablesCore.render.text() }))
  return columns
})

function formatDate(value) {
  if (!value) return ''
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  const date = typeof value.toDate === 'function' ? value.toDate() : new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString('en-CA', { timeZone: 'Australia/Sydney' })
}

function eventLocation(event) {
  if (event.address) return event.address
  if (typeof event.location === 'string') return event.location
  if (
    typeof event.location?.latitude === 'number' &&
    typeof event.location?.longitude === 'number'
  ) {
    return event.location.latitude + ', ' + event.location.longitude
  }
  return ''
}

async function loadData() {
  if (isLoading.value) return
  isLoading.value = true
  loadError.value = ''
  dataLoaded.value = false
  try {
    const eventSnapshot = await getDocs(collection(db, 'events'))
    const itemSnapshot = await getDocs(collection(db, 'recycleItems'))
    if (pageClosed) return
    events.value = []
    recycleItems.value = []
    eventSnapshot.forEach((document) => events.value.push(document.data()))
    itemSnapshot.forEach((document) => recycleItems.value.push(document.data()))
    globalSearch.value = ''
    columnSearch.value = []
    dataLoaded.value = true
  } catch {
    loadError.value = 'Unable to load report data. Check your connection and try again.'
  } finally {
    isLoading.value = false
  }
}

function selectReport(report) {
  if (selectedReport.value === report) return
  selectedReport.value = report
  globalSearch.value = ''
  columnSearch.value = []
}

function searchReport() {
  reportTable.value?.dt.search(globalSearch.value).draw()
}

function clearGlobalSearch() {
  globalSearch.value = ''
  searchReport()
  document.getElementById('report-search')?.focus()
}

function searchColumn(index) {
  reportTable.value?.dt
    .column(index)
    .search(columnSearch.value[index] || '')
    .draw()
}

function clearFilters() {
  columnSearch.value = []
  reportColumns.value.forEach((column, index) => {
    reportTable.value?.dt.column(index).search('')
  })
  reportTable.value?.dt.draw()
}

function csvCell(value) {
  let text = String(value ?? '')
  if (/^[\s]*[=+\-@]/.test(text) || /^[\t\r\n]/.test(text)) text = "'" + text
  return '"' + text.replaceAll('"', '""') + '"'
}

function downloadCsv(headers, rows, filename) {
  const lines = [headers.map(csvCell).join(',')]
  rows.forEach((row) => lines.push(row.map(csvCell).join(',')))
  const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function exportEvents() {
  downloadCsv(eventHeaders, eventRows.value, 'smartloop-events.csv')
}

function exportItems() {
  downloadCsv(itemHeaders, itemRows.value, 'smartloop-recycle-items.csv')
}

onMounted(loadData)
onBeforeUnmount(() => {
  pageClosed = true
})
</script>
