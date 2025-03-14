<template>
    <Page padBody>
        <Authenticator>
            <template #loading>
                <div>
                    <h1>Loading</h1>
                    <p>Loading content</p>
                </div>
            </template>

            <template #admin>
                <div>
                    <h1>Admin</h1>
                    <p>Admin content</p>

                </div>
            </template>

            <template #incomplete>
                <div class="incomplete-registration-container">
                    <div class="invitation-information flex-row">
                        <DashboardUserProfileImage
                        class="inviter-profile-image"
                        :id="invitationData?.inviter_role_name"
                        :firstName="invitationData?.inviter_name"
                        :profileUrl="invitationData?.inviter_profile_url"
                        :loading="false"
                        />
                        <p class="inviter-name"><span>{{ invitationData?.inviter_name }}</span></p>
                        <p class="invitation-text">has invited you to...</p>
                    </div>
                    <div class="inner-wrapper">
                        <div class="form-header">
                            <p>Welcome to Pain Coach</p>
                            <h1>Complete your registration</h1>
                        </div>


                        <div class="incomplete-content" v-if="status === 'success'">
                        
                            <div class="inviter-details flex-row">
                                <!-- <DashboardAccountRoleChip :userRole="invitationData?.role_name" /> -->

                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </Authenticator>
    </Page>
</template>

<script lang="ts" setup>
import Authenticator from '@/components/authenticator.vue';
import { type UserInvitation } from '@@/shared/types/users/invitation/index';

const {
    fetchNewSession,
} = useAuth();

const { data: invitationData, status } = await useFetch<UserInvitation>('/api/v1/auth/invite');

watch(status, (newStatus) => {
    if (newStatus === 'success') {
        console.log(invitationData.value);
    }
    else if (newStatus === 'error') {
        console.error('Error fetching invitation data');
    }
}, { immediate: true });

onMounted(async () => {
    if (import.meta.server) return;
    await fetchNewSession();
});

definePageMeta({
    layout: 'app',
    middleware: ['auth-incomplete-session']
});
</script>

<style lang="scss" scoped>
.incomplete-registration-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
}

.invitation-information {
    width: 100%;
    height: 32px;
    align-items: center;
    align-content: flex-start;
    font-size: 0.9rem;
    font-style: italic;
    font-family: var(--serif-font-stack);
    color: var(--text-5-color);
    gap: 0.25rem;

    .invitation-text {
        opacity: 0.6;
    }

    .inviter-profile-image {
        height: 20px;
        font-size: 0.8rem;
        margin-left: 0.25rem;
        opacity: 0.6;


        :deep() {
            .profile-placeholder {
                p {
                    font-size: 0.7rem;
                    position: relative;
                    font-style: normal;
                    font-family: var(--geist-font-stack);
                }
            }
        }
    }

    .inviter-name {
        font-style: normal;
        font-family: var(--geist-font-stack);
        color: var(--text-4-color);
    }
}

.inner-wrapper {
    width: 100%;
    box-sizing: border-box;
    max-width: 1200px;
    background-color: var(--background-3-color);
    border: 1px solid var(--border-4-color);
    border-radius: 0.5rem;
    padding: 2rem 1rem;
}

.form-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2.5rem;

    p {
        font-family: var(--serif-font-stack);
        font-style: italic;
        color: var(--text-5-color);
        opacity: 0.8;
    }

    h1 {
        font-size: 2.2rem;
        font-weight: 500;
        text-align: center;
        font-family: var(--notoserif-font-stack);
    }

}

.incomplete-content {
    
}
</style>