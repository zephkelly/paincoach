<template>
    <EModalBase
        :identifier="identifier"
        :open="open"
        :trigger-event="triggerEvent"
        :enable-drag="!isFullPage && !isTransitioningToFull && enableDrag"
        :placement="placement"
        @close="handleClose"
    >
        <div 
            class="enhanced-modal" 
            :class="{ 
                'full-page': isFullPage, 
                'transitioning-to-full': isTransitioningToFull,
                'transitioning-from-full': isTransitioningFromFull
            }"
        >
            <!-- Shared components slot - for progress bars, etc. -->
            <div class="shared-components">
                <slot name="shared"></slot>
                
                <!-- Close button for full page mode -->
                <button 
                    v-if="isFullPage || isTransitioningToFull" 
                    class="close-button" 
                    @click="handleClose"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            
            <!-- Content container -->
            <div class="content-container" :class="{ 'animate-slide': isTransitioning }">
                <!-- Current page content -->
                <transition :name="transitionName">
                    <div v-if="!isTransitioning || currentTransition === 'leave'" class="page-content current">
                        <slot :name="`page-${currentPage}`"></slot>
                    </div>
                </transition>
                
                <!-- Next page content (for transitions) -->
                <transition :name="transitionName">
                    <div v-if="isTransitioning && currentTransition === 'enter'" class="page-content next">
                        <slot :name="`page-${nextPage}`"></slot>
                    </div>
                </transition>
            </div>
            
            <!-- Default slot for backward compatibility -->
            <slot v-if="!hasNamedSlots"></slot>
        </div>
    </EModalBase>
</template>

<script setup lang="ts">
import { ref, computed, useSlots, watch, onBeforeUnmount } from 'vue';

interface Props {
    identifier: string;
    open: boolean;
    triggerEvent?: MouseEvent | null;
    enableDrag?: boolean;
    placement?: 'bottom' | 'top' | 'auto';
    isFullPage?: boolean;
    currentPage?: number;
    transitionType?: 'slide' | 'fade';
    transitionDirection?: 'left' | 'right' | 'up' | 'down';
}

const props = withDefaults(defineProps<Props>(), {
    enableDrag: true,
    placement: 'auto',
    isFullPage: false,
    currentPage: 1,
    transitionType: 'slide',
    transitionDirection: 'right'
});

const emit = defineEmits<{
    close: [];
    'update:isFullPage': [value: boolean];
    'update:currentPage': [value: number];
    pageChanged: [newPage: number, oldPage: number];
}>();

// Access slots to check if named page slots exist
const slots = useSlots();
const hasNamedSlots = computed(() => {
    return Object.keys(slots).some(key => key.startsWith('page-'));
});

// Animation constants
const FULL_PAGE_TRANSITION_TIME = 1500; // ms - slower transition to full page
const COLLAPSE_TRANSITION_TIME = 450; // ms - slower transition from full page
const PAGE_TRANSITION_TIME = 300; // ms - page transitions remain the same

// State management
const isTransitioning = ref(false);
const isTransitioningToFull = ref(false);
const isTransitioningFromFull = ref(false);
const currentTransition = ref<'enter' | 'leave'>('leave');
const nextPage = ref<number>(props.currentPage);

// Animation frame tracking
const animationFrames = ref<number[]>([]);

// Computed properties for transitions
const transitionName = computed(() => {
    const direction = props.transitionDirection;
    return `${props.transitionType}-${direction}`;
});

// Utility function to schedule animation frames with timing
const scheduleAnimationFrame = (callback: () => void, delay: number): void => {
    // Calculate how many frames to wait before executing
    // Assuming 60fps, each frame is ~16.67ms
    const framesDelay = Math.max(1, Math.round(delay / 16.67));
    
    let frameCount = 0;
    const rafCallback = () => {
        frameCount++;
        if (frameCount >= framesDelay) {
            callback();
        } else {
            const rafId = requestAnimationFrame(rafCallback);
            animationFrames.value.push(rafId);
        }
    };
    
    const rafId = requestAnimationFrame(rafCallback);
    animationFrames.value.push(rafId);
};

// Clear all pending animation frames
const clearAnimationFrames = () => {
    animationFrames.value.forEach(id => cancelAnimationFrame(id));
    animationFrames.value = [];
};

// Force a browser repaint to ensure animations run smoothly
const forceRepaint = (element: HTMLElement) => {
    // Reading offsetHeight forces a repaint
    // eslint-disable-next-line no-unused-expressions
    element.offsetHeight;
};

// Methods
const handleClose = () => {
    if (props.isFullPage) {
        // Clear any existing animations
        clearAnimationFrames();
        
        // If in full page mode, collapse first with animation
        isTransitioningFromFull.value = true;
        emit('update:isFullPage', false);
        
        // Then emit close after animation completes
        scheduleAnimationFrame(() => {
            isTransitioningFromFull.value = false;
            emit('close');
        }, COLLAPSE_TRANSITION_TIME);
    } else {
        // If already in bottom sheet mode, just close
        emit('close');
    }
};

const changePage = (page: number) => {
    if (page === props.currentPage) return;
    
    // Clear any existing animations
    clearAnimationFrames();
    
    const currentIsFullPage = props.isFullPage;
    const fullPageTransitionNeeded = !currentIsFullPage && page > 1;
    
    if (fullPageTransitionNeeded) {
        // First transition to full page
        isTransitioningToFull.value = true;
        emit('update:isFullPage', true);
        
        // Then change page after full-page transition
        scheduleAnimationFrame(() => {
            isTransitioning.value = true;
            nextPage.value = page;
            currentTransition.value = 'leave';
            
            scheduleAnimationFrame(() => {
                currentTransition.value = 'enter';
                emit('update:currentPage', page);
                
                scheduleAnimationFrame(() => {
                    isTransitioning.value = false;
                    isTransitioningToFull.value = false;
                    emit('pageChanged', page, props.currentPage);
                }, PAGE_TRANSITION_TIME);
            }, PAGE_TRANSITION_TIME);
        }, FULL_PAGE_TRANSITION_TIME);
    } else {
        // Standard page transition
        isTransitioning.value = true;
        nextPage.value = page;
        
        // First animate current page out
        currentTransition.value = 'leave';
        
        // Then animate new page in
        scheduleAnimationFrame(() => {
            currentTransition.value = 'enter';
            emit('update:currentPage', page);
            
            // Complete transition
            scheduleAnimationFrame(() => {
                isTransitioning.value = false;
                emit('pageChanged', page, props.currentPage);
            }, PAGE_TRANSITION_TIME);
        }, PAGE_TRANSITION_TIME);
    }
};

// Expose changePage method to parent components
defineExpose({ changePage });

// Watch for external page changes
watch(() => props.currentPage, (newPage) => {
    if (!isTransitioning.value && newPage !== nextPage.value) {
        changePage(newPage);
    }
});

// Watch for external isFullPage changes
watch(() => props.isFullPage, (newFullPageState, oldFullPageState) => {
    if (newFullPageState !== oldFullPageState) {
        // Clear any existing animations
        clearAnimationFrames();
        
        if (newFullPageState) {
            // Going to full page - use longer transition time
            isTransitioningToFull.value = true;
            scheduleAnimationFrame(() => {
                isTransitioningToFull.value = false;
            }, FULL_PAGE_TRANSITION_TIME);
        } else {
            // Collapsing from full page - use collapse time
            isTransitioningFromFull.value = true;
            scheduleAnimationFrame(() => {
                isTransitioningFromFull.value = false;
            }, COLLAPSE_TRANSITION_TIME);
        }
    }
});

// Clean up any pending animation frames when component is unmounted
onBeforeUnmount(() => {
    clearAnimationFrames();
});
</script>

<style lang="scss" scoped>
.enhanced-modal {
    position: relative;
    transition: transform 0.3s cubic-bezier(0.075, 0.82, 0.165, 1), height 0.3s cubic-bezier(0.075, 0.82, 0.165, 1), width 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
    max-height: 80vh;
    max-width: 600px;
    border-radius: 12px;
    background-color: var(--panel-color);
    overflow: hidden;
    will-change: transform, height, width, border-radius; /* Hint for browser optimization */
    
    &.transitioning-to-full {
        transition: all 0.65s cubic-bezier(0.075, 0.82, 0.165, 1); /* Slower, less overshooting transition */
    }
    
    &.transitioning-from-full {
        transition: all 0.45s cubic-bezier(0.075, 0.82, 0.165, 1);
    }
    
    &.full-page,
    &.transitioning-to-full {
        max-height: 100vh;
        height: 100vh;
        max-width: 100%;
        width: 100%;
        border-color: var(--panel-color); /* Border color matches container */
        border-radius: 0; /* No border radius in full page mode */
        transform-origin: center bottom;
        
        .content-container {
            height: calc(100vh - 60px);
            overflow-y: auto;
            padding-bottom: env(safe-area-inset-bottom, 0); /* iOS safe area support */
        }
    }
}

.shared-components {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.75rem 1rem;
    
    .close-button {
        position: absolute;
        right: 1rem;
        top: 1rem;
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
        opacity: 0;
        transition: opacity 0.3s ease 0.1s; /* Delayed appearance for smoothness */
        color: var(--text-color);
        
        .enhanced-modal.full-page &,
        .enhanced-modal.transitioning-to-full & {
            opacity: 1;
        }
        
        &:hover {
            opacity: 0.7;
        }
    }
}

.content-container {
    position: relative;
    width: 100%;
    overflow: hidden;
}

.page-content {
    width: 100%;
    position: relative;
    will-change: transform, opacity; /* Performance hint for transitions */
}

// Transitions
// Slide transitions
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active,
.slide-up-enter-active,
.slide-up-leave-active,
.slide-down-enter-active,
.slide-down-leave-active {
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease;
    position: absolute;
    width: 100%;
    will-change: transform, opacity;
}

.slide-right-enter-from {
    transform: translateX(100%);
    opacity: 0;
}

.slide-right-leave-to {
    transform: translateX(-100%);
    opacity: 0;
}

.slide-left-enter-from {
    transform: translateX(-100%);
    opacity: 0;
}

.slide-left-leave-to {
    transform: translateX(100%);
    opacity: 0;
}

.slide-up-enter-from {
    transform: translateY(100%);
    opacity: 0;
}

.slide-up-leave-to {
    transform: translateY(-100%);
    opacity: 0;
}

.slide-down-enter-from {
    transform: translateY(-100%);
    opacity: 0;
}

.slide-down-leave-to {
    transform: translateY(100%);
    opacity: 0;
}

// Fade transitions
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
    position: absolute;
    width: 100%;
    will-change: opacity;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>