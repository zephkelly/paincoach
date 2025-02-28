<template>
    <Teleport to="#teleports">
        <Transition name="modal">
            <div v-if="open" class="modal" @mousedown="!isDragging && $emit('close')" @touchstart="!isDragging && $emit('close')">
                <div 
                    ref="modalRef"
                    class="modal-container" 
                    :class="{ 'is-dragging': isDragging }"
                    :style="[modalPosition, modalTransform]"
                    @touchstart.passive="handleTouchStart"
                    @touchmove.prevent="handleTouchMove"
                    @touchend="handleTouchEnd"
                    @touchcancel="handleTouchEnd"
                    @mousedown="handleMouseDown"
                    @mousemove="handleMouseMove"
                    @mouseup="handleMouseUp"
                    @mouseleave="handleMouseUp"
                    @click.stop
                >
                    <div class="modal-content">
                        <!-- Mobile drag handle -->
                        <div v-if="isMobileView && enableDrag" class="drag-handle" aria-hidden="true">
                            <div class="drag-handle-bar"></div>
                        </div>
                        
                        <!-- Main content slot -->
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
    open: boolean;
    triggerEvent?: MouseEvent | null;
    enableDrag?: boolean;
    placement?: 'bottom' | 'top' | 'auto';
}

const props = withDefaults(defineProps<Props>(), {
    enableDrag: true,
    placement: 'auto'
});

const emit = defineEmits<{
    close: [];
}>();

const modalRef = ref<HTMLElement | null>(null);
const modalPosition = ref({
    top: '0px',
    left: '0px'
});

const isMobileView = computed(() => window.innerWidth < 500);

// Position logic
const updateModalPosition = () => {
    if (!props.triggerEvent?.target || !props.open || !modalRef.value) return;
    
    let newPosition = {
        top: '-9999px',
        left: '-9999px',
        bottom: 'auto',
        right: 'auto'
    };
    
    if (isMobileView.value || props.placement === 'bottom') {
        newPosition = {
            bottom: '0px',
            left: '0px',
            right: '0px',
            top: 'auto'
        };
    } else {
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

const overlayStyle = computed(() => {
    if (!isMobileView.value) return {};
    
    if (isClosing.value) {
        return { opacity: 0 };
    }
    
    if (isDragging.value) {
        const delta = currentY.value - startY.value;
        const dragRatio = 0.6;
        const opacity = Math.max(0, 1 - (delta * dragRatio) / window.innerHeight);
        return { opacity };
    }
    
    return { opacity: 1 };
});

// Touch and mouse event handlers
const handleTouchStart = (event: TouchEvent) => {
    if (!isMobileView.value || !props.enableDrag) return;
    
    const touch = event.touches[0];
    if (!touch) return;
    startDrag(touch.clientY);
};

const handleMouseDown = (event: MouseEvent) => {
    if (!isMobileView.value || !props.enableDrag) return;
    
    isMouseDown.value = true;
    startDrag(event.clientY);
};

const startDrag = (clientY: number) => {
    startY.value = clientY;
    currentY.value = clientY;
    lastY.value = clientY;
    lastTime.value = Date.now();
    isDragging.value = true;
    velocity.value = 0;
};

const handleTouchMove = (event: TouchEvent) => {
    if (!isDragging.value) return;

    if (event.touches[0] === undefined) return;
    handleDragMove(event.touches[0].clientY);
};

const handleMouseMove = (event: MouseEvent) => {
    if (!isDragging.value || !isMouseDown.value) return;
    handleDragMove(event.clientY);
};

const handleDragMove = (clientY: number) => {
    const now = Date.now();
    const deltaTime = now - lastTime.value;
    
    // Calculate the delta from the start position
    const deltaY = clientY - startY.value;
    
    // Apply upward resistance for both touch and mouse events
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
    handleDragEnd();
    setTimeout(() => { isDragging.value = false; }, 50);
};

const handleMouseUp = () => {
    if (!isMouseDown.value) return;
    isMouseDown.value = false;
    handleDragEnd();
    setTimeout(() => { isDragging.value = false; }, 50);
};

const handleDragEnd = () => {
    if (!isDragging.value) return;
    
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

// Lifecycle hooks
const handleResize = () => {
    requestAnimationFrame(updateModalPosition);
};

watch(() => props.open, (open) => {
    if (open) {
        modalPosition.value = { top: '-9999px', left: '-9999px' };
        nextTick(() => {
            updateModalPosition();
            requestAnimationFrame(updateModalPosition);
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
    transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    @media (max-width: 500px) {
        &.is-dragging {
            transition: none;
        }
    }
}

.modal-container {
    position: fixed;
    background-color: var(--background-secondary);
    border: 1px solid var(--border-main);
    border-radius: 8px;
    z-index: 1001;
    will-change: transform;
    box-sizing: border-box;
    // width: calc(100% - 24px);
    
    &::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        box-shadow: 0 8px 18px rgba(0, 0, 0, 0.25);
        z-index: -2;
    }

    &::after {
        content: '';
        display: none;
        position: absolute;
        left: -1px;
        right: -1px;
        top: 100%;
        height: 100vh;
        background-color: var(--background-secondary);
        border-left: 1px solid var(--border-main);
        border-right: 1px solid var(--border-main);
        z-index: -1;
    }

    @media (max-width: 500px) {
        width: 100%;
        bottom: 0;
        left: 0;
        right: 0;
        border-bottom: none;
        border-radius: 12px 12px 0 0;
        transform-origin: bottom center;
        padding-bottom: 2rem;
        padding-top: 1rem;
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        
        &::after {
            display: block;
        }

        &.is-dragging {
            transition: none;
        }
    }
}

.modal-content {
    position: relative;
    top: 0;
    width: 100%;

    .drag-handle {
        display: flex;
        justify-content: center;
        padding: 0.75rem 0;
        margin: -1rem -1rem 0 -1rem;
        cursor: grab;
        touch-action: none;
        user-select: none;
        width: 100%;

        .drag-handle-bar {
            width: 32px;
            height: 4px;
            background-color: var(--border-main);
            border-radius: 2px;
        }
    }
}

.modal-enter-active,
.modal-leave-active {
    .modal-overlay {
        opacity: 1;
        transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .modal-container {
        @media (max-width: 500px) {
            will-change: transform;
            transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
    }
}

.modal-enter-from,
.modal-leave-to {
    .modal-overlay {
        opacity: 0;
    }

    .modal-container {
        @media (max-width: 500px) {
            transform: translateY(100%);
        }
    }
}
</style>