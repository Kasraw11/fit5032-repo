<template>
  <main>
    <PageHero
      title="Admin Dashboard"
      subtitle="Welcome to the admin dashboard. Here you can manage users, events, and other administrative tasks."
      :image="admin"
    />

    <section class="container py-5">
      <div class="row g-4 mt-2">
        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h3 class="h4">overview</h3>
              <p>system overview and key metrics</p>
              <RouterLink class="btn btn-primary" to="/admin/overview"> system overview</RouterLink>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h3 class="h4">Manage Events</h3>
              <p>event management</p>
              <RouterLink class="btn btn-primary" to="/admin/events">Manage Events</RouterLink>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h3 class="h4">Manage Users</h3>
              <p>user management</p>
              <RouterLink class="btn btn-primary" to="/admin/users">Manage Users</RouterLink>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h3 class="h4">Manage Locations</h3>
              <p>location management</p>
              <RouterLink class="btn btn-primary" to="/admin/locations"
                >Manage Locations</RouterLink
              >
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h3 class="h4">Manage Stats and charts</h3>
              <p>statistics and data visualization</p>
              <RouterLink class="btn btn-primary" to="/admin/stats">Stats and charts</RouterLink>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h3 class="h4">Manage Stats and charts</h3>
              <p>statistics and data visualization</p>
              <RouterLink class="btn btn-primary" to="/admin/stats">Stats and charts</RouterLink>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h3 class="h4">System Settings</h3>
              <p>manage system configuration</p>
              <RouterLink class="btn btn-primary" to="/admin/settings">System Settings</RouterLink>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h3 class="h4">Notify users</h3>
              <p>send notifications to users</p>
              <RouterLink class="btn btn-primary" to="/admin/notifications"
                >Notify users</RouterLink
              >
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h3 class="h4">inbox</h3>
              <p>view and manage incoming messages</p>
              <RouterLink class="btn btn-primary" to="/admin/inbox">View Inbox</RouterLink>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h3 class="h4">manage pages</h3>
              <p>Manage website informations</p>
              <RouterLink class="btn btn-primary" to="/admin/pageManagement"
                >Manage Pages</RouterLink
              >
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
const currentUser = JSON.parse(sessionStorage.getItem('currentUser'))

import PageHero from '@/components/PageHero.vue'
import admin from '@/assets/images/admin.png'
</script>
