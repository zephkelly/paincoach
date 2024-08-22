<template>
    <main>
        <MainHeader title="Calendar" :dynamicDropdownComponent="OverviewTimelineDropdown"/>
    </main>
</template>

<script lang="ts" setup>
import MainHeader from '@/components/mainHeader.vue';
import OverviewTimelineDropdown from '@/components/overview/timelineDropdown.vue';


definePageMeta({
    alias: ['/calendar'],
    title: 'Calendar',
    description: 'This is the calendar page',
})
</script>