<template>
    <section class="invite-register-form-container flex-col">
        <form class="invite-register-form flex-col">
            <div class="inviter-information flex-row">
                <DashboardUserProfileImage
                    class="inviter-profile-image"
                    :id="inviterFirstName"
                    :firstName="inviterFirstName"
                    :profileUrl="inviterProfileImageUrl"
                    :loading="false"
                />
                <p class="inviter-name"><span>{{ inviterFirstName }}</span></p>
                <p class="invite-text">has invited you to...</p>
            </div>
            <div class="form-section base">
                <div class="form-inner">
                    <div class="form-header">
                        <h1>Complete your registration</h1>
                        <p class="welcome">Welcome to Pain Coach{{ (userFirstName) ? `, ${userFirstName}` : undefined }}</p>
                    </div>
                    <div class="form-content">
                        <div class="profile-wrapper">
                            <DashboardUserProfileImage
                                class="user-profile-image"
                                :id="userFirstName"
                                :firstName="userFirstName"
                                :profileUrl="undefined"
                                :loading="false"
                            />
                            <div class="role-chip-container flex-row">
                                <DashboardAccountRoleChip
                                    v-for="role in inviteeRoles"
                                    :userRole="role"
                                    paneled
                                    :collapsable="(inviteeRoles.length > 1) && (role !== inviteePrimaryRole)"
                                    class="user-role"
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
                            v-model="state[field.identifier]"
                        />
                        <EInput v-if="!inviteeRoles.includes('patient')"
                            class="will-use-app-input"
                            id="will_use_app"
                            type="checkbox"
                            label="Would you like access to the Pain Coach app for personal use?"
                            v-model="state['will_use_app']"
                            :required="false"
                        />
                        <EInput v-if="!inviteeRoles.includes('patient')"
                            class="requires-medication-input"
                            :class="{ collapsed: !state['will_use_app']}"
                            id="requires_medication"
                            type="checkbox"
                            label="Have you recently used any medications to manage your pain?"
                            v-model="userRequiresMedication"
                            :required="false"
                        />
                        <div v-if="inviteeRoles.includes('patient')"
                            id="patient-medications-section"
                            class="patient-medications-section"
                        />
                    </div>
                </div>
            </div>

            <div class="form-section clinician-profile">
                <div class="form-inner">
                    <div class="form-header">
                        <h2>Additional Clinician Profile</h2>
                        <p>Enter your clinician's information</p>
                    </div>
                    <div class="form-content">
                        <component
                            v-for="field in CLINICIAN_USER_INVITE_REGISTER_FIELDS"
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
                            v-model="state[field.identifier]"
                        />
                    </div>
                </div>
                
            </div>

            <div v-if="!inviteeRoles.includes('patient')" 
                class="form-section medications"
                :class="{ collapsed: !(state['will_use_app'] && userRequiresMedication) }">

                <div class="form-section-disclaimer flex-row">
                    <p>Because you opted into using the app:</p>

                    <div class="encryption" title="All medication data is encrypted, ensuring your privacy">
                        Double encrypted
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 16 16"><!-- Icon from All by undefined - undefined --><path fill="currentColor" fill-rule="evenodd" d="M8 1a3.5 3.5 0 0 0-3.5 3.5V7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7V4.5A3.5 3.5 0 0 0 8 1m2 6V4.5a2 2 0 1 0-4 0V7z" clip-rule="evenodd"/></svg>
                    </div>
                </div>
                <div class="form-inner" id="additional-medications-section" />
            </div>
        </form>


        <Teleport v-if="loadedInvitation && medicationsTeleportTarget" :to="medicationsTeleportTarget">
            <div class="medications-teleporter">
                <div class="form-header flex-row">
                    <!-- <p class="disclaimer">Because you opted into using the app:</p> -->
                    <div class="title-wrapper flex-col">
                        <div class="title flex-row">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from All by undefined - undefined --><path fill="currentColor" d="M20.207 3.793a5.95 5.95 0 0 1 0 8.414l-8 8a5.95 5.95 0 0 1-8.414-8.414l8-8a5.95 5.95 0 0 1 8.414 0m-7 1.414L8.913 9.5l5.586 5.586l4.294-4.292a3.95 3.95 0 1 0-5.586-5.586"/></svg>
                            <h2>Pain Medications</h2>
                        </div>
                        <p>Enter your recent medication history</p>
                    </div>
                </div>

                <ol class="medications-list flex-col" :class="{ collapsed: !state.medications || !state.medications.length }">
                    <li class="medication-fields-wrapper flex-col" v-for="(medication, index) in state.medications" :key="index">
                        <h3><span>{{ (index + 1) + '.' }}</span> {{ medication.medication_name ? medication.medication_name : 'Medication' }}</h3>
                        <EButton class="remove-medication-button" type="button" @click="removeMedication(index)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 6l12 12M6 18L18 6"/></svg>
                            Remove
                        </EButton>
                        <!-- @vue-expect-error -->
                        <component v-for="field in MEDICATION_FIELDS.base" :modelValue="state.medications[index][field.identifier]" @update:modelValue="state.medications[index][field.identifier] = $event" @blur="validateMedicationField(index, state.medications[index][field.identifier], field.identifier)"
                            class="input-field"
                            :class="[{ 'field-required': field.required }, field.identifier]"
                            :key="field.identifier"
                            :is="getComponent(field.inputType)"
                            :id="field.identifier"
                            :label="field.label"
                            :type="field.inputType"
                            :readonly="field.readonly"
                            :unit="(field.identifier === 'frequency') ? 'hours' : undefined"
                            :required="(userRequiresMedication) ? field.required : false"
                            :tabindex="(userRequiresMedication) ? field.tabindex : -1"
                            :default="field.default"
                            :placeholder="field.placeholder"
                        />

                        <!-- @vue-expect-error -->
                        <EInput :modelValue="state.medications[index]['start_date']" @update:modelValue="state.medications[index]['start_date'] = $event" @blur="validateMedicationField(index, state.medications[index]['start_date'], 'start_date')"
                            id="start_date"
                            class="input-field field-required start_date"
                            label="Start Date"
                            type="date"
                            :required="true"
                        />

                        <!-- @vue-expect-error -->
                        <EInput :modelValue="state.medications[index]['end_date']" @update:modelValue="state.medications[index]['end_date'] = $event" @blur="validateMedicationField(index, state.medications[index]['end_date'], 'end_date')"
                            id="end_date"
                            class="input-field field-required end_date"
                            :class="{ collapsed: state.medications[index]['is_on_going'] }"
                            label="End Date"
                            type="date"
                            :required="(state.medications[index]['is_on_going']) ? false : true"
                        />

                        <!-- @vue-expect-error -->
                        <EInput :modelValue="state.medications[index]['is_on_going']" @update:modelValue="state.medications[index]['is_on_going'] = $event"
                            id="is_on_going"
                            class="input-field checkbox"
                            label="Ongoing"
                            type="checkbox"
                            :required="false"
                        />
                        
                    </li>
                </ol>

                <EButton
                    :class="{ 'no-medications': !state.medications || !state.medications.length }"
                    class="add-medication-button flex-row"
                    type="button"
                    @click="addMedication"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7-7v14"/></svg>
                    Add Medication
                </EButton>
            </div>
        </Teleport>
    </section>
</template>

<script lang="ts" setup>
const {
    invitation,
    loaded: loadedInvitation,

    inviterFirstName,
    inviterProfileImageUrl,

    inviteeRoles,
    inviteePrimaryRole
} = await useInvite();

const {
    state,
    BASE_USER_INVITE_REGISTER_FIELDS,

    MEDICATION_FIELDS,
    medicationsErrors,
    userRequiresMedication,
    validateMedicationField,
    addMedication,
    removeMedication,

    CLINICIAN_USER_INVITE_REGISTER_FIELDS,

    userFirstName,
} = useInviteRegister(invitation);

watch(medicationsErrors, () => {
    console.log(medicationsErrors.value)
})

const medicationsTeleportTarget = computed(() => {
    if (inviteeRoles.value.includes('patient')) {
        return (state.value['will_use_app']) ? '#patient-medications-section' : null;
    }
    else {
        return (userRequiresMedication.value) ? '#additional-medications-section' : null;
    }
});

const medicationsFormHeight = 430;
const medicationsSectionMaxHeight = computed(() => {
    if (!state.value.medications || !state.value.medications.length) return 'calc(148px + 4rem)';
    return `calc(${state.value.medications.length * medicationsFormHeight + 40}px + 105px + 4rem)`;
})
</script>

<style lang="scss" scoped>
.invite-register-form-container {
    width: 100%;
    align-items: center;

    .invite-register-form {
        position: relative;
        isolation: isolate;
        width: 100%;
        max-width: 800px;
    }
}

.inviter-information {
    height: 32px;
    align-items: center;
    align-content: flex-start;
    font-size: 0.9rem;
    font-style: italic;
    font-family: var(--serif-font-stack);
    color: var(--text-5-color);
    gap: 0.25rem;

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

.invite-register-form {
    margin-bottom: 8rem;

    .form-section {
        position: relative;
        z-index: 10;
        opacity: 1;
        transition:
        max-height 0.35s cubic-bezier(0.075, 0.82, 0.165, 1),
            padding 0.35s cubic-bezier(0.075, 0.82, 0.165, 1),
            opacity 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);

        &.collapsed {
            max-height: 0px;
            padding: 0rem 1.25rem;
            opacity: 0;
            user-select: none;
            overflow: hidden;
        }

        .form-section-disclaimer {
            justify-content: space-between;
            font-size: 0.9rem;
            font-family: var(--serif-font-stack);
            letter-spacing: 0.2px;
            font-style: italic;
            color: var(--text-6-color);
            margin-left: 0.25rem;
            margin-bottom: 0.5rem;

            > div {
                position: relative;
                top: 3rem;
                right: 1rem;
                font-size: 0.9rem;
                font-family: var(--geist-font-stack);
                font-style: normal;
                color: rgb(255, 235, 165);
                gap: 0.15rem;
                display: flex;
                align-items: center;
                transition:
                    color 0.35s cubic-bezier(0.075, 0.82, 0.165, 1),
                    opacity 0.35s cubic-bezier(0.075, 0.82, 0.165, 1),
                    border-bottom-color 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);
                cursor: pointer;
                padding: 0rem 0.1rem;
                opacity: 0.6;

                svg {
                    height: 16px;
                    aspect-ratio: 1;
                    width: auto;
                    color: rgb(255, 235, 165);
                }

                &:hover {
                    color: rgb(255, 220, 95);
                    opacity: 1;

                    svg {
                        color: rgb(255, 220, 95);
                    }
                }

                @media (prefers-color-scheme: light) {
                    color: rgb(204, 179, 86);

                    svg {
                        color: rgb(218, 201, 140)
                    }

                    &:hover {
                        color: rgb(235, 193, 39);

                        svg {
                            color: rgb(235, 193, 39);
                        }
                    }
                }
            }
        }
            
        .form-inner { 
            padding: 2rem 1.25rem;
            background-color: var(--background-3-color);
            border: 1px solid var(--border-4-color);
            border-radius: 0.5rem;
            box-shadow: 0 4px 16px 0px rgba(0, 0, 0, 0.1);
        }
    
        .form-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
        }

        &:not(.base) {
            margin-top: -3.5rem;
            z-index: 1;

            .form-header {
                margin-top: 2.5rem;

                .disclaimer {
                    margin-bottom: 2.5rem;
                    font-size: 0.9rem;
                    font-family: var(--serif-font-stack);
                    font-style: italic;
                }

                .title {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    height: 20px;
                    font-size: 1.25rem;
                    margin-bottom: 0.8rem;

                    svg {
                        height: 100%;
                        aspect-ratio: 1;
                        width: auto;
                    }
                }

                p {
                    color: var(--text-6-color);
                }
            }
        }
    }
}

:deep() {
    .e-input {
        max-height: 55px;
        opacity: 1;
        transition:
            max-height 0.35s cubic-bezier(0.075, 0.82, 0.165, 1),
            opacity 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);

        &.checkbox {
            max-height: 22px;
        }

        &.collapsed {
            max-height: 0px;
            opacity: 0;
            user-select: none;
            overflow: hidden;
        }
    }
}


.form-section.base {
    padding-bottom: 1.25rem;

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

    .form-content {
        .profile-wrapper {
            position: relative;
            width: 25%;
            min-width: 150px;
            height: auto;
            margin-bottom: 2rem;

            input {
                height: 0;
                opacity: 0;
            }

            .role-chip-container {
                position: absolute;
                bottom: 0;
                right: 50%;
                transform: translate(50%, 50%);
                gap: 0.25rem;
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

        .will-use-app-input {
            margin-top: 1rem;
        }
    }
}

.invite-register-form {
    .form-section.clinician-profile {
        .form-header {
            margin-bottom: 1.5rem;
        }

        :deep() {
            #specialisation {
                text-transform: capitalize;
            }
        }
    }

    .form-section.medications {
        max-height: v-bind(medicationsSectionMaxHeight);
        margin-top: 2.5rem;
        transition:
            max-height 0.35s cubic-bezier(0.075, 0.82, 0.165, 1),
            padding 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);
        
            .form-header {
                margin-top: 0rem;
            }
    
    
        .form-inner {
            padding-top: 1.5rem;
            border-color: rgba(255, 235, 165, 0.21);
    
            @media (prefers-color-scheme: light) {
                border-color: rgb(255, 200, 0);
            }
        }
    }
}


.medications-teleporter {
    display: flex;
    flex-direction: column;

    .medications-list {
        margin: 2rem 0rem;
        gap: 2.5rem;
        transition: margin 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);

        &.collapsed {
            margin: 0;
        }
    }

    .medication-fields-wrapper {
        position: relative;
        border-left: 1px solid var(--border-4-color);
        padding-left: 1.25rem;
        gap: 0.5rem;

        h3 {
            font-size: 1rem;
            font-weight: 500;
            letter-spacing: 0.3px;
            height: 28px;
            font-family: var(--notoserif-font-stack);
            color: var(--text-1-color);
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;

            span {
                font-size: 1rem;
                font-weight: 400;
                color: var(--text-6-color);
            }
        }

        .remove-medication-button {
            align-self: flex-end;
            width: 100px;
            height: 28px;
            padding: 0rem 0.8rem;
            gap: 0.35rem;
            margin-top: 0rem;
            position: absolute;
            top: 0;
            background-color: transparent;
            color: var(--text-6-color);
            border-color: transparent;
            transition: color 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
            cursor: pointer;

            &:hover {
                color: var(--text-1-color);
            }
        }
    }

    .add-medication-button, .remove-medication-button {
        margin-top: 0.5rem;
        gap: 0.5rem;
        height: 38px;
        width: 160px;
        font-size: 0.9rem;
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;

        svg {
            height: 100%;
            aspect-ratio: 1;
            width: auto;
        }

        &.no-medications {
            margin-top: 2rem;
        }
    }
}
</style>