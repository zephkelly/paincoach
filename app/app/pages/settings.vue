<template>
    <MobilePage>
        <div class="wrapper">
            <PrimitiveSliderInput
                v-model="sliderValue"
                :min="1"
                :max="5"
                :step="1"
                bounce-effect="light"
                transition-speed="fast"
                :max-bounce-distance="10"
            />
        </div>     
    </MobilePage>
</template>

<script setup lang="ts">
const sliderValue = ref(2.5);
</script>

<style lang="scss" scoped>
.wrapper {
    width: 80%;
}
</style>