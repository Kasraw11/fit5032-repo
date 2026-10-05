<template>
  <main>
    <PageHero
      title="Admin Dashboard"
      subtitle="Welcome to the admin dashboard. Here you can manage users, events, and other administrative tasks."
      :image="public_hero"
    />
    <section class="container py-5">
      <div class="row g-4 mt-2">
        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h3 class="h4">Overview</h3>
              <p>View system activity and key metrics.</p>
              <RouterLink class="btn btn-primary" to="/admin/overview">Overview</RouterLink>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h3 class="h4">Manage Users</h3>
              <p>Manage SmartLoop users.</p>
              <RouterLink class="btn btn-primary" to="/admin/users">Manage Users</RouterLink>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h3 class="h4">Manage Events</h3>
              <p>Manage sustainability events.</p>
              <RouterLink class="btn btn-primary" to="/admin/events">Manage Events</RouterLink>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h3 class="h4">Manage Locations</h3>
              <p>Manage recycling, donation and repair locations.</p>
              <RouterLink class="btn btn-primary" to="/admin/locations"
                >Manage Locations</RouterLink
              >
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h3 class="h4">Manage Recycle &amp; Reuse</h3>
              <p>Manage recycling information for household items.</p>
              <RouterLink class="btn btn-primary" to="/admin/recycle-reuse"
                >Manage Recycle &amp; Reuse</RouterLink
              >
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h3 class="h4">Stats &amp; Charts</h3>
              <p>View statistics and data visualisation.</p>
              <RouterLink class="btn btn-primary" to="/admin/stats">Stats &amp; Charts</RouterLink>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h3 class="h4">Reports &amp; Export</h3>
              <p>View, search and export SmartLoop data.</p>
              <button type="button" class="btn btn-primary" disabled>Reports &amp; Export</button>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h3 class="h4">Notify Users</h3>
              <p>Send notifications to SmartLoop users.</p>
              <RouterLink class="btn btn-primary" to="/admin/notifications"
                >Notify Users</RouterLink
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
