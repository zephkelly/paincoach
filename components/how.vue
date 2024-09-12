<template>
    <section>
        <h2>How it works in <span>three</span> simple steps:</h2>
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
                        <div class="survey">
                            <div class="row 1">
                                <div class="timeline">
                                    <div class="circle"></div>
                                    <div class="line straight"></div>
                                </div>
                                <div class="content">
                                    <svg class="factor-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M491-339q70 0 119-45t49-109q0-57-36.5-96.5T534-629q-47 0-79.5 30T422-525q0 19 7.5 37t21.5 33l57-57q-3-2-4.5-5t-1.5-7q0-11 9-17.5t23-6.5q20 0 33 16.5t13 39.5q0 31-25.5 52.5T492-418q-47 0-79.5-38T380-549q0-29 11-55.5t31-46.5l-57-57q-32 31-49 72t-17 86q0 88 56 149.5T491-339ZM240-80v-172q-57-52-88.5-121.5T120-520q0-150 105-255t255-105q125 0 221.5 73.5T827-615l52 205q5 19-7 34.5T840-360h-80v120q0 33-23.5 56.5T680-160h-80v80h-80v-160h160v-200h108l-38-155q-23-91-98-148t-172-57q-116 0-198 81t-82 197q0 60 24.5 114t69.5 96l26 24v208h-80Zm254-360Z"/></svg>
                                    <p>Psychological Distress</p>
                                    <div class="checkbox">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M382-208 122-468l90-90 170 170 366-366 90 90-456 456Z"/></svg>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="timeline">
                                    <div class="circle"></div>
                                    <div class="line straight"></div>
                                </div>
                                <div class="content">
                                    <svg class="factor-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M491-339q70 0 119-45t49-109q0-57-36.5-96.5T534-629q-47 0-79.5 30T422-525q0 19 7.5 37t21.5 33l57-57q-3-2-4.5-5t-1.5-7q0-11 9-17.5t23-6.5q20 0 33 16.5t13 39.5q0 31-25.5 52.5T492-418q-47 0-79.5-38T380-549q0-29 11-55.5t31-46.5l-57-57q-32 31-49 72t-17 86q0 88 56 149.5T491-339ZM240-80v-172q-57-52-88.5-121.5T120-520q0-150 105-255t255-105q125 0 221.5 73.5T827-615l52 205q5 19-7 34.5T840-360h-80v120q0 33-23.5 56.5T680-160h-80v80h-80v-160h160v-200h108l-38-155q-23-91-98-148t-172-57q-116 0-198 81t-82 197q0 60 24.5 114t69.5 96l26 24v208h-80Zm254-360Z"/></svg>
                                    <p>Psychological Distress</p>
                                    <div class="checkbox">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M382-208 122-468l90-90 170 170 366-366 90 90-456 456Z"/></svg>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="line">

                                </div>
                            </div>
                            <div class="row">
                                <div class="line">

                                </div>
                            </div>
                            <div class="row">
                                <div class="line">

                                </div>
                            </div>
                        </div>
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
        
            h3 {
                font-family: 'NotoSerif', 'Geist', serif;
                font-weight: 900;
                margin-top: 0;
                padding-left: 3.2rem;
                
                &::before {
                    font-family: 'Geist', serif;
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

            .wrapper.body {
                position: relative;
                display: flex;
                flex-direction: column;
                height: 100%;
                width: 100%;

                p.subtitle {
                    height: 56px;
                    z-index: 10;
                }
            }
        }
    }
}

.illustration-top-fade {
    position: absolute;
    top: -16%;
    left: 0;
    height: 180px;
    width: 100%;
    background: linear-gradient(0deg, rgba(255, 255, 255, 0) 0%, var(--background) 100%);
    z-index: 2;
    pointer-events: none;
    user-select: none;
}

.illustration-container {
    position: relative;
    height: 200px;
    width: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
    z-idex: 1;

    .survey {
        margin-left: 2rem;
        height: 100%;
        width: 100%;

        .row {
            display: flex;
            flex-direction: row;
            align-items: center;
            height: 50px;
            width: 100%;
            border-radius: 10px;
            margin-bottom: 1.5rem;

            .timeline {
                position: relative;
                height: 100%;
                width: 10%;
                // margin-right: 1rem;
            }

            .content {
                position: relative;
                box-sizing: border-box;
                height: 100%;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                font-weight: 600;
                letter-spacing: 0.5px;
                background-color: var(--text-color);
                color: var(--background);
                padding: 0.5rem 1rem;
                border-radius: 8px;

                svg.factor-icon {
                    position: relative;
                    left: -4px;
                    top: -1px;
                    height: 22px;
                    width: auto;
                    fill: currentColor;
                    margin-right: 0.3rem;
                }

                p {
                    font-weight: 500;
                    font-size: 0.9rem;
                    margin-right: 1.2rem;
                    color: var(--background);
                }

                .checkbox {
                    position: relative;
                    height: 18px;
                    width: 18px;
                    border-radius: 50%;
                    background-color: var(--completed);
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    svg {
                        position: relative;
                        height: 12px;
                        width: 12px;
                        fill: var(--text-color);
                    }
                }
            }
        }

        .row {
            height: 54px;
            
            &:nth-child(1) {
                .line.straight {
                    height: 120%;
                    top: -16px;
                }

                // .content {
                //     opacity: 0.9;
                //     background-color: var(--accent-hover);

                //     p {
                //         font-size: 0.7rem;
                //     }
                // }
            }


            .circle {
                position: absolute;
                bottom: 0;
                right: 0;
                height: 50%;
                width: 50%;
                border-top-left-radius: 50%;
                border: 1px solid var(--accent);
                border-right: none;
                border-bottom: none;
            }

            .line.straight {
                position: absolute;
                top: -32px;
                right: 0;
                height: 140%;
                width: 50%;
                border-left: 1px solid var(--accent);
            }
        }
    }
}
</style>