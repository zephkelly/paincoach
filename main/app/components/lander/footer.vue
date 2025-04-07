<template>
    <section class="footer">
        <div class="section container">
            <footer>
                <div class="footer-content">
                    <div class="footer-content left">
                        <p class="trademark">Physio Pain Coach © 2024</p>
                    </div>
                    <div class="footer-content right">
                        <button class="return" @click.prevent="scrollToTop">Back to Top</button>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6l-6 6z"/></svg>
                    </div>
                </div>
            </footer>
        </div>
    </section>
</template>

<script setup lang="ts">
const { scrollToTop } = useScroll()
</script>

<style lang="scss" scoped>

section {
    display: flex;
    justify-content: center;
    background-color: #09090b;

    @media (prefers-color-scheme: light) {
        background-color: #ffffff;
    }
}

footer {
    min-height: 48px;
    padding-bottom: 1.2rem;
    font-family: var(--inter-font-stack);   

}

.section.container {
    box-sizing: border-box;
    padding: 0rem 1rem;
    max-width: 1000px;
    width: 100%;
}

.footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.trademark, .return {
    font-size: 0.8rem;
}

.trademark {
    opacity: 0.7;
    color: var(--text-color);
}

.footer-content.right {
    position: relative;
    display: flex;
    align-items: center;
    opacity: 0.7;
    transition: opacity 0.3s ease;

    svg {
        position: relative;
        top: 1px;
        width: 1.2rem;
        height: 1.2rem;
        color: var(--text-color);
    }

    &:hover {
        opacity: 1;
    }
}

.return {
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: var(--text-color);
}
</style>