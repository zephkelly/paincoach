//@ts-ignore
import { ref, Ref } from 'vue'
//@ts-ignore
import { TimelineOverview } from './../types/timeline'

export const useOverviewTimeline = () => {
    const currentTimeline: Ref<TimelineOverview> = useState<TimelineOverview>('currentTimeline', () => 'week')

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