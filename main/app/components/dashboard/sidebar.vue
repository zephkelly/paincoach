<template>
    <section class="app-sidebar sidebar-border-animation" :class="{ 'app-sidebar--open': isAppSidebarOpen }">
        <div class="app-sidebar--content">
            <ul class="sidebar-items">
                <li class="sidebar-item sub-menu-item dashboard-item">
                    <NuxtLink to="/dashboard" class="dashboard-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></g></svg>
                        <h3>Dashboard</h3>
                    </NuxtLink>
                </li>

                <!-- User management -->
                <li class="sidebar-item users" :class="{ closed: userRole === 'patient'}">
                    <Transition name="fast-fade">
                        <div v-if=" isAdminUser || userRole === 'clinician'">
                            <div class="sidebar-item-header">
                                <div class="toggleable-header">
                                    <Transition name="fade">
                                        <h4 v-if="ready" :key="manageableUsersType">{{ capitaliseFirstLetter(manageableUsersType) }}</h4>
                                        <div v-else
                                            class="loading-users-header skeleton-component"
                                            :style="{ width: 70 * (0.85 + Math.random() * 0.2) + 'px'}"
                                        ></div>
                                    </Transition>
                                </div>
                            </div>
                            <ul class="sub-menu">
                                <li class="sub-menu-item">
                                    <Transition name="fade">
                                        <NuxtLink v-if="ready" :to="yourUsersLinkComputed" class="add-users-button">
                                            Your
                                            <div class="user-type">
                                                <transition name="fade">
                                                    <span :key="manageableUsersType">{{ manageableUsersType }}</span>
                                                </transition>
                                            </div>
                                        </NuxtLink>
                                        <div v-else
                                            class="loading-add-users skeleton-component skeleton-component-panel"
                                            :style="{ width: 110 * (0.85 + Math.random() * 0.3) + 'px'}"
                                        ></div>
                                    </Transition>
                                </li>
                                <li class="sub-menu-item">
                                    <Transition name="fade">
                                        <NuxtLink v-if="ready" :to="yourAddUsersLinkComputed" class="add-users-button">
                                            Add new
                                            <div class="user-type">
                                                <transition name="fade">
                                                    <span :key="manageableUsersType">{{ manageableUsersType }}</span>
                                                </transition>
                                            </div>
                                        </NuxtLink>
                                        <div v-else
                                            class="loading-add-users skeleton-component skeleton-component-panel"
                                            :style="{ width: 110 * (0.85 + Math.random() * 0.3) + 'px'}"
                                        ></div>
                                    </Transition>
                                </li>
                            </ul>
                        </div>
                    </Transition>
                </li>

                <li class="sidebar-item">
                    <div class="sidebar-item-header">
                        <h4>Settings</h4>
                    </div>
                </li>
            </ul>
        </div>
    </section>
</template>

<script lang="ts" setup>
const {
    isAppSidebarOpen,
    setOpen
} = useAppSidebar();

const {
    ready,
    userRole,
    isAdminUser
} = useAuth();

const manageableUsersType = computed(() => {
    if (isAdminUser.value) {
        return 'users';
    } else if (userRole.value === 'clinician') {
        return 'patients';
    }
})

const yourUsersLinkComputed = computed(() => {
    if (isAdminUser.value) {
        return `/dashboard/manage/user`;
    } else if (userRole.value === 'clinician') {
        return `/dashboard/manage/user/patient?tab=0`;
    }
})

const yourAddUsersLinkComputed = computed(() => {
    if (isAdminUser.value) {
        return `/dashboard/manage/user/add`;
    } else if (userRole.value === 'clinician') {
        return `/dashboard/manage/user/patient?tab=1`;
    }
})

function capitaliseFirstLetter(string?: string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const route = useRoute();
watch(() => route.path, () => {
    setOpen(false);
})
</script>

<style lang="scss" scoped>
section.app-sidebar {
    position: sticky;
    display: flex;
    flex-direction: column;
    width: 0;
    top: 58px;
    bottom: 0;
    overflow: hidden;
    background-color: var(--panel-color);
    border-right: 1px solid transparent;
    transition: width 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);
    width: 0px;
    border-right: 0px;
    
    .app-sidebar--content {
        position: fixed;
        padding: 1.5rem 0.8rem;
        opacity: 0;
        transition:
            opacity 0.35s cubic-bezier(0.075, 0.82, 0.165, 1),
            width 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);
        width: 0px;
        box-sizing: border-box;
        overflow: hidden;
    }

    &.app-sidebar--open {
        width: 288px;
        border-color: var(--border-5-color);
        border-right: 1px solid var(--border-7-color);

        .app-sidebar--content {
            width: 288px;
            opacity: 1;
        }
    }
}

.sidebar-items {
    .sidebar-item {
        font-size: 0.9rem;
        box-sizing: border-box;

        .sidebar-item-header {

            h4 {
                line-height: 30px;
                color: var(--text-5-color);
            }
        }


        &.users {
            height: 58px;
            margin-bottom: 2rem;
            transition: height 0.35s cubic-bezier(0.075, 0.82, 0.165, 1), margin-bottom 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);

            &.closed {
                height: 0;
                margin-bottom: 0;
            }

            .toggleable-header {
                height: 30px;
                position: relative;

                .loading-users-header {
                    height: 12px;                
                    border-radius: 0.25rem;
                    top: 50%;
                    transform: translateY(-50%);
                }

                h4, .loading-users-header {
                    position: absolute;
                }
            }

            .add-users-button {
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 0.25rem;
                width: 100%;
                height: 28px;

                .user-type {
                    display: flex;
                    align-items: center;
                    height: 100%;
                    width: 100%;
                    position: relative;

                    span {
                        position: absolute;
                    }
                }

                
            }
        } 
    }

    .sidebar-item.loading {
        height: 44px;


    }
}

.sidebar-item.dashboard-item {
    border: 1px solid var(--primary-border-1-color);
    border-radius: 0.25rem;
    background-color: var(--primary-background-3-color);

    &:hover {
        background-color: var(--primary-background-4-color);
        border-color: var(--primary-border-color);
    }

    &:active {
        background-color: var(--primary-background-3-color);
    }
    
    a {
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;

        svg, h3 {
            color: var(--primary-text-color);
        }
    }
}

.dashboard-item {
    margin-bottom: 2rem;
    height: 40px;

    a {
        transition: gap 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);
    }

    h3 {
        font-size: 1rem;
    }

    svg {
        height: 18px;
        width: 18px;
        // transition: height 0.35s cubic-bezier(0.075, 0.82, 0.165, 1), width 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);
        fill: var(--text-5-color);
    }
}

.sub-menu-item {
    position: relative;
    display: flex;
    align-items: center;
    min-height: 28px;
    width: 100%;
    box-sizing: border-box;
    cursor: pointer;
    border-left: 1px solid transparent;
    padding: 0rem 0rem;
    border-top-right-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
    transition: 
        background-color 0.35s cubic-bezier(0.075, 0.82, 0.165, 1),
        border-color 0.35s cubic-bezier(0.075, 0.82, 0.165, 1),
        padding 0.15s cubic-bezier(0.075, 0.82, 0.165, 1);

    &:hover {
        background-color: var(--background-3-color);
        border-color: var(--border-5-color);
        padding: 0rem 0.5rem;
    }

    .loading-add-users {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        height: 12px;
        border-radius: 0.25rem;
        
    }
}

a {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    text-wrap: nowrap;
}
</style>