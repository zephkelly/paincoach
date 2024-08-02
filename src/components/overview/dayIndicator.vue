<template>
    <div>
        <p class="day-label" v-if="dayIndex <= 6">{{ labelContent }}</p>
        <span class="visual first-row" :class="[`pain-level-${painLevel}`]" v-if="dayIndex <= 6"></span>
        <span class="visual" :class="[`pain-level-${painLevel}`]" v-if="dayIndex > 6 "></span>
    </div>
</template>

<script setup lang="ts">
//@ts-ignore
import { type DayIndicatorLabelType } from '@types/dayIndicator';
//@ts-ignore
import type { PainLevel } from '@types/painLevel';
//@ts-ignore
import type { DayOfWeekLabel } from '@type/days';

interface Props {
    isEmpty: boolean,
    labelType: DayIndicatorLabelType,
    labelContent: DayOfWeekLabel | number,
    dayIndex: number
    painLevel?: PainLevel | null,
}



const props = defineProps<Props>();
</script>

<style lang="css">
:root {
    --day-indicator-size: 34px;
}

@media (max-width: 349px) {
    :root {
        --day-indicator-size: 28px;
    }
}
</style>

<style lang="css" scoped>
div {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    max-width: 60px;
    aspect-ratio: 1/1;
    will-change: transform;
}

p {
    font-family: 'Inter', sans-serif;
    text-align: center;
    font-size: 10px;
    color: var(--text-color);
    margin-bottom: 8px;
    font-size: clamp(10px, 3vw, 14px);
    opacity: 0.3;
}

@media (prefers-color-scheme: light) {
    p {
        opacity: 0.5;
    }
}

span {
    display: flex;
    width: 100%;
    height: 100%;
    max-height: 60px;
    max-width: 60px;
    background-color: var(--pain-none);
    border-radius: 50%;
    will-change: width, height;
    transition: width 0.28s ease, height 0.28s ease, background-color 0.28s ease;
    overflow: visible;
}

span.first-row {
    margin-top: 0px;
}

@media (max-width: 349px) {
    span {
        transition: width 0.08s ease, height 0.08s ease;
    }
}

.pain-level-0 {
    background-color: var(--pain-0);
}

.pain-level-1 {
    background-color: var(--pain-1);
}

.pain-level-2 {
    background-color: var(--pain-2);
}

.pain-level-3 {
    background-color: var(--pain-3);
}

.pain-level-none, .pain-level-undefined {
    background-color: transparent;
}
</style>