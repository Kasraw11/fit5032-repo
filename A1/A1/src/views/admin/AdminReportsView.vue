<template>
  <main>
    <section class="page-hero">
      <div class="container">
        <h1>Reports &amp; Export</h1>
        <p>View, search and export SmartLoop data.</p>
      </div>
    </section>
    <section class="container py-5">
      <p class="text-muted">Example data only. Search and CSV export will be added later.</p>
      <div class="d-flex flex-wrap gap-2 mb-4" role="group" aria-label="Choose a report">
        <button
          type="button"
          class="btn"
          :class="selectedReport === 'events' ? 'btn-primary' : 'btn-outline-primary'"
          :aria-pressed="selectedReport === 'events'"
          @click="selectedReport = 'events'"
        >
          Events
        </button>
        <button
          type="button"
          class="btn"
          :class="selectedReport === 'locations' ? 'btn-primary' : 'btn-outline-primary'"
          :aria-pressed="selectedReport === 'locations'"
          @click="selectedReport = 'locations'"
        >
          Locations
        </button>
        <button
          type="button"
          class="btn"
          :class="selectedReport === 'recycle' ? 'btn-primary' : 'btn-outline-primary'"
          :aria-pressed="selectedReport === 'recycle'"
          @click="selectedReport = 'recycle'"
        >
          Recycle &amp; Reuse
        </button>
      </div>
      <div v-if="selectedReport === 'events'">
        <h2 class="h4">Events Report</h2>
        <div class="table-responsive">
          <table class="table table-striped">
            <caption>
              Example events
            </caption>
            <thead>
              <tr>
                <th scope="col">Event Name</th>
                <th scope="col">Category</th>
                <th scope="col">Date</th>
                <th scope="col">Location</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Community Clean-up</td>
                <td>Waste Reduction</td>
                <td>15 November 2026</td>
                <td>Example Park</td>
                <td>Published</td>
              </tr>
              <tr>
                <td>Repair Workshop</td>
                <td>Repair</td>
                <td>22 November 2026</td>
                <td>Example Community Hall</td>
                <td>Draft</td>
              </tr>
            </tbody>
          </table>
        </div>
        <button type="button" class="btn btn-primary" disabled>Export Events CSV</button>
      </div>
      <div v-else-if="selectedReport === 'locations'">
        <h2 class="h4">Locations Report</h2>
        <div class="table-responsive">
          <table class="table table-striped">
            <caption>
              Example locations
            </caption>
            <thead>
              <tr>
                <th scope="col">Location Name</th>
                <th scope="col">Type</th>
                <th scope="col">Address</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Example Recycling Centre</td>
                <td>Recycling</td>
                <td>10 Example Road</td>
                <td>Active</td>
              </tr>
              <tr>
                <td>Example Donation Store</td>
                <td>Donation</td>
                <td>20 Example Street</td>
                <td>Inactive</td>
              </tr>
            </tbody>
          </table>
        </div>
        <button type="button" class="btn btn-primary" disabled>Export Locations CSV</button>
      </div>
      <div v-else>
        <h2 class="h4">Recycle &amp; Reuse Report</h2>
        <div class="table-responsive">
          <table class="table table-striped">
            <caption>
              Example recycling items
            </caption>
            <thead>
              <tr>
                <th scope="col">Item Name</th>
                <th scope="col">Category</th>
                <th scope="col">Best Option</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Glass Jar</td>
                <td>Glass</td>
                <td>Recycling Bin</td>
              </tr>
              <tr>
                <td>Batteries</td>
                <td>E-Waste</td>
                <td>Recycling Point</td>
              </tr>
            </tbody>
          </table>
        </div>
        <button type="button" class="btn btn-primary" disabled>Export Recycle Items CSV</button>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'

const selectedReport = ref('events')
</script>
