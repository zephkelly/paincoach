<template>
    <main>
        <navbar />
        <scrollToReveal>
            <hero class="hero main"/>
        </scrollToReveal>
        <scrollToReveal>
            <how class="how"/>
        </scrollToReveal>
        <Quote quote="People in pain want simple, actionable advice but are often left to drown in the complexity of modern pain sciences" author="- Lachlan Townend (Founder)" />
        <WaitingList class="waitlist" />
    </main>
</template>

<script lang="ts" setup>
import scrollToReveal from '~/components/scrollToReveal.vue';
</script>

<style lang="scss" scoped>
main {
    text-rendering: optimizeLegibility;
}

.hero {
    margin-top: 4rem;
}

.how {
    margin-top: 7rem;
}

.waitlist {
    margin-top: 7rem;
}
</style>