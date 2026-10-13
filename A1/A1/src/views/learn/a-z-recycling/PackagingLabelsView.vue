<template>
  <main class="container py-5">
    <PageHeader
      title="Understanding Packaging Labels"
      subtitle="Learn what common recycling symbols and packaging labels mean."
      back-to="/learn/a-z-recycling"
    />
    <section class="card card-body p-3 shadow">
      <section class="card card-body p-3 shadow-sm">
        <h2>Plastic identification codes</h2>
        <p>
          A numbered triangle identifies the plastic type, not whether Monash accepts it in the
          yellow-lid bin.
        </p>
      </section>

      <section class="card card-body p-3 shadow-sm">
        <h2>The recycling triangle</h2>
        <p>
          The recycling triangle, or Mobius loop, can indicate recyclability or recycled content. It
          does not identify the correct local collection service.
        </p>
      </section>

      <section class="card card-body p-3 shadow-sm">
        <h2>Australasian Recycling Label</h2>
        <p>
          The Australasian Recycling Label gives separate instructions for each component, such as a
          box, wrapper or lid. A solid recycling symbol indicates recycling; conditional
          instructions must be followed, and a bin symbol indicates landfill.
        </p>
      </section>

      <section class="card card-body p-3 shadow-sm">
        <h2>Old REDcycle labels</h2>
        <p>
          An old REDcycle logo does not mean supermarket collection is still available. Check
          current Monash soft-plastic drop-off options; soft plastics cannot go in the yellow bin.
        </p>
      </section>

      <section class="card card-body p-3 shadow-sm">
        <h2>Compostable packaging</h2>
        <p>
          Commercially compostable and home-compostable labels describe different processing
          conditions. A home-compostable item needs a home system; other compostable packaging is
          not accepted in the green bin.
        </p>
      </section>

      <section class="card card-body p-3 shadow-sm">
        <h2>Approved green-bin liners</h2>
        <p>
          For green-bin liners, use only approved lime-green compostable bags with the certified
          seedling logo. Clear compostable bags are not accepted.
        </p>
      </section>

      <section class="card card-body p-3 shadow-sm">
        <h2>Overseas packaging labels</h2>
        <p>
          Overseas labels such as OPRL, How2Recycle, OK Compost and BPI do not override Monash
          rules. Ask resourcerecovery@monash.vic.gov.au when unsure.
        </p>
      </section>

      <p class="small text-body-secondary mb-0">
        Information adapted from City of Monash waste and sustainability resources.
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

h3 {
  font-size: 1.25rem;
}

li {
  margin-bottom: 1rem;
}
</style>
