<template>
  <main class="home-page">
    <section class="home-hero">
      <div class="container-fluid px-4 px-md-5">
        <div class="home-hero-content">
          <p class="hero-label">WELCOME TO SMARTLOOP</p>

          <div class="text-capitalize">
            <h1>Make smarter choices with your waste</h1>
          </div>

          <p class="hero-description">
            Learn how to recycle correctly, reduce waste <br />
            ,take part in sustainability events in your community.
          </p>

          <div class="d-flex flex-wrap gap-3 mt-4">
            <RouterLink class="btn btn-primary btn-lg" to="/learn"> Start learning </RouterLink>

            <RouterLink class="btn btn-light btn-lg" to="/events"> Explore events </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <section class="container py-4">
      <div class="text-center mb-4">
        <h2>Get Started</h2>
        <p class="text-muted">Choose an area to explore.</p>
      </div>

      <div class="row g-4 justify-content-center">
        <div class="col-12 col-md-3">
          <div class="card h-100 shadow-sm card-gradient-1">
            <div class="card-body p-4">
              <h3 class="h4">Recycle & Reuse</h3>
              <p>Find practical information for everyday household items.</p>
              <RouterLink class="btn btn-primary" to="/recycle-reuse">Explore items</RouterLink>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="card h-100 shadow-sm card-gradient-1">
            <div class="card-body p-4">
              <h3 class="h4">Events</h3>
              <p>Find practical workshops for everyday recycle instructions .</p>
              <RouterLink class="btn btn-primary" to="/events">Explore events</RouterLink>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="card h-100 shadow-sm card-gradient-1">
            <div class="card-body p-4">
              <h3 class="h4">Contact Us</h3>
              <p>Give us feedback about our services.</p>
              <RouterLink class="btn btn-primary" to="/contact">Contact Us</RouterLink>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="card h-100 shadow-sm card-gradient-1">
            <div class="card-body p-4">
              <h3 class="h4">Community Events</h3>
              <p>Discover local sustainability events and leave a rating.</p>
              <RouterLink class="btn btn-primary" to="/events">View events</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer class="home-footer">
      <div class="container py-4">
        <div class="row g-6">
          <div class="col-6 col-md-5">
            <h2 class="h4">SmartLoop</h2>

            <p class="footer-description">
              Helping our community make better choices about recycling, reuse and waste.
            </p>
          </div>

          <div class="col-4 md-4">
            <h3 class="h6">Support</h3>

            <div class="links d-flex flex-column gap-2">
              <RouterLink to="/contact">Contact Us</RouterLink>
              <RouterLink to="/about">About SmartLoop</RouterLink>
              <RouterLink to="/locations">Find Locations</RouterLink>
            </div>
          </div>
        </div>

        <hr />

        <p class="mb-0 text-center">&copy; 2026 SmartLoop. All rights reserved.</p>
      </div>
    </footer>
  </main>
</template>
