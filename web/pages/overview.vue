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
// import MainHeader from '~/components/mainHeader.vue';
//@ts-expect-error
import OverviewTimelineDropdown from '@/components/overview/timelineDropdown.vue';

const newDate = ref(new Date())

definePageMeta({
    alias: ['/'],
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
.page {
    min-height: 740px;
}
</style>

<style lang="css">
.platform-web button {
    cursor: pointer;
    transition: background-color 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
}

.platform-web button:hover {
    background-color: var(--panel-hover);
}
</style>