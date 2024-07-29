<template>
    <!-- <ion-page>
        <ion-content class="ion-padding"> -->
            <main>
                <OverviewHeader />
                <div class="page">
                    <OverviewCalendar />
                    <OverviewLifestyleScore :lifestyleScore="82"/>
                    <OverviewPainFactors :painFactors="factors" />
                </div>
            </main>
        <!-- </ion-content>
    </ion-page> -->
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
ion-app {
    background-color: var(--background-color);
}

ion-content {
    --background: var(--background-color);
}

main {
    height: 100%;
    width: 100%;
    background-color: var(--background-color);
    display: flex;
    flex-direction: column;
    align-items: center;
}

.page {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 16px;
    width: 100%;
    margin-bottom: 8rem;
}
</style>