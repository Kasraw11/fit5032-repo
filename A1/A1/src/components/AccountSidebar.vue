<template>
  <div class="card p-3">
    <h2 class="h5 mb-3">Account</h2>

    <nav class="list-group" aria-label="Account navigation">
      <RouterLink
        class="list-group-item list-group-item-action"
        active-class=""
        exact-active-class="active"
        to="/account"
      >
        Dashboard
      </RouterLink>
      <RouterLink
        class="list-group-item list-group-item-action"
        active-class=""
        exact-active-class="active"
        to="/account/profile"
      >
        Profile
      </RouterLink>
      <RouterLink
        class="list-group-item list-group-item-action"
        active-class=""
        exact-active-class="active"
        to="/account/my-events"
      >
        My Events
      </RouterLink>
      <RouterLink
        class="list-group-item list-group-item-action"
        active-class=""
        exact-active-class="active"
        to="/account/support"
      >
        Support
      </RouterLink>
    </nav>
  </div>
</template>
