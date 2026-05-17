<script setup lang="ts">
import SettingRow from './SettingRow.vue';

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
    <SettingRow :label="props.label">
        <button
            class="setting-toggle"
            type="button"
            :aria-pressed="props.value"
            @click="toggleValue">
            <span class="setting-toggle__text">{{ props.value ? 'ON' : 'OFF' }}</span>
        </button>
    </SettingRow>
</template>

<style scoped>
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
