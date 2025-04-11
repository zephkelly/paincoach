<template>
    <Page padHeader>
        <template #header>
            <slot name="header"/>
        </template>

        <template #default>
            <div class="tabs-container">
                <Tabs :tabs="tabs" :loading="loading" :defaultTabIndex="defaultTabIndex" />
            </div>
        </template>
    </Page>
</template>

<script lang="ts" setup>
import { type PageProps } from '@/types/page';

import { type TabItem } from '@/types/tab/item';

interface PageTabsProps extends PageProps {
    tabs: TabItem[];
    loading: boolean;
    defaultTabIndex?: number;
}

const props = defineProps<PageTabsProps>();
</script>

<style lang="scss" scoped>


.tabs-container {
    position: relative;
    min-height: calc(100dvh - 2rem - 52px - 40px - 38px);
    width: 100%;
}
</style>