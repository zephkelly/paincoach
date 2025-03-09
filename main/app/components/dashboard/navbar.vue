<template>
    <header>
        <div class="title">
            <div class="logo-wrapper">
                <img src="~/assets/images/logo-square.webp" alt="Logo" @click="toggleOpen" />
            </div>
            <div class="title-text">PAINCOACH</div>
        </div>
        <div class="content-main">
            <Authenticator>
                <template #default="{ userRole }">
                    <DashboardAccountRoleChip :userRole="userRole.value" />
                </template>
                <template #adminActual>
                    <div class="admin">
                        <input type="text" v-model="userIDRef">
                        <EButton @click="submitUserId">Maillist</EButton>
                        <EButton @click="setMockRole('clinician')">View clinician</EButton>
                        <EButton @click="setMockRole('patient')">View patient</EButton>
                        <EButton @click="toggleMockLoading()">Toggle Load</EButton>
                        <EButton @click="clearMocks()">Clear Mocks</EButton>
                        <EButton @click="logout()">Clear Session</EButton>
                    </div>
                </template>
            </Authenticator>
        </div>
    </header>
    <DashboardAccountOptionsModal />
</template>

<script lang="ts" setup>
import { EButton } from '#components';

const userIDRef = ref('');
async function submitUserId() {
    const userData = await $fetch(`/api/v1/email/test`, {
        method: 'POST',
        body: {
            email: userIDRef.value
        }
    });
    console.log(userData);
}

const {
    accountProfileModalOpen,
    lastClickEvent
} = useAccountProfile();

const {
    toggleOpen
} = useAppSidebar();

const {
    setMockRole,
    clearMocks,
    toggleMockLoading,
    clearSession
} = useAuth();

async function logout() {
    await clearSession();
    navigateTo('/');
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
    border-bottom: 1px solid var(--border-color);
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
            border: 2px solid var(--border-color);
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
    }
}

.loading-skeleton {
    width: 60px;
    height: 1.5rem;
    border-radius: 0.25rem;
}
</style>