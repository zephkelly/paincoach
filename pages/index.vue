<template>
    <main>
        <Navbar />
        <ScrollToReveal>
            <hero class="hero main"/>
        </ScrollToReveal>
        <Spacer class="spacer"/>
        <How class="how"/>
        <ScrollToReveal>
        <Spacer class="spacer"/>
        <Quote class="quote"
            quote="People in pain want simple, actionable advice but are often left to drown in the complexity of modern pain sciences. I want to change that."
            by="- Lachlan Townend (Founder)"
            author="Lachlan Townend"
            :pic="profilePhoto" />
        </ScrollToReveal>
        <AnimatedVideo class="animated-video"/>
        <WaitingList class="waitlist" />
    </main>
</template>

<script lang="ts" setup>
const profilePhoto = '/images/headshot-lachlan.webp';
</script>

<style lang="scss" scoped>
main {
    text-rendering: optimizeLegibility;
}

.hero {
    margin-top: 7rem;
}

.spacer {
    margin: clamp(4rem, 7vw, 6rem) 0rem;
}

.how {
    margin-bottom: clamp(4rem, 7vw, 6rem);
}

.animated-video {
    margin-top: 0rem;
    min-height: 400px;

    @media (max-width: 768px) {
        min-height: 128px; 
    }
}

.quote {
    margin-bottom: clamp(4rem, 7vw, 6rem);
}

.waitlist {
    margin-top: clamp(4rem, 7vw, 6rem);
    margin-bottom: clamp(10rem, 8vw, 12rem);

    @media (max-width: 768px) {
        margin-top: 2rem;
        margin-bottom: 9rem;
    }
}
</style>

<style lang="scss">
.complex-shimmer {
    display: inline-block;
    position: relative;
    color: #d63636;
   
    &::before, &::after {
        content: attr(data-text);
        position: absolute;
        left: 0;
        right: 0;
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-size: 300% 300%;
        animation: complexShine 6s linear infinite;
    }

    &::before {
        background-image: linear-gradient(
            45deg,
            rgba(210, 70, 70, 0.1) 0%,
            rgba(239, 141, 86, 0.3) 20%,
            rgba(239, 141, 86, 0.8) 40%,
            #ef8d56 50%,
            rgba(220, 64, 64, 0.8) 60%,
            rgba(210, 70, 70, 0.3) 80%,
            rgba(210, 70, 70, 0.1) 100%
        );
    }

    &::after {
        background-image: linear-gradient(
            135deg,
            rgba(210, 70, 70, 0.1) 0%,
            rgba(215, 57, 57, 0.374) 20%,
            rgba(225, 63, 63, 0.8) 40%,
            #d24646 50%,
            rgba(239, 141, 86, 0.8) 60%,
            rgba(239, 141, 86, 0.3) 80%,
            rgba(239, 141, 86, 0.1) 100%
        );
        animation-delay: -3s;
    }
}

@keyframes complexShine {
    0%, 100% {
        background-position: 0% 0%;
    }
    25% {
        background-position: 100% 100%;
    }
    50% {
        background-position: 100% 0%;
    }
    75% {
        background-position: 0% 100%;
    }
}
</style>