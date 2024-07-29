<template>
    <nav>
        <div class="wrapper">
            <button @click.prevent="toggleEnabled" :class="currentTimeline">
                <p>{{ displayTimeline }}</p>
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"><path d="M480-397.85 311.85-566h336.3L480-397.85Z"/></svg>
            </button>
            <!-- Optionally render other buttons on press -->
        </div>
    </nav>
</template>

<script setup lang="ts">
const { toggleEnabled } = useTimelineDropdown();
const { currentTimeline } = useOverviewTimeline();

const displayTimeline = computed(() => {
  return currentTimeline.value === 'week' ? '7 Days' : currentTimeline.value;
});
</script>

<style lang="css" scoped>
nav {
    display: flex;
    align-items: center;
    justify-content: center;
}

.wrapper {
    display: flex;
    height: 32px;
    width: 100%;
    border-radius: 10px;
    background-color: var(--panel);
}

button {
    position: relative;
    width: 100%;
    padding: 8px 12px;
}

button p {
    margin: 0;
    font-family: 'Inter', sans-serif;
    color: var(--text-color);
    font-size: 12px;
    font-weight: 500;
    text-align: left;
}

button svg {
    right: 4px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    fill: var(--text-color);
}
</style>