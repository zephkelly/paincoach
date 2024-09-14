<template>
    <div class="hero-graphic">
        <div class="graphic container" :class="{ loaded: !isLoading }">
            <template v-if="!isLoading">
                <img class="most" :src="loadedImages[currentImage + 3]" alt="Hero graphic" />
            </template>
        </div>
    </div>
  </template>
  
  <script lang="ts" setup>
import { ref, onMounted } from 'vue';

const imageIndex = ref(1);
const currentImage = ref(1);
const isLoading = ref(true);

const baseImages = [
  { base: '/images/confusion-light-', count: 3 },
  { base: '/images/lesser-confusion-light-', count: 3 },
  { base: '/images/least-confusion-light-', count: 1 }
];

const loadedImages = ref<string[]>([]);
const failedImages = ref<string[]>([]);

function swapImage() {
  currentImage.value = (currentImage.value + 1) % Math.max(loadedImages.value.length, 1);
}

function preloadImage(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => reject(src);
    img.src = src;
  });
}

async function preloadImages() {
  const imagePromises = baseImages.flatMap(({ base, count }) => 
    Array.from({ length: count }, (_, i) => i + 1).map(index => 
      preloadImage(`${base}${index}.webp`)
    )
  );

  const results = await Promise.allSettled(imagePromises);
  
  results.forEach(result => {
    if (result.status === 'fulfilled') {
      loadedImages.value.push(result.value);
    } else {
      failedImages.value.push(result.reason);
    }
  });

  isLoading.value = false;

  if (failedImages.value.length > 0) {
    console.error('Failed to load images:', failedImages.value);
  }
}

onMounted(() => {
    preloadImages();

    setInterval(() => {
        currentImage.value = (currentImage.value + 1) % 3;
    }, 300);
});
    </script>
  
  <style lang="scss" scoped>
  .graphic.container {
    position: relative;
    width: 100%;
    aspect-ratio: 2/1;
    border-radius: 8px;
    overflow: hidden;
    background-color: var(--text-color);
    animation: pulse 4s infinite;
    transition: background-color 0.5s ease, opacity 0.3s ease;
    opacity: 0;

    &.loaded {
        animation: none;
        opacity: 1;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 0.9;
      }
      50% {
        opacity: 0.6;
      }
    }
  
    img {
      position: absolute;
      width: 100%;
    }
  }
  
  .loading-placeholder {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    
  }
  </style>