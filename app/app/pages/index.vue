<template>
    <MobilePage>
        <div class="settings-inner-wrapper">
            <LogCard
                title="What was your level of pain today?"
            >
                <LogIconSlider
                    :min="0"
                    :max="10"
                    v-model="sliderValue"
                    v-model:color="sliderColor"
                    :value-config="{
                        precision: 0
                    }"
                    :indicators="{
                        stepIndicatorStyle: 'numbered',
                        maxIndicators: 11
                    }"
                    :descriptors="[
                        { label: 'No Pain', value: 0 },
                        { label: 'Mild', value: 2 },
                        { label: 'Moderate', value: 4 },
                        { label: 'Severe', value: 6 },
                        { label: 'Very severe', value: 8 },
                        { label: 'Worst pain imaginable', value: 10 }
                    ]"
                >
                    <template #icon-0>
                        <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" width="32" height="32" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4"><path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/><path stroke-linecap="round" d="M31 18v1m-14-1v1m14 12s-2 4-7 4s-7-4-7-4"/></g></svg>
                    </template>

                    <template #icon-1>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><!-- Icon from IconPark Outline by ByteDance - https://github.com/bytedance/IconPark/blob/master/LICENSE --><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4"><path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/><path stroke-linecap="round" d="M31 18v1m-14-1v1m0 12h14"/></g></svg>
                    </template>

                    <template #icon-2>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><!-- Icon from IconPark Outline by ByteDance - https://github.com/bytedance/IconPark/blob/master/LICENSE --><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4"><path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/><path stroke-linecap="round" d="M31 18v1m-14-1v1m0 13l14-2"/></g></svg>
                    </template>

                    <template #icon-3>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4"><path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/><path stroke-linecap="round" d="M31 18v1m-14-1v1m14 12s-2-4-7-4s-7 4-7 4"/></g></svg>
                    </template>

                    <template #icon-4>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4"><path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/><path stroke-linecap="round" d="m33 25l-4-2m-11 0l-4 2m17 10s-2-4-7-4s-7 4-7 4"/></g></svg>
                    </template>
                </LogIconSlider>
            </LogCard>
            <LogCard
                title="How would you rate your mood today?"
                style="margin-top: 2rem;"
            >
                <LogIconSlider
                    :min="1"
                    :max="5"
                    v-model="sliderValue2"
                    v-model:color="sliderColor2"
                    :value-config="{
                        precision: 0
                    }"
                    :indicators="{
                        stepIndicatorStyle: 'numbered',
                        maxIndicators: 5
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