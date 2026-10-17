<template>
  <main>
    <PageHero
      v-if="showHero"
      :title="itemsOnly ? 'Recycling Reports & Export' : 'Reports & Export'"
      subtitle="View reports and export recycling items."
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

          <div class="row g-3 mb-3">
            <div class="col-12 col-md-2">
              <label for="search-by" class="form-label">Search in</label>
              <select id="search-by" v-model="searchBy" class="form-select" @change="searchReport">
                <option value="all">All columns</option>
                <option value="name">Name only</option>
              </select>
            </div>
            <div class="col-12 col-md-3">
              <label for="report-search" class="form-label">Search this report</label>
              <div class="input-group">
                <input
                  id="report-search"
                  v-model="globalSearch"
                  type="search"
                  class="form-control"
                  placeholder="For example, glass or repair"
                  @input="searchReport"
                />
              </div>
            </div>

            <div v-if="!itemsOnly" class="col-12 col-md-3">
              <label for="report-type" class="form-label">Report type</label>
              <select
                id="report-type"
                v-model="selectedReport"
                class="form-select"
                @change="resetFilters"
              >
                <option value="events">Events</option>
                <option value="items">Recycle &amp; Reuse</option>
              </select>
            </div>
            <div class="col-12 col-md-3">
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
          </div>
          <div class="table-responsive" tabindex="0" role="region" aria-label="Report table">
            <DataTable
              :key="isEventsReport ? 'events' : 'items'"
              ref="reportTable"
              :data="reportRows"
              :columns="reportColumns"
              :options="tableOptions"
              class="table table-striped table-hover w-100"
            >
              <caption class="visually-hidden">
                {{
                  isEventsReport ? 'Events report' : 'Recycle and reuse items report'
                }}
              </caption>
            </DataTable>
          </div>
        </section>

        <section class="card p-3 p-md-4 mt-4" aria-labelledby="export-heading">
          <h2 id="export-heading" class="h4 mb-2">Export Recycling Items</h2>
          <FeedbackMessage v-model:message="exportError" type="error" />
          <p class="text-muted mb-3">
            Download all recycling items as a CSV or TXT file, including items hidden by search,
            category filters or pagination.
          </p>
          <div class="col-12 col-md-6 mb-3">
            <label for="export-format" class="form-label">File format</label>
            <select id="export-format" v-model="exportFormat" class="form-select">
              <option value="csv">CSV</option>
              <option value="txt">TXT</option>
            </select>
          </div>
          <button
            type="button"
            class="btn btn-primary btn-sm align-self-start"
            :disabled="!itemRows.length"
            @click="exportItems"
          >
            Export Items {{ exportFormat.toUpperCase() }}
          </button>
          <p v-if="!itemRows.length" class="small text-muted mt-2" role="status">
            No recycling items available to export.
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
const selectedReport = ref(itemsOnly.value ? 'items' : 'events')
const isEventsReport = computed(() => !itemsOnly.value && selectedReport.value === 'events')
const events = ref([])
const recycleItems = ref([])
const isLoading = ref(false)
const dataLoaded = ref(false)
const loadError = ref('')
const exportError = ref('')
const exportFormat = ref('csv')
const reportTable = ref(null)
const globalSearch = ref('')
const searchBy = ref('all')
const selectedCategory = ref('')
let pageClosed = false

const itemHeaders = ['Item Name', 'Category', 'Best Option']
const eventHeaders = ['Event Name', 'Category', 'Date', 'Location', 'Status']
const reportHeaders = computed(() => (isEventsReport.value ? eventHeaders : itemHeaders))
// events start newest first
const tableOptions = computed(() => ({
  pageLength: 10,
  lengthChange: false,
  searching: true,
  ordering: true,
  paging: true,
  order: isEventsReport.value ? [[2, 'desc']] : [[1, 'asc']],
  layout: { topStart: null, topEnd: null, bottomStart: 'info', bottomEnd: 'paging' },
  language: { emptyTable: 'No records available.', zeroRecords: 'No records match your search.' },
}))

// downlods always use these item rows, even when the table shows events.
const itemRows = computed(() => {
  const rows = []
  for (const item of recycleItems.value) {
    rows.push([item.name || '', item.category || '', item.bestOption || ''])
  }
  return rows
})

const reportRows = computed(() => {
  if (!isEventsReport.value) return itemRows.value
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
  for (const title of reportHeaders.value) {
    columns.push({
      title: title,
      orderable: title === 'Category' || title === 'Date',
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
    if (eventSnapshot) {
      for (const document of eventSnapshot.docs) {
        events.value.push(document.data())
      }
    }
    recycleItems.value = []
    for (const document of itemSnapshot.docs) {
      recycleItems.value.push(document.data())
    }
    resetFilters()
    dataLoaded.value = true
  } catch {
    loadError.value = 'Unable to load report data. Check your connection and try again.'
  } finally {
    isLoading.value = false
  }
}

function resetFilters() {
  globalSearch.value = ''
  searchBy.value = 'all'
  selectedCategory.value = ''
}

function searchReport() {
  const table = reportTable.value.dt
  table.search('')
  table.column(0).search('')

  if (searchBy.value === 'name') {
    table.column(0).search(globalSearch.value)
  } else {
    table.search(globalSearch.value)
  }

  table.draw()
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

function exportItems() {
  const rows = itemRows.value
  if (rows.length === 0) return

  const filename = 'recycle_items_report'

  if (exportFormat.value === 'txt') {
    downloadTxt('SmartLoop Recycle & Reuse Report', itemHeaders, rows, filename + '.txt')
  } else {
    downloadCsv(itemHeaders, rows, filename + '.csv')
  }
}

onMounted(loadData)
onBeforeUnmount(() => {
  pageClosed = true
})
</script>
