<template>
    <div>
        <p class="day-label" v-if="dayIndex <= 6">{{ labelContent }}</p>
        <span class="visual" :class="[`pain-level-${painLevel}`, { 'first-row': dayIndex <= 6 }]"></span>
    </div>
</template>

<script setup lang="ts">
import { type DayIndicatorLabelType } from '~~/shared/types/day';
import type { PainLevel } from '~~/shared/types/pain';
import type { DayOfWeekLabel } from '~~/shared/types/day';

interface Props {
    isEmpty: boolean,
    labelType: DayIndicatorLabelType,
    labelContent: DayOfWeekLabel | number,
    dayIndex: number
    painLevel: PainLevel
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
    position: absolute;
    top: -32px;
    font-family: 'Inter', sans-serif;
    text-align: center;
    font-size: 10px;
    color: var(--text-color);
    margin-bottom: 8px;
    font-size: var(--font-size-12);
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
    min-width: 20px;
    min-height: 20px;
    max-height: 60px;
    max-width: 60px;
    background-color: var(--pain-missing);
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

.pain-level-missing {
    background-color: var(--pain-missing);
}

.pain-level-none, .pain-level-undefined {
    background-color: transparent;
}
</style>