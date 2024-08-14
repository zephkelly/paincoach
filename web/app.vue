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
/* .page-enter-active,
.page-leave-active {
  transition: opacity 0.1s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  background-color: transparent;
  filter: blur(4px);
} */
</style>