import type { ComputedRef, Ref } from 'vue'

declare global {
  const computed: <T>(getter: () => T) => ComputedRef<T>
  const ref: <T>(value: T) => Ref<T>
  const onMounted: (hook: () => void) => void
  const nextTick: (callback: () => void) => void
  // Add other Vue composables you frequently use
  const useState: typeof import('#app')['useState']
  const useRouter: typeof import('#app')['useRouter']
  const useRoute: typeof import('#app')['useRoute']
  // Add your custom composables here
  const useTimelineDropdown: typeof import('@/composables/timelineDropdown')['useTimelineDropdown']
  const useOverviewTimeline: typeof import('@/composables/overviewTimeline')['useOverviewTimeline']
//   const useMyComposable: typeof import('@/composables/myComposable')['useMyComposable']
}

export {}