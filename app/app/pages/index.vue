<template>
    <MobilePage>
        <div class="settings-inner-wrapper">
            <LogCard
                title="What was your level of pain today?"
            >
                <LogPainSlider
                    v-model="sliderValue"
                    v-model:color="sliderColor"
                    :min="0"
                    :max="10"
                    :animation="{
                        edgeEasingStrength: 'subtle'
                    }"
                    :indicators="{
                        showStepIndicators: true,
                        stepIndicatorStyle: 'numbered',
                        maxIndicators: 11
                    }"
                />
            </LogCard>
            <LogCard
                title="What would you rate your pain today?"
                style="margin-top: 2rem;"
            >
                <LogPainSlider
                    v-model="sliderValue2"
                    v-model:color="sliderColor2"
                    :min="0"
                    :max="10"
                    :animation="{
                        edgeEasingStrength: 'subtle'
                    }"
                    :indicators="{
                        showStepIndicators: true,
                        stepIndicatorStyle: 'numbered-line',
                        maxIndicators: 11
                    }"
                />
            </LogCard>
        </div>
    </MobilePage>
</template>


<script setup lang="ts">
const sliderValue = ref(5);
const sliderColor = ref('#888888');

const sliderValue2 = ref(5);
const sliderColor2 = ref('#888888');

console.log(`Slider value changed: ${sliderValue.value}`);

watch(sliderValue, (newValue) => {
    console.log(`Slider changed: ${newValue}`);
}, { immediate: true });
</script>

<style lang="scss" scoped>
h1 {
    font-size: 1.5rem;
    font-weight: 600;
}
p {
    opacity: 0.6;
}

.label {
    width: 100%;
    opacity: 0.4;
    text-align: left;
    margin-top: 1rem;
}
.settings-inner-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    gap: 0.5rem;
}
</style>