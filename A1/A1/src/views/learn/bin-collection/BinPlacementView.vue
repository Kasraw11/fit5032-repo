<template>
  <main class="container py-5">
    <PageHeader
      title="How to Place Your Bin for Collection"
      subtitle="Follow these guidelines to ensure your bins are collected efficiently."
      back-to="/learn/bin-collection"
    />
    <section class="card card-body p-3 shadow">
      <section class="card card-body p-3 shadow-sm">
        <h2>Placing your bins</h2>
        <p>Follow these tips to ensure your bins are collected efficiently:</p>
        <ul>
          <li>Put your bins out before your scheduled collection.</li>
          <li>Place your bins on the nature strip.</li>
          <li>Leave approximately 50 cm between each bin.</li>
          <li>Leave space between bins and trees, poles and parked vehicles.</li>
          <li>Make sure the bin lid can close properly.</li>
          <li>Do not overfill your bins.</li>
          <li>Avoid parking vehicles directly in front of bins.</li>
          <li>Return your bins to your property after collection.</li>
        </ul>
      </section>

      <section class="card card-body p-3 shadow-sm">
        <h2>Help the truck reach your bins</h2>
        <p>The truck uses a lifting arm, so bins need clear access.</p>
        <ul>
          <li>
            Put bins out the night before collection and bring them in within 24 hours of emptying.
          </li>
          <li>Leave at least 1 metre between bins and trees, poles or parked cars.</li>
          <li>In a court, use the straight part of the street for safer access.</li>
          <li>Use only the bins allocated to your property.</li>
          <li>Keep lids shut and pick up any spilled litter.</li>
          <li>Keep bins light enough to move; trucks cannot lift bins that are too heavy.</li>
        </ul>
      </section>

      <section class="card card-body p-3 shadow-sm">
        <h2>If a parked car blocks collection</h2>
        <p>
          Contact Council within 24 hours if a car prevented your bin from being emptied. Call to
          ask about a return collection.
        </p>
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
