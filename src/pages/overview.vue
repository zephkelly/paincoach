<template>
    <ion-app>
        <ion-content :fullscreen="true" class="ion-padding">
            <main>
                <OverviewHeader />
                <div class="page">
                    <OverviewCalendar />
                    <OverviewLifestyleScore :lifestyleScore="82"/>
                    <OverviewPainFactors :painFactors="factors" />
                </div>
            </main>
        </ion-content>
    </ion-app>
</template>

<script setup lang="ts">
import OverviewHeader from '@/components/overview/header.vue';
import OverviewCalendar from '@/components/overview/calendar.vue';
import OverviewLifestyleScore from '@/components/overview/lifestyleScore.vue';
import OverviewPainFactors from '@/components/overview/painFactors.vue';

import { PainFactorProps, PainFactor } from '@/types/painFactor';

//create an object with a key for factor name and value for factor value
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

const factors: PainFactorProps[] = [factor1, factor2, factor3, factor4, factor5];

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
    margin-bottom: 8rem;
}

.page {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 16px;
    width: 100%;
}
</style>