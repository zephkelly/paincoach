<template>
    <section class="lifestyle-score overview panel">
        <div class="headers wrapper">
            <h2>Lifestyle Score</h2>
            <h3><span class="score">{{ lifestyleScore }}</span><span class="divider">/</span>100</h3>
        </div>
        <div class="lifestyle-bar wrapper">
            <Transition name="grow">
                <div v-if="isMounted" class="lifestyle-bar-inner" :style="{ width: `${lifestyleScore}%` }"></div>
            </Transition>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';

interface Props {
    lifestyleScore: number
}

const props = defineProps<Props>();

const isMounted = ref(false);

onMounted(() => {
    isMounted.value = true;
});
</script>

<style lang="css" scoped>
.headers.wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.headers.wrapper > h3 {
    font-size: var(--font-size-14);
    font-weight: 400;
    color: var(--text-color);
}

h3 > span.score {
    background-image: linear-gradient(45deg, var(--lifestyle-1), var(--lifestyle-2), var(--lifestyle-3));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
    margin-right: 2px;
}

h3 > span.divider {
    margin-right: 1px;
}

.lifestyle-bar.wrapper {
    height: 2rem;
    width: 100%;
    background-color: var(--background-color);
    border-radius: 8px;
}

.lifestyle-bar-inner {
    height: 2rem;
    background-color: var(--panel);
    border-radius: 8px;
    background-image: linear-gradient(45deg, var(--lifestyle-2), var(--lifestyle-3), var(--lifestyle-1));
}
</style>

<style lang="css" scoped>
.grow-enter-active,
.grow-leave-active {
  transition: width 1s ease;
}

.grow-enter-from,
.grow-leave-to {
  width: 0 !important;
}
</style>