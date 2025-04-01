<template>
    <div class="login-container">
        <div class="login-card">
            <h1 class="login-title">Sign In</h1>
            
            <form @submit.prevent="login" class="login-form">
                <div class="form-group">
                    <EInput 
                        id="email"
                        v-model="emailInput" 
                        placeholder="Enter your email"
                        label="Email"
                        type="email"
                        @input="clearError"
                    />
                </div>
                
                <div class="form-group">
                    <EInput 
                        id="password"
                        v-model="passwordInput" 
                        placeholder="Enter your password"
                        label="Password"
                        type="password"
                        @input="clearError"
                    />
                </div>
                
                
                <div class="button-group">
                    <EButton type="submit" class="btn-primary" :loading="loggingIn">Sign In</EButton>
                    <div v-if="errorMessage" class="error-message">
                        * {{ errorMessage }}
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const emailInput = ref<string | null>(null);
const passwordInput = ref<string | null>(null);
const loginResponse = ref<string | null>(null);
const errorMessage = ref<string | null>('');

const { fetchNewSession } = useAuth();

function clearError() {
    errorMessage.value = '';
}

const loggingIn = ref(false);
async function login() {
    if (!passwordInput.value) {
        errorMessage.value = 'No password entered';
        return;
    }

    loggingIn.value = true;
    
    try {
        const response = await $fetch('/api/v1/auth/login',
            {
                method: 'POST',
                body: {
                    email: emailInput.value,
                    password: passwordInput.value
                }
            }
        );

        
        loginResponse.value = response.statusMessage;
        await fetchNewSession();
        return navigateTo('/dashboard');
    }
    catch (error: any) {
        errorMessage.value = error.statusMessage || 'Error logging in';
    }
    finally {
        loggingIn.value = false;
    }
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
    background-color: var(--primary-2-color);
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover {
        background-color: var(--primary-4-color);
    }
}

.error-message {
    // padding: 0.75rem;
    // background-color: #fee2e2;
    color: var(--error-color);
    border-radius: 6px;
    font-size: 0.875rem;
}
</style>