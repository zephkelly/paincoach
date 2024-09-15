<template>
    <section>
        <div class="container section">
            <blockquote>
                <p class="quote">
                    "{{ props.quote }}"
                </p>
                <p class="author">
                    <strong>{{ props.author }}</strong>
                </p>
            </blockquote>
        </div>
    </section>
</template>

<script setup lang="ts">
const props = defineProps<{
    quote: string;
    author: string;
}>();
</script>

<style lang="scss" scoped>
section {
    padding: 0rem 1rem;

    blockquote {
        padding: 0rem clamp(1.5rem, 8vw, 4rem);

        p {
            font-family: 'NotoSerif', serif;
            opacity: 0.7;
            
            &.quote {
                font-size: 1.4rem;
                line-height: 48px;
                margin-bottom: 2rem;
                font-style: oblique 8deg;
                font-weight: 700;
                text-align: center
            }

            &.author {
                font-size: 1.2rem;
                padding-right: clamp(2rem, 6vw, 4rem);
                // font-family: 'Geist', 'NotoSerif', sans-serif;\
        
                @media (max-width: 500px) {
                    padding-right: 0rem;
                }
            }

            &:last-child {
                display: flex;
                justify-content: flex-end;
            }
        }
    }
}
</style>