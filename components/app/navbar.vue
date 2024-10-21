<template>
    <nav class="navbar footer">
        <div class="container">
            <Transition name="fade">
                <div class="overlay" v-if="anyFactorExpanded"></div>
            </Transition>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item">
                        <NuxtLink :to="baseDemoRoute + '/'" class="nav-link overview" :class="{ active: isOverviewActive }">
                            <svg class="overview" :class="{ active: isOverviewActive }" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M240-200h133.85v-237.69h212.3V-200H720v-360L480-740.77 240-560v360Zm-60 60v-450l300-225.77L780-590v450H526.15v-237.69h-92.3V-140H180Zm300-330.38Z"/></svg>
                        </NuxtLink>
                    </li>
                    <li class="nav-item">
                        <NuxtLink :to="baseDemoRoute + '/calendar'" class="nav-link" :class="{ active: isCalendarActive }">
                            <svg class="calendar" :class="{ active: isCalendarActive }" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M212.31-100Q182-100 161-121q-21-21-21-51.31v-535.38Q140-738 161-759q21-21 51.31-21h55.38v-84.61h61.54V-780h303.08v-84.61h60V-780h55.38Q778-780 799-759q21 21 21 51.31v535.38Q820-142 799-121q-21 21-51.31 21H212.31Zm0-60h535.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46v-375.38H200v375.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85ZM200-607.69h560v-100q0-4.62-3.85-8.46-3.84-3.85-8.46-3.85H212.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v100Zm0 0V-720v112.31Zm280 210.77q-14.69 0-25.04-10.35-10.34-10.34-10.34-25.04 0-14.69 10.34-25.04 10.35-10.34 25.04-10.34t25.04 10.34q10.34 10.35 10.34 25.04 0 14.7-10.34 25.04-10.35 10.35-25.04 10.35Zm-160 0q-14.69 0-25.04-10.35-10.34-10.34-10.34-25.04 0-14.69 10.34-25.04 10.35-10.34 25.04-10.34t25.04 10.34q10.34 10.35 10.34 25.04 0 14.7-10.34 25.04-10.35 10.35-25.04 10.35Zm320 0q-14.69 0-25.04-10.35-10.34-10.34-10.34-25.04 0-14.69 10.34-25.04 10.35-10.34 25.04-10.34t25.04 10.34q10.34 10.35 10.34 25.04 0 14.7-10.34 25.04-10.35 10.35-25.04 10.35ZM480-240q-14.69 0-25.04-10.35-10.34-10.34-10.34-25.03 0-14.7 10.34-25.04 10.35-10.35 25.04-10.35t25.04 10.35q10.34 10.34 10.34 25.04 0 14.69-10.34 25.03Q494.69-240 480-240Zm-160 0q-14.69 0-25.04-10.35-10.34-10.34-10.34-25.03 0-14.7 10.34-25.04 10.35-10.35 25.04-10.35t25.04 10.35q10.34 10.34 10.34 25.04 0 14.69-10.34 25.03Q334.69-240 320-240Zm320 0q-14.69 0-25.04-10.35-10.34-10.34-10.34-25.03 0-14.7 10.34-25.04 10.35-10.35 25.04-10.35t25.04 10.35q10.34 10.34 10.34 25.04 0 14.69-10.34 25.03Q654.69-240 640-240Z"/></svg>
                        </NuxtLink>
                    </li>
                    <li class="nav-item">
                        <NuxtLink :to="baseDemoRoute + '/insights'" class="nav-link" :class="{ active: isInsightsActive }">
                            <svg class="insights" :class="{ active: isInsightsActive }" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M294.62-290h59.99v-190h-59.99v190Zm310.77 0h59.99v-390h-59.99v390ZM450-290h60v-110h-60v110Zm0-190h60v-80h-60v80ZM212.31-140Q182-140 161-161q-21-21-21-51.31v-535.38Q140-778 161-799q21-21 51.31-21h535.38Q778-820 799-799q21 21 21 51.31v535.38Q820-182 799-161q-21 21-51.31 21H212.31Zm0-60h535.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46v-535.38q0-4.62-3.85-8.46-3.84-3.85-8.46-3.85H212.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v535.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85ZM200-760v560-560Z"/></svg>
                        </NuxtLink>
                    </li>
                    <li class="nav-item">
                        <NuxtLink :to="baseDemoRoute + '/settings'" class="nav-link" :class="{ active: isSettingsActive }">
                            <svg class="settings" :class="{ active: isSettingsActive }" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m387.69-100-15.23-121.85q-16.07-5.38-32.96-15.07-16.88-9.7-30.19-20.77L196.46-210l-92.3-160 97.61-73.77q-1.38-8.92-1.96-17.92-.58-9-.58-17.93 0-8.53.58-17.34t1.96-19.27L104.16-590l92.3-159.23 112.46 47.31q14.47-11.46 30.89-20.96t32.27-15.27L387.69-860h184.62l15.23 122.23q18 6.54 32.57 15.27 14.58 8.73 29.43 20.58l114-47.31L855.84-590l-99.15 74.92q2.15 9.69 2.35 18.12.19 8.42.19 16.96 0 8.15-.39 16.58-.38 8.42-2.76 19.27L854.46-370l-92.31 160-112.61-48.08q-14.85 11.85-30.31 20.96-15.46 9.12-31.69 14.89L572.31-100H387.69ZM440-160h78.62L533-267.15q30.62-8 55.96-22.73 25.35-14.74 48.89-37.89L737.23-286l39.39-68-86.77-65.38q5-15.54 6.8-30.47 1.81-14.92 1.81-30.15 0-15.62-1.81-30.15-1.8-14.54-6.8-29.7L777.38-606 738-674l-100.54 42.38q-20.08-21.46-48.11-37.92-28.04-16.46-56.73-23.31L520-800h-79.38l-13.24 106.77q-30.61 7.23-56.53 22.15-25.93 14.93-49.47 38.46L222-674l-39.38 68L269-541.62q-5 14.24-7 29.62t-2 32.38q0 15.62 2 30.62 2 15 6.62 29.62l-86 65.38L222-286l99-42q22.77 23.38 48.69 38.31 25.93 14.92 57.31 22.92L440-160Zm40.46-200q49.92 0 84.96-35.04 35.04-35.04 35.04-84.96 0-49.92-35.04-84.96Q530.38-600 480.46-600q-50.54 0-85.27 35.04T360.46-480q0 49.92 34.73 84.96Q429.92-360 480.46-360ZM480-480Z"/></svg>
                        </NuxtLink>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script lang="ts" setup>
const route = useRoute();

const { isAnyFactorExpanded } = useFactorsExpanded();
const anyFactorExpanded = computed(() => isAnyFactorExpanded());

const { baseDemoRoute } = useDemoToken();

const isOverviewActive = computed(() => {
    if (route.path === baseDemoRoute.value) {
        return true;
    }
    else if (route.path === baseDemoRoute.value + '/') {
        return true;
    }
    
    return false
});

const isCalendarActive = computed(() => route.path === baseDemoRoute.value + '/calendar');
const isInsightsActive = computed(() => route.path === baseDemoRoute.value + '/insights');
const isSettingsActive = computed(() => route.path === baseDemoRoute.value + '/settings');
</script>

<style lang="css" scoped>
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to {
    opacity: 0;
}

.fade-enter-to, .fade-leave {
    opacity: 1;
}

nav.navbar .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--background-color-overlay);
    z-index: 0;
}
</style>

<style lang="css">
nav.navbar.footer {
    z-index: 1000;
    font-family: 'Inter', sans-serif;
    position: fixed;
    bottom: 0px;
    right: 0px;
    left: 0px;
    background-color: var(--panel);
    color: var(--text-color);
    padding: 1rem;
    height: 84px;
    box-sizing: border-box;
}

nav.navbar.footer ul {
    list-style-type: none;
    display: flex;
    align-items: flex-start;
    justify-content: space-around;
}

nav.navbar.footer li {
    width: 44px;
}

nav.navbar.footer a {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
}

nav.navbar.footer svg {
    height: 32px;
    width: 32px;
    fill: var(--text-color-inactive);
    transition: fill 0.5s ease;
}

nav.navbar.footer a.active svg {
    fill: var(--text-color);
    z-index: 1;
}

nav.navbar.footer svg.calendar, nav.navbar.footer svg.insights, nav.navbar.footer svg.settings {
    height: 30px;
    width: 30px;
}
</style>