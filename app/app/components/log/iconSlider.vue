<template>
    <div class="icon-slider">
        <div class="slider-wrapper">
            <ESlider
                class="icon-slider-input"
                :modelValue="modelValue"
                :color="color"
                :min="min"
                :max="max"
                :max-indicators="(indicators?.maxIndicators !== undefined) ? indicators?.maxIndicators : 5"
                :precision="0"
                :color-variables="colorVariables"
                :step-indicator-style="indicators?.stepIndicatorStyle"
                :transition-speed="animation?.transitionSpeed"
                :bounceEffect="animation?.bounceEffect"
                :edge-easing-strength="animation?.edgeEasingStrength"
                @update:modelValue="updateValue"
                @update:color="updateColor"
                @slider-moving="onSliderMoving"
                @slider-stopped="onSliderStop"
            />
        </div>
        
        <div class="svg-container" ref="svgContainer">
            <!-- Iterate through the slot icons using the named slots -->
            <template v-for="(_, index) in iconSlots" :key="index">
                <div class="svg-touch-container" @click="handleFaceClick(index)">
                    <div class="icon-wrapper" :style="{color: getAnimatedIconColor(index)}">
                        <slot :name="`icon-${index}`">
                            <!-- Default icons as fallback if no slot is provided -->
                            <svg v-if="index === 0" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4"><path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/><path stroke-linecap="round" d="M31 18v1m-14-1v1m14 12s-2 4-7 4s-7-4-7-4"/></g></svg>
                            <svg v-else-if="index === 1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><!-- Icon from IconPark Outline by ByteDance - https://github.com/bytedance/IconPark/blob/master/LICENSE --><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4"><path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/><path stroke-linecap="round" d="M31 18v1m-14-1v1m0 12h14"/></g></svg>
                            <svg v-else-if="index === 2" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4"><path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/><path stroke-linecap="round" d="M31 18v1m-14-1v1m14 12s-2-4-7-4s-7 4-7 4"/></g></svg>
                        </slot>
                    </div>
                </div>
            </template>
        </div>

        <div class="descriptor-container">
            <p>{{ getCurrentDescriptor() }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watchEffect, useSlots } from 'vue';

export interface DescriptorItem {
    label: string;
    value: number;
}

export interface SliderAnimationConfig {
    bounceEffect?: 'none' | 'light' | 'medium' | 'strong';
    useHardwareAcceleration?: boolean;
    transitionSpeed?: 'instant' | 'fast' | 'normal' | 'slow' | 'very-slow';
    maxBounceDistance?: number;
    edgeEasingStrength?: 'none' | 'subtle' | 'medium' | 'strong';
}

export interface SliderIndicatorConfig {
    stepIndicatorStyle?: 'dot' | 'line' | 'numbered' | 'numbered-line';
    maxIndicators?: number;
}

export interface SliderValueConfig {
    step?: number;
    indicatorStep?: number;
    snapToNearest?: boolean;
    snapTolerance?: number;
    precision?: number;
}

export interface IconSliderProps {
    min: number;
    max: number;
    modelValue?: number;
    color?: string;
    animation?: SliderAnimationConfig;
    indicators?: SliderIndicatorConfig;
    valueConfig?: SliderValueConfig;
    descriptor?: string;
    descriptors?: string[] | DescriptorItem[];
    iconCount?: number;
}

const props = defineProps<IconSliderProps>();

const emit = defineEmits(['update:modelValue', 'update:color', 'update:icon']);

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

// Get slots to determine how many icons were provided
const slots = useSlots();

// Calculate the icon slots from named slots or fallback to default count
const iconSlots = computed(() => {
    if (props.iconCount !== undefined) {
        return Array(props.iconCount).fill(null);
    }
    
    // Check for named icon slots
    const iconSlotCount = Object.keys(slots).filter(name => name.startsWith('icon-')).length;
    
    // If no slots provided, default to 3 icons
    return Array(iconSlotCount || 3).fill(null);
});

// Process descriptors based on the input format
const processedDescriptors = computed(() => {
    if (!props.descriptors || props.descriptors.length === 0) {
        // Return default descriptor if available
        return props.descriptor ? [{ label: props.descriptor, value: props.min }] : [];
    }

    // Check if descriptors is an array of strings
    if (typeof props.descriptors[0] === 'string') {
        const stringDescriptors = props.descriptors as string[];
        const range = props.max - props.min;
        
        // Distribute descriptors evenly across the range
        return stringDescriptors.map((label, index) => {
            // Calculate value based on position in array
            const value = props.min + (range * index / (stringDescriptors.length - 1 || 1));
            return { label, value };
        });
    }
    
    return props.descriptors as DescriptorItem[];
});

const lastActiveDescriptor = ref('');

// Fixed getCurrentDescriptor function with proper Vue syntax and safety checks
const getCurrentDescriptor = () => {
    if (!processedDescriptors.value || !Array.isArray(processedDescriptors.value) || processedDescriptors.value.length === 0) {
        return props.descriptor || "No pain"; // Fallback to default
    }
    
    // Use slider's current value for finding descriptor
    const currentValue = isDragging.value || isTransitioningFromDrag.value 
        ? rawDragPosition.value 
        : animatedPosition.value;
    
    // Sort by value to ensure we compare in ascending order
    // Create a safe copy and filter out any invalid entries
    const validDescriptors = processedDescriptors.value
        .filter(d => d && typeof d === 'object' && d.label && d.value !== undefined)
        .sort((a, b) => a.value - b.value);
    
    // Safety check for empty array after filtering and sorting
    if (!validDescriptors.length) {
        return props.descriptor || "No pain";
    }
    
    // Get max value descriptor (last in sorted array)
    const maxDescriptor = validDescriptors[validDescriptors.length - 1];
    const minDescriptor = validDescriptors[0];
    
    // Define margins for end zones 
    const END_ZONE_MARGIN = 0.3; // Proximity to either end to trigger end zone behavior
    
    // Special case: End zones (near min or max) - always show extreme descriptor
    if (maxDescriptor && props.max !== undefined) {
        // Check if we're close enough to the max value to trigger the highest pain descriptor
        if (currentValue >= (props.max - END_ZONE_MARGIN)) {
            const maxLabel = maxDescriptor.label || "Worst pain imaginable";
            lastActiveDescriptor.value = maxLabel;
            return maxLabel;
        }
    }
    
    if (minDescriptor && props.min !== undefined) {
        // Check if we're close enough to the min value to trigger the lowest pain descriptor
        if (currentValue <= (props.min + END_ZONE_MARGIN)) {
            const minLabel = minDescriptor.label || "No pain";
            lastActiveDescriptor.value = minLabel;
            return minLabel;
        }
    }
    
    // Define hysteresis buffer for regular operation (away from extremes)
    const HYSTERESIS = 0.5; // Half a unit buffer
    
    // Get last active descriptor for comparison (from ref)
    const lastDescriptor = lastActiveDescriptor.value;
    
    // If we have a last active descriptor and we're not dragging, apply hysteresis
    if (lastDescriptor && !isDragging.value) {
        // Find the descriptor object that matches the last active label (with safety check)
        const lastDescriptorObj = validDescriptors.find(d => d && d.label === lastDescriptor);
        
        if (lastDescriptorObj) {
            const lastDescriptorValue = lastDescriptorObj.value;
            
            // Find index of last active descriptor (with safety check)
            const lastIndex = validDescriptors.findIndex(d => d && d.label === lastDescriptor);
            
            // Verify valid index was found
            if (lastIndex !== -1) {
                // Check if we need to change the descriptor based on current direction and buffer
                if (lastIndex < validDescriptors.length - 1) {
                    // There is a higher descriptor
                    const nextDescriptor = validDescriptors[lastIndex + 1];
                    if (nextDescriptor && typeof nextDescriptor.value === 'number') {
                        const nextDescriptorValue = nextDescriptor.value;
                        
                        // We need to exceed the next threshold by the buffer to change up
                        if (currentValue < nextDescriptorValue - HYSTERESIS) {
                            // Not enough movement to change to higher descriptor
                            
                            // Also check if we should move to a lower descriptor
                            if (lastIndex > 0) {
                                const lowerDescriptor = validDescriptors[lastIndex - 1];
                                if (lowerDescriptor && typeof lowerDescriptor.value === 'number') {
                                    const lowerDescriptorValue = lowerDescriptor.value;
                                    // Need to go below threshold minus buffer to change down
                                    if (currentValue < lowerDescriptorValue - HYSTERESIS) {
                                        // Find highest appropriate descriptor
                                        for (let i = lastIndex - 1; i >= 0; i--) {
                                            const descriptor = validDescriptors[i];
                                            if (descriptor && typeof descriptor.value === 'number' && 
                                                currentValue >= descriptor.value - HYSTERESIS) {
                                                const newLabel = descriptor.label || "No descriptor";
                                                lastActiveDescriptor.value = newLabel;
                                                return newLabel;
                                            }
                                        }
                                    }
                                }
                            }
                            
                            // Stay on current descriptor if within buffer
                            if (currentValue >= lastDescriptorValue - HYSTERESIS) {
                                return lastDescriptor;
                            }
                        }
                    }
                }
                
                if (lastIndex > 0) {
                    // There is a lower descriptor
                    const lowerDescriptor = validDescriptors[lastIndex - 1];
                    if (lowerDescriptor && typeof lowerDescriptor.value === 'number') {
                        // If we're still above the last threshold minus buffer, keep the current descriptor
                        if (currentValue >= lastDescriptorValue - HYSTERESIS) {
                            return lastDescriptor;
                        }
                    }
                }
            }
        }
    }
    
    // If dragging or no hysteresis rule applied, find appropriate descriptor without buffer
    // Find the highest threshold descriptor that the current value meets or exceeds
    for (let i = validDescriptors.length - 1; i >= 0; i--) {
        const descriptor = validDescriptors[i];
        if (descriptor && typeof descriptor.value === 'number' && currentValue >= descriptor.value) {
            const newLabel = descriptor.label || "No descriptor";
            lastActiveDescriptor.value = newLabel; // Store for hysteresis
            return newLabel;
        }
    }
    
    // If no descriptor threshold is met
    const firstDescriptor = validDescriptors[0];
    const defaultLabel = (firstDescriptor && firstDescriptor.label) || props.descriptor || "No pain";
    lastActiveDescriptor.value = defaultLabel;
    return defaultLabel;
}

onMounted(() => {
    setTimeout(() => {
        svgContainer.value = document.querySelector('.svg-container');
        if (svgContainer.value) {
            faceElements.value = Array.from(svgContainer.value.querySelectorAll('.svg-touch-container'));
        }
        
        animatedPosition.value = props.modelValue ?? props.min;
    }, 0);
});

const facePositions = computed(() => {
    const faceCount = iconSlots.value.length;
    const range = props.max - props.min;
    
    if (range === 0 || faceCount <= 1) return { 0: props.min };
    
    const positions: Record<number, number> = {};
    
    for (let i = 0; i < faceCount; i++) {
        const position = props.min + (range * i / (faceCount - 1));
        positions[i] = position;
    }
    
    return positions;
});

const updateValue = (value: number) => {
    emit('update:modelValue', value);
    emit('update:icon', getIconLevel(value));
    
    // If we're in transition from drag, update rawDragPosition to target value
    // This gives a smooth color transition as the thumb animates to the snapped position
    if (isTransitioningFromDrag.value) {
        // Start gradually updating rawDragPosition toward the target value
        // to create smooth color transition
        rawDragPosition.value = value;
    }
    
    // Always animate to new position
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

const isDragging = ref(false);
const rawDragPosition = ref(props.modelValue ?? props.min);
const isTransitioningFromDrag = ref(false);

const onSliderMoving = (position: number) => {
    rawDragPosition.value = position;
    
    if (!isDragging.value) {
        animatedPosition.value = position;
    }
    
    isDragging.value = true;
};

const onSliderStop = () => {
    isTransitioningFromDrag.value = true;
    
    setTimeout(() => {
        isDragging.value = false;
    }, 50);
};

const animateToPosition = (targetValue: number) => {
    if (animationFrameId.value !== null) {
        cancelAnimationFrame(animationFrameId.value);
        animationFrameId.value = null;
    }
    
    if (Math.abs(targetValue - animatedPosition.value) < 0.01) {
        animatedPosition.value = targetValue;
        isTransitioningFromDrag.value = false; // Clear transition flag when position is reached
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
            isTransitioningFromDrag.value = false; // Clear transition flag when animation completes
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

const getIconLevel = (value: number) => {
    const range = props.max - props.min;
    
    const faceCount = iconSlots.value.length;
    if (faceCount === 0) return 'Unknown';
    
    if (range === 0 || faceCount <= 1) return 'Emotion Level 1';
    
    const segment = range / faceCount;
    const normalizedValue = value - props.min;
    
    for (let i = 0; i < faceCount; i++) {
        if (normalizedValue <= segment * (i + 1)) {
            const emotions = ['Very Happy', 'Happy', 'Neutral'];
            return i < emotions.length ? emotions[i] : `Emotion Level ${i + 1}`;
        }
    }
    
    return `Emotion Level ${faceCount}`;
};

const getAnimatedIconColor = (faceIndex: number) => {
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
    
    // KEY CHANGE: Use raw drag position during dragging OR transition phase
    // This ensures smooth color transition when snapping after drag
    const positionForColor = (isDragging.value || isTransitioningFromDrag.value) 
        ? rawDragPosition.value 
        : animatedPosition.value;
        
    const distance = Math.abs(positionForColor - facePosition);
    
    const maxDistance = props.max - props.min;
    
    if (maxDistance === 0) {
        return positionForColor === facePosition
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

<style lang="scss" scoped>
.descriptor-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;

    margin-bottom: 1.2rem;
    font-weight: 500;

    p {
        color: v-bind(color);
        opacity: 1;
    }
} 
.icon-slider {
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
    box-sizing: border-box;
    position: relative;
    top: -0.8rem;
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

.svg-touch-container :deep(svg) {
    display: block;
    position: relative;
    width: 28px;
    height: 28px;
    transition: color 0.35s cubic-bezier(0.075, 0.82, 0.165, 1), transform 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);
    color: inherit;
}

.svg-touch-container:hover :deep(svg) {
    transform: scale(1.05);
}

.svg-touch-container:active :deep(svg) {
    transform: scale(0.90);
}

</style>