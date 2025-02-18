<template>
    <section>
        <div class="container section">
            <ScrollToReveal>
                <h2 tabindex="0">How it Works in <span class="complex-shimmer" data-text="Three">Three</span> Steps:</h2>
            </ScrollToReveal>
            <ol class="steps-list">
                <li>
                    <div class="wrapper">
                        <ScrollToReveal>
                            <h3 tabindex="0">Log your day</h3>
                            <p tabindex="0" class="subtitle">Make a record of your day by answering a few simple questions</p>
                        </ScrollToReveal>
                    </div>
                    <div class="wrapper body">
                        <div class="record-container">
                            <IphoneMockup tabindex="-1" halfScreen fullWidth :src="recordDarkMockup" class="dark record" loading="lazy" alt="The 'Record' page of the mobile application. A short daily survey which asks questions like 'What would you rate your pain today?'."/>
                            <IphoneMockup tabindex="-1" halfScreen fullWidth :src="calendarDarkMockup" class="dark calendar" loading="lazy" alt="The 'Calendar' page of the mobile application. A colorful calendar displaying a visual record of the users pain over a month, click on a day to see more information." />
                            <IphoneMockup tabindex="-1" halfScreen fullWidth :src="recordLightMockup" class="light record" loading="lazy" alt="The 'Record' page of the mobile application. A short daily survey which asks questions like 'What would you rate your pain today?'."/>
                            <IphoneMockup tabindex="-1" halfScreen fullWidth :src="calendarLightMockup" class="light calendar" loading="lazy" alt="The 'Calendar' page of the mobile application. A colorful calendar displaying a visual record of the users pain over a month, click on a day to see more information."/>
                        </div>
                    </div>
                </li>
                <li>
                    <ScrollToReveal>
                        <h3 tabindex="0">Pain Coach learns</h3>
                        <p tabindex="0" class="subtitle">The algorithm learns how your lifestyle impacts your pain</p>
                    </ScrollToReveal>
                    <div class="wrapper body">
                        <div tabindex="-1" class="learn-container">
                            <div class="fade"/>
                            <AnimatedFactors tabindex="-1" />
                        </div>
                    </div>
                </li>
                <li>
                    <ScrollToReveal>
                        <h3 tabindex="0">You find insights</h3>
                        <p tabindex="0" class="subtitle">You get a personalised and exportable profile highlighting what is contributing to your pain</p>
                    </ScrollToReveal>
                    <div class="wrapper body">
                        <div class="insights-container">
                            <IphoneMockup tabindex="-1" halfScreen fullWidth :src="insightsDarkMockup" class="dark insight" loading="lazy" alt="Another closeup of the Insights page. Various diagrams and charts give an overview of a users pain and pain factors."/>
                            <IphoneMockup tabindex="-1" halfScreen fullWidth :src="insightsLightMockup" class="light insight" loading="lazy" alt="Another closeup view of the Insights page. The graphics fade to white as they reach the top of the screen, revealing more detailed charts like 'Sleep quality over time'."/>
                        </div>
                    </div>
                </li>
            </ol>
        </div>
    </section>
</template>

<script lang="ts" setup>
import AnimatedFactors from './animatedFactors.vue';
import IphoneMockup from '../iphoneMockup.vue';

import recordDarkMockup from '~/assets/images/mockup/record-dark.webp';
import recordLightMockup from '~/assets/images/mockup/record-light.webp';

import calendarDarkMockup from '~/assets/images/mockup/calendar-singular-dark.webp';
import calendarLightMockup from '~/assets/images/mockup/calendar-singular-light.webp';

import insightsDarkMockup from '~/assets/images/mockup/insights-dark.webp';
import insightsLightMockup from '~/assets/images/mockup/insights-light.webp';
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
            margin-bottom: 7rem;

            &:last-child {
                margin-bottom: 0;
            }

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
                    top: -1px;
                    font-weight: 900;
                    font-size: 2rem;
                    font-family: inherit;
                }
            }
        }
    }

    p.subtitle {
        min-height: 56px;
        z-index: 3;
        // margin-bottom: 1rem;
    }
}

.record-container {
    position: relative;
    height: 400px;
    // padding: 0rem 1rem;
    width: auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
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

:deep(.record-container) {
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

@media (max-width: 768px) {
    :deep(.record-container) {
        .dark.calendar {
            display: none;
            .fade {
                border-bottom-left-radius: 0px;
            }
        }

        .dark.record {
            .fade {
                border-bottom-right-radius: 8px;
            }
        }

        .light.calendar {
            display: none;
        }

        .light.record {
            border-bottom-right-radius: 8px;

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

.learn-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400px;
    margin-top: 2rem;
    padding: 0rem clamp(0.5rem, 6vw, 4rem);

    .fade {
        position: absolute;
        width: 100%;
        height: 100%;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, var(--text-color) 100%);
        opacity: 0.3;
        border-radius: 8px;
        z-index: 1;
    }
}

:deep(.insights-container) {
    .dark {
        .fade {
            border-bottom-right-radius: 0px;
        }
    }

    .light {
        .fade {
            border-bottom-left-radius: 0px;
        }
    }

    @media (max-width: 768px) {
       @media (prefers-color-scheme: dark) {
            .dark {
                display: none;

                .fade {
                    border-bottom-right-radius: 8px;
                }
            }

            .light {
                .fade {
                    border-bottom-left-radius: 8px;
                }
            }
        }

        @media (prefers-color-scheme: light) {
            .light {
                display: none;
            }

            .dark {
                .fade {
                    border-bottom-right-radius: 8px;
                }
            }
        }
    } 
}

// :deep(.insights-container) {
// }

.insights-container {
    position: relative;
    height: 400px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
    z-index: 1;
}

</style>