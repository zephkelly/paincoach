<template>
    <div class="page-container">
        <div class="page-content">
            <div class="page-header" :class="{ 'has-content': hasHeaderContent }">
                <slot name="header"/>
            </div>
            <div class="page-body">
                <slot name="default"/>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { type PageProps } from '@@/app/types/page/index';
import { useSlots, ref, onMounted, onUpdated } from 'vue';

const props = defineProps<PageProps>();
const slots = useSlots();
const hasHeaderContent = ref(false);

const maxWidthStyle = props.maxWidth ? `${props.maxWidth}px` : 'auto';
const paddingStyle = props.padBody ? '0rem 1rem' : '0rem';
const contentContainerBottomMarginStyle = props.bottomMargin ? '4rem' : '0';
const pageContainerBottomMarginStyle = props.bottomMargin ? '86px' : '0';
const pageContainerMinHeightStyle = props.bottomMargin ? 'calc(100dvh - 2rem - 86px)' : 'calc(100dvh - 2rem)';
const headingPadding = props.padHeader ? '0rem 0rem' : '0rem 1rem';

// Check if header slot has content
const checkHeaderContent = () => {
    hasHeaderContent.value = !!slots.header && slots.header().length > 0;
};

onMounted(checkHeaderContent);
onUpdated(checkHeaderContent);
</script>

<style lang="scss" scoped>
.page-container {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;
    flex-grow: 1;
    padding: 0 1rem;
    padding-top: 1rem;
    margin-bottom: v-bind(pageContainerBottomMarginStyle);
    min-height: v-bind(pageContainerMinHeightStyle);
    background-color: var(--background-color);
    padding-bottom: 1rem;
}

.page-content {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    max-width: v-bind(maxWidthStyle);
    width: 100%;
    padding: v-bind(paddingStyle);
    // margin-top: 1.5rem;
    margin-bottom: v-bind(contentContainerBottomMarginStyle);
}

.page-header {
    display: flex;
    justify-content: flex-start;
    box-sizing: border-box;
    padding: v-bind(headingPadding);
    margin-bottom: 0; /* Default to no margin */
    
    &.has-content {
        margin-bottom: 2.5rem; /* Only apply margin when content exists */
    }
    
    :deep(h1) {
        font-size: 2.4rem;
        font-weight: 500;
    }
}

.page-body {
    display: flex;
    width: 100%;
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
    box-sizing: border-box;
    position: relative;
}
</style>