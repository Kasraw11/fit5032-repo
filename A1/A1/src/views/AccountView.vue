<template>
  <main>
    <div class="mb-4">
      <PageHero
        :title="`Welcome, ${currentUser?.displayName || 'User'}`"
        subtitle="View and update your account details."
        :image="public_hero"
      />
    </div>

    <div class="row">
      <aside class="col-12 col-md-3 mb-4">
        <AccountSidebar />
      </aside>

      <section class="col-12 col-md-9">
        <div class="row">
          <div class="col-12 col-lg-4 mb-4">
            <div class="card h-100 p-3">
              <h2 class="h5">Upcoming Events</h2>
              <p>View events that are coming up.</p>
              <RouterLink class="btn btn-primary" to="/account/my-events"> View events </RouterLink>
            </div>
          </div>

          <div class="col-12 col-lg-4 mb-4">
            <div class="card h-100 p-3">
              <h2 class="h5">Event History</h2>
              <p>View events you attended in the past.</p>
              <RouterLink class="btn btn-primary" to="/account/my-events">
                View history
              </RouterLink>
            </div>
          </div>

          <div class="col-12 col-lg-4 mb-4">
            <div class="card h-100 p-3">
              <h2 class="h5">Saved Events</h2>
              <p>View events you saved for later.</p>
              <RouterLink class="btn btn-primary" to="/account/my-events">
                View saved events
              </RouterLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import AccountSidebar from '@/components/AccountSidebar.vue'
import { currentUser } from '@/authentication'
import PageHero from '@/components/PageHero.vue'
import public_hero from '@/assets/images/public_hero.png'
</script>
