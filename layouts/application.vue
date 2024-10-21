<template>
    <div class="app">
        <slot/>
        <Navbar/>
    </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/app/navbar.vue';
</script>