<template>
    <main>
        <h1>Settings</h1>
        <article>
            <div class="setting reminders">
                <div class="label">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M434-301.85 658.15-526l-36.77-36.77L434-375.38l-85.38-85.39L312.85-424 434-301.85ZM480-116q-65.77 0-123.25-24.87-57.48-24.87-100.24-67.64-42.77-42.76-67.64-100.24Q164-366.23 164-432q0-65.77 24.87-123.25 24.87-57.48 67.64-100.24 42.76-42.77 100.24-67.64Q414.23-748 480-748q65.77 0 123.25 24.87 57.48 24.87 100.24 67.64 42.77 42.76 67.64 100.24Q796-497.77 796-432q0 65.77-24.87 123.25-24.87 57.48-67.64 100.24-42.76 42.77-100.24 67.64Q545.77-116 480-116Zm0-316ZM243.15-823.46l37.16 37.15-154.62 154.62-37.15-37.16 154.61-154.61Zm473.7 0 154.61 154.61-37.15 37.16-154.62-154.62 37.16-37.15ZM479.78-168q109.84 0 187.03-76.97T744-431.78q0-109.84-76.97-187.03T480.22-696q-109.84 0-187.03 76.97T216-432.22q0 109.84 76.97 187.03T479.78-168Z"/></svg>
                    <h2>Daily reminders</h2>
                </div>
                <SettingsToggle 
                    :settingKey="'reminders'"
                    :currentValue="getValue('reminder') as boolean"/>
            </div>
            <div class="setting reminder-time">
                <div class="label">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M340.78-401.39q12.91 0 21.87-8.73 8.97-8.74 8.97-21.66 0-12.91-8.74-21.87t-21.66-8.96q-12.91 0-21.87 8.73-8.96 8.74-8.96 21.66 0 12.91 8.73 21.87 8.74 8.96 21.66 8.96Zm139 0q12.91 0 21.87-8.73 8.96-8.74 8.96-21.66 0-12.91-8.73-21.87-8.74-8.96-21.66-8.96-12.91 0-21.87 8.73-8.96 8.74-8.96 21.66 0 12.91 8.73 21.87 8.74 8.96 21.66 8.96Zm139 0q12.91 0 21.87-8.73 8.96-8.74 8.96-21.66 0-12.91-8.73-21.87-8.74-8.96-21.66-8.96-12.91 0-21.87 8.73-8.97 8.74-8.97 21.66 0 12.91 8.74 21.87t21.66 8.96ZM480.02-116q-65.79 0-123.27-24.87-57.48-24.87-100.24-67.64-42.77-42.76-67.64-100.22Q164-366.19 164-431.98q0-65.79 24.87-123.27 24.87-57.48 67.64-100.24 42.76-42.77 100.22-67.64Q414.19-748 479.98-748q65.79 0 123.27 24.87 57.48 24.87 100.24 67.64 42.77 42.76 67.64 100.22Q796-497.81 796-432.02q0 65.79-24.87 123.27-24.87 57.48-67.64 100.24-42.76 42.77-100.22 67.64Q545.81-116 480.02-116ZM480-432ZM243.15-823.46l37.16 37.15-154.62 154.62-37.15-37.16 154.61-154.61Zm473.7 0 154.61 154.61-37.15 37.16-154.62-154.62 37.16-37.15ZM479.78-168q109.84 0 187.03-76.97T744-431.78q0-109.84-76.97-187.03T480.22-696q-109.84 0-187.03 76.97T216-432.22q0 109.84 76.97 187.03T479.78-168Z"/></svg>
                    <h2>Reminder time</h2>
                </div>
                <button class="timebox">
                    <h3>08:00 PM</h3>
                </button>
            </div>
            <div class="setting display-mode">
                <div class="label">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M480.34-116q-75.11 0-141.48-28.42-66.37-28.42-116.18-78.21-49.81-49.79-78.25-116.09Q116-405.01 116-480.39q0-75.38 28.42-141.25t78.21-115.68q49.79-49.81 116.09-78.25Q405.01-844 480.39-844q75.38 0 141.25 28.42t115.68 78.21q49.81 49.79 78.25 115.85Q844-555.45 844-480.34q0 75.11-28.42 141.48-28.42 66.37-78.21 116.18-49.79 49.81-115.85 78.25Q555.45-116 480.34-116ZM506-168.85q119.31-10.53 202.65-98.64Q792-355.6 792-480q0-124.4-82.96-212.12-82.96-87.73-203.04-99.03v622.3Z"/></svg>
                    <h2>Display mode</h2>
                </div>
                <div class="interaction display-mode">
                    <h3>Dark</h3>
                </div>
            </div>
            <div class="setting color-scheme">
                <div class="label">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M479.23-116q-74.77 0-140.92-28.46-66.16-28.46-115.77-78.08-49.62-49.61-78.08-115.96T116-480q0-76.15 28.77-142t79.58-115.65q50.8-49.81 119.04-78.08Q411.62-844 488.77-844q73 0 137.65 25.08 64.66 25.08 112.96 68.81 48.31 43.73 76.46 102.5Q844-588.85 844-521.08q0 84.85-58.73 148.96Q726.54-308 634-308h-66.46q-16.08 0-28.81 11.15Q526-285.69 526-268.46q0 21.54 15 29.04T556-192q0 26.61-21.42 51.31Q513.15-116 479.23-116Zm.77-364Zm-216 26q20.38 0 35.19-14.81Q314-483.62 314-504q0-20.38-14.81-35.19Q284.38-554 264-554q-20.38 0-35.19 14.81Q214-524.38 214-504q0 20.38 14.81 35.19Q243.62-454 264-454Zm120-144q20.38 0 35.19-14.81Q434-627.62 434-648q0-20.38-14.81-35.19Q404.38-698 384-698q-20.38 0-35.19 14.81Q334-668.38 334-648q0 20.38 14.81 35.19Q363.62-598 384-598Zm192 0q20.38 0 35.19-14.81Q626-627.62 626-648q0-20.38-14.81-35.19Q596.38-698 576-698q-20.38 0-35.19 14.81Q526-668.38 526-648q0 20.38 14.81 35.19Q555.62-598 576-598Zm120 144q20.38 0 35.19-14.81Q746-483.62 746-504q0-20.38-14.81-35.19Q716.38-554 696-554q-20.38 0-35.19 14.81Q646-524.38 646-504q0 20.38 14.81 35.19Q675.62-454 696-454ZM479.23-168q11.77 0 18.27-8.31T504-192q0-16-15-26.46t-15-47.69q0-38.77 26.5-66.31T565-360h69q70.62 0 114.31-48.88Q792-457.77 792-521.08q0-115.38-89.08-193.15Q613.85-792 488.77-792q-135.15 0-227.96 91T168-480q0 130 91 221t220.23 91Z"/></svg>
                    <h2>Colour scheme</h2>
                </div>
                <div class="interaction theme">
                    <div></div>
                </div>
            </div>
        </article>
        <article>
            <div class="setting export-csv">
                <div class="label">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M301.08-390.15h58.15v-35.7h-65.84q-2.31 0-4.24-1.92-1.92-1.92-1.92-4.23v-96q0-2.31 1.92-4.23 1.93-1.92 4.24-1.92h65.84v-35.7h-58.15q-20.79 0-35.16 14.38-14.38 14.38-14.38 35.16v80.62q0 20.78 14.38 35.16 14.37 14.38 35.16 14.38Zm116.15 0h82.15q10.59 0 18.07-7.48 7.47-7.48 7.47-18.06v-60.46q0-10.39-7.47-16.81-7.48-6.42-18.07-6.42h-40.3q-2.31 0-4.23-1.93-1.93-1.92-1.93-4.23V-528q0-2.31 1.93-4.23 1.92-1.92 4.23-1.92h65.84v-35.7h-82.15q-10.58 0-18.06 7.48-7.48 7.48-7.48 18.06v60.46q0 10.39 7.48 17.2 7.48 6.8 18.06 6.8h40.31q2.31 0 4.23 1.93 1.92 1.92 1.92 4.23V-432q0 2.31-1.92 4.23-1.92 1.92-4.23 1.92h-65.85v35.7Zm198.77 0h41.85L710-569.85h-38.46l-34.62 119.16-34.61-119.16h-38.46L616-390.15ZM180.31-212q-27.01 0-45.66-18.66Q116-249.32 116-276.35v-407.62q0-27.03 18.65-45.53t45.66-18.5h599.38q27.01 0 45.66 18.66Q844-710.68 844-683.65v407.62q0 27.03-18.65 45.53T779.69-212H180.31Zm0-52h599.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46v-407.38q0-4.62-3.85-8.46-3.84-3.85-8.46-3.85H180.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v407.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85ZM168-264v-432 432Z"/></svg>
                    <h2>Export data to CSV</h2>
                </div>
                <button class="interaction">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M480-344.46 317.23-507.23l37.16-36.38L454-444v-352h52v352l99.61-99.61 37.16 36.38L480-344.46ZM276.03-212q-27.03 0-45.53-18.65T212-276.31v-60.46h52v60.46q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h407.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46v-60.46h52v60.46q0 27.01-18.66 45.66Q710.68-212 683.65-212H276.03Z"/></svg>
                </button>
            </div>
            <div class="setting export-pdf">
                <div class="label">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M353.08-458.31h43.38v-72h28.62q18.47 0 30.93-12.45 12.45-12.46 12.45-30.93v-28.62q0-18.47-12.45-30.93-12.46-12.45-30.93-12.45h-72v187.38Zm43.38-115.38v-28.62h28.62v28.62h-28.62Zm96.77 115.38h70.46q18.48 0 30.93-12.45 12.46-12.46 12.46-30.93v-100.62q0-18.47-12.46-30.93-12.45-12.45-30.93-12.45h-70.46v187.38Zm43.38-43.38v-100.62h27.08v100.62h-27.08Zm99.08 43.38h43.39v-72h55.69v-43.38h-55.69v-28.62h55.69v-43.38h-99.08v187.38ZM314.31-260q-27.01 0-45.66-18.65Q250-297.3 250-324.31v-455.38q0-27.01 18.65-45.66Q287.3-844 314.31-844h455.38q27.01 0 45.66 18.65Q834-806.7 834-779.69v455.38q0 27.01-18.65 45.66Q796.7-260 769.69-260H314.31Zm0-52h455.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46v-455.38q0-4.62-3.85-8.46-3.84-3.85-8.46-3.85H314.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v455.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85Zm-124 176q-27.01 0-45.66-18.65Q126-173.3 126-200.31v-507.38h52v507.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h507.38v52H190.31ZM302-792v480-480Z"/></svg>
                    <h2>Export data to PDF</h2>
                </div>
                <button class="interaction">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M480-344.46 317.23-507.23l37.16-36.38L454-444v-352h52v352l99.61-99.61 37.16 36.38L480-344.46ZM276.03-212q-27.03 0-45.53-18.65T212-276.31v-60.46h52v60.46q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h407.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46v-60.46h52v60.46q0 27.01-18.66 45.66Q710.68-212 683.65-212H276.03Z"/></svg>
                </button>
            </div>
        </article>
    </main>
</template>

<script lang="ts" setup>
import SettingsToggle from '@/components/app/settings/toggle.vue';

const { getValue } = useAppSettings();

definePageMeta({
    layout: 'application',
    title: 'Settings',
    description: 'This is the settings page',
    middleware: 'verify-demo-token'
});
</script>

<style lang="css" scoped>
    main {
        padding: 0rem 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    
    h1 {
        font-family: 'Inter', sans-serif;
        color: var(--text-color);
        font-size: var(--font-size-20);
        text-align: center;
        margin-top: 2rem;
        margin-bottom: 2rem;
    }

    h2, h3 {
        font-family: 'Inter', sans-serif;
        color: var(--text-color);
        font-size: var(--font-size-16);
        text-align: left;
        margin-left: 0.5rem;
        height: 20px;
        line-height: 20px;
    }

    h3 {
        margin-left: 0rem;
    }

    article {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: auto;
        padding: 0rem 1rem;
        background-color: var(--panel);
        border-radius: 16px;
        margin-bottom: 1rem;

        max-width: 482px;
        min-width: 268px;
    }

    article:last-child {
        margin-bottom: 7rem;
    }

    .setting {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        height: 68px;
        border-bottom: 0.5px solid var(--border);
    }

    .setting:last-child {
        border-bottom: none;
    }

    .setting.reminder-time {
        margin-top: 0.5rem;
        padding-bottom: 0.5rem;
    }

    .label {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .label > svg {
        width: var(--font-size-20);
        height: var(--font-size-20);
        fill: var(--text-color-secondary);
    }

    .setting button.timebox {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 12px;
        background-color: var(--background-color);
        border: 1px solid var(--border);
        padding: 0.8rem;
        cursor: pointer;
    }

    .setting button.timebox > h3 {
        height: var(--font-size-16);
        line-height: var(--font-size-16);
        display: flex;
        position: relative;
        top: -1px;
    }

    .display-mode > h3 {
        color: var(--pain-0);
        font-size: var(--font-size-18);
        cursor: pointer;
    }

    .theme > div {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: var(--pain-0);
        border: 2px solid var(--text-color);
        cursor: pointer;
    }

    button.interaction {
        cursor: pointer;
        padding: 0rem;
        background-color: transparent;
        height: 32px;
        width: 32px;
    }

    .setting button {
        border: none;
        background-color: transparent;
    }

    button.interaction > svg {
        width: 32px;
        height: 32px;
        fill: var(--text-color);
    }
</style>