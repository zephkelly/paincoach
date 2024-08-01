<template>
    <div class="timeline" :class="{ open: isEnabled }">
        <button @click.prevent="toggleEnabled" class="main" :class="currentTimeline">
            <p>{{ currentTimelineLength.label }}</p>
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"><path d="M480-397.85 311.85-566h336.3L480-397.85Z"/></svg>
        </button>
        <nav v-show="isEnabled" class="menu">
            <ul>
                <li v-for="option in dropdownOptions" :key="option.value">
                    <button @click.prevent="selectTimeline(option.value)" :class="option.value">
                        <p>{{ option.label }}</p>
                    </button>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script setup lang="ts">
//@ts-ignore
import type { TimelineOverview } from '@types/timeline';
const { toggleEnabled, isEnabled  } = useTimelineDropdown();
const { currentTimeline, setTimeline } = useOverviewTimeline();

const timelineLengths: TimelineOverview[] = [
    { value: 'week', label: '7 Days' },
    { value: 'fortnight', label: '14 Days' },
    { value: 'month', label: '1 Month' }
];

const dropdownOptions = computed(() => {
    const options = [...timelineLengths];
    const currentIndex = options.findIndex(timeline => timeline.value === currentTimeline.value);
    if (currentIndex !== -1) {
        options.splice(currentIndex, 1);
    }
    return options;
});

const currentTimelineLength = computed(() => {
    return timelineLengths.find((timeline) => timeline.value === currentTimeline.value);
});

const selectTimeline = (value: TimelineOverview) => {
    setTimeline(value);
    toggleEnabled();
};
</script>

<style lang="css" scoped>
.timeline {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
    border-radius: 10px;
    margin-top: 6px;
    background-color: var(--panel);
    transition: background-color 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
}

.timeline.open {
    position: relative;
    height: auto;
    background-color: var(--panel-hover);
}

.timeline.open button:hover {
    background-color: var(--panel);
}

.timeline.open .main {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}

nav.menu {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
}

nav.menu ul, nav.menu li {
    width: 100%;
}

nav.menu li {
    background-color: transparent;
    transition: background-color 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
}

nav.menu li:hover {
    background-color: var(--panel);
}

nav.menu li:last-child {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
}



button {
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;
    padding: 8px 12px;
    border-radius: 10px;
    cursor: pointer;
}

button p {
    margin: 0;
    margin-bottom: 1px;
    font-family: 'Inter', sans-serif;
    color: var(--text-color);
    font-size: 12px;
    font-weight: 500;
    display: inline-bock;
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