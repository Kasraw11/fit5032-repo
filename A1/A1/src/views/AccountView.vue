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
      <aside class="col-12 col-md-2 mb-2">
        <AccountSidebar />
      </aside>

      <section class="col-12 col-md-9">
        <div class="row">
          <div class="col-12 col-md-6 mb-4">
            <RouterLink
              to="/account/my-events"
              class="card h-100 p-3 selectable-card card-gradient-8 text-body text-decoration-none"
            >
              <div class="card-body text-center p-4">
                <h2 class="h5">Manage Events</h2>
                <p>View and manage your events</p>
              </div>
            </RouterLink>
          </div>
          <div class="col-12 col-md-6 mb-4">
            <RouterLink
              to="/account/reports"
              class="card h-100 p-3 selectable-card card-gradient-8 text-body text-decoration-none"
            >
              <div class="card-body text-center p-4">
                <h2 class="h5">Reports &amp; Export</h2>
                <p>Search recycling items and download CSV or TXT reports.</p>
              </div>
            </RouterLink>
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
