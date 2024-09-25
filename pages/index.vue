<template>
    <Head>
        <title>Pain Coach</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
        <link rel="manifest" href="/site.webmanifest">
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
        <meta name="msapplication-TileColor" content="#da532c">
        <meta name="theme-color" content="#ffffff">
        <meta name="description" content="Welcome to Pain Coach, an app that acts as your personal pain and lifestyle assistant." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Lachlan Townend" />
        <meta name="msapplication-navbutton-color" content="#1c1c20" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#1c1c20" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="google" content="notranslate" />
        <meta name="google-site-verification" content="google-site-verification" />
    </Head>
    <main id="main-content">
        <Navbar />
        <ScrollToReveal>
            <hero class="hero main" aria-label="Main hero section"/>
        </ScrollToReveal>
        <Spacer class="spacer"/>
        <How id="how-it-works" class="how"/>
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
        <LandingFooter />
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

<style lang="scss">
.complex-shimmer {
    display: inline-block;
    position: relative;
    color: #d63636;
   
    &::before, &::after {
        height: 110%;
        width: 105%;
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