<template>
    <div class="log-card">
        <div class="log-card-header">
            <div class="log-card-icon" v-if="$slots.icon">
                <slot name="icon"/>
            </div>
            <h2>{{ title }}</h2>
        </div>
        <div class="log-card-content">
            <slot name="default">
            </slot>
        </div>
    </div>
</template>

<script setup lang="ts">
type LogCardProps = {
    title: string;
};

const props = defineProps<LogCardProps>();
</script>

<style lang="scss" scoped>
.log-card {
    background-color: var(--panel-color);
    border-radius: 8px;
    padding: clamp(1rem, 6vw, 1.5rem) clamp(1rem, 6vw, 1.5rem);
    width: 100%;
    box-sizing: border-box;
    max-width: 500px;
}

.log-card-header {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 3rem;
}
.log-card-icon {
    margin-right: 16px;
    font-size: 24px;
    color: var(--icon-color);
}
.log-card-header h2 {
    font-size: 1.25rem;
    font-weight: 400;
    letter-spacing: 0.4px;
    margin: 0;
    font-family: var(--inter-font-family);
    color: var(--text-2-color);
    text-wrap: stable;
    text-align: center;
}


</style>