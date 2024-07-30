<template>
    <NuxtLayout>
        <NuxtPage :transition="{
            name: 'page',
            mode: 'out-in'
        }" />
        <Navbar/>
    </NuxtLayout>
</template>

<script setup>
</script>
  
<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>