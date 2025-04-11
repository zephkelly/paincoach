<template>
    <MobilePage>
        <div class="settings-inner-wrapper">
            <LogCard
                title="What would you rate your level of pain?"
            >
                <LogSlider
                    v-model="sliderValue"
                    @update:modelValue="sliderValue = $event"
                    @update:color="sliderColor = $event"
                    :color="sliderColor"/>
            </LogCard>
        </div>
        <!-- <div class="wrapper">
            <LogSlider 
                v-model="happiness" 
                @update:happiness="happinessDescription = $event" 
                />
        </div>      -->
    </MobilePage>
</template>

<script setup lang="ts">
const sliderValue = ref(3);
const sliderColor = ref('#888888');

const happiness = ref(3); // Default to neutral
const happinessDescription = ref('Neutral');

watch(sliderColor, (newValue) => {
    console.log(`Slider colour changed: ${newValue}`);
}, { immediate: true });
</script>

<style lang="scss" scoped>
.settings-inner-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
}
</style>