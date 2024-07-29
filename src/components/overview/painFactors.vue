<template>
    <section class="pain-factors overview panel">
        <div class="headers wrapper">
            <h2>Your Pain Factors</h2>
        </div>
    </section>
    <div class="wrapper factors-container">
        <!-- <Transition name="fade"> -->
            <div class="loaded factors" v-if="isMounted === true">
                <OverviewFactor v-for="factor in props.painFactors" :factorName="factor.factorType" :factorValue="factor.factorValue"/> 
            </div>
        <!-- </Transition> -->
        <Transition name="fade">
            <div class="loading factors" v-if="isMounted === false">
                <button class="factor" v-for="i in 5">
                    <span class="indicator"></span>
                </button>
            </div>
        </Transition> 
    </div>
</template>

<script setup lang="ts">
//@ts-ignore
import type { PainFactorProps } from '@types/painFactor';

interface Props {
    painFactors: PainFactorProps[]
}

const props = defineProps<Props>();

//determine the order of the factors based on the pain level. Higher renders first
const orderedFactors = props.painFactors.sort((a: PainFactorProps, b: PainFactorProps) => b.factorValue - a.factorValue);

const isMounted = ref(false);

onMounted(() => {
    isMounted.value = true;
    nextTick(() => {
    });
});
</script>

<style lang="css" scoped>
.pain-factors.overview {
    background-color: transparent;
    margin-top: 48px;
    padding-top: 0px;
    padding-bottom: 0px;
}

.headers.wrapper {
    margin-bottom: 1rem;
}

.factors-container.wrapper {
    position: relative;
}

.loaded.factors, .loading.factors {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
}

.loading.factors {
    top: 0;
    position: absolute;
}

.loading.factors  > .factor {
    height: 4rem;
    width: 100%;
    border-radius: 12px;
    background-color: var(--panel);
}

/* .factor > .indicator {
    background-color: var(--pain-none);
    height: 100%;
    width: 1rem;
} */
</style>

<style lang="css" scoped>
.fade-enter-active, .fade-leave-active {
    transition: opacity 2s;
}

.fade-enter, .fade-leave-to {
    opacity: 0;
}

.fade-enter-to, .fade-leave {
    opacity: 1;
}
</style>