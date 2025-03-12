<template>
    <section id="waitlist">
        <div class="section container">
            <h2 class="clarity" tabindex="0">Find <span class="complex-shimmer" data-text="Clarity">Clarity</span>.</h2>
            <h2 tabindex="0">Join the waiting list now:</h2>
            <p>We're working hard to make <span class="complex-shimmer" data-text="Pain Coach">Pain Coach</span> a reality. To show your support and stay up to date on our progress, sign up below.</p>
            <form @submit.prevent="submitForm">
                <div class="group">
                    <label for="potFName" class="hidden">&nbsp;</label>
                    <input type="text" name="FNAME" class="name" id="potFName" v-model="potFNameModel" placeholder="Your name here" autocomplete="off" tabindex="-1">
                </div>
                <div class="group email">
                    <label for="inputEmail" >Email Address</label>
                    <input
                        type="email"
                        name="EMAIL"
                        class="email"
                        id="inputEmail"
                        placeholder="example@email.com"
                        v-model="emailModel"
                        required
                        @input="verifyEmailInput"
                        tabindex="0"
                    >
                    <button
                        type="submit"
                        name="subscribe"
                        id="buttonSubscribe"
                        class="button"
                        :class="{ error: statusError }"
                        :disabled="isSubmitting"
                        tabindex="0"
                        @keydown="submitForm"
                    >
                        {{ isSubmitting ? 'Submitting...' : 'Subscribe' }}
                    </button>
                </div>
                <p v-if="statusMessage" class="post-status" :class="{ error: statusError }">{{ statusMessage }}</p>
            </form>
        </div>
    </section>
</template>
  
<script lang="ts" setup>
import { H3Error } from 'h3';
import { ref } from 'vue'

const isSubmitting = ref(false)

const emailModel = ref('')
const potFNameModel = ref('') // Honeypot field

const statusError = ref(false);
const statusMessage = ref('')

const emailInputTimeout = ref<NodeJS.Timeout | null>(null);

function verifyEmailInput() {
    statusMessage.value = '';
    statusError.value = false;

    if (emailInputTimeout.value !== null) {
        clearTimeout(emailInputTimeout.value);
    }
    emailInputTimeout.value = setTimeout(() => {
        validateEmail();
        emailInputTimeout.value = null;
    }, 1000);
}

function validateEmail() {
    if (emailModel.value.length >= 254) {
        statusError.value = true;
        statusMessage.value = 'Email address is too long.';
    } else if (emailModel.value && !emailModel.value.includes('@')) {
        statusError.value = true;
        statusMessage.value = 'Please enter a valid email address.';
    } else {
        statusError.value = false;
        statusMessage.value = '';
    }
}

async function submitForm() {
    statusMessage.value = '';
    statusError.value = false;

    if (potFNameModel.value)
    {
        console.log('Honeypot field filled out. Bot detected.');
        setTimeout(() => {
            statusError.value = false;
            statusMessage.value = "You've successfully joined the waiting list! If you don't receive an email from us, please check your spam folder."
        }, 1500)
        return
    }

    if (emailModel.value)
    {
        isSubmitting.value = true
        statusError.value = false
        statusMessage.value = ''

        try {
            await $fetch('/api/v1/mailing-list', {
                method: 'POST',
                body: { email: emailModel.value }
            })
    
            statusError.value = false
            statusMessage.value = "You've successfully joined the waiting list! Please check your spam folder for a confirmation email."
            emailModel.value = ''
        }
        catch (error: any) {
            if (error.statusCode === 409) {
                statusError.value = true
                statusMessage.value = 'You are already subscribed! Please check your inbox and spam folder.'
                return;
            }

            statusError.value = true
            statusMessage.value = 'There seems to be an error on our end! Please try again later.'
        }
        finally {
            isSubmitting.value = false
        }
    }
}
</script>

<style lang="scss" scoped>
section {
    min-height: 200px;

    @media (max-width: 768px) {
        padding: 0rem 0rem;
    }
}

.clarity {
    font-size: clamp(46px, 5vw, 48px);
    line-height: 48px;
}

p {
    margin-bottom: 2rem;
}

h2:first-of-type {
    margin-bottom: 0rem;
}

form {
    position: relative;

    .group {
        &:first-child {
            position: relative;
            left: -9999px;
        }
    }

    .group.email {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        label {
            font-size: 1.4rem;
            font-weight: 700;
            margin-bottom: 0.25rem;
        }

        input {
            padding: 0.5rem;
            border: 1px solid var(--text-color);
            background-color: var(--background);
            color: var(--text-color);
            height: 2rem;
            border-radius: 0.5rem;
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
        }

        button {
            padding: 0.5rem;
            border: 1px solid var(--text-color);
            background-color: var(--text-color);
            color: var(--background);
            height: 4rem;
            border-radius: 0.5rem;
            font-size: 1.2rem;
            cursor: pointer;
            transition: background-color 0.5s cubic-bezier(0.075, 0.82, 0.165, 1), color 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);

            &:hover {
                background-color: var(--background);
                color: var(--text-color);
            }

            &:disabled {
                background-color: var(--background);
                color: var(--text-color);
                cursor: not-allowed;
            }
        }

        button.error {
            animation: flash 1.6s ease;

            @keyframes flash {
                0%, 100% {
                    background-color: var(--text-color);
                }
                50% {
                    background-color: rgb(255, 190, 190);
                }
            }
        }
    }
}

.post-status {
    font-size: 1.1rem;
    font-weight: 600;
    margin-top: 0.5rem;
    color: rgb(121, 198, 131);
    text-align: center;

    &.error {
        color: #d93b3b;
    }
}

.hidden {
    color: var(--background);
}
</style>