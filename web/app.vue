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
  transition: opacity 0.1s cubic-bezier(0.075, 0.82, 0.165, 1), filter 0.2s ease;
}
.page-enter-from {
  opacity: 0;
  background-color: transparent;
  filter: blur(4px);
}
</style>