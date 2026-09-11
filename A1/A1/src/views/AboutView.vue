<template>
  <main class="about-page">
    <PageHero
      title="About Us"
      subtitle="Learn more about our mission and commitment to sustainability."
      :image="about_hero"
    />

    <section class="container py-5">
      <div class="card shadow-sm mx-auto" style="max-width: 800px">
        <div class="card-body p-4">
          <h2 class="h4 card-title">Our Mission</h2>
          <p class="card-text mb-0">
            SmartLoop helps the community reduce waste, reuse everyday items, and recycle correctly.
            We provide practical information that makes sustainable choices easier for everyone.
          </p>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import PageHero from '@/components/PageHero.vue'
import about_hero from '@/assets/images/about_hero.png'
</script>
