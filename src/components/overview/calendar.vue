<template>
    <section class="calendar overview" :class="currentTimeline" ref="parentContainer">
        <div class="title wrapper">
            <h2>This Week</h2>
            <h3>Aug 11</h3>
        </div>
        <div class="wrapper days">
            <div ref="daysContainer" :style="daysContainerWidthStyle">
                <DayIndicator v-for="(day, index) in numberOfDays" labelType="day" :dayIndex="index" :labelContent="dayLabels[index % 7]" :painLevel="generatedPainLevels[index]" />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import DayIndicator from '@/components/overview/dayIndicator.vue';
import { useTimeline } from '@/composables/overview/currentTimeline';
import { DayIndicatorLabel, DayLabel } from '@/types/dayIndicator';
import { PainLevel } from '@/types/painLevel';

const { currentTimeline, setTimeline } = useTimeline();
setTimeline('month');

// Dynamically set day container width
const parentContainer = ref<HTMLDivElement | null>(null);
const daysContainer = ref<HTMLDivElement | null>(null);

const numberOfDays = ref(7);
const daysContainerWidth = ref(0);
const isMounted = ref(false);

const parentContainerMargin = 32;
const dayIndicatorWidth = 34;
const dayIndicatorGap = 8;

function calculateDaysContainerWidth() {
    if (!parentContainer.value || !daysContainer.value) return;

    nextTick(() => {
        const parentWidth = parentContainer.value.clientWidth;
        const availableSpace = parentWidth - parentContainerMargin;

        let dayCount = Math.floor((availableSpace + dayIndicatorGap) / (dayIndicatorWidth + dayIndicatorGap));

        if (dayCount > numberOfDays.value) {
            dayCount = numberOfDays.value;
        }

        const totalWidth = dayCount * (dayIndicatorWidth + dayIndicatorGap) - dayIndicatorGap;
        daysContainerWidth.value = totalWidth;
    });
}

const daysContainerWidthStyle = computed(() => ({
    width: `${daysContainerWidth.value}px`
}));

onMounted(() => {
    isMounted.value = true;
    generatedPainLevels.value = generatePainLevels(numberOfDays.value);

    const resizeObserver = new ResizeObserver(() => {
        if (isMounted.value) {
            calculateDaysContainerWidth();
        }
    });
    
    if (parentContainer.value) {
        resizeObserver.observe(parentContainer.value);
    }

    onUnmounted(() => {
        resizeObserver.disconnect();
    });
});

// define our day labels
const dayLabels: DayLabel[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// Rand pain levels
const painLevels: PainLevel[] = [0, 1, 2, 3, 'none'];

const generatedPainLevels = ref<PainLevel[]>([]);

function generatePainLevels(count: number) {
  return Array.from({ length: count }, () => {
    const randomIndex = Math.floor(Math.random() * painLevels.length);
    return painLevels[randomIndex];
  });
}

// Setting  number of days based on current timeline


switch (currentTimeline.value) {
    case 'week':
        numberOfDays.value = 7;
        console.log('Week');
        break;
    case 'fortnight':
        numberOfDays.value = 14;
        console.log('Fortnight');
        break;
    case 'month':
        numberOfDays.value = 30;
        console.log('Month');
        break;
    default:
        numberOfDays.value = 7;
        console.log('Week');
        break;
}

watch(currentTimeline, () => {
    nextTick(() => {
        calculateDaysContainerWidth();
    });
});

watch(numberOfDays, (newCount) => {
    generatedPainLevels.value = generatePainLevels(newCount);
});
</script>

<style lang="css" scoped>
section {
    width: 100%;
    padding: 24px 16px;
    background-color: var(--panel);
    border-radius: 16px;
    transition: width 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
}

section.week {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.title {
    display: flex;
    justify-content: flex-start;
    gap: 12px;
}

.days {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 32px;

}

.days > div {
    display: inline-flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 8px;
}

h2, h3 {
    font-family: 'Inter', sans-serif;
    color: var(--text-color);
    font-size: 16px;
    font-weight: 500;
    margin: 0;
}

h3 {
    opacity: 0.2;
}
</style>