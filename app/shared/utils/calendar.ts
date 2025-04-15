import { type CalendarDay, type CalendarMonth } from '~~/shared/types/calendar';
import { type DayOfWeek, type DayOfWeekIndex, type DayOfWeekShort, daysOfWeeks, daysOfWeeksShort } from '~~/shared/types/day';
import { type MonthLabel, type MonthLabelShort,monthDays, monthLabels, monthLabelsShort } from '~~/shared/types/month';


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
    const startOfWeek = getStartOfWeek(d);
    const dayOfMonth = startOfWeek.getDate();
    
    if (dayOfMonth <= 7) {
      // First week of the month, start of fortnight is start of month
      return new Date(d.getFullYear(), d.getMonth(), 1);
    } else if (dayOfMonth <= 21) {
      // Second or third week, start of fortnight is start of week
      return startOfWeek;
    } else {
      // Fourth or fifth week, start of fortnight is two weeks before end of month
      const lastDayOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      const twoWeeksBeforeEnd = new Date(lastDayOfMonth);
      twoWeeksBeforeEnd.setDate(lastDayOfMonth.getDate() - 13);
      return getStartOfWeek(twoWeeksBeforeEnd);
    }
  }
  
  export function getEndOfFortnight(date: Date): Date {
    const start = getStartOfFortnight(date);
    const end = new Date(start);
    end.setDate(start.getDate() + 13); // Add 13 days to get a 14-day period
    return end;
  }
  

export function generateCalendarDays(startDate: Date, endDate: Date, emptyDaysAtStart: number): CalendarDay[] {
  const days: CalendarDay[] = [];
  let currentDate = new Date(startDate);
  let dayIndex = 0;

  while (currentDate <= endDate) {
    days.push({
      date: new Date(currentDate),
      index: dayIndex + emptyDaysAtStart,
      painLevel: Math.floor(Math.random() * 4),
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

export function currentDateMonthDay(): String {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
    return today.toLocaleDateString('en-US', options);
}

export function getStartingDayOfWeekIndex(date: Date): DayOfWeekIndex {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    return firstDayOfMonth.getDay() as DayOfWeekIndex;
}

export function getDayOfWeek(index: number): DayOfWeek {
    const dayOfWeek = daysOfWeeks[index];
    if (dayOfWeek === undefined) {
        throw new Error(`Invalid index: ${index}`);
    }
    
    return dayOfWeek;
}

export function getDayOfWeekShort(index: number): DayOfWeekShort {
    const dayOfWeek = daysOfWeeksShort[index];
    if (dayOfWeek === undefined) {
        throw new Error(`Invalid index: ${index}`);
    }

    return dayOfWeek;
}

export function getEmptyDaysAtStartOfMonth(startingDayOfWeek: number): number {
    return startingDayOfWeek;
}

export function getMonthLabel(date: Date): MonthLabel {
    const monthLabel = monthLabels[date.getMonth()];
    if (monthLabel === undefined) {
        throw new Error(`Invalid month index: ${date.getMonth()}`);
    }
    return monthLabel;
}

export function getMonthLabelShort(date: Date): MonthLabelShort {
    const monthLabel = monthLabelsShort[date.getMonth()];
    if (monthLabel === undefined) {
        throw new Error(`Invalid month index: ${date.getMonth()}`);
    }
    return monthLabel;
}

export function isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

export function getMonthDays(date: Date): number {
    const month = date.getMonth();
    const year = date.getFullYear();

    if (month === 1 && isLeapYear(year)) {
        return 29;
    }

    const monthDay = monthDays[date.getMonth()];

    if (monthDay === undefined) {
        throw new Error(`Invalid month index: ${month}`);
    }

    return monthDay;
}