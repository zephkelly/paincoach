<template>
    <div class="survey">
        <div class="questions">
            <div class="row">
                <div class="timeline">
                    <div class="circle"></div>
                    <div class="line straight"></div>
                </div>
                <div class="content psych">
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
                <div class="content sleep">
                    <svg class="factor-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M484-80q-84 0-157.5-32t-128-86.5Q144-253 112-326.5T80-484q0-146 93-257.5T410-880q-18 99 11 193.5T521-521q71 71 165.5 100T880-410q-26 144-138 237T484-80Zm0-80q88 0 163-44t118-121q-86-8-163-43.5T464-465q-61-61-97-138t-43-163q-77 43-120.5 118.5T160-484q0 135 94.5 229.5T484-160Zm-20-305Z"/></svg>
                    <p>Sleep</p>
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
                    <svg class="factor-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M516.41-36.41v-241.68l-78.26-74.5-39.28 172.89-283.17-57.43 17.43-86.94 192 40 62.09-314.43-65.79 25.37v137.2h-87.41v-194.22l162.55-68.72q35.71-15 52.45-19.74 16.74-4.74 30.98-4.74 22.2 0 40.67 11.72 18.48 11.72 30.2 30.43l40.48 64q25.52 41.05 69.9 67.45 44.38 26.4 102.34 26.4v87.42q-66.72 0-124.34-26.55-57.62-26.54-97.1-69.87l-22.08 111.63 83.52 79.52v304.79h-87.18Zm24.07-707.18q-34.68 0-59.25-24.57-24.58-24.58-24.58-59.25 0-34.68 24.58-59.13Q505.8-911 540.48-911q34.67 0 59.13 24.46 24.46 24.45 24.46 59.13 0 34.67-24.46 59.25-24.46 24.57-59.13 24.57Z"/></svg>
                    <p>Exercise</p>
                    <div class="checkbox">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M382-208 122-468l90-90 170 170 366-366 90 90-456 456Z"/></svg>
                    </div>
                </div>
            </div>
        </div>
        <div class="arrow">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m423-480 278 277q22 23 22 55t-23 55q-22 22-54 22t-55-22L299-384q-20-21-30-45.5T259-480q0-27 10-51.5t30-44.5l292-292q23-22 55-22.5t55 22.5q22 22 22 55t-22 55L423-480Z"/></svg>
        </div>
        <div class="calendar">
            
        </div>
    </div>
</template>

<style lang="scss" scoped>
.survey {
    position: relative;
    height: 100%;
    width: 100%;
    overflow-x: hidden;

    .questions {
        position: relative;
        left: -0.8rem;
    }

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
            aspect-ratio: 1/1;
        }

        .content {
            position: relative;
            box-sizing: border-box;
            height: 100%;
            // min-width: 270px;
            width: 100%;
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
                width: 22px;
                min-width: 22px;
                min-height: 22px;
                aspect-ratio: 1/1;
                fill: currentColor;
                margin-right: 0.3rem;
            }

            p {
                font-weight: 500;
                font-size: 0.9rem;
                color: var(--background);
                white-space: nowrap;
                overflow: ellipsis;
                margin-right: 1rem;
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
                margin-left: auto;

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
                height: 100%;
                top: -32px;
            }

            // .content {
            //     left: -14px;
            //     transform: scale(0.9);
            // }
        }

        &:nth-child(2) {
            // .content {
            //     left: -7px;
            //     transform: scale(0.95);
            // }
        }


        .circle {
            position: absolute;
            top: 0;
            right: 0;
            height: 50%;
            width: 50%;
            border-bottom-left-radius: 50%;
            border: 1px solid var(--accent);
            border-right: none;
            border-top: none;
        }

        .line.straight {
            position: absolute;
            top: -64px;
            right: 0;
            height: 150%;
            width: 50%;
            border-left: 1px solid var(--accent);
        }
    }

    .arrow {
        margin: 3rem 0rem;
        display: flex;
        justify-content: center;
        align-items: center;

        svg {
            position: relative;
            height: 32px;
            width: 32px;
            transform: rotate(-90deg);
            animation: floatUpDown 5s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
        }

        @keyframes floatUpDown {
            0%, 100% {
                transform: rotate(-90deg) translateX(3px);
            }
            50% {
                transform: rotate(-90deg) translateX(-3px);
            }
        }
    }
}


</style>