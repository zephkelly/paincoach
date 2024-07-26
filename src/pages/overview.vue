<template>
    <ion-app>
        <ion-content :fullscreen="true" class="ion-padding">
            <main>
                <OverviewHeader />
                <OverviewCalendar />
            </main>
        </ion-content>
    </ion-app>
</template>

<script setup lang="ts">
import OverviewHeader from '@/components/overview/header.vue';
import OverviewCalendar from '@/components/overview/calendar.vue';
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
}
</style>