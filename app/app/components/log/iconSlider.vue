<template>
    <div class="icon-slider">
        
        <div class="descriptor-container" v-if="processedDescriptors.length > 0">
            <p>{{ getCurrentDescriptor() }}</p>
        </div>
        <div class="group">
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
                    :invertColors="invertColors"
                    @update:modelValue="updateValue"
                    @update:color="updateColor"
                    @slider-moving="onSliderMoving"
                    @slider-stopped="onSliderStop"
                />
            </div>
            
            <div v-if="!noIcons" class="svg-container" ref="svgContainer">
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
        </div>

    </div>
</template>

<script setup lang="ts">
import { cubicBezier } from '@@/shared/utils/transitions/cubic'
import { debounce } from '@@/shared/utils/debounce'

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
    invertColors?: boolean;
    noIcons?: boolean;
}

const props = defineProps<IconSliderProps>();

const emit = defineEmits(['update:modelValue', 'update:color', 'update:icon']);


const slots = useSlots();

const iconSlots = computed(() => {
    if (props.iconCount !== undefined) {
        return Array(props.iconCount).fill(null);
    }
    
    const iconSlotCount = Object.keys(slots).filter(name => name.startsWith('icon-')).length;
    
    return Array(iconSlotCount || 3).fill(null);
});

const internalColor = ref(props.color);

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


const debouncedDescriptorValue = ref(props.modelValue ?? props.min);
const descriptorDebounceActive = ref(false);

const updateDebouncedDescriptorValue = debounce((value: number) => {
    debouncedDescriptorValue.value = value;
    descriptorDebounceActive.value = false;
}, 50, { trailing: true, leading: false });


const processedDescriptors = computed(() => {
    if (!props.descriptors || props.descriptors.length === 0) {
        return [];
    }

    if (typeof props.descriptors[0] === 'string') {
        const stringDescriptors = props.descriptors as string[];
        const range = props.max - props.min;
        
        return stringDescriptors.map((label, index) => {
            const value = props.min + (range * index / (stringDescriptors.length - 1 || 1));
            return { label, value };
        });
    }
    
    return props.descriptors as DescriptorItem[];
});

const lastActiveDescriptor = ref('');

const getCurrentDescriptor = () => {
    if (!processedDescriptors.value || !Array.isArray(processedDescriptors.value) || processedDescriptors.value.length === 0) {
        return props.descriptor || '"No pain"';
    }
    
    let currentValue: number;
    
    if (isDragging.value || isTransitioningFromDrag.value) {
        currentValue = rawDragPosition.value;
        
        if (!descriptorDebounceActive.value) {
            descriptorDebounceActive.value = true;
        }
        updateDebouncedDescriptorValue(currentValue);
    }
    else if (descriptorDebounceActive.value) {
        currentValue = debouncedDescriptorValue.value;
    }
    else {
        currentValue = animatedPosition.value;
    }
    
    const validDescriptors = processedDescriptors.value
        .filter(d => d && typeof d === 'object' && d.label && d.value !== undefined)
        .sort((a, b) => a.value - b.value);
    
    if (!validDescriptors.length) {
        return props.descriptor || "No pain";
    }
    
    const DESCRIPTOR_BUFFER = 0.25;
    
    for (let i = validDescriptors.length - 1; i >= 0; i--) {
        const descriptor = validDescriptors[i];
        
        if (!descriptor || typeof descriptor.value !== 'number') {
            continue;
        }
        
        if (currentValue >= descriptor.value) {
            const newLabel = descriptor.label || "No descriptor";
            lastActiveDescriptor.value = newLabel;
            return newLabel;
        }
        
        if (currentValue >= descriptor.value - DESCRIPTOR_BUFFER) {
            const newLabel = descriptor.label || "No descriptor";
            lastActiveDescriptor.value = newLabel;
            return newLabel;
        }
    }
    
    const firstDescriptor = validDescriptors[0];
    const defaultLabel = (firstDescriptor && firstDescriptor.label) || props.descriptor || "No pain";
    lastActiveDescriptor.value = defaultLabel;
    return defaultLabel;
};


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
    
    if (isTransitioningFromDrag.value) {
        rawDragPosition.value = value;
    }
    
    updateDebouncedDescriptorValue(value);
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
    internalColor.value = newColor;
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
    
    updateDebouncedDescriptorValue.flush();
    
    setTimeout(() => {
        isDragging.value = false;

        debouncedDescriptorValue.value = animatedPosition.value;
        descriptorDebounceActive.value = false;
    }, 50);
};

const animateToPosition = (targetValue: number) => {
    if (animationFrameId.value !== null) {
        cancelAnimationFrame(animationFrameId.value);
        animationFrameId.value = null;
    }
    
    if (Math.abs(targetValue - animatedPosition.value) < 0.01) {
        animatedPosition.value = targetValue;
        isTransitioningFromDrag.value = false;
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
            isTransitioningFromDrag.value = false;
            animationFrameId.value = null;
        }
    };
    
    animationFrameId.value = requestAnimationFrame(animate);
};

const getAnimatedIconColor = (faceIndex: number) => {
    const baseR = 88;
    const baseG = 88;
    const baseB = 88;
    const baseA = 0.39;
    
    if (!internalColor.value) return `rgba(${baseR}, ${baseG}, ${baseB}, ${baseA})`;

    const rgbaMatch = internalColor.value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d*\.?\d+))?\)/);
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


onMounted(() => {
    nextTick(() => {
        svgContainer.value = document.querySelector('.svg-container');
        if (svgContainer.value) {
            faceElements.value = Array.from(svgContainer.value.querySelectorAll('.svg-touch-container'));
        }
        
        animatedPosition.value = props.modelValue ?? props.min;
        debouncedDescriptorValue.value = props.modelValue ?? props.min;

        if (props.color) {
            internalColor.value = props.color;
        }
    });
});

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

watchEffect(() => {
    if (props.color) {
        internalColor.value = props.color;
    }
});
</script>

<style lang="scss" scoped>
.descriptor-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;

    margin-bottom: 1rem;
    font-weight: 500;

    p {
        color: v-bind(internalColor);
        font-size: 1rem;
        opacity: 1;
    }
} 
.icon-slider {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    height: 100%;
    flex: 1;

    .group {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;
    }
}

.slider-wrapper {
    position: relative;
    width: 100%;
    padding: 0 1rem;
    box-sizing: border-box;
    top: 0.4rem;
}

.svg-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    box-sizing: border-box;
    position: relative;
    top: -0.4rem;
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