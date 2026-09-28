<script setup>
import Navbar from './components/Navbar.vue'
</script>

<template>
  <Navbar />

  <RouterView v-slot="{ Component }">
    <Transition name="page" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>
