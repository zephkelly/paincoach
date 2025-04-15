<template>
    <EModalBase
        :identifier="identifier"
        :open="open"
        :trigger-event="triggerEvent"
        :enable-drag="!isFullPage && !isTransitioningToFull && enableDrag"
        :placement="placement"
        :is-full-page-mode="isFullPage"
        :is-transitioning-to-full="isTransitioningToFull"
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
            <div class="shared-components" v-if="isFullPage || isTransitioningToFull">
                <slot name="shared"></slot>
                
                <button 
                    class="close-button" 
                    @click="handleClose"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            
            <div class="content-container">
                <transition :name="transitionName">
                    <div :key="props.currentPage" class="page-content">
                        <slot :name="`page-${props.currentPage}`"></slot>
                    </div>
                </transition>
            </div>
            
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
    totalPages?: number; // Added totalPages prop
    countFirstPage?: boolean; // Added flag to control whether first page is counted
}

const props = withDefaults(defineProps<Props>(), {
    enableDrag: true,
    placement: 'auto',
    isFullPage: false,
    currentPage: 1,
    transitionType: 'slide',
    transitionDirection: 'right',
    totalPages: 3, // Default total pages
    countFirstPage: false // By default, don't count the first page
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
const FULL_PAGE_TRANSITION_TIME = 800; // ms - for full page transitions (reduced from 1000ms)
const COLLAPSE_TRANSITION_TIME = 450; // ms - for collapsing from full page

const isTransitioningToFull = ref(false);
const isTransitioningFromFull = ref(false);
const timeoutIds = ref<number[]>([]);

const transitionName = computed(() => {
    const direction = props.transitionDirection;
    return `${props.transitionType}-${direction}`;
});

const clearTimeouts = () => {
    timeoutIds.value.forEach(id => window.clearTimeout(id));
    timeoutIds.value = [];
};

// Methods
const handleClose = () => {
    clearTimeouts();
    
    emit('close');
    
    isTransitioningFromFull.value = false;
    isTransitioningToFull.value = false;
};

const changePage = (page: number) => {
    if (page === props.currentPage) return;
    
    clearTimeouts();
    
    const currentIsFullPage = props.isFullPage;
    const fullPageTransitionNeeded = !currentIsFullPage && page > 1;
    
    if (fullPageTransitionNeeded) {
        console.log('Transitioning to full page');
        isTransitioningToFull.value = true;
        
        emit('update:isFullPage', true);
        
        const timeoutId = window.setTimeout(() => {
            // Update current page which will trigger the transition
            emit('update:currentPage', page);
            isTransitioningToFull.value = false;
            
            // Emit page changed event after transition
            const pageChangedId = window.setTimeout(() => {
                emit('pageChanged', page, props.currentPage);
            }, 500);
            
            timeoutIds.value.push(pageChangedId);
            
        }, FULL_PAGE_TRANSITION_TIME);
        
        timeoutIds.value.push(timeoutId);
    } else {
        isTransitioningFromFull.value = false;
        emit('update:currentPage', page);
        
        const pageChangedId = window.setTimeout(() => {
            emit('pageChanged', page, props.currentPage);
        }, 500);
        
        timeoutIds.value.push(pageChangedId);
    }
};

const displayCurrentPage = computed(() => {
    if (!props.countFirstPage && props.currentPage > 1) {
        return props.currentPage - 1;
    }
    return props.countFirstPage ? props.currentPage : 0;
});

const displayTotalPages = computed(() => {
    return props.countFirstPage ? props.totalPages : props.totalPages - 1;
});


defineExpose({ 
    changePage,
    displayCurrentPage,
    displayTotalPages
});

watch(() => props.isFullPage, (oldFullPageState, newFullPageState) => {
    if (newFullPageState !== oldFullPageState) {
        if (newFullPageState) {
            isTransitioningFromFull.value = true;
            
            const timeoutId = window.setTimeout(() => {
                isTransitioningFromFull.value = false;
            }, COLLAPSE_TRANSITION_TIME);
            
            timeoutIds.value.push(timeoutId);
        }
        else {
            isTransitioningToFull.value = true;
            
            const timeoutId = window.setTimeout(() => {
                console.log('Transitioning to full page');
                isTransitioningToFull.value = false;
            }, FULL_PAGE_TRANSITION_TIME);
            
            timeoutIds.value.push(timeoutId);
        }
    }
});

onBeforeUnmount(() => {
    clearTimeouts();
});
</script>

<style lang="scss" scoped>
.enhanced-modal {
    position: relative;
    max-height: 80vh;
    max-width: 600px;
    border-radius: 12px;
    background-color: var(--panel-color);
    overflow: hidden;
    will-change: transform, height, width, border-radius; /* Hint for browser optimization */
    
    &.transitioning-to-full {
        transition:
            all 0.8s cubic-bezier(0.075, 0.82, 0.165, 1),
            width 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
    }
    
    &.transitioning-from-full {
        transition:
            all 0.6s cubic-bezier(0.075, 0.82, 0.165, 1),
            width 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);

    }
    
    &.full-page,
    &.transitioning-to-full {
        max-height: 100vh;
        height: 100vh;
        max-width: 100%;
        width: 100%;
        border-color: var(--panel-color); /* Border color matches container */
        border-radius: 0; /* No border radius in full page mode */
        
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
    box-sizing: border-box;
    
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
}

/* Simple transitions */

/* Slide Right */
.slide-right-enter-active,
.slide-right-leave-active {
    transition: transform 0.8s cubic-bezier(0.075, 0.82, 0.165, 1), opacity 1s cubic-bezier(0.075, 0.82, 0.165, 1);
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
}

.slide-right-enter-from {
    transform: translateX(100%);
    opacity: 0;
}

.slide-right-leave-to {
    transform: translateX(-100%);
    opacity: 0;
}

/* Slide Left */
.slide-left-enter-active,
.slide-left-leave-active {
    transition: transform 0.8s cubic-bezier(0.075, 0.82, 0.165, 1), opacity 1s cubic-bezier(0.075, 0.82, 0.165, 1);
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
}

.slide-left-enter-from {
    transform: translateX(-100%);
    opacity: 0;
}

.slide-left-leave-to {
    transform: translateX(100%);
    opacity: 0;
}

/* Slide Up */
.slide-up-enter-active,
.slide-up-leave-active {
    transition: transform 0.5s ease, opacity 0.5s ease;
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
}

.slide-up-enter-from {
    transform: translateY(100%);
    opacity: 0;
}

.slide-up-leave-to {
    transform: translateY(-100%);
    opacity: 0;
}

/* Slide Down */
.slide-down-enter-active,
.slide-down-leave-active {
    transition: transform 0.5s ease, opacity 0.5s ease;
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
}

.slide-down-enter-from {
    transform: translateY(-100%);
    opacity: 0;
}

.slide-down-leave-to {
    transform: translateY(100%);
    opacity: 0;
}

/* Fade transitions */
.fade-right-enter-active,
.fade-right-leave-active,
.fade-left-enter-active,
.fade-left-leave-active,
.fade-up-enter-active,
.fade-up-leave-active,
.fade-down-enter-active,
.fade-down-leave-active {
    transition: opacity 0.5s ease, transform 2s cubic-bezier(0.075, 0.82, 0.165, 1);
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
}

.fade-right-enter-from {
    opacity: 0;
    transform: translateX(30px);
}

.fade-right-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}

.fade-left-enter-from {
    opacity: 0;
    transform: translateX(-30px);
}

.fade-left-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

.fade-up-enter-from {
    opacity: 0;
    transform: translateY(30px);
}

.fade-up-leave-to {
    opacity: 0;
    transform: translateY(-30px);
}

.fade-down-enter-from {
    opacity: 0;
    transform: translateY(-30px);
}

.fade-down-leave-to {
    opacity: 0;
    transform: translateY(30px);
}
</style>