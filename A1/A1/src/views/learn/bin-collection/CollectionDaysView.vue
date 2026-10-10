<template>
  <main class="container py-5">
    <PageHeader
      title="When We Collect Your Bins"
      subtitle="Your bin collection day depends on your address."
      back-to="/learn/bin-collection"
    />
    <section class="card card-body p-3 shadow-sm">
      <section class="card card-body">
        <h2>Collection schedule</h2>
        <ul>
          <li><strong>Food and garden waste bin (green lid):</strong> every week.</li>
          <li><strong>Recycling bin (yellow lid):</strong> every two weeks.</li>
          <li><strong>Landfill bin (red lid):</strong> every two weeks.</li>
        </ul>
        <p>Recycling and landfill bins are collected on alternating weeks.</p>
      </section>

      <section class="card card-body">
        <h2>Find your collection day</h2>
        <p>Enter your address on the City of Monash website to check your next collection dates.</p>
        <a
          class="btn btn-outline-primary"
          href="https://www.monash.vic.gov.au/Waste-Sustainability/Bin-Collection/When-we-collect-your-bins"
        >
          Check your collection day
        </a>
      </section>

      <section class="card card-body">
        <h2>Collection calendars</h2>
        <p>
          Monash has separate calendars for Area A and Area B. Use the map on Council's website to
          find your area, then download the matching calendar.
        </p>
        <p>Commercial properties use a separate collection calendar.</p>
      </section>

      <section class="card card-body">
        <h2>Before and after collection</h2>
        <ul>
          <li>Put your bins on the nature strip the night before collection.</li>
          <li>Bring your bins back onto your property within 24 hours of collection.</li>
        </ul>
        <p>
          If you live in an apartment or shared property, ask your property manager about your
          collection service.
        </p>
        <RouterLink to="/learn/bin-collection/bin-placement" class="btn btn-outline-primary"
          >How to place your bins</RouterLink
        >
      </section>
    </section>
  </main>
</template>

<script setup>
import PageHeader from '@/components/Header.vue'
</script>

<style scoped>
main {
  max-width: 900px;
  line-height: 1.5;
}

section {
  margin-top: 2rem;
}

h2 {
  font-size: 1.5rem;
}

li {
  margin-bottom: 1rem;
}
</style>
