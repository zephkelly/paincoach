<template>
    <section class="calendar overview panel" :class="currentTimeline" ref="parentContainer">
        <div class="headers wrapper">
            <h2>This <span>{{ currentTimeline }}</span></h2>
            <h3>
                {{ currentDateLabel }}
            </h3>
        </div>
        <div class="wrapper days">
            <!-- <div ref="daysContainer" class="days-grid"> -->
                <TransitionGroup name="list" tag="div" class="days-grid">
                    <OverviewDayIndicator v-for="emptyDay in emptyDaysAtStart"
                        :key="`empty-${emptyDay}`"
                        :labelType="dayLabelType"
                        :labelContent="daysOfWeekLabels[emptyDay - 1 % 7]"
                        :painLevel="null"
                        :isEmpty="true"
                        :dayIndex="emptyDay"
                    />
                    <OverviewDayIndicator v-for="day in calendarDays"
                        :key="day.index"
                        :labelType="dayLabelType"
                        :labelContent="daysOfWeekLabels[day.index % 7]"
                        :painLevel="day.painLevel"
                        :isEmpty="false"
                        :dayIndex="day.index"
                    />
                </TransitionGroup>
            <!-- </div> -->
        </div>
    </section>
</template>

<script setup lang="ts">
import { getStartingDayOfWeekIndex, getMonthDays,  getDayOfWeek, getDayOfWeekShort, type CalendarDay, type CalendarMonth } from '@/types/calendar';
import type { DayIndicatorLabelType } from '@/types/dayIndicator';
import { type PainLevel } from '@/types/painLevel';
import { daysOfWeekLabels } from '@/types/day';
import { getEmptyDaysAtStart, generateCalendarDays, getStartOfWeek, getEndOfWeek, getStartOfFortnight, getEndOfFortnight, currentDateMonthDay } from '@/utils/calendar';
import OverviewDayIndicator from '@/components/app/overview/dayIndicator.vue';

const props = defineProps<{
  initialDate: Date;
}>();

const isMounted = ref(false);

const { currentTimeline } = useOverviewTimeline();
const currentMonth = ref<CalendarMonth>({
    date: props.initialDate,
    days: [],
    startingDayIndex: getStartingDayOfWeekIndex(props.initialDate)
});

const dayLabelType = ref<DayIndicatorLabelType>('day');

const emptyDaysAtStart = computed(() => { 
    return getEmptyDaysAtStart(new Date(), currentTimeline.value);
});

const calendarDays = computed(() => {
    const today = new Date();
    let startDate: Date;
    let endDate: Date;

    switch(currentTimeline.value) {
        case 'week':
            startDate = getStartOfWeek(today);
            endDate = getEndOfWeek(today);
            break;
        case 'fortnight':
            startDate = getStartOfFortnight(today);
            endDate = getEndOfFortnight(today);
            break;
        case 'month':
        default:
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            break;
    }

    return generateCalendarDays(startDate, endDate, emptyDaysAtStart.value);
});

const currentDateLabel = computed(() => {
    if (isMounted.value === false) return currentDateMonthDay();

    switch (currentTimeline.value) {
        case 'week':
            return currentDateMonthDay();
        case 'fortnight':
            return currentDateMonthDay();
        case 'month':
        default:
            return currentMonth.value.date.toLocaleString('default', { month: 'long', year: 'numeric' });
    }
});

onMounted(() => {
    isMounted.value = true;
});
</script>

<style lang="css" scoped>
.calendar {
    width: 100%;
    box-sizing: border-box;
    max-width: 452px;
    min-width: 268px;
    transition: height 0.5s ease;
}

.headers.wrapper {
    display: flex;
    justify-content: flex-start;
    margin-bottom: calc(1.5rem + 2rem);
    width: 100%;
}

h2 h3 {
    transition: position 0.5s ease;
}

.headers.wrapper > h2 {
    margin-right: 4%;
}

.headers.wrapper > h2 > span {
    text-transform: capitalize;
}

.headers.wrapper > h3 {
    opacity: 0.3;
}

@media (prefers-color-scheme: light) {
    .headers.wrapper > h3 {
        opacity: 0.5;
    }
}

.wrapper.days {
    width: 100%;
}

.days-grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    grid-auto-columns: minmax(0, 1fr);
    grid-auto-rows: 1fr;
    grid-template-rows: 1fr;
    justify-content: space-around;
    gap: 0.5rem 0.5rem;
    margin: 0 auto;
    box-sizing: border-box;
    transition: height 0.5s ease, width 0.5s ease;
    will-change: height, width;
}

.list-enter-active {
  transition: transform 0.4s ease;
}

.list-enter-from {
  transform: translateY(10px);
}

.list-enter-to {
  transform: translateY(0);
}

.list-leave-active {
    transition: transform 0s;
}

.list-leave-to {
    opacity: 0;
}
</style>