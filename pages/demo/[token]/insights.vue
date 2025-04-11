<template>
    <main>
        <h1>Insights</h1>
        <div class="page-container">
            <ContributionChart />
            <section class="panel">
                <div class="headers wrapper">
                    <h2>Your Pain Factors</h2>
                </div>
                <img v-if="colorScheme === 'light'" :src="lightFactorChart" alt="Your Image">
                <img v-else :src="darkFactorChart" alt="Example chart image">
            </section>
        </div>
    </main>
</template>

<script setup lang="ts">
import lightFactorChart from '@/assets/images/insights-light.webp';
import darkFactorChart from '@/assets/images/insights.webp';
import ContributionChart from '@/components/app/insights/contributionChart.vue';

const colorScheme = ref('light');

const updateColorScheme = () => {
  colorScheme.value = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

onMounted(() => {
  updateColorScheme();
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateColorScheme);

  console.log(colorScheme.value);
});

onUnmounted(() => {
  window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', updateColorScheme);
});

definePageMeta({
    layout: 'application',
    title: 'Insights',
    description: 'This is the insights page',
    middleware: 'verify-demo-token'
});
</script>

<style lang="scss" scoped>
    h1 {
        font-family: 'Inter', sans-serif;
        color: var(--text-color);
        font-size: var(--font-size-20);
        text-align: center;
        margin-top: 2rem;
        margin-bottom: 2rem;
    }

    .panel {
        position: relative;
        font-family: 'Inter', sans-serif;
        width: 100%;
        box-sizing: border-box;
        max-width: 452px;
        min-width: 268px;
    }

    .page {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
    }

    .panel img {
        width: 100%;
        position: relative;
        right: -3px;
    }
</style>