<template>
    <button class="factor panel" :class="{ expanded: isExpanded, mounted: isMounted }" @click.prevent="handleClick">
        <Transition name="fade">
            <div class="content loaded" v-if="isMounted">
                <div class="wrapper labels">
                    <div class="icons">
                        <svg v-if="factorName === 'psychological distress'" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M491.23-354.31q61.69 0 106.77-40.38 45.08-40.39 45.08-97.18 0-49.51-32.08-84.78t-77.74-35.27q-39.99 0-68.24 26.34-28.25 26.35-28.25 62.58 0 17.69 6.47 32.33 6.47 14.63 18.45 27.21l37.92-36.39q-5.42-4.53-8.13-10.57-2.71-6.04-2.71-12.11 0-14.01 12.34-25.7 12.35-11.69 32.2-11.69 22.54 0 39.96 19.33t17.42 48.67q0 34.15-29.07 59.69-29.08 25.54-70.15 25.54-49.62 0-86.09-41.5-36.46-41.5-36.46-99.66 0-30.76 11.7-59.07 11.69-28.31 34.46-51.08l-37.16-35.77q-29.3 29.69-45.15 67.23-15.85 37.54-15.85 78.69 0 79.93 50.62 136.73 50.61 56.81 123.69 56.81ZM284-116v-164.23q-57-48-88.5-113.26T164-529.38q0-131.13 92.52-222.87Q349.05-844 481-844q100.54 0 182.92 54.66 82.39 54.65 108.85 141.73L833.38-445q4.62 15.56-4.73 28.28Q819.31-404 803.23-404H748v127.69q0 26.62-18.84 45.47Q710.31-212 683.69-212H580v96h-52v-148h155.69q5.39 0 8.85-3.46t3.46-8.85V-456h80l-52-173q-22-72.38-89.88-117.69Q566.23-792 481-792q-111 0-188 76.82t-77 186.56q0 58.93 25 111.78Q266-364 311-326l25 22v188h-52Zm212-338Z"/></svg>
                        <svg v-if="factorName === 'exercise'" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M562-106v-206.46l-92.15-90.77-33.54 167.69-232.77-47.15 10.15-49.62 181 35.62 57.39-292.23L350-544.54V-442h-52v-137.85l185.77-77.23q4.38-1.69 11.77-3.3Q502.92-662 511-662q24.31 0 43.5 11.15 19.19 11.16 32.04 33.24l14 23q29.61 50.23 67.61 73.88T758-494.77v52q-52-1.92-100.92-28.85-48.93-26.92-85.08-83.69l-28.77 150.39L614-333.38V-106h-52Zm14-596.15q-32.69 0-55.27-22.58-22.58-22.58-22.58-55.27 0-32.69 22.58-55.27 22.58-22.58 55.27-22.58 32.69 0 55.27 22.58 22.58 22.58 22.58 55.27 0 32.69-22.58 55.27-22.58 22.58-55.27 22.58Z"/></svg>
                        <svg v-if="factorName === 'sleep'" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M483.11-116q-76.3 0-143.05-28.93-66.76-28.93-116.48-78.65-49.72-49.72-78.65-116.48Q116-406.81 116-483.11q0-125.27 75.12-223.93 75.11-98.65 198.19-129.65-10.08 96.31 20.34 181.27 30.43 84.96 97.12 151.65 64.69 64.69 151.65 94.62 86.96 29.92 178.27 19.84-29.38 121.08-128.85 197.19Q608.38-116 483.11-116Zm-.11-52q88 0 164-45t115-122.11q-83-5.01-158.5-39.56Q528-409.22 469-468.3q-60-60.08-94-134.89Q341-678 335-762q-77 41-122 116.18-45 75.19-45 162.82 0 131.25 91.88 223.12Q351.75-168 483-168Zm-14-300.38Z"/></svg>
                        <svg v-if="factorName === 'nutrition'" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M648-116q-81.54 0-138.77-57.23Q452-230.46 452-312q0-81.54 57.23-138.77Q566.46-508 648-508q81.54 0 138.77 57.23Q844-393.54 844-312q0 81.54-57.23 138.77Q729.54-116 648-116Zm0-52q60 0 102-42t42-102q0-60-42-102t-102-42q-60 0-102 42t-42 102q0 60 42 102t102 42Zm-467.69 4q-27.01 0-45.66-18.65Q116-201.3 116-228.31v-272.38q0-13 3.02-26.16 3.02-13.15 7.52-25.15l91.62-223.69h-25.08q-13.38 0-21.61-8.24-8.24-8.23-8.24-21.61v-8.61q0-13.38 8.24-21.61 8.23-8.24 21.61-8.24h237.84q13.38 0 21.61 8.24 8.24 8.23 8.24 21.61v8.61q0 13.38-8.24 21.61-8.23 8.24-21.61 8.24h-25.08l97.93 238.92q-11.62 5.31-21.69 14-10.08 8.69-20.62 18.62L350.38-775.69h-75.76L168-515.15v286.84q0 5.39 3.46 8.85t8.85 3.46h217.46q3.85 15 12.73 26.81 8.89 11.8 15.42 25.19H180.31ZM624-563.69q-32.24-3.46-54.12-27.2Q548-614.63 548-647.93t21.88-57.26q21.88-23.96 54.12-27.42v168.92q3.46-32.24 27.26-54.12 23.8-21.88 57.2-21.88 33.4 0 57.2 21.88 23.8 21.88 27.26 54.12H624Z"/></svg>
                        <svg v-if="factorName === 'social connection'" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="m309.85-754.69-33.16-102.08 56.46-19.54 34.16 102.46-57.46 19.16Zm140.3-43.46v-107.7h59.7v107.7h-59.7Zm199 42.46-56.46-18.16 34.16-102.46 56.46 18.16-34.16 102.46ZM109.85-58.62 102.92-110l195.8-29.56q13.23-2.28 23.06-10.47 9.84-8.2 13.22-20.89l37.62-117q5.15-16.85-2.58-32.7-7.73-15.84-23.58-24l-35.31 112.93L261-247.92l94.61-296.46q3.24-10.47 1.51-19.43-1.73-8.96-8.63-14.96L211.39-296q-12.47 25.69-36.15 40.65-23.69 14.97-52.01 14.97h-51v-52h51q13.7 0 24.13-6.91 10.44-6.91 16.72-18.48l167.61-348.77 47.77 40q20.62 18.31 26.85 45.31 6.23 27-1.85 53.23l-42.54 133.62q41.16 21.84 55.93 55 14.77 33.15 3.92 67.3l-37 117q-7.85 26.69-29.42 44.58-21.58 17.88-49.5 22.5l-196 29.38Zm740.3.39-196-29.39q-27.92-4.61-49.5-22.5-21.57-17.88-29.42-44.57l-37-117q-10.85-34.16 3.92-67.31 14.77-33.15 55.93-55l-42.54-133.62q-8.08-26.23-1.85-53.23 6.23-27 26.85-45.3l47.77-40 167.61 348.77q6.26 11.56 16.67 18.47 10.4 6.91 24.18 6.91h51v52h-51q-28.31 0-52-14.96t-36.16-40.65l-137.1-282.78q-6.9 6-8.63 14.97-1.73 8.96 1.51 19.42L699-247.54l-50.15 16.23-35.31-112.92q-15.85 8.15-23.58 24-7.73 15.85-2.58 32.69l37.62 117q3.38 12.69 13.31 21.01 9.92 8.31 22.77 10.53l196 29.39-6.93 51.38ZM261-247.92Zm438 .38Zm-50.15 16.23L598.08-394l50.77 162.69ZM361.92-394.38l-50.77 162.69 50.77-162.69Z"/></svg>
                    </div>
                    <h3 class="factor-title">{{ factorName }}</h3>
                </div>
                <span class="status indicator" :class="getFactorColor()"></span>
            </div>
        </Transition>
        <Transition name="expand">
            <div class="more" :class="{ active: isExpanded}" >
                <p>
                    <span>{{ factorName }}</span>
                    is responsible for 45% of the change in your pain levels.
                </p>
                <p>
                    There is a strong positive correlation, indicating that higher psychological distress is associated with higher pain levels.
                </p>
            </div>
        </Transition>
        <Transition name="fade">
            <div class="content unloaded" v-if="!isMounted">
                <div class="wrapper labels">
                    <div class="icons">
                        <div></div>
                    </div>
                </div>
                <div class="wrapper info">
                    <div class="group text unloaded"><span class="factor-title" :style="{ width: factorWidthStyle }"></span></div>
                    <span class="status indicator"></span>
                </div>
            </div> 
        </Transition>
    </button>
</template>

<script setup lang="ts">
import type { PainFactor, PainFactorID } from '@/types/painFactor';

import debounce from '@/utils/debounce';

const { factorsExpanded, isFactorExpanded } = useFactorsExpanded();
const isExpanded = computed(() => isFactorExpanded(props.factorID));
const factorWidthStyle = ref(`${Math.floor(Math.random() * 42) + 24}%`);

interface Props {
    factorID: PainFactorID,
    factorName: PainFactor,
    factorValue: number,
    isMounted: boolean
}

const props = defineProps<Props>();
const emit = defineEmits(['factorClicked']);


function getFactorColor(): string {
    if (props.factorValue >= 0 && props.factorValue <= 2) {
        return 'pain-0';
    } else if (props.factorValue > 2 && props.factorValue <= 4) {
        return 'pain-1';
    } else if (props.factorValue > 4 && props.factorValue <= 6) {
        return 'pain-2';
    } else {
        return 'pain-3';
    }
}

const isMounted = ref(false);

const handleClick = debounce(() => {
    emit('factorClicked', props.factorID);
}, 100);

onMounted(() => {
    isMounted.value = true;
});
</script>

<style lang="css" scoped>
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
}

.fade-enter, .fade-leave-to {
    opacity: 0;
}

/* .expand-enter-active,
.expand-leave-active {
    opacity: 1;
    transform: translateY(0);
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  overflow: hidden;
} */
</style>

<!-- Unloaded Factors -->
<style lang="css" scoped>
.content.unloaded {
    position: absolute;
    width: 100%;
}

.content.unloaded .status.indicator {
    background-color: var(--pain-none);
    opacity: 0.2;
    height: 100%;
}

.content.unloaded .icons div {
    background-color: var(--pain-none);
    opacity: 0.2;
    border-radius: 50%;
}

.content.unloaded .factor-title {
    height: 0.8rem;
    background-color: var(--pain-none);
    opacity: 0.2;
    border-radius: 6px;
}

.content.unloaded .status.indicator {
    background-color: var(--pain-none);
    opacity: 0.2;
    right: 0;
}

.content.unloaded .wrapper.info {
    flex: 1;
    display: flex;
    flex-direction: row;
    padding: 0rem;
}

.content.unloaded .wrapper.labels {
    padding-right: 0rem;
}

.group.text.unloaded {
    display: flex;
    box-sizing: border-box;
    align-items: center;

    flex: 1;
}
</style>

<style lang="css" scoped>
.factor {
    display: flex;
    flex-direction: column;
    position: relative;
    cursor: pointer;
    transition: height 0.5s ease;
    min-height: 66.75px;
    will-change: height, transform;
}

.factor.expanded {
    z-index: 90;
}

button.factor.panel {
    padding: 0px;
    background-color: var(--panel);
    overflow: hidden;
    cursor: default;
    pointer-events: none;
    border: none;
}

button.factor.panel.mounted {
    cursor: pointer;
    pointer-events: all;
}

h3.factor-title {
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    font-weight: 300;
    color: var(--text-color);
    font-size: var(--font-size-14);
    text-transform: capitalize;
}

.content {
    display: flex;
    flex-direction: row;
    flex: 1;
    justify-content: space-between;
    height: 4rem;
}

.wrapper {
    padding: 24px 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.icons {
    display: flex;
    align-items: center;
    justify-content: center;
}

.icons > svg, .icons > div {
    height: var(--font-size-18);
    width: var(--font-size-18);
    fill: var(--text-color);
    margin-right: 1rem;
}

.status {
    position: absolute;
    right: 0px;
    height: 100%;
    width: 1rem;
    background-color: var(--pain-none);
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
}

.status.pain-0 {
    background-color: var(--pain-0);
}

.status.pain-1 {
    background-color: var(--pain-1);
}

.status.pain-2 {
    background-color: var(--pain-2);
}

.status.pain-3 {
    background-color: var(--pain-3);
}

.more {
    height: 0;
    opacity: 0;
    padding: 0px 16px;
    padding-right: 32px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    will-change: transform, height, opacity;
    transition: height 0.4s cubic-bezier(0.075, 0.82, 0.165, 1), opacity 0.2s ease;
}

.more.active {
    height: 120px;
    padding: 24px 16px;
    padding-top: 8px;
    padding-right: 32px;
    opacity: 1;
    transition: height 0.1s cubic-bezier(0.075, 0.82, 0.165, 1), opacity 0.5s ease;
}

.more p {
    color: var(--text-color);
    font-family: 'Inter', sans-serif;
    font-size: var(--font-size-14);
    font-weight: 300;
    text-align: left;
    opacity: 0.7;

    span {
        text-transform: capitalize;
    }
}
</style>