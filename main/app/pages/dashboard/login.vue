<template>
    <div class="login-container">
        <Transition name="fade">
            <div class="login-card" v-show="!loggedIn">
                <h1 class="login-title">Sign In</h1>
            
                <form @submit.prevent="login" class="login-form">
                    <div class="form-group">
                        <EInput
                            id="email"
                            v-model="emailInput"
                            label="Email"
                            type="email"
                            @input="clearError"
                            :validation="{
                                validator: LoginValidator,
                                fieldPath: 'email',
                            }"
                        />
                    </div>
            
                    <div class="form-group">
                        <EInput
                            id="password"
                            v-model="passwordInput"
                            label="Password"
                            type="password"
                            @input="clearError"
                            :validation="{
                                validator: LoginValidator,
                                fieldPath: 'password',
                            }"
                        />
                    </div>
            
            
                    <div class="button-group">
                        <EButton type="submit" class="btn-primary" :loading="loggingIn">Sign In</EButton>
                        <div v-if="loginErrorMessage" class="error-message">
                            * {{ loginErrorMessage }}
                        </div>
                    </div>
                </form>
            </div>
        </Transition>
    </div>
</template>

<script lang="ts" setup>
import { LoginValidator } from '@@/shared/schemas/v1/login';

const emailInput = ref<string | null>(null);
const passwordInput = ref<string | null>(null);
const loginResponse = ref<string | null>(null);

const {
    fetchNewSession,
    loggedIn,

    login,
    loggingIn,
    errorMessage: loginErrorMessage,
} = useAuth();

function clearError() {
    loginErrorMessage.value = '';
}

definePageMeta({
    layout: 'app',
});
</script>

<style lang="scss" scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-top: 2rem;
    padding: 0 1rem;
}

.login-card {
    width: 100%;
    max-width: 400px;
    padding: 2rem;
    background-color: var(--background-3-color);
    border: 1px solid var(--border-6-color);
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
}

.login-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-1-color);
    margin-bottom: 1.5rem;
    text-align: center;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    box-sizing: border-box;
    
    label {
        font-size: 0.875rem;
        font-weight: 500;
        color: #4b5563;
    }
    
    input {
        padding: 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 1rem;
        transition: border-color 0.2s;
        
        &:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }
    }
}

.button-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 0.5rem;
}

.btn-primary {
    flex: 1;
    background-color: var(--info-background-4-color);
    border: 1px solid var(--info-border-2-color);
    color: var(--text-2-color);
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: 
        color 0.35s cubic-bezier(0.075, 0.82, 0.165, 1),
        background-color 0.35s cubic-bezier(0.075, 0.82, 0.165, 1),
        border-color 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);
    
    &:hover {
        color: var(--text-color);
        background-color: var(--info-background-3-color);
        border-color: var(--info-border-1-color);
    }
}

.error-message {
    color: var(--error-color);
    border-radius: 6px;
    font-size: 0.875rem;
}
</style>