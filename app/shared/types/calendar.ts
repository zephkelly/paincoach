import { type DayOfWeek, type DayOfWeekIndex, type DayOfWeekShort } from "./day";
import type { PainLevel } from "./pain";

export type TimelineCalendarOverview = 'week' | 'fortnight' | 'month';

export interface CalendarDay {
    date: Date | null;
    index: number;
    painLevel: number | PainLevel;
    dayOfWeek: DayOfWeek | null;
    dayOfWeekShort: DayOfWeekShort | null;
}

export interface CalendarMonth {
    date: Date;
    days: CalendarDay[];
    startingDayIndex: DayOfWeekIndex;
}