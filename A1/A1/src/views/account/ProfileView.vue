<template>
  <main class="container-fluid p-3">
    <div class="row">
      <aside class="col-12 col-md-3 mb-3">
        <AccountSidebar />
      </aside>

      <section class="col-12 col-md-9">
        <h1 class="h2 mb-3">Profile</h1>

        <div class="card p-3">
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
