<template>
    <section class="pain-factors overview">
        <div class="headers wrapper">
            <h2>Your Pain Factors</h2>
        </div>
        <div class="wrapper factors-container">
            <div class="loaded factors">
                <OverviewFactor v-for="factor in orderedFactors" :factorName="factor.factorType" :factorValue="factor.factorValue" :isMounted="isMounted" @factorClicked="handleFactorClick"/> 
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
const { smoothScroll } = useScroll();
const { disableAllFactors, toggleFactor, isFactorExpanded, factorsExpanded } = useFactorsExpanded();

const orderedFactors = props.painFactors.sort((a: PainFactorProps, b: PainFactorProps) => b.factorValue - a.factorValue);

const isMounted = ref(false);
const showOverlay = ref(false);

function handleFactorClick(factorName: string) {
    if (factorName === 'psychological distress') {
        factorName = 'psychological';
    }

    const factorIdSelector = "#" + factorName;
    smoothScroll(factorIdSelector);
    
    // document.body.style.overflow = 'hidden';
    
    showOverlay.value = true;
}

function closeOverlay() {
    document.body.style.overflow = 'auto';
    showOverlay.value = false;
}

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

</style>

<style lang="css" scoped>

</style>