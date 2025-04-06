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
import OverviewTimelineDropdown from '~/components/overview/timelineDropdown.vue';
import { type PainFactorProps } from '~/types/painFactor';

const newDate = ref(new Date())

definePageMeta({
    title: 'Overview',
    description: 'This is the overview page',
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

<style lang="css" scoped>
.page-container {
    
}
</style>

<style lang="css">

</style>
