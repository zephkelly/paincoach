<template>
    <header>
        <div class="logo-wrapper">
            <img src="~/assets/images/logo-square.webp" alt="Logo" @click="handleProfileClick" />
        </div>
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

    .logo-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: auto;
        aspect-ratio: 1/1;
        display: flex;
        align-items: center;
        cursor: pointer;
        overflow: hidden;
        border-radius: 50%;
    }

    img {
        height: 120%;
        width: auto;
        aspect-ratio: 1/1;
        position: relative;
    }
}
</style>