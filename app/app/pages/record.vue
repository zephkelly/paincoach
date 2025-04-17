<template>
    <MobilePage>
        <form>
            <LogCard
                title="What was your level of pain today?"
            >
                <LogIconSlider
                    :min="0"
                    :max="10"
                    v-model="painLevel"
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
                title="How was your mood today?"
            >
                <LogIconSlider
                    :min="1"
                    :max="5"
                    v-model="moodLevel"
                    :value-config="{
                        precision: 0
                    }"
                    :indicators="{
                        stepIndicatorStyle: 'numbered',
                        maxIndicators: 5
                    }"
                    :descriptors="[
                        { label: 'Very poor', value: 1 },
                        { label: 'Poor', value: 2 },
                        { label: 'Acceptable', value: 3 },
                        { label: 'Good', value: 4 },
                        { label: 'Very good', value: 5 },
                    ]"
                    invert-colors
                >
                    <template #icon-0>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4"><path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/><path stroke-linecap="round" d="M31 18v1m-14-1v1m14 12s-2-4-7-4s-7 4-7 4"/></g></svg>
                    </template>

                    <template #icon-1>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><!-- Icon from IconPark Outline by ByteDance - https://github.com/bytedance/IconPark/blob/master/LICENSE --><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4"><path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/><path stroke-linecap="round" d="M31 18v1m-14-1v1m0 12h14"/></g></svg>
                    </template>

                    <template #icon-2>
                        <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" width="32" height="32" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4"><path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/><path stroke-linecap="round" d="M31 18v1m-14-1v1m14 12s-2 4-7 4s-7-4-7-4"/></g></svg>
                    </template>
                </LogIconSlider>
            </LogCard>

            <LogCard
                title="How often did you feel stressed today?"
            >
                <LogIconSlider
                    :min="1"
                    :max="5"
                    v-model="stressLevel"
                    :value-config="{
                        precision: 0
                    }"
                    :indicators="{
                        stepIndicatorStyle: 'numbered',
                        maxIndicators: 5
                    }"
                    :descriptors="[
                        { label: 'Never', value: 1 },
                        { label: 'Rarely', value: 2 },
                        { label: 'Sometimes', value: 3 },
                        { label: 'Often', value: 4 },
                        { label: 'Almost always', value: 5 },
                    ]"
                />
            </LogCard>

            <LogCard
                title="How often did you feel anxious today?"
            >
                <LogIconSlider
                    :min="1"
                    :max="5"
                    v-model="anxietyLevel"
                    :value-config="{
                        precision: 0
                    }"
                    :indicators="{
                        stepIndicatorStyle: 'numbered',
                        maxIndicators: 5
                    }"
                    :descriptors="[
                        { label: 'Never', value: 1 },
                        { label: 'Rarely', value: 2 },
                        { label: 'Sometimes', value: 3 },
                        { label: 'Often', value: 4 },
                        { label: 'Almost always', value: 5 },
                    ]"
                />
            </LogCard>

            <LogCard
                title="How would you rate your sleep last night?"
            >
                <LogIconSlider
                    :min="1"
                    :max="5"
                    v-model="sleepLevel"
                    :value-config="{
                        precision: 0
                    }"
                    :indicators="{
                        stepIndicatorStyle: 'numbered',
                        maxIndicators: 5
                    }"
                    :descriptors="[
                        { label: 'Very poor', value: 1 },
                        { label: 'Poor', value: 2 },
                        { label: 'Acceptable', value: 3 },
                        { label: 'Good', value: 4 },
                        { label: 'Very good', value: 5 },
                    ]"
                    invert-colors
                >
                    <template #icon-0>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4"><path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/><path stroke-linecap="round" d="M31 18v1m-14-1v1m14 12s-2-4-7-4s-7 4-7 4"/></g></svg>
                    </template>

                    <template #icon-1>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><!-- Icon from IconPark Outline by ByteDance - https://github.com/bytedance/IconPark/blob/master/LICENSE --><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4"><path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/><path stroke-linecap="round" d="M31 18v1m-14-1v1m0 12h14"/></g></svg>
                    </template>

                    <template #icon-2>
                        <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" width="32" height="32" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4"><path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/><path stroke-linecap="round" d="M31 18v1m-14-1v1m14 12s-2 4-7 4s-7-4-7-4"/></g></svg>
                    </template>
                </LogIconSlider>
            </LogCard>


            <LogCard
                title="How would you rate your intake of plants today?"
            >
                <LogIconSlider
                    :min="1"
                    :max="5"
                    v-model="plantLevel"
                    :value-config="{
                        precision: 0
                    }"
                    :indicators="{
                        stepIndicatorStyle: 'numbered',
                        maxIndicators: 5
                    }"
                    :descriptors="[
                        { label: 'Very poor', value: 1 },
                        { label: 'Poor', value: 2 },
                        { label: 'Acceptable', value: 3 },
                        { label: 'Good', value: 4 },
                        { label: 'Very good', value: 5 },
                    ]"
                    invert-colors
                    no-icons
                />
            </LogCard>

            <LogCard
                title="How often did the food you consume consist of primarily while foods?"
            >
                <LogIconSlider
                    :min="1"
                    :max="5"
                    v-model="wholeFoodLevel"
                    :value-config="{
                        precision: 0
                    }"
                    :indicators="{
                        stepIndicatorStyle: 'numbered',
                        maxIndicators: 5
                    }"
                    :descriptors="[
                        { label: 'Never', value: 1 },
                        { label: 'Rarely', value: 2 },
                        { label: 'Sometimes', value: 3 },
                        { label: 'Often', value: 4 },
                        { label: 'Almost always', value: 5 },
                    ]"
                    no-icons
                />
            </LogCard>

            <LogCard
                title="How often were the foods you consumed high in sugar?"
            >
                <LogIconSlider
                    :min="1"
                    :max="5"
                    v-model="sugarLevel"
                    :value-config="{
                        precision: 0
                    }"
                    :indicators="{
                        stepIndicatorStyle: 'numbered',
                        maxIndicators: 5
                    }"
                    :descriptors="[
                        { label: 'Never', value: 1 },
                        { label: 'Rarely', value: 2 },
                        { label: 'Sometimes', value: 3 },
                        { label: 'Often', value: 4 },
                        { label: 'Almost always', value: 5 },
                    ]"
                    no-icons
                />
            </LogCard>

            <LogCard
                title="What was the intensity of the exercise you performed today?"
            >
                <LogIconSlider
                    :min="1"
                    :max="10"
                    v-model="exerciseLevel"
                    :value-config="{
                        precision: 0
                    }"
                    :indicators="{
                        stepIndicatorStyle: 'numbered',
                        maxIndicators: 11
                    }"
                    :descriptors="[
                        { label: 'Very light', value: 1 },
                        { label: 'Light', value: 2 },
                        { label: 'Moderate', value: 3 },
                        { label: 'Somewhat hard', value: 4 },
                        { label: 'Hard', value: 5 },
                        { label: 'Very hard', value: 7 },
                        { label: 'Intense', value: 8 },
                        { label: 'Extremely intense', value: 9 },
                        { label: 'Maximum effort', value: 10 }
                    ]"
                    invert-colors
                    no-icons
                />
            </LogCard>

            <LogCard
                title="How would you rate the quality of your relationships today?"
            >
                <LogIconSlider
                    :min="1"
                    :max="5"
                    v-model="relationshipLevel"
                    :value-config="{
                        precision: 0
                    }"
                    :indicators="{
                        stepIndicatorStyle: 'numbered',
                        maxIndicators: 5
                    }"
                    :descriptors="[
                        { label: 'Very poor', value: 1 },
                        { label: 'Poor', value: 2 },
                        { label: 'Acceptable', value: 3 },
                        { label: 'Good', value: 4 },
                        { label: 'Very good', value: 5 },
                    ]"
                    invert-colors
                    no-icons
                />
            </LogCard>

            <LogCard
                title="How would you rate your sense of belonging today?"
            >
                <LogIconSlider
                    :min="1"
                    :max="5"
                    v-model="belongingLevel"
                    :value-config="{
                        precision: 0
                    }"
                    :indicators="{
                        stepIndicatorStyle: 'numbered',
                        maxIndicators: 5
                    }"
                    :descriptors="[
                        { label: 'Very poor', value: 1 },
                        { label: 'Poor', value: 2 },
                        { label: 'Acceptable', value: 3 },
                        { label: 'Good', value: 4 },
                        { label: 'Very good', value: 5 },
                    ]"
                    invert-colors
                    no-icons
                />
            </LogCard>
        </form>
    </MobilePage>
</template>


<script setup lang="ts">
const painLevel = ref(3);
const moodLevel = ref(3);
const stressLevel = ref(3);
const anxietyLevel = ref(3);
const sleepLevel = ref(3);
const plantLevel = ref(3);
const wholeFoodLevel = ref(3);
const sugarLevel = ref(3);
const exerciseLevel = ref(3);
const relationshipLevel = ref(3);
const belongingLevel = ref(3);

// definePageMeta({
//     layout: 'empty'
// })
</script>

<style lang="scss" scoped>
form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;
    box-sizing: border-box;
}
</style>