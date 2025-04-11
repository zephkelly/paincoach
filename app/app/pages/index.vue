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
                    step-indicator-style="dot"
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
                    step-indicator-style="numbered"
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
                    step-indicator-style="numbered-line"
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
                    :step="1"
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
                    :step="1"
                    step-indicator-style="dot"
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
                    :step="1"
                    step-indicator-style="numbered"
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
                    :step="1"
                    step-indicator-style="numbered-line"
                    />
            </LogCard>
            
            <p>
                here are example of the same inputs, but with a range of 1-10. The following three are continuous...
            </p>
            <LogCard
                title="What is your current level of pain?"
            >
                <LogHappinessSlider
                    v-model="sliderValue"
                    v-model:color="sliderColor"
                    :min="1"
                    :max="10"
                    />
            </LogCard>
            <LogCard
                title="What is your current level of pain?"
            >
                <LogHappinessSlider
                    v-model="sliderValue"
                    v-model:color="sliderColor"
                    :min="1"
                    :max="10"
                    step-indicator-style="dot"
                    />
            </LogCard>
            <LogCard
                title="What is your current level of pain?"
            >
                <LogHappinessSlider
                    v-model="sliderValue"
                    v-model:color="sliderColor"
                    :min="1"
                    :max="10"
                    step-indicator-style="numbered"
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
                    :max="10"
                    step-indicator-style="numbered-line"
                    />
            </LogCard>

            <p>
                ...and these last three are discrete.
            </p>
            <LogCard
                title="What is your current level of pain?"
            >
                <LogHappinessSlider
                    v-model="sliderValue"
                    v-model:color="sliderColor"
                    :min="1"
                    :max="10"
                    :step="1"
                    />
            </LogCard>
            <LogCard
                title="What is your current level of pain?"
            >
                <LogHappinessSlider
                    v-model="sliderValue"
                    v-model:color="sliderColor"
                    :min="1"
                    :max="10"
                    :step="1"
                    step-indicator-style="dot"
                    />
            </LogCard>
            <LogCard
                title="What is your current level of pain?"
            >
                <LogHappinessSlider
                    v-model="sliderValue"
                    v-model:color="sliderColor"
                    :min="1"
                    :max="10"
                    :step="1"
                    step-indicator-style="numbered"
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
                    :max="10"
                    :step="1"
                    step-indicator-style="numbered-line"
                    />
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