<template>
    <div class="card-component">
        <slot />
    </div>
</template>

<style scoped>
.card-component {
    background-color: var(--panel-color);
    padding: 1rem;
    width: 100%;
    box-sizing: border-box;
    border-radius: 0.8rem;
}
</style>