export type DayOfWeek = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
export type DayOfWeekIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type DayOfWeekShort = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';
export type DayOfWeekLabel = 'S' | 'M' | 'T' | 'W' | 'T' | 'F' | 'S';

export const daysOfWeeks: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
export const daysOfWeeksShort: DayOfWeekShort[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
export const daysOfWeekLabels: DayOfWeekLabel[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export type DayIndicatorLabelType = 'day' | number;