<template>
    <main>
        <h1>Insights</h1>
        <div class="page-container">
            <ContributionChart />
            <section class="panel">
                <div class="headers wrapper">
                    <h2>Your Pain Factors</h2>
                    <!-- <img src="~/assets/images/insights-demo-1.JPG" alt="Insights icon" /> -->
                </div>
                <img src="./../assets/images/insights.webp" alt="Your Image">
            </section>
        </div>
    </main>
</template>

<script setup lang="ts">
//@ts-ignore
import ContributionChart from '@/components/insights/contributionChart.vue';



</script>

<style lang="scss" scoped>
    h1 {
        font-family: 'Inter', sans-serif;
        color: var(--text-color);
        font-size: var(--font-size-20);
        text-align: center;
        margin-top: 0.8rem;
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
        position: relative;
        right: -3px;
    }
</style>