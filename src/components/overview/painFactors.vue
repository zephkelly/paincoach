<template>
    <section class="pain-factors overview">
        <div class="headers wrapper">
            <h2>Your Pain Factors</h2>
        </div>
        <div class="wrapper factors-container">
            <div class="loaded factors">
                <!-- <Transition name="fade"> -->
                    <div class="overlay" :class="{ active: showOverlay && anyFactorExpanded }" v-if="showOverlay && anyFactorExpanded" @click="closeOverlay"></div>
                <!-- </Transition> -->
                <OverviewFactor 
                v-for="factor in orderedFactors"
                :id="factor.factorID"
                :key="factor.factorType"
                :factorName="factor.factorType" 
                :factorValue="factor.factorValue" 
                :factorID="factor.factorID"
                :isMounted="isMounted"
                @factorClicked="handleFactorClick"/> 
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
//@ts-ignore
import type { PainFactorProps } from '@types/painFactor';
const { smoothScroll } = useScroll();
const { isAnyFactorExpanded, isFactorExpanded, disableAllFactors, disableAllButThenToggle, factorsExpanded } = useFactorsExpanded();

interface Props {
    painFactors: PainFactorProps[]
}

const props = defineProps<Props>();
const isMounted = ref(false);
const orderedFactors = props.painFactors.sort((a: PainFactorProps, b: PainFactorProps) => b.factorValue - a.factorValue);

const anyFactorExpanded = computed(() => isAnyFactorExpanded());

const showOverlay = ref(false);
const timeoutScrollID = ref<number | null>(null);
const timeoutOverflowID = ref<number | null>(null);

function handleFactorClick(factorID: string) {
    const expandedSate = disableAllButThenToggle(factorID);

    if (expandedSate) {
        openOverlay(factorID);
    } else {
        closeOverlay();
    }
}

function openOverlay(factorID: string) {
    const factorIdSelector = "#" + factorID;
    showOverlay.value = true;
    
    timeoutScrollID.value = setTimeout(() => {
        smoothScroll(factorIdSelector);
    }, 100);

    timeoutOverflowID.value = setTimeout(() => {
        document.body.style.overflow = 'hidden';
    }, 500);
}

function closeOverlay() {
    disableAllFactors();
    document.body.style.overflow = '';
    showOverlay.value = false;
    cancelOverlayTimeout();
}

function cancelOverlayTimeout() {
    if (timeoutScrollID.value !== null) {
        clearTimeout(timeoutScrollID.value);
        clearTimeout(timeoutOverflowID.value);
        timeoutScrollID.value = null;
    }
}

onMounted(() => {
    isMounted.value = true;
});
</script>

<style lang="css" scoped>
h2 {
    padding-left: 1rem;
}

.pain-factors.overview {
    background-color: transparent;
    margin-top: 42px;
    padding-top: 0px;
    padding-bottom: 0px;
    width: 100%;
    max-width: 482px;
    min-width: 268px;
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
    will-change: height;
}
</style>

<style lang="css" scoped>
.fade-enter, .fade-leave-to {
    opacity: 0;
}

.fade-enter-to, .fade-leave {
    opacity: 1;
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--background-color-overlay);
    z-index: 80;
    will-change: opacity;
}
</style>