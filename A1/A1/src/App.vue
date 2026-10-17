<script setup>
import Navbar from './components/Navbar.vue'
</script>

<template>
  <a href="#page-content" class="skip-to-content">Skip to main content</a>
  <Navbar />

  <RouterView v-slot="{ Component }">
    <Transition name="page" mode="out-in">
      <component :is="Component" id="page-content" tabindex="-1" />
    </Transition>
  </RouterView>
</template>
