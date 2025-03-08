<template>
    <form class="form" @submit.prevent="submitForm">
        <div class="form__header">
            <h2 class="form__title">Add New Patient</h2>
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
                <label for="email" class="form__label">Email</label>
                <EInput id="email" type="email" class="form__input" v-model="email" required />
            </div>
            <div class="form__group">
                <label for="confirm-email" class="form__label">Confirm Email</label>
                <EInput id="confirm-email" type="email" class="form__input" v-model="confirmEmail" required />
            </div>
            <div class="form__group">
                <label for="password" class="form__label">Password</label>
                <EInput id="password" type="password" class="form__input" v-model="password" required />
            </div>
            <div class="form__group">
                <label for="confirm-password" class="form__label">Confirm Password</label>
                <EInput id="confirm-password" type="password" class="form__input" v-model="confirmPassword" required />
            </div>
            <!-- Data sharing checkbox -->
            <div class="form__group data-sharing">
                <label for="data-sharing" class="form__label">Data Sharing</label>
                <input type="checkbox" id="data-sharing" class="form__input" />
            </div>
        </div>
        <div class="form__footer">
            <button type="submit" class="button button--primary">Add Patient</button>
        </div>
    </form>
</template>

<script lang="ts" setup>
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const confirmEmail = ref('');
const password = ref('');
const confirmPassword = ref('');

function submitForm() {
    console.log('Form submitted');
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