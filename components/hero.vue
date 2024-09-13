<template>
    <section>
        <div class="container section">
            <h1>Take Control of Your Pain, Reclaim Your Life</h1>
            <p class="subtitle">
                Introducing <strong class="complex-shimmer" data-text="Pain Coach">Pain Coach</strong>. Your personalised pain and lifestyle assistant, backed by real science
            </p>
            <BaseButton href class="waitlist-link">Get Started</BaseButton>
            <div class="landing-image">
                <div class="image-container">
                    <!-- <img src="~/images/step-one.JPG" alt="Step One" /> -->
                    <div class="wrapper">
                        <IphoneMockup href="/images/mockup-dark.png" />
                        <IphoneMockup href="/images/mockup-light.png" />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>
section {
    padding: 0rem 1rem;

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

.landing-image {
    width: 100%;
    aspect-ratio: 16/9;
    margin-top: 4rem;

    .image-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background-color: var(--text-color);
        border-radius: 8px;
        overflow: hidden;
        
        .wrapper {
            height: 100%;
            position: relative;
            display: flex;
            justify-content: space-around;
            align-items: center;
            max-width: 75%;

            svg {
                margin: 0rem;
            }

            .mockup-container:first-child {
                margin-right: 1rem;
                margin-left: 0rem;
            }
    
            .mockup-container:last-child {
                margin-left: 1rem;
                margin-right: 0rem;
            }

            @media (prefers-color-scheme: light) {
                flex-direction: row-reverse;

                .mockup-container:first-child {
                    margin-left: 1rem;
                    margin-right: 0rem;
                }

                .mockup-container:last-child {
                    margin-left: 0;
                    margin-right: 1rem;
                }
            }
        }
        

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