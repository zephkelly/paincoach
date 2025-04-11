<!-- Tooltip.vue -->
<template>
  <div class="tooltip-container" ref="tooltipContainer">
    <p 
      class="tooltip-text" 
      @click="toggleTooltip"
      @mouseenter="handleHover"
      @mouseleave="handleMouseLeave"
      @keydown.enter="toggleTooltip"
      @keydown.space="toggleTooltip"
      ref="textElement"
      tabindex="0"
      role="button"
      :aria-expanded="isOpen"
      :aria-describedby="tooltipId"
    >
      <slot></slot>
      <span class="tooltip-icon" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </span>
    </p>
    <Teleport to="body">
      <transition name="tooltip-fade">
        <div 
          v-if="isOpen" 
          :id="tooltipId"
          class="tooltip-popup" 
          :style="tooltipStyle"
          role="tooltip"
          ref="tooltipPopup"
        >
          <div class="tooltip-content">
            <slot name="content">
              Tooltip content goes here
            </slot>
          </div>
          <button 
            v-if="isMobileDevice" 
            class="tooltip-close" 
            @click="closeTooltip"
            aria-label="Close tooltip"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';

// Define types for props
type TooltipProps = {
  hoverDelay: number;
  offset: { x: number; y: number };
  maxWidth: number;
}

// Define props with their TypeScript types
const props = defineProps<TooltipProps>();

// Define default values for props
defineProps({
  hoverDelay: { type: Number, default: 100 },
  offset: { 
    type: Object as () => { x: number; y: number }, 
    default: () => ({ x: 0, y: 5 }) 
  },
  maxWidth: { type: Number, default: 300 }
});

// State variables
const isOpen = ref(false);
const tooltipId = ref(`tooltip-${Math.random().toString(36).substring(2, 10)}`);
const tooltipContainer = ref<HTMLElement | null>(null);
const textElement = ref<HTMLElement | null>(null);
const tooltipPopup = ref<HTMLElement | null>(null);
const tooltipPosition = ref({ x: 0, y: 0 });
const hoverTimeout = ref<number | null>(null);
const isMobileDevice = ref(false);

// Computed style for tooltip positioning
const tooltipStyle = computed(() => ({
  left: `${tooltipPosition.value.x}px`,
  top: `${tooltipPosition.value.y}px`,
  maxWidth: `${props.maxWidth}px`
}));

// Toggle tooltip visibility
const toggleTooltip = () => {
  if (isOpen.value) {
    closeTooltip();
  } else {
    openTooltip();
  }
};

// Open tooltip and position it
const openTooltip = () => {
  isOpen.value = true;
  // Need to wait for tooltip to be rendered before positioning
  setTimeout(positionTooltip, 0);
};

// Close tooltip
const closeTooltip = () => {
  isOpen.value = false;
  if (hoverTimeout.value) {
    clearTimeout(hoverTimeout.value);
    hoverTimeout.value = null;
  }
};

// Handle hover event
const handleHover = () => {
  if (hoverTimeout.value) clearTimeout(hoverTimeout.value);
  hoverTimeout.value = window.setTimeout(() => {
    openTooltip();
  }, props.hoverDelay);
};

// Handle mouse leave
const handleMouseLeave = () => {
  if (hoverTimeout.value) {
    clearTimeout(hoverTimeout.value);
    hoverTimeout.value = null;
  }

  // Don't close on mouseleave for mobile devices
  if (!isMobileDevice.value) {
    closeTooltip();
  }
};

// Position tooltip near the element
const positionTooltip = () => {
  if (!tooltipContainer.value || !tooltipPopup.value) return;

  const iconRect = tooltipContainer.value.getBoundingClientRect();
  
  // Calculate position - position near the icon
  const x = iconRect.right - 10 + props.offset.x;
  const y = iconRect.bottom + props.offset.y;
  
  // Position tooltip
  tooltipPosition.value = { x, y };
};

// Check if device is mobile
const checkMobileDevice = () => {
  isMobileDevice.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Handle click outside
const handleClickOutside = (event: MouseEvent) => {
  if (
    isOpen.value && 
    tooltipPopup.value && 
    tooltipContainer.value &&
    !tooltipPopup.value.contains(event.target as Node) &&
    !tooltipContainer.value.contains(event.target as Node)
  ) {
    closeTooltip();
  }
};

// Handle keyboard events for accessibility
const handleKeydown = (event: KeyboardEvent) => {
  if (isOpen.value && event.key === 'Escape') {
    closeTooltip();
  }
};

// Handle window resize
const handleResize = () => {
  if (isOpen.value) {
    positionTooltip();
  }
}

// Lifecycle hooks
onMounted(() => {
  checkMobileDevice();
  
  // Add pure DOM event listeners
  window.addEventListener('click', handleClickOutside);
  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  // Clean up event listeners
  window.removeEventListener('click', handleClickOutside);
  window.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('resize', handleResize);
  
  // Clear any remaining timeout
  if (hoverTimeout.value) {
    clearTimeout(hoverTimeout.value);
  }
});

// Watch for isOpen changes to update position
watch(isOpen, (newValue) => {
  if (newValue) {
    positionTooltip();
  }
});
</script>

<style scoped>
.tooltip-container {
  display: inline-flex;
  position: relative;
}

.tooltip-text {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  margin: 0;
  padding: 0;
}

.tooltip-icon {
  display: inline-flex;
  margin-left: 4px;
  color: #888;
  transition: color 0.2s ease;
}

.tooltip-text:hover .tooltip-icon,
.tooltip-text:focus .tooltip-icon {
  color: #555;
}

.tooltip-popup {
  position: fixed;
  z-index: 9999;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  padding: 10px 15px;
  font-size: 0.875rem;
  line-height: 1.5;
  border: 1px solid #e0e0e0;
}

.tooltip-content {
  color: #333;
}

.tooltip-close {
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  cursor: pointer;
  color: #888;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.tooltip-close:hover {
  background-color: #f0f0f0;
}

/* Transition effects */
.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>