<template>
    <main>
        <MainHeader title="Calendar" :dynamicDropdownComponent="CalendarTimelineDropdown"/>
        <div class="page-container">
            <Calendar :calendarDays="calendarDays" :currentMonth="currentDate" 
                @openDataComponent="handleOpenDataComponent"
                @closeDataComponent="handleCloseDataComponent"/>
            <DayOverview v-if="selectedDay" v-bind="selectedDay" />
        </div>
        <!-- <h3>{{ formatDate(currentDate) }}</h3> -->
    </main>
</template>

<script lang="ts" setup>
//@ts-ignore
import MainHeader from '@/components/mainHeader.vue';
//@ts-ignore
import Calendar from '@/components/calendar/calendar.vue';
//@ts-ignore
import CalendarTimelineDropdown from './../../src/components/calendar/timelineDropdown.vue';
//@ts-ignore
import DayOverview from '@/components/calendar/dayOverview.vue';
//@ts-ignore
import { getStartOfWeek, getEndOfWeek, getStartOfFortnight, getEndOfFortnight, getEmptyDaysAtStart, generateCalendarDays } from '@/utils/calendar';

const currentDate = ref(new Date());
const { currentTimeline } = useOverviewTimeline();
const selectedDay = ref(null);

const calendarDays = computed(() => {
  let startDate: Date = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1);
  let endDate: Date = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0);

  const emptyDaysAtStart = getEmptyDaysAtStart(currentDate.value, 'month');
  return generateCalendarDays(startDate, endDate, emptyDaysAtStart);
});

const handleOpenDataComponent = (dayData: any) => {
    selectedDay.value = dayData;
};

const handleCloseDataComponent = () => {
    selectedDay.value = null;
};

definePageMeta({
    alias: ['/calendar'],
    title: 'Calendar',
    description: 'This is the calendar page',
})
</script>

<style lang="css" scoped>
.page-container {
    align-items: center;
    justify-content: center;
    margin-top: 1rem;
}
</style>