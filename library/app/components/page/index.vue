<template>
    <div class="page-container">
        <div class="page-content">
            <div class="page-header">
                <slot name="header"/>
            </div>
            <div class="page-body">
                <slot name="default"/>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { type PageProps } from '@/types/page';

const props = defineProps<PageProps>();

const maxWidthStyle = props.maxWidth ? `${props.maxWidth}px` : 'auto';
const paddingStyle = props.padBody ? '0rem 1rem' : '0rem';

const bottomMarginStyle = props.bottomMargin ? '4rem' : '0';

const headingPadding = props.padBody ? '0rem 0rem' : '0rem 1rem';
</script>

<style lang="scss" scoped>
.page-container {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;
    flex-grow: 1;
}

.page-content {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    max-width: v-bind(maxWidthStyle);
    width: 100%;
    padding: v-bind(paddingStyle);
    margin-top: 1.5rem;
    margin-bottom: v-bind(bottomMarginStyle);
}

.page-header {
    display: flex;
    justify-content: flex-start;
    box-sizing: border-box;
    margin-bottom: 2.5rem;
    padding: v-bind(headingPadding);

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