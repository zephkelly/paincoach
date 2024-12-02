<template>
    <main>
        <MainHeader title="Calendar" :dynamicDropdownComponent="CalendarTimelineDropdown"/>
        <div class="page-container">
            <Calendar :calendarDays="calendarDays" :currentMonth="currentDate" 
                @openDataComponent="handleOpenDataComponent"
                @closeDataComponent="handleCloseDataComponent"/>
            <DayOverview v-if="selectedDay" v-bind="selectedDay" />
        </div>
    </main>
</template>

<script lang="ts" setup>
import MainHeader from '@/components/app/mainHeader.vue';
import Calendar from '@/components/app/calendar/calendar.vue';
import CalendarTimelineDropdown from '@/components/app/calendar/timelineDropdown.vue';
import DayOverview from '@/components/app/calendar/dayOverview.vue';
import { getEmptyDaysAtStart, generateCalendarDays } from '@/utils/calendar';

const currentDate = ref(new Date());
const { currentTimeline } = useOverviewTimeline();

interface DayData {
    dayShort: string;
    dayNumber: number;
    month: string;
    year: number;
    painLevel: number;
}

const selectedDay = ref<DayData | null>(null);

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
    // alias: ['/calendar'],
    layout: 'application',
    title: 'Calendar',
    description: 'This is the calendar page',
    middleware: 'verify-demo-token'
})
</script>

<style lang="css" scoped>
.page-container {
    align-items: center;
    justify-content: center;
    margin-top: 2rem;
    margin-bottom: 7rem;
}
</style>