<template>
    <OverviewHeader />
    <div class="page">
        <OverviewCalendar />
        <OverviewLifestyleScore :lifestyleScore="82"/>
        <OverviewPainFactors :painFactors="factors" />
    </div>
</template>

<script lang="ts" setup>
definePageMeta({
    alias: ['/'],
    title: 'Overview',
    description: 'This is the overview page'
})


const factor1: PainFactorProps = {
    factorType: 'psychological distress',
    factorValue: 8
};

const factor2: PainFactorProps = {
    factorType: 'exercise',
    factorValue: 6
};

const factor3: PainFactorProps = {
    factorType: 'sleep',
    factorValue: 4
};

const factor4: PainFactorProps = {
    factorType: 'nutrition',
    factorValue: 2
};

const factor5: PainFactorProps = {
    factorType: 'social connection',
    factorValue: 1
};

const factors: PainFactorProps[] = [factor5, factor1, factor2, factor3, factor4];
</script>

<style lang="css" scoped>
.page {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 16px;
    height: 740px;
    width: 100%;
    margin-bottom: 8rem;
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