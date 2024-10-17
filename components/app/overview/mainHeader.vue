<template>
    <section class="header overview">
        <header class="overview-header">
            <div class="wrapper timeline">
                <component :is="dynamicDropdownComponent" />
            </div>
            <div class="wrapper">
                <h1>{{ title }}</h1>
            </div>
            <div class="wrapper search">
                <button class="btn search">
                    <svg class="search" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M762.69-160.92 524.46-399.16q-30 22.77-65.79 35.27-35.79 12.5-73.87 12.5-93.58 0-159.11-65.51-65.53-65.51-65.53-159.04 0-93.52 65.51-159.1 65.51-65.57 159.04-65.57 93.52 0 159.1 65.53 65.57 65.53 65.57 159.11 0 39.23-12.88 75.02-12.89 35.8-34.89 64.64l238.23 238.23-37.15 37.16ZM384.77-403.38q72.31 0 122.46-50.16 50.16-50.15 50.16-122.46t-50.16-122.46q-50.15-50.16-122.46-50.16t-122.46 50.16Q212.15-648.31 212.15-576t50.16 122.46q50.15 50.16 122.46 50.16Z"/></svg>
                </button>
            </div>
        </header>
    </section>
</template>

<script setup lang="ts">
//define props for the h1 element title
const props = defineProps<{
    title: string;
    dynamicDropdownComponent: object;
}>();


</script>

<style lang="css" scoped>
section {
    height: 44px;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 2rem;
    padding: 0 1rem;
    padding-top: 1rem;
}

.overview-header {
    display: grid;
    grid-template-columns: 96px 1fr 96px;
    grid-template-rows: 44px;
    height: 100%;
    width: 100%;
    max-width: 1000px;
}

.wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
}

.wrapper.timeline {
    align-items: flex-start;
}

.wrapper.search {
    justify-content: flex-end;
}

h1 {
    font-family: 'Inter', sans-serif;
    color: var(--text-color);
    font-weight: 400;
    font-size: var(--font-size-14);
    letter-spacing: 0.1px;;
}

.btn.search {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
    width: 44px;
    height: 100%;
}

.btn.search svg {
    fill: var(--text-color);
    width: 28px;
    height: 28px;
}
</style>