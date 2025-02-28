<template>
    <main id="main-content landing" class="site-page">
        <ScrollToReveal centerAlign>
            <LanderHero class="hero main" aria-label="Main hero section"/>
        </ScrollToReveal>
        <Spacer class="spacer"/>
        <LanderHow id="how-it-works" class="how"/>
        <Spacer class="spacer"/>
        <ScrollToReveal>
            <LanderQuote class="quote"
                quote="People in pain want simple, actionable advice but are often left to drown in the complexity of modern pain sciences. I want to change that."
                by="- Lachlan Townend (Founder)"
                author="Lachlan Townend"
                :src="profilePhoto" />
        </ScrollToReveal>
        <LanderAnimatedVideo class="animated-video"/>
        <LanderWaitingList class="waitlist" />
    </main>
</template>

<script lang="ts" setup>
import profilePhoto from '~/assets/images/headshot-lachlan.webp';

definePageMeta({
    layout: 'lander',
});
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