<template>
    <section class="pain-factors overview">
        <div class="headers wrapper">
            <h2>Your Pain Factors</h2>
        </div>
        <div class="wrapper factors-container">
            <div class="loaded factors">
                <OverviewFactor v-for="factor in props.painFactors" :factorName="factor.factorType" :factorValue="factor.factorValue" :isMounted="isMounted"/> 
            </div>
        </div>
    </section>
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
/* section {
    padding: 0px;
    display: flex;
    flex: 1;
} */

h2 {
    padding-left: 1rem;
}

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
    display: flex;
    flex: 1;
    position: relative;
}

.loaded.factors, .loading.factors {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
}

/* .loading.factors {
    top: 0;
    position: absolute;
}

.loading.factors  > .factor {
    height: 4rem;
    width: 100%;
    border-radius: 12px;
    background-color: var(--panel);
    display: flex;
    flex-direction: row;
}

.factor > .indicator {
    background-color: var(--pain-none);
    height: 100%;
    width: 1rem;
} */
</style>

<style lang="css" scoped>

</style>