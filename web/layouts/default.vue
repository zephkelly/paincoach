<template>
    <main class="platform-web">
       <slot/>
    </main>
</template>

<style lang="css">
main {
    padding: 1rem;
    background-color: var(--background-color);
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: calc(100vh - 2rem);
}

body {
    background-color: var(--background-color);
}
</style>