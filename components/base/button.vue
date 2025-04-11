<template>
    <NuxtLink v-if="props.to" class="button link" :to="to" :aria-label="ariaLabel">
            <slot></slot>
    </NuxtLink>
    <button v-else class="button" :aria-label="ariaLabel">
        <slot></slot>
    </button>
</template>

<script lang="ts" setup>
const props = defineProps({
    to: String,
    ariaLabel: String
});
</script>

<style lang="scss" scoped>
.button {
    display: inline-block;
    padding: 0.8rem 1.5rem;
    font-size: 14px;
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
