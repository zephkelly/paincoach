<template>
    <Navbar />
    <slot />
    <LandingFooter />
</template>

<style lang="scss">
main.site-page {
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
}
</style>