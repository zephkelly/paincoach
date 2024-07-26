import { ref } from 'vue'

export function useTimelineDropdown() {
  const isEnabled = ref(false)

  function enable() {
    isEnabled.value = true
  }

  function disable() {
    isEnabled.value = false
  }

  function toggle() {
    isEnabled.value = !isEnabled.value
  }

  return {
    isEnabled,
    enable,
    disable,
    toggle
  }
}