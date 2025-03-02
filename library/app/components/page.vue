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
type PageProps = {
    maxWidth?: number;
}

const props = defineProps<PageProps>();

const maxWidthStyle = props.maxWidth ? `max-width: ${props.maxWidth}px;` : 'auto';
</script>

<style lang="scss" scoped>
.page-container {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;
}

.page-content {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    max-width: v-bind(maxWidthStyle);
    width: 100%;
    padding: 0rem 1rem;
    margin-top: 2rem;
    margin-bottom: 4rem;
}

.page-header {
    display: flex;
    justify-content: flex-start;
    box-sizing: border-box;

    :deep(h1) {
        font-size: 3rem;
        font-weight: 900;
    }
}

.page-body {
    width: 100%;
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
    box-sizing: border-box;
}
</style>