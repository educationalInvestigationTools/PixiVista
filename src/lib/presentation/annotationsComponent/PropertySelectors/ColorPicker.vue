<script setup lang="ts">
import type { Color } from '@/presentation/annotationsComponent/objectAnnotationData';


const props = defineProps<{
    color : Color
    label: string
}>()

const emit = defineEmits<{
    (e: 'changeColor', color : Color): void
}>()

function normalizeColor(color : Color) {
    return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(color) ? color : '#ffffff'
}

function changeColor(event: Event) {
    const input = event.target as HTMLInputElement | null
    if (!input) return
    emit('changeColor', input.value)
}

</script>

<template>

    <label class="annotation-node__color" :title="'Pick color for ' + props.label">
        <span class="annotation-node__color-swatch" :style="{ backgroundColor: props.color }"></span>
        <input class="annotation-node__color-input" type="color" :value="normalizeColor(props.color)"
            :aria-label="'Pick color for ' + props.label" @input="changeColor" />
    </label>

</template>

<style scoped>
.annotation-node__color {
    position: relative;
    display: inline-block;
    width: 18px;
    height: 18px;
    border-radius: 3px;
    border: 1px solid var(--ui-panel-border);
    padding: 0;
    background: var(--ui-panel-surface);
    cursor: pointer;
}

.annotation-node__color-swatch {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 2px;
}

.annotation-node__color-input {
    position: absolute;
    inset: 0;
    width: 28px;
    height: 28px;
    padding: 0;
    border: 0;
    opacity: 0;
    cursor: pointer;
}
</style>
