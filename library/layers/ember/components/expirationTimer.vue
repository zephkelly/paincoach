<template>
    <div class="expiration-timer">
      <span v-if="isExpired" class="expired">Expired</span>
      <span v-else class="remaining">{{ formattedTimeRemaining }}</span>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
  
  interface Props {
    expiresAt: Date;
    updateInterval?: number;
  }
  
  const props = defineProps<Props>();
  
  // Default props
  const updateInterval = props.updateInterval ?? 60000; // 1 minute by default
  
  const now = ref(new Date());
  const timerId = ref<number | null>(null);
  
  const expiration = computed(() => props.expiresAt);
  const isExpired = computed(() => now.value >= expiration.value);
  const timeRemainingMs = computed(() => Math.max(0, expiration.value.getTime() - now.value.getTime()));
  
  const formattedTimeRemaining = computed(() => {
    if (isExpired.value) return 'Expired';
   
    const seconds = Math.floor(timeRemainingMs.value / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
   
    if (days > 0) {
      return `${days} day${days !== 1 ? 's' : ''} ${hours % 24} hour${hours % 24 !== 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes % 60} minute${minutes % 60 !== 1 ? 's' : ''}`;
    } else {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
  });
  
  const updateTime = (): void => {
    now.value = new Date();
  };
  
  const stopTimer = (): void => {
    if (timerId.value !== null) {
      clearTimeout(timerId.value);
      timerId.value = null;
    }
  };
  
  const setupDynamicInterval = (): void => {
    let interval = updateInterval;
   
    if (timeRemainingMs.value <= 60 * 60 * 1000) { // Less than an hour
      interval = 10000; // 10 seconds
    } else if (timeRemainingMs.value <= 24 * 60 * 60 * 1000) { // Less than a day
      interval = 30000; // 30 seconds
    }
   
    stopTimer();
   
    if (!isExpired.value) {
      timerId.value = window.setTimeout(() => {
        updateTime();
        setupDynamicInterval(); // Recursively setup next interval
      }, interval);
    }
  };
  
  const startTimer = (): void => {
    updateTime();
    setupDynamicInterval();
  };
  
  onMounted(() => {
    startTimer();
  });
  
  onBeforeUnmount(() => {
    stopTimer();
  });
  </script>
  
  <style scoped lang="scss">
  .expiration-timer {
    display: inline-block;
    font-weight: 500;
  }
  .expired {
    color: #dc3545;
  }
  .remaining {
    color: var(--text-color);
  }
  </style>