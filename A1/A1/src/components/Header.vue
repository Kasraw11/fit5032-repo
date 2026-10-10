<template>
  <header class="header card card-gradient-1 rounded-3 p-3 shadow">
    <RouterLink v-if="backTo" :to="backTo" class="btn btn-outline-primary align-self-start mb-3">
      Back
    </RouterLink>
    <h1>{{ title }}</h1>
    <p v-if="subtitle">{{ subtitle }}</p>
  </header>
</template>

<script setup>
defineOptions({ name: 'PageHeader' })

defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  backTo: {
    type: String,
    default: '',
  },
})
</script>

<style scoped>
.header {
  margin-top: 2rem;
}

h1 {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
}

p {
  margin-bottom: 0;
}
</style>
