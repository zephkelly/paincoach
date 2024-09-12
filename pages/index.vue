<template>
    <main>
        <navbar />
        <scrollToReveal>
            <hero class="hero main"/>
        </scrollToReveal>
        <scrollToReveal>
            <how class="how"/>
        </scrollToReveal>
    </main>
</template>

<script lang="ts" setup>
import scrollToReveal from '~/components/scrollToReveal.vue';
</script>

<style lang="scss" scoped>
main {
    height: 1200px;
    text-rendering: optimizeLegibility;
}

.hero {
    margin-top: 3.5rem;

    &.main {
        margin-top: 7rem;
    }
}

.how {
    margin-top: 7rem;
}
</style>