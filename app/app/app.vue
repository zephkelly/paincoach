<template>
    <main>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
        <component v-if="!isFirefox && PWAInstallerComponent" :is="PWAInstallerComponent" />
    </main>
</template>

<script setup lang="ts">
const { isFirefox } = useBrowserDetection();

const PWAInstallerComponent = shallowRef<Component | null>(null);
 
onMounted(async () => {
    if (!isFirefox.value) {
        const { default: PWAInstaller } = await import('~/components/PWAInstaller.vue');
        PWAInstallerComponent.value = PWAInstaller;
    }
});
</script>