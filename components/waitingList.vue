<template>
    <form @submit.prevent="submitForm">
      <input
        type="email"
        name="EMAIL"
        class="email"
        id="mce-EMAIL"
        placeholder="email address"
        v-model="email"
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
      <p v-if="message">{{ message }}</p>
    </form>
  </template>
  
<script lang="ts" setup>
import { ref } from 'vue'

const email = ref('')
const isSubmitting = ref(false)
const message = ref('')

async function submitForm() {
    if (email.value) {
        isSubmitting.value = true
        message.value = ''
    
        try {
            const response = await $fetch('/api/subscribe', {
                method: 'POST',
                body: { email: email.value }
            })
    
            if (response.success) {
                message.value = 'Successfully subscribed!'
                email.value = ''
            } else {
                message.value = 'An error occurred. Please try again.'
            }
        } catch (error) {
                console.error('Error:', error)
                message.value = 'An error occurred. Please try again.'
        } finally {
                isSubmitting.value = false
        }
    }
}
</script>