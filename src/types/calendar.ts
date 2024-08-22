import { type DayOfWeek, type DayOfWeekIndex, type DayOfWeekShort, daysOfWeeks, daysOfWeeksShort } from "./days";
import { monthLabels, monthLabelsShort, monthDays, type MonthLabel, type MonthLabelShort } from "./months";

export type TimelineCalendarOverview = 'week' | 'fortnight' | 'month';

export interface CalendarDay {
    date: Date;
    index: number;
    dayOfWeek: DayOfWeek;
    dayOfWeekShort: DayOfWeekShort;
}

export interface CalendarMonth {
    date: Date;
    days: CalendarDay[];
    startingDayIndex: DayOfWeekIndex;
}

export function getStartingDayOfWeekIndex(date: Date): number {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    return firstDayOfMonth.getDay();
}

export function getDayOfWeek(index: number): DayOfWeek {
    return daysOfWeeks[index];
}

export function getDayOfWeekShort(index: number): DayOfWeekShort {
    return daysOfWeeksShort[index];
}

export function getEmptyDaysAtStartOfMonth(startingDayOfWeek: number): number {
    return startingDayOfWeek;
}

export function getMonthLabel(date: Date): MonthLabel {
    return monthLabels[date.getMonth()];
}

export function getMonthLabelShort(date: Date): MonthLabelShort {
    return monthLabelsShort[date.getMonth()];
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

    return monthDays[date.getMonth()];
}