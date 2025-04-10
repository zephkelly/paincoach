<template>
    <div class="slider-container">
      <div class="slider-track" ref="track" @click="handleTrackClick">
        <div class="slider-fill" :style="{ width: fillWidth + '%', backgroundColor: currentColorValue }"></div>
        
        <template v-if="showStepIndicators">
          <div v-for="position in stepPositions" :key="position.value"
            :class="[
              'slider-step-indicator',
              `slider-step-${stepIndicatorStyle}`, 
              { 'active': visualPosition >= position.value, 'edge-indicator': position.percent === 2 || position.percent === 98 }
            ]"
            :style="getStepStyle(position)">
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
  
  export interface QuestionOption {
    value: number;
    label: string;
  }
  
  const props = withDefaults(defineProps<{
    modelValue?: number;
    min: number;
    max: number;
    step?: number;
    options?: QuestionOption[];
    bounceEffect?: 'none' | 'light' | 'medium' | 'strong';
    useHardwareAcceleration?: boolean;
    transitionSpeed?: 'instant' | 'fast' | 'normal' | 'slow' | 'very-slow';
    maxBounceDistance?: number;
    colorVariables?: string[];
    showStepIndicators?: boolean;
    stepIndicatorStyle?: 'dot' | 'line';
    initialPosition?: 'min' | 'mid' | 'max';
    defaultColor?: string;
  }>(), {
    modelValue: undefined,
    initialPosition: 'mid',
    bounceEffect: 'medium',
    useHardwareAcceleration: true,
    transitionSpeed: 'normal',
    maxBounceDistance: 100,
    showStepIndicators: true,
    stepIndicatorStyle: 'dot',
    defaultColor: '#888888'
  });
  
  const emit = defineEmits(['update:modelValue']);
  
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
  
  const range = computed(() => props.max - props.min);
  
  const fillWidth = computed(() => {
    let percent = ((visualPosition.value - props.min) / range.value) * 100;
    
    if (percent <= 0) {
      percent = 0;
    } else if (percent >= 100) {
      percent = 98;
    }
    
    return percent;
  });
  
  const thumbPosition = computed(() => {
    let percent = ((visualPosition.value - props.min) / range.value) * 100;
    
    if (percent <= 0) {
      percent = 1;
    } else if (percent >= 100) {
      percent = 99;
    }
    
    return percent;
  });
  
  const getCssVarValue = (varName: string): string => {
    if (!isBrowser.value) return props.defaultColor;
    try {
      return window.getComputedStyle(document.documentElement).getPropertyValue(varName.trim()) || props.defaultColor;
    } catch (e) {
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
    
    const segmentPosition = normalizedPosition * segmentCount;
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
  
  const getStepStyle = (position: { value: number, percent: number }) => {
    const isActive = visualPosition.value >= position.value;
    
    if (props.stepIndicatorStyle === 'line') {
      return {
        left: `${position.percent}%`,
        ...(isActive ? { backgroundColor: currentColorValue.value } : {})
      };
    } else {
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
    } else if (props.step) {
      const stepCount = Math.floor((props.max - props.min) / props.step) + 1;
      
      let effectiveStepCount = stepCount;
      let effectiveStep = props.step;
      
      if (stepCount > 10) {
        effectiveStepCount = 10;
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
    } else {
      stepValues = [props.min, props.max];
    }
    
    stepValues.forEach((value, index) => {
      let percent = ((value - props.min) / range.value) * 100;
      
      if (index === 0 && percent === 0) {
        percent = 1;
      } else if (index === stepValues.length - 1 && percent === 100) {
        percent = 99;
      }
      
      positions.push({ value, percent });
    });
    
    return positions;
  });
  
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
    } else {
      clientX = event.clientX;
    }
    
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
    currentValue.value = value;
    emit('update:modelValue', value);
  };
  
  const snapToNearestValue = () => {
    if (!isBrowser.value) return;
    
    let snappedValue = dragValue.value;
    
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
    
    updateModelValue(snappedValue);
    
    startingPosition.value = visualPosition.value;
    targetPosition.value = snappedValue;
    
    animateToValue(snappedValue);
  };
  
  const animationFrameId = ref<number | null>(null);
  const ANIMATION_PRECISION = 0.005;
  
  const animateToValue = (targetValue: number) => {
    if (!isBrowser.value) return;
    
    if (isAnimating.value) {
      if (animationFrameId.value !== null) {
        cancelAnimationFrame(animationFrameId.value);
      }
      isAnimating.value = false;
    }
    
    if (Math.abs(targetValue - visualPosition.value) < 0.01) {
      visualPosition.value = targetValue;
      return;
    }
    
    isAnimating.value = true;
    
    let velocity = 0;
    let lastTimestamp: number | null = null;
    
    const distancePercentage = Math.abs(targetValue - startingPosition.value) / range.value * 100;
    
    const distanceAttenuationFactor = Math.min(1, 40 / Math.max(5, distancePercentage));
    
    const performSpringAnimation = (timestamp: number) => {
      if (!isAnimating.value) return;
      
      if (!lastTimestamp) {
        lastTimestamp = timestamp;
        animationFrameId.value = requestAnimationFrame(performSpringAnimation);
        return;
      }
      
      const deltaTime = Math.min((timestamp - lastTimestamp) / 1000, 0.064);
      lastTimestamp = timestamp;
      
      const displacement = targetValue - visualPosition.value;
      
      if (Math.abs(displacement) < 0.005 && Math.abs(velocity) < 0.005) {
        visualPosition.value = targetValue;
        isAnimating.value = false;
        return;
      }
      
      let { stiffness, damping } = getSpringParams.value;
      
      if (Math.abs(displacement) < 0.5) {
        damping = Math.min(0.95, damping * 1.2);
      }
      
      if (props.bounceEffect !== 'none') {
        damping = damping + (1 - damping) * (1 - distanceAttenuationFactor) * 0.5;
      }
      
      const scaledStiffness = stiffness * 60 * deltaTime;
      const springForce = displacement * scaledStiffness;
      
      velocity = velocity * Math.pow(1 - damping, deltaTime * 60) + springForce;
      
      const newPosition = visualPosition.value + velocity;
      
      if ((newPosition > targetValue && velocity > 0) || 
          (newPosition < targetValue && velocity < 0)) {
        
        const maxBounceRatio = props.maxBounceDistance / 1000;
        const maxBounceValue = range.value * maxBounceRatio;
        
        const overBounce = newPosition > targetValue ? 
          newPosition - targetValue : 
          targetValue - newPosition;
        
        const bounceRatio = Math.min(1, overBounce / maxBounceValue);
        
        if (bounceRatio > 0.6) {
          const slowdownFactor = 1 - ((bounceRatio - 0.6) / 0.4);
          velocity *= slowdownFactor;
        }
      }
      
      visualPosition.value += velocity;
      
      animationFrameId.value = requestAnimationFrame(performSpringAnimation);
    };
    
    animationFrameId.value = requestAnimationFrame(performSpringAnimation);
  };
  
  const handleTrackClick = (event: MouseEvent) => {
    if (!isBrowser.value || !track.value) return;
    
    const trackRect = track.value.getBoundingClientRect();
    const percentage = (event.clientX - trackRect.left) / trackRect.width;
    
    dragValue.value = props.min + percentage * range.value;
    startingPosition.value = visualPosition.value;
    
    snapToNearestValue();
  };
  
  watch(() => props.modelValue, (newValue) => {
    if (newValue !== undefined) {
      if (!isDragging.value) {
        currentValue.value = newValue;
        
        if (!isAnimating.value) {
          visualPosition.value = newValue;
        } else {
          targetPosition.value = newValue;
          if (isBrowser.value) {
            animateToValue(newValue);
          } else {
            visualPosition.value = newValue;
          }
        }
      }
    }
  });
  
  const getSpringParams = computed(() => {
    let baseStiffness: number;
    let baseDamping: number;
    
    switch(props.bounceEffect) {
      case 'none':
        baseStiffness = 1.6;
        baseDamping = 1.0;
        break;
      case 'light':
        baseStiffness = 1.2;
        baseDamping = 0.8;
        break;
      case 'medium':
        baseStiffness = 0.9;
        baseDamping = 0.7;
        break;
      case 'strong':
        baseStiffness = 0.7;
        baseDamping = 0.5;
        break;
      default:
        baseStiffness = 0.9;
        baseDamping = 0.7;
    }
    
    let speedMultiplier: number;
    switch(props.transitionSpeed) {
      case 'instant':
        speedMultiplier = 0.35;
        break;
      case 'fast':
        speedMultiplier = 0.28;
        break;
      case 'normal':
        speedMultiplier = 0.22;
        break;
      case 'slow':
        speedMultiplier = 0.15;
        break;
      case 'very-slow':
        speedMultiplier = 0.10;
        break;
      default:
        speedMultiplier = 0.22;
    }
    
    const dampingAdjustment = props.transitionSpeed === 'slow' || props.transitionSpeed === 'very-slow' ? 
      (props.bounceEffect !== 'none' ? 0.92 : 1) : 1;
    
    return {
      stiffness: baseStiffness * speedMultiplier,
      damping: baseDamping * dampingAdjustment
    };
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
    width: 98%;
    margin: 0 1%;
  }
  
  .slider-fill {
    position: absolute;
    height: 100%;
    border-radius: 4px;
    pointer-events: none;
    will-change: width, background-color;
    transition: background-color 0.3s ease;
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
    transition: box-shadow 0.2s, background-color 0.3s ease;
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
    transition: color 0.3s ease, font-weight 0.2s;
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
    transition: background-color 0.2s ease;
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
  
  @media (max-width: 640px) {
    .slider-label {
      font-size: 10px;
    }
  }
</style>