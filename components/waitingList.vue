<template>
    <section>
        <div class="section container">
            <form @submit.prevent="submitForm">
                <div class="group">
                    <label for="potFName" class="hidden">&nbsp;</label>
                    <input type="text" name="FNAME" class="name" id="potFName" v-model="potFNameModel" placeholder="Your name here" autocomplete="off" tabindex="-1">
                </div>
                <div class="group">
                    <input
                        type="email"
                        name="EMAIL"
                        class="email"
                        id="mce-EMAIL"
                        placeholder="email address"
                        v-model="emailModel"
                        required
                    >
                    <button
                        type="submit"
                        name="subscribe"
                        id="mc-embedded-subscribe"
                        class="button"
                        :disabled="isSubmitting"
                    >
                        {{ isSubmitting ? 'Submitting...' : 'Subscribe' }}
                    </button>
                </div>
                <p v-if="statusMessage">{{ statusMessage }}</p>
            </form>
        </div>
    </section>
  </template>
  
<script lang="ts" setup>
import { ref } from 'vue'

const isSubmitting = ref(false)

const emailModel = ref('')
const potFNameModel = ref('') // Honeypot field

const statusMessage = ref('')

async function submitForm() {
    if (potFNameModel.value)
    {
        setTimeout(() => {
            statusMessage.value = "You've successfully joined the waiting list!"
        }, 1500)
        return
    }

    if (emailModel.value)
    {
        isSubmitting.value = true
        statusMessage.value = ''

        try {
            const response = await $fetch('/api/subscribe', {
                method: 'POST',
                body: { email: emailModel.value }
            })
    
            if (response.success) {
                statusMessage.value = 'Successfully subscribed!'
                emailModel.value = ''
            } else {
                statusMessage.value = 'An error occurred. Please try again.'
            }
        }
        catch (error) {
            console.error('Error:', error)
            statusMessage.value = 'An error occurred. Please try again.'
        }
        finally {
            isSubmitting.value = false
        }
    }
}
</script>

<style lang="scss" scoped>
section {
    padding: 0rem 1rem;
    min-height: 200px;
}
</style>