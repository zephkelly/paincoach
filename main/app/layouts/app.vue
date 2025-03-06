<template>
    <div class="dashboard-container">
        <DashboardNavbar />
        <div class="dashboard-content-container">
            <DashboardSidebar />
            <slot />
        </div>
        <!-- <AppFooter /> -->
    </div>
</template>

<style lang="scss" scoped>
.dashboard-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-height: 100dvh;
}

.dashboard-content-container {
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