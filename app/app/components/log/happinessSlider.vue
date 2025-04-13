<template>
    <div class="happiness-slider">
        <div class="slider-wrapper">
            <ESlider
                class="happiness-slider-input"
                :modelValue="modelValue"
                :color="color"
                :min="(min !== undefined) ? min : 1"
                :max="(max !== undefined) ? max : 5"
                :max-indicators="(indicators?.maxIndicators !== undefined) ? indicators?.maxIndicators : 5"
                :step="1"
                :indicator-step="1"
                :snap-tolerance="3"
                :color-variables="colorVariables"
                :bounceEffect="'light'"
                :showStepIndicators="true"
                :step-indicator-style="indicators?.stepIndicatorStyle || 'line'"
                :numberFormat="indicators?.numberFormat || 'integer'"
                edge-easing-strength="subtle"
                @update:modelValue="updateValue"
                @update:color="updateColor"
                @slider-moving="onSliderMoving"
            />
        </div>
        <!-- <svg :style="{color: getAnimatedFaceColor(1)}" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4"><path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/><path stroke-linecap="round" d="M31 18v1m-14-1v1m0 13l14-2"/></g></svg>
        <svg :style="{color: getAnimatedFaceColor(2)}" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4"><path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/><path stroke-linecap="round" d="M31 18v1m-14-1v1m0 13l14-2"/></g></svg>
        <svg :style="{color: getAnimatedFaceColor(3)}" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4"><path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/><path stroke-linecap="round" d="M31 18v1m-14-1v1m0 13l14-2"/></g></svg>       -->
        <div class="svg-container" ref="svgContainer">
            <svg :style="{color: getAnimatedFaceColor(0)}" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4"><path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/><path stroke-linecap="round" d="M31 18v1m-14-1v1m14 12s-2 4-7 4s-7-4-7-4"/></g></svg>
            <svg :style="{color: getAnimatedFaceColor(1)}" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4"><path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/><path stroke-linecap="round" d="M31 18v1m-14-1v1m14 12s-2-4-7-4s-7 4-7 4"/></g></svg>
            <svg :style="{color: getAnimatedFaceColor(2)}" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4"><path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/><path stroke-linecap="round" d="m33 25l-4-2m-11 0l-4 2m17 10s-2-4-7-4s-7 4-7 4"/></g></svg>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watchEffect } from 'vue';

// Animation configuration interface
export interface SliderAnimationConfig {
  bounceEffect?: 'none' | 'light' | 'medium' | 'strong';
  useHardwareAcceleration?: boolean;
  transitionSpeed?: 'instant' | 'fast' | 'normal' | 'slow' | 'very-slow';
  maxBounceDistance?: number;
  edgeEasingStrength?: 'none' | 'subtle' | 'medium' | 'strong';
}

// Indicator configuration interface
export interface SliderIndicatorConfig {
  showStepIndicators?: boolean;
  stepIndicatorStyle?: 'dot' | 'line' | 'numbered' | 'numbered-line';
  maxIndicators?: number;
  numberFormat?: 'decimal' | 'integer' | 'compact';
}

// Value configuration interface
export interface SliderValueConfig {
  step?: number;
  indicatorStep?: number;
  snapToNearest?: boolean;
  snapTolerance?: number;
  precision?: number;
}

// Main props interface with grouped configurations only
export interface HappinessSliderProps {
  modelValue?: number;
  color?: string;
  min?: number;
  max?: number;
  animation?: SliderAnimationConfig;
  indicators?: SliderIndicatorConfig;
  valueConfig?: SliderValueConfig;
}

// Set default props with withDefaults
const props = withDefaults(defineProps<HappinessSliderProps>(), {
  min: 0,  // Default min is now 0
  max: 10, // Default max is now 10
});

const emit = defineEmits(['update:modelValue', 'update:color', 'update:happiness']);

// Color variables for the gradient effect (from your CSS variables)
const colorVariables = [
  '--pain-0', // Green for happiness
  '--pain-1',
  '--pain-2', // Yellow for neutral
  '--pain-3',
];

// Get face elements from the DOM
const svgContainer = ref<HTMLElement | null>(null);
const faceElements = ref<Element[]>([]);

// Visual position for animation - use nullish coalescing to handle zero correctly
const animatedPosition = ref(props.modelValue ?? props.min);
const isAnimating = ref(false);
const animationFrameId = ref<number | null>(null);
let animationStartTime = 0;
const ANIMATION_DURATION = 350; // in ms

// Setup face elements after component mount
onMounted(() => {
  // Use nextTick or setTimeout to ensure DOM is fully rendered
  setTimeout(() => {
    svgContainer.value = document.querySelector('.svg-container');
    if (svgContainer.value) {
      faceElements.value = Array.from(svgContainer.value.querySelectorAll('svg'));
      console.log(`Found ${faceElements.value.length} face elements`);
    }
    
    // Initialize animation position to current modelValue or min
    animatedPosition.value = props.modelValue ?? props.min;
  }, 0);
});

// Dynamically compute positions for each face based on the number of faces
const facePositions = computed(() => {
  const faceCount = faceElements.value.length;
  if (faceCount === 0) return {};
  
  const min = props.min;
  const max = props.max;
  const range = max - min;
  
  // Ensure range is not zero to prevent division by zero
  if (range === 0 || faceCount <= 1) return { 0: min };
  
  // Create an object with dynamic positions
  const positions: Record<number, number> = {};
  
  // Distribute positions evenly across the range
  for (let i = 0; i < faceCount; i++) {
    const position = min + (range * i / (faceCount - 1));
    positions[i] = position;
  }
  
  console.log('Face positions:', positions);
  return positions;
});

// Update the model value when slider changes
const updateValue = (value: number) => {
  emit('update:modelValue', value);
  emit('update:happiness', getHappinessLevel(value));
  
  // Start animation to the new value
  animateToPosition(value);
};

// Update the color when slider changes
const updateColor = (newColor: string) => {
  emit('update:color', newColor);
};

// Handle slider moving events from the ESlider component
const onSliderMoving = (position: number) => {
  // Update animated position directly during dragging
  animatedPosition.value = position;
};

// Animate the position value for smooth transitions
const animateToPosition = (targetValue: number) => {
  // Clear any existing animation
  if (animationFrameId.value !== null) {
    cancelAnimationFrame(animationFrameId.value);
    animationFrameId.value = null;
  }
  
  // Skip animation if the difference is very small
  if (Math.abs(targetValue - animatedPosition.value) < 0.01) {
    animatedPosition.value = targetValue;
    return;
  }
  
  // Start animation
  isAnimating.value = true;
  animationStartTime = performance.now();
  const startPosition = animatedPosition.value;
  const positionDelta = targetValue - startPosition;
  
  const animate = (timestamp: number) => {
    const elapsed = timestamp - animationStartTime;
    const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
    
    // Use cubic-bezier easing for smooth animation
    // This approximates the cubic-bezier(0.075, 0.82, 0.165, 1) from the CSS
    const easedProgress = cubicBezier(0.075, 0.82, 0.165, 1, progress);
    
    animatedPosition.value = startPosition + positionDelta * easedProgress;
    
    if (progress < 1) {
      animationFrameId.value = requestAnimationFrame(animate);
    } else {
      animatedPosition.value = targetValue;
      isAnimating.value = false;
      animationFrameId.value = null;
    }
  };
  
  animationFrameId.value = requestAnimationFrame(animate);
};

// Cubic bezier easing function
const cubicBezier = (x1: number, y1: number, x2: number, y2: number, t: number): number => {
  // Simple implementation of cubic bezier
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  
  // Newton-Raphson iterations to solve for t
  let x = t, i = 0;
  while (i < 5) {
    const xTm = x * (cx + x * (bx + x * ax));
    if (Math.abs(xTm - t) < 0.001) break;
    x = x - (xTm - t) / (cx + x * (2 * bx + 3 * ax * x));
    i++;
  }
  
  return x * (cy + x * (by + x * ay));
};

// Get happiness level description based on value
const getHappinessLevel = (value: number) => {
  const minVal = props.min;
  const maxVal = props.max;
  const range = maxVal - minVal;
  
  // Dynamically determine segments based on face count
  const faceCount = faceElements.value.length;
  if (faceCount === 0) return 'Unknown';
  
  // Handle edge case for zero or small range
  if (range === 0 || faceCount <= 1) return 'Emotion Level 1';
  
  const segment = range / faceCount;
  const normalizedValue = value - minVal; // Start from 0
  
  // Determine which segment the value falls into
  for (let i = 0; i < faceCount; i++) {
    if (normalizedValue <= segment * (i + 1)) {
      // Return dynamic happiness level based on position
      // You can customize these descriptions as needed
      const emotions = ['Very Happy', 'Happy', 'Neutral'];
      // If we have more faces than predefined emotions, we'll generate descriptive names
      return i < emotions.length ? emotions[i] : `Emotion Level ${i + 1}`;
    }
  }
  
  return `Emotion Level ${faceCount}`; // Fallback
};

// Get animated face color for any face at the given index
const getAnimatedFaceColor = (faceIndex: number) => {
  // Base color for inactive state - using the semi-transparent gray
  const baseR = 88;
  const baseG = 88;
  const baseB = 88;
  const baseA = 0.39;
  
  // If no slider color yet, return base color
  if (!props.color) return `rgba(${baseR}, ${baseG}, ${baseB}, ${baseA})`;

  // Parse the rgba from color
  const rgbaMatch = props.color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d*\.?\d+))?\)/);
  if (!rgbaMatch) return `rgba(${baseR}, ${baseG}, ${baseB}, ${baseA})`;

  if (!rgbaMatch[1] || !rgbaMatch[2] || !rgbaMatch[3]) {
    return `rgba(${baseR}, ${baseG}, ${baseB}, ${baseA})`;
  }

  const sliderR = parseInt(rgbaMatch[1]);
  const sliderG = parseInt(rgbaMatch[2]);
  const sliderB = parseInt(rgbaMatch[3]);
  // Default to full opacity if not specified
  const sliderA = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1;

  // Get the position value for this face index
  const positions = facePositions.value;
  if (!positions[faceIndex] && positions[faceIndex] !== 0) {
    return `rgba(${baseR}, ${baseG}, ${baseB}, ${baseA})`;
    }
  
  const facePosition = positions[faceIndex];
  
  // Calculate the distance between the ANIMATED slider value and this face position
  const distance = Math.abs(animatedPosition.value - facePosition);
  
  // Create a smooth transition factor
  // Max distance to consider is the total range
  const maxDistance = props.max - props.min;
  
  // Handle edge case for zero range
  if (maxDistance === 0) {
    return animatedPosition.value === facePosition
      ? `rgba(${sliderR}, ${sliderG}, ${sliderB}, ${sliderA})`
      : `rgba(${baseR}, ${baseG}, ${baseB}, ${baseA})`;
  }
  
  // Calculate the factor with a non-linear curve for a more pleasing transition
  // This creates a smoother falloff (cubic easing)
  const linearFactor = Math.max(0, 1 - (distance / maxDistance));
  const factor = linearFactor * linearFactor * linearFactor;
  
  // For debugging
  if (typeof window !== 'undefined' && window.console) {
    console.log(`Face ${faceIndex} at position ${facePosition.toFixed(2)}, slider at ${animatedPosition.value.toFixed(2)}, factor: ${factor.toFixed(3)}`);
  }
  
  // Interpolate between base color and slider color based on factor
  const r = Math.round(baseR + (sliderR - baseR) * factor);
  const g = Math.round(baseG + (sliderG - baseG) * factor);
  const b = Math.round(baseB + (sliderB - baseB) * factor);
  const a = baseA + (sliderA - baseA) * factor;
  
  // Return the interpolated color with proper alpha
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

// Clean up animations when component is unmounted
onUnmounted(() => {
  if (animationFrameId.value !== null) {
    cancelAnimationFrame(animationFrameId.value);
  }
});

// Watch for changes in min and max props to update the initial position
watchEffect(() => {
  if (!isAnimating.value && props.modelValue === undefined) {
    // If no model value is provided, initialize to min value
    animatedPosition.value = props.min;
  }
});
</script>

<style scoped>
.happiness-slider {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.slider-wrapper {
  width: 100%;
  padding: 0 1rem;
  box-sizing: border-box;
}

.svg-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 6px;
  margin: 0.5rem auto 0;
  box-sizing: border-box;
}

.face {
  transition: color 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);
}
</style>