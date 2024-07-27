<template>
    <section class="pain-factors overview panel">
        <div class="headers wrapper">
            <h2>Your Pain Factors</h2>
        </div>
    </section>
    <div class="wrapper factors">
        <Factor v-for="factor in props.painFactors" :factorName="factor.factorType" :factorValue="factor.factorValue"/>
    </div>
</template>

<script setup lang="ts">
import Factor from './factor.vue';
import { ref, onMounted, nextTick } from 'vue';

import { PainFactorProps } from '@/types/painFactor';

interface Props {
    painFactors: PainFactorProps[]
}

const props = defineProps<Props>();

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

.factors.wrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
}
</style>