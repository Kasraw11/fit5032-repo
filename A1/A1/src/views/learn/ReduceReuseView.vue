<template>
  <main class="container py-5">
    <PageHeader
      title="Reduce and Reuse"
      subtitle="Discover practical ways to reduce rubbish and reuse everyday items."
      back-to="/learn"
    />

    <section class="card card-body p-3 shadow">
      <section class="card card-body p-3 shadow-sm">
        <h2>Buy only what you need</h2>
        <p>Reducing waste starts before you buy something.</p>
        <ul>
          <li>Check what you already own before shopping.</li>
          <li>Borrow or hire items you will only use occasionally.</li>
          <li>Choose products that can be maintained and repaired.</li>
        </ul>
      </section>

      <section class="card card-body p-3 shadow-sm">
        <h2>Choose reusable items</h2>
        <ul>
          <li>Take reusable shopping bags when you go shopping.</li>
          <li>Carry a reusable drink bottle or coffee cup.</li>
          <li>Use reusable lunch containers instead of disposable packaging.</li>
        </ul>
        <p>Keep these items somewhere convenient so you remember to take them with you.</p>
      </section>

      <section class="card card-body p-3 shadow-sm">
        <h2>Reduce food waste</h2>
        <ul>
          <li>Check your fridge, freezer and cupboards before shopping.</li>
          <li>Plan meals and write a shopping list.</li>
          <li>Buy quantities you can use and plan meals around what you already have.</li>
        </ul>
      </section>

      <section class="card card-body p-3 shadow-sm">
        <h2>Repair before replacing</h2>
        <p>Check whether a broken item can be repaired before buying a replacement.</p>
        <p>
          Ask a repair business or repair cafe what they can help with. Use a qualified repairer for
          electrical work.
        </p>
      </section>

      <section class="card card-body p-3 shadow-sm">
        <h2>Reuse, share or donate</h2>
        <ul>
          <li>Use suitable containers to organise household items.</li>
          <li>Turn worn clothing into cleaning cloths.</li>
          <li>Sell, swap or donate useful items you no longer need.</li>
          <li>Consider buying second-hand before buying new.</li>
        </ul>
        <RouterLink to="/learn/donation" class="btn btn-outline-primary align-self-start">
          Donation guide
        </RouterLink>
      </section>

      <section class="card card-body p-3 shadow-sm">
        <h2>When reuse is not possible</h2>
        <p>Check the correct recycling or disposal option for each item.</p>
        <p>
          Food scraps your household cannot use may be suitable for composting or your food and
          garden waste bin.
        </p>
        <RouterLink to="/learn/a-z-recycling" class="btn btn-outline-primary align-self-start">
          A-Z recycling guide
        </RouterLink>
      </section>
    </section>
  </main>
</template>

<script setup>
import PageHeader from '@/components/Header.vue'
</script>

<style scoped>
main {
  max-width: 900px;
  line-height: 1.5;
}

section {
  margin-top: 2rem;
}

h2 {
  font-size: 1.5rem;
}

li {
  margin-bottom: 1rem;
}
</style>
