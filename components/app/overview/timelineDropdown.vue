<template>
    <div class="timeline" :class="{ open: isEnabled }">
        <button @click.prevent="debouncedToggleEnabled" class="main" :class="currentTimeline">
            <p>{{ currentTimelineLength?.label }}</p>
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"><path d="M480-397.85 311.85-566h336.3L480-397.85Z"/></svg>
        </button>
        <Transition name="fade">
            <nav v-show="isEnabled" class="menu">
                <ul>
                    <li v-for="option in dropdownOptions" :key="option.value">
                        <button @click.prevent="debouncedSelectTimeline(option.value)" :class="option.value">
                            <p>{{ option.label }}</p>
                        </button>
                    </li>
                </ul>
            </nav>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { type TimelineOverview, type TimelineOption } from '@/types/timeline';
import debounce from '@/utils/debounce';
const { toggleEnabled, isEnabled  } = useTimelineDropdown();
const { currentTimeline, setTimeline } = useOverviewTimeline();

const timelineLengths: TimelineOption[] = [
  { value: 'week', label: '7 Days' },
  { value: 'fortnight', label: '14 Days' },
  { value: 'month', label: '1 Month' }
];

const dropdownOptions = computed((): TimelineOption[] => {
    const options = [...timelineLengths];
    const currentIndex = options.findIndex(timeline => timeline.value === currentTimeline.value);
    return options;
});

const currentTimelineLength = computed((): TimelineOption | undefined => {
  return timelineLengths.find((timeline) => timeline.value === currentTimeline.value);
});

const debouncedToggleEnabled = debounce(toggleEnabled, 100);

const debouncedSelectTimeline = debounce((value: TimelineOverview) => {
  setTimeline(value);
  toggleEnabled();
}, 100);
</script>

<style lang="scss" scoped>
.timeline {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    background-color: var(--panel);
    transition: background-color 0.2s cubic-bezier(0.075, 0.82, 0.165, 1), box-shadow 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
    box-shadow: none;
    z-index: 100;
}

.timeline {
    button.main {
        background-color: transparent;
        border: none;
        width: 100%;
    }
}

.timeline.open {
    position: relative;
    height: auto;
    box-shadow: 0px 0px 80px 0px rgba(0, 0, 0, 0.9);
}

.timeline.open button:hover {
    background-color: var(--panel);
}

.timeline.open .main {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}

.timeline.open .main p {
    opacity: 0.3;
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
    background-color: var(--panel-hover);
    transition: background-color 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
    overflow: hidden;
}
nav.menu li button {
    border-radius: 0px;
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
    width: 80%;
    padding: 12px 12px;
    border-radius: 10px;
    cursor: pointer;
    height: 100%;
    min-height: 44px;
    background-color: transparent;
    border: none;
}

button.main p {
    transition: opacity 0.4s cubic-bezier(0.075, 0.82, 0.165, 1);
}

button p {
    position: relative;
    text-transform: capitalize;
    top: -1px;
    margin: 0;
    font-family: 'Inter', sans-serif;
    color: var(--text-color);
    font-size: 12px;
    line-height: 12px;
    font-weight: 400;
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

.fade-enter-active, .fade-leave-active {
    transition: opacity 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
}

.fade-enter, .fade-leave-to {
    opacity: 0;
}

.fade-enter-to, .fade-leave {
    opacity: 1;
}
</style>