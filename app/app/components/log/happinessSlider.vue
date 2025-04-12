<template>
    <div class="happiness-slider">
        <div class="slider-wrapper">
            <ESlider
                class="happiness-slider-input"
                :modelValue="modelValue"
                :color="color"
                :min="min || 1"
                :max="max || 5"
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
            />
        </div>
        <div class="svg-container">
            <svg class="face happy-face" :style="{ color: getFaceColor('happy') }" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE --><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2s4-2 4-2M9 9h.01M15 9h.01"/></g></svg>
        
            <svg class="face neutral-face" :style="{ color: getFaceColor('neutral') }" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE --><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 15h8M8 9h2m4 0h2"/></g></svg>
        
            <svg class="face sad-face" :style="{ color: getFaceColor('sad') }" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE --><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2s-4 2-4 2m1-7h.01M15 9h.01"/></g></svg>
        </div>
    </div>
</template>
  
<script setup lang="ts">
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

const props = defineProps<HappinessSliderProps>();

const emit = defineEmits(['update:modelValue', 'update:color', 'update:happiness']);

// Create a deep clone of the indicators object to prevent reference sharing
// This is crucial to prevent all sliders from sharing the same indicators reference
const clonedIndicators = computed(() => {
  if (!props.indicators) return undefined;
  
  // Create a new object by spreading the original
  return { ...props.indicators };
});

// Color variables for the gradient effect (from your CSS variables)
const colorVariables = [
  '--pain-0', // Green for happiness
  '--pain-1',
  '--pain-2', // Yellow for neutral
  '--pain-3',
];

// Computed values for face positions
const facePositions = computed(() => {
  const rangeValue = (props.max || 10) - (props.min || 1);
  return {
    happy: props.min || 1,
    neutral: (props.min || 1) + rangeValue / 2,
    sad: props.max || 10
  };
});
  
// Update the model value when slider changes
const updateValue = (value: number) => {
  emit('update:modelValue', value);
  emit('update:happiness', getHappinessLevel(value));
};
  
// Update the color when slider changes
const updateColor = (newColor: string) => {
  emit('update:color', newColor);
};
  
// Get happiness level description based on value
const getHappinessLevel = (value: number) => {
  const minVal = props.min || 1;
  const maxVal = props.max || 10;
  const range = maxVal - minVal;
  const segment = range / 5; // Divide into 5 segments
  
  const normalizedValue = value - minVal; // Start from 0
  
  if (normalizedValue <= segment) {
    return 'Very Happy';
  } else if (normalizedValue <= segment * 2) {
    return 'Happy';
  } else if (normalizedValue <= segment * 3) {
    return 'Neutral';
  } else if (normalizedValue <= segment * 4) {
    return 'Sad';
  } else {
    return 'Very Sad';
  }
};
  
// Calculate color for the face SVGs with proper transitions between active and inactive states
const getFaceColor = (faceType: 'happy' | 'neutral' | 'sad') => {
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

  // Get the position value for this face type
  const facePosition = facePositions.value[faceType];
  
  // Calculate the distance between the slider value and this face position
  const distance = Math.abs((props.modelValue || 0) - facePosition);
  
  // Create a smooth transition factor
  // Max distance to consider is the total range
  const maxDistance = (props.max || 10) - (props.min || 1);
  
  // Calculate the factor with a non-linear curve for a more pleasing transition
  // This creates a smoother falloff (cubic easing)
  const linearFactor = Math.max(0, 1 - (distance / maxDistance));
  const factor = linearFactor * linearFactor * linearFactor;
  
  // Interpolate between base color and slider color based on factor
  const r = Math.round(baseR + (sliderR - baseR) * factor);
  const g = Math.round(baseG + (sliderG - baseG) * factor);
  const b = Math.round(baseB + (sliderB - baseB) * factor);
  const a = baseA + (sliderA - baseA) * factor;
  
  // Return the interpolated color with proper alpha
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};
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
  margin: 0 auto;
  box-sizing: border-box;
}

.face {
  transition: color 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);
}
</style>