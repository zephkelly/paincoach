<template>
    <main id="main-content" class="site-page">
        <section>
            <div class="container section">
                <h1>You're Unsubscribed</h1>
                <p>You have been successfully unsubscribed from our mailing list. Made a mistake and want to resubscribe?<a :href="`/user/mailing-list/resubscribe/${unsubscribe_token}`">Click here.</a></p>
            </div>
        </section>
    </main>
</template>

<script lang="ts" setup>
const route = useRoute()
const unsubscribe_token = ref(route.params.unsubscribe_token)
</script>

<style lang="scss" scoped>
main {
    margin-top: 7rem;
    margin-bottom: 10rem;
    min-height: calc(100vh - (17rem + 56px + 67px));
    padding: 0rem 1rem;
}

section {
    h1 {
        margin-bottom: 1rem;
        margin-top: clamp(2.5rem, 7vw, 3rem);

        @media (max-width: 500px) {
            line-height: 1;
            font-size: 3.25rem;
        }
    }
}

a {
    background: none;
    border: none;
    font-size: 18px;
    font-weight: 300;
    line-height: 28px;
    text-decoration: underline;
    transition: color 0.15s;
    color: var(--pain-2);
    padding-left: 0.3rem;
    
    &:hover {
        cursor: pointer;
        color: var(--text-color);
    }
}
</style>