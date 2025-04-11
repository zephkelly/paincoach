<template>
    <section>
      <div class="container section">
        <ScrollToReveal class="reveal-container">                    
          <div class="video container" :class="{ loaded: !isLoading }">
            <ScrollToReveal @visible="onVisible" class="reveal-main" :threshold="0.85" :centerAlign="true">
              <video
                ref="videoRef"
                :muted="true"
                playsinline
                :loop="false"
                :autoplay="isVisible"
                @ended="onVideoEnded"
                alt="A ball of yarn slowly untangles, turning into a straight line, representing the process of finding clarity about your pain."
                tabindex="-1"
              >
                <source class="light" src="~/assets/video/hero.mp4" type="video/mp4" alt="A ball of yarn untangles into a straight line, only to tangle itself back up and start again." />
                <source class="dark" src="~/assets/video/hero-dark.mp4" type="video/mp4" alt="A ball of yarn untangles into a straight line, only to tangle itself back up and start again." />
                Your browser does not support video.
              </video>
            </ScrollToReveal>
          </div>
        </ScrollToReveal>
      </div>
    </section>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted, watch } from 'vue';
  
  const isLoading = ref(true);
  const isVisible = ref(false);
  const videoRef = ref<HTMLVideoElement | null>(null);
  const isDarkMode = ref(false);
  
  const onVisible = () => {
    isVisible.value = true;
    playAppropriateVideo();
  };
  
  const playAppropriateVideo = async () => {
    if (videoRef.value && isVisible.value) {
      const sources = videoRef.value.getElementsByTagName('source');
      for (let i = 0; i < sources.length; i++) {
        if ((isDarkMode.value && sources[i].classList.contains('dark')) ||
            (!isDarkMode.value && sources[i].classList.contains('light'))) {
          videoRef.value.src = sources[i].src;
          videoRef.value.load();
         
          try {
            await new Promise((resolve, reject) => {
              videoRef.value!.oncanplay = resolve;
              videoRef.value!.onerror = reject;
              setTimeout(reject, 10000);
            });
           
            await videoRef.value.play();
          } catch (error) {
            console.error('Error playing video:', error);
          }
          break;
        }
      }
    }
  };
  
  const onVideoEnded = async () => {
    if (videoRef.value) {
      // Pause for 1 second
      await new Promise(resolve => setTimeout(resolve, 1000));
  
      // Rewind the video quickly
      const duration = videoRef.value.duration;
      const rewindSteps = 20; // Number of steps to rewind
      const rewindInterval = 140; // Milliseconds between each step
  
    for (let i = 0; i < rewindSteps; i++) {
        await new Promise(resolve => setTimeout(resolve, rewindInterval));
        videoRef.value.currentTime = duration * (rewindSteps - i - 1) / rewindSteps;
    }
  
      // Play the video again
      videoRef.value.currentTime = 0;
      videoRef.value.play();
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
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 100%;
    aspect-ratio: 2/1;
    border-radius: 8px;
    overflow: hidden;
    animation: pulse 4s infinite;
    transition: background-color 0.5s ease, opacity 0.3s ease;
    opacity: 0;
    transform: scale(0.8);
  
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
    height: 105%;
    top: -1px;
    opacity: 0;
    transition: opacity 0.5s ease;

    
  }
}

.reveal-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.reveal-main {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: 8px;
}

.loading-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>