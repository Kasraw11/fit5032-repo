<template>
  <main>
    <PageHero
      v-if="showHero"
      :title="itemsOnly ? 'Recycling Reports & Export' : 'Reports & Export'"
      subtitle="View, search and export SmartLoop data."
      :image="public_hero"
    />
    <section class="container py-4">
      <p v-if="isLoading" role="status">Loading report data...</p>
      <div v-else-if="loadError" class="alert alert-danger" role="alert">
        <p>{{ loadError }}</p>
        <button class="btn btn-outline-danger" type="button" @click="loadData">Try Again</button>
      </div>
      <template v-else-if="dataLoaded">
        <section class="card p-3 p-md-4" aria-labelledby="report-heading">
          <h2 id="report-heading" class="h4 mb-3">Report Data</h2>
          <div
            v-if="!itemsOnly"
            class="d-flex flex-wrap gap-2 mb-3"
            role="group"
            aria-label="Choose report"
          >
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
          <h3 class="h5">
            {{ !itemsOnly && selectedReport === 'events' ? 'Events' : 'Recycle & Reuse Items' }}
          </h3>
          <p class="small text-muted">
            Click a column heading to sort. Choose a category or use search to narrow the results.
            Each page shows up to 10 records.
          </p>
          <div class="mb-3">
            <label for="report-category" class="form-label">Category</label>
            <select
              id="report-category"
              v-model="selectedCategory"
              class="form-select"
              @change="filterCategory"
            >
              <option value="">All categories</option>
              <option v-for="category in reportCategories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
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
                  !itemsOnly && selectedReport === 'events'
                    ? 'Events report'
                    : 'Recycle and reuse report'
                }}
              </caption>
            </DataTable>
          </div>
        </section>

        <section class="card p-3 p-md-4 mt-4" aria-labelledby="export-heading">
          <h2 id="export-heading" class="h4 mb-2">Export Data</h2>
          <FeedbackMessage v-model:message="exportError" type="error" />
          <p class="text-muted mb-3">
            {{
              itemsOnly
                ? 'Download recycling item records as CSV or TXT files.'
                : 'Download event or recycle item records as CSV or TXT files.'
            }}
          </p>
          <fieldset class="mb-3">
            <legend class="h6">File format</legend>
            <div class="btn-group">
              <input
                id="export-csv"
                v-model="exportFormat"
                class="btn-check"
                type="radio"
                name="export-format"
                value="csv"
              />
              <label class="btn btn-outline-primary" for="export-csv">CSV</label>
              <input
                id="export-txt"
                v-model="exportFormat"
                class="btn-check"
                type="radio"
                name="export-format"
                value="txt"
              />
              <label class="btn btn-outline-primary" for="export-txt">TXT</label>
            </div>
          </fieldset>
          <fieldset v-if="!itemsOnly" class="mb-3">
            <legend class="h6">Report type</legend>
            <div class="btn-group">
              <input
                id="export-events"
                v-model="exportReport"
                class="btn-check"
                type="radio"
                name="export-report"
                value="events"
              />
              <label class="btn btn-outline-primary" for="export-events">Events</label>
              <input
                id="export-items"
                v-model="exportReport"
                class="btn-check"
                type="radio"
                name="export-report"
                value="items"
              />
              <label class="btn btn-outline-primary" for="export-items">Items</label>
            </div>
          </fieldset>
          <button
            type="button"
            class="btn btn-primary btn-sm align-self-start"
            :disabled="!exportRows.length"
            @click="exportSelectedReport"
          >
            Export {{ !itemsOnly && exportReport === 'events' ? 'Events' : 'Items' }}
            {{ exportFormat.toUpperCase() }}
          </button>
          <p v-if="!exportRows.length" class="small text-muted mt-2" role="status">
            No records available for this report.
          </p>
          <p class="small text-muted mt-2 mb-0">
            Exports include all loaded records, including rows hidden by search or pagination. User
            emails, IDs and roles are excluded.
          </p>
        </section>
      </template>
    </section>
  </main>
</template>

<script setup>
import PageHero from '@/components/PageHero.vue'
import public_hero from '@/assets/images/public_hero.png'
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import FeedbackMessage from '@/components/FeedbackMessage.vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/init'
import { isAdmin } from '@/authentication'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-bs5'
import 'datatables.net-bs5/css/dataTables.bootstrap5.css'

DataTable.use(DataTablesCore)

const props = defineProps({
  itemsOnly: { type: Boolean, default: false },
  showHero: { type: Boolean, default: true },
})
const itemsOnly = computed(() => props.itemsOnly || !isAdmin.value)

const events = ref([])
const recycleItems = ref([])
const isLoading = ref(false)
const dataLoaded = ref(false)
const loadError = ref('')
const exportError = ref('')
const exportFormat = ref('csv')
const exportReport = ref(itemsOnly.value ? 'items' : 'events')
const exportRows = computed(() => {
  if (!itemsOnly.value && exportReport.value === 'events') {
    return eventRows.value
  }
  return itemRows.value
})
const selectedReport = ref(itemsOnly.value ? 'items' : 'events')
const reportTable = ref(null)
const globalSearch = ref('')
const selectedCategory = ref('')
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
  for (const event of events.value) {
    rows.push([
      event.name || '',
      event.category || '',
      formatDate(event.date),
      eventLocation(event),
      event.status || '',
    ])
  }
  return rows
})

const itemRows = computed(() => {
  const rows = []
  for (const item of recycleItems.value) {
    rows.push([item.name || '', item.category || '', item.bestOption || ''])
  }
  return rows
})

const reportRows = computed(() => {
  if (!itemsOnly.value && selectedReport.value === 'events') {
    return eventRows.value
  }
  return itemRows.value
})
const reportCategories = computed(() => {
  const categories = []
  for (const row of reportRows.value) {
    const category = row[1]
    if (category && !categories.includes(category)) {
      categories.push(category)
    }
  }
  return categories.sort((a, b) => a.localeCompare(b))
})

const reportColumns = computed(() => {
  const columns = []
  let headers = itemHeaders
  if (!itemsOnly.value && selectedReport.value === 'events') {
    headers = eventHeaders
  }
  for (const title of headers) {
    columns.push({
      title: title,
      orderable: title !== 'Best Option' && title !== 'Location',
      render: DataTablesCore.render.text(),
    })
  }
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
    let eventSnapshot = null
    if (!itemsOnly.value) {
      eventSnapshot = await getDocs(collection(db, 'events'))
    }
    const itemSnapshot = await getDocs(collection(db, 'recycleItems'))
    if (pageClosed) return

    events.value = []
    recycleItems.value = []
    if (eventSnapshot) {
      for (const document of eventSnapshot.docs) {
        events.value.push(document.data())
      }
    }
    for (const document of itemSnapshot.docs) {
      recycleItems.value.push(document.data())
    }
    globalSearch.value = ''
    selectedCategory.value = ''
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
  selectedCategory.value = ''
}

function searchReport() {
  reportTable.value?.dt.search(globalSearch.value).draw()
}

function clearGlobalSearch() {
  globalSearch.value = ''
  searchReport()
  document.getElementById('report-search')?.focus()
}

function filterCategory() {
  reportTable.value?.dt.column(1).search(selectedCategory.value, { exact: true }).draw()
}

function csvCell(value) {
  let text = String(value ?? '')
  if (/^[\s]*[=+\-@]/.test(text) || /^[\t\r\n]/.test(text)) {
    text = "'" + text
  }
  text = text.replaceAll('"', '""')
  return '"' + text + '"'
}

function downloadFile(content, filename, fileType) {
  exportError.value = ''
  let fileUrl = null
  let downloadLink = null
  try {
    const file = new Blob([content], { type: fileType })
    fileUrl = URL.createObjectURL(file)

    downloadLink = document.createElement('a')
    downloadLink.href = fileUrl
    downloadLink.download = filename
    document.body.appendChild(downloadLink)
    downloadLink.click()
  } catch {
    exportError.value = 'Unable to download this report. Please try again.'
  } finally {
    if (downloadLink) downloadLink.remove()
    if (fileUrl) {
      setTimeout(() => URL.revokeObjectURL(fileUrl), 1000)
    }
  }
}

function downloadCsv(headers, rows, filename) {
  const lines = []
  const headerCells = []
  for (const header of headers) {
    headerCells.push(csvCell(header))
  }
  lines.push(headerCells.join(','))

  for (const row of rows) {
    const cells = []
    for (const value of row) {
      cells.push(csvCell(value))
    }
    lines.push(cells.join(','))
  }

  const content = '\uFEFF' + lines.join('\r\n')
  downloadFile(content, filename, 'text/csv;charset=utf-8;')
}

function downloadTxt(title, headers, rows, filename) {
  const lines = [title, 'Total records: ' + rows.length, '']
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    lines.push('Record ' + (rowIndex + 1))
    for (let columnIndex = 0; columnIndex < headers.length; columnIndex++) {
      const value = String(rows[rowIndex][columnIndex] ?? '').replace(/[\r\n\t]+/g, ' ')
      lines.push(headers[columnIndex] + ': ' + value)
    }
    lines.push('')
  }
  downloadFile(lines.join('\r\n'), filename, 'text/plain;charset=utf-8;')
}

function exportSelectedReport() {
  const rows = exportRows.value
  if (rows.length === 0) return

  let headers = itemHeaders
  let title = 'SmartLoop Recycle & Reuse Report'
  let filename = 'smartloop-recycle-items'
  if (!itemsOnly.value && exportReport.value === 'events') {
    headers = eventHeaders
    title = 'SmartLoop Events Report'
    filename = 'smartloop-events'
  }

  if (exportFormat.value === 'txt') {
    downloadTxt(title, headers, rows, filename + '.txt')
  } else {
    downloadCsv(headers, rows, filename + '.csv')
  }
}

onMounted(loadData)
onBeforeUnmount(() => {
  pageClosed = true
})
</script>
