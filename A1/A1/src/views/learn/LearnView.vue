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
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h2 class="h4">Bin Collection</h2>
              <p>Learn about bin collection and collection days.</p>
              <RouterLink class="btn btn-primary" to="/learn/bin-collection"
                >View Collection</RouterLink
              >
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h2 class="h4">A-Z Guide to Recycling</h2>
              <p>Find out how to recycle or dispose of common items correctly.</p>
              <RouterLink class="btn btn-primary" to="/learn/a-z-recycling">
                View A-Z Guide
              </RouterLink>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h2 class="h4">Donation Guide</h2>
              <p>Learn which items can be donated instead of thrown away.</p>
              <RouterLink class="btn btn-primary" to="/learn/donation">
                View Donation Guide
              </RouterLink>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h2 class="h4">Reduce &amp; Reuse</h2>
              <p>Learn simple ways to reduce waste and reuse items.</p>
              <RouterLink class="btn btn-primary" to="/learn/reduce-reuse"
                >View Reduce &amp; Reuse</RouterLink
              >
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import PageHero from '@/components/PageHero.vue'
import public_hero from '@/assets/images/public_hero.png'
</script>
