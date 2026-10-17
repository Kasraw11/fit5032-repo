<template>
  <main>
    <PageHero
      title="Learn"
      subtitle="Learn about recycling, waste reduction and correct bin use."
      :image="public_hero"
    />

    <section class="container py-5">
      <div class="row g-4">
        <div class="col-12 col-md-6">
          <RouterLink
            to="/learn/bin-collection"
            class="card h-100 p-3 selectable-card card-gradient-1 text-body text-decoration-none"
          >
            <img
              src="/images/learn/bin-collection.jpg"
              alt="Colourful wheelie bins lined up for collection"
              class="card-img-top learn-card-image"
            />
            <div class="card-body p-4">
              <h2 class="h4">Bin Collection</h2>
              <p>Learn about bin collection and collection days.</p>
            </div>
          </RouterLink>
        </div>

        <div class="col-12 col-md-6">
          <RouterLink
            to="/learn/a-z-recycling"
            class="card h-100 p-3 selectable-card card-gradient-1 text-body text-decoration-none"
          >
            <img
              src="/images/learn/recycling-guide.jpg"
              alt="Labelled bins for compost, waste and recycling"
              class="card-img-top learn-card-image"
            />
            <div class="card-body card-item p-4">
              <h2 class="h4">A-Z Guide to Recycling</h2>
              <p>Find out how to recycle or dispose of common items correctly.</p>
            </div>
          </RouterLink>
        </div>

        <div class="col-12 col-md-6">
          <RouterLink
            to="/learn/donation"
            class="card h-100 p-3 selectable-card card-gradient-1 text-decoration-none"
          >
            <img
              src="/images/learn/donation.jpg"
              class="card-img-top learn-card-image"
              loading="lazy"
            />
            <div class="card-body p-4">
              <h2 class="h4">Donation Guide</h2>
              <p>Learn which items can be donated instead of thrown away.</p>
            </div>
          </RouterLink>
        </div>

        <div class="col-12 col-md-6">
          <RouterLink
            class="card h-100 p-3 selectable-card card-gradient-1 text-decoration-none"
            to="/learn/reduce-reuse"
          >
            <img
              src="/images/learn/reduce-reuse.jpg"
              class="card-img-top learn-card-image"
              loading="lazy"
            />
            <div class="card-body p-4">
              <h2 class="h4">Reduce &amp; Reuse</h2>
              <p>Learn simple ways to reduce waste and reuse items.</p>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import PageHero from '@/components/PageHero.vue'
import public_hero from '@/assets/images/public_hero.png'
</script>

<style scoped>
.learn-card-image {
  height: 200px;
  object-fit: cover;
}
</style>
