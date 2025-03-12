<template>
    <form class="form" @submit.prevent="submitInviteAdminForm">
        <div class="form__header">
            <h2 class="form__title">Add New Admin</h2>
        </div>
        
        <!-- Error message display -->
        <div v-if="formError" class="form__error">
            {{ formError }}
        </div>
        
        <div class="form__body">
            <div class="form__group">
                <label for="first-name" class="form__label">First Name</label>
                <EInput id="first-name" type="text" class="form__input" v-model="firstName" required />
            </div>
            <div class="form__group">
                <label for="last-name" class="form__label">Last Name</label>
                <EInput id="last-name" type="text" class="form__input" v-model="lastName" required />
            </div>
            <div class="form__group">
                <label for="phone" class="form__label">Phone Number</label>
                <EInput id="phone" type="phone" class="form__input" v-model="phone" required />
            </div>
            <div class="form__group">
                <label for="email" class="form__label">Email</label>
                <EInput id="email" type="email" class="form__input" v-model="email" required />
            </div>
            <div class="form__group">
                <label for="confirm-email" class="form__label">Confirm Email</label>
                <EInput id="confirm-email" type="email" class="form__input" v-model="confirmEmail" required />
            </div>
            <!-- Data sharing checkbox -->
            <div class="form__group data-sharing">
                <label for="data-sharing" class="form__label">Data Sharing</label>
                <input type="checkbox" id="data-sharing" class="form__input" v-model="dataSharing" />
            </div>
        </div>
        <div class="form__footer">
            <button type="submit" class="button button--primary" :disabled="isSubmitting">
                {{ isSubmitting ? 'Adding...' : 'Add Admin' }}
            </button>
        </div>
    </form>
</template>

<script lang="ts" setup>
import { H3Error } from 'h3'
import { type InviteUserRequest } from '~~lib/shared/types/users/invitation/request';
import { validateInviteUserRequest } from '~~lib/shared/schemas/users/invitation/request';

const {
    mockUserAPIData
} = useAuth();

const firstName = ref('');
const lastName = ref('');
const phone = ref('');
const email = ref('');
const confirmEmail = ref('');
const dataSharing = ref(false);

// For handling form errors
const formError = ref('');
const isSubmitting = ref(false);

async function submitInviteAdminForm() {
    console.log(firstName.value, lastName.value, phone.value, email.value, confirmEmail.value, dataSharing.value);
    // Reset error state
    formError.value = '';
    isSubmitting.value = true;
    
    // Basic client-side validation
    if (email.value !== confirmEmail.value) {
        formError.value = 'Emails do not match';
        isSubmitting.value = false;
        return;
    }
    
    try {
        // Create the invite request object
        const inviteRequest: InviteUserRequest = {
            user: {
                email: email.value,
                first_name: firstName.value,
                last_name: lastName.value,
                phone_number: phone.value,
                data_sharing_enabled: dataSharing.value,
                confirm_email: confirmEmail.value,
                role: 'admin',
            },

            ...mockUserAPIData.value
        };
        
        // Validate the request (but don't reassign it)
        validateInviteUserRequest(inviteRequest);
        
        // Send the validated request directly
        const response = await $fetch('/api/v1/auth/invite', {
            method: 'POST',
            body: inviteRequest // Send the request object directly
        });
        
        console.log('Admin added successfully');
        
        // Reset form
        firstName.value = '';
        lastName.value = '';
        phone.value = '';
        email.value = '';
        confirmEmail.value = '';
        dataSharing.value = false;
        
        // You could add success message or redirect here
    } catch (error: unknown) {
        if (error instanceof Error) {
            formError.value = `Validation error: ${error.message}`;
        } else {
            formError.value = 'An unexpected error occurred';
            console.error('Request error', error);
        }
    } finally {
        isSubmitting.value = false;
    }
}
</script>

<style lang="scss" scoped>
.form__header {
    font-weight: 700;
    margin-bottom: 1.5rem;
}

.form__body {
    width: 50%;
}

.form__group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-bottom: 1rem;
}

.form__group.data-sharing {
    input {
        width: 16px;
        height: 16px;
    }
}
</style>