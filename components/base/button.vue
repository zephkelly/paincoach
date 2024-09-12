<template>
    <NuxtLink v-if="props.href" class="button link" to="/">
            <slot></slot>
    </NuxtLink>
    <button v-else class="button">
        <slot></slot>
    </button>
</template>

<script lang="ts" setup>
const props = defineProps({
    href: Boolean,
});
</script>

<style lang="scss" scoped>
.button {
    display: inline-block;
    padding: 0.5rem 1rem;
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    color: var(--background);
    background-color: var(--text-color);
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: background-color 0.1s ease;

    &:hover {
        background-color: var(--accent-hover);
    }
}
</style>
