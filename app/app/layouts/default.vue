<template>
    <div class="default-layout">
        <main>
            <slot />
        </main>
        <Navbar />
    </div>
</template>

<style lang="scss" scoped>
.default-layout {
    display: flex;
    flex-direction: column;
    background-color: var(--background-color);
}
</style>