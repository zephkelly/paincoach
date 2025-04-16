<template>
    <MobilePage bottom-margin>
        <MainHeader :title="'Overview'">

            <template #dropdown>
                <TimelineDropdown :initialDate="newDate" />
            </template>
        </MainHeader>
        <ECard>
            <CalendarOverview :initialDate="newDate" /> 
        </ECard>
            <!-- <OverviewLifestyleScore :lifestyleScore="82"/>
            <OverviewPainFactors :painFactors="factors" /> -->
    </MobilePage>
</template>


<script setup lang="ts">
import { uuidv7 } from '@@/shared/utils/uuid';

const newDate = ref(new Date())

async function getRecords() {
    try {
        const records = await $fetch('/api/v1/record/daily/pain/month');

        console.log('Fetched records', records);
    }
    catch(error: any) {
        console.error('Error fetching records:', error);
    }
}

getRecords();

type PainFactor = 'psychological distress' | 'sleep' | 'exercise' | 'nutrition' | 'social connection';
type PainFactorID = 'psychological' | 'sleep' | 'exercise' | 'nutrition' | 'social';

export interface PainFactorProps {
    factorID: PainFactorID
    factorType: PainFactor;
    factorValue: number;
}

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

<style lang="scss" scoped>

</style>