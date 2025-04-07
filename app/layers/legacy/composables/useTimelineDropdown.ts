export const useTimelineDropdown = () => {
    const isEnabled = ref(false)

    function enable() {
        isEnabled.value = true
    }

    function disable() {
        isEnabled.value = false
    }

    function toggleEnabled() {
        isEnabled.value = !isEnabled.value
    }

    return {
        isEnabled,
        enable,
        disable,
        toggleEnabled
    }
}