<template>
    <Page padBody>
        <DashboardUserInviteRegister />
    </Page>
</template>

<script lang="ts" setup>
import { onRouteValidateSession } from '~/utils/auth/route-middleware/session-validate'
import { onRouteValidateRoles } from '~/utils/auth/route-middleware/role-validate'

definePageMeta({
  middleware: () => {
    onRouteValidateSession(true);
    onRouteValidateRoles(['admin', 'unregistered']);
  },
})
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
                    // max-height: v-bind(medicationsMaxHeightStyle);
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