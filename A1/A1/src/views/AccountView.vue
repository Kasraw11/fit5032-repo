<template>
  <main class="container-fluid p-3">
    <div class="row">
      <aside class="col-12 col-md-3 mb-3">
        <AccountSidebar />
      </aside>

      <section class="col-12 col-md-9">
        <h1 class="h2 mb-3">Welcome, {{ currentUser.name }}</h1>

        <div class="row">
          <div class="col-12 col-lg-4 mb-3">
            <div class="card h-100 p-3">
              <h2 class="h5">Upcoming Events</h2>
              <p>View events that are coming up.</p>
              <RouterLink class="btn btn-primary" to="/account/my-events"> View events </RouterLink>
            </div>
          </div>

          <div class="col-12 col-lg-4 mb-3">
            <div class="card h-100 p-3">
              <h2 class="h5">Event History</h2>
              <p>View events you attended in the past.</p>
              <RouterLink class="btn btn-primary" to="/account/my-events">
                View history
              </RouterLink>
            </div>
          </div>

          <div class="col-12 col-lg-4 mb-3">
            <div class="card h-100 p-3">
              <h2 class="h5">Saved Events</h2>
              <p>View events you saved for later.</p>
              <RouterLink class="btn btn-primary" to="/account/my-events">
                View saved events
              </RouterLink>
            </div>
          </div>
        </div>

        <div class="card p-3 mb-3">
          <h2 class="h4 mb-3">Account Information</h2>
          <p><strong>Name:</strong> {{ currentUser.name }}</p>
          <p><strong>Email:</strong> {{ currentUser.email }}</p>
          <p class="mb-0"><strong>Role:</strong> {{ currentUser.role }}</p>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import AccountSidebar from '@/components/AccountSidebar.vue'

const currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || {
  name: 'User',
  email: '',
  role: '',
}
</script>
