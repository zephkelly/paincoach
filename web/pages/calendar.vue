<template>
    <main>
        <MainHeader title="Calendar" :dynamicDropdownComponent="OverviewTimelineDropdown"/>
        <h3>{{ formatDate(currentDate) }}</h3>
        <Calendar :calendarDays="calendarDays" :currentMonth="currentDate" />
    </main>
</template>

<script lang="ts" setup>
//@ts-ignore
import MainHeader from '@/components/mainHeader.vue';
//@ts-ignore
import Calendar from '@/components/calendar/calendar.vue';
//@ts-ignore
import OverviewTimelineDropdown from '@/components/overview/timelineDropdown.vue';
//@ts-ignore
import { getStartOfWeek, getEndOfWeek, getStartOfFortnight, getEndOfFortnight, getEmptyDaysAtStart, generateCalendarDays } from '@/utils/calendar';

const currentDate = ref(new Date());
const { currentTimeline } = useOverviewTimeline();

const calendarDays = computed(() => {
  let startDate: Date = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1);
  let endDate: Date = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0);

  const emptyDaysAtStart = getEmptyDaysAtStart(currentDate.value, 'month');
  return generateCalendarDays(startDate, endDate, emptyDaysAtStart);
});

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
};

definePageMeta({
    alias: ['/calendar'],
    title: 'Calendar',
    description: 'This is the calendar page',
})
</script>