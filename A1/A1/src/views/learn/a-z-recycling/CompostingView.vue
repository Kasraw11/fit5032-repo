<template>
  <main class="container py-5">
    <PageHeader
      title="Composting at Home"
      subtitle="Learn how composting food scraps and garden waste can help reduce landfill."
      back-to="/learn/a-z-recycling"
    />
    <section class="card card-body p-3 shadow">
      <section class="card card-body p-3 shadow-sm">
        <h2>Why compost at home?</h2>
        <p>
          Composting food scraps and garden material keeps useful organic waste out of landfill and
          produces material that can improve your garden soil. In landfill, decomposing food can
          release methane, a greenhouse gas.
        </p>
      </section>

      <section class="card card-body p-3 shadow-sm">
        <h2>Choose a composting method</h2>
        <h3>Compost bins</h3>
        <p>
          A good option for households with a garden. Mix food scraps with garden material such as
          dry leaves and grass clippings. Use the finished compost in garden beds or as mulch.
        </p>
        <h3>Worm farms</h3>
        <p>
          Suitable for smaller outdoor spaces. Worms turn suitable scraps into castings for soil.
          Dilute the liquid from the system before using it on plants.
        </p>
        <h3>Bokashi systems</h3>
        <p class="mb-0">
          Useful for small households and apartments. The system ferments scraps, but they still
          need to be buried or added to a composting system to finish breaking down.
        </p>
      </section>

      <section class="card card-body p-3 shadow-sm">
        <h2>Check what your system accepts</h2>
        <p>
          Different systems accept different foods. Follow the instructions for your system and
          consult Sustainability Victoria's composting guidance.
        </p>
        <p>
          Suitable scraps your home system cannot process can go in your green-lid food and garden
          waste bin. If you lack space, ask whether a neighbour can accept your scraps.
        </p>
      </section>

      <section class="card card-body p-3 shadow-sm">
        <h2>More information</h2>
        <p>Contact Sustainable Monash: mail@monash.vic.gov.au or 03 9518 3555.</p>
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

h3 {
  font-size: 1.25rem;
}

li {
  margin-bottom: 1rem;
}
</style>
