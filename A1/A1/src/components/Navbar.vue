<template>
  <nav class="navbar navbar-expand-lg smartloop-navbar">
    <div class="container">
      <RouterLink class="navbar-brand" to="/"> SmartLoop ♻️ </RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNavbar"
        aria-controls="mainNavbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div id="mainNavbar" class="collapse navbar-collapse">
        <ul class="navbar-nav mx-lg-auto">
          <li class="nav-item mx-2">
            <RouterLink class="nav-link" to="/">Home</RouterLink>
          </li>

          <li class="nav-item mx-2">
            <RouterLink class="nav-link" to="/recycle-reuse"> Recycle & Reuse </RouterLink>
          </li>

          <li class="nav-item mx-2">
            <RouterLink class="nav-link" to="/locations"> Map </RouterLink>
          </li>

          <li class="nav-item mx-2">
            <RouterLink class="nav-link" to="/events"> Events </RouterLink>
          </li>

          <li class="nav-item mx-2">
            <RouterLink class="nav-link" to="/learn"> Learn </RouterLink>
          </li>

          <li class="nav-item mx-2">
            <RouterLink class="nav-link" to="/contact"> Contact </RouterLink>
          </li>

          <li class="nav-item mx-2">
            <RouterLink class="nav-link" to="/about"> About </RouterLink>
          </li>
        </ul>

        <RouterLink class="btn btn-outline-primary btn-sm" to="/account"> Account </RouterLink>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.smartloop-navbar {
  background-color: var(--navbar-background-color);
  border-bottom: 5px solid var(--navbar-border-color);

  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.navbar-brand {
  font-size: 24px;
  font-weight: 600;
}

.nav-link {
  font-size: 17px;
  font-weight: 500;
  margin: 0 6px;
}

.nav-link.router-link-active {
  font-weight: 600;
  color: #0866f3;
}
</style>
