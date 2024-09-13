<template>
    <section>
        <h1>Take Control of Your Pain, Reclaim Your Life</h1>
        <p class="subtitle">
            Introducing <strong class="complex-shimmer" data-text="Pain Coach">Pain Coach</strong>. Your personalised pain and lifestyle assistant, backed by real science
        </p>
        <BaseButton href class="waitlist-link">Get Started</BaseButton>
        <div class="landing-video">
            <div class="video-container">
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>
section {
    margin: 1rem 1rem;

    .subtitle {
        // margin-top: 1rem;
        tab-size: 4;

        strong {
            font-size: 20px;
            font-weight: 700;
            letter-spacing: 0.3px;
        }
    }
}

.waitlist-link {
    margin-top: 1.2rem;
}

.landing-video {
    width: 100%;
    aspect-ratio: 16/9;
    margin-top: 4rem;

    .video-container {
        position: relative;
        width: 100%;
        height: 100%;
        background-color: var(--text-color);
        border-radius: 8px;
    }
}

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