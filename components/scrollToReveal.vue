<template>
    <div ref="revealEl" :class="['reveal-element', { 'is-visible': isVisible }]">
      <slot></slot>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  
  const revealEl = ref<HTMLElement | null>(null)
  const isVisible = ref(false)
  
  let observer: IntersectionObserver | null = null
  
  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          isVisible.value = true
          observer?.disconnect() // Stop observing once visible
        }
      },
      { threshold: 0.2 } // Trigger when 10% of the element is visible
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
  }
  
  .reveal-element.is-visible {
    opacity: 1;
    transform: translateY(0) translateX(0);
  }
  </style>