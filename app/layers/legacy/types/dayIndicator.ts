import type { DayOfWeekLabel } from "./day";

export type DayIndicatorLabelType = 'day' | number;

export interface DayIndicatorProps {
    labelType: DayIndicatorLabelType;
    label: DayOfWeekLabel | number;
    date: Date;
}