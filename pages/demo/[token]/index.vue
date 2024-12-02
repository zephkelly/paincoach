<template>
    <main>
        <MainHeader :title="'Overview'" :dynamicDropdownComponent="OverviewTimelineDropdown" />
        <div class="page-container">
            <OverviewCalendar :initialDate="newDate" />
            <OverviewLifestyleScore :lifestyleScore="82"/>
            <OverviewPainFactors :painFactors="factors" />
        </div>
    </main>
</template>

<script lang="ts" setup>
import MainHeader from '~/components/app/mainHeader.vue';
import OverviewTimelineDropdown from '@/components/app/overview/timelineDropdown.vue';
import OverviewCalendar from '@/components/app/overview/overviewCalendar.vue';
import OverviewLifestyleScore from '@/components/app/overview/lifestyleScore.vue';
import OverviewPainFactors from '@/components/app/overview/painFactors.vue';
import { type PainFactorProps } from '~/types/painFactor';

import { PainDataAnalyser } from '~~/server/utils/painDataAnalyser';

const newDate = ref(new Date())


const painDataAnalyser = new PainDataAnalyser();
const testData = painDataAnalyser.generateSyntheticData(1000);

const results = painDataAnalyser.analyzeHealthData(testData);

// Access the results
console.log('Correlations:', results.correlations);
console.log('Regression Results:', results.regression);

definePageMeta({
    layout: 'application',
    title: 'Overview',
    description: 'This is the overview page',
    middleware: 'verify-demo-token' 
})

const factor1: PainFactorProps = {
    factorID: 'psychological',
    factorType: 'psychological distress',
    factorValue: 8
};

const factor2: PainFactorProps = {
    factorID: 'exercise',
    factorType: 'exercise',
    factorValue: 6
};

const factor3: PainFactorProps = {
    factorID: 'sleep',
    factorType: 'sleep',
    factorValue: 4
};

const factor4: PainFactorProps = {
    factorID: 'nutrition',
    factorType: 'nutrition',
    factorValue: 2
};

const factor5: PainFactorProps = {
    factorID: 'social',
    factorType: 'social connection',
    factorValue: 1
};

const factors: PainFactorProps[] = [factor5, factor1, factor2, factor3, factor4];
</script>


<style lang="css">
.platform-web button {
    cursor: pointer;
    transition: background-color 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
}

.platform-web button:hover {
    background-color: var(--panel-hover);
}
.page-container {
    padding: 0 1rem;
}
</style>