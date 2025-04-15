<template>
    <section class="contribution-chart panel">
        <div class="chart-container" :style="chartContainerStyle">
            <div class="chart" ref="chartContainer" @click="handleChartClick"></div>
            <div class="label wrapper">
                <div v-for="(item, index) in dataMinusUnknown" :key="index" :class="`label label-${index}`" :style="getLabelStyle(item)">
                    <div class="label-content" :style="`background-color: ${item.color}`">
                        <svg v-if="item.id === 'psychological'" class="label-icon psychological" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M479.13-335.04q70 0 119-45t49-109q0-57-36.5-96.5t-88.5-39.5q-47 0-79.5 30t-32.5 74q0 19 7.5 37t21.5 33l57-57q-3-2-4.5-5t-1.5-7q0-11 9-17.5t23-6.5q20 0 33 16.5t13 39.5q0 31-25.5 52.5t-62.5 21.5q-47 0-79.5-38t-32.5-93q0-29 11-55.5t31-46.5l-57-57q-32 31-49 72t-17 86q0 88 56 149.5t136 61.5Zm-256.09 272v-181.61q-56.43-54.26-88.21-126.02-31.79-71.76-31.79-149.33 0-157.07 109.9-267.01 109.89-109.95 266.89-109.95 130.82 0 231.84 77.18 101.03 77.17 131.72 200.82l53.13 210.09q6.7 25.22-9.16 45.52-15.85 20.31-42.27 20.31h-68.13v94q0 44.3-30.85 75.15-30.85 30.85-75.15 30.85h-54v80h-106v-186h160v-200H776.7l-35.18-143.7q-23-87.04-95.74-142.63-72.74-55.59-165.78-55.59-112.25 0-191.6 78.37-79.36 78.36-79.36 190.59 0 57.74 23.66 110.61 23.65 52.87 67.52 92.61l28.82 26.82v228.92h-106ZM492.87-427Z"/></svg>
                        <svg v-if="item.id === 'exercise'" class="label-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M511.52-31.52v-243.96l-70.43-67-38.31 168.65-292.95-59.39 19.39-96.39 192 40L380.7-591l-57.31 21.78v138.83h-97.52v-202.7l168.74-69.69q36.69-15 53.76-20.07 17.06-5.06 31.63-5.06 23.83 0 42.96 12.69 19.13 12.7 31.82 32.39l41.13 64q24.87 39.74 69.09 65.33 44.22 25.59 103.48 25.59v97.52q-67.7 0-125.48-25.24t-97.91-66.28L525.61-421.7l82.87 78.87v311.31h-96.96Zm29.61-716.96q-36.96 0-63-26.04-26.04-26.05-26.04-63 0-36.96 26.04-62.72 26.04-25.76 63-25.76t62.72 25.76q25.76 25.76 25.76 62.72 0 36.95-25.76 63-25.76 26.04-62.72 26.04Z"/></svg>
                        <svg v-if="item.id === 'sleep'" class="label-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M484-68.7q-86.35 0-161.91-32.89-75.55-32.9-131.58-88.92-56.02-56.03-88.92-131.58Q68.7-397.65 68.7-484q0-152.78 98.65-268.24Q266-867.7 415.65-895.26 402.74-794 430.04-697.24q27.31 96.76 98.87 168.33 71.57 71.56 168.05 98.02 96.48 26.45 197.17 17.5-26 149.09-141.67 246.89Q636.78-68.7 484-68.7Zm0-106q77.83 0 145.76-36.65Q697.69-248 740.13-313.7q-81.48-11.39-154.52-46.89-73.05-35.5-131.78-94.24-58.74-58.73-94.74-131.5-36-72.76-46.96-154.23-64.56 43-101 110.87Q174.7-561.83 174.7-484q0 129.35 89.97 219.33Q354.65-174.7 484-174.7Zm-30.17-280.13Z"/></svg>
                        <svg v-if="item.id === 'nutrition'" class="label-icon" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M648-116q-81.54 0-138.77-57.23Q452-230.46 452-312q0-81.54 57.23-138.77Q566.46-508 648-508q81.54 0 138.77 57.23Q844-393.54 844-312q0 81.54-57.23 138.77Q729.54-116 648-116Zm0-52q60 0 102-42t42-102q0-60-42-102t-102-42q-60 0-102 42t-42 102q0 60 42 102t102 42Zm-467.69 4q-27.01 0-45.66-18.65Q116-201.3 116-228.31v-272.38q0-13 3.02-26.16 3.02-13.15 7.52-25.15l91.62-223.69h-25.08q-13.38 0-21.61-8.24-8.24-8.23-8.24-21.61v-8.61q0-13.38 8.24-21.61 8.23-8.24 21.61-8.24h237.84q13.38 0 21.61 8.24 8.24 8.23 8.24 21.61v8.61q0 13.38-8.24 21.61-8.23 8.24-21.61 8.24h-25.08l97.93 238.92q-11.62 5.31-21.69 14-10.08 8.69-20.62 18.62L350.38-775.69h-75.76L168-515.15v286.84q0 5.39 3.46 8.85t8.85 3.46h217.46q3.85 15 12.73 26.81 8.89 11.8 15.42 25.19H180.31ZM624-563.69q-32.24-3.46-54.12-27.2Q548-614.63 548-647.93t21.88-57.26q21.88-23.96 54.12-27.42v168.92q3.46-32.24 27.26-54.12 23.8-21.88 57.2-21.88 33.4 0 57.2 21.88 23.8 21.88 27.26 54.12H624Z"/></svg>
                        <svg v-if="item.id === 'social'" class="label-icon" xmlns="ht://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="m309.85-754.69-33.16-102.08 56.46-19.54 34.16 102.46-57.46 19.16Zm140.3-43.46v-107.7h59.7v107.7h-59.7Zm199 42.46-56.46-18.16 34.16-102.46 56.46 18.16-34.16 102.46ZM109.85-58.62 102.92-110l195.8-29.56q13.23-2.28 23.06-10.47 9.84-8.2 13.22-20.89l37.62-117q5.15-16.85-2.58-32.7-7.73-15.84-23.58-24l-35.31 112.93L261-247.92l94.61-296.46q3.24-10.47 1.51-19.43-1.73-8.96-8.63-14.96L211.39-296q-12.47 25.69-36.15 40.65-23.69 14.97-52.01 14.97h-51v-52h51q13.7 0 24.13-6.91 10.44-6.91 16.72-18.48l167.61-348.77 47.77 40q20.62 18.31 26.85 45.31 6.23 27-1.85 53.23l-42.54 133.62q41.16 21.84 55.93 55 14.77 33.15 3.92 67.3l-37 117q-7.85 26.69-29.42 44.58-21.58 17.88-49.5 22.5l-196 29.38Zm740.3.39-196-29.39q-27.92-4.61-49.5-22.5-21.57-17.88-29.42-44.57l-37-117q-10.85-34.16 3.92-67.31 14.77-33.15 55.93-55l-42.54-133.62q-8.08-26.23-1.85-53.23 6.23-27 26.85-45.3l47.77-40 167.61 348.77q6.26 11.56 16.67 18.47 10.4 6.91 24.18 6.91h51v52h-51q-28.31 0-52-14.96t-36.16-40.65l-137.1-282.78q-6.9 6-8.63 14.97-1.73 8.96 1.51 19.42L699-247.54l-50.15 16.23-35.31-112.92q-15.85 8.15-23.58 24-7.73 15.85-2.58 32.69l37.62 117q3.38 12.69 13.31 21.01 9.92 8.31 22.77 10.53l196 29.39-6.93 51.38ZM261-247.92Zm438 .38Zm-50.15 16.23L598.08-394l50.77 162.69ZM361.92-394.38l-50.77 162.69 50.77-162.69Z"/></svg>
                    </div>
                </div>
            </div>
        </div>
        
    </section>
</template>
  
<script setup>
    import * as d3 from 'd3'
    
    const chartContainer = ref(null);
    const chartShift = ref(0);

    const leftLabels = ref([]);
    const rightLabels = ref([]);
    const labelWidth = 24;
    const leftLabelPadding = 16;
    const rightLabelPadding = 16
    const unevenPaddingAdjustment = 4;
  
    const data = [
        { id: 'psychological', label: 'Psychological Distress', value: 50, color: 'var(--pain-0)' },
        { id: 'exercise', label: 'Exercise', value: 16, color: 'var(--pain-2)' },
        { id: 'sleep', label: 'Sleep', value: 14, color: 'var(--lifestyle-2-color)' },
        { id: 'unknown', label: 'Other', value: 20, color: 'var(--pain-none)' },
    ]

    const dataRanked = computed(() => {
        return data.sort((a, b) => b.value - a.value)
    })

    const dataMinusUnknown = computed(() => {
        return dataRanked.value.filter(d => d.id !== 'unknown')
    });
    
    const chartSize = computed(() => {
        return chartContainer.value ? Math.min(chartContainer.value.clientWidth, chartContainer.value.clientHeight) : 0
    })

    const chartContainerStyle = computed(() => {
        return {
            transform: `translateX(${chartShift.value}px)`,
        }
    })
    

    function createDonutChart(innerRadiusRatio = 0.8) {
        const container = chartContainer.value;
        const width = container.clientWidth;
        const height = container.clientHeight;
        const radius = Math.min(width, height) / 2;

        d3.select(container).selectAll("*").remove();
    
        const pie = d3.pie()
        .sort(null)
        .value(d => d.value)
        .padAngle(0.65)
    
        const arc = d3.arc()
            .innerRadius(radius * innerRadiusRatio)
            .outerRadius(radius)
            .cornerRadius(3)
            .padRadius(4)
    
        const svg = d3.select(chartContainer.value)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2},${height / 2})`)
    
        const arcs = svg.selectAll('arc')
            .data(pie(data))
            .enter()
            .append('g')
            .attr('class', 'arc')
    
        arcs.append('path')
            .attr('d', arc)
            .attr('fill', d => d.data.color);
            
    }

    function getLabelStyle(item) {
        const labelHeight = 24
        
        const containerHeight = chartSize.value - 6;

        let labelList, index, isRight
        if (leftLabels.value.some(l => l.item.id === item.id)) {
            labelList = leftLabels.value
            index = labelList.findIndex(l => l.item.id === item.id)
            isRight = false
        } else {
            labelList = rightLabels.value
            index = labelList.findIndex(l => l.item.id === item.id)
            isRight = true
        }

        const totalLabels = labelList.length
        const availableHeight = containerHeight - (labelHeight * totalLabels)

        let yPosition
        if (totalLabels === 1) {
            yPosition = (containerHeight - labelHeight) / 2
        } else {
            const gap = availableHeight / (totalLabels - 1)
            yPosition = index * (labelHeight + gap)
        }

        let xBias = 0
        const maxBias = 16 // Maximum pixels to bias
        if (index === 0 || index === totalLabels - 1) {
            const biasPercentage = (index === 0) ? 1 - (yPosition / containerHeight) : yPosition / containerHeight
            xBias = maxBias * biasPercentage
        }

        let xPosition
        if (isRight) {
            xPosition = chartSize.value + (rightLabelPadding + unevenPaddingAdjustment) - xBias;
        } else {
            xPosition = -labelWidth - (leftLabelPadding - unevenPaddingAdjustment) + xBias;
        }

        return {
            position: 'absolute',
            left: `${xPosition}px`,
            top: `${yPosition}px`,
            transition: 'transform 0.3s ease-out',
        }
    }

    function calculateLabelPositions() {
        const pieData = d3.pie().value(d => d.value).sort(null)(data)
        const arc = d3.arc()
            .innerRadius(chartSize.value / 2 * 0.8)
            .outerRadius(chartSize.value / 2)

        leftLabels.value = []
        rightLabels.value = []

        dataMinusUnknown.value.forEach((item, index) => {
            const sliceIndex = data.findIndex(d => d.id === item.id)
            const slice = pieData[sliceIndex]
            const centroid = arc.centroid(slice)
            const x = centroid[0] + chartSize.value / 2
            const y = centroid[1] + chartSize.value / 2
            const isRight = x > chartSize.value / 2

            const labelInfo = { item, idealY: y + -10 }

            if (isRight && rightLabels.value.length < 3) {
                rightLabels.value.push(labelInfo)
            } else if (!isRight && leftLabels.value.length < 3) {
                leftLabels.value.push(labelInfo)
            } else {
                if (rightLabels.value.length < leftLabels.value.length) {
                    rightLabels.value.push(labelInfo)
                } else {
                    leftLabels.value.push(labelInfo)
                }
            }
        })

        leftLabels.value.sort((a, b) => a.idealY - b.idealY)
        rightLabels.value.sort((a, b) => a.idealY - b.idealY)

        if (leftLabels.value.length === 0 && rightLabels.value.length > 0) {
            chartShift.value = -((labelWidth + (labelPadding + unevenPaddingAdjustment)) / 2)
        } else if (rightLabels.value.length === 0 && leftLabels.value.length > 0) {
            chartShift.value = ((labelWidth + (labelPadding - unevenPaddingAdjustment)) / 2)
        } else if (rightLabels.value.length === 1 && leftLabels.value.length >= 2) {
            chartShift.value = -(unevenPaddingAdjustment + 3)
        } else {
            chartShift.value = 0
        }
    }

    function handleChartClick() {
        if (!props.animate) return;
        
        // Increase animation intensity temporarily
        animationIntensity.value = 2.0;
        setTimeout(() => {
            animationIntensity.value = 1.0;
        }, 1000);
        
        // Randomize the data values a bit for visual effect
        const newData = data.value.map(item => {
            if (item.id === 'unknown') return item;
            
            // Start or refresh animation for this item
            animatingItems.value[item.id] = true;
            setTimeout(() => {
                animatingItems.value[item.id] = false;
            }, 1000 + Math.random() * 500);
            
            // Calculate a random fluctuation within ±15% of the original value
            const originalItem = originalData.find(d => d.id === item.id);
            const fluctuation = Math.floor(Math.random() * (originalItem.value * 0.15)) * (Math.random() > 0.5 ? 1 : -1);
            
            return {
                ...item,
                value: Math.max(5, Math.round(originalItem.value + fluctuation)) // Ensure value doesn't go below 5%
            };
        });
        
        // Normalize to ensure total equals 100%
        const totalWithoutUnknown = newData.reduce((sum, item) => 
            item.id !== 'unknown' ? sum + item.value : sum, 0);
        
        const unknownItem = newData.find(item => item.id === 'unknown');
        if (unknownItem) {
            unknownItem.value = 100 - totalWithoutUnknown;
        }
        
        data.value = newData;
        updateChart();
    }
    
    function getAnimationStyle(item) {
        if (!props.animate || !animatingItems.value[item.id]) return '';
        
        const randomDelay = Math.random() * 0.3;
        const intensity = animationIntensity.value;
        
        return `
            animation: bounce-${item.id} 0.6s ${randomDelay}s ease-in-out;
            transform-origin: center center;
        `;
    }

    onMounted(() => {
        createDonutChart()
        calculateLabelPositions()
    })

    watch(() => data, () => {
        calculateLabelPositions()
    }, { deep: true })

    watch(chartSize, () => {
        calculateLabelPositions()
    })
</script>
  

<style lang="scss" scoped>
    .headers.wrapper {
        h2 {
            margin-bottom: 0.1rem;
        }
    }

    .contribution-chart {
        font-family: 'Inter', sans-serif;
        width: 100%;
        box-sizing: border-box;
        max-width: 452px;
        min-width: 268px;
    }

    .chart-container {
        position: relative;
        width: 134px;
        height: 134px;
        margin: auto;
    }

    .chart {
        width: 100%;
        height: 100%;
    }

    .label {
        width: 24px;
        height: 24px;

        * {
            box-sizing: border-box;
        }
    }

    .label.wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        .label-content {
            width: 100%;
            height: 100%;
            background-color: var(--background-color);
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 2px 2px;
        }

        .label-percentage {
            
            font-size: var(--font-size-13);
            font-weight: 800;
            color: var(--panel);
        }

        .label-icon {
            fill: var(--panel);
            position: relative;
            height: calc(var(--font-size-14));
            width: var(--font-size-14);
            left: 2px;
            width: 1rem;
            height: 1rem;

            &.psychological {
                left: 1px;
            }
        }
    }

    .factors.wrapper ul {
        display: grid;
        grid-template-columns: 1fr 1fr;
        margin-top: 1.5rem;
        flex-wrap: wrap;
        gap: 0.3rem 1.2rem;
    }

    .factor-secondary-label {
        font-family: 'Inter', sans-serif;
        font-size: var(--font-size-14);
        font-weight: 600;
        color: var(--text-color-inactive);
        text-wrap: nowrap;
         
        .sleep {
            color: var(--pain-1-accessible-text);
        }
        
        .exercise {
            color: var(--pain-2);
        }

        .psychological {
            color: var(--pain-3);
        }
    }
</style>