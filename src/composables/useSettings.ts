//@ts-ignore
import { ref, Ref } from 'vue'

export const useSettings = () => {
    const settingsState = ref(useState<Record<string, boolean | string | number>>('settings', () => ({
        "reminder": true,
        'reminderTime': '08:00',
        'displayMode': true,
        "colorScheme": 'green',
    })));

    const toggleSetting = (settingName: string, value?: boolean) => {
        settingsState.value = {
            ...settingsState.value,
            [settingName]: value !== undefined ? value : !settingsState.value[settingName]
        }
        return settingsState.value[settingName]
    }

    const getValue = (settingName: string) => {
        return settingsState.value[settingName]
    }

    return {
        settingsState,
        toggleSetting,
        getValue
    }
}

export default useSettings