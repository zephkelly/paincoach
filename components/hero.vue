<template>
    <section>
        <div class="container section">
            <h1 tabindex="0" class="introduction">
                <span class="mobile-hidden">Introducing</span> <span class="desktop-hidden">Meet</span> <strong class="complex-shimmer" data-text="Pain Coach">Pain Coach</strong>.
            </h1>
            <h2 tabindex="0"><span>Take Control, Reclaim Your Life.</span></h2>
            <p class="subtitle" tabindex="0">
                Your personalised pain and lifestyle tracker, backed by real science.
            </p>
            <BaseButton 
                tabindex="0" 
                class="waitlist-link" 
                @click.prevent="handleClick"
                @keydown="handleKeyDown"
                arialLabel="Sign up for the waitlist now!"   
            >
                Join the Waitlist
            </BaseButton>
            <div class="landing-image">
                <div class="image-container">
                    <div class="fade"></div>
                    <div class="wrapper">
                        <IphoneMockup tabindex="-1" src="/images/mockup/landing-dark.webp" loading="eager" alt="Home screen of the pain coach mobile application. Featuring a calendar tracking weekly pain, a 'lifestyle score', and a ranking of the users largest pain factors."/>
                        <IphoneMockup tabindex="-1" src="/images/mockup/landing-light.webp" loading="eager" alt="Insights page of the pain coach mobile application. Featuring a doughnut chart of the factors contributing to pain, and a line graph showing pain over time." />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
import { useScroll } from '@/composables/useScroll'

const { smoothScroll } = useScroll()

const handleClick = () => {
    smoothScroll('#waitlist', 0)
    console.log('clicked')
}

const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
        smoothScroll('#waitlist', 0)
    }
};
</script>

<style lang="scss" scoped>
section {
    padding: 0rem 1rem;

    h1 {
        margin-bottom: 1rem;
        margin-top: clamp(2.5rem, 8vw, 4rem);

        @media (max-width: 500px) {
            line-height: 1;
            font-size: 3.25rem;
        }
    }

    h2 {
        display: flex;
        margin-top: 1rem;

        @media (max-width: 768px) {
            display: none;
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