<template>
    <EnhancedModal
        identifier="recordRequestModal"
        :open="recordRequestModalOpen"
        :trigger-event="lastClickEvent"
        :enable-drag="true"
        :is-full-page="isFullPageMode"
        :current-page="currentPage"
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
                <div class="progress-text">{{ currentPage }} / {{ totalPages }}</div>
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
                        @click="saveEntry"
                    >
                        Continue
                    </EButton>
                </div>
            </div>
        </template>
        
        <!-- Third page -->
        <template #page-3>
            <div class="modal-inner full-page">
                <h2>Add details</h2>
                <p>Add some context to your entry.</p>
                
                <div class="details-container">
                    <!-- Content for the third page -->
                    <div class="form-group">
                        <label>How are you feeling?</label>
                        <div class="mood-selector">
                            <button 
                                v-for="mood in moods" 
                                :key="mood.value"
                                :class="['mood-button', { active: selectedMood === mood.value }]"
                                @click="selectedMood = mood.value"
                            >
                                {{ mood.emoji }}
                                <span>{{ mood.label }}</span>
                            </button>
                        </div>
                    </div>
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

// Moods for the selector
const moods = [
    { value: 'great', label: 'Great', emoji: '😁' },
    { value: 'good', label: 'Good', emoji: '🙂' },
    { value: 'okay', label: 'Okay', emoji: '😐' },
    { value: 'sad', label: 'Sad', emoji: '😔' },
    { value: 'bad', label: 'Bad', emoji: '😫' }
];

// Computed properties
const progressPercentage = computed(() => {
    return ((Number(currentPage.value) - 1) / (totalPages - 1)) * 100;
});

// Methods
const openModal = (event: MouseEvent) => {
    lastClickEvent.value = event;
    recordRequestModalOpen.value = true;
};

const closeModal = () => {
    recordRequestModalOpen.value = false;
    // Reset state when closed
    setTimeout(() => {
        currentPage.value = 1;
        isFullPageMode.value = false;
        entryText.value = '';
        selectedMood.value = '';
    }, 300);
};

const startRecording = () => {
    // Transition to full page mode and go to next page
    isFullPageMode.value = true;
    setTimeout(() => {
        currentPage.value = 2;
    }, 300); // Wait for the full-page transition to complete
};

const saveEntry = () => {
    // Go to next page
    currentPage.value = 3;
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
    
    &.full-page {
        padding: 1.5rem;
        min-height: calc(100vh - 150px);
        display: flex;
        flex-direction: column;
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
    align-items: center;
    padding: 0.5rem 0;
    
    .progress-bar {
        width: 70%;
        height: 4px;
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
    .modal-button {
        width: 100%;
        font-size: 0.9rem;
        font-weight: 600;
        font-family: var(--inter-font-family);
        text-transform: uppercase;
        letter-spacing: 1px;
        padding: 1.35rem 1.5rem;
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



<!-- <template>
    <EModalBase
        identifier="recordRequestModal"
        :open="recordRequestModalOpen"
        :trigger-event="lastClickEvent"
        :enable-drag="true"
        placement="auto"
        @close="recordRequestModalOpen = false"
    >
        <div class="modal-inner">
            <h2>It's time to make an entry</h2>
            <p>Click the button below to start recording.</p>
            <div class="graphic-container">
                <LogContributionChart />
            </div>
            <div class="modal-actions">
                <EButton
                    class="modal-button"
                >
                    Start now
                </EButton>
            </div>
        </div>
    </EModalBase>

</template>

<script setup lang="ts">
import { useRecordRequest } from '~/composables/useRecordRequest';

const {
    recordRequestModalOpen,
    lastClickEvent,
} = useRecordRequest();
</script>

<style lang="scss" scoped>
.modal-inner {
    padding: 1rem;
    padding-bottom: 1.5rem;

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

.modal-actions {
    .modal-button {
        width: 100%;
        font-size: 0.9rem;
        font-weight: 600;
        font-family: var(--inter-font-family);
        text-transform: uppercase;
        letter-spacing: 1px;
        padding: 1.35rem 1.5rem;
        background-color: var(--lifestyle-color);
        border-color: var(--lifestyle-color);
        color: var(--text-color);

        &:active, &:hover {
            background-color: var(--lifestyle-2-color);
            border-color: var(--lifestyle-2-color);
        }
    }
}
</style> -->