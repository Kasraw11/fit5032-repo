<template>
  <main>
    <PageHero
      title="Map"
      subtitle="Find nearby recycling, donation, and repair services."
      :image="public_hero"
    />
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import PageHero from '@/components/PageHero.vue'
import public_hero from '@/assets/images/public_hero.png'
</script>
