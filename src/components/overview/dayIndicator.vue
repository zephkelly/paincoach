<template>
    <div>
        <p class="day-label" v-if="dayIndex <= 6">{{ labelContent }}</p>
        <span class="visual" :class="[`pain-level-${painLevel}`]"></span>
    </div>
</template>

<script setup lang="ts">
import { DayIndicatorLabel, DayLabel } from '@/types/dayIndicator';
import { PainLevel } from '@/types/painLevel';

interface Props{
    labelType: DayIndicatorLabel,
    labelContent: DayLabel | Number,
    painLevel: DayIndicatorPainLevel,
    dayIndex: Number
}

const props = defineProps<Props>();

console.log(props.labelContent);
</script>

<style lang="css" scoped>
p {
    text-align: center;
    font-size: 10px;
    color: var(--text-color);
    margin-bottom: 8px;
}

span {
    display: flex;
    height: 34px;
    width: 34px;
    background-color: var(--pain-none);
    border-radius: 50%;
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
</style>