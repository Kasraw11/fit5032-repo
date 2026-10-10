<template>
  <main class="container py-5">
    <PageHeader
      title="Looking After Your Bins"
      subtitle="Proper care of your bins helps reduce odours, contamination and damage."
      back-to="/learn/bin-collection"
    />
    <section class="card card-body p-3 shadow">
      <section class="card card-body p-3 shadow-sm">
        <h1>taking care of your bins</h1>
        <ul>
          <li>Keep bin lids closed when they are not being used.</li>
          <li>Do not overfill your bins.</li>
          <li>Clean your bins when necessary.</li>
          <li>Keep recycling loose rather than placing it in plastic bags.</li>
          <li>Flatten cardboard where possible to save space.</li>
          <li>Do not place items beside the bin for normal collection.</li>
          <li>Store your bins safely on your property between collection days.</li>
          <li>Report damaged or missing bins when necessary.</li>
        </ul>
      </section>

      <section class="card card-body p-3 shadow-sm">
        <h2>Washing your bins</h2>
        <p>
          Rinse with a hose, drain and let the bin dry completely. For a deeper clean, use about 15
          cm of water, a little dish detergent and a long-handled broom. Scrub the walls, base and
          lid, then drain and dry. Warm weather helps drying.
        </p>
      </section>

      <section class="card card-body p-3 shadow-sm">
        <h2>Reduce landfill-bin smells</h2>
        <p>
          Bag or wrap rubbish, squeeze air out of waste bags and tie them shut. Double-bag nappies
          or pet waste if needed. Put suitable food scraps in the green bin, keep the red bin shaded
          and use a little baking soda to help absorb odours.
        </p>
      </section>

      <section class="card card-body p-3 shadow-sm">
        <h2>Care for your food caddy and green bin</h2>
        <ul>
          <li>Cool hot food first; keep the caddy closed and shaded.</li>
          <li>Empty the caddy every two or three days and rinse it after use.</li>
          <li>
            Freeze smelly scraps in a sealed container and empty them into the bin before
            collection.
          </li>
          <li>
            Line the caddy with paper towel, newspaper or approved lime-green compostable liners.
          </li>
          <li>Keep the green bin shaded, put it out weekly and wash it occasionally.</li>
          <li>Layer scraps with garden clippings and clean spills to discourage insects.</li>
        </ul>
      </section>

      <section class="card card-body p-3 shadow-sm">
        <h2>Make more space</h2>
        <ul>
          <li>
            Sort recyclable and organic material out of landfill rubbish and remove air from bags.
          </li>
          <li>
            Keep recycling loose; flatten boxes and cut large cardboard pieces to at least A4 size.
          </li>
          <li>Keep garden waste loose and trim branches to under 40 cm.</li>
          <li>Take excess cardboard to the Waste Centre; garden-waste drop-offs have charges.</li>
        </ul>
      </section>

      <section class="card card-body p-3 shadow-sm">
        <h2>Damaged or missing bins</h2>
        <p>Contact us about repair or replacement.</p>
        <RouterLink to="/contact" class="btn btn-primary align-self-start">Contact Us</RouterLink>
      </section>
    </section>
  </main>
</template>

<script setup>
import PageHeader from '@/components/Header.vue'
import { RouterLink } from 'vue-router'
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
