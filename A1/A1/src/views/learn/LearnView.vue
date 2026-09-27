<template>
  <main>
    <PageHero
      title="Learn"
      subtitle="Explore recycling rules and donation information."
      :image="public_hero"
    />

    <section class="container py-5">
      <div class="row g-4">
        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h2 class="h4">Recycling Rules</h2>
              <p>View and learn about recycling rules.</p>
              <RouterLink class="btn btn-primary" to="/learn/rules">View Rules</RouterLink>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h2 class="h4">Donation</h2>
              <p>Learn which items can be donated.</p>
              <RouterLink class="btn btn-primary" to="/learn/donation">
                View Donation Info
              </RouterLink>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h2 class="h4">Composting</h2>
              <p>Learn about composting and how to get started.</p>
              <RouterLink class="btn btn-primary" to="/learn/composting">
                View Composting Info
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
