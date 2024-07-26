<template>
    <section class="header overview">
        <nav class="overview-header">
            <TimelineDropdown />
            <div class="wrapper">
                <h1>Overview</h1>
            </div>
            <div class="wrapper search">
                <button class="btn search">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>
                </button>
            </div>
        </nav>
    </section>
</template>

<script setup lang="ts">
import TimelineDropdown from './timelineDropdown.vue';

</script>

<style lang="css" scoped>
section {
    height: 44px;
    box-sizing: border-box;
}

.overview-header {
    display: grid;
    grid-template-columns: 82px 1fr 82px;
    height: 100%;
}


.wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
}

.wrapper.search {
    justify-content: flex-end;
}

h1 {
    font-family: 'Inter', sans-serif;
    color: var(--text-color);
    font-size: 14px;
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
</style>