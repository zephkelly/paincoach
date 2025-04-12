<template>
    <MobilePage>
        <div class="settings-inner-wrapper">
            <h1>
                This is a demo of the different settings of our slider input.
            </h1>
            <p style="margin-bottom: 1rem;">
                These inputs have a range of 1-5, and are continuous, meaning you can place the slider in between values
            </p>
            <p class="label">Line</p>
            <LogCard
                title="What is your current level of pain?"
            >
                <LogHappinessSlider
                    v-model="sliderValue"
                    v-model:color="sliderColor"
                    :min="1"
                    :max="5"
                    :animation="{
                        edgeEasingStrength: 'subtle'
                    }"
                    :indicators="{
                        showStepIndicators: true,
                        stepIndicatorStyle: 'line',
                        maxIndicators: 5
                    }"
                />
            </LogCard>
            <p class="label">Dot</p>
            <LogCard
                title="What is your current level of pain?"
            >
                <LogHappinessSlider
                    v-model="sliderValue"
                    v-model:color="sliderColor"
                    :min="1"
                    :max="5"
                    :indicators="{
                        showStepIndicators: true,
                        stepIndicatorStyle: 'dot',
                        maxIndicators: 5
                    }"
                />
            </LogCard>
            <p class="label">Numbered</p>
            <LogCard
                title="What is your current level of pain?"
            >
                <LogHappinessSlider
                    v-model="sliderValue"
                    v-model:color="sliderColor"
                    :min="1"
                    :max="5"
                    :indicators="{
                        showStepIndicators: true,
                        stepIndicatorStyle: 'numbered',
                        maxIndicators: 5
                    }"
                />
            </LogCard>
            <p class="label">Numbered line</p>
            <LogCard
                title="What is your current level of pain?"
                style="margin-bottom: 4rem;"
            >
                <LogHappinessSlider
                    v-model="sliderValue"
                    v-model:color="sliderColor"
                    :min="1"
                    :max="5"
                    :indicators="{
                        showStepIndicators: true,
                        stepIndicatorStyle: 'numbered-line',
                        maxIndicators: 5
                    }"
                />
            </LogCard>
            <p>
                These inputs have a range of 1-5, and are discrete, meaning you can only place the slider on the values
                (1, 2, 3, 4, or 5)
            </p>
            <LogCard
                title="What is your current level of pain?"
            >
                <LogHappinessSlider
                    v-model="sliderValue"
                    v-model:color="sliderColor"
                    :min="1"
                    :max="5"
                    :valueConfig="{
                        step: 1
                    }"
                    :indicators="{
                        showStepIndicators: true,
                        stepIndicatorStyle: 'line'
                    }"
                />
            </LogCard>
            <LogCard
                title="What is your current level of pain?"
            >
                <LogHappinessSlider
                    v-model="sliderValue"
                    v-model:color="sliderColor"
                    :min="1"
                    :max="5"
                    :valueConfig="{
                        step: 1
                    }"
                    :indicators="{
                        showStepIndicators: true,
                        stepIndicatorStyle: 'dot'
                    }"
                />
            </LogCard>
            <LogCard
                title="What is your current level of pain?"
            >
                <LogHappinessSlider
                    v-model="sliderValue"
                    v-model:color="sliderColor"
                    :min="1"
                    :max="5"
                    :valueConfig="{
                        step: 1
                    }"
                    :indicators="{
                        showStepIndicators: true,
                        stepIndicatorStyle: 'numbered'
                    }"
                />
            </LogCard>
            <LogCard
                title="What is your current level of pain?"
                style="margin-bottom: 4rem;"
            >
                <LogHappinessSlider
                    v-model="sliderValue"
                    v-model:color="sliderColor"
                    :min="1"
                    :max="5"
                    :valueConfig="{
                        step: 1
                    }"
                    :indicators="{
                        showStepIndicators: true,
                        stepIndicatorStyle: 'numbered-line'
                    }"
                />
            </LogCard>
        </div>
    </MobilePage>
</template>


<script setup lang="ts">
const sliderValue = ref(3);
const sliderColor = ref('#888888');

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