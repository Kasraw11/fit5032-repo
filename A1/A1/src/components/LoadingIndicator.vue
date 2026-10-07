<template>
  <div class="d-flex align-items-center gap-2 text-muted" role="status" aria-live="polite">
    <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
    <span>{{ message }}</span>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: 'Loading...',
  },
})
</script>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  .spinner-border {
    animation: none;
  }
}
</style>
