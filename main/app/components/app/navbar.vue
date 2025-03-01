<template>
    <header>
        <div class="title">
            <div class="logo-wrapper">
                <img src="~/assets/images/logo-square.webp" alt="Logo" @click="handleProfileClick" />
            </div>
            <div class="title-text">PAINCOACH</div>
        </div>
        <div class="content-main">
            <AppAuthenticator>
                <template #loading>
                    <div class="unauthed">
                        <AppAccountRoleChip :userRole="undefined" />
                    </div>
                </template>

                <template #shared="{ userRole, user }">
                    <AppAccountRoleChip :userRole="userRole.value" />

                    <div class="admin" v-if="user.value && user.value.user_role === 'admin'">
                        <EButton @click="setMockRole('clinician')">View clinician</EButton>
                        <EButton @click="setMockRole('patient')">View patient</EButton>
                        <EButton @click="clearMockRole()">Clear View</EButton>

                    </div>
                </template>
            </AppAuthenticator>
        </div>
    </header>
    <AppAccountOptionsModal />
</template>

<script lang="ts" setup>
import { AppAccountRoleChip } from '#components';

const {
    accountProfileModalOpen,
    lastClickEvent
} = useAccountProfile();

const {
    setMockRole,
    clearMockRole
} = useAuth();

const handleProfileClick = (event: MouseEvent) => {
    lastClickEvent.value = event;
    accountProfileModalOpen.value = true;
};
</script>

<style lang="scss" scoped>
header {
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: 1rem;
    height: 58px;
    padding: 0.5rem 1rem;
    box-sizing: border-box;
    background-color: var(--background-2-color);
    border-bottom: 1px solid var(--border-color);
    font-family: var(--geist-font-stack);
    
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

    .content-main, .authed, .admin {
        display: flex;
        height: 100%;
        align-items: center;
        height: 100%;
        width: 100%;
    }

    .content-main {
        flex: 1;
        justify-content: flex-start;
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