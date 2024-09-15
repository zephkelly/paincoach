<template>
    <section>
        <div class="container section">
            <blockquote>
                <p class="quote">
                    "{{ props.quote }}"
                </p>
                <p class="author">
                    <strong>{{ props.by }}</strong>
                    <img :src="props.pic" :alt="`Profile photo of ${props.author}`" />
                </p>
            </blockquote>
        </div>
    </section>
</template>

<script setup lang="ts">
const props = defineProps<{
    quote: string;
    by: string;
    author: string;
    pic: string;
}>();
</script>

<style lang="scss" scoped>
section {
    padding: 0rem 1rem;

    blockquote {
        padding: 0rem clamp(1.5rem, 8vw, 2.5rem);

        @media (max-width: 500px) {
            padding: 0rem 0.5rem;
            margin-top: 4rem;
            margin-bottom: 2rem;
        }

        p {
            font-family: 'NotoSerif', serif;
            opacity: 0.7;
            
            &.quote {
                font-size: 1.4rem;
                line-height: 48px;
                margin-bottom: 2rem;
                font-style: oblique 8deg;
                font-weight: 700;
                text-align: center;

            }

            &.author {
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 1.2rem;

                strong {
                    text-align: right;
                }
                
                img {
                    width: 52px;
                    height: 52px;
                    border-radius: 50%;
                    margin-left: 1rem;
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