<template>
  <main>
    <section class="page-hero">
      <div class="container">
        <h1>SmartLoop</h1>
        <p>Helping the community reduce waste, reuse items and recycle correctly.</p>
      </div>
    </section>

    <section class="container py-5">
      <div class="text-center mb-4">
        <h2>Get Started</h2>
        <p class="text-muted">Choose an area to explore.</p>
      </div>

      <div class="row g-4 justify-content-center">
        <div class="col-12 col-md-5">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h3 class="h4">Recycle & Reuse</h3>
              <p>Find practical information for everyday household items.</p>
              <RouterLink class="btn btn-primary" to="/recycle-reuse">Explore items</RouterLink>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-5">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h3 class="h4">Community Events</h3>
              <p>Discover local sustainability events and leave a rating.</p>
              <RouterLink class="btn btn-primary" to="/events">View events</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
