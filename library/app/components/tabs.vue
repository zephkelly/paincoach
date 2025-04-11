<template>
    <div class="tabs-container">
        <div class="tabs-header" :class="{ 'loading': loading }">
            <template v-if="!tabs || tabs.length === 0">
                <div
                    class="tab-header" v-for="i in 3"
                    :class="{ 'active': activeTabIndex === i - 1 }"
                    :style="{ width: (loading) ? getFixedWidth(i) + 'px' : 90 + 'px' }"
                >
                    <div 
                        class="loading-header skeleton-component"
                        :class="{ 'skeleton-component-panel': activeTabIndex === i - 1 }"
                        @click="setActiveTab(i - 1)"
                    >
                        <div 
                            class="loading-header-text skeleton-component"
                            :class="{ 'skeleton-component-panel': activeTabIndex !== i - 1 }"
                            :style="{ width: 90 * getFixedWidth(i) * 0.6 + 'px'}"
                        ></div>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="tab-header" v-for="(tab, index) in tabs"
                    :class="{ 'active': activeTabIndex === tabs?.indexOf(tab) }"
                    :style="{ width: (loading) ? (tab.headerWidth * getFixedWidth(index)) + 'px' : tab.headerWidth + 'px' }"
                >
                    <template v-if="loading">
                        <div
                            class="loading-header skeleton-component"
                            :class="{ 'skeleton-component-panel': activeTabIndex === tabs?.indexOf(tab) }"
                            @click="setActiveTab(tabs.indexOf(tab))"
                        >
                            <div 
                                class="loading-header-text skeleton-component"
                                :class="{ 'skeleton-component-panel': activeTabIndex !== tabs?.indexOf(tab) }"
                                :style="{ width: tab.headerWidth * getFixedWidth(index) * 0.6 + 'px'}"
                            ></div>
                        </div>
                    </template>
                    <template v-else>
                        <button
                            :key="tab.label"
                            class="tab-button"
                            @click="setActiveTab(tabs.indexOf(tab))"
                        >
                        {{ tab.label }}
                        </button>
                    </template>
                
                </div>
            </template>
        </div>
        <div class="tab-content">
            <TransitionGroup name="fast-fade-page" tag="div" class="content-transition-wrapper">
                <div class="tab-item loading" v-if="!tabs || loading">
                    <div class="loading-header skeleton-component"></div>
                </div>
                <component
                    class="tab-item"
                    v-else-if=" tabs && tabs.length > 0 && tabs[activeTabIndex]?.component !== undefined"
                    :is="tabs[activeTabIndex]?.component"
                ></component>
                <div v-else-if="tabs && tabs.length > 0" class="tab-item empty-tab-message">
                    No content available for this tab
                </div>
                <div v-else class="tab-item empty-tab-message">
                    No tabs available
                </div>
            </TransitionGroup>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { type TabItem } from '@/types/tab/item';

const props = defineProps<{
    loading: boolean;
    tabs: TabItem[];
    defaultTabIndex?: number;
}>();

const emit = defineEmits<{
    (e: 'tab-changed', index: number, tab: TabItem): void;
}>();

const route = useRoute();
const router = useRouter();

const activeTabIndex = ref(props.defaultTabIndex || 0);

// Pre-defined fixed values for widths to ensure consistency between server and client
// These are static and will be the same on both server and client
const fixedWidths: Record<number, number> = {
    0: 0.9,  // index 0 -> 90% width
    1: 0.87, // index 1 -> 95% width
    2: 0.85, // index 2 -> 85% width
    3: 0.92, // and so on...
    4: 0.88,
    5: 0.93,
    6: 0.87,
    7: 0.94,
    8: 0.89,
    9: 0.91,
    10: 0.86,
    11: 0.92,
    12: 0.88,
    13: 0.90,
    14: 0.87,
    15: 0.93,
    16: 0.89,
    17: 0.91,
    18: 0.86,
    19: 0.94
};

// Function to get the fixed width for an index
const getFixedWidth = (index: number): number => {
    // Use modulo to handle any index, even if it's larger than our predefined set
    const normalizedIndex = index % 20;
    return fixedWidths[normalizedIndex] || 0.9; // Fallback to 0.9 if not found
};

const setActiveTab = (index: number): void => {
    if (!props.tabs) {
        return;
    }

    if (index >= 0 && index < props.tabs.length) {
        activeTabIndex.value = index;

        // Update URL query parameter
        updateUrlQueryParam(index);

        const newTab = props.tabs[index];

        if (!newTab) {
            return;
        }

        emit('tab-changed', index, newTab);
    }
    else if (index >= 0 && props.tabs.length === 0) {
        activeTabIndex.value = index;
        // Update URL query parameter even for empty tabs
        updateUrlQueryParam(index);
    }
};

// Function to update the URL query parameter
const updateUrlQueryParam = (index: number): void => {
    const query = { ...route.query, tab: index.toString() };
    router.replace({ query });
};

// Watch for URL query parameter changes
watch(() => route.query.tab, (newTabParam) => {
    if (newTabParam !== undefined) {
        const newIndex = parseInt(newTabParam as string, 10);
        if (!isNaN(newIndex) && newIndex !== activeTabIndex.value) {
            // Only update if it's a valid tab index
            if (props.tabs && newIndex >= 0 && newIndex < props.tabs.length) {
                activeTabIndex.value = newIndex;
            }
        }
    }
}, { immediate: true });

// Watch for prop changes to defaultTabIndex
watch(() => props.defaultTabIndex, (newValue) => {
    if (newValue !== undefined && route.query.tab === undefined) {
        setActiveTab(newValue);
    }
});

// Initialize from URL on component mount
onMounted(async () => {
    // Wait for tabs to be available
    await nextTick();
    
    // Check if there's a tab parameter in the URL
    const tabParam = route.query.tab;
    if (tabParam !== undefined) {
        const tabIndex = parseInt(tabParam as string, 10);
        if (!isNaN(tabIndex) && props.tabs && tabIndex >= 0 && tabIndex < props.tabs.length) {
            setActiveTab(tabIndex);
        } else {
            // If invalid tab parameter, update URL to current active tab
            updateUrlQueryParam(activeTabIndex.value);
        }
    } else if (props.defaultTabIndex !== undefined) {
        // If no tab parameter but defaultTabIndex is provided, use it and update URL
        setActiveTab(props.defaultTabIndex);
    } else {
        // If neither exists, ensure URL reflects the current active tab (0)
        updateUrlQueryParam(activeTabIndex.value);
    }
});
</script>
  
<style scoped lang="scss">
.tabs-container {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
}

.tabs-header {
    display: flex;
    border-bottom: 1px solid var(--border-5-color);
    height: 38px;
    background-color: var(--background-color);
}

.tab-header:not(.loading) {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
    overflow: hidden;
    color: var(--text-color);
    border: 1px solid var(--border-5-color);
    border-bottom: none;
    border-left: none;
    transition: width 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);

    &:first-child {
        border-top-left-radius: 0px;
    }

    &:last-child {
        border-top-right-radius: 8px;
    }

    &:hover {
        button {
            background-color: var(--background-4-color);
            color: var(--text-color);
        }
    }

    &:focus {
        button {
            outline: none;
        }
    }

    &.active {
        button {
            background-color: var(--background-4-color);
            color: var(--text-color);
        }
    }

    button {
        width: 100%;
        height: 100%;
        padding: 10px 15px;
        background-color: transparent;
        border: none;
        color: var(--text-3-color);
        transition: color 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);
        background-color: var(--background-1-color);
        cursor: pointer;
        text-wrap: nowrap;
    }
}

.tab-content {
    padding: 1rem;
    min-height: calc(100dvh - 6.2rem - 54px - 40px - 38px);
    // overflow-y: auto;
    position: relative;
    background-color: var(--background-3-color);

    .content-transition-wrapper {
        position: relative;
        min-height: 100%;
    }

    .tab-item {
        width: stretch;
        height: auto;
    }
}

.empty-tab-message {
    padding: 20px;
    text-align: center;
    color: var(--text-5-color);
    font-style: italic;
}

.loading-header {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .loading-header-text {
        width: 80%;
        height: 12px;
        // background-color: var(--background-1-color);
        border-radius: 1rem;
    }
}
</style>