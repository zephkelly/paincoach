<template>
    <button :disabled="loading" class="collapsable" :class="{ 'square': props.square, 'no-label': !label }">
        <span v-if="loading" class="spinner">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE --><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        </span>
        <span class="button-content" v-if="!loading" >
            <slot></slot>
            <span v-if="label" ref="labelRef" class="label">{{ label }}</span>
            <span v-if="$slots['trailing-icon']" class="trailing-icon">
                <slot name="trailing-icon"></slot>
            </span>
        </span>
    </button>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

type ButtonProps = {
    loading?: boolean;
    label?: string;
    square?: boolean;
};

const props = defineProps<ButtonProps>();


const labelRef = ref<HTMLElement | null>(null);
const calculatedWidth = computed(() => {
    if (!props.label) return '0px';
    
    const averageCharWidth = 8;
    const padding = 16;
    
    const width = props.label.length * averageCharWidth + padding;
    return `${width}px`;
});
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
    // min-width: 100px;
    width: auto;
    transition:
        background-color 0.35s cubic-bezier(0.075, 0.82, 0.165, 1),
        opacity 0.5s cubic-bezier(0.075, 0.82, 0.165, 1),
        width 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
   
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    &.collapsable {
        overflow: hidden;
        
        &:hover {
            background-color: var(--text-1-color);
            .button-content {
                gap: 0.5rem;
                
                .label {
                    max-width: v-bind(calculatedWidth);
                    opacity: 1;
                }
            }
        }

        &.square {
            padding: 0.5rem;
            transition:
                padding 0.5s cubic-bezier(0.075, 0.82, 0.165, 1),
                opacity 0.5s cubic-bezier(0.075, 0.82, 0.165, 1),
                width 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);

            &:hover {
                padding: 0.5rem 1rem;
            }
        }
        
        &.no-label {
            &:hover {
                padding: 0.5rem;
            }
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

.label {
    transition: 
        max-width 0.35s cubic-bezier(0.075, 0.82, 0.165, 1),
        opacity 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);
    white-space: nowrap;
    
    max-width: 0;
    opacity: 0;
    overflow: hidden;
    &.collapsed {
    }
}

.trailing-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: auto;

    svg {
        height: 100%;
        width: auto;
        aspect-ratio: 1/1;
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