<template>
    <button>
        <slot></slot>
    </button>
</template>

<style lang="scss" scoped>
button {
    border: 1px solid var(--border-8-color);
    color: var(--text-invert-color);
    border-radius: 8px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    opacity: 1;
    transition: 
        opacity 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}
</style>