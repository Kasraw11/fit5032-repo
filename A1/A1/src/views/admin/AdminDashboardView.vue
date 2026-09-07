<template>
  <main>
    <section class="page-hero">
      <div class="container">
        <h1>Dashboard</h1>
        <p>This page will provide an overview of admin activity.</p>
      </div>
    </section>

    <section class="container py-5">
      <h2 class="h4">Admin tools</h2>
      <div class="d-flex flex-wrap gap-3">
        <RouterLink class="btn btn-primary" to="/admin/users">Manage Users</RouterLink>
        <RouterLink class="btn btn-primary" to="/admin/events">Manage Events</RouterLink>
        <RouterLink class="btn btn-primary" to="/admin/locations">Manage Locations</RouterLink>
      </div>
    </section>
  </main>
</template>
