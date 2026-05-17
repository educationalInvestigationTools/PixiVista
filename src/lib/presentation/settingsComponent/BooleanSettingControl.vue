<script setup lang="ts">
const props = defineProps<{
    label: string
    value: boolean
}>()

const emit = defineEmits<{
    (e: 'update:value', value: boolean): void
}>()

function toggleValue() {
    emit('update:value', !props.value)
}
</script>

<template>
    <div class="setting-row">
        <span class="setting-label">{{ props.label }}</span>
        <button
            class="setting-toggle"
            type="button"
            :aria-pressed="props.value"
            @click="toggleValue">
            <span class="setting-toggle__text">{{ props.value ? 'ON' : 'OFF' }}</span>
        </button>
    </div>
</template>

<style scoped>
.setting-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 6px 10px;
    box-sizing: border-box;
    height: var(--ui-setting-row-height, 54px);
    width: max-content;
    background: var(--ui-panel-row-bg);
    border: 1px solid var(--ui-panel-border);
    font-family: var(--ui-font);
}

.setting-label {
    font-size: clamp(12px, 1.5vw, 14px);
    color: var(--ui-text-muted);
    text-transform: uppercase;
    letter-spacing: 1px;
    white-space: nowrap;
}

.setting-toggle {
    min-width: 70px;
    padding: 6px 12px;
    border: 1px solid var(--ui-panel-border);
    background: var(--ui-panel-surface);
    color: var(--ui-text-primary);
    cursor: pointer;
    font-size: clamp(12px, 1.5vw, 14px);
    text-transform: uppercase;
    letter-spacing: 1px;
}

.setting-toggle[aria-pressed="true"] {
    background: var(--ui-text-primary);
    color: var(--ui-text-inverse);
}

.setting-toggle:focus-visible {
    outline: 1px solid var(--ui-focus-color);
    outline-offset: 1px;
}

.setting-toggle__text {
    display: inline-block;
    min-width: 28px;
    text-align: center;
}
</style>
