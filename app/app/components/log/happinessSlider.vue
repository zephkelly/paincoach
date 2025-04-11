<template>
    <div class="happiness-slider">
        <div class="slider-wrapper">
            <ESlider
                class="happiness-slider-input"
                v-model="sliderValue"
                v-model:color="sliderColor"
                :min="min"
                :max="max"
                :step="step"

                :indicator-step="indicatorStep || 1"
                :snap-to-nearest="snapToNearest"
                :snap-tolerance="snapTolerance || 3"

                :color-variables="colorVariables"
                :bounceEffect="bounceEffect || 'medium'"
                :showStepIndicators="showStepIndicators"
                :step-indicator-style="stepIndicatorStyle || 'line'"
                :numberFormat="numberFormat || 'integer'"

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
import { ref, computed } from 'vue';

const emit = defineEmits(['update:modelValue', 'update:happiness']);

const props = withDefaults(defineProps<{
    modelValue?: number;
    min?: number;
    max?: number;
    step?: number;
    indicatorStep?: number;
    snapToNearest?: boolean;
    snapTolerance?: number;
    bounceEffect?: 'none' | 'light' | 'medium' | 'strong';
    showStepIndicators?: boolean;
    stepIndicatorStyle?: 'dot' | 'line' | 'numbered' | 'numbered-line';
    numberFormat?: 'decimal' | 'integer' | 'compact';
}>(), {
    modelValue: undefined,
    min: 1,
    max: 10,
    snapToNearest: true,
    showStepIndicators: true
});

// Calculate the default value based on min and max
const defaultValue = computed(() => {
    // If modelValue is provided, use it
    if (props.modelValue !== undefined) {
        return props.modelValue;
    }
    // Otherwise calculate the middle value
    return props.min + (props.max - props.min) / 2;
});

const sliderValue = ref(defaultValue.value);
const sliderColor = ref('');
  
// Color variables for the gradient effect (from your CSS variables)
const colorVariables = [
  '--pain-0', // Green for happiness
  '--pain-1',
  '--pain-2', // Yellow for neutral
  '--pain-3',
];

// Computed values for face positions
const facePositions = computed(() => {
    const range = props.max - props.min;
    return {
        happy: props.min, // Happy at minimum value
        neutral: props.min + range / 2, // Neutral in the middle
        sad: props.max // Sad at maximum value
    };
});
  
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
    const range = props.max - props.min;
    const segment = range / 5; // Divide into 5 segments
    
    const normalizedValue = value - props.min; // Start from 0
    
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

    // Get the position value for this face type
    const facePosition = facePositions.value[faceType];
    
    // Calculate the distance between the slider value and this face position
    const distance = Math.abs(sliderValue.value - facePosition);
    
    // Create a smooth transition factor
    // Max distance to consider is the total range
    const maxDistance = props.max - props.min;
    
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
    transition: color 0.3s ease;
}
</style>