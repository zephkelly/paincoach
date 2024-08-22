<template>
    <div class="calendar" role="grid" aria-labelledby="calendar-title">
        <h2 id="calendar-title" class="calendar-title">{{ formatMonth(currentMonth) }}</h2>
        <div class="calendar-header">
            <div v-for="day in daysOfWeek" :key="day" class="calendar-header-cell">
                {{ day.slice(0, 3) }}
            </div>
        </div>
        <div class="calendar-body">
            <div v-for="(day, index) in flatCalendarDays" :key="index" class="calendar-cell" :class="{ 'empty': !day.date }">
                <span v-if="day.painLevel !== undefined" 
                    class="pain-level" 
                    :class="[
                        `pain-level-${day.painLevel}`,
                        { 'inactive': activeDay && day.date && day.date.getTime() !== activeDay.getTime() }
                    ]"
                    @click="handlePainLevelClick(day)">
                </span>
                <time v-if="day.date" :datetime="formatDate(day.date)">
                    {{ day.date.getDate() }}
                </time>
            </div>
        </div>
    </div>
  </template>
  
<script setup lang="ts">
    // @ts-expect-error
    import type { CalendarDay } from '@/types/calendar';
    import debounce from './../../utils/debounce';
  
    const props = defineProps<{
        calendarDays: CalendarDay[];
        currentMonth: Date;
    }>();
    
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const activeDay = ref<Date | null>(null);
    
    const flatCalendarDays = computed(() => {
        const days: CalendarDay[] = [];
        const firstDay = props.calendarDays[0].date.getDay();
        
        // Add empty days at the start
        for (let i = 0; i < firstDay; i++) {
            days.push({ date: null, painLevel: undefined, index: -1 });
        }
        
        // Add actual calendar days
        days.push(...props.calendarDays);
        
        // Add empty days at the end to make total days a multiple of 7
        while (days.length % 7 !== 0) {
            days.push({ date: null, painLevel: undefined, index: -1 });
        }
        
        return days;
    });

    function debounceHandlePainLevelClick(day: CalendarDay) {
        debounce(() => handlePainLevelClick(day), 100);
    }

    const handlePainLevelClick = (day: CalendarDay) => {
        if (day.date) {
            if (activeDay.value && day.date.getTime() === activeDay.value.getTime()) {
                // If clicking the already active day, deactivate it
                activeDay.value = null;
                emit('closeDataComponent');
            } else {
                // Activate the clicked day
                activeDay.value = day.date;
                emit('openDataComponent', {
                    date: day.date,
                    dayShort: daysOfWeek[day.date.getDay()].slice(0, 3),
                    dayNumber: day.date.getDate(),
                    month: day.date.toLocaleString('default', { month: 'long' }),
                    year: day.date.getFullYear(),
                    painLevel: day.painLevel
                });
            }
        }
    };
  
    const formatMonth = (date: Date) => {
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    };
    
    const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    const emit = defineEmits(['openDataComponent', 'closeDataComponent']);
</script>
  
<style scoped>
    .calendar {
        font-family: 'Inter', sans-serif;
        color: var(--text-color);
        max-width: 452px;
        min-width: 268px;
        width: 100%;
    }
    
    .calendar-title {
        text-align: center;
        margin-bottom: 2.5rem;
    }
    
    .calendar-header {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 12px;
        margin-bottom: 1.2rem;
    }
    
    .calendar-header-cell {
        text-align: center;
        font-weight: 500;
        color: var(--text-color-secondary);
    }
    
    .calendar-body {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 0.5rem;
    }
    
    .calendar-cell {
        aspect-ratio: 1 / 1;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        /* overflow: hidden; */
        margin-bottom: 1.2rem;
    }
    
    .empty {
        /* Style for empty cells if needed */
    }
    
    time {
        position: absolute;
        bottom: calc(var(--font-size-14) * -1);
        font-size: calc(100% / 3);
        line-height: 1;
        font-size: var(--font-size-12);
        color: var(--text-color-secondary);
        user-select: none;
    }
    
    span.pain-level {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 50%;
        border-width: 2px;
        border-style: solid;
        cursor: pointer;
        transition: background-color 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
        will-change: background-color;
    }
    
    .pain-level-0 { 
        background-color: var(--pain-0);
        border-color: var(--pain-0);
    }
    .pain-level-0.inactive {
        background-color: transparent;
    }
    .pain-level-0.inactive:hover {
        background-color: var(--pain-0-hover);
    }
    .pain-level-0:hover {
        background-color: var(--pain-0-hover);
        border-color: var(--pain-0-hover);
    }

    .pain-level-1 { 
        background-color: var(--pain-1);
        border-color: var(--pain-1);
    }
    .pain-level-1.inactive {
        background-color: transparent;
    }
    .pain-level-1.inactive:hover {
        background-color: var(--pain-1-hover);
    }
    .pain-level-1:hover {
        background-color: var(--pain-1-hover);
        border-color: var(--pain-1-hover);
    }

    .pain-level-2 { 
        background-color: var(--pain-2);
        border-color: var(--pain-2);
    }
    .pain-level-2.inactive {
        background-color: transparent;
    }
    .pain-level-2.inactive:hover {
        background-color: var(--pain-2-hover);
    }
    .pain-level-2:hover {
        background-color: var(--pain-2-hover);
        border-color: var(--pain-2-hover);
    }

    .pain-level-3 { 
        background-color: var(--pain-3);
        border-color: var(--pain-3);
    }
    .pain-level-3.inactive {
        background-color: transparent;
    }
    .pain-level-3.inactive:hover {
        background-color: var(--pain-3-hover);
    }
    .pain-level-3:hover {
        background-color: var(--pain-3-hover);
        border-color: var(--pain-3-hover);
    }
</style>