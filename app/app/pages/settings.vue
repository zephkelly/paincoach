<template>
    <MobilePage>
        <div class="wrapper">
            <PrimitiveSliderInput
                :min="1"
                :max="5"
                :step="1"
                bounce-effect="medium"
                transition-speed="normal"
                :max-bounce-distance="10"
                :colorVariables="['--pain-0', '--pain-1', '--pain-2', '--pain-3']"
                stepIndicatorStyle="line"
                show-step-indicators
                use-hardware-acceleration
            />
        </div>     
    </MobilePage>
</template>

<script setup lang="ts">
// const sliderValue = ref(3);
</script>

<style lang="scss" scoped>
.wrapper {
    width: 80%;
}
</style>