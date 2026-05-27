<script setup lang="ts">
const props = defineProps<{
    label: string
}>()
</script>

<template>
    <div class="setting-row">
        <div class="setting-label-area">
            <span v-if="props.label" class="setting-label">{{ props.label }}</span>
        </div>
        <div class="setting-control-area">
            <slot />
        </div>
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

.setting-label-area {
    display: flex;
    align-items: center;
    gap: 8px;
}

.setting-control-area {
    display: flex;
    align-items: center;
}

.setting-label {
    font-size: clamp(12px, 1.5vw, 14px);
    color: var(--ui-text-muted);
    text-transform: uppercase;
    letter-spacing: 1px;
    white-space: nowrap;
}
</style>
