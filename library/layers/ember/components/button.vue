<template>
    <button :disabled="loading" :class="buttonClasses">
        <span v-if="loading" class="spinner">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg>
        </span>
        <span class="button-content" v-if="!loading">
            <slot></slot>
        </span>
    </button>
</template>

<script lang="ts" setup>
type ButtonProps = {
    loading?: boolean;
    spinnerInvert?: boolean;
    variant?: 'outlined' | 'ghost';
};

const props = defineProps<ButtonProps>();


const buttonClasses = computed(() => ({
    'button--outlined': props.variant === 'outlined',
    'button--ghost': props.variant === 'ghost',
    'spinner-inverted': props.spinnerInvert,
}));
</script>

<style lang="scss" scoped>
button {
    border: 1px solid var(--text-color);
    background-color: var(--text-color);
    color: var(--text-invert-color);
    border-radius: 6px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    opacity: 1;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    min-height: 32px;
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
    
    &.button--outlined, &.button--ghost {
        background-color: transparent;
        color: var(--text-color);
        border-color: var(--border-color);
        
        .spinner svg {
            color: var(--border-8-color);
            fill: var(--border-8-color);
        }

        &:hover {
            background-color: var(--background-5-color);
            color: var(--text-color);
        }
    }
    &.button--ghost {
        border-color: transparent;

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

    &.spinner-inverted {
        .spinner {
            svg {
                color: var(--text-invert-color);
                fill: var(--text-invert-color);
            }
        }
    }
}

.spinner {
    position: absolute;
    margin-right: 0.5rem;
    transition: opacity 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
    height: 100%;
    width: auto;
    aspect-ratio: 1/1;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
   
    svg {
        width: 65%;
        height: 65%;
        color: var(--text-color);
        fill: var(--text-color);
        // animation: spin 1s cubic-bezier(0.4, 0.0, 0.2, 1) infinite;
    }
}

.button-content {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    max-width: 200px;
    min-height: 100%;
    transition:
        max-width 0.35s cubic-bezier(0.075, 0.82, 0.165, 1),
        opacity 0.35s cubic-bezier(0.075, 0.82, 0.165, 1),
        gap 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);
    gap: 0.5rem;
   
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