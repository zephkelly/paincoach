<template>
    <button class="toggle" :class="{ active: isToggled }" @click.prevent="debouncedToggle">
        <div class="toggler" :class="{ active: isToggled }"></div>
    </button>
</template>

<script setup lang="ts">
import type { SettingName } from '~~/layers/legacy/types/settings';
import debounce from '~~/layers/legacy/utils/debounce';

const { toggleSetting } = useSettings();

const props = defineProps<{
    currentValue: boolean;
    settingKey: SettingName;
}>();

const isToggled = ref(props.currentValue);
const toggle = () => { 
    isToggled.value = !isToggled.value;
    toggleSetting(props.settingKey, isToggled.value);
};

const debouncedToggle = debounce(toggle, 100);
</script>

<style lang="css" scoped>
.toggle {
    cursor: pointer;
    position: relative;
    background-color: var(--background-color);
    height: 32px;
    width: 60px;
    border-radius: 32px;
    padding: 0rem;
    transition: background-color 0.25s cubic-bezier(0.075, 0.82, 0.165, 1);
    will-change: background-color;
}

.toggle.active {
    background-color: var(--pain-0);
}

.toggler {
    background-color: var(--text-color);
    height: 32px;
    width: 32px;
    border-radius: 32px;
    transform: translateX(0px);
    transition: transform 0.25s cubic-bezier(0.075, 0.82, 0.165, 1);
    will-change: transform;
}

.toggler.active {
    transform: translateX(28px);
}
</style>