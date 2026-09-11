<template>
  <section class="page-hero">
    <img class="page-hero-image" :src="image" alt="" />
    <div class="page-hero-overlay"></div>

    <div class="container page-hero-content">
      <h1>{{ title }}</h1>
      <p>{{ subtitle }}</p>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    required: true,
  },
})
</script>
