<template>
    <main id="main-content landing" class="site-page">
        <ScrollToReveal centerAlign>
            <hero class="hero main" aria-label="Main hero section"/>
        </ScrollToReveal>
        <Spacer class="spacer"/>
        <How id="how-it-works" class="how"/>
        <Spacer class="spacer"/>
        <ScrollToReveal>
            <Quote class="quote"
                quote="People in pain want simple, actionable advice but are often left to drown in the complexity of modern pain sciences. I want to change that."
                by="- Lachlan Townend (Founder)"
                author="Lachlan Townend"
                :src="profilePhoto" />
        </ScrollToReveal>
        <AnimatedVideo class="animated-video"/>
        <WaitingList class="waitlist" />
    </main>
</template>

<script lang="ts" setup>
// import ScrollToReveal from '~~/layers/shared/components/scrollToReveal.vue';
// import Spacer from '~~/layers/shared/components/spacer.vue';

import profilePhoto from '~/assets/images/headshot-lachlan.webp';
</script>

<style lang="scss" scoped>
main {
    margin-top: 7rem;
    text-rendering: optimizeLegibility;
}

.spacer {
    margin: clamp(4rem, 7vw, 6rem) 0rem;
}

.how {
    margin-bottom: clamp(4rem, 7vw, 6rem);
}

.animated-video {
    margin-top: 0rem;
    min-height: 300px;

    @media (max-width: 768px) {
        min-height: 128px; 
    }
}

.quote {
    margin-bottom: clamp(2rem, 7vw, 4rem);
}

.waitlist {
    margin-top: clamp(2rem, 7vw, 4rem);
    margin-bottom: clamp(10rem, 8vw, 12rem);

    @media (max-width: 768px) {
        margin-top: 2.5rem;
        margin-bottom: 7rem;
    }
}
</style>