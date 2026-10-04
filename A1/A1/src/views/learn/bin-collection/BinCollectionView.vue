<template>
  <main>
    <PageHero
      title="Bin Collection"
      subtitle="Choose a guide to learn about household bin collection and correct bin use."
      :image="public_hero"
    />

    <section class="container py-5">
      <RouterLink class="btn btn-outline-primary mb-4" to="/learn">Back to Learn</RouterLink>
      <div class="row g-4">
        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h2 class="h4">When We Collect Your Bins</h2>
              <p>Find information about bin collection days and schedules.</p>
              <RouterLink class="btn btn-primary" to="/learn/bin-collection/collection-days">
                View Collection Days
              </RouterLink>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h2 class="h4">What Can Go in Your Bins</h2>
              <p>Learn what items belong in each household bin.</p>
              <RouterLink class="btn btn-primary" to="/learn/bin-collection/bin-contents">
                View Bin Guide
              </RouterLink>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h2 class="h4">Landfill Bin</h2>
              <p>Learn what items should go in your landfill bin.</p>
              <RouterLink class="btn btn-primary" to="/learn/bin-collection/landfill-bin">
                View Landfill Info
              </RouterLink>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h2 class="h4">Recycling Bin</h2>
              <p>Learn what can and cannot go in your recycling bin.</p>
              <RouterLink class="btn btn-primary" to="/learn/bin-collection/recycling-bin">
                View Recycling Info
              </RouterLink>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h2 class="h4">Food &amp; Garden Waste Bin</h2>
              <p>Learn what belongs in your food and garden waste bin.</p>
              <RouterLink class="btn btn-primary" to="/learn/bin-collection/food-garden-waste-bin">
                View FOGO Info
              </RouterLink>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h2 class="h4">Bin Placement</h2>
              <p>Learn how to place your bins correctly for collection.</p>
              <RouterLink class="btn btn-primary" to="/learn/bin-collection/bin-placement">
                View Bin Placement
              </RouterLink>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h2 class="h4">Looking After Your Bins</h2>
              <p>Learn how to correctly use and care for your bins.</p>
              <RouterLink class="btn btn-primary" to="/learn/bin-collection/bin-care">
                View Bin Care
              </RouterLink>
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
