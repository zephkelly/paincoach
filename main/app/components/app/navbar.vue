<template>
    <header>
        <img src="~/assets/images/logo-square.webp" alt="Logo" @click="handleProfileClick" />
    </header>
    <AppAccountOptionsModal />
</template>

<script lang="ts" setup>
const {
    accountProfileModalOpen,
    lastClickEvent
} = useAccountProfile();

const handleProfileClick = (event: MouseEvent) => {
    lastClickEvent.value = event;
    accountProfileModalOpen.value = true;
};
</script>

<style lang="scss" scoped>
header {
    height: 64px;
    padding: 0.5rem 1rem;
    box-sizing: border-box;

    img {
        height: 100%;
        position: relative;
        left: -4px;
    }
}
</style>