// components/SliderInput.vue
<template>
  <div class="slider-container">
    <div class="slider-track" ref="track" @click="handleTrackClick">
      <div 
        class="slider-fill" 
        :style="{ width: fillWidth + '%' }"
      ></div>
      <div 
        class="slider-thumb-container"
        :style="{ left: thumbPosition + '%' }"
      >
        <div 
          class="slider-thumb-touch-target"
          @touchstart="startDrag"
          @mousedown="startDrag"
        ></div>
        <div 
          class="slider-thumb" 
          ref="thumb"
        ></div>
      </div>
    </div>
    
    <div class="slider-labels">
      <div 
        v-for="option in options" 
        :key="option.value" 
        class="slider-label"
        :class="{ 'active': modelValue === option.value }"
      >
        {{ option.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

export interface QuestionOption {
  value: number;
  label: string;
}

const props = defineProps<{
  modelValue: number;
  min: number;
  max: number;
  step?: number;
  options?: QuestionOption[];
  bounceEffect?: 'none' | 'light' | 'medium' | 'strong'; // Amount of bounce in snap animation
  useHardwareAcceleration?: boolean; // Enable hardware acceleration for smoother animation
  transitionSpeed?: 'instant' | 'fast' | 'normal' | 'slow' | 'very-slow'; // Control the speed of the transition
  maxBounceDistance?: number; // Fine-grained control: units of 0.1% (10 = 1%, 100 = 10%)
}>();

// Set default props
const bounceEffect = props.bounceEffect ?? 'medium';
const useHardwareAcceleration = props.useHardwareAcceleration !== false;
const transitionSpeed = props.transitionSpeed ?? 'normal';
// Max bounce distance is now represented in 0.1% units for finer control
// Default of 100 = 10% max bounce, 10 = 1% max bounce, 1 = 0.1% max bounce
const maxBounceDistanceUnits = props.maxBounceDistance ?? 100; 
// Convert to percentage for internal calculations
const maxBounceDistance = maxBounceDistanceUnits * 0.1;

const emit = defineEmits(['update:modelValue']);

const track = ref<HTMLElement | null>(null);
const thumb = ref<HTMLElement | null>(null);
const isDragging = ref(false);
const dragValue = ref(props.modelValue);

// State for visual position (can be different from actual value during animation)
const visualPosition = ref(props.modelValue);
const isAnimating = ref(false);
const startingPosition = ref(props.modelValue); // Track starting position for distance-based attenuation
const targetPosition = ref(props.modelValue);   // Keep track of target position for bounds checking

// Computed properties for positioning
const range = computed(() => props.max - props.min);
const fillWidth = computed(() => {
  return ((visualPosition.value - props.min) / range.value) * 100;
});
const thumbPosition = computed(() => {
  return ((visualPosition.value - props.min) / range.value) * 100;
});

// Touch and mouse event handlers
const startDrag = (event: MouseEvent | TouchEvent) => {
  // Cancel any ongoing animation
  if (animationFrameId.value !== null) {
    cancelAnimationFrame(animationFrameId.value);
    animationFrameId.value = null;
  }
  
  event.preventDefault();
  isDragging.value = true;
  // Initialize dragValue with current modelValue
  dragValue.value = props.modelValue;
  
  document.addEventListener('mousemove', onDrag, { passive: false });
  document.addEventListener('touchmove', onDrag, { passive: false });
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchend', stopDrag);
  
  // Handle initial click/touch position
  onDrag(event);
};

const onDrag = (event: MouseEvent | TouchEvent) => {
  if (!isDragging.value || !track.value) return;
  
  // Get position
  const trackRect = track.value.getBoundingClientRect();
  let clientX: number;
  
  if ('touches' in event) {
    if (!event.touches[0]) return;
    clientX = event.touches[0].clientX;
    event.preventDefault(); // Prevent scrolling while dragging
  } else {
    clientX = event.clientX;
  }
  
  // Calculate new value based on position
  let percentage = (clientX - trackRect.left) / trackRect.width;
  percentage = Math.max(0, Math.min(1, percentage));
  
  // Allow continuous movement while dragging
  let newValue = props.min + percentage * range.value;
  
  // Ensure value is within bounds
  newValue = Math.max(props.min, Math.min(props.max, newValue));
  
  // Update both drag value and visual position directly
  dragValue.value = newValue;
  visualPosition.value = newValue; // Direct update during drag
  
  // During drag, we emit the raw value (possibly between steps)
  emit('update:modelValue', newValue);
};

const stopDrag = () => {
  if (!isDragging.value) return;
  
  isDragging.value = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('touchmove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('touchend', stopDrag);
  
  // When dragging stops, snap to the nearest step or option
  snapToNearestValue();
};

const snapToNearestValue = () => {
  let snappedValue = dragValue.value;
  
  // If options are provided, snap to closest option
  if (props.options && props.options.length > 0) {
    const optionValues = props.options.map(opt => opt.value);
    snappedValue = optionValues.reduce((prev, curr) => 
      Math.abs(curr - dragValue.value) < Math.abs(prev - dragValue.value) ? curr : prev
    );
  } 
  // If step is provided, snap to nearest step
  else if (props.step) {
    const steps = Math.round((dragValue.value - props.min) / props.step);
    snappedValue = props.min + (steps * props.step);
    
    // Ensure value is within bounds after stepping
    snappedValue = Math.max(props.min, Math.min(props.max, snappedValue));
  }
  
  // Emit the snapped value immediately
  emit('update:modelValue', snappedValue);
  
  // Store current position as starting position before animation
  startingPosition.value = visualPosition.value;
  targetPosition.value = snappedValue;
  
  // Animate the visual position to the snapped value
  animateToValue(snappedValue);
};

// For handling animation
const animationFrameId = ref<number | null>(null);

// Animation parameters
const ANIMATION_PRECISION = 0.001; // When to stop the animation (smaller = more precise)

const animateToValue = (targetValue: number) => {
  if (isAnimating.value) {
    // If already animating, cancel the previous animation
    if (animationFrameId.value !== null) {
      cancelAnimationFrame(animationFrameId.value);
    }
    isAnimating.value = false;
  }
  
  isAnimating.value = true;
  
  let velocity = 0;
  let lastTimestamp: number | null = null;
  
  // Calculate distance as percentage of range to scale down bounce for long distances
  const distancePercentage = Math.abs(targetValue - startingPosition.value) / range.value * 100;
  
  // Calculate bounce attenuation factor (1.0 = full bounce, 0.0 = no bounce)
  // For large movements, reduce bounce effect but ensure there's still a visible bounce
  // Less aggressive attenuation curve - even long distances maintain some bounce
  const distanceAttenuationFactor = Math.min(1, 50 / Math.max(10, distancePercentage));
  
  const performSpringAnimation = (timestamp: number) => {
    if (!isAnimating.value) return;
    
    // Calculate time delta for smooth animation regardless of frame rate
    if (!lastTimestamp) {
      lastTimestamp = timestamp;
      animationFrameId.value = requestAnimationFrame(performSpringAnimation);
      return;
    }
    
    const deltaTime = Math.min((timestamp - lastTimestamp) / 1000, 0.064); // Cap at ~15fps to avoid large jumps
    lastTimestamp = timestamp;
    
    // Calculate displacement
    const displacement = targetValue - visualPosition.value;
    
    // If we're close enough, end the animation
    if (Math.abs(displacement) < ANIMATION_PRECISION && Math.abs(velocity) < ANIMATION_PRECISION) {
      visualPosition.value = targetValue;
      isAnimating.value = false;
      return;
    }
    
    // Get spring parameters based on current bounce effect setting
    let { stiffness, damping } = getSpringParams.value;
    
    // Apply distance-based attenuation to damping for large movements
    // This increases damping (reduces bounce) for larger movements
    // Use a gentler attenuation to ensure there's always visible bounce
    if (bounceEffect !== 'none') {
      // Less aggressive damping adjustment - preserves more of the original bounce
      damping = damping + (1 - damping) * (1 - distanceAttenuationFactor) * 0.6;
    }
    
    // Scale stiffness by deltaTime for consistent behavior regardless of frame rate
    const scaledStiffness = stiffness * 60 * deltaTime; // Normalize to 60fps
    
    // Spring physics: force = stiffness * displacement
    const springForce = displacement * scaledStiffness;
    
    // Apply damping to velocity: damping reduces the velocity
    velocity = velocity * Math.pow(1 - damping, deltaTime * 60) + springForce;
    
    // Limit max bounce distance based on maxBounceDistance prop
    const newPosition = visualPosition.value + velocity;
    
    // Calculate the potential bounce distance (how far past the target we would go)
    const bounceDistance = Math.abs(newPosition - targetValue);
    const bounceDistancePercent = (bounceDistance / range.value) * 100;
    
    // For debugging purposes in development
    // console.log(`Bounce: ${bounceDistancePercent.toFixed(2)}%, Max: ${maxBounceDistance.toFixed(2)}%`);
    
    if (
      // If we're about to overshoot (bounce)
      (newPosition > targetValue && velocity > 0) || 
      (newPosition < targetValue && velocity < 0)
    ) {
      // Check if bounce would exceed max bounce distance
      if (bounceDistancePercent > maxBounceDistance) {
        // Reduce velocity to limit bounce
        const maxBounceInValueUnits = (maxBounceDistance / 100) * range.value;
        const maxVelocity = (newPosition > targetValue) ? 
          (targetValue + maxBounceInValueUnits - visualPosition.value) : 
          (targetValue - maxBounceInValueUnits - visualPosition.value);
        
        // Limit velocity to prevent excessive bounce
        velocity = (velocity > 0) ? 
          Math.min(velocity, maxVelocity) : 
          Math.max(velocity, maxVelocity);
      }
    }
    
    // Update position based on velocity
    visualPosition.value += velocity;
    
    // Continue animation with requestAnimationFrame for optimal performance
    animationFrameId.value = requestAnimationFrame(performSpringAnimation);
  };
  
  // Start the animation with requestAnimationFrame
  animationFrameId.value = requestAnimationFrame(performSpringAnimation);
};

// Handle clicking directly on the track
const handleTrackClick = (event: MouseEvent) => {
  if (!track.value) return;
  
  const trackRect = track.value.getBoundingClientRect();
  const percentage = (event.clientX - trackRect.left) / trackRect.width;
  
  // Calculate the raw value
  dragValue.value = props.min + percentage * range.value;
  
  // Store current position before animation starts
  startingPosition.value = visualPosition.value;
  
  // Immediately snap to appropriate value
  snapToNearestValue();
};

// Watch for modelValue changes from outside
watch(() => props.modelValue, (newValue) => {
  // If we're not dragging and not animating, update visual position directly
  if (!isDragging.value && !isAnimating.value) {
    visualPosition.value = newValue;
  } else if (!isDragging.value && isAnimating.value) {
    // If animating, update target and continue animation
    targetPosition.value = newValue;
    animateToValue(newValue);
  }
});

// Get spring parameters based on current bounce effect and transition speed
const getSpringParams = computed(() => {
  // Base stiffness values for each bounce effect
  let baseStiffness: number;
  let baseDamping: number;
  
  // Set base parameters based on bounce effect
  switch(bounceEffect) {
    case 'none':
      baseStiffness = 1.6;
      baseDamping = 1.0; // No bounce
      break;
    case 'light':
      baseStiffness = 1.3;
      baseDamping = 0.75; // More noticeable bounce
      break;
    case 'medium':
      baseStiffness = 1.0;
      baseDamping = 0.65; // Significant bounce
      break;
    case 'strong':
      baseStiffness = 0.8;
      baseDamping = 0.45; // Very strong bounce
      break;
    default:
      baseStiffness = 1.0;
      baseDamping = 0.65;
  }
  
  // Apply speed multiplier based on transition speed
  let speedMultiplier: number;
  switch(transitionSpeed) {
    case 'instant':
      speedMultiplier = 0.35;  // About 0.3 seconds
      break;
    case 'fast':
      speedMultiplier = 0.28;  // About 0.4 seconds
      break;
    case 'normal':
      speedMultiplier = 0.20;  // About 0.5 seconds
      break;
    case 'slow':
      speedMultiplier = 0.15;  // About 0.7 seconds
      break;
    case 'very-slow':
      speedMultiplier = 0.10;  // About 1.0 seconds
      break;
    default:
      speedMultiplier = 0.20;  // Normal as default
  }
  
  // Apply speed multiplier to stiffness (which controls speed)
  // Lower stiffness = slower transition
  // For slower transitions, we reduce damping slightly to maintain bounce feeling
  const dampingAdjustment = transitionSpeed === 'slow' || transitionSpeed === 'very-slow' ? 
    (bounceEffect !== 'none' ? 0.9 : 1) : 1;
  
  return {
    stiffness: baseStiffness * speedMultiplier,
    damping: baseDamping * dampingAdjustment
  };
});

onMounted(() => {
  // Initialize visual position with model value
  visualPosition.value = props.modelValue;
  startingPosition.value = props.modelValue;
  targetPosition.value = props.modelValue;
});

onUnmounted(() => {
  // Cancel any ongoing animations
  if (animationFrameId.value !== null) {
    cancelAnimationFrame(animationFrameId.value);
  }
  isAnimating.value = false;
  
  // Clean up events
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('touchmove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('touchend', stopDrag);
});
</script>

<style scoped>
.slider-container {
  width: 100%;
  padding: 16px 0;
  -webkit-tap-highlight-color: transparent; /* Remove tap highlight on mobile */
  touch-action: none; /* Prevents browser handling of gestures */
}

.slider-track {
  position: relative;
  height: 8px;
  width: 100%;
  background-color: #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  will-change: contents; /* Hint for browser optimization */
}

.slider-fill {
  position: absolute;
  height: 100%;
  background-color: #4f46e5;
  border-radius: 4px;
  pointer-events: none;
  will-change: width; /* Optimizes animation */
}

.slider-thumb-container {
  position: absolute;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
  z-index: 2;
  will-change: left, transform; /* Optimize these properties */
  -webkit-backface-visibility: hidden; /* Prevent flickering during animation */
}

.slider-thumb-touch-target {
  position: absolute;
  width: 44px;
  height: 44px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 3;
  border-radius: 50%;
  /* Uncomment the following for debugging the touch target */
  /* background-color: rgba(255, 0, 0, 0.2); */
}

.slider-thumb {
  position: absolute;
  width: 24px;
  height: 24px;
  background-color: #4f46e5;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Center within the touch target */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.2s;
  -webkit-backface-visibility: hidden; /* Prevent flickering during animation */
}

.slider-thumb:hover,
.slider-thumb-touch-target:hover + .slider-thumb {
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
}

.slider-label {
  font-size: 12px;
  color: #666;
  transition: color 0.2s, font-weight 0.2s;
  text-align: center;
}

.slider-label.active {
  color: #4f46e5;
  font-weight: 600;
}

@media (max-width: 640px) {
  .slider-label {
    font-size: 10px;
  }
}
</style>