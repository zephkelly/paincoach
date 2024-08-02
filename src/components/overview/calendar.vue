<template>
    <section class="calendar overview panel" :class="currentTimeline" ref="parentContainer">
        <div class="headers wrapper">
            <h2>This <span>{{ currentTimeline }}</span></h2>
            <h3>
                August 11
            </h3>
        </div>
        <div class="wrapper days">
            <!-- <div ref="daysContainer" class="days-grid"> -->
                <TransitionGroup name="list" tag="div" class="days-grid">
                    <OverviewDayIndicator v-for="emptyDay in emptyDaysAtStart"
                        :key="`empty-${emptyDay}`"
                        :labelType="dayLabelType"
                        :labelContent="daysOfWeekLabels[emptyDay - 1 % 7]"
                        :isEmpty="true"
                        :dayIndex="emptyDay"
                    />
                    <OverviewDayIndicator v-for="day in calendarDays"
                        :key="day.date"
                        :labelType="dayLabelType"
                        :labelContent="daysOfWeekLabels[day.index % 7]"
                        :painLevel="1"
                        :isEmpty="false"
                        :dayIndex="day.index"
                    />
                </TransitionGroup>
            <!-- </div> -->
        </div>
    </section>
</template>

<script setup lang="ts">
//@ts-ignore
import { getStartingDayOfWeekIndex, getMonthLabel, getMonthDays, getMonthLabelShort, getDayOfWeek, getDayOfWeekShort, getEmptyDaysAtStartOfMonth, type CalendarDay, type CalendarMonth } from '@types/calendar';
//@ts-ignore
import type { DayIndicatorLabelType } from '@types/dayIndicator';
//@ts-ignore
import { daysOfWeekLabels } from '@types/days';

const props = defineProps<{
  initialDate: Date;
}>();

const isMounted = ref(false);

const { currentTimeline } = useOverviewTimeline();
const currentMonth = ref<CalendarMonth>({
    date: props.initialDate,
    days: [],
    startingDayOfWeek: getStartingDayOfWeekIndex(props.initialDate)
});

const dayLabelType = ref<DayIndicatorLabelType>('day');

const emptyDaysAtStart = computed(() => {
    const today = new Date();
    let startDate: Date;

    switch(currentTimeline.value) {
        case 'week':
            startDate = getStartOfWeek(today);
            break;
        case 'fortnight':
            startDate = getStartOfFortnight(today);
            break;
        case 'month':
        default:
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            break;
    }

    return startDate.getDay();
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

    return generateCalendarDays(startDate, endDate);
});

function getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    return d;
}

function getEndOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() + (6 - day));
    return d;
}

function getStartOfFortnight(date: Date): Date {
    const d = new Date(date);
    const dayOfMonth = d.getDate();
    
    if (dayOfMonth <= 14) {
        d.setDate(1);
    } else {
        d.setDate(15);
    }
    
    return d;
}

function getEndOfFortnight(date: Date): Date {
    const d = new Date(date);
    const dayOfMonth = d.getDate();
    
    if (dayOfMonth <= 14) {
        d.setDate(14);
    } else {
        d.setDate(getMonthDays(d));
    }
    
    return d;
}

function generateCalendarDays(startDate: Date, endDate: Date): CalendarDay[] {
    const days: CalendarDay[] = [];
    let currentDate = startDate;
    let dayIndex = 0;

    const numberOfEmptyDays = emptyDaysAtStart.value;

    while (currentDate <= endDate) {
        days.push({
            date: new Date(currentDate),
            index: dayIndex + numberOfEmptyDays,
            dayOfWeek: getDayOfWeek(currentDate.getDay()),
            dayOfWeekShort: getDayOfWeekShort(currentDate.getDay()),
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
        dayIndex++;
    }

    return days;
}

onMounted(() => {
    isMounted.value = true;
});
</script>

<style lang="css" scoped>
.calendar {
    max-width: 452px;
    min-width: 268px;
    transition: height 0.5s ease;
}

.headers.wrapper {
    display: flex;
    justify-content: flex-start;
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

.days-grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    grid-auto-columns: minmax(0, 1fr);
    grid-template-rows: 1fr;
    justify-content: space-around;
    gap: 0.5rem 0.5rem;
    margin: 0 auto;
    box-sizing: border-box;
    transition: height 0.5s ease;
    will-change: height;
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