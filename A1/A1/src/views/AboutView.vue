<template>
  <main>
    <PageHero
      :image="public_hero"
      title="About SmartLoop"
      subtitle="Learn more about our mission and services."
    />
    <div class="about-content">
      <PageHeader
        title="About Us"
        subtitle="Learn more about SmartLoop and our commitment to reducing waste."
        back-to="/"
      />

      <section class="card card-body p-3 shadow">
        <section class="card card-body card-gradient-2 p-3 shadow-sm">
          <h2>Our mission</h2>
          <p>
            SmartLoop helps the community reduce waste, reuse everyday items and recycle correctly.
            We provide practical information that makes sustainable choices easier for everyone.
          </p>
        </section>

        <section class="card card-body p-3 shadow-sm">
          <h2>What you can find on SmartLoop</h2>
          <ul>
            <li>Guides about bin collection and what belongs in each bin.</li>
            <li>Recycling information for common household items.</li>
            <li>Donation tips and simple ways to reduce and reuse.</li>
            <li>Recycling locations and community sustainability events.</li>
          </ul>
          <RouterLink to="/learn" class="btn btn-outline-primary align-self-start">
            Explore the learning guides
          </RouterLink>
        </section>

        <section class="card card-body p-3 shadow-sm">
          <h2>Check local information</h2>
          <p>
            Recycling rules and accepted donations can vary between councils and organisations.
            Check the current requirements before taking an item to a collection or donation point.
          </p>
          <p>Use the source links in our guides to find more information.</p>
        </section>

        <section class="card card-body card-gradient-6 p-3 shadow-sm">
          <h2>Get in touch</h2>
          <p>
            Have a question or feedback about SmartLoop? Use our contact page to send a message.
          </p>
          <RouterLink to="/contact" class="btn btn-primary align-self-start">Contact Us</RouterLink>
        </section>
      </section>
    </div>
  </main>
</template>

<script setup>
import PageHeader from '@/components/Header.vue'
import PageHero from '@/components/PageHero.vue'
import public_hero from '@/assets/images/public_hero.png'
</script>

<style scoped>
main {
  line-height: 1.5;
}

.about-content {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1rem 2rem;
}

.about-content section {
  margin-top: 2rem;
}

h2 {
  font-size: 1.5rem;
}

li {
  margin-bottom: 1rem;
}
</style>
