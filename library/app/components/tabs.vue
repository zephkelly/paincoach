<template>
    <div class="tabs-container">
      <div class="tabs-header">
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          class="tab-button"
          :class="{ 'active': activeTabIndex === index }"
          @click="setActiveTab(index)"
        >
          {{ tab.label }}
        </button>
      </div>
      <div class="tab-content">
        <component 
          :is="tabs[activeTabIndex]?.component" 
          v-if="tabs.length > 0 && tabs[activeTabIndex]?.component !== undefined"
        ></component>
        <div v-else-if="tabs.length > 0" class="empty-tab-message">
          No content available for this tab
        </div>
        <div v-else class="empty-tab-message">
          No tabs available
        </div>
      </div>
    </div>
  </template>
  
<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';

// Define types
interface TabItem {
    label: string;
    component?: any;
}

// Define props
const props = defineProps<{
    tabs: TabItem[];
    defaultTabIndex?: number;
}>();

// Define emits
const emit = defineEmits<{
    (e: 'tab-changed', index: number, tab: TabItem): void;
}>();

// Setup reactive data
const activeTabIndex = ref(props.defaultTabIndex || 0);

// Methods
const setActiveTab = (index: number): void => {
    if (index >= 0 && index < props.tabs.length) {
        activeTabIndex.value = index;

        const newTab = props.tabs[index];

        if (!newTab) {
            return;
        }

        emit('tab-changed', index, newTab);
    }
};

// Watch for changes in defaultTabIndex
watch(() => props.defaultTabIndex, (newValue) => {
    if (newValue !== undefined) {
        setActiveTab(newValue);
    }
});
</script>
  
<style scoped>
.tabs-container {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.tabs-header {
    display: flex;
    border-bottom: 1px solid #e0e0e0;
}

.tab-button {
    padding: 10px 15px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
}

.tab-button:hover {
    background-color: #f5f5f5;
}

.tab-button.active {
    border-bottom: 2px solid #2c3e50;
    font-weight: bold;
}

.tab-content {
    padding: 15px;
    background-color: #fff;
}

.empty-tab-message {
    padding: 20px;
    text-align: center;
    color: #666;
    font-style: italic;
}
</style>