<template>
    <div
      v-if="isVisible"
      class="paged-modal-container"
      @click="handleBackdropClick"
    >
      <div class="paged-modal" @click.stop>
        <!-- Page indicators -->
        <div class="page-indicators">
          <div
            v-for="(_, index) in pages"
            :key="index"
            class="page-indicator"
            :class="{
              'active': currentPageIndex === index,
              'completed': currentPageIndex > index
            }"
          ></div>
        </div>
  
        <!-- Pages -->
        <div
            class="page-content"
        >
            <transition
            :name="transitionName"
            @after-leave="afterLeave"
            >
            <component
                :key="currentPageIndex"
                    class="page-component-content"
                    :style="{ height: height }"
                    :is="pages[currentPageIndex]"
                    v-bind="componentProps[currentPageIndex] || {}"
                    @update:can-continue="updateCanContinue"
                />
            </transition>
          </div>
  
        <!-- Navigation buttons -->
        <div class="navigation-buttons">
          <button
            v-if="currentPageIndex > 0"
            class="nav-button back-button"
            @click="goToPreviousPage"
          >
            Back
          </button>
          <button
            v-if="currentPageIndex < pages.length - 1"
            class="nav-button next-button"
            :disabled="!canContinue"
            @click="goToNextPage"
          >
            Next
          </button>
          <button
            v-else
            class="nav-button finish-button"
            :disabled="!canContinue"
            @click="finish"
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  </template>
  
<script setup lang="ts">
  interface Props {
    pages: Component[];
    componentProps?: Record<number, Record<string, any>>[];
    closeOnBackdropClick?: boolean;
    initialPage?: number;
    height?: string;
  }
  
  const props = withDefaults(defineProps<Props>(), {
    componentProps: () => [],
    closeOnBackdropClick: true,
    initialPage: 0
  });
  
  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'finish'): void;
    (e: 'page-change', page: number): void;
    (e: 'update:currentPage', page: number): void;
  }>();
  
  // State
  const isVisible = ref<boolean>(true);
  const currentPageIndex = ref<number>(props.initialPage);
  const canContinue = ref<boolean>(true);
  const isTransitioning = ref<boolean>(false);
  const direction = ref<'next' | 'prev'>('next');
  
  // Computed
  const transitionName = computed((): string => {
    return direction.value === 'next' ? 'slide-left' : 'slide-right';
  });
  
  // Methods
  const updateCanContinue = (value: boolean): void => {
    canContinue.value = value;
  };
  
  const goToNextPage = async (): Promise<void> => {
    if (currentPageIndex.value < props.pages.length - 1 && canContinue.value && !isTransitioning.value) {
      direction.value = 'next';
      isTransitioning.value = true;
      await nextTick();
      currentPageIndex.value++;
      emit('page-change', currentPageIndex.value);
      emit('update:currentPage', currentPageIndex.value);
    }
  };
  
  const goToPreviousPage = async (): Promise<void> => {
    if (currentPageIndex.value > 0 && !isTransitioning.value) {
      direction.value = 'prev';
      isTransitioning.value = true;
      await nextTick();
      currentPageIndex.value--;
      emit('page-change', currentPageIndex.value);
      emit('update:currentPage', currentPageIndex.value);
    }
  };
  
  const afterLeave = (): void => {
    isTransitioning.value = false;
  };
  
  const close = (): void => {
    isVisible.value = false;
    emit('close');
  };
  
  const finish = (): void => {
    if (canContinue.value) {
      emit('finish');
      close();
    }
  };
  
  const handleBackdropClick = (): void => {
    if (props.closeOnBackdropClick) {
      close();
    }
  };
  
  // Watch for external currentPage changes
  watch(() => props.initialPage, (newValue: number) => {
    if (newValue !== currentPageIndex.value) {
      direction.value = newValue > currentPageIndex.value ? 'next' : 'prev';
      currentPageIndex.value = newValue;
    }
  });
  
  // Expose functions to parent component
  defineExpose({
    close,
    goToNextPage,
    goToPreviousPage,
    setPage: (index: number): void => {
      if (index >= 0 && index < props.pages.length) {
        direction.value = index > currentPageIndex.value ? 'next' : 'prev';
        currentPageIndex.value = index;
        emit('page-change', currentPageIndex.value);
        emit('update:currentPage', currentPageIndex.value);
      }
    },
    getCurrentPage: (): number => currentPageIndex.value
  });
  </script>
  
  <style lang="scss" scoped>
  .paged-modal-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .paged-modal {
    position: relative;
    width: 100%;
    height: auto;
    min-height: 300px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    background: transparent;
    overflow: hidden;
  }
  
  .page-indicators {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 20px;
  }
  
  .page-indicator {
    width: 100%;
    height: 4px;
    border-radius: 2px;
    background-color: rgba(200, 200, 200, 0.5);
    transition: background-color 0.3s ease;
  }
  
  .page-indicator.active,
  .page-indicator.completed {
    background-color: white;
  }
  
  .page-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    padding: 20px;
    overflow-y: auto;
    max-height: calc(90vh - 100px);
    position: relative;

    .page-component-content {
        position: absolute;
    }
  }
  
  .navigation-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    gap: 10px;
  }
  
  .nav-button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.3s ease, opacity 0.3s ease;
  }
  
  .back-button {
    background-color: transparent;
    color: white;
  }
  
  .next-button, .finish-button {
    background-color: #3498db;
    color: white;
  }
  
  .nav-button:hover:not(:disabled) {
    opacity: 0.9;
  }
  
  .nav-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  /* Transitions */
  .slide-left-enter-active,
  .slide-left-leave-active,
  .slide-right-enter-active,
  .slide-right-leave-active {
    transition: all 0.3s ease-out;
  }
  
  .slide-left-enter-from {
    opacity: 0;
    transform: translateX(50px);
  }
  
  .slide-left-leave-to {
    position: absolute;
    opacity: 0;
    transform: translateX(-50px);
  }
  
  .slide-right-enter-from {
    opacity: 0;
    transform: translateX(-50px);
  }
  
  .slide-right-leave-to {
    position: absolute;
    opacity: 0;
    transform: translateX(50px);
  }
</style>