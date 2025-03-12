<template>
  <div class="avatar-container">
    <div v-if="loading || id === undefined || firstName === undefined" class="avatar-skeleton"></div>
    <div v-else-if="profileUrl" class="avatar-image-container">
      <div class="avatar-skeleton"></div>
      <img
        :src="profileUrl"
        class="avatar-image"
        :class="{ 'avatar-image-loaded': imageLoaded }"
        @load="handleImageLoad"
        alt="User avatar"
      />
    </div>
    <div v-else class="profile-placeholder" :style="placeholderStyle">
      <p>{{ getFirstLetter(firstName || '') }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';

type UserProfileImageProps = {
    id: string | undefined;
    firstName: string | undefined;
    profileUrl?: string | null;
    loading: boolean;
};

const props = defineProps<UserProfileImageProps>();
const imageLoaded = ref(false);

// Generate a deterministic color based on the user ID
const generateColor = (id?: string) => {
    // Default color for undefined ID
    if (!id) {
        return {
            background: 'var(--avatar-default-bg)',
            text: 'var(--avatar-default-text)'
        };
    }

    // Simple hash function to get a number from a string
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = ((hash << 5) - hash) + id.charCodeAt(i);
        hash = hash & hash; // Convert to 32bit integer
    }
   
    // Color index based on hash
    const colorIndex = Math.abs(hash) % 10;
    
    // Use CSS variables for colors that adapt to light/dark mode
    return {
        background: `var(--avatar-bg-${colorIndex})`,
        text: `var(--avatar-text-${colorIndex})`
    };
};

const colorTheme = computed(() => generateColor(props.id));

const placeholderStyle = computed(() => ({
  backgroundColor: colorTheme.value.background,
  color: colorTheme.value.text
}));

const getFirstLetter = (name: string) => {
  if (!name) return '';
  return name.toLowerCase().charAt(0).toUpperCase();
};

const handleImageLoad = () => {
  imageLoaded.value = true;
};

onMounted(() => {
  if (props.profileUrl) {
    // Preload the image
    const img = new Image();
    img.src = props.profileUrl;
    img.onload = handleImageLoad;
  }
});
</script>

<style>
:root {
  /* Default fallback */
  --avatar-default-bg: var(--background-3-color, #e0e0e0);
  --avatar-default-text: var(--text-5-color, #333333);
  
  /* Light mode avatar colors - more vibrant base */
  --avatar-bg-0: rgba(255, 214, 224, 0.9); /* Light pink */
  --avatar-bg-1: rgba(255, 239, 181, 0.9); /* Light yellow */
  --avatar-bg-2: rgba(191, 236, 255, 0.9); /* Light blue */
  --avatar-bg-3: rgba(201, 226, 208, 0.9); /* Light green */
  --avatar-bg-4: rgba(208, 189, 240, 0.9); /* Light purple */
  --avatar-bg-5: rgba(240, 209, 165, 0.9); /* Light orange */
  --avatar-bg-6: rgba(181, 234, 215, 0.9); /* Mint */
  --avatar-bg-7: rgba(217, 227, 241, 0.9); /* Light slate */
  --avatar-bg-8: rgba(255, 200, 221, 0.9); /* Salmon */
  --avatar-bg-9: rgba(160, 218, 169, 0.9); /* Sage */
  
  /* Light mode text colors */
  --avatar-text-0: #9A4E63; /* Dark pink */
  --avatar-text-1: #8A7A3C; /* Dark yellow */
  --avatar-text-2: #4D7A9E; /* Dark blue */
  --avatar-text-3: #5A7D64; /* Dark green */
  --avatar-text-4: #6D5794; /* Dark purple */
  --avatar-text-5: #8B5F2A; /* Dark orange */
  --avatar-text-6: #5E8A76; /* Dark mint */
  --avatar-text-7: #4A5D7E; /* Dark slate */
  --avatar-text-8: #9D5A71; /* Dark salmon */
  --avatar-text-9: #57724C; /* Dark sage */
}

/* Dark mode avatar color overrides */
@media (prefers-color-scheme: dark) {
  :root {
    /* Default fallback for dark mode */
    --avatar-default-bg: var(--background-4-color, #2a2a2a);
    --avatar-default-text: var(--text-3-color, #bfbfbf);
    
    /* Dark mode avatar colors - more muted and darker */
    --avatar-bg-0: rgba(127, 70, 86, 0.45); /* Muted pink */
    --avatar-bg-1: rgba(132, 117, 58, 0.45); /* Muted yellow */
    --avatar-bg-2: rgba(65, 102, 133, 0.45); /* Muted blue */
    --avatar-bg-3: rgba(77, 107, 86, 0.45); /* Muted green */
    --avatar-bg-4: rgba(96, 75, 134, 0.45); /* Muted purple */
    --avatar-bg-5: rgba(139, 95, 42, 0.45); /* Muted orange */
    --avatar-bg-6: rgba(78, 118, 98, 0.45); /* Muted mint */
    --avatar-bg-7: rgba(65, 82, 112, 0.45); /* Muted slate */
    --avatar-bg-8: rgba(139, 76, 98, 0.45); /* Muted salmon */
    --avatar-bg-9: rgba(77, 108, 64, 0.45); /* Muted sage */
    
    /* Dark mode text colors - brighter for contrast */
    --avatar-text-0: #ffb5c6; /* Bright pink */
    --avatar-text-1: #ffe070; /* Bright yellow */
    --avatar-text-2: #8ccbff; /* Bright blue */
    --avatar-text-3: #a8e0b8; /* Bright green */
    --avatar-text-4: #c7a8ff; /* Bright purple */
    --avatar-text-5: #ffc582; /* Bright orange */
    --avatar-text-6: #9decc8; /* Bright mint */
    --avatar-text-7: #a5c4f7; /* Bright slate */
    --avatar-text-8: #ffaac9; /* Bright salmon */
    --avatar-text-9: #b8e6a3; /* Bright sage */
  }
}
</style>

<style scoped>
.avatar-container {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 100%;
  overflow: hidden;
}

.avatar-skeleton {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--background-3-color, #e0e0e0);
  border-radius: 100%;
}

.avatar-image-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.avatar-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 100%;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar-image-loaded {
  opacity: 1;
}

.profile-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 100%;
  text-transform: uppercase;
}
</style>