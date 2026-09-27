<template>
  <main>
    <PageHero
      title="Recycling Rules"
      subtitle="Learn how to sort and recycle common items correctly."
      :image="learnHero"
    />

    <section class="container py-5">
      <div class="row g-4">
        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h2 class="h4">Paper and Cardboard</h2>
              <p class="mb-0">
                Keep paper and cardboard clean and dry. Flatten boxes and remove plastic wrapping.
              </p>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h2 class="h4">Glass Bottles and Jars</h2>
              <p class="mb-0">
                Empty and rinse bottles and jars. Do not place drinking glasses or broken glass in
                the recycling bin.
              </p>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h2 class="h4">Metal Cans</h2>
              <p class="mb-0">
                Rinse aluminium and steel cans before recycling. Keep hazardous aerosol cans out of
                the recycling bin.
              </p>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body p-4">
              <h2 class="h4">Plastic Containers</h2>
              <p class="mb-0">
                Empty and rinse accepted containers. Check your local council rules because accepted
                plastic types can vary.
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
