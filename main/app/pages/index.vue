<template>
    <Page :max-width="1000">
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
    </Page>
</template>

<script lang="ts" setup>
import profilePhoto from '~/assets/images/headshot-lachlan.webp';

definePageMeta({
    layout: 'lander',
});
</script>

<style>
html{
    background-color: var(--background);
} 
</style>

<style lang="scss" scoped>

main {
    padding-top: clamp(6rem, 7vw, 13rem);
    text-rendering: optimizeLegibility;
    font-family: var(--geist-font-stack);
    color: var(--text-color);
    background-color: var(--background);
    scrollbar-color: auto;
    width: 100%;

    :deep() {
        section {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            box-sizing: border-box;
        }
        
        h1, h2 {
            tab-size: 4;
            font-weight: 700;
            font-size: clamp(40px, 5vw, 46px);
            letter-spacing: -1.2px;
            line-height: 34px;
            margin-bottom: 1rem;
            color: var(--text-color);
        }
        h1 {
            font-size: clamp(42px, 7vw, 46px);
            line-height: 38px;
        }
        
        h3 {
            tab-size: 4;
            font-weight: 600;
            font-size: clamp(28px, 7vw, 32px);
            line-height: 2rem;
            margin-bottom: 1rem;
            color: var(--text-color);
        }
        
        p {
            font-size: 18px;
            font-weight: 300;
            line-height: 28px;
            color: var(--text-color);
        }
        
        .container.section {
            width: 100%;
            // max-width: 800px;
            box-sizing: border-box;
            padding: 0rem 1rem;
        }
        
        svg {
            fill: var(--text-color);
        }
        
        section.panel, button.panel {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 24px 16px;
            background-color: var(--panel);
            border-radius: 16px;
        }
        
        section.panel > .headers > h2, section > .headers > h2,
        section.panel > .headers > h3, section > .headers > h3 {
            font-family: var(--inter-font-stack);;
            color: var(--text-color);
            font-size: var(--font-size-18);
            font-weight: 400;
        }
        
        .panel > .headers {
            margin-bottom: 1.5rem;
        }
        
        .page-container {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            gap: 16px;
            width: 100%;
            margin-bottom: 7rem;
            box-sizing: border-box;
        }
    }

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
    padding-bottom: clamp(10rem, 8vw, 12rem);

    @media (max-width: 768px) {
        margin-top: 2.5rem;
        padding-bottom: 7rem;
    }
}
</style>