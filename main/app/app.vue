<template>
    <Head>
        <title>Pain Coach</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
        <link rel="manifest" href="/site.webmanifest">
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
        <meta name="msapplication-TileColor" content="#da532c">
        <meta name="theme-color" content="#ffffff">
        <meta name="description" content="Welcome to Pain Coach, an app that acts as your personal pain and lifestyle assistant." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Lachlan Townend" />
        <meta name="msapplication-navbutton-color" content="#1c1c20" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#1c1c20" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="google" content="notranslate" />
        <meta name="google-site-verification" content="google-site-verification" />
    </Head> 
    <input v-model="emailInput" placeholder="email" type="text">
    <input v-model="passwordInput" placeholder="password" type="text">
    <button @click.prevent="login()">Submit</button>
    <button @click.prevent="test()">Test</button>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<script lang="ts" setup>
const emailInput = ref(null);
const passwordInput = ref(null);

async function login() {
    if (!passwordInput.value) {
        console.log('No password entered');
        return;
    }

    const response = await $fetch('/api/v1/auth/login',
        {
            method: 'POST',
           
            body: {
                email: emailInput.value,
                password: passwordInput.value
            }
        }
    )

    console.log(response);
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