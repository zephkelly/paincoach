<template>
    <div class="page">
        <div class="login">
            <input v-model="emailInput" placeholder="email" type="email">
            <input v-model="passwordInput" placeholder="password" type="password">
            <button @click.prevent="login()">Submit</button>
            <button @click.prevent="test()">Test</button>
        </div>
    </div>
</template>

<script lang="ts" setup>
const emailInput = ref(null);
const passwordInput = ref(null);

const {
    fetch: refreshUserSession
} = useUserSession();

async function login() {
    if (!passwordInput.value) {
        console.log('No password entered');
        return;
    }

    try {
        const response = await $fetch('/api/v1/auth/login',
            {
                method: 'POST',
               
                body: {
                    email: emailInput.value,
                    password: passwordInput.value
                }
            }
        )

        console.log('Logged in', response);

        await refreshUserSession();
        return navigateTo('/app');
    }
    catch (error: unknown) {
        console.log('Error logging in');
    }
}

async function test() {
    const response = await $fetch('/api/v1/auth',
        {
            method: 'GET'
        }
    )

    console.log(response);
}
</script>

<style lang="scss" scoped>
.page {
    margin-top: 6rem;
}
</style>