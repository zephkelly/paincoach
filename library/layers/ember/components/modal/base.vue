<template>
    <Teleport to="#teleports">
        <Transition name="modal">
            <div v-if="open" class="modal" @mousedown="handleBackdropClick" @touchstart="handleBackdropTouch">
                <div 
                    ref="modalRef"
                    :id="identifier"
                    class="modal-container" 
                    :class="{ 
                        'is-dragging': isDragging,
                        'full-page-mode': isFullPageMode,
                        'transitioning-to-full': isTransitioningToFull
                    }"
                    :style="[computedModalStyle]"
                    @touchstart.passive="handleTouchStart"
                    @touchmove.prevent="handleTouchMove"
                    @touchend="handleTouchEnd"
                    @touchcancel="handleTouchCancel"
                    @mousedown="handleModalMouseDown"
                    @mousemove="handleMouseMove"
                    @mouseup="handleMouseUp"
                    @mouseleave="handleMouseLeave"
                    @click.stop
                >
                    <div class="modal-content">
                        <div v-if="isMobileView && enableDrag && !isFullPageMode" class="drag-handle" aria-hidden="true">
                            <div class="drag-handle-bar"></div>
                        </div>
                        
                        <slot></slot>
                    </div>
                </div>
                <div class="modal-overlay" :style="overlayStyle"></div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';

interface Props {
    identifier: string;
    open: boolean;
    triggerEvent?: MouseEvent | null;
    enableDrag?: boolean;
    placement?: 'bottom' | 'top' | 'auto';
    isFullPageMode?: boolean;  // New prop to detect full page mode
    isTransitioningToFull?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    enableDrag: true,
    placement: 'auto',
    isFullPageMode: false,
    isTransitioningToFull: false
});

const emit = defineEmits<{
    close: [];
}>();

const modalRef = ref<HTMLElement | null>(null);

type ModalPosition = {
  top?: string;
  left?: string;
  bottom?: string;
  right?: string;
};
const modalPosition = ref<ModalPosition>({
    top: '0px',
    left: '0px'
});

const isMobileView = computed(() => window.innerWidth < 768);

// Computed to check if dragging should be enabled
const canDrag = computed(() => props.enableDrag && !props.isFullPageMode);

// Position logic
const updateModalPosition = () => {
    if (!props.triggerEvent?.target || !props.open || !modalRef.value || 
        props.isFullPageMode || props.isTransitioningToFull) return;
    
    let newPosition: ModalPosition = {
        top: '-9999px',
        left: '-9999px',
        bottom: 'auto',
        right: 'auto'
    };
    
    if (isMobileView.value || props.placement === 'bottom') {
        if (props.isTransitioningToFull) {
            newPosition = {
                top: '0px',
                left: '0px',
                right: '0px',
                bottom: '0px',
            };
        } else {
            newPosition = {
                bottom: '0px',
                left: '0px',
                right: '0px',
            };
        }
    }
    else {
        const triggerElement = props.triggerEvent.target as HTMLElement;
        const triggerRect = triggerElement.getBoundingClientRect();
        const modalRect = modalRef.value.getBoundingClientRect();
        
        const containerWidth = Math.min(1000, window.innerWidth);
        const containerLeft = (window.innerWidth - containerWidth) / 2;
        let left = triggerRect.right - modalRect.width;
        let top = props.placement === 'top' 
            ? triggerRect.top - modalRect.height - 8
            : triggerRect.bottom + 8;
        
        newPosition = {
            top: `${Math.max(0, top)}px`,
            left: `${Math.max(0, left)}px`,
            bottom: 'auto',
            right: 'auto'
        };
    }
    
    modalPosition.value = newPosition;
};

// Drag logic
const isDragging = ref(false);
const startY = ref(0);
const currentY = ref(0);
const velocity = ref(0);
const lastY = ref(0);
const lastTime = ref(0);
const isMouseDown = ref(false);
const isClosing = ref(false);
const dragThreshold = 80;
const maxUpwardDrag = -50;

const modalTransform = computed(() => {
    // Don't allow dragging in full page mode
    if (props.isFullPageMode) return '';
    
    if (!isDragging.value && !isClosing.value || !isMobileView.value) return '';
    
    if (isClosing.value) {
        return 'transform: translateY(100%)';
    }
    
    const delta = currentY.value - startY.value;
    const dragRatio = 0.6;
    const dampedDelta = delta * dragRatio;
    const upwardResistance = dampedDelta < 0 
        ? Math.max(maxUpwardDrag, dampedDelta * Math.exp(dampedDelta / 200))
        : dampedDelta;
    
    return `transform: translateY(${upwardResistance}px)`;
});

const computedModalStyle = computed(() => {
    const positionStyle = {...modalPosition.value};
    
    if (props.isTransitioningToFull) {
        
        // if (isMobileView.value) {
        // }
        // else {
        //     const modalRect = modalRef.value?.getBoundingClientRect() || {top: 0, left: 0, width: 0};
        //     return {
        //         // ...positionStyle,
        //         // height: '100vh',
        //         // maxHeight: '100vh',
        //         width: '100%',
        //         maxWidth: '100%',
        //     };
        // }
        return {
            bottom: '0',
            left: '0',
            right: '0',
        };
    }
    
    if ((isDragging.value || isClosing.value) && !props.isFullPageMode && isMobileView.value) {
        const dragTransform = modalTransform.value;
        return {
            ...positionStyle,
            ...(dragTransform ? {transform: dragTransform.split(': ')[1]} : {})
        };
    }
    
    return positionStyle;
});

const overlayStyle = computed(() => {
    if (!isMobileView.value) return {};
    
    if (isClosing.value) {
        return { opacity: 0 };
    }
    
    if (isDragging.value && !props.isFullPageMode) {
        const delta = currentY.value - startY.value;
        const dragRatio = 0.6;
        const opacity = Math.max(0, 1 - (delta * dragRatio) / window.innerHeight);
        return { opacity };
    }
    
    return { opacity: 1 };
});

const handleBackdropClick = (event: MouseEvent) => {
    if (!isDragging.value && !props.isFullPageMode && event.target === event.currentTarget) {
        emit('close');
    }
};

const handleBackdropTouch = (event: TouchEvent) => {
    if (!isDragging.value && !props.isFullPageMode && event.target === event.currentTarget) {
        emit('close');
    }
};

const handleTouchStart = (event: TouchEvent) => {
    if (!canDrag.value || !isMobileView.value) return;
    
    const touch = event.touches[0];
    if (!touch) return;
    startDrag(touch.clientY);
};

const handleModalMouseDown = (event: MouseEvent) => {
    if (!canDrag.value || !isMobileView.value) return;

    const target = event.target as HTMLElement;
    const isClickingDragHandle = target.closest('.drag-handle') !== null;

    if (isClickingDragHandle || isMobileView.value) {
        isMouseDown.value = true;
        startDrag(event.clientY);
        event.preventDefault(); // Prevent text selection during drag
    }
};

const startDrag = (clientY: number) => {
    if (!canDrag.value) return;
    
    startY.value = clientY;
    currentY.value = clientY;
    lastY.value = clientY;
    lastTime.value = Date.now();
    isDragging.value = true;
    velocity.value = 0;
};

const handleTouchMove = (event: TouchEvent) => {
    if (!isDragging.value || !canDrag.value) return;

    if (event.touches[0] === undefined) return;
    handleDragMove(event.touches[0].clientY);
};

const handleMouseMove = (event: MouseEvent) => {
    if (!isDragging.value || !isMouseDown.value || !canDrag.value) return;
    handleDragMove(event.clientY);
};

const handleDragMove = (clientY: number) => {
    if (!canDrag.value) return;
    
    const now = Date.now();
    const deltaTime = now - lastTime.value;
    
    const deltaY = clientY - startY.value;
    
    if (deltaY < 0) {
        currentY.value = startY.value + Math.max(maxUpwardDrag, deltaY * Math.exp(deltaY / 200));
    } else {
        currentY.value = clientY;
    }
    
    if (deltaTime > 0) {
        velocity.value = (currentY.value - lastY.value) / deltaTime;
    }
    
    lastY.value = currentY.value;
    lastTime.value = now;
};

const handleTouchEnd = () => {
    // Abort if we can't drag
    if (!canDrag.value) return;
    
    handleDragEnd();
    setTimeout(() => { isDragging.value = false; }, 50);
};

const handleTouchCancel = handleTouchEnd;

const handleMouseUp = () => {
    if (!isMouseDown.value || !canDrag.value) return;
    
    isMouseDown.value = false;
    handleDragEnd();
    setTimeout(() => { isDragging.value = false; }, 50);
};

const handleMouseLeave = handleMouseUp;

const handleDragEnd = () => {
    if (!isDragging.value || !canDrag.value) return;
    
    const delta = currentY.value - startY.value;
    const speed = Math.abs(velocity.value);
    const modalElement = modalRef.value;
    
    if (delta > dragThreshold || (speed > 0.5 && delta > dragThreshold / 2 && delta > 0)) {
        if (modalElement) {
            isClosing.value = true;
            modalElement.style.transition = 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                emit('close');
                isClosing.value = false;
                if (modalElement) {
                    modalElement.style.transition = '';
                }
            }, 200);
        } else {
            emit('close');
        }
    } else {
        if (modalElement) {
            modalElement.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
            setTimeout(() => {
                if (modalElement) {
                    modalElement.style.transition = '';
                }
            }, 300);
        }
    }
    
    isDragging.value = false;
    velocity.value = 0;
};

watch(() => props.isFullPageMode, (isFullPage) => {
    if (isFullPage) {
        isDragging.value = false;
        isMouseDown.value = false;
        isClosing.value = false;
        velocity.value = 0;
    }
    else {
        nextTick(() => {
            updateModalPosition();
            requestAnimationFrame(updateModalPosition);
        });
    }
});

const handleResize = () => {
    if (!props.isFullPageMode) {
        requestAnimationFrame(updateModalPosition);
    }
};

watch(() => props.open, (open) => {
    if (open) {
        modalPosition.value = { top: '-9999px', left: '-9999px' };
        nextTick(() => {
            if (!props.isFullPageMode) {
                updateModalPosition();
                requestAnimationFrame(updateModalPosition);
            }
        });
        window.addEventListener('resize', handleResize);
    } else {
        window.removeEventListener('resize', handleResize);
    }
});

onMounted(() => {
    if (props.open) {
        window.addEventListener('resize', handleResize);
    }
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
});
</script>

<style lang="scss" scoped>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 800;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 1;
    will-change: opacity;
    transition: opacity 0.3s cubic-bezier(0.22, 1, 0.36, 1);

    @media (max-width: 768px) {
        &.is-dragging:not(.full-page-mode) {
            transition: none;
        }
    }
}

.modal-container {
    position: fixed;
    border-radius: 12px;
    z-index: 1001;
    will-change: transform;
    box-sizing: border-box;
    background-color: var(--panel-color);
    border: 1px solid var(--panel-color);
    transform-origin: bottom center;
    transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1),
                border-radius 0.4s cubic-bezier(0.22, 1, 0.36, 1),
                border-color 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    
    &::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        box-shadow: 0 8px 18px rgba(0, 0, 0, 0.25);
        z-index: -2;
        transition: box-shadow 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    }

    &::after {
        content: '';
        display: none;
        position: absolute;
        left: -1px;
        right: -1px;
        top: 100%;
        height: 100vh;
        z-index: -1;
        background-color: var(--panel-color);
        // border-left: 1px solid var(--border-color);
        // border-right: 1px solid var(--border-color);
    }
    
    &.transitioning-to-full {
        position: fixed;
        border-radius: 12px;
        border-radius: 12px 12px 0 0;
        
        // Animate border radius separately
        transition: border-radius 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        
        @media (min-width: 769px) {
            border-radius: 12px;
        }
    }

    &.full-page-mode:not(.transitioning-to-full) {
        border-radius: 0 !important;
        border-color: var(--panel-color) !important;
        transform-origin: bottom center;
        
        &::before {
            box-shadow: none;
        }
    }

    @media (max-width: 768px) {
        width: 100%;
        bottom: 0;
        left: 0;
        right: 0;
        border-bottom: none;
        border-radius: 12px 12px 0 0;
        transform-origin: bottom center;
        transition: transform 0.5s cubic-bezier(0.075, 0.82, 0.165, 1),
                    border-radius 0.4s cubic-bezier(0.075, 0.82, 0.165, 1),
                    border-color 0.4s cubic-bezier(0.075, 0.82, 0.165, 1);
        
        &::after {
            display: block;
        }

        &.is-dragging:not(.full-page-mode) {
            transition: none;
        }
        
        &.full-page-mode {
            border-radius: 0 !important;
        }
    }
}

.modal-content {
    position: relative;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .drag-handle {
        display: flex;
        justify-content: center;
        padding: 0.75rem 0;
        padding-bottom: 0.5rem;
        cursor: grab;
        touch-action: none;
        user-select: none;
        width: 100%;

        .drag-handle-bar {
            width: 36px;
            height: 4px;
            background-color: var(--border-color);
            border-radius: 2px;
        }
    }
}

.modal-enter-active,
.modal-leave-active {
    .modal-overlay {
        opacity: 1;
        transition: opacity 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);
    }

    .modal-container {
        @media (max-width: 768px) {
            will-change: transform;
            transition: transform 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
            
            &.full-page-mode {
                transition: transform 0.5s cubic-bezier(0.075, 0.82, 0.165, 1),
                            border-radius 0.4s cubic-bezier(0.075, 0.82, 0.165, 1);
            }
        }
    }
}

.modal-enter-from,
.modal-leave-to {
    .modal-overlay {
        opacity: 0;
    }

    .modal-container {
        @media (max-width: 768px) {
            transform: translateY(100%);
            
            &.full-page-mode {
                transform: none !important;
            }
        }
    }
}
</style>