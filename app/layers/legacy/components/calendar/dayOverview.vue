<template>
    <article class="day-overview" id="calendar-day-overview">
        <span class="severity-indicator" :style="{ backgroundColor: getPainColor(painLevel) }"></span>
        <div class="wrapper title">
            <Transition name="fade" mode="out-in">
                <h4 :key="`${dayShort}-${dayNumber}`">{{ dayShort }} {{ dayNumber }}</h4>
            </Transition>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M212.31-140Q182-140 161-161q-21-21-21-51.31v-535.38Q140-778 161-799q21-21 51.31-21h346.23l-60 60H212.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v535.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h535.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46v-288.77l60-60v348.77Q820-182 799-161q-21 21-51.31 21H212.31ZM480-480ZM380-380v-137.31l362.39-362.38q9.3-9.31 20.46-13.58 11.15-4.27 22.69-4.27 11.77 0 22.61 4.27Q819-889 827.92-880.08L878.15-830q8.69 9.31 13.35 20.54 4.65 11.23 4.65 22.77t-3.96 22.38q-3.96 10.85-13.27 20.15L515.38-380H380Zm456.77-406.31-50.23-51.38 50.23 51.38ZM440-440h49.85l249.3-249.31-24.92-24.92-26.69-25.69L440-492.38V-440Zm274.23-274.23-26.69-25.69 26.69 25.69 24.92 24.92-24.92-24.92Z"/></svg>
        </div>
        <Transition name="slide-fade" mode="out-in">
            <p class="subtitle" :key="`${month}-${year}-${dayNumber}`">{{ month }} {{ year }}</p>
        </Transition>
    </article>
</template>

<script setup lang="ts">
const props = defineProps<{
    dayShort: string;
    dayNumber: number;
    month: string;
    year: number;
    painLevel: number;
}>();

const getPainColor = (level: number) => {
    const painColors = ['var(--pain-0)', 'var(--pain-1)', 'var(--pain-2)', 'var(--pain-3)'];
    return painColors[level] || painColors[0];
};
</script>

<style lang="css" scoped>
.day-overview {
    box-sizing: border-box;
    position: relative;
    margin-top: 2rem;
    background-color: var(--panel);
    height: 250px;
    width: 100%;
    max-width: 452px;
    min-width: 268px;
    border-radius: 10px;
    overflow: hidden;
    padding: 16px;
    padding-top: calc(16px + 18px);
}

.severity-indicator {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 18px;
    transition: background-color 0.3s ease;
    will-change: background-color;
}

.wrapper.title, .subtitle {
    height: auto;
    width: 100%;
    color: var(--text-color);
    font-weight: 400;
    font-family: 'Inter', sans-serif;
}

.wrapper.title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: var(--font-size-16);
}

.wrapper.title svg {
    fill: var(--text-color);
}

.subtitle {
    justify-content: flex-start;
    font-size: var(--font-size-12);
    color: var(--text-color-secondary);
}

/* Fade animation */
.fade-enter-active {
    transition: opacity 2s cubic-bezier(0.075, 0.82, 0.165, 1);
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Slide animation */
.slide-fade-enter-active {
    transition: transform 1.5s cubic-bezier(0.075, 0.82, 0.165, 1), opacity 1s cubic-bezier(0.075, 0.82, 0.165, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateY(4px);
    opacity: 0;
}
</style>