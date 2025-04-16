<template>
    <EnhancedModal
        ref="modalRef"
        identifier="recordRequestModal"
        :open="recordRequestModalOpen"
        :trigger-event="lastClickEvent"
        :enable-drag="true"
        :is-full-page="isFullPageMode"
        :current-page="currentPage"
        :total-pages="totalPages"
        :count-first-page="false"
        placement="bottom"
        @close="closeModal"
        @update:is-full-page="isFullPageMode = $event"
        @update:current-page="currentPage = $event"
        @page-changed="handlePageChange"
    >
        <!-- Shared components (visible on all pages) -->
        <template #shared>
            <div class="progress-container" v-if="isFullPageMode">
                <div class="progress-bar">
                    <div class="progress" :style="{ width: `${progressPercentage}%` }"></div>
                </div>
                <!-- <div class="progress-text">{{ displayCurrentPage }} / {{ displayTotalPages }}</div> -->
            </div>
        </template>
        
        <!-- First page (Bottom sheet mode) -->
        <template #page-1>
            <div class="modal-inner">
                <h2>It's time to make an entry</h2>
                <p>Click the button below to start recording.</p>
                <div class="graphic-container">
                    <LogContributionChart />
                </div>
                <div class="modal-actions">
                    <EButton
                        class="modal-button"
                        @click="startRecording"
                    >
                        Start now
                    </EButton>
                </div>
            </div>
        </template>
        
        <!-- Second page (Full page mode) -->
        <template #page-2>
            <div class="modal-inner full-page pain-level">
                <LogCard
                    title="What was your level of pain today?"
                >
                    <LogIconSlider
                        :min="0"
                        :max="10"
                        v-model="painLevel"
                        :value-config="{
                            precision: 0
                        }"
                        :indicators="{
                            stepIndicatorStyle: 'numbered',
                            maxIndicators: 11
                        }"
                        :descriptors="[
                            { label: 'No Pain', value: 0 },
                            { label: 'Mild', value: 2 },
                            { label: 'Moderate', value: 4 },
                            { label: 'Severe', value: 6 },
                            { label: 'Very severe', value: 8 },
                            { label: 'Worst pain imaginable', value: 10 }
                        ]"
                    >
                        <template #icon-0>
                            <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" width="32" height="32" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4"><path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/><path stroke-linecap="round" d="M31 18v1m-14-1v1m14 12s-2 4-7 4s-7-4-7-4"/></g></svg>
                        </template>

                        <template #icon-1>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><!-- Icon from IconPark Outline by ByteDance - https://github.com/bytedance/IconPark/blob/master/LICENSE --><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4"><path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/><path stroke-linecap="round" d="M31 18v1m-14-1v1m0 12h14"/></g></svg>
                        </template>

                        <template #icon-2>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><!-- Icon from IconPark Outline by ByteDance - https://github.com/bytedance/IconPark/blob/master/LICENSE --><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4"><path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/><path stroke-linecap="round" d="M31 18v1m-14-1v1m0 13l14-2"/></g></svg>
                        </template>

                        <template #icon-3>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4"><path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/><path stroke-linecap="round" d="M31 18v1m-14-1v1m14 12s-2-4-7-4s-7 4-7 4"/></g></svg>
                        </template>

                        <template #icon-4>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4"><path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/><path stroke-linecap="round" d="m33 25l-4-2m-11 0l-4 2m17 10s-2-4-7-4s-7 4-7 4"/></g></svg>
                        </template>
                    </LogIconSlider>
                    <div class="modal-actions">
                        <EButton
                            identifier="recordRequestModal"
                            class="modal-button"
                            @click="saveEntry"
                        >
                            Continue
                        </EButton>
                    </div>
                </LogCard>

            </div>
        </template>
        
        <!-- Third page -->
        <template #page-3>
            <div class="modal-inner full-page">
                <h2>Record your entry</h2>
                <p>Share what's on your mind today.</p>
                
                <div class="recording-container" style="display: flex; flex-direction: column; align-items: center; position: relative; box-sizing: border-box;">

                    <textarea 
                        style="max-width: 100%; height: 200px; box-sizing: border-box;"
                        v-model="entryText" 
                        placeholder="Type your entry here..."
                        class="entry-textarea"
                    ></textarea>
                </div>
                
                <div class="modal-actions">
                    <EButton
                        class="modal-button"
                        @click="finishEntry"
                    >
                        Save
                    </EButton>
                </div>
            </div>
        </template>
    </EnhancedModal>
</template>

<script setup lang="ts">
import EnhancedModal from './enhancedModal.vue';

const {
    recordRequestModalOpen,
    lastClickEvent,
} = useRecordRequest();

const isFullPageMode = ref(false);
const currentPage = ref(1);
const totalPages = 3;

// Entry content
const entryText = ref('');
const selectedMood = ref('');

const modalRef = ref<InstanceType<typeof EnhancedModal> | null>(null);

const displayCurrentPage = computed(() => {
    return modalRef.value?.displayCurrentPage || 0;
});

const displayTotalPages = computed(() => {
    return modalRef.value?.displayTotalPages || 0;
});

const progressPercentage = computed(() => {
    if (currentPage.value === 1) {
        return 0;
    }
    return (displayCurrentPage.value / displayTotalPages.value) * 100;
});

// Methods
const openModal = (event: MouseEvent) => {
    lastClickEvent.value = event;
    recordRequestModalOpen.value = true;
};

const closeModal = () => {
    // Always completely close the modal
    recordRequestModalOpen.value = false;
    
    // Reset state when closed
    setTimeout(() => {
        currentPage.value = 1;
        isFullPageMode.value = false;
        entryText.value = '';
        selectedMood.value = '';
    }, 300);
};

// Add this function if you want to implement a confirmation dialog for unsaved data
const confirmClose = () => {
    // Example logic for adding confirmation
    if (entryText.value || selectedMood.value) {
        // Could show a confirmation dialog here
        if (confirm("You have unsaved changes. Are you sure you want to close?")) {
            closeModal();
        }
    } else {
        closeModal();
    }
};

const startRecording = () => {
    isFullPageMode.value = true;
    // setTimeout(() => {
        currentPage.value = 2;
    // }, 100); // Wait for the full-page transition to complete
};

const saveEntry = () => {
    // Go to next page
    currentPage.value = currentPage.value + 1;
};

const finishEntry = () => {
    // Save entry logic here
    console.log('Entry saved:', { text: entryText.value, mood: selectedMood.value });
    
    // Close modal
    closeModal();
};

const handlePageChange = (newPage: number, oldPage: number) => {
    console.log(`Page changed from ${oldPage} to ${newPage}`);
};

// Expose for use in parent components
defineExpose({
    openModal,
    closeModal
});
</script>

<style lang="scss" scoped>
.modal-inner {
    padding: 1rem;
    padding-bottom: 1.5rem;
    position: relative;
    
    &.full-page {
        padding: 1rem;
        padding-bottom: 1.5rem;
        min-height: calc(100vh - 150px);
        height: calc(100% - 20px - 1.5rem);
        display: flex;
        flex-direction: column;

        & > * {
            flex: 1;
            display: flex;
            flex-direction: column;
        }
    }
    
    h2 {
        font-size: 1.35rem;
        font-weight: 600;
        margin-bottom: 0.8rem;
        text-align: center;
    }
    
    p {
        font-size: 1rem;
        margin-bottom: var(--margin-medium);
        font-weight: 300;
        color: var(--text-3-color);
        text-align: center;
    }
    
    .graphic-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 2rem;
        margin-top: 2rem;
        width: 100%;
        transform: scale(0.9);
    }
}

.progress-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    padding: 0.5rem 0;
    
    .progress-bar {
        width: calc(100% - 24px - 1rem - 8px);
        height: 12px;
        background-color: var(--border-color);
        border-radius: 2px;
        overflow: hidden;
        
        .progress {
            height: 100%;
            background-color: var(--lifestyle-color);
            transition: width 0.3s ease;
        }
    }
    
    .progress-text {
        position: absolute;
        font-size: 0.8rem;
        margin-top: 0.5rem;
        color: var(--text-3-color);
    }
}

.recording-container, .details-container {
    flex: 1;
    width: 100%;
    margin-bottom: 1.5rem;
    
    .entry-textarea {
        width: 100%;
        height: 200px;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 1rem;
        font-family: var(--inter-font-family);
        font-size: 1rem;
        resize: none;
        
        &:focus {
            outline: none;
            border-color: var(--lifestyle-color);
        }
    }
}

.form-group {
    margin-bottom: 1.5rem;
    
    label {
        display: block;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
        font-weight: 500;
    }
}

.mood-selector {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    justify-content: center;
    
    .mood-button {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem;
        border-radius: 8px;
        border: 1px solid var(--border-color);
        background: transparent;
        cursor: pointer;
        transition: all 0.2s ease;
        
        span {
            margin-top: 0.5rem;
            font-size: 0.8rem;
        }
        
        &.active {
            border-color: var(--lifestyle-color);
            background-color: rgba(var(--lifestyle-color-rgb), 0.1);
        }
        
        &:hover:not(.active) {
            background-color: rgba(var(--border-color-rgb), 0.1);
        }
        
        &:active {
            transform: scale(0.98);
        }
    }
}

.modal-actions {
    margin-top: 3.5rem;
    .modal-button {
        width: 100%;
        font-size: 0.9rem;
        font-weight: 600;
        font-family: var(--inter-font-family);
        text-transform: uppercase;
        letter-spacing: 1px;
        padding: 1.35rem 1.5rem;
        // margin-bottom: 1rem;
        background-color: var(--lifestyle-color);
        border-color: var(--lifestyle-color);
        color: var(--text-color);
        
        &:active, &:hover {
            background-color: var(--lifestyle-2-color);
            border-color: var(--lifestyle-2-color);
        }
    }
}
</style>