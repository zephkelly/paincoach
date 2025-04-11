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
            <div class="form__group data-sharing">
                <label for="clinician-profile" class="form__label">Allowed clinician profile</label>
                <input type="checkbox" id="clinician-profile" class="form__input" v-model="allowedClinicianProfile" />
            </div>
            <div class="form__group data-sharing">
                <label for="owner-role" class="form__label">Allowed owner role</label>
                <input type="checkbox" id="owner-role" class="form__input" v-model="allowedOwnerRole" />
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
import type { Role } from '@@/shared/types/v1/role';
import { validateCreateUserInvitationRequest } from '@@/shared/schemas/v1/user/invitation/create';
import type { CreateUserInvitationRequest } from '@@/shared/types/v1/user/invitation/create';

const {
    mockUserAPIData
} = useAuth();

const firstName = ref('');
const lastName = ref('');
const phone = ref('');
const email = ref('');
const confirmEmail = ref('');
const dataSharing = ref(false);
const allowedClinicianProfile = ref(false);
const allowedOwnerRole = ref(false);

// For handling form errors
const formError = ref('');
const isSubmitting = ref(false);

async function submitInviteAdminForm() {
    // Reset error state
    formError.value = '';
    isSubmitting.value = true;
    
    // Basic client-side validation
    if (email.value !== confirmEmail.value) {
        formError.value = 'Emails do not match';
        isSubmitting.value = false;
        return;
    }

    const finalRoles: Role[] = ['admin', 'app'];
    if (allowedClinicianProfile.value) {
        finalRoles.push('clinician');
    }
    if (allowedOwnerRole.value) {
        finalRoles.push('owner');
    }

    try {
        const createUserInviteRequest: CreateUserInvitationRequest = {
            roles: finalRoles,
            primary_role: (allowedOwnerRole.value) ? 'owner' : 'admin',
            email: email.value,
            confirm_email: confirmEmail.value,
            phone_number: phone.value,

            invitation_data: {
                first_name: firstName.value,
                last_name: lastName.value,
                data_sharing_enabled: dataSharing.value,

                role_data: undefined
            }
        };

        const validatedCreateUserInviteRequest = validateCreateUserInvitationRequest(createUserInviteRequest);

        const response = await $fetch('/api/v1/auth/invite', {
            method: 'POST',
            body: validatedCreateUserInviteRequest
        });
        
        console.log('Admin added successfully');
        
    }
    catch (error: unknown) {
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