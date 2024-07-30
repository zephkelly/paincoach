//@ts-ignore
import { ref, Ref } from 'vue'

import type { TimelineOverview } from '../types/timeline';

export const useOverviewTimeline = () => {
    const currentTimeline: Ref<TimelineOverview> = ref('week')

    function setTimeline(timeline: TimelineOverview) {
        currentTimeline.value = timeline
    }

    function isCurrentTimeline(timeline: TimelineOverview): boolean {
        return currentTimeline.value === timeline
    }

    return {
        currentTimeline,
        setTimeline,
        isCurrentTimeline
    }
}