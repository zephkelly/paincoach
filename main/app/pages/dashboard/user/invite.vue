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
                            <h1>Complete your registration</h1>
                            <p class="welcome">Welcome to Pain Coach{{ (usersFirstName) ? `, ${usersFirstName}` : undefined }}</p>
                        </div>
                        <div class="incomplete-content" v-if="loadedInvitation">
                            <form class="invitation-form flex-col">
                                <div class="user-profile flex-col">
                                    <div class="profile-wrapper">
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            class="profile-input"
                                            ref="userProfileImageInput"
                                        />
                                        <DashboardUserProfileImage
                                            class="user-profile-image"
                                            :id="registrationState.id"
                                            :firstName="registrationState.first_name"
                                            :profileUrl="profileImageUrl"
                                            :loading="false"
                                            @load="handleProfileImageChange"
                                            @click.prevent="triggerOpenImageInput"
                                        />
                                        <DashboardAccountRoleChip
                                            :userRole="desiredUserRole"
                                            paneled
                                            class="user-type"
                                        />
                                    </div>
                                </div>
                                <component
                                    v-for="field in BASE_USER_INVITE_REGISTER_FIELDS"
                                    :key="field.identifier"
                                    :is="getComponent(field.inputType)"
                                    :id="field.identifier"
                                    :label="field.label"
                                    :type="field.inputType"
                                    :readonly="field.readonly"
                                    :required="field.required"
                                    :tabindex="field.tabindex"
                                    :modelValue="getFieldValue(field.identifier)"
                                    @input="setFieldValue(field.identifier, $event.target.value)"
                                />

                                <EInput v-if="canRegisterAdditionalProfiles.includes('clinician') && desiredUserRole === 'admin'"
                                    id="wants-clinician-profile"
                                    type="checkbox"
                                    label="Would you like to also register as a clinician?"
                                    :modelValue="wantsAdditionalClinicianProfile"
                                    :required="false"
                                    @input="setWantsAdditionalClinicianProfile($event.target.value)" />

                                <div class="clinician-fields" v-if="(canRegisterAdditionalProfiles.includes('clinician') && wantsAdditionalClinicianProfile) || desiredUserRole === 'clinician'">
                                    <h2>Additional Clinician Profile</h2>
                                    <component
                                        v-for="field in CLINICIAN_USER_INVITE_REGISTER_FIELDS"
                                        :key="field.identifier"
                                        :is="getComponent(field.inputType)"
                                        :id="field.identifier"
                                        :label="field.label"
                                        :type="field.inputType"
                                        :readonly="field.readonly"
                                        :required="field.required"
                                        :tabindex="field.tabindex"
                                        :modelValue="getFieldValue(field.identifier)"
                                        @input="setFieldValue(field.identifier, $event.target.value)"
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </template>
        </Authenticator>
    </Page>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getComponent } from "~~lib/layers/ember/utils/input";

const {
    fetchNewSession,
} = useAuth();

const {
    registrationState,

    canRegisterAdditionalProfiles,

    desiredUserRole,
    setInviteData,
    BASE_USER_INVITE_REGISTER_FIELDS,
    CLINICIAN_USER_INVITE_REGISTER_FIELDS,

    getFieldValue,
    setFieldValue
} = useRegister();

const {
    loaded: loadedInvitation,
    state: invitationState,
    invitation: invitationData,
    fetch: fetchInvitation
} = useInvite();

const wantsAdditionalClinicianProfile = ref(false);
function setWantsAdditionalClinicianProfile(value: boolean) {
    wantsAdditionalClinicianProfile.value = value;
}

// Add a ref for the profile image
const profileImageUrl = ref<string | null>(null);
const profileImageFile = ref<File | null>(null);

// Handle profile image change
const handleProfileImageChange = (file: File) => {
    profileImageFile.value = file;
    
    // You can also add the file to your form data here
    // For example, if you have a formData ref:
    // formData.value.profileImage = file;
    
    // Or you could store it in some other way to be submitted with the form
    // For example, you might want to add it to your register data
    // setFieldValue('profileImage', file);
};

onMounted(async () => {
    await fetchInvitation();
    console.log('tried fetch invite data', invitationData.value);
    if (invitationData.value) {
        setInviteData(invitationData.value);
    }
})

const usersFirstName = computed(() => {
    if (invitationData.value?.registration_data?.first_name) {
        return invitationData.value?.registration_data?.first_name;
    }
    else {
        return undefined;
    }
})

const isPartiallyCompleted = computed(() => {
    if (invitationData.value?.registration_type) {
        return true;
    }
    else {
        return false;
    }
});

const isFullyCompleted = computed(() => {
    if (invitationData.value?.registration_data) {
        return true;
    }
    else {
        return false;
    }
});

const isNotCompleted = computed(() => {
    if (!isPartiallyCompleted.value && !isFullyCompleted.value) {
        return true;
    }
    else {
        return false;
    }
});

const userProfileImageInput = ref<HTMLInputElement | null>(null);
function triggerOpenImageInput() {
    userProfileImageInput.value?.click();
}

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
    box-sizing: border-box;
    max-width: 800px;
    height: 32px;
    align-items: center;
    align-content: flex-start;
    font-size: 0.9rem;
    font-style: italic;
    font-family: var(--serif-font-stack);
    color: var(--text-5-color);
    gap: 0.25rem;

    // .welcome {
    //     margin-right: 0.5rem;
    // }

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
    max-width: 800px;
    background-color: var(--background-3-color);
    border: 1px solid var(--border-4-color);
    border-radius: 0.5rem;
    padding: 2rem 1.25rem;
    padding-top: 2rem;
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
        opacity: 0.6;
        
    }

    h1 {
        font-size: 2.2rem;
        font-weight: 500;
        text-align: center;
        font-family: var(--notoserif-font-stack);
        line-height: 3.5rem;
    }

}

.incomplete-content {
    .user-profile {
        align-items: center;
        margin-bottom: 0.5rem;

        .profile-wrapper {
            position: relative;
            width: 25%;
            min-width: 150px;
            height: auto;

            input {
                height: 0;
                opacity: 0;
            }

            .user-type {
                position: absolute;
                bottom: 0;
                right: 50%;
                transform: translate(50%, 50%);
                box-shadow: 0 0 8px 0px rgba(0, 0, 0, 0.1);
            }
        }

        .user-profile-image {
            cursor: pointer;
            transition: opacity 0.3s ease;

            &:hover {
                opacity: 0.6;
            }

            :deep() {
                p {
                    font-size: clamp(2rem, 5vw, 3rem);
                }
            }
        }
    }

    .user-type {
        font-size: 0.8rem;
        color: var(--text-4-color);
        gap: 0.5rem;
        align-items: center;
    }

    .registration-type-message {
        font-size: 0.8rem;
        font-family: var(--serif-font-stack);
        // font-style: italic;
        color: var(--text-7-color);
        margin-top: 1rem;
    }

    form {
        gap: 0.5rem;
    }
}
</style>