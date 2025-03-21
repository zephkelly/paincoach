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
                <!-- <div class="incomplete-registration-container">
                    <div class="incomplete-registration-wrapper">
                        <PagedModal
                            v-if="isModalOpen"
                            :pages="pages"
                            :component-props="componentProps"
                            v-bind="modalProps"
                            v-on="modalEvents"
                            height="400"
                        />
                    </div>
                </div> -->
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
                        <div class="incomplete-content" v-if="loadedInvitation">
                            <form class="invitation-form flex-col" @submit.prevent="submitRegistration">
                                <div class="main-fields form-style">
                                    <div class="form-header">
                                        <h1>Complete your registration</h1>
                                        <p class="welcome">Welcome to Pain Coach{{ (usersFirstName) ? `, ${usersFirstName}` : undefined }}</p>
                                    </div>
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
                                        class="input-field"
                                        :class="{ 'field-required': field.required }"
                                        :key="field.identifier"
                                        :is="getComponent(field.inputType)"
                                        :id="field.identifier"
                                        :label="field.label"
                                        :type="field.inputType"
                                        :readonly="field.readonly"
                                        :required="field.required"
                                        :tabindex="field.tabindex"
                                        :default="field.default"
                                        :modelValue="getFieldValue(field.identifier)"
                                        @input="setFieldValue(field.identifier, (field.inputType === 'checkbox') ? $event.target.checked : $event.target.value)"
                                    />
    
                                    <EInput v-if="desiredUserRole !== 'clinician'"
                                        id="share-anonymous-data"
                                        type="checkbox"
                                        label="Would you like to share anonymous data with Pain Coach to improve our services?"
                                        :modelValue="getFieldValue('data_sharing_enabled') as boolean"
                                        :required="false"
                                        @input="setFieldValue('data_sharing_enabled', $event.target.checked)" />
                                    

                                    <div class="medications-container flex-col" :class="{ 'active': willUseApplication, 'medications': takesMedication }">

                                        <EInput v-if="desiredUserRole !== 'clinician'"
                                            id="wants-personal-access"
                                            type="checkbox"
                                            label="Would you like access to the Pain Coach app for personal use?"
                                            :modelValue="state.user.will_use_app"
                                            :required="false"
                                            @input="state.user.will_use_app = $event.target.checked" />

                                        <EInput v-if="desiredUserRole !== 'clinician'" class="takes-medication-input" :class="{ 'active': willUseApplication }"
                                            id="takes-medication"
                                            type="checkbox"
                                            label="Have you used any medications for pain recently?"
                                            :modelValue="takesMedication"
                                            :required="false"
                                            @input="takesMedication = $event.target.checked" />

                                        <div class="medication-fields flex-col" :class="{ 'active': willUseApplication && takesMedication }">
                                            <div class="medications-header">
                                                <div class="fields-header flex-row">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m10.5 20.5l10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7m-2-12l7 7"/></svg>
                                                    <h2>Pain Medication{{ medicationState && medicationState.length > 1 ? 's' : '' }}</h2>
                                                </div>
                                                <p>Enter your recent medication history</p>
                                            </div>
                                            
                                            <ul>
                                                <li class="medication-fields-wrapper" v-for="(medication, index) in medicationState" :key="index">
                                                    <h3><span>{{ (index + 1) + '.' }}</span> {{ getMedicationFieldValues('medication_name', index) ? getMedicationFieldValues('medication_name', index) : 'Medication' }}</h3>
                                                    <component
                                                        v-for="field in MEDICATION_FIELDS"
                                                        
                                                        class="input-field"
                                                        :class="[{ 'field-required': field.required, 'disabled-end-date': field.identifier === 'end_date' && getMedicationFieldValues('is_on_going', index) === true }, field.identifier]"
                                                        :key="field.identifier"
                                                        :is="getComponent(field.inputType)"
                                                        :id="field.identifier"
                                                        :label="field.label"
                                                        :type="field.inputType"
                                                        :readonly="field.readonly"
                                                        :required="(takesMedication) ? field.required : false"
                                                        :tabindex="(takesMedication) ? field.tabindex : -1"
                                                        :default="field.default"
                                                        :placeholder="field.placeholder"
                                                        :modelValue="getMedicationFieldValues(field.identifier, index)"
                                                        @input="setMedicationFieldValues(field.identifier, index, $event.target.value)"
                                                        />
                                                </li>
                                            </ul>

                                            <EButton class="add-medication-button flex-row" type="button" @click="addMedication">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7-7v14"/></svg>
                                                Add Medication
                                            </EButton>
                                        </div>
                                    </div>  

                                    <EInput v-if="canRegisterAdditionalProfiles.includes('clinician') && desiredUserRole === 'admin'"
                                        id="wants-clinician-profile"
                                        type="checkbox"
                                        label="Would you like to register a clinician profile?"
                                        :modelValue="wantsAdditionalClinicianProfile"
                                        :required="false"
                                        @input="setWantsAdditionalClinicianProfile($event.target.checked)" />
                                        
                                    <EButton 
                                        class="submit-button primary"
                                        :disabled="wantsAdditionalClinicianProfile || !canSubmit"
                                        :class="{ active: !wantsAdditionalClinicianProfile }"
                                        type="submit"
                                    >
                                        Submit
                                    </EButton>
                                                                    
                                </div>

                                <Transition name="fade-height">
                                    <div class="additional-clinician-profile-fields form-style" v-if="canRegisterAdditionalProfiles.includes('clinician') && wantsAdditionalClinicianProfile">
                                        <div class="additional-clinician-profile-wrapper">
                                            <div class="fields-header flex-row">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor"><path d="M20 22v-3c0-2.828 0-4.243-.879-5.121C18.243 13 16.828 13 14 13l-2 2l-2-2c-2.828 0-4.243 0-5.121.879C4 14.757 4 16.172 4 19v3m12-9v5.5"/><path d="M8.5 13v4m0 0a2 2 0 0 1 2 2v1m-2-3a2 2 0 0 0-2 2v1m9-13.5v-1a3.5 3.5 0 1 0-7 0v1a3.5 3.5 0 1 0 7 0m1.25 12.75a.75.75 0 1 1-1.5 0a.75.75 0 0 1 1.5 0"/></g></svg>
                                                <h2>Additional Clinician Profile</h2>
                                            </div>
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
                                                :default="field.default"
                                                :modelValue="getAdditionalClinicianProfileFieldValue(field.identifier as any)"
                                                @input="setAdditionalClinicianProfileFieldValue(field.identifier as any, $event.target.value)"
                                            />

                                            <EButton class="submit-button secondary" :class="{ active: state.wants_additional_profiles }" :disabled="!wantsAdditionalClinicianProfile || !canSubmit" type="submit">Submit</EButton>
                                        </div>
                                    </div>
                                </Transition>
                            </form>
                        </div>
                    </div>
                </div>
            </template>
        </Authenticator>
    </Page>
</template>

<script lang="ts" setup>
import DashboardUserInviteIncompleteAStep from "~/components/dashboard/user/invite/incomplete/aStep.vue";
import DashboardUserInviteIncompleteBStep from "~/components/dashboard/user/invite/incomplete/bStep.vue";
import { getComponent } from "~~lib/layers/ember/utils/input";

// Paged modal 
const {
  isModalOpen,
  currentPage,
  openModal,
  modalProps,
  modalEvents
} = usePagedModal();

isModalOpen.value = true;


const pages: Component[] = [
    DashboardUserInviteIncompleteAStep,
    DashboardUserInviteIncompleteBStep
];

// Optional props to pass to each component
const componentProps: Record<number, Record<string, any>>[] = [
  { /* props for first page */ },
  { /* props for second page */ },
];
// ----------------------------


const {
    fetchNewSession,
} = useAuth();

const {
    state,
    registrationState,
    medicationState,

    willUseApplication,
    desiredUserRole,
    canRegisterAdditionalProfiles,

    canSubmit,
    submitRegistration,
    
    CLINICIAN_USER_INVITE_REGISTER_FIELDS,
    wantsAdditionalClinicianProfile,
    getAdditionalClinicianProfileFieldValue,
    setAdditionalClinicianProfileFieldValue,
    
    setInviteData,
    
    BASE_USER_INVITE_REGISTER_FIELDS,
    getFieldValue,
    setFieldValue,

    MEDICATION_FIELDS,
    takesMedication,
    addMedication,
    getMedicationFieldValues,
    setMedicationFieldValues
} = useRegister();

const {
    loaded: loadedInvitation,
    state: invitationState,
    invitation: invitationData,
    fetch: fetchInvitation
} = useInvite();


function setWantsAdditionalClinicianProfile(value: boolean) {
    if (value) {
        state.value.wants_additional_profiles = ['clinician'];
    }
    else {
        state.value.wants_additional_profiles = [];
    }
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

const medicationsMaxHeightStyle = computed(() => {
    if (state.value.user.medications && state.value.user.medications.length > 0) {
        return {
            maxHeight: `${state.value.user.medications.length * 400}px`
        }
    }
    else {
        return {
            maxHeight: '0px'
        }
    }
}); 

const userProfileImageInput = ref<HTMLInputElement | null>(null);
function triggerOpenImageInput() {
    alert('Uploading profile images is currently not supported');
    // userProfileImageInput.value?.click();
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
    // height: 100%;
    width: 100%;
    
    .incomplete-registration-wrapper {
        width: 100%;
        box-sizing: border-box;
        max-width: 800px;
        // padding: 2rem 1.25rem;
        // padding-top: 0.25rem;
        background-color: var(--background-3-color);
        border: 1px solid var(--border-4-color);
        border-radius: 0.5rem;
        box-shadow: 0 0 8px 4px rgba(0, 0, 0, 0.1);

        :deep() {
            .page-indicators {
                padding: 0.3rem 0.4rem;
            }
        }
    }
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


    form.invitation-form {
        // gap: 0.5rem;
        margin-bottom: 4rem;

        .submit-button {
            height: 0px;
            overflow: hidden;
            transition:
                height 0.35s cubic-bezier(0.075, 0.82, 0.165, 1),
                opacity 0.35s cubic-bezier(0.075, 0.82, 0.165, 1),
                margin-top 0.35s cubic-bezier(0.075, 0.82, 0.165, 1),
                background-color 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);
            background-color: var(--text-color);
            padding: 0rem;
            opacity: 0;
            margin-top: 0rem;
            cursor: pointer;
            color: var(--text-invert-3-color);
            pointer-events: none;

            &.active {
                height: 32px;
                opacity: 1;
                margin-top: 1.25rem;
                pointer-events: all;
            }

            &:hover {
                background-color: var(--text-4-color);
            }

            &:active {
                background-color: var(--text-2-color);
            }

            &:disabled {
                background-color: var(--text-7-color);
                cursor: not-allowed;
            }
        }

        .form-style {
            background-color: var(--background-3-color);
            border: 1px solid var(--border-4-color);
            border-radius: 0.5rem;
            box-shadow: 0 0 8px 4px rgba(0, 0, 0, 0.1);

            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .main-fields {
            padding: 2rem 1.25rem;
            z-index: 2;
            padding-bottom: 1.25rem;
        }

        .additional-clinician-profile-fields {
            position: relative;
            top: -2rem;
            padding-left: 1.25rem;
            padding-right: 1.25rem;
            z-index: 1;
            box-sizing: border-box;
            height: auto; /* Changed from fixed height */

            .additional-clinician-profile-wrapper {
                width: calc(100% - 2.5rem);
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                padding-top: 4.5rem;
                padding-bottom: 2rem;
            }
        }

        .medications-container {
            margin-top: 0rem;
            margin-bottom: 0rem;
            transition: margin-top 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);
            
            &.active {
                margin-top: 1rem;
                margin-bottom: 1rem;

                &.medications {
                    margin-top: 2rem;
                    margin-bottom: 2rem;
                }
            }
            
            .medications-header {
                margin-top: 2rem;
                
                .fields-header {
                    margin-bottom: 0.25rem;
                }

                p {
                    font-size: 0.8rem;
                    color: var(--text-7-color);
                }
            }

            .medication-fields {
                gap: 0.5rem;
                max-height: 0px;
                transition: max-height 0.35s cubic-bezier(0.075, 0.82, 0.165, 1), opacity 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);
                overflow: hidden;
                opacity: 0;
    
                &.active {
                    max-height: v-bind(medicationsMaxHeightStyle);
                    opacity: 1;
                }

                ul, li {
                    display: flex;
                    flex-direction: column;
                    // gap: 0.5rem;
                }

                ul {
                    li  {
                        border-left: 1px solid var(--border-4-color);
                        padding: 0rem 1.25rem;
                        margin: 0.5rem 0rem;

                        &:first-of-type {
                            margin-top: 1rem;
                        }

                        &:not(:first-of-type) {
                            margin-top: 1.5rem;
                        }

                        h3 {
                            margin-bottom: 0.8rem;

                            span {
                                font-weight: 700;
                                color: var(--text-7-color);
                                margin-right: 0.2rem;
                            }
                        }

                        .input-wrapper {
                            margin-bottom: 0.5rem;

                            &:last-child {
                                margin-bottom: 0rem;
                            }
                        }

                        .start_date {
                            transition: margin-bottom 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);
                        }

                        .end_date {
                            opacity: 1;
                            max-height: 55px;
                            transition: max-height 0.35s cubic-bezier(0.075, 0.82, 0.165, 1), opacity 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);
                            overflow: hidden;
                        }

                        .disabled-end-date {
                            opacity: 0;
                            max-height: 0;
                        }

                        &:has(.disabled-end-date) {
                            .start_date {
                                margin-bottom: 0rem;
                            }
                        }
                    }
                }

                .add-medication-button {
                    gap: 0.35rem;
                    align-items: center;
                    justify-content: center;
                    width: 150px;

                    background-color: transparent;
                    border: 1px solid var(--text-color);
                    color: var(--text-color);

                    svg {
                        aspect-ratio: 1;
                        height: 14px;
                        width: auto;
                    }
                }
            }

            .takes-medication-input {
                max-height: 0rem;
                transition: max-height 0.35s cubic-bezier(0.075, 0.82, 0.165, 1), opacity 0.35s cubic-bezier(0.075, 0.82, 0.165, 1), margin-top 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);
                overflow: hidden;
                margin-top: 0rem;
                opacity: 0;

                &.active {
                    max-height: 32px;
                    margin-top: 0.5rem;
                    opacity: 1;
                }
            }
        }

        .fields-header {
            gap: 0.5rem;
            height: 24px;
            align-items: center;
            font-size: 1.2rem;
            margin-bottom: 0.8rem;

            svg {
                aspect-ratio: 1;
                height: 18px;
                width: auto;
            }
        }

        :deep() {
            .input-wrapper {
                &.checkbox {
                    flex-direction: row;
                }
            }
        }

    }
}

.fade-height-active {
    height: 417px;
}
.fade-height-enter-active,
.fade-height-leave-active {
  transition: all 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
  max-height: 514px; /* Ensure this is large enough for your content */
  opacity: 1;
  overflow: hidden;
  border-width: 1px;
}

.fade-height-enter-from,
.fade-height-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  margin-top: 0;
  margin-bottom: 0;
  border-width: 0;
}
</style>