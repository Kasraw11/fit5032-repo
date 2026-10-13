<template>
  <main>
    <section class="container py-5">
      <PageHeader
        title="A-Z Guide to Recycling"
        subtitle="Learn how to recycle and dispose of common household items correctly."
        back-to="/learn"
      />

      <div class="row g-4 mt-4">
        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h2 class="h4">How do I recycle different items?</h2>
              <p>
                Search common items and find out whether they can be reused, repaired, recycled or
                disposed of correctly.
              </p>
              <RouterLink to="/recycle-reuse" class="btn btn-primary">Explore Items</RouterLink>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h2 class="h4">Batteries &amp; Electronic Items</h2>
              <p>
                Learn how batteries, mobile phones and other electronic items should be recycled
                safely.
              </p>
              <RouterLink to="/learn/a-z-recycling/batteries-electronics" class="btn btn-primary">
                Learn More
              </RouterLink>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h2 class="h4">Understanding Packaging Labels</h2>
              <p>Learn what common recycling symbols and packaging labels mean.</p>
              <RouterLink to="/learn/a-z-recycling/packaging-labels" class="btn btn-primary">
                Learn More
              </RouterLink>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h2 class="h4">What Goes in Your Recycling Bin</h2>
              <p>Learn what can and cannot be placed in your yellow-lid recycling bin.</p>
              <RouterLink to="/learn/bin-collection/recycling-bin" class="btn btn-primary">
                Learn More
              </RouterLink>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h2 class="h4">Composting at Home</h2>
              <p>Learn how composting food scraps and garden waste can help reduce landfill.</p>
              <RouterLink to="/learn/composting" class="btn btn-primary">Learn More</RouterLink>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h2 class="h4">Recycling &amp; Waste Centres</h2>
              <p>Find nearby locations for items that require special recycling or disposal.</p>
              <RouterLink to="/locations" class="btn btn-primary">View Map</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import PageHeader from '@/components/Header.vue'
</script>
