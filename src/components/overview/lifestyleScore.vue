<template>
    <section class="lifestyle-score overview panel">
        <div class="headers wrapper">
            <h2>Lifestyle Score</h2>
            <h3><span class="score">{{ lifestyleScore }}</span><span class="divider">/</span>100</h3>
        </div>
        <div class="lifestyle-bar wrapper"
            @mousedown="startDrag"
            @touchstart="startDrag"
            @mousemove="onDrag"
            @touchmove="onDrag"
            @mouseup="endDrag"
            @mouseleave="endDrag"
            @touchend="endDrag"
        >
            <Transition name="grow">
                <div v-if="isMounted" class="lifestyle-bar-inner" :style="{ width: `${stretchedScore}%` }"></div>
            </Transition>
        </div>
    </section>
</template>

<script setup lang="ts">
interface Props {
    lifestyleScore: number
}

const props = defineProps<Props>();

const isMounted = ref(false);
const isDragging = ref(false);
const stretchAmount = ref(0);
const maxStretch = 2; // Maximum stretch amount in either direction
const displayScore = computed(() => Math.round(props.lifestyleScore + stretchAmount.value));
const stretchedScore = computed(() => Math.max(0, Math.min(props.lifestyleScore + stretchAmount.value, 100)));

const startDrag = (event: MouseEvent | TouchEvent) => {
    isDragging.value = true;
    event.preventDefault();
};

const onDrag = (event: MouseEvent | TouchEvent) => {
    if (!isDragging.value) return;
    
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const rawPercentage = ((clientX - rect.left) / rect.width) * 100;

    // Calculate the raw stretch amount (positive for stretching, negative for shrinking)
    const rawStretch = rawPercentage - props.lifestyleScore;

    // Apply a non-linear function to slow down the stretch/shrink as it approaches the limit
    const normalizedStretch = rawStretch / maxStretch;
    const slowedStretch = maxStretch * Math.tanh(normalizedStretch);

    stretchAmount.value = Math.max(-maxStretch, Math.min(slowedStretch, maxStretch));
};

const endDrag = () => {
    isDragging.value = false;
    stretchAmount.value = 0;
};

onMounted(() => {
    isMounted.value = true;
});
</script>

<style lang="css" scoped>
.headers.wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.headers.wrapper > h3 {
    font-size: var(--font-size-14);
    font-weight: 400;
    color: var(--text-color);
}

h3 > span.score {
    background-image: linear-gradient(45deg, var(--lifestyle-1), var(--lifestyle-2), var(--lifestyle-3));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
    margin-right: 2px;
    font-weight: 500;
    /* position: relative;
    bottom: 0px; */
    
}

h3 > span.divider {
    margin-right: 1px;
    
}

.lifestyle-bar.wrapper {
    height: 2rem;
    width: 100%;
    background-color: var(--background-color);
    border-radius: 8px;
    cursor: pointer;
    user-select: none;
    touch-action: none;
}

.lifestyle-bar-inner {
    height: 2rem;
    background-color: var(--panel);
    border-radius: 8px;
    background-image: linear-gradient(45deg, var(--lifestyle-2), var(--lifestyle-3), var(--lifestyle-1));
    transition: width 0.5s ease-out;
}
</style>

<style lang="css" scoped>
.grow-enter-active,
.grow-leave-active {
  transition: width 1s ease;
}

.grow-enter-from,
.grow-leave-to {
  width: 0 !important;
}
</style>