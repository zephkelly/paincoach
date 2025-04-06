<template>
    <div class="navbar-container">
        <DashboardNavbar />
        <div class="sidebar-container">
            <DashboardSidebar />
            <slot />
        </div>
        <!-- <AppFooter /> -->
    </div>
</template>

<script lang="ts" setup>
await usePermissions();
</script>

<style lang="scss" scoped>
.navbar-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-height: 100dvh;
}

.sidebar-container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    width: 100%;
    min-height: calc(100dvh - 58px);
    padding: 0;
    margin: 0;
    flex-grow: 1;
}
</style>