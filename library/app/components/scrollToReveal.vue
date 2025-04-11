<template>
    <div ref="revealEl" :class="['reveal-element', { 'is-visible': isVisible }, { center: centerAlign }, { 'fill-parent': fillParent }]">
      <slot></slot>
    </div>
  </template>
  
  <script setup lang="ts">
  const revealEl = ref<HTMLElement | null>(null)
  const isVisible = ref(false)

  const props = defineProps({
    threshold: {
      type: Number,
      default: 0.2
      },
      centerAlign: {
        type: Boolean,
        default: false
      },
      fillParent: {
        type: Boolean,
        default: false
      }
  })

  const emit = defineEmits(['visible'])
  
  let observer: IntersectionObserver | null = null
  
  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
            isVisible.value = true
            emit('visible', true)
            observer?.disconnect() // Stop observing once visible
        }
      },
      { threshold: props.threshold } // Trigger when 10% of the element is visible
    )
  
    if (revealEl.value) {
      observer.observe(revealEl.value)
    }
  })
  
  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })
</script>
  
<style scoped>
    .reveal-element {
        position: relative;
        z-index: 3;
        opacity: 0;
        transform: translateX(-6px);
        transition: opacity 1.2s cubic-bezier(0.075, 0.82, 0.165, 1), transform 0.6s ease;
        will-change: opacity, transform;
        width: 100%;
        /* display: flex;
        flex-direction: column;
        align-items: center; */
    }

    .reveal-element.center {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .reveal-element.fill-parent {
        width: 100%;
        height: 100%;
    }
  
    .reveal-element.is-visible {
        opacity: 1;
        transform: translateY(0) translateX(0);
    }
</style>