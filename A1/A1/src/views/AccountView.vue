<template>
  <main>
    <section class="page-hero">
      <div class="container">
        <h1>Account</h1>
        <p>Your SmartLoop account details.</p>
      </div>
    </section>

    <section class="container py-5">
      <div class="card mx-auto" style="max-width: 600px">
        <div class="card-body">
          <h2 class="h4 card-title mb-4">Profile</h2>
          <p><strong>Name:</strong> {{ currentUser.name }}</p>
          <p><strong>Email:</strong> {{ currentUser.email }}</p>
          <p class="mb-0"><strong>Role:</strong> {{ currentUser.role }}</p>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
const currentUser = JSON.parse(sessionStorage.getItem('currentUser'))
</script>
