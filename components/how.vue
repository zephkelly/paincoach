<template>
    <section>
        <div class="container section">
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
                            <IphoneMockup halfScreen fullWidth src="/images/mockup/record-dark.png" class="dark record" />
                            <IphoneMockup halfScreen fullWidth src="/images/mockup/calendar-singular-dark.png" class="dark calendar" />
                            <IphoneMockup halfScreen fullWidth src="/images/mockup/record-light.png" class="light record" />
                            <IphoneMockup halfScreen fullWidth src="/images/mockup/calendar-singular-light.png" class="light calendar" />
                        </div>
                    </div>
                </li>
                <li>
                    <ScrollToReveal>
                        <h3>Pain Coach learns</h3>
                    </ScrollToReveal>
                    <p>The algorithm learns about your lifestyle, becoming more accurate with longer use</p>
                    <div class="learn-container">
                        <AnimatedSurvey />
                    </div>
                </li>
                <li>
                    <ScrollToReveal>
                        <h3>You find insights</h3>
                    </ScrollToReveal>
                    <p>You get a personalised profile highlighting what is contributing to your pain</p>
                </li>
            </ol>
        </div>
    </section>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
section {
    padding: 0rem 1rem;
    
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

.illustration-container {
    position: relative;
    height: 400px;
    // padding: 0rem 1rem;
    width: auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
    margin-bottom: 6rem;
    z-index: 1;

    @media (prefers-color-scheme: dark) {
        .dark {
            display: none;
        }
    }

    @media (prefers-color-scheme: light) {
        .light {
            display: none;
        }
    }
}

:deep(.illustration-container) {
    .dark.calendar {
        .fade {
            border-bottom-left-radius: 0px;
        }
    }

    .dark.record {
        .fade {
            border-bottom-right-radius: 0px;
        }
    }

    .light.calendar {
        .fade {
            border-bottom-left-radius: 0px;
        }
    }

    .light.record {
        .fade {
            border-bottom-right-radius: 0px;
        }
    }
}

.learn-container {
    padding: 0rem 4rem;
}

@media (max-width: 768px) {
    :deep(.illustration-container) {
        .dark.calendar {
            .fade {
                border-bottom-left-radius: 0px;
            }
        }

        .dark.record {
            .fade {
                border-bottom-right-radius: 0px;
            }
        }

        .light.calendar {
            display: none;
        }

        .light.record {

            svg {
                top: 0;
                height: 150%;
            }
        }
    }
}

@media (max-width: 470px) {
    .learn-container {
        padding: 0rem clamp(1rem, 5vw, 4rem);
    }
}
</style>