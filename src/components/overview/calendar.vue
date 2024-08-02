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
    return getEmptyDaysAtStartOfMonth(currentMonth.value.startingDayOfWeek);
});

const calendarDays = computed(() => {
    return generateCalendarMonthDays(currentMonth.value.date);
});

function generateCalendarMonthDays(date: Date): CalendarDay[] {
    const days: CalendarDay[] = [];
    const year = date.getFullYear();
    const month = date.getMonth();
    const lastDayOfMonth = new Date(year, month + 1, 0);
  
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        const currentDate = new Date(year, month, i + 1);
        days.push({
            date: currentDate,
            index: (i - 1) + emptyDaysAtStart.value,
            dayOfWeek: getDayOfWeek(currentDate.getDay()),
            dayOfWeekShort: getDayOfWeekShort(currentDate.getDay()),
        });
    }

    console.log(days.length)
  
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
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    grid-auto-columns: minmax(0, 1fr);
    grid-template-rows: 1fr;
    justify-content: space-around;
    gap: 0.5rem 0.5rem;
    margin: 0 auto;
    box-sizing: border-box;
    transition: height 0.5s ease;
}

.list-enter-active,
.list-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
.list-move {
  transition: transform 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-move {
  transition: opacity 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
}
</style>