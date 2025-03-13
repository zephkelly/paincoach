<template>
    <Page>
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
                <div>
                    <h1>Incomplete</h1>
                    <p>Incomplete content</p>
                </div>
            </template>
        </Authenticator>
    </Page>
</template>

<script lang="ts" setup>
import Authenticator from '@/components/authenticator.vue';
import { type UserInvitation } from '@@/shared/types/users/invitation';

const {
    fetchNewSession,
    session,
} = useAuth();

const { data: invitationData, status } = await useFetch<UserInvitation>('/api/v1/auth/invite');

watch(status, (newStatus) => {
    if (newStatus === 'success') {
        console.log(invitationData.value);
    }
    else if (newStatus === 'error') {
        console.error('Error fetching invitation data');
    }
});

onMounted(async () => {
    if (import.meta.server) return;
    await fetchNewSession();
});

definePageMeta({
    layout: 'app',
    middleware: ['auth-incomplete-session']
});
</script>