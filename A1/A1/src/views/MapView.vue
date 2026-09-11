<template>
  <main>
    <PageHero
      title="Map"
      subtitle="Find nearby recycling, donation, and repair services."
      :image="map_hero"
    />
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import PageHero from '@/components/PageHero.vue'
import map_hero from '@/assets/images/map_hero.png'
</script>
