<script setup lang="ts">
import RecordRequestModal from '~/components/recordRequestModal.vue';

</script>

<template>
    <div class="default-layout">
        <main>
            <slot />
        </main>
        <RecordRequestModal />
        <Navbar />
    </div>
</template>

<style lang="scss" scoped>
.default-layout {
    display: flex;
    flex-direction: column;
    background-color: var(--background-color);
}
</style>