import type { DayOfWeekLabel } from "./days";

export type DayIndicatorLabelType = 'day' | number;

export interface DayIndicatorProps {
    labelType: DayIndicatorLabelType;
    label: DayOfWeekLabel | number;
    date: Date;
}