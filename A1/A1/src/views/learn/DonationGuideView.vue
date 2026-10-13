<template>
  <main class="container py-5">
    <PageHeader
      title="Donation Guide"
      subtitle="Give useful items a new home instead of throwing them away."
      back-to="/learn"
    />

    <section class="card card-body p-3 shadow">
      <section class="card card-body p-3 shadow-sm">
        <h2>Clothing and shoes</h2>
        <p>Donate clean clothes, shoes and accessories that are in good wearable condition.</p>
        <ul>
          <li>Wash and dry clothes before packing them.</li>
          <li>Keep pairs of shoes together.</li>
          <li>Check that items have no major stains, tears or damage.</li>
        </ul>
      </section>

      <section class="card card-body p-3 shadow-sm">
        <h2>Books, games and toys</h2>
        <p>Donate items that are clean, safe and ready for someone else to use.</p>
        <ul>
          <li>Check that books have their pages and covers.</li>
          <li>Keep game pieces and toy parts together.</li>
          <li>Ask the organisation which items it currently accepts.</li>
        </ul>
      </section>

      <section class="card card-body p-3 shadow-sm">
        <h2>Furniture and household items</h2>
        <p>Furniture should be sturdy, usable and free from major damage or stains.</p>
        <p>
          Check size limits and delivery arrangements before taking large items. Not every shop
          accepts furniture or offers a collection service.
        </p>
      </section>

      <section class="card card-body p-3 shadow-sm">
        <h2>Working electronics</h2>
        <p>Ask whether the organisation accepts your device before donating it.</p>
        <ul>
          <li>Donate working devices and include their accessories where possible.</li>
          <li>Back up important files and remove personal data before handing over a device.</li>
          <li>Use an appropriate recycling service for broken or unsafe electronics.</li>
        </ul>
        <RouterLink
          to="/learn/a-z-recycling/batteries-electronics"
          class="btn btn-outline-primary align-self-start"
        >
          Batteries and electronics guide
        </RouterLink>
      </section>

      <section class="card card-body p-3 shadow-sm">
        <h2>Before you drop off a donation</h2>
        <ul>
          <li>Check accepted items and opening hours with the organisation.</li>
          <li>Pack small items neatly in bags or boxes.</li>
          <li>Hand donations to staff or use the approved drop-off point.</li>
          <li>Do not leave donations outside a closed shop or beside a full donation bin.</li>
        </ul>
      </section>

      <section class="card card-body p-3 shadow-sm">
        <h2>Find a place to donate</h2>
        <p>
          Contact a local charity shop or community organisation. Acceptance depends on the item,
          its condition and the space available.
        </p>
        <a
          href="https://www.vinnies.org.au/get-involved/donate-goods"
          class="btn btn-outline-primary align-self-start"
        >
          Check Vinnies donation information
        </a>
      </section>

      <section class="card card-body p-3 shadow-sm">
        <h2>If an item cannot be donated</h2>
        <p>
          Check whether it can be repaired or recycled. Damaged or unusable items should not be
          passed on as donations.
        </p>
        <RouterLink to="/recycle-reuse" class="btn btn-outline-primary align-self-start">
          Find recycling and reuse options
        </RouterLink>
      </section>

      <p class="small mt-4">
        More information:
        <a
          href="https://www.environment.vic.gov.au/household-waste-recycling/reduce-waste/reuse-repair"
        >
          Victorian Government reuse and repair guidance </a
        >.
      </p>
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
