<template>
  <main>
    <PageHero
      title="Donation Information"
      subtitle="Learn which reusable items can be donated."
      :image="learnHero"
    />

    <section class="container py-5">
      <div class="row g-4">
        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h2 class="h4">Clothing</h2>
              <p class="mb-0">
                Donate clean clothes, shoes, and accessories that are in good wearable condition.
              </p>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h2 class="h4">Books and Toys</h2>
              <p class="mb-0">
                Donate complete books, games, and toys that are clean, safe, and ready to use.
              </p>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h2 class="h4">Furniture</h2>
              <p class="mb-0">
                Donate sturdy furniture without major damage, stains, or missing parts. Check size
                limits before delivery.
              </p>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h2 class="h4">Electronics</h2>
              <p class="mb-0">
                Donate working devices with personal data removed. Confirm that the organisation
                accepts electronic items first.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import PageHero from '@/components/PageHero.vue'
import learnHero from '@/assets/images/smartloop_hero.png'
</script>
