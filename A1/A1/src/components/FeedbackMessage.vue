<template>
  <Teleport to="body">
    <div
      v-if="visible && message"
      class="feedback-position position-fixed top-50 start-50 translate-middle"
    >
      <div
        class="card feedback-card py-3 px-4 text-center shadow rounded-pill"
        :class="type === 'error' ? 'feedback-error' : 'feedback-success'"
        :role="type === 'error' ? 'alert' : 'status'"
      >
        <p v-if="type === 'error'" class="fw-semibold mb-2">Error!</p>
        <p class="mb-0">{{ message }}</p>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
  message: { type: String, default: '' },
  type: { type: String, default: 'success' },
})
const emit = defineEmits(['update:message'])
const visible = ref(false)
let timer

watch(
  () => props.message,
  (message) => {
    clearTimeout(timer)
    visible.value = Boolean(message)
    if (!message) return
    timer = setTimeout(() => {
      visible.value = false
      emit('update:message', '')
    }, 3000)
  },
  { immediate: true },
)

onBeforeUnmount(() => clearTimeout(timer))
</script>

<style scoped>
.feedback-position {
  z-index: 1080;
  width: 90%;
  max-width: 20rem;
  pointer-events: none;
}

.feedback-card {
  overflow-wrap: anywhere;
  animation: feedback-in 0.3s ease-out;
}

.feedback-card.feedback-success {
  background: linear-gradient(135deg, #f0fdf4 0%, #bbf7d0 100%);
  color: #14532d;
  border-color: #86efac;
}

.feedback-card.feedback-error {
  background: linear-gradient(135deg, #fff1f2 0%, #fecdd3 100%);
  color: #881337;
  border-color: #fda4af;
}

@keyframes feedback-in {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .feedback-card {
    animation: none;
  }
}
</style>
