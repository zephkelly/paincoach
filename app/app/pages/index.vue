<template>
    <MobilePage bottom-margin>
        <button @click="handleProfileClick">
            Record
        </button>
    </MobilePage>
</template>


<script setup lang="ts">
const {
    recordRequestModalOpen,
    lastClickEvent
} = useRecordRequest();

const handleProfileClick = (event: MouseEvent) => {
    lastClickEvent.value = event;
    recordRequestModalOpen.value = true;
};
</script>

<style lang="scss" scoped>

</style>