<template>
    <div class="slider-container">
        <div class="slider-track" ref="track" @click="handleTrackClick">
            <div class="slider-fill" :style="{ width: fillWidth + '%', backgroundColor: currentColorValue }"></div>
            
            <template v-if="showStepIndicators">
                <div v-for="position in stepPositions" :key="position.value"
                    :class="[
                        'slider-step-indicator',
                        `slider-step-${stepIndicatorStyle}`, 
                        { 'active': indicatorPosition >= position.value, 'edge-indicator': position.percent === 2 || position.percent === 98 }
                    ]"
                    :style="getStepStyle(position)"
                    @click.stop="handleStepClick(position.value)">
                    <div v-if="stepIndicatorStyle === 'numbered' || stepIndicatorStyle === 'numbered-line'" class="slider-step-number"
                         :class="{ 
                            'active': indicatorPosition >= position.value,
                            'with-line': stepIndicatorStyle === 'numbered-line'
                         }"
                         :style="{ color: indicatorPosition >= position.value ? currentColorValue : '' }">
                        {{ formatNumber(position.value) }}
                    </div>
                </div>
            </template>
                
            <div class="slider-thumb-container" :style="{ left: thumbPosition + '%' }">
                <div class="slider-thumb-touch-target" @touchstart="startDrag" @mousedown="startDrag"></div>
                <div class="slider-thumb" ref="thumb" :style="{ backgroundColor: currentColorValue }"></div>
            </div>
        </div>
        
        <div class="slider-labels">
            <div v-for="option in options" :key="option.value" class="slider-label"
                :class="{ 'active': modelValue === option.value }"
                :style="{ color: modelValue === option.value ? currentColorValue : undefined }">
                {{ option.label }}
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
    import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';

    const isBrowser = ref(false);

    export interface SliderOption {
        value: number;
        label: string;
    }

    const props = withDefaults(defineProps<{
        modelValue?: number;
        min: number;
        max: number;
        step?: number;
        indicatorStep?: number;
        snapToNearest?: boolean;
        snapTolerance?: number;
        options?: SliderOption[];
        bounceEffect?: 'none' | 'light' | 'medium' | 'strong';
        useHardwareAcceleration?: boolean;
        transitionSpeed?: 'instant' | 'fast' | 'normal' | 'slow' | 'very-slow';
        maxBounceDistance?: number;
        colorVariables?: string[];
        showStepIndicators?: boolean;
        stepIndicatorStyle?: 'dot' | 'line' | 'numbered' | 'numbered-line';
        initialPosition?: 'min' | 'mid' | 'max';
        defaultColor?: string;
        precision?: number;
        edgeEasingStrength?: 'none' | 'subtle' | 'medium' | 'strong';
        maxIndicators?: number;
        numberFormat?: 'decimal' | 'integer' | 'compact';
    }>(), {
        modelValue: undefined,
        initialPosition: 'mid',
        bounceEffect: 'medium',
        useHardwareAcceleration: true,
        transitionSpeed: 'normal',
        maxBounceDistance: 100,
        showStepIndicators: true,
        stepIndicatorStyle: 'dot',
        defaultColor: '#888888',
        precision: -1,
        edgeEasingStrength: 'medium',
        maxIndicators: 10,
        snapToNearest: false,
        snapTolerance: 5,
        numberFormat: 'decimal'
    });

    const emit = defineEmits(['update:modelValue', 'update:color']);

    const track = ref<HTMLElement | null>(null);
    const thumb = ref<HTMLElement | null>(null);
    const isDragging = ref(false);
    const isInitialized = ref(false);

    const initialValue = computed(() => {
        if (props.modelValue !== undefined) {
            return props.modelValue;
        }

        switch (props.initialPosition) {
            case 'min':
                return props.min;
            case 'max':
                return props.max;
            case 'mid': 
            default:
                if (props.options && props.options.length > 0) {
                    const middleIndex = Math.floor(props.options.length / 2);
                    return props.options[middleIndex]?.value ?? (props.min + (props.max - props.min) / 2);
                }
                return props.min + (props.max - props.min) / 2;
        }
    });

    const currentValue = ref(initialValue.value);
    const dragValue = ref(initialValue.value);
    const visualPosition = ref(initialValue.value);
    const isAnimating = ref(false);
    const startingPosition = ref(initialValue.value);
    const targetPosition = ref(initialValue.value);

    const indicatorPosition = computed(() => {
        return isDragging.value ? dragValue.value : currentValue.value;
    });

    const range = computed(() => props.max - props.min);

    const fillWidth = computed(() => {
        let percent = ((visualPosition.value - props.min) / range.value) * 100;
        
        if (percent <= 0) {
            percent = 0;
        }
        else if (percent >= 100) {
            percent = 100;
        }
        
        // The fill width should span the full width, not constrained by padding
        return percent;
    });

    const visualPadding = 1.5; // Visual padding percentage on each side
    
    const thumbPosition = computed(() => {
        // Calculate the normal percentage
        let percent = ((visualPosition.value - props.min) / range.value) * 100;
        
        // Clamp the percent to 0-100 range
        if (percent <= 0) {
            percent = 0;
        }
        else if (percent >= 100) {
            percent = 100;
        }
        
        // Map the 0-100 range to visualPadding-(100-visualPadding) range 
        return visualPadding + ((100 - (visualPadding * 2)) * percent / 100);
    });

    const getCssVarValue = (varName: string): string => {
        if (!isBrowser.value) return props.defaultColor;
        try {
            return window.getComputedStyle(document.documentElement).getPropertyValue(varName.trim()) || props.defaultColor;
        }
        catch (e) {
            return props.defaultColor;
        }
    };

    function interpolateColors(color1: string, color2: string, factor: number): string {
        if (!isBrowser.value) return props.defaultColor;
        
        const parseColor = (color: string) => {
            color = color.trim();
            
            if (color.startsWith('#')) {
                const hex = color.substring(1);
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);
                return { r, g, b, a: 1 };
            }
            
            const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d*\.?\d+))?\)/);
            if (rgbMatch) {
                if (!rgbMatch[1] || !rgbMatch[2] || !rgbMatch[3]) {
                    return { r: 79, g: 70, b: 229, a: 1 };
                }
                return {
                    r: parseInt(rgbMatch[1]),
                    g: parseInt(rgbMatch[2]),
                    b: parseInt(rgbMatch[3]),
                    a: rgbMatch[4] ? parseFloat(rgbMatch[4]) : 1
                };
            }
            
            return { r: 79, g: 70, b: 229, a: 1 };
        };
        
        const c1 = parseColor(color1);
        const c2 = parseColor(color2);
        
        const r = Math.round(c1.r + factor * (c2.r - c1.r));
        const g = Math.round(c1.g + factor * (c2.g - c1.g));
        const b = Math.round(c1.b + factor * (c2.b - c1.b));
        const a = c1.a + factor * (c2.a - c1.a);
        
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    const currentColorValue = computed(() => {
        if (!isBrowser.value || !props.colorVariables || props.colorVariables.length === 0) {
            return props.defaultColor;
        }
        
        const normalizedPosition = (visualPosition.value - props.min) / range.value;
        
        if (!props.colorVariables[0]) {
            return props.defaultColor;
        }
        
        const segmentCount = props.colorVariables.length - 1;
        if (segmentCount <= 0) {
            return getCssVarValue(props.colorVariables[0]);
        }
        
        const weightFactor = 0.18;
        
        let adjustedPosition;
        if (normalizedPosition < weightFactor) {
            adjustedPosition = (normalizedPosition / weightFactor) * 0.15;
        } else {
            adjustedPosition = 0.15 + ((normalizedPosition - weightFactor) / (1 - weightFactor)) * 0.85;
        }
        
        const segmentPosition = adjustedPosition * segmentCount;
        const segmentIndex = Math.min(Math.floor(segmentPosition), segmentCount - 1);
        const segmentProgress = segmentPosition - segmentIndex;
        
        const currColorVar = props.colorVariables[segmentIndex];
        const nextColorVar = props.colorVariables[segmentIndex + 1];
        
        if (!currColorVar || !nextColorVar) {
            return props.defaultColor;
        }
        
        const color1 = getCssVarValue(currColorVar);
        const color2 = getCssVarValue(nextColorVar);
        
        return interpolateColors(color1, color2, segmentProgress);
    });

    const formatNumber = (value: number): string => {
        if (props.numberFormat === 'integer') {
            return Math.round(value).toString();
        } else if (props.numberFormat === 'compact') {
            if (!isBrowser.value) return value.toString();
            try {
                return new Intl.NumberFormat('en', { 
                    notation: 'compact',
                    maximumFractionDigits: 1 
                }).format(value);
            } catch (e) {
                return value.toString();
            }
        } else {
            const precision = props.precision >= 0 ? props.precision : 1;
            return value.toFixed(precision);
        }
    };

    const getStepStyle = (position: { value: number, percent: number }) => {
        const isActive = indicatorPosition.value >= position.value;
        
        if (props.stepIndicatorStyle === 'line' || props.stepIndicatorStyle === 'numbered-line') {
            return {
                left: `${position.percent}%`,
                backgroundColor: isActive ? currentColorValue.value : undefined
            };
        }
        else if (props.stepIndicatorStyle === 'numbered') {
            return {
                left: `${position.percent}%`,
                backgroundColor: 'transparent'
            };
        }
        else {
            return { 
                left: position.percent + '%'
            };
        }
    };

    const stepPositions = computed(() => {
        const positions: { value: number, percent: number }[] = [];
        
        let stepValues: number[] = [];
        
        if (props.options && props.options.length > 0) {
            stepValues = props.options.map(opt => opt.value);
        }
        else {
            const stepToUse = props.indicatorStep !== undefined ? props.indicatorStep : (props.step || 0);
            
            if (stepToUse > 0) {
                const stepCount = Math.floor((props.max - props.min) / stepToUse) + 1;
                
                let effectiveStepCount = stepCount;
                let effectiveStep = stepToUse;
                
                if (stepCount > props.maxIndicators) {
                    effectiveStepCount = props.maxIndicators;
                    effectiveStep = (props.max - props.min) / (effectiveStepCount - 1);
                }
                
                for (let i = 0; i < effectiveStepCount; i++) {
                    const value = props.min + (i * effectiveStep);
                    if (value <= props.max) {
                        stepValues.push(value);
                    }
                }
                
                if (stepValues[stepValues.length - 1] !== props.max) {
                    stepValues[stepValues.length - 1] = props.max;
                }
            }
            else {
                stepValues = [props.min, props.max];
            }
        }
        
        stepValues.forEach((value, index) => {
            // Calculate base percentage
            let percent = ((value - props.min) / range.value) * 100;
            
            // Map to the visual padded range for step indicators
            percent = visualPadding + ((100 - (visualPadding * 2)) * percent / 100);
            
            // Special handling for first and last indicators
            if (index === 0) {
                percent = visualPadding; // First step at left padding
            } else if (index === stepValues.length - 1) {
                percent = 100 - visualPadding; // Last step at right padding
            }
            
            positions.push({ value, percent });
        });
        
        return positions;
    });

    const roundToPrecision = (value: number): number => {
        if (props.precision < 0) return value;
        
        const factor = Math.pow(10, props.precision);
        return Math.round(value * factor) / factor;
    };

    const handleStepClick = (value: number) => {
        if (!isBrowser.value) return;
        
        updateModelValue(value);
    };

    const startDrag = (event: MouseEvent | TouchEvent) => {
        if (!isBrowser.value) return;
        
        if (animationFrameId.value !== null) {
            cancelAnimationFrame(animationFrameId.value);
            animationFrameId.value = null;
        }
        
        event.preventDefault();
        isDragging.value = true;
        dragValue.value = currentValue.value;
        
        document.addEventListener('mousemove', onDrag, { passive: false });
        document.addEventListener('touchmove', onDrag, { passive: false });
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchend', stopDrag);
        
        onDrag(event);
    };

    const onDrag = (event: MouseEvent | TouchEvent) => {
        if (!isBrowser.value || !isDragging.value || !track.value) return;
        
        const trackRect = track.value.getBoundingClientRect();
        let clientX: number;
        
        if ('touches' in event) {
            if (!event.touches[0]) return;
            clientX = event.touches[0].clientX;
            event.preventDefault();
        }
        else {
            clientX = event.clientX;
        }
        
        // Calculate percentage on the full track width
        let percentage = (clientX - trackRect.left) / trackRect.width;
        percentage = Math.max(0, Math.min(1, percentage));
        
        let newValue = props.min + percentage * range.value;
        newValue = Math.max(props.min, Math.min(props.max, newValue));
        
        dragValue.value = newValue;
        visualPosition.value = newValue;
        updateModelValue(newValue);
    };

    const stopDrag = () => {
        if (!isBrowser.value || !isDragging.value) return;
        
        isDragging.value = false;
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('touchmove', onDrag);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchend', stopDrag);
        
        snapToNearestValue();
    };

    const updateModelValue = (value: number) => {
        const roundedValue = roundToPrecision(value);
        currentValue.value = roundedValue;
        
        emit('update:modelValue', roundedValue);
        
        startingPosition.value = visualPosition.value;
        targetPosition.value = roundedValue;
        animateToValue(roundedValue);
    };

    const snapToNearestValue = () => {
        if (!isBrowser.value) return;
        
        let snappedValue = dragValue.value;
        
        const edgeThreshold = range.value * 0.02;
        
        if (Math.abs(snappedValue - props.min) < edgeThreshold) {
            snappedValue = props.min;
        } else if (Math.abs(snappedValue - props.max) < edgeThreshold) {
            snappedValue = props.max;
        } else {
            if (props.options && props.options.length > 0) {
                const optionValues = props.options.map(opt => opt.value);
                snappedValue = optionValues.reduce((prev, curr) => 
                    Math.abs(curr - dragValue.value) < Math.abs(prev - dragValue.value) ? curr : prev
                );
            } 
            else if (props.step) {
                const steps = Math.round((dragValue.value - props.min) / props.step);
                snappedValue = props.min + (steps * props.step);
                snappedValue = Math.max(props.min, Math.min(props.max, snappedValue));
            }
            else if (props.snapToNearest && props.indicatorStep && props.showStepIndicators) {
                const indicatorValues = stepPositions.value.map(pos => pos.value);
                
                let nearestValue = indicatorValues[0] || props.min;
                let minDistance = Math.abs(nearestValue - dragValue.value);
                
                for (let i = 1; i < indicatorValues.length; i++) {
                    const indicatorValue = indicatorValues[i];
                    if (!indicatorValue) continue;
                    const distance = Math.abs(indicatorValue - dragValue.value);
                    if (distance < minDistance) {
                        minDistance = distance;
                        nearestValue = indicatorValue;
                    }
                }
                
                const toleranceThreshold = (props.max - props.min) * (props.snapTolerance / 100);
                
                if (minDistance <= toleranceThreshold) {
                    snappedValue = nearestValue;
                }
            }
        }
        
        snappedValue = roundToPrecision(snappedValue);
        
        updateModelValue(snappedValue);
    };

    const animationFrameId = ref<number | null>(null);
    const ANIMATION_PRECISION = 0.001;

    const getSpringParams = computed(() => {
        let baseStiffness: number;
        let baseDamping: number;
        
        switch(props.bounceEffect) {
            case 'none':
                baseStiffness = 180;
                baseDamping = 1.0;
                break;
            case 'light':
                baseStiffness = 120;
                baseDamping = 0.7;
                break;
            case 'medium':
                baseStiffness = 90;
                baseDamping = 0.55;
                break;
            case 'strong':
                baseStiffness = 70;
                baseDamping = 0.4;
                break;
            default:
                baseStiffness = 90;
                baseDamping = 0.55;
        }
        
        let speedMultiplier: number;
        switch(props.transitionSpeed) {
            case 'instant':
                speedMultiplier = 1.5;
                break;
            case 'fast':
                speedMultiplier = 1.2;
                break;
            case 'normal':
                speedMultiplier = 1.0;
                break;
            case 'slow':
                speedMultiplier = 0.7;
                break;
            case 'very-slow':
                speedMultiplier = 0.4;
                break;
            default:
                speedMultiplier = 1.0;
        }
        
        return {
            stiffness: baseStiffness * speedMultiplier,
            damping: baseDamping
        };
    });

    const getEdgeEasingFactor = computed(() => {
        const edgeEasingStrength = props.edgeEasingStrength || 'medium';
       
        switch(edgeEasingStrength) {
            case 'none':
                return 0;
            case 'subtle':
                return 0.3;
            case 'medium':
                return 0.6;
            case 'strong':
                return 1.2;
            default:
                return 0.6;
        }
    });

    const animateToValue = (targetValue: number) => {
        if (!isBrowser.value) return;
        
        if (isAnimating.value) {
            if (animationFrameId.value !== null) {
                cancelAnimationFrame(animationFrameId.value);
            }
            isAnimating.value = false;
        }
        
        if (Math.abs(targetValue - visualPosition.value) < ANIMATION_PRECISION) {
            visualPosition.value = targetValue;
            return;
        }
        
        isAnimating.value = true;
        
        let velocity = 0;
        let lastTimestamp: number | null = null;
        
        animationFrameId.value = requestAnimationFrame(performSpringAnimation);
        
        function performSpringAnimation(timestamp: number) {
            if (!isAnimating.value) return;
            
            if (lastTimestamp === null) {
                lastTimestamp = timestamp;
                animationFrameId.value = requestAnimationFrame(performSpringAnimation);
                return;
            }
            
            const deltaTime = Math.min((timestamp - lastTimestamp) / 1000, 0.064);
            lastTimestamp = timestamp;
            
            const displacement = targetValue - visualPosition.value;
            
            if (Math.abs(displacement) < ANIMATION_PRECISION && Math.abs(velocity) < ANIMATION_PRECISION) {
                visualPosition.value = targetValue;
                isAnimating.value = false;
                
                if (targetValue === props.min || targetValue === props.max) {
                    visualPosition.value = targetValue;
                }
                return;
            }
            
            let { stiffness, damping } = getSpringParams.value;
            
            const totalDistance = Math.abs(targetValue - startingPosition.value);
            const currentDistance = Math.abs(displacement);
            const progressRatio = totalDistance > 0 ? 1 - (currentDistance / totalDistance) : 1;
            
            const progressiveDamping = damping + (1 - damping) * Math.pow(progressRatio, 1.5) * 0.4;
            
            const criticalDampingFactor = 2 * Math.sqrt(stiffness);
            
            const springForce = displacement * stiffness;
            
            const dampingForce = -velocity * progressiveDamping * criticalDampingFactor;
            
            const acceleration = springForce + dampingForce;
            velocity += acceleration * deltaTime;
            
            let newPosition = visualPosition.value + velocity * deltaTime;

            const edgeEasingFactor = getEdgeEasingFactor.value;
            
            if (edgeEasingFactor > 0) {
                const edgeProximityThreshold = range.value * 0.15;
                
                const isNearMinEdge = newPosition < props.min + edgeProximityThreshold;
                const isNearMaxEdge = newPosition > props.max - edgeProximityThreshold;
                
                if (isNearMinEdge || isNearMaxEdge) {
                    let edgeDistance;
                    
                    if (isNearMinEdge) {
                        edgeDistance = (newPosition - props.min) / edgeProximityThreshold;
                    } else {
                        edgeDistance = (props.max - newPosition) / edgeProximityThreshold;
                    }
                    
                    edgeDistance = Math.max(0, Math.min(1, edgeDistance));
                    
                    const easingFactor = Math.pow(edgeDistance, 2.8);
                    
                    const dampingStrength = edgeEasingFactor * 0.15;
                    const edgeDampingFactor = 1 + (dampingStrength * (1 - easingFactor));
                    
                    velocity /= edgeDampingFactor;
                    
                    if (edgeDistance < 0.15) {
                        const movingTowardEdge = isNearMinEdge ? velocity < 0 : velocity > 0;
                    }
                }
            }
            
            if (props.bounceEffect !== 'none') {
                const bounceFactor = 
                    props.bounceEffect === 'light' ? 0.2 :
                    props.bounceEffect === 'medium' ? 0.35 :
                    props.bounceEffect === 'strong' ? 0.5 : 0;
                
                const overshoot = (targetValue - newPosition) * (targetValue - startingPosition.value) < 0 
                    ? Math.abs(newPosition - targetValue) : 0;
                
                if (overshoot > 0) {
                    const maxBounceDistance = props.maxBounceDistance || 100;
                    const maxOvershoot = range.value * (maxBounceDistance / 1000);
                    
                    if (overshoot > maxOvershoot * bounceFactor) {
                        const resistanceFactor = 1 - (1 - Math.exp(-(overshoot - maxOvershoot * bounceFactor) / (maxOvershoot * (1 - bounceFactor)))) * 0.8;
                        
                        velocity *= resistanceFactor;
                        
                        newPosition = visualPosition.value + velocity * deltaTime;
                    }
                }
            }
            
            newPosition = Math.max(props.min, Math.min(props.max, newPosition));
            
            visualPosition.value = newPosition;
            
            animationFrameId.value = requestAnimationFrame(performSpringAnimation);
        }
    };

    const handleTrackClick = (event: MouseEvent) => {
        if (!isBrowser.value || !track.value) return;
        
        const trackRect = track.value.getBoundingClientRect();
        const percentage = (event.clientX - trackRect.left) / trackRect.width;
        
        let newValue;
        
        if (percentage <= 0.02) {
            newValue = props.min;
        } else if (percentage >= 0.98) {
            newValue = props.max;
        } else {
            newValue = props.min + percentage * range.value;
            newValue = Math.max(props.min, Math.min(props.max, newValue));
        }
        
        dragValue.value = newValue;
        snapToNearestValue();
    };

    watch(() => props.modelValue, (newValue) => {
        if (newValue !== undefined) {
            if (!isDragging.value) {
                currentValue.value = newValue;
                
                startingPosition.value = visualPosition.value;
                targetPosition.value = newValue;
                
                if (isBrowser.value) {
                    animateToValue(newValue);
                } else {
                    visualPosition.value = newValue;
                }
            }
        }
    });

    watch(() => currentColorValue.value, (newColor) => {
        emit('update:color', newColor);
    });

    onMounted(() => {
        nextTick(() => {
            isBrowser.value = true;
            
            const initialVal = initialValue.value;
            visualPosition.value = initialVal;
            startingPosition.value = initialVal;
            targetPosition.value = initialVal;
            currentValue.value = initialVal;
            
            if (props.modelValue === undefined) {
                updateModelValue(initialVal);
            }
            
            isInitialized.value = true;
            
            nextTick(() => {
                emit('update:color', currentColorValue.value);
            });
        });
    });

    onUnmounted(() => {
        if (!isBrowser.value) return;
        
        if (animationFrameId.value !== null) {
            cancelAnimationFrame(animationFrameId.value);
        }
        isAnimating.value = false;
        
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
    -webkit-tap-highlight-color: transparent;
    touch-action: none;
}

.slider-track {
    position: relative;
    height: 8px;
    width: 100%;
    background-color: var(--pain-none, #e0e0e0);
    border-radius: 4px;
    cursor: pointer;
    will-change: contents;
    width: 100%;
}

.slider-track-inner {
    position: relative;
    height: 100%;
    width: 100%;
    border-radius: 4px;
}

.slider-fill {
    position: absolute;
    height: 100%;
    border-radius: 4px;
    pointer-events: none;
    will-change: width, background-color;
    transition: background-color 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);
}

.slider-thumb-container {
    position: absolute;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
    z-index: 2;
    will-change: left, transform;
    -webkit-backface-visibility: hidden;
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
}

.slider-thumb {
    position: absolute;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: box-shadow 0.2s, background-color 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);
    -webkit-backface-visibility: hidden;
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
    transition: color 0.35s cubic-bezier(0.075, 0.82, 0.165, 1), font-weight 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);
    text-align: center;
}

.slider-label.active {
    font-weight: 600;
}

.slider-step-indicator {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    transition: background-color 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);
}

.slider-step-indicator.slider-step-numbered-line {
    .slider-step-number {
        left: -3px;
    }
}

.slider-step-dot {
    width: 4px;
    height: 4px;
    background-color: var(--pain-none, #e0e0e0);
    border-radius: 50%;
}

.slider-step-dot.active {
    background-color: var(--pain-none, #e0e0e0);
}

.slider-step-line {
    width: 2px;
    height: 8px;
    border-radius: 1px;
    background-color: var(--pain-none, #e0e0e0);
    top: -12px;
    transform: translate(-50%, 0);
}

.slider-step-line.active {
    background-color: currentColor;
}

.slider-step-numbered {
    width: auto;
    height: auto;
    background-color: transparent !important;
    top: 0;
    transform: translate(-50%, -50%);
    cursor: pointer;
}

.slider-step-numbered-line {
    width: 2px;
    height: 8px;
    border-radius: 1px;
    background-color: var(--pain-none, #e0e0e0);
    top: -8px;
    transform: translate(-50%, 0);
    cursor: pointer;
}

.slider-step-number {
    font-size: 0.8rem;
    font-family: var(--inter-font-family);
    color: var(--pain-none, #e0e0e0);
    font-weight: 600;
    text-align: center;
    line-height: 1.2;
    transition: color 0.35s cubic-bezier(0.075, 0.82, 0.165, 1), font-weight 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);
    position: relative;
    top: -22px;
    left: -1px;
}

.slider-step-numbered-line.active {
    background-color: currentColor;
}
</style>