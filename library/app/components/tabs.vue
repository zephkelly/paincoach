<template>
    <div class="tabs-container">
        <div class="tabs-header" :class="{ 'loading': loading }">
            <template v-if="!tabs || tabs.length === 0">
                <div
                    class="tab-header" v-for="i in 3"
                    :class="{ 'active': activeTabIndex === i - 1 }"
                    :style="{ width: (loading) ? (90 * (0.85 + Math.random() * 0.3)) + 'px' : 90 + 'px' }"
                >
                    <div 
                        class="loading-header skeleton-component"
                        :class="{ 'skeleton-component-panel': activeTabIndex === i - 1 }"
                        @click="setActiveTab(i - 1)"
                    >
                        <div 
                            class="loading-header-text skeleton-component"
                            :class="{ 'skeleton-component-panel': activeTabIndex !== i - 1 }"
                            :style="{ width: 90 * (0.85 + Math.random() * 0.3) * 0.5 + 'px'}"
                            
                        ></div>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="tab-header" v-for="(tab, index) in tabs"
                    :class="{ 'active': activeTabIndex === tabs?.indexOf(tab) }"
                    :style="{ width: (loading) ? (tab.headerWidth * (0.85 + Math.random() * 0.3)) + 'px' : tab.headerWidth + 'px' }"
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
                                :style="{ width: tab.headerWidth * (0.85 + Math.random() * 0.3) * 0.5 + 'px'}"
                                
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
            <TransitionGroup name="fast-fade" tag="div" class="content-transition-wrapper">
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
interface TabItem {
    label: string;
    headerWidth: number;
    component?: any;
}

const props = defineProps<{
    loading: boolean;
    tabs: TabItem[];
    defaultTabIndex?: number;
}>();

const emit = defineEmits<{
    (e: 'tab-changed', index: number, tab: TabItem): void;
}>();

const activeTabIndex = ref(props.defaultTabIndex || 0);

const setActiveTab = (index: number): void => {
    if (!props.tabs) {
        return;
    }

    if (index >= 0 && index < props.tabs.length) {
        activeTabIndex.value = index;

        const newTab = props.tabs[index];

        if (!newTab) {
            return;
        }

        emit('tab-changed', index, newTab);
    }
    else if (index >= 0 && props.tabs.length === 0) {
        activeTabIndex.value = index;
    }
};

watch(() => props.defaultTabIndex, (newValue) => {
    if (newValue !== undefined) {
        setActiveTab(newValue);
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
    border-bottom: 1px solid var(--border-color);
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
    border: 1px solid var(--border-color);
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
            background-color: var(--background-3-color);
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
    height: calc(100dvh - 6rem - 59px - 40px - 38px);
    overflow-y: auto;

    .content-transition-wrapper {
        position: relative;
        min-height: 100%;
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