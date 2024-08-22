<template>
    <div class="calendar" role="grid" aria-labelledby="calendar-title">
      <h2 id="calendar-title" class="calendar-title">{{ formatMonth(currentMonth) }}</h2>
      <div class="calendar-header">
        <div v-for="day in daysOfWeek" :key="day" class="calendar-header-cell">
          {{ day.slice(0, 3) }}
        </div>
      </div>
      <div class="calendar-body">
        <div v-for="(day, index) in flatCalendarDays" :key="index" 
             class="calendar-cell" :class="{ 'empty': !day.date }">
          <span v-if="day.painLevel !== undefined" 
                class="pain-level" :class="`pain-level-${day.painLevel}`"></span>
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
  
  const props = defineProps<{
    calendarDays: CalendarDay[];
    currentMonth: Date;
  }>();
  
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
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
  
  const formatMonth = (date: Date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };
  
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
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
        margin-bottom: 1rem;
    }
    
    .calendar-header {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 12px;
        margin-bottom: 1rem;
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
        bottom: -18px;
        font-size: calc(100% / 3);
        line-height: 1;
        font-size: var(--font-size-12);
        color: var(--text-color-secondary);
    }
    
    .pain-level {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 50%;
    }
    
    .pain-level-0 { background-color: var(--pain-0); }
    .pain-level-1 { background-color: var(--pain-1); }
    .pain-level-2 { background-color: var(--pain-2); }
    .pain-level-3 { background-color: var(--pain-3); }
    .pain-level-4 { background-color: var(--pain-4); }
    .pain-level-5 { background-color: var(--pain-5); }
</style>