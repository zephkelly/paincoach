<template>
    <button :disabled="loading">
        <span v-if="loading" class="spinner">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE --><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        </span>
        <span class="button-content" v-if="!loading">
            <slot></slot>
        </span>
    </button>
</template>

<script lang="ts" setup>
type ButtonProps = {
    loading?: boolean;
};
const props = defineProps<ButtonProps>();
</script>

<style lang="scss" scoped>
button {
    border: 1px solid var(--border-8-color);
    color: var(--text-invert-color);
    border-radius: 8px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    opacity: 1;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    min-width: 100px;
    width: auto;
    transition:
        opacity 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
   
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}

.spinner {
    margin-right: 0.5rem;
    transition: opacity 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
    
    svg {
        color: var(--text-invert-color);
        fill: var(--text-invert-color);
        animation: spin 1s cubic-bezier(0.075, 0.82, 0.165, 1) infinite;
    }
}

.button-content {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    min-width: 100px;
    max-width: 200px;
    transition:
        max-width 0.35s cubic-bezier(0.075, 0.82, 0.165, 1),
        opacity 0.35s cubic-bezier(0.075, 0.82, 0.165, 1),
        gap 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);
    gap: 0.5rem;
    overflow: hidden;
    
    &.hidden {
        opacity: 0;
        max-width: 0;
        gap: 0;
    }
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>
