<template>
    <header>
        <div class="title">
            <div class="logo-wrapper">
                <img src="~/assets/images/logo-square.webp" alt="Logo" @click="toggleOpen" />
            </div>
            <div class="title-text">PAINCOACH</div>
        </div>
        <div class="content-main">
            <UserRoleChip v-show="loggedIn" :userRole="primaryRole" class="nav-role-chip" />
        </div>
        <div class="controls">
            <div class="privileged-controls" v-if="isPrivilegedUser">
                <EButton
                    @click="adminTogglesOpen = !adminTogglesOpen"
                    variant="outlined"
                    :class="{ open: adminTogglesOpen }"
                >
                    Controls
                </EButton>
                <div class="admin" v-show="adminTogglesOpen">
                    <div class="grid-group mock-roles">
                        <div class="grid-group-header">
                            <p>Mock Roles</p>
                        </div>
                        <div class="grid-group-content">
                            <EButton @click="setMockRoles(['owner'])" :class="{ active: primaryRole === 'owner' }">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M12 21.9q-.175 0-.325-.025t-.3-.075Q8 20.675 6 17.638T4 11.1V6.375q0-.625.363-1.125t.937-.725l6-2.25q.35-.125.7-.125t.7.125l6 2.25q.575.225.938.725T20 6.375V11.1q0 3.5-2 6.538T12.625 21.8q-.15.05-.3.075T12 21.9"/></svg>
                                Owner
                            </EButton>
                            <EButton @click="setMockRoles(['admin'])" :class="{ active: primaryRole === 'admin' }">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
                                Admin
                            </EButton>
                            <EButton @click="setMockRoles(['clinician'])" :class="{ active: primaryRole === 'clinician' }">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor"><path d="M20 22v-3c0-2.828 0-4.243-.879-5.121C18.243 13 16.828 13 14 13l-2 2l-2-2c-2.828 0-4.243 0-5.121.879C4 14.757 4 16.172 4 19v3m12-9v5.5"/><path d="M8.5 13v4m0 0a2 2 0 0 1 2 2v1m-2-3a2 2 0 0 0-2 2v1m9-13.5v-1a3.5 3.5 0 1 0-7 0v1a3.5 3.5 0 1 0 7 0m1.25 12.75a.75.75 0 1 1-1.5 0a.75.75 0 0 1 1.5 0"/></g></svg>
                                Clinician
                            </EButton>
                            <EButton @click="setMockRoles(['patient'])" :class="{ active: primaryRole === 'patient' }">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></g></svg>
                                Patient
                            </EButton>
                            <EButton @click="setMockRoles(['app'])" :class="{ active: primaryRole === 'app' }">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><rect width="10" height="14" x="3" y="8" rx="2"/><path d="M5 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-2.4M8 18h.01"/></g></svg>
                                App
                            </EButton>
                            <EButton @click="setMockRoles(['unregistered'])" :class="{ active: primaryRole === 'unregistered' }">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></g></svg>
                                Unregistered
                            </EButton>
                            <EButtonCollapsable
                                class="clear-mocks"
                                @click="clearMocks()"
                                square
                            >
                                <template #trailing-icon>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M7 11v2h10v-2zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8"/></svg>
                                </template>
                            </EButtonCollapsable>
                        </div>
                    </div>
                    <div class="grid-group navigator">
                        <div class="grid-group-header">
                            <p>Navigate</p>
                        </div>
                        <div class="grid-group-content">
                            <EInput class="navigator-input"
                                v-model="navigatorInput"
                                placeholder="Route"
                                type="text"
                            />
                            <EButton @click="navigate(navigatorInput)" style="max-width: 140px;">Submit</EButton>
                        </div>
                    </div>
                    <EButton @click="toggleMockLoading()" style="max-width: 140px;">Toggle Load</EButton>
                    
                </div>
            </div>
            <EButtonCollapsable v-show="loggedIn"
                class="logout"
                @click="logout"
                label="Logout"
                square
            >
                <template #trailing-icon>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14l5-5l-5-5m5 5H9"/></svg>
                </template>
            </EButtonCollapsable>
        </div>
    </header>
    <DashboardAccountOptionsModal />
</template>

<script lang="ts" setup>
import { EButton } from '#components';

const adminTogglesOpen = ref(false);

const {
    loggedIn,
    primaryRole
} = useAuth();

const navigatorInput = ref('');

function navigate(route: string) {
    if (route) {
        navigateTo(route);
        navigatorInput.value = '';
    }
}

const {
    toggleOpen,
    setOpen,
} = useAppSidebar();

const {
    setMockRoles,
    clearMocks,
    toggleMockLoading,
    clearSession,
    isPrivilegedUser,
} = useAuth();

async function logout() {
    try {
        await $fetch('/api/v1/auth/logout');
        await clearSession();
        setOpen(false)
        navigateTo('/dashboard/login');
    }
    catch(error) {
        console.error(error);
    }
}
</script>

<style lang="scss" scoped>
header {
    top: 0;
    position: sticky;
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: 1rem;
    height: 58px;
    padding: 0.5rem 1rem;
    box-sizing: border-box;
    background-color: var(--background-3-color);
    border-bottom: 1px solid var(--border-5-color);
    font-family: var(--geist-font-stack);
    z-index: 100;
    
    .title {
        display: flex;
        align-items: center;
        gap: 1rem;
        height: 100%;
        padding: 0.25rem 0rem;
        box-sizing: border-box;

        .logo-wrapper {
            box-sizing: border-box;
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
            border: 2px solid var(--border-5-color);
            background-color: var(--background-color);

            img {
                height: 125%;
                width: auto;
                aspect-ratio: 1/1;
                position: relative;
            }
        }
        
        .title-text {
            font-weight: 900;
            font-size: 1.3rem;
            letter-spacing: 0.8px;
        }
    }

    .content-main, .authed {
        display: flex;
        height: 100%;
        align-items: center;
        height: 100%;
        width: 100%;
    }

    .content-main {
        flex: 1;
        justify-content: space-between;
        gap: 1rem;

        .authed {
            gap: 1rem;
            width: 100%;
        }

        .nav-role-chip {
            :deep() {
                .chip-main {
                    border-color: var(--border-color);
                }
            }
        }
    }

    .controls {
        height: 100%;
        display: flex;
        align-items: center;
        gap: 1rem;
    }
}

.privileged-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
    // position: absolute;
    right: 1rem;
    top: 0.5rem;
    bottom: 1rem;
    z-index: 1000;

    .grid-group {
        .grid-group-header {
            p {
                font-size: 0.8rem;
                font-weight: 500;
                color: var(--text-6-color);
                margin-bottom: 0.5rem;
            }
        }
        .grid-group-content {
            display: flex;
            flex-direction: row;
            gap: 0.5rem;

            :deep() {
                .active {
                    background-color: var(--primary-background-5-color);
                    border-color: var(--primary-border-color);
                    color: var(--primary-color);
                }
            }
        }

        &.mock-roles {
            .grid-group-content {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: flex-end;
                align-items: flex-end;

                width: 414px;

                gap: 0.5rem;
                
            }
        }

        &.navigator {
            .navigator-input {
                width: 160px;
            }
        }

        &:not(:last-child) {
            margin-bottom: 1rem;
        }

    }

    .admin {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        position: absolute;
        right: 0.2rem;
        top: 4rem;
        background-color: var(--background-3-color);
        padding: 0.8rem;
        border-radius: 0.5rem;
        box-shadow: var(--shadow-2);
    }
}

.loading-skeleton {
    width: 60px;
    height: 1.5rem;
    border-radius: 0.25rem;
}
</style>