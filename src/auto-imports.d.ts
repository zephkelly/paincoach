import type { ComputedRef, Ref } from 'vue'

declare global {
  const computed: <T>(getter: () => T) => ComputedRef<T>
  const ref: <T>(value: T) => Ref<T>
  const onMounted: (hook: () => void) => void
  const nextTick: (callback: () => void) => void
  const watch: typeof import('vue').watch
  // Add other Vue composables you frequently use
  const useState: typeof import('#app')['useState']
  const useRouter: typeof import('#app')['useRouter']
  const useRoute: typeof import('#app')['useRoute']
  // Add your custom composables here
  const useTimelineDropdown: typeof import('@/composables/timelineDropdown')['useTimelineDropdown']
  const useOverviewTimeline: typeof import('@/composables/overviewTimeline')['useOverviewTimeline']
  const useScroll: typeof import('@/composables/useScroll')['useScroll']
  const useFactorsExpanded: typeof import('@/composables/useFactorsExpanded')['useFactorsExpanded']
//   const useMyComposable: typeof import('@/composables/myComposable')['useMyComposable']
}

export {}