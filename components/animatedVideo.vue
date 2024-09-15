<template>
  <ClientOnly>
    <section>
      <div class="container section">
        <ScrollToReveal>                    
          <div class="video container" :class="{ loaded: !isLoading }">
            <ScrollToReveal @visible="onVisible" :threshold="0.8">
              <video
                ref="videoRef"
                muted
                playsinline
                :loop="false"
                :autoplay="isVisible"
              >
                <source class="light" src="~/assets/video/hero.mp4" type="video/mp4" />
                <source class="dark" src="~/assets/video/hero-dark.mp4" type="video/mp4" />
                Your browser does not support video.
              </video>
            </ScrollToReveal>
          </div>
        </ScrollToReveal>
      </div>
    </section>
  </ClientOnly>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';

const isLoading = ref(true);
const isVisible = ref(false);
const videoRef = ref<HTMLVideoElement | null>(null);
const isDarkMode = ref(false);

const onVisible = () => {
  isVisible.value = true;
  console.log('Video is visible');
  playAppropriateVideo();
};

const playAppropriateVideo = () => {
  if (videoRef.value && isVisible.value) {
    const sources = videoRef.value.getElementsByTagName('source');
    for (let i = 0; i < sources.length; i++) {
      if ((isDarkMode.value && sources[i].classList.contains('dark')) || 
          (!isDarkMode.value && sources[i].classList.contains('light'))) {
        videoRef.value.src = sources[i].src;
        videoRef.value.play().catch(error => console.error('Error playing video:', error));
        break;
      }
    }
  }
};

const updateColorScheme = () => {
  isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
};

onMounted(() => {
  if (videoRef.value) {
    videoRef.value.preload = 'metadata';
  }
  
  updateColorScheme();
  
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateColorScheme);
});

watch(isDarkMode, () => {
  if (isVisible.value) {
    playAppropriateVideo();
  }
});

watch(isVisible, (newValue) => {
  if (newValue) {
    isLoading.value = false;
  }
});
</script>

<style lang="scss" scoped>
.video.container {
  position: relative;
  width: 100%;
  aspect-ratio: 2/1;
  border-radius: 8px;
  overflow: hidden;
  animation: pulse 4s infinite;
  transition: background-color 0.5s ease, opacity 0.3s ease;
  opacity: 0;
  
  &.loaded {
    animation: none;
    opacity: 1;
    video {
      opacity: 1;
    }
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
  
  video {
    position: relative;
    top: -1px;
    width: 101%;
    opacity: 0;
    transition: opacity 0.5s ease;

    @media (prefers-color-scheme: dark) {
      width: 105%;
      top: -8px;
    }
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