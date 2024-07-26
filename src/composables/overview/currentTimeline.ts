import { ref, Ref } from 'vue'

type TimelineOverview = 'week' | 'fortnight' | 'month'

export function useTimeline() {
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