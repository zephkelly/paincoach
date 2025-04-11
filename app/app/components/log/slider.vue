<template>
    <div class="happiness-slider">
        <div class="slider-wrapper">
            <ESlider
                v-model="sliderValue"
                v-model:color="sliderColor"
                :min="1"
                :max="5"

                :indicator-step="1"
                snap-to-nearest
                :snap-tolerance="3"

                :color-variables="colorVariables"
                :bounceEffect="'medium'"
                :showStepIndicators="true"
                step-indicator-style="numbered"
                numberFormat="integer"

                @update:modelValue="updateValue"
                @update:color="updateColor"
            />
        </div>
        <div class="svg-container">
            <svg class="face happy-face" :style="{ color: getFaceColor(1) }" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE --><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2s4-2 4-2M9 9h.01M15 9h.01"/></g></svg>
        
            <svg class="face neutral-face" :style="{ color: getFaceColor(3) }" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE --><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 15h8M8 9h2m4 0h2"/></g></svg>
        
            <svg class="face sad-face" :style="{ color: getFaceColor(5) }" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE --><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2s-4 2-4 2m1-7h.01M15 9h.01"/></g></svg>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['update:modelValue', 'update:happiness']);

const props = withDefaults(defineProps<{
    modelValue?: number;
}>(), {
    modelValue: 3 // Default to neutral
});

const sliderValue = ref(props.modelValue);
const sliderColor = ref('');
  
// Color variables for the gradient effect (from your CSS variables)
const colorVariables = [
  '--pain-0', // Green for happiness
  '--pain-1',
  '--pain-2', // Yellow for neutral
  '--pain-3',
];
  
// Update the model value when slider changes
const updateValue = (value: number) => {
  sliderValue.value = value;
  emit('update:modelValue', value);
  emit('update:happiness', getHappinessLevel(value));
};
  
// Update the color when slider changes
const updateColor = (color: string) => {
  sliderColor.value = color;
};
  
// Get happiness level description based on value
const getHappinessLevel = (value: number) => {
  switch (value) {
    case 1: return 'Very Happy';
    case 2: return 'Happy';
    case 3: return 'Neutral';
    case 4: return 'Sad';
    case 5: return 'Very Sad';
    default: return 'Neutral';
  }
};
  
// Calculate color for the face SVGs with proper transitions between active and inactive states
const getFaceColor = (facePosition: number) => {
  // Base color for inactive state - using the semi-transparent gray from your code
  // This color is #58585863 which is rgba(88, 88, 88, 0.39)
  const baseR = 88;
  const baseG = 88;
  const baseB = 88;
  const baseA = 0.39;
  
  // If no slider color yet, return base color
  if (!sliderColor.value) return `rgba(${baseR}, ${baseG}, ${baseB}, ${baseA})`;

  // Parse the rgba from sliderColor
  const rgbaMatch = sliderColor.value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d*\.?\d+))?\)/);
  if (!rgbaMatch) return `rgba(${baseR}, ${baseG}, ${baseB}, ${baseA})`;

  if (!rgbaMatch[1] || !rgbaMatch[2] || !rgbaMatch[3]) {
    return `rgba(${baseR}, ${baseG}, ${baseB}, ${baseA})`;
  }

  const sliderR = parseInt(rgbaMatch[1]);
  const sliderG = parseInt(rgbaMatch[2]);
  const sliderB = parseInt(rgbaMatch[3]);
  // Default to full opacity if not specified
  const sliderA = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1;

  // Calculate the distance between the slider value and this face position
  const distance = Math.abs(sliderValue.value - facePosition);
  
  // Create a smooth transition factor
  // Max distance to consider is 4 (from 1 to 5 on the slider)
  const maxDistance = 5;
  
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
  max-width: 500px;
  margin: 0 auto;
}

.slider-wrapper {
  padding: 0 0.45rem;
}

.svg-container {
  display: flex;
  justify-content: space-between;
  margin-top: -0.25rem;
  padding: 0;
}

.face {
  transition: color 0.3s ease;
}
</style>