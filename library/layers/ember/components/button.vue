<template>
    <button :disabled="loading">
        <span v-if="loading" class="spinner">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/>
                <path fill="currentColor" d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z">
                    <animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/>
                </path>
            </svg>
        </span>
        <span class="button-content" :class="{ 'hidden': loading }">
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
        color: var(--text-color);
        fill: var(--text-color);
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
}
</style>