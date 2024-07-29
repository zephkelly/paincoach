<template>
    <section class="calendar overview panel" :class="currentTimeline" ref="parentContainer">
        <div class="headers wrapper">
            <h2>This <span>{{ currentTimeline }}</span></h2>
            <h3>Aug 11</h3>
        </div>
        <div class="wrapper days">
            <div ref="daysContainer" class="days-grid">
                <OverviewDayIndicator v-for="(day, index) in numberOfDays" 
                    labelType="day" 
                    :dayIndex="index" 
                    :labelContent="dayLabels[index % 7]" 
                    :painLevel="generatedPainLevels[index]" 
                />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
const { currentTimeline, setTimeline } = useOverviewTimeline();

setTimeline('week');

const numberOfDays = ref(7);
const isMounted = ref(false);

onMounted(() => {
    isMounted.value = true;
    generatedPainLevels.value = generatePainLevels(numberOfDays.value);
});

// define our day labels
const dayLabels: DayLabel[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// Rand pain levels
const painLevels: PainLevel[] = [0, 1, 2, 3, 'none'];

const generatedPainLevels = ref<PainLevel[]>([]);

function generatePainLevels(count: number) {
  return Array.from({ length: count }, () => {
    const randomIndex = Math.floor(Math.random() * painLevels.length);
    return painLevels[randomIndex];
  });
}

watch(currentTimeline, () => {
    switch (currentTimeline.value) {
        case 'week':
            numberOfDays.value = 7;
            console.log('Week');
            break;
        case 'fortnight':
            numberOfDays.value = 14;
            console.log('Fortnight');
            break;
        case 'month':
            numberOfDays.value = 30;
            console.log('Month');
            break;
        default:
            numberOfDays.value = 7;
            console.log('Week');
            break;
    }
});
</script>

<style lang="css" scoped>
.calendar {
    max-width: 452px;
    min-width: 268px;
    /* overflow: hidden; */
    transition: height 0.5s ease;
}

.headers.wrapper {
    display: flex;
    justify-content: flex-start;
}

h2 h3 {
    transition: position 0.5s ease;
}

.headers.wrapper > h2 {
    margin-right: 4%;
}

.headers.wrapper > h2 > span {
    text-transform: capitalize;
}

.headers.wrapper > h3 {
    opacity: 0.3;
}

@media (prefers-color-scheme: light) {
    .headers.wrapper > h3 {
        opacity: 0.5;
    }
}

.days-grid {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    grid-auto-columns: minmax(0, 1fr);
    grid-template-rows: 1fr;
    justify-content: space-around;
    gap: 0.5rem 0.5rem;
    margin: 0 auto;
    box-sizing: border-box;
    transition: height 0.5s ease;
}
</style>