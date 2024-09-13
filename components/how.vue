<template>
    <section>
        <h2>How it works in <span>three</span> steps:</h2>
        <ol class="steps-list">
            <li>
                <div class="wrapper">
                    <ScrollToReveal>
                        <h3>Log your day</h3>
                    </ScrollToReveal>
                </div>
                <div class="wrapper body">
                    <p class="subtitle">Make a record of your day by answering a few simple questions</p>
                    <div class="illustration-container">
                        <div class="illustration-top-fade"></div>
                        <AnimatedSurvey />
                    </div>
                </div>
            </li>
            <li>
                <ScrollToReveal>
                    <h3>Pain Coach learns</h3>
                </ScrollToReveal>
                <p>The algorithm learns about your lifestyle, becoming more accurate with longer use</p>
            </li>
            <li>
                <ScrollToReveal>
                    <h3>Find your insights</h3>
                </ScrollToReveal>
                <p>You get a personalised profile highlighting what is contributing to your pain</p>
            </li>
        </ol>
    </section>
</template>

<script lang="ts" setup>
import scrollToReveal from '~/components/scrollToReveal.vue';
</script>

<style lang="scss" scoped>
section {
    padding: 1rem;
    
    h2 {
        span {
            font-family: 'NotoSerif', serif;
            font-weight: 900;
            font-style: oblique 6deg;
        }
    }

    .steps-list {
        list-style-type: none;
        counter-reset: step-counter;
        padding-left: 0;
        margin-top: 1.5rem;

        li {
            position: relative;
            display: flex;
            flex-direction: column;
            min-height: 400px;
            margin-bottom: 1rem;

            .wrapper {
                position: relative;
                z-index: 4;   
            }

            .wrapper.body {
                z-index: 2;
            }

            .wrapper.body {
                display: flex;
                flex-direction: column;
                height: 100%;
                width: 100%;

                p.subtitle {
                    height: 56px;
                    z-index: 3;
                }
            }

            h3 {
                font-family: 'NotoSerif', 'Geist', serif;
                padding-left: 3.2rem;
                font-weight: 900;

                &::before {
                    content: counter(step-counter) ".";
                    counter-increment: step-counter;
                    font-style: oblique 6deg;
                    position: absolute;
                    left: 0;
                    top: -4px;
                    font-weight: 600;
                    font-size: 2.3rem;
                    font-family: inherit;
                }
            }
        }
    }
}

.illustration-top-fade {
    position: absolute;
    top: -3rem;
    left: 0;
    height: 200px;
    width: 100%;
    background: linear-gradient(0deg, rgba(255, 255, 255, 0) 10%, var(--background) 85%);
    z-index: 2;
    pointer-events: none;
    user-select: none;
    display: none;

    @media (prefers-color-scheme: light) {
        height: 200px;
        background: linear-gradient(0deg, rgba(0, 0, 0, 0) 20%, var(--background) 85%);
        // background: linear-gradient(0deg, rgba(0, 0, 0, 0) 75%, var(--background) 85%); // transition to this
    }
}

.illustration-container {
    position: relative;
    height: auto;
    padding: 0rem 0.5rem;
    width: auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
    z-index: 1;
}
</style>