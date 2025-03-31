<template>
    <button :disabled="loading" :class="buttonClasses">
        <span v-if="loading" class="spinner">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        </span>
        <span class="button-content" v-if="!loading">
            <slot></slot>
        </span>
    </button>
</template>

<script lang="ts" setup>
type ButtonProps = {
    loading?: boolean;
    variant?: 'default' | 'outlined';
};

const props = withDefaults(defineProps<ButtonProps>(), {
    loading: false,
    variant: 'default'
});

const buttonClasses = computed(() => ({
    'button--outlined': props.variant === 'outlined'
}));
</script>

<style lang="scss" scoped>
button {
    border: 1px solid var(--border-8-color);
    background-color: var(--text-color);
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
    width: auto;
    transition:
        opacity 0.5s cubic-bezier(0.075, 0.82, 0.165, 1),
        background-color 0.3s cubic-bezier(0.075, 0.82, 0.165, 1),
        color 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);

    &:hover {
        background-color: var(--text-1-color);
    }
   
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    &.button--outlined {
        background-color: transparent;
        color: var(--text-color);
        border-color: var(--text-4-color);
        
        .spinner svg {
            color: var(--border-8-color);
            fill: var(--border-8-color);
        }

        &:hover {
            background-color: var(--background-5-color);
            color: var(--text-color);
        }
    }

    &.open {
        background-color: var(--background-6-color);
        color: var(--text-1-color);
        border-color: var(--text-2-color);

        &:hover {
            background-color: var(--background-8-color);
        }
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
    
    :deep() {
        svg {
            height: 100%;
            width: auto;
            aspect-ratio: 1/1;
        }
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