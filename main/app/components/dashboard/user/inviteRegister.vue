<template>
    <section class="invite-register-form-container flex-col">
        <div class="invite-information flex-row">
            <DashboardUserProfileImage
                class="inviter-profile-image"
                :id="invitationData?.inviter_name"
                :firstName="invitationData?.inviter_name"
                :profileUrl="invitationData?.inviter_profile_url"
                :loading="false"
            />
            <p class="inviter-name"><span>{{ invitationData?.inviter_name }}</span></p>
            <p class="invite-text">has invited you to...</p>
        </div>
        <form class="register-form flex-col">
            <div class="form-section base">
                <div class="header">
                    <h1>Complete your registration</h1>
                    <p class="welcome">Welcome to Pain Coach{{ (state?.first_name) ? `, ${state?.first_name}` : undefined }}</p>
                </div>
            </div>
        </form>
    </section>
</template>

<script lang="ts" setup>
const {
    loaded: loadedInvitation,
    state: invitationState,
    invitation: invitationData,
    fetch: fetchInvitation
} = useInvite();

const {
    state, 
    setInviteData
} = useRegister();

await fetchInvitation();
if (invitationData.value) {
    setInviteData(invitationData.value);
}
</script>