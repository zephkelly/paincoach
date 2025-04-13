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
        <div class="svg-container" ref="svgContainer">
            <div class="svg-touch-container" @click="handleFaceClick(0)">
                <svg :style="{color: getAnimatedFaceColor(0)}" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4"><path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/><path stroke-linecap="round" d="M31 18v1m-14-1v1m14 12s-2 4-7 4s-7-4-7-4"/></g></svg>
            </div>
            <div class="svg-touch-container" @click="handleFaceClick(1)">
                <svg :style="{color: getAnimatedFaceColor(1)}" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4"><path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/><path stroke-linecap="round" d="M31 18v1m-14-1v1m14 12s-2-4-7-4s-7 4-7 4"/></g></svg>
            </div>
            <div class="svg-touch-container" @click="handleFaceClick(2)">
                <svg :style="{color: getAnimatedFaceColor(2)}" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4"><path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/><path stroke-linecap="round" d="m33 25l-4-2m-11 0l-4 2m17 10s-2-4-7-4s-7 4-7 4"/></g></svg>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watchEffect } from 'vue';

export interface SliderAnimationConfig {
    bounceEffect?: 'none' | 'light' | 'medium' | 'strong';
    useHardwareAcceleration?: boolean;
    transitionSpeed?: 'instant' | 'fast' | 'normal' | 'slow' | 'very-slow';
    maxBounceDistance?: number;
    edgeEasingStrength?: 'none' | 'subtle' | 'medium' | 'strong';
}

export interface SliderIndicatorConfig {
    showStepIndicators?: boolean;
    stepIndicatorStyle?: 'dot' | 'line' | 'numbered' | 'numbered-line';
    maxIndicators?: number;
    numberFormat?: 'decimal' | 'integer' | 'compact';
}

export interface SliderValueConfig {
    step?: number;
    indicatorStep?: number;
    snapToNearest?: boolean;
    snapTolerance?: number;
    precision?: number;
}

export interface HappinessSliderProps {
    modelValue?: number;
    color?: string;
    min?: number;
    max?: number;
    animation?: SliderAnimationConfig;
    indicators?: SliderIndicatorConfig;
    valueConfig?: SliderValueConfig;
}

const props = withDefaults(defineProps<HappinessSliderProps>(), {
    min: 0,
    max: 10,
});

const emit = defineEmits(['update:modelValue', 'update:color', 'update:happiness']);

const colorVariables = [
    '--pain-0',
    '--pain-1',
    '--pain-2',
    '--pain-3',
];

const svgContainer = ref<HTMLElement | null>(null);
const faceElements = ref<Element[]>([]);

const animatedPosition = ref(props.modelValue ?? props.min);
const isAnimating = ref(false);
const animationFrameId = ref<number | null>(null);
let animationStartTime = 0;
const ANIMATION_DURATION = 350;

onMounted(() => {
    setTimeout(() => {
        svgContainer.value = document.querySelector('.svg-container');
        if (svgContainer.value) {
            faceElements.value = Array.from(svgContainer.value.querySelectorAll('svg'));
        }
        
        animatedPosition.value = props.modelValue ?? props.min;
    }, 0);
});

const facePositions = computed(() => {
    const faceCount = faceElements.value.length || 3;
    
    const min = props.min;
    const max = props.max;
    const range = max - min;
    
    if (range === 0 || faceCount <= 1) return { 0: min };
    
    const positions: Record<number, number> = {};
    
    for (let i = 0; i < faceCount; i++) {
        const position = min + (range * i / (faceCount - 1));
        positions[i] = position;
    }
    
    return positions;
});

const updateValue = (value: number) => {
    emit('update:modelValue', value);
    emit('update:happiness', getHappinessLevel(value));
    
    animateToPosition(value);
};

const handleFaceClick = (faceIndex: number) => {
    const positions = facePositions.value;
    const position = positions[faceIndex];
    
    if (position !== undefined) {
        updateValue(position);
    }
};

const updateColor = (newColor: string) => {
    emit('update:color', newColor);
};

const onSliderMoving = (position: number) => {
    animatedPosition.value = position;
};

const animateToPosition = (targetValue: number) => {
    if (animationFrameId.value !== null) {
        cancelAnimationFrame(animationFrameId.value);
        animationFrameId.value = null;
    }
    
    if (Math.abs(targetValue - animatedPosition.value) < 0.01) {
        animatedPosition.value = targetValue;
        return;
    }
    
    isAnimating.value = true;
    animationStartTime = performance.now();
    const startPosition = animatedPosition.value;
    const positionDelta = targetValue - startPosition;
    
    const animate = (timestamp: number) => {
        const elapsed = timestamp - animationStartTime;
        const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
        
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

const cubicBezier = (x1: number, y1: number, x2: number, y2: number, t: number): number => {
    const cx = 3 * x1;
    const bx = 3 * (x2 - x1) - cx;
    const ax = 1 - cx - bx;
    
    const cy = 3 * y1;
    const by = 3 * (y2 - y1) - cy;
    const ay = 1 - cy - by;
    
    let x = t, i = 0;
    while (i < 5) {
        const xTm = x * (cx + x * (bx + x * ax));
        if (Math.abs(xTm - t) < 0.001) break;
        x = x - (xTm - t) / (cx + x * (2 * bx + 3 * ax * x));
        i++;
    }
    
    return x * (cy + x * (by + x * ay));
};

const getHappinessLevel = (value: number) => {
    const minVal = props.min;
    const maxVal = props.max;
    const range = maxVal - minVal;
    
    const faceCount = faceElements.value.length || 3;
    if (faceCount === 0) return 'Unknown';
    
    if (range === 0 || faceCount <= 1) return 'Emotion Level 1';
    
    const segment = range / faceCount;
    const normalizedValue = value - minVal;
    
    for (let i = 0; i < faceCount; i++) {
        if (normalizedValue <= segment * (i + 1)) {
            const emotions = ['Very Happy', 'Happy', 'Neutral'];
            return i < emotions.length ? emotions[i] : `Emotion Level ${i + 1}`;
        }
    }
    
    return `Emotion Level ${faceCount}`;
};

const getAnimatedFaceColor = (faceIndex: number) => {
    const baseR = 88;
    const baseG = 88;
    const baseB = 88;
    const baseA = 0.39;
    
    if (!props.color) return `rgba(${baseR}, ${baseG}, ${baseB}, ${baseA})`;

    const rgbaMatch = props.color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d*\.?\d+))?\)/);
    if (!rgbaMatch) return `rgba(${baseR}, ${baseG}, ${baseB}, ${baseA})`;

    if (!rgbaMatch[1] || !rgbaMatch[2] || !rgbaMatch[3]) {
        return `rgba(${baseR}, ${baseG}, ${baseB}, ${baseA})`;
    }

    const sliderR = parseInt(rgbaMatch[1]);
    const sliderG = parseInt(rgbaMatch[2]);
    const sliderB = parseInt(rgbaMatch[3]);
    const sliderA = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1;

    const positions = facePositions.value;
    if (!positions[faceIndex] && positions[faceIndex] !== 0) {
        return `rgba(${baseR}, ${baseG}, ${baseB}, ${baseA})`;
    }
    
    const facePosition = positions[faceIndex];
    
    const distance = Math.abs(animatedPosition.value - facePosition);
    
    const maxDistance = props.max - props.min;
    
    if (maxDistance === 0) {
        return animatedPosition.value === facePosition
            ? `rgba(${sliderR}, ${sliderG}, ${sliderB}, ${sliderA})`
            : `rgba(${baseR}, ${baseG}, ${baseB}, ${baseA})`;
    }
    
    const linearFactor = Math.max(0, 1 - (distance / maxDistance));
    const factor = linearFactor * linearFactor * linearFactor;
    
    const r = Math.round(baseR + (sliderR - baseR) * factor);
    const g = Math.round(baseG + (sliderG - baseG) * factor);
    const b = Math.round(baseB + (sliderB - baseB) * factor);
    const a = baseA + (sliderA - baseA) * factor;
    
    return `rgba(${r}, ${g}, ${b}, ${a})`;
};

onUnmounted(() => {
    if (animationFrameId.value !== null) {
        cancelAnimationFrame(animationFrameId.value);
    }
});

watchEffect(() => {
    if (!isAnimating.value && props.modelValue === undefined) {
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
    box-sizing: border-box;
}

.svg-touch-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 44px;
    height: 44px;
    position: relative;
    cursor: pointer;
    border-radius: 50%;
}

.svg-touch-container svg {
    display: block;
    transition: color 0.35s cubic-bezier(0.075, 0.82, 0.165, 1), transform 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);
}

.svg-touch-container:hover svg {
    transform: scale(1.05);
}

.svg-touch-container:active svg {
    transform: scale(0.90);
}
</style>