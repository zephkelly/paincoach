<template>
    <section>
        <div class="container section">
            <h1 class="introduction"><span class="mobile-hidden">Introducing</span><span class="desktop-hidden">Meet</span> <strong class="complex-shimmer" data-text="Pain Coach">Pain Coach</strong>.</h1>
            <h2><span>Take Control, Reclaim Your Life.</span></h2>
            <p class="subtitle">
                Your personalised pain and lifestyle assistant, backed by real science.
            </p>
            <BaseButton href class="waitlist-link" @click.prevent="scrollToWaitlist">Join the Waitlist</BaseButton>
            <div class="landing-image">
                <div class="image-container">
                    <div class="fade"></div>
                    <div class="wrapper">
                        <IphoneMockup src="/images/mockup/landing-dark.webp" />
                        <IphoneMockup src="/images/mockup/landing-light.webp" />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
import { useScroll } from '@/composables/useScroll'

const { smoothScroll } = useScroll()

const scrollToWaitlist = () => {
  smoothScroll('#waitlist', 0)
}
</script>

<style lang="scss" scoped>
section {
    padding: 0rem 1rem;

    h1 {
        margin-bottom: 0rem;
        margin-top: clamp(2.5rem, 8vw, 4rem);
    }

    h2 {
        display: flex;
        margin-top: 1rem;

        @media (max-width: 580px) {
            margin-top: 0.5rem;
        }
    }

    .subtitle {
        tab-size: 4;

        strong {
            font-size: 20px;
            font-weight: 700;
            letter-spacing: 0.3px;
        }
    }
}

.hero-graphic {
    margin-bottom: 4rem;
    margin-top: clamp(6rem, 14vw, 10rem);
}

.waitlist-link {
    margin-top: 1.2rem;
    font-size: 1.1rem;
}

.landing-image {
    width: 100%;
    aspect-ratio: 16/9;
    margin-top: 4rem;

    .image-container {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background-color: var(--text-color);
        border-radius: 8px;
        overflow: hidden;

        .fade {
            position: absolute;
            height: 100%;
            width: 100%;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, var(--text-color) 100%);
            opacity: 0.3;
            border-radius: 8px;
            display: none;
        }

        @media (prefers-color-scheme: light) {
            background-color: transparent;

            .fade {
                display: block;
            }
        }

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

@media (max-width: 354px) {
    section {
        .introduction {
            margin-bottom: 0.5rem;
        }
    
        h2 {
            display: none;
        }
    }
}

.mobile-hidden {
    @media (max-width: 354px) {
        display: none;
    }
}

.desktop-hidden {
    @media (min-width: 354px) {
        display: none;
    }
}
</style>