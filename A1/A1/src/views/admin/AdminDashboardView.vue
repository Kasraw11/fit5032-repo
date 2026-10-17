<template>
  <main>
    <PageHero
      title="Admin Dashboard"
      subtitle="Welcome to the admin dashboard. Here you can manage events, locations, and recycling information."
      :image="public_hero"
    />
    <section class="container py-5">
      <div class="row g-4">
        <div class="col-12 col-md-6">
          <RouterLink
            to="/admin/locations"
            class="card h-100 p-3 selectable-card card-gradient-5 text-body text-decoration-none"
          >
            <div class="card-body text-center p-4">
              <h3 class="h4">Manage Locations</h3>
              <p>
                <br />Manage locations and events, including their descriptions and event dates.
              </p>
            </div>
          </RouterLink>
        </div>

        <div class="col-12 col-md-6">
          <RouterLink
            to="/admin/recycle-reuse"
            class="card h-100 p-3 selectable-card card-gradient-5 text-body text-decoration-none"
          >
            <div class="card-body text-center p-4">
              <h3 class="h4">Manage Recycle &amp; Reuse</h3>
              <p><br />Manage recycling information for household items.</p>
            </div>
          </RouterLink>
        </div>

        <div class="col-12 col-md-6">
          <RouterLink
            to="/admin/stats"
            class="card h-100 p-3 selectable-card card-gradient-5 text-body text-decoration-none"
          >
            <div class="card-body text-center p-4">
              <h3 class="h4">Stats &amp; Charts</h3>
              <p><br />View statistics and data visualisation.</p>
            </div>
          </RouterLink>
        </div>

        <div class="col-12 col-md-6">
          <RouterLink
            to="/admin/reports"
            class="card h-100 p-3 selectable-card card-gradient-5 text-body text-decoration-none"
          >
            <div class="card-body text-center p-4">
              <h3 class="h4">Reports &amp; Export</h3>
              <p><br />View, search and export SmartLoop data.</p>
            </div>
          </RouterLink>
        </div>

        <div class="col-12 col-md-6">
          <RouterLink
            to="/admin/notifications"
            class="card h-100 p-3 selectable-card card-gradient-5 text-body text-decoration-none"
          >
            <div class="card-body text-center p-4">
              <h3 class="h4">Notify Users</h3>
              <p><br />Send notifications to SmartLoop users.</p>
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
