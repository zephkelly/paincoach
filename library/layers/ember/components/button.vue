<template>
    <button>
        <slot></slot>
    </button>
</template>

<style lang="scss" scoped>
button {
    border: 1px solid var(--border-8-color);
    border-radius: 8px;
    padding: 0.5rem 1rem;
}
</style>