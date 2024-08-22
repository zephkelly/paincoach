//@ts-ignore
import { getStartingDayOfWeekIndex, getMonthDays,  getDayOfWeek, getDayOfWeekShort, type CalendarDay, type CalendarMonth } from '@types/calendar';
// import { DayIndicatorLabelType } from '@/types/dayIndicator';
// import { daysOfWeekLabels } from '@/types/days';

export function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return d;
}

export function getEndOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() + (6 - day));
  return d;
}

export function getStartOfFortnight(date: Date): Date {
  const d = new Date(date);
  const dayOfMonth = d.getDate();
  
  if (dayOfMonth <= 14) {
    d.setDate(1);
  } else {
    d.setDate(15);
  }
  
  return d;
}

export function getEndOfFortnight(date: Date): Date {
  const d = new Date(date);
  const dayOfMonth = d.getDate();
  
  if (dayOfMonth <= 14) {
    d.setDate(14);
  } else {
    d.setDate(getMonthDays(d));
  }
  
  return d;
}

export function generateCalendarDays(startDate: Date, endDate: Date, emptyDaysAtStart: number): CalendarDay[] {
  const days: CalendarDay[] = [];
  let currentDate = new Date(startDate);
  let dayIndex = 0;

  while (currentDate <= endDate) {
    days.push({
      date: new Date(currentDate),
      index: dayIndex + emptyDaysAtStart,
      painLevel: Math.floor(Math.random() * 6),
      dayOfWeek: getDayOfWeek(currentDate.getDay()),
      dayOfWeekShort: getDayOfWeekShort(currentDate.getDay()),
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
    dayIndex++;
  }

  return days;
}

export function getEmptyDaysAtStart(date: Date, timeline: string): number {
  let startDate: Date;

  switch(timeline) {
    case 'week':
      startDate = getStartOfWeek(date);
      break;
    case 'fortnight':
      startDate = getStartOfFortnight(date);
      break;
    case 'month':
    default:
      startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      break;
  }

  return startDate.getDay();
}